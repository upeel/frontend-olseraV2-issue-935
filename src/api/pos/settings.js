import { service } from '@/http-common'

export function create(data) {
  return service({
    url: '/posdevices/store',
    method: 'POST',
    data
  })
}

export function update(deviceId, data) {
  return service({
    url: '/posdevices/update/' + id,
    method: 'PUT',
    data
  })
}

export function destroy(deviceId) {
  return service({
    url: '/posdevices/delete/' + deviceId,
    method: 'DELETE'
  })
}

export function posdevices(params) {
  return service({
    url: '/posdevices',
    method: 'GET',
    params
  })
}

export function posdevicesactive(params) {
  return service({
    url: '/posdevicesactive',
    method: 'GET',
    params
  })
}

export function release(deviceId) {
  return service({
    url: '/posdevicesactive/release/' + deviceId,
    method: 'DELETE'
  })
}
