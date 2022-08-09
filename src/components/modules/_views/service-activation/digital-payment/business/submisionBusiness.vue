<template>
  <div class="submit-submision">
    <el-row class="menu">
      <el-col :class="isComplete('owner')" :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
        <div @click="handleMenu('owner')" class="pointer notLast active">1. {{rootLang.data_owner}}</div>
      </el-col>
      <el-col :class="isComplete('branch')" class="pointer" :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
        <div @click="handleMenu('branch')" class="pointer notLast" :class="branchClass">2. {{rootLang.select_branch}}</div>
      </el-col>
      <el-col :class="isComplete('company')" class="pointer" :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
        <div @click="handleMenu('company')" class="pointer notLast" :class="companyClass">3. {{rootLang.company}}</div>
      </el-col>
      <el-col :class="isComplete('bank')" class="pointer" :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
        <div @click="handleMenu('bank')" class="pointer notLast" :class="bankClass">4. {{lang.bank_account}}</div>
      </el-col>
      <el-col :class="isComplete('summary')" class="pointer" :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
        <div @click="handleMenu('summary')" style="border-top-right-radius: 0; border-bottom-right-radius: 0; cursor: pointer;" :class="summaryClass">5. {{rootLang.summary}}</div>
      </el-col>
    </el-row>

    <data-owner v-show="inTab === 'owner'" @change="handleFormData" @next="handleNext"/>

    <data-branch v-show="inTab === 'branch'" @change="handleFormData" @next="handleNext"/>

    <data-usaha :branchs="form.branchs" v-show="inTab === 'company'" @change="updateBranch" ref="dataUsaha" @next="handleNext" @list="handleBranchList"/>
    
    <akun-bank :branchs="form.branchs" :dataBank="form.bank" v-show="inTab === 'bank'" @change="handleFormData" :dataPemilik="form.owner" @next="handleNext" @list="handleBranchList" ref="dataBank"/>

    <ringkasan v-show="inTab === 'summary'" :form="this.form" @next="handleApplySubmission"/>

    <el-dialog
      width="30%"
      :title="rootLang.select_store + ' (' + form.branchs.length + ')'"
      :visible.sync="showBranchList"
      append-to-body>
      <span class="font-13 word-break">{{rootLang.select_branch_info}}</span>
      <div class="row branchStore py-8" v-for="(branch, key) in form.branchs" :key="key">
        <div class="col-sm-9 px-12" align="left" >
          <div class="unset-height pt-10">
            <img :src="branch.logo" style="height: 25px"/>
            
            <span >{{branch.name}}</span>

          </div>
        </div>
        <div class="col-sm-3 px-12 pt-4" align="right">

            <el-button size="mini" type="info" style="width: 65px;" @click="selectBranch(key)">
              {{rootLang.select}}
            </el-button>
            <svg-icon v-if="branch.status_location_business && branch.thumbnail_business_npwp &&
              branch.thumbnail_sk_menkumham && branch.thumbnail_akta_pendirian &&
              branch.thumbnail_akta_perubahan && branch.thumbnail_siup_tdp_nib"
              class="" icon-class="status_icon" 
              style="position: absolute;
                font-size: 20px;
                margin-top: -5px;
                overflow: hidden;
                margin-left: -8px;">
            </svg-icon>
            <span v-else class="tag-info-circle" style="position: absolute;
                font-size: x-small;
                margin-top: -12px;
                overflow: hidden;
                margin-left: -8px;">
                <svg-icon icon-class="info"></svg-icon>
            </span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin';
import dataOwner from './_dataOwner';
import dataBranch from './_dataBranch';
import dataUsaha from './_dataUsaha';
import akunBank from './_dataBank';
import ringkasan from './_ringkasan';
import SvgIcon from '../../../../SvgIcon.vue';
import { listPayment } from '../dataPayment.js'

export default {
  components: { 
    SvgIcon,
    dataOwner,
    dataBranch,
    dataUsaha,
    akunBank,
    ringkasan
  },
  name: 'SubmisionBusiness',
  mixins: [basicComputedMixin],
  computed: {
    listPayment() {
      return listPayment;
    },

    branchClass(){
        const data = this.isCompleteOwner ? 'active' : ''
        return data;
    },

    companyClass(){
        const data = this.isCompleteBranch ? 'active' : ''
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

  watch: {},

  mounted() {},
  
  data() {
    return{
      selectedBranch: 0,
      loading: false,
      isCompleteOwner: false,
      isCompleteBranch: false,
      isCompleteCompany: false,
      isCompleteBank: false,
      showBranchList: false,
      inTab: 'owner',
      form: {
        owner: {},
        bank: [],
        branchs: [],
      },
    }
  },


  methods: {
    selectBranch(key){
      if(this.inTab === 'company'){
        this.$refs.dataUsaha.resetBranch(key);
        this.$refs.dataUsaha.getStateCity();
        this.$refs.dataUsaha.handleSelectedType();
        this.$refs.dataUsaha.setLocation();
      } else {
        this.$refs.dataBank.resetBranch(key);
      }

      this.showBranchList = false
    },

    handleBranchList(){
      let show = this.showBranchList
      this.showBranchList = show ? false : true
    },

    isComplete(val){
      let data = ''
      if(val === 'owner'){
        data = this.isCompleteOwner ? 'el-col-complete' : ''
      }else if(val === 'branch'){
        data = this.isCompleteBranch ? 'el-col-complete' : ''
      }else if(val === 'company'){
        data = this.isCompleteCompany ? 'el-col-complete' : ''
      }else if(val === 'bank'){
        data = this.isCompleteBank ? 'el-col-complete' : ''
      }

      return data;
    },

    handleNext(tab, data){
      this.handleFormData(data)
      if(tab === 'branch'){
        let owner = this.form.owner
        if(owner.name !== '' && owner.id_card_number.length === 16 && owner.phone_number !== '' &&
         owner.address !== '' && Object.keys(owner.fileIdCard).length !== 0){
           if((owner.fileNpwp !== null && Object.prototype.toString.call(owner.fileNpwp) === '[object Object]') && 
            (owner.npwp === '' || owner.npwp_address === '')){
            this.$notify({
              type: 'warning',
              message: this.rootLang.complete_data_first_in +' '+ this.rootLang.data_owner,
              title: 'Error'
            })
           }else{
            this.isCompleteOwner =  true
            this.inTab = 'branch'
           }
        }else{
          this.$notify({
            type: 'warning',
            message: this.rootLang.complete_data_first_in +' '+ this.rootLang.data_owner,
            title: 'Error'
          })
        }
      }else if(tab === 'company'){
        if(this.form.branchs.length !== 0){
          this.$refs.dataUsaha.resetBranch();
          this.$refs.dataUsaha.getStateCity();
          this.$refs.dataUsaha.handleSelectedType();
          this.$refs.dataUsaha.setLocation();

          this.isCompleteBranch =  true
          this.inTab = 'company'
        }
      }else if(tab === 'bank'){
        this.isCompleteCompany = true
        this.inTab = 'bank'
      }else if(tab === 'summary'){
        this.isCompleteBank = true
        this.inTab = 'summary'
      }else if(tab === 'privacy'){
        this.showPrivacy = true
      }
    },

    handleFormData(data) {
      this.form = { ...this.form, ...data }
    },

    updateBranch(idx, field, val){
      this.form.branchs[idx][field] = val
    },

    handleMenu(menu){
      if(menu === 'owner'){
        this.inTab = 'owner'
      }else if(menu === 'branch'){
        this.inTab = this.isCompleteOwner ? 'branch' : this.inTab
      }else if(menu === 'company'){
        this.$refs.dataUsaha.getStateCity();
        this.inTab = this.isCompleteOwner && this.isCompleteBranch ? 'company' : this.inTab
      }else if(menu === 'bank'){
       this.inTab = this.isCompleteOwner && this.isCompleteBranch && this.isCompleteCompany ? 'bank' : this.inTab
      }else if(menu === 'summary'){
        this.inTab = this.isCompleteOwner && this.isCompleteBranch && this.isCompleteCompany && this.isCompleteBank ? 'summary' : this.inTab
      }
    },

    handleApplySubmission(){
      this.$emit('doneSubmission', this.form)
    },

    validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
  }

}
</script>