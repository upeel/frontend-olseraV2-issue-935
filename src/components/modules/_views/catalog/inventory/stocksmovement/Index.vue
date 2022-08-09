<template>
  <div>
    <div class="main-content">
      <div class="table-handler-flex">
        <div style="flex-grow: 1;">
          <h4 class="main-content__title">{{ lang.stock_movement }}</h4>
          <p class="main-content__subtitle">{{ params.total }} {{ lang.item }}</p>
        </div>

        <!-- <div class="mr-4">
          <date-range-picker 
            v-on:picked="getData" />
        </div> -->
        <date-range-picker
          :init-date="initParamDate"
          :attendance="true"
          class="mr-4"
          @picked="getData"
        />

        <el-button
          type="success"
          icon="el-icon-download"
          @click="downloadExcel">
          {{ $lang[langId].download_excel }}
        </el-button>
      </div>

      <div class="table-handler-flex mb-16">
        <div class="mb-8" style="flex-grow: 1;">
          <el-select class="inline-form" v-model="params.per_page" @change="changePageTable" filterable :placeholder="lang.please_select" size="small">
            <el-option
              v-for="item in pages"
              :key="item"
              :value="item"
              :label="item + ' ' + lang.rows"
            />
          </el-select>
        </div>

        <div class="mb-8">
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

      <el-table
        :data="tableData"
        stripe
        border
        v-loading="loading"
        @row-click="openDetail"
        @sort-change="changeSortTable">
        <el-table-column :label="lang.group" sortable min-width="100px">
          <template slot-scope="props">
            {{ props.row.product_group_name }}
          </template>
        </el-table-column>
        <el-table-column :label="lang.product" sortable prop="product_name" min-width="150px">
          <template slot-scope="scope">
            <h5><strong>{{ scope.row.product_name }}</strong></h5>
            <small>{{ scope.row.product_sku }}</small>
            <p><small>{{ scope.row.product_variant_name }}</small></p>
          </template>
        </el-table-column>
        <el-table-column :label="lang.beginning" sortable prop="beginning_qty" min-width="80px">
          <template slot-scope="scope">
            {{ scope.row.beginning_qty }}
          </template>
        </el-table-column>
        <el-table-column :label="lang.incoming" sortable prop="sum_incoming_qty" min-width="80px">
          <template slot-scope="scope">
            <svg-icon icon-class="corner-right-down" style="width: 15px; height: 15px; stroke: #6EBE46;" />
            <span style="color: #6EBE46;">{{ scope.row.sum_incoming_qty }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="lang.sales_return" sortable prop="sum_return_qty" min-width="80px">
          <template slot-scope="scope">
            <svg-icon icon-class="corner-right-down" style="width: 15px; height: 15px; stroke: #6EBE46;" />
            <span style="color: #6EBE46;">{{ scope.row.sum_return_qty }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="lang.sales" sortable prop="sum_sales_qty" min-width="80px">
          <template slot-scope="scope">
            <svg-icon icon-class="corner-right-down" style="width: 15px; height: 15px; stroke: #6EBE46;" />
            <span style="color: #6EBE46;">{{ scope.row.sum_sales_qty }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="lang.outgoing" sortable prop="sum_outgoing_qty" min-width="80px">
          <template slot-scope="scope">
            <svg-icon icon-class="corner-right-up" style="width: 15px; height: 15px; stroke: #F44336;" />
            <span style="color: #F44336;">{{ scope.row.sum_outgoing_qty }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="lang.outstanding" sortable prop="sisa" min-width="80px"></el-table-column>
      </el-table>

      <el-pagination
        @size-change="changePageTable"
        @current-change="changeCurrentPage"
        :current-page.sync="params.currentPage"
        :page-size="params.per_page"
        layout="prev, pager, next, jumper"
        :total="params.total">
      </el-pagination>
    </div><!-- panel-box -->

    <el-dialog
      :before-close="closeDetail"
      :visible.sync="modalState"
      :title="modalTitle"
      append-to-body
      width="80%">
      <div class="dialog-body">
        <el-table
          stripe
          border
          v-if="modalData"
          v-loading="loadingElement"
          :data="modalData.data"
          @sort-change="changeSortTable"
          @row-click="rowClick">
          <el-table-column :label="lang.date">
            <template slot-scope="scope">
              <i class="el-icon-success"></i> {{scope.row.fdate}}<br/>
              <i class="el-icon-upload"></i> {{scope.row.fcreated_time}}
            </template>
          </el-table-column>
          <el-table-column :label="lang.type">
            <template slot-scope="scope">
              <span>{{ scope.row.type }}</span><br/>
              <!-- <span v-if="scope.row.ref_no">
                {{ scope.row.ref_no }}
              </span> -->
              <router-link
                v-if="scope.row.ref_no"
                :to="{path: computedLink(scope.row)}">
                {{ scope.row.ref_no }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column :label="lang.beginning" prop="beginning_qty"></el-table-column>
          <el-table-column :label="lang.incoming" prop="incoming_qty"></el-table-column>
          <el-table-column :label="lang.outgoing" prop="outgoing_qty"></el-table-column>
          <el-table-column :label="lang.outstanding" prop="balance_qty"></el-table-column>
        </el-table>
        <div v-if="modalData" style="text-align: center; margin-top: 12px;">
          <el-pagination
            @current-change="changeModalCurrentPage"
            :page-size="10"
            layout="prev, pager, next, jumper"
            :total="modalParams.total">
          </el-pagination>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          size="small"
          type="success"
          icon="el-icon-download"
          @click="downloadExcelDetail">
          {{ $lang[langId].download_excel }}
        </el-button>
        <el-button type="info" size="small" @click="closeDetail" icon="el-icon-close">{{ lang.close }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import dateRangePicker from '@/components/modules/DateRangePicker'
var moment = require('moment')
const startDate = moment().add(-6, 'days').format('YYYY-MM-DD')
const endDate = moment().format('YYYY-MM-DD')
export default {
  components: {
    dateRangePicker
  },
  data: function() {
    return {
      loading: true,
      loadingElement: true,
      tableData: [],
      searchValue: null,
      pages: [5, 10, 20],
      modalState: false,
      modalData: {},
      modalTitle: null,
      params: {
        search: null,
        total: null,
        currentPage: 1,
        sort_column: 'product_group_name',
        sort_type: 'asc',
        start_date: endDate,
        end_date: endDate,
        per_page: 10,
        page: 1
      },
      modalParams: {
        page: 1,
        product_id: null,
        total: 0
      }
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
    getData(range = null) {
      this.loading = true
      if (range) {
        this.params.start_date = range.start_date
        this.params.end_date = range.end_date
      }
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'stockmovement'),
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
      if (val.order === null) val.order = this.params.sort_type 
      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.getData()
    },
    changeCurrentPage(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getData()
    },
    getDetailData() {
      this.loadingElement = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        product_id: this.modalParams.product_id,
        per_page: 10,
        page: this.modalParams.page,
        search: null,
        start_date: this.params.start_date,
        end_date: this.params.end_date,
        product_variant_id: this.modalParams.product_variant_id
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'stockmovement/detail'),
        params: params,
        headers: headers
      }).then(response => {
        this.modalData = response.data
        this.modalParams.total = response.data.meta.total
        this.loadingElement = false
      }).catch(error => {
        this.loadingElement = false
      })
    },
    changeModalCurrentPage(page) {
      this.modalParams.page = page
      this.getDetailData()
    },
    openDetail(row) {
      this.modalState = true
      this.modalTitle = row.product_variant_id ? row.product_name + ' - ' + row.product_variant_name : row.product_name
      this.modalParams.product_id = row.product_id
      this.modalParams.product_variant_id = row.product_variant_id
      this.modalParams.total = 0
      this.modalParams.page = 1
      this.getDetailData(row)
    },
    closeDetail() {
      this.modalState = false
      this.modalParams.product_id = null
      this.modalParams.total = 0
      this.modalParams.page = 1
      this.modalData = {}
    },

    downloadExcel() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'stockmovement/export/summary'),
        params: {
          start_date: this.params.start_date,
          end_date: this.params.end_date,
          type: 'xlsx'
        },
        responseType: 'blob',
        headers: headers
      }).then(response => {
        const fileName = 'summary' + '-' + this.params.start_date + '__' + this.params.end_date + '.xlsx'
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        this.loading = false
      }).catch(error => {
        console.log(error, 'error')
        this.loading = false
      })
    },

    downloadExcelDetail() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'stockmovement/export/detail'),
        params: {
          start_date: this.params.start_date,
          end_date: this.params.end_date,
          product_id: this.modalParams.product_id,
          product_variant_id: null,
          type: 'xlsx'
        },
        responseType: 'blob',
        headers: headers
      }).then(response => {
        const fileName = 'summary' + '-' + this.params.start_date + '__' + this.params.end_date + '.xlsx'
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        this.loading = false
      }).catch(error => {
        console.log(error, 'error')
        this.loading = false
      })
    },
    rowClick(row) {
      if (row.type === 'INCOMING' || row.type === 'OUTGOING' || row.type === 'PRODUCTION_OUT' || row.type === 'PRODUCTION_IN') {
        this.$router.push('/inventory/stocksincoming/' + row.id_data)
      }
      if (row.type === 'OPNAME') {
        this.$router.push('/inventory/stocksopname/' + row.id_data)
      }
      if (row.type === 'ONLINE_SALE' || row.type === 'POS_SALE' || row.type === 'ONLINE_CANCEL' || row.type === 'POS_CANCEL') {
        if (row.status !== null) {
          if (row.status === 'X') {
            this.$router.push('/sales/cancelorder/' + row.id_data)
          }
          if (row.status === 'Z') {
            this.$router.push('/sales/completeorder/' + row.id_data)
          } else {
            this.$router.push('/sales/openorder/' + row.id_data)
          }
        }
      }
      if (row.type === 'ONLINE_SALE') {
         console.log("go to return order", row)
      }
    },

    computedLink(row) {
      let link = ''
      if (row.type === 'INCOMING') {
        link = '/inventory/stocksincoming/' + row.id_data
      }
      if (row.type === 'OUTGOING') {
        link = '/inventory/stocksoutgoing/' + row.id_data
      }
      if (row.type === 'PRODUCTION_OUT' || row.type === 'PRODUCTION_IN') {
        link = '/inventory/stocksproduction/' + row.id_data
      }
      if (row.type === 'OPNAME') {
        link = '/inventory/stocksopname/' + row.id_data
      }
      if (row.type === 'ONLINE_SALE' || row.type === 'POS_SALE') {
        if (row.status !== null) {
          if (row.status === 'X') {
            link = '/sales/cancelorder/' + row.id_data
          }
          if (row.status === 'Z') {
            link = '/sales/completeorder/' + row.id_data
          } else {
            link = '/sales/openorder/' + row.id_data
          }
        }
      }
      return link
    }
  },
  mounted() {
    this.getData()
  }
}
</script>
