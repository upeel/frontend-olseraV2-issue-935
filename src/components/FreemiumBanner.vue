<template>
  <div>
    <div
      v-if="typeof tabs === 'undefined' && typeof dialog === 'undefined'"
      class="content-wrapper">
      <div class="content sales-list">
        <freemium-banner-content />
      </div>
    </div>
    <div v-else-if="tabs === 1">
      <freemium-banner-content mode="tabs" />
    </div>
    <div v-else-if="dialog === 1">
      <freemium-banner-content mode="dialog" />
    </div>
  </div>
</template>

<script>
import FreemiumBannerContent from './FreemiumBannerContent'
export default {
  name: 'FreemiumBanner',

  components: {
    FreemiumBannerContent
  },

  props: ['tabs', 'dialog'],

  computed: {
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    selectedStore () {
      return this.$store.getters.selectedStore
    }
  },

  watch: {
    '$store.getters.selectedStore'() {
      if (this.$store.getters.selectedStore.pos_freemium === 0) {
        this.$router.push(this.$route.meta.freemiumRedirect)
      }
    }
  },

  mounted() {
    if (this.$store.getters.selectedStore.pos_freemium === 0) {
      this.$router.push(this.$route.meta.freemiumRedirect)
    }
  }
}
</script>
