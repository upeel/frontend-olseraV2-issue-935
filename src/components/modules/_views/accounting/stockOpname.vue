<template>
  <div class="content-wrapper">
    <section class="content-accounting">
      <template v-if="data">
        <el-card class="box-card pos-relative">
          <div class="card-body">
            <div class="inventory-status" :class="classBasedOnStatus">
              <template v-if="data.status  === 'P'">
                <span><i class="el-icon-circle-check"></i></span>{{ data.status_desc }}
              </template>
              <template v-if="data.status  === 'X'">
                <span><i class="el-icon-error"></i></span>{{ data.status_desc }}
              </template>
              <template v-if="data.status  === 'D'">
                <span><i class="el-icon-document"></i></span>{{ data.status_desc }}
              </template>
            </div>
            <div class="row with-padding-left">
              <div class="col-md-3">
                <small style="color: #ccc;">{{ lang.stock_opname_no }}</small>
                <h4 v-if="!data.trans_no">-</h4>
                <h4 v-else>{{ data.trans_no }}</h4>
              </div>
              <div class="col-md-9 text-right">
                <el-button icon="el-icon-back" size="small" type="success" plain @click="backHandle">{{ lang.back }}</el-button>
              </div>
            </div>
          </div>
        </el-card>

        <!-- <template v-if="data.IsEditable">
          <stocks-table
            @itemadded="addItem"
            @itemupdated="itemUpdated"
            :editable="data.IsEditable"
            :is-item-added="itemAdded"
            :is-button-disabled="isButtonDisabled"
            :data-table="data.items">
          </stocks-table>
        </template>
        <template v-else>
          <stocks-table-posted :data-table="data.items"></stocks-table-posted>
        </template> -->

      <el-card class="card-box" style="margin-top: 20px;">
        <div class="table-responsive">
          <el-table
            :data="data.items"
            stripe
            style="width: 100%;">
            <el-table-column
              :label="lang.name">
              <template slot-scope="scope">
                <div class="clearfix">
                  <div class="pull-left">
                    <strong>{{ scope.row.product_name }} - {{ scope.row.product_sku }}</strong>
                    <p>{{ scope.row.product_variant_name }} - {{ scope.row.product_variant_sku }}</p>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="lang.time"
              prop="ftime"
              width="90">
            </el-table-column>
            <el-table-column
              :label="lang.system_qty"
              prop="qty_sys"
              width="120">
            </el-table-column>
            <el-table-column
              :label="lang.actual_qty"
              prop="qty"
              width="120">
            </el-table-column>
            <el-table-column
              :label="$lang[langId].average_by_price"
              prop="fcost_price"
              width="120">
            </el-table-column>
            <el-table-column
              :label="lang.difference"
              prop="qty_diff"
              width="120">
            </el-table-column>
            <el-table-column
              :label="$lang[langId].adjustment"
              prop="fadjusment"
              width="120">
            </el-table-column>
          </el-table>
        </div>
      </el-card>

      </template>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import {baseApi} from 'src/http-common'
// import stocksTable from './StocksTable'
import Loading from 'vue-loading-overlay';
// import stocksTablePosted from './StocksTablePosted'
const moment = require('moment')
export default {
  data() {
    return {
      isLoading: false,
      data: null,
      isButtonDisabled: false,
      itemAdded: false,
      isEditing: {
        date: false,
        note: false
      },
      tmp: {}
    }
  },
  components: {
    Loading
    // stocksTable,
    // stocksTablePosted
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
    classBasedOnStatus() {
      let className
      if (this.data.status === 'P') {
        className = 'posted'
      } else if (this.data.status === 'X') {
        className = 'canceled'
      } else if (this.data.status === 'D') {
        className = 'draft'
      }
      return className
    }
  },
  methods: {
    loadData() {
      this.isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      // console.log('data', this.$route.params.row.data)

      let id = this.$route.params.row.data.transaction_id

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/stockopname/' + id),
        headers: headers
      }).then(response => {
        this.data = response.data.data
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

    backHandle() {
      let lastParamsDetail = this.$route.params.row.lastParamsDetail
      let selectedMonth = this.$route.params.row.selectedMonth
      let year = this.$route.params.row.year
      let month = this.$route.params.row.month
      let account_no = this.$route.params.row.account_no
      let account_name = this.$route.params.row.account_name
      let lastParamsList = this.$route.params.row.lastParamsList
      let monthLabel = this.$route.params.row.monthLabel
      let lastFilter = this.$route.params.row.lastFilter
      this.$router.push({name: this.$route.params.row.inPage, 
        params: {lastParamsDetail: lastParamsDetail, selectedMonth: selectedMonth,
        row: {year: year, month: month, account_no: account_no, account_name: account_name},
        lastParamsList: lastParamsList, monthLabel: monthLabel, lastFilter: lastFilter}})    
    },

  },
  mounted() {
    this.loadData()
  }
}
</script>
