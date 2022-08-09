<template>
  <div class="px-20">
    <div v-if="isSetup === 'false'" >
      <el-card class="box-card" shadow="never">
        <div class="div-nodata-accounting">
          <img src="/static/img/no-close-date.svg" class="image" style="margin-top: 32px">
          <div class="no_close" >{{rootLang.setup_message}}</div>
          <el-button class="btn-set" @click="dialogSetup = true">{{rootLang.set_up_now}}</el-button>
        </div>
      </el-card>
    </div>

    <div v-else-if="isSetup === 'true'" >
      <el-card class="box-card" shadow="never">
        <div slot="header" class="table-handler-flex">
          <h4 style="flex-grow: 1;">{{rootLang.outlay_data}}</h4>
          <el-button size="small" type="info" @click="setTransDialog()">
            {{ $lang[langId].transaction_types }} 
          </el-button>
        </div>

        <div class="card-body">
          <div class="row">
            <div class="col-xs-12 col-lg-8 col-md-8 col-sm-8 text-left" style="display: -webkit-inline-box;">
              <el-button
                type="info"
                @click="dialogFilter = true"
                size="small"
                class="visible-lg visible-md visible-sm button-filter">
                <i class="fa fa-filter"></i>
                {{ rootLang.filter }}
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
            <div class="col-xs-12 col-sm-4 col-lg-4 col-md-4 text-right">
							<el-button size="small" type="danger" :disabled="chosenUnpost.length === 0" @click="showValidate('unpost')">
								{{ $lang[langId].unpost }}
							</el-button>
              <el-button type="primary" size="small" :disabled="chosenExpense.length === 0" @click="showValidate('post')">
                Post
              </el-button>
            </div>
          </div>
          <div v-if="isLoading === false" class="mt-4">
            <el-table
              ref="multipleTable"
              v-loading="isLoading"
              class="product-table-max-height mobile-fix-height-unset"
              @selection-change="handleSelectPost"
              :data="dataExpense"
              @sort-change="changeSortTable"
              stripe>
              <el-table-column type="selection" :selectable="checkList" width="30" class-name="text-center"></el-table-column>
              <el-table-column
                prop="trans_no"
                :label="lang.transactions">
                <template slot-scope="scope">
                  <div>{{ scope.row.trans_no }}</div>
									<span class="font-11">{{ capitalize(scope.row.trans_type_name) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="order_date"
                :label="lang.date+ ' | ' + lang.notes">
                <template slot-scope="scope">
                  <div>{{ scope.row.trans_date !== null ? scope.row.ftrans_date : '-'}}</div>
									<span class="font-11">{{ capitalize(scope.row.notes) }}</span>
                </template>
              </el-table-column>

              <el-table-column
                prop="amount"
                :label="lang.amount"
                sortable>
                <template slot-scope="scope">
                  <div>{{ scope.row.famount }}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="debit_id"
                :label="rootLang.debit_account">
                <template slot-scope="scope">
                  <el-select 
                    :placeholder="rootLang.select" 
                    filterable
                    v-model="scope.row.debit_id"
                    class="pb-10"
                    style="width: 100%">
                    <el-option
                      v-for="(item, keyDebit) in accountExpense"
                      :key="keyDebit"
                      :label="item.account_no+' '+item.account_name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <!-- <div>
                    {{scope.row.debit_id ? scope.row.debit_account +' '+ scope.row.debit_account_name: '-'}}
                  </div> -->
                </template>
              </el-table-column>
              <el-table-column
                prop="credit_id"
                :label="rootLang.credit_account">
                <template slot-scope="scope">
                  <el-select 
                    :placeholder="rootLang.select" 
                    filterable
                    v-model="scope.row.credit_id"
                    class="pb-10"
                    style="width: 100%">
                    <el-option
                      v-for="(item, keyCredit) in dataCashBank"
                      :key="keyCredit"
                      :label="item.account_no+' '+item.account_name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column :label="lang.status" align="center" :width="130">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.account_posted === 1"
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
          <div v-else style="margin-top: 60px;">
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
            :placeholder="lang.transactions"
            clearable
            prefix-icon="el-icon-search"
            size="small"
            style="width: 93%;">
          </el-input>
        </el-form-item>
        <el-form-item :label="lang.amount" :label-width="formLabelWidth">
          <money v-model="filter.amount"
            v-bind="money"
            :prefix="selectedStore.currency_id + ' '"
            class="form-input input-sm input-money"
            style="height: 32px; width: 93%;">
          </money>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleFilter">{{ $lang[langId].filter }}</el-button>
      </span>
    </el-dialog>

    <dialog-expense-trans-type
      :show="dialogTransType"
      @close="setTransDialog"
    />

    <el-dialog :visible.sync="dialogValidatePost" :show-close="false"
      custom-class="dialog-no-header" width="30%"
      :close-on-click-modal="false">
			<div class="row" style="background-color: #FAFAFA; word-break: break-word; line-height: inherit;">
        <div v-if="!loadingPost" class="font-24 semi-bold text-center">
            <span>Post {{ this.chosenExpense.length +' '+ $lang[langId].expense }} ?</span>
          <div style="margin-top: 20px; display: flex;">
            <el-button type="text" @click="saveHandle" class="color-success font-24" style="width: 50%;">
              {{ lang.yes }}
            </el-button>
            <el-button type="text" @click="closeValidate" class="color-black font-24" style="width: 50%;">{{lang.no}}</el-button>
          </div>
        </div>
        <div v-else class="font-24 semi-bold text-center">
          <span>{{$lang[langId].finish +' '+ multipleError.total_data + ' '+$lang[langId].of+' '+ this.chosenExpense.length +' '+ $lang[langId].expense}}</span>
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
            <span>Unpost {{ this.chosenUnpost.length +' '+ $lang[langId].expense }} ?</span>
          <div style="margin-top: 20px; display: flex;">
            <el-button type="text" @click="unpostHandle" class="color-success font-24" style="width: 50%;">
              {{ lang.yes }}
            </el-button>
            <el-button type="text" @click="closeValidate" class="color-black font-24" style="width: 50%;">{{lang.no}}</el-button>
          </div>
        </div>
        <div v-else class="font-24 semi-bold text-center">
          <span>{{$lang[langId].finish +' '+ multipleError.total_data + ' '+$lang[langId].of+' '+ this.chosenUnpost.length +' '+ $lang[langId].expense}}</span>
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
import mixinAccounting from '@/mixins/mixinAccounting';
import basicComputedMixin from '@/mixins/basicComputedMixin';
import { expenseList, incomePost, inexUnpost, cashBankOnly, expenseOnly} from '@/api/accounting/pos-transaction';
import DialogExpenseTransType from './transType';
import Loading from 'vue-loading-overlay';
import CustomDateFilter from 'modules/CustomDateFilter';
import dialogSetup from 'components/modules/_views/accounting/dialogSetup';
import DialogTrowMultipleError from "@/components/DialogTrowMultipleError";
var moment = require('moment');

export default {
  name: 'ExpensePOSTransaction',
  mixins: [mixinAccounting, basicComputedMixin],
  components: {
    Loading,
    CustomDateFilter,
		dialogSetup,
		DialogExpenseTransType,
    DialogTrowMultipleError
  },

  computed: {
    token() {
      return this.$store.state.user.token
    },
    selectedStore() {
      return this.$store.getters.selectedStore
    },
  },

  mounted(){
    this.accountSetup()
    this.getLastParams()
    this.getCashBank()
    this.getExpense()
  },

  data() {
    return {
      money: {
        decimal: ',',
        thousands: '.',
        prefix: '',
        precision: 0,
        masked: false
      },
      formLabelWidth: '115px',
      dialogFilter: false,
      dialogValidatePost: false,
      dialogValidateUnpost: false,
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
      dataExpense: [],
      dataCashBank: [],
			accountExpense: [],
      chosenExpense: [],
			chosenUnpost: [],
      labelDate: '',
      showFilter: false,
			dialogTransType: false,
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
      }
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

      this.getPOSExpense()
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

    getExpense() {
      expenseOnly().then(response => {
        this.accountExpense = response.data.data
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

    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      if (val.order === null) val.order = this.params.sort_type

      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.getPOSExpense()
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

    handleSelectPost(val) {
      if (val.length > 0) {
        this.chosenExpense = val
        val.forEach((valSelect, no) => {
          if(valSelect.account_posted === 1){
            this.chosenUnpost.push(valSelect)
          }
        })
      }else{
        this.chosenExpense = []
        this.chosenUnpost = []
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
        this.chosenExpense = []
        this.dialogValidateUnpost = false
      }
      this.multipleError.title= 'Unpost ' + this.$lang[this.langId].expense

      for (const chosen of sorted) {
        this.multipleError.total_data++;
        let deleteId = chosen.id

        await inexUnpost(deleteId).then(response => {

          this.dataExpense.forEach(item => {
            if(item.id === chosen.id){
              item.account_posted = 0
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
      this.getPOSExpense()
    },

    dateFilterSave(filter) {
      this.params.start_date = filter.startDate
      this.params.end_date = filter.endDate
      this.dateFilterClose()
      this.setLabelFilter(filter)
      this.getPOSExpense()
    },

    handleFilter(label) {
      this.dialogFilter = false
      this.params.page = 1
      if(this.filter.amount !== 0){
        if(this.params.search_column.includes('amount') === false){
          this.params.search_column.push('amount')
          this.params.search_text.push(this.filter.amount)
        }else{
          this.params.search_column.map((i, idx) => {
            if (i === 'amount') {
              this.params.search_column.splice(idx, 1)
              this.params.search_text.splice(idx, 1)
            }
          })
        }
      } else {
        this.params.search_column.map((i, idx) => {
          if (i === 'amount') {
            this.params.search_column.splice(idx, 1)
            this.params.search_text.splice(idx, 1)
          }
        })
      }
      this.getPOSExpense()
    },

    getPOSExpense(){
      this.isLoading = true

      expenseList(this.params).then(response => {
        this.dataExpense = response.data.data
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

    async saveHandle(index){
      this.loadingPost = true
      let sorted = this.chosenExpense.sort(function(a, b) { 
        return a.id - b.id;
      });
      const clearSelections = () => {
        this.$refs.multipleTable.clearSelection();
        this.loadingPost = false
        this.chosenUnpost = []
        this.chosenExpense = []
        this.dialogValidatePost = false
      }
      this.multipleError.title= 'Post ' + this.$lang[this.langId].expense

      for (const chosen of sorted) {
        this.multipleError.total_data++;
        let edited = {
          id: chosen.id,
          debit_id: chosen.debit_id,
          credit_id: chosen.credit_id
        }

        await incomePost(edited).then(response => {
          this.dataExpense.forEach(item => {
            if(item.id === chosen.id){
              item.account_posted = 1
            }
          });
          
          this.multipleError.total_succed++
          if(this.multipleError.total_data === this.chosenExpense.length) {
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
          if(this.multipleError.total_data === this.chosenExpense.length) {
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
      this.getPOSExpense()
    },
    
    handleCurrentChange(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getPOSExpense()
    },

    toggleFilter() {
      if (this.showFilter) {
        this.showFilter = false
      } else {
        this.showFilter = true
      }
    },

		setTransDialog(){
			let show = this.dialogTransType
			this.dialogTransType = show ? false : true
		},

    checkList(row, index){
      let selectble = false;
      if(row.debit_id && row.credit_id){
        selectble = true;
      }
      return selectble;
    },
  }
}
</script>
