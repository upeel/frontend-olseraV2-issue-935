const getters = {
  token: state => state.user.token,
  lang: state => state.userStores.lang,
  langId: state => state.userStores.langId,
  loggedInUser: state => !state.webview.webviewMode ? state.user.loggedInUser : state.webview.loggedInUser,
  stores: state => state.userStores.stores,
  storesMeta: state => state.userStores.meta,
  selected_store: state => state.userStores.selectedStore,
  selectedStore: state => state.userStores.selectedStore,
  userRole: state => state.userStores.userRole,
  generalSetting: state => state.generalSetting,
  visibleSmartFinder: state => state.visibleSmartFinder,
  addRouters: state => state.routesByPermission.addRouters,
  /**
   * WEBVIEW
   */
  webviewMode: state => state.webview.webviewMode,
  webviewToken: state => state.webview.token,
  webviewSelectedStore: state => state.webview.selectedStore
}
export default getters
