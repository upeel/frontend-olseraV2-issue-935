<template>
  <div>


    <el-table :data="data" border>
      <el-table-column min-width="100px" :label="lang.remark" prop="remark">
      
      
        
      </el-table-column>
      <el-table-column min-width="100px" :label="this.$lang[this.$store.state.userStores.langId].devices" prop="device_id"></el-table-column>
      <el-table-column min-width="140px" :label="lang.sales_date" prop="forder_time" />
      <el-table-column min-width="140px" :label="this.$lang[this.$store.state.userStores.langId].customer_id" prop="customer_id" />
      <el-table-column min-width="180px" :label="this.$lang[this.$store.state.userStores.langId].customer_name" prop="customer_name" />
      
      <el-table-column min-width="100px" :label="this.$lang[this.$store.state.userStores.langId].table_no" prop="table_no" />
      <el-table-column min-width="140px" :label="this.$lang[this.$store.state.userStores.langId].serve_by_name" prop="serve_by_name" />
      <el-table-column min-width="100px" :label="lang.serial_no" prop="serial_no" />
      <el-table-column min-width="100px" :label="this.$lang[this.$store.state.userStores.langId].item_name" prop="item_name" />
      <el-table-column min-width="100px" :label="lang.qty" prop="qty" />
      <el-table-column min-width="100px" :label="this.$lang[this.$store.state.userStores.langId].famount" prop="famount" />
      
      <!-- this.$lang[this.$store.state.userStores.langId] -->
      
      

      

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
  name: 'TableDetailposunpaidvoid',
  props: ['data', 'lang', 'summary', 'langId', 'total'],
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
