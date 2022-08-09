<template>
  
    <div class="content-wrapper">
      <section class="content">
        <el-card class="box-card">
          <div slot="header" class="table-handler-flex">
            <h4 style="flex-grow: 1;">{{ lang.add }} {{ lang.product_combo }}</h4>
            <div>
              <el-button type="text" @click="cancel">{{ lang.cancel }}</el-button>
              <el-button
                v-if="$route.params.copy"
                @click="saveCopy"
                icon="el-icon-check"
                type="primary">
                {{ lang.save }}
              </el-button>
              <el-button
                v-else
                @click="save"
                icon="el-icon-check"
                :disabled="disabledSave"
                type="primary">
                {{ lang.save }}
              </el-button>
            </div>
          </div>
          <div class="card-body" v-loading="loading">
            <el-form
              :model="data"
              :rules="dataRules"
              ref="packageForm"
              class="form-sidebyside">
              <div class="row">
                <div class="col-sm-6">
                  <div class="open-create-body">
                      <el-row :gutter="10">
                        <el-col :sm="11">
                          <el-form-item :label="$lang[langId].info_combo" class="form-subtitle">
                          </el-form-item>
                        </el-col>
                      </el-row>

                      <el-row :gutter="10">
                        <el-col :sm="11">
                          <el-form-item :label="lang.product_combo_name" :required="true">
                          </el-form-item>
                        </el-col>
                        <el-col :sm="13">
                          <el-form-item prop="name">
                            <el-input style="width: 100%;" type="text" v-model="data.name"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>

                      <el-row :gutter="10">
                        <el-col :sm="11">
                          <el-form-item :label="lang.sku_or_barcode">
                            <p>{{ lang.info_sku_or_barcode }}</p>
                          </el-form-item>
                        </el-col>
                        <el-col :sm="13">
                          <el-form-item>
                            <el-input style="width: 100%;" type="text" v-model="data.sku"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>

                      <el-row :gutter="10">
                        <el-col :sm="11">
                          <el-form-item :label="lang.product_combo_description">
                            <p>{{ lang.info_product_combo_description }}</p>
                          </el-form-item>
                        </el-col>
                        <el-col :sm="13">
                          <el-form-item>
                            <el-input style="width: 100%;" type="text" v-model="data.description"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>

                      <hr/>

                      <el-row v-if="userRole.role_id !== 'ST' && userRole.role_id !== 'SS'" :gutter="10">
                        <el-col :sm="11">
                          <el-form-item :label="lang.buy_price">
                            <p>{{ $lang[langId].cost_buying_product }}</p>
                          </el-form-item>
                        </el-col>
                        <el-col :sm="13">
                          <el-form-item>
                            <div class="el-input">
                              <input-money v-model="data.buy_price" @currency="handleCurrency('buyPrice', data.buy_price)"/>
                            </div>
                            <div v-if="selectedStore.url_id === 'setdemo1'" class="font12 color-info mt-4">{{ dataEstimatePrice.fbuy_price }}</div>
                          </el-form-item>
                        </el-col>
                      </el-row>

                      <el-row :gutter="10">
                        <el-col :sm="11">
                          <el-form-item :label="lang.market_price">
                            <p>{{ lang.info_compare_at_price }}</p>
                          </el-form-item>
                        </el-col>
                        <el-col :sm="13">
                          <el-form-item>
                            <div class="el-input">
                              <!-- <money v-model="data.market_price" class="el-input__inner" @input="handleCurrency('marketPrice', data.market_price)"></money> -->
                              <input-money v-model="data.market_price" @currency="handleCurrency('marketPrice', data.market_price)"/>
                            </div>
                            <div v-if="selectedStore.url_id === 'setdemo1'" class="font12 color-info mt-4">{{ dataEstimatePrice.fmarket_price }}</div>
                          </el-form-item>
                        </el-col>
                      </el-row>

                      <el-row :gutter="10">
                        <el-col :sm="11">
                          <el-form-item :label="lang.online_selling_price" :required="true">
                          </el-form-item>
                        </el-col>
                        <el-col :sm="13">
                          <el-form-item prop="sell_price">
                            <div class="el-input">
                              <input-money v-model="data.sell_price" @currency="handleCurrency('sellPriceOnline', data.sell_price)"/>
                            </div>
                            <div v-if="selectedStore.url_id === 'setdemo1'" class="font12 color-info mt-4">{{ dataEstimatePrice.fsell_price }}</div>
                          </el-form-item>
                        </el-col>
                      </el-row>

                      <el-row :gutter="10">
                        <el-col :sm="11">
                          <el-form-item :label="lang.selling_price_in_store" :required="true">
                            <p>{{ rootLang.info_selling_price_in_store }}</p>
                          </el-form-item>
                        </el-col>
                        <el-col :sm="13">
                          <el-form-item prop="sell_price_pos">
                            <div class="el-input">
                              <input-money v-model="data.sell_price_pos" @currency="handleCurrency('sellPriceStore', data.sell_price_pos)"/>
                            </div>
                            <div v-if="selectedStore.url_id === 'setdemo1'" class="font12 color-info mt-4">{{ dataEstimatePrice.fsell_price_pos }}</div>
                          </el-form-item>
                        </el-col>
                      </el-row>

                      <el-row :gutter="10">
                        <el-col :sm="11">
                          <el-form-item :label="$lang[langId].comission">
                            <p>{{ $lang[langId].commission_for_employees }}</p>
                          </el-form-item>
                        </el-col>
                        <el-col :sm="13">
                          <el-form-item>
                            <div class="el-input">
                              <input-money v-model="data.comission" @currency="handleCurrency('comission', data.comission)"/>
                            </div>
                          </el-form-item>
                        </el-col>
                      </el-row>

                      <el-row :gutter="10">
                        <el-col :sm="11">
                          <el-form-item :label="$lang[langId].minimum_order">
                            <p>{{ lang.info_min_order }}</p>
                          </el-form-item>
                        </el-col>
                        <el-col :sm="13">
                          <el-form-item>
                            <el-input-number v-model="data.min_order" :min="0"></el-input-number>
                          </el-form-item>
                        </el-col>
                      </el-row>

                      <el-row :gutter="10">
                        <el-col :sm="11">
                          <el-form-item :label="$lang[langId].maximum_order">
                            <p>{{ $lang[langId].info_max_order }}</p>
                          </el-form-item>
                        </el-col>
                        <el-col :sm="13">
                          <el-form-item>
                            <el-input-number v-model="data.max_order" :min="0"></el-input-number>
                          </el-form-item>
                        </el-col>
                      </el-row>

                      <el-row :gutter="10">
                        <el-col :sm="11">
                          <el-form-item :label="lang.pos_sell_price_dynamic">
                            <p>{{ lang.info_pos_sell_price_dynamic }}</p>
                          </el-form-item>
                        </el-col>
                        <el-col :sm="13">
                          <el-form-item>
                            <el-switch v-model="data.pos_sell_price_dynamic"></el-switch>
                          </el-form-item>
                        </el-col>
                      </el-row>

                      <hr/>

                      <el-row :gutter="10">
                        <el-col :sm="11">
                          <el-form-item :label="lang.ready_to_publish_for_sale">
                            <p>{{ lang.info_publish_for_sale }}</p>
                          </el-form-item>
                        </el-col>
                        <el-col :sm="13">
                          <el-form-item>
                            <el-switch
                              :active-value="1"
                              :inactive-value="0"
                              v-model="data.published">
                            </el-switch>
                          </el-form-item>
                        </el-col>
                      </el-row>

                      <el-row :gutter="10">
                        <el-col :sm="11">
                          <el-form-item :label="lang.start_sale_date">
                          </el-form-item>
                        </el-col>
                        <el-col :sm="13">
                          <el-form-item>
                            <el-date-picker
                              v-model="data.published_date"
                              type="date"
                              :placeholder="$lang[langId].pick_a_day">
                            </el-date-picker>
                          </el-form-item>
                        </el-col>
                      </el-row>
                  </div>
                </div>

                <div class="col-sm-6">
                  <el-row :gutter="10">
                    <el-col :sm="11">
                      <el-form-item :label="$lang[langId].product_in_combo" class="form-subtitle">
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row :gutter="10">
                    <el-col :sm="11">
                      <el-form-item :label="lang.product" :required="true">
                        <p>{{ lang.info_combo_products }}</p>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="13">
                      <el-form-item prop="items">
                        <input-autocomplete
                          ref="InputAutocomplete"
                          :fetch-suggestions="searchProducts"
                          :searching-products="searchingProducts"
                          :search-result-products="searchResultProducts"
                          @select="selectProduct"
                          @remove="handleRemoveProduct"
                        />
                        <el-tag 
                          v-for="(item, key) in data.itemcopy" 
                          :key="key" 
                          closable
                          @close="handleRemoveItemCopy(key)"
                          class="mt-4">
                          {{ item.product_name }}
                        </el-tag>
                        <!-- element for help reset tag -->
                        <el-input id="resettag" v-model="resettag" style="display: none"></el-input>
                        <!-- element for help reset tag -->
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-collapse v-model="isCollapsed">
                    <el-collapse-item :title="$lang[langId].info_additional" name="1">
                      <el-row :gutter="10">
                        <el-col :sm="11">
                          <el-form-item :label="lang.inventory">
                            <p>{{ lang.out_of_stock }}?</p>
                          </el-form-item>
                        </el-col>
                        <el-col :sm="13">
                          <el-form-item>
                            <el-switch v-model="data.is_out_stock"></el-switch>
                          </el-form-item>
                        </el-col>
                      </el-row>

                      <el-row :gutter="10">
                        <el-col :sm="11">
                          <el-form-item :label="lang.loyalty_point">
                          </el-form-item>
                        </el-col>
                        <el-col :sm="13">
                          <el-form-item>
                            <!-- <el-input type="number" v-model="data.loyalty_points"></el-input> -->
                            <el-input v-model="data.loyalty_points" :placeholder="$lang[langId].input_number" type="number" @input="handleCurrency('loyaltiPoint', data.loyalty_points)"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>

                      <el-row :gutter="10">
                        <el-col :sm="11">
                          <el-form-item :label="lang.shipping">
                            <p><strong>{{ lang.require_shipping }}?</strong><br/>{{ lang.info_require_shipping }}</p>
                          </el-form-item>
                        </el-col>
                        <el-col :sm="13">
                          <el-form-item>
                            <el-switch v-model="data.require_shipping"></el-switch>
                          </el-form-item>
                        </el-col>
                      </el-row>

                      <el-row :gutter="10">
                        <el-col :sm="11">
                          <el-form-item :label="lang.non_taxable">
                            <p><strong>{{ $lang[langId].item_free_taxe }}</strong></p>
                          </el-form-item>
                        </el-col>
                        <el-col :sm="13">
                          <el-form-item>
                            <el-switch v-model="data.non_taxable"></el-switch>
                          </el-form-item>
                        </el-col>
                      </el-row>

                      <el-row :gutter="10">
                        <el-col :sm="11">
                          <el-form-item :label="lang.point_of_sale">
                            <p><strong>{{ lang.hide_in_pos }}?</strong><br/>{{ lang.info_hide_in_pos }}</p>
                          </el-form-item>
                        </el-col>
                        <el-col :sm="13">
                          <el-form-item>
                            <el-switch v-model="data.pos_hidden" :active-value="0" :inactive-value="1"></el-switch>
                          </el-form-item>
                        </el-col>
                      </el-row>

                      <el-row :gutter="10">
                        <el-col :sm="11">
                          <el-form-item :label="lang.seo">
                            <p><strong>{{ lang.meta_keywords }}</strong><br/>{{ lang.info_meta_keywords }}</p>
                          </el-form-item>
                        </el-col>
                        <el-col :sm="13">
                          <el-form-item>
                            <el-input
                              v-model="tmp.meta_keyword"
                              :placeholder="$lang[langId].please_input + lang.meta_keywords"
                              clearable
                              @change="handleAddMetaKeywords">
                            </el-input>

                            <p class="wrapper-tags">
                            <el-tag
                              v-for="(item, key) in data.meta_keywords"
                              :key="key"
                              closable
                              @close="handleRemoveMetaKeyword(key)">
                              {{ item }}
                            </el-tag>
                          </p>
                          </el-form-item>
                        </el-col>
                      </el-row>

                      <el-row :gutter="10">
                        <el-col :sm="11">
                          <el-form-item :label="lang.meta_description">
                            <p><strong>{{ lang.meta_description }}</strong><br/>{{ lang.info_meta_description }}</p>
                          </el-form-item>
                        </el-col>
                        <el-col :sm="13">
                          <el-form-item>
                            <el-input
                              type="textarea"
                              autosize
                              clearable
                              :placeholder="$lang[langId].please_input+lang.meta_description"
                              v-model="data.meta_description">
                            </el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </div>
            </el-form>
          </div>
        </el-card>
      </section>
    </div>
  
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import InputMoney from '@/components/InputMoneyV2'
import InputAutocomplete from '@/components/modules/InputAutocomplete'

import basicComputedMixin from '@/mixins/basicComputedMixin'

import { fetchSingle as fetchPackage, copyPackage as saveCopyPackage, estimatePrice } from '@/api/catalog/packageproduct'

const moment = require('moment')
// const today = moment().format('YYYY-MM-DD')

export default {
  components: {
    InputMoney,
    InputAutocomplete
  },

  mixins: [basicComputedMixin],

  data() {
    var validateItems = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('This is required field'))
      } else {
        if (this.data.items !== '') {
          this.$refs.packageForm.validateField('items')
        }
        callback()
      }
    }
    var validatePrice = (rule, value, callback) => {
      console.log('vv', value)
      if (value === null) {
        callback(new Error(this.rootLang.required_field_n_cant_0))
      } else {
        // if (this.data.items !== '') {
        //   this.$refs.packageForm.validateField('items')
        // }
        callback()
      }
    }
    return {
      loading: false,
      searchingProducts: false,
      // disabledSave: true,
      data: {
        min_order: 0,
        max_order: 0,
        meta_keywords: [],
        name: '',
        items: []
      },
      tmp: {
        meta_keyword: ''
      },
      searchResultProducts: [],
      isCollapsed: '',
      dataRules: {
        name: [
          { required: true, message: 'This is required field', trigger: 'blur' },
          { min: 2, message: 'Length should min. 2', trigger: 'blur' }
        ],
        sell_price: [
          { required: true, message: 'This is required field', trigger: 'blur', validator: validatePrice }
        ],
        sell_price_pos: [
          { required: true, message: 'This is required field', trigger: 'blur' }
        ],
        items: [
          { validator: validateItems, trigger: 'blur' }
        ]
      },
      resettag: '',
      dataEstimatePrice: {}
    }
  },

  computed: {
    userRole() {
      const selectedStore = this.$store.getters.selectedStore
      return {
        role_id: selectedStore.role_id,
        role_name: selectedStore.role_name,
        is_pos_only: selectedStore.is_pos_only,
        is_mobile: selectedStore.is_mobile
      }
    },
    
    disabledSave () {
      if (this.data.name !== '' && this.data.items.length && this.data.sell_price !== 0 && this.data.sell_price_pos >= 0) {
        return false
      } else {
        return true
      }
    }
  },

  watch: {
    // data: {
    //   handler(val) {
    //     // console.log(this.$refs)
    //     if (val.name !== '' && (val.items && val.items.length > 0)) {
    //       this.disabledSave = false
    //     } else {
    //       this.disabledSave = true
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },

  methods: {
    searchProducts(query) {
      //
      this.searchingProducts = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search_column: 'name',
        search_text: query,
        sort_column: 'name',
        sort_type: 'desc',
        per_page: 50
      }
      if (query.length > 0) {
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'productvariantsearch'),
          headers,
          params: params
        }).then(response => {
          this.searchingProducts = false
          this.searchResultProducts = response.data.data.map(item => {
            return item
          })
        }).catch(() => {
          this.searchingProducts = false
          this.searchResultProducts = []
        })
      }
    },

    save() {
      this.loading = true
      // this.disabledSave = true

      let data = Object.assign({}, this.data)
      data.published_date = moment(data.published_date).format('YYYY-MM-DD')
      data.items = data.items.join(',')
      data.meta_keywords = data.meta_keywords.join(',')

      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productcombo'),
        headers,
        data
      }).then(response => {
        this.loading = false
        // this.disabledSave = false
        this.$message({
          type: 'success',
          message: 'Success'
        })
        this.$router.push({path: '/catalog/package/' + response.data.data.id})
      }).catch(error => {
        this.loading = false
        // this.disabledSave = false
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
      })
    },

    cancel() {
      this.$router.push({path: '/catalog/package'})
    },

    handleCurrency(block, value) {
      if (block === 'sellPriceStore') {
        if (value < 0) {
          this.data.sell_price_pos = 0
        }
      } else if (block === 'sellPriceOnline') {
        if (value < 0) {
          this.data.sell_price = 0
        }
      } else if (block === 'buyPrice') {
        if (value < 0) {
          this.data.buy_price = 0
        }
      } else if (block === 'marketPrice') {
        if (value < 0) {
          this.data.market_price = 0
        }
      } else if (block === 'comission') {
        if (value < 0) {
          this.data.comission = 0
        }
      } else if (block === 'loyaltiPoint') {
        if (value < 0) {
          this.data.loyalty_points = null
        }
      }
    },

    handleAddMetaKeywords() {
      if (this.tmp.meta_keyword) {
        this.data.meta_keywords.push(this.tmp.meta_keyword)
        this.tmp.meta_keyword = ''
      }
    },

    handleRemoveMetaKeyword(key) {
      this.data.meta_keywords.splice(key, 1)
    },

    handleRemoveItemCopy(key) {
      console.log(key)
      this.data.itemcopy.splice(key, 1)
      this.resettag = 'reset'
    },
    
    selectProduct(item) {
      console.log(item)
      this.data.items = item
      if (this.data.items.length) {
        this.getEstimatePrice()
      }
    },

    handleRemoveProduct (item) {
      console.log('aa', item)
      this.getEstimatePrice()
    },

    // copy package section
    loadData() {
      this.loading = true

      fetchPackage(this.$route.params.id)
        .then(response => {
          // this.categories = response.data.data
          this.data = response.data.data
          this.data.meta_keywords = this.data.meta_keywords.split(',')
          let item = []
          this.data.items.data.map(i => {
            if (i.variant.length) {
              item.push({
                product_id: i.product_id + '|' + i.product_variant_id,
                product_name: i.product_name + ' - ' + i.product_variant_name
              })
            } else {
              item.push({
                product_id: i.product_id,
                product_name: i.product_name
              })
            }
          })
          this.data.itemcopy = item
          console.log('split', )
          this.data.items = []
          // this.selectProduct(item)
          this.loading = false
        })
        .catch(error => {
          console.log(error)
          if (error.response.data.error.status_code !== 404) {
            this.$notify({
              type: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error
            })
          }
          this.loading = false
        })
    },

    saveCopy() {
      this.loading = true
      // this.disabledSave = true

      let data = Object.assign({}, this.data)
      data.published_date = moment(data.published_date).format('YYYY-MM-DD')
      let item = data.items.length ? data.items : []
      if (data.itemcopy.length) {
        data.itemcopy.map(i => {
          item.push(i.product_id)
        })
      }
      console.log('item', item)
      data.items = item.join(',')
      data.meta_keywords = data.meta_keywords.join(',')
      // data.store_id = this.selectedStore.store_id
      data.product_combo_id = this.$route.params.id

      saveCopyPackage(data).then(response => {
        this.loading = false
        // this.disabledSave = false
        this.$message({
          type: 'success',
          message: 'Success'
        })
        this.$router.push({path: '/catalog/package'})
      }).catch(error => {
        this.loading = false
        // this.disabledSave = false
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
      })
    },

    getEstimatePrice () {
      let data = {
        product_ids: [ ...this.data.items]
      }
      this.dataEstimatePrice = {}
      estimatePrice(data).then(response => {
        // this.disabledSave = false
        this.dataEstimatePrice = { ...response.data.data}
      }).catch(error => {
        // this.disabledSave = false
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
      })
    }
  },

  mounted() {
    if (this.$route.params.copy) {
      this.loadData()
    }
    this.data.pos_hidden = 0
  }
}
</script>
