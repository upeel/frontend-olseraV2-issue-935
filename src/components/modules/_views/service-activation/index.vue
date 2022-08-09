<template>
  <div class="content-wrapper">
    <section
      class="content">
      <div v-if="isLoading" class="pb-24 container-828">
        <el-card class="box-card" shadow="never">
          <loading
            align="center"
            :active="true"
            color= '#1bb4e6'
            loader="spinner"
            :width="40"
            :height="40"
            backgroundColor='#ffffff'>
          </loading>
        </el-card>
      </div>

      <div
        v-for="item in groups"
        :key="item.id">
        <div
          class="pb-24 container-768 mt-16"
          v-if="item.name === 'Digital Payment' && (userRole.role_id === 'SP' || userRole.role_id === 'OW')">
          <digital-payment
            :listPayment="listDigiPay"
            :finishDigiPay="finishDigiPay"
            class="pb-24 container-768"
            @doneSubmit="fetchGroups"/>
        </div>
        <div
          v-else-if="item.name === 'Pendanaan' && userStore.role_id === 'OW'"
          class="pb-24 container-768 mt-16">
          <funding :items="item.thirdparty_items" />
        </div>
        <div
          v-else-if="item.name === 'Food Delivery' && !$isFeatureNameHiddenByPlanType(selectedStore.plan_type_id, '3rd-service-food-delivery')"
          class="pb-24 container-768 mt-16">
          <food-delivery
            :ref="'foodDelivery-' + item.id"
            :items="item.thirdparty_items"
            :branches="computedStoreBranches"
            :loading="loadingSubmit"
            @submit="refreshData"
            @check="handleCheck(item.id)"
            class="pb-24 container-828"
          />
        </div>
        <div v-else-if="
          item.name === 'Perpajakan' && accessByStore.includes(selectedStore.url_id) ||
          item.name === 'Perpajakan' && (stageLevel === 'dev' || stageLevel === 'sit')"
          class="pb-24 container-768 mt-16">
          <token-pajak
            :data-item="item.thirdparty_items"
            @refresh="refreshData"
          />
        </div>
        <div
          v-else-if="item.name === 'Marketplace'"
          class="pb-24 container-768 mt-16">
          <marketplace
            :data-item="item.thirdparty_items"
            :tokped-access-by-store="tokpedAccessByStore"
            :shopee-access-by-store="shopeeAccessByStore"
            @setup="handleSetup"
            @refresh="refreshData"
          />
        </div>
      </div>
    </section>

    <notif-cancel-grab
      :show="showNotif"
      :data="dataNotif"
      @close="showNotif = false"
    />

    <dialog-status
      :data="statusData"
      :show="visibleDialogStatus"
      @close="visibleDialogStatus = false"
    />

    <dialog-success-shopee
      :show="showShopeeSuccess"
      @close="refreshData"
    />

    <router-view @refresh="fetchGroups" />
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import { fetchByStore as fetchGroups } from '@/api/thirdParty/group'
import { fetchByStore as fetchGrabfoodStore } from '@/api/thirdParty/grabfood'
import { fetchBranches as fetchStoreBranches } from '@/api/store'
import { create } from '@/api/thirdParty/activation'
import { syncMerchantTokopedia } from '@/api/thirdParty/tokopedia'

import DigitalPayment from './_digital-payment'
import Funding from './_funding'
import FoodDelivery from './_food-delivery'
import TokenPajak from './_token-badanpajak'
import Marketplace from './_marketplace'
import DialogStatus from './_dialog-status'
import _marketplace from './_marketplace.vue'
import DialogSuccessShopee from './shopee/dialogSuccesIntegration.vue'
import Loading from 'vue-loading-overlay'
import NotifCancelGrab from './grabfood/pengajuan/_notif-cancel-grab.vue'

export default {
  components: {
    DigitalPayment,
    Funding,
    FoodDelivery,
    DialogStatus,
    TokenPajak,
    Marketplace,
    DialogSuccessShopee,
    Loading,
    NotifCancelGrab
  },

  mixins: [basicComputedMixin],

  data() {
    return {
      isLoading: false,
      storeBranches: [],
      listDigiPay: [],
      finishDigiPay: false,
      groups: [],
      loadingSubmit: false,
      statusData: {},
      visibleDialogStatus: false,
      showShopeeSuccess: false,
      showNotif: false,
      dataNotif: {}
    }
  },

  watch: {
    '$route' (to, from) {
      
      if(to !== from ) {
        // this.siteData = this.getSiteData();
        console.log('to', to)
        console.log('from', from)
        this.refreshData()
      }
    }
  },

  mounted() {
    this.fetchGroups()
    this.fetchStoreBranches()
    this.getAuthShopee()
    this.getRefresh()
    this.syncTokped()
  },

  computed: {
    computedStoreBranches() {
      const branches = [
        {
          store_id: this.$store.getters.selected_store.store_id,
          name: this.$store.getters.selected_store.name
        }
      ]
      this.storeBranches.map(item => {
        const obj = {
          store_id: item.id,
          name: item.name
        }
        branches.push(obj)
      })
      // console.log(branches)
      return branches
    },
    accessByStore () {
      return ['setdemo1', 'allinolsera2', 'cabangsupport3']
    },
    grabAccessByStore () {
      return ['setdemo1', 'olserapos', 'waroengdodo', 'teleponaku', 'paparisarumahkopi']
    },
    ewalletAccessByStore () {
      return ['setdemo1', 'cabangsupport3', 'allinolsera2', 'testdaftar41', 'demo6', 'olserapos', 'bdgdemoresto', 'bdgdemoretail']
    },
    tokpedAccessByStore () {
      return ['setdemo1', 
      'anonimcycle',
      'allinolsera2', 
      'shop', 
      'guideintegrasi', 
      'tenunsengkang', 
      'tigapasukanvape', 
      'skipaj', 
      'purnamaelektronik', 
      'demoretailmks',
      'olseradotcom',
      'ornith']
    },
    shopeeAccessByStore () {
      return ['setdemo1', 'allinolsera2']
    },
    stageLevel() {
      return process.env.ENV_CONFIG
    },
    userStore() {
      const selectedStore = this.$store.getters.selectedStore
      return {
        role_id: selectedStore.role_id,
        role_name: selectedStore.role_name,
        is_pos_only: selectedStore.is_pos_only,
        is_mobile: selectedStore.is_mobile,
        store_created: selectedStore.created_time
      }
    }
  },

  methods: {
    fetchGroups() {
      this.isLoading = true
      fetchGroups({
        sort_column: 'view_sort',
        sort_type: 'asc'
      }).then(response => {
        this.groups = response.data.data
        this.groups.map(i => {
          if (i.id === 1) {
            if(i.thirdparty_items === null){
              i.thirdparty_items = [
                {
                  alias_name: 'Grabfood',
                  id: 1,
                  photo: '',
                  main_store: null
                }
              ]
            } else{
              this.listDigiPay = i.thirdparty_items
              var paymentSubmit = 0;
              this.listDigiPay.forEach(payment => {
                if(payment.main_store.length !== 0){
                  paymentSubmit++
                }
                if(payment.alias_name === 'Ovo'){
                  payment.photo = "/static/img/service-activation/ovo.png"
                }else if(payment.alias_name === 'GoPay'){
                  payment.photo = "/static/img/service-activation/gopay.png"
                }else if(payment.alias_name === 'Dana'){
                  payment.photo = "/static/img/service-activation/dana.png"
                }else if(payment.alias_name === 'ShopeePay'){
                  payment.photo = "/static/img/service-activation/shopeePay.png"
                }else if(payment.alias_name === 'LinkAja'){
                  payment.photo = "/static/img/service-activation/linkAja.png"
                }
              });
              this.finishDigiPay = paymentSubmit === 0 ? false : true
            }
          } else if (i.id === 3 && i.thirdparty_items[0].main_store.length) {
            if (i.thirdparty_items[0].main_store[0].activation_status === 'R' || i.thirdparty_items[0].main_store[0].activation_status === 'X') {
              this.showNotif = true
              this.dataNotif = i.thirdparty_items[0].main_store[0]
            } else {
              this.showNotif = false
            }
          } else if (i.id === 5) {
            // mock data
            i.thirdparty_items.push({
              alias_name: 'BliBli',
              id: 14,
              main_store: [],
              photo: "/static/img/service-activation/blibli/blibli-icon.png",
              thirdparty_service_id: 5
            })
          }
        })
        this.isLoading = false
      }).catch(error => {
        this.groups = []
        this.$message({
          type: 'error',
          message: error.string
        })
        this.isLoading = false
      })
    },

    fetchStoreBranches() {
      fetchStoreBranches({
        per_page: 50
      }).then(response => {
        this.storeBranches = response.data.data
      }).catch(() => {
        this.storeBranches = []
      })
    },

    syncTokped() {
      syncMerchantTokopedia().then(response => {
        console.log('sync', response)
      }).catch((error) => {
        // this.storeBranches = []
        this.$message({
          type: 'error',
          message: error.string
        })
      })
    },

    async handleSubmit(data, itemId) {
      const submitData = { ...data }
      submitData.branchs = []
      this.loadingSubmit = true
      submitData.store_id = await this.$store.getters.selected_store.store_id
      await this.computedStoreBranches.map(item => {
        if (data.branches.includes(item.store_id)) {
          submitData.branchs.push({
            store_id: item.store_id,
            open_status: 2
          })
        }
      })
      if (submitData.branchs.length === 0) {
        delete submitData.branchs
      }
      await delete submitData.branches
      await create(submitData).then(response => {
        this.$message({
          type: 'success',
          message: 'Saved'
        })
        this.fetchGroups()
        this.fetchStoreBranches()
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
      })
      this.loadingSubmit = false
      this.$refs['foodDelivery-' + itemId][0].reset()
    },

    handleCheck(itemId) {
      this.loadingSubmit = true
      fetchGrabfoodStore().then(response => {
        this.statusData = response.data.data

        if (this.statusData.activation.activation_status === 'A') {
          this.$router.push({
            path: '/service-activation-v2/grabfood/setup/' + this.statusData.id
          })
        } else {
          this.visibleDialogStatus = true
        }
        this.loadingSubmit = false
      }).catch(() => {
        this.statusData = {}
        this.visibleDialogStatus = false
        this.loadingSubmit = false
      })
    },

    refreshData () {
      this.fetchGroups()
      this.fetchStoreBranches()

      this.showShopeeSuccess = false
    },

    handleSetup (data) {
      if (data.alias_name === 'Tokopedia') {
        this.$router.push({
          path: '/service-activation-v2/tokopedia/manage/'
        })
      }
      if (data.alias_name === 'Shopee') {
        this.$router.push({
          path: '/service-activation-v2/shopee/manage/'
        })
      }
      if (data.alias_name === 'Lazada') {
        this.$router.push({
          path: '/service-activation-v2/lazada/manage/'
        })
      }
      if (data.alias_name === 'Bukalapak') {
        this.$router.push({
          path: '/service-activation-v2/bukalapak/manage/'
        })
      }
    },

    getAuthShopee () {
      // if (this.$route.query.code && this.$route.query.shop_id) {
      //   this.showShopeeSuccess = true
      // }
      if (this.$route.query.marketplace === 'shopee' && this.$route.query.success === '1') {
        this.showShopeeSuccess = true
      }
      if (this.$route.query.marketplace === 'shopee' && this.$route.query.success === '2') {
        this.$message({
          type: 'success',
          message: this.$route.query.message
        })
      }
      if (this.$route.query.marketplace === 'shopee' && this.$route.query.success === '0') {
        this.$message({
          type: 'error',
          message: this.$route.query.message
        })
      }
    },

    getRefresh () {
      if (this.$route.query.refresh === '1') {
        console.log('lo', this.$route.query)
        this.refreshData()
      }
    }
  }
}
</script>
