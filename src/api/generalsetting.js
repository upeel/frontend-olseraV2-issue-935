import { service } from '@/http-common'

export function fetch() {
  return service({
    url: '/generalsetting',
    method: 'GET'
  })
}

export function getTimezone() {
  return service({
    url: 'timezone',
    method: 'GET'
  })
}

export function fetchProvince(params) {
  return service({
    url: '/state',
    method: 'GET',
    params
  })
}

export function fetchCity(params) {
  return service({
    url: '/shippingcity',
    method: 'GET',
    params
  })
}

export function fetchDistrict(params) {
  return service({
    url: '/shippingcitysubdistrict',
    method: 'GET',
    params
  })
}

export function fetchMyProfile() {
  return service({
    url: '/myprofile',
    method: 'GET'
  })
}

export function setPopUp(data) {
  return service({
    url: '/usernotification/accept',
    method: 'POST',
    data
  })
}
