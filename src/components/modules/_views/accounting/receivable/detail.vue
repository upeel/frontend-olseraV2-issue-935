<template>
    <div>
      <el-card class="box-card pos-relative">
        <div class="card-body">
          <div class="inventory-status"  :class="classBasedOnStatus">
            <template v-if="this.data.payment == 'Unpaid' || this.data.payment == 'Belum dibayar' || this.data.payment == 'Partial' || this.data.payment == 'Parsial'">
              <span align="center"><i class="el-icon-document"></i><br> {{data.payment}}</span>
            </template>
            <template v-if="this.data.payment == 'Paid' || this.data.payment == 'Lunas'">
              <span align="center"><i class="el-icon-circle-check"></i><br>{{data.payment}}</span>
            </template>
          </div>
          <div class="row with-padding-left">
            <div class="col-md-9">
              <small style="color: #ccc;">{{$lang[langId].receivable}}</small>
              <h4 v-if="!data.transaction_description">-</h4>
              <h4 v-else>{{ capitalize(data.transaction_description) }}</h4>
            </div>
            <div class="col-md-3 text-right">
              <el-button icon="el-icon-back" size="small" type="success" plain @click="backHandle">{{ lang.back }}</el-button>
            </div>
          </div>
        </div>
      </el-card>
      <el-card class="box-card">
        <div class="row table-handler-flex">
          <div class="col-xs-12 col-sm-10 col-md-10 col-lg-10 text-left">
            <div class="visible-lg visible-md visible-sm text-left inline">
              <el-select :placeholder="$lang[langId].select" v-model="params.search_column" @change="selectFilter">
                <el-option
                  v-for="item in filter"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-date-picker
                v-if="params.search_column === 'transaction_date'"
                v-model="params.search_text"
                type="date"
                format="dd MMM yyyy"
                @change="handleSearch"
                :placeholder="$lang[langId].pick_a_day">
              </el-date-picker>
              <el-input
                v-if="params.search_column === 'transaction_no' || params.search_column === 'transaction_name' || params.search_column === 'transaction_description' || params.search_column === 'external_no'"
                class="inline-form input-search"
                clearable
                :placeholder="lang.search"
                prefix-icon="el-icon-search"
                v-model="params.search_text"
                @change="handleSearch">
              </el-input>
            </div>
            <div class="visible-xs text-center">
                <el-select :placeholder="$lang[langId].select" v-model="params.search_column" @change="selectFilter" style="width: 100%;">
                <el-option
                  v-for="item in filter"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>

          <div class="col-xs-12 visible-xs text-center" style="margin-top: 10px">
            <el-date-picker
              v-if="params.search_column === 'transaction_date'"
              v-model="params.search_text"
              type="date"
              format="dd MMM yyyy"
              @change="handleSearch"
              :placeholder="$lang[langId].pick_a_day"
              style="width: 100%;">
            </el-date-picker>
            <el-input
              v-if="params.search_column === 'transaction_no' || params.search_column === 'transaction_name' || params.search_column === 'transaction_description' || params.search_column === 'external_no'"
              style="width: 100%;"
              clearable
              :placeholder="lang.search"
              prefix-icon="el-icon-search"
              v-model="params.search_text"
              @change="handleSearch" size="small">
            </el-input>
          </div>
        </div>

        <div style="margin-top: 24px">
          <el-table
            ref="multipleTable"
            :data="dataDetail"
            v-loading="isLoading"
            class="product-table-max-height mobile-fix-height-unset"
            stripe>
            <el-table-column
              prop="transaction_date"
              :label="lang.date"
              width="120">
              <template slot-scope="scope">
                <span>{{scope.row.ftransaction_date}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="transaction_no"
              :label="lang.transaction_no"
              width="160">
            </el-table-column>
            <el-table-column
              prop="transaction_description"
              :label="lang.description"
              width="200">
              <template slot-scope="scope">
                <span>{{capitalize(scope.row.transaction_description)}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="int_amount"
              :label="'Amount (' + selectedStore.currency_id + ')'"
              align="right">
              <template slot-scope="scope">
                <div v-if="scope.row.famount !== null">{{ scope.row.famount }}</div>
                <div v-else>{{selectedStore.currency_id}} 0</div>
              </template>
            </el-table-column>
            <el-table-column :label="$lang[langId].action" align="center" width="80">
              <template slot-scope="scope">
                <el-dropdown trigger="click" style="padding: inherit">
                  <el-button type="text" icon="el-icon-more" style="color:#909399"></el-button>
                  <el-dropdown-menu slot="dropdown" style="background-color: #F2F2F2;">
                    <el-dropdown-item style="padding: 0px">
                      <el-button type="text" class="accounting-dropBtn" @click="showPairDialog(scope.row)">
                        <svg-icon icon-class="arrow-couple"></svg-icon>
                        {{ $lang[langId].jurnal_pair }}
                      </el-button>
                    </el-dropdown-item>
                    <el-dropdown-item style="padding: 0px">
                      <el-button type="text" style="color: #000000;" class="accounting-dropBtn" @click="editJurnal(scope.row)">
                        <svg-icon icon-class="edit"></svg-icon>
                        {{ lang.edit }}
                      </el-button>
                    </el-dropdown-item>
                    <el-dropdown-item style="padding: 0px">
                      <el-button type="text" style="color: #FF0000;" class="accounting-dropBtn" @click="showDeleteDialog(scope.row)">
                        <svg-icon icon-class="trash" stroke="#FF0000"></svg-icon>
                        {{ $lang[langId].delete }}
                      </el-button>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 20px; margin-bottom: -55px">
            <el-select v-model="params.per_page"  @change="handleSizeChange" :placeholder="$lang[langId].select" class="perpage" style="width: 120px">
              <el-option
                v-for="item in itemPage"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div style="text-align: center">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="params.currentPage"
              :page-size="parseInt(params.per_page)"
              layout="total, prev, pager, next, jumper"
              :total="params.total"
              class="paginate">
            </el-pagination>
          </div>
        </div>
      </el-card>

      <el-dialog
        :visible.sync="dialogEditJurnal"
        :show-close="false"
        width="40%"
        custom-class="dialog-card"
        :before-close="cancelJurnal">
        <div slot="title" class="flex-container" style="text-align: center">
          <el-row :gutter="20"  style="width: 100%">
            <el-col :span="14">
              <h4 class="dialog-title" style="padding-left: 5%; text-align: left;">Jurnal</h4>
            </el-col>
            <el-col :span="10" align="right">
              <div class="btn_accounting_dialog">
                <el-button type="info" @click="cancelJurnal">{{ lang.cancel }}</el-button>
                <el-button :disabled="loadingEdit" type="success" @click="handleUpdateJurnal">{{ lang.update }}</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
        <div style="width: 100%; padding: 0 5% 0 5%;">
          <el-form @submit.native.prevent>
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
              <label style="font-size: 12px">{{ lang.customer }} <span style="color: #F44336">*</span></label>
            </div>
            <el-form-item>
              <el-select 
                style="width: 100%"  
                filterable 
                :placeholder="$lang[langId].select + ' ' + lang.customer"
                v-model="formEditJurnal.customer_id"
                :value="formEditJurnal.customer_id">
                <el-option
                  v-for="item in dataCustomer"
                  :key="item.id"
                  :label="capitalize(item.name)"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <div>
              <label style="font-size: 12px">{{ $lang[langId].debit_account }}</label>
            </div>
            <el-form-item>
              <el-select v-model="formEditJurnal.debit_account" filterable :placeholder="$lang[langId].select + ' ' + $lang[langId].debit_account" style="width: 100%">
                <el-option
                  v-for="item in dataAccount"
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
                  v-for="item in dataAccount"
                  :key="item.account_no"
                  :label="item.account_no + ' '+ capitalize(item.account_name)"
                  :value="item.account_no">
                </el-option>
              </el-select>
            </el-form-item>
            <div>
              <label style="font-size: 12px">{{ lang.due_date }}</label>
            </div>
            <el-form-item>
              <el-date-picker
                v-model="formEditJurnal.due_dates"
                type="date"
                :placeholder="$lang[langId].pick_a_day"
                format="dd MMMM yyyy"
                value-format="yyyy-MM-dd"
                style="width: 100%">
              </el-date-picker>
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
        :title="deleteData.purchase_sales_form !== 0 ? $lang[langId].delete + ' ' + deleteData.transaction_no : lang.notif_warn"
        :visible.sync="dialogDelete"
        width="50%" center
        :close-on-click-modal="false"
        :show-close="false">
        <div v-if="deleteData.purchase_sales_form !== 0">
          <div>
            <label style="font-size: 12px">{{ $lang[langId].note_of_deletion }} <span style="color: #F44336">*</span></label>
          </div>
          <el-input v-model="deleteNote" type="textarea" :rows="3"></el-input>
        </div>
        <div class="text-center" v-else>
          <p>{{ $lang[langId].are_you_want_remove }} {{ lang.transaction }} </p>
          <p style="font-weight: bold;">{{ deleteData.transaction_no }} - {{ capitalize(deleteData.transaction_name) }}
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-row :gutter="20" style="padding: 0 12px 0 12px;">
            <el-col :xs="0" :sm="8" :md="8" :lg="8" :xl="8" style="line-height: 2; text-align: left;">
              <label v-if="deleteData.purchase_sales_form !== 0" class="visible-lg visible-md visible-sm">(<span style="color: #F44336">*</span>) {{lang.required}}</label>
            </el-col>
            <el-col :xs="24" :sm="16" :md="16" :lg="16" :xl="16" style="text-align: right;">
              <el-button @click="cancelDeleteDialog">{{ lang.cancel }}</el-button>
              <el-button :disabled="loadingDelete" type="danger" @click="handleDelete">{{ lang.remove }}</el-button>
            </el-col>
          </el-row>
        </span>
      </el-dialog>
      <dialog-jurnal-pair
        :id="paramsPair.transaction_id"
        :no="paramsPair.transaction_no"
        :name="paramsPair.transaction_name"
        :show="dialogPair"
        @close="closePair"
      />

      <dialog-multi-jurnal-pair
        :pairId="paramsPair.pair_id"
        :show="dialogMultiPair"
        @close="closePair"
      />

      <dialog-edit-multi-jurnal
        :jurnalId="multijurnal_id"
        :show="dialogMultiJurnalEdit"
        @close="cancelJurnal"
      />
    </div>
</template>

<script>
import axios from 'axios';
import {baseApi} from 'src/http-common';
import DialogJurnalPair from 'components/modules/_views/accounting/DialogJurnalPair';
import DialogMultiJurnalPair from 'components/modules/_views/accounting/DialogMultiJurnalPair';
import DialogEditMultiJurnal from 'components/modules/_views/accounting/DialogBalanceEdit';
import InputMoneySelectCurrency from '@/components/InputMoneyV3';
import mixinAccounting from '@/mixins/mixinAccounting';
const moment = require('moment')

export default {
  data() {
    return {
      isLoading: false,
      loadingEdit: false,
      loadingDelete: false,
      itemPage: [
        {
          value: '15',
          label: '15 item'
        },{
          value: '25',
          label: '25 item'
        },{
          value: '50',
          label: '50 item'
        },{
          value: '100',
          label: '100 item'
        }
      ],
      filter: [
        {
          value: '',
          label: this.$store.state.userStores.lang.all
        },{
          value: 'transaction_no',
          label: this.$store.state.userStores.lang.transaction_no
        },{
          value: 'transaction_date',
          label: this.$store.state.userStores.lang.transaction_date
        },{
          value: 'transaction_name',
          label: this.$store.state.userStores.lang.transaction_type_name
        },{
          value: 'external_no',
          label: this.$lang[this.$store.state.userStores.langId].document_number
        },{
          value: 'transaction_description',
          label: this.$store.state.userStores.lang.description
        }
      ],
      data: '',
      dataDetail: [],
      dataJurnalName: [],
      dataAccount: [],

      dataCustomer: [],
      deleteData: {},
      deleteNote: '',
      dialogDelete: false,
      dialogPair: false,
      dialogMultiPair: false,
      dialogEditJurnal: false,
      dialogMultiJurnalEdit: false,

      isDisabledJurnalName: false,
      disabledButton: false,
      multijurnal_id: '',
      params: {
        id: this.$route.params.id,
        current_page: 1,
        per_page: 15,
        // sort_column: 'transaction_date',
        // sort_type: 'desc',
        page: 1,
        total: null
      },
      paramsPair: {
        pair_id: '',
        transaction_id: '',
        transaction_no: '',
        transaction_name: '',
      },
      formEditJurnal: {
        id: '',
        date: '',
        debit_account: '',
        credit_account: '',
        due_dates: '',
        jurnal_name: '',
        jurnal_description: '',
        currency_id: '',
        amount: 0,
        customer_id: '',
        external_no: ''
      },
      moveEdit:{
        debit_account: '',
        credit_account: ''
      },
    }
  },
  components: {
    DialogEditMultiJurnal,
    DialogJurnalPair,
    DialogMultiJurnalPair,
    InputMoneySelectCurrency
  },
  mixins: [mixinAccounting],
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
    classBasedOnStatus() {
      let className = ''
      if (this.data.payment == 'Unpaid' || this.data.payment == 'Belum dibayar') {
        className = 'draft'
      } else if (this.data.payment == 'Paid' || this.data.payment == 'Lunas') {
        className = 'posted'
      } else if (this.data.payment == 'Partial' || this.data.payment == 'Parsial') {
        className = 'partial'
      }

      return className
    },
    userRole() {
      const selectedStore = this.$store.getters.selectedStore
      return {
        role_id: selectedStore.role_id,
        role_name: selectedStore.role_name,
        is_pos_only: selectedStore.is_pos_only,
        is_mobile: selectedStore.is_mobile
      }
    }
  },
  methods: {
    selectFilter(val) {
      if(val){
        this.params.search_column = val
      } else {
        this.params = {
          id: this.$route.params.id,
          // sort_column: 'transaction_date',
          // sort_type: 'desc',
          currentPage: 1,
          per_page: 15,
          page: 1,
          total: null
        }
        this.loadData()
      }
    },

    handleSearch(val) {
        if(this.params.search_column === 'transaction_date'){
          if(val !== null){
            this.params.search_text = moment(val).format('YYYY-MM-DD')
          } else {
            this.params.search_column = ''
            this.params.search_text = ''
          }
        } else {
          this.params.search_text = val
        }
        this.params.page = 1
        if(this.params.search_column === '' || this.params.search_text === ''){
          this.params = {
            id: this.$route.params.id,
            // sort_column: 'transaction_date',
            // sort_type: 'desc',
            currentPage: 1,
            per_page: 15,
            page: 1,
            total: null
          }
        }
        this.loadData()
    },

    handleSizeChange(val) {
      this.params.per_page = val
      this.loadData()
    },

    handleCurrentChange(val, row) {
      this.params.currentPage = val
      this.params.page = val
      this.loadData()
    },

    loadData(){
      this.isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let id = this.params.id !== '' ? this.params.id : this.$route.params.id
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/receivable/' + id),
        headers: headers,
        params: {
          search_column: this.params.search_column,
          search_text: this.params.search_text,
          currentPage: this.params.current_page,
          per_page: this.params.per_page,
          page: this.params.page,
          total: this.params.total,
          // sort_column: this.params.sort_column,
          // sort_type: this.params.sort_type
        }
      }).then(response => {
        this.data = Object.keys(this.$route.params).includes('data') === true ? this.$route.params.data : this.data
        this.dataDetail = response.data.data
        this.params.id = this.$route.params.id
        this.params.per_page = response.data.meta.per_page
        this.params.currentPage = response.data.meta.current_page
        this.params.total = response.data.meta.total
        this.isLoading = false
      }).catch(error => {
        this.data = Object.keys(this.$route.params).includes('data') === true ? this.$route.params.data : this.data
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
        this.isLoading = false
      })
    },

    selectCustomer (val){
      let selected = {}
      this.dataCustomer.forEach((item, index) => {
        if (item.id === val){
          selected = item
        }
      })

      this.formEditJurnal.customer_id = selected.id
      this.formEditJurnal.due_dates = selected.due_date
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

    showDeleteDialog(row) {
      this.deleteData = row
      this.dialogDelete = true
    },

    cancelDeleteDialog() {
      this.dialogDelete = false
      this.deleteData = {}
      this.deleteNote = ''
    },

    handleDelete(){
      this.loadingDelete = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let id = this.deleteData.account_pair_id
      let params = {
        purchase_sales_form: this.deleteData.purchase_sales_form,
        reason: this.deleteNote
      }

      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/jurnal/' + id),
        headers: headers,
        params: params
      }).then(response => {
        this.dialogDelete = false
        this.loadingDelete = false
        this.deleteData = {}
        this.deleteNote = ''
        this.dataDetail.map((i, idx) => {
          if (i.account_pair_id === id) {
            this.dataDetail.splice(idx, 1)
          }
        })

        this.$message({
          message: response.data.data.message,
          type: 'success'
        })
        // this.loadData()
      }).catch(error => {
        this.loadingDelete = false
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

    showPairDialog(row){
      if(row.purchase_sales_form === 0){
        this.paramsPair = {
          pair_id: row.account_pair_id
        }
        this.dialogMultiPair = true
      }else{
        this.paramsPair = {
          transaction_id: row.transaction_id,
          transaction_no: row.transaction_no,
          transaction_name: row.transaction_name,
        }
        this.dialogPair = true
      }
    },

    closePair(){
      this.paramsPair = {
        pair_id: '',
        transaction_id: '',
        transaction_no: '',
        transaction_name: '',
      }
      this.dialogPair = false
      this.dialogMultiPair = false
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

    editJurnal(row) {
      if(row.jurnal_form === 2){
        this.multijurnal_id = row.multijurnal_id
        this.dialogMultiJurnalEdit = true
      }else{
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }

        let type = row.type

        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'account/jurnal/' + row.transaction_id + '/' + row.transaction_no),
          headers: headers,
        }).then(response => {
          this.formEditJurnal = response.data.data
          this.moveEdit = {
            debit_account: this.formEditJurnal.debit_account,
            credit_account: this.formEditJurnal.credit_account
          }
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
      }
    },

    handleUpdateJurnal () {
      this.loadingEdit = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let data = {
        date: this.formEditJurnal.date,
        debit_account: this.formEditJurnal.debit_account,
        credit_account: this.formEditJurnal.credit_account,
        jurnal_name: this.formEditJurnal.jurnal_name,
        jurnal_description: this.formEditJurnal.jurnal_description,
        due_dates: this.formEditJurnal.due_dates,
        currency_id: this.selectedStore.currency_id,
        amount: this.formEditJurnal.amount,
        external_no: this.formEditJurnal.external_no,
        reference_no: this.formEditJurnal.reference_no
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
          this.dialogEditJurnal = false
          this.loadingEdit = false
          // this.loadData()
          this.dataDetail.map((i, idx) => {
            if (i.transaction_id === id) {
              this.dataDetail[idx].ftransaction_date = update[0].fdate
              this.dataDetail[idx].transaction_no = update[0].transaction_no
              this.dataDetail[idx].external_no = update[0].external_no
              this.dataDetail[idx].transaction_description = update[0].description
              this.dataDetail[idx].famount = update[0].famount
            }
          })
          this.getAccount()
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
        this.loadingEdit = false
      })
    },

    cancelJurnal() {
      this.formEditJurnal = {
        transaction_id: '',
        transaction_no: '',
        date: '',
        debit_account: '',
        credit_account: '',
        due_dates: '',
        jurnal_name: '',
        jurnal_description: '',
        currency_id: '',
        amount: 0,
        external_no: ''
      },
      this.getAccount()
      this.loadData()
      this.multijurnal_id = ''
      this.dialogEditJurnal = false
      this.dialogMultiJurnalEdit = false
    },

    backHandle() {
      let lastParams = this.$route.params.lastParams
      let lastStatus = this.$route.params.lastStatus
      let lastFilter = this.$route.params.lastFilter
      this.$router.push({name: 'Receivable', params: {lastParams: lastParams, lastStatus: lastStatus, lastFilter: lastFilter}})
    },
  },
  mounted() {
    this.loadData()
    this.getJurnalName()
    this.getAccount()
    this.getCustomer()
  }
}
</script>

<style lang="scss" scoped>
  .cart-items {
    float: none;
    padding: 0;
    // li {
    //   padding: 8px 0 8px 0;
    // }
    h5 {
      font-weight: 600;
      margin-top: 2px;
      margin-bottom: 0;
    }
  }
</style>
