<template>
  <div v-show="show" class="innerpage-fullscreen">
    <div class="innerpage-fullscreen--header">
      <el-button
        class="innerpage-fullscreen--back"
        type="text"
        @click="handleClose">
        <svg-icon icon-class="arrow-left" />
      </el-button>
      <h4 class="innerpage-fullscreen--title">{{ dataMaster.ojek_online_food_name }}</h4>
    </div>

    <div
      class="innerpage-fullscreen--body">
      <div class="flex-container flex-container--content-space-between mb-16">
        <div class="full-width font-24 font-semi-bold">
          <el-dropdown
            trigger="click"
            @command="handleDropdownSection">
            <span class="el-dropdown-link font-18 color-info">
              <svg-icon icon-class="more-vertical"></svg-icon>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="copy">
                Copy product dari Food delivery lain
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          Atur Product
        </div>
        <div class="full-width text-right">
          <el-button style="margin-right: -15px" @click="handleShowPreset">
            <i v-if="dataMaster.preset_marking_type === 1" class="el-icon-plus" />
            <i v-if="dataMaster.preset_marking_type === 2" class="el-icon-minus" />
            <span v-if="dataMaster.preset_marking_amount_type === 1">{{ dataMaster.fpreset_marking_price }}</span>
            <span v-if="dataMaster.preset_marking_amount_type === 2 || dataMaster.preset_marking_amount_type === 3">{{ dataMaster.preset_marking_percentage }} %</span>
          </el-button>
          <el-button
            type="success"
            @click="handleAddProduct">
            <i class="el-icon-plus" />
            {{ lang.add }}
          </el-button>
        </div>
      </div>

        <div class="flex-container">
          <div v-if="dataChecked.length > 0" style="width: 85%">
            <el-button class="color-primary--bg color-white" @click="handleBulkEdit">Ubah Harga {{ dataMaster.ojek_online_food_name }} ({{ dataChecked.length }})</el-button>
            <el-button class="btn-danger" @click="handleBulkDelete">{{ rootLang.delete }} ({{ dataChecked.length }})</el-button>
          </div>
          <div class="full-width">
            <el-input class="input-search" clearable :placeholder="lang.search" prefix-icon="el-icon-search" v-model="searchProduct" @change="getProductSearch" size="small"></el-input>
          </div>
        </div>
      
        <template v-if="!dataProduct.length">
          <div class="mt-24 color-info--bg p-16">
            <div class="flex-container">
              <div class="full-width font-18">
                <span>{{ lang.no }} {{ rootLang.active }}</span>
              </div>
              <!-- <el-switch
                v-model="dataMaster.is_active_marking_item"
                :active-value="1"
                :inactive-value="0"
                class="mr-8">
              </el-switch> -->
              <popover-confirmation
                :tokopedia="true"
                :data="dataMaster.is_active_marking_item" 
                :message="messageStatus"
                :visible="visibleChangeStatus" 
                @cancel="visibleChangeStatus = false"
                @confirm="handleChangeStatus"/>
            </div>
            <div v-loading="loadingData" class="no-data-wrapper no-data-settle">
              <img src="/static/img/no-data-partner.svg" class="no-data-image">
              <div class="font-18" style="max-width: 360px; width: 100%">
                <span>Atur produk mana saja yang ingin Anda berikan harga khusus GoFood</span>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="like-table-wrapper mt-24 border border--table-border">
            <div class="like-table-wrapper--item">
              <div class="full-width font-18">
                <span v-if="dataMaster.is_active_marking_item === 0">{{ lang.no }} {{ rootLang.active }}</span>
                <span v-if="dataMaster.is_active_marking_item === 1">{{ rootLang.active }}</span>
              </div>
              <!-- <el-switch
                v-model="dataMaster.is_active_marking_item"
                :active-value="1"
                :inactive-value="0"
                class="mr-8"
                @change="updateMasterPreset">
              </el-switch> -->
              <popover-confirmation
                :tokopedia="true"
                :data="dataMaster.is_active_marking_item" 
                :message="messageStatus"
                :visible="visibleChangeStatus" 
                @cancel="visibleChangeStatus = false"
                @confirm="handleChangeStatus"/>
            </div>
          </div>
          <div class="like-table-wrapper border border--table-border">
            <div class="like-table-wrapper--item">
              <div class="mr-8 full-width flex-container" >
                <div class="mr-8">
                  <el-checkbox v-model="checkAll" @change="handleCheckAll"></el-checkbox>
                </div>
                <div class="font-bold font-14">
                  {{ lang.product_name }}
                </div>
              </div>
              <div class="font-bold font-14" style="width: 50%">
                {{ lang.category }}
              </div>
              <div class="font-bold font-14 text-right" style="width: 40%" >
                Harga Normal
              </div>
              <div class="font-bold font-14 text-right" style="width: 40%">
                Harga {{ dataMaster.ojek_online_food_name }}
              </div>
              <div style="width: 10%"></div>
            </div>
          </div>
          <!-- <perfect-scrollbar class="scrollBulkPair"> -->
          <div v-loading="loadingData" class="like-table-wrapper border border--table-border" >
            <div v-for="(item) in dataProduct" 
              :key="item.id" class="like-table-wrapper--item pointer">
              <div class="flex-container full-width">
                <div class="mr-8 flex-container full-width" >
                  <div class="mr-8"><el-checkbox v-model="item.checked" @change="handleCheck(item)"></el-checkbox></div>
                  <div class="flex-container">
                    <el-avatar
                      :src="item.item_photo_md"
                      :size="32"
                      shape="square"
                    />
                  </div>
                  <div class="font-bold font-14 ml-8 word-break">
                    {{ item.item_name }}
                  </div>
                </div>
                <div class="font-14" style="width: 50%">
                  {{ item.item_category_name }}
                </div>
                <div class="text-right" style="width: 40%">{{ item.fitem_sell_price }}</div>
                <div class="text-right" style="width: 40%">{{ item.fitem_sell_price_with_marking }}</div>
                <div class="text-right" style="width: 10%" @click="handleEdit(item)">
                  <div class="container-icon">
                    <svg-icon icon-class="edit-2" class="color-primary"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- </perfect-scrollbar> -->
          <div v-if="meta.totalProduct > 0" class="border border--grey-border table-handler-bottom text-center">
            <el-pagination
              :total="meta.totalProduct"
              :page-sizes="[1, 15, 50, 100]"
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
    </div>

    <el-dialog
    :visible.sync="showPreset"
    :show-close="false"
    append-to-body >
    <div slot="title" class="flex-container">
      <div class="full-width font-24">
        Preset Harga {{ dataMaster.ojek_online_food_name }}
        <!-- <close-esc @close="$emit('cancel')" /> -->
      </div>
      <div class="full-width text-right">
        <!-- <close-esc :hideEsc="true" @close="handleClose" /> -->
        <el-button
          type="info"
          @click="handleClosePreset">
          {{ lang.cancel }}
        </el-button>
        <el-button type="success" @click="updateMasterPreset">
          {{ lang.save }}
        </el-button>
      </div>
    </div>
    <div>
      <div class="color-info--bg radius-10 flex-container p-8 mb-24">
        <div class="container-icon">
          <svg-icon icon-class="information-circle" class="color-info" />
        </div>
        <div>{{ rootLang.applied_when_add_product }}</div>
      </div>
      <div v-if="dataMaster.ojek_online_food_id === 1 && (stageLevel === 'sit' || stageLevel === 'dev')" class="full-width mb-24">
        <el-radio-group  v-model="priceTypePreset" class="flex-container" @change="handleChangePriceTypePreset">
          <el-radio-button io-button v-for="data in priceoption" :key="data.id" :label="data.id" class="lpoint-type">{{ data.name }}</el-radio-button>
        </el-radio-group>
      </div>
      <div class="full-width mb-24">
        <el-radio-group v-model="dataMaster.preset_marking_type" class="flex-container">
          <el-radio-button io-button v-for="data in markupoption" :key="data.id" :label="data.id" class="lpoint-type">{{ data.name }}</el-radio-button>
        </el-radio-group>
      </div>
      <div class="full-width flex-container mb-24">
        <input-money v-if="markupType === 1" class="switch-discount--money border border--grey-border" v-model="markupValue" />
        <el-input
        v-if="markupType === 2 || markupType === 3"
        v-model="markupValue"
        type="number"
        class="switch-discount--money border border--grey-border" />
        <div style="width: 40%">
          <el-radio-group v-model="markupType" class="flex-container" @change="resetValue">
            <template v-if="dataMaster.ojek_online_food_id === 1 && (stageLevel === 'dev' || stageLevel === 'sit')">
              <template v-if="priceTypePreset === 1">
                <el-radio-button class="lpoint-type" :label="1">IDR</el-radio-button>
                <el-radio-button class="lpoint-type" :label="2">%</el-radio-button>
              </template>
              <template v-else>
                <el-radio-button class="lpoint-type" :label="3">%</el-radio-button>
              </template>
            </template>
            <template v-else>
              <el-radio-button class="lpoint-type" :label="1">IDR</el-radio-button>
              <el-radio-button class="lpoint-type" :label="2">%</el-radio-button>
            </template>
          </el-radio-group>
        </div>
      </div>
      <div v-if="dataMaster.preset_marking_type === 2" class="font-12" style="margin-top: -16px">Harga jual hasil markdown dibatasi minimal IDR 0</div>
      <!-- <el-input
        v-model="markupValue"
        type="number"
        class="switch-discount border border--grey-border"
        @input="validateNoMinus(false)">
        <template slot="append">
          <el-radio-group v-model="markupType" class="flex-container" @change="resetValue">
            <el-radio-button class="lpoint-type" :label="1">
              IDR
            </el-radio-button>
            <el-radio-button class="lpoint-type" :label="2">
              %
            </el-radio-button>
          </el-radio-group>
        </template>
      </el-input> -->
    </div>
    </el-dialog>

    <el-dialog
      :visible.sync="visibleEdit"
      :show-close="false"
      append-to-body >
      <div slot="title" class="flex-container">
        <div class="full-width font-24">
          Harga {{ dataMaster.ojek_online_food_name }}
          <!-- <close-esc @close="$emit('cancel')" /> -->
        </div>
        <div class="full-width text-right">
          <!-- <close-esc :hideEsc="true" @close="handleClose" /> -->
          <el-button
            type="info"
            @click="handleCloseEdit">
            {{ lang.cancel }}
          </el-button>
          <el-button type="success" :loading="loadingUpdate" @click="updateSingleProduct">
            {{ lang.save }}
          </el-button>
        </div>
      </div>
      <div>
        <div v-if="dataMaster.ojek_online_food_id === 1 && (stageLevel === 'sit' || stageLevel === 'dev')" class="full-width mb-24">
          <el-radio-group  v-model="priceType" class="flex-container" @change="handleChangePriceType">
            <el-radio-button io-button v-for="data in priceoption" :key="data.id" :label="data.id" class="lpoint-type">{{ data.name }}</el-radio-button>
          </el-radio-group>
        </div>
        <div v-if="!isBulk" class="color-gofood--bg radius-10 p-8 mb-24">
          <div class="flex-container">
            <el-avatar
              :src="tempData.item_photo_md"
              :size="32"
            />
            <div class="font-bold font-14 ml-8 word-break">
              {{ tempData.item_name }}
            </div>
          </div>
          <div class="flex-container px-24 py-20">
            <div class="full-width">
              <span class="font-12">Harga Normal</span>
              <div class="font-16 font-bold">{{ tempData.fitem_sell_price }}</div>
            </div>
            <div class="full-width flex-container">
              <el-avatar
                :src="dataMaster.ojek_online_food_id === 1? '/static/img/ojek-online/gofood.png' : dataMaster.ojek_online_food_id === 2? '/static/img/ojek-online/grabfood.png' : '/static/img/ojek-online/shopeefood.png'"
                :size="32"
              />
              <div class="ml-8">
                <span class="font-12">Harga GoFood</span>
                <div class="font-16 font-bold">{{ formatter(computedPreviewPrice, currency = true, simbol = false) }}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="color-grey--bg flex-container radius-10 p-8 mb-24">
          <div class="container-icon color-grey--placeholder">
            <svg-icon icon-class="information-circle" />
          </div>
          <div>{{ dataChecked.length }} {{ rootLang.product_selected }}</div>
        </div>
        <div class="full-width mb-24">
          <el-radio-group v-if="!isBulk" v-model="tempData.marking_type" class="flex-container">
            <el-radio-button io-button v-for="data in markupoption" :key="data.id" :label="data.id" class="lpoint-type">{{ data.name }}</el-radio-button>
          </el-radio-group>
          <el-radio-group v-else v-model="tempDataBulk.marking_type" class="flex-container">
            <el-radio-button io-button v-for="data in markupoption" :key="data.id" :label="data.id" class="lpoint-type">{{ data.name }}</el-radio-button>
          </el-radio-group>
        </div>
        <div class="full-width flex-container mb-24">
          <template v-if="!isBulk">
            <input-money v-if="tempData.marking_amount_type === 1" class="switch-discount--money border border--grey-border" v-model="tempValue" />
            <el-input
              v-if="tempData.marking_amount_type === 2 || tempData.marking_amount_type === 3"
              v-model="tempValue"
              type="number"
              class="switch-discount--money border border--grey-border" />
            <div style="width: 40%">
              <el-radio-group v-model="tempData.marking_amount_type" class="flex-container" @change="resetValueEdit">
                <template v-if="tempData.ojek_online_food_id === 1 && (stageLevel === 'dev' || stageLevel === 'sit')">
                  <template v-if="priceType === 1">
                    <el-radio-button class="lpoint-type" :label="1">IDR</el-radio-button>
                    <el-radio-button class="lpoint-type" :label="2">%</el-radio-button>
                  </template>
                  <template v-else>
                    <el-radio-button class="lpoint-type" :label="3">%</el-radio-button>
                  </template>
                </template>
                <template v-else>
                  <el-radio-button class="lpoint-type" :label="1">IDR</el-radio-button>
                  <el-radio-button class="lpoint-type" :label="2">%</el-radio-button>
                </template>
              </el-radio-group>
            </div>
          </template>
          <template v-else>
            <input-money v-if="tempDataBulk.marking_amount_type === 1" class="switch-discount--money border border--grey-border" v-model="tempValue" />
            <el-input
              v-if="tempDataBulk.marking_amount_type === 2 || tempData.marking_amount_type === 3"
              v-model="tempValue"
              type="number"
              class="switch-discount--money border border--grey-border" />
            <div style="width: 40%">
              <el-radio-group v-model="tempDataBulk.marking_amount_type" class="flex-container" @change="resetValueEdit">
                <template v-if="tempDataBulk.ojek_online_food_id === 1 && (stageLevel === 'dev' || stageLevel === 'sit')">
                  <template v-if="priceType === 1">
                    <el-radio-button class="lpoint-type" :label="1">IDR</el-radio-button>
                    <el-radio-button class="lpoint-type" :label="2">%</el-radio-button>
                  </template>
                  <template v-else>
                    <el-radio-button class="lpoint-type" :label="3">%</el-radio-button>
                  </template>
                </template>
                <template v-else>
                  <el-radio-button class="lpoint-type" :label="1">IDR</el-radio-button>
                  <el-radio-button class="lpoint-type" :label="2">%</el-radio-button>
                </template>
              </el-radio-group>
            </div>
          </template>
        </div>
        <div v-if="computedShowNotif" class="font-12" style="margin-top: -16px">Harga jual hasil markdown dibatasi minimal IDR 0</div>
        <!-- <el-input
          v-model="tempValue"
          type="number"
          class="switch-discount border border--grey-border"
          @input="validateNoMinus(true)">
          <template v-if="!isBulk" slot="append">
            <el-radio-group v-model="tempData.marking_amount_type" class="flex-container" @change="resetValueEdit">
              <el-radio-button class="lpoint-type" :label="1">
                IDR
              </el-radio-button>
              <el-radio-button class="lpoint-type" :label="2">
                %
              </el-radio-button>
            </el-radio-group>
          </template>
          <template v-else slot="append">
            <el-radio-group v-model="tempDataBulk.marking_amount_type" class="flex-container" @change="resetValueEdit">
              <el-radio-button class="lpoint-type" :label="1">
                IDR
              </el-radio-button>
              <el-radio-button class="lpoint-type" :label="2">
                %
              </el-radio-button>
            </el-radio-group>
          </template>
        </el-input> -->
        <el-button
          @click="dialogDeleteProducts = true"
          class="btn-block mt-24 color-danger"
          icon="el-icon-delete"
        >
        {{ rootLang.delete }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogDeleteProducts"
      :show-close="false"
      append-to-body
      custom-class="dialog-card"
      width="536px">
      <div class="text-center">
        <span>{{ rootLang.are_you_want_remove }} 
          <span v-if="isBulk" class="font-bold">{{ dataChecked.length }} {{ lang.product }} ?</span>
          <span v-else class="font-bold">{{ lang.product }} {{ tempData.item_name }} ?</span>
        </span>
        <el-button class="btn-block btn-danger mt-24" :loading="loadingDelete" @click="deleteProduct">{{ $lang[langId].delete }}</el-button>
        <el-button class="btn-block btn-info mt-8" @click="handleCancelDelete">{{ lang.cancel }}</el-button>
      </div>
    </el-dialog>

    <dialog-add-product
      ref="dialogAddProduct"
      :show="showAdd"
      :data-master="dataMaster"
      @addproduct="refreshData"
      @close="showAdd = false" />

    <dialog-copy-product 
      ref="dialogCopyProduct"
      :show="showCopyProduct"
      :selected-master="dataMaster"
      :data-master="allMasterData"
      :loading-copy="loadingCopy"
      @close="showCopyProduct = false"
      @copy="handleCopyProduct"
      />
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import InputMoney from '@/components/InputMoneyV2'
import dialogAddProduct from './dialogAddProduct.vue'
import dialogCopyProduct from './dialogCopyProduct.vue'
import PopoverConfirmation from '@/components/PopoverConfirmation.vue'
import { updateProduct, deleteProduct, fetchMasterOjekonline, copyProduct } from '@/api/ojekonline'
export default {
  name: 'ManagePrice',
  mixins: [basicComputedMixin],
  components: {
    dialogAddProduct,
    dialogCopyProduct,
    PopoverConfirmation,
    InputMoney
  },
  watch: {
    // dataMaster: {
    //   handler(data) {
    //     if (data.preset_value) {
    //       this.markupValue = data.preset_value
    //     }
    //     if (data.preset_marking_amount_type === 1) {
    //       this.markupType = data.preset_marking_amount_type
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // },
  },
  computed: {
    messageStatus () {
      let ms1 = 'Non aktifkan Pengaturan untuk harga ' + this.dataMaster.ojek_online_food_name
      let ms2 = 'Aktifkan Pengaturan untuk harga ' + this.dataMaster.ojek_online_food_name
      let data = this.dataMaster.is_active_marking_item === 1? ms1 : ms2
      return data
    },
    computedShowNotif () {
      let notif = false
      if (parseInt(this.tempData.item_sell_price_with_marking) <= 0) {
        notif = true
      } else { notif = false }
      return notif
    },

    computedPreviewPrice () {
      let price = 0
      let sellPrice = parseInt(this.tempData.item_sell_price)
      if (this.tempData.marking_type === 1) {
        if (this.tempData.marking_amount_type === 1) {
          price = this.tempValue + sellPrice
        } else if (this.tempData.marking_amount_type === 2) {
          let pricePercent = (this.tempValue/100) * sellPrice
          price = sellPrice + pricePercent
        } else if (this.tempData.marking_amount_type === 3) {
          let pricePercent = (100 - this.tempValue) /100
          price = sellPrice / pricePercent
        }
      }

      if (this.tempData.marking_type === 2) {
        if (this.tempData.marking_amount_type === 1) {
          price = sellPrice - this.tempValue
        } else if (this.tempData.marking_amount_type === 2) {
          let pricePercent = (this.tempValue/100) * sellPrice
          price = sellPrice - pricePercent
        } else if (this.tempData.marking_amount_type === 3) {
          let temp = this.tempValue > 0 ? - this.tempValue : this.tempValue
          let pricePercent = (100 - temp) /100
          price = sellPrice / pricePercent
        }
      }

      return price
    }
  },
  data() {
    return {
      showPreset: false,
      markupData: 0,
      markupValue: 0,
      discount_type: '',
      markupoption: [
        {
          id: 1,
          name: 'Markup Harga',
        },
        {
          id: 2,
          name: 'Markdown Harga',
        }
      ],
      priceoption: [
        {
          id: 1,
          name: 'Harga Normal',
        },
        {
          id: 2,
          name: 'Harga Ojek online',
        }
      ],
      markupType: 0,
      showAdd: false,
      tempData: {},
      tempValue: 0,
      visibleEdit: false,
      loadingUpdate: false,
      dataChecked: [],
      tempDataBulk: {},
      isBulk: false,
      dialogDeleteProducts: false,
      loadingDelete: false,
      searchProduct: '',
      showCopyProduct: false,
      allMasterData: [],
      loadingCopy: false,
      visibleChangeStatus: false,
      priceType: 1,
      priceTypePreset: 1
    }
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
    dataMaster: {
      type: Object,
      default: {}
    },
    loadingData: {
      type: Boolean,
      default: false
    },
    meta: {
      type: Object,
      default: {}
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    handleEdit (data) {
      this.tempData = { ...data}
      this.tempValue = this.tempData.marking_amount_type === 1? this.tempData.marking_price : parseInt(this.tempData.marking_percentage)
      if (this.tempData.marking_amount_type === 3) {
        this.priceType = 2
      }
      this.visibleEdit = true
    },
    handleBulkEdit () {
      this.isBulk = true
      this.tempDataBulk = {
        marking_type: this.dataMaster.preset_marking_type,
        marking_amount_type: this.dataMaster.preset_marking_amount_type,
        marking_price: this.dataMaster.preset_marking_price,
        marking_percentage: this.dataMaster.preset_marking_percentage
      }
      this.tempValue = this.tempDataBulk.marking_amount_type === 1? parseInt(this.tempDataBulk.marking_price) : parseInt(this.tempDataBulk.marking_percentage)
      this.visibleEdit = true
    },
    updateMasterPreset () {
      let data = { ...this.dataMaster}
      data.preset_marking_amount_type = this.markupType
      this.markupType === 1? data.preset_marking_price = this.markupValue : data.preset_marking_percentage = this.markupValue
      this.$emit('update', data)
      this.showPreset = false
    },
    validateNoMinus(edit) {
      if (!edit) {
        let data = parseInt(this.markupValue)
        if (this.markupType === 1) {
          if (data < 0) {
            this.markupValue = 1
          } else if (this.markupType !== 2) {
            this.markupValue = data
          }
        }
        if (this.markupType === 2) {
          if (data < 0) {
            this.markupValue = 1
          } else if (data > 100) {
            this.markupValue = 100
          } else if (this.markupType !== 1) {
            this.markupValue = data
          }
        }
      }
      if (edit) {
        let data = this.tempValue
        if (this.tempData.marking_amount_type === 1 || this.tempDataBulk.marking_amount_type === 1) {
          if (data < 0) {
            this.tempValue = 1
          } else if (this.this.tempData.marking_amount_type !== 2 || this.tempDataBulk.marking_amount_type !== 2) {
            this.tempValue = data
          }
        }
        if (this.tempData.marking_amount_type === 2 || this.tempDataBulk.marking_amount_type === 2) {
          if (data < 0) {
            this.tempValue = 1
          } else if (data > 100) {
            this.tempValue = 100
          } else if (this.tempData.marking_amount_type !== 1 || this.tempData.marking_amount_type !== 1) {
            this.tempValue = data
          }
        }
      }
    },
    resetValue () {
      if (this.markupType === 1) {
        this.markupValue = parseInt(this.dataMaster.preset_marking_price)
      } else {
        this.markupValue = parseInt(this.dataMaster.preset_marking_percentage)
      }
    },
    resetValueEdit () {
      if (this.tempData.marking_amount_type === 1) {
        this.tempValue = parseInt(this.tempData.marking_price)
      } 
      if (this.tempData.marking_amount_type === 2) {
        this.tempValue = parseInt(this.tempData.marking_percentage)
      }
      console.log('reset', this.$refs.elInput.$el.getElementsByTagName('input')[0])
    },
    updateSingleProduct () {
      this.loadingUpdate = true
      let itemProd = []
      if (this.isBulk) {
        this.dataChecked.map(i => {
          itemProd.push({
            ojek_online_marking_price_item_id: i.id,
            id: i.item_id,
            is_product_combo: i.is_product_combo,
          })
        })
      } else {
        itemProd = [{
          ojek_online_marking_price_item_id: this.tempData.id,
          id: this.tempData.item_id,
          is_product_combo: this.tempData.is_product_combo,
        }]
      }
      let data = {
        ojek_online_food_id: this.dataMaster.ojek_online_food_id,
        marking_price: this.isBulk? this.tempDataBulk.marking_price : this.tempData.marking_price,
        marking_percentage: this.isBulk? this.tempDataBulk.marking_percentage : this.tempData.marking_percentage,
        marking_amount_type: this.isBulk? this.tempDataBulk.marking_amount_type : this.tempData.marking_amount_type,
        marking_type: this.isBulk? this.tempDataBulk.marking_type : this.tempData.marking_type,
        items: []
      }
      data.marking_amount_type === 1? data.marking_price = this.tempValue : data.marking_percentage = this.tempValue
      data.items = [ ...itemProd]
      console.log('marking', this.tempData.marking_type)
      updateProduct(data).then(response => {
        this.refreshData()
        this.loadingUpdate = false
        this.tempData = {}
        this.tempValue = 0
        this.tempDataBulk = {}
        this.isBulk = false
        this.visibleEdit = false
      }).catch(error => {
        this.loadingUpdate = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    deleteProduct () {
      this.loadingDelete = true
      let itemProd = []
      if (this.isBulk) {
        this.dataChecked.map(i => {
          itemProd.push(i.id)
        })
      } else {
        itemProd = [this.tempData.id]
      }
      let data = {
        ojek_online_marking_price_item_id: itemProd
      }
      deleteProduct(data).then(response => {
        this.refreshData()
        this.loadingDelete = false
        this.tempData = {}
        this.tempValue = 0
        this.tempDataBulk = {}
        this.isBulk = false
        this.dataChecked = []
        this.dialogDeleteProducts = false
        this.visibleEdit = false
        this.checkAll = false
      }).catch(error => {
        this.loadingUpdate = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    handleCopyProduct (data) {
      this.loadingCopy = true
      copyProduct(data).then(response => {
        this.refreshData()
        this.$refs.dialogCopyProduct.handleClose()
        this.showCopyProduct = false
        this.loadingCopy = false
        this.$notify({
          type: 'warning',
          // title: error.response.data.error.message,
          message: response.data.message
        })
      }).catch(error => {
        this.loadingCopy = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    handleCloseEdit () {
      this.visibleEdit = false
      this.tempData = {}
      this.tempValue = 0
      this.tempDataBulk = {}
      this.priceType = 1
      this.isBulk = false
    },
    handleCheck (item) {
      // console.log('aaa')
      const exist = this.dataChecked.some(({item_id}) => item_id === item.item_id)
      if (exist) {
        this.dataChecked.map((i, idx) => {
          if (i.item_id === item.item_id) {
            this.dataChecked.splice(idx, 1)
          }
        })
      } else {
        if (this.dataChecked.length < 50) {
          this.dataChecked.push(item)
        } else {
          this.$notify({
            type: 'warning',
            message: this.rootLang.max_selected_product + '50'
          })
        }
      }
    },
    handleCheckAll (arg) {
      if (arg) {
        this.dataChecked = []
        this.dataProduct.map((i, idx) => {
          i.checked = true
          this.dataChecked.push(i)
        })
        // this.checkAll = this.dataChecked.length > 50 ? true : false
      } else {
        this.dataChecked = []
        this.dataProduct.map((i, idx) => {
          i.checked = false
        })
        // this.checkAll = false
      }
    },
    handleBulkDelete () {
      this.isBulk = true
      this.dialogDeleteProducts = true
    },
    handleCancelDelete () {
      this.isBulk = false
      this.dialogDeleteProducts = false
    },
    refreshData () {
      this.showAdd = false
      this.$emit('refresh', this.dataMaster)
    },
    getProductSearch () {
      this.$emit('search', this.searchProduct)
    },
    handleChangePage (page) {
      this.$emit('changepage', page)
    },
    handleChangeSizePage (page) {
      this.meta.page_size = page
      this.$emit('changepagesize', page)
    },
    handleDropdownSection(command) {
      if (command === 'copy') {
        this.fetchMaster()
      }
    },
    async fetchMaster() {
      this.loading = true
      await fetchMasterOjekonline().then(response => {
        this.allMasterData = response.data.data
        this.showCopyProduct = true
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.allMasterData = []
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    handleChangeStatus (status) {
      let data = { ...this.dataMaster}
      data.is_active_marking_item = status
      this.$emit('update', data)
    },

    handleAddProduct () {
      this.$refs.dialogAddProduct.loadProduct()
      this.showAdd = true
    },

    handleChangePriceType (data) {
      if (data === 2) { this.tempData.marking_amount_type = 3}
    },

    handleShowPreset () {
      if (this.dataMaster.preset_marking_amount_type === 3) {
        this.priceTypePreset = 2
      }
      this.showPreset = true

      if (this.dataMaster.preset_value) {
        this.markupValue = this.dataMaster.preset_value
      }
      this.markupType = this.dataMaster.preset_marking_amount_type
    },

    handleClosePreset () {
      this.priceTypePreset = 1
      this.markupType = 1
      this.showPreset = false
    },

    handleChangePriceTypePreset (data) {
      if (data === 2) { this.markupType = 3}
      else { this.markupType = this.dataMaster.preset_marking_amount_type }
    },

    formatter (data, currency, simbol) {
      let format = {}
      if (currency) {
        format = {
          style: 'currency',
          currency: 'IDR',
          currencyDisplay: simbol? 'symbol' : 'code'
        }
      }
      var frm = new Intl.NumberFormat('ID',format)
      return frm.format(data)
    },
  }
}
</script>