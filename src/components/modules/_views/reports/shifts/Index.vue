<template>
  <div class="report-page">
    <report-list
      :showlist="showlist"
      :selected-report-by-search.sync="selectedReportBySearch"
      :paths="paths"
      @show-report="showReport"
    />

    <el-card class="box-card">
      <div slot="header" class="table-handler-flex">
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
          <single-date-picker
            :init-date="params.date"
            size="mini"
            style="width: 220px;"
            @picked="getDataFiltered"
          />

          <el-select
            v-if="activeReport.path !== 'salescashbalancebyshift'"
            v-model="params.shiftid"
            size="mini"
            popper-class="dropdown-select-shift-report"
            class="pb-10"
            @change="getData(activeReport.path)">
            <el-option
              v-for="(item, key) in shifts"
              :key="key"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>

          <el-select
            v-if="activeReport.withPaidSetting"
            v-model="params.wunpaid"
            popper-class="dropdown-select-shift-report"
            size="mini"
            style="width: 120px;"
            @change="getData(activeReport.path)">
            <el-option value="1" :label="'+' + lang.unpaid" />
            <el-option value="0" :label="lang.paid" />
          </el-select>

          <el-select
            v-if="activeReport.productsalesbydateshift_SortTypes"
            v-model="params.sort_by"
            popper-class="dropdown-select-shift-report"
            size="mini"
            @change="handleSortByChange">
            <el-option
              v-for="(item, key) in productsalesbydateshift_SortTypes"
              :key="key"
              :value="item"
              :label="'Sort By: ' + $lang[langId][item]"
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

      <div v-loading="loading" class="card-body">
        <component
          @picked-time="pickedTime"
          @picked-brand="pickedBrand"
          @showdetaildata="showDetailData"
          @changePage="handleChangePage"
          @changeSizePage="handleChangeSizePage"
          :is="loadedComponent"
          :data="data"
          :summary="summary"
          :lang="lang"
          :lang-id="langId"
          :total="total"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import SingleDatePicker from 'components/modules/SingleDatePicker'

import TableAllin1salessummarybyshift from './_table-allin1salessummarybyshift'
import TableSalesdetailsbyshift from './_table-salesdetailsbyshift'
import TableSalesbyshift from './_table-salesbyshift'
import TableSalesitemaddonsbydateshift from './_table-salesitemaddonsbydateshift'
import TableSalesitemsbydateshift from './_table-salesitemsbydateshift'
import TableProductsalesbydateshift from './_table-productsalesbydateshift'
import TableDiscountsummarybyshift from './_table-discountsummarybyshift'
import TableCreditpaymentbyshift from './_table-creditpaymentbyshift'
import TableSalescashbalancebyshift from './_table-salescashbalancebyshift'
import TableCategorysalesbydateshift from './_table-categorysalesbydateshift.vue'
import TableProductsalesskubydateshift from './_table-productsalesskubydateshift.vue'
import ReportList from '../ReportList'
import MixinReport from '../MixinReport'
var moment = require('moment')
// const startDate = moment().add(-29, 'days').format('YYYY-MM-DD')
const startDate = moment().format('YYYY-MM-DD')

const apiEndPoint = 'salesreports'

export default {
  name: 'ReportShift',
  components: {
    SingleDatePicker,
    TableAllin1salessummarybyshift,
    TableSalesdetailsbyshift,
    TableSalesbyshift,
    TableSalesitemaddonsbydateshift,
    TableSalesitemsbydateshift,
    TableProductsalesbydateshift,
    TableDiscountsummarybyshift,
    TableCreditpaymentbyshift,
    TableSalescashbalancebyshift,
    TableCategorysalesbydateshift,
    TableProductsalesskubydateshift,
    ReportList
  },

  mixins: [MixinReport],

  data() {
    return {
      loading: false,
      data: [],
      summary: [],
      shifts: [],
      total: 0,
      selectedReportBySearch: '',
      showlist: true,
      paths: [
        {
          path: 'allin1salessummarybyshift',
          label: this.$store.state.userStores.lang.all_in_1_sales_summary_report,
          path_key: '',
          withPaidSetting: true,
          active: true
        },
        {
          path: 'salesdetailsbyshift',
          label: this.$store.state.userStores.lang.sales_details,
          path_key: 'sales_details',
          active: false
        },
        {
          path: 'salesbyshift',
          label: this.$store.state.userStores.lang.sales_by_date,
          path_key: 'sales_by_date',
          active: false
        },
        {
          path: 'salesitemsbydateshift',
          label: this.$store.state.userStores.lang.sales_items_by_date,
          path_key: 'sales_items_by_date',
          active: false
        },
        {
          path: 'productsalesbydateshift',
          label: this.$store.state.userStores.lang.product_sales_by_date,
          path_key: 'product_sales_by_date',
          active: false,
          productsalesbydateshift_SortTypes: true
        },
        {
          path: 'categorysalesbydateshift',
          label: this.$lang[this.$store.state.userStores.langId].category_sales_by_date_shift,
          path_key: 'category_sales_by_date_shift',
          active: false
        },
        {
          path: 'productsalesskubydateshift',
          label: this.$lang[this.$store.state.userStores.langId].product_sales_sku_by_date_shift,
          path_key: 'product_sales_sku_by_date_shift',
          active: false
        },
        {
          path: 'salesitemaddonsbydateshift',
          label: this.$store.state.userStores.lang.sales_item_addons_by_date,
          path_key: 'sales_item_addons_by_date',
          active: false
        },
        {
          path: 'creditpaymentbyshift',
          label: this.$store.state.userStores.lang.credit_payments,
          path_key: 'credit_payments',
          active: false
        },
        {
          path: 'discountsummarybyshift',
          label: this.$store.state.userStores.lang.discount_summary,
          path_key: 'discount_summary',
          active: false
        },
        {
          path: 'salescashbalancebyshift',
          label: this.$store.state.userStores.lang.sales_cash_balance,
          path_key: 'sales_cash_balance',
          active: false
        },
      ],
      params: {
        date: startDate,
        wunpaid: '0',
        type: '',
        brand_ids: '',
        shiftid: '',
        sort_by: '',
        per_page: 50
      },
      productsalesbydateshift_SortTypes: [
        'group',
        'name',
        'sku',
        'stock_qty',
        'total_amount',
        'total_profit'
      ],
      apiEndPoint: 'salesreports',
      loadingDownloadPdf: false,
      loadingDownloadExcel: false
    }
  },

  watch: {
    lang: {
      handler(lang) {
        this.paths.map(item => {
          if (item.path_key !== 'category_sales_by_date_shift' &&
            item.path_key !== 'product_sales_sku_by_date_shift') {
            if (item.path === 'allin1salessummarybyshift') {
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

  methods: {
    getData(path, change) {
      this.loading = true
      this.data = []
      this.summary = []
      this.shifts = []

      if (typeof change === 'undefined') {
        this.params.page = ''
      } else {
        if (!change) {
          this.params.page = ''
        }
      }

      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = this.params
      if (params.from && params.to) {
        delete params.from
        delete params.to
      }
      if (path === 'productsalesbydateshift') {
        if (params.sort_by === 'profit') {
          params.sort_by = 'total_profit'
          params.sort = 'desc'
        }
        if (params.sort_by === 'sales_amount') {
          params.sort_by = 'total_amount'
          params.sort = 'desc'
        }
        if (params.sort_by === 'stock_qty') {
          params.sort_by = 'qty'
          params.sort = 'asc'
        }
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, this.apiEndPoint + '/' + path),
        params: this.params,
        headers
      }).then(response => {
        this.data = response.data.data
        if (response.data.totaldata) {
          this.summary = response.data.totaldata
        }
        if (path === 'allin1salessummarybyshift') {
          if (response.data.data.shifttimes) {
            this.shifts = response.data.data.shifttimes
          }
        } else {
          if (response.data.shifttimes) {
            this.shifts = response.data.shifttimes
          }
        }
        if (response.data.meta) {
          this.total = response.data.meta.total
        }
        if (path === 'productsalesbydateshift') {
          if (params.sort_by === 'qty') {
            params.sort_by = 'stock_qty'
          }
        }
        this.loading = false
      }).catch((error) => {
        this.data = []
        this.shifts = error.response.data.shifttimes
        this.total = 0
        this.summary = {}
        this.params.shiftid = ''
        // TODO handle store ids data
        this.loading = false
      })
    },

    getFileMobile(path, type) {
      this.setLocalStorageForBackAfterDownload()
      const fileName = this.activeReport.label + '-' + this.params.date + '.' + type
      const apiParams = '?date=' + this.params.date + '&type=' + type + '&sort_by=' + this.params.sort_by
      const apiURL = '/download/api/' + this.selectedStore.url_id + '/admin/v1/' + this.langId + '/' + apiEndPoint + '/' + path
      window.location.href = apiURL + apiParams + ',' + fileName
    },

    getPDF(path) {
      if (this.$store.getters.webviewMode) {
        this.getFileMobile(path, 'pdf')
      } else {
        this.loadingDownloadPdf = true
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }

        let params = {...this.params}
        params.type = 'pdf'

        axios({
          url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + '/' + path),
          method: 'GET',
          responseType: 'blob',
          headers,
          params
        }).then((response) => {
          const fileName = this.activeReport.label + '-' + this.params.date + '.pdf'
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
      if (this.$store.getters.webviewMode) {
        this.getFileMobile(path, 'xlsx')
      } else {
        this.loadingDownloadExcel = true
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }
  
        let params = { ...this.params }
        params.type = 'xlsx'
  
        axios({
          url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + '/' + path),
          method: 'GET',
          responseType: 'blob',
          headers,
          params
        }).then((response) => {
          const fileName = this.activeReport.label + '-' + this.params.date + '.xlsx'
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

      let indexPath = '/reports/shifts'

      if (this.$store.getters.webviewMode) {
        indexPath = '/reports-mobile/shifts'
      }

      this.$router.push({
        path: indexPath,
        query: {
          path
        }
      })

      this.getData(path)
    },

    getDataFiltered(date) {
      this.params.date = date
      this.getData(this.activeReport.path)
    },

    pickedTime(date) {
      this.getDataFiltered(date)
    },

    pickedBrand(brand) {
      this.params.brand_ids = brand
      this.getData(this.activeReport.path)
    },

    handleSortByChange() {
      this.getData(this.activeReport.path)
    },

    showDetailData(path, data) {
      if (this.$store.getters.webviewMode) {
        this.setLocalStorageForBackAfterDownload()
        let type = '/return,'
        if (!data.return_no) {
          type = '/order,'
        }
        window.location = type + data.order_no + ',' + data.status + ',' + data.id + ',' + this.selectedStore.url_id
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
          path: path + data.id
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
      var change = true
      this.getData(this.activeReport.path, change)
    }
  },

  beforeRouteEnter (to, from, next) {
    let path = 'allin1salessummarybyshift'
    if (to.query.path) {
      path = to.query.path
    }
    next(async(vm) => {
      await vm.setDefaultParamsFromLocalStorage(vm, from)
      if (vm.paths) {
        vm.paths = vm.paths.map(item => {
          if (item.path === path) {
            item.active = true
            // vm.selectedReportBySearch = item.path
          } else {
            item.active = false
          }
          return item
        })
      }
      vm.getData(path)
    })
  }
}
</script>
