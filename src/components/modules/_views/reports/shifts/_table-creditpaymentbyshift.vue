<template>
  <div>
    <div class="summary">
      <h5>{{ $lang[langId].summary }}</h5>
      <el-table :data="summary" border>
        <el-table-column :label="$lang[langId].currency" prop="currency_id" />
        <el-table-column min-width="140px" :label="lang.payment_amount" prop="fpayment_amount" />
      </el-table>
    </div>

    <hr/>

    <el-table :data="data" border>
      <el-table-column :label="lang.received_by" prop="user_name" min-width="180px" />
      <el-table-column min-width="190px" :label="lang.payment_date" prop="fpayment_date" />
      <el-table-column :label="lang.order_no" prop="order_no" min-width="180px" >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="showDetailData(
              {path: '/sales/openorder/' + scope.row.id,query: {'rpt': true, 'path': 'salesdetails'}},
              {...scope.row}
            )">
            {{ scope.row.order_no }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column min-width="120px" :label="lang.payment_methods" prop="payment_mode_name" />
      <el-table-column min-width="140px" :label="lang.payment_amount" prop="fpayment_amount" />
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
  name: 'TableCreditpaymentbyshift',
  props: ['data', 'lang', 'summary', 'langId', 'total'],
  methods: {
    showDetailData(path, data) {
      this.$emit('showdetaildata', path, data)
    },
    handleChangePage(page) {
      this.$emit('changePage', page)
    },
    handleChangeSizePage(page) {
      this.$emit('changeSizePage', page)
    }
  }
}
</script>
