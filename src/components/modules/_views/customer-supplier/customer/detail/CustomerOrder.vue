<template>
  <el-card v-loading="loading" class="card-box">
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

        <el-table :data="custOrderData" stripe v-loading="loading" @sort-change="changeSortTable" @row-click="showOrder">
          <el-table-column :label="lang.order_no" prop="order_no" sortable min-width="150">
            <template slot-scope="props">
              <router-link :to="{ path: props.row.status === 'Z' ? '/sales/completeorder/' + props.row.id : props.row.status === 'A' ? '/sales/openorder/' + props.row.id : props.row.status === 'T' ? '/sales/openorder/' + props.row.id : props.row.status === 'X' ? '/sales/cancelorder/' + props.row.id : '/sales/openorder/' + props.row.id }">
                <div v-if="!props.row.order_no">-</div>
                <div v-else>{{ props.row.order_no}}</div>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column :label="lang.order_date" prop="order_date" sortable min-width="130">
            <template slot-scope="props">
              <div v-if="!props.row.forder_date">-</div>
              <div v-else>{{ props.row.forder_date}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="lang.shipping_to" prop="shipping_to" sortable min-width="170">
            <template slot-scope="props">
              <div v-if="!props.row.shipping_to">-</div>
              <div v-else>{{ props.row.shipping_to}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="lang.order_amount" prop="ftotal_amount" sortable min-width="140">
            <template slot-scope="props">
              <div v-if="!props.row.ftotal_amount">-</div>
              <div v-else>{{ props.row.ftotal_amount}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="lang.status" width="120" sortable prop="status">
            <template slot-scope="props">
              <div v-if="!props.row.status">
                <p>-</p>
              </div>
              <div v-else>
                <div v-if="props.row.status === 'A'">
                  <el-tag size="mini">{{ rootLang.has_confirm }}</el-tag>
                </div>
                <div v-if="props.row.status === 'D'">
                  <el-tag size="mini" type="info">{{ rootLang.draft }}</el-tag>
                </div>
                <div v-if="props.row.status === 'P'">
                  <el-tag size="mini" type="warning">{{ rootLang.pending }}</el-tag>
                </div>
                <div v-if="props.row.status === 'R'">
                  <el-tag size="mini">{{ lang.received }}</el-tag>
                </div>
                <div v-if="props.row.status === 'S'">
                  <el-tag size="mini">{{ rootLang.being_sent }}</el-tag>
                </div>
                <div v-if="props.row.status === 'T'">
                  <el-tag size="mini" type="success">{{ lang.delivered }}</el-tag>
                </div>
                <div v-if="props.row.status === 'X'">
                  <el-tag size="mini" type="danger">{{ lang.cancel }}</el-tag>
                </div>
                <div v-if="props.row.status === 'Z'">
                  <el-tag size="mini" type="success">{{ rootLang.complete }}</el-tag>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="lang.paid" prop="is_paid" sortable width="150">
            <template slot-scope="props">
              <div v-if="props.row.is_paid === 0">
                <el-tag size="mini" type="danger">{{ lang.not_yet }}</el-tag>
              </div>
              <div v-if="props.row.is_paid === 1">
                <el-tag size="mini" type="success">{{ rootLang.done }}</el-tag>
              </div>
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
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'

import dateRangePicker from '@/components/modules/DateRangePicker'
var moment = require('moment')
const endDate = moment().format('YYYY-MM-DD')
const startDate = moment(endDate).subtract(1, 'years').format('YYYY-MM-DD')
export default {
  name: 'CustomerDetailOrder',
  props: ['rootId'],

  components: {
    dateRangePicker
  },

  data() {
    return {
      loading: false,
      custOrderData: [],
      searchValue: null,
      idRoot: null,
      showTable: false,
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
    },
    rootLang() {
      return this.$lang[this.$store.state.userStores.langId]
    }
  },
  watch: {
    '$store.getters.selectedStore': function() {
      this.getOrderData()
    }
  },
  methods: {
    getOrderData: function() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'customerorder/' + this.idRoot),
        headers: headers,
        params: this.params
      })
        .then(response => {
          this.custOrderData = response.data.data
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
          this.custOrderData = []
          this.params.total = 0
          this.loading = false
          console.log(error)
        })
    },
    changePageTable(val) {
      this.params.per_page = val
      this.params.page = 1
      this.getOrderData()
    },
    handleSearch(val) {
      this.params.page = 1
      this.params.currentPage = 1
      this.params.search_text = ''
      this.params.search_column = null
      this.params.search = this.searchValue

      this.getOrderData()
    },
    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      console.log(val)
      this.params.sort_type = val.order
      this.params.sort_column = val.prop === 'ftotal_amount' ? 'total_amount' : val.prop
      if (val.order === null) {
        this.params.sort_type = 'asc'
        this.params.sort_column = 'order_no'
      }
      this.getOrderData()
    },
    changeCurrentPage(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getOrderData()
    },
    showOrder(row) {
      let routeName = ''
      if (order.status === 'Z') {
        routeName = '/sales/completeorder'
      } else if (order.status === 'X') {
        routeName = '/sales/cancelorder'
      } else if (order.status === 'A') {
        routeName = '/sales/openorder'
      } else {
        routeName = '/sales/openorder'
      }
      this.$router.push({ path: routeName + row.id })
    },

    getData (range) {
      this.params.start_date = range.start_date
      this.params.end_date = range.end_date
      this.getOrderData()
    },

    downloadExcel() {
      this.loadingDownload = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      this.params.type = 'xlsx'
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'customerorder/' + this.idRoot),
        params: this.params,
        responseType: 'blob',
        headers: headers
      }).then(response => {
        const fileName = 'customerorder' + '-' + this.params.start_date + '__' + this.params.end_date + '.xlsx'
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
    this.getOrderData()
  }
}
</script>

