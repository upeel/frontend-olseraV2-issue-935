<template>
  <div v-loading="loading">
    <el-row :gutter="10">
      <el-col :md="12">
        <el-card class="box-card" v-if="!showForm">
          <div slot="header" class="table-handler-flex">
            <h4 style="flex-grow: 1;">{{ $lang[langId].twilio_settings }}</h4>
            <button-action-authenticated
              :disabled="disabledSave"
              :permission="['settings/smsnotify', 'edit']"
              icon="el-icon-check"
              type="success"
              size="small"
              @click="saveTwilio">
              {{ lang.save }}
            </button-action-authenticated>
          </div>

          <div class="card-body">
            <p>{{ $lang[langId].info_twilio_setting }}
            </p>
            <el-form label-width="40%">
              <el-form-item :label="$lang[langId].account_sid">
                <el-input v-model="twilioData.account_sid"></el-input>
              </el-form-item>
              <el-form-item :label="$lang[langId].auth_token">
                <el-input v-model="twilioData.auth_token"></el-input>
              </el-form-item>
              <el-form-item :label="$lang[langId].form_number">
                <el-input v-model="twilioData.from_number"></el-input>
              </el-form-item>
              <el-form-item :label="lang.activated">
                <el-switch
                  v-model="twilioData.status"
                  active-value="A" inactive-value="I">
                </el-switch>
                <span v-if="twilioData.status === 'I'">{{ lang.no }}</span>
                <span v-if="twilioData.status === 'A'">{{ lang.yes }}</span>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
        <el-card class="box-card" v-if="!showForm">
          <div slot="header" class="clearfix">
            {{ $lang[langId].how_to }}
          </div>
          <div class="card-body">
            <div>
              <el-steps direction="vertical" :active="activeSteps">
                <el-step status="process">
                  <div slot="title">
                    <h4>{{ $lang[langId].create_twilio_account }}
                      <span class="pull-right">
                        <el-button type="text" style="color: #000000;" size="mini" @click="showSteps('first', activeSteps)">
                          <i class="el-icon-arrow-down" v-if="activeSteps === 1"></i>
                          <i class="el-icon-arrow-right" v-else></i>
                        </el-button>
                      </span>
                    </h4>
                  </div>
                  <div slot="description" v-if="activeSteps === 1">
                    <ol>
                      <li>{{ $lang[langId].twilio_setting_1 }} <a href="https://www.twilio.com/try-twilio">https://www.twilio.com/try-twilio</a>
                        <p><img src="https://d2cp4rzo38etyi.cloudfront.net/admin/img/admin/twilio_signup2.png"></p>
                      </li>
                      <li>{{ $lang[langId].twilio_setting_2 }}</li>
                      <li>{{ $lang[langId].twilio_setting_3 }}</li>
                      <li>{{ $lang[langId].twilio_setting_4 }}
                        <el-row>
                          <el-col :md="12">
                            <img src="https://d2cp4rzo38etyi.cloudfront.net/admin/img/admin/twilio_smsveri.png">
                          </el-col>
                          <el-col :md="12">
                            <img src="https://d2cp4rzo38etyi.cloudfront.net/admin/img/admin/twilio_vericode.png">
                          </el-col>
                        </el-row>
                      </li>
                    </ol>
                  </div>
                </el-step>
                <el-step status="process">
                  <div slot="title">
                    <h4>{{ $lang[langId].twilio_setting_5 }}
                      <span class="pull-right">
                        <el-button type="text" style="color: #000000;" size="mini" @click="showSteps('second', activeSteps)">
                          <i class="el-icon-arrow-down" v-if="activeSteps === 2"></i>
                          <i class="el-icon-arrow-right" v-else></i>
                        </el-button>
                      </span>
                    </h4>
                  </div>
                  <div slot="description" v-if="activeSteps === 2">
                    {{ $lang[langId].twilio_setting_6 }}
                    <p><img src="https://d2cp4rzo38etyi.cloudfront.net/admin/img/admin/twilio_consoledash2.png"></p>
                  </div>
                </el-step>
                <el-step status="process">
                  <div slot="title">
                    <h4>{{ $lang[langId].twilio_setting_7 }}
                      <span class="pull-right">
                        <el-button type="text" style="color: #000000;" size="mini" @click="showSteps('third', activeSteps)">
                          <i class="el-icon-arrow-down" v-if="activeSteps === 3"></i>
                          <i class="el-icon-arrow-right" v-else></i>
                        </el-button>
                      </span>
                    </h4>
                  </div>
                  <div slot="description" v-if="activeSteps === 3">
                    {{ $lang[langId].twilio_setting_8 }}:
                    <div>
                      <ol>
                        <li>{{ $lang[langId].twilio_setting_9 }} <a href="https://www.twilio.com/console/phone-numbers/search">https://www.twilio.com/console/phone-numbers/search </a></li>
                        <li>{{ $lang[langId].twilio_setting_10 }}
                        </li>
                        <li> {{ $lang[langId].twilio_setting_11 }}</li>
                        <li>{{ $lang[langId].twilio_setting_12 }}</li>
                        <li>{{ $lang[langId].twilio_setting_13 }}
                          <el-row>
                          <el-col :md="12">
                            <img src="https://d2cp4rzo38etyi.cloudfront.net/admin/img/admin/twilio_searchnumber2.png">
                          </el-col>
                          <el-col :md="12">
                            <img src="https://d2cp4rzo38etyi.cloudfront.net/admin/img/admin/twilio_fromnumber2.png">
                          </el-col>
                        </el-row>
                        </li>
                        <li>{{ $lang[langId].twilio_setting_14 }}</li>
                      </ol>
                    </div>
                  </div>
                </el-step>
                <el-step status="process">
                  <div slot="title">
                    <h4>{{ $lang[langId].twilio_setting_15 }}
                      <span class="pull-right">
                        <el-button type="text" style="color: #000000;" size="mini" @click="showSteps('four', activeSteps)">
                          <i class="el-icon-arrow-down" v-if="activeSteps === 4"></i>
                          <i class="el-icon-arrow-right" v-else></i>
                        </el-button>
                      </span>
                    </h4>
                  </div>
                  <div slot="description" v-if="activeSteps === 4">
                    {{ $lang[langId].twilio_setting_16 }}
                    <div>
                      <ol>
                        <li>{{ $lang[langId].twilio_setting_17 }}</li>
                        <li>{{ $lang[langId].twilio_setting_18 }}
                          <p><img src="https://d2cp4rzo38etyi.cloudfront.net/admin/img/admin/twilio_permission.png"></p>
                        </li>
                        <li>{{ $lang[langId].twilio_setting_19 }}</li>
                      </ol>
                    </div>
                  </div>
                </el-step>
              </el-steps>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :md="12">
        <el-card class="box-card" v-if="!showForm">
          <div slot="header" class="clearfix">
            {{ lang.sms_and_notification_templates }}
          </div>
          <div class="card-body">
            <div class="dd-item" v-for="(item) in notifyData" :key="item.id" style="margin-bottom: 0;">
              <list :item="item" @edit="edit"></list>
            </div>

            <div class="load-more" v-if="moreLink" v-loading="loadingMoreNotify">
              <el-button
                :disabled="disabledButton"
                @click="loadMore"
                class="btn-block">
                {{ $lang[langId].load_more }}
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <item-form
      v-if="showForm"
      :saved="saved"
      :loading="loading"
      :form-data="tmp"
      @cancel="cancelForm"
      @save="saveForm">
    </item-form>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import List from './List'
import ItemForm from './Form'
const apiEndpoint = 'smsnotify/'

export default {
  components: {
    List,
    ItemForm
  },
  data() {
    return {
      loading: true,
      twilioData: {},
      notifyData: [],
      moreLink: null,
      disabledSave: true,
      loadingMoreNotify: false,
      showForm: false,
      saved: false,
      tmp: {},
      activeSteps: 1,
      params: {
        per_page: 100
      }
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
    'store.getters.selectedStore': function () {
      this.getNotify()
    },
    twilioData: {
      handler(twilioData) {
        if (twilioData && (twilioData.account_sid !== '' && twilioData.auth_token !== '' && twilioData.from_number !== '')) {
          this.disabledSave = false
        } else {
          this.disabledSave = true
        }
      },
      deep: true
    }
  },
  methods: {
    getNotify() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint),
        headers: headers,
        params: this.params
      }).then(response => {
        this.notifyData = response.data.data
        this.moreLink = response.data.links.next
        this.loading = false
      }).catch(error => {
        this.loading = false
      })
    },
    getDetailNotify(id) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint + 'detail/' + id),
        headers: headers,
        params: this.params
      }).then(response => {
        this.tmp = response.data.data
        this.loading = false
        this.showForm = true
      }).catch(error => {
        this.loading = false
        this.showForm = false
      })
    },
    getTwilio() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'twilioconfig'),
        headers: headers
      }).then(response => {
        this.twilioData = response.data.data
        this.loading = false
      }).catch(error => {
        this.loading = false
      })
    },
    loadMore() {
      this.disabledButton = true
      this.loadingMoreNotify = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: this.moreLink,
        params: this.params,
        headers: headers
      }).then(response => {
        this.notifyData = this.notifyData.concat(response.data.data)
        this.loadingMoreNotify = false
        this.moreLink = response.data.links.next
        this.disabledButton = false
      }).catch(error => {
        this.loadingMoreNotify = false
        this.disabledButton = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    edit(item) {
      let id = item.id
      this.getDetailNotify(id)
    },
    cancelForm() {
      this.showForm = false
      this.tmp = {}
    },
    saveForm(data) {
      this.loading = true
      let id = data.id
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint + 'update/' + id),
        headers: headers,
        data
      }).then(response => {
        this.tmp = {}
        this.saved = true
        this.showForm = false
        this.loading = false
        this.getNotify()
        this.$message({
          type: 'success',
          message: 'saved'
        })
      }).catch(error => {
        this.saved = false
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    saveTwilio() {
      this.loading = true
      let data = this.twilioData
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'twilioconfig/update'),
        headers: headers,
        data
      }).then(response => {
        this.twilioData = response.data.data
        this.loading = false
        this.getTwilio()
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
    },
    showSteps(block, val) {
      if (block === 'first') {
        if (val !== 1) {
          this.activeSteps = 1
        } else {
          this.activeSteps = 0
        }
      } else if (block === 'second') {
        if (val !== 2) {
          this.activeSteps = 2
        } else {
          this.activeSteps = 0
        }
      } else if (block === 'third') {
        if (val !== 3) {
          this.activeSteps = 3
        } else {
          this.activeSteps = 0
        }
      } else if (block === 'four') {
        if (val !== 4) {
          this.activeSteps = 4
        } else {
          this.activeSteps = 0
        }
      }
    }
  },
  mounted() {
    this.getTwilio()
    this.getNotify()
  }
}
</script>

