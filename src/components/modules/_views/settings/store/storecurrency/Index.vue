<template>
  <div v-loading="loading">
    <el-card class="box-card">
      <div slot="header" class="table-handler-flex">
        <h4 style="flex-grow: 1;">{{ lang.sales_currency }}</h4>
        <button-action-authenticated
          :permission="['settings/storecurrency', 'edit']"
          type="success"
          icon="el-icon-plus"
          @click="addStoreCurrency">
          {{ lang.add }}
        </button-action-authenticated>
      </div>

      <div class="card-body">
        <el-form label-width="50%">
          <el-form-item>
            <template slot="label">
              <h5 style="margin-bottom: 8px; margin-top: 0;" class="font-bold">{{ lang.base_currency }}</h5>
              <p>{{ $lang[langId].currency_based_your_store }}</p>
            </template>
            <el-select
              v-model="selectCurrency"
              :disabled="!checkCustomPermission('settings/storecurrency', 'edit')"
              @change="handleSelect">
              <el-option v-for="(item) in currency" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <el-divider></el-divider>

        <el-table :data="data" stripe v-loading="loading">
          <el-table-column :label="lang.exchange_rate" prop="base_currency_id" min-width="160">
            <template slot-scope="props">
              <p>1 {{ props.row.base_currency_name }} ({{ props.row.base_currency_id }})</p>
            </template>
          </el-table-column>
          <el-table-column>
            <template>
              <svg-icon icon-class="arrow-right"></svg-icon>
            </template>
          </el-table-column>
          <el-table-column class="form-in-cell-wrapper" prop="exchange_rate">
            <template slot-scope="scope">
              <span class="editable" @click="edit(scope.row, scope.$index)">
                {{scope.row.exchange_rate}}
              </span>
              <div class="form-in-cell" v-if="isEditing[scope.$index].editing">
                <!-- <money v-if="tmp.currency_id === 'IDR'" v-model="tmp.exchange_rate" v-bind="moneyIDR"></money> -->
                <input-money v-if="tmp.currency_id === 'IDR'" v-model="tmp.exchange_rate" v-bind="moneyIDR" />
                <!-- <money v-else v-model="tmp.exchange_rate" v-bind="moneyDollar"></money> -->
                <input-money v-else v-model="tmp.exchange_rate" v-bind="moneyDollar" />
                <el-button type="info" icon="el-icon-close" size="mini" @click="cancelEdit(scope.$index)"></el-button>
                <el-button type="success" icon="el-icon-check" size="mini" @click="save(tmp, scope.$index)"></el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="currency_id" min-width="160">
            <template slot-scope="scope">
              <p>{{scope.row.currency_name}} ({{scope.row.currency_id}})</p>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <button-action-authenticated
                :permission="['settings/storecurrency', 'edit']"
                type="danger"
                class="btn-plain"
                icon="el-icon-delete"
                size="mini"
                @click="handleRemove(scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <el-dialog :title="lang.add+' '+lang.exchange_rate" :visible.sync="addDialog" width="60%" :close-on-click-modal="false" :show-close="false">
      <el-form label-width="40%">
        <el-form-item>
          <template slot="label">
            <el-row>
              <el-col :md="22">
                <span>1</span>
                <span v-if="this.selectCurrency === 'IDR'">{{ $lang[langId].rupiah }} ({{ this.selectCurrency }})</span>
                <span v-if="this.selectCurrency === 'USD'">{{ $lang[langId].american_dollar }} ({{ this.selectCurrency }})</span>
                <span v-if="this.selectCurrency === 'SGD'">{{ $lang[langId].singapore_dollar }} ({{ this.selectCurrency }})</span>
              </el-col>
              <el-col :md="2" style="margin-top: 5px;">
                <svg-icon icon-class="arrow-right"></svg-icon>
              </el-col>
            </el-row>
          </template>
          <div>
            <!-- <money v-if="formAdd.currency_id === 'IDR'" v-model="formAdd.exchange_rate" v-bind="moneyIDR" style="width: 60%; border: 1px solid #dcdfe6; padding-left: 5px;">
            </money>
            <money v-else v-model="formAdd.exchange_rate" v-bind="moneyDollar" style="width: 60%; border: 1px solid #dcdfe6; padding-left: 5px;">
            </money> -->
            <!-- <input-money v-if="formAdd.currency_id === 'IDR'" v-model="formAdd.exchange_rate" v-bind="moneyIDR" />
            <input-money v-else v-model="formAdd.exchange_rate" v-bind="moneyDollar" /> -->
            <input type="number" v-model="formAdd.exchange_rate" style="height: 36px">
            <el-select v-model="formAdd.currency_id" style="margin-top: 10px">
              <el-option v-for="(item) in currency" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div class="mt-12">{{ computedExchange }}</div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAddDialog">{{ lang.cancel }}</el-button>
        <el-button type="success" @click="save(formAdd)">{{ lang.save }}</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="deleteDialog" width="50%" center :close-on-click-modal="false" :show-close="false">
      <span slot="title">
        <svg-icon icon-class="alert-triangle" style="stroke: #F44336;"></svg-icon>
        {{ lang.notif_warn }}
      </span>
      <div class="text-center">
        <p>{{ $lang[langId].are_you_want_remove }} {{ lang.exchange_rate }}
        </p>
        <h3>
          <span>{{deleteData.base_currency_id}}</span>
          <span>
            <svg-icon icon-class="arrow-right"></svg-icon>
          </span>
          <span>{{deleteData.exchange_rate}}</span>
          <span>({{deleteData.currency_id}})</span>
        </h3>
        <p style="color: #AFB0AF;">{{ $lang[langId].info_delete_item }}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDeleteDialog">{{ lang.cancel }}</el-button>
        <el-button type="danger" @click="removeDeleteDialog(deleteData.id)">{{ $lang[langId].delete }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
// import { Money } from 'v-money'
import InputMoney from '@/components/InputMoneyV2'
const apiEndpoint = 'storecurrency/'
import { checkCustomPermission } from '@/mixins/checkCustomPermission'

export default {
  components: {
    InputMoney
  },
  mixins: [checkCustomPermission],
  data() {
    return {
      loading: true,
      data: [],
      currency: [],
      selectCurrency: null,
      isEditing: [],
      tmp: {},
      addDialog: false,
      deleteDialog: false,
      deleteData: {},
      formAdd: {
        exchange_rate: '',
        currency_id: ''
      },
      moneyIDR: {
        decimal: '.',
        thousand: ',',
        prefix: '',
        suffix: '',
        precision: 2,
        masked: false
      },
      moneyDollar: {
        decimal: ',',
        thousand: '.',
        prefix: '',
        suffix: '',
        precision: 2,
        masked: false
      }
    }
  },
  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    token() {
      return this.$store.state.user.token
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    langId() {
      return this.$store.state.userStores.langId
    },

    computedExchange () {
      let rate = 1 / this.formAdd.exchange_rate
      let currency = ''
      let currency1 = ''
      this.currency.map(i => {
        if (i.id === this.selectCurrency) {
          currency = i.name
        }
        if (i.id === this.formAdd.currency_id) {
          currency1 = i.name
        }
      })
      let data = parseFloat(rate).toFixed(2) + ' ' + currency + ' = 1 ' + currency1
      if (rate === Number.POSITIVE_INFINITY || rate === Number.NEGATIVE_INFINITY) {
        return ''
      } else {
        return data
      }
    }
  },
  watch: {
    'store.getters.selectedStore': function() {
      this.getDefaultCurrency()
      this.getData()
    }
  },
  methods: {
    getDefaultCurrency() {
      this.selectCurrency = this.selectedStore.currency_id
    },

    getData() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint),
        headers: headers
      })
        .then(response => {
          this.data = response.data.data
          this.data.map(() => {
            this.isEditing.push({
              editing: false
            })
          })
          this.loading = false
        })
        .catch(error => {
          this.loading = false
          this.data = []
        })
    },

    getCurrency() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search: ''
      }
      axios({
        method: 'GET',
        url: baseApi(
          this.selectedStore.url_id,
          this.langId,
          apiEndpoint + 'getcurrency'
        ),
        headers: headers,
        params: params
      })
        .then(response => {
          this.currency = response.data.data
          this.loading = false
        })
        .catch(error => {
          this.loading = false
          this.$notify({
            type: 'warning',
            title: 'Error',
            message: error
          })
        })
    },

    handleSelect(val) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
        currency_id: val
      }
      axios({
        method: 'POST',
        url: baseApi(
          this.selectedStore.url_id,
          this.langId,
          apiEndpoint + 'updatebasecurrency'
        ),
        headers: headers,
        data
      })
        .then(response => {
          // this.loading = false
          this.$message({
            type: 'success',
            message: 'saved'
          })
          this.$store.dispatch('setSelectedStore', this.selectedStore.store_id).then(response => {
            this.getData()
            this.loading = false
          }).catch(error => {
            this.loading = false
            this.$message({
              type: 'error',
              message: error.string
            })
          })
        })
        .catch(error => {
          this.loading = false
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        })
    },

    edit(row, index) {
      if (this.checkCustomPermission('settings/storecurrency', 'edit')) {
        this.tmp = {}
        this.isEditing.map(item => {
          item.editing = false
        })
        this.isEditing[index].editing = true
        this.tmp = Object.assign({}, row)
      }
    },

    cancelEdit(index) {
      this.isEditing[index].editing = false
      this.tmp = {}
    },

    handleRemove(row) {
      this.deleteData = Object.assign({}, row)
      this.deleteDialog = true
    },
    save(tmp, index = null) {
      let method = 'POST'
      let verb = 'store'
      let id = ''
      let data = tmp
      if (tmp.id) {
        method = 'PUT'
        verb = 'update/'
        id = tmp.id
      }

      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: method,
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint + verb + id),
        headers: headers,
        data
      })
        .then(response => {
          if (index !== null) {
            this.cancelEdit(index)
          }
          this.addDialog = false
          this.loading = false
          this.getData()
          this.$message({
            type: 'success',
            message: 'saved'
          })
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
    addStoreCurrency() {
      this.addDialog = true
      this.formAdd.currency_id = this.selectCurrency
    },
    cancelAddDialog() {
      this.addDialog = false
    },
    cancelDeleteDialog() {
      this.deleteDialog = false
      this.deleteData = {}
    },
    removeDeleteDialog(val) {
      let id = val
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'DELETE',
        url: baseApi(
          this.selectedStore.url_id,
          this.langId,
          apiEndpoint + 'delete/' + id
        ),
        headers: headers
      })
        .then(response => {
          this.loading = false
          this.deleteDialog = false
          this.$message({
            type: 'success',
            message: 'saved'
          })
          this.getData()
        })
        .catch(error => {
          this.loading = false
          this.deleteDialog = true
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        })
    },

    updateText () {
      console.log('aaaa')
      // console.log(this.computedExchange)
      console.log(this.$refs)
      // setInterval(() => {
      //   console.log(this.computedExchange)
      //   this.$refs.inputRate.setFocus()
      // }, 500)
    }
  },
  mounted() {
    this.getDefaultCurrency()
    this.getCurrency()
    this.getData()
  }
}
</script>


