<template>
  <div v-loading="loading" class="supplier-product">
    <el-card class="box-card">
      <div class="card-body">
        <div v-if="!showTable" class="no-product">
          <p>{{ $lang[langId].no_product }}</p>
          <img src="/static/img/no-data.svg" alt="No Data Picture">
        </div>

        <div v-else>
          <div class="table-handler-flex">
            <div class="mb-4" style="flex-grow: 1;">
              <el-select
                v-model="params.per_page"
                :placeholder="lang.please_select"
                filterable
                class="inline-form"
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

            <div class="mb-4">
              <el-button type="text" icon="el-icon-download" :loading="loadingDownload" @click="getExcel">
                {{ $lang[langId].download_excel }}
              </el-button>
              <el-input
                v-model="searchValue"
                :placeholder="lang.search"
                clearable
                prefix-icon="el-icon-search"
                class="inline-form input-search"
                @change="handleSearch"
                size="small"
              />
            </div>
          </div>

          <el-divider></el-divider>

          <el-table :data="productData" stripe v-loading="loading" @sort-change="changeSortTable">
            <el-table-column :label="lang.product_name" prop="product_name" sortable min-width="160">
              <template slot-scope="props">
                <div v-if="!props.row.product_name">-</div>
                <div v-else>{{ props.row.product_name}}</div>
              </template>
            </el-table-column>
            <el-table-column :label="lang.variant" prop="product_variant_name" sortable min-width="120">
              <template slot-scope="props">
                <div v-if="!props.row.product_variant_name">-</div>
                <div v-else>{{ props.row.product_variant_name}}</div>
              </template>
            </el-table-column>
            <el-table-column :label="lang.stock_qty" prop="product_stock_qty" sortable min-width="120">
              <template slot-scope="props">
                <div v-if="!props.row.product_variant_stock_qty">{{ props.row.product_stock_qty }}</div>
                <div v-if="props.row.product_variant_stock_qty">
                  {{ props.row.product_variant_stock_qty }}
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="lang.buy_price" prop="fproduct_buy_price" sortable min-width="140">
              <template slot-scope="props">
                <div v-if="!props.row.fproduct_buy_price">-</div>
                <div v-else>{{ props.row.fproduct_buy_price}}</div>
              </template>
            </el-table-column>
            <el-table-column :label="rootLang.action">
              <template slot-scope="props">
                <el-button round @click="showDetailDialog(props.row)" icon="el-icon-view">
                  <!-- <svg-icon icon-class="eye" style="stroke: blue;"></svg-icon> -->
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="block">
            <el-pagination @size-change="changePageTable" @current-change="changeCurrentPage" :current-page.sync="params.currentPage" :page-size="params.per_page" layout="prev, pager, next, jumper" :total="params.total">
            </el-pagination>
          </div>

        </div>
      </div>      
    </el-card>

    <el-dialog class="supplier-detail-dialog" :title="dialogDataID.nameTitle" :visible.sync="detailDialog" width="50%" :before-close="cancelDetailDialog">
      <div>
        <div class="table-handler">
          <div class="pull-left">
            <el-select class="inline-form" v-model="paramsDialog.per_page" @change="pageTableDialog" filterable :placeholder="lang.please_select" size="small">
              <el-option v-for="item in pages" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
          <div class="pull-right">
            <el-input class="inline-form" clearable :placeholder="lang.search" prefix-icon="el-icon-search" v-model="searchValueDialog" @change="handleSearchDialog" size="small"></el-input>
          </div>
        </div>

        <el-table :data="detailData" stripe v-loading="loading" @sort-change="sortTableDialog">
          <el-table-column :label="lang.incoming_stock" prop="trans_no" sortable min-width="140">
            <template slot-scope="props">
              <div v-if="!props.row.trans_no">-</div>
              <div v-else>{{ props.row.trans_no}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="lang.created_time" prop="fdate" sortable min-width="160">
            <template slot-scope="props">
              <div v-if="!props.row.fdate">-</div>
              <div v-else>{{ props.row.fdate}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="lang.supplier" prop="supplier_name" sortable min-width="140">
            <template slot-scope="props">
              <div v-if="!props.row.supplier_name">-</div>
              <div v-else>{{ props.row.supplier_name}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="lang.variant" prop="product_variant_name" sortable min-width="120">
            <template slot-scope="props">
              <div v-if="!props.row.product_variant_name">-</div>
              <div v-else>{{ props.row.product_variant_name}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="lang.qty" prop="qty" sortable>
            <template slot-scope="props">
              <div v-if="!props.row.qty">-</div>
              <div v-else>{{ props.row.qty}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="lang.buy_price" prop="buy_price" sortable min-width="120">
            <template slot-scope="props">
              <div v-if="!props.row.buy_price">-</div>
              <div v-else>{{ props.row.buy_price}}</div>
            </template>
          </el-table-column>
        </el-table>

        <div class="block">
          <el-pagination @size-change="pageTableDialog" @current-change="currentPageDialog" :current-page.sync="paramsDialog.currentPage" :page-size="paramsDialog.per_page" layout="prev, pager, next, jumper" :total="paramsDialog.total">
          </el-pagination>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDetailDialog">{{ lang.back }}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'

export default {
  name: 'SupplierDetailProduct',
  data() {
    return {
      loading: false,
      productData: [],
      detailData: [],
      dialogDataID: {},
      searchValue: null,
      searchValueDialog: null,
      showTable: false,
      detailDialog: false,
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
        sort_column: 'product_id',
        sort_type: 'asc',
        per_page: 5,
        page: 1,
        store: null,
        search_column: null,
        search_text: ''
      },
      paramsDialog: {
        search: null,
        total: null,
        currentPage: 1,
        sort_column: 'trans_no',
        sort_type: 'asc',
        per_page: 5,
        page: 1,
        store: null,
        search_column: null,
        search_text: ''
      },
      loadingDownload: false,
      profileData: {}
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
      this.getSuppProduct()
    }
  },
  methods: {
    getProfileData() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'supplier/' + this.$route.params.id),
        headers: headers
      })
        .then(response => {
          this.profileData = response.data.data
          this.loading = false
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.loading = false
          console.log(error)
        })
    },
    getSuppProduct: function() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(
          this.selectedStore.url_id,
          this.langId,
          'supplierproducts/' + this.$route.params.id
        ),
        headers: headers,
        params: this.params
      })
        .then(response => {
          this.productData = response.data.data
          this.params.total = response.data.meta.total
          this.showTable = true
          this.loading = false
        })
        .catch(error => {
          if (error.response.data.error.status_code !== 404) {
            this.$notify({
              type: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error
            })
          }
          this.params.total = 0
          this.loading = false
          console.log(error)
        })
    },

    getExcel() {
      this.loadingDownload = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let params = {
        type: 'xlsx',
        p: 0
      }

      axios({
        url: baseApi(this.selectedStore.url_id, this.langId, 'supplierproducts/' + this.$route.params.id),
        method: 'GET',
        responseType: 'blob',
        headers,
        params
      }).then((response) => {
        const fileName = 'product_' + this.profileData.name + '.xlsx'
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        this.loadingDownload = false
      }).catch(error => {
        // console.log(error, 'error')
        this.loadingDownload = false
      })
    },

    changePageTable(val) {
      this.params.per_page = val
      this.getSuppProduct()
    },
    handleSearch(val) {
      this.params.page = 1
      this.params.currentPage = 1
      this.params.search_text = ''
      this.params.search_column = null
      this.params.search = this.searchValue

      this.getSuppProduct()
    },
    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      console.log(val)
      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.getSuppProduct()
    },
    changeCurrentPage(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getSuppProduct()
    },
    showDetailDialog(row) {
      this.dialogDataID.productID = row.product_id
      this.dialogDataID.variantID = row.product_variant_id
      this.dialogDataID.nameTitle = row.product_name
      this.getPriceDetail()
      this.detailDialog = true
    },
    getPriceDetail() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let url = ''
      if (!this.dialogDataID.variantID) {
        url = baseApi(this.selectedStore.url_id, this.langId, 'productbuyprices/' + this.dialogDataID.productID)
      } else {
        url = baseApi(this.selectedStore.url_id, this.langId, 'productbuyprices/' + this.dialogDataID.productID + '/' + this.dialogDataID.variantID)
      }

      axios({
        method: 'GET',
        url: url,
        headers: headers,
        params: this.paramsDialog
      })
        .then(response => {
          this.detailData = response.data.data
          this.paramsDialog.total = response.data.meta.total
          this.loading = false
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.paramsDialog.total = 0
          this.loading = false
          console.log(error)
        })
    },
    sortTableDialog(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      console.log(val)
      this.paramsDialog.sort_type = val.order
      this.paramsDialog.sort_column = val.prop
      this.getPriceDetail()
    },
    handleSearchDialog(val) {
      this.paramsDialog.page = 1
      this.paramsDialog.currentPage = 1
      this.paramsDialog.search_text = ''
      this.paramsDialog.search_column = null
      this.paramsDialog.search = this.searchValueDialog

      this.getPriceDetail()
    },
    pageTableDialog(val) {
      this.paramsDialog.per_page = val
      this.getPriceDetail()
    },
    currentPageDialog(val) {
      this.paramsDialog.currentPage = val
      this.paramsDialog.page = val
      this.getPriceDetail()
    },
    cancelDetailDialog() {
      this.detailData = []
      this.dialogDataID = {}
      this.detailDialog = false
    }
  },
  mounted() {
    this.getSuppProduct()
    this.getProfileData()
  }
}
</script>

