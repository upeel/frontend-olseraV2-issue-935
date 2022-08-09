<template>
	<div>
		<el-dialog
      :visible.sync="show"
      :show-close="false"
      :close-on-press-escape="false"
      append-to-body
      custom-class="dialog-digital-payment"
      width="70%"
      height="500px">
      <el-dialog :visible.sync="dialogValidateSetup" :show-close="false" append-to-body custom-class="dialog-no-header">
				<div class="row" style="background-color: #FAFAFA" v-if="loadingValidate">
					<loading 
						align="center"
						:active="true"
						color= '#1bb4e6'
						loader="bars"
						:width="64"
						:height="64"
						backgroundColor='#ffffff'>
					</loading>
				</div>
        <div class="row" style="background-color: #FAFAFA" v-else>
            <div class="grid-content" style="margin:5% 10%">
              <h3 class="word-break" align="center"> {{ $lang[langId].are_you_want_to_start_accounting }} ?</h3>
              <div style="margin-top: 20px" v-if="loadingSetup === false">
                <el-button type="text" @click="handleSetupConfirm" style="color:#67C23A; font-size:24px; float:left; margin-left:10%">
                  {{ lang.yes }}
                </el-button>
                <el-button type="text" @click="handleValidateSetup" style="color:#5C5C5C; font-size:24px; float:right; margin-right:25%; margin-top:2px">{{lang.no}}</el-button>
              </div>
              <div v-else>
                <loading 
                  align="center"
                  :active="true"
                  color= '#1bb4e6'
                  loader="bars"
                  :width="64"
                  :height="64"
                  backgroundColor='#ffffff'>
                </loading>
              </div>
            </div>
        </div>
      </el-dialog>
      <div slot="title" class="flex-container">
        <el-row :gutter="20"  style="width: 100%">
          <el-col :span="14">
            <h4 class="dialog-title">
              {{ $lang[langId].initial_setting }}
            </h4>
          </el-col>
          <el-col :span="10" align="right" class="p-5">
            <div class="btn_accounting_dialog">
              <el-button type="info" size="mini" @click="handleCloseSetup">{{ lang.cancel }}</el-button>
              <el-button type="success" :disabled="isCompletePayment === false || !formDataSet.due_date" size="mini" @click="handleValidateSetup">{{ lang.start }}</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="submit-submision">
        <el-row class="menu">
          <el-col :class="isComplete('payment')" :span="8">
            <div @click="handleSetMenu('payment')" class="pointer notLast active">1. {{lang.payment_methods}}</div>
          </el-col>
          <el-col :class="isComplete('setting')" class="pointer" :span="8">
            <div @click="handleSetMenu('setting')" class="pointer notLast" :class="settingClass">2. {{$lang[langId].accounting_setting}}</div>
          </el-col>
          <el-col :class="isComplete('ringkasan')" class="pointer" :span="8">
            <div @click="handleSetMenu('ringkasan')" style="border-top-right-radius: 0; border-bottom-right-radius: 0; cursor: pointer;" :class="ringkasanClass">3. {{$lang[langId].summary}}</div>
          </el-col>
        </el-row>
      </div>

      <payment-method v-show="inTab === 'payment'" @donePayment="donePayment"/>
      <setting v-show="inTab === 'setting'" @change="changeSetting" @doneSetting="doneSetting"/>
      <ringkasan v-show="inTab === 'ringkasan'" @change="changeRingkasan" :allSetup="dataSetup" :initialSet="formDataSet" :loadingStock="loadingStockYes" 
				:startDate="setStartData" @changeDate="handleStockYes" />
    </el-dialog>

		<el-dialog :show-close="false" @close="skipCustomClose"
      :visible.sync="dialogCustomBalance"
      width="80%" custom-class="dialog-card-jurnal">
			<div slot="title" class="flex-container">
        <el-row :gutter="20"  style="width: 100%">
          <el-col :span="12">
            <h4 class="dialog-title" style="text-align: left;">{{$lang[langId].input_begining_value}}
							<p class="font-12 font-normal">{{$lang[langId].skip_modal_proses}}</p>
						</h4>
						
          </el-col>
          <el-col :span="12">
            <div class="btn_accounting_dialog" align="right">
              <el-popconfirm
								:confirm-button-text='$lang[langId].yes'
								:cancel-button-text='$lang[langId].no'
								confirm-button-type="info"
								icon="el-icon-info"
								icon-color="#333"
								@confirm="resetBalance"
								width="260"
								:title="$lang[langId].are_you_sure+' '+$lang[langId].all_balance_0"
							>
								<el-button slot="reference" type="info" size="small" :loading="loadingResetBalance" :disabled="loadingResetBalance">Reset</el-button>
							</el-popconfirm>
              <el-button :disabled="loadingBalance" :loading="loadingBalance" size="small" type="success" @click="saveInitialBalance">{{ lang.save }}</el-button>
							<!-- <el-button type="text" size="mini" @click="showCustomDialog">
								<svg-icon icon-class="x" class="color-black font-24"></svg-icon>
							</el-button> -->
            </div>
          </el-col>
        </el-row>
      </div>
				<initial-balance @change="saveBalance" ref="initialBalance"/>
		</el-dialog>
	</div>
</template>

<script>
import mixinAccounting from '@/mixins/mixinAccounting';
import Loading from 'vue-loading-overlay';
import paymentMethod from './setting-accounting/payment_method';
import setting from './setting-accounting/setting';
import initialBalance from './setting-accounting/initial_balance';
import ringkasan from './setting-accounting/summary-setting';
var moment = require('moment')
import { baseApi } from 'src/http-common';
import axios from 'axios';

export default {
	name: 'dialogSetup',
  components: {
		Loading,
    paymentMethod,
    setting,
		initialBalance,
    ringkasan
  },

	props: ['show'],

  watch: {

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
    bannerOrder() {
      var val = false
      if (parseInt(this.$store.state.bannerOnlineOrder.working_hours) === 0) {
        val = false
      }
      if (parseInt(this.$store.state.bannerOnlineOrder.working_hours) === 1) {
        val = true
      }
      return val
    },

    settingClass(){
      const data = this.isCompletePayment ? 'active' : ''
      return data;
    },

    ringkasanClass(){
      const data = this.isCompleteSetting ? 'active' : ''
      return data;
    },

  },

  mixins: [mixinAccounting],

  data() {
    return{
      dataSetup: [],
      isStock: false,
      dialogValidateSetup: false,
			dialogCustomBalance: false,
      loadingSetup: false,
			loadingValidate: false,
			loadingStockYes: false,
			loadingBalance: false,
			loadingResetBalance: false,
      isCompletePayment: false,
      isCompleteSetting: false,
      isCompleteSummary: false,
      inTab: 'payment',
			dataBalance: [],
      formDataSet: {},
			setStartData: moment().startOf('month').format('YYYY-MM-DD')
		}
  },

  methods: {
		changeSetting(data){
      this.formDataSet = data
      if(this.formDataSet.isStock === 'true'){
        this.handleStockYes()
      }else{
        this.handleStockNo()
      }
    },

    handleStockYes(val){
			this.loadingStockYes = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

			if(val !== undefined){
				this.setStartData = val
			}

			let paramData = {date: this.setStartData}
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/firststock2'),
        headers: headers,
				params: paramData
      }).then(response => {
				this.loadingStockYes = false
        this.dataSetup = response.data.data
        this.dialogConfirmStock = false
        this.dialogSetup = true
      }).catch(error => {
        this.loadingStockYes = false
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

    handleStockNo(){
      this.dataSetup = []
			this.setStartData = moment().startOf('month').format('YYYY-MM-DD')
    },

    handleSetupConfirm () {
      this.loadingSetup = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      
      let data = {}
      if(this.formDataSet.isStock === 'true'){ 
        data = {
          amount: parseInt(this.dataSetup[0].amount),
          stock_as_capital: this.formDataSet.isStock === 'true' ? 1 : 0,
					date: this.setStartData
        }
      }

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/firstsetup2'),
        headers: headers,
        data
      }).then(response => {
        this.loadingSetup = false
				this.dialogCustomBalance = true
        this.dialogSetup = false
        this.dialogValidateSetup = false
        this.dialogConfirmStock = false
        this.accountSetup()
        this.setDueDate(this.formDataSet.due_date)
        // this.$message({
        //   type: 'success',
        //   message: this.$lang[this.langId].success_set_up
        // })
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


    setDueDate(date){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let data = {
        due_date: date ? date : 0
      }

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/duedate'),
        headers: headers,
        data
      }).then(response => {
        
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

		setInitialBalance(){
			var initialBalance = []
			this.dataBalance.map((item, index) => {
				if(item.int_amount !== parseInt(item.famount)){
					initialBalance.push({account_no: item.account_no, amount: item.int_amount})
				}
			})
			let headers = {
        Authorization : 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/begining'),
        headers: headers,
				data: initialBalance
      }).then(response => {

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

		handleValidateSetup (){
      let validate = this.dialogValidateSetup
      this.dialogValidateSetup = validate ? false : true
    },


    closeConfirmStock() {
      this.dialogConfirmStock = false
    },

		handleCloseSetup () {
			this.$emit('doneSetup')
    },

    isComplete(val){
      let data = ''
      if(val === 'payment'){
        data = this.isCompletePayment ? 'el-col-complete' : ''
      }else if(val === 'setting'){
        data = this.isCompleteSetting ? 'el-col-complete' : ''
      }else if(val === 'ringkasan'){
        data = this.isCompleteSummary ? 'el-col-complete' : ''
      }

      return data;
    },

    handleSetMenu(menu){
      if(menu === 'payment'){
        this.inTab = 'payment'
      }else if(menu === 'setting'){
        this.inTab = this.isCompletePayment ? 'setting' : this.inTab
      }else if(menu === 'ringkasan'){
        this.inTab = this.isCompletePayment && this.isCompleteSetting  ? 'ringkasan' : this.inTab

      }
    },

    donePayment(){
      this.isCompletePayment = true
      this.handleSetMenu('setting')
    },

    doneSetting(){
      this.isCompleteSetting = true
      this.handleSetMenu('ringkasan')
    },

		saveBalance(data){
			this.dataBalance = data
		},

		saveInitialBalance(){
			this.loadingBalance = true
			var editCustom = []
			this.dataBalance.map((item, index) => {
				if(item.int_amount !== parseInt(item.famount)){
					editCustom.push({account_no: item.account_no, amount: item.int_amount})
				}
			})
			let headers = {
        Authorization : 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/begining'),
        headers: headers,
				data: editCustom
      }).then(response => {
				this.$message({
					message: this.$lang[this.langId].success_apply_accounting,
					type: 'success'
				})
				this.loadingBalance = false
				this.dialogCustomBalance = false
				this.$emit('doneSetup')
      }).catch(error => {
				this.loadingBalance = false
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

		showCustomDialog(){
			let show = this.dialogCustomBalance
			this.dialogCustomBalance = show ? false : true
		},

		skipCustomClose(){
			this.loadingBalance = false
			this.dialogCustomBalance = false
			this.$emit('doneSetup')
		},

		resetBalance(){
			this.loadingResetBalance = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/begining'),
        headers: headers,
        params: this.param
      }).then(response => {
				this.$refs.initialBalance.getInitialBalance()

				this.loadingResetBalance = false
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
				this.loadingResetBalance = false
			})
		},

		changeRingkasan(data){
			this.setStartData = data
		},

    handleNext(){
      this.$emit('doneSetting')
    },
  }
}
</script>
