<template>
  <div>
    <el-card
      v-loading="loading"
      class="box-card">
      <div slot="header" class="table-handler-flex">
        <div style="flex-grow: 1;">
          <h4>{{ $lang[langId].supplier }} {{ lang.supplier }}</h4>
          <p v-if="!showTable">0 {{ lang.supplier }}</p>
          <p v-else>{{ params.total }} {{ lang.supplier }}</p>
        </div>

        <div>
          <button-action-authenticated :permission="['customer/suppliers', 'show']" type="text" icon="el-icon-download" :loading="loadingDownload" @click="getExcel">
            {{ $lang[langId].download_excel }}
          </button-action-authenticated>

          <button-action-authenticated
            :permission="['customer/suppliers', 'store']"
            type="background-color: #E1E2E1"
            icon="el-icon-upload"
            @click="importDialog = true">
            {{ lang.import }}
          </button-action-authenticated>

          <router-link :to="{name: 'Supplier Create'}">
            <button-action-authenticated
              :permission="['customer/suppliers', 'store']"
              type="success"
              icon="el-icon-plus">
              {{ lang.add }}
            </button-action-authenticated>
          </router-link>
        </div>
      </div>

      <div class="card-body">
        <div v-if="!showTable" class="no-product">
          <p>{{ $lang[langId].no_data }}</p>
          <img src="/static/img/no-data-staff.png" alt="No Data Picture">
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
            v-loading="loading"
            :data="supplierData"
            stripe
            class="sales-table-max-height mobile-fix-height-unset"
            @sort-change="changeSortTable"
            @row-click="rowClick">
            <el-table-column :label="lang.name" prop="name" sortable min-width="140">
              <template slot-scope="props">
                <p v-if="!props.row.name">-</p>
                <p v-else>
                  <router-link :to="{ path: '/customersupplier/supplier/' + props.row.id }">
                    {{ props.row.name }}
                  </router-link>
                </p>
              </template>
            </el-table-column>
            <el-table-column :label="lang.contact_person" prop="contact_person" sortable min-width="220">
              <template slot-scope="props">
                <p v-if="!props.row.contact_person">-</p>
                <p v-else>{{ props.row.contact_person }}</p>
              </template>
            </el-table-column>
            <el-table-column :label="lang.email" prop="email" sortable min-width="120">
              <template slot-scope="props">
                <p v-if="!props.row.email">-</p>
                <p v-else>{{ props.row.email }}</p>
              </template>
            </el-table-column>
            <el-table-column :label="lang.phone" prop="phone" sortable  min-width="100">
              <template slot-scope="props">
                <p v-if="!props.row.phone">-</p>
                <p v-else>{{ props.row.phone }}</p>
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

    <el-dialog
      :title="lang.import_update_status"
      :visible.sync="importDialog"
      max-width="760px"
      @close="cancelImport">
      <div>

        <div>
          <div v-if="dropdownForm">
            <div class="font-bold mb-8 flex-container">
              <div class="full-width word-break">{{ lang.import_from_csv_info }}</div>
              <div>
                <el-button :loading="loadingTemplate" class="btn btn-default" @click="downloadTemplate">
                  {{ lang.download_template }}
                </el-button>
              </div>
            </div>

            <div class="mb-8">
              <vue-dropzone
                ref="dropzone"
                id="drop1"
                :options="{
                  url: baseURL + 'api/' + this.selectedStore.url_id + '/admin/v1/' + this.langId + '/supplier/importfromcsv',
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
            </div>

            <el-button
              style="margin-top: 8px;"
              @click="removeAllFiles">
              {{ $lang[langId].remove_all_file }}
            </el-button>
          </div>

          <el-card v-if="tableImport">
            <el-table stripe
              ref="multipleTable"
              v-loading="loading"
              @selection-change="handleSelectionChange"
              @sort-change="handleSortChange"
              :data="tableImportCustomer"
              :default-sort="{prop: 'id', order: 'ascending'}"
              style="width: 100%">

              <el-table-column :label="lang.customer_name" prop="name" sortable min-width="200">
                <template slot-scope="props">
                    <strong>{{ props.row.name }}</strong>
                </template>
              </el-table-column>

              <el-table-column :label="lang.address" prop="address" sortable width="200">
              </el-table-column>

              <el-table-column :label="lang.phone" prop="phone" sortable width="100">
              </el-table-column>

              <el-table-column :label="lang.email" prop="email" sortable width="200">
              </el-table-column>

              <el-table-column :label="lang.status" prop="status" sortable width="200">
              </el-table-column>


            </el-table>
          </el-card>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelImport" class="cancel">{{ lang.cancel }}</el-button>
        <el-button @click="saveImportData" class="process" v-bind:disabled="dropdownForm">{{ lang.proceed }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import { supplierTemplate } from '@/api/customer-supplier'

import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import basicComputedMixin from '@/mixins/basicComputedMixin'

export default {
  name: 'SupplierList',
  components: {
    vueDropzone: vue2Dropzone,
    tokenc: ''
  },
  mixins: [basicComputedMixin],
  data() {
    return {
      loading: false,
      supplierData: [],
      searchValue: null,
      showTable: false,
      importDialog: false,
      dropdownForm: true,
      tableImport: false,
      fileConfirm: '',
      number: 0,
      totalRow: 0,
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
        },
        {
          value: 50,
          label: '50 ' + this.$store.state.userStores.lang.rows
        },
        {
          value: 100,
          label: '100 ' + this.$store.state.userStores.lang.rows
        }
      ],
      params: {
        search: null,
        total: null,
        currentPage: 1,
        sort_column: 'name',
        sort_type: 'asc',
        per_page: 10,
        page: 1,
        store: null,
        search_column: null,
        search_text: ''
      },
      loadingTemplate: false,
      loadingDownload: false
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
    '$store.getters.selectedStore': function() {
      this.getSupplierData()
    }
  },
  mounted() {
    this.getSupplierData()
  },
  methods: {
    getSupplierData() {
      if (![...document.getElementById('app').classList].includes('dummy-page')) {
        this.loading = true
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'supplier'),
          params: this.params,
          headers: headers
        }).then(response => {
          this.supplierData = response.data.data
          this.params.total = response.data.meta.total
          this.showTable = true
          this.loading = false
          // console.log(response)
        }).catch(error => {
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
      this.showTable = true
      this.params.total = 10
      this.supplierData = require('/static/data/mockupSuppliers.json')
    },
    changePageTable(val) {
      this.params.per_page = val
      this.getSupplierData()
    },
    handleSearch(val) {
      this.params.page = 1
      this.params.currentPage = 1
      this.params.search_text = ''
      this.params.search_column = null
      this.params.search = this.searchValue
      this.getSupplierData()
    },
    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      // console.log(val)
      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.getSupplierData()
    },
    changeCurrentPage(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getSupplierData()
    },
    rowClick(row) {
      this.$router.push({ path: '/customersupplier/supplier/' + row.id })
    },
    // importDialog() {
    //   this.$router.push({path: '/customersupplier/supplier/importsupplier'})
    // }
    afterComplete(file, response) {
      // console.log(response)
      if (response.error === 0) {
        // this.$notify({
        //   title: 'Sukses',
        //   message: response.data + ' Produk.'
        // })
        this.dropdownForm = false
        this.tableImportCustomer = response.data
        this.totalRow = response.row
        this.tableImport = true
        this.fileConfirm = response.file_confirmed
      }
    },
    failed(file, message, xhr) {
      this.$message({
        type: 'error',
        message: message.error.error
      })
      const $ = require('jquery')
      $('.dz-error-message span').text(message.error.error)
    },
    removeAllFiles() {
      this.$refs.dropzone.removeAllFiles()
    },
    cancelImport() {
      this.tableImportCustomer = []
      this.fileConfirm = ''
      this.dropdownForm = true
      this.tableImport = false
      this.importDialog = false
    },
    saveImportData: function() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'supplier/importconfirmed?file_confirmed=' + this.fileConfirm),
        headers: headers
      })
        .then(response => {
          // this.customerData = response.data.data
          this.loading = false
          // console.log(response)
          this.$router.push({path: '/customersupplier/supplier'})
          this.getSupplierData()
          this.cancelImport()
          this.importDialog = false
          this.$message({
            title: 'Success',
            message: response.data.data + ' Supplier.'
          })
        })
        .catch((error) => {
          this.loading = true
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        })
    },

    getExcel() {
      this.loadingDownload = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let params = {
        type: 'xlsx',
        p: 0
      }

      axios({
        url: baseApi(this.selectedStore.url_id, this.langId, 'supplier/excel'),
        method: 'GET',
        responseType: 'blob',
        headers,
        params
      }).then((response) => {
        const fileName = this.$lang[this.langId].list + ' ' + this.lang.supplier + '.xlsx'
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        this.loadingDownload = false
      }).catch(error => {
        // console.log(error, 'error')
        this.loadingDownload = false
      })
    },

    downloadTemplate () {
      // window.open(this.baseURL + 'olsera_product_import_template.csv')
      this.loadingTemplate = true
      supplierTemplate().then(response => {
        const fileName = 'olsera_supplier_import_template.csv'
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        this.loadingTemplate = false
      }).catch(error => {
        // console.log(error, 'error')
        this.loadingTemplate = false
      })
    },
  }
}
</script>
