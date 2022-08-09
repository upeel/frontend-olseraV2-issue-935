<template>
  <transition name="el-zoom-in-center">
    <div
      v-if="show"
      class="offscreen-right-sidebar px-null">
      <div class="offscreen-right-sidebar--wrapper">
        <div class="offscreen-right-sidebar--header text-left color-white--bg" style="z-index: 10">
          <span class="px-16">Detail Promosi</span>
          <close-esc :hideEsc="true" @close="handleClose" />
        </div>
        
        <div class="p-24">
          <div class="color-info--bg radius-10 p-8 flex-container">
            <div class="full-width">
              <div class="flex-container full-width" >
                <div v-if="formEdit.camp_status_id === '2'" class="color-grabfood--bg color-white p-5 mr-4 radius-5 font-32" style="display: flex; width: 40px; height: 40px">
                  <svg-icon :icon-class="formEdit.disc_type === 1? 'icon-disc-nominal-grabfood' : formEdit.disc_type === 2? 'icon-disc-persen-grabfood' : formEdit.disc_type === 3? 'icon-disc-ongkir-grabfood' : 'icon-disc-gratis-grabfood'" />
                </div>
                <div v-if="formEdit.camp_status_id === '0'" class="color-grey--placeholder--bg color-white p-5 mr-4 radius-5 font-32" style="display: flex; width: 40px; height: 40px">
                  <svg-icon :icon-class="formEdit.disc_type === 1? 'icon-disc-nominal-grabfood-grey' : formEdit.disc_type === 2? 'icon-disc-persen-grabfood-grey' : formEdit.disc_type === 3? 'icon-disc-ongkir-grabfood-grey' : 'icon-disc-gratis-grabfood-grey'" />
                </div>
                <div>
                  <div class="font-bold font-20 ml-8">
                    {{ formEdit.name }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="px-24">
          <div v-if="formEdit.camp_status_id === '2'" class="radius-10 p-10 text-left flex-container" style="background: #FFDF00">
            <div class="container-icon"><svg-icon icon-class="information-circle" /> </div>
            <div class="full-width">Promo sedang berlangsung selama <span class="font-bold">{{ getLabelDayLeft(formEdit.start_time, formEdit.end_time) }}</span> </div>
            <div> 🎉</div>
          </div>
          <div v-if="formEdit.camp_status_id === '0'" class="radius-10 p-10 text-left flex-container" style="background: #EEEEEE">
            <div class="container-icon"><svg-icon icon-class="information-circle" /> </div>
            <div class="full-width">Promo berakhir pada <span class="font-bold">{{ getLabelEnd() }}</span> </div>
            <div> 👍</div>
          </div>
        </div>

        <div v-if="formEdit.disc_type === 4" class="mt-16 px-24 text-left">
          <div class="like-table-wrapper--item flex-container">
            <div class="full-width">{{ rootLang.free_items }}</div>
            <div :class="'full-width text-right font-bold'"> 1x {{ formEdit.disc_scope_items[0].alias_name }}</div>
          </div>
          <div class="like-table-wrapper--item flex-container">
            <div class="full-width">{{ rootLang.min_purchase }}</div>
            <div :class="'full-width text-right font-bold'">{{ formEdit.fmin_order_amount }}</div>
          </div>
        </div>
        <div v-else class="mt-16 px-24 text-left">
          <div class="like-table-wrapper--item pointer flex-container">
            <div class="full-width">Besar diskon</div>
            <div class="full-width text-right font-bold">{{ formEdit.fdisc_value }}</div>
          </div>
          <div class="like-table-wrapper--item pointer flex-container">
            <div class="full-width">{{ rootLang.min_purchase }}</div>
            <div :class="'full-width text-right font-bold'">{{ formEdit.fmin_order_amount }}</div>
          </div>
          <div class="like-table-wrapper--item pointer flex-container">
            <div class="full-width">{{ rootLang.apply_discount_to }}</div>
            <div class="full-width text-right font-bold">{{ formEdit.disc_scope_type === 1? rootLang.total_order : rootLang.certain_items }}</div>
          </div>
          <div v-if="formEdit.disc_scope_type === 2" class="like-table-wrapper--item pointer flex-container">
            <div class="full-width">{{ rootLang.discounted_items }}</div>
            <div class="full-width text-right font-bold">{{ formEdit.disc_scope_items.length }}</div>
          </div>
        </div>

        <div v-if="formEdit.disc_scope_type === 2 && formEdit.disc_scope_items.length > 0" class="mt-24 border border--grey border--with-shadow ml-24 mr-24">
          <div v-for="product in formData.disc_scope_items" :key="product.id" class="like-table-wrapper--item flex-container">
            <div class="full-width text-left">
              <div class="flex-container full-width" >
                <template v-if="product.detail">
                  <el-avatar
                    :src="product.detail.default_photo"
                    :size="40"
                    shape="square"
                  />
                </template>
                <div>
                  <div class="font-bold font-14 ml-8">
                    {{ product.alias_name }}
                  </div>
                  <div v-if="formEdit.disc_type === 4" class="font-12 ml-8 color-grabfood">
                    {{ rootLang.free }}
                  </div>
                  <div v-else class="font-12 ml-8">
                    {{ product.falias_price }}
                  </div>
                </div>
              </div>
            </div>
            <template v-if="formEdit.disc_type === 4">

            </template>
            <template v-else>
              <div v-if="product.is_available === 1" class="text-right flex-container" style="width: 40%">
                <div v-if="product.detail.is_out_stock === 0" class="full-width px-8" >{{ product.detail.stock_qty }} stock</div>
                <div v-if="product.detail.is_out_stock === 1" class="full-width px-8 color-danger" >{{ rootLang.outstock }}</div>
              </div>
              <div v-if="product.is_available === 0" class="text-right flex-container" style="width: 40%; justify-content: flex-end">
                <el-tag type="danger" effect="plain" size="mini" style="background-color: transparent">Tidak tersedia</el-tag>
              </div>
            </template>
          </div>
        </div>

        <div class="mt-16 px-24 text-left">
          <div class="like-table-wrapper--item pointer flex-container">
            <div class="full-width">{{ lang.discount_name }}</div>
            <div class="full-width text-right font-bold">{{ formEdit.name }}</div>
          </div>
          <div class="like-table-wrapper--item pointer flex-container">
            <div class="full-width">{{ lang.start_date }}</div>
            <div :class="'full-width text-right font-bold'">{{ formEdit.fstart_time }}</div>
          </div>
          <div class="like-table-wrapper--item pointer flex-container">
            <div class="full-width">{{ lang.end_date }}</div>
            <div class="full-width text-right font-bold">{{ formEdit.fend_time }}</div>
          </div>
          <div class="like-table-wrapper--item pointer flex-container">
            <div class="full-width">{{ rootLang.max_total_promo }}</div>
            <div v-if="formEdit.total_count > 0" class="full-width text-right font-bold">{{ formEdit.total_count }}</div>
            <div v-else class="full-width text-right font-bold">{{ rootLang.unlimited }}</div>
          </div>
          <div class="like-table-wrapper--item pointer flex-container">
            <div class="full-width">{{ rootLang.limit_for_customer }}</div>
            <div v-if="formEdit.total_count_per_user > 0" class="full-width text-right font-bold">{{ formEdit.total_count_per_user }}</div>
            <div v-else class="full-width text-right font-bold">{{ rootLang.unlimited }}</div>
          </div>
          <div class="like-table-wrapper--item pointer flex-container">
            <div class="full-width">Berlaku untuk</div>
            <div class="full-width text-right font-bold">{{ formEdit.eater_type === 1? lang.all + ' ' + lang.customer : lang.new + ' ' + lang.customer }}</div>
          </div>
          <div class="like-table-wrapper--item pointer flex-container">
            <div class="full-width">{{ rootLang.valid_day }}</div>
            <div class="full-width text-right font-bold">{{ getLabelValidDay() }}</div>
          </div>
          <div class="like-table-wrapper--item pointer flex-container">
            <div class="full-width">{{ rootLang.valid_periode }}</div>
            <div class="full-width text-right font-bold">{{ getLabelPeriod() }}</div>
          </div>
        </div>
      </div>
      <div class="ml-24 mr-24 mb-24">
        <el-button class="btn-block color-danger" icon="el-icon-delete" @click="dialogDelete = true">{{ rootLang.delete }}</el-button>
      </div>

      <el-dialog
        :visible.sync="dialogDelete"
        :show-close="false"
        append-to-body
        custom-class="dialog-card"
        width="536px">
        <div class="text-center">
          <span>{{ rootLang.are_you_want_remove_promotion_grab }}</span>
          <div>
            <el-button class="btn-block btn-danger mt-24" :loading="loadingDelete" @click="deleteCampaign">{{ $lang[langId].delete }}</el-button>
            <el-button class="btn-block btn-info mt-8" @click="dialogDelete = false">{{ lang.cancel }}</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </transition>
</template>

<script>
import moment from 'moment'
import basicComputedMixin from '@/mixins/basicComputedMixin'
import CloseEsc from '@/components/modules/CloseEsc'

import { deleteCampaignGrab } from '@/api/thirdParty/grabfood'

import { searchProduct, pairProductTokopedia, changeStatusProduct, updateSingleProductTokopedia } from '@/api/thirdParty/tokopedia'

import PopoverConfirmation from '../../../../../PopoverConfirmation.vue'

export default {
  components: {
    CloseEsc,
    PopoverConfirmation
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
      visibleChangeStatus: false,
      loadingStatus: false,
      showUpdateStock: false,
      dialogDelete: false,
      loadingDelete: false
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
    // 
  },

  mounted () {
    // if (this.formEdit.addon_items.length) {
    //   this.getCheckedAddon()
    // }
  },

  methods: {
    syncProduct () {
      let data = {
        product_id_tokopedia: this.formEdit.product_id,
        type: this.formEdit.type,
        product_id_olsera: this.selectedProduct.id,
        source_product: this.selectedProduct.type,
        stock: this.formEdit.stock
      }

      this.loadingPair = true
      pairProductTokopedia(data).then(response => {
        this.$message({
          type: 'success',
          message: response.data.data.message
        })
        this.handleClose()
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
      this.$emit('cancel')
    },

    resyncProduct () {
      this.$emit('resync', this.formEdit)
    },

    cancelSwitch () {
      // this.formEdit.product_status === 1 ? this.formEdit.product_status = 0 : this.formEdit.product_status = 1
      this.visibleChangeStatus = false
    },

    handleChangeStatus (status) {
      this.visibleChangeStatus = false
      this.loadingStatus = true
      let data = {
        status: status,
        type: this.formEdit.type,
        product_id: [this.formEdit.product_id]
      }
      changeStatusProduct(data).then(response => {
        this.$message({
          type: 'success',
          message: response.data.data.message
        })
        this.loadingStatus = false
        this.$emit('refresh')
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingStatus = false
      })
    },

    updateStock () {
      this.loadingUpdateStock = true
      let data = {
        product_id_tokopedia: this.formEdit.product_id,
        type: this.formEdit.type,
        stock: this.formEdit.pair.stock
      }
      updateSingleProductTokopedia(data).then(response => {
        this.$message({
          type: 'success',
          message: response.data.data.message
        })
        this.loadingUpdateStock = false
        this.showUpdateStock = false
        this.$emit('refresh')
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingUpdateStock = false
      })
    },

    getLabelDayLeft (start_time, end_time) {
      var start = moment(start_time, "YYYY-MM-DD");
      var end = moment(end_time, "YYYY-MM-DD");
      var rangeDay = moment.duration(end.diff(start)).asDays()
      if (rangeDay > 30) {
        let dayleft = rangeDay % 30
        let rangeMonth = (rangeDay - dayleft)/30
        let label = dayleft > 0? rangeMonth + this.rootLang.months + ' ' + dayleft + ' ' + this.rootLang.day : rangeMonth + ' ' + this.rootLang.months
        return label
      } else {
        return rangeDay + ' ' + this.rootLang.day
      }
    },

    getLabelValidDay () {
      let label = []
      this.formEdit.periods.map(i => {
        if (i.periods.length) { label.push(i.fday)}
      })
      return label.length? label.join(', ') : '-'
    },

    getLabelPeriod () {
      let start_time = []
      let end_time = []
      let tempData = []
      this.formEdit.periods.map(i => {
        if (i.periods.length) {
          i.periods.map(j =>{ tempData.push(j) })
        }
      })
      if (tempData.length) {
        tempData.map(i => {
          start_time.push(moment(i.start_time, 'HH:mm'))
          end_time.push(moment(i.end_time, 'HH:mm'))
        })
        let simbol = tempData.length > 1 ? ' ••• ' : ' - '
        let dday = moment.min(start_time).format('HH:mm') + simbol + moment.max(end_time).format('HH:mm')
        return dday
      } else {
        return '-'
      }
    },

    async deleteCampaign() {
      this.loadingDelete = true
      await deleteCampaignGrab(this.formEdit.id).then(response => {
        this.loadingDelete = false
        this.dialogDelete = false
        // this.dataPeriod = response.data.data
        this.$emit('update')
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.dialogDelete = false
        this.loadingDelete = false
      })
    },

    getLabelEnd () {
      return moment(this.formEdit.end_time).format('DD MMMM YYYY')
    }
  }
}
</script>
