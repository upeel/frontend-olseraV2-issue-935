import { service } from '@/http-common'

export function fetchAll(params) {
  return service({
    url: '/thirdpartyitem',
    params
  })
}

export function fetchSingle(id, params) {
  return service({
    url: '/thirdpartyitem/' + id,
    params
  })
}

export function create(data) {
  return service({
    url: '/thirdpartyitem',
    method: 'POST',
    data
  })
}

export function update(data) {
  return service({
    url: '/thirdpartyitem/' + data.id,
    method: 'PUT',
    data
  })
}

export function destroy(id) {
  return service({
    url: '/thirdpartyitem/' + id,
    method: 'DELETE'
  })
}
