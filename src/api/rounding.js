import { service } from '@/http-common'

export function fetchRoundingSetting() {
  return service({
    url: '/roundingsetting',
    method: 'GET'
  })
}

export function updateRoundingSetting(data) {
  return service({
    url: '/roundingsetting',
    method: 'PUT',
    data
  })
}