const checkPersistentParam = {
  watch: {
    params: {
      deep: true,
      handler(params) {
        this.$store.dispatch('setParam', {
          path: this.$route.name,
          params: { ...params }
        })
      }
    }
  },

  methods: {
    checkPersistentMeta() {
      if (this.$route.meta && this.$route.meta.persistent_param) {
        if (this.$store.state.requestParam.param[this.$route.name]) {
          this.params = { ...this.$store.state.requestParam.param[this.$route.name] }
        } else {
          this.$store.dispatch('setParam', {
            path: this.$route.name,
            params: { ...this.params }
          })
        }
      }
    },

    // clearPersistentMeta() {
    //   this.$store.dispatch('clearParam')
    // }
  }
}

export default checkPersistentParam
