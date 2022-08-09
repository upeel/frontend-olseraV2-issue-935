<template>
  <section v-loading="loading">
    <!-- <div class="color-info--bg flex-container radius-10 p-8 mb-24 mt-24">
      <div class="container-icon">
        <i class="el-icon-warning-outline" />
      </div>
      <div class="full-width">
        {{
        'Pastikan data sudah benar sebelum diposting. Setelah terposting, data tidak diperbolehkan diubah.'
        }}
      </div>
    </div> -->
    <template v-if="data">
      <el-card class="box-card pos-relative card-body-inventory">
        <div class="card-body">
          <div class="inventory-status text-center" >
            <div class="container-icon">
              <svg-icon icon-class="icon-stop-circle" />
            </div>
          </div>
          <div class="flex-container with-padding-left">
            <div>
              <!-- <h4 v-if="!data.trans_no">-</h4> -->
              <h4 class="font-bold">{{ data.trans_no }}</h4>
              <span class="color-warning">Outstanding</span>
            </div>
            <div class="full-width text-right">
              <el-button v-if="data.status !== 'D' " icon="el-icon-back" size="small" type="success" class="ml-4 btn-no-shadow" plain @click="backHandle">{{ lang.back }}</el-button>
              <el-button v-if="parseInt(data.total_qty_difference_returned) === 0" :loading="loadingPosting" type="primary" @click="postingData">
                <i class="el-icon-plus" /> Post stok masuk
              </el-button>
              <el-button icon="el-icon-printer" size="small" class="ml-4 btn-no-shadow" @click="handlePrint()">{{ lang.print }}</el-button>
              <el-button v-if="data.status === 'D'" icon="el-icon-takeaway-box" size="small" class="ml-4 btn-no-shadow color-warning--bg color-white" @click="backHandle">{{ $lang[langId].draft }}</el-button>
            </div>
          </div>
        </div>
      </el-card>

      <div class="row">
        <div class="col-md-4">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <strong>{{ lang.date }}</strong>
            </div>
            <div class="box-card-content">
              <template>
                <div class="flex-container">
                  <div class="full-width">
                    {{ rootLang.transfer_date }}
                  </div>
                  <div class="full-width text-right">
                    {{ data.fdate }}
                  </div>
                </div>
                <div class="flex-container">
                  <div class="full-width">
                    {{ rootLang.date_received }}
                  </div>
                  <div class="full-width text-right">
                    {{ data.fref_date }}
                  </div>
                </div>
                <div class="flex-container">
                  <div class="full-width">
                    Penerima
                  </div>
                  <div class="full-width text-right">
                    {{ data.fref_date }}
                  </div>
                </div>
              </template>
            </div>
          </el-card>
        </div>

        <div class="col-md-4">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <strong>{{ lang.transfer_to }}</strong>
            </div>
            <div class="box-card-content">
              <template v-if="data.ref_store_name === '' || !data.ref_store_name">-</template>
              <template v-else>{{data.ref_store_name}}</template>
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
        :data-table="data.itemsref"
        :data-stock="data"
        :to-store="data.ref_store_id">
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

            <div class="col-md-4">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <strong>{{ lang.transfer_to }}</strong>
                </div>
                <div class="box-card-content">
                  <template>
                    <p v-if="data.to_store_name">
                      {{data.to_store_name}}
                    </p>
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
              width="500">
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
              :label="lang.qty"
              width="150">
              <template slot-scope="scope">
                <template>
                  <p v-if="scope.row.qty">{{ scope.row.qty }}</p>
                  <p v-else>-</p>
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
import { getDetailOutstanding, postOutstanding, downloadOutstanding } from '@/api/catalog/inventory/outstanding'

import basicComputedMixin from '@/mixins/basicComputedMixin'
import stocksTable from './StocksTable'
const moment = require('moment')
export default {
  mixins: [basicComputedMixin],
  data() {
    return {
      loading: false,
      data: null,
      isEditing: {
        date: false,
        to_store_id: false,
        note: false
      },
      isButtonDisabled: false,
      tmp: {},
      loadingPosting: false
    }
  },
  components: {
    stocksTable
  },
  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    userStores() {
      return this.$store.state.userStores
    },
    token() {
      return this.$store.state.user.token
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
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    }
  },
  methods: {
    addItem(value) {
      this.isButtonDisabled = true
      this.itemAdded = false
      let data = {
        pk: this.$route.params.id,
        product_ids: value.product_ids,
        qty: value.qty,
        type: 'O'
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
      getDetailOutstanding(this.$route.params.id).then(response => {
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
      } else if (attr === 'to_store_id') {
        this.$set(data, 'value', this.tmp.to_store_id)
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
        } else if (attr === 'to_store_id') {
          this.data.to_store_id = response.data.data.to_store_id
          this.data.to_store_name = response.data.data.to_store_name
          this.isEditing.to_store_id = false
        } else if (attr === 'note') {
          this.data.note = response.data.data.note
          this.isEditing.note = false
        }
        this.loading = false
        this.isButtonDisabled = false
        this.$message({
          type: 'success',
          message: 'saved'
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
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    initBlock() {
      this.isEditing.date = false
      this.isEditing.note = false
      this.isEditing.to_store_id = false
    },
    editBlock(block) {
      if (block === 'date') {
        this.isEditing.date = true
      } else if (block === 'to_store_id') {
        this.isEditing.to_store_id = true
      } else if (block === 'note') {
        this.isEditing.note = true
      }
    },
    cancelEditBlock(block) {
      if (block === 'date') {
        this.isEditing.date = false
      } else if (block === 'to_store_id') {
        this.isEditing.to_store_id = false
      } else if (block === 'note') {
        this.isEditing.note = false
      }
    },
    itemUpdated(data) {
      console.log('seraial', data)
      this.data.items = data.items
      this.data.items.map(i => {
        if (i.serials !== null) {
          i.fserials = i.serials.split('\n')
          console.log('serial', i.fserials)
        }
      })
    },
    backHandle() {
      this.$router.push({ path: '/inventory/stocksoutstanding/' })
    },
    handlePrint() {
      this.download('pdf', 'stockinouts/')
    },

    download(file, path) {
      this.loadingDownload = true

      downloadOutstanding(this.$route.params.id).then((response) => {
        const fileName = this.data.trans_no + '_' + file + '.pdf'
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        this.loadingDownload = false
      }).catch(error => {
        this.loadingDownload = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    postingData() {
      this.loadingPosting = true
      postOutstanding(this.data.in_out_id).then(response => {
        this.data = response.data.data
        this.loadData()
        this.$notify({
          type: 'success',
          title: 'Success',
          message: 'Stok outstanding berhasil dipost ke stok masuk!'
        })
        this.loadingPosting = false
      }).catch(error => {
        this.loadingPosting = false
        this.data = {}
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
  },
  mounted() {
    this.loadData()
    // console.log(this.$store.state.userStores)
  }
}
</script>
