/* eslint-disable */
console.log("hello world background todo something~");


function getActiveTab(tabs) {
  if (tabs.length > 0) {
    return tabs[0];
  } else {
    console.info("Error: No active tabs found.");
    return null;
  }
}
/**
 *打开新窗口并删除指定URL的cookie。 *
 * @param {string} url - 应删除cookie的网站URL。
 * @return {undefined} This function does not return a value.
 */
function openNewTabInIncognito(url, value) {
  const urlObject = new URL(url);
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var tab = tabs[0];
    chrome.cookies.getAll({ domain: urlObject.hostname }, function (cookies) {
      console.log(cookies);
      for (var i = 0; i < cookies.length; i++) {
        chrome.cookies.remove({ url: tab.url, name: cookies[i].name });
      }
      // 刷新页面
      chrome.tabs.reload(tab.id, { bypassCache: true }, function () {
        // 在页面加载完成后发送消息给内容脚本
        chrome.tabs.onUpdated.addListener(function onUpdatedListener(tabId, changeInfo, updatedTab) {
          if (tabId === tab.id && changeInfo.status === 'complete') {
            chrome.tabs.onUpdated.removeListener(onUpdatedListener); // 移除监听器
            // 发送消息给内容脚本
            chrome.tabs.sendMessage(tabId, { action: 'executeDOMOperation', quote: value });
          }
        });
      });
    });
  });

}



function executeDOMOperation() {
  // 在 background 脚本中发送消息给内容脚本
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    // 确保目标标签页已加载完成
    chrome.tabs.reload(tabs[0].id);
  });
}

async function handleBackgroundMessage(msg, sender, sendResponse) {
  console.log("handleBackgroundMessage");
  if (msg.action === "executeScript") {
    console.log("handleBackgroundMessage收到了执行脚本的消息");
    // 清除cookie
    openNewTabInIncognito(msg.rootUrl, msg.quote);
    try {
      // 获取当前窗口的windowid
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.debugger.attach(
          { tabId: tabs[0].id },
          "1.3",
          function () {
            console.log("开始执行executeDOMOperation函数");
            // executeDOMOperation();
            // 断开调试会话
            chrome.debugger.detach({ tabId: tabs[0].id });
          }
        );
      });
    } catch (error) {
      console.error(error);
    }
  }
}

chrome.runtime.onMessage.addListener(handleBackgroundMessage);

//npm run build-watch
