<template>
  <div class="main-content">
    <div class="table-handler-flex">
      <div class="flex-grow-1">
        <h4 class="main-content__title">{{ $lang[langId].list }} {{ lang.page }}</h4>
        <p class="mbin-content__subtitle">{{ params.total }} {{ lang.page }}</p>
      </div>
      <button-action-authenticated
        :permission="['website/pages', 'store']"
        type="success"
        icon="el-icon-plus"
        @click="formHandle('add')">
        {{ lang.add }}
      </button-action-authenticated>
    </div>

    <div class="table-handler-flex">
      <div class="mb-4 flex-grow-1">
        <el-select
          v-model="params.per_page"
          :placeholder="lang.please_select"
          size="small"
          filterable
          @change="changePageTable">
          <el-option v-for="item in pages" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="mb-4">
        <el-input
          clearable
          :placeholder="lang.search"
          prefix-icon="el-icon-search"
          v-model="searchValue"
          @change="handleSearch" size="small">
        </el-input>
      </div>
    </div>

    <el-table
      v-loading="loading"
      :data="tableData"
      stripe
      border
      class="pointer"
      @row-click="formHandle('detail', $event)"
      @sort-change="changeSortTable">
      <el-table-column
        :label="lang.title"
        sortable
        prop="title">
        <template slot-scope="scope">
          <div class="flex-container">
            <div class="mr-4">
              <el-avatar
                v-if="scope.row.photo_xs"
                :src="scope.row.photo_xs"
                :alt="scope.row.name"
                shape="square"
              />
            </div>
            <strong>{{ scope.row.title }}</strong>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Page Builder" prop="use_builder">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.use_builder">Active</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="published"
        sortable
        :label="lang.publish">
        <template slot-scope="scope">
          <el-tag v-if="!scope.row.published" type="warning">{{ rootLang.draft }}</el-tag>
          <p v-if="scope.row.published === 1">{{ lang.published }} {{ scope.row.fcreated_time }}</p>
          <p v-else>{{ lang.not_published_yet }}</p>
        </template>
      </el-table-column>
    </el-table>

    <div class="block">
      <el-pagination
        :current-page.sync="params.currentPage"
        :page-size="params.per_page"
        :total="params.total"
        layout="prev, pager, next, jumper"
        @size-change="changePageTable"
        @current-change="changeCurrentPage"
      />
    </div>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import ItemForm from './Form'
const apiEndpoint = 'page/'
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
        per_page: 5
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
        this.$router.push({
          path: '/website/pages/static/create'
        })
      } else if (block === 'detail') {
        if (this.checkCustomPermission('website/pages', 'edit')) {
          this.$router.push({
            path: '/website/pages/static/' + item.id
          })
        }
      }
    }
  }
}
</script>
