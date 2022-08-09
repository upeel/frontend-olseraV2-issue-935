<template>
  <div v-loading="loading">
    <div v-if="!showDetail">
      <bs-table
        :sortable="true"
        :header="headerTable"
        @sort="handleSort">
        <template
          v-for="(item, key) in data">
          <tr :key="key" class="active">
            <td>{{ item.product_group_name }}</td>
            <td>{{ item.total_qty }}</td>
            <td>{{ item.ftotal_amount }}</td>
          </tr>
          <template v-if="item.subgroups && item.subgroups.length">
            <tr
              v-for="(subgroup, subgroupKey) in item.subgroups"
              :key="subgroupKey"
              class="pointer"
              @click="getData(subgroup, true)">
              <td>
                <div class="ml-24">{{ subgroup.product_group_name }}</div>
              </td>
              <td>{{ subgroup.total_qty }}</td>
              <td>{{ subgroup.ftotal_amount }}</td>
            </tr>
          </template>
        </template>
      </bs-table>

      <div
        v-if="total > 0"
        class="table-handler-bottom">
        <el-pagination
          :total="total"
          :page-sizes="[50, 100]"
          :page-size="15"
          :current-page.sync="currentPage"
          background
          layout="sizes, prev, pager, next"
          @current-change="handleChangePage"
          @size-change="handleChangeSizePage"
        />
      </div>
    </div>
    <div v-if="showDetail">
      <table-category-detail
        :data="dataSales"
        :summary="summaryDetail"
        :lang="lang"
        :lang-id="langId"
        :total="totalSales"
        :current-page="paramDetail.page"
        @changePage="handleChangePageDetail"
        @back="getBack"
        @showdetaildata="showDetailData"
      />
    </div>
  </div>
</template>

<script>
import { baseApi, service } from 'src/http-common'
import axios from 'axios'
import TableCategoryDetail from './_table-categorydetail'
export default {
  name: 'TableCategory',
  components: {
    TableCategoryDetail
  },
  props: ['data', 'lang', 'summary', 'params', 'total', 'currentPage', 'showDetail'],
  computed: {
    token() {
      if (this.$store.getters.webviewMode) {
        return this.$store.getters.webviewToken
      } else {
        return this.$store.getters.token
      }
    },
    selectedStore() {
      if (this.$store.getters.webviewMode) {
        return this.$store.getters.webviewSelectedStore
      } else {
        return this.$store.getters.selectedStore
      }
    },
    langId() {
      return this.$store.state.userStores.langId
    },

    headerTable () {
      return [
        {
          name: this.lang.category
        },
        {
          name: this.lang.sold_qty,
          // sort: true,
          // sort_by: 'qty',
          // asc: true
        },
        {
          name: this.lang.sales_amount,
          sort: true,
          sort_by: 'sales_amount',
          asc: true
        }
      ]
    }
  },
  data() {
    return {
      loading: false,
      dataSales: [],
      totalSales: 0,
      row: [],
      // showDetail: false,
      summaryDetail: {},
      tempCategory: null,
      paramDetail: {
        page: 1,
        per_page: 50,
        from: this.params.from,
        to: this.params.to
      }
    }
  },
  methods: {
    handleChangePage(page) {
      this.$emit('changePage', page)
      this.$emit('currentPage', this.currentPage)
    },
    handleChangeSizePage(page) {
      this.currentPage = 1
      this.$emit('changeSizePage', page)
    },

    getData(row, fromTable) {
      this.loading = true
      this.showDetail = false
      this.dataSales = []

      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      if (fromTable) {
        this.tempCategory = row.product_group_id
      }

      if (this.paramDetail.from !== this.params.from) {
        this.paramDetail.from = this.params.from
      }
      if (this.paramDetail.to !== this.params.to) {
        this.paramDetail.to = this.params.to
      }

      let params = this.paramDetail
      params.group_id = this.tempCategory

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'salesreports/salesitemsbydate'),
        params: params,
        headers
      }).then(response => {
        this.dataSales = response.data.data
        if (response.data.meta) {
          this.totalSales = response.data.meta.total
        }
        this.summaryDetail = response.data.totaldata
        this.showDetail = true
        this.$emit('setParams', params)
        this.$emit('showDetail', true)
        this.loading = false
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.dataSales = []
        this.showDetail = false
        this.summaryDetail = {}
        this.loading = false
      })
    },
    getBack() {
      this.dataSales = []
      this.summaryDetail = {}
      this.totalSales = 0
      this.showDetail = false
      this.row = []
      this.$emit('showDetail', false)
      this.tempCategory = null
      this.paramDetail = {
        page: 1,
        per_page: 50,
        from: this.params.from,
        to: this.params.to
      }
    },
    handleChangePageDetail(page) {
      this.paramDetail.page = page
      // this.params.sort_by = ''
      this.getData(page, false)
    },
    showDetailData(path, data) {
      if (this.$store.getters.webviewMode) {
        const apiURL = '/api/' + this.selectedStore.url_id + '/admin/v1/' + this.langId + '/salesreports/' + path
        let type = '/return,'
        if (!data.return_no) {
          type = '/order,'
        }
        window.location = type + data.order_no + ',' + data.status + ',' + data.id + ',' + this.selectedStore.url_id
      } else {
        let path = '/sales/openorder/'
        if (!data.return_no) {
          if (data.status === 'X') {
            path = '/sales/cancelorder/'  
          } else if (data.status === 'Z') {
            path = '/sales/completeorder/'
          }
        } else {
          path = '/sales/returnorder/'
        }
        this.$router.push({
          path: path + data.id
        })
      }
    },

    handleSort(data) {
      this.headerTable.map(i => {
        if (data.sort) {
          if (data.sort_by === i.sort_by) {
            i.asc = !data.asc
          } else {
            i.asc = true
          }
        }
      })
      this.$emit('sort', data)
    }
  }
}
</script>
