import { service } from '@/http-common'

export function dataQueueDevices(params) {
  return service({
    url: '/queuedevice',
    method: 'GET',
    params
  })
}

export function addQueueDevices(data) {
  return service({
    url: '/queuedevice',
    method: 'POST',
    data
  })
}

export function updateQueueDevices(data) {
  return service({
    url: '/queuedevice/' + data.id,
    method: 'PUT',
    data
  })
}

export function deleteQueueDevices(data) {
  return service({
    url: '/queuedevice/' + data.id,
    method: 'DELETE'
  })
}

export function dataQueueDisplay(params) {
  return service({
    url: '/queuedisplay',
    method: 'GET',
    params
  })
}

export function updateQueueDisplay(data) {
  return service({
    url: '/queuedisplay',
    method: 'POST',
    data
  })
}