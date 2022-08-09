import { service } from '@/http-common'

export function dataSettlement(params) {
  return service({
    url: '/settlement',
    method: 'GET',
    params
  })
}

export function dataBank(params) {
  return service({
    url: '/bankswift',
    method: 'GET',
    params
  })
}

export function settlementAccount(params) {
  return service({
    url: '/settlement/account',
    method: 'GET',
    params
  })
}

export function updateAccount(data) {
  return service({
    url: '/settlement/account',
    method: 'POST',
    data
  })
}

export function cekPassword(data) {
  return service({
    url: '/settlement/account/cekpassword',
    method: 'POST',
    data
  })
}

export function detailSettlement(id) {
  return service({
    url: '/settlement/' + id,
    method: 'GET'
  })
}

export function downloadSettlement(id) {
  return service({
    url: '/settlement/export/' + id,
    method: 'GET',
    responseType: 'blob'
  })
}

export function downloadSettlementList(params) {
  return service({
    url: '/settlement',
    method: 'GET',
    params,
    responseType: 'blob'
  })
}

export function detailOrder(params) {
  return service({
    url: '/settlement/details/' + params.id,
    method: 'GET',
    params
  })
}

export function settlementOnlineOrder(params) {
  return service({
    url: '/settlement/selforder',
    method: 'GET',
    params
  })
}

export function downloadSettlementOnlineOrder(params) {
  return service({
    url: '/settlement/selforder',
    method: 'GET',
    params,
    responseType: 'blob'
  })
}