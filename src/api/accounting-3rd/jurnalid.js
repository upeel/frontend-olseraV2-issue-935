import { service } from '@/http-common'

export function fetchproduct(params) {
  return service({
    url: '/exjurnal/fetchproduct',
    params
  })
}

export function isFetch(){
  return service({
    url: '/exjurnal/isfetch'
  })
}

export function syncSupplier(params){
  return service({
    url: '/exjurnal/syncronvendor',
    params
  })
}

export function syncCustomer(params){
  return service({
    url: '/exjurnal/syncroncustomer',
    params
  })
}

export function syncProduct(params){
  return service({
    url: '/exjurnal/syncronproduct',
    params
  })
}

export function listFecthProduct(params){
  return service({
    url: '/exjurnal/fetchproduct/list',
    params
  })
}

export function fetchCustomer(params){
  return service({
    url: '/exjurnal/fetchcustomer',
    params
  })
}

export function listFecthCustomer(params){
  return service({
    url: '/exjurnal/fetchcustomer/list',
    params
  })
}

export function fetchSupplier(params){
  return service({
    url: '/exjurnal/fetchsupplier',
    params
  })
}

export function listFecthSupplier(params){
  return service({
    url: '/exjurnal/fetchsupplier/list',
    params
  })
}

export function deleteJurnalProduct(){
  return service({
    url: '/exjurnal/fetchproduct',
    method: 'DELETE'
  })
}

export function getStockRemainPurchase(params){
  return service({
    url: '/exjurnal/stockremaining/purchase',
    params
  })
}
