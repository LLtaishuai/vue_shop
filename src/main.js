import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './plugins/element.js'
// 从入口文件导入全局样式表
import '@/assets/css/global.css'
// 导入icon-font
import '@/assets/fonts/iconfont.css'
// 导入treeTable插件
import TreeTable from 'vue-table-with-tree-grid'
// 全局注册TreeTable
Vue.component('tree-table', TreeTable)
Vue.config.productionTip = false
// 配置请求基地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 配置请求拦截
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
