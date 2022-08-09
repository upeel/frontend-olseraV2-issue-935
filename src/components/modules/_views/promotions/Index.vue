<template>
  <div class="content-wrapper">
    <section class="content sales-list">
      <div class="panel tab-list">
        <ul class="nav-tabs-shop-devin" role="tablist">
          <li
            v-if="checkCustomPermission('promotion/discountsales', 'index')"
            :class="[methodRouteIsHiddenSubMenuClass('/promotions/sales')]">
            <router-link :to="{path: '/promotions/sales'}">
              {{ lang.sales_discount }}
            </router-link>
          </li>
          <li
            v-if="checkCustomPermission('promotion/discountvoucher', 'index')"
            :class="[methodRouteIsHiddenSubMenuClass('/promotions/coupon')]">
            <router-link :to="{path: '/promotions/coupon'}">
              {{ lang.voucher_discount }}
            </router-link>
          </li>
          <li
            v-if="selectedStore.is_pos === 1 && checkCustomPermission('promotion/promopos', 'index')"
            :class="[methodRouteIsHiddenSubMenuClass('/promotions/promopos')]">
            <router-link :to="{ path: '/promotions/promopos' }">
              {{ $lang[langId].promotion_pos }}
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
  mixins: [mixinHiddenFeatureByPlanType, checkCustomPermission],

  computed: {
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    selectedStore() {
      return this.$store.getters.selectedStore
    }
  }
}
</script>
