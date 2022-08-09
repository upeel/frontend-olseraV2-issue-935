<template>
  <div>
    <el-card v-if="editable" class="card-box" style="margin-top: 20px;">
      <div slot="header">
        <strong>{{ lang.add_product }}</strong>
      </div>
      <div class="row">
        <div class="col-md-8">
          <input-autocomplete
            ref="InputAutocomplete"
            :fetch-suggestions="setQueryString"
            :searching-products="searchingItems"
            :search-result-products="searchData"
            :new-data="newData"
            @select="selectProduct"
          />
        </div>
        <div class="col-md-4">
          <el-input-number v-model="tmp.qty" @keyup.native.enter="addDataTable"></el-input-number>
          <el-button type="primary" icon="el-icon-plus" @click="addDataTable"/>
        </div>
      </div>
    </el-card>

    <bs-table
      :header="computedHeaderTable"
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
        <td v-if="editable">
          <el-button
            @click="removeDialog(item)"
            :disabled="isProgressing"
            type="text">
            <svg-icon icon-class="trash"></svg-icon>
          </el-button>
          <template v-if="isEditing.id === item.id">
            <el-button
              :disabled="isProgressing"
              icon="el-icon-check"
              type="success"
              size="mini"
              @click="save(isEditing)"
            />
            <el-button
              type="info"
              size="mini"
              icon="el-icon-close"
              @click="cancel"
            />
          </template>
          <template v-else>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="edit(item)" 
            />
          </template>
        </td>
      </tr>
      <tr v-if="dataStock.status === 'P'">
        <td></td>
        <td>
          Total
        </td>
        <td>{{ dataStock.ftotal_qty }}</td>
      </tr>
    </bs-table>

    <el-dialog :visible.sync="deleteDialog" width="50%" center :close-on-click-modal="false" :show-close="false">
      <span slot="title">
        <svg-icon icon-class="alert-triangle" style="stroke: #F44336;"></svg-icon>
        {{ lang.notif_warn }}
      </span>
      <div class="text-center">
        <p>{{ this.$lang[langId].are_you_want_remove }} {{ lang.product }}</p>
        <div>
          <img :src="deleteData.product_photo_md" class="table-image table-image-80" :alt="deleteData.product_photo_md">
          <span style="margin-left: 10px;">
            <strong>"{{ deleteData.product_name }}"</strong>
          </span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteCancel">{{ lang.cancel }}</el-button>
        <el-button type="danger" @click="deleteSave">{{ this.$lang[langId].delete }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'

import InputAutocomplete from '@/components/modules/InputAutocomplete'
import { debounce } from 'vue-debounce'

export default {
  components: {
    InputAutocomplete
  },

  props: {
    dataTable: {
      default: null,
      type: Array
    },
    dataStock: {
      default: null,
      type: Array
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
    },
    toStore: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      loading: true,
      detailData: {},
      showTable: false,
      addProductDialog: false,
      deleteDialog: false,
      rowState: [],
      formAddProduct: {},
      deleteData: {},
      searchData: [],
      isEditing: {},
      tmp: {
        productSearchName: '',
        qty: null,
        item: {}
      },
      addingOrderItem: false,
      isProgressing: false,
      newData: false,
      searchingItems: false
    }
  },

  watch: {
    isItemAdded(val) {
      if (val === true) {
        this.tmp.productSearchName = ''
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
    computedHeaderTable() {
      const header = ['', this.lang.name, this.lang.qty, this.$lang[this.langId].action]
      if (!this.editable) {
        header.splice(header.length - 1 , 1)
      }
      return header
    }
  },

  methods: {
    addDataTable() {
      this.newData = true
      this.$set(this.tmp, 'product_ids', this.tmp.item.join(','))
      this.$refs.InputAutocomplete.setFocus()
      this.$refs.InputAutocomplete.resetKeyword()
      this.$emit('itemadded', this.tmp)
    },
    selectProduct(item) {
      this.newData = false
      this.tmp.item = item
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
        store: this.toStore,
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
      let Data = Object.assign({}, data)
      Data.new_buy_price = Number.parseInt(Data.new_buy_price, 0)
      this.isEditing = Object.assign({}, Data)
    },
    save(data) {
      this.isProgressing = true
      this.loading = true
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
          serials: this.isEditing.serials
        }
        axios({
          method: 'POST',
          url: baseApi(this.selectedStore.url_id, this.langId, 'stockinouts/updateitemqty'),
          // url: baseApi(this.toStore, this.langId, 'stockinouts/updateitemqty'),
          headers: headers,
          params: params
        }).then(response => {
          this.$emit('itemupdated', response.data.data)
          this.isProgressing = false
          this.cancel()
        }).catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
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
            console.log('serial', i.fserials)
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
        this.isProgressing = false
      })
    },
    cancel() {
      this.isEditing = {}
    }
  }
}
</script>
