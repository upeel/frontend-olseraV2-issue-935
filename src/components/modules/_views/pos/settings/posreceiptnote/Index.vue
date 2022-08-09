<template>
  <div v-loading="loading">
    <el-row :gutter="10">
      <el-col :md="12">
        <el-card class="box-card">
          <div slot="header" class="table-handler-flex">
            <h4 style="flex-grow: 1;">{{ lang.pos_receipt_header }}</h4>
            <div>
              <button-action-authenticated
                :permission="['settings/posreceiptnote', 'edit']"
                type="success" @click="save(data)"
                :disabled="disabledButton"
                icon="el-icon-check">
                {{ lang.save }} {{ lang.settings }}
              </button-action-authenticated>
            </div>
          </div>
          <div class="card-body">
            <el-alert
              :title="lang.info_for_pos_v2"
              type="info"
              show-icon>
            </el-alert>
            <div style="margin-bottom: 20px;"></div>
            <el-form v-model="data" label-width="120px">
              <el-form-item :label="lang.pos_receipt_header">
                <el-input type="textarea" v-model="data.pos_receipt_header"></el-input>
                <p class="size-12 input-desc oldgrey">
                  {{ lang.info_pos_receipt_header }}
                </p>
              </el-form-item>
              <el-form-item :label="lang.pos_receipt_email_title">
                <el-input type="textarea" v-model="data.pos_receipt_email_title"></el-input>
                <p class="size-12 input-desc oldgrey">
                  {{ lang.info_pos_receipt_email_title }}
                </p>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>

      <el-col :md="12">
        <el-card class="box-card">
          <div slot="header" class="table-handler-flex">
            <h4 style="flex-grow: 1;">{{ $lang[langId].receipt_note }}</h4>
            <div>
              <button-action-authenticated
                :permission="['settings/posreceiptnote', 'edit']"
                :disabled="disabledButton"
                type="success" @click="save(data)"
                icon="el-icon-check">
                {{ lang.save }} {{ lang.settings }}
              </button-action-authenticated>
            </div>
          </div>
          <div class="card-body">
            <el-form v-model="data" label-width="120px">
              <el-form-item :label="lang.pos_receipt_note">
                <el-input type="textarea" v-model="data.pos_receipt_note"></el-input>
                <p class="size-12 input-desc oldgrey">
                  {{ lang.info_pos_receipt_note }}
                </p>
              </el-form-item>
              <el-form-item :label="lang.pos_hide_receipt_no">
                <el-switch v-model="data.pos_hide_order_no"
                  :active-value="1"
                  :inactive-value="0">
                </el-switch>
                <span v-if="data.pos_hide_order_no === 0">{{ lang.no }}</span>
                <span v-if="data.pos_hide_order_no === 1">{{ lang.yes }}</span>
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
const apiEndPoint = 'posreceiptnote/'

export default {
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
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
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
