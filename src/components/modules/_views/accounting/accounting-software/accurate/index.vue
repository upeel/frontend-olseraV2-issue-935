<template>
  <div class="content-wrapper">
    <section class="content sales-list">
      <div class="panel tab-list">
        <ul class="nav-tabs-shop-devin" role="tablist">
          <li>
            <router-link :to="{path: '/accounting-third/accurate/sales'}">
              {{ lang.sales }}
            </router-link>
          </li>
          <li>
            <router-link :to="{path: '/accounting-third/accurate/purchase'}">
              {{ lang.purchase }}
            </router-link>
          </li>
          <li>
            <router-link :to="{ path: '/accounting-third/accurate/sales-return'}">
              {{ $lang[langId].salesreturn2 }}
            </router-link>
          </li>
          <li>
            <router-link :to="{ path: '/accounting-third/accurate/revenue'}">
              {{ $lang[langId].revenue }}
            </router-link>
          </li>
          <li>
            <router-link :to="{ path: '/accounting-third/accurate/expense' }">
              {{ $lang[langId].outlay }}
            </router-link>
          </li>
          <li>
            <router-link :to="{ path: '/accounting-third/accurate/transfer-warehouse'}">
              {{ $lang[langId].warehouse_transfer }}
            </router-link>
          </li>
          <li>
            <router-link :to="{ path: '/accounting-third/accurate/stock-opname' }">
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
import axios from 'axios';
import { baseApi } from 'src/http-common';
import Penjualan from './penjualan';
import Pembelian from './pembelian';
import Pengembalian from './pengembalian';
import Pendapatan from './pendapatan';
import Pengeluaran from './pengeluaran';
import mixinAccounting from '@/mixins/mixinAccounting';
import Loading from 'vue-loading-overlay';
import moment from 'moment'

export default {
  name: 'accuratePage',
  components:{
    Penjualan,
    Pembelian,
    Pengembalian,
    Pendapatan,
    Pengeluaran,
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
  },

  data(){
    return{
      isEditing: true,
      dialogAccountName: false,
      dialogAccountProduct: false,
      dialogMapSupplier: false,
      dialogMapCustomer: false,
      dialogMapTrans: false,
      showSetting: false,
      loadingSetting: false,
      accurateType: '',
      transType: '',
      menu: '',
      autoInject: false,
      uploadLabelStore: false,
      activeTab: Object.keys(this.$route.query).includes('tab') === true ? this.$route.query.tab : 'penjualan',
      activeAccountName: true,
      activeMapCustomer: false,
      activeMapSupplier: false,
      activeProductName: false,
      activeMapTrans: false,
      dataPostSupplier: [],
      dataPostCustomer: [],
      dataPostProduct: [],
      params: {},
      labelDate: ''
    }
  },

  mounted(){
    if(Object.keys(this.$store.state.accountingIntegration).includes('accurate') === false){
      this.getAccurateStatus()
    }else{
      this.menu = this.$store.state.accountingIntegration.accurate === 1 ? 'invoiceSales' : 'general'
      this.accurateType = this.$store.state.accountingIntegration.accurate === 1 ? 1: 0
    }
    this.getLastParams()
  },

  watch:{

  },

  methods:{
    getAccurateStatus(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token,
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/connection'),
        headers: headers,
      }).then(response => {
        if(response.data.token === 'false'){
          this.$router.push({path: '/accounting-third/accounting-software'})
        }else{
          const data = {
            value : response.data.post_as_transaction,
            thirdParty: 'accurate',
            toStorage : false
          }
          this.accurateType = data.value
          if(this.accurateType === 1){
              var inTab = Object.keys(this.$route.query).includes('tab') === true ? this.$route.query.tab : 'penjualan';

              switch(inTab) {
                case "pembelian":
                  this.menu = 'invoicePurchase'
                  break;
                case "penjualan":
                  this.menu = 'invoiceSales'
                  break;
                case "pengembalian":
                  this.menu = 'invoiceReturn'
                  break;
                case "pendapatan":
                  this.menu = 'income'
                  break;
                case "pengeluaran":
                  this.menu = 'outlay'
                  break;
                default:
                  this.menu = 'invoiceSales'
              }
          }else{
            this.menu = 'general'
          }
          this.$store.commit('SET_INTEGRATION_TYPE', data)
        }
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    getLastParams() {

    },

    handleCommandJurnal(command){
      if(command === 'accountName'){
        this.dialogAccountName = true
      }else if(command === 'productName'){
        this.dialogAccountProduct = true
      }else if(command === 'mapSupplier'){
        this.dialogMapSupplier = true
      }else if(command === 'mapCustomer'){
        this.dialogMapCustomer = true
      }else if(command === 'mapIncome'){
        this.transType = 'revennue'
        this.dialogMapTrans = true
      }else if(command === 'mapOutlay'){
        this.transType = 'outlay'
        this.dialogMapTrans = true
      }else{
        console.log('menu', command);
      }
    },

    selectTab(event){
      if(event.name === 'pembelian'){
        this.menu = this.accurateType === 1 ? 'invoicePurchase' : 'general'
        this.$router.push({
          path: '/accounting-third/accurate',
          query: {
            menu: this.menu,
            tab: this.activeTab
          }
        })
      }

      if(event.name === 'penjualan'){
        this.menu = this.accurateType === 1 ? 'invoiceSales' : 'general'
        this.$router.push({
          path: '/accounting-third/accurate',
          query: {
            menu: this.menu,
            tab: this.activeTab
          }
        })
      }

      if(event.name === 'pengembalian'){
        this.menu = this.accurateType === 1 ? 'invoiceReturn' : 'general'
        this.$router.push({
          path: '/accounting-third/accurate',
          query: {
            menu: this.menu,
            tab: this.activeTab
          }
        })
      }

      if(event.name === 'pendapatan'){
        this.menu = 'income'
        this.$router.push({
          path: '/accounting-third/accurate',
          query: {
            menu: this.menu,
            tab: this.activeTab
          }
        })
      }

      if(event.name === 'pengeluaran'){
        this.menu = 'outlay'
        this.$router.push({
          path: '/accounting-third/accurate',
          query: {
            menu: this.menu,
            tab: this.activeTab
          }
        })
      }
    },

    handleAccountName(params){
      this.activeAccountName = params
    },

    handleCloseAccountName() {
      this.dialogAccountName = false
    },

    closeMapTransaction(){
      this.dialogMapTrans = false
    },

  }
}
</script>
