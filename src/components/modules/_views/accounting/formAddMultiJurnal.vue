<template>
  <div>
    <div class="content-wrapper">
      <section class="content-accounting">
        <div v-if="isSetup === 'false'" >
          <el-card class="box-card" shadow="never">
            <div class="div-nodata-accounting">
              <div>
                <img src="../../../../../static/img/no-close-date.svg" class="image" style="margin-top: 32px">
                <div class="no_close" >{{$lang[langId].setup_message}}</div>
                <el-button class="btn-set" @click="dialogSetup = true">{{$lang[langId].set_up_now}}</el-button>
              </div>
            </div>
          </el-card>
        </div>

        <div v-else-if="isSetup === 'true'" >
          <el-card class="box-card" shadow="never">
            <div slot="header" class="table-handler-flex">
              <h3 class="box-title" style="flex-grow: 1;">
                Form Multi Jurnal
              </h3>

              <div>
                <div class="btn_save_dialog" v-if="tempBalance.account_no === 0">
                  <el-button type="info" @click="closeAddAccount">{{ lang.cancel }}</el-button>
                  <el-button :disabled="loadingAddAccount" type="success" @click="saveAccount">{{ lang.save }} {{lang.account}}</el-button>
                </div>
                <div class="btn_save_dialog" v-else>
                  <el-button type="info" @click="handleCloseJurnalBalance">{{ lang.cancel }}</el-button>
                  <el-button type="success" @click="handleSaveJurnalBalance" :disabled="isDisabledJurnalName || loadingAddJurnal">{{ lang.save }}</el-button>
                </div>
              </div>
            </div>
            <div class="box-body">
              <el-form @submit.native.prevent>
                <div>
                  <label style="font-size: 12px">{{ lang.name }} Jurnal <span style="color: #F44336">*</span></label>
                </div>
                <el-form-item >
                  <div class="col-lg-9 col-md-8 col-sm-8 col-xs-8" style="padding: 0px">
                    <el-select id="jurnalName" v-model="tempBalance.jurnal_id" style="width: 100%" 
                      :placeholder="$lang[langId].select + ' ' + lang.name + ' Jurnal'"
                      filterable :disabled="isDisabledJurnalName || dataBalance.length !== 0">
                      <el-option
                        v-for="item in dataJurnalName"
                        :key="item.id"
                        :label="capitalize(item.jurnal_name)"
                        :value="item.id">
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-8 text-left">
                        {{capitalize(item.jurnal_name)}}
                        </div> 
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-4 text-right">
                          <el-button type="danger" class="btn-plain" size="mini" v-if="item.remove_able === 1"
                            :disabled="disabledButton"
                            @click="removeJurnalName(item.id)" icon="el-icon-delete">
                          </el-button>
                        </div>
                      </el-option>
                    </el-select>
                  </div>
                  <div class="col-lg-3 col-md-4 col-sm-4 col-xs-4 text-right" style="padding-right: 0px">
                    <div class="visible-lg visible-md visible-sm">
                      <el-button class="add-button" type="primary" @click="addJurnalName" :disabled="isDisabledJurnalName" icon="el-icon-plus">
                        {{ lang.add }} {{lang.name}}
                      </el-button>
                    </div>
                    <div class="visible-xs">
                      <el-button class="add-button" type="primary" @click="addJurnalName" :disabled="isDisabledJurnalName" icon="el-icon-plus"></el-button>
                    </div>
                  </div>
                </el-form-item>

                <div v-if="createJurnalName" style="width: 100%;">
                  <div>
                    <label style="font-size: 12px">{{ lang.name }} Jurnal {{ lang.new }}</label>
                  </div>
                  <el-form-item>
                    <div class="col-lg-9 col-md-8 col-sm-8 col-xs-8" style="padding: 0px">
                      <el-input v-model="newJurnalName" placeholder="Jurnal"></el-input>
                    </div>
                    <div class="col-lg-3 col-md-4 col-sm-4 col-xs-4 text-right" style="padding-right: 0px">
                      <div class="visible-lg visible-md visible-sm">
                        <el-button @click="cancelJurnalName" class="info">{{ lang.cancel }}</el-button>
                        <el-button :disabled="loadingAddJurnalName" @click="handleSaveJurnalName" type="success">{{ lang.save }}</el-button> 
                      </div>
                      <div class="visible-xs">
                        <el-dropdown trigger="click">
                          <el-button type="info" icon="el-icon-more" class="add-button"></el-button>
                          <el-dropdown-menu slot="dropdown" style="background-color: #F2F2F2;">
                            <el-dropdown-item style="padding: 0px">
                              <el-button type="text" class="accounting-dropBtn" style="color: #FF0000" @click="cancelJurnalName">
                                <svg-icon icon-class="x" stroke="#FF0000"></svg-icon>
                                {{ lang.cancel }}
                              </el-button>
                            </el-dropdown-item>
                            <el-dropdown-item style="padding: 0px">
                              <el-button :disabled="loadingAddJurnalName" type="text" class="accounting-dropBtn" style="color: #67C23A" @click="handleSaveJurnalName">
                                <svg-icon icon-class="save" stroke="#67C23A"></svg-icon>
                                {{ lang.save }}
                              </el-button>
                            </el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </div>
                    </div>
                  </el-form-item>
                </div>

                <div>
                  <label style="font-size: 12px">{{ lang.date }} <span style="color: #F44336">*</span></label>
                </div>
                <el-form-item>
                  <div class="col-lg-9 col-md-8 col-sm-8 col-xs-8" style="padding: 0px">
                    <el-date-picker 
                      :disabled="dataBalance.length !== 0"
                      v-model="tempBalance.date"
                      type="date" 
                      :placeholder="this.$lang[langId].pick_a_day" 
                      format="dd MMMM yyyy" 
                      value-format="yyyy-MM-dd"
                      style="width: 100%">
                    </el-date-picker>
                  </div>
                </el-form-item>
                <div>
                  <label style="font-size: 12px">{{ $lang[langId].account_name }} <span style="color: #F44336">*</span></label>
                </div>
                <el-form-item>
                  <div class="col-lg-9 col-md-8 col-sm-8 col-xs-8" style="padding: 0px">
                    <el-select 
                      style="width: 100%" 
                      filterable 
                      :placeholder="$lang[langId].select + ' ' + lang.account"
                      :value="tempBalance.account_no"
                      v-model="tempBalance.account_no"
                      @input="(value) => selectAccountBalance(value)">
                      <el-option
                        v-for="item in dataAccount"
                        :key="item.account_no"
                        :label="item.account_no + ' '+ capitalize(item.account_name)"
                        :value="item.account_no"
                        >
                      </el-option>
                    </el-select>
                  </div>
                </el-form-item>
                <el-form-item>
                  <el-radio-group v-model="tempBalance.currency_id" @change="changeCurrency" size="small">
                    <el-radio v-for="(item, currencyIdx) in dataCurrency"
                      :key="currencyIdx" border
                      :label="item.currency_id">
                      {{item.currency_id}}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>

              </el-form>
            </div>
              <el-table
                ref="multipleTable"
                class="accounting-table"
                :data="dataBalance"
                :summary-method="getSummaries"
                show-summary
                stripe>
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <p v-if="props.row.account_group === 7 || props.row.account_group === 14">{{lang.supplier}} : {{ capitalize(props.row.supplier_name) }}</p>
                    <p v-if="props.row.account_group === 4">{{lang.customer}} : {{ capitalize(props.row.customer_name) }}</p>
                    <p v-if="props.row.account_group === 4 || props.row.account_group === 7 || props.row.account_group === 14">{{lang.due_date}} : {{ dateFormat(props.row.due_dates) }}</p>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="$lang[langId].account_name"
                  prop="account_no">
                  <template slot-scope="scope">
                    <span>{{ scope.row.account_no +' '+ capitalize(scope.row.account_name) }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="lang.description"
                  prop="jurnal_description">
                  <template slot-scope="scope">
                    <span>{{capitalize(scope.row.jurnal_description)}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="$lang[langId].document_number"
                  prop="external_no">
                  <template slot-scope="scope">
                    <span>{{scope.row.external_no}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="amount_debit"
                  :label="$lang[langId].amount_debit"
                  sortable
                  align="right"
                  width="160">
                  <template slot-scope="scope">
                    <div v-if="scope.row.type === 'db'">
                      {{ scope.row.currency_id + ' ' + formatPriceDecimal(scope.row.amount_debit) }}
                    </div>
                    <div v-else>{{ scope.row.currency_id }} 0</div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="amount_credit"
                  :label="$lang[langId].amount_credit"
                  sortable
                  align="right"
                  width="160">
                  <template slot-scope="scope">
                    <div v-if="scope.row.type === 'cr'">
                      {{  scope.row.currency_id + ' ' + formatPriceDecimal(scope.row.amount_credit) }}
                    </div>
                    <div v-else>{{ scope.row.currency_id }} 0</div>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="$lang[langId].action" align="center" width="90px">
                  <template slot-scope="scope">
                    <el-button type="text" class="accounting-dropBtn" style="color: #FF0000" @click="deleteJurnal(scope.$index)">
                      <svg-icon icon-class="trash" stroke="#FF0000"></svg-icon>
                      {{ $lang[langId].delete }}
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
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

    <el-dialog :visible.sync="dialogSetAccount" :show-close="false" custom-class="dialog-card">
      <div slot="title" class="flex-container">
        <el-row :gutter="20"  style="width: 100%">
          <el-col :span="14">
            <h4 class="dialog-title" style="text-align: left;">{{ $lang[langId].detail_jurnal }}</h4>
          </el-col>
          <el-col :span="10">
            <div class="btn_accounting_dialog" align="right">
              <el-button type="info" @click="handleCancelSet">{{ lang.cancel }}</el-button>
              <el-button type="success" @click="addToBalanceJurnal">{{ $lang[langId].next }}</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-form @submit.native.prevent>
            <div>
              <label style="font-size: 12px">{{ lang.account }}</label>
            </div>
            <el-form-item style="margin-bottom: 8px;">
              <el-input v-model="tempBalance.account_name" :disabled="true" placeholder="Jurnal"></el-input>
            </el-form-item>
            <div>
              <label style="font-size: 12px">{{ lang.type }} <span style="color: #F44336">*</span></label>
            </div>
            <el-form-item style="margin-bottom: 8px;">
              <el-radio-group v-model="tempBalance.type" size="small" class="full-radio">
                <el-radio-button label="db">{{$lang[langId].debit}}</el-radio-button>
                <el-radio-button label="cr">{{$lang[langId].credit}}</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <div v-if="receivableActive">
              <label style="font-size: 12px">{{ lang.customer }} <span style="color: #F44336">*</span></label>
            </div>
            <el-form-item v-if="receivableActive" style="margin-bottom: 8px;">
              <el-select 
                style="width: 100%"  
                filterable 
                :placeholder="$lang[langId].select + ' ' + lang.customer"
                v-model="tempBalance.customer_id"
                :value="tempBalance.customer_id"
                @input="(value) => selectCustomer(value)">
                <el-option
                  v-for="item in dataCustomer"
                  :key="item.id"
                  :label="capitalize(item.name)"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <div v-if="payableActive">
              <label style="font-size: 12px">{{ lang.supplier }} <span style="color: #F44336">*</span></label>
            </div>
            <el-form-item v-if="payableActive" style="margin-bottom: 8px;">
              <el-select 
                style="width: 100%"  
                filterable 
                :placeholder="$lang[langId].select + ' ' + lang.supplier"
                v-model="tempBalance.supplier_id"
                :value="tempBalance.supplier_id"
                @input="(value) => selectSupplier(value)">
                <el-option
                  v-for="item in dataSupplier"
                  :key="item.id"
                  :label="capitalize(item.name)"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <div  v-if="receivableActive || payableActive">
              <label style="font-size: 12px">{{ lang.due_date }} <span style="color: #F44336">*</span></label>
            </div>
            <el-form-item  v-if="receivableActive || payableActive" style="margin-bottom: 8px;">
              <el-date-picker 
                v-model="tempBalance.due_dates"
                type="date" 
                :placeholder="this.$lang[langId].pick_a_day" 
                format="dd MMMM yyyy" 
                value-format="yyyy-MM-dd"
                style="width: 100%">
              </el-date-picker>
            </el-form-item>
            <div v-if="tempBalance.type === 'db'">
              <div>
                <label style="font-size: 12px">{{ lang.amount }} <span style="color: #F44336">*</span></label>
              </div>
              <el-form-item style="margin-bottom: 8px;">
                <input-money-select-currency :withSelectCurrency="false" :prepend="tempBalance.currency_id"
                  v-model="tempBalance.amount_debit"
                />
              </el-form-item>
            </div>
            <div v-else>
              <div>
                <label style="font-size: 12px">{{ lang.amount }} <span style="color: #F44336">*</span></label>
              </div>
              <el-form-item style="margin-bottom: 8px;">
                <input-money-select-currency :withSelectCurrency="false" :prepend="tempBalance.currency_id"
                  v-model="tempBalance.amount_credit"
                />
              </el-form-item>
            </div>
            <div>
              <label style="font-size: 12px">{{ lang.notes }} <span style="color: #F44336">*</span></label>
            </div>
            <el-form-item>
              <el-input v-model="tempBalance.jurnal_description" type="textarea" :rows="2"></el-input>
            </el-form-item>
            <div>
              <label style="font-size: 12px">{{ $lang[langId].document_number }}</label>
            </div>
            <el-form-item style="margin-bottom: 8px;">
              <el-input v-model="tempBalance.external_no" type="text" style="width: 100%"></el-input>
            </el-form-item>
      </el-form>
    </el-dialog>
    <dialog-asset-multi-jurnal
      :show="dialogAssetMultiJurnal"
      :dataListAsset="dataListAssetMultiJurnal"
      @close="dialogAssetMultiJurnal = false"
    />
  </div>
</template>

<script>

import axios from 'axios';
import Loading from 'vue-loading-overlay';
import {baseApi} from 'src/http-common';
import mixinAccounting from '@/mixins/mixinAccounting';
import dialogSetup from 'components/modules/_views/accounting/dialogSetup';
import DialogAssetMultiJurnal from 'components/modules/_views/accounting/DialogAssetMultiJurnal';
import InputMoneySelectCurrency from '@/components/InputMoneyV3';
var moment = require('moment')

export default {
  name: 'FormAddMultiJurnal',
  components: {
    Loading,
		dialogSetup,
    DialogAssetMultiJurnal,
    InputMoneySelectCurrency
  },
  mixins: [mixinAccounting],

  data() {
    return {
      dataListAssetMultiJurnal: [],
      loadingAddJurnalName: false,
      loadingAddJurnal: false,
      dataAccount: [],
      dataBalance: [],
      dataCustomer: [],
      dataSupplier: [],
      dataJurnalName: [],
      dataCurrency: [],
      disabledButton: false,
      balanceActive: false,
      payableActive: false,
      receivableActive: false,
      isDisabledJurnalName: false,
      dialogSetAccount: false,
      createJurnalName: false,
      isEdit: false,
      idEdit: '',
      newJurnalName: '',
      tempBalance: {
        date: moment().format('YYYY-MM-DD'),
        account_no: "",
        jurnal_id: "",
        jurnal_description: "",
        currency_id: this.$store.getters.selectedStore.currency_id,
        external_no: "",
        type: "db",
        amount_debit: 0,
        amount_credit: 0,
        supplier_id: "",
        customer_id: "",
        due_dates: "",
        account_name: "",
        supplier_name: "",
        customer_name: "",
        account_group: ""
      },
      dialogAssetMultiJurnal: false
    }
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

  mounted() {
    this.accountSetup()
    this.getAccount()
    this.getJurnalName()
    this.getCurrency()
  },

  methods: {
    getAccount () {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/name'),
        headers: headers
      }).then(response => {
        this.dataAccount = response.data.data
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

    getCurrency () {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/currency'),
        headers: headers
      }).then(response => {
        this.dataCurrency = response.data.data
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

    addJurnalName () {
      this.createJurnalName = true
      this.isDisabledJurnalName = true
      this.newJurnalName = ''
    },

    cancelJurnalName () {
      this.createJurnalName = false
      this.isDisabledJurnalName = false
      this.newJurnalName = ''
    },

    handleSaveJurnalName () {
      this.loadingAddJurnalName = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

       let data = {
        jurnal_name: this.newJurnalName,
      }

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/jurnalname'),
        headers: headers,
        data
      }).then(response => {
        this.createJurnalName = false
        this.isDisabledJurnalName = false
        this.loadingAddJurnalName = false
        this.newJurnalName = ''
        this.getJurnalName()
        this.$message({
          type: 'success',
          message: response.data.data.jurnal_name + ' ' + this.$lang[this.langId].success_add 
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
        this.loadingAddJurnalName = false
      })
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

    selectAccountBalance (val) {
      let selected = {}
      let totalDebit = 0;
      let totalCredit = 0;
    
      let curr = this.tempBalance.currency_id
      this.dataAccount.forEach((item, index) => {
        if (item.account_no === val){
          selected = item
        }
      })

      this.dataBalance.forEach((balance, idxBalance) => {
        this.dataCurrency.forEach((currency, idxCurr) => {
          if(balance.currency_id === currency.currency_id){
            totalDebit += balance.amount_debit/currency.exchange_rate
            totalCredit += balance.amount_credit/currency.exchange_rate
          }
        })
      })

      var filtered = this.dataCurrency.filter(function(event){
          return event.currency_id == curr;
      });

      if(totalCredit - totalDebit >= 0){
        this.tempBalance.type = 'db'
        this.tempBalance.amount_debit = (totalCredit - totalDebit) * filtered[0].exchange_rate
      }else{
        this.tempBalance.type = 'cr'
        this.tempBalance.amount_credit = ((totalCredit - totalDebit) * filtered[0].exchange_rate) * (-1)
      }

      this.tempBalance.account_name = selected.account_name
      this.tempBalance.account_group = selected.account_group_id
      if(selected.account_group_id === 4){
        this.payableActive = false
        this.receivableActive = true
        this.getCustomer()
      }else if(selected.account_group_id === 7 || selected.account_group_id === 14){
        this.payableActive = true
        this.receivableActive = false
        this.getSupplier()
      }else{
        this.payableActive = false
        this.receivableActive = false
        this.dataCustomer = []
        this.dataSupplier = []
      }
      if(this.tempBalance.jurnal_id !== "" || this.tempBalance.date !== ""){
        this.dialogSetAccount = true
      }else{
        this.$notify({
          tipe: 'warning',
          message: this.$lang[this.langId].data_still_empty
        })
      }
    },

    selectCustomer (val){
      let selected = {}
      this.dataCustomer.forEach((item, index) => {
        if (item.id === val){
          selected = item
        }
      })

      this.tempBalance.customer_name = selected.name
      this.tempBalance.due_dates = selected.due_date
    },

    selectSupplier (val){
      let selected = {}
      this.dataSupplier.forEach((item, index) => {
        if (item.id === val){
          selected = item
        }
      })

      this.tempBalance.supplier_name = selected.name
      this.tempBalance.due_dates = selected.due_date
    },

    getSupplier () {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/supplier'),
        headers: headers
      }).then(response => {
        this.dataSupplier = response.data.data
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

    getCustomer () {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/customer'),
        headers: headers
      }).then(response => {
        this.dataCustomer = response.data.data
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

    changeCurrency () {
      // this.dataBalance.forEach((item, index) => {
      //   item.currency_id = this.tempBalance.currency_id
      // });
    },

    addToBalanceJurnal (){
      let typeJurnal = this.tempBalance.type
      if(typeJurnal === 'db' && this.tempBalance.amount_debit === 0){
        this.$notify({
          tipe: 'warning',
          message: this.$lang[this.langId].amount_debit_required
        })
      }else if(typeJurnal === 'cr' && this.tempBalance.amount_credit === 0){
        this.$notify({
          tipe: 'warning',
          message: this.$lang[this.langId].amount_credit_required
        })
      }else{
        let debit = 0;
        let credit = 0;

        this.dataBalance.push(this.tempBalance)
        
        this.dataBalance.forEach((item, index) => {
          debit += item.amount_debit
          credit += item.amount_credit
        });

        if(this.tempBalance.type === 'db'){
          this.tempBalance.amount_credit = 0
        }

        if(this.tempBalance.type === 'cr'){
          this.tempBalance.amount_debit = 0
        }

        this.balanceActive = false
        this.payableActive = false
        this.receivableActive = false
        this.dialogSetAccount = false
        this.dataCustomer = []
        this.dataSupplier = []

        this.tempBalance = {
          date: this.tempBalance.date,
          account_no: "",
          jurnal_id: this.tempBalance.jurnal_id,
          jurnal_description: this.tempBalance.jurnal_description,
          currency_id: this.tempBalance.currency_id,
          external_no: "",
          amount_debit: 0,
          amount_credit: 0,
          supplier_id: "",
          customer_id: "",
          due_dates: "",
          type: "db",

          account_name: "",
          supplier_name: "",
          customer_name: "",
          account_group: ""
        }
      }
    },

    deleteJurnal (idx){
      this.dataBalance.splice(idx, 1);
    },

    handleSaveJurnalBalance () {
      let debit = 0;
      let credit = 0;
      // this.dataBalance.forEach((item, index) => {
      //   debit += item.amount_debit
      //   credit += item.amount_credit
      // });

      // if(debit = credit){
        this.dataBalance.forEach((item, index) => {
          delete this.dataBalance[index].account_name;
          delete this.dataBalance[index].supplier_name;
          delete this.dataBalance[index].customer_name;
          delete this.dataBalance[index].account_group;
        });

        this.loadingAddJurnal = true
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }

        axios({
          method: 'POST',
          url: baseApi(this.selectedStore.url_id, this.langId, 'account/multijurnal'),
          headers: headers,
          data: this.dataBalance
        }).then(response => {
          this.loadingAddJurnal = false
          this.balanceActive = false
          this.payableActive = false
          this.receivableActive = false
          this.tempBalance.account_no = ""
          this.tempBalance.jurnal_description = ""
          this.tempBalance.external_no = ""
          this.tempBalance.amount_debit = 0
          this.tempBalance.amount_credit = 0
          this.tempBalance.supplier_id = ""
          this.tempBalance.customer_id = ""
          this.tempBalance.due_dates = ""
          this.tempBalance.account_name = ""
          this.tempBalance.supplier_name = ""
          this.tempBalance.customer_name = ""
          this.tempBalance.account_group = ""

          this.$message({
            message: this.$lang[this.langId].success_add,
            type: 'success'
          })
          if (response.data.asset) {
            this.dataListAssetMultiJurnal = response.data.data
            this.dialogAssetMultiJurnal = true
          }
          this.dataBalance = []
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
          this.loadingAddJurnal = false
        })
      // }else{
      //   this.$notify({
      //     type: 'warning',
      //     message: this.$lang[this.langId].unbalance_jurnal
      //   })
      // }
    },

    handleCloseJurnalBalance () {
      this.cancelJurnalName()
      this.balanceActive = false
      this.payableActive = false
      this.receivableActive = false
      this.dataSupplier = []
      this.dataCustomer = []
      this.tempBalance = {
        date: moment().format('YYYY-MM-DD'),
        account_no: "",
        jurnal_id: "",
        jurnal_description: "",
        currency_id: this.tempBalance.currency_id,
        external_no: "",
        type: "",
        amount_debit: 0,
        amount_credit: 0,
        supplier_id: "",
        customer_id: "",
        due_dates: "",

        account_name: "",
        supplier_name: "",
        customer_name: "",
        account_group: ""
      }
      
      let fromPage   = this.$route.params.fromPage
      let lastParams = this.$route.params.lastParams
      let lastFilter = this.$route.params.lastFilter
      let monthLabel = this.$route.params.monthLabel
      let lastStatus = this.$route.params.lastStatus
      let typePeriod = this.$route.params.typePeriod

      this.$router.push({name: fromPage, 
        params: {
          lastParams: lastParams,
          lastFilter: lastFilter,
          monthLabel: monthLabel,
          lastStatus: lastStatus,
          typePeriod: typePeriod
        }}
      )
      // this.$emit('close')
      // this.dialogAddJurnalBalance = false
    },

    handleCancelSet (){
      this.dialogSetAccount = false
      this.balanceActive = false
      this.payableActive = false
      this.receivableActive = false
      this.dataCustomer = []
      this.dataSupplier = []

      this.tempBalance = {
        date: this.tempBalance.date,
        account_no: this.tempBalance.account_no,
        jurnal_id: this.tempBalance.jurnal_id,
        jurnal_description: "",
        currency_id: this.tempBalance.currency_id,
        external_no: "",
        amount_debit: 0,
        amount_credit: 0,
        supplier_id: "",
        customer_id: "",
        due_dates: "",
        type: this.tempBalance.type,

        account_name: this.tempBalance.account_name,
        supplier_name: "",
        customer_name: "",
        account_group: ""
      }
    },

    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      
      columns.forEach((column, index) => {
        if (index === 0 || index === 2 || index === 3) {
          sums[index] = '';
          return;
        }
        if (index === 1) {
          sums[index] = 'Total';
          return;
        }
        
        const values = [];
        this.dataCurrency.forEach(itemCurr => {
          data.map(itemData => {
            if(itemCurr.currency_id === itemData.currency_id){
              values.push(Math.round(Number(itemData[column.property])/itemCurr.exchange_rate));
            }
          })
        })

        if (!values.every(value => isNaN(value))) {

          sums[index] = 'IDR '+ this.formatPriceDecimal(values.reduce((prev, curr) => {
            const value = Number(curr);

            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }), 0);
        } else {
          sums[index] = '';
        }
      });

      return sums;
    },

  }
}
</script>
