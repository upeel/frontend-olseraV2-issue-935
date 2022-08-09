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
          <h4 style="flex-grow: 1;">{{ $lang[langId].taxibike_online_price}}</h4>
        </div>
        <el-row :gutter="20">
          <el-col :span="12" align="left" class="table-handler-flex">
            <el-button
              size= "small"
              class="date-filter-dashboard"
              @click="toggleFilter"
              style="margin-right: 7px">
              <i class="fa fa-filter" />
              <span>{{ labelDate }}</span>
            </el-button>
          </el-col>
          <el-col :span="12" align="right">
            <el-button
              :disabled="chosenConfirm.length === 0"
              :class="chosenConfirm.length !== 0"
              size="small"
              :type="chosenConfirm.length === 0 ? 'info' : 'primary'"
              @click="showConfirm">
              <span>
                <svg-icon type="accept"></svg-icon>
                {{$lang[langId].confirm}}</span>
            </el-button>
          </el-col>
        </el-row>
        <div class="card-body">
					<div v-if="isLoading === false">
						<el-table
							:data="dataHarga"
							ref="multipleTable"
							class="accounting-table"
							@selection-change="handleSelectConfirm"
							v-loading="isLoading"
							:highlight-current-row="false">
								<el-table-column type="selection" width="30" class-name="text-center">
								</el-table-column>
								<el-table-column
									prop="order_source"
									:label="$lang[langId].delivery_service">
									<template slot-scope="scope">
										<span>{{scope.row.order_source_name}}</span>
									</template>
								</el-table-column>
								<el-table-column
									prop="date"
									:label="lang.date">
									<template slot-scope="scope">
										<el-button slot="reference" @click="getOrderPerdate(scope.row)"  type="text">{{ scope.row.fdate }}</el-button>
									</template>
								</el-table-column>
								<el-table-column
									prop="unsettle_amount" align="right"
									:label="$lang[langId].undisbursed">
									<template slot-scope="scope">
										<span>{{scope.row.funsettle_amount}}</span>
									</template>
								</el-table-column>
								<el-table-column
									prop="settle_amount" align="right"
									:label="$lang[langId].disbursed">
									<template slot-scope="scope">
										<span>{{scope.row.fsettle_amount}}</span>
									</template>
								</el-table-column>
								<el-table-column
									prop="amount" align="right"
									:label="lang.total">
									<template slot-scope="scope">
										<span>{{scope.row.famount}}</span>
									</template>
								</el-table-column>
								<el-table-column
									prop="posted" align="center"
									label="Status">
									<template slot-scope="scope">
										<el-tag v-if="scope.row.posted === 1"
											type="success"
											size="mini"
											disable-transitions>{{$lang[langId].settled2}}
										</el-tag>
										<el-tag v-else type="danger" disable-transitions size="mini">
											{{$lang[langId].unsettle}}
										</el-tag>
									</template>
								</el-table-column>
						</el-table>
						<div style="text-align: center">
							<el-pagination
								layout="total, prev, pager, next, jumper"
								@size-change="handleChangeSize"
								@current-change="handleCurrentChange"
								:total="params.total"
								:current-page.sync="params.currentPage"
								:page-size="parseInt(params.per_page)"
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
      :visible.sync="dialogConfirm" 
      width="55%" center
      :close-on-click-modal="false" 
      :show-close="false">

      <div slot="title" class="flex-container">
        <el-row :gutter="20"  style="width: 100%">
          <el-col :span="12" align="left">
            <span style="line-height: 2; font-size: 15px">{{$lang[langId].confirm_online_order}} ({{chosenConfirm.length+ ' ' +$lang[langId].order}})</span>
          </el-col>
          <el-col :span="12" align="right">
            <el-button @click="cancelConfirm">{{lang.cancel}}</el-button>
            <el-button :disabled="loadingConfirm || postAccount.bankAccount === '' || postAccount.expenseAccount === '' || postAccount.disbursementDate === ''"
							:loading="loadingConfirm" type="primary" @click="handleConfirm">
                {{ $lang[langId].confirm }}
            </el-button>
          </el-col>
        </el-row>
      </div>

      <div align="left">
				<el-row :gutter="20">
				  <el-col :span="10">
						<div style="background-image: url('/static/img/background-popup-whatsnew.png') !important;
								background-repeat: no-repeat;" align="center">
							<img src="/static/img/service-activation/form-activation.svg" style="width: 55%; margin: 20px;">
						</div>
					</el-col>
					<el-col :span="14">
						<el-form @submit.native.prevent >
							<div>
								<label style="font-size: 12px">{{$lang[langId].receipt_account}}</label>
							</div>
							<el-form-item>
								<el-select 
									style="width: 100%"  
									filterable 
									:placeholder="$lang[langId].select"
									v-model="postAccount.bankAccount"
									:value="postAccount.bankAccount">
									<el-option
										v-for="item in dataCashBank"
										:key="item.id"
										:label="item.account_no+' '+ item.account_name"
										:value="item.id">
									</el-option>
								</el-select>
							</el-form-item>
							<div>
								<label style="font-size: 12px">{{$lang[langId].expense_account}}</label>
							</div>
							<el-form-item>
								<el-select 
									style="width: 100%"  
									filterable 
									:placeholder="$lang[langId].select"
									v-model="postAccount.expenseAccount"
									:value="postAccount.expenseAccount">
									<el-option
										v-for="item in dataExpense"
										:key="item.id"
										:label="item.account_no+' '+ item.account_name"
										:value="item.id">
									</el-option>
								</el-select>
							</el-form-item>
							<div>
								<label style="font-size: 12px">{{$lang[langId].disbursement_order_date}}</label>
							</div>
							<el-form-item>
								<el-date-picker
									v-model="postAccount.disbursementDate"
									type="date"
									:placeholder="$lang[langId].pick_a_day"
									format="dd MMMM yyyy"
									value-format="yyyy-MM-dd"
									style="width: 100%">
								</el-date-picker>
							</el-form-item>
						</el-form>
					</el-col>
				</el-row>

        <!-- <small style="font-weight: bolder;">
          {{ $lang[langId].you_sure + ' ' + $lang[langId].confirm}}
          <span style="color: blue"> {{chosenConfirm.length}} </span>
          Settlement ?</small> -->
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogOrder"
      :show-close="false"
      width="90%"
      center 
      custom-class="dialog-card">
      <div slot="title" class="flex-container">
        <el-row :gutter="20"  style="width: 100%">
          <el-col :span="21">
            <h4 class="dialog-title">{{detailOrderOjek.order_source_name + " " + detailOrderOjek.fdate}}</h4>
          </el-col>
          <el-col :span="3" align="right">
            <div class="btn_save_dialog">
              <el-button type="info" @click="closeOrderDialog">{{ lang.close }}</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-table
        :data="gridOrderOjek"
				v-loading="loadingItem"
        stripe >
				<el-table-column
          :label="lang.order_no"
          prop="order_no"
          width="230">
          <template slot-scope="props" >
						<div>{{props.row.order_no}}</div>
          </template>
        </el-table-column>
        <el-table-column
          width="140"
          :label="lang.sales_date"
          prop="order_date">
          <template slot-scope="props">
            <div v-if="!props.row.forder_date">
              <p>-</p>
            </div>
            <div v-else>
              <p>{{ props.row.forder_date }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="lang.shipping_address"
          min-width="180px">
          <template slot-scope="props">
            <strong class="show-white-space">{{ props.row.shipping_address }}</strong>
          </template>
        </el-table-column>
        <el-table-column :label="lang.total" prop="ftotal_amount" min-width="120px" />
        <el-table-column
          :label="lang.status"
          prop="status"
          width="120">
          <template slot-scope="props">
						<div v-if="props.row.status === 'A'">
							<el-tag size="mini" type="primary">{{ rootLang.has_confirm }}</el-tag>
						</div>
						<div v-else-if="props.row.status === 'T'">
							<el-tag size="mini" type="success">{{ lang.delivered }}</el-tag>
						</div>
						<div v-else-if="props.row.status === 'S'">
							<el-tag size="mini" type="info">{{ rootLang.being_sent }}</el-tag>
						</div>
						<div v-else-if="props.row.status === 'P'">
							<el-tag size="mini" type="warning">{{ rootLang.pending }}</el-tag>
						</div>
						<div v-else-if="props.row.status === 'X'">
							<el-tag size="mini" type="warning">{{ rootLang.cancel }}</el-tag>
						</div>
						<div v-else-if="props.row.status === 'Z'">
							<el-tag size="mini" type="success">{{ rootLang.complete }}</el-tag>
						</div>
						<div v-else>
							-
						</div>
          </template>
        </el-table-column>
      </el-table>
			<div style="text-align: center">
				<el-pagination
					layout="total, prev, pager, next, jumper"
					@size-change="handleGridChangeSize"
					@current-change="handleGridCurrentChange"
					:total="paramsOrder.total"
					:current-page.sync="paramsOrder.currentPage"
					:page-size="parseInt(paramsOrder.per_page)"
					class="paginate">
				</el-pagination>
			</div>
    </el-dialog>

    <custom-date-filter
      :show-filter="showFilter"
      @close="dateFilterClose"
      @reset="dateFilterReset"
      @save="dateFilterSave"
    />

  </div>
</template>

<script>
import mixinAccounting from '@/mixins/mixinAccounting';
import { ojekOnlineList, ojekOnlinePerdate, confirmOjekPrice } from '@/api/accounting/ojek-online';
import { cashBankOnly, expenseOnly } from '@/api/accounting/pos-transaction';
import basicComputedMixin from '@/mixins/basicComputedMixin'
import Loading from 'vue-loading-overlay';
import CustomDateFilter from 'modules/CustomDateFilter';
import dialogSetup from 'components/modules/_views/accounting/dialogSetup';
var moment = require('moment');

export default {
  name: 'BankSettlement',
  mixins: [mixinAccounting, basicComputedMixin],
  components: {
    Loading,
    CustomDateFilter,
		dialogSetup
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

  mounted(){
    this.accountSetup()
    this.getLastParams()
  },

  data() {
    return {
      isLoading: false,
      loadingConfirm: false,
			loadingItem: false,
      dialogConfirm: false,
			dialogOrder: false,
			detailOrderOjek: {},
      labelDate: '',
      showFilter: false,
      dataHarga:[],
			gridOrderOjek: [],
      chosenConfirm: [],
			dataCashBank: [],
			dataExpense: [],
			postAccount: {
				bankAccount: '',
				expenseAccount: '',
				disbursementDate: ''
			},
      params: {
        start_date: moment().format('yyyy-MM-DD'),
        end_date: moment().format('yyyy-MM-DD'),
        currentPage: 1,
        per_page: 15,
        page: 1,
        total: null
      },
			paramsOrder: {
        date:'',
        order_source: '',
        currentPage: 1,
        per_page: 15,
        page: 1,
        total: null
      }
    }
  },

  methods: {
    getHarga(){
      this.dataHarga = []
      this.chosenConfirm = []
      this.isLoading = true
      ojekOnlineList(this.params).then(response => {
        this.dataHarga = response.data.data
        this.params.per_page = response.data.meta.per_page
        this.params.currentPage = response.data.meta.current_page
        this.params.total = response.data.meta.total
        this.isLoading = false
        if(response.data.default_account){
          this.postAccount.bankAccount = response.data.default_account.cash_account_id
					this.postAccount.expenseAccount = response.data.default_account.expense_account_id
        }else{
          this.postAccount.bankAccount = ""
					this.postAccount.expenseAccount = ""
        }
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

		getCashBank(){
      cashBankOnly().then(response => {
        this.dataCashBank = response.data.data
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

		getExpense(){
			expenseOnly().then(response => {
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

    handleChangeSize(val){
      this.params.page = 1
      this.params.per_page = val
      this.getHarga()
    },

    handleCurrentChange(val){
      this.params.currentPage = val
      this.params.page = val
      this.getHarga()
    },

    getLastParams() {
      if(Object.keys(this.$route.query).includes('lastParams') ===true){
        this.params = "start_date" in this.$route.query.lastParams ? this.$route.query.lastParams : this.params
        this.labelDate = this.$route.query.labelDate
      }else{
        this.params.start_date = moment().format('YYYY-MM-DD')
        this.params.end_date = moment().format('YYYY-MM-DD')
        this.labelDate = this.$lang[this.langId].today + '\n' +
                          moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                          moment(this.params.end_date).format('DD MMM YYYY')
      }
      this.getHarga()
			this.getCashBank()
			this.getExpense()
    },

    setLabelFilter(filter) {
      if (filter.labelForDate === 'today') {
        this.labelDate = this.$lang[this.langId].today + '\n' +
                        moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                        moment(this.params.end_date).format('DD MMM YYYY')
      } else if (filter.labelForDate === 'yesterday') {
        this.labelDate = this.$lang[this.langId].yesterday + '\n' +
                        moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                        moment(this.params.end_date).format('DD MMM YYYY')
      } else if (filter.labelForDate === 'weekago') {
        this.labelDate = this.$lang[this.langId].a_week_ago + '\n' +
                        moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                        moment(this.params.end_date).format('DD MMM YYYY')
      } else if (filter.labelForDate === 'monthago') {
        this.labelDate = this.$lang[this.langId].a_month_ago + '\n' +
                        moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                        moment(this.params.end_date).format('DD MMM YYYY')
      } else if (filter.labelForDate === 'thismonth') {
        this.labelDate = this.$lang[this.langId].this_month + '\n' +
                        moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                        moment(this.params.end_date).format('DD MMM YYYY')
      } else if (filter.labelForDate === 'lastmonth') {
        this.labelDate = this.$lang[this.langId].last_month + '\n' +
                        moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                        moment(this.params.end_date).format('DD MMM YYYY')
      } else if (filter.labelForDate === 'custom') {
        this.labelDate = this.$lang[this.langId].custom + '\n' +
                        moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                        moment(this.params.end_date).format('DD MMM YYYY')
      }
    },

    toggleFilter() {
      if (this.showFilter) {
        this.showFilter = false
      } else {
        this.showFilter = true
      }
    },

    dateFilterClose() {
      this.showFilter = false
    },

    dateFilterReset(data) {
      this.labelDate = this.$lang[this.langId].today + '\n' +
                        moment().format('DD MMM YYYY') + ' - ' +
                        moment().format('DD MMM YYYY'),
      this.params.start_date = moment().format('YYYY-MM-DD')
      this.params.end_date = moment().format('YYYY-MM-DD')
      this.dateFilterClose()
      this.getHarga()
    },

    dateFilterSave(filter) {
      this.params.start_date = filter.startDate
      this.params.end_date = filter.endDate
      this.dateFilterClose()
      this.setLabelFilter(filter)
      this.getHarga()
    },

    handleSelectConfirm(val){
      if (val.length > 0) {
        this.chosenConfirm = val
      }else{
        this.chosenConfirm = []
      }
    },

		getOrderPerdate(row){
			this.loadingItem = true
			if(row){
				this.paramsOrder.date = row.date
      	this.paramsOrder.order_source = row.order_source	
				this.detailOrderOjek = row
			}

			// console.log('asdffg', this.paramOrder)
			ojekOnlinePerdate(this.paramsOrder).then(response => {
        this.gridOrderOjek = response.data.data
        this.paramsOrder.per_page = response.data.per_page
        this.paramsOrder.currentPage = response.data.current_page
        this.paramsOrder.total = response.data.total
        this.loadingItem = false
      }).catch(error => {
        this.loadingItem = false
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
			this.dialogOrder = true
		},


    handleGridChangeSize(val){
      this.paramsOrder.page = 1
      this.paramsOrder.per_page = val
      this.getOrderPerdate()
    },

    handleGridCurrentChange(val){
      this.paramsOrder.currentPage = val
      this.paramsOrder.page = val
      this.getOrderPerdate()
    },

		closeOrderDialog(){
			this.paramsOrder = {
        date: moment().format('yyyy-MM-DD'),
        order_source: '',
        currentPage: 1,
        per_page: 15,
        page: 1,
        total: null
      }
			this.dialogOrder = false
			this.detailOrderOjek = {}
		},

    showConfirm(){
      this.dialogConfirm = true
    },

    cancelConfirm(row, idx){
      this.dialogConfirm = false
    },

    handleConfirm(){
      this.loadingConfirm = true
			var itemsProcessed = 0;

      this.chosenConfirm.forEach((item, index, array) => {
        let data = {
          date: item.date,
					received_date: this.postAccount.disbursementDate,
					cash_account_id: this.postAccount.bankAccount,
					expense_account_id: this.postAccount.expenseAccount,
					order_source: item.order_source
        }
				confirmOjekPrice(data).then(response => {
					itemsProcessed++;
          if(itemsProcessed === this.chosenConfirm.length) {
						this.getHarga()
						this.postAccount = {bankAccount: '', expenseAccount: '', disbursementDate: ''}
						this.$refs.multipleTable.clearSelection();
            this.chosenConfirm = []
            this.$message({
              type: 'success',
              message: this.$lang[this.langId].success_confirm
            })
            this.dialogConfirm = false
            this.loadingConfirm = false
					}
				}).catch(error => {
					itemsProcessed++;
						if(itemsProcessed === this.chosenConfirm.length) {
							this.postAccount = {bankAccount: '', expenseAccount: '', disbursementDate: ''}
							this.$refs.multipleTable.clearSelection();
							this.chosenConfirm = []
							this.dialogConfirm = false
							this.loadingConfirm = false
						}
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
    }

  }
}
</script>

<style>
.el-table__header-wrapper{
	top: 100px !important;
}
</style>
