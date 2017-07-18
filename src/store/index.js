// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './mutation-types'
import * as actions from './actions'
import * as getters from './getters'

import account from './modules/account'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    orderInfo: {},
    shopInfo: {},
    userInfo: {}
  },
  mutations: {
    [types.SET_USER_INFO] (state, userInfo) {
      state.userInfo = userInfo
    },
    [types.SET_ORDER_INFO] (state, orderInfo) {
      state.orderInfo = orderInfo
    },
    [types.SET_SHOP_INFO] (state, shopInfo) {
      state.shopInfo = shopInfo
    }
  },
  actions,
  getters,
  modules: {
    account
  }
})

