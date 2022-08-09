<template>
  <div>
    <el-card class="box-card" v-if="!showAddForm && !showDetailForm">
      <div slot="header" class="table-handler-flex">
        <div style="flex-grow: 1;">
          <h4>{{ $lang[langId].list }} {{ lang.sales_discount }}</h4>
          <p>{{ params.total }} {{ lang.items }}</p>
        </div>
        <div>
          <button-action-authenticated
            v-if="stageLevel === 'dev' || stageLevel === 'sit'"
            :permission="['promotion/discountsales', 'store']"
            @click="showDialogCopyDiscount = true">
            <svg-icon icon-class="copy-product" /> {{ $lang[langId].copy }} {{ lang.discount}}
          </button-action-authenticated>
          <button-action-authenticated
            :permission="['promotion/discountsales', 'store']"
            type="primary"
            icon="el-icon-plus"
            @click="formHandle('add')">
            {{ lang.add }}
          </button-action-authenticated>
        </div>
      </div>

      <div class="card-body">
        <div class="table-handler-flex">
          <div class="mb-4" style="flex-grow: 1;">
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
          class="pointer"
          @row-click="formHandle('detail', $event)">
          <el-table-column
            :label="lang.min_order"
            prop="fmin_order_amount">
          </el-table-column>
          <el-table-column
            :label="lang.discount">
            <template slot-scope="scope">
              <template v-if="scope.row.discount_rate > 0">
                {{scope.row.fdiscount}}
              </template>
              <template v-else>
                {{scope.row.fdiscount_amount}}
              </template>
            </template>
          </el-table-column>
          <el-table-column
            :label="lang.start"
            prop="active_date">
          </el-table-column>
          <el-table-column
            :label="lang.expiry"
            prop="expiry_date">
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
  
  data: function() {
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
      this.getData()
    }
  },

  methods: {
    getData: function() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'discountsales'),
        params: {
          per_page: this.params.per_page,
          page: this.params.page,
          search: ''
        },
        headers: headers
      })
        .then(response => {
          this.tableData = response.data.data
          this.params.total = response.data.meta.total
          this.loading = false
          // console.log(response)
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
    getSingleData(id) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'discountsales/' + id),
        headers: headers
      }).then(response => {
        this.tmp = response.data.data
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    changePageTable(val) {
      this.params.per_page = val
      this.getData()
    },
    handleSearch(val) {
      this.params.page = 1
      this.params.currentPage = 1
      this.params.search_text = ''
      this.params.search_column = null
      this.params.search = this.searchValue

      this.getData()
    },
    changeCurrentPage(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getData()
    },
    formHandle(block, item) {
      if (block === 'add') {
        this.showAddForm = true
      } else if (block === 'detail') {
        if (!this.checkCustomPermission('promotion/discountsales', 'show')) {
          return
        }
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
      let obj = Object.assign({}, addData)
      obj.valid_customer_types = obj.valid_customer_types.join(',')
      obj.valid_for_brands = obj.valid_for_brands.join(',')
      obj.active_date = moment(obj.active_date).format('YYYY-MM-DD')
      obj.expiry_date = moment(obj.expiry_date).format('YYYY-MM-DD')
      let data = {
        active_date: obj.active_date,
        valid_customer_types: obj.valid_customer_types,
        valid_for_brands: obj.valid_for_brands,
        discount_amount: obj.discount_amount,
        discount_percent: obj.discount_percent,
        min_order_amount: obj.min_order_amount,
        to_store_id: obj.to_store_id,
        to_allstore_id: obj.to_allstore_id
      }
      if (obj.no_expiry === 1) {
        data.no_expiry = 1
      } else {
        data.expiry_date = obj.expiry_date
      }
      // console.log(data)
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'discountsales'),
        headers,
        data
      }).then(response => {
        this.loading = false
        this.disabledSaveAdd = false
        this.showAddForm = false
        this.getData()
        // this.formHandle('detail', response.data.data)
      }).catch(error => {
        // console.log(error)
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
        url: baseApi(this.selectedStore.url_id, this.langId, 'discountsales/' + detailData.id),
        headers
      }).then(response => {
        let result = response.data.data
        this.$message({
          type: 'success',
          message: result.message
        })
        this.loading = false
        this.showDetailForm = false
        this.getData()
      }).catch(error => {
        this.$notify({
          type: 'warning',
          message: error
        })
        this.loading = false
      })
    },

    refreshData () {
      this.showDialogCopyDiscount = false
      this.getData()
    }
  },

  mounted() {
    this.getData()
  }
}
</script>
