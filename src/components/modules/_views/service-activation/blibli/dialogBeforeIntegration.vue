<template>
  <dialog-global
    :show="show"
    :show-footer="false"
    custom-class="without-padding mw-1020"
    title="Integrasi BliBli"
    @close="cancel">
    <div class="flex-container no-flex-sm">
      <div
        style="flex-basis: 50%"
        class="flex-container flex-container--content-center color-blibli--bg">
        <img
          width="264"
          src="/static/img/service-activation/blibli/undraw_sync_files_xb3r.png">
      </div>

      <div class="p-24" style="flex-basis: 50%">
        <div class="like-list">
          <div class="like-list--item">
            <div class="container-icon mr-8" style="height: auto;">
              <svg-icon icon-class="awesome-store" class="font-20"/>
            </div>
            <div>
              Sudah punya akun Blibli? Jika belum, lakukan pendaftaran terlebih dahulu atau klik link berikut
              <div class="mt-8"><a class="color-primary" href="https://blibli.com" target="_blank">Daftar Blibli</a></div>
            </div>
          </div>
          <div class="like-list--item">
            <div class="container-icon mr-8" style="height: auto;">
              <svg-icon icon-class="awesome-key" class="font-20"/>
            </div>
            <div>Buat kata sandi API pada laman Blibli Seller terlebih dahulu.</div>
          </div>
          <div class="like-list--item">
            <div class="container-icon mr-8" style="height: auto;">
              <svg-icon icon-class="awesome-paste" class="font-20"/>
            </div>
            <div>Hubungkan API klien dengan memasukkan ID Klien Olsera berikut <span class="color-primary font-bold">mta-api-olsera-a53aa</span></div>
          </div>
          <div class="like-list--item">
            <div class="container-icon mr-8" style="height: auto;">
              <svg-icon icon-class="awesome-clock" class="font-20"/>
            </div>
            <div>Proses aktivasi akan berlangsung real time sehingga Anda tidak perlu menunggu</div>
          </div>
          <div class="like-list--item">
            <div class="container-icon mr-8" style="height: auto;">
              <svg-icon icon-class="awesome-check-circle" class="font-20"/>
            </div>
            <div>Pihak Blibli memiliki hak penuh untuk menyetujui atau menolak pengajuan integrasi.</div>
          </div>
        </div>
        <el-button
          class="btn-block color-blibli--bg color-white"
          :loading="loadingGetStore"
          @click="fetchAuthUrl">
          {{ rootLang.ok_integrate_now }}
        </el-button>
      </div>

      <dialog-form-integration
        :show="showSetup"
        @close="showSetup = false"
        @success="handleSuccess"
      />

      <dialog-setup-success
        :show="showSetupSucces"
        @close="showSetupSucces = false"
      />
    </div>
  </dialog-global>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import { fetchIntegration } from '@/api/thirdParty/blibli.js'
import DialogGlobal from '@/components/DialogGlobal'
import DialogFormIntegration from './dialogFormIntegration'
import DialogSetupSuccess from './dialogSetupSuccess'

export default {
  name: 'ShopeeDialogBeforeIntegration',

  components: {
    DialogGlobal,
    DialogFormIntegration,
    DialogSetupSuccess
  },

  mixins: [basicComputedMixin],

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

  data() {
    return {
      showSetup: false,
      loadingGetStore: false,
      dataUrl: [],
      showSetupSucces: false
    }
  },

  methods: {
    cancel() {
      this.$emit('cancel')
    },
    submit() {
      this.showSetup = true
    },
    fetchAuthUrl () {
      this.showSetup = true
      // this.loading = true
      // fetchIntegration().then(response => {
      //   this.$router.push({
      //     path: '/service-activation-v2/blibli/manage'
      //   })
      //   this.cancel()
      // }).catch(() => {
      //   this.showSetup = true
      //   this.cancel()
      // })
    },
    handleSuccess() {
      this.showSetup = false
      this.$emit('cancel')
    }
  }
}
</script>
