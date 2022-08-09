<template>
  <div class="content-wrapper">
    <section class="content sales-list">
      <div class="panel tab-list">
        <ul class="nav-tabs-shop-devin" role="tablist">
          <li>
            <router-link :to="{path: '/website/reseller/resellers'}">
              {{ $lang[langId].list }} {{ lang.resellers }}
            </router-link>
          </li>
          <li>
            <router-link :to="{path: '/website/reseller/resellertypes'}">
              {{ lang.reseller_type }}
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
  computed: {
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    }
  }
}
</script>
