import { service } from '@/http-common'

export function fetchAll(params) {
  return service({
    url: '/grabfood',
    params
  })
}

// export function fetchByStore(storeId, params) {
//   return service({
//     url: '/grabfood/' + storeId,
//     params
//   })
// }

export function fetchByStore(params) {
  return service({
    url: '/grabfood-store',
    params
  })
}

export function fetchAllMenu(params) {
  return service({
    url: '/grabfood-menu',
    params
  })
}

export function fetchMenuGrab(params) {
  return service({
    url: '/grabfood-menu/'+params,
    
  })
}

export function fetchAllMenuByStore(params) {
  return service({
    url: '/grabfood-menu-bystore',
    params
  })
}

export function fetchAllGroup(params) {
  return service({
    url: '/grabfood-menu-group',
    params
  })
}

export function fetchAllGroupByStore(params) {
  return service({
    url: '/grabfood-menu-group-bystore',
    params
  })
}

export function fetchSingle(id, params) {
  return service({
    url: '/grabfood/' + id,
    params
  })
}

export function create(data) {
  return service({
    url: '/grabfood',
    method: 'POST',
    data
  })
}

export function createItemSetupMenu(data) {
  return service({
    url: '/grabfood-save-menu-item',
    method: 'POST',
    data
  })
}

export function createGroup(data) {
  return service({
    url: '/grabfood-new-group',
    method: 'POST',
    data
  })
}

export function createMenu(data) {
  return service({
    url: '/grabfood-new-menu',
    method: 'POST',
    data
  })
}

export function createTime(data) {
  return service({
    url: '/grabfood-new-time',
    method: 'POST',
    data
  })
}

export function createSpecificTime(data) {
  return service({
    url: '/grabfood-new-menu-spctime',
    method: 'POST',
    data
  })
}

export function update(data) {
  return service({
    url: '/grabfood/' + data.id,
    method: 'PUT',
    data
  })
}

export function updateMenuGroup(data) {
  return service({
    url: '/grabfood-upt-group/' + data.id,
    method: 'PUT',
    data
  })
}

export function updateMenuBatch(data) {
  return service({
    url: '/grabfood-upt-menu',
    method: 'PUT',
    data
  })
}

export function updateMenuCategory(data) {
  return service({
    url: '/grabfood-upt-category/' + data.category_id,
    method: 'PUT',
    data
  })
}

export function destroyTime(id) {
  return service({
    url: '/grabfood-rm-time/' + id,
    method: 'DELETE'
  })
}

export function destroyDay(id) {
  return service({
    url: '/grabfood-rm-day/' + id,
    method: 'DELETE'
  })
}

export function destroyMenu(data) {
  return service({
    url: '/grabfood-rm-menu/' + data.id,
    method: 'DELETE',
    data
  })
}

export function destroyGroup(data) {
  return service({
    url: '/grabfood-rm-group/' + data.id,
    method: 'DELETE',
    data
  })
}

export function destroyCategory(data) {
  return service({
    url: '/grabfood-rm-category/' + data.id,
    method: 'DELETE',
    data
  })
}

export function savePartial(data) {
  return service({
    url: '/grabfood-save-partial',
    method: 'POST',
    data
  })
}

export function saveMenuItem(data) {
  return service({
    url: '/grabfood-save-menu-item',
    method: 'POST',
    data
  })
}

export function fetchGrabfoodCategory(params) {
  return service({
    url: '/grabfood-categories',
    params
  })
}

export function fetchGrabfoodProducts(params) {
  return service({
    url: '/grabfood-products',
    params
  })
}

export function saveMenuCategory(data) {
  return service({
    url: '/grabfood-save-categories',
    method: 'POST',
    data
  })
}

export function updateTimeSection(data) {
  return service({
    url: '/grabfood-upt-time',
    method: 'PUT',
    data
  })
}

export function createSection(data) {
  return service({
    url: '/grabfood-save-sectiontime',
    method: 'POST',
    data
  })
}

export function fecthAddonGroup() {
  let params = {
    sort_type: 'asc',
    sort_column: 'view_sort'
  }
  return service({
    url: '/grabfood-addon-bystore',
    method: 'GET',
    params
  })
}

export function createAddonGroup(data) {
  return service({
    url: '/grabfood-addon',
    method: 'POST',
    data
  })
}

export function saveAddonGroup(data) {
  return service({
    url: '/grabfood-upt-addon/' + data.id,
    method: 'PUT',
    data
  })
}

export function deleteAddonGroup(data) {
  return service({
    url: '/grabfood-addon/' + data.id,
    method: 'DELETE',
    data
  })
}

export function fecthAddonItems(params) {
  return service({
    url: '/grabfood-origin-addon',
    method: 'GET',
    params
  })
}

export function createAddonItem(data) {
  return service({
    url: '/grabfood-addon-item',
    method: 'POST',
    data
  })
}

export function saveAddonItem(data) {
  return service({
    url: '/grabfood-upt-addon-item/' + data.id,
    method: 'PUT',
    data
  })
}

export function deleteAddonItem(data) {
  return service({
    url: '/grabfood-addon-item/' + data.id,
    method: 'DELETE',
    data
  })
}

export function updateGrab(data) {
  return service({
    url: 'grabfood-req-update',
    method: 'POST',
    data
  })
}

export function getUpdateLogs(params) {
  return service({
    url: 'grabfood-logs',
    method: 'GET',
    params
  })
}

export function sortAddonGroup(data) {
  return service({
    url: 'grabfood-addon-sort',
    method: 'POST',
    data
  })
}

export function sortAddonItem(data) {
  return service({
    url: 'grabfood-addon-item-sort',
    method: 'POST',
    data
  })
}

export function sortCategory(data) {
  return service({
    url: 'grabfood-categories-sort',
    method: 'POST',
    data
  })
}

export function sortMenu(data) {
  return service({
    url: 'grabfood-menu-sort',
    method: 'POST',
    data
  })
}

export function getGrabPeriod(params) {
  return service({
    url: 'grabfood-period',
    params
  })
}

export function getGrabPeriodStore(params) {
  return service({
    url: 'grabfood-period-bystore',
    params
  })
}

export function getGrabCampaign(params) {
  return service({
    url: 'grabfood-campaign-bystore',
    params
  })
}

export function createGrabCampaign(data) {
  return service({
    url: 'grabfood-save-campaign',
    method: 'POST',
    data
  })
}

export function updateCampaign(data) {
  return service({
    url: 'grabfood-upt-campaign/' + data.id,
    method: 'PUT',
    data
  })
}

export function updatePeriods(data) {
  return service({
    url: 'grabfood-upt-period',
    method: 'PUT',
    data
  })
}

export function deletePeriod(data) {
  return service({
    url: '/grabfood-rm-period/' + data.id,
    method: 'DELETE',
    data
  })
}

export function temporarilyClosed(data) {
  return service({
    url: '/grabfood-upt-pause/',
    method: 'PUT',
    data
  })
}

export function getListDataGrabfood(params) {
  return service({
    url: '/grabfood-min-menu-bystore/',
    method: 'GET',
    params
  })
}

export function createPeriodGrab(data) {
  return service({
    url: '/grabfood-save-period/',
    method: 'POST',
    data
  })
}

export function deleteCampaignGrab(id) {
  return service({
    url: '/grabfood-rm-campaign/' + id,
    method: 'DELETE'
  })
}
