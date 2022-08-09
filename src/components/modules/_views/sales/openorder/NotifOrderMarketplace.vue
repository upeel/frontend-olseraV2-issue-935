<template>
<!-- v-if="(tokpedShow || tokpedAccessByStore.includes(selectedStore.url_id)) && dataOrder.length" -->
  <div
    v-if="(tokpedShow) && dataOrder.length"
    class="flex-container flex-container--with-gutter">
    <card-info
      v-if="dataOrder[0].already_submitted === 1 && dataOrder[0].status_submitted === 'A'"
      v-loading="loadingTokopedia"
      class="flex-grow-1 pointer"
      :class="dataOrder[0].total_order_new > 0 ? 'color-tokopedia--bg-soft' : ''"
      @click.native="getDataOrder(dataOrder[0])">
      <div
        v-if="dataOrder[0].total_order_new >= 0"
        class="flex-container flex-grow-1">
        <el-avatar :size="40" shape="circle" class="color-tokopedia--bg" src="/static/img/tokopedia.png" >{{ dataOrder[0].total_order_new }}</el-avatar>
        <div class="ml-6 full-width">
          <div class="font-16 font-bold">{{ dataOrder[0].marketplace_name }}</div>
          <div class="font-12 color-info">{{ dataOrder[0].total_order }} {{ lang.orders }}</div>
        </div>
        <div v-if="dataOrder[0].total_order_new <= 0" class="pointer text-right">
          <i class="el-icon-arrow-right"></i>
        </div>
        <div v-else class="pointer">
          <el-avatar :size="32" shape="circle" class="color-tokopedia--bg font-12">{{ dataOrder[0].total_order_new }}</el-avatar>
        </div>
      </div>
    </card-info>
    <!-- <template v-if="stageLevel === 'dev' || stageLevel === 'sit'"> -->
      <template v-for="(order, idx) in dataOrder">
        <card-info
          :key="idx"
          v-if="order.marketplace_name !== 'Tokopedia' && (order.already_submitted === 1 && order.status_submitted === 'A')"
          v-loading="getClassMarketplace(order).loading"
          class="flex-grow-1 pointer"
          :class="order.total_order_new > 0 ? getClassMarketplace(order).style_highlight : ''"
          @click.native="getDataOrder(order)">
          <div class="flex-container flex-grow-1">
            <el-avatar :size="40" shape="circle" :class="getClassMarketplace(order).style" :src="getClassMarketplace(order).image">{{ order.total_order_new }}</el-avatar>
            <div class="ml-6 full-width">
              <div class="font-16 font-bold">{{ order.marketplace_name }}</div>
              <div class="font-12 color-info">{{ order.total_order }} {{ lang.orders }}</div>
            </div>
            <div v-if="order.total_order_new <= 0" class="pointer text-right">
              <i class="el-icon-arrow-right"></i>
            </div>
            <div v-else class="pointer">
              <el-avatar :size="32" shape="circle" :class="getClassMarketplace(order).style" class="font-12">{{ order.total_order_new }}</el-avatar>
            </div>
          </div>
        </card-info>
      </template>
      <!-- <card-info
        v-loading="loadingShopee"
        v-if="dataOrder.length >= 2 && dataOrder[1].total_order_new >= 0"
        class="flex-grow-1 pointer"
        @click.native="getDataOrder(dataOrder[1])">
        <div class="flex-container flex-grow-1">
          <el-avatar :size="40" shape="circle" class="color-shopee--bg">{{ dataOrder[1].total_order_new }}</el-avatar>
          <div class="ml-6 full-width">
            <div class="font-16 font-bold">{{ rootLang.new_order }}</div>
            <div class="font-12 color-info">{{ dataOrder[1].total_order }} {{ lang.orders }} Shopee</div>
          </div>
          <div class="pointer text-right">
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </card-info>
      <card-info
        v-loading="loadingLazada"
        v-if="dataOrder.length >= 3 && dataOrder[2].total_order_new >= 0" 
        @click.native="getDataOrder(dataOrder[2])" class="flex-grow-1 pointer">
        <div class="flex-container flex-grow-1">
          <el-avatar :size="40" shape="circle" class="color-lazada"> {{ dataOrder[2].total_order_new }} </el-avatar>
          <div class="ml-6 full-width">
            <div class="font-16 font-bold">{{ rootLang.new_order }}</div>
            <div class="font-12 color-info">{{ dataOrder[2].total_order }} {{ lang.orders }} Lazada</div>
          </div>
          <div class="pointer text-right">
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </card-info>
      <card-info
        class="flex-grow-1 pointer"
        v-if="dataOrder.length >= 4 && dataOrder[3].total_order_new >= 0" 
        @click.native="getDataOrder(dataOrder[3])">
        <div class="flex-container flex-grow-1">
          <el-avatar :size="40" src="/static/img/service-activation/blibli/blibli-icon.png" />
          <div class="ml-6 full-width">
            <div class="font-16 font-bold">{{ rootLang.new_order }}</div>
            <div class="font-12 color-info">{{ dataOrder[3].total_order }} {{ lang.orders }}</div>
          </div>
          <div class="pointer text-right">
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </card-info> -->
    <!-- </template> -->
  </div>
</template>
<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import { mixinHiddenFeatureByPlanType } from '@/mixins/mixinHiddenFeatureByPlanType'

import CardInfo from '@/components/CardInfo'

export default {
  mixins: [basicComputedMixin, mixinHiddenFeatureByPlanType],

  components: {
    CardInfo
  },

  props: {
    dataOrder: {
      type: Array,
      default: []
    },

    tokpedAccessByStore: {
      type: Array,
      default: []
    },

    loading: {
      type: Object,
      default: {
        loadingTokopedia: false,
        loadingShopee: false,
        loadingLazada: false,
        loadingBlibli: false
      }
    }
  },

  computed: {
    tokpedShow () {
      return !this.methodFeatureNameIsHidden('tokopedia-sales')
    },
  },

  methods: {
    getDataOrder (data) {
      console.log('oorder', data)
      this.$emit('getorder', data.marketplace_name)
    },

    getClassMarketplace (order) {
      let style = ''
      let loading = false
      let image = '/static/img/logo-olsera-icon.png'
      let style_highlight = ''
      if (order.marketplace_name === 'Tokopedia') {
        style = 'color-tokopedia--bg'
        loading = this.loading.loadingTokopedia
        image = '/static/img/tokopedia.png'
        style_highlight = 'color-tokopedia--bg-soft'
      } else if (order.marketplace_name === 'Shopee') {
        style = 'color-shopee--bg'
        loading = this.loading.loadingShopee
        image = '/static/img/shopee.png'
        style_highlight = 'color-shopee--bg-soft'
      } else if (order.marketplace_name === 'Lazada') {
        style = 'color-lazada--bg'
        loading = this.loading.loadingLazada
        image = '/static/img/lazada.png'
        style_highlight = 'color-lazada--bg-soft'
      } if (order.marketplace_name === 'Blibli') {
        style = 'color-blibli--bg'
        loading = this.loading.loadingBlibli
        image = '/static/img/service-activation/blibli/blibli-icon.png'
        style_highlight = 'color-blibli--bg-soft'
      }

      return { style, loading, image, style_highlight }
    }
  }
}
</script>