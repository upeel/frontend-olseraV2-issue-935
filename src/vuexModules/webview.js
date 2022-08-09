import { user as fetchUserLoggedin, login } from '@/api/auth'
import { login as attendanceLogin } from '@/api/attendance'
import { fetchStore } from '@/api/store'
const token = localStorage.getItem('olsbowebview_token') ? JSON.parse(localStorage.getItem('olsbowebview_token')) : null
const selectedStore = localStorage.getItem('olsbowebview_selectedstore') ? JSON.parse(localStorage.getItem('olsbowebview_selectedstore')) : null

const webview = {
  state: {
    webviewMode: false,
    token,
    loggedInUser: null,
    selectedStore,
    userRole: {}
  },

  mutations: {
    SET_WEBVIEW_MODE: (state, payload) => {
      state.webviewMode = payload
    },
    SET_WEBVIEW_TOKEN: (state, token) => {
      state.token = token
      localStorage.setItem('olsbowebview_token', JSON.stringify(token))
    },
    SET_WEBVIEW_LOGGEDIN_USER: (state, user) => {
      state.loggedInUser = user
    },
    SET_WEBVIEW_SELECTED_STORE: (state, store) => {
      state.selectedStore = store
      state.userRole = {
        role_id: store.role_id,
        role_name: store.role_name,
        is_pos_only: store.is_pos_only,
        is_mobile: store.is_mobile
      }
      localStorage.setItem('olsbowebview_selectedstore', JSON.stringify(store))
    },
    REMOVE_WEBVIEW_TOKEN: (state) => {
      state.token = null
      localStorage.removeItem('olsbowebview_token')
    },
    REMOVE_WEBVIEW_SELECTED_STORE: (state) => {
      state.selectedStore = null
      localStorage.removeItem('olsbowebview_selectedstore')
    }
  },

  actions: {
    webviewLogin({ commit }, data) {
      return new Promise((resolve, reject) => {
        login(data).then(response => {
          commit('SET_WEBVIEW_TOKEN', response.data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    webviewFetchUserLoggedin({ commit }) {
      return new Promise((resolve, reject) => {
        fetchUserLoggedin().then(response => {
          commit('SET_WEBVIEW_LOGGEDIN_USER', response.data.data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    webviewSetSelectedStore({ commit }, storeId) {
      return new Promise((resolve, reject) => {
        fetchStore(storeId).then(response => {
          commit('SET_WEBVIEW_SELECTED_STORE', response.data.data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    destroyWebview({ commit }) {
      localStorage.removeItem('olsbo_report_params')
      localStorage.removeItem('olsbo_downloadfromurl')
      localStorage.removeItem('olsbo_downloadfrompath')
      commit('SET_WEBVIEW_MODE', false)
      commit('REMOVE_WEBVIEW_TOKEN')
      commit('REMOVE_WEBVIEW_SELECTED_STORE')
    },
    webviewAttendanceLogin({ commit }, data) {
      return new Promise((resolve, reject) => {
        attendanceLogin(data).then(response => {
          commit('SET_WEBVIEW_TOKEN', response.data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default webview
