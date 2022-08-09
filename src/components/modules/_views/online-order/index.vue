<template>
  <div class="content-wrapper">
    <section class="content sales-list">
      <div class="panel tab-list">
        <ul class="nav-tabs-shop-devin" role="tablist">
          <li>
            <router-link :to="{ path: '/online-order/service' }">
              {{ $lang[langId].service }}
            </router-link>
          </li>
          <li
            :class="[methodRouteIsHiddenSubMenuClass('/online-order/working-hours')]">
            <router-link
              :to="{ path: '/online-order/working-hours' }">
              {{ $lang[langId].working_hours }}
            </router-link>
          </li>
          <li>
            <router-link :to="{ path: '/online-order/delivery' }">
              {{ $lang[langId].delivery }}
            </router-link>
          </li>
          <li v-if="selectedStore.pos_resto_mode === 1">
            <router-link :to="{ path: '/online-order/dinein' }">
              Dine In & Buku Menu
            </router-link>
          </li>
          <li v-if="stageLevel === 'dev' || stageLevel === 'sit'">
            <router-link :to="{ path: '/online-order/reservation' }">
              Reservasi
            </router-link>
          </li>
          <li>
            <router-link :to="{ path: '/online-order/setting' }">
              {{ $lang[langId].setting }}
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
export default {
  name: 'OnlineOrderSetting',
  mixins: [mixinHiddenFeatureByPlanType, basicComputedMixin],
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
    '$store.getters.selectedStore'() {
      this.getTest()
    }
  },
  methods: {
    getTest() {
      if (this.selectedStore.active_online_order === 0) {
        this.$router.push('/dashboard')
      }
    }
  }
}
</script>
