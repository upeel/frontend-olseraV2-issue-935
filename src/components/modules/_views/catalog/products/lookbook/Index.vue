<template>
  <div>
    <div class="main-content">
      <div class="table-handler-flex">
        <div class="flex-grow-1">
          <h4 class="main-content__title">{{ $lang[langId].list }} {{ lang.look_book }}</h4>
          <p class="main-content__subtitle">{{ params.total }} {{ lang.look_book }}</p>
        </div>
        <button-action-authenticated
          :permission="['catalog/lookbook', 'store']"
          type="primary"
          icon="el-icon-plus"
          @click="addData">
          {{ lang.add }}
        </button-action-authenticated>
      </div>

      <div class="table-handler-flex sticky-top-has-submenu">
        <div style="flex-grow: 1;">
          <el-select
            class="inline-form"
            v-model="params.per_page"
            @change="changePageTable"
            filterable
            :placeholder="lang.please_select" size="small">
            <el-option
              v-for="item in pages"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div>
          <el-input
            class="inline-form input-search"
            clearable
            :placeholder="lang.search"
            prefix-icon="el-icon-search"
            v-model="searchValue"
            @change="handleSearch" size="small">
          </el-input>
        </div>
      </div>

      <el-divider></el-divider>

      <el-table
        v-loading="loading"
        v-if="lang.name"
        :data="tableData"
        stripe
        @row-click="goToSinglePage"
        @sort-change="changeSortTable">
        <el-table-column :label="lang.name" min-width="120px">
          <template slot-scope="scope">
            <div class="flex-container">
              <el-image
                v-if="scope.row.photo_xs"
                :src="scope.row.photo_xs"
                fit="cover"
                style="width: 50px; height: 50px; border-radius: 50%; margin-right: 8px;"
              />
              <strong>{{ scope.row.name }}</strong>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="group_name"
          sortable
          :label="lang.group"
          width="220">
        </el-table-column>
        <el-table-column
          sortable
          :label="lang.status"
          width="140">
          <template slot-scope="scope">
            <template v-if="scope.row.published === 1">
              <el-tag type="success">{{ lang.publish }}</el-tag>
            </template>
            <template v-else>
              <el-tag type="info">{{ $lang[langId].draft }}</el-tag>
            </template>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        :params="params"
        @size-change="changePageTable"
        @current-change="changeCurrentPage"
      />
    </div>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import { mixinPaginationComponent } from '@/mixins/mixinPaginationComponent'

export default {
  mixins: [mixinPaginationComponent],

  data() {
    return {
      loading: true,
      tableData: [],
      statusValue: null,
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
        search: null,
        total: null,
        currentPage: 1,
        sort_column: 'id',
        sort_type: 'desc',
        per_page: 10,
        page: 1
      },
      isButtonDisabled: false
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

  mounted() {
    this.getData()
  },

  methods: {
    getData: function() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'lookbook'),
        params: this.params,
        headers: headers
      }).then(response => {
        this.tableData = response.data.data
        this.params.total = response.data.meta.total
        this.loading = false
      }).catch(error => {
        this.tableData = []
        this.params.total = 0
        this.loading = false
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data)
          console.log(error.response.status)
          console.log(error.response.headers)
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request)
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message)
        }
        console.log(error.config)
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
      console.log(val)
      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.getData()
    },
    changeCurrentPage(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getData()
    },
    addData() {
      this.$router.push({path: '/catalog/lookbook/create'})
    },
    goToSinglePage(row) {
      this.$router.push({path: '/catalog/lookbook/' + row.id})
    }
  }
}
</script>
