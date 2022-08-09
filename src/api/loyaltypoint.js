import { service } from '@/http-common'

export function useLpointRedeem(data) {
  return service({
    url: '/loyaltypoint/uselpointredeem',
    method: 'POST',
    data
  })
}