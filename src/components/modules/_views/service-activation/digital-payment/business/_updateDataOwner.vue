<template>
  <div class="owner">
    <el-form
      :model="formData"
      :rules="rulesOwner"
      label-position="top"
      ref="data"
      @submit.native.prevent="handleNext">
      <div class="row equal-cols">
        <div class="col-xs-12 col-sm-5">
          <div class="owner-left-side" style="background-color: #F5F5F5;">
            <div class="font-18 pb-16">{{rootLang.required_photo}} (2)</div>
            <el-card class="box-card">
              <el-row>
                <el-col :xs="14" :sm="12" :md="12" :lg="16" :xl="16" align="left">
                  <p class="pt-24 pb-10 word-break"><span class="font-11" style="color: #F56C6C">*</span> {{rootLang.photo_director_id_card}}</p>
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
                        v-if="formData.thumbnail_ktp !== null"
                        :src="formData.thumbnail_ktp" alt=""
                      >
                      <i v-else class="el-icon-plus"></i>
                    </el-upload>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>
            <el-card class="box-card">
              <el-row>
                <el-col :xs="14" :sm="12" :md="12" :lg="16" :xl="16" align="left">
                  <p class="pt-24 pb-10 word-break">{{rootLang.photo_director_taxpayer_number}}</p>
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
                        v-if="formData.thumbnail_npwp !== null"
                        :src="formData.thumbnail_npwp" alt=""
                      >
                      <i v-else class="el-icon-plus"></i>
                    </el-upload>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-tag size="large"
                type="danger" class="w-fit break-word mt-10" style="color: #606266;">
                <el-row :gutter="10">
                  <el-col :md="2" style="padding: 2% 0 2% 1%;">
                    <svg-icon icon-class="information-circle" color="#f56c6c" style="font-size: large"></svg-icon>
                  </el-col>
                  <el-col :md="22" align="left" style="height: 30px;">
                    <span class="font-10 lh-3">{{$lang[langId].gopay_npwp_term}}</span>
                  </el-col>
                </el-row>
              </el-tag>
            </el-card>
          </div>
        </div>
        <div class="col-xs-12 col-sm-7">
          <div class="owner-right-side" style="background-color: #FFFFFF">
            <el-form-item :label="rootLang.name_based_idcard" prop="name">
              <el-input class="input-radius" v-model="formData.name" type="text" size="small" style="width: 100%"></el-input>
            </el-form-item>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="lang.email" prop="email">
                  <el-input class="input-radius" v-model="formData.email" type="email" size="small" style="width: 100%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="rootLang.phone_number" prop="phone">
                  <phone-number-input
                    v-model="phone"
                    :translations="{
                      countrySelectorLabel: '',
                      countrySelectorError: '',
                      phoneNumberLabel: '',
                      example: ''
                    }"
                    :only-countries="['ID', 'SG']"
                    default-country-code="ID"
                    @update="getPhone"
                    class="owner-phone-register"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="rootLang.id_card_number" prop="no_ktp">
                  <el-input class="input-radius" v-model="formData.no_ktp" type="text" size="small"
                    show-word-limit style="width: 100%" :maxlength="16" 
                    onkeydown="return ( event.ctrlKey || event.altKey 
                    || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                    || (95<event.keyCode && event.keyCode<106)
                    || (event.keyCode==8) || (event.keyCode==9) 
                    || (event.keyCode>34 && event.keyCode<40) 
                    || (event.keyCode==46) )"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="rootLang.taxpayer_number" prop="no_npwp">
                  <el-tooltip class="item" effect="dark" :content="rootLang.gopay_npwp_term" placement="bottom">
                    <el-input class="input-radius" size="small" v-model="formData.no_npwp" :maxlength="20"
                      onkeydown="return ( event.ctrlKey || event.altKey 
                          || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                          || (95<event.keyCode && event.keyCode<106)
                          || (event.keyCode==8) || (event.keyCode==9) 
                          || (event.keyCode>34 && event.keyCode<40) 
                          || (event.keyCode==46) )"
                          v-mask="'##.###.###.#-###.###'"/>
                  </el-tooltip>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item :label="rootLang.address_based_idcard" prop="address">
              <el-input class="input-radius" v-model="formData.address" type="text" size="small" style="width: 100%"></el-input>
            </el-form-item>
            <el-form-item :label="rootLang.npwp_address" prop="npwp_address">
              <el-input class="input-radius" v-model="formData.npwp_address" type="text" size="small" style="width: 100%"></el-input>
            </el-form-item>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="rootLang.sub_district">
                  <el-input class="input-radius" v-model="formData.sub_district" type="text" size="small" style="width: 100%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="rootLang.urban_village">
                  <el-input class="input-radius" v-model="formData.village" type="text" size="small" style="width: 100%"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="rootLang.neighbourhood">
                  <el-input class="input-radius" v-model="formData.rt" type="text" size="small"
                    style="width: 100%" onkeydown="return ( event.ctrlKey || event.altKey 
                    || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                    || (95<event.keyCode && event.keyCode<106)
                    || (event.keyCode==8) || (event.keyCode==9) 
                    || (event.keyCode>34 && event.keyCode<40) 
                    || (event.keyCode==46) )"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="rootLang.hamlet">
                  <el-input class="input-radius" v-model="formData.rw" type="text" size="small"
                    style="width: 100%" onkeydown="return ( event.ctrlKey || event.altKey 
                    || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                    || (95<event.keyCode && event.keyCode<106)
                    || (event.keyCode==8) || (event.keyCode==9) 
                    || (event.keyCode>34 && event.keyCode<40) 
                    || (event.keyCode==46) )"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-button @click="handleNext('branch')" class="visible-lg visible-md visible-sm" type="primary" style="width: 100%">
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
import { baseApi } from 'src/http-common.js';
import axios from 'axios';

export default {
  name: 'dataOwnerBusiness',
  mixins: [basicComputedMixin],
  props:{},

  computed: {
    headers() {
      return {
        'Authorization': 'Bearer ' + this.token.access_token
      }
    },
  },
  
  props: ['dataForm'],
  
  watch: {
    formData: {
      deep: true,
      immediate: true,
      handler(data) {
        this.$emit('change', {applicant: data})
      }
    },
  },
  
  data() {
    // let emailMatchCheck = (rule, value, callback) => { 
    //   if (this.$store.getters.loggedInUser.email !== this.formData.email) {
    //     return callback(new Error(this.$lang[this.$store.state.userStores.langId].email_must_match));
    //   }else{
    //     callback()
    //   }
    // }

    return{
      uploadPhotoUrl: '',
      uploadingKtp: false,
      uploadingNpwp: false,
      rulesOwner: {
        name: [
          {
            message: this.$store.state.userStores.lang.required,
            trigger: 'blur',
            required: true
          }
        ],
        email: [
          {
            message: this.$store.state.userStores.lang.required,
            trigger: 'blur',
            required: true
          },
          {
            message: this.$lang[this.$store.state.userStores.langId].input_email,
            trigger: 'blur',
            pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            required: true
          },
          // { validator: emailMatchCheck, trigger: 'blur' }
        ],
        no_ktp: [
          {
            message: this.$store.state.userStores.lang.required,
            trigger: 'blur',
            required: true,
          },
          {
            message: this.$lang[this.$store.state.userStores.langId].length_should_be_16,
            min: 16, max: 16,
            trigger: 'blur'
          }
        ],
        phone: [
          {
            message: this.$store.state.userStores.lang.required,
            trigger: 'blur',
            required: true
          }
        ],
        address: [
          {
            message: this.$store.state.userStores.lang.required,
            trigger: 'blur',
            required: true
          }
        ],
        no_npwp: [
          {
            message: this.$store.state.userStores.lang.required,
            trigger: 'blur',
            required: false
          }
        ],
        npwp_address: [
          {
            message: this.$store.state.userStores.lang.required,
            trigger: 'blur',
            required: false
          }
        ],
      },
      phone: '',
      formData: {
        name: '',
        email: '',
        phone: '',
        no_npwp: '',
        no_ktp: '',
        address: '',
        npwp_address: '',
        sub_district: '',
        village: '',
        rt: '',
        rw: '',
        thumbnail_ktp: null,
        thumbnail_npwp: null
      }
    }
  },

  mounted(){
    this.uploadPhotoUrl = baseApi(this.selectedStore.url_id, this.langId, 'activation/service/upload')
    this.getDataDiri()
  },

  methods: {
    getDataDiri(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let urlSite = 'activation/service/digital-payment?store_id='+this.dataForm.store_id+'&submit_as=2&submission=1'

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, urlSite ),
        headers: headers
      }).then(response => {
        let resp = response.data.data[0]

        this.formData = {
          name: resp.name,
          email: resp.email,
          phone: resp.phone.replace("+62", "0").replace("+65", "0"),
          no_npwp: resp.no_npwp,
          no_ktp: resp.no_ktp,
          address: resp.address,
          npwp_address: resp.npwp_address,
          sub_district: resp.sub_districts,
          village: resp.village,
          rt: resp.rt,
          rw: resp.rw,
          thumbnail_ktp: resp.thumbnail_ktp,
          thumbnail_npwp: resp.thumbnail_npwp
        }
        if(resp.thumbnail_npwp !== null){
          this.rulesOwner.npwp_address[0].required = true
          this.rulesOwner.no_npwp[0].required = true
        }
        this.phone = resp.phone.replace("+62", "0").replace("+65", "0")
      }).catch(error => {
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

    handleNext (){
      this.$emit('next', 'company', {applicant: this.formData})
    },

    beforeUpload(file) {
      const isJpg = file.type === 'image/jpeg'
      const isPng = file.type === 'image/png'
      if (!isJpg && !isPng) {
        this.$message.error(this.$lang[this.langId].error_upload_photo)
      }
      return isJpg || isPng
    },

    handleUploadIdCardProcess(){
      this.uploadingKtp = true
    },

    handleUploadIdCardSuccess(response, file, fileList) {
      this.formData.thumbnail_ktp = response[0].photo_md
      this.uploadingKtp = false
    },

    handleUploadNpwpProcess(){
      this.uploadingNpwp = true
    },

    handleUploadNpwpSuccess(response, file, fileList) {
      this.formData.thumbnail_npwp = response[0].photo_md
      this.rulesOwner.npwp_address[0].required = true
      this.rulesOwner.no_npwp[0].required = true
      this.uploadingNpwp = false
    },

    handleUploadError(err) {
      this.uploadingKtp = false
      this.uploadingNpwp = false
      this.$notify({
        type: 'warning',
        message: this.rootLang.file_too_large,
        title: 'Error'
      })
    },

    getPhone (value) {
      this.formData.phone = value.formattedNumber
    },
  }
}
</script>