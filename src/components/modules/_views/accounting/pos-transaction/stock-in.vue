<template>
  <div class="px-20">
    <div v-if="isSetup === 'false'" >
      <el-card class="box-card" shadow="never">
        <div class="div-nodata-accounting">
          <img src="../../../../../../static/img/no-close-date.svg" class="image" style="margin-top: 32px">
          <div class="no_close" >{{$lang[langId].setup_message}}</div>
          <el-button class="btn-set" @click="dialogSetup = true">{{$lang[langId].set_up_now}}</el-button>
        </div>
      </el-card>
    </div>

    <div v-else-if="isSetup === 'true'" >
      <el-card class="box-card" shadow="never">
        <div class="row">
          <div class="col-xs-10 col-lg-8 col-md-8 col-sm-8 text-left" style="display: -webkit-inline-box;">
            <el-button
              type="info"
              @click="dialogFilter = true"
              size="small"
              class="visible-lg visible-md visible-sm button-filter">
              <i class="fa fa-filter"></i>
              {{ $lang[langId].filter }}
            </el-button>
            <el-button
              type="info"
              @click="dialogFilter = true"
              class="visible-xs button-filter"
              size="mini">
              <i class="fa fa-filter"></i>
            </el-button>
            <el-button
              size= "small"
              class="date-filter-dashboard"
              @click="toggleFilter"
              style="margin-right: 7px">
              <i class="fa fa-filter" />
              <span>{{ labelDate }}</span>
            </el-button>
          </div>
          <div class="col-xs-2 col-sm-4 col-lg-4 col-md-4 text-right">
						<el-popover v-if="accountModule === 1"
							placement="left"
							width="400"
							trigger="click">
							<div>
								<div class="sub-title mb-12">
									<span class="font-16 color-primary font-bold">{{$lang[langId].customize_incoming_stock}}</span>
										<el-button type="primary" size="mini" class="fl-right" :loading="loadingCustom" :disabled="loadingCustom" @click="saveModule">
										{{ lang.save }}
									</el-button>
								</div>
								<el-row :gutter="20" style="line-height: 2;">
									<el-col :span="24">
										<div class="biodata mb-8">
											<div>
												<label style="font-size: 12px">{{$lang[langId].incoming_stock_as}}</label>
											</div>
											<el-radio-group v-model="customIncoming.purchase_or_capital">
												<el-radio :label="1" border>{{lang.purchase}}</el-radio>
												<el-radio :label="2" border>{{$lang[langId].capital_increase}}</el-radio>
											</el-radio-group>
										</div>
										<el-divider v-if="customIncoming.purchase_or_capital === 1"></el-divider>
										<div class="biodata mb-8" v-if="customIncoming.purchase_or_capital === 1">
											<div>
												<label style="font-size: 12px">{{$lang[langId].payment_account_default}}</label>
											</div>
											<el-select 
												:placeholder="$lang[langId].select" 
												filterable
												v-model="customIncoming.account_id"
												class="pb-10"
												style="width: 100%">
												<el-option
													v-for="(item, key) in dataCashBank"
													:key="key"
													:label="item.account_no+' '+item.account_name"
													:value="item.id">
												</el-option>
											</el-select>
										</div>
									</el-col>
								</el-row>
							</div>
							<el-button slot="reference"
								icon="el-icon-setting" circle type="info"
								@click="setModule">
							</el-button>
						</el-popover>
						<el-button size="small" type="danger" :disabled="chosenUnpost.length === 0" @click="showValidate('unpost')">
							{{ $lang[langId].unpost }}
						</el-button>
            <el-button type="primary" size="small" :disabled="chosenStockIn.length === 0" @click="showValidate('post')">
              Post
            </el-button>
          </div>
        </div>

        <div style="margin-top: 24px">
          <div v-if="isLoading === false">
            <el-table
              ref="multipleTable"
              v-loading="isLoading"
              class="product-table-max-height mobile-fix-height-unset"
              @selection-change="handleSelectPost"
              :data="dataStockIn"
              @filter-change="filterPost"
              @sort-change="changeSortTable"
              stripe>
              <el-table-column type="selection" width="30" :selectable="checkList" class-name="text-center"></el-table-column>
              <el-table-column
                width="120"
                prop="date"
                :label="lang.date">
                <template slot-scope="scope">
                  <span v-if="scope.row.date !== null">{{ scope.row.fdate }}</span>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="order_no" width="160"
                :label="lang.transactions">
                <template slot-scope="scope">
									{{ scope.row.trans_no }}
                </template>
              </el-table-column>
              <el-table-column
                prop="note"
                :label="lang.notes">
                <template slot-scope="scope">
                  <div v-if="scope.row.note">{{ capitalize(scope.row.note) }}</div>
                  <div v-else>-</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="posted"
                :label="$lang[langId].status"
                width="130"
                :filters="[{ text: $lang[langId].posted, value: '1' }, { text: $lang[langId].unposted, value: '0' }]"
                :filter-multiple="false"
                >
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.posted === 1"
                    type="success"
                    size="mini"
                    disable-transitions>{{$lang[langId].posted}}
                  </el-tag>
                  <el-tag v-else type="danger" disable-transitions size="mini">
                    {{$lang[langId].unposted}}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-else  style="margin-top: 60px;">
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
            <el-select v-model="params.per_page"  @change="handleSizeChange" placeholder="Select" class="perpage" style="width: 120px">
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
      :visible.sync="dialogFilter"
      class="text-left"
      width="40%"
      custom-class="dialog-card">
      <el-form>
        <el-form-item :label="lang.search" :label-width="formLabelWidth">
          <el-input
            v-model="params.search"
            :placeholder="lang.transaction_no"
            clearable
            prefix-icon="el-icon-search"
            size="small"
            style="width: 93%;">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleFilter">{{ $lang[langId].filter }}</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="dialogValidatePost" :show-close="false"
      custom-class="dialog-no-header" width="30%"
      :close-on-click-modal="false">
			<div class="row" style="background-color: #FAFAFA; word-break: break-word; line-height: inherit;">
        <div v-if="!loadingPost" class="font-24 semi-bold text-center">
            <span>Post {{ this.chosenStockIn.length +' '+ $lang[langId].stock_incoming }} ?</span>
          <div style="margin-top: 20px; display: flex;">
            <el-button type="text" @click="postStockIn" class="color-success font-24" style="width: 50%;">
              {{ lang.yes }}
            </el-button>
            <el-button type="text" @click="closeValidate" class="color-black font-24" style="width: 50%;">{{lang.no}}</el-button>
          </div>
        </div>
        <div v-else class="font-24 semi-bold text-center">
          <span>{{$lang[langId].finish +' '+ multipleError.total_data + ' '+$lang[langId].of+' '+ this.chosenStockIn.length +' '+ $lang[langId].stock_incoming}}</span>
          <div style="margin-top: 20px">
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

    <el-dialog :visible.sync="dialogValidateUnpost" :show-close="false"
      custom-class="dialog-no-header" width="30%"
      :close-on-click-modal="false">
			<div class="row" style="background-color: #FAFAFA; word-break: break-word; line-height: inherit;">
        <div v-if="!loadingUnpost" class="font-24 semi-bold text-center">
            <span>Unpost {{ this.chosenUnpost.length +' '+ $lang[langId].stock_incoming }} ?</span>
          <div style="margin-top: 20px; display: flex;">
            <el-button type="text" @click="unpostHandle" class="color-success font-24" style="width: 50%;">
              {{ lang.yes }}
            </el-button>
            <el-button type="text" @click="closeValidate" class="color-black font-24" style="width: 50%;">{{lang.no}}</el-button>
          </div>
        </div>
        <div v-else class="font-24 semi-bold text-center">
          <span>{{$lang[langId].finish +' '+ multipleError.total_data + ' '+$lang[langId].of+' '+ this.chosenUnpost.length +' '+ $lang[langId].stock_incoming}}</span>
          <div style="margin-top: 20px">
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
    
    <dialog-trow-multiple-error
      :show="multipleErrorShow"
      :error-list="multipleError"
      @close="closeErrorReport"
    />

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
import mixinAccounting from '@/mixins/mixinAccounting';
import { stockInList, stockInPost, stockInUnpost, cashBankOnly } from '@/api/accounting/pos-transaction';
import Loading from 'vue-loading-overlay';
import CustomDateFilter from 'modules/CustomDateFilter';
import dialogSetup from 'components/modules/_views/accounting/dialogSetup';
import DialogTrowMultipleError from "@/components/DialogTrowMultipleError";
var moment = require('moment');

export default {
  name: 'SalesPOSTransaction',
  mixins: [mixinAccounting],
  components: {
    Loading,
    CustomDateFilter,
		dialogSetup,
    DialogTrowMultipleError
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
    }
  },

  mounted(){
    this.accountSetup()
    this.getLastParams()
  },

  data() {
    return {
      formLabelWidth: '115px',
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
      loadingPost: false,
			loadingUnpost: false,
			loadingCustom: false,
      dialogFilter: false,
      dialogValidatePost: false,
      dialogValidateUnpost: false,
      chosenStockIn: [],
			chosenUnpost: [],
      dataStockIn: [],
      labelDate: '',
      showFilter: false,
      filter:{
        amount: 0
      },
      multipleErrorShow: false,
      multipleError: { title: '', total_data: 0, total_succed: 0, total_failed: 0, errorList: [] },
      params: {
        start_date: moment().format('yyyy-MM-DD'),
        end_date: moment().format('yyyy-MM-DD'),
        search: '',
        search_column: [],
        search_text: [],
        currentPage: 1,
        per_page: 15,
        sort_column: 'id',
        sort_type: 'desc',
        page: 1,
        total: null
      },
			accountModule: 0,
			customIncoming: {purchase_or_capital: 2, account_id: 0},
			dataCashBank: []
    }
  },

  methods: {
    getLastParams() {
      if(Object.keys(this.$route.query).includes('lastParams') ===true){
        this.params = "start_date" in this.$route.query.lastParams ? this.$route.query.lastParams : this.params
        this.labelDate = this.$route.query.selectedMonth
      }else{
        this.params.account_no = null
        this.params.start_date = moment().format('YYYY-MM-DD')
        this.params.end_date = moment().format('YYYY-MM-DD')
        this.labelDate = this.$lang[this.langId].today + '\n' +
                          moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                          moment(this.params.end_date).format('DD MMM YYYY')
      }

      this.getStockIn()
    },

    filterPost(value){
      let keyTable = Object.keys(value)[0];
        if(value[keyTable][0]){
          if(this.params.search_column.includes('posted') === true){
            this.params.search_column.map((i, idx) => {
              if (i === 'posted') {
                this.params.search_text[idx] = value[keyTable][0]
              }
            })
          }else{
            this.params.search_column.push('posted')
            this.params.search_text.push(value[keyTable][0])
          }
        }else{
          this.params.search_column.map((i, idx) => {
            if (i === 'posted') {
              this.params.search_column.splice(idx, 1)
              this.params.search_text.splice(idx, 1)
            }
          })
        }
        this.params.page = 1
        this.getStockIn()
    },

    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      if (val.order === null) val.order = this.params.sort_type

      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.getStockIn()
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
      this.getStockIn()
    },

    dateFilterSave(filter) {
      this.params.start_date = filter.startDate
      this.params.end_date = filter.endDate
      this.dateFilterClose()
      this.setLabelFilter(filter)
      this.getStockIn()
    },

    handleFilter(label) {
      this.dialogFilter = false
      this.params.page = 1
      if(this.filter.amount !== 0){
        if(this.params.search_column.includes('int_total_amount') === false){
          this.params.search_column.push('int_total_amount')
          this.params.search_text.push(this.filter.amount)
        }else{
          this.params.search_column.map((i, idx) => {
            if (i === 'int_total_amount') {
              this.params.search_column.splice(idx, 1)
              this.params.search_text.splice(idx, 1)
            }
          })
        }
      } else {
        this.params.search_column.map((i, idx) => {
          if (i === 'int_total_amount') {
            this.params.search_column.splice(idx, 1)
            this.params.search_text.splice(idx, 1)
          }
        })
      }
      this.getStockIn()
    },

    getStockIn(){
      this.isLoading = true

      stockInList(this.params).then(response => {
        this.dataStockIn = response.data.data
        this.params.per_page = response.data.meta.per_page
        this.params.currentPage = response.data.meta.current_page
        this.params.total = response.data.meta.total
				this.accountModule = response.data.account_module
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

    handleSelectPost(val) {
      if (val.length > 0) {
        this.chosenStockIn = val
        val.forEach((valSelect, no) => {
          if(valSelect.posted === 1){
            this.chosenUnpost.push(valSelect)
          }
        })
      }else{
        this.chosenStockIn = []
        this.chosenUnpost = []
      }
    },

    showValidate(type){
      if(type === 'post'){
        this.dialogValidatePost = true
      } else if (type === 'unpost'){
        this.dialogValidateUnpost = true
      } 
    },

    closeValidate(){
      this.dialogValidatePost = false
      this.dialogValidateUnpost = false
    },

    async postStockIn(){
      this.loadingPost = true
      let sorted = this.chosenStockIn.sort(function(a, b) { 
        return a.id - b.id;
      });
      const clearSelections = () => {
        this.$refs.multipleTable.clearSelection();
        this.loadingPost = false
        this.chosenUnpost = []
        this.chosenStockIn = []
        this.dialogValidatePost = false
      }
      this.multipleError.title= 'Post ' + this.lang.purchase

      for (const chosen of sorted) {
        this.multipleError.total_data++;
        let data = {
          id: chosen.id
        }

        await stockInPost(data).then(response => {
          this.dataStockIn.forEach(item => {
            if(item.id === chosen.id){
              item.posted = response.data.data.posted
            }
          });
          this.multipleError.total_succed++
          if(this.multipleError.total_data === this.chosenStockIn.length) {
            clearSelections()
            if (this.multipleError.total_failed !== 0) {
              this.multipleErrorShow = true
            } else {
              this.closeErrorReport()
              this.$message({
                message: this.$lang[this.langId].success_posting,
                type: 'success'
              })
            }
          }
        }).catch(error => {
          this.multipleError.total_failed++
          this.multipleError.errorList.push({ name: chosen.trans_no, desc: error.string })
          if(this.multipleError.total_data === this.chosenStockIn.length) {
            clearSelections()
            this.multipleErrorShow = true
          }
        })
      }
    },

		async unpostHandle(){
			this.loadingUnpost = true
      let sorted = this.chosenUnpost.sort(function(a, b) { 
        return a.id - b.id;
      });
      const clearSelections = () => {
        this.$refs.multipleTable.clearSelection();
        this.loadingUnpost = false
        this.chosenUnpost = []
        this.chosenStockIn = []
        this.dialogValidateUnpost = false
      }
      this.multipleError.title= 'Unpost ' + this.lang.purchase

      for (const chosen of sorted) {
        this.multipleError.total_data++;
        let deleteId = chosen.id
        await stockInUnpost(deleteId).then(response => {
          this.dataStockIn.forEach(item => {
            if(item.id === chosen.id){
              item.posted = 0
            }
          });
          this.multipleError.total_succed++
          if(this.multipleError.total_data === this.chosenUnpost.length) {
            clearSelections()
            if (this.multipleError.total_failed !== 0) {
              this.multipleErrorShow = true
            } else {
              this.closeErrorReport()
              this.$message({
                message: this.$lang[this.langId].success_unposting,
                type: 'success'
              })
            }
          }
        }).catch(error => {
          this.multipleError.total_failed++
          this.multipleError.errorList.push({ name: chosen.trans_no, desc: error.string })
          if(this.multipleError.total_data === this.chosenUnpost.length) {
            clearSelections()
            this.multipleErrorShow = true
          }
        })
      }
		},

    closeErrorReport() {
      this.multipleErrorShow = false
      this.multipleError = { title: '', total_data: 0, total_succed: 0, total_failed: 0, errorList: [] }
    },

    handleSizeChange(val) {
      this.params.page = 1
      this.params.per_page = val
      this.getStockIn()
    },
    
    handleCurrentChange(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getStockIn()
    },

    toggleFilter() {
      if (this.showFilter) {
        this.showFilter = false
      } else {
        this.showFilter = true
      }
    },

		setModule(){
			this.loadingCustom = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/stockmaping'),
        headers: headers
      })
        .then(response => {
					let resp = response.data.data
					if(resp !== null){
						this.customIncoming = {purchase_or_capital: resp.purchase_or_capital, account_id: resp.account_id}
					}
					this.getCashBank()
          this.loadingCustom = false
        })
        .catch(error => {
          this.loadingCustom = false
          if (error.response.data.error.status_code !== 404) {
            this.$notify({
              type: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error
            })
          }
        })
		},

		saveModule(){
			this.loadingCustom = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

			let paramData = {purchase_or_capital: this.customIncoming.purchase_or_capital, account_id: 0}
			if(parseInt(this.customIncoming.purchase_or_capital) === 1){
				paramData = this.customIncoming
			}

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/stockmaping'),
        headers: headers,
				data: paramData
      })
        .then(response => {
					let resp = response.data.data
					if(resp !== null){
						this.customIncoming = {purchase_or_capital: resp.purchase_or_capital, account_id: resp.account_id}
					}
					this.$message({
						type: 'success',
						message: this.$lang[this.langId].success_apply
					})
          this.loadingCustom = false
        })
        .catch(error => {
          this.loadingCustom = false
          if (error.response.data.error.status_code !== 404) {
            this.$notify({
              type: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error
            })
          }
        })
		},

    getCashBank() {
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

    checkList(row, index){
      let selectable = true;
      // if(row.posted === 1){
      //   selectable = false;
      // }
      return selectable;
    },
  }
}
</script>
