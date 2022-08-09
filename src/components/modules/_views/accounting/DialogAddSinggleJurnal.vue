<template>
  <el-dialog
    :visible.sync="show"
    :show-close="false"
    fullscreen
    width="80%"
    custom-class="dialog-card">
    <div slot="title" class="flex-container" style="text-align: center">
      <el-row :gutter="20"  style="width: 100%">
        <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" class="visible-md visible-lg visible-sm" align="left">
          <label class="visible-lg visible-md visible-sm">(<span style="color: #F44336">*</span>) {{lang.required}}</label>
        </el-col>
        <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="8" align="center">
          <h4 class="dialog-title">Jurnal</h4>
        </el-col>
        <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="8" align="right">
          <div v-if="depreciation" class="btn_accounting_dialog">
            <el-button type="info" @click="handleSkip">{{ $lang[langId].skip_it }}</el-button>
            <el-button type="success" @click="handleSaveAsset">{{ lang.save }}</el-button>
          </div>
          <div v-else class="btn_save_dialog">
            <el-button v-if="formAdd.length === 0" id="id-close" type="info" @click="handleCloseJurnal()">{{ lang.close }}</el-button>
            <el-button v-else type="info" @click="handleCancelJurnal">{{ lang.cancel }}</el-button>
            
            <el-button type="success" @click="handleSaveJurnal" :disabled="isDisabledJurnalName">{{ lang.save }}</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-if="depreciation" class="form-add-jurnal">
      <div style="padding: 30px 15px 15px 15px;">
        <el-tag size="large"
          type="info" style="color: #606266; width: 100%;">
          <svg-icon type="information-circle" stroke="#606266" style="font-size: medium"></svg-icon>
          {{$lang[langId].depreciation_message}}
        </el-tag>
      </div>
      <div class="col-lg-12" style="padding: 0">
        <div class="col-lg-6" style="margin: auto">
          <div>
            <el-form @submit.native.prevent>
              <div>
                <label style="font-size: 12px">{{ lang.date }} <span style="color: #F44336">*</span></label>
              </div>
              <el-form-item>
                <el-date-picker 
                  v-model="formDepreciation.date"
                  type="date" 
                  :placeholder="this.$lang[langId].pick_a_day" 
                  format="dd MMMM yyyy" 
                  value-format="yyyy-MM-dd"
                  style="width: 100%">
                </el-date-picker>
              </el-form-item>
              <div>
                <label style="font-size: 12px">{{ lang.transaction_no }} <span style="color: #F44336">*</span></label>
              </div>
              <el-form-item>
                <el-input v-model="formDepreciation.reference_jurnal_no" type="text"></el-input>
              </el-form-item>
              <div>
                <label style="font-size: 12px">{{ $lang[langId].debit_account }} <span style="color: #F44336">*</span></label>
              </div>
              <el-form-item>
                <el-select v-model="formDepreciation.depreciation_debit_account" style="width: 100%" filterable :placeholder="$lang[langId].select + ' ' + $lang[langId].debit_account">
                  <el-option
                    v-for="item in dataExpenses"
                    :key="item.account_no"
                    :label="item.account_no + ' '+ capitalize(item.account_name)"
                    :value="item.account_no">
                  </el-option>
                </el-select>
              </el-form-item>
              <div>
                <label style="font-size: 12px">{{ $lang[langId].credit_account }} <span style="color: #F44336">*</span></label>
              </div>
              <el-form-item>
                <el-select v-model="formDepreciation.depreciation_credit_account" style="width: 100%" filterable :placeholder="$lang[langId].select + ' ' + $lang[langId].credit_account">
                  <el-option
                    v-for="item in dataDebit"
                    :key="item.account_no"
                    :label=" + item.account_no + ' '+ capitalize(item.account_name)"
                    :value="item.account_no">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="col-lg-6" style="margin: auto">
          <el-form @submit.native.prevent>
            <div>
              <label style="font-size: 12px">{{ $lang[langId].beginning_amount }}</label>
            </div>
            <el-form-item>
              <money v-model="formDepreciation.first_value"
                :prefix="selectedStore.currency_id + ' '" 
                v-bind="money"
                class="form-input input-lg input-money"
                style="height: 36px;"></money>
            </el-form-item>
            <div>
              <label style="font-size: 12px">{{ $lang[langId].residual_value }}</label>
            </div>
            <el-form-item>
              <money v-model="formDepreciation.residual_value"
                :prefix="selectedStore.currency_id + ' '" 
                v-bind="money"
                class="form-input input-lg input-money"
                style="height: 36px;"></money>
            </el-form-item>
            <div>
              <label style="font-size: 12px">{{ $lang[langId].economic_life }}</label>
            </div>
            <el-form-item>
              <el-input
                v-model="formDepreciation.economic_life"
                onkeydown="return ( event.ctrlKey || event.altKey 
                    || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                    || (95<event.keyCode && event.keyCode<106)
                    || (event.keyCode==8) || (event.keyCode==9) 
                    || (event.keyCode>34 && event.keyCode<40) 
                    || (event.keyCode==46) )"
                class="input-with-select">
                <el-select v-model="formDepreciation.life_as_year" slot="append" placeholder="Select" width="100">
                  <el-option :label="lang.month" value="0">{{lang.month}}</el-option>
                  <el-option :label="lang.year" value="1">{{lang.year}}</el-option>
                </el-select>
              </el-input>

            </el-form-item>
            <div>
              <label style="font-size: 12px">{{ lang.notes }}</label>
            </div>
            <el-form-item>
              <el-input v-model="formDepreciation.description" type="textarea" :rows="2"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <el-input v-model="formDepreciation.currency_id" type="hidden">{{selectedStore.currency_id}}</el-input>
      </div>
    </div>
    <div v-else class="form-add-jurnal">
      <div class="col-lg-12" style="padding: 0">
        <div class="col-lg-6" style="float: none; margin: auto">
          <div v-if="formAdd.length !== 0">
            <div v-for="(item,idx) in formAdd" :key="idx" class="box collapsed-box" style="width: 100%; background: #F5F5F5">
              <div class="box-header with-border">
                <div class="visible-lg visible-md visible-sm">
                  <p>{{ item.debit_account }} - {{ item.credit_account }} ( {{ item.date }} )<br></p>
                    <h3 class="box-title">{{item.currency_id}} {{ formatPrice(item.amount) }}</h3>
                </div>
                <div class="visible-xs">
                      <p>{{ item.debit_account }} - {{ item.credit_account }} <br> ( {{ item.date }} )</p><br>
                    <h3 class="box-title">{{item.currency_id}} {{ formatPrice(item.amount) }}</h3>
                </div>
                
                <div class="box-tools" style="position: absolute; right: 25px;">
                  <button type="button" class="btn btn-box-tool" @click="removeFormAdd(idx, item)" style="font-size: large">
                    <svg-icon icon-class="trash-2" style="color: #F44336"/>
                  </button>
                  <button type="button" class="btn btn-box-tool" @click="addCollapse(idx)" style="font-size: large">
                    <i v-if="idxCollapse.includes(idx) === true" class="fa fa-chevron-up"></i>
                    <i v-else class="fa fa-chevron-down"></i>
                  </button>
                </div>
              </div>
              <div class="box-body create-product" v-if="idxCollapse.includes(idx) === true" style="background: #FFFFFF;">
                <el-form @submit.native.prevent >
                <div>
                    <label style="font-size: 12px">{{ lang.name }} Jurnal <span style="color: #F44336">*</span></label>
                </div>
                <el-form-item>
                  <el-select id="jurnalName" v-model="item.jurnal_name" style="width: 100%" 
                    :placeholder="$lang[langId].select + ' ' + lang.name + ' Jurnal'"
                    filterable :disabled="isDisabledJurnalName">
                    <el-option
                      v-for="jurnal in dataJurnalName"
                      :key="jurnal.jurnal_name"
                      :label="capitalize(jurnal.jurnal_name)"
                      :value="jurnal.jurnal_name">
                        {{capitalize(jurnal.jurnal_name)}}
                    </el-option>
                  </el-select>
                </el-form-item>
                <div>
                  <label style="font-size: 12px">{{ lang.date }} <span style="color: #F44336">*</span></label>
                </div>
                <el-form-item>
                  <el-date-picker 
                    v-model="item.date"
                    type="date" 
                    :placeholder="$lang[langId].pick_a_day" 
                    format="dd MMMM yyyy" 
                    value-format="yyyy-MM-dd"
                    style="width: 100%">
                  </el-date-picker>
                </el-form-item>
                <div>
                  <label style="font-size: 12px">{{ $lang[langId].debit_account }} <span style="color: #F44336">*</span></label>
                </div>
                <el-form-item>
                  <el-select v-model="item.debit_account" filterable :placeholder="$lang[langId].select + ' ' + $lang[langId].debit_account" style="width: 100%">
                    <el-option
                      v-for="item in dataAccount"
                      :key="item.account_no"
                      :label="item.account_no + ' ' + capitalize(item.account_name)"
                      :value="item.account_no">
                    </el-option>
                  </el-select>
                </el-form-item>
                <div>
                  <label style="font-size: 12px">{{ $lang[langId].credit_account }} <span style="color: #F44336">*</span></label>
                </div>
                <el-form-item>
                  <el-select v-model="item.credit_account" filterable :placeholder="$lang[langId].select + ' ' + $lang[langId].credit_account" style="width: 100%">
                    <el-option
                      v-for="item in dataAccount"
                      :key="item.account_no"
                      :label="item.account_no + ' '+ capitalize(item.account_name)"
                      :value="item.account_no">
                    </el-option>
                  </el-select>
                </el-form-item>
                <div>
                  <label style="font-size: 12px">{{ lang.notes }} <span style="color: #F44336">*</span></label>
                </div>
                <el-form-item>
                  <el-input v-model="item.jurnal_description" type="textarea" :rows="2" style="width: 100%"></el-input>
                </el-form-item>
                <div>
                  <label style="font-size: 12px">{{ lang.amount }} <span style="color: #F44336">*</span></label>
                </div>
                <el-form-item>
                  <input-money-select-currency :withSelectCurrency="true"
                    v-model="item.amount"
                    :listCurrency="dataCurrency"
                    :currency="item.currency_id"
                    @changeCurrency="(event) => formAddChangeCurrency(event, idx)"
                  />
                  <!-- <el-input
                    ref="elInput"
                    v-model="item.amount"
                    class="input-money input-with-select"
                    @input="handleInputMoney">
                    <el-select v-model="item.currency_id" slot="prepend" placeholder="Select" style="width: 80px;">
                      <el-option v-for="(currency, currencyIdx) in dataCurrency"
                        :key="currencyIdx"
                       :label="currency.currency_id"
                       :value="currency.currency_id">
                      </el-option>
                    </el-select>
                  </el-input> -->
                  <!-- <money v-model="item.amount"
                    v-bind="money"
                    :prefix="selectedStore.currency_id + ' '"
                    class="form-input input-lg input-money input-with-select"
                    style="height: 36px;">
                    <el-select v-model="item.currency_id" slot="prepend" placeholder="Select">
                      <el-option v-for="(currency, currencyIdx) in dataCurrency"
                        :key="currencyIdx"
                       :label="currency.currency_id"
                       :value="currency.currency_id">
                      </el-option>
                    </el-select> 
                  </money>-->
                </el-form-item>
                <div>
                  <label style="font-size: 12px">{{ $lang[langId].document_number }}</label>
                </div>
                <el-form-item>
                  <el-input v-model="item.external_no" type="text" style="width: 100%"></el-input>
                </el-form-item>
              </el-form>
              </div>
            </div>
          </div>
          <div>
            <el-form @submit.native.prevent >
              <div>
                <label style="font-size: 12px">{{ lang.name }} Jurnal <span style="color: #F44336">*</span></label>
              </div>
              <el-form-item>
                <div class="col-lg-8 col-md-8 col-sm-8 col-xs-8" style="padding: 0px">
                  <el-select id="jurnalName" v-model="temp.jurnal_name" style="width: 100%" 
                    :placeholder="$lang[langId].select + ' ' + lang.name + ' Jurnal'"
                    filterable :disabled="isDisabledJurnalName">
                    <el-option
                      v-for="item in dataJurnalName"
                      :key="item.jurnal_name"
                      :label="capitalize(item.jurnal_name)"
                      :value="item.jurnal_name">
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
                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 text-right" style="padding-right: 0px">
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
                  <div class="col-lg-7 col-md-8 col-sm-8 col-xs-8" style="padding: 0px">
                    <el-input v-model="newJurnalName" placeholder="Jurnal"></el-input>
                  </div>
                  <div class="col-lg-5 col-md-4 col-sm-4 col-xs-4 text-right" style="padding-right: 0px">
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
                <el-date-picker 
                  v-model="temp.date"
                  type="date" 
                  :placeholder="this.$lang[langId].pick_a_day" 
                  format="dd MMMM yyyy" 
                  value-format="yyyy-MM-dd"
                  style="width: 100%">
                </el-date-picker>
              </el-form-item>
              <div>
                <label style="font-size: 12px">{{ $lang[langId].debit_account }} <span style="color: #F44336">*</span></label>
              </div>
              <el-form-item>
                <el-select v-model="temp.debit_account" style="width: 100%" filterable :placeholder="$lang[langId].select + ' ' + $lang[langId].debit_account">
                  <el-option
                    v-for="item in dataAccount"
                    :key="item.account_no"
                    :label=" + item.account_no + ' '+ capitalize(item.account_name)"
                    :value="item.account_no">
                  </el-option>
                </el-select>
              </el-form-item>
              <div>
                <label style="font-size: 12px">{{ $lang[langId].credit_account }} <span style="color: #F44336">*</span></label>
              </div>
              <el-form-item>
                <el-select v-model="temp.credit_account" style="width: 100%" filterable :placeholder="$lang[langId].select + ' ' + $lang[langId].credit_account">
                  <el-option
                    v-for="item in dataAccount"
                    :key="item.account_no"
                    :label="item.account_no + ' '+ capitalize(item.account_name)"
                    :value="item.account_no">
                  </el-option>
                </el-select>
              </el-form-item>

              <div>
                <label style="font-size: 12px">{{ lang.notes }} <span style="color: #F44336">*</span></label>
              </div>
              <el-form-item>
                <el-input v-model="temp.jurnal_description" type="textarea" :rows="2"></el-input>
              </el-form-item>
              <div>
                <label style="font-size: 12px">{{ lang.amount }} <span style="color: #F44336">*</span></label>
              </div>
              <el-form-item>
                <input-money-select-currency :withSelectCurrency="true"
                  v-model="temp.amount"
                  :listCurrency="dataCurrency"
                  :currency="temp.currency_id"
                  @changeCurrency="tempChangeCurrency"
                />
              </el-form-item>
              <div>
                <label style="font-size: 12px">{{ $lang[langId].document_number }}</label>
              </div>
              <el-form-item>
                <el-input v-model="temp.external_no" type="text" style="width: 100%"></el-input>
              </el-form-item>
              <el-button icon="el-icon-plus" style="width: 100%; background: #F5F5F5" @click="addMultipleJurnal" :disabled="isDisabledJurnalName">{{ lang.add }} {{ $lang[langId].another }}</el-button>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <label class="visible-xs" style="margin-top: 20px;">(<span style="color: #F44336">*</span>) {{lang.required}}</label>
  </el-dialog>
</template>

<script>

import axios from 'axios'
import {baseApi} from 'src/http-common'
import InputMoneySelectCurrency from '@/components/InputMoneyV3'
var moment = require('moment')

export default {
  props: ['show'],

  components: {
    InputMoneySelectCurrency
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
  },


  data() {
    return {
      money: {
        decimal: ',',
        thousands: '.',
        prefix: '',
        precision: 2,
        masked: false
      },
      disabledButton: false,
      createJurnalName: false,
      loadingAddJurnalName: false,
      isDisabledJurnalName: false,
      dataAccount: [],
      idxCollapse: [],
      dataJurnalName: [],
      dataCurrency: [],
      formAdd: [],
      newJurnalName: '',
      temp: {
        date: moment().format('YYYY-MM-DD'),
        debit_account: '',
        credit_account: '',
        jurnal_name: '',
        jurnal_description: '',
        currency_id: this.$store.getters.selectedStore.currency_id,
        amount: 0,
        external_no: '',
        reference_no: '',
      },
      depreciation: false,
      formDepreciation: {
        date: '',
        depreciation_debit_account: '',
        depreciation_credit_account: '',
        description: '',
        currency_id: this.$store.getters.selectedStore.currency_id,
        first_value: 0,
        residual_value: 0,
        economic_life: 1,
        reference_jurnal_no: '',
        reference_transaction_id: '',
        life_as_year: '0'
      },
      dataExpenses: [],
      dataDebit: [],
      dataListDepreciation: [],
      indexDepreciation: 0,
      customeListDepreciation: []
    }
  },

  mounted() {


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
    
    addCollapse (idx) {
      if(this.idxCollapse.includes(idx) === false){
        this.idxCollapse.push(idx)
      }else{
        this.idxCollapse.map((i, no) => {
          if (i === idx) {
            this.idxCollapse.splice(no, 1)
          }
        })
      }
    },

    removeFormAdd (idx, row) {
      this.formAdd.splice(idx, 1); 
      this.$message({
        message: 'Jurnal ' + row.jurnal_name + ' ' + this.lang.cancelled,
        type: 'success'
      })
    },

    handleSaveJurnal () {
      // this.depreciation = true
      this.isDisabledJurnalName = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      if( this.temp.date !== '' && this.temp.debit_account !== '' && this.temp.credit_account !== '' && this.temp.jurnal_name !== '' && this.temp.jurnal_description !== '' && this.temp.amount !== ''){
        this.formAdd.push(this.temp)
        this.temp = {
          date: moment().format('YYYY-MM-DD'),
          debit_account: '',
          credit_account: '',
          jurnal_name: '',
          jurnal_description: '',
          currency_id: this.temp.currency_id,
          amount: 0,
          external_no: '',
          reference_no: '',
          supplier_id: "",
          customer_id: "",
          due_dates: ""
        }
      }

      let data = this.formAdd
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/jurnal'),
        headers: headers,
        data
      }).then((response) => {
        this.formAdd = []
        
        this.isDisabledJurnalName = false
        this.$message({
          message: this.$lang[this.langId].success_add,
          type: 'success'
        })
        // this.getChartAccount()
        this.formAdd = []
        if (response.data.asset) {
          this.dataListDepreciation = response.data.data
          this.formDepreciation = {
            date: this.dataListDepreciation[0].date,
            depreciation_debit_account: this.dataListDepreciation[0].debit_account_no,
            depreciation_credit_account: this.dataListDepreciation[0].credit_account_no,
            description: this.dataListDepreciation[0].description,
            currency_id: this.dataListDepreciation[0].currency_id,
            first_value: this.dataListDepreciation[0].first_value.replace('.00', ''),
            residual_value: 0,
            economic_life: 1,
            life_as_year: '0',
            reference_jurnal_no: this.dataListDepreciation[0].reference_jurnal_no,
            reference_transaction_id: this.dataListDepreciation[0].reference_transaction_id
          }
          this.depreciation = true
        }
      })
      .catch(error => {
        this.isDisabledJurnalName = false
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
        this.dialogAddJurnal = true
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

    handleCancelJurnal () {
      this.cancelJurnalName()
      this.formAdd = []
      this.temp = {
        date: moment().format('YYYY-MM-DD'),
        debit_account: '',
        credit_account: '',
        jurnal_name: '',
        jurnal_description: '',
        currency_id: this.temp.currency_id,
        amount: 0,
        external_no: '',
        reference_no: '', 
        supplier_id: "",
        customer_id: "",
        due_dates: ""
      }
      this.formDepreciation = {
        date: '',
        depreciation_debit_account: '',
        depreciation_credit_account: '',
        description: '',
        currency_id: this.$store.getters.selectedStore.currency_id,
        first_value: 0,
        residual_value: 0,
        economic_life: 1,
        reference_jurnal_no: '',
        reference_transaction_id: '',
        life_as_year: '0'
      }
    },
    
    handleCloseJurnal () {
      this.handleCancelJurnal()
      this.$emit('close')
    },
        
    addMultipleJurnal () {
      this.formAdd.push(this.temp)
      this.temp = {
        date: moment().format('YYYY-MM-DD'),
        debit_account: '',
        credit_account: '',
        jurnal_name: '',
        jurnal_description: '',
        currency_id: this.temp.currency_id,
        amount: 0,
        external_no: '',
        reference_no: ''
      }
    },

    formatPrice(value) {
      let val = (value/1).toFixed(0).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },

    capitalize(value){
      let capitalize= '';
      if(value){
        capitalize = value[0].toUpperCase() + value.slice(1);
      }
      return capitalize;
    },

    formAddChangeCurrency(value, idx){
      this.formAdd[idx].currency_id = value
      console.log('formAddCurrency', value, idx)
    },

    tempChangeCurrency(value){
      this.temp.currency_id = value
    },

    handleSaveAsset(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = this.formDepreciation
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/asset'),
        headers: headers,
        params: params
      }).then(response => {
        this.$message({
          type: 'success',
          message: this.$lang[this.langId].success_add  
        })
        this.indexDepreciation++
        if (this.indexDepreciation < this.dataListDepreciation.length) {
          this.formDepreciation = {
            date: this.dataListDepreciation[this.indexDepreciation].date,
            depreciation_debit_account: this.dataListDepreciation[this.indexDepreciation].debit_account_no,
            depreciation_credit_account: this.dataListDepreciation[this.indexDepreciation].credit_account_no,
            description: this.dataListDepreciation[this.indexDepreciation].description,
            currency_id: this.dataListDepreciation[this.indexDepreciation].currency_id,
            first_value: this.dataListDepreciation[this.indexDepreciation].first_value.replace('.00', ''),
            residual_value: 0,
            economic_life: 1,
            life_as_year: '0',
            reference_jurnal_no: this.dataListDepreciation[this.indexDepreciation].reference_jurnal_no,
            reference_transaction_id: this.dataListDepreciation[this.indexDepreciation].reference_transaction_id
          }
        } else {
          this.depreciation = false
          this.handleCancelJurnal()
          this.$emit('close')
        }
        // this.dialogAdd = false
        // this.getDataAsset()
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

    getExpenses(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/name/expenses'),
        headers: headers
      }).then(response => {
        this.dataExpenses = response.data.data
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

    getDebit(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/name/asset'),
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

    handleSkip() {
      this.indexDepreciation++

      if (this.indexDepreciation < this.dataListDepreciation.length) {
        this.formDepreciation = {
          date: this.dataListDepreciation[this.indexDepreciation].date,
          depreciation_debit_account: this.dataListDepreciation[this.indexDepreciation].debit_account_no,
          depreciation_credit_account: this.dataListDepreciation[this.indexDepreciation].credit_account_no,
          description: this.dataListDepreciation[this.indexDepreciation].description,
          currency_id: this.dataListDepreciation[this.indexDepreciation].currency_id,
          first_value: this.dataListDepreciation[this.indexDepreciation].first_value.replace('.00', ''),
          residual_value: 0,
          economic_life: 1,
          life_as_year: '0',
          reference_jurnal_no: this.dataListDepreciation[this.indexDepreciation].reference_jurnal_no,
          reference_transaction_id: this.dataListDepreciation[this.indexDepreciation].reference_transaction_id
        }
      } else {
        this.handleCancelJurnal()
        this.$emit('close')
      }
    }
  }
}
</script>
