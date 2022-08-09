<template>
  <div>
    <el-dialog
      :visible.sync="show"
      :before-close="handleClose"
      :title="rootLang.my_bill + ' (' + pagination.total +')'"
      custom-class="mw-980">

      <div class="text-center mb-16 flex-container center justify-center">
        <single-date-picker v-model="date" :clearable="true" @input="datePicked" />
      </div>

      <el-table
        v-loading="loadingListBilling"
        :data="listBilling"
        border
        class="pointer"
        @row-click="rowClick">
        <el-table-column :label="rootLang.billing_no" prop="billing_no" min-width="180px" >
          <template slot-scope="scope">
            <div style="display: flex; align-items: center">
              <svg-icon icon-class="icon-document" style="font-size: 40px"/>
              <span>{{ scope.row.billing_no }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="rootLang.transaction_date" prop="fbilling_date" min-width="120px" />
        <el-table-column :label="rootLang.due_date" prop="fpayment_date" min-width="100px" />
        <el-table-column :label="lang.tax" prop="ftax_amount" min-width="100px">
          <template slot-scope="scope">
            <div class="text-right">{{ scope.row.ftax_amount }}</div>
          </template>
        </el-table-column>
        <el-table-column :label="rootLang.total" prop="ftotal_amount" min-width="100px">
          <template slot-scope="scope">
            <div class="text-right">{{ scope.row.ftotal_amount }}</div>
          </template>
        </el-table-column>
        <el-table-column :label="rootLang.status" prop="status" min-width="100px">
          <template slot-scope="scope">
            <div
              class="text-center">
              <el-button
                :type="checkType(scope.row.status)"
                round
                plain
                size="mini">
                {{ scope.row.fstatus }}
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div style="text-align: center;">
        <el-pagination
          @current-change="changeCurrentPage"
          :current-page.sync="pagination.current_page"
          :page-size="pagination.per_page"
          layout="prev, pager, next, jumper"
          :total="pagination.total">
        </el-pagination>
      </div>
    </el-dialog>

    <dialog-trx-payment-detail
      :detail-billing="detailBilling"
      :table-total="tableTotal"
      :table-tax="tableTax"
      :lang="lang"
      :show="visibleDialogDetailPayment"
      @close="visibleDialogDetailPayment = false"
    />
  </div>
</template>

<script>
import { HTTP } from '../http-common'
import DialogTrxPaymentDetail from './DialogTrxPaymentDetail'
import SingleDatePicker from '@/components/SingleDatePicker'
var moment = require('moment')
export default {
  props: ['show'],

  components: {
    DialogTrxPaymentDetail,
    SingleDatePicker
  },

  data() {
    return {
      date: '',
      listBilling: [],
      loadingConfirm: false,
      loadingBillingDetail: false,
      loadingListBilling: false,
      visibleDialogDetailPayment: false,
      detailBilling: {
        payment_mode: {}
      },
      tableTotal: [],
      tableTax: [],
      visibleDialogConfirm: false,
      pagination: [],
      params: {
        sort_column: 'id',
        sort_type: 'desc',
        page: 1,
        search_column: 'billing_date',
        search_text: ''
      }
    }
  },

  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    store() {
      return this.$store.state 
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    rootLang() {
      return this.$lang[this.$store.state.userStores.langId]
    },
    token() {
      return this.$store.state.user.token
    },
    lang() {
      return this.$store.state.userStores.lang
    },
  },

  watch: {
    show(payload) {
      if (payload) {
        this.showListBilling(false)
      }
    }
  },

  methods: {
    handleClose() {
      this.$emit('close')
    },

    showListBilling(type) {
      this.loadingListBilling = true
      var param = {
        sort_column: 'id',
        sort_type: 'desc',
        page: this.params.page
      }
      if (type) {
        param.search_column = this.params.search_column
        param.search_text = this.params.search_text
      }
      let paramsRequest = {
        headers: {
          'Authorization': 'Bearer ' + this.token.access_token
        },
        params: param
      }
      HTTP.get('api/admin/v1/id/billings/order', paramsRequest).then(response => {
        this.listBilling = response.data.data
        this.pagination = response.data.meta
        this.loadingListBilling = false
      }).catch(() => {
        this.pagination.total = 0
        this.params.page = 1
        this.loadingListBilling = false
      })
    },

    rowClick (data) {
      this.getBillingDetail(data.id)
    },

    getBillingDetail(id) {
      this.loadingBillingDetail = true
      let paramsRequest = {
        headers: {
          'Authorization': 'Bearer ' + this.token.access_token
        }
      }
      HTTP.get('api/admin/v1/id/billings/order/' + id, paramsRequest).then(response => {
        this.detailBilling = response.data.data
        this.visibleDialogDetailPayment = true
        this.tableTotal = [
          {
            total_qty: response.data.data.total_qty,
            fprice: '',
            ftotal_amount: response.data.data.ftotal_amount 
          }
        ]
        this.tableTax = [
          {
            tax_amount: response.data.data.tax_amount,
            ftax_amount: response.data.data.ftax_amount 
          }
        ]
        this.loadingBillingDetail = false
      }).catch(() => {
        // this.btnCreate = false
        this.loadingBillingDetail = false
      })
    },

    datePicked(value) {
      this.listBilling = []
      this.loadingListBilling = true
      var param
      if (value) {
        this.params.search_text = value
        this.showListBilling(true)
      } else {
        this.params.search_text = ''
        this.params.page = 1
        this.showListBilling(false)
      }
    },

    checkType(status) {
      if (status === 'P') {
        return 'warning'
      } else if (status === 'X') {
        return 'danger'
      } else if (status === 'Z') {
        return 'info'
      } else {
        return 'default'
      }
    },

    changeCurrentPage(val) {
      this.params.currentPage = val
      this.params.page = val
      if (this.params.search_text) {
        this.showListBilling(true)
      } else {
        this.showListBilling(false)
      }
    }
  }
}
</script>
