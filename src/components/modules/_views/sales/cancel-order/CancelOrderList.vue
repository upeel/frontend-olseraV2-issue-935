<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="table-handler-flex">
        <div style="flex-grow: 1;">
          <h4>{{ lang.cancelled_orders }}</h4>
          <p>{{ params.total }} {{ lang.orders }}</p>
        </div>
      </div>

      <div class="card-body">
        <div class="table-handler-flex mb-16">
          <div class="mb-4" style="flex-grow: 1;">
            <el-select class="inline-form" v-model="params.per_page" @change="changePageTable" filterable :placeholder="lang.please_select" size="small">
              <el-option v-for="item in pages" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>

          <div class="mb-4" style="flex-grow: 1;">
            <date-range-picker
              :init-date="initParamDate"
              :attendance="true"
              @picked="datePicked"
            />
          </div>

          <div class="mb-4">
            <el-tag v-if="filterTag" type="info" @close="closeFilterTag" closable>
              {{ filterTag }}
            </el-tag>
            <el-input class="inline-form input-search" clearable :placeholder="lang.search+' '+lang.orders" prefix-icon="el-icon-search" v-model="searchValue" @change="handleSearch" size="small"></el-input>
            <!-- <el-button type="info" size="small" @click="toggleFilter">
              <i class="fa fa-filter" />
              {{ $lang[langId].filter }}
            </el-button> -->
          </div>
        </div>

        <el-table
          v-loading="loading"
          :data="cancelOrderData"
          stripe
          border
          class="sales-table-max-height mobile-fix-height-unset"
          @sort-change="changeSortTable"
          @row-click="rowClick">
          <el-table-column :label="lang.order_no" sortable prop="order_no" min-width="160">
            <template slot-scope="props">
              <p>
                <router-link :to="{path: '/sales/cancelorder/' + props.row.id}">
                  {{ props.row.order_no }}
                </router-link>
              </p>
            </template>
          </el-table-column>
          <el-table-column :label="lang.order_date" sortable prop="forder_date" min-width="130">
            <template slot-scope="props">
              <div v-if="!props.row.forder_date">
                <p>-</p>
              </div>
              <div v-else>
                <p>{{ props.row.forder_date }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="lang.customer" sortable min-width="180" prop="customer_text">
            <template slot-scope="props">
              <div v-if="!props.row.customer_text">
                <p>-</p>
              </div>
              <div v-else>
                <p>{{ props.row.customer_text }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="lang.shipping_to" prop="shipping_text" sortable min-width="180" />
          <el-table-column :label="lang.total" sortable prop="ftotal_amount" min-width="150" />
          <el-table-column :label="lang.paid" prop="is_paid" sortable width="100">
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
    </el-card>

    <custom-date-filter
      :show-filter="showFilter"
      @close="dateFilterClose"
      @reset="dateFilterReset"
      @save="dateFilterSave"
    />
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import moment from 'moment'

import CustomDateFilter from 'modules/CustomDateFilter'
import dateRangePicker from '@/components/modules/DateRangePicker'

export default {
  name: 'CancelOrderList',

  components: {
    CustomDateFilter,
    dateRangePicker
  },

  data() {
    return {
      cancelOrderData: [],
      loading: false,
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
        start_date: '',
        end_date: '',
        search: null,
        total: null,
        currentPage: 1,
        sort_column: 'order_no',
        sort_type: 'desc',
        per_page: 20,
        page: 1,
        store: null,
        search_column: null,
        search_text: '',
        status: null
      },
      filterTag: '',
      showFilter: false,
      searchValue: '',
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
    '$store.getters.selectedStore'() {
      this.getCancelOrder()
    }
  },
  methods: {
    getDate() {
      this.params.end_date = moment().format('YYYY-MM-DD')
      this.params.start_date = moment().subtract(6, 'd').format('YYYY-MM-DD')
      this.initParamDate = [this.params.start_date, this.params.end_date]
    },
    getCancelOrder() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      this.cancelOrderData = []

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'cancelledorder'),
        params: this.params,
        headers: headers
      }).then(response => {
        this.cancelOrderData = [ ...response.data.data]
        this.params.total = response.data.meta.total
        this.loading = false
      }).catch(() => {
        this.cancelOrderData = []
        this.params.total = 0
        this.loading = false
      })
    },
    changePageTable(val) {
      this.params.per_page = val
      this.params.page = 1
      this.getCancelOrder()
    },
    handleSearch(val) {
      this.params.page = 1
      this.params.currentPage = 1
      this.params.per_page = 100
      this.params.search_text = ''
      this.params.search_column = null
      this.params.search = this.searchValue

      this.getCancelOrder()
    },
    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      if (val.prop === 'forder_date') val.prop = 'order_date'
      console.log(val)
      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.getCancelOrder()
    },
    changeCurrentPage(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getCancelOrder()
    },
    rowClick(row) {
      this.$router.push({ path: '/sales/cancelorder/' + row.id })
    },

    toggleFilter() {
      if (this.showFilter) {
        this.showFilter = false
      } else {
        this.showFilter = true
      }
    },

    dateFilterClose() {
      this.showFilter = false
    },

    dateFilterReset(data) {
      this.filterTag = '',
      this.$delete(this.params, 'start_date')
      this.$delete(this.params, 'end_date')
      this.dateFilterClose()
      this.getCancelOrder()
    },

    dateFilterSave(filter) {
      this.filterTag = filter.labelForDate
      this.$set(this.params, 'start_date', filter.startDate)
      this.$set(this.params, 'end_date', filter.endDate)
      this.dateFilterClose()
      this.getCancelOrder()
    },

    closeFilterTag() {
      this.dateFilterReset()
    },
    datePicked (value) {
      // console.log('picked', value)
      this.params.page = 1
      if (value) {
        this.params.start_date = value.start_date
        this.params.end_date = value.end_date
        this.getCancelOrder()
      } else {
        this.getCancelOrder()
      }
    },
  },
  mounted() {
    this.getCancelOrder()
    this.getDate()
  }
}
</script>
