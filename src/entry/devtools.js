/* eslint-disable */
// 引入 highlight.js
import hljs from 'highlight.js';
import {v4 as uuidv4} from 'uuid';
// 引入 highlight.js 的样式文件
import 'highlight.js/styles/default.css';

const crypto = require('crypto');
const CryptoJS = require('crypto-js');
require('crypto-js/aes');

function aesEncrypt(text, secretKey, iv) {
  const encrypted = CryptoJS.AES.encrypt(text, secretKey, { iv: iv });
  return encrypted.toString();
}
function setHeaders(s, accessKey, secretKey) {
  const timeStamp = new Date().getTime();
  const combox_key = accessKey + '|' + uuidv4() + '|' + timeStamp;
  const signature = aesEncrypt(combox_key, secretKey, accessKey);
  console.log(signature);
  const header = {
    'Content-Type': 'application/json',
    'ACCEPT': 'application/json',
    'accessKey': accessKey,
    'signature': signature
  };
  s.headers = Object.assign({}, s.headers, header); // 修改这一行
  return s;
}

async function getValueFromLocalStorage() {
  try {
    const result = await new Promise((resolve) => {
      chrome.storage.local.get('projectid', function (result) {
        resolve(result.key);
      });
    });
    console.log('Stored value:', result);
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function getDataFromIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('myDatabase', 1);

    request.onsuccess = function(event) {
      const db = event.target.result;
      const transaction = db.transaction('myObjectStore', 'readonly');
      const objectStore = transaction.objectStore('myObjectStore');

      const getRequest = objectStore.get('projectid');

      getRequest.onsuccess = function(event) {
        const data = event.target.result;
        if (data) {
          resolve(data);
        } else {
          reject(new Error('Value not found in IndexedDB'));
        }
      };

      transaction.oncomplete = function(event) {
        db.close();
      };
    };

    request.onerror = function(event) {
      reject(new Error('Error opening IndexedDB'));
    };
  });
}

  chrome.devtools.panels.create("Network Paths", "icons/ssh16.png", "my-devtools.html", function(panel) {
  // 面板初始化逻辑
  panel.onShown.addListener(function(panelWindow) {
    const request = indexedDB.open('myDatabase', 1);

    request.onupgradeneeded = function(event) {
      const db = event.target.result;
      const objectStore = db.createObjectStore('myObjectStore', { keyPath: 'key' });
    };

    request.onsuccess = function(event) {
      const db = event.target.result;
      const transaction = db.transaction('myObjectStore', 'readwrite');
      const objectStore = transaction.objectStore('myObjectStore');

      const data = { key: 'projectid', value: 'fa6119bb-615b-45c5-82cb-685911c1ff65' };
      const request = objectStore.put(data);

      request.onsuccess = function(event) {
        console.log('Value is set in IndexedDB');
      };

      transaction.oncomplete = function(event) {
        db.close();
      };
    };
    
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
      const apiUrl = 'http://10.50.2.3:8081/project/addRedisInterface';
      button.addEventListener('click', () => {
        sendRequest(apiUrl, Array.from(uniquePaths), panelWindow);
      });

    // 显示处理后的路径
    renderPaths(uniquePaths);


    function sendRequest(url, paths, panelWindow) {
      let s = { headers: {} }; // 创建一个空的请求头对象
      s = setHeaders(s, 'KUPXCvnjCna9ANc9', "ptylbHok5nZSGexx"); // 设置请求头
      console.log(s);
      fetch(url, {
        method: 'POST',
        headers: Object.assign({}, s.headers),
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
        p.style.color = 'blue'; // 设置文本颜色
        p.style.padding = '0.5rem 1rem'; // 设置内边距
        p.style.borderRadius = '4px'; // 设置边框圆角
        p.addEventListener('click', function() {
          const searchKey = encodeURIComponent(path);
          // 对路径进行编码作为参数
          getDataFromIndexedDB()
              .then(data => {
                console.log('Data retrieved from IndexedDB:', data);
                const value = data;
                // 在这里处理数据
              })

          let s = { headers: {} }; // 创建一个空的请求头对象
          s = setHeaders(s, 'KUPXCvnjCna9ANc9', "ptylbHok5nZSGexx"); // 设置请求头
          const requestBody = {
            name: searchKey,
            projectId: value
          };
          const apiUrl = `http://10.50.2.3:8081/api/definition/queryCaseInfo1`;

          // 调用后端接口
          fetch(apiUrl, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: Object.assign({}, s.headers),
          })
              .then(response => response.json())
              .then(data => {
                const rightContent = panelWindow.document.getElementById('right');
                rightContent.innerHTML = ''; // 清空旧内容
                document.addEventListener('DOMContentLoaded', function () {
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



// chrome.devtools.panels.create("terminal", "favicon.ico", "my-devtools1.html", function(panel){
//   panel.onShown.addListener(function(panelWindow) {
//     initializePanel(panelWindow);
//   });
// });
// function initializePanel(panelWindow) {
//   chrome.devtools.inspectedWindow.eval("window.location.href", function(result, exceptionInfo) {
//     if (exceptionInfo) {
//       console.error("Error:", exceptionInfo);
//     } else {
//       console.log("Current URL:", result);
//       const url = new URL(result);
//       console.log("Current Host:", url.hostname);

//       const iframe = panelWindow.document.querySelector("iframe");
//       iframe.src = `http://${url.hostname}:7681`;
//     }
//   });
// }