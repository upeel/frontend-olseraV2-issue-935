import { service } from '@/http-common'

export function invoiceStockIn(params){
  return service({
    url: '/exjurnal/stockin/purchase',
    params
  })
}

export function exportMultiInvoice(data){
  return service({
    url: '/exjurnal/stockin/purchase',
    method: 'POST',
    data
  })
}

export function unpostMultiInvoice(data){
  return service({
    url: '/exjurnal/stockin/purchase/'+data,
    method: 'DELETE'
  })
}
