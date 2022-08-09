<template>
  <el-upload
    v-loading="uploading"
    :action="action"
		accept="image/jpeg,image/gif,image/png"
		:before-upload="onUploadFace"
    :data="paramData"
    :on-progress="handleUploadProcess"
    :on-error="handleUploadError"
    :show-file-list="false"
    :headers="{ Authorization: 'Bearer ' + token }"
    :on-success="handleAvatarSuccess"
    class="glob-upload-avatar">
    <div class="glob-upload-avatar__inner">
      <el-image
        v-if="photo"
        :class="avatarClass"
        :src="photo"
      />
      <div v-if="!photo" class="glob-upload-avatar__no-photo">
        <slot
          name="no-photo">
          <i class="el-icon-camera avatar-uploader-icon"></i>
        </slot>
      </div>
    </div>
  </el-upload>
</template>

<script>
import { baseApi } from 'src/http-common'
export default {
  props: {
    uploadUrl: {
      type: String,
      default: null
    },
    token: {
      type: String,
      default: null
    },
    avatarClass: {
      type: String,
      default: ''
    },
    shape: {
      type: String,
      default: 'circle'
    },
    paramData: {
      type: Object,
      default: null
    },
    photo: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      uploading: false
    }
  },

  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    action() {
      return baseApi(this.selectedStore.url_id, this.langId, this.uploadUrl)
    }
  },

  methods: {
    handleUploadProcess() {
      //
      this.uploading = true
    },
    handleUploadError(error) {
      this.uploading = false
      this.$notify({
        type: 'warning',
        title: error.response.data.error.message,
        message: error.response.data.error.error
      })
    },
    handleAvatarSuccess(response, file) {
      this.uploading = false
      this.$emit('upload-success', response)
    },
		onUploadFace(file)
		{
			const isLt1M = file.size / 1024 / 1024 < 1;

			if (!isLt1M) {
				this.$message({
					type: 'info',
          message:'Format .JPG .JPEG .PNG .GIF max 1 MB'
				});
				return false;
			}else{
				return true;
			}
		}
  }
}
</script>

<style lang="scss">
.glob-upload-avatar {
  background: #F5F5F5;
  border-radius: 10px;
  color: #767676;
  box-shadow: 0px 1px 3px #00000029;
  width: 100%;
  height: 152px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  .el-upload--text {
    flex: 1;
    height: 100%;
  }
  &__inner {
    height: 100%;
    position: relative;
    .el-image {
      height: 100%;
    }
    .el-image__inner {
      height: 100%;
      display: block;
      width: 100%;
      object-fit: cover;
    }
  }
}
</style>
