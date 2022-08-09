import { service } from '@/http-common'

export function upgradeStoreTrial() {
  return service({
    url: 'upgradestore',
    method: 'PUT'
  })
}

export function clickRecord(data) {
  return service({
    url: 'clickrecord',
    method: 'POST',
    data
  })
}

export function getDataCompareSales(params) {
  return service({
    url: 'dashboard/comparesales',
    params
  })
}