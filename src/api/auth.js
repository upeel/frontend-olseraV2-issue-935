import { HTTP } from '@/http-common'
import { service } from '@/http-common'
// import id from '../lang/id'
import store from '@/store'
const lang = store && store.state && store.state.userStores.langId ? store.state.userStores.langId : 'en'
const endpoint = 'api/admin/v1/' + lang

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

function generateTokenRegister() {
  if (localStorage.getItem('olsbo_tempToken')) {
    return JSON.parse(localStorage.getItem('olsbo_tempToken')).access_token
  } else {
    return null
  }
}

export function login(form) {
  const data = {
    username: form.username,
    password: form.password,
    client_id: 2,
    client_secret: '0XqbhEW6E72GNHn0iIM7Ui1GgB8jny91wYnXAIb8',
    grant_type: 'password'
  }
  return HTTP({
    url: 'oauth/token',
    method: 'post',
    data,
    headers: {
      device: 123123123
    }
  })
}

export function getBusinessTypes(params) {
  return HTTP({
    url: '/api/admin/v1/en/businesstype',
    method: 'get',
    params
  })
}

export function getCountries(search_text) {
  return HTTP({
    url: '/getcountry',
    method: 'get',
    params: {
      sort_column: 'id',
      sort_type: 'desc',
      search_column: 'name',
      search_text
    }
  })
}

export function getStates(search_text) {
  let params = {}
  if (search_text) {
    params = {
      per_page: 500,
      sort_column: 'id',
      sort_type: 'asc',
      search_column: 'name',
      search_text
    }
  } else {
    params = {
      per_page: 500,
      sort_column: 'id',
      sort_type: 'asc'
    }
  }
  return HTTP({
    url: '/getstate',
    method: 'get',
    params
  })
}

export function getCities(search_text) {
  return HTTP({
    url: '/getcity',
    method: 'get',
    params: {
      sort_column: 'id',
      sort_type: 'desc',
      search_column: 'city',
      search_text
    }
  })
}

export function getCitiesByIdProv(id) {
  return HTTP({
    url: '/getcity',
    method: 'get',
    params: {
      per_page: 500,
      sort_column: 'id',
      sort_type: 'desc',
      search_column: 'state_id',
      search_operator: '=',
      search_text: id
    }
  })
}

export function register(data, langId) {
  return HTTP({
    url: 'api/admin/v1/' + langId + '/newstore',
    method: 'post',
    data,
    headers: {
      Authorization: 'Bearer ' + generateToken()
    }
  })
}

export function newstore(data) {
  return HTTP({
    url: endpoint + '/newstore',
    method: 'post',
    data,
    headers: {
      Authorization: 'Bearer ' + generateToken()
    }
  })
}

export function urlcheck(data) {
  return HTTP({
    url: endpoint + '/storebyurl',
    method: 'get',
    params: data
  })
}

export function user() {
  return HTTP({
    url: '/api/user',
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + generateToken()
    }
  })
}

export function resetEmailPassword(data) {
  return HTTP({
    url: '/password/create',
    method: 'post',
    data
  })
}

export function registerUser(data) {
  // console.log('registerUser', data)
  return HTTP({
    url: endpoint + '/register',
    method: 'POST',
    data
  })
}

export function logout() {
  return HTTP({
    headers: {
      device: 123123123,
      Authorization: 'Bearer ' + generateToken()
    },
    url: endpoint + '/logout',
    method: 'POST',
    data: {
      token_fcm: 'eAFRpu14hx4:APA91bExCqmkaemxH5WrFLXez9hj8pVnJLOHdaPR_TjPdu2NOPBl-3lrBYHnWiZJkywz0PZst0gVwWkLwqI9cpNQNcmMsBZCxbwGAQ8BT3LDnL0Bfgpa71xKqZnqi0SysXd3s8pY4e8O'
    }
  })
}

export function reverifyProfile(data) {
  return service({
    url: '/userdatasensitive',
    method: 'POST',
    data
  })
}

export function resetPassword(data) {
  // console.log('registerUser', data)
  return HTTP({
    url: '/password/reset',
    method: 'POST',
    data
  })
}
