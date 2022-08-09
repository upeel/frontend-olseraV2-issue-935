<template>
  <div>
    <div class="summary">
      <h5>{{ $lang[langId].summary }}</h5>
      <el-table :data="summary" border>
        <el-table-column :label="$lang[langId].currency" prop="currency_id" />
        <el-table-column :label="$lang[langId].total_order_qty" prop="ftotal_qty" />
        <el-table-column min-width="140px" :label="lang.sales_amount" prop="ftotal_amount" />
        <el-table-column min-width="140px" :label="lang.product_cost" prop="ftotal_cost_amount" />
        <el-table-column min-width="140px" :label="lang.profit" prop="ftotal_profit" />
      </el-table>
    </div>

    <hr/>

    <el-table :data="data" border>
      <el-table-column :label="lang.order_no" prop="order_no" min-width="180px" >
        <template slot-scope="scope">
          <el-button
            v-if="$store.getters.webviewMode"
            type="text"
            @click="showDetailData(
              {path: '/sales/openorder/' + scope.row.id,query: {'rpt': true, 'path': 'salesitemsbydateshift'}},
              {...scope.row}
            )">
            {{ scope.row.order_no }}
          </el-button>
          <router-link
            v-else
            :to="{path: '/sales/openorder/' + scope.row.id,query: {'rpt': true, 'path': 'salesitemsbydateshift'}}">
            {{ scope.row.order_no }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column min-width="140px" :label="lang.date" prop="forder_date" />
      <el-table-column :label="lang.sales_by">
        <template slot-scope="scope">
          {{ scope.row.sales_by_name }} ( {{scope.row.order_source_name}} )
        </template>
      </el-table-column>
      <el-table-column :label="lang.item">
        <template slot-scope="scope">
          <!-- {{ scope.row.product_name }} ( {{scope.row.product_variant_name}} ) -->
          {{ scope.row.item_name }}
        </template>
      </el-table-column>
      <el-table-column :label="lang.qty" prop="qty" />
      <el-table-column min-width="140px" :label="lang.sales_amount" prop="famount" />
      <el-table-column min-width="140px" :label="lang.product_cost" prop="fcost_amount" />
      <el-table-column min-width="140px" :label="lang.profit" prop="fprofit" />
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
  name: 'TableSalesitemsbydateshift',
  props: ['data', 'lang', 'summary', 'langId', 'total'],
  methods: {
    showDetailData(path, data) {
      this.$emit('showdetaildata', path, data)
    },
    handleChangePage(page) {
      this.$emit('changePage', page)
    },
    handleChangeSizePage(page) {
      this.$emit('changeSizePage', page)
    }
  }
}
</script>
