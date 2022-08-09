import router from './routes'
import store from './store'
// import { fetchStore } from '@/api/store'
import NProgress from 'nprogress'
import { isHiddenByFeature, featureAccessByUrlIds } from './utils/hiddenFeaturesByPlanType'
const selectedStore = localStorage.getItem('olsbo_selectedstore') ? JSON.parse(localStorage.getItem('olsbo_selectedstore')) : null
NProgress.configure({ showSpinner: false })

const whiteList = [
  '/login',
  '/signup',
  '/whatsnew-mobile',
  '/attendance-mobile',
  '/webview-login',
  '/auth',
  '/scan',
  '/webview-unauthorized',
  '/reset-password'
] // no redirect whitelist

const webviewList = [
  '/reports-mobile',
  '/reports-mobile/products',
  '/reports-mobile/purchases',
  '/reports-mobile/sales',
  '/reports-mobile/shifts',
  '/reports-mobile/payments',
  '/reports-mobile/multioutlets',
  '/reports-mobile/attendance',
  '/reports-mobile/salestaxrole',
  '/attendance-mobile',
  '/webview-unauthorized'
]

const whiteListByRouteNames = [
  'Sign Up By Partner',
  'webview-downloading'
]

const premiumList = [
  '/freemium',
  '/reports/products',
  '/reports/sales',
  '/reports/payments',
  '/reports-mobile/products',
  '/reports-mobile/sales',
  '/reports-mobile/payments',
]

async function checkAsyncRouterMap(next, to, from) {
  if (!store.getters.addRouters.length) {
    await store.dispatch('customPermission/fetchRoles').then(response => {}).catch(() => {})
    store.dispatch('GenerateRoutes', store.getters.userRole).then(() => {
      router.addRoutes(store.getters.addRouters)
    })
  }
  handleRouteForAuthenticatedUser(next, to, from)
}

function handleDummyPage(executeMode) {
  if (executeMode) {
    document.getElementById('app').classList.add('dummy-page')
    store.dispatch('toggleUpgradeBanner', true)
  } else {
    document.getElementById('app').classList.remove('dummy-page')
    store.dispatch('toggleUpgradeBanner', false)
  }
}

function checkForceNoDummyPage(to) {
  const routesForceNoDummyPage = {
    is_onlineshop: ['/website', '/settings/shippings']
  }
  let show = false
  if (store.getters.selectedStore.is_onlineshop) {
    show = to.matched.some(matchedItem => {
      return routesForceNoDummyPage.is_onlineshop.includes(matchedItem.path)
    })
  }
  return show
}

function handleRouteForAuthenticatedUser(next, to, from) {
  if (to.path === '/login' || to.path === '/signup') {
    next('/dashboard')
  } else {
    if (store.getters.selectedStore) {
      if (
        (isHiddenByFeature(store.getters.selectedStore.plan_type_id, to.path) ||
        isHiddenByFeature(store.getters.selectedStore.plan_type_id, to.fullPath)) &&
        !(featureAccessByUrlIds[store.getters.selectedStore.url_id] && featureAccessByUrlIds[store.getters.selectedStore.url_id].includes(to.path))
      ) {
        if (!checkForceNoDummyPage(to)) {
          handleDummyPage(true)
          next()
        } else {
          handleDummyPage(false)
          next()
        }
      } else {
        handleDummyPage(false)
        next()
      }
    } else {
      handleDummyPage(false)
      next()
    }
  }
}

function handleCheckPremium(next, to) {
  if (store.state.user.token) {
    if (typeof to.meta.premium !== 'undefined' && !premiumList.includes(to.path)) {
      if (to.meta.premium && !store.state.isFreemium) {
        return false
      } else {
        if (store.getters.selectedStore.is_onlineshop === 1) {
          return false
        } else {
          if (to.meta.freemiumRedirect) {
            // next(to.meta.freemiumRedirect)
            return true
          } else {
            // next('/freemium')
            return true
          }
        }
      }
    } else {
      return false
    }
  } else {
    return false
  }
}

// eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImNjZjg3ZmJhNjMwYjM3N2U1N2ZiN2VkOTk4MmMzZmFkOGRiZjQ5NzFkYWY2YWQ1YWNiMTg2YmI4ZWZmODNjZjQ2ODNmNTJkNGU2ZGEyZTgwIn0.eyJhdWQiOiIyIiwianRpIjoiY2NmODdmYmE2MzBiMzc3ZTU3ZmI3ZWQ5OTgyYzNmYWQ4ZGJmNDk3MWRhZjZhZDVhY2IxODZiYjhlZmY4M2NmNDY4M2Y1MmQ0ZTZkYTJlODAiLCJpYXQiOjE2MDczOTU0ODAsIm5iZiI6MTYwNzM5NTQ4MCwiZXhwIjoxNjA5OTg3NDc5LCJzdWIiOiI3MjM2Iiwic2NvcGVzIjpbXX0.aU08NavpDVA4Y9goYjLS0ufl3Ay716GgQUqV_mCTy44O5R9rEy7zdE - xRPTlEKD6oVYTZ5MbQbmzIZPnF0bBOPxNUI2hYFYjFsONQ_9VLceH_LYCBK35iXmZJlC1n7UkJIf4jCV7gQmD1Mth - 8Zgq1cTVDHYlPHFzj6RyPVb8a_Ikx1XVJz1olAfPbCDUZ - ejhTQGNaz7zVN9B_DONw831lPDFjxpcs9Yi9nBVD_qcz6HiYA7jj7XRmWgtRI66YYAZA8VjvZP9buYqv - 7HO0kUY2hb6r0ymNV2JbAHdUIbPWgaL0XXX8SXpLXZp86CsC2U - gpCVhMI7daqFVmAxmap - 8W74qgv8PWRC05HE16j_je93QKPNRuwQ947dg4dzEjGgbgL2YYHQyRKHfHP8H9OAkXQiJFffHAwhLd2nwfXfR3g_jh7HFCrMaucJ_OCawQF0mh4 - vj0GGpYfFdreyuqmY25zG8JbvXwM - RdxmnIJVptwM4Ni0y78DklV1JR6mU6NBv2sRybCXJUqkE26mYwir9wx - ZJ6u475VIToRRcD9UZbwJsFjqVAQ9TeDN4ezhgvVi9 - UyoTv7M8dISjdVDzEMgFvgScQ36cGyHTMgU1U1ExW_ZNae5g6mLLMiFYjZ7azN2MsR2UPMdfgZWI4Vpu7aZ2kUNtD61QjkmHdx0w
// 11062

router.beforeEach((to, from, next) => {
  NProgress.start()
  // handle redirect from signup landing page
  // console.log(to.path, to.query.access_token)
  if (to.query.access_token && to.query.store_id) {
    const withoutReloadPage = true
    store.dispatch('logout', withoutReloadPage) // make sure no any other localstorage left
    store.dispatch('setTokenFromRegister', {
      access_token: to.query.access_token
    })
    store.dispatch('fetchUserLoggedin').then(() => {
      store.dispatch('setStores').then(() => {
        //
      }).catch(() => {
        store.dispatch('logout', withoutReloadPage)
        next('/login')
      })
      store.dispatch('setSelectedStore', to.query.store_id).then(() => {
        
        if (to.query.new_user === '1') {
          console.log(to.query.new_user)
          store.dispatch('setNewUser', true)
        }
        next('/')
      }).catch(() => {
        store.dispatch('logout', withoutReloadPage)
        next('/login')
      })
    }).catch(() => {
      store.dispatch('logout', withoutReloadPage)
      next('/login')
    })
  } else {
    // console.log(to, !webviewList.includes(to.path), store.state.user.token)
    // console.log('trace', handleCheckPremium(next, to))
    if (handleCheckPremium(next, to)) {
      if (to.meta.freemiumRedirect) {
        next(to.meta.freemiumRedirect)
      } else {
        next('/freemium')
      }
    } else {
      if (store.state.user.token && !webviewList.includes(to.path) && !whiteList.includes(to.path) && !whiteListByRouteNames.includes(to.name)) {
        if (!store.state.user.loggedInUser) { // handle refresh
          store.dispatch('fetchUserLoggedin').catch(() => {
            next('/login')
          })
        }
        // console.log('trace', store.state.userWithNoStore)
        if (!store.state.userStores.stores.length && !store.state.userWithNoStore) { // handle refresh
          store.dispatch('setStores').then(() => {
            if (!selectedStore) {
              next('/selectstore')
            } else {
              checkAsyncRouterMap(next, to, from)
            }
          }).catch(() => {
            next('/selectstore')
          })
        } else {
          checkAsyncRouterMap(next, to, from)
        }
      } else if (webviewList.includes(to.path)) {
        next()
      } else {
        if (
          whiteList.indexOf(to.path) !== -1 ||
          whiteListByRouteNames.indexOf(to.name) !== -1
        ) {
          next()
        } else {
          next('/login')
        }
      }
    }
  }
  // NProgress.start()
})

router.afterEach(() => {
  NProgress.done()
})
