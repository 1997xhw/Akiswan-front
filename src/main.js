import Vue from 'vue'
import VueAxios from 'vue-axios'
import axios from 'axios'
import './registerServiceWorker'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/layout.scss'
import Akiswan from './views/Akiswan'

axios.interceptors.request.use(function (config) {
  config.headers.token = window.sessionStorage.getItem('token')
  return config
})
Vue.config.productionTip = false
Vue.use(VueAxios, axios)
axios.defaults.baseURL = '/api'
new Vue({
  router,
  store,
  render: h => h(Akiswan)
}).$mount('#app')
