<template>
  <div>
    <div class="content-wrapper">
      <section class="content income-expense">
        <el-row :gutter="10">
          <!-- appearances -->
          <el-col :md="11">
            <el-card v-loading="loading" class="box-card">
              <div slot="header">
                {{ rootLang.appearances }}
              </div>
              <div class="card-body">
                <div class="flex-container">
                  <div class="mr-8" style="flex-shrink: 0;">
                    <img v-if="data.logo" :src="data.logo" class="img-80 img-circle" @click="editAppearances('logo')"/>
                  </div>
                  <div class="mr-8">
                    <h4 class="card-sub-body-title">{{ $lang[langId].logo }}</h4>
                    <div class="size-12 oldgrey">{{ lang.click_to_change_kiosk_logo }}</div>
                  </div>
                  <div class="text-right">
                    <button-action-authenticated :permission="['settings/kiosk', 'edit']" class="btn-plain" type="primary"
                      size="mini" icon="el-icon-edit" @click="editAppearances('logo')">
                      {{ lang.edit }}
                    </button-action-authenticated>
                  </div>
                </div>

                <hr/>

                <div class="flex-container">
                  <div class="mr-8" style="flex-shrink: 0;">
                    <img v-if="data.banner" :src="data.banner" class="img-80 img-circle" @click="editAppearances('banner')"/>
                  </div>
                  <div class="mr-8">
                    <h4 class="card-sub-body-title">{{ $lang[langId].banner }}</h4>
                    <div class="size-12 oldgrey">{{ lang.click_to_change_kiosk_banner }}</div>
                  </div>
                  <div class="text-right">
                    <button-action-authenticated :permission="['settings/kiosk', 'edit']" class="btn-plain" type="primary"
                      size="mini" icon="el-icon-edit" @click="editAppearances('banner')">
                      {{ lang.edit }}
                    </button-action-authenticated>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>

          <!-- settings -->
          <el-col :md="13">
            <el-card v-loading="loading" class="box-card">
              <div slot="header">
                {{ lang.settings }}
              </div>
              <div class="card-body">

                <el-form :model="data" label-position="right" label-width="230px">
                  <el-form-item :label="lang.kiosk_on_start_select_dine_in" prop="on_start_select_dine_in">
                    <el-switch
                      v-model="data.on_start_select_dine_in"
                      :disabled="!checkCustomPermission('settings/kiosk', 'edit')"
                      :active-value="1"
                      :inactive-value="0"
                      @change="update"
                    />
                    <p class="size-12 oldgrey line-height-1">{{ lang.info_kiosk_on_start_select_dine_in }}</p>
                  </el-form-item>

                  <el-form-item :label="lang.kiosk_on_start_select_table" prop="on_start_select_table">
                    <el-switch
                      v-model="data.on_start_select_table"
                      :disabled="!checkCustomPermission('settings/kiosk', 'edit')"
                      :active-value="1"
                      :inactive-value="0"
                      @change="update"
                    />
                    <p class="size-12 oldgrey line-height-1">{{ lang.info_kiosk_on_start_select_table }}</p>
                  </el-form-item>

                  <el-form-item :label="lang.kiosk_on_start_input_total_guest" prop="on_start_input_total_guest">
                    <el-switch
                      v-model="data.on_start_input_total_guest"
                      :disabled="!checkCustomPermission('settings/kiosk', 'edit')"
                      :active-value="1"
                      :inactive-value="0"
                      @change="update"
                    />
                    <p class="size-12 oldgrey line-height-1">{{ lang.info_kiosk_on_start_input_total_guest }}</p>
                  </el-form-item>

                  <el-form-item :label="lang.kiosk_on_start_input_customer" prop="on_start_input_customer">
                    <el-switch
                      v-model="data.on_start_input_customer"
                      :disabled="!checkCustomPermission('settings/kiosk', 'edit')"
                      :active-value="1"
                      :inactive-value="0"
                      @change="update"
                    />
                    <p class="size-12 oldgrey line-height-1">{{ lang.info_kiosk_on_start_input_customer }}</p>
                  </el-form-item>

                  <el-form-item :label="lang.kiosk_on_start_input_initial" prop="on_start_input_initial">
                    <el-switch
                      v-model="data.on_start_input_initial"
                      :disabled="!checkCustomPermission('settings/kiosk', 'edit')"
                      :active-value="1"
                      :inactive-value="0"
                      @change="update"
                    />
                    <p class="size-12 oldgrey line-height-1">{{ lang.info_kiosk_on_start_input_initial }}</p>
                  </el-form-item>
                </el-form>

              </div>
            </el-card>
          </el-col>
        </el-row>
      </section>
    </div>

    <!-- dialog upload logo -->
    <el-dialog :title="lang.update_logo" :visible.sync="dialogEditUploadLogo">
      <el-row :gutter="10">
        <el-col :md="8">
          <p><strong>{{ lang.description }}</strong></p>
          <p class="size-12">{{ lang.click_to_change_your_logo }}</p>
        </el-col>
        <el-col :md="16">
          <el-upload
            drag
            style="width: 100%; max-width: 100%;"
            :action="urlUploadLogo"
            :file-list="fileList"
            :headers="headers"
            :on-error="handleUploadFailed"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
            :data="uploadData">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">{{ this.$lang[langId].drop_file_or_click }}</div>
          </el-upload>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- dialog upload banner -->
    <el-dialog :title="lang.change_banner" :visible.sync="dialogEditUploadBanner">
      <el-row :gutter="10">
        <el-col :md="8">
          <p><strong>{{ lang.description }}</strong></p>
          <p class="size-12">{{ lang.click_to_change_kiosk_banner }}</p>
        </el-col>
        <el-col :md="16">
          <el-upload
            drag
            style="width: 100%; max-width: 100%;"
            :action="urlUploadBanner"
            :file-list="fileList"
            :headers="headers"
            :on-error="handleUploadFailed"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
            :data="uploadData">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">{{ this.$lang[langId].drop_file_or_click }}</div>
          </el-upload>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import { checkCustomPermission } from '@/mixins/checkCustomPermission'

export default {
  mixins: [checkCustomPermission],
  data() {
    return {
      loading: true,
      data: {},
      dialogEditUploadLogo: false,
      dialogEditUploadBanner: false,
      fileList: []
    }
  },

  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
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
    rootLang() {
      return this.$lang[this.$store.state.userStores.langId]
    },
    urlUploadLogo() {
      return baseApi(this.selectedStore.url_id, this.langId, 'kiosk/uploadlogo')
    },
    urlUploadBanner() {
      return baseApi(this.selectedStore.url_id, this.langId, 'kiosk/uploadbanner')
    },
    headers() {
      return {
        Authorization: 'Bearer ' + this.token.access_token
      }
    },
    uploadData() {
      return {
        id: this.data.id
      }
    }
  },

  watch: {
    '$store.getters.selectedStore': function(store) {
      this.getData()
    }
  },

  methods: {
    getData() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'kiosk'),
        params: this.params,
        headers: headers
      }).then(response => {
        this.data = response.data.data
        this.loading = false
      }).catch((error) => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loading = false
      })
    },

    editAppearances(block) {
      //
      if (this.checkCustomPermission('settings/kiosk', 'edit')) {
        if (block === 'logo') {
          this.dialogEditUploadLogo = true
        } else if (block === 'banner') {
          this.dialogEditUploadBanner = true
        }
      }
    },

    beforeUpload(file) {
      const isJpg = file.type === 'image/jpeg'
      const isPng = file.type === 'image/png'
      if (!isJpg && !isPng) {
        this.$message.error(this.$lang[this.langId].error_upload_photo)
      }
      return isJpg || isPng
    },

    handleUploadFailed(err) {
      this.$notify({
        type: 'warning',
        title: 'Failed',
        message: err
      })
      this.loading = false
      this.disabledButton = false
    },

    handleUploadSuccess(response) {
      this.dialogEditUploadLogo = false
      this.dialogEditUploadBanner = false
      this.getData()
      this.$message({
        type: 'success',
        message: 'Success'
      })
    },

    update() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'kiosk/storeupdate'),
        headers: headers,
        data: this.data
      }).then(response => {
        this.data = response.data.data
        this.loading = false
        this.$message({
          type: 'success',
          message: 'saved'
        })
      }).catch((error) => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loading = false
      })
    }
  },

  mounted() {
    this.getData()
  }
}
</script>
