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


  export function handleClick1() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const currentTab = tabs[0];
      const currentUrl=tabs[0].url;
      const urlObject = new URL(currentUrl);
      const rootUrl = urlObject.protocol + '//' + urlObject.hostname;
      // 打开一个新的标签页，并传递当前标签页的 URL
      chrome.windows.create({url: rootUrl, incognito: true }, function(window) {
  
        // chrome.tabs.create({ url: currentUrl, windowId: window.id });
      });
    });
  }
  