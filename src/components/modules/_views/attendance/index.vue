<template>
  <div class="content-wrapper">
    <section class="content sales-list">
      <div class="panel tab-list">
        <ul class="nav-tabs-shop-devin" role="tablist">
          <li
            :class="[methodRouteIsHiddenSubMenuClass('/attendance/employee')]">
            <router-link :to="{ path: '/attendance/employee' }">
              {{ $lang[langId].employee }}
            </router-link>
          </li>
          <li
            :class="[methodRouteIsHiddenSubMenuClass('/attendance/shift')]">
            <router-link :to="{ path: '/attendance/shift' }">
              {{ $lang[langId].shift }}
            </router-link>
          </li>
          <li
            :class="[methodRouteIsHiddenSubMenuClass('/attendance/presence')]">
            <router-link :to="{ path: '/attendance/presence' }">
              {{ $lang[langId].presence }}
            </router-link>
          </li>
          <li
            v-if="hasAccessFaceRecog || selectedStore.plan_type_id === 'F'"
            :class="[methodRouteIsHiddenSubMenuClass('/attendance/presence')]">
            <router-link :to="{ path: '/attendance/devices' }">
              {{ $lang[langId].devices }}
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
import basicComputedMixin from '@/mixins/basicComputedMixin'
import { mixins } from './mixins'

export default {
  name: 'Attendance',
  mixins: [mixinHiddenFeatureByPlanType, basicComputedMixin, mixins],
  computed: {
    lang() {
      return this.$store.state.userStores.lang
    },
    token() {
      return this.$store.state.user.token
    },
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    langId() {
      return this.$store.state.userStores.langId
    }
  },

  watch: {
    '$store.getters.selectedStore'(selectedStore) {
      if (selectedStore.plan_type_id !== 'P') {
        this.$router.push('/attendance/presence')
      }
    }
  }
}
</script>
