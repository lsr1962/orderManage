// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import * as types from '../mutation-types'
// initial state
const state = {
  personInfo: {
  }
}

// getters
const getters = {
  personInfo: state => state.personInfo
}

// actions
const actions = {
  setInfo ({ commit }, info) {
    commit(types.SET_PERSON_INFO, info)
  }
}

// mutations
const mutations = {
  [types.SET_PERSON_INFO_ALL] (state, info) {
    state.personInfo = info
  },
  [types.SET_PERSON_INFO] (state, info) {
    for (var i in info) {
      state.personInfo[i] = info[i]
    }
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

