<template>
  <div class="content-wrapper">
    <section class="content sales-list">
      <div class="panel tab-list">
        <ul class="nav-tabs-shop-devin" role="tablist">
          <li
            v-if="checkCustomPermission('website/mysite', 'index')">
            <router-link :to="{path: '/website/mysite/global'}">
              {{ $lang[langId].global }}
            </router-link>
          </li>
          <li
            v-if="checkCustomPermission('website/sitenav', 'index')">
            <router-link :to="{path: '/website/mysite/navigation'}">
              {{ lang.navigation }}
            </router-link>
          </li>
          <li
            v-if="checkCustomPermission('website/usemydomain', 'index')">
            <router-link :to="{path: '/website/mysite/customdomain'}">
              {{ lang.custom_domain }}
            </router-link>
          </li>
          <li
            v-if="selectedStore.is_onlineshop === 1 && checkCustomPermission('settings/paymentmodes', 'index')">
            <router-link :to="{path: '/website/mysite/payment'}">
              {{ lang.payment }}
            </router-link>
          </li>
          <li
            v-if="selectedStore.allow_merge_store_stocks === 1 && checkCustomPermission('website/storestockrefs', 'index')">
            <router-link :to="{path: '/website/mysite/mergestocks'}">
              {{ lang.merge_stocks }}
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
import { checkCustomPermission } from '@/mixins/checkCustomPermission'

export default {
  name: 'MySiteIndex',
  mixins: [checkCustomPermission],
  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
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
