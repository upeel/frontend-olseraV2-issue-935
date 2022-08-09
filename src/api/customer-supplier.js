import { service } from '@/http-common'

export function customer(params) {
  return service({
    url: 'customer',
    method: 'GET',
    params
  })
}

export function customerTemplate(params) {
  return service({
    url: 'customer/importfromcsv',
    method: 'GET',
    params
  })
}

export function supplierTemplate(params) {
  return service({
    url: 'supplier/importfromcsv',
    method: 'GET',
    params
  })
}

export function getCustomerDeposit(params) {
  return service({
    url: 'customerdeposittransaction/' + params.id,
    method: 'GET',
    params
  })
}

export function getCustomerDetailDeposit(data) {
  return service({
    url: 'customerdeposittransaction/' + data.customer_id + '/' + data.id,
    method: 'GET'
  })
}

export function getCustomerLoyalty(params) {
  return service({
    url: 'customerloyaltypoints/' + params.id,
    method: 'GET',
    params
  })
}

