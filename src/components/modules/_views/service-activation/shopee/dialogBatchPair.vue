<template>
  <el-dialog
    :visible.sync="show"
    :before-close="handleClose"
    :show-close="false"
    append-to-body
    custom-class="without-padding mw-1020">
    <div slot="title" class="flex-container">
      <h4 class="dialog-title full-width">
        {{ rootLang.pair_product }}
      </h4>
      <div class="btn_save_dialog full-width text-right">
        <el-button type="info" @click="handleClose">{{ lang.cancel }}</el-button>
        <el-button :loading="loadingSavePair" type="success" @click="handleSavePair" >{{ rootLang.pair }}</el-button>
      </div>
    </div>
    <div v-if="dataProduct.length === 0" class="no-data-wrapper border border--grey p-32 align-center mt-16" style="display: flex; flex-direction: column;">
      <img src="/static/img/service-activation/shopee/no-product-shopee.png" class="no-data-image">
      <div class="text-center word-break" style="width: 360px" >Sip! Semua produk di Shopee telah dihubungkan dengan produk di toko Olseramu</div>
    </div>
    <template v-else>
      <div class="like-table-wrapper mt-16 border border--table-border">
        <div class="like-table-wrapper--item">
          <div class="mr-8 full-width flex-container" style="min-width: 428px">
            <div class="mr-8">
              <el-checkbox v-model="checkAll" @change="handleCheckAll"></el-checkbox>
            </div>
            <div class="font-bold font-14">
              Product Shopee
            </div>
          </div>
          <div class="font-bold font-14" style="width: 30%; min-width: 134px">
            Stock
          </div>
          <div class="font-bold font-14 full-width" >
            Product Olsera
          </div>
          <div class="font-bold font-14" style="width: 30%">
            Stock
          </div>
        </div>
      </div>
      <!-- <el-table
        v-loading="loading"
        :data="dataProductHeader"
        stripe
        border
        class="sales-table-max-height mobile-fix-height-unset">
        <el-table-column label="Product Lazada" >
          <template slot="header" >
            <div class="mr-8 full-width flex-container" >
              <div class="mr-8">
                <el-checkbox v-model="checkAll" @change="handleCheckAll"></el-checkbox>
              </div>
              <div class="font-bold font-14">
                Product Shopee
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Stock" width="100" align="center">
        </el-table-column>
        <el-table-column label="Product Olsera" >
          <template slot="header" >
            <div class="mr-8 full-width flex-container" >
              <div class="font-bold font-14 full-width">
                Product Olsera
              </div>
              <div style="width: 20%">
                Stock
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table> -->
      <perfect-scrollbar class="scrollBulkPair">
        <!-- <el-table
          v-loading="loadingBulk"
          :data="dataProd"
          :show-header="false"
          stripe
          border
          class="sales-table-max-height mobile-fix-height-unset">
          <el-table-column label="Product Lazada" >
            <template slot="header" >
              <div class="mr-8 full-width flex-container" >
                <div class="mr-8">
                  <el-checkbox v-model="checkAll" @change="handleCheckAll"></el-checkbox>
                </div>
                <div class="font-bold font-14">
                  Product Shopee
                </div>
              </div>
            </template>
            <template slot-scope="scope">
              <div class="flex-container full-width">
                <div class="mr-8 flex-container full-width" @click="handleCheck(scope.row)">
                  <div class="mr-8"><el-checkbox v-model="scope.row.checked" @change="handleCheck(scope.row)"></el-checkbox></div>
                  <div class="flex-container">
                    <el-avatar
                      :src="scope.row.pictures"
                      :size="32"
                      shape="square"
                    />
                    <div class="color-white--bg container-watermark-olsera">
                      <el-avatar
                        src="/static/img/shopee.png"
                        class="mr-4"
                        :size="20"
                      />
                    </div>
                  </div>
                  <div class="font-bold font-14 ml-8 word-break">
                    {{ scope.row.name }}
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Stock" width="100" align="center">
            <template slot-scope="scope">
              <div class="font-14 px-12" style="width: 30%">
                  {{ scope.row.stock }}
                </div>
            </template>
          </el-table-column>
          <el-table-column label="Product Olsera" >
            <template slot-scope="scope">
              <div class="flex-container full-width px-12 py-8 radius-50 border border--primary" style="max-width: 415px" :style="bgOlseradiv[idx]" @mouseover="setBg(idx)" @mouseleave="setBg1(idx)">
                <div class="font-14 full-width" >
                  <div v-if="scope.row.recomendation === null && scope.row.pair === null" class="pointer" @click="handlePair(scope.row)">{{ rootLang.select }} Product Olsera</div>
                  <div v-else-if="scope.row.recomendation !== null && scope.row.pair === null" class="flex-container" @click="handlePair(scope.row)">
                    <div class="flex-container">
                      <el-avatar
                        :src="scope.row.recomendation.pictures"
                        :size="32"
                        shape="square"
                      />
                      <div class="color-white--bg container-watermark-olsera">
                        <svg-icon icon-class="freemium_icon"/>
                      </div>
                    </div>
                    <div class="overflow-ellipsis font-bold full-width font-14 ml-8 word-break">
                      {{ scope.row.recomendation.name }}
                      <div id="stock" class="font-8">
                        OTOMATIS
                      </div>
                    </div>
                    <div id="stock" class="font-14 text-right" style="width: 20%">
                      {{ scope.row.recomendation.stock_qty }}
                    </div>
                  </div>
                  <div v-else-if="scope.row.pair !== null" class="flex-container" @click="handlePair(scope.row)">
                    <div class="flex-container">
                      <el-avatar
                        :src="scope.row.pair.photo_md"
                        :size="32"
                        shape="square"
                      />
                      <div class="color-white--bg container-watermark-olsera">
                        <svg-icon icon-class="freemium_icon"/>
                      </div>
                    </div>
                    <div class="overflow-ellipsis full-width font-bold font-14 ml-8 word-break">
                      {{ scope.row.pair.name }}
                    </div>
                    <div id="stock" class="font-14 text-right" style="width: 20%">
                      {{ scope.row.pair.qty }}
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table> -->
      <div v-loading="loadingBulk" class="like-table-wrapper border border--table-border" >
        <div v-for="(item, idx) in dataProd" 
          :key="item.id" class="like-table-wrapper--item pointer">
          <div class="flex-container full-width">
            <div class="mr-8 flex-container full-width" @click="handleCheck(item)">
              <div class="mr-8"><el-checkbox v-model="item.checked" @change="handleCheck(item)"></el-checkbox></div>
              <div class="flex-container">
                <el-avatar
                  :src="item.pictures"
                  :size="32"
                  shape="square"
                />
                <div class="color-white--bg container-watermark-olsera">
                  <el-avatar
                    src="/static/img/shopee.png"
                    class="mr-4"
                    :size="20"
                  />
                </div>
              </div>
              <div class="font-bold font-14 ml-8 word-break">
                {{ item.name }}
              </div>
            </div>
            <div class="font-14 px-12" style="width: 30%">
              {{ item.stock }}
            </div>
          </div>
          <div class="flex-container full-width px-12 py-8 radius-50 border border--primary" style="max-width: 415px" :style="bgOlseradiv[idx]" @mouseover="setBg(idx)" @mouseleave="setBg1(idx)">
            <div class="font-14 full-width" >
              <div v-if="Object.keys(item.recomendation).length === 0 && item.pair === null" class="pointer" @click="handlePair(item)">{{ rootLang.select }} Product Olsera</div>
              <div v-else-if="Object.keys(item.recomendation).length !== 0 && item.pair === null" class="flex-container" @click="handlePair(item)">
                <div class="flex-container">
                  <el-avatar
                    :src="item.recomendation.pictures"
                    :size="32"
                    shape="square"
                  />
                  <div class="color-white--bg container-watermark-olsera">
                    <svg-icon icon-class="freemium_icon"/>
                  </div>
                </div>
                <div class="overflow-ellipsis full-width font-bold font-14 ml-8 word-break">
                  {{ item.recomendation.name }}
                  <div id="stock" class="font-8">
                    OTOMATIS
                  </div>
                </div>
                <div id="stock" class="font-14 text-right" style="width: 20%">
                  {{ item.recomendation.stock_qty }}
                </div>
              </div>
              <div v-else-if="item.pair !== null" class="flex-container" >
                <div class="flex-container">
                  <el-avatar
                    :src="item.pair.photo_md"
                    :size="32"
                    shape="square"
                  />
                  <div class="color-white--bg container-watermark-olsera">
                    <svg-icon icon-class="freemium_icon"/>
                  </div>
                </div>
                <div class="overflow-ellipsis full-width font-bold font-14 ml-8 word-break">
                  {{ item.pair.name }}
                </div>
                <div id="stock" class="font-14 text-right" style="width: 20%">
                  {{ item.pair.qty }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </perfect-scrollbar>
      <div v-if="meta.totalProduct > 0" class="border border--grey-border table-handler-bottom text-center">
        <el-pagination
          :total="meta.totalProduct"
          :page-sizes="[15, 50, 100]"
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

    <offscreen-sync-product
      :show="visibleSynProduct"
      :form-edit="tempDataSync"
      :from-bulk="true"
      @setproduct="handleSetProduct"
      @cancel="visibleSynProduct = false"
    />
    
  </el-dialog>
</template>
<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import offscreenSyncProduct from './offscreenSyncProduct'
import { pairBulkProduct } from '@/api/thirdParty/shopee'
export default {
  name: 'DialogBatchPair',

  components: {
    offscreenSyncProduct
  },

  mixins: [basicComputedMixin],

  props: {
    show: {
      type: Boolean,
      default: false
    },
    dataProduct: {
      type: Array,
      default: []
    },
    meta: {
      type: Object,
      default: {}
    },
    loadingBulk: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      dataChecked: [],
      checkAll: false,
      visibleSynProduct: false,
      tempDataSync: {},
      loadingSavePair: false,
      dataProductHeader: {}
    }
  },

  computed: {
    dataProd () {
      return this.dataProduct.map(i => {
        i.checked = false
        if (this.dataChecked.length > 0) {
          this.dataChecked.map(j => {
            if (i.product_id === j.product_id) {
              i.checked = true
            }
          })
        }
        return i
      })
    },

    bgOlseradiv () {
      let bg = []
      this.dataProduct.map(i => {
        bg.push('background-color: #FFFFFF')
      })
      return bg
    }
  },

  methods: {
    handleCheck (item) {
      console.log('aaa', item)
      if (item.recomendation === null && item.pair === null) {
        this.$notify({
          type: 'warning',
          // title: error.response.data.error.message,
          message: this.rootLang.please_select_product_olsera
        })
      } else {
        const exist = this.dataChecked.some(({product_id}) => product_id === item.product_id)
        if (exist) {
          this.dataChecked.map((i, idx) => {
            if (i.product_id === item.product_id) {
              this.dataChecked.splice(idx, 1)
            }
          })
        } else {
          if (item.recomendation) {
            this.dataChecked.push({
              product_id: item.product_id,
              product_id_olsera: item.recomendation.id,
              source_product: item.recomendation.type,
              type: item.type,
              stock: item.stock
            })
          }
          if (item.pair) {
            this.dataChecked.push({
              product_id: item.product_id,
              product_id_olsera: item.pair.id,
              source_product: item.pair.type,
              type: item.type,
              stock: item.stock
            })
          }
        }
      }
    },

    handleCheckAll (arg) {
      if (arg) {
        this.dataChecked = []
        this.dataProd.map(i => {
          if (i.recomendation) {
            this.dataChecked.push({
              product_id: i.product_id,
              product_id_olsera: i.recomendation.id,
              source_product: i.recomendation.type,
              type: i.type,
              stock: i.stock
            })
          } else if (i.pair) {
            this.dataChecked.push({
              product_id: i.product_id,
              product_id_olsera: i.pair.id,
              source_product: i.pair.type,
              type: i.type,
              stock: i.stock
            })
          }
        })
        if (this.dataChecked.length === 0) {
          this.$notify({
            type: 'warning',
            message: this.rootLang.please_select_product_olsera
          })
          this.checkAll = !this.checkAll
        }
      } else {
        this.dataChecked = []
      }
    },

    setBg (idx) {
      this.bgOlseradiv[idx] = 'background-color: #0085CD'
      console.log('aaa', this.bgOlseradiv[idx])
    },

    setBg1 (idx) {
      this.bgOlseradiv[idx] = 'background-color: #FFFFFF'
      console.log('aaa', this.bgOlseradiv[idx])
    },

    handlePair (item) {
      this.tempDataSync = { ...item}
      this.visibleSynProduct = true
    },

    handleSetProduct (data) {
      console.log('data', data)
      this.dataProduct.map(i => {
        if (i.product_id === this.tempDataSync.product_id) {
          i.pair = { ...data}
          this.handleCheck(i)
        }
      })
      this.visibleSynProduct = false
    },

    handleSavePair () {
      this.loadingSavePair = true
      let dataCek = []
      this.dataChecked.map(i => {
        if (i.product_id_olsera) {
          dataCek.push(i)
        }
      })
      let data = {
        shopee_shop_id: this.shopeeActiveStore !== null ? this.shopeeActiveStore.shopee_shop_id : 0,
        data: dataCek
      }
      pairBulkProduct(data).then(response => {
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
      this.dataChecked = []
      this.tempDataSync = {}
      save ? this.$emit('save') : this.$emit('close')
    },

    handleChangePage (page) {
      this.$emit('changepage', page)
      let datacek = this.dataChecked
    },

    handleChangeSizePage (page) {
      this.meta.page_size = page
      this.$emit('changepagesize', page)
    }
  }
}
</script>