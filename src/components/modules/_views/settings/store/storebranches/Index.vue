<template>
  <div>
    <el-card v-if="!showForm" v-loading="loading" class="box-card">
      <div slot="header" class="table-handler-flex">
        <div style="flex-grow: 1;">
          <h4>{{ $lang[langId].list }} {{ lang.store_branches }}</h4>
          <p>{{ params.total }} {{ lang.store }}</p>
        </div>

        <button-action-authenticated
          :permission="['settings/storebranches', 'edit']"
          :disabled="disabledSave"
          size="small"
          type="success"
          icon="el-icon-plus"
          @click="add">
          {{ lang.add }}
        </button-action-authenticated>
      </div>

      <div class="card-body">
        <div class="table-handler-flex">
          <el-select
            v-model="params.per_page"
            :placeholder="lang.please_select"
            filterable
            class="mr-8 inline-form"
            @change="changePageTable">
            <el-option
              v-for="item in pages" :key="item.value"
              :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-input
            v-model="searchValue"
            :placeholder="lang.search"
            clearable
            prefix-icon="el-icon-search"
            class="inline-form input-search"
            @change="handleSearch">
          </el-input>
        </div>

        <el-table :data="data" stripe>
          <el-table-column
            prop="name"
            :label="lang.name"
            width="140">
          </el-table-column>
          <el-table-column
            :label="$lang[langId].url_id"
            prop="url_id"
            width="180">
            <template v-if="scope.row.url_id" slot-scope="scope">
              {{scope.row.url_id}}.myolsera.com
            </template>
          </el-table-column>

          <el-table-column
            :class-name="methodFeatureIsHiddenCellTable('centralized_crm')"
            :label="lang.centralized_crm"
            class="form-in-cell-wrapper"
            width="130"
            prop="centralized_crm">
            <template slot-scope="scope">
              <span
                v-if="isEditing[scope.$index].block !== 'crm'"
                class="editable"
                @click="edit(scope.row, 'crm', scope.$index)">
                <template v-if="scope.row.centralized_crm === 1">
                  {{ lang.yes }}
                </template>
                <template v-else>
                  {{ lang.no }}
                </template>
              </span>
              <div class="form-in-cell" v-if="isEditing[scope.$index].editing && (isEditing[scope.$index].block === 'crm')">
                <el-select
                  v-model="tmp.centralized_crm"
                  size="mini">
                  <el-option :value="1" :label="lang.yes"></el-option>
                  <el-option :value="0" :label="lang.no"></el-option>
                </el-select>
                <el-button size="mini" icon="el-icon-close"
                  @click="cancelManageItems(scope.$index)"
                  type="info">
                </el-button>
                <el-button size="mini" icon="el-icon-check"
                  @click="save(tmp, scope.$index)"
                  type="success">
                </el-button>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            class="form-in-cell-wrapper"
            prop="centralized_product_price"
            :label="lang.centralized_product_price">
            <template slot-scope="scope">
              <span
                v-if="isEditing[scope.$index].block !== 'centralized_product_price'"
                class="editable"
                @click="edit(scope.row, 'centralized_product_price', scope.$index)">
                <template v-if="scope.row.centralized_product_price === 1">
                  {{ lang.yes }}
                </template>
                <template v-else>
                  {{ lang.no }}
                </template>
              </span>
              <div class="form-in-cell" v-if="isEditing[scope.$index].editing && (isEditing[scope.$index].block === 'centralized_product_price')">
                <el-select
                  v-model="tmp.centralized_product_price"
                  size="mini">
                  <el-option :value="1" :label="lang.yes"></el-option>
                  <el-option :value="0" :label="lang.no"></el-option>
                </el-select>
                <el-button size="mini" icon="el-icon-close"
                  @click="cancelManageItems(scope.$index)"
                  type="info">
                </el-button>
                <el-button size="mini" icon="el-icon-check"
                  @click="save(tmp, scope.$index)"
                  type="success">
                </el-button>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            :label="$lang[langId].action">
            <template slot-scope="scope">
              <el-button
                @click="remove({id: scope.row.id})"
                type="danger"
                class="btn-plain"
                icon="el-icon-delete"
                size="mini">
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div>
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
      :role-options="roles"
      @save="save"
      @cancel="cancel">
    </group-form>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import GroupForm from './Form'

const apiEndPoint = 'storebranches/'
import { mixinHiddenFeatureByPlanType } from '@/mixins/mixinHiddenFeatureByPlanType'
import { checkCustomPermission } from '@/mixins/checkCustomPermission'

export default {
  components: {
    GroupForm
  },

  mixins: [mixinHiddenFeatureByPlanType, checkCustomPermission],

  data() {
    return {
      loading: false,
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
        search: '',
        per_page: 5
      },
      searchValue: '',
      disabledSave: false
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
    '$store.getters.selectedStore'() {
      this.getData()
    }
  },

  mounted() {
    this.getData()
  },

  methods: {
    getData() {
      if (![...document.getElementById('app').classList].includes('dummy-page')) {
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
          this.data = response.data.data
          this.params.total = response.data.meta.total
          this.data.map(() => {
            this.isEditing.push({
              editing: false,
              block: ''
            })
          })
          this.loading = false
        }).catch(error => {
          this.loading = false
          this.params.total = 0
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        })
      } else {
        this.getMockupData()
      }
    },
    getMockupData() {
      this.params.total = 10
      this.data = require('/static/data/mockupStoreBranches.json')
      this.data.map(() => {
        this.isEditing.push({
          editing: false,
          block: ''
        })
      })
    },
    add() {
      this.showForm = true
    },
    save(data, index = null) {
      console.log(data)
      let method = 'POST'
      let verb = 'store'
      let id = ''
      if (data.id) {
        method = 'PUT'
        verb = 'updateattr'
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
      if (this.checkCustomPermission('settings/storebranches', 'edit')) {
        this.tmp = {}
        this.isEditing.map(item => {
          item.editing = false
          item.block = ''
        })
        this.isEditing[index].editing = true
        this.isEditing[index].block = block
        this.tmp = Object.assign({}, row)
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
    }
  }
}
</script>
