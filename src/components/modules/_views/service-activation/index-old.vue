<template>
  <div class="content-wrapper">
    <section class="content sales-list">
      <div class="panel tab-list">
        <ul class="nav-tabs-shop-devin" role="tablist">
          <li data-wow-delay="0.12s">
            <router-link :to="{path: '/service-activation/credit-card'}">
              Credit Card
            </router-link>
          </li>
          <li data-wow-delay="0.12s">
            <router-link :to="{path: '/service-activation/digital-qr-code'}">
              Digital QR Code
            </router-link>
          </li>
        </ul>
      </div>

      <div class="tab-content">
        <router-view></router-view>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'SalesIndex',
  computed: {
    lang() {
      return this.$store.state.userStores.lang
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    userRole() {
      const selectedStore = this.$store.getters.selectedStore
      return {
        role_id: selectedStore.role_id,
        role_name: selectedStore.role_name,
        is_pos_only: selectedStore.is_pos_only,
        is_mobile: selectedStore.is_mobile
      }
    },
    selectedStore() {
      return this.$store.getters.selectedStore
    }
  }
}
</script>
