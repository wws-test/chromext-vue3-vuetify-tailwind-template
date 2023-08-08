/* eslint-disable */
chrome.devtools.panels.create("Network Paths", "path/to/panel-icon.png", "my-devtools.html", function(panel) {
  console.log('DevTools panel created'); // 输出面板创建信息

  // 面板初始化逻辑
  panel.onShown.addListener(function(panelWindow) {
    console.log('Panel is shown'); // 输出面板显示信息

    // 获取网络请求列表
    chrome.devtools.network.getHAR(function(result) {
      console.log('Received HAR data:', result); // 输出 HAR 数据

      const entries = result.entries;

      // 提取并显示网络请求的路径
      const requestList = panelWindow.document.getElementById('request-list');

      entries.forEach(entry => {
        const requestPath = entry.request.url;
        console.log('Request path:', requestPath); // 输出请求路径
        const listItem = panelWindow.document.createElement('li');
        listItem.textContent = requestPath;
        requestList.appendChild(listItem);
      });
    });
  });
});
