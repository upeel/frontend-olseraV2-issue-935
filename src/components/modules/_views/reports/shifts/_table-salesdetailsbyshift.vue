<template>
  <div>
    <div class="summary">
      <h5>{{ $lang[langId].summary }}</h5>
      <el-table :data="summary" border>
        <el-table-column :label="$lang[langId].currency" prop="currency_id" />
        <el-table-column min-width="140px" :label="lang.sales_amount" prop="ftotal_amount" />
        <el-table-column min-width="140px" :label="lang.shipping + ' + ' + lang.tax" prop="ftotal_shipping_tax_amount" />
        <el-table-column min-width="140px" :label="lang.product_cost" prop="ftotal_cost_amount" />
        <el-table-column min-width="140px" :label="lang.profit" prop="fprofit_nett" />
        <el-table-column min-width="140px" :label="lang.service_charge" prop="ftotal_service_charge_amount" />
        <el-table-column :label="lang.discount" prop="ftotal_discount_amount" />
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
              {path: '/sales/openorder/' + scope.row.id,query: {'rpt': true, 'path': 'salesdetails'}},
              {...scope.row}
            )">
            {{ scope.row.order_no }}
          </el-button>
          <router-link
            v-else
            :to="{path: '/sales/openorder/' + scope.row.id,query: {'rpt': true, 'path': 'salesdetailsbyshift'}}">
            {{ scope.row.order_no }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column min-width="190px" :label="lang.date" prop="forder_date" />
      <el-table-column :label="lang.sales_by">
        <template slot-scope="scope">
          {{ scope.row.sales_by_name }} ( {{scope.row.order_source_name}} )
        </template>
      </el-table-column>
      <el-table-column :label="lang.customer" prop="customer_name" />
      <el-table-column min-width="140px" :label="lang.sales_amount" prop="ftotal_amount" />
      <el-table-column min-width="140px" :label="lang.shipping + ' + ' + lang.tax" prop="fshipping_tax_amount" />
      <el-table-column min-width="140px" :label="lang.product_cost" prop="ftotal_cost_amount" />
      <el-table-column min-width="140px" :label="lang.profit" prop="fprofit_nett" />
      <el-table-column min-width="140px" :label="lang.service_charge" prop="fservice_charge_amount" />
      <el-table-column :label="lang.discount" prop="fdiscount_amount" />
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
  name: 'TableSalesdetailsbyshift',
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
