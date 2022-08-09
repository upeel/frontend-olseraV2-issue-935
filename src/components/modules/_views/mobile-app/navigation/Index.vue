<template>
  <div class="content-wrapper">
    <section class="content">
      <div v-loading="loading">
        <el-card class="box-card">
          <div slot="header" class="table-handler-flex">
            <h4 style="flex-grow: 1">{{ lang.navigation }}</h4>
            <button-action-authenticated
              :permission="['settings/mobilenav', 'store']"
              type="success"
              icon="el-icon-plus"
              size="small"
              @click="add"
              :disabled="disabledButton">
              {{ lang.add }}
            </button-action-authenticated>
          </div>

          <div class="card-body">
            <draggable
              :option="{group: { name: 'mobileapp'}}"
              class="dd-list dragArea"
              v-model="data"
              @change="saveSorts">
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

        <el-dialog :title="labelDialog" :visible.sync="showForm" width="50%" :close-on-click-modal="false" :show-close="false">
          <div class="dialog-body" style="padding-bottom: 10px;">
            <item-form
              v-if="showForm"
              :saved="saved"
              :form-data="tmp"
              @cancel="cancel"
              @save="save"
              @remove="remove">
            </item-form>
          </div>
        </el-dialog>
      </div>
    </section>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import draggable from 'vuedraggable'
import List from './List'
import ItemForm from './Form'
const apiEndpoint = 'mobilenav/'

export default {
  name: 'Navigation',
  components: {
    draggable,
    List,
    ItemForm
  },
  data() {
    return {
      loading: false,
      loadingItems: false,
      showForm: false,
      disabledButton: false,
      saved: false,
      data: [],
      tmp: {},
      labelDialog: '',
      moreLink: null,
      params: {
        per_page: 100
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
    }
  },
  watch: {
    'store.getters.selectedStore': function () {
      this.getData()
    }
  },
  methods: {
    getData: function () {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint),
        headers: headers,
        params: this.params
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
    getSingleData(id) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint + 'detail/' + id),
        headers: headers
      }).then(response => {
        this.tmp = response.data.data
        this.loading = false
        this.showForm = true
      }).catch(error => {
        this.loading = false
        this.showForm = false
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
        Authorization: 'Bearer ' + window.access_token
      }
      axios({
        method: 'GET',
        url: this.moreLink,
        params: this.params,
        headers: headers
      }).then(response => {
        this.data = this.data.concat(response.data.data)
        this.moreLink = response.data.links.next
        this.loadingItems = false
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
    saveSorts() {
      this.loading = true
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
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint + 'sorting'),
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
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    add() {
      this.labelDialog = this.lang.add + ' ' + this.lang.navigation
      this.showForm = true
    },
    edit(item) {
      this.labelDialog = this.lang.edit + ' ' + this.lang.navigation
      let id = item.id
      this.getSingleData(id)
    },
    cancel() {
      this.showForm = false
      this.tmp = {}
    },
    save(val) {
      let saveData = val
      if (val.id) {
        this.$set(saveData, 'id', val.id)
      }
      if (val.link_type_id === 'PGR') {
        this.$set(saveData, 'product_group_id', val.product_group_id)
      } else if (val.link_type_id === 'PCL') {
        this.$set(saveData, 'collection_id', val.collection_id)
      } else if (val.link_type_id === 'PAG') {
        this.$set(saveData, 'page_id', val.page_id)
      } else if (val.link_type_id === 'ATT') {
        this.$set(saveData, 'article_tag_id', val.article_tag_id)
      } else if (val.link_type_id === 'EXL') {
        this.$set(saveData, 'link_url', val.link_url)
      }
      this.saveNavigation(saveData)
    },
    saveNavigation(saveData) {
      this.loading = true
      let data = saveData

      let method = 'POST'
      let id = ''
      let verb = 'store'

      if (saveData.id) {
        method = 'PUT'
        id = saveData.id
        verb = 'update/'
      }

      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method,
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint + verb + id),
        headers: headers,
        data
      }).then(response => {
        this.tmp = {}
        this.saved = true
        this.showForm = false
        this.loading = false
        this.getData()
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
    remove(data) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint + 'delete/' + data.id),
        headers: headers
      }).then(response => {
        this.tmp = {}
        this.showForm = false
        this.saved = true
        this.$message({
          type: 'success',
          message: 'saved'
        })
        this.getData()
      }).catch(error => {
        this.saved = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    }
  },
  mounted() {
    this.getData()
  }
}
</script>
