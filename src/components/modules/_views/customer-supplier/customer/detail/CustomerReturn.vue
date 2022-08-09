<template>
  <el-card
    v-loading="loading"
    class="box-card">
    <div class="card-body">
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
          <el-input class="inline-form" clearable :placeholder="lang.search" prefix-icon="el-icon-search" v-model="searchValue" @change="handleSearch" size="small"></el-input>
        </div>
        <el-table :data="custReturnData" stripe v-loading="loading" @sort-change="changeSortTable">
          <el-table-column :label="lang.order_no" prop="return_no" sortable min-width="140">
            <template slot-scope="props">
              <div v-if="!props.row.return_no">-</div>
              <div v-else>{{ props.row.return_no}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="lang.order_date" prop="freturn_date" sortable min-width="200">
            <template slot-scope="props">
              <div v-if="!props.row.freturn_date">-</div>
              <div v-else>{{ props.row.freturn_date}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="lang.return_amount" prop="ftotal_amount" sortable min-width="190">
            <template slot-scope="props">
              <div v-if="!props.row.ftotal_amount">-</div>
              <div v-else>{{ props.row.ftotal_amount}}</div>
            </template>
          </el-table-column>
            <el-table-column :label="lang.status" width="120" sortable>
            <template slot-scope="props">
              <div v-if="!props.row.status_desc">
                <p>-</p>
              </div>
              <div v-else>
                <div v-if="props.row.status_desc === 'Confirmed'">
                  <el-tag size="mini">{{ rootLang.has_confirm }}</el-tag>
                </div>
                <div v-if="props.row.status_desc === 'Draft'">
                  <el-tag size="mini" type="info">{{ rootLang.draft }}</el-tag>
                </div>
                <div v-if="props.row.status_desc === 'Pending'">
                  <el-tag size="mini" type="warning">{{ rootLang.pending }}</el-tag>
                </div>
                <div v-if="props.row.status_desc === 'Received'">
                  <el-tag size="mini">{{ lang.received }}</el-tag>
                </div>
                <div v-if="props.row.status_desc === 'Shipping '">
                  <el-tag size="mini">{{ rootLang.being_sent }}</el-tag>
                </div>
                <div v-if="props.row.status_desc === 'Shipped '">
                  <el-tag size="mini" type="success">{{ lang.delivered }}</el-tag>
                </div>
                <div v-if="props.row.status_desc === 'Cancel'">
                  <el-tag size="mini" type="danger">{{ lang.cancel }}</el-tag>
                </div>
                <div v-if="props.row.status_desc === 'Completed'">
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
    </div>
  </el-card>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'

export default {
  name: 'CustomerDetailReturn',
  props: ['rootId'],
  data() {
    return {
      loading: false,
      custReturnData: [],
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
        sort_column: 'return_no',
        sort_type: 'asc',
        per_page: 5,
        page: 1,
        store: null,
        search_column: null,
        search_text: ''
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
    },
    rootLang() {
      return this.$lang[this.$store.state.userStores.langId]
    }
  },
  watch: {
    '$store.getters.selectedStore': function() {
      this.getReturnData()
    }
  },
  methods: {
    getReturnData: function() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'customerreturn/' + this.idRoot),
        headers: headers,
        params: this.params
      })
        .then(response => {
          this.custReturnData = response.data.data
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
          this.params.total = 0
          this.loading = false
        })
    },
    changePageTable(val) {
      this.params.per_page = val
      this.getReturnData()
    },
    handleSearch(val) {
      this.params.page = 1
      this.params.currentPage = 1
      this.params.search_text = ''
      this.params.search_column = null
      this.params.search = this.searchValue

      this.getReturnData()
    },
    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      console.log(val)
      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.getReturnData()
    },
    changeCurrentPage(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getReturnData()
    }
  },
  mounted() {
    this.idRoot = this.rootId
    this.getReturnData()
  }
}
</script>

