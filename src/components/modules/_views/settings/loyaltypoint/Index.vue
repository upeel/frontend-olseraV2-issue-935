<template>
  <div
    v-loading="loading"
    class="content-wrapper">
    <section
      v-if="data.use_new_version_lpoint || $store.state.useNewLPoint === 1"
      class="content sales-list no-subpage">
      <el-alert
        :title="lang.info_for_pos_v2"
        :closable="false"
        show-icon
        class="color-primary mb-24"
        style="background: #E4F8FF">
      </el-alert>

      <el-card class="box-card">
        <!-- <div slot="header">
          <h4>{{ lang.activate_loyalty_point }}</h4>
        </div> -->

        <div class="card-body">
          <div class="flex-container">
            <div class="full-width font-18">{{ lang.loyalty_point }}</div>
            <div class="text-right flex-container">
              <el-button v-if="data.with_lpoint" type="text" class="mr-12" @click="handleEdit">
                <svg-icon icon-class="settings" />
              </el-button>
              <el-button v-else disabled type="text" class="mr-12">
                <svg-icon icon-class="settings" />
              </el-button>
              <el-switch
                v-model="data.with_lpoint"
                :active-value="1"
                :inactive-value="0"
                @change="handleToggleLPointActivation"
              />
            </div>
          </div>
          <div class="flex-container mt-16">
            <div class="full-width">Cara Mendapatkan Point</div>
            <div class="full-width text-right">{{ data.lpoint_earn_by_order_amount === 0 ? $lang[langId].product_purchase : $lang[langId].total_order }}</div>
          </div>
          <!-- <p class="input-desc size-12 oldgrey">
            {{ lang.info_activate_loyalty_point }}
          </p> -->
        </div>
        <div class="flex-container mt-16 color-grey--soft--bg customer-type-lpoint">
          <div class="full-width">Tipe Pelanggan</div>
          <div class="full-width text-right">{{ labelSelectedCustomerTypes['saved'] }}</div>
        </div>
      </el-card>

      <el-card class="box-card">
        <div slot="header" class="flex-container">
          <div class="full-width"><h4>Penukaran Point</h4></div>
          <div>
            <el-button
              class="btn-block"
              type="success"
              @click="dialogHandleAdd = true">
              {{ lang.add }}
            </el-button>
          </div>
        </div>
        <div class="table-handler-flex mb-16">
          <div class="mb-4" style="flex-grow: 1;">
            <el-select class="inline-form" v-model="params.per_page" @change="changePageTable" :placeholder="lang.please_select" size="small">
              <el-option
                v-for="item in pages"
                :key="item"
                :value="item"
                :label="item + ' ' + lang.rows"
              />
            </el-select>
          </div>

          <div class="mb-4">
            <el-input
              class="inline-form input-search"
              clearable
              :placeholder="lang.search+' '+lang.loyalty_point"
              prefix-icon="el-icon-search"
              v-model="params.search"
              @change="handleSearch" size="small">
            </el-input>
          </div>
        </div>
        <div
          v-if="dataRedeem.length === 0 && !loading"
          class="card_close_date box-card">
          <div class="no-data-wrapper">
            <img src="/static/img/no-data-point.svg" class="no-data-image">
          </div>
        </div>
        <div
          v-if="dataRedeem.length || loading"
          class="like-table-wrapper">
          <div
            v-for="(item, key) in dataRedeem"
            :key="key"
            class="like-table-wrapper--item">
            <div style="flex-grow: 1;">
              <div v-if="item.type === 'D'" class="flex-container">
                <div class="mr-8 lh-1">
                  <el-avatar
                    :size="40"
                    style="background: #FEE8E6">
                    <span class="color-danger">
                      <svg-icon icon-class="icon-voucher" />
                    </span>
                  </el-avatar>
                </div>
                <div class="lh-1">
                  <div v-if="parseFloat(item.discount_amount)" class="font-bold font-14">{{ lang.discount }} {{ item.fdiscount_amount }}</div>
                  <div v-else class="font-bold font-14">{{ lang.discount }} {{ item.discount_rate }}%</div>
                  <div class="font-12 color-info">{{ item.redeemed_points }} point</div>
                </div>
              </div>
              <div v-if="item.type === 'P'" class="flex-container">
                <div class="mr-8 lh-1">
                  <el-avatar
                    :size="40"
                    style="background: #F2FFEC">
                    <span class="color-success" style="font-size: 38px;">
                      <svg-icon icon-class="free-product" />
                    </span>
                  </el-avatar>
                </div>
                <div class="lh-1">
                  <div class="font-bold font-14">{{ rootLang.free }} {{ item.product_name }}</div>
                  <div class="font-12 color-info">{{ item.redeemed_points }} point</div>
                </div>
              </div>
            </div>
            <el-button type="text" circle @click="editRedeem(item)" >
              <svg-icon icon-class="edit-2" class="pointer mr-12 color-primary" />
            </el-button>
          </div>
        </div>

        <div style="text-align: center;">
          <el-pagination
            :current-page.sync="pagination.current_page"
            :page-size="pagination.per_page"
            :total="pagination.total"
            layout="prev, pager, next, jumper"
            @current-change="changeCurrentPage">
          </el-pagination>
        </div>
      </el-card>

      <div
        v-if="show"
        class="offscreen-right-sidebar offscreen-right-sidebar--zindexplus">
        <div class="offscreen-right-sidebar--wrapper">
          <div class="offscreen-right-sidebar--header">
            Tipe Pelanggan
            <close-esc @close="show = false" />
          </div>
          <div class="flex-container px-8" style="height: 56px">
            <div class="full-width">Semua</div>
            <div>
              <el-checkbox
                v-model="checkAll"
                :true-label="1"
                :false-label="0"
                :indeterminate="isIndeterminate"
                @change="handleCheckAllChange"
              />
            </div>
          </div>
          <div>
            <el-input
              v-model="keywordCustomerType"
              prefix-icon="el-icon-search"
              placeholder="cari"
              class="mb-4"
            />
          </div>
          <div class="offscreen-right-sidebar--scrollcontent" style="overflow-y: hidden">
            <perfect-scrollbar>
              <el-checkbox-group
                v-model="tempValidCustomer"
                class="checkbox-group-block"
                @change="handleCheckCustomerType"
                style="margin-bottom: 25%">
                <el-checkbox
                  v-for="(item, idx) in filteredCustomerTypes"
                  :key="idx"
                  :label="item.id">
                  {{ item.name }}
                </el-checkbox>
              </el-checkbox-group>
            </perfect-scrollbar>
          </div>

          <div class="offscreen-right-sidebar--footer">
            <el-button
              type="primary"
              class="btn-block"
              @click="handleDoneSelectCustomerTypes">
              {{ rootLang.complete }}
            </el-button>
          </div>
        </div>
      </div>

      <el-dialog
        :visible.sync="dialogEdit"
        :show-close="false"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        append-to-body
        custom-class="dialog-card">
        <div slot="title" class="flex-container">
          <h4 class="dialog-title full-width">
            {{ lang.loyalty_point }}
          </h4>
          <div class="btn_save_dialog full-width text-right">
            <el-button type="info" @click="handleCloseDialogEdit">{{ lang.cancel }}</el-button>
            <el-button :loading="loadingSave" type="success" @click="handleSave" >{{ lang.save }}</el-button>
          </div>
        </div>
        <div>
          <div class="full-width">
            <el-radio-group
              v-model="temp.lpoint_earn_by_order_amount"
              class="full-width flex-container border border--info">
              <el-radio-button class="lpoint-type" :label="0">
                {{ $lang[langId].product_purchase }}
              </el-radio-button>
              <el-radio-button class="lpoint-type" :label="1">
                {{ $lang[langId].total_order }}
              </el-radio-button>
            </el-radio-group>
            <div class="flex-container color-grey--soft--bg p-16 radius-10 mb-24 mt-16">
              <div class="mr-8" style="color: #AFB0AF">
                <svg-icon icon-class="clock" class="style-clock" style="font-size: 20px"/>
              </div>
              <p v-if="data.lpoint_earn_by_order_amount === 0" class="input-desc">
                Point akan diperoleh pelanggan saat membeli produk tertentu. Besar point yang diperoleh dapat diatur pada masing-masing produk
              </p>
              <p v-else class="input-desc">
                Point akan diperoleh pelanggan saat membeli dengan minimal total pesanan tertentu sesuai dengan pengaturan berikut
              </p>
            </div>
            <div v-if="temp.lpoint_earn_by_order_amount === 1" class="mb-16">
              <div class="font-12 text-left mt-32">Min. Total Pesanan</div>
              <input-money v-model="temp.lpoint_earn_spend_amount" />

              <div class="font-12 text-left mt-16">Point yang diperoleh</div>
              <el-input v-model="temp.lpoint_earn_points" type="number"><template slot="append">Point</template></el-input>
              <div class="flex-container border border--grey pl-5 mt-16" style="height: 40px">
                <div class="full-width font-bold">Berlaku kelipatan</div>
                <div class="text-right" style="width: 20%">
                  <span v-if="temp.lpoint_earn_multipliable === 1" class="mr-12">{{ lang.yes }}</span>
                  <span v-else class="mr-12">{{ lang.no }}</span>
                </div>
                <div class="flex-container text-right" style="width: 15%">
                  <el-switch
                    v-model="temp.lpoint_earn_multipliable"
                    :active-value="1"
                    :inactive-value="0"
                  />
                </div>
              </div>
            </div>
            <span class="font-12 mt-16">Berlaku untuk tipe pelanggan</span>
            <div
              class="flex-container border border--grey pl-5 color-grey--soft--bg pointer"
              @click="handleEditValidCustomer">
              <div class="full-width font-bold p-8">
                {{ labelSelectedCustomerTypes['temp'] }}
              </div>
              <div>
                <svg-icon icon-class="edit-2" class="pointer mr-12 color-primary" />
              </div>
            </div>
          </div>
        </div>
      </el-dialog>

      <el-dialog 
        :visible.sync="dialogHandleAdd"
        :show-close="false"
        :close-on-press-escape="false"
        custom-class="dialog-card">
        <div slot="title" class="flex-container">
          <h4 class="dialog-title full-width">
            {{ rootLang.exchange_with_point }}
          </h4>
        </div>
        <div class="p-8 flex-container pointer box-shadow border border--info mb-8" @click="handleAdd(0)">
          <div class="mr-8 font-24">
            <svg-icon icon-class="icon-voucher" />
          </div>
          <h5 class="full-width color-body font-semi-bold">{{ lang.discount }}</h5>
          <div>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        <div class="p-8 flex-container pointer box-shadow border border--info" @click="handleAdd(1)">
          <div class="mr-8 font-24">
            <svg-icon icon-class="icon-free-product" />
          </div>
          <h5 class="full-width color-body font-semi-bold">{{ rootLang.free_product }}</h5>
          <div>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </el-dialog>

      <el-dialog
        :visible.sync="dialogEditRedeem"
        :show-close="false"
        :close-on-press-escape="false"
        custom-class="dialog-card">
        <div slot="title" class="flex-container">
          <h4 v-if="tempRedeem.type === 'D'" class="dialog-title full-width">
            {{ lang.discount }}
          </h4>
          <h4 v-if="tempRedeem.type === 'P'" class="dialog-title full-width">
            {{ rootLang.free }} {{ lang.product }}
          </h4>
          <div class="btn_save_dialog full-width text-right">
            <el-button type="info" @click="handleCancelEdit">{{ lang.cancel }}</el-button>
            <el-button :loading="loadingSave" type="success" @click="handleSaveRedeem" >{{ lang.save }}</el-button>
          </div>
        </div>
        <el-form
          @submit.native.prevent
          @keyup.native.enter="handleSaveRedeem">
          <div
            v-if="tempRedeem.type === 'D'">
            <div class="flex-container justify-center" style="height: 150px; background: #FEE8E6">
              <svg-icon icon-class="icon-voucher" style="font-size: 40"></svg-icon>
            </div>

            <div class="font-12 text-left mt-32">Besar point</div>
            <el-input v-model="tempRedeem.redeemed_points" type="number" @input="validateNoMinus">
              <template slot="append">point</template>
            </el-input>
            <div class="font-12 text-left mt-32">Diskon yang diperoleh</div>
            <el-input
              v-model="discount"
              type="number"
              class="switch-discount"
              @input="validateNoMinus($event, 'discount')">
              <template slot="append">
                <el-radio-group v-model="discount_type" class="flex-container">
                  <el-radio-button class="lpoint-type" :label="0">
                    IDR
                  </el-radio-button>
                  <el-radio-button class="lpoint-type" :label="1">
                    %
                  </el-radio-button>
                </el-radio-group>
              </template>
            </el-input>
          </div>

          <div
            v-if="tempRedeem.type === 'P'">
            <div class="flex-container justify-center" style="height: 150px; background: #F2FFEC">
              <svg-icon icon-class="free-product" style="font-size: 120"></svg-icon>
            </div>

            <div class="font-12 text-left mt-32">Besar point</div>
            <el-input v-model="tempRedeem.redeemed_points" type="number" @input="validateNoMinus">
              <template slot="append">point</template>
            </el-input>

            <div class="font-12 text-left mt-32">Diskon yang diperoleh</div>
            <el-select
              :debounce="1000"
              :placeholder="lang.info_auto_complete_product"
              :remote-method="searchProducts"
              :loading="searchingProducts"
              style="width: 100%;"
              v-model="tempRedeem.merge_product_id"
              filterable
              remote
              reserve-keyword
              @change="setProduct">
              <el-option
                v-for="item in searchResultProducts"
                :key="item.product_id"
                :label="item.name"
                :value="item.product_id">
              </el-option>
            </el-select>

            <div class="font-12 text-left mt-32">Qty Produk</div>
            <el-input v-model="tempRedeem.qty" type="number" @input="validateNoMinus" />
          </div>
        </el-form>

        <el-button
          v-if="tempRedeem.id"
          :loading="loadingDelete"
          class="mt-24 full-width"
          type="danger"
          @click="handleDeleteRedeem">
          <svg-icon icon-class="trash"></svg-icon>
          {{ $lang[langId].delete }}
        </el-button>
      </el-dialog>
    </section>

    <section v-else>
      <loyalty-point-old
        @accept="handleAccept"
      />
    </section>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import InputMoney from '@/components/InputMoneyV2'
import CloseEsc from '@/components/modules/CloseEsc'
const apiEndPoint = 'loyaltypoint'
import basicComputedMixin from '@/mixins/basicComputedMixin'

import LoyaltyPointOld from './index-old'

export default {
  components: {
    InputMoney,
    CloseEsc,
    LoyaltyPointOld
  },
  mixins: [basicComputedMixin],

  data() {
    return {
      loading: true,
      disabledForm: false,
      isEditingCustomerTypes: false,
      searchingCustomerTypes: false,
      searchResultCustomerTypes: [],
      tmp: [],
      fresh: {
        valid_customer_types: []
      },
      data: {
        with_lpoint: 0,
        valid_customer_types: [],
        valid_all_customer_types: 1
      },
      dialogEdit: false,
      lpointType: '',
      show: false,
      customerTypes: [],
      checkAll: 0,
      loadingSave: false,
      temp: {},
      tempValidCustomer: [],
      dataRedeem: [],
      tempRedeem: {},
      dialogEditRedeem: false,
      discount_type: 0,
      discount: 0,
      searchingProducts: false,
      searchResultProducts: [],
      dialogHandleAdd: false,
      loadingDelete: false,
      keywordCustomerType: '',
      pagination: {},
      params: {
        page: 1,
        per_page: 5,
        search: null
      },
      pages: [5, 10, 20]
    }
  },

  computed: {
    labelSelectedCustomerTypes() {
      const names = []
      const savedNames = []
      this.customerTypes.map(item => {
        if (this.temp.valid_customer_types && this.temp.valid_customer_types.includes(item.id)) {
          names.push(item.name)
        }
        if (this.data.valid_customer_types && this.data.valid_customer_types.includes(item.id)) {
          savedNames.push(item.name)
        }
      })
      // console.log(this.data.valid_customer_types)
      return {
        temp: !this.temp.valid_all_customer_types ? names.join(',') : 'All',
        saved: !this.data.valid_all_customer_types ? savedNames.join(',') : 'All'
      }
    },

    filteredCustomerTypes() {
      if (this.show) {
        if (this.keywordCustomerType) {
          return this.customerTypes.filter(item => {
            return item.name.includes(this.keywordCustomerType)
          })
        } else {
          return this.customerTypes
        }
      }
    }
  },

  watch: {
    '$store.getters.selectedStore'() {
      this.refreshView()
    },
    data: {
      handler(data) {
        if (data.with_lpoint === 1) {
          this.disabledForm = false
        } else {
          this.disabledForm = true
        }
      },
      deep: true,
      immediate: true
    },
    discount(val) {
      if (this.discount_type !== 0 && val > 100) {
        this.discount = 100
      }
    }
  },

  mounted() {
    this.refreshView()
  },

  methods: {
    refreshView() {
      this.getCustomerTypes()
      this.getData()
      this.getDataRedeem()
    },

    validateNoMinus() {
      if (this.discount < 0) {
        this.discount = 1
      }
      if (this.tempRedeem.redeemed_points && this.tempRedeem.redeemed_points < 0) {
        this.tempRedeem.redeemed_points = 1
      }
      if (this.tempRedeem.qty < 0) {
        this.tempRedeem.qty = 1
      }
    },

    getData() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint),
        headers: headers
      }).then(async response => {
        this.data = await { ...response.data.data }
        this.data.valid_customer_types = []
        const recordedCustomerTypes = [...response.data.data.valid_customer_types]
        // console.log(response.data.data.valid_customer_types)
        if (recordedCustomerTypes.length) {
          await recordedCustomerTypes.map(item => {
            this.data.valid_customer_types.push(parseInt(item.id))
          })
        }
        // console.log(this.data.valid_customer_types)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },

    getDataRedeem() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'loyaltypointredeem'),
        headers: headers,
        params: this.params
      }).then(response => {
        this.dataRedeem = response.data.data
        this.pagination = response.data.meta
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.pagination = {}
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    async handleSave() {
      this.loadingSave = true
      const data = await { ...this.temp }
      data.valid_customer_types = await [...this.temp.valid_customer_types]
      if (data.valid_customer_types.length) {
        // data.valid_customer_types = []
        // await this.data.valid_customer_types.map(item => {
        //   data.valid_customer_types.push(item.id)
        // })
        data.valid_customer_types = data.valid_customer_types.join(',')
      }

      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + '/update'),
        headers: headers,
        data
      }).then(response => {
        this.getData()
        this.loadingSave = false
        this.dialogEdit = false
        this.$message({
          type: 'success',
          message: 'Saved'
        })
      }).catch(error => {
        this.loadingSave = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    getCustomerTypes() {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'customertype'),
        params: {
          per_page: 500
        },
        headers: headers
      }).then(response => {
        // this.customerTypes = response.data.data.filter(item => {
        //   return item.id !== 0
        // })
        this.customerTypes = response.data.data
      }).catch(() => {
      })
    },

    handleCheckAllChange (data) {
      this.tempValidCustomer = [] 
      if (data) {
        this.customerTypes.map(item => {
          this.tempValidCustomer.push(item.id)  
        })
      }
    },

    handleEdit () {
      this.temp = { ...this.data }
      this.dialogEdit = true
    },

    handleCheckCustomerType() {
      if (this.tempValidCustomer.length !== this.customerTypes.length) {
        this.checkAll = 0
      } else {
        this.checkAll = 1
      }
    },

    editRedeem (data) {
      this.tempRedeem = { ...data}
      if (!parseFloat(this.tempRedeem.discount_amount)) {
        this.discount = parseFloat(this.tempRedeem.discount_rate)
        this.discount_type = 1
      } else if (!parseFloat(this.tempRedeem.discount_rate)) {
        this.discount = parseFloat(this.tempRedeem.discount_amount)
        this.discount_type = 0
      }
      if (this.tempRedeem.id && this.tempRedeem.type === 'P') {
        this.searchProducts(this.tempRedeem.product_name)
      }
      this.dialogEditRedeem = true
    },

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
          headers: headers,
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

    setProduct (data) {
      this.searchResultProducts.map(i => {
        if (i.product_id === data) {
          this.tempRedeem.valid_product = i
        }
      })
    },

    handleSaveRedeem () {
      this.loadingSave = true
      let data = {}
      let method = ''
      let url = ''
      if (this.tempRedeem.type === 'D') {
        data.type = 'D'
        data.redeemed_points = this.tempRedeem.redeemed_points
        if (this.discount_type === 0) {
          data.discount_amount = this.discount
          data.discount_rate = 0
        } else {
          data.discount_rate = this.discount
          data.discount_amount = 0
        }
      }
      if (this.tempRedeem.type === 'P') {
        if (typeof this.tempRedeem.merge_product_id !== 'number') {
          let pid = this.tempRedeem.merge_product_id.split('|')
          data.product_id = this.tempRedeem.merge_product_id
          data.product_variant_id = pid[1]
        } else {
          data.product_id = this.tempRedeem.merge_product_id
        }
        data.type = 'P'
        data.redeemed_points = this.tempRedeem.redeemed_points
        data.qty = this.tempRedeem.qty
      }

      if (typeof this.tempRedeem.id !== 'undefined') {
        method = 'PUT'
        url = baseApi(this.selectedStore.url_id, this.langId, 'loyaltypointredeem/' + this.tempRedeem.id)
      } else {
        method = 'POST'
        url = baseApi(this.selectedStore.url_id, this.langId, 'loyaltypointredeem/')
      }
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: method,
        url: url,
        headers: headers,
        data
      }).then(response => {
        this.getDataRedeem()
        this.dialogEditRedeem = false
        this.loadingSave = false
      }).catch(error => {
        this.loadingSave = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    handleDeleteRedeem () {
      this.loadingDelete = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'loyaltypointredeem/' + this.tempRedeem.id),
        headers: headers
      }).then(response => {
        this.getDataRedeem()
        this.dialogEditRedeem = false
        this.loadingDelete = false
      }).catch(error => {
        this.loadingDelete = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    handleAdd (item) {
      let data = {
        type: item === 0 ? 'D' : 'P',
        redeemed_points: 0,
        discount_amount: 0,
        discount_rate: 0,
        product_id: 0,
        product_variant_id: 0,
        qty: 0
      }
      this.dialogHandleAdd = false
      this.editRedeem(data)
    },

    async handleEditValidCustomer() {
      this.tempValidCustomer = []
      if (this.temp.valid_all_customer_types) {
        this.checkAll = this.temp.valid_all_customer_types
        await this.customerTypes.map(item => {
          this.tempValidCustomer.push(item.id)
        })
      } else {
        await this.temp.valid_customer_types.map(itemId => {
          this.tempValidCustomer.push(itemId)
        })
      }
      this.show = true
    },

    async handleDoneSelectCustomerTypes() {
      // console.log(this.tempValidCustomer)
      this.temp.valid_customer_types = await [...this.tempValidCustomer]
      this.temp.valid_all_customer_types = await this.checkAll
      this.show = false
    },

    handleToggleLPointActivation() {
      this.temp = { ...this.data }
      this.handleSave()
    },

    handleAccept () {
      // this.data.use_new_version_lpoint = 1
      this.$store.commit('SET_USE_NEW_LPOINT', 1)
    },

    handleCancelEdit () {
      this.dialogEditRedeem = false,
      this.tempRedeem = {}
    },

    changeCurrentPage(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getDataRedeem()
    },

    changePageTable(val) {
      this.params.per_page = val
      this.getDataRedeem()
    },

    handleSearch(val) {
      this.params.page = 1
      this.params.currentPage = 1
      this.params.search = val
      this.getDataRedeem()
    },

    handleCloseDialogEdit () {
      if (!this.show) {
        this.dialogEdit = false 
        this.temp = {}
      }
    }
  }
}
</script>
