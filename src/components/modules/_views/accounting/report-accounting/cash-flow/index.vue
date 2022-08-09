<template>
  <div>
    <el-card class="box-card">
      <div class="row">
				<div class="visible-md visible-lg visible-sm col-sm-4 col-lg-4 col-md-4 text-left"  style="line-height: 5;" v-if="showBranch">
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
												<el-checkbox v-model="allBranch.value" @change="setAllBranch">{{$lang[langId].reconciliation}}</el-checkbox>
											</el-col>
											<el-col :span="4" align="right">
												<el-tooltip :content="$lang[langId].all_branch_report" placement="bottom">
													<i class="el-icon-info"></i>
												</el-tooltip>
											</el-col>
											<el-col :span="24" v-show="showBranch">
												<el-radio-group v-show="allBranch.value" v-model="allBranch.type" @change="changeTypeBranch">
													<el-radio label="allstore" border>{{$lang[langId].all +' '+ lang.store}}</el-radio>
													<el-radio label="separate" border>Per {{lang.store}}</el-radio>
												</el-radio-group>
											</el-col>
										</el-row>
									</div>
								</div>
								<el-button slot="reference" style="padding: 8px; font-size: large;"><svg-icon icon-class="setting_ico"></svg-icon></el-button>
							</el-popover>
						</el-col>
						<el-col :span="20" v-if="allBranch.type === 'separate'">
							<el-select filterable :loading="loadingStore" @change="getCashFlow"	v-model="params.store_id" style="width: 100%;">
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
        <div :class="visibleBranch1" class="col-xs-12">
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
            :style="visibleBranch2"
          />
          <single-year-picker
            v-model="period" v-show="typePeriod === 'year'" :clearable="false" @input="handleSelectYear"
            :style="visibleBranch2"
          />
          <el-radio-group class="custom-radio1" v-model="typePeriod" @change="handleChangePeriod" style="	border: groove; border-color: #409eff54; border-width: thin; width: 300px;">
            <el-radio-button label="custom" style="width: 40%">
              {{$lang[langId].custom}}
            </el-radio-button>
            <el-radio-button label="month" style="width: 30%">
              {{ this.lang.month }}
            </el-radio-button>
            <el-radio-button label="year" style="width: 30%">
              {{ this.lang.year }}
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
									<div class="sub-title mb-12" v-if="showBranch">
										<span class="font-16 color-primary font-bold">{{$lang[langId].report_settings}}</span>
									</div>

									<el-row :gutter="20" style="line-height: 2;">
										<el-col :span="24">
											<div class="biodata mb-8">
												<el-checkbox v-model="allBranch.value" @change="setAllBranch">{{$lang[langId].reconciliation}}</el-checkbox><br>
												<p class="font-12" v-html="$lang[langId].all_branch_report"></p>
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
						</el-col>
					</el-row>
					<el-button class="visible-md visible-sm visible-lg"
            @click="getPDF()">
            <span v-if="loadingPDF">
              <loading :active="true" color= '#1bb4e6' loader="dots" :width="45" :height="10" backgroundColor='#ffffff' style="text-align: center"></loading>
            </span>
            <span v-else><svg-icon type="pdf-file"></svg-icon> PDF</span>
          </el-button>
        </div>
      </div>

      <div class="card-body">
        <div style="margin-top: 24px">
          <div v-if="isLoading === false">
            <div class="table-responsive" style="margin-top: 24px">
              <table class="acounting-nested-table" style="width: 100%;">
                <tbody>
                  <tr class="nested-table-name-row">
                    <th class="name" colspan="3">{{firstCash.name}}</th>
                  </tr>
                  <tr class="nested-table-summary-group">
                    <td>Total {{capitalize(firstCash.name)}}</td>
                    <td align="right">{{firstCash.famount}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="table-responsive" style="margin-top: 24px">
              <table class="acounting-nested-table" style="width: 100%;">
                <tbody>
                  <tr class="nested-table-name-row">
                    <th class="name" colspan="3">{{$lang[langId].cash_flow }}</th>
                  </tr>
                  <template v-for="(cashFlow, idx) in dataCashFlow">
                    <tr class="nested-table-data-list" :key="cashFlow.id">
                      <td>{{capitalize(cashFlow.name)}}</td>
                      <td align="right" v-if="cashFlow.children.length === 0">0</td>
                      <td align="right" v-else></td>
                    </tr>
                    <template v-for="(cashFlowChild, idxChild) in cashFlow.children">
                      <tr class="nested-table-subdata-list" :key="parseInt(cashFlow.id+''+idxChild)">
                        <td>{{capitalize(cashFlowChild.name)}}</td>
                        <td v-if="cashFlowChild.famount !== '0'" align="right">
													<router-link v-if="allBranch.value" :to="{ name:'Cash Flow Statement - Detail All Branch', params: {row: {data: cashFlowChild, period: cashFlowChild.period, typePeriod: typePeriod,
														 store: {store_id: params.store_id, store_name: selectedStore.name}, link: 'account/cashflow/detail/perstore'}}}">
														{{cashFlowChild.famount}}
													</router-link>
                          <router-link v-else :to="{ name:'Cash Flow Statement - Detail', params: {row: {data: cashFlowChild, period: cashFlowChild.period, typePeriod: typePeriod,
                            store: {store_id: params.store_id, store_name: selectedStore.name}}}}">
                            {{cashFlowChild.famount}}
                          </router-link>
                        </td>
                        <td v-else align="right">
                          {{cashFlowChild.famount}}
                        </td>
                      </tr>
                    </template>
                    <tr v-if="cashFlow.children.length !== 0" class="nested-table-summary-list" :key="parseInt(idx+'000')">
                      <td>SubTotal {{capitalize(cashFlow.name)}}</td>
                      <td align="right">{{cashFlow.famount}}</td>
                    </tr>
                  </template>
                  <tr class="nested-table-summary-group">
                    <td>Total {{cashIncrease.name}}</td>
                    <td align="right">{{cashIncrease.famount}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="table-responsive" style="margin-top: 24px">
              <table class="acounting-nested-table" style="width: 100%;">
                <tbody>
                  <tr class="nested-table-name-row">
                    <th class="name" colspan="3">{{endCash.name}}</th>
                  </tr>
                  <tr class="nested-table-summary-group">
                    <td>Total {{capitalize(endCash.name)}}</td>
                    <td align="right">{{endCash.famount}}</td>
                  </tr>
                </tbody>
              </table>
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
import SingleMonthPicker from 'components/modules/SingleMonthPicker';
import SingleYearPicker from 'components/modules/SingleYearPicker';
import moment from 'moment';
import mixinAccounting from '@/mixins/mixinAccounting';

export default {
  components:{
    CustomDateFilter,
    SingleMonthPicker,
    SingleYearPicker,
    Loading
  },
  mixins: [mixinAccounting],
  data() {
    return {
      isLoading: false,
      loadingPDF: false,
			loadingStore: false,
      selectedMonth: moment().format('yyyy-MM'),
      showFilter: false,
      labelDate: '',
      isSetup: 'true',
      dialogDetail: false,
      dataCashFlow: [],
			dataStore: [],
      firstCash: {},
      cashIncrease: {},
      endCash: {},
      params: {
				store_id: this.$store.getters.selectedStore.store_id,
        year: moment().format('yyyy'),
        month: moment().format('MM'),
        start_date: moment().format('yyyy-MM-DD'),
        end_date: moment().format('yyyy-MM-DD')
      },

      period: moment().format('yyyy-MM'),
      typePeriod: "month",
			allBranch: {value: false, type: 'allstore', url: 'account/cashflow/allbranch'},
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
		visibleBranch1(){
			let className = ''
      if (this.showBranch) {
        className = 'col-sm-4 col-lg-4 col-md-4 text-center'
      } else {
        className = 'col-sm-8 col-lg-8 col-md-8  text-left'
      }

      return className
		},
		visibleBranch2(){
			let className = ''
      if (this.showBranch) {
        className = 'margin: auto'
      } else {
        className = 'margin: 0px'
      }

      return className
		}
  },

  methods: {
    getPeriod() {
      if(Object.keys(this.$route.params).includes('period') === true){
        this.period = moment(this.$route.params.period.toString()).format('yyyy-MM')
        this.typePeriod = this.$route.params.typePeriod 
      }
      this.labelDate = this.$lang[this.langId].today + '\n' +
                  moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                  moment(this.params.end_date).format('DD MMM YYYY')

      this.getCashFlow()
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
			this.getCashFlow()
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
				this.allBranch.url = 'account/cashflow/allbranch'
				this.getCashFlow()
			}else{
				this.allBranch.url = 'account/cashflow/perstore'
				this.getStoreList()
				this.getCashFlow()
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
      this.getCashFlow()
    },

    dateFilterSave(filter) {
      this.params.start_date = filter.startDate
      this.params.end_date = filter.endDate
      this.dateFilterClose()
      this.setLabelFilter(filter)
      this.getCashFlow()
    },

    handleSelectMonth (value) {
      // this.params.period = moment(value).format('yyyy-MM')
      // this.params.year = moment(value).format('yyyy')
      // this.params.month = moment(value).format('MM')
      // this.selectedMonth = moment(value).format('yyyy-MM')
      this.dataCashFlow = []
      this.period = moment(value).format('YYYY-MM')
      this.getCashFlow()
    },

    handleSelectYear (value) {
      this.dataCashFlow = []
      this.period = moment(value).format('YYYY')
      this.getCashFlow()
    },

    handleChangePeriod (value){
      if(value === 'month'){
        this.period = moment().format('yyyy-MM')
      }else{
        this.period = moment().format('YYYY')
      }
      this.dataCashFlow = []
      this.typePeriod = value
      this.getCashFlow()
    },

    getCashFlow() {
      this.isLoading = true
      this.dataCashFlow = []
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let params = {}
      if(this.typePeriod === 'custom'){
        params = {
					store_id: this.params.store_id,
          start_date: this.params.start_date,
          end_date: this.params.end_date
        }
      }else{
        params = {
					store_id: this.params.store_id,
          period: this.period
        }
      }

			let urlBalance = this.allBranch.value ? this.allBranch.url : 'account/cashflowstatement'

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, urlBalance),
        headers: headers,
        params: params
      }).then(response => {
        this.isLoading = false
        let res = response.data
        this.dataCashFlow.push({id: 1, name: res.operational.name, amount: res.operational.int_amount, famount: res.operational.famount, children: res.operational.children})
        this.dataCashFlow.push({id: 2, name: res.investasi.name, amount: res.investasi.int_amount, famount: res.investasi.famount, children: res.investasi.children})
        this.dataCashFlow.push({id: 3, name: res.funding.name, amount: res.funding.int_amount, famount: res.funding.famount, children: res.funding.children})
				if(response.data.has_branch === 0){
					this.allBranch = {value: false, type: 'allstore', url: 'account/cashflow/allbranch'}
					this.showBranch = false
					this.$store.commit('SET_ACCOUNTING_REPORT', {})
				}else{
					this.showBranch = true
				}
        this.firstCash = res.first_cash
        this.cashIncrease = res.cash_increase
        this.endCash   = res.end_cash
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

    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = 'SubTotal';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] =  this.formatPrice(values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }), 0);
        } else {
          sums[index] = '';
        }
      });

      return sums;
    },

    getFileMobile(type) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let params = {
        period: this.period
      }

			let urlBalance = this.allBranch.value ? this.allBranch.url : 'account/cashflowstatement/'

      axios({
        url: baseApi(this.selectedStore.url_id, this.langId, urlBalance + type),
        method: 'GET',
        responseType: 'blob',
        headers,
        params: params
      }).then((response) => {
        const file = new Blob([response.data])
        const fileName = this.$lang[this.langId].cash_flow_statement + '-' + this.period + '.' + type
        const url = window.URL.createObjectURL(file)
        const apiParams = '?period=' + this.period
        const apiURL = '/download/api/' + this.selectedStore.url_id + '/admin/v1/' + this.langId + urlBalance + type
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

        let params = {
          period: this.period
        }

				let urlBalance = this.allBranch.value ? this.allBranch.url + '/pdf' : 'account/cashflowstatement/pdf'

        axios({
          url: baseApi(this.selectedStore.url_id, this.langId, urlBalance),
          method: 'GET',
          responseType: 'blob',
          headers,
          params: params
        }).then((response) => {
          const file = new Blob([response.data])
          const fileName = this.$lang[this.langId].cash_flow_statement + '-' + this.period + '.pdf'
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

  },

  mounted() {
		if(this.settingValue.hasOwnProperty("allBranch")){
			this.allBranch.value = this.settingValue.allBranch
			this.allBranch.type = this.settingValue.typeBranch
			this.params.store_id =  this.settingValue.defaultStore
			if(this.settingValue.typeBranch === 'allstore'){
				this.allBranch.url = 'account/cashflow/allbranch'
			}else{
				this.allBranch.url = 'account/cashflow/perstore'
				this.getStoreList()
			}
		}
    this.getPeriod()
  }
}
</script>
