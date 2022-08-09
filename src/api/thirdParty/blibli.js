import { service } from '@/http-common'
import qs from 'qs'

export function fetchIntegration(params) {
  return service({
    url: '/blibli/integration/merchant',
    method: 'get',
    params
  })
}

export function postIntegration(params) {
  const conf = {
    url: '/blibli/integration/merchant',
    method: 'post',
    params
  }
  conf.paramsSerializer = (params) => {
    return qs.stringify(params)
  }
  return service(conf)
}

export function fetchProducts(params) {
  return service({
    url: '/blibli/product',
    method: 'get',
    params
  })
}

export function fetchSalesOrders(params) {
  return service({
    url: '/blibli/sales/order',
    method: 'get',
    params
  })
}

export function fetchSalesOrderDetail(params) {
  return service({
    url: '/blibli/sales/order/detail',
    method: 'get',
    params
  })
}

export function productOlseraSearch(params) {
  return service({
    url: '/blibli/product/search',
    method: 'get',
    params
  })
}

export function saveSalesOrder(data) {
  return service({
    url: '/blibli/sales/order/save',
    method: 'post',
    data
  })
}

export function saveStatusSalesOrder(data) {
  return service({
    url: '/blibli/sales/order/status-order/update',
    method: 'post',
    data
  })
}

export function pairProduct(data) {
  return service({
    url: '/blibli/product/pair',
    method: 'post',
    data
  })
}

export function updateStockSingleProduct(data) {
  return service({
    url: '/blibli/product/update/stock/single-product',
    method: 'post',
    data
  })
}

export function getBulkProducts(params) {
  return service({
    url: '/blibli/product/pair/bulk-product',
    method: 'get',
    params
  })
}

export function pairBulkProduct(data) {
  return service({
    url: '/blibli/product/pair/bulk-product',
    method: 'POST',
    data
  })
}

export function initSyncProducts() {
  return service({
    url: '/blibli/product/download'
  })
}

export function getMerchant(params) {
  return service({
    url: '/blibli/integration/merchant',
    params
  })
}

export function getCategories(params) {
  return service({
    url: '/blibli/category',
    method: 'get',
    params
  })
}

export function downloadCategories(params) {
  return service({
    url: '/blibli/category/download',
    method: 'get',
    params
  })
}

export function settingStock(data) {
  return service({
    url: '/blibli/product/setting/stock',
    method: 'post',
    data
  })
}

export function integrationInfo(params) {
  return service({
    url: '/blibli/integration/info',
    method: 'get',
    params
  })
}

export function logManageProducts(params) {
  return service({
    url: '/blibli/log/activities',
    method: 'get',
    params
  })
}
