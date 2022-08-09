<template>
  <div>
    <el-card
      v-loading="loading"
      class="box-card">
      <div slot="header" class="table-handler-flex">
        <div>
          <h4>{{ $lang[langId].list }} {{ lang.customer_review }}</h4>
          <p v-if="!showTable">0 {{ lang.customer }}</p>
          <p v-else>{{ params.total }} {{ lang.customer }}</p>
        </div>
      </div>

      <div class="card-body">
        <div v-if="!showTable" class="no-product">
          <p>{{ $lang[langId].no_data }}</p>
          <img src="/static/img/no-data.svg" alt="No Data Picture">
        </div>
        <div v-else>
          <div class="table-handler-flex">
            <div class="mb-4" style="flex-grow: 1;">
              <el-select class="inline-form" v-model="params.per_page" @change="changePageTable" filterable :placeholder="lang.please_select" size="small">
                <el-option v-for="item in pages" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </div>
            <div class="mb-4">
              <el-input class="inline-form input-search" clearable :placeholder="lang.search" prefix-icon="el-icon-search" v-model="searchValue" @change="handleSearch" size="small"></el-input>
            </div>
          </div>

          <el-divider></el-divider>

          <el-table
            :data="customerReviewData"
            v-loading="loading"
            stripe
            class="sales-table-max-height mobile-fix-height-unset"
            @sort-change="changeSortTable">
            <el-table-column :label="lang.customer" prop="customer_name" sortable min-width="140">
              <template slot-scope="props">
                <p v-if="!props.row.customer_name">-</p>
                <p v-else>{{ props.row.customer_name }}</p>
              </template>
            </el-table-column>
            <el-table-column :label="lang.item" prop="deal_title" sortable>
              <template slot-scope="props">
                <p>{{ props.row.deal_title }}
                  <span v-if="props.row.product_combo_name"> - {{ props.row.product_combo_name }}</span>
                  <span v-if="props.row.product_name"> - {{ props.row.product_name }}</span>
                </p>
              </template>
            </el-table-column>
            <el-table-column :label="lang.posted_time" prop="fcreated_time" sortable min-width="160">
              <template slot-scope="props">
                <p v-if="!props.row.fcreated_time">-</p>
                <p v-else>{{ props.row.fcreated_time }}</p>
              </template>
            </el-table-column>
            <el-table-column :label="lang.review" prop="comment" sortable min-width="140">
              <template slot-scope="props">
                <el-rate v-model="props.row.rating"></el-rate>
                <p>{{ props.row.comment }}</p>
              </template>
            </el-table-column>
            <el-table-column :label="lang.reply" prop="reply" min-width="140">
              <template slot-scope="scope">
                <p v-if="!rowState[scope.$index].edited">{{ scope.row.reply }}</p>
                <el-input v-if="rowState[scope.$index].edited" v-model="formEdit.reply" type="textarea"></el-input>
              </template>
            </el-table-column>
            <el-table-column :label="rootLang.action" min-width="140">
              <template slot-scope="scope">
                <button-action-authenticated :permission="['customer/customerreviews', 'edit']" class="edit-button" type="text" v-if="!rowState[scope.$index].edited" @click="editHandle(scope.$index, scope.row)">
                  <svg-icon icon-class="edit"></svg-icon>
                  {{ lang.edit }}
                </button-action-authenticated>
                <button-action-authenticated :permission="['customer/customerreviews', 'destroy']" class="delete-button" type="text" v-if="!rowState[scope.$index].edited" @click="showDeleteDialog(scope.row)">
                  <svg-icon icon-class="trash"></svg-icon>
                  {{ rootLang.delete }}
                </button-action-authenticated>
                <el-button class="cancel-button" type="text" v-if="rowState[scope.$index].edited" @click="cancelHandle(scope.$index)">
                  {{ lang.cancel }}
                </el-button>
                <el-button class="save-button" type="text" v-if="rowState[scope.$index].edited" @click="saveHandle(scope.$index)">
                  <!-- <svg-icon icon-class="save"></svg-icon> -->
                  {{ lang.save }}
                </el-button>
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

    <el-dialog :title="lang.notif_warn" :visible.sync="deleteDialog" width="50%" center :close-on-click-modal="false" :show-close="false">
      <div class="text-center">
        <p>{{ $lang[langId].are_you_want_remove }} {{ lang.customer_review }}</p>
        <p style="font-weight: bold;">{{ deleteData.customer_name }}
          <span v-if="deleteData.deal_title">- {{ deleteData.deal_title }}</span>
          <span v-if="deleteData.product_combo_name">- {{ deleteData.product_combo_name }}</span>
          <span v-if="deleteData.product_name">- {{ deleteData.product_name }}</span>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDeleteDialog">{{ lang.cancel }}</el-button>
        <el-button type="danger" @click="deleteHandle">{{ rootLang.delete }}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'

export default {
  name: 'CustomerReviewList',
  data: function() {
    return {
      loading: false,
      customerReviewData: [],
      rowState: [],
      deleteData: {},
      searchValue: null,
      deleteDialog: false,
      showTable: false,
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
        sort_column: 'customer_name',
        sort_type: 'desc',
        per_page: 10,
        page: 1,
        store: null,
        search_column: null,
        search_text: ''
      },
      formEdit: {
        id: null,
        reply: ''
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
    '$store.getters.selectedStore'() {
      this.getCustomerReview()
    }
  },
  methods: {
    getCustomerReview() {
      if (![...document.getElementById('app').classList].includes('dummy-page')) {
        this.loading = true
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'customerreview'),
          params: this.params,
          headers: headers
        })
          .then(response => {
            this.customerReviewData = response.data.data
            this.params.total = response.data.meta.total
            for (let i = 0; i < this.customerReviewData.length; i++) {
              this.customerReviewData[i].rating = parseInt(this.customerReviewData[i].rating)
            }
            this.rowState = this.customerReviewData.map(row => {
              return { edited: false }
            })
            this.showTable = true
            this.loading = false
            // console.log(response)
          })
          .catch(() => {
            this.params.total = 0
            this.loading = false
          })
      } else {
        this.getMockupData()
      }
    },
    getMockupData() {
      this.showTable = true
      this.params.total = 10
      this.customerReviewData = require('/static/data/mockupCustomerReviews.json')
      this.customerReviewData.map(() => {
        this.rowState.push({
          edited: false
        })
      })
    },
    changePageTable(val) {
      this.params.per_page = val
      this.getCustomerReview()
    },
    handleSearch(val) {
      this.params.page = 1
      this.params.currentPage = 1
      this.params.search_text = ''
      this.params.search_column = null
      this.params.search = this.searchValue

      this.getCustomerReview()
    },
    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      console.log(val)
      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.getCustomerReview()
    },
    changeCurrentPage(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getCustomerReview()
    },
    editHandle(index, row) {
      this.formEdit.id = row.id
      this.formEdit.reply = row.reply
      this.rowState[index].edited = true
    },
    cancelHandle(index) {
      this.formEdit.id = null
      this.formEdit.reply = ''
      this.rowState[index].edited = false
    },
    saveHandle(index) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
        pk: this.formEdit.id,
        name: 'reply',
        value: this.formEdit.reply
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'customerreview/updateattr'),
        headers: headers,
        data
      })
        .then(response => {
          this.result = response.data
          if (response.data.status === 200) {
            this.editData = response.data.data
            this.$message({
              message: 'Success',
              type: 'success'
            })
          }
          this.loading = false
          this.rowState[index].edited = false
          this.getCustomerReview()
        })
        .catch(error => {
          this.$message({
            message: 'Error',
            type: 'error'
          })
          console.log(error)
          this.loading = false
          this.rowState[index].edited = true
        })
      // this.loading = false
      // this.rowState[index].edited = false
    },
    showDeleteDialog(row) {
      this.deleteData = row
      this.deleteDialog = true
    },
    cancelDeleteDialog() {
      this.deleteData = {}
      this.deleteDialog = false
    },
    deleteHandle() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let id = this.deleteData.id

      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'customerreview/' + id),
        headers: headers
      })
        .then(response => {
          this.result = response.data
          if (response.data.status === 200) {
            this.responseDelete = response.data.data
            this.$message({
              message: 'Success',
              type: 'success'
            })
          }
          this.loading = false
          this.deleteDialog = false
          this.getCustomerReview()
        })
        .catch(error => {
          this.$message({
            message: 'Error',
            type: 'error'
          })
          this.loading = false
          this.deleteDialog = false
          console.log(error)
        })
    }
  },
  mounted() {
    this.getCustomerReview()
  }
}
</script>
