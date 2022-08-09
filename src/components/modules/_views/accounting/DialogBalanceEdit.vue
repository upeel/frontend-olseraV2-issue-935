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
          <h4 class="dialog-title">{{ tempBalance.account_no === 0 ? lang.add + ' ' + lang.account : lang.edit + ' Jurnal'}}</h4>
        </el-col>
        <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="8" align="right">
          <div class="btn_save_dialog" v-if="tempBalance.account_no === 0">
            <el-button type="info" @click="closeAddAccount">{{ lang.cancel }}</el-button>
            <el-button :disabled="loadingAddAccount" type="success" @click="saveAccount">{{ lang.save }} {{lang.account}}</el-button>
          </div>
          <div class="btn_save_dialog" v-else>
            <el-button type="info" @click="handleCloseJurnalBalance">{{ lang.cancel }}</el-button>
            <el-button type="success" @click="handleSaveJurnalBalance" :disabled="isDisabledJurnalName || loadingAddJurnal">{{ lang.save }}</el-button>
          </div>
        </el-col>
      </el-row>

    </div>
    <div class="form-add-jurnal">
      <div class="col-lg-12" style="padding: 0" v-if="tempBalance.account_no === 0">
        <div class="col-lg-6" style="float: none; margin: auto">
          <el-form @submit.native.prevent>
            <div>
              <label style="font-size: 12px">{{ lang.category }}</label>
            </div>
            <el-form-item>
              <el-select v-model="tempAccount.category" filterable style="width: 100%" :placeholder="$lang[langId].select + ' ' + lang.category" @change="handleChangeCategory($event)">
                <el-option
                  v-for="item in dataGroup"
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
              <el-input id="account_number" type="number" v-model="tempAccount.account_number"></el-input>
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
      </div>
      <div class="row col-lg-12" style="padding: 0;" v-else>
        <div class="col-lg-6">
          <el-form @submit.native.prevent >
            <div>
              <label style="font-size: 12px">{{ lang.name }} Jurnal <span style="color: #F44336">*</span></label>
            </div>
            <el-form-item>
              <div class="col-lg-8 col-md-8 col-sm-8 col-xs-8" style="padding: 0px">
                <el-select id="jurnalName" v-model="tempBalance.jurnal_id" style="width: 100%" 
                  :placeholder="$lang[langId].select + ' ' + lang.name + ' Jurnal'"
                  filterable :disabled="isDisabledJurnalName">
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
                    <el-button :disabled="loadingAddJurnalName" type="text" style="color: #67C23A" @click="handleSaveJurnalName">
                      <svg-icon icon-class="save" stroke="#67C23A"></svg-icon>
                      {{ lang.save }}
                    </el-button>
                  </div>
                </div>
              </el-form-item>
            </div>

            <div>
              <label style="font-size: 12px">{{ lang.date }} <span style="color: #F44336">*</span></label>
            </div>
            <el-form-item>
              <el-date-picker 
                v-model="tempBalance.date"
                type="date" 
                :placeholder="this.$lang[langId].pick_a_day" 
                format="dd MMMM yyyy" 
                value-format="yyyy-MM-dd"
                style="width: 100%">
              </el-date-picker>
            </el-form-item>
            <div>
              <label style="font-size: 12px">{{ lang.notes }} <span style="color: #F44336">*</span></label>
            </div>
            <el-form-item>
              <el-input v-model="tempBalance.jurnal_description" type="textarea" :rows="2"></el-input>
            </el-form-item>
            <el-row :gutter="20">
              <el-col :span="12"><el-button type="success" style="width: 100%;" @click="balanceDebit">{{ lang.add }} {{$lang[langId].debit}}</el-button></el-col>
              <el-col :span="12"><el-button type="warning" style="width: 100%;" @click="balanceCredit">{{ lang.add }} {{$lang[langId].credit}}</el-button></el-col>
            </el-row>
          </el-form>
        </div>
        <div class="col-lg-6">
          <el-form @submit.native.prevent>
            <div>
              <label v-if="tempBalance.type === 'db'" style="font-size: 12px">{{ $lang[langId].debit_account }} <span style="color: #F44336">*</span></label>
              <label v-else-if="tempBalance.type === 'cr'" style="font-size: 12px">{{ $lang[langId].credit_account }} <span style="color: #F44336">*</span></label>
              <label v-else style="font-size: 12px">{{ lang.account }} <span style="color: #F44336">*</span></label>
            </div>
            <el-form-item>
              <el-select 
                style="width: 100%" 
                :disabled="balanceActive === false" 
                filterable 
                :placeholder="$lang[langId].select + ' ' + lang.account"
                :value="tempBalance.account_no"
                v-model="tempBalance.account_no"
                @input="(value) => selectAccountBalance(value)">
                <el-option :key="0"
                  :value="0"
                  :label="lang.add + ' ' + lang.account">
                  <svg-icon icon-class="plus"/> {{lang.add}} {{lang.account}}
                </el-option>
                <el-option
                  v-for="item in dataAccount"
                  :key="item.account_no"
                  :label="item.account_no + ' '+ capitalize(item.account_name)"
                  :value="item.account_no"
                  >
                </el-option>
              </el-select>
            </el-form-item>
            <div v-if="receivableActive">
              <div>
                <label style="font-size: 12px">{{ lang.customer }} <span style="color: #F44336">*</span></label>
              </div>
              <el-form-item>
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
            </div>
            <div v-if="payableActive">
              <div>
                <label style="font-size: 12px">{{ lang.supplier }} <span style="color: #F44336">*</span></label>
              </div>
              <el-form-item>
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
            </div>
            <div v-if="receivableActive || payableActive">
              <div>
                <label style="font-size: 12px">{{ lang.due_date }} <span style="color: #F44336">*</span></label>
              </div>
              <el-form-item>
                <el-date-picker 
                  v-model="tempBalance.due_dates"
                  type="date" 
                  :placeholder="this.$lang[langId].pick_a_day" 
                  format="dd MMMM yyyy" 
                  value-format="yyyy-MM-dd"
                  style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </div>
            <div v-if="tempBalance.type === 'db'">
              <div>
                <label style="font-size: 12px">{{ lang.amount }} <span style="color: #F44336">*</span></label>
              </div>
              <el-form-item>
                <money v-model="tempBalance.amount_debit"
                  :prefix="selectedStore.currency_id + ' '" 
                  v-bind="money"
                  class="form-input input-lg input-money"
                  style="height: 36px;"
                  :disabled="balanceActive === false"
                  ></money>
              </el-form-item>
            </div>
            <div v-else>
              <div>
                <label style="font-size: 12px">{{ lang.amount }} <span style="color: #F44336">*</span></label>
              </div>
              <el-form-item>
                <money v-model="tempBalance.amount_credit"
                  :prefix="selectedStore.currency_id + ' '" 
                  v-bind="money"
                  class="form-input input-lg input-money"
                  style="height: 36px;"
                  :disabled="balanceActive === false"
                  ></money>
              </el-form-item>
            </div>
            <div>
              <label style="font-size: 12px">{{ $lang[langId].document_number }}</label>
            </div>
            <el-form-item>
              <el-input v-model="tempBalance.external_no" :disabled="balanceActive === false" type="text" style="width: 100%"></el-input>
            </el-form-item>
            <el-input v-model="tempBalance.currency_id" type="hidden">{{selectedStore.currency_id}}</el-input>
            
            <el-button v-if="isEdit" type="success" style="width: 100%" @click="handleEditJurnal">{{lang.edit}}</el-button>
            <el-button v-else icon="el-icon-plus" style="width: 100%; background: #F5F5F5; height: 34px;" @click="addToBalanceJurnal" :disabled="isDisabledJurnalName || balanceActive === false">{{ lang.add }} {{ $lang[langId].another }}</el-button>
          </el-form>
        </div>
      </div>
      <div class="col-lg-12" style="padding: 0; margin-top: 24px;"  v-if="tempBalance.account_no !== 0">
        <el-table
          ref="multipleTable"
          class="product-table-max-height mobile-fix-height-unset"
          :data="dataBalance"
          :summary-method="getSummaries"
          show-summary
          stripe>
          <el-table-column type="expand" >
            <template slot-scope="props">
              <p v-if="props.row.account_group_id === 7 || props.row.account_group_id === 14">{{lang.supplier}} : {{ capitalize(props.row.supplier_name) }}</p>
              <p v-if="props.row.account_group_id === 4">{{lang.customer}} : {{ capitalize(props.row.customer_name) }}</p>
              <p v-if="props.row.account_group_id === 4 || props.row.account_group_id === 7 || props.row.account_group === 14">{{lang.due_date}} : {{ dateFormat(props.row.due_dates) }}</p>
            </template>
          </el-table-column>
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
              <span>{{ capitalize(scope.row.account_name) }}</span>
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
                {{ formatPrice(scope.row.amount_debit) }}
              </div>
              <div v-else>0</div>
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
                {{ formatPrice(scope.row.amount_credit) }}
              </div>
              <div v-else>0</div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$lang[langId].action" align="center" width="90px">
            <template slot-scope="scope">
              <el-dropdown trigger="click" style="padding: inherit">
                <el-button type="text" icon="el-icon-more" style="color:#909399"></el-button>
                <el-dropdown-menu slot="dropdown" style="background-color: #F2F2F2;">
                  <el-dropdown-item style="padding: 0px">
                    <el-button type="text" class="accounting-dropBtn" style="color: #000000" @click="editJurnal(scope.row, scope.$index)">
                      <span style="margin-left: 10px;">
                        <svg-icon icon-class="edit"></svg-icon>
                        {{ lang.edit }}
                      </span>
                    </el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <label class="visible-xs" style="margin-top: 20px;">(<span style="color: #F44336">*</span>) {{lang.required}}</label>
  </el-dialog>
</template>

<script>

import axios from 'axios'
import {baseApi} from 'src/http-common'
var moment = require('moment')

export default {
  props: ['show', 'jurnalId'],

  data() {
    return {
      money: {
        decimal: ',',
        thousands: '.',
        prefix: '',
        precision: 2,
        masked: false
      },
      loadingAddJurnalName: false,
      loadingAddJurnal: false,
      loadingAddAccount: false,
      dataAccount: [],
      dataBalance: [],
      dataCustomer: [],
      dataSupplier: [],
      dataJurnalName: [],
      dataGroup: [],
      assetAccount: [],
      disabledButton: false,
      balanceActive: false,
      payableActive: false,
      receivableActive: false,
      isDisabledJurnalName: false,
      createJurnalName: false,
      accumulationDepreciation: false,
      isEdit: false,
      idEdit: '',
      newJurnalName: '',
      tempBalance: {
        date: "",
        account_no: "",
        jurnal_id: "",
        jurnal_description: "",
        currency_id: "",
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
      },
      tempAccount: {
        category: '',
        account_name: '',
        account_number: '',
        accumulated_depreciation: ''
      }
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
    },
  },

  watch: {
    show(payload) {
      if (payload) {
        this.getAccount()
        this.getGroupName()
        this.getJurnalName()
        this.loadBalance()
      }
    }
  },

  // mounted() {

  // },

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

    getGroupName () {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method : 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/group'),
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

    loadBalance () {
      // console.log('id', this.jurnalId)
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/multijurnal/'+ this.jurnalId),
        headers: headers
      }).then(response => {
        this.dataBalance = response.data.data
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

    balanceDebit () {
      this.balanceActive = true
      this.tempBalance.type = 'db'
    },

    balanceCredit () {
      this.balanceActive = true
      this.tempBalance.type = 'cr'
    },

    selectAccountBalance (val) {
      let selected = {}
      this.dataAccount.forEach((item, index) => {
        if (item.account_no === val){
          selected = item
        }
      })

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

    addToBalanceJurnal (){
      this.tempBalance.currency_id = this.selectedStore.currency_id
      this.dataBalance.push(this.tempBalance)
      
      this.balanceActive = false
      this.payableActive = false
      this.receivableActive = false
      this.dataCustomer = []
      this.dataSupplier = []
      this.tempBalance = {
        date: "",
        account_no: "",
        jurnal_id: "",
        jurnal_description: "",
        currency_id: "",
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
    },

    editJurnal (row, idx){
      this.balanceActive = true
      this.isEdit = true
      this.idEdit = idx
      this.tempBalance = row

      if(row.account_group_id === 4){
        this.payableActive = false
        this.receivableActive = true
        this.getCustomer()
      }else if(row.account_group_id === 7 || row.account_group_id === 14){
        this.payableActive = true
        this.receivableActive = false
        this.getSupplier()
      }else{
        this.payableActive = false
        this.receivableActive = false
        this.dataCustomer = []
        this.dataSupplier = []
      }
    },

    cancelEditJurnal (){
      this.balanceActive = false
      this.isEdit = false
      this.idEdit = ''
      this.tempBalance = {}
    },

    handleEditJurnal (){
      this.dataBalance.splice(this.idEdit, 1);

      this.dataBalance.push(this.tempBalance)
      this.isEdit = false
      this.idEdit = ''
      this.balanceActive = false
      this.payableActive = false
      this.receivableActive = false
      this.dataCustomer = []
      this.dataSupplier = []
      this.tempBalance = {
        date: "",
        account_no: "",
        jurnal_id: "",
        jurnal_description: "",
        currency_id: "",
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
    },


    handleSaveJurnalBalance () {
      let debit = 0;
      let credit = 0;
      this.dataBalance.forEach((item, index) => {
        debit += item.amount_debit
        credit += item.amount_credit
      });

      if(debit = credit){
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
          method: 'PUT',
          url: baseApi(this.selectedStore.url_id, this.langId, 'account/multijurnal/'+ this.jurnalId),
          headers: headers,
          data: this.dataBalance
        }).then(response => {
          this.loadingAddJurnal = false
          this.handleCloseJurnalBalance()
          this.$message({
            message: this.$lang[this.langId].success_add,
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
          this.loadingAddJurnal = false
        })
      }else{
        this.$notify({
          type: 'warning',
          message: this.$lang[this.langId].unbalance_jurnal
        })
      }
    },

    handleCloseJurnalBalance () {
      this.cancelJurnalName()
      this.balanceActive = false
      this.payableActive = false
      this.receivableActive = false
      this.dataSupplier = []
      this.dataCustomer = []
      this.tempBalance = {
        date: "",
        account_no: "",
        jurnal_id: "",
        jurnal_description: "",
        currency_id: "",
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
      this.$emit('close')
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

    saveAccount () {
      this.loadingAddAccount = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let data = {
        account_name: this.tempAccount.account_name,
        account_no: this.tempAccount.account_number,
        account_group_id: this.tempAccount.category,
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
        this.tempAccount.account_name = ''
        this.tempAccount.account_number = ''
        this.tempAccount.category = ''
        this.tempAccount.accumulated_depreciation = ''
        this.tempBalance.account_no = ''
        this.$message({
            message: 'Success',
            type: 'success'
          })
        this.getAccount()
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

    closeAddAccount () {
      this.accumulationDepreciation = false
      this.tempAccount.account_name = ''
      this.tempAccount.account_number = ''
      this.tempAccount.category = ''
      this.tempAccount.accumulated_depreciation = ''
      this.tempBalance.account_no = ''
    },

    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      
      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = 'Total';
          return;
        }
        
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] =  this.formatPrice(values.reduce((prev, curr) => {
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
    
    dateFormat(date){
      return moment(date).format('DD MMM YYYY');
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
  }
}
</script>
