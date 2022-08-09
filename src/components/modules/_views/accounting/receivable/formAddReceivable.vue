<template>
  <div>
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
            <h4 class="dialog-title">{{temp.debit_account === 0 || temp.credit_account === 0 ? lang.add + ' ' + lang.account : 'Jurnal'}}</h4>
          </el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="8" align="right">
            <div class="btn_accounting_dialog">
              <el-button v-if="formAdd.length === 0" type="info" @click="handleCloseJurnal">{{ lang.close }}</el-button>
              <el-button v-else type="info" @click="handleCancelJurnal">{{ lang.cancel }}</el-button>
              <!-- <el-button type="info" @click="handleCloseJurnal">{{ lang.cancel }}</el-button> -->
              <el-button type="success" @click="handleSaveJurnal" :disabled="isDisabledJurnalName">{{ lang.save }}</el-button>
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
                    <span>{{ item.debit_account }} - {{ item.credit_account }} ( {{ item.date }} )</span><br>
                    <h3 class="box-title">{{selectedStore.currency_id}} {{ formatPrice(item.amount) }}</h3>
                  </div>
                  <div class="visible-xs">
                    <span>{{ item.debit_account }} - {{ item.credit_account }} <br> ( {{ item.date }} )</span><br>
                    <h3 class="box-title">{{selectedStore.currency_id}} {{ formatPrice(item.amount) }}</h3>
                  </div>

                  <div class="box-tools" style="position: absolute; right: 25px;">
                    <button type="button" class="btn btn-box-tool" @click="removeFormAdd(idx, item)" style="font-size: large">
                      <svg-icon icon-class="trash-2" style="color: #F44336"/>
                    </button>
                    <button type="button" class="btn btn-box-tool" @click="addCollapse(idx)" data-widget="collapse" style="font-size: large">
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
                    <label style="font-size: 12px">{{ lang.customer }} <span style="color: #F44336">*</span></label>
                  </div>
                  <el-form-item>
                    <el-select 
                      style="width: 100%"  
                      filterable 
                      :placeholder="$lang[langId].select + ' ' + lang.customer"
                      v-model="item.customer_id"
                      :value="item.customer_id">
                      <el-option
                        v-for="item in dataCustomer"
                        :key="item.id"
                        :label="capitalize(item.name)"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <div>
                    <label style="font-size: 12px">{{ $lang[langId].debit_account }} <span style="color: #F44336">*</span></label>
                  </div>
                  <el-form-item>
                    <el-select v-model="item.debit_account" filterable :placeholder="$lang[langId].select + ' ' + $lang[langId].debit_account" style="width: 100%">
                      <el-option
                        v-for="item in dataDebit"
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
                        v-for="item in dataCredit"
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
                    <input-money-select-currency :withSelectCurrency="false" :prepend="selectedStore.currency_id"
                      v-model="item.amount"
                    />
                  </el-form-item>
                  <div>
                    <label style="font-size: 12px">{{ lang.due_date }}</label>
                  </div>
                  <el-form-item>
                    <el-date-picker
                      v-model="item.due_dates"
                      type="date"
                      :placeholder="$lang[langId].pick_a_day"
                      format="dd MMMM yyyy"
                      value-format="yyyy-MM-dd"
                      style="width: 100%">
                    </el-date-picker>
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

              <el-form @submit.native.prevent>
                <div>
                  <label style="font-size: 12px">{{ lang.name }} Jurnal <span style="color: #F44336">*</span></label>
                </div>
                <el-form-item>
                  <div>
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
                            <el-button size="mini" type="danger" class="btn-plain" v-if="item.remove_able === 1"
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
                              <el-button :disabled="loadingAddJurnalName" class="accounting-dropBtn" type="text" style="color: #67C23A" @click="handleSaveJurnalName">
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
                    :placeholder="$lang[langId].pick_a_day"
                    format="dd MMMM yyyy"
                    value-format="yyyy-MM-dd"
                    style="width: 100%">
                  </el-date-picker>
                </el-form-item>
                <div>
                  <label style="font-size: 12px">{{ lang.customer }} <span style="color: #F44336">*</span></label>
                </div>
                <el-form-item>
                  <el-select 
                    style="width: 100%"  
                    filterable 
                    :placeholder="$lang[langId].select + ' ' + lang.customer"
                    v-model="temp.customer_id"
                    :value="temp.customer_id"
                    @input="(value) => selectCustomer(value)">
                    <el-option
                      v-for="item in dataCustomer"
                      :key="item.id"
                      :label="capitalize(item.name)"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <div>
                  <label style="font-size: 12px">{{ $lang[langId].debit_account }} <span style="color: #F44336">*</span></label>
                </div>
                <el-form-item>
                  <el-select v-model="temp.debit_account" style="width: 100%" filterable :placeholder="$lang[langId].select + ' ' + $lang[langId].debit_account">
                    <el-option
                      v-for="item in dataDebit"
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
                      v-for="item in dataCredit"
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
                  <input-money-select-currency :withSelectCurrency="false" :prepend="selectedStore.currency_id"
                    v-model="temp.amount"
                  />
                </el-form-item>
                <div>
                  <div>
                    <label style="font-size: 12px">{{ lang.due_date }}</label>
                  </div>
                  <el-form-item>
                    <el-date-picker
                      v-model="temp.due_dates"
                      type="date"
                      :placeholder="$lang[langId].pick_a_day"
                      format="dd MMMM yyyy"
                      value-format="yyyy-MM-dd"
                      style="width: 100%">
                    </el-date-picker>
                  </el-form-item>
                </div>
                <div>
                  <label style="font-size: 12px">{{ $lang[langId].document_number }}</label>
                </div>
                <el-form-item>
                  <el-input v-model="temp.external_no" type="text" style="width: 100%"></el-input>
                </el-form-item>
                <el-input v-model="temp.currency_id" type="hidden">{{selectedStore.currency_id}}</el-input>
                <el-input v-model="temp.reference_no" type="hidden"></el-input>
                <el-button icon="el-icon-plus" style="width: 100%; background: #F5F5F5" @click="addMultipleJurnal" :disabled="isDisabledJurnalName">{{ lang.add }} {{ $lang[langId].another }}</el-button>
              </el-form>
            </div>
          </div>
        </div>
      </div>
      <label class="visible-xs" style="margin-top: 20px;">(<span style="color: #F44336">*</span>) {{lang.required}}</label>
    </el-dialog>
  </div>
</template>
<script>
import { baseApi } from 'src/http-common';
import axios from 'axios';
import mixinAccounting from '@/mixins/mixinAccounting';
import InputMoneySelectCurrency from '@/components/InputMoneyV3';

export default {
  name: 'FormReceivable',
  props: {
    show: {
      type: Boolean,
      default: true
    }
  },

  components: {
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
    }
  },

  data(){
    return{
      idxCollapse: [],
      dataJurnalName: [],
      loadingAddJurnalName: false,
      dataDebit: [],
      dataCredit: [],
      dataCustomer: [],
      createJurnalName: false,
      newJurnalName: '',
      isDisabledJurnalName: false,
      disabledButton: false,
      formAdd: [],
      temp: {
        date: '',
        debit_account: '',
        credit_account: '',
        jurnal_name: '',
        jurnal_description: '',
        currency_id: '',
        amount: 0,
        external_no: '',
        reference_no: '',
        customer_id: '',
        due_dates: '',
      },
    }
  },
  
  mounted(){
    this.showAddJurnal();
    this.getJurnalName();
    this.getDebit();
    this.getCredit();
    this.getCustomer();
  },
  methods: {
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

    getDebit(){
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

    getCredit(){
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

    selectCustomer (val){
      let selected = {}
      this.dataCustomer.forEach((item, index) => {
        if (item.id === val){
          selected = item
        }
      })

      this.temp.customer_id = selected.id
      this.temp.due_dates = selected.due_date
    },

    showAddJurnal () {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/newreceivable'),
        headers: headers
      }).then(response => {
        let res = response.data.data
        this.temp = {
          date: res.date,
          debit_account: res.debit_account_no,
          credit_account: res.credit_account_no,
          jurnal_name: res.jurnal_name,
          jurnal_description: '',
          currency_id: '',
          amount: 0,
          external_no: '',
          reference_no: '',
          due_dates: res.due_dates,
        }
        this.autoAccount = {
          debit_account: res.debit_account_no,
          credit_account: res.credit_account_no
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

    addMultipleJurnal () {
      this.temp.currency_id = this.selectedStore.currency_id
      this.formAdd.push(this.temp)
      this.temp = {
        date: '',
        debit_account: '',
        credit_account: '',
        jurnal_name: '',
        jurnal_description: '',
        currency_id: this.selectedStore.currency_id,
        amount: 0,
        external_no: '',
        reference_no: '',
        due_dates: ''
      }
    },

    removeFormAdd (idx, row) {
      this.formAdd.splice(idx, 1);
      this.$message({
        message: 'Jurnal ' + capitalize(row.jurnal_name) + ' ' + this.lang.cancelled,
        type: 'success'
      })
    },

    handleSaveJurnal() {
      this.isDisabledJurnalName = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      if( this.temp.date !== '' && this.temp.debit_account !== '' && this.temp.credit_account !== '' && this.temp.jurnal_name !== '' && this.temp.jurnal_description !== '' && this.temp.amount !== ''){
        this.temp.currency_id = this.selectedStore.currency_id
        this.formAdd.push(this.temp)
        this.temp = {
          date: '',
          debit_account: '',
          credit_account: '',
          jurnal_name: '',
          jurnal_description: '',
          currency_id: this.selectedStore.currency_id,
          amount: 0,
          external_no: '',
          reference_no: '',
          due_dates: ''
        }
      }

      let data = this.formAdd
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/jurnal'),
        headers: headers,
        data
      })
      .then(response => {
        this.isDisabledJurnalName = false
        this.formAdd = []
        // this.temp = {
        //   date: '',
        //   debit_account: '',
        //   credit_account: '',
        //   jurnal_name: '',
        //   jurnal_description: '',
        //   currency_id: this.selectedStore.currency_id,
        //   amount: 0,
        //   external_no: '',
        //   reference_no: '',
        //   due_dates: ''
        // }
        this.showAddJurnal()
        this.$message({
          message: 'Success',
          type: 'success'
        })
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
        this.isDisabledJurnalName = false
      })
    },

    handleCloseJurnal () {
      this.handleCancelJurnal()
      this.$router.push({ path: '/accounting/receivable'})
    },

    handleCancelJurnal () {
      this.cancelJurnalName()
      this.formAdd = []
      this.temp = {
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
    
    formatPrice(value) {
      let val = (value/1).toFixed(0).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
  }
}
</script>
