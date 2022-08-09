<template>
  <div class="content-wrapper">
    <section class="content income-expense">
      <el-card class="box-card">
        <div slot="header" class="table-handler-flex">
          <div class="box-title" style="flex-grow: 1;">
            <h4>{{ lang.transaction_type }}</h4>
            <p v-if="!showTable">0 {{ lang.type }}</p>
            <p v-else>{{ params.total }} {{ lang.type }}</p>
          </div>
          <div v-if="stageLevel === 'dev' || stageLevel === 'sit'" class="mr-8">
            <el-button
              :loading="loadingDownloadPdf"
              @click="getPDF()"
             
              icon="el-icon-printer">
              PDF
            </el-button>
            <el-button
              :loading="loadingDownloadExcel"
              @click="getExcel()"
            
              icon="el-icon-document">
              EXCEL
            </el-button>
          </div>
          <div class="mr-8">
            <button-action-authenticated :permission="['inex/inextranstype', 'store']"
              icon="el-icon-upload"
              @click="importDialog = true">
              {{ lang.import }}
            </button-action-authenticated>
          </div>
          <div>
            <router-link :to="{name: 'Transaction Type Create'}">
              <button-action-authenticated :permission="['inex/inextranstype', 'store']" type="primary" icon="el-icon-plus">
                {{ lang.add }}
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
              <el-input
                v-model="searchValue"
                :placeholder="lang.search"
                class="inline-form type-transaction"
                clearable
                prefix-icon="el-icon-search"
                @change="handleSearch" size="small">
              </el-input>
            </div>
          </div>

          <el-divider></el-divider>

          <el-table
            v-loading="loading"
            :data="typeTransactionData"
            stripe
            class="pointer"
            @sort-change="changeSortTable">
            <el-table-column
              :label="lang.name"
              sortable
              prop="name"
              min-width="140">
              <template slot-scope="props">
                <div v-if="rowState[props.$index].edited">
                  <el-input v-model="formEdit.name"></el-input>
                </div>
                <div v-else>
                  <strong v-if="!props.row.name">-</strong>
                  <strong v-else>{{ props.row.name }}</strong>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="lang.transaction_type"
              sortable
              prop="type_name"
              min-width="140">
              <template slot-scope="props">
                <div v-if="!props.row.type_name">
                  <p>-</p>
                </div>
                <div v-else>
                  <div v-if="props.row.type === 'I'">
                    <p  style="color: #6EBE46;">{{ props.row.type_name }}</p>
                  </div>
                  <div v-if="props.row.type === 'E'">
                    <p  style="color: #F44336;">{{ props.row.type_name }}</p>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="rootLang.action" min-width="140">
              <template slot-scope="scope">
                <button-action-authenticated :permission="['inex/inextranstype', 'destroy']" class="delete-button" type="text" v-if="!rowState[scope.$index].edited" @click="showDeleteDialog(scope.row)" style="color: #000000;">
                  <i class="el-icon-delete"></i>
                  {{ rootLang.delete }}
                </button-action-authenticated>
                <button-action-authenticated :permission="['inex/inextranstype', 'edit']" class="edit-button" type="text" v-if="!rowState[scope.$index].edited" @click="editHandle(scope.$index, scope.row)">
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
        <div class="text-center word-break">
          <p>{{ lang.are_you_sure_to_remove_this_data }}
            <span style="font-weight: bold;">"{{ deleteData.name }}"</span>
          </p>
          <p style="color: #AFB0AF;">{{ rootLang.info_delete_item }}</p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelDeleteDialog">{{ lang.cancel }}</el-button>
          <el-button type="danger" @click="deleteHandle">{{ rootLang.delete }}</el-button>
        </span>
      </el-dialog>

      <el-dialog
        :title="lang.import + ' ' + lang.transaction_type"
        :visible.sync="importDialog"
        @close="cancelImport"
        max-width="760px">
        <el-row :gutter="10">
          <el-col :md="8">
            <el-button :loading="loadingTemplate" class="btn btn-default" @click="downloadTemplate">
              {{ lang.download_template }}
            </el-button>
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
                  url: baseURL + 'api/' + this.selectedStore.url_id + '/admin/v1/' + this.langId + '/inextranstype/importfromcsv',
                  headers: {
                    'Authorization' : 'Bearer ' + this.token.access_token,
                    'Cache-Control': null,
                  },
                  method: 'post',
                  acceptedFiles: '.csv'
                  }"
                @vdropzone-success="afterComplete"
                @vdropzone-error="failed"
              ></vue-dropzone>
            </el-card>
            <div v-if="tableImport">
              <div v-if="errorImport != 0" class="mb-8">
                <el-tag type="danger" class="font-14">
                  {{ $lang[langId].theres_error }}. {{ $lang[langId].fix_upload_error }}
                </el-tag>
              </div>

              <el-table
                v-loading="loading"
                border
                :data="dataTableImport"
                :default-sort="{prop: 'id', order: 'ascending'}"
                :row-class-name="tableRowClassName">
                <el-table-column :label="$lang[langId].number" type="index" :index="indexMethod">
                </el-table-column>

                <el-table-column :label="lang.name" prop="name" sortable min-width="200">
                  <template slot-scope="props">
                      <strong>{{ props.row.name }}</strong>
                  </template>
                </el-table-column>

                <el-table-column :label="lang.transaction_type" sortable prop="type" min-width="140">
                  <template slot-scope="props">
                    <div>
                      <div v-if="props.row.type === 'I'">
                        <p  style="color: #6EBE46;">{{ rootLang.revennue }}</p>
                      </div>
                      <div v-if="props.row.type === 'E'">
                        <p  style="color: #F44336;">{{ rootLang.expense }}</p>
                      </div>
                    </div>
                  </template>
                </el-table-column>

                <el-table-column :label="lang.error" prop="error" sortable min-width="300">
                </el-table-column>
              </el-table>
            </div>
            <el-button
              style="margin-top: 8px;"
              @click="removeAllFiles">
              {{ $lang[langId].remove_all_file }}
            </el-button>
            <el-button @click="saveImportData" :loading="loadingImport" type="success" v-bind:disabled="btnProses">{{ lang.processing }}</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </section>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import basicComputedMixin from '@/mixins/basicComputedMixin'

const apiEndPoint = 'inextranstype/export'

import { downloadTemplate } from '@/api/revenue-expense'

export default {
  name: 'TransactionTypeList',
  components: {
    vueDropzone: vue2Dropzone,
  },
  mixins: [basicComputedMixin],
  data: function() {
    return {
      loading: false,
      typeTransactionData: [],
      loadingDownloadPdf: false,
      searchValue: null,
      showTable: false,
      rowState: {},
      deleteDialog: false,
      loadingDownloadExcel: false,
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
        name: ''
      },
      dropdownForm: true,
      importDialog: false,
      errorImport: 0,
      tableImport: false,
      dataTableImport: [],
      fileConfirm: '',
      btnProses: true,
      loadingImport: false,
      loadingTemplate: false
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
      
      this.getTypeTransaction()
    }
    
  },

  methods: {
    getTypeTransaction: function() {
      if (!this.params.store_id) {
        this.params.store_id = this.selectedStore.store_id
      }

      if (![...document.getElementById('app').classList].includes('dummy-page')) {
        this.loading = true
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'inextranstype'),
          params: this.params,
          headers: headers
        })
          .then(response => {
            this.typeTransactionData = response.data.data
            this.params.total = response.data.meta.total
            this.rowState = this.typeTransactionData.map(row => {
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
            this.typeTransactionData = []
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
      this.typeTransactionData = require('/static/data/mockupTransactionTypes.json')
      this.rowState = []
      this.typeTransactionData.map(() => {
        this.rowState.push({ edited: false })
      })
    },
    changePageTable(val) {
      this.params.per_page = val
      this.params.page = 1
      this.params.currentPage = 1
      this.getTypeTransaction()
    },
    handleSearch(val) {
      this.params.page = 1
      this.params.currentPage = 1
      this.params.search_text = ''
      this.params.search_column = null
      this.params.search = this.searchValue

      this.getTypeTransaction()
    },
    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      console.log(val)
      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.getTypeTransaction()
    },
    changeCurrentPage(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getTypeTransaction()
    },
    editHandle(index, row) {
      this.formEdit.id = row.id
      this.formEdit.name = row.name
      this.rowState[index].edited = true
    },
    cancelHandle(index) {
      this.formEdit.id = null
      this.formEdit.name = ''
      this.rowState[index].edited = false
    },
    saveHandle(index) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
        name: this.formEdit.name
      }
      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'inextranstype/' + this.formEdit.id),
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
          this.getTypeTransaction()
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
        url: baseApi(this.selectedStore.url_id, this.langId, 'inextranstype/' + id),
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
          this.getTypeTransaction()
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
    },
    afterComplete(file, response) {
      console.log(response)
      if (response.error === 0) {
        // this.$notify({
        //   title: 'Sukses',
        //   message: response.data + ' Produk.'
        // })
        if (response.unready_import !== 0) {
          this.btnProses = true
        } else {
          this.btnProses = false
        }
        this.dropdownForm = false
        this.tableImport = true
        this.dataTableImport = response.data
        this.errorImport = response.error
        this.fileConfirm = response.file_confirmed
        // this.importDialog = false
        // this.getTypeTransaction()
        // this.$router.push({path: '/inventory/stocksincoming/' + response.id})
      }
    },
    failed(file, message, xhr) {
      console.log('file', file)
      console.log('message', message)
      console.log('xhr', xhr)
      this.$notify({
        type: 'error',
        title: message.error.message,
        message: message.error.error
      })
      const $ = require('jquery')
      $('.dz-error-message span').text(message.error.error)
    },
    removeAllFiles() {
      if (this.$refs.dropzone) { this.$refs.dropzone.removeAllFiles() }
      this.dropdownForm = true
      this.tableImport = false
      this.dataTableImport = []
      this.fileConfirm = ''
    },

    tableRowClassName({row, rowIndex, props}) {
      if (row.error !== null) {
        return 'warning-row'
      }
      return ''
    },
    indexMethod(index) {
      return index + 1
    },

    getExcel() {
      if (this.$store.getters.webviewMode) {
        // this.getFileMobile(path, 'xlsx')
        console.log('mobile');
      } else {
        this.loadingDownloadExcel = true
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }
        var apiEnd = ''
  
        let params = { }
        params.type = 'xlsx'
  
        axios({
          url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint ),
          method: 'GET',
          responseType: 'blob',
          headers,
          params
        }).then((response) => {
          const fileName = 'Tipe Transaksi'  + '.xlsx'
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click()
          this.loadingDownloadExcel = false
        }).catch(error => {
          // console.log(error, 'error')
          this.loadingDownloadExcel = false
        })
      }
    },


    getPDF() {
      // console.log(this);
      if (this.$store.getters.webviewMode) {
        console.log('mobile');
      } else {
        this.loadingDownloadPdf = true
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }
        var apiEnd = ''

         let params = {  }

        params.type= 'pdf'



        axios({
          url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint ),
          method: 'GET',
          responseType: 'blob',
          headers,
          params
        }).then((response) => {
          
          console.log('qweqweqweqweqwe', response);
          const fileName = 'Tipe Transaksi'  + '.pdf'
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click()
          this.loadingDownloadPdf = false
        }).catch(error => {
          console.log(error, 'error')
          this.loadingDownloadPdf = false
        })
      }
    },

    saveImportData() {
      this.loadingImport = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'inextranstype/importconfirmed?file_confirmed=' + this.fileConfirm),
        headers: headers
      })
        .then(response => {
          this.loadingImport = false
          this.cancelImport()
          this.importDialog = false
          this.$message({
            title: 'Success',
            message: response.data.message + ' Product.'
          })
          
          this.getTypeTransaction()
        })
        .catch((error, xhr) => {
          this.loadingImport = false
          this.$notify({
            type: 'warning',
            message: error.message,
            error: error.string
          })
        })
    },

    cancelImport() {
      this.dataTableImport = []
      this.fileConfirm = ''
      this.dropdownForm = true
      this.tableImport = false
      this.importDialog = false
      this.btnProses = true
    },

    downloadTemplate () {
      // window.open(this.baseURL + 'olsera_product_import_template.csv')
      this.loadingTemplate = true
      downloadTemplate().then(response => {
        const fileName = 'olsera_type_transaction_import_template.csv'
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
  },

  mounted() {
    this.getTypeTransaction()
  }
}
</script>
