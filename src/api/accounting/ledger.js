import { service } from '@/http-common'

export function getLedger2(params){
  return service({
    url: '/account/ledger2',
    params
  })
}

export function ledger2Detail(params){
  return service ({
    url: '/account/ledger2/detail',
    params
  })
}

export function ledgerPDF(params){
  return service ({
    url: '/account/ledger2/pdf',
    responseType: 'blob',
    params
  })
}

export function ledgerExcel(params){
  return service ({
    url: '/account/ledger2/excel',
    responseType: 'blob',
    params
  })
}

export function ledgerPageStatus(params){
  return service ({
    url: '/account/ledger2/status',
    params
  })
}
