<template>
  <div class="flex-container justify-center">
    <el-upload
      v-loading="loadingUpload"
      :action="uploadPhotoUrl"
      :headers="headersReverify"
      :before-upload="beforeUpload"
      :show-file-list="false"
      :on-progress="handleUploadProgress"
      :on-success="handleUploadSuccessVariant"
      :on-error="handleUploadError"
      list-type="document-grabfood"
      >
      <template >
        <el-image
          :src="rowData.photo_md" alt=""
          style="width: 100px; height: 100px; margin-right: 8px;"
        />
      </template>
    </el-upload>
  </div>
</template>
<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import { baseApi, HTTP } from 'src/http-common'
export default {
  mixins: [basicComputedMixin],
  props: {
    rowData: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      loadingUpload: false
    }
  },

  computed: {
    uploadPhotoUrl() {
      return baseApi(this.selectedStore.url_id, this.langId, 'product/upload')
    },

    headersReverify() {
      return {
        'Authorization': 'Bearer ' + this.token.access_token
      }
    },
  },

  methods: {
    beforeUpload(file) {
      const isJpg = file.type === 'image/jpeg'
      const isPng = file.type === 'image/png'
      if (!isJpg && !isPng) {
        this.$message.error(this.$lang[this.langId].error_upload_photo)
      }
      return isJpg || isPng
    },

    handleUploadProgress (args) {
      this.loadingUpload = true
    },

    handleUploadSuccessVariant(response, file, fileList) {
      console.log('res', response)
      this.rowData.photos = response.data[0]
      // if (this.rowData.photos.length === 0) {
      //   this.rowData.photos = response.data[0]
      // } else {
      //   this.rowData.photos[0] = response.data[0]
      // }
      this.rowData.photo_md = response.data[0].photo_md
      this.rowData.photo_xs = response.data[0].photo_xs
      this.rowData.photo_name = response.data[0].file_name
      this.$emit('upload', this.rowData)
      this.loadingUpload = false
    },

    handleUploadError(error) {
      this.loading = false
      this.loadingUpload = false
      this.$notify({
        type: 'warning',
        title: error.response.data.error.message,
        message: error.response.data.error.error
      })
    },
  }
}
</script>