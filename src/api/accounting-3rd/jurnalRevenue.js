import { service } from '@/http-common'

export function invoiceRevenue(params){
  return service({
    url: '/exjurnal/intrans',
    params
  })
}

export function exportJurnalIncome(data){
  return service({
    url: '/exjurnal/inextrans/single',
    method: 'POST',
    data
  })
}

export function unpostMultiInvoice(data){
  return service({
    url: '/exjurnal/inextrans/'+data,
    method: 'DELETE'
  })
}
