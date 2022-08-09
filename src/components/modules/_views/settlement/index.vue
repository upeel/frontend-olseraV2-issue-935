<template>
  
    <div class="content-wrapper">
      <section class="content sales-list">
        <div class="panel tab-list">
          <ul class="nav-tabs-shop-devin" role="tablist">
            <li data-wow-delay="0.6s">
              <router-link :to="{ path: '/settlement/settlement-list' }">
                {{ rootLang.settlement }}
              </router-link>
            </li>
            <!--  -->
            <li data-wow-delay="0.6s">
              <router-link :to="{ path: '/settlement/online-order' }">
                {{ rootLang.online_sales }}
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
import basicComputedMixin from '@/mixins/basicComputedMixin'
export default {
  name: 'Settlement',
  mixins: [basicComputedMixin],

  computed: {
    accessByStore () {
      return ['setdemo1', 'allinolsera2']
    },
  },
  watch: {
    '$store.getters.selectedStore'() {
      this.getTest()
    }
  },
  methods: {
    // getTest() {
    //   if (this.selectedStore.active_online_order === 0) {
    //     this.$router.push('/dashboard')
    //   }
    // }
  }
}
</script>
