import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import routesByPermission from './vuexModules/routesByPermission'
import requestParam from './vuexModules/requestParam'
import userStores from './vuexModules/userStores'
import user from './vuexModules/user'
import webview from './vuexModules/webview'
import customPermission from './vuexModules/customPermission'
Vue.use(Vuex)

const wkrhours = localStorage.getItem('olsbo_wrkhours') ? localStorage.getItem('olsbo_wrkhours') : 1
const delivery = localStorage.getItem('olsbo_delivery') ? localStorage.getItem('olsbo_delivery') : 1
const service = localStorage.getItem('olsbo_service') ? localStorage.getItem('olsbo_service') : 1
const isFreemium = localStorage.getItem('olsbo_selectedstore') ? JSON.parse(localStorage.getItem('olsbo_selectedstore')).pos_freemium : 0
const whatsnewHighlight = localStorage.getItem('olsbo_whatsnewHighlight') ? JSON.parse(localStorage.getItem('olsbo_whatsnewHighlight')) : true
// const sessionToken = localStorage.getItem('olsbo_sessionToken') ? JSON.parse(localStorage.getItem('olsbo_sessionToken')) : null
// const tokenAttendance = localStorage.getItem('olsbo_tokenAttendance') ? JSON.parse(localStorage.getItem('olsbo_tokenAttendance')) : null
// const idEmployeePresence = localStorage.getItem('olsbo_idEmployeePresence') ? JSON.parse(localStorage.getItem('olsbo_idEmployeePresence')) : null
// const useNewLPoint = localStorage.getItem('olsbo_useNewLPoint') ? JSON.parse(localStorage.getItem('olsbo_useNewLPoint')) : 0
const userWithNoStore = localStorage.getItem('olsbo_userWithNoStore') ? JSON.parse(localStorage.getItem('olsbo_userWithNoStore')) : 0
const storeHasIntegrateLazada = localStorage.getItem('olsbo_storeHasIntegrateLazada') ? JSON.parse(localStorage.getItem('olsbo_storeHasIntegrateLazada')) : 0
const tokopediaActiveStore = localStorage.getItem('olsbo_tokopediaActiveStore') ? JSON.parse(localStorage.getItem('olsbo_tokopediaActiveStore')) : null
const shopeeActiveStore = localStorage.getItem('olsbo_shopeeActiveStore') ? JSON.parse(localStorage.getItem('olsbo_shopeeActiveStore')) : null
const bukalapakActiveStore = localStorage.getItem('olsbo_bukalapakActiveStore') ? JSON.parse(localStorage.getItem('olsbo_bukalapakActiveStore')) : null

const state = {
  sidebarCollapse: false,
  bannerOnlineOrder: {
    working_hours: wkrhours,
    delivery: delivery,
    service: service
  },
  accountingIntegration: {},
	accountingReport: {},

  // ambil data nya dari api
  isFreemium,
  whatsnewHighlight,
  sessionToken: null,
  tokenAttendance: null,
  idEmployeePresence: null,
  generalSetting: {},
  useNewLPoint: 0,
  visibleSmartFinder: false,
  userWithNoStore,
  visibleUpgradeBanner: false,
  storeHasIntegrateLazada,
  tokopediaActiveStore,
  shopeeActiveStore
}

const mutations = {
  SET_SESSION_TOKEN (state, sessionToken) {
    state.sessionToken = sessionToken
    localStorage.setItem('olsbo_sessionToken', JSON.stringify(sessionToken))
  },
  SET_TOKEN_ATTENDANCE (state, tokenAttendance) {
    state.tokenAttendance = tokenAttendance
    localStorage.setItem('olsbo_tokenAttendance', JSON.stringify(tokenAttendance))
  },
  REMOVE_TOKEN_ATTENDANCE (state) {
    localStorage.removeItem('olsbo_tokenAttendance')
    localStorage.removeItem('olsbo_sessionToken')
    state.sessionToken = null
    state.tokenAttendance = {
      access_token: null,
      refresh_token: null
    }
  },
  SET_ID_EMPLOYEE_PRESENCE (state, idEmployeePresence) {
    state.idEmployeePresence = idEmployeePresence
    localStorage.setItem('olsbo_idEmployeePresence', JSON.stringify(idEmployeePresence))
  },
  REMOVE_ID_EMPLOYEE_PRESENCE (state) {
    localStorage.removeItem('olsbo_idEmployeePresence')
    state.idEmployeePresence = null
  },
  SET_STORE_PLAN (state, freemium) {
    // state.isFreemium = 0
    state.isFreemium = freemium
  },
  SET_TOGGLE_CANVAS (state) {
    state.sidebarCollapse = state.sidebarCollapse ? false : true

    if (state.sidebarCollapse) {
      document.body.classList.add('sidebar-collapse')
    } else {
      document.body.classList.remove('sidebar-collapse')
    }
  },
  SET_BANNER_ORDER (state, data) {
    if (data.id === 1) {
      state.bannerOnlineOrder.working_hours = data.value
      localStorage.setItem('olsbo_wrkhours', data.value)
    }
    if (data.id === 2) {
      state.bannerOnlineOrder.delivery = data.value
      localStorage.setItem('olsbo_delivery', data.value)
    }
    if (data.id === 3) {
      state.bannerOnlineOrder.service = data.value
      localStorage.setItem('olsbo_service', data.value)
    }
  },
	SET_ACCOUNTING_REPORT(state, payload){
		state.accountingReport = payload
	},
  SET_INTEGRATION_TYPE(state, payload){
    if(payload.thirdParty === 'jurnal'){
      state.accountingIntegration.jurnal = payload.value
    }

    if(payload.thirdParty === 'accurate'){
      state.accountingIntegration.accurate = payload.value
    }
    
    if(payload.toStorage){
      localStorage.setItem('olsbo_thirdPartyIntegration', payload.value)
    }
  },
  REMOVE_INTEGRATION_TYPE (state, payload) {
    if(payload.thirdParty === 'jurnal'){
      state.accountingIntegration.jurnal = null
    }

    if(payload.thirdParty === 'accurate'){
      state.accountingIntegration.accurate = null
    }
    localStorage.removeItem('olsbo_thirdPartyIntegration')
    // state.thirdPartyIntegration = null
  },
  SET_WHATSNEW_HIGHLIGHT (state, payload) {
    state.whatsnewHighlight = payload
    localStorage.setItem('olsbo_whatsnewHighlight', payload)
  },
  SET_GENERAL_SETTING (state, payload) {
    state.generalSetting = payload
  },
  SET_USE_NEW_LPOINT (state, useNewLPoint) {
    state.useNewLPoint = useNewLPoint
    localStorage.setItem('olsbo_useNewLPoint', useNewLPoint)
  },
  SET_VISIBLE_SMART_FINDER (state) {
    state.visibleSmartFinder = !state.visibleSmartFinder
  },
  SET_USER_WITH_NO_STORE (state, userWithNoStore) {
    state.userWithNoStore = userWithNoStore
    localStorage.setItem('olsbo_userWithNoStore', userWithNoStore)
  },
  SET_VISIBLE_UPGRADE_BANNER (state, payload) {
    state.visibleUpgradeBanner = payload
  },
  SET_STORE_HAS_INTEGRATED_LAZADA (state, storeHasIntegrateLazada) {
    state.storeHasIntegrateLazada = storeHasIntegrateLazada
    localStorage.setItem('olsbo_storeHasIntegrateLazada', storeHasIntegrateLazada)
  },
  REMOVE_STORE_HAS_INTEGRATED_LAZADA (state) {
    localStorage.removeItem('olsbo_storeHasIntegrateLazada')
    state.storeHasIntegrateLazada = 0
  },
  SET_TOKOPEDIA_ACTIVE_STORE (state, tokopediaActiveStore) {
    state.tokopediaActiveStore = tokopediaActiveStore
    localStorage.setItem('olsbo_tokopediaActiveStore', JSON.stringify(tokopediaActiveStore))
  },
  REMOVE_TOKOPEDIA_ACTIVE_STORE (state) {
    localStorage.removeItem('olsbo_tokopediaActiveStore')
    state.tokopediaActiveStore = null
  },
  SET_SHOPEE_ACTIVE_STORE (state, shopeeActiveStore) {
    state.shopeeActiveStore = shopeeActiveStore
    localStorage.setItem('olsbo_shopeeActiveStore', JSON.stringify(shopeeActiveStore))
  },
  REMOVE_SHOPEE_ACTIVE_STORE (state) {
    localStorage.removeItem('olsbo_shopeeActiveStore')
    state.shopeeActiveStore = null
  },
  SET_BUKALAPAK_ACTIVE_STORE (state, bukalapakActiveStore) {
    state.bukalapakActiveStore = bukalapakActiveStore
    localStorage.setItem('olsbo_bukalapakActiveStore', JSON.stringify(bukalapakActiveStore))
  },
  REMOVE_SHOPEE_ACTIVE_STORE (state) {
    localStorage.removeItem('olsbo_shopeeActiveStore')
    state.shopeeActiveStore = null
  }
}

const actions = {
  toggleUpgradeBanner({ commit }, payload) {
    commit('SET_VISIBLE_UPGRADE_BANNER', payload)
  }
}

export default new Vuex.Store({
  modules: {
    routesByPermission,
    requestParam,
    userStores,
    user,
    webview,
    customPermission
  },
  state,
  mutations,
  actions,
  getters
})
