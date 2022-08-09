var moment = require('moment')
const mixinReport = {
  data() {
    return {
      initParamDate: []
    }
  },

  computed: {
    lang() {
      return this.$store.state.userStores.lang
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    rootLang() {
      return this.$lang[this.langId]
    },
    selectedStore() {
      if (this.$store.getters.webviewMode) {
        return this.$store.getters.webviewSelectedStore
      } else {
        return this.$store.getters.selectedStore
      }
    },
    token() {
      if (this.$store.getters.webviewMode) {
        return this.$store.getters.webviewToken
      } else {
        return this.$store.getters.token
      }
    },
    activeReport() {
      const activeReport = this.paths.filter((path) => {
        if (this.$route.query.path) {
          return path.path === this.$route.query.path
        } else if (localStorage.getItem('olsbo_downloadfrompath')) {
          return path.path === localStorage.getItem('olsbo_downloadfrompath')
        } else {
          return path.active === true
        }
      })
      if (activeReport.length) {
        return activeReport[0]
      } else {
        return this.paths[0]
      }
    },
    loadedComponent() {
      return 'table-' + this.activeReport.path
    },
    userRole() {
      const selectedStore = this.$store.getters.webviewMode ? this.$store.state.webview.selectedStore : this.$store.getters.selectedStore
      return {
        role_id: selectedStore.role_id,
        role_name: selectedStore.role_name,
        is_pos_only: selectedStore.is_pos_only,
        is_mobile: selectedStore.is_mobile
      }
    },
    isFreemium() {
      return this.$store.getters.selectedStore.pos_freemium
    },
    headers() {
      let token = this.$store.getters.token
      if (this.$store.getters.webviewMode) {
        token = this.$store.getters.webviewToken
      }
      return {
        'Authorization': 'Bearer ' + accessToken.access_token
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
  },

  watch: {
    '$store.getters.selectedStore': {
      deep: true,
      immediate: true,
      handler(store, oldStore) {
        // console.log('watch selectedStore', store, oldStore)
        if (store && oldStore) {
          /**
           * behave like mounted, executed by $router.push from WebviewDownloading Component
           */
          const isFreemium = store.pos_freemium
          if (this.activeReport && !localStorage.getItem('olsbo_downloadfrompath')) {
            if (isFreemium && this.activeReport.path !== 'freemium' && this.activeReport.premium && this.selectedStore.is_onlineshop !== 1) {
              if (this.activeReport.path !== 'salesdetails' && this.$route.path === '/reports/sales') {
                this.$router.push({
                  path: '/dashboard'
                })
              } else {
                this.showReport('freemium')
              }
            } else if (!isFreemium && this.activeReport.path === 'freemium') {
              this.showReport(this.paths[0].path)
            } else {
              this.getData(this.activeReport.path)
            }
          } else if (localStorage.getItem('olsbo_downloadfrompath')) {
            this.getData(localStorage.getItem('olsbo_downloadfrompath'))
          }
        }
      }
    },

    /**
     * additional code to handle router back without resetting the old params
     */
    params: {
      immediate: false,
      deep: true,
      handler(data) {
        localStorage.setItem('olsbo_report_params', JSON.stringify(data))
      }
    }
  },

  methods: {
    toggleReportList() {
      if (document.body.classList.contains('hide-report-list')) {
        document.body.classList.remove('hide-report-list')
      } else {
        document.body.classList.add('hide-report-list')
      }
    },
    setDefaultParamsFromLocalStorage(vm, from) {
      /**
       * additional code to handle router back without resetting the old params
       */
      const routeNames = [
        'Products Report',
        'Purchases Report',
        'Sales Report',
        'Shifts Report',
        'Payment Report',
        'Multi Outlets',
        'Attendance Report',
        'webview-downloading'
      ]
      if (routeNames.includes(from.name)) {
        if (localStorage.getItem('olsbo_report_params')) {
          vm.params = { ...vm.params, ...JSON.parse(localStorage.getItem('olsbo_report_params')) }
          if (vm.params.from) {
            vm.initParamDate.push(vm.params.from)
          }
          if (vm.params.to) {
            vm.initParamDate.push(vm.params.to)
          }
        }
      } else {
        vm.initParamDate = [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
      }
    },
    setLocalStorageForBackAfterDownload() {
      localStorage.setItem('olsbo_downloadfrompath', this.activeReport.path)
      localStorage.setItem('olsbo_downloadfromurl', this.$route.path)
    }
  }
}

export default mixinReport
