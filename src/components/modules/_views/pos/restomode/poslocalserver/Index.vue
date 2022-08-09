<template>
  <div v-loading="loading">
    <el-row :gutter="10">
      <el-col :md="12">
        <el-card class="box-card">
          <div slot="header">
            <h4>{{ lang.ip_local_server }}</h4>
          </div>
          <div class="card-body">
            <div style="margin-bottom: 20px;"></div>
            <el-form
              :model="data"
              @submit.native.prevent>
              <el-form-item>
                <el-input
                  type="text"
                  :disabled="!checkCustomPermission('settings/poslocalserver', 'edit')"
                  :placeholder="$lang[langId].please_input+lang.ip_local_server"
                  v-model="data.pos_local_server"
                  @change="save(data)">
                </el-input>
                <p class="size-12 oldgrey input-desc">
                  {{ lang.info_pos_local_server }}
                </p>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
const apiEndPoint = 'poslocalserver/'
import { checkCustomPermission } from '@/mixins/checkCustomPermission'

export default {
  mixins: [checkCustomPermission],
  data: function() {
    return {
      loading: true,
      data: {},
      disabledButton: false
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
    '$store.getters.selectedStore': function() {
      this.getData()
    },
    data: {
      handler(data) {
        if (data) {
          this.disabledButton = false
        } else {
          this.disabledButton = true
        }
      },
      deep: true
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
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.$notify({
          type: 'warning',
          title: 'Error',
          message: error
        })
      })
    },
    save(data) {
      if (!this.checkCustomPermission('settings/poslocalserver', 'edit')) {
        this.$message({
          type: 'error',
          message: 'Unauthorized access'
        })
        return
      }
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + 'store-update'),
        headers: headers,
        data
      }).then(response => {
        this.data = response.data.data
        this.loading = false
        this.$message({
          type: 'success',
          message: 'saved'
        })
      }).catch(error => {
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
