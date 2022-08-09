<template>
  <div class="flex-container no-flex-sm">
    <div class="wizard-desc">
      <h3>Item</h3>
      <p>Item adalah produk pedagang yang ditampilkan di GrabFood. Anda dapat mengatur produk dalam beberapa kategori pada Ubah Menu nanti. Contoh: Big Mac, Lemon Tea.</p>
      <div class="text-center mb-12">
        <img src="/static/img/service-activation/grabfood-3.png">
      </div>
    </div>
    <div class="wizard-content">
      <el-form
        :model="formData"
        label-position="top">
        <el-form-item
          prop="name"
          label="Item">
          <select-product-grabfood
            :additional-params="additonalParamsSearchProduct"
            :section="setupData.group_menu[0]"
            style="width: 100%;"
            @select="handleSelectProduct"
          />
        </el-form-item>

        <el-form-item
          v-if="formData.menus.length"
          :label="computedLabelItems">
          <div class="like-table-wrapper">
            <div
              v-for="(item, key) in formData.menus"
              :key="item.id"
              class="like-table-wrapper--item">
              <div class="mr-4">
                <el-avatar
                  :src="item.photo_md"
                  shape="square"
                />
              </div>
              <div style="flex-grow: 1;">
                <div class="font-bold font-14">
                  {{ item.name }}
                </div>
                <div class="font-12 color-old-grey">
                  {{ IDRFormat(item.alias_price) }}
                </div>
              </div>
              <el-button
                type="text"
                class="mr-8"
                @click="handleEditItem(item)">
                <svg-icon icon-class="edit-2" />
              </el-button>
              <el-button
                type="text"
                class="color-body"
                @click="handleDeleteItem(key)">
                <svg-icon icon-class="x" />
              </el-button>
            </div>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button
            :disabled="disableDone"
            :loading="loading"
            type="success"
            class="btn-block"
            @click="submit">
            {{ rootLang.done }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- edit item -->
    <!-- <offscreen-edit-section-menu
      :show="visibleEditItem"
      :form-edit="formData.menus[0]"
      @showaddon="visibleOffscreenEditAddon = true"
      @cancel="visibleEditItem = false"
      @delete="deleteOneMenu"
      @save="updateMenu"
    /> -->
    <transition name="el-zoom-in-center">
      <div
        v-if="visibleEditItem"
        class="offscreen-right-sidebar px-null">
        <div class="offscreen-right-sidebar--wrapper">
          <div class="offscreen-right-sidebar--header text-left">
            Ubah Produk
            <close-esc @close="visibleEditItem = false" />
          </div>

          <div
            class="offscreen-right-sidebar--header-content color-blue-vivid--bg">
            <el-image
              :src="formEdit.product_data.photo_md"
              fit="cover"
            />
          </div>

          <div style="overflow-y: scroll; max-height: calc(100vh - 250px); ">
          <el-form
            :model="formEdit"
            label-position="top"
            class="px-12 pt-24 mt-24">
            <div class="flex-container mt-24 color-grey--soft--bg p-10 mb-12">
              <div class="container-icon">
                <svg-icon icon-class="icon-feather-link" stroke="#67C23A"></svg-icon>
              </div>
              <div class="full-width pl-5">
                <div class="color-primary font-bold font-16">{{ formEdit.name }}</div>
                <div v-if="formEdit.detail" class="font-12 color-old-grey">{{ formEdit.detail.fsell_price_pos }}</div>
                <div v-else class="font-12 color-old-grey">{{ formEdit.fsell_price_pos }}</div>
              </div>
              <div class="text-right" style="width: 20%">
                <span v-if="formEdit.detail" class="font-12 color-old-grey">{{ formEdit.detail.stock_qty }} stock</span>
              </div>
            </div>
            <el-form-item v-if="stageLevel === 'dev'" :label="'Komisi Grabfood'" prop="price">
              <input-money-v2 
                v-model="formEdit.product_data.comission" 
                :with-percentage="true" 
                :is-percentage="formEdit.product_data.is_comission_percentage"
                :hide-currency="formEdit.product_data.is_comission_percentage === 0? false : true"
                @changepercent="handleChangePercentage" />
            </el-form-item>

            <el-form-item
              :label="lang.price + ' Grabfood'"
              prop="price">
              <input-money
                :amount.sync="formEdit.alias_price"
              />
            </el-form-item>
            <!-- <el-form-item
              :label="lang.category"
              prop="category_name">
              <el-input
                :disabled="true"
                v-model="formEdit.category.name"
              />
            </el-form-item> -->
            <el-form-item
              :label="lang.description + ' (optional)'"
              prop="category_name">
              <el-input
                v-model="formEdit.description"
              />
            </el-form-item>

              <el-button 
                class="btn-block mb-16"
                :type="'info'"
                @click="handleEditAddon()">
                Add-on {{ countAddon !== 0 ? '( ' + countAddon + ' )' : ''}}
                <svg-icon v-if="formEdit.is_needed_items === 1" icon-class="information-circle" />
              </el-button>

              <div class="flex-container radius-10 color-grey--soft--bg mb-24">
                <div class="container-icon">
                  <i class="el-icon-warning-outline" />
                </div>
                <div>
                  Sediakan pilihan untuk memodifikasi item. Pilih dari daftar Add-On sesuai kebutuhan produk
                </div>
              </div>
          </el-form>

          
        </div>

          <!-- <el-form
            :model="formEdit"
            label-position="top"
            class="px-12 pt-24 mt-24">
            <el-form-item
              :label="lang.name"
              prop="name">
              <el-input
                v-model="formEdit.name"
              />
            </el-form-item>
            <el-form-item
              :lang="lang.price"
              prop="price">
              <input-money
                :amount.sync="formEdit.sell_price_pos"
              />
            </el-form-item>
            <el-form-item
              :lang="lang.category"
              prop="category_name">
              <el-input
                v-model="formEdit.category_name"
              />
            </el-form-item>
            <el-form-item
              :label="lang.description + ' (optional)'"
              prop="category_name">
              <el-input
                v-model="formData.description"
              />
            </el-form-item>

            <el-button 
              class="btn-block mb-16"
              type="info"
              @click="handleEditAddon()">
              Add-on ( {{ formEdit.addon_group ? formEdit.addon_group.length : ''}} )
            </el-button>
          </el-form> -->

          <div class="offscreen-right-sidebar--footer">
            <el-button
              type="info"
              class="btn-block mb-8 color-danger"
              icon="el-icon-delete"
              @click="handleDeleteItemFromEdit">
              {{ rootLang.delete }}
            </el-button>

            <el-button
              type="primary"
              class="btn-block"
              @click="handleSaveEditItem">
              {{ lang.save }}
            </el-button>
          </div>
        </div>
      </div>
    </transition>

    <!-- dialog edit addon -->
    <offscreen-edit-addon
      :show="visibleOffscreenEditAddon"
      :form-edit="formEdit"
      :grabfoodData="grabfoodData"
      :setup-item="true"
      @cancel="visibleOffscreenEditAddon = false"
      @save="updateAddon"
      @update="updateAvailable"
    />

    <!-- dialog edit time -->
    <el-dialog
      :visible.sync="visibleDialogEditTime"
      :append-to-body="true"
      :modal-append-to-body="true"
      :show-close="false"
      :close-on-click-modal="false">
      <div slot="title" class="flex-container">
        <h4 class="dialog-title full-width">
          {{ rootLang['label_day_' + formEditTime.day_id] }}
        </h4>
        <div class="btn_save_dialog full-width text-right">
          <el-button type="info" @click="visibleDialogEditTime = false">
            {{ lang.cancel }}
          </el-button>
          <el-button
            type="success"
            @click="handleSaveEditTime">
            {{ lang.save }}
          </el-button>
        </div>
      </div>
      <el-checkbox-group
        v-model="formEditTime.selected_time"
        class="checkbox-group-block checkbox-group-block--leftcheck checkbox-group-block--background">
        <el-checkbox
          v-for="(item, key) in formEditTime.day_ids"
          :key="key"
          :label="key">
          {{ item.start_time }} - {{ item.end_time }}
        </el-checkbox>
      </el-checkbox-group>
    </el-dialog>
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import CloseEsc from '@/components/modules/CloseEsc'
import InputMoney from '@/components/modules/InputMoney'
import InputMoneyV2 from '@/components/InputMoneyV2'

import SelectProductGrabfood from '@/components/SelectProductGrabfood'
import OffscreenEditSectionMenu from './offscreenEditSectionMenu'
import OffscreenEditAddon from './offscreenEditAddon'

import { fetchSingle, fetchVariantSingle } from '@/api/product'

const moment = require('moment')

export default {
  props: {
    setupData: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    grabfoodData: {
      type: Object,
      default: null
    }
  },

  components: {
    CloseEsc,
    InputMoney,
    SelectProductGrabfood,
    OffscreenEditSectionMenu,
    OffscreenEditAddon,
    InputMoneyV2
  },

  mixins: [basicComputedMixin],

  data() {
    return {
      visibleEditItem: false,
      visibleDialogEditTime: false,
      formEdit: {},
      formEditTime: {},
      formData: {
        menus: []
      },
      visibleOffscreenEditAddon: false
    }
  },

  computed: {
    computedLabelItems() {
      const total = this.formData.menus.length
      if (total > 1) {
        return total + ' items'
      } else {
        return total + ' item'
      }
    },

    additonalParamsSearchProduct() {
      if (this.setupData.category && this.setupData.category.id) {
        // return [{
        //   search_column: 'klasifikasi',
        //   search_operator: 'like',
        //   search_text: this.setupData.category.name
        // }]
        return null
      } else {
        return null
      }
    },

    disableDone() {
      if (this.formData.menus.length) {
        return false
      } else {
        return true
      }
    },

    countAddon () {
      let hide = []
      if (this.formEdit.addon_group.length) {
        this.formEdit.addon_group.map(i => {
          if (i.available_for_menu === 1) {
            hide.push(i.id)
          }
        })
      }
      return hide.length
    }
  },

  methods: {
    submit() {
      this.formData.menus.map(menu => {
        menu.addon_item = []
        if (menu.addon_group.length) {
          menu.addon_group.map(group => {
            if (group.addon_items.length) {
              group.addon_items.map(addon => {
                menu.addon_item.push({
                  id: addon.id
                })
              })
            }
          })
        }
      })
      // console.log(this.formData)
      this.formData.store_grabfood_id = this.grabfoodData.id
      this.$emit('submit', this.formData)
    },

    async handleSelectProduct(product) {
      console.log('data', product)
      const objProduct = await { ...product, ...{ product_data: {} }}

      const productObj = await {
        ...objProduct,
        category_name: this.setupData.category.name,
        // selected_days: [...this.setupData.selected_days],
        available: [],
        addon_group: []
      }

      // await this.setupData.days.map(item => {
      //   const objDay = {
      //     ...item,
      //     selected_time: []
      //   }
      //   objDay.day_ids.map((dayId, dayIdKey) => {
      //     objDay.selected_time.push(dayIdKey)
      //   })
      //   productObj.available.push(objDay)
      // })
      const exist = this.formData.menus.some(({id}) => id === productObj.id)
      if (exist) {
        this.$message({
          type: 'error',
          message: 'Tidak bisa tambah item yg sama'
        })
      } else {
        this.formData.menus.push(productObj)
        this.handleEditItem(productObj)
      }
      // console.log(this.formData)
    },

    handleDeleteItem(key) {
      this.formData.menus.splice(key, 1)
    },

    getSingleProduct() {
      fetchSingle(this.formEdit.id).then(response => {
        this.formEdit.product_data = response.data.data
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
      })
    },

     getVariantProduct() {
      fetchVariantSingle(this.formEdit.id).then(async response => {
        this.formEdit.product_data = response.data.data
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
      })
    },

    async handleEditItem(item) {
      this.formEdit = await { ...item }
      this.formEdit.alias_price = this.formEdit.sell_price_pos
      if (item.type === 'V') {
        await this.getVariantProduct()
      } else if (item.type === 'P') {
        await this.getSingleProduct()
      }
      // await this.getSingleProduct()
      this.visibleEditItem = true
    },

    handleSaveEditItem() {
      if (this.stageLevel === 'dev') {
        this.formEdit.is_percentage = this.formEdit.product_data.is_comission_percentage
        if (this.formEdit.product_data.is_comission_percentage === 0) {
          this.formEdit.amount = this.formEdit.product_data.comission
          this.$delete('percentage', this.formEdit)
        } else if (this.formEdit.product_data.is_comission_percentage === 1) {
          this.formEdit.percentage = this.formEdit.product_data.comission
          this.$delete('amount', this.formEdit)
        }
      }
      
      this.formData.menus = this.formData.menus.map(item => {
        if (item.id === this.formEdit.id) {
          item = this.formEdit
        }
        return item
      })
      this.visibleEditItem = false
      // console.log(this.formData)
    },

    getLabelDayTime(itemKey) {
      const daysKey = this.formEdit.available[itemKey]
      if (daysKey && daysKey.day_ids && daysKey.day_ids.length) {
        const dayIds = this.formEdit.available[itemKey].day_ids
        if (dayIds.length > 1) {
          return dayIds[0].start_time + ' ... ' + dayIds[dayIds.length - 1].end_time
        } else {
          return dayIds[0].start_time + ' - ' + dayIds[0].end_time
        }
      }
    },

    async handleDeleteItemFromEdit() {
      this.formData.menus = await this.formData.menus.filter(item => {
        return item.id !== this.formEdit.id
      })
      this.visibleEditItem = false
    },

    async handleEditTime(item) {
      this.formEditTime = await { ...item }
      this.visibleDialogEditTime = true
      // console.log(this.formEditTime)
    },

    handleSaveEditTime() {
      // console.log(this.formEditTime, this.formEdit)
      this.formEdit.available.map(item => {
        if (item.day_id === this.formEditTime.day_id) {
          item.selected_time = [...this.formEditTime.selected_time]
        }
      })
      this.visibleDialogEditTime = false
    },

    handleEditAddon() {
      this.visibleOffscreenEditAddon = true
    },

    updateAddon(addon) {
      console.log('trace', addon)
      this.formEdit.addon_group = [ ...addon]
    },

    updateAvailable (block, item, index, idx) {
      console.log('item', item)
      if (block === 'category') {
        this.formEdit.addon_group.map(group => {
          if (group.id === item.id) {
            group = { ...item}
          }
        })
      } else if (block === 'addon') {
        this.formEdit.addon_group[index].addon_items[idx] = { ...item}
      }
    },

    IDRFormat (item) {
      let format = ''
      var number_string = item ? item.toString() : '0'
      let sisa = number_string.length % 3
      let rupiah = number_string.substr(0, sisa)
      let ribuan = number_string.substr(sisa).match(/\d{3}/g)
          
      if (ribuan) {
        let separator = sisa ? '.' : ''
        rupiah += separator + ribuan.join('.')
      }
      return format = 'IDR ' + rupiah
    },

    handleChangePercentage (data) {
      this.formEdit.product_data.is_comission_percentage = data
    }
  }
}
</script>
