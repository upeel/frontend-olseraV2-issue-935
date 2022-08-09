<template>
  <div class="content-wrapper">
    <section class="content-accounting" style="padding: 120px 0 30px;">
      <div class="panel tab-list">
        <ul class="nav-tabs-drop-menu" role="tablist">
          <li data-wow-delay="0.5s">
            <router-link :to="{path: '/accounting/pos-transaction/sales'}">
              {{ $lang[langId].sales }}
            </router-link>
          </li>
          <li data-wow-delay="0.6s">
            <router-link :to="{path: '/accounting/pos-transaction/purchase'}">
              {{ lang.purchase }}
            </router-link>
          </li>
          <li data-wow-delay="0.7s">
            <router-link :to="{path: '/accounting/pos-transaction/sales-return'}">
              {{ $lang[langId].salesreturn2 }}
            </router-link>
          </li>
          <li data-wow-delay="0.8s">
            <router-link :to="{path: '/accounting/pos-transaction/stock-in'}">
              {{ $lang[langId].stock_incoming }}
            </router-link>
          </li>
          <li data-wow-delay="0.9s">
            <router-link :to="{path: '/accounting/pos-transaction/stock-out'}">
              {{ $lang[langId].stock_outgoing }}
            </router-link>
          </li>
          <li data-wow-delay="1.0s">
            <router-link :to="{path: '/accounting/pos-transaction/income'}">
              {{ $lang[langId].income_data }}
            </router-link>
          </li>
          <li data-wow-delay="1.1s">
            <router-link :to="{path: '/accounting/pos-transaction/expense'}">
              {{ $lang[langId].outlay_data }}
            </router-link>
          </li>
          <!-- <li>
            <a href="#">
              {{lang.income}} <span class="caret"></span>
            </a>
            <ul class="dropdownMenu">
              <li>
                <router-link :to="{path: '/accounting/pos-transaction/income'}">
                  <svg-icon icon-class="pendapatan_ico"></svg-icon> {{$lang[langId].income_data}}
                </router-link>
              </li>
              <li>
                <router-link :to="{path: '/accounting/pos-transaction/income-trans-type'}">
                  <svg-icon icon-class="file"></svg-icon> {{$lang[langId].transaction_types}}
                </router-link>
              </li>
            </ul>
          </li>
          <li>
            <a href="#">
              {{lang.expense}} <span class="caret"></span>
            </a>
            <ul class="dropdownMenu">
              <li>           
                <router-link :to="{path: '/accounting/pos-transaction/expense'}">
                  <svg-icon icon-class="pengeluaran_ico"></svg-icon> {{$lang[langId].outlay_data}}
                </router-link>
              </li>
              <li>                
                <router-link :to="{path: '/accounting/pos-transaction/expense-trans-type'}">
                  <svg-icon icon-class="file"></svg-icon> {{$lang[langId].transaction_types}}
                </router-link>
              </li>
            </ul>
          </li> -->
        </ul>
          
      </div>
      <div class="tab-content">
        <router-view></router-view>
      </div>
    </section>
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin';
export default {
  name: 'POSTransaction',
  components: {
 
  },
  mixins: [basicComputedMixin],
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

<style lang="scss">
.dropdownM:hover ul 
{
    display: block;
    position: absolute;
}

.dropdownM:hover li
{
    float: none;
    font-size: 11px;
}

.dropdownM:hover a 
{
    background: #617F8A;
}

.dropdownM:hover li a:hover 
{
    background: #95A9B1;
}
</style>
