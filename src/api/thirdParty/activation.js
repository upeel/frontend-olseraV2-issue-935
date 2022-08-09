import { service } from '@/http-common'

export function fetchAll(params) {
  return service({
    url: '/thirdparty-activation-all',
    params
  })
}

export function fetchByStore(params) {
  return service({
    url: '/thirdparty-activation',
    params
  })
}

export function fetchSingle(id, params) {
  return service({
    url: '/thirdparty-activation/' + id,
    params
  })
}

export function fetchCheck(id, params) {
  return service({
    url: '/activation-check/' + id,
    params
  })
}

export function create(data) {
  return service({
    url: '/thirdparty-activation',
    method: 'POST',
    data
  })
}
