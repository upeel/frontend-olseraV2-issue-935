<template>
    <el-row class="equal-cols">
      <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
        <div class="submission-left-side" :style="this.data.thirdPartyApplicant.ever_registered === 1 ? 'min-height: 650px;' : ''">
          <div class="font-24">{{$lang[langId].requirement_document}}</div>
          <ul class="list-unstyled" v-if="data.submit_as === 1">
            <li v-for="(list, key) in individualDoc" :key="key" class="pt-8 pb-8 px-24 font-14">
              <svg-icon :icon-class="list.logo"></svg-icon>
                <span class="ml-8">{{list.label}}</span>
                <span v-if="list.optional">({{$lang[langId].optional}})</span>
            </li>
          </ul>

          <ul class="list-unstyled" v-else>
            <li v-for="(list, key) in businessDoc" :key="key" class="pt-8 pb-8 px-24 font-14">
              <svg-icon :icon-class="list.logo"></svg-icon>
                <span class="ml-8">{{list.label}}</span>
                <span v-if="list.optional">({{$lang[langId].optional}})</span>
            </li>
          </ul>
          <hr>
          <div class="font-20">{{$lang[langId].digital_payment}}</div>
            <el-checkbox-group v-model="formData.selectedPayment" class="mt-8">
              
              <el-checkbox class="imageCheckbox color-white--bg w-fit ml-null" v-for="(list, keyPayment) in listPayment" :key="keyPayment" 
                :label="list.id" :disabled="data.paymentID.includes(list.id) === true ? true : false" border>
                <el-avatar
                  :src="'/static/img/' + list.logo"
                  class="mr-4"
                  style="width: 36px; height: 36px;"
                />
                <span class="nameBranch">{{list.name}}</span>
              </el-checkbox><br>
            </el-checkbox-group>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
      <!-- <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12"> -->
        <div class="submission-right-side">
          <div class="font-12 ">{{$lang[langId].select_branch_info}}</div>
          <el-checkbox-group v-model="formData.selectedBranchs" class="mt-10">
            <div class="mt-5 pointer" v-for="(item, key) in dataBranchs" :key="key">
              <el-checkbox class="imageCheckbox" :label="item.id" border style="width: 100%" @change="(value) => handleSelectBranch(value, item)">
                <el-avatar
                  :src="item.logo"
                  class="mr-4"
                  style="width: 36px; height: 36px;"
                />
                <span class="nameBranch">{{item.name}}</span>
              </el-checkbox>
            </div>
          </el-checkbox-group>
          <el-row class="pt-8">
            <hr class="mt-8">
            <span class="word-break">{{$lang[langId].is_register_digipayment}}?</span>
            <el-row class="pt-8 mt-10" :class="this.data.thirdPartyApplicant.ever_registered === 1 ? 'radio-checked' : ''">
              <el-col :span="22">
                <span class="font-bold">{{$lang[langId].ever_register}}</span>
              </el-col>
              <el-col :span="2">
                <div class="grid-content">
                  <el-radio v-model="this.data.thirdPartyApplicant.ever_registered" size="large" disabled :label="1">{{''}}</el-radio>
                </div>
              </el-col>
            </el-row>
          </el-row>
          <el-row class="pt-8" :class="this.data.thirdPartyApplicant.ever_registered === 0 ? 'radio-checked' : ''">
            <el-col :span="22">
              <span class="font-bold">{{$lang[langId].never_register}}</span>
            </el-col>
            <el-col :span="2">
              <div class="grid-content">
                <el-radio v-model="this.data.thirdPartyApplicant.ever_registered" size="large" disabled :label="0">{{''}}</el-radio>
              </div>
            </el-col>
          </el-row>
          <el-row class="pt-8" v-show="this.data.thirdPartyApplicant.ever_registered === 1">
            <hr class="mt-8">
            <div class="word-break mt-20 mb-20">{{$lang[langId].re_sunmit_digipayment}}?</div>
            <el-row class="pt-8" :class="this.data.thirdPartyApplicant.re_registration === 1 ? 'radio-checked' : ''">
              <el-col :span="22">
                <span class="font-bold ml-8">{{$lang[langId].yes}}</span>
              </el-col>
              <el-col :span="2">
                <div class="grid-content">
                  <el-radio v-model="this.data.thirdPartyApplicant.re_registration" size="large" :label="1">{{''}}</el-radio>
                </div>
              </el-col>
            </el-row>
            <el-row class="pt-8" :class="this.data.thirdPartyApplicant.re_registration === 0 ? 'radio-checked' : ''">
              <el-col :span="22">
                <span class="font-bold ml-8">{{$lang[langId].no}}</span>
              </el-col>
              <el-col :span="2">
                <div class="grid-content">
                  <el-radio v-model="this.data.thirdPartyApplicant.re_registration" size="large" :label="0">{{''}}</el-radio>
                </div>
              </el-col>
            </el-row>
          </el-row>
          <el-row class="pt-8" v-show="this.data.thirdPartyApplicant.ever_registered === 1 && this.data.thirdPartyApplicant.re_registration === 0">
            <hr class="mt-8">
            <div class="word-break mt-20" align="center">{{lang.notes}}</div>
            <p>{{this.data.thirdPartyApplicant.reason}}</p>
          </el-row>
          <!-- <div class="mt-20">
            <el-radio v-model="type" :label="1" border style="width: 100%">
              <svg-icon icon-class="user-man"></svg-icon>
              {{$lang[langId].individual}}
            </el-radio>
          </div>
          <div class="mt-10">
            <el-radio v-model="type" :label="2" border style="width: 100%">
              <svg-icon icon-class="building"></svg-icon>
              {{$lang[langId].company}}
            </el-radio>
          </div> -->
          <el-button @click="handleSubmitNow" class="visible-lg visible-md visible-sm" type="primary" style="width: 46%">
            {{$lang[langId].update_now}}
          </el-button>
          <el-button @click="handleSubmitNow" class="visible-xs" type="primary" style="width: 82%">
            {{$lang[langId].update_now}}
          </el-button>
        </div>
      <!-- </div>
          </div> -->
      </el-col>
    </el-row>
</template>

<script>
import { listPayment } from './dataPayment.js'
import { baseApi } from 'src/http-common.js';
import axios from 'axios';

export default {
  name: 'SubmisionType',
  
  props: {
    data: {
      type: Object,
      default: null
    }
  },

  data(){
    return{
      individualDoc: [
        {
          name: 'idCard',
          label: this.$lang[this.$store.state.userStores.langId].photo_id_card,
          logo: 'id-card-white',
          optional: false
        },
        {
          name: 'NPWP',
          label: this.$lang[this.$store.state.userStores.langId].photo_taxpayer_number+ ' ('+this.$lang[this.$store.state.userStores.langId].mandatory_gopay+')',
          logo: 'file-white',
          optional: false
        }
      ],
      businessDoc: [
        {
          name: 'deedEstablishment',
          label: this.$lang[this.$store.state.userStores.langId].deed_of_establishment,
          logo: 'id-card-white',
          optional: false
        },
        {
          name: 'businessLicence',
          label: this.$lang[this.$store.state.userStores.langId].trade_business_licensing,
          logo: 'file-white',
          optional: false
        },
        {
          name: 'skMenkumham',
          label: "SK Menkumham",
          logo: 'file-white',
          optional: false
        },
        {
          name: 'NPWP',
          label: this.$lang[this.$store.state.userStores.langId].photo_company_taxpayer_number,
          logo: 'file-white',
          optional: false
        },
        {
          name: 'directorIdCard',
          label: this.$lang[this.$store.state.userStores.langId].photo_director_id_card,
          logo: 'id-card-white',
          optional: false
        },
        {
          name: 'directorNPWP',
          label: this.$lang[this.$store.state.userStores.langId].photo_director_taxpayer_number+ ' ('+this.$lang[this.$store.state.userStores.langId].mandatory_gopay+')',
          logo: 'file-white',
          optional: false
        }
      ],
      dataBranchs: [],
      formData: {
        selectedPayment: this.data.paymentID,
        selectedBranchs: []
      },
      type: 1,
    }
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

    listPayment() {
      return listPayment;
    },
  },

  mounted(){
    this.getBranch();
    this.getStore();
  },

  methods: {
    getStore(value, businessType){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let store = value ? value : this.selectedStore.url_id

      axios({
        method: 'GET',
        url: baseApi(store, this.langId, 'generalsetting'),
        headers: headers
      }).then(response => {
        const res = response.data.data
        this.dataBranchs.push(
          {
            id: res.id,
            name: res.name,
            logo: res.logo,
            url_id: res.url_id+'.myolsera.com',
            business_type: businessType ? businessType : '',
            business_type_name: '',
            province_id: res.state_id,
            province: '',
            city_id: res.city_id,
            city: res.city_name,
            kecamatan_id: res.subdistrict_id,
            kecamatan: '',
            vilage: '',
            address: res.address,
	          lat: res.location_lat,
            lng: res.location_lon,
            postal_code: res.postal_code,
            thumbnail_business_npwp: null,
            thumbnail_sk_menkumham: null,
            thumbnail_akta_pendirian: null,
            thumbnail_akta_perubahan: null,
            thumbnail_siup_tdp_nib: null
          })
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    getBranch(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'storebranches'),
        headers: headers
      }).then(response => {
        const res = response.data.data
        res.forEach((branch, index) => {
          this.getStore(branch.url_id, branch.business_type)
          // this.dataBranchs.push({
          //   id: branch.id,
          //   name: branch.name,
          //   logo: branch.logo,
          //   url_id: branch.url_id,
          //   business_type: branch.business_type,
          //   province_id: '',
          //   province: branch.province,
          //   city_id: '',
          //   city: branch.city,
          //   kecamatan_id: '',
          //   kecamatan: '',
          //   vilage: '',
          //   address: '',
	        //   lat: branch.location_lat,
          //   lng: branch.location_lon,
          //   postal_code: branch.postal_code,
          //   status_location_business: null,
          //   thumbnail_location_store: null
          // })
        });

      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    isPaymentInclude(val){
      let className = ''
      if(this.data.paymentID.includes(val.id)){
        className = 'radio-checked'
      }else{
        className = ''
      }
      return className;
    },

    handleSubmitNow(){
      this.$emit('onSubmit')      
    },
  }
}
</script>