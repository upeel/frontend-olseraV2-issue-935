<template>
  <div>
    <div class="content-wrapper">
      <section class="content-accounting">
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
              <div class="col-xs-2 col-lg-2 col-md-2 col-sm-2 text-left">
                <el-button
                  type="info"
                  @click="dialogFilter = true"
                  class="visible-lg visible-md visible-sm button-filter">
                  <i class="fa fa-filter"></i>
                  {{ $lang[langId].filter }}
                </el-button>
                <el-button
                  type="info"
                  @click="dialogFilter = true"
                  class="visible-xs button-filter"
                  size="mini">
                  <i class="fa fa-filter"></i>
                </el-button>
              </div>
              <div class="visible-lg visible-md col-lg-6 col-md-5 text-center" >
                <single-month-picker
                  v-model="selectedMonth" :clearable="false" @input="handleSelectMonth"
                />
              </div>
              <div class="col-xs-10 col-sm-10 col-lg-4 col-md-5">
                <div class="visible-lg visible-md visible-sm text-right">
									<el-button type="info" @click="showCustomDialog">
										<svg-icon icon-class="setting_ico"></svg-icon>
									</el-button>
                  <el-button type="default" @click="showAddDialog">{{lang.add}} {{lang.account}}</el-button>
                </div>
                <div class="visible-xs text-right">
									<el-button type="info" size="mini" @click="showCustomDialog">
										<svg-icon icon-class="setting_ico"></svg-icon>
									</el-button>
                  <el-button type="default" size="mini" @click="showAddDialog">{{lang.add}} {{lang.account}}</el-button>
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
                    :label="$lang[langId].account_name"
                    sortable
                    prop="account_name">
                    <template slot-scope="scope">
                      <span class="word-break">{{ capitalize(scope.row.account_name) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="lang.classification"
                    sortable
                    prop="account_clasification">
                    <template slot-scope="scope">
                      <span class="word-break">{{capitalize(scope.row.account_clasification)}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="int_amount"
                    :label="$lang[langId].balance_value"
                    sortable
                    align="right"
                    width="160">
                    <template slot-scope="scope">
											<div v-if="scope.row.famount !== null">
												<router-link :to="{ name:'Chart Of Account - Detail', params: {row: {year: scope.row.year, month: scope.row.month, account_no: scope.row.account_no, account_name: scope.row.account_name},
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
                  <el-table-column
                    :label="$lang[langId].action" align="center" width="90px">
                    <template slot-scope="scope">
                      <el-dropdown
                        v-if="scope.row.edit_able === 1 || scope.row.remove_able === 1"
                        trigger="click">
                        <el-button
                          type="text"
                          icon="el-icon-more"
                          style="color:#909399"
                        />
                        <el-dropdown-menu
                          style="background-color: #F2F2F2;"
                          slot="dropdown">
                          <el-dropdown-item style="padding: 0px">
                            <el-button type="text" class="accounting-dropBtn" style="color: #000000" v-show="scope.row.edit_able === 1" @click="editAccount(scope.row)">
                              <svg-icon icon-class="edit"></svg-icon>
                              {{ lang.edit }}
                            </el-button>
                          </el-dropdown-item>
                          <el-dropdown-item style="padding: 0px">
                            <el-button type="text" class="accounting-dropBtn" style="color: #FF0000;" v-show="scope.row.remove_able === 1" @click="showDeleteDialog(scope.row)">
                              <svg-icon icon-class="trash" stroke="#FF0000"></svg-icon>
                              {{ $lang[langId].delete }}
                            </el-button>
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
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

      </section>
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
            style="height: 32px;">
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
      :visible.sync="dialogEditAccount"
      :show-close="false"
      width="40%"
      custom-class="dialog-card">
      <div slot="title" class="flex-container" style="text-align: center">
        <el-row :gutter="20"  style="width: 100%">
          <el-col :span="12">
            <h4 class="dialog-title" style="padding-left: 5%; text-align: left;">{{ lang.edit }} {{ lang.account }}</h4>
          </el-col>
          <el-col :span="12" align="right">
            <div class="btn_accounting_dialog">
              <el-button type="info" @click="handleCloseEdit">{{ lang.back }}</el-button>
              <el-button :disabled="loadingEditAccount" type="success" @click="handleUpdateAccount">{{ lang.update }}</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <div>
        <div style="width: 100%; padding: 0 5% 0 5%;">
          <el-form @submit.native.prevent style="width: 100%">
            <div>
              <label style="font-size: 12px">{{ lang.category }}</label>
            </div>
            <el-form-item>
              <el-input v-model="paramsEdit.account_group" :disabled=true type="text"></el-input>
            </el-form-item>
            <div>
              <label style="font-size: 12px">{{ lang.name }} {{ lang.account }}</label>
            </div>
            <el-form-item>
              <el-input id="account_name" v-model="paramsEdit.account_name" type="text"></el-input>
            </el-form-item>
            <div>
              <label style="font-size: 12px">{{ $lang[langId].account_number }}</label>
            </div>
            <el-form-item>
              <el-input id="account_number" type="number" disabled v-model="paramsEdit.account_no"></el-input>
            </el-form-item>
            <div v-if="paramsEdit.depreciation_of_account !== null">
              <div>
                <label style="font-size: 12px">{{ $lang[langId].accumulation_from_account }}</label>
              </div>
              <el-form-item>
                <el-select v-model="paramsEdit.depreciation_of_account" style="width: 100%" filterable :placeholder="$lang[langId].select + ' ' + lang.account">
                  <el-option
                    v-for="item in assetAccount"
                    :key="item.account_no"
                    :label=" + item.account_no + ' '+ capitalize(item.account_name)"
                    :value="item.account_no">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
    </el-dialog>

    <el-dialog 
      :title="lang.notif_warn" 
      :visible.sync="dialogDeleteAccount" 
      width="50%" center 
      :close-on-click-modal="false" 
      :show-close="false">
      <div class="text-center">
        <p>{{ $lang[langId].are_you_want_remove }} {{ lang.account }}</p>
        <p style="font-weight: bold;">{{ deleteData.account_no + ' '+ capitalize(deleteData.account_name)}}
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDeleteDialog">{{ lang.cancel }}</el-button>
        <el-button type="danger" @click="handleRemoveAccount">{{ lang.remove }}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogAdd"
      :show-close="false"
      width="40%"
      custom-class="dialog-card">
      <div slot="title" class="flex-container">
        <el-row :gutter="20"  style="width: 100%">
          <el-col :span="12">
            <h4 class="dialog-title" style="padding-left: 5%; text-align: left;">{{ lang.add }} {{ lang.account }}</h4>
          </el-col>
          <el-col :span="12">
            <div class="btn_accounting_dialog" align="right">
              <el-button type="info" @click="handleCloseAdd">{{ lang.cancel }}</el-button>
              <el-button :disabled="loadingAddAccount" type="success" @click="handleSaveAccount">{{ lang.save }}</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <div style="width: 100%; padding: 0 5% 0 5%; margin-top: -10px;">
        <el-form @submit.native.prevent style="width: 100%">
          <div>
            <label style="font-size: 12px">{{ lang.category }}</label>
          </div>
          <el-form-item>
            <el-select v-model="tempAccount.category" filterable style="width: 100%" :placeholder="$lang[langId].select + ' ' + lang.category" @change="getSubGroupName($event)">
              <el-option
                v-for="item in dataGroup"
                :key="item.group_id"
                :label="capitalize(item.group_name)"
                :value="item.group_id">
              </el-option>
            </el-select>
          </el-form-item>
          <div v-show="dataSubGroup.length > 1">
            <label style="font-size: 12px">{{ $lang[langId].sub_category }}</label>
          </div>
          <el-form-item v-show="dataSubGroup.length > 1">
            <el-select id="sub_category" v-model="tempAccount.sub_category" filterable style="width: 100%" :placeholder="$lang[langId].select + ' ' + lang.category" @change="handleChangeCategory($event)">
              <el-option
                v-for="item in dataSubGroup"
                :key="item.id"
                :label="capitalize(item.account_group)"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <div>
            <label style="font-size: 12px">{{ lang.name }} {{ lang.account }}</label>
          </div>
          <el-form-item>
            <el-input id="account_name" v-model="tempAccount.account_name" type="text"></el-input>
          </el-form-item>
          <div>
            <label style="font-size: 12px">{{ $lang[langId].account_number }}</label>
          </div>
          <el-form-item>

            <el-tooltip v-if="tempAccount.category === 3" effect="dark" placement="bottom">
              <div slot="content"  width="350">
                <label class="font-18">{{$lang[langId].grouping_equity_number}}</label>
                <ul class="font-15">
                  <li>{{$lang[langId].for_capital_account}}</li>
                  <li>{{$lang[langId].for_prive_account}}</li>
                  <li>{{$lang[langId].for_retained_earning}}</li>
                </ul> 
              </div>
              <el-input id="account_number" type="number" v-model="tempAccount.account_number"></el-input>
            </el-tooltip>
            <el-input v-else id="account_number" type="number" v-model="tempAccount.account_number"></el-input>

          </el-form-item>
          <div v-if="accumulationDepreciation">
            <div>
              <label style="font-size: 12px">{{ $lang[langId].accumulation_from_account }}</label>
            </div>
            <el-form-item>
              <el-select v-model="tempAccount.accumulated_depreciation" style="width: 100%" filterable :placeholder="$lang[langId].select + ' ' + lang.account">
                <el-option
                  v-for="item in assetAccount"
                  :key="item.account_no"
                  :label=" + item.account_no + ' '+ capitalize(item.account_name)"
                  :value="item.account_no">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </el-dialog>

		<el-dialog
      :visible.sync="dialogCustom"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
      :show-close="false"
      width="80%"
      custom-class="dialog-card-jurnal">
      <div slot="title" class="flex-container">
        <el-row :gutter="20"  style="width: 100%">
          <el-col :span="12">
            <h4 class="dialog-title" style="padding-left: 5%; text-align: left;">{{ $lang[langId].custom }} {{ $lang[langId].initial_balance }}</h4>
          </el-col>
          <el-col :span="12">
            <div class="btn_accounting_dialog" align="right">
              <el-popconfirm
								:confirm-button-text='$lang[langId].yes'
								:cancel-button-text='$lang[langId].no'
								confirm-button-type="info"
								icon="el-icon-info"
								icon-color="#333"
								@confirm="resetCustom"
								width="260"
								:title="$lang[langId].are_you_sure+' '+$lang[langId].all_balance_0"
							>
								<el-button slot="reference" type="info" size="small" :loading="loadingResetCustom" :disabled="loadingResetCustom">Reset</el-button>
							</el-popconfirm>
              <el-button :disabled="loadingCustom" :loading="loadingCustom" size="small" type="success" @click="saveCustom">{{ lang.save }}</el-button>
							<el-button type="text" size="mini" @click="hideCustomDialog">
								<svg-icon icon-class="x" class="color-black font-24"></svg-icon>
							</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <div style="width: 100%;">
				<el-table
					ref="multipleTable"
					v-loading="loadingTableCustom"
					class="product-table-max-height mobile-fix-height-unset"
					:data="dataCustom"
					stripe>
					<el-table-column
						prop="account_no"
						:label="$lang[langId].account_number"
						sortable
						width="130">
					</el-table-column>
					<el-table-column
						:label="$lang[langId].account_name"
						sortable 
						width="300"
						prop="account_name">
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
						prop="int_amount"
						:label="$lang[langId].balance_value"
						sortable
						align="right">
						<template slot-scope="scope">
              <input-money-select-currency :withSelectCurrency="false" :prepend="selectedStore.currency_id"
                v-model="scope.row.int_amount"
              />
						</template>
					</el-table-column>
				</el-table>
      </div>
    </el-dialog>
    
  </div>
</template>


<script>
import { baseApi } from 'src/http-common';
import Loading from 'vue-loading-overlay';
import axios from 'axios';
import SingleMonthPicker from 'components/modules/SingleMonthPicker';
import SingleYearPicker from 'components/modules/SingleYearPicker';
import dialogSetup from 'components/modules/_views/accounting/dialogSetup';
import InputMoneySelectCurrency from '@/components/InputMoneyV3';
import mixinAccounting from '@/mixins/mixinAccounting';
var moment = require('moment')

export default {
  name: 'ChartOfAccount',
  components: {
    Loading,
    SingleMonthPicker,
    SingleYearPicker,
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
      dataCurrency: [],
      accumulationDepreciation: false, 
      isLoading: false,
      loadingAddAccount: false,
      loadingEditAccount: false,
			loadingCustom: false,
			loadingTableCustom: false,
			loadingResetCustom: false,
      dataGroup: [],
      dataSubGroup: [],
      dataDetail: [],
      assetAccount: [],
      tableData1: [],
			dataCustom: [],
      isCollapse: false,
      dialogDetail: false,
      dialogFilter: false,
      dialogAdd: false,
      dialogEditAccount: false,
      dialogDeleteAccount: false,
			dialogCustom: false,
      deleteData: {},
      tempAccount: {
        category: '',
        sub_category: '',
        account_name: '',
        account_number: '',
        accumulated_depreciation: ''
      },
      param: {
        search: '',
        year: moment().format('YYYY'),
        month: moment().format('M'),
        search_column: [],
        search_text: [],
        sort_column: 'account_no',
        sort_type: 'asc'
      },
      paramsEdit: {},
    }
  },

  methods: {

    tempChangeCurrency(value){

    },


    handleSelectMonth (value) {
      this.param.year = moment(value).format('yyyy')
      this.param.month = moment(value).format('MM')

      this.selectedMonth = moment(value).format('yyyy-MM')
      this.getChartAccount()
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
      this.getChartAccount()
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
      this.getChartAccount()
    },
    
    getLastParams(){
      if(Object.keys(this.$route.params).includes('lastParams') === true ){
        this.param = {
          year: this.$route.params.lastParams.year,
          month: this.$route.params.lastParams.month,
          search: this.$route.params.lastParams.search,
          search_column: this.$route.params.lastParams.search_column,
          search_text: this.$route.params.lastParams.search_text,
          sort_column: this.$route.params.lastParams.sort_column,
          sort_type: this.$route.params.lastParams.sort_type,
        }
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
      this.getChartAccount()
    },

    getChartAccount() {
      this.isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/report'),
        headers: headers,
        params: this.param
      })
      .then(response => {
					let res = response.data.data
          this.tableData1 = res

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
          this.isLoading = false
        })
    },
    
    
    getGroupName () {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method : 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/groupmain'),
        headers: headers
      }).then(response => {
        this.dataGroup = response.data.data
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

    getSubGroupName (event) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method : 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/groupmain/' + event),
        headers: headers
      }).then(response => {
        this.dataSubGroup = response.data.data
        this.tempAccount.sub_category = ''
        this.tempAccount.account_number = ''
        this.paramsEdit.account_number = ''

        if(this.dataSubGroup.length > 1){
          document.getElementById('sub_category').focus();
        }else{
          this.tempAccount.sub_category = this.dataSubGroup[0].id
          this.handleChangeCategory(this.dataSubGroup[0].id)
        }
        // document.getElementById('sub_category').value = '';
        // document.getElementById('account_number').value = '';
        
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
    
    handleRemoveAccount () {
      this.dialogDeleteAccount = false
      this.isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let allAccount = this.tableData1
      let id = this.deleteData.id
      let removeIndex = []

      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/name/' + id),
        headers: headers,
      }).then(response => {
        if (response.data.status === 200){
   
          allAccount.forEach((el, index) => {
            if (el.id === id){
              removeIndex.push(index);
            }
          })

          for (var i = removeIndex.length -1; i >= 0; i--) 
            allAccount.splice(removeIndex[i], 1); 
  
          this.tableData1 = allAccount
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
        this.dialogDeleteAccount = false
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

    showAddDialog(){
      this.getGroupName()
      this.dialogAdd = true
    },
    
    showDeleteDialog(row) {
      this.deleteData = row
      this.dialogDeleteAccount = true
    },
    
    cancelDeleteDialog() {
      this.dialogDeleteAccount = false
      this.deleteData = {}
    },
    
    handleSaveAccount () {
      this.loadingAddAccount = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let data = {
        account_name: this.tempAccount.account_name,
        account_no: this.tempAccount.account_number,
        account_group_id: this.tempAccount.sub_category,
        depreciation_of_account: this.tempAccount.accumulated_depreciation
      }

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/name'),
        headers: headers,
        data
      }).then(response => {
        this.loadingAddAccount = false
        this.accumulationDepreciation = false
        this.dialogAdd = false
        this.$message({
            message: 'Success',
            type: 'success'
          })
        this.getChartAccount()
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
        this.loadingAddAccount = false
      })
    },

    editAccount (row) {
      let headers = {
        Authorization : 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/name/' + row.id),
        headers: headers
      }).then(response => {
        let result = response.data.data
        if(result.edit_able === 'yes'){
          this.paramsEdit = result
          this.dialogEditAccount = true
          this.getAssetAccount()
        }else{
          this.paramsEdit = {}
          this.dialogEditAccount = false
          this.$notify({
            tipe: 'warning',
            title: 'Error Found',
            message: this.$lang[this.langId].standard_account_cannot_be_edited
          })
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

		showCustomDialog(){
			let show = this.dialogCustom
			if(show){
				this.dialogCustom = false
				this.getChartAccount()
			}else{
				this.dialogCustom = true
				this.getCustom()
			}
		},

		hideCustomDialog(){
			this.dialogCustom = false
			this.getChartAccount()
		},

		getCustom(){
			this.loadingTableCustom = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/begining'),
        headers: headers,
        params: this.param
      }).then(response => {
					let res = response.data.data
          this.dataCustom = res.map(v => ({...v, isEdit: false}))

          this.loadingTableCustom = false
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
				this.loadingTableCustom = false
			})
		},

		resetCustom(){
			this.loadingResetCustom = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/begining'),
        headers: headers,
        params: this.param
      }).then(response => {
				if(response.data.status === 200){
					this.$message({
						message: response.data.message,
						type: 'success'
					})
					this.getCustom()
				}
				this.loadingResetCustom = false
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
				this.loadingResetCustom = false
			})
		},

		saveCustom(){
			this.loadingCustom = true
			var editCustom = []
			this.dataCustom.map((item, index) => {
				if(item.int_amount !== parseInt(item.famount)){
					editCustom.push({account_no: item.account_no, amount: item.int_amount})
				}
			})
			let headers = {
        Authorization : 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/begining'),
        headers: headers,
				data: editCustom
      }).then(response => {
				this.$message({
					message: 'Success',
					type: 'success'
				})
				this.loadingCustom = false
				this.editCustom = []
				let res = response.data.data
				this.dataCustom = res
      }).catch(error => {
				this.loadingCustom = false
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

    handleCloseEdit () {
      this.paramsEdit = {}
      this.dialogEditAccount = false
      this.getChartAccount()
    },

    handleUpdateAccount () {
      this.loadingEditAccount = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let params = {
        account_name: this.paramsEdit.account_name,
        account_no: this.paramsEdit.account_no,
        account_group_id: this.paramsEdit.account_group_id,
        depreciation_of_account: this.paramsEdit.depreciation_of_account
      }

      let id = this.paramsEdit.id

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/name/'+id),
        headers: headers,
        params: params
      }).then(response => {
        this.dialogEditAccount = false
        this.loadingEditAccount = false
        this.paramsEdit = {}
        let result = response.data.data
        this.tableData1.map((i, idx) => {
          if (i.id === id) {
            this.tableData1[idx].account_no = result.account_no
              this.tableData1[idx].account_name = result.account_name
          }
        })
        this.$message({
          message: 'Success',
          type: 'success'
        })
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
        this.loadingEditAccount = false
      })
    },
    
    handleChangeCategory (event) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/group/'+ event),
        headers: headers
      })
      .then(response => {
        let res = response.data.data;
        this.tempAccount.account_number = res.account_suggestion
        this.paramsEdit.account_number = res.account_suggestion

        if(res.akumulation_depreciation === 'true'){
          this.getAssetAccount();
        }else{
          this.accumulationDepreciation = false
        }

        document.getElementById('account_number').value = res.account_suggestion;
        document.getElementById('account_name').focus(); 
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
      })
    },

    getAssetAccount(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/name/asset'),
        headers: headers
      })
      .then(response => {
        this.assetAccount = response.data.data
        this.accumulationDepreciation = true
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
      })
    },
    
    handleCloseAdd () {
      this.dialogAdd = false
    },

    collapse(){
      let collapse = this.isCollapse
      this.isCollapse = collapse === false ? true : false;
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

