<template>
  <el-row :gutter="10">
    <el-col :md="18">
      <el-card class="box-card" v-loading="loading">
        <div slot="header">
          <div class="row">
            <div class="col-md-4">
              <h4>{{ lang.claim_my_domain }}</h4>
            </div>
            <div class="col-md-8 text-right">
              <button-action-authenticated :permission="['website/usemydomain', 'edit']" type="success" @click="save(data)"
                :disabled="disabledSave"
                icon="el-icon-check">
                {{ lang.save }}
              </button-action-authenticated>
            </div>
          </div>
        </div>

        <div class="card-body">
          <el-form v-model="data" label-width="120px">
            <el-form-item :label="lang.custom_domain">
              <el-input type="text" v-model="data.ext_domain" :placeholder="$lang[langId].input_domain" clearable @clear="deleteInput"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-card>

      <el-card class="box-card">
        <div slot="header">
          <span>{{ $lang[langId].how_to }}</span>
        </div>
        <div class="card-body">
          <div>
            <el-steps direction="vertical">
              <el-step title="Beli Domain" status="process">
                <div slot="description">
                  {{ $lang[langId].info_buy_domain }}<br/>
                  <ol>
                    <li><a href="https://www.namecheap.com/" target="_blank">https://www.namecheap.com/</a></li>
                    <li><a href="http://www.name.com/" target="_blank">http://www.name.com/</a></li>
                    <li><a href="http://www.1and1.com/" target="_blank">http://www.1and1.com/</a></li>
                  </ol>
                </div>
              </el-step>

              <el-step :title="$lang[langId].point_domain_to_store" status="process">
                <div slot="description">
                  {{ $lang[langId].info_point_domain }}<br/>
                  {{ $lang[langId].setup_cname }}<br/>
                  {{ $lang[langId].info_setup_dns }}<br/>
                  <table class="table table-striped">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Host</th>
                        <th>Answer</th>
                        <th>TTL</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>CNAME</td>
                        <td>www.[your-domain-name].com</td>
                        <td>[your-store-name].myolsera.com</td>
                        <td>300</td>
                      </tr>
                      <tr>
                        <td>A record</td>
                        <td>@</td>
                        <td>52.76.158.20</td>
                        <td>300</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </el-step>

              <el-step :title="$lang[langId].claim_domain_in_store" status="process">
                <div slot="description">
                  {{ $lang[langId].add_cname_dns }}
                </div>
              </el-step>
            </el-steps>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
const apiEndPoint = 'usemydomain'
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
        if (data.ext_domain && data.ext_domain !== '') {
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
        this.$notify({
          type: 'success',
          message: 'Success'
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
    },
    deleteInput() {
      this.save(this.data)
    }
  },

  mounted() {
    this.getData()
  }
}
</script>
