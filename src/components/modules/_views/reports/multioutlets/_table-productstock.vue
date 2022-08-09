<template>
  <div v-loading="loading" class="card-body">
    <div class="summary">
      <h5>{{ $lang[langId].summary }}</h5>
      <el-table :data="[summary]" border>
        <el-table-column :label="lang.stock_qty" prop="ftotal_qty" />
        <el-table-column :label="lang.total" prop="ftotal_stock_amount" />
      </el-table>
    </div>

    <el-table :data="data">
      <el-table-column min-width="120px" :label="lang.product" prop="product_name">
        <template slot-scope="scope">
          <strong>{{ scope.row.product_name }}</strong><br/>
          <span class="size-11">
            {{ scope.row.product_variant_name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="variant" prop="product_variant_name" />
      <el-table-column :label="lang.category" prop="product_group_name" />
      <el-table-column label="Qty Stock" prop="stock_qty" />
      <!-- <el-table-column :label="lang.sold_qty" prop="sales_qty" /> -->
      <el-table-column :label="lang.buy_price" prop="fbuy_price" />
      <el-table-column :label="lang.subtotal" prop="fstock_amount" />
      <el-table-column :label="lang.sell_price" prop="fsell_price" />
      <!-- <el-table-column :label="lang.offline_selling_price" prop="fsell_price_pos" /> -->
    </el-table>

    <div v-if="total > 0" class="table-handler-bottom">
      <!-- <el-select
        v-model="perPage"
        @change="changePerpage"
        filterable
        style="width: 100%">
        <el-option
          v-for="(item) in filterPage"
          :key="item.per_page"
          :label="item.label"
          :value="item.per_page"
        />
      </el-select> -->
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
import axios from 'axios'
import { baseApi } from 'src/http-common'
export default {
  name: 'TableUnsold',
  props: ['data', 'lang', 'langId', 'summary', 'total', 'params', 'token', 'store'],
  data() {
    return {
      loading: false,
      currentPage: 1
    }
  },
  methods: {
    handleChangePage(page) {
      console.log('page', this.store)
      var listQuery = {
        page: page
      }
      this.getData(listQuery, 'page')
    },

    handleChangeSizePage(page) {
      var listQuery = {
        per_page: page
      }
      this.getData(listQuery, 'per_page')
    },

    getData(query, block) {
      this.data = []
      this.summary = []
      if (block === 'page') {
        this.params.page = query.page
      }
      if (block === 'per_page') {
        this.params.page = 1
        this.params.per_page = query.per_page
        this.currentPage = 1
      }
      var apiEnd = 'reportpenjualan'

      this.loading = true

      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.store.url_id, this.langId, apiEnd + '/' + 'productstock'),
        params: this.params,
        headers
      }).then(response => {
        this.data = response.data.data
        if (response.data.totaldata) {
          this.summary = response.data.totaldata
        }
        if (response.data.meta) {
          this.total = response.data.meta.total
        }
        this.loading = false
      }).catch(() => {
        this.data = []
        this.total = 0
        this.loading = false
      })
    }
  }
}
</script>

