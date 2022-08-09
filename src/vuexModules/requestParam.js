const requestParam = {
  state: {
    param: {}
  },

  mutations: {
    SET_PARAM: (state, data) => {
      state.param[data.path] = data.params
      // remove console before push
      // console.log(state.param)
    },
    CLEAR_PARAM: (state, data) => {
      delete state.param[data.path]
    }
  },

  actions: {
    setParam({ commit }, data) {
      commit('SET_PARAM', data)
    },
    clearParam({ commit }, data) {
      commit('CLEAR_PARAM', data)
    }
  }
}

export default requestParam
