<template>
  <div class="shippings">
    <div
      v-if="bannerOrder"
      class="banner-delivery">
      <div class="text_banner" >
        <span class="title">{{ $lang[langId].title_banner_delivery }}</span>
        <div class="subtitle">{{ $lang[langId].subtitle_banner_delivery }}</div>
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
      <template v-if="stageLevel === 'dev' || stageLevel === 'sit'">
        <div slot="header" class="clearfix">
          <h4> {{ $lang[langId].private_delivery }}</h4>
          <div class="card-buttons">
            <el-switch
              v-model="deliverySetting.turn_off_private_courier"
              :active-value="0"
              :inactive-value="1"
              @change="handleChangePrivateCourier">
            </el-switch>
          </div>
        </div>

        <template v-if="deliverySetting.turn_off_private_courier === 1">
          <div class="color-info--bg p-8 text-center mb-24 mt-12">
            <img src="/static/img/online-order/no_active_delivery.png" class="image" style="margin-top: 32px">
            <div class="font-bold font-18" >Nyalakan pelatuk untuk mengaktifkan Pengiriman Sendiri</div>
          </div>
        </template>
        <template v-else>
          <div class="flex-container like-table-wrapper--item p-20">
            <div class="container-icon">
              <svg-icon icon-class="icon-delivery" class="font-20" />
            </div>
            <div class="full-width">
              <div class="font-14 font-semi-bold">{{ rootLang.radius_free_delivery }}</div>
              <span class="font-12 color-grey--placeholder">{{ deliverySetting.enabled === 0? lang.disabled : deliverySetting.fminimum_order + ' • ' + deliverySetting.radius_free_delivery + ' Km' }}</span>
            </div>
            <div class="pointer" @click="handleEditSetting">
              <svg-icon icon-class="edit-2" class="font-20 color-primary"/>
            </div>
          </div>

          <div class="flex-container like-table-wrapper--item p-20">
            <div class="container-icon">
              <svg-icon icon-class="icon-delivery" class="font-20" />
            </div>
            <div class="full-width">
              <div class="font-14 font-semi-bold">{{ rootLang.minimum_order }}</div>
              <span class="font-12 color-grey--placeholder">{{ deliverySetting.fminimum_order }}</span>
            </div>
            <div class="pointer" @click="handleEdit('minorder')">
              <svg-icon icon-class="edit-2" class="font-20 color-primary"/>
            </div>
          </div>

          <div class="flex-container like-table-wrapper--item p-20">
            <div class="container-icon">
              <svg-icon icon-class="icon-rp+" class="font-20" />
            </div>
            <div class="full-width">
              <div class="font-14 font-semi-bold">{{ rootLang.cost_outside_radius }}</div>
              <span class="font-12 color-grey--placeholder">{{ deliverySetting.fcost_outside_radius }}</span>
            </div>
            <div class="pointer" @click="handleEdit('costoutside')">
              <svg-icon icon-class="edit-2" class="font-20 color-primary"/>
            </div>
          </div>

          <div class="flex-container like-table-wrapper--item p-20">
            <div class="container-icon">
              <svg-icon icon-class="icon-delivery" class="font-20" />
            </div>
            <div class="full-width">
              <div class="font-14 font-semi-bold">{{ rootLang.max_radius_delivery }}</div>
              <span class="font-12 color-grey--placeholder">{{ deliverySetting.max_radius_delivery + ' Km' }}</span>
            </div>
            <div class="pointer" @click="handleEdit('maxradius')">
              <svg-icon icon-class="edit-2" class="font-20 color-primary"/>
            </div>
          </div>

          <div v-if="selectedStore.pos_resto_mode === 1" class="flex-container like-table-wrapper--item p-20">
            <div class="container-icon">
              <svg-icon icon-class="icon-market+" class="font-20" />
            </div>
            <div class="full-width">
              <div class="font-14 font-semi-bold">{{ rootLang.max_item_order }}</div>
              <span class="font-12 color-grey--placeholder">{{ deliverySetting.maximum_items_order }}</span>
            </div>
            <div class="pointer" @click="handleEdit('maxitem')">
              <svg-icon icon-class="edit-2" class="font-20 color-primary"/>
            </div>
          </div>

          <div v-if="selectedStore.pos_resto_mode === 1" class="flex-container like-table-wrapper--item p-20">
            <div class="container-icon">
              <svg-icon icon-class="feather-clock" class="font-20" />
            </div>
            <div class="full-width">
              <div class="font-14 font-semi-bold">{{ rootLang.duration_order_proses }}</div>
              <span class="font-12 color-grey--placeholder">{{ deliverySetting.duration_order_process }}</span>
            </div>
            <div class="pointer" @click="handleEdit('duration')">
              <svg-icon icon-class="edit-2" class="font-20 color-primary"/>
            </div>
          </div>
        </template>
      </template>

      <template v-else>
        <div slot="header" class="clearfix">
          <h4>{{ $lang[langId].setting }} {{ $lang[langId].delivery }}</h4>
          <div class="card-buttons">
            <el-button type="text" icon="el-icon-edit" circle @click="handleEditSetting" style="margin-right: 10px" />
          </div>
        </div>
        <el-table
          :data="tableData"
          :show-header="false"
          stripe
          style="width: 100%">
          <el-table-column label="Day" >
            <template slot-scope="scope">
              <div class="flex-container">
                <div v-if="scope.row.icon !== 'icon-market+'" :class="scope.row.icon === 'feather-clock' ? 'container-icon mr-8' : 'container-icon font-32 mr-8'">
                  <svg-icon :icon-class="scope.row.icon" />
                </div>
                <div v-else class="container-icon mr-8">
                  <img src="/static/img/icon-market+.png"/>
                </div>
                <el-row>
                  <el-col>
                    <span class="font-14 font-bold">{{ scope.row.name }}</span>
                  </el-col>
                  <el-col v-if="scope.row.id === 'radius_free_delivery'">
                    <span v-if="deliverySetting.enabled" style="font-size: 12px">{{ scope.row.value }}</span>
                    <span v-else class="font-12 color-warning">{{ lang.disabled }}</span>
                  </el-col>
                  <el-col v-if="scope.row.id !== 'maximum_items_order' && scope.row.id !== 'radius_free_delivery'">
                    <span v-if="typeof scope.row.fvalue === 'undefined'" style="font-size: 12px">{{ scope.row.value }}</span>
                    <span v-else style="font-size: 12px">{{ scope.row.fvalue }}</span>
                  </el-col>
                  <el-col v-if="scope.row.id === 'maximum_items_order'">
                    <span v-if="scope.row.unlimited_items_order === 1" class="font-12">
                      Unlimited
                    </span>
                    <span v-else style="font-size: 12px">{{ scope.row.value }}</span>
                  </el-col>
                </el-row>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
      
    </el-card>

    <el-card class="box-card" v-if="isActiveWorkingHours">
      <div style="margin-bottom: 20px; padding-top: 5px">
        <span style="font-size: 18px; font-weight: bold">{{ $lang[langId].delivery_time }}</span>
      </div>

      <el-table
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
      </el-table>
    </el-card>

    <el-card v-loading="loading" class="box-card" v-if="stageLevel === 'dev' || stageLevel === 'sit'">
      <div slot="header" class="clearfix">
        <h4> {{ $lang[langId].delivery_service }}</h4>
        <div class="card-buttons pointer" @click="showDeliverySetting">
          <svg-icon icon-class="edit-2" class="font-20 color-primary"/>
        </div>
      </div>

      <div v-if="!isCourierActive" class="radius-10 color-grey--bg flex-container justify-center py-32 px-64 mb-12">
        <div class="font-18 text-center word-break">Belum ada kurir pengiriman untuk layanan online order</div>
      </div>
      <div v-else class="border border--grey border--with-shadow radius-5 px-16 py-8">
        <div v-for="item in dataCourier" :key="item.courier_online_id" class="flex-container">
          <div v-if="item.is_active" class="full-width flex-container p-8">
            <el-avatar
              :src="item.photo"
              :size="40"
              shape="square"
              class="mr-8"
            />
            <div>
              {{ item.courier_online_name }}
              <div class="font-12 color-grey--placeholder">{{ getDataServiceCourier(item) }}</div>
            </div>
          </div>
        </div>
      </div>

    </el-card>

    <el-dialog
      :show-close="false"
      :visible.sync="dialogEditHours"
      custom-class="dialog-card">
      <div slot="title" class="flex-container">
        <h4 class="dialog-title full-width">{{ lang.edit + ' ' + $lang[langId].delivery_time }}</h4>
        <div class="btn_save_dialog full-width text-right">
          <el-button type="info" @click="handleCancelTime">{{ lang.cancel }}</el-button>
          <el-button type="success" @click="handleSaveTime">{{ lang.save }}</el-button>
        </div>
      </div>

      <div>{{ $lang[langId].when_order_delivered }}</div>
      <div v-for="(i, idx) in countTime" :key="idx" class="working_hours_input">
        <el-time-picker
          v-if="idx > 0"
          v-model="i.ftime"
          value-format="HH:mm"
          :picker-options="{
            format: 'HH:mm'
          }"
          :placeholder="$lang[langId].delivery_time"
          @change="handleCreateTime"
          style="width: 100%">
        </el-time-picker>
        <el-time-picker
          v-else
          v-model="i.ftime"
          value-format="HH:mm"
          :picker-options="{
            format: 'HH:mm'
          }"
          :placeholder="$lang[langId].delivery_time"
          @change="handleCreateTime"
          style="width: 100%">
        </el-time-picker>
        <el-tag v-if="countTime.length > 1 && idx !== countTime.length - 1" color="#F5F5F5" class="tag_break" style="width: 100%">
          <svg-icon icon-class="break" />{{ $lang[langId].break }} {{ breakTime(countTime[idx].ftime, countTime[idx+1].ftime ) }}
          <el-button type="text" size="mini" @click="handleDelTime(idx)" style="color: #000000">X</el-button>
        </el-tag>
      </div>
      <el-button class="btn_add_break" style="width: 100%" @click="addTime">{{ $lang[langId].add_other }}</el-button>
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
        <h4 class="dialog-title full-width">{{ lang.edit + ' ' + $lang[langId].free_delivery }}</h4>
        <div class="btn_save_dialog full-width text-right">
          <el-button type="info" @click="handleCloseSetting">{{ lang.cancel }}</el-button>
          <el-button
            :loading="loadingSaveSetting"
            :disabled="computedDisableSaveFreeDelivery"
            type="success"
            @click="updateDeliverySetting">
            {{ lang.save }}
          </el-button>
        </div>
      </div>
      <div class="free_delivery_input mb-12">
        <div class="activated_delivery">
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

        <template v-if="tempSetting.enabled">
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
        </template>
        <template v-else>
          <div class="color-info--bg p-8 text-center mb-24 mt-12">
            <img src="/static/img/online-order/no_active_delivery.png" class="image" style="margin-top: 32px">
            <div class="font-bold font-18" >Nyalakan pelatuk untuk mengaktifkan fitur Gratis Antar</div>
          </div>
        </template>

        <template v-if="stageLevel !== 'dev' && stageLevel !== 'sit'">
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

          <div class="mb-12" v-if="selectedStore.pos_resto_mode === 1">
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

          <div class="mb-12" v-if="selectedStore.pos_resto_mode === 1">
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
          </div>
        </template>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogEditV2"
      :show-close="false"
      :close-on-click-modal="false"
      custom-class="dialog-card">
      <div slot="title" class="flex-container">
        <h4 class="dialog-title full-width">{{ editData.title }}</h4>
        <div class="btn_save_dialog full-width text-right">
          <el-button type="info" @click="handleCloseSettingV2">{{ lang.cancel }}</el-button>
          <el-button
            :loading="loadingSaveSetting"
            :disabled="computedDisableSaveFreeDelivery"
            type="success"
            @click="updateDeliverySetting">
            {{ lang.save }}
          </el-button>
        </div>
      </div>
      <div class="free_delivery_input mb-12">
        <div v-if="editData.value === 'costoutside'" class="mb-12">
          <div class="font-12">{{ $lang[langId].cost_outside_radius }}</div>
          <input-money
            v-bind="money"
            v-model="tempSetting.cost_outside_radius"
            append="/Km"
          />
        </div>

        <div v-if="editData.value === 'minorder'" class="mb-12">
          <div class="font-12">{{ $lang[langId].minimum_order }}</div>
          <input-money
              v-bind="money"
              v-model="tempSetting.minimum_order"
            />
        </div>

        <div v-if="editData.value === 'maxradius'" class="mb-12">
          <div class="font-12">{{ $lang[langId].max_radius_delivery }}</div>
          <el-input
            v-model="tempSetting.max_radius_delivery"
            :min="1"
            type="number">
            <template slot="append">Km</template>
          </el-input>
        </div>

        <div class="mb-12" v-if="selectedStore.pos_resto_mode === 1 && editData.value === 'maxitem'">
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

        <div class="mb-12" v-if="selectedStore.pos_resto_mode === 1 && editData.value === 'duration'">
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
        </div>
      </div>
    </el-dialog>

    <dialog-delivery-setting 
      ref="dialogdelivery"
     :show="showDialogDelivery"
     :data-setting="dataSetting"
     @close="handleCloseDeliverySetting"
     />

  </div>
</template>
<script>
import FloatingDiv from '../../FloatingDiv'
import DialogDeliverySetting from './setting/dialogDeliverySetting'

import basicComputedMixin from '@/mixins/basicComputedMixin'

import { baseApi } from 'src/http-common'
import axios from 'axios'
import InputMoney from '@/components/InputMoneyV2'
var moment = require('moment')

export default {
  name: 'Delivery',
  components: {
    FloatingDiv,
    InputMoney,
    DialogDeliverySetting
    // International,
    // Free
  },

   mixins: [basicComputedMixin],

  data() {
    return {
      money: {
        prefix: 'IDR ',
      },
      tableData: [{
        name: this.$lang[this.$store.state.userStores.langId].radius_free_delivery,
        id: 'radius_free_delivery',
        value: '',
        icon: 'icon-delivery',
        is_antarinbarang: true
      },
      {
        name: this.$lang[this.$store.state.userStores.langId].minimum_order,
        id: 'minimum_order',
        value: '',
        icon: 'icon-delivery',
        is_antarinbarang: true
      },
      {
        name: this.$lang[this.$store.state.userStores.langId].cost_outside_radius,
        id: 'cost_outside_radius',
        value: '',
        fvalue: '',
        icon: 'icon-rp+',
        is_antarinbarang: true
      },
      {
        name: this.$lang[this.$store.state.userStores.langId].max_radius_delivery,
        id: 'max_radius_delivery',
        value: '',
        icon: 'icon-delivery',
        is_antarinbarang: true
      },
      {
        name: this.$lang[this.$store.state.userStores.langId].max_item_order,
        id: 'maximum_items_order',
        unlimited_items_order: 0,
        value: '',
        icon: 'icon-market+',
        is_antarinbarang: false
      },
      {
        name: this.$lang[this.$store.state.userStores.langId].duration_order_proses,
        id: 'duration_order_process',
        value: '',
        icon: 'feather-clock',
        is_antarinbarang: false
      }],
      dialogEdit: false,
      dialogEditHours: false,
      countTime: [
        {
          ftime: '00:00',
          time: '00:00'
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
      dialogEditV2: false,
      editData: {
        title: '',
        value: ''
      },
      dataCourier: [],
      dataSetting: {},
      dataStore: {},
      showDialogDelivery: false
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

    isCourierActive () {
      let data = []
      this.dataCourier.map(i => {
        if (i.is_active) { data.push(i) }
      })
      if (data.length) {
        return true
      } else { return false }
    },

    isActiveWorkingHours () {
      let active = false
      if (this.stageLevel === 'sit' || this.stageLevel === 'dev') {
        if (this.selectedStore.pos_resto_mode === 1 && this.deliverySetting.turn_off_private_courier === 1) {
          active = true
        }
      } else {
        if (this.selectedStore.pos_resto_mode === 1) {
          active = true
        }
      }

      return active
    }
  },


  mounted () {
    this.getDeliverySetting()
    this.getDeliveryHours()
    this.getSetting()
    this.getStoreData()
  },

  methods: {
    getDeliverySetting() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'online/delievery'),
        headers: headers
        // params: param
      }).then(async response => {
        this.deliverySetting = response.data.data
        this.deliverySetting.cost_outside_radius = parseInt(this.deliverySetting.cost_outside_radius)
        this.deliverySetting.minimum_order = parseInt(this.deliverySetting.minimum_order)
        this.inactive = response.data.data.enabled
        if (response.data.data.enabled === 0) {
          this.enabledDelivery = true
        } else {
          this.enabledDelivery = false
        }
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
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      const data = { ...this.tempSetting }
      if (!this.tempSetting.enabled) {
        data.radius_free_delivery = 0
      }

      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'online/delievery'),
        headers: headers,
        data
      }).then(async response => {
        this.dialogEdit = false
        this.tempSetting = {}

        this.dialogEditV2 = false
        this.editData = {
          title: '',
          value: ''
        }
        this.deliverySetting = response.data.data
        this.deliverySetting.cost_outside_radius = parseInt(this.deliverySetting.cost_outside_radius)
        this.deliverySetting.minimum_order = parseInt(this.deliverySetting.minimum_order)
        this.inactive = response.data.data.enabled
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
      let tempData = []
      if (this.selectedStore.pos_resto_mode === 0) {
        this.tableData.map(i => {
          if (i.is_antarinbarang) {
            tempData.push(i)
          }
        })
        this.tableData = [ ...tempData]
      }
      await this.tableData.map(i => {
        if (i.id === 'radius_free_delivery') {
          i.value = response.data.data.radius_free_delivery + ' Km'
        }
        if (i.id === 'minimum_order') {
          i.value = response.data.data.fminimum_order
        }
        if (i.id === 'cost_outside_radius') {
          i.value = response.data.data.cost_outside_radius
          i.fvalue = response.data.data.fcost_outside_radius
        }
        if (i.id === 'duration_order_process') {
          i.value = response.data.data.duration_order_process
        }
        if (i.id === 'maximum_items_order') {
          i.unlimited_items_order = response.data.data.unlimited_items_order
          i.value = response.data.data.maximum_items_order
        }
        if (i.id === 'minimum_order') {
          i.value = response.data.data.minimum_order
          i.fvalue = response.data.data.fminimum_order
        }
        if (i.id === 'max_radius_delivery') {
          i.value = response.data.data.max_radius_delivery + ' Km'
        }
      })
    },

    handleEditSetting () {
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
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let param = {
        sort_type: 'asc',
        sort_column: 'day_id'
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'online/delieverytimes'),
        headers: headers,
        params: param
      }).then(response => {
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
                time.push({
                  time: j.time
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
      this.dialogEditHours = true
    },

    addTime () {
      var d2 = new Date('08/05/2015 ' + this.countTime[this.countTime.length - 1].ftime)
      var startTime = moment(d2).add(30, 'm').toDate();
      // this.countTime[this.countTime.length - 1].break = '30 ' + this.$lang[this.langId].minute
      this.countTime.push({
        ftime: moment(startTime).format('HH:mm')
      })
    },

    breakTime (startTime, endTime) {
      var date1 = new Date('08/05/2015 ' + startTime)
      var date2 = new Date('08/05/2015 ' + endTime)

      var diff = date2.getTime() - date1.getTime()
      var msec = diff
      var hh = Math.floor(msec / 1000 / 60 / 60)
      msec -= hh * 1000 * 60 * 60;
      var mm = Math.floor(msec / 1000 / 60);
      if (hh !== 0) {
        if (mm !== 0) {
          // console.log('jam', hh)
          return hh + ' ' + this.lang.hour + ' ' + mm + ' ' + this.$lang[this.langId].minute
        } else {
          return hh + ' ' + this.lang.hour
        }
      } else {
        return mm + ' ' + this.$lang[this.langId].minute
      }

      this.countTime = tempTime
    },

    handleDelTime (idx) {
      this.countTime.splice(idx+1, 1)
    },

    handleCancelTime () {
      this.countTime = [{
        ftime: '00:00',
        time: '00:00'
      }]

      this.dialogEditHours = false
      this.getDeliveryHours()
    },

    handleSaveTime () {
      var tempTime = []
      this.countTime.map(i => {
        tempTime.push({
          time: i.ftime
          // break: i.break
        })
      })

      tempTime.sort((a, b) => (a.ftime < b.ftime) ? -1 : ((a.ftime > b.ftime) ? 1 : 0))

      this.countTime = [{
        ftime: '00:00',
        time: '00:00'
      }]
      this.tempWorking.map(i => {
        if (i.day_id === this.tempDayId) {
          i.times = tempTime
        }
      })
      this.updateDeliveryHours()
      this.dialogEditHours = false
    },

    updateDeliveryHours(data) {
      this.loadingWorkingHours = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      var data = {
        delivery: this.tempWorking
      }

      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'online/delieverytimes'),
        headers: headers,
        data: data
      }).then(response => {
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

    handleEdit (data) {
      this.tempSetting = { ...this.deliverySetting }
      this.dialogEditV2 = true

      this.editData.value = data
      
      if (data === 'costoutside') {
        this.editData.title = this.rootLang.cost_outside_radius
      }
      if (data === 'minorder') {
        this.editData.title = this.rootLang.minimum_order
      }
      if (data === 'maxradius') {
        this.editData.title = this.rootLang.max_radius_delivery
      }
      if (data === 'maxitem') {
        this.editData.title = this.rootLang.max_item_order
      }
      if (data === 'duration') {
        this.editData.title = this.rootLang.duration_order_process
      }
    },

    handleCloseSettingV2 () {
      this.tempSetting = {}
      this.dialogEditV2 = false
      this.editData = {
        value: '',
        title: ''
      }
    },

    handleChangePrivateCourier () {
      this.tempSetting = { ...this.deliverySetting}
      this.updateDeliverySetting()
    },

    async getStoreData() {
      this.loading = true
      await fetchStore().then(response => {
        this.dataStore = response.data.data
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    getSetting () {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'online/settings'),
        headers: headers
      }).then(response => {
        this.dataSetting = { ...response.data.data}
        let data = response.data.data
        data.courier.map(i => {
          i.is_active = i.is_active === 1? true : false
          if (i.detail.length) {
            i.detail.map(j => {
              j.is_active = j.is_active === 1? true : false
            })
          }
        })

        this.dataCourier = [ ...data.courier]
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    getDataServiceCourier (item) {
      let service = []
      item.detail.map(i => { 
        if(i.is_active) { service.push(i.courier_online_detail_name) }
      })
      return service.join(', ')
    },

    showDeliverySetting () {
      if (this.dataSetting.pick_up_lat === null && this.dataSetting.pick_up_lon === null) {
        this.$refs.dialogdelivery.setDefaultLocation(this.dataStore)
      } else {
        this.dataStore.address = this.dataSetting.pick_up_address
        this.dataStore.location_lat = this.dataSetting.pick_up_lat
        this.dataStore.location_lon = this.dataSetting.pick_up_lon
        this.$refs.dialogdelivery.setDefaultLocation(this.dataStore)
      }
      this.$refs.dialogdelivery.setCourier(this.dataSetting, true)
      this.showDialogDelivery = true
    },

    handleCloseDeliverySetting () {
      this.showDialogDelivery = false
      this.getSetting()
      this.getStoreData()
    },
  }
}
</script>

