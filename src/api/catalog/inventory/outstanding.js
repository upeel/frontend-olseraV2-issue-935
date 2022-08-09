import { service } from '@/http-common'

export function getListOutstanding(param) {
  return service({
    url: '/stockinoutstransfer',
    params: param
  })
}

export function getDetailOutstanding(id) {
  return service({
    url: '/stockinoutstransfer/' + id,
  })
}

export function downloadOutstanding(id) {
  return service({
    url: '/stockinoutstransfer/' + id,
    responseType: 'blob',
    params: {
      type: 'pdf'
    }
  })
}

export function postOutstanding(id) {
  return service({
    url: '/stockinoutstransfer/' + id,
    method: 'post'
  })
}

export function bulkpostOutstanding(data) {
  return service({
    url: '/stockinoutstransfer/bulkpost',
    method: 'post',
    data
  })
}