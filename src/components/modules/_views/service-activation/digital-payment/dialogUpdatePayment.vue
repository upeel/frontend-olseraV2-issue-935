<template>
  <div>
    <el-dialog
      :visible.sync="show"
      :show-close="false"
      :close-on-press-escape="false"
      append-to-body
      :close-on-click-modal="false"
      custom-class="dialog-digital-payment"
      width="70%"
      height="500px">
      <div slot="title" class="flex-container">
        <el-row :gutter="20"  style="width: 100%;">
          <el-col :span="14">
            <h4 class="dialog-title" align="left"><strong>{{lang.update +' '+ rootLang.digital_payment_submission}}</strong></h4>
          </el-col>
          <el-col :span="10" align="right" class="pr-null">
            <el-row :gutter="20" style="width: 100%; display: inline-flex;">
              <el-col :span="20">
                <div v-if="dataSubmisson.submit_as === 1" class="font-18 pt-8 d-inline-flex">
                    <svg-icon icon-class="user-man" class="mr-8"></svg-icon>
                    <span class="visible-lg visible-md visible-md">{{$lang[langId].individual}}</span>
                </div>
                <div v-else-if="dataSubmisson.submit_as === 2" class="font-18 pt-8 d-inline-flex">
                    <svg-icon icon-class="building" class="mr-8"></svg-icon>
                    <span class="visible-lg visible-md visible-md">{{$lang[langId].company}}</span>
                </div>
              </el-col>
              <el-col :span="4" class="pt-4">
                <div class="btn_save_dialog font-20 pt-4 pointer" @click="handleClose">
                  <svg-icon icon-class="x" />
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>

      <div v-if="loadingUpdate">
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
      <div v-else>
        <submision-individual v-if="dataSubmisson.submit_as === 1" v-bind:individualForm="dataSubmisson" @doneSubmission="handleUpdate"/>
        <submision-business v-else-if="dataSubmisson.submit_as === 2" v-bind:businessForm="dataSubmisson" @doneSubmission="handleUpdate"/>
        <!-- <submision-info v-else @onSubmit="updateSubmit" ref="infoUpdate" :data="dataSubmisson"/> -->
      </div>

      <el-dialog :visible.sync="dialogConfirmUpdate" :show-close="false" append-to-body custom-class="dialog-no-header">
        <div class="row" style="background-color: #FAFAFA">
            <div class="grid-content" style="margin:5% 10%">
              <h3 class="word-break" align="center"> {{lang.update +' '+ rootLang.digital_payment_submission}} ?</h3>
              <div style="margin-top: 20px" v-if="loadingUpdate === false">
                <el-button type="text" @click="handleUpdateConfirm" style="color:#67C23A; font-size:24px; float:left; margin-left:10%">
                  {{ lang.yes }}
                </el-button>
                <el-button type="text" @click="cancelUpdate" style="color:#5C5C5C; font-size:24px; float:right; margin-right:25%; margin-top:2px">{{lang.no}}</el-button>
              </div>
              <div v-else>
                <loading 
                  align="center"
                  :active="true"
                  color= '#1bb4e6'
                  loader="bars"
                  :width="64"
                  :height="64"
                  backgroundColor='#ffffff'>
                </loading>
              </div>
            </div>
        </div>
      </el-dialog>
    </el-dialog>

  </div>
</template>

<script>
import { baseApi } from 'src/http-common.js';
import axios from 'axios';
import Loading from 'vue-loading-overlay';
import submisionInfo from './submisionInfo';
import submisionIndividual from './individual/updateSubmisionIndividual';
import submisionBusiness from './business/updateSubmisionBusiness';
import basicComputedMixin from '@/mixins/basicComputedMixin';
import SvgIcon from '../../../SvgIcon.vue';
import { listPayment } from './dataPayment.js'

export default {
  name: 'dialogUpdatePayment',
  mixins: [basicComputedMixin],

  components: {
    Loading,
    SvgIcon,
    submisionInfo,
    submisionBusiness,
    submisionIndividual
  },

  props: {
    show: {
      type: Boolean,
      default: false
    },
    dataSubmisson: {
      type: Object,
      default: null
    }
  },

  computed: {

    listPayment() {
      return listPayment;
    },

    isRadioCheckEver(){
      let className = ''
      if(this.form.ever_registered === 1){
        className = 'radio-checked'
      }else{
        className = ''
      }

      return className;
    },

    isRadioCheckNever(){
      let className = ''
      if(this.form.ever_registered === 0){
        className = 'radio-checked'
      }else{
        className = ''
      }
      return className;
    },

    isResubmitYes(){
      let className = ''
      if(this.form.re_registration === 1){
        className = 'radio-checked'
      }else{
        className = ''
      }
      return className;
    },

    isResubmitNo(){
      let className = ''
      if(this.form.re_registration === 0){
        className = 'radio-checked'
      }else{
        className = ''
      }
      return className;
    }
  },

  data(){
    return{
      // isSubmit: true,
      dialogConfirmUpdate: false,
      loadingUpdate: false,
      finalForm: {}
    }
  },

  mounted() {
    // this.$refs.infoUpdate.getBranch();
    // this.$refs.infoUpdate.getStore();
  },

  methods: {

    handleClose(){
      this.$emit('onClose')
    },

    handleUpdate(data){
      this.dialogConfirmUpdate = true

      let applicant = data.applicant;
      let storeData = data.dataUsaha;
      let bankData = data.bank;
      let listPayment = data.listPayment;


      let thumbnail_business_npwp = [];
      let thumbnail_sk_menkumham = [];
      let thumbnail_akta_pendirian = [];
      let thumbnail_akta_perubahan = [];

      let siupBaru = [];
      var siupLama = [];

      if(this.dataSubmisson.submit_as === 2){
        thumbnail_business_npwp.push(storeData.thumbnail_business_npwp)
        thumbnail_sk_menkumham.push(storeData.thumbnail_sk_menkumham)
        thumbnail_akta_pendirian.push(storeData.thumbnail_akta_pendirian)
        thumbnail_akta_perubahan.push(storeData.thumbnail_akta_perubahan)
        storeData.thumbnail_siup_tdp_nib.forEach((siupFile, idxSiup) => {
          siupBaru.push(siupFile.photo_md);
        });
        siupLama = data.siupLama;
      }

      let store_id = []
      store_id.push(this.dataSubmisson.store_id)

      let finalData = {
        name: applicant.name,
        email: applicant.email,
        phone: applicant.phone,
        no_ktp: applicant.no_ktp,
        no_npwp: applicant.no_npwp,
        address: applicant.address,
        npwp_address: applicant.npwp_address,
        sub_districts_ktp: applicant.sub_district,
        village_ktp: applicant.village,
        rt_ktp: applicant.rt,
        rw_ktp: applicant.rw,
        thumbnail_ktp: applicant.thumbnail_ktp,
        thumbnail_npwp: applicant.thumbnail_npwp,
        submit_as: this.dataSubmisson.submit_as,
        store_id: store_id,
        thirdparty_service_item_id: listPayment,
        business_type_id: Array(String(storeData.business_type)),
        status_location_business: Array(storeData.status_location_business),
        sub_districts: Array(storeData.city),
        store_address: Array(storeData.address),
        location_lat: Array(String(storeData.lat)),
        location_lon: Array(String(storeData.lng)),
        village: Array(storeData.vilage),
        postal_code: Array(String(storeData.postal_code)),
        logo: Array(storeData.logo_ewallet),

        thumbnail_business_npwp: thumbnail_business_npwp,
        thumbnail_sk_menkumham : thumbnail_sk_menkumham,
        thumbnail_akta_pendirian: thumbnail_akta_pendirian,
        thumbnail_akta_perubahan: thumbnail_akta_perubahan,
        thumbnail_siup_tdp_nib: siupBaru.concat(siupLama),

        bank_id: Array(String(bankData.bank_id)),
        bank_branch_name: Array(bankData.branch),
        bank_account_number: Array(bankData.bank_account_number),
        bank_account_name: Array(bankData.bank_owner_name)
      }
      this.finalForm = finalData
    },

    handleUpdateConfirm(){
      this.loadingUpdate = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let data = this.finalForm

      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'activation/service/digital-payment/update'),
        headers: headers,
        data
      }).then(response => {
        this.loadingUpdate = false
        this.dialogConfirmUpdate = false
        this.finalForm = {}
        this.$emit('onClose')
        this.$message({
          type: 'success',
          message: this.$lang[this.langId].success_apply_loan
        })
      }).catch(error => {
        this.loadingUpdate = false
        if(typeof error.response.data.error.error === 'object'){
          let errorKey = Object.keys(error.response.data.error.error)[0];
          this.$notify({
            tipe: 'warning',
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
    },

    cancelUpdate(){
      this.dialogConfirmUpdate = false
    },

    updateSubmit(){
      // this.isSubmit = true
    },
  }
}
</script>