<template>
    <div class="content-wrapper">
      <section class="content-accounting" :class="classBasedOnSetup" style="padding: 120px 0 30px;">
        <div v-if="isSetup === 'false'">
            <el-card class="box-card" shadow="never">
              <div class="div-nodata-accounting">
                <img src="../../../../../../static/img/no-close-date.svg" class="image" style="margin-top: 32px">
                <div class="no_close" >{{$lang[langId].setup_message}}</div>
                <el-button class="btn-set" @click="dialogSetup = true">{{$lang[langId].set_up_now}}</el-button>
              </div>
            </el-card>
        </div>

        <div v-else-if="isSetup === 'true'">

          <div class="panel tab-list">
            <ul class="nav-tabs-shop-devin" role="tablist">
              <li data-wow-delay="0.14s">
                <router-link :to="{path: '/accounting/report/income'}">
                  {{ $lang[langId].income_statement }}
                </router-link>
              </li>
              <li data-wow-delay="0.10s">
                <router-link :to="{path: '/accounting/report/balance-sheet'}">
                  {{ $lang[langId].balance_sheet }}
                </router-link>
              </li>
              <li data-wow-delay="0.10s">
                <router-link :to="{path: '/accounting/report/capital'}">
                  {{ $lang[langId].capital_statement }}
                </router-link>
              </li>
<!--              <li data-wow-delay="0.6s">-->
<!--                <router-link :to="{path: '/accounting/report/report_form_balance_sheet'}">-->
<!--                  {{ $lang[langId].report_form_balance_sheet }}-->
<!--                </router-link>-->
<!--              </li>-->
              <li data-wow-delay="0.6s">
                <router-link :to="{path: '/accounting/report/cash-flow'}">
                  {{ $lang[langId].cash_flow_statement }}
                </router-link>
              </li>
            </ul>
          </div>
            <div class="tab-content">
              <router-view></router-view>
            </div>
        </div>

        <div v-else>
          <el-card class="box-card" shadow="never">
            <loading
              align="center"
              :active="true"
              color= '#1bb4e6'
              loader="bars"
              :width="64"
              :height="64"
              backgroundColor='#ffffff'>
            </loading>
          </el-card>
        </div>
      </section>

		<dialog-setup :show="dialogSetup" @doneSetup="finishSetup"/>

    </div>
</template>

<script>
import { baseApi } from 'src/http-common';
import axios from 'axios';
import Loading from 'vue-loading-overlay';
import mixinAccounting from '@/mixins/mixinAccounting';
import dialogSetup from 'components/modules/_views/accounting/dialogSetup';

export default {
  name: 'ReportAccounting',
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
    classBasedOnSetup() {
      let className
      if (this.isSetup === 'true') {
        className = ''
      } else if (this.isSetup === 'false') {
        className = 'no-subpage'
      } else {
        className = 'no-subpage'
      }
      return className
    },
  },

  mounted(){
    this.accountSetup()
  },

  methods: {
  
  }
}
</script>
