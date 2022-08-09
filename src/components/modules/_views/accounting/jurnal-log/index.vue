<template>
  <div class="content-wrapper">
    <section class="content-accounting">
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
        <el-card class="box-card">
          <div class="row table-handler-flex">
            <div class="col-xs-12 col-sm-9 col-lg-9 col-md-9 text-left">
              <single-month-picker
                v-if="typePeriod === 'month'" v-model="params.period" :clearable="false" @input="handleSelectMonth"
                style="margin: 0px"
              />
              <single-year-picker
                v-if="typePeriod === 'year'" v-model="params.period" :clearable="false" @input="handleSelectYear"
                style="margin: 0px"
              />
              <el-radio-group class="custom-radio1" v-model="typePeriod" @change="handleChangePeriod" style="	border: groove; border-color: #409eff54; border-width: thin; width: 300px;">
                <el-radio-button label="month" style="width: 50%;">
                  {{ this.lang.month }}
                </el-radio-button>
                <el-radio-button label="year" style="width: 50%;">
                  {{ this.lang.year }}
                </el-radio-button>
              </el-radio-group>
            </div>
            <div class="col-xs-12 col-sm-3 col-lg-3 col-md-3 text-right">
              <el-button
                type="info"
                @click="dialogFilter = true"
                class="button-filter">
                  <i class="fa fa-filter"></i>
                  {{ $lang[langId].filter }}
              </el-button>
            </div>
          </div>

          <div class="card-body">
            <div style="margin-top: 24px">
              <div v-if="isLoading === false">
                <el-table
                  :data="dataLog"
                  v-loading="isLoading"
                  @sort-change="changeSortTable"
                  ref="multipleTable"
                  class="product-table-max-height mobile-fix-height-unset"
                  :highlight-current-row="false">
                  <el-table-column
                    prop="transaction_date"
                    :label="lang.date"
                    sortable>
                    <template slot-scope="scope">
                      <span>{{scope.row.ftransaction_date}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="transaction_no"
                    :label="lang.transaction_no"
                    sortable>
                    <template slot-scope="scope">
                      <el-button type="text" @click="detailLog(scope.row)">
                        {{ scope.row.transaction_no }}
                      </el-button>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="action"
                    :label="$lang[langId].action_log"
                    sortable>
                    <template slot-scope="scope">
                      <span>{{capitalize(scope.row.action)}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="user_name"
                    :label="lang.proceed_by">
                    <template slot-scope="scope">
                      <span style="word-break: break-word;">{{capitalize(scope.row.user_name)}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$lang[langId].action" align="center" width="70px">
                    <template slot-scope="scope">
                      <el-dropdown trigger="click">
                          <el-button type="text" icon="el-icon-more" style="color:#909399"></el-button>
                          <el-dropdown-menu slot="dropdown" style="background-color: #F2F2F2;">
                            <el-dropdown-item style="padding: 0px">
                              <el-button type="text" class="accounting-dropBtn" @click="descLog(scope.row)">
                                <svg-icon icon-class="description"></svg-icon>
                                {{ lang.description }}
                              </el-button>
                            </el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      <!-- <div id="slide" style="float: right">
                        
                      </div> -->
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
    </section>

		<dialog-setup :show="dialogSetup" @doneSetup="finishSetup"/>

    <el-dialog
      :visible.sync="dialogFilter"
      class="text-left"
      width="30%"
      custom-class="dialog-card">
      <el-form>
        <el-form-item :label="lang.search" :label-width="formLabelWidth">
          <el-input
            v-model="params.search"
            :placeholder="lang.transaction_no+'/'+lang.proceed_by"
            clearable
            prefix-icon="el-icon-search"
            size="small"
            >
          </el-input>
        </el-form-item>
        <el-form-item :label="lang.date" :label-width="formLabelWidth">
          <el-date-picker
            v-model="filter.date"
            type="date"
            format="dd MMM yyyy"
            :placeholder="$lang[langId].pick_a_day"
            style="width: 100%;">
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item :label="lang.search" :label-width="formLabelWidth">
          <el-input
            v-model="filter.deleted_by"
            :placeholder=""
            clearable
            prefix-icon="el-icon-search"
            size="small"
            >
          </el-input>
        </el-form-item> -->
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleFilter">{{ $lang[langId].filter }}</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogSingleLog"
      :show-close="false"
      width="90%"
      center 
      custom-class="dialog-card">
      <div slot="title" class="flex-container" style="text-align: center">
        <el-row :gutter="20"  style="width: 100%">
          <el-col :span="14">
            <h4 class="dialog-title">{{selectedLog.action}} - {{capitalize(selectedLog.transaction_no)}}</h4>
          </el-col>
          <el-col :span="10" align="right">
            <div class="btn_accounting_dialog">
              <el-button v-if="selectedLog.action_type_id === 2" :disabled="loadingRestore" type="success" @click="handleRestore">{{ $lang[langId].restore }}</el-button>
              <el-button type="info" @click="closeSingleLogDetail">{{ lang.close }}</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-table
        :data="logDetail"
        stripe>
        <el-table-column
          prop="transaction_date"
          :label="lang.date"
          width="120">
          <template slot-scope="scope">
            {{ dateFormat(scope.row.transaction_date.substr(0, 10)) }}
          </template> 
        </el-table-column>
        <el-table-column
          prop="account_name"
          :label="lang.account">
          <template slot-scope="scope">
            <span>{{scope.row.account_no}} {{capitalize(scope.row.account_name)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="transaction_no"
          :label="lang.transaction_no"
          width="170">
        </el-table-column>
        <el-table-column
          prop="transaction_description"
          :label="lang.description">
          <template slot-scope="scope">
            <span>{{capitalize(scope.row.transaction_description)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="external_no"
          :label="$lang[langId].document_number"
          width="120">
          <template slot-scope="scope">
            <span>{{scope.row.external_no}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="famount"
          :label="$lang[langId].amount_debit"
          sortable
          align="right">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 'db'">{{scope.row.famount}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="famount"
          :label="$lang[langId].amount_credit"
          sortable
          align="right">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 'cr'">{{scope.row.famount}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogMultiLog"
      :show-close="false"
      width="90%"
      center 
      custom-class="dialog-card">
      <div slot="title" class="flex-container" style="text-align: center">
        <el-row :gutter="20"  style="width: 100%">
          <el-col :span="14">
            <h4 class="dialog-title">{{selectedLog.action}} - {{capitalize(selectedLog.transaction_no)}}</h4>
          </el-col>
          <el-col :span="10" align="right">
            <div class="btn_accounting_dialog">
              <el-button type="info" @click="closeMultiLogDetail">{{ lang.close }}</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-table
        :data="logDetail"
        stripe>
        <el-table-column
          prop="ftransaction_date"
          :label="lang.date"
          width="120">
        </el-table-column>
        <el-table-column
          prop="account_name"
          :label="lang.account"
          width="180">
          <template slot-scope="scope">
            <span>{{scope.row.account_no}} {{capitalize(scope.row.account_name)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="transaction_no"
          :label="lang.transaction_no"
          width="170">
        </el-table-column>
        <el-table-column
          prop="transaction_name"
          :label="$lang[langId].transaction_name">
          <template slot-scope="scope">
            <span>{{capitalize(scope.row.transaction_name)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="transaction_description"
          :label="lang.description"
          width="200">
          <template slot-scope="scope">
            <span>{{capitalize(scope.row.transaction_description)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="external_no"
          :label="$lang[langId].document_number"
          width="120">
          <template slot-scope="scope">
            <span>{{scope.row.external_no}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="int_debit"
          :label="$lang[langId].amount_debit"
          sortable
          align="right">
          <template slot-scope="scope">
            <span>{{scope.row.fdebit}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="int_credit"
          :label="$lang[langId].amount_credit"
          sortable
          align="right">
          <template slot-scope="scope">
            <span>{{scope.row.fcredit}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px; margin-bottom: -55px">
        <el-select v-model="paramsDetail.per_page"  @change="handleDetailSizeChange" placeholder="Select" class="perpage" style="width: 120px">
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
          @size-change="handleDetailSizeChange"
          @current-change="handleDetailCurrentChange"
          :current-page.sync="paramsDetail.currentPage"
          :page-size="parseInt(paramsDetail.per_page)"
          layout="total, prev, pager, next, jumper"
          :total="paramsDetail.total"
          class="paginate">
        </el-pagination>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogDescription"
      :show-close="false"
      width="60%"
      center 
      custom-class="dialog-card">
      <div slot="title" class="flex-container" style="text-align: center">
        <el-row :gutter="20"  style="width: 100%">
          <el-col :span="14">
            <h4 class="dialog-title">{{selectedLog.action}} - {{capitalize(selectedLog.transaction_no)}}</h4>
          </el-col>
          <el-col :span="10" align="right">
            <div class="btn_accounting_dialog">
              <el-button type="info" @click="closeDescriptionLog">{{ lang.close }}</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <div style="margin-top: 24px">
        <p>{{selectedLog.description}}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common';
import axios from 'axios';
import Loading from 'vue-loading-overlay';
import moment from 'moment';
import SingleMonthPicker from 'components/modules/SingleMonthPicker';
import SingleYearPicker from 'components/modules/SingleYearPicker';
import mixinAccounting from '@/mixins/mixinAccounting';
import dialogSetup from 'components/modules/_views/accounting/dialogSetup';

export default {
  components:{
    SingleMonthPicker,
    SingleYearPicker,
    Loading,
		dialogSetup
  },
  mixins: [mixinAccounting],
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
      formLabelWidth: '60px',
      filter: {
        date: '',
      },
      isLoading: false,
      loadingRestore: false,
      labelMonth: '',
      dataLog: [],
      selectedLog: {},
      logDetail: [],
      dialogFilter: false,
      dialogSingleLog: false,
      dialogMultiLog: false,
      dialogDescription: false,
      typePeriod: 'month',
      params: {
        search: '',
        period:moment().format('yyyy-MM'),
        currentPage: 1,
        search_column: [],
        search_text: [],
        per_page: 15,
        sort_column: '',
        sort_type: '',
        page: 1,
        total: null
      },
      paramsDetail: {
        currentPage: 1,
        per_page: 15,
        page: 1,
        total: null
      },
      dialogValidateReset: false
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
    }
  },

  methods: {
    handleChangePeriod (value){
      if(value === 'month'){
        this.params.period = moment().format('yyyy-MM')
      }else{
        this.params.period = moment().format('YYYY')
      }
      this.params.sort_column = ''
      this.params.sort_type = ''
      this.typePeriod = value
      this.getLogJurnal()
    },

    handleSelectMonth (value) {
      this.params.period = moment(value).format('yyyy-MM')
      this.params.sort_column = ''
      this.params.sort_type = ''
      this.getLogJurnal()
    },

    handleSelectYear (value) {
      this.params.period = moment(value).format('YYYY')
      this.params.sort_column = ''
      this.params.sort_type = ''
      this.getLogJurnal()
    },

    handleSizeChange(val) {
      this.params.page = 1
      this.params.per_page = val
      this.getLogJurnal()
    },
    
    handleCurrentChange(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getLogJurnal()
    },

    handleFilter(label) {
      this.dialogFilter = false
      if(this.filter.date !== '' && this.params.search_column.includes('transaction_date') === false){
          this.params.search_column.push('transaction_date')
          this.params.search_text.push(moment(this.filter.date).format('YYYY-MM-DD'))
        } else {
          this.params.search_column.map((i, idx) => {
            if (i === 'transaction_date') {
              this.params.search_column.splice(idx, 1)
              this.params.search_text.splice(idx, 1)
            }
          })
        }
      this.getLogJurnal()
    },

    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      if (val.order === null) val.order = this.params.sort_type

      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.getLogJurnal()
    },

    getLogJurnal() {
      this.isLoading = true

      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/log'),
        headers: headers,
        params: this.params
      }).then(response => {
        this.isLoading = false
        this.dataLog = response.data.data
        this.params.per_page = response.data.meta.per_page
        this.params.currentPage = response.data.meta.current_page
        this.params.total = response.data.meta.total
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

    descLog(row){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let id = row.id

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/log/' + id),
        headers: headers
      }).then(response => {
        this.selectedLog = row
        this.selectedLog.description = response.data.data
        this.dialogDescription = true
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

    closeDescriptionLog(){
      this.dialogDescription = false
      this.selectedLog = {}
    },

    detailLog(row) {
      this.selectedLog = row
      // let type = row.action_type_id
      this.getDetailLog(row.id)
      // if(type === 1 || type === 4){
      //   this.getDetailLog(type, 'updated/', row.account_pair_id);
      // }else if(type === 2 || type === 5){
      //   this.getDetailLog(type, 'deleted/', row.account_pair_id);
      // }else if(type === 3){
      //   this.getDetailLog(type, 'updated/multi/', row.account_pair_id);
      // }else{
      //   this.$notify({
      //     tipe: 'warning',
      //     message: 'Undefined Jurnal'
      //   })
      // }
    },

    getDetailLog(id){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      // let params = type === 3 ? this.paramsDetail : {};

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/log/detail/' + id),
        headers: headers
      }).then(response => {
        this.logDetail = response.data.data
        this.dialogSingleLog = true
        // if(type === 3){
        //   this.paramsDetail.per_page = response.data.meta.per_page
        //   this.paramsDetail.currentPage = response.data.meta.current_page
        //   this.paramsDetail.total = response.data.meta.total
        // }
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

    handleDetailSizeChange(val) {
      this.paramsDetail.page = 1
      this.paramsDetail.per_page = val
      this.getDetailLog(3, 'updated/multi/', this.selectedLog.account_pair_id)
    },
    
    handleDetailCurrentChange(val) {
      this.paramsDetail.currentPage = val
      this.paramsDetail.page = val
      this.getDetailLog(3, 'updated/multi/', this.selectedLog.account_pair_id)
    },

    handleRestore(){
      this.loadingRestore = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let pairId = this.selectedLog.account_pair_id

      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/history/' + pairId),
        headers: headers
      }).then(response => {
        this.loadingRestore = false
        this.$message({
          type: 'success',
          message: this.$lang[this.langId].success_restore
        })
        
        let removeIndex = []
        this.dataLog.map((i, idx) => {
          if (i.account_pair_id === pairId) {
            removeIndex.push(idx)
          }
        })
        for (var i = removeIndex.length -1; i >= 0; i--) 
          this.dataLog.splice(removeIndex[i], 1);

        this.selectedLog = {}
        this.dialogSingleLog = false
      }).catch(error => {
        this.loadingRestore = false
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

    closeSingleLogDetail(){
      this.dialogSingleLog = false
      this.selectedLog = {}
      this.logDetail = []
    },

    closeMultiLogDetail(){
      this.dialogMultiLog = false
      this.selectedLog = {}
      this.logDetail = []
      this.paramsDetail = {
        currentPage: 1,
        per_page: 15,
        page: 1,
        total: null
      }
    },

    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {

        if (index === 1) {
          sums[index] = 'Total';
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

  },

  mounted() {
    this.accountSetup()
    this.getLogJurnal()
  }
}
</script>
