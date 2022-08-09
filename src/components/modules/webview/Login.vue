<template>
  <div class="login-form-webview p-16">
    <el-form
      :model="form"
      :rules="rules"
      @submit.native.prevent="login"
      @keyup.native.enter="login">
      <div class="font-16 mb-24">
        Please login again.
      </div>

      <el-form-item class="mb-18" prop="username">
        <el-input v-model="form.username" size="default" placeholder="Email" />
      </el-form-item>

      <el-form-item class="mb-18" prop="password">
        <el-input
          v-model="form.password"
          :type="passwordType"
          size="default"
          placeholder="Password"
          class="input-password">
          <template slot="append">
            <div class="pointer" @click="showPwd">
              <template v-if="passwordType === ''">
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
        <el-button
          :disabled="disableButton"
          type="primary"
          class="btn-block"
          @click="login">
          {{ $lang[langId].login }}
        </el-button>
      </el-form-item>

      <el-form-item v-if="errorMessage">
        <el-alert
          :title="errorMessage"
          type="error"
          show-icon
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: 'email is required', trigger: 'blur' },
        ],
        password: [
          { required: true, message: 'password is required', trigger: 'blur' },
        ]
      },
      passwordType: 'password',
      errorMessage: null
    }
  },

  computed: {
    disableButton() {
      if (this.form.username !== '' && this.form.password !== '') {
        return false
      } else {
        return true
      }
    },

    disableButtonReset() {
      if (this.formResetPassword.email) {
        return false
      } else {
        return true
      }
    },

    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    },
  },

  methods: {
    login() {
      const redirectPath = this.$route.query.redirect ? this.$route.query.redirect : '/reports-mobile'
      this.$router.push({
        path: redirectPath,
        query: this.form
      })
    },

    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    }
  }
}
</script>
