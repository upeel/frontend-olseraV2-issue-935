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
        <div class="row">
          <div class="visible-lg visible-md col-lg-4 col-md-4 text-left">
            <single-month-picker
              v-if="typePeriod === 'month'" v-model="params.period" :clearable="false" @input="handleSelectMonth"
              style="margin: 0px"
            />
            <single-year-picker
              v-if="typePeriod === 'year'" v-model="params.period" :clearable="false" @input="handleSelectYear"
              style="margin: 0px"
            />
            <el-radio-group class="custom-radio1" v-model="typePeriod" @change="handleChangePeriod" style="	border: groove; border-color: #409eff54; border-width: thin; width: 300px;">
              <el-radio-button label="month" style="width: 149px">
                {{ this.lang.month }}
              </el-radio-button>
              <el-radio-button label="year" style="width: 149px">
                {{ this.lang.year }}
              </el-radio-button>
            </el-radio-group>
          </div>
          <div class="text-right col-sm-12 col-lg-8 col-md-8" style="line-height: 5;">
            <el-button
              type="info"
              @click="dialogImport = true"
              class="button-filter">
              {{ lang.import }}
            </el-button>
            <el-button
              type="info"
              @click="dialogFilter = true"
              class="button-filter">
              <i class="fa fa-filter"></i>
              {{ $lang[langId].filter }}
            </el-button>
          </div>
        </div>
        <div class="card-body mt-24">
            <div v-if="isLoading === false">
              <el-table
                ref="multipleTable"
                v-loading="isLoading"
                class="product-table-max-height mobile-fix-height-unset"
                :data="dataStatement"
                stripe>
                <el-table-column
                  prop="date"
                  :label="lang.date"
                  width="110">
                  <template slot-scope="scope">
                    <span>{{ scope.row.fdate }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="account_no"
                  :label="$lang[langId].account_name">
                  <template slot-scope="scope">
                    <span v-if="scope.row.account_no !== null" class="word-break">
                      {{ scope.row.account_no}}
                      <span v-if="scope.row.account_name !== null">{{' - ' + capitalize(scope.row.account_name)}}</span>
                    </span>
                    <span v-else>-</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="description"
                  :label="lang.description">
                  <template slot-scope="scope">
                    <span>{{ capitalize(scope.row.description) }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="mutation"
                  :label="$lang[langId].mutation_amount">
                  <template slot-scope="scope">
                    <span>{{ scope.row.fmutation }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="type"
                  :label="lang.type"
                  width="70">
                  <template slot-scope="scope">
                    <el-tag size="mini"
                      v-if="scope.row.type == 'db'"
                      type="success" align="center">
                      Debit
                    </el-tag>
                    <el-tag size="mini"
                      v-else-if="scope.row.type == 'cr'"
                      type="warning" align="center">
                      Credit
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="balance"
                  :label="$lang[langId].balance_value">
                  <template slot-scope="scope">
                    <span>{{ scope.row.fbalance }}</span>
                  </template>
                </el-table-column>
                
                <el-table-column :label="$lang[langId].action" align="center" width="90px">
                  <template slot-scope="scope">
                    <el-dropdown trigger="click" style="padding: inherit">
                      <el-button type="text" icon="el-icon-more" style="color:#909399"></el-button>
                      <el-dropdown-menu slot="dropdown" style="background-color: #F2F2F2;">
                        <el-dropdown-item style="padding: 0px">
                          <el-button type="text" class="accounting-dropBtn" style="color: #FF0000;" @click="deleteStatement(scope.row)">
                            <svg-icon icon-class="trash-2"></svg-icon>
                            {{ $lang[langId].delete }}
                          </el-button>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </el-table-column>
              </el-table>
              <div style="text-align: center">
                <el-pagination
                  layout="total, prev, pager, next, jumper"
                  @size-change="handleChangeSize"
                  @current-change="handleCurrentChange"
                  :total="params.total"
                  :current-page.sync="params.currentPage"
                  :page-size="parseInt(params.per_page)"
                  class="paginate">
                </el-pagination>
              </div>
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
      :visible.sync="dialogFilter"
      class="text-left"
      width="30%"
      custom-class="dialog-card">
      <el-form>
        <el-form-item class="visible-xs visible-sm" :label="$lang[langId].pick_a_month">
           <single-month-picker
            v-if="typePeriod === 'month'" v-model="params.period" :clearable="false" @input="handleSelectMonth"
            style="margin: 0px"
          />
          <single-year-picker
            v-if="typePeriod === 'year'" v-model="params.period" :clearable="false" @input="handleSelectYear"
            style="margin: 0px"
          />
          <el-radio-group class="custom-radio1" v-model="typePeriod" @change="handleChangePeriod" style="	border: groove; border-color: #409eff54; border-width: thin; width: 300px;">
            <el-radio-button label="month" style="width: 149px">
              {{ this.lang.month }}
            </el-radio-button>
            <el-radio-button label="year" style="width: 149px">
              {{ this.lang.year }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="lang.search" :label-width="formLabelWidth">
          <el-input
            v-model="params.search"
            :placeholder="$lang[langId].account_number+'/'+$lang[langId].account_name"
            clearable
            prefix-icon="el-icon-search"
            size="small"
            >
          </el-input>
        </el-form-item>
        <el-form-item :label="lang.amount" :label-width="formLabelWidth">
          <money v-model="filter.amount"
            v-bind="money"
            :prefix="selectedStore.currency_id + ' '"
            class="form-input input-sm input-money"
            style="height: 32px;">
          </money>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleFilter">{{ $lang[langId].filter }}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="lang.import + ' ' + $lang[langId].bank_statement"
      :visible.sync="dialogImport"
      :width="tableImport ? '1200px' : '800px'"
      @close="cancelImport">

      <div>
        <div v-if="dropdownFormImport">
          <el-row class="mb-8">
            <el-col span="8">
              <el-button :disabled="loadingTemplate" @click="downloadTemplate">
                <span v-if="loadingTemplate">
                    <loading :active="true" color= '#1bb4e6' loader="dots" :width="130" :height="10" backgroundColor='#ffffff' style="text-align: center"></loading>
                </span>
                <span v-else>{{ lang.download_template }}</span>
              </el-button>
            </el-col>
            <el-col span="16" align="right">
              <el-select class="date-filter-dashboard" style="max-width: 150px;" v-model="importAccount" :placeholder="$lang[langId].select" size="small">
                <el-option
                  v-for="account in dataAccount"
                  :key="account.id"
                  :label="account.account_no +' '+ account.account_name"
                  :value="account.account_no">
                </el-option>
              </el-select>

              <el-select class="date-filter-dashboard" style="max-width: 150px;" v-model="importCurrency" placeholder="Select" size="small">
                <el-option
                  v-for="(currency, index) in dataCurrency"
                  :key="index"
                  :label="currency.currency_id"
                  :value="currency.currency_id">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <!-- <div class="mb-8">

          </div> -->
          <el-upload
            v-loading="loadingUploadImport"
            class="upload-statement"
            drag
            :action="computedUploadImportUrl"
            :headers="computedUploadImportHeaders"
            :on-success="handleUploadImportSuccess"
            :on-error="handleUploadImportError"
            :on-progress="handleUploadImportProgress"
            multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
            <div class="el-upload__tip" slot="tip">
              {{ lang.import_from_csv_info }}
            </div>
          </el-upload>
        </div>

        <div v-if="tableImport">
          <div v-if="errorImport != 0" class="mb-8">
            <el-tag type="danger" class="font-14">
              {{ $lang[langId].theres_error }}. {{ $lang[langId].fix_upload_error }}
            </el-tag>
          </div>

            <el-row class="mb-8">
              <el-col span="12">
                <el-select class="date-filter-dashboard" style="width: 50%;" disabled v-model="importAccount" :placeholder="$lang[langId].select" size="small">
                  <el-option
                    v-for="account in dataAccount"
                    :key="account.id"
                    :label="account.account_no +' '+ account.account_name"
                    :value="account.account_no">
                  </el-option>
                </el-select>
              </el-col>
              <el-col span="12" align="right">
                <el-select class="date-filter-dashboard" v-model="importCurrency" disabled placeholder="Select" size="small">
                  <el-option
                    v-for="(currency, index) in dataCurrency"
                    :key="index"
                    :label="currency.currency_id"
                    :value="currency.currency_id">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>

            <el-table
              ref="multipleTable"
              v-loading="loadingUploadImport"
              border
              :data="tableImportJurnal"
              :default-sort="{prop: 'id', order: 'ascending'}"
              :row-class-name="tableRowClassName">
              <el-table-column :label="$lang[langId].number" type="index" :index="indexMethod">
              </el-table-column>

              <el-table-column :label="lang.date" prop="date" sortable min-width="100">
                <template slot-scope="props">
                  {{ dateFormat(props.row.date) }}
                </template>
              </el-table-column>

              <el-table-column :label="lang.description" prop="description" sortable min-width="180">
              </el-table-column>

              <el-table-column
                prop="amount"
                :label="$lang[langId].mutation_amount"
                align="right">
                <template slot-scope="scope">
                  <div v-if="scope.row.mutation">{{ formatPrice(scope.row.mutation) }}</div>
                  <div v-else>0</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="saldo"
                :label="$lang[langId].balance_value"
                align="right">
                <template slot-scope="scope">
                  <div v-if="scope.row.saldo">{{ formatPrice(scope.row.saldo) }}</div>
                  <div v-else>0</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="type"
                :label="lang.type"
                width="70">
                <template slot-scope="scope">
                  <el-tag size="mini"
                    v-if="scope.row.type == 'D'"
                    type="success" align="center">
                    Debit
                  </el-tag>
                  <el-tag size="mini"
                    v-else
                    type="warning" align="center">
                    Credit
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelImport" type="info">{{ lang.cancel }}</el-button>
        <el-button @click="saveImportData" type="success" v-bind:disabled="btnProsesImport">
          {{ lang.processing }}
        </el-button>
      </span>
    </el-dialog>
    <el-dialog 
      :title="$lang[langId].delete + ' ' + $lang[langId].bank_statement" 
      :visible.sync="dialogDelete" 
      width="50%" center 
      :close-on-click-modal="false" 
      :show-close="false">
      <div class="text-center">
        <p>{{ $lang[langId].are_you_want_remove +' '+ $lang[langId].bank_statement }}</p>
        <p style="font-weight: bold;">{{ capitalize(deleteData.description) }}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDeleteDialog">{{ lang.cancel }}</el-button>
        <el-button type="danger" :disabled="loadingDelete" @click="removeStatement">{{ lang.remove }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import { baseApi } from 'src/http-common';
import SingleMonthPicker from 'components/modules/SingleMonthPicker';
import SingleYearPicker from 'components/modules/SingleYearPicker';
import axios from 'axios';
import Loading from 'vue-loading-overlay';
import mixinAccounting from '@/mixins/mixinAccounting';
import dialogSetup from 'components/modules/_views/accounting/dialogSetup';
var moment = require('moment')

export default {
  name: 'BankStatement',
  components: {
    SingleMonthPicker,
    SingleYearPicker,
    Loading,
		dialogSetup
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
    computedUploadImportUrl() {
      const url = baseApi(this.selectedStore.url_id, this.langId, 'account/bank/importcsv/'+this.importAccount+'/'+this.importCurrency)
      return url
    },
    computedUploadImportHeaders() {
      return {
        'authorization' : 'Bearer ' + this.token.access_token
      }
    },
  },

  mounted() {
    this.accountSetup()
    this.getBankStatement()
    this.getAccountBank()
    this.getCurrency()
  },

  data() {
    return {
      money: {
        decimal: ',',
        thousands: '.',
        prefix: '',
        precision: 0,
        masked: false
      },
      selectedMonth: moment().format('yyyy-MM'),
      typePeriod: 'month',
      formLabelWidth: '108px',
      isLoading: false,
      dialogFilter: false,
      filter: {amount: 0},
      dialogImport: false,
      dialogDelete: false,
      loadingDelete: false,
      loadingUploadImport: false,
      loadingExport: false,
      loadingTemplate: false,
      tableImport: false,
      btnProsesImport: true,
      dropdownFormImport: true,
      fileImportConfirm: '',
      tableImportJurnal: [],
      dataAccount: [],
      dataCurrency: [],
      importAccount: null,
      importCurrency: null,
      deleteData: {},
      dataStatement: [],
      params: {
        period: moment().format('yyyy-MM'),
        currentPage: 1,
        per_page: 15,
        due_dates_at: '',
        page: 1,
        total: null
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
				this.importAccount = this.dataAccount[1].account_no
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

    getCurrency(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/currency'),
        headers: headers
      }).then(response => {
        this.dataCurrency = response.data.data
        if(this.dataCurrency.length !== 0){
          this.importCurrency = this.dataCurrency[0].currency_id
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
      })
    },

    handleFilter(label) {
      this.dialogFilter = false
      // if(this.filter.amount !== 0){
      //   if(this.params.search_column.includes('int_amount') === false){
      //     this.params.search_column.push('int_amount')
      //     this.params.search_text.push(this.filter.amount)
      //   }else{
      //     this.params.search_column.map((i, idx) => {
      //       if (i === 'int_amount') {
      //         this.params.search_column.splice(idx, 1)
      //         this.params.search_text.splice(idx, 1)
      //       }
      //     })
      //   }
      // }else if(this.filter.amount === 0){
      //   this.params.search_column.map((i, idx) => {
      //     if (i === 'int_amount') {
      //       this.params.search_column.splice(idx, 1)
      //       this.params.search_text.splice(idx, 1)
      //     }
      //   })
      // }
      // this.getGeneralJournal()
    },

    getBankStatement() {
      this.isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/bank/statement'),
        headers: headers,
        params: this.params
      }).then(response => {
        this.dataStatement = response.data.data
        this.params.per_page = response.data.meta.per_page
        this.params.currentPage = response.data.meta.current_page
        this.params.total = response.data.meta.total
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

    handleChangeSize(val){
      this.params.page = 1
      this.params.per_page = val
      this.getBankStatement()
    },

    handleCurrentChange(val){
      this.params.currentPage = val
      this.params.page = val
      this.getBankStatement()
    },

    handleChangePeriod (value){
      if(value === 'month'){
        this.params.period = moment().format('yyyy-MM')
      }else{
        this.params.period = moment().format('YYYY')
      }
      this.typePeriod = value
      this.getBankStatement()
    },

    handleSelectMonth (value) {
      this.params.period = moment(value).format('YYYY-MM')
      this.selectedMonth = moment(value).format('YYYY-MM')
      this.getBankStatement()
    },

    handleSelectYear (value) {
      this.params.period = moment(value).format('YYYY')
      this.selectedMonth = moment(value).format('YYYY')
      this.getBankStatement()
    },

    deleteStatement(row){
      this.dialogDelete = true
      this.deleteData = row
    },

    cancelDeleteDialog() {
      this.dialogDelete = false
      this.deleteData = {}
    },

    removeStatement(){
      this.loadingDelete = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let id = this.deleteData.id

      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/bank/statement/' + id),
        headers: headers
      }).then(response => {
        if (response.data.status === 200){
          let removeIndex = [];

          this.dataStatement.map((el, index) => {
            if (el.id === id){
              removeIndex.push(index);
            }
          })

          for (var i = removeIndex.length -1; i >= 0; i--) 
            this.dataStatement.splice(removeIndex[i], 1);

          this.$message({
            message: 'Success',
            type: 'success'
          })
        } else {
           this.$message({
            message: '',
            type: 'success'
          })
        }
        this.dialogDelete = false
        this.loadingDelete = false
        this.deleteData = {}
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
        this.loadingDelete = false
      })
    },

    downloadTemplate () {
      // window.open(baseApi(this.selectedStore.url_id, this.langId,  'account/transaction/template.csv'))
      this.loadingTemplate = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId,  'account/bank/template'),
        headers: headers,
        responseType: 'blob',
      }).then(response => {
        const fileName = 'templateImportBankStatement.csv'
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        this.loadingTemplate = false
        }).catch((error, xhr) => {
          this.loadingTemplate = false

        })
    },

    handleUploadImportProgress() {
      this.loadingUploadImport = true
    },

    handleUploadImportSuccess(response) {
      this.loadingUploadImport = false
      if (response.error === 0) {
        if (response.unready_import !== 0 && this.importAccount !== null && this.importCurrency !== null) {
          this.btnProsesImport = true
        } else {
          this.btnProsesImport = false
        }
        this.dropdownFormImport = false
        this.tableImportJurnal = response.data
        // this.totalRow = response.row
        this.errorImport = response.unready_import
        this.tableImport = true
        this.fileImportConfirm = response.file_confirmed
      }else{
        if (this.tableImportJurnal.length !== 0 && this.importAccount !== null && this.importCurrency !== null) {
          this.btnProsesImport = true
        } else {
          this.btnProsesImport = false
        }
      }
    },

    handleUploadImportError(error, file) {
      const errorJson = JSON.parse(error.message)
      this.loadingUploadImport = false
      this.$notify({
        type: 'error',
        title: errorJson.error.message,
        message: errorJson.error.error
      })
    },

    cancelImport() {
      this.tableImportJurnal = []
      this.fileImportConfirm = ''
      this.dropdownFormImport = true
      this.tableImport = false
      this.dialogImport = false
    },

    saveImportData() {
      this.isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/bank/confirmcsv/'+this.importAccount+'/'+this.importCurrency+'?file_confirmed=' + this.fileImportConfirm),
        headers: headers
      })
        .then(response => {

          var account = {} 
          this.dataAccount.forEach((item, index) => {
            if(item.account_no === this.importAccount){
              account = item
            }
          });
          
          this.tableImportJurnal.forEach((item, index) => {
            let data = {
              account_name: account.account_name,
              account_no: account.account_no,
              balance: item.saldo,
              currency_id: this.importCurrency,
              date: item.date,
              description: item.description,
              fbalance: this.importCurrency + " " + this.formatPrice(item.saldo),
              fdate: item.date,
              fmutation: this.importCurrency + " " + this.formatPrice(item.mutation),
              ftype: item.type,
              id: null,
              mutation: item.mutation,
              type: item.type === 'C' ? 'cr' : 'db'
            }
            this.dataStatement.unshift(data)
          })

          this.isLoading = false
          this.cancelImport()
          this.dialogImport = false

          this.$message({
            title: 'Success',
            message: response.data.message + ' ' + lang.transactions + '.'
          })
          
          this.refreshView(this.selectedStore, true)
        })
        .catch((error, xhr) => {
          this.isLoading = false
        })
    },

    tableRowClassName({row, rowIndex, props}) {
      if (row.error !== null) {
        return 'warning-row'
      }
      return ''
    },

    indexMethod(index) {
      return index + 1
    },

  }
}
</script>
