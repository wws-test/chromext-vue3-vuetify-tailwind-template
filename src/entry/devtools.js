/* eslint-disable */
   // 引入 highlight.js
   import hljs from 'highlight.js';
   // 引入 highlight.js 的样式文件
   import 'highlight.js/styles/default.css';
chrome.devtools.panels.create("Network Paths", "icons/ssh16.png", "my-devtools.html", function(panel) {
  // 面板初始化逻辑
  panel.onShown.addListener(function(panelWindow) {
    
    chrome.devtools.network.getHAR(function(result) {
      const entries = result.entries;

      // 用 Set 进行路径去重
      const uniquePaths = new Set();

      // 处理路径
      entries.forEach(entry => {
        if (entry._resourceType === 'xhr' || entry._resourceType === 'fetch') {    
          // 处理 XHR 和 Fetch 请求
          const requestPath = new URL(entry.request.url).pathname;
          // 去除主机部分和参数部分
          const pathWithoutHostAndQuery = requestPath.replace(/^.*\/\/[^\/]+/, '').split('?')[0];
         //过滤开头参数
          const isFile = /\.[a-zA-Z]+$/.test(pathWithoutHostAndQuery);
          const startsWithExt = pathWithoutHostAndQuery.startsWith('/ext/');
          const startsWithCustom = pathWithoutHostAndQuery.startsWith('/bdsap/'); // 添加的额外过滤条件
          const startsWithuFTm3Jrc5ExB6 = pathWithoutHostAndQuery.startsWith('//uFTm3Jrc5ExB6/'); // 添加的额外过滤条件

          //过滤公用接口
          const isCommonPath = pathWithoutHostAndQuery === '/api/commom/getServerTime'; // 添加过滤条件
          const isUserinfo = pathWithoutHostAndQuery === '/api/user/info'; // 添加过滤条件
          const getInterfaceConfig = pathWithoutHostAndQuery === '/api/commonConfig/getInterfaceConfig'; // 添加过滤条件
          const watermarking = pathWithoutHostAndQuery === '/api/loginsetting/watermarking'; // 添加过滤条件
          const downloadFile = pathWithoutHostAndQuery === '/api/alert/downloadFile'; // 添加过滤条件


          if (!isFile && !startsWithExt&& !startsWithCustom && !isCommonPath && !isUserinfo && !getInterfaceConfig && !watermarking && !downloadFile && !startsWithuFTm3Jrc5ExB6) {
            // 将处理后的路径添加到集合中
            uniquePaths.add(pathWithoutHostAndQuery);
          }
        } 

      });
      
      // 当按钮点击时调用 sendRequest 函数发送接口请求
      const button = panelWindow.document.querySelector('button');
      const apiUrl = 'http://10.50.2.202:10082/api/interface/add_redis_Interface';
      button.addEventListener('click', () => {
        sendRequest(apiUrl, Array.from(uniquePaths), panelWindow);
      });

    // 显示处理后的路径
    renderPaths(uniquePaths);


    function sendRequest(url, paths, panelWindow) {
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ paths: paths })
      })
      .then(response => response.json())
      .then(data => {
        const rightContent = panelWindow.document.getElementById('right');
        rightContent.innerHTML = ''; // 清空旧内容
        document.addEventListener('DOMContentLoaded', function() {
          hljs.initHighlighting();
        });
        // 创建入参显示元素
        const inputElement = document.createElement('pre');
        inputElement.textContent = 'Input paths: ' + JSON.stringify(paths, null, 2);
        inputElement.className = 'json-data';
        hljs.highlightBlock(inputElement);

        // 创建结果显示元素
        const resultElement = document.createElement('pre');
        resultElement.textContent = 'Result: ' + JSON.stringify(data, null, 2);
        resultElement.className = 'json-data';
        hljs.highlightBlock(resultElement);

        // 将入参和结果元素添加到右侧面板
        rightContent.appendChild(inputElement);
        rightContent.appendChild(resultElement);
          })
      .catch(error => {
        console.error('接口请求错误:', error);
      });
    }

    function renderPaths(paths) {

      const uniquePaths = new Set(paths);
    
      // 使用 Array.from 将 Set 转换为数组
      const filteredPaths = Array.from(uniquePaths);
    
      const requestList = panelWindow.document.getElementById('request-list');
    
      requestList.innerHTML = ''; // 清空旧内容
    
      filteredPaths.forEach(path => {
    
        const p = document.createElement('li');
        p.style.fontSize = '16px';
        p.textContent = path;
        p.style.paddingBottom  = '10px'; // 设置下边距
        p.style.cursor = 'pointer'; // 设置鼠标为手形
        // p.style.backgroundColor = '#007bff'; // 设置背景颜色
        p.style.color = 'blue'; // 设置文本颜色
        p.style.padding = '0.5rem 1rem'; // 设置内边距
        p.style.borderRadius = '4px'; // 设置边框圆角
        p.addEventListener('click', function() {
          const searchKey = encodeURIComponent(path); // 对路径进行编码作为参数
          const apiUrl = `http://10.50.2.202:10082/api/IAT/queryCaseInfo1?search_key=${searchKey}&project_id=38`;
        
          // 调用后端接口
          fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
              const rightContent = panelWindow.document.getElementById('right');
              rightContent.innerHTML = ''; // 清空旧内容
              document.addEventListener('DOMContentLoaded', function() {
                hljs.initHighlighting();
              });
              // 创建结果显示元素
              const resultElement = document.createElement('pre');
              // 递归函数，用于提取嵌套层级的 name 字段
              resultElement.textContent = JSON.stringify(data, null, 2);
              // 设置样式类名，以便应用合适的样式
              resultElement.className = 'json-data';
              hljs.highlightBlock(resultElement);

              rightContent.appendChild(resultElement);
            })
            .catch(error => {
              // 处理请求错误
              console.error(error);
            });
        });

        requestList.appendChild(p);
    
      });
    
    }
    
  });    
    chrome.devtools.network.getHAR(function(result) {
      var responses = []; // 存储response的数组
      try {
        if (result && result.entries) {
          for (var i = 0; i < result.entries.length; i++) {
            var entry = result.entries[i];
            var response = entry.response;
            if (response && response.content.mimeType === 'application/json') {
              responses.push(response); // 将response存入数组中
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    
      // 在获取到全部response后进行处理
      for (var j = 0; j < responses.length; j++) {
        var response = responses[j];
        if (response.content.text) {
          try {
            var responseData = JSON.parse(response.content.text);
            if (responseData.code == 0) {
              showNotification(response.content.text);
            }
          } catch (error) {
            console.error('Invalid JSON:', error);
          }
        }
      }

      function showNotification(text) {
        chrome.notifications.create({
          type: 'basic',
          title: 'Response Code',
          message: text,
          iconUrl: 'icon.png'
        });
      }

    });
  });
});



chrome.devtools.panels.create("terminal", "favicon.ico", "my-devtools1.html", function(panel){
  panel.onShown.addListener(function(panelWindow) {
    initializePanel(panelWindow);
  });
});
function initializePanel(panelWindow) {
  chrome.devtools.inspectedWindow.eval("window.location.href", function(result, exceptionInfo) {
    if (exceptionInfo) {
      console.error("Error:", exceptionInfo);
    } else {
      console.log("Current URL:", result);
      const url = new URL(result);
      console.log("Current Host:", url.hostname);

      const iframe = panelWindow.document.querySelector("iframe");
      iframe.src = `http://${url.hostname}:7681`;
    }
  });
}