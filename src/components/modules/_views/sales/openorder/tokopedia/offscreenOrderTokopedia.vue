<template>
  <transition name="el-zoom-in-center">
    <div
      v-if="show"
      class="offscreen-right-sidebar px-null">
      <div v-loading="loadingData" class="offscreen-right-sidebar--wrapper">
        <div class="offscreen-right-sidebar--header text-left color-white--bg" style="z-index: 10">
          <span >{{ formEdit.status_save === 0? 'Simpan ke Olsera' : 'Detail Pesanan' }}</span>
          <close-esc :hideEsc="true" @close="handleClose" />
        </div>
        
        <div class="p-24">
          <div class="border border--grey-border radius-10 p-8 flex-container">
            <div class="full-width flex-container">
              <div class="flex-container full-width" >
                <div>
                  <el-avatar
                    src="/static/img/tokopedia.png"
                    :size="32"
                    shape="circle"
                  />
                </div>
                <div>
                  <div class="font-bold font-16 ml-8">
                    {{ formEdit.invoice_num }}
                  </div>
                  <div class="ml-8 font-12 color-info">
                    {{ formEdit.status }}
                  </div>
                </div>
              </div>
              <div v-if="formEdit.status_code_tokopedia >= 400">
                <el-button type="text" :loading="loadingDownload" @click="handleGetLabelOrder">
                  <svg-icon icon-class="icon-printer" class="font-20" />
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="formEdit.is_request_cancel === 1" class="p-24">
          <div class="p-16 flex-container color-red-soft--bg radius-5">
            <div class="container-icon">
              <svg-icon icon-class="icon-cancel-octagon" />
            </div>
            <div class="full-width">
              Pembeli mengajukan pembatalan pesanan. Alasan pembatalan: <span class="font-bold">"{{ formEdit.reason_cancellation }}"</span>
            </div>
          </div>
          <div class="mt-24 flex-container">
            <template v-if="formEdit.is_request_cancel === 1">
              <el-button v-if="formEdit.status_order === 'R' || formEdit.status_order === 'C'" class="text-center btn-block" plain @click="handleChangeStatus">{{ formEdit.status_order === 'R'? 'Request Pickup' : 'Accept Shipping'}}</el-button>
              <el-button
                v-if="formEdit.status_save !== 1 && !fromList && formEdit.is_request_cancel === 1"
                :loading="loadingSave"
                :disabled="disableSaveNew"
                class="btn-block"
                @click="handleSave">
                {{ this.formEdit.status_code_tokopedia === 220 ? rootLang.confirm + ' &' : '' }} {{ rootLang.save }}
              </el-button>
              <el-button v-if="formEdit.is_request_cancel === 1" type="tokopedia" class="btn-block" @click="handleCancel(true)">Terima pembatalan</el-button>
            </template>
          </div>
        </div>

        <div class="full-width px-24" >
          <!-- <el-input class="inline-form input-search full-width" clearable :placeholder="lang.search" prefix-icon="el-icon-search" v-model="params.search" @change="handleSearch" size="small"></el-input> -->
          <div class="like-table-wrapper--item flex-container full-width">
            <div class="full-width">Tanggal Beli</div>
            <div class="full-width text-right">{{ formEdit.buy_date }}</div>
          </div>
          <div class="like-table-wrapper--item flex-container">
            <div class="full-width">{{ lang.due_date }}</div>
            <div class="full-width text-right">{{ formEdit.due_date }}</div>
          </div>
          <div class="like-table-wrapper--item flex-container">
            <div class="full-width">{{ lang.customer }}</div>
            <div class="full-width text-right">{{ formEdit.recipient }}</div>
          </div>
          <!-- <div class="like-table-wrapper--item flex-container">
            <div class="full-width">{{ rootLang.send_to }}</div>
            <div class="full-width text-right">{{  }}</div>
          </div> -->
          <div class="like-table-wrapper--item flex-container">
            <div class="full-width">{{ lang.courier }}</div>
            <div class="full-width text-right">{{ formEdit.shipping_agency }}</div>
          </div>
          <div class="like-table-wrapper--item flex-container">
            <div class="full-width">{{ rootLang.receipt_no }}</div>
            <div class="full-width text-right">{{ formEdit.awb }}</div>
          </div>
          <div class="like-table-wrapper--item flex-container">
            <div class="full-width">{{ lang.status }}</div>
            <div class="full-width text-right">{{ formEdit.status }}</div>
          </div>
          <div class="like-table-wrapper--item flex-container">
            <div class="full-width">{{ lang.payment }}</div>
            <div class="full-width text-right">{{ formEdit.payment_info }}</div>
          </div>
          <div class="like-table-wrapper--item flex-container">
            <div class="full-width">{{ lang.subtotal }}</div>
            <div class="full-width text-right">{{ formEdit.total_payment }}</div>
          </div>
          <div class="like-table-wrapper--item flex-container">
            <div class="full-width">{{ rootLang.shipping_cost }}</div>
            <div class="full-width text-right">{{ formEdit.shipping_cost }}</div>
          </div>
          <div class="like-table-wrapper--item flex-container">
            <div class="full-width">{{ rootLang.insurance_cost }}</div>
            <div class="full-width text-right">{{ formEdit.insurance_cost }}</div>
          </div>
          <div class="like-table-wrapper--item flex-container">
            <div class="full-width">{{ lang.total }}</div>
            <div class="full-width text-right">{{ formEdit.grand_total }}</div>
          </div>
        </div>

        <div class="p-24 text-center" style="margin-bottom: 100px" v-loading="loadingSearch">
          <!-- <div v-if="dataSearch.length === 0">
            <img src="/static/img/service-activation/tokopedia/no_product_search.png" >
          </div> -->

          <div v-if="dataProd && dataProd.length > 0">
            <div id="here" v-for="data in dataProd" :key="data.id" class="like-table-wrapper--item pointer flex-container" >
              <div class="full-width text-left">
                <div class="flex-container full-width" >
                  <div>
                    <el-avatar
                      :src="data.pictures"
                      :size="32"
                      shape="square"
                    />
                    <el-avatar
                      src="/static/img/tokopedia.png"
                      class="mr-4"
                      :size="20"
                      style="position: absolute; left: 50px"
                    />
                  </div>
                  <div>
                    <div class="font-bold font-16 ml-8">
                      {{ data.qty }}x {{ data.name }}
                    </div>
                  </div>
                </div>
              </div>
              <el-button v-if="parseInt(data.status_pair) === 2" @click="handlePair(data)" type="pair-tokopedia" round class="flex-container justify-center" style="width: 100%; max-width: 116px">
                <svg-icon icon-class="plus" />
                  Hubungkan
              </el-button>
              <el-button v-if="parseInt(data.status_pair) === 1" type="tokopedia" round class="flex-container justify-center" style="width: 100%; max-width: 116px">
                <svg-icon icon-class="icon-feather-link" />
                  {{ rootLang.paired }}
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
              <span class="font-12">Pada</span>
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
              <!-- <el-input class="inline-form input-search full-width" clearable :placeholder="lang.search" prefix-icon="el-icon-search" v-model="params.search" @change="handleSearch" size="small"></el-input> -->
              <div class="like-table-wrapper--item flex-container full-width">
                <div class="full-width">Tanggal Beli</div>
                <div class="full-width text-right">{{ formEdit.buy_date }}</div>
              </div>
              <div class="like-table-wrapper--item flex-container">
                <div class="full-width">{{ lang.due_date }}</div>
                <div class="full-width text-right">{{ formEdit.due_date }}</div>
              </div>
              <!-- <div class="like-table-wrapper--item flex-container">
                <div class="full-width">{{ lang.customer }}</div>
                <div class="full-width text-right">{{ formEdit.recipient }}</div>
              </div> -->
              <!-- <div class="like-table-wrapper--item flex-container">
                <div class="full-width">{{ rootLang.send_to }}</div>
                <div class="full-width text-right">{{  }}</div>
              </div> -->
              <div class="like-table-wrapper--item flex-container">
                <div class="full-width">{{ lang.courier }}</div>
                <div class="full-width text-right">{{ formEdit.shipping_agency }}</div>
              </div>
              <!-- <div class="like-table-wrapper--item flex-container">
                <div class="full-width">{{ rootLang.receipt_no }}</div>
                <div class="full-width text-right">{{ formEdit.order_no_tokopedia }}</div>
              </div> -->
              <div class="like-table-wrapper--item flex-container">
                <div class="full-width">{{ lang.status }}</div>
                <div class="full-width text-right">{{ formEdit.status_olsera }}</div>
              </div>
              <!-- <div class="like-table-wrapper--item flex-container">
                <div class="full-width">{{ lang.payment }}</div>
                <div class="full-width text-right">{{ formEdit.payment_info }}</div>
              </div>
              <div class="like-table-wrapper--item flex-container">
                <div class="full-width">{{ lang.total }}</div>
                <div class="full-width text-right">{{ formEdit.total_payment }}</div>
              </div> -->
            </div>
          </template>
          
        </div>

        <div class="offscreen-right-sidebar--footer">

          <!-- <template v-if="stageLevel === 'dev' || stageLevel === 'sit'"> -->
            <div class="flex-container">
              <el-button
                v-if="disableCancelOrder"
                :loading="loadingCancelOrder"
                class="btn-block mt-24 color-danger mr-4"
                @click="getRejectReason">
                {{ rootLang.reject }}
              </el-button>
              <el-button
                v-if="!disableCancelOrder"
                :loading="loadingCancelOrder"
                class="btn-block mt-24 color-danger mr-4"
                @click="handleClose">
                {{ rootLang.cancel }}
              </el-button>
              <el-button
                v-if="formEdit.status_save !== 1 && !fromList && formEdit.is_request_cancel !== 1"
                :loading="loadingSave"
                :disabled="disableSaveNew"
                type="success"
                class="btn-block mt-24 ml-4"
                @click="handleSave">
                {{ this.formEdit.status_code_tokopedia === 220 ? rootLang.confirm + ' &' : '' }} {{ rootLang.save }}
              </el-button>
            </div>
          <!-- </template>
          <template v-else>
            <el-button
              v-if="formEdit.status_save !== 1 && !fromList"
              :loading="loadingSave"
              :disabled="disableSave"
              type="success"
              class="btn-block mt-24"
              @click="handleSave">
              {{ rootLang.save }}
            </el-button>
          </template> -->
        </div>
      </div>

      <el-dialog
      :visible.sync="dialogRejectReason"
      :show-close="false"
      append-to-body
      width="344px">
      <div class="text-left">
        <span class="font-16">Pilih alasan penolakan pesanan :</span>
          <el-radio-group v-model="dataSelected.reason_code" class="full-width like-table-wrapper border border--table-border">
            <div v-for="item in rejectOption" :key="item.code" class="flex-container mr-8 p-8 radio-custom--no-shadow like-table-wrapper--item" @click="handleSelectReason(item.code)">
              <div class="full-width flex-container pointer">
                <div class="ml-8">
                  <div class="font-16 font-bold">{{ item.description }}</div>
                </div>
              </div>
              <el-radio :label="item.code" :class="dataSelected.reason_code === item.code ? 'radio-custom-normal radio-custom-normal--is-checked--no-background' : 'radio-custom-normal'">
                <span></span>
              </el-radio>
            </div>
          </el-radio-group>
          <div class="mt-24" v-if="dataSelected.reason_code === 4">
            <div class="mb-8">Toko tutup sampai tanggal</div>
            <single-date-picker v-model="dataSelected.shop_close_end_date" :clearable="true" />
          </div>
          <div class="mt-24">
            <span>Berikan penjelasan kepada pembeli</span>
            <el-input v-model="dataSelected.reason" type="textarea" />
          </div>
          <div class="mt-24 flex-container">
            <div class="full-width pr-4"> <el-button class="btn-block" type="info" @click="handleCloseCancelOrder">{{ rootLang.cancel }}</el-button> </div>
            <div class="full-width pl-4">
              <el-button :loading="loadingCancel" class="btn-block" type="tokopedia" @click="handleCancel(false)">Tolak Pesanan</el-button>
            </div>
          </div>
      </div>
    </el-dialog>

      <offscreen-sync-product
        :show="visibleSynProduct"
        :form-edit="formSync"
        @cancel="handleCloseDialogPair"
        @pair="reloadData"
      />

    </div>
  </transition>
</template>

<script>
import moment from 'moment'
import basicComputedMixin from '@/mixins/basicComputedMixin'
import CloseEsc from '@/components/modules/CloseEsc'
import offscreenSyncProduct from '@/components/modules/_views/service-activation/tokopedia/offscreenSyncProduct'
import SingleDatePicker from '@/components/SingleDatePicker'

import { searchProduct, pairProductTokopedia, getdetailOrderTokopedia, RejectReasonTokopedia, getPrintLabelOrderTokopedia } from '@/api/thirdParty/tokopedia'

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
    },
    loadingCancelOrder: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      params: {
        search: '',
        // search_column: 'name',
        per_page: 50
      },
      dataSearch: [],
      current_page: 0,
      last_page: 0,
      loadingSearch: false,
      selectedProduct: {},
      loadingPair: false,
      visibleSynProduct: false,
      formSync: {},
      loadingData: false,
      loadingCancel: false,
      dialogRejectReason: false,
      rejectOption: [],
      dataSelected: {
        reason_code: null,
        reason: ''
      },
      loadingDownload: false,
      dialogLabel: false,
      dataLabel: ''
    }
  },

  watch: {
    formEdit(formEdit) {
      console.log('tracert', formEdit)
      if (formEdit) {
        this.formData = { ...formEdit }
        console.log(this.formData)
      }
    }
  },

  computed: {
    dataProd () {
      let prod = this.formEdit.products
      return prod
    },
    orderId () {
      const id = this.formEdit.order_no_tokopedia
      return id
    },

    disableSave () {
      let dis = false
      this.formEdit.products.map(i => {
        if (i.status_pair === 2) {
          dis = true
        }
      })
      return dis
    },

    disableSaveNew () {
      let dis = false
      if (this.formEdit.status_cod === 1 && (this.formEdit.status_order !== 'T' || this.formEdit.status_order !== 'Z')) {
        dis = true
      } else {
        this.formEdit.products.map(i => {
          if (i.status_pair === 2) {
            dis = true
          }
        })
      }
      return dis
    },

    disableCancelOrder () {
      let cancelOrder = false
      if (this.formEdit.status_code_tokopedia !== 15 && this.formEdit.status_code_tokopedia >= 11 && this.formEdit.status_code_tokopedia <= 400 && this.formEdit.is_request_cancel !== 1) {
        cancelOrder = true
      }
      return cancelOrder
    }
  },

  mounted () {
    // if (this.formEdit.addon_items.length) {
    //   this.getCheckedAddon()
    // }
  },

  methods: {
    handleSearch () {
      this.loadingSearch = true
      if (this.params.search !== '') {
        searchProduct(this.params).then(response => {
          this.dataSearch = [ ...response.data.data]
          this.dataSearch.map(i => {
            i.select = false
          })
          this.current_page = response.data.meta.current_page
          this.last_page = response.data.meta.last_page
          this.loadingSearch = false
        }).catch(error => {
          this.$message({
            type: 'error',
            message: error.string
          })
          this.dataSearch = []
          this.loadingSearch = false
        })
      } else {
        this.dataSearch = []
        this.loadingSearch = false
      }
    },

    handleSelect (data) {
      // console.log('data', data)
      this.selectedProduct = { ...data}
    },

    syncProduct () {
      let data = {
        product_id_tokopedia: this.formEdit.product_id,
        type: this.formEdit.type,
        product_id_olsera: this.selectedProduct.id,
        source_product: this.selectedProduct.type,
        stock: this.formEdit.stock
      }

      this.loadingPair = true
      pairProductTokopedia(data).then(response => {
        this.$message({
          type: 'success',
          message: response.data.data.message
        })
        this.getDetailOrder()
        this.loadingPair = false
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingPair = false
      })
    },

    getDetailOrder () {
      this.loadingData = true
      getdetailOrderTokopedia(this.orderId).then(response => {
        this.formEdit = { ...response.data.data}
        // this.handleClose()
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

    handleCancel (isRequestCancel) {
      let data = {}
      
      if (isRequestCancel) {
        data = {
          order_id: parseInt(this.formEdit.order_no_tokopedia),
          reason_code: 8,
          reason: this.formEdit.reason_cancellation,
          merchant_tokopedia_id: this.formEdit.merchant_tokopedia_id
        }
      } else {
        data = {
          order_id: parseInt(this.formEdit.order_no_tokopedia),
          reason_code: this.dataSelected.reason_code,
          reason: this.dataSelected.reason,
          merchant_tokopedia_id: this.formEdit.merchant_tokopedia_id
        }
      }

      if (this.dataSelected.reason_code === 4) {
        let date = moment(this.dataSelected.shop_close_end_date).format('DD/MM/YYYY')
        data.shop_close_end_date = date
        data.shop_close_note = data.reason
      }
      this.dataSelected = {
        reason_code: null,
        reason: ''
      }
      this.dialogRejectReason = false
      this.$emit('cancelordertokped', data)
    },

    handleCloseCancelOrder () {
      this.dataSelected = {
        reason_code: null,
        reason: ''
      }
      this.dialogRejectReason = false
    },

    handlePair (data) {
      this.visibleSynProduct = true
      this.formSync = { ...data}
    },

    handleCloseDialogPair () {
      this.visibleSynProduct = false
      this.formSync = {}
    },

    reloadData () {
      this.getDetailOrder()
      this.visibleSynProduct = false
    },

    getRejectReason () {
      this.loadingCancel = true
      this.rejectOption = []
      RejectReasonTokopedia().then(response => {
        // this.rejectOption = { ...response.data.data}
        let other = {}
        response.data.data.map(i => {
          if (i.code !== 5) { this.rejectOption.push(i) }
          else { other = i }
        })
        this.rejectOption.push(other)
        
        if (this.formEdit.is_request_cancel === 0) {
          let index = null
          this.rejectOption.map((i, idx) => {
            if (i.code === 8) {
              index = idx
            }
          })
          if (index !== null) { this.rejectOption.splice(index, 1)}
        }
        this.dialogRejectReason = true
        this.loadingCancel = false
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingCancel = false
      })
    },

    handleSelectReason (id) {
      this.dataSelected.reason_code = id
    },

    handleGetLabelOrder () {
      this.loadingDownload = true
      let param = {
        order_no_tokopedia: this.formEdit.order_no_tokopedia
      }
      getPrintLabelOrderTokopedia(param).then(response => {
        // this.rejectOption = { ...response.data.data}
        // console.log('tokped', response.data)
        this.dataLabel = response.data
        // this.dialogLabel = true
        // window.open(this.dataLabel)
        var wnd = window.open("about:blank", "");
        wnd.document.write(this.dataLabel);
        wnd.document.close();

        this.loadingDownload = false
      }).catch(error => {
        
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingDownload = false
      })
    },

    handleChangeStatus () {
      this.$emit('updateshipping', this.formEdit)
    }
  }
}
</script>
