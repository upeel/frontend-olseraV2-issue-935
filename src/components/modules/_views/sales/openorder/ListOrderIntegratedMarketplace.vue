<template>
  <div class="flex-container">
    <div v-if="marketplaceCode.includes(order.order_source)">
      <!-- <el-avatar shape="circle" class="color-tokopedia--bg" src="/static/img/tokopedia.png"> </el-avatar> -->
      <el-avatar :src="getImgLogo(order.order_source).logo" :size="20" :class="getImgLogo(order.order_source).style" />
    </div>
    <div class="ml-8">
      <router-link :to="{ path: selectedStore.url_id === 'setdemo1' || selectedStore.url_id === 'allinolsera2' ? '/sales/openorderV2/'  + order.id : '/sales/openorder/' + order.id }">
        <div class="px-8">
          {{ order.order_no }}
        </div>
      </router-link>
      <div v-loading="loadingPair"
        class="overflow-ellipsis font-12 radius-20 color-white px-8 pointer" :class="getImgLogo(order.order_source).style" style="max-width: 170px" @click="getDetailOrder(getInvoice(order.order_source).orderId)">
        {{ getInvoice(order.order_source).inv }}
      </div>
    </div>
  </div>
</template>
<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
export default {
  name: 'ListOrderMarketplace',
  mixins: [basicComputedMixin],
  props: {
    order: {
      type: Object,
      default: {}
    },

    loadingPair: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    marketplaceCode () {
      return ['K', 'L', 'H', 'B', 'A', 'J']
    }
  },

  methods: {
    getDetailOrder (id) {
      let data = {
        id,
        order_source: this.order.order_source
      }
      this.$emit('detailorder', data)
    },

    getImgLogo (data) {
      let logo = '/static/img/logo-olsera-icon.png'
      let style = ''

      if (data === 'K') {
        logo = '/static/img/tokopedia.png'
        style = 'color-tokopedia--bg'
      } else if (data === 'H') {
        logo = '/static/img/shopee.png'
        style = 'color-shopee--bg'
      } else if (data === 'L') {
        logo = '/static/img/lazada.png'
        style = 'color-lazada--bg'
      }

      return {
        logo, style
      }
    },

    getInvoice (data) {
      let inv = ''
      let orderId = ''

      if (data === 'K' && this.order.invoice_tokopedia !== null && this.order.order_no_tokopedia !== null) {
        inv = this.order.invoice_tokopedia.invoice_num
        orderId = this.order.order_no_tokopedia
      } else if (data === 'H' && this.order.order_no_shopee !== null && this.order.order_id_shopee !== null) {
        inv = this.order.order_no_shopee
        orderId = this.order.order_id_shopee
      }

      return {
        inv,
        orderId
      }
    }
  }
}
</script>