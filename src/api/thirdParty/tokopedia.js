import { service } from '@/http-common'
import store from '@/store'
// let tokopediaId = store.state.tokopediaActiveStore.id

export function integrateMerchant(data) {
  return service({
    url: '/tokopedia/integration/merchant',
    method: 'POST',
    data
  })
}

export function fetchProductTokopedia(params) {
  return service({
    url: '/tokopedia/product',
    params
  })
}

export function syncProductTokopedia(params) {
  return service({
    url: '/tokopedia/product/download',
    params
  })
}

export function fetchCaseTokopedia(params) {
  return service({
    url: '/tokopedia/showcase',
    params
  })
}

export function searchProduct(params) {
  return service({
    url: '/tokopedia/product/search',
    params
  })
}

export function pairProductTokopedia(data) {
  return service({
    url: '/tokopedia/product/pair',
    method: 'POST',
    data
  })
}

export function changeStatusProduct(data) {
  return service({
    url: '/tokopedia/product/status',
    method: 'POST',
    data
  })
}

export function setSameStockWithOlsera(data) {
  return service({
    url: '/tokopedia/product/setting/stock',
    method: 'POST',
    data
  })
}

export function updateStockProductTokopedia(params) {
  return service({
    url: '/tokopedia/product/update/stock',
    method: 'POST',
    params
  })
}

export function updateSingleProductTokopedia(data) {
  return service({
    url: '/tokopedia/product/update/stock/single-product',
    method: 'POST',
    data
  })
}

export function getBulkProduct(params) {
  return service({
    url: '/tokopedia/product/pair/bulk-product',
    params
  })
}

export function pairBulkProduct(data) {
  return service({
    url: '/tokopedia/product/pair/bulk-product',
    method: 'POST',
    data
  })
}

export function getOrderTokopedia(params) {
  return service({
    url: '/tokopedia/sales/order',
    params
  })
}

export function getdetailOrderTokopedia(id) {
  return service({
    url: '/tokopedia/sales/order/detail',
    params: {
      order_no_tokopedia: id
    }
  })
}

export function saveSalesTokopedia(data) {
  return service({
    url: '/tokopedia/sales/order/save',
    method: 'POST',
    data
  })
}

export function getCountOrderTokopedia(params) {
  return service({
    url: '/tokopedia/sales/order/notification',
    params
  })
}

export function getTokopediaStore(params) {
  return service({
    url: '/tokopedia/product/merchant',
    params
  })
}

export function getLogs(params) {
  return service({
    url: '/tokopedia/log/activities',
    params
  })
}

export function updateStatusOrder(data) {
  return service({
    url: '/tokopedia/sales/status-order/update',
    method: 'POST',
    data
  })
}

export function syncOrderTokopedia(params) {
  return service({
    url: '/tokopedia/sales/order/sync',
    params
  })
}

export function updateStatusOrderTokopedia(data) {
  return service({
    url: '/tokopedia/sales/order/status',
    method: 'POST',
    data
  })
}

export function CancelOrderTokopedia(data) {
  return service({
    url: '/tokopedia/sales/order/reject',
    method: 'POST',
    data
  })
}

export function RejectReasonTokopedia() {
  return service({
    url: '/tokopedia/sales/order/reject/reason-code',
    method: 'GET'
  })
}

export function fetchDataDuplicate(params) {
  return service({
    url: '/tokopedia/product/duplicate-candidate',
    method: 'GET',
    params
  })
}

export function deleteIntegrationMerchant(data) {
  return service({
    url: '/tokopedia/integration/merchant',
    method: 'DELETE',
    data
  })
}

export function fetchCategoryTokopedia(params) {
  return service({
    url: '/tokopedia/category',
    params
  })
}

export function preUploadProduct(data) {
  return service({
    url: '/tokopedia/product-pre-upload/store',
    method: 'POST',
    data
  })
}

export function updatePreUploadProduct(data) {
  return service({
    url: '/tokopedia/product-pre-upload/update',
    method: 'POST',
    data
  })
}

export function duplicateSingleProduct(data) {
  return service({
    url: '/tokopedia/product/store',
    method: 'POST',
    data
  })
}

export function getVariantTokopedia(params) {
  return service({
    url: '/tokopedia/category/variant',
    params
  })
}

export function getBrandTokopedia(params) {
  return service({
    url: '/tokopedia/category/brand',
    params
  })
}

export function duplicateBulkProduct(data) {
  return service({
    url: '/tokopedia/product/bulk-store',
    method: 'POST',
    data
  })
}

export function getPrintLabelOrderTokopedia(params) {
  return service({
    url: '/tokopedia/sales/order/print-label',
    method: 'GET',
    params
  })
}

export function fetchListCategoryMapOlseraTokopedia(params) {
  return service({
    url: '/tokopedia/category/pair-list',
    method: 'GET',
    params
  })
}

export function pairCategoryTokopedia(data) {
  return service({
    url: '/tokopedia/category/pairing',
    method: 'POST',
    data
  })
}

export function getMerchantTokopedia(params) {
  return service({
    url: '/tokopedia/integration/list/merchant',
    method: 'GET',
    params
  })
}

export function syncMerchantTokopedia() {
  return service({
    url: '/tokopedia/integration/merchant/sync',
    method: 'GET'
  })
}

export function unpairProductTokopedia(data) {
  return service({
    url: '/tokopedia/product/unpair',
    method: 'POST',
    data
  })
}