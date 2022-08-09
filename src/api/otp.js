import { API } from '@/http-common'
import { HTTP } from '@/http-common'
import { service } from '@/http-common'

function generateToken() {
  console.log('token', localStorage.getItem('olsbo_tempToken'))
  if (localStorage.getItem('olsbo_tempToken')) {
    return JSON.parse(localStorage.getItem('olsbo_tempToken')).access_token
  } else {
    return null
  }
}

export function resend(data) {
  return API({
    url: 'admin/v1/id/resendotp',
    method: 'POST',
    data
  })
}

export function verify(data) {
  return API({
    url: 'admin/v1/id/verifyotp',
    method: 'POST',
    data
  })
}

export function verifyOtpRegister(data) {
  console.log('trace', data)
  return HTTP({
    url: 'api/admin/v1/id/verifyotp',
    method: 'POST',
    headers: {
      // Authorization: 'Bearer ' + generateToken()
      Authorization: 'Bearer ' + data.access_token
    },
    data
  })
}

export function resendOtpRegister(data) {
  return HTTP({
    url: 'api/admin/v1/id/resendotp',
    method: 'POST',
    headers: {
      // Authorization: 'Bearer ' + generateToken()
      Authorization: 'Bearer ' + data.access_token
    },
    data
  })
}

export function resendOtpProfile(data) {
  return service({
    url: 'myprofile/changephone/resendotp',
    method: 'POST',
    data
  })
}

export function verifyOtpProfile(data) {
  return service({
    url: 'myprofile/verifyotp',
    method: 'POST',
    data
  })
}
