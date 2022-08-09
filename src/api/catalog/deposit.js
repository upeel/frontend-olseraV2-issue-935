import { service } from '@/http-common'

export function fetchMasterDeposit(param) {
  return service({
    url: '/masterdeposit/',
    params: param
  })
}

export function createMasterDeposit(data) {
  return service({
    url: '/masterdeposit/',
    method: 'POST',
    data
  })
}

export function updateMasterDeposit(data) {
  return service({
    url: '/masterdeposit/' + data.id,
    method: 'PUT',
    data
  })
}

export function deleteMasterDeposit(data) {
  return service({
    url: '/masterdeposit/' + data.id,
    method: 'DELETE'
  })
}