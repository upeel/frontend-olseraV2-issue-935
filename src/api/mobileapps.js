import { service } from '@/http-common'

export function fetchMoreSetting(params) {
  return service({
    url: '/mobilesetting',
    params
  })
}

export function updateMoreSetting(data) {
  return service({
    url: '/mobilesetting/update',
    method: 'put',
    data
  })
}