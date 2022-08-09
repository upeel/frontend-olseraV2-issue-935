<template>
    <div class="content-wrapper">
      <section class="content-accounting" style="padding: 120px 0 30px;">
        <div class="panel tab-list">
          <ul class="nav-tabs-shop-devin" role="tablist">
            <li data-wow-delay="0.10s">
              <router-link :to="{path: '/accounting/cash-bank/cash-bank-list'}">
                {{ $lang[langId].cash_n_bank_list }}
              </router-link>
            </li>
            <li data-wow-delay="0.2s">
              <router-link :to="{path: '/accounting/cash-bank/payment-map'}">
                {{ lang.payment_methods }}
              </router-link>
            </li>
            <li data-wow-delay="0.3s">
              <router-link :to="{path: '/accounting/cash-bank/bank-statement'}">
                {{ $lang[langId].bank_statement }}
              </router-link>
            </li>
            <li data-wow-delay="0.4s">
              <router-link :to="{path: '/accounting/cash-bank/bank-reconcile'}">
                {{ $lang[langId].bank_reconcile }}
              </router-link>
            </li>
            <li data-wow-delay="0.5s">
              <router-link :to="{path: '/accounting/cash-bank/bank-settlement'}">
                {{ $lang[langId].confirm_settlement }}
              </router-link>
            </li>
            <li data-wow-delay="0.6s">
              <router-link :to="{path: '/accounting/cash-bank/taxibike-online-price'}">
                {{ $lang[langId].taxibike_online_price }}
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
