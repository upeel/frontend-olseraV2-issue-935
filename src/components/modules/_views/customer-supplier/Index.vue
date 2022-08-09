<template>
  <div class="content-wrapper">
    <section class="content sales-list">
      <div class="panel tab-list">
        <ul class="nav-tabs-shop-devin" role="tablist">
          <template v-for="item in menus">
            <li
              v-if="checkCustomPermission('customer/' + item.id, 'index')"
              :key="item.path"
              :class="[methodRouteIsHiddenSubMenuClass(item.path)]">
              <router-link :to="{path: item.path}">
                {{ lang[item.label] }}
              </router-link>
            </li>
          </template>
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
  name: 'CustomerIndex',
  mixins: [mixinHiddenFeatureByPlanType, checkCustomPermission],
  computed: {
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    menus() {
      return [
        {
          path: '/customersupplier/customer',
          label: 'customer',
          id: 'customer/customers'
        },
        {
          path: '/customersupplier/customertype',
          label: 'customer_type',
          id: 'customer/customertypes'
        },
        {
          path: '/customersupplier/customerreview',
          label: 'customer_review',
          id: 'customer/customerreviews'
        },
        {
          path: '/customersupplier/supplier',
          label: 'supplier',
          id: 'customer/suppliers'
        }
      ]
    }
  }
}
</script>
