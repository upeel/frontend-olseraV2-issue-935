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
        lang.order_no,
        lang.date,
        lang.subtotal,
        lang.tax,
        lang.service_charge,
        rootLang.rounded,
        lang.paid_amount,
        lang.void
      ]">
      <template v-if="data.length > 0">
        <tr
          v-for="(item, key) in data"
          :key="key">
          <td>{{ item.order_no }}</td>
          <td>{{ item.forder_time }}</td>
          <td class="text-right">{{ item.fsubtotal }}</td>
          <td class="text-right">{{ item.ftax }}</td>
          <td class="text-right">{{ item.fservice_charge }}</td>
          <td class="text-right">{{ item.frounding }}</td>
          <td class="text-right">{{ item.fpaid_amount }}</td>
          <td class="text-center">{{ item.voided }}</td>
        </tr>
      </template>
      <template v-else>
        <tr class="full-width text-center p-8" style="height: 200px">
          <td colspan="7">{{ rootLang.no_data }}</td>
        </tr>
      </template>
    </bs-table>

    <div v-if="total > 0" class="table-handler-bottom">
      <el-pagination
        :total="total"
        :page-sizes="[15, 50, 100]"
        :page-size="params.per_page"
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
import basicComputedMixin from '@/mixins/basicComputedMixin'
export default {
  name: 'TableSalesdetailsTaxRole',
  props: ['data', 'lang', 'summary', 'langId', 'total', 'currentPage', 'params'],
  mixins: [basicComputedMixin],
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
