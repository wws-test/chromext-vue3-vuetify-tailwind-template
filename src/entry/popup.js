/* eslint-disable */ 
import { createApp } from 'vue'
import App from '../view/popup.vue'
import axios from 'axios';
import VueAxios from 'vue-axios';
// import 'vuetify/dist/vuetify.min.css'
import '@/assets/css/tailwind.css';
import '@/assets/css/popup.css';
import Vuetify from '../plugins/vuetify';


const apiClient = axios.create({
    baseURL: 'http://10.50.2.202:10083',
});

const app = createApp(App);

app.use(Vuetify)
app.use(VueAxios, apiClient);

// Send log messages to background.js
app.config.globalProperties.$log = function (message) {
    chrome.runtime.sendMessage({ action: 'log', message: message });
};

app.mount('#app');

chrome.runtime.sendMessage({ action: 'getCurrentUrl' });

chrome.runtime.connect({}, function (port) {
    port.onMessage.addListener(function (message) {
      if (message.action === 'currentUrl') {
        const currentUrl = message.url;
        // 在这里处理当前标签页的 URL
        console.log('Current URL:', currentUrl);
      }
    });
  });
  function handleClick1() {
    // 向 content script 发送消息，获取当前标签页的 URL
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const currentTab = tabs[0];
      chrome.tabs.sendMessage(currentTab.id, { action: 'GET_URL' }, function(response) {
        const currentUrl = response.url;
  
        // 打开一个新的标签页，并传递当前标签页的 URL
        chrome.tabs.create({ url: currentUrl }, function(newTab) {
          // 在新标签页中执行页面自动化操作，可以使用 playwright 或其他工具
          // TODO: 添加页面自动化操作的代码
        });
      });
    });
  }
  