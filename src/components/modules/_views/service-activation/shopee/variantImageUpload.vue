<template>
  <el-upload
    v-loading="loading"
    :action="uploadUrl"
    :show-file-list="false"
    :before-upload="beforeUpload"
    :http-request="handleUpload"
    list-type="document-grabfood"
    accept="image/jpeg" >
    <template v-if="uploadedImage !== null">
      <el-image
        :src="uploadedImage.photo_xs" alt=""
        style="width: 30px; height: 30px; margin-right: 16px;"
      />
    </template>
    <template v-else>
      <el-image
        v-if="initData.file_name"
        :src="initData.photo_xs" alt=""
        style="width: 30px; height: 30px; margin-right: 16px;"
      />
      <i v-else class="el-icon-camera"></i>
    </template>
  </el-upload>
</template>

<script>
import { service } from 'src/http-common'

export default {
  props: {
    uploadUrl: {
      type: String,
      default: '/upload/uploadonly'
    },
    initData: {
      type: Object,
      default: () => {}
    },
  },

  data() {
    return {
      loading: false,
      uploadedImage: null,
      changePhoto: false,
      selectedImage: null
    }
  },

  methods: {
    beforeUpload(file) {
      const isJpg = file.type === 'image/jpeg'
      const isPng = file.type === 'image/png'
      if (!isJpg && !isPng) {
        this.$message.error(this.$lang[this.langId].error_upload_photo)
      }
      this.selectedImage = file
      return isJpg || isPng
    },

    handleUpload() {
      this.loading = true
      const formData = new FormData()
      formData.append('file', this.selectedImage)
      service({
        method: 'post',
        url: this.uploadUrl,
        data: formData
      }).then(response => {
        this.handleImageSuccess(response.data)
        this.loading = false
      }).catch(error => {
        this.handleUploadError(error)
        this.loading = false
      })
    },

    handleImageSuccess(response, file, fileList) {
      this.changePhoto = false
      if (response.data instanceof Array) {
        const image = response.data[0]
        this.uploadedImage = image
        this.emitImages()
        this.emitFullResponse(response.data[0])
      } else {
        this.uploadedImage = response.data
        this.emitImages()
        this.emitFullResponse(response.data)
      }
      this.$message({
        type: 'success',
        message: 'Upload success'
      })
    },

    handleUploadError() {
      this.uploadedImage = null
      this.$message({
        type: 'error',
        message: 'Upload error'
      })
    },

    emitFullResponse(data) {
      this.$emit('response-sent', data)
    },

    emitImages() {
      this.$emit('change', this.uploadedImage)
    },
  }
}
</script>
