/**
 * hindari penambahan import module/3rd party library di main.js
 * karena akan semakin membuat build file membesar
 */

import Vue from 'vue'
import ElementUI from 'element-ui'
import langElUI from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import VueRouter from 'vue-router'
import store from './store'
import './permissionV2'
import VCharts from 'v-charts'
import router from './routes'
import money from 'v-money'
import langAddition from './lang'
import './icons'
import syncLocalStorage from '@/utils/syncLocalStorage'
// import Vddl from 'vddl'
import * as VueGoogleMaps from 'vue2-google-maps'
import PerfectScrollbar from 'vue2-perfect-scrollbar'
import VueCountdownTimer from 'vuejs-countdown-timer'
import VueCountdown from '@chenfengyuan/vue-countdown';
import VuePhoneNumberInput from 'vue-phone-number-input'
import SingleDatePicker from './components/SingleDatePicker'
import vueDebounce from 'vue-debounce'
import MaskMoney from '@/utils/MaskMoney'
import VueNumeric from 'vue-numeric'
import BsTable from '@/components/BsTable'
import VueTheMask from 'vue-the-mask'
import vElementTableHeader from 'v-element-table-header'
import ButtonActionAuthenticated from '@/components/ButtonActionAuthenticated'

// import JoditVue from 'jodit-vue'
// import VueSocialSharing from 'vue-social-sharing'
import App from './App.vue'

// require styles
import 'vue-phone-number-input/dist/vue-phone-number-input.css'
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'
import 'bootstrap/dist/css/bootstrap.css';
import 'element-ui/lib/theme-chalk/index.css'
import '@/sass/main.scss'
// import 'v-element-table-header/lib/main.css'
// import 'jodit/build/jodit.min.css'

Vue.use(VueRouter)
Vue.use(ElementUI, { size: 'medium' })
Vue.use(VCharts)
Vue.use(money, {
    decimal: '.', 
    thousands: ','
  }
)
// Vue.use(Vddl)
const env = process.env.ENV_CONFIG
let keyMap = 'AIzaSyD_S6WI_JAcPJ4nhX48IKPzghkOM28zEVg'
if (env === 'prod' || env === 'dash') { keyMap = 'AIzaSyBIHZq9rBtwG9PFp575ZsPJebteE6T-nLA'}
if (env === 'dev' || env === 'sit') { keyMap = 'AIzaSyD_S6WI_JAcPJ4nhX48IKPzghkOM28zEVg'}
Vue.use(VueGoogleMaps, {
  load: {
    // this is the api key for production
    // key: 'AIzaSyBIHZq9rBtwG9PFp575ZsPJebteE6T-nLA',
    // dont forget to change use it again before commit/push
    // 
    // key: 'AIzaSyD_S6WI_JAcPJ4nhX48IKPzghkOM28zEVg',
    key: keyMap,
    libraries: 'places'
  },
  installComponents: true
})
Vue.use(PerfectScrollbar)
// Countdown Timer
Vue.use(VueCountdownTimer)
// Vue Countdown
Vue.component(VueCountdown.name, VueCountdown);
Vue.component('phone-number-input', VuePhoneNumberInput)
Vue.component('single-date-picker', SingleDatePicker)

//Vue debounce
Vue.use(vueDebounce, {
  listenTo: ['input', 'keyup'],
  defaultTime: '700ms'
})

// v-mask-money Directive
Vue.use(MaskMoney)
Vue.use(VueNumeric)
Vue.use(VueTheMask)

// Vue Social Sharing
// Vue.use(VueSocialSharing)

// Vue Jodit Wysiwyg
// Vue.use(JoditVue)
Vue.use(vElementTableHeader)

// end library import statements here

// custom prototype
Vue.prototype.$lang = langAddition
locale.use(langElUI)

// Import top level component
require('bootstrap')

// BS TABLE
Vue.component('bs-table', BsTable)

// Button Action Authenticated
Vue.component('button-action-authenticated', ButtonActionAuthenticated)

// Start out app!
// eslint-disable-next-line no-new
Vue.config.productionTip = false
if (process.env.NODE_ENV === 'development') {
  Vue.config.devtools = true
}

if (process.env.NODE_ENV !== 'development') {
  console.log = function() {}
}

// run sync localStorage function
syncLocalStorage()

if (process.env.ENV_CONFIG !== 'dev') {
  window.isUpdateAvailable = new Promise((resolve, reject) => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => {
          // console.log(reg)
          // setInterval(() => {
          //   reg.update()
          // }, 1 * 60 * 1000)
          reg.update()
          reg.onupdatefound = () => {
            const installingWorker = reg.installing
            installingWorker.onstatechange = () => {
              switch (installingWorker.state) {
                case 'installed':
                  if (navigator.serviceWorker.controller) {
                    // new update available
                    resolve(true)
                  } else {
                    // no update available
                    resolve(false)
                  }
                  break
              }
            }
          }
        })
        .catch(err => console.error('[SW ERROR]', err))
    }
  })
}

// inject function, check hidden features by plan type
import { isHiddenByFeature, isHiddenByFeatureName } from './utils/hiddenFeaturesByPlanType'
Vue.prototype.$isHiddenByPlanType = isHiddenByFeature
Vue.prototype.$isFeatureNameHiddenByPlanType = isHiddenByFeatureName

new Vue({
  el: '#app',
  data: {
    loc: window.loc 
  },
  langAddition,
  router,
  store,
  render: h => h(App)
})
