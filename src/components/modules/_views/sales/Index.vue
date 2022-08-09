<template>
  <div class="content-wrapper">
    <section class="content sales-list">
      <div class="panel tab-list">
        <ul class="nav-tabs-shop-devin" role="tablist">
          <li
            v-if="checkCustomPermission('sales/openorders', 'index')">
            <router-link :to="{path: '/sales/openorder'}">
              {{ lang.open_orders }}
            </router-link>
          </li>
          <li
            v-if="checkCustomPermission('sales/closedorders', 'index')">
            <router-link :to="{path: '/sales/completeorder'}">
              {{ $lang[langId].order_success }}
            </router-link>
          </li>
          <li
            v-if="checkCustomPermission('sales/salesreturns', 'index')">
            <router-link :to="{path: '/sales/returnorder'}">
              {{ lang.returns }}
            </router-link>
          </li>
          <li
            v-if="checkCustomPermission('sales/cancelledorders', 'index')">
            <router-link :to="{path: '/sales/cancelorder'}">
              {{ lang.cancelled }}
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
  name: 'SalesIndex',
  mixins: [checkCustomPermission],
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
