<template>
  <div>
    <div v-if="summary.length > 0" class="summary">
      <h5>{{ $lang[langId].summary }}</h5>
      {{ lang.total }}: {{ summary[0].ftotal_amount }}<br/>
    </div>

    <bs-table
      :header="[
        lang.purchase_no,
        lang.purchase_date,
        lang.purchase_by,
        'item',
        'qty',
        lang.price,
        lang.amount
      ]">
      <tr
        v-for="(item, key) in data"
        :key="key">
        <td>
          <el-button
            type="text"
            @click="showDetailData(
              { path: '/purchase/openpurchase/' + item.id, query: {'rpt': true, 'path': 'purchase'} },
              { ...item }
            )">
            {{ item.purchase_no }}
          </el-button>
        </td>
        <td>{{ item.fpurchase_date }}</td>
        <td>{{ item.purchase_by_name }}</td>
        <td>{{ item.item_name }}</td>
        <td>{{ item.qty }}</td>
        <td>{{ item.fprice }}</td>
        <td>{{ item.famount }}</td>
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
  name: 'TableItemsBydate',
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


