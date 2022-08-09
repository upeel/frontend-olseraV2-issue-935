<template>
  <div class="flex-container-same-height no-flex-sm mb-16 bg-white box-shadow radius-10">
  

    <div class="dashboard-content-section">
      <div class="flex-container">
        <div class="full-width">
          <h4 style="flex-grow: 2;">{{ lang.sales }}</h4>
          <div>{{ getCompareDate() }}</div>
        </div>
        
        <div class="full-width text-right">
          <el-radio-group v-model="income" size="small" @change="handleChangeMenu">
            <el-radio-button label="H">{{ lang.day }}</el-radio-button>
            <el-radio-button label="D">{{ rootLang.week }}</el-radio-button>
            <el-radio-button label="M">{{ lang.month }}</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <div class="flex-container mt-24">
        
        <div
          v-if="dataCompareSales.summary && dataCompareSales.summary.ftotal_total_amount"
          class="px-4 full-width">
          Total Penjualan 
          <div class="font-18 font-bold">{{ dataCompareSales.summary.ftotal_total_amount }}</div>
          <el-tag :type="getFormat(dataCompareSales.summary.total_total_amount).type" :effect="getFormat(dataCompareSales.summary.total_total_amount).effect"><i :class="getFormat(dataCompareSales.summary.total_total_amount).icon" /> {{ dataCompareSales.summary.ftotal_total_amount_diff }}</el-tag>
        </div>

        <div
          v-if="dataCompareSales.summary && dataCompareSales.summary.ftotal_order_amount"
          class="px-4 full-width">
          Penjualan kotor 
          <div class="font-18 font-bold">{{ dataCompareSales.summary.ftotal_order_amount }}</div>
          <el-tag :type="getFormat(dataCompareSales.summary.total_order_amount).type" :effect="getFormat(dataCompareSales.summary.total_order_amount).effect"><i :class="getFormat(dataCompareSales.summary.total_order_amount).icon" /> {{ dataCompareSales.summary.ftotal_order_amount_diff }}</el-tag>
        </div>

        <div
          v-if="dataCompareSales.summary && dataCompareSales.summary.ftotal_gross_profit"
          class="px-4 full-width">
          Laba Kotor
          <div class="font-18 font-bold">{{ dataCompareSales.summary.ftotal_gross_profit }}</div>
          <el-tag :type="getFormat(dataCompareSales.summary.total_gross_profit).type" :effect="getFormat(dataCompareSales.summary.total_gross_profit).effect"><i :class="getFormat(dataCompareSales.summary.total_gross_profit).icon" />{{ dataCompareSales.summary.ftotal_gross_profit_diff }}</el-tag>
        </div>

        <div
          v-if="dataCompareSales.summary && dataCompareSales.summary.ftotal_payment_amount"
          class="px-4 full-width">
          Penerimaan
          <div class="font-18 font-bold">{{ dataCompareSales.summary.ftotal_payment_amount }}</div>
          <el-tag :type="getFormat(dataCompareSales.summary.total_payment_amount).type" :effect="getFormat(dataCompareSales.summary.total_payment_amount).effect"><i :class="getFormat(dataCompareSales.summary.total_payment_amount).icon" />{{ dataCompareSales.summary.ftotal_payment_amount_diff }}</el-tag>
        </div>

        <div
          v-if="dataCompareSales.summary && dataCompareSales.summary.total_count_transaction"
          class="px-4" style="width: 50%">
          Transaksi
          <div class="font-18 font-bold">{{ dataCompareSales.summary.total_count_transaction }}</div>
          <el-tag :type="getFormat(dataCompareSales.summary.total_count_transaction).type" :effect="getFormat(dataCompareSales.summary.total_count_transaction).effect"><i :class="getFormat(dataCompareSales.summary.total_count_transaction).icon" />{{ dataCompareSales.summary.ftotal_count_transaction_diff }}</el-tag>
        </div>

        <div
          v-if="dataCompareSales.summary && dataCompareSales.summary.total_count_item"
          class="px-4"
          style="width: 50%">
          Produk
          <div class="font-18 font-bold">{{ dataCompareSales.summary.total_count_item }}</div>
          <el-tag :type="getFormat(dataCompareSales.summary.total_count_item).type" :effect="getFormat(dataCompareSales.summary.total_count_item).effect"><i :class="getFormat(dataCompareSales.summary.total_count_item).icon" />{{ dataCompareSales.summary.ftotal_count_item_diff }}</el-tag>
        </div>
      </div>

      <div v-loading="loading" class="mt-24">
        <ve-line
          :data="chartRevenueDate"
          :legend-visible="false"
          :colors="colorsRevenue">
        </ve-line>
        <div class="flex-container text-center justify-center" style="margin-top: -24px">
          <div class="flex-container px-12">
            <div class="mr-8" style="width: 10px; height: 5px; background: #0085CD"></div>
            Total penjualan
          </div>
          <div class="flex-container px-12">
            <div class="mr-8" style="width: 10px; height: 5px; background: #808080"></div>
            Total penjualan sebelumnya
          </div>
        </div>
      </div>
      <!-- <div v-if="income === 1">
        <ve-line
          :data="chartRevenueHour"
          :legend-visible="false"
          :colors="colorsRevenue">
        </ve-line>
      </div> -->
    </div>
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import moment from 'moment'
export default {
  props: {
    chartRevenueDate: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    dataCompareSales: {
      type: Object,
      default: {}
    },
    params: {
      type: Object,
      default: {}
    }
  },

  mixins: [basicComputedMixin],

  data() {
    return {
      income: 'H',
      colorsRevenue: ['#0085CD','#808080']
    }
  },

  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    token() {
      return this.$store.state.user.token
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    userRole() {
      const selectedStore = this.$store.getters.selectedStore
      return {
        role_id: selectedStore.role_id,
        role_name: selectedStore.role_name,
        is_pos_only: selectedStore.is_pos_only,
        is_mobile: selectedStore.is_mobile
      }
    }
  },

  methods: {
    handleChangeMenu (data) {
      this.$emit('changemenu', data)
    },

    getCompareDate () {
      let date = ''
      if (this.income === 'H') {
        date = moment(this.params.start_date).format('DD MMMM YYYY')
        return date + ', dibanding kemarin'
      }
      if (this.income === 'D') {
        date = moment(this.params.start_date).format('DD MMMM YYYY') + ' - ' + moment(this.params.end_date).format('DD MMMM YYYY')
        return date + ', dibanding minggu sebelumnya'
      }
      if (this.income === 'M') {
        date = moment(this.params.start_date).format('MMMM YYYY')
        return date + ' dibanding bulan sebelumnya'
      }
    },

    getFormat (data) {
      let icon = ''
      let type = ''
      let effect = ''
      if (data > 0) {
        icon = 'el-icon-arrow-up'
        type = 'success'
        effect = 'dark'
      }
      if (data < 0) {
        icon = 'el-icon-down-up'
        type = 'warning'
        effect = 'dark'
      }
      if (data === 0) {
        icon = 'el-icon-minus'
        type = 'info'
        effect = 'plain'
      }

      return {
        icon,
        type,
        effect
      }
    }
  }
}
</script>
