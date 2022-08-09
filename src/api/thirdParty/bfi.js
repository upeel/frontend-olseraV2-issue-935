import { service } from '@/http-common'
import store from '@/store'

export function installCall(data) {
  return service({
    url: '/bfi-installment',
    method: 'POST',
    data
  })
}

export function bfiStore(params){
  return service({
    url: '/bfi-bystore',
    method: 'GET',
    params
  })
}

export function submitBFI(url, data){
  return service({
    url: url,
    method: 'POST',
    data
  })
}