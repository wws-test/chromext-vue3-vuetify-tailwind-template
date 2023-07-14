/* eslint-disable */
// 监听来自 popup 的消息
// 监听来自后台脚本的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  debugger;
  if (request.action === 'executeDOMOperation') {
    console.log('执行 DOM 操作');
    // 执行 DOM 操作
    // var document = parser.parseFromString(html, "text/html");
    document.querySelector('input[name="请输入用户名"]').value = 'admin';
    document.querySelector('input[name="请输入密码"]').value = '2wsxVFR_';
    document.querySelector('button[type="submit"]').click();

  }
});
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'testMessage') {
    console.log('接收到来自后台脚本的测试消息');
    // 可以在此处执行其他操作或回复消息
  }
});



// // 向后台脚本发送消息
// chrome.runtime.sendMessage({ action: 'getURL' }, function(response) {
//   console.log('当前页面URL:', response.url);
// });

// // 其他内容脚本的代码...
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     if (request.action === 'getURL') {
//       sendResponse({ url: window.location.href });
//     }
// });

// 其他内容脚本的代码...
