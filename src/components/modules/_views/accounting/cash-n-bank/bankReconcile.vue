<template>
  <div class="px-20">
    <div v-if="isSetup === 'false'">
      <el-card class="box-card" shadow="never">
        <div class="div-nodata-accounting">
          <img src="../../../../../../static/img/no-close-date.svg" class="image" style="margin-top: 32px">
          <div class="no_close" >{{$lang[langId].setup_message}}</div>
          <el-button class="btn-set" @click="dialogSetup = true">{{$lang[langId].set_up_now}}</el-button>
        </div>
      </el-card>
    </div>

    <div v-else-if="isSetup === 'true'">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="table-handler-flex">
          <h4 style="flex-grow: 1;">{{ $lang[langId].bank_reconcile}}</h4>
        </div>
        <el-row :gutter="20">
          <el-col :span="12" align="left" class="table-handler-flex">
            <el-select class="date-filter-dashboard" v-model="params.account_no"  @change="getBankReconcile($event)" :placeholder="$lang[langId].select" size="small" style="width: 50%;">
              <el-option
                v-for="account in dataAccount"
                :key="account.id"
                :label="account.account_no +' '+ account.account_name"
                :value="account.account_no">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="12" align="right">
            <el-button
              size= "small"
              class="date-filter-dashboard"
              @click="toggleFilter"
              style="margin-right: 7px">
              <i class="fa fa-filter" />
              <span>{{ labelDate }}</span>
            </el-button>
          </el-col>
        </el-row>

        <div class="card-body mt-24">
            <div v-if="isLoading === false">
              <el-row :gutter="20">
                <el-col :span="12">
                  <div style="background-color: #f5f7fa; 
                    text-align: center;
                    font-weight: 800;
                    line-height: 2;
                    border-bottom: solid thin;">
                    Bank
                  </div>
                  <el-table
                    :data="dataBank"
                    ref="multipleTable"
                    class="accounting-table"
                    v-loading="isLoading"
                    max-height="540"
                    :row-class-name="tableRowClassName"
                    :highlight-current-row="false">
                      <el-table-column
                        prop="date"
                        :label="lang.date"
                        sortable>
                        <template slot-scope="scope">
                          <span>{{scope.row.fdate}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="balance"
                        :label="$lang[langId].balance_value"
                        align="right"
                        sortable>
                        <template slot-scope="scope">
                          <el-button type="text" v-if="scope.row.fbalance !== null" @click="showDialogDetail(scope.row, 'bank')">{{ scope.row.fbalance }}</el-button>
                          <div v-else>0</div>
                        </template>
                      </el-table-column>
                  </el-table>
                </el-col>
                <el-col :span="12">
                  <div style="background-color: #f5f7fa; 
                    text-align: center;
                    font-weight: 800;
                    line-height: 2;
                    border-bottom: solid thin;">
                    Olsera
                  </div>
                  <el-table
                    :data="dataCompany"
                    ref="multipleTable"
                    class="accounting-table"
                    v-loading="isLoading"
                    max-height="540"
                    :row-class-name="tableRowClassName"
                    :highlight-current-row="false">
                      <el-table-column
                        prop="transaction_date"
                        :label="lang.date"
                        sortable>
                        <template slot-scope="scope">
                          <span>{{scope.row.ftransaction_date}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="transaction_balance"
                        :label="$lang[langId].balance_value"
                        align="right"
                        sortable>
                        <template slot-scope="scope">
                          <el-button type="text" @click="showDialogDetail(scope.row, 'olsera')" v-if="scope.row.ftransaction_balance !== null">{{ scope.row.ftransaction_balance }}</el-button>
                          <div v-else>0</div>
                        </template>
                      </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </div>
            <div v-else>
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

		<dialog-setup :show="dialogSetup" @doneSetup="finishSetup"/>

    <el-dialog
      :visible.sync="dialogDetail"
      :show-close="false"
      width="95%"
      custom-class="dialog-card">
      <div slot="title" class="flex-container">
        <el-row :gutter="20"  style="width: 100%">
          <el-col :span="14">
            <h4 class="dialog-title">{{ $lang[langId].reconcile_detail }} {{"date" in detailReconcile ? detailReconcile.fdate : detailReconcile.ftransaction_date}}</h4>
          </el-col>
          <el-col :span="10" align="right">
            <div class="btn_accounting_dialog">
              <el-button type="info" @click="showDialogDetail(detailReconcile)">{{ lang.close }}</el-button>
            </div>
          </el-col>
        </el-row>

      </div>
      <div v-if="loadingDetail === false">
        <el-row :gutter="20">
          <el-col :span="10">
            <div style="background-color: #f5f7fa; 
              text-align: center;
              font-weight: 800;
              line-height: 2;
              border-bottom: solid thin;">
              Bank
            </div>
            <el-table
              :data="dataDetail.dataBank"
              ref="multipleTable"
              class="accounting-table"
              v-loading="isLoading"
              max-height="540"
              :row-class-name="tableRowClassName"
              :highlight-current-row="false">
                <el-table-column
                  prop="description"
                  :label="lang.description">
                  <template slot-scope="scope">
                    <span>{{capitalize(scope.row.description)}}</span><br>
                    <el-tag size="mini"
                      v-if="scope.row.ftype == 'D'"
                      type="success" align="center">
                      Debit
                    </el-tag>
                    <el-tag size="mini"
                      v-else-if="scope.row.ftype == 'C'"
                      type="warning" align="center">
                      Credit
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="account_mutation"
                  :label="$lang[langId].mutation_amount"
                  align="right"
                  sortable>
                  <template slot-scope="scope">
                    <div v-if="scope.row.fmutation !== null">{{ scope.row.fmutation }}</div>
                    <div v-else>0</div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="balance"
                  :label="$lang[langId].balance_value"
                  align="right"
                  sortable>
                  <template slot-scope="scope">
                    <div v-if="scope.row.fbalance !== null">{{ scope.row.fbalance }}</div>
                    <div v-else>0</div>
                  </template>
                </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="14">
            <div style="background-color: #f5f7fa; 
              text-align: center;
              font-weight: 800;
              line-height: 2;
              border-bottom: solid thin;">
              Olsera
            </div>
            <el-table
              :data="dataDetail.dataCompany"
              ref="multipleTable"
              class="accounting-table"
              v-loading="isLoading"
              max-height="540"
              :row-class-name="tableRowClassName"
              :highlight-current-row="false">
                <el-table-column
                  prop="transaction_description"
                  :label="lang.description">
                  <template slot-scope="scope">
                    <span>{{capitalize(scope.row.transaction_description)}}</span><br>
                    <el-tag size="mini" type="info" align="center">
                      {{scope.row.transaction_no}}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="amount"
                  :label="$lang[langId].amount_debit"
                  align="right"
                  sortable>
                  <template slot-scope="scope">
                    <div>{{ scope.row.fdebit }}</div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="amount"
                  :label="$lang[langId].amount_credit"
                  align="right"
                  sortable>
                  <template slot-scope="scope">
                    <div>{{ scope.row.fcredit }}</div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="fbalance"
                  :label="$lang[langId].balance_value"
                  align="right"
                  sortable>
                  <template slot-scope="scope">
                    <div v-if="scope.row.fbalance !== null">{{ scope.row.fbalance }}</div>
                    <div v-else>0</div>
                  </template>
                </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
      <div v-else>
        <loading 
          align="center"
          :active="true"
          color= '#1bb4e6'
          loader="bars"
          :width="64"
          :height="64"
          backgroundColor='#ffffff'>
        </loading>
      </div>

    </el-dialog>

    <custom-date-filter
      :show-filter="showFilter"
      @close="dateFilterClose"
      @reset="dateFilterReset"
      @save="dateFilterSave"
    />

  </div>
</template>

<script>
import mixinAccounting from '@/mixins/mixinAccounting';
import { baseApi } from 'src/http-common';
import axios from 'axios';
import Loading from 'vue-loading-overlay';
import CustomDateFilter from 'modules/CustomDateFilter';
import dialogSetup from 'components/modules/_views/accounting/dialogSetup';
var moment = require('moment');

export default {
  name: 'BankReconcile',
  mixins: [mixinAccounting],
  components: {
    Loading,
    CustomDateFilter,
		dialogSetup
  },

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
    }
  },

  mounted(){
    this.accountSetup()
    this.getLastParams()
  },

  data() {
    return {
      isLoading: false,
      loadingDetail: false,
      dialogDetail: false,
      dataBank: [],
      dataCompany: [],
      labelDate: '',
      showFilter: false,
      detailReconcile: {},
      dataAccount: [],
      dataDetail:{
        dataBank: [],
        dataCompany: []
      },
      params: {
        account_no: null,
        start_date: moment().format('yyyy-MM-DD'),
        end_date: moment().format('yyyy-MM-DD')
      }
    }
  },

  methods: {
    getAccountBank(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/name/cashbankonly'),
        headers: headers
      }).then(response => {
        this.dataAccount = response.data.data
				this.params.account_no = this.dataAccount[0].account_no
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
      })
    },

    getBankReconcile(value){
      this.params.account_no = value ? value : null
      this.isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/bank/reconcile'),
        headers: headers,
        params: this.params
      }).then(response => {
        this.dataBank = response.data.bank_statement
        this.dataCompany = response.data.olsera
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
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

    getLastParams() {
      if(Object.keys(this.$route.query).includes('lastParams') ===true){
        this.params = "start_date" in this.$route.query.lastParams ? this.$route.query.lastParams : this.params
        this.labelDate = this.$route.query.labelDate
      }else{
        this.params.account_no = null
        this.params.start_date = moment().format('YYYY-MM-DD')
        this.params.end_date = moment().format('YYYY-MM-DD')
        this.labelDate = this.$lang[this.langId].today + '\n' +
                          moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                          moment(this.params.end_date).format('DD MMM YYYY')
      }

      this.getAccountBank()
    },

    setLabelFilter(filter) {
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
      this.getBankReconcile(this.params.account_no)
    },

    dateFilterSave(filter) {
      this.params.start_date = filter.startDate
      this.params.end_date = filter.endDate
      this.dateFilterClose()
      this.setLabelFilter(filter)
      this.getBankReconcile(this.params.account_no)
    },

    showDialogDetail(row, type = null){
      if(this.dialogDetail){
        this.dialogDetail = false
        this.detailReconcile = {}
        this.dataDetail = {
          dataBank: [],
          dataCompany: []
        }
      }else{
        this.detailReconcile = row
        this.getDetail(row, type)
        this.dialogDetail = true
      }
    },

    getDetail(row, type){
      this.loadingDetail = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let date = ''

      if(type === 'bank'){
        date = row.date
      }else if(type === 'olsera'){
        date = row.transaction_date
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/bank/reconcile/detail/'+row.account_no+'/'+moment(date).format('yyyy-MM-DD')+'/'+row.currency_id),
        headers: headers
      }).then(response => {
        this.dataDetail = {
          dataBank: response.data.bank_statement,
          dataCompany: response.data.olsera
        }
        this.loadingDetail = false
      }).catch(error => {
        this.loadingDetail = false
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

      tableRowClassName({row, rowIndex}) {
        if (row.different === 1) {
          return 'warning-row';
        }
        return '';
      }
  }
}
</script>
