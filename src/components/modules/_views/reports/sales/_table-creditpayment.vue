<template>
  <div>
    <div class="summary">
      <h5>{{ $lang[langId].summary }}</h5>
      <el-table :data="summary" border>
        <el-table-column :label="$lang[langId].currency" prop="currency_id" />
        <el-table-column min-width="140px" :label="lang.payment_amount" prop="fpayment_amount" />
      </el-table>
    </div>

    <hr/>

    <el-table :data="data" border>
      <el-table-column :label="lang.received_by" prop="user_name" min-width="180px" />
      <el-table-column min-width="190px" :label="lang.payment_date" prop="fpayment_date" />
      <el-table-column min-width="140px" :label="lang.order_no" prop="order_no">
        <template slot-scope="scope">
          <!-- <router-link :to="{ path: '/sales/openorder/' + scope.row.id, query: {'rpt': true, 'path': 'salesdetails'} }">
            {{ scope.row.order_no }}
          </router-link> -->
          <el-button
            v-if="$store.getters.webviewMode"
            type="text"
            @click="showDetailData({path: '/sales/completeorder/' + scope.row.order_id ? scope.row.order_id : scope.row.id, query: {'rpt': true, 'path': 'creditpayment'}},{...scope.row})">
            {{ scope.row.order_no }}
          </el-button>
          <router-link
            v-else
            :to="{path: '/sales/completeorder/' + scope.row.order_id, query: {'rpt': true, 'path': 'creditpayment'}}">
            {{ scope.row.order_no }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column min-width="140px" :label="lang.payment_methods" prop="payment_mode_name" >
        <template slot-scope="scope">
          {{ scope.row.payment_mode_name !== null ? scope.row.payment_mode_name : scope.row.payment_type_name }}
        </template>
      </el-table-column>
      <el-table-column min-width="140px" :label="lang.payment_amount" prop="fpayment_amount" />
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
