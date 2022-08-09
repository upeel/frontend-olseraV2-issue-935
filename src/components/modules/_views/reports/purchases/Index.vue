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
          style="flex-grow: 1;"
          @click="toggleReportList">
          <span class="trigger-open-report-list">
            <svg-icon icon-class="arrow-left" />
          </span>
          {{ activeReport.label }}
        </h4>

        <div>
          <date-range-picker
            :disabled="showDate"
            :init-date="initParamDate"
            @picked="getDataFiltered"
            size="mini"
          />

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
        <template v-if="activeReport.path === 'purchasedetails'">
          <table-detail
            :data="data"
            :lang="lang"
            :summary="summary"
            :total="total"
            @showdetaildata="showDetailData"
            @changePage="handleChangePage"
            @changeSizePage="handleChangeSizePage"
          />
        </template>

        <template v-if="activeReport.path === 'purchasebydate'">
          <table-bydate
            :data="data"
            :lang="lang"
            :total="total"
            :summary="summary"
            @changePage="handleChangePage"
            @changeSizePage="handleChangeSizePage"
          />
        </template>

        <template v-if="activeReport.path === 'purchaseitemsbydate'">
          <table-items-bydate
            :data="data"
            :lang="lang"
            :summary="summary"
            :total="total"
            @showdetaildata="showDetailData"
            @changePage="handleChangePage"
            @changeSizePage="handleChangeSizePage"
          />
        </template>

        <template v-if="activeReport.path === 'purchasebysupplier'">
          <table-bysupplier :data="data" :lang="lang" :summary="summary" :total="total" @changePage="handleChangePage" @changeSizePage="handleChangeSizePage" />
        </template>

        <template v-if="activeReport.path === 'purchasebypurchaser'">
          <table-bypurchaser :data="data" :lang="lang" :summary="summary" :total="total" @changePage="handleChangePage" @changeSizePage="handleChangeSizePage" />
        </template>

        <template v-if="activeReport.path === 'unpaiddetails'">
          <table-outstanding-payment
            :data="data"
            :lang-id="langId"
            :lang="lang"
            :total="total"
            @showdetaildata="showDetailData"
            @changePage="handleChangePage"
            @changeSizePage="handleChangeSizePage"
          />
        </template>
      </div>
    </el-card>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import dateRangePicker from 'components/modules/DateRangePicker'

import TableDetail from './_table-detail'
import TableBydate from './_table-bydate'
import TableItemsBydate from './_table-items-bydate'
import TableBysupplier from './_table-bysupplier'
import TableBypurchaser from './_table-bypurchaser'
import TableOutstandingPayment from './_table-outstanding-payment'

import ReportList from '../ReportList'
import MixinReport from '../MixinReport'
var moment = require('moment')
// const startDate = moment().add(-29, 'days').format('YYYY-MM-DD')
const startDate = moment().format('YYYY-MM-DD')
const endDate = moment().format('YYYY-MM-DD')

const apiEndPoint = 'purchasereports'

export default {
  components: {
    dateRangePicker,
    TableDetail,
    TableBydate,
    TableItemsBydate,
    TableBysupplier,
    TableBypurchaser,
    TableOutstandingPayment,
    ReportList
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
          path: 'purchasedetails',
          label: this.$store.state.userStores.lang.purchase_details,
          path_key: 'purchase_details',
          active: true
        },
        {
          path: 'purchasebydate',
          label: this.$store.state.userStores.lang.purchase_by_date,
          path_key: 'purchase_by_date',
          active: false
        },
        {
          path: 'purchaseitemsbydate',
          label: this.$store.state.userStores.lang.purchase_items_by_date,
          path_key: 'purchase_items_by_date',
          active: false
        },
        {
          path: 'purchasebysupplier',
          label: this.$store.state.userStores.lang.purchase_by_supplier,
          path_key: 'purchase_by_supplier',
          active: false
        },
        {
          path: 'purchasebypurchaser',
          label: this.$store.state.userStores.lang.purchase_by_purchaser,
          path_key: 'purchase_by_purchaser',
          active: false
        },
        {
          path: 'unpaiddetails',
          label: this.$store.state.userStores.lang.outstanding_payment,
          path_key: 'outstanding_payment',
          active: false,
          withoutDateFilter: true
        }
      ],
      params: {
        from: startDate,
        to: endDate,
        type: '',
        per_page: 50
      },
      total: 0,
      apiEndPoint: 'purchasereports',
      loadingDownloadPdf: false,
      loadingDownloadExcel: false
    }
  },

  watch: {
    lang: {
      handler(lang) {
        this.paths.map(item => {
          item.label = lang[item.path_key]
        })
      },
      deep: true,
      immediate: true
    }
  },

  computed: {
    showDate () {
      if (this.activeReport.path === 'unpaiddetails') {
        return true
      } else {
        return false
      }
    }
  },

  methods: {
    getData(path, change) {
      this.data = []

      this.loading = true

      if (typeof change === 'undefined') {
        this.params.page = ''
      } else {
        if (!change) {
          this.params.page = ''
        }
      }

      if (path === 'unpaiddetails') {
        this.$delete(this.params, 'from')
        this.$delete(this.params, 'to')
      } else {
        if (!this.params.from && !this.params.to)
        this.params.from = this.initParamDate[0]
        this.params.to = this.initParamDate[1]
      }

      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + '/' + path),
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
      let fileName = ''
      let apiParams = ''
      if (this.activeReport.path === 'unpaiddetails') {
        fileName = this.activeReport.label + '.' + type
        apiParams = '?type=' + type + '&sort=' + this.params.sort + '&sort_by=' + this.params.sort_by
      } else {
        fileName = this.activeReport.label + '-' + this.params.from + '__' + this.params.to + '.' + type
        apiParams = '?from=' + this.params.from + '&to=' + this.params.to + '&type=' + type + '&sort=' + this.params.sort + '&sort_by=' + this.params.sort_by
      }
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
  
        let params = { ...this.params }
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

      let indexPath = '/reports/purchases'

      if (this.$store.getters.webviewMode) {
        indexPath = '/reports-mobile/purchases'
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
      this.params.from = date.start_date
      this.params.to = date.end_date
      this.initParamDate[0] = date.start_date
      this.initParamDate[1] = date.end_date
      this.getData(this.activeReport.path)
    },

    showDetailData(path, data) {
      if (this.$store.getters.webviewMode) {
        this.setLocalStorageForBackAfterDownload()
        const apiURL = '/api/' + this.selectedStore.url_id + '/admin/v1/' + this.langId + '/' + apiEndPoint + '/' + path
        let type = '/purchase,'
        window.location = type + data.purchase_no + ',' + data.status + ',' + data.id + ',' + this.selectedStore.url_id
      } else {
        let path = '/purchase/openpurchase/'
        if (data.status === 'X') {
          path = '/purchase/cancelpurchase/'  
        } else if (data.status === 'Z') {
          path = '/purchase/completepurchase/'
        }
        this.$router.push({
          path: path + data.id
        })
      }
      // const apiURL = '/api/' + this.selectedStore.url_id + '/admin/v1/' + this.langId + '/' + apiEndPoint + '/' + path
      // let type = '/purchase,'
      // window.location = type + data.purchase_no + ',' + data.status + ',' + data.id
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
    let path = 'purchasedetails'
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
