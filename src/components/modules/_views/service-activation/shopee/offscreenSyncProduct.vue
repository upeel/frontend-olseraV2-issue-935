<template>
  <transition name="el-zoom-in-center">
    <div
      v-if="show"
      class="offscreen-right-sidebar px-null">
      <div class="offscreen-right-sidebar--wrapper">
        <div class="offscreen-right-sidebar--header text-center color-white--bg" style="z-index: 10">
          Hubungkan ke Toko Olsera
          <close-esc :hideEsc="true" @close="handleClose" />
        </div>
        
        <div class="p-24">
          <div class="border border--grey-border radius-10 p-8 flex-container">
            <div class="full-width">
              <div class="flex-container full-width" >
                <div v-if="formEdit.images" style="position: relative">
                  <el-avatar
                    :src="formEdit.images[0]"
                    :size="32"
                    shape="square"
                  />
                  <el-avatar
                    src="/static/img/shopee.png"
                    :size="20"
                    style="position: absolute; right: 0"
                  />
                </div>
                <div>
                  <div class="font-bold font-16 ml-8">
                    {{ formEdit.name }}
                  </div>
                  <div class="font-12 ml-8">
                    Need variant here: {{formEdit.product_id_shopee}}
                  </div>
                  <div class="font-12 ml-8">
                    <template v-if="formEdit.price === undefined || formEdit.price === ''">
                      Need price here •
                    </template>
                    <template v-else>
                      {{ formEdit.price }} •
                    </template>
                    <template v-if="formEdit.sku === '' || formEdit.sku === null || formEdit.sku === undefined">
                      Need sku/code here
                    </template>
                    <template>
                      {{ formEdit.sku }}
                    </template>
                  </div>
                </div>
              </div>
            </div>
            <div class="text-right" style="width: 30%">
              {{ formEdit.stock }} stock
            </div>
          </div>
        </div>

        <div class="table-handler-flex full-width text-right px-24" >
          <el-input 
            class="inline-form input-search full-width" 
            clearable 
            :placeholder="lang.search" 
            prefix-icon="el-icon-search" 
            v-model="params.search" 
            @change="handleSearch()" 
            size="small" 
          />
        </div>
        <div class="p-24 text-center mb-42" v-loading="loadingSearch">
          <div v-if="dataSearch.length === 0">
            <img src="/static/img/service-activation/tokopedia/no_product_search.png" >
            <div class="text-center font-18 mt-12">Produk tidak ditemukan</div>
          </div>
          <div v-else>
            <div id="here" v-for="data in dataSearch" :key="data.id" 
            :class="selectedProduct && selectedProduct.id === data.id ? 'active' : ''"
            class="like-table-wrapper--item pointer flex-container" @click="handleSelect(data)">
              <div class="full-width text-left">
                <div class="flex-container full-width" >
                  <el-avatar
                    :src="data.photo_md"
                    :size="32"
                    shape="square"
                  />
                  <div class="container-icon" style="position:absolute; align-items: unset !important; left: 50px">
                    <svg-icon icon-class="freemium_icon"/>
                  </div>
                  <div>
                    <div class="font-bold font-16 ml-8">
                      {{ data.name }}
                    </div>
                    <div v-if="data.sku !== null && data.sku !== ''" class="font-12 ml-8">
                      {{ data.fsell_price }} • {{ data.sku }}
                    </div>
                    <div v-else class="font-12 ml-8">
                      {{ data.fsell_price }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="selectedProduct && selectedProduct.id === data.id" class="container-icon">
                <svg-icon icon-class="awesome-check-circle" />
              </div>
              <div v-else class="text-right" style="width: 40%">
                {{ data.qty }} stock
              </div>
            </div>
            <el-button
              v-if="last_page > current_page"
              class="btn-block"
              @click="getMoreProduct">
              {{ rootLang.load_more }}
            </el-button>
          </div>
        </div>

        <div class="offscreen-right-sidebar--footer">
          <el-button
            v-if="fromBulk"
            :loading="loadingPair"
            :disabled="disabledSave"
            type="success"
            class="btn-block"
            @click="handleSave">
            {{ rootLang.save }}
          </el-button>
          <el-button
            v-else
            :loading="loadingPair"
            :disabled="disabledSave"
            type="shopee"
            class="btn-block"
            @click="syncProduct">
            Hubungkan
          </el-button>
        </div>
      </div>

    </div>
  </transition>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import CloseEsc from '@/components/modules/CloseEsc'

import { searchProductShopee, pairProductShopee, searchProduct } from '@/api/thirdParty/shopee'

export default {
  components: {
    CloseEsc,
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
    fromBulk: {
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
      loadingPair: false,
      imgSearch: '/static/img/service-activation/tokopedia/no_product_search1.png'
    }
  },

  watch: {
    show: function(value) {
      if (value) {
        this.params.search = this.formEdit.name
        this.loadingSearch = true
        this.selectedProduct = {}
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
        this.params.search = ''
        this.selectedProduct = {}
        this.dataSearch = []
        this.loadingSearch = false
      }
    }
  },

  computed: {
    disabledSave () {
      return this.selectedProduct.id ? false : true
    }
  },

  methods: {
    handleSearch() {
      this.loadingSearch = true
      this.selectedProduct = {}
      if (this.params.search !== '') {
        searchProductShopee(this.params).then(response => {
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
      if (data.id === this.selectedProduct.id) {
        this.selectedProduct = {}
        return
      }
      this.selectedProduct = { ...data}
    },

    syncProduct () {
      let data = {
        product_id: this.formEdit.product_id ? this.formEdit.product_id : this.formEdit.product_id_shopee,
        type: this.formEdit.type,
        product_id_olsera: this.selectedProduct.id,
        source_product: this.selectedProduct.type,
        stock: this.formEdit.stock
      }
      if (this.shopeeActiveStore !== null) {
        data.shopee_shop_id = this.shopeeActiveStore.shopee_shop_id
      }
      this.loadingPair = true
      pairProductShopee(data).then(response => {
        this.$message({
          type: 'success',
          message: response.data.data.message
        })
        this.handleClose()
        this.loadingPair = false
        this.$emit('pair')
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingPair = false
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
      this.$emit('setproduct', this.selectedProduct)
      this.dataSearch = []
      this.params.search = ''
      this.selectedProduct = {}
    },

    getMoreProduct () {
      this.loadingSearch = true
      this.params.page = this.current_page + 1
      searchProduct(this.params).then(response => {
        response.data.data.map(i => {
          this.dataSearch.push(i)
        })
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
    },

    // this searchFromMount function is maybe not necessary, i don't delete this so other components that used this component don't collapse (ex: manage.vue)
    // maybe manage.vue can still be simplified because to handle searchFromMount already done by watcher -> show
    // or maybe this component is not done yet by the time i edited it or per commit date. 
    // note by: albab
    // searchFromMount(data) {
    //   this.params.search = data.name
    //   this.handleSearch(true)
    // }
  }
}
</script>
