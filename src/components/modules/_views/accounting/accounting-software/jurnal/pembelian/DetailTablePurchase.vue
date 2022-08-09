<template>
  <el-card class="box-card">
    <div slot="header" class="flex-container flex-container--wrap">
      <h3 class="box-title">{{ lang.order_item }}</h3>
    </div>

    <div class="card-body">
      <div v-if="!showTable" class="no-product text-center">
        <p>{{ $lang[langId].no_product }}</p>
        <img src="../../../../../../../../static/img/no-data.svg" alt="No Data Picture">
      </div>

      <div v-else>
        <div class="table-responsive">
          <table class="table-orderitems table table-striped">
            <thead>
              <tr>
                <th width="200" class="description">{{ lang.description }}</th>
                <th width="50">{{ lang.qty }}</th>
                <th width="100">{{ lang.price }} ({{ detailData.currency_id }})</th>
                <th width="100" class="total">{{ lang.total_price }} ({{ detailData.currency_id }})</th>
                <th width="50">{{lang.tax}}</th>
                <th width="30" style="text-align: center">{{ $lang[langId].action }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, key) in detailData.purchaseitems" :key="key">
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
                    <el-input-number
                      v-if="detailData.status === 'P' && detailData.is_paid == 0"
                      v-model="editTable.qty"
                      :min="0"
                      controls-position="right"
                    />
                    <el-input disabled v-else v-model="item.qty" />
                  </div>
                  <div v-else style="line-height: 3;"> {{item.qty}} {{item.product_uom}} </div>
                </td>
                <td valign="middle" align="left">
                  <div v-if="rowState[key].edited">
                    <!-- <money
                      v-if="detailData.status === 'P' && detailData.is_paid == 0"
                      v-model="editTable.price"
                      class="el-input__inner"
                    /> -->
                    <input-money v-if="detailData.status === 'P' && detailData.is_paid == 0" v-model="editTable.price" />
                    <el-input disabled v-else v-model="editTable.price" />
                  </div>
                  <div v-else style="line-height: 3;"> {{item.fprice}} </div>
                </td>
                <td valign="middle" align="left" style="line-height: 3;">{{item.famount}}</td>
                <td valign="middle" align="left">{{item.line_tax_name}}</td>
                <td width="160" style="text-align: center">
                  <el-dropdown size="mini" split-button :type="classPostType(item)" style="float: right;">
                    {{item.jurnal_posted_product ? $lang[langId].posted : $lang[langId].unposted}}
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
                <td style="text-align: right;" class="ipad-style">{{ lang.order_amount }}</td>
                <th>{{ detailData.total_item_qty }}</th>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>

              <tr>
                <td style="text-align: right;" class="ipad-style">{{ lang.subtotal }}</td>
                <td></td>
                <td></td>
                <th>{{ detailData.fsubtotal }}</th>
                <td></td>
                <td></td>
              </tr>

              <tr>
                <td style="text-align: right;" class="ipad-style">{{ lang.discount }}</td>
                <td></td>
                <td></td>
                <th>{{ detailData.fdiscount_amount }}</th>
                <td></td>
                <td></td>
              </tr>

              <tr>
                <td style="text-align: right;" class="ipad-style">{{ lang.tax }}</td>
                <td></td>
                <td></td>
                <th>{{ detailData.ftax_amount }}</th>
                <td></td>
                <td></td>
              </tr>
              
              <tr>
                <td style="text-align: right;" class="ipad-style">{{ $lang[langId].rounded }}</td>
                <td></td>
                <td></td>
                <th>{{ detailData.frounded_amount }}</th>
                <td></td>
                <td></td>
              </tr>

              <tr>
                <td style="text-align: right;" class="ipad-style">{{ lang.shipping_cost }}</td>
                <td></td>
                <td></td>
                <th>{{ detailData.fshipping_cost }}</th>
                <td></td>
                <td></td>
              </tr>

              <tr>
                <td colspan="12" style="padding: 0 0 0 0;"></td>
              </tr>

              <tr style="background-color: #fff;">
                <td style="text-align: right;" class="ipad-style">{{ lang.total_due }}</td>
                <td></td>
                <td></td>
                <th>{{ detailData.ftotal_amount }}</th>
                <td></td>
                <td></td>
              </tr>

              <tr>
                <td style="text-align: right;" class="ipad-style">{{ lang.paid_amount }}</td>
                <td></td>
                <td></td>
                <th>{{ detailData.fpaid_amount }}</th>
                <td></td>
                <td></td>
              </tr>

              <tr v-for="(item, key) in detailData.payments" :key="key">
                <td style="text-align: right;" class="ipad-style">{{ lang.payment }}</td>
                <th>{{item.fpayment_date}}</th>
                <td></td>
                <th>{{item.fpayment_amount}}</th>
                <td></td>
                <td></td>
              </tr>

              <tr v-if="!detailData.is_paid">
                <td style="text-align: right;" class="ipad-style">{{ lang.outstanding_payment }}</td>
                <td></td>
                <td></td>
                <th >{{ detailData.foutstanding_amount }}</th>
                <td></td>
                <td></td>
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
import { listFecthProduct } from '@/api/accounting-3rd/jurnalid'

export default {
  name: 'PurchaseTable',
  props: {
    dataTable: {
      default: null,
      type: Object
    },
    editShow: {
      default: true,
      type: Boolean
    },
    statusFetch: {
      type: Number,
      default: 0
    },
    fecthSupplier: {
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
      searchQuery: '',
      detailData: {},
      showEdit: true,
      showTable: true,
      rowState: [],
      mapProductId: '',
      mapProductName: '',
      mapProductVariant: '',
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
      }
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
    }
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
        product_combo_id : 0,
        deal_id : 0
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
        this.detailData.purchaseitems.map((i, index) => {
          if (index === idx) {
            this.detailData.purchaseitems[index].jurnal_posted_product = 1
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
        product_combo_id : 0,
        deal_id : 0
      }

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/productmap'),
        headers: headers,
        params: data
      }).then(response => {
        this.loadingMap = false
        this.detailData.purchaseitems.map((i, index) => {
          if (i.product_id === this.mapProductId) {
            this.detailData.purchaseitems[index].jurnal_posted_product = 1
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

    showEditForm() {
      this.showEdit = this.editShow
    },

    getData() {
      this.detailData = Object.assign({}, this.dataTable)
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
