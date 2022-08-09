<template>
  
    <div class="content-wrapper">
      <section class="content sales-list">
        <div class="panel tab-list">
          <ul class="nav-tabs-shop-devin" role="tablist">
            <li v-if="checkCustomPermission('settings/shippings', 'index')">
              <router-link :to="{ path: '/settings/shippings/general' }">
                {{ lang.general_info }}
              </router-link>
            </li>
            <li v-if="checkCustomPermission('settings/shippingpostcode', 'index')">
              <router-link :to="{ path: '/settings/shippings/postalcodes' }">
                {{ lang.postal_code }}
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
import { checkCustomPermission } from '@/mixins/checkCustomPermission'
export default {
  mixins: [checkCustomPermission],
  computed: {
    lang() {
      return this.$store.state.userStores.lang
    },
    token() {
      return this.$store.state.user.token
    },
    selectedStore() {
      return this.$store.getters.selectedStore
    }
  },
  watch: {
    '$store.getters.selectedStore'() {
      this.getTest()
    }
  },
  methods: {
    getTest() {
      console.log('test', '')
    }
  }
}
</script>
