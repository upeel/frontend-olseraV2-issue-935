<template>
  <div>
    <el-card class="box-card" v-if="!showAddForm && !showDetailForm">
      <div slot="header" class="table-handler-flex">
        <div style="flex-grow: 1;">
          <div class="clearfix">
            <h4>{{ $lang[langId].list }} {{ lang.promotion }}</h4>
            <p>{{ params.total }} {{ lang.item }}</p>
          </div>
        </div>
        <div>
          <button-action-authenticated
            v-if="stageLevel === 'dev' || stageLevel === 'sit'"
            :permission="['promotion/promopos', 'edit']"
            @click="showDialogCopyDiscount = true">
            <svg-icon icon-class="copy-product" /> {{ $lang[langId].copy }} {{ lang.discount}}
          </button-action-authenticated>
          <button-action-authenticated :permission="['promotion/promopos', 'store']" type="primary" icon="el-icon-plus" @click="formHandle('add')">
            {{ lang.add }}
          </button-action-authenticated>
        </div>
      </div>

      <div class="card-body">
        <div class="table-handler-flex">
          <div style="flex-grow: 1;" class="mb-4">
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
          @row-click="formHandle('detail', $event)"
          :data="tableData" stripe v-loading="loading">
          <el-table-column
            :label="lang.title"
            prop="title">
          </el-table-column>
          <el-table-column
            :label="this.$lang[langId].type_promotion"
            prop="promo_type_id">
          </el-table-column>
          <el-table-column
            :label="lang.start"
            prop="active_date">
          </el-table-column>
          <el-table-column
            :label="lang.end"
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
      @update="updateTmp"
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
var moment = require('moment')

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
      tempEdit: [],
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
        url: baseApi(this.selectedStore.url_id, this.langId, 'promosi-pos'),
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
          console.log(response)
        })
        .catch((error) => {
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
        url: baseApi(this.selectedStore.url_id, this.langId, 'promosi-pos/detail/' + id),
        headers
      }).then(response => {
        this.tmp = response.data.data
        this.loading = false
      }).catch((error) => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loading = false
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
      console.log(data)

      data.active_date = moment(data.active_date).format('YYYY-MM-DD')
      data.expiry_date = moment(data.expiry_date).format('YYYY-MM-DD')
      if (data.promo_valid_days.length === 7) {
        data.promo_valid_any_day = 1
      } else {
        data.promo_valid_any_day = 0
      }
      data.promo_valid_days = data.promo_valid_days.join(',')

      if (data.active24h) {
        // data.promo_start_time = moment('00:00', 'HH:mm').format('HH:mm')
        // data.promo_end_time = moment('23:59', 'HH:mm').format('HH:mm')
        data.promo_start_time = ''
        data.promo_end_time = ''
      } else {
        data.promo_start_time = moment(data.promo_start_time).format('HH:mm')
        data.promo_end_time = moment(data.promo_end_time).format('HH:mm')
      }

      // check if not DA
      if (data['promo_type_id'] !== 'DA') {
        if (data['group-promo_buy_product'] && data['group-promo_buy_product'].length > 0) {
          data['group-promo_buy_product'].map((item, idx) => {
            if (data.combine_qty) {
              item.promo_buy_product_id_qty = data.promo_buy_qty
            } else {
              item.promo_buy_product_id_qty = Number.parseInt(item.promo_buy_product_id_qty, 0)
            }
          })
        }

        if (data['group-promo_buy_product_group_id'].length === 1) {
          if (data['group-promo_buy_product_group_id'][0]['promo_buy_product_group_id'] === '' || !data['group-promo_buy_product_group_id'][0]['promo_buy_product_group_id']) {
            this.$delete(data, 'group-promo_buy_product_group_id')
          }
        }
        if (data['group-promo_buy_product_group_id'] && data['group-promo_buy_product_group_id'].length > 0) {
          data['group-promo_buy_product_group_id'].map((item, idx) => {
            if (data.combine_qty) {
              item.promo_buy_product_group_id_qty = data.promo_buy_qty
            } else {
              item.promo_buy_product_group_id_qty = Number.parseInt(item.promo_buy_product_group_id_qty, 0)
            }
          })
        }

        if (data['group-promo_free_product_id'].length === 1) {
          if (data['group-promo_free_product_id'][0]['promo_free_product_id'] === '' || !data['group-promo_free_product_id'][0]['promo_free_product_id']) {
            this.$delete(data, 'group-promo_free_product_id')
          }
        }
        if (data['group-promo_free_product_id'] && data['group-promo_free_product_id'].length > 0) {
          data['group-promo_free_product_id'].map((item, idx) => {
            item.promo_free_product_id_qty = Number.parseInt(item.promo_free_product_id_qty, 0)
          })
        }
      }

      data.promo_is_buy_combination = Number.parseInt(data.promo_is_buy_combination, 0)

      if (data.combineQty) {
        data.valid_for_all_products = 1
        if (data.promo_buy_qty) {
          data.promo_buy_qty = Number.parseInt(data.promo_buy_qty, 0)
        }
      } else {
        data.valid_for_all_products = 0
      }

      data.valid_for_customer_types = data.valid_for_customer_types.join(',')
      data.valid_for_customers = data.valid_for_customers.join(',')

      console.log(data, ':send')
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'promosi-pos/store'),
        headers,
        data
      }).then(response => {
        this.loading = false
        this.disabledSaveAdd = false
        this.showAddForm = false
        this.getData()
        // this.formHandle('detail', response.data.data)
      }).catch((error) => {
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
        url: baseApi(this.selectedStore.url_id, this.langId, 'promosi-pos/delete/' + detailData.id),
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
      }).catch((error) => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loading = false
      })
    },

    updateTmp (data) {
      this.tmp = { ...data}
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
