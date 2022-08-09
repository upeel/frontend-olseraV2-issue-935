import { service } from '@/http-common'

export function invoiceReturn(params){
  return service({
    url: '/exjurnal/salesinvoisreturn',
    params
  })
}

export function exportMultiInvoice(data){
  return service({
    url: '/exjurnal/salesinvoisreturn',
    method: 'POST',
    data
  })
}

export function unpostMultiInvoice(data){
  return service({
    url: '/exjurnal/salesinvoisreturn/'+data,
    method: 'DELETE'
  })
}