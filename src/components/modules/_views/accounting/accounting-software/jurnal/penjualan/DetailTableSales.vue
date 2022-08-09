<template>
  <el-card class="box-card">
    <div slot="header">
      <h3 class="box-title">{{ lang.order_item }}</h3>

    </div>

    <div class="card-body">
      <div class="no-product text-center" v-if="!showTable">
        <p>{{ lang.no_order }}</p>
        <img src="../../../../../../../../static/img/no-data.svg" alt="No Data Picture">
      </div>
      <div v-else>
        <div class="table-responsive">
          <table class="table-orderitems table table-striped">
            <thead>
              <tr>
                <th class="description">{{ lang.description }}</th>
                <th width="150">{{ lang.serial }}</th>
                <th width="50">{{ lang.qty }}</th>
                <th width="150">{{ lang.price }} ({{ detailData.currency_id }})</th>
                <th width="150" class="total">{{ lang.total_price }} ({{ detailData.currency_id }})</th>
                <th width="50">{{lang.tax}}</th>
                <th width="30" style="text-align: center">{{ $lang[langId].action }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, key) in detailData.orderitems" :key="key">
                <td>
                  <div class="flex-container">
                    <el-avatar
                      v-if="item.photo_md"
                      :src="item.photo_md"
                      style="min-width: 40px;"
                    />
                    <div class="ml-8">
                      <!-- <router-link :to="{path:'/catalog/product/' + item.product_id}"> -->
                        <template v-if="item.product_name">{{ item.product_name }}</template>
                        <template v-if="item.product_variant_name">{{ item.product_variant_name }}</template>
                        <template v-if="item.product_combo_name">{{ item.product_combo_name }}</template>
                        <span v-if="item.product_sku">
                          ({{ item.product_sku }})
                        </span>

                        <div v-if="item.product_combo_id" class="product-comodities">
                          <strong class="size-11">{{ lang.products_inside }}</strong>
                          <ul class="list-unstyled">
                            <li v-for="productPackage in item.products" :key="productPackage.id">
                              {{ productPackage.product_name }} ({{ productPackage.qty }})
                            </li>
                          </ul>
                        </div>
                      <!-- </router-link> -->
                    </div>
                  </div>

                </td>
                <td valign="middle" align="left">
                  <div v-if="rowState[key].edited">
                    <el-input v-if="item.order_with_serial == 1" type="text" v-model="editTable.noSerial" :placeholder="$lang[langId].input_code" clearable></el-input>
                  </div>
                  <div v-else>
                    <p v-if="!item.serial_no">-</p>
                    <p v-else>{{ item.serial_no }}</p>
                  </div>
                </td>
                <td valign="middle" align="left">
                  <div v-if="rowState[key].edited">
                    <el-input-number v-if="detailData.status === 'P' && detailData.is_paid == 0" v-model="editTable.qty" controls-position="right" :min="0" ></el-input-number>
                    <el-input disabled v-else v-model="item.qty"></el-input>
                  </div>
                  <div v-else> {{item.qty}} </div>
                </td>
                <td valign="middle" align="left">
                  <div v-if="rowState[key].edited">
                    <!-- <money v-if="detailData.status === 'P' && detailData.is_paid == 0" v-model="editTable.price" class="el-input__inner" @keyup.native.enter="handleSimpanRow(key, item)"></money> -->
                    <input-money v-if="detailData.status === 'P' && detailData.is_paid == 0" v-model="editTable.price" @keyup.native.enter="handleSimpanRow(key, item)" />
                    <el-input disabled v-else v-model="editTable.price"></el-input>
                  </div>
                  <div v-else> {{item.fprice}} </div>
                  <div v-if="item.fdiscount && item.fdiscount !== '0'" class="font-12">( - {{ item.fdiscount }})</div>
                </td>
                <td valign="middle" align="left">
                  <div class="text-right"> {{item.famount}} </div>
                  
                </td>
                <td valign="middle" align="left">{{item.line_tax_name}}</td>
                <td width="160" style="text-align: center">
                  <el-dropdown style="float: right;">
                    <el-button size="mini" :type="classPostType(item)">
                      {{item.jurnal_posted_product ? $lang[langId].posted : $lang[langId].unposted}}
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu style="background-color: #F2F2F2;">
                      <el-dropdown-item style="padding: 0px">
                        <el-button type="text" class="accounting-dropBtn" @click="postProduct(item, key)">
                          <svg-icon icon-class="right-arrow"></svg-icon>
                          Post {{ lang.product }}
                        </el-button>
                      </el-dropdown-item>
                      <el-dropdown-item style="padding: 0px">
                        <el-button type="text" class="accounting-dropBtn" @click="modalMapProduct(item)">
                          <svg-icon icon-class="hierarchy"></svg-icon>
                          Map {{ lang.product }}
                        </el-button>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </td>
              </tr>
              <tr>
                <td colspan="12" style="border-bottom: 1px solid #000; padding: 0 0 0 0;"></td>
              </tr>
              <tr>
                <td ></td>
                <td style="text-align: right;" class="ipad-style">{{ lang.order_amount }}</td>
                <td></td>
                <td></td>
                <th>{{ detailData.ftotal_item_qty }}</th>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td style="text-align: right;" class="ipad-style">{{ lang.subtotal }}</td>
                <td></td>
                <td></td>
                <th>{{ detailData.forder_amount }}</th>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td style="text-align: right;" class="ipad-style">{{ lang.discount }}</td>
                <td></td>
                <td></td>
                <th>{{ detailData.fdiscount_amount }} ({{ detailData.fdiscount_percent }}%)</th>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td style="text-align: right; width: 100px" class="ipad-style">{{ lang.service_charge }}</td>
                <td></td>
                <td></td>
                <th>{{ detailData.fservice_charge_amount }}</th>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td style="text-align: right;" class="ipad-style">{{ lang.tax }}</td>
                <td></td>
                <td></td>
                <th>{{ detailData.ftax_amount }}</th>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td style="text-align: right;" class="ipad-style">{{ $lang[langId].rounded }}</td>
                <td></td>
                <td></td>
                <th>{{ detailData.frounded_amount }}</th>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td style="text-align: right;" class="ipad-style">{{ lang.shipping_cost }}</td>
                <td></td>
                <td></td>
                <th>{{ detailData.fshipping_cost }}</th>
                <td></td>
                <td></td>
              </tr>
              <tr v-if="detailData.unique_payment_code !== 0">
                <td></td>
                <td style="text-align: right;" class="ipad-style">{{ lang.unique_code }}</td>
                <td></td>
                <td></td>
                <th>{{ detailData.unique_payment_code }}</th>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td colspan="12" style="padding: 0 0 0 0;"></td>
              </tr>
              <tr style="background-color: #fff;">
                <td></td>
                <td style="text-align: right;" class="ipad-style">{{ lang.total_due }}</td>
                <td></td>
                <td></td>
                <th>{{ detailData.ftotal_amount }}</th>
                <td></td>
                <td></td>
              </tr>
              <tr style="background-color: #fff;">
                <td></td>
                <td style="text-align: right;" class="ipad-style">{{ lang.payment }} {{ detailData.payment_mode_name }}</td>
                <td style="border: none;"></td>
                <td style="border: none;"></td>
                <th style="border: none;">{{ detailData.fpayment_amount }}</th>
                <td style="border: none;">
                </td>
                <td style="border: none;"></td>
              </tr>
              <tr v-for="item in detailData.creditpayments" :key="item.id" style="background-color: #fff;">
                <td></td>
                <td style="text-align: right;" class="ipad-style">{{ lang.payment }} {{ item.payment_type_name }} {{ detailData.fpayment_date }}</td>
                <td></td>
                <td></td>
                <th>{{ item.fpayment_amount }}</th>
                <td></td>
              </tr>
              <tr style="background-color: #fff;">
                <td style="border: none; text-align: right;"></td>
                <th colspan="3" style="border: none; text-align: right;">
                  <p>
                    <label v-if="!detailData.payment_from_bank">{{ lang.payment_via_bank }} : -</label>
                    <label v-else>{{ lang.payment_via_bank }} : {{ detailData.payment_from_bank }} {{ detailData.payment_payee !== null ? '(' + detailData.payment_payee + ')' : ''}}</label>
                  </p>

                  <p>
                    <label v-if="detailData.payment_charge">{{ lang.payment_charge }} : {{ detailData.payment_charge }}</label>
                  </p>

                  <p>
                    <label v-if="!detailData.payment_ref">{{ lang.payment_ref }} : -</label>
                    <label v-else>{{ lang.payment_ref }} : {{ detailData.payment_ref }}</label>
                  </p>

                  <p>
                    <label v-if="!detailData.payment_date">{{ lang.payment_date }} : -</label>
                    <label v-else>{{ lang.payment_date }} : {{ detailData.payment_date }}</label>
                  </p>
                </th>
                <td style="border: none;"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <el-dialog
      title="Map Product"
      :visible.sync="modalProduct"
      width="30%" center
      :close-on-click-modal="false"
      :show-close="false">
      <div>
        <el-form @submit.native.prevent>
          <div>
            <label style="font-size: 12px">{{ lang.product_name }}</label>
          </div>
          <el-form-item>
            <el-input id="supplier_name" v-model="mapProductName" disabled type="text"></el-input>
          </el-form-item>
          <div>
            <label style="font-size: 12px">{{ $lang[langId].jurnal_product }}</label>
          </div>
          <el-form-item>
            <el-select 
              v-if="this.statusFetch === 1" 
              :placeholder="$lang[langId].type_keyword" 
              filterable
              remote
              reserve-keyword
              v-model="product.jurnal_product_id"
              @change="(value) => selectProductFecth(value)"
              :remote-method="searchFecthProduct"
              style="width: 100%">
              <el-option
                v-for="(item, keyFetch) in dataProductFetched"
                :key="keyFetch"
                :label="item.jurnal_product_name"
                :value="item.jurnal_product_id">
              </el-option>
            </el-select>
            <el-select v-else 
              v-model="product.jurnal_product_id" 
              filterable style="width: 100%" 
              :placeholder="$lang[langId].select + ' ' + lang.category"
              @change="(value) => selectProduct(value)">
              <el-option
                v-for="item in jurnalProduct"
                :key="item.jurnal_product_id"
                :label="capitalize(item.jurnal_product_name)"
                :value="item.jurnal_product_id"
                >
                <el-button type="text" style="width: 100%; text-align: left; color: black; font-weight: normal" @click="selectProduct(item)">{{capitalize(item.jurnal_product_name)}}</el-button>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modalMapProduct('')">{{ lang.cancel }}</el-button>
        <el-button :disabled="loadingMap" type="success" @click="mapProduct">{{ lang.save }}</el-button>
      </span>
    </el-dialog>

  </el-card>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import InputMoney from '@/components/InputMoneyV2'
import baseURL from '@/utils/baseURL'
import { listFecthProduct } from '@/api/accounting-3rd/jurnalid'

export default {
  name: 'OrderTable',
  props: {
    dataTable: {
      default: null,
      type: Object
    },
    statusFetch: {
      type: Number,
      default: 0
    }
  },
  components: {
    InputMoney
  },
  data() {
    return {
      loading: true,
      loadingMap: false,
      detailData: {},
      showTable: false,
      rowState: [],
      mapProductId: '',
      mapProductName: '',
      mapProductVariant: '',
      mapProductCombo: '',
      mapProductDeal: '',
      product: {
        jurnal_product_id: '',
        jurnal_product_name: ''
      },
      modalProduct: false,
      jurnalProduct: [],
      dataProductFetched: [],
      editTable: {
        noSerial: '',
        qty: '',
        price: ''
      },

    }
  },
  watch: {
    dataTable() {
      this.getData()
    },
  },
  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    selectRoute() {
      return this.$route.name
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



    uploadImportUrl() {
      let data = {
        url: baseURL + 'api/' + this.selectedStore.url_id + '/admin/v1/' + this.langId + '/openorder/importitem',
        header: {
          'authorization' : 'Bearer ' + this.token.access_token,
          'accept' : 'application/json'
        }
      }
      return data
    },
  },

  mounted() {
    if(this.statusFetch === 0){
      this.getProductJurnal()
    }
  },

  methods: {

    classPostType(item) {
      let type = ''
      if (item.jurnal_posted_product) {
        type = 'success'
      } else {
        type = 'primary'
      }

      return type;
    },

    getData() {
      this.detailData = Object.assign({}, this.dataTable)
      this.refreshTable()
    },

    refreshTable() {
      this.loading = true
      if (this.detailData.orderitems.length > 0) {
        this.loading = false
        this.detailData.orderitems.map((row, idx) => {
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

    getProductJurnal(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/product'),
        headers: headers,
      }).then(response => {
        this.jurnalProduct = response.data.data

      }).catch(error => {
        if(typeof error.response.data.error.error === 'object'){
          let errorKey = Object.keys(error.response.data.error.error)[0];
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error[errorKey][0]
          })
        } else {
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
      })
    },

    searchFecthProduct(value){
      if(value){
        let params = {
          search_column: 'jurnal_product_name',
          search_text: value
        }

        listFecthProduct(params).then(response => {
          this.product.jurnal_product_id = ''
          this.product.jurnal_product_name = ''
          this.dataProductFetched = response.data.data
        })
      }else{
        this.product.jurnal_product_id = ''
        this.product.jurnal_product_name = ''
        this.dataProductFetched = []
      }
    },

    postProduct(item, idx){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let data = {
        product_id : item.product_id,
        product_variant_id : item.product_variant_id,
        product_combo_id : item.product_combo_id,
        deal_id : item.deal_id
      }

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/product'),
        headers: headers,
        params: data
      }).then(response => {
        this.$message({
          type: 'success',
          message: this.$lang[this.langId].success_posting
        })

        this.detailData.orderitems.map((i, index) => {
          if (index === idx) {
            this.detailData.orderitems[index].jurnal_posted_product = 1
          }
        })
        this.jurnalProduct= []
        this.getProductJurnal()
      }).catch(error => {
        if(typeof error.response.data.error.error === 'object'){
          let errorKey = Object.keys(error.response.data.error.error)[0];
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error[errorKey][0]
          })
        } else {
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
      })
    },

    selectProduct(value){
      this.jurnalProduct.map((item, idx) => {
        if(item.jurnal_product_id === value){
          this.product.jurnal_product_id = value
          this.product.jurnal_product_name = item.jurnal_product_name
        }
      });
    },

    selectProductFecth(value){
      this.dataProductFetched.map((item, idx) => {
        if(item.jurnal_product_id === value){
          this.product.jurnal_product_id = value
          this.product.jurnal_product_name = item.jurnal_product_name
        }
      });
    },

    modalMapProduct(item){
      this.mapProductId = item ? item.product_id : ''
      this.mapProductName = item ? item.product_name : ''
      this.mapProductVariant = item ? item.product_variant_id : ''
      this.mapProductCombo = item ? item.product_combo_id : ''
      this.mapProductDeal = item ? item.deal_id : ''
      let show = this.modalProduct
      this.modalProduct = show ? false : true
    },

    mapProduct(){
      this.loadingMap = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let data = {
        product_id : this.mapProductId,
        jurnal_product_id : this.product.jurnal_product_id,
        jurnal_product_name : this.product.jurnal_product_name,
        product_variant_id : this.mapProductVariant,
        product_combo_id : this.mapProductCombo,
        deal_id : this.mapProductDeal
      }

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/productmap'),
        headers: headers,
        params: data
      }).then(response => {
        this.loadingMap = false
        this.detailData.orderitems.map((i, index) => {
          if (i.product_id === this.mapProductId) {
            this.detailData.orderitems[index].jurnal_posted_product = 1
          }
        })
        this.$message({
          type: 'success',
          message: this.lang.successfully_confirmed
        })
        this.modalProduct = false
      }).catch(error => {
        if(typeof error.response.data.error.error === 'object'){
          let errorKey = Object.keys(error.response.data.error.error)[0];
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error[errorKey][0]
          })
        } else {
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
        this.loadingMap = false
      })
    },

    selectProduct(item){
      this.product = {
        jurnal_product_id: item.jurnal_product_id,
        jurnal_product_name: item.jurnal_product_name
      }
    },

    capitalize(value){
      let capitalize= '';
      if(value){
        capitalize = value[0].toUpperCase() + value.slice(1);
      }
      return capitalize;
    }
  }
}
</script>

<style lang="scss" scoped>
.product-comodities {
  padding-top: 10px;
  padding-left: 40px;
}
</style>
