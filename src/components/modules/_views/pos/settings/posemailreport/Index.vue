<template>
  <div v-loading="loading">
    <el-row :gutter="10">
      <el-col :md="24">
        <el-card class="box-card">
          <div slot="header">
            <h4>{{ lang.email }} {{ lang.reports }}</h4>
          </div>
          <div class="card-body">
            <el-alert
              :title="lang.info_for_pos_v2"
              type="info"
              show-icon>
            </el-alert>

            <div style="margin-bottom: 20px;"></div>

            <el-form v-model="data" label-width="120px">
              <el-form-item :label="lang.email_recipients">
                <el-tag
                  v-for="(email) in emails"
                  :key="email"
                  :closable="checkCustomPermission('settings/posemailreport', 'destroy')"
                  type="primary"
                  size="mini"
                  class="mr-8"
                  @close="remove(email)">
                  {{ email }}
                </el-tag>
              </el-form-item>
              <el-form-item
                v-if="checkCustomPermission('settings/posemailreport', 'store')"
                :label="lang.add+' '+lang.email_recipients">
                <el-input type="textarea" v-model="fresh.email"></el-input>
                <p class="size-12 input-desc oldgrey">
                  {{ lang.info_report_email_recipients }},
                  {{ lang.multiple_accounts_split_by_comma }}
                </p>
              </el-form-item>
              <el-form-item
                v-if="checkCustomPermission('settings/posemailreport', 'store')">
                <div class="flex-container mt-16" style="height: 40px">
                  <div class="full-width">Setiap pagi sistem akan otomatis mengirimkan ringkasan tutup penjualan</div>
                  <div class="text-right" style="width: 20%">
                    <span v-if="data.auto_email_closing_sales === 1" class="mr-12">{{ lang.yes }}</span>
                    <span v-else class="mr-12">{{ lang.no }}</span>
                  </div>
                  <div class="flex-container text-right" style="width: 15%">
                    <el-switch
                      v-model="data.auto_email_closing_sales"
                      :active-value="1"
                      :inactive-value="0"
                      @change="updateAutoEmail"
                    />
                  </div>
                </div>
              </el-form-item>
              <el-form-item
                v-if="checkCustomPermission('settings/posemailreport', 'store')">
                <el-button
                  type="success" :disabled="disabledButton"
                  size="small"
                  @click="add" icon="el-icon-plus">
                  {{ lang.save }}
                </el-button>
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
const apiEndPoint = 'posemailreport/'
import { checkCustomPermission } from '@/mixins/checkCustomPermission'

export default {
  mixins: [checkCustomPermission],
  data: function() {
    return {
      loading: true,
      data: {},
      emails: [],
      fresh: {},
      disabledButton: true
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
    fresh: {
      handler(data) {
        if (data.email && data.email !== '' && data.email.length > 0) {
          this.disabledButton = false
        } else {
          this.disabledButton = true
        }
      },
      deep: true
    }
  },

  methods: {
    getData() {
      this.loading = true
      this.emails = []
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
        if (this.data.pos_report_emails) {
          let emails = this.data.pos_report_emails
          this.emails = emails.split(',')
        }
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.data = {}
        this.emails = []
        console.log(error)
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
      })
    },
    save(data, resolve, reject) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + 'store-update'),
        headers: headers,
        data
      }).then(response => {
        resolve(response.data.data)
      }).catch(error => {
        reject(error.response.data.error)
      })
    },
    add() {
      this.loading = true
      let newEmail = {...this.fresh}
      let emails = []
      if (this.emails.length > 0) {
        emails = [...this.emails]
        emails.join(',')
        emails = emails + ',' + newEmail.email
      } else {
        emails = newEmail.email
      }
      console.log(emails)
      let data = {
        email: emails,
        auto_email_closing_sales: this.data.auto_email_closing_sales
      }
      let promise = new Promise((resolve, reject) => {
        this.save(data, resolve, reject)
      })
      promise.then(() => {
        this.fresh = {}
        this.$message({
          type: 'success',
          message: 'success'
        })
        this.getData()
      }).catch(error => {
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.message,
          message: error.error
        })
      })
    },
    remove(email) {
      this.loading = true
      let emails = [...this.emails]
      emails.splice(emails.indexOf(email), 1)
      let data = {
        email: emails.join(','),
        auto_email_closing_sales: this.data.auto_email_closing_sales
      }
      let promise = new Promise((resolve, reject) => {
        this.save(data, resolve, reject)
      })
      promise.then(data => {
        this.getData()
        this.$message({
          type: 'success',
          message: 'saved'
        })
      }).catch(error => {
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.message,
          message: error.error
        })
      })
    },

    updateAutoEmail () {
      this.loading = true
      let data = {
        auto_email_closing_sales: this.data.auto_email_closing_sales,
        email: this.data.pos_report_emails
      }
      let promise = new Promise((resolve, reject) => {
        this.save(data, resolve, reject)
      })
      promise.then(() => {
        // this.fresh = {}
        this.$message({
          type: 'success',
          message: 'success'
        })
        this.getData()
      }).catch(error => {
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.message,
          message: error.error
        })
      })
    }
  },

  mounted() {
    this.getData()
  }
}
</script>
