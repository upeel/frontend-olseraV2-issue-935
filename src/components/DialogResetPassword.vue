<template>
  <el-dialog
    :visible.sync="show"
    :before-close="close"
    title="Reset Password"
    append-to-body
    custom-class="mw-348">
    <el-form
      :model="formResetPassword"
      label-position="top"
      @submit.native.prevent>

      <div v-if="resetMessage" class="mb-12">
        <el-tag
          :type="attemptStatus"
          class="tag-block"
          effect="plain">
          {{ resetMessage }}
        </el-tag>
      </div>

      <el-form-item label="Email" prop="email">
        <el-input v-model="formResetPassword.email" type="email" />
      </el-form-item>

      <el-form-item>
        <recaptcha-v2 @response="handleRecaptchaResponse" />
      </el-form-item>

      <el-form-item class="text-right">
        <el-button
          :loading="loadingDialogResetPassword"
          :disabled="disableButtonReset"
          type="primary"
          @click="sendEmailResetPassword">
          {{ $lang[langId].send_email_reset_pass }}
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import { resetEmailPassword } from '@/api/auth'
import RecaptchaV2 from '@/components/RecaptchaV2'
import { validateEmail } from '@/utils/validate'
export default {
  components: {
    RecaptchaV2
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  mixins: [basicComputedMixin],
  data() {
    return {
      attemptStatus: null,
      resetMessage: '',
      recaptchaResponse: null,
      loadingDialogResetPassword: false,
      formResetPassword: {
        email: ''
      }
    }
  },

  computed: {
    disableButtonReset() {
      if (this.attemptStatus === 'success') return true
      if ((validateEmail(this.formResetPassword.email) && this.recaptchaResponse)) {
        return false
      } else {
        return true
      }
    }
  },

  methods: {
    resetForm() {
      this.attemptStatus = null
      this.resetMessage = ''
      this.recaptchaResponse = null
      this.formResetPassword.email = ''
    },
    close() {
      this.resetForm()
      this.$emit('close')
    },
    handleRecaptchaResponse(response, type) {
      // console.log(response, type)
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
    sendEmailResetPassword() {
      this.loadingDialogResetPassword = true
      const data = { ...this.formResetPassword, 'g-recaptcha-response': this.recaptchaResponse }
      window.grecaptcha.reset()
      resetEmailPassword(data).then(response => {
        this.loadingDialogResetPassword = false
        this.attemptStatus = 'success'
        this.resetMessage = response.data.message
      }).catch(error => {
        this.loadingDialogResetPassword = false
        this.resetMessage = error.string
        this.attemptStatus = 'danger'
      })
    }
  }
}
</script>
