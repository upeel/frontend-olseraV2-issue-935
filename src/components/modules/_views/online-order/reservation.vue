<template>
  <div class="shippings">
    <div
      v-if="bannerOrder"
      class="banner-reservation">
      <div class="text_banner" >
        <span class="font-32 font-bold">{{ rootLang.reservation }}</span>
        <div class="subtitle">{{ $lang[langId].subtitle_banner_reservation }}</div>
      </div>
      <el-button
        type="text"
        icon="el-icon-close"
        class="button-close-banner"
        @click="handleBanner"
      />
    </div>

    <el-card
      v-loading="loading"
      class="card_devtime box-card">
      <el-table
        :data="tableData"
        :show-header="false"
        stripe
        style="width: 100%">
        <el-table-column label="Day" >
          <template slot-scope="scope">
            <div class="flex-container">
              <el-row>
                <el-col>
                  <span class="font-14 font-bold">{{ scope.row.name }}</span>
                </el-col>
                <el-col v-if="scope.row.id === 'expected_duration_reservation'">
                  <span class="font-12">{{ getLabelValue(scope.row.value) }}</span>
                </el-col>
                <el-col v-else-if="scope.row.id === 'maximum_time_for_reservation'">
                    <span v-if="tempSetting.type_time_reservation === 0" class="font-12">Kapanpun</span>
                    <span v-else class="font-12">{{ scope.row.value }}</span>
                </el-col>
                <el-col v-else-if="scope.row.id === 'reservation_payment_terms'">
                  <span v-if="tempSetting.reservation_payment_terms === 2" class="font-12">{{ scope.row.value }} ({{ tempSetting.reservation_payment_terms_amount }})</span>
                  <span v-else class="font-12">{{ scope.row.value }}</span>
                </el-col>
                <el-col v-else>
                  <span class="font-12">{{ scope.row.value }}</span>
                </el-col>
              </el-row>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="right">
          <template slot-scope="scope">
            <div class="card-buttons">
              <el-button type="text" circle @click="handleEditSetting(scope.row)" style="margin-right: 10px" >
                <svg-icon icon-class="edit-2" />
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="box-card">
      <div class="flex-container mb-20 pt-4" v-loading="loadingSaveSetting">
        <div class="font-18 font-bold full-width">{{ $lang[langId].reservation_time }}</div>
        <el-switch
            v-model="tempSetting.reservation_time_enabled"
            :active-value="1"
            :inactive-value="0"
            @change="updateDeliverySetting"
          />
      </div>

      <el-table
        v-if="tempSetting.reservation_time_enabled === 1"
        ref="multipleTable"
        v-loading="loadingWorkingHours"
        stripe
        :data="dataWorkingHours"
        style="width: 100%"
        :show-header="false">
        <el-table-column width="55">
          <template slot-scope="scope">
            <el-checkbox v-model="day[scope.$index]" @change="handleSelectionChange(day[scope.$index], scope.row)"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="Day" width="120">
          <template slot-scope="scope">{{ scope.row.day_name }}</template>
        </el-table-column>
        <el-table-column property="working_hours" label="Working Hours" align="right" >
          <template slot-scope="scope">
            <div v-if="scope.row.enabled === 0">
              <el-tag v-for="(i, iKey) in scope.row.times" :key="iKey" color="#F5F5F5" style="color: #000000; margin-right: 5px">{{ getTimeFormat(i.fstart_time, i.fend_time) }}</el-tag>
              <el-button type="text" icon="el-icon-edit" circle @click="editHours(scope.row)" />
            </div>
            <div v-else>
              <el-tag v-for="(i, iKey) in scope.row.times" :key="iKey" color="#E4F8FF" style="color: #000000; margin-right: 5px">{{ getTimeFormat(i.fstart_time, i.fend_time) }}</el-tag>
              <el-button type="text" icon="el-icon-edit" circle @click="editHours(scope.row)" />
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-table
        v-loading="loadingWorkingHours"
        ref="multipleTable"
        stripe
        :data="dataWorkingHours"
        style="width: 100%"
        :show-header="false"
        @selection-change="handleSelectionChange">
        <el-table-column width="55" fixed>
          <template slot-scope="scope">
            <el-checkbox v-model="day[scope.$index]" @change="handleSelectionChange(day[scope.$index], scope.row)"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="Day" width="120" fixed>
          <template slot-scope="scope">{{ scope.row.day_name }}</template>
        </el-table-column>
        <el-table-column property="working_hours" label="Working Hours" align="right" :width="getWidht" >
          <template slot-scope="scope">
            <div v-if="scope.row.enabled === 0">
              <el-tag v-for="(i, iKey) in scope.row.times" :key="iKey" color="#F5F5F5" style="color: #000000; margin-right: 5px">{{ i.ftime }}</el-tag>
            </div>
            <div v-else>
              <el-tag v-for="(i, iKey) in scope.row.times" :key="iKey" color="#E4F8FF" style="color: #000000; margin-right: 5px">{{ i.ftime }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="action" fixed="right" width="55">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-edit" circle @click="editHours(scope.row)" />
          </template>
        </el-table-column>
      </el-table> -->
    </el-card>

    <el-dialog
      :visible.sync="dialogEditHours"
      :show-close="false"
      custom-class="dialog-card">
      <div slot="title" class="flex-container">
        <div class="full-width">
          <h4 class="dialog-title">{{ lang.edit + ' ' + $lang[langId].working_hours }}</h4>
        </div>
        <div class="full-width text-right">
          <el-button type="info" @click="handleCancelTime">{{ lang.cancel }}</el-button>
          <el-button type="success" @click="handleSaveTime" >{{ lang.save }}</el-button>
        </div>
      </div>

      <div v-for="(i, idx) in countTime" :key="idx" class="working_hours_input">
        <el-row :gutter="10">
          <el-col :sm="12">
            <div>{{ lang.start }}</div>
            <el-time-picker
              v-if="idx === 0"
              v-model="i.fstart_time"
              :picker-options="{
                maxTime: countTime[idx].fend_time,
                format: 'HH:mm'
              }"
              :placeholder="lang.start_time"
              style="width: 100%">
            </el-time-picker>
            <el-time-picker
              v-else
              v-model="i.fstart_time"
              :picker-options="{
                maxTime: countTime[idx].fend_time,
                format: 'HH:mm'
              }"
              :placeholder="lang.start_time"
              style="width: 100%">
            </el-time-picker>
          </el-col>

          <el-col v-if="idx === 0" :sm="12">
            <div>{{ lang.end }}</div>
            <el-time-picker
              v-if="countTime.length > 1"
              v-model="i.fend_time"
              :placeholder="lang.end_time"
              :picker-options="{
                minTime: i.fstart_time,
                maxTime: countTime[idx+1].fstart_time,
                format: 'HH:mm'
              }"
              style="width: 100%">
            </el-time-picker>
            <el-time-picker
              v-else
              v-model="i.fend_time"
              :placeholder="lang.end_time"
              :picker-options="{
                minTime: i.fstart_time,
                format: 'HH:mm'
              }"
              style="width: 100%">
            </el-time-picker>
          </el-col>

          <el-col v-else :sm="12">
            <div>{{ lang.end }}</div>
            <el-time-picker
              v-if="countTime.length > idx+1"
              v-model="i.fend_time"
              :placeholder="lang.end_time"
              :picker-options="{
                minTime: i.fstart_time,
                maxTime: countTime[idx+1].fstart_time,
                format: 'HH:mm'
              }"
              style="width: 100%">
            </el-time-picker>
            <el-time-picker
              v-else
              v-model="i.fend_time"
              :placeholder="lang.end_time"
              :picker-options="{
                minTime: i.fstart_time,
                format: 'HH:mm'
              }"
              style="width: 100%">
            </el-time-picker>
          </el-col>
        </el-row>

        <div v-if="countTime.length > 1 && idx !== countTime.length - 1">
          <el-tag color="#F5F5F5" class="tag_break">
            <svg-icon
              icon-class="break"
              v-if="breakTime(countTime[idx].fend_time, countTime[idx+1].fstart_time ) !== '0 ' + $lang[langId].minute "
            />
            {{ breakTime(countTime[idx].fend_time, countTime[idx+1].fstart_time ) }}

            <el-button type="text" @click="handleDelTime(idx)" style="color: #000000">X</el-button>
          </el-tag>
        </div>
      </div>
      <el-button v-if="computedAddTime" class="btn_add_break" @click="addTime">{{ lang.add }} {{ $lang[langId].working_time }}</el-button>
    </el-dialog>

    <div v-if="isEdit" class="floating_div" :style="computedRes">
      <floating-div @confirm="updateDeliveryHours" @cancel="setCancel"></floating-div>
    </div>

    <el-dialog
      :visible.sync="dialogEdit"
      :show-close="false"
      :close-on-click-modal="false"
      custom-class="dialog-card">
      <div slot="title" class="flex-container">
        <h4 class="dialog-title full-width font-bold">{{ tempEdit.name }}</h4>
        <div class="btn_save_dialog full-width text-right">
          <el-button type="info" @click="handleCloseSetting">{{ lang.cancel }}</el-button>
          <el-button
            :loading="loadingSaveSetting"
            type="success"
            @click="updateDeliverySetting">
            {{ lang.save }}
          </el-button>
        </div>
      </div>
      <div class="free_delivery_input mb-12">
        <template v-if="tempEdit.id === 'minimum_order_amount'">
          <div class="mb-12">
            <div class="font-12">{{ $lang[langId].minimum_transaction }}</div>
            <input-money
              v-bind="money"
              v-model="tempSetting.minimum_order_amount"
            />
          </div>
        </template>
        <template v-if="tempEdit.id === 'max_visitors'">
          <div class="mb-12">
            <div class="font-12">{{ $lang[langId].max_visitor }}</div>
            <el-input
              v-model="tempSetting.max_visitors"
              :min="1"
              type="number">
              <template slot="append">Orang</template>
            </el-input>
          </div>
        </template>
        <template v-if="tempEdit.id === 'expected_duration_reservation'">
          <div class="mb-12">
            <div class="font-12">{{ $lang[langId].estimated_reservation_duration }}</div>
            <el-input
              v-model="tempSetting.expected_duration_reservation"
              :min="1"
              type="number">
              <template slot="append">Menit</template>
            </el-input>
            <div class="mt-24 p-12 color-info--bg flex-container">
              <svg-icon icon-class="information-circle" class="color-info" />
              <div class="word-break ml-4">
                Prakiraan durasi reservasi akan membantu Anda mengelola ketersediaan reservasi
              </div>
            </div>
          </div>
        </template>
        <template v-if="tempEdit.id === 'maximum_time_for_reservation'">
          <div class="mb-12">
            <div class="font-12">{{ rootLang.reservation_create_time }}</div>
            <el-radio-group
              v-model="tempSetting.type_time_reservation"
              class="full-width flex-container border border--info">
              <el-radio-button class="lpoint-type" :label="0">
                {{ rootLang.any_time }}
              </el-radio-button>
              <el-radio-button class="lpoint-type" :label="1">
                {{ rootLang.limited }}
              </el-radio-button>
            </el-radio-group>
            <div v-if="tempSetting.type_time_reservation === 1" class="mt-24">
              <el-input
                v-model="tempSetting.maximum_time_for_reservation"
                min="1"
                type="number"
                class="switch-discount"
                @input="validateNoMinus('time')">
                <template slot="append">
                  <el-radio-group v-model="tempSetting.maximum_time_for_reservation_type" class="flex-container">
                    <el-radio-button class="lpoint-type" :label="0">
                      {{ rootLang.day }}
                    </el-radio-button>
                    <el-radio-button class="lpoint-type" :label="1">
                      {{ rootLang.minute }}
                    </el-radio-button>
                  </el-radio-group>
                </template>
              </el-input>
              <span class="color-info font-12">{{ labelStatusCampaign().label }}</span>
            </div>

            <div v-if="tempSetting.type_time_reservation === 1" class="mt-24 p-12 color-info--bg flex-container">
              <svg-icon icon-class="information-circle" class="color-info" />
              <div class="word-break ml-4">
                Pelanggan dapat melakukan reservasi hingga <span class="font-bold">{{ tempSetting.maximum_time_for_reservation }} {{ tempSetting.maximum_time_for_reservation_type === 0? rootLang.day : rootLang.minute }}</span> sebelum reservasi terlaksana
              </div>
            </div>
          </div>
        </template>
        <template v-if="tempEdit.id === 'reservation_payment_terms'">
          <div class="mb-12">
            <div class="font-12">{{ rootLang.reservation_term }}</div>
            <el-radio-group
              v-model="tempSetting.reservation_payment_terms"
              class="full-width flex-container border border--info">
              <el-radio-button class="lpoint-type" :label="1">
                Bayar Penuh
              </el-radio-button>
              <el-radio-button class="lpoint-type" :label="2">
                Bayar Sebagian
              </el-radio-button>
              <el-radio-button class="lpoint-type" :label="3">
                Tanpa Pembayaran
              </el-radio-button>
            </el-radio-group>
            <div v-if="tempSetting.reservation_payment_terms === 2" class="mt-24">
              <el-input
                v-model="tempSetting.reservation_payment_terms_amount"
                min="1"
                type="number"
                class="switch-discount"
                @input="validateNoMinus('term')">
                <template slot="append">
                  <el-radio-group v-model="tempSetting.reservation_payment_terms_amount_type" class="flex-container" @change="validateNoMinus('term')">
                    <el-radio-button class="lpoint-type" :label="0">
                      IDR
                    </el-radio-button>
                    <el-radio-button class="lpoint-type" :label="1">
                      %
                    </el-radio-button>
                  </el-radio-group>
                </template>
              </el-input>
              <span class="color-info font-12">{{ labelStatusCampaign().label }}</span>
            </div>

            <div v-if="tempSetting.reservation_payment_terms === 1 || tempSetting.reservation_payment_terms === 2" class="mt-24 p-12 color-info--bg flex-container">
              <div class="container-icon">
                <svg-icon icon-class="information-circle" class="color-info" />
              </div>
              <div v-if="tempSetting.reservation_payment_terms === 1" class="word-break ml-4">
                Pembeli harus <span class="font-bold">membayar penuh</span> di muka untuk melakukan reservasi.
              </div>
              <div v-if="tempSetting.reservation_payment_terms === 2" class="word-break ml-4">
                Pembeli harus <span class="font-bold">membayar sebagian</span> dari total pesanan di muka untuk melakukan reservasi.
              </div>
            </div>

            <div v-if="tempSetting.reservation_payment_terms === 3" class="mt-24 p-12 color-warning--soft--bg flex-container">
              <div class="container-icon">
                <svg-icon icon-class="information-circle" class="color-warning" />
              </div>
              <div class="word-break ml-4">
                Pembeli <span class="font-bold"> tidak harus membayar </span> full di muka untuk melakukan reservasi. Namun pembeli akan dikenai Convenience Fee 1% dari minimal total transaksi Rp 50.000
              </div>
            </div>
          </div>
        </template>
        <!-- <div class="activated_delivery">
          <div style="flex-grow: 2;">
            {{ $lang[langId].activate_free_delivery }}
          </div>
          <div class="div_switch" style="margin-left: 8px;">
            <span v-if="tempSetting.enabled === 1">{{ lang.yes }}</span>
            <span v-else>{{ lang.no }}</span>
            <el-switch
              v-model="tempSetting.enabled"
              :active-value="1"
              :inactive-value="0"
            />
          </div>
        </div>

        <div class="mb-12">
          <div class="font-12">{{ $lang[langId].radius_free_delivery }}</div>
          <el-input
            v-model="tempSetting.radius_free_delivery"
            :disabled="!tempSetting.enabled"
            :min="1"
            :max="100"
            type="number">
            <template slot="append">Km</template>
          </el-input>
        </div>

        <div class="mb-12">
          <div class="font-12">{{ $lang[langId].minimum_order }}</div>
          <input-money
            v-bind="money"
            v-model="tempSetting.minimum_order"
          />
        </div>

        <div class="mb-12">
          <div class="font-12">{{ $lang[langId].cost_outside_radius }}</div>
          <input-money
            v-bind="money"
            v-model="tempSetting.cost_outside_radius"
            append="/Km"
          />
        </div>

        <div class="mb-12">
          <div class="font-12">{{ $lang[langId].max_radius_delivery }}</div>
          <el-input
            v-model="tempSetting.max_radius_delivery"
            :min="1"
            type="number">
            <template slot="append">Km</template>
          </el-input>
        </div>

        <div class="mb-12">
          <div class="flex-container flex-container--content-space-between mb-4">
            <div class="font-12">{{ $lang[langId].max_item_order }}</div>
            <div>
              <span class="font-12">Unlimited ? </span>
              <el-switch
                v-model="tempSetting.unlimited_items_order"
                :active-value="1"
                :inactive-value="0"
              />
            </div>
          </div>
          <el-input
            v-model="tempSetting.maximum_items_order"
            :disabled="tempSetting.unlimited_items_order"
            :min="1"
            type="number"
          />
        </div>

        <div class="mb-12">
          <div class="font-12">{{ $lang[langId].duration_order_proses }}</div>
          <el-time-picker
            v-model="tempSetting.duration_order_process"
            value-format="HH:mm"
            :picker-options="{
              format: 'HH:mm'
            }"
            :placeholder="$lang[langId].delivery_time"
            style="width: 100%">
          </el-time-picker>
        </div> -->
      </div>
    </el-dialog>
  </div>
</template>
<script>
import FloatingDiv from '../../FloatingDiv'
import { baseApi } from 'src/http-common'
import axios from 'axios'
import InputMoney from '@/components/InputMoneyV2'
import basicComputedMixin from '@/mixins/basicComputedMixin'

import { listReservation, updateReservation, timeReservation, updateTimeReservation } from '@/api/onlineorder'
var moment = require('moment')

export default {
  name: 'Reservation',
  mixins: [basicComputedMixin],
  components: {
    FloatingDiv,
    InputMoney
    // International,
    // Free
  },

  data() {
    return {
      money: {
        prefix: 'IDR ',
      },
      tableData: [{
        name: this.$lang[this.$store.state.userStores.langId].min_total_order,
        id: 'minimum_order_amount',
        value: ''
      },
      {
        name: this.$lang[this.$store.state.userStores.langId].max_visitor,
        id: 'max_visitors',
        value: ''
      },
      {
        name: this.$lang[this.$store.state.userStores.langId].max_time_reservation,
        id: 'maximum_time_for_reservation',
        value: ''
      },
      {
        name: this.$lang[this.$store.state.userStores.langId].estimated_reservation_duration,
        id: 'expected_duration_reservation',
        value: ''
      },
      {
        name: this.$lang[this.$store.state.userStores.langId].reservation_term,
        id: 'reservation_payment_terms',
        value: ''
      }],
      dialogEdit: false,
      dialogEditHours: false,
      countTime: [
        {
          fstart_time: '00:00',
          fend_time: '00:00',
          start_time: '00:00',
          end_time: '00:00',
        }
      ],
      isEdit: false,
      inactive: 1,
      deliverySetting: {},
      tempSetting: {},
      disabledOrder: false,
      dataWorkingHours: [],
      tempWorking: [],
      day: [
        false,false,false,false,false,false,false
      ],
      tempDayId: 0,
      tempTable: [],
      loading: false,
      loadingWorkingHours: false,
      enabledDelivery: false,
      loadingSaveSetting: false,
      tempEdit: {},
      reservation_type: 0
    }
  },

  computed: {
    getWidht () {
      var number = []
      this.dataWorkingHours.map(i => {
        number.push(i.times.length)
      })
      var widht = '500'
      if (Math.max(...number) <= 12) {
        widht = '750'
      } else if (Math.max(...number) <= 20) {
        widht = '1200'
      } else if (Math.max(...number) > 20) {
        widht = '1600'
      }
      return widht
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    token() {
      return this.$store.state.user.token
    },
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    bannerOrder() {
      const localVisibleBanner = this.$store.state.bannerOnlineOrder.delivery
      if (localVisibleBanner) return parseInt(localVisibleBanner)
    },
    computedDisableSaveFreeDelivery() {
      if (
        (this.tempSetting.radius_free_delivery <= 0 && this.tempSetting.enabled) ||
        this.tempSetting.cost_outside_radius <= 0 ||
        this.tempSetting.max_radius_delivery <= 0 ||
        (this.tempSetting.maximum_items_order <= 0 && !this.tempSetting.unlimited_items_order)
      ) {
        return true
      } else {
        return false
      }
    },
    computedRes () {
      // var elmt = document.getElementsByClassName('tab-content')[0].offsetWidth
      var w = document.getElementsByClassName('tab-content')[0].offsetWidth
      // var h = window.innerHeight
      let cls = 'max-width: ' + w + 'px; padding-right: unset !important'
      return cls
    },

    computedAddTime () {
      let time = moment(this.countTime[this.countTime.length - 1].fend_time).format('HH:mm')
      if (time !== '00:00') {
        return true
      } else {
        return false
      }
    }
  },


  mounted () {
    this.getReservationSetting()
    this.getDeliveryHours()
  },

  methods: {
    getReservationSetting() {
      this.loading = true

      listReservation().then(async response => {
        this.deliverySetting = response.data.data
        this.tempSetting = { ...response.data.data}
        // this.deliverySetting.cost_outside_radius = parseInt(this.deliverySetting.cost_outside_radius)
        // this.deliverySetting.minimum_order = parseInt(this.deliverySetting.minimum_order)
        // this.inactive = response.data.data.enabled
        // if (response.data.data.enabled === 0) {
        //   this.enabledDelivery = true
        // } else {
        //   this.enabledDelivery = false
        // }
        await this.setupTableSettingData(response)
        this.loading = false
      }).catch(error => {
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
        this.loading = false
      })
    },

    updateDeliverySetting() {
      this.loadingSaveSetting = true

      updateReservation(this.tempSetting).then(async response => {
        this.dialogEdit = false
        this.tempSetting = { ...response.data.data}
        this.deliverySetting = response.data.data
        // this.deliverySetting.cost_outside_radius = parseInt(this.deliverySetting.cost_outside_radius)
        // this.deliverySetting.minimum_order = parseInt(this.deliverySetting.minimum_order)
        // this.inactive = response.data.data.enabled
        await this.setupTableSettingData(response)
        this.loadingSaveSetting = false
      }).catch(error => {
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
        this.dialogEdit = false
        this.tempSetting = {}
        this.loadingSaveSetting = false
      })
    },

    async setupTableSettingData(response) {
      await this.tableData.map(i => {
        if (i.id === 'minimum_order_amount') {
          i.value = response.data.data.fminimum_order_amount
        }
        if (i.id === 'max_visitors') {
          i.value = response.data.data.max_visitors + ' ' + this.rootLang.visitor
        }
        if (i.id === 'maximum_time_for_reservation') {
          i.value = response.data.data.maximum_time_for_reservation_type === '0'? response.data.data.maximum_time_for_reservation + ' ' +  this.rootLang.day : response.data.data.maximum_time_for_reservation + ' ' + this.rootLang.minute
        }
        if (i.id === 'expected_duration_reservation') {
          i.value = response.data.data.expected_duration_reservation
        }
        if (i.id === 'reservation_payment_terms') {
          i.value = response.data.data.reservation_payment_terms === 1? 'Bayar Penuh' : response.data.data.reservation_payment_terms === 2? 'Bayar Sebagian' : 'Tanpa Pembayaran'
        }
      })
    },

    handleEditSetting (data) {
      this.tempEdit = { ...data}
      this.tempSetting = { ...this.deliverySetting }
      this.dialogEdit = true
    },

    handleCloseSetting () {
      this.tempSetting = {}
      this.dialogEdit = false
    },

    handleChangeSetting (value) {
      this.tempSetting = this.deliverySetting
      this.tempSetting.enabled = value
      this.updateDeliverySetting()
    },

    handleSelectionChange (i, data) {
      if (i) {
        this.tempWorking.map(i => {
          if (i.day_id === data.day_id) {
            i.enabled = 1
          }
        })
      } else {
        this.tempWorking.map(i => {
          if (i.day_id === data.day_id) {
            i.enabled = 0
          }
        })
      }
      this.isEdit = true
    },

    getDeliveryHours() {
      this.loadingWorkingHours = true
      this.tempWorking = []
      timeReservation().then(response => {
          // console.log('data', response.data.data)
          this.dataWorkingHours = response.data.data
          this.dataWorkingHours.map((i, idx) => {
            if (i.enabled === 1) {
              this.day[idx] = true
            } else {
              this.day[idx] = false
            }

            if (i.times.length > 0) {
              var time = []
              i.times.map(j => {
                j.fstart_time = moment('08/05/2015 ' + j.fstart_time).format()
                j.fend_time = moment('08/05/2015 ' + j.fend_time).format()

                time.push({
                  start_time: j.start_time,
                  end_time: j.end_time
                })
              })
              this.tempWorking.push({
                day_id: i.day_id,
                enabled: i.enabled,
                times: time
              })
            } else {
              this.tempWorking.push({
                day_id: i.day_id,
                enabled: i.enabled,
                times: i.times
              })
            }
          })
          this.loadingWorkingHours = false
        })
        .catch(error => {
          if (error.response.data.error.status_code !== 404) {
            this.$notify({
              type: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error
            })
          }
          this.loadingWorkingHours = false
        })
    },

    editHours (data) {
      this.tempTable = this.dataWorkingHours
      this.tempDayId = data.day_id
      if (data.times.length !== 0) {
        this.countTime = data.times
      }
      this.countTime.map(i => {
        i.fend_time = moment(i.fend_time).format()
        i.fstart_time = moment(i.fstart_time).format()
      })
      this.dialogEditHours = true
    },

    addTime () {
      var d2 = new Date(this.countTime[this.countTime.length - 1].fend_time)
      var startTime = moment(d2).add(1, 'h').toDate();
      var endTime = moment(d2).add(75, 'm').toDate();
      var minTime = moment(d2).subtract(15, 'm').toDate();
      this.countTime[this.countTime.length - 1].break = '1 ' + this.lang.hour
      this.countTime.push({
        fstart_time: moment(startTime).format(),
        // fend_time: moment(endTime).format('HH:mm'),
        min_time: moment(minTime).format()
      })
    },

    breakTime (startTime, endTime) {
      // var date1 = new Date('08/05/2015 ' + startTime)
      // var date2 = new Date('08/05/2015 ' + endTime)

      var date1 = new Date(startTime)
      var date2 = new Date(endTime)

      var diff = date2.getTime() - date1.getTime()
      var msec = diff
      var hh = Math.floor(msec / 1000 / 60 / 60)
      msec -= hh * 1000 * 60 * 60;
      var mm = Math.floor(msec / 1000 / 60);
      if (hh !== 0) {
        if (mm !== 0) {
          return this.$lang[this.langId].break + ' ' + hh + ' ' + this.lang.hour + ' ' + mm + ' ' + this.$lang[this.langId].minute
        } else {
          return this.$lang[this.langId].break + ' ' + hh + ' ' + this.lang.hour
        }
      } else {
        if (mm !== 0) {
          return this.$lang[this.langId].break + ' ' + mm + ' ' + this.$lang[this.langId].minute
        } else {
          return this.$lang[this.langId].no_break
        }
      }

      this.countTime = tempTime
    },

    handleDelTime (idx) {
      this.countTime.splice(idx+1, 1)
    },

    handleCancelTime () {
      this.countTime = [{
        fstart_time: '00:00',
        fend_time: '00:00',
        start_time: '00:00',
        end_time: '00:00',
      }]

      this.dialogEditHours = false
      this.getDeliveryHours()
    },

    handleSaveTime () {
      var tempTime = []
      this.countTime.map(i => {
        tempTime.push({
          start_time: moment(i.fstart_time).format('HH:mm'),
          end_time: moment(i.fend_time).format('HH:mm')
          // break: i.break
        })
      })

      this.countTime = [{
        fstart_time: '08:00',
        fend_time: '17:00'
      }]
      this.tempWorking.map(i => {
        if (i.day_id === this.tempDayId) {
          i.times = tempTime
        }
      })

      this.tempWorking.map(j => {
        if (j.times.length) {
          j.times.map(k => {
            k.start_time = moment('08/05/2015 ' + k.start_time).format('HH:mm')
            k.end_time = moment('08/05/2015 ' + k.end_time).format('HH:mm')
          })
        }
      })

      this.updateDeliveryHours()
      this.dialogEditHours = false
    },

    updateDeliveryHours(data) {
      this.loadingWorkingHours = true
      var data = {
        reservation: this.tempWorking
      }

      console.log('time', this.tempWorking)
      updateTimeReservation(data).then(response => {
          this.getDeliveryHours()
          this.isEdit = false
          this.loadingWorkingHours = false
        })
        .catch(error => {
          if (error.response.data.error.status_code !== 404) {
            this.$notify({
              type: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error
            })
          }
          this.loadingWorkingHours = false
        })
    },

    setCancel () {
      this.isEdit = false
    },

    handleBanner () {
      var data = {
        id: 2,
        value: 0
      }
      this.$store.commit('SET_BANNER_ORDER', data)
    },

    handleActivated (data) {
      if (data === 0) {
        this.tempSetting.radius_free_delivery = 0
        this.enabledDelivery = true
      } else {
        this.enabledDelivery = false
      }
    },

    handleCreateTime () {
      this.countTime.sort((a, b) => (a.ftime < b.ftime) ? -1 : ((a.ftime > b.ftime) ? 1 : 0))
      console.log('countime', this.countTime)
    },

    getTimeFormat(start, end) {
      console.log('start', start)
      return moment(start).format('HH:mm') + ' - ' + moment(end).format('HH:mm')
      // return start + ' - ' + end
    },

    labelStatusCampaign () {
      let start = '00:00'
      let a = moment().format('YYYY-MM-DD')
      let s = moment(a + ' ' + start)
      let d = moment().format('YYYY-MM-DD')
      let date = moment().format('YYYY-MM-DD HH:mm')
      let thisDay = moment(date)
      let startDate = moment(s)
      let rangeDate = ''
      let label = ''
      
      if (this.tempSetting.maximum_time_for_reservation_type === 1) {
        // rangeDate = moment.duration(startDate.diff(thisDay)).asMinutes()
        rangeDate = this.tempSetting.maximum_time_for_reservation
        if (rangeDate > 60) {
          let hoursleft = rangeDate % 60
          let rangeHours = (rangeDate - hoursleft)/60
          label = hoursleft > 0? rangeHours + ' ' + this.rootLang.hours + ' ' + hoursleft + ' ' + this.rootLang.minute : rangeHours + ' ' + this.rootLang.hours
        } else if (rangeDate <= 0) {
          label = ''
        } else {
          label = rangeDate + ' ' + this.rootLang.minute
        }
      } else if (this.tempSetting.maximum_time_for_reservation_type === 0) {
        thisDay = moment(d)
        startDate = moment(a)
        rangeDate = this.tempSetting.maximum_time_for_reservation
        if (rangeDate === null) {
          label = ''
        } else if (rangeDate > 30) {
          let dayleft = rangeDate % 30
          let rangeMonth = (rangeDate - dayleft)/30
          label = dayleft > 0? rangeMonth + ' ' + this.rootLang.months + ' ' + dayleft + ' ' + this.rootLang.day_left : rangeMonth + ' ' + this.rootLang.months
        } else if (rangeDate < 30) {
          label = rangeDate + ' ' + this.rootLang.day_left
        } else {
          label = ''
        }
      }

      return {label, rangeDate}
    },

    validateNoMinus (args) {
      if (args === 'time') {
        if (this.tempEdit.maximum_time_for_reservation <= 0) {
          this.tempEdit.maximum_time_for_reservation = 1
        }
      }
      if (args === 'term' && this.tempSetting.reservation_payment_terms_amount_type && this.tempSetting.reservation_payment_terms_amount_type === 0) {
        if (parseInt(this.tempSetting.reservation_payment_terms_amount) <= 0) {
          this.tempSetting.reservation_payment_terms_amount = 1
        }
      }
      if (args === 'term' && this.tempSetting.reservation_payment_terms_amount_type && this.tempSetting.reservation_payment_terms_amount_type === 1) {
        if (parseInt(this.tempSetting.reservation_payment_terms_amount) <= 0) {
          this.tempSetting.reservation_payment_terms_amount = 1
        }
        if (parseInt(this.tempSetting.reservation_payment_terms_amount) >= 100) {
          this.tempSetting.reservation_payment_terms_amount = 99
        }
      }
    },

    getLabelValue (data) {
      let label = ''
      let rangeDate = data
      if (rangeDate > 60) {
        let hoursleft = rangeDate % 60
        let rangeHours = (rangeDate - hoursleft)/60
        label = hoursleft > 0? rangeHours + ' ' + this.rootLang.hours + ' ' + hoursleft + ' ' + this.rootLang.minute : rangeHours + ' ' + this.rootLang.hours
      } else if (rangeDate <= 0) {
        label = ''
      } else {
        label = rangeDate + ' ' + this.rootLang.minute
      }

      return label
    }
  }
}
</script>

