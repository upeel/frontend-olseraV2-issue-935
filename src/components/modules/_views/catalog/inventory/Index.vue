<template>
  <div class="content-wrapper">
    <section class="content sales-list">
      <div class="panel tab-list">
        <ul class="nav-tabs-shop-devin" role="tablist">
          <li
            v-if="checkCustomPermission('inventory/stockincomings', 'index')"
            :class="[methodRouteIsHiddenSubMenuClass('/inventory/stocksincoming')]">
            <router-link :to="{path: '/inventory/stocksincoming'}">
              {{ lang.incoming_stock }}
            </router-link>
          </li>
          <li
            v-if="checkCustomPermission('inventory/stockoutgoings', 'index')"
            :class="[methodRouteIsHiddenSubMenuClass('/inventory/stocksoutgoing')]">
            <router-link :to="{path: '/inventory/stocksoutgoing'}">
              {{ lang.outgoing_stock }}
            </router-link>
          </li>
          <li
            v-if="checkCustomPermission('inventory/productionsmode', 'index')"
            :class="[methodRouteIsHiddenSubMenuClass('/inventory/stocksproduction')]">
            <router-link :to="{ path: '/inventory/stocksproduction' }">
              {{ $lang[langId].stock_production }}
            </router-link>
          </li>
          <li
            v-if="checkCustomPermission('inventory/stockopname', 'index')"
            :class="[methodRouteIsHiddenSubMenuClass('/inventory/stocksopname')]">
            <router-link :to="{ path: '/inventory/stocksopname' }">
              {{ lang.stock_opname }}
            </router-link>
          </li>
          <li
            v-if="wejayafoodAccessByStore.includes(selectedStore.url_id)">
            <router-link :to="{ path: '/inventory/stocksoutstanding' }">
              {{ rootLang.stocks_outstanding }}
            </router-link>
          </li>
          <li
            :class="[methodRouteIsHiddenSubMenuClass('/inventory/stocksmovement')]">
            <router-link :to="{ path: '/inventory/stocksmovement' }">
              {{ lang.stock_movement }}
            </router-link>
          </li>
          <li
            v-if="checkCustomPermission('inventory/emailstockalert', 'index')"
            :class="[methodRouteIsHiddenSubMenuClass('/inventory/stocksalert')]">
            <router-link :to="{ path: '/inventory/stocksalert' }">
              {{ lang.email_stock_alert }}
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
import basicComputedMixin from '@/mixins/basicComputedMixin'

export default {
  mixins: [mixinHiddenFeatureByPlanType, basicComputedMixin, checkCustomPermission],

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
    },
    user() {
      return this.$store.getters.loggedInUser
    },
    selectedStore () {
      return this.$store.getters.selectedStore
    },
    accessByStore () {
      return ['cvsms', 'smsstore1', 'smsstore2']
    }
  },

  methods: {
    modulCanAccess (role) {
      let data = []
      if (this.selectedStore.url_id === 'cvsms') {
        if (role === 'LW') {
          data = ['opname']
        }
      }
      if (this.selectedStore.url_id === 'smsstore1' || this.selectedStore.url_id === 'smsstore2') {
        if (role === 'PT') {
          data = ['opname']
        }
      }
      return data
    },
    canAccess (role, modul) {
      if (this.modulCanAccess(role).includes(modul)) {
        if (this.accessByStore.includes(this.selectedStore.url_id) && this.modulCanAccess(role).includes(modul)) {
          return true
        } else {
          return false
        }
      }
    },
  }
}
</script>
