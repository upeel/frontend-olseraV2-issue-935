<template>
  <el-dialog
    :visible.sync="show"
    :show-close="false"
    fullscreen
    append-to-body>
    <div slot="title" class="flex-container">
      <h4 class="dialog-title full-width font-bold font-24">
        Lengkapi Data Produk
      </h4>
      <template>
        <el-button type="info" @click="$emit('close')">{{ rootLang.cancel }}</el-button>
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
        <div class="mr-8" >
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
              style="width: 100px; height: 100px; display: flex; justify-content: center; align-items: center"
              >
              <template v-if="tempItem && tempItem.photos.length > 0">
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

          <div class="font-12 mt-8">{{ lang.sell_price }}</div>
          <input-money v-model="tempItem.sell_price" />

          <div class="flex-container mt-8">
            <div class="full-width pr-4">
              <div class="font-12">{{ lang.weight }}</div>
              <el-input v-model="tempItem.weight" />
            </div>
            <div class="full-width px-4">
              <div class="font-12">Panjang (cm)</div>
              <el-input v-model="tempItem.length_dimension" />
            </div>
            <div class="full-width px-4">
              <div class="font-12">Lebar (cm)</div>
              <el-input v-model="tempItem.width_dimension" />
            </div>
            <div class="full-width pl-4">
              <div class="font-12">Tinggi (cm)</div>
              <el-input v-model="tempItem.high_dimension" />
            </div>
          </div>

          <!-- <div class="font-12 mt-12">{{ lang.price }}</div>
          <input-money v-model="tempItem.sell_price" />
          <div class="font-11 mt-12 color-info">Harga diambil dari harga Jual Online Produk</div> -->

        </div>
      </div>
      <!-- <div class="flex-container mt-12">
        <div class="full-width pr-4">
          <div class="font-12">{{ lang.sku }} (Stock Keeping Unit)</div>
          <el-input v-model="tempItem.sku" maxlength="8">
          </el-input>
        </div>
        <div class="full-width pl-4">
          <div class="font-12">{{ lang.stock_qty }}</div>
          <el-input v-model="tempItem.stock_qty" type="number" />
        </div>
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

      <div v-if="!isHideMerk" class="flex-container">
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
            @select="handleSelectBrand"/>
        </div>
      </div>

      <div class="font-16 mt-24">Varian Product</div>
      <div v-if="tempItem.variant_label.length > 2" class="color-info--bg mt-8 p-32 text-center">
        <svg-icon icon-class="icon-warning-triangle" style="font-size: 50px"/>
        <div class="flex-container justify-center" >
          <span style="width: 264px">Tipe varian produk melebihi batas yang ditentukan Tokopedia (Max. 2 tipe varian)</span>
        </div>
      </div>
      <div v-else-if="tempItem.invalid_variant === 1" class="color-info--bg mt-8 p-32 text-center">
        <svg-icon icon-class="icon-warning-triangle" style="font-size: 50px"/>
        <div class="flex-container justify-center" >
          <span style="width: 264px">Product variant list doesnt fit Tokopedia requirement</span>
        </div>
      </div>
      <div v-else>
        <div class="flex-container">
          <div class="full-width px-4">
            <div class="font-12">Tipe variant 1 ({{ tempItem.variant_label[0] }})</div>
            <el-autocomplete
              v-model="typeVariantTokped[0].name"
              :fetch-suggestions="getTypeVariant" 
              placeholder="Search"
              class="full-width"
              @select="handleSelectTypeVariant" />
            <div class="mt-4">
              <el-tag
                v-for="tag in dataVariant.data0"
                :key="tag">
                {{tag}}
              </el-tag>
            </div>
          </div>
          <div v-if="tempItem.variant_label.length > 1" class="full-width px-4">
            <div class="font-12">Tipe variant 2 ({{ tempItem.variant_label[1] }})</div>
            <el-autocomplete
              v-model="typeVariantTokped[1].name"
              :fetch-suggestions="getTypeVariant" 
              placeholder="Search"
              class="full-width"
              @select="handleSelectTypeVariantSecond" />
            <div class="mt-4">
              <el-tag
                v-for="tag in dataVariant.data1"
                :key="tag">
                {{tag}}
              </el-tag>
            </div>
          </div>
        </div>

        <div class="mt-24 flex-container" v-if="unitVariantTokped.length >= 1">
          <div class="full-width">
            <el-radio-group v-model="unitGroup[0]">
              <template v-for="item in unitVariantTokped[0]" >
                <el-radio :key="item.unit_id" :label="item.unit_id">{{ item.name === ''? 'Default' : item.name }}</el-radio>
              </template>
            </el-radio-group>
          </div>
          <div v-if="tempItem.variant_label.length > 1" class="full-width">
            <el-radio-group v-model="unitGroup[1]">
              <template v-for="item in unitVariantTokped[1]" >
                <el-radio :key="item.unit_id" :label="item.unit_id">{{ item.name === ''? 'Default' : item.name }}</el-radio>
              </template>
            </el-radio-group>
          </div>
        </div>
        
        <div class="radius-5 color-grey--bg p-12 mt-24" :class="">
          <div class="flex-container">
            <div class="full-width">
              <el-checkbox v-model="checkAll" class="font-16 font-bold" @change="handleCheckAll">Ubah data variant sekaligus</el-checkbox>
            </div>
            <el-button type="primary" @click="setAllVariant">{{ rootLang.apply }}</el-button>
          </div>
          <table
            v-if="tempItem.variant_label.length"
            class="table table-striped table-bordered mt-24">
            <thead
              v-if="computedHeaderTable.header.length">
              <tr>
                <th
                  v-for="(header, key) in computedHeaderTable.header"
                  :key="key"
                  :style="{
                    top: fixedTop
                  }"
                  style="border: none">
                  <slot :name="'header-' + key" :header="header">
                    {{ key === 0? '' : header }}
                  </slot>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  v-for="(col, colidx) in computedHeaderTable.cols"
                  :key="colidx"
                  style="border: none">
                  <template v-if="colidx === 0">
                    <div style="min-width: 100px" >{{ computedHeaderTable.header[colidx] }}</div>
                  </template>
                  <template v-if="col === 'sell_price'">
                    <input-money v-model="formBulk.sell_price" style="width: 100%" />
                  </template>
                  <template v-if="col === 'stock_qty'">
                    <el-input
                      v-model="formBulk.stock_qty"
                      type="number"
                    />
                  </template>
                  <template v-if="col === 'sku'">
                    <el-input v-model="formBulk.sku" :placeholder="lang.sku" style="width:100%; margin-top:0;"/>
                  </template>
                  <!-- <template v-if="col === 'photos'">
                    <list-variant-duplicate :rowData="row" @upload="handleUploadImageVariant" />
                  </template> -->
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <table
          v-if="tempItem.variant_label.length"
          class="table table-striped table-bordered mt-24">
          <thead
            v-if="computedHeaderTable.header.length">
            <tr>
              <th
                v-for="(header, key) in computedHeaderTable.header"
                :key="key"
                :style="{
                  top: fixedTop
                }">
                <slot :name="'header-' + key" :header="header">
                  {{ header }}
                </slot>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, key) in tempItem.variants"
              :key="key">
              <td
                v-for="(col, colidx) in computedHeaderTable.cols"
                :key="colidx">
                <!-- <slot :name="col" :row="row">
                  {{ row[col] }}
                </slot> -->
                <!-- <template v-if="col === 'name'">
                  <div>{{ row.name }}</div>
                  <el-select v-model="row.combinations[0]" placeholder="Select" @change="$forceUpdate()">
                    <el-option
                      v-for="item in dataUnitValue[0]"
                      :key="item.value_id"
                      :label="item.value"
                      :value="item.value_id">
                    </el-option>
                  </el-select>
                  <template v-if="tempItem.variant_label.length > 1">
                    <el-select v-model="row.combinations[1]" placeholder="Select" @change="$forceUpdate()">
                      <el-option
                        v-for="item in dataUnitValue[1]"
                        :key="item.value_id"
                        :label="item.value"
                        :value="item.value_id">
                      </el-option>
                    </el-select>
                  </template>
                </template> -->
                <template v-for="(item, key) in tempItem.variant_label">
                  <template v-if="colidx === key">
                    <div :key="key" class="flex-container">
                      <div class="mr-8">
                        <el-checkbox v-model="row.checked" @change="handleCheckbox"></el-checkbox>
                      </div>
                      <div >{{ row.nameVar[key] }}</div>
                    </div>
                  </template>
                </template>
                <template v-if="col === 'sell_price'">
                  <input-money v-model="row.sell_price" style="width: 100%" />
                </template>
                <template v-if="col === 'stock_qty'">
                  <el-input
                    v-model="row[col]"
                    type="number"
                  />
                </template>
                <template v-if="col === 'sku'">
                  <el-input v-model="row.sku" :placeholder="lang.sku" style="width:100%; margin-top:0;"/>
                </template>
                <template v-if="col === 'photos'">
                  <list-variant-duplicate :rowData="row" @upload="handleUploadImageVariant" />
                  <!-- <div class="flex-container justify-center">
                    <el-upload
                      v-loading="loadingUploadVariant"
                      :action="uploadPhotoUrl"
                      :headers="headersReverify"
                      :before-upload="beforeUpload"
                      :show-file-list="false"
                      :on-progress="handleUploadProgress"
                      :on-success="handleUploadSuccessVariant"
                      :on-error="handleUploadError"
                      list-type="document-grabfood"
                      >
                      <template v-if="row[col].length >= 1">
                        <el-image
                          :src="row[col][0].file_path" alt=""
                          style="width: 100px; height: 100px; margin-right: 8px;"
                        />
                      </template>
                      <template v-else>
                        <i class="el-icon-camera"></i>
                      </template>
                    </el-upload>
                  </div> -->
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-24" v-if="tempItem.variant_label.length <= 2 && (tempItem.invalid_variant !== 1)">
        <el-button class="btn-block" :loading="loadingDuplicate" plain @click="saveSingleProductBatch"> Duplikat produk ini </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import { fetchCategoryTokopedia,
  preUploadProduct,
  updatePreUploadProduct as updatePreUpload,
  duplicateSingleProduct,
  getVariantTokopedia,
  getBrandTokopedia } from '@/api/thirdParty/tokopedia'
import { baseApi, HTTP } from 'src/http-common'

import InputMoney from '@/components/InputMoneyV2'
import listVariantDuplicate from './listVariantDuplicate'

export default {
  mixins: [basicComputedMixin],

  components: {
    InputMoney,
    listVariantDuplicate
  },

  props: {
    show: {
      type: Boolean,
      default: false
    },
    tempItem: {
      type: Object,
      default: {}
    },
    dataTemp: {
      type: Object,
      default: {}
    }
  },

  mounted () {

  },

  data() {
    return {
      maxVariant: false,
      searchCategoryData: [],
      searchVariantData: [],
      variantTokped: [],
      tableData: [],
      typeVariantTokped: [{
        name: '',
        variant_id: null,
        unit_id: null,
        options: []
      },
      {
        name: '',
        variant_id: null,
        unit_id: null,
        options: []
      }],
      unitVariantTokped: [],
      unitGroup: [],
      loadingPreUpload: false,
      searchBrandData: [],
      loadingUpload: false,
      isHideMerk: false,
      loadingCheckBrand: false,
      formBulk: {
        stock_qty: '',
        sku: '',
        sell_price: ''
      },
      checkAll: false,
      loadingDuplicate: false
    }
  },

  computed: {
    dataVariant () {
      let dataVariant = [ ...this.tempItem.variants]
      let tipeVar = [ ...this.tempItem.variant_label]
      let data0 = []
      let data1 = []
      dataVariant.map(i => {
        i.nameVar = i.name.split(',')
      })

      dataVariant.map(i => {
        tipeVar.map((j, idx) => {
          if (idx === 0) {
            data0.push(i.nameVar[idx])
          }
          if (idx === 1) {
            data1.push(i.nameVar[idx])
          }
        })
      })
      var uniq = data0.map((name) => {
        return {count: 1, name: name}
      }).reduce((a, b) => {
        a[b.name] = (a[b.name] || 0) + b.count
        return a
      }, {})

      var uniq1 = data1.map((name) => {
        return {count: 1, name: name}
      }).reduce((a, b) => {
        a[b.name] = (a[b.name] || 0) + b.count
        return a
      }, {})

      data0 = Object.keys(uniq).sort((a, b) => uniq[a] < uniq[b])
      data1 = Object.keys(uniq1).sort((a, b) => uniq[a] < uniq[b])
      return {
        data0,
        data1
      }
    },

    dataUnitValue () {
      let value0 = []
      let value1 = []
      this.unitGroup.map((i, idx) => {
        this.unitVariantTokped[idx].map(j => {
          if (i === j.unit_id) {
            if (idx === 0) { value0 = [ ...j.values] }
            if (idx === 1) { value1 = [ ...j.values] }
          }
        })
      })

      return [
        value0,
        value1
      ]
    },

    uploadPhotoUrl() {
      return baseApi(this.selectedStore.url_id, this.langId, 'product/upload')
    },

    headersReverify() {
      return {
        'Authorization': 'Bearer ' + this.token.access_token
      }
    },

    computedHeaderTable () {
      let arr1 = ['Harga', 'Qty', 'SKU']
      let arr2 = [ ...this.tempItem.variant_label]
      let header = arr2.concat(arr1)

      let cls = ['sell_price', 'stock_qty', 'sku', 'photos']
      let cls2 = []
      this.tempItem.variant_label.map((i, idx) => {
        cls2.push('name' + idx)
      })
      let cols = cls2.concat(cls)

      return {
        header, cols
      }
    },

    disableApplyBulk () {
      let dis = true
      this.tempItem.variants.map(i => {
        console.log('aaa')
        if (i.checked) { dis = false }
      })
      this.$forceUpdate()
      return dis
    }
  },

  methods: {
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

    getTypeVariant(queryString, callback) {
      // this.loadingCategory = true
      let params = {
        sort_column: 'name',
        sort_type: 'asc',
        search: queryString,
        per_page: 50,
        category_id: this.tempItem.tokopedia_meta.category_id
      }
      getVariantTokopedia(params).then(response => {
        for (let i of response.data.data) {
          i.value = i.name
        }
        this.searchVariantData = response.data.data
        callback(this.searchVariantData)
      }).catch(error => {
        console.log(error)
      })
    },

    handleSelectCategory (data) {
      this.tempItem.tokopedia_meta.category_id = data.tokopedia_category_id
      this.tempItem.tokopedia_meta.brand_id = null
      this.tempItem.tokopedia_meta.brand_name = ''
      this.checkHaveMerk()
    },

    handleSelectTypeVariant (data) {
      this.typeVariantTokped[0].variant_id = data.variant_id
      this.unitVariantTokped[0] = data.units
      // if (this.tempItem.variant_label.length === 1) {
      //   this.refreshTable()
      // }
    },

    handleSelectTypeVariantSecond (data) {
      this.typeVariantTokped[1].variant_id = data.variant_id
      this.unitVariantTokped[1] = data.units
      // this.refreshTable()
    },

    refreshTable() {
      
      let tableData = []
      let dataVar = []
      dataVar[0] = this.dataVariant.data0
      if (this.tempItem.variant_label.length > 1) {
        dataVar[1] = this.dataVariant.data1
      }
      
      if (this.tempItem.variant_label.length >= 1) {
        // combine to variant names
        let allVariants = this.printCombinations(dataVar)
        console.log('print', allVariants)
        // put in to array object
        allVariants.forEach((item, idx) => {
          let sku = ''
          let sellPrice = ''
          let stockQty = ''
          let photos = ''
          let productId = ''
          let status = ''
          if (this.tableData.length > 0) {
            this.tableData.map((list, index) => {
              if (idx === index) {
                sku = list.sku
                sellPrice = list.sell_price
                stockQty = list.stock_qty
                photos = list.photos
                productId = list.productId
                status = list.status
              } else {
                return false
              }
            })
          }
          let newData = {
            name: item,
            sku: sku,
            sell_price: sellPrice,
            stock_qty: stockQty,
            photos: photos,
            product_id: productId,
            status: status
          }
          tableData.push(newData)
        })

        tableData.map(i => {
          i.id = null
          i.sku = this.tempItem.sku
          i.product_id = this.tempItem.id
          i.sell_price = this.tempItem.sell_price
          i.stock_qty = this.tempItem.stock_qty
          i.photos = this.tempItem.photos
          i.status = ''

          this.tempItem.variants.map(j => {
            if (i.name === j.name) {
              i.id = j.id
              i.sku = j.sku
              i.product_id = j.product_id
              i.sell_price = j.sell_price
              i.stock_qty = j.stock_qty
              i.photos = j.photos
              i.status = j.status
            }
          })
        })
      } else if (this.data.names.length === 1 && this.data.names.length !== 0) {
        let names = this.data.names[0]
        names.forEach((item, idx) => {
          // console.log('item', item)
					let unit = ''
          let sku = ''
          let sellPrice = ''
          let sellPricePos = ''
          if (this.productData) {
            if (this.productData.sku) {
              sku = this.productData.sku + '-' + idx
            }
            if (this.productData.sell_price) {
              sellPrice = this.productData.sell_price
            }
            if (this.productData.sell_price_pos) {
              sellPricePos = this.productData.sell_price_pos
            }
          }
          let singleData = {
            name: item,
						unit: unit,
            sku: sku,
            sell_price: sellPrice,
            sell_price_pos: sellPricePos
          }
          tableData.push(singleData)
        })
      }
      this.tableData = tableData
      // this.tableData.push(tableData)
      this.dataCompleted = true
    },

    printCombinations(arr) {
      function allPossibleCases(arr) {
        if (arr.length === 1) {
          return arr[0]
        } else {
          var result = []
          // recur with the rest of array
          var allCasesOfRest = allPossibleCases(arr.slice(1))
          for (var i = 0; i < allCasesOfRest.length; i++) {
            for (var j = 0; j < arr[0].length; j++) {
              result.push(arr[0][j] + ',' + allCasesOfRest[i])
            }
          }
          return result
        }
      }
      return allPossibleCases(arr)
    },

    handleSaveSingleProduct () {
      let data = { ...this.tempItem}
      data.merchant_tokopedia_id = this.tokopediaActiveStore.id
      data.tokopedia_meta.selection = []
      // data.tokopedia_meta.variants = []
      let variants = []

      if (data.tokopedia_meta.brand_id && data.tokopedia_meta.brand_id !== null) {
        data.tokopedia_meta.brand_availability = 1
      }
      
      this.unitGroup.map((j, idx) => {
        this.unitVariantTokped[idx].map(k => {
          k.unit_value_id = k.value_id 
          if (j === k.unit_id) {
            this.typeVariantTokped[idx].unit_id = j
            // this.typeVariantTokped[idx].options = [ ...k.values]
          }
        })
      })

      // this.typeVariantTokped.map(i => {
      //   i.id = i.variant_id
      //   i.options.map(j => {
      //     j.unit_value_id = j.value_id
      //   })
      // })

      this.typeVariantTokped.map((i, idx) => {
        i.id = i.variant_id

        // let opt = []
        // i.options.map(j => {
        //   opt.push(j.value)
        // })
        // i.options = [ ...opt]
        
        if (this.dataTemp[idx]) {
          console.log('selet', this.dataTemp[idx])
          i.options = this.dataTemp[idx].options
        }
      })

      if (this.unitGroup.length === 1) {
        this.typeVariantTokped.splice(1,1)
      }

      // data.variants.map(i => {
      //   variants.push({
      //     product_variant_id: i.id,
      //     combination: i.combinations
      //   })
      // })

      // data.variants.map(i => {
      //   // if (i.photos && i.photos.length === 0) {
      //   //   i.photos = [
      //   //     { file_name: i.photo_name}
      //   //   ]
      //   // } 
      //   if (typeof i.photos === 'object') {
      //     let ptp = []
      //     ptp.push(i.photos)
      //     i.photos = ptp
      //     console.log('vaer', i.photos)
      //   }
      // })

      data.tokopedia_meta.selection = [ ...this.typeVariantTokped]
      // data.tokopedia_meta.variants = [ ...variants]

      console.log('data', data)

      if (data.has_pre_upload === 0) {
        this.loadingPreUpload = true
        preUploadProduct(data).then(response => {
          // console.log('resp meta', response)
          this.loadingPreUpload = false
          this.$emit('close')
        }).catch(error => {
          this.$message({
            type: 'error',
            message: error.string
          })
          this.loadingPreUpload = false
        })
      } else {
        this.loadingPreUpload = true
        updatePreUpload(data).then(response => {
          // console.log('resp meta', response)
          this.loadingPreUpload = false
          this.showDetailItem = false
          this.$emit('close')
        }).catch(error => {
          this.$message({
            type: 'error',
            message: error.string
          })
          this.loadingPreUpload = false
        })
      }
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

    handleSelectBrand (data) {
      this.tempItem.tokopedia_meta.brand_id = data.id
      this.$forceUpdate()
    },

    checkHaveMerk() {
      // this.loadingCategory = true
      let params = {
        category_id: this.tempItem.tokopedia_meta.category_id
      }
      this.loadingCheckBrand = true
      getBrandTokopedia(params).then(response => {
        this.isHideMerk = false
        this.loadingCheckBrand = false
      }).catch(error => {
        console.log(error)
        this.isHideMerk = true
        this.loadingCheckBrand = false
      })
    },

    setShowMerk () {
      this.isHideMerk = true
    },

    setTypeVariantTokped (selection) {
      selection.map((i, idx) => {
        this.typeVariantTokped[idx] = selection[idx]
      })
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
    
    resetDataUnit () {
      this.unitVariantTokped = []
      this.unitGroup = []
    },

    saveSingleProductBatch () {
      this.loadingDuplicate = true
      let data = this.tempItem
      if (this.tokopediaActiveStore !== null) {
        data.merchant_tokopedia_id = this.tokopediaActiveStore.id
      }
      if (data.tokopedia_meta.brand_id && data.tokopedia_meta.brand_id !== null) {
        data.tokopedia_meta.brand_availability = 1
      }
      
      this.unitGroup.map((j, idx) => {
        this.unitVariantTokped[idx].map(k => {
          k.unit_value_id = k.value_id 
          if (j === k.unit_id) {
            this.typeVariantTokped[idx].unit_id = j
            // this.typeVariantTokped[idx].options = [ ...k.values]
          }
        })
      })

      this.typeVariantTokped.map((i, idx) => {
        i.id = i.variant_id
        if (this.tempItem.tokopedia_meta.selection[idx]) {
          i.options = this.tempItem.tokopedia_meta.selection[idx].options
        }
      })

      if (this.unitGroup.length === 1) {
        this.typeVariantTokped.splice(1,1)
      }

      this.typeVariantTokped.map((i, idx) => {
        if (i.id === null) {
          this.typeVariantTokped.splice(idx, 1)
        }
      })

      data.variants.map(i => {
        // if (i.photos && i.photos.length === 0) {
        //   i.photos = [
        //     { file_name: i.photo_name}
        //   ]
        // } else if (i.photos) {
        //   let ptp = i.photos
        //   i.photos = [ ptp]
        //   console.log('vaer', i.photos)
        // }
        i.sell_price = parseInt(i.sell_price)
      })

      data.tokopedia_meta.selection = [ ...this.typeVariantTokped]
      // console.log('aa', data)
      duplicateSingleProduct(data).then(response => {
        // console.log('resp meta', response)
        this.loadingDuplicate = false
        this.showDetailItem = false
        this.$emit('close')
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

    handleUploadImageVariant (data) {
      this.tempItem.variants.map(i => {
        if (i.id === data.id) {
          i.photos = [data.photos]
        }
      })
    },

    handleCheckAll (data) {
      this.tempItem.variants.map(i => {
        i.checked = data
      })
      this.$forceUpdate()
    },

    handleCheckbox () {
      this.$forceUpdate()
    },

    setAllVariant () {
      
      this.tempItem.variants.map(i => {
        console.log('setall', i.name.replace(/\s+/g, ""))
        if (i.checked) {
          i.stock_qty = this.formBulk.stock_qty
          i.sku = this.formBulk.sku + i.name.replace(/\s+/g, "")
          i.sell_price = this.formBulk.sell_price
        }
      })
    }
  }
}
</script>