<template>
  <div>
    <bs-table
      :header="[
        lang.product,
        lang.sku,
        lang.buy_price,
        lang.customer_type,
        lang.qty_from,
        lang.sell_price
      ]">
      <tr
        v-for="(item, key) in data"
        :key="key">
        <td>{{ item.product_name }}</td>
        <td>{{ item.sku }}</td>
        <td>{{ item.buy_price }}</td>
        <td>{{ item.customer_type_name }}</td>
        <td>{{ item.qty_from }}</td>
        <td>{{ item.fsell_price }}</td>
      </tr>
    </bs-table>

    <div
      v-if="total > 0"
      class="table-handler-bottom">
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
  name: 'TablePriceTiers',
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

