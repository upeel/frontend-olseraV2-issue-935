import { permissionList } from '@/api/staffpermission'
import store from '@/store'

const state = () => ({
  roles: []
})

const mutations = {
  SET_ROLES(state, payload) {
    state.roles = payload
  }
}

const actions = {
  fetchRoles({ commit }) {
    return new Promise((resolve, reject) => {
      permissionList({
        role_id: store.getters.userRole.role_id
      }).then(response => {
        commit('SET_ROLES', response.data.data)
        resolve()
      }).catch((error) => {
        reject(error)
      })
    })
  }
}

const getters = {
  roles: state => state.roles
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
