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

// function createIncognitoWindow(url) {
//   return new Promise((resolve, reject) => {
//     chrome.windows.create(
//       { focused: true, incognito: true, url: url },
//       function (window) {
//         if (window) {
//           resolve(window.id);
//         } else {
//           reject(new Error("Failed to create incognito window."));
//         }
//       }
//     );
//   });
// }

function openNewTabInIncognito(url) {
  chrome.windows.getAll({ populate: true }, function (windows) {
    for (var i = 0; i < windows.length; i++) {
      var window = windows[i];
      if (window.incognito && window.type === "normal") {
        chrome.tabs.create({ url: url, windowId: window.id, active: false });
        break;
      }
    }
  });
}
async function handleMessage(msg, sender, sendResponse) {
  if (msg.action === 'log') {
    sendMessageToContentScript({ action: 'log', message: msg.message });
  } else if (msg.action === 'executeScript') {
    const rootUrl = msg.rootUrl;
    
    openNewTabInIncognito(rootUrl);
    
    // 执行您希望进行的其他自动化操作
    // ...
  }
}


chrome.runtime.onMessage.addListener(handleMessage);

// async function handleMessage(msg, sender, sendResponse) {
//   if (msg.action === "log") {
//     sendMessageToContentScript({ action: "log", message: msg.message });
//   } else if (msg.action === "executeScript") {
//     const windowId = await createIncognitoWindow(msg.rootUrl);
//     chrome.tabs.executeScript(
//       windowId,
//       {
//         code: `
//               // 输入账号和密码
//               document.querySelector('input[name="username"]').value = 'your-username';
//               document.querySelector('input[name="password"]').value = 'your-password';

//               // 点击登录按钮
//               document.querySelector('button[type="submit"]').click();

//               // 其他自动化操作...
//             `,
//       },
//       function () {
//         // I am in call back
//         console.log("Injected some jquery ");
//       }
//     );
//   }
// }

