<template>
  <div class="report-page">
    <report-list
      :showlist="showlist"
      :selected-report-by-search.sync="selectedReportBySearch"
      :paths="paths"
      :menu="'product'"
      @show-report="showReport"
    />

    <el-card class="box-card">
      <div
        v-if="activeReport.path !== 'freemium'"
        slot="header"
        class="table-handler-flex">
        <h4
          class="pointer"
          @click="toggleReportList">
          <span class="trigger-open-report-list">
            <svg-icon icon-class="arrow-left" />
          </span>
          {{ activeReport.label }}
        </h4>

        <div class="flex-grow-1"></div>

        <div>
          <date-range-picker
            v-if="!activeReport.withoutDateFilter"
            :init-date="initParamDate"
            size="mini"
            class="mb-4"
            @picked="getDataFiltered"
          />

          <el-select
            v-if="activeReport.productsalesbysku_SortTypes"
            v-model="params.sort_by"
            popper-class="dropdown-select-shift-report"
            size="mini"
            class="mb-4"
            @change="handleSortByChange">
            <el-option
              v-for="(item, key) in productsalesbysku_SortTypes"
              :key="key"
              :value="item"
              :label="'Sort By: ' + lang[item]"
            />
          </el-select>

          <el-input 
            v-if="activeReport.productsalesbysku_SortTypes"
            v-model="searchBySku"
            :placeholder="lang.search"
            clearable
            size="mini"
            class="mb-4"
            style="width: 150px"
            @change="handleSortByChange">
          </el-input>

          <el-select
            v-if="activeReport.productsalesbycategory_SortTypes"
            v-model="params.sort_by"
            popper-class="dropdown-select-shift-report"
            size="mini"
            class="mb-4"
            @change="handleSortByChange">
            <el-option
              v-for="(item, key) in productsalesbycategory_SortTypes"
              :key="key"
              :value="item"
              :label="'Sort By: ' + lang[item]"
            />
          </el-select>

          <el-select
            v-if="activeReport.productsalesbybrand_SortTypes"
            v-model="params.sort_by"
            popper-class="dropdown-select-shift-report"
            size="mini"
            class="mb-4"
            @change="handleSortByChange">
            <el-option
              v-for="(item, key) in productsalesbybrand_SortTypes"
              :key="key"
              :value="item"
              :label="'Sort By: ' + lang[item]"
            />
          </el-select>

          <el-select
            v-if="activeReport.productunsold_SortTypes"
            v-model="params.sort_by"
            popper-class="dropdown-select-shift-report"
            size="mini"
            @change="handleSortByChange">
            <el-option
              v-for="(item, key) in productunsold_SortTypes"
              :key="key"
              :value="item"
              :label="'Sort By: ' + lang[item]"
            />
          </el-select>

          <el-select
            v-if="activeReport.productstock_SortTypes"
            v-model="params.sort_by"
            popper-class="dropdown-select-shift-report"
            size="mini"
            class="mb-4"
            @change="handleSortByChange">
            <el-option
              v-for="(item, key) in productstock_SortTypes"
              :key="key"
              :value="item"
              :label="'Sort By: ' + $lang[langId][item]"
            />
          </el-select>

          <el-select
            v-if="activeReport.outgoingstockbydate_SortTypes"
            v-model="params.sort_by"
            popper-class="dropdown-select-shift-report"
            class="mb-4"
            size="mini"
            @change="handleSortByChange">
            <el-option
              v-for="(item, key) in outgoingstockbydate_SortTypes"
              :key="key"
              :value="item"
              :label="'Sort By: ' + lang[item]"
            />
          </el-select>

          <el-select
            v-if="activeReport.incomingstockbydate_SortTypes"
            v-model="params.sort_by"
            popper-class="dropdown-select-shift-report"
            class="mb-4"
            size="mini"
            @change="handleSortByChange">
            <el-option
              v-for="(item, key) in incomingstockbydate_SortTypes"
              :key="key"
              :value="item"
              :label="'Sort By: ' + lang[item]"
            />
          </el-select>

          <el-select
            v-if="activeReport.combosalesdetails_SortTypes"
            v-model="params.sort_by"
            popper-class="dropdown-select-shift-report"
            size="mini"
            class="mb-4"
            @change="handleSortByChange">
            <el-option
              v-for="(item, key) in combosalesdetails_SortTypes"
              :key="key"
              :value="item"
              :label="'Sort By: ' + lang[item]"
            />
          </el-select>

          <el-select
            v-if="activeReport.combostock_SortTypes"
            v-model="params.sort_by"
            popper-class="dropdown-select-shift-report"
            size="mini"
            class="mb-4"
            @change="handleSortByChange">
            <el-option
              v-for="(item, key) in combostock_SortTypes"
              :key="key"
              :value="item"
              :label="'Sort By: ' + lang[item]"
            />
          </el-select>

          <el-select
            v-if="activeReport.productpricetiers_SortTypes"
            v-model="params.sort_by"
            popper-class="dropdown-select-shift-report"
            size="mini"
            class="mb-4"
            @change="handleSortByChange">
            <el-option
              v-for="(item, key) in productpricetiers_SortTypes"
              :key="key"
              :value="item"
              :label="'Sort By: ' + lang[item]"
            />
          </el-select>

          <el-select
            v-if="activeReport.withlowstockalert"
            v-model="params.low_stock_alert"
            popper-class="dropdown-select-shift-report"
            size="mini"
            class="mb-4"
            @change="handleSortByChange">
            <el-option
              v-for="item in stockAlertOption"
              :key="item.id"
              :value="item.id"
              :label="rootLang[item.name]"
            />
          </el-select>

          <el-button
            :loading="loadingDownloadPdf"
            @click="getPDF(activeReport.path)"
            size="mini"
            icon="el-icon-printer">
            PDF
          </el-button>

          <el-button
            :loading="loadingDownloadExcel"
            @click="getExcel(activeReport.path)"
            size="mini"
            icon="el-icon-document">
            EXCEL
          </el-button>
        </div>
      </div>

      <div class="card-body" v-loading="loading">
        <template v-if="activeReport.path === 'productsalesbysku'">
          <table-sku
            :data="data"
            :lang="lang"
            :total="total"
            :current-page="current_page"
            @currentPage="handlecurrentPage"
            @changePage="handleChangePage"
            @changeSizePage="handleChangeSizePage"
            @sort="handleSortSku"
          />
        </template>

        <template v-if="activeReport.path === 'productsalesbycategory'">
          <table-category
            :data="data"
            :lang="lang"
            :total="total"
            :params="params"
            :current-page="current_page"
            :show-detail="showDetail"
            @currentPage="handlecurrentPage"
            @changePage="handleChangePage"
            @showDetail="handleShowDetailCategory"
            @changeSizePage="handleChangeSizePage"
            @sort="handleSortSku"
            @setParams="handleParamStokDetail"
          />
        </template>

        <template v-if="activeReport.path === 'productsalesbybrand'">
          <table-brand
            :data="data"
            :lang="lang"
            :total="total"
            :current-page="current_page"
            @currentPage="handlecurrentPage"
            @changePage="handleChangePage"
            @changeSizePage="handleChangeSizePage"
          />
        </template>

        <template v-if="activeReport.path === 'productsalesbyskufooddelivery'">
          <table-skufooddelivery
            :data="data"
            :lang="lang"
            :total="total"
            :current-page="current_page"
            @currentPage="handlecurrentPage"
            @changePage="handleChangePage"
            @changeSizePage="handleChangeSizePage"
          />
        </template>

        <template v-if="activeReport.path === 'productsalesbycollection'">
          <table-collection
            :data="data"
            :lang="lang"
            :total="total"
            :current-page="current_page"
            @currentPage="handlecurrentPage"
            @changePage="handleChangePage"
            @changeSizePage="handleChangeSizePage"
          />
        </template>

        <template v-if="activeReport.path === 'productmaterials'">
          <table-product-materials
            :data="data"
            :lang="lang"
            :total="total"
            :lang-id="langId"
            @changePage="handleChangePage"
          />
        </template>

        <template v-if="activeReport.path === 'productqtysold'">
          <table-qtysold
            :data="data"
            :lang="lang"
            :lang-id="langId"
            :summary="summary"
            :total="total"
            :current-page="current_page"
            @currentPage="handlecurrentPage"
            @changePage="handleChangePage"
            @changeSizePage="handleChangeSizePage"
          />
        </template>

        <template v-if="activeReport.path === 'productunsold'">
          <table-unsold
            :data="data"
            :lang="lang"
            :lang-id="langId"
            :summary="summary"
            :total="total"
            :current-page="current_page"
            @currentPage="handlecurrentPage"
            @changePage="handleChangePage"
            @changeSizePage="handleChangeSizePage"
          />
        </template>

        <template v-if="activeReport.path === 'productgroupstock'">
          <table-stocks-groups
            :data="data"
            :lang="lang"
            :lang-id="langId"
            :summary="summary"
            :total="total"
            :params="params"
            :token="token"
            :store="selectedStore"
            :current-page="current_page"
            @currentPage="handlecurrentPage"
            @changeSizePage="handleChangeSizePage"
            @showDetail="handleShowDetailCategory"
            @setParams="handleParamStokDetail" />
        </template>

        <template v-if="activeReport.path === 'productstock'">
          <table-stocks-products
            :data="data"
            :lang="lang"
            :lang-id="langId"
            :summary="summary"
            :total="total"
            :params="params"
            :current-page="current_page"
            @currentPage="handlecurrentPage"
            @changePage="handleChangePage"
            @changeSizePage="handleChangeSizePage"
          />
        </template>

        <template v-if="activeReport.path === 'incomingstockbydate'">
          <table-stocks-incoming
            :data="data"
            :lang="lang"
            :summary="summary"
            :total="total"
            :current-page="current_page"
            @currentPage="handlecurrentPage"
            @changePage="handleChangePage"
            @changeSizePage="handleChangeSizePage"
          />
        </template>

        <template v-if="activeReport.path === 'outgoingstockbydate'">
          <table-stocks-outgoing
            :data="data"
            :lang="lang"
            :summary="summary"
            :total="total"
            :current-page="current_page"
            @currentPage="handlecurrentPage"
            @changePage="handleChangePage"
            @changeSizePage="handleChangeSizePage"
          />
        </template>

        <template v-if="activeReport.path === 'productstockaging'">
          <table-stocks-aging
            :data="data"
            :lang="lang"
            :lang-id="langId"
            :summary="summary"
            :total="total"
            :current-page="current_page"
            @currentPage="handlecurrentPage"
            @changePage="handleChangePage"
            @changeSizePage="handleChangeSizePage"
          />
        </template>

        <template v-if="activeReport.path === 'productstockwarning'">
          <table-stocks-warning
            :data="data"
            :lang="lang"
            :total="total"
            :current-page="current_page"
            @currentPage="handlecurrentPage"
            @changePage="handleChangePage"
            @changeSizePage="handleChangeSizePage"
          />
        </template>

        <template v-if="activeReport.path === 'productpricetiers'">
          <table-price-tiers
            :data="data"
            :lang="lang"
            :total="total"
            :current-page="current_page"
            @currentPage="handlecurrentPage"
            @changePage="handleChangePage"
            @changeSizePage="handleChangeSizePage"
          />
        </template>

        <template v-if="activeReport.path === 'combosales'">
          <table-combo
            :data="data"
            :lang="lang"
            :total="total"
            :current-page="current_page"
            @currentPage="handlecurrentPage"
            @changePage="handleChangePage"
            @changeSizePage="handleChangeSizePage"
          />
        </template>

        <template v-if="activeReport.path === 'combosalesdetails'">
          <table-combo-details
            :data="data"
            :lang="lang"
            :total="total"
            :current-page="current_page"
            @currentPage="handlecurrentPage"
            @changePage="handleChangePage"
            @changeSizePage="handleChangeSizePage"
          />
        </template>

        <template v-if="activeReport.path === 'combostock'">
          <table-stocks-combo
            :data="data"
            :lang="lang"
            :total="total"
            :current-page="current_page"
            @currentPage="handlecurrentPage"
            @changePage="handleChangePage"
            @changeSizePage="handleChangeSizePage"
          />
        </template>

        <template v-if="activeReport.path === 'productqtyout'">
          <table-stocks-qtyoutgoing
            :data="data"
            :lang="lang"
            :total="total"
            :summary="summary"
            :lang-id="langId"
            :current-page="current_page"
            @currentPage="handlecurrentPage"
            @changePage="handleChangePage"
            @changeSizePage="handleChangeSizePage"
          />
        </template>

        <template v-if="activeReport.path === 'stockmovementdetailsbydate'">
          <table-stocks-movement
            :data="data"
            :lang="lang"
            :total="total"
            :lang-id="langId"
            :current-page="current_page"
            @currentPage="handlecurrentPage"
            @changePage="handleChangePage"
            @changeSizePage="handleChangeSizePage"
          />
        </template>

        <template v-if="activeReport.path === 'freemium'">
          <freemium :tabs="1"></freemium>
        </template>
      </div>
    </el-card>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import dateRangePicker from 'components/modules/DateRangePicker'

import TableSku from './_table-sku'

import TableSkufooddelivery from './_table-skufooddelivery'

import TableCategory from './_table-category'
import TableBrand from './_table-brand'
import TableCollection from './_table-collection'
import TableDeal from './_table-deal'
import TableQtysold from './_table-qtysold'
import TableUnsold from './_table-unsold'
import TableStocksGroups from './_table-stocks-groups'
import TableStocksAging from './_table-stocks-aging'
import TableStocksCombo from './_table-stocks-combo'
import TableStocksIncoming from './_table-stocks-incoming'
import TableStocksOutgoing from './_table-stocks-outgoing'
import TableStocksQtyoutgoing from './_table-stocks-qtyoutgoing'
import TableStocksProducts from './_table-stocks-products'
import TableStocksWarning from './_table-stocks-warning'
import TableComboDetails from './_table-combo-details'
import TableCombo from './_table-combo'
import TableStocksMovement from './_table-stockmovementdetailsbydate'
import TablePriceTiers from './_table-price-tiers'
import TableProductMaterials from './_table-productmaterials'

import Freemium from '@/components/FreemiumBanner'

import ReportList from '../ReportList'
import MixinReport from '../MixinReport'
// import basicComputedMixin from '@/mixins/basicComputedMixin'

var moment = require('moment')
// const startDate = moment().add(-29, 'days').format('YYYY-MM-DD')
const startDate = moment().format('YYYY-MM-DD')
const endDate = moment().format('YYYY-MM-DD')

const apiEndPoint = 'reportpenjualan'

export default {
  components: {
    dateRangePicker,
    TableSku,
    TableCategory,
    TableBrand,
    TableCollection,
    TableDeal,
    TableQtysold,
    TableUnsold,
    TableStocksGroups,
    TableStocksAging,
    TableStocksCombo,
    TableStocksIncoming,
    TableStocksOutgoing,
    TableStocksQtyoutgoing,
    TableStocksProducts,
    TableStocksWarning,
    TableCombo,
    TableComboDetails,
    TableStocksMovement,
    TablePriceTiers,
    ReportList,
    TableProductMaterials,
    TableSkufooddelivery,
    Freemium
  },

  mixins: [MixinReport],

  data() {
    return {
      loading: false,
      data: [],
      summary: {},
      showlist: true,
      selectedReportBySearch: '',
      paths: [
        {
          path: 'productsalesbysku',
          premium: false,
          label: this.$store.state.userStores.lang.product_sales_by_sku,
          path_key: 'product_sales_by_sku',
          active: true,
          productsalesbysku_SortTypes: true
        },
        {
          path: 'productsalesbycategory',
          premium: true,
          label: this.$store.state.userStores.lang.product_sales_by_category,
          path_key: 'product_sales_by_category',
          active: false,
          productsalesbycategory_SortTypes: true
        },

        {
          path: 'productsalesbyskufooddelivery',
          premium: false,
          label: this.$lang[this.$store.state.userStores.langId].sales_by_sku_food_delivery,
          path_key: 'product_sales_by_sku_food_delivery',
          active: true,
          // productsalesbysku_SortTypes: true
        },

        {
          path: 'productsalesbybrand',
          premium: true,
          label: this.$store.state.userStores.lang.product_sales_by_brand,
          path_key: 'product_sales_by_brand',
          active: false,
          productsalesbybrand_SortTypes: true
        },
        {
          path: 'productsalesbycollection',
          premium: true,
          label: this.$store.state.userStores.lang.product_sales_by_collection,
          path_key: 'product_sales_by_collection',
          active: false,
          productsalesbybrand_SortTypes: true
        },
        {
          path: 'productmaterials',
          premium: true,
          label: this.$lang[this.$store.state.userStores.langId].report_sales_product_material,
          path_key: 'report_sales_product_material',
          active: false
        },
        {
          path: 'productqtysold',
          premium: true,
          label: this.$store.state.userStores.lang.product_qty_sold,
          path_key: 'product_qty_sold',
          active: false
        },
        {
          path: 'productunsold',
          premium: true,
          label: this.$store.state.userStores.lang.product_unsold,
          path_key: 'product_unsold',
          active: false,
          productunsold_SortTypes: true
        },
        {
          path: 'productgroupstock',
          premium: true,
          label: this.$store.state.userStores.lang.product_group_stock_balance,
          path_key: 'product_group_stock_balance',
          active: false,
          withoutDateFilter: true
        },
        {
          path: 'productstock',
          premium: false,
          label: this.$store.state.userStores.lang.product_stock_balance,
          path_key: 'product_stock_balance',
          active: false,
          productstock_SortTypes: true,
          withoutDateFilter: true
        },
        {
          path: 'incomingstockbydate',
          premium: true,
          label: this.$store.state.userStores.lang.incoming_stocks,
          path_key: 'incoming_stocks',
          active: false,
          incomingstockbydate_SortTypes: true
        },
        {
          path: 'outgoingstockbydate',
          premium: true,
          label: this.$store.state.userStores.lang.outgoing_stocks,
          path_key: 'outgoing_stocks',
          active: false,
          outgoingstockbydate_SortTypes: true
        },
        {
          path: 'productqtyout',
          premium: true,
          label: this.$store.state.userStores.lang.product_qty_outgoing,
          path_key: 'product_qty_outgoing',
          active: false
        },
        {
          path: 'productstockaging',
          premium: true,
          label: this.$store.state.userStores.lang.product_stock_aging,
          path_key: 'product_stock_aging',
          withlowstockalert: true,
          active: false
        },
        {
          path: 'productstockwarning',
          premium: true,
          label: this.$store.state.userStores.lang.product_stock_warning,
          path_key: 'product_stock_warning',
          active: false,
          productstock_SortTypes: true,
          withoutDateFilter: true
        },
        {
          path: 'productpricetiers',
          premium: true,
          label: this.$store.state.userStores.lang.price_tiers,
          path_key: 'price_tiers',
          active: false,
          productpricetiers_SortTypes: true,
          withoutDateFilter: true
        },
        {
          path: 'combosales',
          premium: true,
          label: this.$store.state.userStores.lang.combo_sales,
          path_key: 'combo_sales',
          active: false,
          productsalesbybrand_SortTypes: true
        },
        {
          path: 'combosalesdetails',
          premium: true,
          label: this.$store.state.userStores.lang.combo_sales_details,
          path_key: 'combo_sales_details',
          active: false,
          combosalesdetails_SortTypes: true
        },
        {
          path: 'combostock',
          premium: true,
          label: this.$store.state.userStores.lang.combo_stock_balance,
          path_key: 'combo_stock_balance',
          active: false,
          combostock_SortTypes: true,
          withoutDateFilter: true
        },
        // {
        //   path: 'dealsales',
        //   label: this.$store.state.userStores.lang.deal_sales,
        //   path_key: 'deal_sales',
        //   active: false
        // },
        {
          path: 'stockmovementdetailsbydate',
          premium: true,
          label: this.$store.state.userStores.lang.stock_movement,
          path_key: 'stock_movement',
          active: false
        },
        {
          path: 'freemium',
          premium: false,
          label: 'Freemium',
          path_key: 'freemium',
          active: false,
          hide: true
        }
      ],
      params: {
        from: startDate,
        to: endDate,
        sort: 'desc',
        sort_by: '',
        type: '',
        page: 1,
        per_page: 50
      },
      total: 0,
      productsalesbysku_SortTypes: [
        'group',
        'name',
        'sku',
        'qty',
        'sales_amount',
        'profit'
      ],
      productsalesbycategory_SortTypes: [
        'group',
        'qty',
        'sales_amount',
      ],
      productsalesbybrand_SortTypes: [
        'name',
        'qty'
      ],
      productunsold_SortTypes: [
        'group',
        'name'
      ],
      productstock_SortTypes: [
        'name',
        'category',
        'stock_qty_asc',
        'stock_qty_desc',
        'sell_price',
        'buy_price'
      ],
      outgoingstockbydate_SortTypes: [
        'product_name',
        'transaction_no'
      ],
      productpricetiers_SortTypes: [
        'product_name',
        'customer_type'
      ],
      incomingstockbydate_SortTypes: [
        'product_name',
        'transaction_no',
        'supplier'
      ],
      combosalesdetails_SortTypes: [
        'order_no',
        'name'
      ],
      combostock_SortTypes: [
        'name',
        'stock_qty'
      ],
      categoryDetail: false,
      apiEndPoint: 'reportpenjualan',
      showDetail: false,
      stockAlertOption: [
        {
          id: 0,
          name: 'all_report'
        },
        {
          id: 1,
          name: 'with_stock_alert'
        }
      ],
      searchBySku: '',
      loadingDownloadPdf: false,
      loadingDownloadExcel: false,
      current_page: 1,
      paramStokDetail: {}
    }
  },

  computed: {
    accessByStore () {
      return ['cvsms']
    },
    accessByRole () {
      return ['PT', 'SA']
    },
    usingFilterSortBy () {
      return ['productstock',
        'productstockwarning',
        'productsalesbysku',
        'productsalesbycategory',
        'productsalesbybrand',
        'productsalesbycollection',
        'productunsold',
        'incomingstockbydate',
        'outgoingstockbydate',
        'productstockaging',
        'productpricetiers',
        'combosales',
        'combosalesdetails',
        'combostock']
    }
  },

  watch: {
    lang: {
      deep: true,
      immediate: true,
      handler(lang) {
        if (lang) {
          this.paths.map(item => {
            if (item.path_key !== 'report_sales_product_material') {
              item.label = lang[item.path_key]
            }
          })
        }
      }
    }
  },

  beforeRouteEnter (to, from, next) {
    let path = 'productsalesbysku'
    if (to.query.path) {
      path = to.query.path
    }
    console.log(from)
    next(async(vm) => {
      await vm.setDefaultParamsFromLocalStorage(vm, from)
      if (vm.paths) {
        const selectedStore = vm.$store.getters.webviewMode ? vm.$store.getters.webviewSelectedStore : vm.$store.getters.selectedStore
        const isFreemium = await selectedStore.pos_freemium
        if (isFreemium) {
          await vm.paths.map(item => {
            if ((item.path === path) && item.premium) {
              path = 'productsalesbysku'
            }
          })
        }
        vm.paths = await vm.paths.map(item => {
          if (item.path === path) {
            item.active = true
            // vm.selectedReportBySearch = item.path
          } else {
            item.active = false
          }
          return item
        })
      }
    })
  },

  methods: {
    getData(path, change) {

      // console.log('qweqweqweqwe', path, change);

      this.loading = true
      this.data = []
      this.categoryDetail = false
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      const activePath = path ? path : this.paths[0].path
      let activePathNew = null
      if (path === 'productgroupstock') {
        activePathNew = 'productgroupstocknew'
      } else {
        activePathNew = null
      }
      const urlId = this.selectedStore.url_id ? this.selectedStore.url_id : JSON.parse(localStorage.getItem('olsbo_selectedstore')).url_id
      const langId = this.langId ? this.langId : JSON.parse(localStorage.getItem('olsbo_selectedstore')).lang_code

      if (typeof change === 'undefined') {
        this.params.page = ''
        this.current_page = 1
      } else {
        if (!change) {
          this.params.page = ''
          this.current_page = 1
        }
      }

      if (activePath !== 'productsalesbysku' && activePath !== 'productsalesbycategory') {
        if (this.params.sort_by === 'name') {
          this.params.sort = 'asc'
        } else {
          this.params.sort = 'desc'
        }
      }

      if (activePath === 'combosalesdetails') {
        this.params.sort = 'asc'
      }
      if (activePath === 'productstock') {
        if (this.params.sort_by === 'category') {
          this.params.sort = 'asc'
        } else if (this.params.sort_by === 'stock_qty_asc') {
          this.params.sort = 'asc'
          this.params.sort_by = 'stock_qty'
        } else if (this.params.sort_by === 'stock_qty_desc') {
          this.params.sort = 'desc'
          this.params.sort_by = 'stock_qty'
        } else if (this.params.sort_by === 'buy_price') {
          this.params.sort = 'asc'
          this.params.sort_by = 'buy_price'
        } else if (this.params.sort_by === 'sell_price') {
          this.params.sort = 'asc'
          this.params.sort_by = 'sell_price'
        } else if (this.params.sort_by === '') {
          // console.log('aaa', this.params.sort_by)
          this.params.sort = 'asc'
          this.params.sort_by = 'name'
          // console.log('aaa', this.params.sort_by)
        }
      } 
      if (activePath === 'productstockwarning') {
        if (this.params.sort_by === '') {
          this.params.sort_by = 'name'
          this.params.sort = 'asc'
        } else if (this.params.sort_by === 'category') {
          this.params.sort = 'asc'
        }
      }
      if (!this.usingFilterSortBy.includes(activePath)) {
        // this.params.sort = ''
        this.params.sort_by = ''
      }

      if (activePath === 'stockmovementdetailsbydate') {
        this.params.sort = 'asc'
        this.params.sort_by = 'date'
      }
      if (activePath === 'incomingstockbydate') {
        this.params.sort = 'asc'
      }
      if (activePath === 'outgoingstockbydate') {
        this.params.sort = 'asc'
      }
      if (activePath === 'productgroupstock') {
        this.params.sort = 'asc'
      }
      if (activePath === 'productunsold') {
        this.params.sort = 'asc'
      }
      
      let config = {}
      if (activePath === 'productstock' || activePath === 'productstockwarning') {
        if (this.params.sort_by === 'name') {
          config = {
            params: {
              sort_by: 'name',
              from: this.params.from,
              to: this.params.to,
              sort: this.params.sort,
              type: this.params.type,
              page: this.params.page,
              per_page: this.params.per_page
            },
            headers: headers
          }
        } else {
          config = {
            params: this.params,
            headers: headers
          }
        }
      } else if (activePath === 'productsalesbycategory') {
        if (this.params.sort_by !== '') {
          config = {
            params: {
              sort_by: this.params.sort_by === 'qty' ? 'total_qty' : this.params.sort_by === 'sales_amount' ? 'total_amount' : this.params.sort_by,
              from: this.params.from,
              to: this.params.to,
              sort: this.params.sort,
              type: this.params.type,
              page: this.params.page,
              per_page: this.params.per_page
            },
            headers: headers
          }
        } else {
          config = {
            params: this.params,
            headers: headers
          }
        }
      } else {
        config = {
          params: this.params,
          headers: headers
        }
      }

      if (activePath === 'productsalesbysku' && this.searchBySku !== '') {
        this.params.search = this.searchBySku
      } else {
        this.searchBySku = ''
        this.$delete(this.params, 'search')
      }
      if (activePath === 'productsalesbyskufooddelivery') {
        // sort: desc
        // this.params.search = this.searchBySku
        // this.params.search.sort_by = 'name'
        config.params.sort = 'desc'
      } 
      // else {
      //   this.searchBySku = ''
      //   this.$delete(this.params, 'search')
      // }
      // console.log(activePath, baseApi(urlId, langId, apiEndPoint + '/' + activePath))
      const endPoint = activePathNew !== null ? apiEndPoint + '/' + activePathNew : apiEndPoint + '/' + activePath
      axios({
        method: 'GET',
        url: baseApi(urlId, langId, endPoint),
        params: config.params,
        headers: config.headers
      }).then(response => {
        this.data = response.data.data
        if (response.data.totaldata) {
          this.summary = response.data.totaldata
        }
        if (response.data.meta) {
          this.total = response.data.meta.total
        }
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.data = []
        this.summary = {}
        this.total = 0
        if (error.response.data.error.status_code !== 404) {
          if (this.accessByStore.includes(this.selectedStore.url_id) && this.accessByRole.includes(this.userRole.role_id)) {
            console.log('error', error.response.data.error.error)
          } else {
            this.$notify({
              type: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error
            })
          }
        }
      })
    },

    getFileMobile(path, type) {
      this.setLocalStorageForBackAfterDownload()
      const fileName = this.activeReport.label + '-' + this.params.from + '__' + this.params.to + '.' + type
      const apiParams = this.categoryDetail ? '?from=' + this.params.from + '&to=' + this.params.to + '&type=' + type + '&sort=' + this.params.sort + '&sort_by=' + this.params.sort_by + '&group_id=' + this.paramStokDetail.group_id : '?from=' + this.params.from + '&to=' + this.params.to + '&type=' + type + '&sort=' + this.params.sort + '&sort_by=' + this.params.sort_by
      let apiURL = ''
      if (this.categoryDetail) {
        apiURL = '/download/api/' + this.selectedStore.url_id + '/admin/v1/' + this.langId + '/' + path
      } else {
        apiURL = '/download/api/' + this.selectedStore.url_id + '/admin/v1/' + this.langId + '/' + apiEndPoint + '/' + path
      }
      window.location.href = apiURL + apiParams + ',' + fileName
    },

    getPDF(path) {
      path === 'productgroupstock' ? path = 'productgroupstocknew' : path = path
      let url = baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + '/' + path)
      if (this.categoryDetail && path !== 'productgroupstocknew') {
        path = 'salesreports/salesitemsbydate'
        url = baseApi(this.selectedStore.url_id, this.langId, path)
      } else if (this.categoryDetail && path === 'productgroupstocknew') {
        path = 'reportpenjualan/productstock'
        url = baseApi(this.selectedStore.url_id, this.langId, path)
      } else if (this.categoryDetail && path === 'productsalesbycategory') {
        path = 'salesreports/salesitemsbydate'
        url = baseApi(this.selectedStore.url_id, this.langId, path)
      }
      if (this.$store.getters.webviewMode) {
        this.getFileMobile(path, 'pdf')
      } else {
        this.loadingDownloadPdf = true
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }

        let params = {}
        if (path === 'reportpenjualan/productstock' || path === 'salesreports/salesitemsbydate') {
          params = { ...this.paramStokDetail}
        } else {
          params = {...this.params}
        }
        params.type = 'pdf'

        axios({
          // url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + '/' + path),
          url: url,
          method: 'GET',
          responseType: 'blob',
          headers,
          params
        }).then((response) => {
          const fileName = this.activeReport.label + '-' + this.params.from + '__' + this.params.to + '.pdf'
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click()
          this.loadingDownloadPdf = false
        }).catch(error => {
          // console.log(error, 'error')
          this.loadingDownloadPdf = false
        })
      }
    },

    getExcel(path) {
      path === 'productgroupstock' ? path = 'productgroupstocknew' : path = path
      let url = baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + '/' + path)
      if (this.categoryDetail && path !== 'productgroupstocknew') {
        path = 'salesreports/salesitemsbydate'
        url = baseApi(this.selectedStore.url_id, this.langId, path)
      } else if (this.categoryDetail && path === 'productgroupstocknew') {
        path = 'reportpenjualan/productstock'
        url = baseApi(this.selectedStore.url_id, this.langId, path)
      } else if (this.categoryDetail && path === 'productsalesbycategory') {
        path = 'salesreports/salesitemsbydate'
        url = baseApi(this.selectedStore.url_id, this.langId, path)
      }
      if (this.$store.getters.webviewMode) {
        this.getFileMobile(path, 'xlsx')
      } else {
        this.loadingDownloadExcel = true
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }
  
        let params = {}
        if (path === 'reportpenjualan/productstock' || path === 'salesreports/salesitemsbydate') {
          params = { ...this.paramStokDetail}
        } else {
          params = {...this.params}
        }
        params.type = 'xlsx'
  
        axios({
          // url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + '/' + path),
          url: url,
          method: 'GET',
          responseType: 'blob',
          headers,
          params
        }).then((response) => {
          const fileName = this.activeReport.label + '-' + this.params.from + '__' + this.params.to + '.xlsx'
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click()
          this.loadingDownloadExcel = false
        }).catch(error => {
          // console.log(error, 'error')
          this.loadingDownloadExcel = false
        })
      }
    },

    async showReport(path, index) {
      this.paths = await this.paths.map(item => {
        item.active = false
        return item
      })

      this.paths = await this.paths.map(item => {
        if (item.path === path) {
          item.active = true
        }
        return item
      })

      let indexPath = '/reports/products'

      if (this.$store.getters.webviewMode) {
        indexPath = '/reports-mobile/products'
      }

      // clear params sort_by after change menu list report
      this.params.sort_by = ''
      // clear params sort_by after change menu list report

      this.$router.push({
        path: indexPath,
        query: {
          path
        }
      })
      // this.params.from = startDate
      // this.params.to = endDate
      if (path !== 'freemium') {
        this.getData(path)
      }
    },

    getDataFiltered(date) {
      this.params.from = date.start_date
      this.params.to = date.end_date
      // handle show list category again if date filter change
      this.showDetail = false
      this.getData(this.activeReport.path)
    },

    handleSortByChange() {
      this.getData(this.activeReport.path)
    },

    handleChangePage(page) {
      this.params.page = page
      // this.params.sort_by = ''
      var change = true
      this.getData(this.activeReport.path, change)
    },

    handleChangeSizePage(page) {
      this.params.per_page = page
      this.params.page = 1
      this.current_page = 1
      var change = true
      this.getData(this.activeReport.path, change)
    },

    handlecurrentPage(cp) {
      this.current_page = cp
    },

    handleShowDetailCategory(path) {
      this.categoryDetail = path
    },

    handleSortSku (data) {
      this.params.sort_by = data.sort_by
      this.params.sort = data.asc ? 'asc' : 'desc'
      this.getData(this.activeReport.path)
    },

    handleParamStokDetail (data) {
      this.paramStokDetail = { ...data}
    }
  }
}
</script>
