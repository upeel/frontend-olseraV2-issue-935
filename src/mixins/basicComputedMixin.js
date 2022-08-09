import baseURL from '@/utils/baseURL'
import { checkCustomPermission } from './checkCustomPermission'

const basicComputedMixin = {
  mixins: [checkCustomPermission],
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
      return this.$store.state.userStores ? this.$store.state.userStores.lang : {}
    },
    userRole() {
      const selectedStore = this.$store.getters.selectedStore
      return {
        role_id: selectedStore.role_id,
        role_name: selectedStore.role_name,
        is_pos_only: selectedStore.is_pos_only,
        is_mobile: selectedStore.is_mobile
      }
    },
    rootLang() {
      return this.$lang[this.langId]
    },
    headers() {
      let token = this.$store.getters.token
      if (this.$store.getters.webviewMode) {
        token = this.$store.getters.webviewToken
      }
      return {
        'Authorization': 'Bearer ' + token.access_token
      }
    },
    baseURL() {
      // console.log(baseURL)
      return baseURL
    },
    loggedInUser() {
      return this.$store.state.user.loggedInUser
    },
    stageLevel() {
      return process.env.ENV_CONFIG
    },
    defaultAccessByStore () {
      return ['setdemo1', 'allinolsera2']
    },

    wejayafoodAccessByStore () {
      return [
        'setdemo1', 
        'allinolsera2', 
        'ayammrotholpusat', 
        'ayammrotholdramaga', 
        'ayammrotholcikande',
        'ayammrotholpermata',
        'ayammrotholcijerah',
        'ayammrotholpesantren',
        'ayammrotholgerogol',
        'ayammrotholpanjaitan'
      ]
    },

    saveToAllAccessStore () {
      return ['setdemo1', 'allinolsera2', 'siliwangidutagarden', 'barokahfrozenfood',  ]
    },

    outlets() {
      const outlets = [
        {
          name: this.$store.state.userStores.lang.all,
          store_id: 0,
          url_id: 'all'
        }
      ]
      const vuexStores = this.$store.getters.stores
      const addedStoreIds = []
      vuexStores.map(item => {
        if (!addedStoreIds.includes(item.store_id)) {
          if (item.is_store_active) {
            outlets.push({ ...item })
            addedStoreIds.push(item.store_id)
          }
        }
      })
      return outlets
    },

    tokopediaActiveStore () {
      return this.$store.state.tokopediaActiveStore
    },

    shopeeActiveStore () {
      return this.$store.state.shopeeActiveStore
    }
  }
}

export default basicComputedMixin
