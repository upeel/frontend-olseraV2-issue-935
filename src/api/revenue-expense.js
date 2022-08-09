import { service } from '@/http-common'

export function downloadTemplate(data) {
  return service({
    url: 'inextranstype/importtemplate',
    method: 'GET',
    params: {
      type: 'csv'
    },
    responseType: 'blob'
  })
}