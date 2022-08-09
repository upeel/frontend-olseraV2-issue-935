<template>
  
    <div v-loading="loading">
      <el-card class="box-card">
        <div slot="header">
          <div class="row">
            <div class="col-md-4">
              <h4>{{ lang.mailchimp_newsletter }}</h4>
              <p class="oldgrey size-12">{{ lang.info_mailchimp }}</p>
            </div>
            <div class="col-md-8 text-right">
              <button-action-authenticated
                :permission="['website/mailchimp', 'edit']"
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
            <el-form-item :label="this.$lang[langId].mailchimp_key">
              <el-input type="text" v-model="data.mailchimp_key"></el-input>
            </el-form-item>
            <el-form-item :label="this.$lang[langId].mailchimp_id">
              <el-input type="text" v-model="data.mailchimp_list_id"></el-input>
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
              <el-step :title="this.$lang[langId].mailchimp_register" status="process">
                <div slot="description">
                  <p>{{ this.$lang[langId].step_1_mailchimp }} <a href="http://mailchimp.com/" target="_blank">{{ this.$lang[langId].mailchimp_free_account }}</a> {{ this.$lang[langId].now }}.</p>
                  <p>{{ this.$lang[langId].step_2_mailchimp }}</p>
                </div>
              </el-step>
              <el-step :title="lang.add+' '+this.$lang[langId].list" status="process">
                <div slot="description">
                  <p>{{ this.$lang[langId].step_3_mailchimp }}, <a href="https://us3.admin.mailchimp.com/lists/" target="_blank">{{ this.$lang[langId].click_here }}</a> {{ this.$lang[langId].step_4_mailchimp }}</p>
                </div>
              </el-step>
              <el-step :title="this.$lang[langId].find_mailchimp_api" status="process">
                <div slot="description">
                  <p><a href="http://kb.mailchimp.com/article/where-can-i-find-my-api-key" target="_blank">{{ this.$lang[langId].click_here }}</a> {{ this.$lang[langId].step_5_mailchimp }}</p>
                </div>
              </el-step>
              <el-step :title="lang.search+' '+this.$lang[langId].mailchimp_id" status="process">
                <div slot="description">
                  <a href="https://mailchimp.com/help/find-your-list-id/" target="_blank">{{ this.$lang[langId].click_here }}</a> {{ this.$lang[langId].step_5_mailchimp }}
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
const apiEndPoint = 'mailchimp'
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
        if ((data.mailchimp_key && data.mailchimp_key !== '') && (data.mailchimp_list_id && data.mailchimp_list_id !== '')) {
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
