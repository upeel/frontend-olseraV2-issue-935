<template>
    <div v-loading="loading" class="sales-detail">
      <section class="order-detail">
        <el-card class="box-card with-back-button">
          <div class="card-body">
            <el-button icon="el-icon-arrow-left" class="back-button" @click="back"/>

            <div class="flex-container flex-container--wrap">
              <div style="flex-grow: 1;">
                <h4 v-if="!returnOrderData.return_no">-</h4>
                <h4 v-else class="font-bold">{{ returnOrderData.return_no }}</h4>
                <p>{{ lang.sales_by }} {{ returnOrderData.created_by }}</p>
              </div>

              <div v-if="checkCustomPermission('sales/salesreturns', 'edit')">
                <el-select
                  v-if="returnOrderData.status !== 'A'"
                  v-model="returnOrderData.status"
                  :placeholder="lang.status"
                  size="small"
                  class="inline-form mb-4"
                  @change="handleUpdateStatus">
                  <el-option
                    v-for="item in statusSelect"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>

                <el-button @click="emailDialog = true" icon="el-icon-message" class="mb-4">
                  {{ lang.email }}
                </el-button>

                <el-dropdown class="drop-complete mb-4" @command="handleDownload">
                  <el-button class="el-dropdown-link" icon="el-icon-printer"></el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="(command, index) in downloadSelect"
                      :key="index"
                      :command="command.value">
                      {{command.label}}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>

                <el-date-picker class="return-date mb-4" v-model="returnOrderData.return_date" type="date" @change="changeDateHeader" :placeholder="$lang[langId].pick_a_day" format="dd-MM-yyyy" value-format="yyyy-MM-dd">
                </el-date-picker>
              </div>
            </div>
          </div>
        </el-card>

        <div class="row">
          <div class="col-md-4">
            <el-card class="box-card">
              <div slot="header">
                <h3 class="box-title">{{ lang.customer }}</h3>
              </div>
              <div class="card-body">
                <ul class="list-unstyled">
                  <li>
                    <p>{{ lang.name }}</p>
                    <div v-if="!isEditing.customer">
                      <h5 v-if="!returnOrderData.customer_name">-</h5>
                      <h5 v-else>{{ returnOrderData.customer_name }}</h5>
                    </div>
                    <div v-else>
                      <el-input v-model="returnOrderData.customer_name"></el-input>
                    </div>
                  </li>
                  <li>
                    <p>{{ lang.email }}</p>
                    <div v-if="!isEditing.customer">
                      <h5 v-if="!returnOrderData.customer_email">-</h5>
                      <h5 v-else>{{ returnOrderData.customer_email }}</h5>
                    </div>
                    <div v-else>
                      <el-input v-model="returnOrderData.customer_email"></el-input>
                    </div>
                  </li>
                </ul>
              </div>
            </el-card>
          </div>
          <div class="col-md-4">
            <el-card class="box-card">
              <div slot="header" class="flex-container flex-container--wrap">
                <h3 class="box-title">{{ lang.orders }}</h3>
                <div v-if="returnOrderData.status === 'P'">
                  <div v-if="!hideEdit" class="pull-right">
                    <el-button type="text" v-if="isEditing.order" @click="cancelEdit('order')">{{ lang.cancel }}</el-button>
                    <el-button type="success" v-if="isEditing.order" @click="saveEdit('order')">{{ lang.save }}</el-button>
                    <button-action-authenticated :permission="['sales/salesreturns', 'edit']" type="primary" v-if="!isEditing.order" @click="handleEdit('order')" icon="el-icon-edit">
                      {{ lang.edit }}
                    </button-action-authenticated>
                  </div>
                </div>
              </div>
              <div class="card-body">
                <ul class="list-unstyled">
                  <li>
                    <p>{{ lang.customer }}</p>
                    <div v-if="!isEditing.order">
                      <h5 v-if="!returnOrderData.customer_name">-</h5>
                      <h5 v-else>{{ returnOrderData.customer_name }}</h5>
                    </div>
                    <div v-else>
                      <el-autocomplete @select="handleSelectCustomer" v-model="formOrder.customerValue" :fetch-suggestions="getCustomerSuggest" :debounce="autoCompleteStartOn" :placeholder="lang.search+' '+lang.customer">
                      </el-autocomplete>
                    </div>
                  </li>
                  <li>
                    <p>{{ lang.order_no }}</p>
                    <div v-if="!isEditing.order">
                      <h5 v-if="!returnOrderData.sales_order_no">-</h5>
                      <h5 v-else>{{ returnOrderData.sales_order_no }}</h5>
                    </div>
                    <div v-else>
                      <el-input v-if="formOrder.suggestOrderNo.length < 1" disabled :value="$lang[langId].there_is_no"></el-input>
                      <el-select v-else class="inline-form" v-model="formOrder.orderNo" filterable :placeholder="lang.please_select">
                        <el-option v-for="item in formOrder.suggestOrderNo" :key="item.id" :label="item.order_no" :value="item.id">
                        </el-option>
                      </el-select>
                    </div>
                  </li>
                </ul>
              </div>
            </el-card>
          </div>
          <div class="col-md-4">
            <el-card class="box-card">
              <div slot="header" class="flex-container flex-container--wrap">
                <h3 class="box-title">{{ lang.notes }}</h3>
                <div v-if="returnOrderData.status === 'P'">
                  <el-button type="text" v-if="isEditing.notes" @click="cancelEdit('notes')">{{ lang.cancel }}</el-button>
                  <el-button type="success" v-if="isEditing.notes" @click="saveEdit('notes')">{{ lang.save }}</el-button>
                  <button-action-authenticated :permission="['sales/salesreturns', 'edit']" type="primary" v-if="!isEditing.notes" @click="handleEdit('notes')" icon="el-icon-edit">
                    {{ lang.edit }}
                  </button-action-authenticated>
                </div>
              </div>
              <div class="card-body">
                <div v-if="!isEditing.notes">
                  <p v-if="!returnOrderData.notes">{{ $lang[langId].there_is_no }}</p>
                  <p v-else>{{ returnOrderData.notes }}</p>
                </div>
                <div v-else>
                  <el-input type="textarea" autosize v-model="formNotes" :placeholder="$lang[langId].please_input+lang.notes"></el-input>
                </div>
              </div>
            </el-card>
          </div>
        </div>

        <return-table
          :data-table="returnOrderData"
          @item-deleted="itemDeleted"
        />

        <el-card class="box-card">
          <div slot="header">
            <h3 class="box-title">{{ lang.sales_return_details }}</h3>
          </div>
          <div class="card-body">
            <div style="margin-bottom: 22px;">
              <h5>{{ lang.created_time }}</h5>
              <label>{{ returnOrderData.created_by }}, {{ returnOrderData.created_time }}</label>
            </div>
            <div>
              <h5>{{ lang.last_modified }}</h5>
              <label>{{ returnOrderData.modified_by }}, {{ returnOrderData.modified_time }}</label>
            </div>
          </div>
        </el-card>
      </section>

      <el-dialog class="email-dialog" :visible.sync="emailDialog" width="30%">
        <span slot="title">
          <svg-icon icon-class="mail"></svg-icon>
          {{ lang.email }}
        </span>
        <p>{{ $lang[langId].send_notification_via_email }}</p>
        <span slot="footer" class="dialog-footer">
          <el-button type="text" @click="emailDialog = false" style="color: #A5A5A5;">{{ lang.cancel }}</el-button>
          <el-button type="success" @click="sendEmail">
            {{ lang.submit }}
          </el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import ReturnTable from './ReturnOrderTable'
import { checkCustomPermission } from '@/mixins/checkCustomPermission'
export default {
  name: 'DetailReturnOrder',
  mixins: [checkCustomPermission],
  components: {
    ReturnTable
  },
  data() {
    return {
      loading: true,
      loadingElement: false,
      returnOrderData: {},
      downloadValue: null,
      emailDialog: false,
      emailRadioValue: 1,
      statusSelect: [
        {
          value: 'D',
          label: this.$lang[this.$store.state.userStores.langId].draft
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
          value: 'X',
          label: this.$lang[this.$store.state.userStores.langId].cancel
        }
      ],
      downloadSelect: [
        {
          value: 'pdf',
          label: this.$store.state.userStores.lang.download_pdf
        }
      ],
      isEditing: {
        order: false,
        notes: false
      },
      formNotes: '',
      formOrder: {
        customerValue: '',
        suggestCustomer: [],
        customerId: null,
        suggestOrderNo: [],
        orderNo: null
      },
      autoCompleteStartOn: 300,
      hideEdit: false,
      email_id: ''
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
  methods: {
    getDetailData(store) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'salesreturn/' + this.$route.params.id),
        headers: headers
      })
        .then(response => {
          this.returnOrderData = response.data.data
          this.splitDate(this.returnOrderData.return_date)
          if (this.returnOrderData.returnitems.length > 0) {
            this.hideEdit = true
          }
          this.loading = false
        })
        .catch(error => {
          this.loading = false
          // console.log(error)
          this.$notify({
            type: 'warning',
            message: error
          })
        })
    },

    handleDownload(file) {
      this.download(file)
    },

    download(file) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        url: baseApi(this.selectedStore.url_id, this.langId, 'salesreturn/' + file),
        method: 'GET',
        headers,
        responseType: 'blob',
        params: {
          id: this.returnOrderData.id
        }
      }).then((response) => {
        const fileName = this.returnOrderData.return_no + '_' + file + '.pdf'
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.statusText
        })
      })
    },

    handleUpdateStatus() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
        status: this.returnOrderData.status,
        return_id: this.returnOrderData.id
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'salesreturn/updatestatus'),
        headers: headers,
        data: data
      }).then(response => {
        this.result = response.data
        this.returnOrderData = response.data.data
        this.loading = false
        this.$message({
          message: 'Success',
          type: 'success'
        })
        this.getDetailData()
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loading = false
      })
    },

    handleEdit(block) {
      if (block === 'order') {
        this.isEditing.order = true
      } else if (block === 'notes') {
        this.formNotes = this.returnOrderData.notes
        this.isEditing.notes = true
      }
    },
    cancelEdit(block) {
      if (block === 'order') {
        this.formOrder.customerValue = ''
        this.suggestCustomer = []
        this.customerId = null
        this.suggestOrderNo = []
        this.orderNo = null
        this.isEditing.order = false
      } else if (block === 'notes') {
        this.formNotes = ''
        this.isEditing.notes = false
      }
    },
    saveEdit(block) {
      if (block === 'order') {
        let url = baseApi(this.selectedStore.url_id, this.langId, 'salesreturn/updatecustomerorder')
        if (this.formOrder.orderNo === '') {
          this.formOrder.orderNo = 0
        }
        let data = {
          return_id: this.returnOrderData.id,
          customer_id: this.formOrder.customerId,
          order_id: this.formOrder.orderNo
        }
        this.updateData(block, url, data)
      } else if (block === 'notes') {
        let url = baseApi(this.selectedStore.url_id, this.langId, 'salesreturn/updateattr')
        let data = {
          pk: this.returnOrderData.id,
          name: 'notes',
          value: this.formNotes
        }
        this.updateData(block, url, data)
      }
    },
    updateData(block, url, data) {
      this.loadingElement = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: url,
        headers: headers,
        data: data
      })
        .then(response => {
          this.result = response.data
          if (response.data.status === 200) {
            this.returnOrderData = response.data.data
            this.$message({
              message: 'Success',
              type: 'success'
            })
          }
          if (response.data.error) {
            this.$message({
              message: 'Error',
              type: 'error'
            })
          }
          this.loading = false
          this.cancelEdit(block)
          this.getDetailData()
        })
        .catch(error => {
          this.loading = false
          this.$notify({
            title: 'Error: ' + error,
            type: 'warning',
            message: 'Error: ' + error
          })
          this.getDetailData()
        })
    },
    splitDate(val) {
      let date = val
      let dateSplit = date.split(' ')
      let returnDate = dateSplit[0]
      this.returnOrderData.return_date = returnDate
    },
    changeDateHeader(val) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
        pk: this.returnOrderData.id,
        name: 'return_date',
        value: val
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'salesreturn/updateattr'),
        headers: headers,
        data: data
      })
        .then(response => {
          this.result = response.data
          if (response.data.status === 200) {
            this.returnOrderData = response.data.data
            this.$message({
              message: 'Success',
              type: 'success'
            })
          }
          if (response.data.error) {
            this.$message({
              message: 'Error',
              type: 'error'
            })
          }
          this.loading = false
          this.getDetailData()
        })
        .catch(error => {
          // console.log(error)
          this.loading = false
        })
    },
    getCustomerSuggest(queryString, callback) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let params = {
        search: queryString
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'customer'),
        headers: headers,
        params: params
      })
        .then(response => {
          for (let i of response.data.data) {
            i.value = i.customer_text
          }
          this.formOrder.suggestCustomer = response.data.data
          callback(this.formOrder.suggestCustomer)
        })
        .catch(error => {
          // console.log(error)
        })
    },
    handleSelectCustomer(data) {
      this.formOrder.customerId = data.id
      this.formOrder.orderNo = ''
      this.formOrder.suggestOrderNo = []
      this.getOrderNoCust()
    },
    getOrderNoCust() {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let params = {
        customer_id: this.formOrder.customerId
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'salesreturn/refundableorders'),
        headers: headers,
        params: params
      })
        .then(response => {
          this.formOrder.suggestOrderNo = response.data.data
        })
        .catch(error => {
          // console.log(error)
        })
    },
    back() {
      if(Object.keys(this.$route.query).includes('pathName')){
        this.$router.push({name: 'Integrate Jurnal.ID', 
          params: {lastParams: this.$route.query.lastParams, labelDate: this.$route.query.labelDate},
          query: {menu: 'general', tab: this.$route.query.tab}}
        )
      }else{
        this.$router.push('/sales/returnorder/')
      }
    },

    itemDeleted() {
      this.getDetailData()
    },
    sendEmail() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let params = {
        type: 'R',
        return_id: this.$route.params.id,
        email_type_id: this.email_id
      }

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'allorder/sendemail'),
        headers: headers,
        params: params
      }).then(response => {
        this.loading = false
        this.$notify({
            type: 'success',
            title: 'Succes',
            message: response.data.message
          })
      }).catch(error => {
        this.loading = false
        // console.log(error)
      })
      this.emailDialog = false
    },

    getEmailID() {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'emailnotify'),
        headers: headers
      }).then(response => {
        response.data.data.map(i => {
          if (i.id === 107) {
            this.email_id =  i.id
          }
        })
        // console.log('email', response)
      }).catch(error => {
        // console.log(error)
      })
    }
  },
  beforeMount() {
    this.handleCustomPermissionSinglePage('sales/salesreturns', 'show')
  },
  mounted() {
    // console.log(this.selectedStore)
    this.getEmailID()
    this.getDetailData(this.selectedStore)
  }
}
</script>
