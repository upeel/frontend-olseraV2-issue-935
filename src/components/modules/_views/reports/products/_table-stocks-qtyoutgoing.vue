<template>
  <div>
    <div class="summary">
      <h5>{{ $lang[langId].summary }}</h5>
      <el-table :data="[summary]" border>
        <el-table-column :label="lang.sold_qty" prop="ftotal_out_qty" />
        <el-table-column :label="lang.sales_amount" prop="ftotal_out_amount" />
      </el-table>
    </div>

    <bs-table
      :header="[
        lang.product,
        lang.variant,
        lang.category,
        lang.qty,
        lang.price,
        lang.subtotal
      ]">
      <tr
        v-for="(item, key) in data"
        :key="key">
        <td>{{ item.product_name }} <span v-if="item.product_sku">({{ item.product_sku }})</span></td>
        <td>{{ item.product_variant_name }} <span v-if="item.product_variant_sku">({{ item.product_variant_sku }})</span></td>
        <td>{{ item.product_group_name }}</td>
        <td>{{ item.out_qty }}</td>
        <td>{{ item.favg_price }}</td>
        <td>{{ item.fout_amount }}</td>
      </tr>
    </bs-table>

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
  name: 'TableStocksQtyoutgoing',
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

