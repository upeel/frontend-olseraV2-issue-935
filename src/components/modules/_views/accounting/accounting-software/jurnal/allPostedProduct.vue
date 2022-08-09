<template>
  <div class="content-wrapper">
    <section class="content">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="table-handler-flex">
          <div style="flex-grow: 1;">
            <h4>{{ $lang[langId].product_list }}</h4>
            <p>{{ params.total }} {{ lang.product }}</p>
          </div>
        </div>

        <div class="card-body">
          <div class="table-handler-flex">
            <div class="mb-12" style="flex-grow: 1;">
              <el-select
                v-model="params.per_page"
                :placeholder="lang.please_select"
                filterable
                size="small"
                @change="handleSizeChange">
                <el-option
                  v-for="item in pages"
                  :key="item"
                  :value="item"
                  :label="item + ' ' + lang.rows"
                />
              </el-select>
            </div>

            <div class="mb-12">
              <el-input
                v-model="params.search"
                :placeholder="$lang[langId].product_sku"
                clearable
                prefix-icon="el-icon-search"
                size="small"
                class="inline-form input-search"
                @change="handleSearch">
              </el-input>

            </div>
          </div>


          <hr/>

          <el-table
            ref="multipleTable"
            v-loading="loading"
            :data="dataProducts"
            stripe
            border
            class="product-table-max-height vertical-align-top mobile-fix-height-unset"
            @sort-change="handleSortChange">
            <el-table-column :label="lang.photo" class-name="text-center" min-width="80px">
              <template slot-scope="props">
                  <el-image
                    v-if="props.row.photo_xs"
                    :src="props.row.photo_xs"
                    fit="cover"
                    style="width: 50px; height: 50px; border-radius: 50%;"
                  />
              </template>
            </el-table-column>

            <el-table-column :label="lang.product_name" prop="name" sortable min-width="150px">
              <template slot-scope="scope">
                <strong>{{ scope.row.name }}</strong>
              </template>
            </el-table-column>

            <el-table-column :label="lang.sku" prop="sku" sortable min-width="100">
              <template slot-scope="scope">
                <div class="overflow-ellipsis">
                  {{ scope.row.sku }}
                </div>
              </template>
            </el-table-column>

            <el-table-column :label="lang.description" prop="description">
              <template slot-scope="scope">
                <span>{{ scope.row.description }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$lang[langId].jurnal_product_name" prop="jurnal_product_name" sortable min-width="150">
              <template slot-scope="scope">
                  <strong>
                    {{ scope.row.jurnal_product_name }}
                  </strong>
              </template>
            </el-table-column>




          </el-table>

          <div class="block mt-12">
            <el-pagination
              :current-page.sync="params.page"
              :page-size="params.per_page"
              :total="params.total"
              layout="total, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange">
            </el-pagination>
          </div>
        </div>
      </el-card>
    </section>
  </div>
</template>

<script>
var moment = require('moment')

import { baseApi } from 'src/http-common'
import axios from 'axios'


import basicComputedMixin from '@/mixins/basicComputedMixin'

export default {
  mixins: [basicComputedMixin],
  name: 'JurnalPostedProductList',
  data() {
    return {
      loading: true,
      changeColor: '#C8CBD3',
      formLabelWidth: '150px',
      dataProducts: [],

      pages: [5, 10, 20, 50, 100],

      params: {
        search: null,
        total: null,
        // sort_column: 'id',
        // sort_type: 'desc',
        per_page: 10,
        page: 1,
        store: null,
        search_column: [],
        search_text: '',
        search_operator: [],
        collection_id: '',
      },
    }
  },

  computed: {
    token() {
      return this.$store.state.user.token
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    selectedStore() {
      return this.$store.state.userStores.selectedStore
    },

  },

  watch: {

  },

  mounted() {
    this.getProducts()
  },

  methods: {
    getProducts() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/productmaping'),
        params: this.params,
        headers: headers
      })
        .then(response => {
          this.dataProducts = response.data.data
          this.params.total = response.data.meta.total
          this.loading = false
        })
        .catch(error => {
          this.loading = false
          this.dataProducts = []
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

    handleSizeChange(val) {
      this.params.page = 1
      this.params.per_page = val
      this.getProducts()
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.params.page = val
      this.getProducts()
    },
    handleSearch(val) {
      this.params.page = 1
      this.params.page = 1
      // this.params.search_text = []
      // this.params.search_column = []
      this.getProducts()
    },
    handleSortChange(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.getProducts()
    },
  }
}
</script>
