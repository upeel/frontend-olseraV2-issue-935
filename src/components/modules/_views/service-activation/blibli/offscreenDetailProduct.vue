<template>
  <offscreen
    :show="show"
    title="Detail Produk"
    @close="handleClose">
    <card-info
      use-border
      class="mb-16">
      <div class="flex-container full-width">
        <avatar-tagged
          :avatar-src="formEdit.pictures"
          tag-src="/static/img/service-activation/blibli/blibli-icon.png"
        />
        <div>
          <div class="font-bold font-16 ml-8">
            {{ formEdit.name }}
          </div>
          <div v-if="formEdit.sku !== '' && formEdit.sku !== null" class="font-12 ml-8">
            {{ formEdit.price }} • {{ formEdit.sku }}
          </div>
          <div v-else class="font-12 ml-8">
            {{ formEdit.price }}
          </div>
        </div>
      </div>
    </card-info>

    <div class="mb-16">
      <div class="like-table-wrapper--item pointer flex-container">
        <div class="full-width">{{ rootLang.unit_price }}</div>
        <div class="full-width text-right">{{ formEdit.price }}</div>
      </div>
      <div class="like-table-wrapper--item pointer flex-container">
        <div class="full-width">{{ rootLang.stock_product }}</div>
        <div :class="formEdit.balance_stock === 1? 'full-width text-right color-warning' : 'full-width text-right'">{{ formEdit.stock }}</div>
      </div>
      <div class="like-table-wrapper--item pointer flex-container">
        <div class="full-width">{{ rootLang.category }}</div>
        <div class="full-width text-right">{{ formEdit.category }}</div>
      </div>
      <div class="like-table-wrapper--item pointer flex-container">
        <div class="full-width">{{ rootLang.etalase }} ({{ rootLang.group }})</div>
        <div class="full-width text-right">{{ formEdit.etalase }}</div>
      </div>
    </div>

    <div class="font-20 font-semi-bold mb-8">Terhubung Dengan</div>

    <card-info use-border class="mb-16">
      <div class="flex-container full-width" >
        <div class="flex-container">
          <el-avatar
            :src="formEdit.pair ? formEdit.pair.photo_md : null"
            :size="32"
            shape="square"
          />
          <div class="container-watermark-olsera color-white--bg" >
            <svg-icon icon-class="freemium_icon"/>
          </div>
        </div>
        <div>
          <div class="font-bold font-16 ml-8">
            {{ formEdit.pair ? formEdit.pair.name : null }}
          </div>
          <div v-if="formEdit.pair && formEdit.pair.sku !== '' && formEdit.pair.sku !== null" class="font-12 ml-8">
            {{ formEdit.pair.fprice }} • {{ formEdit.sku }}
          </div>
          <div v-else class="font-12 ml-8">
            {{ formEdit.fprice }}
          </div>
        </div>
      </div>
    </card-info>

    <div class="mb-16">
      <div class="like-table-wrapper--item pointer flex-container">
        <div class="full-width">{{ rootLang.unit_price }}</div>
        <div class="full-width text-right">{{ formEdit.pair ? formEdit.pair.fsell_price : null }}</div>
      </div>
      <div class="like-table-wrapper--item pointer flex-container">
        <div class="full-width">{{ rootLang.stock_product }}</div>
        <div class="full-width text-right">{{ formEdit.pair ? formEdit.pair.stock : null }}</div>
      </div>
      <div class="like-table-wrapper--item pointer flex-container">
        <div class="full-width">{{ rootLang.etalase }} ({{ rootLang.group }})</div>
        <div class="full-width text-right">{{ formEdit.pair ? formEdit.pair.etalase : null }}</div>
      </div>
    </div>

    <el-button
      v-if="formEdit.balance_stock === 1"
      type="warning"
      class="btn-block mb-8"
      @click="showUpdateStock = true">
      Selesaikan {{ rootLang.conflict_stock }}
    </el-button>

    <el-button
      :loading="loadingPair"
      type="info"
      class="btn-block"
      @click="resyncProduct">
      Hubungkan Ulang
    </el-button>

    <dialog-global
      :show="showUpdateStock"
      :show-close="false"
      :show-footer="false"
      hide-esc
      title="Update Stock">
      <template #top-buttons>
        <el-button type="info" @click="showUpdateStock = false">{{ rootLang.cancel }}</el-button>
        <el-button type="primary" :loading="loadingUpdateStock" @click="updateStock">{{ lang.update }}</el-button>
      </template>
      <div class="flex-container flex-container--content-center">
        <div>
          <el-avatar :src="formEdit.pair ? formEdit.pair.photo_md : null" :size="88" shape="square" />
        </div>
        <div class="color-warning font-40 font-bold ml-12">{{ formEdit.stock }}</div>
        <div>
          <img src="/static/img/service-activation/tokopedia/arrow_right.png" />
        </div>
        <div>
          <el-avatar :src="formEdit.pictures" :size="88" shape="square" />
        </div>
        <div class="font-40 font-bold ml-12">{{ formEdit.pair ? formEdit.pair.stock : null }}</div>
      </div>
      <div class="mt-24 word-break">
        <span class="font-bold">Update Stok ke Tokopedia</span> untuk menyamakan stok Tokopedia dengan stok produk di toko Olseramu
      </div>
    </dialog-global>
  </offscreen>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import { updateStockSingleProduct } from '@/api/thirdParty/blibli'
import AvatarTagged from '@/components/AvatarTagged.vue'
import CardInfo from '@/components/CardInfo'
import Offscreen from '@/components/Offscreen'
import DialogGlobal from '@/components/DialogGlobal'

export default {
  components: {
    AvatarTagged,
    CardInfo,
    Offscreen,
    DialogGlobal
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
      visibleChangeStatus: false,
      loadingStatus: false,
      showUpdateStock: false,
      loadingUpdateStock: false
    }
  },

  watch: {
    formEdit(formEdit) {
      if (formEdit) {
        this.formData = { ...formEdit }
        console.log(this.formData)
      }
    }
  },

  methods: {
    syncProduct () {
      // let data = {
      //   product_id_tokopedia: this.formEdit.product_id,
      //   type: this.formEdit.type,
      //   product_id_olsera: this.selectedProduct.id,
      //   source_product: this.selectedProduct.type,
      //   stock: this.formEdit.stock
      // }
      // this.loadingPair = true
      // pairProductTokopedia(data).then(response => {
      //   this.$message({
      //     type: 'success',
      //     message: response.data.data.message
      //   })
      //   this.handleClose()
      //   this.loadingPair = false
      // }).catch(error => {
      //   this.$message({
      //     type: 'error',
      //     message: error.string
      //   })
      //   this.loadingPair = false
      // })
    },

    handleClose () {
      this.$emit('cancel')
    },

    resyncProduct () {
      this.$emit('resync', this.formEdit)
    },

    cancelSwitch () {
      // this.formEdit.product_status === 1 ? this.formEdit.product_status = 0 : this.formEdit.product_status = 1
      this.visibleChangeStatus = false
    },

    handleChangeStatus (status) {
      // this.visibleChangeStatus = false
      // this.loadingStatus = true
      // let data = {
      //   status: status,
      //   type: this.formEdit.type,
      //   product_id: [this.formEdit.product_id]
      // }
      // changeStatusProduct(data).then(response => {
      //   this.$message({
      //     type: 'success',
      //     message: response.data.data.message
      //   })
      //   this.loadingStatus = false
      //   this.$emit('refresh')
      // }).catch(error => {
      //   this.$message({
      //     type: 'error',
      //     message: error.string
      //   })
      //   this.loadingStatus = false
      // })
    },

    updateStock () {
      console.log(this.formEdit)
      this.loadingUpdateStock = true
      const data = {
        id: this.formEdit.id,
        type: this.formEdit.type,
        stock: this.formEdit.pair.stock
      }
      updateStockSingleProduct(data).then(response => {
        this.$message({
          type: 'success',
          message: response.data.data.message
        })
        this.loadingUpdateStock = false
        this.showUpdateStock = false
        this.$emit('refresh')
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingUpdateStock = false
      })
    }
  }
}
</script>
