<template>
  <div>
    <el-dialog
      :visible.sync="show"
      :show-close="false"
      width="95%"
      center 
      custom-class="dialog-card">
      <div slot="title" class="flex-container">
        <el-row :gutter="20"  style="width: 100%">
          <el-col :span="14">
            <h4 class="dialog-title">{{ $lang[langId].jurnal_pair }} Multiple</h4>
          </el-col>
          <el-col :span="10" align="right">
            <div class="btn_save_dialog">
              <el-button type="info" @click="closePairDialog">{{ lang.close }}</el-button>
            </div>
          </el-col>
        </el-row>

      </div>
      <el-table
        :data="dataPair"
        stripe >
        <el-table-column
          prop="ftransaction_date"
          :label="lang.date"
          width="120">
        </el-table-column>
        <el-table-column
          prop="account_name"
          :label="lang.account"
          width="210">
          <template slot-scope="scope">
            <span class="word-break">{{scope.row.account_no}} {{capitalize(scope.row.account_name)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="transaction_no"
          :label="lang.transactions"
          width="180">
          <template slot-scope="scope">
            <div><span>{{scope.row.transaction_no}}</span></div>
            <el-tag type="warning" size="mini">
              <small class="word-break">
                {{capitalize(scope.row.transaction_name)}}
              </small>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column 
          prop="transaction_description"
          :label="lang.description">
          <template slot-scope="scope">
            <span class="word-break">{{capitalize(scope.row.transaction_description)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="fdebit"
          :label="$lang[langId].amount_debit"
          sortable
          align="right">

        </el-table-column>
        <el-table-column
          prop="fcredit"
          :label="$lang[langId].amount_credit"
          sortable
          align="right">

        </el-table-column>
        <el-table-column
          prop="user_name"
          :label="lang.proceed_by"
          width="160">
          <template slot-scope="scope">
            <span>{{capitalize(scope.row.user_name)}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center">
        <el-pagination
          @size-change="handlePairSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="params.currentPage"
          :page-size="parseInt(params.per_page)"
          layout="total, prev, pager, next, jumper"
          :total="params.total"
          class="paginate">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import axios from 'axios'
import {baseApi} from 'src/http-common'

export default {
  props: ['show', 'pairId'],

  data() {
    return {
      dataPair: [],
      params: {
        pair_id: '',
        currentPage: 1,
        per_page: 15,
        page: 1,
        total: null
      }
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
  },

  watch: {
    show(payload) {
      if (payload) {
        this.showPairDialog()
      }
    }
  },

  methods: {
    handlePairSizeChange(val) {
      this.params.per_page = val
      this.showPairDialog()
    },
    
    handleCurrentChange(val, row) {
      this.params.currentPage = val
      this.params.page = val
      this.showPairDialog()
    },

    showPairDialog(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let params = {
        currentPage: this.params.currentPage,
        per_page: this.params.per_page,
        page: this.params.page,
        total: this.params.total,
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/jurnalpair/' + this.pairId),
        headers: headers,
        params: params
      }).then(response => {
        this.params = {
          pair_id: this.pairId,
          per_page: response.data.meta.per_page,
          currentPage: response.data.meta.current_page,
          total: response.data.meta.total
        }
        this.dataPair = response.data.data
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: eror.response.data.error.error
        })
      })
    },

    closePairDialog(){
      this.$emit('close')
    },

    capitalize(value){
      let capitalize= '';
      if(value){
        capitalize = value[0].toUpperCase() + value.slice(1);
      }
      return capitalize;
    }
  }
}
</script>
<style lang="scss" scoped>
  .paginate {
    .el-pager li {
      background: #FFFFFF !important;
    }
    .el-pager li.active {
      color: #FFFFFF;
      background:#0085CD !important;
      border-radius: 60px !important;
    }

    .el-pagination .btn-prev {
      background-color: #FFFFFF !important;
      background: #FFFFFF !important;
    }
  }

  .perpage {
    .el-input__inner {
      border: 0px solid #FFFFFF !important;
    }
  }
</style>