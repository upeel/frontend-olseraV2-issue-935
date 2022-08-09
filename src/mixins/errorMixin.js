const errorMixin = {
  methods: {
    errorParser(error) {
      const errorObj = error.response.data.error.error
      const errorKeys = Object.keys(error.response.data.error.error)
      const message = error.response.data.error.message
      let errorStr = ''
      errorKeys.map(item => {
        errorStr = errorStr + errorObj[item][0] + '. '
      })
      return {
        message,
        errorStr
      }
    }
  }
}

export default errorMixin