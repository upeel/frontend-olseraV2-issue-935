<template>
  <div>
    <!-- <div class="summary">
      <h5>{{ $lang[langId].summary }}</h5>
      <bs-table
        :header="[
          $lang[langId].currency,
          lang.sales_amount,
          lang.shipping + lang.tax,
          lang.product_cost,
          lang.profit,
          lang.service_charge,
          lang.discount
        ]">
        <tr
          v-for="(item, key) in summary"
          :key="key">
          <td>{{ item.currency_id }}</td>
          <td>{{ item.ftotal_amount }}</td>
          <td>{{ item.ftotal_shipping_tax_amount }}</td>
          <td>{{ item.ftotal_cost_amount }}</td>
          <td>{{ item.fprofit_nett }}</td>
          <td>{{ item.ftotal_service_charge_amount }}</td>
          <td>{{ item.ftotal_discount_amount }}</td>
        </tr>
      </bs-table>
    </div> -->

    <hr/>

    <bs-table
      :header="[
        lang.store,
        lang.order_no,
        lang.sales_date,
        lang.customer + ' ID',
        lang.customer,
        lang.table_number,
        lang.sales_by,
        lang.serial_no,
        lang.item,
        lang.qty,
        $lang[langId].total_order,
        lang.product_cost,
        lang.profit
      ]">
      <tr
        v-for="(item, key) in data"
        :key="key">
        <td>{{ item.outlet_name }}</td>
        <td>{{ item.order_no }}</td>
        <td>{{ item.forder_date }}</td>
        <td>{{ item.customer_id }}</td>
        <td>{{ item.customer_name }}</td>
        <td>{{ item.table_no }}</td>
        <td>{{ item.sales_by_name }}</td>
        <td>{{ item.serial_no }}</td>
        <td>{{ item.product_name }}</td>
        <td>{{ item.qty }}</td>
        <td>{{ item.famount }}</td>
        <td>{{ item.fcost_amount }}</td>
        <td>{{ item.fprofit }}</td>
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
  name: 'TableSalesItemByDate',
  props: ['data', 'lang', 'summary', 'langId', 'total', 'currentPage'],
  methods: {
    showDetailData(path, data) {
      this.$emit('showdetaildata', path, data)
    },
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
