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
            <div class="text-right" style="width: 30%">
              {{ formEdit.stock }} stock
            </div>
          </div>
        </div>

        <div class="table-handler-flex full-width text-right px-24" >
          <el-input class="inline-form input-search full-width" clearable :placeholder="lang.search" prefix-icon="el-icon-search" v-model="params.search" @change="handleSearch(false)" size="small"></el-input>
        </div>

        <div class="p-24 text-center mb-42" v-loading="loadingSearch">
          <div v-if="dataSearch.length === 0">
            <img :src="imgSearch" >
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
              class="btn-block mt-24"
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
            class="btn-block mt-24"
            @click="handleSave">
            {{ rootLang.save }}
          </el-button>
          
          <el-button
            v-else
            :loading="loadingPair"
            :disabled="disabledSave"
            type="success"
            class="btn-block mt-24"
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

import { searchProduct, pairProductTokopedia } from '@/api/thirdParty/tokopedia'

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
        // search_column: 'name',
        per_page: 50
      },
      dataSearch: [],
      current_page: 0,
      last_page: 0,
      loadingSearch: false,
      selectedProduct: {},
      loadingPair: false,
      imgSearch: '/static/img/service-activation/tokopedia/no_product_search.png'
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
    disabledSave () {
      return this.selectedProduct.id ? false : true
    }
  },

  mounted () {
    // if (this.formEdit.addon_items.length) {
    //   this.getCheckedAddon()
    // }
  },

  methods: {
    handleSearch (firstTime) {
      this.loadingSearch = true
      this.selectedProduct = {}
      if (this.params.search !== '') {
        searchProduct(this.params).then(response => {
          this.dataSearch = [ ...response.data.data]
          this.dataSearch.map((i, idx) => {
              i.select = false
          })
          this.current_page = response.data.meta.current_page
          this.last_page = response.data.meta.last_page
          this.loadingSearch = false
          if (firstTime) { 
            this.dataSearch[0].select = true
            this.selectedProduct = { ...this.dataSearch[0]}
          }
        }).catch(error => {
          this.$message({
            type: 'error',
            message: error.string
          })
          this.dataSearch = []
          this.imgSearch = '/static/img/service-activation/tokopedia/no_product_search1.png'
          this.loadingSearch = false
        })
      } else {
        this.dataSearch = []
        this.imgSearch = '/static/img/service-activation/tokopedia/no_product_search.png'
        this.loadingSearch = false
      }
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
        this.imgSearch = '/static/img/service-activation/tokopedia/no_product_search1.png'
        this.loadingSearch = false
      })
    },

    handleSelect (data) {
      // console.log('data', data)
      this.selectedProduct = { ...data}
    },

    syncProduct () {
      let data = {
        product_id_tokopedia: this.formEdit.product_id ? this.formEdit.product_id : this.formEdit.product_id_tokopedia,
        type: this.formEdit.type,
        product_id_olsera: this.selectedProduct.id,
        source_product: this.selectedProduct.type,
        stock: this.formEdit.stock
      }

      if (this.tokopediaActiveStore !== null) {
        data.merchant_tokopedia_id = this.tokopediaActiveStore.id
      }

      this.loadingPair = true
      pairProductTokopedia(data).then(response => {
        this.$message({
          type: 'success',
          message: response.data.data.message
        })
        this.handleClose()
        this.$emit('pair')
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

    searchFromMount(data) {
      this.params.search = data.name
      this.handleSearch(true)
    }
  }
}
</script>
