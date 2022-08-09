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
					<div class="col-xs-4 col-lg-2 col-md-2 col-sm-2 text-left">
						<el-button
							type="info"
							@click="dialogFilter = true"
							class="button-filter">
							<i class="fa fa-filter"></i>
							{{ $lang[langId].filter }}
						</el-button>

					</div>
					<div class="visible-lg visible-md col-lg-10 col-md-10 text-center" >
						<single-month-picker
							v-model="selectedMonth" :clearable="false" @input="handleSelectMonth"
						/>
					</div>
					<!-- <div class="col-xs-8 col-sm-8 col-lg-4 col-md-4">
						<div class="text-right">
							<el-dropdown>
								<el-button type="success">
									{{lang.add + '  Jurnal'}}<i class="el-icon-arrow-down el-icon--right"></i>
								</el-button>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item style="padding: 0px">
										<el-button type="text" class="accounting-dropBtn" @click="toSingleJurnal">
											<svg-icon icon-class="playlist"></svg-icon>
											{{$lang[langId].jurnal_single_form}}
										</el-button>
									</el-dropdown-item>
									<el-dropdown-item style="padding: 0px">
										<el-button type="text" class="accounting-dropBtn" @click="toAddMultiJurnal">
											<svg-icon icon-class="insert"></svg-icon>
											{{$lang[langId].jurnal_multi_form}}
										</el-button></el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</div>
					</div> -->
				</div>

				<div v-if="newJurnal.length !== 0" style="margin-top: 24px">
					<div class="box collapsed-box" style="width: 100%; background: #F5F5F5">
						<div class="box-header with-border">
							<h3 class="box-title" style="color: #67C23A">{{$lang[langId].new_added}} ({{newJurnal.length}})</h3>
							<div class="box-tools pull-right">
								<div class="row">
									<div class="col-lg-6" style="padding-right: 0px" v-if="isCollapse === true">
										<button type="button" class="btn btn-box-tool" @click="clearJurnal">
											<i class="fa fa-check" style="color: #67C23A"></i>
										</button>
									</div>
									<div class="col-lg-6" style="padding-left: 0px">
										<button type="button" class="btn btn-box-tool" data-widget="collapse" @click="collapse">
											<i v-if="isCollapse === true" class="fa fa-chevron-up"></i>
											<i v-if="isCollapse === false" class="fa fa-chevron-down"></i>
										</button>
									</div>
								</div>
							</div>
						</div>
						<div class="box-body create-product" style="background: #FFFFFF; padding: 0px;">
							<el-table
								ref="multipleTable"
								class="product-table-max-height mobile-fix-height-unset"
								:data="newJurnal"
								stripe>
								<el-table-column
									prop="transaction_no"
									:label="lang.transaction_no"
									sortable
									width="180">
								</el-table-column>
								<el-table-column
									prop="fdate"
									:label="lang.date"
									width="100">
								</el-table-column>
								<el-table-column
									prop="account_no"
									:label="$lang[langId].account_number"
									sortable>
								</el-table-column>
								<el-table-column
									prop="account_name"
									:label="$lang[langId].account_name"
									sortable>
									<template slot-scope="scope">
										<span>{{ capitalize(scope.row.account_name) }}</span>
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
									prop="famount"
									:label="lang.amount">
									<template slot-scope="scope">
										<div v-if="scope.row.type == 'Debit'">{{ scope.row.famount }}</div>
										<div v-else style="color: #F44336;">{{ scope.row.famount }}</div>
									</template>
								</el-table-column>
								<el-table-column
									prop="type"
									:label="lang.type"
									width="70">
								</el-table-column>
								<el-table-column
									prop="action">
									<template slot-scope="scope">
										<div style="float: right">
											<el-button type="text" style="margin-right: 16px" @click="editJurnal(scope.$index, scope.row)">{{lang.edit}}</el-button>
											<el-button type="text" style="color: #F44336;" @click="showDeleteDialog(scope.row)">{{lang.remove}}</el-button>
										</div>
									</template>
								</el-table-column>
							</el-table>
						</div>
					</div>
				</div>

				<div style="margin-top: 24px">
					<div v-if="isLoading === false">
						<el-table
							ref="multipleTable"
							v-loading="isLoading"
							class="product-table-max-height mobile-fix-height-unset"
							:data="tableData1"
							@sort-change="changeSortTable"
							stripe>
							<el-table-column
								prop="account_no"
								:label="$lang[langId].account_number"
								sortable
								width="130">
							</el-table-column>
							<el-table-column
								prop="account_name"
								:label="$lang[langId].account_name"
								sortable>
								<template slot-scope="scope">
									<span>{{ capitalize(scope.row.account_name) }}</span>
								</template>
							</el-table-column>
							<el-table-column
								:label="lang.classification"
								sortable
								prop="account_clasification">
								<template slot-scope="scope">
									<span>{{capitalize(scope.row.account_clasification)}}</span>
								</template>
							</el-table-column>
							<el-table-column
								prop="amount"
								:label="$lang[langId].balance_value"
								sortable
								align="right"
								width="160">
								<template slot-scope="scope">
									<div v-if="scope.row.famount !== null">
										<router-link :to="{ name:'Cash & Bank - Detail', params: {row: {year: scope.row.year, month: scope.row.month, account_no: scope.row.account_no, account_name: scope.row.account_name},
											lastParams: param, lastFilter: filter, monthLabel: selectedMonth}}">  
											<el-popover
												placement="left"
												:title="capitalize(scope.row.account_name)"
												width="210"
												trigger="hover"
												:content="$lang[langId].general_ledger_click_message">
													<span slot="reference">{{scope.row.famount}}</span>
											</el-popover>
										</router-link>
									</div>
									<div v-else>{{selectedStore.currency_id}} 0</div>
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
              v-model="selectedMonth" :clearable="false" @input="handleSelectMonth"
            />
        </el-form-item>
        <el-form-item :label="lang.search" :label-width="formLabelWidth">
          <el-input
            v-model="param.search"
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
            style="height: 36px;">
          </money>
        </el-form-item>
        <el-form-item :label="$lang[langId].flow_of_funds" :label-width="formLabelWidth">
          <el-switch @change="updateParamTrx($event)"
            :inactive-value="false"
            :active-value="true"
            v-model="filter.transaction"
            ></el-switch>
            <span v-if="filter.transaction === false">{{ lang.all }} {{lang.account}}</span>
            <span v-else-if="filter.transaction === true">{{ $lang[langId].value_not0 }}</span>
            <span v-else>{{ lang.all }} {{lang.account}}</span>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleFilter">{{ $lang[langId].filter }}</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogEditJurnal"
      :show-close="false"
      width="40%"
      custom-class="dialog-card">
      <div slot="title" class="flex-container" style="text-align: center">
        <el-row :gutter="20"  style="width: 100%">
          <el-col :span="14">
            <h4 class="dialog-title" style="padding-left: 5%; text-align: left;">{{ lang.edit }} Jurnal</h4>
          </el-col>
          <el-col :span="10">
            <div class="btn_accounting_dialog">
              <el-button type="info" @click="cancelJurnal">{{ lang.cancel }}</el-button>
              <el-button type="success" @click="handleUpdateJurnal">{{ lang.update }}</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <div style="width: 100%; padding: 0 5% 0 5%;">
        <el-form @submit.native.prevent >
          <div>
              <label style="font-size: 12px">{{ lang.name }} Jurnal</label>
          </div>
          <el-form-item>
            <el-select id="jurnalName" v-model="formEditJurnal.jurnal_name" style="width: 100%" 
              :placeholder="$lang[langId].select + ' ' + lang.name + ' Jurnal'"
              filterable :disabled="isDisabledJurnalName">
              <el-option
                v-for="jurnal in dataJurnalName"
                :key="jurnal.jurnal_name"
                :label="capitalize(jurnal.jurnal_name)"
                :value="jurnal.jurnal_name">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-8 text-left">
                {{capitalize(jurnal.jurnal_name)}}
                </div> 
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-4 text-right">
                  <el-button size="mini" type="danger" class="btn-plain" v-if="jurnal.remove_able === 1"
                    :disabled="disabledButton"
                    @click="removeJurnalName(jurnal.id)" icon="el-icon-delete">
                  </el-button>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
          <div>
            <label style="font-size: 12px">{{ lang.date }}</label>
          </div>
          <el-form-item>
            <el-date-picker 
              v-model="formEditJurnal.date"
              type="date" 
              :placeholder="$lang[langId].pick_a_day" 
              format="dd MMMM yyyy" 
              value-format="yyyy-MM-dd"
              style="width: 100%">
            </el-date-picker>
          </el-form-item>
          <div>
            <label style="font-size: 12px">{{ $lang[langId].debit_account }}</label>
          </div>
          <el-form-item>
            <el-select v-model="formEditJurnal.debit_account" filterable :placeholder="$lang[langId].select + ' ' + $lang[langId].debit_account" style="width: 100%">
              <el-option
                v-for="item in dataDebit"
                :key="item.account_no"
                :label="item.account_no + ' ' + capitalize(item.account_name)"
                :value="item.account_no">
              </el-option>
            </el-select>
          </el-form-item>
          <div>
            <label style="font-size: 12px">{{ $lang[langId].credit_account }}</label>
          </div>
          <el-form-item>
            <el-select v-model="formEditJurnal.credit_account" filterable :placeholder="$lang[langId].select + ' ' + $lang[langId].credit_account" style="width: 100%">
              <el-option
                v-for="item in dataCredit"
                :key="item.account_no"
                :label="item.account_no + ' '+ capitalize(item.account_name)"
                :value="item.account_no">
              </el-option>
            </el-select>
          </el-form-item>
          <div>
            <label style="font-size: 12px">{{ lang.notes }}</label>
          </div>
          <el-form-item>
            <el-input v-model="formEditJurnal.jurnal_description" type="textarea" :rows="2" style="width: 100%"></el-input>
          </el-form-item>
          <div>
            <label style="font-size: 12px">{{ lang.amount }}</label>
          </div>
          <el-form-item>
            <input-money-select-currency :withSelectCurrency="false" :prepend="selectedStore.currency_id"
              v-model="formEditJurnal.amount"
            />
          </el-form-item>
          <div>
            <label style="font-size: 12px">{{ $lang[langId].document_number }}</label>
          </div>
          <el-form-item>
            <el-input v-model="formEditJurnal.external_no" type="text" style="width: 100%"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <el-dialog 
      :title="lang.notif_warn" 
      :visible.sync="dialogDeleteJurnal" 
      width="50%" center 
      :close-on-click-modal="false" 
      :show-close="false">
      <div class="text-center">
        <p>{{ $lang[langId].are_you_want_remove }} {{ lang.transactions }} Jurnal</p>
        <p style="font-weight: bold;">{{ deleteData.transaction_no }}
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDeleteDialog">{{ lang.cancel }}</el-button>
        <el-button type="danger" @click="handleRemoveJurnal">{{ lang.remove }}</el-button>
      </span>
    </el-dialog>

    <dialog-add-jurnal ref="addSingleJurnal"
      :show="dialogAddJurnal"
      @close="handleCloseJurnal"
    />
  </div>
</template>


<script>
import { baseApi } from 'src/http-common';
import SingleMonthPicker from 'components/modules/SingleMonthPicker';
import SingleYearPicker from 'components/modules/SingleYearPicker';
import DialogAddJurnal from 'components/modules/_views/accounting/DialogAddSinggleJurnal';
import mixinAccounting from '@/mixins/mixinAccounting';
import InputMoneySelectCurrency from '@/components/InputMoneyV3';
import axios from 'axios';
import Loading from 'vue-loading-overlay';
import dialogSetup from 'components/modules/_views/accounting/dialogSetup'
var moment = require('moment')

export default {
  name: 'ChartOfAccount',
  components: {
    SingleMonthPicker,
    SingleYearPicker,
    Loading,
    DialogAddJurnal,
		dialogSetup,
    InputMoneySelectCurrency
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
    }
  },
  // watch: {
  //   '$store.getters.selectedStore': function () {
  //     this.getTest()
  //   }
  // },

  mounted() {
    this.accountSetup()
    this.getLastParams()
    this.getDebit()
    this.getCredit()
    this.getJurnalName()
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
      formLabelWidth: '108px',
      filter: {
        amount: 0,
        transaction: false
      },
      selectedMonth: moment().format('yyyy-MM'),
      disabledButton: false,
      createJurnalName: false,
      isLoading: false,
      dataDebit: [],
      dataCredit: [],
      dataDetail: [],
      dataJurnalName: [],
      tableData1: [],
      isCollapse: false,
      isDisabledJurnalName: false,
      dialogDetail: false,
      dialogAdd: false,
      dialogAddJurnal: false,
      dialogEditJurnal: false,
      dialogDeleteJurnal: false,
      dialogFilter: false,
      formEditJurnal: {
        transaction_id: '',
        transaction_no: '',
        date: '',
        debit_account: '',
        credit_account: '',
        jurnal_name: '',
        jurnal_description: '',
        currency_id: '',
        amount: 0,
        external_no: ''
      },
      deleteData: {},
      newJurnalName: '', 
      newJurnal: [],
      param: {
        year: moment().format('YYYY'),
        month: moment().format('M'),
        search_column: [],
        search_text: [],
        sort_column: 'account_no',
        sort_type: 'asc',
      },
      temp: {
        date: '',
        debit_account: '',
        credit_account: '',
        jurnal_name: '',
        jurnal_description: '',
        currency_id: '',
        amount: 0,
        external_no: '',
        reference_no: ''
      }
    }
  },

  methods: {
    handleSelectMonth (value) {
      this.param.year = moment(value).format('yyyy')
      this.param.month = moment(value).format('MM')
      this.selectedMonth = moment(value).format('yyyy-MM')
      this.getCashBank()
    },

    handleFilter(label) {
      this.dialogFilter = false
      if(this.filter.amount !== 0){
        if(this.param.search_column.includes('int_amount') === false){
          this.param.search_column.push('int_amount')
          this.param.search_text.push(this.filter.amount)
        }else{
          this.param.search_column.map((i, idx) => {
            if (i === 'int_amount') {
              this.param.search_column.splice(idx, 1)
              this.param.search_text.splice(idx, 1)
            }
          })
        }
      }else if(this.filter.amount === 0){
        this.param.search_column.map((i, idx) => {
          if (i === 'int_amount') {
            this.param.search_column.splice(idx, 1)
            this.param.search_text.splice(idx, 1)
          }
        })
      }
      this.getCashBank()
    },

    updateParamTrx(event){
      let exist = 'transaction' in this.param
      if(event === false && exist === true){
        delete this.param.transaction;
      }

      if(event === true && exist === false){
        this.param.transaction = 'true';
      }
    },

    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      if (val.order === null) val.order = this.param.sort_type

      this.param.sort_type = val.order
      this.param.sort_column = val.prop
      this.getCashBank()
    },

    toSingleJurnal(){
      this.$refs.addSingleJurnal.getAccount()
      this.$refs.addSingleJurnal.getJurnalName()
      this.$refs.addSingleJurnal.getCurrency()
      this.$refs.addSingleJurnal.getExpenses()
      this.$refs.addSingleJurnal.getDebit()
      this.dialogAddJurnal = true
    },

    toAddMultiJurnal () {
      this.$router.push({name: 'Add Multi Jurnal',
        params: {fromPage: 'Cash & Bank', lastParams: this.param, monthLabel: this.selectedMonth}
      })
    },
    
    getLastParams() {
      if(Object.keys(this.$route.params).includes('lastParams') === true ){
        this.param = {
          year: this.$route.params.lastParams.year,
          month: this.$route.params.lastParams.month,
          search_column: this.$route.params.lastParams.search_column,
          search_text: this.$route.params.lastParams.search_text,
          sort_column: this.$route.params.lastParams.sort_column,
          sort_type: this.$route.params.lastParams.sort_type,
        }
      }
      
      this.selectedMonth = Object.keys(this.$route.params).includes('monthLabel') === true ? this.$route.params.monthLabel : moment().format('yyyy-MM')
      this.getCashBank()
    },

    getCashBank() {
      this.isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let allJurnal = this.newJurnal

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/cashbank'),
        headers: headers,
        params: this.param
      })
      .then(response => {
          this.tableData1 = response.data.data
          this.newJurnal = allJurnal
          this.isLoading = false
        })
        .catch(error => {
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
          this.newJurnal = allJurnal
          this.isloading = false
        })
    },
    
    getDebit () {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/name/withoutpayble'),
        headers: headers
      }).then(response => {
        this.dataDebit = response.data.data
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

    getCredit () {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/name/withoutreceivable'),
        headers: headers
      }).then(response => {
        this.dataCredit = response.data.data
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
    
    
    getJurnalName () {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/jurnalname'),
        headers: headers
      }).then(response => {
        this.dataJurnalName = response.data.data
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
    
    handleUpdateJurnal () {
      this.isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let data = {
        date: this.formEditJurnal.date,
        debit_account: this.formEditJurnal.debit_account,
        credit_account: this.formEditJurnal.credit_account,
        jurnal_name: this.formEditJurnal.jurnal_name,
        jurnal_description: this.formEditJurnal.jurnal_description,
        currency_id: this.selectedStore.currency_id,
        amount: this.formEditJurnal.amount,
        external_no: this.formEditJurnal.external_no
      }
      let allJurnal = this.newJurnal
      let removeIndex = []

      let id = this.formEditJurnal.transaction_id
      let no = this.formEditJurnal.transaction_no 

      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/jurnal/'+ id + '/' + no),
        headers: headers,
        data
      }).then(response => {
        if (response.data.status === 200){
          let update = response.data.data

          allJurnal.forEach((el, index) => {
            if (el.transaction_no === no){
              removeIndex.push(index);
            }
          })

          for (var i = removeIndex.length -1; i >= 0; i--) 
                allJurnal.splice(removeIndex[i], 1);
          
          update.forEach((up, index) => {
            allJurnal.push(up);
          })

          this.newJurnal = allJurnal
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
        this.dialogEditJurnal = false
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
    
    handleRemoveJurnal () {
      this.isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let allJurnal = this.newJurnal
      let id = this.deleteData.transaction_id
      let no = this.deleteData.transaction_no
      let removeIndex = []

      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/jurnal/' + id + '/' + no),
        headers: headers,
      }).then(response => {
        this.loading = false
        if (response.data.status === 200){
   
          allJurnal.forEach((el, index) => {
            if (el.transaction_no === no){
              removeIndex.push(index);
            }
          })

          for (var i = removeIndex.length -1; i >= 0; i--) 
            allJurnal.splice(removeIndex[i], 1); 
  
          this.newJurnal = allJurnal
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
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.dialogDeleteJurnal = false
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
    
    showDeleteDialog(row) {
      this.deleteData = row
      this.dialogDeleteJurnal = true
    },
    
    cancelDeleteDialog() {
      this.dialogDeleteJurnal = false
      this.deleteData = {}
    },
    
    editJurnal(index, row) {
      this.dialogEditJurnal = true

      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/jurnal/' + row.transaction_id + '/' + row.transaction_no),
        headers: headers,
      }).then(response => {
        this.formEditJurnal = response.data.data
        this.dialogEditJurnal = true
      }).catch(error => {
        this.dialogEditJurnal = false
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
    
    cancelJurnal() {
      this.formEditJurnal = {
        transaction_id: '',
        transaction_no: '',
        date: '',
        debit_account: '',
        credit_account: '',
        jurnal_name: '',
        jurnal_description: '',
        currency_id: '',
        amount: 0,
        external_no: ''
      },
      this.dialogEditJurnal = false
    },
    
    removeJurnalName (id) {
      this.disabledButton = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/jurnalname/' + id),
        headers: headers
      }).then(response => {
        document.getElementById('jurnalName').value = '';
        this.disabledButton = false
        this.getJurnalName()
        this.$message({
          type: 'success',
          message: response.data.data.message
        })
        this.toSingleJurnal()
      }).catch(error => {
        this.disabledButton = false
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
    
    handleCloseJurnal () {
      this.dialogAddJurnal = false
      this.getCashBank()
    },

    clearJurnal (){
      this.newJurnal = []
      this.formEditJurnal = {
        id: '',
        date: '',
        debit_account: '',
        credit_account: '',
        jurnal_name: '',
        jurnal_description: '',
        currency_id: '',
        amount: 0,
        external_no: ''
      }
      this.getCashBank();
    },

    collapse(){
      let collapse = this.isCollapse
      this.isCollapse = collapse === false ? true : false;
    },
    
    onClose (e) {
      e.wait = true
      setTimeout(() => {
          e.close = true
      }, 3000)
    }
  }
}
</script>

<style lang="scss">

.mobile-margin-xs { 
  margin-top: 7px;
}


</style>
