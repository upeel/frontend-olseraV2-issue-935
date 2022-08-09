<template>
  <div>
    <div class="content-wrapper">
      <section class="content-accounting">
        <el-card class="box-card pos-relative">
          <div class="card-body">
            <div class="inventory-status"  :class="classBasedOnStatus">
              <template v-if="data.asset_status === 'Active' || data.asset_status === 'Aktif'">
                <span align="center"><i class="el-icon-document"></i><br> {{data.asset_status}}</span>
              </template>
              <template v-if="data.asset_status === 'Finish' || data.asset_status === 'Selesai'">
                <span align="center"><i class="el-icon-circle-check"></i><br>{{data.asset_status}}</span>
              </template>
            </div>
            <div class="row with-padding-left">
              <div class="col-md-9">
                <small style="color: #ccc;">{{data.transaction_no}}</small>
                <h4 v-if="!data.description">-</h4>
                <h4 v-else>{{ capitalize(data.description) }}</h4>
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
                  v-if="params.search_column === 'date'"
                  v-model="params.search_text"
                  type="date"
                  format="dd MMM yyyy"
                  @change="handleSearch"
                  :placeholder="$lang[langId].pick_a_day">
                </el-date-picker>
                <el-input
                  v-if="params.search_column === 'int_amount'"
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
                v-if="params.search_column === 'date'"
                v-model="params.search_text"
                type="date"
                format="dd MMM yyyy"
                @change="handleSearch"
                :placeholder="$lang[langId].pick_a_day"
                style="width: 100%;">
              </el-date-picker>
              <el-input
                v-if="params.search_column === 'int_amount'"
                style="width: 100%;"
                clearable
                :placeholder="lang.search"
                prefix-icon="el-icon-search"
                v-model="params.search_text"
                @change="handleSearch" size="small">
              </el-input>
            </div>
            <div class="col-xs-12 col-sm-2 col-md-2 col-lg-2 text-right">
              <el-button type="primary" @click="showAddDialog">
                {{ lang.add }}
              </el-button>
            </div>
          </div>

          <div style="margin-top: 24px">
            <el-table
              ref="multipleTable"
              :data="dataMaintaince"
              v-loading="isLoading"
              class="product-table-max-height mobile-fix-height-unset"
              stripe>
              <el-table-column
                prop="date"
                :label="lang.date"
                width="120">
                <template slot-scope="scope">
                  <span>{{scope.row.fdate}}</span>
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
                  <span>{{capitalize(scope.row.description)}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="int_amount"
                :label="lang.amount"
                align="right">
                <template slot-scope="scope">
                  <div>{{ scope.row.famount }}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="status"
                :label="lang.status"
                align="center"
                width="140">
                <template slot-scope="scope">
                  <div>{{ scope.row.status}}</div>
                </template>
              </el-table-column>
              <el-table-column :label="$lang[langId].action" align="center" width="90px">
                <template slot-scope="scope">
                  <el-button type="text" @click="showDeleteDialog(scope.row)" style="color: #FF0000;">
                    <svg-icon icon-class="trash" stroke="#FF0000"></svg-icon>
                    {{ lang.remove }}
                  </el-button>
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
      </section>
    </div>

    <el-dialog
      :visible.sync="dialogAdd"
      :show-close="false"
      width="40%"
      custom-class="dialog-card">
      <div slot="title" class="flex-container">
        <el-row :gutter="20"  style="width: 100%">
          <el-col :span="12">
            <h4 class="dialog-title" style="padding-left: 5%; text-align: left;">{{ lang.add }} {{ $lang[langId].maintaince_asset }}</h4>
          </el-col>
          <el-col :span="12">
            <div class="btn_accounting_dialog" align="right">
              <el-button type="info" @click="handleCloseAdd">{{ lang.cancel }}</el-button>
              <el-button :disabled="loadingAddMaintaince" type="success" @click="handleSaveMaintaince">
                <loading
                  v-if="loadingAddMaintaince"
                  align="center"
                  :active="true"
                  color= '#1bb4e6'
                  loader="dots"
                  :width="28"
                  :height="10"
                  backgroundColor='#ffffff'>
                </loading>
                <span v-else>{{ lang.save }}</span>
              </el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <div style="width: 100%; padding: 0 5% 0 5%; margin-top: -10px;">
        <el-form @submit.native.prevent style="width: 100%">
          <div>
            <label style="font-size: 12px">{{ lang.description }} <span style="color: #F44336">*</span></label>
          </div>
          <el-form-item>
            <el-input placeholder="" v-model="formData.description"></el-input>
          </el-form-item>
          <div>
            <label style="font-size: 12px">{{ lang.date }} <span style="color: #F44336">*</span></label>
          </div>
          <el-form-item>
            <el-date-picker 
              v-model="formData.date"
              type="date" 
              :placeholder="this.$lang[langId].pick_a_day" 
              format="dd MMMM yyyy" 
              value-format="yyyy-MM-dd"
              style="width: 100%">
            </el-date-picker>
          </el-form-item>
          <div>
            <label style="font-size: 12px">{{ lang.category }}</label>
          </div>
          <el-form-item>
            <el-radio-group v-model="formData.add_asset_value" @change="changeCategory" size="medium">
              <el-radio-button label="1">Menambah nilai aset</el-radio-button>
              <el-radio-button label="0">Asset dibebankan</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <div>
            <label style="font-size: 12px">{{ lang.amount }}</label>
          </div>
          <el-form-item>
            <vue-numeric 
              :currency="selectedStore.currency_id" separator="," decimal-separator="."
              v-bind:precision="2" v-model="formData.amount"
              v-bind:minus="false" :allow-clear="true"
              class="form-input input-md input-money">
            </vue-numeric>
          </el-form-item>
          <div>
            <label style="font-size: 12px">{{ $lang[langId].debit_account }}</label>
          </div>
          <el-form-item>
            <el-select v-show="formData.add_asset_value === '1'" v-model="formData.debitValue" filterable style="width: 100%" :placeholder="$lang[langId].select + ' ' + lang.category">
              <el-option
                v-for="item in dataValue"
                :key="item.id"
                :label="item.account_no +' '+capitalize(item.account_name)"
                :value="item.account_no">
              </el-option>
            </el-select>
            <el-select v-show="formData.add_asset_value === '0'" v-model="formData.debitExspense" filterable style="width: 100%" :placeholder="$lang[langId].select + ' ' + lang.category">
              <el-option
                v-for="item in dataExpense"
                :key="item.id"
                :label="item.account_no +' '+ capitalize(item.account_name)"
                :value="item.account_no">
              </el-option>
            </el-select>
          </el-form-item>
          <div>
            <label style="font-size: 12px">{{ $lang[langId].credit_account }}</label>
          </div>
          <el-form-item>
            <el-select v-model="formData.credit" filterable style="width: 100%" :placeholder="$lang[langId].select + ' ' + lang.category">
              <el-option
                v-for="item in dataCredit"
                :key="item.id"
                :label="item.account_no +' '+ capitalize(item.account_name)"
                :value="item.account_no">
              </el-option>
            </el-select>
          </el-form-item>
          <div v-show="formData.add_asset_value === '1'">
            <div>
              <label style="font-size: 12px">{{ $lang[langId].residual_value }}</label>
            </div>
            <el-form-item>
              <vue-numeric 
                :currency="selectedStore.currency_id" separator="," decimal-separator="."
                v-bind:precision="2" v-model="formData.add_residu"
                v-bind:minus="false" :allow-clear="true"
                class="form-input input-md input-money">
              </vue-numeric>
            </el-form-item>
            <div>
              <label style="font-size: 12px">{{ $lang[langId].economic_life }}</label>
            </div>
            <el-form-item>
              <el-input
                v-model="formData.add_economic_life"
                onkeydown="return ( event.ctrlKey || event.altKey 
                    || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                    || (95<event.keyCode && event.keyCode<106)
                    || (event.keyCode==8) || (event.keyCode==9) 
                    || (event.keyCode>34 && event.keyCode<40) 
                    || (event.keyCode==46) )"
                class="input-with-select">
                <el-select v-model="formData.life_as_year" slot="append" placeholder="Select" width="100">
                  <el-option :label="lang.month" value="0">{{lang.month}}</el-option>
                  <el-option :label="lang.year" value="1">{{lang.year}}</el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </el-dialog>

    <el-dialog 
      :title="lang.notif_warn" 
      :visible.sync="dialogDelete" 
      width="50%" center 
      :close-on-click-modal="false" 
      :show-close="false">
      <div class="text-center">
        <p>{{ $lang[langId].are_you_want_remove }} {{ $lang[langId].maintaince_asset }} </p>
        <p style="font-weight: bold;">{{ deleteData.transaction_no }}
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDeleteDialog">{{ lang.cancel }}</el-button>
        <el-button :disabled="loadingDelete" type="danger" @click="handleDelete">{{ lang.remove }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import {baseApi} from 'src/http-common';
import mixinAccounting from '@/mixins/mixinAccounting';
import Loading from 'vue-loading-overlay';
const moment = require('moment')

export default {
  name:"MaintainceAsset",
  components: {
    Loading
  },

  data() {
    return {
      isLoading: false,
      loadingDelete: false,
      loadingAddMaintaince: false,
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
          value: 'int_amount',
          label: this.$store.state.userStores.lang.amount
        }
      ],
      data: '',
      dataMaintaince: [],
      dataValue: [],
      dataExpense: [],
      dataCredit: [],
      deleteData: {},
      deleteNote: '',
      dialogDelete: false,
      dialogAdd: false,
      isDisabledJurnalName: false,
      formData: {
        date: "",
        debitValue: "",
        debitExspense: "",
        credit: "",
        description: "",
        amount: "0",
        add_asset_value: "1",
        add_residu: "0",
        add_economic_life: "0",
        life_as_year: "0",
        currency_id: this.$store.getters.selectedStore.currency_id
      },
      params: {
        id: this.$route.query.id,
        current_page: 1,
        per_page: 15,
        // sort_column: 'date',
        // sort_type: 'desc',
        page: 1,
        total: null
      },
    }
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
      if (this.data.asset_status === 'Active' || this.data.asset_status === 'Aktif') {
        className = 'posted'
      } else if (this.data.asset_status === 'Finish' || this.data.asset_status === 'Selesai') {
        className = 'partial'
      }
      return className
    }
  },
  methods: {
    selectFilter(val) {
      if(val){
        this.params.search_column = val
      } else {
        this.params = {
          id: this.$route.query.id,
          // sort_column: 'date',
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
        if(this.params.search_column === 'date'){
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
            id: this.$route.query.id,
            // sort_column: 'date',
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

      let id = this.params.id !== '' ? this.params.id : this.$route.query.id
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/asset/maintenance/' + id),
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
        this.data = Object.keys(this.$route.query).includes('data') === true ? this.$route.query.data : this.data
        this.dataMaintaince = response.data.data
        this.params.id = this.$route.query.id
        this.params.per_page = response.data.meta.per_page
        this.params.currentPage = response.data.meta.current_page
        this.params.total = response.data.meta.total
        this.isLoading = false
      }).catch(error => {
        this.data = Object.keys(this.$route.query).includes('data') === true ? this.$route.query.data : this.data
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

    getExpense () {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/name/expenses'),
        headers: headers
      }).then(response => {
        this.dataExpense = response.data.data
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

    getValue () {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/name/asset'),
        headers: headers
      }).then(response => {
        this.dataValue = response.data.data
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

    getCedit() {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/name/cash'),
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

    showAddDialog(){
      this.dialogAdd = true
    },

    handleCloseAdd(){
			this.loadData()
      this.dialogAdd = false
    },

    handleSaveMaintaince(){
      this.loadingAddMaintaince = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let id = this.$route.query.id
      let form = this.formData
      let data = {
        date: form.date,
        debit: form.debitExspense,
        credit: form.credit,
        description: form.description,
        amount: form.amount,
        currency_id: form.currency_id
      }

      if(form.add_asset_value === '1'){
        data.debit = form.debitValue
        data.add_asset_value = form.add_asset_value
        data.add_residual = form.add_residu
        data.add_economic_life = form.add_economic_life
        data.life_as_year = form.life_as_year
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/asset/maintenance/'+id),
        headers: headers,
        data
      }).then(response => {
        this.loadingAddMaintaince = false
        this.dialogAdd = false
        this.formData = {
          date: "",
          debitValue: "",
          debitExspense: "",
          credit: "",
          description: "",
          amount: "",
          add_asset_value: "1",
          add_residu: "",
          add_economic_life: "0",
          life_as_year: "0",
          currency_id: this.$store.getters.selectedStore.currency_id
        }
        this.loadData()
      }).catch(error => {
        this.loadingAddMaintaince = false
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

    changeCategory(val){
      if(val === '0' && this.dataExpense.length === 0){
        this.getExpense()
      }
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

      let id = this.deleteData.id

      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/asset/maintenance/detail/' + id),
        headers: headers
      }).then(response => {
        this.dialogDelete = false
        this.loadingDelete = false
        this.deleteData = {}
        this.deleteNote = ''
        this.dataMaintaince.map((i, idx) => {
          if (i.id === id) {
            this.dataMaintaince.splice(idx, 1)
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


    backHandle() {
      this.$router.push({path: '/accounting/asset'})
    },
  },
  mounted() {
    this.loadData()
    this.getValue()
    this.getCedit()
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
