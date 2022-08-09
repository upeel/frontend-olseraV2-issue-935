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
        <div class="text-center" style="flex-grow: 1;">
          <img
            width="180px;"
            src="static/img/otp-icon.png"
          />
        </div>
      </div>

      <div class="p-16" style="flex-basis: 50%;">
        <el-form
          :data="{ phoneNumber }"
          @submit.native.prevent>
          <div v-if="!otpSent && !skipInput">
            <span>{{ rootLang.is_your_number_right }}?</span>
            <el-form-item
              prop="phoneNumber"
              class="signup-mode">
              <phone-number-input
                v-model="phoneNumber"
                default-country-code="ID"
                :translations="{
                  countrySelectorLabel: '',
                  countrySelectorError: '',
                  phoneNumberLabel: '',
                  example: ''
                }"
                :only-countries="['ID', 'SG']"
                @update="getPhone"
                @keyup.native.enter="resendCode"
              />
            </el-form-item>
            <div class="text-right">
              <el-button
                :loading="loadingSendCode"
                :disabled="disableSendPhoneNumber"
                type="primary"
                @click="resendCode">
                {{ rootLang.send }}
              </el-button>
            </div>
          </div>

          <div v-else class="form-modal-flex h56">
            <div class="word-break mb-24">
              {{ rootLang.send_otp }} {{ dataProfile.mobile }}
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
                  :loading="loadingSendCode"
                  :disabled="disableResend"
                  type="text"
                  size="mini"
                  class="font-13 color-3"
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
                  @end_callback="disableResend = false" />
              </el-col>
            </el-row>
            <el-row>
              <el-col
                :span="24"
                class="txt-align-rt">
                <el-button
                  type="text"
                  size="mini"
                  class="font-13"
                  style="color: #000000"
                  :disabled="disableResend"
                  @click="changeSms">
                  <i class="el-icon-phone-outline"/> &nbsp; {{ rootLang.use_phone }}
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

import { resendOtpProfile, verify } from '@/api/otp'

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
    }
  },

  components: {
    InputOtp
  },

  mixins: [basicComputedMixin],

  data() {
    return {
      loadingSendCode: false,
      otpSent: false,
      phoneNumber: '',
      disableResend: true,
      countDialog: 0,
      countStart: '',
      countEnd: '',
      errorOtp: {
        show: false,
        message: ''
      },
      dataPhoneNumber: {}
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
    },

    generateTimer() {
      this.disableResend = true
      this.countStart = new Date()
      this.countEnd = new Date(this.countStart.getTime() + 2 * 60 * 1000)
    },

    getPhone(phoneNumber) {
      this.dataPhoneNumber = phoneNumber
    },

    resendCode() {
      if (this.skipInput) {
        this.$emit('resend')
        return
      }
      this.loadingSendCode = true
      const data = {
        mobile: this.normalizedPhoneNumber
      }
      resendOtpProfile(data).then(response => {
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

    checkVerified(code) {
      if (this.verifyOutside) {
        this.$emit('verified', code)
        return
      }
      var data = {
        otp: code
      }
      this.loading = true
      verify(data).then(response => {
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

    changeSms () {
      this.$emit('changesms')
    },
  }
}
</script>
