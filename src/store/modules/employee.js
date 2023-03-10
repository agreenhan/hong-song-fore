import { login, logout, getInfo } from '@/api/employee'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
}

const actions = {
  // 员工登录
  login({ commit }, userInfo) {
    const { phoneNumber, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ phoneNumber: phoneNumber.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取员工信息
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response

        if (!data) {
          return reject('权限校验失败，请重新登录！')
        }

        const { name } = data

        commit('SET_NAME', name)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 员工退出
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout().then((response) => {
        console.log("移除token")
        removeToken() // 成功后移除token
        resetRouter()
        commit('RESET_STATE')
        this.$message.success(response.data.message)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 删除token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // 必须先删除token
      commit('RESET_STATE')
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

