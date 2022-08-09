<template>
  <div class="px-20">
    <div v-if="isSetup === 'false'">
      <el-card class="box-card" shadow="never">
        <div class="div-nodata-accounting">
          <img src="../../../../../../static/img/no-close-date.svg" class="image" style="margin-top: 32px">
          <div class="no_close" >{{$lang[langId].setup_message}}</div>
          <el-button class="btn-set" @click="dialogSetup = true">{{$lang[langId].set_up_now}}</el-button>
        </div>
      </el-card>
    </div>

    <div v-else-if="isSetup === 'true'">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="table-handler-flex">
          <h4 style="flex-grow: 1;">{{ lang.payment_methods }}</h4>
          <el-button :disabled="chosenPayment.length === 0" size="small" type="success" @click="showSetDialog()">
            {{ $lang[langId].set_account }} 
          </el-button>
        </div>
        <div class="card-body">
          <div v-if="isLoading === false">
            <el-table
              ref="multipleTable"
              v-loading="isLoading"
              class="product-table-max-height mobile-fix-height-unset"
              @selection-change="handleSelectMap"
              :data="dataPaymentMap"
              @sort-change="changeSortTable"
              stripe>
              <el-table-column type="selection" width="30" class-name="text-center" :selectable="checkList">
              </el-table-column>
              <el-table-column
                prop="payment_name"
                :label="$lang[langId].payment_name">
                <template slot-scope="scope">
                  <span v-if="scope.row.payment !== null">{{ capitalize(scope.row.payment) }}</span>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="payment_type"
                :label="$lang[langId].payment_type">
                <template slot-scope="scope">
                  <span>{{ capitalize(scope.row.payment_type) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="account_no"
                :label="$lang[langId].payment_account">
                <template slot-scope="scope">
                  <span v-if="scope.row.account_no !== null">
                    {{ scope.row.account_no}}
                    <span v-if="scope.row.account_name !== null">{{' - ' + capitalize(scope.row.account_name)}}</span>
                  </span>
                  <span v-else>-</span>
                </template>
              </el-table-column>
            </el-table>
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
          <div style="margin-top: 20px; margin-bottom: -55px">
            <el-select class="perpage" v-model="params.per_page"  @change="handleSizeChange" placeholder="Select" style="width: 120px">
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

		<dialog-setup :show="dialogSetup" @doneSetup="finishSetup"/>

    <el-dialog
      :visible.sync="dialogSetPayment"
      :show-close="false"
      width="40%"
      custom-class="dialog-card">
      <div slot="title" class="flex-container" style="text-align: center">
        <el-row :gutter="20"  style="width: 100%">
          <el-col :span="14">
            <h4 class="dialog-title" style="padding-left: 5%; text-align: left;">{{$lang[langId].payment_account}} {{capitalize(setPayment.payment_name)}}</h4>
          </el-col>
          <el-col :span="10" align="right">
            <div class="btn_accounting_dialog">
              <el-button type="info" @click="cancelSetPayment">{{ lang.cancel }}</el-button>
              <el-button type="success" @click="handleSetPayment" :disabled="loadingSet" :loading="loadingSet">{{ lang.update }}</el-button>
            </div>
          </el-col>
        </el-row>
        
      </div>
      <div>
        <div style="width: 100%; padding: 0 5% 0 5%;">
          <el-form @submit.native.prevent style="width: 100%">
            <div>
              <label style="font-size: 12px">{{ lang.account }}</label>
            </div>
            <el-form-item>
              <el-select 
                v-model="setPayment.account_no" 
                :value="setPayment.account_no" 
                @input="(value) => selectAccount(value)"
                filterable :placeholder="$lang[langId].select + ' ' + lang.account" style="width: 100%">
                <el-option
                  v-for="item in dataAccount"
                  :key="item.account_no"
                  :label="item.account_no + ' '+ capitalize(item.account_name)"
                  :value="item.account_no">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-table
            class="product-table-max-height mobile-fix-height-unset"
            :data="chosenPayment"
            stripe>
            <el-table-column
              prop="payment_name"
              :label="$lang[langId].payment_name">
              <template slot-scope="scope">
                <span v-if="scope.row.payment !== null">{{ capitalize(scope.row.payment) }}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column
              align="right"
              prop="payment_type"
              :label="$lang[langId].payment_type">
              <template slot-scope="scope">
                <span>{{ capitalize(scope.row.payment_type) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>

  </div>
</template>


<script>
import { baseApi } from 'src/http-common';
import axios from 'axios';
import Loading from 'vue-loading-overlay';
import mixinAccounting from '@/mixins/mixinAccounting';
import dialogSetup from 'components/modules/_views/accounting/dialogSetup';
var moment = require('moment')

export default {
  name: 'PaymentMap',
  components: {
    Loading,
		dialogSetup
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
    }
  },
  // watch: {
  //   '$store.getters.selectedStore': function () {
  //     this.getTest()
  //   }
  // },

  mounted() {
    this.accountSetup()
    this.getPaymentMap()
    this.getAccountName()
  },

  data() {
    return {
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
      displayMovement: false,
      selectedMonth: moment(),
      isLoading: false,
      loadingSet: false,
      dialogSetPayment: false,
      dataBankMap: [],
      dataPaymentMap: [],
      dataAccount: [],
      chosenPayment: [],
      setPayment: {
        account_no: '',
        account_name: ''
      },
      params: {
        currentPage: 1,
        per_page: 15,
        sort_column: '',
        sort_type: '',
        page: 1,
        total: null
      }
    }
  },

  methods: {
    handleSizeChange(val) {
      this.params.page = 1
      this.params.per_page = val
      this.getPaymentMap()
    },
    
    handleCurrentChange(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getPaymentMap()
    },

    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      if (val.order === null) val.order = this.params.sort_type

      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.getPaymentMap()
    },

    getPaymentMap() {
      this.isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

			this.dataBankMap = []
			this.dataPaymentMap = []

			if(parseInt(this.params.page) === 1){
				axios({
					method: 'GET',
					url: baseApi(this.selectedStore.url_id, this.langId, 'account/bankmap'),
					headers: headers
				}).then(response => {
					this.dataBankMap = response.data.data.map(v => ({...v, edit_able: 'yes', type: 'bank'}))
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
			}

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/paymentmap'),
        headers: headers,
        params: this.params
      }).then(response => {
        let resp = response.data.data.map(v => ({...v, type: 'payment'}))
        this.dataPaymentMap = response.data.meta.current_page === 1 ? this.dataBankMap.concat(resp) : resp
        this.params.per_page = response.data.meta.per_page
        this.params.currentPage = response.data.meta.current_page
        this.params.total = response.data.meta.total
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


    getAccountName() {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/name/cashbankonly'),
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

    showSetDialog() {
      this.dialogSetPayment = true
      this.setPayment = {
        account_no: '',
        account_name: ''
      }
    },

    selectAccount(val){
      let selected = {}
      this.dataAccount.forEach((item, index) => {
        if (item.account_no === val){
          selected = item
        }
      })

      this.setPayment.account_name = selected.account_name
    },

    handleSetPayment() {
      this.loadingSet = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let payment = []
      let bankId = ''

      this.chosenPayment.map((i, idx) => {
        if (i.type === 'bank') {
          bankId = i.id
        }else{
          payment.push(i.id)
        }
      })

      let data = {
        account_no: this.setPayment.account_no,
        paymentmode: payment,
        bank: bankId
      }

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/multipaymentmap'),
        headers: headers,
        params: data
      }).then(response => {
        this.loadingSet = false
        this.$message({
          type: 'success',
          message: 'Success' 
        })
        this.dialogSetPayment = false
        this.$refs.multipleTable.clearSelection();
        this.chosenPayment = []
        this.dataPaymentMap.map((i, idx) => {
          if (i.id === bankId || payment.includes(i.id)) {
            this.dataPaymentMap[idx].account_no = this.setPayment.account_no
            this.dataPaymentMap[idx].account_name = this.setPayment.account_name
          }
        })

        this.setPayment = {
          account_no: '',
          account_name: '',
        }
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

    cancelSetPayment(){
      this.dialogSetPayment = false
      this.setPayment = {
        account_no: '',
        account_name: '',
      }
    },

    checkList(row, index){
      let disable = false;
      if(row.edit_able === 'yes'|| row.id === 11065){
        disable = true;
      }
      return disable;
    },

    handleSelectMap: function(val) {
      if (val.length > 0) {
        this.chosenPayment = val
      }else{
        this.chosenPayment = []
      }
    },
    
    onClose (e) {
      e.wait = true
      setTimeout(() => {
          e.close = true
      }, 3000)
    }
  }
}
</script>

<style lang="scss">
.paginate {
  .el-pager li {
    background: #FFFFFF !important;
  }
  .el-pager li.active {
    color: #FFFFFF;
    background:#0085CD !important;
    border-radius: 60px !important;
  }

  .el-pagination .btn-prev {
    background-color: #FFFFFF !important;
    background: #FFFFFF !important;
  }
}

.mobile-margin-xs { 
  margin-top: 7px;
}

.perpage {
  .el-input__inner {
    border: 0px solid #FFFFFF !important;
  }
}

.movementPanel {
  background-color: #FFFFFF;
  z-index: 1;
  position: absolute;
  right: 10px;
  bottom: 53px;
  top: 90px;
  width: 330px;
  box-shadow: -4px 0 0.1em #0000001F !important;
}
</style>
