<template>
  <div>
    <el-card
      v-if="!showForm && !showGroupTable"
      v-loading="loading" class="box-card">
      <div slot="header" class="clearfix">
        <el-row :gutter="10">
          <el-col :md="12">
            <h4>{{ lang.reseller_type }}</h4>
            <p>{{ params.total }} {{ lang.reseller_type }}</p>
          </el-col>
          <el-col :md="12" class="text-right">
            <el-button
              :disabled="disabledSave"
              size="small"
              @click="add"
              type="success"
              icon="el-icon-plus">
              {{ lang.add }}
            </el-button>
          </el-col>
        </el-row>
      </div>

      <div class="card-body">

        <el-row :gutter="10">
          <el-col :md="8" v-for="(item, key) in data" :key="key">
            <el-card class="box-customer-type box-card">
              <div slot="header">
                <el-row :gutter="10" v-if="!isEditing[key].editing">
                  <el-col :span="18">
                    <span>{{item.name}}</span>
                  </el-col>
                  <el-col :span="6" class="text-right">
                    <el-dropdown trigger="click">
                      <el-button type="text">
                        <svg-icon icon-class="more-vertical"></svg-icon>
                      </el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                          <el-button type="text" @click="editField(item, key)" class="edit-button" icon="el-icon-edit">
                            {{ lang.edit }}
                          </el-button>
                        </el-dropdown-item>
                        <el-dropdown-item :divided="true">
                          <el-button type="text" @click="confirmRemove(item, key)" class="delete-button" icon="el-icon-delete">
                            {{ rootLang.delete }}
                          </el-button>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                </el-row>

                <div v-if="isEditing[key].editing"
                  class="floating-editor-contenteditable">
                  <el-input size="mini" type="text" v-model="tmp.name"></el-input>
                  <div class="buttons">
                    <el-button
                      type="text"
                      size="mini"
                      @click="cancelManageRow(key)">
                      {{ lang.cancel }}
                    </el-button>
                    <el-button
                      type="success"
                      size="mini"
                      @click="saveField(tmp, key)">
                      {{ lang.save }}
                    </el-button>
                  </div>
                </div>
              </div>
              <div class="card-body text-center">
                <router-link :to="'/website/reseller/resellertypes/' + item.id">
                  <i class="fa fa-tags" aria-hidden="true"></i> {{ item.group.length }}
                </router-link>
              </div>
            </el-card>
          </el-col>
        </el-row>

      </div>
    </el-card>

    <type-form
      v-if="showForm"
      :saved="saved"
      :loading="loading"
      @save="save"
      @cancel="cancel">
    </type-form>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import TypeForm from './Form'

const apiEndPoint = 'reseller/type/'

export default {
  data: function() {
    return {
      loading: true,
      saved: false,
      data: [],
      isEditing: [],
      showForm: false,
      disabledButton: false,
      tmp: {},
      status: [
        {
          id: 'A',
          label: 'ACTIVE'
        },
        {
          id: 'I',
          label: 'INACTIVE'
        },
        {
          id: 'P',
          label: 'PENDING'
        }
      ],
      params: {
        search: '',
        per_page: 30,
        sort_column: 'id',
        sort_type: 'desc'
      }
    }
  },

  components: {
    TypeForm
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
    }
  },

  watch: {
    '$store.getters.selectedStore': function() {
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
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint),
        params: this.params,
        headers: headers
      }).then(response => {
        this.data = response.data.data
        this.data.map(item => {
          this.isEditing.push({
            editing: false
          })
        })
        this.params.total = response.data.meta.total
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.$notify({
          type: 'warning',
          title: 'Error',
          message: error.response.data.error.error
        })
      })
    },
    add() {
      this.showForm = true
      this.isEditing.map(item => {
        item.editing = false
      })
    },
    editField(data, index) {
      this.isEditing.map(item => {
        item.editing = false
      })
      this.isEditing[index].editing = true
      this.tmp = {...data}
    },
    saveField(data, index) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + 'update/' + data.id),
        headers: headers,
        data
      }).then(response => {
        this.saved = true
        this.cancelManageRow(index)
        this.getData()
        this.$message({
          type: 'success',
          message: 'saved'
        })
      }).catch(error => {
        this.saved = false
        this.loading = false
        this.isEditing = []
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    save(data) {
      let method = 'POST'
      let verb = 'store'
      let id = ''

      if (data.id) {
        method = 'PUT'
        verb = 'update'
        id = data.id
      }

      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method,
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + verb + '/' + id),
        headers: headers,
        data
      }).then(response => {
        let data = response.data.data
        this.data.unshift(data)

        this.isEditing = []
        this.data.map(item => {
          this.isEditing.push({editing: false})
        })

        this.showForm = false
        this.saved = true
        this.loading = false
        this.$message({
          type: 'success',
          message: 'saved'
        })
      }).catch(error => {
        this.saved = false
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    confirmRemove(data, index) {
      this.$confirm(this.lang.are_you_sure_to_remove_this_data, 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: this.lang.cancel,
        type: 'warning'
      }).then(() => {
        this.remove(data, index)
      }).catch(() => {
      })
    },
    remove(data, key) {
      this.loading = true
      this.disableRemove = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + 'delete/' + data.id),
        headers
      }).then(response => {
        this.data.splice(key, 1)
        this.disableRemove = false
        this.loading = false
        this.$message({
          type: 'success',
          message: response.data.data.message
        })
      }).catch(error => {
        this.disableRemove = false
        this.loading = false
        if (error.response) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
      })
    },
    cancel() {
      this.tmp = {}
      this.showForm = false
      this.showGroupTable = false
    },
    cancelManageRow(key) {
      this.tmp = {}
      this.isEditing[key].editing = false
    }
  },

  mounted() {
    this.getData()
  }
}
</script>
