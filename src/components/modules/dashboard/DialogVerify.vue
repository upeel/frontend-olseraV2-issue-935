<template>
  <el-dialog
    :visible.sync="show"
    :show-close="false"
    :before-close="handleClose">
      <div slot="title" class="flex-container">
        <div class="btn_save_dialog full-width text-right">
          <close-esc @close="handleClose" />
        </div>
      </div>
      <div :style="verifyNumber ? 'padding-top: 45px !important' : ''">
        <div class="text-center" style="flex-grow: 1;">
          <img
            :width="!verifyNumber ? '311px' : '213px'"
            :src="verifyNumber ? '../../../../static/img/otp-icon.png' : '../../../../static/img/email-verify-icon.svg' "
          />
          <div class="font-18 font-bold mt-32">{{ verifyNumber ? rootLang.oops_verify_number : rootLang.oops_verify_email }}</div>
          <div class="font-16 mt-8">{{ verifyNumber ? rootLang.number_verify_desc : rootLang.email_verify_desc }}</div>
          <el-button
            v-if="verifyNumber"
            type="primary"
            :loading="loadingSendCode"
            class="btn-block mt-24"
            @click="resendOtp">
            {{ rootLang.resend }}
          </el-button>
          <el-button
            v-else
            type="primary"
            :loading="loadingSendCode"
            class="btn-block mt-24"
            @click="resendCodeEmail">
            {{ rootLang.resend }}
          </el-button>
          <el-button
              type="text"
              class="btn-block mt-16"
              style="color: #000000"
              @click="handleClose">
              {{ rootLang.ok_saya_cek }}
            </el-button>
        </div>
      </div>
  </el-dialog>
</template>

<script>
import CloseEsc from '@/components/modules/CloseEsc'
export default {
  name: 'DialogVerify',
  props: ['dataProfile', 'show', 'rootLang', 'verifyNumber', 'loadingSendCode'],
  components : {
    CloseEsc
  },

  methods:{
    resendCodeEmail () {
      this.$emit('resend', 1)
    },
    resendOtp () {
      this.$emit('resend', 0)
    },
    handleClose () {
      this.$emit('close')
    }
  }
}
</script>