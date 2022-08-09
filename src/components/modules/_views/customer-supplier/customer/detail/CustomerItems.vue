<template>
  <div v-loading="loading" class="customer-items">
    <el-card class="box-card">
      <div class="card-body">
        <div class="mb-16">
          <date-range-picker
            :init-date="initParamDate"
            :attendance="true"
            @picked="getData"
          />
        </div>
        <div v-if="!showTable" class="no-product">
          <p>{{ lang.no_order }}</p>
          <img src="/static/img/no-data.svg" alt="No Data Picture">
        </div>

        <div v-else>
          <div class="flex-container flex-container--wrap">
            <div style="flex-grow: 1;">
              <el-select class="inline-form" v-model="params.per_page" @change="changePageTable" filterable :placeholder="lang.please_select" size="small">
                <el-option v-for="item in pages" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </div>
            <el-button
              type="info"
              icon="el-icon-download"
              class="mr-8"
              :loading="loadingDownload"
              @click="downloadExcel">
              {{ $lang[langId].download_excel }}
            </el-button>
            <el-input class="inline-form" clearable :placeholder="lang.search" prefix-icon="el-icon-search" v-model="searchValue" @change="handleSearch" size="small"></el-input>
          </div>

          <el-table :data="custItemsData" stripe v-loading="loading" @sort-change="changeSortTable" row-class-name="pointer" @row-click="handleDetail">
            <el-table-column :label="lang.order_no" prop="order_no" sortable min-width="230">
              <template slot-scope="props">
                <div class="flex-container">
                  <el-avatar v-if="props.row.photo_md" :src="props.row.photo_md " class="mr-4" />
                  <div>
                    <span v-if="!props.row.order_no">-</span>
                    <span v-else>{{ props.row.order_no}}</span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="lang.order_date" prop="order_date" sortable min-width="140">
              <template slot-scope="props">
                <div v-if="!props.row.forder_date">-</div>
                <div v-else>{{ props.row.forder_date}}</div>
              </template>
            </el-table-column>
            <el-table-column :label="lang.sales_by" prop="sales_by_name" sortable min-width="160">
              <template slot-scope="props">
                <div v-if="!props.row.sales_by_name">-</div>
                <div v-else>{{ props.row.sales_by_name}}</div>
              </template>
            </el-table-column>
            <el-table-column :label="lang.order_item" prop="product_name" sortable min-width="180">
              <template slot-scope="props">
                <div v-if="!props.row.product_name">-</div>
                <div v-else>{{ props.row.product_name}} - {{ props.row.product_variant_name }}</div>
              </template>
            </el-table-column>
            <el-table-column :label="lang.qty" prop="qty" sortable>
              <template slot-scope="props">
                <div v-if="!props.row.qty">-</div>
                <div v-else>{{ props.row.qty}}</div>
              </template>
            </el-table-column>
            <el-table-column :label="lang.avg_buy_price" prop="fprice" sortable min-width="170">
              <template slot-scope="props">
                <div v-if="!props.row.fprice">-</div>
                <div v-else>{{ props.row.fprice}}</div>
              </template>
            </el-table-column>
            <el-table-column :label="lang.total" prop="famount" sortable min-width="150">
              <template slot-scope="props">
                <div v-if="!props.row.famount">-</div>
                <div v-else>{{ props.row.famount}}</div>
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
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'

import dateRangePicker from '@/components/modules/DateRangePicker'
var moment = require('moment')
const endDate = moment().format('YYYY-MM-DD')
const startDate = moment(endDate).subtract(1, 'years').format('YYYY-MM-DD')
export default {
  name: 'CustomerDetailItems',
  props: ['rootId'],

  components: {
    dateRangePicker
  },

  data() {
    return {
      loading: false,
      custItemsData: [],
      searchValue: null,
      showTable: false,
      idRoot: null,
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
        },
        {
          value: 50,
          label: '50 ' + this.$store.state.userStores.lang.rows
        },
        {
          value: 100,
          label: '100 ' + this.$store.state.userStores.lang.rows
        }
      ],
      params: {
        search: null,
        total: null,
        currentPage: 1,
        sort_column: 'order_no',
        sort_type: 'asc',
        per_page: 5,
        page: 1,
        store: null,
        search_column: null,
        search_text: '',
        start_date: startDate,
        end_date: endDate
      },
      loadingDownload: false,
      initParamDate: []
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
      this.getItemsData()
    }
  },
  methods: {
    getItemsData: function() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'customerorderitems/' + this.idRoot),
        headers: headers,
        params: this.params
      })
        .then(response => {
          this.custItemsData = response.data.data
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
          this.custItemsData = []
          this.params.total = 0
          this.loading = false
          console.log(error)
        })
    },
    changePageTable(val) {
      this.params.per_page = val
      this.getItemsData()
    },
    handleSearch(val) {
      this.params.page = 1
      this.params.currentPage = 1
      this.params.search_text = ''
      this.params.search_column = null
      this.params.search = this.searchValue
      this.custItemsData = []
      this.getItemsData()
    },
    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      console.log(val)
      this.params.sort_type = val.order
      this.params.sort_column = val.prop !== 'fprice' ? val.prop : 'price'
      this.getItemsData()
    },
    changeCurrentPage(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getItemsData()
    },

    handleDetail (row) {
      this.$router.push('/sales/openorder/' + row.id)
    },

    getData (range) {
      this.params.start_date = range.start_date
      this.params.end_date = range.end_date
      this.getItemsData()
    },

    downloadExcel() {
      this.loadingDownload = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      this.params.type = 'xlsx'
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'customerorderitems/' + this.idRoot),
        params: this.params,
        responseType: 'blob',
        headers: headers
      }).then(response => {
        const fileName = 'customerorderitems' + '-' + this.params.start_date + '__' + this.params.end_date + '.xlsx'
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        this.loadingDownload = false
      }).catch(error => {
        console.log(error, 'error')
        this.loadingDownload = false
      })
    },
  },
  mounted() {
    this.idRoot = this.rootId
    this.initParamDate = [this.params.start_date, this.params.end_date]
    this.getItemsData()
  }
}
</script>

