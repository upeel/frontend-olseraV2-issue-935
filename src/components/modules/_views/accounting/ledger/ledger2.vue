<template>
  <div class="px-20">
        <div v-if="isSetup === 'false'" >
          <el-card class="box-card" shadow="never">
            <div class="div-nodata-accounting">
              <img src="../../../../../../static/img/no-close-date.svg" class="image" style="margin-top: 32px">
              <div class="no_close" >{{$lang[langId].setup_message}}</div>
              <el-button class="btn-set" @click="dialogSetup = true">{{$lang[langId].set_up_now}}</el-button>
            </div>
          </el-card>
        </div>

        <div v-else-if="isSetup === 'true'" >
          <el-card class="box-card" shadow="never">
            <div class="row">
              <div class="col-xs-12 col-sm-6 col-lg-6 col-md-6 text-left">
               <div v-show="typePeriod === 'custom'">
                <el-button 
                    size= "small"
                    class="date-filter-dashboard"
                    @click="toggleFilter"
                    style="width: 300px; margin: auto;">
                    <i class="fa fa-filter" />
                    <span>{{ labelDate }}</span>
                  </el-button>
                </div>
                <single-month-picker
                  v-show="typePeriod === 'month'" v-model="params.period" :clearable="false" @input="handleSelectMonth"
                  style="margin: inherit;"
                />
                <single-year-picker
                  v-show="typePeriod === 'year'" v-model="params.period" :clearable="false" @input="handleSelectYear"
                  style="margin: inherit;"
                />
                <el-radio-group class="custom-radio1" v-model="typePeriod" @change="handleChangePeriod" style="	border: groove; border-color: #409eff54; border-width: thin; width: 300px;">
                  <el-radio-button label="custom" style="width: 40%">
                    {{$lang[langId].custom}}
                  </el-radio-button>
                  <el-radio-button label="month" style="width: 30%;">
                    {{ this.lang.month }}
                  </el-radio-button>
                  <el-radio-button label="year" style="width: 30%;">
                    {{ this.lang.year }}
                  </el-radio-button>
                </el-radio-group>
              </div>
              <div class="col-xs-12 col-sm-6 col-lg-6 col-md-6 text-right" style="line-height: 5; text-align: -webkit-right; margin-top: 15px;">
                <el-button :disabled="loadingPDF" class="button-filter" @click="getPDF({statusNext: '0', fileName: ''})">
                  <span v-if="loadingPDF">
                    <loading :active="true" color= '#1bb4e6' loader="dots" :width="45" :height="10" backgroundColor='#ffffff' style="text-align: center"></loading>
                  </span>
                  <span v-else><svg-icon type="pdf-file"></svg-icon> PDF</span>
                </el-button>

                <el-button :disabled="loadingExcel" class="button-filter" @click="getExcel({statusNext: '0', fileName: ''})">
                  <span v-if="loadingExcel">
                    <loading :active="true" color= '#1bb4e6' loader="dots" :width="32" :height="10" backgroundColor='#ffffff' style="text-align: center"></loading>
                  </span>
                  <span v-else><svg-icon type="excel"></svg-icon> Excel</span>
                </el-button>
              </div>
            </div>
              

            <div style="margin-top: 24px">
              <div v-if="isLoading === false">
                <el-table
                  ref="multipleTable"
                  v-loading="isLoading"
                  class="product-table-max-height mobile-fix-height-unset"
                  :data="tableData1"
                  stripe>
                  <el-table-column
                    prop="account_no"
                    :label="$lang[langId].account_number"
                    width="130">
                  </el-table-column>
                  <el-table-column
                    :label="$lang[langId].account_name"
                    prop="account_name">
                    <template slot-scope="scope">
                      <span class="word-break">{{ capitalize(scope.row.account_name) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="lang.classification"
                    prop="account_clasification">
                    <template slot-scope="scope">
                      <span class="word-break">{{capitalize(scope.row.account_clasification)}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="fdebit"
                    label="Debit"
                    align="right">
                    <template slot-scope="scope">
                      <div>{{scope.row.fdebit}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="fcredit"
                    label="Credit"
                    align="right">
                    <template slot-scope="scope">
                      <div>{{scope.row.fcredit}}</div>
                    </template>
                  </el-table-column>

                  <el-table-column
                    prop="int_amount"
                    :label="$lang[langId].balance_value"
                    align="right">
                    <template slot-scope="scope">
											<div v-if="scope.row.famount !== null">
												<router-link :to="{ name:'Ledger Detail', params: {typePeriod: typePeriod, labelDate: labelDate,
                          row: scope.row, lastParams: params, lastFilter: filter, monthLabel: selectedMonth}}">
                            {{scope.row.famount}}
												</router-link>
											</div>
											<div v-else>{{selectedStore.currency_id}} 0</div>
                    </template>
                  </el-table-column>

                </el-table>
              </div>
              <div v-else style="margin-top: 60px;">
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
            </div>
          </el-card>
        </div>

        <div v-else>
          <el-card class="box-card" shadow="never">
            <loading 
              align="center"
              :active="true"
              color= '#1bb4e6'
              loader="bars"
              :width="64"
              :height="64"
              backgroundColor='#ffffff'>
            </loading>
          </el-card>
        </div>

    <custom-date-filter
      :show-filter="showFilter"
      @close="dateFilterClose"
      @reset="dateFilterReset"
      @save="dateFilterSave"
    />

		<dialog-setup :show="dialogSetup" @doneSetup="finishSetup"/>
    
  </div>
</template>


<script>
import { getLedger2, ledgerPageStatus, ledgerExcel, ledgerPDF } from '@/api/accounting/ledger';
import Loading from 'vue-loading-overlay';
import CustomDateFilter from 'modules/CustomDateFilter';
import SingleMonthPicker from 'components/modules/SingleMonthPicker';
import SingleYearPicker from 'components/modules/SingleYearPicker';
import dialogSetup from 'components/modules/_views/accounting/dialogSetup';
import mixinAccounting from '@/mixins/mixinAccounting';
var moment = require('moment')

export default {
  name: 'ChartOfAccount',
  components: {
    Loading,
    SingleMonthPicker,
    SingleYearPicker,
		dialogSetup,
    CustomDateFilter
  },

  mixins: [mixinAccounting],

  computed: {
    lang() {
      return this.$store.state.userStores.lang
    },
    token() {
      return this.$store.state.user.token
    },
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    bannerOrder() {
      var val = false
      if (parseInt(this.$store.state.bannerOnlineOrder.working_hours) === 0) {
        val = false
      }
      if (parseInt(this.$store.state.bannerOnlineOrder.working_hours) === 1) {
        val = true
      }
      return val
    },

  },
  watch: {

  },

  mounted() {
    this.accountSetup()
    this.getLastParams()
  },

  data() {
    return {
      filter: {
        amount: 0,
        transaction: false
      },
      loadingExcel: false,
      loadingPDF: false,
      showFilter: false,
      labelDate: '',
      selectedMonth: moment().format('yyyy-MM'),
      isLoading: false,
      tableData1: [],
      typePeriod: 'custom',
      params: {
        period: moment().format('yyyy-MM'),
        start_date: moment().format('yyyy-MM-DD'),
        end_date: moment().format('yyyy-MM-DD')
      },
    }
  },

  methods: {
    handleChangePeriod (value){

      if(value === 'month'){
        this.params.period = moment().format('yyyy-MM')
      } else if (value === 'year'){
        this.params.period = moment().format('YYYY')
      } else {
        this.params.start_date = moment().format('yyyy-MM-DD')
        this.params.end_date = moment().format('yyyy-MM-DD')
      }
      this.typePeriod = value
      this.getLedger()
    },

    handleSelectMonth (value) {
      this.params.period = moment(value).format('yyyy-MM')

      this.selectedMonth = moment(value).format('yyyy-MM')
      this.getLedger()
    },

    handleSelectYear (value) {
      this.params.period = moment(value).format('YYYY')
      this.getLedger()
    },

    setLabelFilter (filter) {
      if (filter.labelForDate === 'today') {
        this.labelDate = this.$lang[this.langId].today + '\n' +
                        moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                        moment(this.params.end_date).format('DD MMM YYYY')
      } else if (filter.labelForDate === 'yesterday') {
        this.labelDate = this.$lang[this.langId].yesterday + '\n' +
                        moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                        moment(this.params.end_date).format('DD MMM YYYY')
      } else if (filter.labelForDate === 'weekago') {
        this.labelDate = this.$lang[this.langId].a_week_ago + '\n' +
                        moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                        moment(this.params.end_date).format('DD MMM YYYY')
      } else if (filter.labelForDate === 'monthago') {
        this.labelDate = this.$lang[this.langId].a_month_ago + '\n' +
                        moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                        moment(this.params.end_date).format('DD MMM YYYY')
      } else if (filter.labelForDate === 'thismonth') {
        this.labelDate = this.$lang[this.langId].this_month + '\n' +
                        moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                        moment(this.params.end_date).format('DD MMM YYYY')
      } else if (filter.labelForDate === 'lastmonth') {
        this.labelDate = this.$lang[this.langId].last_month + '\n' +
                        moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                        moment(this.params.end_date).format('DD MMM YYYY')
      } else if (filter.labelForDate === 'custom') {
        this.labelDate = this.$lang[this.langId].custom + '\n' +
                        moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                        moment(this.params.end_date).format('DD MMM YYYY')
      }
    },

    toggleFilter() {
      if (this.showFilter) {
        this.showFilter = false
      } else {
        this.showFilter = true
      }
    },

    dateFilterClose() {
      this.showFilter = false
    },

    dateFilterReset(data) {
      this.labelDate = this.$lang[this.langId].today + '\n' +
                        moment().format('DD MMM YYYY') + ' - ' +
                        moment().format('DD MMM YYYY'),
      this.params.start_date = moment().format('YYYY-MM-DD')
      this.params.end_date = moment().format('YYYY-MM-DD')
      this.dateFilterClose()
      this.getGainLoss()
    },

    dateFilterSave(filter) {
      this.params.start_date = filter.startDate
      this.params.end_date = filter.endDate
      this.dateFilterClose()
      this.setLabelFilter(filter)
      this.getLedger()
    },

    handleFilter(label) {
      this.dialogFilter = false
      if(this.filter.amount !== 0){
        if(this.params.search_column.includes('int_amount') === false){
          this.params.search_column.push('int_amount')
          this.params.search_text.push(this.filter.amount)
        }else{
          this.params.search_column.map((i, idx) => {
            if (i === 'int_amount') {
              this.params.search_column.splice(idx, 1)
              this.params.search_text.splice(idx, 1)
            }
          })
        }
      }else if(this.filter.amount === 0){
        this.param.search_column.map((i, idx) => {
          if (i === 'int_amount') {
            this.params.search_column.splice(idx, 1)
            this.params.search_text.splice(idx, 1)
          }
        })
      }
      this.getLedger()
    },

    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      if (val.order === null) val.order = this.params.sort_type

      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.getLedger()
    },
    
    getLastParams(){
      this.labelDate = this.$lang[this.langId].today + '\n' +
                  moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                  moment(this.params.end_date).format('DD MMM YYYY')
      if(Object.keys(this.$route.params).includes('lastParams') === true ){
        this.params = {
          period: this.$route.params.lastParams.period,
          start_date: this.$route.params.lastParams.start_date,
          end_date: this.$route.params.lastParams.end_date
        }
        this.labelDate = this.$route.params.labelDate
        this.typePeriod = this.$route.params.typePeriod
      }
      
      if(Object.keys(this.$route.params).includes('lastFilter') === true ){
        this.filter = {
          amount: this.$route.params.lastFilter.amount,
          transaction: this.$route.params.lastFilter.transaction
        }
       
        if(this.filter.transaction === true){
          this.param.transaction = 'true';
        }
      }

      
      this.selectedMonth = Object.keys(this.$route.params).includes('monthLabel') === true ? this.$route.params.monthLabel : moment().format('yyyy-MM')
      this.getLedger()
    },

    getLedger() {
      this.isLoading = true

      let params = {}
      if(this.typePeriod === 'custom'){
        params = {
          start_date: this.params.start_date,
          end_date: this.params.end_date
        }
      }else{
        params = {
          period: this.params.period
        }
      }

      getLedger2(params).then(response => {
        let res = response.data
        this.tableData1 = res

        this.isLoading = false
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
        this.selectedMonth = moment().format('yyyy-MM')
        this.isLoading = false
      })
    },
    
    getPDF(next){
      let forNameFile = 'Ledger_' + this.tableData1[0].account_no+ '_1_' + moment(this.params.period).format('MMMyyyy')
      this.loadingPDF = true
      let params = {
        period: this.params.period,
        page: 1,
        start: 1,
        per_page: 1000,
        start_date: null,
        end_date: null
      }

      if(this.typePeriod === 'custom'){
        params.start_date = this.params.start_date
        params.end_date = this.params.end_date
        params.period = ''

        forNameFile = 'Ledger_' + this.tableData1[0].account_no+ '_1_' + moment(this.params.start_date).format('DDMMMyyyy') + '_' + 
          moment(this.params.end_date).format('DDMMMyyyy')
      }

      if(next.statusNext === '1'){
        delete params.start
        forNameFile = next.fileName
      }

      ledgerPDF(params).then(response => {
        let fileName = forNameFile + '.pdf'
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        this.getStatusPage('pdf')
      })
    },

    getStatusPage(typeFile){
      let params = {
        period: this.params.period,
        page: 1,
        per_page: 1000,
        start_date: null,
        end_date: null
      }

      if(this.typePeriod === 'custom'){
        params.start_date = this.params.start_date
        params.end_date = this.params.end_date
        params.period = ''
      }

      let isNext = {statusNext: '1', fileName: ''}
      
      ledgerPageStatus(params).then(response => {
        if(response.data.finish === 0){
          isNext.fileName = response.data.file_name
          if(typeFile === 'pdf'){
            this.getPDF(isNext)
          } else if(typeFile === 'xlsx') {
            this.getExcel(isNext)
          }
        } else {
          this.loadingPDF = false
          this.loadingExcel = false
        }
      })
    },

    getExcel(next){
      let forNameFile = 'Ledger_' + this.tableData1[0].account_no+ '_1_' + moment(this.params.period).format('MMMyyyy')
      this.loadingExcel = true
      let params = {
        period: this.params.period,
        page: 1,
        per_page: 1000,
        start_date: null,
        end_date: null,
        start: 1
      }

      if(this.typePeriod === 'custom'){
        params.start_date = this.params.start_date
        params.end_date = this.params.end_date
        params.period = ''
              
        forNameFile = 'Ledger_' + this.tableData1[0].account_no+ '_1_' + moment(this.params.start_date).format('DDMMMyyyy') + '_' + 
          moment(this.params.end_date).format('DDMMMyyyy')
      }

      if(next.statusNext === '1'){
        delete params.start
        forNameFile = next.fileName
      }
      
      ledgerExcel(params).then(response => {
        let fileName = forNameFile + '.xlsx' 
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()

        this.getStatusPage('xlsx')
      })
    },
    
    onClose (e) {
      // prevent close and wait
      e.wait = true
      // close after 3 seconds
      setTimeout(() => {
          // assign true to close, do nothing or assign false to cancel close.
          e.close = true
      }, 3000)
    }
  }
}
</script>

