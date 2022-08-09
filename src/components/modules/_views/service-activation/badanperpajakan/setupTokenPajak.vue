<template>
  <el-dialog
    :visible.sync="show"
    :before-close="cancel"
    :title="rootLang.access_taxes"
    :show-close="false"
    width="536px"
    append-to-body>
    <div slot="title" class="flex-container">
      <h4 class="dialog-title full-width">
        Akses Pajak
      </h4>
      <div class="btn_save_dialog full-width text-right">
        <el-button type="info" @click="cancel">{{ lang.cancel }}</el-button>
        <!-- <el-button :loading="loadingTimezone" type="success" @click="save(4)" >{{ lang.save }}</el-button> -->
      </div>
    </div>
    <div>
      <div class="radius-10 flex-container justify-center">
        <img
            src="/static/img/icon-lock-token-pajak.png"
          />
      </div>
      <div class="mt-16">
        <div class="font-12">Akses ID</div>
        <el-input
          id="access_id"
          class="input-token-pajak"
          style="width: 100% !important"
          v-model="data.tax_client_id"
          :placeholder="lang.please_select" size="small">
          <div class="container-icon pointer" slot="append" @click="copyText('access_id')">
            <svg-icon icon-class="feather-copy" stroke="#67C23A"></svg-icon>
          </div>
        </el-input>
      </div>
      <div class="mt-16">
        <div class="font-12">Akses Token</div>
        <el-input
          id="access_token"
          class="input-token-pajak"
          style="width: 100% !important"
          :type="passwordType"
          v-model="data.tax_client_secret"
          :placeholder="lang.please_select" size="small">
          <template slot="append">
            <div class="flex-container">
              <div class="container-icon pointer" @click="showToken">
                <template v-if="passwordType === ''">
                  <svg-icon icon-class="eye"/>
                </template>
                <template v-else>
                  <svg-icon icon-class="eyeoff" />
                </template>
              </div>
              <div class="container-icon pointer" @click="copyText('access_token')">
                <svg-icon icon-class="feather-copy" stroke="#67C23A"></svg-icon>
              </div>
            </div>
          </template>
        </el-input>
      </div>
    </div>
    <div class="radius-10 color-grey--bg flex-container p-16 mt-24" style="align-items: unset">
      <div class="container-icon">
        <svg-icon icon-class="information-circle" class="font-20 color-grey--icon"/>
      </div>
      <div class="ml-8 word-break">
        Informasi Access ID dan Access Token di atas akan diberikan langsung oleh Anda selaku pemilik usaha.
        <br> <br> Olsera selaku penyedia layanan menghormati setiap data privasi pengguna, dalam hal ini tidak berkepentingan maupun bertanggung jawab untuk memberikan akses data pengguna kepada pihak ketiga manapun.
      </div>
    </div>
  </el-dialog>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
export default {
  name: 'GrabfoodDialogBeforeIntegration',

  props: {
    show: {
      type: Boolean,
      default: false
    },
    dataTaxation: {
      type: Object,
      default: null
    }
  },

  mixins: [basicComputedMixin],

  watch: {
    dataTaxation(data) {
      console.log('itemmmm', data)
      this.data = { ...data.taxation }
    }
  },

  data() {
    return {
      data: {},
      passwordType: 'password'
    }
  },

  methods: {
    cancel() {
      this.$emit('cancel')
    },

    submit() {
      this.$emit('submit')
    },

    showToken() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },

    copyText(dataId) {
      var copyText = document.getElementById(dataId);
      copyText.select();
      copyText.setSelectionRange(0, 99999); /*For mobile devices*/
      document.execCommand("copy");
      this.$notify({
        type: 'info',
        message: 'Berhasil copy text'
      })
    },
  }
}
</script>
