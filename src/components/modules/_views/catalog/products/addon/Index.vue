<template>
  <div>
    <div class="main-content">
      <div class="table-handler-flex">
        <div style="flex-grow: 1;">
          <h4 class="main-content__title">{{ $lang[langId].list }} {{ lang.product_addon }}</h4>
          <p class="main-content__subtitle">{{ params.total }} {{ lang.product_addon }}</p>
        </div>
        <button-action-authenticated
          :permission="['catalog/prodaddon', 'store']"
          type="primary"
          icon="el-icon-plus"
          @click="addData">
          {{ lang.add }}
        </button-action-authenticated>
      </div>

      <div class="table-handler-flex sticky-top-has-submenu">
        <div style="flex-grow: 1;">
          <el-select
            v-model="params.per_page"
            :placeholder="lang.please_select"
            filterable
            class="inline-form"
            size="small"
            @change="changePageTable">
            <el-option
              v-for="item in pages"
              :key="item"
              :label="item + ' ' + $store.getters.lang.rows"
              :value="item"
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
        :data="tableData"
        stripe
        v-loading="loading"
        @row-click="goToSinglePage"
        @sort-change="changeSortTable">
        <el-table-column prop="name" :label="lang.product_name" />
        <el-table-column prop="fprice" :label="lang.price" />
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

const apiEndpoint = 'productaddon'
import { mixinPaginationComponent } from '@/mixins/mixinPaginationComponent'
import { checkCustomPermission } from '@/mixins/checkCustomPermission'

export default {
  mixins: [mixinPaginationComponent, checkCustomPermission],

  data() {
    return {
      loading: true,
      tableData: [],
      statusValue: null,
      searchValue: null,
      pages: [5, 10, 20],
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
    getData() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint),
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

    addData() {
      this.$router.push({path: '/catalog/addon/create'})
    },

    goToSinglePage(row) {
      if (this.checkCustomPermission('catalog/prodaddon', 'show')) {
        this.$router.push({path: '/catalog/addon/' + row.id})
      }
    }
  }
}
</script>
