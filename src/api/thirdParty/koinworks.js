import { service } from '@/http-common'
import store from '@/store'

export function installCall(data) {
  return service({
    url: '/koinwork-installment',
    method: 'POST',
    data
  })
}

export function storeSubmision(params){
  return service({
    url: '/koinwork-bystore',
    method: 'GET',
    params
  })
}

export function userData() {
  return service({
    url: '/user-detail',
    method: 'GET'
  })
}

export function fundingHistory() {
  return service({
    url: '/koinwork',
    method: 'GET'
  })
}

export function submitKoinworks(url,data) {
  return service({
    url: url,
    method: 'POST',
    data
  })
}