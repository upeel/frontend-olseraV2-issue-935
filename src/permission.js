import router from './routes'
import store from './store'

if (process.env.ENV_CONFIG === 'prod') {
  const whiteList = [
    '/login',
    '/signup',
    '/reports-mobile/',
    '/reports-mobile/products',
    '/reports-mobile/payments',
    '/reports-mobile/purchases',
    '/reports-mobile/sales',
    '/reports-mobile/shifts',
    '/reports-mobile/multioutlets',
    '/reports-mobile/freemium',
    '/reports-mobile/download/api',
    '/whatsnew-mobile',
    '/attendance-mobile',
    '/webview-login',
    '/auth'
  ] // no redirect whitelist
  
  const whiteListByRouteNames = [
    'Sign Up By Partner'
  ]
  
  router.beforeEach((to, from, next) => {
    if (store.state.token) {
      if (
        typeof to.meta.premium !== 'undefined' &&
        to.path !== '/freemium' 
        && to.path !== '/reports/products' 
        && to.path !== '/reports/sales' 
        && to.path !== '/reports/payments'
        && to.path !== '/reports-mobile/products'
        && to.path !== '/reports-mobile/sales'
        && to.path !== '/reports-mobile/payments'
      ) {
          if (to.meta.premium && !store.state.isFreemium) {
            next()
          } else {
            if (store.getters.selectedStore.is_onlineshop === 1) {
              next()
            } else {
              if (to.meta.freemiumRedirect) {
                next(to.meta.freemiumRedirect)
              } else {
                next('/freemium')
              }
            }
          }
        } else {
          next()
        }
    } else {
      store.commit('REMOVE_TOKEN')
      store.commit('REMOVE_SELECTED_STORE')
      if (whiteList.indexOf(to.path) !== -1 || whiteListByRouteNames.indexOf(to.name) !== -1) {
        next()
      } else {
        next('/login')
      }
    }
  })
}
