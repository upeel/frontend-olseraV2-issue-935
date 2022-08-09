<template>
  <div
    v-loading="loadingSetting"
    id="settings"
    class="shippings">
    <div
      class="banner-dinein">
      <div class="text_banner" >
        <span class="title">Dine In</span>
        <div class="subtitle">{{ $lang[langId].subtitle_dinein_banner }}</div>
      </div>
      <el-button
        type="text"
        icon="el-icon-close"
        class="button-close-banner"
        @click="handleBanner"
      />
    </div>

    <el-card
      v-loading="loadingBanner"
      class="box-card el-card-null">
      <div class="flex-container p-20">
        <div class="container-icon">
          <svg-icon icon-class="icon-banner" class="font-20" />
        </div>
        <div class="full-width">
          <div class="font-14 font-semi-bold">{{ rootLang.banner_dinein }}</div>
          <span class="font-12 color-grey--placeholder">{{ rootLang.banner_dinein_note }}</span>
        </div>
        <div class="pointer" @click="showDialogLayout = true">
          <svg-icon icon-class="edit-2" class="font-20 color-primary"/>
        </div>
      </div>
      <div class="flex-container p-20 like-table-wrapper--item">
        <div class="container-icon">
          <svg-icon icon-class="icon-fork-dinein" class="font-20" />
        </div>
        <div class="full-width">
          <div class="font-14 font-semi-bold">Pengecekan Dine In</div>
          <span v-if="dataSetting.use_radius_checking_dinein === 1" class="font-12 color-grey--placeholder">{{ rootLang.use_radius }} (100m)</span>
          <span v-if="dataSetting.use_unique_code_checking_dinein === 1" class="font-12 color-grey--placeholder">{{ rootLang.use_unicode_checking }}</span>
        </div>
        <div class="pointer" @click="showDialogCheckDinein">
          <svg-icon icon-class="edit-2" class="font-20 color-primary"/>
        </div>
      </div>
    </el-card>

    <template>
      <div class="mt-24 font-20 font-bold">{{ rootLang.menu_book }}</div>
      <el-card
        class="box-card el-card-null mt-16">
        <div class="flex-container like-table-wrapper--item p-20">
          <div class="container-icon">
            <svg-icon icon-class="icon_product_price" class="font-20" />
          </div>
          <div class="full-width">
            <div class="font-14 font-semi-bold">{{ $lang[langId].show_menu_price }}</div>
            <span class="font-12 color-grey--placeholder">{{ dataSetting.show_price_book_menu ? $lang[langId].active : $lang[langId].inactive }}</span>
          </div>
          <div class="pointer">
            <el-switch
              v-model="dataSetting.show_price_book_menu"
              :active-value="1"
              :inactive-value="0"
              @change="save(7)">
            </el-switch>
          </div>
        </div>

        <div class="flex-container p-20">
          <div class="container-icon">
            <svg-icon icon-class="icon-banner" class="font-20" />
          </div>
          <div class="full-width">
            <div class="font-14 font-semi-bold">{{ rootLang.banner_menu_book }}</div>
            <span class="font-12 color-grey--placeholder">{{ rootLang.banner_dinein_note }}</span>
          </div>
          <div class="pointer" @click="sidebarBookMenu = true">
            <svg-icon icon-class="edit-2" class="font-20 color-primary"/>
          </div>
        </div>
      </el-card>
    </template>

    <div
      v-if="sidebarBookMenu"
      class="offscreen-right-sidebar">
      <div class="offscreen-right-sidebar--wrapper">
        <div class="offscreen-right-sidebar--header text-left">
          <span class="ml-8">Banner Buku Menu</span>
          <close-esc @close="sidebarBookMenu = false" />
        </div>
        <div>
          <div class="like-table-wrapper">
            <div v-for="(item, idx) in dataBanner" :key="idx" class="like-table-wrapper--item">
              <div v-if="!item.hide" class="flex-container full-width">
                <el-image
                  v-if="item.img"
                  :src="item.img"
                  fit="cover"
                  style="width: 50px; height: 50px;"
                />
                <div class="full-width ml-8">{{ item.value }}</div>
                <div v-loading="loadingBanner" class="container-icon color-primary pointer" @click="downloadBanner(item)"> <svg-icon icon-class="download" /> </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog 
      :visible.sync="dialogEditDineinCheck"
      :show-close="false"
      custom-class="dialog-card">
        <div slot="title" class="flex-container">
          <h4 class="dialog-title full-width">
            Pengecekan Dine In
          </h4>
          <div class="btn_save_dialog full-width text-right">
            <el-button type="info" @click="dialogEditDineinCheck = false">{{ lang.cancel }}</el-button>
            <el-button :loading="loadingDineinCheck" type="success" @click="save(5)" >{{ lang.save }}</el-button>
          </div>
        </div>
        <div>
          <div class="radius-10 color-grey--bg flex-container p-16">
            <div>
              <svg-icon icon-class="globe" class="font-20 color-grey--icon"/>
            </div>
            <div class="ml-8 word-break">
              Pengecekan Dine In dilakukan untuk mengetahui apakah pelanggan memesan langsung di toko Anda
            </div>
          </div>
          <div class="mt-16">
            <el-radio-group v-model="dineinChecking" class="full-width">
              <div class="flex-container mr-8 p-8 radio-custom--no-shadow" @click="handleSetDineinChecking(0)">
                <div class="font-16 font-bold full-width pointer">{{ rootLang.use_radius }} (100m)</div>
                <el-radio :label="0" :class="dineinChecking === 0 ? 'radio-custom-normal radio-custom-normal--is-checked--no-background' : 'radio-custom-normal'">
                  <span></span>
                </el-radio>
              </div>
              <div class="flex-container mr-8 mt-8 p-8 radio-custom--no-shadow" @click="handleSetDineinChecking(1)">
                <div class="font-16 font-bold full-width pointer">{{ rootLang.use_unicode_checking }}</div>
                <el-radio :label="1" :class="dineinChecking === 1 ? 'radio-custom-normal radio-custom-normal--is-checked--no-background' : 'radio-custom-normal'">
                  <span></span>
                </el-radio>
              </div>
            </el-radio-group>
          </div>
          <div v-if="dineinChecking === 1" class="mt-8 container-unicode-dinein">
            <div class="unicode full-width">{{ formEditDineinCheck.unique_code_checking_dinein }}</div>
            <div class="pointer" @click="refreshCode">
              <svg-icon icon-class="icon-material-refresh" class="font-32" />
            </div>
          </div>
        </div>
    </el-dialog>

    <!-- <el-dialog 
      :visible.sync="dialogBanner"
      :show-close="false"
      custom-class="dialog-card">
        <div slot="title" class="flex-container">
          <h4 class="dialog-title full-width">
            Banner Online Order
          </h4>
          <div class="btn_save_dialog full-width text-right">
            <el-button type="info" @click="handleCancelBanner">{{ lang.cancel }}</el-button>
            <el-button :loading="loadingQr" type="success" @click="save(3)" >{{ lang.save }}</el-button>
          </div>
        </div>
        <div>
          <div class="mt-16">
            <div class="font-12">{{ $lang[langId].link_order }}</div>
            <el-input v-model="formEdit.link_order" v-debounce:300ms="getQrcode" id="link_order">
              <div class="pointer mr-8" slot="suffix" @click="copyText">
                <svg-icon icon-class="feather-copy" class="font-20 color-primary mt-8" />
              </div>
            </el-input>
          </div>
          <div class="font-12 mt-16">{{ $lang[langId].qr_code_order }}</div>
          <div class="border border--input flex-container" style="align-items: unset !important">
            <div class="full-width">
              <img :src="dataQr.base64">
            </div>
            <div class="mt-8 mr-8 pointer" @click="downloadBase">
              <svg-icon icon-class="feather-download" class="font-20 color-primary" />
            </div>
          </div>
        </div>
    </el-dialog> -->

    <dialog-layout
      :show="showDialogLayout"
      @close="showDialogLayout = false" />

    <dialog-delivery-setting 
      ref="dialogdelivery"
     :show="showDialogDelivery"
     :data-setting="dataSetting"
     @close="handleCloseDeliverySetting"
     />

  </div>
</template>

<script>
const moment = require('moment-timezone')

import basicComputedMixin from '@/mixins/basicComputedMixin'
import { baseApi } from 'src/http-common'
import axios from 'axios'
// import GroupForm from './preview'
import CloseEsc from '@/components/modules/CloseEsc'
import DialogLayout from './setting/dialogLayout'
// import DialogTncStore from './setting/dialogTncStore'
import DialogDeliverySetting from './setting/dialogDeliverySetting'

import { downloadBannerBookMenu } from '@/api/onlineorder'

export default {
  name: 'SettingTheme',
  components: {
    DialogLayout,
    DialogDeliverySetting,
    CloseEsc
  },
  mixins: [basicComputedMixin],
  data() {
    return {
      loading: true,
      saved: false,
      data: [],
      dataSetting: {},
      processEnv: process.env,
      loadingBanner: false,
      showDialogLayout: false,
      dialogEditDineinCheck: false,
      formEditDineinCheck: {},
      loadingDineinCheck: false,
      dineinChecking: 0,
      showDialogDelivery: false,
      dataStore: {},
      sidebarBookMenu: false,
      loadingDownload: false,
      dataBanner: [
        {
          id: 'L',
          value: 'Landscape',
          img: '/static/img/online-order/buku-menu-landscape.png',
          hide: false
        },
        {
          id: 'P',
          value: 'Portrait',
          img: '/static/img/online-order/buku-menu-portrait.png',
          hide: false
        },
        {
          id: 'S',
          value: 'Square',
          img: '/static/img/online-order/buku-menu-square.png',
          hide: false
        },
        {
          id: 'Q',
          value: 'QR Only',
          img: '/static/img/online-order/buku-menu-qrcode.png',
          hide: false
        }
      ],
      loadingSetting: false
    }
  },

  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    token() {
      return this.$store.state.user.token
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    rootLang() {
      return this.$lang[this.$store.state.userStores.langId]
    },
    loggedInUser () {
      return this.$store.getters.loggedInUser
    }
  },

  mounted() {
    this.refreshView()
  },

  methods: {
    refreshView() {
      this.getSetting()
    },

    getSetting () {
      this.loadingSetting = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'online/settings'),
        headers: headers
      }).then(response => {
        this.dataSetting = response.data.data
        this.cancel_automatically = response.data.data.cancel_automatically
        this.radio = response.data.data.online_color_id
        var col = response.data.data.online_color.split(',')
        this.color1 = 'fill: ' + col[0]
        this.color2 = 'fill: ' + col[1]
        this.loadingSetting = false
        if (this.dataSetting.use_radius_checking_dinein === 1) {
          this.dineinChecking = 0
        }
        if (this.dataSetting.use_unique_code_checking_dinein === 1) {
          this.dineinChecking = 1
        }
        // this.getQrcode()
      }).catch(error => {
        // console.log(error)
        this.loadingSetting = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    save(setting) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      var data = {}
      if (setting === 5) {
        this.loadingDineinCheck = true
        if (this.dineinChecking === 0) {
          data = {
            use_radius_checking_dinein: 1
          }
        }
        if (this.dineinChecking === 1) {
          data = {
            use_radius_checking_dinein: 0,
            use_unique_code_checking_dinein: 1,
            unique_code_checking_dinein: this.formEditDineinCheck.unique_code_checking_dinein
          }
        }
      } else if (setting === 7) {
        this.loadingDomain = true
        data = {
          show_price_book_menu: this.dataSetting.show_price_book_menu
        }
      }
      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'online/settings'),
        headers: headers,
        data
      }).then(response => {
        this.refreshView()
        this.tempColor = {}
        this.$message({
          type: 'success',
          message: 'saved'
        })
        this.loading = false
        this.loadingDineinCheck = false
        this.dialogEditDineinCheck = false
      }).catch(error => {
        this.saved = false
        this.loading = false
        this.loadingDineinCheck = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    showDialogCheckDinein () {
      this.dialogEditDineinCheck = true
      this.formEditDineinCheck = { ...this.dataSetting}
    },

    randomString(len, charSet) {
      charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      var randomString = '';
      for (var i = 0; i < len; i++) {
          var randomPoz = Math.floor(Math.random() * charSet.length);
          randomString += charSet.substring(randomPoz,randomPoz+1);
      }
      return randomString;
    },

    refreshCode () {
      this.formEditDineinCheck.unique_code_checking_dinein = this.randomString(6)
    },

    handleSetDineinChecking (data) {
      if (data === 0) {
        this.dineinChecking = 0
        this.formEditDineinCheck.unique_code_checking_dinein = this.dataSetting.unique_code_checking_dinein
      }
      if (data === 1) {
        this.dineinChecking = 1
        if (this.formEditDineinCheck.unique_code_checking_dinein === null) {
          this.formEditDineinCheck.unique_code_checking_dinein = this.randomString(6)
        }
      }
    },

    handleCloseDeliverySetting () {
      this.showDialogDelivery = false
      this.refreshView()
    },

    handleBanner () {

    },

    downloadBanner (item) {
      this.loadingDownload = true
      let data = {
        type_baner: item.id === 'Q' ? 1 : 2,
        type_banner: item.id === 'Q' ? 1 : 2,
        type_orientation: item.id,
        is_preview: 1
      }
      if (item.id === 'Q') {
        this.$delete(data, 'type_orientation')
      }

      downloadBannerBookMenu(data).then(response => {
        let orientation = data.type_orientation === 'L' ? 'Landscape' : data.type_orientation === 'P' ? 'Portrait' : data.type_orientation === 'S' ? 'Square' : 'QR'
        let name = 'Banner - ' + orientation + ' - Menu Book.jpeg'
        var link = document.createElement('a')
        document.body.appendChild(link)
        link.setAttribute('href', response.data.data.base64)
        link.setAttribute('download', name)
        link.click()
        document.body.removeChild(link)
        this.loadingDownload = false
      }).catch(error => {
        // console.log('ee', error)
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loadingDownload = false
      })
    }
  }
}
</script>
