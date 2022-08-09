import { service } from '@/http-common'

export function getJurnalName(params){
  return service({
    url: '/account/jurnalname',
    params
  })
}
