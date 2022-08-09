<template>
  <div class="px-20">
    <transition  name="slide-right">
      <div v-show="showSetting" class="dialog-setting-jurnal">
        <div class="header-dialog h-56">
          <span class="color-1">{{$lang[langId].jurnal_settings}}</span>
          <el-button
            type="info"
            round
            class="button-close-dialog color-1"
            @click="handleCommandSetting">
            <svg-icon icon-class="x" />
          </el-button>
        </div>

        <el-row :gutter="20" style="margin-bottom: 20px; line-height: 2;">
          <el-col :span="24">
            <div class="biodata mb-8">
              <el-checkbox v-model="uploadLabelStore">{{$lang[langId].upload_label_store_to_jurnal}}</el-checkbox><br>
              <p class="font-12" v-html="$lang[langId].upload_url_activate_message"></p>
            </div>
						<el-divider></el-divider>
            <div class="biodata mb-8">
              <el-checkbox v-model="nameTag">{{$lang[langId].store_name_tag}}</el-checkbox><br>
              <p class="font-12" v-html="$lang[langId].store_name_tag_message"></p>
            </div>
          </el-col>
        </el-row>

        <div class="footer-dialog">
          <el-button type="primary" :disabled="loadingSetting" @click="setSetting">
            <span v-if="loadingSetting">
              <loading 
                align="center"
                :active="true"
                color= '#1bb4e6'
                loader="dots"
                :width="28"
                :height="10"
                backgroundColor='#ffffff'>
              </loading>
            </span>
            <span v-else>{{ $lang[langId].apply }}</span>
          </el-button>
        </div>
      </div>
    </transition>

    <return-to-account v-if="jurnalType === '0'" @settingJurnal="handleCommandSetting"/>
      
    <return-to-invoice v-if="jurnalType === '1'" @settingJurnal="handleCommandSetting"/>

  </div>
</template>

<script>
import axios from 'axios';
import { baseApi } from 'src/http-common';
import ReturnToAccount from './returnToAccount.vue';
import ReturnToInvoice from './returnToInvoice.vue';

export default {
  name: 'ReturnToJurnal',
  components: {
    ReturnToAccount,
    ReturnToInvoice
  },
  computed: {
    lang() {
      return this.$store.state.userStores.lang
    },
    token() {
      return this.$store.state.user.token
    },
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    langId() {
      return this.$store.state.userStores.langId
    },
  },
  data(){
    return{
      showSetting: false,
      loadingSetting: false,
      autoInject: false,
      uploadLabelStore: false,
			nameTag: false,
      jurnalType: this.$route.query.typeJurnal
    }
  },

  watch:{
  },

  mounted(){
    this.getAutoInject()
  },

  methods:{
    getAutoInject(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/inject'),
        headers:headers,
      }).then(response => {
        this.autoInject = response.data.injectStatus
      }).catch(error => {
        if(typeof error.response.data.error.error === 'object'){
          let errorKey = Object.keys(error.response.data.error.error)[0];
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error[errorKey][0]
          })
        } else {
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
        this.isLoading = false
      })
    },

    handleCommandSetting(){
      let show = this.showSetting
      if(show === false){
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/setting'),
          headers:headers,
        }).then(response => {
          this.autoInject = response.data.injectStatus === 1 ? true : false
          this.uploadLabelStore = response.data.urlInTransaction === 1 ? true : false
					this.nameTag = response.data.name_taq === 1 ? true : false
        }).catch(error => {
          if(typeof error.response.data.error.error === 'object'){
            let errorKey = Object.keys(error.response.data.error.error)[0];
            this.$notify({
              type: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error[errorKey][0]
            })
          } else {
            this.$notify({
              tipe: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error
            })
          }
        })
      }
      
      this.showSetting = show ? false : true
    },

    setSetting(){
      this.loadingSetting = true

      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let data = ''

      if(this.jurnalType === '1'){
        data = {
          url : this.uploadLabelStore ? 1 : 0,
          inject: this.autoInject ? 1 : 0,
					name_taq: this.nameTag ? 1 : 0
        }
      }else{
        data = {
          url : this.uploadLabelStore ? 1 : 0,
					name_taq: this.nameTag ? 1 : 0
        }
      }

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/setting'),
        headers:headers,
        data
      }).then(response => {
        this.loadingSetting = false
        this.showSetting = false
        this.$message({
          message: this.$lang[this.langId].success_apply,
          type: 'success'
        })
      }).catch(error => {
        if(typeof error.response.data.error.error === 'object'){
          let errorKey = Object.keys(error.response.data.error.error)[0];
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error[errorKey][0]
          })
        } else {
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
        this.loadingSetting = false
      })
    }
  }
}
</script>
