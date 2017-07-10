// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './mutation-types'
import * as actions from './actions'
import * as getters from './getters'

import personInfo from './modules/personInfo'
import shop from './modules/shop'
import account from './modules/account'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {
      userid: '3',
      useradmin: '1',
      shopid: '2',
      telephone: '18656132832'
    }
  },
  mutations: {
    [types.SET_USER_INFO] (state, userInfo) {
      state.userInfo = userInfo
    }
  },
  actions,
  getters,
  modules: {
    personInfo,
    shop,
    account
  }
})

