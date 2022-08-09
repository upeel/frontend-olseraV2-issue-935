<template>
  <div>
    <el-dialog
      :visible.sync="show"
      :show-close="false"
      @close="handleCloseAccountName"
      width="60%"
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

            <el-row v-for="(store, keyStore) in stores" :key="keyStore" :gutter="20" style="margin-bottom: 20px; line-height: 2;">
              <el-col :span="22">
                <div class="grid-content" align="left">{{store.name}}</div>
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
              <h4 class="dialog-title" align="left"><strong>{{$lang[langId].set_account_name}}</strong></h4>
            </el-col>
            <el-col :span="10" align="right">
              <div class="btn_save_dialog">
                <el-button type="info" @click="handleCloseAccountName">{{ lang.close }}</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
        <el-tag size="large" class="tag-jurnal-info2">
          <el-row :gutter="10">
            <el-col :md="1" :sm="1" :xs="24" align="center">
              <i class="el-icon-warning-outline"></i>
            </el-col>
            <el-col :md="23" :sm="23" :xs="24">
              <p>{{$lang[langId].account_jurnal_info}}</p>
            </el-col>
          </el-row>
        </el-tag>

        <el-row :gutter="10" class="pb-12">
          <el-col :xl="18" :lg="18" :md="18" :sm="18" :xs="24" align="left">
            <el-button @click="secletAccountTab('jurnalAccount')" :type="activeTab === 'jurnalAccount' ? 'primary' : 'info'" round plain size="small">{{$lang[langId].account_jurnal}}</el-button>
            <el-button @click="secletAccountTab('paymentMethod')" :type="activeTab === 'paymentMethod' ? 'primary' : 'info'" round plain size="small">{{lang.payment_methods}}</el-button>
            <el-button @click="secletAccountTab('otherAccount')" :type="activeTab === 'otherAccount' ? 'primary' : 'info'" round plain size="small">{{$lang[langId].other_account}}</el-button>
          </el-col>
          <el-col :xl="6" :lg="6" :md="23" :sm="23" :xs="24" align="right">
            <el-button @click="cardFormCopy" type="info" plain size="small">{{$lang[langId].copy_from_another_store}}</el-button>
          </el-col>
        </el-row>
        <jurnal-account v-if="activeTab === 'jurnalAccount'" :load="loadData" @changePostStatus="updatePostStatus"/>
        <payment-method v-else-if="activeTab === 'paymentMethod'" :load="loadData" @changePostStatus="updatePostStatus"/>
        <other-account v-else-if="activeTab === 'otherAccount'" :load="loadData" @changePostStatus="updatePostStatus"/>
    </el-dialog>
          
  </div>
</template>

<script>
import JurnalAccount from 'components/modules/_views/accounting/accounting-software/jurnal/mapping/jurnalAccount.vue';
import PaymentMethod from 'components/modules/_views/accounting/accounting-software/jurnal/mapping/paymentMethod.vue';
import OtherAccount from 'components/modules/_views/accounting/accounting-software/jurnal/mapping/otherAccount.vue';
import mixinAccounting from '@/mixins/mixinAccounting';
import { baseApi } from 'src/http-common';
import axios from 'axios';
import Loading from 'vue-loading-overlay';

export default {
  props: ['show'],
  name: "DialogJurnalAccountName",
  mixins: [mixinAccounting],

  components: {
    JurnalAccount,
    PaymentMethod,
    OtherAccount,
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
      activeTab: 'jurnalAccount',
      loadingStore: false,
      modalShow: true,
      showCopy: false,
      stores: [],
      loadData: 0,
      copyStore: ''
    }
  },

  methods:{
    secletAccountTab(val){
      this.activeTab = val
    },

    updatePostStatus(val){
      // if(val === 1){s
        this.$emit('changePostStatus', val)
      // }
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
          url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/storelist'),
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
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/copymap'),
        headers: headers,
        params: data
      }).then(response => {
        this.stores.forEach((item, idxStore) => {
          if(item.id === this.copyStore){
            this.stores.splice(idxStore, 1)
          }
        });
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

    handleCloseAccountName(){
      this.modalShow = false;
      this.$emit('close')
    }
  }
}
</script>