<template>
  <div v-loading="loading">
    <el-row :gutter="10">
      <el-col
        v-if="checkCustomPermission('website/storestockrefs', 'store')"
        :md="10">
        <group-form
          @save="save"
          :loading="loading"
          :saved="saved">
        </group-form>
      </el-col>

      <el-col :md="14">
        <el-card>
          <div slot="header" class="clearfix">
            <h4>{{ lang.registered }}</h4>
          </div>

          <div class="card-body">
            <el-table :data="data" stripe max-height="250">
              <el-table-column
                prop="name"
                :label="lang.name"
                width="160">
              </el-table-column>
							<el-table-column
                prop="url_id"
                :label="rootLang.url_id"
                width="160">
              </el-table-column>
              <el-table-column
                prop="alias"
                :label="rootLang.alias"
                width="80">
                <template slot-scope="scope">
                  <span
                    v-if="!isEditing[scope.$index].editing"
                    class="editable"
                    @click="edit(scope.row, scope.$index)">
                    {{scope.row.alias}}
                  </span>
                  <div class="form-in-cell" v-if="isEditing[scope.$index].editing">
                    <el-input type="text" size="mini" v-model="tmp.alias"></el-input>
                    <el-button size="mini" icon="el-icon-close"
                      @click="cancelManageItems(scope.$index)"
                      type="info">
                    </el-button>
                    <el-button size="mini" icon="el-icon-check"
                      @click="save(tmp, scope.$index)"
                      type="success">
                    </el-button>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                :label="rootLang.action">
                <template slot-scope="scope">
                  <button-action-authenticated
                    :permission="['website/storestockrefs', 'destroy']"
                    v-if="selectedStore.store_id !== scope.row.id"
                    @click="remove({id: scope.row.id}, scope.$index)"
                    type="danger"
                    class="btn-plain"
                    icon="el-icon-delete"
                    size="mini">
                  </button-action-authenticated>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import GroupForm from './Form'
const apiEndPoint = 'storestockrefs/'
import { checkCustomPermission } from '@/mixins/checkCustomPermission'

export default {
  mixins: [checkCustomPermission],
  data: function() {
    return {
      loading: true,
      saved: false,
      tmp: {},
      data: [],
      isEditing: [],
      disabledButton: false
    }
  },

  components: {
    GroupForm
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
        this.data.map(() => {
          this.isEditing.push({
            editing: false
          })
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
    save(data, idx) {
      let method = 'POST'
      let verb = 'store'
      let id = ''

      if (data.id) {
        method = 'PUT'
        verb = 'updatealias'
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
        this.getData()
        this.saved = true
        this.isEditing[idx].editing = false
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
    remove(data, index) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + 'delete/' + data.id),
        headers
      }).then(response => {
        this.loading = false
        this.data.splice(index, 1)
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
        this.loading = false
      })
    },
    edit(row, index) {
      this.tmp = {}
      this.isEditing.map(item => {
        item.editing = false
      })
      this.isEditing[index].editing = true
      this.tmp = Object.assign({}, row)
    },
    cancelManageItems(index) {
      this.isEditing[index].editing = false
      this.tmp = {}
    }
  },

  mounted() {
    this.getData()
  }
}
</script>
