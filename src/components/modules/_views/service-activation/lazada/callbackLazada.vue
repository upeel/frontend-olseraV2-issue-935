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
      <h4 class="innerpage-fullscreen--title">Lazada</h4>
    </div>
  </div>
</template>
<script>
import { authorizationLazada } from '@/api/thirdParty/lazada'
export default {
  name: 'CallbackLazada',

  mounted() {
    if (this.$route.query.code && this.storeHasIntegrateLazada === 1) {
      this.authLazada()
    } else {
      this.$router.push('/service-activation-v2')
    }
  },

  computed: {
    storeHasIntegrateLazada() {
      return this.$store.state.storeHasIntegrateLazada
    },
  },

  methods: {
    authLazada () {
      // this.loadingGetStore = true
      let data = {
        code: this.$route.query.code
      }
      authorizationLazada(data).then(response => {
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