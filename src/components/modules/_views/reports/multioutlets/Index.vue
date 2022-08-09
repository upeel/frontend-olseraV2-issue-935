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
          <date-range-picker
            v-if="!activeReport.withsingeldatepicker"
            :init-date="initParamDate"
            @picked="getDataFiltered"
            size="mini"
            :style="activeReport.withoutDate ? 'display: none' : 'display: inline-block'"
          />

          <single-date-picker
            v-else
            :init-date="params.date"
            size="mini"
            @picked="getDataFiltered"
          />

          <el-select
            v-if="activeReport.productstock_SortTypes"
            v-model="params.sort_by"
            popper-class="dropdown-select-shift-report"
            :placeholder="lang.sorting"
            size="mini"
            @change="handleSortByChange">
            <el-option
              v-for="(item, key) in productstock_SortTypes"
              :key="key"
              :value="item"
              :label="'Sort By: ' + lang[item]"
            />
          </el-select>

          <el-select
            v-if="activeReport.withStoreBranches"
            v-model="params.store_id"
            popper-class="dropdown-select-shift-report"
            :placeholder="lang.switch_stores"
            size="mini"
            @change="handleSortByChange">
            <el-option
              v-for="(item) in storeBranches"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            />
            <el-button
              v-if="storeBranches.length < meta.total"
              :loading="loadingLoadMoreStores"
              type="info"
              class="btn-block"
              @click="loadMoreStores">
              Load more
            </el-button>
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
          :is="loadedComponent"
          :data="data"
          :summary="summary"
          :lang="lang"
          :lang-id="langId"
          :total="total"
          :token="token"
          :store="selectedStore"
          :params="params"
          @changePage="handleChangePage"
          @changeSizePage="handleChangeSizePage"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import dateRangePicker from 'components/modules/DateRangePicker'
import SingleDatePicker from 'components/modules/SingleDatePicker'

import TableSalessummary from './_table-salessummary'
import TableProductstock from './_table-productstock'
import TableSalesitemsbydate from './_table-salesitemsbydate'
import TableSalesdetails from './_table-salesdetails.vue'
import ReportList from '../ReportList'
var moment = require('moment')
import MixinReport from '../MixinReport'
// const startDate = moment().add(-29, 'days').format('YYYY-MM-DD')
const startDate = moment().format('YYYY-MM-DD')
const endDate = moment().format('YYYY-MM-DD')

const apiEndPoint = 'multioutletreports'

export default {
  components: {
    dateRangePicker,
    SingleDatePicker,
    TableSalessummary,
    TableProductstock,
    TableSalesitemsbydate,
    ReportList,
    TableSalesdetails
  },

  mixins: [MixinReport],

  data() {
    return {
      loading: false,
      data: [],
      summary: [],
      showlist: true,
      selectedReportBySearch: 'salessummary',
      paths: [
        {
          path: 'salessummary',
          label: this.$store.state.userStores.lang.sales_summary,
          path_key: 'sales_summary',
          active: true
        },
        {
          path: 'productstock',
          label: this.$store.state.userStores.lang.product_stock_balance,
          path_key: 'product_stock_balance',
          active: true,
          productstock_SortTypes: true,
          withoutDate: true,
          withStoreBranches: true
        },
        {
          path: 'salesitemsbydate',
          label: this.$lang[this.$store.state.userStores.langId].sales_item_by_date,
          path_key: 'sales_item_by_date',
          active: true,
          withPaidSetting: true,
          withsingeldatepicker: true
        },
        {
          path: 'salesdetails',
          label: this.$store.state.userStores.lang.sales_details,
          path_key: 'sales_details',
          active: true,
          withsingeldatepicker: true
        }
      ],
      params: {
        from: startDate,
        to: endDate,
        type: '',
        sort_by: 'name',
        store_id: '',
        per_page: 50,
        wunpaid: '0'
      },
      total: 0,
      productstock_SortTypes: [
        'name',
        'category',
        'stock_qty'
      ],
      storeBranches: [],
      loadingDownloadPdf: false,
      loadingDownloadExcel: false,
      loadingLoadMoreStores: false,
      meta: {
        total: 0
      }
    }
  },

  watch: {
    // '$store.getters.selectedStore'() {
    //   this.getData(this.activeReport.path)
    // },
    lang: {
      handler(lang) {
        this.paths.map(item => {
          if (item.path_key !== 'sales_item_by_date') {
              item.label = lang[item.path_key]
            }
        })
      },
      deep: true,
      immediate: true
    }
  },

  mounted() {
    this.searchBranches()
  },

  methods: {
    getData(path, change) {
      this.data = []
      this.summary = []
      this.loading = true
      var apiEnd = ''

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

      if (!this.params.store_id) {
        this.params.store_id = this.selectedStore.store_id
      }

      if (path === 'productstock') {
        apiEnd = 'reportpenjualan'
      } else {
        apiEnd = apiEndPoint
      }

      if (path === 'salesitemsbydate') {
        // this.$delete(this.params, 'store_id')
        this.params.store_id = ''
        if (!this.params.wunpaid) {
          this.params.wunpaid = '0'
        }
      }

      if (path !== 'salesitemsbydate') {
        this.$delete(this.params, 'wunpaid')
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEnd + '/' + path),
        params: this.params,
        headers
      }).then(response => {
        this.data = response.data.data
        if (response.data.totaldata) {
          this.summary = response.data.totaldata
        }
        if (response.data.meta) {
          this.total = response.data.meta.total
        }
        this.loading = false
      }).catch((error) => {
        this.loading = false
        if (error.response.status !== 404) {
          this.$notify({
            type: 'error',
            title: 'Error' + error.response.status,
            message: error.response.statusText
          })
          this.loading = false
        }
        this.data = []
        this.total = 0
        this.loading = false
      })
    },

    getFileMobile(path, type) {
      var apiEnd = ''
      if (path === 'productstock') {
        apiEnd = 'reportpenjualan'
      } else {
        apiEnd = apiEndPoint
      }
      this.setLocalStorageForBackAfterDownload()
      const fileName = this.activeReport.label + '-' + this.params.from + '__' + this.params.to + '.' + type
      const apiParams = '?from=' + this.params.from + '&to=' + this.params.to + '&type=' + type + '&sort=' + this.params.sort + '&sort_by=' + this.params.sort_by
      const apiURL = '/download/api/' + this.selectedStore.url_id + '/admin/v1/' + this.langId + '/' + apiEnd + '/' + path
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
        var apiEnd = ''

        let params = {...this.params}
        params.type = 'pdf'

        if (path === 'productstock') {
          apiEnd = 'reportpenjualan'
        } else {
          apiEnd = apiEndPoint
        }

        axios({
          url: baseApi(this.selectedStore.url_id, this.langId, apiEnd + '/' + path),
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
      if (this.$store.getters.webviewMode) {
        this.getFileMobile(path, 'xlsx')
      } else {
        this.loadingDownloadExcel = true
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }
        var apiEnd = ''
  
        let params = { ...this.params }
        params.type = 'xlsx'

        if (path === 'productstock') {
          apiEnd = 'reportpenjualan'
        } else {
          apiEnd = apiEndPoint
        }
  
        axios({
          url: baseApi(this.selectedStore.url_id, this.langId, apiEnd + '/' + path),
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

      let indexPath = '/reports/multioutlets'

      if (this.$store.getters.webviewMode) {
        indexPath = '/reports-mobile/multioutlets'
      }

      if (path === 'salessummary') {
        this.params.from = moment().format('YYYY-MM-DD')
        this.params.to = moment().format('YYYY-MM-DD')
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
      console.log('log', date)
      if (typeof date === 'object') {
        this.params.from = date.start_date
        this.params.to = date.end_date
      } else {
        this.params.from = date
        this.params.to = date
      }
      
      this.getData(this.activeReport.path)
    },

    handleSortByChange() {
      this.getData(this.activeReport.path)
    },

    searchBranches() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let query = {
        // search_column: 'role_id',
        // search_text: 'OW'
        per_page: 15
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'storebranches'),
        params: query,
        headers: headers
      }).then(response => {
        this.storeBranches = response.data.data
        this.storeBranches.push({
          id: this.selectedStore.store_id,
          name: this.selectedStore.name
        })
        this.meta.total = response.data.meta.total
        this.meta.currentPage = response.data.meta.current_page
        this.loading = false
      }).catch(errror => {
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    loadMoreStores() {
      this.loadingLoadMoreStores = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let query = {
        // search_column: 'role_id',
        // search_text: 'OW'
        per_page: 15,
        page: this.meta.currentPage + 1
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'storebranches'),
        params: query,
        headers: headers
      }).then(response => {
        response.data.data.map(i => {
          this.storeBranches.push(i)
        })
        this.meta.total = response.data.meta.total
        this.meta.currentPage = response.data.meta.current_page
        this.loadingLoadMoreStores = false
      }).catch(errror => {
        this.loadingLoadMoreStores = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    handleChangePage(page) {
      this.params.page = page
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
    let path = 'salessummary'
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
      // vm.getData(path)
    })
  }
}
</script>
