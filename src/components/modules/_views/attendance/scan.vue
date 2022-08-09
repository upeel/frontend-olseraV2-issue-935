<template>
  <div>
    <el-dialog 
      :visible.sync="sessionExpired"
      custom-class="employee-profile-mobile">
      <div class="text-center">
        <div class="font-24 font-bold">Sesi tidak valid</div>
        <div class="font-16" style="word-break: keep-all;">Coba scan kembali atau muat ulang</div>
        <el-button class="btn-block" @click="reloadPage">
          <svg-icon icon-class="refresh-ico"/> 
          Muat Ulang
        </el-button>
        <el-button class="btn-block absent-finished" @click="visibleScan = true, sessionExpired = false">
          <svg-icon icon-class="scan-barcode-ico"/> 
          Scan
        </el-button>
      </div>
    </el-dialog>

    <el-dialog 
      :visible.sync="visibleScan"
      fullscreen
      custom-class="employee-profile-mobile">
      <div v-loading="loadingBarcode">
        <qrcode-stream @decode="showScanner"></qrcode-stream>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { QrcodeStream } from 'vue-qrcode-reader'
export default {
  name: 'ScanBarcode',

  components: {
    QrcodeStream
  },

  data() {
    return {
      sessionExpired: true,
      visibleScan: false,
      loadingBarcode: false
    }
  },

  methods: {
    reloadPage () {
      window.open('/attendance-mobile','_self')
    },

    showScanner (data) {
      if (data) {
        setTimeout(() => {
          this.loadingBarcode = true
        }, 500)
        setTimeout(() => {
          this.loadingBarcode = false
          this.visibleScan = false
          window.open(data,'_top')
        }, 1200)
      }
    },
  }
}
</script>