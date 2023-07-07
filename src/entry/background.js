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
function openNewTabInIncognito(url) {
  chrome.windows.create({ incognito: false, url: url }, function (wins) {
  // 在创建隐身窗口后的回调函数中处理窗口信息
  console.log(wins);
});
  chrome.windows.getAll({ populate: true,windowTypes: ['normal'] }, function (win) {
    for (var i = 0; i < win.length; i++) {
      var window = win[i];
      if (window.incognito && window.type === 'normal') {
        chrome.tabs.create({ url: url, windowId: window.id, active: false });
        break;
      }
    }
  });
}

// function openNewTabInIncognito(url) {
//   chrome.windows.getAll({ populate: true,windowTypes: ['normal']}, function (win) {
//     if (win.length > 0) {
//       // 选择第一个隐身窗口
//       const windowId = win[0].id;
      
//       // 在选定的隐身窗口中打开新的标签页
//       chrome.tabs.create({ windowId: windowId, url: url }, function (tab) {
//         console.log('New tab opened in incognito window');
//       });
//     } else {
//       console.log('No incognito window found');
//     }
//   });
// }
async function executeAutomation(tabId) {
  // 发送命令给无痕页面执行自动化操作
  chrome.debugger.sendCommand({ tabId: tabId }, 'Runtime.evaluate', {
    expression: `
      // 输入账号和密码
      document.querySelector('input[name="username"]').value = 'your-username';
      document.querySelector('input[name="password"]').value = 'your-password';

      // 点击登录按钮
      document.querySelector('button[type="submit"]').click();

      // 其他自动化操作...
    `
  });
}

async function handleMessage(msg, sender, sendResponse) {
  if (msg.action === 'executeScript') {
    // 创建无痕窗口
    openNewTabInIncognito(msg.rootUrl);
    // try {
    //   // 获取打开的无痕窗口的windowid
    //   chrome.debugger.attach({ tabId: windows.tabs[0].id }, '1.3', function () {
    //     // 启用调试会话
    //     chrome.debugger.enable({}, async function () {
    //       // 执行自动化操作
    //       await executeAutomation(window.tabs[0].id);

    //       // 断开调试会话
    //       chrome.debugger.detach({ tabId: window.tabs[0].id });
    //     });
    //   });
    // } catch (error) {
    //   console.error(error);
    // }
    // chrome.windows.create({ incognito: true, url: msg.rootUrl }, async function (window) {

    // });
  }
}

chrome.runtime.onMessage.addListener(handleMessage);
// async function handleMessage(msg, sender, sendResponse) {
//   if (msg.action === 'log') {
//     sendMessageToContentScript({ action: 'log', message: msg.message });
//   } else if (msg.action === 'executeScript') {
//     const rootUrl = msg.rootUrl;
    
//     openNewTabInIncognito(rootUrl);
    
//     // 执行您希望进行的其他自动化操作
//     // ...
//   }
// }




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

