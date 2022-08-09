import { service } from '@/http-common'

export function openorder(params) {
  return service({
    url: 'openorder',
    method: 'GET',
    params
  })
}

export function getOrderMarketplace(params) {
  return service({
    url: '/marketplace/order/notification',
    method: 'GET',
    params
  })
}

export function findDriver(dataId) {
  return service({
    url: '/openorder/gosendorder/' + dataId,
    method: 'GET'
  })
}

export function logsDriver(dataId) {
  
  return service({
    url: '/openorder/gosendorder/history/' + dataId,
    method: 'GET'
  })
}
