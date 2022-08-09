import { checkCustomPermission as funCheckCustomPermission } from "../utils/checkCustomPermission"
import { checkParentMenuCustomPermission as funCheckParentMenuCustomPermission } from "../utils/checkParentMenuCustomPermission"

const checkCustomPermission = {
  methods: {
    checkCustomPermission(moduleName, accessType) {
      return funCheckCustomPermission(moduleName, accessType)
    },
    /**
     * jika semua module true berarti parent menu tetap muncul, otherwise, gak usah muncul
     * @param {*} moduleNames 
     * @param {*} accessType 
     */
    checkParentMenuCustomPermission(moduleNames, accessType) {
      return funCheckParentMenuCustomPermission(moduleNames, accessType)
    },
    /**
     * global function for handle redirection unauthorized page
     * @param {*} moduleName 
     * @param {*} accessType 
     * @param {*} redirectUrl 
     */
     handleCustomPermissionSinglePage(moduleName, accessType = 'show', redirectUrl = '/not-found') {
      if (!this.checkCustomPermission(moduleName, accessType)) {
        this.$router.push(redirectUrl)
      }
    }
  }
}

export {
  checkCustomPermission
}
