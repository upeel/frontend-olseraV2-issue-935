import { service } from '@/http-common'

export function tracking(data) {
  return service({
    url: '/whatnewstracking',
    method: 'POST',
    data
  })
}
