import { service } from '@/http-common'

export function cashCapital(params){
  return service({
    url: '/account/name/cashcapital',
    params
  })
}

export function assetOnly(params){
  return service({
    url: '/account/name/assetonly',
    params
  })
}

export function expenses(params){
  return service({
    url: '/account/name/expenses',
    params
  })
}

export function depreciation(params){
  return service({
    url: '/account/name/depreciation',
    params
  })
}