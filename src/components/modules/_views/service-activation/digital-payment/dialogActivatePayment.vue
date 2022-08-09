<template>
  <div>
    <el-dialog
      width="30%"
      :show-close="false"
      :close-on-click-modal="true"
      :close-on-press-escape="false"
      :visible.sync="show"
      custom-class="dialog-no-header justify-text"
      style="margin-top: 80px;"
      modal-append-to-body>
      <div slot="title" class="mt-min-30 color-white" align="right">
        <div class="btn_save_dialog font-20 pt-4 pointer" @click="handleClose">
          <svg-icon icon-class="x" />
        </div>
      </div>
      <span class="word-break">{{rootLang.is_register_digipayment}}?</span>
      <div class="pointer" @click="handleEver">
        <el-row class="pt-8 mt-10" :class="isRadioCheckEver">
          <el-col :span="22">
            <span class="font-bold">{{rootLang.ever_register}}</span>
          </el-col>
          <el-col :span="2">
            <div class="grid-content">
              <el-radio v-model="form.ever_registered" size="large" :label="1">{{''}}</el-radio>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="pointer" @click="handleNever">
        <el-row class="pt-8" :class="isRadioCheckNever">
          <el-col :span="22">
            <span class="font-bold">{{rootLang.never_register}}</span>
          </el-col>
          <el-col :span="2">
            <div class="grid-content">
              <el-radio v-model="form.ever_registered" size="large" :label="0">{{''}}</el-radio>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-button type="primary" @click="isRegisterCheck" class="w-fit mt-10">
        {{$lang[langId].next}}
      </el-button>
    </el-dialog>

    <el-dialog
      width="30%"
      :show-close="false"
      :visible.sync="showRegisterPayment"
      custom-class="dialog-no-header justify-text"
      style="margin-top: 80px;"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      modal-append-to-body>
      <div slot="title" class="mt-min-30 color-white" align="right">
        <div class="btn_save_dialog font-20 pt-4 pointer" @click="handleClose">
          <svg-icon icon-class="x" />
        </div>
      </div>
      <span class="word-break">{{rootLang.what_payment}}?</span>
      <div v-for="(payment, paymentIdx) in listPayment" :key="paymentIdx" class="pointer">
        <el-row class="pt-8" :class="isPaymentInclude(payment)">
          <el-col :span="22">
            <div class="font-bold ml-8" @click="selectPayment(payment)">{{payment.name}}</div>
          </el-col>
          <el-col :span="2">
            <el-checkbox-group class="grid-content"
              v-model="form.thirdparty_service_item_id">
              <el-checkbox :label="payment.id">{{''}}</el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-row>
      </div>

      <div class="word-break mt-20">{{rootLang.re_sunmit_digipayment}}?</div>
      <div class="pointer" @click="reSubmitYes">
        <el-row class="pt-8" :class="isResubmitYes">
          <el-col :span="22">
            <span class="font-bold ml-8">{{rootLang.yes}}</span>
          </el-col>
          <el-col :span="2">
            <div class="grid-content">
              <el-radio v-model="form.re_registration" size="large" :label="1">{{''}}</el-radio>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="pointer" @click="reSubmitNo">
        <el-row class="pt-8" :class="isResubmitNo">
          <el-col :span="22">
            <span class="font-bold ml-8">{{rootLang.no}}</span>
          </el-col>
          <el-col :span="2">
            <div class="grid-content">
              <el-radio v-model="form.re_registration" size="large" :label="0">{{''}}</el-radio>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-if="form.re_registration === 0">
        <div class="word-break mt-20">{{rootLang.your_reason}}</div>
        <div v-for="(item, reasonIdx) in reSubmitReason" :key="reasonIdx">
          <div class="pointer" @click="selectReason(item)">
            <el-row class="pt-8" :class="item.id === reason_id ? 'radio-checked' : ''">
              <el-col :span="22">
                <span class="font-bold ml-8">{{item.reason}}</span>
              </el-col>
              <el-col :span="2">
                <div class="grid-content">
                  <el-radio v-model="reason_id" size="large" :label="item.id">{{''}}</el-radio>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div v-show="reason_id === 4">
        <el-input size="small" class="w-fit pt-8"
          :placeholder="rootLang.enter_reason" v-model="form.reason"></el-input>
      </div>
      <el-button v-if="form.re_registration === 1" :disabled="form.thirdparty_service_item_id.length === 0 ? true : false" 
       type="primary" @click="handleRegisterCheck" class="w-fit mt-10">
        {{$lang[langId].next}}
      </el-button>
      <el-button v-else 
        :disabled="form.thirdparty_service_item_id.length === 0 || form.reason === '' ? true : false" 
        type="primary" @click="handleRegisterCheck" class="w-fit mt-10">
        {{$lang[langId].next}}
      </el-button>
    </el-dialog>

    <el-dialog
      :visible.sync="showSubmission"
      :show-close="false"
      :close-on-press-escape="false"
      append-to-body
      :close-on-click-modal="false"
      custom-class="dialog-digital-payment"
      width="75%"
      height="500px">
      <div slot="title" class="flex-container">
        <el-row :gutter="20"  style="width: 100%;">
          <el-col :span="14">
            <h4 class="dialog-title" align="left"><strong>{{rootLang.digital_payment_submission}}</strong></h4>
          </el-col>
          <el-col :span="10" align="right" class="pr-null">
            <el-row :gutter="20" style="width: 100%; display: inline-flex;">
              <el-col :span="20">
                <div v-if="form.submit_as === 1" class="font-18 pt-8 d-inline-flex">
                    <svg-icon icon-class="user-man" class="mr-8"></svg-icon>
                    <span class="visible-lg visible-md visible-md">{{$lang[langId].individual}}</span>
                </div>
                <div v-else-if="form.submit_as === 2" class="font-18 pt-8 d-inline-flex">
                    <svg-icon icon-class="building" class="mr-8"></svg-icon>
                    <span class="visible-lg visible-md visible-md">{{$lang[langId].company}}</span>
                </div>
              </el-col>
              <el-col :span="form.submit_as !== '' ? 4 : 24" class="pt-4">
                <div class="btn_save_dialog font-20 pt-4 pointer" @click="handleBack('submission')">
                  <el-tooltip class="item" effect="dark" :content="isSubmit ? $lang[langId].back_to_type_submission : $lang[langId].back_to_status_regitration" placement="top">
                    <svg-icon icon-class="arrow-back" />
                  </el-tooltip>
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
  
      <submision-individual v-if="isSubmit && form.submit_as === 1" @doneSubmission="handleShowPrivacy"/>
      <submision-business v-else-if="isSubmit && form.submit_as === 2" @doneSubmission="handleShowPrivacy"/>
      <submision-type v-else @onSubmit="selectSubmit" />

    </el-dialog>

    <dialog-privacy-policy :show="showPrivacy" :loading="loadingSubmission" @submit="acceptTermCondition" @close="closePrivacy"/>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common.js';
import axios from 'axios';
import submisionType from './submisionType';
import submisionIndividual from './individual/submisionIndividual';
import submisionBusiness from './business/submisionBusiness';
import dialogPrivacyPolicy from './dialogPrivacyPolicy';
import basicComputedMixin from '@/mixins/basicComputedMixin';
import SvgIcon from '../../../SvgIcon.vue';
import { listPayment } from './dataPayment.js'

export default {
  name: 'dialogActivatePayment',
  mixins: [basicComputedMixin],

  components: {
    SvgIcon,
    submisionType,
    submisionBusiness,
    submisionIndividual,
    dialogPrivacyPolicy
  },

  props: {
    show: {
      type: Boolean,
      default: false
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
      isSubmit: false,
      showPrivacy: false,
      loadingSubmission: false,
      showSubmission: false,
      showRegisterPayment: false,
      reSubmitReason: [{
        id: 1,
        reason: this.$lang[this.$store.state.userStores.langId].administration_reason
      },{
        id: 2,
        reason: this.$lang[this.$store.state.userStores.langId].not_interested_reason
      },{
        id: 3,
        reason: this.$lang[this.$store.state.userStores.langId].promo_reason
      },{
        id: 4,
        reason: this.$lang[this.$store.state.userStores.langId].another
      }],
      reason_id: 0,
      form: {
        ever_registered: 0,
        thirdparty_service_item_id: [],
        re_registration: 1,
        reason: '',
        submit_as: '',
        data:{}
      }
    }
  },

  mounted() {

  },

  methods: {
    selectSubmit(params){
      this.form.submit_as = params ? params : ''
      let submit = this.isSubmit
      this.isSubmit = submit ? false : true
    },
    
    handleBack(from){
      if(this.isSubmit === true){
        this.showSubmission = true
        this.isSubmit = false
        this.showRegisterPayment = false
      }else{
        this.showSubmission = false
        this.showRegisterPayment = false
      }
    },

    handleClose(){
      this.$emit('onClose')
    },

    handleShowPrivacy(data){
      this.form.data = data
      this.showPrivacy = true
      this.showSubmission = false
    },

    closePrivacy(){
      this.form.data = {}
      this.showPrivacy = false
      this.loadingSubmission = false
      this.showSubmission = true
    },

    handleEver(){
      this.form.ever_registered= 1
    },

    handleNever(){
      this.reason_id = 0
      this.form.thirdparty_service_item_id = []
      this.form.re_registration = 1
      this.form.reason = ''
      this.form.ever_registered = 0
    },

    reSubmitYes(){
      this.reason_id = 0
      this.form.reason = ''
      this.form.re_registration = 1
    },

    reSubmitNo(){
      this.form.re_registration = 0
    },

    isRegisterCheck(){
      if(this.form.ever_registered === 1){
        this.showSubmission = false
        this.showRegisterPayment = true
      }else if(this.form.ever_registered === 0){
        this.form.ever_registered = 0,
        this.form.thirdparty_service_item_id = []
        this.form.re_registration = 0
        this.form.reason = ''

        this.showRegisterPayment = false
        this.showSubmission = true
      }
    },
    
    isPaymentInclude(val){
      let className = ''
      if(this.form.thirdparty_service_item_id.includes(val.id)){
        className = 'radio-checked'
      }else{
        className = ''
      }
      return className;
    },

    selectReason(row){
      this.reason_id = row.id
      if(row.id === 4){
        this.form.reason = ''
      }else{
        this.form.reason = row.reason
      }
    },

    selectPayment(payment){
      if(this.form.thirdparty_service_item_id.indexOf(payment.id) !== -1){
        this.form.thirdparty_service_item_id.splice(this.form.thirdparty_service_item_id.indexOf(payment.id), 1)
      }else{
        this.form.thirdparty_service_item_id.push(payment.id)
      }
    },

    acceptTermCondition(){
      this.loadingSubmission = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let allData = this.form

      let store_id = [];
      let store_status = [];
      let store_address = [];
      let location_lat = [];
      let location_lon = [];
      let store_business_type = [];
      let logo_ewallet = [];
      let village = [];
      let postal_code = [];
      let thumbnail_business_npwp = [];
      let thumbnail_sk_menkumham = [];
      let thumbnail_akta_pendirian = [];
      let thumbnail_akta_perubahan = [];
      let thumbnail_siup_tdp_nib = [];

      let bank_id = [];
      let bank_branch_name = [];
      let bank_account_number = [];
      let bank_account_name = [];

      allData.data.branchs.forEach((branch, index) => {
        store_id.push(branch.id);
        store_status.push(parseInt(branch.status_location_business));
        store_business_type.push(parseInt(branch.business_type));
        store_address.push(branch.address);
        location_lat.push(branch.lat);
        location_lon.push(branch.lng);
        village.push(branch.vilage);
        logo_ewallet.push(branch.logo_ewallet.photo_md);
        postal_code.push(branch.postal_code ? parseInt(branch.postal_code) : '');
        let siup = {
          docs: []
        }
        
        if(allData.submit_as === 2){
          thumbnail_business_npwp.push(branch.thumbnail_business_npwp.photo_md)
          thumbnail_sk_menkumham.push(branch.thumbnail_sk_menkumham.photo_md)
          
          if(branch.thumbnail_akta_pendirian.hasOwnProperty('pdf_file') === true){
            thumbnail_akta_pendirian.push(branch.thumbnail_akta_pendirian.pdf_file)
          }else{
            thumbnail_akta_pendirian.push(branch.thumbnail_akta_pendirian.photo_md)
          }

          if(branch.thumbnail_akta_perubahan.hasOwnProperty('pdf_file') === true){
            thumbnail_akta_perubahan.push(branch.thumbnail_akta_perubahan.pdf_file)
          }else{
            thumbnail_akta_perubahan.push(branch.thumbnail_akta_perubahan.photo_md)
          }

          branch.thumbnail_siup_tdp_nib.forEach((siupFile, idxSiup) => {
            siup.docs.push(siupFile.photo_md);
          });
          thumbnail_siup_tdp_nib.push(siup);
        }
      });

      allData.data.bank.forEach((bank, index) => {
        bank_id.push(bank.bank_id);
        bank_branch_name.push(bank.branch);
        bank_account_number.push(bank.bank_owner_name);
        bank_account_name.push(bank.bank_account_number);
      })

      var submitData = {
        ever_registered: allData.ever_registered,
        thirdparty_service_item_id: allData.thirdparty_service_item_id,
        re_registration: allData.re_registration,
        reason: allData.reason,
        submit_as: allData.submit_as,

        thumbnail_ktp: allData.data.owner.fileIdCard.photo_md,
        thumbnail_npwp: allData.data.owner.fileNpwp ? allData.data.owner.fileNpwp.photo_md : '',
        name: allData.data.owner.name,
        email: allData.data.owner.email,
        phone: allData.data.owner.phone_number,
        no_ktp: allData.data.owner.id_card_number,
        no_npwp: allData.data.owner.npwp.replace(/\./g, '').replace('-',''),
        address : allData.data.owner.address,
        npwp_address: allData.data.owner.npwp_address,
        sub_districts_ktp : allData.data.owner.sub_district,
        village_ktp : allData.data.owner.village,
        rt_ktp: parseInt(allData.data.owner.rt),
        rw_ktp: parseInt(allData.data.owner.rw),

        store_id: store_id,
        business_type_id: store_business_type,
        status_location_business: store_status,
        store_address: store_address,
        location_lat: location_lat,
        location_lon: location_lon,
        village: village,
        postal_code: postal_code,
        logo: logo_ewallet,
        thumbnail_business_npwp: thumbnail_business_npwp,
        thumbnail_sk_menkumham : thumbnail_sk_menkumham,
        thumbnail_akta_pendirian: thumbnail_akta_pendirian,
        thumbnail_akta_perubahan: thumbnail_akta_perubahan,
        thumbnail_siup_tdp_nib: thumbnail_siup_tdp_nib,

        bank_id: bank_id,
        bank_branch_name: bank_branch_name,
        bank_account_number: bank_account_number,
        bank_account_name: bank_account_name
      }

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'activation/service/digital-payment'),
        headers: headers,
        data: submitData
      }).then(response => {
        this.loadingSubmission = false
        this.isSubmit = false
        this.showPrivacy = false
        this.loadingSubmission = false
        this.showSubmission = false
        this.showRegisterPayment = false
        this.reason_id = 0
        this.formData = {
          ever_registered: 0,
          thirdparty_service_item_id: [],
          re_registration: 1,
          reason: '',
          submit_as: '',
          data:{}
        }
        this.$emit('onClose')
        this.$message({
          type: 'success',
          message: this.$lang[this.langId].success_apply_loan
        })
      }).catch(error => {
        this.loadingSubmission = false
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

    handleRegisterCheck(){
      this.showRegisterPayment = false
      this.showSubmission = true
    }
  }
}
</script>