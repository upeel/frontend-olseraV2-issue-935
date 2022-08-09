<template>
  <div>
    <div class="flex-container radius-2 mb-12">
      <div class="font-24 font-semi-bold">
        Marketplace
      </div>
    </div>
    <!-- (item.alias_name === 'Tokopedia' && (tokpedShow || tokpedAccessByStore.includes(selectedStore.url_id)))  -->
    <div class="like-table-wrapper">
      <template
        v-for="item in dataItem">
        <div
          v-if="
            ((item.alias_name === 'Tokopedia' || item.alias_name === 'Shopee') && (tokpedShow)) ||
            (item.alias_name !== 'Tokopedia' && (stageLevel === 'sit' || stageLevel === 'dev'))
          "
          :key="item.id"
          class="like-table-wrapper--item">
          <el-avatar
            :src="item.photo"
            class="mr-4"
          />
          <div
            class="font-14 font-semi-bold"
            style="flex-grow: 1;">
            {{ item.alias_name }}
          </div>

          <!-- <template v-if="item.alias_name !== 'Tokopedia' || (stageLevel !== 'dev' && stageLevel !== 'sit')">
            <el-button
              v-if="!item.main_store.length"
              class="color-info"
              @click="handleIntegration(item.alias_name)">
              {{ rootLang.not_active }} <i class="el-icon-arrow-right"></i>
            </el-button>

            <el-button
              v-else-if="item.main_store[0].activation_status === 'P'"
              :loading="loading"
              type="info"
              @click="showOnProgress = true">
              <svg-icon icon-class="clock" class="font-16"/>
              {{ rootLang.on_progress }}
            </el-button>
            <div
              v-else-if="item.main_store[0].activation_status === 'A'"
              :loading="loading"
              class="pointer"
              @click="handleSetup(item)">
              <i class="el-icon-arrow-right"></i>
            </div>
          </template> -->

          <template>
            <el-button
              v-if="!item.main_store.length || !item.main_store[0].marketplace_account.length"
              class="color-info"
              @click="handleIntegration(item.alias_name)">
              {{ rootLang.not_active }} <i class="el-icon-arrow-right"></i>
            </el-button>

            <el-button
              v-else-if="getActivationStatus(item.main_store[0].marketplace_account) === 'P'"
              :loading="loading"
              type="info"
              @click="handleShowProgress(item)">
              <svg-icon icon-class="clock" class="font-16"/>
              {{ rootLang.on_progress }}
            </el-button>
            <div
              v-else-if="getActivationStatus(item.main_store[0].marketplace_account) === 'A'"
              :loading="loading"
              class="pointer"
              @click="handleSetup(item)">
              <i class="el-icon-arrow-right"></i>
            </div>
          </template>
          
        </div>
      </template>
    </div>

    <tokopedia-dialog-before-integration
      :show="visibleTokopediaBeforeIntegration"
      :loading-submit="loadingSubmit"
      :data-merchant="tokopediaMerchant"
      @cancel="visibleTokopediaBeforeIntegration = false"
      @submit="submitTokopedia"
    />

    <shopee-dialog-before-integration
      :show="visibleShopeeBeforeIntegration"
      :loading-submit="loadingSubmitShopee"
      @cancel="visibleShopeeBeforeIntegration = false"
      @submit="submitShopee"
    />

    <lazada-dialog-before-integration
      :show="visibleLazadaBeforeIntegration"
      :loading-submit="loadingSubmitLazada"
      @cancel="visibleLazadaBeforeIntegration = false"
      @submit="submitLazada"
    />

    <blibli-dialog-before-integration
      :show="visibleBliBliBeforeIntegration"
      :loading-submit="loadingSubmitBlibli"
      @cancel="visibleBliBliBeforeIntegration = false"
      @submit="submitBlibli"
    />

    <setup-token-pajak
      :show="visibleSetupToken"
      :data-taxation="tempTaxation"
      @cancel="handleClose"
    />

    <bukalapak-dialog-before-integration
      :show="visibleBukalapakBeforeIntegration"
      :loading-submit="loadingSubmitBukalapak"
      @cancel="visibleBukalapakBeforeIntegration = false"
    />

    <el-dialog
      :visible.sync="showOnProgress"
      title="Status Pengajuan"
      :show-close="true"
      :before-close="handleCloseShowProgress"
      append-to-body
      custom-class="without-padding">
      <div class="text-center p-32">
        <template v-if="dataMarketplace.main_store[0].marketplace_account.length > 0">
          <div v-for="item in dataMarketplace.main_store[0].marketplace_account" :key="item.id" >
            <div class="flex-container p-8 radius-5 pointer" @click="showOnProgressStore = true">
              <div class="mr-8">
                <el-avatar :src="item.photo !== null ? item.photo : '/static/img/tokopedia.png'" />
              </div>
              <div class="mr-8 font-bold">
                {{ item.shop_name }}
              </div>
              <div v-if="item.status === 'P'" class="text-right" style="flex-grow: 1;">
                {{ rootLang.pending }}
              </div>
            </div>
          </div>
        </template>

        <div v-if="dataMarketplace.main_store[0].marketplace_account.length < 4" class="mt-24 color-grey--bg text-left p-12 pointer radius-5" @click="handleIntegration(dataMarketplace.alias_name)">
          <i class="el-icon-plus font-18" />
          {{ lang.add }} {{ lang.account }}
        </div>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="showOnProgressStore"
      title="Status Pengajuan"
      :show-close="true"
      append-to-body
      custom-class="without-padding">
      <div class="text-center p-32">
        <div class="mr-8 mb-24">
          <svg-icon icon-class="icon-clock-black" class="font-56 color-grey--icon"/>
        </div>
        <span class="font-18">Sedang diproses</span>
        <div class="font-12">Tunggu ya... Waktu proses paling lama 1-3 hari kerja</div>
      </div>
    </el-dialog>

    <!-- <el-dialog
      :visible.sync="dialogSelectTokped"
      :show-close="true"
      append-to-body>
      <div class="text-center">
        <span class="font-24">Pilih akun Tokopedia</span>
        <div v-loading="loading" class="mt-24">
            <div v-for="(store, idx) in dataStoreTokped" :key="idx">
              <div class="flex-container p-8 color-info--bg mt-12">
                <div>
                  <el-avatar
                    :src="store.photo"
                    :size="32"
                    shape="circle"
                  />
                </div>
                <div class="full-width text-left px-8">
                  <span>{{ store.shop_name }}</span>
                </div>
                <div>
                  <el-button type="text" :loading="store.loadingProduct"  @click="syncDataProduct(idx)">
                    <svg-icon icon-class="refresh-ico" class="font-18" />
                  </el-button>
                </div>
              </div>
            </div>
          </div>
      </div>
    </el-dialog> -->

    <!-- <grabfood-dialog-integration
      ref="dialogIntegration"
      :data="foodDeliveryData"
      :show="visibleGrabfoodDialogIntegration"
      :branches="branches"
      :loading="loading"
      @cancel="visibleGrabfoodDialogIntegration = false"
      @submit="submit"
    /> -->
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import { mixinHiddenFeatureByPlanType } from '@/mixins/mixinHiddenFeatureByPlanType'

import TokopediaDialogBeforeIntegration from './tokopedia/dialogBeforeIntegration'
import ShopeeDialogBeforeIntegration from './shopee/dialogBeforeIntegration'
import BlibliDialogBeforeIntegration from './blibli/dialogBeforeIntegration'
import SetupTokenPajak from './badanperpajakan/setupTokenPajak'
import LazadaDialogBeforeIntegration from './lazada/dialogBeforeIntegration'
import BukalapakDialogBeforeIntegration from './bukalapak/dialogBeforeIntegration'

import { integrateMerchant } from '@/api/thirdParty/tokopedia'

export default {
  name: 'Marketplace',
  props: {
    dataItem: {
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
    },
    tokpedAccessByStore: {
      type: Array,
      default: () => []
    },
    shopeeAccessByStore: {
      type: Array,
      default: () => []
    }
  },

  components: {
    TokopediaDialogBeforeIntegration,
    ShopeeDialogBeforeIntegration,
    LazadaDialogBeforeIntegration,
    BlibliDialogBeforeIntegration,
    SetupTokenPajak,
    LazadaDialogBeforeIntegration,
    BukalapakDialogBeforeIntegration
  },

  mixins: [basicComputedMixin, mixinHiddenFeatureByPlanType],

  computed: {
    tokpedShow () {
      return !this.methodFeatureNameIsHidden('tokopedia-sales')
    },
    dataStoreTokped () {
      let data = []
      this.dataItem.map(i => {
        if (i.alias_name === 'Tokopedia') {
          data = [ ...i.main_store[0].marketplace_account]
        }
      })

      return data
    }
  },

  watch: {
    dataItem(data) {
      if (data && data.length) {
        this.data = { ...data[0] }

        data.map(i => {
          if (i.alias_name === 'Tokopedia') {
            this.tokopediaMerchant = [ ...i.main_store[0].marketplace_account]
          }
        })
      }
    }
  },

  data() {
    return {
      visibleTokopediaBeforeIntegration: false,
      visibleShopeeBeforeIntegration: false,
      visibleLazadaBeforeIntegration: false,
      visibleGrabfoodDialogIntegration: false,
      visibleBliBliBeforeIntegration: false,
      visibleLazadaBeforeIntegration: false,
      visibleBukalapakBeforeIntegration: false,
      visibleSetupToken: false,
      showOnProgress: false,
      data: {},
      loadingSubmit: false,
      loadingSubmitShopee: false,
      loadingSubmitLazada: false,
      loadingSubmitBukalapak: false,
      tempTaxation: {},
      active: 0,
      loadingSubmitBlibli: false,
      tokopediaMerchant: [],
      dialogSelectTokped: false,
      showOnProgressStore: false,
      dataMarketplace: {
        main_store: [
          {
            marketplace_account: []
          }
        ]
      }
    }
  },

  methods: {
    submitTokopedia (data) {
      this.loadingSubmit = true
      integrateMerchant(data).then(async response => {
        this.loadingSubmit = false
        this.visibleTokopediaBeforeIntegration = false
        this.$emit('refresh')
      }).catch(error => {
        this.loadingSubmit = false
        this.$message({
          type: 'error',
          message: error.string
        })
      })
    },

    submitShopee(){

    },

    checkIntegration (item) {
      let classInfo = ''
      classInfo = item.taxation.tax_submission === 1 && item.taxation.tax_activated === 1 ? 'like-table-wrapper--item pointer' : 'like-table-wrapper--item'
      return classInfo
    },

    getToken (item) {
      if (item.taxation.tax_submission === 1 && item.taxation.tax_activated === 1) {
        this.visibleSetupToken = true
        this.tempTaxation = { ...item}
      }
    },

    handleClose () {
      this.visibleSetupToken = false
      this.tempTaxation = {}
    },

    handleSetup (data) {
      // console.log('d', data)
      if (data.alias_name === 'Tokopedia') {
        this.checkTokpedLocalStore(data)
      } else {
        this.$emit('setup', data)
      }
    },

    handleIntegration (alias) {
      if (alias === 'Tokopedia') {
        if (this.selectedStore.plan_type_id !== 'P') {
          this.$store.dispatch('toggleUpgradeBanner', true)
          document.getElementById('app').classList.add('dummy-page')
        } else {
          this.visibleTokopediaBeforeIntegration = true
        }
      }
      if (alias === 'Shopee') { this.visibleShopeeBeforeIntegration = true }
      if (alias === 'BliBli') { this.visibleBliBliBeforeIntegration = true }
      if (alias === 'Lazada') { this.visibleLazadaBeforeIntegration = true }
      if (alias === 'Bukalapak') { this.visibleBukalapakBeforeIntegration = true }
    },

    checkTokpedLocalStore (data) {
      if (this.tokopediaActiveStore === null) {
        let activeData = []
        this.dataStoreTokped.map(i => {
          if (i.status === 'A') { activeData.push(i) }
        })
        if (activeData.length > 0) {
          this.$store.commit('SET_TOKOPEDIA_ACTIVE_STORE', activeData[0])
          this.$emit('setup', data)
        } else {
          this.$message({
            type: 'error',
            message: 'Tidak ada akun Tokopedia yang aktif, silahkan aktivasi lebih dahulu'
          })
        }
      } else if (this.tokopediaActiveStore !== null && this.tokopediaActiveStore.status === 'P') {
        let activeData = []
        this.dataStoreTokped.map(i => {
          if (i.status === 'A') { activeData.push(i) }
        })
        if (activeData.length > 0) {
          this.$store.commit('SET_TOKOPEDIA_ACTIVE_STORE', activeData[0])
          this.$emit('setup', data)
        } else {
          this.$message({
            type: 'error',
            message: 'Tidak ada akun Tokopedia yang aktif, silahkan aktivasi lebih dahulu'
          })
        }
      } else if (this.tokopediaActiveStore !== null && this.tokopediaActiveStore.status === 'A') {
        let activeData = []
        this.dataStoreTokped.map(i => {
          if (i.id === this.tokpedAccessByStore.id) {
            activeData.push(i)
          } else if (i.id !== this.tokopediaActiveStore && i.status === 'A') { activeData.push(i) }
        })
        if (activeData.length > 0) {
          this.$store.commit('SET_TOKOPEDIA_ACTIVE_STORE', activeData[0])
          this.$emit('setup', data)
        } else {
          this.$message({
            type: 'error',
            message: 'Tidak ada akun Tokopedia yang aktif, silahkan aktivasi lebih dahulu'
          })
        }
      }
    },

    getActivationStatus (item) {
      let statusActive = 'P'
      item.map(i => {
        if (i.status === 'A') { statusActive = 'A' }
      })

      return statusActive
    },

    handleShowProgress (data) {
      this.dataMarketplace = { ...data}
      this.showOnProgress = true
    },

    handleCloseShowProgress () {
      this.dataMarketplace = {
        main_store: [
          {
            marketplace_account: []
          }
        ]
      }
      this.showOnProgress = false
    },

    submitLazada() {
      // 
    },
    submitBlibli() {
      //
    }
  }
}
</script>