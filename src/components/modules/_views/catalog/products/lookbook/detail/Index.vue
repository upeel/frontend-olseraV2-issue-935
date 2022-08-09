<template>
  <div class="content-wrapper">
    <section class="content">
      <el-row :gutter="10">
        <el-col :md="16">
          <el-card v-loading="loading" class="box-card">
            <div slot="header" class="table-handler-flex">
              <h4 style="flex-grow: 1;">{{data.name}}</h4>
              <div>
                <template v-if="!isEditing">
                  <el-button
                    size="small"
                    type="success"
                    plain
                    @click="backToList">
                    {{ lang.back }}
                  </el-button>
                  <button-action-authenticated
                    :permission="['catalog/lookbook', 'edit']"
                    icon="el-icon-edit"
                    type="primary"
                    size="small"
                    @click="edit">
                    {{ lang.edit }}
                  </button-action-authenticated>
                </template>
                <template v-else>
                  <el-button
                    type="info"
                    size="small"
                    plain
                    @click="cancelEdit">
                    {{ lang.cancel }}
                  </el-button>
                  <el-button
                    :disabled="disabledButton"
                    icon="el-icon-check"
                    type="success"
                    size="small"
                    @click="handleSaveInfo">
                    {{ lang.save }}
                  </el-button>
                </template>
              </div>
            </div>

            <div class="card-body">
              <div class="row">
                <div class="col-md-3">
                  <div class="package-img">
                    <template v-if="changePhoto">
                      <el-upload
                        style="width: 100%; max-width: 100%;"
                        drag
                        :file-list="fileList"
                        :action="uploadPhotoUrl"
                        :data="{id: data.id}"
                        :headers="headers"
                        :on-error="handleUploadFailed"
                        :on-success="handleUploadSuccess"
                        :before-upload="beforeUpload">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">{{ this.$lang[langId].drop_file_or_click }}</div>
                      </el-upload>
                      <el-button
                        @click="changePhoto = false"
                        icon="el-icon-close"
                        type="text"
                        class="btn-block">
                        {{ lang.cancel }}
                      </el-button>
                    </template>
                    <template v-else>
                      <img style="margin-bottom: 12px;" :src="data.photo_md" :alt="data.name" />
                      <button-action-authenticated
                        :permission="['catalog/lookbook', 'edit']"
                        @click="changePhoto = true"
                        icon="el-icon-picture"
                        type="info"
                        class="btn-block">
                        {{ lang.change_photo }}
                      </button-action-authenticated>
                    </template>
                  </div>
                </div>

                <div v-if="!changePhoto" class="col-md-9">
                  <div class="detail-section">
                    <div class="detail-item">
                      <div class="detail-label">
                        <small>{{ lang.product_combo_name }}</small>
                      </div>
                      <div class="detail-value">
                        <template v-if="isEditing">
                          <el-input size="mini" type="text" v-model="tmpE.name" />
                        </template>
                        <template v-else>
                          {{data.name}}
                        </template>
                      </div>
                    </div>

                    <div class="detail-item">
                      <div class="detail-label">
                        <small>{{ lang.group }}</small>
                      </div>
                      <div class="detail-value">
                        <template v-if="isEditing">
                          <el-select
                            style="width: 100%;"
                            v-model="tmpE.look_book_group_id"
                            filterable
                            allow-create
                            :placeholder="this.$lang[langId].please_input+lang.look_book_group">
                            <el-option
                              v-for="item in searchResultLookbookGroups"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id">
                            </el-option>
                          </el-select>
                        </template>
                        <template v-else>
                          {{data.group_name}}
                        </template>
                      </div>
                    </div>

                    <div class="detail-item">
                      <div class="detail-label">
                        <small>{{ lang.published }}</small>
                      </div>
                      <div class="detail-value">
                        <template v-if="isEditing">
                          <el-switch v-model="tmpE.published"
                            :active-value="1" :inactive-value="0">
                          </el-switch>
                        </template>
                        <template v-else>
                          <template v-if="data.published === 1">
                            {{ lang.yes }}
                          </template>
                          <template v-else>
                            {{ lang.not_published_yet }}
                          </template>
                        </template>
                      </div>
                    </div>

                    <div class="detail-item">
                      <div class="detail-value">
                        <button-action-authenticated
                          :permission="['catalog/lookbook', 'destroy']"
                          :disabled="disabledButton"
                          type="bordered-danger"
                          @click="remove"
                          icon="el-icon-delete">
                          {{ $lang[langId].delete }}
                        </button-action-authenticated>
                      </div>
                    </div>
                  </div><!-- .detail-section -->
                </div><!-- .col-md-9 -->
              </div><!-- .row -->
            </div><!-- .card-body -->
          </el-card>
        </el-col>

        <el-col :md="8">
          <el-card v-loading="loading" class="box-card">
            <div slot="header" class="clearfix">
              <h4>{{ $lang[langId].product_in_lookbook }}</h4>
            </div>

            <div class="card-body">
              <button-action-authenticated
                :permission="['catalog/lookbook', 'edit']"
                style="margin-bottom: 12px;"
                type="default"
                class="btn-block btn-grey"
                icon="el-icon-plus"
                @click="dialogAddItemFormVisible = true">
                {{ lang.add_product }}
              </button-action-authenticated>
              <draggable
                :options="{group:{ name:'packages'}}"
                class="dd-list dragArea"
                v-model="items"
                @change="handleSaveSorts">
                <div class="dd-item" v-for="(item) in items" :key="item.id">
                  <list :item="item" />
                </div>
              </draggable>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <el-dialog
      :title="lang.manage"
      v-loading="loading"
      :visible.sync="dialogFormVisible">
      <template v-if="items.length > 0">
        <div v-for="(item) in tmp.items" :key="item.id">
          <edit-list
            @remove="handleRemoveItem"
            @data-changes="handleDataChanges"
            :item-removed="state.itemRemoved"
            :item="item" />
        </div>
      </template>
      <template v-else>
        <el-tag type="warning">{{ this.$lang[langId].no_product_in_combo }}</el-tag>
      </template>
      <div slot="footer" class="align-right text-right">
        <el-button
          type="success"
          :disabled="disabledButton"
          @click="saveManageItems">
          {{ lang.save }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      v-loading="loading"
      :visible.sync="dialogAddItemFormVisible"
      :title="lang.add"
      :show-close="false">
      <add-item
        @save="handleAddItem"
        @cancel="dialogAddItemFormVisible = false"
      />
    </el-dialog>
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import { baseApi } from 'src/http-common'
import axios from 'axios'
import draggable from 'vuedraggable'
import EditList from './_editList'
import List from './List'
import AddItem from './AddItem'

export default {
  data() {
    return {
      loading: false,
      disabledSave: true,
      data: {},
      items: [],
      enabledSaveSort: false,
      savingSorts: false,
      itemAdded: false,
      disabledButton: false,
      isEditing: false,
      dialogFormVisible: false,
      dialogAddItemFormVisible: false,
      dataGoingToSave: [],
      changePhoto: false,
      searchingLookbookGroups: false,
      searchResultLookbookGroups: [],
      tmpE: {
      },
      state: {
        itemRemoved: false
      },
      headers: {
        'Authorization': 'Bearer ' + this.$store.state.user.token.access_token
      }
    }
  },

  mixins: [basicComputedMixin],

  components: {
    draggable,
    EditList,
    List,
    AddItem
  },

  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    uploadPhotoUrl() {
      return baseApi(this.selectedStore.url_id, this.langId, 'lookbook/upload')
    },
    tmp() {
      return {
        items: this.items
      }
    },
    fileList() {
      if (this.data.photo_md) {
        let fileList = []
        fileList.push({
          url: this.data.photo_md,
          name: this.data.photo
        })
        return fileList
      }
    },
    token() {
      return this.$store.state.user.token
    }
  },
  
  beforeMount() {
    this.handleCustomPermissionSinglePage('catalog/lookbook', 'show')
  },

  methods: {
    loadData() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'lookbook/' + this.$route.params.id),
        headers
      }).then(response => {
        this.data = response.data.data
        this.items = this.data.relateds
        this.loading = false
        console.log(this.items)
      }).catch((error) => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.data = {}
        this.loading = false
      })
    },
    handleUploadFailed(error) {
      this.$notify({
        type: 'warning',
        title: error.response.data.error.message,
        message: error.response.data.error.error
      })
    },
    handleUploadSuccess(response) {
      this.data = response.data
      this.changePhoto = false
    },
    handleSaveInfo() {
      let data = {...this.tmpE}
      data.relateds = [...this.items]
      data.relateds = data.relateds.map(item => {
        return item.id
      })
      let body = {
        // look_book_group_id: [data.look_book_group_id],
        look_book_group_id: data.look_book_group_id,
        name: data.name,
        published: data.published,
        relateds: data.relateds.join(',')
      }
      this.saveEdit(body)
    },
    handleAddItem(data) {
      //
      this.itemAdded = false
      this.tmpE = Object.assign({}, this.data)

      let newItems = [...data.items]
      let items = [...this.items]
      items = items.map(item => {
        return item.id
      })
      items = [...items, ...newItems]
      items = items.join(',')
      let body = {
        name: this.data.name,
        relateds: items,
        // look_book_group_id: [this.data.look_book_group_id]
        look_book_group_id: this.data.look_book_group_id
      }
      this.saveEdit(body)
    },
    handleSaveSorts(value) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let sortedIds = [...this.items]
      sortedIds = sortedIds.map(item => {
        let data = {
          id: item.id,
          name: item.product_name
        }
        return data
      })
      let data = {
        id: this.data.id,
        sorted_ids: sortedIds
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'lookbook/sorting'),
        headers: headers,
        data
      }).then(response => {
        this.data = response.data.data
        this.loading = false
        this.$message({
          type: 'success',
          message: 'Success'
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
    remove() {
      this.loading = true
      //
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'delete',
        url: baseApi(this.selectedStore.url_id, this.langId, 'lookbook/' + this.data.id),
        headers
      }).then(() => {
        this.$message({
          type: 'success',
          message: 'Success'
        })
        this.$router.push({ path: '/catalog/lookbook' })
      }).catch((error) => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loading = false
      })
    },
    edit() {
      this.isEditing = true
      this.tmpE = Object.assign({}, this.data)
    },
    cancelEdit() {
      this.isEditing = false
    },
    saveEdit(data) {
      this.loading = true
      this.disabledButton = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'lookbook/' + this.data.id),
        headers,
        data
      }).then(response => {
        this.$message({
          type: 'success',
          message: 'success'
        })
        this.data = response.data.data
        this.loading = false
        this.isEditing = false
        this.disabledButton = false
        this.dialogAddItemFormVisible = false
        this.loadData()
      }).catch((error) => {
        if (error.response) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
        this.loading = false
        this.isEditing = false
        this.disabledButton = false
      })
    },
    handleManageItems() {
      this.dialogFormVisible = true
    },
    handleRemoveItem(id) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'lookbook/removeitem'),
        headers,
        data: {
          id: this.data.id,
          pk: id
        }
      }).then(response => {
        this.$message({
          type: 'success',
          title: 'Success',
          message: 'Success'
        })
        this.data = response.data.data
        this.items = this.data.items.data
        this.state.itemRemoved = true
      }).catch((error) => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.state.itemRemoved = false
      })
    },
    handleDataChanges(data) {
      this.dataGoingToSave.push(data)
    },
    saveManageItems() {
      console.log(this.dataGoingToSave)
      this.loading = true
      this.disabledButton = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      const promise = new Promise((resolve, reject) => {
        this.dataGoingToSave.forEach((item, idx, arr) => {
          axios({
            method: 'POST',
            url: baseApi(this.selectedStore.url_id, this.langId, 'lookbook/updateitem'),
            headers: headers,
            params: {
              id: this.data.id,
              pk: item.id,
              qty: item.qty,
              product_variant_id: item.product_variant_id
            }
          }).then(() => {
            if (idx === arr.length - 1) resolve()
          }).catch(error => {
            this.$notify({
              type: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error
            })
            reject(error)
          })
        })
      })

      promise.then(() => {
        this.disabledButton = false
        this.dialogFormVisible = false
        this.loading = false
        this.loadData()
        this.$message({
          type: 'success',
          message: 'Update success'
        })
      }).catch(error => {
        this.disabledButton = false
        this.dialogFormVisible = true
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    getLookbookGroups(query) {
      //
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'lookbookgroup'),
          headers: headers,
          params: {
            per_page: 100
          }
      }).then(response => {
        this.loading = false
        this.searchResultLookbookGroups = response.data.data
      })
    },
    backToList() {
      this.$router.push({path: '/catalog/lookbook'})
    },
    beforeUpload(file) {
      const isJpg = file.type === 'image/jpeg'
      const isPng = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJpg && !isPng) {
        this.$message.error(this.$lang[this.langId].error_upload_photo)
      }
      
      if (!isLt2M) {
        this.$message.error(this.rootLang.image_over_size + ' 2MB!')
      }
      return (isJpg || isPng) && isLt2M
    }
  },

  mounted() {
    this.loadData()
    this.getLookbookGroups()
  }
}
</script>
