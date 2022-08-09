<template>
  <el-dialog
    :visible.sync="show"
    :before-close="hideDialog"
    :close-on-click-modal="false"
    :show-close="true"
    custom-class="text-center dialog-input-password"
    width="50%">
      <div class="text-capitalize font-24">
        <img src="../../static/img/ic_lock.svg">
      </div>
      <div class="text-left mt-24">
        <div class="font-18">{{ rootLang.input_your_pass }}</div>
        <el-input
          v-model="dataProfile.password"
          :type="passwordType"
          size="default"
          placeholder="Password"
          class="input-password mt-16"
          @keyup.native.enter="verifyPassword">
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
        <el-button
          :loading="loading"
          class="btn-block color-white color-primary--bg mt-24"
          @click="verifyPassword">
          {{ rootLang.verify }}
        </el-button>
      </div>
    </el-dialog>
</template>
<script>
import CloseEsc from '@/components/modules/CloseEsc'
import { baseApi } from 'src/http-common'
import axios from 'axios'

export default {
  name: 'DialogInputPassword',
  props: ['dataProfile', 'show', 'rootLang'],
  components : {
    CloseEsc
  },

  data() {
    return {
      passwordType: 'password',
      loading: false
    }
  },

  computed: {
    token() {
      return this.$store.state.user.token
    },
    selectedStore() {
      return this.$store.getters.selectedStore
    }
  },

  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },

    verifyPassword() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
        password: this.dataProfile.password
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'settlement/account/cekpassword'),
        headers: headers,
        data
      }).then(response => {
        this.$emit('save', this.dataProfile)
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error,
          position: 'top-left'
        })
      })
    },

    hideDialog () {
      this.dataProfile.password = ''
      this.$emit('close')
    }
  }
}
</script>
