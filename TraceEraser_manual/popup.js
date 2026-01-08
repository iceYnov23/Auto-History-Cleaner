// popup.js - UTF-8编码
document.addEventListener('DOMContentLoaded', function() {
    const searchTermInput = document.getElementById('searchTerm');
    const timeRangeSelect = document.getElementById('timeRange');
    const statusDiv = document.getElementById('status');

    // 根据关键词删除历史记录
    document.getElementById('searchDelete').addEventListener('click', function() {
        const searchTerm = searchTermInput.value.trim();
        if (!searchTerm) {
            showStatus('请输入搜索关键词', 'error');
            return;
        }
        
        chrome.history.search({ text: searchTerm, maxResults: 0 }, function(results) {
            if (results.length === 0) {
                showStatus('未找到相关历史记录', 'info');
                return;
            }
            
            const urls = results.map(item => item.url);
            deleteUrls(urls, `已删除 ${urls.length} 条记录`);
        });
    });

    // 根据时间段删除历史记录
    document.getElementById('rangeDelete').addEventListener('click', function() {
        const timeRange = timeRangeSelect.value;
        const endTime = new Date().getTime();
        let startTime = 0;
        
        switch (timeRange) {
            case 'hour':
                startTime = endTime - (60 * 60 * 1000);
                break;
            case 'day':
                startTime = endTime - (24 * 60 * 60 * 1000);
                break;
            case 'week':
                startTime = endTime - (7 * 24 * 60 * 60 * 1000);
                break;
            default:
                startTime = 0;
        }
        
        chrome.history.search({
            text: '',
            startTime: startTime,
            endTime: endTime,
            maxResults: 0
        }, function(results) {
            if (results.length === 0) {
                showStatus('该时间段内无历史记录', 'info');
                return;
            }
            
            const urls = results.map(item => item.url);
            deleteUrls(urls, `已删除 ${urls.length} 条记录`);
        });
    });

    // 删除全部历史记录
    document.getElementById('deleteAll').addEventListener('click', function() {
        if (confirm('确定要删除所有历史记录吗？此操作不可恢复！')) {
            chrome.history.deleteAll(function() {
                showStatus('已删除全部历史记录', 'success');
            });
        }
    });

    // 辅助函数：批量删除URL
    function deleteUrls(urls, successMessage) {
        let deletedCount = 0;
        const total = urls.length;
        
        if (total === 0) return;
        
        urls.forEach(url => {
            chrome.history.deleteUrl({ url: url }, function() {
                deletedCount++;
                if (deletedCount === total) {
                    showStatus(successMessage, 'success');
                }
            });
        });
    }

    // 显示状态信息
    function showStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = type;
        setTimeout(() => {
            statusDiv.textContent = '';
            statusDiv.className = '';
        }, 3000);
    }
});