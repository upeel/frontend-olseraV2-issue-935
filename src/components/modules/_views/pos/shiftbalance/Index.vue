<template>
  <div class="content-wrapper" v-loading="loading">
    <section class="content sales-list no-subpage">
      <el-card v-if="!showForm" class="box-card">
        <div slot="header" class="table-handler-flex">
          <h4 class="box-title">{{ lang.shift_summary }}</h4>
        </div>

        <div class="card-body">
          <div class="table-handler-flex">
            <div class="mb-4" style="flex-grow: 1;">
              <el-select class="inline-form" v-model="params.per_page" @change="changePageTable" filterable :placeholder="lang.please_select" size="small">
                <el-option v-for="item in pages" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </div>
            <div>
              <date-range-picker class="mb-4" @picked="filterByDate" />
              <el-input
                class="inline-form input-search mb-4"
                clearable
                :placeholder="lang.search"
                prefix-icon="el-icon-search"
                v-model="searchValue"
                @change="handleSearch">
              </el-input>
              <el-button type="primary" :loading="loadingExport" @click="handleExport">Export Excel</el-button>
            </div>
          </div>

          <el-divider></el-divider>

          <el-table :data="data" stripe @row-click="rowClick">
            <el-table-column
              prop="fshift_date"
              :label="lang.date"
              min-width="100">
            </el-table-column>
            <el-table-column
              prop="cashier_name"
              :label="lang.cashier"
              min-width="120">
            </el-table-column>
            <el-table-column
              prop="start_time"
              :label="lang.start"
              width="180">
            </el-table-column>
            <el-table-column
              prop="end_time"
              width="180"
              :label="lang.end">
            </el-table-column>
            <el-table-column
              prop="ftotal_expected_amount"
              width="140"
              :label="lang.expected">
            </el-table-column>
            <el-table-column
              prop="ftotal_actual_amount"
              width="140"
              :label="lang.actual">
            </el-table-column>
            <el-table-column
              prop="ftotal_difference_amount"
              :label="lang.difference">
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
      </el-card>
    </section>
    <el-dialog 
      :visible.sync="showDetail"
      :title="dataShift.fshift_date + ' ' + dataShift.cashier_name"
      width="70%">
      <div>
        <div class="flex-container p-8">
          <div class="full-width">
            <p style="font-weight: bold">{{ lang.cashier }}</p>
            <p style="font-weight: bold">{{ lang.shift }}</p>
            <p style="font-weight: bold">{{ lang.cash_expected }}</p>
            <div style="margin-left: 15px">
              <p>{{ lang.starting_in_drawer }}</p>
              <p>{{ lang.cash_sales }}</p>
              <p>{{ lang.cash_refund }}</p>
              <p>{{ lang.cash_void }}</p>
              <p>{{ lang.cash_pay_in }}</p>
              <p>{{ lang.cash_pay_out }}</p>
            </div>
            <p style="font-weight: bold">{{ lang.cash_actual }}</p>
            <p style="font-weight: bold">{{ lang.cash_difference }}</p>
            <div v-if="dataShift.additional.length > 0">
              <div v-for="(item, key) in dataShift.additional" :key="key">
                <p style="font-weight: bold">{{ item.payment_mode_name }}</p>
                <p style="margin-left: 10px">{{ lang.sales }}</p>
                <p v-if="item.refund_amount !== '0.00'" style="margin-left: 10px"> {{ $lang[langId].salesreturn }} </p>
                <p v-if="item.void_amount !== '0.00'" style="margin-left: 10px"> {{ lang.void }} </p>
              </div>
            </div>
          </div>
          <div class="full-width text-right" >
            <p style="font-weight: bold">{{ dataShift.cashier_name }}</p>
            <p style="font-weight: bold">{{ dataShift.fstart_time }} - {{ dataShift.fend_time }}</p>
            <p style="font-weight: bold">{{ dataShift.fcash_expected_amount }}</p>
            <p>{{ dataShift.fcash_begin_amount }}</p>
            <p>{{ dataShift.fcash_sales_amount }}</p>
            <p>{{ dataShift.fcash_refund_amount }}</p>
            <p>{{ dataShift.fcash_void_amount }}</p>
            <p>{{ dataShift.fcash_pay_in_amount }}</p>
            <p>{{ dataShift.fcash_pay_out_amount }}</p>
            <p style="font-weight: bold">{{ dataShift.fcash_actual_amount }}</p>
            <p style="font-weight: bold">{{ dataShift.fcash_difference_amount }}</p>
            <div v-if="dataShift.additional.length > 0">
              <div v-for="(item, key) in dataShift.additional" :key="key">
                <p style="font-weight: bold">{{ item.factual_amount }}</p>
                <p>{{ item.fsales_amount }}</p>
                <p v-if="item.refund_amount !== '0.00'" > {{ item.frefund_amount }} </p>
                <p v-else-if="item.void_amount !== '0.00'" > - {{ item.fvoid_amount }} </p>
              </div>
            </div>
          </div>
        </div>
        <el-row style="background: #eee; padding-left: 5px; padding-right: 5px; padding-top: 5px">
          <el-col :md="9">
            <p style="font-weight: bold">{{ lang.total_expected }}</p>
            <p style="font-weight: bold">{{lang.total_actual }}</p>
            <p style="font-weight: bold">{{ lang.total_difference }}</p>
          </el-col>
          <el-col :md="15" style="text-align: right">
            <p style="font-weight: bold">{{ dataShift.ftotal_expected_amount }}</p>
            <p style="font-weight: bold">{{ dataShift.ftotal_actual_amount }}</p>
            <p style="font-weight: bold">{{ dataShift.ftotal_difference_amount }}</p>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import DateRangePicker from 'components/modules/DateRangePicker'

import { exportShiftbalance } from '@/api/pos/shiftbalance'
var moment = require('moment')
const apiEndPoint = 'shiftbalance'

export default {
  components: {
    DateRangePicker
  },

  data() {
    return {
      loading: true,
      loadingItems: false,
      saved: false,
      data: [],
      isEditing: [],
      showForm: false,
      disabledButton: false,
      searchValue: '',
      tmp: {},
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
        search: '',
        per_page: 5,
        start_date: moment().format('YYYY-MM-DD'),
        end_date: moment().format('YYYY-MM-DD')
      },
      dataShift: {
        additional: []
      },
      showDetail: false,
      loadingExport: false
    }
  },

  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    token() {
      return this.$store.state.user.token
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    langId() {
      return this.$store.state.userStores.langId
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
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint),
        params: this.params,
        headers: headers
      }).then(response => {
        if (response.data.data) {
          this.data = response.data.data
          this.params.total = response.data.meta.total
          this.data.map(() => {
            this.isEditing.push({
              editing: false,
              block: ''
            })
          })
        }
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.data = []
        this.params.total = 0
        if (error.statusCode !== 404) {
          this.$notify({
            type: 'warning',
            title: error.message,
            message: error.string
          })
        }
      })
    },
    sortsChanged(data) {
      this.saveSorts()
    },
    changePageTable(val) {
      this.params.per_page = val
      this.getData()
    },
    handleSearch(val) {
      this.params.page = 1
      this.params.search = this.searchValue
      this.getData()
    },
    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      // console.log(val)
      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.getData()
    },
    changeCurrentPage(val) {
      this.params.page = val
      this.getData()
    },
    filterByDate(date) {
      this.params.start_date = date.start_date
      this.params.end_date = date.end_date
      this.getData()
    },
    rowClick(row) {
      this.loading = true
      this.dataShift = {}
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + '/detail/' + row.id),
        headers: headers
      }).then(response => {
        this.dataShift = response.data.data
        this.showDetail = true
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.showDetail = false
        this.dataShift = []
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    handleExport() {
      // console.log('logdat', data)
      this.loadingExport = true
      let param = { ...this.params}
      exportShiftbalance(param).then(response => {
        const fileName = 'shiftbalance' + '-' + param.start_date + '-' + param.end_date + '__' + '.xlsx'
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        this.loadingExport = false
      }).catch(error => {
        console.log(error, 'error')
        this.loadingExport = false
      })
    },
  }
}
</script>
