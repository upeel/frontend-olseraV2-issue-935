<template>
  <div>
    <div v-if="summary.length > 0" class="summary">
      <h5>{{ $lang[langId].summary }}</h5>
      <p v-for="(item, idx) in summary" :key="idx">{{ lang.total }}: {{ item.ftotal_amount }} </p>
    </div>

    <bs-table
      :header="[
        lang.date,
        lang.total
      ]">
      <tr
        v-for="(item, key) in data"
        :key="key">
        <td>{{ item.fpurchase_date }}</td>
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
  name: 'TableBydate',
  props: ['data', 'lang', 'summary', 'total'],
  computed: {
    langId() {
      return this.$store.state.userStores.langId
    }
  },
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
