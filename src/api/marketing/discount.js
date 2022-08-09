import { service } from '@/http-common'

export function getDiscountPos(params){
  return service({
    url: '/promosi-pos',
    method: 'GET',
    params
  })
}

export function getDiscountVoucher(params){
  return service({
    url: '/discountvoucher',
    method: 'GET',
    params
  })
}

export function getDiscountSales(params){
  return service({
    url: '/discountsales',
    method: 'GET',
    params
  })
}

export function saveCopyDiscount(data){
  return service({
    url: '/clonediscountfromstore',
    method: 'POST',
    data
  })
}