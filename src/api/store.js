import { service, API } from '@/http-common'

export function fetchBranches(params) {
  return service({
    url: '/storebranches',
    params
  })
}
// import { API } from '@/http-common'

export function fetchStores(params) {
  return API({
    url: '/store',
    method: 'GET',
    params
  })
}

export function fetchStore(id, token = null) {
  const api = {
    url: 'store/' + id,
    method: 'GET'
  }
  if (token) {
    api.headers = {
      'Authorization': 'Bearer ' + token
    }
  }
  return API(api)
}

export function updateStore(data) {
  return service({
    url: 'generalsetting/update',
    method: 'PUT',
    data
  })
}

export function getUserRole(params) {
  return service({
    url: 'staffs/getrole',
    method: 'GET',
    params
  })
}
