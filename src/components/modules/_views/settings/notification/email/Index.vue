<template>
  <div>
    <el-card class="box-card" v-if="!showForm">
      <div slot="header" class="clearfix">
        <h4>{{ lang.email_and_notification_templates }}</h4>
      </div>
      <div class="card-body">
        <div class="dd-item" v-for="(item) in data" :key="item.id" style="margin-bottom: 0;">
          <list :item="item" @edit="edit"></list>
        </div>

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
    <item-form
      v-if="showForm"
      :saved="saved"
      :loading="loading"
      :form-data="tmp"
      @cancel="cancel"
      @save="save">
    </item-form>
  </div>
</template>
<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import List from './List'
import ItemForm from './Form'
const apiEndpoint = 'emailnotify/'

export default {
  components: {
    List,
    ItemForm
  },
  data() {
    return {
      loading: true,
      loadingItems: false,
      data: [],
      disabledButton: false,
      moreLink: null,
      tmp: {},
      showForm: false,
      saved: false,
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
    getData() {
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
        headers: headers,
        params: this.params
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
        Authorization: 'Bearer ' + this.token.access_token
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
    edit(item) {
      let id = item.id
      this.getSingleData(id)
    },
    cancel() {
      this.showForm = false
      this.tmp = {}
    },
    save(data) {
      this.loading = true
      let id = data.id

      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint + 'update/' + id),
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
    }
  },
  mounted() {
    this.getData()
  }
}
</script>

