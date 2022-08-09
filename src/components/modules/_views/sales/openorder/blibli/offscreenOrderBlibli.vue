<template>
  <offscreen
    v-loading="loadingData"
    :show="show"
    :title="formEdit.status_save === 0 ? 'Simpan ke Olsera' : 'Detail Pesanan'"
    :hide-footer="formEdit.status_save !== 0"
    @close="handleClose">
    <card-info
      :title="formEdit.invoice_num"
      :desc="formEdit.status"
      use-border
      thumbnail="/static/img/service-activation/blibli/blibli-icon.png"
    />

    <div class="like-table-wrapper">
      <div
        v-for="(field, fieldKey) in dataOrder"
        :key="fieldKey"
        class="like-table-wrapper--item flex-container full-width">
        <div class="full-width">{{ fieldKey }}</div>
        <div class="full-width text-right">{{ field }}</div>
      </div>
    </div>

    <div class="text-center mb-42" v-loading="loadingSearch">
      <template v-if="dataProducts.length > 0">
        <div
          v-for="data in dataProducts"
          :key="data.id"
          class="like-table-wrapper--item pointer flex-container" >
          <div class="flex-container flex-grow-1" >
            <div>
              <el-avatar
                :src="data.images"
                :size="32"
                shape="square"
              />
              <el-avatar
                src="/static/img/service-activation/blibli/blibli-icon.png"
                class="mr-4"
                :size="20"
                style="position: absolute; left: 50px"
              />
            </div>
            <div class="font-bold font-16 ml-8">
              {{ data.qty }}x {{ data.name }}
            </div>
          </div>
          <el-button
            v-if="parseInt(data.status_pair) === 2"
            type="primary"
            plain
            round
            class="flex-container justify-center"
            @click="handlePair(data)">
            <svg-icon icon-class="plus" /> Hubungkan
          </el-button>
          <el-button
            v-if="parseInt(data.status_pair) === 1"
            plain
            round
            class="flex-container justify-center">
            <svg-icon class="color-info" icon-class="icon-feather-link" /> {{ rootLang.paired }}
          </el-button>
        </div>
      </template>

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

    <offscreen-sync-product
      :show="visibleSynProduct"
      :form-edit="formSync"
      @cancel="handleCloseDialogPair"
      @pair="reloadData"
    />

    <template #footer>
      <el-button
        :loading="loadingSave"
        :disabled="disableSave"
        type="lazada"
        class="btn-block mt-24"
        @click="handleSave">
        {{ rootLang.save }}
      </el-button>
    </template>
  </offscreen>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import CloseEsc from '@/components/modules/CloseEsc'
import offscreenSyncProduct from '@/components/modules/_views/service-activation/blibli/offscreenSyncProduct'
import CardInfo from '@/components/CardInfo'
import Offscreen from '@/components/Offscreen'
import { fetchSalesOrderDetail, saveSalesOrder } from '@/api/thirdParty/blibli.js'

export default {
  components: {
    CloseEsc,
    offscreenSyncProduct,
    CardInfo,
    Offscreen
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
      dataSearch: [],
      current_page: 0,
      last_page: 0,
      loadingSearch: false,
      selectedProduct: {},
      loadingPair: false,
      visibleSynProduct: false,
      formSync: {},
      loadingData: false,
      formData: {},
      loadingSave: false
    }
  },

  computed: {
    dataOrder () {
      if (this.formData && this.formData.id) {
        return {
          buy_date: this.formData.buy_date,
          customer: this.formData.recipient,
          shipping_agency: this.formData.shipping_agency,
          shipping_cost: this.formData.shipping_cost,
          tracking_no: this.formData.tracking_no,
          due_date: this.formData.due_date,
          grand_total: this.formData.grand_total,
          insurance_cost: this.formData.insurance_cost,
          payment_info: this.formData.payment_info,
          phone: this.formData.phone,
          status: this.formData.status,
          status_code_olsera: this.formData.status_code_olsera,
          status_desc: this.formData.status_desc,
          status_olsera: this.formData.status_olsera,
          status_save: this.formData.status_save,
          total_payment: this.formData.total_payment
        }
      } else {
        return {}
      }
    },
    dataProducts () {
      let prod = []
      if (this.formEdit.products) {
        prod = this.formEdit.products
      }
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
    }
  },

  watch: {
    show(payload) {
      if (payload && this.formEdit && this.formEdit.id) {
        this.formData = { ...this.formEdit }
        this.getDetailOrder()
      }
    }
  },

  methods: {
    handleSearch () {
      //
    },
    handleSelect (data) {
      // console.log('data', data)
      this.selectedProduct = { ...data}
    },
    syncProduct () {
      //
    },
    getDetailOrder () {
      this.loadingData = true
      fetchSalesOrderDetail({
        id: this.formData.id
      }).then(response => {
        this.formData = response.data.data
        this.loadingData = false
      }).catch(error => {
        this.formData = {}
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingData = false
        this.handleClose()
      })
    },
    handleClose() {
      this.selectedProduct = {}
      this.dataSearch = []
      this.formData = {}
      this.params = {
        search: '',
        per_page: 50
      },
      this.$emit('cancel')
    },
    handleSave() {
      this.loadingSave = true
      saveSalesOrder({
        id: this.formData.id
      }).then((response) => {
        this.loadingSave = false
        this.$message({
          type: 'success',
          message: 'Sucessfully saved'
        })
        this.$emit('refresh')
      }).catch((error) => {
        this.loadingSave = false
        this.$message({
          type: 'error',
          message: error.string
        })
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
