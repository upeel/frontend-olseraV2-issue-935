<template>
  <div class="px-20">
    <el-card class="box-card">
      <div class="row">
				<div class="visible-md visible-lg visible-sm col-sm-4 col-lg-4 col-md-4 text-left table-handler-flex"  style="line-height: 5;" v-if="showBranch">
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
								<el-select filterable :loading="loadingStore" @change="getCapital" v-model="params.store_id" style="width: 100%;">
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
          <single-month-picker
            v-model="period" v-if="typePeriod === 'month'" :clearable="false" @input="handleSelectMonth"
            :style="visibleBranch2"
          />
          <single-year-picker
            v-model="period" v-if="typePeriod === 'year'" :clearable="false" @input="handleSelectYear"
            :style="visibleBranch2"
          />
          <el-radio-group class="custom-radio1" v-model="typePeriod" @change="handleChangePeriod" style="	border: groove; border-color: #409eff54; border-width: thin; width: 300px;">
            <el-radio-button label="month" style="width: 50%">
              {{ this.lang.month }}
            </el-radio-button>
            <el-radio-button label="year" style="width: 50%">
              {{ this.lang.year }}
            </el-radio-button>
          </el-radio-group>
        </div>
        <div class="col-xs-12 col-sm-5 col-lg-3 col-md-3 text-right" style="line-height: 5; text-align: -webkit-right; margin-top: 15px;">
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

            <el-table ref="multipleTable" 
              :data="plus" 
              :header-cell-style="{background:'#DDF2FA',color:'#555'}"
              class="product-table-max-height mobile-fix-height-unset"
              :default-sort="{prop: 'id', order: 'ascending'}">
              <el-table-column :label="lang.group" prop="name" >
                <template slot-scope="scope">
                  <div v-show="scope.row['totalPlus'] !== undefined">
                    <span class="font-bold">{{ scope.row.name }}</span>
                  </div>
                  <div class="pl-16" v-show="scope.row['totalPlus'] === undefined">
                    <span>{{ scope.row.name }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column :label="lang.amount" prop="amount" align="right">
                <template slot-scope="scope">
                  <div v-show="scope.row['totalPlus'] !== undefined">
                    <div v-if="scope.row.famount !== null" class="font-bold">{{ scope.row.famount }}</div>
                    <div v-else class="font-bold">{{selectedStore.currency_id}} 0</div>
                  </div>
                  <div v-show="scope.row['totalPlus'] === undefined">
                    <div v-if="scope.row.famount !== null">{{ scope.row.famount }}</div>
                    <div v-else>{{selectedStore.currency_id}} 0</div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            
            <!-- <el-table :data="minus"
              :show-header="false" 
              :default-sort="{prop: 'id', order: 'ascending'}">
              <el-table-column :label="lang.group" prop="name" />
              <el-table-column :label="lang.amount" prop="famount" align="right"/>
            </el-table> -->

            <el-table :data="final"
              :show-header="false" 
              :default-sort="{prop: 'id', order: 'ascending'}"
              final-capital 
              style="font-weight:700; border-top: 1px solid #0085CD">
              <el-table-column :label="lang.group" prop="name"/>
              <el-table-column :label="lang.amount" prop="famount" align="right"/>
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
        </div>
      </div>
    </el-card>


  </div>
</template>

<script>
import { baseApi } from 'src/http-common';
import axios from 'axios';
import Loading from 'vue-loading-overlay';
import SingleMonthPicker from 'components/modules/SingleMonthPicker';
import SingleYearPicker from 'components/modules/SingleYearPicker';
import mixinAccounting from '@/mixins/mixinAccounting';
import moment from 'moment';

export default {
  components:{
    SingleMonthPicker,
    SingleYearPicker,
    Loading
  },
  mixins: [mixinAccounting],
  data() {
    return {
      isLoading: false,
			loadingStore: false,
      loadingPDF: false,
      selectedMonth: moment().format('yyyy-MM'),
      isSetup: 'true',
			dataStore: [],
      plus: [],
      minus: [],
      final: [],
      params: {
				store_id: this.$store.getters.selectedStore.store_id,
        year: moment().format('yyyy'),
        month: moment().format('MM')
      },
      period: moment().format('yyyy-MM'),
      typePeriod: "month",
			allBranch: {value: false, type: 'allstore', url: 'account/capitalstatement/allbranch'},
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
        className = 'col-sm-5 col-lg-5 col-md-5 text-center'
      } else {
        className = 'col-sm-7 col-lg-9 col-md-9  text-left'
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
    handleSelectMonth (value) {
      // this.params.year = moment(value).format('yyyy')
      // this.params.month = moment(value).format('MM')
      // this.selectedMonth = moment(value).format('yyyy-MM')
      this.period = moment(value).format('YYYY-MM')
      this.getCapital()
    },

		setAllBranch(val){
			this.allBranch.type = 'allstore'
			this.params.store_id = this.selectedStore.store_id
			if(!val){
				this.dataStore = []
			}

			const data = {
				allBranch : val,
				typeBranch: this.allBranch.type,
				defaultStore: this.params.store_id
			}

			this.$store.commit('SET_ACCOUNTING_REPORT', data)
			this.getCapital()
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
				this.allBranch.url = 'account/capitalstatement/allbranch'
				this.getCapital()
			}else{
				this.allBranch.url = 'account/capital/perstore'
				this.getStoreList()
				this.getCapital()
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

    handleSelectYear (value) {
      this.period = moment(value).format('YYYY')
      this.getCapital()
    },

    handleChangePeriod (value){
      if(value === 'month'){
        this.period = moment().format('yyyy-MM')
      }else{
        this.period = moment().format('YYYY')
      }
      this.typePeriod = value
      this.getCapital()
    },

    getCapital() {
      this.isLoading = true
      this.plus  = []
      this.minus = []
      this.final = []
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let params = {
        period: this.period,
				store_id: this.params.store_id
      }

      let first_capital = {}
      let investasi = {}
      let prive = {}
      let penambahan_modal = {}
      let pendapatan_bersih = {}
      let end_capital = {}

			let urlBalance = this.allBranch.value ? this.allBranch.url : 'account/capitalstatement'

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, urlBalance),
        headers: headers,
        params: params
      }).then(response => {
        this.isLoading = false
        let res = response.data.data
				if(response.data.has_branch === 0){
					this.allBranch = {value: false, type: 'allstore', url: 'account/capitalstatement/allbranch'}
					this.showBranch = false
					this.$store.commit('SET_ACCOUNTING_REPORT', {})
				}else{
					this.showBranch = true
				}

        first_capital = res['first_capital']
        investasi = res['investasi']
        penambahan_modal = res['total_penambahan']
        pendapatan_bersih = res['pendapatan_bersih']
        prive = res['prive']
        end_capital = res['end_capital']

        this.plus.push(
          {id: 1, name: first_capital.name, amount: first_capital.int_amount, famount: first_capital.famount, totalPlus: true},
          {id: 2, name: this.$lang[this.langId].capital_increase, amount: '', famount: '', totalPlus: true},
          {id: 3, name: this.$lang[this.langId].total_profit, amount: pendapatan_bersih.int_amount, famount: pendapatan_bersih.famount},
          {id: 4, name: investasi.name, amount: investasi.int_amount, famount: investasi.famount},
          {id: 5, name: prive.name, amount: prive.int_amount, famount: prive.famount},
          {id: 6, name: 'Total '+this.lowerFirstLetter(this.$lang[this.langId].capital_increase), amount: penambahan_modal.int_amount, famount: penambahan_modal.famount, totalPlus: true},
        )
        this.final.push({id: 1, name: end_capital.name, amount: end_capital.int_amount, famount: end_capital.famount, totalPlus: true})
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
        if (index === 0) {
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
          sums[index] = 'N/A';
        }
      });

      return sums;
    },

    capitalize(value){
      let capitalize= '';
      if(value){
        capitalize = value[0].toUpperCase() + value.slice(1);
      }
      return capitalize
    },
    
    getFileMobile(type) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let params = {
        period: this.period,
				store_id: this.params.store_id
      }

			let urlBalance = this.allBranch.value ? this.allBranch.url : 'account/capitalstatement/'

      axios({
        url: baseApi(this.selectedStore.url_id, this.langId, urlBalance + type),
        method: 'GET',
        responseType: 'blob',
        headers,
        params: params
      }).then((response) => {
        const file = new Blob([response.data])
        const fileName = this.$lang[this.langId].capital_statement + '-' + this.period + '.' + type
        const url = window.URL.createObjectURL(file)
        const apiParams = '?period=' + this.period
        const apiURL = '/download/api/' + this.selectedStore.url_id + '/admin/v1/' + this.langId + urlBalance + type
        window.location = apiURL + apiParams + ',' + fileName
        this.loadingPDF = false
      }).then(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
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
          period: this.period,
					store_id: this.params.store_id
        }

				let urlBalance = this.allBranch.value ? this.allBranch.url+'/pdf' : 'account/capitalstatement/pdf'

        axios({
          url: baseApi(this.selectedStore.url_id, this.langId, urlBalance),
          method: 'GET',
          responseType: 'blob',
          headers,
          params: params
        }).then((response) => {
          const file = new Blob([response.data])
          const fileName = this.$lang[this.langId].capital_statement + '-' + this.period + '.pdf'
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
				this.allBranch.url = 'account/capitalstatement/allbranch'
			}else{
				this.allBranch.url = 'account/capital/perstore'
				this.getStoreList()
			}
		}
    // this.getMonth()
    this.getCapital()
  }
}
</script>

<style>
  .el-table .final-capital {
    background: #f0f9eb;
  }
</style>
