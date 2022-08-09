<template>
  <header class="main-header">
    <nav id="main-navbar" class="navbar navbar-static-top">
      <a
        href="#"
        class="sidebar-toggle"
        role="button"
        @click.prevent="toggleOffCanvas">
        <svg-icon icon-class="menu" />
      </a>

      <breadcrumb :list="list" />

      <div class="navbar-custom-menu">
        <ul class="nav navbar-nav">
          <li>
            <div class="smart-finder">
              <el-button round size="small" @click="handleShowSmartFinder">
                <i class="el-icon-search"></i> Smart finder
              </el-button>
            </div>
          </li>
          <!-- go to onlinestore -->
          <li v-if="selectedStore.is_onlineshop">
            <a
              :href="computedStoreUrl"
              target="_blank"
              class="goto-onlinestore">
              <el-button type="text" size="small" round>
                <svg-icon icon-class="shopbagwhite_ico" />
              </el-button>
            </a>
          </li>
          <!-- notifications -->
          <li>
            <el-dropdown
              class="header-dropdown-devin header-dropdown-notification"
              trigger="click">
              <span class="el-dropdown-link">
                <el-badge
                  :value="notifcount"
                  :max="99"
                  :hidden="hideNotify"
                  class="item">
                  <el-button type="text" size="small" @click="hideNotify = true">
                    <svg-icon icon-class="bell" />
                  </el-button>
                </el-badge>
              </span>

              <el-dropdown-menu
                v-loading="loading" 
                slot="dropdown"
                class="dropdown-notification">
                <ul class="dropdown-menu-devin">
                  <li class="header-notif">
                    <div class="flex-container">
                      <div style="flex-grow: 1;">
                        {{ $lang[langId].notifications }}
                      </div>
                      <el-button
                        type="text"
                        icon="el-icon-refresh"
                        @click="getNotifications"
                      />
                    </div>
                  </li>

                  <li>
                    <div class="menunotif">
                      <el-collapse v-model="activeNotif">
                        <el-collapse-item
                          v-for="(item, key) in arrayNotifs"
                          :name="'notif-' + key"
                          :title="item.tipe_name"
                          :key="key">
                          <list :item="item" />
                        </el-collapse-item>
                      </el-collapse>
                    </div>
                  </li>
                </ul>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
          <!-- new select outlets--start -->
          <template v-if="stageLevel === 'dev' || stageLevel === 'sit'">
            <li v-if="filteredOutletOption && filteredOutletOption.length" >
              <div class="ml-8">
                <el-select 
                  v-model="selectedOutlet"
                  value-key="store_id"
                  filterable 
                  remote
                  :remote-method="handleFetchFilteredOutletOption"
                  @focus="handleFocusSelectOutlet"
                  @change="handleChangeSelectOutlet"
                  @visible-change="handleDropdownSelectOutletToggle"
                  :loading="isSelectOutletLoading"
                  ref="selectoutlet"
                  placeholder="Select"
                  class="el-select--custom-select-outlet"
                  popper-class="el-select--custom-select-outlet--popper"
                >
                  <template #prefix>
                    <el-avatar
                      :src="selectedOutlet.logo"
                      :size="24"
                      style="background: #EEEEEE"
                    />
                  </template>
                  <template #empty>
                    <div class="el-select-dropdown__item" style="text-align: center;">
                      Loading...
                    </div>
                  </template>
                  <el-option
                    v-for="item in filteredOutletOption"
                    :key="item.store_id"
                    :label="item.name"
                    :value="item"
                  >
                    <div class="flex-container" >
                      <el-avatar :src="item.logo" style="margin-right: 6px; background: #EEEEEE" />
                      <div style="line-height: 1; flex-grow: 1;">
                        <div class="color-body">
                          <strong>{{ item.name }}</strong>
                        </div>
                      </div>
                      <div v-if="item.disable">
                        <div class="chip chip--default flex-container">
                          <div class="mr-8">
                            <svg-icon icon-class="alert-circle" />
                          </div>
                          Dibekukan
                        </div>
                      </div>
                      <div v-else>
                        <plan-type-chip
                          v-if="item.is_pos"
                          :plan-type-id="item.plan_type_id"
                        >
                          <span v-if="item.plan_type_id !== 'L'">
                            {{ item.pos_left }}
                          </span>
                          <span v-else>Gratis</span>
                        </plan-type-chip>
                        <div 
                          v-for="otherPlanType in ['is_onlineshop', 'link_android_app', 'link_ios_app']"
                          :key="otherPlanType"
                        >
                          <plan-type-chip
                            v-if="item[otherPlanType] && !item.is_pos"
                            :plan-type-id="otherPlanType"
                          >
                            {{ item.store_left }}
                          </plan-type-chip>
                        </div>
                      </div>
                    </div>
                  </el-option>
                  <el-button
                    v-if="filteredOutletOption.length < filteredOutletOptionMeta.total"
                    :loading="loadingLoadMoreFilteredOutletOption"
                    type="info"
                    class="btn-block"
                    @click="loadMorefilteredOutletOption"
                  >
                    Load more
                  </el-button>
                  <el-button
                    type="info"
                    icon="el-icon-plus"
                    class="btn-block"
                    @click="createNewStore"
                  />
                </el-select>
              </div>
            </li>
          </template>
          <template v-else>
            <li
              v-if="stores && stores.length"
              class="select-outlets hover-info">
              <el-dropdown
                type="primary"
                size="small"
                trigger="click"
                @command="handleSwitchOutlet">
                <div class="flex-container trigger-select-outlets">
                  <div class="flex-container">
                    <el-avatar
                      :src="selectedStore.logo"
                      :size="24"
                      style="margin-right: 6px; background: #EEEEEE"
                    />
                  </div>
                  <div class="font-bold color-body full-width wrap-text">
                    {{ selectedStore.name }}
                    <div class="hover-info--content">
                      {{ selectedStore.name }}
                    </div>
                  </div>
                </div>
                <el-dropdown-menu
                  slot="dropdown"
                  class="select-outlets--popper">
                  <el-dropdown-item
                    v-for="item in stores"
                    :key="item.store_id"
                    :command="item"
                    :class="[
                      selectedStore.store_id === item.store_id ? 'color-primary--soft--bg' : ''
                    ]">
                    <div
                      class="flex-container"
                      style="padding: 4px 8px;">
                      <el-avatar :src="item.logo" style="margin-right: 6px; background: #EEEEEE" />
                      <div style="line-height: 1; flex-grow: 1;">
                        <div class="color-body">
                          <strong>{{ item.name }}</strong>
                        </div>
                        <div class="color-old-grey font-12">
                          {{ item.url_id }}.myolsera.com
                        </div>
                      </div>
                      <div v-if="item.disable">
                        <div
                          class="chip chip--default flex-container">
                          <div class="mr-8">
                            <svg-icon icon-class="alert-circle" />
                          </div>
                          Dibekukan
                        </div>
                      </div>
                      <div v-else>
                        <plan-type-chip
                          v-if="item.is_pos"
                          :plan-type-id="item.plan_type_id">
                          <span v-if="item.plan_type_id !== 'L'">
                            {{ item.pos_left }}
                          </span>
                          <span v-else>
                            Gratis
                          </span>
                        </plan-type-chip>
                        <template
                          v-for="otherPlanType in ['is_onlineshop', 'link_android_app', 'link_ios_app']">
                          <plan-type-chip
                            :key="otherPlanType"
                            v-if="item[otherPlanType] && !item.is_pos"
                            :plan-type-id="otherPlanType">
                            {{ item.store_left }}
                          </plan-type-chip>
                        </template>
                      </div>
                    </div>
                  </el-dropdown-item>
                  <el-button
                    v-if="stores.length < userStoresMeta.total"
                    :loading="loadingLoadMoreStores"
                    type="info"
                    class="btn-block"
                    @click="loadMoreStores">
                    Load more
                  </el-button>
                  <el-divider></el-divider>
                  <el-button
                    type="info"
                    icon="el-icon-plus"
                    class="btn-block"
                    @click="createNewStore"
                  />
                </el-dropdown-menu>
              </el-dropdown>
            </li>
          </template>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import Breadcrumb from '../modules/Breadcrumb'
import { baseApi } from 'src/http-common'
import axios from 'axios'
import List from '../modules/_views/notifications/List'
import dataWhatsnew from '@/components/modules/_views/whatsnew/data'
import PlanTypeChip from '@/components/modules/planType/PlanTypeChip'
const apiEndpoint = 'notifications/'
import { fetchStores } from '@/api/store'
import { handleStoresData } from '@/vuexModules/userStores'

import basicComputedMixin from '@/mixins/basicComputedMixin'

const moment = require('moment')

export default {
  name: 'DashboardHeader',

  props: {
    stores: {
      default: () => [],
      type: Array
    }
  },

  mixins: [basicComputedMixin],

  components: {
    Breadcrumb,
    List,
    PlanTypeChip
  },

  data() {
    return {
      loading: false,
      currentOutlet: null,
      notif: [],
      notifcount: 0,
      collapsed: true,
      collapsedorder: true,
      collapsedcustomer: true,
      activeNotif: 'notif-0',
      dataWhatsnew,
      hideNotify: false,
      loadingLoadMoreStores: false,
      // new select outlets data
      selectedOutlet: {},
      prevSelectedOutlet: {},
      isSelectOutletLoading: false,
      filteredOutletOption: [],
      filteredOutletOptionMeta: {},
      defaultFilteredOutletOptionMeta: {},
      loadingLoadMoreFilteredOutletOption: false,
      searchText: '',
    }
  },

  computed: {
    name() {
      return this.$route.name
    },
    list() {
      return this.$route.matched
    },
    token() {
      return this.$store.state.user.token
    },
    selectedStore() {
      return this.$store.getters.selected_store
    },
    stageLevel() {
      return process.env.ENV_CONFIG
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    arrayNotifs() {
      return this.notif.filter(item => item.count > 0)
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    dataWhatsnewCount() {
      const count = this.dataWhatsnew.filter(item => {
        return item.setting.new
      })
      return count.length
    },
    computedStoreUrl() {
      return 'https://' + this.selectedStore.url_id + '.myolsera.com'
    },
    userStoresMeta() {
      return this.$store.getters.storesMeta
    },
    userStores() {
      return this.$store.state.userStores.stores
    },
  },

  watch: {
    '$store.getters.selectedStore': {
      handler(store) {
        this.currentOutlet = store.store_id
        this.getNotifications()
        this.selectedOutlet = store
      },
      immediate: true,
      deep: true
    },
  },

  mounted() {
    this.getNotifications()
    this.setDefaultOutletOptionMeta()
    this.setDefaultOutletOption()
  },

  methods: {
    handleSwitchOutlet(data) {
      if (!data.disable) {
        if (data.role_id !== 'OW' && data.plan_type_id === 'L' && (
          !data.mobile_expiry_android && !data.mobile_expiry_ios
        )) {
          const h = this.$createElement;
          this.$notify({
            type: 'warning',
            message: h('i', { class: 'color-warning font-16', style: 'margin-top: -10px' }, 'Hanya bisa diakses oleh owner'),
            customClass: 'color-warning--soft--bg notif-extend'
          })
        } else {
          if (data.plan_type_id === 'L' && data.role_id !== 'OW' && (
            data.mobile_expiry_android !== null && moment(data.mobile_expiry_android, 'YYYY-MM-DD').isBefore(moment()) &&
            data.mobile_expiry_ios !== null && moment(data.mobile_expiry_ios, 'YYYY-MM-DD').isBefore(moment())
          )) {
            this.$message({
              type: 'error',
              message: this.rootLang.you_arent_authorized
            })
            return
          }
          const outletId = data.store_id
          this.$emit('outlet-switched', outletId)
        }
      } else {
        this.$emit('showdialog', data)
      }
    },

    getNotifications() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let param = {
        sort_type: 'desc',
        sort_column: 'id'
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint),
        headers: headers,
        params: param
      }).then(response => {
        this.loading = false
        this.$nextTick(() => {
          this.notif = response.data.data
          this.notifcount = response.data.count
        })
      })
    },

    toggleOffCanvas() {
      this.$store.commit('SET_TOGGLE_CANVAS')
    },

    goToWhatsNew() {
      this.$router.push({
        path: '/whatsnew'
      })
    },

    createNewStore() {
      this.$router.push({
        path: '/selectstore',
        query: {
          newstore: 1
        }
      })
    },

    handleShowSmartFinder() {
      this.$store.commit('SET_VISIBLE_SMART_FINDER')
    },

    loadMoreStores() {
      this.loadingLoadMoreStores = true
      this.$store.dispatch('setStores', this.userStoresMeta.current_page + 1).then(() => {
        this.loadingLoadMoreStores = false
      }).catch((error) => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingLoadMoreStores = false
      })
    },
    
    // new select outlets handler--start
    async setDefaultOutletOptionMeta() {
      try {
        const params = {
            page: 1,
            per_page: 15,
            sort_type: ['desc', 'desc'],
            sort_column: ['is_store_active', 'created_time']
          }
        const response = await fetchStores(params)
        this.defaultFilteredOutletOptionMeta = { ...response.data.meta }
        this.filteredOutletOptionMeta = { ...response.data.meta }
      } catch (error) {
        this.$message({
          type: 'error',
          message: error.string
        })
      }
    },

    setDefaultOutletOption() {
      const defaultFiveteen = this.stores.slice(0, 15)
      const filteredDefaultFiveteen = defaultFiveteen.filter(e => (e.store_id !== this.selectedOutlet.store_id))
      const selectedOutlet = this.stores.filter((e) => (e.store_id === this.selectedOutlet.store_id))
      filteredDefaultFiveteen.unshift(selectedOutlet[0])
      this.filteredOutletOption = [...filteredDefaultFiveteen]
      this.filteredOutletOptionMeta = { ...this.defaultFilteredOutletOptionMeta }
    },

    handleFocusSelectOutlet() {
      this.prevSelectedOutlet = this.selectedOutlet
    },

    handleDropdownSelectOutletToggle(isOpen) {
      if (!isOpen) {
        if (this.searchText !== '') {
          this.searchText = ''
          this.setDefaultOutletOption()
        }
      } 
    },

    handleChangeSelectOutlet(data) {
      if (data.store_id === this.prevSelectedOutlet.store_id) {
        this.setDefaultOutletOption()
        return
      }
      if (!data.disable) {
        if (data.role_id !== 'OW' && data.plan_type_id === 'L' && !data.mobile_expiry_android && !data.mobile_expiry_ios) {
          this.selectedOutlet = this.prevSelectedOutlet
          let message = 'Hanya bisa diakses oleh owner'
          this.$message({
            type: 'warning',
            message
          })
          this.setDefaultOutletOption()
        } else {
          if (data.plan_type_id === 'L' && data.role_id !== 'OW' && (
            data.mobile_expiry_android !== null && moment(data.mobile_expiry_android, 'YYYY-MM-DD').isBefore(moment()) &&
            data.mobile_expiry_ios !== null && moment(data.mobile_expiry_ios, 'YYYY-MM-DD').isBefore(moment())
          )) {
            this.$message({
              type: 'error',
              message: this.rootLang.you_arent_authorized
            })
            return
          }
          this.prevSelectedOutlet = data
          this.$emit('outlet-switched', data.store_id)
          this.setDefaultOutletOption()
          this.$store.commit('REMOVE_TOKOPEDIA_ACTIVE_STORE')
          this.$store.commit('REMOVE_SHOPEE_ACTIVE_STORE')
          this.$store.commit('REMOVE_LAZADA_ACTIVE_STORE')
        }
      } else {
        this.selectedOutlet = this.prevSelectedOutlet
        this.$emit('showdialog', data)
        this.setDefaultOutletOption()
      }
    },

    async handleFetchFilteredOutletOption(query) {
      if (query !== '') {
        this.searchText = query
        try {
          this.isSelectOutletLoading = true
          const params = {
            page: 1,
            per_page: 15,
            search_text: this.searchText,
            search_column: 'name',
            search_condition: 'like',
            sort_type: ['desc', 'desc'],
            sort_column: ['is_store_active', 'created_time']
          }
          const response = await fetchStores(params)
          this.filteredOutletOption = await handleStoresData(response.data.data)
          this.filteredOutletOptionMeta = response.data.meta
        } catch (error) {
          this.$message({
            type: 'error',
            message: error.string
          })
          this.setDefaultOutletOption()
        } finally {
          this.isSelectOutletLoading = false
        }
      } else {
        this.searchText = ''
        this.setDefaultOutletOption()
      }
    },

    async loadMorefilteredOutletOption() {
      this.$refs.selectoutlet.focus()
      this.loadingLoadMoreFilteredOutletOption = true
      this.filteredOutletOptionMeta.current_page += 1
      let params = {
          page: this.filteredOutletOptionMeta.current_page,
          per_page: 15,
          sort_type: ['desc', 'desc'],
          sort_column: ['is_store_active', 'created_time']
      }
      if (this.searchText !== '') {
        params = { 
          ...params,
          search_text: this.searchText,
          search_column: 'name',
          search_condition: 'like',
        }
      }
      try {
        const response = await fetchStores(params)
        let tempResponse = await handleStoresData(response.data.data)
        let tempArr = this.filteredOutletOption
        this.filteredOutletOption = [...tempArr, ...tempResponse]
        if (this.searchText !== '') {
          const isSelectedOutletIncluded = this.filteredOutletOption.some(e => e.store_id === this.selectedOutlet.store_id)
          if (isSelectedOutletIncluded) return
          this.filteredOutletOption = this.filteredOutletOption.filter(e => e.store_id !== this.selectedOutlet.store_id)
        }
        this.filteredOutletOptionMeta = response.data.meta
      } catch (error) {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.setDefaultOutletOption()
      } finally {
        this.loadingLoadMoreFilteredOutletOption = false
      }
    },
    // new select outlets handler--end
  }
}
</script>
