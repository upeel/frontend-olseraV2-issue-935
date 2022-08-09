import { service } from '@/http-common'

export function fetchProductBukalapak(params) {
  return service({
    url: '/bukalapak/product',
    params
  })
}

export function getOrderBukalapak(params) {
  return service({
    url: '/bukalapak/order',
    params
  })
}

export function getBukalapakStore(params) {
  return service({
    url: '/bukalapak/store',
    params
  })
}

export function detailOrderBukalapak(params) {
  return service({
    url: '/bukalapak/order/detail',
    params
  })
}

export function getBulkProductBukalapak(params) {
  return service({
    url: '/bukalapak/product/recomendation',
    params
  })
}

export function fetchCategoryBukalapak(params) {
  return service({
    url: '/bukalapak/category',
    params
  })
}

export function setSameStockWithOlsera(data) {
  return service({
    url: '/bukalapak/store/setting-stock',
    method: 'POST',
    data
  })
}

export function saveOrderBukalapak(data){
  return service({
    url: '/bukalapak/order/saveorder',
    method: 'POST',
    data
  })
}

export function syncProductBukalapak() {
  return service({
    url: '/bukalapak/product/sync',
    method: 'GET'
  })
}

export function getLogsBukalapak(params) {
  return service({
    url: '/bukalapak/log-activities',
    method: 'GET',
    params
  })
}

export function statusOrderBukalapak(data){
  return service({
    url: '/bukalapak/order/status/update',
    method: 'POST',
    data
  })
}

export function pairProductBukalapak(data) {
  return service({
    url: '/bukalapak/product/pair',
    method: 'POST',
    data
  })
}

export function searchProduct(params) {
  return service({
    url: '/bukalapak/product/search',
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

export function getAuthLink(data) {
  return service({
    url: '/bukalapak/auth/link?',
    method: 'POST',
    data
  })
}

export function authorizationBukalapak(data) {
  return service({
    url: '/bukalapak/auth',
    method: 'POST',
    data
  })
}

export function updateSingleProductBukalapak(data) {
  return service({
    url: '/bukalapak/product/conflic-stock/singel',
    method: 'POST',
    data
  })
}

// export function syncProductLazada() {
//   return service({
//     url: '/lazada/product/sync'
//   })
// }

export function getdetailOrderBukalapak(params) {
  return service({
    url: 'bukalapak/order/detail',
    params
  })
}

export function pairBulkProduct(data) {
  return service({
    url: '/bukalapak/product/bulk-pair',
    method: 'POST',
    data
  })
}

export function fetchDataDuplicate(params) {
  return service({
    url: '/bukalapak/product/duplicate-candidate',
    method: 'GET',
    params
  })
}

export function fetchRequiredForm(params, id) {
  return service({
    url: '/bukalapak/category/' + id + '/attributes',
    method: 'GET',
    params
  })
}

export function fetchBrandBukalapak(params) {
  return service({
    url: '/bukalapak/brand',
    method: 'GET',
    params
  })
}

export function savePreUpload(data) {
  return service({
    url: '/bukalapak/product-pre-upload/store',
    method: 'POST',
    data
  })
}

export function updatePreUpload(data) {
  return service({
    url: '/bukalapak/product-pre-upload/' + data.product_id + '/update',
    method: 'PUT',
    data
  })
}

export function saveDuplicateProduct(data) {
  return service({
    url: '/bukalapak/product/store',
    method: 'POST',
    data
  })
}

export function saveBulkStore(data) {
  return service({
    url: '/bukalapak/product/bulk-store',
    method: 'POST',
    data
  })
}