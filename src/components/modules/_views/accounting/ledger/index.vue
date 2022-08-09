<template>
    <div class="content-wrapper">
      <section class="content-accounting" style="padding: 120px 0 30px;">

        <div class="panel tab-list">
          <ul class="nav-tabs-shop-devin" role="tablist">
            <li data-wow-delay="0.14s">
              <router-link :to="{path: '/accounting/ledger/general-ledger'}">
                {{ $lang[langId].general_ledger }}
              </router-link>
            </li>
            <li data-wow-delay="0.12s">
              <router-link :to="{path: '/accounting/ledger/ledger'}">
                {{ $lang[langId].ledger }}
              </router-link>
            </li>
          </ul>
        </div>
        <div class="tab-content">
          <router-view></router-view>
        </div>
      </section>

		<dialog-setup :show="dialogSetup" @doneSetup="finishSetup"/>

    </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import Loading from 'vue-loading-overlay';
import mixinAccounting from '@/mixins/mixinAccounting';
import dialogSetup from 'components/modules/_views/accounting/dialogSetup';

export default {
  name: 'AuditAccounting',
  components: {
    Loading,
		dialogSetup
  },

  mixins: [mixinAccounting],

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
  },

  mounted(){
  },

  methods: {
  }
}
</script>
