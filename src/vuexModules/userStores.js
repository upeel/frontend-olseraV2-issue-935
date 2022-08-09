import { fetchStores, fetchStore } from '@/api/store'
const storageSelectedStore = localStorage.getItem('olsbo_selectedstore') ? JSON.parse(localStorage.getItem('olsbo_selectedstore')) : null
const selectedStore = storageSelectedStore
let userRole = {}
if (storageSelectedStore) {
  userRole = {
    role_id: storageSelectedStore.role_id,
    role_name: storageSelectedStore.role_name,
    is_pos_only: storageSelectedStore.is_pos_only,
    is_mobile: storageSelectedStore.is_mobile,
    store_used: storageSelectedStore.created_time
  }
}
// const lang = storageSelectedStore ? JSON.parse(storageSelectedStore.lang) : {}
// const langId = storageSelectedStore ? storageSelectedStore.lang_code : 'id'
const lang = localStorage.getItem('olsbo_langData') ? JSON.parse(localStorage.getItem('olsbo_langData')) : storageSelectedStore ? JSON.parse(storageSelectedStore.lang) : {}
const langId = localStorage.getItem('olsbo_langId') ? localStorage.getItem('olsbo_langId') : storageSelectedStore ? storageSelectedStore.lang_code : 'id'

export const handleStoresData = async (stores) => {
  await stores.map((item, idx, array) => {
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
      role_id: item.role_id,
      remaining_active_days: item.remaining_active_days,
      is_store_active: item.is_store_active
    }
  })
  await stores.map(i => {
    if (
      i.android_left_label === 'danger' &&
      i.ios_left_label === 'danger' &&
      i.pos_left_label === 'danger' &&
      i.store_left_label === 'danger'
    ) {
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
  return stores
}

const userStores = {
  state: {
    stores: [],
    selectedStore,
    lang,
    langId,
    inputMoney: {
      precision: 0,
      prefix: ''
    },
    userRole,
    meta: {}
  },

  mutations: {
    SET_STORES: (state, data) => {
      state.stores.push(...data)
    },
    UNSHIFT_STORES: (state, data) => {
      state.stores.unshift(...data)
    },
    SET_STORES_META: (state, data) => {
      state.meta = data
    },
    SET_SELECTED_STORE: (state, store) => {
      // store.pos_freemium = 1
      // store.is_onlineshop = 1
      state.selectedStore = store
      // console.log(state.selectedStore)
      state.lang = JSON.parse(store.lang)
      state.langId = store.lang_code
      state.userRole = {
        role_id: store.role_id,
        role_name: store.role_name,
        is_pos_only: store.is_pos_only,
        is_mobile: store.is_mobile,
        store_used: store.created_time
      }
      if (store.currency_id === 'IDR') {
        state.inputMoney.precision = 0
        state.inputMoney.prefix = 'Rp. '
      } else {
        state.inputMoney.precision = 2
        state.inputMoney.prefix = store.currency_id + ' '
      }
      localStorage.setItem('olsbo_selectedstore', JSON.stringify(store))
    },
    REMOVE_SELECTED_STORE: (state) => {
      state.selectedStore = null
      localStorage.removeItem('olsbo_selectedstore')
      state.lang = {}
      state.langId = 'id'
      state.userRole = {}
    },
    SET_LANG: (state, payload) => {
      state.lang = payload
    },
    SET_LANG_ID: (state, payload) => {
      state.langId = payload
    },
    SET_STORES_EMPTY: (state) => {
      state.stores = []
    },
    SET_STORE_PLAN_TYPE: (state, payload) => {
      state.stores = state.stores.map(store => {
        if (store.store_id === payload.store_id) {
          store.plan_type_id = payload.plan_type_id
          store.plan_type_name = payload.plan_type_name
        }
        return store
      })
    }
  },

  actions: {
    setStores({ commit }, page = 1) {
      return new Promise((resolve, reject) => {
        let params = {
          per_page: 60,
          page,
          sort_type: ['desc', 'desc'],
          sort_column: ['is_store_active', 'created_time']
        }
        fetchStores(params).then(async response => {
          const stores = await handleStoresData(response.data.data)
          commit('SET_STORES', stores)
          commit('SET_STORES_META', response.data.meta)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    setStoresEmpty({ commit }) {
      return new Promise((resolve) => {
        commit('SET_STORES_EMPTY')
        resolve([])
      })
    },
    setSelectedStore({ commit }, storeId) {
      return new Promise((resolve, reject) => {
        fetchStore(storeId).then(response => {
          commit('SET_SELECTED_STORE', response.data.data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    async addStore({ commit }, store) {
      const handleStore = await handleStoresData([store])
      commit('UNSHIFT_STORES', handleStore)
    },
    logoutStore({ commit }) {
      // console.log('logout store')
      commit('SET_STORES', [])
      commit('REMOVE_SELECTED_STORE')
    },
    setLangLocally({ commit }, data) {
      commit('SET_LANG', data.lang)
      commit('SET_LANG_ID', data.id)
      localStorage.setItem('olsbo_langData', JSON.stringify(data.lang))
      localStorage.setItem('olsbo_langId', data.id)
    },
    setStorePlanType({ commit }, data) {
      commit('SET_STORE_PLAN_TYPE', data)
    }
  }
}

export default userStores
