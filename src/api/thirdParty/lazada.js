import { service } from '@/http-common'

export function fetchProductLazada(params) {
  return service({
    url: '/lazada/product',
    params
  })
}

export function getOrderLazada(params) {
  return service({
    url: '/lazada/order',
    params
  })
}

export function getLazadaStore(params) {
  return service({
    url: '/lazada/product/seller',
    params
  })
}

export function detailOrderLazada(params) {
  return service({
    url: '/lazada/order/detail',
    params
  })
}

export function getBulkProductLazada(params) {
  return service({
    url: '/lazada/product/recomendation',
    params
  })
}

export function fetchCategoryLazada(params) {
  return service({
    url: '/lazada/category',
    params
  })
}

export function setSameStockWithOlsera(data) {
  return service({
    url: '/lazada/product/setting-stock',
    method: 'POST',
    data
  })
}

export function saveOrderLazada(data){
  return service({
    url: '/lazada/order/saveorder',
    method: 'POST',
    data
  })
}

export function syncProductLazada() {
  return service({
    url: '/lazada/product/sync',
    method: 'GET'
  })
}

export function getLogsLazada(params) {
  return service({
    url: '/lazada/log-activities',
    method: 'GET',
    params
  })
}

export function statusOrderLazada(data){
  return service({
    url: '/lazada/order/status/update',
    method: 'POST',
    data
  })
}

export function pairProductLazada(data) {
  return service({
    url: '/lazada/product/pairing',
    method: 'POST',
    data
  })
}

export function searchProduct(params) {
  return service({
    url: '/lazada/product/search',
    method: 'GET',
    params
  })
}

// export function pairProductLazada(params) {
//   return service({
//     url: '/lazada/product/pairing',
//     method: 'POST',
//     params
//   })
// }

export function getAuthLink() {
  return service({
    url: '/lazada/auth/link?',
    method: 'GET'
  })
}

export function authorizationLazada(data) {
  return service({
    url: '/lazada/auth',
    method: 'POST',
    data
  })
}

export function updateSingleProductLazada(data) {
  return service({
    url: '/lazada/product/stock-conflict/1',
    method: 'POST',
    data
  })
}

// export function syncProductLazada() {
//   return service({
//     url: '/lazada/product/sync'
//   })
// }

export function getdetailOrderLazada(params) {
  return service({
    url: 'lazada/order/detail',
    params
  })
}

export function pairBulkProduct(data) {
  return service({
    url: '/lazada/product/bulk-pairing',
    method: 'POST',
    data
  })
}

export function fetchDataDuplicate(params) {
  return service({
    url: '/lazada/product/duplicate-candidate',
    method: 'GET',
    params
  })
}

export function fetchRequiredForm(params) {
  return service({
    url: '/lazada/category/attributes',
    method: 'GET',
    params
  })
}

export function fetchBrandLazada(params) {
  return service({
    url: '/lazada/brand',
    method: 'GET',
    params
  })
}

export function savePreUpload(data) {
  return service({
    url: '/lazada/product-pre-upload/store',
    method: 'POST',
    data
  })
}

export function updatePreUpload(data) {
  return service({
    url: '/lazada/product-pre-upload/' + data.product_id + '/update',
    method: 'PUT',
    data
  })
}

export function saveDuplicateProduct(data) {
  return service({
    url: '/lazada/product/store',
    method: 'POST',
    data
  })
}

export function saveBulkStore(data) {
  return service({
    url: '/lazada/product/bulk-store',
    method: 'POST',
    data
  })
}