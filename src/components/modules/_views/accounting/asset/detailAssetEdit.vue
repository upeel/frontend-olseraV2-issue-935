<template>
  <div>
    <el-dialog
      :visible.sync="dialogDetail"
      :show-close="false"
      fullscreen
      width="80%"
      custom-class="dialog-card">
        <div slot="title" class="flex-container" style="text-align: center;">
          <el-row :gutter="20"  style="width: 100%">
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" class="visible-md visible-lg visible-sm" align="left">
              <label class="visible-lg visible-md visible-sm">(<span style="color: #F44336">*</span>) {{lang.required}}</label>
            </el-col>
            <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="8" align="center">
              <h4 class="dialog-title">Detail Asset </h4>
            </el-col>
            <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="8" align="right">
              <div class="btn_accounting_dialog">
                <el-button type="info" @click="closeDetail">{{ $lang[langId].close }}</el-button>
                <el-button type="success" :disabled="loadingUpdate" :loading="loadingUpdate" @click="handleUpdateAsset">{{ lang.update }}</el-button>
              </div>
            </el-col>
          </el-row>
          
        </div>
        <div class="form-add-jurnal">
          <div class="col-lg-12" style="padding: 0">
            <div class="col-lg-6" style="margin: auto">
              <div>
                <el-form @submit.native.prevent>
                  <div>
                    <label style="font-size: 12px">{{ lang.date }}</label>
                  </div>
                  <el-form-item>
                    <el-date-picker 
                      disabled
                      v-model="dataDetail.transaction_date"
                      type="date" 
                      :placeholder="this.$lang[langId].pick_a_day" 
                      format="dd MMMM yyyy" 
                      value-format="yyyy-MM-dd"
                      style="width: 100%">
                    </el-date-picker>
                  </el-form-item>
                  <div>
                    <label style="font-size: 12px">{{ lang.transaction_no }}</label>
                  </div>
                  <el-form-item>
                    <el-input v-model="dataDetail.transaction_no" type="text" disabled></el-input>
                  </el-form-item>
                  <div>
                    <label style="font-size: 12px">{{ $lang[langId].beginning_amount }}</label>
                  </div>
                  <el-form-item>
                    <vue-numeric 
                      :currency="selectedStore.currency_id" separator="," decimal-separator="."
                      v-bind:precision="2" v-model="dataDetail.first_value"
                      v-bind:minus="false" :allow-clear="true"
                      class="form-input input-md input-money">
                    </vue-numeric>
                  </el-form-item>
                  <div>
                    <label style="font-size: 12px">{{ $lang[langId].month_depreciation }}</label>
                  </div>
                  <el-form-item>
                    <vue-numeric 
                      :currency="selectedStore.currency_id" separator="," decimal-separator="."
                      v-bind:precision="2" v-model="dataDetail.depreciation_per_month"
                      v-bind:minus="false" :allow-clear="true"
                      class="form-input input-md input-money">
                    </vue-numeric>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div class="col-lg-6" style="margin: auto">
                <el-form @submit.native.prevent>
                  <div>
                    <label style="font-size: 12px">{{ $lang[langId].debit_account }} <span style="color: #F44336">*</span></label>
                  </div>
                  <el-form-item>
                    <el-select v-model="dataDetail.depreciation_debit_account" style="width: 100%" filterable :placeholder="$lang[langId].select + ' ' + $lang[langId].debit_account">
                      <el-option
                        v-for="(item, keyExpenses) in dataExpenses"
                        :key="keyExpenses"
                        :label="item.account_no + ' '+ capitalize(item.account_name)"
                        :value="item.account_no">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <div>
                    <label style="font-size: 12px">{{ $lang[langId].credit_account }} <span style="color: #F44336">*</span></label>
                  </div>
                  <el-form-item>
                    <el-select v-model="dataDetail.depreciation_credit_account" style="width: 100%" filterable :placeholder="$lang[langId].select + ' ' + $lang[langId].credit_account">
                      <el-option
                        v-for="(item, keyDebit) in dataDebit"
                        :key="keyDebit"
                        :label=" + item.account_no + ' '+ capitalize(item.account_name)"
                        :value="item.account_no">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <div>
                    <label style="font-size: 12px">{{ $lang[langId].residual_value }}</label>
                  </div>
                  <el-form-item>
                    <vue-numeric 
                      :currency="selectedStore.currency_id" separator="," decimal-separator="."
                      v-bind:precision="2" v-model="dataDetail.residual_value"
                      v-bind:minus="false" :allow-clear="true"
                      class="form-input input-md input-money">
                    </vue-numeric>
                  </el-form-item>
                  <div>
                    <label style="font-size: 12px">{{ $lang[langId].economic_life }}</label>
                  </div>
                  <el-form-item>
                    <el-input
                      v-model="dataDetail.ekonomi"
                      onkeydown="return ( event.ctrlKey || event.altKey 
                          || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                          || (95<event.keyCode && event.keyCode<106)
                          || (event.keyCode==8) || (event.keyCode==9) 
                          || (event.keyCode>34 && event.keyCode<40) 
                          || (event.keyCode==46) )"
                      class="input-with-select">
                      <el-select v-model="dataDetail.life_as_year" slot="append" placeholder="Select">
                        <el-option :key="0" :label="lang.month" value="0"></el-option>
                        <el-option :key="1" :label="lang.year" value="1"></el-option>
                      </el-select>

                    </el-input>
                  </el-form-item>
                  <div>
                    <label style="font-size: 12px">{{ lang.notes }}</label>
                  </div>
                  <el-form-item>
                    <el-input v-model="dataDetail.description" type="textarea" :rows="2"></el-input>
                  </el-form-item>
                </el-form>
            </div>
          </div>
        </div>
        <label class="visible-xs" style="margin-top: 20px;">(<span style="color: #F44336">*</span>) {{lang.required}}</label>
    </el-dialog>
  </div>
</template>

<script>
import {baseApi} from 'src/http-common';
import axios from 'axios';
import Loading from 'vue-loading-overlay';
import mixinAccounting from '@/mixins/mixinAccounting';

export default {
  name: 'AssetDetail',
  components: {
    Loading
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
  },

  data(){
    return{
      loadingUpdate: false,
      dialogDetail: true,
      dataExpenses: [],
      dataDebit: [],
      dataDetail: {
        depreciation_debit_account: '0',
        depreciation_credit_account: '0',
        first_value: '0',
        description: '',
        residual_value: '0',
        life_as_year: '0',
        ekonomi: 0,
        depreciation_per_month: '0',
        transaction_no: ''
      },
    }
  },

  mounted(){
    this.showDetail()
    this.getDebit()
    this.getExpenses()
  },

  methods:{
    showDetail(){
      let assetId = this.$route.query.id
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/asset/'+assetId),
        headers: headers
      }).then(response => {
        let result = response.data.data
        this.dataDetail.depreciation_debit_account = result.depreciation_debit_account
        this.dataDetail.depreciation_credit_account = result.depreciation_credit_account
        this.dataDetail.first_value = parseInt(result.first_value)
        this.dataDetail.residual_value = parseInt(result.residual_value)
        this.dataDetail.description = result.description
        this.dataDetail.ekonomi = result.economic_life
        this.dataDetail.life_as_year = String(result.life_as_year)
        this.dataDetail.transaction_date = result.transaction_date
        this.dataDetail.transaction_no = result.transaction_no
        this.dataDetail.depreciation_per_month = parseInt(result.depreciation_per_month)
        console.log('dataDetail', this.dataDetail)
        this.dialogDetail = true
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

    closeDetail(){
      this.$router.push({ path:'/accounting/asset'})
    },

    handleUpdateAsset(){
      let assetId = this.$route.query.id
      this.loadingUpdate = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }


      let dataUpdate = {
        depreciation_debit_account: this.dataDetail.depreciation_debit_account,
        depreciation_credit_account: this.dataDetail.depreciation_credit_account,
        description: this.dataDetail.description,
        first_value: this.dataDetail.first_value,
        residual_value: this.dataDetail.residual_value,
        economic_life: this.dataDetail.ekonomi,
        life_as_year: this.dataDetail.life_as_year
      }

      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/asset/' + assetId),
        headers: headers,
        data: dataUpdate
      }).then(response => {
        this.loadingUpdate = false
        this.$router.push({ path:'/accounting/asset'})
        this.$message({
          type: 'success',
          message: this.$lang[this.langId].success_update
        })
      }).catch(error => {
        this.loadingUpdate = false
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
  }
}
</script>
