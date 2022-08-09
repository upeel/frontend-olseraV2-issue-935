<template>
  <div class="content-wrapper" v-loading="loading">
    <section class="content sales-list no-subpage">
      <el-row :gutter="10">
        <el-col>
          <el-card class="box-card">
            <div slot="header">
              <h4>{{ lang.print_product_barcode }}</h4>
            </div>
            <div class="card-body">
              <div style="margin-top: 16px">
                <el-form
                  v-if="showAddProduct"
                  v-model="fresh"
                  label-position="top"
                  @submit.native.prevent>
                  <el-form-item :label="lang.product">
                    <select-multiple-items
                      :prop-selected-items="fresh.product"
                      value-key="product_id"
                      end-point="productvariantonlysearch"
                      option-label="name"
                      @change="handleGetProduct"
                      @remove="handleRemoveProduct"
                    />
                  </el-form-item>
                  <el-form-item :label="lang.or + ' ' + lang.product_combo">
                    <select-multiple-items
                      :prop-selected-items="fresh.product_combo"
                      value-key="id"
                      end-point="productcombo"
                      option-label="name"
                      @change="handleGetProductCombo"
                      @remove="handleRemoveProductCombo"
                    />
                  </el-form-item>
                  <el-form-item :label="lang.qty">
                    <el-input
                      v-model="fresh.qty"
                      :min="0"
                      type="number"
                      @keyup.native.enter="handleApply"
                    />
                  </el-form-item>
                  <el-button type="primary" @click="handleApply">{{ $lang[langId].apply }}</el-button>
                  <el-button v-if="showTableProduct" @click="showAddProduct = false">{{ lang.cancel }}</el-button>
                </el-form>

                <div
                  v-if="showTableProduct"
                  style="margin-top: 16px">
                  <el-button
                    v-if="!showAddProduct"
                    type="primary"
                    @click="showAddProduct = true">
                    {{ lang.add_product }}
                  </el-button>
                  <el-table
                    stripe
                    ref="multipleTable"
                    v-loading="loading"
                    :data="fresh.product_barcode"
                    class="product-table-max-height mobile-fix-height-unset">
                    <el-table-column :label="lang.name" prop="name"></el-table-column>
                    <el-table-column :label="lang.qty" width="120px" >
                      <template slot-scope="props">
                        <el-input type="number" min="0" v-model="tempQty[props.$index].qty" @change="handleChangeqty"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column :label="lang.action" width="50px" >
                      <template slot-scope="props">
                        <el-button type="text" style="color: #FF0000" @click="handleRemove(props.$index)">
                          <svg-icon icon-class="trash" stroke="#FF0000"></svg-icon>
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </el-card>

          <el-card v-if="fresh.product_barcode.length" class="box-card">
            <div slot="header">
              <el-row :gutter="10">
                <el-col :md="12">
                  <h4>{{ lang.setting_barcode_appearance }}</h4>
                </el-col>
              </el-row>
            </div>

            <div class="card-body">
              <el-form v-model="data" label-position="top">
                <el-row :gutter="10">
                  <el-col :md="6">
                    <el-form-item :label="lang.barcode_height">
                      <el-input type="number" v-model="data.barcodesetting.height" placeholder="default: 33">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6">
                    <el-form-item :label="lang.barcode_width">
                      <el-input type="number" v-model="data.barcodesetting.width" placeholder="default: 1">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6">
                    <el-form-item :label="lang.barcode_type">
                      <el-select v-model="data.barcodesetting.type" placeholder="Select">
                        <el-option
                          v-for="item in barcodeType"
                          :key="item"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6">
                    <el-form-item :label="lang.paper_type">
                      <el-select v-model="data.barcodesetting.paper" placeholder="Select">
                        <el-option
                          v-for="item in paperType"
                          :key="item"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <div class="flex-container flex-container--wrap">
                <el-checkbox v-model="barcodeSetting.hidesku">{{ lang.hide_product_sku }}</el-checkbox>
                <el-checkbox v-model="barcodeSetting.hide_product_name">{{ lang.hide_product_name }}</el-checkbox>
                <el-checkbox v-model="barcodeSetting.hide_product_price">{{ lang.hide_product_price }}</el-checkbox>
                <el-checkbox v-model="barcodeSetting.sku_on_top">{{ lang.sku_on_top }}</el-checkbox><br>
                <el-checkbox v-model="barcodeSetting.name_on_bottom">{{ lang.name_on_bottom }}</el-checkbox>
              </div>
            </div>
          </el-card>

          <el-card v-if="fresh.product_barcode.length" class="box-card">
            <div slot="header">
              <el-row :gutter="10">
                <el-col :md="7">
                  <h4>{{ lang.use_custom_barcode }}</h4>
                </el-col>
                <el-col :md="12">
                  <el-switch
                    v-model="data.barcodesetting.usecustombarcode"
                    active-value="on"
                    inactive-value="off"
                    :active-text="$lang[langId].active"
                    :inactive-text="$lang[langId].inactive"
                    @change="switchChange"
                  />
                </el-col>
              </el-row>
            </div>

            <div v-if="data.barcodesetting.usecustombarcode === 'on'" class="card-body">
              <el-form v-model="data" label-position="top">
                <el-row :gutter="10">
                  <el-col :md="6">
                    <el-form-item :label="lang.box_height">
                      <el-input type="number" v-model="data.barcodesetting.box_height">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6">
                    <el-form-item :label="lang.box_width">
                      <el-input type="number" v-model="data.barcodesetting.box_width">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6">
                    <el-form-item :label="lang.box_margin">
                      <el-input type="number" v-model="data.barcodesetting.box_margin">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6">
                    <el-form-item :label="lang.box_padding">
                      <el-input type="number" v-model="data.barcodesetting.box_padding">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6">
                    <el-form-item :label="lang.box_margin_top">
                      <el-input type="number" v-model="data.barcodesetting.box_margin_top">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6">
                    <el-form-item :label="lang.box_margin_bottom">
                      <el-input type="number" v-model="data.barcodesetting.box_margin_bottom">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6">
                    <el-form-item :label="lang.box_margin_left">
                      <el-input type="number" v-model="data.barcodesetting.box_margin_left">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6">
                    <el-form-item :label="lang.box_margin_right">
                      <el-input type="number" v-model="data.barcodesetting.box_margin_right">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6">
                    <el-form-item :label="lang.paper_width">
                      <el-input type="number" v-model="data.barcodesetting.paper_width">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6">
                    <el-form-item :label="lang.box_row">
                      <el-input type="number" v-model="data.barcodesetting.box_row">
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <p class="input-desc size-12 oldgrey">
                {{ lang.barcode_setting_desc }}
              </p>
            </div>
            <el-button type="primary" @click="save">{{ lang.save }}</el-button>
          </el-card>

          <el-card v-if="fresh.product_barcode.length">
            <div slot="header">
              <h4>{{ lang.print_preview }}</h4>
            </div>
            <div>
              <span>{{ lang.print_barcode_desc }}</span>
            </div>
          </el-card>

          <el-card
            v-if="cardPreview"
            style="overflow: auto">
            <data-print
              :data="data"
              :columns-barcode="columnsBarcode"
              :custom-setting="customSetting"
              :barcode-setting="barcodeSetting"
              :barcode-data="barcodeData"
            />
          </el-card>

          <div v-if="cardPreview" style="margin-top: 15px">
            <el-button @click="print" type="primary">Print</el-button>
          </div>
        </el-col>
      </el-row>
    </section>

    <data-print
      style="display: none"
      :data="data"
      :columns-barcode="columnsBarcode"
      :custom-setting="customSetting"
      :barcode-setting="barcodeSetting"
      :barcode-data="barcodeData"
    />
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import SelectMultipleItems from 'src/components/modules/SelectMultipleItems'
import DataPrint from './dataPrint'
const apiEndPoint = 'barcode-setting'
export default {
  components: {
    SelectMultipleItems,
    DataPrint
  },
  data() {
    return {
      loading: true,
      disabledSave: false,
      disabledForm: false,
      isEditingCustomerTypes: false,
      searchingProduct: false,
      searchingProductCombo: false,
      searchResultProduct: [],
      searchResultProductCombo: [],
      tmp: {
        product: [],
        product_combo: []
      },
      fresh: {
        product: [],
        product_combo: [],
        product_barcode: [],
        qty: 1
      },
      data: {
        barcodesetting: {
          height: 0,
          usecustombarcode: 'off'
        }
      },
      barcodeType: ['C93', 'C39', 'C39+', 'C93E', 'C128'],
      paperType: ['tj108', 'Tom & Jerry 107', 'Tom & Jerry 108'],
      barcodeData: [],
      html: '',
      classBarcode: '',
      styleBarcode: '',
      barcodeSetting: {
        hidesku: false,
        hide_product_name: false,
        hide_product_price: false,
        sku_on_top: false,
        name_on_bottom: false
      },
      customSetting: {
        style: '',
        paper_width: '',
        box_row: 3
      },
      cardPreview: false,
      tempQty: [],
      showTableProduct: false,
      showAddProduct: true
    }
  },
  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    token() {
      return this.$store.state.user.token
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    columnsBarcode () {
      let columns = []
      if (this.data.barcodesetting.usecustombarcode !== 'off') {
        let dim = Math.ceil(this.barcodeData.length / this.customSetting.box_row)
        let mid = this.customSetting.box_row
        console.log('mid', Math.ceil(this.barcodeData.length / this.customSetting.box_row))
        for (let col = 0; col < dim; col++) {
          columns.push(this.barcodeData.slice(col * mid, col * mid + mid))
        }
      }
      return columns
    }
  },
  watch: {
    '$store.getters.selectedStore': function() {
      this.getData()
    },
    data: {
      handler(data) {
        if (data.with_lpoint === 1) {
          this.disabledForm = false
        } else {
          this.disabledForm = true
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    getData() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint),
        headers: headers
      }).then(response => {
        if (response.data.data.hasbarcodesetting) {
          this.data = response.data.data
          if (this.data.barcodesetting.name_on_bottom === 'on') {
          this.barcodeSetting.name_on_bottom = true
          } 
          else {
            this.barcodeSetting.name_on_bottom = false
          }
          if (this.data.barcodesetting.sku_on_top === 'on') {
            this.barcodeSetting.sku_on_top = true
          } 
          else {
            this.barcodeSetting.sku_on_top = false
          }
          if (this.data.barcodesetting.hide_product_name === 'on') {
            this.barcodeSetting.hide_product_name = true
          } 
          else {
            this.barcodeSetting.hide_product_name = false
          }
          if (this.data.barcodesetting.hide_product_price === 'on') {
            this.barcodeSetting.hide_product_price = true
          } 
          else {
            this.barcodeSetting.hide_product_price = false
          }
          if (this.data.barcodesetting.hidesku === 'on') {
            this.barcodeSetting.hidesku = true
          } 
          else {
            this.barcodeSetting.hidesku = false
          }
        }
        this.loading = false
      }).catch(error => {
        this.loading = false
      })
    },
    save() {
      this.loading = true
      this.disabledSave = true
      let newdata = this.data.barcodesetting
      let product = []
      if (this.fresh.product_barcode.length > 0) {
        this.fresh.product_barcode.map((i, idx) => {
          product.push({
            product_id: i.product_id,
            sku: i.sku,
            name: !i.product_name && !i.variant_name ? i.name : i.variant_name !== null ? i.product_name + ' - ' + i.variant_name : i.product_name,
            sell_price_pos: i.sell_price_pos,
            qty: this.tempQty[idx].qty
          })
        })
      }
      // if (this.fresh.product_combo.length > 0) {
      //   this.fresh.product_combo.map(i => {
      //     product.push({
      //       product_id: i.id,
      //       sku: i.sku,
      //       name: i.name,
      //       sell_price_pos: i.sell_price_pos,
      //       qty: this.fresh.qty
      //     })
      //   })
      // }
      newdata.products = product
      if (this.barcodeSetting.name_on_bottom === true) {
          newdata.name_on_bottom = 'on'
        } else {
          newdata.name_on_bottom = 'off'
        }
        if (this.barcodeSetting.sku_on_top === true) {
          newdata.sku_on_top = 'on'
        } else {
          newdata.sku_on_top = 'off'
        }
        if (this.barcodeSetting.hide_product_name === true) {
          newdata.hide_product_name = 'on'
        } else {
          newdata.hide_product_name = 'off'
        }
        if (this.barcodeSetting.hide_product_price === true) {
          newdata.hide_product_price = 'on'
        } else {
          newdata.hide_product_price = 'off'
        }
        if (this.barcodeSetting.hidesku === true) {
          newdata.hidesku = 'on'
        } else {
          newdata.hidesku = 'off'
        }
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'barcode'),
        headers: headers,
        data: newdata
      }).then(response => {
        // this.data = response.data.data
        // this.fresh.product = []
        // this.fresh.product_combo = []
        this.disabledSave = false
        this.barcodeData = response.data.data
        this.barcodeData.map(i => {
          var ac = new DOMParser().parseFromString(i.barcode, "text/html")
          var html = ac.getElementsByTagName('img')
          i.url_img = html[0].src
        })
        this.getSizeBarcode()
        this.cardPreview = true
        this.loading = false
        this.$message({
          type: 'success',
          message: 'Saved'
        })
      }).catch(error => {
        this.disabledSave = false
        this.fresh.product = []
        this.fresh.product_combo = []
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    handleGetProduct(item) {
      item.qty = this.fresh.qty
      this.fresh.product.push(item)
      // this.fresh.product_barcode.push(item)
      // this.tempQty.push({qty: this.fresh.qty})
    },
    handleRemoveProduct(key) {
      this.fresh.product.splice(key, 1)
    },
    handleRemove(key) {
      this.fresh.product_barcode.splice(key, 1)
      this.tempQty.splice(key, 1)
    },
    handleGetProductCombo(item) {
      item.qty = this.fresh.qty
      this.fresh.product_combo.push(item)
      // this.fresh.product_barcode.push(item)
      // this.tempQty.push({qty: this.fresh.qty})
    },
    handleRemoveProductCombo(key) {
      this.fresh.product_combo.splice(key, 1)
    },
    getSizeBarcode() {
      if (this.data.barcodesetting.usecustombarcode === 'off') {
        if (this.data.barcodesetting.paper === 'tj108') {
          this.classBarcode = 'barcode-tj108'
          this.styleBarcode = 'width: 815px'
        }
        if (this.data.barcodesetting.paper === 'tj107') {
          this.classBarcode = 'barcode-tj107'
          this.styleBarcode = 'width: 650px'
        }
        if (this.data.barcodesetting.paper === 'Tom & Jerry 107') {
          this.classBarcode = 'barcode-tj107'
          this.styleBarcode = 'width: 650px'
        }
        if (this.data.barcodesetting.paper === 'Tom & Jerry 108') {
          this.classBarcode = 'barcode-tj108'
          this.styleBarcode = 'width: 815px'
        }
      } 
      else {
        this.customSetting.style = 'border: 1px solid #ccc; background: rgb(255, 255, 255);border-radius: 5px;width: ' + this.data.barcodesetting.box_width + 'px;height: '+ 
        this.data.barcodesetting.box_height + 'px;padding: ' + this.data.barcodesetting.box_padding + 'px;text-align: center;margin: ' + 
        this.data.barcodesetting.box_margin + 'px;margin-bottom: ' + this.data.barcodesetting.box_margin_bottom + 'px;margin-left: ' + 
        this.data.barcodesetting.box_margin_left + 'px;margin-right: ' + this.data.barcodesetting.box_margin_right + 'px;margin-top: ' + 
        this.data.barcodesetting.box_margin_top + 'px'
        this.customSetting.paper_width = 'width: ' + this.data.barcodesetting.paper_width + 'px'
        this.customSetting.box_row = parseInt(this.data.barcodesetting.box_row)
      }
    },
    switchChange() {
      this.cardPreview = false
    },
    print() {
      // window.print('printMe')
      // get DIV content as clone
      var divContents = $("#printable").clone()
      //detatch DOM body
      var body = $("body").detach()
      //create new body to hold just the DIV contents
      document.body = document.createElement("body")
      //add DIV content to body
      divContents.appendTo($("body"))
      //print body
      window.print()
      //remove body with DIV content
      $("html body").remove()
      //attach original body
      body.appendTo($("html"))
    },
    handleChangeqty (data) {
      console.log('da', data)
    },
    handleApply () {
      if (this.fresh.product.length !== 0) {
        this.fresh.product.map(i => {
          this.fresh.product_barcode.push(i)
          this.tempQty.push({
            qty: this.fresh.qty
          })
        })
      }
      if (this.fresh.product_combo.length !== 0) {
        this.fresh.product_combo.map(i => {
          this.fresh.product_barcode.push(i)
          this.tempQty.push({
            qty: this.fresh.qty
          })
        })
      }
      this.fresh.product = []
      this.fresh.product_combo = []
      this.showTableProduct = true
      this.showAddProduct = false
    }
  },
  mounted() {
    this.getData()
  }
}
</script>