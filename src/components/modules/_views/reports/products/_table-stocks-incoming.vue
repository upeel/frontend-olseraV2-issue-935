<template>
  <div>
    <div class="summary">
      <h5>{{ $lang[langId].summary }}</h5>
      {{ lang.total_products }}: {{ summary.ftotal_qty }}<br/>
      {{ lang.amount }}: {{ summary.ftotal_buy_amount }}<br/>
    </div>

    <hr/>

    <bs-table
      :header="[
        lang.transaction_no,
        lang.date,
        lang.product,
        lang.variant,
        lang.serial,
        lang.supplier,
        lang.buy_price,
        lang.avg_buy_price,
        lang.sell_price,
        lang.subtotal,
        lang.qty
      ]">
      <tr
        v-for="(item, key) in data"
        :key="key">
        <td>{{ item.trans_no }}</td>
        <td>{{ item.fdate }}</td>
        <td>{{ item.product_name }} ({{ item.product_sku }})</td>
        <td>{{ item.product_variant_name }} ({{ item.product_variant_sku }})</td>
        <td>{{ item.serials }}</td>
        <td>{{ item.supplier_name }}</td>
        <td>{{ item.fbuy_price }}</td>
        <td>{{ item.favg_buy_price }}</td>
        <td>{{ item.fsell_price }}</td>
        <td>{{ item.ftotal_buy_price }}</td>
        <td>{{ item.qty }}</td>
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
  name: 'TableStocksIncoming',
  props: ['data', 'lang', 'summary', 'langId', 'total', 'currentPage'],
  computed: {
    langId() {
      return this.$store.state.userStores.langId
    }
  },

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
