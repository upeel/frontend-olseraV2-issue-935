<template>
  
    <div v-loading="loading">
      <el-card class="box-card">
        <div slot="header">
          <div class="row">
            <div class="col-md-4">
              <h4>{{ $lang[langId].facebook_login }}</h4>
            </div>
            <div class="col-md-8 text-right">
              <button-action-authenticated
                :permission="['website/facebooksso', 'edit']"
                type="success"
                @click="save(data)"
                icon="el-icon-check">
                {{ lang.save }}
              </button-action-authenticated>
            </div>
          </div>
        </div>

        <div class="card-body">
          <el-form v-model="data" label-width="120px">
            <el-form-item :label="this.$lang[langId].app_id">
              <el-input type="text" v-model="data.fb_app_id"></el-input>
              <p class="size-12 input-desc oldgrey">
                {{ lang.info_facebook_sso }}
              </p>
            </el-form-item>
            <el-form-item :label="this.$lang[langId].app_secret">
              <el-input type="text" v-model="data.fb_app_secret"></el-input>
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
              <el-step :title="this.$lang[langId].login_facebook" status="process">
                <div slot="description">
                  {{ this.$lang[langId].step_1_facebook_login }}
                </div>
              </el-step>
              <el-step :title="this.$lang[langId].go_to_facebook_dev" status="process">
                <div slot="description">
                  <ol>
                    <li>{{ this.$lang[langId].go_to_facebook_dev }}, https://developers.facebook.com/.</li>
                    <li>{{ this.$lang[langId].step_2_facebook_login }}</li>
                  </ol>
                </div>
              </el-step>
              <el-step :title="this.$lang[langId].change_logo_facebook" status="process">
                <div slot="description">
                  {{ this.$lang[langId].step_9_facebook_page }}
                  <p><img src="https://d2cp4rzo38etyi.cloudfront.net/admin/img/admin/help_fb_page_view.png"></p>
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
const apiEndPoint = 'facebooksso'
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
        if ((data.fb_app_secret && data.fb_app_secret !== '') && (data.fb_app_id && data.fb_app_id !== '')) {
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
