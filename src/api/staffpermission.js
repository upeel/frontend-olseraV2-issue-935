import { service } from '@/http-common'

export function permissionList(params) {
  return service({
    url: '/permission/list',
    method: 'GET',
    params
  })
}

export function updatePermission(data) {
  return service({
    url: '/permission/multipleupdate',
    method: 'PUT',
    data
  })
}
