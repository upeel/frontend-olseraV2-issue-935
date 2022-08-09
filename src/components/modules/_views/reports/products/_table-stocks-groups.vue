<template>
  <div v-loading="loading">
    <template v-if="!showDetail">
      <div class="summary">
        <h5>{{ $lang[langId].summary }}</h5>
        <el-table :data="[summary]" border>
          <el-table-column :label="lang.stock_qty" prop="ftotal_qty" />
          <el-table-column :label="lang.total" prop="ftotal_stock_amount" />
        </el-table>
      </div>

      <bs-table
        :header="[lang.category, lang.stock_qty, lang.sales_amount]">
        <template
          v-for="(item, key) in data">
          <tr :key="key" class="active pointer" @click="getDetail(item)">
            <td>{{ item.product_group_name }}</td>
            <td class="text-right">{{ item.fstock_qty }}</td>
            <td class="text-right">{{ item.fstock_amount }}</td>
          </tr>
          <template v-if="item.child && item.child.length">
            <tr
              class="pointer"
              v-for="(subgroup, subgroupKey) in item.child"
              :key="subgroupKey" @click="getDetail(subgroup)">
              <td>
                <div class="ml-24">{{ subgroup.product_group_name }}</div>
              </td>
              <td class="text-right">{{ subgroup.fstock_qty }}</td>
              <td class="text-right">{{ subgroup.fstock_amount }}</td>
            </tr>
          </template>
        </template>
      </bs-table>

      <div
        v-if="total > 0"
        class="table-handler-bottom">
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
    </template>

    <div v-if="showDetail">
      <tableStocksGroupsDetail
        :data="dataSales"
        :summary="summaryDetail"
        :lang="lang"
        :lang-id="langId"
        :total="totalSales"
        :current-page="currentPageDetail"
        @changePage="handleChangePageDetail"
        @back="getBack"
        @showdetaildata="showDetailData"
      />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { baseApi } from 'src/http-common'
import TableStocksGroupsDetail from './_table-stocks-groupsdetail'

import MixinReport from '../MixinReport'
export default {
  name: 'TableStocksGroups',
  props: ['data', 'lang', 'summary', 'langId', 'total', 'params', 'token', 'store', 'currentPage'],
  components: {
    TableStocksGroupsDetail
  },

  mixins: [MixinReport],
  
  data() {
    return {
      data: [],
      row: [],
      showDetail: false,
      summaryDetail: [],
      loading: false,
      dataSales: [],
      dataPageDetail: 1,
      currentPageDetail: 1
    }
  },
  methods: {
    handleChangePage(page) {
      var listQuery = {
        page: page
      }
      this.getData(listQuery)
      this.$emit('currentPage', this.currentPage)
    },
    handleChangeSizePage(page) {
      this.currentPage = 1
      this.$emit('changeSizePage', page)
    },
    getData(query) {
      this.loading = true
      this.data = []
      this.params.page = query.page
      var apiEndPoint = 'reportpenjualan'

      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.store.url_id, this.langId, apiEndPoint + '/productgroupstock'),
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
        this.loading = false
      })
    },

    getDetail(row) {
      this.loading = true
      this.showDetail = false
      this.dataSales = []
      this.row = row

      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      // let params = this.params
      let params ={
        product_group_id: row.product_group_id,
        sort: this.params.sort,
        per_page: this.params.per_page,
        page: this.dataPageDetail
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'reportpenjualan/productstock'),
        params: params,
        headers
      }).then(response => {
        this.dataSales = response.data.data
        if (response.data.meta) {
          this.totalSales = response.data.meta.total
        }
        this.summaryDetail.push(response.data.totaldata)
        this.showDetail = true
        this.$emit('setParams', params)
        this.$emit('showDetail', true)
        this.loading = false
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.dataSales = []
        this.showDetail = false
        this.summaryDetail = []
        this.loading = false
      })
    },
    getBack() {
      this.dataSales = []
      this.summaryDetail = []
      this.totalSales = 0
      this.showDetail = false
      this.row = []
      this.dataPageDetail = 1
      this.currentPageDetail = 1
      this.$emit('showDetail', false)
    },

    handleChangePageDetail (data) {
      this.dataPageDetail = data
      this.currentPageDetail = data
      this.getDetail(this.row)
    }
  }
}
</script>
