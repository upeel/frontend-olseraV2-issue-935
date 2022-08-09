<template>
  <div>
    <el-card class="box-card">
      <div slot="header">
        <div class="row">
          <div class="col-md-12">
            <h4>{{ rootLang.purchase_completed }}</h4>
            <p v-if="!showTable">0 {{ lang.purchase }}</p>
            <p v-else>{{ params.total }} {{ lang.purchase }}</p>
          </div>
        </div>
      </div>

      <div class="card-body">
        <div class="table-handler-flex">
          <div class="mb-4" style="flex-grow: 1;">
            <el-select class="inline-form" v-model="params.per_page" @change="changePageTable($event,'fuelparams')" filterable :placeholder="lang.please_select" size="small">
              <el-option v-for="item in pages" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>

          <div class="mb-4" style="flex-grow: 1;">
            <date-range-picker
              ref="dateRange"
              :init-date="params"
              :attendance="true"
              :all-time="allTimeDate"
              :use-all-time="true"
              @picked="datePicked"
              @reset="resetDate"
            />
          </div>

          <div class="mb-4">
            <el-tag v-if="filterTag" type="info" @close="closeFilterTag" closable>
              {{ filterTag }}
            </el-tag>

            <el-input class="inline-form input-search" clearable :placeholder="lang.search+' '+lang.orders" prefix-icon="el-icon-search" v-model="paramsCustom.searchValue" @change="handleSearch($event,'fuelparams')" size="small"></el-input>

            <!-- <el-button type="info" size="small" @click="toggleFilter">
              <i class="fa fa-filter" />
              {{ $lang[langId].filter }}
            </el-button> -->
          </div>
        </div>

        <el-divider></el-divider>

        <el-table
          v-loading="loading"
          :data="closePurchaseData"
          stripe
          @sort-change="changeSortTable"
          @row-click="rowClick">
          <el-table-column :label="lang.purchase_no" sortable prop="purchase_no" min-width="160">
            <template slot-scope="props">
              <router-link :to="{path: '/purchase/completepurchase/' + props.row.id}">
                {{ props.row.purchase_no }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column :label="lang.order_date" sortable prop="purchase_date" min-width="130">
            <template slot-scope="props">
              <div v-if="!props.row.fpurchase_date">
                -
              </div>
              <div v-else>
                {{ props.row.fpurchase_date }}
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="lang.supplier" sortable min-width="180" prop="supplier_name">
            <template slot-scope="props">
              <div v-if="!props.row.supplier_name">
                -
              </div>
              <div v-else>
                {{ props.row.supplier_name }}
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="lang.amount" sortable prop="ftotal_amount">
            <template slot-scope="props">
              <div v-if="!props.row.ftotal_amount">
                <p>0</p>
              </div>
              <div v-else>
                {{ props.row.ftotal_amount }}
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
          <el-table-column :label="lang.last_modified" sortable prop="modified_time"  width="150">
            <template slot-scope="props">
              <div v-if="!props.row.modified_time">
                -
              </div>
              <div v-else>
                {{ props.row.modified_time }}
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div style="text-align: center;">
          <el-pagination @size-change="changePageTable" @current-change="changeCurrentPage" :current-page.sync="params.currentPage" :page-size="params.per_page" layout="prev, pager, next, jumper" :total="params.total">
          </el-pagination>
        </div>
      </div>
    </el-card>

    <!-- <custom-date-filter
      :show-filter="showFilter"
      @close="dateFilterClose"
      @reset="dateFilterReset"
      @save="dateFilterSave"
    /> -->
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import moment from 'moment'
import CustomDateFilter from 'modules/CustomDateFilter'

import dateRangePicker from '@/components/modules/DateRangePicker'

export default {
  name: 'CompleteList',

  components: {
    CustomDateFilter,
    dateRangePicker
  },

  data() {
    return {
      loading: false,
      showTable: false,
      filterDialog: false,
      disableDate: true,
      dateFilterValue: '',
      closePurchaseData: [],
      labelTag: '',
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
        currentPage: 1,
        sort_column: 'purchase_date',
        sort_type: 'desc',
        per_page: 10,
        page: 1,
        total: null
      },
      paramsCustom: {
        searchValue: null,
        searchColumn: null,
        searchText: ''
      },
      formFilter: {
        startDate: '',
        endDate: '',
        labelForDate: ''
      },
      showFilter: false,
      filterTag: ''
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
    },
    allTimeDate () {
      if (this.params.start_date && this.params.end_date) {
        return false
      } else {
        return true
      }
    }
  },

  watch: {
    '$store.getters.selectedStore': function(store) {
      this.getClosePurchase()
    }
  },

  methods: {
    getDate() {
      this.params.end_date = moment().format('YYYY-MM-DD')
      this.params.start_date = moment().subtract(7, 'd').format('YYYY-MM-DD')
      this.$refs.dateRange.dateChange([
        this.params.start_date, this.params.end_date
      ])
    },
    getClosePurchase(block) {
      if (![...document.getElementById('app').classList].includes('dummy-page')) {
        this.loading = true
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }
        if (block === 'fuelparams') {
          this.$set(this.params, 'search', this.paramsCustom.searchValue)
          this.$set(this.params, 'search_column', this.paramsCustom.searchColumn)
          this.$set(this.params, 'search_text', this.paramsCustom.searchText)
          this.$set(this.params, 'status', null)
        }

        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'closedpurchase'),
          params: this.params,
          headers: headers
        }).then(response => {
          this.closePurchaseData = response.data.data
          this.params.total = response.data.meta.total
          this.loading = false
          this.showTable = true
        }).catch(error => {
          this.loading = false
          if (error.response.data.error.status_code !== 404) {
            this.$notify({
              type: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error
            })
          }
          this.params.total = 0
          this.showTable = false
          this.closePurchaseData = []
        })
      } else {
        this.getMockupData()
      }
    },
    getMockupData() {
      this.params.total = 10
      this.showTable = true
      this.closePurchaseData = require('/static/data/mockupPurchases.json')
    },
    changePageTable(val, block) {
      this.params.per_page = val
      this.getClosePurchase(block)
    },
    handleSearch(val, block) {
      this.params.page = 1
      this.params.currentPage = 1
      this.paramsCustom.searchText = ''
      this.paramsCustom.searchColumn = null
      this.paramsCustom.searchValue = val

      this.getClosePurchase(block)
    },
    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      if (val.order === null) val.order = this.params.sort_type
      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.getClosePurchase()
    },
    changeCurrentPage(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getClosePurchase()
    },

    rowClick(row) {
      this.$router.push({ path: '/purchase/completepurchase/' + row.id })
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
      // this.$delete(this.params, 'start_date')
      // this.$delete(this.params, 'end_date')
      this.params.end_date = moment().format('YYYY-MM-DD')
      this.params.start_date = moment().subtract(7, 'd').format('YYYY-MM-DD')
      this.dateFilterClose()
      this.getClosePurchase()
    },

    dateFilterSave(filter) {
      this.filterTag = filter.labelForDate
      this.$set(this.params, 'start_date', filter.startDate)
      this.$set(this.params, 'end_date', filter.endDate)
      this.dateFilterClose()
      this.getClosePurchase()
    },

    datePicked (value) {
      this.params.page = 1
      if (value) {
        this.params.start_date = value.start_date
        this.params.end_date = value.end_date
        this.getClosePurchase()
      } else {
        this.getClosePurchase()
      }
    },

    resetDate () {
      this.params.page = 1
      this.params.start_date = ''
      this.params.end_date = ''
      // this.$delete(this.params, 'start_date')
      // this.$delete(this.params, 'end_date')
      this.getClosePurchase()
    },

    closeFilterTag() {
      this.dateFilterReset()
    }
  },

  mounted() {
    this.getDate()
    this.getClosePurchase()
  }
}
</script>

