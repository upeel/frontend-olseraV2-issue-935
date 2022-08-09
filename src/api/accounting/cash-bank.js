import { service } from '@/http-common'

export function getSettlement(params){
  return service({
    url: '/account/settlement',
    params
  })
}

export function confirmSettlement(data){
  return service({
    url: '/account/settlement',
    method: 'POST',
    data
  })
}
