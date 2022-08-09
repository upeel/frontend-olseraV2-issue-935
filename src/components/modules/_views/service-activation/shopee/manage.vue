<template>
  <page-fullscreen
    title="Shopee"
    class="page-fullscreen-blibli"
    @close="$router.push('/service-activation-v2')"
  >
    <template #sticky-top>
      <div class="card-dual">
        <card-info
          :title="shopeeStore.shop_name"
          :desc="shopeeStore.jumlah_product + ' ' + lang.product"
          :thumbnail="shopeeStore && shopeeStore.images &&  shopeeStore.images.length ? shopeeStore.images[0] : '/static/img/shopee.png'"
          :merchant-store="dataMerchant"
          :is-loading="isLoadingMerchant"
          :marketplace-id="'Shopee'"
          @addmerchant="handleAddMerchant"
          @changemerchant="handleChangeMerchant"
          class="card-dual__item"
        >
          <template #button>
            <el-button type="text" @click="syncDataProduct">
              Perbarui <svg-icon icon-class="refresh-icon" />
            </el-button>
            <el-dropdown trigger="click" >
              <span class="el-dropdown-link font-18 color-info">
                <svg-icon icon-class="more-vertical"></svg-icon>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-setting">
                  <el-button type="text" @click="showDialogCategorySet = true">
                    {{ rootLang.category_setting }}
                  </el-button>
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-close">
                  <el-button type="text" class="color-danger" @click="showDialogConfirmDeAuth = true">
                   <div>Hapus Integrasi</div>
                  </el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </card-info>
        <card-info
          :title="selectedStore.name"
          :thumbnail="shopeeStore && shopeeStore.merchant_olsera ? shopeeStore.merchant_olsera.logo : '/static/img/logo-olsera-premium.png'"
          :desc="shopeeStore && shopeeStore.merchant_olsera ? shopeeStore.merchant_olsera.jumlah_product + ' ' + lang.product : '0'"
          :is-loading="isLoadingMerchant"
          class="card-dual__item"
        >
          <template #button>
            <template v-if="merchantSettingStockStatus === 1 && totalConflict > 0" >
              <div class="flex-container">
                <div class="mr-12">
                  <el-button type="warning" round @click="handleSetSameStock()">Selesaikan {{ rootLang.conflict_stock }}</el-button>
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
          </template>
        </card-info>
      </div>

      <div v-if="visibleProgresSync" class="color-primary--soft--bg radius-5 p-16">
        <div class="flex-container">
          <div class="container-icon">
            <svg-icon icon-class="icon-cloud-download" />
          </div>
          <div class="full-width font-bold">
            {{ computedTextProgressSync }}
          </div>
          <div class="px-16" style="width: 20% text-right">
            <el-button type="text" @click="stopSync"><i class="el-icon-close color-danger font-bold font-18" /></el-button>
          </div>
        </div>
        <div class="full-width">
          <el-progress :percentage="dataPercentageProgress"></el-progress>
        </div>
      </div>

      <div 
        class="color-info font-12 pointer mt-16 mb-8" 
        style="display: inline-block;"
        @click="visibleLogs = true"
      >
        <svg-icon icon-class="clock" /> Terakhir update ke Shopee pada <strong>{{ dataLogForView.fcreated_time }} oleh {{ dataLogForView.user }}</strong>
      </div>

      <div
        class="flex-container pb-16">
        <div class="flex-container flex-grow-1" style="align-items: center">
          <div class="full-width">
            <div style="flex-grow: 1;">
              <el-select 
                class="el-select-etalase" 
                v-model="params.category_id" 
                filterable 
                :placeholder="rootLang.select + ' Category'" 
                size="medium"
                @change="handleFilterbyCategory" 
              >
                <el-option :label="lang.all + ' ' + lang.category" :value="0" />
                <el-option 
                  v-for="category in dataCategoryList" 
                  :key="category.id" 
                  :label="category.name" 
                  :value="category.shopee_category_id"
                />
                <div class="load-more mt-24" v-if="moreCategoryList" v-loading="loadingMoreCategory">
                  <el-button
                    @click="loadMoreCategoryList"
                    class="btn-block">
                    {{ $lang[langId].load_more }}
                  </el-button>
                </div>
              </el-select>
            </div>
          </div>
          <div class="px-8 font-20">|</div>
          <template v-if="dataProduct.length">
            <el-button 
              :disabled="!conflictStock"
              type="warning" 
              :class="visibleItem[3] ? 'active tag-button-tokped box-shadow-null' : 'tag-button-tokped box-shadow-null'"
              :loading="loading"
              @click="showGroup('conflict')" 
            >
              <svg-icon icon-class="alert-triangle" />
              {{ rootLang.conflict_stock }}
            </el-button>
            <el-button 
              type="info-addon" 
              :class="visibleItem[0] ? 'active tag-button-tokped box-shadow-null' : 'tag-button-tokped box-shadow-null'"
              :loading="loading"
              @click="showGroup('all')
            ">
                Semua
            </el-button>
            <el-button 
              type="info-addon" 
              :class="visibleItem[1] ? 'active tag-button-tokped box-shadow-null' : 'tag-button-tokped box-shadow-null'"
              :loading="loading"
              @click="showGroup('not_pair')" 
            >
                Belum Terhubung ({{ totalUnpair }})
            </el-button>
            <el-button 
              type="info-addon" 
              :class="visibleItem[2] ? 'active tag-button-tokped box-shadow-null' : 'tag-button-tokped box-shadow-null'" 
              :loading="loading"
              @click="showGroup('pair')" 
            >
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
        <div class="text-right ml-10">
          <div 
            class="table-handler-flex full-width text-right" 
            style="display: unset"
          >
            <el-input
              v-model="search" 
              :placeholder="lang.search" 
              clearable 
              prefix-icon="el-icon-search" 
              size="small" 
              class="input-search" 
              @change="handleSearch" 
              @keyup.native.enter="handleSearchByEnter" 
            />
          </div>
        </div>
      </div>
    </template>

    <fixed-table
      :headers="['Produk Shopee', 'Stok', 'Produk Olsera', 'Stok', '']"
      :data="dataProduct"
      :cols="['product_shopee', 'stock_shopee', 'product_olsera', 'stock_olsera', 'control']"
      :fixed-top="(56+59+36+42) + 'px'"
      :fixed-bottom="(76) + 'px'"
      :total-data="meta.totalProduct"
      :current-page="meta.currentPage"
      :per-page="params.per_page"
      :loading="loading"
      :empty-desc="'Oops, belum ada produk di ' + selectedStore.name + '. Tekan Sinkron Produk lalu hubungkan produk di Shopee ke Toko Olseramu.'"
      @changepage="handleChangePage"
      @change-size="handleChangeSizePage">
      <template #header-4>
        <el-button type="shopee" class="btn-block" :loading="loadingBulk" @click="getDataBulkProduct">
          Sekaligus
        </el-button>
      </template>
      <template #product_shopee="scope">
        <div class="mr-8 ml-8 flex-container full-width" >
          <div class="flex-container">
            <el-avatar
              :src="scope.row.pictures"
              :size="32"
              shape="square"
            />
            <div class="color-white--bg container-watermark-olsera">
              <el-avatar
                src="/static/img/shopee.png"
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
      <template #stock_shopee="scope">
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
        <div class="flex-container justify-center">
          <el-button v-if="scope.row.status === 2" :id="scope.row.product_id" @click="handlePair(scope.row)" type="pair-shopee" round >
            <svg-icon icon-class="plus" />
              Hubungkan
          </el-button>
          <el-button v-if="scope.row.status === 1 && scope.row.balance_stock === 2" @click="handleDetail(idx, scope.row)" type="shopee" round>
            <svg-icon icon-class="icon-feather-link-white" />
              {{ rootLang.paired }}
          </el-button>
          <el-button v-if="scope.row.status === 1 && scope.row.balance_stock === 1" @click="handleDetail(idx, scope.row)" type="warning" round>
            <svg-icon icon-class="alert-triangle" />
              {{ rootLang.conflict_stock }}
          </el-button>
        </div>
      </template>
    </fixed-table>

    <template #sticky-bottom>
      <card-info
        v-if="dataProduct.length"
        title="Update Stock ke Shopee">
        <template #title>
          Update Stock ke Shopee
        </template>
        <template #button>
          <div class="flex-container">
            <div class="full-width text-right px-8">
              <span>Samakan stok dgn Toko Olsera</span>
                <el-switch
                  slot="reference"
                  v-model="settingStockSwitch"
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
          <el-button 
            type="shopee" 
            :loading="loadingUpdateStock" 
            @click="merchantSettingStockStatus === 0 ? handleUpdateStock(false) : handleUpdateStock(true)"
          >
            {{ lang.update }}
          </el-button>
        </template>
      </div>
      <div>
        <div v-if="merchantSettingStockStatus === 1" class="mb-24 color-warning--bg color-white radius-10 p-8 flex-container">
          <div class="container-icon"> <svg-icon icon-class="alert-triangle" /> </div>
          {{ totalConflict }} produk konflik ditemukan
        </div>
        <img src="/static/img/service-activation/shopee/sync_product.png" >
        <div class="mt-24 word-break font-16">
          <span class="font-bold">Update Stok ke Shopee</span> untuk menyamakan stok Shopee dengan stok produk di toko Olseramu
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
      <div>
        <img src="/static/img/service-activation/shopee/update_stock_2.png" width="100%" style="margin-top: 8px">
        <div class="mt-24 word-break font-16">
          Stok produk di Shopee saat ini dibolehkan berbeda dengan produk di toko Olseramu. Nyalakan pelatuk untuk menyamakan stok produk Shopee dan Olsera.
        </div>
      </div>
      <div slot="footer">
        <el-button type="shopee" class="btn-block" :loading="loadingUpdateStock" @click="handleUpdateStock(false)">OK</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="showDialogConfirmDeAuth"
      :show-close="false"
      :close-on-click-modal="false"
      width="344px"
      append-to-body>
      <div slot="title" class="flex-container">
        <!-- <template>
          <close-esc :hideEsc="true" @close="cancelSameStock" />
        </template> -->
      </div>
      <div class="text-center">
        <div class="font-18 font-bold text-center">
          Apakah Anda yakin ingin menghapus integrasi Shopee di Olsera?
        </div>
        <div class="font-14 mt-24">
          Setelah dihapus, proses integrasi Shopee akan dimulai dari awal.
        </div>
      </div>
      <div slot="footer" class="flex-container">
        <el-button class="btn-block" @click="showDialogConfirmDeAuth = false">{{ lang.cancel }}</el-button>
        <el-button type="shopee" class="btn-block" :loading="loadingDeauthorize" @click="handleDeleteIntegration">Hapus integrasi</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogFinishSync"
      :show-close="false"
      :close-on-click-modal="false"
      width="344px"
      append-to-body>
      <div slot="title" class="flex-container">
        <!-- <template>
          <close-esc :hideEsc="true" @close="cancelSameStock" />
        </template> -->
      </div>
      <div class="text-center">
        <div class="font-18 text-center font-bold">Produk Shopee-mu berhasil diperbarui!</div>
        <div class="font-14 mt-24">
          Setiap produk bertanda 🔗 perlu dihubungkan dengan produk di Olsera.
        </div>
      </div>
      <div slot="footer" class="flex-container">
        <el-button class="btn-block" @click="closeDialogFinishSync">OK</el-button>
      </div>
    </el-dialog>

    <!-- category settings dialog--start -->
    <el-dialog
      :visible.sync="showDialogCategorySet"
      :show-close="false"
      :close-on-click-modal="false"
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
            @click="showDialogCategorySet = false"
          >{{ rootLang.cancel }}</el-button>
          <el-button 
            type="shopee" 
            :loading="loadingSaveCategory" 
            @click="handleSaveCategorySet">
          {{ rootLang.save }}</el-button>
        </template>
      </div>
      <div class="font-14">
        {{ rootLang.category_setting_head_caption }}
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
          <div 
            v-for="(cat, idx) in dataCategory" :key="cat.olsera_category_id" 
            class="flex-container mt-8"
          >
            <div 
              class="full-width"
              :class="cat.selectedCat.shopee_category_id !== '' ? 'bg-soft-orange' : 'color-info--bg '"
            >
              <div class="p-8">
                <div class="font-14">{{cat.olsera_category_name}}</div>
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
                :placeholder="rootLang.search_shopee_category"
                :loading="loadingSearchShopeeOpt"
                :remote-method="(query) => getSearchCategoryShopee(query, idx)"
                @change="() => handleOnChangeCategoryShopee(idx)"
                @clear="() => handleOnClearCategoryShopee(idx)"
              >
                <el-option
                  v-for="item in cat.optionCat"
                  :key="item.shopee_category_id"
                  :label="item.name"
                  :value="item">
                </el-option>
              </el-select>
            </div>
          </div>
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
          type="shopee" 
          class="full-width"
          :loading="loadingMoreCategory"
          @click="loadMoreCategory"
        >{{ rootLang.load_more }}</el-button>
      </div>
    </el-dialog>
    <!-- category settings dialog--end -->

    <offscreen-sync-product
      :show="visibleSynProduct"
      :form-edit="formSync"
      @cancel="handleCloseDialogPair"
    />

    <duplicate-product-v2
      :shopee-store="shopeeStore"
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

    <offscreen-detail-product
      :show="visibleDetailProduct"
      :form-edit="formDetail"
      @refresh="refreshData"
      @cancel="handleCloseDialogDetail"
      @resync="handleResync"
      @unpair="handleUnpair"
      :loading-unpair="loadingUnpair"
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

    <shopee-dialog-before-integration
      :show="visibleShopeeBeforeIntegration"
      :loading-submit="loadingSubmitShopee"
      @cancel="visibleShopeeBeforeIntegration = false"
    />

    <transition name="el-zoom-in-center">
      <div
        v-if="visibleLogs"
        class="offscreen-right-sidebar">
        <div class="offscreen-right-sidebar--wrapper">
          <div class="offscreen-right-sidebar--header text-left">
            History Update Shopee
            <close-esc @close="visibleLogs = false" />
          </div>

          <div style="height: 80%; max-height: calc(90vh - 48px); overflow: auto">
            <div v-loading="loadingLogs" v-for="(item, idx) in dataLogs" :key="idx" class="like-table-wrapper">
              <div v-for="data in dataLogs[idx]" :key="data.id" class="like-table-wrapper--item">
                <template>
                  <div class="font-bold full-width">{{ data.user }}</div>
                  <div class="full-width text-right">{{ data.fcreated_time }}</div>
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
import shopeeDialogBeforeIntegration from './dialogBeforeIntegration'
import basicComputedMixin from '@/mixins/basicComputedMixin'
import FloatingDiv from '../../../FloatingDiv'
import CloseEsc from '@/components/modules/CloseEsc'
import { 
  fetchProductShopee, 
  getShopeeStore, 
  getBulkProduct, 
  fetchListCategoryMapOlseraShopee,
  fetchListCategoryShopee,
  pairCategoryMulti,
  unpairCategory,
  setSameStockWithOlsera, 
  syncProductShopee, 
  getProgressSyncProductShopee,
  stopSynProductShopee,
  getLogsShopee, 
  resolveStockConflict,
  deauthorizationShopee,
  fetchDataDuplicate,
  unpairProductShopee,
  getListShopeeStore } from '@/api/thirdParty/shopee'
import offscreenSyncProduct from './offscreenSyncProduct'
import { fetchByStore as fetchGroups } from '@/api/thirdParty/group'
import offscreenDetailProduct from './offscreenDetailProduct'
import dialogBatchPair from './dialogBatchPair'
import duplicateProductV2 from './duplicateProductV2'

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
    duplicateProductV2,
    shopeeDialogBeforeIntegration
  },

  mixins: [basicComputedMixin],

  data() {
    return {
      loading: false,
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
      visibleSynProduct: false,
      formSync: {},
      visibleDetailProduct: false,
      next_page_duplicate: null,
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
      settingStockSwitch: null,
      merchantSettingStockStatus: null,
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
      dataSummaries: {
        can: '',
        cannot: ''
      },
      dataProductBulk: [],
      dataMerchant: [],
      loadingUpdateStock: false,
      shopeeStore: {},
      dataProductDuplicate: [],
      showSetSameStock: false,
      showDialogCategorySet: false,
      loadingDeauthorize: false,
      loadingShowDuplicate: false,
      showDialogConfirmDeAuth: false,
      showManageDuplicate: false,
      paramsDuplicate: {
        per_page: 20,
        page: 1
      },
      showDialogConfirmDeAuth: false,
      dataMerchant: [],
      visibleShopeeBeforeIntegration: false,
      loadingSubmitShopee: false,
      // category settings related datas--start
      dataCategory: [],
      textSearchCategory: '',
      categoryPairStatus: 'all',
      moreCategory: false,
      currentPageCategory: 1,
      totalStatsCategory: {},
      loadinFetchCategory: false,
      loadingMoreCategory: false,
      loadingSaveCategory: false,
      loadingSearchShopeeOpt: false,
      // category settings related datas--end
      loadingUnpair: false,
      isLoadingMerchant: false,
      dataCategoryList: [],
      moreCategoryList: false,
      currentPageCategoryList: '',
      visibleProgresSync: false,
      dataPercentageProgress: 0,
      loadingSync: false,
      intervalId: 0,
      dialogFinishSync: false
    }
  },

  computed: {
    computedTextProgressSync () {
      let textSync = ''
      if (this.dataPercentageProgress > 0 && this.dataPercentageProgress <= 20) {
        textSync = 'Memindah produk ke gudang Olsera...'
      } else if (this.dataPercentageProgress >= 21 && this.dataPercentageProgress <= 50) {
        textSync = 'Menyusun ulang produk...'
      } else if (this.dataPercentageProgress >= 51 && this.dataPercentageProgress <= 70) {
        textSync = 'Menyusun ulang produk...'
      } else if (this.dataPercentageProgress >= 71 && this.dataPercentageProgress <= 100) {
        textSync = 'Cek ulang, aman! Bentar lagi...'
      }
      return textSync
    }
  },

  watch: {
    showDialogCategorySet: {
      handler(value) {
        if (value) {
          this.getCategoryShopee()
        } else {
          this.dataCategory = []
          this.textSearchCategory = ''
          this.categoryPairStatus = 'all'
        }
      },
    },
  },

  mounted() {
    // this.fetchGroups()
    this.fetchListShop(true)
    this.getData()
    this.getStoreDetail()
    this.getUpdateLogs()
    this.getShopeeCategoryList()
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
      if (this.shopeeActiveStore !== null) {
        this.params.shopee_shop_id = this.shopeeActiveStore.shopee_shop_id
      }
      fetchProductShopee(this.params).then(response => {
        this.dataProduct = [ ...response.data.data]
        this.dataProduct.map(i => {
          this.activeButton.push(false)
        })
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
        this.settingStockSwitch = response.data.setting_stock
        this.merchantSettingStockStatus = response.data.setting_stock
        this.loading = false
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loading = false
      })
    },

    refreshDataDuplicate () {
      this.handleManageDuplicate()
    },

    handleFilterDuplicate (args) {
      if (args === 'all') {
        this.$delete(this.paramsDuplicate, 'is_completed')
      }
      if (args === 'can_duplicate') {
        this.paramsDuplicate.is_completed = 1
      }
      if (args === 'not_duplicate') {
        this.paramsDuplicate.is_completed = 0
      }

      this.handleManageDuplicate()
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
    },    

    handleManageDuplicate () {
      this.loadingShowDuplicate = true
      this.dataProductDuplicate = []
      console.log('param', this.paramsDuplicate)
      this.paramsDuplicate.shopee_shop_id = this.shopeeStore.shop_id
      fetchDataDuplicate(this.paramsDuplicate).then(response => {
        this.dataProductDuplicate = [...response.data.data]
        this.dataSummaries.can = response.data.total_completed
        this.dataSummaries.cannot = response.data.total_not_completed
        this.next_page_duplicate = response.data.links.next
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

    loadMoreDataDuplicate () {
      this.loadingShowDuplicate = true
      this.paramsDuplicate.page += 1
      fetchDataDuplicate(this.paramsDuplicate).then(response => {
        this.dataProductDuplicate.push(...response.data.data)
        this.dataSummaries.can = response.data.total_completed
        this.dataSummaries.cannot = response.data.total_not_mpleted

        // this.dataProductDuplicate.map(i => {
        //   if (i.validation !== null) {
        //     i.valobj = Object.values(i.validation)
        //   }
        // })

        this.next_page_duplicate = response.data.links.next
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

    syncDataProduct() {
      this.loading = true
      let params = {}
      if (this.shopeeActiveStore !== null) {
        params.shopee_shop_id = this.shopeeActiveStore.shopee_shop_id
      }
      syncProductShopee(params).then(response => {
        this.intervalId = setInterval(() => {
          this.getProgressSync()
        }, 3000);
        this.dataPercentageProgress = 10
        this.visibleProgresSync = true
        this.loading = false
      }).catch(error => {
        console.log('eee', error)
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loading = false
      })
    },

    getProgressSync() {
      this.loadingSync = true
      let params = {}
      // this.dataPercentageProgress = 0
      if (this.shopeeActiveStore !== null) {
        params.shopee_shop_id = this.shopeeActiveStore.shopee_shop_id
      }
      getProgressSyncProductShopee(params).then(response => {
        this.dataPercentageProgress = response.data.data.progress
        if (response.data.data.progress !== 0) {
          this.visibleProgresSync = true
        } else {
          this.visibleProgresSync = false
          this.dialogFinishSync = true
          clearInterval(this.intervalId)
        }
        this.loadingSync = false
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingSync = false
      })
    },

    stopSync() {
      this.loading = true
      let params = {}
      if (this.shopeeActiveStore !== null) {
        params.shopee_shop_id = this.shopeeActiveStore.shopee_shop_id
      }
      stopSynProductShopee(params).then(response => {
        this.getData()
        this.getStoreDetail()
        this.visibleProgresSync = false
        clearInterval(this.intervalId)
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
        per_page: 15
      }
      if (this.shopeeActiveStore !== null) {
        params.shopee_shop_id = this.shopeeActiveStore.shopee_shop_id
      }
      getLogsShopee(params).then(response => {
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
      let params ={
        per_page: 15,
        page: this.current_page + 1
      }
      if (this.shopeeActiveStore !== null) {
        params.shopee_shop_id = this.shopeeActiveStore.shopee_shop_id
      }
      getLogsShopee(params).then(response => {
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

    handleChangeMerchant (data) {
      this.$store.commit('SET_SHOPEE_ACTIVE_STORE', data)
      this.getData()
      this.getStoreDetail()
      this.getUpdateLogs()
    },

    refreshData () {
      this.getData()
      this.getStoreDetail()
      this.getUpdateLogs()
    },

    handlePair (data) {
      this.formSync = data
      this.visibleSynProduct = true
    },

    handleDetail (index, data) {
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
      this.getData()
    },

    refreshData () {
      this.getData()
    },

    cancelSameStock () {
      this.settingStockSwitch = this.merchantSettingStockStatus
      this.showSetSameStock = false
      this.showUpdateStock = false
    },

    handleSetSameStock() {
      // console.log('actual value', this.merchantSettingStockStatus)
      // console.log('changing', this.settingStockSwitch)
      if (this.settingStockSwitch === 0) {
        this.showUpdateStock = true
      }
      if (this.settingStockSwitch === 1) {
        this.showSetSameStock = true
      }
    },

    async setSameStock () {
      let data = {
        is_equalize_stock: this.settingStockSwitch,
        // shopee_shop_id: this.shopeeActiveStore.id
      }
      if (this.shopeeActiveStore !== null) {
        data.shopee_shop_id = this.shopeeActiveStore.shopee_shop_id
      }
      this.loadingSameStock = true
      await setSameStockWithOlsera(data).then(response => {
        this.$message({
          type: 'success',
          message: 'Berhasil update data Shopee'
        })
        this.showSetSameStock = false
        this.showUpdateStock = false
        this.loadingSameStock = false
        this.loadingUpdateStock = false
        this.refreshData()
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingSameStock = false
        this.loadingUpdateStock = false
        this.refreshData()
      })
    },

    handleUpdateStock (batch) {
      this.loadingUpdateStock = true
      if (batch) {
        this.fixStockConflict()
      } else {
        this.setSameStock()
      }
    },

    getDataBulkProduct() {
      this.loadingBulk = true
      if (this.shopeeActiveStore !== null) {
        this.paramsbulk.shopee_shop_id = this.shopeeActiveStore.shopee_shop_id
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
      try {
        this.isLoadingMerchant = true
        let params = {}
        if (this.shopeeActiveStore !== null) {
          params.shopee_shop_id = this.shopeeActiveStore.shopee_shop_id
        }
        const response = await getShopeeStore(params)
        this.shopeeStore = response.data.data
      } catch (error) {
        this.$message({
          type: 'error',
          message: error.string
        })
      } finally {
        this.isLoadingMerchant = false
      }
    },

    async fetchGroups() {
      await fetchGroups({
        sort_column: 'view_sort',
        sort_type: 'asc'
      }).then(response => {
        response.data.data.map(i => {
          if (i.name === 'Marketplace') {
            i.thirdparty_items.map(j => {
              if (j.alias_name === 'Shopee') {
                this.dataMerchant = [ ...j.main_store[0].marketplace_account]
              }
            })
          }
        })
        if (this.shopeeActiveStore === null) {
          this.$store.commit('SET_SHOPEE_ACTIVE_STORE', this.dataMerchant[0])
        }
      }).catch(error => {
        this.groups = []
        this.$message({
          type: 'error',
          message: error.string
        })
      })
    },

    async fixStockConflict () {
      this.loadingSameStock = true
      let params = {}
      if (this.shopeeActiveStore !== null) {
        params.shopee_shop_id = this.shopeeActiveStore.shopee_shop_id
      }
      await resolveStockConflict(params).then(response => {
        this.$message({
          type: 'success',
          message: 'Berhasil update data Shopee'
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

    handleDeleteIntegration () {
      this.loadingDeauthorize = true
      let params = {}
      if (this.shopeeActiveStore !== null) {
        params.shopee_shop_id = this.shopeeActiveStore.shopee_shop_id
      }
      deauthorizationShopee(params).then(response => {
        window.open(response.data.data.redirect_url, "_self")
        this.loadingDeauthorize = false
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingDeauthorize = false
      })
    },

    async handleUnpair (dataProduct) {
      try {
        this.loadingUnpair = true
        let data = {
          product_id: dataProduct.pair.product_id,
          type: dataProduct.pair.type
        }
        if (this.shopeeActiveStore !== null) {
          data.shopee_shop_id = this.shopeeActiveStore.shopee_shop_id
        }
        const response = await unpairProductShopee(data)
        this.$message({
          type: 'success',
          message: response.data.data.message
        })
        this.visibleDetailProduct = false
        this.refreshData()
      } catch (error) {
        this.$message({
          type: 'error',
          message: error.string
        })
      } finally {
        this.loadingUnpair = false
      }
    },

    async fetchGroups(fromMount) {
      this.loading = true
      await fetchGroups({
        sort_column: 'view_sort',
        sort_type: 'asc'
      }).then(response => {
        response.data.data.map(i => {
          if (i.name === 'Marketplace') {
            i.thirdparty_items.map(j => {
              if (j.alias_name === 'Shopee') {
                this.dataMerchant = [ ...j.main_store[0].marketplace_account]
              }
            })
          }
        })
        if (this.shopeeActiveStore === null) {
          let activeData = []
          this.dataMerchant.map(i => {
            if (i.status === 'A') { activeData.push(i) }
          })
          if (activeData.length > 0) {
            this.$store.commit('SET_SHOPEE_ACTIVE_STORE', activeData[0])
            this.getStoreDetail()
          } else {
            this.$router.push({
              path: '/service-activation-v2',
              query: {
                refresh: 1
              }
            })
          }
        } else if (this.shopeeActiveStore !== null && !fromMount) {
          let activeData = []
          this.dataMerchant.map(i => {
            if (i.status === 'A') { activeData.push(i) }
          })
          if (activeData.length > 0) {
            this.$store.commit('SET_SHOPEE_ACTIVE_STORE', activeData[0])
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
        this.loading = false
      }).catch(error => {
        this.groups = []
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loading = false
      })
    },

    async fetchListShop(fromMount) {
      this.loading = true
      await getListShopeeStore().then(response => {
        this.dataMerchant = [ ...response.data.data]
        this.dataMerchant.map(i => {
          i.product_count = i.jumlah_product
          i.photo = i.shopee_shop_images[0]
          i.shop_name = i.shopee_shop_name,
          i.status = 'A'
        })
        if (this.shopeeActiveStore === null) {
         if (this.dataMerchant.length > 0) {
            this.$store.commit('SET_SHOPEE_ACTIVE_STORE', this.dataMerchant[0])
            this.getStoreDetail()
          } else {
            this.$router.push({
              path: '/service-activation-v2',
              query: {
                refresh: 1
              }
            })
          }
        } else if (this.shopeeActiveStore !== null && !fromMount) {
          if (this.dataMerchant.length > 0) {
            this.$store.commit('SET_SHOPEE_ACTIVE_STORE', this.dataMerchant[0])
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
        this.loading = false
      }).catch(error => {
        this.groups = []
        this.$message({
          type: 'error',
          message: error.string
        })
        console.log('ee', error)
        this.loading = false
      })
    },

    handleAddMerchant () {
      this.visibleShopeeBeforeIntegration = true
    },

    // category settings related handler--start
    getCategoryShopee(query = '') {
      this.loadinFetchCategory = true
      let params = {
        per_page: 7,
      }
      if (this.categoryPairStatus === 'paired') {
        params.has_pairing = '1'
      }
      if (this.categoryPairStatus === 'unpaired') {
        params.has_pairing = '0'
      }
      if (query !== '') {
        params.search_text = query
        params.search_column = "olsera_category_name"
        params.search_condition = "like"
      }
      fetchListCategoryMapOlseraShopee(params).then(response => {
        this.dataCategory = response.data.data
        if (response.data.links.next !== null) {
          this.moreCategory = true
        } else {
          this.moreCategory = false
        }
        this.currentPageCategory = response.data.meta.current_page
        this.totalStatsCategory = {
          all: response.data.total_pair + response.data.total_unpair,
          paired: response.data.total_pair,
          unpaired: response.data.total_unpair
        }
        this.dataCategory = this.dataCategory.map((item) => {
          const prevCatState = {
            shopee_category_name: item.shopee_category_name,
            shopee_category_id: item.shopee_category_id
          }
          const selectedCat = { name: '', shopee_category_id: '' }
          const optionCat = []
          if (item.shopee_category_id !== null && item.shopee_category_name ) {
            selectedCat.name = item.shopee_category_name
            selectedCat.shopee_category_id = item.shopee_category_id
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

    handleFilterCategory(payload) {
      if (payload === this.categoryPairStatus) return
      this.categoryPairStatus = payload
      this.getCategoryShopee(this.textSearchCategory)
    },

    loadMoreCategory () {
      this.loadingMoreCategory = true
      let params = {
        per_page: 7,
        page: this.currentPageCategory + 1
      }
      if (this.categoryPairStatus === 'paired') {
        params.has_pairing = '1'
      }
      if (this.categoryPairStatus === 'unpaired') {
        params.has_pairing = '0'
      }
      if (this.textSearchCategory !== '') {
        params.search_text = this.textSearchCategory
        params.search_column = "olsera_category_name"
        params.search_condition = "like"
      }
      fetchListCategoryMapOlseraShopee(params).then(response => {
        response.data.data.map(item => {
          const prevCatState = {
            shopee_category_name: item.shopee_category_name,
            shopee_category_id: item.shopee_category_id
          }
          const selectedCat = { name: '', shopee_category_id: '' }
          const optionCat = []
          if (item.shopee_category_id !== null && item.shopee_category_name ) {
            selectedCat.name = item.shopee_category_name
            selectedCat.shopee_category_id = item.shopee_category_id
            optionCat.push(selectedCat)
          }
          this.dataCategory.push({ ...item, selectedCat, optionCat, prevCatState})
        })
        if (response.data.links.next !== null) {
          this.moreCategory = true
        } else {
          this.moreCategory = false
        }
        this.currentPageCategory = response.data.meta.current_page
        this.loadingMoreCategory = false
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingMoreCategory = false
      })
    },

    async getSearchCategoryShopee(query, idx) {
      if (query !== '') {
        try {
          this.loadingSearchShopeeOpt = true
          const param = {
            page: 1,
            per_page: 100,
            is_last_level: 1,
            search_text: query,
            search_column: 'name',
            search_condition: 'like'
          }
          const response = await fetchListCategoryShopee(param)
          this.dataCategory[idx].optionCat = (response.data.data)
        } catch (error) {
          this.$message({
            type: 'error',
            message: error.string
          })
          this.dataCategory[idx].optionCat = []
        } finally {
          this.loadingSearchShopeeOpt = false
        }
      } else {
        this.dataCategory[idx].optionCat = [];
      }
    },    

    handleOnBlurCategoryShopee(query) {
      this.getCategoryShopee(query)
    },

    handleOnChangeCategoryShopee(idx) {
      this.dataCategory[idx].shopee_category_name = this.dataCategory[idx].selectedCat.name
      this.dataCategory[idx].shopee_category_id = this.dataCategory[idx].selectedCat.shopee_category_id
    },

    async handleOnClearCategoryShopee(idx){
      if (this.dataCategory[idx].prevCatState.shopee_category_id !== null) {
        try {
          await unpairCategory({olsera_category_id: this.dataCategory[idx].olsera_category_id})
          this.getCategoryShopee(this.textSearchCategory)
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
        const submittableData = this.dataCategory.filter(e => e.selectedCat.shopee_category_id !== '' && e.selectedCat.shopee_category_id !== e.prevCatState.shopee_category_id)
        if (submittableData.length === 0) return
        const formattedData = {
          mapping: []
        }
        submittableData.forEach(element => {
          let data = {
            olsera_category_id: element.olsera_category_id,
            shopee_category_id: element.selectedCat.shopee_category_id
          }
          formattedData.mapping.push(data)
        })
        const response = await pairCategoryMulti(formattedData)
        this.$message({
          type: 'success',
          message: `${response.data.message}, total berhasil: ${response.data.total_success}. total gagal: ${response.data.total_failed}`
        })
      } catch (error) {
        this.$message({
          type: 'error',
          message: error.string
        })
      } finally {
        this.loadingSaveCategory = false
        this.showDialogCategorySet = false
      }
    },
    // category settings related handler--end

    getShopeeCategoryList() {
      this.loadinFetchCategory = true
      let params = {
        per_page: 100,
      }
      fetchListCategoryShopee(params).then(response => {
        this.dataCategoryList = response.data.data
        if (response.data.links.next !== null) {
          this.moreCategoryList = true
        } else {
          this.moreCategoryList = false
        }
        this.currentPageCategoryList = response.data.meta.current_page
        
        this.loadinFetchCategory = false
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadinFetchCategory = false
      })
    },

    loadMoreCategoryList () {
      this.loadingMoreCategory = true
      let params = {
        per_page: 100,
        page: this.currentPageCategoryList + 1
      }
      fetchListCategoryShopee(params).then(response => {
        response.data.data.map(item => {
          this.dataCategoryList.push(item)
        })
        if (response.data.links.next !== null) {
          this.moreCategoryList = true
        } else {
          this.moreCategoryList = false
        }
        this.currentPageCategoryList = response.data.meta.current_page
        this.loadingMoreCategory = false
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingMoreCategory = false
      })
    },

    closeDialogFinishSync () {
      this.dialogFinishSync = false
      this.getData()
      this.getStoreDetail()
    }

  }
}
</script>

<style lang="scss" scoped>
.bg-soft-orange {
  background-color: #EE4D2D1F;
}
</style>