<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="table-handler-flex">
        <div style="flex-grow: 1;">
          <h4>{{ lang.closed_orders }}</h4>
          <p v-if="!showTable">0 {{ lang.orders}}</p>
          <p v-else>{{ params.total }} {{ lang.orders }}</p>
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
            <el-tag v-if="labelTag" type="info" @close="closeTagLabel" closable>
              {{ labelTag }}
            </el-tag>

            <el-input
              v-model="searchValue"
              :placeholder="lang.search + ' ' + lang.orders"
              size="small"
              prefix-icon="el-icon-search"
              clearable
              class="inline-form input-search"
              @change="handleSearch"
            />

            <!-- <el-button type="info" size="small" @click="showFilter">
              <i class="fa fa-filter" />
              {{ $lang[langId].filter }}
            </el-button> -->
          </div>
        </div>

        <el-table
          v-loading="loading"
          :data="closeOrderData"
          stripe
          border
          class="sales-table-max-height mobile-fix-height-unset"
          @sort-change="changeSortTable"
          @row-click="rowClick">
          <el-table-column :label="lang.order_no" sortable prop="order_no" min-width="160">
            <template slot-scope="props">
              <p>
                <router-link :to="{path: '/sales/completeorder/' + props.row.id}">
                  {{ props.row.order_no }}
                </router-link>
              </p>
            </template>
          </el-table-column>
          <el-table-column :label="lang.order_date" sortable prop="order_date" min-width="130">
            <template slot-scope="props">
              <div v-if="!props.row.forder_date">
                <p>-</p>
              </div>
              <div v-else>
                <p>{{ props.row.forder_date }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="lang.customer" sortable min-width="180" prop="customer_name">
            <template slot-scope="props">
              <div v-if="!props.row.customer_text">
                <p>-</p>
              </div>
              <div v-else>
                <p>{{ props.row.customer_text }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="lang.shipping_to" sortable min-width="170">
            <template slot-scope="props">
              <div v-if="!props.row.shipping_text">
                <p>-</p>
              </div>
              <div v-else>
                <p>{{ props.row.shipping_text }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="lang.total" sortable prop="ftotal_amount" />
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
          <el-table-column :label="lang.last_modified" sortable prop="modified_time" width="150">
            <template slot-scope="props">
              <div v-if="!props.row.modified_time">
                <p>-</p>
              </div>
              <div v-else>
                <p>{{ props.row.modified_time }}</p>
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

    <el-dialog
      :visible.sync="filterDialog"
      :title="$lang[langId].filter"
      :before-close="closeFilter"
      width="360px"
      class="complete-order"
    >
      <div class="text-center">
        <ul class="list-unstyled">
          <li style="border-bottom: 1px solid #eee;">
            <el-button type="text" @click="filterDate('today')">{{ $lang[langId].today }}</el-button>
          </li>
          <li style="border-bottom: 1px solid #eee;">
            <el-button type="text" @click="filterDate('yesterday')">{{ $lang[langId].yesterday }}</el-button>
          </li>
          <li style="border-bottom: 1px solid #eee;">
            <el-button type="text" @click="filterDate('weekago')">{{ $lang[langId].a_week_ago }}</el-button>
          </li>
          <li style="border-bottom: 1px solid #eee;">
            <el-button type="text" @click="filterDate('monthago')">{{ $lang[langId].a_month_ago }}</el-button>
          </li>
          <li style="border-bottom: 1px solid #eee;">
            <el-button type="text" @click="filterDate('thismonth')">{{ $lang[langId].this_month }}</el-button>
          </li>
          <li style="border-bottom: 1px solid #eee;">
            <el-button type="text" @click="filterDate('lastmonth')">{{ $lang[langId].last_month }}</el-button>
          </li>
          <li style="border-bottom: 1px solid #eee;">
            <el-button type="text" @click="filterDate('custom')">{{ $lang[langId].custom }}</el-button>
          </li>
        </ul>
      </div>

      <el-row :gutter="10">
        <el-col :span="12">
          <p>{{ lang.from }}</p>
          <el-date-picker
            v-model="formFilter.startDate"
            :disabled="disableDate"
            :placeholder="$lang[langId].pick_a_day"
            type="date"
            format="dd-MM-yyyy"
            value-format="yyyy-MM-dd"
            style="width: 100% !important;"
          />
        </el-col>
        <el-col :span="12">
          <p>{{ $lang[langId].to_date }}</p>
          <el-date-picker
            v-model="formFilter.endDate"
            :placeholder="$lang[langId].pick_a_day"
            :disabled="disableDate"
            type="date"
            format="dd-MM-yyyy"
            value-format="yyyy-MM-dd"
            style="width: 100% !important;"
          />
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="resetFilter">{{ lang.reset }}</el-button>
        <el-button type="info" disabled v-if="!formFilter.startDate || !formFilter.endDate">{{ $lang[langId].apply }}</el-button>
        <el-button type="primary" @click="saveFilter(formFilter.labelForDate)" v-else>{{ $lang[langId].apply }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import moment from 'moment'

import dateRangePicker from '@/components/modules/DateRangePicker'

export default {
  name: 'CompleteOrder',

  components: {
    dateRangePicker
  },

  data: function() {
    return {
      loading: false,
      showTable: false,
      filterDialog: false,
      disableDate: true,
      dateFilterValue: '',
      closeOrderData: [],
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
        search: null,
        total: null,
        currentPage: 1,
        sort_column: 'order_date',
        sort_type: 'desc',
        per_page: 20,
        page: 1,
        store: null,
        search_column: null,
        search_text: '',
        status: null
      },
      formFilter: {
        startDate: '',
        endDate: '',
        labelForDate: ''
      },
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
    '$store.getters.selectedStore': function(store) {
      this.getCloseOrder()
    }
  },
  methods: {
    getDate() {
      this.params.end_date = moment().format('YYYY-MM-DD')
      this.params.start_date = moment().subtract(6, 'd').format('YYYY-MM-DD')
      this.initParamDate = [this.params.start_date, this.params.end_date]
    },
    getCloseOrder() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'closeorder'),
        params: this.params,
        headers: headers
      })
        .then(response => {
          this.closeOrderData = response.data.data
          this.params.total = response.data.meta.total
          this.loading = false
          this.showTable = true
        })
        .catch(() => {
          this.showTable = false
          this.closeOrderData = []
          this.params.total = 0
          this.loading = false
        })
    },
    changePageTable(val) {
      this.params.per_page = val
      this.getCloseOrder()
    },
    handleSearch(val) {
      this.params.page = 1
      this.params.currentPage = 1
      this.params.search_text = ''
      this.params.per_page = 100
      this.params.search_column = null
      this.params.search = this.searchValue

      this.getCloseOrder()
    },
    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      console.log(val)
      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.getCloseOrder()
    },
    changeCurrentPage(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getCloseOrder()
    },
    showFilter() {
      this.formFilter.startDate = ''
      this.formFilter.endDate = ''
      this.formFilter.labelForDate = this.labelTag
      this.filterDialog = true
    },
    filterDate(block) {
      if (block === 'today') {
        this.disableDate = true
        this.formFilter.startDate = moment().format('YYYY-MM-DD')
        this.formFilter.endDate = moment().format('YYYY-MM-DD')
        this.formFilter.labelForDate = 'today'
      } else if (block === 'yesterday') {
        this.disableDate = true
        this.formFilter.startDate = moment().subtract(1, 'd').format('YYYY-MM-DD')
        this.formFilter.endDate = moment().subtract(1, 'd').format('YYYY-MM-DD')
        this.formFilter.labelForDate = 'yesterday'
      } else if (block === 'weekago') {
        this.disableDate = true
        this.formFilter.startDate = moment().subtract(7, 'd').format('YYYY-MM-DD')
        this.formFilter.endDate = moment().format('YYYY-MM-DD')
        this.formFilter.labelForDate = 'weekago'
      } else if (block === 'monthago') {
        this.disableDate = true
        this.formFilter.startDate = moment().subtract(30, 'd').format('YYYY-MM-DD')
        this.formFilter.endDate = moment().format('YYYY-MM-DD')
        this.formFilter.labelForDate = 'monthago'
      } else if (block === 'thismonth') {
        this.disableDate = true
        this.formFilter.startDate = moment().startOf('month').format('YYYY-MM-DD')
        this.formFilter.endDate = moment().format('YYYY-MM-DD')
        this.formFilter.labelForDate = 'thismonth'
      } else if (block === 'lastmonth') {
        this.disableDate = true
        this.formFilter.startDate = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD')
        this.formFilter.endDate = moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD')
        this.formFilter.labelForDate = 'lastmonth'
      } else if (block === 'custom') {
        this.formFilter.labelForDate = 'custom'
        this.formFilter.startDate = ''
        this.formFilter.endDate = ''
        this.disableDate = false
      }

      if (block !== 'custom') {
        this.saveFilter(this.formFilter.labelForDate)
      }
    },
    closeFilter() {
      this.filterDialog = false
      this.formFilter.startDate = ''
      this.formFilter.endDate = ''
      this.formFilter.labelForDate = ''
      this.disableDate = true
    },
    saveFilter(block) {
      this.params.start_date = this.formFilter.startDate
      this.params.end_date = this.formFilter.endDate
      if (block === 'today') {
        this.labelTag = this.$lang[this.langId].today
      } else if (block === 'yesterday') {
        this.labelTag = this.$lang[this.langId].yesterday
      } else if (block === 'weekago') {
        this.labelTag = this.$lang[this.langId].a_week_ago
      } else if (block === 'monthago') {
        this.labelTag = this.$lang[this.langId].a_month_ago
      } else if (block === 'thismonth') {
        this.labelTag = this.$lang[this.langId].this_month
      } else if (block === 'lastmonth') {
        this.labelTag = this.$lang[this.langId].last_month
      } else if (block === 'custom') {
        this.labelTag = this.$lang[this.langId].custom
      }
      this.getCloseOrder()
      this.filterDialog = false
      this.disableDate = true
    },
    resetFilter() {
      this.formFilter.startDate = ''
      this.formFilter.endDate = ''
      this.formFilter.labelForDate = ''
      this.disableDate = true
    },
    closeTagLabel() {
      this.labelTag = ''
      this.getDate()
      this.getCloseOrder()
    },
    rowClick(row) {
      this.$router.push({ path: '/sales/completeorder/' + row.id })
    },
    datePicked (value) {
      console.log('picked', value)
      this.params.page = 1
      if (value) {
        this.params.start_date = value.start_date
        this.params.end_date = value.end_date
        this.getCloseOrder()
      } else {
        this.getCloseOrder()
      }
    },
  },
  mounted() {
    this.getDate()
    this.getCloseOrder()
  }
}
</script>

