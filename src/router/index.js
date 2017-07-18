import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const shopMain = r => require.ensure([], () => r(require('../pages/shopMain.vue')), 'shopMain')
const confirmOrder = r => require.ensure([], () => r(require('../pages/confirmOrder.vue')), 'confirmOrder')
const payOrder = r => require.ensure([], () => r(require('../pages/payOrder.vue')), 'payOrder')
const payFinish = r => require.ensure([], () => r(require('../pages/payFinish.vue')), 'payFinish')

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
    },
    {
      path: '/confirmOrder',
      name: 'confirmOrder',
      component: confirmOrder,
      meta: {
        title: '订单确认'
      }
    },
    {
      path: '/payOrder',
      name: 'payOrder',
      component: payOrder,
      meta: {
        title: '订单支付'
      }
    },
    {
      path: '/payFinish',
      name: 'payFinish',
      component: payFinish,
      meta: {
        title: '订单完成'
      }
    }
  ]
})
