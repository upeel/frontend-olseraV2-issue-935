<template>
  <div >
    <section class="sales-list no-subpage">
      <div class="table-handler-flex flex-container--content-space-between flex-container--wrap mb-16">
        <div class="flex-container full-width">
          <div class="full-width font-20 text-left">
            Daftar Promosi
          </div>
          <div>
            <el-dropdown class="drop-complete" @command="addDiscount">
              <el-button type="success">
                <i class="el-icon-plus"/> {{ lang.add }}
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(command, index) in promotionType"
                  :key="index"
                  :command="command.id"
                >
                <div class="flex-container">
                  <div class="color-grabfood--bg color-white p-5 mr-4 radius-5 font-32">
                    <svg-icon :icon-class="command.icon" />
                  </div>
                  {{command.label}}
                </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>

      <div
        v-if="!loading && !dataCampaign.length"
        class="card_close_date box-card">
        <div class="no-data-wrapper no-data-settle">
          <img src="/static/img/no-data-promotions.svg" class="no-data-image">
          <div style="max-width: 360px; width: 100%">
            <!-- <div class="no_close" >Daftar settlement akan muncul di sini</div> -->
            <span>Belum ada promosi. Tingkatkan penjualan dengan memberikan promosi menarik seperti 10% OFF atau Gratis Ongkir</span>
          </div>
        </div>
      </div>

      <div
        v-if="dataCampaign.length || loading"
        class="like-table-wrapper">
        <div class="table-handler-flex full-width text-right mb-24">
          <el-input class="inline-form input-search full-width" clearable :placeholder="lang.search" prefix-icon="el-icon-search" v-model="params.search" @change="handleSearch" @clear="handleSearch" size="small"></el-input>
        </div>
        <template v-if="dataCamp.dataActive.length">
          <div class="text-left font-20 font-bold">Sedang berlangsung</div>
          <div class="like-table-wrapper--item"
            v-loading="loading" v-for="item in dataCamp.dataActive" :key="item.id">
              <div class="flex-container full-width pointer" @click="handleShowCampaign(item)">
                <div class="color-grabfood--bg color-white p-5 mr-4 radius-5 font-32" style="display: flex; width: 40px; height: 40px">
                  <svg-icon :icon-class="item.disc_type === 1? 'icon-disc-nominal-grabfood' : item.disc_type === 2? 'icon-disc-persen-grabfood' : item.disc_type === 3? 'icon-disc-ongkir-grabfood' : 'icon-disc-gratis-grabfood'" />
                </div>
                <div class="full-width text-left" style="line-height: 15px">
                  <div class="font-bold">{{item.name}}</div>
                  <div class="font-12 color-grey--placeholder">{{ rootLang.min_purchase }} {{ item.fmin_order_amount }}</div>
                  <div class="font-12 color-grey--placeholder">
                    <span class="font-bold color-black color-yellow--bg px-2">{{ getLabelDayLeft(item.start_time, item.end_time) }}</span>
                    Berlaku hingga {{ item.fend_time }}
                  </div>
                </div>
                <div class="full-width text-right">
                  <el-tag v-if="item.disc_scope_type === 1" type="info">{{ rootLang.total_order }}</el-tag>
                </div>
                <div v-if="item.disc_type !== 3 && item.disc_scope_type === 2 && item.disc_scope_items.length > 0" class="full-width flex-container text-right mr-10" style="justify-content: end; flex-direction: row-reverse">
                  <div v-for="(prod, idx) in item.disc_scope_items" :key="prod.id" >
                      <el-avatar
                        v-if="(item.disc_scope_items.length - idx) < 4"
                        :src="prod.detail.default_photo"
                        :size="32"
                        shape="circle"
                        :style="'border: 1px solid; margin-right: -10px; z-index: ' + (item.disc_scope_items.length - idx)"
                      />
                      <el-avatar
                        v-else-if="idx === 0"
                        :size="32"
                        shape="circle"
                        :style="'border: 1px solid; margin-left: 5px; z-index: ' + (item.disc_scope_items.length - idx)"
                      >
                      <span class="font-12">+{{ item.disc_scope_items.length - 4 }}</span></el-avatar>
                  </div>
                </div>
                <div class="px-4">
                  <i class="el-icon-arrow-right font-bold" />
                </div>
              </div>
          </div>
        </template>
        
        <template v-if="dataCamp.dataWaiting.length">
          <div class="text-left  font-20 font-bold mt-24">Akan datang</div>
          <div class="like-table-wrapper--item"
            v-loading="loading" v-for="item in dataCamp.dataWaiting" :key="item.id">
              <div class="flex-container full-width pointer" @click="handleEditCampaign(item)">
                <div class="color-grabfood--bg color-white p-5 mr-4 radius-5 font-32" style="display: flex; width: 40px; height: 40px">
                  <svg-icon :icon-class="item.disc_type === 1? 'icon-disc-nominal-grabfood' : item.disc_type === 2? 'icon-disc-persen-grabfood' : item.disc_type === 3? 'icon-disc-ongkir-grabfood' : 'icon-disc-gratis-grabfood'" />
                </div>
                <div class="full-width text-left" style="line-height: 15px">
                  <div class="font-bold">{{item.name}}</div>
                  <div class="font-12 color-grey--placeholder">{{ rootLang.min_purchase }} {{ item.fmin_order_amount }}</div>
                  <div class="font-12 color-grey--placeholder">
                    <span class="font-bold color-black color-yellow--bg px-2">{{ getLabelDayLeft(item.start_time, item.end_time) }}</span>
                    Berlaku hingga {{ item.fend_time }}
                  </div>
                </div>
                <div class="full-width text-right">
                  <el-tag v-if="item.disc_scope_type === 1" type="info">{{ rootLang.total_order }}</el-tag>
                </div>
                <div v-if="item.disc_type !== 3 && item.disc_scope_type === 2 && item.disc_scope_items.length > 0" class="full-width flex-container text-right mr-10" style="justify-content: end; flex-direction: row-reverse">
                  <div v-for="(prod, idx) in item.disc_scope_items" :key="prod.id" >
                      <el-avatar
                        v-if="(item.disc_scope_items.length - idx) <= 4"
                        :src="prod.detail.default_photo"
                        :size="32"
                        shape="circle"
                        :style="'border: 1px solid; margin-right: -10px; z-index: ' + (item.disc_scope_items.length - idx)"
                      />
                      <el-avatar
                        v-else-if="idx === 0"
                        :size="32"
                        shape="circle"
                        :style="'border: 1px solid; margin-left: 5px; z-index: ' + (item.disc_scope_items.length - idx)"
                      >
                      <span class="font-12">+{{ item.disc_scope_items.length - 4 }}</span></el-avatar>
                  </div>
                </div>
                <!-- <div v-if="item.disc_scope_items.length > 3" class="mr-10" style="margin-left: -10px">
                  
                </div> -->
                <div class="px-4">
                  <i class="el-icon-arrow-right font-bold" />
                </div>
              </div>
          </div>
        </template>

        <template v-if="dataCamp.dataExpired.length">
          <div class="text-left font-20 font-bold mt-24">Berlalu</div>
          <div class="like-table-wrapper--item img-grey"
            v-loading="loading" v-for="item in dataCamp.dataExpired" :key="item.id">
              <div class="flex-container full-width pointer" @click="handleShowCampaign(item)">
                <div class="color-grey--placeholder--bg color-white p-5 mr-4 radius-5 font-32" style="display: flex; width: 40px; height: 40px">
                  <svg-icon :icon-class="item.disc_type === 1? 'icon-disc-nominal-grabfood-grey' : item.disc_type === 2? 'icon-disc-persen-grabfood-grey' : item.disc_type === 3? 'icon-disc-ongkir-grabfood-grey' : 'icon-disc-gratis-grabfood-grey'" />
                </div>
                <div class="full-width text-left" style="line-height: 15px">
                  <div class="font-bold">{{item.name}}</div>
                  <div class="font-12 color-grey--placeholder">{{ rootLang.min_purchase }} {{ item.fmin_order_amount }}</div>
                  <div class="font-12 color-grey--placeholder">
                    Berakhir pada {{ item.fend_time }}
                  </div>
                </div>
                <div class="full-width text-right">
                  <el-tag v-if="item.disc_scope_type === 1" type="info">{{ rootLang.total_order }}</el-tag>
                </div>
                <div v-if="item.disc_type !== 3 && item.disc_scope_type === 2 && item.disc_scope_items.length > 0" class="full-width flex-container text-right mr-10" style="justify-content: end; flex-direction: row-reverse">
                  <div v-for="(prod, idx) in item.disc_scope_items" :key="prod.id" >
                      <el-avatar
                        v-if="(item.disc_scope_items.length - idx) < 4"
                        :src="prod.detail.default_photo"
                        :size="32"
                        shape="circle"
                        :style="'border: 1px solid; margin-right: -10px; z-index: ' + (item.disc_scope_items.length - idx)"
                      />
                      <el-avatar
                        v-else-if="idx === 0"
                        :size="32"
                        shape="circle"
                        :style="'border: 1px solid; margin-left: 5px; z-index: ' + (item.disc_scope_items.length - idx)"
                      >
                      <span class="font-12">+{{ item.disc_scope_items.length - 4 }}</span></el-avatar>
                  </div>
                </div>
                <div class="px-4">
                  <i class="el-icon-arrow-right font-bold" />
                </div>
              </div>
          </div>
        </template>
        
      </div>
    </section>
    <dialog-add-discount
      :show="showAddDiscount"
      :form-data="tempData"
      :data-grab-food-id="dataGrabFoodId"
      :data-period-day="dataPeriod"
      @update="refreshData"
      @close="refreshData" />

      <offscreen-detail-campaign
        :show="showDetailCampaign"
        :form-edit="tempData"
        @cancel="refreshData"
        @update="refreshData" />
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import moment from 'moment'
import dialogAddDiscount from './promotions/dialogAddDiscount'
import offscreenDetailCampaign from './promotions/offscreenDetailCampaign'

import { getGrabCampaign, getGrabPeriodStore as getDataPeriod } from '@/api/thirdParty/grabfood'
export default {
  name: 'GrabfoodPromotions',
  mixins: [basicComputedMixin],

  components: {
    dialogAddDiscount,
    offscreenDetailCampaign
  },

  props: {
    dataGrabFoodId: {
      type: Number,
      default: null
    }
  },

  computed: {
    dataCamp () {
      let data = {
        dataActive: [],
        dataExpired: [],
        dataWaiting: []
      }
      this.dataCampaign.map(i => {
        if (i.camp_status_id === '0') {
          data.dataExpired.push(i)
        } else if (i.camp_status_id === '1') {
          data.dataWaiting.push(i)
        } else if (i.camp_status_id === '2') {
          data.dataActive.push(i)
        }
      })
      return data
    }
  },

  data () {
    return {
      promotionType: [
        {
          id: 1,
          value: 'nominal',
          label: 'Diskon Nominal',
          icon: 'icon-disc-nominal-grabfood'
        },
        {
          id: 2,
          value: 'persen',
          label: 'Diskon Persen',
          icon: 'icon-disc-persen-grabfood'
        },
        {
          id: 3,
          value: 'ongkir',
          label: 'Diskon Ongkir',
          icon: 'icon-disc-ongkir-grabfood'
        },
        {
          id: 4,
          value: 'item',
          label: 'Gratis Item',
          icon: 'icon-disc-gratis-grabfood'
        },
      ],
      tempData: {
        id: 0,
        nominal: 0,
        mix_order: 0,
        disc_scope_type: 1,
        name: '',
        start_time: moment().add(5, 'minutes').format('HH:mm'),
        discount_start_date: moment().format('DD-MMM-YYYY'),
        end_time: moment().add(11, 'minutes').format('HH:mm'),
        discount_end_date: moment().format('DD-MMM-YYYY'),
        active_max_promo: 0,
        total_count: 0,
        active_limit_per_customer: 0,
        total_count_per_user: 0,
        eater_type: 2,
        min_order_amount: 0,
        disc_type: 0,
        disc_value: 0,
        disc_cap: 0,
        disc_scope_items: [],
        product_discount: {},
        is_all_periods: 0,
        is_all_period_days: 0
      },
      showAddDiscount: false,
      dataCampaign: [],
      params: {
        search: ''
      },
      dataPeriod: [],
      showDetailCampaign: false
    }
  },

  mounted () {
    this.getAllCampaign()
    this.getDataPeriod()
  },

  methods: {
    addDiscount (id) {
      this.tempData.disc_type = id
      this.tempData.active_max_promo = this.tempData.total_count === 0? 0 : 1
      this.tempData.active_limit_per_customer = this.tempData.total_count_per_user === 0? 0 : 1
      this.tempData.discount_start_date = moment().format('YYYY-MM-DD')
      this.tempData.discount_end_date = moment().add(7, 'days').format('YYYY-MM-DD')
      this.tempData.start_time = moment().add(15, 'minutes').format('HH:mm')
      let end = moment(this.tempData.discount_start_date + ' 23:59').format('HH:mm')
      console.log('ed', end)
      this.tempData.end_time = end
      this.showAddDiscount = true
    },

    refreshData () {
      this.getAllCampaign()
      this.getDataPeriod()
      this.showAddDiscount = false
      this.showDetailCampaign = false
      let end = moment().format('DD-MMM-YYYY')
      this.tempData = {
        id: 0,
        nominal: 0,
        mix_order: 0,
        disc_scope_type: 1,
        name: '',
        start_time: moment().add(5, 'minutes').format('HH:mm'),
        discount_start_date: moment().format('DD-MMM-YYYY'),
        end_time: moment(end + ' 23:59').format('HH:mm'),
        discount_end_date: moment().add(7, 'days').format('DD-MMM-YYYY'),
        active_max_promo: 0,
        total_count: 0,
        active_limit_per_customer: 0,
        total_count_per_user: 0,
        eater_type: 2,
        min_order_amount: 0,
        disc_type: 0,
        disc_value: 0,
        disc_cap: 0,
        disc_scope_items: [],
        product_discount: {},
        is_all_periods: 0,
        is_all_period_days: 0
      }
    },

    async getAllCampaign() {
      this.loading = true
      this.dataCampaign = []
      await getGrabCampaign(this.params).then(response => {
        this.loading = false
        this.dataCampaign = response.data.data
      }).catch(error => {
        this.dataCampaign = []
        console.log(error)
        if (error.statusCode !== 404) {
          this.$message({
            type: 'error',
            message: error.string
          })
        }
        this.loading = false
      })
    },

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

    handleEditCampaign (data) {
      this.tempData = {}
      this.tempData = { ...data}
      this.tempData.discount_start_date = moment(data.start_time).format('YYYY-MM-DD')
      this.tempData.start_time = moment(data.start_time).format('HH:mm')
      this.tempData.discount_end_date = moment(data.end_time).format('YYYY-MM-DD')
      this.tempData.end_time = moment(data.end_time).format('HH:mm')
      this.tempData.active_max_promo = data.total_count === 0? 0 : 1
      this.tempData.active_limit_per_customer = data.total_count_per_user === 0? 0 : 1
      if (this.tempData.disc_type === 4) {
        this.tempData.product_discount = { ...this.tempData.disc_scope_items[0]}
      }
      this.showAddDiscount = true
    },

    handleShowCampaign (data) {
      this.tempData = {}
      this.tempData = { ...data}
      this.showDetailCampaign = true
    },

    handleSearch () {
      if (this.params.search !== '') {
        this.params.search_column = 'name'
        this.params.search_text = this.params.search
        // this.$delete(this.params, 'search')
        this.getAllCampaign()
      } else {
        this.$delete(this.params, 'search_column')
        this.$delete(this.params, 'search_text')
      }
    },

    async getDataPeriod() {
      this.loading = true
      this.dataPeriod = []
      await getDataPeriod({
        sort_column: 'id',
        sort_type: 'asc'
      }).then(response => {
        this.loading = false
        this.dataPeriod = response.data.data
      }).catch(error => {
        this.dataPeriod = []
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loading = false
      })
    },
  }
}
</script>