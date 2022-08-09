<template>
  <el-card v-loading="loading" class="box-card">
    <div slot="header" class="table-handler-flex">
      <h4 v-if="!isViewingDetail" style="flex-grow: 1;">{{ lang.add }} {{ lang.product_addon }}</h4>
      <h4 v-else style="flex-grow: 1;">{{ formData.name }}</h4>

      <div>
        <el-button size="small" type="text" @click="cancel">{{ lang.cancel }}</el-button>

        <el-button
          v-if="isEditing || !isViewingDetail"
          :disabled="disabledSave && (checkCustomPermission('catalog/prodaddon', 'edit') || checkCustomPermission('catalog/prodaddon', 'store'))"
          size="small"
          icon="el-icon-check"
          type="success"
          @click="save">
          {{ lang.save }}
        </el-button>

        <button-action-authenticated
          :permission="['catalog/prodaddon', 'edit']"
          v-else
          size="small"
          icon="el-icon-edit"
          type="primary"
          @click="handleEdit">
          {{ lang.edit }}
        </button-action-authenticated>
      </div>
    </div>

    <div class="card-body">
      <view-mode
        v-if="isViewingDetail && !isEditing"
        :data="formData"
        :lang="lang"
      />

      <edit-mode
        v-if="isEditing || !isViewingDetail"
        :data="formData"
        @save="save"
        @save-disabled="handleSaveDisabled"
      />
    </div>
    <div
      v-if="isViewingDetail"
      class="detail-item">
      <div class="detail-value">
        <button-action-authenticated
          :permission="['catalog/prodaddon', 'destroy']"
          type="bordered-danger"
          @click="remove"
          icon="el-icon-delete">
          {{ $lang[langId].delete }}
        </button-action-authenticated>
      </div>
    </div>
  </el-card>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import EditMode from './EditMode'
import ViewMode from './ViewMode'

const apiEndpoint = 'productaddon/'
import { checkCustomPermission } from '@/mixins/checkCustomPermission'

export default {
  components: {
    ViewMode,
    EditMode
  },

  mixins: [checkCustomPermission],

  data() {
    return {
      loading: false,
      formData: {
        name: '',
        price: '',
        product_qty: 1,
        link_product: '',
        valid_products: [],
        valid_product_groups: []
      },
      isEditing: false,
      disabledSave: true
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
    isViewingDetail() {
      if (this.$route.params.id) {
        return true
      } else {
        return false
      }
    }
  },

  mounted() {
    if (this.$route.params.id) {
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
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint + this.$route.params.id),
        headers,
      }).then(response => {
        this.formData = { ...this.formData, ...response.data.data }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },

    handleEdit() {
      if (this.isEditing) {
        this.isEditing = false
      } else {
        this.isEditing = true
      }
    },

    handleSaveDisabled(bool) {
      this.disabledSave = bool
    },

    save() {
      if (this.formData.id) {
        this.update()
        return
      }
      this.loading = true

      let data = Object.assign({}, this.formData)
      data.valid_products = []
      data.valid_product_groups = []

      if (this.formData.valid_products.length) {
        this.formData.valid_products.map(item => {
          if (!item.product_id) {
            data.valid_products.push(item.pivot.product_id)
          } else {
            data.valid_products.push(item.product_id)
          }
        })
      }

      if (this.formData.valid_product_groups.length) {
        this.formData.valid_product_groups.map(item => {
          data.valid_product_groups.push(item.id)
        })
      }

      data.valid_products = data.valid_products.join(',')
      data.valid_product_groups = data.valid_product_groups.join(',')
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint),
        headers,
        data
      }).then(response => {
        this.loading = false
        this.$message({
          type: 'success',
          message: 'Success'
        })
        this.$router.push({path: '/catalog/addon/'})
      }).catch(error => {
        this.loading = false
        // this.$notify({
        //   type: 'warning',
        //   title: error.response.data.error.message,
        //   message: error.response.data.error.error
        // })
        var er = Object.getOwnPropertyNames(error.response.data.error.error)
        if (er.length >= 2) {
          var msg = []
          er.map((i,idx) => {
            msg.push(error.response.data.error.error[i][0])
          })
          var message = msg.join(', ')
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: message
          })
        } else {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error[er[0]][0]
          })
        }
      })
    },

    update() {
      this.loading = true
      console.log(this.formData.valid_products)
      const data = {}
      data.valid_products = []
      data.valid_product_groups = []

      if (this.formData.valid_products.length) {
        this.formData.valid_products.map(item => {
          if (!item.product_id) {
            data.valid_products.push(item.pivot.product_id)
          } else {
            data.valid_products.push(item.product_id)
          }
        })
      }

      if (this.formData.valid_product_groups.length) {
        this.formData.valid_product_groups.map(item => {
          data.valid_product_groups.push(item.id)
        })
      }

      data.valid_products = data.valid_products.join(',')
      data.valid_product_groups = data.valid_product_groups.join(',')

      data.name = this.formData.name
      data.price = this.formData.price
      data.link_product = this.formData.link_product
      data.product_qty = parseInt(this.formData.product_qty)
      console.log(data, 'data data data')
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint + this.formData.id),
        headers,
        data
      }).then(response => {
        this.loading = false
        this.$message({
          type: 'success',
          message: 'Success'
        })
        this.$router.push({path: '/catalog/addon/'})
      }).catch(error => {
        this.loading = false
        // this.$notify({
        //   type: 'warning',
        //   title: error.response.data.error.message,
        //   message: error.response.data.error.error
        // })
        var er = Object.getOwnPropertyNames(error.response.data.error.error)
        if (er.length >= 2) {
          var msg = []
          er.map((i,idx) => {
            msg.push(error.response.data.error.error[i][0])
          })
          var message = msg.join(', ')
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: message
          })
        } else {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error[er[0]][0]
          })
        }
      })
    },

    cancel() {
      this.$router.push({path: '/catalog/addon'})
    },

    remove() {
      this.loading = true
      //
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'delete',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productaddon/' + this.formData.id),
        headers
      }).then(() => {
        this.$message({
          type: 'success',
          message: 'Success'
        })
        this.$router.push({ path: '/catalog/addon' })
      }).catch((error) => {
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
        this.loading = false
      })
    }
  }
}
</script>

