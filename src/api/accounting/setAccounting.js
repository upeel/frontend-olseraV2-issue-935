import { service } from '@/http-common'

export function apiLoadStore(){
  return service({
    url: '/account/store'
  })
}

export function dataSetPOS(){
  return service({
    url: '/account/postsetting'
  })
}

export function savePOSTrx(data){
  return service({
    url: '/account/postsetting',
    method: 'POST',
    data
  })
}

export function saveSet(data){
  return service({
    url: '/account/store',
    method: 'POST',
    data
  })
}

export function saveProductGroup(data){
  return service({
    url: '/account/store/productgroup',
    method: 'POST',
    data
  })
}

export function saveMapProductGroup(data){
  return service({
    url: '/account/productgroup',
    method: 'POST',
    data
  })
}

export function resetAccounting(){
  return service({
    url: '/account/firstSetup',
    method: 'DELETE'
  })
}