<template>
    <div class="px-20">

    <div class="box sticky-top-has-submenu">
      <div class="box-header with-border">
         <h4 v-if="!data.name">-</h4>
          <h4 v-else>{{ capitalize(data.name) }}</h4>
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
              <!-- <div style="margin: 0px 18px; height: 3rem; border-right: solid #e3e2e2 thin;"></div>
              <div class="flex-grow-1">
                <div style="margin-top: 20px">
                  <el-radio v-for="(currency, idc) in listCurrency" :key="idc" 
                    v-model="storeCurrency" :label="currency.currency_id" @change="loadData(currency.currency_id)" border size="medium">
                    {{currency.famount}}
                  </el-radio>
                </div>
              </div> -->
            </div>

          </div>

          <div class="col-xs-12 visible-xs text-center" style="margin-top: 10px">

          </div>

          <div class="visible-lg visible-sm visible-md col-sm-3 col-md-3 col-lg-3 text-right">

          </div>

          <div class="visible-xs col-xs-12" style=" margin-top: 10px;">

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
          :label="lang.account"
          width="180"
          prop="account_no">
          <template slot-scope="scope">
            <div>{{ scope.row.account_no}} - {{capitalize(scope.row.account_name)}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="transaction_date"
          :label="lang.date"
          width="120">
          <template slot-scope="scope">
            <span>{{scope.row.ftransaction_date}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="transaction_no"
          :label="lang.transaction_no"
          width="180">
          <template slot-scope="scope">
            <span v-if="scope.row.id === ''">{{capitalize(scope.row.transaction_name)}}</span>
            <span v-else>{{scope.row.transaction_no}}</span>
            <p class="font-12" v-show="scope.row.external_no">{{$lang[langId].document_number + ' ' + capitalize(scope.row.external_no)}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="transaction_description"
          :label="lang.description"
          width="350">
          <template slot-scope="scope">
            <span>{{capitalize(scope.row.transaction_description)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="debit"
          :label="$lang[langId].debit"
          align="right">
          <template slot-scope="scope">
            <div v-if="scope.row.fdebit !== null">{{ scope.row.fdebit }}</div>
            <div v-else>0</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="credit"
          :label="$lang[langId].credit"
          align="right">
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

      data: this.$route.params.row.data,
      storeCurrency: this.$store.getters.selectedStore.currency_id,
      dialogPair: false,
      dialogMultiPair: false,
      data: this.$route.params.row.data,
      listCurrency: [],
      dataDetail: [],
      pageType: false,
      disablePrev: true,
      disableNext: true,
      params: {
				period: '',
        sort_column: '',
        sort_type: '',
        currentPage: 1,
        per_page: 15,
        page: 1,
        total: null
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

    handleDetailSizeChange(val) {
      this.params.per_page = val
      this.loadData()
    },
    
    handleDetailCurrentChange(val, row) {
      this.params.currentPage = val
      this.params.page = val
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

    getCurrency(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let group = this.$route.params.row.data.group
      let params = {period: this.$route.params.row.data.period}

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/cashbycurrency/' + group),
        headers: headers,
        params: params
      })
      .then(response => {
        this.listCurrency = response.data.data
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

    loadData(currencyVal){
      this.isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let group = this.$route.params.row.data.group
      let period = this.$route.params.row.data.period
      let currrency = currencyVal ? currencyVal : this.storeCurrency
      
      let urlCash = urlCash = baseApi(this.selectedStore.url_id, this.langId, 'account/cashflow/detail')
      if(typeof period === 'object'){
        this.params.store_id = period.store_id
        this.params.start_date = period.start_date
        this.params.end_date = period.end_date
      } else {
        this.params.period = period
      }
      this.params.group = group

      axios({
        method: 'GET',
        url: urlCash,
        headers: headers,
        params: this.params
      })
      .then(response => {
        this.data = Object.keys(this.$route.params).includes('row') === true ? this.$route.params.row.data : this.data
        this.dataDetail = response.data.detail
        this.params.page = parseInt(response.data.current_page)
        this.params.total_page = parseInt(response.data.total_page.total_page)
        this.disablePrev = this.params.page > 1 ? false : true
        this.disableNext = this.params.page === this.params.total_page ? true : false
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

    closeDialogDetail(){
      this.dialogDetail = false
      this.dataDetail = []
      this.params = {
        name: '',
        group: '',
        period: '',
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
        if (index === 0) {
          sums[index] = '';
          return;
        }

        if (index === 1) {
          sums[index] = this.$lang[this.langId].ending_balance;
          return;
        }
        if (index === 2) {
          sums[index] = '';
          return;
        }
        if (index === 3) {
          sums[index] = '';
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
      let period = this.$route.params.row.period
      let typePeriod = this.$route.params.row.typePeriod
      this.$router.push({name: 'Cash Flow Statement', params: {period: period, typePeriod: typePeriod}})
    },
  },
  mounted() {
    // this.getCurrency()
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
