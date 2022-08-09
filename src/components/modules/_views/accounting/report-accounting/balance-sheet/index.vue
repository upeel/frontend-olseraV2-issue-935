<template>
  <div class="px-20">
    <el-card class="box-card">
        <div class="row">
          <div class="visible-md visible-lg visible-sm col-sm-4 col-lg-4 col-md-4 text-left table-handler-flex"  style="line-height: 5;">
						<el-row>
							<el-col :span="allBranch.value ? 4 : 24">
								<el-popover
									placement="bottom"
									width="400"
									trigger="click">
									<div>
										<div class="sub-title mb-12">
											<span class="font-16 color-primary font-bold">{{$lang[langId].report_settings}}</span>
										</div>
										<div class="biodata">
											<el-row :gutter="20" style="line-height: 2;">
												<el-col :span="20">
													<el-checkbox v-model="activeTrans" @change="checkTrans">{{$lang[langId].account_not0}}</el-checkbox>
												</el-col>
												<el-col :span="4" align="right">
													<el-tooltip :content="$lang[langId].account_not0_text" placement="bottom">
														<i class="el-icon-info"></i>
													</el-tooltip>
												</el-col>
											</el-row>
											<div v-if="showBranch">
												<hr style="margin: 10px 0; border: 0; border-top: 1px solid #767676;"/>
												<el-row :gutter="20" style="line-height: 2;">
													<el-col :span="20">
														<el-checkbox v-model="allBranch.value" @change="setAllBranch">{{$lang[langId].reconciliation}}</el-checkbox>
													</el-col>
													<el-col :span="4" align="right">
														<el-tooltip :content="$lang[langId].all_branch_report" placement="bottom">
															<i class="el-icon-info"></i>
														</el-tooltip>
													</el-col>
													<el-col :span="24">
														<el-radio-group v-show="allBranch.value" v-model="allBranch.type" @change="changeTypeBranch">
															<el-radio label="allstore" border>{{$lang[langId].all +' '+ lang.store}}</el-radio>
															<el-radio label="separate" border>Per {{lang.store}}</el-radio>
														</el-radio-group>
													</el-col>
												</el-row>
											</div>
										</div>
									</div>
									<el-button slot="reference" style="padding: 8px; font-size: large;"><svg-icon icon-class="setting_ico"></svg-icon></el-button>
								</el-popover>
							</el-col>
							<el-col :span="20" v-if="allBranch.type === 'separate'">
								<el-select filterable :loading="loadingStore" @change="getBalanceSheet"	v-model="params.store_id" style="width: 100%;">
									<el-option
										v-for="item in dataStore"
										:key="item.store_id"
										:label="item.name"
										:value="item.store_id"
										>
									</el-option>
								</el-select>
							</el-col>
						</el-row>
          </div>
          <div class="col-xs-12 col-sm-4 col-lg-4 col-md-4 text-center" >
              <single-date-picker
                v-model="period" v-show="typePeriod === 'daily'" :clearable="false" @picked="handleSelectDate"
                tyle="margin: auto"
              />
              <single-month-picker
                v-model="period" v-show="typePeriod === 'month'" :clearable="false" @input="handleSelectMonth"
                tyle="margin: auto"
              />
              <single-year-picker
                v-model="period" v-show="typePeriod === 'year'" :clearable="false" @input="handleSelectYear"
                tyle="margin: auto"
              />
              <el-radio-group class="custom-radio1" v-model="typePeriod" @change="handleChangePeriod" style="	border: groove; border-color: #409eff54; border-width: thin; width: 300px;">
                <el-radio-button label="daily" style="width: 34%;">
                  {{ $lang[langId].daily }}
                </el-radio-button>
                <el-radio-button label="month" style="width: 33%;">
                  {{ lang.month }}
                </el-radio-button>
                <el-radio-button label="year" style="width: 33%;">
                  {{ lang.year }}
                </el-radio-button>
              </el-radio-group>
          </div>
          <div class="col-xs-12 col-sm-4 col-lg-4 col-md-4 text-right" style="line-height: 5; text-align: -webkit-right; margin-top: 15px;">
            <el-row class="visible-xs">
              <el-col :span="12" class="text-left">
								<el-popover
									placement="bottom"
									width="400"
									trigger="click">
									<div>
										<div class="sub-title mb-12">
											<span class="font-16 color-primary font-bold">{{$lang[langId].report_settings}}</span>
										</div>

										<el-row :gutter="20" style="line-height: 2;">
											<el-col :span="24">
												<div class="biodata mb-8">
													<el-checkbox v-model="activeTrans" @change="checkTrans">{{$lang[langId].account_not0}}</el-checkbox><br>
													<p class="font-12" v-html="$lang[langId].account_not0_text"></p>
												</div>
												<div v-if="showBranch">
													<el-divider></el-divider>
													<div class="biodata mb-8">
														<el-checkbox v-model="allBranch.value" @change="setAllBranch">{{$lang[langId].reconciliation}}</el-checkbox><br>
														<p class="font-12" v-html="$lang[langId].all_branch_report"></p>
													</div>
												</div>
											</el-col>
										</el-row>
									</div>
									<el-button slot="reference">{{ $lang[langId].setting }}</el-button>
								</el-popover>
              </el-col>
              <el-col :span="12">
                <el-button
                  @click="getPDF()"
                  :disabled="loadingPDF">
                  <span v-if="loadingPDF">
                    <loading :active="true" color= '#1bb4e6' loader="dots" :width="45" :height="10" backgroundColor='#ffffff' style="text-align: center"></loading>
                  </span>
                  <span v-else><svg-icon type="pdf-file"></svg-icon> PDF</span>
                </el-button>
                <el-button
                  @click="getExcel">
                  <span v-if="loadingExcel">
                    <loading :active="true" color= '#1bb4e6' loader="dots" :width="45" :height="10" backgroundColor='#ffffff' style="text-align: center"></loading>
                  </span>
                  <span v-else><svg-icon type="excel"></svg-icon> EXCEL</span>
                </el-button>
              </el-col>
            </el-row>
            <div class="visible-md visible-sm visible-lg">
              <el-button
                @click="getPDF()"
                :disabled="loadingPDF">
                <span v-if="loadingPDF">
                  <loading :active="true" color= '#1bb4e6' loader="dots" :width="45" :height="10" backgroundColor='#ffffff' style="text-align: center"></loading>
                </span>
                <span v-else><svg-icon type="pdf-file"></svg-icon> PDF</span>
              </el-button>
              <el-button
                @click="getExcel"
                :disabled="loadingExcel">
                <span v-if="loadingExcel">
                  <loading :active="true" color= '#1bb4e6' loader="dots" :width="45" :height="10" backgroundColor='#ffffff' style="text-align: center"></loading>
                </span>
                <span v-else><svg-icon type="excel"></svg-icon> EXCEL</span>
              </el-button>
            </div>
          </div>
        </div>
      <hr/>
      <div class="card-body">
        <div style="margin-top: 24px">
          <div v-if="isLoading === false">
            <balance-list
              :dataAsset="dataAsset"
              :dataLiabilities="dataLiabilities"
              :typePeriod="typePeriod"
              :periods="new Date(period)"
							:storeBranch="{store_id: params.store_id, store_name: selectedStore.name}"
            />
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
      </div>
    </el-card>
    <custom-month-filter
      :show-filter="showFilter"
      @close="monthFilterClose"
      @reset="monthFilterReset"
      @save="monthFilterSave"
    />
  </div>
</template>

<script>
import { baseApi } from 'src/http-common';
import axios from 'axios';
import Loading from 'vue-loading-overlay';
import CustomMonthFilter from 'modules/CustomMonthFilter';
import moment from 'moment';
import BalanceList from './table';
import SingleDatePicker from 'components/modules/SingleDatePicker';
import SingleMonthPicker from 'components/modules/SingleMonthPicker';
import SingleYearPicker from 'components/modules/SingleYearPicker';
import mixinAccounting from '@/mixins/mixinAccounting';

export default {
  components:{
    SingleDatePicker,
    SingleMonthPicker,
    SingleYearPicker,
    CustomMonthFilter,
    BalanceList,
    Loading
  },
  mixins: [mixinAccounting],
  data() {
    return {
      isLoading: false,
      loadingPDF: false,
      loadingExcel: false,
			loadingStore: false,
			loadingSetting: false,
      showFilter: false,
      isSetup: 'true',
      labelMonth: this.$lang[this.$store.state.userStores.langId].last_3_month + '\n' +
        moment().subtract(2, 'month').format('MMM YYYY') + ' - ' +
        moment().format('MMM YYYY'),
      autoWidth: '',
      autoHeight: '',
      dataStore: [],
      dataHeader: [],
      asset: {},
      dataAsset: [],
      liabilities: {},
      dataLiabilities: [],
      tableTotal: [],
      typePeriod: "month",
      period: moment().format('yyyy-MM'),
      activeTrans: false,
      params: {
				store_id: this.$store.getters.selectedStore.store_id,
        report: 'balance_sheet',
        transaction: 0,
        start: moment().subtract(2, 'month').format('YYYYMM'),
        end: moment().format('YYYYMM'),
      },
			allBranch: {value: false, type: 'allstore', url: 'account/balance/allbranch'},
			showBranch: false,
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
    settingValue() {
      return this.$store.state.accountingReport
    },
  },

  watch: {
    selectedStore() {
      this.getMonth()
    }
  },

  methods: {
    getMonth() {
      if(Object.keys(this.$route.params).includes('period') === true){
        this.period = moment(this.$route.params.period.toString()).format('yyyy-MM')
        this.typePeriod = this.$route.params.typePeriod 
      }
      if(Object.keys(this.$route.params).includes('lastParams') === true){
        this.params = {
          report: 'balance_sheet',
          start: this.$route.params.lastParams.start,
          end: this.$route.params.lastParams.end,

        }
      }
    },

    toggleFilter() {
      if (this.showFilter) {
        this.showFilter = false
      } else {
        this.showFilter = true
      }
    },

    monthFilterClose() {
      this.showFilter = false
    },

    monthFilterReset(data) {
      this.filterTag = '',
      this.params ={
        report: 'balance_sheet',
        start: moment().subtract(2, 'month').format('YYYYMM'),
        end: moment().format('YYYYMM'),
      }
      this.labelMonth = this.$lang[this.langId].last_3_month + '\n' +
      moment().subtract(2, 'month').format('MMM YYYY') + ' - ' +
      moment().format('MMM YYYY')
      this.monthFilterClose()
      this.getBalanceSheet()
    },

    monthFilterSave(filter) {
      this.filterTag = filter.labelForDate
      if (filter.labelForDate === 'thisYear' || filter.labelForDate === 'this2Year') {
        this.$set(this.params, 'start', filter.startDate)
        this.$set(this.params, 'end', filter.endDate)
      } else {
        this.$set(this.params, 'start', moment(filter.startDate).format('YYYYMM'))
        this.$set(this.params, 'end', moment(filter.endDate).format('YYYYMM'))
      }
      this.monthFilterClose()
      this.setLabelFilter(filter)
      this.getBalanceSheet()
    },

    setLabelFilter  (filter) {
      if (filter.labelForDate === 'thisMonth') {
        this.labelMonth = this.$lang[this.langId].this_month + '\n(' +
                        moment(this.params.start).format('MMM YYYY') + ')'
      } else if (filter.labelForDate === 'monthAgo') {
        this.labelMonth = this.$lang[this.langId].last_month + '\n(' +
                        moment(this.params.start).format('MMM YYYY') + ')'
      } else if (filter.labelForDate === 'last3Month') {
        this.labelMonth = this.$lang[this.langId].last_3_month + '\n(' +
                        moment(this.params.start).format('MMM YYYY') + ' - ' +
                        moment(this.params.end).format('MMM YYYY') + ')'
      } else if (filter.labelForDate === 'last6Month') {
        this.labelMonth = this.$lang[this.langId].last_6_month + '\n(' +
                        moment(this.params.start).format('MMM YYYY') + ' - ' +
                        moment(this.params.end).format('MMM YYYY') + ')'
      } else if (filter.labelForDate === 'last12Month') {
        this.labelMonth = this.$lang[this.langId].last_12_month + '\n(' +
                        moment(this.params.start).format('MMM YYYY') + ' - ' +
                        moment(this.params.end).format('MMM YYYY') + ')'
      } else if (filter.labelForDate === 'last24Month') {
        this.labelMonth = this.$lang[this.langId].last_24_month + '\n(' +
          moment(this.params.start).format('MMM YYYY') + ' - ' +
          moment(this.params.end).format('MMM YYYY') + ')'
      } else if (filter.labelForDate === 'last36Month') {
        this.labelMonth = this.$lang[this.langId].last_36_month + '\n(' +
          moment(this.params.start).format('MMM YYYY') + ' - ' +
          moment(this.params.end).format('MMM YYYY') + ')'
      } else if (filter.labelForDate === 'thisYear') {
        this.labelMonth = this.$lang[this.langId].this_year + '\n(' +
                        moment(this.params.start).format('YYYY') + ')'
      } else if (filter.labelForDate === 'this2Year') {
        this.labelMonth = this.$lang[this.langId].this_2_year + '\n(' +
                        moment(this.params.start).format('YYYY') + ' - ' +
                        moment(this.params.end).format('YYYY') + ')'
      } else if (filter.labelForDate === 'custom') {
        this.labelMonth = this.$lang[this.langId].custom + '\n(' +
                        moment(this.params.start).format('MMM YYYY') + ' - ' +
                        moment(this.params.end).format('MMM YYYY') + ')'
      }
    },

    handleChangePeriod (value){
      if(value === 'daily'){
        this.period = moment().format('yyyy-MM-DD')
      }else if(value === 'month'){
        this.period = moment().format('yyyy-MM')
      }else{
        this.period = moment().format('YYYY')
      }
      this.typePeriod = value
      this.getBalanceSheet()
    },

    handleSelectDate (value) {
      this.period = moment(value).format('yyyy-MM-DD')
      this.getBalanceSheet()
    },

    handleSelectMonth (value) {
      this.period = moment(value).format('yyyy-MM')
      this.getBalanceSheet()
    },

    handleSelectYear (value) {
      this.period = moment(value).format('YYYY')
      this.getBalanceSheet()
    },
    
    checkTrans (value) {
      if(value === false){
        this.params.transaction = 0
      }else{
        this.params.transaction = 1
      }
      this.getBalanceSheet()
    },

		setAllBranch(value){
			this.allBranch.type = 'allstore'
			this.params.store_id = this.selectedStore.store_id
			if(value){
				this.dataStore = []
			}

			const data = {
				allBranch : value,
				typeBranch: this.allBranch.type,
				defaultStore: this.params.store_id
			}

			this.$store.commit('SET_ACCOUNTING_REPORT', data)
			this.getBalanceSheet()
		},

		changeTypeBranch(val){
			const data = {
				allBranch : this.allBranch.value,
				typeBranch: val,
				defaultStore: this.params.store_id
			}

			this.$store.commit('SET_ACCOUNTING_REPORT', data)
			if(val === 'allstore'){
				this.params.store_id = this.selectedStore.store_id
				this.allBranch.url = 'account/balance/allbranch'
				this.getBalanceSheet()
			}else{
				this.allBranch.url = 'account/balance/perstore'
				this.getStoreList()
				this.getBalanceSheet()
			}
		},

		getStoreList(){
			this.loadingStore = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/indexstore'),
        headers: headers
      }).then(response => {
        this.dataStore = response.data.data
        this.loadingStore = false
      }).catch(error => {
        this.dataStore = []
        this.loadingStore = false
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

    getBalanceSheet() {
      this.isLoading = true
      this.dataHeader = []
      this.tableTotal = []
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        period: this.period,
        transaction: this.params.transaction,
				store_id: this.params.store_id
      }

			let urlBalance = this.allBranch.value ? this.allBranch.url : 'account/balancenew'

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, urlBalance),
        headers: headers,
        params: params
      }).then(response => {
        this.isLoading = false
				if(response.data.has_branch === 0){
						this.allBranch = {value: false, type: 'allstore', url: 'account/balance/allbranch'}
						this.showBranch = false
						this.$store.commit('SET_ACCOUNTING_REPORT', {})
				}else{
					this.showBranch = true
				}

        this.dataAsset = response.data.assets
        this.dataLiabilities = response.data.liabilityCapital

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

    detailReport (row, idx, column ) {
      let per = this.period[idx]
      let lastParams = this.params
      let label = this.labelMonth
      let report = 'Balance Sheet'
      this.$router.push({ name:'Accounting Report - Detail', params: {data: row, period: per, periodName: column, lastParams: lastParams, label: label, report: report}})
    },

    getFileMobile(type) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let params = {
        period: this.period,
        transaction: this.params.transaction,
				store_id: this.params.store_id
        // type: type,
        // sort_column: this.params.sort_column,
        // sort_type: this.params.sort_type
      }

			let urlBalance = this.allBranch.value ? this.allBranch.url : 'account/balancenew/'

      axios({
        url: baseApi(this.selectedStore.url_id, this.langId, urlBalance + type),
        method: 'GET',
        responseType: 'blob',
        headers,
        params
      }).then((response) => {
        const file = new Blob([response.data])
        const fileName = this.$lang[this.langId].balance_sheet + '-' + this.period + '.' + type
        const url = window.URL.createObjectURL(file)
        const apiParams = '?report=' + this.params.report +  '&period=' + this.period
        const apiURL = '/download/api/' + this.selectedStore.url_id + '/admin/v1/' + this.langId + '/account/gainbalance/' + type
        window.location = apiURL + apiParams + ',' + fileName
        this.loadingPDF = false
      }).then(error => {
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
        this.loadingPDF = false
      })
    },

    getPDF() {
      this.loadingPDF = true
      if (this.$store.getters.webviewMode) {
        this.getFileMobile('pdf')
      } else {
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }

        let params = {}
        if(this.typePeriod === 'custom'){
          params = {
            start_date: this.params.start_date,
            end_date: this.params.end_date,
            transaction: this.params.transaction,
						store_id: this.params.store_id
          }
        }else{
          params = {
            period: this.period,
            transaction: this.params.transaction,
						store_id: this.params.store_id
          }
        }

				let urlBalance = this.allBranch.value ? this.allBranch.url +'/pdf' : 'account/balancenew/pdf'

        axios({
          url: baseApi(this.selectedStore.url_id, this.langId, urlBalance),
          method: 'GET',
          responseType: 'blob',
          headers,
          params
        }).then((response) => {
          const file = new Blob([response.data])
					let fileName = ''
          if(this.typePeriod === 'custom'){
            fileName = this.$lang[this.langId].balance_sheet + '-' + this.params.start_date + '__' + this.params.end_date + '.xlsx'
          }else{
            fileName = this.$lang[this.langId].balance_sheet + '-' + this.period + '.xlsx'
          }

          const url = window.URL.createObjectURL(file)
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click()
          this.loadingPDF = false
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
          this.loadingPDF = false
        })
      }
    },

    getExcel() {
      this.loadingExcel = true
      if (this.$store.getters.webviewMode) {
        this.getFileMobile('xlsx')
      } else {
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }

        let params = {}
        if(this.typePeriod === 'custom'){
          params = {
            start_date: this.params.start_date,
            end_date: this.params.end_date,
            transaction: this.params.transaction,
						store_id: this.params.store_id
          }
        }else{
          params = {
            period: this.period,
            transaction: this.params.transaction,
						store_id: this.params.store_id
          }
        }

				let urlBalance = this.allBranch.value ? this.allBranch.url +'/excel' : 'account/balancenew/excel'

        axios({
          url: baseApi(this.selectedStore.url_id, this.langId, urlBalance),
          method: 'GET',
          responseType: 'blob',
          headers,
          params: params
        }).then(response => {
					let fileName = ''
          if(this.typePeriod === 'custom'){
            fileName = this.$lang[this.langId].balance_sheet + '-' + this.params.start_date + '__' + this.params.end_date + '.xlsx'
          }else{
            fileName = this.$lang[this.langId].balance_sheet + '-' + this.period + '.xlsx'
          }
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click()
          this.loadingExcel = false
        })
        .catch(error => {
          this.loadingExcel = false
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
    }

  },

  mounted() {
		if(this.settingValue.hasOwnProperty("allBranch")){
			this.allBranch.value = this.settingValue.allBranch
			this.allBranch.type = this.settingValue.typeBranch
			this.params.store_id =  this.settingValue.defaultStore
			if(this.settingValue.typeBranch === 'allstore'){
				this.allBranch.url = 'account/balance/allbranch'
			}else{
				this.allBranch.url = 'account/balance/perstore'
				this.getStoreList()
			}
		}
    this.getMonth()
    this.getBalanceSheet()
  }
}
</script>
