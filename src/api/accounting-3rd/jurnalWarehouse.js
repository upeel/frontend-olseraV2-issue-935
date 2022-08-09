import { service } from '@/http-common'

export function invoiceWarehouse(params){
  return service({
    url: '/exjurnal/stockout',
    params
  })
}

export function exportInvoiceWarehouse(data){
  return service({
    url: '/exjurnal/stockout',
    method: 'POST',
    data
  })
}

export function unpostInvoiceWarehouse(data){
  return service({
    url: '/exjurnal/stockout/'+data,
    method: 'DELETE'
  })
}
