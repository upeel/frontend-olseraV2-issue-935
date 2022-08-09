<template>
  <div>
    <div class="font-24 font-semi-bold">
      {{ rootLang.food_delivery }}
    </div>

    <div class="like-table-wrapper">
      <div
        v-loading="loading"
        v-for="item in items"
        :key="item.id"
        class="like-table-wrapper--item pointer"
        @click="handleClick(item)">
          <el-avatar
            :src="item.photo"
            class="mr-4"
          />
          <div
            class="font-14 font-semi-bold"
            style="flex-grow: 1;">
            {{ item.alias_name }}
          </div>

          <el-button
            v-if="!methodCheckStatus(item)"
            type="primary"
            @click="handleBeforeIntegration(item)">
            {{ rootLang.propose }} <i class="el-icon-arrow-right"></i>
          </el-button>

          <!-- <el-button
            v-else
            :loading="loading"
            @click="fetchCheck">
            {{ methodCheckStatus(item).activation_status_desc }}
            <i class="el-icon-arrow-right"></i>
          </el-button> -->
          <div
            v-else
            :loading="loading"
            class="pointer">
            <!-- {{ methodCheckStatus(item).activation_status_desc }} -->
            <i class="el-icon-arrow-right"></i>
          </div>
      </div>
    </div>

    <el-dialog
      :visible.sync="showGrabAvailableMerchant"
      :before-close="cancel"
      width="536px"
      append-to-body
      custom-class="dialog-setup-grab">
      <div class="word-break">
        <div>Apakah Restoran ini sudah memiliki akun Merchant ID GrabFood?</div>
        <div class="mt-16">
          <el-radio-group v-model="storeHasGrab" class="full-width">
            <div class="flex-container mr-8 p-8" :class="storeHasGrab === 0 ? 'radio-custom radio-custom--is-checked' : 'radio-custom'" @click="storeHasGrab = 0">
              <el-radio :label="0" :class="storeHasGrab === 0 ? 'radio-custom-normal radio-custom-normal--is-checked' : 'radio-custom-normal'" style="margin-right: unset">
                <span></span>
              </el-radio>
              <div class="font-16 font-bold full-width pointer">{{ rootLang.not_yet }}</div>
            </div>
            <div class="flex-container mr-8 mt-8 p-8" :class="storeHasGrab === 1 ? 'radio-custom radio-custom--is-checked' : 'radio-custom'" @click="storeHasGrab = 1">
              <el-radio :label="1" :class="storeHasGrab === 1 ? 'radio-custom-normal radio-custom-normal--is-checked' : 'radio-custom-normal'" style="margin-right: unset">
                <span></span>
              </el-radio>
              <div class="font-16 font-bold full-width pointer">{{ rootLang.already }}</div>
            </div>
          </el-radio-group>
        </div>
        <div class="mt-24">
          <el-button class="btn-block color-grabfood--bg" @click="handleShowBeforeIntegrationv2">
            {{ rootLang.next }} →
          </el-button>
        </div>
      </div>
    </el-dialog>

    <grabfood-dialog-before-integration
      :show="visibleGrabfoodDialogBeforeIntegration"
      :store-has-grab="storeHasGrab"
      @cancel="visibleGrabfoodDialogBeforeIntegration = false"
      @submit="handleShowIntegrationv2"
    />

    <grabfood-dialog-before-integration-v2
      ref="dialogBeforeIntegration"
      :show="visibleGrabfoodDialogBeforeIntegrationV2"
      :store-has-grab="storeHasGrab"
      :loading="loadingSubmit"
      @cancel="visibleGrabfoodDialogBeforeIntegrationV2 = false"
      @submit="handleSubmit"
    />

    <grabfood-dialog-integration
      ref="dialogIntegration"
      :data="foodDeliveryData"
      :show="visibleGrabfoodDialogIntegration"
      :branches="branches"
      :loading="loadingSubmit"
      @cancel="visibleGrabfoodDialogIntegration = false"
      @submit="submit"
    />

    <grabfood-dialog-integration-v2
      ref="dialogIntegrationV2"
      :data="foodDeliveryData"
      :data-store="dataStore"
      :show="visibleGrabfoodDialogIntegrationV2"
      :branches="branches"
      :loading="loading"
      :store-has-grab="storeHasGrab"
      :store-has-integrated-before="storeHasIntegratedBefore"
      :data-activation="dataActivation"
      @cancel="visibleGrabfoodDialogIntegrationV2 = false"
      @submit="handleSuccesActivated"
    />

    <el-dialog
      :visible.sync="showDialogSuccesActivated"
      :show-close="false"
      width="536px"
      append-to-body>
      <div class="text-center">
        <img src="/static/img/service-activation/grab/icon_pending_activation.png" >
        <div class="font-18 mt-24">Pengajuan GrabFood diproses</div>
        <div class="font-12">Tunggu ya... Waktu proses paling lama 30 hari jam kerja</div>
        <div class="mt-24">
          <el-button class="color-grabfood--bg btn-block" @click="submit">OK</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import GrabfoodDialogBeforeIntegration from './grabfood/dialogBeforeIntegration'
import GrabfoodDialogBeforeIntegrationV2 from './grabfood/dialogBeforeIntegrationV2'
import GrabfoodDialogIntegration from './grabfood/dialogIntegration'
import GrabfoodDialogIntegrationV2 from './grabfood/dialogIntegrationV2'
import basicComputedMixin from '@/mixins/basicComputedMixin'
import store from '../../../../store'

import { fetch as fetchStore } from '@/api/generalsetting'
import { fetchSingle as getDataActivation } from '@/api/thirdParty/activation'

export default {
  props: {
    items: {
      type: Array,
      default: null
    },
    branches: {
      type: Array,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  components: {
    GrabfoodDialogBeforeIntegration,
    GrabfoodDialogBeforeIntegrationV2,
    GrabfoodDialogIntegration,
    GrabfoodDialogIntegrationV2
  },

  mixins: [basicComputedMixin],

  data() {
    return {
      visibleGrabfoodDialogBeforeIntegration: false,
      visibleGrabfoodDialogBeforeIntegrationV2: false,
      visibleGrabfoodDialogIntegration: false,
      showGrabAvailableMerchant: false,
      storeHasGrab: 0,
      visibleGrabfoodDialogIntegrationV2: false,
      dataStore: {},
      loadingSubmit: false,
      showDialogSuccesActivated: false,
      dataActivation: {},
      storeHasIntegratedBefore: 0
    }
  },

  computed: {
    foodDeliveryData() {
      if (this.items) {
        return this.items.filter(item => {
          return item.name === 'Food Delivery'
        })
      } else {
        return {}
      }
    },

    grabAcces() {
      return ['setdemo1', 
      'allinolsera2', 
      'cabangsupport3', 
      'testdaftar41', 
      'demo6', 
      'olserapos', 
      'bdgdemoresto', 
      'bdgdemoretail',
      'cobagrab',
      'devtesttwa',
      'cobagrab2',
      'cobagrab3',
      'cobagrab4',
      'cobagrab5']
    }
  },

  methods: {
    handleBeforeIntegration(item) {
      // console.log(item)
      if (this.selectedStore.owner !== null && this.selectedStore.owner.name.length > 1) {
        // if (this.grabAcces.includes(this.selectedStore.url_id)) {
          this.showGrabAvailableMerchant = true
        // } else {
        //   this.visibleGrabfoodDialogBeforeIntegration = true
        // }
      } else {
        this.$notify({
          type: 'warning',
          title: 'Hak akses pemilik yang terdaftar disistem tidak ditemukan,',
          message: 'silahkan menghubungi personil Olsera'
        })
      }
    },

    submit() {
      this.showDialogSuccesActivated = false
      this.dialogIntegration = false
      this.$emit('submit')
    },

    fetchCheck() {
      this.$emit('check')
    },

    methodCheckStatus(item) {
      if (item.main_store && item.main_store.length) {
        let stores = {} 
        item.main_store.map(i => {
          if (i.store_id === this.selectedStore.store_id) {
            stores = i
          }
        })
        // console.log('trace', stores.activation_status)
        if (stores.activation_status === 'P') {
          stores.activation_status_desc = 'Pending'
        } else if (stores.activation_status === 'A') {
          stores.activation_status_desc = 'Active'
        } else if (stores.activation_status === 'X' || stores.activation_status === 'R') {
          return null
        } else {
          stores.activation_status_desc = null
        }
          return stores
      } else {
        return null
      }
      // return null
    },

    reset() {
      this.$refs.dialogIntegration.reset()
      this.visibleGrabfoodDialogBeforeIntegration = false
      this.visibleGrabfoodDialogIntegration = false
    },

    handleClick (item) {
      if (!this.methodCheckStatus(item)) {
        this.handleBeforeIntegration(item)
      } else {
        this.fetchCheck()
      }
    },

    cancel () {
      this.storeHasGrab = 0
      this.showGrabAvailableMerchant = false
    },

    handleSubmit () {
        this.getStoreData()
      // this.visibleGrabfoodDialogIntegrationV2 = true
    },

    async getStoreData() {
      this.loadingSubmit = true
      await fetchStore().then(response => {
        this.dataStore = response.data.data
        this.loadingSubmit = false
        // this.visibleGrabfoodDialogBeforeIntegrationV2 = false
        // this.visibleGrabfoodDialogIntegrationV2 = true
        // this.$refs.dialogIntegrationV2.checkAddressDetail(this.dataStore)
        this.checkHasIntegrated()
      }).catch(error => {
        this.loadingSubmit = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    checkHasIntegrated() {
      if (this.items[0].main_store.length && (this.items[0].main_store[0].activation_status === 'X' || this.items[0].main_store[0].activation_status === 'R')) {
        this.loadingSubmit = true
        getDataActivation(this.items[0].main_store[0].id).then(response => {
          this.dataActivation = response.data.data.document
          this.dataActivation.periods = response.data.data.periods
          this.dataActivation.activation_id = this.items[0].main_store[0].id
          this.storeHasIntegratedBefore = 1
          this.dataStore.state_id = this.dataActivation.store_address.province_id
          this.dataStore.country_id = this.dataActivation.store_address.country_id
          this.dataStore.address = this.dataActivation.store_address.address
          this.dataStore.rt = this.dataActivation.store_address.rt
          this.dataStore.rw = this.dataActivation.store_address.rw
          this.dataStore.postal_code = this.dataActivation.store_address.postal_code
          this.dataStore.village = this.dataActivation.store_address.village
          this.dataStore.email = this.dataActivation.owner.email
          this.dataStore.phone_1 = this.dataActivation.owner.owner_phone_number
          this.visibleGrabfoodDialogBeforeIntegrationV2 = false
          this.visibleGrabfoodDialogIntegrationV2 = true
          this.$refs.dialogIntegrationV2.checkAddressDetail(this.dataStore)
          if (this.storeHasGrab === 1) {
            this.$refs.dialogIntegrationV2.setFormGrab(this.dataActivation)
          }
          this.loadingSubmit = false
        }).catch(error => {
          this.loadingSubmit = false
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        })
      } else {
        this.visibleGrabfoodDialogBeforeIntegrationV2 = false
        this.visibleGrabfoodDialogIntegrationV2 = true
        this.$refs.dialogIntegrationV2.checkAddressDetail(this.dataStore)
      }
    },

    handleSuccesActivated () {
      this.showDialogSuccesActivated = true
      this.visibleGrabfoodDialogIntegrationV2 = false
    },

    handleShowBeforeIntegrationv2 () {
      this.visibleGrabfoodDialogBeforeIntegrationV2 = true
      this.showGrabAvailableMerchant = false
      this.$refs.dialogBeforeIntegration.refreshData()
    },

    handleShowIntegrationv2 () {
      this.visibleGrabfoodDialogBeforeIntegration = false
      this.visibleGrabfoodDialogIntegration = true
    }
  }
}
</script>
