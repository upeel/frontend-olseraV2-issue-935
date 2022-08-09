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
          <h4 style="flex-grow: 1;">{{ $lang[langId].confirm_settlement }}</h4>
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
							:data="dataSettlement"
							ref="multipleTable"
							class="accounting-table"
							@selection-change="handleSelectConfirm"
							v-loading="isLoading"
							v-element-table-header
							:highlight-current-row="false">
								<el-table-column type="selection" width="30" class-name="text-center">
								</el-table-column>
								<el-table-column
									prop="start_date"
									:label="lang.start_date">
									<template slot-scope="scope">
										<span>{{scope.row.fstart_date}}</span>
									</template>
								</el-table-column>
								<!-- <el-table-column
									prop="id"
									width="230"
									:label="lang.orders">
									<template slot-scope="scope">
										<div v-if="scope.row.log">
											<div v-for="(order, idxLog) in scope.row.log" :key="scope.$index+''+idxLog">
												<span v-if="idxLog+1 !== scope.row.log.length">{{order.order_no}}, </span>
												<span v-else>{{order.order_no}}</span>
											</div>
										</div>
									</template>
								</el-table-column> -->
								<el-table-column
									prop="period_statement"
									width="230"
									:label="lang.period">
									<template slot-scope="scope">
										<span>{{scope.row.period_statement}}</span>
									</template>
								</el-table-column>
								<el-table-column
									prop="settlement_amount"
									:label="lang.amount">
									<template slot-scope="scope">
										<span>{{scope.row.fsettlement_amount}}</span>
									</template>
								</el-table-column>
								<el-table-column
									prop="confirm"
									:label="lang.status" 
									align="center">
									<template slot-scope="scope">
										<el-tag size="mini"
											:type="classTag1(scope.row.is_paid)" align="center">
											{{scope.row.is_paid == 1 ? $lang[langId].paid : $lang[langId].unpaid}}
										</el-tag>
										<el-tag size="mini"
											:type="classTag1(scope.row.confirm)" align="center">
											{{scope.row.confirm == 1 ? $lang[langId].has_confirm : $lang[langId].unconfirm}}
										</el-tag>
									</template>
								</el-table-column>
								<el-table-column
									label=""
									align="right"
									width="60">
									<template slot-scope="scope">
										<el-button v-if="scope.row.log !== null" class="accounting-dropBtn" type="text" @click="showOrders(scope.row, scope.$index)">
											<svg-icon icon-class="order_ico"></svg-icon>
										</el-button>
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
      width="40%" center
      :close-on-click-modal="false" 
      :show-close="false">

      <div slot="title" class="flex-container">
        <el-row :gutter="20"  style="width: 100%">
          <el-col :span="12" align="left">
            <span style="line-height: 2; font-size: 15px">{{$lang[langId].confirm_settlement}}</span>
          </el-col>
          <el-col :span="12" align="right">
            <el-button @click="cancelConfirm">{{lang.cancel}}</el-button>
            <el-button :disabled="loadingConfirm" type="primary" @click="handleConfirm">
              <loading
                v-if="loadingConfirm"
                :active="true"
                color= '#1bb4e6'
                loader="dots"
                :width="28"
                :height="10"
                backgroundColor='#ffffff'>
              </loading>
              <span v-else>
                {{ $lang[langId].confirm }}
              </span>
            </el-button>
          </el-col>
        </el-row>
      </div>

      <div align="left">
        <div style="background-image: url('/static/img/background-popup-whatsnew.png') !important;
            background-repeat: no-repeat;" align="center">
          <img src="/static/img/service-activation/form-activation.svg" style="width: 140px; margin: 20px;">
        </div>
        <div class="pt-10">
          <span v-if="!loadingConfirm">
            {{ $lang[langId].you_sure + ' ' + $lang[langId].confirm}}
            <span style="color: blue"> {{chosenConfirm.length}} </span>
            Settlement ?
          </span>
          <span v-else>{{$lang[langId].finish +' '+ multipleError.total_data + ' '+$lang[langId].of+' '+ this.chosenConfirm.length +' '+ $lang[langId].confirm_settlement}}</span>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogOrder"
      :show-close="false"
      width="40%"
      center 
      custom-class="dialog-card">
      <div slot="title" class="flex-container">
        <el-row :gutter="20"  style="width: 100%">
          <el-col :span="14">
            <h4 class="dialog-title">{{detailSettlement.period_statement}}</h4>
          </el-col>
          <el-col :span="10" align="right">
            <div class="btn_save_dialog">
              <el-button type="info" @click="closeOrderDialog">{{ lang.close }}</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-table
        :data="detailSettlement.log"
        stripe >
        <el-table-column
          prop="order_no"
          :label="lang.orders">
        </el-table-column>
      </el-table>
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
import mixinAccounting from '@/mixins/mixinAccounting';
import { baseApi } from 'src/http-common';
import axios from 'axios';
import Loading from 'vue-loading-overlay';
import CustomDateFilter from 'modules/CustomDateFilter';
import dialogSetup from 'components/modules/_views/accounting/dialogSetup';
import DialogTrowMultipleError from "@/components/DialogTrowMultipleError";
import { getSettlement, confirmSettlement } from '@/api/accounting/cash-bank';
var moment = require('moment');

export default {
  name: 'BankSettlement',
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
      dialogConfirm: false,
			dialogOrder: false,
			detailSettlement: {},
      labelDate: '',
      showFilter: false,
      dataSettlement:[],
      buttonStatus: false,
      chosenConfirm: [],
      multipleErrorShow: false,
      multipleError: { title: '', total_data: 0, total_succed: 0, total_failed: 0, errorList: [] },
      params: {
        start_date: moment().format('yyyy-MM-DD'),
        end_date: moment().format('yyyy-MM-DD'),
        currentPage: 1,
        per_page: 15,
        due_dates_at: '',
        page: 1,
        total: null
      }
    }
  },

  methods: {
    getBankSettlement(){
      this.isLoading = true
      getSettlement(this.params).then(response => {
        this.dataSettlement = response.data.data
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

    handleChangeSize(val){
      this.params.page = 1
      this.params.per_page = val
      this.getBankSettlement()
    },

    handleCurrentChange(val){
      this.params.currentPage = val
      this.params.page = val
      this.getBankSettlement()
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

      this.getBankSettlement()
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
      this.getBankSettlement()
    },

    dateFilterSave(filter) {
      this.params.start_date = filter.startDate
      this.params.end_date = filter.endDate
      this.dateFilterClose()
      this.setLabelFilter(filter)
      this.getBankSettlement()
    },

    handleSelectConfirm(val){
      if (val.length > 0) {
        this.chosenConfirm = val
      }else{
        this.chosenConfirm = []
      }
    },

		showOrders(row, index){
			this.dialogOrder = true
			this.detailSettlement = row
		},

		closeOrderDialog(){
			this.dialogOrder = false
			this.detailSettlement = {}
		},

    showConfirm(){
      this.dialogConfirm = true
    },

    cancelConfirm(row, idx){
      this.dialogConfirm = false
    },

    async handleConfirm(){
      this.loadingConfirm = true
      const clearSelections = () => {
						this.$refs.multipleTable.clearSelection();
            this.chosenConfirm = []
            this.dialogConfirm = false
            this.loadingConfirm = false
      }
      this.multipleError.title= 'Post ' + this.$lang[this.langId].confirm_settlement

      for (const item of this.chosenConfirm) {
        this.multipleError.total_data++;
        let data = {
          id: item.id
        }

        await confirmSettlement(data).then(response => {
          this.dataSettlement.forEach((settle, idxSettle) => {
            if(settle.id === item.id){
              settle.confirm = 1
            }
          })
          
          this.multipleError.total_succed++
          if(this.multipleError.total_data === this.chosenConfirm.length) {
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
          this.multipleError.errorList.push({ name: item.period_statement, desc: error.string })
          if(this.multipleError.total_data === this.chosenConfirm.length) {
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

    checkList(row, index){
      let disable = true;
      if(row.confirm === 1){
        disable = false;
      }
      return disable;
    },


    classTag1(val){
      let typeName = 'warning'
      if(val === 1){
        typeName = 'success'
      }

      return typeName;
    }

  }
}
</script>

<style>
.el-table__header-wrapper{
	top: 100px !important;
}
</style>
