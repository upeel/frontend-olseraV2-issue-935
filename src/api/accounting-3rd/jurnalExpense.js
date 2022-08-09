import { service } from '@/http-common'

export function invoiceExpense(params){
  return service({
    url: '/exjurnal/intrans',
    params
  })
}

export function exportJurnalExpense(data){
  return service({
    url: '/exjurnal/inextrans/single',
    method: 'POST',
    data
  })
}

export function unpostMultiExpense(data){
  return service({
    url: '/exjurnal/inextrans/'+data,
    method: 'DELETE'
  })
}
