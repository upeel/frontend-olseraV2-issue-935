<template>
  <el-dialog
    :visible.sync="show"
    :before-close="handleClose"
    :show-close="false"
    append-to-body
    custom-class="without-padding mw-1020">
    <div slot="title" class="flex-container">
      <h4 class="dialog-title full-width">
        {{ lang.orders }} Tokopedia
      </h4>
      <div class="btn_save_dialog full-width text-right">
        <close-esc @close="handleClose" />
      </div>
    </div>
    <template>
      <div class="flex-container p-8">
        <div class="full-width" style="flex-grow: 1">
          <el-select class="el-select-etalase" v-model="paramsTokped" @change="handleFilterbyStore" filterable :placeholder="rootLang.select + ' Toko'" size="medium">
            <el-option :label="lang.all + ' ' + lang.store" :value="0"></el-option>
            <el-option v-for="store in dataStoreTokped" :key="store.id" :label="store.shop_name" :value="store.id"></el-option>
          </el-select>
        </div>
        <el-button @click="showData('all')" 
          type="info-addon" 
          :class="visibleItem[0] ? 'active tag-button-tokped box-shadow-null' : 'tag-button-tokped box-shadow-null'">
            Semua
        </el-button>
        <el-button @click="showData('not_saved')" 
          type="info-addon" 
          :class="visibleItem[1] ? 'active tag-button-tokped box-shadow-null' : 'tag-button-tokped box-shadow-null'">
            Belum Tersimpan ({{ totalUnsave }})
        </el-button>
        <el-button @click="showData('saved')" 
          type="info-addon" 
          :class="visibleItem[2] ? 'active tag-button-tokped box-shadow-null' : 'tag-button-tokped box-shadow-null'">
            Tersimpan ({{ totalSave }})
        </el-button>
        <!-- <div v-loading="loadingSync" class="full-width font-14 color-primary font-bold pointer ml-8" @click="syncDataProduct">
          Sinkronkan Produk
          <svg-icon icon-class="refresh-icon" />
        </div> -->
        <div class="table-handler-flex full-width text-right p-8" style="display: unset">
          <el-input class="inline-form input-search" clearable :placeholder="lang.search" prefix-icon="el-icon-search" v-model="search" @change="handleSearch" size="small"></el-input>
        </div>
        <div>
          <el-dropdown
            trigger="click"
            @command="handleDropdownSection">
            <span class="el-dropdown-link font-20 color-info">
              <svg-icon icon-class="more-vertical"></svg-icon>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="product">
                <svg-icon icon-class="refresh-ico" class="mr-8"></svg-icon>
                {{ rootLang.sync_product }}
              </el-dropdown-item>
              <el-dropdown-item command="order">
                <svg-icon icon-class="refresh-ico" class="mr-8"></svg-icon>
                {{ rootLang.sync_order }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="like-table-wrapper mt-16 border border--table-border">
        <div class="like-table-wrapper--item">
          <div class="mr-8 full-width flex-container" >
            <div class="font-bold font-14">
              Akun Tokopedia
            </div>
          </div>
          <div class="mr-8 full-width flex-container" >
            <div class="font-bold font-14">
              {{ lang.orders }} Tokopedia
            </div>
          </div>
          <div class="font-bold font-14" style="width: 50%">
            {{ lang.status }}
          </div>
          <div class="font-bold font-14 full-width" >
            {{ lang.orders }} Olsera
          </div>
          <div class="font-bold font-14" style="width: 50%">
            {{ lang.status }}
          </div>
          <div class="font-bold font-14" style="width: 30%; min-width: 150px">
            <!-- {{ lang.status }} -->
          </div>
        </div>
      </div>
      <perfect-scrollbar class="scrollBulkPair">
      <div v-loading="loadingSync" class="like-table-wrapper border border--table-border" >
        <div v-for="(item, idx) in dataOrder" 
          :key="item.id" class="like-table-wrapper--item">
          <div class="flex-container full-width ">
            <div class="mr-8 full-width flex-container pointer" @click="handlePair(item)">
              <div>
                  <el-avatar
                    :src="item.logo"
                    :size="32"
                    shape="circle"
                  />
                </div>
              <div class="font-bold font-14 ml-8 word-break">
                {{ item.shop_name }}
              </div>
            </div>
            <div class="mr-8 full-width pointer" @click="handlePair(item)">
              <div class="font-bold font-14 ml-8 word-break color-tokopedia">
                {{ item.invoice_num }}
              </div>
            </div>
            <div class="font-14 px-12 pointer" style="width: 50%" @click="handlePair(item)">
              {{ item.status }}
            </div>
            <div class="font-14 px-12 full-width" >
              <router-link v-if="item.invoice_olsera" :to="{ path: '/sales/openorder/' + item.order_id_olsera }">
                <div class="px-8">
                  <span  class="color-primary font-bold pointer"> {{ item.invoice_olsera }} </span>
                </div>
              </router-link>
              <span v-else>Belum ada</span>
            </div>
            <div class="font-14 px-12" style="width: 50%">
              <div v-if="!item.status_code_olsera">
                <p>-</p>
              </div>
              <inline-update-status
                :loading="loadingUpdateStatus"
                :status="item.status_code_olsera"
                :item-id="item.order_id_olsera"
                :additional-data="item"
                type="product-buy-price"
                @update="handleUpdateStatus($event, idx)"
              />
            </div>
            <div v-if="item.status_save === 0" style="width: 30%">
              <el-button round type="success" style="width: 150px" plain @click="handlePair(item)">{{ lang.save }}</el-button>
            </div>
            <div v-else style="width: 30%">
              <template v-if="item.status_save === 1 && item.status_code_olsera !== null && item.status_code_olsera === 'A'">
                <el-button v-if="item.is_request_cancel === 1" round type="tokopedia" class="text-center" style="width: 150px" plain @click="handlePair(item)">{{ 'Req Pembatalan' }}</el-button>
                <el-button v-else-if="item.is_request_cancel === 0 && item.status_order === 'R' || item.status_order === 'C'" round type="tokopedia" class="text-center" style="width: 150px" plain @click="handleChangeStatus(item, true)">{{ item.status_order === 'R'? 'Request Pickup' : 'Accept Shipping'}}</el-button>
                <el-button v-else round type="tokopedia" style="width: 150px" plain @click="handlePair(item)">{{ rootLang.saved }}</el-button>
              </template>
              <template v-else>
                <el-button round type="tokopedia" style="width: 150px" plain @click="handlePair(item)">{{ rootLang.saved }}</el-button>
              </template>
            </div>
          </div>
        </div>
      </div>
      </perfect-scrollbar>
      <div v-if="meta.totalProduct > 0" class="border border--grey-border table-handler-bottom text-center">
        <el-pagination
          :total="meta.totalProduct"
          :page-sizes="[1, 15, 50, 100]"
          :page-size="meta.page_size"
          :current-page.sync="meta.currentPage"
          style="margin-bottom: 20px"
          background
          layout="sizes, prev, pager, next"
          @current-change="handleChangePage"
          @size-change="handleChangeSizePage"
        />
      </div>
    </template>

    <el-dialog
      :visible.sync="dialogSyncOrder"
      :before-close="handleCloseSyncOrder"
      :show-close="true"
      append-to-body>
      <div class="text-center">
        <span class="font-24">{{ rootLang.sync_order }} Tokopedia</span>
        <div class="mb-4 mt-16" style="flex-grow: 1;">
            <date-range-picker
              :init-date="initParamDate"
              :all-time="allTimeDate"
              :custom-range-only="true"
              @picked="datePicked"
            />
          </div>
          <div v-loading="loading" class="mt-24">
            <div v-for="(store, idx) in dataStoreTokped" :key="idx">
              <div class="flex-container p-8 color-info--bg mt-12">
                <div>
                  <el-avatar
                    :src="store.photo"
                    :size="32"
                    shape="circle"
                  />
                </div>
                <div class="full-width text-left px-8">
                  <span>{{ store.shop_name }}</span>
                </div>
                <div>
                  <el-button type="text" :loading="store.loading" :disabled="disableSynOrder" @click="handleSyncOrder(idx)">
                    <svg-icon icon-class="refresh-ico" class="font-18" />
                  </el-button>
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="mt-24 flex-container">
            <div class="full-width">
              <el-button :loading="loadingSync" :disabled="disableSynOrder" class="btn-block" type="tokopedia" @click="getSyncOrder">{{ rootLang.sync }}</el-button>
            </div>
            <div class="full-width"> <el-button class="btn-block" type="info" @click="handleCloseSyncOrder">{{ rootLang.cancel }}</el-button> </div>
          </div> -->
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogSyncProduct"
      :show-close="true"
      append-to-body>
      <div class="text-center">
        <span class="font-24">Sync product Tokopedia</span>
        <div v-loading="loading" class="mt-24">
            <div v-for="(store, idx) in dataStoreTokped" :key="idx">
              <div class="flex-container p-8 color-info--bg mt-12">
                <div>
                  <el-avatar
                    :src="store.photo"
                    :size="32"
                    shape="circle"
                  />
                </div>
                <div class="full-width text-left px-8">
                  <span>{{ store.shop_name }}</span>
                </div>
                <div>
                  <el-button type="text" :loading="store.loadingProduct"  @click="syncDataProduct(idx)">
                    <svg-icon icon-class="refresh-ico" class="font-18" />
                  </el-button>
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="mt-24 flex-container">
            <div class="full-width">
              <el-button :loading="loadingSync" :disabled="disableSynOrder" class="btn-block" type="tokopedia" @click="getSyncOrder">{{ rootLang.sync }}</el-button>
            </div>
            <div class="full-width"> <el-button class="btn-block" type="info" @click="handleCloseSyncOrder">{{ rootLang.cancel }}</el-button> </div>
          </div> -->
      </div>
    </el-dialog>

    <offscreen-order-tokopedia
      ref="cancelorder"
      :show="visibleSynOrder"
      :form-edit="tempDataSync"
      :loading-save="loadingSavePair"
      :loading-cancel-order="loadingCancelOrder"
      @saveproduct="handleBeforeSaveSales"
      @updatedata="handleUpdateData"
      @cancelordertokped="handleCancelOrder"
      @cancel="visibleSynOrder = false"
      @updateshipping="handleChangeShipping"
    />
    
  </el-dialog>
</template>
<script>
// import { baseApi } from 'src/http-common'
import moment from 'moment'
import basicComputedMixin from '@/mixins/basicComputedMixin'
import offscreenOrderTokopedia from './offscreenOrderTokopedia'
import InlineUpdateStatus from '@/components/InlineUpdateStatus'
import CloseEsc from '@/components/modules/CloseEsc'

import dateRangePicker from '@/components/modules/DateRangePicker'

import { updateStatusOrder, saveSalesTokopedia, syncProductTokopedia, syncOrderTokopedia, updateStatusOrderTokopedia, CancelOrderTokopedia, getMerchantTokopedia } from '@/api/thirdParty/tokopedia'
import { fetchByStore as fetchGroups } from '@/api/thirdParty/group'

export default {
  name: 'DialogOrderTokopedia',

  components: {
    offscreenOrderTokopedia,
    CloseEsc,
    InlineUpdateStatus,
    dateRangePicker
  },

  mixins: [basicComputedMixin],

  props: {
    show: {
      type: Boolean,
      default: false
    },
    dataOrder: {
      type: Array,
      default: []
    },
    totalUnsave: {
      type: Number,
      default: null
    },
    totalSave: {
      type: Number,
      default: null
    },
    meta: {
      type: Object,
      default: {}
    }
  },

  data () {
    return {
      dataChecked: [],
      checkAll: false,
      visibleSynOrder: false,
      tempDataSync: {},
      loadingSavePair: false,
      dataProduct: [
        {
          product_id: 0,
          order_no: 'INV/20210207/XXI/II/747268949',
          order_no_olsera: null,
          status: 'Dalam Pengiriman',
          status_olsera: ''
        }
      ],
      visibleItem: [false, false, false, false],
      search: '',
      loadingUpdateStatus: false,
      loadingSync: false,
      dialogSyncOrder: false,
      paramsSync: {
        to_date: moment().format('YYYY-MM-DD'),
        from_date: moment().format('YYYY-MM-DD'),
        page: 1,
        per_page: 100
      },
      // fixes error "not defined on the instance but referenced during render"
      initParamDate: '',
      allTimeDate: '',
      loadingCancelOrder: false,
      dataStoreTokped: [],
      loading: false,
      dialogSyncProduct: false,
      paramsTokped: ''
    }
  },

  computed: {
    dataProd () {
      return this.dataProduct.map(i => {
        i.checked = false
        if (this.dataChecked.length > 0) {
          this.dataChecked.map(j => {
            if (i.product_id === j.product_id_tokopedia) {
              i.checked = true
            }
          })
        }
        return i
      })
    },

    bgOlseradiv () {
      let bg = []
      this.dataProduct.map(i => {
        bg.push('background-color: #FFFFFF')
      })
      return bg
    },

    disableSynOrder () {
      let start = moment(this.paramsSync.from_date)
      let end = moment(this.paramsSync.to_date)
      let rangeDate = moment.duration(end.diff(start)).asDays()
      console.log('range', rangeDate)
      if (rangeDate + 1 > 31) {
        return true
      } else {
        return false
      }
    }
  },

  mounted () {
    // this.fetchGroups()
    this.getListMerchant()
  },

  methods: {
    handleCheck (item) {
      console.log('aaa')
      if (item.recomendation === null) {
        this.$notify({
          type: 'warning',
          // title: error.response.data.error.message,
          message: this.rootLang.please_select_product_olsera
        })
      } else {
        const exist = this.dataChecked.some(({product_id_tokopedia}) => product_id_tokopedia === item.product_id)
        if (exist) {
          this.dataChecked.map((i, idx) => {
            if (i.product_id_tokopedia === item.product_id) {
              this.dataChecked.splice(idx, 1)
            }
          })
        } else {
          this.dataChecked.push({
            product_id_tokopedia: item.product_id,
            product_id_olsera: item.recomendation.id,
            source_product: item.recomendation.type,
            type: item.type,
            stock: item.stock
          })
        }
      }
    },

    handleCheckAll (arg) {
      if (arg) {
        this.dataChecked = []
        this.dataProd.map(i => {
          this.dataChecked.push({
            product_id_tokopedia: i.product_id,
            product_id_olsera: 0
          })
        })
      } else {
        this.dataChecked = []
      }
    },

    setBg (idx) {
      this.bgOlseradiv[idx] = 'background-color: #0085CD'
      console.log('aaa', this.bgOlseradiv[idx])
    },

    setBg1 (idx) {
      this.bgOlseradiv[idx] = 'background-color: #FFFFFF'
      console.log('aaa', this.bgOlseradiv[idx])
    },

    handlePair (item) {
      this.tempDataSync = { ...item}
      this.visibleSynOrder = true
    },

    handleSetProduct (data) {
      console.log('data', data)
      this.dataProduct.map(i => {
        if (i.product_id === this.tempDataSync.product_id) {
          i.recomendation = { ...data}
          this.handleCheck(i)
        }
      })
      this.visibleSynProduct = false
    },

    handleSaveSales (data) {
      let dataSave = {
        order_no_tokopedia: data.order_no_tokopedia,
        merchant_tokopedia_id: data.merchant_tokopedia_id
      }
      this.loadingSavePair = true
      saveSalesTokopedia(dataSave).then(response => {
        this.$message({
          type: 'success',
          message: 'Success save data'
        })
        this.$emit('refresh')
        this.visibleSynProduct = false
        this.visibleSynOrder = false
        this.loadingSavePair = false
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingSavePair = false
      })
    },

    handleClose () {
      this.dataChecked = []
      this.tempDataSync = {}
      this.$emit('close')
    },

    handleChangePage (page) {
      // console.log(page)
      this.$emit('changepage', page)
    },

    handleChangeSizePage (page) {
      this.meta.page_size = page
      this.$emit('changepagesize', page)
    },

    showData (arg) {
      this.$emit('filter', arg)
    },

    handleSearch () {
      this.$emit('search', this.search)
    },

    handleUpdateStatus(item, index) {
      this.loadingUpdateStatus = true
      let data = {
        order_id_olsera: item.order_id,
        status_code_olsera: item.status
      }
      updateStatusOrder(data).then(response => {
        this.dataOrder[index].status_code_olsera = response.data.data.status
        this.$message({
          message: 'Success',
          type: 'success'
        })
        this.loadingUpdateStatus = false
        this.$emit('refresh')
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loadingUpdateStatus = false
      })
    },

    handleUpdateData (data) {
      this.tempDataSync = { ...data}
      this.$emit('syncproduct')
    },

    handleDropdownSection(command) {
      if (command === 'product') {
        // this.syncDataProduct()
        this.dialogSyncProduct = true
      }
      if (command === 'order') {
        this.dialogSyncOrder = true
      }
    },

    syncDataProduct(index) {
      this.dataStoreTokped[index].loadingProduct = true
      let params = {
        merchant_tokopedia_id: this.dataStoreTokped[index].id
      }
      syncProductTokopedia(params).then(response => {
        this.dataStoreTokped[index].loadingProduct = false
        this.$emit('syncproduct')
        this.loadingSync = false
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.dataStoreTokped[index].loadingProduct = false
        this.loadingSync = false
      })
    },

    getSyncOrder() {
      this.loadingSync = true
      this.paramsSync.merchant_tokopedia_id = this.tokopediaActiveStore.id
      syncOrderTokopedia(this.paramsSync).then(response => {
        this.dialogSyncOrder = false
        this.$emit('syncproduct')
        this.loadingSync = false
        this.$message({
          type: 'success',
          message: response.data.data.message
        })
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        // this.dialogSyncOrder = false
        this.loadingSync = false
      })
    },

    datePicked (value) {
      if (value) {
        this.paramsSync.from_date = value.start_date
        this.paramsSync.to_date = value.end_date
        // this.getSyncOrder()
      } else {
        // this.getSyncOrder()
      }
    },

    handleCloseSyncOrder () {
      this.paramsSync.to_date = moment().format('YYYY-MM-DD')
      this.paramsSync.from_date = moment().format('YYYY-MM-DD')
      this.dialogSyncOrder = false
    },

    async handleChangeStatus (item, fromAction) {
      this.loadingChangeStatus = true
      let data = {
        order_no_tokopedia: item.order_no_tokopedia,
        status: item.status_order
      }
      await updateStatusOrderTokopedia(data).then(response => {
        this.$message({
          message: 'Success',
          type: 'success'
        })
        this.loadingChangeStatus = false
        if (fromAction) { this.$emit('refresh') }
        this.visibleSynOrder = false
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loadingChangeStatus = false
      })
    },

    handleCancelOrder (data) {
      this.loadingCancelOrder = true
      CancelOrderTokopedia(data).then(response => {
        this.$message({
          message: response.data.data.message,
          type: 'success'
        })
        this.loadingCancelOrder = false
        this.$refs.cancelorder.handleClose()
        this.$refs.cancelorder.handleCloseCancelOrder()
        this.$emit('refresh')
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.$refs.cancelorder.handleClose()
        this.loadingCancelOrder = false
      })
    },

    handleBeforeSaveSales (data) {
      if (data.status_code_tokopedia > 11 && data.status_code_tokopedia <= 220) {
        data.status_order = 'A'
        this.handleChangeStatus(data, false)
        this.handleSaveSales(data)
      } else {
        console.log('cccccc')
        this.handleSaveSales(data)
      }
    },

    async fetchGroups() {
      this.loading = true
      await fetchGroups({
        sort_column: 'view_sort',
        sort_type: 'asc'
      }).then(response => {
        let dataStore = []
        response.data.data.map(i => {
          if (i.name === 'Marketplace') {
            i.thirdparty_items.map(j => {
              if (j.alias_name === 'Tokopedia') {
                dataStore = [ ...j.main_store[0].marketplace_account]
              }
            })
          }
        })
        if (dataStore.length > 0) {
          dataStore.map(i => {
            i.loading = false
            i.loadingProduct = false
            if (i.status === 'A') {
              this.dataStoreTokped.push(i)
            }
          })
        }
        this.loading = false
      }).catch(error => {
        this.groups = []
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loading = false
      })
    },

    async getListMerchant() {
      this.loading = true
      await getMerchantTokopedia({
        search_column: 'status',
        search_text: 'X',
        search_operator: '!='
      }).then(response => {
        let dataStore = [ ...response.data.data]
        if (dataStore.length > 0) {
          dataStore.map(i => {
            i.loading = false
            i.loadingProduct = false
            if (i.status === 'A') {
              this.dataStoreTokped.push(i)
            }
          })
        }
        this.loading = false
      }).catch(error => {
        this.groups = []
        if (error.statusCode !== 404) {
          this.$message({
            type: 'error',
            message: error.string
          })
        }
        this.loading = false
      })
    },

    handleSyncOrder(index) {
      this.dataStoreTokped[index].loading = true
      let params = {
        to_date: this.paramsSync.to_date,
        from_date: this.paramsSync.from_date,
        page: 1,
        per_page: 100,
        merchant_tokopedia_id: this.dataStoreTokped[index].id
      }
      syncOrderTokopedia(params).then(response => {
        this.dataStoreTokped[index].loading = false
        this.$emit('syncproduct')
        // this.loadingSync = false
        this.$message({
          type: 'success',
          message: response.data.data.message
        })
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        // this.dialogSyncOrder = false
        this.dataStoreTokped[index].loading = false
      })
    },

    handleFilterbyStore () {
      this.$emit('filterstore', this.paramsTokped)
    },

    handleChangeShipping (data) {
      this.handleChangeStatus(data, true)
    }
  }
}
</script>