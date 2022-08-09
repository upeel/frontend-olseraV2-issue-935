<template>
  <div class="content-wrapper">
    <section class="content income-expense">
      <el-card class="box-card with-back-button">
        <div class="card-body">
          <el-button
            icon="el-icon-arrow-left"
            class="back-button"
            @click="backHandle"/>
          <div class="flex-container flex-container--wrap">
            <div style="flex-grow: 1;">
              <h4 class="font-bold">{{ trxData.trans_no }}</h4>
              <p>{{ rootLang.author }} {{ trxData.user_name }}</p>
            </div>

            <div>
              <div class="flex-container flex-container--wrap">
                <el-date-picker
                  v-model="trxData.trans_date"
                  :placeholder="rootLang.pick_a_day"
                  :clearable="false"
                  type="date"
                  format="dd-MMM-yyyy"
                  value-format="yyyy-MMM-dd"
                  disabled
                  class="date-complete mb-4 mr-4"
                  style="max-width: 160px;"
                />

              </div>
            </div>

          </div>
        </div>
      </el-card>

      <el-card class="box-card box-card--sales">
        <div slot="header" class="flex-container flex-container--wrap color-white--bg">
          <h3 class="box-title">{{ rootLang.attactment_file }}</h3>
          <div class="pull-right">
            <el-upload :disabled="computedAccess"
              v-loading="loadingUploadImport"
              class="upload-demo"
              :data="{inex_id: trxData.id}"
              :action="attachmentUploadImportUrl"
              :headers="computedUploadImportHeaders"
              :on-success="attachmentUploadSuccess"
              :on-error="attachmentUploadError"
              :on-progress="attachmentUploadProgress"
              multiple
              :show-file-list="false"
              >
              <button-action-authenticated slot="trigger" size="mini" type="info"
              :disabled="computedAccess" @click="" icon="el-icon-plus">
                {{lang.add}}
              </button-action-authenticated>
            </el-upload>
          </div>
        </div>

        <div class="horizontal-scroll-wrapper">
          <div v-for="(file, index) in trxData.attachment" :key="index" class="pr-20">
            <el-card :body-style="{ padding: '0px' }">
              <div class="p-14 font-16" v-if="file.is_image === 1">
                <span><svg-icon icon-class="picture-file"></svg-icon> {{file.file_name}}</span>
                <div style="margin-top: 13px; line-height: 12px;">
                  <el-button type="primary" size="small" class="button" @click="downloadAttachment(file)">Download</el-button>
                  <el-button type="danger" size="small" class="button" @click="deleteAttachment(file)">hapus</el-button>
                </div>
              </div>
              <div class="p-14 font-16" v-else>
                <span><svg-icon icon-class="pdf-file"></svg-icon> {{file.file_name}}</span>
                <div style="margin-top: 13px; line-height: 12px;">
                  <el-button type="primary" size="small" class="button" @click="downloadAttachment(file)">Download</el-button>
                  <el-button type="danger" size="small" class="button" @click="deleteAttachment(file)">{{lang.delete}}</el-button>
                </div>
              </div>
            </el-card>

          </div>
        </div>

      </el-card>
    </section>
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'

import { mixinHiddenFeatureByPlanType } from '@/mixins/mixinHiddenFeatureByPlanType'
import { baseApi } from 'src/http-common'
import axios from 'axios'
import moment from 'moment'
import LoadingComponent from 'vue-loading-overlay'

export default {
  name: 'DetailTransaction',
  components: {
    LoadingComponent
  },

  mixins: [basicComputedMixin, mixinHiddenFeatureByPlanType],

  data: function() {
    return {
      loading: true,
      loadingUploadImport: false,
      trxData: {},
      repeat: false
    }
  },

  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    selectRoute() {
      return this.$route.name
    },
    token() {
      return this.$store.state.user.token
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    userRole() {
      const selectedStore = this.$store.getters.selectedStore
      return {
        role_id: selectedStore.role_id,
        role_name: selectedStore.role_name,
        is_pos_only: selectedStore.is_pos_only,
        is_mobile: selectedStore.is_mobile
      }
    },
    accessByStore () {
      return ['cvsms', 'smsstore1', 'smsstore2']
    },

    computedAccess () {
      if (this.accessByStore.includes(this.selectedStore.url_id) && (this.selectedStore.role_id === 'ST' || this.selectedStore.role_id === 'SS')) {
        return true
      }
    },
        
    attachmentUploadImportUrl() {
      const url = baseApi(this.selectedStore.url_id, this.langId, 'account/inex/attachment')
      return url
    },
    computedUploadImportHeaders() {
      return {
        'authorization' : 'Bearer ' + this.token.access_token
      }
    }
  },

  methods: {
    getRoute(route, store) {
        let url = baseApi(this.selectedStore.url_id, this.langId, 'inextrans/' + this.$route.params.id)
        this.getDetailData(url)
    },
    getDetailData(url) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: url,
        headers: headers
      }).then(response => {
        this.trxData = response.data.data
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    attachmentUploadProgress() {
      this.loadingUploadAttachment = true
    },

    attachmentUploadSuccess(response) {
      this.loadingUploadAttachment = false
      this.getRoute(this.selectRoute, this.selectedStore)
      if (response.error === 0) {
      }
    },

    attachmentUploadError(error, file) {
      const errorJson = JSON.parse(error.message)
      this.loadingUploadAttachment = false
      this.$notify({
        type: 'error',
        title: errorJson.error.message,
        message: errorJson.error.error
      })
    },

    downloadAttachment(row){
      if(row.is_image === 1){
        window.open(row.photo_lg, '_blank').focus();
      }
    },

    deleteAttachment(row){
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/inex/attachment/'+ row.id),
        headers: headers
      }).then(response => {

        this.$message({
          message: 'Success',
          type: 'success'
        })
        this.loading = false
        this.getRoute(this.selectRoute, this.selectedStore)
      })
      .catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loading = false
        this.getRoute(this.selectRoute, this.selectedStore)
      })
    },

    backHandle() {
      if (this.repeat) {
          this.$router.push({ path: '/transaction',
          query: {
            trans_date: this.trxData.trans_date
          } })
      } else {
        this.$router.push({ path: '/transaction' })
      }
    },
  },
  mounted() {

    this.getRoute(this.selectRoute, this.selectedStore)
  }
}
</script>