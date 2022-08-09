import { service } from '@/http-common'

export function redirectToV1() {
  return service({
    url: '/redirectv1',
    method: 'GET'
  })
}
