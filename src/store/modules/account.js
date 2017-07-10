// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import * as types from '../mutation-types'
// initial state
const state = {
  accountList: [],
  currentAccount: {}
}

// getters
const getters = {
  accountList: state => state.accountList,
  currentAccount: state => state.currentAccount
}

// actions
const actions = {
  setAccountList ({ commit }, list) {
    commit(types.SET_ACCOUNT_LIST, list)
  },
  setCurrentAccount ({ commit }, accountInfo) {
    commit(types.SET_ACCOUNT_INFO, accountInfo)
  }
}

// mutations
const mutations = {
  [types.SET_ACCOUNT_LIST] (state, list) {
    state.accountList = list
  },
  [types.SET_ACCOUNT_INFO] (state, info) {
    state.currentAccount = info
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

