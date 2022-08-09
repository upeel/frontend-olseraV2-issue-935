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
            <template v-if="data.status === 'X'">
              <span><i class="el-icon-error"></i></span>{{ data.status_desc }}
            </template>
            <template v-if="data.status === 'D'">
              <span><i class="el-icon-document"></i></span>{{ data.status_desc }}
            </template>
          </div>
          <div class="flex-container with-padding-left">
            <div>
              <small class="color-info">{{ lang.outgoing_stock_no }}</small>
              <h4 v-if="!data.trans_no">-</h4>
              <h4 v-else class="font-bold">{{ data.trans_no }}</h4>
            </div>
            <div class="full-width text-right">
              <el-button v-if="data.status !== 'D' " icon="el-icon-back" size="small" type="success" class="ml-4 btn-no-shadow" plain @click="backHandle">{{ lang.back }}</el-button>
              <el-button icon="el-icon-printer" size="small" class="ml-4 btn-no-shadow" @click="handlePrint()">{{ lang.print }}</el-button>
              
              <el-checkbox v-if="wejayafoodAccessByStore.includes(selectedStore.url_id) && data.status === 'D'" v-model="checkProfitLoss" label="Post ke laba rugi" border  @change="handleLaba"></el-checkbox>
              
              <el-button v-if="data.status === 'D'" icon="el-icon-takeaway-box" size="small" class="ml-4 btn-no-shadow color-warning--bg color-white" @click="backHandle">{{ $lang[langId].draft }}</el-button>
              
              <el-button v-if="wejayafoodAccessByStore.includes(selectedStore.url_id) && data.status === 'P' && data.already_post_to_profitloss === 0" type="primary" :loading="loadingPost" @click="postDataToProfitLoss">Post ke laba rugi</el-button>
              
              <template v-if="data.IsEditable">
                <el-button icon="el-icon-close" size="small" class="ml-4 mt-8 btn-danger btn-no-shadow" @click="updateStatus('X')">{{ this.$lang[langId].canceled }}</el-button>
                <el-button icon="el-icon-check" type="success" size="small" class="ml-4 mt-8 btn-no-shadow" @click="updateStatus('P')">{{ lang.post_now }}</el-button>
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
              <div v-if="data.IsEditable === true" style="float: right;">
                <el-button
                  @click="editBlock('date')"
                  v-if="!isEditing.date"
                  icon="el-icon-edit"
                  type="primary"
                  size="mini">
                  {{ lang.edit }}
                </el-button>
                <el-button
                  type="text"
                  @click="cancelEditBlock('date')"
                  v-if="isEditing.date"
                  size="mini">
                  {{ lang.cancel }}
                </el-button>
                <el-button
                  :disabled="isButtonDisabled"
                  @click="save('date')"
                  v-if="isEditing.date"
                  icon="el-icon-check"
                  type="success"
                  size="mini">
                  {{ lang.save }}
                </el-button>
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
              <div v-if="data.IsEditable === true" style="float: right;">
                <el-button
                  @click="editBlock('note')"
                  v-if="!isEditing.note"
                  icon="el-icon-edit"
                  type="primary"
                  size="mini">
                  {{ lang.edit }}
                </el-button>
                <el-button
                  type="text"
                  @click="cancelEditBlock('note')"
                  v-if="isEditing.note"
                  size="mini">
                  {{ lang.cancel }}
                </el-button>
                <el-button
                  :disabled="isButtonDisabled"
                  @click="save('note')"
                  v-if="isEditing.note"
                  icon="el-icon-check"
                  type="success"
                  size="mini">
                  {{ lang.save }}
                </el-button>
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

        <div class="col-md-4">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <strong>{{ lang.transfer_to }}</strong>
            </div>
            <div class="box-card-content">
              <template v-if="isEditing.to_store_id">
                <el-select v-model="tmp.to_store_id" :placeholder="lang.please_select">
                  <el-option
                    style="width: 100%;"
                    v-for="item in userStores"
                    :key="item.store_id"
                    :label="item.name"
                    :value="item.store_id">
                  </el-option>
                </el-select>
              </template>
              <template v-if="data.to_store_name === '' || !data.to_store_name">-</template>
              <template v-else>{{data.to_store_name}}</template>
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
        :data-table="data.items"
        :data-stock="data"
        :to-store="data.to_store_id">
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

import { postProfitloss } from '@/api/catalog/inventory/outgoing'
import stocksTable from './StocksTable'
const moment = require('moment')
export default {
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
      console.log(status);
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
          pk: this.data.id,
          record_to_report_profit_loss: this.checkProfitLoss ? 1 : 0,
          status
        }

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'stockinouts/updatestatus'),
        headers: headers,
        data
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
      this.$router.push({ path: '/inventory/stocksoutgoing/' })
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
        const fileName = this.data.trans_no + '_' + '.pdf'
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

    handleLaba(data){
      console.log(data);
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

    postDataToProfitLoss() {
      console.log('zczxczxczxczxczxczxczx');
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
  },
  mounted() {
    this.loadData()
    // console.log(this.$store.state.userStores)
  }
}
</script>
