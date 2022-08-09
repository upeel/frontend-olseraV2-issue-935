<template>
  <div>
    <div class="summary">
      <h5>{{ $lang[langId].summary }}</h5>
      <el-table :data="summary" border>
        <el-table-column :label="$lang[langId].currency" prop="currency_id" />
        <el-table-column min-width="140px" :label="$lang[langId].total_income" prop="ftotal_income_amount" />
        <el-table-column min-width="140px" :label="$lang[langId].total_expense" prop="ftotal_expense_amount" />
        <el-table-column min-width="140px" :label="$lang[langId].total" prop="ftotal_amount" />
      </el-table>
    </div>

    <hr/>

    <el-table :data="data" border>
      <el-table-column label="No" prop="no" />
      <el-table-column min-width="120px" :label="lang.date" prop="ftrans_date" />
      <el-table-column min-width="150px" :label="lang.type" prop="trans_type_name" />
      <el-table-column min-width="140px" :label="lang.income" prop="fincome_amount" />
      <el-table-column min-width="140px" :label="lang.expense" prop="fexpense_amount" />
      <el-table-column min-width="140px" :label="lang.total" prop="famount" />
    </el-table>

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
