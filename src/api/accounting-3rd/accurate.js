import { service } from '@/http-common'

export function fetchproduct(params) {
  return service({
    url: '/exaccurate/product/syncron',
    params
  })
}

export function listFecthProduct(params){
  return service({
    url: '/exaccurate/product',
    params
  })
}

export function fetchCustomer(params){
  return service({
    url: '/exaccurate/customer/syncron',
    params
  })
}

export function listFecthCustomer(params){
  return service({
    url: '/exaccurate/customer',
    params
  })
}

export function fetchSupplier(params){
  return service({
    url: '/exaccurate/supplier/syncron',
    params
  })
}

export function listFecthSupplier(params){
  return service({
    url: '/exaccurate/vendor',
    params
  })
}
