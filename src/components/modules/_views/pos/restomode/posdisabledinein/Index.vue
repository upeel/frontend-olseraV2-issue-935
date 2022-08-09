<template>
  <div v-loading="loading">
    <el-row :gutter="10">
      <el-col :md="12">
        <el-card class="box-card">
          <div slot="header">
            <h4>{{ lang.dine_in_take_away }}</h4>
          </div>
          <div class="card-body">
            <el-alert
              :title="lang.info_for_pos_v2"
              type="info"
              show-icon>
            </el-alert>
            <div style="margin-bottom: 20px;"></div>
            <el-form v-model="data" label-width="180px">
              <el-form-item :label="lang.disable_dine_in_take_away">
                <el-switch
                  v-model="data.disable_dine_in"
                  :disabled="!checkCustomPermission('settings/posdisabledinein', 'edit')"
                  :active-value="1"
                  :inactive-value="0"
                  @change="save(data)">
                </el-switch>
                <span v-if="data.disable_dine_in === 0">{{ lang.no }}</span>
                <span v-if="data.disable_dine_in === 1">{{ lang.yes }}</span>
                <p class="size-12 oldgrey input-desc">
                  {{ lang.info_disable_dine_in_take_away }}
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
const apiEndPoint = 'posdisabledinein/'
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
