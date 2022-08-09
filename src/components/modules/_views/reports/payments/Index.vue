<template>
  <div class="report-page">
    <report-list
      :showlist="showlist"
      :selected-report-by-search.sync="selectedReportBySearch"
      :paths="paths"
      :menu="'payments'"
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
            :init-date="initParamDate"
            @picked="getDataFiltered"
            size="mini"
            :style="activeReport.withoutDate ? 'display: none' : 'display: inline-block'"
          />

          <el-select
            v-if="activeReport.withPaidSetting"
            v-model="params.wunpaid"
            popper-class="dropdown-select-shift-report"
            @change="getData(activeReport.path)"
            size="mini">
            <el-option :value="1" :label="'+' + lang.unpaid" />
            <el-option :value="0" :label="lang.paid" />
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
          v-if="activeReport.path !== 'freemium'"
          :is="loadedComponent"
          :data="data"
          :summary="summary"
          :lang="lang"
          :lang-id="langId"
          :total="total"
          @changePage="handleChangePage"
          @changeSizePage="handleChangeSizePage"
          @show="showDetailData"
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
import TablePaymentbymode from './_table-paymentbymode'
import TableOutstandingpayment from './_table-outstandingpayment'
import TablePaymentdetail from './_table-paymentdetail'
import TableSalesbycustomerpayment from './_table-salesbycustomerpayment'
import TablePaymentduedate from './_table-paymentduedate.vue'
import ReportList from '../ReportList'
import MixinReport from '../MixinReport'

import Freemium from '@/components/FreemiumBanner'

var moment = require('moment')
// const startDate = moment().add(-29, 'days').format('YYYY-MM-DD')
const startDate = moment().format('YYYY-MM-DD')
const endDate = moment().format('YYYY-MM-DD')

const apiEndPoint = 'paymentreports'

export default {
  components: {
    dateRangePicker,
    TablePaymentbymode,
    TableOutstandingpayment,
    TableSalesbycustomerpayment,
    TablePaymentdetail,
    ReportList,
    TablePaymentdetail,
    TablePaymentduedate,
    Freemium
  },

  mixins: [MixinReport],

  data() {
    return {
      loading: false,
      data: [],
      summary: [],
      showlist: true,
      selectedReportBySearch: '',
      paths: [
        {
          path: 'paymentbymode',
          premium: false,
          label: this.$store.state.userStores.lang.payment_by_method,
          path_key: 'payment_by_method',
          active: true,
          withPaidSetting: true
        },
        {
          path: 'paymentdetail',
          premium: true,
          label: 'Pembayaran yang sudah lunas',
          path_key: 'payment_detail',
          active: true,
          // withPaidSetting: true
        },
        {
          path: 'outstandingpayment',
          premium: true,
          label: this.$store.state.userStores.lang.outstanding_payment,
          path_key: 'outstanding_payment',
          active: false,
          withoutDate: true
        },
        {
          path: 'salesbycustomerpayment',
          premium: true,
          label: this.$lang[this.$store.state.userStores.langId].sales_by_customer_payment,
          path_key: 'sales_by_customer_payment',
          active: true,
          withPaidSetting: false
        },
        {
          path: 'paymentduedate',
          premium: true,
          label: this.$lang[this.$store.state.userStores.langId].payment_due_date,
          path_key: 'payment_due_date',
          active: true,
          withPaidSetting: false
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
        type: '',
        wunpaid: 1,
        per_page: 50
      },
      total: 0,
      totalunpaid: [],
      apiEndPoint: 'paymentreports',
      loadingDownloadPdf: false,
      loadingDownloadExcel: false
    }
  },

  watch: {
    lang: {
      handler(lang) {
        this.paths.map(item => {
          if (item.path !== 'salesbycustomerpayment' && item.path !== 'paymentdetail' && item.path !== 'paymentduedate')
          item.label = lang[item.path_key]
        })
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    getData(path, change) {
      this.data = []
      this.summary = []
      this.loading = true
      var endpoint = apiEndPoint

      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      if (typeof change === 'undefined') {
        this.params.page = ''
      } else {
        if (!change) {
          this.params.page = ''
        }
      }

      if (path === 'outstandingpayment') {
        endpoint = 'salesreports'
        path = 'unpaiddetails'
      }

      if (path === 'paymentbymode') {
        path = 'paymentbymodeNew'
      }

      if (path === 'paymentdetail') {
        path = 'paymentdetail'
      }

      // if(this.activeReport.path === 'outstandingpayment') {
      //   this.params.from = ''
      //   this.params.to = ''
      // }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, endpoint + '/' + path),
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
        if (path === 'unpaiddetails') {
          this.data.map(i => {
            i.totaldata = [{
              ftotal_amount: i.ftotal_amount,
              fprepayment_amount: i.fprepayment_amount,
              foutstanding_amount: i.foutstanding_amount,
              total_amount: i.total_amount,
              prepayment_amount: i.prepayment_amount,
              outstanding_payment: i.outstanding_payment,
              customer_name: i.customer_name
            }]
          })
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
      if (path === 'paymentbymode') {
        path = 'paymentbymodeNew'
      }
      var endpoint = apiEndPoint

      if (path === 'outstandingpayment') {
        endpoint = 'salesreports'
        path = 'unpaiddetails'
      }
      const fileName = this.activeReport.label + '-' + this.params.from + '__' + this.params.to + '.' + type
      const apiParams = '?from=' + this.params.from + '&to=' + this.params.to + '&type=' + type + '&sort=' + this.params.sort + '&sort_by=' + this.params.sort_by
      const apiURL = '/download/api/' + this.selectedStore.url_id + '/admin/v1/' + this.langId + '/' + endpoint + '/' + path
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
        var endpoint = apiEndPoint

        if (path === 'outstandingpayment') {
          endpoint = 'salesreports'
          path = 'unpaiddetails'
        }

        if (path === 'paymentbymode') {
          path = 'paymentbymodeNew'
        }

        axios({
          url: baseApi(this.selectedStore.url_id, this.langId, endpoint + '/' + path),
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
        var endpoint = apiEndPoint

        if (path === 'outstandingpayment') {
          endpoint = 'salesreports'
          path = 'unpaiddetails'
        }

        if (path === 'paymentbymode') {
          path = 'paymentbymodeNew'
        }
  
        axios({
          url: baseApi(this.selectedStore.url_id, this.langId, endpoint + '/' + path),
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

      let indexPath = '/reports/payments'

      if (this.$store.getters.webviewMode) {
        indexPath = '/reports-mobile/payments'
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
      var change = true
      this.getData(this.activeReport.path, change)
    },

    showDetailData(path, data) {
    console.log('aa')
    if (this.$store.getters.webviewMode) {
      this.setLocalStorageForBackAfterDownload()
      const apiURL = '/api/' + this.selectedStore.url_id + '/admin/v1/' + this.langId + '/' + apiEndPoint + '/' + path
      let type = '/return,'
      if (!data.return_no) {
        type = '/order,'
      }
      window.location = type + data.order_no + ',' + data.status + ',' + (data.order_id ? data.order_id : data.id) + ',' + this.selectedStore.url_id
    } else {
      // let path = '/sales/openorder/'
      // if (!data.return_no) {
      //   if (data.status === 'X') {
      //     path = '/sales/cancelorder/'  
      //   } else if (data.status === 'Z') {
      //     path = '/sales/completeorder/'
      //   }
      // } else {
      //   path = '/sales/returnorder/'
      // }
      // this.$router.push({
      //   path: path + (data.order_id ? data.order_id : data.id)
      // })
    }
  },
  },

  beforeRouteEnter (to, from, next) {
    let path = 'paymentbymode'
    if (to.query.path) {
      path = to.query.path
    }
    next(async(vm) => {
      await vm.setDefaultParamsFromLocalStorage(vm, from)
      if (vm.paths) {
        const selectedStore = vm.$store.getters.webviewMode ? vm.$store.getters.webviewSelectedStore : vm.$store.getters.selectedStore
        const isFreemium = await selectedStore.pos_freemium
        if (isFreemium) {
          await vm.paths.map(item => {
            if ((item.path === path) && item.premium)
              path = 'paymentbymode'
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
      vm.getData(path)
    })
  },
}
</script>
