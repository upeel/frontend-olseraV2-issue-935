<template>
  <div>
    <div class="summary">
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
    </div>

    <hr/>

    <bs-table
      :header="[
        $lang[langId].online_order_no,
        lang.order_no,
        lang.date,
        lang.sales_by,
        lang.customer,
        lang.sales_amount,
        lang.shipping + '+' + lang.tax,
        lang.product_cost,
        lang.profit,
        lang.service_charge,
        lang.discount
      ]">
      <tr
        v-for="(item, key) in data"
        :key="key">
        <td>{{ item.online_order_no }}</td>
        <td :label="lang.order_no" prop="order_no" min-width="180px" >
          <el-button type="text" @click="showDetailData(
              {path: item.status === 'Z' ? '/sales/completeorder/' + item.id : '/sales/openorder' + item.id,query: {'rpt': true, 'path': 'salesdetails'}},
              {...item}
            )">
            {{ item.order_no }}
          </el-button>
        </td>
        <td>{{ item.forder_date }}</td>
        <td>{{ item.sales_by_name }} ( {{item.order_source_name}} )</td>
        <td>{{ item.customer_name }}</td>
        <td>{{ item.ftotal_amount }}</td>
        <td>{{ item.fshipping_tax_amount }}</td>
        <td>{{ item.ftotal_cost_amount }}</td>
        <td>{{ item.fprofit_nett }}</td>
        <td>{{ item.fservice_charge_amount }}</td>
        <td>{{ item.fdiscount_amount }}</td>
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
  name: 'TableOnlineSalesdetails',
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
