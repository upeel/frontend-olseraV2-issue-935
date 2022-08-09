<template>
  <div>
    <div class="summary">
      <h5>{{ $lang[langId].summary }}</h5>
      <el-table :data="summary" border>
        <el-table-column :label="$lang[langId].currency" prop="currency_id" />
        <el-table-column min-width="140px" :label="lang.amount" prop="ftotal_amount" />
      </el-table>
    </div>

    <hr/>

    <el-table :data="data">
      <!-- <el-table-column :label="lang.payment_mode" prop="payment_type" /> -->
      <el-table-column :label="lang.payment_mode" prop="payment_type" min-width="120px">
        <template slot-scope="scope">
          <template
            v-if="scope.row.detail && scope.row.detail.length">
            <div>
              {{ scope.row.payment_type }}
            </div>
            <div
              v-for="(item, key) in scope.row.detail"
              :key="key"
              class="overflow-ellipsis pl-8">
              {{ item.payment_type }}
            </div>
          </template>
          <template v-else>
            {{ scope.row.payment_type }}
          </template>
        </template>
      </el-table-column>
      <el-table-column :label="lang.bank_account" prop="bank_account_no">
        <template slot-scope="scope">
          <template
            v-if="scope.row.detail && scope.row.detail.length">
            <div
              v-for="(item, key) in scope.row.detail"
              :key="key"
              class="overflow-ellipsis pl-8">
              {{ item.bank_name ? '(' + item.bank_name + ')' : '' }} {{ item.bank_account_no }}
            </div>
          </template>
          <template v-else>
            {{ scope.row.bank_name ? '(' + scope.row.bank_name + ')' : '' }} {{ scope.row.bank_account_no }}
          </template>
        </template>
      </el-table-column>
      <el-table-column :label="lang.amount" prop="ftotal_amount" align="right">
        <template slot-scope="scope">
          <template
            v-if="scope.row.detail && scope.row.detail.length">
            <div>
              {{ scope.row.ftotal_amount }}
            </div>
            <div
              v-for="(item, key) in scope.row.detail"
              :key="key"
              class="overflow-ellipsis pl-8">
              {{ item.ftotal_amount_not_currency }}
            </div>
          </template>
          <template v-else>
            {{ scope.row.ftotal_amount }}
          </template>
        </template>
      </el-table-column>
      <!-- <el-table-column :label="lang.bank_account" prop="bank_account_no" /> -->
      <!-- <el-table-column :label="lang.amount" prop="ftotal_amount" /> -->
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
  name: 'TablePaymentbymode',
  props: ['data', 'lang', 'summary', 'langId', 'total'],
  methods: {
    handleChangePage(page) {
      this.$emit('changePage', page)
    },
    handleChangeSizePage(page) {
      this.$emit('changeSizePage', page)
    }
  }
}
</script>

