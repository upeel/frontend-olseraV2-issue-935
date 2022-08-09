<template>
  <div>
    <div class="summary">
      <h5>{{ $lang[langId].summary }}</h5>
      <el-table :data="summary" border>
        <el-table-column :label="$lang[langId].currency" prop="currency_id" />
        <el-table-column min-width="120px" :label="lang.beginning" prop="fbegin_cash_amount" />
        <el-table-column min-width="120px" :label="lang.sales" prop="ftransaction_cash_amount" />
        <el-table-column min-width="120px" :label="lang.credit_payments" prop="fcredit_payment_amount" />
        <el-table-column min-width="120px" :label="lang.refunds" prop="frefund_cash_amount" />
        <el-table-column min-width="120px" :label="lang.void" prop="fvoid_cash_amount" />
        <el-table-column min-width="120px" :label="lang.in_out" prop="finout_cash_amount" />
        <el-table-column min-width="120px" :label="lang.actual" prop="fclosing_cash_amount" />
        <el-table-column min-width="120px" :label="lang.difference" prop="fdiff_cash_amount" />
      </el-table>
    </div>

    <hr/>

    <el-table :data="data" border>
      <el-table-column :label="lang.staff" prop="sales_by_name" min-width="120px" />
      <el-table-column min-width="140px" :label="lang.shift" prop="fdate" >
        <template slot-scope="scope">
          {{ scope.row.fstart_time }} - {{ scope.row.fend_time}}
        </template>
      </el-table-column>
      <el-table-column min-width="120px" :label="lang.beginning" prop="fbegin_cash" />
      <el-table-column min-width="120px" :label="lang.sales" prop="ftransaction_cash" />
      <el-table-column min-width="120px" :label="lang.credit_payments" prop="fcredit_payment" />
      <el-table-column min-width="120px" :label="lang.refunds" prop="frefund_cash" />
      <el-table-column min-width="120px" :label="lang.void" prop="fvoid_cash" />
      <el-table-column min-width="120px" :label="lang.in_out" prop="finout_cash" />
      <el-table-column min-width="120px" :label="lang.actual" prop="fclosing_cash" />
      <el-table-column min-width="120px" :label="lang.difference" prop="fdiff_cash" />
    </el-table>

    <div v-if="total > 0" class="table-handler-bottom">
      <el-pagination
        :total="total"
        :page-sizes="[50, 100]"
        :page-size="15"
        :current-page.sync="currentPage"
        background
        layout="sizes, prev, pager, next"
        @current-change="handleChangePage"
        @size-change="handleChangeSizePage"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableSalescashbalancebyshift',
  props: ['data', 'lang', 'summary', 'langId', 'total'],
  methods: {
    handleChangePage(page) {
      this.$emit('changePage', page)
    },
    handleChangeSizePage(page) {
      this.$emit('changeSizePage', page)
    }
  }
}
</script>
