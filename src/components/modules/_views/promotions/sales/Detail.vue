<template>
  <div v-loading="loadingsDetail">
    <div class="row">
      <div class="col-md-7">
        <el-card v-loading="loading" class="box">
          <div class="box-header with-border create-product-header">
            <h4 class="box-title">{{ lang.discount_detail }}</h4>
            <div v-if="!isEditing" class="pull-right mb-12">
              <el-button size="small" plain type="primary" @click="back">{{ lang.back }}</el-button>
              <button-action-authenticated
                :permission="['promotion/discountsales', 'edit']"
                icon="el-icon-edit"
                type="primary"
                size="small"
                @click="edit">
                {{ lang.edit }}
              </button-action-authenticated>
            </div>
            <div v-else class="pull-right mb-12">
              <el-button type="text" size="small" @click="cancelEdit">{{ lang.cancel }}</el-button>
              <!-- <template v-if="storeCanAccess.includes(selectedStore.url_id)">
                <div class="row flex-container">
                  <div>{{ $lang[langId].save_at }}:</div>
                  <el-select v-model="storeToBeSaved" multiple collapse-tags @change="handleSelectAll">
                    <el-option
                      v-for="item in outlets"
                      :key="item.store_id"
                      :label="item.name"
                      :value="item.store_id">
                    </el-option>
                  </el-select>
                </div>
              </template> -->
              <el-button
                :disabled="disabledButton"
                icon="el-icon-check"
                type="success"
                size="small"
                @click="saveEdit">
                {{ lang.save }}
              </el-button>
            </div>
          </div>

          <div class="card-body mt-24">
            <div class="clearfix">
              <div class="pull-left discount-detail">
                <section class="detail-section">
                  <div class="detail-item">
                    <div class="detail-label">
                      <small>{{ lang.min_order_amount }}</small>
                    </div>
                    <div class="detail-value">
                      <template v-if="isEditing">
                        <div class="el-input">
                          <!-- <money v-model="tmp.min_order_amount" class="el-input__inner" @change.native="handleCurrency('minOrder', tmp.min_order_amount)"></money> -->
                          <input-money v-model="tmp.min_order_amount" @currency="handleCurrency('minOrder', tmp.min_order_amount)" />
                        </div>
                      </template>
                      <template v-else>
                        {{data.fmin_order_amount}}
                      </template>
                    </div>
                  </div>

                  <div class="detail-item">
                    <div class="detail-label">
                      <small>{{ lang.active_date }}</small>
                    </div>
                    <div class="detail-value">
                      <template v-if="isEditing">
                        <el-date-picker
                          v-model="tmp.active_date"
                          type="date"
                          :placeholder="$lang[langId].pick_a_day">
                        </el-date-picker>
                      </template>
                      <template v-else>
                        {{data.active_date}}
                      </template>
                    </div>
                  </div>

                  <div class="detail-item">
                    <div class="detail-label">
                      <small>{{ lang.end_date }}</small>
                    </div>
                    <div class="detail-value">
                      <template v-if="isEditing">
                        <div>
                          <label>{{ lang.never_expires }}</label>
                          <el-switch
                            :active-value="1"
                            :inactive-value="0"
                            v-model="tmp.no_expiry">
                          </el-switch>
                        </div>
                        <el-date-picker
                          v-if="tmp.no_expiry === 0"
                          v-model="tmp.expiry_date"
                          type="date"
                          :placeholder="$lang[langId].pick_a_day"
                          :picker-options="checkDateRange">
                        </el-date-picker>
                      </template>
                      <template v-else>
                        <template v-if="data.no_expiry === 1">
                          {{ $lang[langId].no_expiry }}
                        </template>
                        <template v-else>
                          {{data.expiry_date}}
                        </template>
                      </template>
                    </div>
                  </div>
                </section><!-- .detail-section -->
              </div><!-- .col-sm-8 -->
              <div class="pull-left">
                <div class="discount-badge" v-if="!isEditing">
                  <span class="discount-badge--title">{{ lang.discount_amount }}</span>
                  <span class="discount-badge--content">{{data.fdiscount}}</span>
                </div>
                <div v-else>
                  <el-radio-group v-model="amountType">
                    <el-radio-button label="percent">
                      % {{ $lang[langId].percent }}
                    </el-radio-button>
                    <el-radio-button label="amount">
                      $ {{ $lang[langId].nominal }}
                    </el-radio-button>
                  </el-radio-group>
                  <template v-if="amountType === 'percent'">
                    <el-input type="number"
                      :placeholder="$lang[langId].input_number"
                      v-model="tmp.discount_percent"
                      @change="handleCurrency('discountPercent', tmp.discount_percent)">
                    </el-input>
                  </template>
                  <template v-else>
                    <div class="el-input">
                      <input-money v-model="tmp.discount_amount" />
                    </div>
                  </template>
                </div>
              </div><!-- .col-sm-4 -->
            </div>
          </div>

          <div class="card-footer">
            <button-action-authenticated
              :permission="['promotion/discountsales', 'destroy']"
              :disabled="disabledButton"
              type="bordered-danger"
              @click="remove"
              icon="el-icon-delete">
              {{ $lang[langId].delete }}
            </button-action-authenticated>
          </div>
        </el-card>
      </div>

      <div class="col-md-5">
        <div v-loading="loadingCustomerTypes">
          <el-card>
            <div slot="header" class="clearfix">
              <h4>{{ lang.valid_for_customers }}</h4>
            </div>

            <div class="card-body">
              <ul v-if="!isEditing"
                class="list-unstyled list-stripped list-table">
                <li
                  v-for="(item, idx) in data.valid_customer_types"
                  :key="idx"
                  class="list-item-relative">
                  <strong>{{item.name}}</strong>
                </li>
              </ul>
              <ul v-else
                class="list-unstyled list-stripped list-table">
                <li
                  v-for="(item, idx) in tmp.valid_customer_types"
                  :key="idx"
                  class="list-item-relative">
                  <strong>{{item.name}}</strong>
                  <span class="absolute-right">
                    <el-button
                      @click="removeValidFor('customer', idx)"
                      type="text">
                      <i class="el-icon-close"></i>
                    </el-button>
                  </span>
                </li>
              </ul>
              <div v-if="isEditing" class="add-discount-customer">
                <el-select
                  style="width: 100%;"
                  v-model="fresh.valid_customer_types"
                  multiple
                  filterable
                  remote
                  reserve-keyword
                  :placeholder="lang.add_customer_type"
                  :remote-method="searchCustomerTypes"
                  :loading="searchingCustomerTypes">
                  <el-option
                    v-for="(item) in searchResultCustomerTypes"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </div>
          </el-card>
        </div>

        <div style="margin-top: 10px;" v-loading="loadingBrands">
          <el-card>
            <div slot="header" class="clearfix">
              <h4>{{ lang.valid_for_brands }}</h4>
            </div>

            <div class="card-body">
              <ul v-if="!isEditing"
                class="list-unstyled list-stripped list-table">
                <li
                  v-for="(item, idx) in data.valid_for_brands"
                  :key="idx"
                  class="list-item-relative">
                  <strong>{{item.name}}</strong>
                </li>
              </ul>
              <ul v-else
                class="list-unstyled list-stripped list-table">
                <li
                  v-for="(item, idx) in tmp.valid_for_brands"
                  :key="idx"
                  class="list-item-relative">
                  <strong>{{item.name}}</strong>
                  <span class="absolute-right">
                    <el-button
                      @click="removeValidFor('brand', idx)"
                      type="text">
                      <i class="el-icon-close"></i>
                    </el-button>
                  </span>
                </li>
              </ul>
              <div v-if="isEditing" class="add-discount-customer">
                <el-select
                  style="width: 100%;"
                  v-model="fresh.valid_for_brands"
                  multiple
                  filterable
                  remote
                  reserve-keyword
                  :placeholder="lang.add_brand"
                  :remote-method="searchBrands"
                  :loading="loadingBrands">
                  <el-option
                    v-for="(item) in searchResultBrands"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { baseApi } from 'src/http-common'
import axios from 'axios'
import InputMoney from '@/components/InputMoneyV2'

import basicComputedMixin from '@/mixins/basicComputedMixin'

var moment = require('moment')
import { checkCustomPermission } from '@/mixins/checkCustomPermission'

export default {
  props: ['loadingDetail', 'formData'],
  mixins: [checkCustomPermission, basicComputedMixin],
  components: {
    draggable,
    InputMoney
  },
  data() {
    return {
      loadingsDetail: false,
      loading: false,
      isEditing: false,
      isEditingCustomerTypes: false,
      isEditingBrands: false,
      loadingCustomerTypes: false,
      loadingBrands: false,
      disabledButton: false,
      searchingCustomerTypes: false,
      searchResultCustomerTypes: [],
      searchResultBrands: [],
      data: {},
      tmp: {},
      fresh: {
        valid_customer_types: [],
        valid_for_brands: []
      },
      amountType: '',
      checkDateRange: {
        disabledDate: this.disabledDueDate
      },
      outlets: [
        {
          name: this.$store.state.userStores.lang.all,
          store_id: 0,
          url_id: 'all'
        }
      ],
      storeToBeSaved: [],
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
    storeCanAccess () {
      return [
        'setdemo1',
        'allinolsera2',
        'meenumjagakarsa', 
        'meenummekarsari', 
        'meenumcipayung', 
        'meenumgalaxy', 
        'meenumjatiasih', 
        'meenumcileungsi', 
        'meenumdukuhzamrud', 
        'meenumjoyomartono', 
        'meenumjatimakmur', 
        'meenumsawangan', 
        'meenumarundina', 
        'meenumkaliabang', 
        'meenumjatirasa', 
        'meenummgt', 
        'meenumgasalam', 
        'meenumhalim', 
        'meenumciangsana', 
        'meenumkayuringin', 
        'meenumnusantaradepok', 
        'meenumrawalumbu', 
        'meenumcilincing', 
        'meenumunsikakarawang', 
        'meenumkayutinggi', 
        'meenummunjuljayapurwakarta', 
        'meenumpisangan', 
        'meenumtarumajaya', 
        'meenumsemarang', 
        'meenumcibitung', 
        'meenumcirebon', 
        'meenummanukansurabaya', 
        'meenumkeputihsurabaya', 
        'meenumcentex', 
        'meenumkelapadua', 
        'meenumregency', 
        'meenumpuricendana', 
        'meenumjatikramat', 
        'meenumlubangbuaya', 
        'meenumtegal', 
        'meenumpermatacibubur', 
        'meenumperumnascirebon', 
        'meenumtugumacan', 
        'meenumcikarangfestival', 
        'meenumkarawangkosambi', 
        'meenumtegalparang', 
        'meenumbojonggede', 
        'meenumutankayu', 
        'meenumdepoktimur', 
        'meenumcirebonmegu', 
        'meenumkembangan', 
        'meenumwanaherang', 
        'meenumtambunutara', 
        'meenumgriyabukitjaya', 
        'meenumwismajaya', 
        'meenumcondet', 
        'meenumgongseng', 
        'meenumpondokmelati', 
        'meenumgdcdepok', 
        'meenumpekapuran', 
        'meenumtaposdepok', 
        'meenumbekasitimurregency', 
        'meenumbbm', 
        'meenumcikaret', 
        'meenumgrandkahuripan', 
        'meenumpekanbarudurian', 
        'meenumpekanbarurambutan', 
        'meenumkpmakasar', 
        'meenumfatmawati', 
        'meenumbumimutiara', 
        'meenumjatiwaringin', 
        'meenumsumurbatu', 
        'meenumpurigading', 
        'meenumsetucibitung', 
        'meenumsirsakjagakarsa', 
        'meenumrawabebek', 
        'meenumcikarangregency'
        ]
    }
  },

  watch: {
    amountType: {
      handler(val) {
        if (this.data.discount_amount > 0) {
          this.amountType = 'amount'
          this.tmp.discount_percent = 0
        } else {
          this.amountType = 'percent'
          this.tmp.discount_amount = 0
        }
        if (val === 'amount') {
          this.amountType = 'amount'
          this.tmp.discount_percent = 0
        } else {
          this.amountType = 'percent'
          this.tmp.discount_amount = 0
        }
      },
      immediate: true
    },
    loadingDetail: {
      handler(bool) {
        if (bool === true) {
          this.loadingsDetail = true
        } else {
          this.loadingsDetail = false
        }
      },
      deep: true
    },
    formData: {
      handler(data) {
        this.data = {...data}
        this.data.discount_amount = Number.parseInt(this.data.discount_amount, 0)
        this.data.discount_rate = Number.parseInt(this.data.discount_rate, 0)
        if (this.data.discount_rate > 0) {
          this.amountType = 'percent'
        } else {
          this.amountType = 'amount'
        }
      },
      deep: true,
      immediate: true
    }
  },

  beforeMount() {
    this.handleCustomPermissionSinglePage('promotion/discountsales', 'show')
  },

  mounted() {
    const stores = this.$store.state.userStores.stores
    if (stores) {
      stores.map(item => {
        this.outlets.push({ ...item })
      })
    }

    const store = this.$store.getters.selectedStore
    if (store) {
      if (store.constructor === Array) {
        this.storeToBeSaved[0] = 0
      } else {
        this.storeToBeSaved[0] = store.store_id
      }
    }
  },

  methods: {
    back() {
      this.data = {}
      this.$emit('back')
    },
    searchCustomerTypes(query) {
      //
      this.searchingCustomerTypes = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search: query
      }
      if (query.length > 0) {
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'customertype'),
          headers: headers,
          params: params
        }).then(response => {
          this.searchingCustomerTypes = false
          this.searchResultCustomerTypes = response.data.data.map(item => {
            return item
          })
        }).catch(() => {
          this.searchingCustomerTypes = false
          this.searchResultCustomerTypes = []
        })
      }
    },
    searchBrands(query) {
      //
      this.loadingBrands = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search: query
      }
      if (query.length > 0) {
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'brand'),
          headers: headers,
          params: params
        }).then(response => {
          this.loadingBrands = false
          this.searchResultBrands = response.data.data.map(item => {
            return item
          })
        }).catch(() => {
          this.loadingBrands = false
          this.searchResultBrands = []
        })
      }
    },
    remove() {
      this.$emit('remove', this.data)
    },
    edit() {
      //
      this.tmp = Object.assign({}, this.data)
      this.tmp.min_order_amount = Number.parseInt(this.tmp.min_order_amount, 0)
      // this.tmp.discount_amount = Number.parseInt(this.tmp.discount_amount, 0)
      // this.tmp.discount_rate = Number.parseInt(this.tmp.discount_rate, 0)
      this.tmp.discount_percent = Number.parseInt(this.tmp.discount_percent, 0)
      this.tmp.discount = Number.parseInt(this.tmp.discount, 0)
      this.tmp.active_date = moment(this.tmp.active_date)
      this.tmp.expiry_date = moment(this.tmp.active_date)
      if (this.tmp.discount_rate > 0) {
        this.tmp.discount_percent = this.tmp.discount
      }
      this.isEditing = true
      console.log(this.tmp)
    },
    saveEdit() {
      //
      this.loading = true
      let promise = new Promise((resolve, reject) => {
        this.update(resolve, reject)
      })
      promise.then(response => {
        this.isEditing = false
        this.loading = false
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loading = false
      })
    },
    cancelEdit() {
      this.isEditing = false
    },
    editValidFor(block) {
      this.tmp = Object.assign({}, this.data)
      if (block === 'customer') {
        this.isEditingCustomerTypes = true
      } else {
        this.isEditingBrands = true
      }
    },
    cancelValidFor(block) {
      if (block === 'customer') {
        this.isEditingCustomerTypes = false
      } else {
        this.isEditingBrands = false
      }
      this.tmp = Object.assign({}, this.data)
    },
    saveValidFor(block) {
      if (block === 'customer') {
        this.loadingCustomerTypes = true
        let promise = new Promise((resolve, reject) => {
          this.update(resolve, reject)
        })
        promise.then(response => {
          this.isEditingCustomerTypes = false
          this.loadingCustomerTypes = false
        }).catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.loadingCustomerTypes = false
        })
      } else {
        this.loadingBrands = true
        let promise = new Promise((resolve, reject) => {
          this.update(resolve, reject)
        })
        promise.then(response => {
          this.isEditingBrands = false
          this.loadingBrands = false
        }).catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.loadingBrands = false
        })
      }
    },
    update(resolve, reject) {
      let obj = Object.assign({}, this.tmp)
      if (this.fresh.valid_customer_types.length > 0) {
        this.fresh.valid_customer_types.map(item => {
          obj.valid_customer_types.push({id: item})
        })
      }
      obj.valid_customer_types = obj.valid_customer_types.map(item => {
        return item.id
      })
      obj.valid_customer_types = obj.valid_customer_types.join(',')
      if (this.fresh.valid_for_brands.length > 0) {
        this.fresh.valid_for_brands.map(item => {
          obj.valid_for_brands.push({id: item})
        })
      }
      obj.valid_for_brands = obj.valid_for_brands.map(item => {
        return item.id
      })
      obj.valid_for_brands = obj.valid_for_brands.join(',')
      obj.active_date = moment(obj.active_date).format('YYYY-MM-DD')
      obj.expiry_date = moment(obj.expiry_date).format('YYYY-MM-DD')

      let to_store_id = this.selectedStore.store_id
      let to_allstore_id = 0
      // if (this.storeCanAccess.includes(this.selectedStore.url_id)) {
      //   if (this.storeToBeSaved.length && this.storeToBeSaved[0] === 0) {
      //     to_allstore_id = 1
      //   } else if (this.storeToBeSaved.length) {
      //     to_store_id = this.storeToBeSaved.join(',')
      //   }
      // }

      let data = {
        to_allstore_id: to_allstore_id,
        to_store_id: to_store_id,
        active_date: obj.active_date,
        valid_customer_types: obj.valid_customer_types,
        valid_for_brands: obj.valid_for_brands,
        discount_amount: obj.discount_amount,
        discount_percent: obj.discount_percent,
        min_order_amount: obj.min_order_amount
      }
      // console.log('trace', typeof data.discount_percent)
      if (typeof data.discount_percent === 'string') {
        data.discount_percent = data.discount_percent.replace(',','')
      }
      if (obj.no_expiry === 1) {
        data.no_expiry = 1
      } else {
        data.expiry_date = obj.expiry_date
        data.no_expiry = 0
      }
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'discountsales/' + this.data.id),
        headers,
        data
      }).then(response => {
        this.data = response.data.data
        this.fresh.valid_customer_types = []
        this.fresh.valid_for_brands = []
        resolve(response)
        this.$message({
          type: 'success',
          message: 'Success'
        })
      }).catch(error => {
        reject(error)
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    removeValidFor(block, idx) {
      if (block === 'customer') {
        this.tmp.valid_customer_types.splice(idx, 1)
      } else {
        this.tmp.valid_for_brands.splice(idx, 1)
      }
    },
    disabledDueDate (time) {
      return time.getTime() < this.tmp.active_date
    },
    handleCurrency (block, value) {
      if (block === 'minOrder') {
        if (value < 0) {
          this.tmp.min_order_amount = 0
        }
      } else if (block === 'discountPercent') {
        if (value < 0) {
          this.tmp.discount_percent = 0
        } else if (value > 100) {
          this.tmp.discount_percent = 100
        }
      }
    },

    handleSelectAll (data) {
      if (data.length) {
        data.map(i => {
          if (i === 0) {
            this.storeToBeSaved = [0]
          }
        })
      }
    },
  }
}
</script>
