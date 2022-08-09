<template>
  
    <div v-loading="loading">
      <el-card class="box-card">
        <div slot="header">
          <div class="row">
            <div class="col-md-4">
              <h4>{{ lang.facebook_store }}</h4>
            </div>
            <div class="col-md-8 text-right">
              <button-action-authenticated
                :permission="['website/fbstore', 'edit']"
                type="success"
                @click="setup"
                icon="el-icon-setting">
                {{ lang.setup }}
              </button-action-authenticated>
            </div>
          </div>
        </div>

        <div class="card-body">
          <el-table :data="data" stripe>
            <el-table-column
              prop="page_id"
              :label="$lang[langId].page_id"
              width="180">
            </el-table-column>
            <el-table-column
              prop="created_time"
              :label="lang.created_time">
            </el-table-column>
          </el-table>
        </div>
      </el-card>

      <el-card class="box-card">
        <div slot="header">
          <span>{{ $lang[langId].how_to }}</span>
        </div>
        <div class="card-body">
          <div>
            <el-steps direction="vertical">
              <el-step :title="$lang[langId].create_facebook_page" status="process">
                <div slot="description">
                  <ol>
                    <li>{{ $lang[langId].step_1_facebook_page }}
                      <p><img src="https://d2cp4rzo38etyi.cloudfront.net/admin/img/admin/help_fb_page.png"></p>
                    </li>
                    <li>{{ $lang[langId].step_2_facebook_page }}</li>
                    <li>{{ $lang[langId].step_3_facebook_page }}</li>
                    <li>{{ $lang[langId].step_4_facebook_page }}</li>
                    <li>{{ $lang[langId].step_5_facebook_page }}</li>
                  </ol>
                </div>
              </el-step>
              <el-step :title="$lang[langId].add_store_to_facebook" status="process">
                <div slot="description">
                  <ol>
                    <li>{{ $lang[langId].step_6_facebook_page }}</li>
                    <li>{{ $lang[langId].step_7_facebook_page }}
                      <p><img src="https://d2cp4rzo38etyi.cloudfront.net/admin/img/admin/help_fb_page_add.png"></p>
                    </li>
                    <li>{{ $lang[langId].step_8_facebook_page }}</li>
                  </ol>
                </div>
              </el-step>
              <el-step :title="$lang[langId].change_logo_facebook" status="process">
                <div slot="description">
                  {{ $lang[langId].step_9_facebook_page }}
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
const apiEndPoint = 'fbpage'
export default {
  data() {
    return {
      loading: false,
      data: []
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
    '$store.getters.selectedStore'() {
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
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint),
        params: this.params,
        headers: headers
      }).then(response => {
        this.data = response.data.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },

    setup(data) {
      window.location = 'https://www.facebook.com/dialog/pagetab?app_id=318795654947400&redirect_uri=https%3A%2F%2Ffbstore.myolsera.com%2Fadd%2F18%2Fdemo'
    }
  },

  mounted() {
    this.getData()
  }
}
</script>
