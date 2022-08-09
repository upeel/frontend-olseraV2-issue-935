<template>
  <dialog-global
    :show="show"
    :show-footer="false"
    custom-class="without-padding mw-1020"
    title="Integrasi Bukalapak"
    @close="cancel">
    <div class="flex-container no-flex-sm">
      <div
        style="flex-basis: 50%"
        class="flex-container flex-container--content-center color-bukalapak--bg">
        <img
          width="264"
          src="/static/img/service-activation/bukalapak/icon_integration.png">
      </div>

      <div class="p-24" style="flex-basis: 50%">
        <div class="like-list">
          <div class="like-list--item">
            <div class="container-icon mr-8" style="height: auto;">
              <svg-icon icon-class="icon-store-black-rooftop" class="font-20"/>
            </div>
            <div>
              Sudah punya akun Bukalapak? Jika belum, lakukan pendaftaran terlebih dahulu atau klik link berikut
              <div class="mt-8"><a class="color-primary" href="https://www.bukalapak.com" target="_blank">Daftar Bukalapak</a></div>
            </div>
          </div>
          <div class="like-list--item">
            <div class="container-icon mr-8" style="height: auto;">
              <svg-icon icon-class="icon-clock-black" class="font-20"/>
            </div>
            <div>Proses aktivasi akan berlangsung real time sehingga Anda tidak perlu menunggu</div>
          </div>
          <div class="like-list--item">
            <div class="container-icon mr-8" style="height: auto;">
              <svg-icon icon-class="icon-check-circle" class="font-20"/>
            </div>
            <div>Pihak Bukalapak memiliki hak penuh untuk menyetujui atau menolak pengajuan integrasi.</div>
          </div>
          <!-- <div class="like-list--item">
            <div class="container-icon mr-8" style="height: auto;">
              <svg-icon icon-class="awesome-clock" class="font-20"/>
            </div>
            <div>Proses aktivasi akan berlangsung real time sehingga Anda tidak perlu menunggu</div>
          </div>
          <div class="like-list--item">
            <div class="container-icon mr-8" style="height: auto;">
              <svg-icon icon-class="awesome-check-circle" class="font-20"/>
            </div>
            <div>Pihak Bukalapak memiliki hak penuh untuk menyetujui atau menolak pengajuan integrasi.</div>
          </div> -->
        </div>
        <el-button
          class="btn-block color-bukalapak--bg color-white"
          :loading="loadingGetStore"
          @click="fetchAuthUrl">
          {{ rootLang.ok_integrate_now }}
        </el-button>
      </div>

      <el-dialog
        :visible.sync="showSetup"
        :title="rootLang.access_taxes"
        :show-close="false"
        width="536px"
        class="dialog-bukalapak-authorization"
        append-to-body>
        <div slot="title" class="flex-container">
          <h4 class="dialog-title full-width">
            Otorisasi Bukalapak
          </h4>
        </div>
        <div>
          <div class="radius-10 flex-container justify-center">
            <img
                src="/static/img/service-activation/bukalapak/bukalapak-icon.png"
              />
          </div>
        </div>
        <div slot="footer" class="text-center">
          <div class="font-18">Silahkan melakukan otorisasi pada link berikut</div>
          <div class="mt-24 color-bukalapak--bg p-8 color-white radius-50 flex-container justify-center pointer" @click="dialogBeforeAutorize = true">
            <div class="overflow-ellipsis">{{ dataUrl }}</div>
            <div class="container-icon mr-8">
              <svg-icon icon-class="external-link" class="font-20"/>
            </div>
          </div>
        </div>
      </el-dialog>

      <el-dialog
        :visible.sync="dialogBeforeAutorize"
        width="536px"
        class="dialog-shopee-authorization--success"
        append-to-body>
        <div class="text-center font-16">
          Segera selesaikan proses otorisasi Bukalapak. Otorisasi akan gagal jika Anda mengganti cabang toko Anda saat ini.
          <div class="flex-container mt-24">
            <el-button class="btn-block" @click="dialogBeforeAutorize = false">{{ lang.cancel }}</el-button>
            <el-button type="lazada" class="btn-block color-bukalapak--bg color-white" @click="authorizeBukalapak">{{ rootLang.next }}</el-button>
          </div>
        </div>
      </el-dialog>

      <!-- <dialog-form-integration
        :show="showSetup"
        @close="showSetup = false"
        @success="handleSuccess"
      />

      <dialog-setup-success
        :show="showSetupSucces"
        @close="showSetupSucces = false"
      /> -->
    </div>
  </dialog-global>
</template>

<script>
import DialogGlobal from '@/components/DialogGlobal'
import basicComputedMixin from '@/mixins/basicComputedMixin'
import { getAuthLink } from '@/api/thirdParty/bukalapak'

export default {
  name: 'BukalapakDialogBeforeIntegration',

  components: {
    DialogGlobal
  },

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

  data() {
    return {
      showSetup: false,
      loadingGetStore: false,
      dataUrl: [],
      dataCallback: {
        // callback_url: 'https://d1fjozuxvl1n9t.cloudfront.net/service-activation-v2/bukalapak/callbackbukalapak'
        callback_url: 'http://localhost:7070/service-activation-v2/bukalapak/callbackbukalapak'
      },
      // dataCallback: {},
      showSetupSucces: false,
      dialogBeforeAutorize: false
    }
  },

  computed: {
    storeHasIntegrateBukalapak() {
      return this.$store.state.storeHasIntegrateBukalapak
    },
  },

  methods: {
    cancel() {
      this.$emit('cancel')
    },

    submit() {
      this.showSetup = true
      // this.$emit('submit')
    },

    pasteText(dataId) {
      navigator.clipboard.readText()
      .then(text => {
        this.dataStore.map(i => {
          if (i.id === dataId) {
            i.link = text
          }
        })
      })
      .catch(err => {
        console.error('Failed to read clipboard contents: ', err);
      });
    },

    computedClassStore (dataStore) {
      let clas = dataStore.check ? 'border border--primary border--with-shadow radius-2' : 'border border--grey-border border--with-shadow radius-2'
      return clas
    },

    fetchAuthUrl () {
      // this.showSetup = true
      this.loadingGetStore = true
      getAuthLink(this.dataCallback).then(async response => {
        this.dataUrl = response.data.data.link
        // this.dataCallback = response.data.data.callback_url
        this.loadingGetStore = false
        this.showSetup = true
      }).catch(error => {
        this.loadingGetStore = false
        this.$message({
          type: 'error',
          message: error.string
        })
      })
    },

    save () {
      let data = []
      this.dataStore.map(i => {
        if (i.check) {
          data.push({
            merchant_id: i.store_id,
            shop_url: i.link
          })
        }
      })
      this.showSetup = false
      this.$emit('submit', data)
    },

    signupShopee () {
      window.open('https://bukalapak.co.id/')
    },

    authorizeBukalapak () {
      this.$store.commit('SET_STORE_HAS_INTEGRATED_BUKALAPAK', 1)
      window.open(this.dataUrl, "_self")
      // this.showSetup = false
      // this.showSetupSucces = true
    }
  }
}
</script>