<template>
  <div>
    <div class="summary">
      <h5>{{ $lang[langId].summary }}</h5>
      <bs-table
        :header="[
          lang.earned_amount,
          $lang[langId].total_deposit
        ]">
        <tr
          v-for="(item, key) in summary"
          :key="key">
          <td>{{ item.ftotal_earned_amount }}</td>
          <td>{{ item.ftotal_payable_amount }}</td>
        </tr>
      </bs-table>
    </div>

    <hr/>

    <bs-table
      :header="[
        'Id ' + lang.customer,
        lang.customer_name,
        lang.customer_email,
        lang.transaction_no,
        lang.transaction_type,
        lang.transaction_date,
        lang.earned_amount,
        $lang[langId].total_deposit
      ]">
      <tr
        v-for="(item, key) in data"
        :key="key">
        <td min-width="180px" >{{ item.id }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.email }}</td>
        <td>{{ item.transaction_no }}</td>
        <td>{{ item.transaction_type_desc }}</td>
        <td>{{ item.ftransaction_date }}</td>
        <td>{{ item.fearned_amount }}</td>
        <td>{{ item.fpayable_amount }}</td>
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
