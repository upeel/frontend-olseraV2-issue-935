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
            v-if="!activeReport.withoutDate"
            :init-date="initParamDate"
            size="mini"
            @picked="getDataFiltered"
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
          :current-page="params.page"
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

import { salesdetailtaxrole, downloadSalesdetailtaxrole } from '@/api/report/salesreport'

import TableSalesreport from './_table-salesreport'
import ReportList from '../ReportList'
var moment = require('moment')
import MixinReport from '../MixinReport'
const startDate = moment().format('YYYY-MM-DD')
const endDate = moment().format('YYYY-MM-DD')

const apiEndPoint = 'salesreports/taxation/salesdetails'

export default {
  name: 'ReportSalesTaxRole',
  components: {
    dateRangePicker,
    TableSalesreport,
    ReportList
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
          path: 'salesreport',
          label: this.$lang[this.$store.state.userStores.langId].sales_report,
          path_key: 'sales_report',
          active: true
        }
      ],
      params: {
        start_date: '',
        end_date: '',
        per_page: 15
      },
      date: {
        start_date: moment().format('YYYY-MM-DD'),
        end_date: moment().format('YYYY-MM-DD')
      },
      total: 0,
      productstock_SortTypes: [
        'name',
        'category',
        'stock_qty'
      ],
      storeBranches: [],
      dataEmployee: [],
      loadingDownloadPdf: false,
      loadingDownloadExcel: false
    }
  },

  watch: {
    '$store.getters.selectedStore'() {
      this.getData(this.activeReport.path)
    },
    lang: {
      handler(lang) {
        this.paths.map(item => {
          console.log('pat', item.path_key)
          // item.label = this.$lang[this.langId].item.path_key
        })
      },
      deep: true,
      immediate: true
    }
  },

  mounted() {
    // this.searchBranches()
    // this.getSalesReport()
  },

  methods: {
    getData(path, change) {
      this.data = []
      this.summary = []
      this.loading = true

      // if (typeof change === 'undefined') {
      //   this.params.page = ''
      // } else {
      //   if (!change) {
      //     this.params.page = ''
      //   }
      // }

      // if (!this.params.store_id) {
      //   this.params.store_id = this.selectedStore.store_id
      // }

      salesdetailtaxrole(this.params).then(response => {
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
      this.setLocalStorageForBackAfterDownload()
      const fileName = this.activeReport.label + '-' + this.params.start_date + '__' + this.params.end_date + '.' + type
      const apiParams = '?from=' + this.params.start_date + '&to=' + this.params.end_date + '&type=' + type
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
        var apiEnd = ''

        let params = {...this.params}
        params.type = 'pdf'

        downloadSalesdetailtaxrole(params).then((response) => {
          this.loadingDownloadPdf = false
          const fileName = this.activeReport.label + '-' + this.params.start_date + '__' + this.params.end_date + '.pdf'
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click()
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
  
        downloadSalesdetailtaxrole(params).then((response) => {
          const fileName = this.activeReport.label + '-' + this.params.start_date + '__' + this.params.end_date + '.xlsx'
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

      let indexPath = '/reports/salestaxrole'

      if (this.$store.getters.webviewMode) {
        indexPath = '/reports-mobile/salestaxrole'
      }

      // if (path === 'summary') {
      //   this.params.search_text = [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
      // }

      this.params.start_date = moment().format('YYYY-MM-DD')
      this.params.end_date = moment().format('YYYY-MM-DD')

      this.$router.push({
        path: indexPath,
        query: {
          path
        }
      })

      this.getData(path)
    },

    getDataFiltered(value) {
      // this.params.page = 1
      if (value) {
        this.date = value
        this.params.end_date = this.date.end_date
        this.params.start_date = this.date.start_date
        this.getData(this.activeReport.path)
      } else {
        this.getData(this.activeReport.path)
      }
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
    },

    // getSalesReport() {
    //   salesdetailtaxrole({
    //     per_page: 100
    //   }).then(response => {
    //     this.dataEmployee = [ ...response.data.data]
    //   })
    // },

    handleFilterbyEmployee () {
      this.params.page = 1
      this.getData()
    },
  },

  beforeRouteEnter (to, from, next) {
    let path = 'summary'
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
