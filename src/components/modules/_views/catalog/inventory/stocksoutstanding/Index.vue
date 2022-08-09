<template>
  <div>
    <div class="main-content">
      <div class="table-handler-flex">
        <div style="flex-grow: 1;">
          <h4 class="main-content__title">{{ $lang[langId].list }} Stok Outstanding</h4>
          <p class="main-content__subtitle">{{ params.total }} {{ lang.outgoing_stock }}</p>
        </div>

        <!-- <div>
          <el-button
            icon="el-icon-upload"
            @click="importDialog =  true">
            {{ lang.import }}
          </el-button>
          <el-dropdown class="drop-complete" @command="addData">
            <el-button type="primary" icon="el-icon-plus" :disabled="isButtonDisabled">
              {{ lang.add }}
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(command, index) in downloadSelect"
                :key="index"
                :command="index"
                :disabled="command.locked">
                <div class="flex-container">
                  <div class="flex-grow-1">
                    {{ command.label }}
                  </div>
                  <svg-icon v-if="command.locked" icon-class="lock" />
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div> -->
      </div>

      <div class="table-handler-flex mb-16">
        <div class="mb-8">
          <el-select
            v-model="params.per_page"
            :placeholder="lang.please_select"
            filterable
            size="small"
            @change="changePageTable"
            class="inline-form">
            <el-option
              v-for="item in pages"
              :key="item"
              :value="item"
              :label="item + ' ' + lang.rows"
            />
          </el-select>
        </div>

        <div  style="flex-grow: 1" class="mb-8">
          <el-button v-if="bulkPosting" type="primary" :loading="loadingPosting" @click="handleBulkPost">Post stok masuk</el-button>
        </div>

        <div class="mb-8">
          <el-input
            class="inline-form input-search"
            clearable
            :placeholder="lang.search+' '+lang.outgoing_stock_no"
            prefix-icon="el-icon-search"
            v-model="searchValue"
            @change="handleSearch" size="small">
          </el-input>
        </div>
      </div>

      <el-table ref="multipleTable" :data="tableData" border stripe v-loading="loading" @sort-change="changeSortTable" >
        <el-table-column width="40" fixed class-name="text-center" prop="in_out_id">
          <template slot="header" slot-scope="scope">
            <el-checkbox v-model="checkedAll" @change="handleCheckedAll"/>
          </template>
          <template slot-scope="props">
            <el-checkbox v-model="props.row.checked" :disabled="props.row.disableChecked" @change="selectChecked(props.row.in_out_id)" />
          </template>
        </el-table-column>
        <el-table-column :label="$lang[langId].number" sortable prop="trans_no" width="200">
          <template slot-scope="props">
            <router-link :to="{path: '/inventory/stocksoutstanding/' + props.row.in_out_id}">
              {{ props.row.trans_no }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column :label="rootLang.transfer_date" sortable prop="date" width="160">
          <template slot-scope="props">
            {{props.row.fdate}}
          </template>
        </el-table-column>
        <el-table-column :label="rootLang.date_received" sortable prop="ref_date" width="160">
          <template slot-scope="props">
            {{props.row.fref_date}}
          </template>
        </el-table-column>
        <el-table-column :label="'QTY ' + lang.total" sortable prop="ref_date" align="right" width="120">
          <template slot-scope="props">
            {{props.row.total_qty_send}}
          </template>
        </el-table-column>
        <el-table-column :label="'QTY ' + rootLang.accepted" sortable prop="ref_date" align="right" width="120">
          <template slot-scope="props">
            {{props.row.total_qty_received}}
          </template>
        </el-table-column>
        <el-table-column :label="'QTY ' + lang.difference" sortable prop="ref_date" align="right" width="120">
          <template slot-scope="props">
            {{props.row.total_qty_difference }}
          </template>
        </el-table-column>
        <el-table-column :label="lang.status" sortable prop="status_stock" >
          <template slot-scope="props">
            <el-tag size="mini"
              v-if="props.row.status_stock === 'OUTSTANDING'"
              type="warning">
              {{ props.row.status_stock }}
            </el-tag>
            <el-tag size="mini"
              v-else-if="props.row.status_stock === 'POSTED'"
              type="success">
              {{ props.row.status_stock }}
            </el-tag>
            <el-tag size="mini" v-else>
              {{ props.row.status_stock }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="changePageTable"
        @current-change="changeCurrentPage"
        :current-page.sync="params.currentPage"
        :page-size="params.per_page"
        layout="prev, pager, next, jumper"
        :total="params.total">
      </el-pagination>
    </div>

    <el-dialog
      :title="lang.update+lang.status"
      :visible.sync="importDialog"
      max-width="760px">
      <el-row :gutter="10">
        <el-col :md="8">
          <a
            :href="baseURL + 'olsera_stockout_import_template.csv'"
            class="btn btn-default">
            {{ lang.download_template }}
          </a>
        </el-col>

        <el-col :md="16">
          <el-card v-if="dropdownForm">
            <div slot="header" class="clearfix">
              <span>{{ lang.import_from_csv_info }}</span>
            </div>
            <vue-dropzone
              ref="dropzone"
              id="drop1"
              :options="{
                url: baseURL + 'api/' + this.selectedStore.url_id + '/admin/v1/' + this.langId + '/stockoutgoing/importfromcsv',
                headers: {
                  'Authorization' : 'Bearer ' + this.token.access_token,
                  'Cache-Control': null,
                },
                method: 'post',
                acceptedFiles: '.csv'
                }"
              @vdropzone-success="afterComplete"
              @vdropzone-error="failed"
            />
            <el-button
              style="margin-top: 8px"
              @click="removeAllFiles">
              {{ $lang[langId].remove_all_file }}
            </el-button>
          </el-card>
        </el-col>
      </el-row>
    </el-dialog>

  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'

import { getListOutstanding, bulkpostOutstanding } from '@/api/catalog/inventory/outstanding'
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import basicComputedMixin from '@/mixins/basicComputedMixin'
import { isHiddenByFeature } from '@/utils/hiddenFeaturesByPlanType'
// var moment = require('moment')
// const today = moment().format('YYYY-MM-DD')
export default {
  name: 'OutStandingList',
  components: {
    vueDropzone: vue2Dropzone,
    tokenc: ''
  },
  mixins: [basicComputedMixin],
  data() {
    return {
      loading: true,
      isButtonDisabled: false,
      tableData: [],
      statusValue: null,
      searchValue: null,
      importDialog: false,
      dropdownForm: true,
      pages: [5, 10, 20],
      statusSelect: [
        {
          value: '',
          label: this.$store.state.userStores.lang.all
        },
        {
          value: 'Pending',
          label: this.$lang[this.$store.state.userStores.langId].pending
        },
        {
          value: 'Shipping',
          label: this.$lang[this.$store.state.userStores.langId].has_confirm
        },
        {
          value: 'Shipped',
          label: this.$store.state.userStores.lang.delivered
        }
      ],
      downloadSelect: [
        {
          value: 'transfer',
          label: this.$store.state.userStores.lang.transfer_to_store,
          locked: isHiddenByFeature(this.$store.getters.selectedStore.plan_type_id, '/inventory/stocksoutgoing/create?path=transfer')
        },
        {
          value: 'add',
          label: this.$store.state.userStores.lang.add + ' ' + this.$store.state.userStores.lang.outgoing_stock,
          locked: false
        }
      ],
      params: {
        search: null,
        total: null,
        currentPage: 1,
        // sort_column: 'id',
        // sort_type: 'desc',
        per_page: 10,
        page: 1
      },
      storeBrances: [],
      checkedAll: false,
      loadingPosting: false
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

    bulkPosting () {
      let data = []
      this.tableData.map(i => {
        if (i.checked) {
          data.push(i)
        }
      })
      if (data.length > 0) { return true }
      else { return false }
    }
  },
  watch: {
    '$store.getters.selectedStore'() {
      this.getData()
      // this.getStoreBrance()
    }
  },
  mounted() {
    this.getData()
    this.getStoreBrance()
  },
  methods: {
    getData() {
      this.loading = true
      getListOutstanding(this.params)
        .then(response => {
          this.tableData = response.data.data
          this.tableData.map(i => {
            i.checked = false
            i.disableChecked = false
            if (i.status_stock === 'POSTED') {
              i.disableChecked = true
            }
          })
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
    getStoreBrance: function() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'storebranches/'),
        headers: headers
      }).then(response => {
        this.storeBrances = response.data.data
        // this.params.total = response.data.meta.total
        // this.data.map(() => {
        //   this.isEditing.push({
        //     editing: false,
        //     block: ''
        //   })
        // })
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
      if (val.order === null) val.order = this.params.sort_type
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
    addData(file) {
      var add = ''
      if(file === 0) {
        add = 'transfer'
      } else {
        add = 'add'
      }
      this.$router.push({ path: '/inventory/stocksoutgoing/create', query: { path: add } })
    },
    // importDialog() {
    //   this.$router.push({path: '/inventory/importstockout'})
    // }
    afterComplete(file, response) {
      console.log(response)
      if (response.error === 0) {
        this.$notify({
          title: 'Sukses',
          message: response.data + ' Produk.'
        })
        this.importDialog = false
        this.$router.push({path: '/inventory/stocksoutgoing/' + response.id})
      }
    },
    failed(file, message, xhr) {
      console.log('file', file)
      console.log('message', message)
      console.log('xhr', xhr)
      const $ = require('jquery')
      $('.dz-error-message span').text(message.error.error)
    },
    removeAllFiles() {
      this.$refs.dropzone.removeAllFiles()
    },
    goToSinglePage(row) {
      this.$router.push({path: '/inventory/stocksoutstanding/' + row.in_out_id})
    },

    selectChecked (dataId) {
      let table = [ ...this.tableData]
      table.map(i => {
        if (i.in_out_id === dataId && i.status_stock === 'POSTED') {
          i.checked = false
        }
      })
      this.tableData = [ ...table]
      this.$forceUpdate()
    },

    handleCheckedAll (val) {
      let table = [ ...this.tableData]
      if (val) {
        table.map(i => {
          if (i.status_stock === 'POSTED') {
            i.checked = false
          } else {
            i.checked = true
          }
        })
      } else {
        table.map(i => {
          i.checked = false
        })
      }

      this.tableData = [ ...table]
    },

    handleBulkPost () {
      let data = []
      this.tableData.map(i => {
        if(i.checked) { data.push(i.in_out_id) }
      })
      this.loadingPosting = false
      bulkpostOutstanding({
        in_out_id: data.join(',')
      }).then(response => {
        this.getData()
        this.$notify({
          type: 'success',
          title: 'Success',
          message: 'Stok outstanding berhasil dipost ke stok masuk!'
        })
        this.loadingPosting = false
      }).catch(error => {
        this.loadingPosting = false
        this.data = {}
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    }
  }
}
</script>
