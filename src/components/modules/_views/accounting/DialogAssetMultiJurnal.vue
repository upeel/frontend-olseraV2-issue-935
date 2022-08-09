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
          <div class="btn_save_dialog">
            <el-button v-if="formAdd.length === 0" id="id-close" type="info" @click="handleCloseJurnal()">{{ lang.close }}</el-button>
            <el-button v-else type="info" @click="handleCancelJurnal">{{ lang.cancel }}</el-button>
            <el-button type="info" @click="handleSkip">{{ $lang[langId].skip_it }}</el-button>
            <el-button type="success" @click="handleSaveAsset" :disabled="isDisabledJurnalName">{{ lang.save }}</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="form-add-jurnal">
      <div class="col-lg-12" style="padding: 0">
        <div class="col-lg-6" style="float: none; margin: auto">
          <div v-if="formAdd.length !== 0">
            <div v-for="(item,idx) in formAdd" :key="idx" class="box collapsed-box" style="width: 100%; background: #F5F5F5">
              <div class="box-header with-border">
                <div class="visible-lg visible-md visible-sm">
                  <p>{{ item.depreciation_debit_account }} - {{ item.depreciation_credit_account }} ( {{ item.date }} )<br></p>
                    <h3 class="box-title">{{selectedStore.currency_id}} {{ formatPrice(item.first_value) }}</h3>
                </div>
                <div class="visible-xs">
                      <p>{{ item.depreciation_debit_account }} - {{ item.depreciation_credit_account }} <br> ( {{ item.date }} )</p><br>
                    <h3 class="box-title">{{selectedStore.currency_id}} {{ formatPrice(item.first_value) }}</h3>
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
                <el-form @submit.native.prevent>
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
                    <label style="font-size: 12px">{{ lang.transaction_no }} <span style="color: #F44336">*</span></label>
                  </div>
                  <el-form-item>
                    <el-input v-model="item.reference_jurnal_no" type="text"></el-input>
                  </el-form-item>
                  <div>
                    <label style="font-size: 12px">{{ $lang[langId].debit_account }} <span style="color: #F44336">*</span></label>
                  </div>
                  <el-form-item>
                    <el-select v-model="item.depreciation_debit_account" style="width: 100%" filterable :placeholder="$lang[langId].select + ' ' + $lang[langId].debit_account">
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
                    <el-select v-model="item.depreciation_credit_account" style="width: 100%" filterable :placeholder="$lang[langId].select + ' ' + $lang[langId].credit_account">
                      <el-option
                        v-for="item in dataDebit"
                        :key="item.account_no"
                        :label=" + item.account_no + ' '+ capitalize(item.account_name)"
                        :value="item.account_no">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <div>
                    <label style="font-size: 12px">{{ $lang[langId].beginning_amount }}</label>
                  </div>
                  <el-form-item>
                    <money v-model="item.first_value"
                      :prefix="selectedStore.currency_id + ' '" 
                      v-bind="money"
                      class="form-input input-lg input-money"
                      style="height: 36px;"></money>
                  </el-form-item>
                  <div>
                    <label style="font-size: 12px">{{ $lang[langId].residual_value }}</label>
                  </div>
                  <el-form-item>
                    <money v-model="item.residual_value"
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
                      v-model="item.economic_life"
                      onkeydown="return ( event.ctrlKey || event.altKey 
                          || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                          || (95<event.keyCode && event.keyCode<106)
                          || (event.keyCode==8) || (event.keyCode==9) 
                          || (event.keyCode>34 && event.keyCode<40) 
                          || (event.keyCode==46) )"
                      class="input-with-select">
                      <el-select v-model="item.life_as_year" slot="append" placeholder="Select" width="100">
                        <el-option :label="lang.month" value="0">{{lang.month}}</el-option>
                        <el-option :label="lang.year" value="1">{{lang.year}}</el-option>
                      </el-select>
                    </el-input>
                  </el-form-item>
                  <div>
                    <label style="font-size: 12px">{{ lang.notes }}</label>
                  </div>
                  <el-form-item>
                    <el-input v-model="item.description" type="textarea" :rows="2"></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </div>
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
export default {
  props: ['show', 'dataListAsset'],

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
        date: '',
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
        life_as_year: '0',
        account_transaction_id: ''
      },
      dataExpenses: [],
      dataDebit: [],
      dataListDepreciation: [],
      indexDepreciation: 0,
      customeListDepreciation: []
    }
  },
  watch: {
    show: {
      immediate: true,
      handler (payload) {
        if (payload) {
          this.getData()
        }
      }
    }
  },
  mounted() {
    this.getExpenses()
    this.getDebit()
  },

  methods: {
    getData () {
      if (this.dataListAsset) { 
        this.dataListDepreciation = this.dataListAsset
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
            reference_transaction_id: this.dataListDepreciation[0].reference_transaction_id,
            account_transaction_id: this.dataListDepreciation[0].account_transaction_id
          }
      }
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

    handleCancelJurnal () {
      this.formAdd = []
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
        life_as_year: '0',
        account_transaction_id: ''
      }
    },
    
    handleCloseJurnal () {
      this.handleCancelJurnal()
      // let fromPage = this.$route.params.fromPage
      this.$emit('close')
      this.$router.push({name: 'General Ledger'})
    },
        
    addMultipleJurnal () {
      this.formAdd.push(this.formDepreciation)
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
        reference_transaction_id: this.dataListDepreciation[this.indexDepreciation].reference_transaction_id,
        account_transaction_id: this.dataListDepreciation[0].reference_transaction_id
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
    },

    tempChangeCurrency(value){
      this.temp.currency_id = value
    },

    handleSaveAsset(){
      this.isDisabledJurnalName = true
      let dataParams = []
      dataParams = this.formAdd
      dataParams.push(this.formDepreciation)
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      // let params = this.formDepreciation
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/multijurnal/asset'),
        headers: headers,
        data: dataParams
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
            reference_transaction_id: this.dataListDepreciation[this.indexDepreciation].reference_transaction_id,
            account_transaction_id: this.dataListDepreciation[0].account_transaction_id
          }
          this.formAdd = []
        } else {
          this.depreciation = false
          this.handleCloseJurnal()
        }
        // this.dialogAdd = false
        // this.getDataAsset()
        this.isDisabledJurnalName = false
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
        this.formAdd = []
        this.isDisabledJurnalName = false
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
          reference_transaction_id: this.dataListDepreciation[this.indexDepreciation].reference_transaction_id,
          account_transaction_id: this.dataListDepreciation[0].account_transaction_id
        }
      } else {
        this.handleCloseJurnal()
      }
    }
  }
}
</script>
