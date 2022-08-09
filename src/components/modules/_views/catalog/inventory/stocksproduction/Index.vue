<template>
  <div>
    <div class="main-content">
      <div class="table-handler-flex">
        <div style="flex-grow: 1;">
          <h4 class="main-content__title">{{ $lang[langId].stock_production }}</h4>
          <p class="main-content__subtitle">{{ params.total }} {{ lang.items }}</p>
        </div>

        <div>
          <button-action-authenticated
            :permission="['inventory/productionsmode', 'store']"
            icon="el-icon-upload"
            @click="importDialog = true">
            {{ lang.import }}
          </button-action-authenticated>
          <button-action-authenticated :permission="['inventory/productionsmode', 'store']" type="primary" icon="el-icon-plus" @click="addData">
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
            :placeholder="lang.search"
            prefix-icon="el-icon-search"
            v-model="searchValue"
            @change="handleSearch" size="small">
          </el-input>
        </div>
      </div>

      <el-table :data="tableData" border stripe v-loading="loading" @sort-change="changeSortTable">
        <el-table-column
          :label="$lang[langId].number"
          sortable
          prop="trans_no"
          width="160">
          <template slot-scope="props">
            <router-link :to="{path: '/inventory/stocksproduction/' + props.row.id}">
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
        <el-table-column :label="lang.status" sortable prop="status" width="100">
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
            :href="baseURL + 'olsera_production_import_template.csv'"
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
                url: baseURL + 'api/' + this.selectedStore.url_id + '/admin/v1/' + this.langId + '/productionsmode/importfromcsv',
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
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import basicComputedMixin from '@/mixins/basicComputedMixin'

export default {
  components: {
    vueDropzone: vue2Dropzone,
    tokenc: ''
  },
  mixins: [basicComputedMixin],
  data() {
    return {
      loading: false,
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
          url: baseApi(this.selectedStore.url_id, this.langId, 'productionsmode'),
          params: this.params,
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
      } else {
        this.getMockupData()
      }
    },
    getMockupData() {
      this.params.total = 10
      this.tableData = require('/static/data/mockupStocksProduction.json')
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
      this.$router.push({ path: '/inventory/stocksproduction/create' })
    },
    // importDialog() {
    //   this.$router.push({path: '/inventory/importstockproduction'})
    // }
    afterComplete(file, response) {
      console.log(response)
      if (response.error === 0) {
        this.$notify({
          title: 'Sukses',
          message: response.data + ' Produk.'
        })
        this.importDialog = false
        this.$router.push({path: '/inventory/stocksproduction/' + response.id})
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
    }
  }
}
</script>
