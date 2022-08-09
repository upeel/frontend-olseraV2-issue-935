<template>
  <el-dialog
    :visible.sync="show"
    :before-close="cancel"
    :title="rootLang.access_taxes"
    :show-close="false"
    append-to-body
    custom-class="without-padding mw-1020">
    <div class="flex-container no-flex-sm">
      <div
        style="flex-basis: 50%"
        class="flex-container flex-container--content-center color-pajak--soft--bg">
        <img
          width="264"
          src="/static/img/service-activation/form-activation-pajak.png">
      </div>
      <div class="p-24" style="flex-basis: 50%">
        <div class="like-list">
          <div class="like-list--item">
            <div class="container-icon mr-8">
              <svg-icon icon-class="icon-info-circle" class="font-20"/>
            </div>
            <div>Badan perpajakan akan membutuhkan <span class="font-bold"> Access ID</span>dan <span class="font-bold">Access Token</span> untuk mengakses data penjualan Anda via API (Application Programming Interface)</div>
          </div>
          <div class="like-list--item">
            <div class="container-icon mr-8">
              <svg-icon icon-class="icon-clock-black" class="font-20"/>
            </div>
            <div>
              <div>Proses pengajuan Akses ID dan Access Token akan membutuhkan waktu kurang lebih selama <span class="font-bold">1-3 Hari Kerja</span></div>
            </div>
          </div>
          <div class="like-list--item">
            <div class="container-icon mr-8">
              <svg-icon icon-class="icon-shield" class="font-20"/>
            </div>
            <div>
              <div>Informasi Access ID dan Access Token akan diberikan langsung oleh Anda selaku pemilik usaha</div>
            </div>
          </div>
        </div>
        <el-button
          class="btn-block color-pajak--bg color-white"
          :loading="loadingSubmit"
          @click="submit">
          {{ rootLang.ok_integrate_now }}
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
export default {
  name: 'TaxationDialogBeforeIntegration',

  props: {
    show: {
      type: Boolean,
      default: false
    },
    loadingSubmit: {
      type: Boolean,
      default: false
    }
  },

  mixins: [basicComputedMixin],

  methods: {
    cancel() {
      this.$emit('cancel')
    },

    submit() {
      this.$emit('submit')
    }
  }
}
</script>
