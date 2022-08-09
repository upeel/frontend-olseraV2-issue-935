<template>
  <transition name="el-zoom-in-center">
    <div
      v-if="show"
      class="offscreen-right-sidebar px-null">
      <div class="offscreen-right-sidebar--wrapper">
        <div class="offscreen-right-sidebar--header text-left color-white--bg" style="z-index: 10">
          Duplikat produk ke Bukalapak
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
              {{ dataSummaries.cannot }} produk tidak dapat diduplikasi ke Lazada karena data kurang lengkap. <span class="color-primary pointer" @click="showInfoInvalidProduct = true"> Selengkapnya </span>
            </div>
          </div>
        </div>

        <div class="like-table-wrapper border border--table-border mt-24" >
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
                    v-if="item.photo_lg !== null"
                    :src="item.photo_lg"
                    :size="32"
                    shape="square"
                  />
                  <div class="color-white--bg container-watermark-olsera">
                    <el-avatar
                      src="/static/img/olsera.png"
                      class="mr-4"
                      :size="20"
                    />
                  </div>
                </div>
                <div class="font-bold font-14 ml-8 word-break">
                  <div class="color-primary">{{ item.product_name }}</div>
                  <!-- <div v-if="!isWarnData(item)" class="font-12">{{ item.bukalapak_primary_category_name }}</div> -->
                  <div v-if="item.is_completed" class="font-12">{{ item.bukalapak_primary_category_name }}</div>
                  <div v-else class="color-danger font-12">Data belum lengkap</div>
                  <div class="font-12">{{ item.fprice }}</div>
                </div>
              </div>
              <div class="font-14 px-12 text-right" style="width: 30%">
                {{ item.product_qty }}
              </div>
              <div>
                <div v-if="item.category_id_bukalapak !== null && item.is_completed === true" class="mr-8"><el-checkbox v-model="item.checked" @change="handleCheck(item, idx)"></el-checkbox></div>
                <div v-else>
                  <svg-icon icon-class="alert-triangle-yellow" class="mr-8" />
                </div>
              </div>
            </div>
          </div>
        </div>

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
            class="btn-block mt-24 color-bukalapak--bg color-white"
            @click="saveProductBatch">
            {{rootLang.duplicate_product}}
          </el-button>
        </div>
      </div>

      <el-dialog
        :visible.sync="showDetailItem"
        :show-close="false"
        width="536px"
        append-to-body>
        <div slot="title" class="flex-container">
          <h4 class="dialog-title full-width font-bold font-24">
            Lengkapi Data Produk
          </h4>
          <template>
            <el-button type="info" @click="showDetailItem = false">{{ rootLang.cancel }}</el-button>
            <el-button type="bukalapak" :loading="loadingPreUpload" @click="handleSaveSingleProduct">{{ lang.save }}</el-button>
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
                :src="tempItem.photo_lg"
                fit="cover"
                style="width: 100px; height: 100px; margin-right: 8px;"
              /> -->
              <div class="flex-container justify-center">
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
                  <template v-if="tempItem.img_upload !== null">
                    <el-image
                      :src="tempItem.img_upload.photo_lg" alt=""
                      style="width: 100px; height: 100px; margin-right: 8px;"
                    />
                  </template>
                  <template v-else>
                    <el-image
                      v-if="tempItem.photo_file_name !== null"
                      :src="tempItem.photo_lg" alt=""
                      style="width: 100px; height: 100px; margin-right: 8px;"
                    />
                    <!-- <i v-else class="el-icon-camera"></i> -->
                  </template>
                </el-upload>
              </div>
            </div>
            <div class="full-width">
              <div class="font-12">{{ lang.product_name }}</div>
              <el-input v-model="tempItem.product_name" />

              <div class="font-12 mt-12">{{ lang.price }}</div>
              <input-money v-model="tempItem.product_price" />
              <div class="font-11 mt-12 color-info">Harga diambil dari harga Jual Online Produk</div>

              <div class="font-12 mt-12">{{ lang.sku }} (Stock Keeping Unit)</div>
              <!-- <el-input v-model="tempItem.SellerSku" /> -->

              <el-input v-model="tempItem.product_sku" maxlength="8" @input="handleChangeInput">
                <template slot="append" ><el-button type="text" @click="getRandom"><svg-icon icon-class="refresh-ico" class="color-info pointer"  /></el-button></template>
              </el-input>
            </div>
          </div>
          <div class="flex-container mt-8">
            <div class="full-width pr-4">
              <div class="font-12">{{ lang.stock_qty }}</div>
              <el-input v-model="tempItem.product_qty" />
            </div>
            <div class="full-width pl-4">
              <div class="font-12">{{ lang.weight }}</div>
              <el-input v-model="tempItem.product_weight" />
            </div>
          </div>

          <div class="mt-12">
            <div class="font-12">{{ lang.description }}</div>
            <el-input type="textarea" autosize v-model="tempItem.product_description" />
          </div>

          <div class="color-info--bg p-8 mt-24 text-center">
            <div class="font-12" style="color: #999999">Kategory Olsera</div>
            <div class="font-bold">{{ tempItem.category_name_olsera }}</div>
          </div>

          <div v-loading="loadingRequired" class="mt-24">
            <div class="font-12">Kategory Bukalapak</div>
            <el-autocomplete
              v-model="tempItem.category_bukalapak.name"
              :fetch-suggestions="getCategorySearch"
              placeholder="Search Category"
              class="full-width"
              @select="handleGetRequired" />
          </div>

          <template v-if="tempItem.formRequired">
            <div v-for="(item, idx) in tempItem.formRequired" :key="idx" class="mt-24">
              <template v-if="item.input_type !== 'singleSelect'">
                <div class="font-12 mt-16">{{ item.label }}</div>
                <el-input :type="item.input_type" v-model="tempItem.formRequired[idx].value" @input="handleChangeInput"></el-input>
              </template>
              <template v-else-if="item.input_type === 'singleSelect'">
                <div class="font-12 mt-16">{{ item.label }}</div>
                <el-autocomplete
                  v-model="tempItem.formRequired[idx].value_name"
                  :fetch-suggestions="getBrandBukalapak" 
                  placeholder="Search Brand"
                  class="full-width"
                  @select="selectBrandBukalapak"
                  @input="handleChangeInput" />
              </template>
              <!-- <template v-if="item.input_type !== 'singleSelect'">
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
              </template> -->
            </div>
          </template>

          <div class="like-table-wrapper border border--table-border p-16 mt-24">
            <div class="flex-container mt-8">
              <div class="full-width pr-4">
                <div class="font-12">{{ lang.color }}</div>
                <el-input v-model="tempItem.color" />
              </div>
              <div class="full-width pl-4">
                <div class="font-12">{{ lang.type }}</div>
                <el-input v-model="tempItem.type" />
              </div>
            </div>
            <div v-loading="loadingRequired" class="mt-24">
              <div class="font-12">{{ lang.size }}</div>
              <el-autocomplete
                v-model="tempItem.category_bukalapak.size"
                :fetch-suggestions="getCategorySearch"
                placeholder="Search Category"
                class="full-width"
                @select="handleGetRequired" />
            </div>
          </div>

          <div class="mt-24">
            <el-button class="btn-block" :loading="loadingDuplicate" plain @click="saveSingleProductBatch"> Duplikat produk ini </el-button>
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
          <div class="word-break" style="font-weight: normal">{{ dataSummaries.cannot }} produk tidak dapat diduplikasi ke Lazada. Produk di Olsera harus memiliki minimal data-data di bawah ini</div>
        </div>
        <div>
          <div class="color-info--bg p-12">
            <ul>
              <li>Foto</li>
              <li>Nama Produk</li>
              <li>Kategory Lazada</li>
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

import { fetchCategoryBukalapak, 
  fetchRequiredForm, 
  fetchBrandBukalapak, 
  savePreUpload, 
  saveDuplicateProduct, 
  saveBulkStore,
  updatePreUpload } from '@/api/thirdParty/bukalapak'
export default {
  name: 'DuplicateProduct',
  mixins: [basicComputedMixin],
  components: {
    CloseEsc,
    InputMoney
  },

  props: {
    show: {
      type: Boolean,
      default: false
    },
    dataProduct: {
      type: Array,
      default: () => []
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
      default: () => {}
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
        // Images: [],
        img_upload: null,
        category_bukalapak: {}
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
      search: ''
    }
  },

  computed: {
    dataProd () {
      return this.dataProduct.map(i => {
        i.checked = false
        if (this.dataChecked.length > 0) {
          this.dataChecked.map(j => {
            if (i.uniq_id === j.uniq_id) {
              i.checked = true
            }
          })
        }
        return i
      })
      // let data = [ ...this.dataProduct]
      // data.map(i => {
      //   i.checked = false
      //   if (this.dataChecked.length > 0) {
      //     this.dataChecked.map(j => {
      //       if (i.uniq_id === j.uniq_id) {
      //         i.checked = true
      //       }
      //     })
      //   }
      // })

      // return data
    },

    uploadPhotoUrl() {
      return baseApi(this.selectedStore.url_id, this.langId, 'product/upload')
    },

    headersReverify() {
      return {
        'Authorization': 'Bearer ' + this.token.access_token
      }
    },
  },

  methods: {
    handleClose () {
      this.$emit('close')
    },

    handleEdit (item) {
      this.tempItem = { ...item}
      this.tempItem.img_upload = null
      this.tempItem.formRequired = []
      // item.lazada_attributes !== null ? this.tempItem.formRequired = item.lazada_attributes : this.tempItem.formRequired = []
      this.isEdit = false
      if (this.tempItem.SellerSku === null) {
        this.getRandom()
      }
      if (item.bukalapak_attributes !== null && item.bukalapak_primary_category_id !== null) {
        this.isEdit = true
        let temp = [ ...item.bukalapak_attributes]
        let params = {
          primary_category_id_bukalapak: item.buaklapak_primary_category_id
        }
        fetchRequiredForm(params).then(response => {
          console.log('temp', temp)
          this.tempItem.formRequired = [ ...response.data.data]
          this.tempItem.formRequired.map(i => {
            i.value = ''
            if (i.input_type === 'numeric') {
              i.input_type = 'number'
            }
            temp.map(j => {
              if (i.name === j.name) {
                if (i.input_type !== 'singleSelect') {
                  i.value = j.value
                } else {
                  i.value = j.value
                  i.value_name = j.value_label
                }
              }
            })
          })
          // this.tempItem.formRequired.map(i => {
          //   if (i.name === 'brand') {

          //   }
          // })
          this.loadingRequired = false
          this.$forceUpdate()
        }).catch(error => {
          this.loadingRequired = false
          console.log(error)
        })
      }
      // this.tempItem.value = 0
      this.showDetailItem = true
    },

    getCategorySearch(queryString, callback) {
      // this.loadingCategory = true
      let params = {
        // sort_column: 'name',
        // sort_type: 'asc',
        // search: queryString,
        // per_page: 50,
        // search_column: 'name',
        // search_text: queryString,
        // is_last_level: 1
      }
      fetchCategoryBukalapak(params).then(response => {
        for (let i of response.data.data) {
          i.value = i.name
        }
        this.searchCategoryData = response.data.data
        callback(this.searchCategoryData)
      }).catch(error => {
        console.log(error)
      })
    },

    handleGetRequired (data) {
      console.log('dat', data)
      this.loadingRequired = true
      this.tempItem.category_id_bukalapak = data.category_id_bukalapak
      let params = {}
      this.tempItem.formRequired = []
      fetchRequiredForm(params, data.category_id_bukalapak).then(response => {
        console.log('test', response)
        this.tempItem.formRequired = [ ...response.data.data]
        // this.tempItem.formRequired.map(i => {
        //   i.value = ''
        //   if (i.input_type === 'numeric') {
        //     i.input_type = 'number'
        //   }
        // })
        this.loadingRequired = false
        this.$forceUpdate()
      }).catch(error => {
        this.loadingRequired = false
        console.log(error)
      })
    },

    getBrandBukalapak(queryString, callback) {
      // this.loadingCategory = true
      let params = {
        keyword: queryString
      }
      fetchBrandBukalapak(params).then(response => {
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
      let data = {
        product_name: this.tempItem.product_name,
        uniq_id: this.tempItem.uniq_id,
        product_id: this.tempItem.id,
        has_variant: this.tempItem.has_variant,
        product_variant_id: this.tempItem.variant_id,
        product_sku: this.tempItem.product_sku,
        product_description: this.tempItem.description,
        product_weight: this.tempItem.product_weight,
        product_sell_price: this.tempItem.product_price,
        product_stock_qty: this.tempItem.product_qty,
        product_photo: this.tempItem.img_upload,
        meta: {
          primary_category_id: this.tempItem.bukalapak_primary_category_id,
        }
      }
      if (data.product_variant_id === null) {
        this.$delete(data, 'product_variant_id')
      }
      if (data.product_photo === null) {
        data.product_photo = {
          file_name: this.tempItem.photo_name
        }
      }
      this.tempItem.formRequired.map(i => {
        if (i.name === 'brand') {
          data.meta[i.name] = i.value
        } else {
          data.meta[i.name] = i.value
        }
      })
      console.log('meta', data)

      if (!this.isEdit) {
        savePreUpload(data).then(response => {
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
        uniq_ids: []
      }
      this.dataChecked.map(i => {
        if (i.checked) { data.uniq_ids.push(i.uniq_id) }
      })

      // console.log(data)
      saveBulkStore(data).then(response => {
        // console.log('resp meta', response)
        this.loadingDuplicate = false
        this.$emit('refresh')
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingDuplicate = false
      })
    },

    saveSingleProductBatch () {
      this.loadingDuplicate = true
      let data = this.tempItem
      let att = {}
      data.formRequired.map(i => {
        att[i.name] = i.value
      })
      data.bukalapak_attributes = att
      // console.log(data)
      saveDuplicateProduct(data).then(response => {
        // console.log('resp meta', response)
        this.loadingDuplicate = false
        this.$emit('refresh')
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingDuplicate = false
      })
    },

    selectBrandBukalapak (data) {
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

      if (item.bukalapak_primary_category_id === null) {
        this.$notify({
          type: 'warning',
          // title: error.response.data.error.message,
          message: 'Silahkan lengkapi data category bukalapak'
        })
        this.dataProd[idx].checked = false
      } else {
        const exist = this.dataChecked.some(({uniq_id}) => uniq_id === item.uniq_id)
        console.log('ex', exist)
        if (exist) {
          this.dataChecked.map((i, idx) => {
            if (i.uniq_id === item.uniq_id) {
              this.dataChecked.splice(idx, 1)
            }
          })
        } else {
          if (item.bukalapak_primary_category_id !== null && this.dataChecked.length < 20) {
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
      data.bukalapak_attributes = att
      
      const exist = this.dataChecked.some(({uniq_id}) => uniq_id === data.uniq_id)
      console.log('ex', exist)
      if (exist) {
        this.dataChecked.map((i, idx) => {
          if (i.uniq_id === data.uniq_id) {
            this.dataChecked.splice(idx, 1)
          }
        })
        this.dataChecked.push(data)
      } else {
        if (data.bukalapak_primary_category_id !== null) {
          this.dataChecked.push(data)
        }
      }

      let index = null
      this.dataProduct.map((i,idx) => {
        if (i.uniq_id === data.uniq_id) {
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
      this.tempItem.img_upload = response.data[0]
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
        search_column: 'product_name'
      }
      if (data !== '') {
        this.$set(params, 'search_text', data)
        this.$set(params, 'search_column', 'product_name')
      } else {
        this.$delete(params, 'search_text')
        this.$delete(params, 'search_column')
      }
      this.$emit('search', params)
    },

    handleSearchByEnter () {
      let params = {
        search_text: '',
        search_column: 'product_name'
      }
      if (this.search !== '') {
        this.$set(params, 'search_text', this.search)
        this.$set(params, 'search_column', 'product_name')
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
          if (item.bukalapak_primary_category_id !== null && this.dataChecked.length < 20) {
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
      if (data.category_id_bukalapak === null ) {
        return true
      } else if ( parseInt(data.product_qty) < 1 ) {
        return true
      } else if ( parseInt(data.product_price) < 1000 ) {
        return true
      } else if ( parseInt(data.product_weight) < 1 ) {
        return true
      } else if ( data.product_sku === null ) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>