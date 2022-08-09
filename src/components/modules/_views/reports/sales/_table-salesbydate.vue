<template>
  <div>
    <div
      v-for="(item, key) in data"
      :key="key"
      class="report-item">
      <h4>{{ item.supplier_name }}</h4>
      <div class="summary">
        <h5>{{ $lang[langId].summary }}</h5>
        {{ lang.amount }}: {{ item.ftotal_amount }}<br/>
        {{ lang.sales_source }}: {{ item.order_source_name }}<br/>
      </div>
      <bs-table
        :header="[
          lang.date,
          lang.amount
        ]">
        <tr
          v-for="(item, key) in item.detail"
          :key="key">
          <td>{{ item.forder_date }}</td>
          <td>{{ item.ftotal_amount }}</td>
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
  </div>
</template>

<script>
export default {
  name: 'TableOutstandingPayment',
  props: ['data', 'langId', 'lang', 'total'],
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
