<template>
  <div class="login-page preload">
    <div class="container-login-page">
      <div class="login-banner">
        <div class="banner-img">
          <img src="/static/img/login-olsera-icon.svg">
        </div>
        <div class="banner-text">
          <img src="/static/img/login-olsera-cloud.svg">
        </div>
      </div>
      <div class="login-form">
        <h3>Reset Password</h3>
        <el-form
          ref="loginForm"
          :model="form"
          class="label-form-register"
          label-position="top">
          <el-form-item label="Password Baru" prop="password">
            <el-input v-model="form.password" type="password"/>
          </el-form-item>

          <el-form-item label="Konfirmasi Password baru" prop="password_confirmation">
            <el-input v-model="form.password_confirmation" type="password" />
          </el-form-item>

          <el-form-item>
            <el-button
              :disabled="disableButton"
              :loading="loading"
              type="primary"
              class="btn-block"
              style="margin-bottom: 16px"
              @click="doResetPassword">
              Reset Password
            </el-button>
          </el-form-item>
        </el-form>

        <el-button
          class="btn-block"
          @click="handleLogin">
          Login
        </el-button>

        <div
          v-if="$route.params.partner && partner && partner.partner_type_id !== 'X'"
          v-loading="loadingPartners"
          class="p-8 color-grey--bg">
          {{ rootLang.partner_reference }} <strong>{{ partner.name }} ({{ partner.email }})</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { resetPassword } from '@/api/auth'

export default {
  data() {
    return {
      loading: false,
      form: {
        password: '',
        password_confirmation: ''
      }
    }
  },

  computed: {
    disableButton() {
      if (this.form.password !== this.form.password_confirmation) {
        return true
      }
      if (!this.form.password || !this.form.password_confirmation) {
        return true
      } else {
        return false
      }
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.$refs.inputUsername.focus()
    })
    setTimeout(() => {
      $('.login-page').removeClass('preload').addClass('transition-start')
    }, 1000)
  },

  methods: {
    doResetPassword() {
      this.loading = true
      const email = this.$route.query.email
      const token = this.$route.query.token
      resetPassword({
        ...this.form,
        email,
        token
      }).then(response => {
        this.$message({
          type: 'success',
          message: 'Success'
        })
        this.loading = false
        this.$router.push({
          path: '/login'
        })
      }).catch(error => {
        this.loading = false
        this.$message({
          type: 'error',
          message: error.string
        })
      })
    },
    handleLogin() {
      this.$router.push({
        path: '/login'
      })
    }
  }
}
</script>
