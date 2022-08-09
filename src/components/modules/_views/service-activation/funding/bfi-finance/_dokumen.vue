<template>
  <div class="owner">
    <el-form
      :model="formData"
      label-position="top"
      ref="data"
      @submit.native.prevent="handleNext">
      <div class="row equal-cols">
        <div class="visible-lg visible-md visible-sm col-sm-6 pr-null">
          <div class="owner-left-side" style="background-color: #F5F5F5;">
            <div class="font-18 pb-16">{{rootLang.required_photo}} (7)</div>
            <el-card class="box-card">
              <el-row>
                <el-col :xs="14" :sm="12" :md="12" :lg="16" :xl="16" align="left">
                  <p class="pt-24 pb-10 word-break"><span class="font-11" style="color: #F56C6C">*</span> {{rootLang.photo_id_card_borrower}}</p>
                </el-col>
                <el-col :xs="10" :sm="12" :md="12" :lg="8" :xl="8">
                  <el-form-item class="mb-0" align="center">
                    <el-upload
                      v-loading="uploadingKtp"
                      :action="uploadPhotoUrl"
                      :headers="headers"
                      :before-upload="beforeUpload"
                      :show-file-list="false"
                      :on-progress="handleUploadIdCardProcess"
                      :on-success="handleUploadIdCardSuccess"
                      :on-error="handleUploadError"
                      list-type="picture-card"
                      >
                      <img
                        v-if="formData.fileIdCard !== null"
                        :src="formData.fileIdCard.photo_md" alt=""
                      >
                      <i v-else class="el-icon-camera"></i>
                    </el-upload>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>

            <el-card class="box-card" v-show="type.id !== 4">
              <el-row>
                <el-col :xs="14" :sm="12" :md="12" :lg="16" :xl="16" align="left">
                  <p class="pt-24 pb-10 word-break"> {{rootLang.photo_id_card_couple}}</p>
                </el-col>
                <el-col :xs="10" :sm="12" :md="12" :lg="8" :xl="8">
                  <el-form-item class="mb-0" align="center">
                    <el-upload
                      v-loading="uploadingIdCouple"
                      :action="uploadPhotoUrl"
                      :headers="headers"
                      :before-upload="beforeUpload"
                      :show-file-list="false"
                      :on-progress="handleUploadIdCoupleProcess"
                      :on-success="handleUploadIdCoupleSuccess"
                      :on-error="handleUploadError"
                      list-type="picture-card"
                      >
                      <img
                        v-if="formData.fileIdCouple !== null"
                        :src="formData.fileIdCouple.photo_md" alt=""
                      >
                      <i v-else class="el-icon-camera"></i>
                    </el-upload>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>

            <el-card class="box-card">
              <el-row>
                <el-col :xs="14" :sm="12" :md="12" :lg="16" :xl="16" align="left">
                  <p class="pt-24 pb-10 word-break"><span class="font-11" style="color: #F56C6C">*</span> {{rootLang.family_register}}</p>
                </el-col>
                <el-col :xs="10" :sm="12" :md="12" :lg="8" :xl="8">
                  <el-form-item class="mb-0" align="center">
                    <el-upload
                      v-loading="uploadingFamily"
                      list-type="picture-card"
                      :action="uploadPhotoUrl"
                      :headers="headers"
                      :show-file-list="false"
                      :before-upload="beforeUpload"
                      :on-progress="handleUploadFamilyProcess"
                      :on-success="handleUploadFamilySuccess"
                      :on-error="handleUploadError">
                      <img
                        v-if="formData.fileFamilyRegister !== null"
                        :src="formData.fileFamilyRegister.photo_md" alt=""
                      >
                      <i v-else class="el-icon-camera"></i>
                    </el-upload>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>

            <el-card class="box-card">
              <el-row>
                <el-col :xs="14" :sm="12" :md="12" :lg="16" :xl="16" align="left">
                  <p class="pt-24 pb-10 word-break"><span class="font-11" style="color: #F56C6C">*</span> {{rootLang.photo_taxpayer_number}}</p>
                </el-col>
                <el-col :xs="10" :sm="12" :md="12" :lg="8" :xl="8">
                  <el-form-item class="mb-0" align="center">
                    <el-upload
                      v-loading="uploadingNpwp"
                      list-type="picture-card"
                      :action="uploadPhotoUrl"
                      :headers="headers"
                      :show-file-list="false"
                      :before-upload="beforeUpload"
                      :on-progress="handleUploadNpwpProcess"
                      :on-success="handleUploadNpwpSuccess"
                      :on-error="handleUploadError">
                      <img
                        v-if="formData.fileNpwp !== null"
                        :src="formData.fileNpwp.photo_md" alt=""
                      >
                      <i v-else class="el-icon-camera"></i>
                    </el-upload>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>

            <el-card class="box-card">
              <el-row>
                <el-col :xs="14" :sm="12" :md="12" :lg="16" :xl="16" align="left">
                  <p class="pt-24 pb-10 word-break"><span class="font-11" style="color: #F56C6C">*</span> {{rootLang.statement_last_3_month}}</p>
                </el-col>
                <el-col :xs="10" :sm="12" :md="12" :lg="8" :xl="8">
                  <el-form-item class="mb-0" align="center">
                    <el-upload
                      :action="uploadPhotoUrl"
                      :headers="headers"
                      :before-upload="beforeUpload"
                      :show-file-list="false"
                      :on-progress="handleUploadBankProcess"
                      :on-success="handleUploadBankSuccess"
                      :on-error="handleUploadError"
                      list-type="upload-demo"
                      >
                      <div class="loadingUploadMultiple">
                        <loading v-if="uploadingBank" 
                          align="center"
                          :active="true"
                          color= '#1bb4e6'
                          loader="spinner"
                          :width="32"
                          :height="32"
                          backgroundColor='#ffffff'>
                        </loading>
                        <i v-else class="el-icon-plus"></i>
                      </div>
                    </el-upload>
                    <div class="remove-image-area mt-10" v-for="(file, keyFile) in formData.fileBank" :key="keyFile">
                      <img :src="file.photo_md" alt="">
                      <div class="remove-image">
                        <span
                          style="position: static; font-size: inherit; color: inherit;"
                          @click="handleRemoveFileBank(keyFile)"
                        >
                          <i class="el-icon-delete"></i>
                        </span>
                      </div>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>
            
            <el-card class="box-card" v-show="type.id === 1">
              <el-row>
                <el-col :xs="14" :sm="12" :md="12" :lg="16" :xl="16" align="left">
                  <p class="pt-24 pb-10 word-break"><span class="font-11" style="color: #F56C6C">*</span> {{rootLang.photo_motorcycle_doc}}</p>
                </el-col>
                <el-col :xs="10" :sm="12" :md="12" :lg="8" :xl="8">
                  <el-form-item class="mb-0" align="center">
                    <el-upload
                      v-loading="uploadingMotorBPKB"
                      list-type="picture-card"
                      :action="uploadPhotoUrl"
                      :headers="headers"
                      :show-file-list="false"
                      :before-upload="beforeUpload"
                      :on-progress="uploadMotorBPKBProcess"
                      :on-success="uploadMotorBPKBSuccess"
                      :on-error="handleUploadError">
                      <img
                        v-if="formData.motorBPKB !== null"
                        :src="formData.motorBPKB.photo_md" alt=""
                      >
                      <i v-else class="el-icon-camera"></i>
                    </el-upload>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>

            <el-card class="box-card" v-show="type.id === 2">
              <el-row>
                <el-col :xs="14" :sm="12" :md="12" :lg="16" :xl="16" align="left">
                  <p class="pt-24 pb-10 word-break"><span class="font-11" style="color: #F56C6C">*</span> {{rootLang.photo_car_doc}}</p>
                </el-col>
                <el-col :xs="10" :sm="12" :md="12" :lg="8" :xl="8">
                  <el-form-item class="mb-0" align="center">
                    <el-upload
                      v-loading="uploadingMobilBPKB"
                      list-type="picture-card"
                      :action="uploadPhotoUrl"
                      :headers="headers"
                      :show-file-list="false"
                      :before-upload="beforeUpload"
                      :on-progress="uploadMobilBPKBProcess"
                      :on-success="uploadMobilBPKBSuccess"
                      :on-error="handleUploadError">
                      <img
                        v-if="formData.mobilBPKB !== null"
                        :src="formData.mobilBPKB.photo_md" alt=""
                      >
                      <i v-else class="el-icon-camera"></i>
                    </el-upload>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>

            <el-card class="box-card" v-show="type.id === 3">
              <el-row>
                <el-col :xs="14" :sm="12" :md="12" :lg="16" :xl="16" align="left">
                  <p class="pt-24 pb-10 word-break"><span class="font-11" style="color: #F56C6C">*</span> {{rootLang.photo_house_doc}}</p>
                </el-col>
                <el-col :xs="10" :sm="12" :md="12" :lg="8" :xl="8">
                  <el-form-item class="mb-0" align="center">
                    <el-upload
                      v-loading="uploadingHouseDoc"
                      list-type="picture-card"
                      :action="uploadPhotoUrl"
                      :headers="headers"
                      :show-file-list="false"
                      :before-upload="beforeUpload"
                      :on-progress="uploadHouseDocProcess"
                      :on-success="uploadHouseDocSuccess"
                      :on-error="handleUploadError">
                      <img
                        v-if="formData.houseDoc !== null"
                        :src="formData.houseDoc.photo_md" alt=""
                      >
                      <i v-else class="el-icon-camera"></i>
                    </el-upload>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>

            <el-card class="box-card" v-show="type.id !== 4">
              <el-row>
                <el-col :xs="14" :sm="12" :md="12" :lg="16" :xl="16" align="left">
                  <p class="pt-24 pb-10 word-break"><span class="font-11" style="color: #F56C6C">*</span> {{rootLang.house_ownership}}</p>
                </el-col>
                <el-col :xs="10" :sm="12" :md="12" :lg="8" :xl="8">
                  <el-form-item class="mb-0" align="center">
                    <el-upload
                      v-loading="uploadingHouseOwn"
                      :action="uploadPhotoUrl"
                      :headers="headers"
                      :before-upload="beforeUpload"
                      :show-file-list="false"
                      :on-progress="uploadHouseOwnProcess"
                      :on-success="uploadHouseOwnSuccess"
                      :on-error="handleUploadError"
                      list-type="picture-card"
                      >
                      <img
                        v-if="formData.houseOwn !== null"
                        :src="formData.houseOwn.photo_md" alt=""
                      >
                      <i v-else class="el-icon-camera"></i>
                    </el-upload>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>

            <el-card class="box-card" v-show="type.id === 4">
              <el-row>
                <el-col :xs="14" :sm="12" :md="12" :lg="16" :xl="16" align="left">
                  <p class="pt-24 pb-10 word-break"><span class="font-11" style="color: #F56C6C">*</span> {{rootLang.photo_saving_cover_book}}</p>
                </el-col>
                <el-col :xs="10" :sm="12" :md="12" :lg="8" :xl="8">
                  <el-form-item class="mb-0" align="center">
                    <el-upload
                      v-loading="uploadingSavingBook"
                      :action="uploadPhotoUrl"
                      :headers="headers"
                      :before-upload="beforeUpload"
                      :show-file-list="false"
                      :on-progress="uploadSavingBookProcess"
                      :on-success="uploadSavingBookSuccess"
                      :on-error="handleUploadError"
                      list-type="picture-card"
                      >
                      <img
                        v-if="formData.savingBook !== null"
                        :src="formData.savingBook.photo_md" alt=""
                      >
                      <i v-else class="el-icon-camera"></i>
                    </el-upload>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>

            <el-card class="box-card" v-show="type.id === 4">
              <el-row>
                <el-col :xs="14" :sm="12" :md="12" :lg="16" :xl="16" align="left">
                  <p class="pt-24 pb-10 word-break"><span class="font-11" style="color: #F56C6C">*</span> {{rootLang.photo_house_selfie}}</p>
                </el-col>
                <el-col :xs="10" :sm="12" :md="12" :lg="8" :xl="8">
                  <el-form-item class="mb-0" align="center">
                    <el-upload
                      v-loading="uploadingHouseSelfie"
                      :action="uploadPhotoUrl"
                      :headers="headers"
                      :before-upload="beforeUpload"
                      :show-file-list="false"
                      :on-progress="uploadHouseSelfiProcess"
                      :on-success="uploadHouseSelfiSuccess"
                      :on-error="handleUploadError"
                      list-type="picture-card"
                      >
                      <img
                        v-if="formData.houseSelfie !== null"
                        :src="formData.houseSelfie.photo_md" alt=""
                      >
                      <i v-else class="el-icon-camera"></i>
                    </el-upload>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>

            <el-card class="box-card" v-show="type.id === 4">
              <el-row>
                <el-col :xs="14" :sm="12" :md="12" :lg="16" :xl="16" align="left">
                  <p class="pt-24 pb-10 word-break"><span class="font-11" style="color: #F56C6C">*</span> {{rootLang.olsera_profile_ss}}</p>
                </el-col>
                <el-col :xs="10" :sm="12" :md="12" :lg="8" :xl="8">
                  <el-form-item class="mb-0" align="center">
                    <el-upload
                      v-loading="uploadingOlseraProfile"
                      :action="uploadPhotoUrl"
                      :headers="headers"
                      :before-upload="beforeUpload"
                      :show-file-list="false"
                      :on-progress="uploadOlseraProfileProcess"
                      :on-success="uploadOlseraProfileSuccess"
                      :on-error="handleUploadError"
                      list-type="picture-card"
                      >
                      <img
                        v-if="formData.olseraProfile !== null"
                        :src="formData.olseraProfile.photo_md" alt=""
                      >
                      <i v-else class="el-icon-camera"></i>
                    </el-upload>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>
          </div>
        </div>
        <div class="col-xs-12 col-sm-6 pl-null">
          <div class="owner-right-side" style="background-color: #FFFFFF; padding: 20px;">
            <h3 class="mb-24">{{rootLang.jumlah_pinjaman}}</h3>
            <el-form-item prop="amount">
              <el-slider
                v-model="formData.amount"
                @change="instalmentCalc"
                :min=" type.minAmount"
                :max="type.maxAmount"
                :step="1000000"
              />
              <input-money
                size="small"
                style="border: none;"
                v-model="formData.amount"
                @focus="minAmount = 0"
                @change="instalmentCalc"
                :minValue="type.minAmount"
                :maxValue="type.maxAmount"
              />
            </el-form-item>
            <el-form-item :label="rootLang.asked_term_loan" prop="plafond">
              <el-input v-model="formData.plafond" @change="instalmentCalc"
                onkeydown="return ( event.ctrlKey || event.altKey 
                          || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                          || (95<event.keyCode && event.keyCode<106)
                          || (event.keyCode==8) || (event.keyCode==9) 
                          || (event.keyCode>34 && event.keyCode<40) 
                          || (event.keyCode==46) )"
                size="small" style="width: 100%"
                >
                <template slot="append">{{rootLang.months}}</template> 
              </el-input>
            </el-form-item>

            <el-form-item
              :label="rootLang.loan_purpose"
              size="small"
              prop="purpose">
              <el-input :value="$lang[langId].addition_capital" readonly
                size="small" style="width: 100%">
              </el-input>
              <!-- <el-select
                v-model="formData.purpose"
                :placeholder="$lang[langId].select"
                size="small"
                style="width: 100%">
                <el-option
                  v-for="item in listPurpose"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  >
                </el-option>
              </el-select> -->
            </el-form-item>

            <el-tag size="large"
              type="info" class="w-fit break-word mb-24" style="color: #606266;">
              <el-row :gutter="10">
                <el-col :md="2" :sm="2" :xs="4">
                  <svg-icon icon-class="accounting_ico"></svg-icon>
                </el-col>
                <el-col :md="22" :sm="22" :xs="20" align="left">
                  <span class="font-10" v-loading="loadingCall">
                    {{ $lang[langId].idr_installment +' '+ formatPrice(installment)}}
                  </span>
                </el-col>
              </el-row>
            </el-tag>

            <el-button @click="handleNext()" 
              class="visible-lg visible-md visible-sm absolute-bottom btn-block color-bfi--bg color-bfi--border color-white"
              style="width: 88%">
              {{$lang[langId].next}} <svg-icon icon-class="arrow-right"></svg-icon>
            </el-button>

            <el-button @click="handleNext()" 
              class="visible-xs absolute-bottom btn-block color-bfi--bg color-bfi--border color-white"
              style="width: 88%">
              {{$lang[langId].next}} <svg-icon icon-class="arrow-right"></svg-icon>
            </el-button>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin';
import mixinAccounting from '@/mixins/mixinAccounting';
import InputMoney from '@/components/InputMoneyV2';
import { installCall } from '@/api/thirdParty/koinworks';
import { baseApi, HTTP } from 'src/http-common.js';
import Loading from 'vue-loading-overlay';
export default {
  name: 'jumlahPinjamanIndividual',
  mixins: [basicComputedMixin, mixinAccounting],
  components: {
    InputMoney,
    Loading
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
    headers() {
      return {
        'Authorization': 'Bearer ' + this.token.access_token
      }
    },
    
    loggedInUser() {
      return this.$store.getters.loggedInUser
    },
  },
  props: {
    type: {
      type: Object,
      default: null
    }
  },
  
  watch: {
    formData: {
      deep: true,
      immediate: true,
      handler(data) {
        this.$emit('change', data)
      }
    },
  },
  
  data() {
    return{
      uploadPhotoUrl: '',
      loadingCall: false,
      uploadingKtp: false,
      uploadingIdCouple: false,
      uploadingBank: false,
      uploadingSavingBook: false,
      uploadingFamily: false,
      uploadingNpwp: false,
      uploadingMotorBPKB: false,
      uploadingMobilBPKB: false,
      uploadingHouseDoc: false,
      uploadingHouseOwn: false,
      uploadingHouseSelfie: false,
      uploadingOlseraProfile: false,
      rulesOwner: {},
      listPurpose: [
        {id: 1, name: this.$lang[this.$store.state.userStores.langId].business_dev},
        {id: 2, name: this.$lang[this.$store.state.userStores.langId].addition_capital},
        {id: 3, name: this.$lang[this.$store.state.userStores.langId].stock_purchase},
        {id: 4, name: this.$lang[this.$store.state.userStores.langId].refinancing},
        {id: 5, name: this.$lang[this.$store.state.userStores.langId].cash_financing}
      ],
      formData: {
        amount: this.type.minAmount,
        plafond: 6,
        purpose: 1,
        fileIdCard: null,
        fileIdCouple: null,
        fileFamilyRegister: null,
        fileBank: null,
        savingBook: null,
        fileNpwp: null,
        motorBPKB: null,
        mobilBPKB: null,
        houseDoc: null,
        houseOwn: null,
        houseSelfie: null,
        olseraProfile: null
      },
      installment: ''
    }
  },
  mounted(){
    this.instalmentCalc()
    this.simulationCalc()
    this.uploadPhotoUrl = baseApi(this.selectedStore.url_id, this.langId, 'activation/service/upload')
  },
  methods: {
    inputPlafond(val){
      this.formData.plafond = val
    },
    instalmentCalc(){
      this.loadingCall = true
      if(this.formData.plafond < this.type.minPlafond){
        this.formData.plafond = this.type.minPlafond
      }
      if(this.formData.plafond > this.type.maxPlafond){
        this.formData.plafond = this.type.maxPlafond
      }
      if(this.formData.amount < this.type.minAmount){
        this.formData.amount = this.type.minAmount
        this.minAmount =  this.type.minAmount
      }
      if(this.formData.amount > this.type.maxAmount){
        this.formData.amount = this.type.maxAmount
        this.minAmount =  this.type.minAmount
      }
      let data = {
        amount: this.formData.amount,
        tenor: this.formData.plafond
      }
      installCall(data).then(async response => {
        this.installment = response.data.data.installment
        this.loadingCall = false
      }).catch(error => {
        this.loadingCall = false
        this.$message({
          type: 'error',
          message: error.string
        })
      })
    },
    simulationCalc(){
      let simulation = this.$route.query.amountTenor
      this.formData.amount = simulation.amount > this.type.maxAmount ? this.type.maxAmount : simulation.amount
      this.formData.plafond = parseInt(simulation.tenor) > this.type.maxPlafond ? this.type.maxPlafond : simulation.tenor
    },
    
    beforeUpload(file) {
      const isJpg = file.type === 'image/jpeg'
      const isPng = file.type === 'image/png'
      if (!isJpg && !isPng) {
        this.$message.error(this.$lang[this.langId].error_upload_photo)
      }
      return isJpg || isPng
    },
    handleUploadError(err) {
      this.uploadingKtp = false
      this.uploadingFamily = false
      this.$notify({
        type: 'warning',
        message: this.rootLang.file_too_large,
        title: 'Error'
      })
    },
    handleUploadIdCardProcess(){
      this.uploadingKtp = true
    },
    handleUploadIdCardSuccess(response, file, fileList) {
      this.formData.fileIdCard = response[0]
      this.uploadingKtp = false
    },
    handleUploadIdCoupleProcess(){
      this.uploadingIdCouple = true
    },
    handleUploadIdCoupleSuccess(response, file, fileList) {
      this.formData.fileIdCouple = response[0]
      this.uploadingIdCouple = false
    },
    handleUploadFamilyProcess(){
      this.uploadingFamily = true
    },
    handleUploadFamilySuccess(response, file, fileList) {
      this.formData.fileFamilyRegister = response[0]
      this.uploadingFamily = false
    },
    handleUploadBankProcess(){
      this.uploadingBank = true
    },
    handleUploadBankSuccess(response, file, fileList) {
      var dataFile = this.formData.fileBank ? this.formData.fileBank : []
      this.formData.fileBank = dataFile ? dataFile.concat(response[0]) : dataFile.push(response[0])
      this.uploadingBank = false
    },
    handleRemoveFileBank(keyRemove) {
      this.formData.fileBank.splice(keyRemove, 1)
    },
    uploadSavingBookProcess(){
      this.uploadingBank = true
    },
    uploadSavingBookSuccess(response, file, fileList) {
      this.formData.savingBook = response[0]
      this.uploadingBank = false
    },
    handleUploadNpwpProcess(){
      this.uploadingNpwp = true
    },
    handleUploadNpwpSuccess(response, file, fileList) {
      this.formData.fileNpwp = response[0]
      this.uploadingNpwp = false
    },
    uploadMotorBPKBProcess(){
      this.uploadingMotorBPKB = true
    },
    uploadMotorBPKBSuccess(response, file, fileList) {
      this.formData.motorBPKB = response[0]
      this.uploadingMotorBPKB = false
    },
    uploadMobilBPKBProcess(){
      this.uploadingMobilBPKB = true
    },
    uploadMobilBPKBSuccess(response, file, fileList) {
      this.formData.mobilBPKB = response[0]
      this.uploadingMobilBPKB = false
    },
    uploadHouseDocProcess(){
      this.uploadingHouseDoc = true
    },
    uploadHouseDocSuccess(response, file, fileList) {
      this.formData.houseDoc = response[0]
      this.uploadingHouseDoc = false
    },
    uploadHouseOwnProcess(){
      this.uploadingHouseOwn = true
    },
    uploadHouseOwnSuccess(response, file, fileList){
      this.formData.houseOwn = response[0]
      this.uploadingHouseOwn = false
    },
    uploadHouseSelfiProcess(){
      this.uploadingHouseSelfie = true
    },
    uploadHouseSelfiSuccess(response, file, fileList){
      this.formData.houseSelfie = response[0]
      this.uploadingHouseSelfie = false
    },
    uploadOlseraProfileProcess(){
      this.uploadingOlseraProfile = true
    },
    uploadOlseraProfileSuccess(response, file, fileList){
      this.formData.olseraProfile = response[0]
      this.uploadingOlseraProfile = false
    },
    handleNext (){
      this.$emit('next', 1)
    },
    validateMotor(){
      let validate = false
        // fileIdCard: null,
        // fileFamilyRegister: null,
        // fileBank: null,
        // fileNpwp: null,
        // motorBPKB: null,
        // houseOwn: null,
      if(this.formData.plafond && this.formData.plafond !== '0' && this.formData.fileIdCard &&
        this.formData.fileFamilyRegister && this.formData.fileBank && this.formData.fileNpwp &&
        this.formData.motorBPKB && this.formData.houseOwn
      ){
        validate = true
      }
      return validate;
    },
    validateMobil(){
      let validate = false
        // fileIdCard: null,
        // fileFamilyRegister: null,
        // fileBank: null,
        // fileNpwp: null,
        // mobilBPKB: null,
        // houseOwn: null,
      if(this.formData.plafond && this.formData.plafond !== '0' && this.formData.fileIdCard &&
        this.formData.fileFamilyRegister && this.formData.fileBank && this.formData.fileNpwp &&
        this.formData.mobilBPKB && this.formData.houseOwn
      ){
        validate = true
      }
      return validate;
    },
    validateRumah(){
      let validate = false
        // fileIdCard: null,
        // fileFamilyRegister: null,
        // fileBank: null,
        // fileNpwp: null,
        // houseDoc: null,
        // houseOwn: null,
      if(this.formData.plafond && this.formData.plafond !== '0' && this.formData.fileIdCard &&
        this.formData.fileFamilyRegister && this.formData.fileBank && this.formData.fileNpwp &&
        this.formData.houseDoc && this.formData.houseOwn
      ){
        validate = true
      }
      return validate;
    },
    validateTanpaJaminan(){
      let validate = false
        // fileIdCard: null,
        // fileFamilyRegister: null,
        // fileBank: null,
        // savingBook: null,
        // fileNpwp: null,
        // houseSelfie: null,
        // olseraProfile: null
      if(this.formData.plafond && this.formData.plafond !== '0' && this.formData.fileIdCard &&
        this.formData.fileFamilyRegister && this.formData.fileBank && this.formData.fileNpwp &&
        this.formData.savingBook && this.formData.houseSelfie && this.formData.olseraProfile
      ){
        validate = true
      }
      return validate;
    }
  }
}
</script>