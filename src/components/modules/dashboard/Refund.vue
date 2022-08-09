<template>
  <div
    v-if="userRole.role_id !== 'ST' && userRole.role_id !== 'SA'"
    class="flex-container-same-height no-flex-sm mb-16 bg-white box-shadow radius-10">
    <!-- <div class="dashboard-banner-section dashboard-banner-section--refund">
      <svg-icon icon-class="trending-down" />
      <span style="font-size: 18px">{{ lang.refunds }}</span>
    </div> -->

    <div class="dashboard-content-section">
      <svg-icon icon-class="trending-down" style="font-size: 25px; margin-right: 16px"/>
      <span style="font-size: 16px; font-weight: bold; margin-right: auto;">{{ lang.refunds }}</span>
      <h4 style="margin-top: 10px">{{ selectedStore.currency_id + ' (' + selectedStore.currency_name + ')' }}</h4>
      <div v-loading="loading">
        <ve-line
          :data="chartReturn"
          :legend-visible="false"
          :colors="colorsReturn">
        </ve-line>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    chartReturn: {
      type: Object,
      default: () => {}
    },
    colorsReturn: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      income: 0
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
