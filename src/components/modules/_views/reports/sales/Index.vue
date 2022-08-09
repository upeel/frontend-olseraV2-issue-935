<template>
  <div class="report-page">
    <report-list
      :showlist="showlist"
      :selected-report-by-search.sync="selectedReportBySearch"
      :paths="paths"
      :menu="'sales'"
      @show-report="showReport"
    />

    <el-card class="box-card">
      <div v-if="activeReport.path !== 'freemium'" slot="header" class="table-handler-flex">
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
            size="mini"
            :init-date="initParamDate"
            :style="activeReport.withoutDate ? 'display: none' : 'display: inline-block'"
            @picked="getDataFiltered"
          />

          <el-select
            v-if="activeReport.filterSummary"
            v-model="params.wunpaid"
            popper-class="dropdown-select-shift-report"
            @change="getData(activeReport.path)"
            size="mini">
            <el-option value="1" :label="lang.sales" />
            <el-option value="0" :label="lang.payment" />
          </el-select>

          <el-select
            v-if="activeReport.withPaidSetting"
            v-model="params.wunpaid"
            popper-class="dropdown-select-shift-report"
            @change="getData(activeReport.path)"
            size="mini">
            <el-option value="1" :label="'+' + lang.unpaid" />
            <el-option value="0" :label="lang.paid" />
          </el-select>

          <template v-if="stageLevel === 'dev' || stageLevel === 'sit'">
            <el-select
              v-if="activeReport.withOrderSource"
              v-model="params.order_source_online"
              popper-class="dropdown-select-shift-report"
              @change="getData(activeReport.path)"
              placeholder="Select"
              size="mini">
              <el-option value="0" :label="lang.all" />
              <el-option value="O" :label="'Online'" />
              <el-option value="E" :label="'Dine In'" />
              <el-option value="S" :label="'Delivery'" />
              <el-option value="W" :label="'Take Away'" />
            </el-select>
          </template>

          <el-select
            v-if="activeReport.withPaymentSetting"
            v-model="params.filter_by"
            popper-class="dropdown-select-shift-report"
            @change="getData(activeReport.path)"
            size="mini">
              <el-option value="0" :label="lang.payment" />
              <el-option value="1" :label="lang.sales" />
          </el-select>

          <template v-if="selectedStore.url_id === 'setdemo1' || selectedStore.url_id === 'allinolsera2'">
            <el-select
              v-if="activeReport.withFoodDelivery"
              v-model="params.order_source"
              popper-class="dropdown-select-shift-report"
              @change="getData(activeReport.path)"
              size="mini">
                <el-option value="0" :label="rootLang.all_partner" />
                <el-option value="X" label="GoFood" />
                <el-option value="Y" label="GrabFood" />
                <el-option value="Z" label="ShopeeFood" />
            </el-select>
          </template>
          <template v-if="selectedStore.url_id === 'setdemo1' || selectedStore.url_id === 'allinolsera2'">
            <el-select
              v-if="activeReport.withMarketplace"
              v-model="params.order_source"
              popper-class="dropdown-select-shift-report"
              @change="getData(activeReport.path)"
              size="mini">
                <el-option value="0" :label="rootLang.all_partner" />
                <el-option value="A" label="BUKALAPAK" />
                <el-option value="B" label="BLIBLI" />
                <el-option value="J" label="JDID" />
                <el-option value="K" label="TOKOPEDIA" />
                <el-option value="L" label="LAZADA" />
                <el-option value="H" label="Shopee" />
            </el-select>
          </template>

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

      <div v-loading="loading" class="card-body">
        <component
          ref="tables"
          v-if="activeReport.path !== 'freemium'"
          @picked-time="pickedTime"
          @picked-brand="pickedBrand"
          @pick-split="pickedSplit"
          @showdetaildata="showDetailData"
          @changePage="handleChangePage"
          @changeSizePage="handleChangeSizePage"
          @currentPage="handlecurrentPage"
          @showdetail="handleShowDetail"
          :params="params"
          :is="loadedComponent"
          :data="data"
          :summary="summary"
          :lang="lang"
          :lang-id="langId"
          :total="total"
          :current-page="current_page"
        />
        <template v-else>
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

import TableAllin1salesummarybydate from './_table-allin1salesummarybydate'
import TableSalesdetails from './_table-salesdetails'

// import TableSalesdetailsbydatetime from './_table-salesbydate'
import TableSalesdetailsbydatetime from './_table-salesdetailsbydatetime'
// import TableSalesbydate from './_table-salesbydate'
import TableSalesbydate from './_table-salesbydate'
import TableSalesitemsbydate from './_table-salesitemsbydate'
import TableSalesitemsbybrands from './_table-salesitemsbybrands'
import TableSalesitemsbycollections from './_table-salesitemsbycollections'
import TableSalesitemdiscountsbydate from './_table-salesitemdiscountsbydate'
import TableSalesitemaddonsbydate from './_table-salesitemaddonsbydate'
import TableSalesbycustomer from './_table-salesbycustomer'
import TableSalesbysalesman from './_table-salesbysalesman'
import TableSalesbytableno from './_table-salesbytableno'
import TableComissionbyserver from './_table-comissionbyserver'
import TableSalesbystation from './_table-salesbystation'
import TableSalesbycity from './_table-salesbycity'
import TableSalesbyshippingcity from './_table-salesbyshippingcity'
import TableDiscountsummarybydate from './_table-discountsummarybydate'
import TableExpensebydate from './_table-expensebydate'
import TableSalesincomeexpense from './_table-salesincomeexpense'
import TableCreditsalesdetails from './_table-creditsalesdetails'
import TableCreditpayment from './_table-creditpayment'
import TableProfitloss from './_table-profitloss'
import TableVoiddetails from './_table-voiddetails'
import TableReturndetails from './_table-returndetails'
import TableReturnbydate from './_table-returnbydate'
import TableReturnbycustomer from './_table-returnbycustomer'
import TableCancelleditemsbydate from './_table-cancelleditemsbydate'
import TableReturneditemsbydate from './_table-returneditemsbydate'
import TableSalesdetailsonlineorder from './_table-salesdetailonline'
import TableSalesdetailsonlineorderojekonline from './_table-salesdetailfooddelivery.vue'
import TableSalesdetaildeposit from './_table-salesdetaildeposit.vue'

// salesdetailsmarketplace
import TableSalesdetailsmarketplace from './_table-salesdetailmarketplace.vue'

// report deposit customer
import TableRemainingdepositbycustomer from './_table-remainingdepositbycustomer.vue'


import TableSalesdetailsonlineordergrab from './_table-salesdetailonlineorderbygrab.vue'
import TableSalesdetailunpaidpos from './_table-salesdetailunpaidpos'

import TableDetailposunpaidvoid from './_table-detailposunpaidvoid'

import TableSalesitemunpaidposbydate from './_table-salesitemunpaidposbydate'
import TableSalesitemsbycredits from './_table-salesitemsbycredits'
import TableSalesitemsbynoncredits from './_table-salesitemsbynoncredits'
import TableSalesbackdate from './_table-salesbackdate'
// import TableProfitLoss from './_table-profit-loss'
import Freemium from '@/components/FreemiumBanner'

import ReportList from '../ReportList'
import MixinReport from '../MixinReport'
var moment = require('moment')
// const startDate = moment().add(-29, 'days').format('YYYY-MM-DD')
const startDate = moment().format('YYYY-MM-DD')
const endDate = moment().format('YYYY-MM-DD')

const apiEndPoint = 'salesreports'

export default {
  components: {
    dateRangePicker,
    TableAllin1salesummarybydate,
    TableSalesdetails,
    TableSalesdetailsbydatetime,
    TableSalesbydate,
    TableSalesitemsbydate,
    TableSalesitemsbybrands,
    TableSalesitemdiscountsbydate,
    TableSalesitemaddonsbydate,
    TableSalesbycustomer,
    TableSalesbysalesman,
    TableComissionbyserver,
    TableSalesbystation,
    TableSalesbycity,
    TableSalesbyshippingcity,
    TableDiscountsummarybydate,
    TableExpensebydate,
    TableSalesincomeexpense,
    TableCreditsalesdetails,
    TableCreditpayment,
    TableProfitloss,
    TableVoiddetails,
    TableReturndetails,
    TableReturnbydate,
    TableReturnbycustomer,
    TableCancelleditemsbydate,
    TableReturneditemsbydate,
    TableSalesdetailsonlineorder,
    TableSalesitemsbycredits,
    TableSalesitemsbynoncredits,
    TableSalesdetailunpaidpos,
    TableSalesitemunpaidposbydate,
    TableDetailposunpaidvoid,
    TableSalesdetailsmarketplace,
    TableSalesdetailsonlineorderojekonline,
    TableSalesdetailsonlineordergrab,
    TableSalesbackdate,
    TableSalesitemsbycollections,
    TableSalesbytableno,
    TableRemainingdepositbycustomer,
    TableSalesdetaildeposit,
    ReportList,
    Freemium
    // TableProfitLoss
  },

  mixins: [MixinReport],

  data() {
    return {
      loading: false,
      data: [],
      summary: [],
      selectedReportBySearch: '',
      showlist: true,
      paths: [
        {
          path: 'allin1salesummarybydate',
          premium: true,
          disabled: false,
          label: this.$lang[this.$store.state.userStores.langId].general_jurnal,
          path_key: '',
          active: true,
          filterSummary: true
        },
        {
          path: 'salesdetails',
          premium: false,
          disabled: false,
          label: this.$store.state.userStores.lang.sales_details,
          path_key: 'sales_details',
          active: false,
          withPaidSetting: true
        },
        {
          path: 'salesbackdate',
          premium: false,
          disabled: false,
          label: this.$lang[this.$store.state.userStores.langId].sales_backdate,
          path_key: 'sales_backdate',
          active: false,
          withPaidSetting: true
        },
        {
          path: 'salesdetailsonlineorder',
          premium: true,
          disabled: false,
          label: this.$lang[this.$store.state.userStores.langId].online_sales_detail,
          path_key: 'online_sales_detail',
          active: false,
          withPaidSetting: true,
          withOrderSource: true
        },
        {
          path: 'salesdetailsonlineorderojekonline',
          premium: true,
          disabled: false,
          label: this.$lang[this.$store.state.userStores.langId].sales_food_delivery,
          path_key: 'sales_food_delivery',
          active: false,
          withPaidSetting: true,
          withFoodDelivery: true
        },

        {
          path: 'salesdetailsmarketplace',
          premium: true,
          disabled: false,
          label: this.$lang[this.$store.state.userStores.langId].sales_marketplace,
          path_key: 'sales_marketplace',
          active: false,
          withPaidSetting: true,
          withMarketplace: true
        },

        {
          path: 'salesdetailsonlineordergrab',
          premium: true,
          disabled: false,
          label: this.$lang[this.$store.state.userStores.langId].sales_detail_by_grab,
          path_key: 'sales_detail_by_grab',
          active: false,
          withPaidSetting: true
        },
        {
          path: 'salesdetailunpaidpos',
          premium: true,
          disabled: false,
          label: this.$lang[this.$store.state.userStores.langId].sales_detail_unpaid_pos,
          path_key: 'sales_detail_unpaid_pos',
          active: false,
          withPaidSetting: false
        },
        {
          path: 'salesitemunpaidposbydate',
          premium: true,
          disabled: false,
          label: this.$lang[this.$store.state.userStores.langId].sales_item_unpaid_pos_bydate,
          path_key: 'sales_item_unpaid_pos_bydate',
          active: false,
          withPaidSetting: false
        },
        {
          path: 'salesdetailsbydatetime',
          premium: true,
          disabled: false,
          label: this.$store.state.userStores.lang.sales_details_by_hour,
          path_key: 'sales_details_by_hour',
          active: false,
          withoutDate: true
        },
        {
          path: 'salesdetaildeposit',
          premium: true,
          disabled: false,
          label: this.$store.state.userStores.lang.sales_detail_deposit,
          path_key: 'sales_detail_deposit',
          active: false,
        },
        {
          path: 'salesbydate',
          premium: true,
          disabled: false,
          label: this.$store.state.userStores.lang.sales_by_date,
          path_key: 'sales_by_date',
          active: false,
          withPaidSetting: true
        },
        {
          path: 'salesitemsbydate',
          premium: true,
          disabled: false,
          label: this.$store.state.userStores.lang.sales_items_by_date,
          path_key: 'sales_items_by_date',
          active: false,
          withPaidSetting: true
        },
        {
          path: 'salesitemsbybrands',
          premium: true,
          disabled: false,
          label: this.$store.state.userStores.lang.sales_items_by_brands,
          path_key: 'sales_items_by_brands',
          active: false,
          withPaidSetting: true
        },
        {
          path: 'salesitemsbycollections',
          premium: true,
          disabled: false,
          label: this.$lang[this.$store.state.userStores.langId].sales_items_by_collections,
          path_key: 'sales_items_by_collections',
          active: false,
          withPaidSetting: true
        },
        {
          path: 'salesitemsbycredits',
          premium: true,
          disabled: false,
          label: this.$lang[this.$store.state.userStores.langId].sales_items_by_credits,
          path_key: 'sales_items_by_credits',
          active: false,
          withPaidSetting: false,
          withPaymentMethod: true
        },
        {
          path: 'salesitemsbynoncredits',
          premium: true,
          disabled: false,
          label: this.$lang[this.$store.state.userStores.langId].sales_items_by_noncredits,
          path_key: 'sales_items_by_noncredits',
          active: false,
          withPaidSetting: false,
          withPaymentMethod: true
        },
        {
          path: 'salesitemdiscountsbydate',
          premium: true,
          disabled: false,
          label: this.$store.state.userStores.lang.sales_item_discounts_by_date,
          path_key: 'sales_item_discounts_by_date',
          active: false,
          withPaidSetting: true
        },
        {
          path: 'salesitemaddonsbydate',
          premium: true,
          disabled: false,
          label: this.$store.state.userStores.lang.sales_item_addons_by_date,
          path_key: 'sales_item_addons_by_date',
          active: false,
          withPaidSetting: true
        },
        {
          path: 'salesbycustomer',
          premium: true,
          disabled: false,
          label: this.$store.state.userStores.lang.sales_by_customer,
          path_key: 'sales_by_customer',
          active: false,
          withPaidSetting: true
        },
        {
          path: 'salesbysalesman',
          premium: true,
          disabled: false,
          label: this.$store.state.userStores.lang.sales_by_salesman,
          path_key: 'sales_by_salesman',
          active: false,
          withPaidSetting: true
        },
        {
          path: 'salesbytableno',
          premium: false,
          disabled: false,
          label: this.$lang[this.$store.state.userStores.langId].sales_by_tableno,
          path_key: 'sales_by_tableno',
          active: false,
          withPaidSetting: true
        },
        {
          path: 'comissionbyserver',
          premium: true,
          disabled: false,
          label: this.$store.state.userStores.lang.comission_by_server,
          path_key: 'comission_by_server',
          active: false,
          withPaidSetting: true
        },
        {
          path: 'salesbystation',
          premium: true,
          disabled: false,
          label: this.$store.state.userStores.lang.sales_by_station,
          path_key: 'sales_by_station',
          active: false,
          withPaidSetting: true
        },
        {
          path: 'salesbycity',
          premium: true,
          disabled: false,
          label: this.$store.state.userStores.lang.sales_by_customer_city,
          path_key: 'sales_by_customer_city',
          active: false,
          withPaidSetting: true
        },

        {
          path: 'salesbyshippingcity',
          premium: true,
          disabled: false,
          label: this.$store.state.userStores.lang.sales_by_shipping_city,
          path_key: 'sales_by_shipping_city',
          active: false,
          withPaidSetting: true
        },

        {
          path: 'discountsummarybydate',
          premium: true,
          disabled: false,
          label: this.$store.state.userStores.lang.discount_summary,
          path_key: 'discount_summary',
          active: false,
          withPaidSetting: true
        },
        {
          path: 'expensebydate',
          premium: true,
          disabled: this.$store.state.userStores.userRole.role_id === 'AS' ||
            this.$store.getters.loggedInUser.email === 'am@samaramicron.com' ||
            this.$store.getters.loggedInUser.email === 'store1@samaramicron.com' ||
            this.$store.getters.loggedInUser.email === 'store2@samaramicron.com' ||
            this.$store.getters.loggedInUser.email === 'martina.maria@samaramicron.com' ||
            this.$store.state.userStores.userRole.role_id === 'SS' ? true : false,
          label: this.$store.state.userStores.lang.expenses_by_date,
          path_key: 'expenses_by_date',
          active: false
        },
        {
          path: 'salesincomeexpense',
          premium: true,
          disabled: this.$store.state.userStores.userRole.role_id === 'AS' ||
            this.$store.state.userStores.userRole.role_id === 'SS' ||
            this.$store.getters.loggedInUser.email === 'am@samaramicron.com' ||
            this.$store.getters.loggedInUser.email === 'store1@samaramicron.com' ||
            this.$store.getters.loggedInUser.email === 'store2@samaramicron.com' ||
            this.$store.getters.loggedInUser.email === 'martina.maria@samaramicron.com' ? true : false,
          label: this.$store.state.userStores.lang.sales_with_income_expense,
          path_key: 'sales_with_income_expense',
          active: false
        },
        {
          path: 'creditsalesdetails',
          premium: true,
          disabled: false,
          label: this.$store.state.userStores.lang.credit_sales_details,
          path_key: 'credit_sales_details',
          active: false,
          withPaidSetting: true
        },
        {
          path: 'creditpayment',
          premium: true,
          disabled: false,
          label: this.$store.state.userStores.lang.credit_payments,
          path_key: 'credit_payments',
          active: false
        },
        {
          path: 'profitloss',
          premium: true,
          disabled: false,
          label: this.$store.state.userStores.lang.profit_loss,
          path_key: 'profit_loss',
          disabled: this.$store.state.userStores.userRole.role_id === 'AS' ||
            this.$store.state.userStores.userRole.role_id === 'SS' ||
            this.$store.getters.loggedInUser.email === 'am@samaramicron.com' ||
            this.$store.getters.loggedInUser.email === 'store1@samaramicron.com' ||
            this.$store.getters.loggedInUser.email === 'store2@samaramicron.com' ||
            this.$store.getters.loggedInUser.email === 'martina.maria@samaramicron.com' ? true : false,
          active: false,
          withPaymentSetting: true
        },
        
        {
          path: 'voiddetails',
          premium: true,
          disabled: false,
          label: this.$store.state.userStores.lang.sales_cancellation_details,
          path_key: 'sales_cancellation_details',
          active: false,
          withPaidSetting: true
        },
        {
          path: 'detailposunpaidvoid',
          premium: true,
          disabled: false,
          label: this.$lang[this.$store.state.userStores.langId].detail_pos_unpaid_void,
          path_key: 'detail_pos_unpaid_void',
          active: false,
          // withPaidSetting: true
        },
        {
          path: 'returndetails',
          premium: true,
          disabled: false,
          label: this.$store.state.userStores.lang.sales_return_details,
          path_key: 'sales_return_details',
          active: false
        },
        {
          path: 'returnbydate',
          premium: true,
          disabled: false,
          label: this.$store.state.userStores.lang.sales_return_by_date,
          path_key: 'sales_return_by_date',
          active: false
        },
        {
          path: 'returnbycustomer',
          premium: true,
          disabled: false,
          label: this.$store.state.userStores.lang.sales_return_by_customer,
          path_key: 'sales_return_by_customer',
          active: false
        },
        {
          path: 'cancelleditemsbydate',
          premium: true,
          disabled: false,
          label: this.$store.state.userStores.lang.cancelled_items,
          path_key: 'cancelled_items',
          active: false,
          withPaidSetting: true
        },
        {
          path: 'returneditemsbydate',
          premium: true,
          disabled: false,
          label: this.$store.state.userStores.lang.returned_items,
          path_key: 'returned_items',
          active: false
        },
        {
          path: 'remainingdepositbycustomer',
          premium: false,
          disabled: false,
          label: this.$store.state.userStores.lang.remaining_deposit_customer,
          path_key: 'remaining_deposit',
          active: false
        },
        {
          path: 'freemium',
          premium: false,
          label: 'Freemium',
          path_key: 'freemium',
          active: false,
          hide: true
        },

      ],
      params: {
        from: startDate,
        to: endDate,
        wunpaid: '0',
        type: '',
        brand_ids: '',
        per_page: 50,
        filter_by: '0',
        order_source: '0',
        order_source_online: '0'
      },
      total: 0,
      apiEndPoint: 'salesreports',
      paramsSalesdetailbydatetime: {
        from: startDate,
        to: endDate
      },
      initParamDate:[startDate, endDate],
      loadingDownloadPdf: false,
      loadingDownloadExcel: false,
      showDetail: false
    }
  },

  watch: {
    lang: {
      handler(lang) {
        this.paths.map(item => {
          if (item.path_key !== 'online_sales_detail' &&
            item.path_key !== 'sales_detail_unpaid_pos' &&
            item.path_key !== 'sales_item_unpaid_pos_bydate' &&
            item.path_key !== 'sales_items_by_credits' && 
            item.path_key !== 'sales_items_by_noncredits' &&
            item.path_key !== 'sales_food_delivery' && 
            item.path_key !== 'sales_marketplace' && 
            item.path_key !== 'detail_pos_unpaid_void' && 
            item.path_key !== 'sales_by_tableno' &&
            item.path_key !== 'sales_backdate' &&
            item.path_key !== 'sales_detail_by_grab') {
            if (item.path === 'allin1salesummarybydate') {
              item.path_key = this.$store.state.userStores.langId === 'en' ? 'all_in_1_summary_report' : 'all_in_1_sales_summary_report'
            }
            item.label = lang[item.path_key]
          }
        })
      },
      deep: true,
      immediate: true
    }
  },

  computed: {
    accessByStore () {
      return ['cvsms']
    },
  },

  methods: {
    getData(path, change) {

      this.loading = true
      this.data = []
      this.summary = []

      if (typeof change === 'undefined') {
        this.params.page = ''
        this.current_page = 1
      } else {
        if (!change) {
          this.params.page = ''
          this.current_page = 1
        }
      }

      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      
      const params = { ...this.params }

      if (path === 'salesdetailsbydatetime') {
        params.from = this.paramsSalesdetailbydatetime.from
        params.to = this.paramsSalesdetailbydatetime.to
      }

      if (path === 'salesdetails') {
        params.sort_by = 'order_no'
      }

      // remove wunpaid jika tidak digunakan
      if (!this.activeReport.withPaidSetting && this.activeReport.path !== 'salesitemsbycredits' && this.activeReport.path !== 'salesitemsbynoncredits' && this.activeReport.path !== 'allin1salesummarybydate') {
        delete params.wunpaid
      }

      if (this.activeReport.withFoodDelivery && this.params.order_source === '0') {

        delete params.order_source
      }
      //  else if (!this.activeReport.withFoodDelivery) {

      //   delete params.order_source
      // }
      if (this.activeReport.withMarketplace && this.params.order_source === '0') {
        
        delete params.order_source
      } 

      if (this.activeReport.withOrderSource && this.params.order_source_online !== '0') {
        params.order_source = this.params.order_source_online
      }
      

      if (path === 'salesbydate') {
        path = 'salesbydateNew'
      }
      if (path === 'salesbysalesman') {
        path = 'salesbysalesmanNew'
      }
      if (path === 'comissionbyserver') {
        path = 'comissionbyserverNew'
      }

      let apiEndPoint = apiEndPoint
      if (path === 'productmaterials') { apiEndPoint = 'reportpenjualan'}
      else { apiEndPoint = 'salesreports'}
      // console.log(params);
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + '/' + path),
        params,
        headers
      }).then(response => {
        this.data = response.data.data
        if (response.data.totaldata) {
          this.summary = response.data.totaldata
        } else if (response.data.totals) {
          this.summary.push(response.data.totals)
        }
        if (response.data.meta) {
          this.total = response.data.meta.total
        }
        this.loading = false
      }).catch(error => {
        this.data = []
        this.summary = []
        this.total = 0
        this.loading = false
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
      })
    },

    getFileMobile(path, type) {
      this.setLocalStorageForBackAfterDownload()

      let params = {...this.params}
      if (path === 'salesdetailsbydatetime') {
        params.from = this.paramsSalesdetailbydatetime.from
        params.to = this.paramsSalesdetailbydatetime.to
      }

      const fileName = this.activeReport.label + '-' + params.from + '__' + params.to + '.' + type
      const apiParams = '?from=' + params.from + '&to=' + params.to + '&type=' + type + '&sort=' + 'desc' + '&wunpaid=' + params.wunpaid
      const apiURL = '/download/api/' + this.selectedStore.url_id + '/admin/v1/' + this.langId + '/' + apiEndPoint + '/' + path
      window.location.href = apiURL + apiParams + ',' + fileName
    },

    getPDF(path) {
      if (this.showDetail) {
        this.getPdfDetail('pdf')
      } else {
        if (path === 'salesbysalesman') {
          path = 'salesbysalesmanNew'
        }
        if (path === 'comissionbyserver') {
          path = 'comissionbyserverNew'
        }
        if (this.$store.getters.webviewMode) {
          this.getFileMobile(path, 'pdf')
        } else {
          this.loadingDownloadPdf = true
          let headers = {
            Authorization: 'Bearer ' + this.token.access_token
          }

          let params = {...this.params}
          if (path === 'salesdetailsbydatetime') {
            params.from = this.paramsSalesdetailbydatetime.from
            params.to = this.paramsSalesdetailbydatetime.to
          }
          params.type = 'pdf'

          axios({
            url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + '/' + path),
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
      }
    },

    getExcel(path) {
      if (this.showDetail) {
        this.getPdfDetail('xlsx')
      } else {
        if (path === 'salesbysalesman') {
          path = 'salesbysalesmanNew'
        }
        if (path === 'comissionbyserver') {
          path = 'comissionbyserverNew'
        }
        if (this.$store.getters.webviewMode) {
          this.getFileMobile(path, 'xlsx')
        } else {
          this.loadingDownloadExcel = true
          let headers = {
            Authorization: 'Bearer ' + this.token.access_token
          }

          let params = { ...this.params }
          if (path === 'salesdetailsbydatetime') {
            params.from = this.paramsSalesdetailbydatetime.from
            params.to = this.paramsSalesdetailbydatetime.to
          }
          params.type = 'xlsx'
    
          axios({
            url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + '/' + path),
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
            console.log('error', error)
            this.$notify({
              type: 'warning',
              // title: error.response.data.error.message,
              message: error.message
            })
            this.loadingDownloadExcel = false
          })
        }
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

      let indexPath = '/reports/sales'

      if (this.$store.getters.webviewMode) {
        indexPath = '/reports-mobile/sales'
      }

      this.$router.push({
        path: indexPath,
        query: {
          path
        }
      })

      if (path !== 'freemium') {
        this.getData(path)
      }
    },

    getDataFiltered(date) {
      this.params.from = date.start_date
      this.params.to = date.end_date
      this.initParamDate[0] = date.start_date
      this.initParamDate[1] = date.end_date
      this.getData(this.activeReport.path)
    },

    pickedTime(date) {
      this.paramsSalesdetailbydatetime.from = date.start_date
      this.paramsSalesdetailbydatetime.to = date.end_date
      this.getData(this.activeReport.path)
    },

    pickedBrand(brand) {
      this.params.brand_ids = brand
      this.getData(this.activeReport.path)
    },
    pickedSplit(data){
      console.log(data);
      this.params.split_item_combo = data.split
      this.getData(this.activeReport.path)
    },

    showDetailData(path, data) {
      if (this.$store.getters.webviewMode) {
        this.setLocalStorageForBackAfterDownload()
        const apiURL = '/api/' + this.selectedStore.url_id + '/admin/v1/' + this.langId + '/' + apiEndPoint + '/' + path
        let type = '/return,'
        if (!data.return_no) {
          type = '/order,'
        }
        window.location = type + data.order_no + ',' + data.status + ',' + (data.order_id ? data.order_id : data.id) + ',' + this.selectedStore.url_id
      } else {
        let path = '/sales/openorder/'
        if (!data.return_no) {
          if (data.status === 'X') {
            path = '/sales/cancelorder/'  
          } else if (data.status === 'Z') {
            path = '/sales/completeorder/'
          }
        } else {
          path = '/sales/returnorder/'
        }
        this.$router.push({
          path: path + (data.order_id ? data.order_id : data.id)
        })
      }
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

    handleShowDetail (args) {
      this.showDetail = args
      if (!args) {
        this.$delete(this.params, 'store_customer_deposit_id')
      }
    },

    getPdfDetail (type) {
      this.$refs.tables.getPDF(type)
    }
  },

  mounted() {
    console.log('per', this.$route)
    if (this.$route.query.start_date && this.$route.query.end_date) {
      this.initParamDate[0] = to.query.start_date
      this.initParamDate[1] = to.query.end_date
    }
  },

  beforeRouteEnter (to, from, next) {
    let path = 'allin1salesummarybydate'
    if (to.query.path) {
      path = to.query.path
    }
    
    next(async(vm) => {
      await vm.setDefaultParamsFromLocalStorage(vm, from)
      // console.log(vm.params)
      if (vm.paths) {
        const selectedStore = vm.$store.getters.webviewMode ? vm.$store.getters.webviewSelectedStore : vm.$store.getters.selectedStore
        const isFreemium = await selectedStore.pos_freemium
        if (isFreemium) {
          await vm.paths.map(item => {
            if ((item.path === path) && item.premium)
              path = 'salesdetails'
          })
          if (from.fullPath !== '/') {
            path = 'salesdetails'
          }
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
      // console.log('to', vm)
      // if (vm.$route.query.start_date && vm.$route.query.end_date) {
      //   vm.initParamDate[0] = vm.query.start_date
      //   vm.initParamDate[1] = vm.query.end_date
      // }
      // vm.getData(path)
    })
  }
}
</script>
