<template>
  <el-row :gutter="12">
    <el-col :md="18">
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
            <el-table :data="custLoyaltyData" stripe v-loading="loading" @sort-change="changeSortTable">
              <el-table-column :label="lang.order_no" prop="order_no" sortable min-width="170">
                <template slot-scope="props">
                  <div v-if="!props.row.order_no">-</div>
                  <div v-else>{{ props.row.order_no}}</div>
                </template>
              </el-table-column>
              <el-table-column :label="lang.received" prop="earned_points" sortable min-width="120">
                <template slot-scope="props">
                  <div v-if="!props.row.earned_points">-</div>
                  <div v-else>{{ props.row.earned_points}}</div>
                </template>
              </el-table-column>
              <el-table-column :label="lang.redeemed" prop="redeemed_points" sortable min-width="120">
                <template slot-scope="props">
                  <div v-if="!props.row.redeemed_points">-</div>
                  <div v-else>
                    <div>{{ props.row.redeemed_points}}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column :label="$lang[langId].detail" prop="deducted_details" sortable min-width="200">
                <template slot-scope="props">
                  <div v-if="!props.row.deducted_details">-</div>
                  <div v-else>
                    <div v-for="item in props.row.deducted_details" :key="item.id">
                      {{ item.fref_no }}
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column :label="lang.balance" prop="balance_points" sortable>
                <template slot-scope="props">
                  <div v-if="!props.row.balance_points">-</div>
                  <div v-else>{{ props.row.balance_points}}</div>
                </template>
              </el-table-column>
              <el-table-column :label="lang.end_date" prop="expiry_date" sortable min-width="160">
                <template slot-scope="props">
                  <div v-if="!props.row.expiry_date">-</div>
                  <div v-else>{{ props.row.expiry_date}}</div>
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
    </el-col>

    <el-col :md="6">
      <el-card
        v-loading="loading"
        shadow="never">
        <p>{{ lang.total_loyalty_points }}</p>
        <svg-icon icon-class="star"></svg-icon>
        <span>{{ balancePoints }}</span>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'

export default {
  name: 'CustomerDetailLoyalty',
  props: ['rootId'],
  data() {
    return {
      loading: false,
      custLoyaltyData: [],
      balancePoints: '',
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
    }
  },
  watch: {
    '$store.getters.selectedStore': function() {
      this.getLoyaltyPoints()
    }
  },
  methods: {
    getLoyaltyPoints: function(store) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'customerloyaltypoints/' + this.idRoot),
        headers: headers,
        params: this.params
      })
        .then(response => {
          this.custLoyaltyData = response.data.data
          this.params.total = response.data.meta.total
          this.balancePoints = response.data.balance_points
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
          console.log(error)
        })
    },
    changePageTable(val) {
      this.params.per_page = val
      this.getLoyaltyPoints()
    },
    handleSearch(val) {
      this.params.page = 1
      this.params.currentPage = 1
      this.params.search_text = ''
      this.params.search_column = null
      this.params.search = this.searchValue

      this.getLoyaltyPoints()
    },
    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      console.log(val)
      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.getLoyaltyPoints()
    },
    changeCurrentPage(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getLoyaltyPoints()
    }
  },
  mounted() {
    this.idRoot = this.rootId
    this.getLoyaltyPoints()
  }
}
</script>

