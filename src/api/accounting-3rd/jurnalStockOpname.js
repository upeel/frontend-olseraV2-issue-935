import { service } from '@/http-common'

export function invoiceStockOpname(params){
  return service({
    url: '/exjurnal/stockopname',
    params
  })
}

export function exportInvoiceStockOpname(data){
  return service({
    url: '/exjurnal/stockopname',
    method: 'POST',
    data
  })
}

export function unpostInvoiceStockOpname(data){
  return service({
    url: '/exjurnal/stockopname/'+data,
    method: 'DELETE'
  })
}
