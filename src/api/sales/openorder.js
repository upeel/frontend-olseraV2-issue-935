import { service } from '@/http-common'

export function updateStatusOrder(data) {
  return service({
    url: '/openorder/updatestatus',
    method: 'POST',
    data
  })
}

export function updateCustomerOrder(data) {
  return service({
    url: 'openorder/updatecustomer/',
    method: 'POST',
    data
  })
}