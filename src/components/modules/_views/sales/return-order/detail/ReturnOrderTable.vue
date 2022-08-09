<template>
  <el-card class="box-card">
    <div slot="header" class="flex-container flex-container--wrap">
      <h3 class="box-title">{{ lang.order_item }}</h3>
      <div v-if="dataTable.status === 'P'">
        <!-- <button-action-authenticated
          :permission="['sales/salesreturns', 'edit']"
          type="info"
          size="small"
          icon="el-icon-plus"
          @click="showReturnDialog">
          {{ lang.return_orders }}
        </button-action-authenticated> -->
        <button-action-authenticated
          :permission="['sales/salesreturns', 'store']"
          type="info"
          size="small"
          icon="el-icon-plus"
          @click="showReturnDialog">
          {{ lang.return_orders }}
        </button-action-authenticated>
      </div>
    </div>

    <div class="card-body">
      <div class="no-product text-center" v-if="!showTable">
        <p>{{ lang.no_order }}</p>
        <img src="/static/img/no-data.svg" alt="No Data Picture">
      </div>
      <div v-else>
        <div class="table-responsive">
          <table class="table-orderitems table table-striped">
            <thead>
              <tr>
                <th width="300" class="description">{{ lang.description }}</th>
                <th width="50">{{ lang.qty }}</th>
                <th width="100">{{ lang.price }} ({{ detailData.currency_id }})</th>
                <th width="100">{{ lang.total_price }} ({{ detailData.currency_id }})</th>
                <th width="100">{{ $lang[langId].action }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, key) in detailData.returnitems" :key="key">
                <td>
                  <div class="flex-container">
                    <div>{{ key + 1}}</div>
                    <div class="ml-8">
                      <el-avatar
                        v-if="item.product_photo_md"
                        :src="item.product_photo_md"
                        style="min-width: 40px;"
                      />
                    </div>
                    <div class="ml-8">
                      <template v-if="item.product_name">
                        <span>{{ item.product_name }}</span>
                      </template>
                      <template v-if="item.product_variant_name">{{ item.product_variant_name }}</template>
                      <template v-if="item.product_combo_name">{{ item.product_combo_name }}</template>
                      <span v-if="item.product_sku">
                        ({{ item.product_sku }})
                      </span><br>
                      <span><i class="el-icon-warning-outline" />{{ item.reason_name }}</span>
                    </div>
                  </div>
                </td>
                <td valign="middle" align="left">
                  <div v-if="rowState[key].edited">
                    <el-input-number v-model="editTable.qty" controls-position="right"></el-input-number>
                  </div>
                  <div v-else> {{item.qty}} </div>
                </td>
                <td valign="middle" align="left">
                  <div v-if="rowState[key].edited">
                    <input-money v-model="editTable.price" />
                  </div>
                  <div v-else> {{item.fprice}} </div>
                </td>
                <td valign="middle" align="left">{{item.famount}}</td>
                <td>
                  <div v-if="dataTable.status === 'P'">
                    <button-action-authenticated :permission="['sales/salesreturns', 'edit']" size="small" type="text" style="color: #0286CD;" v-if="!rowState[key].edited" @click="handleEditRow(key, item)">
                      <svg-icon icon-class="edit-2" class="mr-4"></svg-icon>{{ lang.edit }}
                    </button-action-authenticated>
                    <button-action-authenticated :permission="['sales/salesreturns', 'edit']" size="small" type="text" icon="el-icon-delete" style="color: #F55246;" v-if="!rowState[key].edited" @click="handleDeleteRow(key, item)">
                      {{ rootLang.delete }}
                    </button-action-authenticated>
                    <button-action-authenticated :permission="['sales/salesreturns', 'edit']" size="small" type="text" icon="el-icon-close" style="color: #595959;" v-if="rowState[key].edited" @click="handleCancelRow(key)">
                      {{ lang.cancel }}
                    </button-action-authenticated>
                    <button-action-authenticated :permission="['sales/salesreturns', 'edit']" size="small" type="text" icon="el-icon-check" style="color: #6EBE46;" v-if="rowState[key].edited" @click="handleSimpanRow(key, item)">
                      {{ lang.save }}
                    </button-action-authenticated>
                  </div>
                </td>
              </tr>
              <tr>
                <td colspan="5" style="border-bottom: 1px solid #000; padding: 0 0 0 0;"></td>
              </tr>
              <tr>
                <td style="text-align: right;">{{ lang.order_amount }}</td>
                <th>{{ detailData.total_item_qty }}</th>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td style="text-align: right;">{{ lang.subtotal }}</td>
                <td></td>
                <td></td>
                <th>{{ detailData.fsubtotal_amount }}</th>
                <td></td>
              </tr>
              <tr>
                <td style="text-align: right;">{{ lang.add_ons }}</td>
                <td></td>
                <td>{{ detailData.fadditional_amount }}</td>
                <td>{{ detailData.additional_description }}</td>
                <td>
                  <button-action-authenticated :permission="['sales/salesreturns', 'edit']" v-if="dataTable.status === 'P'" size="small" type="text" icon="el-icon-setting" @click="dialogAdditional = true">
                    {{ lang.settings }} {{ lang.add_ons }}
                  </button-action-authenticated>
                </td>
              </tr>
              <tr>
                <td colspan="5" style="padding: 0 0 0 0;"></td>
              </tr>
              <tr style="background-color: #fff;">
                <td style="text-align: right;">{{ lang.return_totals }}</td>
                <td></td>
                <td></td>
                <th>{{ detailData.ftotal_amount }}</th>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <el-dialog
      :title="lang.are_you_sure_to_remove_this_data"
      :visible.sync="deleteRowProduct"
      :close-on-click-modal="false"
      width="360px"
      class="delete">
      <div class="row" :data="deleteRowData" style="margin: 30px 20px 20px 20px;">
        <img
          :src="deleteRowData.product_photo_md"
          :alt="deleteRowData.product_name"
          class="table-image"
        />
        <h3 v-if="deleteRowData.product_name">{{ deleteRowData.product_name }}</h3>
        <h3 v-if="deleteRowData.product_combo_name">{{ deleteRowData.product_combo_name }}</h3>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="text"
          style="color:#F44336"
          @click="confirmDeleteProduct"
        >
          {{ $lang[langId].delete }}
        </el-button>
        <el-button type="text" @click="deleteRowProduct = false">
          {{ lang.cancel }}
        </el-button>
      </span>
    </el-dialog>

    <el-dialog class="return-product" :title="lang.return_orders" :visible.sync="addReturnDialog" :close-on-click-modal="false" :show-close="false">
      <span slot="title">
        <div class="flex-container">
          <div class="font-24 full-width">{{ lang.return_orders }}</div>
          <div class="text-right full-width">
            <el-button style="background: #F5F5F5" @click="addReturnDialog = false">{{ lang.cancel }}</el-button>
            <el-button type="info" disabled v-if="disableSaveReturn" >{{ lang.save }}</el-button>
            <el-button type="success" @click="saveReturnDialog" v-else>{{ lang.save }}</el-button>
          </div>
        </div>
      </span>
      <div>
        <div class="radius-10 box-shadow-2 px-16 py-12" style="border: 1px solid #F5F5F5">
          <el-input disabled :value="$lang[langId].no_product" v-if="formReturn.productItem.length < 1"></el-input>
          <div v-else>
            <el-table
              ref="multipleTable"
              :data="formReturn.productItem"
              style="width: 100%"
              @selection-change="handleSelectionChange">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column label="Pilih Produk" width="350px">
                <template slot-scope="scope">
                  <div class="flex-container full-width">
                    <div class="mr-8">
                      <el-avatar
                        :src="baseURL + 'img/no_data_item.png'"
                        :size="48"
                      />
                    </div>
                    <div class="full-width">
                      <div v-if="scope.row.product_item !== null">{{ scope.row.product_item.length > 30 ? scope.row.product_item.substring(0, 30) + '...' : scope.row.product_item }}</div>
                      <div>{{ scope.row.product_combo_name }}</div>
                      <div>{{ scope.row.deal_title }}</div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column min-width="130px">
                <template slot-scope="scope">
                  <div class="text-right">
                    <el-input-number v-model="formReturn.productItem[scope.$index].qty" :min="0" style="width: 120px" ></el-input-number>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="mt-24">
          <span class="font-12">{{ lang.reason_of_return }}</span>
          <el-select class="inline-form" v-model="formReturn.reason" filterable :placeholder="lang.please_select" @change="handleSelectReason" style="width: 100% !important">
            <el-option v-for="item in formReturn.reasonData" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
          <div class="mt-8" v-if="formReturn.reason === 100">
            <el-input type="textarea" v-model="formReturn.reasonOther" @change="handleReasonOther" step="width: 100%"></el-input>
          </div>
        </div>
        <div class="mt-16">
          <div class="flex-container border border--input py-8 px-8" style="border-radius: 2px">
            <div class="full-width font-16 font-bold">{{ lang.restore_back_to_stock }}</div>
            <div class="full-width text-right">
              <el-switch v-model="formReturn.restoreStock" :active-value="1" :inactive-value="0">
              </el-switch>
              <span v-if="formReturn.restoreStock === 0">{{ lang.no }}</span>
              <span v-else>{{ lang.yes }}</span>
            </div>
          </div>
          <span class="font-12">{{ lang.info_sales_return_restore_back_to_store }}</span>
        </div>
      </div>
    </el-dialog>

    <el-dialog class="additional-return" :title="lang.add_ons" :visible.sync="dialogAdditional" width="30%" :close-on-click-modal="false">
      <div>
        <div class="row">
          <div class="col-md-4 text-right">
            <h5>{{ lang.description }}</h5>
          </div>
          <div class="col-md-8">
            <el-input type="textarea" v-model="formAdditional.description"></el-input>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4 text-right">
            <h5>{{ lang.amount }}</h5>
          </div>
          <div class="col-md-8">
            <input-money v-model="formAdditional.price" />
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancelAdditional">{{ lang.cancel }}</el-button>
        <el-button type="success" @click="saveAdditional">{{ lang.save }}</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import InputMoney from '@/components/InputMoneyV2'
import basicComputedMixin from '@/mixins/basicComputedMixin'

export default {
  name: 'ReturnTable',
  props: {
    dataTable: {
      default: null,
      type: Object
    }
  },
  components: {
    InputMoney
  },
  mixins: [basicComputedMixin],
  data() {
    return {
      loading: true,
      detailData: {},
      showTable: false,
      addReturnDialog: false,
      deleteRowProduct: false,
      dialogAdditional: false,
      rowState: [],
      addingOrderItem: false,
      deleteRowData: {},
      editTable: {
        qty: '',
        price: 0
      },
      formReturn: {
        reasonData: [],
        reason: '',
        reasonOther: '',
        productItem: [],
        qty: 0,
        fqty: [],
        checkedProduct: [],
        restoreStock: 0
      },
      formAdditional: {
        description: '',
        price: 0
      },
      disableSaveReturn: false
    }
  },

  watch: {
    dataTable() {
      this.getData()
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
    rootLang() {
      return this.$lang[this.$store.state.userStores.langId]
    }
  },

  methods: {
    getData() {
      this.detailData = Object.assign({}, this.dataTable)
      this.refreshTable()
    },
    refreshTable() {
      this.loading = true
      if (this.detailData.returnitems.length > 0) {
        this.loading = false
        this.detailData.returnitems.map((row, idx) => {
          this.$set(row, 'edited', false)
          this.rowState.push(row)
        })
        // console.log(this.rowState)
        this.showTable = true
      } else {
        this.loading = false
        this.showTable = false
      }
    },
    showReturnDialog() {
      this.formReturn.checkedProduct = []
      this.formReturn.productItem = []
      this.formReturn.qty = 0
      this.formReturn.reason = ''
      this.formReturn.reasonOther = ''
      this.formReturn.restoreStock = 1
      this.getReturnProductItem()
      this.getReturnReason()
    },
    handleEditRow(index, item) {
      this.editTable.qty = item.qty
      this.editTable.price = parseInt(item.price)
      this.rowState[index].edited = true
    },
    handleSimpanRow(index, item) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
        return_id: this.$route.params.id,
        id: item.id,
        qty: this.editTable.qty,
        price: this.editTable.price
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'salesreturn/updateitem'),
        headers: headers,
        data: data
      })
        .then(response => {
          this.result = response.data
          if (response.data.status === 200) {
            this.detailData = response.data.data
            this.$message({
              message: 'Success',
              type: 'success'
            })
          }
          if (response.data.error) {
            this.$message({
              message: 'Error',
              type: 'error'
            })
          }
          this.refreshTable()
          this.loading = false
          this.rowState[index].edited = false
        })
        .catch(error => {
          this.loading = false
          this.$notify({
            title: 'Error: ' + error,
            type: 'warning',
            message: 'Error: ' + error
          })
          this.refreshTable()
        })
    },
    handleCancelRow(index) {
      this.editTable.qty = ''
      this.editTable.price = 0
      this.rowState[index].edited = false
    },
    handleDeleteRow(index, item) {
      this.deleteRowData = item
      this.deleteRowProduct = true
    },
    confirmDeleteProduct() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
        return_id: this.deleteRowData.sales_return_id,
        id: this.deleteRowData.id,
        qty: 0
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'salesreturn/updateitem'),
        headers: headers,
        data: data
      })
        .then(() => {
          this.loading = false
          this.deleteRowProduct = false
          this.$emit('item-deleted')
        })
        .catch(() => {
          this.loading = false
        })
    },
    getReturnProductItem() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        id: this.$route.params.id,
        per_page: 100
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'salesreturn/returnableItems'),
        headers: headers,
        params: params
      })
        .then(response => {
          this.formReturn.productItem = response.data.data
          this.formReturn.productItem.map(i => {
            this.formReturn.fqty.push(0)
          })
          if (this.formReturn.productItem.length > 0) {
            this.disableSaveReturn = true
          }
          this.loading = false
          this.addReturnDialog = true
        })
        .catch(error => {
          console.log(error)
          this.$notify({
            title: 'Error: ' + error,
            type: 'warning',
            message: 'Error: ' + error
          })
          this.loading = false
        })
    },
    getReturnReason() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'salesreturnreason'),
        headers: headers
      })
        .then(response => {
          this.formReturn.reasonData = response.data.data
          this.formReturn.reason = response.data.data[0].id
          this.loading = false
        })
        .catch(error => {
          console.log(error)
          this.loading = false
        })
    },
    handleCheckboxChange() {
      if (this.formReturn.checkedProduct.length > 0) {
        this.disableSaveReturn = false
      } else if (this.formReturn.checkedProduct.length < 1) {
        this.disableSaveReturn = true
      }
    },
    handleSelectReason() {
      if (this.formReturn.reason === 100) {
        this.disableSaveReturn = true
      } else {
        this.disableSaveReturn = false
        this.formReturn.reasonOther = ''
      }
    },
    handleReasonOther() {
      if (this.formReturn.reasonOther) {
        this.disableSaveReturn = false
      } else {
        this.disableSaveReturn = true
      }
    },
    saveReturnDialog() {
      let qty = []
      this.formReturn.productItem.map(i => {
        qty.push(i.qty)
      })
      this.formReturn.qty = qty.join(',')
      if (this.formReturn.checkedProduct.length < 1) {
        this.formReturn.checkedProduct = 0
      } else if (this.formReturn.checkedProduct.length === 1) {
        this.formReturn.checkedProduct = this.formReturn.checkedProduct.join()
        this.formReturn.checkedProduct = parseInt(this.formReturn.checkedProduct)
      } else if (this.formReturn.checkedProduct.length > 1) {
        this.formReturn.checkedProduct = this.formReturn.checkedProduct.join(',')
      }
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
        id: this.$route.params.id,
        item_id: this.formReturn.checkedProduct,
        qty: this.formReturn.qty,
        reason_id: this.formReturn.reason,
        restore_to_stock: this.formReturn.restoreStock,
        reason_other: this.formReturn.reasonOther
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'salesreturn/additem'),
        headers: headers,
        data: data
      })
        .then(response => {
          this.detailData = response.data.data
          this.refreshTable()
          this.$message({
            message: 'Success',
            type: 'success'
          })
          this.loading = false
        })
        .catch(error => {
          console.log(error)
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.loading = false
        })
      this.addReturnDialog = false
    },
    cancelAdditional() {
      this.dialogAdditional = false
      this.formAdditional.description = ''
      this.formAdditional.price = 0
    },
    saveAdditional() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
        return_id: this.$route.params.id,
        additional_description: this.formAdditional.description,
        additional_amount: this.formAdditional.price
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'salesreturn/updateadditional'),
        headers: headers,
        data: data
      })
        .then(response => {
          this.detailData = response.data.data
          this.refreshTable()
          this.$message({
            message: 'Success',
            type: 'success'
          })
          this.loading = false
          this.dialogAdditional = false
        })
        .catch(error => {
          console.log(error)
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.loading = false
        })
    },

    handleSelectionChange (data) {
      console.log('data', data)
      let checked = []
      if (data.length > 0) {
        data.map(i => {
          checked.push(i.sales_order_item_id)
        })
        this.disableSaveReturn = false
      } else {
        this.disableSaveReturn = true
      }
      this.formReturn.checkedProduct = checked
    }
  }
}
</script>
