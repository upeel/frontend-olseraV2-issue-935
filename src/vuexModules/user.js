import { user as fetchUserLoggedin, login } from '@/api/auth'
const token = localStorage.getItem('olsbo_token') ? JSON.parse(localStorage.getItem('olsbo_token')) : null

const user = {
  state: {
    token,
    loggedInUser: null,
    newUser: false
  },

  mutations: {
    SET_TOKEN(state, token) {
      if (token) {
        state.token = token
        localStorage.setItem('olsbo_token', JSON.stringify(token))
      } else {
        state.token = null
        localStorage.removeItem('olsbo_token')
      }
    },
    SET_LOGGEDIN_USER(state, user) {
      state.loggedInUser = user
    },
    SET_NEW_USER(state, data) {
      state.newUser = data
    }
  },

  actions: {
    setTokenFromRegister({ commit }, data) {
      commit('SET_TOKEN', data)
    },
    login({ commit }, data) {
      return new Promise((resolve, reject) => {
        login(data).then(response => {
          commit('SET_TOKEN', response.data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    fetchUserLoggedin({ commit }) {
      return new Promise((resolve, reject) => {
        fetchUserLoggedin().then(response => {
          commit('SET_LOGGEDIN_USER', response.data.data)
          resolve(response)
        }).catch(error => {
          commit('SET_TOKEN', null)
          commit('SET_LOGGEDIN_USER', null)
          reject(error)
        })
      })
    },
    logout({ commit, dispatch }, withoutReload) {
      commit('SET_TOKEN', null)
      commit('SET_LOGGEDIN_USER', null)
      commit('SET_NEW_USER', false)
      dispatch('logoutStore')
      dispatch('destroyWebview')
      if (!withoutReload) {
        window.location.reload()
      }
    },
    setNewUser({ commit }, data) {
      commit('SET_NEW_USER', data)
    },
  }
}

export default user
