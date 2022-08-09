<template>
  <div>
    <el-row
      v-loading="loading"
      :gutter="10">
      <el-col
        :md="8"
        class="pos-sticky"
        style="top: 110px; z-index: 4;">
        <el-card class="box-card" v-if="isEditing">
          <div slot="header">
            <h4>{{ lang.publish }}</h4>
          </div>
          <div class="card-body">
            <p>{{ $lang[langId].publish_page }}
              <span style="margin:0 5px;">
                <el-switch v-model="data.published" :active-value="1" :inactive-value="0" @change="publishData"></el-switch>
              </span>
              <span v-if="data.published === 0">{{ lang.no }}</span>
              <span v-if="data.published === 1">{{ lang.yes }}</span>
            </p>
          </div>
        </el-card>

        <el-card class="box-card">
          <div slot="header">
            <div class="flex-container">
              <div>
                <h4>{{ $lang[langId].photo_slide }}</h4>
                <p class="input-desc size-12 oldgrey" style="margin:0;">{{ $lang[langId].photo_scroll_on_top }}</p>
              </div>
              <div class="flex-grow-1"></div>
              <div>
                <el-button v-if="!isEditing" type="success" icon="el-icon-plus" @click="showDialogPhoto">{{ lang.add }}</el-button>
                <el-button v-if="isEditing" type="success" icon="el-icon-plus" @click="showDialogPhoto">{{ lang.add }}</el-button>
              </div>
            </div>
          </div>
          <div class="card-body" v-loading="loadingPhoto">
            <div v-if="!isEditing">
              <div class="dd-item" v-for="(item) in data.photos" :key="item.id">
                <slide-item :item="item" :showEdit="isEditing" />
              </div>
              <p class="input-desc size-12 oldgrey">
                <i class="el-icon-warning" /> {{ $lang[langId].save_change_choose }}
              </p>
            </div>
            <div v-else>
              <draggable
                :option="{group: { name: 'pages'}}"
                class="dd-list dragArea"
                v-model="data.photos"
                :move="checkMove"
                @change="saveSorts">
                <div class="dd-item" v-for="(item) in data.photos" :key="item.id">
                  <slide-item :item="item" :showEdit="isEditing" @edit="showDetailPhoto(item)"></slide-item>
                </div>
              </draggable>
              <p class="input-desc size-12 oldgrey">
                <i class="el-icon-warning" /> {{ $lang[langId].sort_photo_mark }}
                <i class="el-icon-rank" />
              </p>
              <p class="input-desc size-12 oldgrey">
                <i class="el-icon-warning" /> {{ $lang[langId].save_change_on_button }}
              </p>
            </div>
          </div>
        </el-card>

        <el-card class="box-card">
          <div slot="header">
            <h4>{{ lang.seo }}</h4>
          </div>

          <div class="card-body">
            <div class="mb-24">
              <label>{{ lang.meta_keywords }}</label>
              <p class="input-desc size-12 oldgrey" style="margin:0 0 8px;">{{ lang.info_meta_keywords_page }}</p>

              <el-input
                v-model="inputMeta"
                @keyup.enter.native="addMetaKeywords"
                :placeholder="$lang[langId].split_with_enter"
              />

              <el-tag
                v-for="(meta) in metaArray"
                :key="meta"
                type="info"
                @close="removeMetaKeywords(meta)"
                :closable="true"
                size="mini"
                style="margin-top:8px;">
                {{meta}}
              </el-tag>
            </div>

            <div>
              <label>{{ lang.meta_description }}</label>
              <p class="input-desc size-12 oldgrey" style="margin:0 0 8px;">{{ lang.info_meta_description_page }}</p>
              <el-input type="textarea" v-model="data.meta_description"></el-input>
            </div>

            <p v-if="!isEditing" class="input-desc size-12 oldgrey">
              <i class="el-icon-warning"></i> {{ $lang[langId].save_change_choose }}
            </p>

            <p v-else class="input-desc size-12 oldgrey">
              <i class="el-icon-warning"></i> {{ $lang[langId].save_change_on_button }}
            </p>

          </div>
        </el-card>

        <el-button v-if="isEditing" type="danger" style="width:100%;" @click="deleteDialog = true" icon="el-icon-delete">{{ $lang[langId].delete }} {{ lang.page }}</el-button>
      </el-col>

      <el-col :md="16">
        <el-card class="box-card">
          <div slot="header">
            <div class="flex-container">
              <h4><span v-if="!isEditing">{{ lang.add }}</span><span v-else>{{ lang.edit }}</span> {{ lang.page }}</h4>
              <div class="flex-grow-1"></div>
              <el-button type="info" @click="cancel">{{ lang.back }}</el-button>
              <el-button
                v-if="isEditing"
                :disabled="disabledSave"
                type="success"
                icon="el-icon-check"
                @click="save">
                {{ lang.save }}
              </el-button>
              <el-button
                v-if="!isEditing"
                :disabled="disabledSave"
                :loading="loading"
                type="warning"
                @click="save('draft')">
                {{ $lang[langId].draft }}
              </el-button>
              <el-button
                v-if="!isEditing"
                :loading="loading"
                :disabled="disabledSave"
                type="success"
                icon="el-icon-check"
                @click="save('publish')">
                {{ lang.publish }}
              </el-button>
              <a
                v-if="featureAccessSiteBuilder.includes(selectedStore.url_id)"
                :href="pageBuilderUrl"
                target="_blank"
                class="ml-8">
                <el-button>{{ rootLang.pageBuilder.use }}</el-button>
              </a>
              <el-button
                v-if="data.use_builder"
                @click="unusePageBuilder">
                {{ rootLang.pageBuilder.unuse }}
              </el-button>
            </div>
          </div>
          <div class="card-body">
            <el-input
              :placeholder="$lang[langId].please_input+lang.title"
              style="margin-bottom:10px;" v-model="data.title"
            />
            <wysiwyg v-model="data.description" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      :title="lang.add_photo"
      :visible.sync="addPhotoDialog"
      :close-on-click-modal="false"
      :show-close="false"
      width="420px">
      <div class="dialog-body" style="padding-bottom: 10px;">
        <div v-if="!isEditing">
          <el-upload
            class="upload-demo"
            style="width: 100%; max-width: 300px"
            drag
            multiple
            :file-list="fileList"
            :action="uploadPhotoUrl"
            :headers="headers"
            :on-remove="removePhoto"
            :on-error="handleUploadFailed"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload">
            <i class="el-icon-upload" />
            <div class="el-upload__text">{{ $lang[langId].drop_file_or_click }}</div>
          </el-upload>
        </div>

        <div v-else>
          <el-upload
            style="width: 100%; max-width: 300px;"
            drag
            multiple
            :file-list="fileList"
            :data="{id: data.id}"
            :action="uploadPhotoUrl"
            :headers="headers"
            :on-remove="removePhoto"
            :on-error="handleUploadFailed"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">{{ $lang[langId].drop_file_or_click }}</div>
          </el-upload>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="cancelUpload">{{ lang.cancel }}</el-button>
        <el-button type="success" @click="saveUpload">{{ lang.save }}</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="lang.edit+' '+lang.photo"
      :visible.sync="photoDialog"
      :close-on-click-modal="false"
      :before-close="closePhotoDialog"
      width="360px">
      <div class="dialog-body" style="padding:20px 10px;">
        <div>
          <el-form label-width="40%">
            <el-form-item :label="lang.photo_title">
              <el-input v-model="detailPhoto.title" />
            </el-form-item>

            <el-form-item :label="lang.photo">
              <template v-if="!changeFoto">
                <el-button
                  type="primary"
                  style="margin-bottom:5px; width:100%"
                  @click="changeFoto = true"
                  icon="el-icon-picture">
                  {{ lang.change_photo }}
                </el-button>

                <div style="text-align:center; border:1px solid #ddd;">
                  <img
                    style="width:50%; height:50%;"
                    :src="detailPhoto.photo_md"
                  />
                </div>
              </template>

              <template v-else>
                <el-button
                  type="info"
                  style="margin-bottom:5px; width:100%"
                  @click="changeFoto = false"
                  icon="el-icon-close">
                  {{ lang.cancel }}
                </el-button>

                <el-upload
                  class="upload-demo"
                  style="width: 100%; max-width: 100%;"
                  drag
                  :multiple="false"
                  :action="uploadPhotoUrl"
                  :headers="headers"
                  :on-error="handleUploadFailed"
                  :on-success="handleUploadDetail"
                  :before-upload="beforeUpload">
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">{{ $lang[langId].drop_file_or_click }}</div>
                </el-upload>
              </template>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="updateDetailPhoto(detailPhoto)">{{ lang.save }}</el-button>
        <el-button type="danger" @click="removePhotoDetail(detailPhoto)">{{ $lang[langId].delete }}</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="deleteDialog"
      :close-on-click-modal="false"
      :show-close="false"
      width="300px">
      <div class="text-center">
        <div class="mb-8">
          <svg-icon icon-class="alert-triangle" style="stroke: #F44336;"></svg-icon>
          {{ lang.notif_warn }}
        </div>
        <p>{{ $lang[langId].are_you_want_remove }} {{ lang.page }}</p>
        <h4>"{{ data.title }}"</h4>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog = false">{{ lang.cancel }}</el-button>
        <el-button type="danger" @click="remove">{{ $lang[langId].delete }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import draggable from 'vuedraggable'
import SlideItem from './SlideItem'
import Wysiwyg from '@/components/Wysiwyg'
import { PAGE_BUILDER_URL } from '@/utils/constant'
const apiEndpoint = 'page/'
import { featureAccessSiteBuilder } from '@/data/featureAccessSiteBuilder'

export default {
  components: {SlideItem, draggable, Wysiwyg},

  data() {
    return {
      loading: false,
      loadingPhoto: false,
      isEditing: false,
      addPhotoDialog: false,
      photoDialog: false,
      deleteDialog: false,
      changeFoto: false,
      inputMeta: '',
      data: {},
      tmpPhotos: [],
      metaArray: [],
      fileList: [],
      detailPhoto: {},
      headers: {
        'Authorization': 'Bearer ' + this.$store.state.user.token.access_token
      },
      featureAccessSiteBuilder
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
    uploadPhotoUrl() {
      return baseApi(this.selectedStore.url_id, this.$store.state.userStores.langId, 'page/uploadonly')
    },
    rootLang() {
      return this.$lang[this.langId]
    },
    pageBuilderUrl() {
      if (this.data && this.data.id) {
        return PAGE_BUILDER_URL[process.env.ENV_CONFIG] + '?urlid=' + this.selectedStore.url_id + '&pid=' + this.data.id + '&token=' + this.token.access_token
      } else {
        return ''
      }
    },
    disabledSave() {
      return !this.data.title || !this.data.description
    }
  },

  mounted() {
    if (this.$route.params.id) {
      this.isEditing = true
      this.getSingleData()
    }
  },

  methods: {
    cancel() {
      this.$router.push({
        path: '/website/pages/static'
      })
    },
    getSingleData() {
      this.loading = true
      const id = this.$route.params.id
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint + id),
        headers: headers
      }).then(response => {
        this.data = response.data.data
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.$message({
          type: 'warning',
          message: error.response.data.error.error
        })
        this.cancel()
      })
    },
    deleteHandle() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let id = this.data.id
      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint + id),
        headers: headers
      })
        .then(response => {
          this.result = response.data
          this.$message({
            type: 'success',
            message: 'saved'
          })
          this.loading = false
          this.cancel()
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            message: error
          })
          this.loading = false
        })
    },
    saveHandle() {
      let data = this.data
      if (data.photos && data.photos.length < 1) {
        delete data.photos
      }
      let method = 'POST'
      let id = ''
      if (this.data.id) {
        method = 'PUT'
        id = this.data.id
      }
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method,
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint + id),
        headers: headers,
        data
      }).then(response => {
        this.tmp = {}
        this.loading = false
        this.getSingleData()
        this.$message({
          type: 'success',
          message: 'saved'
        })
      }).catch(error => {
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    saveSorts() {
      this.loadingPhoto = true

      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let data = {
        page_id: this.data.id,
        sorted_ids: this.data.photos
      }

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'pagephotos/sorting'),
        headers: headers,
        params: {
          per_page: this.data.length
        },
        data
      }).then(response => {
        this.data.photos = response.data.data
        this.$message({
          type: 'success',
          message: 'Success'
        })
        this.loadingPhoto = false
      }).catch(error => {
        this.loadingPhoto = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    showDialogPhoto() {
      if (this.data.photos) {
        this.tmpPhotos = [...this.data.photos]
        this.fileList = this.data.photos.map(item => {
          return {
            url: item.photo_md,
            name: item.title
          }
        })
      }
      this.addPhotoDialog = true
    },
    showDetailPhoto(item) {
      this.tmpPhotos = [...this.data.photos]
      this.detailPhoto = {...item}
      this.photoDialog = true
    },
    cancelUpload() {
      this.addPhotoDialog = false
      this.tmpPhotos = []
      this.fileList = []
    },
    handleUploadFailed(error) {
      this.$notify({
        type: 'warning',
        title: error.response.data.error.message,
        message: error.response.data.error.error
      })
    },
    handleUploadSuccess(response) {
      this.tmpPhotos.push(response.data[0])
      this.fileList.push({
        url: response.data[0].photo_md,
        name: response.data[0].file_name
      })
    },
    beforeUpload(file) {
      const isJpg = file.type === 'image/jpeg'
      const isPng = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJpg && !isPng) {
        this.$message.error(this.$lang[this.langId].error_upload_photo)
      }
      if (!isLt2M) {
        this.$message.error(this.$lang[this.langId].error_upload_size)
      }
      return (isJpg || isPng) && isLt2M
    },
    handleUploadDetail(response) {
      this.detailPhoto.title = response.data[0].title
      this.detailPhoto.file_name = response.data[0].file_name
      this.detailPhoto.photo_md = response.data[0].photo_md
      this.detailPhoto.photo_xs = response.data[0].photo_xs
      this.detailPhoto.height = response.data[0].height
      this.detailPhoto.width = response.data[0].width
      this.changeFoto = false
    },
    removePhoto(item) {
      this.tmpPhotos.splice(this.tmpPhotos.indexOf(item.name))
    },
    saveUpload() {
      this.data.photos = [...this.tmpPhotos]
      this.addPhotoDialog = false
      this.tmpPhotos = []
      this.fileList = []
    },
    updateDetailPhoto(detail) {
      this.tmpPhotos.forEach((item, idx) => {
        if (item.id === detail.id) {
          this.tmpPhotos[idx] = detail
        }
      })
      this.data.photos = this.tmpPhotos
      this.photoDialog = false
      this.detailPhoto = {}
    },
    remove() {
      this.deleteHandle()
      this.deleteDialog = false
    },
    addMetaKeywords(ev) {
      this.inputMeta = ev.target.value
      this.metaArray.push(this.inputMeta)
      this.inputMeta = ''
    },
    removeMetaKeywords(meta) {
      this.metaArray.splice(this.metaArray.indexOf(meta), 1)
    },
    save(block) {
      let data = { ...this.data }

      let metaJoin = this.metaArray.join(',')
      data.meta_keywords = metaJoin

      if (block === 'draft') {
        data.published = 0
      } else if (block === 'publish') {
        data.published = 1
      }
      this.saveHandle()
    },
    removePhotoDetail(detail) {
      this.tmpPhotos.splice(this.tmpPhotos.indexOf(detail), 1)
      this.data.photos = this.tmpPhotos
      this.photoDialog = false
      this.detailPhoto = {}
    },
    closePhotoDialog() {
      this.photoDialog = false
      this.tmpPhotos = []
    },
    checkMove(evt) {
      if (!evt.draggedContext.element.id) {
        return false
      }
    },
    publishData() {
      this.saveHandle()
    },
    unusePageBuilder() {
      const headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'put',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint + this.data.id),
        headers: headers,
        data: {
          use_builder: 0,
          title: this.data.title
        }
      }).then(response => {
        this.tmp = {}
        this.loading = false
        this.getSingleData()
        this.$message({
          type: 'success',
          message: 'saved'
        })
      }).catch(error => {
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    }
  }
}
</script>

