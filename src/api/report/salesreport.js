import { service } from '@/http-common'

export function salesbysalesmanDetail(params) {
  return service({
    url: '/salesreports/salesitemsbydate',
    params
  })
}

export function comissionbyserverDetail(params) {
  return service({
    url: '/salesreports/salesitemsbydate',
    params
  })
}

export function salesdetail(params) {
  return service({
    url: '/salesreports/salesdetails',
    params
  })
}

export function salesdetailtaxrole(params) {
  return service({
    url: '/salesreports/taxation/salesdetails',
    method: 'GET',
    params
  })
}

export function downloadSalesdetailtaxrole(params) {
  return service({
    url: '/salesreports/taxation/salesdetails',
    method: 'GET',
    params,
    responseType: 'blob'
  })
}

export function remainingDepositDetail(params) {
  return service({
    url: '/salesreports/remainingdepositdetailbycustomer',
    method: 'GET',
    params
  })
}

export function downloadDetailDepositCustomer(params) {
  return service({
    url: '/salesreports/remainingdepositdetailbycustomer',
    method: 'GET',
    params,
    responseType: 'blob'
  })
}