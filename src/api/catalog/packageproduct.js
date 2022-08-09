import { service } from '@/http-common'

export function fetchSingle(id) {
  return service({
    url: '/productcombo/' + id
  })
}

export function fetchProductPackage(param) {
  return service({
    url: '/productcombo/',
    params: param
  })
}

export function copyPackage(data) {
  return service({
    url: '/productcombo/copy',
    method: 'POST',
    data
  })
}

export function exportPackage(params) {
  return service({
    url: '/productcombo/excel',
    method: 'GET',
    responseType: 'blob',
    params
  })
}

export function estimatePrice(data) {
  return service({
    url: '/estimatepriceproduct',
    method: 'POST',
    data
  })
}