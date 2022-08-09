import { service } from '@/http-common'

export function authorizationShopee(params) {
  return service({
    url: '/shopee/authorization/authorization-url',
    params
  })
}

export function deauthorizationShopee(params) {
  return service({
    url: '/shopee/authorization/deauthorization-url',
    params
  })
}

export function fetchProductShopee(params) {
  return service({
    url: '/shopee/item/list',
    method: 'GET',
    params
  })
}

export function getShopeeStore(params) {
  return service({
    url: '/shopee/shop/info',
    method: 'GET',
    params
  })
}

export function getShopeeStoreList() {
  return service({
    url: '/shopee/shop/lists',
    method: 'GET'
  })
}

export function searchProduct(params) {
  return service({
    // url: '/shopee/olsera-item/list',
    url: '/shopeeOlseraItem/lists',
    method: 'GET',
    params
  })
}

export function searchProductShopee(params) {
  return service({
    url: '/shopeeOlseraItem/lists',
    params
  })
}

export function pairProductShopee(data) {
  return service({
    url: '/shopee/item/connect',
    method: 'POST',
    data
  })
}

export function unpairProductShopee(data) {
  return service({
    url: '/shopee/item/disconnect',
    method: 'DELETE',
    data
  })
}

export function fetchRequiredForm(params, id) {
  return service({
    url: '/shopee/item-category/attribute/' + id,
    method: 'GET',
    params,
    version: 'v2'
  })
}

export function saveDuplicateProduct(params, data) {
  return service({
    url: '/shopee/duplicate-product/push',
    method: 'POST',
    params,
    data,
    version: 'v2'
  })
}

export function saveDuplicateMulti(params, data) {
  return service({
    url: '/shopee/duplicate-product/multi-push',
    method: 'POST',
    params,
    data,
    version: 'v2'
  })
}

export function getBulkProduct(params) {
  return service({
    url: '/shopee/item/bulk-pair',
    params
  })
}

export function pairBulkProduct(data) {
  return service({
    url: '/shopee/item/connect-batch',
    method: 'POST',
    data
  })
}

export function getOrderShopee(params) {
  return service({
    url: '/shopee/order/list',
    params
  })
}

export function updateSingleProductShopee(data) {
  return service({
    url: '/shopee/item/update/stock/single-product',
    method: 'POST',
    data
  })
}

export function fetchListCategoryMapOlseraShopee(params) {
  return service({
    url: '/shopee/mapping-category/list',
    method: 'GET',
    params
  })
}

export function fetchListCategoryShopee(params) {
  return service({
    url: '/shopee/item-category',
    method: 'GET',
    params
  })
}

export function pairCategoryMulti(data) {
  return service({
    url: '/shopee/mapping-category/multi-pairing',
    method: 'POST',
    data
  })
}

export function unpairCategory(data) {
  return service({
    url: '/shopee/mapping-category/unpairing',
    method: 'POST',
    data
  })
}

export function setSameStockWithOlsera(data) {
  return service({
    url: '/shopee/shop/equalize-stock',
    method: 'PUT',
    data
  })
}

export function saveOrderShopee(data) {
  return service({
    url: '/shopee/order/save',
    method: 'POST',
    data,
    version: 'v2'
  })
}

export function syncProductShopee(params) {
  return service({
    url: '/shopee/item/sync',
    method: 'POST',
    params
  })
}

export function getProgressSyncProductShopee(params) {
  return service({
    url: '/shopeeProduct/getSyncProgress',
    params
  })
}

export function stopSynProductShopee(params) {
  return service({
    url: '/shopeeProduct/sendStopSignal',
    params
  })
}

export function fetchDataDuplicate(params) {
  return service({
    url: '/shopee/duplicate-product',
    method: 'GET',
    params,
    version: 'v2'
  })
}

export function fetchDataSingleDuplicate(id, params) {
  return service({
    url: '/shopee/duplicate-product/show/' + id,
    method: 'GET',
    params
  })
}

export function updatePreUpload(data) {
  return service({
    url: '/shopee/duplicate-product/upload-photo',
    method: 'POST',
    data
  })
}

export function getLogsShopee() {
  return service({
    url: '/shopee/log/lists',
    method: 'GET'
  })
}

export function getDetailOrderShopee(dataid) {
  return service({
    url: '/shopee/order/detail',
    params: {
      id: dataid
    }
  })
}

export function resolveStockConflict(params) {
  return service({
    url: '/shopee/item/resolve-stock-batch',
    method: 'POST',
    params
  })
}

export function recomendationShopee(params, id) {
  return service({
    url: '/shopee/item-category/',
    method: 'GET',
    params
  })
}

export function getListBrandShopee(params) {
  return service({
    url: '/shopee/brand/list',
    params,
    version: 'v2'
  })
}

export function syncProductShopeeByStore(params, cancelToken) {
  return service({
    url: '/shopee/item/sync',
    method: 'POST',
    params,
    cancelToken
  })
}

export function syncOrderShopeeByStore(params, cancelToken) {
  return service({
    url: '/shopeeSyncOrder/sync',
    method: 'POST',
    params,
    cancelToken
  })
}

export function getLogistic(params) {
  return service({
    url: '/shopee/logistic/get-logistics-item',
    method: 'GET',
    params,
    version: 'v2'
  })
}

export function getAddressWithPickupTime(params){
  return service({
    url: '/shopee2/logistic/get-address-with-time',
    method: 'GET',
    params
  })
}

export function getListShopeeStore(params) {
  return service({
    url: '/listShopeeStore/lists',
    params
  })
}

export function acceptOrderCancellation(data){
  return service({
    url: '/shopee/order/cancel/accept',
    method: 'POST',
    data,
    version: 'v2'
  })
}

export function rejectOrderCancellation(data){
  return service({
    url: '/shopee/order/cancel/reject',
    method: 'POST',
    data,
    version: 'v2'
  })
}

export function getParameterInitLogistic(data){
  return service({
    url: '/shopee2/logistic/get-parameter-init',
    method: 'POST',
    data
  })
}

export function initLogistic(data){
  return service({
    url: '/shopee2/logistic/init',
    method: 'POST',
    data
  })
}

export function printLabel(data){
  return service({
    url: '/shopee2/logistic/airway-bill',
    method: 'POST',
    data,
    responseType: 'blob'
  })
}