<template>
  <div>
    <el-card v-if="editable" class="card-box" style="margin-top: 20px;">
      <div slot="header">
        <strong>{{ lang.add_product }}</strong>
      </div>
      <div class="row">
        <el-form >
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
            <button-action-authenticated :permission="['inventory/productionsmode', 'edit']" type="primary" icon="el-icon-plus" @click="addDataTable"/>
          </div>
        </el-form>
      </div>
    </el-card>

    <el-card class="card-box" style="margin-top: 20px;">
      <div class="table-responsive">
        <el-table
          :data="dataTable"
          stripe
          :show-summary="showTotal"
          :summary-method="getSummaries"
          style="width: 100%;">
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            :label="lang.name">
            <div slot-scope="scope" class="flex-container flex-container--wrap">
              <div v-if="scope.row.product_photo_md" class="mr-4">
                <el-avatar
                  :src="scope.row.product_photo_md"
                />
              </div>
              <div v-if="scope.row.product_sku !== null">
                <strong v-if="scope.row.product_sku.length > 0">{{ scope.row.product_name }} - {{ scope.row.product_sku }}</strong>
                <strong v-else>{{ scope.row.product_name }}</strong>
                <div v-if="scope.row.product_variant_id !== null">
                  <p v-if="scope.row.product_variant_sku !== null">{{ scope.row.product_variant_name }} - {{ scope.row.product_variant_sku }}</p>
                  <p v-else>{{ scope.row.product_variant_name }}</p>
                </div>
              </div>
              <div v-else>
                <strong >{{ scope.row.product_name }}</strong>
                <div v-if="scope.row.product_variant_id !== null">
                  <p v-if="scope.row.product_variant_sku !== null">{{ scope.row.product_variant_name }} - {{ scope.row.product_variant_sku }}</p>
                  <p v-else>{{ scope.row.product_variant_name }}</p>
                </div>
              </div>
            </div>
          </el-table-column>
          <el-table-column
            prop="qty"
            :label="lang.qty"
            width="150">
            <template slot-scope="scope">
              <template v-if="isEditing.id === scope.row.id">
                <el-input
                  :min="1"
                  :disabled="isProgressing"
                  type="number"
                  v-model="isEditing.qty" />
              </template>
              <template v-else>
                {{ scope.row.qty }} {{ scope.row.product_uom }}
              </template>
            </template>
          </el-table-column>
          <el-table-column
            v-if="editable"
            :label="$lang[langId].action"
            width="150">
            <template slot-scope="scope">
              <button-action-authenticated :permission="['inventory/productionsmode', 'edit']"
                @click="remove(scope.row)"
                :disabled="isProgressing"
                type="text"
                icon="el-icon-delete"
              />
              <template v-if="isEditing.id === scope.row.id">
                <button-action-authenticated :permission="['inventory/productionsmode', 'edit']"
                  @click="save(isEditing)"
                  :disabled="isProgressing"
                  type="success"
                  size="mini"
                  icon="el-icon-check"
                />
                <button-action-authenticated :permission="['inventory/productionsmode', 'edit']" @click="cancel" icon="el-icon-close" size="mini" type="info" />
              </template>
              <template v-else>
                <button-action-authenticated :permission="['inventory/productionsmode', 'edit']" @click="edit(scope.row)" type="primary" size="mini" icon="el-icon-edit" />
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
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
    }
  },
  data() {
    return {
      loading: true,
      detailData: {},
      showTable: false,
      addProductDialog: false,
      rowState: [],
      formAddProduct: {},
      searchData: [],
      tmp: {
        productSearchName: '',
        qty: null,
        item: {}
      },
      addingOrderItem: false,
      isEditing: {},
      isProgressing: false,
      newData: false,
      searchingItems: false
    }
  },

  watch: {
    dataTable(val) {
      console.log(val)
    },
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
    showTotal() {
      if (this.dataStock.status === 'P') {
        return true
      } else {
        return false
      }
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
        this.searchData = response.data.data
        this.searchingItems = false
      }).catch(() => {
        this.searchData = []
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
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        pk: this.isEditing.in_out_id,
        id: this.isEditing.id,
        qty: this.isEditing.qty
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'stockinouts/updateitemqty'),
        headers: headers,
        params: params
      }).then(response => {
        this.$emit('itemupdated', response.data.data)
        this.isProgressing = false
        this.cancel()
      }).catch(error => {
        console.log(error)
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.isProgressing = false
      })
    },
    remove(data) {
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
    },
    cancel() {
      this.isEditing = {}
    },

    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = 'Total'
          return
        }
        if (index === 2) {
          sums[index] = this.dataStock.ftotal_qty
          return
        }
      })
      return sums
    }
  },

  mounted() {
    console.log(this.editable)
  }
}
</script>
