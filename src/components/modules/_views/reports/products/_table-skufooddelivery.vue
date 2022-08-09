<template>
  <div>


    <el-table :data="data">
      <el-table-column :label="$lang[langId].grup" min-width="120" prop="product_group_name"></el-table-column>
      <el-table-column :label="$lang[langId].produk" min-width="220" prop="product_name"></el-table-column>
      <el-table-column :label="$lang[langId].variant" min-width="120" prop="product_variant_name"></el-table-column>
      <el-table-column :label="$lang[langId].brand" min-width="120" prop="product_brand" />
      <el-table-column :label="$lang[langId].qty_seles" min-width="120" prop="total_qty" />

      <el-table-column :label="$lang[langId].total_seles " min-width="145" prop="ftotal_amount" />
      <el-table-column :label="$lang[langId].total_food_delivery_sales" min-width="200" prop="ftotal_amount_food_delivery" />


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
  name: 'TableSkufooddelivery',
  props: ['data', 'lang', 'summary', 'total'],
  computed: {
    langId() {
      return this.$store.state.userStores.langId
    }
  },
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

