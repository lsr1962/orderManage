// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import * as types from '../mutation-types'
// initial state
const state = {
  shopList: [],
  currentShop: {}
}

// getters
const getters = {
  shopList: state => state.shopList,
  currentShop: state => state.currentShop
}

// actions
const actions = {
  setShopList ({ commit }, list) {
    commit(types.SET_SHOP_LIST, list)
  },
  setCurrentShop ({ commit }, shopInfo) {
    commit(types.SET_SHOP_INFO, shopInfo)
  }
}

// mutations
const mutations = {
  [types.SET_SHOP_LIST] (state, list) {
    state.shopList = list
  },
  [types.SET_SHOP_INFO] (state, info) {
    state.currentShop = info
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

