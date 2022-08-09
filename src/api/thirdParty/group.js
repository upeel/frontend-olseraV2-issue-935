import { service } from '@/http-common'

export function fetchAll(params) {
  return service({
    url: '/thirdparty',
    params
  })
}

export function fetchByStore(params) {
  return service({
    url: '/thirdparty-bystore',
    params
  })
}

export function fetchSingle(id, params) {
  return service({
    url: '/thirdparty/' + id,
    params
  })
}

export function create(data) {
  return service({
    url: '/thirdparty',
    method: 'POST',
    data
  })
}

export function update(data) {
  return service({
    url: '/thirdparty/' + data.id,
    method: 'PUT',
    data
  })
}

export function destroy(id) {
  return service({
    url: '/thirdparty/' + id,
    method: 'DELETE'
  })
}

export function installmentList(data) {
  return service({
    url: '/installment-list',
    method: 'POST',
    data
  })
}
