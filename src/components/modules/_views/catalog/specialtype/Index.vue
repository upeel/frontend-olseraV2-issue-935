<template>
  <div class="content-wrapper">
    <section class="content sales-list">
      <div class="panel tab-list">
        <ul class="nav-tabs-shop-devin" role="tablist">
          <li
            v-if="userRole.is_pos_only !== 1 && checkCustomPermission('catalog/featured', 'index')"
            :class="[methodRouteIsHiddenSubMenuClass('/specialtype/featured')]">
            <router-link :to="{path: '/specialtype/featured'}">
              {{ lang.featured }}
            </router-link>
          </li>
          <li
            v-if="userRole.is_pos_only !== 1 && checkCustomPermission('catalog/newrelease', 'index')"
            :class="[methodRouteIsHiddenSubMenuClass('/specialtype/newrelease')]">
            <router-link :to="{path: '/specialtype/newrelease'}">
              {{ lang.new_release }}
            </router-link>
          </li>
          <li
            v-if="userRole.is_pos_only !== 1 && checkCustomPermission('catalog/sale', 'index')"
            :class="[methodRouteIsHiddenSubMenuClass('/specialtype/sale')]">
            <router-link :to="{ path: '/specialtype/sale' }">
              {{ lang.sale }}
            </router-link>
          </li>
          <li
            v-if="checkCustomPermission('catalog/popular', 'index')"
            :class="[methodRouteIsHiddenSubMenuClass('/specialtype/popular')]">
            <router-link :to="{ path: '/specialtype/popular' }">
              {{ lang.popular }}
            </router-link>
          </li>
          <li
            v-if="userRole.is_pos_only !== 1 && checkCustomPermission('catalog/outstock', 'index')"
            :class="[methodRouteIsHiddenSubMenuClass('/specialtype/outstock')]">
            <router-link :to="{ path: '/specialtype/outstock' }">
              {{ lang.out_of_stock }}
            </router-link>
          </li>
          <li
            v-if="userRole.is_pos_only !== 1 && checkCustomPermission('catalog/preorder', 'index')"
            :class="[methodRouteIsHiddenSubMenuClass('/specialtype/preorder')]">
            <router-link :to="{ path: '/specialtype/preorder' }">
              {{ lang.preorder }}
            </router-link>
          </li>
          <li
            v-if="checkCustomPermission('catalog/rawmaterial', 'index')"
            :class="[methodRouteIsHiddenSubMenuClass('/specialtype/rawmaterial')]">
            <router-link :to="{ path: '/specialtype/rawmaterial' }">
              {{ $lang[langId].raw_material }}
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
    userRole() {
      const selectedStore = this.$store.getters.selectedStore
      return {
        role_id: selectedStore.role_id,
        role_name: selectedStore.role_name,
        is_pos_only: selectedStore.is_pos_only,
        is_mobile: selectedStore.is_mobile
      }
    }
  },
  mounted() {
    if (this.userRole.is_pos_only === 1) {
      this.$router.push('/specialtype/popular')
    }
  }
}
</script>
