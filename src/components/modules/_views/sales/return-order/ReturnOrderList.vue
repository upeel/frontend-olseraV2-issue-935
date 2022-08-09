<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="table-handler-flex">
        <div style="flex-grow: 1;">
          <h4>{{ lang.return_orders }}</h4>
          <p v-if="!showTable">0 {{ lang.orders}}</p>
          <p v-else>{{ params.total }} {{ lang.orders }}</p>
        </div>
        <div>
          <router-link :to="{name: 'Return Order Create'}">
            <button-action-authenticated
              :permission="['sales/salesreturns', 'store']"
              type="primary"
              icon="el-icon-plus">
              {{ lang.add }}
            </button-action-authenticated>
          </router-link>
        </div>
      </div>

      <div class="card-body">
        <div class="table-handler-flex mb-16">
          <div class="mb-4" style="flex-grow: 1;">
            <el-select class="inline-form" v-model="params.per_page" @change="changePageTable" filterable :placeholder="lang.please_select" size="small">
              <el-option v-for="item in pages" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
          <div class="mb-4">
            <el-input class="inline-form input-search" clearable :placeholder="lang.search +' '+ lang.orders" prefix-icon="el-icon-search" v-model="searchValue" @change="handleSearch" size="small"></el-input>
          </div>
        </div>

        <el-table
          v-loading="loading"
          :data="returnOrderData"
          stripe
          border
          class="sales-table-max-height mobile-fix-height-unset"
          @sort-change="changeSortTable"
          @row-click="rowClick">
          <el-table-column :label="lang.order_no" sortable prop="return_no" min-width="160">
            <template slot-scope="props">
              <p>
                <router-link :to="{path: '/sales/returnorder/' + props.row.id}">
                  {{ props.row.return_no }}
                </router-link>
              </p>
            </template>
          </el-table-column>
          <el-table-column :label="lang.date" sortable prop="freturn_date"  min-width="110">
            <template slot-scope="props">
              <div v-if="!props.row.freturn_date">
                <p>-</p>
              </div>
              <div v-else>
                <p>{{ props.row.freturn_date }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="lang.customer" sortable prop="customer_text" min-width="180">
            <template slot-scope="props">
              <div v-if="!props.row.customer_text">
                <p>-</p>
              </div>
              <div v-else>
                <p>{{ props.row.customer_text }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="lang.amount" sortable prop="ftotal_amount" min-width="150" />
          <el-table-column :label="lang.status" sortable  min-width="100">
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
        </el-table>

        <div class="block">
          <el-pagination @size-change="changePageTable" @current-change="changeCurrentPage" :current-page.sync="params.currentPage" :page-size="params.per_page" layout="prev, pager, next, jumper" :total="params.total">
          </el-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'

export default {
  name: 'ReturnOrder',

  data: function() {
    return {
      loading: false,
      showTable: false,
      dateFilterValue: '',
      returnOrderData: [],
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
        sort_column: 'return_no',
        sort_type: 'desc',
        per_page: 20,
        page: 1,
        store: null,
        search_column: null,
        search_text: '',
        status: null
      },
      searchValue: ''
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
      this.getReturnOrder()
    }
  },
  methods: {
    getReturnOrder() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'salesreturn'),
        params: this.params,
        headers: headers
      })
        .then(response => {
          this.returnOrderData = response.data.data
          this.params.total = response.data.meta.total
          this.loading = false
          this.showTable = true
        })
        .catch(error => {
          this.loading = false
          this.returnOrderData = []
          this.params.total = 0
        })
    },
    changePageTable(val) {
      this.params.per_page = val
      this.getReturnOrder()
    },
    handleSearch(val) {
      this.params.page = 1
      this.params.currentPage = 1
      this.params.per_page = 100
      this.params.search_text = ''
      this.params.search_column = null
      this.params.search = this.searchValue

      this.getReturnOrder()
    },
    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      console.log(val)
      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.getReturnOrder()
    },
    changeCurrentPage(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getReturnOrder()
    },
    rowClick(row) {
      this.$router.push({ path: '/sales/returnorder/' + row.id })
    },
  },
  mounted() {
    this.getReturnOrder()
    // this.getDate()
  }
}
</script>
