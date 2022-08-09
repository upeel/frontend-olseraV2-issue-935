<template>
  <el-dialog
    :visible.sync="show"
    :before-close="close"
    width="536px"
    class="dialog-shopee-authorization--success"
    append-to-body>
    <div class="text-center">
      <img src="/static/img/service-activation/shopee/success_integrate.png" />
      <div class="font-18 mt-24">Year ! 🎉 Integrasi Shopee dan Olsera berhasil!</div>
    </div>
    <div slot="footer" class="text-center">
      <div class="mt-24 color-blibli--bg p-8 color-white radius-50 flex-container justify-center pointer" @click="doAuthorize">
        <div class="full-width flex-container justify-center">
          <img
            src="/static/img/shopee.png"
          />
          Blibli
        </div>
        <div class="container-icon mr-8">
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    close() {
      this.$emit('close')
    },
    doAuthorize () {
      // window.open(this.dataUrl, "_self")
      // this.showSetup = false
      // this.showSetupSucces = true
      postIntegration().then(response => {
        console.log(response.data.data)
      })
    }
  }
}
</script>
