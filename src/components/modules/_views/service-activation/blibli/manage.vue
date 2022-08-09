<template>
  <page-fullscreen
    title="BliBli"
    :body-style="{
      paddingBottom: 0
    }"
    @close="$router.push('/service-activation-v2')">
    <template #sticky-top>
      <div class="card-dual">
        <card-info
          v-loading="loadingDataMerchant"
          :title="dataMerchant.shop_name"
          :desc="dataMeta.total + ' Products'"
          thumbnail="/static/img/service-activation/blibli/blibli-icon.png"
          class="card-dual__item">
          <template #button>
            <el-button type="text" @click="handleInitSync">
              Sinkronkan produk <svg-icon icon-class="refresh-icon" />
            </el-button>
          </template>
        </card-info>
        <card-info
          :title="selectedStore.name"
          :thumbnail="selectedStore.logo"
          desc="99 Products"
          class="card-dual__item">
          <template #button>
            <el-button type="text">
              Duplikat produk <svg-icon icon-class="feather-copy" />
            </el-button>
          </template>
        </card-info>
      </div>

      <div class="flex-container pb-16">
        <div class="flex-container flex-grow-1">
          <el-select
            v-model="params.showcase_id"
            :placeholder="rootLang.select + ' Etalase'"
            class="el-select-etalase"
            filterable
            @change="handleFilterbyEtalase">
            <el-option
              :label="lang.all + ' Etalase'"
              :value="0"
            />
            <el-option
              v-for="etalase in dataEtalase"
              :key="etalase.id"
              :label="etalase.name"
              :value="etalase.id"
            />
          </el-select>
          <div class="px-8 text-center">|</div>
          <el-button
            :disabled="showOnlyConflicted"
            type="info"
            class="tag-button-tokped box-shadow-null"
            @click="handleFilterByStockConflict(true)">
            <svg-icon icon-class="alert-triangle-black" /> {{ rootLang.conflict_stock }}
          </el-button>
          <el-button
            type="info"
            class="tag-button-tokped box-shadow-null"
            @click="handleFilterByStockConflict(false)">
            Semua
          </el-button>
        </div>
        <div class="text-right">
          <el-input
            :placeholder="lang.search"
            class="input-search"
            clearable
            prefix-icon="el-icon-search"
            v-model="searchKeyword"
            size="small"
            @change="handleSearch"
          />
        </div>
      </div>

      <div
        v-if="firstLog"
        class="mb-16 font-12 color-grey--placeholder flex-container pointer thelog"
        @click="visibleOffScreenLogs = true">
        <div class="flex-grow-1">
          <svg-icon icon-class="clock" /> {{ firstLog.action }}, {{ firstLog.tanggal }}, {{ firstLog.user }}
        </div>
        <i class="el-icon-caret-bottom"></i>
      </div>
    </template>

    <fixed-table
      v-loading="loadingProducts"
      :headers="tableHeaders"
      :data="computedData"
      :cols="['product-blibli', 'stock', 'product-olsera', 'stock-olsera', 'status-connection']"
      :fixed-bottom="(76) + 'px'"
      :total-data="dataMeta.total"
      :current-page="dataMeta.page"
      :per-page="dataMeta.per_page"
      :style-headers="{
        '': {
          textAlign: 'center',
          width: '120px'
        },
        'Produk Olsera': {
          width: '400px'
        },
        'Produk BliBli': {
          width: '400px'
        }
      }"
      :style-columns="{
        'status-connection': {
          textAlign: 'center'
        }
      }"
      fixed-top="190px"
      header-as-object
      empty-desc="Oops, belum ada produk tokomu. Tekan Sinkron Produk lalu hubungkan produk di Blibli ke Toko Olseramu."
      @change-size="(e) => {
        dataMeta.per_page = e
        fetchProducts()
      }"
      @toggle-sort="toggleSort"
      @changepage="handleChangePage">
      <template #header-4>
        <el-button
          type="primary"
          class="btn-block"
          @click="visibleDialogGetBulkProducts = true">
          Sekaligus
        </el-button>
      </template>
      <template #product-blibli="scope">
        <div class="flex-container w-fit">
          <div class="flex-container">
            <el-avatar
              :src="scope.row.pictures"
              :size="32"
              shape="square"
            />
            <div class="color-white--bg container-watermark-olsera">
              <el-avatar
                src="/static/img/service-activation/blibli/blibli-icon.png"
                class="mr-4"
                :size="20"
              />
            </div>
          </div>
          <div class="font-14 ml-8">
            {{ scope.row.name }}
            <div class="font-12 color-grey--placeholder">{{ scope.row.sku }}</div>
          </div>
        </div>
      </template>
      <template #stock="scope">
        <div class="text-right">
          {{ scope.row.stock }}
        </div>
      </template>
      <template #product-olsera="scope">
        <div v-if="scope.row.pair && scope.row.status === 1" class="flex-container">
          <div class="flex-container pos-relative">
            <el-avatar
              :src="scope.row.pair.photo_md"
              :size="32"
              shape="square"
            />
            <div
              class="container-icon"
              style="position: absolute; left: 10px; top: -6px; height: auto; z-index: 1;">
              <svg-icon icon-class="freemium_icon"/>
            </div>
          </div>
          <div class="font-14 ml-8">
            {{ scope.row.pair.name }}
            <div class="font-12 color-grey--placeholder">{{ scope.row.pair.sku }}</div>
          </div>
        </div>
      </template>
      <template #stock-olsera="scope">
        <div
          v-if="scope.row.pair && scope.row.pair.stock"
          class="text-right">
          {{ scope.row.pair.stock }}
        </div>
      </template>
      <template #status-connection="scope">
        <el-button
          v-if="scope.row.status === 2"
          plain
          round
          type="primary"
          class="btn-block"
          @click="handleSyncProductItem(scope.row)">
          <svg-icon icon-class="plus" /> Hubungkan
        </el-button>
        <el-button
          v-else-if="scope.row.status === 1 && scope.row.balance_stock !== 1"
          type="primary"
          round
          class="btn-block"
          @click="handleShowSyncedProductItem(scope.row)">
          <svg-icon icon-class="link-2" /> Terhubung
        </el-button>
        <el-button
          v-else-if="scope.row.balance_stock === 1"
          round
          type="warning"
          class="btn-block"
          @click="handleShowSyncedProductItem(scope.row)">
          <svg-icon icon-class="alert-triangle" /> {{ rootLang.conflict_stock }}
        </el-button>
      </template>
    </fixed-table>

    <template #sticky-bottom>
      <card-info
        v-if="data.length"
        v-loading="loadingSettingStock"
        title="Update Stock ke BliBli">
        <template #title>
          Update Stock ke BliBli
        </template>
        <template #button>
          <div class="flex-container">
            <div class="color-info mr-8 font-14">
              Samakan stock dengan toko olsera
            </div>
            <el-switch v-model="useSameStock" :active-value="1" :inactive-value="0" @change="doSettingStock" />
          </div>
        </template>
      </card-info>
    </template>

    <loading-fullscreen :show="visibleOverlayLoading" />

    <offscreen-sync-product
      :form-edit="formEdit"
      :show="visibleOffscreenSyncProduct"
      @close="visibleOffscreenSyncProduct = false"
      @success="fetchProducts"
    />

    <offscreen-detail-product
      :show="visibleDetailProduct"
      :form-edit="formEdit"
      @refresh="fetchProducts"
      @cancel="visibleDetailProduct = false"
      @resync="handleResync"
    />

    <dialog-batch-pair
      :show="visibleDialogGetBulkProducts"
      @close="visibleDialogGetBulkProducts = false"
      @save="handleSaveBatchPair"
    />

    <offscreen-log-product
      :show="visibleOffScreenLogs"
      :logs="logs"
      :meta="metaLog"
      :loading="loadingLogs"
      @load-more="handleLoadMoreLogs"
      @close="visibleOffScreenLogs = false"
    />
  </page-fullscreen>
</template>

<script>
import PageFullscreen from '@/components/layouts/PageFullscreen.vue'
import FixedTable from '@/components/FixedTable'
import CardInfo from '@/components/CardInfo'
import basicComputedMixin from '@/mixins/basicComputedMixin'
import LoadingFullscreen from '@/components/LoadingFullscreen'
import OffscreenSyncProduct from './offscreenSyncProduct.vue'
import OffscreenDetailProduct from './offscreenDetailProduct.vue'
import DialogBatchPair from './dialogBatchPair.vue'
import OffscreenLogProduct from './offscreenLogProduct.vue'
import {
  fetchProducts,
  initSyncProducts,
  getMerchant,
  getCategories,
  downloadCategories,
  settingStock,
  integrationInfo,
  logManageProducts
} from '@/api/thirdParty/blibli.js'

export default {
  components: {
    PageFullscreen,
    FixedTable,
    CardInfo,
    LoadingFullscreen,
    OffscreenSyncProduct,
    OffscreenDetailProduct,
    DialogBatchPair,
    OffscreenLogProduct
  },

  mixins: [basicComputedMixin],

  data() {
    return {
      dataMerchant: {},
      loadingDataMerchant: false,
      data: [],
      dataMeta: {
        page: 1,
        total: 0,
        per_page: 30
      },
      loadingProducts: false,
      visibleOverlayLoading: false,
      dataEtalase: [],
      tableHeaders: [
        {
          label: 'Produk BliBli',
        },
        {
          label: 'Stok',
          sort_column: 'stock'
        },
        {
          label: 'Produk Olsera',
        },
        {
          label: 'Stok',
          sort_column: 'name'
        },
        {
          label: ''
        }
      ],
      searchKeyword: '',
      params: {
        showcase_id: 1,
        sort_column: 'name',
        sort_by: 'desc'
      },
      useSameStock: 0,
      visibleOffscreenSyncProduct: false,
      formEdit: {},
      visibleDetailProduct: false,
      visibleDialogGetBulkProducts: false,
      showOnlyConflicted: false,
      loadingSettingStock: false,
      logs: [],
      metaLog: {
        current_page: 1,
        total: 0
      },
      visibleOffScreenLogs: false,
      loadingLogs: false
    }
  },

  computed: {
    computedData() {
      let data = this.data
      if (this.showOnlyConflicted) {
        data = data.filter(item => {
          return item.balance_stock === 1
        })
      }
      return data
    },
    firstLog() {
      if (this.logs.length) {
        return this.logs[0]
      } else {
        return null
      }
    }
  },

  mounted() {
    this.getMerchant()
    this.getIntegrationInfo()
    this.fetchProducts()
    this.fetchCategories()
    this.fetchLogManageProducts()
  },

  methods: {
    getMerchant() {
      this.loadingDataMerchant = true
      getMerchant().then(response => {
        this.dataMerchant = response.data.data
        this.loadingDataMerchant = false
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingDataMerchant = false
      })
    },
    getIntegrationInfo() {
      this.loadingSettingStock = true
      integrationInfo().then(response => {
        this.useSameStock = parseInt(response.data.data.setting_stock)
        this.loadingSettingStock = false
      }).catch(error => {
        this.loadingSettingStock = false
        this.$message({
          type: 'error',
          message: error.string
        })
      })
    },
    fetchProducts() {
      this.loadingProducts = true
      const params = {
        per_page: this.dataMeta.per_page,
        page: this.dataMeta.page,
        ...this.params
      }
      if (this.searchKeyword) {
        params.search = this.searchKeyword
      }
      if (this.showOnlyConflicted) {
        params.balance_stock = 2
      }
      fetchProducts(params).then(response => {
        this.data = response.data.data
        this.dataMeta = {
          per_page: parseInt(response.data.meta.per_page),
          total: parseInt(response.data.meta.total),
          page: parseInt(response.data.meta.current_page)
        }
        this.loadingProducts = false
      }).catch(() => {
        this.loadingProducts = false
        this.data = []
      })
    },
    fetchCategories() {
      getCategories({
        per_page: 300
      }).then(response => {
        this.dataEtalase = response.data.data
      })
    },
    handleSearch() {
      //
      this.dataMeta.page = 1
      this.fetchProducts()
    },
    handleFilterbyEtalase() {
      //
    },
    handleInitSync() {
      this.visibleOverlayLoading = true
      downloadCategories().then(response => {
        this.$message({
          type: 'success',
          message: 'Categories downloaded'
        })
      }).catch(error => {
        this.$message({
          type: 'error',
          message: 'Failed to download categories'
        })
      })
      initSyncProducts().then(response => {
        this.$message({
          type: 'success',
          message: response.data.data.message
        })
        this.fetchProducts()
        this.visibleOverlayLoading = false
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.visibleOverlayLoading = false
      })
    },
    handleSyncProductItem(payload) {
      // console.log(payload)
      this.formEdit = { ...payload }
      this.visibleOffscreenSyncProduct = true
    },
    handleResync() {
      this.visibleDetailProduct = false
      this.visibleOffscreenSyncProduct = true
    },
    handleShowSyncedProductItem(payload) {
      this.formEdit = { ...payload }
      this.visibleDetailProduct = true
    },
    handleSaveBatchPair() {
      this.visibleDialogGetBulkProducts = false
      this.fetchProducts()
    },
    toggleSort(payload) {
      this.dataMeta.page = 1
      if (payload.sort_type) {
        this.params.sort_column = payload.sort_column
        this.params.sort_by = payload.sort_type
      } else {
        this.params.sort_column = null
        this.params.sort_by = null
      }
      this.fetchProducts()
    },
    handleChangePage(payload) {
      this.dataMeta.page = payload
      this.fetchProducts()
    },
    doSettingStock() {
      this.loadingSettingStock = true
      settingStock({
        setting_stock: this.useSameStock
      }).then(response => {
        this.loadingSettingStock = false
      }).catch(error => {
        this.loadingSettingStock = false
        this.$message({
          type: 'error',
          message: error.string
        })
      })
    },
    handleFilterByStockConflict(payload) {
      this.showOnlyConflicted = payload
      this.fetchProducts()
    },
    fetchLogManageProducts() {
      this.loadingLogs = true
      logManageProducts({
        page: this.metaLog.current_page
      }).then(response => {
        this.logs.push(...response.data.data)
        this.metaLog = response.data.meta
        this.loadingLogs = false
      }).catch(() => {
        //
        this.loadingLogs = false
      })
    },
    handleLoadMoreLogs() {
      this.metaLog.current_page = parseInt(this.metaLog.current_page) + 1
      this.fetchLogManageProducts()
    }
  }
}
</script>

<style lang="scss" scoped>
  .thelog:hover {
    color: #000 !important;
  }
</style>
