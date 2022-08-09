import { service } from '@/http-common'

export function ojekOnlineList(params){
  return service({
    url: '/account/ojekonline',
    params
  })
}

export function ojekOnlinePerdate(params){
  return service({
    url: '/account/ojekonline/perdate',
    params
  })
}


export function confirmOjekPrice(data){
  return service({
    url: '/account/ojekonline',
    method: 'POST',
    data
  })
}
