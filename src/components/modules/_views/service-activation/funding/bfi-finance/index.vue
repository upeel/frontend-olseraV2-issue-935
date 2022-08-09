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
            <h4 class="dialog-title" align="left"><strong>{{rootLang.bfi_submission}}</strong></h4>
          </el-col>
          <el-col :span="10" align="right" class="pr-null">
            <el-row :gutter="20" style="width: 100%; display: inline-flex;">
              <el-col :span="20">
                <div v-if="form.submit_as === 1" class="font-18 pt-8 d-inline-flex">
                    <svg-icon icon-class="motorcycle" class="mr-8 mt-4"></svg-icon>
                    <span class="visible-lg visible-md visible-md">{{rootLang.motorcycle_guaranteed}}</span>
                </div>
                <div v-if="form.submit_as === 2" class="font-18 pt-8 d-inline-flex">
                    <svg-icon icon-class="car" class="mr-8 mt-4"></svg-icon>
                    <span class="visible-lg visible-md visible-md">{{rootLang.car_guaranteed}}</span>
                </div>
                <div v-if="form.submit_as === 3" class="font-18 pt-8 d-inline-flex">
                    <svg-icon icon-class="house" class="mr-8 mt-4"></svg-icon>
                    <span class="visible-lg visible-md visible-md">{{rootLang.house_guaranteed}}</span>
                </div>
                <div v-if="form.submit_as === 4" class="font-18 pt-8 d-inline-flex">
                    <svg-icon icon-class="user-man" class="mr-8 mt-4"></svg-icon>
                    <span class="visible-lg visible-md visible-md">{{rootLang.capital_without_guaranteed}}</span>
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

      <submision-form v-if="isSubmit" :type="typeSelected" @doneSubmission="handleApplySubmit"/>
      <submision-type v-else @onSubmit="selectSubmit" />
      <el-dialog
        width="30%"
        :title="rootLang.bfi_submission"
        :visible.sync="dialogConfirmSubmit"
        center append-to-body 
        :close-on-click-modal="false" 
        :show-close="false">
        <div class="text-center">
          <p>{{ rootLang.are_you_sure }}</p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showConfirm">{{ lang.cancel }}</el-button>
          <el-button class="color-bfi--bg color-bfi--border color-white"
           :disabled="loadingSubmission" :loading="loadingSubmission" 
           @click="handleSubmitFinal">{{ rootLang.submit }}</el-button>
        </span>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import submisionType from './_submisionType';
import submisionForm from './_submisionForm';
import basicComputedMixin from '@/mixins/basicComputedMixin';
import { submitBFI } from '@/api/thirdParty/bfi';

export default {
  name: 'dialogKoinworksubmission',
  mixins: [basicComputedMixin],

  components: {
    submisionType,
    submisionForm
  },
  props: {},

  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
  },

  data(){
    return{
      loadingSubmission: false,
      dialogConfirmSubmit: false,
      showSubmission: true,
      isSubmit: false,
      typeSelected: {},
      form: {
        submit_as: '',
      }
    }
  },

  methods: {
    selectSubmit(params, type){
      this.typeSelected = type
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
      let allDocuments = {}
      let thumbnail_file_bank = [];

      allData.fileBank.forEach((bankFile, idxFile) => {
        thumbnail_file_bank.push(bankFile.photo_md);
      });

      if(allData.submit_as === 1){
        allDocuments = {
          thumbnail_ktp: allData.fileIdCard.photo_md,
          thumbnail_ktp_pasangan: allData.fileIdCouple ? allData.fileIdCouple.photo_md : '',
          thumbnail_npwp: allData.fileNpwp.photo_md,
          thumbnail_bpkb_motor: allData.motorBPKB.photo_md,
          thumbnail_pbb_or_electrict_bill: allData.houseOwn.photo_md,
          thumbnail_kk: allData.fileFamilyRegister.photo_md,
          thumbnail_rekening_koran: thumbnail_file_bank,
        }
      }else if(allData.submit_as === 2){
        allDocuments = {
          thumbnail_ktp: allData.fileIdCard.photo_md,
          thumbnail_ktp_pasangan: allData.fileIdCouple ? allData.fileIdCouple.photo_md : '',
          thumbnail_npwp: allData.fileNpwp.photo_md,
          thumbnail_bpkb_mobil: allData.mobilBPKB.photo_md,
          thumbnail_pbb_or_electrict_bill: allData.houseOwn.photo_md,
          thumbnail_kk: allData.fileFamilyRegister.photo_md,
          thumbnail_rekening_koran: thumbnail_file_bank,
        }
      }else if(allData.submit_as === 3){
        allDocuments = {
          thumbnail_ktp: allData.fileIdCard.photo_md,
          thumbnail_ktp_pasangan: allData.fileIdCouple ? allData.fileIdCouple.photo_md : '',
          thumbnail_npwp: allData.fileNpwp.photo_md,
          thumbnail_home_certificate: allData.houseDoc.photo_md,
          thumbnail_pbb_or_electrict_bill: allData.houseOwn.photo_md,
          thumbnail_kk: allData.fileFamilyRegister.photo_md,
          thumbnail_rekening_koran: thumbnail_file_bank,
        }
      }else{
        allDocuments = {
          thumbnail_ktp: allData.fileIdCard.photo_md,
          thumbnail_npwp: allData.fileNpwp.photo_md,
          thumbnail_sampul_tabungan: allData.savingBook.photo_md,
          thumbnail_selfie_with_home: allData.houseSelfie.photo_md,
          thumbnail_olsera_profile: allData.olseraProfile.photo_md,
          thumbnail_kk: allData.fileFamilyRegister.photo_md,
          thumbnail_rekening_koran: thumbnail_file_bank,
        }
      }

      var submitData = {
        store_id: this.selectedStore.store_id,
        assurance_type: allData.submit_as-1,
        amount: allData.amount,
        tenor: allData.plafond,

        documents: allDocuments
      }

      let endPoint = '/bfi-first-submission'
      if(Object.keys(this.$route.query).includes('bfi_id')){
        submitData.bfi_id = this.$route.query.bfi_id
        endPoint = '/bfi-submission'
      }
      
      submitBFI(endPoint,submitData).then(response => {
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
        let itemBFI = {
          photo: "http://externalapi.indociti.com/img/no_data_other.png",
          alias_name: "BFI Finance",
        }
        this.$router.push({
          path: '/service-activation-v2/bfi-finance-history',
          query: {data: itemBFI}
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