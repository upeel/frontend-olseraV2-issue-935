<template>
  <div>
     <el-dialog
      :visible.sync="showSubmission"
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
            <h4 class="dialog-title" align="left"><strong>{{rootLang.koinworks_submission}}</strong></h4>
          </el-col>
          <el-col :span="10" align="right" class="pr-null">
            <el-row :gutter="20" style="width: 100%; display: inline-flex;">
              <el-col :span="20">
                <div v-if="form.submit_as === 1" class="font-18 pt-8 d-inline-flex">
                    <svg-icon icon-class="user-man" class="mr-8"></svg-icon>
                    <span class="visible-lg visible-md visible-md">{{rootLang.individual}}</span>
                </div>
                <div v-else-if="form.submit_as === 2" class="font-18 pt-8 d-inline-flex">
                    <svg-icon icon-class="building" class="mr-8"></svg-icon>
                    <span class="visible-lg visible-md visible-md">{{rootLang.company}}</span>
                </div>
              </el-col>
              <el-col :span="form.submit_as !== '' ? 4 : 24" class="pt-4">
                <div class="btn_save_dialog font-20 pt-4 pointer" @click="handleBack('submission')">
                  <el-tooltip class="item" effect="dark" :content="isSubmit ? rootLang.back_to_type_submission : rootLang.close" placement="top">
                    <svg-icon :icon-class="isSubmit ? 'arrow-back' : 'x'" />
                  </el-tooltip>
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>

      <submision-individual v-if="isSubmit && form.submit_as === 1" @doneSubmission="handleApplySubmit"/>
      <submision-business v-else-if="isSubmit && form.submit_as === 2" @doneSubmission="handleApplySubmit"/>
      <submision-type v-else @onSubmit="selectSubmit" />
      <el-dialog
        width="30%"
        :title="rootLang.koinworks_submission"
        :visible.sync="dialogConfirmSubmit"
        center append-to-body 
        :close-on-click-modal="false" 
        :show-close="false">
        <div class="text-center">
          <p>{{ rootLang.are_you_sure }}</p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showConfirm">{{ lang.cancel }}</el-button>
          <el-button type="danger" :disabled="loadingSubmission" :loading="loadingSubmission" @click="handleSubmitFinal">
            {{ rootLang.submit }}
          </el-button>
        </span>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import submisionType from './submisionType';
import submisionIndividual from './individual/submisionIndividual';
import submisionBusiness from './business/submisionBusiness';
import basicComputedMixin from '@/mixins/basicComputedMixin';
import { submitKoinworks } from '@/api/thirdParty/koinworks';

export default {
  name: 'dialogKoinworksubmission',
  mixins: [basicComputedMixin],

  components: {
    submisionType,
    submisionBusiness,
    submisionIndividual,
  },
  props: {},

  computed: {
    
  },

  data(){
    return{
      loadingSubmission: false,
      dialogConfirmSubmit: false,
      showSubmission: true,
      isSubmit: false,
      form: {
        submit_as: '',
      }
    }
  },

  methods: {
    selectSubmit(params){
      this.form.submit_as = params ? params : ''
      let submit = this.isSubmit
      this.isSubmit = submit ? false : true
    },

    handleBack(){
      this.form.submit_as = ''
      let submit = this.isSubmit
      if(submit){
        this.isSubmit = false
      }else{
        this.$router.push({
          path: '/service-activation-v2'
        })
      }
    },

    handleApplySubmit(dataForm){
      this.form = { ...this.form, ...dataForm }
      this.showConfirm();
    },

    showConfirm(){
      let show = this.dialogConfirmSubmit
      this.dialogConfirmSubmit = show ? false : true
    },

    handleSubmitFinal(){
      this.loadingSubmission = true

      let allData = this.form
      let thumbnail_file_bank = [];

      allData.data_usaha.fileBank.forEach((bankFile, idxFile) => {
        thumbnail_file_bank.push(bankFile.photo_md);
      });

      let allDocuments = {
        thumbnail_ktp: allData.owner.fileIdCard.photo_md,
        thumbnail_kk: allData.owner.fileFamilyRegister ? allData.owner.fileFamilyRegister.photo_md : '',
        thumbnail_rekening_koran: thumbnail_file_bank,
      }

      var submitData = {
        store_id: allData.data_usaha.id,
        business_age: allData.data_usaha.business_age,
        ig_link: allData.data_usaha.instagram_link,
        personal_web_link: allData.data_usaha.website_link,
        merchant_id: allData.data_usaha.merchant_id,

        ktp_number: allData.owner.id_card_number,
        gender: allData.owner.gender,
        type: allData.submit_as-1,
        
        amount: allData.amount.amount,
        tenor: allData.amount.plafond,
        loan_purpose_id: allData.amount.purpose,

        bank_id: allData.bank.bank_id,
        bank_branch_name: allData.bank.branch,
        bank_account_number: allData.bank.bank_account_number,
        bank_account_name: allData.bank.bank_owner_name,

        documents: allDocuments
      }

      if(allData.submit_as === 1){
        submitData.documents.thumbnail_npwp = allData.owner.fileNpwp ? allData.owner.fileNpwp.photo_md : ''
        submitData.documents.thumbnail_ktp_pasangan = allData.owner.fileIdCouple ? allData.owner.fileIdCouple.photo_md : ''
      }else{
        submitData.documents.thumbnail_sk_menkumham  = allData.data_usaha.skMenku ? allData.data_usaha.skMenku.photo_md : ''
        
        let thumbnail_siup_tdp_nib = [];
        let thumbnail_akta_pendirian = '';

        if(allData.data_usaha.pendirian.hasOwnProperty('pdf_file') === true){
          thumbnail_akta_pendirian = allData.data_usaha.pendirian.pdf_file
        }else{
          thumbnail_akta_pendirian = allData.data_usaha.pendirian.photo_md
        }

        submitData.documents.thumbnail_akta_pendirian  = thumbnail_akta_pendirian
        submitData.documents.thumbnail_akta_perubahan  = allData.data_usaha.perubahan ? allData.data_usaha.perubahan.photo_md : ''
      
        allData.data_usaha.company_doc.forEach((siupFile, idxSiup) => {
          thumbnail_siup_tdp_nib.push(siupFile.photo_md);
        });
        
        submitData.documents.thumbnail_business_npwp  = allData.data_usaha.npwp_manager ? allData.data_usaha.npwp_manager.photo_md : ''
        submitData.documents.thumbnail_siup_tdp_nib  = thumbnail_siup_tdp_nib
      }

      let endPoint = '/koinwork-first-submission'
      if(Object.keys(this.$route.query).includes('koinwork_id')){
        submitData.koinwork_id = this.$route.query.koinwork_id
        endPoint = '/koinwork-submission'
      }

      
      submitKoinworks(endPoint,submitData).then(response => {
        this.loadingSubmission = false
        this.dialogConfirmSubmit = false
        this.showSubmission = false
        this.isSubmit = false
        this.form = {
          submit_as: ''
        }
        this.$message({
          type: 'success',
          message: this.$lang[this.langId].success_apply_loan
        })
        let itemKoinwork = {
          photo: "http://externalapi.indociti.com/img/no_data_other.png",
          alias_name: "KoinWork",
        }
        this.$router.push({
          path: '/service-activation-v2/koinworks-history',
          query: {data: itemKoinwork}
        })
      }).catch(error => {
        this.loadingSubmission = false
        this.$message({
          type: 'error',
          message: error.string
        })
      })
    }
  }
}
</script>