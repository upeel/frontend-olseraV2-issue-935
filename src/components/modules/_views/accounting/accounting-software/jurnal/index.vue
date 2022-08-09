<template>
  <div class="content-wrapper">
    <section class="content-accounting" style="padding: 130px 0 30px;">
      <div class="panel tab-list">
        <ul class="nav-tabs-shop-devin hover-horizontal-scroll" role="tablist">
          <li data-wow-delay="0.10s">
            <router-link :to="{path: '/accounting-third/jurnalNew/purchase', query: {typeJurnal: this.$route.query.typeJurnal}}">
              {{ lang.purchase }}
            </router-link>
          </li>
          <li data-wow-delay="0.20s" v-show="$route.query.typeJurnal === '1'">
            <router-link :to="{path: '/accounting-third/jurnalNew/stock-incoming', query: {typeJurnal: this.$route.query.typeJurnal}}">
              {{ $lang[langId].stock_incoming }}
            </router-link>
          </li>
          <li data-wow-delay="0.6s">
            <router-link :to="{path: '/accounting-third/jurnalNew/sales', query: {typeJurnal: this.$route.query.typeJurnal} }">
              {{ lang.sales }}
            </router-link>
          </li>
          <li data-wow-delay="0.7s">
            <router-link :to="{path: '/accounting-third/jurnalNew/sales-return', query: {typeJurnal: this.$route.query.typeJurnal}}">
              {{ $lang[langId].salesreturn2 }}
            </router-link>
          </li>
          <li data-wow-delay="0.8s">
            <router-link :to="{path: '/accounting-third/jurnalNew/revenue', query: {typeJurnal: this.$route.query.typeJurnal}}">
              {{ $lang[langId].revenue }}
            </router-link>
          </li>
          <li data-wow-delay="0.9s">
            <router-link :to="{path: '/accounting-third/jurnalNew/expense', query: {typeJurnal: this.$route.query.typeJurnal}}">
              {{ $lang[langId].outlay }}
            </router-link>
          </li>
          <li data-wow-delay="1.0s" v-show="$route.query.typeJurnal === '1'">
            <router-link :to="{path: '/accounting-third/jurnalNew/transfer-warehouse', query: {typeJurnal: this.$route.query.typeJurnal}}">
              {{ $lang[langId].warehouse_transfer }}
            </router-link>
          </li>
          <li data-wow-delay="1.1s" v-show="$route.query.typeJurnal === '1'">
            <router-link :to="{path: '/accounting-third/jurnalNew/stock-opname', query: {typeJurnal: this.$route.query.typeJurnal}}">
              {{ $lang[langId].stock_opname }}
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

import mixinAccounting from '@/mixins/mixinAccounting';
import Loading from 'vue-loading-overlay';


export default {
  name: 'jurnalPage',
  components:{
    Loading,
  },
  mixins: [mixinAccounting],

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
    jurnalType() {
      return this.$store.state.accountingIntegration
    },
    
  },

  data(){
    return{

    }
  },

  mounted(){

  },

  watch:{

  },

  methods:{
     
  }
}
</script>

<style>
	.horizontal-scroll-wrapper{
		position:absolute;
		display:block;
		top:0;
		left:0;
		width:80px;
		max-height:500px;
		margin:0;
		background:#abc;
		overflow-y:auto;
		overflow-x:hidden;
		transform:rotate(-90deg) translateY(-80px);
		transform-origin:right top;
	}
	.horizontal-scroll-wrapper > div{
		display:block;
		padding:5px;
		background:#cab;
		transform:rotate(90deg);
		transform-origin: right top;
	}


	.rectangles{
		top:100px;
		padding:100px 0 0 0;
	}
	.rectangles > div{
		width:140px;
		height:60px;
		margin:50px 10px;
		padding:5px;
		background:#cab;
		transform:rotate(90deg) translateY(80px);
		transform-origin: right top;
	}
</style>
