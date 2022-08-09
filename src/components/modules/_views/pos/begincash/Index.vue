<template>
  <div class="content-wrapper" v-loading="loading">
    <section class="content sales-list no-subpage">
      <el-card v-if="!showForm" class="box-card">
        <div slot="header" class="table-handler-flex">
          <h4 class="box-title" style="flex-grow: 1;">{{ $lang[langId].begin_cash_daily }}</h4>
          <button-action-authenticated
            :permission="['settings/begincash', 'store']"
            :disabled="disabledSave"
            type="success"
            icon="el-icon-plus"
            @click="add">
            {{ lang.add }}
          </button-action-authenticated>
        </div>

        <div class="card-body">
          <div class="table-handler-flex">
            <div style="flex-grow: 1;">
              <el-select class="inline-form" v-model="params.per_page" @change="changePageTable" filterable :placeholder="lang.please_select" size="small">
                <el-option v-for="item in pages" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </div>

            <div>
              <date-picker class="mr-4 mb-4" @picked="filterByDate" />

              <el-input
                class="inline-form mb-4 input-search"
                clearable
                :placeholder="lang.search"
                prefix-icon="el-icon-search"
                v-model="searchValue"
                @change="handleSearch">
              </el-input>
            </div>
          </div>

          <el-divider></el-divider>

          <el-table :data="data" stripe>
            <el-table-column
              prop="cash_date"
              :label="lang.date"
              width="140">
            </el-table-column>
            <el-table-column
              prop="user_name"
              :label="lang.cashier"
              width="100">
            </el-table-column>
            <el-table-column
              prop="shift_name"
              :label="lang.shift"
              width="100">
            </el-table-column>
            <el-table-column
              class="form-in-cell-wrapper"
              prop="begin_amount"
              width="180"
              :label="lang.beginning_cash">
              <template slot-scope="scope">
                <span
                  v-if="isEditing[scope.$index].block !== 'begin_amount'"
                  class="editable"
                  @click="edit(scope.row, 'begin_amount', scope.$index)">
                  {{scope.row.begin_amount}}
                </span>
                <div class="form-in-cell" v-if="isEditing[scope.$index].editing && (isEditing[scope.$index].block === 'begin_amount')">
                  <div class="el-input--mini">
                    <input-money v-model="tmp.begin_amount" />
                  </div>
                  <div style="margin-top: 4px; text-align: right;">
                    <el-button size="mini" icon="el-icon-close"
                      @click="cancelManageItems(scope.$index)"
                      type="info">
                    </el-button>
                    <el-button size="mini" icon="el-icon-check"
                      @click="save(tmp, scope.$index)"
                      type="success">
                    </el-button>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              class="form-in-cell-wrapper"
              prop="closing_amount"
              width="180"
              :label="lang.closing_cash">
              <template slot-scope="scope">
                <span
                  v-if="isEditing[scope.$index].block !== 'closing_amount'"
                  class="editable"
                  @click="edit(scope.row, 'closing_amount', scope.$index)">
                  {{scope.row.closing_amount}}
                </span>
                <div class="form-in-cell" v-if="isEditing[scope.$index].editing && (isEditing[scope.$index].block === 'closing_amount')">
                  <div class="el-input--mini">
                    <input-money v-model="tmp.closing_amount" />
                  </div>
                  <div style="margin-top: 4px; text-align: right;">
                    <el-button
                      size="mini" icon="el-icon-close"
                      @click="cancelManageItems(scope.$index)"
                      type="info">
                    </el-button>
                    <el-button
                      size="mini" icon="el-icon-check"
                      @click="save(tmp, scope.$index)"
                      type="success">
                    </el-button>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$lang[langId].action">
              <template slot-scope="scope">
                <button-action-authenticated
                  :permission="['settings/begincash', 'store']"
                  @click="remove({id: scope.row.id})"
                  type="danger"
                  class="btn-plain"
                  icon="el-icon-delete"
                  size="mini">
                </button-action-authenticated>
              </template>
            </el-table-column>
          </el-table>

          <div v-if="data && data.length" style="text-align: center;">
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

      <group-form
        v-if="showForm"
        :saved="saved"
        :loading="loading"
        @save="save"
        @cancel="cancel">
      </group-form>
    </section>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import GroupForm from './Form'
import DatePicker from 'components/modules/DatePicker'
import InputMoney from '@/components/InputMoneyV2'
import ButtonActionAuthenticated from '../../../../ButtonActionAuthenticated.vue'

const apiEndPoint = 'begincash/'
var moment = require('moment')

export default {
  components: {
    InputMoney,
    GroupForm,
    DatePicker,
    ButtonActionAuthenticated
  },

  data() {
    return {
      disabledSave: false,
      loading: true,
      loadingItems: false,
      saved: false,
      data: [],
      isEditing: [],
      showForm: false,
      disabledButton: false,
      tmp: {},
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
        cash_date: moment().format('YYYY-MM-DD'),
        search: '',
        per_page: 5
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
    lang() {
      return this.$store.state.userStores.lang
    },
    langId() {
      return this.$store.state.userStores.langId
    }
  },

  watch: {
    '$store.getters.selectedStore': function() {
      this.getData()
    }
  },

  mounted() {
    this.getData()
  },

  methods: {
    getData() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint),
        params: this.params,
        headers: headers
      }).then(response => {
        if (response.data.data) {
          this.data = response.data.data
          this.params.total = response.data.meta.total
          this.data.map(() => {
            this.isEditing.push({
              editing: false,
              block: ''
            })
          })
        }
        this.loading = false
      }).catch(error => {
        // console.log(error)
        this.loading = false
        this.params.total = 0
        if (error.statusCode !== 404) {
          this.$notify({
            type: 'warning',
            title: error.message,
            message: error.string
          })
        }
      })
    },
    add() {
      this.showForm = true
    },
    save(data, index = null) {
      let method = 'POST'
      let verb = 'store'
      let id = ''
      console.log(index)
      if (data.id) {
        method = 'PUT'
        verb = 'update'
        id = data.id
      }

      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method,
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + verb + '/' + id),
        headers: headers,
        data
      }).then(response => {
        console.log(index, ':response')
        if (index !== null) {
          this.cancelManageItems(index)
        }
        this.saved = true
        this.showForm = false
        this.getData()
        this.$message({
          type: 'success',
          message: 'saved'
        })
      }).catch(error => {
        this.saved = false
        this.loading = false
        this.isEditing = []
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    sortsChanged(data) {
      this.saveSorts()
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
    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      console.log(val)
      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.getData()
    },
    changeCurrentPage(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getData()
    },
    edit(row, block, index) {
      this.tmp = {}
      this.isEditing.map(item => {
        item.editing = false
        item.block = ''
      })
      this.isEditing[index].editing = true
      this.isEditing[index].block = block
      this.tmp = Object.assign({}, row)
      if (this.tmp.currency_id === 'IDR') {
        this.tmp.begin_amount = Number.parseInt(this.tmp.begin_amount)
        this.tmp.closing_amount = Number.parseInt(this.tmp.closing_amount)
      }
    },
    remove(data) {
      this.loadingItems = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + 'delete/' + data.id),
        headers
      }).then(response => {
        this.data.map((item, idx) => {
          if (item.id === data.id) {
            this.data.splice(idx, 1)
          }
        })
        this.loadingItems = false
        this.$message({
          type: 'success',
          message: response.data.data.message
        })
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loadingItems = false
      })
    },
    cancel() {
      this.showForm = false
    },
    cancelManageItems(index) {
      this.isEditing[index].editing = false
      this.isEditing[index].block = ''
      this.tmp = {}
    },
    filterByDate(date) {
      this.params.cash_date = date
      this.getData()
    }
  }
}
</script>
