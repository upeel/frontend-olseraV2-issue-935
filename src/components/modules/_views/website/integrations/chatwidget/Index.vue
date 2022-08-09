<template>
  
    <div v-loading="loading">
      <el-card class="box-card">
        <div slot="header">
          <div class="row">
            <div class="col-md-4">
              <h4>{{ lang.chat_widget }}</h4>
            </div>
            <div class="col-md-8 text-right">
              <button-action-authenticated
                :permission="['website/chatwidget', 'edit']"
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
            <el-form-item :label="lang.chat_widget_script">
              <el-input type="textarea" autosize v-model="data.chat_widget" clearable></el-input>
              <p class="input-desc size-12 oldgrey">
                {{ lang.info_chat_widget }}
              </p>
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
              <el-step :title="this.$lang[langId].register_zopim" status="process">
                <div slot="description">
                  {{ this.$lang[langId].step_1_widget_chat }}
                  <p><img src="https://d2cp4rzo38etyi.cloudfront.net/admin/img/admin/help_zopim_signup.png"></p>
                </div>
              </el-step>
              <el-step :title="this.$lang[langId].step_2_widget_chat" status="process">
                <div slot="description">
                  {{ this.$lang[langId].step_3_widget_chat }}
                  <p><img src="https://d2cp4rzo38etyi.cloudfront.net/admin/img/admin/help_zopim_code.png"></p>
                  <ol class="list-unstyled">
                    <li>{{ this.$lang[langId].step_4_widget_chat }}</li>
                    <li><strong>{{ this.$lang[langId].step_5_widget_chat }}</strong></li>
                    <li>{{ this.$lang[langId].step_6_widget_chat }}</li>
                    <li><strong>{{ this.$lang[langId].customize_widget }}</strong></li>
                    <li>{{ this.$lang[langId].step_7_widget_chat }}</li>
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
const apiEndPoint = 'chatwidget'
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
        if (data.chat_widget && data.chat_widget !== '') {
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
