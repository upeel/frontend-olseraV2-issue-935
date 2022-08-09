<template>
  <div>
    <div class="main-content">
      <div slot="header" class="table-handler-flex">
        <div style="flex-grow: 1;">
          <h4 class="main-content__title">{{ lang.stock_opname }}</h4>
          <p class="main-content__subtitle">{{ params.total }} {{ lang.stock_opname }}</p>
        </div>

        <div>
          <button-action-authenticated :permission="['inventory/stockopname', 'store']"
            icon="el-icon-upload"
            @click="importDialog = true">
            {{ lang.import }}
          </button-action-authenticated>
          <button-action-authenticated :permission="['inventory/stockopname', 'store']" type="primary" icon="el-icon-plus" @click="addData">
            {{ lang.add }}
          </button-action-authenticated>
        </div>
      </div>

      <div class="table-handler-flex mb-16">
        <div class="mb-4" style="flex-grow: 1;">
          <el-select class="inline-form" v-model="params.per_page" @change="changePageTable" filterable :placeholder="lang.please_select" size="small">
            <el-option
              v-for="item in pages"
              :key="item"
              :value="item"
              :label="item + ' ' + lang.rows"
            />
          </el-select>
        </div>

        <div class="mb-4">
          <el-input
            class="inline-form input-search"
            clearable
            :placeholder="lang.search+' '+lang.stock_opname_no"
            prefix-icon="el-icon-search"
            v-model="searchValue"
            @change="handleSearch" size="small">
          </el-input>
        </div>
      </div>

      <el-table :data="tableData" stripe border v-loading="loading" @sort-change="changeSortTable">
        <el-table-column :label="$lang[langId].number" sortable prop="trans_no" width="160">
          <template slot-scope="props">
            <router-link :to="{path: '/inventory/stocksopname/' + props.row.id}">
              {{ props.row.trans_no }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column :label="lang.date" sortable prop="date" width="120">
          <template slot-scope="props">
            {{props.row.fdate}}
          </template>
        </el-table-column>
        <el-table-column :label="lang.notes" sortable prop="note" width="200"></el-table-column>
        <el-table-column :label="lang.status" prop="status" sortable width="80">
          <template slot-scope="props">
            <el-tag size="mini"
              v-if="props.row.status === 'D'"
              type="warning">
              {{ props.row.status_desc }}
            </el-tag>
            <el-tag size="mini"
              v-else-if="props.row.status === 'P'"
              type="success">
              {{ props.row.status_desc }}
            </el-tag>
            <el-tag size="mini"
              v-else-if="props.row.status === 'X'"
              type="danger">{{ props.row.status_desc }}
            </el-tag>
            <el-tag size="mini" v-else>
              {{ props.row.status_desc }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="lang.received_by" sortable prop="modified_by"></el-table-column>
        <el-table-column width="200" v-if="wejayafoodAccessByStore.includes(selectedStore.url_id)" :label="rootLang.post_to_profitloss" prop="already_post_to_profitloss">
          <template slot-scope="scope">
            <div class="full-width" v-if="scope.row.status !== 'D'">
               <el-button v-if="scope.row.already_post_to_profitloss === 0" class="btn-block" type="primary" :loading="scope.row.loadingPost" @click="postDataToProfitLoss(scope.row.id, scope.$index)">Post</el-button>
            </div>

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
      :title="lang.import"
      :visible.sync="importDialog"
      max-width="760px">
      <div >
        <div class="mb-16">
          <a
            v-if="selectedStore.url_id !== 'setdemo1'"
            :href="baseURL + 'olsera_stockopname_import_template.csv'"
            class="btn btn-default">
            {{ lang.download_template }}
          </a>
          <el-dropdown v-else @command="handleClick">
            <el-button :loading="loadingExport">
              {{ lang.download_template }} <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown" style="overflow-y: scroll; height: 300px">
              <el-dropdown-item v-for="item in labelRow" :key="item.key" :command ="item">{{ lang.rows }} {{ item.value }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="full-width">
          <el-card v-if="dropdownForm">
            <div slot="header" class="clearfix">
              <span>{{ lang.import_from_csv_info }}</span>
            </div>
            <vue-dropzone
              ref="dropzone"
              :options="{
                url: baseURL + 'api/' + this.selectedStore.url_id + '/admin/v1/' + this.langId + '/stockopname/importfromcsv',
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
              style="margin-top: 8px;"
              @click="removeAllFiles">
              {{ $lang[langId].remove_all_file }}
            </el-button>
          </el-card>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import { postProfitloss } from '@/api/catalog/inventory/opname'

import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import basicComputedMixin from '@/mixins/basicComputedMixin'

import { importTemplateOpname } from '@/api/catalog/inventory/opname'

export default {
  components: {
    vueDropzone: vue2Dropzone,
    tokenc: ''
  },
  mixins: [basicComputedMixin],
  data: function() {
    return {
      loading: true,
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
      params: {
        search: null,
        total: null,
        currentPage: 1,
        sort_column: 'date',
        sort_type: 'desc',
        per_page: 10,
        page: 1
      },
      labelRow: [],
      loadingExport: false
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
    getData() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'stockopname'),
        params: this.params,
        headers: headers
      })
        .then(response => {
          this.tableData = response.data.data
          this.tableData.map(i => {
            i.loadingPost = false
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
    addData() {
      this.$router.push({ path: '/inventory/stocksopname/create' })
    },
    afterComplete(file, response) {
      console.log(response)
      if (response.error === 0) {
        this.$notify({
          title: 'Sukses',
          message: response.data + ' Produk.'
        })
        this.importDialog = false
        this.$router.push({path: '/inventory/stocksopname/' + response.id})
      }
    },
    failed(file, message, xhr) {
      console.log('file', file)
      console.log('message', message)
      console.log('xhr', xhr)
      // let errorMessage = ''
      // if (this.langId === 'id') {
      //   errorMessage = 'Gagal Menambahkan Produk'
      // } else {
      //   errorMessage = 'Add Product Failed'
      // }
      const $ = require('jquery')
      $('.dz-error-message span').text(message.error.error)
    },
    removeAllFiles() {
      this.$refs.dropzone.removeAllFiles()
    },
    goToSinglePage(row) {
      this.$router.push({path: '/inventory/stocksopname/' + row.id})
    },

    handleClick(data) {
      // console.log('logdat', data)
      this.loadingExport = true
      let param = {
        p: data.key,
        type: 'csv'
      }
      importTemplateOpname(param).then(response => {
        const fileName = 'stockopname_template__' + '.csv'
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        this.loadingExport = false
      }).catch(error => {
        // console.log(error, 'error')
        this.loadingExport = false
      })
    },

    postDataToProfitLoss(dataId, index) {
      this.tableData[index].loadingPost = true
      postProfitloss(dataId)
        .then(response => {
          this.getData()
          this.tableData[index].loadingPost = false
          this.$notify({
            type: 'success',
            title: 'Success',
            message: 'Sukses post ke laba rugi'
          })
        })
        .catch(error => {
          this.tableData[index].loadingPost = false
          if (error.response.data.error.status_code !== 404) {
            this.$notify({
              type: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error
            })
          }
        })
    },
  },
  mounted() {
    this.getData()

    // generate list import page
    var b = []
    var start = 0
    var end = 0
    for (let i = 1; i <= 200; i++) {
      start = i * 500 - 499
      end = i * 500
      b.push(
        { 
          value: start + ' - ' + end,
          key: i-1,
          string: start + '_' + end
        }
      )
    }
    this.labelRow = b
    // generate list import page
  }
}
</script>
