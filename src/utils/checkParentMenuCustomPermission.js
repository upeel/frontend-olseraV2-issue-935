import { checkCustomPermission } from "./checkCustomPermission"
import { mapMenus } from '@/data/mapMenus'

/**
 * jika semua module true berarti parent menu tetap muncul, otherwise, gak usah muncul
 * @param {*} moduleNames 
 * @param {*} accessType 
 */
const checkParentMenuCustomPermission = function(parentID, accessType) {
  const result = {
    visible: false,
    shown: []
  }
  result.visible = Object.keys(mapMenus[parentID]).some(item => {
    if (checkCustomPermission(item, accessType)) {
      result.shown.push(mapMenus[parentID][item])
    }
    return checkCustomPermission(item, accessType) === true
  })
  // console.log('checkParentMenuCustomPermission', result)
  return result
}

export {
  checkParentMenuCustomPermission
}
