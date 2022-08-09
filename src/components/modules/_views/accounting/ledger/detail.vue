<template>
  <div class="px-12">
    <div class="box sticky-top-has-submenu">
      <div class="box-header with-border">
        <h4 v-if="!data.account_name && !data.account_no">-</h4>
        <h4 v-else>{{data.account_no}} - {{ capitalize(data.account_name) }}</h4>
        <el-button class="visible-lg visible-md visible-sm" style="position: absolute; right: 55px" icon="el-icon-back" size="small" type="success" plain @click="backHandle">{{ lang.back }}</el-button>
        <el-button class="visible-xs" style="position: absolute; right: 33px" icon="el-icon-back" size="small" type="success" plain @click="backHandle">{{ lang.back }}</el-button>
      </div>

      <div class="box-body">
        <div class="row">
          <div class="visible-lg visible-md visible-sm col-xs-12 col-sm-9 col-md-9 col-lg-9 text-left text-left inline">
            <div class="table-handler-flex my-null">
              <div v-if="pageType">
                <el-button type="text" @click="changePageType">
                  <svg-icon type="x" class="font-24" color="#F44336"></svg-icon>
                </el-button>
                <el-input class="inline-form input-search" 
                  v-model="params.page" @change="changePage" 
                  @keyup.enter.native="changePage"
                  onkeydown="return ( event.ctrlKey || event.altKey 
                    || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                    || (95<event.keyCode && event.keyCode<106)
                    || (event.keyCode==8) || (event.keyCode==9) 
                    || (event.keyCode>34 && event.keyCode<40) 
                    || (event.keyCode==46) )"
                  :placeholder="$lang[langId].page_number"
                  ></el-input>
              </div>
              <div v-else>
                <el-button type="text" v-show="!disablePrev" @click="previousLoad">
                  <svg-icon type="arrow-previous" class="font-24"></svg-icon>
                </el-button>
                <el-button type="text" @click="changePageType" class="color-black font-20" :loading="isLoading">{{$lang[langId].page + ' ' + params.page}}</el-button>
                <el-button type="text" v-show="!disableNext" @click="nextLoad">
                  <svg-icon type="arrow-next" class="font-24"></svg-icon>
                </el-button>
              </div>
              <div style="margin: 0px 18px; height: 3rem; border-right: solid #e3e2e2 thin;"></div>
              <div class="flex-grow-1">
                <el-select :placeholder="$lang[langId].select + ' ' + $lang[langId].filter" v-model="params.search_column" @change="selectFilter">
                  <el-option
                    v-for="item in filter"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-date-picker
                  v-if="params.search_column === 'transaction_date'"
                  v-model="params.search_text"
                  type="date"
                  format="dd MMM yyyy"
                  @change="handleSearch"
                  :placeholder="$lang[langId].pick_a_day">
                </el-date-picker>
                <el-input
                  v-if="params.search_column === 'transaction_no' || params.search_column === 'transaction_name' || 
                    params.search_column === 'transaction_description' || params.search_column === 'external_no' ||
                    params.search_column === 'currency_id'
                  "
                  class="inline-form input-search"
                  clearable
                  :placeholder="lang.search"
                  prefix-icon="el-icon-search"
                  v-model="params.search_text"
                  @change="handleSearch">
                </el-input>
              </div>
            </div>

          </div>

          <div class="col-xs-12 visible-xs text-center" style="margin-top: 10px">
            <el-date-picker
              v-if="params.search_column === 'transaction_date'"
              v-model="params.search_text"
              type="date"
              format="dd MMM yyyy"
              @change="handleSearch"
              :placeholder="$lang[langId].pick_a_day"
              style="width: 100%;">
            </el-date-picker>
            <el-input
              v-if="params.search_column === 'transaction_no' || params.search_column === 'transaction_name' || params.search_column === 'transaction_description' || params.search_column === 'external_no'"
              style="width: 100%;"
              clearable
              :placeholder="lang.search"
              prefix-icon="el-icon-search"
              v-model="params.search_text"
              @change="handleSearch" size="small">
            </el-input>
          </div>

          <div class="visible-lg visible-sm visible-md col-sm-3 col-md-3 col-lg-3 text-right">
            <!-- <el-button :disabled="loadingPDF" class="button-filter"  @click="getPDF">
              <span v-if="loadingPDF">
                <loading :active="true" color= '#1bb4e6' loader="dots" backgroundColor='#ffffff'  :width="32" :height="10" style="text-align: center;"></loading>
              </span>
              <span v-else><svg-icon type="pdf-file"></svg-icon> PDF</span>
            </el-button>
            <el-button :disabled="loadingExcel" class="button-filter" @click="getExcel">
              <span v-if="loadingExcel">
                <loading :active="true" color= '#1bb4e6' loader="dots" :width="32" :height="10" backgroundColor='#ffffff' style="text-align: center"></loading>
              </span>
              <span v-else><svg-icon type="excel"></svg-icon> Excel</span>
            </el-button> -->
          </div>

          <div class="visible-xs col-xs-12" style=" margin-top: 10px;">
            <!-- <el-button :disabled="loadingPDF" class="button-filter" @click="getPDF">
              <span v-if="loadingPDF">
                <loading :active="true" color= '#1bb4e6' loader="dots" :width="32" :height="10" backgroundColor='#ffffff' style="text-align: center"></loading>
              </span>
              <span v-else><svg-icon type="pdf-file"></svg-icon> PDF</span>
            </el-button>
            <el-button :disabled="loadingExcel" class="button-filter" @click="getExcel">
              <span v-if="loadingExcel">
                <loading :active="true" color= '#1bb4e6' loader="dots" :width="32" :height="10" backgroundColor='#ffffff' style="text-align: center"></loading>
              </span>
              <span v-else><svg-icon type="excel"></svg-icon> Excel</span>
            </el-button> -->
          </div>
        </div>
      </div>
    </div>

    <el-card class="box-card">
      <div v-if="isLoading === false">
        <el-table
          ref="multipleTable"
          :data="dataDetail"
          class="product-table-max-height mobile-fix-height-unset"
          @sort-change="changeSortTable"
          stripe>
          <el-table-column
            prop="transaction_date"
            :label="lang.date"
            sortable
            width="120">
            <template slot-scope="scope">
              <span>{{scope.row.ftransaction_date}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="transaction_no"
            :label="lang.transaction_no"
            width="160"
            sortable>
            <template slot-scope="scope">
              <div v-if="scope.row.purchase_sales_form === 4">
                <router-link :to="{ path: '/inventory/stocksopname/' + scope.row.transaction_id }">
                  {{ scope.row.transaction_no }}
                </router-link>
              </div>
              <div v-else>{{scope.row.transaction_no}}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="transaction_description"
            :label="lang.description"
            sortable
            width="350">
            <template slot-scope="scope">
              <div>{{capitalize(scope.row.transaction_description)}}</div>
              <p v-show="scope.row.reference_no || scope.row.external_no" class="font-11">
                <span v-show="scope.row.reference_no">{{ scope.row.reference_no }}</span>
                <span v-show="scope.row.reference_no && scope.row.external_no"> | </span>
                <span v-show="scope.row.external_no">{{ scope.row.external_no }}</span>
              </p>
            </template>
          </el-table-column>
          <el-table-column
            prop="int_debit"
            :label="$lang[langId].debit"
            align="right"
            sortable>
            <template slot-scope="scope">
              <div v-if="scope.row.fdebit !== null">{{ scope.row.fdebit }}</div>
              <div v-else>0</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="int_credit"
            :label="$lang[langId].credit"
            align="right" 
            sortable>
            <template slot-scope="scope">
              <div v-if="scope.row.fcredit !== null">{{ scope.row.fcredit }}</div>
              <div v-else>0</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="amount"
            :label="lang.amount"
            align="right">
            <template slot-scope="scope">
              <div v-if="scope.row.famount_akumulatif !== null">{{ scope.row.famount_akumulatif }}</div>
              <div v-else>0</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else  style="margin-top: 60px;">
        <loading
          align="center"
          :active="true"
          color= '#1bb4e6'
          loader="spinner"
          :width="32"
          :height="32"
          backgroundColor='#ffffff'>
        </loading>
      </div>
    </el-card>

  </div>
</template>

<script>
import axios from 'axios';
import {baseApi} from 'src/http-common';
import { ledger2Detail } from '@/api/accounting/ledger';
import Loading from 'vue-loading-overlay';

import mixinAccounting from '@/mixins/mixinAccounting';
const moment = require('moment')

export default {
  name: 'DetailChartOfAccount',
  components: {
    Loading
  },

  mixins: [mixinAccounting],

  data() {
    return {
      isLoading: false,
      loadingPDF: false,
      loadingExcel: false,
      filter: [
        {
          value: null,
          label: this.$store.state.userStores.lang.all
        },{
          value: 'transaction_no',
          label: this.$store.state.userStores.lang.transaction_no
        },{
          value: 'transaction_date',
          label: this.$store.state.userStores.lang.transaction_date
        },{
          value: 'transaction_name',
          label: this.$store.state.userStores.lang.transaction_type_name
        },{
          value: 'external_no',
          label: this.$lang[this.$store.state.userStores.langId].document_number
        },{
          value: 'transaction_description',
          label: this.$store.state.userStores.lang.description
        },{
          value: 'currency_id',
          label: this.$lang[this.$store.state.userStores.langId].currency
        }
      ],
      data: {},
      dataDetail: [],
      pageType: false,
      disablePrev: true,
      disableNext: true,
      params: {
        period: this.$route.params.lastParams.period,
        start_date: this.$route.params.lastParams.start_date,
        end_date: this.$route.params.lastParams.end_date,
        account_no : this.$route.params.account_no,
        sort_column: '',
        sort_type: '',
        page: 1,
        per_page: 25
      }
    }
  },

  watch: {
    filter: {
      handler: function(val){
        this.disablePrev = true
        let tpe = parseInt(val.page)
        if(tpe < 1){
          this.disablePrev = false
        }
      },
      deep: true
    }
  },
  
  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    token() {
      return this.$store.state.user.token
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    userRole() {
      const selectedStore = this.$store.getters.selectedStore
      return {
        role_id: selectedStore.role_id,
        role_name: selectedStore.role_name,
        is_pos_only: selectedStore.is_pos_only,
        is_mobile: selectedStore.is_mobile
      }
    }
  },
  methods: {
    selectFilter(val) {
      if(val !== null){
        this.params.search_column = val
      } else {
        delete this.params.search_column
        delete this.params.search_text
        this.loadData()
      }
    },

    handleSearch(val) {
      this.params.page = 1
        if(this.params.search_column === 'transaction_date'){
          if(val !== null){
            this.params.search_text = moment(val).format('YYYY-MM-DD')
          } else {
            this.params.search_column = ''
            this.params.search_text = ''
          }
        } else {
          this.params.search_text = val
        }

        if(this.params.search_column === null || this.params.search_text === null){
          delete this.params.search_column;
          delete this.params.search_text;
        }
        this.loadData()
    },

    changeSortTable(val) {
      this.param.page = 1
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      if (val.order === null) val.order = this.params.sort_type

      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.loadData()
    },

    previousLoad(){
      this.params.page = parseInt(this.params.page - 1)
      this.loadData()
    },

    nextLoad(){
      this.params.page = parseInt(this.params.page + 1)
      this.loadData()
    },

    changePageType(){
      let show = this.pageType
      if (show){
        this.pageType = false
        this.params.page = parseInt(this.params.page)
      }else{
        this.pageType = true
      }
    },

    changePage(){
      if(this.params.page <= this.params.total_page){
        this.pageType = false
        this.loadData()
      } else {
        this.params.page = this.params.total_page
      }
    },

    loadData(){
      this.isLoading = true

      if(Object.keys(this.$route.params).includes('lastParams') === true ){
        this.data = this.$route.params.row
        this.params.period = this.$route.params.lastParams.period
        this.params.start_date = this.$route.params.lastParams.start_date
        this.params.end_date = this.$route.params.lastParams.end_date
        this.params.account_no = this.data.account_no
      }

      if(this.$route.params.typePeriod === 'custom'){
        delete this.params.period;
      } else {
        delete this.params.start_date;
        delete this.params.end_date;
      }

      ledger2Detail(this.params).then(response => {
        this.data = Object.keys(this.$route.params).includes('row') === true ? this.$route.params.row : this.data 
        this.dataDetail = response.data.detail
        this.params.page = parseInt(response.data.current_page)
        this.params.total_page = parseInt(response.data.total_page.total_page)
        this.disablePrev = this.params.page > 1 ? false : true
        this.disableNext = this.params.page === this.params.total_page ? true : false
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.disablePrev = true
        this.params.page = 1
        this.data = Object.keys(this.$route.params).includes('row') === true ? this.$route.params.row : this.data 
        if(typeof error.response.data.error.error === 'object'){
          let errorKey = Object.keys(error.response.data.error.error)[0];
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error[errorKey][0]
          })
        } else {
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
      })
    },

    getFileMobile(type) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let params = {
        year: this.$route.params.row.year,
        month: this.$route.params.row.month,
        account_no: this.$route.params.row.account_no,
        sort_column: this.params.sort_column,
        sort_type: this.params.sort_type, 
        search_column: this.params.search_column,
        search_text: this.params.search_text,
      }

      axios({
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/receivable/' + type),
        method: 'GET',
        responseType: 'blob',
        headers,
        params: params
      }).then((response) => {
        const file = new Blob([response.data])
        const fileName = this.data.account_name + '-' + this.data.year + '' + this.data.month + '.' + type
        const url = window.URL.createObjectURL(file)
        const apiParams = '?' + params
        const apiURL = '/download/api/' + this.selectedStore.url_id + '/admin/v1/' + this.langId + '/account/receivable/' + type
        window.location = apiURL + apiParams + ',' + fileName
        this.loadingPDF = false
        this.loadingExcel = false
      }).then(error => {
        if(typeof error.response.data.error.error === 'object'){
          let errorKey = Object.keys(error.response.data.error.error)[0];
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error[errorKey][0]
          })
        } else {
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
        this.loadingPDF = false
        this.loadingExcel = false
      })
    },

    getPDF(data) {
      this.loadingPDF = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let params = {
        year: this.$route.params.row.year,
        month: this.$route.params.row.month,
        account_no: this.$route.params.row.account_no,
        page: 1,
        per_page: 1000
      }

      if('account_no' in data){
        params = data
      }

      axios({
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/detail/new/pdf'),
        method: 'GET',
        responseType: 'blob',
        headers,
        params: params 
      }).then((response) => {
        if(response.headers['content-type'] === 'application/json'){
          let dataParamsNext = {
            year: this.$route.params.row.year,
            month: this.$route.params.row.month,
            account_no: this.$route.params.row.account_no,
            page: params.page+1,
            per_page: 1000
          }
          this.getPDF(dataParamsNext)
        } else {
          const fileName = this.data.account_name + '-' + this.data.year + '' + this.data.month + '.pdf'
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click()
          this.loadingPDF = false
        }
      }).catch(error => {
        if(typeof error.response.data.error.error === 'object'){
          let errorKey = Object.keys(error.response.data.error.error)[0];
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error[errorKey][0]
          })
        } else {
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
        this.loadingPDF = false
      })
    },

    getExcel(data) {
      this.loadingExcel = true
      if (this.$store.getters.webviewMode) {
        this.getFileMobile('xlsx')
      } else {
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }

        let params = {
          year: this.$route.params.row.year,
          month: this.$route.params.row.month,
          account_no: this.$route.params.row.account_no,
          page: 1,
          per_page: 1000
        }

        if('account_no' in data){
          params = data
        }

        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'account/detail/new/excel'),
          responseType: 'blob',
          headers,
          params
        }).then(response => {
          if(response.headers['content-type'] === 'application/json'){
            let dataParamsNext = {
              year: this.$route.params.row.year,
              month: this.$route.params.row.month,
              account_no: this.$route.params.row.account_no,
              page: params.page+1,
              per_page: 1000
            }
            this.getExcel(dataParamsNext)
          } else {
            const fileName = this.data.account_name + '-' + this.data.year + '' + this.data.month + '.xlsx'
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
            this.loadingExcel = false
          }
        }).catch(error => {
          if(typeof error.response.data.error.error === 'object'){
            let errorKey = Object.keys(error.response.data.error.error)[0];
            this.$notify({
              tipe: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error[errorKey][0]
            })
          } else {
            this.$notify({
              tipe: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error
            })
          }
          this.loadingExcel = false
        })
      }
    },

    backHandle() {
      let typePeriod = this.$route.params.typePeriod
      let lastParams = this.$route.params.lastParams
      let monthLabel = this.$route.params.monthLabel
      let lastFilter = this.$route.params.typePeriod
      let labelDate = this.$route.params.labelDate
      this.$router.push({name: 'Ledger', params: {typePeriod: typePeriod, lastParams: lastParams, lastFilter: lastFilter, monthLabel: monthLabel, labelDate: labelDate}})
    },
  },
  mounted() {
    this.loadData()
  }
}
</script>

<style lang="scss" scoped>
  .cart-items {
    float: none;
    padding: 0;
    // li {
    //   padding: 8px 0 8px 0;
    // }
    h5 {
      font-weight: 600;
      margin-top: 2px;
      margin-bottom: 0;
    }
  }
</style>
