<template>
  <div>
    <div class="summary">
      <h5>{{ $lang[langId].summary }}</h5>
      <el-table :data="summary" border>
        <el-table-column :label="$lang[langId].currency" prop="currency_id" />
        <el-table-column min-width="140px" :label="lang.total + ' ' + lang.discount_amount" prop="fdiscount_amount" />
        <el-table-column min-width="140px" :label="$lang[langId].total_order_qty" prop="fcount_orders" />
      </el-table>
    </div>

    <hr/>

    <el-table :data="data" border>
      <el-table-column :label="lang.sales_source" min-width="120px">
        <template slot-scope="scope">
          {{scope.row.order_source_name}}
        </template>
      </el-table-column>
      <el-table-column :label="lang.discount_code" prop="discount_voucher_code" />
      <el-table-column min-width="140px" :label="lang.discount_name" prop="discount_voucher_name" />
      <el-table-column min-width="140px" :label="lang.discount_amount" prop="fdiscount_amount" />
      <el-table-column min-width="140px" :label="lang.order_qty" prop="count_orders" />
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
  name: 'TableSalesdetails',
  props: ['data', 'lang', 'summary', 'langId', 'total', 'currentPage'],
  methods: {
    handleChangePage(page) {
      this.$emit('changePage', page)
      this.$emit('currentPage', this.currentPage)
    },
    handleChangeSizePage(page) {
      this.currentPage = 1
      this.$emit('changeSizePage', page)
    }
  }
}
</script>
