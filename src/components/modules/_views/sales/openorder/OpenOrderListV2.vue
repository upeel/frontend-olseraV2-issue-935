<template>
  <div>
    <div class="main-content">
      <notif-order-marketplace 
        :tokped-access-by-store="tokpedAccessByStore" 
        :data-order="countOrderMarketplace" 
        :loading="loadingMarketplace"
        @getorder="handleGetOrderMarketplace"
      />

      <div class="table-handler-flex mt-24">
        <div style="flex-grow: 1;">
          <h4 class="main-content__title">{{ $lang[langId].order_need_process }}</h4>
          <p class="main-content__subtitle">{{ params.total }} {{ lang.orders }}</p>
        </div>

        <div>
          <button-action-authenticated :permission="['sales/openorders', 'edit']" type="info" @click="importDialog = true">
            {{ lang.import_update_status }}
          </button-action-authenticated>
          <router-link :to="{name: 'Open Order Create'}">
            <button-action-authenticated :permission="['sales/openorders', 'store']" type="primary" icon="el-icon-plus">
              {{ lang.add }}
            </button-action-authenticated>
          </router-link>
        </div>
      </div>

      <div class="table-handler-flex mb-16">
        <div
          class="mb-4"
          style="flex-grow: 1;">
          <el-select class="inline-form" v-model="params.per_page" @change="changePageTable" filterable :placeholder="lang.please_select" size="small">
            <el-option v-for="item in pages" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        
        <div class="mb-4" style="flex-grow: 1;">
          <date-range-picker
            :init-date="initParamDate"
            :attendance="true"
            :all-time="allTimeDate"
            :use-all-time="true"
            @picked="datePicked"
            @reset="resetDate"
          />
        </div>

        <div class="mb-4">
          <el-tag v-if="filterTag" type="info" @close="closeFilterTag" closable>
            {{ filterTag }}
          </el-tag>

          <el-input class="inline-form input-search" clearable :placeholder="lang.search +' '+ lang.orders" prefix-icon="el-icon-search" v-model="params.search" @change="handleSearch" size="small"></el-input>

          <el-select class="inline-form" v-model="statusValue" @change="handleStatusSelect" :placeholder="lang.please_select" size="small">
            <el-option v-for="item in statusSelect" :key="item.value" :label="item.label" :value="item"></el-option>
          </el-select>

          <!-- <el-button type="info" size="small" @click="toggleFilter">
            <i class="fa fa-filter" />
            {{ $lang[langId].filter }}
          </el-button> -->
        </div>
      </div>

      <el-table
        v-loading="loading"
        :data="openOrderData"
        stripe
        border
        class="sales-table-max-height mobile-fix-height-unset"
        @sort-change="changeSortTable">
        <el-table-column
          :label="lang.order_no"
          sortable
          prop="order_no"
          width="230">
          <template slot-scope="props" >
            <list-order-marketplace v-if="marketplaceCode.includes(props.row.order_source) && (selectedStore.url_id === 'setdemo1' || selectedStore.url_id === 'allinolsera2')" :order="props.row" :loading-pair="loadingPair" @detailorder="handleGetDetailOrder" />
            <div v-else class="flex-container">
              <el-avatar src="/static/img/logo-olsera-icon.png" :size="20" />
              <router-link :to="{ path: selectedStore.url_id === 'setdemo1' || selectedStore.url_id === 'allinolsera2' ? '/sales/openorderV2/'  + props.row.id : '/sales/openorder/' + props.row.id }">
                <div class="px-8">
                  {{ props.row.order_no }}
                </div>
              </router-link>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          width="140"
          :label="lang.sales_date"
          sortable
          prop="order_date">
          <template slot-scope="props">
            <div v-if="!props.row.forder_date">
              <p>-</p>
            </div>
            <div v-else>
              <p>{{ props.row.forder_date }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          width="140"
          :label="lang.due_date"
          sortable
          prop="payment_due_date">
          <template slot-scope="props">
            <div v-if="!props.row.fpayment_due_date">
              <p>-</p>
            </div>
            <div v-else>
              <p>{{ props.row.fpayment_due_date }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="lang.customer"
          sortable
          min-width="150px"
          prop="customer_name">
          <template slot-scope="props">
            <strong>{{ props.row.customer_name }}</strong><br/>
            <small>{{ props.row.customer_email }}</small>
          </template>
        </el-table-column>
        <el-table-column
          :label="lang.shipping_to"
          min-width="180px">
          <template slot-scope="props">
            <strong class="show-white-space">{{ props.row.shipping_text }}</strong><br/>
            <!-- <small>{{ props.row.shipping_courier_name }}</small> -->
          </template>
        </el-table-column>
        <el-table-column :label="lang.total" sortable prop="ftotal_amount" min-width="120px" />
        <el-table-column
          :label="lang.status"
          prop="status"
          width="120"
          sortable>
          <template slot-scope="props">
            <div v-if="!props.row.status">
              <p>-</p>
            </div>
            <inline-update-status
              :loading="loadingUpdateStatus"
              :status="props.row.status"
              :item-id="props.row.id"
              :additional-data="props.row"
              type="product-buy-price"
              @update="handleUpdateStatus($event, props.$index)"
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="lang.paid"
          prop="is_paid"
          sortable
          width="150">
          <template slot-scope="props">
            <div v-if="props.row.is_paid === 0">
              <!-- <el-tag size="mini" type="danger">{{ lang.not_yet }}</el-tag> -->
              <div v-if="props.row.payment_type_id === 'CT'">
                <el-tag size="mini" type="danger" effect="dark">{{ lang.not_yet }}</el-tag>
              </div>
              <div v-else>
                <div v-if="props.row.payment_ref || props.row.payment_from_bank">
                  <el-tag size="mini" type="warning" effect="dark">{{ lang.not_yet }}</el-tag>
                </div>
                <div v-else>
                  <el-tag size="mini" type="info" effect="dark">{{ lang.not_yet }}</el-tag>
                </div>
              </div>
            </div>
            <div v-if="props.row.is_paid === 1">
              <el-tag size="mini" type="success" effect="dark">{{ rootLang.done }}</el-tag>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="block">
        <el-pagination
          @size-change="changePageTable"
          @current-change="changeCurrentPage"
          :current-page.sync="params.currentPage"
          :page-size="params.per_page"
          layout="prev, pager, next, jumper"
          :total="params.total"
        />
      </div>
    </div>

    <el-dialog
      :title="lang.import"
      :visible.sync="importDialog"
      custom-class="mw-760"
      @close="cancelImport">
      <el-row :gutter="12">
        <el-col :md="8">
          <a
            :href="baseURL + 'olsera_order_status_import_template.csv'"
            class="btn btn-default btn-block"
            target="_blank">
            {{ lang.download_template }}
          </a>
          <div class="mt-8">
            <div class="font-bold mb-8">{{ lang.description }}</div>
            {{ lang.status }}<br>
            P = {{ $lang[langId].pending }}<br>
            A = {{ $lang[langId].has_confirm }}<br>
            S = {{ $lang[langId].being_sent }}<br>
            T = {{ lang.delivered }}<br>
            Z = {{ $lang[langId].complete }}<br>
            X = {{ lang.cancel }}<br>
            {{ lang.import_from_csv_info }}<br>
          </div>
        </el-col>

        <el-col :md="16">
          <div class="font-18 font-bold mb-8">
            {{ lang.import_from_csv_info }}
          </div>
          <div class="mb-8">
            <vue-dropzone
              ref="dropzone"
              id="drop1"
              :options="{
                url: baseURL + 'api/' + this.selectedStore.url_id + '/admin/v1/' + this.langId + '/openorder/importfromcsv',
                headers: {
                  'Authorization' : 'Bearer ' + this.token.access_token,
                  'Cache-Control': null,
                },
                method: 'post',
                acceptedFiles: '.csv'
                }"
              @vdropzone-success="afterComplete"
              @vdropzone-error="failed"
            />
          </div>
          <!-- <el-button
            @click="removeAllFiles">
            {{ $lang[langId].remove_all_file }}
          </el-button> -->

          <el-card v-if="tableImport">
            <div slot="header" class="clearfix" v-if="errorImport != 0">
              {{ $lang[langId].error_at }} {{errorImport}}. {{ $lang[langId].fix_upload_error }}.
            </div>

            <el-table
              ref="multipleTable"
              v-loading="loading"
              @selection-change="handleSelectionChange"
              @sort-change="handleSortChange"
              :data="tableImportCustomer"
              :default-sort="{prop: 'id', order: 'ascending'}"
              style="width: 100%"
              :row-class-name="tableRowClassName">

              <el-table-column :label="$lang[langId].number" type="index" :index="indexMethod">
              </el-table-column>

              <el-table-column :label="lang.order_no" prop="name" sortable min-width="200" class="red">
                <template slot-scope="props">
                    <strong>{{ props.row.order_no }}</strong>
                </template>
              </el-table-column>

              <el-table-column :label="lang.shipping_date" prop="shipping_date" sortable width="200">
              </el-table-column>

              <el-table-column :label="lang.tracking_no" prop="shipping_track_no" sortable width="150">
              </el-table-column>

              <el-table-column
                :label="lang.status"
                width="120"
                sortable>
                <template slot-scope="props">
                  <div style="font-size: 14px" v-if="props.row.update_status == 'S'">
                    {{ rootLang.being_sent }}
                  </div>
                  <div style="font-size: 14px" v-if="props.row.update_status == 'X'">
                    {{ lang.cancel }}
                  </div>
                  <div style="font-size: 14px" v-if="props.row.update_status == 'P'">
                    {{ rootLang.pending }}
                  </div>
                  <div style="font-size: 14px" v-if="props.row.update_status == 'A'">
                    {{ rootLang.has_confirm }}
                  </div>
                  <div style="font-size: 14px" v-if="props.row.update_status == 'T'">
                    {{ lang.delivered }}
                  </div>
                  <div style="font-size: 14px" v-if="props.row.update_status == 'Z'">
                    {{ rootLang.complete }}
                  </div>
                </template>
              </el-table-column>

              <el-table-column :label="lang.status+' '+lang.error" prop="error" sortable width="200">
              </el-table-column>

            </el-table>
          </el-card>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button
          type="info"
          @click="cancelImport">
          {{ lang.cancel }}
        </el-button>
        <el-button
          :disabled="btnProses"
          type="primary"
          @click="saveImportData">
          {{ lang.proceed }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="visibleSynProduct"
      :show-close="false"
      width="536px"
      @close="visibleSynProduct = false">
      <div slot="title" class="flex-container">
        <h4 class="dialog-title full-width font-bold font-24">
          Sinkronkan Stock
        </h4>
        <template>
          <el-button type="info" @click="cancelSameStock">{{ rootLang.cancel }}</el-button>
          <el-button type="tokopedia" :loading="loadingSync" @click="syncDataProduct">{{ rootLang.sync }}</el-button>
        </template>
      </div>
      <div>
        <img v-if="marketPlaceSelect === 'tokped'" src="/static/img/service-activation/tokopedia/sync_product_order.png" >
        <img v-if="marketPlaceSelect === 'shopee'" src="/static/img/service-activation/shopee/sync_product2.png" >
        <div class="mt-24 word-break font-14 text-center">
          Beberapa produk di {{ marketPlaceSelect === 'tokped'? 'Tokopedia' : marketPlaceSelect === 'tokped'? 'Shopee' : '' }} butuh disinkronkan terlebih dahulu!
        </div>
        <!-- <div class="mt-24 word-break font-16">
          Tekan tombol <span class="font-bold"> Sinkronkan</span> untuk melanjutkan. Kunjungi menu <span class="font-bold">Aktivasi Layanan > {{ marketPlaceSelect === 'tokped'? 'Tokopedia' : marketPlaceSelect === 'tokped'? 'Shopee' : '' }}</span> untuk pengaturan lebih lanjut.
        </div> -->
      </div>
    </el-dialog>

    <dialog-order-tokopedia
      :show="visibleOrderTokopedia"
      :data-order="dataOrderTokopedia"
      :total-save="totalSave"
      :total-unsave="totalUnsave"
      :meta="metaOrderTokped"
      @filter="handleFilter"
      @filterstore="handleFilterStore"
      @search="handleSearchTokped"
      @refresh="handleRefresh('tokped')"
      @syncproduct="handleSyncTokped"
      @changepage="changePageTokped"
      @changepagesize="changePageSizeTokped"
      @close="handleCloseDialog('tokped')"
    />

    <dialog-order-shopee
      :show="visibleOrderShopee"
      :data-order="dataOrderShopee"
      :shopee-shop-list="shopeeShopList"
      :shopee-order-status="shopeeOrderStatus"
      :meta="metaOrderShopee"
      :loading-sync="loadingShopee"
      @filter="handleFilterShopee"
      @refresh="handleRefresh('shopee')"
      @syncitem="handleSyncShopee"
      @changepage="changePageShopee"
      @changepagesize="changePageSizeShopee"
      @close="handleCloseDialog('shopee')"
    />

    <dialog-order-lazada
      :show="visibleOrderLazada"
      :data-order="dataOrderLazada"
      :total-save="totalSaveLazada"
      :total-unsave="totalUnsaveLazada"
      :meta="metaOrderLazada"
      @filter="handleFilterLazada"
      @search="handleSearchLazada"
      @refresh="handleRefreshLazada"
      @syncproduct="handleSyncLazada"
      @changepage="changePageLazada"
      @changepagesize="changePageSizeLazada"
      @close="handleCloseDialogLazada"
    />

    <el-dialog
      :visible.sync="lazadaSyncProduct"
      :show-close="false"
      width="536px"
      @close="lazadaSyncProduct = false">
      <div slot="title" class="flex-container">
        <h4 class="dialog-title full-width font-bold font-20">
          {{ rootLang.sync_product }}
        </h4>
        <template>
          <el-button type="info" @click="cancelSyncLazada">{{ rootLang.cancel }}</el-button>
          <el-button type="tokopedia" :loading="loadingSync" @click="syncDataLazada">{{ rootLang.sync }}</el-button>
        </template>
      </div>
      <div>
        <img src="/static/img/service-activation/lazada/sync_product.png" >
        <div class="mt-24 word-break font-20 font-bold">
          {{rootLang.lazada_sync_info}}
        </div>
        <div class="mt-24 word-break font-16" v-html="rootLang.lazada_sync_action">
          
        </div>
      </div>
    </el-dialog>
    <dialog-order-blibli
      :show="visibleOrderBlibli"
      @close="visibleOrderBlibli = false"
    />

    <custom-date-filter
      :show-filter="showFilter"
      @close="dateFilterClose"
      @reset="dateFilterReset"
      @save="dateFilterSave"
    />

    <offscreen-order-tokopedia
      :show="visibleSynOrderTokopedia"
      :form-edit="tempDataSyncTokopedia"
      :loading-save="loadingSavePair"
      :from-list="true"
      @cancel="visibleSynOrderTokopedia = false"
    />

    <offscreen-order-shopee
      :show="visibleSyncShopee"
      :form-edit="tempDataSyncShopee"
      :loading-save="loadingSavePair"
      :from-list="true"
      @cancel="visibleSyncShopee = false"
    />

    <offscreen-order-lazada
      :show="visibleSyncLazada"
      :form-edit="tempDataSyncLazada"
      :loading-save="loadingSavePair"
      :form-list="true"
      @cancel="visibleSyncLazada = false"
    />
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import moment from 'moment'
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import CustomDateFilter from 'modules/CustomDateFilter'
import checkPersistentParam from '@/mixins/checkPersistentParam'
import InlineUpdateStatus from '@/components/InlineUpdateStatus'

import basicComputedMixin from '@/mixins/basicComputedMixin'
import { mixinHiddenFeatureByPlanType } from '@/mixins/mixinHiddenFeatureByPlanType'

import dateRangePicker from '@/components/modules/DateRangePicker'
import { getOrderTokopedia, 
  getCountOrderTokopedia, 
  getdetailOrderTokopedia, 
  syncProductTokopedia,
  syncOrderTokopedia } from '@/api/thirdParty/tokopedia'
import { getOrderShopee, getShopeeStoreList, syncProductShopee, getDetailOrderShopee } from '@/api/thirdParty/shopee'
import { getOrderMarketplace } from '@/api/salesOrder'

import ListOrderMarketplace from './ListOrderIntegratedMarketplace.vue'
import NotifOrderMarketplace from './NotifOrderMarketplace.vue'
import dialogOrderShopee from './shopee/dialogOrderShopee'
import offscreenOrderShopee from './shopee/offscreenOrderShopee'
import dialogOrderTokopedia from './tokopedia/dialogOrderTokopedia'
import offscreenOrderTokopedia from './tokopedia/offscreenOrderTokopedia'
import CardInfo from '@/components/CardInfo'
import mixinBlibli from './mixins/blibli'

import { getOrderLazada,
  syncProductLazada,
  getdetailOrderLazada,
  syncOrderLazada } from '@/api/thirdParty/lazada'

import dialogOrderLazada from './lazada/dialogOrderLazada'
import offscreenOrderLazada from './lazada/offscreenOrderLazada'

export default {
  components: {
    vueDropzone: vue2Dropzone,
    CustomDateFilter,
    InlineUpdateStatus,
    dateRangePicker,
    dialogOrderTokopedia,
    offscreenOrderTokopedia,
    dialogOrderShopee,
    offscreenOrderShopee,
    dialogOrderLazada,
    offscreenOrderLazada,
    CardInfo,
    ListOrderMarketplace,
    NotifOrderMarketplace
  },
  mixins: [checkPersistentParam, basicComputedMixin, mixinBlibli, mixinHiddenFeatureByPlanType],
  name: 'OpenOrderList',
  data() {
    return {
      loading: true,
      openOrderData: [],
      statusValue: null,
      searchValue: null,
      importDialog: false,
      dropdownForm: true,
      btnProses: true,
      tableImport: false,
      pages: [
        {
          value: 5,
          label: '5 ' + this.$store.state.userStores.lang.rows
        },
        {
          value: 10,
          label: '10 ' + this.$store.state.userStores.lang.rows
        },
        {
          value: 20,
          label: '20 ' + this.$store.state.userStores.lang.rows
        },
        {
          value: 50,
          label: '50 ' + this.$store.state.userStores.lang.rows
        },
        {
          value: 100,
          label: '100 ' + this.$store.state.userStores.lang.rows
        }
      ],
      params: {
        start_date: '',
        end_date: '',
        search: null,
        total: null,
        currentPage: 1,
        sort_column: 'id',
        sort_type: 'desc',
        per_page: 20,
        page: 1,
        store: null,
        search_column: null,
        search_text: '',
        status: null
      },
      showFilter: false,
      filterTag: '',
      loadingUpdateStatus: false,
      initParamDate: [],
      dataOrderTokopedia: [],
      dataOrderShopee: [],
      loadingTokopedia: false,
      loadingShopee: false,
      visibleOrderTokopedia: false,
      visibleOrderShopee: false,
      countOrderMarketplace: [],
      countOrderShopee: [],
      totalSave: 0,
      totalUnsave: 0,
      paramsTokped: {
        per_page: 15,
        page: 1,
        status_save: null,
        search: ''
      },
      paramsShopee: {
        per_page: 15,
        page: 1,
      },
      metaOrderTokped: {
        totalProduct: 0,
        page_size: 15,
        currentPage: 1
      },
      metaOrderShopee: {
        totalProduct: 0,
        page_size: 15,
        currentPage: 1
      },
      shopeeShopList: [],
      shopeeOrderStatus: {},
      dataOrderLazada: [],
      visibleOrderLazada: false,
      lazadaSyncProduct: false,
      loadingLazada: false,
      totalSaveLazada: 0,
      totalUnsaveLazada: 0,
      paramsLazada: {
        per_page: 15,
        page: 1,
        status_save: null,
        search: ''
      },
      metaOrderLazada: {
        totalProduct: 2,
        page_size: 15,
        currentPage: 1
      }, 
      tempDataSync: {},
      visibleSynOrderTokopedia: false,
      visibleSyncLazada: false,
      loadingPairLazada: false,
      loadingSavePair: false,
      visibleSynProduct: false,
      loadingSync: false,
      marketPlaceSelect: '',
      tempDataSyncTokopedia: {},
      tempDataSyncShopee: {},
      tempDataSyncLazada: {},
      visibleSyncShopee: false
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
    roleCantAccess () {
      return ['RP', 'SA']
    },
    rootLang() {
      return this.$lang[this.$store.state.userStores.langId]
    },
    accessByStore () {
      return ['cvsms', 'smsstore1', 'smsstore2']
      // return ['setdemo1']
    },
    emailCantAccess () {
      return ['sales@samaramicron.com', 'martina.maria@samaramicron.com']
    },
    canntAccess () {
      if (this.accessByStore.includes(this.selectedStore.url_id) && this.roleCantAccess.includes(this.userRole.role_id)) {
        return true
      } else {
        return false
      }
    },
    statusSelect () {
      let datastatus = [
        {
          value: '',
          label: this.$store.state.userStores.lang.all
        },
        {
          value: 'P',
          label: this.$lang[this.$store.state.userStores.langId].pending
        },
        {
          value: 'A',
          label: this.$lang[this.$store.state.userStores.langId].has_confirm
        },
        {
          value: 'S',
          label: this.$lang[this.$store.state.userStores.langId].being_sent
        },
        {
          value: 'T',
          label: this.$store.state.userStores.lang.delivered
        }
      ]
      return datastatus
    },
    tokpedAccessByStore () {
      return ['allinolsera2', 
      'anonimcycle',
      'shop', 
      'tenunsengkang', 
      'tigapasukanvape', 
      'skipaj', 
      'purnamaelektronik', 
      'demoretailmks',
      'olseradotcom',
      'ornith']
    },
    allTimeDate () {
      if (this.params.start_date && this.params.end_date) {
        return false
      } else {
        return true
      }
    },

    tokpedShow () {
      return !this.methodFeatureNameIsHidden('tokopedia-sales')
    },

    marketplaceCode () {
      return ['K', 'L', 'H', 'B', 'A', 'J']
    },

    loadingMarketplace () {
      let loading = {
        loadingTokopedia: this.loadingTokopedia,
        loadingShopee: this.loadingShopee,
        loadingLazada: this.loadingLazada,
        loadingBlibli: this.loadingBlibli
      }

      return loading
    }
  },
  watch: {
    '$store.getters.selectedStore': function() {
      this.getOpenOrder()
    }
  },
  mounted() {
    this.checkPersistentMeta()
    /**
     * ??????
     */
    // if (this.$store.getters.selectedStore.pos_freemium === 1 && this.selectedStore.is_onlineshop === 1) {
    //   this.getOpenOrder()
    // } else {
    //   this.getOpenOrder()
    // }
    this.getOpenOrder()
    this.checkFilterAvailable()
    // this.getDate()
    this.getCountOrderFromMarketplace()
  },
  methods: {
    getDate() {
      this.params.end_date = moment().format('YYYY-MM-DD')
      this.params.start_date = moment().subtract(6, 'd').format('YYYY-MM-DD')
      this.initParamDate = [this.params.start_date, this.params.end_date]
    },
    getOpenOrder(store) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'openorder'),
        params: this.params,
        headers: headers
      })
        .then(response => {
          this.openOrderData = response.data.data
          this.params.total = response.data.meta.total
          this.loading = false
          // console.log(response)
        })
        .catch((error, xhr) => {
          this.loading = false
          this.openOrderData = []
          this.params.total = 0
          this.params.page = 1
        })
    },
    changePageTable(val) {
      this.params.per_page = val
      this.getOpenOrder()
    },
    handleSearch(val) {
      this.params.page = 1
      this.params.currentPage = 1
      this.params.per_page = 100
      // if (this.statusValue === null) {
      //   this.params.search_text = ''
      //   this.params.search_column = null
      // } else if (this.statusValue.value = '') {
      //   this.params.search_text = ''
      //   this.params.search_column = null
      // }
      // this.params.search = this.searchValue
      this.getOpenOrder()
    },
    handleStatusSelect(val) {
      if (val.label === this.lang.all) {
        this.statusValue.value = ''
        this.params.page = 1
        this.params.currentPage = 1
        this.params.search_text = ''
        this.params.search_column = null
        this.getOpenOrder()
      } else {
        this.params.page = 1
        this.params.currentPage = 1
        this.params.search_text = this.statusValue.value
        this.params.search_column = 'status'
        this.getOpenOrder()
      }
    },
    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      if (val.order === null) val.order = this.params.sort_type
      // console.log(val)
      var prop = ''
      if (val.prop === 'ftotal_amount') {
        prop = 'total_amount'
      } else {
        prop = val.prop
      }
      this.params.sort_type = val.order
      this.params.sort_column = prop
      this.getOpenOrder()
    },
    changeCurrentPage(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getOpenOrder()
    },
    rowClick(row) {
      this.$router.push({ path: '/sales/openorder/' + row.id })
    },
    importStatus() {
      this.$router.push({path: '/sales/updatestatus'})
    },
    afterComplete(file, response) {
      console.log(response)
      if (response.error === 0) {
        // this.$notify({
        //   title: 'Sukses',
        //   message: response.data + ' Produk.'
        // })
        if (response.unready_import !== 0) {
          this.btnProses = true
        } else {
          this.btnProses = false
        }
        this.dropdownForm = false
        this.tableImportCustomer = response.data
        this.totalRow = response.row
        this.errorImport = response.unready_import
        this.tableImport = true
        this.fileConfirm = response.file_confirmed
        // this.$router.push({path: '/inventory/stocksincoming'})
      }
    },
    failed(file, message, xhr) {
      // console.log('file', file)
      // console.log('message', message)
      // console.log('xhr', xhr)
      // let errorMessage = ''
      // if (this.langId === 'id') {
      //   errorMessage = 'Gagal Menambahkan Produk'
      // } else {
      //   errorMessage = 'Add Product Failed'
      // }
      const $ = require('jquery')
      $('.dz-error-message span').text(message.error.error)
    },
    removeAllFiles() {
      this.$refs.dropzone.removeAllFiles()
    },
    cancelImport() {
      this.tableImportCustomer = []
      this.fileConfirm = ''
      this.dropdownForm = true
      this.tableImport = false
      this.importDialog = false
    },
    saveImportData: function() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'openorder/importconfirmed?file_confirmed=' + this.fileConfirm),
        headers: headers
      })
        .then(response => {
          // this.customerData = response.data.data
          this.loading = false
          // console.log(response)
          this.$router.push({path: '/sales/openorder'})
          this.cancelImport()
          this.importDialog = false
          this.$notify({
            title: 'Success',
            message: response.data.message + ' Customer.'
          })
        })
        .catch((error, xhr) => {
          this.loading = false
          // console.log(error)
          // console.log(xhr)
        })
    },
    tableRowClassName({row, rowIndex, props}) {
      if (row.error !== null) {
        return 'warning-row'
      }
      return ''
    },
    indexMethod(index) {
      return index + 1
    },
    toggleFilter() {
      if (this.showFilter) {
        this.showFilter = false
      } else {
        this.showFilter = true
      }
    },
    dateFilterClose() {
      this.showFilter = false
    },
    dateFilterReset(data) {
      this.filterTag = '',
      this.$delete(this.params, 'start_date')
      this.$delete(this.params, 'end_date')
      this.dateFilterClose()
      this.getOpenOrder()
    },
    dateFilterSave(filter) {
      // console.log(filter)
      this.filterTag = filter.labelForDate
      this.$set(this.params, 'filtertag', filter.labelForDate)
      this.$set(this.params, 'start_date', filter.startDate)
      this.$set(this.params, 'end_date', filter.endDate)
      this.dateFilterClose()
      this.getOpenOrder()
    },
    closeFilterTag() {
      this.dateFilterReset()
    },
    handleUpdateStatus(data, index, parentIndex) {
      this.loadingUpdateStatus = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'openorder/updatestatus'),
        headers: headers,
        data: data
      }).then(response => {
        this.openOrderData[index].status = response.data.data.status
        this.$message({
          message: 'Success',
          type: 'success'
        })
        this.loadingUpdateStatus = false
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loadingUpdateStatus = false
      })
    },
    checkFilterAvailable() {
      if (this.params.search_column === 'status') {
        this.statusSelect.map(i => {
          if (this.params.search_text === i.value) {
            this.statusValue = i
          }
        })
      }
      if (this.params.filtertag) { this.filterTag = this.params.filtertag }
    },
    datePicked (value) {
      this.params.page = 1
      if (value) {
        this.params.start_date = value.start_date
        this.params.end_date = value.end_date
        this.getOpenOrder()
      } else {
        this.getOpenOrder()
      }
    },

    resetDate () {
      this.params.page = 1
      this.params.start_date = ''
      this.params.end_date = ''
      this.getOpenOrder()
    },

    getOrderFromTokopedia (close_dialog) {
      this.loadingTokopedia = true
      this.marketPlaceSelect = ''
      getOrderTokopedia(this.paramsTokped).then(response => {
        this.dataOrderTokopedia = response.data.data
        this.totalSave = response.data.total_saved
        this.totalUnsave = response.data.total_unsaved
        this.metaOrderTokped = {
          totalProduct: response.data.meta.total,
          page_size: parseInt(response.data.meta.per_page),
          currentPage: response.data.meta.current_page
        }
        this.loadingTokopedia = false
        if (close_dialog) {
          this.visibleOrderTokopedia = false
        } else {
          let dataNull = []
          this.dataOrderTokopedia.map(i => {
            if (!i.products.length) {
              dataNull.push(i.order_no_tokopedia)
            }
          })
          if (dataNull.length) {
            this.marketPlaceSelect = 'tokped'
            this.visibleSynProduct = true
          } else {
            this.visibleOrderTokopedia = true
          }
        }
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.dataOrderTokopedia = []
        this.totalSave = 0
        this.totalUnsave = 0
        this.loadingTokopedia = false
      })
    },
    getCountOrderFromMarketplace () {
      this.loading = true
      // if (this.stageLevel === 'dev' || this.stageLevel === 'sit') {
        getOrderMarketplace().then(response => {
          if (response.data.data) {
            this.countOrderMarketplace = response.data.data
          }
          response.data.data.map(i => {
            if (i.marketplace_name === 'Tokopedia') {
              this.getSyncOrder()
            }else if(i.marketplace_name === 'Lazada'){
              this.getSyncOrderLazada()
            }
          })
          this.loading = false
          // this.visibleOrderTokopedia = true
        }).catch(error => {
          if (error.statusCode !== 404) {
            this.$message({
              type: 'error',
              message: error.string
            })
          }
          this.loading = false
          console.log('aa', error)
        })
      // } else {
      //   getCountOrderTokopedia().then(response => {
      //     if (response.data.data) {
      //       this.countOrderMarketplace = response.data.data
      //     }
      //     response.data.data.map(i => {
      //       if (i.marketplace_name === 'Tokopedia') {
      //         this.getSyncOrder()
      //       }
      //     })
      //     this.loading = false
      //     // this.visibleOrderTokopedia = true
      //   }).catch(error => {
      //     if (error.statusCode !== 404) {
      //       this.$message({
      //         type: 'error',
      //         message: error.string
      //       })
      //     }
      //     this.loading = false
      //   })
      // }
    },
    handleFilter (arg) {
      if (arg === 'all') {
        this.paramsTokped.status_save = null
      } else if (arg === 'not_saved') {
        this.paramsTokped.status_save = 0
      } else if (arg === 'saved') {
        this.paramsTokped.status_save = 1
      }
      this.paramsTokped.page = 1
      this.getOrderFromTokopedia(false)
    },

    handleFilterStore (dataParams) {
      if (dataParams !== 0) {
        this.paramsTokped.merchant_tokopedia_id = dataParams
      } else {
        this.$delete(this.paramsTokped, 'merchant_tokopedia_id')
      }
      this.paramsTokped.page = 1
      this.getOrderFromTokopedia(false)
    },


    handleSearchTokped (search) {
      this.paramsTokped.page = 1
      this.paramsTokped.search = search
      this.getOrderFromTokopedia(false)
    },

    handleFilterShopee (shopId, savedStatus, orderStatus, searchText, sort) {
      let resetParams = {
        per_page: 15,
        page: 1,
      }
      this.paramsShopee = { ...resetParams }
      if (shopId !== '') {
        this.paramsShopee['search_column[0]'] = 'shop_id'
        this.paramsShopee['search_text[0]'] = shopId
      }
      if (savedStatus !== '') {
        this.paramsShopee['search_column[1]'] = 'status_save'
        this.paramsShopee['search_text[1]'] = savedStatus
      }
      if (orderStatus !== '') {
        this.paramsShopee['search_column[2]'] = 'status'
        this.paramsShopee['search_text[2]'] = orderStatus
      }
      if (sort.column !== '') {
        this.paramsShopee.sort_column = sort.column
        this.paramsShopee.sort_type = 'asc'
        if (!sort.isTypeAsc) {
          this.paramsShopee.sort_type = 'desc'
        }
      }
      if (searchText !== '') {
        this.paramsShopee.search = searchText
      }
      this.getOrderFromShopee(false)
    },

    handleRefresh (command) {
      this.getOpenOrder()
      let resetParams = {
        per_page: 15,
        page: 1,
      }
      if (command === 'tokped') {
        this.getOrderFromTokopedia(true)
      }
      if (command === 'shopee') {
        this.paramsShopee = { ...resetParams }
        this.getOrderFromShopee(true)
      }
    },

    handleSyncTokped () {
      this.getOpenOrder()
      this.getOrderFromTokopedia()
    },

    handleSyncShopee () {
      this.getOpenOrder()
      this.getOrderFromShopee()
    },

    handleCloseDialog (command) {
      this.handleRefresh(command)
      this.visibleOrderTokopedia = false
      this.visibleOrderShopee = false
    },
    changePageTokped(val) {
      this.metaOrderTokped.currentPage = val
      this.paramsTokped.page = val
      this.getOrderFromTokopedia(false)
    },
    changePageSizeTokped(val) {
      this.paramsTokped.page = 1
      this.paramsTokped.per_page = val
      this.getOrderFromTokopedia(false)
    },

    changePageShopee(val) {
      this.metaOrderShopee.currentPage = val
      this.paramsShopee.page = val
      this.getOrderFromShopee(false)
    },
    changePageSizeShopee(val) {
      this.paramsShopee.page = 1
      this.paramsShopee.per_page = val
      this.getOrderFromShopee(false)
    },
    
    getOrderFromLazada (close_dialog) {
      console.log('aaaa')
      this.loadingLazada = true
      getOrderLazada(this.paramsLazada).then(response => {
        this.dataOrderLazada = response.data.data
        this.totalSaveLazada = response.data.total_saved
        this.totalUnsaveLazada = response.data.total_unsaved
        this.metaOrderLazada = {
          totalProduct: response.data.meta.total,
          page_size: parseInt(response.data.meta.per_page),
          currentPage: response.data.meta.current_page
        }
        
        this.loadingLazada = false
        if (close_dialog) {
          this.visibleOrderLazada = false
        } else {
          let dataNull = []
          this.dataOrderLazada.map(i => {
            if (!i.products.length) {
              dataNull.push(i.order_no_lazada)
            }
          })
          if (dataNull.length) {
            this.visibleOrderLazada = true
          } else {
            this.visibleOrderLazada = true
          }
        }
      }).catch(error => {
        if (error.string) {
          this.$message({
            type: 'error',
            message: error.string
          })
        }
        this.dataOrderLazada = []
        this.totalSaveLazada = 0
        this.totalUnsaveLazada = 0
        this.loadingLazada = false
      })
    },

    handleCloseDialogLazada(){
      this.handleRefreshLazada()
      this.visibleOrderLazada = false
    },

    handleFilterLazada (arg) {
      if (arg === 'all') {
        this.paramsLazada.status_save = null
      } else if (arg === 'not_saved') {
        this.paramsLazada.status_save = 0
      } else if (arg === 'saved') {
        this.paramsLazada.status_save = 1
      }
      this.paramsLazada.page = 1
      this.getOrderFromLazada(false)
    },

    handleSyncLazada () {
      this.getOpenOrder()
      this.getOrderFromLazada()
      this.lazadaSyncProduct = true
    },

    cancelSyncLazada(){
      this.lazadaSyncProduct = false
      this.loadingSync = false
    },

    syncDataLazada() {
      this.loadingSync = true
      syncProductLazada().then(response => {
        this.loadingSync = false
        this.lazadaSyncProduct = false
        this.$message({
          type: 'success',
          message: response.data.message
        })
        this.getOrderFromLazada(false)
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingSync = false
      })
    },

    handleRefreshLazada(){
      this.getOpenOrder()
      this.getOrderFromLazada(true)
    },

    handleSearchLazada(search){
      this.paramsLazada.page = 1
      this.paramsLazada.search = search
      this.getOrderFromLazada(false)
    },

    getSyncOrderLazada(){
      
    },

    getDetailLazada(data){
      this.loadingPair = true
      let params = {order_no_lazada: data}
      getdetailOrderLazada(params).then(response => {
        this.tempDataSync = { ...response.data.data}
        this.visibleSyncLazada = true
        this.loadingPair = false
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingPairLazada = false
      })
    },

    changePageLazada(val) {
      this.metaOrderLazada.currentPage = val
      this.paramsLazada.page = val
      this.getOrderFromLazada(false)
    },
    changePageSizeLazada(val) {
      this.paramsLazada.page = 1
      this.paramsLazada.per_page = val
      this.getOrderFromLazada(false)
    },

    async getOrderFromShopee (close_dialog) {
      this.loadingShopee = true
      this.marketPlaceSelect = ''
      let isContinue = true
      try {
        let shopList = await getShopeeStoreList()        
        this.shopeeShopList = shopList.data.data
      } catch (error) {
        if (error.string) {
          this.$message({
            type: 'error',
            message: error.string
          })
        }
        this.loadingShopee = false
        this.shopeeShopList = []
        isContinue = false
      }
      if (!isContinue) return
      getOrderShopee(this.paramsShopee).then(response => {
        if (response.data.data.length !== 0){
          this.dataOrderShopee = response.data.data
          this.metaOrderShopee = {
            totalProduct: response.data.meta.total,
            page_size: parseInt(response.data.meta.per_page),
            currentPage: response.data.meta.current_page
          }
          this.shopeeOrderStatus = {
            total: response.data.total,
            total_saved: response.data.total_saved,
            total_unsaved: response.data.total_unsaved,
            total_ready_to_ship: response.data.total_ready_to_ship,
            total_shipped: response.data.total_shipped,
            total_in_cancel: response.data.total_in_cancel,
            total_cancelled: response.data.total_cancelled,
            total_to_return: response.data.total_to_return,
            total_complate: response.data.total_complate,
            total_to_confirm_receive: response.data.total_to_confirm_receive,
          }
        } else {
          this.dataOrderShopee = []
          this.metaOrderShopee = {
            totalProduct: 0,
            page_size: 0,
            currentPage: 0
          }
          this.shopeeOrderStatus = {
            total: 0,
            total_saved: 0,
            total_unsaved: 0,
            total_ready_to_ship: 0,
            total_shipped: 0,
            total_in_cancel: 0,
            total_cancelled: 0,
            total_to_return: 0,
            total_complate: 0,
            total_to_confirm_receive: 0,
          }
        }
        this.loadingShopee = false
        console.log(this.dataOrderShopee)
        console.log(this.metaOrderShopee)
        console.log(this.shopeeOrderStatus)
        if (close_dialog) {
          this.visibleOrderShopee = false
        } else {
          let dataNull = []
          this.dataOrderShopee.map(i => {
            if (!i.products.length) {
              dataNull.push(i.invoice_num)
            }
          })
          if (dataNull.length) {
            this.marketPlaceSelect = 'shopee'
            this.visibleSynProduct = true
          } else {
            this.visibleOrderShopee = true
          }
        }
      }).catch(error => {
        if (error.string) {
          console.log('error', error)
          this.$message({
            type: 'error',
            message: error.string
          })
        }
        if (!close_dialog) {
          this.dataOrderShopee = []
          this.metaOrderShopee = {
            totalProduct: 0,
            page_size: 0,
            currentPage: 0
          }
          this.shopeeOrderStatus = {
            total: 0,
            total_saved: 0,
            total_unsaved: 0,
            total_ready_to_ship: 0,
            total_shipped: 0,
            total_in_cancel: 0,
            total_cancelled: 0,
            total_to_return: 0,
            total_complate: 0,
            total_to_confirm_receive: 0,
          }
          this.visibleOrderShopee = true
        }
        this.loadingShopee = false
      })
    },
    
    getDetailOrder (data) {
      this.loadingPair = true
      getdetailOrderTokopedia(data).then(response => {
        this.tempDataSyncTokopedia = { ...response.data.data}
        this.visibleSynOrderTokopedia = true
        this.loadingPair = false
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingPair = false
      })
    },

    getDetailShopee (data) {
      this.loadingPair = true
      getDetailOrderShopee(data).then(response => {
        this.tempDataSyncShopee = { ...response.data.data}
        this.visibleSyncShopee = true
        this.loadingPair = false
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingPair = false
      })
    },

    syncDataProduct() {
      this.loadingSync = true
      if (this.marketPlaceSelect === 'tokped') {
        syncProductTokopedia().then(response => {
          this.loadingSync = false
          this.visibleSynProduct = false
          this.getOrderFromTokopedia(false)
        }).catch(error => {
          this.$message({
            type: 'error',
            message: error.string
          })
          this.loadingSync = false
        })
      }
      if (this.marketPlaceSelect === 'shopee') {
        syncProductShopee().then(response => {
          this.loadingSync = false
          this.visibleSynProduct = false
          this.getOrderFromShopee(false)
        }).catch(error => {
          this.$message({
            type: 'error',
            message: error.string
          })
          this.loadingSync = false
        })
      }
    },

    getSyncOrder() {
      this.loadingSync = true
      syncOrderTokopedia({
        page: 1,
        per_page: 100
      }).then(response => {
        this.dialogSyncOrder = false
        // this.$emit('syncproduct')
        this.loadingSync = false
        this.loading = false
        // this.$message({
        //   type: 'success',
        //   message: response.data.data.message
        // })
      }).catch(error => {
        if (error.statusCode !== 404) {
          this.$message({
            type: 'error',
            message: error.string
          })
        }
        // this.dialogSyncOrder = false
        this.loadingSync = false
        this.loading = false
        console.log('ee', error)
      })
    },

    cancelSameStock () {
      this.visibleSynProduct = false
      this.handleRefresh(this.marketPlaceSelect)
    },

    handleGetDetailOrder (data) {
      if (data.order_source === 'K') {
        this.getDetailOrder(data.id)
      } else if (data.order_source === 'H') {
        this.getDetailShopee(data.id)
      } else if (data.order_source === 'L') {
        this.getDetailLazada(data.id)
      }
    },

    handleGetOrderMarketplace (data) {
      if (data === 'Tokopedia') {
        this.getOrderFromTokopedia(false)
      }
      if (data === 'Shopee') {
        this.getOrderFromShopee(false)
      }
      if (data === 'Lazada') {
        this.getOrderFromLazada(false)
      }
      if (data === 'Blibli') {
        this.visibleOrderBlibli = true
      }
    }
  }
}
</script>
