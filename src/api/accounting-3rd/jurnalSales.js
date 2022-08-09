import { service } from '@/http-common'

export function listSales(params){
  return service({
    url: '/exjurnal/sales',
    params
  })
}

export function exportMultiSales(data){
  return service({
    url: '/exjurnal/multisales',
    method: 'POST',
    data
  })
}

export function unpostMultiSales(data){
  return service({
    url: '/exjurnal/sales/'+data,
    method: 'DELETE'
  })
}

export function salesDeletePayment(id){
  return service({
    url: '/exjurnal/sales/payment/'+id,
    method: 'DELETE'
  })
}

export function salesInfo(data){
  return service({
    url: '/exjurnal/sales/message',
    method: 'POST',
    data
  })
}