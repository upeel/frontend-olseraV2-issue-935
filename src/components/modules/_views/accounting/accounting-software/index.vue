<template>
  <div class="content-wrapper">
    <section class="test content">
      <div class="container-768">
        <div class="closable-banner accounting-software-header">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="14" :md="14" :lg="14" :xl="14">
              <p v-html="$lang[langId].accounting_3rdparty_header"></p>
            </el-col>
            <el-col :xs="24" :sm="10" :md="10" :lg="10" :xl="10">
              <img class="acc-link-image" src="../../../../../../static/img/accounting-third/group-icon.svg">
            </el-col>
          </el-row>
        </div>
        <h4>{{$lang[langId].choose_accounting}}</h4>
        <template v-for="(item, idx) in listSoftware" >
          <el-card v-if="item.release" :key="item.id" class="card-software-acc" shadow="never" >
            <el-row :gutter="20">
              <el-col :span="22">
                <div v-if="item.isLoading" style="cursor: pointer;">
                  <img :alt="item.alt_image" :src="item.image">
                  {{item.name}}
                </div>
                <div v-else @click="getIn(item.name, idx)" style="cursor: pointer;">
                  <img :alt="item.alt_image" :src="item.image">
                  {{item.name}}
                </div>
              </el-col>
              <el-col v-if="item.isLoading" :span="2" style="text-align: center; font-size: x-large;">
                <loading
                  align="center"
                  :active="true"
                  color= '#1bb4e6'
                  loader="spinner"
                  :width="32"
                  :height="32"
                  backgroundColor='#ffffff'>
                </loading>
              </el-col>
              <el-col v-else :span="2" style="text-align: center; font-size: x-large;">
                <el-button v-if="item.isIntegrate" class="btn-unlink" type="danger" @click="handleDialogUnlink(item.name)">
                  <svg-icon icon-class="unlink"></svg-icon>
                </el-button>
                <div v-else>
                  <i class="el-icon-arrow-up" @click="collapseGuide(item.name, false)" v-if="item.showCollapse"></i>
                  <i class="el-icon-arrow-down" @click="collapseGuide(item.name, true)" v-else></i>
                </div>
              </el-col>
            </el-row>
            <div class="content-software" v-if="item.showCollapse">
              <el-divider></el-divider>
              <div v-if="item.name === 'Jurnal.ID'">
                <p v-html="$lang[langId].jurnal_guide_title"></p>
                <ol>
                  <li><p v-html="$lang[langId].jurnal_integration_guide1"></p></li>
                  <li><p v-html="$lang[langId].jurnal_integration_guide2"></p></li>
                  <li><p v-html="lang.jurnal_guide"></p>
                    <img src="../../../../../../static/img/accounting-third/jurnal_request_permission.png"></li>
                  <li><p v-html="$lang[langId].jurnal_integration_guide3"></p></li>
                </ol>
              </div>
              <div v-if="item.name === 'Accurate'">
                <div v-show="item.isIntegrate">
                  <el-row v-for="database in item.dataDb" :key="database.id" :gutter="20" class="py-8 lh-2">
                    <el-col :span="20">
                        <svg-icon icon-class="database" class="font-24 mr-8"></svg-icon>
                        {{database.alias}}
                        <span v-if="database.accessibleUntil !== '' || database.accessibleUntil !== null">
                          ({{$lang[langId].accessible_until + ' ' + dateFormat(database.accessibleUntil)}})
                        </span>
                    </el-col>
                    <el-col v-if="item.isLoading" :span="4" style="text-align: center; font-size: x-large;">
                      <loading
                        align="center"
                        :active="true"
                        color= '#1bb4e6'
                        loader="spinner"
                        :width="32"
                        :height="32"
                        backgroundColor='#ffffff'>
                      </loading>
                    </el-col>
                    <el-col v-else :span="4" align="right">
                      <el-button size="mini" :disabled="loadingAccurateGetIn" type="primary" @click="selectAccurateDb(database)">
                        <loading
                          v-if="loadingAccurateGetIn"
                          align="center"
                          :active="true"
                          color= '#1bb4e6'
                          loader="dots"
                          :width="28"
                          :height="10"
                          backgroundColor='#ffffff'>
                        </loading>
                        <span v-else>{{$lang[langId].select}} Database</span>
                      </el-button>
                    </el-col>
                  </el-row>
                </div>
                <div v-show="!item.isIntegrate">
                  <p v-html="$lang[langId].accurate_guide_title"></p>
                  <ol>
                    <li><p v-html="$lang[langId].accurate_integration_guide1"></p></li>
                    <li><p v-html="$lang[langId].accurate_integration_guide2"></p></li>
                    <li><p v-html="$lang[langId].accurate_integration_guide3"></p>
                      <img src="/static/img/accounting-third/accurate_request_permission.png"></li>
                    <li><p v-html="$lang[langId].accurate_integration_guide4"></p></li>
                  </ol>
                </div>
              </div>
            </div>
          </el-card>
        </template>
      </div>
    </section>

    <el-dialog
      :visible.sync="jurnalDialog"
      width="35%"
      custom-class="jurnal-dialog">
      <div>
        <div style="width: 100%; padding: 0 2%; text-align: center;">
          <img src="../../../../../../static/img/accounting-third/jurnal-integrate.png">
          <div class="information-content">
            <p v-html="$lang[langId].jurnal_integration_message" align="justify"></p>
          </div>
          <div class="lh-3 box-shadow-2 bd-grey-thin mb-16 radius-5" :class="classExportInvoice" @click="exportType = '1'">
            <el-row :gutter="20" class="mx-null" style="line-height: 2" >
              <el-col :span="22">
                <div class="font-bold font-16" align="left">{{$lang[langId].post_as_sales_invoice}}</div>
              </el-col>
              <el-col :span="2">
                <el-radio class="mb-0" v-model="exportType" label="1">{{''}}</el-radio>
              </el-col>
            </el-row>

            <el-row :gutter="20" class="mx-null" style="line-height: 2" v-for="(itemKhusus, keyKhusus) in jurnalKhususInfo" :key="keyKhusus">
              <el-col :span="2">
                <svg-icon icon-class="status_icon"></svg-icon>
              </el-col>
              <el-col :span="22" align="left">
                <p class="font-12 word-break" v-html="itemKhusus.text"></p>
              </el-col>
            </el-row>
          </div>

          <div class="lh-3 box-shadow-2 bd-grey-thin mb-16 radius-5" :class="classExportGeneral" @click="exportType = '0'">
            <el-row :gutter="20" class="mx-null" style="line-height: 2" >
              <el-col :span="22">
                <div class="font-bold font-16" align="left">{{$lang[langId].post_as_general_jurnal}}</div>
              </el-col>
              <el-col :span="2">
                <el-radio class="mb-0" v-model="exportType" label="0">{{''}}</el-radio>
              </el-col>
            </el-row>

            <el-row :gutter="20" class="mx-null" style="line-height: 2" v-for="(itemGeneral, keyGeneral) in jurnalGeneralInfo" :key="keyGeneral">
              <el-col :span="2">
                <svg-icon icon-class="status_icon"></svg-icon>
              </el-col>
              <el-col :span="22" align="left">
                <p class="font-12 word-break" v-html="itemGeneral.text"></p>
              </el-col>
            </el-row>
          </div>
          <!-- <div>
            <el-row :gutter="20" style="margin-bottom: 20px; line-height: 2" :class="classExportInvoice">
              <el-col :span="22">
                <div class="grid-content" align="left" @click="exportType = '1'">{{$lang[langId].post_as_sales_invoice}}</div>
              </el-col>
              <el-col :span="2">
                <div class="grid-content"><el-radio class="mb-0" v-model="exportType" label="1">{{''}}</el-radio></div>
              </el-col>
            </el-row>
            <el-row :gutter="20" style="margin-bottom: 20px; line-height: 2;" :class="classExportGeneral">
              <el-col :span="22">
                <div class="grid-content" align="left" @click="exportType = '0'">{{$lang[langId].post_as_general_jurnal}}</div>
              </el-col>
              <el-col :span="2">
                <div class="grid-content"><el-radio class="mb-0" v-model="exportType" label="0">{{''}}</el-radio></div>
              </el-col>
            </el-row>
            <el-tag size="large" class="tag-jurnal-info2 mb-8">
              <el-row :gutter="10">
                <el-col :md="2" :sm="2" :xs="24" align="center">
                  <i class="el-icon-warning-outline"></i>
                </el-col>
                <el-col :md="22" :sm="22" :xs="24">
                  <p v-if="exportType === '1'" class="word-break text-left">{{$lang[langId].jurnal_as_invoice}}</p>
                  <p v-else class="word-break text-left">{{$lang[langId].jurnal_as_general}}</p>
                </el-col>
              </el-row>
            </el-tag>
          </div> -->

          <el-button type="primary" :disabled="exportType === ''" @click="showJurnalInfo" style="width: 100%;">{{$lang[langId].connect_to_jurnal}}</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="unlinkJurnalDialog"
      width="40%"
      custom-class="unlink-jurnal-dialog">
      <div>
        <div style="width: 100%; padding: 0 5% 0 5%; text-align: center;">
          <div style="position: relative; display: inline-block;">
            <svg-icon icon-class="x"></svg-icon>
            <img src="../../../../../../static/img/accounting-third/jurnal-integrate.png">
          </div>
          <div class="information-content">
            <p v-html="$lang[langId].jurnal_remove_integration_title"></p>
          </div>
          <el-button type="danger" :disabled="loadingUnlink" @click="unlinkJurnal">
            <loading
              v-if="loadingUnlink" 
              align="center"
              :active="true"
              color= '#1bb4e6'
              loader="dots"
              :width="28"
              :height="10"
              backgroundColor='#ffffff'>
            </loading>
            <span v-else>
              {{$lang[langId].remove_integration}}
            </span>
          </el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="unlinkAccurateDialog"
      width="40%"
      custom-class="unlink-jurnal-dialog">
      <div>
        <div style="width: 100%; padding: 0 5% 0 5%; text-align: center;">
          <div style="position: relative; display: inline-block;">
            <svg-icon icon-class="x"></svg-icon>
            <img src="../../../../../../static/img/accounting-third/accurate-integrate.png">
          </div>
          <div class="information-content">
            <p v-html="$lang[langId].accurate_remove_integration_title"></p>
          </div>
          <el-button type="danger" :disabled="loadingUnlink" @click="unlinkAccurate">
            <loading
              v-if="loadingUnlink" 
              align="center"
              :active="true"
              color= '#1bb4e6'
              loader="dots"
              :width="28"
              :height="10"
              backgroundColor='#ffffff'>
            </loading>
            <span v-else>
              {{$lang[langId].remove_integration}}
            </span>
          </el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="accurateDialog"
      width="35%"
      custom-class="jurnal-dialog">
      <div>
        <div style="width: 100%; padding: 0 5% 0 5%; text-align: center;">
          <img src="../../../../../../static/img/accounting-third/accurate-integrate.png">
          <div class="information-content">
            <p v-html="$lang[langId].accurate_integration_message" align="justify"></p>
          </div>

          <el-button type="primary" @click="exAccurateToken" style="width: 100%;">{{$lang[langId].connect_to_accurate}}</el-button>
        </div>
      </div>
    </el-dialog>

    <dialog-info-jurnal
      :show="jurnalInfoDialog"
      @okClick="exJurnalToken"
    />

  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import Loading from 'vue-loading-overlay';
import basicComputedMixin from '@/mixins/basicComputedMixin';
import DialogInfoJurnal from './jurnal/DialogInfoJurnal';
var moment = require('moment')

export default {
  name: 'AccountingSoftware',
  components: {
    DialogInfoJurnal,
    Loading
  },

  mixins: [basicComputedMixin],

  computed:{
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
    
    classExportGeneral() {
      let className;
      if(this.exportType === '0'){
        className = 'exportSelected'
      }
      return className;
    },

    classExportInvoice() {
      let className;
      if(this.exportType === '1'){
        className = 'exportSelected'
      }
      return className;
    },
    accessByEmail () {
      return ['akmal@olsera.com']
    },

    loggedInUser () {
      return this.$store.getters.loggedInUser
    },

    listSoftware () {
      let list = [ ...this.lists]
      list.map(i => {
				i.release = false
        if (this.accessByEmail.includes(this.loggedInUser.email) || i.id === 3) {
        	i.release = true
        }
      })
      return list
    }
  },

  mounted(){
    this.getJurnalStatus()
    this.getAccurateStatus()
    this.getAccurateDb()
  },

	data(){
		return{
      loadingUnlink: false,
      loadingAccurateGetIn: false,
			jurnalDialog: false,
      jurnalInfoDialog: false,
      accurateDialog: false,
      unlinkJurnalDialog: false,
      unlinkAccurateDialog: false,
      jurnalKhususInfo: [
        {text: this.$lang[this.$store.state.userStores.langId].jurnalKhususInfo1},
        {text: this.$lang[this.$store.state.userStores.langId].jurnalKhususInfo2}],
      jurnalGeneralInfo: [
        {text: this.$lang[this.$store.state.userStores.langId].jurnalGeneralInfo1},
        {text: this.$lang[this.$store.state.userStores.langId].jurnalGeneralInfo2}],
      lists:[
        {
          id: 1,
          image: '../../../../../../static/img/accounting-third/zahir-icon.png',
          image_alt: 'zahir-icon',
          name: 'Zahir',
          isLoading: false,
          isIntegrate: false,
          showCollapse: false
        },
        {
          id: 2,
          image: '../../../../../../static/img/accounting-third/accurate-icon.png',
          image_alt: 'accurate-icon',
          name: 'Accurate',
          isLoading: false,
          isIntegrate: false,
          showCollapse: false,
          selectedDb: null,
          dataDb: null
        },
        {
          id: 3,
          image: '../../../../../../static/img/accounting-third/jurnal-icon.png',
          image_alt: 'jurnal-icon',
          name: 'Jurnal.ID',
          isLoading: false,
          isIntegrate: false,
          showCollapse: false
        }
      ],
      exportType:"1",
		}
	},
  methods:{
    collapseGuide(software, val){
      this.lists.forEach((item, idx) => {
        if(item.name === software){
          this.lists[idx].showCollapse = val
        }
      });
    },

    getIn(software, index){
      if(software === 'Jurnal.ID'){
        if(this.lists[index].isIntegrate){
          localStorage.setItem('olsbo_integration_id_current_store', this.selectedStore.store_id)
          this.$router.push({path: '/accounting-third/jurnalNew', query: {typeJurnal: this.$store.state.accountingIntegration.jurnal} })
        }else{
          this.jurnalDialog = true
        }
      }else if(software === 'Accurate'){
        if(this.lists[index].isIntegrate){
          if(this.lists[index].dataDb !== null){
            if(this.lists[index].dataDb.length === 1){
              this.selectAccurateDb(this.lists[index].dataDb[0])
            }else{
              this.lists[index].showCollapse = true
            }
          }else{
            if(this.lists[index].showCollapse === false){
              this.getAccurateDb()
              this.lists[index].showCollapse = true
            }else{
              this.lists[index].showCollapse = false
            }
          }
        }else{
          this.accurateDialog = true
        }
      }
    },

    handleDialogUnlink(software){
      if(software === 'Jurnal.ID'){
        this.unlinkJurnalDialog = true
      }else if(software === 'Accurate'){
        this.unlinkAccurateDialog = true
      }
    },

    getJurnalStatus(){
      this.lists[2].isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token,
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/token'),
        headers: headers,
      }).then(response => {
        this.lists[2].isLoading = false
        this.lists.forEach((item, idx) => {
          if(item.name === 'Jurnal.ID'){
            this.lists[idx].isIntegrate = response.data.jurnal_token_status === 'true' ? true : false
            const data = {
              value : String(response.data.account_transaction),
              thirdParty: 'jurnal',
              toStorage : false
            }
            this.$store.commit('SET_INTEGRATION_TYPE', data)
          }
        });
      }).catch(error => {
        this.lists[2].isLoading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    getAccurateStatus(){
      this.lists[1].isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token,
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/connection'),
        headers: headers,
      }).then(response => {
        this.lists[1].isLoading = false

        if(response.data.expired === 'true'){
          this.refreshTokenAccurate()
        }

        this.lists.forEach((item, idx) => {
          if(item.name === 'Accurate'){
            this.lists[idx].isIntegrate = response.data.token === 'true' ? true : false
            const data = {
              value : response.data.post_as_transaction,
              thirdParty: 'accurate',
              toStorage : false
            }
            this.$store.commit('SET_INTEGRATION_TYPE', data)
          }
        });

      }).catch(error => {
        this.lists[2].isLoading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    showJurnalInfo(){
      let show = this.jurnalInfoDialog
      this.jurnalInfoDialog = show ? false : true
    },

    exJurnalToken(){
      if(this.exportType !== ''){
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }

        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/newtoken'),
          headers: headers
        }).then(response => {
          // console.log('url', response.data.data)
          const data = {
            value : this.exportType,
            thirdParty: 'jurnal',
            toStorage : true
          }

          this.$store.commit('SET_INTEGRATION_TYPE', data)
					// let dataUrl = "https:\/\/my.jurnal.id\/authorize_apps\/new?client_id=2a8dd9e9f8f849ab9e70fed41f7582ae"
          window.location.href = response.data.data;
        }).catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        })
      }
    },

    unlinkJurnal(){
      this.loadingUnlink = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/token'),
        headers: headers
      }).then(response => {
        this.loadingUnlink = false
        this.unlinkJurnalDialog = false
        this.getJurnalStatus()
        this.$message({
          type: 'success',
          message: response.data.data.messages
        })
      }).catch(error => {
        this.loadingUnlink = false
      })
    },

    exAccurateToken(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let params = {
        redirect_uri: window.location.origin + "/accounting-third/accurate/saveToken"
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/geturl'),
        headers: headers,
        params
      }).then(response => {

        const data = {
          value : 1,
          thirdParty: 'accurate',
          toStorage : true
        }

        this.$store.commit('SET_INTEGRATION_TYPE', data)
        window.location.href = response.data.data;
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    unlinkAccurate(){
      this.loadingUnlink = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/connection'),
        headers: headers
      }).then(response => {
        this.loadingUnlink = true
        this.unlinkAccurateDialog = false
        this.getAccurateStatus()
        this.$message({
          type: 'success',
          message: response.data.data.message
        })
      }).catch(error => {
        this.loadingUnlink = false
      })
    },

    refreshTokenAccurate(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token,
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/refreshtoken'),
        headers: headers,
      }).then(response => {

      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    getAccurateDb(){
      let keyAccurate = this.lists.findIndex(x => x.name ==="Accurate");

      let headers = {
        Authorization: 'Bearer ' + this.token.access_token,
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/dblist'),
        headers: headers,
      }).then(response => {
        this.lists[keyAccurate].dataDb = response.data.data
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    selectAccurateDb(val){
      this.loadingAccurateGetIn = true
      let keyAccurate = this.lists.findIndex(x => x.name ==="Accurate");

      let headers = {
        Authorization: 'Bearer ' + this.token.access_token,
      }

      let params = {
        id: val.id,
        alias: val.alias
      }

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/db'),
        headers: headers,
        params
      }).then(response => {
        this.loadingAccurateGetIn = false
        this.lists[keyAccurate].selectedDb = response.data.accurate_db_id
        localStorage.setItem('olsbo_integration_id_current_store', this.selectedStore.store_id)
        this.$router.push({path: '/accounting-third/accurate'})
      }).catch(error => {
        this.loadingAccurateGetIn = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    dateFormat(val){
      var dateParts = val.split("/");
      var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
      return moment(dateObject.toString()).format('DD MMM YYYY');
    },
  }
}
</script>
