// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/global.css'
//导入字体图标
import './assets/fonts/iconfont.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

//lodash  可敬的爽肤水  
import _ from 'lodash'

import echarts from 'echarts'

//导入NProgress包对应的js和css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

//配置请求的根路径
axios.defaults.baseURL="http://203.195.139.221:8300/api/private/v1/"

//在request拦截器中，展示进度条NProgress.start()
axios.interceptors.request.use(config =>{
  //console.log(config);
  NProgress.start()
  config.headers.Authorization=window.sessionStorage.getItem("token")
  //最后必须return config
  return config;

})

//在response拦截器中，隐藏进度条NProgress.done()
axios.interceptors.response.use(config =>{
   NProgress.done()
   return config
})

Vue.prototype.$http=axios

Vue.use(ElementUI)

Vue.config.productionTip = false

//将富文本注册为全局可用的组件
Vue.use(VueQuillEditor)

Vue.prototype._ = _

Vue.prototype.$echarts = echarts

Vue.component("tree-table",TreeTable)

Vue.filter('dateFormat',function(originVal){
  const dt =new Date(originVal)
  const y =dt.getFullYear()
  const m =(dt.getMonth()+1+'').padStart(2,'0')
  const d =(dt.getDate()+'').padStart(2,'0')
  const hh =(dt.getHours()+'').padStart(2,'0')
  const mm =(dt.getMinutes()+'').padStart(2,'0')
  const ss =(dt.getSeconds()+'').padStart(2,'0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
