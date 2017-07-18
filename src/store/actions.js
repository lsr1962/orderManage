// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import * as types from './mutation-types'

export const setUserInfo = ({ commit }, state) => {
  commit(types.SET_USER_INFO, state)
}
export const setOrderInfo = ({ commit }, state) => {
  commit(types.SET_ORDER_INFO, state)
}
export const setShopInfo = ({ commit }, state) => {
  commit(types.SET_SHOP_INFO, state)
}
