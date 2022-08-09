import { service } from '@/http-common'
import store from '@/store'

function generateToken() {
  if (localStorage.getItem('olsbo_tempToken')) {
    return JSON.parse(localStorage.getItem('olsbo_tempToken')).access_token
  }
  if (store.state.webview.webviewMode) {
    return store.state.webview.token.access_token
  } else {
    return store.state.user.token.access_token
  }
}

export function submitSubmission(params) {
  return service({
    url: '/thirdparty-activation/commonwealth',
    method: 'POST',
    data: params,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: 'Bearer ' + generateToken()
    }
  })
}