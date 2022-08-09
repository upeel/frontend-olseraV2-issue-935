<template>
  <div class="content-wrapper">
    <section class="content income-expense">
      <el-card class="box-card">
        <div slot="header" class="table-handler-flex">
          <div style="flex-grow: 1;">
            <h4>{{ lang.transactions }}</h4>
            <p v-if="!showTable">0 {{ lang.transactions }}</p>
            <p v-else>{{ params.total }} {{ lang.transactions }}</p>
          </div>

          <div>
            <router-link :to="{name: 'Transaction Create Expense'}">
              <button-action-authenticated :permission="['inex/inextrans', 'store']" type="danger" icon="el-icon-plus">
                {{ lang.expense }}
              </button-action-authenticated>
            </router-link>
            <router-link :to="{name: 'Transaction Create Income'}">
              <button-action-authenticated :permission="['inex/inextrans', 'store']" type="primary" icon="el-icon-plus">
                {{ lang.income }}
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
            <div class="mb-4">
              <el-input class="inline-form" clearable :placeholder="lang.search" prefix-icon="el-icon-search" v-model="searchValue" @change="handleSearch" size="small"></el-input>
              <el-date-picker v-model="params.trans_date" type="date" @change="changeDateFilter" :placeholder="this.$lang[langId].pick_a_day" format="dd MMMM yyyy" size="small">
              </el-date-picker>
            </div>
          </div>

          <el-divider></el-divider>

          <el-table
            :data="transactionData"
            stripe
            v-loading="loading"
            class="pointer"
            @sort-change="changeSortTable">
            <el-table-column
              :label="lang.transaction_no"
              sortable
              prop="trans_no"
              min-width="160">
              <template slot-scope="props">
                <router-link :to="{ path: '/transaction/' + props.row.id }">
                  {{ props.row.trans_no  }}
                </router-link>
                <!-- <strong>{{ props.row.trans_no }}</strong> -->
              </template>
            </el-table-column>
            <el-table-column
              :label="lang.transaction_type"
              sortable
              prop="trans_type_name"
              min-width="140">
              <template slot-scope="props">
                <div v-if="!props.row.trans_type_name">
                  <p>-</p>
                </div>
                <div v-else>
                  <div v-if="props.row.type === 'I'">
                    <svg-icon icon-class="corner-right-down" />
                    <span style="color: #6EBE46;">{{ props.row.trans_type_name }}</span>
                  </div>
                  <div v-if="props.row.type === 'E'">
                    <svg-icon icon-class="corner-right-up" />
                    <span style="color: #F44336;">{{ props.row.trans_type_name }}</span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="lang.staff"
              sortable
              prop="user_name"
              min-width="120">
              <template slot-scope="props">
                <div v-if="!props.row.user_name">
                  <p>-</p>
                </div>
                <div v-else>
                  <p>{{ props.row.user_name }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="lang.time"
              sortable
              prop="trans_time"
              min-width="100">
              <template slot-scope="props">
                <div v-if="!props.row.trans_time_only">
                  <p>-</p>
                </div>
                <div v-else>
                  <p>{{ props.row.trans_time_only }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="lang.amount"
              sortable
              min-width="120">
              <template slot-scope="props">
                <div v-if="rowState[props.$index].edited">
                  <input-money v-model="formEdit.amount" />
                </div>
                <div v-else>
                  <p v-if="!props.row.amount">-</p>
                  <p v-else>{{ props.row.famount }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="lang.notes"
              sortable
              min-width="160">
              <template slot-scope="props">
                <div v-if="rowState[props.$index].edited">
                  <el-input v-model="formEdit.notes"></el-input>
                </div>
                <div v-else>
                  <p v-if="!props.row.notes">-</p>
                  <p v-else>{{ props.row.notes }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="rootLang.action" min-width="140">
              <template slot-scope="scope">
                <button-action-authenticated :permission="['inex/inextrans', 'destroy']" class="delete-button" type="text" v-if="!rowState[scope.$index].edited" @click="showDeleteDialog(scope.row)" style="color: #000000;">
                  <i class="el-icon-delete"></i>
                  {{ rootLang.delete }}
                </button-action-authenticated>
                <button-action-authenticated :permission="['inex/inextrans', 'edit']" class="edit-button" type="text" v-if="!rowState[scope.$index].edited" @click="editHandle(scope.$index, scope.row)">
                  <i class="el-icon-edit"></i>
                  {{ lang.edit }}
                </button-action-authenticated>
                <el-button class="cancel-button" type="text" v-if="rowState[scope.$index].edited" @click="cancelHandle(scope.$index)" style="color: #575757;">
                  <i class="el-icon-circle-close-outline"></i>
                  {{ lang.cancel }}
                </el-button>
                <el-button class="save-button" type="text" v-if="rowState[scope.$index].edited" @click="saveHandle(scope.$index)" style="color: #6EBE46;">
                  <i class="el-icon-circle-check-outline"></i>
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
      </el-card>

      <el-dialog :visible.sync="deleteDialog" width="50%" center :close-on-click-modal="false" :show-close="false">
        <span slot="title">
          <svg-icon icon-class="alert-triangle" style="stroke: #F44336;"></svg-icon>
          {{ lang.notif_warn }}
        </span>
        <div class="text-center">
          <p>{{ lang.are_you_sure_to_remove_this_data }}
            <span style="font-weight: bold;">"{{ deleteData.trans_type_name }}"</span>
          </p>
          <p style="color: #AFB0AF;">{{ this.$lang[langId].info_delete_item }}</p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelDeleteDialog">{{ lang.cancel }}</el-button>
          <el-button type="danger" @click="deleteHandle">{{ this.$lang[langId].delete }}</el-button>
        </span>
      </el-dialog>
    </section>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import moment from 'moment'
import InputMoney from '@/components/InputMoneyV2'

export default {
  name: 'TransactionList',
  components: {
    InputMoney
  },
  data: function() {
    return {
      loading: false,
      transactionData: [],
      searchValue: null,
      showTable: false,
      rowState: [],
      deleteDialog: false,
      deleteData: {},
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
        trans_date: moment().format('YYYY-MM-DD'),
        search: null,
        total: null,
        currentPage: 1,
        sort_column: 'id',
        sort_type: 'desc',
        per_page: 5,
        page: 1,
        store: null,
        search_column: null,
        search_text: ''
      },
      formEdit: {
        id: null,
        amount: null,
        notes: ''
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
    '$store.getters.selectedStore': function(store) {
      this.getTransaction()
    }
  },

  methods: {
    getTransaction: function() {
      if (![...document.getElementById('app').classList].includes('dummy-page')) {
        this.loading = true
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'inextrans'),
          params: this.params,
          headers: headers
        })
          .then(response => {
            this.transactionData = response.data.data
            this.params.total = response.data.meta.total
            this.rowState = this.transactionData.map(row => {
              return { edited: false }
            })
            this.loading = false
            this.showTable = true
          })
          .catch((error) => {
            if (error.response.data.error.status_code !== 404) {
              this.$notify({
                type: 'warning',
                title: error.response.data.error.message,
                message: error.response.data.error.error
              })
            }
            this.transactionData = []
            this.showTable = false
            this.loading = false
          })
      } else {
        this.getMockupData()
      }
    },
    getMockupData() {
      this.showTable = true
      this.params.total = 10
      this.transactionData = require('/static/data/mockupTransaction.json')
      this.rowState = []
      this.transactionData.map(() => {
        this.rowState.push({ edited: false })
      })
    },
    changePageTable(val) {
      this.params.per_page = val
      this.params.page = 1
      this.params.currentPage = 1
      this.getTransaction()
    },
    handleSearch(val) {
      this.params.page = 1
      this.params.currentPage = 1
      this.params.search_text = ''
      this.params.search_column = null
      this.params.search = this.searchValue

      this.getTransaction()
    },
    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      console.log(val)
      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.getTransaction()
    },
    changeCurrentPage(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getTransaction()
    },
    changeDateFilter(val) {
      if (val === null) {
        this.params.trans_date = moment().format('YYYY-MM-DD')
        console.log('val', val)
        console.log('val', this.params.trans_date)
      } else {
        this.params.trans_date = moment(val).format('YYYY-MM-DD')
      }
      this.getTransaction()
    },
    editHandle(index, row) {
      this.formEdit.id = row.id
      this.formEdit.amount = row.amount
      this.formEdit.notes = row.notes
      this.rowState[index].edited = true
    },
    cancelHandle(index) {
      this.formEdit.id = null
      this.formEdit.amount = null
      this.formEdit.notes = ''
      this.rowState[index].edited = false
    },
    saveHandle(index) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
        amount: this.formEdit.amount,
        notes: this.formEdit.notes
      }
      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'inextrans/' + this.formEdit.id),
        headers: headers,
        data
      })
        .then(response => {
          this.saveResult = response.data.data
          this.$message({
            message: 'Success',
            type: 'success'
          })
          this.loading = false
          this.rowState[index].edited = false
          this.getTransaction()
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.loading = false
          this.rowState[index].edited = true
        })
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
        url: baseApi(this.selectedStore.url_id, this.langId, 'inextrans/' + id),
        headers: headers
      })
        .then(response => {
          this.responseDelete = response.data.data
          this.$message({
            message: 'Success',
            type: 'success'
          })
          this.loading = false
          this.deleteDialog = false
          this.getTransaction()
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.loading = false
          this.deleteDialog = false
        })
    }
  },

  mounted() {
    this.getTransaction()
  }
}
</script>
