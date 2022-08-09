<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="table-handler-flex">
        <div style="flex-grow: 1;">
          <h4>{{ $lang[langId].order_need_process }}</h4>
          <p>{{ params.total }} {{ lang.orders }}</p>
        </div>

        <div>
          <el-button type="info" @click="importDialog = true">
            {{ lang.import_update_status }}
          </el-button>
          <router-link v-if="!canntAccess" :to="{name: 'Open Order Create'}">
            <el-button type="primary" icon="el-icon-plus">
              {{ lang.add }}
            </el-button>
          </router-link>
          <el-button v-else :disabled="true" type="primary" icon="el-icon-plus">
            {{ lang.add }}
          </el-button>
        </div>
      </div>

      <div class="card-body">
        <div class="table-handler-flex mb-16">
          <div
            class="mb-4"
            style="flex-grow: 1;">
            <el-select class="inline-form" v-model="params.per_page" @change="changePageTable" filterable :placeholder="lang.please_select" size="small">
              <el-option v-for="item in pages" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
          
          <div class="mb-4" style="flex-grow: 1;">
            <date-range-picker
              :init-date="initParamDate"
              :attendance="true"
              :all-time="allTimeDate"
              @picked="datePicked"
            />
          </div>

          <div class="mb-4">
            <el-tag v-if="filterTag" type="info" @close="closeFilterTag" closable>
              {{ filterTag }}
            </el-tag>

            <el-input class="inline-form input-search" clearable :placeholder="lang.search +' '+ lang.orders" prefix-icon="el-icon-search" v-model="params.search" @change="handleSearch" size="small"></el-input>

            <el-select class="inline-form" v-model="statusValue" @change="handleStatusSelect" :placeholder="lang.please_select" size="small">
              <el-option v-for="item in statusSelect" :key="item.value" :label="item.label" :value="item"></el-option>
            </el-select>

            <!-- <el-button type="info" size="small" @click="toggleFilter">
              <i class="fa fa-filter" />
              {{ $lang[langId].filter }}
            </el-button> -->
          </div>
        </div>

        <el-table
          v-loading="loading"
          :data="openOrderData"
          stripe
          border
          class="sales-table-max-height mobile-fix-height-unset"
          @sort-change="changeSortTable">
          <el-table-column
            :label="lang.order_no"
            sortable
            prop="order_no"
            width="180">
            <template slot-scope="props">
              <p>
                <router-link :to="{ path: '/sales/openorder/' + props.row.id }">
                  {{ props.row.order_no }}
                </router-link>
              </p>
            </template>
          </el-table-column>
          <el-table-column
            width="140"
            :label="lang.order_date"
            sortable
            prop="order_date">
            <template slot-scope="props">
              <div v-if="!props.row.forder_date">
                <p>-</p>
              </div>
              <div v-else>
                <p>{{ props.row.forder_date }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            width="140"
            :label="lang.due_date"
            sortable
            prop="payment_due_date">
            <template slot-scope="props">
              <div v-if="!props.row.fpayment_due_date">
                <p>-</p>
              </div>
              <div v-else>
                <p>{{ props.row.fpayment_due_date }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="lang.customer"
            sortable
            min-width="150px"
            prop="customer_name">
            <template slot-scope="props">
              <strong>{{ props.row.customer_name }}</strong><br/>
              <small>{{ props.row.customer_email }}</small>
            </template>
          </el-table-column>
          <el-table-column
            :label="lang.shipping_to"
            min-width="180px">
            <template slot-scope="props">
              <strong class="show-white-space">{{ props.row.shipping_text }}</strong><br/>
              <!-- <small>{{ props.row.shipping_courier_name }}</small> -->
            </template>
          </el-table-column>
          <el-table-column :label="lang.total" sortable prop="ftotal_amount" min-width="120px" />
          <el-table-column
            :label="lang.status"
            prop="status"
            width="120"
            sortable>
            <template slot-scope="props">
              <div v-if="!props.row.status">
                <p>-</p>
              </div>
              <inline-update-status
                :loading="loadingUpdateStatus"
                :status="props.row.status"
                :item-id="props.row.id"
                :additional-data="props.row"
                type="product-buy-price"
                @update="handleUpdateStatus($event, props.$index)"
              />
            </template>
          </el-table-column>
          <el-table-column
            :label="lang.paid"
            prop="is_paid"
            sortable
            width="150">
            <template slot-scope="props">
              <div v-if="props.row.is_paid === 0">
                <!-- <el-tag size="mini" type="danger">{{ lang.not_yet }}</el-tag> -->
                <div v-if="props.row.payment_type_id === 'CT'">
                  <el-tag size="mini" type="danger" effect="dark">{{ lang.not_yet }}</el-tag>
                </div>
                <div v-else>
                  <div v-if="props.row.payment_ref || props.row.payment_from_bank">
                    <el-tag size="mini" type="warning" effect="dark">{{ lang.not_yet }}</el-tag>
                  </div>
                  <div v-else>
                    <el-tag size="mini" type="info" effect="dark">{{ lang.not_yet }}</el-tag>
                  </div>
                </div>
              </div>
              <div v-if="props.row.is_paid === 1">
                <el-tag size="mini" type="success" effect="dark">{{ rootLang.done }}</el-tag>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div class="block">
          <el-pagination
            @size-change="changePageTable"
            @current-change="changeCurrentPage"
            :current-page.sync="params.currentPage"
            :page-size="params.per_page"
            layout="prev, pager, next, jumper"
            :total="params.total"
          />
        </div>
      </div>
    </el-card>

    <el-dialog
      :title="lang.import"
      :visible.sync="importDialog"
      custom-class="mw-760"
      @close="cancelImport">
      <el-row :gutter="12">
        <el-col :md="8">
          <a
            :href="baseURL + 'olsera_order_status_import_template.csv'"
            class="btn btn-default btn-block"
            target="_blank">
            {{ lang.download_template }}
          </a>
          <div class="mt-8">
            <div class="font-bold mb-8">{{ lang.description }}</div>
            {{ lang.status }}<br>
            P = {{ $lang[langId].pending }}<br>
            A = {{ $lang[langId].has_confirm }}<br>
            S = {{ $lang[langId].being_sent }}<br>
            T = {{ lang.delivered }}<br>
            Z = {{ $lang[langId].complete }}<br>
            X = {{ lang.cancel }}<br>
            {{ lang.import_from_csv_info }}<br>
          </div>
        </el-col>

        <el-col :md="16">
          <div class="font-18 font-bold mb-8">
            {{ lang.import_from_csv_info }}
          </div>
          <div class="mb-8">
            <vue-dropzone
              ref="dropzone"
              id="drop1"
              :options="{
                url: baseURL + 'api/' + this.selectedStore.url_id + '/admin/v1/' + this.langId + '/openorder/importfromcsv',
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
          <!-- <el-button
            @click="removeAllFiles">
            {{ $lang[langId].remove_all_file }}
          </el-button> -->

          <el-card v-if="tableImport">
            <div slot="header" class="clearfix" v-if="errorImport != 0">
              {{ $lang[langId].error_at }} {{errorImport}}. {{ $lang[langId].fix_upload_error }}.
            </div>

            <el-table
              ref="multipleTable"
              v-loading="loading"
              @selection-change="handleSelectionChange"
              @sort-change="handleSortChange"
              :data="tableImportCustomer"
              :default-sort="{prop: 'id', order: 'ascending'}"
              style="width: 100%"
              :row-class-name="tableRowClassName">

              <el-table-column :label="$lang[langId].number" type="index" :index="indexMethod">
              </el-table-column>

              <el-table-column :label="lang.order_no" prop="name" sortable min-width="200" class="red">
                <template slot-scope="props">
                    <strong>{{ props.row.order_no }}</strong>
                </template>
              </el-table-column>

              <el-table-column :label="lang.shipping_date" prop="shipping_date" sortable width="200">
              </el-table-column>

              <el-table-column :label="lang.tracking_no" prop="shipping_track_no" sortable width="150">
              </el-table-column>

              <el-table-column
                :label="lang.status"
                width="120"
                sortable>
                <template slot-scope="props">
                  <div style="font-size: 14px" v-if="props.row.update_status == 'S'">
                    {{ rootLang.being_sent }}
                  </div>
                  <div style="font-size: 14px" v-if="props.row.update_status == 'X'">
                    {{ lang.cancel }}
                  </div>
                  <div style="font-size: 14px" v-if="props.row.update_status == 'P'">
                    {{ rootLang.pending }}
                  </div>
                  <div style="font-size: 14px" v-if="props.row.update_status == 'A'">
                    {{ rootLang.has_confirm }}
                  </div>
                  <div style="font-size: 14px" v-if="props.row.update_status == 'T'">
                    {{ lang.delivered }}
                  </div>
                  <div style="font-size: 14px" v-if="props.row.update_status == 'Z'">
                    {{ rootLang.complete }}
                  </div>
                </template>
              </el-table-column>

              <el-table-column :label="lang.status+' '+lang.error" prop="error" sortable width="200">
              </el-table-column>

            </el-table>
          </el-card>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button
          type="info"
          @click="cancelImport">
          {{ lang.cancel }}
        </el-button>
        <el-button
          :disabled="btnProses"
          type="primary"
          @click="saveImportData">
          {{ lang.proceed }}
        </el-button>
      </div>
    </el-dialog>

    <custom-date-filter
      :show-filter="showFilter"
      @close="dateFilterClose"
      @reset="dateFilterReset"
      @save="dateFilterSave"
    />
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import moment from 'moment'
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import CustomDateFilter from 'modules/CustomDateFilter'

import checkPersistentParam from '@/mixins/checkPersistentParam'

import InlineUpdateStatus from '@/components/InlineUpdateStatus'
import basicComputedMixin from '@/mixins/basicComputedMixin'

import dateRangePicker from '@/components/modules/DateRangePicker'

export default {
  components: {
    vueDropzone: vue2Dropzone,
    CustomDateFilter,
    InlineUpdateStatus,
    dateRangePicker
  },
  mixins: [checkPersistentParam, basicComputedMixin],
  name: 'OpenOrderList',
  data() {
    return {
      loading: true,
      openOrderData: [],
      statusValue: null,
      searchValue: null,
      importDialog: false,
      dropdownForm: true,
      btnProses: true,
      tableImport: false,
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
        start_date: '',
        end_date: '',
        search: null,
        total: null,
        currentPage: 1,
        sort_column: 'id',
        sort_type: 'desc',
        per_page: 20,
        page: 1,
        store: null,
        search_column: null,
        search_text: '',
        status: null
      },
      showFilter: false,
      filterTag: '',
      // statusSelect: [
      //   {
      //     value: '',
      //     label: this.$store.state.userStores.lang.all
      //   },
      //   {
      //     value: 'P',
      //     label: this.$lang[this.$store.state.userStores.langId].pending
      //   },
      //   {
      //     value: 'A',
      //     label: this.$lang[this.$store.state.userStores.langId].has_confirm
      //   },
      //   {
      //     value: 'S',
      //     label: this.$lang[this.$store.state.userStores.langId].being_sent
      //   },
      //   {
      //     value: 'T',
      //     label: this.$store.state.userStores.lang.delivered
      //   }
      // ],
      loadingUpdateStatus: false,
      initParamDate: []
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
      return ['RP', 'SA']
    },

    rootLang() {
      return this.$lang[this.$store.state.userStores.langId]
    },

    accessByStore () {
      return ['cvsms', 'smsstore1', 'smsstore2']
      // return ['setdemo1']
    },
    emailCantAccess () {
      return ['sales@samaramicron.com', 'martina.maria@samaramicron.com']
    },
    canntAccess () {
      if (this.accessByStore.includes(this.selectedStore.url_id) && this.roleCantAccess.includes(this.userRole.role_id)) {
        return true
      } else {
        return false
      }
    },

    statusSelect () {
      let datastatus = [
        {
          value: '',
          label: this.$store.state.userStores.lang.all
        },
        {
          value: 'P',
          label: this.$lang[this.$store.state.userStores.langId].pending
        },
        {
          value: 'A',
          label: this.$lang[this.$store.state.userStores.langId].has_confirm
        },
        {
          value: 'S',
          label: this.$lang[this.$store.state.userStores.langId].being_sent
        },
        {
          value: 'T',
          label: this.$store.state.userStores.lang.delivered
        }
      ]
      return datastatus
    },

    allTimeDate () {
      if (this.params.start_date && this.params.end_date) {
        return false
      } else {
        return true
      }
    }
  },
  watch: {
    '$store.getters.selectedStore': function() {
      this.getOpenOrder()
    }
  },
  mounted() {
    this.checkPersistentMeta()
    /**
     * ??????
     */
    // if (this.$store.getters.selectedStore.pos_freemium === 1 && this.selectedStore.is_onlineshop === 1) {
    //   this.getOpenOrder()
    // } else {
    //   this.getOpenOrder()
    // }
    this.getOpenOrder()
    this.checkFilterAvailable()
    // this.getDate()
  },
  methods: {
    getDate() {
      this.params.end_date = moment().format('YYYY-MM-DD')
      this.params.start_date = moment().subtract(6, 'd').format('YYYY-MM-DD')
      this.initParamDate = [this.params.start_date, this.params.end_date]
    },
    getOpenOrder(store) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'openorder'),
        params: this.params,
        headers: headers
      })
        .then(response => {
          this.openOrderData = response.data.data
          this.params.total = response.data.meta.total
          this.loading = false
          // console.log(response)
        })
        .catch((error, xhr) => {
          this.loading = false
          this.openOrderData = []
          this.params.total = 0
          this.params.page = 1
        })
    },
    changePageTable(val) {
      this.params.per_page = val
      this.getOpenOrder()
    },
    handleSearch(val) {
      this.params.page = 1
      this.params.currentPage = 1
      this.params.per_page = 100
      // if (this.statusValue === null) {
      //   this.params.search_text = ''
      //   this.params.search_column = null
      // } else if (this.statusValue.value = '') {
      //   this.params.search_text = ''
      //   this.params.search_column = null
      // }
      // this.params.search = this.searchValue
      this.getOpenOrder()
    },
    handleStatusSelect(val) {
      if (val.label === this.lang.all) {
        this.statusValue.value = ''
        this.params.page = 1
        this.params.currentPage = 1
        this.params.search_text = ''
        this.params.search_column = null
        this.getOpenOrder()
      } else {
        this.params.page = 1
        this.params.currentPage = 1
        this.params.search_text = this.statusValue.value
        this.params.search_column = 'status'
        this.getOpenOrder()
      }
    },
    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      if (val.order === null) val.order = this.params.sort_type
      // console.log(val)
      var prop = ''
      if (val.prop === 'ftotal_amount') {
        prop = 'total_amount'
      } else {
        prop = val.prop
      }
      this.params.sort_type = val.order
      this.params.sort_column = prop
      this.getOpenOrder()
    },
    changeCurrentPage(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getOpenOrder()
    },
    rowClick(row) {
      this.$router.push({ path: '/sales/openorder/' + row.id })
    },
    importStatus() {
      this.$router.push({path: '/sales/updatestatus'})
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
        this.tableImportCustomer = response.data
        this.totalRow = response.row
        this.errorImport = response.unready_import
        this.tableImport = true
        this.fileConfirm = response.file_confirmed
        // this.$router.push({path: '/inventory/stocksincoming'})
      }
    },
    failed(file, message, xhr) {
      // console.log('file', file)
      // console.log('message', message)
      // console.log('xhr', xhr)
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
        url: baseApi(this.selectedStore.url_id, this.langId, 'openorder/importconfirmed?file_confirmed=' + this.fileConfirm),
        headers: headers
      })
        .then(response => {
          // this.customerData = response.data.data
          this.loading = false
          // console.log(response)
          this.$router.push({path: '/sales/openorder'})
          this.cancelImport()
          this.importDialog = false
          this.$notify({
            title: 'Success',
            message: response.data.message + ' Customer.'
          })
        })
        .catch((error, xhr) => {
          this.loading = false
          // console.log(error)
          // console.log(xhr)
        })
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

    toggleFilter() {
      if (this.showFilter) {
        this.showFilter = false
      } else {
        this.showFilter = true
      }
    },

    dateFilterClose() {
      this.showFilter = false
    },

    dateFilterReset(data) {
      this.filterTag = '',
      this.$delete(this.params, 'start_date')
      this.$delete(this.params, 'end_date')
      this.dateFilterClose()
      this.getOpenOrder()
    },

    dateFilterSave(filter) {
      // console.log(filter)
      this.filterTag = filter.labelForDate
      this.$set(this.params, 'filtertag', filter.labelForDate)
      this.$set(this.params, 'start_date', filter.startDate)
      this.$set(this.params, 'end_date', filter.endDate)
      this.dateFilterClose()
      this.getOpenOrder()
    },

    closeFilterTag() {
      this.dateFilterReset()
    },

    handleUpdateStatus(data, index, parentIndex) {
      this.loadingUpdateStatus = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'openorder/updatestatus'),
        headers: headers,
        data: data
      }).then(response => {
        this.openOrderData[index].status = response.data.data.status
        this.$message({
          message: 'Success',
          type: 'success'
        })
        this.loadingUpdateStatus = false
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loadingUpdateStatus = false
      })
    },

    checkFilterAvailable() {
      if (this.params.search_column === 'status') {
        this.statusSelect.map(i => {
          if (this.params.search_text === i.value) {
            this.statusValue = i
          }
        })
      }

      if (this.params.filtertag) { this.filterTag = this.params.filtertag }
    },
    datePicked (value) {
      console.log('picked', value)
      this.params.page = 1
      if (value) {
        this.params.start_date = value.start_date
        this.params.end_date = value.end_date
        this.getOpenOrder()
      } else {
        this.getOpenOrder()
      }
    },
  }
}
</script>
