import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import employee from './modules/employee'
import router from './modules/router'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    employee,
    router
  },
  getters
})

export default store
