<template>
  <el-dialog
    :visible.sync="show"
    :before-close="cancel"
    title="Integrasi Shopee"
    :show-close="false"
    append-to-body
    custom-class="without-padding mw-1020">
    <div class="flex-container no-flex-sm">
      <div
        style="flex-basis: 50%"
        class="flex-container flex-container--content-center color-shopee--bg">
        <img
          width="264"
          src="/static/img/service-activation/shopee/undraw_sync_files_xb3r.png">
      </div>
      <div class="p-24" style="flex-basis: 50%">
        <div class="like-list">
          <div class="like-list--item">
            <div class="container-icon mr-8">
              <svg-icon icon-class="icon-store-black-rooftop" class="font-20"/>
            </div>
            <div>
              <div>Sudah punya akun Shopee? Jika belum, lakukan pendaftaran terlebih dahulu atau klik link berikut <div class="color-primary pointer" @click="signupShopee">Daftar Shopee</div></div>
            </div>
          </div>
          <div class="like-list--item">
            <div class="container-icon mr-8">
              <svg-icon icon-class="icon-clock-black" class="font-20"/>
            </div>
            <div>
              <div>Proses aktivasi akan berlangsung real time sehingga Anda tidak perlu menunggu</div>
            </div>
          </div>
          <div class="like-list--item">
            <div class="container-icon mr-8">
              <svg-icon icon-class="icon-check-circle" class="font-20"/>
            </div>
            <div>
              <div>Pihak Shopee memiliki hak penuh untuk menyetujui atau menolak pengajuan integrasi.</div>
            </div>
          </div>
        </div>
        <el-button
          class="btn-block color-shopee--bg color-white"
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
        class="dialog-shopee-authorization"
        append-to-body>
        <div slot="title" class="flex-container">
          <h4 class="dialog-title full-width">
            Otorisasi Shopee
          </h4>
          <!-- <div class="btn_save_dialog full-width text-right">
            <el-button type="info" @click="showSetup = false">{{ lang.cancel }}</el-button>
            <el-button type="success" @click="save">{{ rootLang.submit }}</el-button>
          </div> -->
        </div>
        <div>
          <div class="radius-10 flex-container justify-center">
            <img
                src="/static/img/service-activation/shopee/icon_integrate.png"
              />
          </div>
        </div>
        <div slot="footer" class="text-center">
          <div class="font-18">Silahkan melakukan otorisasi pada link berikut</div>
          <div class="mt-24 color-shopee--bg p-8 color-white radius-50 flex-container justify-center pointer" @click="autorizeShopee">
            <div class="overflow-ellipsis">{{ dataUrl }}</div>
            <div class="container-icon mr-8">
              <svg-icon icon-class="external-link" class="font-20"/>
            </div>
          </div>
        </div>
      </el-dialog>

      <el-dialog
        :visible.sync="showSetupSucces"
        width="536px"
        class="dialog-shopee-authorization--success"
        append-to-body>
        <div class="text-center">
          <img
            src="/static/img/service-activation/shopee/success_integrate.png"
          />
          <div class="font-18 mt-24">Year ! 🎉 Integrasi Shopee dan Olsera berhasil!</div>
        </div>
        <div slot="footer" class="text-center">
          <div class="mt-24 color-shopee--bg p-8 color-white radius-50 flex-container justify-center pointer" @click="autorizeShopee">
            <div class="full-width flex-container justify-center">
              <img
                src="/static/img/shopee.png"
              />
              Shopee
            </div>
            <div class="container-icon mr-8">
              <i class="el-icon-arrow-right"></i>
            </div>
          </div>
        </div>
      </el-dialog>
      
    </div>
  </el-dialog>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import { authorizationShopee } from '@/api/thirdParty/shopee'

export default {
  name: 'ShopeeDialogBeforeIntegration',

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
      showSetupSucces: false
    }
  },

  computed: {
    
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
      this.loadingGetStore = true
      authorizationShopee().then(async response => {
        this.dataUrl = response.data.data.redirect_url
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
      window.open('https://shopee.co.id/')
    },

    autorizeShopee () {
      window.open(this.dataUrl, "_self")
      // this.showSetup = false
      // this.showSetupSucces = true
    }
  }
}
</script>
