<template>
  <el-dialog
    :visible.sync="show"
    :before-close="close"
    :close-on-click-modal="true"
    :show-close="true"
    custom-class="mw-760 without-padding dialog-without-header overflow-hidden">
    <div
      v-if="show"
      class="flex-container flex-container--desktop">
      <div
        style="background: transparent linear-gradient(117deg, #FFFFFF 0%, #F1FBFF 100%) 0% 0% no-repeat padding-box; flex-basis: 50%; height: 273px;"
        class="flex-container">
        <div class="text-center" style="flex-grow: 1; height: 100%;">
          <img
            width="80%"
            :src="otp_type === 2? 'static/img/citcall-banner.svg' : otp_type === 3? 'static/img/whatsapp-banner.svg' : 'static/img/sms-banner.svg'"
          />
        </div>
      </div>

      <div class="p-16" style="flex-basis: 50%;">
        <el-form
          :data="{ phoneNumber }"
          @submit.native.prevent>
          <div v-if="!otpSent && !skipInput && !otpSent2">
            <template v-if="!errorCall">
              <div class="word-break" v-if="otp_type === 2">Sistem kami akan misscall {{ dashboard ? dataProfile.mobile : dataProfile.phone }} Masukkan <span class="font-bold color-primary">4 digit</span> terakhir dari nomor telepon penghubung untuk verifikasi</div>
              <div class="word-break mb-24" v-if="otp_type === 3 || otp_type === 1">Masukkan kode rahasia 6 digit yang kami kirimkan ke {{ dashboard ? dataProfile.mobile : dataProfile.phone }}</div>
              <div v-if="countDialog >= 1">
                <phone-number-input
                  v-if="dashboard"
                  v-model="dataProfile.mobile"
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
                <phone-number-input
                  v-else
                  v-model="dataProfile.phone_format"
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
              </div>
              <div class="mt-64">
                <el-button :loading="loadingMiscall" :disabled="disableMiscall" class="btn-block" type="primary" @click="handleCall(2)">Oke, miscall sekarang</el-button>
              </div>
              <!-- <div class="mt-16">
                <el-button :loading="loadingWa" :disabled="disableWa" class="btn-block color-whatsapp color-info--bg"  @click="handleCall(3)">Gunakan Whatsapp</el-button>
              </div> -->
            </template>
            <template v-else>
              <div class="word-break">{{ errorCallData.error }}</div>
              <div class="mt-64">
                <el-button class="btn-block" type="primary" @click="changeSms">{{ rootLang.change_to_sms }}</el-button>
              </div>
            </template>
          </div>

          <div v-else class="form-modal-flex h56">
            <div class="word-break mb-24" v-if="otp_type === 2">Sistem kami akan misscall {{ dashboard ? dataProfile.mobile : dataProfile.phone }} Masukkan <span class="font-bold color-primary">4 digit</span> terakhir dari nomor telepon penghubung untuk verifikasi</div>
            <div class="word-break mb-24" v-if="otp_type === 3 || otp_type === 1">Masukkan kode rahasia 6 digit yang kami kirimkan ke {{ dashboard ? dataProfile.mobile : dataProfile.phone }}</div>

            <input-otp-citcall v-if="!dashboard" ref="inputOtpCall" :data-profile="dataProfile" :use-call="otp_type !== 2? false : true" @complete="checkVerified" />
            <input-otp-citcall v-else-if="dashboard && verifyOutside" ref="inputOtpCall" :data-profile="dataProfile" :use-call="otp_type !== 2? false : true" @complete="checkVerified" />
            <input-otp-citcall v-else :data-profile="tempProfile" ref="inputOtpCall" :use-call="otp_type !== 2? false : true" @complete="checkVerifiedProfile" />

            <div v-if="errorOtp.show">
              <span class="span-otp-error">{{ errorOtp.message }}</span>
            </div>

            <el-row :gutter="0" type="flex" style="margin-top: 25px">
              <el-col
                :span="24"
                class="txt-align-rt">
                <el-button
                  :loading="loadingSendCode"
                  :disabled="disableResend"
                  type="text"
                  size="mini"
                  class="font-13 color-3"
                  @click="resendCode">
                  <svg-icon :icon-class="otp_type === 1? 'icon-otp-sms' : otp_type === 2? 'icon-otp-call' : otp_type === 3? 'icon-otp-wa' : ''" /> 
                  &nbsp; {{otp_type === 1? 'SMS ulang' : otp_type === 2? 'Miscall ulang' : otp_type === 3? 'Whatsapp ulang' : ''}}
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
                  @end_callback="disableResend = false" />
              </el-col>
            </el-row>

            <div class="flex-container">
              <!-- <template v-if="otp_type === 2"> -->
                <div v-if="otp_type !== 1" class="full-width txt-align-rt">
                  <el-button
                    type="text"
                    size="mini"
                    class="font-13"
                    style="color: #000000"
                    :disabled="disableResend"
                    @click="changeSms">
                    <svg-icon icon-class="icon-otp-sms" /> &nbsp; {{ rootLang.change_to_sms }}
                  </el-button>
                </div>
                <div v-if="otp_type !== 2" class="full-width" :class="otp_type === 3? 'text-right' : ''">
                  <el-button
                    type="text"
                    size="mini"
                    class="font-13"
                    style="color: #000000"
                    :disabled="disableResend"
                    @click="changeCall">
                    <svg-icon icon-class="icon-otp-call" /> &nbsp; Panggilan
                  </el-button>
                </div>
                <div v-if="otp_type !== 3" class="full-width text-right">
                <el-button
                  type="text"
                  size="mini"
                  class="font-13"
                  style="color: #000000"
                  :disabled="disableResend"
                  @click="changeWa">
                  <svg-icon icon-class="icon-otp-wa" /> &nbsp; Whatsapp
                </el-button>
              </div>
              <!-- </template> -->
            </div>

            <el-row v-if="countDialog >= 2" :gutter="0" type="flex">
              <el-col
                v-if="!dashboard"
                :span="24"
                class="txt-align-rt">
                <el-button
                  type="text"
                  size="mini"
                  class="font-13"
                  style="color: #000000"
                  @click="changeNumber">
                  <i class="el-icon-back"/> &nbsp; {{ rootLang.change_number }}
                </el-button>
              </el-col>
              <el-col v-if="!dashboard">
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
    </div>
  </el-dialog>
</template>

<script>
import InputOtp from '@/components/InputOtp'
import basicComputedMixin from '@/mixins/basicComputedMixin'

import { resendOtpRegister, verifyOtpRegister, resendOtpProfile, verifyOtpProfile } from '@/api/otp'
import InputOtpCitcall from './InputOtpCitcall.vue'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    dataProfile: {
      type: Object,
      default: null
    },
    verifyOutside: {
      type: Boolean,
      default: false
    },
    skipInput: {
      type: Boolean,
      default: false
    },
    otpSent: {
      type: Boolean,
      default: false
    },
    loadingMiscall: {
      type: Boolean,
      default: false
    },
    loadingWa: {
      type: Boolean,
      default: false
    },
    disableWa: {
      type: Boolean,
      default: false
    },
    disableMiscall: {
      type: Boolean,
      default: false
    },
    countStart: {
      type: String,
      default: null
    },
    countEnd: {
      type: String,
      default: null
    },
    countDialog: {
      type: Number,
      default: 0
    },
    changePhone: {
      type: Boolean,
      default: false
    },
    dashboard: {
      type: Boolean,
      default: false
    },
    errorCall: {
      type: Boolean,
      default: false
    },
    errorCallData: {
      type: Object,
      default: () => {}
    }
  },

  components: {
    InputOtp,
    InputOtpCitcall
  },

  mixins: [basicComputedMixin],

  data() {
    return {
      loadingSendCode: false,
      phoneNumber: '',
      disableResend: true,
      // countDialog: 0,
      // countStart: '',
      // countEnd: '',
      errorOtp: {
        show: false,
        message: ''
      },
      dataPhoneNumber: {},
      tempProfile: { ...this.dataProfile},
      otp_type: 2,
      otpSent2: false
    }
  },

  computed: {
    normalizedPhoneNumber() {
      if (this.dataPhoneNumber.formattedNumber) {
        return this.dataPhoneNumber.formattedNumber
      } else {
        return this.phoneNumber
      }
    },
    disableSendPhoneNumber() {
      if (!this.dataPhoneNumber.isValid) {
        return true
      } else {
        return false
      }
    }
  },

  watch: {
    dataProfile: {
      deep: true,
      immediate: true,
      handler(dataProfile) {
        if (dataProfile) {
          this.phoneNumber = dataProfile.mobile
        }
      }
    }
  },

  methods: {
    close() {
      this.$emit('close')
      this.otp_type = 2
    },

    generateTimer() {
      this.disableResend = true
      this.countStart = new Date()
      this.countEnd = new Date(this.countStart.getTime() + 2 * 60 * 1000)
    },

    getPhone(phoneNumber) {
      this.dataProfile.phone = phoneNumber.formattedNumber
    },

    resendCode() {
      if (this.skipInput) {
        this.$emit('resend', this.otp_type)
        return
      } else if (this.dashboard) {
        this.resendOtp()
        return
      }
      this.loadingSendCode = true
      const data = {
        mobile: this.dataProfile.phone,
        use_otp_type: this.otp_type,
        access_token: this.dataProfile.access_token
      }
      resendOtpRegister(data).then(response => {
        this.otpSent = true
        this.countDialog ++
        this.generateTimer()
        this.errorOtp = {
          show: false,
          message: ''
        }
        this.$message({
          type: 'success',
          message: response.data.message
        })
        this.loadingSendCode = false
      }).catch(error => {
        this.$message({
          type: 'warning',
          message: error.string
        })
        this.loadingSendCode = false
      })
    },

    resendOtp() {
      this.loadingSendCode = true
      const data = {
        mobile: this.dataProfile.phone,
        // mobile: '+6288233018877',
        use_otp_type: this.otp_type
      }
      resendOtpProfile(data).then(response => {
        this.otpSent = true
        this.otpSent2 = true
        this.countDialog ++
        this.generateTimer()
        this.errorOtp = {
          show: false,
          message: ''
        }
        this.$message({
          type: 'success',
          message: response.data.message
        })
        this.tempProfile.tokenMiscall = '+' + response.data.data.token
        this.loadingSendCode = false
      }).catch(error => {
        this.$message({
          type: 'warning',
          message: error.string
        })
        this.loadingSendCode = false
      })
    },

    checkVerifiedProfile(code) {
      var data = {
        otp: code,
        otp_for: 2
      }
      this.loading = true
      verifyOtpProfile(data).then(response => {
        this.loading = false
        this.$message({
          type: 'success',
          message: 'Success'
        })
        this.$emit('verified', code)
        this.otp_type = 2
      }).catch(error => {
        this.errorOtp = {
          show: true,
          message: error.string
        }
        this.loading = false
      })
    },

    checkVerified(code) {
      if (this.verifyOutside) {
        this.$emit('verified', code)
        this.otp_type = 2
        return
      }
      var data = {
        otp: code,
        id: this.dataProfile.id,
        access_token: this.dataProfile.access_token
      }
      this.loading = true
      verifyOtpRegister(data).then(response => {
        this.loading = false
        this.$message({
          type: 'success',
          message: 'Success'
        })
        this.$emit('verified', code)
      }).catch(error => {
        this.errorOtp = {
          show: true,
          message: error.string
        }
        this.loading = false
      })
    },

    handleMiscall () {
      this.$emit('register', this.otp_type)
    },

    handleLanjut () {
      this.$emit('verified')
    },

    changeSms () {
      this.$refs.inputOtpCall.resetValue()
      this.errorOtp.show = false
      this.otp_type = 1
      this.resendCode()
      // this.$emit('changesms')
    },

    changeCall () {
      this.$refs.inputOtpCall.resetValue()
      this.errorOtp.show = false
      this.otp_type = 2
      this.resendCode()
    },

    changeWa () {
      this.$refs.inputOtpCall.resetValue()
      this.errorOtp.show = false
      this.otp_type = 3
      this.resendCode()
    },

    handleChangPhone () {
      this.$emit('changephone', this.dataProfile)
    },

    handleCall (type) {
      if (!this.dashboard) {
        this.otp_type = type
        this.countDialog > 1 ? this.handleChangPhone() : this.handleMiscall()
      } else {
        this.otp_type = type
        this.resendOtp()
      }
    },

    changeNumber () {
      this.$emit('changeNumber')
    },

    updateInputOtp () {
      this.$refs.inputOtpCall.forceUpdate()
    }
  }
}
</script>
