<template>
  <div>
    <el-dialog
      :visible.sync="show"
      :show-close="false"
      @close="handleClose"
      width="90%"
      center 
      custom-class="dialog-card">
        <transition  name="slide-right">
          <div v-show="showCopy" @keydown.esc="cardFormCopy" class="dialog-copy-from-other-store">
            <div class="header-dialog h-56">
              <span class="color-1">{{capitalEachWord($lang[langId].copy_from_another_store)}}</span>
              <el-button
                type="info"
                round
                class="button-close-dialog color-1"
                @click="cardFormCopy">
                <svg-icon icon-class="x" />
              </el-button>
            </div>

            <div v-if="loadingStore" style="margin-bottom: 20px; line-height: 2;">
              <loading 
                align="center"
                :active="true"
                color= '#1bb4e6'
                loader="spinner"
                :width="32"
                :height="32"
                backgroundColor='#ffffff'>
              </loading>
            </div>

            <el-row v-else v-for="(store, keyStore) in stores" :key="keyStore" 
              :class="chosenStore(store.id)"
              :gutter="20" style="margin-bottom: 20px; line-height: 2;">
              <el-col :span="22">
                <div class="grid-content pointer" align="left" @click="copyStore = store.id">{{store.name}}</div>
              </el-col>
              <el-col :span="2">
                <div class="grid-content">
                  <el-radio class="mb-0" v-model="copyStore" :label="store.id">{{''}}</el-radio>
                </div>
              </el-col>
            </el-row>

            <div class="footer-dialog">
              <el-button type="primary" :disabled="copyStore === ''" @click="copyFromStore">
                {{ $lang[langId].apply }}
              </el-button>
            </div>
          </div>
        </transition>
        <div slot="title" class="flex-container">
          <el-row :gutter="20"  style="width: 100%">
            <el-col :span="14">
              <h4 class="dialog-title" align="left"><strong>{{$lang[langId].set_account_name_product_tax_payment}}</strong></h4>
            </el-col>
            <el-col :span="10" align="right">
              <div class="btn_save_dialog">
                <el-button type="info" @click="handleClose">{{ lang.close }}</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
        <!-- <el-tag size="large" class="tag-jurnal-info2" v-if="activeTab === 'taxList' || activeTab === 'otherAccount'">
          <el-row :gutter="10">
            <el-col :md="1" :sm="1" :xs="24" align="center">
              <i class="el-icon-warning-outline"></i>
            </el-col>
            <el-col :md="23" :sm="23" :xs="24">
              <p v-if="activeTab === 'taxList'" class="word-break">{{$lang[langId].jurnal_tax_list_info}}</p>
              <p v-if="activeTab === 'otherAccount'" class="word-break">{{$lang[langId].jurnal_product_accoutn_info}}</p>
            </el-col>
          </el-row>
        </el-tag> -->

        <el-row :gutter="10" class="pb-12">
          <el-col :xl="18" :lg="19" :md="18" :sm="18" :xs="24" align="left">
            <el-button @click="selectAccountTab('transAccount')" :type="activeTab === 'transAccount' ? 'primary' : 'info'" round plain size="small">{{$lang[langId].account_transaction}}</el-button>
            <el-button @click="selectAccountTab('paymentMethod')" :type="activeTab === 'paymentMethod' ? 'primary' : 'info'" round plain size="small">{{lang.payment_methods}}</el-button>
            <el-button @click="selectAccountTab('taxList')" :type="activeTab === 'taxList' ? 'primary' : 'info'" round plain size="small">{{$lang[langId].tax_list}}</el-button>
            <el-button @click="selectAccountTab('productAccount')" :type="activeTab === 'productAccount' ? 'primary' : 'info'" round plain size="small">{{$lang[langId].other_product}}</el-button>
            <el-button @click="selectAccountTab('branch')" :type="activeTab === 'branch' ? 'primary' : 'info'" round plain size="small">{{$lang[langId].branch}}</el-button>
						 <el-button @click="selectAccountTab('warehouse')" :type="activeTab === 'warehouse' ? 'primary' : 'info'" round plain size="small">{{$lang[langId].warehouse}}</el-button>
					</el-col>
          <el-col :xl="6" :lg="5" :md="23" :sm="23" :xs="24" align="right">
            <el-button @click="cardFormCopy" type="info" plain size="small">{{$lang[langId].copy_from_another_store}}</el-button>
          </el-col>
        </el-row>

        <tax-list v-if="activeTab === 'taxList'" :load="loadData"/>
        <payment-method v-else-if="activeTab === 'paymentMethod'" :load="loadData"/>
        <product-account v-else-if="activeTab === 'productAccount'" :load="loadData"/>
        <branch v-else-if="activeTab === 'branch'" :load="loadData"/>
				<warehouse v-else-if="activeTab === 'warehouse'" :load="loadData"/>
        <trans-account v-else-if="activeTab === 'transAccount' && !isAdvance" :load="loadData" @changeAdvance="changeAdvance"/>
       	<product-advance v-else-if="activeTab === 'transAccount' && isAdvance" :load="loadData" @changeAdvance="changeAdvance"/>
    </el-dialog>
  </div>
</template>

<script>

import TaxList from './mapping/taxList.vue';
import PaymentMethod from './mapping/paymentMethod.vue';
import ProductAccount from './mapping/productAccount.vue';
import ProductAdvance from './mapping/productAdvance.vue';
import TransAccount from './mapping/transAccount.vue';
import Branch from './mapping/selectBranch';
import Warehouse from './mapping/mapWarehouse';
import mixinAccounting from '@/mixins/mixinAccounting';
import { baseApi } from 'src/http-common'
import axios from 'axios'
import Loading from 'vue-loading-overlay';

export default {
  props: ['show'],
  name: "DialogJurnalAccountProductTax",
  mixins: [mixinAccounting],

  components: {
    TaxList,
    PaymentMethod,
    ProductAccount,
		ProductAdvance,
    TransAccount,
    Branch,
		Warehouse,
    Loading
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
    }
  },

  data() {
    return {
      activeTab: 'taxList',
			isAdvance: false,
      loadingStore: false,
      showCopy: false,
      stores: [],
      loadData: 0,
      copyStore: '',
    }
  },

  methods:{
    selectAccountTab(val){
      this.activeTab = val
    },

    cardFormCopy(){
      this.loadingStore = true
      let show = this.showCopy
      if(!show){
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token,
        }

        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/store'),
          headers: headers,
        }).then(response => {
          this.stores = response.data.data
        }).catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        })
      }
      this.showCopy = show ? false : true
      this.loadingStore = false
    },

    copyFromStore(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token,
      }

      let data = {
        id: this.copyStore
      }

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/store'),
        headers: headers,
        params: data
      }).then(response => {
        this.stores.forEach((item, idxStore) => {
          if(item.id === this.copyStore){
            this.stores.splice(idxStore, 1)
          }
        });
        this.loadData += 1;
        this.showCopy = false
        this.$message({
          type: 'success',
          message: this.$lang[this.langId].success_apply
        })
        this.copyStore = ''
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    handleClose(){
      // this.show = false;
      this.$emit('close')
    },

    chosenStore(id) {
      let className;
      if(this.copyStore === id){
        className = 'exportSelected'
      }
      return className;
    },

    changeAdvance(){
      this.isAdvance = this.isAdvance ? false : true
    },
  }
}
</script>
