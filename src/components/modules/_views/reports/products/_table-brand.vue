<template>
  <div>
    <bs-table
      :header="[lang.brand, lang.sold_qty, lang.sales_amount, lang.comission, lang.profit]">
      <tr
        v-for="(item, key) in data"
        :key="key">
        <td>{{ item.brand_name }}</td>
        <td>{{ item.total_qty }}</td>
        <td>{{ item.ftotal_amount }}</td>
        <td>
          <strong>{{ item.fcomission_amount }}</strong><br/>
          {{ item.comission_pct }}%
        </td>
        <td>{{ item.fnett_amount }}</td>
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
  name: 'TableBrand',
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

