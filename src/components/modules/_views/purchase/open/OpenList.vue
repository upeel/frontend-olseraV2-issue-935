<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="table-handler-flex">
        <div style="flex-grow: 1;">
          <h4>{{ rootLang.purchase_need_process }}</h4>
          <p>{{ params.total }} {{ lang.purchase }}</p>
        </div>
        <div v-if="!computedAccess">
          <router-link :to="{name: 'Open Purchase Create'}">
            <button-action-authenticated :permission="['purchase/openpurchases', 'store']" type="success" icon="el-icon-plus">
              {{ lang.add }}
            </button-action-authenticated>
          </router-link>
        </div>
      </div>

      <div class="card-body">
        <div class="table-handler-flex">
          <div class="mb-4" style="flex-grow: 1;">
            <el-select class="inline-form" v-model="params.per_page" @change="changePageTable" filterable :placeholder="lang.please_select" size="small">
              <el-option v-for="item in pages" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>

          <div class="mb-4" style="flex-grow: 1;">
            <date-range-picker
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

            <el-input class="inline-form input-search" clearable :placeholder="lang.search+' '+lang.orders" prefix-icon="el-icon-search" v-model="searchValue" @change="handleSearch" size="small"></el-input>
            
            <el-select class="inline-form" v-model="statusValue" @change="handleStatusSelect" :placeholder="lang.please_select" size="small">
              <el-option v-for="item in statusSelect" :key="item.value" :label="item.label" :value="item"></el-option>
            </el-select>

            <!-- <el-button type="info" size="small" @click="toggleFilter">
              <i class="fa fa-filter" />
              {{ $lang[langId].filter }}
            </el-button> -->
          </div>
        </div>

        <el-divider></el-divider>
        
        <el-table
          v-loading="loading"
          :data="openPurchaseData"
          stripe
          @sort-change="changeSortTable"
          @row-click="rowClick">
          <el-table-column
            :label="lang.purchase_no"
            class-name="table-align-top"
            sortable="custom"
            prop="purchase_no"
            width="180">
            <template slot-scope="props">
              <router-link v-if="stageLevel === 'dev'" :to="{ path: '/purchase/openpurchasev2/' + props.row.id }">
                {{ props.row.purchase_no }}
              </router-link>
              <router-link v-else :to="{ path: '/purchase/openpurchase/' + props.row.id }">
                {{ props.row.purchase_no }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column
            width="140"
            :label="lang.order_date"
            class-name="table-align-top"
            sortable="custom"
            prop="purchase_date">
            <template slot-scope="props">
              <div v-if="!props.row.fpurchase_date">
                -
              </div>
              <div v-else>
                {{ props.row.fpurchase_date }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            min-width="210"
            :label="lang.supplier"
            class-name="table-align-top"
            sortable="custom"
            prop="supplier_name">
            <template slot-scope="props">
              <div v-if="!props.row.supplier_name">
                -
              </div>
              <div v-else>
                <div style="font-weight: bold">{{ props.row.supplier_name }}</div>
                <span>{{ props.row.notes }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            min-width="140"
            :label="lang.amount"
            class-name="table-align-top"
            sortable="custom"
            prop="ftotal_amount">
            <template slot-scope="props">
              {{ props.row.ftotal_amount }}
            </template>
          </el-table-column>
          <el-table-column
            :label="lang.status"
            class-name="table-align-top"
            width="120"
            prop="status"
            sortable="custom">
            <template slot-scope="props">
              <div v-if="!props.row.status">
                -
              </div>
              <div v-else>
                <div v-if="props.row.status === 'P'">
                  <el-tag size="mini" type="warning">{{ props.row.status_desc }}</el-tag>
                </div>
                <div v-else>
                  <el-tag size="mini" type="primary">{{ props.row.status_desc }}</el-tag>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="lang.paid"
            class-name="table-align-top"
            prop="is_paid"
            sortable="custom"
            width="150">
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

    <!-- <custom-date-filter
      :show-filter="showFilter"
      @close="dateFilterClose"
      @reset="dateFilterReset"
      @save="dateFilterSave"
    /> -->
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import { baseApi } from 'src/http-common'
import axios from 'axios'
import CustomDateFilter from 'modules/CustomDateFilter'

import dateRangePicker from '@/components/modules/DateRangePicker'

export default {
  name: 'OpenList',

  components: {
    CustomDateFilter,
    dateRangePicker
  },

  mixins: [basicComputedMixin],

  data() {
    return {
      loading: false,
      openPurchaseData: [],
      statusValue: null,
      searchValue: null,
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
      statusSelect: [
        {
          value: '',
          label: this.$store.state.userStores.lang.all
        },
        {
          value: 'P',
          label: this.$lang[this.$store.state.userStores.langId].pending
        },
        {
          value: 'R',
          label: this.$store.state.userStores.lang.rewarded
        }
      ],
      params: {
        search: null,
        total: null,
        currentPage: 1,
        sort_column: 'id',
        sort_type: 'desc',
        per_page: 10,
        page: 1,
        store: null,
        search_column: null,
        search_text: '',
        status: null
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
    accessByStore () {
      return ['cvsms']
    },
    computedAccess () {
      if (this.accessByStore.includes(this.selectedStore.url_id) && this.selectedStore.role_id === 'PT') {
        return true
      }
    },

    allTimeDate () {
      if (this.params.start_date === '' && this.params.end_date === '') {
        return true
      } else if (this.params.start_date !== '' && this.params.end_date !== '') {
        return false
      } else {
        return true
      }
    }
  },
  watch: {
    '$store.getters.selectedStore': function() {
      this.getOpenPurchase()
    }
  },

  methods: {
    getOpenPurchase(store) {
      if (![...document.getElementById('app').classList].includes('dummy-page')) {
        this.loading = true
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }

        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'openpurchase'),
          params: this.params,
          headers: headers
        })
          .then(response => {
            this.openPurchaseData = response.data.data
            this.params.total = response.data.meta.total
            this.loading = false
          })
          .catch((error) => {
            this.loading = false
            this.openPurchaseData = []
            this.params.total = 0
            if (error.response.data.error.status_code !== 404) {
              this.$notify({
                type: 'warning',
                title: error.response.data.error.message,
                message: error.response.data.error.error
              })
            }
          })
      } else {
        this.getMockupData()
      }
    },
    getMockupData() {
      this.params.total = 10
      this.openPurchaseData = require('/static/data/mockupPurchases.json')
    },
    changePageTable(val) {
      this.params.per_page = val
      this.getOpenPurchase()
    },
    handleSearch(val) {
      this.params.page = 1
      this.params.currentPage = 1
      // this.params.search_text = ''
      // this.params.search_column = null
      this.params.search = this.searchValue

      this.getOpenPurchase()
    },
    handleStatusSelect(val) {
      if (val.label === this.lang.all) {
        this.statusValue.value = ''
        this.params.page = 1
        this.params.currentPage = 1
        this.params.search_text = ''
        this.params.search_column = null

        this.getOpenPurchase()
      } else {
        this.params.page = 1
        this.params.currentPage = 1
        this.params.search_text = this.statusValue.value
        this.params.search_column = 'status'

        this.getOpenPurchase()
      }
    },
    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      if (val.order === null) val.order = this.params.sort_type
      if (val.prop === 'fpurchase_date') val.prop = 'purchase_date'
      console.log(val)
      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.openPurchaseData = []
      this.getOpenPurchase()
    },
    changeCurrentPage(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getOpenPurchase()
    },
    rowClick(row) {
      this.$router.push({ path: '/purchase/openpurchase/' + row.id })
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
      this.getOpenPurchase()
    },

    dateFilterSave(filter) {
      this.filterTag = filter.labelForDate
      this.$set(this.params, 'start_date', filter.startDate)
      this.$set(this.params, 'end_date', filter.endDate)
      this.dateFilterClose()
      this.getOpenPurchase()
    },

    datePicked (value) {
      this.params.page = 1
      if (value) {
        this.params.start_date = value.start_date
        this.params.end_date = value.end_date
        this.getOpenPurchase()
      } else {
        this.getOpenPurchase()
      }
    },

    resetDate () {
      this.params.page = 1
      this.params.start_date = ''
      this.params.end_date = ''
      this.getOpenPurchase()
    },

    closeFilterTag() {
      this.dateFilterReset()
    }
  },

  mounted() {
    this.getOpenPurchase()
  }
}
</script>
