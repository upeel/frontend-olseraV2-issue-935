<template>
  <div>
    <div style="margin-bottom: 10px">
      <el-button class="el-icon-back" @click="getBack" />
    </div>
    <div class="summary">
      <h5>{{ $lang[langId].summary }}</h5>
      <el-table :data="summary" border>
        <el-table-column :label="lang.sold_qty" prop="ftotal_qty" />
        <el-table-column :label="lang.sales_amount" prop="ftotal_amount" />
        <el-table-column :label="lang.total_cost" prop="ftotal_cost_amount" />
        <el-table-column :label="lang.profit" prop="ftotal_profit" />
      </el-table>
    </div>
    <bs-table
      :header="[lang.order_no, lang.date, lang.sales_by, lang.customer, lang.item, lang.qty, lang.sales_amount, lang.product_cost, lang.profit]">
      <tr
        v-for="(item, itemKey) in data"
        :key="itemKey">
        <td>
          <el-button v-if="$store.getters.webviewMode" type="text" @click="showDetailData(
              {path: item.status === 'Z' ? '/sales/completeorder/' + item.id : '/sales/openorder/' + item.id,
              query: {'rpt': true, 'path': 'creditsalesdetails'}},
              {...item}
            )">
            {{ item.order_no }}
          </el-button>
          <router-link v-else :to="{path: item.status === 'Z' ? '/sales/completeorder/' + item.id : '/sales/openorder/' + item.id, query: {'rpt': true, 'path': 'creditsalesdetails'}}">
            {{ item.order_no }}
          </router-link>
        </td>
        <td>{{ item.forder_date }}</td>
        <td>{{ item.sales_by_name }} ( {{item.order_source_name}} )</td>
        <td>{{ item.customer_name }}</td>
        <td>{{ item.product_name }} ( {{item.product_variant_name}} )</td>
        <td>{{ item.qty }}</td>
        <td>{{ item.famount }}</td>
        <td>{{ item.fcost_amount }}</td>
        <td>{{ item.fprofit }}</td>
      </tr>
    </bs-table>

    <div v-if="total > 0" class="table-handler-bottom">
      <el-pagination
          :total="total"
          :page-sizes="[50, 100]"
          :page-size="50"
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
  name: 'TableCategoryDetail',
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
    },
    getBack() {
      this.$emit('back')
    }
  }
}
</script>
