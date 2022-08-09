<template>
  <div>
    <div class="summary">
      <h5>{{ $lang[langId].summary }}</h5>
      <el-table :data="summary" border>
        <el-table-column :label="$lang[langId].currency" prop="currency_id" />
        <el-table-column min-width="140px" :label="$lang[langId].total_expense" prop="ftotal_amount" />
      </el-table>
    </div>

    <hr/>

    <el-table :data="data" border>
      <el-table-column :label="lang.transaction_no" prop="trans_no" min-width="180px" />
      <el-table-column min-width="190px" :label="lang.date" prop="ftrans_date" />
      <el-table-column :label="lang.type" prop="trans_type_name" />
      <el-table-column :label="lang.staff" prop="user_name" />
      <el-table-column min-width="140px" :label="lang.description" prop="notes" />
      <el-table-column min-width="140px" :label="lang.amount" prop="famount" />
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
