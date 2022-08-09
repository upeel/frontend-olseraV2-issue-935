<template>
  <div>
    <div
      v-for="(item, key) in data"
      :key="key"
      class="report-item"
      style="margin-bottom: 40px;">
      <h4>{{ item.supplier_name }}</h4>
      <div class="summary">
        <h5>{{ $lang[langId].summary }}</h5>
        {{ lang.amount }}: {{ item.ftotal_amount }}<br/>
        {{ lang.paid }}: {{ item.fpaid_amount }}<br/>
        {{ lang.outstanding }}: {{ item.foutstanding_amount }}<br/>
      </div>
      <bs-table
        :header="[
          lang.purchase_no,
          lang.date,
          lang.supplier,
          lang.amount,
          lang.paid,
          lang.outstanding
        ]">
        <tr
          v-for="(item, key) in item.purchases"
          :key="key">
          <td min-width="150px" :label="lang.purchase_no" prop="purchase_no" >
            <el-button
              v-if="$store.getters.webviewMode"
              type="text"
              @click="showDetailData(
                { path: '/purchase/openpurchase/' + item.id, query: {'rpt': true, 'path': 'unpaiddetails'} },
                { ...item }
              )">
              {{ item.purchase_no }}
            </el-button>
            <router-link
              v-else
              type="text"
              :to="{ path: '/purchase/openpurchase/' + item.id, query: {'rpt': true, 'path': 'unpaiddetails'}}">
              {{ item.purchase_no }}
            </router-link>
          </td>
          <td>{{ item.fpurchase_date }}</td>
          <td>{{ item.supplier_name }}</td>
          <td>{{ item.ftotal_amount }}</td>
          <td>{{ item.fpaid_amount }}</td>
          <td>{{ item.foutstanding_amount }}</td>
        </tr>
      </bs-table>

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
  </div>
</template>

<script>
export default {
  name: 'TableOutstandingPayment',
  props: ['data', 'langId', 'lang', 'total'],
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
