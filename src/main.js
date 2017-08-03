// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import 'mint-ui/lib/style.css'
import { Indicator } from 'mint-ui'
import urlConfig from './url_config'
Vue.prototype.$urlConfig = urlConfig

import axios from 'axios'

Vue.config.productionTip = false
axios.defaults.baseURL = urlConfig.release_baseURL
// axios.defaults.baseURL = urlConfig.debug_baseURL
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  Indicator.open()
  return config
})
axios.interceptors.response.use(function (response) {
  // Do something before response is receive
  Indicator.close()
  return response
})
Vue.prototype.$http = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
