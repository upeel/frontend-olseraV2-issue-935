<template>
  <div class="owner">
    <el-form
      :model="formData"
      :rules="rulesOwner"
      label-position="top"
      ref="data"
      @submit.native.prevent="handleNext">
      <div class="row equal-cols">
        <div class="col-xs-12 col-sm-6 pr-null">
          <div class="owner-left-side">
            <div class="font-18 pb-16">{{rootLang.required_photo}} (2)</div>
            <el-card class="box-card">
              <el-row>
                <el-col :xs="14" :sm="12" :md="12" :lg="16" :xl="16" align="left">
                  <p class="pt-24 pb-10 word-break"><span class="font-11" style="color: #F56C6C">*</span> {{rootLang.your_id_and_company}} ({{rootLang.can_more_than1}})</p>
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
            <el-card class="box-card">
              <el-row>
                <el-col :xs="14" :sm="12" :md="12" :lg="16" :xl="16" align="left">
                  <p class="pt-24 pb-10 word-break"><span class="font-11" style="color: #F56C6C">*</span> {{rootLang.photo_family_register}}</p>
                </el-col>
                <el-col :xs="10" :sm="12" :md="12" :lg="8" :xl="8">
                  <el-form-item class="mb-0" align="center">
                    <el-upload
                      v-loading="uploadingFamily"
                      :action="uploadPhotoUrl"
                      :headers="headers"
                      :before-upload="beforeUpload"
                      :show-file-list="false"
                      :on-progress="handleUploadFamilyProcess"
                      :on-success="handleUploadFamilySuccess"
                      :on-error="handleUploadError"
                      list-type="picture-card"
                      >
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
          </div>
        </div>
        <div class="col-xs-12 col-sm-6 pl-null">
          <div class="owner-right-side" style="background-color: #FFFFFF; padding: 20px;">
            <el-form-item :label="rootLang.name_based_idcard" prop="name">
              <el-input v-model="formData.name" type="text" size="small" style="width: 100%"></el-input>
            </el-form-item>

            <el-form-item :label="rootLang.id_card_number" prop="id_card_number">
              <el-input v-model="formData.id_card_number"
                :readonly="readIdCard < 16 ? false : true"
                size="small"
                show-word-limit
                type="text"
                style="width: 100%" :maxlength="16" onkeydown="return ( event.ctrlKey || event.altKey 
                || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                || (95<event.keyCode && event.keyCode<106)
                || (event.keyCode==8) || (event.keyCode==9) 
                || (event.keyCode>34 && event.keyCode<40) 
                || (event.keyCode==46) )"
                ></el-input>
            </el-form-item>

            <el-form-item
              :label="rootLang.gender"
              prop="gender">
              <el-radio-group
                v-model="formData.gender"
                size="small"
                class="el-radio-group__flex">
                <el-radio-button
                  v-for="(item, key) in genderOptions"
                  :key="key"
                  :label="item.value">
                  {{ item.label }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item prop="email">
                  <el-form-item
                    label="Email"
                    size="medium"
                    prop="email">
                    <el-input
                      v-model="formData.email"
                      size="small"
                      type="email"
                    />
                  </el-form-item>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="rootLang.phone_number" prop="phone_number">
                  <!-- <el-input class="input-radius" v-model="formData.phone_number" type="text" size="small" style="width: 100%"></el-input> -->
                  <phone-number-input
                    v-model="phone_number"
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

            <h4>{{lang.address}}</h4>
            <el-form-item :label="lang.address" prop="address">
              <el-input v-model="formData.address" size="small" type="text" style="width: 100%"></el-input>
            </el-form-item>

            <el-row :gutter="20">
              <el-col :md="12">
                <el-form-item :label="rootLang.province" prop="provinsi">
                  <el-select
                    v-model="formData.provinsi" 
                    :placeholder="$lang[langId].select" 
                    @change="handleSelected('state', formData.provinsi)"
                    v-loading="loadingState"
                    filterable
                    size="small"
                    style="width: 100%">
                    <el-option
                      v-for="item in stateCity"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                      >
                    </el-option>
                    <el-option v-if="moreState" :value="0" style="background: #767676; color: #F5F5F5;">
                      <span style="font-size: 13px; margin-right: 10px; float: left">
                        <el-button type="text" icon="el-icon-more" size="mini" style="color: #F5F5F5;"></el-button>
                      </span>
                      <span>{{ $lang[langId].load_more }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item :label="rootLang.city_district" prop="kabupaten">
                  <el-select
                    v-model="formData.kabupaten" 
                    :placeholder="$lang[langId].select" 
                    @change="handleSelected('city', formData.kabupaten)"
                    v-loading="loadingCities"
                    filterable
                    size="small"
                    style="width: 100%">
                    <el-option
                      v-for="item in cities"
                      :key="item.id"
                      :label="item.city"
                      :value="item.id"
                      >
                    </el-option>
                    <el-option v-if="moreCity" :value="0" style="background: #767676; color: #F5F5F5;">
                      <span style="font-size: 13px; margin-right: 10px; float: left">
                        <el-button type="text" icon="el-icon-more" size="mini" style="color: #F5F5F5;"></el-button>
                      </span>
                      <span>{{ $lang[langId].load_more }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item :label="rootLang.sub_district" prop="kecamatan">
                  <el-select
                    v-model="formData.kecamatan" 
                    :placeholder="$lang[langId].select"
                    v-loading="loadingSubDistrict"
                    filterable
                    size="small"
                    @change="handleSelected('subDistrict', formData.kecamatan)"
                    style="width: 100%">
                    <el-option
                      v-for="item in subDistrict"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                      >
                    </el-option>
                    <el-option v-if="moreSubDistrict" :value="0" style="background: #767676; color: #F5F5F5;">
                      <span style="font-size: 13px; margin-right: 10px; float: left">
                        <el-button type="text" icon="el-icon-more" size="mini" style="color: #F5F5F5;"></el-button>
                      </span>
                      <span>{{ $lang[langId].load_more }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item :label="lang.postal_code" prop="kode_pos">
                  <el-input v-model="formData.kode_pos" size="small" onkeydown="return ( event.ctrlKey || event.altKey 
                        || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                        || (95<event.keyCode && event.keyCode<106)
                        || (event.keyCode==8) || (event.keyCode==9) 
                        || (event.keyCode>34 && event.keyCode<40) 
                        || (event.keyCode==46) )"/>
                </el-form-item>
              </el-col>
            </el-row>

            <el-button @click="handleNext()" 
              class="btn-block color-koinworks--bg color-koinworks--border color-white"
              >
              {{$lang[langId].next}} <svg-icon icon-class="arrow-right"></svg-icon>
            </el-button>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import { userData } from '@/api/thirdParty/koinworks'
import basicComputedMixin from '@/mixins/basicComputedMixin';
import { baseApi, HTTP } from 'src/http-common.js';
import InputMoney from '@/components/InputMoneyV2'
export default {
  name: 'dataOwnerIndividual',
  mixins: [basicComputedMixin],
  props:{},
  components: {
    InputMoney
  },
  computed: {
    headers() {
      return {
        'Authorization': 'Bearer ' + this.token.access_token
      }
    },
    genderOptions() {
      return [
        {
          value: 'M',
          label: this.$lang[this.$store.state.userStores.langId].male
        },
        {
          value: 'F',
          label: this.$lang[this.$store.state.userStores.langId].female
        }
      ]
    },
    
    loggedInUser() {
      return this.$store.getters.loggedInUser
    },
  },
  
  watch: {
    formData: {
      deep: true,
      immediate: true,
      handler(data) {
        this.$emit('change', {owner: data})
      }
    },
  },
  
  data() {
    return{
      uploadPhotoUrl: '',
      uploadingKtp: false,
      uploadingFamily: false,
      stateCity: [],
      cities: [],
      subDistrict: [],
      rulesOwner: {
        name: [
          {
            message: this.$store.state.userStores.lang.required,
            trigger: 'blur',
            required: true
          }
        ],
        phone_number: [
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
          }
        ],
        id_card_number: [
          {
            message: this.$store.state.userStores.lang.required,
            trigger: 'blur',
            required: true
          }
        ],
        gender: [
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
        // provinsi: [
        //   {
        //     message: this.$store.state.userStores.lang.required,
        //     trigger: 'blur',
        //     required: true
        //   }
        // ],
        // kabupaten: [
        //   {
        //     message: this.$store.state.userStores.lang.required,
        //     trigger: 'blur',
        //     required: true
        //   }
        // ],
        // kecamatan: [
        //   {
        //     message: this.$store.state.userStores.lang.required,
        //     trigger: 'blur',
        //     required: true
        //   }
        // ],
        // kode_pos: [
        //   {
        //     message: this.$store.state.userStores.lang.required,
        //     trigger: 'blur',
        //     required: true
        //   }
        // ],
      },
      readIdCard: 0,
      phone_number: '',
      moreState: null,
      moreSubDistrict: null,
      moreCity: null,
      loadingState: false,
      loadingCities: false,
      loadingSubDistrict: false,
      formData: {
          name: '',
          phone_number: '',
          email: '',
          id_card_number: '',
          address: '',
          gender: 'M',
          provinsi: '',
          kabupaten: '',
          kecamatan: '',
          provinsi_name: '',
          kabupaten_name: '',
          kecamatan_name: '',
          fileIdCard: null,
          fileFamilyRegister: null,
      }
    }
  },
  mounted(){
    this.getUserData()
    this.getStateCity()
    this.uploadPhotoUrl = baseApi(this.selectedStore.url_id, this.langId, 'activation/service/upload')
  },
  methods: {
    getUserData(){
      userData().then(async response => {
        let resp = response.data.data
        this.phone_number = resp.mobile.replace("+62", "0").replace("+65", "0")
        this.readIdCard = resp.store.ktp_number !== null ? resp.store.ktp_number.length : 0
        this.formData = {
          name: resp.name,
          phone_number: resp.mobile.replace("+62", "0").replace("+65", "0"),
          email: resp.email,
          id_card_number: resp.store.ktp_number !== null ? resp.store.ktp_number : '',
          address: resp.store.address,
          gender: resp.store.gender !== null ? resp.store.gender : '',
          provinsi: '',
          kabupaten: '',
          kecamatan: '',
          provinsi_name: '',
          kabupaten_name: '',
          kecamatan_name: '',
          fileIdCard: null,
          fileIdCouple: null,
          fileFamilyRegister: null,
          fileNpwp: null
        }
      }).catch(error => {
        this.loadingCall = false
        this.$message({
          type: 'error',
          message: error.string
        })
      })
    },
    inputPlafond(val){
      this.formData.plafond = val
    },
    handleNext (){
      this.$emit('next', 0)
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
      this.formData.fileIdCard = response[0]
      this.uploadingKtp = false
    },
    handleUploadFamilyProcess(){
      this.uploadingFamily = true
    },
    handleUploadFamilySuccess(response, file, fileList) {
      this.formData.fileFamilyRegister = response[0]
      this.uploadingFamily = false
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
    getPhone (value) {
      this.formData.phone_number = value.formattedNumber
    },
    getStateCity(val) {
      this.loadingState = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        // search_column: 'country_id',
        // search_operator: '=',
        per_page: 100
      }
      // if (val) {
      //   this.$set(params, 'search_text', val)
      // } else {
      //   this.$set(params, 'search_text', 0)
      // }
      HTTP({
        method: 'GET',
        url: '/getstate',
        headers: headers,
        params: params
      }).then(response => {
        this.stateCity = response.data.data
        this.moreState = response.data.links.next
        this.loadingState = false
      }).catch(error => {
        this.loadingState = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    getCity(val) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search_column: 'state_id',
        search_operator: '=',
        per_page: 100
      }
      if (val) {
        this.$set(params, 'search_text', val)
      } else {
        this.$set(params, 'search_text', 0)
      }
      HTTP({
        method: 'GET',
        url: '/getcity',
        headers: headers,
        params: params
      }).then(response => {
        this.cities = response.data.data
        this.moreCity = response.data.links.next
                
        this.loadingCities = false
        this.loadingSubDistrict = false
      }).catch(error => {
        this.loadingCities = false
        this.loadingSubDistrict = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    getSubDistrict(val) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search_column: 'city_id',
        search_operator: '=',
        per_page: 100
      }
      if (val) {
        this.$set(params, 'search_text', val)
      } else {
        this.$set(params, 'search_text', 0)
      }
      HTTP({
        method: 'GET',
        url: '/api/getsubdistrict',
        headers: headers,
        params: params
      }).then(response => {
        this.subDistrict = response.data.data
        this.moreSubDistrict = response.data.links.next
        this.loadingSubDistrict = false
      }).catch(error => {
        this.loadingSubDistrict = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    handleSelected(block, val) {
      if (block === 'state') {
        if(val === 0){
          this.loadingState = true
          this.loadMore(block, this.moreState)
        }else{
          this.loadingCities = true
          this.cities = []
          this.subDistrict = []
          this.stateCity.forEach((item, no) => {
            if(item.id === val){
              this.formData.provinsi_name = item.name
            }
          })
          this.formData.kabupaten_name = ''
          this.formData.kecamatan_name = ''
          delete this.formData.kabupaten
          delete this.formData.kecamatan
          this.getCity(val)
        }
      } else if (block === 'city') {
        if(val === 0){
          this.loadingCities = true
          this.loadMore(block, this.moreCity)
        }else{
          this.loadingSubDistrict = true
          this.cities.forEach((item, no) => {
            if(item.id === val){
              this.formData.kabupaten_name = item.city
            }
          })
          this.formData.kecamatan_name = ''
          this.subDistrict = []
          delete this.formData.kecamatan
          this.getSubDistrict(val)
        }
      } else if (block === 'subDistrict') {
          if(val === 0){
            this.loadingSubDistrict = true
            this.loadMore(block, this.moreSubDistrict)
          }else{
            this.subDistrict.forEach((item, no) => {
              if(item.id === val){
                this.formData.kecamatan_name = item.name
              }
            })
          }
      }
    },
    loadMore(block, url) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search_column: 'state_id',
        search_operator: '=',
        per_page: 100,
        search_text: 0
      }
      HTTP({
        method: 'GET',
        url: url,
        params: params,
        headers: headers
      }).then(response => {
        if(block === 'state'){
          this.stateCity = this.stateCity.concat(response.data.data)
          this.moreState = response.data.links.next
        } else if (block === 'city'){
          this.cities = this.cities.concat(response.data.data)
          this.moreCity = response.data.links.next
        } else if (block === 'subDistrict'){
          this.subDistrict = this.subDistrict.concat(response.data.data)
          this.moreSubDistrict = response.data.links.next
        }
        this.loadingState = false
        this.loadingCities = false
        this.loadingSubDistrict = false
      }).catch(error => {
        this.loadingState = false
        this.loadingCities = false
        this.loadingSubDistrict = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    checkValidateOwner(){
      let validate = false
      if(this.formData.fileIdCard !== null && 
        this.formData.fileFamilyRegister !== null && 
        this.formData.id_card_number.length === 16 && this.formData.address && 
        this.formData.phone_number && this.formData.gender){
        validate = true
      }
      return validate;
    }
  }
}
</script>