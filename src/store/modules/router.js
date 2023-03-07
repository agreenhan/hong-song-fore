const state = {
  routers: []
}
const mutations = {
  SET_ROUTERS: (state, routers) => {
    state.routers = routers
  }
}
const actions = {
  setRouters( { commit }, routers ) {
    return new Promise((resolve) => {
      commit("SET_ROUTERS", routers)
      resolve()
    })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
