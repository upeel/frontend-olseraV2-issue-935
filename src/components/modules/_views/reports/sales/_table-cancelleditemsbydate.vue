<template>
  <div>
    <div class="summary">
      <h5>{{ $lang[langId].summary }}</h5>
      <el-table :data="summary" border>
        <el-table-column :label="$lang[langId].currency" prop="currency_id" />
        <el-table-column min-width="140px" :label="lang.order_totals" prop="ftotal_amount" />
      </el-table>
    </div>

    <hr/>

    <el-table :data="data" border>
      <el-table-column :label="lang.order_no" prop="order_no" min-width="180px">
        <template slot-scope="scope">
          <!-- <router-link :to="{ path: '/sales/openorder/' + scope.row.id, query: {'rpt': true, 'path': 'salesdetails'} }">
            {{ scope.row.order_no }}
          </router-link> -->
          <el-button type="text" @click="showDetailData(
              {path: '/sales/openorder/' + scope.row.id,query: {'rpt': true, 'path': 'cancelleditemsbydate'}},
              {...scope.row}
            )">
            {{ scope.row.order_no }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column min-width="190px" :label="lang.sales_date" prop="forder_date" />
      <el-table-column min-width="140px" :label="lang.sales_by">
        <template slot-scope="scope">
          {{ scope.row.sales_by_name }}
        </template>
      </el-table-column>
      <el-table-column min-width="140px" :label="lang.item" prop="product_name" />
      <el-table-column :label="lang.qty" prop="qty" />
      <el-table-column min-width="140px" :label="lang.order_amount" prop="famount" />
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
