import { service } from '@/http-common'

export function downloadQr(data) {
  return service({
    url: 'online/settings/urlqrcode',
    method: 'POST',
    params: data
  })
}

export function bannerSetting(data) {
  return service({
    url: 'online/settings/banner',
    method: 'GET',
    params: data
  })
}

export function cekTermCondition() {
  return service({
    url: 'online/termconditions',
    method: 'GET'
  })
}

export function acceptTermCondition() {
  return service({
    url: 'online/termconditions/accepts',
    method: 'GET'
  })
}

export function getService() {
  return service({
    url: 'online/services',
    method: 'GET'
  })
}

export function getSetting() {
  return service({
    url: 'online/settings',
    method: 'GET'
  })
}

export function updateSetting(data) {
  return service({
    url: 'online/settings',
    method: 'PUT',
    data
  })
}

export function downloadTnc() {
  return service({
    url: 'online/termconditions/pdf',
    method: 'GET',
    responseType: 'blob'
  })
}

export function listLayout() {
  return service({
    url: 'online/settings/dinein/layout',
    method: 'GET'
    // params: data
  })
}

export function listLayoutItem(data) {
  return service({
    url: 'online/settings/dinein/layoutitems',
    method: 'GET',
    params: data
  })
}

export function listLayoutItemSingle(data) {
  return service({
    url: 'online/settings/dinein/layoutitems/' + data.id,
    method: 'GET',
    params: data
  })
}

export function downloadBannerDinein(param,data) {
  return service({
    url: 'online/settings/dinein/layoutitems/downloadbanner/' + param.id,
    method: 'POST',
    params: param,
    data
  })
}

export function downloadBannerBookMenu(data) {
  return service({
    url: 'online/settings/dinein/bookmenu-qrcode',
    method: 'POST',
    data
  })
}

export function listReservation(data) {
  return service({
    url: 'online/reservation',
    method: 'GET',
    params: data
  })
}

export function updateReservation(data) {
  return service({
    url: 'online/reservation',
    method: 'PUT',
    data
  })
}

export function timeReservation() {
  return service({
    url: 'online/reservationtimes',
    method: 'GET'
  })
}

export function updateTimeReservation(data) {
  return service({
    url: 'online/reservationtimes',
    method: 'PUT',
    data
  })
}