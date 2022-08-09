<template>
    <div class="px-20">
      
    <div class="box sticky-top-has-submenu">
      <div class="box-header with-border">
        <h4 v-if="!data.account_name && !data.account_no">-</h4>
        <h4 v-else>{{data.account_no}} - {{ capitalize(data.account_name) }}</h4>
        <el-button class="visible-lg visible-md visible-sm" style="position: absolute; right: 55px" icon="el-icon-back" size="small" type="success" plain @click="backHandle">{{ lang.back }}</el-button>
        <el-button class="visible-xs" style="position: absolute; right: 33px" icon="el-icon-back" size="small" type="success" plain @click="backHandle">{{ lang.back }}</el-button>
      </div>
      <div class="box-body">
        <div class="row">
          <div class="visible-lg visible-md visible-sm col-xs-12 col-sm-9 col-md-9 col-lg-9 text-left text-left inline">
            <div class="table-handler-flex my-null">
              <div v-if="pageType">
                <el-button type="text" @click="changePageType">
                  <svg-icon type="x" class="font-24" color="#F44336"></svg-icon>
                </el-button>
                <el-input class="inline-form input-search"
                  v-model="params.page" @change="changePage"
                  @keyup.enter.native="changePage"
                  onkeydown="return ( event.ctrlKey || event.altKey 
                    || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                    || (95<event.keyCode && event.keyCode<106)
                    || (event.keyCode==8) || (event.keyCode==9) 
                    || (event.keyCode>34 && event.keyCode<40) 
                    || (event.keyCode==46) )"
                  :placeholder="$lang[langId].page_number">
                </el-input>
              </div>
              <div v-else>
                <el-button type="text" v-show="!disablePrev" @click="previousLoad">
                  <svg-icon type="arrow-previous" class="font-24"></svg-icon>
                </el-button>
                <el-button type="text" @click="changePageType" class="color-black font-20" :loading="isLoading">{{$lang[langId].page + ' ' + params.page}}</el-button>
                <el-button type="text" v-show="!disableNext" @click="nextLoad">
                  <svg-icon type="arrow-next" class="font-24"></svg-icon>
                </el-button>
              </div>
              <div style="margin: 0px 18px; height: 3rem; border-right: solid #e3e2e2 thin;"></div>
              <div class="flex-grow-1">
                <el-select :placeholder="$lang[langId].select" v-model="params.search_column" @change="selectFilter">
                  <el-option
                    v-for="item in filter"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-date-picker
                  v-if="params.search_column === 'transaction_date'"
                  v-model="params.search_text"
                  type="date"
                  format="dd MMM yyyy"
                  @change="handleSearch"
                  :placeholder="$lang[langId].pick_a_day">
                </el-date-picker>
                <el-input
                  v-if="params.search_column === 'transaction_no' || params.search_column === 'transaction_name' || params.search_column === 'transaction_description' || params.search_column === 'external_no'"
                  class="inline-form"
                  clearable
                  :placeholder="lang.search"
                  prefix-icon="el-icon-search"
                  v-model="params.search_text"
                  @change="handleSearch">
                </el-input>
              </div>
            </div>

          </div>

          <div class="col-xs-12 visible-xs text-center" style="margin-top: 10px">
            <el-select :placeholder="$lang[langId].select" v-model="params.search_column" @change="selectFilter" style="width: 100%;">
              <el-option
                v-for="item in filter"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-date-picker
              v-if="params.search_column === 'transaction_date'"
              v-model="params.search_text"
              type="date"
              format="dd MMM yyyy"
              @change="handleSearch"
              :placeholder="$lang[langId].pick_a_day"
              style="width: 100%;">
            </el-date-picker>
            <el-input
              v-if="params.search_column === 'transaction_no' || params.search_column === 'transaction_name' || params.search_column === 'transaction_description' || params.search_column === 'external_no'"
              style="width: 100%;"
              clearable
              :placeholder="lang.search"
              prefix-icon="el-icon-search"
              v-model="params.search_text"
              @change="handleSearch" size="small">
            </el-input>
          </div>

          <div class="visible-lg visible-sm visible-md col-sm-3 col-md-3 col-lg-3 text-right">
            <el-button :disabled="loadingPDF" class="button-filter"  @click="getPDF">
              <span v-if="loadingPDF">
                <loading :active="true" color= '#1bb4e6' loader="dots" :width="32" :height="10" backgroundColor='#ffffff' style="text-align: center"></loading>
              </span>
              <span v-else><svg-icon type="pdf-file"></svg-icon> PDF</span>
            </el-button>
            <el-button :disabled="loadingExcel" class="button-filter" @click="getExcel">
              <span v-if="loadingExcel">
                <loading :active="true" color= '#1bb4e6' loader="dots" :width="32" :height="10" backgroundColor='#ffffff' style="text-align: center"></loading>
              </span>
              <span v-else><svg-icon type="excel"></svg-icon> Excel</span>
            </el-button>
          </div>

          <div class="visible-xs col-xs-12" style=" margin-top: 10px;">
            <el-button :disabled="loadingPDF" class="button-filter" style="width: 49%" @click="getPDF">
              <span v-if="loadingPDF">
                <loading :active="true" color= '#1bb4e6' loader="dots" :width="32" :height="10" backgroundColor='#ffffff' style="text-align: center"></loading>
              </span>
              <span v-else><svg-icon type="pdf-file"></svg-icon> PDF</span>
            </el-button>
            <el-button :disabled="loadingExcel" class="button-filter" style="width: 49%" @click="getExcel">
              <span v-if="loadingExcel">
                <loading :active="true" color= '#1bb4e6' loader="dots" :width="32" :height="10" backgroundColor='#ffffff' style="text-align: center"></loading>
              </span>
              <span v-else><svg-icon type="excel"></svg-icon> Excel</span>
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <el-card class="box-card">
      <el-table
        ref="multipleTable"
        :data="dataDetail"
        v-loading="isLoading"
        class="product-table-max-height mobile-fix-height-unset"
        @sort-change="changeSortTable"
        stripe>
        <el-table-column
          prop="transaction_date"
          :label="lang.date"
          sortable
          width="120">
          <template slot-scope="scope">
            <span>{{scope.row.ftransaction_date}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="transaction_no"
          :label="lang.transaction_no"
          width="180"
          sortable>
          <template slot-scope="scope">
            <span v-if="scope.row.id === ''">{{capitalize(scope.row.transaction_name)}}</span>
            <span v-else>{{scope.row.transaction_no}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="transaction_description"
          :label="lang.description"
          sortable
          width="400">
          <template slot-scope="scope">
              <div>{{capitalize(scope.row.transaction_description)}}</div>
              <span v-show="scope.row.external_no" class="font-11">
                {{$lang[langId].document_number + ' : ' + scope.row.external_no}}
              </span>   
          </template>
        </el-table-column>
        <el-table-column
          prop="int_debit"
          :label="$lang[langId].debit"
          align="right"
          sortable>
          <template slot-scope="scope">
            <div v-if="scope.row.fdebit !== null">{{ scope.row.fdebit }}</div>
            <div v-else>0</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="int_credit"
          :label="$lang[langId].credit"
          align="right" 
          sortable>
          <template slot-scope="scope">
            <div v-if="scope.row.fcredit !== null">{{ scope.row.fcredit }}</div>
            <div v-else>0</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="amount"
          :label="lang.amount"
          align="right">
          <template slot-scope="scope">
            <div v-if="scope.row.famount_akumulatif !== null">{{ scope.row.famount_akumulatif }}</div>
            <div v-else>0</div>
          </template>
        </el-table-column>
        <el-table-column :label="$lang[langId].action" align="center" width="70">
          <template slot-scope="scope">
            <el-dropdown trigger="click" style="padding: inherit" v-if="scope.row.id !== ''">
              <el-button type="text" icon="el-icon-more" style="color:#909399"></el-button>
              <el-dropdown-menu slot="dropdown" style="background-color: #F2F2F2;">
                <el-dropdown-item style="padding: 0px">
                  <el-button type="text" class="accounting-dropBtn" @click="showPairDialog(scope.row)">
                    <svg-icon icon-class="arrow-couple"></svg-icon>
                    {{ $lang[langId].jurnal_pair }}
                  </el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <dialog-jurnal-pair
      :id="paramsPair.transaction_id"
      :no="paramsPair.transaction_no"
      :name="paramsPair.transaction_name"
      :show="dialogPair"
      @close="closePair"
    />
    <dialog-multi-jurnal-pair
      :pairId="paramsPair.pair_id"
      :show="dialogMultiPair"
      @close="closePair"
    />

    </div>
</template>

<script>
import axios from 'axios';
import {baseApi} from 'src/http-common';
import Loading from 'vue-loading-overlay';
import DialogJurnalPair from 'components/modules/_views/accounting/DialogJurnalPair';
import DialogMultiJurnalPair from 'components/modules/_views/accounting/DialogMultiJurnalPair';
import mixinAccounting from '@/mixins/mixinAccounting';
const moment = require('moment')

export default {
  data() {
    return {
      isLoading: false,
      loadingPDF: false,
      loadingExcel: false,
      filter: [
        {
          value: '',
          label: this.$store.state.userStores.lang.all
        },{
          value: 'transaction_no',
          label: this.$store.state.userStores.lang.transaction_no
        },{
          value: 'transaction_date',
          label: this.$store.state.userStores.lang.transaction_date
        }
      ],
      data: '',
      dataDetail: [],
      dialogPair: false,
      dialogMultiPair: false,
      accumulationDepreciation: false,
      pageType: false,
      disablePrev: true,
      disableNext: true,
      params: {
				store_id: this.$route.params.row.store.store_id,
        period: this.$route.params.row.period,
        account_no: this.$route.params.row.account_no,
        account_name: this.$route.params.row.account_name,
        start_date: '',
        end_date: '',
        sort_column: '',
        sort_type: '',
        page: 1,
        per_page: 25,
        total_page: 1
      },
      paramsPair: {
        pair_id: '',
        transaction_id: '',
        transaction_no: '',
        transaction_name: '',
      }
    }
  },
  components: {
    DialogJurnalPair,
    DialogMultiJurnalPair,
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
    userRole() {
      const selectedStore = this.$store.getters.selectedStore
      return {
        role_id: selectedStore.role_id,
        role_name: selectedStore.role_name,
        is_pos_only: selectedStore.is_pos_only,
        is_mobile: selectedStore.is_mobile
      }
    }
  },
  methods: {
    selectFilter(val) {
      if(val){
        this.params.search_column = val
      } else {
        this.params = {
					store_id: this.$route.params.row.store.store_id,
          period: this.$route.params.row.period,
          account_no: this.$route.params.row.account_no,
          account_name: this.$route.params.row.account_name,
          sort_column: 'transaction_date',
          sort_type: 'desc',
          page: 1,
          per_page: 25,
          total_page: 1
        }
        this.loadData()
      }
    },

    handleSearch(val) {
      if(this.params.search_column === 'transaction_date'){
        if(val !== null){
          this.params.search_text = moment(val).format('YYYY-MM-DD')
        } else {
          delete this.params.search_column
          delete this.params.search_text
        }
      } else {
        this.params.search_text = val
      }
      if(this.params.search_column === '' || this.params.search_text === ''){
        this.params = {
          store_id: this.$route.params.row.store.store_id,
          period: this.$route.params.row.period,
          account_no: this.$route.params.row.account_no,
          account_name: this.$route.params.row.account_name,
          sort_column: '',
          sort_type: '',
          page: 1,
          per_page: 25,
          total_page: 1
        }
      }
      this.loadData()
    },

    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      if (val.order === null) val.order = this.params.sort_type

      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.loadData()
    },
    
    previousLoad(){
      this.params.page = parseInt(this.params.page - 1)
      this.loadData()
    },

    nextLoad(){
      this.params.page = parseInt(this.params.page + 1)
      this.loadData()
    },

    changePageType(){
      let show = this.pageType
      if (show){
        this.pageType = false
        this.params.page = parseInt(this.params.page)
      }else{
        this.pageType = true
      }
    },

    changePage(){
      if(this.params.page <= this.params.total_page){
        this.pageType = false
        this.loadData()
      } else {
        this.params.page = this.params.total_page
      }
    },

    loadData(){
      this.isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let paramsData = this.params

      if(typeof paramsData.period === 'object'){
        paramsData.start_date = paramsData.period.start_date
        paramsData.end_date = paramsData.period.end_date
        delete paramsData.period
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/gainbalance/detail2'),
        headers: headers,
        params: paramsData
      }).then(response => {
        this.data = Object.keys(this.$route.params).includes('row') === true ? this.$route.params.row : this.data 
        this.dataDetail = response.data.detail
        this.params.page = parseInt(response.data.current_page)
        this.params.total_page = parseInt(response.data.total_page.total_page)
        this.disablePrev = this.params.page > 1 ? false : true
        this.disableNext = this.params.page === this.params.total_page ? true : false
        this.isLoading = false
      }).catch(error => {
        this.data = Object.keys(this.$route.params).includes('row') === true ? this.$route.params.row : this.data 
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

    getFileMobile(type) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let params = {
				store_id: this.$route.params.row.store.store_id,
        period: this.$route.params.row.period,
        account_no: this.$route.params.row.account_no,
        sort_column: this.params.sort_column,
        sort_type: this.params.sort_type, 
        search_column: this.params.search_column,
        search_text: this.params.search_text,
      }

      axios({
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/gainbalance/detail/' + type),
        method: 'GET',
        responseType: 'blob',
        headers,
        params: params
      }).then((response) => {
        const file = new Blob([response.data])
        const fileName = this.data.account_name + '-' + this.$route.params.row.period + '.' + type
        const url = window.URL.createObjectURL(file)
        const apiParams = '?' + params
        const apiURL = '/download/api/' + this.selectedStore.url_id + '/admin/v1/' + this.langId + '/account/gainbalance/detail/' + type
        window.location = apiURL + apiParams + ',' + fileName
        this.loadingPDF = false
        this.loadingExcel = false
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
        this.loadingExcel = false
      })
    },

    getPDF(data) {
      this.loadingPDF = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      var params = {
        store_id: this.$route.params.row.store.store_id,
        period: this.$route.params.row.period,
        account_no: this.$route.params.row.account_no,
        page: 1,
        per_page: 1000,
        start_date: null,
        end_date: null
      }

      if(typeof params.period === 'object'){
        params.start_date = params.period.start_date
        params.end_date = params.period.end_date
        params.period = ''
      }

      if('account_no' in data){
        params = data
      }

      axios({
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/gainbalance/detail/new/pdf'),
        method: 'GET',
        responseType: 'blob',
        headers,
        params: params 
      }).then((response) => {

        if(response.headers['content-type'] === 'application/json'){
          let dataParamsNext = {
            store_id: this.$route.params.row.store.store_id,
            period: this.$route.params.row.period,
            account_no: this.$route.params.row.account_no,
            page: params.page+1,
            per_page: 100
          }
          this.getPDF(dataParamsNext)
        } else {
          let fileName = this.data.account_name + '-' + this.$route.params.row.period + '.pdf'
          if(typeof this.$route.params.row.period === 'object'){
            fileName = this.data.account_name + ' ' + this.$route.params.row.period.start_date+'-'+this.$route.params.row.period.start_date+'.pdf'
          }
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click()
          this.loadingPDF = false
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
        this.loadingPDF = false
      })
    },

    getExcel(data) {
      this.loadingExcel = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      var params = {
        store_id: this.$route.params.row.store.store_id,
        period: this.$route.params.row.period,
        account_no: this.$route.params.row.account_no,
        page: 1,
        per_page: 1000,
        start_date: null,
        end_date: null
      }

      if(typeof params.period === 'object'){
        params.start_date = params.period.start_date
        params.end_date = params.period.end_date
        params.period = ''
      }

      if('account_no' in data){
        params = data
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/gainbalance/detail/new/excel'),
        responseType: 'blob',
        headers,
        params
      }).then(response => {

        if(response.headers['content-type'] === 'application/json'){
          let dataParamsNext = {
            store_id: this.$route.params.row.store.store_id,
            period: this.$route.params.row.period,
            account_no: this.$route.params.row.account_no,
            page: params.page+1,
            per_page: 100
          }
          this.getExcel(dataParamsNext)
        } else {
          let fileName = this.data.account_name + '-' + this.$route.params.row.period + '.xlsx'
          if(typeof this.$route.params.row.period === 'object'){
            fileName = this.data.account_name + ' ' + this.$route.params.row.period.start_date+'-'+this.$route.params.row.period.start_date+'.xlsx'
          }
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click()
          this.loadingExcel = false
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
        this.loadingExcel = false
      })
    },
    
    getSummaries(param, idx) {
      const { columns, data } = param;

      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0 || index === 2) {
          sums[index] = '';
          return;
        }

        if (index === 1) {
          sums[index] = this.$lang[this.langId].ending_balance;
          return;
        }

        if (index === 3) {
          sums[index] = this.dataDetail[idx].debitAkhir;
          return;
        }

        if (index === 4) {
          sums[index] = this.dataDetail[idx].creditAkhir;
          return;
        }

        if (index === 5) {
          sums[index] = this.dataDetail[idx].saldoAkhir;
          return;
        }

        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          // sums[index] =  this.formatPrice(values.reduce((prev, curr) => {
          //   const value = Number(curr);
          //   if (!isNaN(value)) {
          //     return prev + curr;
          //   } else {
          //     return prev;
          //   }
          // }), 0);
        } else {
          sums[index] = '';
        }
      });

      return sums;
    },

    showPairDialog(row){
      if(row.purchase_sales_form === 0){
        this.paramsPair = {
          pair_id: row.account_pair_id
        }
        this.dialogMultiPair = true
      }else{
        this.paramsPair = {
          transaction_id: row.transaction_id,
          transaction_no: row.transaction_no,
          transaction_name: row.transaction_name,
        }
        this.dialogPair = true
      }
    },

    closePair(){
      this.paramsPair = {
        pair_id: '',
        transaction_id: '',
        transaction_no: '',
        transaction_name: '',
      }
      this.dialogPair = false
      this.dialogMultiPair = false
    },

    backHandle() {
      let page = this.$route.params.row.page
      let period = this.$route.params.row.period
      let typePeriod = this.$route.params.row.typePeriod
      this.$router.push({name: this.$route.params.row.page, params: {period: period, typePeriod: typePeriod}})
    },

  },
  mounted() {
    this.loadData()
  }
}
</script>

<style lang="scss" scoped>
  .cart-items {
    float: none;
    padding: 0;
    // li {
    //   padding: 8px 0 8px 0;
    // }
    h5 {
      font-weight: 600;
      margin-top: 2px;
      margin-bottom: 0;
    }
  }
</style>
