<template>
  <div>
    <div class="main-content" shadow="never">
      <div slot="header" class="table-handler-flex">
        <div style="flex-grow: 1;">
          <h4 class="main-content__title">{{ $lang[langId].list }} {{ lang.preorder_product }}</h4>
          <p class="main-content__subtitle">{{ params.total }} {{ lang.product }}</p>
        </div>
        <div>
          <button-action-authenticated
            :permission="['catalog/preorder', 'store']"
            type="primary"
            icon="el-icon-plus"
            :disabled="disabledButton"
            @click="dialogAddData">
            {{ lang.add }}
          </button-action-authenticated>
        </div>
      </div>

      <div class="">
        <div class="table-handler-flex">
          <div class="mb-4" style="flex-grow: 1;">
            <el-select class="inline-form" v-model="params.per_page" @change="changePageTable" filterable :placeholder="lang.please_select" size="small">
              <el-option v-for="item in pages" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
          <div class="mb-4">
            <el-input
              class="inline-form input-search"
              clearable
              :placeholder="lang.search_products"
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
          @sort-change="changeSortTable">
          <el-table-column
            width="400"
            :label="lang.name">
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
            prop="sku"
            sortable
            :label="lang.sku"
            width="160">
          </el-table-column>

          <el-table-column
            prop="product_group_name"
            sortable
            :label="lang.group"
            width="160">
          </el-table-column>

          <el-table-column
            :label="$lang[langId].action">
            <template slot-scope="scope">
              <button-action-authenticated :permission="['catalog/preorder', 'destroy']" type="danger" class="btn-plain"
                :disabled="disabledButton"
                @click="removeItem(scope.row.id)" icon="el-icon-delete">
              </button-action-authenticated>
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
    </div>

    <!--  dialog tambah social media -->
    <el-dialog :title="lang.add" :visible.sync="visibleDialogAddData" :close-on-click-modal="false" :show-close="false">
      <el-form :model="form">
        <el-form-item
          label-width="180px"
          :label="lang.product">
          <el-select
            style="width: 100%;"
            v-model="form.ids"
            filterable
            multiple
            remote
            reserve-keyword
            :placeholder="lang.info_auto_complete_product"
            :remote-method="searchProducts"
            :loading="searchingProducts">
            <el-option
              v-for="item in searchResultProducts"
              :key="item.product_id"
              :label="item.name"
              :value="item.product_id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label-width="140px">
          <el-button :disabled="disabledButton" type="info" @click="resetState" icon="el-icon-close">
            {{ lang.cancel }}
          </el-button>
          <el-button :disabled="disabledButton" type="success" @click="addData" icon="el-icon-check">
            {{ lang.save }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'

export default {
  data: function() {
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
        per_page: 5,
        sort_column: 'published_date',
        sort_type: 'desc'
      },
      disabledButton: false,
      visibleDialogAddData: false,
      form: {},
      searchResultProducts: [],
      searchingProducts: false
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
    getData: function() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'product-preorder'),
        params: this.params,
        headers: headers
      }).then(response => {
        this.tableData = response.data.data
        this.params.total = response.data.meta.total
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.tableData = []
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
      this.params.page = 1
      this.params.currentPage = 1
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
    searchProducts(query) {
      //
      this.searchingProducts = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search_column: 'name',
        search_text: query,
        sort_column: 'name',
        sort_type: 'desc'
      }
      if (query.length > 0) {
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'productsearch'),
          headers: headers,
          params: params
        }).then(response => {
          this.searchingProducts = false
          this.searchResultProducts = response.data.data.map(item => {
            return item
          })
        }).catch(() => {
          this.searchingProducts = false
          this.searchResultProducts = []
        })
      } else {
        this.searchResultProducts = []
        this.searchingProducts = false
      }
    },
    dialogAddData() {
      this.visibleDialogAddData = true
    },
    addData() {
      this.loading = true
      this.disabledButton = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {...this.form}
      data.ids = data.ids.join(',')
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'product-preorder/add'),
        data,
        headers: headers
      }).then(response => {
        this.visibleDialogAddData = false
        this.disabledButton = false
        this.form = {}
        this.$message({
          type: 'success',
          message: 'Success'
        })
        this.getData()
      }).catch(error => {
        this.loading = false
        this.disabledButton = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    removeItem(id) {
      this.disabledButton = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'product-preorder/destroy/' + id),
        headers: headers
      }).then(response => {
        this.disabledButton = false
        this.$message({
          type: 'success',
          message: 'Success'
        })
        this.getData()
      }).catch(error => {
        this.disabledButton = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    resetState() {
      this.visibleDialogAddData = false
      // this.form = {}
      this.form.ids = []
      this.searchResultProducts = []
    }
  },

  mounted() {
    this.getData()
  }
}
</script>
