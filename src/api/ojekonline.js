import { service } from '@/http-common'

export function fetchMasterOjekonline(params) {
  return service({
    url: '/ojekonlinemarking',
    params
  })
}

export function fetchDetailMasterOjekonline(id) {
  return service({
    url: '/ojekonlinemarking/' + id
  })
}

export function fetchDataProduct(params) {
  return service({
    url: '/ojekonlinemarkingitem',
    params
  })
}

export function updateMasterMarking(data) {
  return service({
    url: '/ojekonlinemarking/',
    method: 'PUT',
    data
  })
}

export function getProduct(params) {
  return service({
    url: '/ojekonlinemarkingitem/product',
    params
  })
}

export function addProduct(data) {
  return service({
    url: '/ojekonlinemarkingitem',
    method: 'POST',
    data
  })
}

export function updateProduct(data) {
  return service({
    url: '/ojekonlinemarkingitem/bulkupdated',
    method: 'PUT',
    data
  })
}

export function deleteProduct(data) {
  return service({
    url: '/ojekonlinemarkingitem/bulkdeleted',
    method: 'DELETE',
    data
  })
}

export function copyProduct(data) {
  return service({
    url: '/ojekonlinemarkingitem/copyproduct',
    method: 'POST',
    data
  })
}