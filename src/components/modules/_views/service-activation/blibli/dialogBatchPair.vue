<template>
  <dialog-global
    :show="show"
    :title="rootLang.pair_product"
    :show-footer="false"
    custom-class="without-padding mw-1020"
    @close="handleClose">
    <template #top-buttons>
      <el-button type="info" @click="handleClose(false)">{{ lang.cancel }}</el-button>
      <el-button
        :loading="loadingSavePair"
        type="primary"
        @click="handleSavePair">
        {{ rootLang.pair }}
      </el-button>
    </template>

    <fixed-table
      :data="dataProduct"
      :headers="['', 'Produk BliBli', 'Stok', 'Produk Olsera', 'Stok']"
      :cols="['check', 'name', 'stock', 'recomendation', 'stock-olsera']"
      :loading="loadingBulk"
      :style-headers="styleHeaders">
      <template #header-0>
        <el-checkbox v-model="checkAll" :true-label="1" :false-label="0" @change="handleCheckAll" />
      </template>
      <template #check="scope">
        <el-checkbox v-model="scope.row.checked" :true-label="1" :false-label="0" />
      </template>
      <template #name="scope">
        <div class="flex-container">
          <div class="mr-8">
            <el-avatar :src="scope.row.pictures" />
          </div>
          <div>{{ scope.row.name }}</div>
        </div>
      </template>
      <template #recomendation="scope">
        <div
          v-if="scope.row.recomendation && !scope.row.recomendation.length">
          <el-button @click="handlePair(scope.row)">
            Pilih produk olsera
          </el-button>
        </div>
        <div v-else>
          <div
            v-if="scope.row.recomendation.length"
            class="flex-container pointer"
            @click="handlePair(scope.row)">
            <div class="mr-8">
              <el-avatar :src="scope.row.recomendation[0].photo_md" />
            </div>
            <div>{{ scope.row.recomendation[0].name }}</div>
          </div>
        </div>
      </template>
      <template #stock-olsera="scope">
        <div v-if="scope.row.recomendation.length">
          {{ scope.row.recomendation[0].qty }}
        </div>
      </template>
    </fixed-table>

    <offscreen-sync-product
      :show="visibleSynProduct"
      :form-edit="tempDataSync"
      :from-bulk="true"
      no-api-save
      @setproduct="handleSetProduct"
      @close="visibleSynProduct = false"
    />
  </dialog-global>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import offscreenSyncProduct from './offscreenSyncProduct'
import DialogGlobal from '@/components/DialogGlobal'
import FixedTable from '@/components/FixedTable'
import { pairBulkProduct, getBulkProducts } from '@/api/thirdParty/blibli'

export default {
  name: 'DialogBatchPair',

  props: {
    show: {
      type: Boolean,
      default: false
    }
  },

  components: {
    offscreenSyncProduct,
    DialogGlobal,
    FixedTable
  },

  mixins: [basicComputedMixin],

  data () {
    return {
      checkAll: false,
      visibleSynProduct: false,
      tempDataSync: {},
      loadingSavePair: false,
      dataProduct: [],
      loadingBulk: false,
      meta: {
        per_page: 15
      },
      styleHeaders: {
        Stok: {
          textAlign: 'center'
        }
      }
    }
  },

  computed: {
    dataChecked() {
      const products = []
      this.dataProduct.map(item => {
        if (item.checked && item.recomendation && item.recomendation.length) {
          products.push({
            "id": item.product_id,
            "type": item.type,
            "product_id_olsera": item.recomendation[0].id,
            "source_product": item.recomendation[0].type
          })
        }
      })
      return products
    }
  },

  watch: {
    show: {
      immediate: true,
      handler(payload) {
        if (payload) {
          this.getBulkProducts()
        }
      }
    }
  },

  methods: {
    getBulkProducts() {
      this.loadingBulk = true
      getBulkProducts({
        per_page: this.meta.per_page
      }).then(response => {
        this.dataProduct = []
        response.data.data.map(item => {
          this.$set(item, 'checked', 0)
          this.dataProduct.push(item)
        })
        this.loadingBulk = false
      }).catch(error => {
        this.dataProduct = []
        this.loadingBulk = false
      })
    },
    handleCheckAll (arg) {
      this.dataProduct = this.dataProduct.map(item => {
        item.checked = arg
        return item
      })
    },
    handlePair (item) {
      this.tempDataSync = { ...item}
      this.visibleSynProduct = true
    },
    handleSetProduct (data) {
      this.dataProduct.map(product => {
        if (product.product_id === this.tempDataSync.product_id) {
          product.recomendation = []
          product.recomendation.push({ ...data })
        }
      })
    },
    handleSavePair () {
      this.loadingSavePair = true
      pairBulkProduct(this.dataChecked).then(response => {
        this.$message({
          type: 'success',
          message: response.data.data.message
        })
        this.handleClose(true)
        this.loadingSavePair = false
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingSavePair = false
      })
    },
    handleClose (save) {
      this.tempDataSync = {}
      save ? this.$emit('save') : this.$emit('close')
    },
    handleChangePage (page) {
      this.$emit('changepage', page)
    },
    handleChangeSizePage (page) {
      this.meta.page_size = page
      this.$emit('changepagesize', page)
    }
  }
}
</script>
