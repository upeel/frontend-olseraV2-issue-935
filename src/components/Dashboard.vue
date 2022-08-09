<template>
  <div v-if="userRole.role_id !== 'PO' && userRole.role_id !== 'PS'">
    <template v-if="!$store.getters.webviewMode">
      <template v-if="loggedInUser && singleStore && token && userStores && $store.getters.selected_store">
        <app-header
          id="cookie-logout"
          :stores="userStores"
          @outlet-switched="handleSwitchOutlet"
          @showdialog="handleShowStore">
        </app-header>

        <!-- Left side column. contains the sidebar -->
        <app-sidebar
          :logged-in-user="loggedInUser"
          :selected-store="singleStore">
        </app-sidebar>

        <!-- Content Wrapper. Contains page content -->
        <router-view :key="routerViewKey" />

        <!-- /.content-wrapper -->
        <!-- <app-footer v-if="!$store.getters.webviewMode" /> -->

        <!-- <v-tour v-if="!$store.getters.webviewMode" name="myTour" :steps="tourSteps" /> -->
        <smart-finder />
      </template>
      <splash-screen :loading="loading" />
    </template>

    <template v-else>
      <router-view />
    </template>

    <el-dialog :visible.sync="show">
      <div
        class="login-banner--card pointer">
        <div
          class="text-center"
          style="flex: 1;">
          <el-avatar
            :src="storeExpired.logo"
            :alt="storeExpired.name"
            :size="100"
          />
          <h5 class="color-body font-bold font-24 m-null">
            {{ storeExpired.name }}
          </h5>
          <div class="font-12 color-info mb-16">
            {{ storeExpired.role_name }}
          </div>
          <div>
            <el-progress :percentage="(storeExpired.remaining_active_days*100)/60" :show-text="false"></el-progress>
            <div class="text-left font-12 mt-8">Aktifkan toko dalam {{ storeExpired.remaining_active_days }} hari</div>
          </div>

          <div
            class="bg-f5 p-8 mt-8 radius-10 text-left font-14 color-body flex-container">
            <div>
              <div>Toko ini telah dibekukan karena telah lebih dari 15 hari tidak memiliki penjualan. Hubungi kami untuk mengaktifkan kembali.</div>
            </div>
          </div>

          <div
            class="login-banner--card--footer radius-10">
            <div class="text-center">
              <el-button
                type="text"
                class="m-null p-null"
                @click="externalLink">
                Hubungi Kami <svg-icon icon-class="external-link" />
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  // import Sidebar from './partials/Sidebar.vue'
  import SidebarV2 from './partials/SidebarV2'
  import Header from './partials/Header'
  import Footer from './partials/Footer'
  import {HTTP, API} from '../http-common'
  import vm from '../eventHub'
  // import {getUserIP} from '../getip'
  import SplashScreen from '@/components/modules/SplashScreen'
  import SmartFinder from '@/components/modules/SmartFinder'
  import { fetch as fetchGeneralSetting } from '@/api/generalsetting'
  export default {
    name: 'Dashboard',

    components: {
      'app-sidebar': SidebarV2,
      'app-header': Header,
      'app-footer': Footer,
      SplashScreen,
      SmartFinder
    },

    data() {
      return {
        userStores: null,
        accessToken: null,
        refreshToken: null,
        loc: null,
        singleStore: null,
        loggedInUser: null,
        loadingElement: false,
        loading: true,
        ip: null,
        tourSteps: [
          {
            target: '#profile-logout',
            content: `Discover <strong>Vue Tour</strong>!`
          }
        ],
        show: false,
        storeExpired: {},
        routerViewKey: 0
      }
    },

    computed: {
      token() {
        return this.$store.state.user.token
      },
      userRole() {
        return this.$store.state.userStores.userRole
      }
    },

    watch: {
      userStores(stores) {
        window.userStores = stores
      },
      accessToken(token) {
        window.accessToken = token
      },
      refreshToken(token) {
        window.refreshToken = token
      },
      loc(data) {
        window.loc = data
      },
      singleStore(data) {
        window.isViewingStoreId = data
      },
      '$store.getters.selectedStore'(store, oldStore) {
        /**
         * auto refresh module view when store changed
         * so no need to manually add watcher in every module components that needs
         * data reset when store changed
         */
        if (store && oldStore) {
          if (store.store_id !== oldStore.store_id) {
            this.routerViewKey = this.routerViewKey + 1
          }
        }
        fetchGeneralSetting().then(response => {
          this.$store.commit('SET_GENERAL_SETTING', response.data.data)
        })
      }
    },

    mounted() {
      // console.log('dashboard mounted', this.$store.getters.selectedStore)
      const activeRoute = this.$router.resolve(this.$route.path)
      const isMobileAttendance = activeRoute.resolved.matched.filter(item => {
        return item.path === '/attendance-mobile'
      })
      const isMobileReport = activeRoute.resolved.matched.filter(item => {
        return item.path === '/reports-mobile'
      })
      if (isMobileReport.length || isMobileAttendance.length) {
        this.$store.commit('SET_MOBILE_REPORT_VIEW', true)
        return
      } else {
        this.$store.commit('SET_MOBILE_REPORT_VIEW', false)
        this.authUser()
      }
    },

    methods: {
      authUser() {
        this.loading = true
        const storedToken = this.token
        if (storedToken) {
          this.$store.commit('SET_TOKEN', storedToken)
          this.promiseGetLoggedInUser(storedToken.access_token)
        } else {
          this.$router.push('/login')
        }
      },

      promiseGetLoggedInUser(accessToken) {
        let paramsRequest = {
          headers: {
            'Authorization': 'Bearer ' + accessToken
          }
        }

        API.get('user', paramsRequest).then(res => {
          this.loggedInUser = res.data.data
          this.$store.commit('SET_LOGGEDIN_USER', this.loggedInUser)
          this.getUserStores()
        }).catch(() => {
          this.$router.push('/login')
        })
      },

      getUserStores() {
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
          const stores = response.data.data.map((item, idx, array) => {
            return {
              store_id: item.store_id,
              url_id: item.url_id,
              name: item.name,
              logo: item.logo,
              android_left_label: item.android_left_label,
              ios_left_label: item.ios_left_label,
              pos_left_label: item.pos_left_label,
              store_left_label: item.store_left_label,
              disable: false,
              expiry: false,
              pos_left: item.pos_left,
              store_left: item.store_left,
              android_left: item.android_left,
              ios_left: item.ios_left,
              role_name: item.role_name,
              remaining_active_days: item.remaining_active_days,
              is_store_active: item.is_store_active
            }
          })
          stores.map(i => {
            if (i.android_left_label === 'danger' && i.ios_left_label === 'danger' && i.pos_left_label === 'danger' && i.store_left_label === 'danger') {
              i.disable = true
            }
            if (i.store_left_label === 'danger') {
              i.expiry = true
            }

            i.showStore = {
              id: null,
              label: '',
              class: '',
              icon: ''
            }
            if (i.pos_left_label !== 'danger') {
              i.showStore = {
                id: 1,
                label: i.pos_left,
                class: 'chip chip--pos',
                icon: 'olsera-icon-pos'
              }
            } else if (i.store_left_label !== 'danger') {
              i.showStore = {
                id: 2,
                label: i.store_left,
                class: 'chip chip--ol',
                icon: 'online_store_gradien'
              }
            } else if (i.android_left_label !== 'danger') {
              i.showStore = {
                id: 3,
                label: i.android_left,
                class: 'chip chip--android',
                icon: 'android_ico'
              }
            } else if (i.ios_left_label !== 'danger') {
              i.showStore = {
                id: 4,
                label: i.ios_left,
                class: 'chip chip--default',
                icon: 'ios_ico'
              }
            }
          })
          this.userStores = stores

          if (localStorage.getItem('olsbo_authstoreid')) {
            this.getSingleStore(localStorage.getItem('olsbo_authstoreid'))
          } else if (localStorage.getItem('olsbo_selectedstore')) {
            const selectedStore = JSON.parse(localStorage.getItem('olsbo_selectedstore'))
            // console.log('locald', localStorage)
            if (parseInt(localStorage.getItem('olsbo_idlocal')) === 1) {
              this.setStore(selectedStore)
            } else {
              this.getSingleStore(selectedStore.store_id)
            }
          } else {
            if (this.$store.getters.selectedStore !== null) {
              if (this.$store.getters.selectedStore.android_left_label === 'danger' &&
              this.$store.getters.selectedStore.ios_left_label === 'danger' && 
              this.$store.getters.selectedStore.pos_left_label === 'danger' && 
              this.$store.getters.selectedStore.store_left_label === 'danger') {
                this.$router.push('/selectstore')
                return
              }
            } else {
              this.$router.push('/selectstore')
              return
            }
          }

          this.$store.commit('SET_USER_STORES', this.userStores)
          this.loading = false
        })
      },

      setStore(selecStore) {
        this.singleStore = selecStore

        let loc = this.singleStore.lang
        this.loc = JSON.parse(loc)
        window.loc = this.loc

        this.singleStore = Object.assign({}, selecStore)
        window.isViewingStoreId = this.singleStore
        vm.$emit('store-switched', this.singleStore)
        this.$store.commit('SET_SELECTED_STORE', this.singleStore)
        this.$store.commit('SET_STORE_PLAN', this.singleStore.pos_freemium)
      },

      getSingleStore(id) {
        this.loading = true
        let paramsRequest = {
          headers: {
            'Authorization': 'Bearer ' + this.token.access_token
          }
        }

        HTTP.get('api/store/' + id, paramsRequest).then(async response => {
          this.singleStore = await response.data.data

          let loc = await this.singleStore.lang
          this.loc = await JSON.parse(loc)
          window.loc = await this.loc

          this.singleStore = await Object.assign({}, response.data.data)
          window.isViewingStoreId = await this.singleStore
          await vm.$emit('store-switched', this.singleStore)
          await this.$store.commit('SET_SELECTED_STORE', this.singleStore)
          await this.$store.commit('SET_STORE_PLAN', this.singleStore.pos_freemium)
          // console.log(this.$store.getters.selectedStore.pos_freemium, this.$route.meta.premium, this.$route)
          if (this.$route.meta.detail) {
            this.$router.push({
              path: this.$route.meta.pathDirect
            })
          } else if (this.$route.meta.premium && this.$store.getters.selectedStore.pos_freemium) {
            this.$router.push({
              path: '/dashboard'
            })
          } else if (this.$route.name === 'Freemium' && !this.$store.getters.selectedStore.pos_freemium) {
            this.$router.push({
              path: '/dashboard'
            })
          }
          /**
           * REMOVE AUTHSTORE ID biar nggak digunakan lagi untuk refresh selanjutnya
           */
          localStorage.removeItem('olsbo_authstoreid')
          this.loading = false
        }).catch(error => {
          this.loading = false
          this.$message({
            type: 'error',
            message: error.message
          })
          this.$router.push({
            path: '/selectstore'
          })
        })
      },

      handleSwitchOutlet(id) {
        this.getSingleStore(id)
      },

      handleShowStore (data) {
        this.storeExpired = data
        this.show = true
      },

      externalLink() {
        window.location.href = 'https://www.olsera.com/id/sign-in'
      }
    }
  }
</script>
