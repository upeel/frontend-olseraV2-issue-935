<template>
  <section v-loading="loading">
    <div class="color-info--bg flex-container radius-10 p-8 mb-24 mt-24">
      <div class="container-icon">
        <i class="el-icon-warning-outline" />
      </div>
      <div class="full-width">
        Pastikan data sudah benar sebelum diposting. Setelah terposting, data tidak diperbolehkan diubah.
      </div>
    </div>
    <template v-if="data">
      <el-card class="box-card pos-relative card-body-inventory">
        <div class="card-body">
          <div class="inventory-status" :class="classBasedOnStatus">
            <template v-if="data.status  === 'P'">
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
              <small style="color: #ccc;">{{ lang.incoming_stock_no }}</small>
              <h4 v-if="!data.trans_no">-</h4>
              <h4 v-else class="font-bold">{{ data.trans_no }}</h4>
            </div>
            <div class="full-width text-right">
              <button-action-authenticated :permission="['inventory/productionsmode', 'edit']" v-if="data.status !== 'D'" icon="el-icon-back" size="small" type="success" class="ml-4 btn-no-shadow" plain @click="backHandle">{{ lang.back }}</button-action-authenticated>
              <button-action-authenticated :permission="['inventory/productionsmode', 'edit']" icon="el-icon-printer" size="small" class="ml-4 btn-no-shadow" @click="handlePrint()">{{ lang.print }}</button-action-authenticated>
              <button-action-authenticated :permission="['inventory/productionsmode', 'edit']" v-if="data.status === 'D'" icon="el-icon-takeaway-box" size="small" class="ml-4 btn-no-shadow color-warning--bg color-white" @click="backHandle">{{ $lang[langId].draft }}</button-action-authenticated>
              <template v-if="data.IsEditable">
                <button-action-authenticated :permission="['inventory/productionsmode', 'edit']" icon="el-icon-close" size="small" class="ml-4 mt-8 btn-danger btn-no-shadow" @click="updateStatus('X')">{{ $lang[langId].canceled }}</button-action-authenticated>
                <button-action-authenticated :permission="['inventory/productionsmode', 'edit']" icon="el-icon-check" type="success" size="small" class="ml-4 mt-8 btn-no-shadow" @click="updateStatus('P')">{{ lang.post_now }}</button-action-authenticated>
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
                  <button-action-authenticated
                    :permission="['inventory/productionsmode', 'edit']"
                    @click="editBlock('date')"
                    v-if="!isEditing.date"
                    icon="el-icon-edit"
                    type="primary"
                    size="mini">
                    {{ lang.edit }}
                  </button-action-authenticated>
                </template>
                <button-action-authenticated
                  :permission="['inventory/productionsmode', 'edit']"
                  type="text"
                  @click="cancelEditBlock('date')"
                  v-if="isEditing.date"
                  size="mini">
                  {{ lang.cancel }}
                </button-action-authenticated>
                <button-action-authenticated
                  :permission="['inventory/productionsmode', 'edit']"
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
              <strong>{{ lang.notes }}</strong>
              <div style="float: right;">
                <template v-if="data.IsEditable === true">
                  <button-action-authenticated
                    :permission="['inventory/productionsmode', 'edit']"
                    @click="editBlock('note')"
                    v-if="!isEditing.note"
                    icon="el-icon-edit"
                    type="primary"
                    size="mini">
                    {{ lang.edit }}
                  </button-action-authenticated>
                </template>
                <button-action-authenticated
                  :permission="['inventory/productionsmode', 'edit']"
                  type="text"
                  @click="cancelEditBlock('note')"
                  v-if="isEditing.note"
                  size="mini">
                  {{ lang.cancel }}
                </button-action-authenticated>
                <button-action-authenticated
                  :permission="['inventory/productionsmode', 'edit']"
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
                <el-input type="textarea" autosize v-model="tmp.note" />
              </template>
              <template v-else>
                {{data.note}}
              </template>
            </div>
          </el-card>
        </div>
      </div>

      <stocks-table
        @itemadded="addItem"
        @itemupdated="itemUpdated"
        :editable="data.IsEditable"
        :is-item-added="itemAdded"
        :is-button-disabled="isButtonDisabled"
        :data-stock="data"
        :data-table="data.items">
      </stocks-table>
    </template>
  </section>
</template>

<script>
import axios from 'axios'
import {baseApi} from 'src/http-common'
import stocksTable from './StocksTable'
import { checkCustomPermission } from '@/mixins/checkCustomPermission'
const moment = require('moment')

export default {
  mixins: [checkCustomPermission],

  data() {
    return {
      loading: false,
      data: null,
      isEditing: {
        date: false,
        supplier: false,
        note: false
      },
      isButtonDisabled: false,
      supplierParams: {
        search: ''
      },
      tmp: {},
      suppliers: [],
      itemAdded: true
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
    }
  },

  beforeMount() {
    this.handleCustomPermissionSinglePage('inventory/productionsmode', 'show')
  },

  methods: {
    addItem(value) {
      console.log(value)
      this.isButtonDisabled = true
      this.itemAdded = false
      let data = {
        pk: this.$route.params.id,
        product_ids: value.product_ids,
        qty: value.qty,
        type: 'P'
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
        this.$notify({
          type: 'success',
          message: 'Saved'
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
        this.loading = false
        this.tmp = Object.assign({}, this.data)
        this.tmp.date = new Date(this.tmp.date)
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
          title: error.response.data.error.message,
          message: error.response.data.error.error
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
        this.loading = false
        this.tmp = Object.assign({}, this.data)
        this.tmp.date = new Date(this.tmp.date)
        var msg = ''
        if (status === 'X') {
          msg = this.$lang[this.langId].success_cancelled
        } else {
          msg = this.$lang[this.langId].success_posting
        }
        this.$notify({
          type: 'success',
          message: msg
        })
      }).catch(error => {
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    initBlock() {
      this.isEditing.date = false
      this.isEditing.note = false
    },
    editBlock(block) {
      if (block === 'date') {
        this.isEditing.date = true
      } else if (block === 'note') {
        this.isEditing.note = true
      }
    },
    cancelEditBlock(block) {
      if (block === 'date') {
        this.isEditing.date = false
      } else if (block === 'note') {
        this.isEditing.note = false
      }
    },
    itemUpdated(data) {
      console.log(data)
      this.data.items = data.items
    },
    backHandle() {
      this.$router.push({ path: '/inventory/stocksproduction/' })
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

  mounted() {
    this.loadData()
  }
}
</script>
