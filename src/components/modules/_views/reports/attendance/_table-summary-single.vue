<template>
  <div>


    <el-table :data="data">
      <el-table-column :label="$lang[langId].date" min-width="120" prop="fdate"></el-table-column>
      <el-table-column :label="$lang[langId].employee" min-width="100" prop="employee_name"></el-table-column>
      <el-table-column :label="$lang[langId].shift_work" min-width="200" prop="fshift_datetime"></el-table-column>
      <el-table-column :label="$lang[langId].time_coming" min-width="120" prop="time_coming" />
      <el-table-column :label="$lang[langId].time_going" min-width="120" prop="time_going" />
      <el-table-column :label="$lang[langId].duration" min-width="120" prop="fduration_shift" />
      <el-table-column :label="$lang[langId].time_earlier" min-width="145" prop="ftime_earlier" />
      <el-table-column :label="$lang[langId].flated" min-width="125" prop="ftime_late" />
      <el-table-column :label="$lang[langId].left_early" min-width="140" prop="fcome_home_early" />
      <el-table-column :label="$lang[langId].fOvertime" min-width="120" prop="fovertime" />
      <el-table-column :label="$lang[langId].note" min-width="120" prop="note" />

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

