import { service } from '@/http-common'

export function exportShiftbalance(params) {
  return service({
    url: '/shiftbalance/excel',
    method: 'GET',
    responseType: 'blob',
    params
  })
}