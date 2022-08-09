<template>
  <div>
    <el-card v-if="!showAddForm && !showDetailForm" class="box-card">
      <div slot="header" class="table-handler-flex">
        <div style="flex-grow: 1;">
          <h4>{{ $lang[langId].list }} {{ lang.customer }}</h4>
          <p v-if="!showTable">0 {{ lang.customer }}</p>
          <p v-else>{{ params.total }} {{ lang.customer }}</p>
        </div>

        <div>
          <el-dropdown @command="getExcel">
            <el-button :loading="loadingExport" type="primary">
              Export Excel<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown" style="overflow-y: scroll; height: 300px">
              <el-dropdown-item v-for="item in labelRow" :key="item.key" :command ="item">{{ lang.rows }} {{ item.value }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <button-action-authenticated
            :permission="['customer/customers', 'store']"
            type="background-color: #E1E2E1"
            icon="el-icon-upload"
            @click="importDialog = true">
            {{ lang.import }}
          </button-action-authenticated>
          <button-action-authenticated
            :permission="['customer/customers', 'store']"
            type="success"
            icon="el-icon-plus"
            @click="formHandle('add')">
            {{ lang.add }}
          </button-action-authenticated>
        </div>
      </div>

      <div v-loading="loading" class="card-body">
        <div class="table-handler-flex">
          <div v-if="stageLevel === 'dev' || stageLevel === 'sit'" class="mb-4 mr-4">
            <el-button @click="visibleFilter = true" > 
              <svg-icon icon-class="filter-icon" style="color: red" />
              Filter</el-button>
          </div>
          <div class="mb-4" style="flex-grow: 1;">
            <el-select class="inline-form" v-model="params.per_page" @change="changePageTable" filterable :placeholder="lang.please_select" size="small">
              <el-option v-for="item in pages" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
          <div class="mb-4 mr-4">
            <el-autocomplete
              v-model="customerTypeSearch"
              :fetch-suggestions="getCustomerTypeSearch"
              :debounce="300"
              :placeholder="$lang[langId].customer_types + ' (Autocomplete)'"
              clearable
              class="inline-form"
              size="small"
              @clear="setCustomer"
              @select="setCustomer"
              style="width: 100%"
            />
          </div>
          <div class="mb-4">
            <el-input class="inline-form input-search" clearable :placeholder="lang.search +' '+ lang.customer" prefix-icon="el-icon-search" v-model="searchValue" @change="handleSearch" size="small"></el-input>
          </div>
        </div>

        <el-divider></el-divider>

        <div v-if="!showTable" class="no-product">
          <p>{{ $lang[langId].no_data }}</p>
          <img src="/static/img/no-data-staff.png" alt="No Data Picture">
        </div>

        <div v-else>
          <el-table
            v-loading="loading"
            :data="customerData"
            stripe
            class="sales-table-max-height mobile-fix-height-unset pointer"
            @sort-change="changeSortTable"
            @row-click="formHandle('detail', $event)">
            <el-table-column :label="lang.name" prop="name" sortable min-width="140">
              <template slot-scope="props">
                <div v-if="!props.row.name">-</div>
                <div v-else style="text-transform: capitalize;">
                  <strong>{{ props.row.name }}</strong>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$lang[langId].customer_id" prop="name" sortable min-width="140">
              <template slot-scope="props">
                <div v-if="!props.row.id">-</div>
                <div v-else style="text-transform: capitalize;">
                  <strong>{{ props.row.id }}</strong>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="lang.code" prop="code" sortable>
              <template slot-scope="props">
                <div v-if="!props.row.code">-</div>
                <div v-else>{{ props.row.code}}</div>
              </template>
            </el-table-column>
            <el-table-column :label="lang.email" prop="email" sortable min-width="120">
              <template slot-scope="props">
                <div v-if="!props.row.email">-</div>
                <div v-else>{{ props.row.email}}</div>
              </template>
            </el-table-column>
            <el-table-column :label="lang.phone" prop="phone" sortable min-width="100">
              <template slot-scope="props">
                <div v-if="!props.row.phone">-</div>
                <div v-else>{{ props.row.phone}}</div>
              </template>
            </el-table-column>
            <el-table-column :label="lang.type" prop="customer_type_name" sortable>
              <template slot-scope="props">
                <div v-if="!props.row.customer_type_name">-</div>
                <div v-else>{{ props.row.customer_type_name}}</div>
              </template>
            </el-table-column>
            <el-table-column :label="lang.active_date" prop="created_time" sortable min-width="130">
              <template slot-scope="props">
                <div v-if="!props.row.fcreated_time">-</div>
                <div v-else>{{ props.row.fcreated_time}}</div>
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
      :title="lang.import"
      :visible.sync="importDialog"
      max-width="760px"
      @close="cancelImport">
      <div>
        <div class="full-width">
          <div v-if="dropdownForm">
            <div class="font-bold mb-8 word-break flex-container">
              <div class="full-width">{{ lang.import_from_csv_info }}</div>
              <div>
                <el-button :loading="loadingTemplate" class="btn btn-default" @click="downloadTemplate">
                  {{ lang.download_template }}
                </el-button>
              </div>
            </div>
            <div class="mb-8">
              <vue-dropzone
                ref="dropzone"
                :options="{
                  url: baseURL + 'api/' + this.selectedStore.url_id + '/admin/v1/' + this.langId + '/customer/importfromcsv',
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
            <el-button @click="removeAllFiles">
              {{ $lang[langId].remove_all_file }}
            </el-button>
          </div>

          <el-card v-if="tableImport">
            <el-table 
              stripe
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

              <el-table-column :label="lang.phone" prop="phone" sortable width="120">
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

    <add-form
      v-if="showAddForm"
      :loading="loading"
      :customer-type="customerType"
      @cancel="cancelAdd"
      @save="saveAdd">
    </add-form>

    <detail-form
      v-if="showDetailForm"
      :detail-id="detailId"
      @back="backFromDetail"
      @delete="deleteDetail">
    </detail-form>

    <detail-form-v2
      v-if="showDetailFormV2"
      :detail-id="detailId"
      @back="backFromDetail"
      @delete="deleteDetail">
    </detail-form-v2>

    <transition name="el-zoom-in-center">
        <div
          v-if="visibleFilter"
          class="offscreen-right-sidebar">
          <div class="offscreen-right-sidebar--wrapper">
            <div class="offscreen-right-sidebar--header text-left">
              Filter
              <close-esc @close="visibleFilter = false" />
            </div>

            <div>
              <!-- <div class="full-width">
                <span class="font-12">{{ lang.name }}</span>
                <div>
                  <el-input v-model="tempCustomer.customer_name" ></el-input>
                </div>
              </div> -->
              <div class="full-width mt-16">
                <span class="font-12">{{ lang.customer_type }}</span>
                <div>
                  <el-autocomplete
                    style="width: 100%;"
                    v-model="paramFilter.customer_type_name"
                    :fetch-suggestions="searchCustomerTypes"
                    :placeholder="lang.search"
                    clearable
                    @select="handleSelected"
                    @clear="handleClearCustomerType">
                  </el-autocomplete>
                </div>
              </div>
              <div class="full-width mt-16">
                <span class="font-12">Status pelanggan</span>
                <el-radio-group
                  v-model="paramFilter.is_frozen"
                  class="full-width flex-container border border--info">
                  <el-radio-button class="lpoint-type" :label="2">
                    {{ rootLang.all }}
                  </el-radio-button>
                  <el-radio-button class="lpoint-type" :label="0">
                    {{ rootLang.active }}
                  </el-radio-button>
                  <el-radio-button class="lpoint-type" :label="1">
                    {{ rootLang.frozen }}
                  </el-radio-button>
                </el-radio-group>
              </div>
              <div class="calender-input mt-16">
                <div class="font-12 text-left">{{ lang.date_of_birth }}</div>
                <div class="flex-container">
                  <el-date-picker
                    v-model="paramFilter.dob_start_date"
                    placeholder="Select a date"
                    :clearable="true"
                    type="date"
                    format="d MMM yyyy"
                    style="width: 100%"
                    value-format="yyyy-MM-dd"
                    popper-class="custom-popper-datepicker"
                  />
                  <div class="px-8"> - </div>
                  <el-date-picker
                    v-model="paramFilter.dob_end_date"
                    placeholder="Select a date"
                    :clearable="true"
                    type="date"
                    format="d MMM yyyy"
                    style="width: 100%"
                    value-format="yyyy-MM-dd"
                    popper-class="custom-popper-datepicker"
                  />
                </div>
              </div>
              <div class="calender-input mt-16">
                <div class="font-12 text-left">{{ lang.expiry_date }}</div>
                <div class="flex-container">
                  <el-date-picker
                    v-model="paramFilter.expiry_date_start"
                    placeholder="Select a date"
                    :clearable="true"
                    type="date"
                    format="d MMM yyyy"
                    style="width: 100%"
                    value-format="yyyy-MM-dd"
                    popper-class="custom-popper-datepicker"
                  />
                  <div class="px-8">-</div>
                  <el-date-picker
                  v-model="paramFilter.expiry_date_end"
                  placeholder="Select a date"
                  :clearable="true"
                  type="date"
                  format="d MMM yyyy"
                  style="width: 100%"
                  value-format="yyyy-MM-dd"
                  popper-class="custom-popper-datepicker"
                />
                </div>
              </div>
              <div class="mt-16 full-width">
                <span class="font-12">Deposit (IDR)</span>
                <div class="flex-container">
                  <el-input type="number" min="0" v-model="paramFilter.deposit_balance_start" />
                  <div class="px-8"> - </div>
                  <el-input type="number" min="0" v-model="paramFilter.deposit_balance_end" />
                </div>
              </div>
              <div class="mt-16 full-width">
                <span class="font-12">Loyalty poins (pts)</span>
                <div class="flex-container">
                  <el-input type="number" min="0" v-model="paramFilter.loyalty_point_start" />
                  <div class="px-8"> - </div>
                  <el-input type="number" min="0" v-model="paramFilter.loyalty_point_end" />
                </div>
              </div>
            </div>
          </div>

          <div class="offscreen-right-sidebar--footer flex-container">
            <el-button class="btn-block mr-4" @click="resetFilter">Reset</el-button>
            <el-button type="primary" class="btn-block ml-4" :loading="loadingFilter" @click="handleFilterCustomer" >{{ rootLang.apply }}</el-button>
          </div>
        </div>
      </transition>

  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import { customerTemplate } from '@/api/customer-supplier'
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import addForm from './create/CustomerCreate'
import detailForm from './detail/CustomerDetail'
import detailFormV2 from './detail/CustomerDetailV2'
import CloseEsc from '@/components/modules/CloseEsc'

import basicComputedMixin from '@/mixins/basicComputedMixin'

export default {
  name: 'CustomerList',
  components: {
    addForm,
    detailForm,
    detailFormV2,
    vueDropzone: vue2Dropzone,
    tokenc: '',
    CloseEsc
  },
  mixins: [basicComputedMixin],

  data() {
    return {
      loading: false,
      customerData: [],
      customerType: null,
      tableImportCustomer: [],
      searchValue: null,
      // selectedStore: this.$store.getters.selectedStore,
      showTable: false,
      showAddForm: false,
      showDetailForm: false,
      importDialog: false,
      dropdownForm: true,
      tableImport: false,
      fileConfirm: '',
      detailId: null,
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
      customerTypeSearch: '',
      labelRow: [],
      loadingExport: false,
      loadingTemplate: false,
      showDetailFormV2: false,
      visibleFilter: false,
      paramFilter: {
        customer_type_name: '',
        customer_type_id: '',
        is_frozen: 2,
        dob_start_date: '',
        dob_end_date: '',
        expiry_date_start: '',
        expiry_date_end: '',
        deposit_balance_start: '',
        deposit_balance_end: '',
        loyalty_point_start: '',
        loyalty_point_end: ''
      },
      loadingFilter: false
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
    roleCantAccess () {
      return ['ST', 'PT', 'SS']
    },
    accessByStore () {
      return ['cvsms', 'smsstore1', 'smsstore2']
    }
  },

  mounted() {
    // console.log('searhc', this.$route.query.type)
    if (this.$route.query.type) {
      // console.log( this.$route)
      this.customerTypeSearch = this.$route.query.type
      this.getCustomerData(true)
    } else {
      this.getCustomerData()
    }
    this.getCustomerType()

    // set export option
    var b = []
    var start = 0
    var end = 0
    for (let i = 1; i <= 20; i++) {
      start = i * 5000 - 4999
      end = i * 5000
      b.push(
        { 
          value: start + ' - ' + end,
          key: i-1,
          string: start + '_' + end
        }
      )
    }
    this.labelRow = b
    // 
  },

  methods: {
    getCustomerData(search) {
      if (![...document.getElementById('app').classList].includes('dummy-page')) {
        this.loading = true
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }
        let param = {}
        // if (search) {
        //   param.search_text = this.customerTypeSearch
        //   param.search_column = 'customer_type_name'
        // } else {
        //   param = this.params
        // }
        if (this.customerTypeSearch !== '') {
          this.params.search_text = this.customerTypeSearch
          this.params.search_column = 'customer_type_name'
        } else {
          this.$delete(this.params, 'search_text')
          this.$delete(this.params, 'search_column')
        }
        param = this.params
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'customer'),
          params: param,
          headers: headers
        })
          .then(response => {
            this.customerData = response.data.data
            this.params.total = response.data.meta.total
            this.showTable = true
            this.loading = false
          })
          .catch((error) => {
            if (error.response.data.error.status_code !== 404) {
              this.$notify({
                type: 'warning',
                title: error.response.data.error.message,
                message: error.response.data.error.error
              })
            }
            this.params.total = 0
            this.customerData = []
            this.loading = false
          })
      } else {
        this.getMockupData()
      }
    },
    getMockupData() {
      this.showTable = true
      this.params.total = 10
      this.customerData = require('/static/data/mockupCustomers.json')
    },
    getCustomerType() {
      if (![...document.getElementById('app').classList].includes('dummy-page')) {
        this.loadings = true
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }
        let params = {
          search: '',
          per_page: 100
        }
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'customertype'),
          headers: headers,
          params: params
        })
          .then(response => {
            this.customerType = response.data.data
            this.loadings = false
          })
          .catch(error => {
            // console.log(error)
            this.loadings = false
          })
      } else {
        this.getMockupData()
      }
    },
    changePageTable(val) {
      this.params.per_page = val
      this.params.page = 1
      this.getCustomerData()
    },
    handleSearch(val) {
      this.params.page = 1
      this.params.currentPage = 1
      this.params.search_text = ''
      this.params.search_column = null
      this.params.search = this.searchValue
      this.getCustomerData()
    },
    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      // console.log(val)
      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.getCustomerData()
    },
    changeCurrentPage(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getCustomerData()
    },
    // rowClick(row) {
    //   this.$router.push({ path: '/customersupplier/customer/' + row.id })
    // },
    // importDialog() {
    //   this.$router.push({path: '/customersupplier/customer/importcustomer'})
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
        // this.$router.push({path: '/inventory/stocksincoming'})
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
        url: baseApi(this.selectedStore.url_id, this.langId, 'customer/importconfirmed?file_confirmed=' + this.fileConfirm),
        headers: headers
      })
        .then(response => {
          // this.customerData = response.data.data
          this.loading = false
          console.log(response)
          this.$router.push({path: '/customersupplier/customer'})
          this.cancelImport()
          this.importDialog = false
          this.$message({
            type: 'success',
            message: response.data.data + ' Customer.'
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
    formHandle(block, item) {
      if (block === 'add') {
        this.showAddForm = true
      } else if (block === 'detail') {
        console.log(this.checkCustomPermission('customer/customers', 'show'))
        if (!this.checkCustomPermission('customer/customers', 'show')) {
          return
        }
        // console.log(item)
        this.detailId = item.id
        // console.log(this.detailId)
        this.showDetailForm = true
        // this.defaultAccessByStore.includes(this.selectedStore.url_id) ? this.showDetailFormV2 = true : this.showDetailForm = true
      }
    },
    cancelAdd() {
      this.showAddForm = false
    },
    saveAdd(saveData) {
      let formAdd = Object.assign({}, saveData)
      this.loadings = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      if (formAdd.phone === null) {
        formAdd.phone = ''
      }
      if (formAdd.postalCode === null) {
        formAdd.postalCode = ''
      }
      let data = formAdd
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'customer'),
        headers: headers,
        data
      })
        .then(response => {
          this.result = response.data
          this.loadings = false
          this.showAddForm = false
          this.getCustomerData()
          this.formHandle('detail', response.data.data)
          this.$message({
            type: 'success',
            message: 'Success'
          })
          // this.$router.push({
          //   path: '/customersupplier/customer/' + response.data.data.id
          // })
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.loadings = false
        })
    },
    backFromDetail() {
      this.detailId = null
      this.showDetailForm = false
      this.showDetailFormV2 = false
      this.getCustomerData()
    },
    deleteDetail() {
      this.detailId = null
      this.getCustomerData()
      this.showDetailForm = false
      this.showDetailFormV2 = false
    },

    getExcel(data) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let params = this.handleGetFilter()
      this.$delete(params, 'page')
      params.type = 'xlsx'
      params.p = data.key
      // let params = {
      //   type: 'xlsx',
      //   p: data.key
      // }

      axios({
        url: baseApi(this.selectedStore.url_id, this.langId, 'customer/excel'),
        method: 'GET',
        responseType: 'blob',
        headers,
        params
      }).then((response) => {
        const fileName = this.$lang[this.langId].list + ' ' + this.lang.customer + '.xlsx'
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
      }).catch(error => {
        // if (error.response.status === 404) {
          this.$notify({
            type: 'warning',
            title: 'Error',
            message: this.rootLang.data_not_found
          })
        // }
      })
    },

    getCustomerTypeSearch(queryString, callback) {
      // this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        sort_column: 'name',
        sort_type: 'asc',
        search: queryString
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'customertype'),
        headers: headers,
        params: params
      })
        .then(response => {
          let data = response.data.data
          for (let i of data) {
            i.value = i.name
          }
          callback(data)
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        })
    },

    setCustomer (data) {
      if (typeof data !== 'undefined') {
        this.getCustomerData(true)
        this.params.currentPage = 1
        this.params.page = 1
      } else {
        this.params.search_text = ''
        this.params.currentPage = 1
        this.params.page = 1
        // this.params.search_column = ''
        this.getCustomerData()
      }
    },

    downloadTemplate () {
      // window.open(this.baseURL + 'olsera_product_import_template.csv')
      this.loadingTemplate = true
      customerTemplate().then(response => {
        const fileName = 'olsera_customer_import_template.csv'
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

    searchCustomerTypes(query, callback) {
      //
      this.searchingCustomerTypes = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search: query
      }
      if (query.length > 0) {
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'customertype'),
          headers: headers,
          params: params
        }).then(response => {
          for (let i of response.data.data) {
            i.value = i.name
            i.id = i.id
          }
          this.searchResultCustomerTypes = response.data.data
          callback(this.searchResultCustomerTypes)
          this.searchingCustomerTypes = false
          // this.searchResultCustomerTypes = response.data.data.map(item => {
          //   return item
          // })
        }).catch(() => {
          this.searchingCustomerTypes = false
          this.searchResultCustomerTypes = []
        })
      }
    },

    handleSelected(val) {
      console.log('v', val)
      this.paramFilter.customer_type_id = val.id
    },

    handleClearCustomerType () {
      this.paramFilter.customer_type_id = ''
    },

    handleFilterCustomer () {
      let param = this.handleGetFilter()
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      this.loadingFilter = true
      this.loading = true
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'customer'),
        params: param,
        headers: headers
      })
        .then(response => {
          this.customerData = response.data.data
          this.params.total = response.data.meta.total
          this.showTable = true
          this.loadingFilter = false
          this.loading = false
          this.visibleFilter = false
        })
        .catch((error) => {
          if (error.response.data.error.status_code !== 404) {
            this.$notify({
              type: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error
            })
          }
          this.params.total = 0
          this.customerData = []
          this.loadingFilter = false
          this.loading = false
        })
    },

    resetFilter () {
      this.paramFilter = {
        customer_type_name: '',
        customer_type_id: '',
        is_frozen: 2,
        dob_start_date: '',
        dob_end_date: '',
        expiry_date_start: '',
        expiry_date_end: '',
        deposit_balance_start: '',
        deposit_balance_end: '',
        loyalty_point_start: '',
        loyalty_point_end: ''
      }
      this.visibleFilter = false
      this.getCustomerData()
    },

    handleGetFilter () {
      let dob = null
      let expiry = null
      let deposit = null
      let loyalty = null
      let param = {
        is_frozen: null,
        search_column: [],
        search_text: [],
        search_operator: [],
        per_page: this.params.per_page,
        currentPage: this.params.currentPage,
        page: this.params.page,
        sort_column: this.params.sort_column,
        sort_type: this.params.sort_type,
        search: this.params.search
      }

      if (this.paramFilter.dob_start_date) {
        dob = this.paramFilter.dob_start_date + ',' + this.paramFilter.dob_end_date
      }

      if (this.paramFilter.expiry_date_start) {
        expiry = this.paramFilter.expiry_date_start + ',' + this.paramFilter.expiry_date_end
      }

      if (this.paramFilter.deposit_balance_start !== '' && this.paramFilter.deposit_balance_end !== '') {
        deposit = this.paramFilter.deposit_balance_start + ',' + this.paramFilter.deposit_balance_end
      } else if (this.paramFilter.deposit_balance_start === '' && this.paramFilter.deposit_balance_end !== '') {
        deposit = '0, ' + this.paramFilter.deposit_balance_end
      }

      if (this.paramFilter.loyalty_point_start !== '' && this.paramFilter.loyalty_point_end !== '') {
        loyalty = this.paramFilter.loyalty_point_start + ',' + this.paramFilter.loyalty_point_end
      } else if (this.paramFilter.loyalty_point_start === '' && this.paramFilter.loyalty_point_end !== '') {
        loyalty = '0, ' + this.paramFilter.loyalty_point_end
      }

      if (this.paramFilter.is_frozen === 2) {
        param.is_frozen = null
      } else {
        param.is_frozen = this.paramFilter.is_frozen
      }

      let data = [
        {
          id: 'deposit_balance',
          value: deposit
        },
        {
          id: 'balance_points',
          value: loyalty
        },
        {
          id: 'expiry_date',
          value: expiry
        },
        {
          id: 'dob',
          value: dob
        },
        {
          id: 'customer_type_name',
          value: this.paramFilter.customer_type_name
        }
      ]

      data.map(i => {
        if(i.id === 'customer_type_name' && i.value !== '') {
          param.search_column.push(i.id)
          param.search_text.push(i.value)
          param.search_operator.push('=')
        } else if (i.id !== 'customer_type_name') {
          if (i.value !== null) {
            console.log('aaa', i.id)
            param.search_column.push(i.id)
            param.search_text.push(i.value)
            param.search_operator.push('range')
          }
        }
      })

      return param
    }
  }
}
</script>
