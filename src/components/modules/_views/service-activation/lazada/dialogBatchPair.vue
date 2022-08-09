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
      <!-- <div class="like-table-wrapper mt-16 border border--table-border">
        <div class="like-table-wrapper--item">
          <div class="mr-8 full-width flex-container" >
            <div class="mr-8">
              <el-checkbox v-model="checkAll" @change="handleCheckAll"></el-checkbox>
            </div>
            <div class="font-bold font-14">
              Product Shopee
            </div>
          </div>
          <div class="font-bold font-14" style="width: 30%">
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
      <perfect-scrollbar class="scrollBulkPair">
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
                {{ item.name.indexOf(' ') === -1 && item.name.length > 40 ? item.name.slice(0, 40) + ' ...' : item.name }}
              </div>
            </div>
            <div class="font-14 px-12" style="width: 30%">
              {{ item.stock }}
            </div>
          </div>
          <div class="flex-container full-width px-12 py-8 radius-50 border border--primary" style="max-width: 415px" :style="bgOlseradiv[idx]" @mouseover="setBg(idx)" @mouseleave="setBg1(idx)">
            <div class="font-14 full-width" >
              <div v-if="item.recommendation === null" class="pointer" @click="handlePair(item)">{{ rootLang.select }} Product Olsera</div>
              <div v-else-if="item.recommendation !== null" class="flex-container" @click="handlePair(item)">
                <div class="flex-container">
                  <el-avatar
                    :src="item.recommendation.photo_md"
                    :size="32"
                    shape="square"
                  />
                  <div class="color-white--bg container-watermark-olsera">
                    <svg-icon icon-class="freemium_icon"/>
                  </div>
                </div>
                <div class="overflow-ellipsis font-bold font-14 ml-8 word-break">
                  {{ item.recommendation.name }}
                  <div id="stock" class="font-8">
                    OTOMATIS
                  </div>
                </div>
                <div id="stock" class="font-14 text-right" style="width: 20%">
                  {{ item.recommendation.stock_qty }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </perfect-scrollbar> -->
      <!-- <perfect-scrollbar class="scrollBulkPair"> -->
        <div class="table-handler-flex full-width text-right px-8" >
          <el-input class="input-search" clearable :placeholder="lang.search" prefix-icon="el-icon-search" v-model="search" @change="handleSearch" @keyup.native.enter="handleSearchByEnter" size="small"></el-input>
        </div>
        <el-table
            v-loading="loadingBulk"
            :data="dataProd"
            stripe
            height="calc(80vh - 144px)"
            border>
          <el-table-column width="50px">
            <template slot="header" slot-scope="scope">
              <div class="mr-8">
                <el-checkbox v-model="checkAll" @change="handleCheckAll"></el-checkbox>
              </div>
            </template>
            <template slot-scope="scope">
              <div class="mr-8"><el-checkbox v-model="scope.row.checked" @change="handleCheck(scope.row)"></el-checkbox></div>
            </template>
          </el-table-column>
          <el-table-column label="Product Lazada">
            <template slot-scope="scope">
              <div class="flex-container full-width">
                <div class="flex-container">
                  <el-avatar
                    :src="scope.row.pictures"
                    :size="32"
                    shape="square"
                  />
                  <div class="color-white--bg container-watermark-olsera">
                    <el-avatar
                      src="/static/img/lazada.png"
                      class="mr-4"
                      :size="20"
                    />
                  </div>
                </div>
                <div class="font-bold font-14 ml-8 word-break">
                  {{ scope.row.name.indexOf(' ') === -1 && scope.row.name.length > 40 ? scope.row.name.slice(0, 40) + ' ...' : scope.row.name }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Stock" width="100px">
            <template slot-scope="scope">
              <div class="font-14 text-right">
                {{ scope.row.stock }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Product Olsera">
            <template slot-scope="scope">
              <div class="flex-container full-width px-12 py-8 radius-50 border border--primary" style="max-width: 415px" >
                <div class="font-14 full-width" >
                  <div v-if="scope.row.recommendation === null" class="pointer" @click="handlePair(scope.row)">{{ rootLang.select }} Product Olsera</div>
                  <div v-else-if="scope.row.recommendation !== null" class="flex-container full-width" @click="handlePair(scope.row)">
                    <div class="flex-container">
                      <el-avatar
                        :src="scope.row.recommendation.photo_md"
                        :size="32"
                        shape="square"
                      />
                      <div class="color-white--bg container-watermark-olsera">
                        <svg-icon icon-class="freemium_icon"/>
                      </div>
                    </div>
                    <div class="overflow-ellipsis full-width font-bold font-14 ml-8 word-break">
                      {{ scope.row.recommendation.name }}
                      <div id="stock" class="font-8">
                        OTOMATIS
                      </div>
                    </div>
                    <div id="stock" class="font-14 text-right" style="width: 20%">
                      {{ scope.row.recommendation.stock_qty }}
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column label="Stock">
            <template slot-scope="scope"></template>
          </el-table-column> -->
        </el-table>
      <!-- </perfect-scrollbar> -->
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
import { pairBulkProduct } from '@/api/thirdParty/lazada'
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
      search: ''
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
              if (j.recommendation) {
                i.recommendation = j.recommendation
              }
              if (j.pair) {
                i.pair = j.pair
              }
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
      if (item.recommendation === null && item.pair === null) {
        this.$notify({
          type: 'warning',
          // title: error.response.data.error.message,
          message: this.rootLang.please_select_product_olsera
        })
      } else {
        const exist = this.dataChecked.some(({product_id}) => product_id === item.product_id)
        console.log('ex', exist)
        if (exist) {
          this.dataChecked.map((i, idx) => {
            if (i.product_id === item.product_id) {
              this.dataChecked.splice(idx, 1)
            }
          })
        } else {
          if (item.recommendation) {
            this.dataChecked.push({
              product_id: item.product_id,
              product_id_olsera: item.recommendation.id,
              source_product: item.recommendation.type,
              type: item.type,
              stock: item.stock,
              recommendation: item.recommendation
            })
          }
          // if (item.pair) {
          //   this.dataChecked.push({
          //     product_id: item.product_id,
          //     product_id_olsera: item.pair.id,
          //     source_product: item.pair.type,
          //     type: item.type,
          //     stock: item.stock
          //   })
          // }
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
          i.recommendation = { ...data}
          i.recommendation.stock_qty = i.recommendation.qty
          this.handleCheck(i)
        }
      })
      this.visibleSynProduct = false
    },

    handleSavePair () {
      this.loadingSavePair = true
      pairBulkProduct(this.dataChecked).then(response => {
        console.log('res', response)
        this.$message({
          type: 'success',
          message: response.data.message
        })
        this.handleClose(true)
        this.loadingSavePair = false
      }).catch(error => {
        console.log('err', error)
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
    },

    handleChangeSizePage (page) {
      this.meta.page_size = page
      this.$emit('changepagesize', page)
    },

    handleSearch (data) {
      // console.log('data', data)
      let params = {
        search_text: '',
        search_column: 'name'
      }
      if (data !== '') {
        this.$set(params, 'search_text', data)
        this.$set(params, 'search_column', 'name')
      } else {
        this.$delete(params, 'search_text')
        this.$delete(params, 'search_column')
      }
      this.$emit('search', params)
    },

    handleSearchByEnter () {
      let params = {
        search_text: '',
        search_column: 'name'
      }
      if (this.search !== '') {
        this.$set(params, 'search_text', this.search)
        this.$set(params, 'search_column', 'name')
      } else {
        this.$delete(params, 'search_text')
        this.$delete(params, 'search_column')
      }
      this.$emit('search', params)
    },
  }
}
</script>