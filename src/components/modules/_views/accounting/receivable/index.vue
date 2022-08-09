<template>
    <div class="content-wrapper">
      <section class="content-accounting sales-list" style="padding: 120px 0 30px;">          
        <div class="panel tab-list">
          <ul class="nav-tabs-shop-devin" role="tablist">
            <li data-wow-delay="0.10s">
              <router-link :to="{path: '/accounting/receivable/receivable-list'}">
                {{ $lang[langId].all_receivable }}
              </router-link>
            </li>
            <li data-wow-delay="0.14s">
              <router-link :to="{path: '/accounting/receivable/customer-due-date'}">
                {{ lang.customer }} {{ lang.due_date }}
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
  name: 'Receivable',
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
