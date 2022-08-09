<template>
  <div>
    <el-card class="box-card" v-if="!showAddForm && !showDetailForm">
      <div slot="header" class="table-handler-flex">
        <div style="flex-grow: 1;">
          <h4>{{ $lang[langId].list }} {{ lang.discount_coupon }}</h4>
          <p>{{ params.total }} {{ lang.item }}</p>
        </div>
        <div>
          <button-action-authenticated
            v-if="stageLevel === 'dev' || stageLevel === 'sit'"
            :permission="['promotion/discountvoucher', 'store']"
            @click="showDialogCopyDiscount = true">
            <svg-icon icon-class="copy-product" /> {{ $lang[langId].copy }} {{ lang.discount}}
          </button-action-authenticated>
          <button-action-authenticated :permission="['promotion/discountvoucher', 'store']" type="primary" icon="el-icon-plus" @click="formHandle('add')">
            {{ lang.add }}
          </button-action-authenticated>
        </div>
      </div>

      <div class="card-body">
        <div class="table-handler-flex">
          <div style="flex-grow: 1;">
            <el-select
              class="inline-form"
              v-model="params.per_page"
              @change="changePageTable"
              filterable
              :placeholder="lang.please_select"
              size="small">
              <el-option v-for="item in pages"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>

        <el-divider></el-divider>

        <el-table
          v-loading="loading"
          :data="tableData"
          stripe
          @row-click="formHandle('detail', $event)"
          @sort-change="changeSortTable">
          <el-table-column :label="lang.code" sortable prop="code" min-width="140">
            <template slot-scope="scope">
              <strong>{{ scope.row.code }}</strong>
            </template>
          </el-table-column>
          <el-table-column
            :label="lang.title"
            sortable
            prop="title">
          </el-table-column>
          <el-table-column
            :label="lang.discount"
            sortable
            prop="fdiscount">
          </el-table-column>
          <el-table-column
            :label="lang.start"
            sortable
            prop="active_date">
          </el-table-column>
          <el-table-column
            :label="lang.end"
            sortable
            prop="expiry_date">
          </el-table-column>
          <el-table-column
            :label="lang.expiry"
            sortable
            prop="expiry_date">
          </el-table-column>
          <el-table-column
            :label="lang.usage"
            sortable
            prop="usage_detail">
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

    <add-form
      v-if="showAddForm"
      :saved="disabledSaveAdd"
      :loading="loading"
      @cancel="cancelAdd"
      @save="saveAdd">
    </add-form>

    <detail-form
      v-if="showDetailForm"
      :form-data="tmp"
      :loading-detail="loading"
      @back="backDetail"
      @remove="deleteDetail">
    </detail-form>

    <dialog-copy-discount
      :show="showDialogCopyDiscount"
      @save="refreshData" />
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import { baseApi } from 'src/http-common'
import axios from 'axios'
import addForm from './Create'
import detailForm from './Detail'
import dialogCopyDiscount from './dialogCopyDiscount'

const moment = require('moment')

export default {
  components: {
    addForm,
    detailForm,
    dialogCopyDiscount
  },

  mixins: [basicComputedMixin],

  data() {
    return {
      loading: true,
      showAddForm: false,
      showDetailForm: false,
      disabledSaveAdd: false,
      tableData: [],
      tmp: {},
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
        }
      ],
      params: {
        search: '',
        total: 0,
        currentPage: 1,
        per_page: 10,
        page: 1,
        sort_column: 'published_date',
        sort_type: 'desc'
      },
      showDialogCopyDiscount: false
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
      this.getData(false)
    }
  },

  methods: {
    getData: function(sort) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      var params = []
      if (sort) {
        params = {
          per_page: this.params.per_page,
          page: this.params.page,
          search: '',
          sort_column: this.params.sort_column,
          sort_type: this.params.sort_type
        }
      } else {
        params = {
          per_page: this.params.per_page,
          page: this.params.page,
          search: ''
        }
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'discountvoucher'),
        params: params,
        headers: headers
      })
        .then(response => {
          this.tableData = response.data.data
          this.params.total = response.data.meta.total
          this.loading = false
        })
        .catch(error => {
          this.loading = false
          this.params.total = 0
          if (error.response.data.error.status_code !== 404) {
            this.$notify({
              type: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error
            })
          }
        })
    },
    getSingleData(id) {
      //
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'discountvoucher/' + id),
        headers
      }).then(response => {
        this.tmp = response.data.data
        this.loading = false
      }).catch(error => {
        this.tmp = {}
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
      // this.fresh.valid_customer_types = []
      // this.fresh.valid_customers = []
      // this.fresh.valid_product_groups = []
      // this.fresh.valid_product_combos = []
      // this.fresh.valid_products = []
    },
    changePageTable(val) {
      this.params.per_page = val
      this.getData(false)
    },
    handleSearch(val) {
      this.params.page = 1
      this.params.currentPage = 1
      this.params.search_text = ''
      this.params.search_column = null
      this.params.search = this.searchValue

      this.getData(false)
    },
    changeCurrentPage(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getData(false)
    },
    formHandle(block, item) {
      if (block === 'add') {
        this.showAddForm = true
      } else if (block === 'detail') {
        let id = item.id
        this.getSingleData(id)
        this.showDetailForm = true
      }
    },
    cancelAdd() {
      this.showAddForm = false
    },
    saveAdd(addData) {
      this.loading = true
      this.disabledSaveAdd = true
      let data = Object.assign({}, addData)

      data.active_date = moment(data.active_date).format('YYYY-MM-DD')
      data.expiry_date = moment(data.expiry_date).format('YYYY-MM-DD')
      if (data.no_expiry === 1) {
        this.$delete(data, 'expiry_date')
      } else {
        this.$delete(data, 'no_expiry')
      }
      if (data.valid_for_all_products === 0) {
        // this.$delete(data, 'valid_for_all_products')
        data.valid_for_all_products = 0
        data.valid_product_groups = data.valid_product_groups.join(',')
        data.valid_products = data.valid_products.join(',')
      } else {
        this.$delete(data, 'valid_product_groups')
        this.$delete(data, 'valid_products')
      }
      if (data.valid_for_all_product_combos === 0) {
        // this.$delete(data, 'valid_for_all_product_combos')
        data.valid_for_all_product_combos = 0
        data.valid_product_combos = data.valid_product_combos.join(',')
      } else {
        this.$delete(data, 'valid_product_combos')
      }
      if (data.valid_for_all_brands === 0) {
        // this.$delete(data, 'valid_for_all_brands')
        data.valid_for_all_brands = 0
        data.valid_brands = data.valid_brands.join(',')
      } else {
        this.$delete(data, 'valid_brands')
      }
      if (data.valid_for_all_customers === 0) {
        // this.$delete(data, 'valid_for_all_customers')
        data.valid_for_all_customers = 0
        data.valid_for_customer_types = data.valid_customer_types.join(',')
        data.valid_customers = data.valid_customers.join(',')
      } else {
        this.$delete(data, 'valid_customer_types')
        this.$delete(data, 'valid_customers')
      }
      if (data.amount_type === 'percent') {
        this.$delete(data, 'discount_amount')
        data.discount_percent = Number.parseFloat(data.discount_percent)
      } else {
        this.$delete(data, 'discount_percent')
      }
      if (data.no_usage_limit === 0) {
        this.$delete(data, 'no_usage_limit')
        data.usage_limit = Number.parseInt(data.usage_limit, 0)
      } else {
        this.$delete(data, 'usage_limit')
      }

      this.$delete(data, 'amount_type')

      console.log(data)
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'discountvoucher'),
        headers,
        data
      }).then(response => {
        this.loading = false
        this.disabledSaveAdd = false
        this.showAddForm = false
        this.getData(false)
        // this.formHandle('detail', response.data.data)
        this.$message({
          type: 'success',
          message: 'Success'
        })
      }).catch(error => {
        this.loading = false
        this.disabledSaveAdd = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    backDetail() {
      this.showDetailForm = false
    },
    deleteDetail(detailData) {
      //
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'discountvoucher/' + detailData.id),
        headers
      }).then(response => {
        let result = response.data.data
        this.$message({
          type: 'success',
          message: result.message
        })
        this.loading = false
        this.showDetailForm = false
        this.getData(false)
      }).catch(error => {
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      console.log(val)
      this.params.sort_type = val.order
      if (val.prop === 'fdiscount') {
        this.params.sort_column = 'discount'
      } else {
        this.params.sort_column = val.prop
      }
      this.getData(true)
    },

    refreshData () {
      this.showDialogCopyDiscount = false
      this.getData()
    }
  },

  mounted() {
    this.getData(false)
  }
}
</script>
