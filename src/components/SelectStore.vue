<template>
<div class="login-page login-page--select-store preload">
  <div v-if="newStore" style="position: absolute;right: 20px;">
    <close-esc @close="cancel" />
  </div>
  <div
    class="container-login-page">
    <div
      v-loading="loading"
      class="login-form bg-f5">
      <div
        v-if="!newStore && userStores.length"
        class="flex-container--desktop flex-container--center"
        style="position: sticky">
        <div style="flex-grow: 1;">
          {{ rootLang.your_store }} ({{ userStores.length }}/{{ userStoresMeta.total }})
        </div>
        <div
          class="font-18 font-bold mb-12 pointer color-primary"
          @click="visibleDialogListBilling = true">
          {{ rootLang.my_billing }}
        </div>
      </div>

      <div
        v-if="!newStore"
        class="list-stores-container">
        <template v-if="userStores.length">
          <perfect-scrollbar style="height: 100%">
            <div
              v-for="(item, key) in userStores"
              :ref="'listStore' + item.url_id"
              :key="item.store_id"
              :style="item.background"
              :class="item.store_id === showStore.store_id ? 'color-primary--soft--bg' : ''"
              :tabindex="key + 1"
              class="box-in-loop pointer"
              style="outline: none !important"
              @focus="beforeGetSingleStore(item)"
              @keyup.enter="getSingleStore(item)"
              @click="beforeGetSingleStore(item)">
              <div class="item-flex">
                <div style="margin-right: 10px;">
                  <el-avatar
                    :alt="item.name"
                    :src="item.logo"
                    :size="32"
                    style="background: #EEEEEE"
                  />
                </div>
                <div style="flex-grow: 1;">
                  <div class="font-18 font-semi-bold">{{ item.name }}</div>
                  <span>{{ item.url_id + '.myolsera.com' }}</span>
                </div>
                <div
                  v-if="item.disable"
                  class="chip chip--default flex-container">
                  <svg-icon icon-class="alert-circle" class="mr-8" /> Dibekukan
                </div>
                <plan-type-chip
                  v-if="!item.disable && item.is_pos"
                  :plan-type-id="item.plan_type_id">
                  <span v-if="item.plan_type_id !== 'L'">
                    {{ item.pos_left }}
                  </span>
                  <span v-else>
                    Gratis
                  </span>
                </plan-type-chip>
                <plan-type-chip
                  v-if="!item.disable && !item.is_pos && item.is_onlineshop"
                  plan-type-id="is_onlineshop">
                  {{ item.store_left }}
                </plan-type-chip>
              </div>
            </div>

            <el-button
              v-if="userStores.length < userStoresMeta.total"
              :loading="loadingLoadMoreStores"
              type="primary"
              class="btn-block"
              @click="loadMoreStores">
              Load more
            </el-button>

            <el-divider />

            <el-button
              type="info"
              icon="el-icon-plus"
              class="btn-block mb-24"
              @click="newStore = true"
            />
          </perfect-scrollbar>
        </template>

        <template v-else>
          <div
            class="radius-16 box-shadow flex-container bg-white p-24"
            style="height: 98%;">
            <div
              class="text-center"
              style="flex: 1;">
              <div class="mb-8">
                {{ rootLang.store_not_found }}
              </div>
              <el-button
                type="success"
                icon="el-icon-plus"
                circle
                class="font-24"
                @click="newStore = true"
              />
              <div class="font-16 font-bold mb-8">
                {{ rootLang.create_store }}
              </div>

              <el-button @click="logOut">
                Logout
              </el-button>
            </div>
          </div>
        </template>
      </div>

      <div v-if="newStore">
        <signup-store
          :btn-loading="loadingFinallyCreateStore"
          :loading="loadingRegisterStore"
          :form="form"
          :business-types="businessTypes"
          @register="register"
          @cancel="cancel"
          @back="cancel"
        />
      </div>
    </div>

    <div
      v-loading="loading"
      :class="newStore ? 'login-banner p-null' : 'login-banner'">
      <div v-if="newStore" class="daftar-banner flex-container justify-center" style="width: 100%">
        <div>
          <svg-icon icon-class="store-new" class-name="icon-signup" style="font-size: 200px"/>
        </div>
      </div>
      <div v-else style="height: 100%">
        <div
          v-if="userStores.length"
          class="text-right font-bold font-18 color-primary pointer mb-12 flex-container" @click="showExtend">
          <div class="full-width" v-if="showStore.pos_freemium === 1">
            Upgrade Premium <i class="el-icon-plus"/>
          </div>
          <div class="full-width" v-else>
            Perpanjang Toko <i class="el-icon-plus"/>
          </div>
        </div>
        <div
          :class="userStores.length ? 'login-banner--card pointer' : 'login-banner--card'"
          :style="backgroundStore"
          @mouseover="changeColor"
          @mouseleave="reColor"
          @click="getSingleStore(showStore)">
          <div
            v-if="userStores.length"
            class="text-center"
            style="flex: 1;">
            <el-avatar
              :src="showStore.logo"
              :alt="showStore.name"
              :size="100"
              style="background: #EEEEEE"
            />
            <h5 class="color-body font-bold font-24 m-null">
              {{ showStore.name }}
            </h5>
            <div class="font-12 color-info mb-16">
              {{ showStore.role_name }}
            </div>

            <div v-if="!showStore.disable">
              <plan-type-chip
                v-if="showStore.is_pos"
                :plan-type-id="showStore.plan_type_id">
                <span v-if="showStore.plan_type_id !== 'L'">
                  {{ showStore.pos_left }}
                </span>
                <span v-else>
                  Gratis
                </span>
              </plan-type-chip>
              <div
                v-if="showStore.is_onlineshop"
                class="chip chip--ol">
                <img src="/static/img/store-types/icon-with-ol.png" class="mr-8" /> {{ showStore.store_left }}
              </div>
              <div
                v-if="showStore.is_mobile"
                class="chip chip--android">
                <img src="/static/img/store-types/icon-with-mobile.png" class="mr-8" /> {{ showStore.android_left }}
              </div>
              <div
                v-if="showStore.is_mobile"
                class="chip chip--default">
                <img src="/static/img/store-types/icon-with-mobile.png" class="mr-8" /> {{ showStore.ios_left }}
              </div>
            </div>

            <div
              v-if="showStore.disable"
              class="bg-f5 p-8 mt-8 radius-10 text-left font-14 color-body flex-container">
              <div>
                <div>Masa aktif dari toko anda sudah berakhir, silahkan melakukan perpanjangan aktifasi atau hubungi tim kami untuk bantuan</div>
              </div>
            </div>

            <div
              class="login-banner--card--footer radius-10" :style="backgroundStore">
              <div class="text-center">
                <el-button
                  v-if="!showStore.disable"
                  type="text"
                  class="m-null p-null"
                  @click="getSingleStore(showStore)">
                  {{ rootLang.signin_to_store }} <i class="el-icon-arrow-right" />
                </el-button>

                <div v-if="showStore.disable" class="flex-container">
                  <div class="full-width pr-4">
                    <el-button class="btn-block color-primary--soft--bg color-whatsapp--soft" @click="openWa">
                      <svg-icon icon-class="whatsapp-logo" /> Whatsapp
                    </el-button>
                  </div>
                  <div class="full-width pl-4">
                    <el-button class="btn-block color-primary--soft--bg" style="color: #03A84E" @click="openTalktow">
                      <svg-icon icon-class="message-circle" /> Live chat
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            v-else
            class="text-left"
            style="flex: 1;">
            Jika Anda tidak dapat menemukan toko Anda, mungkin toko tersebut telah nonaktif atau tidak diaktifkan selama lebih dari 2 bulan. Jika ini terjadi pada Anda, hubungi kami untuk mengaktifkan kembali toko tersebut.
          </div>
        </div>
      </div>
    </div>
  </div>

  <el-dialog
    :visible.sync="storeNull"
    :before-close="handleClose"
    :show-close="true"
    append-to-body>
    <div class="text-center">
      <div class="mb-24 word-break">Semua toko anda sudah expired, silahkan buat toko baru atau logout</div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="danger" class="btn-block" @click="logOut" :loading="loading">{{ $lang[langId].logout }}</el-button>
    </div>
  </el-dialog>

  <dialog-list-billing
    :payment-confirmed-data="paymentConfirmedData"
    :show="visibleDialogListBilling"
    @close="visibleDialogListBilling = false"
  />
</div>
</template>

<script>
import { HTTP } from 'src/http-common'
import { logout } from '@/api/auth'
import { newstore, getBusinessTypes } from '@/api/auth'
import SignupStore from './SignupStore'
import DialogListBilling from './DialogListBilling'
import DatePicker from 'components/modules/DatePicker'
import CloseEsc from '@/components/modules/CloseEsc'
import PlanTypeChip from '@/components/modules/planType/PlanTypeChip'
const moment = require('moment')

export default {
  components: {
    SignupStore,
    DatePicker,
    DialogListBilling,
    CloseEsc,
    PlanTypeChip
  },
  data() {
    return {
      singleStore: null,
      loading: false,
      businessTypes: [],
      form: {
        name_toko: '',
        url_id: '',
        business_type_id: '',
        service_type_id: 3,
        plan_type_id: 'F',
        country_id: 'ID',
        city_id: '',
        state_id: '',
        pos_resto_mode: 0,
        i_agree: 0,
        address: ''
      },
      createStore: false,
      newStore: false,
      btnCreate: true,
      showExpiredStore: false,
      showStore: {},
      counting: false,
      time: 0,
      displayStore: 'display: none',
      backgroundStore: 'background: #FFFFFF',
      visibleDialogListBilling: false,
      tableTotal: [],
      listPayment: {},
      tempConfirm: {
        bank_id: ''
      },
      showConfirm: false,
      date: '',
      paymentConfirmedData: null,
      loadingRegisterStore: false,
      loadingFinallyCreateStore: false,
      loadingLoadMoreStores: false,
      closeDialog: false
    }
  },
  computed: {
    token() {
      return this.$store.state.user.token
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    rootLang() {
      return this.$lang[this.langId]
    },
    loggedInUser() {
      return this.$store.getters.loggedInUser
    },
    userStores() {
      return this.$store.state.userStores.stores
    },
    userStoresMeta() {
      return this.$store.getters.storesMeta
    },

    storeNull () {
      let store = []
      this.userStores.map(i => {
        if (i.disable) {
          store.push(i)
        }
      })
      if (!this.closeDialog) {
        if (store.length === this.userStores.length) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    }
  },
  mounted() {
    // console.log('trace', this.$store)
    this.getBusinessTypes()
    if (this.$route.query.newstore) {
      this.newStore = true
    }
    if (this.userStores.length && !this.newStore) {
      this.showStore = this.userStores[0]
      this.$nextTick(() => {
        this.$refs['listStore' + this.showStore.url_id][0].focus()
      })
    }
  },
  methods: {
    beforeGetSingleStore(item) {
      this.showStore = { ...item }
    },
    getSingleStore(item) {
      if (item.store_id) {
        if (!item.disable) {
          if (
            item.role_id !== 'OW' && item.plan_type_id === 'L' && (
              !item.mobile_expiry_android && !item.mobile_expiry_ios
            )
          ) {
            const h = this.$createElement;
            this.$notify({
              type: 'warning',
              message: h('i', { class: 'color-warning font-16', style: 'margin-top: -10px' }, 'Hanya bisa diakses oleh owner'),
              customClass: 'color-warning--soft--bg notif-extend'
            })
          } else {
            if (item.plan_type_id === 'L' && item.role_id !== 'OW' && (
              item.mobile_expiry_android !== null && moment(item.mobile_expiry_android, 'YYYY-MM-DD').isBefore(moment()) &&
              item.mobile_expiry_ios !== null && moment(item.mobile_expiry_ios, 'YYYY-MM-DD').isBefore(moment())
            )) {
              this.$message({
                type: 'error',
                message: this.rootLang.you_arent_authorized
              })
              return
            }
            if (item.role_id === 'PO' || item.role_id === 'PS') {
              this.$message({
                type: 'error',
                message: this.rootLang.you_arent_authorized
              })
            } else {
              this.loading = true
              this.$store.dispatch('setSelectedStore', item.store_id).then(async response => {
                await this.$store.dispatch('customPermission/fetchRoles').then(() => {}).catch(() => {})
                this.getLocalization(item.lang_code)
                this.$router.push({
                  path: '/'
                })
                // this.loading = false
              }).catch(error => {
                this.loading = false
                this.$message({
                  type: 'error',
                  message: error.string
                })
              })
            }
          }
        }
      }
    },
    getBusinessTypes() {
      getBusinessTypes({ per_page: 100 }).then(response => {
        this.businessTypes = response.data.data
      })
    },
    cancel() {
      this.btnCreate = true
      this.newStore = false
      if (this.$store.getters.stores.length && this.$store.getters.selectedStore) {
        this.$router.push('/')
      }
    },
    register(service) {
      this.loadingFinallyCreateStore = true
      const data = Object.assign({}, this.form)
      data.user_id = this.loggedInUser.id
      data.plan_type_id = service.plan_type_id
      if (service.online_store === 1 && service.online_order !== 1) {
        data.service_type_id = 1
      } else if (service.online_store === 1 && service.online_order === 1) {
        data.service_type_id = 5
      } else if (service.online_store !== 1 && service.online_order === 1) {
        data.service_type_id = 4
      }
      // console.log('data', data)
      newstore(data).then(response => {
        this.btnCreate = true
        this.newStore = false
        this.loadingFinallyCreateStore = false
        // console.log('setEmptiness')
        // await this.$store.dispatch('setStoresEmpty')
        // this.$store.dispatch('setStores', 1, true).then(() => {
        //   // not blocking when request failed
        // }).catch(() => {
        //   // not blocking when request failed
        // })
        this.$store.dispatch('addStore', response.data.data)
        this.getSingleStore(response.data.data)
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.message,
          message: error.string
        })
        this.loadingFinallyCreateStore = false
      })
    },
    showStoreExp(item) {
      this.showStore = {}
      this.showStore = item
      var dateNow = new Date()
      var date = new Date(item.expiry_date)
      var expDate = date.getTime() + 60*24*60*60*1000
      this.time = expDate - dateNow
      this.displayStore = 'display: block'
    },
    changeColor() {
      this.backgroundStore = 'background: #E4F8FF'
    },
    reColor() {
      this.backgroundStore = 'background: #FFFFFF'
    },
    showExtend () {
      if (this.showStore.role_id === 'OW') {
        this.loading = true
        this.$store.dispatch('setSelectedStore', this.showStore.store_id).then(response => {
          this.$router.push(
            { 
              path: '/extendstore', 
              query: { path: this.showStore.store_id } 
            }
          )
          this.loading = false
        }).catch(error => {
          this.loading = false
          this.$message({
            type: 'error',
            message: error.string
          })
        })
      } else {
        const h = this.$createElement;
        this.$notify({
          type: 'warning',
          message: h('i', { class: 'color-warning font-16', style: 'margin-top: -10px' }, 'Hanya untuk pemilik'),
          customClass: 'color-warning--soft--bg notif-extend'
        })
      }
    },
    setPaymentConfirm(data) {
      this.paymentConfirmedData = data
    },
    gotoExtend () {
      this.$router.push('/extendstore')
    },
    logOut() {
      this.$store.dispatch('logout')
    },
    loadMoreStores() {
      this.loadingLoadMoreStores = true
      this.$store.dispatch('setStores', this.userStoresMeta.current_page + 1).then(() => {
        this.loadingLoadMoreStores = false
        this.closeDialog = false
      }).catch((error) => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingLoadMoreStores = false
      })
    },
    async getLocalization(langId) {
      this.loading = true
      let fallbackLangId = langId
      if (!fallbackLangId) {
        fallbackLangId = 'id'
      }
      await HTTP.get('localization').then(response => {
        this.$store.dispatch('setLangLocally', {
          id: fallbackLangId,
          lang: response.data[fallbackLangId].admin.all
        })
      }).catch(() => {
        //
      })
      this.loading = false
    },
    openWa () {
      window.open('http://bit.ly/olseraofficial')
    },
    openTalktow () {
      window.open('https://tawk.to/chat/5613725912c288fc1fd4ca94/default')
    },

    logOut() {
      this.loading = true
      logout().then(() => {
        this.loading = false
        this.$store.dispatch('logout')
      }).catch(error => {
        this.loading = false
        this.$message({
          type: 'error',
          message: error.string
        })
      })
    },

    handleClose () {
      this.closeDialog = true
    }
  }
}
</script>