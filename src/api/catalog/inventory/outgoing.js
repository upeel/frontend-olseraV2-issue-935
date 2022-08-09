import { service } from '@/http-common'

export function postProfitloss(id) {
  return service({
    url: '/stockinouts/postprofitloss/' + id,
    method: 'post'
  })
}