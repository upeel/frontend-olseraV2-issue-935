<template>
  
    <div class="content-wrapper">
      <section class="content-accounting" style="padding: 120px 0 30px;">          
        <div class="panel tab-list">
          <ul class="nav-tabs-shop-devin" role="tablist">
            <li data-wow-delay="0.8s">
              <router-link :to="{path: '/accounting/payable/payable-list'}">
                {{ $lang[langId].all_payable }}
              </router-link>
            </li>
            <li data-wow-delay="0.10s">
              <router-link :to="{path: '/accounting/payable/supplier-due-date'}">
                {{ lang.supplier }} {{ lang.due_date }}
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
  name: 'Payable',
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
