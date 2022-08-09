<template>
  <div>
    <div class="summary">
      <h5>{{ $lang[langId].summary }}</h5>
      <bs-table
        :header="[
          $lang[langId].currency,
          lang.sales_amount,
          lang.discount_amount,
          lang.total
        ]">
        <tr
          v-for="(item, key) in summary"
          :key="key">
          <td>{{ item.currency_id }}</td>
          <td>{{ item.ftotal_gross_amount }}</td>
          <td>{{ item.ftotal_discount }}</td>
          <td>{{ item.ftotal_nett_amount }}</td>
        </tr>
      </bs-table>
    </div>

    <hr/>

    <bs-table
      :header="[
        lang.order_no,
        lang.sales_date,
        lang.sales_by,
        lang.item,
        lang.qty,
        lang.amount,
        lang.discount,
        lang.total
      ]">
      <tr
        v-for="(item, key) in data"
        :key="key">
        <td>
          <el-button v-if="$store.getters.webviewMode" type="text" @click="showDetailData(
              {path: item.status === 'Z' ? '/sales/completeorder/' + item.id : '/sales/openorder' + item.id,query: {'rpt': true, 'path': 'salesitemdiscountsbydate'}},
              {...item}
            )">
            {{ item.order_no }}
          </el-button>
          <router-link v-else :to="{path: item.status === 'Z' ? '/sales/completeorder/' + item.id : '/sales/openorder' + item.id,query: {'rpt': true, 'path': 'salesitemdiscountsbydate'}}">
            {{ item.order_no }}
          </router-link>
        </td>
        <td>{{ item.forder_date }}</td>
        <td>{{ item.sales_by_name }}</td>
        <td>{{ item.product_name }}</td>
        <td>{{ item.qty }}</td>
        <td>{{ item.fgross_amount }}</td>
        <td>{{ item.fdiscount }}</td>
        <td>{{ item.fnett_amount }}</td>
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
  name: 'TableSalesdetails',
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
