/* eslint-disable */
// 监听来自 popup 的消息
// 监听来自后台脚本的消息
console.log('content.js');
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function autoFillForm(username) {
  console.log("调用autoFillForm函数");
  // 创建 Mutation Observer 实例
  const observer = new MutationObserver((mutationsList, observer) => {
    const element = document.querySelector('input[placeholder="请输入用户名"]');

    if (element) {
      console.log("找到元素"+document.querySelector('input[placeholder="请输入用户名"]'));
      // 停止观察
      observer.disconnect();
      sleep(200);
      // 执行后续逻辑
      try {

        const usernameInput = document.querySelector('input[placeholder="请输入用户名"]');
        if (usernameInput) {
          usernameInput.value = username;
          usernameInput.dispatchEvent(new Event('input'));
          console.log('输入用户名：' + usernameInput.value);
        }
        
        const passwordInput = document.querySelector('input[placeholder="请输入密码"]');
        if (passwordInput) {
          passwordInput.value = '2wsxVFR_';
          passwordInput.dispatchEvent(new Event('input'));
          const event = new KeyboardEvent('keydown', { key: 'Enter' });
          passwordInput.dispatchEvent(event);
          console.log('输入密码：' + passwordInput.value);
        }
        const loginButton = document.querySelector('.ivu-btn-primary.ivu-btn-long');
        if (loginButton) {
          loginButton.click();
          console.log('点击登录按钮');
        } else {
          console.log('未找到登录按钮');
        }
      } catch (err) {
        console.error(err);
      }
    }
  });

  // 开始观察目标节点

  observer.observe(document, { childList: true, subtree: true });

}




function handleContentMessage(message, sender, sendResponse) {
  console.log('handleContentMessage');
  if (message.action === 'executeDOMOperation') {
    console.log('content开始执行 DOM 操作'+message.action);
    autoFillForm(message.quote);
  }
}

chrome.runtime.onMessage.addListener(handleContentMessage);



// 其他内容脚本的代码...npm run build-watch
