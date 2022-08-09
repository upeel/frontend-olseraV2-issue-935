<template>
  <transition name="el-zoom-in-center">
    <div
      v-if="show"
      class="offscreen-right-sidebar px-null">
      <div v-loading="loadingData" class="offscreen-right-sidebar--wrapper">
        <div class="offscreen-right-sidebar--header text-left color-white--bg" style="z-index: 10">
          <span >{{ formEdit.status_save === 0 ? 'Simpan ke Olsera' : 'Detail Pesanan' }}</span>
          <close-esc :hideEsc="true" @close="handleClose" />
        </div>
        
        <div class="px-24 pb-24">
          <div class="border border--grey-border radius-10 p-8 flex-container">
            <div class="full-width flex-container">
              <div class="flex-container full-width" >
                <div>
                  <el-avatar
                    src="/static/img/shopee.png"
                    :size="32"
                    shape="circle"
                  />
                </div>
                <div>
                  <div class="font-16 ml-8">
                    {{ formEdit.invoice_num }}
                  </div>
                  <div class="ml-8 font-12 color-info">
                    {{ formEdit.shopee_shop_name }}
                  </div>
                  <div class="ml-8 font-12 color-info">
                    {{ formEdit.status }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <template v-if="formEdit.status_code === 'IN_CANCEL'">
          <div class="px-24 pb-24">
            <div class="p-8 radius-10" style="display: flex; background-color: #FEE8E6">
              <i class="el-icon-circle-close" style="font-weight: bold; color: red; font-size: 22px; margin-right: 8px;"/>
              <div>
                <div>
                  Pembeli mengajukan pembatalan pesanan. Alasan pembatalan: 
                </div> 
                <span style="font-weight: bold">
                  "{{formEdit.cancel_reason}}"
                </span>
              </div>
            </div>
            <template>
              <div class="flex-container mt-12">
                <el-button
                  class="btn-block mr-4"
                  style="color: black;"
                  :loading="cancellationLoading.reject"
                  @click="cancellationHandler('reject', formEdit)"
                >
                  Tolak
                </el-button>
                <el-button
                  type="shopee"
                  class="btn-block ml-4"
                  :loading="cancellationLoading.accept"
                  @click="cancellationHandler('acc', formEdit)">
                  Terima pembatalan
                </el-button>
              </div>
            </template>
          </div>
        </template>
        <template v-else-if="formEdit.status_code === 'CANCELLED'">
          <div class="px-24 pb-24">
            <div class="p-8 radius-10" style="display: flex; background-color: #FEE8E6">
              <i class="el-icon-circle-close" style="font-weight: bold; color: red; font-size: 22px; margin-right: 8px;"/>
              <div>
                <div>
                  Alasan pembatalan: 
                </div> 
                <span style="font-weight: bold">
                  "{{formEdit.cancel_reason}}"
                </span>
              </div>
            </div>
          </div>
        </template>

        <template v-if="formEdit.status_save === 1">
          <template v-if="formEdit.status_code === 'READY_TO_SHIP' && (formEdit.request_shipping === 0 || formEdit.request_shipping === null)" >
            <div class="px-24 pb-24">
              <el-button
                type="shopee"
                class="btn-block ml-4"
                @click="handleSettingShippingDialog"
              >
                Atur pengiriman
              </el-button>
            </div>
          </template>
          <template v-if="formEdit.status_code !== 'CANCELLED'">
            <template  v-if="formEdit.request_shipping === 1" >
              <div class="px-24 pb-24">
                <el-button
                  type="shopee"
                  class="btn-block ml-4"
                  @click="handleSuccedSelectShipping('pickup')"
                >
                  <svg-icon icon-class="truck" /> Request pickup
                </el-button>
              </div>
            </template>
            <template v-else-if="formEdit.request_shipping === 2" >
              <div class="px-24 pb-24">
                <el-button
                  type="shopee"
                  class="btn-block ml-4"
                  @click="handleSuccedSelectShipping('dropoff')"
                >
                  <svg-icon icon-class="check" /> Antar sendiri
                </el-button>
              </div>
            </template>
            <template v-else-if="formEdit.request_shipping === 3" >
              <div class="px-24 pb-24">
                <el-button
                  type="shopee"
                  class="btn-block ml-4"
                >
                  <svg-icon icon-class="check" /> Non integrated
                </el-button>
              </div>
            </template>
          </template>
        </template>

        <div class="full-width px-24" >
          <div 
            v-for="item in computedListOrder(true)"
            :key="item.caption"
            class="like-table-wrapper--item flex-container" 
            style="height: 35px"
          >
            <div class="full-width">{{ item.caption }}</div>
            <div 
              class="full-width text-right" 
              :class="formEdit.shipping_cost.charAt(0) === '-' ? 'color-danger' : ''"
            >{{ item.value !== null ? item.value : '-'}}</div>
          </div>
        </div>

        <div class="p-24 text-center mb-42" v-loading="loadingSearch">
          <div v-if="dataProd.length > 0">
            <div id="here" v-for="(data, index) in dataProd" :key="data.id" class="like-table-wrapper--item pointer flex-container" >
              <div class="full-width text-left">
                <div class="flex-container full-width" >
                  <div style="position: relative">
                    <el-avatar
                      :src="data.images[0]"
                      :size="32"
                      shape="square"
                    />
                    <el-avatar
                      src="/static/img/shopee.png"
                      :size="20"
                      style="position: absolute; right: 0;"
                    />
                  </div>
                  <div>
                    <div class="font-bold font-16 ml-8">
                      {{ data.qty }}x {{ data.name }}
                    </div>
                  </div>
                </div>
              </div>
              <el-button 
                v-if="parseInt(data.status_pair) === 1" 
                :loading="loadingUnpair.index === index && loadingUnpair.state"
                type="shopee" 
                round 
                class="flex-container justify-center" 
                style="width: 100%; max-width: 116px"
              >
                <svg-icon icon-class="icon-feather-link-white" />
                  {{ rootLang.paired }}
              </el-button>
              <el-button 
                v-else-if="parseInt(data.status_pair) === 2" 
                type="pair-shopee" 
                round 
                class="flex-container justify-center" 
                style="width: 100%; max-width: 116px"
                @click="handlePair(data)" 
              >
                <svg-icon icon-class="plus" /> Hubungkan
              </el-button>
            </div>
            <el-button
              v-if="last_page > current_page"
              class="btn-block mt-24"
              @click="getAddonGroup">
              {{ rootLang.load_more }}
            </el-button>
          </div>
          <template v-if="formEdit.status_save === 1">
            <div class="text-left mt-40">
              <div class="font-24 font-bold">Tersimpan di Olsera</div>
              <span class="font-12">Pada {{ formEdit.sales_order_created_time }}</span>
            </div>
            <div class="mt-24 border border--grey-border radius-10 p-8 flex-container">
              <div class="full-width flex-container">
                <div class="flex-container full-width" >
                  <div>
                    <svg-icon icon-class="freemium_icon" class="font-40"/>
                  </div>
                  <div>
                    <div class="font-bold font-16 ml-8">
                      {{ formEdit.invoice_olsera }}
                    </div>
                    <div class="font-12 ml-8 color-info text-left">
                      {{ formEdit.status_olsera }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="full-width mt-16 text-left" >
              <div
                v-for="item in computedListOrder(false)" :key="item.caption"
                class="like-table-wrapper--item flex-container full-width"
              >
                <div class="full-width">{{item.caption}}</div>
                <div class="full-width text-right">
                  {{ item.value !== null ? item.value : '-'}}
                </div>
              </div>
            </div>
          </template>
        </div>

        <div 
          v-if="formEdit.status_code !== 'IN_CANCEL'" 
          class="offscreen-right-sidebar--footer"
        >
          <div class="flex-container">
            <el-button
              v-if="formEdit.status_save !== 1 && !fromList"
              class="btn-block mr-4"
              style="color: black;"
              @click="handleClose"
            >
              {{ rootLang.cancel }}
            </el-button>
            <el-button
              v-if="formEdit.status_save !== 1 && !fromList" 
              class="btn-block ml-4"
              type="shopee"
              :loading="loadingSave"
              @click="handleSave">
              {{ rootLang.save }}
            </el-button>
          </div>
        </div>
      </div>

      <offscreen-sync-product
        :show="visibleSyncProduct"
        :form-edit="formSync"
        @cancel="handleCloseDialogPair"
        @pair="reloadData"
      />

      <!-- dialog setting shipping -->
      <el-dialog 
        :visible.sync="visibleSettingShipping"
        :before-close="handleCloseSettingShippingDialog"
        :show-close="false"
        width="696px"
        append-to-body
      > 
        <div slot="title" class="flex-container">
          <h4 class="dialog-title full-width">
            Atur Pengiriman
          </h4>
          <el-button
            style="min-width: 116px"
            @click="handleCloseSettingShippingDialog"
          >
            {{ rootLang.cancel }}
          </el-button>
          <el-button
            type="shopee"
            style="min-width: 116px"
            :loading="isLoadingShippingMethod"
            @click="handleConfirmSelectedShippingMethod()"
          >
            {{ rootLang.confirm }}
          </el-button>
        </div>
        <div v-if="Object.keys(tempDataSettingShipping).length !== 0" class="flex-container">
          <el-avatar :size="40" :src="tempDataSettingShipping.shipping_image">
            <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"/>
          </el-avatar>
          <div style="font-size: 20px; font-weight: bold; margin-right: auto; margin-left: 16px">{{tempDataSettingShipping.invoice_num}}</div>
          <div class="pointer">
            <el-tooltip content="Copy" placement="top">
              <svg-icon type="feather-copy" stroke="#606266" style="font-size: 20px" />
            </el-tooltip>
          </div>
        </div>
        <div class="setting-shipping-wrapper mt-16">
          <div 
            v-if="tempDataSettingShipping.dropoff === 1"
            class="option-shipping-card pointer"
            :class="selectedShippingMethod === 'dropoff' ? 'option-shipping-card--active' : ''"
            @click="selectedShippingMethod = 'dropoff'"
          >
            <svg-icon icon-class="shipping-store" />
            <p style="font-size: 20px; font-weight: bold">Antar sendiri ke Counter</p>
            <p>Anda dapat mengirimkan paket Anda ke cabang {{tempDataSettingShipping.shipping_agency}} tedekat di kota Anda</p>
          </div>
          <div 
            v-if="tempDataSettingShipping.pickup === 1"
            class="option-shipping-card pointer"
            :class="selectedShippingMethod === 'pickup' ? 'option-shipping-card--active' : ''"
            @click="selectedShippingMethod = 'pickup'"
          >
            <svg-icon icon-class="shipping-pickup" />
            <p style="font-size: 20px; font-weight: bold">Gunakan jasa Pickup</p>
            <p>{{tempDataSettingShipping.shipping_agency}} akan mengambil paket dari alamat Anda</p>
          </div>
          <div 
            v-if="tempDataSettingShipping.non_integrated === 1"
            class="option-shipping-card pointer"
            :class="selectedShippingMethod === 'non_integrated' ? 'option-shipping-card--active' : ''"
            @click="selectedShippingMethod = 'non_integrated'"
          >
            <svg-icon icon-class="shipping-nonintegrated" />
            <p style="font-size: 20px; font-weight: bold">Tidak terintegrasi</p>
            <p>Pengiriman yang tidak terintegrasi dengan Shopee</p>
          </div>
          <div 
            v-if="
              tempDataSettingShipping.pickup === 0 && 
              tempDataSettingShipping.dropoff === 0 &&
              tempDataSettingShipping.non_integrated === 0
            "
          >
            no shipping mehthod available - something went wrong (for debug purpose)
          </div>
        </div>
      </el-dialog>
      <!-- dialog req pickup shipping -->
      <el-dialog 
        :visible.sync="visibleReqpickupShipping"
        :before-close="handleCloseReqpickup"
        :show-close="false"
        width="45%"
        append-to-body
      >
        <div slot="title" class="flex-container">
          <h4 class="dialog-title full-width">
            Request Pickup
          </h4>
          <el-button
            style="min-width: 116px"
            @click="handleCloseReqpickup"
          >
            {{ rootLang.cancel }}
          </el-button>
          <el-button
            type="shopee"
            style="min-width: 116px"
            :loading="isSubmiReqPicukupLoading"
            @click="sumbitReqPickupHandler"
          >
            Req Pickup
          </el-button>
        </div>
        <div class="full-width" style="margin-bottom: 16px">
          <p class="font-12" style="margin-bottom: 4px;">Tanggal</p>
          <div class="days-wrapper">
            <div 
              v-for="item in selectedAddress.option"
              :key="item.date" 
              class="day-item pointer"
              :class="selectedDate.date === item.date ? 'active' : ''"
              @click="() => {
                selectedDate = item
                selectedTime = item.time[0]
              }"
            >
              {{ formatDates(item.date) }}
            </div>
          </div>
        </div>
        <div class="full-width" style="margin-bottom: 16px">
          <p class="font-12" style="margin-bottom: 4px;">Waktu</p>
          <el-select 
            v-model="selectedTime" 
            value-key="pickup_time_id" 
            clearable 
            class="full-width"
          >
            <el-option
              v-for="item in selectedDate.time"
              :key="item.pickup_time_id"
              :label="item.time_text"
              :value="item"
            >
            </el-option>
          </el-select>
        </div>
        <div class="full-width" v-if="Object.keys(selectedAddress).length !== 0">
          <p class="font-12" style="margin-bottom: 4px;">Alamat penjemputan</p>
          <el-input type="textarea" autosize readonly :value="`${selectedAddress.address.address}, ${selectedAddress.address.district}, ${selectedAddress.address.city}, ${selectedAddress.address.state}, ${selectedAddress.address.zipcode}`"/>
        </div>
      </el-dialog>
      <!-- dialog non integrated shipping -->
      <el-dialog 
        :visible.sync="visibleNonIntegratedShipping"
        :before-close="handleCloseNonIntegrated"
        :show-close="false"
        width="45%"
        append-to-body
      >
        <div slot="title" class="flex-container">
          <h4 class="dialog-title full-width">
            Pengiriman tidak terintegrasi
          </h4>
          <el-button
            style="min-width: 116px"
            @click="handleCloseNonIntegrated"
          >
            {{ rootLang.cancel }}
          </el-button>
          <el-button
            type="shopee"
            style="min-width: 116px"
            :loading="isSubmiNonIntegratedLoading"
            @click="sumbitNonIntegratedHandler"
          >
            Kirim
          </el-button>
        </div>
        <div class="full-width" style="margin-bottom: 16px">
          <p class="font-12" style="margin-bottom: 4px;">Resi Pengiriman</p>
          <el-input placeholder="Masukkan nomor resi pengiriman" v-model="inputNonIntegrated"></el-input>
        </div>
      </el-dialog>
      <!-- dialog succeed select shipping -->
      <el-dialog 
        :visible.sync="visibleSelectShippingSucceed"
        :before-close="handleCloseSuccedSelectShipping"
        width="516px"
        append-to-body
      > 
        <div slot="title" class="flex-container">
          <h4 class="dialog-title full-width">
            <template v-if="selectedShippingMethod === 'dropoff'">
              Antar sendiri
            </template>
            <template v-else-if="selectedShippingMethod === 'pickup'">
              Jasa Pickup
            </template>
          </h4>
        </div>
        <div class="flex-container">
          <el-avatar :size="40" :src="tempDataSettingShipping.shipping_image">
            <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"/>
          </el-avatar>
          <div style="font-size: 20px; font-weight: bold; margin-right: auto; margin-left: 16px">
            {{ tempDataSettingShipping.tracking_no !== null ? tempDataSettingShipping.tracking_no : '-' }}
          </div>
          <div class="pointer">
            <el-tooltip content="Copy" placement="top">
              <svg-icon type="feather-copy" stroke="#606266" style="font-size: 20px" />
            </el-tooltip>
          </div>
        </div>
        <template v-if="selectedShippingMethod === 'dropoff'">
          <div class="p-16 mt-24 mb-16 radius-10 full-width" style="display: flex; background-color: #F5F5F5">
            <i class="el-icon-warning-outline" style="font-weight: bold; color: black; font-size: 22px; margin-right: 8px;"/>
            <div class="full-width">
              Cetak dan tempelkan label pengiriman {{tempDataSettingShipping.shipping_agency}} dengan no. resi otomatis yang didapatkan dari Seller Center ke paket Anda. Temukan counter {{tempDataSettingShipping.shipping_agency}} terdekat. Bawa paket anda ke counter {{tempDataSettingShipping.shipping_agency}} terdekat. Mohon untuk tidak membayar biaya pengiriman apapun di counter
            </div>
          </div>
        </template>
        <template v-else-if="selectedShippingMethod === 'pickup'">
          <div class="mt-24 mb-16 full-width">
            <div 
              v-for="(item, idx) in [
                { caption: 'Opsi pengiriman', value: tempDataSettingShipping.shipping_agency }, 
                { caption: 'Tanggal Beli', value: tempDataSettingShipping.buy_date }, 
                { caption: 'Penerima', value: tempDataSettingShipping.recipient }, 
              ]" 
              :key="item.captopn"
              class="py-8 px-16"
              :class="idx % 2 === 0 ? 'bg-grey' : ''"
              style="display: flex; justify-content: space-between; align-items: center; gap: 10px"
            >
              <div style="max-width: 45%">{{item.caption}}</div>
              <div style="max-width: 45%">{{item.value}}</div>
            </div>
          </div>
        </template>
        <el-button 
          type="shopee" 
          class="full-width"
          icon="el-icon-printer"
          :loading="isPrintLabelLoading"
          @click="printLabelHandler"
        >Cetak label</el-button>
      </el-dialog>
    </div>
  </transition>
</template>

<script>
import moment from 'moment'
import basicComputedMixin from '@/mixins/basicComputedMixin'
import CloseEsc from '@/components/modules/CloseEsc'
import offscreenSyncProduct from '@/components/modules/_views/service-activation/shopee/offscreenSyncProduct'
import { 
  getDetailOrderShopee, 
  acceptOrderCancellation,
  rejectOrderCancellation,
  getAddressWithPickupTime,
  initLogistic,
  printLabel
} from '@/api/thirdParty/shopee'

export default {
  components: {
    CloseEsc,
    offscreenSyncProduct
  },
  mixins: [basicComputedMixin],
  props: {
    show: {
      type: Boolean,
      default: false
    },
    formEdit: {
      type: Object,
      default: null
    },
    loadingSave: {
      type: Boolean,
      default: false
    },
    fromList: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      params: {
        search: '',
        per_page: 50
      },
      dataSearch: [],
      current_page: 0,
      last_page: 0,
      loadingSearch: false,
      selectedProduct: {},
      loadingUnpair: {
        index: null,
        state: false
      },
      visibleSyncProduct: false,
      formSync: {},
      loadingData: false,
      cancellationLoading : {
        reject: false,
        accept: false
      },
      visibleSettingShipping: false,
      isLoadingShippingMethod: false,
      tempDataSettingShipping: {},
      selectedShippingMethod: '',
      visibleSelectShippingSucceed: false,
      visibleReqpickupShipping: false,
      selectedAddress: {},
      selectedDate: {},
      selectedTime: {},
      isSubmiReqPicukupLoading: false,
      visibleNonIntegratedShipping: false,
      inputNonIntegrated: '',
      isSubmiNonIntegratedLoading: false,
      isPrintLabelLoading: false
    }
  },

  computed: {
    dataProd () {
      let prod = this.formEdit.products
      return prod
    },
    orderId () {
      const id = this.formEdit.id
      return id
    },
  },

  methods: {
    computedListOrder(isForShopee){
      let data = [
        { caption: this.lang.purchase_date, value: this.formEdit.buy_date },
        { caption: this.lang.due_date, value: this.formEdit.due_date },
        { caption: this.lang.customer, value: this.formEdit.recipient },
        { caption: this.lang.courier, value: this.formEdit.shipping_agency },
        { caption: this.rootLang.receipt_no, value: this.formEdit.tracking_no},
        { caption: this.lang.status, value: isForShopee ? this.formEdit.status : this.formEdit.status_olsera },
        { caption: this.lang.payment, value: this.formEdit.payment_info },
        { caption: this.lang.subtotal, value: this.formEdit.grand_total },
        { caption: this.rootLang.shipping_cost, value: this.formEdit.shipping_cost },
        { caption: this.lang.discount, value: this.formEdit.voucher },
        { caption: this.lang.tax, value: this.formEdit.tax },
        { caption: this.lang.total, value: this.formEdit.total_payment },
      ]
      return data
    },
    
    handleSelect (data) {
      this.selectedProduct = { ...data}
    },

    getDetailOrder () {
      this.loadingData = true
      getDetailOrderShopee(this.orderId).then(response => {
        // this.formEdit = { ...response.data.data}
        this.$emit('updatedata', response.data.data)
        this.loadingData = false
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingData = false
      })
    },

    handleClose () {
      this.selectedProduct = {}
      this.dataSearch = []
      this.params = {
        search: '',
        per_page: 50
      },
      this.$emit('cancel')
    },

    handleSave () {
      this.$emit('saveproduct', this.formEdit)
    },

    handlePair (data) {
      this.visibleSyncProduct = true
      this.formSync = { ...data}
    },

    handleCloseDialogPair () {
      this.visibleSyncProduct = false
      this.formSync = {}
    },

    reloadData () {
      this.getDetailOrder()
      this.visibleSyncProduct = false
    },

    async cancellationHandler(type, payload) {
      let data = {
        shopee_shop_id : payload.shop_id,
        ordersn : payload.invoice_num
      }
      try {
        let response
        if (type === 'acc') {
          this.cancellationLoading.accept = true
          response = await acceptOrderCancellation(data)
        }
        if (type === 'reject') {
          this.cancellationLoading.reject = true
          response = await rejectOrderCancellation(data)
        }
        this.$message({
          type: 'success',
          message: response.data.message
        })
        // use to refetch
        this.$emit('refetch-after-select-shipping')
        this.handleClose()
      } 
      catch (error) {
        this.$message({
          type: 'error',
          message: error.message
        })
      } 
      finally {
        this.cancellationLoading = {
          reject: false,
          accept: false
        }
      }
    },

    formatDates(payload){
      return moment(payload, 'YYYY-MM-DD').locale(this.langId).format('ddd, D MMM')
    },

    handleSettingShippingDialog(){
      this.selectedShippingMethod = ''
      this.tempDataSettingShipping = { ...this.formEdit}
      this.visibleSettingShipping = true
    },

    handleCloseSettingShippingDialog(){
      this.visibleSettingShipping = false
    },

    async handleConfirmSelectedShippingMethod(){
      if (this.selectedShippingMethod === '') {
        this.$message({
          type: 'warning',
          message: 'Pilih metode pengiriman terlebih dahulu!'
        })
        return
      }
      try {
        this.isLoadingShippingMethod = true
        if (this.selectedShippingMethod === 'dropoff') {
          await this.dropOffHandler()
        } else if (this.selectedShippingMethod === 'pickup') {
          await this.reqPickupHandler()
        } else if (this.selectedShippingMethod === 'non_integrated') {
          await this.nonIntegratedHandler()
        }
      } catch (error) {
        alert(error)
      } finally {
        this.isLoadingShippingMethod = false
      }
    },

    async dropOffHandler() {
      try {
        const initLogisticData = {
          shopee_shop_id: this.tempDataSettingShipping.shop_id,
          ordersn : this.tempDataSettingShipping.invoice_num,
          dropoff: "NULL"
        }
        const responseInitLogistic = await initLogistic(initLogisticData)
        console.log(responseInitLogistic)
        setTimeout(() => {
          this.$message({
            type: 'success',
            message: 'Pengiriman berhasil diatur!'
          })
        }, 500)
        this.$emit('refetch-after-select-shipping')
        this.handleClose()
      } catch (error) {
        console.log('error', error)
        this.$message({
          type: 'error',
          message: error.message
        })
      } finally {
        this.handleCloseSettingShippingDialog()
      }
    },

    async reqPickupHandler() {
      try {
        let params = {
          shopee_shop_id: this.tempDataSettingShipping.shop_id,
          ordersn: this.tempDataSettingShipping.invoice_num
        }
        let response = await getAddressWithPickupTime(params)
        this.selectedAddress = response.data.data
        this.selectedDate = this.selectedAddress.option[0]
        this.selectedTime = this.selectedAddress.option[0].time[0]      
        this.visibleReqpickupShipping = true
      } catch (error) {
        console.log('error', error)
        this.$message({
          type: 'error',
          message: error.message
        })
      } finally {
        this.handleCloseSettingShippingDialog()
      }
    },

    nonIntegratedHandler() {
      this.visibleNonIntegratedShipping = true
      this.handleCloseSettingShippingDialog()
    },

    async sumbitReqPickupHandler() {
      if (Object.keys(this.selectedTime).length === 0){
        this.$message({
          type: 'warning',
          message: "Mohon lengkapi data!"
        })
        return
      }
      try {
        this.isSubmiReqPicukupLoading = true
        const initLogisticData = {
          shopee_shop_id: this.tempDataSettingShipping.shop_id,
          ordersn : this.tempDataSettingShipping.invoice_num,
          pickup: {
              address_id: this.selectedAddress.address.address_id,
              pickup_time_id: this.selectedTime.pickup_time_id
          }
        }
        await initLogistic(initLogisticData)
        this.handleCloseReqpickup()
        setTimeout(() => {
          this.$message({
            type: 'success',
            message: 'Pengiriman berhasil diatur!'
          })
        }, 500)
        this.$emit('refetch-after-select-shipping')
        this.handleClose()
      } 
      catch (error) {
        console.log(error);
        this.$message({
          type: 'error',
          message: error.message
        })
      }
      finally {
        this.isSubmiReqPicukupLoading = false
      }
    },

    async sumbitNonIntegratedHandler() { 
      try {
        this.isSubmiNonIntegratedLoading = true
        const initLogisticData = {
          shopid: this.tempDataSettingShipping.shop_id,
          ordersn: this.tempDataSettingShipping.invoice_num
        }
        if (this.inputNonIntegrated === '') {
          initLogisticData.non_integrated = 'NULL'
        } else {
          initLogisticData.non_integrated = {
            tracking_no: this.inputNonIntegrated
          }
        }
        await initLogistic(initLogisticData)
        this.handleCloseNonIntegrated()
        setTimeout(() => {
          this.$message({
            type: 'success',
            message: 'Pengiriman berhasil diatur!'
          })
        }, 500)
        this.$emit('refetch-after-select-shipping')
        this.handleClose()
      } 
      catch (error) {
        console.log(error);
        this.$message({
          type: 'error',
          message: error.message
        })
      }
      finally {
        this.isSubmiNonIntegratedLoading = false
      }
    },

    handleCloseReqpickup() {
      this.visibleReqpickupShipping = false
      this.selectedAddress = {}
      this.selectedDate = {}
      this.selectedTime = {}
    },

    handleCloseNonIntegrated(){
      this.visibleNonIntegratedShipping = false
      this.inputNonIntegrated = ''
    },

    handleSuccedSelectShipping(payload){
      this.selectedShippingMethod = payload
      this.tempDataSettingShipping = { ...this.formEdit}
      this.visibleSelectShippingSucceed = true
    },

    handleCloseSuccedSelectShipping(){
      this.visibleSelectShippingSucceed = false
      this.selectedShippingMethod = 'dropoff'
      this.tempDataSettingShipping = {}
    },

    async printLabelHandler(){
      try {
        this.isPrintLabelLoading = true
        const labelData = {
          shopee_shop_id: this.tempDataSettingShipping.shop_id,
          order_list : [this.tempDataSettingShipping.invoice_num]
        }
        const response = await printLabel(labelData)
        const file = new Blob([response.data], {type: 'application/pdf'})
        const url = window.URL.createObjectURL(file)
        window.open(url, "_blank")
      } catch (error) {
        console.log(error);
        this.$message({
          type: 'error',
          message: error.message
        })
      } finally {
        this.isPrintLabelLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.setting-shipping-wrapper {
  display: flex;
  gap: 16px;

  .option-shipping-card {
    flex: 1;
    border-radius: 8px;    
    padding: 5px 16px;
    text-align: center;
    background-color: #F5F5F5;
    transition: 0.2s ease-out;

    svg {
      font-size: 56px;
      margin: 24px 0;
    }

    &--active {
      -webkit-box-shadow: 0px 0px 0px 3px #1685C7; 
      box-shadow: 0px 0px 0px 3px #1685C7;
    }
  }
}

.days-wrapper {
  display: flex;
  flex-wrap: wrap;
  .day-item {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 50%;
    flex: 1;
    padding: 6px 0;
    background-color: #F5F5F5;
    transition: .2s ease-in
  }

  .active {
    color: white;
    background-color: #1685C7;
  }
}

.bg-grey {
  background-color: #FAFAFA;
}

</style>
