<template>
  <div>

    <el-table :data="data">
      <el-table-column :label="$lang[langId].employee" min-width="120" prop="employee_name"></el-table-column>
      <el-table-column :label="$lang[langId].duration" min-width="180" prop="fduration" />
      <el-table-column :label="$lang[langId].overtime" min-width="180" prop="fovertime" />
      <el-table-column :label="$lang[langId].time_earlier" min-width="180" prop="ftime_earlier" />
      <el-table-column :label="$lang[langId].time_late" min-width="180" prop="ftime_late" />
      <el-table-column :label="$lang[langId].left_early" min-width="180" prop="fcome_home_early" />
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
  name: 'TableReportsPresence',
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
    }
  }
}
</script>
