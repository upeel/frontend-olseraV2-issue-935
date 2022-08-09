<template>
  <div v-loading="loading">
    <el-card class="box-card" v-if="!showForm">
      <div slot="header" class="clearfix">
        <div class="row">
          <div class="col-sm-7">
            <h4>{{ $lang[langId].list }} {{ lang.testimonial }}</h4>
            <p>{{ params.total }} {{ lang.testimonial }}</p>
          </div>
          <div class="col-sm-5 text-right">
            <button-action-authenticated
              :permission="['website/testimonial', 'store']"
              type="success"
              icon="el-icon-plus"
              size="small"
              @click="add"
              :disabled="disabledButton">
              {{ lang.add }}
            </button-action-authenticated>
          </div>
        </div>
      </div>

      <div class="card-body">
        <draggable
          :options="{group:{ name:'testimonials'}}"
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
            {{ this.$lang[langId].load_more }}
          </el-button>
        </div>
      </div>
    </el-card>

    <item-form
      v-if="showForm"
      :saved="saved"
      :loading="loading"
      :form-data="tmp"
      @remove="remove"
      @save="save"
      @cancel="cancel">
    </item-form>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import draggable from 'vuedraggable'
import ItemForm from './Form'
import List from './List'
const apiEndpoint = 'testimonial/'

export default {
  components: {
    ItemForm,
    List,
    draggable
  },

  data() {
    return {
      loading: true,
      data: [],
      tmp: {},
      activeLabel: '',
      showForm: false,
      saved: false,
      params: {
        per_page: 100
      },
      disabledButton: false,
      moreLink: '',
      saved: false
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
      this.data = []
      this.params.total = 0
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
        this.params.total = response.data.meta.total
        this.loading = false
      }).catch(error => {
        this.loading = false
        // this.$notify({
        //   type: 'warning',
        //   title: error.response.data.error.message,
        //   message: error.response.data.error.error
        // })
      })
    },
    edit(data) {
      this.tmp = {...data}
      this.showForm = true
    },
    add() {
      this.showForm = true
    },
    cancel() {
      this.showForm = false
      this.tmp = {}
    },
    save(data) {
      this.loading = true

      let method = 'POST'
      let id = ''

      if (data.id) {
        method = 'PUT'
        id = data.id
      }

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
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint + data.id),
        headers: headers
      }).then(response => {
        this.tmp = {}
        this.saved = true
        this.showForm = false
        this.getData()
        this.$message({
          type: 'success',
          message: 'saved'
        })
      }).catch(error => {
        this.saved = false
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
      this.loading = true
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
        this.loading = true
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
    }
  },

  mounted() {
    this.getData()
  }
}
</script>
