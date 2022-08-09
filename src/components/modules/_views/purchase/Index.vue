<template>
  <div class="content-wrapper">
    <section class="content sales-list">
      <div class="panel tab-list purchase">
        <ul class="nav-tabs-shop-devin" role="tablist">
          <li
            v-if="checkCustomPermission('purchase/openpurchases', 'index')"
            :class="[methodRouteIsHiddenSubMenuClass('/purchase/openpurchase')]">
            <router-link :to="{path: '/purchase/openpurchase'}">
              {{ lang.open_purchases }}
            </router-link>
          </li>
          <li
            v-if="checkCustomPermission('purchase/closedpurchases', 'index')"
            :class="[methodRouteIsHiddenSubMenuClass('/purchase/completepurchase')]">
            <router-link :to="{path: '/purchase/completepurchase'}">
              {{ lang.closed_orders }}
            </router-link>
          </li>
          <li
            v-if="checkCustomPermission('purchase/cancelledpurchases', 'index')"
            :class="[methodRouteIsHiddenSubMenuClass('/purchase/cancelpurchase')]">
            <router-link :to="{path: '/purchase/cancelpurchase'}">
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
import { mixinHiddenFeatureByPlanType } from '@/mixins/mixinHiddenFeatureByPlanType'
import { checkCustomPermission } from '@/mixins/checkCustomPermission'

export default {
  name: 'PurchaseIndex',
  mixins: [mixinHiddenFeatureByPlanType, checkCustomPermission],
  computed: {
    lang() {
      return this.$store.state.userStores.lang
    }
  }
}
</script>
