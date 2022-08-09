<template>
  <el-dialog
    :visible.sync="show"
    :before-close="handleClose"
    :show-close="false"
    append-to-body
    custom-class="without-padding mw-1020"
  >
    <div slot="title" class="flex-container">
      <h4 class="dialog-title full-width">
        {{ lang.orders }} Shopee
      </h4>
      <div class="btn_save_dialog full-width text-right">
        <close-esc @close="handleClose" />
      </div>
    </div>
    <template>
      <div class="flex-container p-8">
        <el-dropdown placement="bottom" @command="shopSelectHandler">
          <el-button 
            type="info-addon"
            class="el-dropdown-link tag-button-tokped box-shadow-null"
          >
            {{ rootLang.shopee_account }} <i class="el-icon-arrow-down"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item 
              :command="{shop_id: ''}"
              style="display: flex; align-items: center; justify-content: space-between; max-width: 268px;"
              :style="selectedShop.shop_id === '' ? 'color: #3a8ee6;' : ''"
            >
              <div style="max-width: 75%; word-break: break-all;">{{ rootLang.all }}</div>
              <div 
                style="color: #767676; font-weight: bold;" 
                :style="selectedShop.shop_id === ''? 'color: #3a8ee6;' : ''"
              >{{ computedTotalOrderAllShop.total_of_order }}</div>
            </el-dropdown-item>
            <el-dropdown-item 
              v-for="item in shopeeShopList" 
              :key="item.shop_id" 
              :command="item"
              style="display: flex; align-items: center; justify-content: space-between; max-width: 268px;"
              :style="selectedShop.shop_id === item.shop_id ? 'color: #3a8ee6;' : ''"
            >
              <div style="max-width: 75%; word-break: break-all;">{{ item.shop_name }}</div>
              <div 
                style="color: #767676; font-weight: bold;" 
                :style="selectedShop.shop_id === item.shop_id ? 'color: #3a8ee6;' : ''"
              >{{item.total_of_order}}</div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown placement="bottom" @command="orderIsSavedStatusHandler">
          <el-button 
            type="info-addon"
            class="el-dropdown-link tag-button-tokped box-shadow-null"
          >
            Penyimpanan <i class="el-icon-arrow-down"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item 
              v-for="item in computedIsSavedStatus"
              :key="item.command"
              :command="item.command" 
              class="flex-container"
              :style="selectedIsSavedStatus.caption === item.caption ? 'color: #3a8ee6;' : ''"
            >
              <span>{{item.caption}}</span>
              <span 
                style="color: #767676; font-weight: bold; margin-left: auto"
                :style="selectedIsSavedStatus.caption === item.caption ? 'color: #3a8ee6;' : ''"
              >{{ item.value }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown placement="bottom" @command="orderStatusHander">
          <el-button 
            type="info-addon"
            class="el-dropdown-link tag-button-tokped box-shadow-null"
          >
            Status pesanan <i class="el-icon-arrow-down"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item 
              v-for="item in computedShopeeOrderStatus" 
              :key="item.caption"
              class="flex-container" 
              :command="item"
              :style="selectedOrderStatus.code === item.code ? 'color: #3a8ee6;' : ''"
            >
              <span>{{item.caption}} </span>
              <span 
                style="color: #767676; font-weight: bold; margin-left: auto"
                :style="selectedOrderStatus.code === item.code ? 'color: #3a8ee6;' : ''"
              >{{item.value}}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="table-handler-flex full-width text-right" style="display: unset;">
          <el-input 
            v-model="search" 
            @change="searchHandler" 
            class="input-search" 
            clearable 
            :placeholder="lang.search" 
            prefix-icon="el-icon-search" 
            size="small" 
            style="max-width: 328px"
          />
        </div>
        <el-dropdown
          trigger="click"
          placement="bottom"
          @command="handleDropdownSync"
          style="margin-left: 14px;"
        >
          <i class="el-icon-more" style="font-size: 20px; transform: rotate(90deg)"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="product" style="display: flex; align-items: center; font-weight: bold;">
              <i class="el-icon-refresh" style="font-size: 20px; font-weight: bold; margin-right: 16px;"/>{{ rootLang.update_product }} Shopee
            </el-dropdown-item>
            <el-dropdown-item command="order" style="display: flex; align-items: center; font-weight: bold;">
              <i class="el-icon-refresh" style="font-size: 20px; font-weight: bold; margin-right: 16px;"/>{{ rootLang.update_order }} Shopee
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="like-table-wrapper mt-16 border border--table-border">
        <div class="like-table-wrapper--item">
          <div
            v-for="(item, index) in tableHead" 
            :key="item.formattedField"
            class="custom-table custom-table--head"
          >
            <div 
              class="pointer"
              style="display:flex; align-items: center;"
              :style="item.justify === 'center' ? 'justify-content: center;' : ''"
              @click="sortingByHeadHandler(item, index)"
            >
              <span>{{item.name}}</span> 
              <template v-if="item.arrowUp"> 
                <i class="el-icon-top" style="font-size: 20px; font-weight: bold; margin-left: 8px; color: #afb0af"/>
              </template>
              <template v-else> 
                <i class="el-icon-bottom" style="font-size: 20px; font-weight: bold; margin-left: 8px; color: #afb0af"/>
              </template>
            </div>
          </div>
          <div class="custom-table custom-table--head" />
        </div>
      </div>
      <perfect-scrollbar class="scrollBulkPair">
        <div v-loading="loadingSync" class="like-table-wrapper border border--table-border" style="height: 100%">
          <template v-if="!loadingSync">
            <div 
              v-for="(item) in dataOrder" 
              :key="item.id" 
              class="like-table-wrapper--item"
            >
              <div class="custom-table custom-table--body" style="display:flex; align-items: center;">
                <div>
                  <el-avatar :size="40" :src="item.shopee_shop_images[0]">
                    <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"/>
                  </el-avatar>
                </div>
                <div class="font-14 ml-12" style="word-break: break-all">{{ item.shopee_shop_name }}</div>
              </div>
              <div class="custom-table custom-table--body">
                <div class="font-bold font-14 word-break color-shopee">
                  {{ item.invoice_num }}
                </div>
              </div>
              <div class="custom-table custom-table--body" :class="statusStylesGenerator(item.status_code)">
                {{ item.status }}
              </div>
              <div class="custom-table custom-table--body">
                <router-link v-if="item.invoice_olsera" :to="{ path: '/sales/openorder/' + item.order_id_olsera }">
                  <div class="px-8" style="padding-left: 0;">
                    <span class="color-primary font-bold pointer"> {{ item.invoice_olsera }} </span>
                  </div>
                </router-link>
                <span v-else class="text-center">Belum ada</span>
              </div>
              <div class="custom-table custom-table--body text-center">
                <div v-if="!item.status_code_olsera">
                  <p>-</p>
                </div>
                <div v-else >
                  <div :class="olseraStatusStyleGenerator(item.status_code_olsera)">
                    {{ olseraStatusGenerator(item.status_code_olsera) }}
                  </div>
                </div>
              </div>
              <!-- Action stats -->
              <template v-if="item.status_save === 0">
                <div class="custom-table custom-table--body text-center">
                  <el-button 
                    round 
                    type="shopee--plain" 
                    plain 
                    style="width: 95%" 
                    @click="handleSyncDialog(item)">
                      {{ lang.save }}
                    </el-button>
                </div>
              </template>
              <template v-else>
                <template v-if="item.status_code !== 'CANCELLED'">
                  <template v-if="item.request_shipping === 0 || item.request_shipping === null">
                    <div class="custom-table custom-table--body text-center">
                      <el-button 
                        round 
                        type="shopee" 
                        plain 
                        style="width: 95%" 
                        @click="handleSyncDialog(item)"
                      >Atur Pengiriman</el-button>
                    </div>
                  </template>
                  <template v-else-if="item.request_shipping === 1">
                    <div class="custom-table custom-table--body text-center">
                      <el-button 
                        round 
                        type="shopee" 
                        style="width: 95%" 
                        plain 
                        @click="handleSyncDialog(item)"
                      >Req pickup</el-button>
                    </div>
                  </template>
                  <template v-else-if="item.request_shipping === 2">
                    <div class="custom-table custom-table--body text-center">
                      <div 
                        class="pointer" 
                        style="font-weight: bold; color: #EE4E2E"
                        @click="handleSyncDialog(item)"
                      >Antar Sendiri</div>
                    </div>
                  </template>
                  <template v-else-if="item.request_shipping === 3">
                    <div class="custom-table custom-table--body text-center">
                      <div 
                        class="pointer" 
                        style="font-weight: bold; color: #EE4E2E"
                        @click="handleSyncDialog(item)"
                      >Non Integrated</div>
                    </div>
                  </template>
                </template>
                <template v-else>
                  <div class="custom-table custom-table--body text-center">
                    <el-button round type="shopee" style="width: 95%" plain @click="handleSyncDialog(item)">{{ rootLang.saved }}</el-button>
                  </div>
                </template>
              </template>
              <!--  -->
            </div>
          </template>
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
    <!-- dialog sync product/order -->
    <el-dialog
      :visible.sync="dialogSync.state"
      :before-close="closeDialogSyncHandler"
      :show-close="true"
      append-to-body
    >
      <div slot="title" class="flex-container">
        <h4 v-if="dialogSync.type === 0" class="dialog-title full-width">
          {{ rootLang.update_product }} Shopee
        </h4>
        <h4 v-else class="dialog-title full-width">
          {{ rootLang.update_order }} Shopee
        </h4>
      </div>
      <div class="text-center" style="margin-top: -20px;">
        <div v-if="dialogSync.type === 1" class="mb-4" style="flex-grow: 1;">
          <date-range-picker
            :init-date="initParamDate"
            :all-time="allTimeDate"
            :custom-range-only="true"
            @picked="datePicked"
          />
        </div>
        <div class="mt-16">
          <div 
            v-for="(item, index) in shopeeShopListProcess" 
            :key="item.shop_id" 
            style="display: flex; align-items: center; padding: 8px; margin-bottom: 8px; background-color: #f5f5f5; border-radius: 8px"
          >
            <el-avatar 
              :size="40" 
              :src="item.shop_images[0]" 
            >
              <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"/>
            </el-avatar> 
            <div style="margin-left: 8px; text-align: left">
              <div>{{item.shop_name}}</div>
              <template v-if="dialogSync.type === 0">
                <div v-if="!item.isLoadingSyncProduct" style="font-size: 12px; color: #767676">
                  {{ item.total_of_product }} {{ rootLang.product }}
                </div>
                <div v-else style="font-size: 12px; color: #767676">{{ rootLang.updating }}...</div>
              </template>
              <template v-else-if="dialogSync.type === 1">
                <div v-if="!item.isLoadingSyncOrder" style="font-size: 12px; color: #767676">
                  {{ item.total_of_order }} {{ rootLang.order }}
                </div>
                <div v-else style="font-size: 12px; color: #767676">{{ rootLang.updating }}...</div>
              </template>
            </div>
            <div class="pointer" style="margin-left: auto;">
              <template v-if="dialogSync.type === 0">
                <template v-if="!item.isLoadingSyncProduct">
                  <div @click="syncItemHandler(index, item, dialogSync.type === 0 ? 'product' : 'order')">
                    <i class="el-icon-refresh" style="font-size: 24px; color: #1685c7"/>
                  </div>
                </template>
                <template v-else>
                  <div @click="cancelSyncItemHandler(index, dialogSync.type === 0 ? 'product' : 'order')">
                    <svg-icon icon-class="x-red" style="font-size: 24px"/>
                  </div>
                </template>
              </template>
              <template v-else-if="dialogSync.type === 1">
                <template v-if="!item.isLoadingSyncOrder">
                  <div @click="syncItemHandler(index, item, dialogSync.type === 0 ? 'product' : 'order')">
                    <i class="el-icon-refresh" style="font-size: 24px; color: #1685c7"/>
                  </div>
                </template>
                <template v-else>
                  <div @click="cancelSyncItemHandler(index, dialogSync.type === 0 ? 'product' : 'order')">
                    <svg-icon icon-class="x-red" style="font-size: 24px"/>
                  </div>
                </template>
              </template>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- dialog process saving order -->
    <offscreen-order-shopee
      :show="visibleSyncOrder"
      :form-edit="tempDataSync"
      :loading-save="loadingSavePair"
      @saveproduct="handleSaveOrder"
      @updatedata="handleUpdateDataSaveOrder"
      @refetch-after-select-shipping="reFecthAfterSelectShipping"
      @cancel="visibleSyncOrder = false"
    />
  </el-dialog>
</template>
<script>
import moment from 'moment'
import axios from 'axios'
import basicComputedMixin from '@/mixins/basicComputedMixin'
import offscreenOrderShopee from './offscreenOrderShopee'
import InlineUpdateStatus from '@/components/InlineUpdateStatus'
import CloseEsc from '@/components/modules/CloseEsc'
import dateRangePicker from '@/components/modules/DateRangePicker'
import { 
  saveOrderShopee, 
  syncOrderShopeeByStore,
  syncProductShopeeByStore,
} from '@/api/thirdParty/shopee'

export default {
  name: 'DialogOrderShopee',

  components: {
    offscreenOrderShopee,
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
    meta: {
      type: Object,
      default: {}
    },
    shopeeShopList: {
      type: Array,
      default: () => []
    },
    shopeeOrderStatus: {
      type: Object,
      default: () => {}
    },
    loadingSync: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      visibleSyncOrder: false,
      dialogSync: {
        state: false,
        // 0: product, 1: order.
        type: null
      },
      tempDataSync: {},
      loadingSync: false,
      loadingSavePair: false,
      paramsSync: {
        create_to: moment().format('YYYY-MM-DD'),
        create_from: moment().format('YYYY-MM-DD'),
        page: 1,
        per_page: 100
      },
      initParamDate: '',
      allTimeDate: '',
      shopeeShopListProcess: [],
      tableHead: [
        { name: '', justify: 'left', arrowUp: true, formattedField: 'shopee_shop_name' },
        { name: '', justify: 'left', arrowUp: true, formattedField: 'invoice_num' },
        { name: '', justify: 'center', arrowUp: true, formattedField: 'status' },
        { name: '', justify: 'left', arrowUp: true ,formattedField: 'invoice_olsera' },
        { name: '', justify: 'center', arrowUp: true, formattedField: 'status_olsera' },
      ],
      search: '',      
      selectedShop: { shop_id: ''},
      selectedIsSavedStatus: { caption: '', value: '' },
      selectedOrderStatus: { caption: '', value: '', code: '' },
      selectedSort: { column: '', isTypeAsc: true },
    }
  },

  created() {
    this.tableHead[0].name = this.rootLang.shopee_account
    this.tableHead[1].name = this.rootLang.shopee_order
    this.tableHead[2].name = this.rootLang.status
    this.tableHead[3].name = this.rootLang.olsera_order
    this.tableHead[4].name = this.rootLang.status
    this.selectedIsSavedStatus.caption = this.rootLang.all
    this.selectedOrderStatus.caption = this.rootLang.all
  },

  watch: {
    show: function(value) {
      if (value) {
        this.shopeeShopListProcess = this.shopeeShopList.map((item) => {
          const tempSyncData = {
            isLoadingSyncOrder: false, 
            cancelSyncOrderSource: axios.CancelToken.source(),
            isLoadingSyncProduct: false,
            cancelSyncProductSource: axios.CancelToken.source(),
          }
          return {
            ...item,
            ...tempSyncData
          }
        })
      } else {
        this.shopeeShopListProcess = []
        let tempArr = [...this.tableHead]
        tempArr.forEach((e) => {
          e.arrowUp = true
        }) 
        this.tableHead = [...tempArr]
        this.selectedShop = { shop_id: ''}
        this.selectedIsSavedStatus = { caption: this.rootLang.all, value: '' }
        this.selectedOrderStatus = { caption: this.rootLang.all, value: '', code: ''}
        this.selectedSort = { column: '', isTypeAsc: true }
        this.search = ''
      }
    },
    dataOrder: function(value) {
      // console.log(value)
    }
  },

  computed: {
    disableSynOrder () {
      let start = moment(this.paramsSync.create_from)
      let end = moment(this.paramsSync.create_to)
      let rangeDate = moment.duration(end.diff(start)).asDays()
      if (rangeDate + 1 > 90) {
        return true
      } else {
        return false
      }
    },

    computedIsSavedStatus() {
      let data = [
        { caption: this.rootLang.all, command: 'all', value: this.shopeeOrderStatus.total },
        { caption: this.rootLang.saved, command: 'saved', value: this.shopeeOrderStatus.total_saved },
        { caption: this.rootLang.unsaved, command: 'not_saved', value: this.shopeeOrderStatus.total_unsaved }
      ]
      return data
    },

    computedShopeeOrderStatus() {
      let data = [
        {caption: this.rootLang.all, value: this.shopeeOrderStatus.total, code: ''},
        {caption: 'Perlu dikirim', value: this.shopeeOrderStatus.total_ready_to_ship, code: 'READY_TO_SHIP'},
        {caption: 'Dikirim', value: this.shopeeOrderStatus.total_shipped, code: 'SHIPPED'},
        {caption: 'Pembatalan', value: this.shopeeOrderStatus.total_cancelled, code: 'CANCELLED'},
        {caption: 'Pengembalian', value: this.shopeeOrderStatus.total_to_return, code: 'TO_RETURN'},
        {caption: 'Selesai', value: this.shopeeOrderStatus.total_complate, code: 'COMPLETED'},
        {caption: 'Pengajuan batal', value: this.shopeeOrderStatus.total_in_cancel, code: 'IN_CANCEL'},
        {caption: 'Konfirmasi diterima', value: this.shopeeOrderStatus.total_to_confirm_receive, code: 'TO_CONFIRM_RECEIVE'},
      ]
      return data
    },

    computedTotalOrderAllShop(){
      if (this.shopeeShopList.length === 0) return { total_of_order: 0 }
      return this.shopeeShopList.reduce((prev, curr) => ({ total_of_order: prev.total_of_order + curr.total_of_order }))
    }
  },

  methods: {
    handleClose () {
      this.tempDataSync = {}
      this.$emit('close')
    },

    handleSaveOrder(data) {
      let dataSave = {
        shopee_shop_id: data.shop_id,
        id: data.id
      }
      this.loadingSavePair = true
      saveOrderShopee(dataSave).then(response => {
        this.$message({
          type: 'success',
          message: 'Success save data'
        })
        this.$emit('refresh')
        this.visibleSyncOrder = false
        this.loadingSavePair = false
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingSavePair = false
      })
    },

    handleSyncDialog (item) {
      this.tempDataSync = { ...item}
      this.visibleSyncOrder = true
    },

    handleChangePage (page) {
      this.$emit('changepage', page)
    },

    handleChangeSizePage (page) {
      this.meta.page_size = page
      this.$emit('changepagesize', page)
    },

    showData (shopId, isSavedStatus, orderStatus, searchText, sortOpt) {
      this.$emit('filter', shopId, isSavedStatus, orderStatus, searchText, sortOpt)
    },

    shopSelectHandler(payload) {
      this.selectedShop = { ...payload }
      this.showData(
        this.selectedShop.shop_id, 
        this.selectedIsSavedStatus.value, 
        this.selectedOrderStatus.code, 
        this.search, 
        this.selectedSort
      )
    },

    orderIsSavedStatusHandler(payload) {
      if (payload === 'saved') {
        this.selectedIsSavedStatus = { caption: this.rootLang.saved, value: 1 }
      } else if (payload === 'not_saved'){
        this.selectedIsSavedStatus = { caption: this.rootLang.unsaved, value: 0 }
      } else {
        this.selectedIsSavedStatus = { caption: this.rootLang.all, value: '' }
      }
      this.showData(
        this.selectedShop.shop_id, 
        this.selectedIsSavedStatus.value, 
        this.selectedOrderStatus.code, 
        this.search, 
        this.selectedSort
      )
    },

    orderStatusHander(payload) {
      this.selectedOrderStatus = { ...payload }
      this.showData(
        this.selectedShop.shop_id, 
        this.selectedIsSavedStatus.value, 
        this.selectedOrderStatus.code, 
        this.search, 
        this.selectedSort
      )
    },

    searchHandler() {
      this.showData(
        this.selectedShop.shop_id, 
        this.selectedIsSavedStatus.value, 
        this.selectedOrderStatus.code, 
        this.search, 
        this.selectedSort
      )
    },

    handleUpdateDataSaveOrder (data) {
      this.tempDataSync = { ...data}
    },

    handleDropdownSync(command) {
      if (command === 'product') {
        this.dialogSync = {
          state: true,
          type: 0
        }
      }
      if (command === 'order') {
        this.dialogSync = {
          state: true,
          type: 1
        }
      }
    },

    datePicked (value) {
      if (value) {
        this.paramsSync.create_from = value.start_date
        this.paramsSync.create_to = value.end_date
      }
    },

    closeDialogSyncHandler () {
      this.paramsSync.create_to = moment().format('YYYY-MM-DD')
      this.paramsSync.create_from = moment().format('YYYY-MM-DD')
      this.dialogSync = {
        state: false,
        type: null
      }
    },

    statusStylesGenerator(payload) {
      if (payload === 'COMPLETED') {
        return 'status-badge status-badge--done'
      }
      if (payload === 'READY_TO_SHIP') {
        return 'status-badge status-badge--primary'
      }
      if (payload === 'PROCESSED') {
        return 'status-badge status-badge--primary'
      }
      if (payload === 'TO_CONFIRM_RECEIVE') {
        return 'status-badge status-badge--primary'
      }
      if (payload === 'CANCELLED') {
        return 'status-badge status-badge--error'
      }
      return 'status-badge status-badge--error'
    },

    olseraStatusGenerator(payload) {
      if (payload === 'Z') return this.rootLang.complete
      if (payload === 'A') return this.rootLang.has_confirm
      if (payload === 'T') return this.rootLang.delivered
      if (payload === 'S') return this.rootLang.being_sent
      if (payload === 'P') return this.rootLang.pending
      if (payload === 'X') return this.rootLang.cancel
      return 'Case unknown!'
    },

    olseraStatusStyleGenerator(payload) {
      if (payload === 'Z') return 'status-badge bg-less bg-less--done'
      if (payload === 'A') return 'status-badge bg-less bg-less--primary'
      if (payload === 'T') return 'status-badge bg-less bg-less--primary'
      if (payload === 'S') return 'status-badge bg-less bg-less--primary'
      if (payload === 'P') return 'status-badge bg-less bg-less--warning'
      if (payload === 'X') return 'status-badge bg-less bg-less--error'
      return 'status-badge bg-less bg-less--error'
    },

    async syncItemHandler(idx, item, type) {  
      const data = {
        shopee_shop_id: item.shop_id,
      }
      const tempArr = [...this.shopeeShopListProcess]
      this.loadingSync = true
      try {
        let updatedItem
        if (type === 'product'){
          tempArr[idx].isLoadingSyncProduct = true
          await syncProductShopeeByStore(data, tempArr[idx].cancelSyncProductSource.token)
          updatedItem = this.rootLang.product
        }
        if (type === 'order'){
          tempArr[idx].isLoadingSyncOrder = true
          data.create_from = this.paramsSync.create_from
          data.create_to = this.paramsSync.create_to 
          await syncOrderShopeeByStore(data, tempArr[idx].cancelSyncOrderSource.token)
          updatedItem = this.rootLang.order
        }
        this.$message({
          type: 'success',
          message: `${this.rootLang.update_succeed} ${updatedItem.toLowerCase()}`
        })
        this.$emit('syncitem')
        this.shopeeShopListProcess = [...tempArr]
      }
      catch (error) {
        if (error.isCancelled) return
        this.$message({
          type: 'error',
          message: error.message
        })
      }
      finally {
        this.loadingSync = false
        if (type === 'product'){
          tempArr[idx].isLoadingSyncProduct = false
        }
        if (type === 'order'){
          tempArr[idx].isLoadingSyncOrder = false
        }
      }
    },

    cancelSyncItemHandler(idx, type) {
      const tempArr = [...this.shopeeShopListProcess]
      if (type === 'product'){
        tempArr[idx].isLoadingSyncProduct = false
        tempArr[idx].cancelSyncProductSource.cancel()
        tempArr[idx].cancelSyncProductSource = axios.CancelToken.source()
      }
      if (type === 'order'){
        tempArr[idx].isLoadingSyncOrder = false
        tempArr[idx].cancelSyncOrderSource.cancel()
        tempArr[idx].cancelSyncOrderSource = axios.CancelToken.source()
      }
      
    },

    sortingByHeadHandler(item, idx) {
      let tempArr = [...this.tableHead]
      tempArr.forEach((e, index) => {
        if (index === idx) return
        e.arrowUp = true
      })
      tempArr[idx].arrowUp = !tempArr[idx].arrowUp
      this.tableHead = [...tempArr]
      this.selectedSort = { column: item.formattedField, isTypeAsc: item.arrowUp }
      this.showData(
        this.selectedShop.shop_id, 
        this.selectedIsSavedStatus.value, 
        this.selectedOrderStatus.code, 
        this.search, 
        this.selectedSort
      )
    },

    reFecthAfterSelectShipping(){
      this.showData(
        this.selectedShop.shop_id, 
        this.selectedIsSavedStatus.value, 
        this.selectedOrderStatus.code, 
        this.search, 
        this.selectedSort
      )
    },
  }
}
</script>

<style lang="scss" scoped>

.status-badge {
  color: white;
  min-width: 133px;
  height: 24px;
  font-weight: 600;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;

  &--done {
    background-color: #6EBE46;
  }

  &--primary {
    background-color: #1685C7;
  }

  &--warning {
    background-color: #FF931E
  }

  &--error {
    background-color: #F44336
  }
}

.bg-less {
  border: 2px solid;
  background-color: transparent;

  &--done {
    color: #6EBE46;
    border-color: #6EBE46;
  }

  &--primary {
    color: #1685C7;
    border-color: #1685C7;
  }

  &--warning {
    color: #FF931E;
    border-color: #FF931E;
  }

  &--error {
    color: #F44336;
    border-color: #F44336;
  }
}

.like-table-wrapper--item {
  gap: 16px;
}

.custom-table {
  min-width: 15.5%;
  &--head {
    font-size: 16px;
    font-weight: bold;
  }

  &--body {
   font-size: 14px; 
  }
}

</style>