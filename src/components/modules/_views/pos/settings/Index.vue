<template>
  <div class="content-wrapper">
    <section class="content sales-list">
      <div class="panel tab-list">
        <ul class="nav-tabs-shop-devin" role="tablist">
          <li
            v-if="checkCustomPermission('settings/pospaymentmodes', 'index')">
            <router-link :to="{ path: '/pos-settings/pospaymentmodes' }">
              {{ lang.payment }}
            </router-link>
          </li>
          <li
            v-if="checkCustomPermission('settings/posdevices', 'index')">
            <router-link :to="{ path: '/pos-settings/posdevice' }">
              {{ lang.station }}
            </router-link>
          </li>
          <li
            v-if="checkCustomPermission('settings/posreceiptnote', 'index')">
            <router-link :to="{ path: '/pos-settings/posreceiptnote' }">
              {{ $lang[langId].receipt_note }}
            </router-link>
          </li>
          <li
            v-if="checkCustomPermission('settings/posemailreport', 'index')"
            :class="[methodRouteIsHiddenSubMenuClass('/pos-settings/posemailreport')]">
            <router-link
              :to="{ path: '/pos-settings/posemailreport' }">
              {{ lang.email }} {{ lang.reports }}
            </router-link>
          </li>
          <li
            v-if="checkCustomPermission('settings/pospasskey', 'index')">
            <router-link :to="{ path: '/pos-settings/pospasskey' }">
              {{ lang.pos_pass_key }}
            </router-link>
          </li>
          <li
            v-if="checkCustomPermission('settings/posextsetting', 'index')">
            <router-link :to="{ path: '/pos-settings/posextsetting' }">
              {{ lang.pos_ext_settings }}
            </router-link>
          </li>
          <li
            v-if="checkCustomPermission('settings/shiftsetting', 'index')">
            <router-link :to="{ path: '/pos-settings/shiftsetting' }">
              {{ lang.shift }}
            </router-link>
          </li>
          <li
            v-if="checkCustomPermission('settings/posstockmode', 'index')">
            <router-link :to="{ path: '/pos-settings/posstockmode' }">
              {{ lang.check_stock_mode }}
            </router-link>
          </li>
          <li
            v-if="checkCustomPermission('settings/shifttime', 'index')">
            <router-link :to="{ path: '/pos-settings/shifttime' }">
              {{ $lang[langId].shift_timing_v1 }}
            </router-link>
          </li>
          <li
            v-if="selectedStore.pos_resto_mode === 1 && checkCustomPermission('settings/posqueue', 'index')">
            <router-link :to="{ path: '/pos-settings/postqueue' }">
              {{ $lang[langId].post_queue }}
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
    },
    selectedStore () {
      return this.$store.getters.selectedStore
    },
    stageLevel() {
      return process.env.NODE_ENV
    },
    loggedInUser() {
      return this.$store.getters.loggedInUser
    }
  }
}
</script>
