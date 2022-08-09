<template>
  <div class="submit-submision">
    <el-row class="menu">
      <el-col :class="isComplete('owner')" :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
        <div @click="handleMenu('owner')" class="pointer notLast active">1. {{rootLang.data_owner}}</div>
      </el-col>
      <el-col :class="isComplete('company')" class="pointer" :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
        <div @click="handleMenu('company')" class="pointer notLast" :class="companyClass">2. {{rootLang.company}}</div>
      </el-col>
      <el-col :class="isComplete('bank')" class="pointer" :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
        <div @click="handleMenu('bank')" class="pointer notLast" :class="bankClass">3. {{lang.bank_account}}</div>
      </el-col>
      <el-col :class="isComplete('summary')" class="pointer" :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
        <div @click="handleMenu('summary')" style="border-top-right-radius: 0; border-bottom-right-radius: 0; cursor: pointer;" :class="summaryClass">4. {{rootLang.summary}}</div>
      </el-col>
    </el-row>

    <data-owner v-show="inTab === 'owner'" :dataForm="businessForm" @change="handleFormData" @next="handleNext"/>

    <data-usaha v-show="inTab === 'company'" :dataForm="businessForm" @change="handleFormData" ref="dataUsaha" @next="handleNext"/>
    
    <akun-bank v-show="inTab === 'bank'" :dataForm="businessForm" @change="handleFormData" :dataPemilik="form.applicant" @next="handleNext" ref="dataBank"/>

    <ringkasan v-show="inTab === 'summary'" :dataForm="businessForm" :form="this.form" @next="handleApplySubmission"/>

  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin';
import { baseApi } from 'src/http-common.js'
import axios from 'axios'
import dataOwner from './_updateDataOwner';
import dataUsaha from './_updateDataUsaha';
import akunBank from './_updateDataBank';
import ringkasan from './_updateRingkasan';
import SvgIcon from '../../../../SvgIcon.vue';
import { listPayment } from '../dataPayment.js'

export default {
  components: { 
    SvgIcon,
    dataOwner,
    dataUsaha,
    akunBank,
    ringkasan
  },
  name: 'UpdateSubmisionBusiness',
  mixins: [basicComputedMixin],
  computed: {
    listPayment() {
      return listPayment;
    },

    companyClass(){
        const data = this.isCompleteOwner ? 'active' : ''
        return data;
    },

    bankClass(){
      const data = this.isCompleteCompany ? 'active' : ''
      return data;
    },

    summaryClass(){
        const data = this.isCompleteBank ? 'active' : ''
        return data;
    }
  },

  props: ['businessForm'],
  
  data() {
    return{
      selectedBranch: 0,
      loading: false,
      isCompleteOwner: false,
      isCompleteCompany: false,
      isCompleteBank: false,
      inTab: 'owner',
      form: {
        applicant: {},
        dataUsaha: {},
        bank:{},
        listPayment: [],
        siupLama: []
      },
    }
  },


  methods: {
    selectBranch(key){
      // this.$refs.dataUsaha.resetBranch(key);
      // this.$refs.dataUsaha.getStateCity();
      // this.$refs.dataUsaha.handleSelectedType();
      // this.$refs.dataUsaha.setLocation();
    },

    isComplete(val){
      let data = ''
      if(val === 'owner'){
        data = this.isCompleteOwner ? 'el-col-complete' : ''
      }else if(val === 'company'){
        data = this.isCompleteCompany ? 'el-col-complete' : ''
      }else if(val === 'bank'){
        data = this.isCompleteBank ? 'el-col-complete' : ''
      }

      return data;
    },

    handleNext(tab, data){
      this.handleFormData(data)

      if(tab === 'company'){
        let applicant = this.form.applicant
        if(applicant.name !== '' && applicant.no_ktp.length === 16 && applicant.phone !== '' &&
         applicant.address !== '' && applicant.thumbnail_ktp !== null){
           if(applicant.thumbnail_npwp !== null && (applicant.npwp === '' || applicant.npwp_address === '')){
              this.$notify({
                type: 'warning',
                message: this.rootLang.complete_data_first_in +' '+ this.rootLang.data_owner,
                title: 'Error'
              })
            }else{
              this.isCompleteOwner =  true
              this.inTab = 'company'
            }
        }else{
          this.$notify({
            type: 'warning',
            message: this.rootLang.complete_data_first_in +' '+ this.rootLang.data_owner,
            title: 'Error'
          })
        }
      }else if(tab === 'bank'){
        this.isCompleteCompany = true
        this.inTab = 'bank'
      }else if(tab === 'summary'){
        this.isCompleteBank = this.$refs.dataBank.checkValidateBank()
        this.inTab = 'summary'
      }
    },

    handleFormData(data) {
      this.form = { ...this.form, ...data }
    },

    handleMenu(menu){
      if(menu === 'owner'){
        this.inTab = 'owner'
      }else if(menu === 'company'){
        this.$refs.dataUsaha.getStateCity();
        this.inTab = this.isCompleteOwner ? 'company' : this.inTab
      }else if(menu === 'bank'){
       this.inTab = this.isCompleteOwner && this.isCompleteCompany ? 'bank' : this.inTab
      }else if(menu === 'summary'){
        this.inTab = this.isCompleteOwner && this.isCompleteCompany && this.isCompleteBank ? 'summary' : this.inTab
      }
    },

    handleApplySubmission(data){
      this.handleFormData(data)
      this.$emit('doneSubmission', this.form)
    },

    validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
  }

}
</script>