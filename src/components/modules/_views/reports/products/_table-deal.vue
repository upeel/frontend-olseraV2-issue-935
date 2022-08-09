<template>
  <div>
    <el-table :data="data">
      <el-table-column :label="lang.brand" prop="brand_name" />
      <el-table-column :label="lang.sold_qty" prop="total_qty" />
      <el-table-column :label="lang.sales_amount" prop="ftotal_amount" />
      <el-table-column :label="lang.comission">
        <template slot-scope="scope">
          <strong>{{ scope.row.fcomission_amount }}</strong><br/>
          {{ scope.row.comission_pct }}%
        </template>
      </el-table-column>
      <el-table-column :label="lang.profit" prop="fnett_amount" />
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
  name: 'TableDeal',
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

