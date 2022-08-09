<template>
  <div>
    <div v-if="summary.length > 0" class="summary">
      <h5>{{ $lang[langId].summary }}</h5>
      {{ lang.total }}: {{ summary[0].ftotal_amount }}<br/>
    </div>

    <el-table :data="data">
      <el-table-column label="Supplier" prop="supplier_name" min-width="130px" />
      <el-table-column label="email" prop="supplier_email" min-width="130px" />
      <el-table-column :label="lang.total" prop="ftotal_amount" />
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
  name: 'TableBysupplier',
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

