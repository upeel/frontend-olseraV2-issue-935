<template>
  <div>
    <el-card v-if="editable" class="card-box" style="margin-top: 20px;">
      <div slot="header">
        <strong>{{ lang.add_product }}</strong>
      </div>
      <div class="row">
        <div class="col-md-5">
          <input-autocomplete
            ref="InputAutocomplete"
            :fetch-suggestions="setQueryString"
            :searching-products="searchingItems"
            :search-result-products="searchData"
            :new-data="newData"
            @select="selectProduct"
          />
        </div>
        <div class="col-md-3">
          <el-time-picker
            v-model="tmp.time"
            :picker-options="{format: 'HH:mm'}"
            value-format="HH:mm"
            :placeholder="lang.time">
          </el-time-picker>
        </div>
        <div class="col-md-4">
          <el-input-number v-model="tmp.qty" @keyup.enter.native="addDataTable"></el-input-number>
          <el-button type="primary" icon="el-icon-plus" :disabled="isButtonDisabled" @click="addDataTable"/>
        </div>
      </div>
    </el-card>

    <el-card class="card-box" style="margin-top: 20px;">
      <div class="table-responsive">
        <el-table
          ref="stocksTable"
          :data="dataTable"
          stripe
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
            :label="lang.time"
            width="250">
            <template slot-scope="scope">
              <template v-if="isEditing.id === scope.row.id">
                <el-time-picker
                  v-model="isEditing.time"
                  :picker-options="{format: 'HH:mm'}"
                  value-format="HH:mm"
                  :placeholder="lang.time">
                </el-time-picker>
              </template>
              <template v-else>
                {{ scope.row.ftime }}
              </template>
            </template>
          </el-table-column>
          <el-table-column
            v-if="editable"
            :label="lang.qty"
            width="150">
            <template slot-scope="scope">
              <template v-if="isEditing.id === scope.row.id">
                <el-input :min="1" type="number" v-model="isEditing.qty" />
              </template>
              <template v-else>
                {{ scope.row.qty }} {{ scope.row.product_uom }}
              </template>
            </template>
          </el-table-column>
          <el-table-column
            v-if="editable && (stageLevel === 'dev' || stageLevel === 'sit')"
            :label="$lang[langId].qty_diff"
            width="150">
            <template slot-scope="scope">
              <template v-if="isEditing.id === scope.row.id">
                 {{ (scope.row.qty_diff)-(scope.row.fqty_system ) }} 
              </template>
              <template v-else>
                {{ (scope.row.qty_diff)-(scope.row.fqty_system ) }} 
              </template>
            </template>
          </el-table-column>
          <el-table-column
            v-if="!editable"
            :label="lang.system_qty"
            prop="qty_sys"
            width="120">
          </el-table-column>
          <el-table-column
            v-if="!editable"
            :label="lang.actual_qty"
            prop="qty"
            width="120">
          </el-table-column>
          <el-table-column
            v-if="!editable"
            :label="lang.difference"
            prop="qty_diff"
            width="120">
          </el-table-column>
          <el-table-column
            v-if="editable"
            :label="$lang[langId].action"
            width="150">
            <template slot-scope="scope">
              <el-button
                @click="removeDialog(scope.row)"
                :disabled="isProgressing"
                type="text">
                <svg-icon icon-class="trash"></svg-icon>
              </el-button>
              <template v-if="isEditing.id === scope.row.id">
                <el-button
                  :disabled="isProgressing"
                  icon="el-icon-check"
                  type="success"
                  size="mini"
                  @click="save(isEditing)"
                />
                <el-button @click="cancel" type="text"><svg-icon icon-class="x"></svg-icon></el-button>
              </template>
              <template v-else>
                <el-button @click="edit(scope.row)" type="text"><svg-icon icon-class="edit-2"></svg-icon></el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

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
        <el-button type="danger" @click="deleteSave">{{ $lang[langId].delete }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
var moment = require('moment')

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
      deleteDialog: false,
      deleteData: {},
      rowState: [],
      formAddProduct: {},
      searchData: [],
      tmp: {
        productSearchName: '',
        time: moment().format('HH:mm'),
        qty: null,
        item: {}
      },
      isEditing: {},
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
        this.tmp.time = moment().format('HH:mm')
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
    }
  },
  methods: {
    refreshTable() {
      this.$nextTick(() => {
        this.$refs.stocksTable.doLayout()
      })
    },
    selectProduct(item) {
      this.newData = false
      this.tmp.item = item
    },
    addDataTable() {
      this.newData = true
      this.$set(this.tmp, 'product_ids', this.tmp.item.join(','))
      this.$refs.InputAutocomplete.setFocus()
      this.$refs.InputAutocomplete.resetKeyword()
      this.$emit('itemadded', this.tmp)
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
        per_page: 50
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productvariantsearch'),
        headers: headers,
        params: params
      }).then(response => {
        this.searchData = response.data.data
        this.searchingItems = false
      }).catch(() => {
        this.searchData = []
        this.searchingItems = false
      })
    },
    edit(data) {
      let Data = Object.assign({}, data)
      Data.time = moment(Data.time).format('HH:mm')
      this.isEditing = Data
    },
    save(data) {
      this.loading = true
      this.isProgressing = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      // this.isEditing.qty = Number.parseInt(this.isEditing.qty, 0)
      let params = {
        id: this.isEditing.opname_id,
        pk: this.isEditing.id,
        qty: this.isEditing.qty,
        time: this.isEditing.time
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'stockopname/updateitem'),
        headers: headers,
        params: params
      }).then(response => {
        this.isProgressing = false
        this.$emit('itemupdated', response.data.data)
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
        id: data.opname_id,
        pk: data.id
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'stockopname/removeitem'),
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
