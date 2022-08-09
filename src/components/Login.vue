<template>
  <div class="login-page preload">
    <div class="container-login-page">

      <div class="login-banner">
        <div class="banner-img">
          <img src="../../static/img/login-olsera-icon.svg">
        </div>
        <div class="banner-text">
          <img src="../../static/img/login-olsera-cloud.svg">
        </div>
      </div>

      <div class="login-form" style="display: flex; flex-direction: column;">
        <el-form
          v-loading="loading"
          :model="form"
          :rules="rules"
          @submit.native.prevent
          @keyup.native.enter="login">
          <el-form-item prop="username" style="margin-bottom: 16px">
            <el-input ref="inputUsername" v-model="form.username" class="login-input" size="default" placeholder="Email" />
          </el-form-item>

          <el-form-item prop="password" style="margin-bottom: 24px">
            <el-input
              v-model="form.password"
              :type="passwordType"
              size="default"
              placeholder="Password"
              class="input-password login-input">
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
              :loading="loading"
              type="primary"
              class="btn-block btn-login-form"
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

        <div class="belum-terdaftar mt-16" style="margin-bottom: 16px">
          <span>{{ $lang[langId].not_registered }}</span>
        </div>

        <el-button
          size="default"
          class="btn-block mb-16 btn-login-form"
          @click="handleDaftar">
          {{ $lang[langId].register }}
        </el-button>

        <el-button
          size="default"
          class="btn-block btn-login-form"
          style="margin-bottom: 16px"
          @click="showResetPassword = true">
          Reset Password
        </el-button>

        <!-- <el-button
          size="default"
          class="btn-block"
          @click="showBantuanDialog = true">
          {{ $lang[langId].help }}
        </el-button> -->

        <div class="flex-grow-1"></div>

        <div v-if="buildVersion && buildVersion[stageLevel]" class="font-10 text-right mb-8">
          Build version: {{ buildVersion[stageLevel] }}
        </div>
      </div>
    </div>

    <el-dialog
      :visible.sync="showBantuanDialog"
      title="Bantuan"
      width="664px"
      append-to-body
      class="dialog-bantuan">
      <div style="width: 311px; margin-left: 160px">
        <div class="block">
          <h3>{{ $lang[langId].contact_us }}</h3>
          <div style="background: #0084FF; width: 311px; text-align: center; margin-bottom: 16px">
            <svg-icon icon-class="message-square-white" style="float: left; margin-left: 10px; margin-top: 10px"/>
            <el-button
              style="background: #0084FF; color: #ffffff; border-color: #0084FF;">
              Live Chat
            </el-button>
          </div>
          <div style="background: #128C7E; width: 311px; text-align: center; margin-bottom: 16px">
            <svg-icon icon-class="whatsapp" style="float: left; margin-left: 10px; margin-top: 10px"/>
            <el-button
              style="background: #128C7E; color: #ffffff; border-color: #128C7E;">
              Whatsapp
            </el-button>
          </div>
        </div>

        <!-- <div class="block">
          <h3>{{ $lang[langId].forgot_password }}?</h3>
          <el-button
            class="btn-block"
            @click="showResetPassword = true">
            {{ $lang[langId].email_reset_password }}
          </el-button>
        </div> -->
      </div>
    </el-dialog>

    <dialog-reset-password
      :show="showResetPassword"
      @close="showResetPassword = false"
    />
  </div>
</template>

<script>
import DialogResetPassword from '@/components/DialogResetPassword'
import { validateEmail } from '@/utils/validate'
import buildVersion from '@/data/buildVersion.json'
export default {
  components: {
    DialogResetPassword
  },
  data() {
    return {
      loading: false,
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
      showBantuanDialog: false,
      showResetPassword: false,
      loadingDialogResetPassword: false,
      passwordType: 'password',
      errorMessage: null
    }
  },

  computed: {
    disableButton() {
      if (validateEmail(this.form.username) !== '' && this.form.password !== '') {
        return false
      } else {
        return true
      }
    },
    langId() {
      return 'id'
    },
    stageLevel() {
      return process.env.ENV_CONFIG
    },
    buildVersion() {
      return process.env.ENV_CONFIG === 'dev' ? {dev: 'dev'} : buildVersion
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
    login() {
      this.loading = true
      // remove tempToken if user login
      localStorage.removeItem('olsbo_tempToken')
      // 
      this.$store.dispatch('login', this.form).then(response => {
        this.$store.dispatch('fetchUserLoggedin')
        this.$store.dispatch('setStores').then(() => {
          this.$router.push('/selectstore')
          this.loading = false
        }).catch(error => {
          if (error.statusCode === 404) {
            this.$store.commit('SET_USER_WITH_NO_STORE', 1)
            this.$router.push({
              path: '/selectstore',
              query: {
                newstore: 1
              }
            })
          } else {
            this.$message({
              type: 'error',
              message: error.string
            })
          }
          this.loading = false
        })
      }).catch((error) => {
        if (error.response) {
          this.errorMessage = error.response.data.error.error
          this.$message({
            type: 'error',
            message: error.response.data.error.error
          })
        }
        this.loading = false
      })
    },
    handleDaftar() {
      localStorage.removeItem('olsbo_tempToken')
      window.location.href = 'https://www.olsera.com/id/sign-up'
      // this.$router.push({
      //   path: '/signup'
      // })
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
