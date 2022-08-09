import { HTTP } from '@/http-common'
import { service } from '@/http-common'

export function fetchList(params) {
  return HTTP({
    url: '/api/admin/v1/en/partner',
    method: 'GET',
    params
  })
}

export function fetchByCode(code) {
  return HTTP({
    url: '/api/admin/v1/en/partner/code/' + code,
    method: 'GET'
  })
}

export function profileUser(params) {
  return service({
    url: '/myprofile',
    params
  })
}

export function addBankAccount(data) {
  return service({
    url: '/masterpartner/addbank',
    method: 'POST',
    data
  })
}

export function fetchMasterpartner(params) {
  return service({
    url: '/masterpartner',
    params
  })
}

export function activatePartnership(data) {
  return service({
    url: '/masterpartner',
    method: 'POST',
    data
  })
}

export function getPartnerDetail(data) {
  return service({
    url: '/masterpartner/' + data.store_id 
  })
}
