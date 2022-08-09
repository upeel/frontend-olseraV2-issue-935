<template>
  <div>
    <el-row :gutter="10">
      <el-col :md="8">

        <el-card class="box-card" v-if="isEditing">
          <div slot="header">
            <h4>{{ lang.publish }}</h4>
          </div>
          <div class="card-body">
            <p>{{ $lang[langId].publish_article }}
              <span style="margin:0 5px;">
                <el-switch v-model="data.published" :active-value="1" :inactive-value="0"></el-switch>
              </span>
              <span v-if="data.published === 0">{{ lang.no }}</span>
              <span v-if="data.published === 1">{{ lang.yes }}</span>
            </p>
          </div>
        </el-card>

        <el-card class="box-card">
          <div slot="header">
            <h4>{{ lang.tag }}</h4>
            <p class="input-desc size-12 oldgrey" style="margin:0;">
              {{ lang.info_article_tags }}
            </p>
          </div>
          <div class="card-body">
            <el-select
              v-model="data.tag_ids"
              :placeholder="lang.please_select"
              multiple
              filterable
              allow-create
              default-first-option
            >
              <el-option
                v-for="(item, key) in tagData"
                :key="key"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
        </el-card>

        <el-card class="box-card">
          <div slot="header">
            <el-row>
              <el-col :span="16">
                <h4>{{ $lang[langId].photo_slide }}</h4>
                <p class="input-desc size-12 oldgrey" style="margin:0;">{{ $lang[langId].photo_scroll_on_top }}</p>
              </el-col>
              <el-col :span="8">
                <el-button v-if="!isEditing" type="success" icon="el-icon-plus" @click="showDialogPhoto">{{ lang.add }}</el-button>
                <el-button v-if="isEditing" type="success" icon="el-icon-plus" @click="showDialogPhoto">{{ lang.add }}</el-button>
              </el-col>
            </el-row>
          </div>

          <div class="card-body" v-loading="loadingPhoto">
            <div v-if="!isEditing">
              <div class="dd-item" v-for="(item) in data.photos" :key="item.id">
                <slide-item :item="item" :showEdit="isEditing"></slide-item>
              </div>
              <p class="input-desc size-12 oldgrey">
                <i class="el-icon-warning"></i> {{ $lang[langId].save_change_choose }}
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
                <i class="el-icon-warning"></i> {{ $lang[langId].sort_photo_mark }}
                <i class="el-icon-rank"></i>
              </p>
              <p class="input-desc size-12 oldgrey">
                <i class="el-icon-warning"></i> {{ $lang[langId].save_change_on_button }}
              </p>
            </div>
          </div>
        </el-card>

        <el-card class="box-card">
          <div slot="header">
            <h4>{{ lang.seo }}</h4>
          </div>
          <div class="card-body">
            <div>
              <label>{{ lang.meta_keywords }}</label>
              <p class="input-desc size-12 oldgrey" style="margin:0 0 8px;">{{ lang.info_meta_keywords_page }}</p>
              <el-input v-model="inputMeta" @keyup.enter.native="addMetaKeywords" :placeholder="$lang[langId].split_with_enter"></el-input>
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
            <br>
            <div>
              <label>{{ lang.meta_description }}</label>
              <p class="input-desc size-12 oldgrey" style="margin:0 0 8px;">{{ lang.info_meta_description_page }}</p>
              <el-input type="textarea" v-model="data.meta_description"></el-input>
            </div>
            <br>
            <p v-if="!isEditing" class="input-desc size-12 oldgrey">
              <i class="el-icon-warning"></i> {{ $lang[langId].save_change_choose }}
            </p>
            <p v-if="isEditing" class="input-desc size-12 oldgrey">
              <i class="el-icon-warning"></i> {{ $lang[langId].save_change_on_button }}
            </p>
          </div>
        </el-card>

        <el-button
          v-if="isEditing"
          type="danger"
          style="width:100%;"
          @click="deleteDialog = true"
          icon="el-icon-delete"
        >
          {{ $lang[langId].delete }} {{ lang.article }}
        </el-button>
      </el-col>

      <el-col :md="16">
        <el-card class="box-card">
          <div slot="header">
            <el-row>
              <el-col :span="12">
                <h4>{{ lang.add }} {{ lang.article }}</h4>
              </el-col>
              <el-col :span="12" class="text-right">
                <el-button type="info" @click="cancel">{{ lang.cancel }}</el-button>
                <el-button v-if="isEditing" type="success" icon="el-icon-check" :disabled="disabledSave" @click="save">
                  {{ lang.save }}
                </el-button>
                <el-button v-if="!isEditing" type="warning" @click="save('draft')" :disabled="disabledSave">{{ $lang[langId].draft }}</el-button>
                <el-button v-if="!isEditing" type="success" icon="el-icon-check" :disabled="disabledSave" @click="save('publish')">{{ lang.publish }}</el-button>
              </el-col>
            </el-row>
          </div>
          <div class="card-body">
            <el-input :placeholder="$lang[langId].please_input+lang.title" style="margin-bottom:10px;" v-model="data.title"></el-input>
            <wysiwyg v-model="data.description" />
            <!--  -->
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog :title="lang.add_photo" :visible.sync="addPhotoDialog" width="50%" :close-on-click-modal="false" :show-close="false">
      <div class="dialog-body" style="padding-bottom: 10px;">
        <div v-if="!isEditing">
          <el-upload
            class="upload-demo"
            style="width: 100%; max-width: 100%;"
            drag multiple
            :file-list="fileList"
            :action="uploadPhotoUrl"
            :headers="headers"
            :on-remove="removePhoto"
            :on-error="handleUploadFailed"
            :on-success="handleUploadSuccess">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">{{ $lang[langId].drop_file_or_click }}</div>
          </el-upload>
        </div>
        <div v-if="isEditing">
          <el-upload
            style="width: 100%; max-width: 100%;"
            drag multiple
            :file-list="fileList"
            :data="{id: data.id}"
            :action="uploadPhotoUrl"
            :headers="headers"
            :on-remove="removePhoto"
            :on-error="handleUploadFailed"
            :on-success="handleUploadSuccess">
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

    <el-dialog :title="lang.edit+' '+lang.photo" :visible.sync="photoDialog" width="50%" :close-on-click-modal="false" :before-close="closePhotoDialog">
      <div class="dialog-body" style="padding:20px 10px;">
        <div>
          <el-form label-width="40%">
            <el-form-item :label="lang.photo_title">
              <el-input v-model="detailPhoto.title"></el-input>
            </el-form-item>
            <el-form-item :label="lang.photo">
              <template v-if="!changeFoto">
                <el-button type="primary" style="margin-bottom:5px; width:100%" @click="changeFoto = true" icon="el-icon-picture">{{ lang.change_photo }}</el-button>
                <div style="text-align:center; border:1px solid #ddd;">
                  <img style="width:50%; height:50%;" :src="detailPhoto.photo_md"/>
                </div>
              </template>
              <template v-else>
                <el-button type="info" style="margin-bottom:5px; width:100%" @click="changeFoto = false" icon="el-icon-close">{{ lang.cancel }}</el-button>
                <el-upload
                  class="upload-demo"
                  style="width: 100%; max-width: 100%;"
                  drag
                  :multiple="false"
                  :action="uploadPhotoUrl"
                  :headers="headers"
                  :on-error="handleUploadFailed"
                  :on-success="handleUploadDetail">
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

    <el-dialog :visible.sync="deleteDialog" width="50%" center :close-on-click-modal="false" :show-close="false">
      <span slot="title">
        <svg-icon icon-class="alert-triangle" style="stroke: #F44336;"></svg-icon>
        {{ lang.notif_warn }}
      </span>
      <div class="text-center">
        <p>{{ $lang[langId].are_you_want_remove }} {{ lang.article }}</p>
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

export default {
  components: {SlideItem, draggable, Wysiwyg},

  props: ['saved', 'loading', 'formData', 'tagData'],

  data() {
    return {
      loadingPhoto: false,
      disabledSave: true,
      isEditing: false,
      addPhotoDialog: false,
      photoDialog: false,
      deleteDialog: false,
      changeFoto: false,
      inputMeta: '',
      data: {
        tag_ids: [],
        selected_tag: ''
      },
      tmpPhotos: [],
      metaArray: [],
      fileList: [],
      detailPhoto: {},
      headers: {
        'Authorization': 'Bearer ' + this.$store.state.user.token.access_token
      },
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
      return baseApi(this.selectedStore.url_id, this.$store.state.userStores.langId, 'articlephotos/uploadonly')
    }
  },

  watch: {
    data: {
      handler(data, formData) {
        if (data.title && data.description) {
          this.disabledSave = false
        } else {
          this.disabledSave = true
        }
      },
      deep: true,
      immediate: true
    },
    saved: {
      handler(bool) {
        if (bool === true) {
          this.data = {}
          this.disabledSave = true
        }
      },
      deep: true
    },
    formData: {
      handler(data) {
        this.data = {...data}
        if (data.id) {
          this.isEditing = true
        }
        if (data.id && data.meta_keywords) {
          let metaComa = {...this.data}
          this.metaArray = metaComa.meta_keywords.split(',')
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    generateTagName() {
      if (this.data.id && this.data.tag_names.length > 0) {
        this.data.tag_ids = this.data.tag_names.map(item => {
          return item.id
        })
        delete this.data.tag_names
      }
    },
    cancel() {
      this.data = {}
      this.$emit('cancel')
    },
    saveSorts() {
      this.loadingPhoto = true

      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let data = {
        page_id: this.data.id,
        sorted_ids: this.data.sorted_ids
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'articlephotos'),
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
      // console.log(this.data.photos, 'data photos')
      // console.log(this.tmpPhotos, 'tmp photos')
      this.data.photos = [...this.tmpPhotos]
      this.addPhotoDialog = false
      this.tmpPhotos = []
      this.fileList = []
      // this.save()
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

    remove() {
      this.$emit('remove', { id: this.data.id })
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
      this.disabledSave = true
      if (this.data.tag_ids.length > 0) {
        this.data.tag_ids = this.data.tag_ids.join(',')
      }
      if (this.metaArray.length > 0) {
        let metaJoin = this.metaArray.join(',')
        this.data.meta_keywords = metaJoin
      }
      if (block === 'draft') {
        this.data.published = 0
      } else if (block === 'publish') {
        this.data.published = 1
      }
      this.$emit('save', this.data)
    },
  },
  mounted() {
    this.generateTagName()
  }
}
</script>

