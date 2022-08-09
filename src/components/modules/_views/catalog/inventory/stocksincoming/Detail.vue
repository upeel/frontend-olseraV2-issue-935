<template>
  <section v-loading="loading">
    <div class="color-info--bg flex-container radius-10 p-8 mb-24 mt-24">
      <div class="container-icon">
        <i class="el-icon-warning-outline" />
      </div>
      <div class="full-width">
        {{
        'Pastikan data sudah benar sebelum diposting. Setelah terposting, data tidak diperbolehkan diubah.'
        }}
      </div>
    </div>
    <template v-if="data">
      <el-card class="box-card pos-relative card-body-inventory">
        <div class="card-body">
          <div class="inventory-status" :class="classBasedOnStatus">
            <template v-if="data.status === 'P'">
              <span><i class="el-icon-circle-check"></i></span>{{ data.status_desc }}
            </template>
            <template v-if="data.status  === 'X'">
              <span><i class="el-icon-error"></i></span>{{ data.status_desc }}
            </template>
            <template v-if="data.status  === 'D'">
              <span><i class="el-icon-document"></i></span>{{ data.status_desc }}
            </template>
          </div>

          <div class="flex-container with-padding-left">
            <div>
              <small class="color-info">{{ lang.incoming_stock_no }}</small>
              <h4 v-if="!data.trans_no">-</h4>
              <h4 v-else class="font-bold">{{ data.trans_no }}</h4>
            </div>
            <div class="full-width text-right">
              <button-action-authenticated :permission="['inventory/stockincomings', 'edit']" v-if="data.status !== 'D' " icon="el-icon-back" size="small" type="success" class="ml-8" plain @click="backHandle">{{ lang.back }}</button-action-authenticated>
              <button-action-authenticated :permission="['inventory/stockincomings', 'edit']" icon="el-icon-printer" size="small" class="ml-4 btn-no-shadow" @click="handlePrint()">{{ lang.print }}</button-action-authenticated>
              <button-action-authenticated :permission="['inventory/stockincomings', 'edit']" v-if="data.status === 'D' " icon="el-icon-takeaway-box" size="small" class="ml-4 btn-no-shadow color-warning--bg color-white" @click="backHandle">{{ $lang[langId].draft }}</button-action-authenticated>
              <template v-if="data.IsEditable">
                <button-action-authenticated :permission="['inventory/stockincomings', 'edit']" icon="el-icon-close" size="small" class="ml-4 mt-8 btn-danger btn-no-shadow"
                  @click="updateStatus('X')">
                  {{ $lang[langId].canceled }}
                </button-action-authenticated>
                <button-action-authenticated :permission="['inventory/stockincomings', 'edit']" icon="el-icon-check" type="success" size="small" class="ml-4 mt-8 btn-no-shadow"
                  @click="updateStatus('P')">
                  {{ $lang[langId].post_now }}
                </button-action-authenticated>
              </template>
            </div>
          </div>
        </div>
      </el-card>

      <div class="row">
        <div class="col-md-4">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <strong>{{ lang.date }}</strong>
              <div style="float: right;">
                <template v-if="data.IsEditable === true">
                  <button-action-authenticated :permission="['inventory/stockincomings', 'edit']"
                    @click="editBlock('date')"
                    v-if="!isEditing.date"
                    type="primary"
                    size="mini">
                    <svg-icon icon-class="edit-2" />
                    {{ lang.edit }}
                  </button-action-authenticated>
                </template>
                <button-action-authenticated :permission="['inventory/stockincomings', 'edit']"
                  type="text"
                  @click="cancelEditBlock('date')"
                  v-if="isEditing.date"
                  size="mini">
                  {{ lang.cancel }}
                </button-action-authenticated>
                <button-action-authenticated :permission="['inventory/stockincomings', 'edit']"
                  :disabled="isButtonDisabled"
                  @click="save('date')"
                  v-if="isEditing.date"
                  icon="el-icon-check"
                  type="success"
                  size="mini">
                  {{ lang.save }}
                </button-action-authenticated>
              </div>
            </div>
            <div class="box-card-content">
              <template v-if="isEditing.date">
                <el-date-picker
                  v-model="tmp.date"
                  type="date"
                  :placeholder="$lang[langId].pick_a_day">
                </el-date-picker>
              </template>
              <template v-else>
                {{data.fdate}}<br/><small>{{data.created_by}}</small>
              </template>
            </div>
          </el-card>
        </div>

        <div class="col-md-4">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <strong>{{ lang.supplier }}</strong>
              <div style="float: right;">
                <template v-if="data.IsEditable === true">
                  <button-action-authenticated :permission="['inventory/stockincomings', 'edit']"
                    v-if="!isEditing.supplier"
                    @click="editBlock('supplier')"
                    type="primary"
                    size="mini">
                    <svg-icon icon-class="edit-2" />
                    {{ lang.edit }}
                  </button-action-authenticated>
                </template>
                <button-action-authenticated :permission="['inventory/stockincomings', 'edit']"
                  v-if="isEditing.supplier"
                  type="text"
                  @click="cancelEditBlock('supplier')"
                  size="mini">
                  {{ lang.cancel }}
                </button-action-authenticated>
                <button-action-authenticated :permission="['inventory/stockincomings', 'edit']"
                  v-if="isEditing.supplier"
                  :disabled="isButtonDisabledSuplier"
                  @click="save('supplier')"
                  icon="el-icon-check"
                  type="success"
                  size="mini">
                  {{ lang.save }}
                </button-action-authenticated>
              </div>
            </div>
            <div class="box-card-content">
              <el-form
                v-if="isEditing.supplier"
                :model="data"
                @submit.native.prevent="save('supplier')">
                <el-form-item prop="supplier">
                  <el-autocomplete
                    style="width: 100%;"
                    v-model="data.supplier"
                    :fetch-suggestions="getSuppliers"
                    :placeholder="lang.info_auto_complete_product"
                    @select="selectSupplier">
                  </el-autocomplete>
                </el-form-item>
              </el-form>
              <template v-else>
                {{data.supplier_name}}
              </template>
            </div>
          </el-card>
        </div>

        <div class="col-md-4">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <strong>{{ lang.notes }}</strong>
              <div style="float: right;">
                <template v-if="data.IsEditable === true">
                  <button-action-authenticated :permission="['inventory/stockincomings', 'edit']"
                    @click="editBlock('note')"
                    v-if="!isEditing.note"
                    type="primary"
                    size="mini">
                    <svg-icon icon-class="edit-2" />
                    {{ lang.edit }}
                  </button-action-authenticated>
                </template>
                <button-action-authenticated :permission="['inventory/stockincomings', 'edit']"
                  type="text"
                  @click="cancelEditBlock('note')"
                  v-if="isEditing.note"
                  size="mini">
                  {{ lang.cancel }}
                </button-action-authenticated>
                <button-action-authenticated :permission="['inventory/stockincomings', 'edit']"
                  :disabled="isButtonDisabled"
                  @click="save('note')"
                  v-if="isEditing.note"
                  icon="el-icon-check"
                  type="success"
                  size="mini">
                  {{ lang.save }}
                </button-action-authenticated>
              </div>
            </div>
            <div class="box-card-content">
              <template v-if="isEditing.note">
                <el-input v-model="tmp.note" type="text" @keyup.native.enter="save('note')" />
              </template>
              <template v-else>
                {{data.note}}
              </template>
            </div>
          </el-card>
        </div>
      </div>

      <stocks-table
        :editable="data.IsEditable"
        :is-item-added="itemAdded"
        :is-button-disabled="isButtonDisabled"
        :data-table="data.items"
        :data-stock="data"
        @itemadded="addItem"
        @itemupdated="itemUpdated">
      </stocks-table>

      <div id="printView" style="display: none;">
        <el-card class="box-card">
          <div slot="header">
            <div class="inventory-status" :class="classBasedOnStatus" style="font-size: 22px; font-weight: bold; width: 200px;">
              <template v-if="data.status  === 'P'">
                <span><i class="el-icon-circle-check"></i></span> {{ data.status_desc }}
              </template>
              <template v-if="data.status  === 'X'">
                <span><i class="el-icon-error"></i></span> {{ data.status_desc }}
              </template>
              <template v-if="data.status  === 'D'">
                <span><i class="el-icon-document"></i></span> {{ data.status_desc }}
              </template>
            </div>
            <div class="pull-right">
              <small style="color: #ccc;">{{ lang.incoming_stock_no }}</small>
              <h4 v-if="!data.trans_no">-</h4>
              <h4 v-else>{{ data.trans_no }}</h4>
            </div>
          </div>

          <div class="row" style="margin-bottom: 10px;">
            <div class="col-md-4">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <strong>{{ lang.date }}</strong>
                </div>
                <div class="box-card-content">
                  <template>
                    <div v-if="data.fdate">
                      {{data.fdate}}<br/><small>{{data.created_by}}</small>
                    </div>
                    <div v-else>-</div>
                  </template>
                </div>
              </el-card>
            </div>

            <div class="col-md-4">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <strong>{{ lang.supplier }}</strong>
                </div>
                <div class="box-card-content">
                  <template>
                    <p v-if="data.supplier_name">
                      {{data.supplier_name}}
                    </p>
                    <p v-else>-</p>
                  </template>
                </div>
              </el-card>
            </div>

            <div class="col-md-4">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <strong>{{ lang.notes }}</strong>
                </div>
                <div class="box-card-content">
                  <template>
                    <p v-if="data.note">{{data.note}}</p>
                    <p v-else>-</p>
                  </template>
                </div>
              </el-card>
            </div>

          </div>

          <hr />

          <el-table
            class="table-stocks"
            :data="data.items"
            stripe
            style="width: 100%;">
            <el-table-column
              :label="lang.name"
              width="200">
              <template slot-scope="scope">
                <div class="clearfix">
                  <div class="pull-left" style="padding-right: 12px;">
                    <template v-if="scope.row.product_photo_md">
                      <img :src="scope.row.product_photo_md" class="table-image table-image-80" :alt="scope.row.product_photo_md">
                    </template>
                  </div>
                  <div class="pull-left">
                    <strong>{{ scope.row.product_name }} - {{ scope.row.product_sku }}</strong>
                    <p>{{ scope.row.product_variant_name }} - {{ scope.row.product_variant_sku }}</p>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="userRole.role_id !== 'ST' && userRole.role_id !== 'SS'"
              prop="fnew_buy_price"
              :label="lang.buy_price"
              width="150">
              <template slot-scope="scope">
                <template>
                  <p v-if="scope.row.fnew_buy_price">{{scope.row.fnew_buy_price}}</p>
                  <p v-else>-</p>
                </template>
              </template>
            </el-table-column>
            <el-table-column
              :label="lang.qty"
              width="100">
              <template slot-scope="scope">
                <template>
                  <p v-if="scope.row.qty">{{ scope.row.qty }}</p>
                  <p v-else>-</p>
                </template>
              </template>
            </el-table-column>
            <el-table-column
              :label="lang.qty_diff"
              width="150">
              <template slot-scope="scope">
                <template>
                  <p >{{ scope.row.fqty_diff }}</p>
                  <!-- <p v-else>-</p> -->
                </template>
              </template>
            </el-table-column>
            <el-table-column
              v-if="userRole.role_id !== 'ST' && userRole.role_id !== 'SS' && !selectedStore.is_hide_buy_price"
              prop="favg_buy_price"
              :label="lang.avg_buy_price"
              width="180">
              <template slot-scope="scope">
                <p v-if="scope.row.favg_buy_price">{{ scope.row.favg_buy_price }}</p>
                <p v-else>-</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="fnew_buy_amount"
              :label="lang.total"
              width="150">
              <template slot-scope="scope">
                <p v-if="scope.row.fnew_buy_amount">{{ scope.row.fnew_buy_amount }}</p>
                <p v-else>-</p>
              </template>
            </el-table-column>
            
          </el-table>
        </el-card>
      </div>
    </template>
  </section>
</template>

<script>
import axios from 'axios'
import {baseApi} from 'src/http-common'
import stocksTable from './StocksTable'
const moment = require('moment')
import { checkCustomPermission } from '@/mixins/checkCustomPermission'

export default {
  mixins: [checkCustomPermission],
  data() {
    return {
      loading: false,
      printData: false,
      data: null,
      isEditing: {
        date: false,
        supplier: false,
        note: false
      },
      isButtonDisabled: false,
      isButtonDisabledSuplier: true,
      supplierParams: {
        search: ''
      },
      tmp: {},
      suppliers: [],
      itemAdded: true,
      isEditingSerial: []
    }
  },
  components: {
    stocksTable
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
    classBasedOnStatus() {
      let className
      if (this.data.status === 'P') {
        className = 'posted'
      } else if (this.data.status === 'X') {
        className = 'canceled'
      } else if (this.data.status === 'D') {
        className = 'draft'
      }
      return className
    },
    userRole() {
      const selectedStore = this.$store.getters.selectedStore
      return {
        role_id: selectedStore.role_id,
        role_name: selectedStore.role_name,
        is_pos_only: selectedStore.is_pos_only,
        is_mobile: selectedStore.is_mobile
      }
    }
    // isButtonDisabledSuplier() {
    //   console.log('dis', this.data.supplier)
    //   if (typeof this.data.supplier === 'undefined') {
    //     return false
    //   } else {
    //     return true
    //   }
    // }
  },
  methods: {
    addItem(value) {
      this.isButtonDisabled = true
      this.itemAdded = false
      let data = {
        pk: this.$route.params.id,
        product_ids: value.product_ids,
        qty: value.qty,
        new_buy_price: value.new_buy_price,
        type: 'I'
      }
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'stockinouts/additem'),
        headers: headers,
        data
      }).then(response => {
        this.data.items = response.data.data.items
        this.isButtonDisabled = false
        this.itemAdded = true
        let editing = []
        response.data.data.items.map(i => {
          editing.push(false)
        })
        this.isEditingSerial = editing
        this.$message({
          type: 'success',
          message: 'saved'
        })
      }).catch(error => {
        this.isButtonDisabled = false
        this.itemAdded = false
        let message = error.response.data.error.error
        if (typeof error.response.data.error.error === 'object') {
          let messageItem = ' '
          Object.keys(message).forEach(function (item) {
            messageItem = messageItem + ' ' + message[item]
          })
          message = messageItem
        }
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message
        })
      })
    },
    loadData() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'stockinouts/' + this.$route.params.id),
        headers: headers
      }).then(response => {
        this.data = response.data.data
        this.data.items.map(i => {
          if (i.serials !== null) {
            i.fserials = i.serials.split('\n')
          }
        })
        this.tmp = Object.assign({}, this.data)
        this.tmp.date = new Date(this.tmp.date)
        let editing = []
        response.data.data.items.map(i => {
          editing.push(false)
        })
        this.isEditingSerial = editing
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.data = {}
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    getSuppliers(queryString, callback) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'suppliersearchable/'),
        headers: headers,
        params: {
          search: queryString
        }
      }).then(response => {
        for (let i of response.data.data) {
          i.value = i.name
          i.id = i.id
        }
        this.suppliers = response.data.data
        callback(this.suppliers)
      }).catch((error) => {
        this.suppliers = []
        callback(this.suppliers)
        this.loading = false
      })
    },
    selectSupplier(item) {
      this.tmp.supplier_id = Number.parseInt(item.id, 0)
      this.isButtonDisabledSuplier = false
    },
    save(attr) {
      this.loading = true
      this.isButtonDisabled = true
      let url = ''
      let data = {
        pk: Number.parseInt(this.$route.params.id, 0),
        name: attr
      }
      if (attr === 'date') {
        this.$set(data, 'value', moment(this.tmp.date).format('YYYY-MM-DD'))
        url = baseApi(this.selectedStore.url_id, this.langId, 'stockinouts/updateattr')
      } else if (attr === 'supplier') {
        this.$set(data, 'supplier_id', this.tmp.supplier_id)
        url = baseApi(this.selectedStore.url_id, this.langId, 'stockinouts/updatesupplier')
      } else if (attr === 'note') {
        this.$set(data, 'value', this.tmp.note)
        url = baseApi(this.selectedStore.url_id, this.langId, 'stockinouts/updateattr')
      }
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url,
        headers,
        data
      }).then(response => {
        if (attr === 'date') {
          this.data.fdate = response.data.data.fdate
          this.data.date = response.data.data.date
          this.isEditing.date = false
        } else if (attr === 'supplier') {
          this.data.supplier_name = response.data.data.supplier_name
          this.data.supplier_id = response.data.data.supplier_id
          this.isEditing.supplier = false
        } else if (attr === 'note') {
          this.data.note = response.data.data.note
          this.isEditing.note = false
        }
        this.loading = false
        this.isButtonDisabled = false
        this.$message({
          message: 'Saved',
          type: 'success'
        })
      }).catch(error => {
        this.loading = false
        this.isButtonDisabled = false
        this.$notify({
          type: 'warning',
          title: error.message,
          message: error.string
        })
      })
    },
    updateStatus(status) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'stockinouts/updatestatus'),
        headers: headers,
        data: {
          pk: this.data.id,
          status
        }
      }).then(response => {
        this.data = response.data.data
        this.data.items.map(i => {
          if (i.serials !== null) {
            i.fserials = i.serials.split('\n')
          }
        })
        this.loading = false
        this.tmp = Object.assign({}, this.data)
        this.tmp.date = new Date(this.tmp.date)
        this.$notify({
          type: 'success',
          title: "Succes Update Data"
        })
      }).catch(error => {
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.message,
          message: error.string
        })
      })
    },
    initBlock() {
      this.isEditing.date = false
      this.isEditing.supplier = false
      this.isEditing.note = false
    },
    editBlock(block) {
      if (block === 'date') {
        this.isEditing.date = true
      } else if (block === 'supplier') {
        this.isEditing.supplier = true
      } else if (block === 'note') {
        this.isEditing.note = true
      }
    },
    cancelEditBlock(block) {
      if (block === 'date') {
        this.isEditing.date = false
      } else if (block === 'supplier') {
        this.isEditing.supplier = false
      } else if (block === 'note') {
        this.isEditing.note = false
      }
    },
    itemUpdated(data) {
      // console.log(data)
      this.data.items = data.items
      this.data.items.map(i => {
        if (i.serials !== null) {
          i.fserials = i.serials.split('\n')
        }
      })
      let editing = []
      data.items.map(i => {
        editing.push(false)
      })
      this.isEditingSerial = editing
    },
    backHandle() {
      this.$router.push({path: '/inventory/stocksincoming'})
    },
    handlePrint() {
      this.download('pdf', 'stockinouts/')
    },

    download(file, path) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        url: baseApi(this.selectedStore.url_id, this.langId, path + file),
        method: 'GET',
        headers,
        responseType: 'blob',
        params: {
          id: this.data.id
        }
      }).then((response) => {
        const fileName = this.data.trans_no + '_' + file + '.pdf'
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
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    }
  },
  beforeMount() {
    this.handleCustomPermissionSinglePage('inventory/stockincomings', 'show')
  },
  mounted() {
    this.loadData()
  }
}
</script>
