<template>
  <div>
    <el-card class="box-card" v-if="!showForm">
      <div slot="header">
        <div class="row">
          <div class="col-sm-7">
            <h4>{{ $lang[langId].list }} {{ lang.article }}</h4>
            <p>{{ params.total }} {{ lang.article }}</p>
          </div>
          <div class="col-sm-5 text-right">
            <button-action-authenticated
              :permission="['website/articles', 'store']"
              type="success"
              icon="el-icon-plus"
              @click="formHandle('add')">
              {{ lang.add }}
            </button-action-authenticated>
          </div>
        </div>
      </div>

      <div class="card-body">
        <div class="table-handler">
          <div class="row">
            <div class="col-md-6">
              <el-select
                :placeholder="lang.please_select"
                class="inline-form"
                v-model="params.per_page"
                filterable
                size="small"
                @change="changePageTable">
                <el-option
                  v-for="item in pages"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="col-md-6 text-right">
              <el-input
                v-model="searchValue"
                :placeholder="lang.search"
                class="inline-form"
                clearable
                prefix-icon="el-icon-search"
                size="small"
                @change="handleSearch"
              />
            </div>
          </div>
        </div>

        <el-table
          :data="tableData"
          stripe
          v-loading="loading"
          class="pointer"
          @row-click="formHandle('detail', $event)"
          @sort-change="changeSortTable">
          <el-table-column
            :label="lang.title"
            sortable
            min-width="200"
            prop="title">
            <template slot-scope="scope">
              <div class="flex-container">
                <div class="mr-4">
                  <el-avatar
                    v-if="scope.row.photo_xs"
                    :src="scope.row.photo_xs"
                    :alt="scope.row.name"
                  />
                </div>
                <div>
                  <el-tag type="warning" v-if="scope.row.published === 0">{{ rootLang.draft }} </el-tag>
                  <strong>{{ scope.row.title }}</strong>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="published"
            sortable
            :label="lang.publish">
            <template slot-scope="scope">
              <p v-if="scope.row.published === 1">{{ lang.published }} {{ scope.row.fcreated_time }}</p>
              <p v-else>{{ lang.not_published_yet }}</p>
            </template>
          </el-table-column>
          <el-table-column width="50">
            <template>
              <el-button type="text" icon="el-icon-more" style="color:#575757;"></el-button>
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

    <item-form
      v-if="showForm"
      :saved="saved"
      :form-data="tmp"
      :tag-data="dataTag"
      @cancel="cancel"
      @save="saveHandle"
      @remove="deleteHandle"
    />
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import ItemForm from './Form'
const apiEndpoint = 'article/'
import { checkCustomPermission } from '@/mixins/checkCustomPermission'

export default {
  components: {
    ItemForm
  },

  mixins: [checkCustomPermission],

  data() {
    return {
      loading: false,
      showForm: false,
      tableData: [],
      dataTag: [],
      tmp: {},
      searchValue: null,
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
        per_page: 10
      },
      saved: false
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
    },
    rootLang() {
      return this.$lang[this.$store.state.userStores.langId]
    }
  },

  watch: {
    '$store.getters.selectedStore': function() {
      this.getData()
    }
  },

  mounted() {
    this.getData()
    this.getSearchTags()
  },

  methods: {
    getData() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint),
        headers: headers,
        params: this.params
      }).then(response => {
        this.tableData = response.data.data
        this.params.total = response.data.meta.total
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.params.total = 0
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
      })
    },

    getSingleData(id) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint + id),
        headers: headers
      }).then(response => {
        this.tmp = response.data.data
        this.loading = false
        this.showForm = true
      }).catch(error => {
        this.loading = false
        this.showForm = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    getSearchTags() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'article/searchtags'),
        headers: headers,
        params: {
          per_page: 100
        }
      }).then(response => {
        this.dataTag = response.data.data
        this.loading = false
      }).catch(error => {
        this.loading = false
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
      })
    },

    changePageTable(val) {
      this.params.per_page = val
      this.getData()
    },

    handleSearch(val) {
      this.params.page = 1
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
    formHandle(block, item) {
      if (block === 'add') {
        this.showForm = true
        this.tmp = {}
      } else if (block === 'detail') {
        if (this.checkCustomPermission('website/articles', 'edit')) {
          let id = item.id
          this.getSingleData(id)
        } else {
          this.$message({
            type: 'error',
            message: 'Unauthorized access'
          })
        }
      }
    },
    cancel() {
      this.showForm = false
      this.tmp = {}
      this.getData()
    },
    deleteHandle(data) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let id = data.id
      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint + id),
        headers: headers
      })
        .then(response => {
          this.result = response.data
          this.$message({
            type: 'success',
            message: 'saved'
          })
          this.loading = false
          this.showForm = false
          this.getData()
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            message: error
          })
          this.loading = false
        })
    },
    saveHandle(saveData) {
      let data = saveData
      let method = 'POST'
      let id = ''
      if (saveData.id) {
        method = 'PUT'
        id = saveData.id
      }
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method,
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint + id),
        headers: headers,
        data
      }).then(response => {
        this.tmp = {}
        this.saved = true
        this.showForm = false
        this.loading = false
        this.getData()
        this.$message({
          type: 'success',
          message: 'saved'
        })
      }).catch(error => {
        this.saved = false
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    }
  }
}
</script>
