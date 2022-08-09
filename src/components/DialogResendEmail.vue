<template>
  <el-dialog
    :visible.sync="show"
    :before-close="hideverify"
    :close-on-click-modal="true"
    :show-close="true"
    custom-class="mw-480 without-padding-dialog dialog-without-header overflow-hidden">
    <div
      class="px-24"
      style="background: transparent linear-gradient(117deg, #FFFFFF 0%, #F1FBFF 100%) 0% 0% no-repeat padding-box; flex-basis: 100%;">
      <div class="text-center" style="flex-grow: 1;">
        <img
          width="311px;"
          src="../../static/img/email-verify-icon.svg"
        />
        <div class="font-18 font-bold">
          {{ rootLang.email_has_sent }}<br>{{ dataProfile.email }}
        </div>
        <el-button
          type="primary"
          class="btn-block mt-16"
          @click="$emit('close')">
          {{ rootLang.ok_saya_cek }}
        </el-button>
        <el-button
          :loading="loadingSendCode"
          class="btn-block mt-16"
          @click="resendCodeEmail">
          {{ rootLang.resend }}
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import {HTTP, API} from 'src/http-common'
import basicComputedMixin from '@/mixins/basicComputedMixin'
export default {
  name: 'DialogResendEmail',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    dataProfile: {
      type: Object,
      default: null
    }
  },

  mixins: [basicComputedMixin],

  data () {
    return {
      loadingSendCode: false
    }
  },

  methods: {
    resendCodeEmail() {
      this.loadingSendCode = true
      var data = {
        email: this.dataProfile.email
      }
      HTTP.post('api/admin/v1/id/resend/activate', data)
      .then(response => {
        this.$notify({
          type: 'success',
          title: 'Succes',
          message: response.data.message
        })
        this.loadingSendCode = false
        this.$emit('save')
      })
      .catch(error => {
        this.$message({
          type: 'warning',
          message: error.string
        })
        this.loadingSendCode = false
      })
    },

    hideverify () {
      this.$emit('close')
    }
  }
}
</script>