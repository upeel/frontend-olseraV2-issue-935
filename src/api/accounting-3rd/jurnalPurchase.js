import { service } from '@/http-common'

export function invoicePurchase(params){
  return service({
    url: '/exjurnal/purchase',
    params
  })
}

export function exportMultiInvoice(data){
  return service({
    url: '/exjurnal/multipurchase',
    method: 'POST',
    data
  })
}

export function unpostMultiInvoice(data){
  return service({
    url: '/exjurnal/purchase/'+data,
    method: 'DELETE'
  })
}

export function invoiceDeletePayment(id){
  return service({
    url: '/exjurnal/purchase/payment/'+id,
    method: 'DELETE'
  })
}

export function invoiceInfo(data){
  return service({
    url: '/exjurnal/purchase/message',
    method: 'POST',
    data
  })
}