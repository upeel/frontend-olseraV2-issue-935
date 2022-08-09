<template>
  <div ref="recaptcha"></div>
</template>

<script>
export default {
  mounted() {
    this.renderRecaptcha()
  },

  methods: {
    reRenderRecaptcha() {
      var self = this
      var script = document.createElement("script")
      script.async = true
      script.defer = true
      script.src = "https://www.google.com/recaptcha/api.js"
      document.getElementsByTagName("head")[0].appendChild(script)
      script.onload = function () {
        if (!window.grecaptcha) {
          // console.log('belum ada')
          return void (console.error("no google maps script included"));
        } else {
          // console.log('sudah ada')
          self.renderRecaptcha()
        }
      }
    },
    renderRecaptcha() {
      if (window.grecaptcha) {
        const el = this.$refs.recaptcha
        // secret key: 6Ldb5BIaAAAAAC0WJ7hYdtq5Bgn0LHB-w-zjM7mH
        // const sitekey = '6Ldb5BIaAAAAADmLga4EVjA4D9GXXjE9PC088MOa'
        console.log(process.env.RECAPTCHA_SITE_KEY)
        const sitekey = process.env.RECAPTCHA_SITE_KEY
        window.grecaptcha.render(el, {
          sitekey,
          callback: this.successCalback,
          'expired-callback': this.expiredCalback,
          'error-callback': this.errorCalback
        })
      } else {
        this.reRenderRecaptcha()
      }
    },
    successCalback(response) {
      this.$emit('response', response, 'success')
    },
    expiredCalback(response) {
      this.$emit('response', response, 'expired')
    },
    errorCalback(response) {
      this.$emit('response', response, 'error')
    },
    reset() {
      window.grecaptcha.reset()
    }
  }
}
</script>
