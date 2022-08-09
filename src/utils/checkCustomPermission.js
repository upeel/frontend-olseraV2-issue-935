import store from '@/store'

const checkCustomPermission = function(moduleName, accessType) {
  /**
   * moduleName: ambil dari attr id
   * accessType: index, create, update, dst...
   */
  const ACCESS_TYPES = ['index', 'show', 'edit', 'store', 'destroy']
  if (!ACCESS_TYPES.includes(accessType)) {
    // console.error('accessType not in the list')
    return true
  }
  // get current role from vuex store
  const currentRole = store.getters.userRole ? store.getters.userRole.role_id : null
  if (currentRole === 'OW') {
    return true
  }
  // get permissions list from api endpoint https://api.backoffice.olsera.indociti.com/api/ruditoko2/admin/v1/id/permission/list
  const permissions = store.getters['customPermission/roles']
  if (currentRole && permissions && permissions.length) {
    const arrToBeChecked = moduleName.split('/')
    const toBeChecked = arrToBeChecked[arrToBeChecked.length - 1]
    if (arrToBeChecked.length <= 1) { // module bukan submodule
      return permissions[0].detail.some(item => {
        return item.id === toBeChecked && item.access.includes(accessType)
      })
    } else if (arrToBeChecked.length > 1) { // module adalah submodule
      const sourceToBeChecked = permissions[0].detail.find(item => {
        return item.id === arrToBeChecked[0]
      })
      if (sourceToBeChecked) {
        return sourceToBeChecked.menus.some(item => {
          return item.id === toBeChecked && item.access.includes(accessType)
        })
      } else {
        return false
      }
    }
  } else {
    return false
  }
}

export {
  checkCustomPermission
}
