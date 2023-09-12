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


// 导出一个名为handleClick1的函数，接收一个参数value
  export function handleClick1(value) {
    // 使用chrome.tabs.query方法查询当前活动窗口的标签页
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      // 获取当前标签页
      const currentTab = tabs[0];
      // 获取当前标签页的URL
      const currentUrl = tabs[0].url;
      // 创建一个URL对象，用于解析URL
      const urlObject = new URL(currentUrl);
      // 获取URL的协议和主机名，构建根URL
      const rootUrl = urlObject.protocol + '//' + urlObject.hostname;
      // 向后台发送消息，执行脚本，并传递当前标签页的根URL和引用值
      chrome.runtime.sendMessage({ action: 'executeScript', rootUrl: rootUrl, quote: value });
    });
  }
  

