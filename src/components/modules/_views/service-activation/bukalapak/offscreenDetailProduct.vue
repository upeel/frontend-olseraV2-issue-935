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
                    src="/static/img/bukalapak.png"
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

        <div class="px-24">
          <div class="like-table-wrapper--item pointer flex-container">
            <div class="full-width">{{ rootLang.unit_price }}</div>
            <div class="full-width text-right">{{ formEdit.price }}</div>
          </div>
          <div class="like-table-wrapper--item pointer flex-container">
            <div class="full-width">{{ rootLang.stock_product }}</div>
            <div :class="formEdit.balance_stock === true? 'full-width text-right color-warning' : 'full-width text-right'">{{ formEdit.stock }}</div>
            <!-- <div :class="parseInt(formEdit.balance_stock) === 1? 'full-width text-right color-warning' : 'full-width text-right'">{{ formEdit.stock }}</div> -->
          </div>
          <div class="like-table-wrapper--item pointer flex-container">
            <div class="full-width">{{ rootLang.category }}</div>
            <div class="full-width text-right">{{ formEdit.category.name }}</div>
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
                    :src="formEdit.olsera_product.photo_md"
                    :size="32"
                    shape="square"
                  />
                  <div class="container-watermark-olsera color-white--bg" >
                    <svg-icon icon-class="freemium_icon"/>
                  </div>
                </div>
                <div>
                  <div class="font-bold font-16 ml-8">
                    {{ formEdit.olsera_product.name }}
                  </div>
                  <div v-if="formEdit.olsera_product.sku !== '' && formEdit.olsera_product.sku !== null" class="font-12 ml-8">
                    {{ formEdit.olsera_product.fsell_price }} • {{ formEdit.olsera_product.sku }}
                  </div>
                  <div v-else class="font-12 ml-8">
                    {{ formEdit.fsell_price }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="px-24">
          <div class="like-table-wrapper--item pointer flex-container">
            <div class="full-width">{{ rootLang.unit_price }}</div>
            <div class="full-width text-right">{{ formEdit.olsera_product.fsell_price }}</div>
          </div>
          <div class="like-table-wrapper--item pointer flex-container">
            <div class="full-width">{{ rootLang.stock_product }}</div>
            <div class="full-width text-right">{{ formEdit.olsera_product.stock }}</div>
          </div>
          <div class="like-table-wrapper--item pointer flex-container">
            <div class="full-width">{{ rootLang.category }}</div>
            <div class="full-width text-right">{{ formEdit.category.name }}</div>
          </div>
        </div>

        <div v-if="formEdit.has_conflict_stock === true" class="px-24 pt-24" style="margin-bottom: -6px;">
          <el-button
            type="warning"
            class="btn-block"
            @click="showUpdateStock = true">
            Selesaikan {{ rootLang.conflict_stock }}
          </el-button>
        </div>

        <div class="p-24">
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
            <el-button type="bukalapak" :loading="loadingUpdateStock" @click="updateStock">{{ lang.update }}</el-button>
          </template>
        </div>
        <div>
          <div class="flex-container justify-center">
            <div>
              <el-avatar :src="formEdit.pictures" :size="88" shape="square" />
              <el-image src="/static/img/service-activation/tokopedia/source_indicator.png" :size="40" style="position: absolute; left: 68px"/>
            </div>
            <div class="color-warning font-40 font-bold ml-24">{{ formEdit.stock }}</div>
            <div>
              <el-image src="/static/img/service-activation/tokopedia/arrow_right.png" :size="40" />
            </div>
            <div :style="'background-image: url(' + formEdit.pictures + ')'" class="avatar-tokped text-right">
              <div class="watermark-bukalapak color-white--bg fl-right flex-container" ></div>
            </div>
            <div class="color-warning font-40 font-bold ml-24">{{ formEdit.olsera_product.stock }}</div>
          </div>
          <div class="mt-24 word-break">
            <span class="font-bold">Update</span> untuk menyamakan stok Bukalapak dengan stok produk di toko Olseramu
          </div>
        </div>
        
      </el-dialog>

    </div>
  </transition>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import CloseEsc from '@/components/modules/CloseEsc'

import { updateSingleProductBukalapak } from '@/api/thirdParty/bukalapak'

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
      showUpdateStock: false,
      loadingUpdateStock: false
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
  },

  methods: {
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
        // product_id: [this.formEdit.id]
        product_id: [this.formEdit.product_id]
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
        // product_id: this.formEdit.product_id,
        product_id: this.formEdit.id,
        sku_id: this.formEdit.sku_id,
        type: this.formEdit.type,
        stock: this.formEdit.olsera_product.stock
      }
      updateSingleProductBukalapak(data).then(response => {
        this.$message({
          type: 'success',
          message: response.data.message
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