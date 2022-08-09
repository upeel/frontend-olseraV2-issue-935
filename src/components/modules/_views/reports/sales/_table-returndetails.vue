<template>
  <div>
    <div class="summary">
      <h5>{{ $lang[langId].summary }}</h5>
      <el-table :data="summary" border>
        <el-table-column :label="$lang[langId].currency" prop="currency_id" />
        <el-table-column min-width="140px" :label="lang.return_totals" prop="ftotal_amount" />
        <el-table-column min-width="140px" :label="lang.product_cost" prop="ftotal_cost_amount" />
      </el-table>
    </div>

    <hr/>

    <el-table :data="data" border>
      <el-table-column min-width="190px" :label="lang.order_no" prop="order_no">
        <template slot-scope="scope">
          <el-button type="text" @click="showDetailData(
              {path: '/sales/openorder/' + scope.row.id,query: {'rpt': true, 'path': 'returndetails'}},
              {...scope.row}
            )">
            {{ scope.row.order_no }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column min-width="190px" :label="lang.return_date" prop="freturn_date" />
      <el-table-column min-width="140px" :label="lang.proceed_by">
        <template slot-scope="scope">
          {{ scope.row.return_by_name }}
        </template>
      </el-table-column>
      <el-table-column min-width="140px" :label="lang.customer" prop="customer_name" />
      <el-table-column min-width="140px" :label="lang.amount" prop="ftotal_amount" />
      <el-table-column min-width="140px" :label="lang.product_cost" prop="ftotal_cost_amount" />
      <el-table-column min-width="140px" :label="lang.notes" prop="notes" />
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
