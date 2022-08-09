<template>
  <div>
    <el-table :data="data" border>
      <el-table-column :label="lang.group" prop="product_group_name" min-width="100px" />
      <el-table-column :label="lang.product" prop="product_name" min-width="180px" />
      <el-table-column :label="lang.variant" prop="product_variant_name" min-width="180px" />
      <el-table-column :label="lang.sold_qty" prop="total_qty"/>
      <el-table-column min-width="140px" :label="lang.sales_amount" prop="ftotal_amount" />
      <el-table-column min-width="140px" :label="lang.profit" prop="ftotal_profit" />
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
  name: 'TableProductsalesbydateshift',
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
