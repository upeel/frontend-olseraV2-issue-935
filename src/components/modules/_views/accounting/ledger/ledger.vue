<template>
  <div class="px-20">
    <el-card class="box-card">
      <div class="row table-handler-flex">
        <div class="col-xs-12 col-sm-4 col-lg-3 col-md-2" style="line-height: 5;">
          <el-select style="width: 100%;" filterable :placeholder="$lang[langId].select" v-model="params.account_no" @change="getLedger">
            <el-option
              v-for="item in dataAccount"
              :key="item.account_no"
              :label="item.account_no + ' ' +item.account_name"
              :value="item.account_no">
            </el-option>
          </el-select>
        </div>
        <div class="col-xs-12 col-sm-5 col-lg-6 col-md-6" style="text-align: -webkit-center">
          <single-month-picker
            v-if="typePeriod === 'month'" v-model="params.period" :clearable="false" @input="handleSelectMonth"
            style="margin: 0px"
          />
          <single-year-picker
            v-if="typePeriod === 'year'" v-model="params.period" :clearable="false" @input="handleSelectYear"
            style="margin: 0px"
          />
          <el-radio-group class="custom-radio1" v-model="typePeriod" @change="handleChangePeriod" style="	border: groove; border-color: #409eff54; border-width: thin; width: 300px;">
            <el-radio-button label="month" style="width: 50%;">
              {{ this.lang.month }}
            </el-radio-button>
            <el-radio-button label="year" style="width: 50%;">
              {{ this.lang.year }}
            </el-radio-button>
          </el-radio-group>
        </div>
        <div class="col-xs-12 col-sm-8 col-lg-3 col-md-4 text-right" style="line-height: 5;">
          <div class="visible-lg visible-md visible-sm">
            <el-button
              @click="getPDF()">
              <span v-if="loadingPDF">
                <loading :active="true" color= '#1bb4e6' loader="dots" :width="45" :height="10" backgroundColor='#ffffff' style="text-align: center"></loading>
              </span>
              <span v-else><svg-icon type="pdf-file"></svg-icon> PDF</span>
            </el-button>
            <el-button
              @click="getExcel">
              <span v-if="loadingExcel">
                <loading :active="true" color= '#1bb4e6' loader="dots" :width="45" :height="10" backgroundColor='#ffffff' style="text-align: center"></loading>
              </span>
              <span v-else><svg-icon type="excel"></svg-icon> EXCEL</span>
            </el-button>
          </div>
          <div class="visible-xs" style="margin-top: 10px">
            <el-button
              class="col-xs-6 text-left"
              @click="getPDF()">
              <span v-if="loadingPDF">
                <loading :active="true" color= '#1bb4e6' loader="dots" :width="45" :height="10" backgroundColor='#ffffff' style="text-align: center"></loading>
              </span>
              <span v-else><svg-icon type="pdf-file"></svg-icon> PDF</span>
            </el-button>
            <el-button
              class="col-xs-6 text-right"
              @click="getExcel">
              <span v-if="loadingExcel">
                <loading :active="true" color= '#1bb4e6' loader="dots" :width="45" :height="10" backgroundColor='#ffffff' style="text-align: center"></loading>
              </span>
              <span v-else><svg-icon type="excel"></svg-icon> EXCEL</span>
            </el-button>
          </div>
        </div>
      </div>

      <div class="card-body">
        <div style="margin-top: 24px">
          <div v-if="isLoading === false">
            <div v-for="(item, idx) in dataLedger" :key="idx" style="margin-bottom: 24px;">
              <div v-if="item.children.length > 0">
                <div style="background-color: #f5f7fa; 
                  text-align: center;
                  font-weight: 800;
                  line-height: 2;
                  border-bottom: solid thin;">
                  {{item.account_no + ' - ' + item.account_name}}
                </div>
                <el-table
                  :data="item.children"
                  ref="multipleTable"
                  class="accounting-table"
                  v-loading="isLoading"
                  show-summary
                  max-height="540"
                  :summary-method="(value) => getSummaries(value, idx)"
                  :highlight-current-row="false">
                  <!-- <el-table-column align="center" :label="item.account_no + ' - ' + item.account_name"> -->
                    <el-table-column type="expand">
                      <template slot-scope="scope">
                        <el-row :gutter="20">
                          <el-col :span="12">
                            <p>{{lang.name}} : {{ capitalize(scope.row.transaction_name) }}</p>
                          </el-col>
                          <el-col :span="12">
                            <p>{{lang.description}} : {{capitalize(scope.row.transaction_description)}}</p>
                          </el-col>
                        </el-row>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="transaction_date"
                      :label="lang.date"
                      sortable>
                      <template slot-scope="scope">
                        <span>{{scope.row.ftransaction_date}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="transaction_no"
                      :label="lang.transaction_no"
                      sortable>
                      <!-- <template slot-scope="scope">
                        <span>{{scope.row.transaction_no}}</span>
                      </template> -->
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
                        <div v-show="scope.row.hasOwnProperty('other_currency') === true">
                          <el-popover
                            v-if="scope.row.other_currency === 1"
                            placement="bottom"
                            width="510"
                            trigger="click">
                            <el-table :data="currencyPopover" v-loading="loadingPopOver">
                              <el-table-column width="190" property="transaction" :label="lang.transactions">
                              </el-table-column>
                              <el-table-column width="100" align="center" property="rate" :label="$lang[langId].exchange_rate">
                              </el-table-column>
                              <el-table-column width="190" align="right" property="amount" :label="lang.amount">
                              </el-table-column>
                            </el-table>
                            <el-button @click="ledgerPopover(scope.row)" type="text" slot="reference">
                              {{scope.row.famount_akumulatif}}
                            </el-button>
                          </el-popover>
                          <span v-if="scope.row.other_currency === 0">
                            {{scope.row.famount_akumulatif}}
                          </span>
                        </div>
                        <div v-show="scope.row.hasOwnProperty('other_currency') === false">
                          {{scope.row.famount_akumulatif}}
                        </div>
                      </template>
                    </el-table-column>
                </el-table>
              </div>
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
      </div>
    </el-card>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common';
import axios from 'axios';
import Loading from 'vue-loading-overlay';
import moment from 'moment';
import SingleMonthPicker from 'components/modules/SingleMonthPicker';
import SingleYearPicker from 'components/modules/SingleYearPicker';
import mixinAccounting from '@/mixins/mixinAccounting';

export default {
  components:{
    SingleMonthPicker,
    SingleYearPicker,
    Loading
  },
  mixins: [mixinAccounting],
  data() {
    return {
      formLabelWidth: '60px',
      isLoading: false,
      loadingPDF: false,
      loadingExcel: false,
      isSetup: 'true',
      labelMonth: '',
      dataAccount: [
        {
          account_no: '',
          account_name: this.$store.state.userStores.lang.all + ' ' + this.$store.state.userStores.lang.account
        }
      ],
      dataLedger: [],
      typePeriod: 'month',
      params: {
        period: moment().format('yyyy-MM'),
        account_no: ''
        // report: 'Gain_loss',
        // start: moment().subtract(2, 'month').format('YYYYMM'),
        // end: moment().format('YYYYMM'),
      },
      dialogValidateSetup: false,
      dialogValidateReset: false,
      currencyPopover: [],
      loadingPopOver: false
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
    }
  },

  watch: {
    // selectedStore() {
    //   this.getMonth()
    // }
  },

  methods: {
    monthFilterReset(data) {
      this.filterTag = '',
      this.params ={
        report: 'balance_sheet',
        start: moment().subtract(2, 'month').format('YYYYMM'),
        end: moment().format('YYYYMM'),
        currentPage: 1,
        per_page: 15,
        page: 1,
        total: null
      }
      this.labelMonth = this.$lang[this.langId].last_3_month + '\n' +
        moment().subtract(2, 'month').format('MMM YYYY') + ' - ' +
        moment().format('MMM YYYY')
      this.monthFilterClose()
      this.getLedger()
    },

    monthFilterSave(filter) {
      this.filterTag = filter.labelForDate
      if (filter.labelForDate === 'thisYear' || filter.labelForDate === 'this2Year') {
        this.$set(this.params, 'start', filter.startDate)
        this.$set(this.params, 'end', filter.endDate)
      } else {
        this.$set(this.params, 'start', moment(filter.startDate).format('YYYYMM'))
        this.$set(this.params, 'end', moment(filter.endDate).format('YYYYMM'))
      }
      this.monthFilterClose()
      this.setLabelFilter(filter)
      this.getLedger()
    },

    setLabelFilter (filter) {
      if (filter.labelForDate === 'thisMonth') {
        this.labelMonth = this.$lang[this.langId].this_month + '\n(' +
                        moment(this.params.start).format('MMM YYYY') + ')'
      } else if (filter.labelForDate === 'monthAgo') {
        this.labelMonth = this.$lang[this.langId].last_month + '\n(' +
                        moment(this.params.start).format('MMM YYYY') + ')'
      } else if (filter.labelForDate === 'last3Month') {
        this.labelMonth = this.$lang[this.langId].last_3_month + '\n(' +
                        moment(this.params.start).format('MMM YYYY') + ' - ' +
                        moment(this.params.end).format('MMM YYYY') + ')'
      } else if (filter.labelForDate === 'last6Month') {
        this.labelMonth = this.$lang[this.langId].last_6_month + '\n(' +
                        moment(this.params.start).format('MMM YYYY') + ' - ' +
                        moment(this.params.end).format('MMM YYYY') + ')'
      } else if (filter.labelForDate === 'last12Month') {
        this.labelMonth = this.$lang[this.langId].last_12_month + '\n(' +
                        moment(this.params.start).format('MMM YYYY') + ' - ' +
                        moment(this.params.end).format('MMM YYYY') + ')'
      } else if (filter.labelForDate === 'thisYear') {
        this.labelMonth = this.$lang[this.langId].this_year + '\n(' +
                        moment(this.params.start).format('YYYY') + ')'
      } else if (filter.labelForDate === 'this2Year') {
        this.labelMonth = this.$lang[this.langId].this_2_year + '\n(' +
                        moment(this.params.start).format('YYYY') + ' - ' +
                        moment(this.params.end).format('YYYY') + ')'
      } else if (filter.labelForDate === 'custom') {
        this.labelMonth = this.$lang[this.langId].custom + '\n(' +
                        moment(this.params.start).format('MMM YYYY') + ' - ' +
                        moment(this.params.end).format('MMM YYYY') + ')'
      }
    },

    handleChangePeriod (value){
      if(value === 'month'){
        this.params.period = moment().format('yyyy-MM')
      }else{
        this.params.period = moment().format('YYYY')
      }
      this.typePeriod = value
      this.getLedger()
    },

    handleSelectMonth (value) {
      this.params.period = moment(value).format('yyyy-MM')
      this.getLedger()
    },

    handleSelectYear (value) {
      this.params.period = moment(value).format('YYYY')
      this.getLedger()
    },

    getLedger() {
      this.isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/ledger'),
        headers: headers,
        params: this.params
      }).then(response => {
        this.isLoading = false
        this.dataLedger = response.data.data

        this.dataLedger.forEach((item, index) => {
          this.dataAccount.push({
            account_no: item.account_no,
            account_name: item.account_name
          });
        })
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

    getFileMobile(type) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/ledger/' + type),
        method: 'GET',
        responseType: 'blob',
        headers,
        params: this.params
      }).then((response) => {
        const file = new Blob([response.data])
        const fileName = this.$lang[this.langId].ledger + '-' + this.params.period +  '__' + this.params.account_no + '.' + type
        const url = window.URL.createObjectURL(file)
        const apiParams = '?period=' + this.params.period +  '&account_no=' + this.params.account_no
        const apiURL = '/download/api/' + this.selectedStore.url_id + '/admin/v1/' + this.langId + '/account/ledger/' + type
        window.location = apiURL + apiParams + ',' + fileName
      }).then(error => {
        if(typeof error.response.data.error.error === 'object'){
          let errorKey = Object.keys(error.response.data.error.error)[0];
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error[errorKey][0]
          })
          this.loadingPDF = false
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

    getPDF() {
      this.loadingPDF = true
      if (this.$store.getters.webviewMode) {
        this.getFileMobile('pdf')
      } else {
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }

        axios({
          url: baseApi(this.selectedStore.url_id, this.langId, 'account/ledger/pdf'),
          method: 'GET',
          responseType: 'blob',
          headers,
          params: this.params
        }).then((response) => {
          const file = new Blob([response.data])
          const fileName = this.$lang[this.langId].ledger + '-' + this.params.period + '__' + this.params.account_no + '.pdf'
          const url = window.URL.createObjectURL(file)
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click()
          this.loadingPDF = false
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
      }
    },

    getExcel() {
      this.loadingExcel = true
      if (this.$store.getters.webviewMode) {
        this.getFileMobile('xlsx')
      } else {
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }


        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'account/ledger/excel'),
          responseType: 'blob',
          headers,
          params: this.params
        }).then(response => {
            const fileName = this.$lang[this.langId].ledger + '-' + this.params.period + '__' + this.params.account_no + '.xlsx'
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
            this.loadingExcel = false
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

    getSummaries(param, idx) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if(index === 0 || index === 1){
          sums[index] = '';
          return;
        }

        if (index === 2) {
          sums[index] = 'Total';
          return;
        }

        if(index === 3) {
          sums[index] = this.dataLedger[idx].fdebit
          return;
        }
         
        if(index === 4) {
          sums[index] = this.dataLedger[idx].fcredit
          return;
        }

        if(index === 5) {
          sums[index] = this.dataLedger[idx].famount
          return;
        }

        // const values = data.map(item => Number(item[column.property]));
        // if (!values.every(value => isNaN(value))) {
        //   sums[index] =  this.formatPrice(values.reduce((prev, curr) => {
        //     const value = Number(curr);
        //     if (!isNaN(value)) {
        //       return prev + curr;
        //     } else {
        //       return prev;
        //     }
        //   }), 0);
        // } else {
        //   sums[index] = '';
        // }
      });
      return sums;
    },

    ledgerPopover(row){
      this.loadingPopOver = true
      this.currencyPopover = []
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/othercurrency/'+row.id),
        headers: headers,
        params: this.params
      }).then(response => {
        this.loadingPopOver = false
        this.currencyPopover.push(response.data.data)
      }).catch(error => {
        this.loadingPopOver = false
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
    }

  },

  mounted() {
    this.getLedger()
  }
}
</script>
