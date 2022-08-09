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
                    src="/static/img/lazada.png"
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
            </div>
          </div>
        </div>

        <div class="full-width px-24" >
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
            <div class="full-width">{{ lang.total }}</div>
            <div class="full-width text-right">{{ formEdit.total_amount }}</div>
          </div>
        </div>

        <div class="p-24 text-center mb-42" v-loading="loadingSearch">
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
                      src="/static/img/lazada.png"
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
              <el-button v-if="parseInt(data.status_pair) === 2" @click="handlePair(data)" type="pair-lazada" round class="flex-container justify-center" style="width: 100%; max-width: 116px">
                <svg-icon icon-class="plus" />
                  {{ rootLang.pair }}
              </el-button>
              <el-button v-if="parseInt(data.status_pair) === 1" type="lazada" round class="flex-container justify-center" style="width: 100%; max-width: 116px">
                <svg-icon class="color-info" icon-class="icon-feather-link" />
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
              <div class="like-table-wrapper--item flex-container full-width">
                <div class="full-width">Tanggal Beli</div>
                <div class="full-width text-right">{{ formEdit.buy_date }}</div>
              </div>
              <div class="like-table-wrapper--item flex-container">
                <div class="full-width">{{ lang.due_date }}</div>
                <div class="full-width text-right">{{ formEdit.due_date }}</div>
              </div>
              <div class="like-table-wrapper--item flex-container">
                <div class="full-width">{{ lang.courier }}</div>
                <div class="full-width text-right">{{ formEdit.shipping_agency }}</div>
              </div>
              <div class="like-table-wrapper--item flex-container">
                <div class="full-width">{{ lang.status }}</div>
                <div class="full-width text-right">{{ formEdit.status_olsera }}</div>
              </div>
            </div>
          </template>
          
        </div>

        <div class="offscreen-right-sidebar--footer">

          <el-button
            v-if="formEdit.status_save !== 1 && !fromList"
            :loading="loadingSave"
            :disabled="disableSave"
            type="lazada"
            class="btn-block mt-24"
            @click="handleSave">
            {{ rootLang.save }}
          </el-button>
        </div>
      </div>

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
import basicComputedMixin from '@/mixins/basicComputedMixin'
import CloseEsc from '@/components/modules/CloseEsc'
import offscreenSyncProduct from '@/components/modules/_views/service-activation/lazada/offscreenSyncProduct'

import { searchProduct, pairProductLazada, getdetailOrderLazada, saveOrderLazada } from '@/api/thirdParty/lazada'

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
    fromList: {
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
      loadingSave: false,
      formData: {},
      dataSearch: [],
      current_page: 0,
      last_page: 0,
      loadingSearch: false,
      selectedProduct: {},
      loadingPair: false,
      visibleSynProduct: false,
      formSync: {},
      loadingData: false
    }
  },

  watch: {
    formEdit(formEdit) {
      if (formEdit) {
        this.formData = { ...formEdit }
      }
    }
  },

  computed: {
    dataProd () {
      let prod = this.formEdit.products
      return prod
    },
    orderId () {
      const id = this.formEdit.order_no_lazada
      return id
    },

    disableSave () {
      let dis = false
      if (this.formEdit.products) {
        this.formEdit.products.map(i => {
          if (i.status_pair === 2) {
            dis = true
          }
        })
      }
      return dis
    }
  },

  mounted () {
    // if (this.formEdit.addon_items.length) {
    //   this.getCheckedAddon()
    // }
  },

  methods: {
    handleSearch () {
      
    },

    handleSelect (data) {
      this.selectedProduct = { ...data}
    },

    syncProduct () {
      let data = {
        product_id_lazada: this.formEdit.product_id,
        type: this.formEdit.type,
        product_id_olsera: this.selectedProduct.id,
        source_product: this.selectedProduct.type,
      }

      this.loadingPair = true
      pairProductLazada(data).then(response => {
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
      let data = {
        order_no_lazada: this.orderId,
      }
      getdetailOrderLazada(data).then(response => {
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
       let data = {
        order_no_lazada: this.orderId,
      }

      this.loadingSave = true
      saveOrderLazada(data).then(response => {
        this.$message({
          type: 'success',
          message: response.data.data.message
        })
        this.$emit('saveproduct')
        this.getDetailOrder()
        this.loadingSave = false
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingSave = false
      })
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
    }
  }
}
</script>
