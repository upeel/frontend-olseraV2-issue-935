<template>
<div class="login-page preload signup-mode">
    <div
      v-loading="loading"
      class="container-login-page">
      <div class="dialog-expired" :style="displayStore"></div>
      <div class="dialog-expired-insert" :style="displayStore">
        <el-button class="button" icon="el-icon-close" circle @click="hideDialogStore"></el-button>
        <div class="block">
          <div class="item-flex">
            <div class="image" style="margin-right: 16px">
              <img
                :src="showStore.logo"
                class="img-circle"
                :alt="showStore.name"
                style="width: 64px; height: 64px">
            </div>
            <div style="margin-top: 10px; width: 300px;">
              <h5>{{ showStore.name }}</h5>
              <el-button
                round
                size="small"
                class="btn-block"
                style="width: 108px; color: #F44336; border-color: #F44336">
                <countdown :time="time" :interval="100">
                  <template slot-scope="props"> + {{ props.days }} {{ rootLang.day_left }}</template>
                </countdown>
              </el-button>
            </div>
          </div>
          <div style="margin-top: 20px; font-weight: bold; font-size: 14px">{{ 'Masa berlaku "'+showStore.name +'" telah berakhir.'}}</div>
          <div style="margin-top: 16px">Kunjungi web kami untuk melakukan perpanjangan. Jika lebih dari 2 bulan tidak diperpanjang toko akan nonaktif*.</div>
          <div style="margin-top: 16px; font-size: 12px; color: #767676; opacity: 1">*Hubungi kami, jika ingin mengaktifkan kembali toko Anda</div>
          <div style="margin-top: 24px; text-align: center;">
            <el-button
              round
              size="small"
              type="primary"
              class="btn-block"
              @click="externalLink"
              style="width: 176px">
              {{ rootLang.extend_store }}
              <svg-icon icon-class="external-link" />
            </el-button>
          </div>
        </div>
      </div>
      <div class="login-banner">
        <div class="banner-img">
          <svg-icon icon-class="olsera-office" class-name="icon-signup" />
        </div>

        <div v-if="!newStore" class="banner-text text-center">
          <img src="../../static/img/select-store.png">
        </div>
        <div v-else class="banner-text text-center">
          <span style="font-weight: bold; color: #000;position: relative; right: 100px">
            Daftar
          </span>
          <img src="../../static/img/olsera-office.png">
        </div>
      </div>
      <div
        v-if="btnCreate"
        style="position: absolute; z-index: 2300; right: 30px; height: 60px; background: white; width: 46%; padding-top: 10px">
        <el-button
          class="btn-block"
          type="primary"
          style="width: 50px; float: right;font-size: 14px; font-weight: bold;"
          @click="newStore = true, btnCreate = false, displayStore = 'display: none'">
          <i class="el-icon-plus"></i>
        </el-button>
      </div>
      <div class="login-form" style="padding-top: 60px; padding-bottom: 70px;">
        <div v-if="!newStore">
          <template v-if="userStores">
            <div
              v-for="item in userStores"
              :key="item.store_id"
              class="box-in-loop pointer"
              @click="getSingleStore(item)"
              :style="item.background">
              <div v-if="item.disable" class="item-flex">
                <div>
                  <el-avatar
                    :alt="item.name"
                    :src="item.logo"
                    :size="32"
                    style="margin-top: 10px; margin-right: 2px;"
                  />
                </div>
                <div style="margin-top: 10px; width: 300px;">
                  <h5>{{ item.name }}</h5>
                  <span>{{ item.url_id + '.myolsera.com' }} </span>
                </div>
                <div>
                  <el-button
                    round
                    size="small"
                    class="btn-block"
                    @click="showStoreExp(item)"
                    style="float: right; color: #F44336; border-color: #F44336; margin-top: 10px">
                    {{ rootLang.expired }}
                  </el-button>
                </div>
              </div>
              <div v-else class="item-flex">
                <div>
                  <el-avatar
                    :alt="item.name"
                    :src="item.logo"
                    :size="32"
                    style="margin-top: 10px; margin-right: 2px;"
                  />
                </div>
                <div style="margin-top: 10px; width: 400px;">
                  <h5>{{ item.name }}</h5>
                  <span style="font-size: 12px">{{ item.url_id + '.myolsera.com' }} </span>
                </div>
                <div>
                  <el-button
                    round
                    type="text"
                    size="small"
                    class="btn-block"
                    icon="el-icon-arrow-right"
                    @click="newStore = true, btnCreate = false"
                    style="float: right;margin-top: 10px">
                  </el-button>
                </div>
              </div>
            </div>
          </template>

          <template v-else>
            <div v-if="!createStore" style="padding-top: 180px;">
              <div style="text-align: center; position: relative">
                <svg-icon icon-class="home" class-name="icon-signup" style="font-size: 54px" /><br>
                <span>{{ rootLang.store_not_found }}</span>
                <el-button
                size="default"
                type="primary"
                class="btn-block"
                @click="createStore = true">
                {{ rootLang.create_store }}
              </el-button>
              </div>
            </div>
            <signup-store
              v-if="createStore"
              :with-back="false"
              :form="form"
              :business-types="businessTypes"
              @register="register"
            />
          </template>
        </div>
        <div v-if="newStore">
          <signup-store
            :with-back="false"
            :form="form"
            :business-types="businessTypes"
            @register="register"
            @cancel="cancel"
          />
        </div>
      </div>
      <div v-if="btnCreate" style="position: absolute; z-index: 2300;bottom: 0px; right: 30px; height: 70px; background: white; width: 46%; padding-top: 40px">
        <div>
          <span style="font-size: 12px">Ada masalah? Kami siap membantu</span>
          <div style="float: right">
            <span style="font-weight: bold; font-size: 12px">Hubungi kami</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {HTTP, API} from '../http-common'
import { newstore, getBusinessTypes, user } from '@/api/auth'
import vm from '../eventHub'
import SignupStore from './SignupStore'

export default {
  components: {
    SignupStore
  },

  data() {
    return {
      userStores: null,
      singleStore: null,
      loading: false,
      businessTypes: [],
      form: {
        name_toko: '',
        url_id: '',
        business_type_id: '',
        service_type_id: 3,
        country_id: 'ID',
        city_id: '',
        state_id: '',
        pos_resto_mode: 0,
        i_agree: 0,
        address: ''
      },
      createStore: false,
      newStore: false,
      btnCreate: true,
      showExpiredStore: false,
      showStore: {},
      counting: false,
      time: 0,
      displayStore: 'display: none'
    }
  },

  computed: {
    token() {
      return this.$store.state.user.token
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    rootLang() {
      return this.$lang[this.langId]
    },
    loggedInUser() {
      return this.$store.state.loggedInUser
    }
  },

  watch: {
    userStores: {
      handler(stores) {
        if (!stores) {
          this.getBusinessTypes()
          this.getUser()
        }
      },
      immediate: true,
      deep: true
    }
  },

  mounted() {
    this.getUserStores()
    setTimeout(() => {
      $('.login-page').removeClass('preload').addClass('transition-start')
    }, 1000)
  },

  methods: {
    getUserStores() {
      this.loading = true
      let paramsRequest = {
        headers: {
          'Authorization': 'Bearer ' + this.token.access_token
        },

        params: {
          per_page: 1000,
          sort_type: 'desc',
          sort_column: 'is_store_active'
        }
      }

      HTTP.get('api/store', paramsRequest).then(response => {
        var st = response.data.data
        st.map((i, idx) => {
          i.disable = false
          i.background = 'background: #FFFFFF'
          if (i.android_left_label === 'danger' && i.ios_left_label === 'danger' && i.pos_left_label === 'danger' && i.store_left_label === 'danger') {
            i.disable = true
            i.background = 'background: #EEEEEE'
          }
        })
        this.userStores = st

        this.$store.commit('SET_USER_STORES', this.userStores)
        this.loading = false
      }).catch(() => {
        this.btnCreate = false
        this.loading = false
      })
    },

    getSingleStore(item) {
      if (!item.disable) {
        this.loading = true
        let paramsRequest = {
          headers: {
            'Authorization': 'Bearer ' + this.token.access_token
          }
        }

        HTTP.get('api/store/' + item.store_id, paramsRequest).then(response => {
          this.singleStore = response.data.data

          let loc = this.singleStore.lang
          this.loc = JSON.parse(loc)
          window.loc = this.loc

          this.singleStore = Object.assign({}, response.data.data)
          window.isViewingStoreId = this.singleStore
          vm.$emit('store-switched', this.singleStore)
          this.$store.commit('SET_SELECTED_STORE', this.singleStore)
          this.$store.commit('SET_STORE_PLAN', this.singleStore.pos_freemium)
          this.loading = false
          this.$router.push({
            path: '/dashboard'
          })
        })
      }
    },

    getUser() {
      user().then(response => {
        this.$store.commit('SET_LOGGEDIN_USER', response.data.data)
      })
    },

    getBusinessTypes() {
      getBusinessTypes({ per_page: 100 }).then(response => {
        this.businessTypes = response.data.data
      })
    },

    cancel() {
      this.btnCreate = true
      this.newStore = false
    },

    register() {
      this.loading = true
      const data = Object.assign({}, this.form)
      data.user_id = this.loggedInUser.id
      // console.log('data', data)
      newstore(data).then(response => {
        this.btnCreate = true
        this.newStore = false
        this.getUserStores()
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loading = false
      })
    },

    showStoreExp(item) {
      this.showStore = {}
      this.showStore = item

      var dateNow = new Date()
      var date = new Date(item.expiry_date)
      var expDate = date.getTime() + 60*24*60*60*1000
      this.time = expDate - dateNow

      this.displayStore = 'display: block'
    },

    hideDialogStore() {
      this.displayStore = 'display: none'
    },

    externalLink() {
      window.location.href = 'https://www.olsera.com/id/sign-in'
    }
  }
}
</script>
