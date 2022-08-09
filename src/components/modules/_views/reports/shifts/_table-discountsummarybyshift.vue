<template>
  <div>
    <div class="summary">
      <h5>{{ $lang[langId].summary }}</h5>
      <el-table :data="summary" border>
        <el-table-column :label="$lang[langId].currency" prop="currency_id" />
        <el-table-column :label="lang.qty" prop="fcount_orders" />
        <el-table-column :label="lang.discount_amount" prop="fdiscount_amount" />
      </el-table>
    </div>

    <hr/>

    <el-table :data="data" border>
      <el-table-column :label="lang.sales_source" prop="order_source_name" min-width="120px" />
      <el-table-column min-width="180px" :label="lang.discount_code" prop="discount_voucher_code" />
      <el-table-column min-width="180px" :label="lang.discount_name" prop="discount_voucher_name" />
      <el-table-column :label="lang.qty" prop="fcount_orders" />
      <el-table-column min-width="120px" :label="lang.discount_amount" prop="fdiscount_amount" />
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
  name: 'TableDiscountsummarybyshift',
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
