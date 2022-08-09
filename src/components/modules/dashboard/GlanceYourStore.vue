<template>
  <div v-loading="loading" class="flex-container-same-height no-flex-sm mb-16 bg-white box-shadow">
    <div class="dashboard-banner-section">
      <svg-icon icon-class="sun" style="width: 20px; height:20px; stroke:#FFFFFF;"></svg-icon>
      <span style="font-size: 18px">{{ $lang[langId].glance_your_store }}</span>
    </div>

    <div class="dashboard-content-section">
      <div class="flex-container" style="margin-bottom: -16px">
        <div class="container-icon">
          <svg-icon icon-class="user-plus" class="font-18"></svg-icon>
        </div>
        <div class="semi-bold ml-8" style="flex-grow: 2;">{{ lang.new_customer }}</div>
        <div class="warning-dashboard semi-bold" style="text-align: right">
          <span>{{ data.new_customers }}</span>
        </div>
      </div>
      <el-divider />

      <div class="flex-container" style="margin-bottom: -16px">
        <div class="container-icon">
          <svg-icon icon-class="shopping-cart" class="font-18"></svg-icon>
        </div>
        <div class="semi-bold ml-8" style="flex-grow: 2;">{{ lang.orders }}</div>
        <div class="warning-dashboard semi-bold" style="text-align: right">
          <span>{{ data.total_orders }}</span>
        </div>
      </div>
      <el-divider />

      <div class="flex-container" style="margin-bottom: -16px">
        <div class="container-icon">
          <svg-icon icon-class="pendapatan_ico" class="font-18"></svg-icon>
        </div>
        <div class="semi-bold ml-8" style="flex-grow: 2;">{{ lang.revenue }}</div>
        <div class="warning-dashboard semi-bold" style="text-align: right">
          <span>{{ data.ftotal_revenues }}</span>
        </div>
      </div>
      <el-divider />

      <div class="flex-container" style="margin-bottom: -16px">
        <div class="container-icon">
          <svg-icon icon-class="pengeluaran_ico" class="font-18"></svg-icon>
        </div>
        <div class="semi-bold ml-8" style="flex-grow: 2;">{{ rootLang.expense }}</div>
        <div class="warning-dashboard semi-bold" style="text-align: right">
          <span>{{ data.ftotal_expenses }}</span>
        </div>
      </div>
      <el-divider />

      <div class="flex-container" style="margin-bottom: -16px">
        <div class="container-icon">
          <svg-icon icon-class="trending-down" class="font-18"></svg-icon>
        </div>
        <div class="semi-bold ml-8" style="flex-grow: 2;">{{ lang.sales_return }}</div>
        <div class="warning-dashboard semi-bold" style="text-align: right">
          <span>{{ data.ftotal_returns }}</span>
        </div>
      </div>
      <el-divider />

      <div class="flex-container">
        <div class="container-icon">
          <svg-icon icon-class="ico-avg-transaction" class="font-18"></svg-icon>
        </div>
        <div class="semi-bold ml-8" style="flex-grow: 2;">{{ $lang[langId].avg_transaction }}</div>
        <div class="warning-dashboard semi-bold" style="text-align: right">
          <span>{{ data.faverage_transaction }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
export default {
  mixins: [basicComputedMixin],
  props: {
    data: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
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
