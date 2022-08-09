<template>
  <div>
    <el-card
      v-if="editable"
      class="card-box"
      style="margin-top: 20px;">
      <div slot="header">
        <strong>{{ lang.add_product }}</strong>
      </div>
      <div class="row">
        <el-form
          :model="tmp"
          label-position="top"
          @submit.native.prevent="addDataTable">
          <div class="col-md-5">
            <el-form-item :label="lang.product">
              <input-autocomplete
                ref="InputAutocomplete"
                :fetch-suggestions="setQueryString"
                :searching-products="searchingItems"
                :search-result-products="searchData"
                @select="selectProduct"
              />
            </el-form-item>
          </div>
          <div
            v-if="computedHeaderTable.variabel"
            class="col-md-3">
            <el-form-item :label="lang.buy_price" prop="new_buy_price">
              <input-money v-model="tmp.new_buy_price" @keyup.native.enter="addDataTable" />
            </el-form-item>
          </div>
          <div class="col-md-4">
            <el-form-item :label="lang.qty" prop="qty">
              <el-input-number v-model="tmp.qty" @keyup.native.enter="addDataTable"></el-input-number>
              <button-action-authenticated
                :permission="['inventory/stockincomings', 'edit']"
                type="primary"
                icon="el-icon-plus"
                :disabled="isButtonDisabled"
                @click="addDataTable"/>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </el-card>

    <bs-table
      v-loading="loading"
      :header="computedHeaderTable.header"
      class="box-shadow-2">
      <tr
        v-for="(item, key) in dataTable"
        :key="key">
        <td>{{ (key + 1) }}</td>
        <td>
          <div class="flex-container flex-container--wrap">
            <div v-if="item.product_photo_md" class="mr-4">
              <el-avatar
                :src="item.product_photo_md"
              />
            </div>
            <div v-if="item.product_sku !== null">
              <strong v-if="item.product_sku.length > 0">{{ item.product_name }} - {{ item.product_sku }}</strong>
              <strong v-else>{{ item.product_name }}</strong>
              <div v-if="item.product_variant_id !== null">
                <p v-if="item.product_variant_sku !== null">{{ item.product_variant_name }} - {{ item.product_variant_sku }}</p>
                <p v-else>{{ item.product_variant_name }}</p>
              </div>
            </div>
            <div v-else>
              <strong >{{ item.product_name }}</strong>
              <div v-if="item.product_variant_id !== null">
                <p v-if="item.product_variant_sku !== null">{{ item.product_variant_name }} - {{ item.product_variant_sku }}</p>
                <p v-else>{{ item.product_variant_name }}</p>
              </div>
            </div>
          </div>
          <div v-if="item.order_with_serial === 1">
            {{ $lang[langId].serial_product_note }}
            <template v-if="isEditing.id === item.id">
              <el-input v-model="isEditing.serials" type="textarea" size="small" />
            </template>
            <template v-else>
              <span v-if="typeof item.serials === 'undefined'">Empty</span>
              <div v-else style="display: flex; flex-direction: column;">
                <span v-for="i in item.fserials" :key="i">{{ i }}</span>
              </div>
            </template>
          </div>
        </td>
        <td v-if="computedHeaderTable.variabel">
          <template v-if="isEditing.id === item.id">
            <div class="el-input el-input--small">
              <input-money
                v-model="isEditing.new_buy_price"
                :disabled="isProgressing"
                @keyup.native.esc="cancel"
                @keyup.native.enter="save(isEditing)"
              />
            </div>
          </template>
          <template v-else>
            {{ item.fnew_buy_price }}
          </template>
        </td>
        <td>
          <template v-if="isEditing.id === item.id">
            <el-input
              v-model="isEditing.qty"
              :disabled="isProgressing"
              :min="1"
              type="number"
              @keyup.native.esc="cancel"
              @keyup.native.enter="save(isEditing)"
            />
          </template>
          <template v-else>
            {{ item.qty }} {{ item.product_uom }}
          </template>
        </td>
        <td v-if="computedHeaderTable.variabel">
            {{ item.favg_buy_price }}
        </td>
        <td v-if="computedHeaderTable.variabel">
            {{ item.fnew_buy_amount }}
        </td>
        <td v-if="editable">
          <button-action-authenticated
            :permission="['inventory/stockincomings', 'edit']"
            @click="removeDialog(item)"
            :disabled="isProgressing"
            type="text">
            <svg-icon icon-class="trash"></svg-icon>
          </button-action-authenticated>
          <template v-if="isEditing.id === item.id">
            <button-action-authenticated
              :permission="['inventory/stockincomings', 'edit']"
              :disabled="isProgressing"
              icon="el-icon-check"
              type="success"
              size="mini"
              @click="save(isEditing)"
            />
            <button-action-authenticated
              :permission="['inventory/stockincomings', 'edit']"
              type="info"
              size="mini"
              icon="el-icon-close"
              @click="cancel"
            />
          </template>
          <template v-else>
            <button-action-authenticated
              :permission="['inventory/stockincomings', 'edit']"
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="edit(item)" 
            />
          </template>
        </td>
      </tr>
      <tr v-if="dataStock.status === 'P' && computedHeaderTable.variabel">
        <td></td>
        <td colspan="2">
          Total
        </td>
        <td>{{ dataStock.ftotal_qty }}</td>
        <td></td>
        <td>{{ dataStock.fnew_buy_total_amount }}</td>
      </tr>
    </bs-table>

    <el-dialog
      :visible.sync="deleteDialog" 
      :show-close="false"
      custom-class="mw-420">
      <span slot="title">
        <svg-icon icon-class="alert-triangle" style="stroke: #F44336;"></svg-icon>
        {{ lang.notif_warn }}
      </span>
      <div class="text-center">
        <p>{{ $lang[langId].are_you_want_remove }} {{ lang.product }}</p>
        <div>
          <el-avatar
            :src="deleteData.product_photo_md"
            :alt="deleteData.product_photo_md"
          />
          <span style="margin-left: 10px;">
            <strong>"{{ deleteData.product_name }}"</strong>
          </span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <button-action-authenticated :permission="['inventory/stockincomings', 'edit']" @click="deleteCancel">{{ lang.cancel }}</button-action-authenticated>
        <button-action-authenticated :permission="['inventory/stockincomings', 'edit']" type="danger" @click="deleteSave">{{ $lang[langId].delete }}</button-action-authenticated>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import InputMoney from '@/components/InputMoneyV2'
import axios from 'axios'
import InputAutocomplete from '@/components/modules/InputAutocomplete'

import { debounce } from 'vue-debounce'

export default {
  components: {
    InputMoney,
    InputAutocomplete
  },

  props: {
    dataTable: {
      default: null,
      type: Array
    },
    dataStock: {
      default: null,
      type: Object
    },
    isButtonDisabled: {
      type: Boolean,
      default: false
    },
    isItemAdded: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loading: false,
      detailData: {},
      showTable: false,
      addProductDialog: false,
      deleteDialog: false,
      rowState: [],
      formAddProduct: {},
      searchData: [],
      searchingItems: false,
      tmp: {
        productSearchName: '',
        new_buy_price: '',
        qty: null,
        item: [],
        type: 'I'
      },
      isEditing: {},
      newDataTable: [],
      deleteData: {},
      addingOrderItem: false,
      isProgressing: false,
      tempSerial: {}
    }
  },
  watch: {
    isItemAdded(val) {
      if (val === true) {
        this.tmp.productSearchName = ''
        this.tmp.new_buy_price = ''
        this.tmp.qty = null
        this.tmp.item = {}
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
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    userRole() {
      const selectedStore = this.$store.getters.selectedStore
      return {
        role_id: selectedStore.role_id,
        role_name: selectedStore.role_name,
        is_pos_only: selectedStore.is_pos_only,
        is_mobile: selectedStore.is_mobile
      }
    },
    accessByStore () {
      return ['adhikitchenwareinovation']
    },
    computedHeaderTable() {
      const header = ['', this.lang.name, this.lang.buy_price, this.lang.qty, this.lang.avg_buy_price, this.lang.total, this.$lang[this.langId].action]
      const headerFilter = ['', this.lang.name, this.lang.qty, this.$lang[this.langId].action]
      let filter = false
      if (!this.selectedStore.access_buy_price) {
        if (this.userRole.role_id !== 'ST' && this.userRole.role_id !== 'SS' && this.userRole.role_id !== 'LW' && !this.selectedStore.is_hide_buy_price) {
          filter = true
        }
      } else if (this.accessByStore.includes(this.selectedStore.url_id) && this.userRole.role_id === 'LW') {
        filter = false
      } else {
        filter = true
      }
      // console.log(this.editable)
      if (!this.editable) {
        !filter ? headerFilter.splice(headerFilter.length - 1 , 1) : header.splice(header.length - 1 , 1)
      }
      const data = {
        header: !filter ? headerFilter : header,
        variabel: filter
      }
      return data
    }
  },
  methods: {
    addDataTable() {
      this.tmp.new_buy_price = parseFloat(this.tmp.new_buy_price).toFixed(2)
      this.$set(this.tmp, 'product_ids', this.tmp.item.join(','))
      this.$refs.InputAutocomplete.setFocus()
      this.$refs.InputAutocomplete.resetKeyword()
      this.$emit('itemadded', this.tmp)
    },
    selectProduct(item) {
      this.tmp.item = item

      this.searchData.map(i => {
        if (i.product_id === item[item.length - 1]) {
          // i.count_stockinout_item === 0 ? this.tmp.new_buy_price = i.buy_price : this.tmp.new_buy_price = i.last_avg
          // tgl 180921 ada adjustment dari pak ali dan mas rudi untuk menggunakan buy_price saja, 
          // padahal sebelumnya ada permintaan untuk menggunakan las_avg, 
          // kalau ada feedback bsuk dibahas lagi
          this.tmp.new_buy_price = i.buy_price
        }
      })
    },
    setQueryString (queryString) {
      if (queryString) {
        const dFn = debounce(queryString => this.getProductSearch(queryString), '400ms')
        dFn(queryString)
      } else {
        this.searchData = []
      }
    },

    getProductSearch(queryString, callback) {
      this.searchingItems = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        sort_column: 'name',
        sort_type: 'asc',
        search: queryString,
        search_column: 'track_inventory',
        search_text: 1,
        per_page: 1000
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productvariantonlysearch'),
        headers: headers,
        params: params
      }).then(response => {
        // for (let i of response.data.data) {
        //   i.value = i.name
        //   i.id = i.product_id
        // }
        this.searchData = response.data.data.map(item => {
          return item
        })
        // callback(this.searchData)
        this.searchingItems = false
      }).catch(() => {
        this.searchData = []
        // callback(this.searchData)
        this.searchingItems = false
      })
    },
    edit(data) {
      data.new_buy_price = Number.parseFloat(data.new_buy_price, 0)
      this.isEditing = Object.assign({}, data)
    },
    save(data) {
      this.loading = true
      this.isProgressing = true
      let block = false
      if (this.isEditing.order_with_serial === 1) {
        let serial = this.isEditing.serials.split('\n')
        serial.map(i => {
          if (i.length <= 1) {
            block = true
          }
        })
        console.log('bloc', block)
        if (!block) {
          this.saveSerial(data)
        } else {
          this.loading = false
          this.isProgressing = false
          this.$notify({
            type: 'warning',
            message: 'Serial harus lebih dari 1 digit'
          })
        }
      }
      if (!block) {
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }
        let params = {
          pk: this.isEditing.in_out_id,
          id: this.isEditing.id,
          qty: this.isEditing.qty,
          serials: this.isEditing.serials,
          new_buy_price: this.isEditing.new_buy_price
        }
        axios({
          method: 'POST',
          url: baseApi(this.selectedStore.url_id, this.langId, 'stockinouts/updateitemqty'),
          headers: headers,
          params: params
        }).then(response => {
          this.loading = false
          this.isProgressing = false
          // this.$message({
          //   message: 'Saved',
        //   type: 'success'
        // })
        this.$emit('itemupdated', response.data.data)
        this.cancel()
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loading = false
        this.isProgressing = false
      })
      }
    },
    saveSerial(data) {
      this.loading = true
      this.isProgressing = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data1 = {
        name: 'serials',
        pk: this.isEditing.id,
        value: this.isEditing.serials
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'stockinout/updateitemserials/' + this.isEditing.in_out_id),
        headers: headers,
        data: data1
      }).then(response => {
        this.loading = false
        this.isProgressing = false
        this.dataTable = response.data.data.items
        this.$message({
          message: 'Saved',
          type: 'success'
        })
        let data = response.data.data
        data.items.map(i => {
          if (i.serials !== null) {
            i.fserials = i.serials.split('\n')
            // console.log('serial', i.fserials)
          }
        })
        this.$emit('itemupdated', data)
        this.cancel()
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loading = false
        this.isProgressing = false
      })
    },
    removeDialog(row) {
      this.deleteData = { ...row }
      this.deleteDialog = true
    },
    deleteCancel () {
      this.deleteDialog = false
      this.deleteData = {}
    },
    deleteSave() {
      // console.log(data)
      let data = { ...this.deleteData }
      this.loading = true
      this.isProgressing = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        pk: data.in_out_id,
        id: data.id
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'stockinouts/removeitem'),
        headers: headers,
        params: params
      }).then(response => {
        this.deleteCancel()
        this.$emit('itemupdated', response.data.data)
        this.isProgressing = false
        this.loading = false
        this.$message({
          message: 'Delete Success',
          type: 'success'
        })
        this.cancel()
      }).catch(error => {
        this.deleteCancel()
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loading = false
        this.isProgressing = false
      })
    },
    cancel() {
      this.isEditing = {}
    }
  }
}
</script>
