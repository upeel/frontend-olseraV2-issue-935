<template>
  <div>
    <div v-if="summary.length > 0" class="summary">
      <h5>{{ $lang[langId].summary }}</h5>
      {{ lang.subtotal }}: {{ summary[0].ftotal_subtotal }}<br/>
      {{ lang.discount }}: {{ summary[0].ftotal_discount_amount }}<br/>
      {{ lang.shipping }}: {{ summary[0].ftotal_shipping_amount }}<br/>
      {{ lang.tax }}: {{ summary[0].ftotal_tax_amount }}<br/>
      {{ lang.total }}: {{ summary[0].ftotal_amount }}<br/>
    </div>

    <bs-table
      :header="[
        lang.purchase_no,
        lang.date,
        lang.purchase_by,
        lang.supplier,
        lang.subtotal,
        lang.discount,
        lang.shipping,
        lang.tax,
        lang.total
      ]">
      <tr
        v-for="(item, key) in data"
        :key="key">
        <td>
          <el-button v-if="$store.getters.webviewMode" type="text" @click="showDetailData(
              { path: '/purchase/openpurchase/' + item.id, query: {'rpt': true, 'path': 'purchase'} },
              { ...item }
            )">
            {{ item.purchase_no }}
          </el-button>
          <router-link
            v-else
            type="text"
            :to="{ path: '/purchase/openpurchase/' + item.id, query: {'rpt': true, 'path': 'purchase'}}">
            {{ item.purchase_no }}
          </router-link>
        </td>
        <td>{{ item.fpurchase_date }}</td>
        <td>
          <strong>{{ item.purchase_by_name }}</strong><br/>
          {{ item.purchase_by_email }}
        </td>
        <td>{{ item.supplier_name }}</td>
        <td>{{ item.fsubtotal }}</td>
        <td>{{ item.fdiscount_amount }}</td>
        <td>{{ item.shipping_cost }}</td>
        <td>{{ item.ftax_amount }}</td>
        <td>{{ item.ftotal_amount }}</td>
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
</template>

<script>
export default {
  name: 'TableDetail',
  props: ['data', 'lang', 'summary', 'total'],
  computed: {
    langId() {
      return this.$store.state.userStores.langId
    }
  },
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

