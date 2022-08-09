<template>
  
    <div class="content-wrapper">
      <section class="content-accounting sales-list">          
        <div class="panel tab-list">
          <ul class="nav-tabs-shop-devin" role="tablist">
            <li data-wow-delay="0.14s">
              <router-link :to="{path: '/accounting/setting/customer-due-date'}">
                {{ lang.customer }} {{ lang.due_date }}
              </router-link>
            </li>
            <li data-wow-delay="0.10s">
              <router-link :to="{path: '/accounting/setting/supplier-due-date'}">
                {{ lang.supplier }} {{ lang.due_date }}
              </router-link>
            </li>
            <li data-wow-delay="0.10s">
              <router-link :to="{path: '/accounting/setting/payment-map'}">
                {{ $lang[langId].payment_map }}
              </router-link>
            </li>
            <li data-wow-delay="0.6s">
              <router-link :to="{path: '/accounting/setting/reset'}">
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
export default {
  name: 'SettingAccounting',
  components: {
 
  },
  data () {
    return{

    }
  },
  
  computed: {
    langId() {
      return this.$store.state.userStores.langId
    },
    token() {
      return this.$store.state.user.token
    },
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    lang() {
      return this.$store.state.userStores.lang
    },
  }
}
</script>
