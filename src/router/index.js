import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const shopMain = r => require.ensure([], () => r(require('../pages/shopMain.vue')), 'shopMain')

export default new Router({
  routes: [
    {
      path: '/',
      name: 'shopMain',
      component: shopMain,
      meta: {
        title: '店铺首页',
        home: true
      }
    }
  ]
})
