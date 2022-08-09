<template>
  <div>
    <div class="main-content" shadow="never">
      <div class="table-handler-flex">
        <div style="flex-grow: 1;">
          <h4 class="main-content__title">{{ $lang[langId].list }} {{ lang.featured_product }}</h4>
          <p class="main-content__subtitle">{{ params.total }} {{ lang.featured_product }}</p>
        </div>
        <div v-if="checkCustomPermission('catalog/featured', 'store')">
          <el-button
            type="primary"
            icon="el-icon-plus"
            :disabled="disabledButton"
            @click="dialogAddData">
            {{ lang.add }}
          </el-button>
        </div>
      </div>

      <div>
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
            :label="lang.name"
            max-width="200"
            sortable
            prop="name">
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
            :label="lang.sku"
            prop="sku"
            sortable
            width="160"
          />

          <el-table-column
            :label="lang.group"
            prop="product_group_name"
            sortable
            width="160"
          />

          <el-table-column
            v-if="checkCustomPermission('catalog/featured', 'destroy')"
            :label="$lang[langId].action">
            <template slot-scope="scope">
              <el-button
                :disabled="disabledButton"
                type="danger"
                class="btn-plain"
                @click="removeItem(scope.row.id)" icon="el-icon-delete">
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div style="text-align: center;">
          <el-pagination
            :current-page.sync="params.currentPage"
            :page-size="params.per_page"
            :total="params.total"
            layout="prev, pager, next, jumper"
            @size-change="changePageTable"
            @current-change="changeCurrentPage">
          </el-pagination>
        </div>
      </div>
    </div>

    <!-- dialog tambah social media -->
    <el-dialog
      :title="lang.add"
      :visible.sync="visibleDialogAddData"
      :close-on-click-modal="false"
      :show-close="false">
      <el-form
        :model="form">
        <el-form-item
          label-width="180px"
          :label="lang.product">
          <el-select
            v-model="form.ids"
            :placeholder="lang.info_auto_complete_product"
            :remote-method="searchProducts"
            :loading="searchingProducts"
            style="width: 100%;"
            filterable
            multiple
            remote
            reserve-keyword
            @change="inputProduct">
            <el-option
              v-for="(item) in searchResultProducts"
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
          <el-button :disabled="disabledButtonAdd" type="success" @click="addData" icon="el-icon-check">
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
import { checkCustomPermission } from '@/mixins/checkCustomPermission'
const apiEndpoint = 'product-unggulan'

export default {
  mixins: [checkCustomPermission],

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
        per_page: 5,
        sort_column: 'published_date',
        sort_type: 'desc'
      },
      disabledButton: false,
      disabledButtonAdd: true,
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
    '$store.getters.selectedStore'() {
      this.getData()
    },
    form(data) {
      if(!data.ids) {
        // this.disabledButton = true
      } else {
        this.disabledButton = false
      }
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
        url: baseApi(this.selectedStore.url_id, this.langId, 'product-unggulan'),
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
      // this.disabledButton = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {...this.form}
      data.ids = [...this.form.ids]
      data.ids = data.ids.join(',')
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint + '/add'),
        data,
        headers: headers
      }).then(() => {
        this.visibleDialogAddData = false
        this.disabledButton = false
        this.form = {}
        this.$message({
          type: 'success',
          message: 'Success'
        })
        this.getData()
        this.disabledButtonAdd = true
      }).catch(error => {
        this.loading = false
        this.disabledButton = false
        this.disabledButtonAdd = true
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
        url: baseApi(this.selectedStore.url_id, this.langId, 'product-unggulan/destroy/' + id),
        headers: headers
      }).then(response => {
        this.disabledButton = false
        this.params.search = null
        this.getData()
        this.$message({
          message: 'Success',
          type: 'success'
        })
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
    },
    inputProduct(data) {
      if (data.length > 0) {
        this.disabledButtonAdd = false
      }
    }
  }
}
</script>
