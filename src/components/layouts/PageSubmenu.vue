<template>
  <div class="content-wrapper">
    <section class="content sales-list">
      <div class="panel tab-list">
        <ul class="nav-tabs-shop-devin" role="tablist">
          <template
            v-for="(menu, menuKey) in menus">
            <li
              v-if="(!menu.shown_for || (menu.shown_for && !menu.shown_for.length) && isShownByPermission(menu)) || (menu.shown_for && menu.shown_for.length && menu.shown_for.includes(selectedStoreURLId))"
              :key="menuKey"
              :class="[methodRouteIsHiddenSubMenuClass(menu.path)]">
              <router-link
                :to="{ path: menu.path }">
                {{ menu.label }}
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
  props: {
    menus: {
      type: Array,
      default: () => []
    }
  },

  mixins: [mixinHiddenFeatureByPlanType, checkCustomPermission],

  computed: {
    userRole() {
      const selectedStore = this.$store.getters.selectedStore
      return {
        role_id: selectedStore.role_id,
        role_name: selectedStore.role_name,
        is_pos_only: selectedStore.is_pos_only,
        is_mobile: selectedStore.is_mobile
      }
    },
    selectedStoreURLId() {
      return this.$store.getters.selectedStore.url_id
    }
  },

  methods: {
    isShownByPermission(menu) {
      return (!menu.roles_except.includes(this.userRole.role_id) && !menu.permission_id) ||
        (menu.permission_id && this.checkCustomPermission(menu.permission_id, 'index'))
    }
  }
}
</script>
