<template>
  <div>
    <div class="summary">
      <h5>{{ $lang[langId].summary }}</h5>
      <bs-table
        :header="[
          $lang[langId].currency,
          lang.sales_amount,
          lang.shipping_cost,
          lang.sales_amount + ' - ' + lang.shipping_cost
        ]">
        <tr
          v-for="(item, key) in summary"
          :key="key">
          <td>{{ item.currency_id }}</td>
          <td>{{ item.ftotal_amount }}</td>
          <td>{{ item.ftotal_shipping_cost }}</td>
          <td>{{ item.ftotal_without_shipping }}</td>
        </tr>
      </bs-table>
    </div>

    <hr/>

    <bs-table
      :header="[
        lang.sales_source,
        lang.customer_type,
        lang.customer,
        lang.sales_amount,
        lang.shipping_cost,
        lang.sales_amount + ' - ' + lang.shipping_cost
      ]">
      <tr
        v-for="(item, key) in data"
        :key="key">
        <td>{{ item.order_source_name }}</td>
        <td>{{ item.customer_type }}</td>
        <td>{{ item.customer_name }}</td>
        <td>{{ item.ftotal_amount }}</td>
        <td>{{ item.ftotal_shipping_cost }}</td>
        <td>{{ item.ftotal_without_shipping }}</td>
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
  name: 'TableSalesbycustomer',
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
