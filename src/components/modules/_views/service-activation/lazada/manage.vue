<template>
  <page-fullscreen
    title="Lazada"
    class="page-fullscreen-blibli"
    @close="$router.push('/service-activation-v2')">

    <template #sticky-top>
      <div class="card-dual">
        <card-info
          :title="lazadaStore.shop_name"
          :desc="lazadaStore.total_product_lazada + ' ' + lang.product"
          :thumbnail="lazadaStore.photo !== null ? lazadaStore.photo : '/static/img/lazada.png'"
          class="card-dual__item">
          <template #button>
            <el-button type="text" @click="syncDataProduct">
              Sinkronkan produk <svg-icon icon-class="refresh-icon" />
            </el-button>
          </template>
        </card-info>
        <card-info
          :title="selectedStore.name"
          :thumbnail="lazadaStore.merchant_olsera.logo"
          :desc="lazadaStore.merchant_olsera.total_product + ' ' + lang.product"
          class="card-dual__item">
          <template #button>
            <template v-if="sameStock === 1 && totalConflict > 0" >
              <div class="flex-container">
                <div class="mr-12">
                <el-button type="warning" round @click="handleSetSameStock(true)">Selesaikan {{ rootLang.conflict_stock }}</el-button>
              </div>
              <el-dropdown trigger="click" >
                <span class="el-dropdown-link font-18 color-info">
                  <svg-icon icon-class="more-vertical"></svg-icon>
                </span>
                <el-dropdown-menu style="background-color: #F2F2F2;">
                  <el-dropdown-item >
                    <div class="color-primary flex-container full-width ml-4 pointer" v-loading="loadingShowDuplicate" @click="handleManageDuplicate">
                      <div class="full-width"> Duplikat product </div>
                      <svg-icon icon-class="feather-copy" class="font-18" />
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              </div>
            </template>
            <template v-else>
              <div class="color-primary full-width ml-4 pointer text-right" v-loading="loadingShowDuplicate" @click="handleManageDuplicate">
                Duplikat product
                <svg-icon icon-class="feather-copy" class="font-18" />
              </div>
            </template>
            <!-- <el-button type="text">
              Duplikat produk <svg-icon icon-class="feather-copy" />
            </el-button> -->
          </template>
        </card-info>
      </div>

      <div
        class="flex-container pb-16">
        <div class="flex-container flex-grow-1">
          <div class="mr-8">
            <div class="full-width">
              <div
                class="mb-4"
                style="flex-grow: 1;">
                <el-select class="el-select-etalase" v-model="params.category_id" @change="handleFilterbyCategory" filterable :placeholder="rootLang.select + ' Category'" size="medium">
                  <el-option :label="lang.all + ' ' + lang.category" :value="0"></el-option>
                  <el-option v-for="category in dataCategory" :key="category.id" :label="category.name" :value="category.lazada_category_id"></el-option>
                  <div class="load-more mt-24" v-if="moreCategory" v-loading="loadingMoreCategory">
                    <el-button
                      @click="loadMoreCategory"
                      class="btn-block">
                      {{ $lang[langId].load_more }}
                    </el-button>
                  </div>
                </el-select>
              </div>
            </div>
          </div>
          <div class="px-8">|</div>
          <template v-if="dataProduct.length" >
            <!-- <el-button
              type="info"
              class="tag-button-tokped box-shadow-null">
              <svg-icon icon-class="alert-triangle-black" /> {{ rootLang.conflict_stock }}
            </el-button>
            <el-button
              type="info"
              class="tag-button-tokped box-shadow-null">
              Semua
            </el-button> -->
            <el-button v-if="conflictStock" @click="showGroup('conflict')" 
              type="warning" 
              :class="visibleItem[3] ? 'active tag-button-tokped box-shadow-null' : 'tag-button-tokped box-shadow-null'">
                <svg-icon icon-class="alert-triangle" />
                {{ rootLang.conflict_stock }}
            </el-button>
            <el-button @click="showGroup('all')" 
              type="info-addon" 
              :class="visibleItem[0] ? 'active tag-button-tokped box-shadow-null' : 'tag-button-tokped box-shadow-null'">
                Semua
            </el-button>
            <el-button @click="showGroup('not_pair')" 
              type="info-addon" 
              :class="visibleItem[1] ? 'active tag-button-tokped box-shadow-null' : 'tag-button-tokped box-shadow-null'">
                Belum Terhubung ({{ totalUnpair }})
            </el-button>
            <el-button @click="showGroup('pair')" 
              type="info-addon" 
              :class="visibleItem[2] ? 'active tag-button-tokped box-shadow-null' : 'tag-button-tokped box-shadow-null'">
                <svg-icon icon-class="link-2" class="color-warning mr-4" />
                Terhubung ({{ totalPair }})
            </el-button>
          </template>
        </div>
        <div class="text-right">
          <div class="table-handler-flex full-width text-right" style="display: unset">
            <el-input class="input-search" clearable :placeholder="lang.search" prefix-icon="el-icon-search" v-model="search" @change="handleSearch" @keyup.native.enter="handleSearchByEnter" size="small"></el-input>
          </div>
          <!-- <el-input
            :placeholder="lang.search"
            class="input-search"
            clearable
            prefix-icon="el-icon-search"
            v-model="searchKeyword"
            size="small"
            @change="handleSearch"
          /> -->
        </div>
      </div>
    </template>

    <fixed-table
      :headers="['Produk Lazada', 'Stok', 'Produk Olsera', 'Stok', '']"
      :data="dataProduct"
      :cols="['product_lazada', 'stock_lazada', 'product_olsera', 'stock_olsera', 'control']"
      :fixed-top="(56+59+36+42) + 'px'"
      :fixed-bottom="(76) + 'px'"
      :total-data="meta.totalProduct"
      :current-page="meta.currentPage"
      :per-page="params.per_page"
      :loading="loading"
      :empty-desc="'Oops, belum ada produk di ' + selectedStore.name + '. Tekan Sinkron Produk lalu hubungkan produk di Lazada ke Toko Olseramu.'"
      @changepage="handleChangePage"
      @change-size="handleChangeSizePage">
      <template #header-4>
        <el-button type="lazada" class="btn-block" :loading="loadingBulk" @click="getDataBulkProduct">
          Sekaligus
        </el-button>
      </template>
      <template #product_lazada="scope">
        <!-- {{ scope.row.body.substring(0, 20) }} -->
        <div class="mr-8 ml-8 flex-container full-width" >
          <div class="flex-container">
            <el-avatar
              :src="scope.row.pictures"
              :size="32"
              shape="square"
            />
            <div class="color-white--bg container-watermark-olsera">
              <el-avatar
                src="/static/img/lazada.png"
                class="mr-4"
                :size="20"
              />
            </div>
          </div>
          <div class="font-bold font-14 ml-8">
            {{ /^[A-Za-z]+$/.test(scope.row.name) ? scope.row.name : scope.row.name.substring(0, 30) }}
          </div>
        </div>
      </template>
      <template #stock_lazada="scope">
        <div :class="scope.row.balance_stock === 1? 'font-14 px-8 color-warning' : 'font-14 px-8'" style="width: 30%">
          {{ scope.row.stock }}
        </div>
      </template>
      <template #product_olsera="scope">
        <div class="font-14 full-width" >
          <div v-if="scope.row.status === 2">{{ rootLang.not_pair }}</div>
          <div v-if="scope.row.status === 1" class="flex-container p-8" style="align-items: flex-start !important">
            <div class="flex-container">
              <el-avatar
                :src="scope.row.pair.photo_md"
                :size="32"
                shape="square"
              />
              <div class="color-white--bg container-watermark-olsera">
                <svg-icon icon-class="freemium_icon"/>
              </div>
            </div>
            <div class="font-bold font-14 ml-8">
              {{ scope.row.pair.name }}
              <div class="font-12 color-grey--placeholder">{{ scope.row.pair.sku }}</div>
            </div>
          </div>
        </div>
      </template>
      <template #stock_olsera="scope">
        <div v-if="scope.row.status === 1" id="stock" class="font-14" style="width: 30%">
          {{ scope.row.pair.stock }}
        </div>
        <div v-else>
          -
        </div>
      </template>
      <template #control="scope">
        <el-button v-if="scope.row.status === 2" :id="scope.row.product_id" @click="handlePair(scope.row)" type="pair-lazada" round >
          <svg-icon icon-class="plus" />
            Hubungkan
        </el-button>
        <el-button v-if="scope.row.status === 1 && scope.row.balance_stock === 2" @click="handleDetail(idx, scope.row)" type="lazada" round>
          <svg-icon icon-class="icon-feather-link" />
            {{ rootLang.paired }}
        </el-button>
        <el-button v-if="scope.row.status === 1 && scope.row.balance_stock === 1" @click="handleDetail(idx, scope.row)" type="warning" round>
          <svg-icon icon-class="alert-triangle" />
            {{ rootLang.conflict_stock }}
        </el-button>
      </template>
    </fixed-table>

    <template #sticky-bottom>
      <card-info
        v-if="dataProduct.length"
        title="Update Stock ke Lazada">
        <template #title>
          Update Stock ke Lazada
        </template>
        <template #button>
          <div class="flex-container">
            <div class="full-width text-right px-8">
              <span>Samakan stok dgn Toko Olsera</span>
                <el-switch
                  slot="reference"
                  v-model="sameStock"
                  :active-value="1"
                  :inactive-value="0"
                  class="mr-8 ml-8"
                  @change="handleSetSameStock" />
            </div>
          </div>
        </template>
      </card-info>
    </template>

    <el-dialog
      :visible.sync="showSetSameStock"
      :show-close="false"
      :close-on-click-modal="false"
      width="536px"
      append-to-body>
      <div slot="title" class="flex-container">
        <h4 class="dialog-title full-width font-bold font-24">
          Samakan Stock
        </h4>
        <template>
          <el-button type="info" @click="cancelSameStock">{{ rootLang.cancel }}</el-button>
          <el-button type="lazada" :loading="loadingUpdateStock" @click="handleUpdateStock">{{ lang.update }}</el-button>
        </template>
      </div>
      <div>
        <div v-if="fixStock" class="mb-24 color-warning--bg color-white radius-10 p-8 flex-container">
          <div class="container-icon"> <svg-icon icon-class="alert-triangle" /> </div>
          {{ totalConflict }} produk konflik ditemukan
        </div>
        <img src="/static/img/service-activation/lazada/sync_product.png" >
        <div class="mt-24 word-break font-16">
          <span class="font-bold">Update Stok ke Lazada</span> untuk menyamakan stok Lazada dengan stok produk di toko Olseramu
        </div>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="showUpdateStock"
      :show-close="false"
      :close-on-click-modal="false"
      width="536px"
      append-to-body>
      <div slot="title" class="flex-container">
        <template>
          <close-esc :hideEsc="true" @close="cancelSameStock" />
        </template>
      </div>
      <div v-if="sameStock === 0">
        <img src="/static/img/service-activation/lazada/update_stock.png" >
        <div class="mt-24 word-break font-16">
          Stok produk di Lazada saat ini dibolehkan berbeda dengan produk di toko Olseramu. Nyalakan pelatuk untuk menyamakan stok produk Lazada dan Olsera.
        </div>
      </div>
      <div slot="footer">
        <el-button type="Lazada" class="btn-block" :loading="loadingUpdateStock" @click="handleUpdateStock">OK</el-button>
      </div>
    </el-dialog>

    <offscreen-sync-product
      ref="syncproduct"
      :show="visibleSynProduct"
      :form-edit="formSync"
      @pair="refreshData"
      @cancel="handleCloseDialogPair"
    />

    <offscreen-detail-product
      :show="visibleDetailProduct"
      :form-edit="formDetail"
      @refresh="refreshData"
      @cancel="handleCloseDialogDetail"
      @resync="handleResync"
    />

    <duplicate-product
      :show="showManageDuplicate"
      :data-product="dataProductDuplicate"
      :loading-data="loadingShowDuplicate"
      :data-summaries="dataSummaries"
      :next-page="next_page_duplicate"
      @refresh="refreshDataDuplicate"
      @search="handleSearchDuplicate"
      @close="showManageDuplicate = false"
      @filter="handleFilterDuplicate"
      @loadmore="loadMoreDataDuplicate"
    />

    <dialog-batch-pair 
      :show="showBulkPair"
      :data-product="dataProductBulk"
      :meta="metaBulk"
      :loading-bulk="loadingBulk"
      @search="handleSearchBulkPair"
      @save="saveBulkPair"
      @close="closeBulkPair"
      @changepage="handleChangePageBulk"
      @changepagesize="handleChangeSizePageBulk" />

    <transition name="el-zoom-in-center">
      <div
        v-if="visibleLogs"
        class="offscreen-right-sidebar">
        <div class="offscreen-right-sidebar--wrapper">
          <div class="offscreen-right-sidebar--header text-left">
            History Update Lazada
            <close-esc @close="visibleLogs = false" />
          </div>

          <div style="height: 80%; max-height: calc(90vh - 48px); overflow: auto">
            <div v-loading="loadingLogs" v-for="(item, idx) in dataLogs" :key="idx" class="like-table-wrapper">
              <div v-for="data in dataLogs[idx]" :key="data.id" class="like-table-wrapper--item">
                <template>
                  <div class="font-bold full-width">{{ data.user }}</div>
                  <div class="full-width text-right">{{ data.tanggal }}</div>
                </template>
              </div>
              <div v-if="dataLogs.length > 1" class="text-center p-8">page {{ idx + 1 }}</div>
            </div>
            <div class="load-more mt-24" v-if="moreLink" v-loading="loadingLogs">
              <el-button
                :disabled="disabledButton"
                @click="loadMore"
                class="btn-block">
                {{ $lang[langId].load_more }}
              </el-button>
            </div>
          </div>
          
        </div>
      </div>
    </transition>

  </page-fullscreen>
</template>

<script>
import PageFullscreen from '@/components/layouts/PageFullscreen.vue'
import FixedTable from '@/components/FixedTable'
import CardInfo from '@/components/CardInfo'

import basicComputedMixin from '@/mixins/basicComputedMixin'
import FloatingDiv from '../../../FloatingDiv'
import CloseEsc from '@/components/modules/CloseEsc'

import { fetchProductLazada, 
  getLazadaStore, 
  getBulkProductLazada, 
  fetchCategoryLazada, 
  setSameStockWithOlsera, 
  syncProductLazada, 
  getLogsLazada,
  fetchDataDuplicate } from '@/api/thirdParty/lazada'

import offscreenSyncProduct from './offscreenSyncProduct'
import offscreenDetailProduct from './offscreenDetailProduct'
import dialogBatchPair from './dialogBatchPair'
import duplicateProduct from './duplicateProduct.vue'

export default {
  components: {
    PageFullscreen,
    FixedTable,
    CardInfo,
    FloatingDiv,
    CloseEsc,
    offscreenSyncProduct,
    offscreenDetailProduct,
    dialogBatchPair,
    duplicateProduct
  },

  mixins: [basicComputedMixin],

  data() {
    return {
      loading: false,
      data: [],
      dataLogs: [],
      visibleLogs: false,
      loadingLogs: false,
      moreLink: false,
      dataLogForView: [],
      visibleItem: [false, false, false, false],
      dataProduct: [],
      activeButton: [],
      totalPair: 0,
      totalUnpair: 0,
      totalConflict: 0,
      dataCategory: [],
      visibleSynProduct: false,
      formSync: {},
      visibleDetailProduct: false,
      formDetail: {},
      params: {
        per_page: 15,
        category_id: 0
      },
      search: '',
      meta: {
        totalProduct: 0,
        currentPage: 0
      },
      metaBulk: {
        totalProduct: 0,
        currentPage: 0,
        page_size: 15
      },
      etalase: 0,
      sameStock: 1,
      visibleShow: false,
      showUpdateStock: false,
      loadingSameStock: false,
      conflictStock: false,
      loadingBulk: false,
      showBulkPair: false,
      paramsbulk: {
        page: 1,
        per_page: 15,
        status_recomendation: 0,
        status: 2
      },
      dataProductBulk: [],
      loadingUpdateStock: false,
      lazadaStore: {},
      fixStock: false,
      showSetSameStock: false,
      moreCategory: false,
      loadingMoreCategory: false,
      currentPageCategory: 1,
      showManageDuplicate: false,
      dataProductDuplicate: [],
      loadingShowDuplicate: false,
      paramsDuplicate: {
        per_page: 20,
        page: 1
      },
      dataSummaries: {
        can: '',
        cannot: ''
      },
      next_page_duplicate: null,
      dataCheckedDuplicate: [],
      visibleOverlayLoading: false
    }
  },

  computed: {
    // 
  },

  watch: {
    // 
  },

  mounted() {
    this.getData()
    this.getCategoryLazada()
    this.getStoreDetail()
    this.getUpdateLogs()
  },

  methods: {
    getData() {
      this.dataProduct = []
      this.totalPair = 0
      this.totalUnpair = 0
      this.totalConflict = 0
      this.conflictStock = false
      this.meta = {
        totalProduct: 0, 
        currentPage: 0
      }
      this.loading = true
      fetchProductLazada(this.params).then(response => {
        this.dataProduct = [ ...response.data.data]
        this.dataProduct.map(i => {
          this.activeButton.push(false)
        })
        console.log('r', this.dataProduct.length)
        this.totalPair = response.data.total_pair
        this.totalUnpair = response.data.total_unpair
        this.totalConflict = response.data.total_unbalance_stock
        this.conflictStock = response.data.total_unbalance_stock > 0 ? true : false
        this.meta.totalProduct = response.data.meta.total
        this.meta.currentPage = response.data.meta.current_page
        if (this.formDetail && this.formDetail.product_id) {
          this.dataProduct.map(i => {
            if (i.product_id === this.formDetail.product_id) {
              this.formDetail = { ...i}
            }
          })
        }
        this.sameStock = response.data.setting_stock
        this.loading = false
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loading = false
      })
    },

    getCategoryLazada() {
      this.loading = true
      fetchCategoryLazada({
        per_page: 50
      }).then(response => {
        this.dataCategory = response.data.data
        if (response.data.links.next !== null) {
          this.moreCategory = true
        } else {
          this.moreCategory = false
        }
        this.currentPageCategory = response.data.meta.current_page
        this.loading = false
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        console.log('cate', error)
        this.loading = false
      })
    },

    loadMoreCategory () {
      this.loadingMoreCategory = true
      fetchCategoryLazada({
        per_page: 50,
        page: this.currentPageCategory + 1
      }).then(response => {
        response.data.data.map(i => {
          this.dataCategory.push(i)
        })
        
        if (response.data.links.next !== null) {
          this.moreCategory = true
        } else {
          this.moreCategory = false
        }
        this.currentPageCategory = response.data.meta.current_page
        this.loadingMoreCategory = false
      }).catch(error => {
        // this.dataCategory = []
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingMoreCategory = false
      })
    },

    syncDataProduct() {
      this.loading = true
      syncProductLazada().then(response => {
        this.$message({
          type: 'success',
          message: response.data.message
        })
        this.loading = false
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loading = false
      })
    },

    getUpdateLogs() {
      this.loading = true
      getLogsLazada({
        per_page: 15,
        sort: 'desc'
      }).then(response => {
        this.dataLogForView = response.data.data[0]
        this.dataLogs.push(response.data.data)
        if (response.data.links.next !== null) {
          this.moreLink = true
        } else {
          this.moreLink = false
        }
        this.current_page = response.data.meta.current_page
        this.loading = false
      }).catch(error => {
        this.dataLog = []
        if (error.statusCode !== 404) {
          this.$message({
            type: 'error',
            message: error.string
          })
        }
        console.log('logs', error)
        this.loading = false
      })
    },

    loadMore() {
      this.loadingLogs = true
      getLogsLazada({
        per_page: 15,
        page: this.current_page + 1
      }).then(response => {
        this.dataLogs.push(response.data.data)
        if (response.data.links.next !== null) {
          this.moreLink = true
        } else {
          this.moreLink = false
        }
        this.current_page = response.data.meta.current_page
        this.loadingLogs = false
      }).catch(error => {
        this.dataLog = []
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingLogs = false
      })
    },

    refreshData () {
      this.getData()
      this.getCategoryLazada()
    },

    handlePair (data) {
      this.$refs.syncproduct.searchFromMount(data)
      this.visibleSynProduct = true
      this.formSync = data
    },

    handleDetail (index, data) {
      console.log('aa', data)
      this.formDetail = data
      this.visibleDetailProduct = true
    },

    handleCloseDialogPair () {
      this.getData()
      this.visibleSynProduct = false
    },

    handleCloseDialogDetail () {
      this.formDetail = {}
      this.visibleDetailProduct = false
    },

    handleResync (data) {
      this.visibleDetailProduct = false
      this.handlePair(data)
    },

    handleSearch (data) {
      console.log('data', data)
      if (data !== '') {
        this.$set(this.params, 'search_text', data)
        this.$set(this.params, 'search_column', 'name')
      } else {
        this.$delete(this.params, 'search_text')
        this.$delete(this.params, 'search_column')
      }
      this.getData()
    },

    handleSearchByEnter () {
      if (this.search !== '') {
        this.$set(this.params, 'search_text', this.search)
        this.$set(this.params, 'search_column', 'name')
      } else {
        this.$delete(this.params, 'search_text')
        this.$delete(this.params, 'search_column')
      }
      this.getData()
    },

    showGroup (data) {
      if (data === 'all') {
        this.visibleItem = [false, false, false, false]
        this.visibleItem[0] = true
        this.params = {
          per_page: this.params.per_page
        }
      }
      if (data === 'not_pair') {
        this.visibleItem = [false, false, false, false]
        this.visibleItem[1] = true
        this.params = {
          per_page: this.params.per_page,
          status: 2
        }
      }
      if (data === 'pair') {
        this.visibleItem = [false, false, false, false]
        this.visibleItem[2] = true
        this.params = {
          per_page: this.params.per_page,
          status: 1
        }
      }
      if (data === 'conflict') {
        this.visibleItem = [false, false, false, false]
        this.visibleItem[3] = true
        this.params = {
          per_page: this.params.per_page,
          status: 1,
          balance_stock: 1
        }
      }

      if (this.search !== '') {
        this.$set(this.params, 'search_text', this.search)
        this.$set(this.params, 'search_column', 'name')
      } else {
        this.$delete(this.params, 'search_text')
        this.$delete(this.params, 'search_column')
      }
      
      this.getData()
    },

    handleChangePage (page) {
      this.meta.currentPage = page
      this.$set(this.params, 'page', page)
      this.getData()
    },

    handleChangeSizePage (page) {
      this.meta.currentPage = 1
      this.params.per_page = page
      this.params.page = 1
      this.getData()
    },

    handleFilterbyCategory (val) {
      this.params.page = 1
      this.params.search_column = 'category_id',
      this.params.search_text = val
      this.getData()
    },

    refreshData () {
      this.getData()
    },

    cancelSameStock () {
      if (!this.fixStock) {
        this.sameStock === 0 ? this.sameStock = 1 : this.sameStock = 0
        this.showUpdateStock = false
        this.showSetSameStock = false
      } else {
        this.showSetSameStock = false
        this.fixStock = false
      }
    },

    handleSetSameStock (setAll) {
      if (this.sameStock === 0) {
        this.showUpdateStock = true
      }
      if (this.sameStock === 1) {
        setAll ? this.fixStock = true : this.fixStock = false
        this.showSetSameStock = true
      }
      // this.showUpdateStock = true
    },

    async setSameStock () {
      let data = {
        setting_stock: this.sameStock
      }
      this.loadingSameStock = true
      await setSameStockWithOlsera(data).then(response => {
        this.$message({
          type: 'success',
          message: 'Berhasil update data Tokopedia'
        })
        // if (response.data.data.message === 'success') {
          this.showSetSameStock = false
        // } else {
          this.showUpdateStock = false
        // }
        this.loadingSameStock = false
        this.loadingUpdateStock = false
        this.refreshData()
      }).catch(error => {
        // console.log('tr', error)
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingSameStock = false
        this.loadingUpdateStock = false
        this.refreshData()
      })
    },

    handleUpdateStock () {
      this.loadingUpdateStock = true
      this.setSameStock()
      // this.updateStock()
    },

    // updateStock () {
    //   this.loadingUpdateStock = true
    //   updateStockProductTokopedia().then(response => {
    //     console.log('trace', response)
    //     this.$message({
    //       type: 'success',
    //       message: response.data.data.message
    //     })
    //     this.loadingUpdateStock = false
    //     this.showUpdateStock = false
    //     this.refreshData()
    //   }).catch(error => {
    //     // console.log('tr', error)
    //     this.$message({
    //       type: 'error',
    //       message: error.string
    //     })
    //     this.showUpdateStock = false
    //     this.loadingUpdateStock = false
    //   })
    // },

    getDataBulkProduct() {
      this.loadingBulk = true
      getBulkProductLazada(this.paramsbulk).then(response => {
        this.showBulkPair = true
        this.dataProductBulk = response.data.data
        this.dataProductBulk.map(i => {i.pair = null})
        this.metaBulk.totalProduct = response.data.meta.total
        this.metaBulk.currentPage = response.data.meta.current_page
        this.loadingBulk = false
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingBulk = false
      })
    },

    handleChangePageBulk (page) {
      console.log(page)
      this.metaBulk.currentPage = page
      this.paramsbulk.page = page
      // this.$set(this.params, 'page', page)
      this.getDataBulkProduct()
    },

    handleChangeSizePageBulk (page) {
      this.metaBulk.currentPage = 1
      this.paramsbulk.per_page = page
      this.paramsbulk.page = 1
      this.getDataBulkProduct()
    },

    saveBulkPair () {
      this.getData()
      this.paramsbulk.per_page = 15
      this.paramsbulk.page = 0
      this.metaBulk.currentPage = 0
      this.metaBulk.page_size = 15
      this.showBulkPair = false
    },

    closeBulkPair () {
      this.paramsbulk.per_page = 15
      this.paramsbulk.page = 0
      this.metaBulk.currentPage = 0
      this.metaBulk.page_size = 15
      this.showBulkPair = false
    },

    getStoreDetail() {
      // this.loadingBulk = true
      getLazadaStore().then(response => {
        this.lazadaStore = response.data.data
        // this.loadingBulk = false
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        // this.loadingBulk = false
      })
    },

    handleManageDuplicate () {
      this.loadingShowDuplicate = true
      this.dataProductDuplicate = []
      fetchDataDuplicate(this.paramsDuplicate).then(response => {
        this.dataProductDuplicate = response.data.data.data
        this.dataProductDuplicate.map(i => {
          if (i.lazada_primary_category_id !== null) {
            this.dataCheckedDuplicate.push(i)
          }
        })
        this.dataSummaries.can = response.data.data.total_can
        this.dataSummaries.cannot = response.data.data.total_cannot
        this.next_page_duplicate = response.data.data.next_page_url
        this.loadingShowDuplicate = false
        this.showManageDuplicate = true
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.dataProductDuplicate = []
        this.loadingShowDuplicate = false
      })
    },

    refreshDataDuplicate () {
      this.handleManageDuplicate()
    },

    handleFilterDuplicate (args) {
      if (args === 'all') {
        this.$delete(this.paramsDuplicate, 'can_duplicate')
      }
      if (args === 'can_duplicate') {
        this.paramsDuplicate.can_duplicate = 1
      }
      if (args === 'not_duplicate') {
        this.paramsDuplicate.can_duplicate = 0
      }

      this.handleManageDuplicate()
    },

    loadMoreDataDuplicate () {
      this.loadingShowDuplicate = true
      this.paramsDuplicate.page += 1
      fetchDataDuplicate(this.paramsDuplicate).then(response => {
        response.data.data.data.map(i => {
          this.dataProductDuplicate.push(i)
        })
        this.dataSummaries.can = response.data.data.total_can
        this.dataSummaries.cannot = response.data.data.total_cannot
        this.next_page_duplicate = response.data.data.next_page_url
        this.loadingShowDuplicate = false
        // this.showManageDuplicate = true
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.dataProductDuplicate = []
        this.loadingShowDuplicate = false
      })
    },

    handleSearchBulkPair (data) {
      if (data.search_column && data.search_text) {
        this.$set(this.paramsbulk, 'search_text', data.search_text)
        this.$set(this.paramsbulk, 'search_column', data.search_column)
      } else {
        this.$delete(this.paramsbulk, 'search_text')
        this.$delete(this.paramsbulk, 'search_column')
      }
      this.getDataBulkProduct()
    },

    handleSearchDuplicate (data) {
      this.paramsDuplicate.page = 1
      if (data.search_column && data.search_text) {
        this.$set(this.paramsDuplicate, 'search_text', data.search_text)
        this.$set(this.paramsDuplicate, 'search_column', data.search_column)
      } else {
        this.$delete(this.paramsDuplicate, 'search_text')
        this.$delete(this.paramsDuplicate, 'search_column')
      }
      this.handleManageDuplicate()
    }
  }
}
</script>
