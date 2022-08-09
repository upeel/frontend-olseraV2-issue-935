<template>
  <div class="innerpage-fullscreen">
    <div class="innerpage-fullscreen--header">
      <el-button
        class="innerpage-fullscreen--back"
        type="text"
        @click="$router.push({
          path: '/service-activation-v2'
        })">
        <svg-icon icon-class="arrow-left" />
      </el-button>
      <h4 class="innerpage-fullscreen--title">Bukalapak</h4>
    </div>
  </div>
</template>
<script>
import { authorizationBukalapak } from '@/api/thirdParty/bukalapak'
export default {
  name: 'CallbackBukalapak',

  mounted() {
    if (this.$route.query.code && this.storeHasIntegrateBukalapak === 1) {
      this.authBukalapak()
    } else {
      this.$router.push('/service-activation-v2')
    }
  },

  computed: {
    storeHasIntegrateBukalapak() {
      return this.$store.state.storeHasIntegrateBukalapak
    },
  },

  methods: {
    authBukalapak () {
      // this.loadingGetStore = true
      let data = {
        code: this.$route.query.code,
        callback_url: 'http://localhost:7070/service-activation-v2/bukalapak/callbackbukalapak'
      }
      authorizationBukalapak(data).then(response => {
        // this.dataUrl = response.data.data.link
        // this.loadingGetStore = false
        this.$message({
          type: 'success',
          message: response.data.data.message
        })
        this.$router.push('/service-activation-v2')
      }).catch(error => {
        // this.loadingGetStore = false
        console.log('err', error)
        this.$message({
          type: 'error',
          message: error.string
        })
        this.$router.push('/service-activation-v2')
      })
    }
  }
}
</script>