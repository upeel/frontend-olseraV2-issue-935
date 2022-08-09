<template>
  <div class="content-wrapper">
    <section class="content">
      <div class="container-768">
        Coming Soon
      </div>
    </section>
  </div>
</template>

<script>
export default {
  computed: {
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    rootLang() {
      return this.$lang[this.langId]
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
    isCollapse() {
      return this.$store.state.sidebarCollapse
    }
  }
}
</script>
