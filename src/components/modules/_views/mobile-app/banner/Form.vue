<template>
  <div>
    <el-form label-width="40%">
      <el-form-item :label="lang.photo +' '+lang.banner">
        <div v-if="!editForm">
          <template v-if="!data.photo || changePhoto">
            <el-upload
                style="width: 100%; max-width: 100%;"
                drag
                :file-list="fileList"
                :action="uploadPhotoUrl"
                :headers="headers"
                :on-error="handleUploadFailed"
                :on-success="handleUploadSuccess">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">{{ $lang[langId].drop_file_or_click }}</div>
            </el-upload>
          </template>
          <template v-else>
            <img style="margin-bottom: 12px;" :src="data.photo"/>
            <el-button @click="changePhoto = true" icon="el-icon-picture" type="info" class="btn-block">
              {{ lang.change_banner }}
            </el-button>
          </template>
        </div>
        <div v-else class="package-img">
          <template v-if="changePhoto">
            <el-upload
              style="width: 100%; max-width: 100%;"
              drag
              :file-list="fileList"
              :action="uploadPhotoUrl"
              :headers="headers"
              :on-error="handleUploadFailed"
              :on-success="handleUploadSuccess">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">{{ $lang[langId].drop_file_or_click }}</div>
            </el-upload>
            <el-button @click="changePhoto = false" icon="el-icon-close" type="text" class="btn-block">
              {{ lang.cancel }}
            </el-button>
          </template>
          <template v-else>
            <img style="margin-bottom: 12px;" :src="data.photo"/>
            <el-button @click="changePhoto = true" icon="el-icon-picture" type="info" class="btn-block">
              {{ lang.change_banner }}
            </el-button>
          </template>
        </div>
      </el-form-item>
      <el-form-item :label="lang.title">
        <el-input v-model="data.title"></el-input>
      </el-form-item>
      <el-form-item :label="lang.banner_slide_with_link">
        <el-switch v-model="data.has_link" :active-value="1" :inactive-value="0"></el-switch>
        <span v-if="data.has_link === 0">{{ lang.no }}</span>
        <span v-if="data.has_link === 1">{{ lang.yes }}</span>
      </el-form-item>
      <el-form-item v-if="data.has_link" :label="lang.link_type">
        <el-select filterable v-model="data.link_type_id">
          <el-option v-for="(item) in typeLink" :key="item.id" :label="item.link_type_name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="data.link_type_id === 'PGR'">
        <template slot="label">
          <h5 style="margin-top: 0; margin-bottom: 0;">{{ lang.product_group }}</h5>
          <p class="input-desc size-12 oldgrey">{{ lang.info_auto_complete_product_group }}</p>
        </template>
        <el-autocomplete
          v-model="productValue"
          :fetch-suggestions="searchProductGroup"
          :debounce="debounce"
          :placeholder="lang.search+' '+lang.product"
          @select="handleSelect('product', $event)">
          <i v-if="data.product_group_id" slot="suffix" class="el-icon-circle-close-outline" @click="clearSearch('product', data)"></i>
        </el-autocomplete>
      </el-form-item>
      <el-form-item v-if="data.link_type_id === 'PCL'">
        <template slot="label">
          <h5 style="margin-top: 0; margin-bottom: 0;">{{ lang.collection }}</h5>
          <p class="input-desc size-12 oldgrey">{{ lang.info_auto_complete_collection }}</p>
        </template>
        <el-autocomplete v-model="collectionValue" :fetch-suggestions="searchCollection" :debounce="debounce" :placeholder="lang.search+' '+lang.collection" @select="handleSelect('collection', $event)">
          <i v-if="data.collection_id" slot="suffix" class="el-icon-circle-close-outline" @click="clearSearch('collection', data)"></i>
        </el-autocomplete>
      </el-form-item>
      <el-form-item v-if="data.link_type_id === 'PAG'">
        <template slot="label">
          <h5 style="margin-top: 0; margin-bottom: 0;">{{ lang.page }}</h5>
          <p class="input-desc size-12 oldgrey">{{ lang.info_auto_complete_page }}</p>
        </template>
        <el-autocomplete v-model="pageValue" :fetch-suggestions="searchPageWeb" :debounce="debounce" :placeholder="lang.search+' '+lang.page" @select="handleSelect('page', $event)">
          <i v-if="data.page_id" slot="suffix" class="el-icon-circle-close-outline" @click="clearSearch('page', data)"></i>
        </el-autocomplete>
      </el-form-item>
      <!-- <el-form-item v-if="data.link_type_id === 'ATT'">
        <template slot="label">
          <h5 style="margin-top: 0; margin-bottom: 0;">{{ lang.tag }}</h5>
          <p class="input-desc size-12 oldgrey">{{ lang.info_auto_complete_tag }}</p>
        </template>
        <el-autocomplete v-model="articleValue" :fetch-suggestions="searchArticle" :debounce="debounce" :placeholder="lang.search+' '+lang.tag" @select="handleSelect('article', $event)">
          <i v-if="data.article_tag_id" slot="suffix" class="el-icon-circle-close-outline" @click="clearSearch('article', data)"></i>
        </el-autocomplete>
      </el-form-item> -->
      <el-form-item v-if="data.link_type_id === 'EXL'">
        <template slot="label">
          <h5 style="margin-top: 0; margin-bottom: 0;">{{ lang.external_url }}</h5>
          <p class="input-desc size-12 oldgrey">{{ lang.info_external_url }}</p>
        </template>
        <el-input v-model="data.link_url"></el-input>
      </el-form-item>
      <el-form-item :label="lang.publish+' ?'">
        <el-switch v-model="data.published" :active-value="1" :inactive-value="0"></el-switch>
        <span v-if="data.published == 0">{{ lang.no }}</span>
        <span v-if="data.published == 1">{{ lang.yes }}</span>
      </el-form-item>
      <el-form-item v-if="data.id">
        <button-action-authenticated :permission="['settings/mobilebanner', 'destroy']" @click="remove" type="danger" plain icon="el-icon-delete" style="width: 100%; background: #fff;">
          {{ $lang[langId].delete }}
        </button-action-authenticated>
      </el-form-item>
    </el-form>
    <div style="text-align: center;">
      <el-button @click="cancel" style="margin-right: 10px;">{{ lang.cancel }}</el-button>
      <button-action-authenticated :permission="['settings/mobilebanner', 'edit']" :disabled="disabledSave" @click="save" type="success" icon="el-icon-check">
        {{ lang.save }}
      </button-action-authenticated>
    </div>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'

export default {
  props: ['saved', 'loading', 'formData'],
  data() {
    return {
      disabledSave: true,
      loadingForm: false,
      loadingProduct: false,
      loadingCollection: false,
      loadingPage: false,
      loadingArticle: false,
      changePhoto: false,
      editForm: false,
      debounce: 300,
      typeLink: null,
      productValue: '',
      collectionValue: '',
      pageValue: '',
      articleValue: '',
      data: {},
      headers: {
        'Authorization': 'Bearer ' + this.$store.state.user.token.access_token
      }
    }
  },
  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    token() {
      return this.$store.state.user.token
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    uploadPhotoUrl() {
      return baseApi(this.selectedStore.url_id, this.langId, 'mobilebanner/upload')
    },
    fileList() {
      if (this.data.photo) {
        let fileList = []
        fileList.push({
          url: this.data.photo,
          name: this.data.photo_name
        })
        return fileList
      }
    }
  },
  watch: {
    data: {
      handler(data) {
        if (data.link_type_id && data.link_type_id === 'PGR') {
          if ((data.title && data.title !== '') &&
            (data.product_group_id && data.product_group_id !== null) &&
            (data.photo && data.photo !== '')
          ) {
            this.disabledSave = false
          } else {
            this.disabledSave = true
          }
        } else if (data.link_type_id && data.link_type_id === 'PCL') {
          if ((data.title && data.title !== '') &&
            (data.collection_id && data.collection_id !== null) &&
            (data.photo && data.photo !== '')
          ) {
            this.disabledSave = false
          } else {
            this.disabledSave = true
          }
        } else if (data.link_type_id && data.link_type_id === 'PAG') {
          if ((data.title && data.title !== '') &&
            (data.page_id && data.page_id !== null) &&
            (data.photo && data.photo !== '')
          ) {
            this.disabledSave = false
          } else {
            this.disabledSave = true
          }
        } else if (data.link_type_id && data.link_type_id === 'ATT') {
          if ((data.title && data.title !== '') &&
            // (data.article_tag_id && data.article_tag_id !== null) &&
            (data.photo && data.photo !== '')
          ) {
            this.disabledSave = false
          } else {
            this.disabledSave = true
          }
        } else if (data.link_type_id && data.link_type_id === 'EXL') {
          if ((data.title && data.title !== '') &&
            (data.photo && data.photo !== '')
          ) {
            this.disabledSave = false
          } else {
            this.disabledSave = true
          }
        } else {
          if ((data.title && data.title !== '') &&
            (data.photo && data.photo !== '')) {
            this.disabledSave = false
          } else {
            this.disabledSave = true
          }
        }
      },
      deep: true
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
        this.data = { ...data }
        if (data.id) {
          this.editForm = true
        }
        if (data.id && data.link_type_id === 'PGR') {
          this.data.product_group_id = data.link_id
          delete this.data.link_id
          this.productValue = data.link_name
        } else if (data.id && data.link_type_id === 'PCL') {
          this.data.collection_id = data.link_id
          delete this.data.link_id
          this.collectionValue = data.link_name
        } else if (data.id && data.link_type_id === 'PAG') {
          this.data.page_id = data.link_id
          delete this.data.link_id
          this.pageValue = data.link_name
        } else if (data.id && data.link_type_id === 'ATT') {
          this.data.article_tag_id = data.link_id
          delete this.data.link_id
          this.articleValue = data.link_name
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    getTypeLink: function() {
      this.loadingForm = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'mobilenav/gettypelink'),
        headers: headers
      })
        .then(response => {
          this.typeLink = response.data.data
          this.loadingForm = false
        })
        .catch(error => {
          this.loadingForm = false
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        })
    },
    searchProduct(queryString, callback) {
      // let str = typeof queryString === 'string'
      // let num = typeof queryString === 'number'
      this.loadingProduct = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        sort_column: 'name',
        sort_type: 'asc',
        search: queryString
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productsearch'),
        headers: headers,
        params: params
      })
        .then(response => {
          this.loadingProduct = false
          for (let i of response.data.data) {
            i.value = i.name
          }
          this.searchResultProduct = response.data.data
          callback(this.searchResultProduct)
        })
        .catch(error => {
          console.log(error)
        })
    },
    searchProductGroup(queryString, callback) {
      // let str = typeof queryString === 'string'
      // let num = typeof queryString === 'number'
      this.loadingProduct = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        sort_column: 'name',
        sort_type: 'asc',
        search: queryString
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productgroup'),
        headers: headers,
        params: params
      })
        .then(response => {
          this.loadingProduct = false
          for (let i of response.data.data) {
            i.value = i.name
          }
          this.searchResultProduct = response.data.data
          callback(this.searchResultProduct)
        })
        .catch(error => {
          console.log(error)
        })
    },
    searchCollection(queryString, callback) {
      this.loadingCollection = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        sort_column: 'name',
        sort_type: 'asc',
        search: queryString
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'collection'),
        headers: headers,
        params: params
      })
        .then(response => {
          this.loadingCollection = false
          for (let i of response.data.data) {
            i.value = i.name
          }
          this.searchResultCollection = response.data.data
          callback(this.searchResultCollection)
        })
        .catch(error => {
          console.log(error)
        })
    },
    searchPageWeb(queryString, callback) {
      this.loadingPage = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search: queryString
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'page'),
        headers: headers,
        params: params
      })
        .then(response => {
          this.loadingPage = false
          for (let i of response.data.data) {
            i.value = i.title
          }
          this.searchResultPage = response.data.data
          callback(this.searchResultPage)
        })
        .catch(error => {
          console.log(error)
        })
    },
    searchArticle(queryString, callback) {
      this.loadingArticle = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search: queryString
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'article'),
        headers: headers,
        params: params
      })
        .then(response => {
          this.loadingArticle = true
          for (let i of response.data.data) {
            i.value = i.title
          }
          this.searchResultArticle = response.data.data
          callback(this.searchResultArticle)
        })
        .catch(error => {
          console.log(error)
        })
    },
    handleSelect(block, item) {
      console.log('item', item)
      if (block === 'product') {
        this.data.product_group_id = item.id
      } else if (block === 'collection') {
        this.data.collection_id = item.id
      } else if (block === 'page') {
        this.data.page_id = item.id
      } else if (block === 'article') {
        this.data.article_tag_id = item.id
      }
      this.disabledSave =  false
    },
    clearSearch(block, data) {
      if (block === 'product') {
        this.data.product_group_id = null
        this.productValue = ''
      } else if (block === 'collection') {
        this.data.collection_id = null
        this.collectionValue = ''
      } else if (block === 'page') {
        this.data.page_id = null
        this.pageValue = ''
      } else if (block === 'article') {
        data.article_tag_id = null
        this.articleValue = ''
      }
    },
    handleUploadFailed(error) {
      this.$notify({
        type: 'warning',
        title: error.response.data.error.message,
        message: error.response.data.error.error
      })
    },
    handleUploadSuccess(response) {
      this.$set(this.data, 'photo', response.data[0].photo_md)
      this.$set(this.data, 'photo_name', response.data[0].file_name)
      this.changePhoto = false
    },
    cancel() {
      this.data = {}
      this.$emit('cancel')
    },
    save() {
      this.disabledSave = true
      let data = Object.assign({}, this.data)
      this.$emit('save', data)
    },
    remove() {
      this.$emit('remove', { id: this.data.id })
    }
  },
  mounted() {
    this.getTypeLink()
  }
}
</script>

