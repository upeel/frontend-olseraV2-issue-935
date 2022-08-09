<template>
  <el-card class="box-card">
    <div slot="header" class="flex-container flex-container--wrap">
      <h3 class="box-title">{{ lang.order_item }}</h3>

      <div v-if="showEdit && detailData.status === 'P' && detailData.is_paid == 0">
        <el-button
          type="info"
          size="small"
          icon="el-icon-plus"
          @click="showProductDialog">
          {{ lang.product }}
        </el-button>
      </div>
    </div>

    <div class="card-body">
      <div v-if="!showTable" class="no-product text-center">
        <p>{{ $lang[langId].no_product }}</p>
        <img src="/static/img/no-data.svg" alt="No Data Picture">
      </div>

      <div v-else>
        <div class="table-responsive">
          <!-- <table class="table-orderitems table table-striped">
            <thead>
              <tr>
                <th width="20">No.</th>
                <th width="250" class="description">{{ lang.description }}</th>
                <th width="50">{{ lang.qty }}</th>
                <th width="100">{{ lang.price }} ({{ detailData.currency_id }})</th>
                <th width="100" class="total">{{ lang.total_price }} ({{ detailData.currency_id }})</th>
                <th width="100">{{ $lang[langId].action }}</th>
              </tr>
            </thead>
            <tbody> -->
          <bs-table
            v-loading="loading"
            :header="computedHeaderTable.header"
            class="box-shadow-2">
              <tr v-for="(item, key) in detailData.purchaseitems" :key="key">
                <td>{{ key + 1}}</td>
                <td>
                  <div class="flex-container">
                    <el-avatar v-if="item.product_photo_md" :src="item.product_photo_md" class="mr-4" />
                    <div>
                      {{ item.product_name }} - {{ item.product_variant_name }}
                    </div>
                    <span v-if="item.product_sku">({{ item.product_sku }})</span>
                  </div>
                </td>

                <td valign="middle" align="left">
                  <div v-if="rowState[key].edited">
                    <el-input
                      v-if="detailData.status === 'P'"
                      v-model="editTable.qty"
                      type="number"
                      @keyup.native.enter="handleSimpanRow(key, item)"
                    />
                    <el-input disabled v-else v-model="item.qty" />
                  </div>
                  <div v-else> {{ item.qty }} {{item.product_uom}} </div>
                </td>

                <td v-if="computedHeaderTable.variabel" valign="middle" align="left">
                  <div v-if="rowState[key].edited">
                    <input-money
                      v-model="editTable.price"
                      @keyup.native.enter="handleSimpanRow(key, item)"
                    />
                    <!-- <el-input disabled v-else v-model="editTable.price" /> -->
                  </div>
                  <div v-else> {{item.fprice}} </div>
                </td>

                <td v-if="computedHeaderTable.variabel" valign="middle" align="left">{{item.famount}}</td>

                <td v-if="showEdit && computedHeaderTable.variabel && (detailData.status === 'P' || detailData.status === 'S' || detailData.status === 'T')">
                  <el-button
                    v-if="!rowState[key].edited && !computedAccess"
                    @click="handleEditRow(key, item)"
                    size="small" type="text" icon="el-icon-edit" style="color: #0286CD;">
                    {{ lang.edit }}
                  </el-button>

                  <el-button
                    v-if="!rowState[key].edited && detailData.status === 'P' && !computedAccess"
                    @click="handleDeleteRow(key, item)"
                    size="small" type="text" icon="el-icon-delete" style="color: #F55246;">
                    {{ $lang[langId].delete }}
                  </el-button>

                 <el-button
                    v-if="rowState[key].edited"
                    @click="handleCancelRow(key)"
                    size="small" type="text" icon="el-icon-close" style="color: #595959;">
                    {{ lang.cancel }}
                  </el-button>

                  <el-button
                    v-if="rowState[key].edited"
                    @click="handleSimpanRow(key, item)"
                    size="small" type="text" icon="el-icon-check" style="color: #6EBE46;">
                    {{ lang.save }}
                  </el-button>
                </td>
                <td v-else-if="computedHeaderTable.variabel"></td>
                <td v-else-if="showEdit && !computedHeaderTable.variabel && detailData.status === 'P'">
                  <el-button
                    v-if="!rowState[key].edited"
                    @click="handleEditRow(key, item)"
                    size="small" type="text" icon="el-icon-edit" style="color: #0286CD;">
                    {{ lang.edit }}
                  </el-button>

                  <el-button
                    v-if="!rowState[key].edited && detailData.status === 'P'"
                    @click="handleDeleteRow(key, item)"
                    size="small" type="text" icon="el-icon-delete" style="color: #F55246;">
                    {{ $lang[langId].delete }}
                  </el-button>

                 <el-button
                    v-if="rowState[key].edited"
                    @click="handleCancelRow(key)"
                    size="small" type="text" icon="el-icon-close" style="color: #595959;">
                    {{ lang.cancel }}
                  </el-button>

                  <el-button
                    v-if="rowState[key].edited"
                    @click="handleSimpanRow(key, item)"
                    size="small" type="text" icon="el-icon-check" style="color: #6EBE46;">
                    {{ lang.save }}
                  </el-button>
                </td>
              </tr>

              <!-- <tr v-if="computedHeaderTable.variabel"> -->
                <tr v-if="computedHeaderTable.variabel">
                  <td colspan="12" style="border-bottom: 1px solid #000; padding: 0 0 0 0;"></td>
                </tr>

                <tr v-if="computedHeaderTable.variabel">
                  <td></td>
                  <td style="text-align: right;" class="ipad-style">{{ lang.order_amount }}</td>
                  <th>{{ detailData.total_item_qty }}</th>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>

                <tr v-if="computedHeaderTable.variabel">
                  <td></td>
                  <td style="text-align: right;" class="ipad-style">{{ lang.subtotal }}</td>
                  <td></td>
                  <td></td>
                  <th>{{ detailData.fsubtotal }}</th>
                  <td></td>
                </tr>

                <tr v-if="computedHeaderTable.variabel">
                  <td></td>
                  <td style="text-align: right;" class="ipad-style">{{ lang.discount }}</td>
                  <td></td>
                  <td></td>
                  <th>{{ detailData.fdiscount_amount }}</th>
                  <td v-if="showEdit">
                    <el-button v-if="!computedAccess" size="small" type="text" icon="el-icon-setting" @click="setDiscount">
                      {{ lang.discount }}
                    </el-button>
                  </td>
                  <td v-else></td>
                </tr>

                <tr v-if="computedHeaderTable.variabel">
                  <td></td>
                  <td style="text-align: right;" class="ipad-style">{{ lang.tax }}</td>
                  <td></td>
                  <td></td>
                  <th>{{ detailData.ftax_amount }}</th>
                  <td v-if="showEdit">
                    <el-button v-if="!computedAccess" size="small" type="text" icon="el-icon-setting" @click="setTaxPayment">
                      {{ lang.tax }}
                    </el-button>
                  </td>
                  <td v-else></td>
                </tr>

                <tr v-if="computedHeaderTable.variabel">
                  <td></td>
                  <td style="text-align: right;" class="ipad-style">{{ lang.shipping_cost }}</td>
                  <td></td>
                  <td></td>
                  <th>{{ detailData.fshipping_cost }}</th>
                  <td v-if="showEdit">
                    <el-button v-if="!computedAccess" size="small" type="text" icon="el-icon-setting" @click="setShippingPayment">
                      {{ lang.shipping }}
                    </el-button>
                  </td>
                  <td v-else></td>
                </tr>

                <tr v-if="computedHeaderTable.variabel">
                  <td colspan="12" style="padding: 0 0 0 0;"></td>
                </tr>

                <tr v-if="computedHeaderTable.variabel" style="background-color: #fff;">
                  <td></td>
                  <td style="text-align: right;" class="ipad-style">{{ lang.total_due }}</td>
                  <td></td>
                  <td></td>
                  <th>{{ detailData.ftotal_amount }}</th>
                  <td></td>
                </tr>

                <tr v-if="computedHeaderTable.variabel">
                  <td></td>
                  <td style="text-align: right;" class="ipad-style">{{ lang.paid_amount }}</td>
                  <td></td>
                  <td></td>
                  <th>{{ detailData.fpaid_amount }}</th>
                  <td></td>
                </tr>

                <tr v-for="(item, key) in detailData.payments" :key="key">
                  <template v-if="computedHeaderTable.variabel">
                    <td></td>
                    <td style="text-align: right;" class="ipad-style">{{ lang.payment }}</td>
                    <th><div>{{item.fpayment_date}}</div>
                      <span class="font-normal">* {{ item.payment_ref }}</span>
                    </th>
                    <td>
                      
                    </td>
                    <th>{{item.fpayment_amount}}</th>
                    <th>
                      <el-button
                        v-if="detailData.status === 'P'"
                        @click="handleDeletePayment(item)"
                        size="small" type="text" icon="el-icon-delete" style="color: #F55246; margin-top: -10px">
                        {{ $lang[langId].delete }}
                      </el-button>
                    </th>
                    <td></td>
                  </template>
                </tr>

                <tr v-if="!detailData.is_paid && computedHeaderTable.variabel">
                  <td></td>
                  <td style="text-align: right;" class="ipad-style">{{ lang.outstanding_payment }}</td>
                  <td></td>
                  <td></td>
                  <th >{{ detailData.foutstanding_amount }}</th>
                  <td v-if="!detailData.is_paid">
                    <el-button v-if="!computedAccess" size="small" type="text" icon="el-icon-setting" @click="setPayment">
                      {{ lang.payment }}
                    </el-button>
                  </td>
                  <td v-else></td>
                </tr>
              <!-- </tr> -->
          </bs-table>
            <!-- </tbody>
          </table> -->
        </div>
      </div>
    </div>

    <el-dialog
      :title="lang.add_product"
      :visible.sync="addProductDialog"
      :close-on-click-modal="false"
      custom-class="mw-760">
      <el-form
        @submit.native.prevent>
        <div class="row add-product mb-8">
          <div class="col-md-3 text-right">
            <label>{{ lang.product }}</label>
          </div>
          <div class="col-md-9">
            <div class="mb-4">
              <el-autocomplete
                v-model="searchQuery"
                :fetch-suggestions="getProductSearch"
                :placeholder="lang.info_auto_complete_product"
                class="w-fit"
                @select="getProductSelect"
              />
            </div>
            <el-tag
              v-for="(item, key) in formAddProduct.products"
              :key="key"
              closable
              class="mr-4 mb-4"
              @close="formAddProduct.products.splice(key, 1)">
              {{ item.name }}
            </el-tag>
          </div>
        </div>

        <div class="row mb-8">
          <div class="col-md-3 text-right">
            <label>{{ lang.buy_price}}</label>
          </div>
          <div class="col-md-9">
            <div class="el-input">
              <input-money
                v-model="formAddProduct.price"
                @keyup.enter.native="createNewProduct" />
            </div>
          </div>
        </div>

        <div class="row mb-8">
          <div class="col-md-3 text-right">
            <label>{{ lang.or }} {{ lang.total_price }}</label>
          </div>
          <div class="col-md-9">
            <div class="el-input">
              <input-money
                v-model="formAddProduct.amount"
                @keyup.enter.native="createNewProduct" />
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-3 text-right">
            <label>{{ lang.qty }}</label>
          </div>
          <div class="col-md-9">
            <el-input
              v-model="formAddProduct.qty"
              :placeholder="$lang[langId].input_number"
              type="number"
              @keyup.enter.native="createNewProduct"
            />
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="text" @click="addProductDialog = false">{{ lang.cancel }}</el-button>
        <el-button
          :loading="addingOrderItem"
          :disabled="disableButtonAddProduct"
          type="success"
          icon="el-icon-plus"
          @click="createNewProduct">
          {{ lang.add }}
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="deleteRowProduct"
      :close-on-click-modal="false"
      title="Alert"
      custom-class="mw-348">
      <el-form
        @submit.native.prevent
        @keyup.native.enter="saveDeleteRow(deleteRowData.id)">
        <h3 class="font-16 font-bold">
          {{ lang.are_you_sure_to_remove_this_data }}?
        </h3>
        <div class="flex-container" :data="deleteRowData">
          <div class="mr-8">
            <el-avatar
              :src="deleteRowData.product_photo_md"
              :alt="deleteRowData.product_name"
            />
          </div>
          <div>
            <p>{{ deleteRowData.product_name }}</p>
            <p>{{ deleteRowData.product_sku}}</p>
            <p>{{ deleteRowData.product_variant_name }}</p>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="text"
          class="color-danger"
          @click="saveDeleteRow(deleteRowData.id)">
          {{ $lang[langId].delete }}
        </el-button>
        <el-button
          type="text"
          @click="deleteRowProduct = false">
          {{ lang.cancel }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog class="discount" :title="lang.discount" :visible.sync="dialogDiscount" :close-on-click-modal="false">
      <!-- <div class="row">
        <div class="col-md-3 text-right">
          <label>{{ $lang[langId].please_input}}{{ lang.discount }}</label>
        </div>
        <div class="col-md-9">
          <input-money v-model="formDiscount.totalDiscount" />
        </div>
      </div> -->
      <div>
        <div class="text-left">
          <label>{{ $lang[langId].please_input}}{{ lang.discount }}</label>
        </div>
        <el-radio-group
          v-model="discountValue"
          size="mini"
          @change="handleRadioDiscount">
          <el-radio-button :label="1">
            <span style="font-size: 18px; margin-right:10px;">%</span>
            {{ lang.discount }}
          </el-radio-button>
          <el-radio-button :label="2">
            <span style="font-size: 18px; margin-right:10px;">$</span>
            {{ $lang[langId].nominal }}
          </el-radio-button>
        </el-radio-group>

        <el-input v-if="discountValue === 1" v-model="formDiscount.percent" type="number" :min="0" :max="100" @keyup.native="handlePercent">
          <template slot="append">%</template>
        </el-input>
        <input-money v-if="discountValue === 2" v-model="formDiscount.price" @keyup.native="handlePrice"/>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="text" @click="dialogDiscount = false" style="color:#F44336">{{ lang.cancel }}</el-button>
        <el-button type="success" @click="saveDiscount(discountValue)">{{ lang.save }}</el-button>
      </span>
    </el-dialog>

    <el-dialog class="tax" :title="lang.tax" :visible.sync="dialogTaxPayment" :close-on-click-modal="false">
      <div class="row">
        <div class="col-md-3 text-right">
          <label>{{ $lang[langId].please_input}}{{ lang.tax }}</label>
        </div>
        <!-- <div v-if="stageLevel === 'dash' || stageLevel === 'sit'" class="col-md-9">
          <input-money v-model="formTaxPayment.totalTax" />
        </div> -->
        <div class="flex-container" style="width: 300px">
          <div style="width: 60%">
            <input-money v-if="formTaxPayment.isPercentage === 0" 
              class="switch-discount--money border border--grey-border" 
              style="width: 100%" 
              v-model="formTaxPayment.totalTax" />
            <el-input
              v-if="formTaxPayment.isPercentage === 1"
              v-model="formTaxPayment.totalTaxPercentage"
              class="switch-discount--money border border--grey-border" style="width: 100%"
              @input="handleSetTaxFromPercentage" >
              <template slot="append">%</template>
            </el-input>
          </div>
          <div style="width: 40%">
            <el-radio-group v-model="formTaxPayment.isPercentage" class="flex-container" @change="handleMatchPercentage">
              <el-radio-button class="lpoint-type" style="width: 50%" :label="0">IDR</el-radio-button>
              <el-radio-button class="lpoint-type" style="width: 50%" :label="1">%</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="text" @click="resetTaxPayment">{{ lang.cancel }}</el-button>
        <el-button type="success" @click="saveTaxPayment">
          {{ lang.save }}
        </el-button>
      </span>
    </el-dialog>

    <el-dialog class="shipping-price" :title="lang.shipping_cost" :visible.sync="dialogShipping" :close-on-click-modal="false">
      <div class="row">
        <div class="col-md-3 text-right">
          <label>{{ $lang[langId].please_input}}{{ lang.shipping_cost }}</label>
        </div>
        <div class="col-md-9">
          <input-money v-model="formShipping.totalShipCost" />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="text" @click="dialogShipping = false">{{ lang.cancel }}</el-button>
        <el-button type="success" @click="saveShipping">{{ lang.save }}</el-button>
      </span>
    </el-dialog>

    <el-dialog class="payment" :title="lang.payment" :visible.sync="dialogPayment" :close-on-click-modal="false">
      <div>
        <div class="flex-container">
          <div class="full-width text-left">
            <h4>{{ lang.payment_date }}</h4>
          </div>
          <div class="full-width">
            <el-date-picker v-model="formPayment.paymentDate" type="date" :placeholder="$lang[langId].pick_a_day" format="dd-MM-yyyy" value-format="yyyy-MM-dd" class="full-width"></el-date-picker>
          </div>
        </div>
        <div class="flex-container">
          <div class="full-width text-left">
            <h4>{{ lang.payment_ref }}</h4>
            <div class="font-12 word-break" style="margin-top: -10px">{{ lang.info_payment_ref }}</div>
          </div>
          <div class="full-width">
            <el-input v-model="formPayment.paymentReference" :placeholder="$lang[langId].please_input+lang.payment_ref"></el-input>
          </div>
        </div>
        <div class="flex-container">
          <div class="full-width text-left">
            <h4>{{ $lang[langId].payment_jurnal }}</h4>
          </div>
          <div v-loading="loadingPaymentJurnal" class="full-width">
            <el-select
              style="width: 100%;"
              v-model="formPayment.payment_account_name_id"
              filterable
              remote
              reserve-keyword>
              <el-option
                v-for="(item) in dataPaymentJurnal"
                :key="item.id"
                :label="item.account_no + ' ' + item.account_name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="flex-container">
          <div class="full-width text-left">
            <h4>{{ lang.payment_amount }}</h4>
          </div>
          <div class="full-width">
            <input-money v-model="formPayment.paymentTotal" />
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="text" @click="dialogPayment = false">{{ lang.cancel }}</el-button>
        <el-button type="success" @click="savePayment">{{ lang.save }}</el-button>
      </span>
      <el-dialog
        width="30%"
        :title="$lang[langId].accounting_3rd_party_process"
        :visible.sync="waitingPayment"
        :show-close="false"
        :close-on-click-modal="false"
        append-to-body>
        <div align="center">{{$lang[langId].jurnal_please_wait}}</div>
        <loading-component 
          :active="true"
          color= '#1bb4e6'
          loader="bars"
          :width="64"
          :height="64" 
          backgroundColor='#ffffff' 
          style="text-align: center">
        </loading-component>
      </el-dialog>
    </el-dialog>
  </el-card>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import { fetchPaymentFromJurnal } from '@/api/purchases'
import InputMoney from '@/components/InputMoneyV2'
import LoadingComponent from 'vue-loading-overlay';

import basicComputedMixin from '@/mixins/basicComputedMixin'

export default {
  name: 'PurchaseTable',

  mixins: [basicComputedMixin],
  props: {
    dataTable: {
      default: null,
      type: Object
    },
    editShow: {
      default: true,
      type: Boolean
    }
  },

  components: {
    InputMoney,
    LoadingComponent
  },

  data() {
    return {
      loading: true,
      searchQuery: '',
      detailData: {},
      deleteRowData: {},
      showEdit: true,
      showTable: false,
      addProductDialog: false,
      deleteRowProduct: false,
      dialogDiscount: false,
      dialogShipping: false,
      dialogPayment: false,
      waitingPayment: false,
      dialogTaxPayment: false,
      rowState: [],
      formAddProduct: {
        products: []
      },
      searchData: [],
      addingOrderItem: false,
      formLabelWidth: '30%',
      formPayment: {
        paymentDate: '',
        paymentReference: '',
        paymentTotal: '',
        payment_account_name_id: ''
      },
      formShipping: {
        totalShipCost: ''
      },
      formTaxPayment: {
        totalTax: '',
        isPercentage: 1,
        totalTaxPercentage: ''
      },
      formDiscount: {
        price: 0,
        percent: 0
      },
      editTable: {
        noSerial: '',
        qty: '',
        price: ''
      },
      discountValue: 1,
      dataPaymentJurnal: [],
      loadingPaymentJurnal: false
    }
  },

  watch: {
    dataTable() {
      this.getData()
    },
    editShow() {
      this.showEditForm()
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
    },
    disableButtonAddProduct() {
      if (
        !this.formAddProduct.products.length ||
        !this.formAddProduct.qty
      ) {
        return true
      } else {
        return false
      }
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

    computedHeaderTable() {
      const header = ['', this.lang.description, this.lang.qty, this.lang.price + '(' + this.detailData.currency_id + ')', this.lang.total_price + '(' + this.detailData.currency_id + ')', this.$lang[this.langId].action]
      const headerFilter = ['', this.lang.description, this.lang.qty, this.$lang[this.langId].action]
      let filter = !this.selectedStore.is_hide_buy_price_purchase
      // if (!this.selectedStore.access_buy_price) {
        // if (this.userRole.role_id !== 'ST' && this.userRole.role_id !== 'SS' && this.userRole.role_id !== 'LW' && this.userRole.role_id !== 'PT' && !this.selectedStore.is_hide_buy_price) {
        //   filter = true
        // }
      // } else {
      //   filter = true
      // }
      // console.log(this.editable)
      // if (this.showEdit) {
      //   if (this.detailData.status === 'P' && this.detailData.is_paid !== 0) {
      //     !filter ? headerFilter.splice(headerFilter.length - 1 , 1) : headerFilter.splice(header.length - 1 , 1)
      //   }
      // } else {
      //   !filter ? headerFilter.splice(headerFilter.length - 1 , 1) : headerFilter.splice(header.length - 1 , 1)
      // }
      const data = {
        header: !filter ? headerFilter : header,
        variabel: filter
      }
      return data
    },

    accessByStore () {
      return ['cvsms', 'smsstore1', 'smsstore2']
    },

    computedAccess () {
      if (this.accessByStore.includes(this.selectedStore.url_id) && (this.selectedStore.role_id === 'PT')) {
        return true
      } else {
        return false
      }
    },
  },

  methods: {
    showEditForm() {
      this.showEdit = this.editShow
    },

    getData() {
      this.detailData = Object.assign({}, this.dataTable)
      this.deleteRowData = Object.assign({}, this.dataTable)
      this.refreshTable()
    },

    refreshTable() {
      this.loading = true
      if (this.detailData.purchaseitems.length > 0) {
        const promise = new Promise((resolve) => {
          this.detailData.purchaseitems.map((row, idx, arr) => {
            this.$set(row, 'edited', false)
            this.rowState.push(row)
            if (idx === arr.length - 1) {
              resolve()
            }
          })
        })
        promise.then(() => {
          this.loading = false
          this.showTable = true
        })
      } else {
        this.loading = false
        this.showTable = false
      }
    },

    getProductSearch(queryString, callback) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        sort_column: 'name',
        sort_type: 'asc',
        search: queryString,

        // ikun note => enable if only search product with track inventory, disable if search all product //

        // search_column: 'track_inventory',
        // search_text: 1,
        per_page: 50
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productvariantsearch'),
        headers: headers,
        params: params
      })
        .then(response => {
          for (let i of response.data.data) {
            i.value = i.name
          }
          this.searchData = response.data.data
          callback(this.searchData)
        })
        .catch(() => {
          this.searchData = []
        })
    },

    getProductSelect(item) {
      // check if product already added
      const exist = this.formAddProduct.products.filter(product => {
        return item.product_id === product.product_id
      })
      if (!exist.length) {
        this.searchQuery = ''
        this.formAddProduct.products.push(item)
        this.formAddProduct.price = item.buy_price
      }
    },

    createNewProduct() {
      this.addingOrderItem = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
        id: this.dataTable.id,
        product_ids: [...this.formAddProduct.products].map(item => {
          return item.product_id
        }).join(','),
        price: this.formAddProduct.price === null ? 0 : parseFloat(this.formAddProduct.price),
        amount: this.formAddProduct.amount === null ? 0 : parseFloat(this.formAddProduct.amount),
        qty: parseFloat(this.formAddProduct.qty)
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'openpurchase/additem'),
        headers: headers,
        data: data
      }).then(response => {
        this.detailData = response.data.data
        this.$message({
          message: 'Success',
          type: 'success'
        })
        this.addingOrderItem = false
        this.addProductDialog = false
        this.searchQuery = ''
        this.refreshTable()
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.addingOrderItem = false
        this.addProductDialog = true
      })
    },
    showProductDialog() {
      this.searchData = []
      this.formAddProduct = {
        products: [],
        price: '',
        qty: ''
      }
      this.addProductDialog = true
    },
    async handleEditRow(index, item) {
      // make sure others closed
      await this.rowState.map(row => {
        row.edited = false
        return row
      })
      this.editTable.qty = item.qty
      this.editTable.price = item.price
      this.rowState[index].edited = true
    },
    handleSimpanRow(index, item) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
        id: this.dataTable.id,
        pk: item.id,
        qty: this.editTable.qty,
        price: this.editTable.price
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'openpurchase/updateitem'),
        headers: headers,
        data: data
      })
        .then(response => {
          this.detailData = response.data.data
          this.$message({
            message: 'Success',
            type: 'success'
          })
          this.loading = false
          this.rowState[index].edited = false
          this.refreshTable()
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.loading = false
          this.rowState[index].edited = false
        })
    },

    handleCancelRow(index) {
      this.editTable.qty = ''
      this.editTable.price = ''
      this.rowState[index].edited = false
    },

    handleDeleteRow(index, item) {
      this.deleteRowData = item
      this.deleteRowProduct = true
    },

    saveDeleteRow(rowId) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
        id: this.dataTable.id,
        pk: rowId,
        qty: 0
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'openpurchase/updateitem'),
        headers: headers,
        data: data
      }).then(response => {
        this.detailData = response.data.data
        this.$message({
          message: 'Success',
          type: 'success'
        })
        this.loading = false
        this.refreshTable()
        this.deleteRowProduct = false
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loading = false
        this.deleteRowProduct = false
      })
    },
    setDiscount() {
      this.formDiscount.price = this.detailData.discount_amount
      this.formDiscount.percent = parseFloat(this.detailData.fdiscount_percent)
      this.dialogDiscount = true
    },
    saveDiscount(args) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
        discount_amount: 0
      }
      if (args === 1) {
        let disc = parseFloat(this.formDiscount.percent)
        let total = parseFloat(this.detailData.subtotal)
        data.discount_amount = (disc * total) / 100
      } else {
        data.discount_amount = this.formDiscount.price
      }
      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'openpurchase/' + this.$route.params.id),
        headers: headers,
        data: data
      })
        .then(response => {
          this.detailData = response.data.data
          this.$message({
            message: 'Success',
            type: 'success'
          })
          this.loading = false
          this.dialogDiscount = false
          this.refreshTable()
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.dialogDiscount = false
          this.loading = false
        })
    },
    setPayment() {
      this.formPayment.paymentDate = ''
      this.formPayment.paymentReference = ''
      if (this.detailData.is_paid_desc !== 'Parsial') {
        this.formPayment.paymentTotal = parseFloat(this.detailData.total_amount)
      } else {
        this.formPayment.paymentTotal = parseFloat(this.detailData.outstanding_amount)
      }
      this.getPaymentJurnal()
      this.dialogPayment = true
    },
    setShippingPayment() {
      this.formShipping.totalShipCost = this.detailData.shipping_cost
      this.dialogShipping = true
    },
    saveShipping() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
        shipping_cost: this.formShipping.totalShipCost
      }
      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'openpurchase/' + this.$route.params.id),
        headers: headers,
        data: data
      })
        .then(response => {
          this.detailData = response.data.data
          this.$message({
            message: 'Success',
            type: 'success'
          })
          this.loading = false
          this.dialogShipping = false
          this.refreshTable()
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.dialogShipping = false
          this.loading = false
        })
    },
    savePayment() {
      if(this.detailData.jurnal_posted_transaction === 1){
        this.waitingPayment = true
      }
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
        id: this.dataTable.id,
        payment_date: this.formPayment.paymentDate,
        payment_ref: this.formPayment.paymentReference,
        payment_amount: this.formPayment.paymentTotal,
        payment_account_name_id: this.formPayment.payment_account_name_id
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'openpurchase/updatepayment'),
        headers: headers,
        data: data
      })
        .then(response => {
          this.detailData = response.data.data
          this.$emit('changePayment', this.detailData)
          this.$message({
            message: 'Success',
            type: 'success'
          })
          if(this.dataTable.jurnal_posted_transaction = 1){
            this.waitingPayment = false
          }
          this.loading = false
          this.dialogPayment = false
          this.refreshTable()
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          if(this.dataTable.jurnal_posted_transaction = 1){
            this.waitingPayment = false
          }
          this.loading = false
          this.dialogPayment = false
        })
    },
    setTaxPayment() {
      let subtotal = parseInt(this.detailData.subtotal)
      this.formTaxPayment.totalTax = this.detailData.tax_amount
      this.formTaxPayment.totalTaxPercentage = parseInt(this.detailData.tax_amount) === 0? 0 : (parseInt(this.detailData.tax_amount) / parseInt(subtotal)) * 100
      this.dialogTaxPayment = true
    },
    saveTaxPayment() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
        tax_amount: this.formTaxPayment.totalTax
      }
      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'openpurchase/' + this.$route.params.id),
        headers: headers,
        data: data
      })
        .then(response => {
          this.detailData = response.data.data
          this.$message({
            message: 'Success',
            type: 'success'
          })
          this.loading = false
          this.dialogTaxPayment = false
          this.refreshTable()
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.dialogTaxPayment = false
          this.loading = false
        })
    },
    handleCurrencyDiscount(value) {
      if (value < 0) {
        this.formDiscount.totalDiscount = 0
      }
    },
    handleCurrencyTax(value) {
      if (value < 0) {
        this.formTaxPayment.totalTax = 0
      }
    },
    handleCurrencyShipping(value) {
      if (value < 0) {
        this.formShipping.totalShipCost = 0
      }
    },
    handleCurrencyPayment(value) {
      if (value < 0) {
        this.formPayment.paymentTotal = 0
      }
    },

    handleDeletePayment (item) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
        pk: item.id,
        id: item.purchase_order_id
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'openpurchase/removepayment/'),
        headers: headers,
        data: data
      })
        .then(response => {
          this.detailData = response.data.data
          this.$message({
            message: 'Success',
            type: 'success'
          })
          this.loading = false
          this.refreshTable()
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

    handlePrice (data) {
      if (this.formDiscount.price > parseInt(this.detailData.subtotal)) {
        this.formDiscount.price = this.detailData.subtotal
      }
    },

    handleRadioDiscount() {
      // this.formDiscount.percent = 0
      // this.formDiscount.price = 0
    },

    handlePercent (data) {
      if (this.formDiscount.percent > 100) {
        this.formDiscount.percent = 100
      }
    },

    async getPaymentJurnal() {
      this.loadingPaymentJurnal = true
      await fetchPaymentFromJurnal().then(response => {
        this.dataPaymentJurnal = response.data.data
        this.formPayment.payment_account_name_id = this.dataPaymentJurnal[0].id
        this.loadingPaymentJurnal = false
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loadingPaymentJurnal = false
        this.dataPaymentJurnal = []
      })
    },

    handleMatchPercentage () {
      let disc = 0
      let price = parseInt(this.detailData.subtotal)
      if (this.formTaxPayment.isPercentage === 1) {
        disc = (this.formTaxPayment.totalTax/price) * 100
        this.formTaxPayment.totalTaxPercentage = disc
      }
      if (this.formTaxPayment.isPercentage === 0) {
        disc = (this.formTaxPayment.totalTaxPercentage/100) * price
        this.formTaxPayment.totalTax = disc
      }
      // this.data.product.comission = disc
      // console.log('disc', disc)
    },

    handleSetTaxFromPercentage () {
      let disc = 0
      let price = parseInt(this.detailData.subtotal)
      if (this.formTaxPayment.isPercentage === 1) {
        disc = (this.formTaxPayment.totalTaxPercentage/100) * price
        this.formTaxPayment.totalTax = disc
      }
      // this.data.product.comission = disc
      // console.log('disc', disc)
    },

    resetTaxPayment () {
      let subtotal = parseInt(this.detailData.subtotal)
      this.formTaxPayment.totalTax = this.detailData.tax_amount
      this.formTaxPayment.totalTaxPercentage = parseInt(this.detailData.tax_amount) === 0? 0 : (this.detailData.tax_amount / 100) * subtotal
      this.formTaxPayment.isPercentage = 1
      this.dialogTaxPayment = false
    }
  }
}
</script>
