/* eslint-disable */
// 监听来自 popup 的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'getURL') {
      sendResponse({ url: window.location.href });
    }
});

// 其他内容脚本的代码...
