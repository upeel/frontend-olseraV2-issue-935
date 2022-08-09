<template>
  <div>
    <el-dialog
      v-if="show"
      :visible.sync="show"
      :before-close="handleback"
      fullscreen
      append-to-body
      title="Upgrade Toko"
      class="wrapper-page-extendstore">

      <div class="container-page-extendstore mw-1200 pb-48">
        <!-- select store -->
        <div
          v-loading.fullscreen.lock="loading"
          class="radius-100 pos-relative palette-Grey-50 bg mb-24">
          <div
            class="p-8 d-block pointer"
            @click="visibleStoreList = !visibleStoreList">
            <div class="flex-container">
              <div class="mr-8">
                <el-avatar
                  :src="activeStore.logo"
                  :size="40"
                />
              </div>
              <div class="font-20 font-semi-bold mr-8">{{ activeStore.name }}</div>
              <i v-if="userStores && userStores.length > 1" class="el-icon-arrow-down icon-down-dropdown"></i>
            </div>
          </div>

          <transition name="el-zoom-in-top">
            <div
              v-if="userStores && userStores.length > 1"
              v-show="visibleStoreList"
              class="custom-dropdown-store--list box-shadow radius-16">
              <div
                v-for="item in userStores"
                :key="item.store_id"
                :style="item.background"
                class="p-8 pointer"
                @click="handleSelectStore(item)">
                <div class="flex-container">
                  <div class="mr-8">
                    <el-avatar :src="item.logo" />
                  </div>
                  <div class="mr-8 font-bold" style="flex-grow: 1;">
                    {{ item.name }}
                  </div>
                  <div v-if="!item.disable">
                    <plan-type-chip
                      :plan-type-id="item.plan_type_id">
                      {{ item.pos_left }}
                    </plan-type-chip>
                  </div>
                  <div
                    v-else
                    class="chip chip--default flex-container">
                    <div class="mr-8">
                      <svg-icon icon-class="alert-circle" />
                    </div>
                    Dibekukan
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <!-- pending data -->
        <div
          v-if="pendingData.length"
          class="flex-container color-warning--soft--bg color-warning p-16 radius-10 mb-16">
          <div class="mr-4">
            <svg-icon icon-class="clock" class="style-clock" style="font-size: 20px"/>
          </div>
          <div style="padding-left: 10px; flex-grow: 1; text-align: left">
            <div class="font-semi-bold notif-text-style">
              <span style="color: #000000">Anda memiliki Tagihan Tertunda dengan nomor </span>
              <el-button type="text" v-for="item in pendingData" :key="item.id" class="color-warning" style="height: 24px;" @click="showPendingBilling(item)">#{{ item.billing_no }}, </el-button>
              <span style="color: #000000"> Segera informasikan ke kami setelah melakukan pembayaran.</span>
            </div>
          </div>
        </div>

        <!-- options -->
        <el-row v-loading="loadingPackageTypes" :gutter="24" type="flex" class="mb-24">
          <el-col
            v-for="(item, itemKey) in storeTypes"
            :key="itemKey"
            :sm="8">
            <div class="radius-10 box-shadow container-package text-center">
              <div
                :style="{
                  background: 'transparent linear-gradient(180deg, ' + item.background_color + ' 0%, #FFFFFF00 100%) 0% 0% no-repeat padding-box'
                }"
                class="container-package__mask"
              />
              <div
                class="container-package__thumb"
                style="position: absolute; top: -45px; left: 0; width: 100%;">
                <el-avatar
                  :alt="item.name"
                  :size="72"
                  :src="'/static/img/store-types/icon-plan-' + item.id + '.png'"
                />
              </div>

              <!-- badge -->
              <div
                v-if="item.badge"
                class="container-package__ribbon">
                <div :class="'ribbon__' + item.id" class="ribbon">
                  <span>{{ item.badge }}</span>
                </div>
              </div>

              <div class="mb-16">
                <div
                  :style="{
                    color: item.color
                  }"
                  class="font-bold font-20">
                  {{ item.name }}
                </div>
                <div v-if="item.price > 0" class="color-black font-16 font-bold">
                  Rp. <span v-mask-money="item.price_per_month" /> / bulan
                </div>
                <div v-else class="font-16">
                  Gratis selamanya
                </div>
              </div>

              <div
                :class="!item.price_per_month ? 'd-none' : ''"
                class="color-info--bg px-8 py-12 btn-block radius-5 mb-16">
                <!-- <div class="font-12">
                  Hemat <span v-mask-money="parseInt((item.price_per_month * 12) - item.price)"></span> per tahun
                </div> -->
                <div class="font-12 color-info">
                  Hemat <span v-mask-money="parseInt((item.price_per_month * 12) - item.price)"></span> per tahun
                </div>
                <div class="font-14 font-bold">
                  Rp. <span v-mask-money="item.price" /> / Tahun
                </div>
              </div>

              <template
                v-if="(item.id === 'L' && parseInt($route.query.trial_upgrade) !== 0) || item.id !== 'L'">
                <el-button
                  v-if="activeStore.plan_type_id !== item.id"
                  :disabled="(!isUpgradeableTo(activeStore.plan_type_id, item.id) && !activeStore.is_store_can_upgrade_trial)"
                  :style="{
                    backgroundColor: item.color,
                    color: '#fff'
                  }"
                  size="large"
                  class="mb-16 btn-block font-16"
                  @click="handleVisibleDialogUpgrade(item)">
                  <span v-if="activeStore.is_store_can_upgrade_trial && computedCountTrialDays > 0 && parseInt($route.query.trial_upgrade) !== 0 && item.id !== 'L'">
                    Gratis Trial {{ computedCountTrialDays }} Hari
                  </span>
                  <span v-else-if="activeStore.plan_type_id === 'L' && item.id !== 'L' && parseInt($route.query.trial_upgrade) !== 0 && activeStore.is_store_can_upgrade_trial">
                    Coba Gratis
                  </span>
                  <span v-else-if="activeStore.plan_type_id !== 'L' && item.id === 'L' && parseInt($route.query.trial_upgrade) !== 0 && activeStore.is_store_can_upgrade_trial">
                    Coba Lite
                  </span>
                  <span v-else>
                    Upgrade
                  </span>
                </el-button>
                <el-button
                  v-else
                  size="large"
                  class="mb-16 btn-block font-16"
                  @click="handleVisibleDialogExtend(item)">
                  Paket Anda saat ini
                </el-button>
              </template>

              <div class="font-14 mb-16" v-html="item.desc" />

              <div v-for="i in item.features" :key="i" class="p-8">
                <div class="package-features-list flex-container">
                  <i
                    :style="{
                      color: item.color
                    }"
                    class="el-icon-check"
                  />
                  <div class="font-bold font-14">
                    {{ i }}
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>

        <!-- table perbandingan feature -->
        <table-features />
      </div>

      <!-- DIALOG UPGRADE -->
      <dialog-upgrade-store
        :show="visibleDialogUpgrade"
        :plan-type="selectedPlanType"
        :active-store="activeStore"
        @close="visibleDialogUpgrade = false"
        @done="handleDoneUpgrade"
      />

      <dialog-detail-payment
        :data="detailPayment"
        :show="visibleDialogDetailPayment"
        @cancel-upgrade="cancelUpgradeDetail"
        @close="visibleDialogDetailPayment = false"
      />

      <dialog-trx-payment-detail
        :detail-billing="pendingBilling"
        :show="visibleDialogTrxPaymentDetail"
        :table-total="tableTotal"
        :table-tax="tableTax"
        @cancel-upgrade="cancelUpgrade"
        @close="visibleDialogTrxPaymentDetail = false"
      />

      <dialog-upgrade-manual
        :show="visibleDialogUpgradeManual"
        @close="visibleDialogUpgradeManual = false"
      />

      <dialog-tax-option
        :show="visibleDialogTaxOption"
        :show-close="true"
        :loading="loadingOrder"
        @close="visibleDialogTaxOption = false"
        @next="handlePayAfterTax"
      />

      <dialog-choose-payment
        :show="visibleDialogChoosePayment"
        :data="detailProrate"
        :selected-plan-type="selectedPlanType"
        :selected-store="activeStore"
        :loading="loadingConfirmProrate"
        @close="visibleDialogChoosePayment = false"
        @confirm="confirmUpgradeProrate"
      />
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import {HTTP, BASE_URL} from '../http-common'
import DialogTrxPaymentDetail from '@/components/DialogTrxPaymentDetail'
import TableFeatures from '@/components/modules/extendStore/TableFeatures'
import DialogUpgradeStore from '@/components/modules/extendStore/DialogUpgradeStore'
import DialogUpgradeManual from '@/components/modules/extendStore/DialogUpgradeManual'
import DialogDetailPayment from '@/components/modules/extendStore/DialogDetailPayment'
import PlanTypeChip from '@/components/modules/planType/PlanTypeChip'
import { isUpgradeableTo } from '@/utils/hiddenFeaturesByPlanType'
import { FREE_TRIAL_DAYS } from '@/utils/constant'
import { upgradeStoreTrial, upgradeStoreWithProrate } from '@/api/storeBilling'
import DialogTaxOption from '@/components/modules/extendStore/DialogTaxOption'
import DialogChoosePayment from '@/components/modules/extendStore/DialogChoosePayment'

export default {
  name: 'ExtendStore',

  components: {
    DialogTrxPaymentDetail,
    TableFeatures,
    DialogUpgradeStore,
    DialogUpgradeManual,
    DialogDetailPayment,
    PlanTypeChip,
    DialogTaxOption,
    DialogChoosePayment
  },

  data() {
    return {
      show: false,
      visibleStoreList: false,
      isExtend: true,
      visibleDialogUpgrade: false,
      userStores: [],
      tempPackage: {
        pos: '',
        pos_price: '0',
        pos_package_id: '',
        online: '',
        online_price: '0',
        online_package_id: '',
        mobile: '',
        mobile_price: '0',
        mobile_package_id: '',
        total: 0,
        is_business_entity: null
      },
      activeStore: {},
      visibleDialogPayment: false,
      visibleDialogDetailPayment: false,
      visibleDialogTrxPaymentDetail: false,
      listDialog: true,
      loading: false,
      loadingOrder: false,
      pendingBilling: false,
      pendingData: [],
      pendingBilling: {},
      tableTotal: {},
      tableTax: [],
      visibleTaxoption: false,
      isHaveTax: null,
      yearOrMonth: 'Tahun',
      storeTypes: [],
      isUpgradeableTo,
      selectedPlanType: null,
      loadingPackageTypes: false,
      visibleDialogUpgradeManual: false,
      FREE_TRIAL_DAYS,
      detailPayment: {
        payment_mode: {
          bt_bank_name: ''
        }
      },
      visibleDialogTaxOption: false,
      visibleDialogChoosePayment: false,
      detailProrate: {},
      loadingConfirmProrate: false
    }
  },

  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    store() {
      return this.$store.state
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    rootLang() {
      return this.$lang[this.langId]
    },
    token() {
      return this.$store.state.user.token
    },
    userRole() {
      return this.$store.state.userStores.userRole
    },
    computedCountTrialDays() {
      if (this.activeStore.disable) {
        return 0
      }
      if (this.activeStore.plan_type_id !== 'L') {
        if (parseInt(this.activeStore.pos_left)) {
          return parseInt(this.activeStore.pos_left)
        } else {
          return 0
        }
      }
    }
  },

  mounted() {
    this.show = true
    // if (this.userRole && this.userRole.role_id === 'OW') {
      this.getUserStores()
      this.getPendingBilling()

      this.loadingPackageTypes = true
      axios.get('/static/data/package-types.json').then(response => {
        const storeTypes = []
        // console.log(process.env.ENV_CONFIG)
        response.data.map(item => {
          storeTypes.push(item)
        })
        this.storeTypes = storeTypes
        this.loadingPackageTypes = false
      }).catch(() => {
        this.loadingPackageTypes = false
      })
    // } else {
    //   this.$router.push({
    //     path: '/'
    //   })
    // }
  },

  methods: {
    getUserStores() {
      this.loading = true
      let paramsRequest = {
        headers: {
          'Authorization': 'Bearer ' + this.token.access_token
        },
        params: {
          per_page: 1000,
          sort_type: 'desc',
          sort_column: 'is_store_active'
        }
      }
      HTTP.get('api/store', paramsRequest).then(async response => {
        var st = await response.data.data
        await st.map((i, idx) => {
          // console.log('freemium', i.pos_freemium + ' ' + i.name)
          i.disable = false
          if (i.android_left_label === 'danger' && i.ios_left_label === 'danger' && i.pos_left_label === 'danger' && i.store_left_label === 'danger') {
            i.disable = true
          }

          if (idx %2 === 0) {
            i.background = 'background: #FFFFFF'
          } else {
            i.background = 'background: #F5F5F5'
          }

          i.showStore = {
            id: null,
            label: '',
            class: ''
          }
          if (i.pos_left_label !== 'danger') {
            i.showStore = {
              id: 1,
              label: i.pos_left,
              class: 'chip chip--pos'
            }
          } else if (i.store_left_label !== 'danger') {
            i.showStore = {
              id: 2,
              label: i.store_left,
              class: 'chip chip--ol'
            }
          } else if (i.android_left_label !== 'danger') {
            i.showStore = {
              id: 3,
              label: i.android_left,
              class: 'chip chip--android'
            }
          } else if (i.ios_left_label !== 'danger') {
            i.showStore = {
              id: 4,
              label: i.ios_left,
              class: 'chip chip--default'
            }
          }
        })
        this.userStores = st
        if (typeof this.$route.query.path !== 'undefined') {
          this.userStores.map(i => {
            if (i.store_id === parseInt(this.$route.query.path)) {
              // console.log('pada', i.store_id)
              this.activeStore = i
            }
          })
        } else {
          this.activeStore = this.userStores[0]
        }
        if (this.activeStore.pos_freemium === 1) {
          this.isExtend = false
        } else {
          this.isExtend = true
        }
        // this.showStore = response.data.data[0]
        this.loading = false
      }).catch(() => {
        // this.btnCreate = false
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    setActiveStore(data) {
      this.activeStore = { ...data }
    },
    handleback() {
      this.visibleDialogDetailPayment = false
      this.show = false
      if (this.$route.query && this.$route.query.redirect_to) {
        this.$router.push({
          path: this.$route.query.redirect_to
        })
      } else {
        this.$router.push('/selectstore')
      }
    },
    handleVisibleDialogUpgrade(payload) {
      if (
        (this.activeStore.plan_type_id !== 'L' && !this.activeStore.is_store_can_upgrade_trial) ||
        this.activeStore.disable ||
        !this.activeStore.is_store_can_upgrade_trial
      ) {
        this.handleUpgradeNonTrial(payload)
        return
      }
      // create upgrade invoice from dashboard
      if (
        (
          this.activeStore.plan_type_id === 'L' ||
          this.activeStore.is_store_can_upgrade_trial
        ) &&
          parseInt(this.$route.query.trial_upgrade) === 0
      ) {
        this.handleUpgradeNonTrial(payload)
        return
      }
      if (this.activeStore.is_store_can_upgrade_trial) {
        this.handleUpgradeStoreTrial(payload)
      } else {
        this.handleUpgradeNonTrial(payload)
      }
    },
    handlePayNow(tempPackage) {
      this.tempPackage = { ...tempPackage }
      this.visibleDialogUpgrade = false
      this.visibleTaxoption = true
    },
    showBilling() {
      this.$router.push(
        {
          path: '/selectstore',
          query: { path: true }
        }
      )
    },
    handleSelectStore (item) {
      this.setActiveStore(item)
      this.visibleStoreList = false
    },
    getPendingBilling() {
      var param = {
        search_column: 'status',
        search_text: 'P',
        sort_column: 'id',
        sort_type: 'desc'
      }
      let paramsRequest = {
        headers: {
          'Authorization': 'Bearer ' + this.token.access_token
        },
        params: param
      }
      HTTP.get('api/admin/v1/id/billings/order', paramsRequest).then(response => {
        this.pendingBilling = true
        response.data.data.map((i, idx) => {
          if (idx <= 2) {
            this.pendingData.push(i)
          }
        })
      }).catch(() => {
        this.pendingBilling = false
      })
    },
    externalLink(type) {
      if (type === 'android') {
        window.location.href = this.activeStore.link_android_app
      }
      if (type === 'ios') {
        window.location.href = this.activeStore.link_ios_app
      }
    },
    showPendingBilling(data) {
      let paramsRequest = {
        headers: {
          'Authorization': 'Bearer ' + this.token.access_token
        }
      }
      HTTP.get('api/admin/v1/id/billings/order/' + data.id, paramsRequest).then(response => {
        this.pendingBilling = response.data.data
        this.visibleDialogTrxPaymentDetail = true
        this.tableTotal = [
          {
            total_qty: response.data.data.total_qty,
            fprice: '',
            ftotal_amount: response.data.data.ftotal_amount 
          }
        ]
        this.tableTax = [
          {
            tax_amount: response.data.data.tax_amount,
            ftax_amount: response.data.data.ftax_amount 
          }
        ]
      }).catch(() => {
        // this.btnCreate = false
        // this.loadingBillingDetail = false
      })
    },
    cancelUpgrade() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'PUT',
        url: BASE_URL + 'api/admin/v1/id/billings/order/cancelled/' + this.detailPayment.id,
        headers: headers
      }).then(response => {
        // console.log('cancel billing', response)
        // this.$router.push('/selectstore')
        this.loading = false
        this.visibleDialogDetailPayment = false
        this.visibleDialogTrxPaymentDetail = false
      }).catch(() => {
        // this.btnCreate = false
        this.loading = false
      })
    },
    handleDoneUpgrade(payload) {
      this.detailPayment = { ...payload }
      this.visibleDialogUpgrade = false
      this.visibleDialogDetailPayment = true
    },
    cancelUpgradeDetail (data) {
      this.$notify({
        type: 'warning',
        message: 'Tagihan dengan no ' + data.billing_no + ' berhasil dibatalkan',
        customClass: 'color-warning--soft--bg notif-extend'
      })
      this.visibleDialogDetailPayment = false
    },
    handleVisibleDialogExtend(payload) {
      if (payload.id === 'L') {
        return
      }
      this.visibleDialogUpgrade = !this.visibleDialogUpgrade
      if (this.visibleDialogUpgrade) {
        this.selectedPlanType = { ...payload }
      } else {
        this.selectedPlanType = null
      }
    },
    handleUpgradeStoreTrial(payload) {
      this.loading = true
      upgradeStoreTrial({
        to_plan_type_id: payload.id
      }).then((response) => {
        this.$message({
          type: 'success',
          message: 'Trial succeeded'
        })
        this.$store.dispatch('setStorePlanType', response.data.data)
        this.loading = false
        this.handleback()
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loading = false
      })
    },
    handleUpgradeNonTrial(payload) {
      this.selectedPlanType = { ...payload }
      if (this.activeStore.plan_type_id === 'L' || this.activeStore.is_store_can_upgrade_trial) {
        this.visibleDialogUpgrade = true
      } else {
        this.visibleDialogTaxOption = true
      }
    },
    handlePayAfterTax(payload) {
      this.tempPackage.is_business_entity = payload.is_business_entity
      this.handleUpgradeStoreWithProrate()
    },
    handleUpgradeStoreWithProrate() {
      const data = {
        to_plan_type_id: this.selectedPlanType.id,
        is_create_billing: 0,
        payment_mode_id: 0,
        is_business_entity: this.tempPackage.is_business_entity
      }
      this.loadingOrder = true
      upgradeStoreWithProrate(data).then(response => {
        this.visibleDialogTaxOption = false
        this.visibleDialogChoosePayment = true
        this.detailProrate = response.data.data
        this.loadingOrder = false
      }).catch(error => {
        this.loadingOrder = false
        this.$message({
          type: 'error',
          message: error.string
        })
      })
    },
    confirmUpgradeProrate() {
      this.loadingConfirmProrate = true
      const data = {
        to_plan_type_id: this.selectedPlanType.id,
        is_create_billing: 1,
        payment_mode_id: 0,
        is_business_entity: this.tempPackage.is_business_entity
      }
      upgradeStoreWithProrate(data).then(response => {
        this.visibleDialogChoosePayment = false
        this.detailPayment = response.data.data
        this.visibleDialogDetailPayment = true
        this.loadingConfirmProrate = false
        this.$message({
          type: 'success',
          message: 'Success'
        })
      }).catch(error => {
        this.loadingConfirmProrate = false
        this.$message({
          type: 'error',
          message: error.string
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .container-package__ribbon {
    position: relative;
  }
  .ribbon {
    position: absolute;
    top: 0px;
    right: -40px;
    overflow: visible;
    font-size: 12px;
    line-height: 1;
    color: #000;
    font-weight: bold;
  }
  .ribbon span {
    display: block;
    position: relative;
    color: #000;
    overflow: visible;
    text-decoration: none;
    padding: 4px 8px;
    border-radius: 4px 4px 0 4px;
  }
  .ribbon span:after {
    /* this creates the "folded" part of our ribbon */
    content: "";
    height: 0;
    width: 0;
    display: block;
    position: absolute;
    bottom: -15px;
    right: 0;
    border-right: 15px solid transparent;
  }

  .ribbon__F span {
    background: #FFE42B;
  }
  .ribbon__F span:after {
    border-top: 15px solid #DEC30D;
  }
  .ribbon__P span {
    background: #F44336;
    color: #FFF;
  }
  .ribbon__P span:after {
    border-top: 15px solid #C81609;
  }
</style>
