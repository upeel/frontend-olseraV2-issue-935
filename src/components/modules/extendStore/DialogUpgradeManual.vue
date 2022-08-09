<template>
  <el-dialog
    :visible.sync="show"
    :before-close="beforeClose"
    append-to-body
    width="560px"
    custom-class="without-header body-p-null">
    <div class="upgrade-banner">
      <div class="upgrade-banner__main">
        <div class="font-bold font-24 color-blue-dark">
          Upgrade Paketmu <svg-icon icon-class="unlock" />
        </div>
        <div class="font-16">
          Sesuaikan kebutuhanmu dengan paket Olsera,<br>
          mulai dari Rp 2.700-an/hari
        </div>
      </div>
    </div>
    <div class="p-24">
      <div class="font-16 color-body mb-16">
        Sementara waktu, untuk melakukan upgrade paket Olsera harap hubungi kami melalui kontak di bawah ini
      </div>
      <el-row :gutter="12">
        <el-col :md="12">
          <el-button
            class="btn-block"
            @click="beforeClose">
            Nanti Saja
          </el-button>
        </el-col>
        <el-col :md="12">
          <a href="https://bit.ly/PREMIUMOLS" target="_blank">
            <el-button
              class="btn-block color-whatsapp--bg color-white">
              <svg-icon icon-class="whatsapp" /> Whatsapp
            </el-button>
          </a>
        </el-col>
      </el-row>
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
    beforeClose() {
      this.$emit('close')
    }
  }
}
</script>
