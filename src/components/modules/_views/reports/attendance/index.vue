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

          <!-- <el-select v-model="params.employee_id" @change="handleFilterbyEmployee" filterable clearable :placeholder="rootLang.select + ' ' + rootLang.employee" size="mini">
            <el-option :label="lang.all + ' ' + rootLang.employee" :value="0"></el-option>
            <el-option v-for="employee in dataEmployee" :key="employee.id" :label="employee.name" :value="employee.id"></el-option>
          </el-select> -->

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
        <div v-if="activeReport.path === 'summary'">
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
        <div v-if="activeReport.path === 'reports_attendance_single'">
   
          <table-summary-single
            :data="data"
            :lang="lang"
            :summary="summary"
            :total="total"
            @showdetaildata="showDetailData"
            @changePage="handleChangePage"
            @changeSizePage="handleChangeSizePage"
          />
        </div>
        

      </div>
    </el-card>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import dateRangePicker from 'components/modules/DateRangePicker'

import { clientEmployeeList as getClientEmployee } from '@/api/attendance'

import TableSummary from './_table-summary'
import TableSummarySingle from './_table-summary-single'

import ReportList from '../ReportList'
var moment = require('moment')
import MixinReport from '../MixinReport'
const startDate = moment().format('YYYY-MM-DD')
const endDate = moment().format('YYYY-MM-DD')

const apiEndPoint = 'attendance/presence'

export default {
  name: 'ReportAttendance',
  components: {
    dateRangePicker,
    TableSummary,
    ReportList,
    TableSummarySingle
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
          path: 'summary',
          label: this.$lang[this.$store.state.userStores.langId].reports_attendance,
          path_key: 'summary',
          active: true
        },
        {
          path: 'reports_attendance_single',
          label: this.$lang[this.$store.state.userStores.langId].reports_attendance_single,
          path_key: 'reports_attendance_single',
          active: false,
        },
      ],
      params: {
        sort_column: ['date','employee_name'],
        sort_type: ['desc','asc'],
        searchQuery: '',
        page: 1,
        search_column: ['date', 'date'],
        search_text: [endDate, endDate],
        search_operator: ['>=', '<='],
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
          item.label = this.$lang[this.langId].item.path_key
        })
      },
      deep: true,
      immediate: true
    }
  },

  mounted() {
    // this.searchBranches()
    this.getClientEmployee()
  },

  methods: {
    getData(path, change) {
      console.log('qweqweqweqw', path);
      if (path === 'summary') {
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

        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + '/'+path),
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
      }else if (path === 'reports_attendance_single') {
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
        // console.log(params);
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'attendancereport/presence/detail'),
          params: this.params,
          headers
        }).then(response => {
          // console.log('qwewqeqweq', response);
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
      }
      
    },

    getFileMobile(path, type) {
      this.setLocalStorageForBackAfterDownload()
      const fileName = this.activeReport.label + '-' + this.params.search_text[0] + '__' + this.params.search_text[1] + '.' + type
      // const apiParams = '?from=' + this.params.search_text[0] + '&to=' + this.params.search_text[1] + '&type=' + type + '&sort=' + 'desc'
      const apiParams = '?sort_column[]=' + this.params.sort_column[0] + '&sort_column[]=' + this.params.sort_column[1] + '&sort_type[]=' + this.params.sort_type[0] + '&sort_type[]=' + this.params.sort_type[1] +
      '&search_column[]=' + this.params.search_column[0] + '&search_column[]=' + this.params.search_column[1] + '&search_text[]=' + this.params.search_text[0] + '&search_text[]=' + this.params.search_text[1] +
      '&search_operator[]=' + this.params.search_operator[0] + '&search_operator[]=' + this.params.search_operator[1] + '&store_id=' + this.params.store_id + '&employee_id=' + this.params.employee_id + '&type=' + type
      const apiURL = '/download/api/' + this.selectedStore.url_id + '/admin/v1/' + this.langId + '/' + apiEndPoint + '/' + path
      window.location.href = apiURL + apiParams + ',' + fileName
    },

    getPDF(path) {
      console.log(path);
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

        console.log(params);
        // 'attendancereport/presence/detail'

        if (path === 'reports_attendance_single') {
          // path = 'detail'
          // params
          axios({
            url: baseApi(this.selectedStore.url_id, this.langId, 'attendancereport/presence/detail'),
            method: 'GET',
            responseType: 'blob',
            headers,
            params
          }).then((response) => {
            this.loadingDownloadPdf = false
            const fileName = this.activeReport.label + '-' + this.params.search_text[0] + '__' + this.params.search_text[1] + '.pdf'
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
        } else {
           axios({
            url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + '/' + path),
            method: 'GET',
            responseType: 'blob',
            headers,
            params
          }).then((response) => {
            this.loadingDownloadPdf = false
            const fileName = this.activeReport.label + '-' + this.params.search_text[0] + '__' + this.params.search_text[1] + '.pdf'
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
  
        axios({
          url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + '/' + path),
          method: 'GET',
          responseType: 'blob',
          headers,
          params
        }).then((response) => {
          const fileName = this.activeReport.label + '-' + this.params.search_text[0] + '__' + this.params.search_text[1] + '.xlsx'
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

      let indexPath = '/reports/attendance'

      if (this.$store.getters.webviewMode) {
        indexPath = '/reports-mobile/attendance'
      }

      if (path === 'summary') {
        this.params.search_text = [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
      }

      this.$router.push({
        path: indexPath,
        query: {
          path
        }
      })

      this.getData(path)
    },

    getDataFiltered(value) {
      this.params.page = 1
      if (value) {
        this.date = value
        this.params.search_text = [this.date.start_date, this.date.end_date]
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

    getClientEmployee() {
      getClientEmployee({
        per_page: 100
      }).then(response => {
        this.dataEmployee = [ ...response.data.data]
      })
    },

    handleFilterbyEmployee (value) {
      console.log('vbnvbnvbnvb',value);
      this.params.page = 1
      this.params.employee_id = value
      console.log('czxczxczxczxczxc', this.activeReport.path);
      this.getData( this.activeReport.path)
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
