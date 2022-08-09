<template>
  <transition name="el-zoom-in-center">
    <div
      v-if="show"
      class="offscreen-right-sidebar px-null">
      <div class="offscreen-right-sidebar--wrapper">
        <div class="offscreen-right-sidebar--header text-left color-white--bg" style="z-index: 10">
          Duplikat produk ke Tokopedia
          <close-esc :hideEsc="true" @close="handleClose" />
        </div>

        <div class="table-handler-flex full-width text-right px-24" >
          <el-input class="inline-form input-search full-width" clearable :placeholder="lang.search" prefix-icon="el-icon-search" v-model="search" @change="handleSearch" @keyup.native.enter="handleSearchByEnter" size="small"></el-input>
        </div>

        <perfect-scrollbar :options="scrollOption" class="horizontal-scroll">
          <div class="flex-container py-12 px-24" v-loading="loadingData">
              <el-button @click="showGroup('all')"
                type="info-addon" round >
                  Semua
              </el-button>
              <el-button @click="showGroup('not_duplicate')"
                type="info-addon" round >
                  {{ rootLang.cant_duplicate }} ({{ dataSummaries.cannot }})
              </el-button>
              <el-button @click="showGroup('can_duplicate')"
                type="info-addon" round >
                  {{ rootLang.can_duplicate }} ({{ dataSummaries.can }})
              </el-button>
          </div>
        </perfect-scrollbar>

        <div class="px-12 mt-24">
          <div class="color-info--bg p-12 flex-container flex-container--start">
            <div class="container-icon">
              <svg-icon icon-class="information-circle" class="color-grey--icon" />
            </div>
            <div>
              {{ dataSummaries.cannot }} produk tidak dapat diduplikasi ke Tokopedia karena data kurang lengkap. <span class="color-primary pointer" @click="showInfoInvalidProduct = true"> Selengkapnya </span>
            </div>
          </div>
        </div>

        <div class="like-table-wrapper border border--table-border mt-24 " style="margin-bottom: 80px" >
          <div class="flex-container mt-16">
            <div class="full-width px-24 font-bold font-18">{{ rootLang.select }} {{ lang.product }}</div>
            <div class="px-24"><el-checkbox v-model="checkAll" @change="handleCheckAll"></el-checkbox></div>
          </div>
          <div v-for="(item, idx) in dataProd" 
            :key="idx" class="like-table-wrapper--item pointer">
            <div class="flex-container full-width">
              <div class="mr-8 flex-container full-width" @click="handleEdit(item)">
                <div class="flex-container">
                  <el-avatar
                    v-if="item.photo_md !== null"
                    :src="item.photo_md"
                    :size="32"
                    shape="square"
                  />
                  <el-avatar
                    v-else
                    src="/static/img/logo-olsera-icon.png"
                    :size="32"
                    shape="square"
                  />
                  <div class="color-white--bg container-watermark-olsera">
                    <el-avatar
                      src="/static/img/logo-olsera-premium.png"
                      class="mr-4"
                      :size="20"
                    />
                  </div>
                </div>
                <div class="font-bold font-14 ml-8 word-break">
                  <div class="color-primary">{{ item.name }}</div>
                  <!-- <div v-if="!isWarnData(item)" class="font-12">{{ item.lazada_primary_category_name }}</div>
                  <div v-else class="color-danger font-12">Data belum lengkap</div> -->
                  <template v-if="item.has_pre_upload === 0">
                    <div v-if="item.validation.tokopedia_meta.length > 0" class="color-danger font-12">{{ item.validation.tokopedia_meta[0] }}</div>
                    <div v-else class="font-12">{{ item.sell_price }}</div>
                  </template>
                  <template v-else>
                    <!-- <div v-if="item.validation.tokopedia_meta.length > 0" class="color-danger font-12">{{ item.validation.tokopedia_meta[0] }}</div> -->
                    <div v-if="item.valobj.length > 0" class="color-danger font-12">Data belum lengkap</div>
                    <div v-else class="font-12">{{ item.sell_price }}</div>
                  </template>
                </div>
              </div>
              <div v-if="item.track_inventory === 1" class="font-14 px-12 text-right" style="width: 30%">
                {{ parseInt(item.stock_qty) }} Stock
              </div>
              <div v-else class="font-14 px-12 text-right" style="width: 30%">
                Unlimited
              </div>
              <div>
                <div v-if="item.is_completed !== 0" class="mr-8"><el-checkbox v-model="item.checked" @change="handleCheck(item, idx)"></el-checkbox></div>
                <div v-else>
                  <svg-icon icon-class="alert-triangle-yellow" class="mr-8" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- <div class="p-24">
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
                    src="/static/img/lazada.png"
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
        </div> -->

        <!-- <div class="p-24 text-center mb-42" v-loading="loadingSearch">
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
        </div> -->

        <div class="load-more mt-24" v-if="nextPage" v-loading="loadingData" style="margin-bottom: 100px">
          <el-button
            @click="loadMore"
            class="btn-block">
            {{ $lang[langId].load_more }}..
          </el-button>
        </div>

        <div class="offscreen-right-sidebar--footer color-white--bg">
          
          <el-button
            :loading="loadingDuplicate"
            :disabled="disabledSave"
            class="btn-block mt-24 color-lazada--bg color-white"
            @click="saveProductBatch">
            {{rootLang.duplicate_product}}
          </el-button>
        </div>
      </div>

      <duplicate-product-with-variant
        ref="duplwtvariant"
        :show="showDetailItemWithVariant"
        :temp-item="tempItem"
        :data-temp="dataTempProduct"
        @close="handleCloseDuplicatVariant" />

      <el-dialog
        :visible.sync="showDetailItem"
        :show-close="false"
        width="696px"
        append-to-body>
        <div slot="title" class="flex-container">
          <h4 class="dialog-title full-width font-bold font-24">
            Lengkapi Data Produk
          </h4>
          <template>
            <el-button type="info" @click="showDetailItem = false">{{ rootLang.cancel }}</el-button>
            <el-button type="tokopedia" :loading="loadingPreUpload" @click="handleSaveSingleProduct">{{ lang.save }}</el-button>
          </template>
        </div>
        <div>
          <div class="px-12 mb-24">
            <div class="color-info--bg flex-container">
              <div class="container-icon">
                <svg-icon icon-class="information-circle" class="color-grey--icon" />
              </div>
              <div>
                Data produk disini tidak mengubah data produkmu di Olsera
              </div>
            </div>
          </div>
          <div class="flex-container flex-container--start">
            <div class="mr-8" style="width: 30%">
              <div class="font-12">Foto Produk</div>
              <!-- <el-image
                v-if="tempItem.photo_md !== null"
                :src="tempItem.photo_md"
                fit="cover"
                style="width: 100px; height: 100px; margin-right: 8px;"
              /> -->
              <div class="flex-container">
                <el-upload
                  v-loading="loadingUpload"
                  :action="uploadPhotoUrl"
                  :headers="headersReverify"
                  :before-upload="beforeUpload"
                  :show-file-list="false"
                  :on-progress="handleUploadProgress"
                  :on-success="handleUploadSuccess"
                  :on-error="handleUploadError"
                  list-type="document-grabfood"
                  >
                  <template v-if="temptItem && tempItem.photos.length > 0">
                    <el-image
                      :src="tempItem.photo_md" alt=""
                      style="width: 100px; height: 100px; margin-right: 8px;"
                    />
                  </template>
                  <template v-else>
                    <el-image
                      v-if="tempItem.photo_md !== null"
                      :src="tempItem.photo_md" alt=""
                      style="width: 100px; height: 100px; margin-right: 8px;"
                    />
                    <i v-else class="el-icon-camera"></i>
                  </template>
                </el-upload>
              </div>
            </div>
            <div class="full-width">
              <div class="font-12">{{ lang.product_name }}</div>
              <el-input v-model="tempItem.name" />

              <div class="font-12 mt-12">{{ lang.price }}</div>
              <input-money v-model="tempItem.sell_price" />
              <div class="font-11 mt-12 color-info">Harga diambil dari harga Jual Online Produk</div>

              <div class="font-12 mt-12">{{ lang.min_order }}</div>
              <el-input v-model="tempItem.min_order" type="number" />
            </div>
          </div>
          <div class="flex-container mt-12">
            <div class="full-width pr-4">
              <div class="font-12">{{ lang.sku }} (Stock Keeping Unit)</div>
              <el-input v-model="tempItem.sku">
                <!-- <template slot="append" ><el-button type="text" @click="getRandom"><svg-icon icon-class="refresh-ico" class="color-info pointer"  /></el-button></template> -->
              </el-input>
            </div>
            <div class="full-width pl-4">
              <div class="font-12">{{ lang.stock_qty }}</div>
              <el-input v-model="tempItem.stock_qty" type="number" />
            </div>
          </div>
          <div class="flex-container mt-8">
            <div class="full-width pr-4">
              <div class="font-12">{{ lang.weight }}</div>
              <el-input v-model="tempItem.weight" />
            </div>
            <div class="pl-4">
              <div class="font-12">Panjang (cm)</div>
              <el-input v-model="tempItem.length_dimension" />
            </div>
            <div class="">
              <div class="font-12">Lebar (cm)</div>
              <el-input v-model="tempItem.width_dimension" />
            </div>
            <div class="">
              <div class="font-12">Tinggi (cm)</div>
              <el-input v-model="tempItem.high_dimension" />
            </div>
          </div>

          <!-- <div class="mt-12">
            <div class="font-12">{{ lang.description }}</div>
            <el-input type="textarea" autosize v-model="tempItem.description" />
          </div> -->

          <div class="flex-container">
            <div class="mt-24 full-width pr-8">
              <div class="font-12">Kategory Olsera</div>
              <el-input v-model="tempItem.category_name" :disabled="true" />
            </div>
            <div v-loading="loadingCheckBrand" class="mt-24 full-width pl-8">
              <div class="font-12">Kategory Tokopedia</div>
              <el-autocomplete
                v-model="tempItem.tokopedia_meta.category_name"
                :fetch-suggestions="getCategorySearch" 
                placeholder="Search Category"
                class="full-width"
                @select="handleSelectCategory" />
            </div>
          </div>

          <div v-if="isHideMerk" class="flex-container">
            <div class="mt-24 full-width pr-8">
              <div class="font-12">Merk Olsera</div>
              <el-input v-model="tempItem.brand_name" :disabled="true" />
            </div>
            <div class="mt-24 full-width pl-8">
              <div class="font-12">Merk Tokopedia</div>
              <el-autocomplete
                v-model="tempItem.tokopedia_meta.brand_name"
                :fetch-suggestions="getBrandSearch" 
                placeholder="Search Brand"
                class="full-width"
                @select="handleSelectBrand" />
            </div>
          </div>

          <!-- <template v-if="tempItem.formRequired">
            <div v-for="(item, idx) in tempItem.formRequired" :key="idx" class="mt-24">
              <template v-if="item.input_type !== 'singleSelect'">
                <div class="font-12 mt-16">{{ item.label }}</div>
                <el-input :type="item.input_type" v-model="tempItem.formRequired[idx].value" @input="handleChangeInput"></el-input>
              </template>
              <template v-else-if="item.input_type === 'singleSelect'">
                <div class="font-12 mt-16">{{ item.label }}</div>
                <el-autocomplete
                  v-model="tempItem.formRequired[idx].value_name"
                  :fetch-suggestions="getBrandLazada" 
                  placeholder="Search Brand"
                  class="full-width"
                  @select="selectBrandLazada"
                  @input="handleChangeInput" />
              </template>
            </div>
          </template> -->

          <div class="mt-24">
            <el-button class="btn-block" :loading="loadingDuplicate"  plain @click="saveSingleProductBatch"> Duplikat produk ini </el-button>
          </div>
        </div>
      </el-dialog>

      <el-dialog
        :visible.sync="showInfoInvalidProduct"
        :show-close="false"
        width="344px"
        append-to-body>
        <div slot="title" class="text-center">
          <div class="font-bold">Data produk kurang lengkap</div>
          <div class="word-break" style="font-weight: normal">2 produk tidak dapat diduplikasi ke Tokopedia. Produk di Olsera harus memiliki minimal data-data di bawah ini</div>
        </div>
        <div>
          <div class="color-info--bg p-12">
            <ul>
              <li>Foto</li>
              <li>Nama Produk</li>
              <li>Kategory Tokopedia</li>
              <li>Harga Ritel</li>
              <li>Stok</li>
              <li>Berat</li>
            </ul>
          </div>
          <div class="mt-24">
            <el-button class="btn-block" @click="showInfoInvalidProduct = false">Ok</el-button>
          </div>
        </div>
      </el-dialog>
    </div>

  </transition>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import CloseEsc from '@/components/modules/CloseEsc'
import { baseApi, HTTP } from 'src/http-common'

import InputMoney from '@/components/InputMoneyV2'
import DuplicateProductWithVariant from '../tokopedia/duplicatePoductWithVariant'

import { fetchCategoryLazada, 
  fetchRequiredForm, 
  fetchBrandLazada, 
  savePreUpload, 
  saveDuplicateProduct, 
  saveBulkStore } from '@/api/thirdParty/lazada'

import { fetchCategoryTokopedia,
  preUploadProduct,
  updatePreUploadProduct as updatePreUpload,
  duplicateSingleProduct,
  getBrandTokopedia,
  duplicateBulkProduct } from '@/api/thirdParty/tokopedia'

export default {
  name: 'DuplicateProduct',
  mixins: [basicComputedMixin],
  components: {
    CloseEsc,
    InputMoney,
    DuplicateProductWithVariant
  },

  props: {
    show: {
      type: Boolean,
      default: false
    },
    dataProduct: {
      type: Array,
      default: []
    },
    fromBulk: {
      type: Boolean,
      default: false
    },
    loadingData: {
      type: Boolean,
      default: false
    },
    dataSummaries: {
      type: Object,
      default: {}
    },
    nextPage: {
      type: String,
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
      tempItem: {
        Images: [],
        img_upload: null,
        tokopedia_meta: {},
        photos: []
      },
      showDetailItem: false,
      searchCategoryData: [],
      searchBrandData: [],
      showInfoInvalidProduct: false,
      loadingPair: false,
      disabledSave: false,
      loadingPreUpload: false,
      loadingRequired: false,
      loadingDuplicate: false,
      scrollOption: {
        suppressScrollY: true,
        suppressScrollX: false
      },
      checkAll: false,
      dataChecked: [],
      loadingUpload: false,
      isEdit: false,
      search: '',
      showDetailItemWithVariant: false,
      searchBrandData: [],
      isHideMerk: false,
      loadingCheckBrand: false,
      dataTempProduct: {}
    }
  },

  computed: {
    dataProd () {
      return this.dataProduct.map(i => {
        i.checked = false
        if (this.dataChecked.length > 0) {
          this.dataChecked.map(j => {
            if (i.id === j.id) {
              i.checked = true
            }
          })
        }
        return i
      })
    },

    uploadPhotoUrl() {
      return baseApi(this.selectedStore.url_id, this.langId, 'product/upload')
    },

    headersReverify() {
      return {
        'Authorization': 'Bearer ' + this.token.access_token
      }
    },

    disableDuplicate () {
      let disable = true
      if (this.tempItem.has_pre_upload === 1 && this.tempItem.valobj.length === 0) {
        disable = false
      }
      return disable
    }
  },

  methods: {
    handleClose () {
      this.$emit('close')
    },

    handleEdit (item) {
      const val = Object.values(item.validation)
      if (item.has_variant === 1) {
        this.dataTempProduct = [ ...item.tokopedia_meta.selection]
      } else {
        this.dataTempProduct = []
      }
      
      this.tempItem = { ...item}
      this.tempItem.img_upload = null
      this.tempItem.min_order = parseInt(this.tempItem.min_order)
      this.tempItem.stock_qty = parseInt(this.tempItem.stock_qty)
      this.tempItem.weight = parseInt(this.tempItem.weight)
      this.tempItem.formRequired = []
      if (this.tempItem.tokopedia_meta !== null && this.tempItem.tokopedia_meta.brand_availability && this.tempItem.tokopedia_meta.brand_availability === '1') {
        if (this.tempItem.has_variant === 0) {
          this.isHideMerk = true
        } else {
          this.$refs.duplwtvariant.setShowMerk()
        }
      }

      if (this.tempItem.has_variant === 1 && this.tempItem.tokopedia_meta !== null && this.tempItem.tokopedia_meta.selection.length > 0) {
        this.$refs.duplwtvariant.setTypeVariantTokped(this.tempItem.tokopedia_meta.selection)
      }
      if (this.tempItem.has_variant === 1) {
        this.tempItem.variants.map(i => {
          i.stock_qty = parseInt(i.stock_qty)
          i.checked = false
        })
      }
      this.isEdit = false
      if (this.tempItem.tokopedia_meta === null) {
        this.tempItem.tokopedia_meta = {}
      }
      if (this.tempItem.has_variant === 0) {
        this.showDetailItem = true
      } else {
        this.$refs.duplwtvariant.resetDataUnit()
        this.showDetailItemWithVariant = true
      }
    },

    getCategorySearch(queryString, callback) {
      // this.loadingCategory = true
      let params = {
        sort_column: 'name',
        sort_type: 'asc',
        search: queryString,
        per_page: 50,
        // search_column: 'is_last_level',
        // search_text: 1
      }
      fetchCategoryTokopedia(params).then(response => {
        for (let i of response.data.data) {
          i.value = i.name
        }
        this.searchCategoryData = response.data.data
        callback(this.searchCategoryData)
      }).catch(error => {
        console.log(error)
      })
    },

    getBrandSearch(queryString, callback) {
      // this.loadingCategory = true
      let params = {
        sort_column: 'name',
        sort_type: 'asc',
        search: queryString,
        per_page: 50,
        category_id: this.tempItem.tokopedia_meta.category_id
        // search_column: 'is_last_level',
        // search_text: 1
      }
      getBrandTokopedia(params).then(response => {
        for (let i of response.data.data) {
          i.value = i.name
        }
        this.searchBrandData = response.data.data
        callback(this.searchBrandData)
      }).catch(error => {
        console.log(error)
      })
    },

    handleGetRequired (data) {
      console.log('dat', data)
      this.loadingRequired = true
      this.tempItem.lazada_primary_category_id = data.lazada_category_id
      let params = {
        primary_category_id_lazada: data.lazada_category_id
      }
      this.tempItem.formRequired = []
      fetchRequiredForm(params).then(response => {
        console.log('test', response)
        this.tempItem.formRequired = [ ...response.data.data]
        this.tempItem.formRequired.map(i => {
          i.value = ''
          if (i.input_type === 'numeric') {
            i.input_type = 'number'
          }
        })
        this.loadingRequired = false
        this.$forceUpdate()
      }).catch(error => {
        this.loadingRequired = false
        console.log(error)
      })
    },

    getBrandLazada(queryString, callback) {
      // this.loadingCategory = true
      let params = {
        keyword: queryString
      }
      fetchBrandLazada(params).then(response => {
        for (let i of response.data.data) {
          i.value = i.name
        }
        this.searchBrandData = response.data.data
        callback(this.searchBrandData)
      }).catch(error => {
        console.log(error)
        callback('No Data')
      })
    },

    handleSaveSingleProduct () {
      this.loadingPreUpload = true
      let data = { ...this.tempItem }
      data.merchant_tokopedia_id = this.tokopediaActiveStore.id

      if (data.tokopedia_meta.brand_id && data.tokopedia_meta.brand_id !== null) {
        data.tokopedia_meta.brand_availability = 1
      }

      // if (data.photos) {
      //   let photo = [data.photos]
      //   data.photos = [ ...photo]
      // }

      // if (data.product_variant_id === null) {
      //   this.$delete(data, 'product_variant_id')
      // }
      // if (data.product_photo === null) {
      //   data.product_photo = {
      //     file_name: this.tempItem.photo_name
      //   }
      // }
      // this.tempItem.formRequired.map(i => {
      //   if (i.name === 'brand') {
      //     data.meta[i.name] = i.value
      //   } else {
      //     data.meta[i.name] = i.value
      //   }
      // })
      console.log('meta', data)

      if (data.has_pre_upload === 0) {
        preUploadProduct(data).then(response => {
          // console.log('resp meta', response)
          this.loadingPreUpload = false
          this.showDetailItem = false
          this.$emit('refresh')
        }).catch(error => {
          this.$message({
            type: 'error',
            message: error.string
          })
          this.loadingPreUpload = false
        })
      } else {
        updatePreUpload(data).then(response => {
          // console.log('resp meta', response)
          this.loadingPreUpload = false
          this.showDetailItem = false
          this.$emit('refresh')
        }).catch(error => {
          this.$message({
            type: 'error',
            message: error.string
          })
          this.loadingPreUpload = false
        })
      }
    },

    saveProductBatch () {
      this.loadingDuplicate = true
      let data = {
        ids: [],
        merchant_tokopedia_id: this.tokopediaActiveStore.id
      }
      this.dataChecked.map(i => {
        if (i.checked) { data.ids.push(i.id) }
      })

      // console.log(data)
      duplicateBulkProduct(data).then(response => {
        // console.log('resp meta', response)
        this.loadingDuplicate = false
        this.$emit('refresh')
      }).catch(error => {
        if (error.errorCode === 422) {
          let errorData = error.response.data.error
          let errorObj = []
          errorData.map(i => {
            errorObj.push(i.error)
          })

          this.$message({
            type: 'error',
            message: errorObj.join(', ')
          })

        } else {
          this.$message({
            type: 'error',
            message: error.string
          })
        }
        
        this.loadingDuplicate = false
      })
    },

    saveSingleProductBatch () {
      
      let data = this.tempItem
      if (this.tokopediaActiveStore !== null) {
        data.merchant_tokopedia_id = this.tokopediaActiveStore.id
      }

      // console.log('aaa', data.photos)
      // if (data.photos && data.photos.length === 0) {
      //   data.photos = [{
      //     file_name: data.photo_name
      //   }]
      // } else if (data.photos) {
      //   let poto = [data.photos]
      //   data.photos = [ ...poto]
      // }

      // console.log('aaa', data)
      
      this.loadingDuplicate = true
      duplicateSingleProduct(data).then(response => {
        // console.log('resp meta', response)
        this.loadingDuplicate = false
        this.showDetailItem = false
        this.showDetailItemWithVariant = false
        this.$emit('refresh')
      }).catch(error => {
        console.log('err', error)
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingDuplicate = false
      })
    },

    selectBrandLazada (data) {
      this.tempItem.formRequired.map(i => {
        if (i.name === 'brand') {
          i.value = data.id
        }
      })
    },

    handleChangeInput () {
      this.$forceUpdate()
    },

    showGroup (args) {
      this.$emit('filter', args)
    },

    loadMore () {
      this.$emit('loadmore')
    },

    handleCheck (item, idx) {
      if (this.dataChecked.length !== 20) {
        this.checkAll = false
      } else {
        this.checkAll = true
      }

      if (item.id === null) {
        this.$notify({
          type: 'warning',
          // title: error.response.data.error.message,
          message: 'Silahkan lengkapi data category lazada'
        })
        this.dataProd[idx].checked = false
      } else {
        const exist = this.dataChecked.some(({id}) => id === item.id)
        console.log('ex', exist)
        if (exist) {
          this.dataChecked.map((i, idx) => {
            if (i.id === item.id) {
              this.dataChecked.splice(idx, 1)
            }
          })
        } else {
          if (item.id !== null && this.dataChecked.length < 20) {
            this.dataChecked.push(item)
          } else {
            this.$notify({
              type: 'warning',
              // title: error.response.data.error.message,
              message: 'Max 20 item terpilih'
            })
          }
        }
      }
      this.$forceUpdate()
    },

    handleSaveEdit () {
      // this.loadingDuplicate = true
      let data = this.tempItem
      let att = {}
      data.formRequired.map(i => {
        att[i.name] = i.value
      })
      data.lazada_attributes = att
      
      const exist = this.dataChecked.some(({id}) => id === data.id)
      console.log('ex', exist)
      if (exist) {
        this.dataChecked.map((i, idx) => {
          if (i.id === data.id) {
            this.dataChecked.splice(idx, 1)
          }
        })
        this.dataChecked.push(data)
      } else {
        if (data.lazada_primary_category_id !== null) {
          this.dataChecked.push(data)
        }
      }

      let index = null
      this.dataProduct.map((i,idx) => {
        if (i.id === data.id) {
          index = idx
        }
      })
      this.dataProduct[index] = data
      this.showDetailItem = false
    },

    beforeUpload(file) {
      const isJpg = file.type === 'image/jpeg'
      const isPng = file.type === 'image/png'
      if (!isJpg && !isPng) {
        this.$message.error(this.$lang[this.langId].error_upload_photo)
      }
      return isJpg || isPng
    },

     handleUploadProgress (args) {
      this.loadingUpload = true
    },

    handleUploadSuccess(response, file, fileList) {
      console.log('res', response)
      if (this.tempItem.photos.length === 0) {
        this.tempItem.photos = [response.data[0]]
      } else {
        this.tempItem.photos[0] = response.data[0]
      }
      this.tempItem.photo_md = response.data[0].photo_md
      this.tempItem.photo_xs = response.data[0].photo_xs
      this.tempItem.photo_name = response.data[0].file_name
      this.loadingUpload = false
    },

    handleUploadError(error) {
      this.loading = false
      this.loadingUpload = false
      this.$notify({
        type: 'warning',
        title: error.response.data.error.message,
        message: error.response.data.error.error
      })
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

    handleCheckAll (args) {
      console.log('dds', args)
      if (args) {
        this.dataChecked = []
        this.dataProd.map(item => {
          if (item.is_completed === 1 && this.dataChecked.length < 20) {
            this.dataChecked.push(item)
          }
        })
      } else {
        this.dataChecked = []
      }
    },

    randomString(len, charSet) {
      charSet = charSet || '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      var randomString = '';
      for (var i = 0; i < len; i++) {
          var randomPoz = Math.floor(Math.random() * charSet.length);
          randomString += charSet.substring(randomPoz,randomPoz+1);
      }
      return randomString;
    },

    getRandom () {
      this.tempItem.SellerSku = this.randomString(8)
    },

    isWarnData (data) {
      if (data.lazada_primary_category_id === null ) {
        return true
      } else if ( parseInt(data.quantity) < 1 ) {
        return true
      } else if ( parseInt(data.price) < 1000 ) {
        return true
      } else if ( parseInt(data.package_weight) < 1 ) {
        return true
      } else if ( data.SellerSku === null ) {
        return true
      } else {
        return false
      }
    },

    handleSelectCategory (data) {
      this.tempItem.tokopedia_meta.category_id = data.tokopedia_category_id
      this.checkHaveMerk()
    },

    handleSelectBrand (data) {
      this.tempItem.tokopedia_meta.brand_id = data.id
    },

    handleCloseDuplicatVariant () {
      this.showDetailItemWithVariant = false
      this.$emit('refresh')
    },

    checkHaveMerk() {
      // this.loadingCategory = true
      let params = {
        category_id: this.tempItem.tokopedia_meta.category_id
      }
      this.loadingCheckBrand = true
      getBrandTokopedia(params).then(response => {
        this.isHideMerk = true
        this.loadingCheckBrand = false
      }).catch(error => {
        console.log(error)
        this.isHideMerk = false
        this.loadingCheckBrand = false
      })
    },
  }
}
</script>