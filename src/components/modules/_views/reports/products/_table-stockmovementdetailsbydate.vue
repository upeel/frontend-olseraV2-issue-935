<template>
  <div>
    <el-table :data="data">
      <el-table-column :label="lang.date" width="160px" prop="created_time" />
      <el-table-column width="140px" :label="$lang[langId].ref_no" prop="ref_no">
        <template slot-scope="scope">{{ scope.row.type }} <br> {{ scope.row.ref_no }}</template>
      </el-table-column>
      <el-table-column
        :label="lang.product"
        width="200px"
        prop="product_group_name">
        <template slot-scope="scope">
          <div><strong>{{ scope.row.product_name }}</strong></div>
          <div v-if="scope.row.product_variant_id">{{ scope.row.product_variant_name }}</div>
          <span style="font-size: 10px;">
            {{ scope.row.product_group_name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="lang.sku" prop="product_sku">
        <template slot-scope="scope">
          <strong>{{ scope.row.product_sku }}</strong><br>
          <span v-if="scope.row.product_variant_sku" style="font-size: 10px;">
            {{ scope.row.product_variant_sku }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="lang.beginning" prop="beginning_qty" />
      <el-table-column :label="lang.incoming" prop="incoming_qty" />
      <el-table-column :label="lang.incoming" prop="incoming_qty" />
      <el-table-column :label="lang.outgoing" prop="outgoing_qty" />
      <el-table-column :label="lang.balance" prop="balance_qty" />
      <el-table-column :label="lang.subtotal" prop="movement_amount" />
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
  name: 'TableStocksMovement',
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
