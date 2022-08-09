<template>
  <div class="content-wrapper">
    <section class="content sales-list no-padding-bottom">
      <div class="panel tab-list">
        <ul class="nav-tabs-shop-devin" role="tablist">
          <template v-if="accessByStore.includes(this.selectedStore.url_id)">
            <li
              v-if="canAccess(userRole.role_id, 'product') && checkCustomPermission('report/productreports', 'index')">
              <router-link :to="{ path: '/reports/products' }">
                {{ lang.product_reports }}
              </router-link>
            </li>
            <li
              v-if="canAccess(userRole.role_id, 'purchase') && checkCustomPermission('report/purchasereports', 'index')">
              <router-link :to="{ path: '/reports/purchases' }">
                {{ lang.purchase_reports }}
              </router-link>
            </li>
            <li
              v-if="canAccess(userRole.role_id, 'sales') && checkCustomPermission('report/salesreports', 'index')">
              <router-link :to="{ path: '/reports/sales' }">
                {{ lang.sales_reports }}
              </router-link>
            </li>
            <li
              v-if="canAccess(userRole.role_id, 'shift') && checkCustomPermission('report/salesshiftreport', 'index')">
              <router-link :to="{ path: '/reports/shifts' }">
                {{ lang.sales_by_shift_reports }}
              </router-link>
            </li>
            <li
              v-if="canAccess(userRole.role_id, 'payment') && checkCustomPermission('report/paymentreports', 'index')">
              <router-link :to="{ path: '/reports/payments' }">
                {{ lang.payment_reports }}
              </router-link>
            </li>
            <li
              v-if="canAccess(userRole.role_id, 'multioutlet') && checkCustomPermission('report/multioutletrpt', 'index')">
              <router-link :to="{ path: '/reports/multioutlets' }">
                {{ lang.multi_outlet_reports }}
              </router-link>
            </li>
            <li
              v-if="canAccess(userRole.role_id, 'attendance')">
              <router-link :to="{ path: '/reports/attendance' }">
                {{ $lang[langId].reports_attendance }}
              </router-link>
            </li>
          </template>

          <template v-else-if="selectedStore.role_id !== 'PJ'">
            <li>
              <router-link :to="{ path: '/reports/products' }">
                {{ lang.product_reports }}
              </router-link>
            </li>
            <li>
              <router-link :to="{ path: '/reports/purchases' }">
                {{ lang.purchase_reports }}
              </router-link>
            </li>
            <li>
              <router-link :to="{ path: '/reports/sales' }">
                {{ lang.sales_reports }}
              </router-link>
            </li>
            <li v-if="userRole.role_id !== 'SS' || user.email === 'martina.maria@samaramicron.com'">
              <router-link :to="{ path: '/reports/shifts' }">
                {{ lang.sales_by_shift_reports }}
              </router-link>
            </li>
            <li v-if="userRole.role_id !== 'SS'">
              <router-link :to="{ path: '/reports/payments' }">
                {{ lang.payment_reports }}
              </router-link>
            </li>
            <li v-if="userRole.role_id !== 'RP' && userRole.role_id !== 'SS'">
              <router-link :to="{ path: '/reports/multioutlets' }">
                {{ lang.multi_outlet_reports }}
              </router-link>
            </li>
            <li v-if="stageLevel !== 'production' || user.email === 'akmal@olsera.com'">
              <router-link :to="{ path: '/reports/attendance' }">
                {{ $lang[langId].reports_attendance }}
              </router-link>
            </li>
          </template>
          <template v-else-if="selectedStore.role_id === 'PJ'">
            <li>
              <router-link :to="{ path: '/reports/salestaxrole' }">
                {{ $lang[langId].sales_report }}
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
import basicComputedMixin from '@/mixins/basicComputedMixin'
export default {
  mixins: [basicComputedMixin],

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

    selectedStore() {
      return this.$store.getters.selectedStore
    },

    user() {
      return this.$store.getters.loggedInUser
    },

    stageLevel() {
      return process.env.NODE_ENV
    },

    accessByStore () {
      return ['cvsms', 'smsstore1', 'smsstore2']
    },

    accessByEmail () {
      return ['sales@samaramicron.com']
    }
  },

  mounted() {
    if (this.accessByStore.includes(this.selectedStore.url_id) && (this.userRole.role_id === 'SA' || this.userRole.role_id === 'ST' || this.userRole.role_id === 'LW')) {
      this.$router.push('/reports/sales')
    } 
    else if (this.accessByStore.includes(this.selectedStore.url_id) && this.userRole.role_id === 'PT') {
      this.$router.push('/reports/purchases')
    }
  },

  methods: {
    modulCanAccess (store, role) {
      let data = []
      if (store === 'cvsms') {
        if (role === 'OW') {
          data = ['product', 'sales', 'shift', 'purchase', 'multioutlet', 'attendance']
        }
        if (role === 'ap@samaramicron.com') {
          data = ['purchase']
        }
        if (role === 'LW') {
          data = ['product']
        }
        if (role === 'SS') {
          data = ['product']
        }
        if (role === 'ST') {
          data = ['product', 'sales']
        }
        if (role === 'PT') {
          data = ['purchase']
        }
        if (role === 'SA') {
          data = ['sales']
        }
      } if (store === 'smsstore1' || store === 'smsstore2') {
        if (role === 'OW') {
          data = ['product', 'sales', 'shift', 'purchase', 'multioutlet', 'attendance']
        }
        if (role === 'PT') {
          data = ['purchase', 'sales']
        }
        if (role === 'LW') {
          data = ['product', 'sales']
        }
      }
      return data
    },

    modulCantAccess (emailorstore) {
      let data = []
      if (emailorstore === 'hkr.shoichi@gmail.com') {
        data = ['payment', 'salesshift', 'multioutlets', 'product', 'attendance']
      }
      return data
    },

    canAccess (role, modul) {
      if (this.accessByStore.includes(this.selectedStore.url_id) && this.modulCanAccess(this.selectedStore.url_id, role).includes(modul)) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>
