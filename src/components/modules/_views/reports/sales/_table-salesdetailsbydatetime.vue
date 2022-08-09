<template>
  <div>
    <div class="choose-time" style="padding-bottom: 40px; margin-bottom: 40px; border-bottom: 1px solid #ddd;">
      <el-date-picker
        v-model="start_time"
        type="datetime"
        placeholder="Select date and time">
      </el-date-picker>

      <el-date-picker
        v-model="end_time"
        type="datetime"
        placeholder="Select date and time">
      </el-date-picker>

      <el-button type="success" @click="getData">
        {{ lang.submit }}
      </el-button>
    </div>

    <div class="summary">
      <h5>{{ $lang[langId].summary }}</h5>
      <bs-table
        :header="[
          $lang[langId].currency,
          lang.sales_amount,
          $lang[langId].shipping_plus_tax,
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
        lang.order_no,
        lang.date,
        lang.sales_by,
        lang.customer,
        lang.sales_amount,
        $lang[langId].shipping_plus_tax,
        lang.product_cost,
        lang.profit,
        lang.service_charge,
        lang.discount
      ]">
      <tr
        v-for="(item, key) in data"
        :key="key">
        <td>
          <el-button v-if="$store.getters.webviewMode" type="text" @click="showDetailData(
              {path: item.status === 'Z' ? '/sales/completeorder/' + item.id : '/sales/openorder' + item.id,query: {'rpt': true, 'path': 'salesdetailsbydatetime'}},
              {...item}
            )">
            {{ item.order_no }}
          </el-button>
          <router-link
            v-else
            :to="{ path: item.status === 'Z' ? '/sales/completeorder/' + item.id : '/sales/openorder' + item.id,
            query: {'rpt': true, 'path': 'salesdetailsbydatetime'} }">
            {{ item.order_no }}
          </router-link>
        </td>
        <td>{{ item.forder_date }}</td>
        <td>{{ item.sales_by_name }} ({{ item.order_source_name }})</td>
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
var moment = require('moment')
const startDate = moment().add(-29, 'days').format('YYYY-MM-DD HH:mm:ss')
const endDate = moment().format('YYYY-MM-DD HH:mm:ss')

export default {
  name: 'TableSalesdetailsbydatetime',
  props: ['data', 'lang', 'summary', 'langId', 'total', 'currentPage'],
  data() {
    return {
      start_time: startDate,
      end_time: endDate
    }
  },
  methods: {
    getData() {
      this.$emit('picked-time', {
        start_date: moment(this.start_time).format('YYYY-MM-DD HH:mm:ss'),
        end_date: moment(this.end_time).format('YYYY-MM-DD HH:mm:ss')
      })
    },
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
  },
  mounted() {
    this.getData()
  }
}
</script>

