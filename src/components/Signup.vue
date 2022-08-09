<template>
  <div class="login-page preload signup-mode">
    <div
      class="container-login-page">

      <div class="daftar-banner">
        <div class="banner-img-daftar banner-img-daftar--imageadd">
          <!-- <el-image src="https://api-dash.olsera.co.id/img/promotion/login_promotion.png" /> -->
          <!-- <svg-icon v-if="!showSignupStore" icon-class="user-new" class-name="icon-signup" style="font-size: 200px" />
          <svg-icon v-if="showSignupStore" icon-class="store-new" class-name="icon-signup" style="font-size: 200px"/> -->
        </div>
      </div>

      <div v-show="!showSignupStore" class="login-form">
        <el-form
          ref="loginForm"
          :model="form"
          :rules="rules"
          class="label-form-register"
          label-position="top">
          <el-form-item label="Nama Anda" prop="name">
            <el-input v-model="form.name"/>
          </el-form-item>

          <el-form-item label="Email" prop="email">
            <el-input v-model="form.email" type="email" />
          </el-form-item>

          <el-form-item label="Phone" prop="phone" >
            <phone-number-input
              v-model="form.phone_format"
              :translations="{
                countrySelectorLabel: '',
                countrySelectorError: '',
                phoneNumberLabel: '',
                example: ''
              }"
              :only-countries="['ID', 'SG']"
              default-country-code="ID"
              @update="getPhone"
              class="field-register"
            />
          </el-form-item>

          <el-form-item prop="password" label="Password">
            <el-input v-model="form.password" :type="computedShowPassword">
              <template slot="append">
                <div class="pointer" @click="toggleShowPassword">
                  <template v-if="showPassword">
                    <svg-icon icon-class="eye"/>
                  </template>
                  <template v-else>
                    <svg-icon icon-class="eyeoff" />
                  </template>
                </div>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item>
            <recaptcha-v2 ref="recaptcha" @response="handleRecaptchaResponse" />
          </el-form-item>

          <el-form-item>
            <div class="flex-container">
              <div
                class="flex-grow-1 mr-16"
                v-html="rootLang.register_term"
              />
              <el-checkbox v-model="form.i_agree" />
            </div>
          </el-form-item>

          <el-form-item>
            <el-button
              :loading="loading"
              :disabled="disableButton"
              type="success"
              class="btn-block"
              @click="checkOtpOptionBeforeRegister">
              {{ rootLang.next_step }} <i class="el-icon-right" />
            </el-button>
          </el-form-item>
        </el-form>

        <div class="belum-terdaftar">
          <span>{{ rootLang.already_registered }}</span>
        </div>

        <el-button
          class="btn-block"
          @click="handleLogin">
          Login
        </el-button>

        <el-button
          class="btn-block"
          style="margin-bottom: 16px"
          @click="showResetPassword = true">
          Reset Password
        </el-button>

        <div
          v-if="$route.params.partner && partner && partner.partner_type_id !== 'X'"
          v-loading="loadingPartners"
          class="p-8 color-grey--bg">
          {{ rootLang.partner_reference }} <strong>{{ partner.name }} ({{ partner.email }})</strong>
        </div>
      </div>

      <div v-show="showSignupStore" class="login-form">
        <signup-store
          :form="form"
          :loading="loadingRegister"
          :btn-loading="loadingNewStore"
          :business-types="businessTypes"
          :with-back="false"
          @address-found="handleAddressFound"
          @back="showSignupStore = false"
          @register="register"
        />
      </div>
    </div>

    <!-- dialog phone number verification sms -->
    <el-dialog
      :visible.sync="showDialogPhoneVerification"
      :close-on-click-modal="false"
      :show-close="false"
      custom-class="mw-680 dialog-without-header p-null without-padding">
      <div class="flex-container" style="min-height: 237px">
        <div class="p-24 text-right" style="height: 100%; flex: 1; background: transparent linear-gradient(117deg, #FFFFFF 0%, #F1FBFF 100%) 0% 0% no-repeat padding-box;">
          <img src="../../static/img/otp-icon.png">
        </div>
        <div class="p-24" style="flex: 1;">
          <div v-if="inputOtp">
            <el-form @submit.native.prevent>
              <div class="form-modal-flex h56">

                <div style="margin-bottom: 24px">
                  {{ rootLang.send_otp }} {{ form.phone }}
                </div>

                <input-otp @complete="checkVerified" />

                <div v-if="errorOtp.show">
                  <span class="span-otp-error">{{ errorOtp.message }}</span>
                </div>

                <el-row :gutter="0" type="flex" style="margin-top: 25px">
                  <el-col
                    :span="24"
                    class="txt-align-rt">
                    <el-button
                      type="text"
                      size="mini"
                      class="font-13 color-3"
                      :disabled="disableResend"
                      @click="resendCode">
                      <i class="el-icon-refresh"/> &nbsp; {{ rootLang.resend_code }}
                    </el-button>
                  </el-col>
                  <el-col>
                    <vue-countdown-timer
                      :start-time="countStart"
                      :end-time="countEnd"
                      :day-txt="false"
                      :hour-txt="false"
                      :seconds-txt="''"
                      :interval="1000"
                      :end-text="'00 : 00'"
                      :show-zero="true"
                      style="font-size: 13px; margin-top: 8px; color: #767676; float: right"
                      @end_callback="viewResendCode"/>
                  </el-col>
                </el-row>

                <el-row v-if="countDialog >= 2" :gutter="0" type="flex">
                  <el-col
                    :span="24"
                    class="txt-align-rt">
                    <el-button
                      type="text"
                      size="mini"
                      class="font-13"
                      style="color: #000000"
                      @click="inputOtp = false">
                      <i class="el-icon-back"/> &nbsp; {{ rootLang.change_number }}
                    </el-button>
                  </el-col>
                  <el-col
                    :span="24"
                    class="txt-align-rt">
                    <el-button
                      type="text"
                      size="mini"
                      class="font-13"
                      style="color: #000000"
                      :disabled="disableResend"
                      @click="changeSms(false)">
                      <i class="el-icon-phone-outline"/> &nbsp; {{ rootLang.use_phone }}
                    </el-button>
                  </el-col>
                  <el-col>
                    <el-button
                      type="text"
                      size="mini"
                      class="font-13"
                      style="color: #000000; float: right"
                      @click="handleLanjut">
                      {{ rootLang.later }} &nbsp; <i class="el-icon-right"/>
                    </el-button>
                  </el-col>
                </el-row>
              </div>
            </el-form>
          </div>
          <div v-else>
            <phone-number-input
              v-model="form.phone_format"
              :translations="{
                countrySelectorLabel: '',
                countrySelectorError: '',
                phoneNumberLabel: '',
                example: ''
              }"
              :only-countries="['ID', 'SG']"
              default-country-code="ID"
              @update="getPhone"
              class="field-register"
            />
              <el-button :loading="loading" type="primary" class="btn-block mt-10" @click="handleSendOtpSMS">{{ rootLang.save }}</el-button>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- dialog phone number verification by citcall -->
    <dialog-cit-call-verification
      :data-profile="form"
      :show="visibleDialogCitCall"
      :otp-sent="hasMiscall"
      :loadingMiscall="loadingBtnMiscall"
      :loadingWa="loadingBtnWa"
      :disableMiscall="disableBtnMiscall"
      :disableWa="disableBtnWa"
      :count-start="countStart"
      :count-end="countEnd"
      :count-dialog="countDialog"
      :error-call="errorCall"
      :error-call-data="errorCallData"
      @close="visibleDialogCitCall = false"
      @verified="handleLanjut"
      @register="handleRegister"
      @changesms="changeSms(true)"
      @changephone="updateRegisterUser(true)"
      @changeNumber="hasMiscall = false"
    />

    <!-- dialog reset password -->
    <dialog-reset-password
      :show="showResetPassword"
      @close="showResetPassword = false"
    />
  </div>
</template>

<script>
import { getBusinessTypes, register, registerUser } from '@/api/auth'
// import { resend as sendResendOtp } from '@/api/auth'
import { fetchByCode as fetchPartners } from '@/api/partner'
import SignupStore from './SignupStore'
// import { HTTP } from 'src/http-common'
import axios from 'axios'
import InputOtp from '@/components/InputOtp'
import DialogCitCallVerification from '@/components/DialogCitCallVerification'
import baseURL from '@/utils/baseURL'
import DialogResetPassword from '@/components/DialogResetPassword'
import RecaptchaV2 from '@/components/RecaptchaV2'

export default {
  components: {
    SignupStore,
    InputOtp,
    DialogResetPassword,
    RecaptchaV2,
    DialogCitCallVerification
  },

  data() {
    return {
      loading: false,
      form: {
        name: '',
        email: '',
        password: '',
        phone: '',
        phone_format: '',
        name_toko: '',
        url_id: '',
        business_type_id: '',
        service_type_id: 3,
        country_id: 'ID',
        city_id: '',
        state_id: '',
        pos_resto_mode: 0,
        i_agree: 0,
        address: '',
        id: null,
        tokenMiscall: ''
      },
      rules: {
        name: [
          { required: true, trigger: 'blur' },
        ],
        email: [
          { type: 'email', required: true, trigger: 'blur' },
        ],
        password: [
          { required: true, trigger: 'blur' },
        ],
        phone: [
          { required: true, trigger: 'blur' },
        ],
        i_agree: [
          { required: true, trigger: 'blur' },
        ]
      },
      showBantuanDialog: false,
      showPassword: false,
      showSignupStore: false,
      businessTypes: [],
      showDialogPhoneVerification: false,
      countDialog: 0,
      countStart: '',
      countEnd: '',
      disableButtonResend: true,
      errorOtp: {
        show: false,
        message: ''
      },
      disableResend: true,
      showResetPassword: false,
      loadingRegister: false,
      loadingPartners: false,
      partner: null,
      loadingNewStore: false,
      tempUser: {},
      inputOtp: true,
      recaptchaResponse: null,
      visibleDialogCitCall: false,
      hasMiscall: false,
      loadingBtnMiscall: false,
      disableBtnMiscall: false,
      disableBtnWa: false,
      loadingBtnWa: false,
      useMiscall: true,
      errorCall: false,
      errorCallData: {},
      otp_type: 0
    }
  },

  computed: {
    disableButton() {
      if (
        this.form.name &&
        this.form.password &&
        this.form.email &&
        this.form.phone &&
        this.recaptchaResponse &&
        this.form.i_agree
      ) {
        return false
      } else {
        return true
      }
    },
    disableSignupButton() {
      if (
        this.form.url_id &&
        this.form.business_type_id &&
        this.form.service_type_id &&
        this.form.country_id &&
        this.form.city_id &&
        this.recaptchaResponse &&
        this.form.state_id
      ) {
        return false
      } else {
        return true
      }
    },
    computedShowPassword() {
      if (this.showPassword) {
        return 'text'
      } else {
        return 'password'
      }
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    rootLang() {
      return this.$lang[this.langId]
    },
    token() {
      return this.$store.state.user.token.access_token
    }
  },

  mounted() {
    this.getBusinessTypes()
    if (this.$route.query.store) {
      this.showSignupStore = true
      this.form.id = this.$route.query.id
    }
    if (this.$route.params.partner) {
      this.fetchPartners()
    }
    if (localStorage.getItem('olsbo_tempToken')) {
      this.tempUser = {
        access_token: JSON.parse(localStorage.getItem('olsbo_tempToken')).access_token,
        token_type: 'Bearer',
        refresh_token: JSON.parse(localStorage.getItem('olsbo_tempToken')).refresh_token,
        expires_in: JSON.parse(localStorage.getItem('olsbo_tempToken')).expires_in,
        form: JSON.parse(localStorage.getItem('olsbo_tempToken')).form
      }
      this.form.id = this.tempUser.form.id
      this.showSignupStore = true
    }
    setTimeout(() => {
      $('.login-page').removeClass('preload').addClass('transition-start')
    }, 1000)
  },

  methods: {
    handleRecaptchaResponse(response, type) {
      // console.log(response, type)
      // this.$refs.recaptcha.reset()
      if (type === 'success') {
        this.recaptchaResponse = response
      } else {
        this.recaptchaResponse = null
        this.$message({
          type: 'error',
          message: response
        })
      }
    },
    handleLanjut() {
      localStorage.setItem('olsbo_tempToken', JSON.stringify(this.tempUser))
      this.showSignupStore = true
      this.showDialogPhoneVerification = false
      this.visibleDialogCitCall = false
    },
    checkOtpOptionBeforeRegister () {
      window.grecaptcha.reset()
      if (!this.recaptchaResponse) {
        this.$message({
          type: 'error',
          message: 'Please complete recaptcha!'
        })
      } else {
        this.visibleDialogCitCall = true
      }
    },
    handleRegister(type) {
      // console.log('handle register')
      if (type === 2) { 
        this.loadingBtnMiscall = true
        this.disableBtnWa = true
      } else {
        this.loadingBtnWa = true
        this.disableBtnMiscall = true
      }
      // if (!this.form.id) {
        this.otp_type = type
        this.registerUser()
      // } else {
      //   this.updateRegisterUser()
      // }
    },
    registerUser() {
      this.loading = true
      const data = { ...this.form }
      data['g-recaptcha-response'] = this.recaptchaResponse
      // handle otp type
      // this.errorCall ? data.use_otp_miscall = 0 : data.use_otp_miscall = 1
      if (this.errorCall) { data.use_otp_type = 1}
      else {
        data.use_otp_type = this.otp_type
      }
      // handle otp type

      // if (this.$route.query.adv || this.partner.partner_type_id === 'X') {
      //   data.adv = this.$route.query.adv
      // }
      registerUser(data).then(response => {
        /**
         * SKIP OTP
         */
        if (!this.useMiscall) {
          this.showDialogPhoneVerification = true
          // this.inputOtp = true
        }
        if (this.useMiscall) {
          this.form.tokenMiscall = '+' + response.data.data.token
          this.hasMiscall = true
          this.loadingBtnMiscall = false
          this.loadingBtnWa = false
          this.disableBtnWa = false
        }
        
        this.inputOtp = true
        this.countStart = new Date()
        this.countEnd = new Date(this.countStart.getTime() + 2 * 60 * 1000)
        this.form.id = response.data.data.id
        this.form.access_token = response.data.access_token
        this.countDialog ++

        
        // this.$store.dispatch('setTokenFromRegister', {
        //   access_token: response.data.access_token,
        //   token_type: 'Bearer',
        //   refresh_token: response.data.refresh_token,
        //   expires_in: response.data.expires_in
        // })
        
        this.tempUser = {
          access_token: response.data.access_token,
          token_type: 'Bearer',
          refresh_token: response.data.refresh_token,
          expires_in: response.data.expires_in,
          form: response.data.data
        }

        // hapus status error citcall ke nomor telkomsel
        this.errorCall = false
        this.errorCallData = {}

        // untuk menampilkan popup welcome di whatsnew setelah berhasil register
        this.$store.dispatch('setNewUser', true)

        // sementara di remove, karena ketika popup untuk input otp, dan reload jadi langsung masuk ke screen daftar toko
        // @TODO harus dipindah saat request otp success
        // localStorage.setItem('olsbo_tempToken', JSON.stringify(this.tempUser))
        // this.handleLanjut()
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.loadingBtnMiscall = false
        this.loadingBtnWa = false
        this.disableBtnMiscall = false
        this.disableBtnWa = false
        this.visibleDialogCitCall = false
        // console.log(error)
        if (error.statusCode !== 307) {
          this.$message({
            type: 'error',
            message: error.string
          })
        } else {
          this.errorCall = true
          this.errorCallData = error.response.data.error
        }
      })
    },
    updateRegisterUser(miscall) {
      // this.loading = true
      var data = {
        phone: this.form.phone,
        use_otp_miscall: miscall ? 1 : 0
      }
      let headers = {
        Authorization: 'Bearer ' + this.tempUser.access_token
      }
      axios({
        method: 'PUT',
        url: baseURL + 'api/admin/v1/id/changephone',
        headers: headers,
        data
      })
      // HTTP.put('api/admin/v1/id/changephone', data)
        .then(response => {
          if (!miscall) {
            this.showDialogPhoneVerification = true
          } else {
            this.hasMiscall = true
          }
          this.countStart = new Date()
          this.countEnd = new Date(this.countStart.getTime() + 2 * 60 * 1000)
          this.form.id = response.data.data.id
          this.inputOtp = true
          this.countDialog = 0
          this.loading = false

          this.errorCall = false
          this.errorCallData = {}
        })
        .catch(error => {
          if (error.statusCode !== 307) {
            this.$message({
              type: 'error',
              message: error.string
            })
          } else {
            this.errorCall = true
            this.errorCallData = error.response.data.error
          }
          this.loading = false
        })
    },
    handleLogin() {
      localStorage.removeItem('olsbo_tempToken')
      this.$router.push({
        path: '/login'
      })
    },
    toggleShowPassword() {
      if (this.showPassword) {
        this.showPassword = false
      } else {
        this.showPassword = true
      }
    },
    getBusinessTypes() {
      getBusinessTypes({ per_page: 100 }).then(response => {
        this.businessTypes = response.data.data
      })
    },
    handleAddressFound(address) {
      this.form.address = address.plus_code.compound_code
    },
    register(service) {
      this.loadingNewStore = true
      // const data = Object.assign({}, this.form)
      if (service.online_store === 1 && service.online_order !== 1) {
        this.form.service_type_id = 1
      } else if (service.online_store === 1 && service.online_order === 1) {
        this.form.service_type_id = 5
      } else if (service.online_store !== 1 && service.online_order === 1) {
        this.form.service_type_id = 4
      }
      const data = {
        id: this.form.id,
        name_toko: this.form.name_toko,
        url_id: this.form.url_id,
        business_type_id: this.form.business_type_id,
        service_type_id: this.form.service_type_id,
        country_id: this.form.country_id,
        city_id: this.form.city_id,
        state_id: this.form.state_id,
        pos_resto_mode: this.form.pos_resto_mode,
        access_token: this.tempUser.access_token,
        is_premium: this.form.is_premium,
        plan_type_id: service.plan_type_id,
        'g-recaptcha-response': this.recaptchaResponse
      }
      if (this.partner) {
        data.partner_id = this.partner.id
      } else if (this.$route.query.adv) {
        data.adv = this.$route.query.adv
      } else if (!this.partner && this.$route.params.partner) {
        data.adv = this.$route.query.adv
      }
      data.password_confirmation = data.password

      register(data, this.langId).then(response => {
        this.$message({
          type: 'success',
          message: 'Success'
        })
        this.handleGoToDashboard().then(() => {
          this.loadingNewStore = false
          this.$router.push('/')
        }).catch((error) => {
          this.loadingNewStore = false
          // console.log(error)
          this.$store.dispatch('logout')
        })
      }).catch(error => {
        this.loadingNewStore = false
        this.$message({
          type: 'error',
          message: error.string
        })
      })
    },
    handleGoToDashboard() {
      return new Promise((resolve, reject) => {
        // save token to local if register success & remove tempToken
        this.$store.dispatch('setTokenFromRegister', {
          access_token: this.tempUser.access_token,
          token_type: 'Bearer',
          refresh_token: this.tempUser.refresh_token,
          expires_in: this.tempUser.expires_in
        })

        localStorage.removeItem('olsbo_tempToken')
        //
        this.$store.dispatch('setStores').then(response => {
          this.$store.dispatch('fetchUserLoggedin').then(() => {}).catch(() => {})
          this.$store.dispatch('setSelectedStore', response.data.data[0].store_id).then((response) => {
            resolve(response)
          }).catch((error) => {
            reject(error)
          })
        }).catch((error) => {
          reject(error)
        })
      })
    },
    checkVerified(code) {
      var data = {
        otp: code
      }
      this.errorOtp = {}
      // this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.tempUser.access_token
      }
      axios({
        method: 'POST',
        url: baseURL + 'api/admin/v1/id/verifyotp',
        headers: headers,
        data
      })
        .then(response => {
          this.showDialogPhoneVerification = false
          // this.loading = false
          this.$message({
            type: 'success',
            message: 'Success'
          })
          this.handleLanjut()
        })
        .catch(error => {
          this.errorOtp = {
            show: true,
            message: error.string
          }
          // this.loading = false
        })
    },
    viewResendCode() {
      this.disableResend = false
    },
    resendCode() {
      // this.loading = true
      var data = {
        id: this.form.id
      }
      let headers = {
        Authorization: 'Bearer ' + this.tempUser.access_token
      }
      axios({
        method: 'POST',
        url: baseURL + 'api/admin/v1/id/resendotp',
        headers: headers
      })
      // HTTP.post('api/admin/v1/id/resendotp', data)
        .then(response => {
          this.showDialogPhoneVerification = true
          this.countDialog ++
          this.countStart = new Date()
          this.countEnd = new Date(this.countStart.getTime() + 2 * 60 * 1000)
          this.inputOtp = true
          this.form.id = response.data.data.id
          this.disableResend = true
          this.errorOtp = {
            show: false,
            message: ''
          }
          this.$message({
            type: 'succes',
            title: 'Succes',
            message: response.data.message
          })
          // this.loading = false
        })
        .catch(error => {
          this.$message({
            type: 'warning',
            message: error.response.data.error.message
          })
          if (error.response.data.error.status_code === 406) {
            this.showDialogPhoneVerification = true
            this.countDialog ++
            this.countStart = new Date()
            this.countEnd = new Date(this.countStart.getTime() + 2 * 60 * 1000)
            this.inputOtp = true
          }
          // this.loading = false
        })
    },
    getPhone (value) {
      this.form.phone = value.formattedNumber
    },
    fetchPartners() {
      this.loadingPartners = true
      fetchPartners(this.$route.params.partner).then(response => {
        this.partner = response.data.data
        this.loadingPartners = false
      }).catch(error => {
        this.partner = null
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingPartners = false
      })
    },

    changeSms (method) {
      this.visibleDialogCitCall = !method
      this.inputOtp = false
      this.hasMiscall = false
      this.showDialogPhoneVerification = method
      this.countDialog ++
    },

    handleSendOtpSMS () {
      if (!this.tempUser.access_token) {
        this.errorCall ? this.registerUser() : this.updateRegisterUser(false)
      } else {
        this.updateRegisterUser(false)
      }
    }
  }
}
</script>
