<template>
  <div>
    <div class="summary">
      <h5>{{ $lang[langId].summary }}</h5>
      <el-table :data="summary" border>
        <el-table-column :label="$lang[langId].currency" prop="currency_id" />
        <el-table-column min-width="140px" :label="lang.sales_amount" prop="ftotal_amount" />
        <el-table-column min-width="140px" :label="$lang[langId].total_payment" prop="ftotal_amount" />
        <!-- <el-table-column min-width="140px" :label="lang.sales_amount + ' - ' + lang.shipping_cost" prop="ftotal_without_shipping" /> -->
      </el-table>
    </div>

    <hr/>

    <el-table :data="data">
      <el-table-column :label="lang.order_no" prop="order_no" />
      <el-table-column :label="lang.payment_date" prop="fpayment_date"  min-width="100px"/>
      
      <el-table-column :label="lang.customer" prop="customer" min-width="100px">
        <template slot-scope="scope">
          {{ scope.row.customer_name }}
          <p>{{ scope.row.customer_email }}</p>
        </template>
      </el-table-column>
      <el-table-column :label="$lang[langId].payment_method" prop="payment_mode_name" />
      <el-table-column :label="$lang[langId].order_source_name" prop="order_source_name" />
      
      <el-table-column :label="$lang[langId].total_payment" prop="fpayment_amount" min-width="140px"/>
      <!-- <el-table-column :label="lang.sales_amount + ' - ' + lang.shipping_cost" prop="ftotal_without_shipping" min-width="140px" /> -->
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
  name: 'TablePaymentdetail',
  props: ['data', 'lang', 'summary', 'langId', 'total'],
  methods: {
    handleChangePage(page) {
      this.$emit('changePage', page)
    },
    handleChangeSizePage(page) {
      this.$emit('changeSizePage', page)
    },

    showOpenorder (data) {
      this.$router.push('/sales/openorder/' + data.id)
    },
    showDetailData(path, data) {
      console.log('aaaa')
      this.$emit('show', path, data)
    },
  }
}
</script>
