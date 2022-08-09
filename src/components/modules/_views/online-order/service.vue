<template>
  <div class="shippings">
    <div
      v-if="bannerOrder"
      class="card_banner"
      style="background-image: url(/static/img/info-service.svg);">
      <!-- <div style="float: right; position: relative; float: right; margin-right: 30px; margin-top: -120px;">
        <el-button style="background: #1685C7; color: #FFFFFF;">{{ $lang[langId].register_premium }}</el-button>
      </div> -->
      <div class="text_banner">
        <span class="title">{{ $lang[langId].title_banner_service }}</span>
        <div v-if="selectedStore.pos_resto_mode === 1" class="subtitle">{{ $lang[langId].subtitle_banner_service }}</div>
        <div v-else class="subtitle">{{ $lang[langId].subtitle_banner_service1 }}</div>
      </div>

      <el-button
        type="text"
        icon="el-icon-close"
        class="button-close-banner"
        @click="handleBanner"
      />
    </div>

    <template v-if="stageLevel === 'sit' || stageLevel === 'dev'">
      <div
        class="flex-container radius-5 mb-12 p-12"
        style="background: #EDF7E9">
        <div class="flex-container">
          <div class="mr-4">
            <el-avatar
              :alt="selectedStore.name"
              :src="selectedStore.logo"
            />
          </div>
          <div style="margin-right: 4px;">
            <div style="font-size: 18px">{{ selectedStore.name }}</div>
            <div
              ref="url_dinein"
              style="font-size: 12px; color: #767676">
              <span v-if="!dataSetting.ext_domain">
                {{ selectedStore.url_id + '.antarinmakan.com'}}
              </span>
              <span v-else>
                {{ dataSetting.ext_domain }}
              </span>
            </div>
          </div>
        </div>
        <div class="flex-grow-1"></div>
        <div class="flex-container">
          <div class="mr-12">
            <el-button
              type="text"
              class="mr-4"
              @click="copyText('url_dinein')">
              <div class="flex-container">
                <svg-icon icon-class="feather-copy" style="width:24px; height:24px; margin-right: 8px"/>
                Copy 
              </div>
            </el-button>
          </div>
          <el-dropdown
            trigger="click"
            @command="handleDropdownSection">
            <span class="el-dropdown-link font-18 color-primary">
              <svg-icon icon-class="share-2" stroke="#67C23A"></svg-icon>
              <span class="font-16 font-bold">Share</span>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="network in networkShare"
                :key="network.network"
                command="edit"
                style="padding: 10px 10px">
                <ShareNetwork
                    :network="network.network"
                    :url="dataSetting.ext_domain ? dataSetting.ext_domain : ''"
                    title=""
                    description="Hi! Ayo gabung bersama saya menggunakan Olsera. Premium, Kaya Fitur, Memuaskan. Aplikasi Kasir dengan fitur Delivery, Take Away plus Website yang benar-benar membantu. Murah mulai Rp 140.000/bulan. Eishh, juga tersedia plan Gratis untuk usaha yang baru rintis loh. Daftar di link ini untuk mendapatkan GRATIS coba dan Voucher Rp 218.000 untuk aktivasi tambahan. Masih tersedia, buruan! "
                    quote="Hi! Ayo gabung bersama saya menggunakan Olsera. Premium, Kaya Fitur, Memuaskan! Aplikasi Kasir dengan fitur Delivery, Take Away plus Website yang benar-benar membantu. Murah mulai Rp 140.000/bulan. Eishh, juga tersedia plan Gratis untuk usaha yang baru rintis loh. Daftar di link ini untuk mendapatkan GRATIS coba dan Voucher Rp 218.000 untuk aktivasi tambahan. Masih tersedia, buruan! "
                    hashtags="olsera" >
                    <div class="full-width" style="text-transform: capitalize">{{ network.network }}</div>
                </ShareNetwork>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </template>

    <template v-if="dataSetting.use_unique_code_checking_dinein === 1">
      <el-card>
        <div class="flex-container">
          <div style="width: 20%">Kode Dine In</div>
          <div v-loading="loadingCode" class="font-32 font-bold full-width text-center">{{ dataSetting.unique_code_checking_dinein }}</div>
          <div v-loading="loadingCode" class="pointer text-right" style="width: 20%" @click="refreshCode">
            <svg-icon icon-class="icon-material-refresh" class="font-24" />
          </div>
        </div>
      </el-card>
      <div class="mt-16 mb-24">
        <span class="font-12">Pelanggan harus memasukkan kode ini ketika memesan Dine In</span>
      </div>
    </template>

    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="tableData"
      :show-header="false"
      stripe
      class="mb-12">
      <el-table-column label="Service" width="200">
        <template slot-scope="scope">
          <span v-if="scope.row.active !== 0"> {{ scope.row.day }}</span>
          <span v-else style="opacity: 0.35;"> {{ scope.row.day }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Action" align="right" >
        <template slot-scope="scope">
          <div>
            <svg-icon v-if="scope.row.disable" icon-class="lock" class="color-info"></svg-icon>
            <el-switch v-model="scope.row.active" :disabled="scope.row.disable" :active-value="1" :inactive-value="0" @change="handleUpdateService(scope.row)"></el-switch>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div
      v-if="dataTerm.term_and_conditions[0] && selectedStore.pos_resto_mode === 1"
      class="color-info--bg flex-container radius-10 p-8">
      <div class="container-icon">
        <i class="el-icon-warning-outline" />
      </div>
      <div class="full-width">
        {{ 'Syarat & Ketentuan Layanan Online Order diperbarui tanggal ' + dataTerm.term_and_conditions[0].flast_updated }}
      </div>
      <el-button class="color-info--bg" @click="handleShowTerm"> Lihat </el-button>
    </div>

    <el-dialog 
      :visible.sync="dialogMdr"
      :show-close="false"
      :before-close="handleCloseMdr"
      width="720px"
      class="dialog-mdr">
        <div slot="title" class="flex-container">
          <div>
            <div class="color-white--bg mr-8 flex-container justify-center" style="border-radius: 50%; box-shadow: 0px 2px 2px #0000001F; height: 32px; width: 32px">
              <svg-icon :icon-class="stringTermCondition.icon" class="font-20"/>
            </div>
          </div>
          <h4 class="dialog-title full-width">
            {{ stringTermCondition.header }}
          </h4>
          <div class="btn_save_dialog text-right">
            <el-button type="success" :disabled="disableMdr" @click="beforenextUpdateService" >Selanjutnya</el-button>
          </div>
        </div>
        <perfect-scrollbar @ps-y-reach-end="handleScrollMdr" ref="scrollbar" class="scrollterm">
          <div class="px-32" v-html="stringTermCondition.content"></div>
        </perfect-scrollbar>
    </el-dialog>

    <el-dialog 
      v-if="dataTerm.term_and_conditions[0]"
      :visible.sync="dialogTermCondition"
      :show-close="false"
      :before-close="handleCloseMdr"
      width="720px"
      class="dialog-mdr">
      <div slot="title" class="flex-container">
        <h4 class="dialog-title full-width">
          {{ dataTerm.term_and_conditions[0].header }}
        </h4>
        <div class="btn_save_dialog full-width text-right">
          <el-button v-if="!downloadTerm" type="info" @click="handleCloseMdr">{{ $lang[langId].disagree }}</el-button>
          <el-button type="success" :disabled="disableAgree" :loading="loadingAccept" @click="acceptTermCondition" >{{ $lang[langId].agree }}</el-button>
        </div>
      </div>
      <perfect-scrollbar @ps-y-reach-end="handleScrollTerm" ref="scrollbarterm" class="scrollterm">
        <div class="px-32" v-html="dataTerm.term_and_conditions[0].content"></div>
      </perfect-scrollbar>
      <div v-if="downloadTerm" slot="footer" class="p-8 mr-8">
        <el-button type="text" @click="downloadTnc">
          <div class="flex-container color-black">
            <div class="container-icon">
              <svg-icon icon-class="Icon-feather-file" />
            </div>
            Download PDF
          </div>
      </el-button>
      </div>
    </el-dialog>

    <el-dialog 
      :visible.sync="dialogWhatsapp"
      :show-close="false"
      :close-on-click-modal="false"
      custom-class="dialog-card">
        <div slot="title" class="flex-container">
          <h4 class="dialog-title full-width">
            Lengkapi Informasi Toko
          </h4>
          <div class="btn_save_dialog full-width text-right">
            <el-button type="info" @click="handleCloseMdr(2)">{{ lang.cancel }}</el-button>
            <el-button :loading="loadingAuto" type="success" @click="handleSaveWa" >{{ lang.save }}</el-button>
          </div>
        </div>
        <div>
          <span class="font-18">Nomor Whatsapp</span>
          <div class="radius-10 color-grey--bg flex-container p-16 mt-16">
            <div>
              <svg-icon icon-class="ico-whatsapp" class="font-20 color-grey--icon"/>
            </div>
            <div class="ml-8 word-break">
              Nomor Whatsapp ini akan digunakan pelanggan untuk menghubungi toko Anda pada layanan Online Order
            </div>
          </div>
          <div class="mt-16 mb-24">
            <div class="font-12">Nomor Whatsapp</div>
            <phone-number-input
              v-model="whatsappnumber"
              :translations="{
                countrySelectorLabel: '',
                countrySelectorError: '',
                phoneNumberLabel: '',
                example: ''
              }"
              :only-countries="['ID', 'SG']"
              default-country-code="ID"
              @update="getPhone"
              class="field-register"
            />
          </div>
          <span class="font-18">Time Zone</span>
          <div class="radius-10 color-grey--bg flex-container p-16 mt-16">
            <div>
              <svg-icon icon-class="globe" class="font-20 color-grey--icon"/>
            </div>
            <div class="ml-8">
              Time zone ini digunakan sebagai acuan waktu pada layanan Online Order Anda
            </div>
          </div>
          <div class="mt-16">
            <span class="font-14">Waktu Sekarang</span>
            <div class="font-14">{{ computedGMT.time ? computedGMT.time : timeNow }}</div>
          </div>
          <div class="mt-16">
            <div class="font-12">Time zone</div>
            <el-select
              class="inline-form"
              style="width: 100% !important"
              v-model="formEditTimezone.timezone_id"
              filterable
              @change="setSelectedGMT"
              :placeholder="lang.please_select" size="small">
              <el-option
                v-for="item in dataZone"
                :key="item.id"
                :label="'(GMT ' + item.gmt_offset + ') ' + item.timezone"
                :value="item.id"
              />
            </el-select>
          </div>
        </div>
    </el-dialog>

    <setup-location
      v-show="handleShowProfile"
      :show-setup="handleShowProfile"
      :lang="lang"
      :lang-id="langId"
      @save="beforeSaveLocation"
      @close="handleCloseMdr(1)"
    />

  </div>
</template>
<script>
const moment = require('moment-timezone')
import basicComputedMixin from '@/mixins/basicComputedMixin'

import { baseApi } from 'src/http-common'
import axios from 'axios'
import SetupLocation from '../../dashboard/SetupLocation'
import { ShareNetwork } from 'vue-social-sharing'

import { cekTermCondition, acceptTermCondition, getSetting, downloadTnc } from '@/api/onlineorder'
import { getTimezone } from '@/api/generalsetting'
import { isHiddenByFeatureName } from '@/utils/hiddenFeaturesByPlanType'

export default {
  name: 'ServiceSetting',

  components: {
    SetupLocation,
    ShareNetwork
  },

  mixins: [basicComputedMixin],

  data() {
    return {
      tableData: [{
        day: 'Delivery',
        active: 0,
        key: 'use_delivery',
        disable: false,
        is_antarinbarang: true
      },
      {
        day: 'Buku Menu',
        active: 0,
        key: 'menu_book',
        disable: false,
        is_antarinbarang: false
      },
      {
        day: 'Take Away',
        active: 0,
        key: 'use_takeaway',
        disable: false,
        is_antarinbarang: true
      },
      {
        day: 'Dine In',
        active: 0,
        key: 'use_dinein',
        disable: false,
        is_antarinbarang: false
      },
      {
        day: 'Reservation',
        active: 0,
        key: 'use_reservation',
        disable: true,
        is_antarinbarang: false
      }],
      dialogEdit: false,
      dataServices: {},
      loading: false,
      dialogMdr: false,
      stringTermCondition: {},
      dataTerm: {
        term_and_conditions: []
      },
      dialogTermCondition: false,
      loadingAccept: false,
      disableMdr: true,
      disableAgree: true,
      handleShowProfile: false,
      dataStore: {},
      dialogWhatsapp: false,
      handleShowInputWa: false,
      whatsappnumber: null,
      downloadTerm: false,
      formEditTimezone: {},
      dataZone: [],
      loadingTimezone: false,
      selectedGMT: '',
      timeNow: moment().format('HH:mm a, dddd DD MMM YYYY'),
      loadingAuto: false,
      dataSetting: {},
      loadingCode: false,
      networkShare: [
        { network: 'whatsapp', name: 'Whatsapp', icon: 'fab fah fa-lg fa-whatsapp', color: '#25d366' },
        { network: 'facebook', name: 'Facebook', icon: 'fab fah fa-lg fa-facebook-f', color: '#1877f2' },
        { network: 'twitter', name: 'Twitter', icon: 'fab fah fa-lg fa-twitter', color: '#1da1f2' },
      ],
    }
  },

  computed: {
    lang() {
      return this.$store.state.userStores.lang
    },
    token() {
      return this.$store.state.user.token
    },
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    bannerOrder() {
      const localVisibleBanner = this.$store.state.bannerOnlineOrder.service
      if (localVisibleBanner) return parseInt(localVisibleBanner)
    },
    takeAway() {
      if (this.$store.getters.selectedStore.pos_freemium) {
        return true
      } else {
        return false
      }
    },
    visibleSetupLocation() {
      if (
        (this.dataStore.location_lat === '0.0000' &&
        this.dataStore.location_lon === '0.0000') ||
        !this.dataStore.address
      ) {
        return true
      } else {
        return false
      }
    },

    computedGMT () {
      if (this.selectedGMT) {
        const utcTime = moment.tz(this.timeNow)
        const time = utcTime.clone().tz(this.selectedGMT).format('HH:mm a, dddd DD MMM YYYY')
        const date = utcTime.clone().tz(this.selectedGMT).format('ddd, D MMMM YYYY')
        return {
          time,
          date
        }
      } else {
        return {}
      }
    },
  },
  watch: {
    '$store.getters.selectedStore': function () {
      this.getService()
    }
  },

  mounted () {
    this.getService()
    this.cekTermCondition()
    this.getStoreData()
    this.getSetting()
    this.getListTimezone()
  },

  methods: {
    getService() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'online/services'),
        headers: headers
        // params: param
      }).then(response => {
        this.dataServices = response.data.data
        if (this.selectedStore.pos_resto_mode === 0) {
          // this.tableData.splice(2, 2)
          let tempTable = [ ...this.tableData ]
          let tableTempt = []
          tempTable.map((i, idx) => {
            // if (i.key === 'use_reservation') { 
            //   this.tableData.splice(idx, 1)
            // } else if (!i.is_antarinbarang) {
            //   this.tableData.splice(idx, 1)
            // }
            if (i.is_antarinbarang) {
              tableTempt.push(i)
            }
          })
          this.tableData = [...tableTempt]
          console.log('aa', tableTempt)
        }
        // Hardcode
        // this.dataServices.show_term_conditions_delivery = 1
        // Hardcode
        this.tableData.map(i => {
          if (i.key === 'use_delivery') {
            i.active = response.data.data.use_delivery
          }
          if (i.key === 'use_dinein') {
            i.active = response.data.data.use_dinein
            i.disable = isHiddenByFeatureName(this.$store.getters.selectedStore.plan_type_id, 'online-order-dinein')
          }
          if (i.key === 'use_reservation') {
            i.active = response.data.data.use_reservation
          }
          if (i.key === 'use_takeaway') {
            i.active = response.data.data.use_takeaway
            i.disable = isHiddenByFeatureName(this.$store.getters.selectedStore.plan_type_id, 'online-order-takeaway')
          }
          if (i.key === 'menu_book') {
            i.active = response.data.data.active_book_menu
          }
        })
        this.loading = false
      }).catch(error => {
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
        this.loading = false
      })
    },

    cekTermCondition() {
      this.loading = true
      cekTermCondition().then(response => {
        this.dataTerm = response.data.data
        // Hardcode
        // this.dataTerm.show_rules = 1
        //
        this.loading = false
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loading = false
      })
    },

    acceptTermCondition() {
      this.loadingAccept = true
      acceptTermCondition().then(response => {
        this.loadingAccept = false
        this.dialogTermCondition = false
        this.dialogMdr = false
        this.updateService()
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loadingAccept = false
      })
    },

    handleUpdateService (data) {
      this.stringTermCondition = {}
      this.disableMdr = true
      this.disableAgree = true
      if (data.active === 1) {
          if (data.key === 'use_delivery') {
            this.dataServices.term_and_conditions.map(i => {
              if (i.id === 1) {
                this.stringTermCondition = i
                this.stringTermCondition.icon = 'icon-delivery-2'
                this.stringTermCondition.show_term = this.dataServices.show_term_conditions_delivery
                // this.stringTermCondition.show_term = 1
                this.dialogMdr = true
              }
            })
          } else if (data.key === 'use_takeaway') {
            this.dataServices.term_and_conditions.map(i => {
              if (i.id === 2) {
                this.stringTermCondition = i
                this.stringTermCondition.icon = 'icon-takeaway'
                this.stringTermCondition.show_term = this.dataServices.show_term_conditions_takeaway
                this.dialogMdr = true
              }
            })
          } else if (data.key === 'use_dinein') {
            this.dataServices.term_and_conditions.map(i => {
              if (i.id === 3) {
                this.stringTermCondition = i
                this.stringTermCondition.icon = ''
                this.stringTermCondition.show_term = this.dataServices.show_term_conditions_dinein
                this.dialogMdr = true
              }
            })
          } else if (data.key === 'use_reservation') {
            this.dataServices.term_and_conditions.map(i => {
              if (i.id === 4) {
                this.stringTermCondition = i
                this.stringTermCondition.icon = ''
                this.stringTermCondition.show_term = this.dataServices.show_term_conditions_reservation
                this.dialogMdr = true
              }
            })
          } else {
            this.updateService()
          }
      } else {
        this.updateService()
      }
    },

    beforenextUpdateService() {
      if (this.visibleSetupLocation) {
        this.dialogMdr = false
        this.handleShowProfile = true
      } else if (this.handleShowInputWa) {
        this.dialogMdr = false
        this.dialogWhatsapp = true
      } else {
        this.nextUpdateService()
      }
    },

    nextUpdateService () {
      this.$refs.scrollbar.$el.scrollTop = 0
      this.disableMdr = true
      this.disableAgree = true
      // if (this.stringTermCondition.show_term === 1) {
        this.dialogTermCondition = true
        this.dialogMdr = false
        this.$refs.scrollbarterm.$el.scrollTop = 0
      // } else {
      //   this.updateService()
      // }
    },

    updateService() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      var data = {}
      this.tableData.map(i => {
        if (i.key === 'use_delivery') {
          data.use_delivery = i.active
        }
        if (i.key === 'use_dinein') {
          data.use_dinein = i.active
        }
        if (i.key === 'use_reservation') {
          data.use_reservation = i.active
        }
        if (i.key === 'use_takeaway') {
          data.use_takeaway = i.active
        }
        if (i.key === 'menu_book') {
          data.active_book_menu = i.active
        }
      })

      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'online/services'),
        headers: headers,
        data: data
      }).then(response => {
        this.dataServices = response.data.data
        this.tableData.map(i => {
          if (i.key === 'use_delivery') {
            i.active = response.data.data.use_delivery
          }
          if (i.key === 'use_dinein') {
            i.active = response.data.data.use_dinein
          }
          if (i.key === 'use_reservation') {
            i.active = response.data.data.use_reservation
          }
          if (i.key === 'use_takeaway') {
            i.active = response.data.data.use_takeaway
          }
        })
        this.cekTermCondition()
        this.dialogMdr = false
        this.getStoreData()
        this.$message({
          type: 'success',
          message: 'saved'
        })
        this.loading = false
      }).catch(error => {
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
        this.loading = false
      })
    },

    handleBanner () {
      var data = {
        id: 3,
        value: 0
      }
      this.$store.commit('SET_BANNER_ORDER', data)
    },

    handleCloseMdr (setting) {
      this.disableMdr = true
      this.disableAgree = true
      if (!setting) {
        this.$refs.scrollbarterm.$el.scrollTop = 0
      } else if (setting === 1) {
        this.handleShowProfile = false
      } else if (setting === 2) {
        this.dialogWhatsapp = false
        this.whatsappnumber = 0
      }
      if (this.selectedStore.pos_resto_mode === 0) {
        this.tableData.splice(2, 2)
      }
      this.tableData.map(i => {
        if (i.key === 'use_delivery') {
          i.active = this.dataServices.use_delivery
        }
        if (i.key === 'use_dinein') {
          i.active = this.dataServices.use_dinein
        }
        if (i.key === 'use_reservation') {
          i.active = this.dataServices.use_reservation
        }
        if (i.key === 'use_takeaway') {
          i.active = this.dataServices.use_takeaway
          if (this.$store.getters.selectedStore.pos_freemium === 1) {
            i.disable = true
          } else {
            i.disable = false
          }
        }
      })
      this.downloadTerm = false
      this.dialogMdr = false
      this.dialogTermCondition = false
      this.stringTermCondition = {}
    },

    handleScrollMdr () {
      this.disableMdr = false
    },

    handleScrollTerm () {
      this.disableAgree = false
    },

    async getStoreData() {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'generalsetting/'),
        headers: headers
      }).then(response => {
        this.dataStore = response.data.data
        this.handleShowProfile = false
      })
      .catch(error => {
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    getSetting() {
      getSetting().then(response => {
        this.dataSetting = response.data.data
        if (this.dataSetting.show_info_whatsapp === 1) {
          this.handleShowInputWa = true
        }
      }).catch(error => {
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
        this.loading = false
      })
    },

    getPhone (value) {
      this.whatsappnumber = value.formattedNumber
    },

    beforeSaveLocation (data) {
      this.dataStore = data
      if (this.handleShowInputWa) {
        this.handleShowProfile = false
        this.dialogWhatsapp = true
      } else {
        this.saveLocation(data)
      }
    },

    handleSaveWa () {
      this.loadingAuto = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      var data = {
        whatsapp: this.whatsappnumber,
        timezone_id: this.formEditTimezone.timezone_id
      }

      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'online/settings'),
        headers: headers,
        data
      }).then(response => {
        this.$message({
          type: 'success',
          message: 'Nomor Whatsapp berhasil ditambah'
        })
        this.dataSetting = response.data.data
        this.dialogWhatsapp = false
        this.handleShowInputWa = false
        this.loadingAuto = false
        this.nextUpdateService()
      }).catch(error => {
        this.loadingAuto = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    saveLocation (data) {
      this.dataStore = data
      this.handleShowProfile = false
      this.nextUpdateService()
    },

    handleShowTerm () {
      if (this.$refs.scrollbarterm) {
        this.$refs.scrollbarterm.$el.scrollTop = 0
      }
      this.dialogTermCondition = true
      this.downloadTerm = true
    },

    downloadTnc() {
      downloadTnc().then((response) => {
        const fileName = 'Term_&_Condition_Online_Order.pdf'
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
      })
    },

    setSelectedGMT (data) {
      let gmt = this.dataZone.filter(i => { return i.id === data})
      this.selectedGMT = gmt[0].timezone
      // console.log('trace', time)
    },

    getListTimezone () {
      this.loadingTimezone = true

      let params = {
        per_page: 100
      }

      getTimezone(params).then(response => {
        this.dataZone = response.data.data
        this.loadingTimezone = false
      }).catch(error => {
        this.loadingTimezone = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    refreshCode () {
      this.dataSetting.unique_code_checking_dinein = this.randomString(6)
      this.updateCodeDinein()
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

    updateCodeDinein() {
      this.loadingCode = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      var data = {
        // use_radius_checking_dinein: 0,
        // use_unique_code_checking_dinein: 1,
        unique_code_checking_dinein: this.dataSetting.unique_code_checking_dinein
      }
      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'online/settings'),
        headers: headers,
        data
      }).then(response => {
        this.loadingCode = false
        this.dataSetting = { ...response.data.data}
        // this.$message({
        //   type: 'success',
        //   message: 'saved'
        // })
      }).catch(error => {
        this.loadingCode = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    handleShowWeb() {
      if (this.dataSetting.ext_domain === '') {
        window.open('https://' + this.selectedStore.url_id + '.antarinmakan.com', '_blank')
      } else {
        window.open('https://' + this.dataSetting.ext_domain, '_blank')
      }
    },

    copyText(dataId) {
      var str = this.$refs[dataId].textContent
      const el = document.createElement('textarea')
      el.value = str
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      this.$notify({
        type: 'info',
        message: 'Berhasil copy text'
      })
    },

    handleDropdownSection() {
      //
    }
  }
}
</script>
