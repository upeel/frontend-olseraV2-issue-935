<template>
  <div>
    <el-card v-if="!showForm"  v-loading="loading" class="box-card">
      <div slot="header" class="clearfix">
        <el-row :gutter="10">
          <el-col :md="12">
            <h4>{{ lang.resellers }}</h4>
            <p>{{ params.total }} {{ lang.resellers }}</p>
          </el-col>
          <el-col :md="12" class="text-right">
            <el-button
              :disabled="disabledSave"
              size="small"
              @click="add"
              type="success"
              icon="el-icon-plus">
              {{ lang.add }}
            </el-button>
          </el-col>
        </el-row>
      </div>

      <div class="card-body">
        <div class="table-handler">
          <el-row :gutter="10">
            <el-col :md="7">
              <el-select class="inline-form"
                v-model="params.per_page"
                @change="changePageTable"
                filterable
                :placeholder="lang.please_select"
                size="small">
                <el-option
                  v-for="item in pages" :key="item.value"
                  :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :md="17" class="text-right">
              <el-input
                class="inline-form"
                clearable
                :placeholder="lang.search"
                prefix-icon="el-icon-search"
                v-model="searchValue"
                @change="handleSearch" size="small">
              </el-input>
            </el-col>
          </el-row>
        </div>

        <el-table :data="data" stripe>
          <el-table-column
            prop="name"
            :label="lang.name"
            width="180">
          </el-table-column>
          <el-table-column
            :label="this.$lang[langId].url_id"
            prop="url_id"
            width="180">
          </el-table-column>
          <el-table-column
            :label="lang.type"
            prop="type_name"
            width="120">
          </el-table-column>
          <el-table-column
            :label="lang.status"
            prop="status"
            width="80">
            <template slot-scope="scope">
              <span
                v-if="(isEditing[scope.$index] && !isEditing[scope.$index].editing) && scope.row.status !== 'PENDING'"
                class="editable"
                @click="editField(scope.row, scope.$index)">
                {{scope.row.status}}
              </span>
              <span v-else>
                {{scope.row.status}}
              </span>
              <div class="form-in-cell" v-if="isEditing[scope.$index] && isEditing[scope.$index].editing">
                <el-select
                  v-model="tmp.status"
                  size="mini">
                  <el-option value="A" label="ACTIVE"></el-option>
                  <el-option value="I" label="INACTIVE"></el-option>
                </el-select>
                <el-button size="mini" icon="el-icon-close"
                  @click="cancelManageItems(scope.$index)"
                  type="info">
                </el-button>
                <el-button size="mini" icon="el-icon-check"
                  @click="saveStatus(tmp, scope.$index)"
                  type="success">
                </el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="this.$lang[langId].active"
            prop="active_from"
            width="140">
          </el-table-column>
          <el-table-column
            :label="lang.end"
            width="140"
            prop="active_until">
          </el-table-column>

          <el-table-column
            :label="this.$lang[langId].action">
            <template slot-scope="scope">
              <el-button
                @click="edit(scope.row)"
                type="info"
                class="btn-plain"
                icon="el-icon-edit"
                size="mini">
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div style="text-align: center;">
          <el-pagination
            @size-change="changePageTable"
            @current-change="changeCurrentPage"
            :current-page.sync="params.currentPage"
            :page-size="params.per_page"
            layout="prev, pager, next, jumper"
            :total="params.total">
          </el-pagination>
        </div>
      </div>
    </el-card>

    <group-form
      v-if="showForm"
      :saved="saved"
      :loading="loading"
      :form-data="tmp"
      @save="save"
      @cancel="cancel">
    </group-form>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import GroupForm from './Form'

const apiEndPoint = 'reseller/'

export default {
  data: function() {
    return {
      loading: true,
      loadingItems: false,
      saved: false,
      data: [],
      isEditing: [],
      showForm: false,
      disabledButton: false,
      tmp: {},
      status: [
        {
          id: 'A',
          label: 'ACTIVE'
        },
        {
          id: 'I',
          label: 'INACTIVE'
        },
        {
          id: 'P',
          label: 'PENDING'
        }
      ],
      pages: [
        {
          value: 5,
          label: '5 ' + this.$store.state.userStores.lang.rows
        },
        {
          value: 10,
          label: '10 ' + this.$store.state.userStores.lang.rows
        },
        {
          value: 20,
          label: '20 ' + this.$store.state.userStores.lang.rows
        }
      ],
      params: {
        search: '',
        per_page: 10
      }
    }
  },

  components: {
    GroupForm
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
    },
    disabledSave() {
      if (this.loading) {
        return true
      } else {
        return false
      }
    }
  },

  watch: {
    '$store.getters.selectedStore': function() {
      this.getData()
    }
  },

  methods: {
    getData: function() {
      this.loading = true
      this.isEditing = []
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint),
        params: this.params,
        headers: headers
      }).then(response => {
        this.data = response.data.data
        this.data.map(item => {
          this.isEditing.push({
            editing: false
          })
          item.resellerPackage = item.type_name
          item.resellerActiveFrom = item.active_from
          item.resellerActiveUntil = item.active_until
        })
        this.params.total = response.data.meta.total
        this.loading = false
        // console.log(this.data, ':response')
      }).catch(error => {
        this.loading = false
        this.params.total = 0
        this.$notify({
          type: 'warning',
          title: 'Error',
          message: error.response.data.error.error
        })
      })
    },
    add() {
      this.showForm = true
    },
    save(data) {
      let method = 'POST'
      let verb = 'store'
      let id = ''
      if (data.reseller_store_id) {
        method = 'PUT'
        verb = 'update'
        id = data.reseller_store_id
      }

      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method,
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + verb + '/' + id),
        headers: headers,
        data
      }).then(response => {
        this.saved = true
        this.showForm = false
        this.tmp = {}
        this.getData()
        this.$message({
          type: 'success',
          message: 'saved'
        })
      }).catch(error => {
        this.saved = false
        this.loading = false
        this.isEditing = []
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    saveStatus(data, index) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + 'updatestatus' + '/' + data.reseller_store_id),
        headers: headers,
        data
      }).then(response => {
        this.cancelManageItems(index)
        this.getData()
        this.$message({
          type: 'success',
          message: 'saved'
        })
      }).catch(error => {
        this.loading = false
        this.isEditing = []
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    changePageTable(val) {
      this.params.per_page = val
      this.getData()
    },
    handleSearch(val) {
      this.params.page = 1
      this.params.currentPage = 1
      this.params.search_text = ''
      this.params.search_column = null
      this.params.search = this.searchValue
      this.getData()
    },
    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.getData()
    },
    changeCurrentPage(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getData()
    },
    edit(row) {
      this.tmp = {}
      this.tmp = Object.assign({}, row)
      this.showForm = true
    },
    editField(row, index) {
      this.isEditing.map(item => {
        item.editing = false
      })
      this.tmp = {}
      this.tmp = Object.assign({}, row)
      if (this.tmp.status === 'ACTIVE') {
        this.tmp.status = 'A'
      } else if (this.tmp.status === 'PENDING') {
        this.tmp.status = 'P'
      } else if (this.tmp.status === 'INACTIVE') {
        this.tmp.status = 'I'
      }
      // console.log(this.tmp)
      this.isEditing[index].editing = true
    },
    remove(data) {
      this.loadingItems = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + 'delete/' + data.id),
        headers
      }).then(response => {
        this.data.map((item, idx) => {
          if (item.id === data.id) {
            this.data.splice(idx, 1)
          }
        })
        this.loadingItems = false
        this.$message({
          type: 'success',
          message: response.data.data.message
        })
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loadingItems = false
      })
    },
    cancel() {
      this.tmp = {}
      this.showForm = false
    },
    cancelManageItems(index) {
      this.isEditing[index].editing = false
      this.tmp = {}
    }
  },

  mounted() {
    this.getData()
  }
}
</script>
