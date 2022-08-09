<template>
  <div>
    <el-card v-if="!showForm" class="box-card" v-loading="loading">
      <div slot="header">
        <div class="row">
          <div class="col-sm-7">
            <h4>{{ $lang[langId].list }} {{ lang.f_a_q }}</h4>
            <p>{{ params.total }} {{ lang.f_a_q }}</p>
          </div>
          <div class="col-sm-5 text-right">
            <button-action-authenticated
              :permission="['website/faqs', 'store']"
              type="success"
              icon="el-icon-plus"
              @click="formHandle('add')">
              {{ lang.add }}
            </button-action-authenticated>
          </div>
        </div>
      </div>

      <div class="card-body">
        <el-collapse v-model="activeLabel">
          <el-collapse-item
            v-for="item in tableData"
            :key="item.id"
            :name="item.id">
            <div slot="title" class="flex-container">
              <div class="mr-8">
                {{item.question}}
              </div>
              <button-action-authenticated
                :permission="['website/faqs', 'edit']"
                type="text"
                size="mini"
                @click="edit(item)"
                icon="el-icon-edit-outline">
                {{ lang.edit }}
              </button-action-authenticated>
            </div>
            <div>{{item.answer}}</div>
          </el-collapse-item>
        </el-collapse>
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
import ItemForm from './Form'
const apiEndpoint = 'faq/'

export default {
  components: {
    ItemForm
  },

  data() {
    return {
      loading: true,
      tableData: [],
      tmp: {},
      activeLabel: '',
      showForm: false,
      saved: false,
      params: {
        per_page: 100,
        total: 0
      },
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
      this.tableData = []
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
        this.tableData = response.data.data
        this.params.total = response.data.meta.total
        this.loading = false
      }).catch(error => {
        this.loading = false
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
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
        this.tableData = []
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
    }
  },

  mounted() {
    this.getData()
  }
}
</script>
