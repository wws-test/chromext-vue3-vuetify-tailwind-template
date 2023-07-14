/* eslint-disable */
console.log("hello world background todo something~");

// background.js

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
function openNewTabInIncognito(url) {
  chrome.windows.getCurrent(function (window) {
    // 使用 chrome.cookies.getAll 获取当前网址下的所有 cookie
    const urlObject = new URL(url);
    chrome.cookies.getAll({ domain: urlObject.hostname }, function (cookies) {
      console.log(cookies);
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        chrome.cookies.remove(
          { url: "https://" + cookie.domain + cookie.path, name: cookie.name },
          function (removedCookie) {
            if (removedCookie) {
              console.log("Cookie removed:", removedCookie);
            } else {
              console.log("Failed to remove cookie");
            }
          }
        );
      }
      // 在移除完所有 cookie 后刷新页面
      chrome.tabs.reload();
    });
    // chrome.cookies.getAll({ domain:"192.168.31.50" }, function(cookies) {
    //   console.log(cookies);
    //   // 遍历获取到的 cookie，并移除它们
    //   cookies.forEach(function(cookie) {
    //     chrome.cookies.remove({ url: cookie.url, name: cookie.name, storeId: cookie.storeId });
    //   });

    //   // 创建普通窗口并打开指定链接
    //   chrome.windows.create({ url:url });
    // });
  });
}

function executeDOMOperation() {
  // 在 background 脚本中发送消息给内容脚本
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    // 确保目标标签页已加载完成

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs && tabs.length > 0) {
        const targetTabId = tabs[0].id;
        (async () => {
          const response = await chrome.runtime.sendMessage({greeting: "hello"});
          // do something with response here, not outside the function
          console.log(response);
        })();


        // chrome.runtime.sendMessage({ action: 'testMessage' }, function(response) {
        //   // 处理接收到的响应
        //   // console.log(response);
        // });
      }
    });
    // chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    //   if (tabId === tabs[0].id && changeInfo.status === "complete") {
    //     // 发送消息给内容脚本
    //     chrome.tabs.sendMessage(
    //       tabs[0].id,
    //       { action: "testMessage" },
    //       function (response) {
    //         // 处理接收到的响应
    //         // console.log(response);
    //       }
    //     );
    //   }
    // });
  });
}
async function handleMessage(msg, sender, sendResponse) {
  if (msg.action === "executeScript") {
    // 清除cookie
    openNewTabInIncognito(msg.rootUrl);
    try {
      // 获取打开的无痕窗口的windowid
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.debugger.attach(
          { tabId: tabs[0].id },
          "1.3",
          function () {
            executeDOMOperation();
            // executeAutomation(newWindow.tabs[0].id);
            // 断开调试会话
            // chrome.debugger.detach({ tabId: newWindow.tabs[0].id });
          }
        );
      });
    } catch (error) {
      console.error(error);
    }
  }
}

chrome.runtime.onMessage.addListener(handleMessage);
