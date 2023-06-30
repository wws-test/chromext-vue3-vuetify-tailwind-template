console.log('hello world background todo something~')
// background.js
/* eslint-disable */ 
function getActiveTab(tabs) {
    if (tabs.length > 0) {
        return tabs[0];
    } else {
        console.info('Error: No active tabs found.');
        return null;
    }
}

let port = null;

chrome.runtime.onConnect.addListener(function (newPort) {
  port = newPort;
  port.onDisconnect.addListener(function () {
    port = null;
  });
});

function sendMessageToContentScript(message) {
  if (port) {
    port.postMessage(message);
  } else {
    console.info('Error: No active port found.');
  }
}

function handleMessage(msg, sender, sendResponse) {
  if (msg.action === 'getURL') {
    sendMessageToContentScript({ action: 'getURL' });
  } else if (msg.action === 'log') {
    sendMessageToContentScript({ action: 'log', message: msg.message });
  }
}

chrome.runtime.onMessage.addListener(handleMessage);

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'getCurrentUrl') {
      const tabId = sender.tab?.id; // 使用可选链操作符 ?. 来避免报错
      if (tabId) {
        chrome.tabs.get(tabId, function (tab) {
          const currentUrl = tab.url;
          chrome.tabs.sendMessage(tabId, { action: 'currentUrl', url: currentUrl });
        });
      } else {
        console.info('Error: Cannot get tab ID.');
      }
    }
  });
  
