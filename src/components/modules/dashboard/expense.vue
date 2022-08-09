<template>
  <div class="flex-container-same-height no-flex-sm mb-16 bg-white box-shadow radius-10">
    <!-- <div class="dashboard-banner-section dashboard-banner-section--refund">
      <svg-icon icon-class="trending-down" />
      <span style="font-size: 18px">{{ lang.expense }}</span>
    </div> -->

    <div class="dashboard-content-section">
      <div class="flex-container">
        <svg-icon icon-class="trending-down" style="font-size: 25px; margin-right: 16px"/>
        <span style="font-size: 16px; font-weight: bold; margin-right: auto;">{{ lang.expense }}</span>
        <el-radio-group v-model="income" size="small">
          <el-radio-button :label="0">{{ lang.date }}</el-radio-button>
          <el-radio-button :label="1">{{ lang.hour }}</el-radio-button>
        </el-radio-group>
      </div>
      <h4 style="margin-top: 10px">{{ selectedStore.currency_id + ' (' + selectedStore.currency_name + ')' }}</h4>
      <div v-if="income === 0">
        <div v-loading="loading">
          <ve-line
            :legend-visible="false"
            :data="chartRevenueDate"
            :colors="colorsRevenue">
          </ve-line>
        </div>
      </div>
      <div v-if="income === 1">
        <div v-loading="loading">
          <ve-line
            :legend-visible="false"
            :data="chartRevenueHour"
            :colors="colorsRevenue">
          </ve-line>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    chartRevenueDate: {
      type: Object,
      default: () => {}
    },
    chartRevenueHour: {
      type: Object,
      default: () => {}
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      income: 0,
      colorsRevenue: ['#0085CD']
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
  }
}
</script>
