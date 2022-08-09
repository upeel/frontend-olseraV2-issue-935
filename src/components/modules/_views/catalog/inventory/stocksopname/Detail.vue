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
              <small style="color: #ccc;">{{ lang.stock_opname_no }}</small>
              <h4 v-if="!data.trans_no">-</h4>
              <h4 v-else>{{ data.trans_no }}</h4>
            </div>
            <div class="full-width text-right">
              <el-button v-if="data.status !== 'D'" icon="el-icon-back" size="small" type="success" class="ml-4 btn-no-shadow" plain @click="backHandle">{{ lang.back }}</el-button>
              <button-action-authenticated :permission="['inventory/stockopname', 'edit']" :plain="true" icon="el-icon-printer" size="small" class="ml-4 btn-no-shadow" @click="handlePrint()">{{ lang.print }}</button-action-authenticated>
              <button-action-authenticated :permission="['inventory/stockopname', 'edit']"
                plain
                icon="el-icon-download"
                class="ml-4 mt-8 btn-no-shadow"
                size="small"
                @click="handleExcel">
                {{ $lang[langId].download_excel }}
              </button-action-authenticated>
              <button-action-authenticated :permission="['inventory/stockopname', 'edit']" v-if="data.status === 'D'" icon="el-icon-takeaway-box" size="small" class="ml-4 btn-no-shadow color-warning--bg color-white" @click="backHandle">{{ $lang[langId].draft }}</button-action-authenticated>

              <template v-if="wejayafoodAccessByStore.includes(selectedStore.url_id)">
                <el-checkbox v-if="data.status === 'D'" v-model="checkProfitLoss" :label="$lang[langId].post_to_profitloss" border></el-checkbox>
                <el-button v-if="data.status === 'P' && data.already_post_to_profitloss === 0" type="primary" :loading="loadingPost" @click="postDataToProfitLoss">{{$lang[langId].post_to_profitloss}}</el-button>
              </template>

              <!-- <el-button v-if="data.status === 'D'" icon="el-icon-takeaway-box" size="small" class="ml-4 btn-no-shadow color-warning--bg color-white" @click="backHandle">{{ $lang[langId].draft }}</el-button> -->
              <template v-if="data.IsEditable">
                <button-action-authenticated :permission="['inventory/stockopname', 'edit']"
                  icon="el-icon-close"
                  size="small"
                  class="ml-4 mt-8 btn-danger btn-no-shadow"
                  @click="updateStatus('X')">
                  {{ $lang[langId].canceled }}
                </button-action-authenticated>
                <button-action-authenticated :permission="['inventory/stockopname', 'edit']"
                  icon="el-icon-check"
                  type="success"
                  size="small"
                  class="ml-4 mt-8 btn-no-shadow"
                  @click="updateStatus('P')">
                  {{ lang.post_now }}
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
              <div
                v-if="data.IsEditable"
                style="float: right;">
                <button-action-authenticated :permission="['inventory/stockopname', 'edit']"
                  @click="editBlock('date')"
                  v-if="!isEditing.date"
                  icon="el-icon-edit"
                  type="primary"
                  size="mini">
                  {{ lang.edit }}
                </button-action-authenticated>
                <button-action-authenticated :permission="['inventory/stockopname', 'edit']"
                  type="text"
                  @click="cancelEditBlock('date')"
                  v-if="isEditing.date"
                  size="mini">
                  {{ lang.cancel }}
                </button-action-authenticated>
                <button-action-authenticated :permission="['inventory/stockopname', 'edit']"
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
                  :placeholder="this.$lang[langId].pick_a_day">
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
              <div v-if="data.IsEditable" style="float: right;">
                <button-action-authenticated :permission="['inventory/stockopname', 'edit']"
                  @click="editBlock('note')"
                  v-if="!isEditing.note"
                  icon="el-icon-edit"
                  type="primary"
                  size="mini">
                  {{ lang.edit }}
                </button-action-authenticated>
                <button-action-authenticated :permission="['inventory/stockopname', 'edit']"
                  type="text"
                  @click="cancelEditBlock('note')"
                  v-if="isEditing.note"
                  size="mini">
                  {{ lang.cancel }}
                </button-action-authenticated>
                <button-action-authenticated :permission="['inventory/stockopname', 'edit']"
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
        ref="stocksTable"
        :editable="data.IsEditable"
        :key="tableKey"
        :is-item-added="itemAdded"
        :is-button-disabled="isButtonDisabled"
        :data-table="data.items"
        @itemadded="addItem"
        @itemupdated="itemUpdated">
      </stocks-table>

      <div id="printView" style="display: none;">
        <div class="box">
          <div class="box-header with-padding-left with-border">
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
              width="350">
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
              :label="lang.time"
              width="250">
              <template slot-scope="scope">
                <template>
                  <p v-if="scope.row.ftime">{{ scope.row.ftime }}</p>
                  <p v-else>-</p>
                </template>
              </template>
            </el-table-column>
            <el-table-column
              :label="lang.qty"
              width="150">
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
          </el-table>
        </div>
      </div>
    </template>
  </section>
</template>

<script>
import axios from 'axios'
import {baseApi} from 'src/http-common'
import basicComputedMixin from '@/mixins/basicComputedMixin'

import { postProfitloss } from '@/api/catalog/inventory/opname'

import stocksTable from './StocksTable'
const moment = require('moment')
export default {
  data() {
    return {
      loading: false,
      data: null,
      isButtonDisabled: false,
      itemAdded: false,
      isEditing: {
        date: false,
        note: false
      },
      tmp: {},
      tableKey: 0,
      loadingPost: false,
      checkProfitLoss: false
    }
  },

  mixins: [basicComputedMixin],
  
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
  mounted() {
    this.loadData()
  },
  methods: {
    addItem(value) {
      this.isButtonDisabled = true
      this.itemAdded = false
      let data = {
        id: this.$route.params.id,
        time: value.time,
        product_ids: value.product_ids,
        qty: value.qty
      }
      // console.log(value)
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.selectedStore.lang_code, 'stockopname/additem'),
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
        url: baseApi(this.selectedStore.url_id, this.selectedStore.lang_code, 'stockopname/' + this.$route.params.id),
        headers: headers
      }).then(response => {
        this.data = response.data.data
        this.tmp = Object.assign({}, this.data)
        this.tmp.date = new Date(this.tmp.date)
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
    save(attr) {
      this.loading = true
      this.isButtonDisabled = true
      let url = ''
      let data = {
        id: Number.parseInt(this.$route.params.id, 0)
      }
      if (attr === 'date') {
        this.$set(data, 'date', moment(this.tmp.date).format('YYYY-MM-DD'))
        url = baseApi(this.selectedStore.url_id, this.selectedStore.lang_code, 'stockopname/updateattr')
      } else if (attr === 'note') {
        this.$set(data, 'note', this.tmp.note)
        url = baseApi(this.selectedStore.url_id, this.selectedStore.lang_code, 'stockopname/updateattr')
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
    updateStatus(status) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
        id: this.data.id,
        record_to_report_profit_loss: this.checkProfitLoss ? 1 : 0,
        status
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.selectedStore.lang_code, 'stockopname/updatestatus'),
        headers: headers,
        data
      }).then(response => {
        this.data = response.data.data
        this.tableKey = this.tableKey + 1
        this.$nextTick(() => {
          this.$refs.stocksTable.refreshTable()
        })
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
    itemUpdated(data) {
      this.data.items = data.items
    },
    backHandle() {
      this.$router.push({ path: '/inventory/stocksopname/' })
    },
    handlePrint() {
      this.download('pdf', 'stockopname/')
    },
    handleExcel() {
      this.download('excel', 'stockopname/')
    },

    download(file, path) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      var tipeFile = ''
      if (file === 'pdf') {
        tipeFile = 'pdf'
      } else if (file === 'excel') {
        tipeFile = 'xls'
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
        const fileName = this.data.trans_no + '_' + file + '.' + tipeFile
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
    },

    postDataToProfitLoss() {
      this.loadingPost = true
      postProfitloss(this.data.id)
        .then(response => {
          this.loadData()
          this.loadingPost = false
          this.$notify({
            type: 'success',
            title: 'Success',
            message: 'Sukses post ke laba rugi'
          })
        })
        .catch(error => {
          this.loadingPost = false
          if (error.response.data.error.status_code !== 404) {
            this.$notify({
              type: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error
            })
          }
        })
    },
  }
}
</script>
