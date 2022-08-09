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
								<el-select filterable :loading="loadingStore" @change="getGainLoss"	v-model="params.store_id" style="width: 100%;">
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
          <div class="col-xs-12 col-sm-4 col-lg-4 col-md-4 text-center">
            <el-button v-show="typePeriod === 'custom'"
              size= "small"
              class="date-filter-dashboard"
              @click="toggleFilter"
              style="width: 300px;">
              <i class="fa fa-filter" />
              <span>{{ labelDate }}</span>
            </el-button>
            <single-month-picker
              v-model="period" v-show="typePeriod === 'month'" :clearable="false" @input="handleSelectMonth"
              style="margin: auto"
            />
            <single-year-picker
              v-model="period" v-show="typePeriod === 'year'" :clearable="false" @input="handleSelectYear"
              style="margin: auto"
            />
            <el-radio-group class="custom-radio1" v-model="typePeriod" @change="handleChangePeriod" style="	border: groove; border-color: #409eff54; border-width: thin; width: 300px;">
              <el-radio-button label="custom" style="width: 40%">
                {{$lang[langId].custom}}
              </el-radio-button>
              <el-radio-button label="month" style="width: 30%">
                {{ lang.month }}
              </el-radio-button>
              <el-radio-button label="year" style="width: 30%">
                {{ lang.year }}
              </el-radio-button>
               
            </el-radio-group>
          </div>
          <div class="col-xs-12 col-sm-4 col-lg-4 col-md-4 text-right"  style="line-height: 5; text-align: -webkit-right; margin-top: 15px;">
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

      <div class="card-body">
        <div style="margin-top: 24px">
          <div v-if="isLoading === false">
            <gain-lost-list
              :operasional="operasional"
              :nonOperasional="nonOperasional"
              :labaBersih="dataLaba"
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

    <custom-date-filter
      :show-filter="showFilter"
      @close="dateFilterClose"
      @reset="dateFilterReset"
      @save="dateFilterSave"
    />
  </div>
</template>

<script>
import { baseApi } from 'src/http-common';
import axios from 'axios';
import Loading from 'vue-loading-overlay';
import CustomDateFilter from 'modules/CustomDateFilter';
import moment from 'moment';
import GainLostList from './table';
import SingleMonthPicker from 'components/modules/SingleMonthPicker';
import SingleYearPicker from 'components/modules/SingleYearPicker';
import mixinAccounting from '@/mixins/mixinAccounting';

export default {
  components:{
    SingleMonthPicker,
    SingleYearPicker,
    CustomDateFilter,
    GainLostList,
    Loading
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
		settingValue() {
      return this.$store.state.accountingReport
    },
  },

  data() {
    return {
      isLoading: false,
      loadingPDF: false,
      loadingExcel: false,
			loadingStore: false,
      showFilter: false,
      labelDate: '',
      isSetup: 'true',
      labelMonth: '',
      autoWidth: '',
      autoHeight: '',
      dataStore: [],
      operasional: {},
      nonOperasional: {},
      dataLaba: {},
      typePeriod: "month",
      period: moment().format('yyyy-MM'),
      activeTrans: false,
      filterType: '0',
      params: {
				store_id: this.$store.getters.selectedStore.store_id,
        report: 'Gain_loss',
        transaction: 0,
        start_date: moment().format('yyyy-MM-DD'),
        end_date: moment().format('yyyy-MM-DD')
      },
      dialogValidateSetup: false,
      dialogValidateReset: false,
			allBranch: {value: false, type: 'allstore', url: 'account/gainloss/allbranch', urlExcel: 'account/gainloss/excel'},
			showBranch: false,
    }
  },

  watch: {
    selectedStore() {
      this.getMonth()
    }
  },

  methods: {
    checkIndex(item){
      let children = false
      if(item != null){
        if(item[0] != null){
          if(Object.keys(item[0]).includes('children') === true){
            children = true
          }
        }
      }
      
      return children;
    },

    getMonth() {
      if(Object.keys(this.$route.params).includes('period') === true){
        this.period = moment(this.$route.params.period.toString()).format('yyyy-MM')
        this.typePeriod = this.$route.params.typePeriod 
      }

      this.labelDate = this.$lang[this.langId].today + '\n' +
                        moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                        moment(this.params.end_date).format('DD MMM YYYY')
    },

    setLabelFilter (filter) {
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
      this.getGainLoss()
    },

    dateFilterSave(filter) {
      this.params.start_date = filter.startDate
      this.params.end_date = filter.endDate
      this.dateFilterClose()
      this.setLabelFilter(filter)
      this.getGainLoss()
    },

    handleChangePeriod (value){
      if(value === 'month'){
        this.period = moment().format('yyyy-MM')
      }else{
        this.period = moment().format('YYYY')
      }
      this.typePeriod = value
      this.getGainLoss()
    },

    handleSelectMonth (value) {
      this.period = moment(value).format('yyyy-MM')
      this.getGainLoss()
    },

    checkTrans (value) {
      if(value === false){
        this.params.transaction = 0
      }else{
        this.params.transaction = 1
      }
      this.getGainLoss()
    },

    handleSelectYear (value) {
      this.period = moment(value).format('YYYY')
      this.getGainLoss()
    },

    getGainLoss() {
      this.isLoading = true
      this.dataHeader = []
      this.tableTotal = []
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

			let urlBalance = this.allBranch.value ? this.allBranch.url : 'account/gainloss'
      
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, urlBalance),
        headers: headers,
        params: params
      }).then(response => {
        this.isLoading = false
        this.operasional = response.data.operasional
        this.nonOperasional = response.data.non_operasional
        this.dataLaba = response.data.laba_bersih
				if(response.data.has_branch === 0){
						this.allBranch = {value: false, type: 'allstore', url: 'account/gainloss/allbranch'}
						this.showBranch = false
						this.$store.commit('SET_ACCOUNTING_REPORT', {})
				}else{
					this.showBranch = true
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

		setAllBranch(value){
			this.allBranch.type = 'allstore'
			this.params.store_id = this.selectedStore.store_id
			if(!value){
				this.dataStore = []
			}

			const data = {
				allBranch : value,
				typeBranch: this.allBranch.type,
				defaultStore: this.params.store_id
			}

			this.$store.commit('SET_ACCOUNTING_REPORT', data)
			this.getGainLoss()
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
				this.allBranch.url = 'account/gainloss/allbranch'
        this.allBranch.urlExcel = 'account/gainloss/excel'
				this.getGainLoss()
			}else{
				this.allBranch.url = 'account/gainloss/perstore'
        this.allBranch.urlExcel = 'account/gainloss/perstore/excel'
				this.getStoreList()
				this.getGainLoss()
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

    detailReport (row, idx, column ) {
      let per = this.period[idx]
      let lastParams = this.params
      let label = this.labelMonth
      let report = 'Income Statement'
      this.$router.push({ name:'Accounting Report - Detail', params: {data: row, period: per, periodName: column, lastParams: lastParams, label: label, report: report}})
    },

    getFileMobile(type) {
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

			let urlBalance = this.allBranch.value ? this.allBranch.url : 'account/gainloss/'

      axios({
        url: baseApi(this.selectedStore.url_id, this.langId, urlBalance + type),
        method: 'GET',
        responseType: 'blob',
        headers,
        params
      }).then((response) => {
        const file = new Blob([response.data])
        const fileName = this.$lang[this.langId].income_statement + '-' + this.params.start_date + '__' + this.params.end_date + '.' + type
        const url = window.URL.createObjectURL(file)
        const apiParams = '?report=' + this.params.report +  '&start=' + this.params.start_date + '&end='+ this.params.end_date
        const apiURL = '/download/api/' + this.selectedStore.url_id + '/admin/v1/' + this.langId + urlBalance + type
        window.location = apiURL + apiParams + ',' + fileName
      }).then(error => {
        if(typeof error.response.data.error.error === 'object'){
          let errorKey = Object.keys(error.response.data.error.error)[0];
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error[errorKey][0]
          })
          this.loadingPDF = false
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
      // if (this.$store.getters.webviewMode) {
      //   this.getFileMobile('pdf')
      // } else {
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

				let urlBalance = this.allBranch.value ? this.allBranch.url+'/pdf' : 'account/gainloss/pdf'

        axios({
          url: baseApi(this.selectedStore.url_id, this.langId, urlBalance),
          method: 'GET',
          responseType: 'blob',
          headers,
          params: params
        }).then((response) => {
          const file = new Blob([response.data])
					let fileName = ''
					if(this.typePeriod === 'custom'){
          	fileName = this.$lang[this.langId].income_statement + '-' + this.params.start_date + '__' + this.params.end_date + '.pdf'
					}else{
						fileName = this.$lang[this.langId].income_statement + '-' + this.period + '.pdf'
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
      // }
    },

    getExcel() {
      this.loadingExcel = true
      // if (this.$store.getters.webviewMode) {
      //   this.getFileMobile('xlsx')
      // } else {
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

				let urlBalance = this.allBranch.value ? this.allBranch.urlExcel : 'account/gainloss/excel'

        axios({
          url: baseApi(this.selectedStore.url_id, this.langId, urlBalance),
          method: 'GET',
          responseType: 'blob',
          headers,
          params: params
        }).then(response => {
					let fileName = ''
          if(this.typePeriod === 'custom'){
            fileName = this.$lang[this.langId].income_statement + '-' + this.params.start_date + '__' + this.params.end_date + '.xlsx'
          }else{
            fileName = this.$lang[this.langId].income_statement + '-' + this.period + '.xlsx'
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
    // },

  },

  mounted() {
		if(this.settingValue.hasOwnProperty("allBranch")){
			this.allBranch.value = this.settingValue.allBranch
			this.allBranch.type = this.settingValue.typeBranch
			this.params.store_id =  this.settingValue.defaultStore
			if(this.settingValue.typeBranch === 'allstore'){
				this.allBranch.url = 'account/gainloss/allbranch'
			}else{
				this.allBranch.url = 'account/gainloss/perstore'
				this.getStoreList()
			}
		}
    this.getMonth()
    this.getGainLoss()
  }
}
</script>
