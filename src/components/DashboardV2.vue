<template>
  <div
    v-if="$store.state.userStores.selectedStore.role_id !== 'PO' &&
    $store.state.userStores.selectedStore.role_id !== 'PS'">
    <app-header
      :stores="userStores"
      @outlet-switched="handleSwitchStore"
      @showdialog="handleShowStore">
    </app-header>

    <!-- <app-sidebar
      v-if="!accessByStore.includes(singleStore.url_id)"
      :logged-in-user="loggedInUser"
      :selected-store="singleStore">
    </app-sidebar> -->

    <app-sidebar-custom
      :logged-in-user="loggedInUser"
      :selected-store="singleStore"
      :data-profile="dataProfile"
      :data-store="dataStore"
      @showpartnership = handleShowPartnership
      @showtawkto="handleShowTawkto" >
    </app-sidebar-custom>

    <router-view
      :key="routerViewKey"
    />

    <smart-finder />

    <dialog-freeze-store
      :show="visibleDialogFreezeStore"
      :data="storeExpired"
      @close="visibleDialogFreezeStore = false, storeExpired = null"
    />
    <splash-screen :loading="loading" />

    <internet-connection />

    <el-dialog
      :visible.sync="visibleDialogToRefresh"
      title="Updates Available"
      append-to-body
      custom-class="mw-420">
      {{ rootLang.reload_to_update }}
      <div slot="footer" class="text-right">
        <el-button type="primary" @click="forceReload">
          {{ rootLang.reload }}
        </el-button>
      </div>
    </el-dialog>

    <dialog-scheduled-promo 
      v-if="tempSchedulePromoRules()" 
      :data-profile="dataProfile" 
    />

    <dialog-scheduled-promo-by-url
      v-if="dataProfile.user_notification && dataProfile.user_notification[1].is_user_accept === 0"
      :data-profile="dataProfile" 
    />
    
    <activation-partnership
      :show-dialog="dialogPartner"
      @activated="avtivatedPartner"
      @close="dialogPartner = false" />

    <dialog-upgrade-banner
      v-if="$store.state.visibleUpgradeBanner"
    />

    <transition name="el-zoom-in-bottom">
      <div v-show="showTawkto" class="offscreen-right-sidebar-tawkto px-null">
        <div class="offscreen-right-sidebar--wrapper">
          <div class="offscreen-right-sidebar--header-tawkto text-left px-10" style="z-index: 10">
            <close-esc :hideEsc="true" :caret-down="true" @close="handleCloseTawkto" />
          </div>
          <div v-if="showChat">
            <iframe :src="tawktoUrl" class="full-width" style="height: calc(80vh - 60px); border: 1px solid #2bc5f4"/>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
  import moment from 'moment'
  // import Sidebar from './partials/Sidebar.vue'
  // import SidebarV2 from './partials/SidebarV2'
  import SidebarV2Custom from './partials/SidebarV2Custom'
  import Header from './partials/Header'
  import Footer from './partials/Footer'
  import SplashScreen from '@/components/modules/SplashScreen'
  import SmartFinder from '@/components/modules/SmartFinder'
  import DialogFreezeStore from '@/components/DialogFreezeStore'
  import InternetConnection from '@/components/modules/InternetConnection'
  import DialogScheduledPromo from '@/components/DialogScheduledPromo'
  import DialogScheduledPromoByUrl from '@/components/DialogScheduledPromoByUrl'
  import ActivationPartnership from '@/components/modules/_views/partnership/activationPartnership'
  import DialogUpgradeBanner from '@/components/DialogUpgradeBanner'
  import CloseEsc from '@/components/modules/CloseEsc'
  import { fetchStores } from '@/api/store'
  import { profileUser } from '@/api/partner'
  import { fetch as fetchStoreData } from '@/api/generalsetting'
  import basicComputedMixin from '@/mixins/basicComputedMixin'
  import { USERGUIDE_CHECKLIST_ID } from '@/utils/constant'

  export default {
    name: 'Dashboard',

    components: {
      // 'app-sidebar': SidebarV2,
      'app-sidebar-custom': SidebarV2Custom,
      'app-header': Header,
      'app-footer': Footer,
      SplashScreen,
      SmartFinder,
      DialogFreezeStore,
      InternetConnection,
      DialogScheduledPromo,
      DialogScheduledPromoByUrl,
      ActivationPartnership,
      DialogUpgradeBanner,
      CloseEsc
    },

    mixins: [basicComputedMixin],

    data() {
      return {
        loading: true,
        routerViewKey: 0,
        visibleDialogFreezeStore: false,
        storeExpired: null,
        visibleDialogToRefresh: false,
        dialogPartner: false,
        loadingPartner: false,
        dataProfile: {},
        show: false,
        showChat: true,
        showTawkto: false,
        tawktoUrl: "https://tawk.to/chat/5613725912c288fc1fd4ca94/default",
        dataStore: {}
      }
    },

    computed: {
      token() {
        return this.$store.state.user.token
      },
      userRole() {
        return this.$store.state.userStores.userRole
      },
      userStores() {
        return this.$store.state.userStores.stores
      },
      singleStore() {
        return this.$store.state.userStores.selectedStore
      },
      langId() {
        return this.$store.state.userStores.langId
      },
      rootLang() {
        return this.$lang[this.langId]
      },
      loggedInUser() {
        return this.$store.getters.loggedInUser
      },
      accessByStore () {
        return ['cvsms', 'smsstore1', 'smsstore2', 'atapsunsetcafe']
      },
      thisday () {
        var d = moment().format('HH:mm')
        if (d === '16:21') {
          return true
        } else {
          return false
        }
      }
    },

    watch: {
      routerViewKey() {
        // force reload to sync plan type
        // this.forceReload()
        this.setLockedFeatures()
      },
      // userguiding
      '$store.getters.selectedStore.is_store_can_upgrade_trial': {
        immediate: true,
        handler(payload) {
          if (payload) {
            window.userGuiding.launchChecklist(USERGUIDE_CHECKLIST_ID, {
              itemsShown: true
            })
          } else {
            window.userGuiding.hideChecklist()
          }
        }
      }
    },

    mounted() {
      this.$store.dispatch('destroyWebview')
      this.loading = false
      /**
       * check update available from service worker
       * declared in main.js
       */
      // console.log(window['isUpdateAvailable'])
      if (window['isUpdateAvailable']) {
        window['isUpdateAvailable'].then(isAvailable => {
          console.log(isAvailable)
          if (isAvailable) {
            this.visibleDialogToRefresh = true
          }
        })
      }

      if (this.userStores.length === 0) {
        let params = {
          per_page: 30,
          sort_type: ['desc', 'desc'],
          sort_column: ['is_store_active', 'created_time']
        }
        fetchStores(params).then(async response => {
          // console.log('store', response.data.data)
          this.$store.dispatch('setStoresEmpty')
          this.$store.dispatch('setStores').then(() => {
            // handle bug always return to selectstore after refresh
            if (!this.singleStore) {
              this.$router.push('/selectstore')
            }
            // this.$router.push('/selectstore')
            this.loading = false
          })
        }).catch(error => {
          if (error.statusCode === 404) {
            this.$store.commit('SET_USER_WITH_NO_STORE', 1)
            this.$router.push({
              path: '/selectstore',
              query: {
                newstore: 1
              }
            })
          }
        })
      } 
      // else if (this.userStores.length >= 1 && this.singleStore === null) {
      //   this.$router.push({
      //     path: '/selectstore'
      //   })
      // }

      // Get Profile from api myprofile for Join Partner module
      this.getProfile()
      this.getStoreData()
      // inject label hidden features
      this.setLockedFeatures()
    },

    beforeDestroy() {
      this.removeLockedFeatures()
    },

    methods: {
      handleSwitchStore(storeId) {
        this.loading = true
        this.$store.dispatch('setSelectedStore', storeId).then(response => {
          this.routerViewKey = this.routerViewKey + 1
          this.$store.commit('REMOVE_STORE_HAS_INTEGRATED_LAZADA')
          this.$store.commit('REMOVE_STORE_HAS_INTEGRATED_BUKALAPAK')
          this.loading = false
        }).catch(error => {
          this.$message({
            type: 'error',
            message: error.message
          })
          this.loading = false
        })
      },
      handleShowStore (data) {
        this.storeExpired = data
        this.visibleDialogFreezeStore = true
      },
      forceReload() {
        window.location.reload()
      },

      getProfile() {
        this.loadingPartner = true
        profileUser().then(response => {
          this.dataProfile = response.data.data
          this.loadingPartner = false
        }).catch(error => {
          this.dataProfile = {}
          this.loadingPartner = false
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        })
      },

      getStoreData() {
        this.loading = true
        fetchStoreData()
          .then(response => {
            this.dataStore = response.data.data
            this.$store.commit('SET_GENERAL_SETTING', response.data.data)
            this.loading = false
          })
          .catch(error => {
            this.$store.commit('SET_GENERAL_SETTING', null)
            this.loading = false
            this.$notify({
              type: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error
            })
          })
      },

      handleShowPartnership () {
        this.dialogPartner = true
      },

      avtivatedPartner () {
        this.getProfile()
        this.dialogPartner = false
        this.$router.push({path: '/join-partner'})
      },

      handleShowTawkto () {
        this.showTawkto = true
      },

      handleCloseTawkto () {
        this.showTawkto = false
        // this.showChat? this.showChat = false : this.showChat = true
      },
      
      setLockedFeatures() {
        this.removeLockedFeatures()
        const hidden = document.querySelectorAll('.sidebarmenu-disabled li')
        hidden.forEach(element => {
          element.insertAdjacentHTML('beforeend', '<svg aria-hidden="true" class="ml-10 svg-icon sidebarmenuitem-locked"><use xlink:href="#icon-lock"></use></svg>')
        })
      },
      removeLockedFeatures() {
        const hidden = document.querySelectorAll('.sidebarmenu-disabled li .sidebarmenuitem-locked, .sidebarmenu-enabled li .sidebarmenuitem-locked')
        if (hidden && hidden.length) {
          hidden.forEach(element => {
            console.log(element)
            element.remove()
          })
        }
      },

      // upcoming rules
      schedulePromoRules() {
        // const javaIslandProvinces = ['DKI JAKARTA', 'JAWA BARAT', 'JAWA TENGAH', 'JAWA TIMUR', 'BANTEN', 'DI YOGYAKARTA']
        // return (
        //   this.selectedStore.active_online_order === 1 && 
        //   this.selectedStore.plan_type_id === 'SOMETHING' && 
        //   this.selectedStore.created_time === 'SOMETHING' && 
        //   this.dataStore.business_type_id === 'SOMETHING' && 
        //   javaIslandProvinces.includes(this.dataStore.state_name)
        // )
      },

      // temp rules
      tempSchedulePromoRules(){
        // const javaIslandProvinces = ['DKI JAKARTA', 'JAWA BARAT', 'JAWA TENGAH', 'JAWA TIMUR', 'BANTEN', 'DI YOGYAKARTA']
        // return (
        //   this.selectedStore.active_online_order === 1 && 
        //   javaIslandProvinces.includes(this.dataStore.state_name) 
        // )
        return false
      },

      getCustomPermission() {
        this.$store.dispatch('customPermission/fetchRoles')
      }
    }
  }
</script>
