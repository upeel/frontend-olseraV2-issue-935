import { service } from '@/http-common'

export function taxationSubmission() {
  return service({
    url: '/taxation',
    method: 'POST'
  })
}