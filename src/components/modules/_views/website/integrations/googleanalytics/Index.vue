<template>
  
    <div v-loading="loading">
      <el-card class="box-card">
        <div slot="header">
          <div class="row">
            <div class="col-md-4">
              <h4>{{ lang.google_analytics }}</h4>
            </div>
            <div class="col-md-8 text-right">
              <button-action-authenticated
                :permission="['website/googleanalytics', 'edit']"
                type="success"
                icon="el-icon-check"
                @click="save(data)">
                {{ lang.save }}
              </button-action-authenticated>
            </div>
          </div>
        </div>

        <div class="card-body">
          <el-form v-model="data" label-width="120px">
            <el-form-item :label="lang.google_analytics_script">
              <el-input type="textarea" autosize v-model="data.google_analytics"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-card>

      <el-card class="box-card">
        <div slot="header">
          <span>{{ this.$lang[langId].how_to }}</span>
        </div>
        <div class="card-body">
          <div>
            <el-steps direction="vertical">
              <el-step :title="this.$lang[langId].register_google_analytic" status="process">
                <div slot="description">
                  {{ this.$lang[langId].step_1_google_analytic }}
                </div>
              </el-step>
              <el-step :title="lang.settings+' '+lang.google_analytics" status="process">
                <div slot="description">
                  {{ this.$lang[langId].step_2_google_analytic }} <a href="https://support.google.com/analytics/answer/1009618" target="_blank">{{ lang.account }}, {{ lang.user_profile }}, {{ lang.view }}, {{ this.$lang[langId].and_others }}.</a>
                </div>
              </el-step>
              <el-step :title="this.$lang[langId].copy_tracking_code" status="process">
                <div slot="description">
                  <ol>
                    <li>{{ this.$lang[langId].step_3_google_analytic }}</li>
                    <li>{{ this.$lang[langId].step_4_google_analytic }}
                      <p><img src="https://d2cp4rzo38etyi.cloudfront.net/admin/img/admin/help_google_analytics_code.png"></p>
                    </li>
                    <li>{{ this.$lang[langId].step_5_google_analytic }}</li>
                  </ol>
                </div>
              </el-step>
            </el-steps>
          </div>
        </div>
      </el-card>
    </div>
  
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
const apiEndPoint = 'googleanalytics'
export default {
  data() {
    return {
      loading: false,
      disabledSave: true,
      data: {}
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
        if (data.google_analytics && data.google_analytics !== '') {
          this.disabledSave = false
        } else {
          this.disabledSave = true
        }
      },
      deep: true
    }
  },

  methods: {
    getData() {
      this.loading = true
      this.disabledSave = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint),
        params: this.params,
        headers
      }).then(response => {
        this.data = response.data.data
        this.disabledSave = false
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.disabledSave = false
        this.$notify({
          type: 'warning',
          title: 'Error',
          message: error.response.data.error.error
        })
      })
    },
    save(data) {
      this.loading = true
      this.disabledSave = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint),
        data,
        headers
      }).then(response => {
        this.data = response.data.data
        this.loading = false
        this.disabledSave = false
        this.$message({
          type: 'success',
          message: 'Saved'
        })
      }).catch(error => {
        this.loading = false
        this.disabledSave = false
        this.$notify({
          type: 'warning',
          title: 'Error',
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
