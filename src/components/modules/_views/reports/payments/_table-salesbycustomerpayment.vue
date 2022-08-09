<template>
  <div>
    <div class="summary">
      <h5>{{ $lang[langId].summary }}</h5>
      <el-table :data="summary" border>
        <el-table-column :label="$lang[langId].currency" prop="currency_id" />
        <el-table-column min-width="140px" :label="lang.sales_amount" prop="ftotal_amount" />
        <el-table-column min-width="140px" :label="lang.shipping_cost" prop="ftotal_shipping_cost" />
        <el-table-column min-width="140px" :label="lang.sales_amount + ' - ' + lang.shipping_cost" prop="ftotal_without_shipping" />
      </el-table>
    </div>

    <hr/>

    <el-table :data="data">
      <el-table-column :label="lang.sales_source" prop="order_source_name" />
      <el-table-column :label="lang.customer_type" prop="customer_type" />
      <el-table-column :label="lang.customer" prop="customer" min-width="140px">
        <template slot-scope="scope">
          {{ scope.row.customer_name }}
          <p>{{ scope.row.customer_email }}</p>
        </template>
      </el-table-column>
      <el-table-column :label="lang.sales_amount" prop="ftotal_amount" min-width="140px"/>
      <el-table-column :label="lang.shipping_cost" prop="ftotal_shipping_cost" min-width="140px"/>
      <el-table-column :label="lang.sales_amount + ' - ' + lang.shipping_cost" prop="ftotal_without_shipping" min-width="140px" />
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
  name: 'TableSalesByCustomerPayment',
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

