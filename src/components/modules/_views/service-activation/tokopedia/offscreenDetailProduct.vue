<template>
  <transition name="el-zoom-in-center">
    <div
      v-if="show"
      class="offscreen-right-sidebar px-null">
      <div class="offscreen-right-sidebar--wrapper">
        <div class="offscreen-right-sidebar--header text-left color-white--bg" style="z-index: 10">
          <span class="px-16">Detail Produk</span>
          <close-esc :hideEsc="true" @close="handleClose" />
        </div>
        
        <div class="p-24">
          <div class="border border--grey-border radius-10 p-8 flex-container">
            <div class="full-width">
              <div class="flex-container full-width" >
                <div>
                  <el-avatar
                    :src="formEdit.pictures"
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
            </div>
          </div>
        </div>

        <div v-loading="loadingStatus" class="px-24">
          <div class="border border--grey-border radius-10 p-8 flex-container">
            <div class="full-width">
              <label>Status Produk (Tokopedia)</label>
            </div>
            <div class="full-width flex-container">
              <div class="full-width text-right">
                <span v-if="formEdit.product_status == 0">{{ lang.no }} {{ rootLang.active }}</span>
                <span v-if="formEdit.product_status == 1">{{ rootLang.active }}</span>
              </div>
              <!-- <el-switch v-model="formEdit.product_status" :active-value="1" :inactive-value="0"></el-switch> -->
              <popover-confirmation 
                :tokopedia="true"
                :data="formEdit.product_status" 
                :visible="visibleChangeStatus" 
                @cancel="cancelSwitch"
                @confirm="handleChangeStatus"/>
            </div>
          </div>
        </div>
        <span class="font-11 px-24">{{ rootLang.status_product_tokopedia_note }}</span>

        <div class="px-24">
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

        <div class="p-24">
          <span class="font-24 font-bold">Terhubung Dengan</span>
        </div>

        <div class="p-24">
          <div class="border border--grey-border radius-10 p-8 flex-container">
            <div class="full-width">
              <div class="flex-container full-width" >
                <div class="flex-container">
                  <el-avatar
                    :src="formEdit.pair.photo_md"
                    :size="32"
                    shape="square"
                  />
                  <div class="container-watermark-olsera color-white--bg" >
                    <svg-icon icon-class="freemium_icon"/>
                  </div>
                </div>
                <div>
                  <div class="font-bold font-16 ml-8">
                    {{ formEdit.pair.name }}
                  </div>
                  <div v-if="formEdit.pair.sku !== '' && formEdit.pair.sku !== null" class="font-12 ml-8">
                    {{ formEdit.pair.fprice }} • {{ formEdit.sku }}
                  </div>
                  <div v-else class="font-12 ml-8">
                    {{ formEdit.fprice }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="px-24">
          <div class="like-table-wrapper--item pointer flex-container">
            <div class="full-width">{{ rootLang.unit_price }}</div>
            <div class="full-width text-right">{{ formEdit.pair.fsell_price }}</div>
          </div>
          <div class="like-table-wrapper--item pointer flex-container">
            <div class="full-width">{{ rootLang.stock_product }}</div>
            <div class="full-width text-right">{{ formEdit.pair.stock }}</div>
          </div>
          <!-- <div class="like-table-wrapper--item pointer flex-container">
            <div class="full-width">{{ rootLang.category }}</div>
            <div class="full-width text-right">{{ formEdit.category }}</div>
          </div> -->
          <div class="like-table-wrapper--item pointer flex-container">
            <div class="full-width">{{ rootLang.etalase }} ({{ rootLang.group }})</div>
            <div class="full-width text-right">{{ formEdit.pair.etalase }}</div>
          </div>
        </div>

        <div v-if="formEdit.balance_stock === 1" class="px-24 pt-24" style="margin-bottom: -6px;">
          <el-button
            type="warning"
            class="btn-block"
            @click="showUpdateStock = true">
            Selesaikan {{ rootLang.conflict_stock }}
          </el-button>
        </div>

        <div class="p-24">
          <el-button
            :loading="loadingPair"
            class="btn-block color-danger mb-8"
            @click="handleUnpairProduct">
            Hapus Hubungan
          </el-button>

          <el-button
            type="info"
            :loading="loadingPair"
            class="btn-block"
            @click="resyncProduct">
            Hubungkan Ulang
          </el-button>
        </div>
      </div>

      <el-dialog
        :visible.sync="showUpdateStock"
        :show-close="false"
        width="536px"
        append-to-body>
        <div slot="title" class="flex-container">
          <h4 class="dialog-title full-width font-bold font-24">
            Update Stock
          </h4>
          <template>
            <el-button type="info" @click="showUpdateStock = false">{{ rootLang.cancel }}</el-button>
            <el-button type="tokopedia" :loading="loadingUpdateStock" @click="updateStock">{{ lang.update }}</el-button>
          </template>
        </div>
        <div>
          <div class="flex-container">
            <div>
              <el-avatar :src="formEdit.pictures" :size="88" shape="square" />
              <el-image src="/static/img/service-activation/tokopedia/source_indicator.png" :size="40" style="position: absolute; left: 68px"/>
            </div>
            <div class="color-warning font-40 font-bold ml-24">{{ formEdit.stock }}</div>
            <div>
              <el-image src="/static/img/service-activation/tokopedia/arrow_right.png" :size="40" />
            </div>
            <div :style="'background-image: url(' + formEdit.pictures + ')'" class="avatar-tokped text-right">
              <div class="watermark-tokped color-white--bg fl-right flex-container" ></div>
            </div>
            <div class="color-warning font-40 font-bold ml-24">{{ formEdit.pair.stock }}</div>
          </div>
          <div class="mt-24 word-break">
            <span class="font-bold">Update Stok ke Tokopedia</span> untuk menyamakan stok Tokopedia dengan stok produk di toko Olseramu
          </div>
        </div>
        
      </el-dialog>

    </div>
  </transition>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import CloseEsc from '@/components/modules/CloseEsc'

import { searchProduct, pairProductTokopedia, changeStatusProduct, updateSingleProductTokopedia, unpairProductTokopedia } from '@/api/thirdParty/tokopedia'

import PopoverConfirmation from '../../../../PopoverConfirmation.vue'

export default {
  components: {
    CloseEsc,
    PopoverConfirmation
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
      showUpdateStock: false
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
    // 
  },

  mounted () {
    // if (this.formEdit.addon_items.length) {
    //   this.getCheckedAddon()
    // }
  },

  methods: {
    syncProduct () {
      let data = {
        product_id_tokopedia: this.formEdit.product_id,
        type: this.formEdit.type,
        product_id_olsera: this.selectedProduct.id,
        source_product: this.selectedProduct.type,
        stock: this.formEdit.stock,
        merchant_tokopedia_id: this.tokopediaActiveStore.id
      }

      this.loadingPair = true
      pairProductTokopedia(data).then(response => {
        this.$message({
          type: 'success',
          message: response.data.data.message
        })
        this.handleClose()
        this.loadingPair = false
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingPair = false
      })
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
      this.visibleChangeStatus = false
      this.loadingStatus = true
      let data = {
        status: status,
        type: this.formEdit.type,
        product_id: [this.formEdit.product_id],
        merchant_tokopedia_id: this.tokopediaActiveStore.id
      }
      changeStatusProduct(data).then(response => {
        this.$message({
          type: 'success',
          message: response.data.data.message
        })
        this.loadingStatus = false
        this.$emit('refresh')
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingStatus = false
      })
    },

    updateStock () {
      this.loadingUpdateStock = true
      let data = {
        product_id_tokopedia: this.formEdit.product_id,
        type: this.formEdit.type,
        stock: this.formEdit.pair.stock
      }
      if (this.tokopediaActiveStore !== null) {
        data.merchant_tokopedia_id = this.tokopediaActiveStore.id
      }

      updateSingleProductTokopedia(data).then(response => {
        this.$message({
          type: 'success',
          message: response.data.data.message
        })
        this.loadingUpdateStock = false
        this.showUpdateStock = false
        this.$emit('refresh')
      }).catch(error => {
        console.log('e', error)
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingUpdateStock = false
      })
    },

    handleUnpairProduct () {
      let data = {
        product_id_tokopedia: this.formEdit.product_id ? this.formEdit.product_id : this.formEdit.product_id_tokopedia,
        type: this.formEdit.type
      }

      if (this.tokopediaActiveStore !== null) {
        data.merchant_tokopedia_id = this.tokopediaActiveStore.id
      }

      this.loadingPair = true
      unpairProductTokopedia(data).then(response => {
        this.$message({
          type: 'success',
          message: response.data.data.message
        })
        this.$emit('unpair')
        this.loadingPair = false
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingPair = false
      })
    },
  }
}
</script>
