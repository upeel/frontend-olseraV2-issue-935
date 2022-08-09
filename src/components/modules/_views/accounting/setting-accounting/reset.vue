<template>
  <div class="content-wrapper">
    <section class="content-accounting">
      <div v-loading="loadingSetup">
        <el-card class="box-card">
          <div class="row">
            <div class="col-md-4">
              <h4 class="font-bold">{{ $lang[langId].accounting_setting }}</h4>
            </div>
            <div class="col-md-8 text-right">
              <el-button v-if="isSetup === 'true'" type="danger" @click="handleDialogReset">
                <svg-icon icon-class="x-square"></svg-icon>
                {{ $lang[langId].stop_now }}
              </el-button>
              <el-button v-else type="success" @click="dialogSetup = true" icon="el-icon-setting">
                {{ $lang[langId].set_up_now }}
              </el-button>
            </div>
          </div>
        </el-card>

        <el-card v-loading="loadingSetup" class="box-card">
          <div slot="header" class="table-handler-flex">
            <h4 style="flex-grow: 1">{{ dataStore.name }}</h4>
            <div>
              <div v-if="inSetting !== 'general'">
                <div v-if="editedProductGroup.length !== 0">
                  <el-button @click="cancelMapGroup" size="small" type="info">
                    {{lang.cancel}}
                  </el-button>
                  <el-button @click="mapProductGroup" size="small" type="success" :disabled="loadingMap" :loading="loadingMap">
                    {{lang.save}}
                  </el-button>
                </div>
                <div v-else>
                  <el-input
                    v-model="paramsGroup.search"
                    :placeholder="lang.product_name"
                    clearable
                    prefix-icon="el-icon-search"
                    size="small"
                    @change="loadProductGroup"
                    style="max-width: 200px;">
                  </el-input>
                  <el-button @click="changePageSet('general')" size="small" type="primary">
                    {{ $lang[langId].accounting_setting }}
                  </el-button>
                </div>
              </div>
            </div>
          </div>
          <div class="card-body" v-show="inSetting === 'general'">
            <div class="row equal-cols" v-if="loggedInUser.email === 'akmal@olsera.com'">
              <div class="col-sm-6 col-md-4 col-lg-4 col-left" style="border-right: 1px solid #eff2f6">
              <div>
                <div class="sub-title mb-12">
                  <span class="font-16 color-primary font-bold">{{$lang[langId].transaction_setting}}</span>
                  <div style="float: right;">
                    <el-button v-if="isEdit" size="mini" @click="cancel">{{ lang.cancel }}</el-button>
                    <el-button v-if="isEdit" size="mini" type="success" @click="save" :loading="loadingSet" :disabled="loadingSet">{{ lang.save }}</el-button>
                  </div>
                </div>
                <div class="demo-basic--circle">
                  <el-form @submit.native.prevent>
                    <div>
                      <label style="font-size: 12px">{{ lang.payment_due_date }}</label>
                    </div>
                    <el-form-item>
                      <el-input :disabled="dataStore.transfer_as_sales === 0" @change="edit" type="number" min="1" v-model="dataStore.due_date" style="font-weight: bolder; color: black;">
                        <template slot="append">{{lang.days}}</template>
                      </el-input>
                    </el-form-item>
                    <div>
                      <label style="font-size: 12px">{{ $lang[langId].transfer_as_sales }}</label>
                    </div>
                    <el-form-item>
                      <el-radio-group v-model="dataStore.transfer_as_sales" @change="edit">
                        <el-radio :label="0" border>{{$lang[langId].no}}</el-radio>
                        <el-radio :label="1" border>{{$lang[langId].yes}}</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
              </div>
              <div class="col-sm-6 col-md-4 col-lg-4 col-center" style="border-right: 1px solid #eff2f6">
                <div>
                  <div class="sub-title mb-12">
                    <span class="font-16 color-primary font-bold">{{$lang[langId].product_setting}}</span>
                    <div style="float: right;">
                      <el-button  :disabled="dataStore.account_product_group === 0" size="small" type="primary" @click="changePageSet('product')">
                        {{ lang.save }}
                      </el-button>
                    </div>
                  </div>
                  <div class="demo-basic--circle">
                    <el-form @submit.native.prevent>
                      <div>
                        <label style="font-size: 12px">{{ $lang[langId].activate_product_group }}</label>
                      </div>
                      <el-form-item>
                        <el-switch
                          :disabled="loadingProductOn"
                          v-model="accountProductGroup"
                          @change="changeProductGroup"
                          :active-text="$lang[langId].activate"
                          :inactive-text="$lang[langId].deactivate">
                        </el-switch>
                      </el-form-item>
                    </el-form>
                  </div>
                </div>
              </div>
              <div class="col-sm-6 col-md-4 col-lg-4 col-right">
                <div>
                  <div class="sub-title mb-12">
                    <span class="font-16 color-primary font-bold">{{ $lang[langId].autoPosTrx }}</span>
                    <div style="float: right;">
                      <el-button :disabled="loadingPOSTrx" :loading="loadingPOSTrx" size="small" type="primary" @click="saveSetPOSTrx">
                        {{ lang.save }}
                      </el-button>
                    </div>
                  </div>
                  <div class="demo-basic--circle">
                    <el-form @submit.native.prevent>
                      <div>
                        <label style="font-size: 12px">{{ $lang[langId].process_date }}</label>
                      </div>
                      <el-form-item>
                        <el-date-picker
                          v-model="dataPOSTrx.account_date_start"
                          :disabled="parseInt(dataPOSTrx.scheduled) === 0"
                          type="datetime"
                          format=" HH:mm - dd MMM yyyy"
                          style="width: 100%;"
                          placeholder="Select date and time">
                        </el-date-picker>
                      </el-form-item>
                      <div>
                        <label style="font-size: 12px">{{ $lang[langId].scheduling }}</label>
                      </div>
                      <el-form-item>
                        <el-radio-group v-model="dataPOSTrx.scheduled">
                          <el-radio :label="0" border>{{$lang[langId].no}}</el-radio>
                          <el-radio :label="1" border>{{$lang[langId].yes}}</el-radio>
                        </el-radio-group>
                      </el-form-item>
                      <div>
                        <label style="font-size: 12px">{{ lang.sales }}</label>
                      </div>
                      <el-form-item>
                      <el-switch
                          :disabled="parseInt(dataPOSTrx.scheduled) === 0"
                          v-model="scheduleSales"
                          :active-text="$lang[langId].activate"
                          :inactive-text="$lang[langId].deactivate">
                        </el-switch>
                      </el-form-item>
                      <div>
                        <label style="font-size: 12px">{{ lang.sales_return }}</label>
                      </div>
                      <el-form-item>
                      <el-switch
                          :disabled="parseInt(dataPOSTrx.scheduled) === 0"
                          v-model="scheduleSalesReturn"
                          :active-text="$lang[langId].activate"
                          :inactive-text="$lang[langId].deactivate">
                        </el-switch>
                      </el-form-item>
                      <div>
                        <label style="font-size: 12px">{{ lang.revenue +' & '+ lang.expense }}</label>
                      </div>
                      <el-form-item>
                        <el-switch
                          :disabled="parseInt(dataPOSTrx.scheduled) === 0"
                          v-model="scheduleInex"
                          :active-text="$lang[langId].activate"
                          :inactive-text="$lang[langId].deactivate">
                        </el-switch>
                      </el-form-item>
                    </el-form>
                  </div>
                </div>
              </div>
            </div>

            <el-row :gutter="20" v-else>
              <el-col :span="12" style="border-right: 1px solid #eff2f6">
                <div class="sub-title mb-12">
                  <span class="font-16 color-primary font-bold">{{$lang[langId].transaction_setting}}</span>
                  <div style="float: right;">
                    <!-- <el-button v-if="!isEdit" size="mini" type="primary" @click="edit">{{ lang.edit }}</el-button> -->
                    <el-button v-if="isEdit" size="mini" @click="cancel">{{ lang.cancel }}</el-button>
                    <el-button v-if="isEdit" size="mini" type="success" @click="save" :loading="loadingSet" :disabled="loadingSet">{{ lang.save }}</el-button>
                  </div>
                </div>
                <div class="demo-basic--circle">
                  <el-form @submit.native.prevent>
                    <div>
                      <label style="font-size: 12px">{{ lang.payment_due_date }}</label>
                    </div>
                    <el-form-item>
                      <el-input :disabled="dataStore.transfer_as_sales === 0" @change="edit" type="number" min="1" v-model="dataStore.due_date" style="font-weight: bolder; color: black;">
                        <template slot="append">{{lang.days}}</template>
                      </el-input>
                    </el-form-item>
                    <div>
                      <label style="font-size: 12px">{{ $lang[langId].transfer_as_sales }}</label>
                    </div>
                    <el-form-item>
                      <el-radio-group v-model="dataStore.transfer_as_sales" @change="edit">
                        <el-radio :label="0" border>{{$lang[langId].no}}</el-radio>
                        <el-radio :label="1" border>{{$lang[langId].yes}}</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-form>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="sub-title mb-12">
                  <span class="font-16 color-primary font-bold">{{$lang[langId].product_setting}}</span>
                  <div style="float: right;">
                   
                  </div>
                </div>
                <div class="demo-basic--circle">
                  <el-form @submit.native.prevent>
                    <el-row :gutter="20">
                      <el-col :xs="24" :sm="12" :md="12" :lg="14" :xl="14">
                        <div>
                          <label style="font-size: 12px">{{ $lang[langId].activate_product_group }}</label>
                        </div>
                        <el-form-item>
                        <el-switch
                            :disabled="loadingProductOn"
                            v-model="accountProductGroup"
                            @change="changeProductGroup"
                            :active-text="$lang[langId].activate"
                            :inactive-text="$lang[langId].deactivate">
                          </el-switch>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="24" :sm="12" :md="12" :lg="10" :xl="10" align="right">
                        <el-button  :disabled="dataStore.account_product_group === 0" size="small" type="primary" @click="changePageSet('product')">
                          {{ $lang[langId].set_product_groups }}
                        </el-button>
                      </el-col>
                    </el-row>
                  </el-form>
                </div>
              </el-col>
            </el-row>

          </div>
          <div class="card-body" v-show="inSetting === 'product'">
            <div v-if="loadingGroup === false">
              <el-tag type="info" size="small" class="tag-jurnal-info mb-16 color-black" align="center">
                Jika column di kosongkan maka akan memakai default akun untuk penjualan,pembelian dan inventory
              </el-tag>
              <el-table
                ref="multipleTable"
                :data="dataProductGrup"
                class="product-table-max-height mobile-fix-height-unset"
                max-height="340"
                stripe>
                <el-table-column 
                  v-if="editedProductGroup.length !== 0"
                  prop="isModified"
                  width="30"
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.isModified">
                      <svg-icon type="edit"></svg-icon>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="name"
                  :label="$lang[langId].product_groups">
                  <template slot-scope="scope">
                    <span>{{capitalize(scope.row.name)}}</span>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="sales_account_id"
                  :label="lang.sales">
                  <template slot-scope="scope">
                    <el-select 
                      :placeholder="$lang[langId].select"
                      filterable
                      :value="scope.row.sales_account_id"
                      @input="(value) => selectSales(value, scope.row)"
                      style="width: 100%">
                      <el-option
                        v-for="(item, keySales) in dataSales"
                        :key="keySales"
                        :label="item.account_no + ' '+ item.account_name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="purchase_account_id"
                  :label="lang.purchase">
                  <template slot-scope="scope">
                    <el-select 
                      :placeholder="$lang[langId].select"
                      filterable
                      :value="scope.row.purchase_account_id"
                      @input="(value) => selectPurchase(value, scope.row)"
                      style="width: 100%">
                      <el-option
                        v-for="(item, keyPurchase) in dataCogs"
                        :key="keyPurchase"
                        :label="item.account_no + ' '+ item.account_name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="inventory_account_id"
                  :label="lang.inventory">
                  <template slot-scope="scope">
                    <el-select 
                      :placeholder="$lang[langId].select"
                      filterable
                      :value="scope.row.inventory_account_id"
                      @input="(value) => selectInventory(value, scope.row)"
                      style="width: 100%">
                      <el-option
                        v-for="(item, keyInventory) in dataInventory"
                        :key="keyInventory"
                        :label="item.account_no + ' '+ item.account_name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <!-- <el-table-column
                  prop="cogs_account_id"
                  label="COGS">
                  <template slot-scope="scope">
                    <el-select 
                      :placeholder="$lang[langId].select"
                      filterable
                      :value="scope.row.cogs_account_id"
                      @input="(value) => selectCogs(value, scope.row)"
                      style="width: 100%">
                      <el-option
                        v-for="(item, keyCogs) in dataCogs"
                        :key="keyCogs"
                        :label="item.account_no + ' '+ item.account_name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column> -->
              </el-table>  
              <div style="text-align: center">
                <el-pagination
                  layout="total, prev, pager, next, jumper"
                  @size-change="handleChangeSizeGrup"
                  @current-change="handleCurrentChangeGrup"
                  :total="paramsGroup.total"
                  :current-page.sync="paramsGroup.currentPage"
                  :page-size="parseInt(paramsGroup.per_page)"
                  class="paginate">
                </el-pagination>
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
        </el-card>


      </div>
    </section>

		<dialog-setup :show="dialogSetup" @doneSetup="selesaiSetup"/>

    <el-dialog :visible.sync="dialogValidateReset" :show-close="false" custom-class="dialog-card">
			<div class="row" style="background-color: #FAFAFA; word-break: break-word; line-height: inherit;">
        <div class="grid-content" style="margin:5% 10%">
          <h3 style=" line-height: inherit;"> {{ $lang[langId].are_you_want_to_reset_accounting }} </h3>
          <div style="margin-top: 20px">
            <el-button type="text" @click="reset" style="color:#F56C6C; font-size:24px; float:left; margin-left:10%">
              {{ lang.yes }}
            </el-button>
            <el-button type="text" @click="handleDialogReset" style="color:#5C5C5C; font-size:24px; float:right; margin-right:25%; margin-top:2px">{{lang.no}}</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common';
import axios from 'axios';
import mixinAccounting from '@/mixins/mixinAccounting';
import dialogSetup from 'components/modules/_views/accounting/dialogSetup';
import { resetAccounting, apiLoadStore, dataSetPOS, saveSet, saveProductGroup, saveMapProductGroup, savePOSTrx } from '@/api/accounting/setAccounting';
import Loading from 'vue-loading-overlay';
import { Collapse } from 'element-ui';
var moment = require('moment')
export default {
  name: 'ResetAccounting',
  components: {
    Loading,
		dialogSetup
  },

  data() {
    return {
      loadingSetup: false,
      loadingPOSTrx: false,
      isLoading: false,
      isSetup: 'true',
      inSetting: 'general',
      isEdit: false,
      dataStore: {},
      dataProductGrup: [],
      dataSales: [],
      dataInventory: [],
      dataCogs: [],
      loadingSet: false,
      loadingGroup: false,
      loadingProductOn: false,
      loadingMap: false,
      editedProductGroup: [],
      accountProductGroup: false,
      scheduleSales: false,
      scheduleSalesReturn: false,
      scheduleInex: false,
      dialogValidateSetup: false,
      dialogValidateReset: false,
      dataPOSTrx: {
        // account_date_start: moment().format('yyyy-MM-DD')
      },
      paramsGroup: {
        search: '',
        currentPage: 1,
        per_page: 15,
        page: 1,
        total: null
      }
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
    },

    loggedInUser () {
      return this.$store.getters.loggedInUser
    },
  },

  // watch: {
  //   '$store.getters.selectedStore': function() {
  //     this.getSetup()
  //   }
  // },

  mixins: [mixinAccounting],

  methods: {
    async loadStore(){
      this.isLoading = true
      await apiLoadStore().then(response => {
        let resp = response.data.data
        this.dataStore = resp
        this.accountProductGroup = resp.account_product_group === 0 ? false : true
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

    async getPostSetting(){
      await dataSetPOS().then(response => {
        let resp = response.data.data
        this.dataPOSTrx = resp
        this.dataPOSTrx.scheduled = parseInt(this.dataPOSTrx.scheduled)
        this.scheduleSales = resp.sales === 0 ? false : true
        this.scheduleSalesReturn = resp.sales_return === 0 ? false : true
        this.scheduleInex = resp.income_expense === 0 ? false : true
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

    saveSetPOSTrx(){
      this.loadingPOSTrx = true
      let data = {
        scheduled: this.dataPOSTrx.scheduled,
        sales: this.scheduleSales ? '1' : '0',
        sales_return: this.scheduleSalesReturn ? '1' : '0',
        income_expense: this.scheduleInex ? '1' : '0',
        account_date_start: this.dataPOSTrx.account_date_start
      }

      savePOSTrx(data).then(response => {
        let resp = response.data.data
        this.dataPOSTrx = resp
        this.dataPOSTrx.scheduled = parseInt(this.dataPOSTrx.scheduled)
        this.scheduleSales = resp.sales === '0' ? false : true
        this.scheduleSalesReturn = resp.sales_return === '0' ? false : true
        this.scheduleInex = resp.income_expense === '0' ? false : true
        this.loadingPOSTrx = false
        this.$message({
          type: 'success',
          message: 'Success'
        })
      }).catch(error => {
        this.loadingPOSTrx = false
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

    edit() {
      this.isEdit = true
    },
    cancel() {
      this.loadStore()
      this.isEdit = false
    },

    save(){
      this.loadingSet = true

      let data = {
        due_date: this.dataStore.due_date,
        transfer_as_sales: this.dataStore.transfer_as_sales
      }

      saveSet(data).then(response => {
        this.loadingSet = false
        this.isEdit = false
        this.loadStore()
        this.$message({
          type: 'success',
          message: 'Success'
        })
      }).catch(error => {
        this.loadingSet = false
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

    changeProductGroup(value){
      this.loadingProductOn = true
      let data = {
        account_product_group: value ? 1 : 0
      }

      saveProductGroup(data).then(response => {
        this.loadingProductOn = false
        this.loadStore()
        this.$message({
          type: 'success',
          message: 'Success'
        })
      }).catch(error => {
        this.loadingProductOn = false
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

    getSetup() {
      this.loadingSetup = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/setup'),
        headers: headers
      }).then(response => {
        this.isSetup = response.data.account_setup
        this.loadingSetup = false
      }).catch(error => {
        this.loadingSetup = false
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

    handleDialogSetup(){
      let show = this.dialogValidateSetup
      this.dialogValidateSetup = show === false ? true : false;
    },

    handleDialogReset(){
      let show = this.dialogValidateReset
      this.dialogValidateReset = show === false ? true : false;
    },

    changePageSet(setting){
      if(setting === 'general'){
        this.loadStore()
      }else{
        this.loadProductGroup()
        if(this.dataSales && this.dataInventory && this.dataCogs){
          this.getSales()
          this.getInventory()
          this.getCogs()
        }
      }
      this.isEdit = false
      this.inSetting = setting
    },

    getSales(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/name/sales'),
        headers: headers
      }).then(response => {
        this.dataSales = response.data.data
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

    getInventory(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/name/inventory'),
        headers: headers
      }).then(response => {
        this.dataInventory = response.data.data
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

    getCogs(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/name/cogs'),
        headers: headers
      }).then(response => {
        this.dataCogs = response.data.data
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

    loadProductGroup(){
      this.loadingGroup = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/productgroup'),
        headers: headers,
        params: this.paramsGroup
      }).then(response => {
        this.loadingGroup = false
        this.dataProductGrup = response.data.data
        this.dataProductGrup.map(v => Object.assign(v, {isModified: false}))
        this.paramsGroup.per_page = response.data.meta.per_page
        this.paramsGroup.currentPage = response.data.meta.current_page
        this.paramsGroup.total = response.data.meta.total
      }).catch(error => {
        this.loadingGroup = false
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

    handleChangeSizeGrup(val){
      this.paramsGroup.page = 1
      this.paramsGroup.per_page = val
      this.loadProductGroup()
    },

    handleCurrentChangeGrup(val){
      this.paramsGroup.currentPage = val
      this.paramsGroup.page = val
      this.loadProductGroup()
    },

    selectSales(val, row){
      let selected = {}
      this.dataSales.forEach((sales, idx) => {
        if(sales.id === val){
          selected = sales
        }
      })

      this.dataProductGrup.forEach((item, idx) => {
        if(item.id == row.id){
          item.sales_account_id = selected.id
          item.isModified = true

          var idxArray = this.editedProductGroup.findIndex( x => x.id === row.id );
          
          if(idxArray !== -1){
              this.editedProductGroup[idxArray].sales_account_id = selected.id
          }else{
            this.editedProductGroup.push({
              id: row.id,
              purchase_account_id: row.purchase_account_id,
              sales_account_id: selected.id,
              inventory_account_id: row.inventory_account_id,
              cogs_account_id: row.cogs_account_id
            })
          }          
        }
      })
    },

    selectPurchase (val, row){
      let selected = {}
      this.dataCogs.map((purchase, idx) => {
        if(purchase.id === val){
          selected = purchase
        }
      })

      this.dataProductGrup.map((item, idx) => {
        if(item.id === row.id){
          item.purchase_account_id = selected.id
          item.isModified = true

          var idxArray = this.editedProductGroup.findIndex( x => x.id === row.id );
          
          if(idxArray !== -1){
              this.editedProductGroup[idxArray].purchase_account_id = selected.id
          }else{
            this.editedProductGroup.push({
              id: row.id,
              purchase_account_id: selected.id,
              sales_account_id: row.sales_account_id,
              inventory_account_id: row.inventory_account_id,
              cogs_account_id: row.cogs_account_id
            })
          }  
        }
      })
    },

    selectInventory (val, row){
      let selected = {}
      this.dataInventory.map((inventory, idx) => {
        if(inventory.id === val){
          selected = inventory
        }
      })

      this.dataProductGrup.map((item, idx) => {
        if(item.id === row.id){
          item.inventory_account_id = selected.id
          item.isModified = true
          
          var idxArray = this.editedProductGroup.findIndex( x => x.id === row.id );
          
          if(idxArray !== -1){
            this.editedProductGroup[idxArray].inventory_account_id = selected.id
          }else{
            this.editedProductGroup.push({
              id: row.id,
              purchase_account_id: row.purchase_account_id,
              sales_account_id: row.sales_account_id,
              inventory_account_id: selected.id,
              cogs_account_id: row.cogs_account_id
            })
          }  
        }
      })
    },

    selectCogs (val, row){
      let selected = {}
      this.dataCogs.map((cogs, idx) => {
        if(cogs.id === val){
          selected = cogs
        }
      })

      this.dataProductGrup.map((item, idx) => {
        if(item.id === row.id){
          item.cogs_account_id = selected.id
          item.isModified = true
          
          var idxArray = this.editedProductGroup.findIndex( x => x.id === row.id );
          
          if(idxArray !== -1){
            this.editedProductGroup[idxArray].cogs_account_id = selected.id
          }else{
            this.editedProductGroup.push({
              id: row.id,
              purchase_account_id: row.purchase_account_id,
              sales_account_id: row.sales_account_id,
              inventory_account_id: row.inventory_account_id ,
              cogs_account_id: selected.id
            })
          }  
        }
      })
    },

    mapProductGroup(){
      this.loadingMap = true

      saveMapProductGroup(this.editedProductGroup).then(response => {
        this.result = response.data
        this.loadingMap = false
        this.editedProductGroup = []
        if (response.data.status === 200) {
          this.$message({
            message: 'Success',
            type: 'success'
          })
        }
        this.loadProductGroup()
      })
      .catch(error => {
        this.loadingMap = false
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

    cancelMapGroup(){
      this.editedProductGroup = []
      this.loadProductGroup()
    },

    reset() {
      resetAccounting().then(response => {
        this.dialogValidateReset = false
        this.getSetup()
        this.$message({
          type: 'success',
          message: this.$lang[this.langId].success_reset
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
      })
    },

		selesaiSetup(){
			this.dialogSetup = false
			this.loadStore()
    	this.getSetup()
		}
    
  },

  mounted() {
    this.getSetup()
    if(this.isSetup === 'true'){
      this.loadStore()
      this.getPostSetting()
    }
  }
}
</script>
