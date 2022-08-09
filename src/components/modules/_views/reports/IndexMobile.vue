<template>
  <div
    v-if="token && token.access_token && selectedStore">
    <div class="wrapper-nav-tabs-mobile-reports">
      <ul class="nav-tabs-shop-devin" role="tablist">
        <template v-if="selectedStore.role_id !== 'PJ'">
          <li
            v-for="(item, key) in reportsPath"
            :key="key"
            data-wow-delay="0.14s">
            <div v-if="!selectedStore.pos_freemium">
              <router-link
                :to="'/reports-mobile/' + item.path">
                <span v-if="item.path !== 'attendance'">{{ lang[item.key] }}</span>
                <span v-else>{{ rootLang[item.path] }}</span>
              </router-link>
            </div>
            <div v-else>
              <router-link
                v-if="!item.premium"
                :to="'/reports-mobile/' + item.path">
                {{ lang[item.key] }}
              </router-link>
              <router-link
                v-else-if="item.premium && selectedStore.is_onlineshop === 1"
                :to="'/reports-mobile/' + item.path">
                {{ lang[item.key] }}
              </router-link>
              <router-link v-else :to="{path: '/reports-mobile/freemium'}">
                {{ lang[item.key] }}
                <span class="premium-labeled-tabs">
                  Premium
                </span>
              </router-link>
            </div>
          </li>
        </template>
        <template v-else>
          <li
            v-for="(item, key) in reportsPathTaxRole"
            :key="key"
            data-wow-delay="0.14s">
            <div>
              <router-link
                :to="'/reports-mobile/' + item.path">
                {{ lang[item.key] }}
              </router-link>
            </div>
          </li>
        </template>
      </ul>
    </div>

    <div class="mobile-report--main">
      <!-- <div class="mobile-report-switch-store" style="padding: 5px;">
        <switch-store @change="getSingleStore" />
      </div> -->
      <router-view v-if="readyToMount"></router-view>
    </div>

    <splash-screen :loading="loading" />
  </div>
</template>

<script>
  import {HTTP} from 'src/http-common'
  import SwitchStore from '@/components/modules/webview/SwitchStore'
  import SplashScreen from '@/components/modules/SplashScreen'
  import basicComputedMixin from '@/mixins/basicComputedMixin'

  export default {
    name: 'IndexReportsMobile',

    components: {
      SwitchStore,
      SplashScreen
    },

    mixins: [basicComputedMixin],

    data() {
      return {
        loading: true,
        reportsPathTaxRole: [
          {
            path: 'salestaxrole',
            key: 'sales'
          },
        ],
        reportsPath: [
          {
            path: 'products',
            key: 'products',
            premium: false
          },
          {
            path: 'purchases',
            key: 'purchase',
            premium: true
          },
          {
            path: 'sales',
            key: 'sales',
            premium: false
          },
          {
            path: 'shifts',
            key: 'shift',
            premium: true
          },
          {
            path: 'payments',
            key: 'payment',
            premium: false
          },
          {
            path: 'multioutlets',
            key: 'multi_outlet_reports',
            premium: true
          },
          {
            path: 'attendance',
            key: 'attendance_reports',
            premium: true
          }
        ],
        initStoreId: null,
        readyToMount: false
      }
    },

    computed: {
      token() {
        return this.$store.getters.webviewToken
      },
      selectedStore () {
        return this.$store.getters.webviewSelectedStore
      },
      lang() {
        return this.$store.state.userStores.lang
      },
      langId() {
        return this.$store.state.userStores.langId
      }
    },

    mounted() {
      // 11065
      this.$store.commit('SET_WEBVIEW_MODE', true)
      const query = this.$route.query
      const password = query.password
      const username = query.username
      const store_id = query.store_id
      const lang = query.lang
      const localToken = JSON.parse(localStorage.getItem('olsbowebview_token'))
      const localSelectedStore = JSON.parse(localStorage.getItem('olsbowebview_selectedstore'))
      this.getLocalization(lang)
      // console.log(localToken, localSelectedStore)
      if (password && username && store_id) {
        this.$store.commit('REMOVE_WEBVIEW_TOKEN')
        this.$store.commit('REMOVE_WEBVIEW_SELECTED_STORE')
        this.initStoreId = store_id
        this.authUser({username, password, store_id})
      } else if (password && username && !store_id) {
        this.$store.commit('REMOVE_WEBVIEW_TOKEN')
        this.$store.commit('REMOVE_WEBVIEW_SELECTED_STORE')
        this.authUser({username, password})
      } else if ((localToken && localSelectedStore) && (!password && !username && !store_id)) {
        this.$store.commit('SET_WEBVIEW_TOKEN', localToken)
        this.getLoggedInUser()
      } else {
        this.handleAuthFailed('mounted')
      }
    },

    methods: {
      authUser(credential) {
        this.loading = true
        const data = {
          username: credential.username,
          password: credential.password,
          client_id: 2,
          client_secret: '0XqbhEW6E72GNHn0iIM7Ui1GgB8jny91wYnXAIb8',
          grant_type: 'password'
        }
        this.$store.dispatch('webviewLogin', data).then(response => {
          // console.log('webviewLogin', response.data.data)
          this.$store.dispatch('webviewFetchUserLoggedin').then(async response => {
            let selectedStoreId = credential.store_id
            if (!selectedStoreId) {
              await this.$store.dispatch('setStores').then(response => {
                selectedStoreId = response.data.data[0].store_id
              }).catch(() => {
                //
              })
            }
            this.$store.dispatch('webviewSetSelectedStore', selectedStoreId).then(() => {
              this.loading = false
              this.readyToMount = true
              if (this.selectedStore.role_id === 'PJ') {
                this.$router.push({path: '/reports-mobile/salestaxrole?path=salesreport'})
              }
            })
          })
        }).catch(error => {
          this.loading = false
          this.handleAuthFailed()
        })
      },

      getLoggedInUser() {
        this.loading = true
        this.$store.dispatch('webviewFetchUserLoggedin').then(() => {
          this.readyToMount = true
          this.loading = false
        }).catch(error => {
          this.loading = false
          this.handleAuthFailed()
        })
      },

      async getLocalization(langId = null) {
        let fallbackLangId = langId
        if (!fallbackLangId) {
          fallbackLangId = 'id'
        }
        await HTTP.get('localization').then(response => {
          this.$store.dispatch('setLangLocally', {
            id: fallbackLangId,
            lang: response.data[fallbackLangId].admin.all
          })
        })
      },

      handleAuthFailed(from) {
        console.log(from)
        this.$message({
          type: 'warning',
          message: 'Auth failed'
        })
        this.$router.push({
          path: '/webview-login',
          query: {
            redirect: '/reports-mobile'
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

  /**
  * TAB SUB PAGE
  */
  .wrapper-nav-tabs-mobile-reports {
    position: fixed;
    z-index: 9;
    left: 0;
    top: 0;
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    // overflow: scroll;
    box-shadow: 0px 0px 12px rgba(#000, 0.16);
  }

  .nav-tabs-shop-devin {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: nowrap;
    margin: 0 0 0 0;
    padding: 0 0 0 0;
    li {
      float: none;
      list-style: none;
      padding: 0 0 0 0;
      margin: 0 0 0 0;
      flex: 1 1 0px;
      a {
        min-width: 98px;
        font-size: 14px;
        display: block;
        text-align: center;
        padding: 13px 16px;
        position: relative;
        font-weight: bold;
        color: #272727;
        white-space: nowrap;
        background: #fff;
        &.active {
          background: #DDF2FA;
          color: #0085CD;
          &:hover {
            color: #0085CD;
            background: #DDF2FA;
            &:after {
              background: #DDF2FA;
            }
          }
        }
        &:after {
          content: '';
          height: 2px;
          width: 100%;
          display: block;
          position: absolute;
          left: 0;
          bottom: 0;
          background: transparent;
        }
        &:hover {
          color: #0085CD;
          background: #fff;
          &:after {
            background: #DDF2FA;
          }
        }
      }
    }
  }

  .mobile-report--main {
    padding-top: 50px;
  }

  .mobile-report-switch-store {
    .el-select {
      width: 100%;
      font-weight: bold;
    }
  }
</style>
