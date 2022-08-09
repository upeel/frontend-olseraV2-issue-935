<template>
  <div>
    <el-table :data="data">
      <el-table-column type="expand" min-width="20px">
        <template slot-scope="props">
          <div v-if="props.row.products.length > 0">
            <el-table :data="props.row.products" >
              <el-table-column prop="product_name" :label="lang.name">
              </el-table-column>
              <el-table-column prop="total_qty" :label="lang.sold_qty">
              </el-table-column>
              <el-table-column prop="ftotal_amount" width="120px" :label="lang.sales_amount">
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="lang.name" prop="product_combo_name" />
      <el-table-column :label="lang.sold_qty" prop="total_qty" />
      <el-table-column :label="lang.sales_amount" width="120px" prop="ftotal_amount" />
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
  name: 'TableCombo',
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

