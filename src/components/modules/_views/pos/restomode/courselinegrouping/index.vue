<template>
  <div v-loading="loading">
    <div class="row">
      <div
        v-if="checkCustomPermission('settings/courselinegroup', 'store')"
        class="col-md-7">
        <group-form
          @save="save"
          :loading="loading"
          :saved="saved">
        </group-form>
      </div>

      <div class="col-md-5">
        <el-card>
          <div slot="header" class="clearfix">
            <h4>{{ $lang[langId].course_line_group }}</h4>
          </div>

          <div class="card-body">
            <draggable
              v-model="data"
              :options="{group:{ name:'collections'}}"
              class="dd-list dragArea"
              @change="sortsChanged">
              <div class="dd-item" v-for="(item) in data" :key="item.id">
                <list :item="item" @edit="edit"></list>
              </div>
            </draggable>

            <div class="load-more" v-if="moreLink" v-loading="loadingItems">
              <el-button
                :disabled="disabledButton"
                @click="loadMore"
                class="btn-block">
                {{ $lang[langId].load_more }}
              </el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <el-dialog
      class="no-header"
      :visible.sync="isEditing"
      width="80%">
      <div class="dialog-body">
        <group-form
          :form-data="singleData"
          @remove="remove"
          @save="save"
          :saved="saved"></group-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { baseApi } from 'src/http-common'
import axios from 'axios'
import GroupForm from './Form'
import List from './List'
const apiEndPoint = 'courselinegroup/'
import { checkCustomPermission } from '@/mixins/checkCustomPermission'

export default {
  mixins: [checkCustomPermission],
  data() {
    return {
      loading: true,
      loadingItems: false,
      saved: false,
      data: [],
      specifications: [],
      singleData: {},
      tmpData: [],
      moreLink: null,
      disabledSaveSorts: true,
      isEditing: false,
      disabledButton: false,
      tmp: {
        data: []
      }
    }
  },

  components: {
    GroupForm,
    draggable,
    List
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
    }
  },

  watch: {
    '$store.getters.selectedStore': function() {
      this.getData()
    }
  },

  methods: {
    getData: function() {
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
        this.moreLink = response.data.links.next
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
    getSingleData(id, resolve, reject) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + id),
        params: this.params,
        headers: headers
      }).then(response => {
        resolve(response.data.data)
      }).catch(error => {
        reject(error)
      })
    },
    sortsChanged(data) {
      if (this.checkCustomPermission('settings/courselinegroup', 'edit')) {
        this.saveSorts()
      }
    },
    edit(item) {
      this.loading = true
      let promise = new Promise((resolve, reject) => {
        this.getSingleData(item.id, resolve, reject)
      })
      promise.then(data => {
        this.singleData = {...data}
        this.isEditing = true
        this.loading = false
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.isEditing = false
        this.loading = false
      })
    },
    save(data) {
      let method = 'POST'
      let verb = 'store'
      let id = ''

      if (data.id) {
        method = 'PUT'
        id = data.id
      }

      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method,
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + id),
        headers: headers,
        data
      }).then(response => {
        this.getData()
        this.saved = true
        this.singleData = {}
        this.loading = false
        this.isEditing = false
        this.$message({
          type: 'success',
          message: 'saved'
        })
      }).catch(error => {
        this.saved = false
        this.loading = false
        this.isEditing = true
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    saveSorts() {
      this.loading = true

      this.disabledSaveSorts = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let sortedIds = [...this.data]
      sortedIds = sortedIds.map((item, idx) => {
        let data = {
          id: item.id
        }
        return data
      })
      let data = {
        sorted_ids: sortedIds
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + 'sorting'),
        headers: headers,
        params: {
          per_page: this.data.length
        },
        data
      }).then(response => {
        this.data = response.data.data
        this.$message({
          type: 'success',
          message: 'Success'
        })
        this.loading = false
      }).catch(error => {
        this.disabledSaveSorts = false
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    loadMore() {
      this.disabledButton = true
      this.loadingItems = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: this.moreLink,
        params: this.params,
        headers: headers
      }).then(response => {
        this.data = this.data.concat(response.data.data)
        this.loadingItems = false
        this.moreLink = response.data.links.next
        this.disabledButton = false
      }).catch(error => {
        this.loadingItems = false
        this.disabledButton = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    remove(data) {
      this.loadingItems = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + data.id),
        headers
      }).then(response => {
        this.data.map((item, idx) => {
          if (item.id === data.id) {
            this.data.splice(idx, 1)
          }
        })
        this.loadingItems = false
        this.isEditing = false
        this.singleData = {}
        this.$message({
          type: 'success',
          message: response.data.data.message
        })
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loadingItems = false
        this.isEditing = true
      })
    },
    cancelManageItems() {
      this.isEditing = false
    }
  },

  mounted() {
    this.getData()
  }
}
</script>
