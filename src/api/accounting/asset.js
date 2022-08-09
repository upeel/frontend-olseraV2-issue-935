import { service } from '@/http-common'

export function templateExcel(){
  return service({
    url: '/account/jurnal/templateasset',
		responseType: 'blob',
  })
}

export function importExcel(data){
  return service({
    url: '/account/jurnal/importfromcsv',
    method: 'POST',
    data
  })
}
