<template>
  <div
    v-loading="loadings"
    class="box">
    <div class="box-header with-border create-product-header">
      <h3 class="box-title">{{ lang.add }} {{ lang.sales_discount }}</h3>
      <div class="pull-right">
        <el-button type="text" @click="cancel" class="mr-4">{{ lang.cancel }}</el-button>
        <template >
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
        </template>
        <el-button
          @click="save"
          :disabled="disabledSave"
          icon="el-icon-check"
          type="success"
          class="radius-null">
          {{ lang.save }}
        </el-button>
      </div>
    </div>

    <div class="card-body" v-loading="loading" style="margin-top: 20px">
      <el-form
        :model="data"
        :rules="dataRules"
        ref="myForm"
        class="form-sidebyside p-24"
        @keyup.native.enter="save">
        <div class="row">
          <div class="col-md-8 col-md-offset-2">
            <div class="open-create-body">
              <el-row :gutter="10">
                <el-col :sm="11">
                  <el-form-item :label="lang.active_date" :required="true">
                  </el-form-item>
                </el-col>
                <el-col :sm="13">
                  <el-form-item prop="active_date">
                    <el-date-picker
                      :required="true"
                      v-model="data.active_date"
                      type="date"
                      :placeholder="this.$lang[langId].pick_a_day">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :sm="11">
                  <el-form-item :label="lang.never_expires">
                  </el-form-item>
                </el-col>
                <el-col :sm="13">
                  <el-form-item>
                    <el-switch
                      :active-value="1"
                      :inactive-value="0"
                      v-model="data.no_expiry">
                    </el-switch>
                    <span v-if="data.no_expiry === 0">{{ lang.no }}</span>
                    <span v-if="data.no_expiry === 1">{{ lang.yes }}</span>
                  </el-form-item>

                  <el-form-item>
                    <el-date-picker
                      v-if="data.no_expiry === 0"
                      :required="true"
                      v-model="data.expiry_date"
                      type="date"
                      :placeholder="this.$lang[langId].pick_a_day"
                      :picker-options="checkDateRange">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>

              <hr/>

              <el-row :gutter="10">
                <el-col :sm="11">
                  <el-form-item :label="this.$lang[langId].min_order_price">
                    <p>{{ lang.info_discount_min_order_amount }}</p>
                  </el-form-item>
                </el-col>
                <el-col :sm="13">
                  <el-form-item>
                    <div class="el-input">
                      <!-- <money v-model="data.min_order_amount" class="el-input__inner" @input="handleCurrency('minOrder', data.min_order_amount)"></money> -->
                      <input-money v-model="data.min_order_amount" @currency="handleCurrency('minOrder', data.min_order_amount)" />
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>

              <hr/>

              <el-row :gutter="10">
                <el-col :sm="11">
                  <el-form-item :label="lang.discount_amount">
                  </el-form-item>
                </el-col>
                <el-col :sm="13">
                  <el-radio-group v-model="data.amount_type">
                    <el-radio-button label="percent">
                      % {{ this.$lang[langId].percent }}
                    </el-radio-button>
                    <el-radio-button label="amount">
                      $ {{ this.$lang[langId].nominal }}
                    </el-radio-button>
                  </el-radio-group>
                  <el-form-item v-if="data.amount_type === 'percent'"
                    prop="discount_percent">
                    <el-input type="number"
                      :placeholder="this.$lang[langId].input_number"
                      v-model="data.discount_percent"
                      @input="handleCurrency('discountPercent', data.discount_percent)">
                    </el-input>
                    <p style="margin-top: 5px; text-align: left; ">
                      {{ lang.desc_price_cut_for_reseller }},{{ $lang[langId].min_and_max_disc_percent }}
                    </p>
                  </el-form-item>
                  <el-form-item v-else>
                    <div class="el-input">
                      <input-money v-model="data.discount_amount" />
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>

              <hr/>

              <el-row :gutter="10">
                <el-col :sm="11">
                  <el-form-item :label="lang.valid_for_customer_types">
                    <p>{{ lang.info_discount_valid_for_customer_types_blank }}</p>
                  </el-form-item>
                </el-col>
                <el-col :sm="13">
                  <el-form-item prop="valid_customer_types">
                    <el-select
                      style="width: 100%;"
                      v-model="data.valid_customer_types"
                      multiple
                      filterable
                      remote
                      reserve-keyword
                      :placeholder="this.$lang[langId].please_input + lang.customer_type"
                      :remote-method="searchCustomerTypes"
                      :loading="searchingCustomerTypes">
                      <el-option
                        v-for="item in searchResultCustomerTypes"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :sm="11">
                  <el-form-item :label="lang.valid_for_brands">
                    <p>{{ lang.info_discount_valid_for_brands_blank }}</p>
                  </el-form-item>
                </el-col>
                <el-col :sm="13">
                  <el-form-item prop="valid_for_brands">
                    <el-select
                      style="width: 100%;"
                      v-model="data.valid_for_brands"
                      multiple
                      filterable
                      remote
                      reserve-keyword
                      :placeholder="this.$lang[langId].please_input + lang.brand"
                      :remote-method="searchBrand"
                      :loading="loadingSearchBrand">
                      <el-option
                        v-for="item in searchResultBrand"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import InputMoney from '@/components/InputMoneyV2'

import basicComputedMixin from '@/mixins/basicComputedMixin'

const moment = require('moment')
const today = moment().format('YYYY-MM-DD')

export default {
  props: ['loading', 'saved'],

  mixins: [basicComputedMixin],

  components: {
    InputMoney
  },

  data() {
    return {
      outlets: [
        {
          name: this.$store.state.userStores.lang.all,
          store_id: 0,
          url_id: 'all'
        }
      ],
      storeToBeSaved: [],
      loadings: false,
      searchingCustomerTypes: false,
      loadingSearchBrand: false,
      disabledSave: true,
      data: {
        active_date: new Date(today),
        no_expiry: 1,
        amount_type: 'percent'
      },
      searchResultCustomerTypes: [],
      searchResultBrand: [],
      dataRules: {
        active_date: [
          { required: true, message: 'This is required field', trigger: 'blur' }
        ]
      },
      checkDateRange: {
        disabledDate: this.disabledDueDate
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
    data: {
      handler(val) {
        if (!val.active_date) {
          this.disabledSave = true
        } else {
          this.disabledSave = false
        }
      },
      deep: true,
      immediate: true
    },
    loading: {
      handler(bool) {
        if (bool === true) {
          this.loadings = true
        } else {
          this.loadings = false
        }
      },
      deep: true
    },
    saved: {
      handler(bool) {
        if (bool === true) {
          this.disabledSave = true
        } else {
          this.disabledSave = false
        }
      },
      deep: true
    }
  },
  methods: {
    searchCustomerTypes(query) {
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
    searchBrand(query) {
      this.loadingSearchBrand = true
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
          this.loadingSearchBrand = false
          this.searchResultBrand = response.data.data.map(item => {
            return item
          })
        }).catch(() => {
          this.loadingSearchBrand = false
          this.searchResultBrand = []
        })
      }
    },
    cancel() {
      this.data = {}
      this.$emit('cancel')
    },
    save() {
      // var to_store_id = null
      // var to_allstore_id = null
      // if (this.storeToBeSaved === 0) {
      //   to_allstore_id = 1
      // } else {
      //   to_store_id = this.storeToBeSaved
      // }

      let to_store_id = this.selectedStore.store_id
      let to_allstore_id = 0
      // if (this.storeCanAccess.includes(this.selectedStore.url_id)) {
        if (this.storeToBeSaved.length && this.storeToBeSaved[0] === 0) {
          to_allstore_id = 1
        } else if (this.storeToBeSaved.length) {
          to_store_id = this.storeToBeSaved.join(',')
        }
      // }

      this.data.to_store_id = to_store_id
      this.data.to_allstore_id = to_allstore_id
      if (!this.disabledSave) {
        this.$emit('save', this.data)
      }
    },
    disabledDueDate (time) {
      return time.getTime() < this.data.active_date
    },
    handleCurrency (block, value) {
      if (block === 'minOrder') {
        if (value < 0) {
          this.data.min_order_amount = 0
        }
      } else if (block === 'discountPercent') {
        if (value < 0) {
          this.data.discount_percent = 0
        } else if (value > 100) {
          this.data.discount_percent = 100
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
  },

  mounted() {
    const stores = this.$store.state.userStores.stores
    if (stores) {
      stores.map(item => {
        if (item.is_store_active === 1) {
          this.outlets.push({ ...item })
        }
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
  }
}
</script>
