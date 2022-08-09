<template>
  <page-fullscreen
    title="Tokopedia"
    class="page-fullscreen-blibli"
    @close="$router.push('/service-activation-v2')">

    <template #sticky-top>
      <div class="card-dual">
        <card-info
          ref="cardinfo"
          :title="tokopediaStore.shop_name"
          :desc="tokopediaStore.total_product_tokopedia + ' ' + lang.product"
          :thumbnail="tokopediaStore.photo ? tokopediaStore.photo : '/static/img/tokopedia.png'"
          :merchant-store="dataMerchant"
          :is-loading="isLoading"
          :marketplace-id="'Tokopedia'"
          @addmerchant="visibleTokopediaBeforeIntegration = true"
          @changemerchant="handleChangeMerchant"
          class="card-dual__item">
          <template #button>
            <el-button type="text" @click="syncDataProduct">
              Perbarui produk <svg-icon icon-class="refresh-icon" />
            </el-button>
            <el-dropdown trigger="click" >
              <span class="el-dropdown-link font-18 color-info">
                <svg-icon icon-class="more-vertical"></svg-icon>
              </span>
              <el-dropdown-menu style="background-color: #F2F2F2;">
                <el-dropdown-item>
                  <el-button type="text" class="btn-block text-left" @click="handleGetCategory">
                    <i class="el-icon-setting" />
                    {{ rootLang.category_setting }}
                  </el-button>
                </el-dropdown-item>
                <el-dropdown-item >
                  <el-button class="color-danger btn-block ml-4 text-left" type="text" @click="showDialogConfirmDeAuth = true">
                    <div class="full-width"><i class="el-icon-close" /> Hapus integrasi </div>
                  </el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </card-info>
        <card-info
          :title="selectedStore.name"
          :thumbnail="tokopediaStore.merchant_olsera.logo ? tokopediaStore.merchant_olsera.logo : '/static/img/tokopedia.png'"
          class="card-dual__item">
          <template #button >
            <template v-if="sameStock === 1 && totalConflict > 0" >
              <div class="flex-container">
                <div class="mr-12">
                <el-button type="warning" round @click="handleSetSameStock(true)">Selesaikan {{ rootLang.conflict_stock }}</el-button>
              </div>
              <el-dropdown trigger="click">
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
          </template>
        </card-info>
      </div>

      <div class="color-info font-12 pointer mt-16 mb-16" @click="visibleLogs = true">
        <svg-icon icon-class="clock" /> Terakhir update ke Tokopedia pada <strong>{{ dataLogForView.tanggal }} oleh {{ dataLogForView.user }}</strong>
      </div>

      <div
        class="flex-container pb-16">
        <div class="flex-container flex-grow-1">
          <div class="mr-8">
            <div class="full-width">
              <div
                class="mb-4"
                style="flex-grow: 1;">
                <el-select class="el-select-etalase" v-model="params.showcase_id" @change="handleFilterbyEtalase" filterable :placeholder="rootLang.select + ' Category'" size="medium">
                  <el-option :label="lang.all + ' ' + lang.category" :value="0"></el-option>
                  <el-option v-for="category in dataEtalase" :key="category.id" :label="category.name" :value="category.id"></el-option>
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
          <template v-else>
            <el-button @click="showGroup('all')" 
              type="info-addon" 
              :class="visibleItem[0] ? 'active tag-button-tokped box-shadow-null' : 'tag-button-tokped box-shadow-null'">
                Semua
            </el-button>
          </template>
        </div>
        <div class="text-right">
          <div class="table-handler-flex full-width text-right" style="display: unset">
            <el-input class="input-search" clearable :placeholder="lang.search" prefix-icon="el-icon-search" v-model="search" @change="handleSearch" @keyup.native.enter="handleSearchByEnter" size="small"></el-input>
          </div>
        </div>
      </div>
    </template>

    <fixed-table
      :headers="['Produk Tokopedia', 'Stok', 'Produk Olsera', 'Stok', '']"
      :data="dataProduct"
      :cols="['product_tokopedia', 'stock_tokopedia', 'product_olsera', 'stock_olsera', 'control']"
      :fixed-top="(56+59+36+42) + 'px'"
      :fixed-bottom="(76) + 'px'"
      :total-data="meta.totalProduct"
      :current-page="meta.currentPage"
      :per-page="params.per_page"
      :loading="loading"
      :empty-desc="'Oops, belum ada produk di ' + selectedStore.name + '. Tekan Sinkron Produk lalu hubungkan produk di Tokopedia ke Toko Olseramu.'"
      @changepage="handleChangePage"
      @change-size="handleChangeSizePage">
      <template #header-4>
        <el-button type="tokopedia" class="btn-block" :loading="loadingBulk" @click="getDataBulkProduct">
          Sekaligus
        </el-button>
      </template>
      <template #product_tokopedia="scope">
        <div class="mr-8 ml-8 flex-container full-width" >
          <div class="flex-container">
            <el-avatar
              :src="scope.row.pictures"
              :size="32"
              shape="square"
            />
            <div class="color-white--bg container-watermark-olsera">
              <el-avatar
                src="/static/img/tokopedia.png"
                class="mr-4"
                :size="20"
              />
            </div>
          </div>
          <div class="font-bold font-14 ml-8" style="max-width: 300px">
            <!-- {{ /^[A-Za-z]+$/.test(scope.row.name) ? scope.row.name : scope.row.name.substring(0, 30) }} -->
            {{ scope.row.name }}
            <div class="font-12 color-grey--placeholder">{{ scope.row.sku }}</div>
          </div>
        </div>
      </template>
      <template #stock_tokopedia="scope">
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
        <el-button v-if="scope.row.status === 2" :id="scope.row.product_id" @click="handlePair(scope.row)" type="pair-tokopedia" round >
          <svg-icon icon-class="plus" />
            Hubungkan
        </el-button>
        <el-button v-if="scope.row.status === 1 && scope.row.balance_stock === 2" @click="handleDetail(idx, scope.row)" type="tokopedia" round>
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
        title="Update Stock ke Tokopedia">
        <template #title>
          Update Stock ke Tokopedia
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
          <el-button type="tokopedia" :loading="loadingUpdateStock" @click="handleUpdateStock">{{ lang.update }}</el-button>
        </template>
      </div>
      <div>
        <div v-if="fixStock" class="mb-24 color-warning--bg color-white radius-10 p-8 flex-container">
          <div class="container-icon"> <svg-icon icon-class="alert-triangle" /> </div>
          {{ totalConflict }} produk konflik ditemukan
        </div>
        <img src="/static/img/service-activation/tokopedia/update_stock.png" >
        <div class="mt-24 word-break font-16">
          <span class="font-bold">Update Stok ke Tokopedia</span> untuk menyamakan stok Tokopedia dengan stok produk di toko Olseramu
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
        <img src="/static/img/service-activation/tokopedia/update_stock_2.png" >
        <div class="mt-24 word-break font-16">
          Stok produk di Tokopedia saat ini dibolehkan berbeda dengan produk di toko Olseramu. Nyalakan pelatuk untuk menyamakan stok produk Tokopedia dan Olsera.
        </div>
      </div>
      <div slot="footer">
        <el-button type="tokopedia" class="btn-block" :loading="loadingUpdateStock" @click="handleUpdateStock">OK</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="showDialogCategorySet"
      :show-close="false"
      :close-on-click-modal="true"
      :before-close="handleCloseDialogCategoryPair"
      width="696px"
      append-to-body
    >
      <div slot="title" class="flex-container">
        <h4 class="dialog-title full-width font-bold font-24">
          {{ rootLang.category_setting }}
        </h4>
        <template>
          <el-button 
            type="info" 
            @click="handleCloseDialogCategoryPair"
          >{{ rootLang.cancel }}</el-button>
          <el-button 
            type="tokopedia" 
            :loading="loadingSaveCategory" 
            @click="handleSaveCategorySet">
          {{ rootLang.save }}</el-button>
        </template>
      </div>
      <div class="font-14">
        {{ rootLang.category_setting_head_caption_tokped }}
      </div>
      <div 
        class="table-handler-flex full-width text-right" 
        style="margin-top: 16px;"
      >
        <el-input 
          class="inline-form input-search full-width" 
          size="small" 
          prefix-icon="el-icon-search" 
          v-model="textSearchCategory" 
          clearable 
          :placeholder="rootLang.search_olsera_category" 
          :disabled="loadinFetchCategory"
          @change="handleOnBlurCategoryShopee" 
        />
      </div>
      <div 
        class="flex-container" 
        style="margin-top: 16px; margin-bottom: 24px;"
      >
        <el-button 
          v-for="item in [ 
            { caption: rootLang.all, methodPayload: 'all', amount: totalStatsCategory.all }, 
            { caption: rootLang.not_pair, methodPayload: 'unpaired', amount: totalStatsCategory.unpaired }, 
            { caption: rootLang.paired , methodPayload: 'paired', amount: totalStatsCategory.paired }, 
          ]"
          :key="item.caption"
          type="info-addon"
          round 
          :disabled="loadinFetchCategory || categoryPairStatus === item.methodPayload"
          @click="handleFilterCategory(item.methodPayload)"
        >
          {{ item.caption }} ({{ item.amount }})
        </el-button>
      </div>
      <div v-loading="loadinFetchCategory">
        <template v-if="dataCategory.length !== 0">
          <perfect-scrollbar class="scrollCat">
            <div 
              v-for="(cat, idx) in dataCategory" :key="cat.category_id" 
              class="flex-container mt-8"
            >
              <div 
                class="full-width"
                :class="cat.selectedCat.tokopedia_category_id !== '' ? 'color-tokopedia--bg-soft' : 'color-info--bg '"
              >
                <div class="p-8">
                  <div class="font-14">{{cat.category_name}}</div>
                </div>
              </div>
              <div class="full-width">
                <el-select
                  class="full-width"  
                  v-model="cat.selectedCat"
                  value-key="name"
                  filterable
                  clearable
                  remote
                  placeholder="Kategori Tokopedia"
                  :loading="loadingSearchTokopediaOpt"
                  :remote-method="(query) => getSearchCategoryTokopedia(query, idx)"
                  @change="() => handleOnChangeCategoryTokopedia(idx)"
                  @clear="() => handleOnClearCategoryTokopedia(idx)"
                >
                  <el-option
                    v-for="item in cat.optionCat"
                    :key="item.tokopedia_category_id"
                    :label="item.name"
                    :value="item">
                  </el-option>
                </el-select>
              </div>
            </div>
          </perfect-scrollbar>
        </template>
        <template v-else>
          <div style="text-align: center; margin-top: 20px">{{ rootLang.data_not_found}}</div>
        </template>
      </div>
      <div 
        v-if="moreCategory"
        class="full-width"
        style="margin-top: 16px"
      >
        <el-button 
          round 
          type="tokopedia" 
          class="full-width"
          :loading="loadingMoreCategory"
          @click="loadMoreCategoryPair"
        >{{ rootLang.load_more }}</el-button>
      </div>
    </el-dialog>

    <offscreen-sync-product
      ref="syncproduct"
      :show="visibleSynProduct"
      :form-edit="formSync"
      @pair="handleRefreshFromPair"
      @cancel="handleCloseDialogPair"
    />

    <offscreen-detail-product
      :show="visibleDetailProduct"
      :form-edit="formDetail"
      @refresh="refreshData"
      @cancel="handleCloseDialogDetail"
      @resync="handleResync"
      @unpair="handleUnpair"
    />

    <dialog-batch-pair 
      :show="showBulkPair"
      :data-product="dataProductBulk"
      :meta="metaBulk"
      :loading-bulk="loadingBulk"
      @save="saveBulkPair"
      @close="closeBulkPair"
      @changepage="handleChangePageBulk"
      @changepagesize="handleChangeSizePageBulk" />

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

    <transition name="el-zoom-in-center">
      <div
        v-if="visibleLogs"
        class="offscreen-right-sidebar">
        <div class="offscreen-right-sidebar--wrapper">
          <div class="offscreen-right-sidebar--header text-left">
            History Update Tokopedia
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

    <tokopedia-dialog-before-integration
      ref="dialogintegration"
      :show="visibleTokopediaBeforeIntegration"
      :loading-submit="loadingSubmit"
      :data-merchant="dataMerchant"
      @cancel="visibleTokopediaBeforeIntegration = false"
      @submit="submitTokopedia"
    />

    <el-dialog
      :visible.sync="showDialogConfirmDeAuth"
      :show-close="false"
      :close-on-click-modal="false"
      width="344px"
      append-to-body>
      <div slot="title" class="flex-container">
      </div>
      <div class="text-center">
        <div class="font-18 font-bold text-center">
          Apakah Anda yakin ingin menghapus integrasi Tokopedia di Olsera?
        </div>
        <div class="font-14 mt-24">
          Setelah dihapus, proses integrasi Tokopedia akan dimulai dari awal.
        </div>
      </div>
      <div slot="footer" class="flex-container">
        <el-button class="btn-block" @click="showDialogConfirmDeAuth = false">{{ lang.cancel }}</el-button>
        <el-button type="tokopedia" class="btn-block" :loading="loadingDeauthorize" @click="handleDeleteIntegration">Hapus integrasi</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogPendingStore"
      title="Status Pengajuan"
      :show-close="false"
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
  </page-fullscreen>
</template>

<script>
import PageFullscreen from '@/components/layouts/PageFullscreen.vue'
import FixedTable from '@/components/FixedTable'
import CardInfo from '@/components/CardInfo'

import TokopediaDialogBeforeIntegration from './dialogBeforeIntegration'
import duplicateProduct from './duplicateProduct.vue'

import basicComputedMixin from '@/mixins/basicComputedMixin'
import FloatingDiv from '../../../FloatingDiv'
import CloseEsc from '@/components/modules/CloseEsc'

import { fetchProductTokopedia, 
  syncProductTokopedia, 
  fetchCaseTokopedia, 
  setSameStockWithOlsera, 
  updateStockProductTokopedia,
  getBulkProduct,
  getTokopediaStore,
  getLogs,
  fetchDataDuplicate,
  deleteIntegrationMerchant,
  fetchListCategoryMapOlseraTokopedia,
  fetchCategoryTokopedia,
  pairCategoryTokopedia,
  getMerchantTokopedia } from '@/api/thirdParty/tokopedia'

import { fetchByStore as fetchGroups } from '@/api/thirdParty/group'
import { integrateMerchant } from '@/api/thirdParty/tokopedia'

import offscreenSyncProduct from './offscreenSyncProduct'
import offscreenDetailProduct from './offscreenDetailProduct'
import dialogBatchPair from './dialogBatchPair'

export default {
  components: {
    FloatingDiv,
    CloseEsc,
    offscreenSyncProduct,
    offscreenDetailProduct,
    dialogBatchPair,
    PageFullscreen,
    FixedTable,
    CardInfo,
    TokopediaDialogBeforeIntegration,
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
      dataEtalase: [],
      visibleSynProduct: false,
      formSync: {},
      visibleDetailProduct: false,
      formDetail: {},
      params: {
        per_page: 15,
        showcase_id: 0
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
        status_recomendation: 0
      },
      dataProductBulk: [],
      loadingUpdateStock: false,
      tokopediaStore: {},
      cancelStock: false,
      showSetSameStock: false,
      fixStock: false,
      dataProductHeader: {},
      moreCategory: false,
      loadingMoreCategory: false,
      currentPageCategory: 1,
      dataMerchant: [],
      loading: false,
      visibleTokopediaBeforeIntegration: false,
      loadingSubmit: false,
      showManageDuplicate: false,
      dataProductDuplicate: {},
      loadingShowDuplicate: false,
      dataSummaries: false,
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
      visibleOverlayLoading: false,
      showDialogConfirmDeAuth: false,
      loadingDeauthorize: false,
      dialogPendingStore: false,
      isLoading: false,
      showDialogCategorySet: false,
      totalStatsCategory: {},
      dataCategory: [],
      loadinFetchCategory: false,
      textSearchCategory: '',
      loadingSearchTokopediaOpt: '',
      categoryPairStatus: 'all',
      loadingSaveCategory: false
    }
  },

  computed: {
    // 
  },

  watch: {
    // 
  },

  mounted() {
    this.fetchGroups(true)
    this.getData()
    this.getEtalase()
    this.getStoreDetail()
    this.getUpdateLogs()
  },

  methods: {
    getData() {
      this.dataProduct = []
      this.totalPair = 0
      this.totalUnpair = 0
      // this.totalConflict = 0
      this.conflictStock = false
      this.meta = {
        totalProduct: 0, 
        currentPage: 0
      }
      this.loading = true

      if (this.tokopediaActiveStore !== null) {
        this.params.merchant_tokopedia_id = this.tokopediaActiveStore.id
      }
      
      fetchProductTokopedia(this.params).then(response => {
        this.dataProduct = [ ...response.data.data]
        this.dataProduct.map(i => {
          this.activeButton.push(false)
        })
        this.totalPair = response.data.total_pair
        this.totalUnpair = response.data.total_unpair
        // this.totalConflict = response.data.total_unbalance_stock
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

    getEtalase() {
      this.loading = true
      let params = {}
      if (this.tokopediaActiveStore !== null) {
        params.merchant_tokopedia_id = this.tokopediaActiveStore.id
      }
      fetchCaseTokopedia(params).then(response => {
        this.dataEtalase = response.data.data
        if (response.data.links && response.data.links.next !== null) {
          this.moreCategory = true
        } else {
          this.moreCategory = false
        }

        if (response.data.meta && response.data.meta.current_page) {
          this.currentPageCategory = response.data.meta.current_page
        }
        
        this.loading = false
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loading = false
      })
    },

    loadMoreCategory () {
      this.loadingMoreCategory = true
      let params = {
        per_page: 15,
        page: this.currentPageCategory + 1,
      }

      if (this.tokopediaActiveStore !== null) {
        params.merchant_tokopedia_id = this.tokopediaActiveStore.id
      }
      fetchCaseTokopedia(params).then(response => {
        response.data.data.map(i => {
          this.dataEtalase.push(i)
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
      let params = {}
      
      if (this.tokopediaActiveStore !== null) {
        params.merchant_tokopedia_id = this.tokopediaActiveStore.id
      }
      
      syncProductTokopedia(params).then(response => {
        // this.$message({
        //   type: 'error',
        //   message: error.string
        // })
        // this.refreshData()
        this.getData()
        this.getEtalase()
        this.getStoreDetail()
        this.getUpdateLogs()
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
      let params = {
        per_page: 15,
      }

      if (this.tokopediaActiveStore !== null) {
        params.merchant_tokopedia_id = this.tokopediaActiveStore.id
      }
      getLogs(params).then(response => {
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
        this.loading = false
      })
    },

    loadMore() {
      this.loadingLogs = true
      let params = {
        per_page: 15,
        page: this.current_page + 1,
      }

      if (this.tokopediaActiveStore !== null) {
        params.merchant_tokopedia_id = this.tokopediaActiveStore.id
      }
      getLogs(params).then(response => {
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
      console.log('aa')
      this.getStoreDetail()
      this.getData()
      this.getEtalase()
      this.getUpdateLogs()
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

    handleRefreshFromPair () {
      this.getStoreDetail()
      this.getData()
      this.getEtalase()
      this.getUpdateLogs()
    },

    handleCloseDialogDetail () {
      this.formDetail = {}
      this.visibleDetailProduct = false
    },

    handleResync (data) {
      this.visibleDetailProduct = false
      this.handlePair(data)
    },

    handleUnpair (data) {
      this.visibleDetailProduct = false
      this.refreshData()
    },

    handleSearch (data) {
      console.log('data', data)
      this.params.page = ''
      if (data !== '') {
        this.$set(this.params, 'search_text', data)
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

      if (this.search.length > 0) {
        this.params.search_text = this.search
        this.params.search_column = 'name'
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

    handleFilterbyEtalase (val) {
      this.params.page = 1
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
      
      if (this.tokopediaActiveStore !== null) {
        data.merchant_tokopedia_id = this.tokopediaActiveStore.id
      }
      this.loadingSameStock = true
      await setSameStockWithOlsera(data).then(response => {
        this.$message({
          type: 'success',
          message: 'Berhasil update data Tokopedia'
        })
        if (response.data.data.message === '1') {
          this.showSetSameStock = false
        } else {
          this.showUpdateStock = false
        }
        this.loadingUpdateStock = false
        
        this.$delete(this.params, 'balance_stock')
        this.getStoreDetail()
        this.refreshData()
      }).catch(error => {
        // console.log('tr', error)
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingUpdateStock = false
      })
    },

    handleUpdateStock () {
      this.loadingUpdateStock = true
      this.setSameStock()
      // this.updateStock()
    },

    updateStock () {
      this.loadingUpdateStock = true
      let params = {}
      if (this.tokopediaActiveStore !== null) {
        params.merchant_tokopedia_id = this.tokopediaActiveStore.id
      }
      updateStockProductTokopedia(params).then(response => {
        console.log('trace', response)
        this.$message({
          type: 'success',
          message: response.data.data.message
        })
        this.loadingUpdateStock = false
        this.showUpdateStock = false
        this.getStoreDetail()
        this.refreshData()
      }).catch(error => {
        // console.log('tr', error)
        this.$message({
          type: 'error',
          message: error.string
        })
        this.showUpdateStock = false
        this.loadingUpdateStock = false
      })
    },

    getDataBulkProduct() {
      this.loadingBulk = true
      if (this.tokopediaActiveStore !== null) {
        this.paramsbulk.merchant_tokopedia_id = this.tokopediaActiveStore.id
      }
      
      getBulkProduct(this.paramsbulk).then(response => {
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

    async getStoreDetail() {
      // this.loadingBulk = true
      let params = {}
      if (this.tokopediaActiveStore !== null) {
        params.merchant_tokopedia_id = this.tokopediaActiveStore.id
      }
      await getTokopediaStore(params).then(response => {
        this.tokopediaStore = response.data.data
        this.totalConflict = response.data.data.unbalance_stock
        // this.loadingBulk = false
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        // this.loadingBulk = false
      })
    },

    hidePopover () {
      console.log('hide')
      if (!this.cancelStock) {
        this.sameStock === 0 ? this.sameStock = 1 : this.sameStock = 0
      }
    },

    changeSettingStock () {
      this.cancelStock = false
    },

    async fetchGroups(fromMount) {
      this.isLoading = true
      this.loading = true
      await getMerchantTokopedia({
        search_column: 'status',
        search_text: 'X',
        search_operator: '!='
      }).then(response => {
        // response.data.data.map(i => {
        //   if (i.name === 'Marketplace') {
        //     i.thirdparty_items.map(j => {
        //       if (j.alias_name === 'Tokopedia') {
        //         this.dataMerchant = [ ...j.main_store[0].marketplace_account]
        //       }
        //     })
        //   }
        // })
        this.dataMerchant = [ ...response.data.data]
        if (this.tokopediaActiveStore === null) {
          let activeData = []
          this.dataMerchant.map(i => {
            if (i.status === 'A') { activeData.push(i) }
          })
          if (activeData.length > 0) {
            this.$store.commit('SET_TOKOPEDIA_ACTIVE_STORE', activeData[0])
            this.getStoreDetail()
          } 
          // else if (this.stageLevel === 'dev' || this.stageLevel === 'sit') {
          //   this.$router.push({
          //     path: '/service-activation-v2',
          //     query: {
          //       refresh: 1
          //     }
          //   })
          // }
        } else if (this.tokopediaActiveStore !== null && !fromMount) {
          let activeData = []
          this.dataMerchant.map(i => {
            if (i.status === 'A') { activeData.push(i) }
          })
          if (activeData.length > 0) {
            this.$store.commit('SET_TOKOPEDIA_ACTIVE_STORE', activeData[0])
          } else {
            this.$router.push({
              path: '/service-activation-v2',
              query: {
                refresh: 1
              }
            })
          }
        }

        if (!fromMount) {
          this.refreshData()
        }
        this.isLoading = false
        this.loading = false
      }).catch(error => {
        this.groups = []
        this.$message({
          type: 'error',
          message: error.string
        })
        this.isLoading = false
        this.loading = false
      })
    },

    submitTokopedia (data) {
      this.loadingSubmit = true
      integrateMerchant(data).then(async response => {
        this.loadingSubmit = false
        this.$refs.dialogintegration.hideShowSetup()
        this.$refs.cardinfo.handleShowList()
        this.visibleTokopediaBeforeIntegration = false
        this.fetchGroups(false)
      }).catch(error => {
        this.loadingSubmit = false
        this.$message({
          type: 'error',
          message: error.string
        })
      })
    },

    handleChangeMerchant (data) {
      // if (data.status === 'A') {
        this.$store.commit('SET_TOKOPEDIA_ACTIVE_STORE', data)
        this.getData()
        this.getEtalase()
        this.getStoreDetail()
        this.getUpdateLogs()
      // } else if (data.status === 'P') {
      //   this.dialogPendingStore = true
      // }
    },

    handleManageDuplicate () {
      if (this.isLoading) {
        this.$message({
          type: 'error',
          message: 'Silahkan tunggu sampai semua data berhasil di sinkronisasi'
        })
      } else {
        this.loadingShowDuplicate = true
        this.dataProductDuplicate = []
        if (this.tokopediaActiveStore !== null) {
          this.paramsDuplicate.merchant_tokopedia_id = this.tokopediaActiveStore.id
        }
        fetchDataDuplicate(this.paramsDuplicate).then(response => {
          this.dataProductDuplicate = response.data.data
          this.dataSummaries.can = response.data.meta.total_can
          this.dataSummaries.cannot = response.data.meta.total_cant
          this.next_page_duplicate = response.data.links.next
          
          this.dataProductDuplicate.map(i => {
            if (i.validation !== null) {
              i.valobj = Object.values(i.validation)
            } else {
              i.valobj = []
            }
          })
          // console.log('aaaa', this.dataProductDuplicate)
          this.loadingShowDuplicate = false
          this.showManageDuplicate = true
        }).catch(error => {
          this.$message({
            type: 'error',
            message: error.string
          })
          console.log('aaaa', error)
          this.dataProductDuplicate = []
          this.loadingShowDuplicate = false
        })
      }
    },

    refreshDataDuplicate () {
      this.handleManageDuplicate()
    },

    handleFilterDuplicate (args) {
      if (args === 'all') {
        this.$delete(this.paramsDuplicate, 'search_column')
        this.$delete(this.paramsDuplicate, 'search_text')
      }
      if (args === 'can_duplicate') {
        this.paramsDuplicate.search_column = 'is_completed'
        this.paramsDuplicate.search_text = 1
      }
      if (args === 'not_duplicate') {
        this.paramsDuplicate.search_column = 'is_completed'
        this.paramsDuplicate.search_text = 0
      }

      this.handleManageDuplicate()
    },

    loadMoreDataDuplicate () {
      this.loadingShowDuplicate = true
      this.paramsDuplicate.page += 1
      fetchDataDuplicate(this.paramsDuplicate).then(response => {
        response.data.data.map(i => {
          this.dataProductDuplicate.push(i)
        })
        this.dataSummaries.can = response.data.data.total_can
        this.dataSummaries.cannot = response.data.data.total_cannot

        this.dataProductDuplicate.map(i => {
          if (i.validation !== null) {
            i.valobj = Object.values(i.validation)
          }
        })

        this.next_page_duplicate = response.data.links.next
        this.loadingShowDuplicate = false
        // this.showManageDuplicate = true
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        console.log('ee', error)
        this.dataProductDuplicate = []
        this.loadingShowDuplicate = false
      })
    },

    handleDeleteIntegration () {
      this.loadingDeauthorize = true
      let data = {
        merchant_tokopedia_id: this.tokopediaActiveStore.id
      }
      deleteIntegrationMerchant(data).then(response => {
        this.$store.commit('REMOVE_TOKOPEDIA_ACTIVE_STORE')
        // this.$refs.cardinfo.handleShowList()
        this.fetchGroups(false)
        this.showDialogConfirmDeAuth = false
        this.loadingDeauthorize = false
      }).catch(error => {
        console.log('tr', error)
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingDeauthorize = false
        // this.refreshData()
      })
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
      console.log('dupp', this.paramsDuplicate)
      this.handleManageDuplicate()
    },

    handleGetCategory () {
      this.getCategoryTokopedia()
      this.showDialogCategorySet = true
    },

    getCategoryTokopedia(query = '') {
      this.loadinFetchCategory = true
      this.dataCategory = []
      let params = {
        per_page: 15,
      }
      if (this.categoryPairStatus === 'paired') {
        params.is_paired = 1
      }
      if (this.categoryPairStatus === 'unpaired') {
        params.is_paired = 0
      }
      if (query !== '') {
        params.search_text = query
        params.search_column = "category_name"
        params.search_condition = "like"
      }
      fetchListCategoryMapOlseraTokopedia(params).then(response => {
        this.dataCategory = response.data.data
        if (response.data.next_page_url !== null) {
          this.moreCategory = true
        } else {
          this.moreCategory = false
        }
        this.currentPageCategory = response.data.current_page
        this.totalStatsCategory = {
          all: response.data.total_all,
          paired: response.data.paired,
          unpaired: response.data.not_paired
        }
        this.dataCategory = this.dataCategory.map((item) => {
          const prevCatState = {
            tokopedia_category_name: item.tokopedia_category_name,
            tokopedia_category_id: item.tokopedia_category_id
          }
          const selectedCat = { name: '', tokopedia_category_id: '' }
          const optionCat = []
          if (item.tokopedia_category_id !== null && item.tokopedia_category_name ) {
            selectedCat.name = item.tokopedia_category_name
            selectedCat.tokopedia_category_id = item.tokopedia_category_id
            optionCat.push(selectedCat)
          }
          return {
             ...item,
             selectedCat,
             optionCat,
             prevCatState
          }
        })
        this.loadinFetchCategory = false
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.dataCategory = []
        this.loadinFetchCategory = false
      })
    },

    loadMoreCategoryPair () {
      this.loadingMoreCategory = true
      let params = {
        per_page: 15,
        page: this.currentPageCategory + 1
      }
      if (this.categoryPairStatus === 'paired') {
        params.is_paired = 1
      }
      if (this.categoryPairStatus === 'unpaired') {
        params.is_paired = 0
      }
      if (this.textSearchCategory !== '') {
        params.search_text = this.textSearchCategory
        params.search_column = "category_name"
        params.search_condition = "like"
      }
      fetchListCategoryMapOlseraTokopedia(params).then(response => {
        response.data.data.map(item => {
          const prevCatState = {
            tokopedia_category_name: item.tokopedia_category_name,
            tokopedia_category_id: item.tokopedia_category_id
          }
          const selectedCat = { name: '', tokopedia_category_id: '' }
          const optionCat = []
          if (item.tokopedia_category_id !== null && item.tokopedia_category_name ) {
            selectedCat.name = item.tokopedia_category_name
            selectedCat.tokopedia_category_id = item.tokopedia_category_id
            optionCat.push(selectedCat)
          }
          this.dataCategory.push({ ...item, selectedCat, optionCat, prevCatState})
        })
        if (response.data.next_page_url !== null) {
          this.moreCategory = true
        } else {
          this.moreCategory = false
        }
        this.currentPageCategory = response.data.current_page
        this.loadingMoreCategory = false
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingMoreCategory = false
      })
    },

    handleOnBlurCategoryShopee(query) {
      this.getCategoryTokopedia(query)
    },

    handleFilterCategory(payload) {
      if (payload === this.categoryPairStatus) return
      this.categoryPairStatus = payload
      this.getCategoryTokopedia(this.textSearchCategory)
    },

    async getSearchCategoryTokopedia(query, idx) {
      if (query !== '') {
        try {
          this.loadingSearchTokopediaOpt = true
          const param = {
            page: 1,
            per_page: 100,
            // is_last_level: 1,
            search_text: query,
            search_column: 'name',
            search_condition: 'like'
          }
          const response = await fetchCategoryTokopedia(param)
          this.dataCategory[idx].optionCat = (response.data.data)
        } catch (error) {
          this.$message({
            type: 'error',
            message: error.string
          })
          this.dataCategory[idx].optionCat = []
        } finally {
          this.loadingSearchTokopediaOpt = false
        }
      } else {
        this.dataCategory[idx].optionCat = [];
      }
    }, 

    handleOnChangeCategoryTokopedia(idx) {
      this.dataCategory[idx].tokopedia_category_name = this.dataCategory[idx].selectedCat.name
      this.dataCategory[idx].tokopedia_category_id = this.dataCategory[idx].selectedCat.tokopedia_category_id
    },

     async handleOnClearCategoryShopee(idx){
      if (this.dataCategory[idx].prevCatState.tokopedia_category_id !== null) {
        try {
          // await unpairCategory({category_id: this.dataCategory[idx].category_id})
          this.getCategoryTokopedia(this.textSearchCategory)
        } catch (error) {
          this.$message({
          type: 'error',
          message: error.string
        })
        }
      } else {
        this.dataCategory[idx].selectedCat = { name: '', shopee_category_id: ''}
        this.dataCategory[idx].optionCat = []
      }
    },

    async handleSaveCategorySet() {
      try {
        this.loadingSaveCategory = true
        const submittableData = this.dataCategory.filter(e => e.selectedCat.tokopedia_category_id !== '' && e.selectedCat.tokopedia_category_id !== e.prevCatState.tokopedia_category_id)
        if (submittableData.length === 0) return
        const formattedData = {
          pairs: []
        }
        submittableData.forEach(element => {
          let data = {
            category_id: element.category_id,
            tokopedia_category_id: element.selectedCat.tokopedia_category_id
          }
          formattedData.pairs.push(data)
        })
        const response = await pairCategoryTokopedia(formattedData)
        this.$message({
          type: 'success',
          // message: `${response.data.message}, total berhasil: ${response.data.total_success}. total gagal: ${response.data.total_failed}`
          message: 'Success'
        })
      } catch (error) {
        this.$message({
          type: 'error',
          message: error.string
        })
      } finally {
        this.loadingSaveCategory = false
        this.handleCloseDialogCategoryPair()
      }
    },

    handleCloseDialogCategoryPair () {
      this.dataCategory = []
      this.textSearchCategory = ''
      this.showDialogCategorySet = false
    },
  }
}
</script>
