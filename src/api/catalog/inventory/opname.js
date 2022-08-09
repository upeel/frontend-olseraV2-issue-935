import { service } from '@/http-common'

export function importTemplateOpname(param) {
  return service({
    url: '/stockopname/templateimport',
    responseType: 'blob',
    params: param
  })
}

export function postProfitloss(id) {
  return service({
    url: '/stockopname/postprofitloss/' + id,
    method: 'post'
  })
}