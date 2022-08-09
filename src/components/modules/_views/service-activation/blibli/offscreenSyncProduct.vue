<template>
  <offscreen
    :show="show"
    title="Hubungkan Produk"
    @close="beforeClose">
    <div
      class="pos-sticky color-white--bg"
      style="top: -16px; z-index: 9;">
      <card-info>
        <div class="flex-container flex-grow-1">
          <div class="pos-relative">
            <el-avatar
              :src="formEdit.pictures"
              :size="32"
              shape="square"
            />
            <el-avatar
              :size="20"
              src="/static/img/service-activation/blibli/blibli-icon.png"
              class="mr-4"
              style="position: absolute; left: 18px"
            />
          </div>
          <div class="ml-8">
            <div class="font-bold font-16">
              {{ formEdit.name }}
            </div>
            <div v-if="formEdit.sku !== '' && formEdit.sku !== null" class="font-12">
              {{ formEdit.price }} • {{ formEdit.sku }}
            </div>
            <div v-else class="font-12">
              {{ formEdit.price }}
            </div>
          </div>
        </div>
        <div class="text-right">
          {{ formEdit.stock }} stock
        </div>
      </card-info>

      <div
        class="table-handler-flex full-width text-right">
        <el-input
          v-model="params.search"
          :placeholder="lang.search"
          clearable
          prefix-icon="el-icon-search"
          size="small"
          @keyup.native.enter="handleSearch(false)"
        />
      </div>
    </div>

    <div
      v-loading="loadingSearch"
      class="text-center mb-42">
      <div v-if="dataSearch.length === 0">
        <data-empty
          image="/static/img/service-activation/tokopedia/no_product_search.png"
          flat
        />
      </div>

      <div v-else>
        <div
          v-for="data in dataSearch"
          :key="data.id" 
          :class="selectedProduct && selectedProduct.id === data.id ? 'active' : ''"
          class="like-table-wrapper--item pointer"
          @click="handleSelect(data)">
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

    <template
      #footer>
      <el-button
        :loading="loadingPair"
        type="primary"
        class="btn-block"
        @click="handleSave">
        {{ rootLang.save }}
      </el-button>
    </template>
  </offscreen>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import Offscreen from '@/components/Offscreen'
import CardInfo from '@/components/CardInfo'
import DataEmpty from '@/components/modules/DataEmpty'
import { productOlseraSearch, pairProduct } from '@/api/thirdParty/blibli.js'

export default {
  components: {
    Offscreen,
    CardInfo,
    DataEmpty
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
    },
    keyowrd: {
      type: String,
      default: null
    },
    noApiSave: {
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
      loadingPair: false
    }
  },

  computed: {
    disabledSave () {
      return this.selectedProduct.id ? false : true
    }
  },

  watch: {
    formEdit(formEdit) {
      if (formEdit) {
        this.formData = { ...formEdit }
      }
    },
    'formEdit.name'(payload) {
      if (payload) {
        const xsearch = payload
        this.params.search = xsearch
        this.handleSearch()
      }
    }
  },

  methods: {
    handleSearch() {
      this.loadingSearch = true
      productOlseraSearch({
        search: this.params.search
      }).then(response => {
        this.dataSearch = response.data.data
        this.loadingSearch = false
      }).catch(error => {
        this.dataSearch = []
        this.loadingSearch = false
      })
    },

    getMoreProduct () {
      //
    },

    handleSelect (data) {
      this.selectedProduct = { ...data }
    },

    syncProduct () {
      //
    },

    beforeClose () {
      this.selectedProduct = {}
      this.$emit('close')
    },
    emitSuccess() {
      this.beforeClose()
      this.$emit('success')
    },
    handleSave () {
      if (!this.noApiSave) {
        this.loadingPair = true
        const data = {
          "id": this.formEdit.id,
          "type": this.selectedProduct.type,
          "product_id_olsera": this.selectedProduct.id,
          "source_product": "P"
        }
        pairProduct(data).then(response => {
          this.loadingPair = false
          this.$message({
            type: 'success',
            message: 'Product successfully paired'
          })
          this.emitSuccess()
        }).catch(error => {
          this.$message({
            type: 'error',
            message: error.string
          })
          this.loadingPair = false
        })
      } else {
        this.$emit('setproduct', this.selectedProduct)
        this.beforeClose()
      }
    },

    searchFromMount(data) {
      //
    }
  }
}
</script>
