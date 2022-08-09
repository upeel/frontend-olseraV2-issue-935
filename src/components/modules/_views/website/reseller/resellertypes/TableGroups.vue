<template>
  <div v-loading="loading">
    <el-row :gutter="10">
      <el-col :md="16">
        <el-card v-if="!showForm" class="box-card">
          <div slot="header">
            <el-row :gutter="10">
              <el-col :md="8">
                <h4>{{ lang.add_reseller_type }}: {{data.name}}</h4><br/>
                <p v-if="data.group">{{data.group.length}} {{ lang.items }}</p>
              </el-col>
              <el-col :md="16" class="text-right">
                <el-button
                  size="small"
                  @click="back"
                  icon="el-icon-back"
                  type="text">
                  {{ lang.back }}
                </el-button>
                <el-button
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
            <el-table :data="data.group" stripe>
              <el-table-column
                :label="lang.product_groups"
                prop="product_group_name">
              </el-table-column>
              <el-table-column
                :label="lang.discount_percent"
                prop="discount">
              </el-table-column>
              <el-table-column
                :label="this.$lang[langId].action">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" :content="rootLang.discount_bulk_edit" placement="top-start">
                    <el-button size="mini"
                      type="info"
                      class="btn-plain"
                      icon="el-icon-edit"
                      @click="edit(scope.row)">
                    </el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>

        <form-group
          v-if="showForm"
          @remove="remove"
          @cancel="cancelEditGroup"
          @save="save"
          @updategroups="updateProductGroup"
          :loading="formLoading"
          :form-data="editingGroups"
          :saved="formSaved">
        </form-group>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import FormGroup from './FormGroup'
const apiEndPoint = 'reseller/type'

export default {
  components: {
    FormGroup
  },

  data() {
    return {
      loading: false,
      formLoading: false,
      formSaved: false,
      disabledSave: true,
      dialogVisible: false,
      groupRemoved: false,
      data: [],
      showForm: false,
      editingGroups: {}
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
    rootLang() {
      return this.$lang[this.$store.state.userStores.langId]
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
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + '/' + this.$route.params.id),
        headers
      }).then(response => {
        this.data = response.data.data
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
    edit(row) {
      let editingDiscount = row.discount
      let groups = [...this.data.group]
      let editingGroups = []
      groups.map(item => {
        if (item.discount === editingDiscount) {
          editingGroups.push(item)
        }
      })
      this.editingGroups = {
        discount: editingDiscount,
        group_ids: [...editingGroups],
        name: this.data.name,
        id: this.data.id
      }
      this.showForm = true
    },
    add() {
      this.editingGroups = {
        discount: '',
        group_ids: [],
        name: this.data.name,
        id: this.data.id
      }
      this.showForm = true
    },
    cancelEditGroup() {
      this.getData()
      this.editingGroups = {}
      this.showForm = false
    },
    back() {
      this.$router.push({path: '/website/reseller/resellertypes'})
    },
    save(data) {
      this.formLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + '/' + 'addproductgroup/' + this.data.id),
        headers,
        data
      }).then(response => {
        this.formSaved = true
        this.cancelEditGroup()
        this.data = response.data.data
        this.formLoading = false
      }).catch(error => {
        this.formLoading = false
        this.$notify({
          type: 'warning',
          title: 'Error',
          message: error.response.data.error.error
        })
      })
    },
    updateProductGroup(data) {
      this.formLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let promise = new Promise((resolve, reject) => {
        axios({
          method: 'PUT',
          url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + '/' + 'updateproductgroup/' + data.id),
          headers,
          data
        }).then((response) => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
      promise.then(response => {
        this.getData()
        this.formLoading = false
        this.showForm = false
        this.saved = true
      }).catch(error => {
        this.formLoading = false
        this.$notify({
          type: 'warning',
          title: 'Error',
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
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + '/' + 'deleteproductgroup/' + data.id),
        headers
      }).then(response => {
        this.editingGroups.splice(this.editingGroups.indexOf(data.key), 1)
        this.$message({
          type: 'success',
          message: response.data.data
        })
      }).catch(error => {
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
