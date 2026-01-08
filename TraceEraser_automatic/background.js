console.log('🚀 Auto History Cleaner 启动');

// 标记清理状态
let isCleaning = false;

// 主清理函数
async function cleanAllHistory() {
    if (isCleaning) {
        console.log('⏸️ 清理正在进行中，跳过');
        return;
    }
    
    isCleaning = true;
    
    try {
        console.log('🧹 开始清理历史记录...');
        
        // 使用 Promise 包装的 deleteAll
        await new Promise((resolve, reject) => {
            chrome.history.deleteAll(() => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve();
                }
            });
        });
        
        console.log('✅ 历史记录清理完成');
    } catch (error) {
        console.error('❌ 清理失败:', error);
    } finally {
        isCleaning = false;
    }
}

// 浏览器启动时清理
chrome.runtime.onStartup.addListener(() => {
    console.log('🌅 浏览器启动，执行清理');
    setTimeout(cleanAllHistory, 1000);
});

// 扩展安装时清理
chrome.runtime.onInstalled.addListener((details) => {
    console.log('📦 扩展安装/更新:', details.reason);
    setTimeout(cleanAllHistory, 1500);
});

// 标签页创建时清理
chrome.tabs.onCreated.addListener((tab) => {
    console.log('📄 新标签页创建');
    setTimeout(cleanAllHistory, 500);
});

// 保持服务工作者活跃
setInterval(() => {
    console.log('💓 服务工作者活跃');
}, 60000); // 每分钟一次

console.log('✅ 服务工作者注册成功');