<template>
  <div class="content-wrapper">
    <section class="content sales-list">
      <div class="panel tab-list">
        <ul class="nav-tabs-shop-devin" role="tablist">
          <li
            v-if="checkCustomPermission('settings/posrestolayout', 'index')"
            :class="[ methodRouteIsHiddenSubMenuClass('/restomode/posrestolayout') ]">
            <router-link :to="{ path: '/restomode/posrestolayout' }">
              {{ lang.restaurant_layout }}
            </router-link>
          </li>
          <li
            v-if="checkCustomPermission('settings/posdisabledinein', 'index')">
            <router-link :to="{ path: '/restomode/posdisabledinein' }">
              {{ lang.dine_in_take_away}}
            </router-link>
          </li>
          <li
            v-if="checkCustomPermission('settings/posbilling', 'index')">
            <router-link :to="{ path: '/restomode/posbilling' }">
              {{ lang.billing }}
            </router-link>
          </li>
          <li
            v-if="checkCustomPermission('settings/poslocalserver', 'index')">
            <router-link :to="{ path: '/restomode/poslocalserver' }">
              {{ $lang[langId].local_server }}
            </router-link>
          </li>
          <li
            v-if="checkCustomPermission('settings/courselinegroup', 'index')">
            <router-link :to="{ path: '/restomode/courselinegrouping' }">
              {{ $lang[langId].course_line_group }}
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
  name: 'PosSettingsIndex',
  mixins: [mixinHiddenFeatureByPlanType, checkCustomPermission],
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
