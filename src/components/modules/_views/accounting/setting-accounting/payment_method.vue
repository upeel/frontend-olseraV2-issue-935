<template>
  <div>
    <el-card class="box-card" shadow="never">
      <div class="pb-24">
        <div class="col-sm-6 pl-null" align="left">
          <el-select v-if="dialogSetPayment" size="small"
            v-model="setPayment.account_no" 
            :value="setPayment.account_no" 
            @input="(value) => changeAccountPayment(value)"
            filterable :placeholder="$lang[langId].select + ' ' + lang.account" style="width: 100%">
            <el-option
              v-for="item in dataAccount"
              :key="item.account_no"
              :label="item.account_no + ' '+ capitalize(item.account_name)"
              :value="item.account_no">
            </el-option>
          </el-select>
					<el-popover
						placement="bottom"
						width="400"
						trigger="click">
						<div>
							<div class="sub-title mb-12">
								<span class="font-16 color-primary font-bold">{{lang.add}} {{lang.account}}</span>
									<el-button type="primary" size="mini" class="fl-right" :loading="loadingAddAccount" :disabled="loadingAddAccount" @click="handleSaveAccount">
										{{ lang.save }}
									</el-button>
							</div>

							<el-form @submit.native.prevent style="width: 100%">
								<div>
									<label style="font-size: 12px">{{ lang.category }}</label>
								</div>
								<el-form-item>
									<el-select v-model="tempAccount.category" filterable style="width: 100%" :placeholder="$lang[langId].select + ' ' + lang.category" @change="getSubGroupName($event)">
										<el-option
											v-for="item in dataGroup"
											:key="item.group_id"
											:label="capitalize(item.group_name)"
											:value="item.group_id">
										</el-option>
									</el-select>
								</el-form-item>
								<div v-show="dataSubGroup.length > 1">
									<label style="font-size: 12px">{{ $lang[langId].sub_category }}</label>
								</div>
								<el-form-item v-show="dataSubGroup.length > 1">
									<el-select id="sub_category" v-model="tempAccount.sub_category" filterable style="width: 100%" :placeholder="$lang[langId].select + ' ' + lang.category" @change="handleChangeCategory($event)">
										<el-option
											v-for="item in dataSubGroup"
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
						<el-button slot="reference" @click="getGroupName" type="info" size="small">{{lang.add}} {{lang.account}}</el-button>
					</el-popover>
        </div>
        <div class="col-sm-6 pr-null" align="right" v-if="dialogSetPayment">
          <el-button type="info" size="small" @click="cancelSetPayment">{{ lang.cancel }}</el-button>
          <el-button type="success" size="small" @click="handleSetPayment" :disabled="loadingSet || setPayment.account_no === ''" :loading="loadingSet">{{ lang.update }}</el-button>
        </div>
        <div class="col-sm-6 pr-null" align="right" v-else>
          <el-button v-if="chosenPayment.length !== 0" size="small" type="success" @click="showSetDialog()">
            {{ $lang[langId].set_account }} 
          </el-button>
          <el-button v-else type="primary" @click="donePayment" size="small">{{ $lang[langId].next }}</el-button>
        </div>
      </div>
      <div class="card-body mt-20">
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
                <span>
                  {{ scope.row.account_no}}
                  <span v-if="scope.row.account_name !== null">{{' - ' + capitalize(scope.row.account_name)}}</span>
                </span>
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
          <el-select class="inline-form" v-model="params.per_page" @change="handleSizeChange" placeholder="Select" size="small">
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
</template>

<script>
import { baseApi } from 'src/http-common';
import axios from 'axios';
import Loading from 'vue-loading-overlay';
import mixinAccounting from '@/mixins/mixinAccounting';
var moment = require('moment')

export default {
  name: 'PaymentMap',
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
    this.getBankPayment()
    this.getPaymentMap()
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
      isLoading: false,
			loadingAddAccount: false,
      completeMap: 0,
      dataBankMap: [],
      dataPaymentMap: [],
      dataAccount: [],
			dataGroup: [],
			dataSubGroup: [],
			assetAccount: [],
      dialogSetPayment: false,
      chosenPayment: [],
      loadingSet: false,
      setPayment: {
        account_no: '',
        account_name: '',
      },
			accumulationDepreciation: false, 
      tempAccount: {
        category: '',
        sub_category: '',
        account_name: '',
        account_number: '',
        accumulated_depreciation: ''
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

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/paymentmap'),
        headers: headers,
        params: this.params
      }).then(response => {
        let resp = response.data.data
        this.dataPaymentMap = response.data.meta.current_page === 1 ? this.dataBankMap.concat(resp) : resp
        this.completeMap = response.data.complete
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

    getBankPayment() {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/bankmap'),
        headers: headers
      }).then(response => {
        this.dataBankMap = response.data.data
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

    getAccountName() {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/name/cashbankonly'),
        headers: headers
      }).then(response => {
				let resp = response.data.data
        this.dataAccount = resp
				this.setPayment = {account_no: resp[0].account_no, account_name: resp[0].account_name}
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
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/groupmain'),
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

    getSubGroupName (event) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method : 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/groupmain/' + event),
        headers: headers
      }).then(response => {
        this.dataSubGroup = response.data.data
        this.tempAccount.sub_category = ''
        this.tempAccount.account_number = ''
        this.paramsEdit.account_number = ''

        if(this.dataSubGroup.length > 1){
          document.getElementById('sub_category').focus();
        }else{
          this.tempAccount.sub_category = this.dataSubGroup[0].id
          this.handleChangeCategory(this.dataSubGroup[0].id)
        }
        // document.getElementById('sub_category').value = '';
        // document.getElementById('account_number').value = '';
        
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

    handleSaveAccount () {
      this.loadingAddAccount = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let data = {
        account_name: this.tempAccount.account_name,
        account_no: this.tempAccount.account_number,
        account_group_id: this.tempAccount.sub_category,
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
        this.$message({
					message: 'Success',
					type: 'success'
				})
				this.tempAccount = {
					category: '',
					sub_category: '',
					account_name: '',
					account_number: '',
					accumulated_depreciation: ''
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
        this.loadingAddAccount = false
      })
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

    changeAccountPayment(val){
      let selected = {}
      this.dataAccount.forEach((item, index) => {
        if (item.account_no === val){
          selected = item
        }
      })

      this.setPayment.account_name = selected.account_name
    },

    donePayment(){
      this.$emit('donePayment')
    },

    showSetDialog() {
    	this.getAccountName()
      this.dialogSetPayment = true
    },

    handleSelectMap(val) {
      if (val.length > 0) {
        this.chosenPayment = val
      }else{
        this.chosenPayment = []
      }
    },

    handleSetPayment() {
       let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      this.loadingSet = true
      this.chosenPayment.map((itemChosen, idxChosen) => {
        let data = {}
        let url = ''
        if(this.setPayment.id === 11065){
          url = 'bankmap'
          data = {
            id: itemChosen.id,
            account_no: this.setPayment.account_no
          }
        }else{
          url = 'paymentmap'
          data = {
            id: itemChosen.id,
            account_no: this.setPayment.account_no
          }
        }

        axios({
          method: 'POST',
          url: baseApi(this.selectedStore.url_id, this.langId, 'account/'+url),
          headers: headers,
          params: data
        }).then(response => {
          if(this.setPayment.id !== 11065){
            this.completeMap = response.data.complete
          }

          this.$message({
            type: 'success',
            message: 'Success' 
          })

          this.dataPaymentMap.map((i, idx) => {
            if (i.id === data.id) {
              this.dataPaymentMap[idx].account_no = data.account_no
              this.dataPaymentMap[idx].account_name = response.data.data.account_name
            }
          })
          if(idxChosen === 0){
            this.$refs.multipleTable.clearSelection();
            this.setPayment = {
              account_no: this.dataAccount[0].account_no,
              account_name: this.dataAccount[0].account_name,
            }
            this.chosenPayment = []
            this.dialogSetPayment = false
            this.loadingSet = false
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
      })
    },

    cancelSetPayment(){
      this.dialogSetPayment = false
			this.setPayment = {
				account_no: this.dataAccount[0].account_no,
				account_name: this.dataAccount[0].account_name,
			}
    },

    checkList(row, index){
      let disable = true;
      if(this.dialogSetPayment || row.edit_able === 'no'){
        disable = false;
      }
      return disable;
    },

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
</style>
