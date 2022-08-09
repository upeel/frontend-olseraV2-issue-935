<template>
  <div v-loading="loading" class="sales-detail">
    <section class="order-detail">
      <el-card class="box-card with-back-button">
        <div class="card-body">
          <el-button icon="el-icon-arrow-left" class="back-button" @click="backHandle"/>

          <div class="flex-container flex-container--wrap">
            <div style="flex-grow: 1;">
              <h4 v-if="!openPurchaseData.purchase_no">-</h4>
              <h4 v-else>{{ openPurchaseData.purchase_no }}</h4>
              <p>{{ lang.purchase_by }} {{ openPurchaseData.purchase_by_name }}</p>
            </div>

            <div
              v-if="!showEdit">
              <el-select
                class="inline-form"
                v-model="openPurchaseData.status"
                :placeholder="lang.please_select"
                size="small"
                disabled
                style="max-width: 120px;">
                <el-option
                  v-for="item in statusSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>

              <el-button icon="el-icon-printer" @click="downloadPdf" />

              <el-date-picker
                class="date-purchase"
                v-model="openPurchaseData.fpurchase_date"
                type="date"
                :placeholder="$lang[langId].pick_a_day"
                format="dd-MM-yyyy"
                disabled
                style="max-width: 140px;"
              />

              <button-action-authenticated
                v-if="routeName === 'Complete Purchase Detail'"
                :permission="[permis, 'edit']"
                class="edit-header purchase"
                type="primary"
                icon="el-icon-edit"
                @click="editHeaderButton">
                {{ lang.edit }}
              </button-action-authenticated>
            </div>

            <div v-else>
              <div class="table-handler-flex">
                <el-select
                  class="inline-form mr-4"
                  v-model="openPurchaseData.status"
                  :disabled="!checkCustomPermission(permis, 'edit')"
                  :placeholder="lang.please_select"
                  size="small"
                  @change="handleUpdateStatus"
                  style="max-width: 120px;">
                  <el-option
                    v-for="item in statusSelect"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  />
                </el-select>

                <div class="mr-4">
                  <span>{{ lang.paid }} ?</span>
                  <el-switch
                    v-model="openPurchaseData.is_paid"
                    v-if="checkCustomPermission(permis, 'edit')"
                    :active-value="1"
                    :inactive-value="0"
                    :disabled="openPurchaseData.total_amount === '0.00' ? true : false"
                    @change="handleSwitchPayment"
                  />
                  <span v-if="openPurchaseData.is_paid === 0">{{ lang.not_yet}}</span>
                  <span v-if="openPurchaseData.is_paid === 1">{{ $lang[langId].done}}</span>
                </div>

                <el-button icon="el-icon-printer" class="mr-4" @click="downloadPdf" />

                <el-date-picker
                  class="date-purchase"
                  v-model="openPurchaseData.fpurchase_date"
                  type="date"
                  :placeholder="$lang[langId].pick_a_day"
                  :disabled="!checkCustomPermission(permis, 'edit')"
                  format="dd-MM-yyyy"
                  style="max-width: 140px;"
                  @change="changeDateHeader"
                />
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <el-row :gutter="10">
        <el-col :md="8">
          <el-card class="card-body">
            <div slot="header" class="flex-container flex-container--wrap">
              <h3 class="box-title">{{ lang.supplier }}</h3>
              <div v-if="showEdit">
                <el-button
                  v-if="isEditing.supplier"
                  type="text"
                  size="mini"
                  @click="cancelEdit('supplier')">
                  {{ lang.cancel }}
                </el-button>
                <el-button
                  v-if="isEditing.supplier"
                  type="success"
                  size="mini"
                  @click="saveEdit('supplier')">
                  {{ lang.save }}
                </el-button>
                <button-action-authenticated
                  v-if="!isEditing.supplier"
                  :permission="[permis, 'edit']"
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  :disabled="computedAccess"
                  @click="handleEdit('supplier')">
                  {{ lang.edit }}
                </button-action-authenticated>
              </div>
            </div>
            <div class="card-body">
              <div v-if="!isEditing.supplier">
                <div class="mb-8">
                  <p class="font-12 mb-0">{{ lang.supplier_name }}</p>
                  <div v-if="!openPurchaseData.supplier_name">-</div>
                  <div v-else>{{ openPurchaseData.supplier_name }}</div>
                </div>
                <div class="mb-8">
                  <p class="font-12 mb-0">{{ lang.phone }}</p>
                  <div v-if="!openPurchaseData.supplier_phone">-</div>
                  <div v-else>{{ openPurchaseData.supplier_phone }}</div>
                </div>
                <div class="mb-8">
                  <p class="font-12 mb-0">{{ lang.contact_person }}</p>
                  <div v-if="!openPurchaseData.supplier_contact_person">-</div>
                  <div v-else>{{ openPurchaseData.supplier_contact_person }}</div>
                </div>
                <div class="mb-8">
                  <p class="font-12 mb-0">{{ lang.email }}</p>
                  <div v-if="!openPurchaseData.supplier_email">-</div>
                  <div v-else>{{ openPurchaseData.supplier_email }}</div>
                </div>
                <div class="mb-8">
                  <p class="font-12 mb-0">{{ lang.address }}</p>
                  <div v-if="!openPurchaseData.supplier_address">-</div>
                  <div v-else>{{ openPurchaseData.supplier_address }}</div>
                </div>
                <div class="mb-8">
                  <p class="font-12 mb-0">{{ lang.notes }}</p>
                  <div v-if="!openPurchaseData.supplier_notes">-</div>
                  <div v-else>{{ openPurchaseData.supplier_notes }}</div>
                </div>
              </div>
              <div v-else>
                <p>{{ lang.search+' '+lang.supplier }}</p>
                <el-autocomplete
                  @select="handleSelectSupplier"
                  v-model="formSupplier.supplierName"
                  :fetch-suggestions="getSupplierSuggest"
                  :debounce="autoCompleteStartOn"
                  :placeholder="lang.search+' '+lang.supplier" clearable
                />
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :md="8">
          <el-card class="card-body">
            <div slot="header" class="flex-container flex-container--wrap">
              <h3 class="box-title">{{ lang.received_info }}</h3>
              <div v-if="showEdit">
                <el-button
                  v-if="isEditing.receiptInfo"
                  size="mini"
                  type="text"
                  @click="cancelEdit('receiptInfo')">
                  {{ lang.cancel }}
                </el-button>
                <el-button
                  v-if="isEditing.receiptInfo"
                  size="mini"
                  type="success"
                  :disabled="loadingElement"
                  @click="saveEdit('receiptInfo')">
                  <loading-component 
                    v-if="loadingElement"
                    :active="true" color= '#1bb4e6'
                    loader="dots" :width="32" :height="10"
                    backgroundColor='#ffffff' style="text-align: center">
                  </loading-component>
                  <span v-else>{{ lang.save }}</span>
                </el-button>
                <el-button
                  v-if="!isEditing.receiptInfo"
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  :disabled="computedAccess"
                  @click="handleEdit('receiptInfo')">
                  {{ lang.edit }}
                </el-button>
              </div>
            </div>
            <div class="card-body">
              <el-form
                :model="formReceiptInfo"
                ref="receiptInfo"
                @submit.native.prevent
                @keyup.native.enter="saveEdit('receiptInfo')">
                <div class="mb-8">
                  <p>{{ lang.received_date }}</p>
                  <div v-if="!isEditing.receiptInfo">
                    <h5 v-if="!openPurchaseData.freceived_date">-</h5>
                    <h5 v-else>{{ openPurchaseData.freceived_date }}</h5>
                  </div>
                  <div v-else>
                    <el-form-item prop="dateReceipt" :rules="[
                      { required: true, message: 'Please input date', trigger: 'change' }
                    ]">
                      <el-date-picker v-model="formReceiptInfo.dateReceipt" type="date" :placeholder="$lang[langId].pick_a_day" format="dd-MM-yyyy" value-format="yyyy-MM-dd">
                      </el-date-picker>
                    </el-form-item>
                  </div>
                </div>
                <div class="mb-8">
                  <p>{{ lang.received_no }}</p>
                  <div v-if="!isEditing.receiptInfo">
                    <h5 v-if="!openPurchaseData.received_no">-</h5>
                    <h5 v-else>{{ openPurchaseData.received_no }}</h5>
                  </div>
                  <div v-else>
                    <el-form-item prop="noReceipt" :rules="[
                      { required: true, message: 'Please input no receipt', trigger: 'blur' },
                    ]">
                      <el-input v-model="formReceiptInfo.noReceipt" type="text" :placeholder="$lang[langId].input_code" clearable></el-input>
                    </el-form-item>
                  </div>
                </div>
                <div v-if="isEditing.receiptInfo" class="mb-8">
                  <p>{{ lang.continue_add_incoming_stock }}</p>
                  <el-form-item prop="switchInStock" :rules="[
                    { required: true, message: 'Please select add stock', trigger: 'blur' },
                  ]">
                  <el-switch v-model="formReceiptInfo.switchInStock" :active-value="1" :inactive-value="0">
                  </el-switch>
                  <span v-if="formReceiptInfo.switchInStock === 0">{{ lang.no }}</span>
                  <span v-if="formReceiptInfo.switchInStock === 1">{{ lang.yes }}</span>
                </el-form-item>
                </div>
              </el-form>
            </div>
          </el-card>
        </el-col>

        <el-col :md="8">
          <el-card class="card-body">
            <div slot="header" class="flex-container flex-container--wrap">
              <h3 class="box-title">{{ lang.notes }}</h3>
              <div v-if="showEdit">
                <el-button type="text" v-if="isEditing.notes" size="mini" @click="cancelEdit('notes')">{{ lang.cancel }}</el-button>
                <el-button type="success" v-if="isEditing.notes" size="mini" @click="saveEdit('notes')">{{ lang.save }}</el-button>
                <el-button type="primary" v-if="!isEditing.notes" size="mini" @click="handleEdit('notes')" :disabled="computedAccess" icon="el-icon-edit">
                  {{ lang.edit }}
                </el-button>
              </div>
            </div>
            <div class="card-body">
              <div v-if="!isEditing.notes">
                <p v-if="!openPurchaseData.notes">{{ $lang[langId].there_is_no }}</p>
                <p v-else>{{ openPurchaseData.notes }}</p>
              </div>
              <div v-else>
                <el-input type="textarea" autosize v-model="formNotes.notes"></el-input>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :md="8">
          <el-card class="card-body">
            <div slot="header" class="flex-container flex-container--wrap">
              <h3 class="box-title">{{ lang.due_date }}</h3>
              <div v-if="showEdit">
                <el-button type="text" v-if="isEditing.due_date" size="mini" @click="cancelEdit('due_date')">{{ lang.cancel }}</el-button>
                <el-button type="success" v-if="isEditing.due_date" size="mini" @click="saveEdit('due_date')">{{ lang.save }}</el-button>
                <el-button type="primary" v-if="!isEditing.due_date" size="mini" @click="handleEdit('due_date')" :disabled="computedAccess" icon="el-icon-edit">
                  {{ lang.edit }}
                </el-button>
              </div>
            </div>
            <div class="card-body">
              <div v-if="!isEditing.due_date">
                <p v-if="!openPurchaseData.fpayment_due_date">{{ $lang[langId].there_is_no }}</p>
                <p v-else>{{ openPurchaseData.fpayment_due_date }}</p>
              </div>
              <div v-else>
                <div class="mb-16 flex-container">
                  <el-date-picker v-model="formDueDate.payment_due_date" type="date" :placeholder="$lang[langId].pick_a_day" format="dd-MM-yyyy" value-format="yyyy-MM-dd" />
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <purchase-table
        :data-table="openPurchaseData"
        :edit-show="showEdit"
        @changePayment="checkPayment"
      />

      <div class="flex-container mt-24" style="align-items: unset">
        <div class="full-width mr-8">
          <el-card class="box-card box-card--sales">
            <div slot="header" class="flex-container flex-container--wrap color-white--bg">
              <h3 class="box-title">{{$lang[langId].attactment_file}}</h3>
              <div class="pull-right">
                <el-upload :disabled="computedAccess"
                  v-loading="loadingUploadImport"
                  class="upload-demo"
                  :data="{purchase_id: openPurchaseData.id}"
                  :action="attachmentUploadImportUrl"
                  :headers="computedUploadImportHeaders"
                  :on-success="attachmentUploadSuccess"
                  :on-error="attachmentUploadError"
                  :on-progress="attachmentUploadProgress"
                  multiple
                  :show-file-list="false"
                  >
                  <button-action-authenticated slot="trigger" :permission="[permis, 'edit']" size="mini" type="info"
                  :disabled="computedAccess" @click="" icon="el-icon-plus">
                    {{lang.add}}
                  </button-action-authenticated>
                </el-upload>
              </div>
            </div>

            <div class="horizontal-scroll-wrapper">
              <div v-for="(file, index) in openPurchaseData.attachment" :key="index" class="pr-20">
                <el-card :body-style="{ padding: '0px' }">
                  <div class="p-14 font-16" v-if="file.is_image === 1">
                    <span><svg-icon icon-class="picture-file"></svg-icon> {{file.file_name}}</span>
                    <div style="margin-top: 13px; line-height: 12px;">
                      <el-button type="primary" size="small" class="button" @click="downloadAttachment(file)">Download</el-button>
                      <el-button type="danger" size="small" class="button" @click="deleteAttachment(file)">hapus</el-button>
                    </div>
                  </div>
                  <div class="p-14 font-16" v-else>
                    <span><svg-icon icon-class="pdf-file"></svg-icon> {{file.file_name}}</span>
                    <div style="margin-top: 13px; line-height: 12px;">
                      <el-button type="primary" size="small" class="button" @click="downloadAttachment(file)">Download</el-button>
                      <el-button type="danger" size="small" class="button" @click="deleteAttachment(file)">{{lang.delete}}</el-button>
                    </div>
                  </div>
                </el-card>

              </div>
            </div>

          </el-card>
        </div>
      </div>


      <div class="row">
        <div class="col-md-12">
          <el-card class="box-card">
            <div slot="header">
              <h3 class="box-title">{{ lang.deal_detail }}</h3>
            </div>
            <div class="card-body">
              <div style="margin-bottom: 22px;">
                <h5>{{ lang.created_time }}</h5>
                <label>{{ openPurchaseData.created_by }}, {{ openPurchaseData.created_time }}</label>
              </div>
              <div>
                <h5>{{ lang.last_modified }}</h5>
                <label>{{ openPurchaseData.modified_by }}, {{ openPurchaseData.modified_time }}</label>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import PurchaseTable from './DetailTablePurchase'
import moment from 'moment'
import LoadingComponent from 'vue-loading-overlay';
import { checkCustomPermission } from '@/mixins/checkCustomPermission'

export default {
  name: 'DetailPurchase',

  mixins: [checkCustomPermission],

  components: {
    PurchaseTable,
    LoadingComponent
  },

  data() {
    return {
      loading: true,
      loadingElement: false,
      loadingUploadImport: false,
      showTable: false,
      openPurchaseData: {},
      suggestData: [],
      autoCompleteStartOn: 300,
      showEdit: true,
      switchValue: 0,
      routeName: '',
      statusSelect: [
        {
          value: 'P',
          disabled: false,
          label: this.$lang[this.$store.state.userStores.langId].pending
        },
        {
          value: 'T',
          disabled: false,
          label: this.$lang[this.$store.state.userStores.langId].sent
        },
        {
          value: 'S',
          disabled: false,
          label: this.$lang[this.$store.state.userStores.langId].sending
        },
        {
          value: 'R',
          disabled: false,
          label: this.$store.state.userStores.lang.rewarded
        },
        {
          value: 'Z',
          disabled: false,
          label: this.$lang[this.$store.state.userStores.langId].complete
        },
        {
          value: 'X',
          disabled: this.$store.state.userStores.userRole.role_id !== 'ST' &&
           this.$store.state.userStores.userRole.role_id !== 'SA' &&
           this.$store.state.userStores.userRole.role_id !== 'PT' &&
           this.$store.state.userStores.userRole.role_id !== 'LW' ?
           false :
           true,
          label: this.$store.state.userStores.lang.cancel
        }
      ],
      isEditing: {
        supplier: false,
        receiptInfo: false,
        notes: false,
        due_date: false
      },
      formSupplier: {
        supplierId: '',
        supplierName: ''
      },
      formReceiptInfo: {
        dateReceipt: '',
        noReceipt: '',
        switchInStock: 1
      },
      formNotes: {
        notes: ''
      },
      formDueDate: {
        payment_due_date: ''
      },
      repeat: false,
      permis: 'purchase/openpurchases'
    }
  },
  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    selectRoute() {
      return this.$route.name
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
    },

    accessByStore () {
      return ['cvsms', 'smsstore1', 'smsstore2']
    },

    computedAccess () {
      if (this.accessByStore.includes(this.selectedStore.url_id) && (this.selectedStore.role_id === 'PT')) {
        return true
      }
    },
    attachmentUploadImportUrl() {
      const url = baseApi(this.selectedStore.url_id, this.langId, 'account/purchase/attachment')
      return url
    },
    computedUploadImportHeaders() {
      return {
        'authorization' : 'Bearer ' + this.token.access_token
      }
    },
  },

  beforeMount() {
    this.handleCustomPermissionSinglePage(this.permis, 'show')
  },

  mounted() {
    this.permis = 'purchase/openpurchases'
    if (this.$route.name === 'Complete Purchase Detail') {
      this.permis = 'purchase/closedpurchases'
    } else if (this.$route.name === 'Cancel Purchase Detail') {
      this.permis = 'purchase/cancelledpurchases'
    }
    this.getRoute(this.selectRoute, this.selectedStore)
  },

  methods: {
    getRoute(route, store) {
      if(Object.keys(this.$route.query).includes('pathName')){
        this.routeName = this.$route.query.pathName
      } else {
        this.routeName = route
      }

      let endpoint = ''
      if (route === 'Open Purchase Detail') {
        endpoint = 'openpurchase/'
      } else if (route === 'Complete Purchase Detail') {
        endpoint = 'closedpurchase/'
        this.showEdit = false
      } else if (route === 'Cancel Purchase Detail') {
        endpoint = 'cancelledpurchase/'
        this.showEdit = false
      }
      let url = baseApi(this.selectedStore.url_id, this.langId, endpoint + this.$route.params.id)
      this.getDetailData(url)
    },

    getDetailData(url) {
      this.loading = true
      if (typeof this.$route.query.rpt !== 'undefined') {
        this.repeat = true
      }
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: url,
        headers: headers
      }).then(response => {
        this.openPurchaseData = response.data.data
        console.log('aaaa', this.openPurchaseData)
        this.switchValue = this.openPurchaseData.is_paid
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    handleSwitchPayment() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        status: this.openPurchaseData.is_paid,
        id: this.openPurchaseData.id
      }
      axios({
        method: 'POST',
        // url: BASE_API + 'openpurchase/updatepaymentstatus',
        url: baseApi(this.selectedStore.url_id, this.langId, 'openpurchase/updatepaymentstatus'),
        headers: headers,
        params: params
      })
        .then(response => {
          // this.result = response.data
          this.openPurchaseData = response.data.data
          this.$message({
            message: 'Success',
            type: 'success'
          })
          this.getDetailData()
          this.loading = false
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.switchValue = this.openPurchaseData.is_paid
          this.getDetailData()
          this.loading = false
        })
    },

    handleUpdateStatus() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
        status: this.openPurchaseData.status,
        id: this.openPurchaseData.id
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'openpurchase/updatestatus'),
        headers: headers,
        data: data
      })
        .then(response => {
          this.openPurchaseData = response.data.data
          this.$message({
            message: 'Success',
            type: 'success'
          })
          this.loading = false
          this.getDetailData()
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.loading = false
        })
    },

    handleEdit(block) {
      if (block === 'supplier') {
        this.formSupplier.supplierId = this.openPurchaseData.supplier_id
        this.formSupplier.supplierName = this.openPurchaseData.supplier_name
        this.isEditing.supplier = true
      } else if (block === 'receiptInfo') {
        this.formReceiptInfo.dateReceipt = this.openPurchaseData.received_date
        this.formReceiptInfo.noReceipt = this.openPurchaseData.received_no
        this.isEditing.receiptInfo = true
      } else if (block === 'notes') {
        this.formNotes.notes = this.openPurchaseData.notes
        this.isEditing.notes = true
      } else if (block === 'due_date') {
        this.formDueDate.payment_due_date = this.openPurchaseData.payment_due_date
        this.isEditing.due_date = true
      }
    },

    cancelEdit(block) {
      if (block === 'supplier') {
        this.isEditing.supplier = false
        this.formSupplier.supplierId = ''
        this.formSupplier.supplierName = ''
      } else if (block === 'receiptInfo') {
        this.isEditing.receiptInfo = false
        this.formReceiptInfo.dateReceipt = ''
        this.formReceiptInfo.noReceipt = ''
        this.formReceiptInfo.switchInStock = 1
      } else if (block === 'notes') {
        this.isEditing.notes = false
        this.formNotes.notes = ''
      } else if (block === 'due_date') {
        this.isEditing.due_date = false
        this.formDueDate.payment_due_date = ''
      }
    },

    saveEdit(block) {
      if (block === 'supplier') {
        let method = 'PUT'
        let url = baseApi(this.selectedStore.url_id, this.langId, 'openpurchase/' + this.$route.params.id)
        let data = {
          supplier_id: this.formSupplier.supplierId
        }
        this.updateData(block, method, url, data)
      } else if (block === 'receiptInfo') {
        
        this.$refs[block].validate(valid => {
          if (valid) {
            let method = 'PUT'
            let url = baseApi(this.selectedStore.url_id, this.langId, 'openpurchase/updatereceivedinfo/' + this.$route.params.id)
            let data = {
              received_date: moment(this.formReceiptInfo.dateReceipt).format('YYYY-MM-DD'),
              received_no: this.formReceiptInfo.noReceipt,
              add_incoming_stock: this.formReceiptInfo.switchInStock
            }
            this.updateData(block, method, url, data)
          } else {
            return false
          }
        })
        
      } else if (block === 'notes') {
        let method = 'POST'
        let url = baseApi(this.selectedStore.url_id, this.langId, 'openpurchase/updateattr')
        let data = {
          id: this.openPurchaseData.id,
          name: 'notes',
          value: this.formNotes.notes
        }
        this.updateData(block, method, url, data)
      } else if (block === 'due_date') {
        let method = 'POST'
        let url = baseApi(this.selectedStore.url_id, this.langId, 'openpurchase/updateattr')
        let data = {
          id: this.openPurchaseData.id,
          name: 'payment_due_date',
          value: moment(this.formDueDate.payment_due_date).format('YYYY-MM-DD')
        }
        this.updateData(block, method, url, data)
      }
    },

    updateData(block, method, url, data) {
      this.loadingElement = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: method,
        url: url,
        headers: headers,
        data: data
      }).then(response => {
        this.openPurchaseData = response.data.data
        this.loading = false
        this.loadingElement = false
        this.$message({
          message: 'Success',
          type: 'success'
        })
        if (block === 'notes') {
          this.isEditing.notes = false
        }
        if (block === 'supplier') {
          this.isEditing.supplier = false
        }
        if (block === 'due_date') {
          this.isEditing.due_date = false
        }
        if (data.add_incoming_stock) {
          this.$router.push({
            path: '/inventory/stocksincoming/' + response.data.data.stock_in_out_id
          })
        }
      }).catch(error => {
        this.loading = false
        this.loadingElement = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.cancelEdit(block)
        this.getDetailData()
      })
    },

    changeDateHeader(val) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
        id: this.openPurchaseData.id,
        name: 'purchase_date',
        value: moment(val).format('YYYY-MM-DD')
      }
      axios({
        method: 'POST',
        // url: BASE_API + 'openpurchase/updateattr',
        url: baseApi(this.selectedStore.url_id, this.langId, 'openpurchase/updateattr'),
        headers: headers,
        data: data
      })
        .then(response => {
          this.openPurchaseData = response.data.data
          this.$message({
            message: 'Success',
            type: 'success'
          })
          this.loading = false
          this.getDetailData()
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.loading = false
        })
    },

    getSupplierSuggest(queryString, callback) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let params = {
        search: queryString
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'supplier'),
        headers: headers,
        params: params
      })
        .then(response => {
          for (let i of response.data.data) {
            i.value = i.name
          }
          this.suggestData = response.data.data
          callback(this.suggestData)
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        })
    },

    handleSelectSupplier(data) {
      this.formSupplier.supplierId = data.id
    },

    editHeaderButton() {
      this.showEdit = true
    },

    backHandle() {
      if (this.repeat) {
        if (this.$route.query.path === 'purchase') {
          this.$router.push({ path: '/reports/purchases' })
        }
        if (this.$route.query.path === 'unpaiddetails') {
          this.$router.push({ path: '/reports/purchases?path=unpaiddetails' })
        }
      } else {
        if (this.routeName === 'Open Purchase Detail') {
          this.$router.push({ path: '/purchase/openpurchase' })
        } else if (this.routeName === 'Complete Purchase Detail') {
          this.$router.push({ path: '/purchase/completepurchase' })
        } else if (this.routeName === 'Cancel Purchase Detail') {
          this.$router.push({ path: '/purchase/cancelpurchase' })
        } else if (this.routeName === 'Integrate Jurnal.ID'){
          this.$router.push({name: 'Integrate Jurnal.ID', 
            params: {lastParams: this.$route.query.lastParams, labelDate: this.$route.query.labelDate},
            query: {menu: 'general', tab: this.$route.query.tab}}
          )
        }
      }
    },

    checkPayment(data) {
      this.openPurchaseData = data
      if (this.openPurchaseData.outstanding_amount === 0.00) {
        this.openPurchaseData.is_paid = 1
        this.handleSwitchPayment()
      }
    },

    downloadPdf() {
      this.loading = true
      let path = ''
      let url = ''
      if (this.openPurchaseData.status === 'R') {
        path = 'closedpurchase'
        url = baseApi(this.selectedStore.url_id, this.langId, path + '/pdf?id=' + this.openPurchaseData.id)
      } else if (this.openPurchaseData.status === 'P') {
        path = 'openpurchase'
        url = baseApi(this.selectedStore.url_id, this.langId, path + '/pdf?id=' + this.openPurchaseData.id)
      } else if (this.openPurchaseData.status === 'X') {
        path = 'cancelledpurchase'
        url = baseApi(this.selectedStore.url_id, this.langId, path + '/pdf?id=' + this.openPurchaseData.id)
      } else if (this.openPurchaseData.status === 'Z') {
        path = 'openpurchase'
        url = baseApi(this.selectedStore.url_id, this.langId, path + '/pdf')
      } else {
        path = 'openpurchase'
        url = baseApi(this.selectedStore.url_id, this.langId, path + '/pdf')
      }

      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        url: url,
        method: 'GET',
        headers,
        responseType: 'blob',
        params: {
          id: this.openPurchaseData.id
        }
      }).then((response) => {
        const fileName = this.openPurchaseData.purchase_no + '.pdf'
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.$message({
          type: 'warning',
          message: 'failed'
        })
      })
    },

    attachmentUploadProgress() {
      this.loadingUploadAttachment = true
    },

    attachmentUploadSuccess(response) {
      this.loadingUploadAttachment = false
      this.getRoute(this.selectRoute, this.selectedStore)
      if (response.error === 0) {
      }
    },

    attachmentUploadError(error, file) {
      const errorJson = JSON.parse(error.message)
      this.loadingUploadAttachment = false
      this.$notify({
        type: 'error',
        title: errorJson.error.message,
        message: errorJson.error.error
      })
    },

    downloadAttachment(row){
      if(row.is_image === 1){
        window.open(row.photo_lg, '_blank').focus();
      }
    },

    deleteAttachment(row){
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/purchase/attachment/'+ row.id),
        headers: headers
      })
        .then(response => {

          this.$message({
            message: 'Success',
            type: 'success'
          })
          this.loading = false
          this.getRoute(this.selectRoute, this.selectedStore)
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.loading = false
          this.getRoute(this.selectRoute, this.selectedStore)
        })
    }
  }
}
</script>
