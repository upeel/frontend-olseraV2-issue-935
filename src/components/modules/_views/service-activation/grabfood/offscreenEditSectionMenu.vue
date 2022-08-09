<template>
  <transition name="el-zoom-in-center">
    <div
      v-if="show"
      class="offscreen-right-sidebar px-null">
      <div class="offscreen-right-sidebar--wrapper">
        <div class="offscreen-right-sidebar--header text-left">
          Ubah Produk
          <close-esc :hideEsc="true" @close="$emit('cancel')" />
        </div>

        <div
          class="offscreen-right-sidebar--header-content color-blue-vivid--bg">
          <el-image
            :src="formData.detail ? formData.detail.default_photo : formData.photo_md"
            fit="cover"
          />
        </div>

        <div style="overflow-y: scroll; max-height: calc(100vh - 250px); ">
          <el-form
            :model="formData"
            label-position="top"
            class="px-12 pt-24 mt-24">
            <div class="flex-container mt-24 color-grey--soft--bg p-10 mb-12">
              <div class="container-icon">
                <svg-icon icon-class="icon-feather-link" stroke="#67C23A"></svg-icon>
              </div>
              <div class="full-width pl-5">
                <div class="color-primary font-bold font-16">{{ formData.alias_name ? formData.alias_name : formData.detail ? formData.detail.name : formData.name }}</div>
                <div v-if="formData.detail" class="font-12 color-old-grey">{{ formData.detail.fsell_price_pos }}</div>
                <div v-else class="font-12 color-old-grey">{{ formData.detail ? formData.detail.fsell_price_pos : formData.fsell_price_pos }}</div>
              </div>
              <div class="text-right" style="width: 20%">
                <span v-if="formData.detail" class="font-12 color-old-grey">{{ formData.detail.stock_qty }} stock</span>
              </div>
            </div>

            <el-form-item v-if="stageLevel === 'dev'" :label="'Komisi Grabfood'" prop="price">


              <div v-if="formData.is_percentage === 1">
                <input-money-v2 
                v-model="formData.percentage" 
                :with-percentage="true" 
                :is-percentage="formData.is_percentage"
                :hide-currency="formData.is_percentage === 0? false : true"
                @changepercent="handleChangePercentage" />
              </div>
              <div v-else>
                <input-money-v2 
                v-model="formData.commission_amount" 
                :with-percentage="true" 
                :is-percentage="formData.is_percentage"
                :hide-currency="formData.is_percentage === 0? false : true"
                @changepercent="handleChangePercentage" />
              </div>
            </el-form-item>

            <el-form-item
              :label="lang.price + ' Grabfood'"
              prop="price">
              <input-money
                :amount.sync="formData.alias_price"
              />
            </el-form-item>
            <!-- <el-form-item
              :label="lang.category"
              prop="category_name">
              <el-input
                :disabled="true"
                v-model="formData.category.name"
              />
            </el-form-item> -->
            <el-form-item
              :label="lang.description + ' (optional)'"
              prop="category_name">
              <el-input
                v-model="formData.description"
              />
            </el-form-item>

              <el-button 
                class="btn-block mb-16"
                :type="formData.is_needed_items === 0 ? 'info' : 'warning'"
                @click="$emit('showaddon')">
                Add-on {{ countAddon !== 0 ? '( ' + countAddon + ' )' : ''}}
                <svg-icon v-if="formData.is_needed_items === 1" icon-class="information-circle" />
              </el-button>

              <div class="flex-container radius-10 color-grey--soft--bg mb-24">
                <div class="container-icon">
                  <i class="el-icon-warning-outline" />
                </div>
                <div>
                  Sediakan pilihan untuk memodifikasi item. Pilih dari daftar Add-On sesuai kebutuhan produk
                </div>
              </div>

              <div class="flex-container p-10 mb-16 border border--grey-border">
                <div class="full-width">
                  {{ rootLang.available_in_grabfood_menu }}
                </div>
                <div class="text-right full-width">
                  <strong v-if="formData.is_available === 1">{{ rootLang.yes }}</strong>
                  <strong v-else>{{ rootLang.no }}</strong>
                  <el-switch
                    v-model="formData.is_available"
                    :active-value="1"
                    :inactive-value="0"
                    @change="beforeUpdateCategory('menu', menu, index, idx)">
                  </el-switch>
                </div>
              </div>

              <el-button
                class="btn-block mb-8 color-danger"
                icon="el-icon-delete"
                @click="handleDeleteItemFromEdit">
                {{ rootLang.delete }}
              </el-button>
          </el-form>

          
        </div>
        

        <div class="offscreen-right-sidebar--footer">
          
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
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import CloseEsc from '@/components/modules/CloseEsc'
import InputMoney from '@/components/modules/InputMoney'
import InputMoneyV2 from '@/components/InputMoneyV2'

export default {
  components: {
    CloseEsc,
    InputMoney,
    InputMoneyV2
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
    }
  },

  data() {
    return {
      formData: {
        product_data: {}
      }
    }
  },

  computed: {
    countAddon () {
      let hide = []
      if (this.formEdit.addon_items && this.formEdit.addon_items.length) {
        this.formEdit.addon_items.map(i => {
          if (i.available_for_menu === 1) {
            hide.push(i.id)
          }
        })
      }
      return hide.length
    }
  },

  watch: {
    formEdit(formEdit) {
      // console.log('asdasdasdasd',formEdit, this.formData);
      if (formEdit) {
        if (this.stageLevel === 'dev' || this.stageLevel === 'sit') {
          formEdit.commission_amount = formEdit.commission_amount.toString()
          formEdit.percentage = formEdit.percentage.toString()
        }
        
        this.formData = { ...formEdit }
        
        if (!this.formData.alias_price) {
          this.formData.alias_price = this.formData.sell_price
          this.formData.is_percentage = this.formData.is_percentage
          this.formData.amount_discount = this.formData.comission
        }
        // console.log('asdasdasdasdas',this.formData)
      }
    }
  },

  methods: {
    handleDeleteItemFromEdit () {
      this.$emit('delete', this.formEdit.id)
    },

    handleSaveEditItem () {
      
      if (this.formData.is_percentage === 1) {
        this.formData.commission_amount = this.formData.percentage
      }
      console.log(this.formData);
      this.$emit('save', this.formData)
    },

    handleChangePercentage (data) {
      // console.log(data);
      this.formData.is_percentage = data
      
    }
  }
}
</script>
