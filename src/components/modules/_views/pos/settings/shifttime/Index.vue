<template>
  <div v-loading="loading">
    <el-row :gutter="20">
      <el-col :md="18">
        <el-card class="box-card">
          <div slot="header" class="table-handler-flex">
            <h4 style="flex-grow: 1;">{{ lang.shift_timing }}</h4>
            <div>
              <router-link :to="{ path: '/pos-settings/shifttime/create' }">
                <button-action-authenticated :permission="['settings/shifttime', 'store']" type="success" icon="el-icon-plus">
                  {{ lang.add }}
                </button-action-authenticated>
              </router-link>
            </div>
          </div>

          <div class="card-body">
            <div v-if="!showTable" class="no-product">
              <p>{{ $lang[langId].no_data }}</p>
              <img src="/static/img/no-data.svg" alt="No Data Picture">
            </div>

            <div v-else>
              <el-table :data="data" stripe v-loading="loading" @sort-change="changeSortTable">
                <el-table-column :label="lang.name+' '+lang.shift" sortable prop="name" min-width="160">
                  <template slot-scope="props">
                    <div v-if="!props.row.name">
                      <p>-</p>
                    </div>
                    <div v-else>
                      <p>{{ props.row.name }}</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column :label="lang.start" sortable prop="start_time" min-width="160">
                  <template slot-scope="props">
                    <div v-if="!props.row.start_time">
                      <p>-</p>
                    </div>
                    <div v-else>
                      <p>{{ props.row.start_time }}</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column :label="lang.end" sortable prop="end_time" min-width="160">
                  <template slot-scope="props">
                    <div v-if="!props.row.end_time">
                      <p>-</p>
                    </div>
                    <div v-else>
                      <p>{{ props.row.end_time }}</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column :label="$lang[langId].action" min-width="140">
                  <template slot-scope="scope">
                    <button-action-authenticated :permission="['settings/shifttime', 'destroy']" icon="el-icon-delete" @click="showDeleteDialog(scope.row)" />
                  </template>
                </el-table-column>
              </el-table>

              <div class="block text-center">
                <el-pagination
                  @size-change="changePageTable"
                  @current-change="changeCurrentPage"
                  :current-page.sync="params.currentPage"
                  :page-size="params.per_page"
                  layout="prev, pager, next, jumper"
                  :total="params.total"
                />
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="deleteDialog" width="50%" center :close-on-click-modal="false" :show-close="false">
        <span slot="title">
          <svg-icon icon-class="alert-triangle" style="stroke: #F44336;" />
          {{ lang.notif_warn }}
        </span>
        <div class="text-center">
          <p>{{ $lang[langId].are_you_want_remove }}
            <span style="font-weight: bold;">"{{ deleteData.name }}"</span>
          </p>
          <p style="color: #AFB0AF;">{{ $lang[langId].info_delete_item }}</p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelDeleteDialog">{{ lang.cancel }}</el-button>
          <el-button type="danger" @click="deleteHandle">{{ $lang[langId].delete }}</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
const apiEndPoint = 'shifttime/'

export default {
  name: 'PosShiftTime',
  data: function() {
    return {
      loading: true,
      data: {},
      showTable: false,
      deleteDialog: false,
      deleteData: {},
      params: {
        total: null,
        currentPage: 1,
        sort_column: 'id',
        sort_type: 'desc',
        per_page: 5,
        page: 1,
        store: null,
        search_column: null,
        search_text: ''
      }
    }
  },

  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    token() {
      return this.$store.state.user.token
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    }
  },

  watch: {
    '$store.getters.selectedStore': function() {
      this.getData()
    }
  },

  methods: {
    getData() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint),
        params: this.params,
        headers: headers
      })
        .then(response => {
          this.data = response.data.data
          this.params.total = response.data.meta.total
          // this.data.map(row => {
          //   row.start_time = moment(row.start_time).format('DD MMM YYYY | HH:mm:ss')
          //   row.end_time = moment(row.end_time).format('DD MMM YYYY | HH:mm:ss')
          // })
          this.loading = false
          this.showTable = true
        })
        .catch(() => {
          this.data = []
          this.params.total = 0
          this.showTable = false
          this.loading = false
        })
    },
    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      console.log(val)
      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.getData()
    },
    changePageTable(val) {
      this.params.per_page = val
      this.getData()
    },
    changeCurrentPage(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getData()
    },
    showDeleteDialog(row) {
      this.deleteData = row
      this.deleteDialog = true
    },
    cancelDeleteDialog() {
      this.deleteData = {}
      this.deleteDialog = false
    },
    deleteHandle() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let id = this.deleteData.id

      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + 'delete/' + id),
        headers: headers
      })
        .then(response => {
          this.result = response.data
          if (response.data.status === 200) {
            this.responseDelete = response.data.data
            this.$message({
              message: 'Success',
              type: 'success'
            })
          }
          this.loading = false
          this.deleteDialog = false
          this.getData()
        })
        .catch(error => {
          this.$message({
            message: 'Error',
            type: 'error'
          })
          this.loading = false
          this.deleteDialog = false
          console.log(error)
        })
    }
  },

  mounted() {
    this.getData()
  }
}
</script>
