<template>
  <el-dialog
    :visible="show"
    :before-close="close"
    title="Status"
    custom-class="mw-420">
    <div v-if="Object.keys(data).length !== 0">
      <template v-if="data.activation.activation_status === 'P'">
        <div class="text-center font-56">
          <svg-icon icon-class="clock" />
        </div>
        <div class="text-center font-18 font-semi-bold">
          Sedang Diproses
        </div>
        <div class="font-12 text-center">
          Tunggu ya... Waktu proses paling lama 30 hari jam kerja
        </div>
      </template>

      <template v-if="data.activation.activation_status === 'A'">
        <div class="text-center font-56 color-success">
          <svg-icon icon-class="check-circle" />
        </div>
        <div class="text-center font-18 font-semi-bold">
          Pengajuan Diterima
        </div>
        <div class="font-12 text-center">
          <p>Kenali strukturnya, atur daftar menu GrabFood-mu sekarang!</p>
          <el-button
            type="success"
            @click="handleToDaftarMenu">
            Atur Daftar Menu
          </el-button>
        </div>
      </template>
    </div>
  </el-dialog>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: null
    }
  },

  mixins: [basicComputedMixin],

  methods: {
    close() {
      this.$emit('close')
    },

    handleToDaftarMenu() {
      this.close()
      this.$router.push({
        path: '/service-activation-v2/grabfood/setup'
      })
    }
  }
}
</script>
