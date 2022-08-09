<template>
  <el-dialog
    :visible.sync="show"
    :show-close="false"
    :close-on-press-escape="false"
    :before-close="handleCancel"
    fullscreen
    append-to-body
    custom-class="dialog-grbfd">
    <div slot="title">
      <div>
        <h4 class="dialog-title full-width text-center font-bold">
          {{ formData.disc_type === 0 ? rootLang.free_items : formData.disc_type === 1 ? rootLang.discount_nominal : formData.disc_type === 2 ? rootLang.discount_percentage : rootLang.free_items }}
        </h4>
      </div>
      <div class="btn_save_dialog text-right float-right" style="margin-top: -40px;">
        <el-button type="info" @click="handleCancel">{{ lang.cancel }}</el-button>
        <el-button :loading="loadingSave" :disabled="disableSaveCampaign" type="success" @click="handleBeforeSave" >{{ lang.save }}</el-button>
      </div>
    </div>
    <div>
      <div class="p-24 border border--grey radius-2">
        <div class="full-width font-14 text-center">Besar Diskon</div>
        <div class="p-10 color-grabfood--bg radius-5 color-white flex-container">
          <div class="border border--white p-5 radius-5 font-bold font-32 justify-center flex-container" style="width: 40px; height: 40px; position: absolute; z-index: 1000">
            <template v-if="formData.disc_type !== 4">
              <svg-icon :icon-class="formData.disc_type === 1? 'icon-disc-nominal-grabfood' : formData.disc_type === 2? 'icon-disc-persen-grabfood' : formData.disc_type === 3? 'icon-disc-ongkir-grabfood' : 'icon-disc-gratis-grabfood'" />
            </template>
            <template v-else>
              <svg-icon v-if="!formData.product_discount.id || activeSelect" icon-class="icon-disc-gratis-grabfood" />
              <el-avatar
                v-else
                :src="formData.product_discount.detail.default_photo"
                shape="square"
              />
            </template>
          </div>
          <div v-if="formData.disc_type === 1 || formData.disc_type === 3" class="full-width text-center font-20">
            <input-money v-model="formData.disc_value" class="input-disc-grab" style="border: none !important;" />
          </div>
          <div v-if="formData.disc_type === 2" class="full-width text-center font-20">
            <el-input type="number" max="100" v-model="formData.disc_value" class="input-disc-grab--input-percent" style="border: none !important; width: 60px;" @change="handleInputPersen">
              <template slot="append">%</template>
            </el-input>
          </div>
          <div v-if="formData.disc_type === 4 && (!formData.product_discount.id || activeSelect)" class="full-width text-center font-20 pointer">
            <select-product-grab-campaign
              :additional-params="additonalParamsSearchProduct"
              :section="formData"
              :grab-campaign="true"
              style="width: 100%;"
              @select="handleSelectProduct"
            />
          </div>
          <div v-else-if="formData.disc_type === 4" class="full-width text-center font-20 pointer" @click="handleClearProduct">
            <div class="font-bold flex-container">
              <div class="full-width">1x {{ formData.product_discount.alias_name }}</div>
              <div class="text-right font-16" @click="handleClearProduct"><i class="el-icon-close" /></div>
            </div>
          </div>
        </div>

        <div class="mt-16 flex-container">
          <div class="full-width mr-16">
            <span class="font-12">Minimal Pembelian</span>
            <input-money v-model="formData.min_order_amount" />
          </div>
          <div v-if="formData.disc_type !== 3 && formData.disc_type !== 4" class="full-width ml-16">
            <span class="font-12">Terapkan diskon pada</span>
            <el-radio-group
              v-model="formData.disc_scope_type"
              class="full-width flex-container border border--info">
              <el-radio-button class="lpoint-type" :label="2">
                {{ rootLang.certain_items }}
              </el-radio-button>
              <el-radio-button class="lpoint-type" :label="1">
                {{ $lang[langId].total_order }}
              </el-radio-button>
            </el-radio-group>
          </div>
        </div>

        <div v-if="formData.disc_type === 2 && formData.disc_scope_type === 1" class="mt-24">
          <span class="font-12">Maksimal diskon</span>
          <input-money v-model="formData.disc_cap" />
        </div>

        <div v-if="formData.disc_type !== 3 && formData.disc_type !== 4" class="px-16 py-12 mt-24 color-grey--soft--bg border border--grey flex-container radius-5">
          <template v-if="formData.disc_scope_type === 2">
            <div class="full-width">{{ rootLang.discounted_items }} ({{ formData.disc_scope_items !== null ? formData.disc_scope_items.length : 0 }})</div>
            <el-button type="success" @click="visibleSearchProduct = true">
              <i class="el-icon-plus"/> {{ lang.add }}
            </el-button>
          </template>
          <template v-else>
            <div class="full-width flex-container">
              <div class="container-icon color-grey--icon">
                <svg-icon icon-class="information-circle" />
              </div>
              <span>Diskon akan diterapkan pada <span class="font-bold"> Total Transaksi Pesanan</span></span>
            </div>
          </template>
        </div>

        <div v-if="formData.disc_scope_type === 2 && formData.disc_type !== 4 && formData.disc_scope_items.length > 0" class="mt-24">
          <div v-for="(product, idx) in formData.disc_scope_items" :key="product.id" class="like-table-wrapper--item flex-container">
            <div class="full-width text-left">
              <div class="flex-container full-width" >
                <template v-if="product.detail">
                  <el-avatar
                    :src="product.detail.default_photo"
                    :size="40"
                    shape="square"
                  />
                  <!-- <div class="container-icon" style="position:absolute; align-items: unset !important; left: 50px">
                    <svg-icon icon-class="freemium_icon"/>
                  </div> -->
                </template>
                <div>
                  <div class="font-bold font-16 ml-8">
                    {{ product.alias_name }}
                  </div>
                  <div class="font-12 ml-8">
                    {{ product.falias_price }}
                  </div>
                </div>
              </div>
            </div>
            <!-- <div class="text-right flex-container" style="width: 40%"> -->
              <div v-if="product.is_available === 1" class="text-right flex-container" style="width: 40%">
                <div v-if="product.detail.is_out_stock === 0" class="full-width px-8" >{{ product.detail.stock_qty }} stock</div>
                <div v-if="product.detail.is_out_stock === 1" class="full-width px-8 color-danger" >{{ rootLang.outstock }}</div>
              </div>
              <div v-if="product.is_available === 0" class="text-right flex-container" style="width: 40%; justify-content: flex-end">
                <el-tag type="danger" effect="plain" size="mini" style="background-color: transparent">Tidak tersedia</el-tag>
              </div>
              <!-- <div class="full-width px-8" >{{ product.detail.stock_qty }} stock</div> -->
              <i class="el-icon-close font-20 color-grey--placeholder pointer" @click="removeItemScope(idx)" />
            <!-- </div> -->
          </div>
        </div>
      </div>

      

      <div class="p-24 mt-24 border border--grey radius-2">
        <div class="font-18 font-bold py-16">Ketentuan Promosi</div>
        <div class="mt-24 flex-container flex-container--start">
          <div class="full-width mr-16">
            <span class="font-12">{{ lang.discount_name }}</span>
            <el-input v-model="formData.name"></el-input>
            <div class="flex-container mt-24">
              <div class="mr-4 full-width">
                <div class="font-12">{{ lang.start_date }}</div>
                <el-date-picker
                  style="width: 100%;"
                  v-model="data.discount_start_date"
                  type="date"
                  format="d MMMM yyyy"
                  :picker-options="inBetweenDatesPickerOptions.start"
                  :placeholder="$lang[langId].pick_a_day"
                  @change="dateStartPicked">
                </el-date-picker>
              </div>
              <div class="ml-4" style="width: 40%">
                <div class="font-12">{{ lang.start_time }}</div>
                <el-time-select
                  style="width: 100%;"
                  v-model="formData.start_time"
                  :picker-options="{ ...timePickerOptions, minTime: minTimeStart}"
                  :clearable="false"
                  class="mr-8"
                  @change="timeStartPicked"
                />
              </div>
            </div>
            <div class="flex-container mt-24">
              <div class="mr-4 full-width">
                <div class="font-12">{{ lang.end_date }}</div>
                <el-date-picker
                  style="width: 100%;"
                  v-model="data.discount_end_date"
                  type="date"
                  format="d MMMM yyyy"
                  :placeholder="$lang[langId].pick_a_day"
                  :picker-options="inBetweenDatesPickerOptions.end"
                  @change="dateEndPicked">
                </el-date-picker>
              </div>
              <div class="ml-4" style="width: 40%">
                <div class="font-12">{{ lang.end_time }}</div>
                <el-time-select
                  style="width: 100%;"
                  v-model="formData.end_time"
                  :picker-options="{ ...timePickerOptions, minTime: formData.start_time}"
                  :clearable="false"
                  class="mr-8"
                />
              </div>
            </div>
            <div v-if="!formData.id" class="radius-5 p-10 mt-24 flex-container" :style="labelStatusCampaign(formData.start_time, formData.end_time).rangeDate > 0? 'background: #E0F5E8' : 'background: #FFDF00'">
              <div class="container-icon"><svg-icon icon-class="information-circle" /> </div>
              <div class="full-width">{{ labelStatusCampaign(formData.start_time, formData.end_time).label }}</div>
              <div> 🎉</div>
            </div>
          </div>
          <div class="full-width ml-16">
            <div>
              <div class="flex-container">
                <div class="full-width font-12">{{ rootLang.max_total_promo}}</div>
                <div class="full-width text-right font-12">
                  <span v-if="active_max_promo == 1">{{ rootLang.limited }}</span>
                  <span v-if="active_max_promo == 0">{{ rootLang.unlimited }}</span>
                  <el-switch v-model="active_max_promo" :active-value="0" :inactive-value="1" @change="setMaxPromo">
                  </el-switch>
                </div>
              </div>
              <div class="mt-4">
                <template v-if="active_max_promo === 0">
                  <el-input :value="rootLang.unlimited" disabled></el-input>
                </template>
                <template v-else>
                  <el-input v-model="formData.total_count" :min="1" type="number"></el-input>
                </template>
              </div>
              <span class="font-11">Jika jumlah promo maksimal dicapai, promo tidak dapat digunakan lagi oleh pelanggan</span>
            </div>
            <div class="mt-16">
              <div class="flex-container">
                <div class="full-width font-12">{{ rootLang.limit_for_customer}}</div>
                <div class="full-width text-right font-12">
                  <span v-if="active_limit_per_customer == 1">{{ rootLang.limited }}</span>
                  <span v-if="active_limit_per_customer == 0">{{ rootLang.unlimited }}</span>
                  <el-switch v-model="active_limit_per_customer" :active-value="0" :inactive-value="1" @change="setMaxUser">
                  </el-switch>
                </div>
              </div>
              <div class="mt-4">
                <template v-if="active_limit_per_customer === 0">
                  <el-input :value="rootLang.unlimited" disabled></el-input>
                </template>
                <template v-else>
                  <el-input v-model="formData.total_count_per_user" :min="1" type="number"></el-input>
                </template>
              </div>
              <!-- <div class="full-width ml-16 mt-16">
                <span class="font-12">Berlaku untuk</span>
                <el-radio-group
                  v-model="formData.eater_type"
                  class="full-width flex-container border border--info">
                  <el-radio-button class="lpoint-type" :label="1">
                    {{ lang.all }} {{ lang.customer }}
                  </el-radio-button>
                  <el-radio-button class="lpoint-type" :label="2">
                    {{ lang.customer }} {{ lang.new }} 
                  </el-radio-button>
                </el-radio-group>
              </div> -->
            </div>
            <div class="mt-16">
              <span class="font-12">{{ rootLang.valid_day }}</span>
              <div class="flex-container color-grey--bg px-12">
                <div class="full-width font-bold">{{ getLabelDay() }}</div>
                <div class="container-icon color-primary text-right pointer" @click="changeDay(0)">
                  <svg-icon icon-class="edit-2" />
                </div>
              </div>
            </div>
            <div class="mt-16">
              <span class="font-12">{{ rootLang.valid_periode }}</span>
              <div class="flex-container color-grey--bg px-12">
                <div class="full-width font-bold">{{ getLabelPeriod() }}</div>
                <div class="container-icon color-primary text-right pointer" @click="changeDay(1)">
                  <svg-icon icon-class="edit-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <offscreen-search-product
        :show="visibleSearchProduct"
        @setproduct="setProduct"
        @cancel="visibleSearchProduct = false"
      />

      <el-dialog
        :visible.sync="showDialogDay"
        :show-close="false"
        :close-on-press-escape="false"
        :before-close="handleCancelDay"
        width="50%"
        append-to-body>
        <div slot="title" class="flex-container">
          <h4 class="dialog-title full-width font-bold">
            {{ validDay === 0 ? rootLang.valid_day : rootLang.valid_periode }}
          </h4>
          <div class="btn_save_dialog text-right full-width">
            <el-button type="info" @click="handleCancelDay">{{ lang.cancel }}</el-button>
            <el-button type="success" @click="handleSaveItem" >{{ lang.save }}</el-button>
          </div>
        </div>
        <div>
          <template v-if="validDay === 0">
            <div v-if="validDay === 0" class="flex-container mb-16">
              <div class="full-width">{{ rootLang.all_day_open }}</div>
              <div><el-switch v-model="formData.is_all_period_days" :active-value="1" :inactive-value="0" @change="handleCheckAllDay" /></div>
            </div>
            <div v-for="item in dataDays" :key="item.id" class="like-table-wrapper--item">
              <div class="full-width">{{ item.value }}</div>
              <el-checkbox v-model="item.checked" @change="handleCheckDay(item)"/>
            </div>
          </template>
          <template v-else>
            <div v-loading="loading" class="flex-container mb-16">
              <div class="full-width">{{ rootLang.all_period_open }}</div>
              <div><el-switch v-model="formData.is_all_periods" :active-value="1" :inactive-value="0" @change="handleCheckAllperiod" /></div>
            </div>
            <div v-for="item in dataPer" :key="item.day" class="like-table-wrapper--item">
              <div class="full-width">
                <span>{{ item.fday }}</span>
                <div class="flex-container">
                  <div class="mr-8 flex-container" v-for="period in item.times" :key="period.time_id">
                    <div :class="period.checked ? 'color-primary--soft--bg radius-5 mr-4 p-2' : 'mr-4 radius-5 p-2'">
                      {{ period.fstart_time }} - {{ period.fend_time }}
                      <el-checkbox v-model="period.checked" @change="handleCheck(period)" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </el-dialog>

      <el-dialog
        :visible.sync="dialogDelete"
        :show-close="false"
        append-to-body
        custom-class="dialog-card"
        width="536px">
        <div class="text-center">
          <span>{{ rootLang.are_you_want_remove_promotion_grab }} 
            <!-- <span v-if="isBulk" class="font-bold">{{ dataChecked.length }} {{ lang.product }} ?</span>
            <span v-else class="font-bold">{{ lang.product }} {{ tempData.item_name }} ?</span> -->
          </span>
          <el-button class="btn-block btn-danger mt-24" :loading="loadingDelete" @click="deleteCampaign">{{ $lang[langId].delete }}</el-button>
          <el-button class="btn-block btn-info mt-8" @click="dialogDelete = false">{{ lang.cancel }}</el-button>
        </div>
      </el-dialog>

      <el-dialog
        :visible.sync="dialogBeforeSave"
        :show-close="false"
        append-to-body
        custom-class="dialog-card"
        width="536px">
        <div slot="title" class="text-center">{{ labelStatusCampaign(formData.start_time, formData.end_time).rangeDate > 0? rootLang.are_you_sure_want_save_promotion_grab : rootLang.are_you_sure_want_save_promotion_grab_1 }}</div>
        <div class="text-center">
          <div class="radius-5 p-10 text-left flex-container" :style="labelStatusCampaign(formData.start_time, formData.end_time).rangeDate > 0? 'background: #E0F5E8' : 'background: #FFDF00'">
            <div class="container-icon"><svg-icon icon-class="information-circle" /> </div>
            <div v-if="labelStatusCampaign(formData.start_time, formData.end_time).rangeDate > 0" class="full-width">{{ labelStatusCampaign(formData.start_time, formData.end_time).label }} lagi selama {{ labelStatusCampaign(formData.start_time, formData.end_time).ended }} </div>
            <div v-else class="full-width">Promo berlangsung selama {{ labelStatusCampaign(formData.start_time, formData.end_time).ended }} </div>
            <div> 🎉</div>
          </div>
          <div>
            <el-button class="full-width mt-24" type="success" :loading="loadingSave" @click="handleSaveDiscount">{{ rootLang.save }}</el-button>
          </div>
          <el-button class="full-width btn-info mt-8" @click="dialogBeforeSave = false">{{ lang.cancel }}</el-button>
        </div>
      </el-dialog>
    </div>
    <div slot="footer" v-if="this.formData.id">
      <el-button class="btn-block color-danger" icon="el-icon-delete" @click="dialogDelete = true">{{ rootLang.delete }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import InputMoney from '@/components/InputMoneyV2'
import offscreenSearchProduct from './offscreenSearchProduct.vue'
import SelectProductGrabCampaign from './SelectProductGrabCampaign'

import { getGrabPeriodStore as getDataPeriod, 
  createGrabCampaign, 
  updateCampaign, 
  deleteCampaignGrab } from '@/api/thirdParty/grabfood'
import moment from 'moment'
import SvgIcon from '../../../../SvgIcon.vue'
// import { toJpeg } from 'html-to-image'
export default {
  name: 'AddDiscount',

  mixins: [basicComputedMixin],

  components: {
    InputMoney,
    offscreenSearchProduct,
    SelectProductGrabCampaign,
    SvgIcon
  },

  props: {
    show: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default: null
    },
    dataGrabFoodId: {
      type: Number,
      default: null
    },
    dataPeriodDay: {
      type: Array,
      default: []
    }
  },

  data () {
    return {
      timePickerOptions: {
        start: '00:00',
        step: '00:15',
        end: '23:59'
      },
      pickerOptions: {
        disabledDate: this.getDateDisabled
      },
      showDialogDay: false,
      allDay: 0,
      allPeriod: 0,
      dataDay: [
        {
          day_id: 1,
          value: 'Minggu',
          checked: false
        },
        {
          day_id: 2,
          value: 'Senin',
          checked: false
        },
        {
          day_id: 3,
          value: 'Selasa',
          checked: false
        },
        {
          day_id: 4,
          value: 'Rabu',
          checked: false
        },{
          day_id: 5,
          value: 'Kamis',
          checked: false
        },
        {
          day_id: 6,
          value: 'Jumat',
          checked: false
        },
        {
          day_id: 7,
          value: 'Sabtu',
          checked: false
        }
      ],
      validDay: 0,
      dataPeriod: [],
      tempData: [],
      loading: false,
      visibleSearchProduct: false,
      loadingSave: false,
      additonalParamsSearchProduct: [],
      activeSelect: false,
      active_max_promo: 0,
      active_limit_per_customer: 0,
      dialogDelete: false,
      loadingDelete: false,
      data: {
        discount_start_date: moment().format('YYYY-MM-DD'),
        discount_end_date: moment().add(7, 'days').format('YYYY-MM-DD')
      },
      tempDataDay: [],
      dialogBeforeSave: false
    }
  },

  mounted () {
    // console.log('moment', moment('2021-07-26 12:00:00').format('HH:mm'))
  },

  watch: {
    formData(formData) {
      let data = []
      let dataDay = []
      // if (formData.id) {
          this.data = { 
            discount_start_date: moment(formData.discount_start_date),
            discount_end_date: moment(formData.discount_end_date)
          }
        // }
      if (this.show) {

        this.active_limit_per_customer = formData.active_limit_per_customer
        this.active_max_promo = formData.active_max_promo
        if (formData.id && formData.periods !== null && formData.periods.length) {
          formData.periods.map(i => {
            if (i.periods !== null && i.periods.length) {
              dataDay.push({
                checked: true,
                day_id: i.day,
                value: i.fday
              })

              i.periods.map(j => {
                data.push({
                  checked: true,
                  start_time: j.start_time,
                  end_time: j.end_time,
                  time_id: j.id
                })
              })
            }
          })
        }
        console.log('da', data)
        if (data.length) {
          this.tempData = data.filter((v,i,a)=>a.findIndex(t=>(t.time_id === v.time_id))===i)
        }
        if (dataDay.length) {
          this.tempDataDay = dataDay.filter((v,i,a)=>a.findIndex(t=>(t.day_id === v.day_id))===i)
        }
      }
    }
  },

  computed: {
    dataPer () {
      let data = [ ]
      this.dataPeriod.map(i => {
        if (this.tempDataDay.length) {
          this.tempDataDay.map(j => {
            if (i.day === j.day_id) {
              data.push(i)
            }
          })
        }
      })
      data.map(i => {
        if (i.times !== null && i.times.length) {
          i.times.map(j => {
            j.checked = this.formData.is_all_periods === 1? true : false
            if (this.tempData.length) {
              this.tempData.map(k => {
                if (j.time_id === k.time_id) {
                  j.checked = true
                }
              })
            }
          })
        }
      })
      return data
    },

    dataDays () {
      let days = []
      this.dataDay.map(i => {
        this.dataPeriodDay.map(j => {
          if (j.period_type === 1 && j.day === i.day_id) {
            i.checked = true
            days.push(i)
          }
        })
      })
      return days
    },

    disableSaveCampaign () {
      if ((this.formData.disc_type === 1 || this.formData.disc_type === 2) && this.formData.disc_scope_type === 2) {
        if (this.formData.name === '' || this.formData.disc_value === 0 || this.formData.disc_scope_items.length === 0 || !this.tempDataDay.length || !this.tempData.length) {
          return true
        } else {
          return false
        }
      } else if ((this.formData.disc_type === 1 || this.formData.disc_type === 2) && this.formData.disc_scope_type === 1) {
        if (this.formData.name === '' || this.formData.disc_value === 0 || !this.tempDataDay.length || !this.tempData.length) {
          return true
        } else {
          return false
        }
      } else if (this.formData.disc_type === 3) {
        if (this.formData.name === '' || this.formData.disc_value === 0 || !this.tempDataDay.length || !this.tempData.length) {
          return true
        } else {
          return false
        }
      } else if (this.formData.disc_type === 4) {
        if (this.formData.name === '' || !this.formData.product_discount.id || !this.tempDataDay.length || !this.tempData.length) {
          return true
        } else {
          return false
        }
      }
    },

    inBetweenDatesPickerOptions() {
      let options = {
        start: {
          disabledDate: (time) => {
            return moment(time.getTime()) < moment().subtract(1, 'days')
          }
        },
        end: {
          disabledDate: (time) => {
            return moment(time.getTime()) < moment(this.formData.discount_start_date)
          }
        }
      }
      return options
    },
    
    lengtTotalPeriod () {
      let period = []
      this.dataPer.map(i => {
        if (i.times.length) {
          i.times.map(j => {
            period.push(j)
          })
        }
      })
      return period.length
    },

    minTimeStart () {
      let timeSelect = moment(this.data.discount_start_date).format('YYYY-MM-DD')
      let timeNow = moment().format('YYYY-MM-DD')
      if (moment(timeSelect).isSame(timeNow)) {
        return moment().format('HH:mm')
      } else {
        return ''
      }
    }
  },

  methods: {
    getLabelDayLeft (start_time, end_time) {
      var start = moment(start_time, "YYYY-MM-DD");
      var end = moment(end_time, "YYYY-MM-DD");
      var rangeDay = moment.duration(end.diff(start)).asDays()
      if (rangeDay > 30) {
        let dayleft = rangeDay % 30
        let rangeMonth = (rangeDay - dayleft)/30
        let label = dayleft > 0? rangeMonth + 'bl ' + dayleft + 'hr' : rangeMonth + 'bl'
        return label
      } else {
        return rangeDay + ' hr'
      }
    },

    handleCancel () {
      this.tempData = []
      this.tempDataDay = []
      this.data = {
        discount_start_date: '',
        discount_end_date: ''
      }
      this.active_max_promo = 0
      this.active_limit_per_customer = 0
      this.$emit('close')
    },

    handleCancelDay () {
      this.showDialogDay = false
      // this.tempData = []
      this.validDay = 0
      // this.allDay = 0
      // this.allPeriod = 0
    },
    
    changeDay (arg) {
      if (arg === 1) {
        if (this.tempDataDay.length) {
          this.getDataPeriod()
          this.validDay = arg 
          this.showDialogDay = true
        } else {
          this.$message({
            type: 'error',
            message: 'Silahkan pilih hari berlaku terlebih dahulu'
          })
        }
      } else {
        if (!this.tempDataDay.length) {
          this.dataDays.map(i => {
            if (i.checked) {
              this.handleCheckDay(i)
            }
          })
        } else {
          this.dataDays.map(i => {
            i.checked = false
            this.tempDataDay.map(j => {
              if (i.day_id === j.day_id) {
                i.checked = true
              }
            })
          })
        }
        this.validDay = arg 
        this.showDialogDay = true
      }
    },

    async getDataPeriod() {
      this.loading = true
      // this.dataPeriod = []
      // this.tempData = []
      await getDataPeriod({
        sort_column: 'id',
        sort_type: 'asc'
      }).then(response => {
        this.loading = false
        this.dataPeriod = [ ...response.data.data]
        // this.tempData = response.data.data
      }).catch(error => {
        console.log('err', error)
        this.dataPeriod = []
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loading = false
      })
    },

    handleCheck (data) {
      console.log('check', data)
      const exist = this.tempData.some(({time_id}) => time_id === data.time_id)
      if (exist) {
        this.tempData.map((i, idx) => {
          if (i.time_id === data.time_id) {
            this.tempData.splice(idx, 1)
          }
        })
      } else {
        this.tempData.push(data)
      }
      if (this.tempData.length < this.lengtTotalPeriod) { this.formData.is_all_periods = 0}
      else { this.formData.is_all_periods = 1}
    },

    handleCheckDay (data) {
      console.log('check', data)
      const exist = this.tempDataDay.some(({day_id}) => day_id === data.day_id)
      if (exist) {
        this.tempDataDay.map((i, idx) => {
          if (i.day_id === data.day_id) {
            this.tempDataDay.splice(idx, 1)
          }
        })
      } else {
        this.tempDataDay.push(data)
      }

      if (this.tempDataDay.length < this.dataDays.length) { this.formData.is_all_period_days = 0 }
      else { this.formData.is_all_period_days = 1 }
    },

    getLabelPeriod () {
      let start_time = []
      let end_time = []
      if (this.tempData.length) {
        this.tempData.map(i => {
          start_time.push(moment(i.start_time, 'HH:mm'))
          end_time.push(moment(i.end_time, 'HH:mm'))
        })
        let simbol = this.tempData.length > 1 ? ' ••• ' : ' - '
        let dday = moment.min(start_time).format('HH:mm') + simbol + moment.max(end_time).format('HH:mm')
        return dday
      } else {
        return '-'
      }
    },

    getLabelDay () {
      let days = []
      if (this.tempDataDay.length) {
        this.tempDataDay.map(i => {
          days.push(i.value)
        })

        let dday = days.length === 7? this.rootLang.all_days : days.join(', ')
        return dday
      } else {
        return '-'
      }
    },

    handleSaveItem () {
      if (this.validDay === 0) {
        if (this.dataPeriod.length === 0) {
          this.getDataPeriod()
        }
        console.log('da', this.dataPeriod)
        this.handleCheckPeriodAfterSelectDay()
      }
      this.showDialogDay = false
    },

    handleSaveDiscount () {
      // this.$emit('save', this.formData)
      let data = { ...this.formData}
      if (this.formData.disc_type === 3) {
        data.disc_scope_type = 1
      }
      if (this.formData.disc_type === 4) {
        data.disc_scope_type = 2
      }
      data.store_grabfood_id = this.dataGrabFoodId
      data.start_time = this.labelStatusCampaign(this.formData.start_time, this.formData.end_time).rangeDate > 0? moment(this.formData.discount_start_date + ' ' + this.formData.start_time).format('YYYY-MM-DD HH:mm:ss') : moment(this.formData.discount_start_date + ' ' + moment().add(1, 'minutes').format('HH:mm')).format('YYYY-MM-DD HH:mm:ss')
      data.end_time = moment(this.formData.discount_end_date + ' ' + this.formData.end_time).format('YYYY-MM-DD HH:mm:ss')
      if (data.is_all_periods === 1) {
        if (this.tempDataDay.length) {
          data.periods = []
          this.tempDataDay.map(i => {
            data.periods.push(i.day_id)
          })
        }
      } else if (data.is_all_periods === 0) {
        if (this.tempData.length) {
          data.periods = []
          this.tempData.map(i => {
            data.periods.push(i.time_id)
          })
        }
      }
      
      if (this.formData.disc_scope_items.length) {
        let temp = []
        this.formData.disc_scope_items.map(i => {
          temp.push(i.id)
        })
        data.disc_items = [ ...temp]
      }
      if (this.formData.disc_type === 4 && this.formData.product_discount.id) {
        data.disc_items = []
        data.disc_items.push(this.formData.product_discount.id)
      }
      data.id ? this.updateCampaign(data) : this.createCampaign(data)
    },

    async createCampaign(data) {
      this.loadingSave = true
      await createGrabCampaign(data).then(response => {
        this.loadingSave = false
        // this.dataPeriod = response.data.data
        this.dialogBeforeSave = false
        this.tempData = []
        this.tempDataDay = []
        this.active_max_promo = 0
        this.active_limit_per_customer = 0
        this.$emit('update')
      }).catch(error => {
        this.dataPeriod = []
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingSave = false
      })
    },

    async updateCampaign(data) {
      this.loadingSave = true
      await updateCampaign(data).then(response => {
        this.loadingSave = false
        // this.dataPeriod = response.data.data
        this.dialogBeforeSave = false
        this.tempData = []
        this.tempDataDay = []
        this.active_max_promo = 0
        this.active_limit_per_customer = 0
        this.$emit('update')
      }).catch(error => {
        this.dataPeriod = []
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingSave = false
      })
    },

    setProduct (data) {
      this.visibleSearchProduct = false
      // this.formData.disc_scope_items = [ ...data]
      data.map(i => {
        const exist = this.formData.disc_scope_items.filter(product => {
          return i.product_id === product.product_id
        })
        if (!exist.length) {
          // this.searchQuery = ''
          this.formData.disc_scope_items.push(i)
          // this.formAddProduct.price = item.buy_price
        } else {
          this.$message({
            type: 'error',
            message: 'Product' + i.alias_name + 'sudah ditambahkan dalam campaign'
          })
        }
      })
    },

    dateStartPicked (data) {
      // console.log(data)
      this.formData.discount_start_date = moment(data).format('yyyy-MM-DD')
      this.formData.discount_end_date = moment(this.formData.discount_start_date).add(6, 'days').format('yyyy-MM-DD')
      this.data.discount_end_date = this.formData.discount_end_date
      this.$forceUpdate()
    },
    dateEndPicked (data) {
      // console.log(data)
      this.formData.discount_end_date = moment(data).format('yyyy-MM-DD')
      this.$forceUpdate()
    },
    timeStartPicked () {
      this.formData.end_time = moment(this.formData.start_time, 'HH:mm').add(15, 'minutes').format('HH:mm')
      this.$forceUpdate()
    },

    setMaxPromo (data) {
      console.log('maxpromo', data)
      this.formData.total_count = data === 0? 0 : 1
      // this.active_max_promo = data
    },
    setMaxUser (data) {
      this.formData.total_count_per_user = data === 0? 0 : 1
    },

    handleInputPersen () {
      console.log('input', this.formData.disc_value)
      this.formData.disc_value = this.formData.disc_value > 100 ? 100 : this.formData.disc_value < 0 ? 0 : this.formData.disc_value
    },

    handleSelectProduct (data) {
      this.activeSelect = false
      this.formData.product_discount = { ...data}
      this.$forceUpdate()
    },

    async deleteCampaign() {
      this.loadingDelete = true
      await deleteCampaignGrab(this.formData.id).then(response => {
        this.loadingDelete = false
        this.dialogDelete = false
        // this.dataPeriod = response.data.data
        this.$emit('close')
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.dialogDelete = false
        this.loadingDelete = false
      })
    },

    handleClearProduct () {
      this.formData.product_discount = {}
      this.activeSelect = true
    },

    handleCheckAllDay (data) {
      if (data === 1) {
        this.tempDataDay = []
        this.dataDays.map(i => {
          i.checked = true
          this.tempDataDay.push(i)
        })
      } else {
        this.tempDataDay = []
        this.dataDays.map(i => {
          i.checked = false
          this.tempDataDay = []
        })
      }
    },

    handleCheckAllperiod (data) {
      if (data === 1) {
        this.tempData = []
        this.dataPer.map(i => {
          if (i.times.length) {
            i.times.map(j => {
              j.checked = true
              this.tempData.push(j)
            })
          }
        })
      } else {
        this.tempData = []
        this.dataPer.map(i => {
          if (i.times.length) {
            i.times.map(j => {
              j.checked = false
              this.tempData = []
            })
          }
        })
      }
    },

    handleCheckPeriodAfterSelectDay () {
      this.tempData = []
      this.dataPer.map(i => {
        if (i.times.length) {
          i.times.map(j => {
            if (j.checked) { this.tempData.push(j) }
          })
        }
      })
    },

    removeItemScope (idx) {
      this.formData.disc_scope_items.splice(idx, 1)
    },

    handleBeforeSave () {
      this.dialogBeforeSave = true
    },

    labelStatusCampaign (start, end) {
      let a = moment(this.data.discount_start_date).format('YYYY-MM-DD')
      let b = moment(this.data.discount_end_date).format('YYYY-MM-DD')
      let s = moment(a + ' ' + start)
      let t = moment(b + ' ' + end)
      let d = moment().format('YYYY-MM-DD')
      let date = moment().format('YYYY-MM-DD HH:mm')
      let thisDay = moment(date)
      let startDate = moment(s)
      // let startDate = moment('2021-10-09')
      let endDate = moment(end)
      // let rangeCampaing = this.getLabelDayLeft(this.formData.discount_start_date, this.formData.discount_end_date)
      let rangeDate = ''
      let label = ''
      console.log()
      if (moment(d).isSame(moment(this.data.discount_start_date))) {
        rangeDate = moment.duration(startDate.diff(thisDay)).asMinutes()
        // console.log('range1', rangeDate)
        if (rangeDate > 60) {
          let hoursleft = rangeDate % 60
          let rangeHours = (rangeDate - hoursleft)/60
          label = hoursleft > 0? 'Promo ' + this.rootLang.will_start + rangeHours + ' ' + this.rootLang.hours + ' ' + hoursleft + ' ' + this.rootLang.minute : 'Promo ' + this.rootLang.will_start + rangeHours + this.rootLang.hours
        } else if (rangeDate <= 0) {
          label = 'Waktu mulai promo sudah berlalu'
        } else {
          label = 'Promo ' + this.rootLang.will_start + rangeDate + ' ' + this.rootLang.minute
        }
      } else if (thisDay.isBefore(startDate)) {
        thisDay = moment(d)
        startDate = moment(a)
        // console.log('range2', moment.duration(startDate.diff(thisDay)).asDays())
        rangeDate = moment.duration(startDate.diff(thisDay)).asDays()
        if (rangeDate > 30) {
          let dayleft = rangeDate % 30
          let rangeMonth = (rangeDate - dayleft)/30
          label = dayleft > 0? 'Promo ' + this.rootLang.will_start + rangeMonth + ' ' + this.rootLang.months + ' ' + dayleft + ' ' + this.rootLang.day_left : this.rootLang.will_start + rangeMonth + this.rootLang.months
          // return label
        } else {
          label = 'Promo ' + this.rootLang.will_start + rangeDate + ' ' + this.rootLang.day_left
          // return label
        }
      } 
      // else if (thisDay.isAfter(startDate)) {

      // }
      let ended = ''
      if (moment.duration(moment(this.data.discount_start_date).diff(moment(this.data.discount_end_date))).asDays() === 0) {
        ended = moment.duration(moment(t).diff(moment(s))).asMinutes() + ' ' + this.rootLang.minute
      } else {
        let rDate = moment.duration(moment(this.data.discount_end_date).diff(moment(this.data.discount_start_date))).asDays()
        if (rDate > 30) {
          let dleft = rDate % 30
          let rMonth = (rDate - dleft)/30
          ended = dleft > 0? rMonth + ' ' + this.rootLang.months + ' ' + dleft + ' ' + this.rootLang.day_left : rMonth + this.rootLang.months
        } else {
          ended = rDate + ' ' + this.rootLang.day_left
        }
      }

      return {label, rangeDate, ended}
    },
  }
}
</script>