import { service } from '@/http-common'
import { HTTP } from '@/http-common'

export function absentcoming(data) {
  return service({
    url: '/attendance/client/employee/absentcoming/' + data.id,
    method: 'PUT',
    data
  })
}

export function absentgoing(data) {
  return service({
    url: '/attendance/client/employee/absentgoing/' + data.id,
    method: 'PUT',
    data
  })
}

export function clientEmployeeList(params) {
  return service({
    url: '/attendance/employee',
    method: 'GET',
    params
  })
}

export function clientEmployeeDetail(params) {
  return service({
    url: '/attendance/client/employee/' + params.id,
    method: 'GET',
    params
  })
}

export function clientPresenceList(params) {
  return service({
    url: '/attendance/client/presence',
    method: 'GET',
    params
  })
}

export function clientPresenceListByDate(params) {
  return service({
    url: '/attendance/client/employee/scopedate',
    method: 'GET',
    params
  })
}

export function clientPresenceListByDateNew(params) {
  return service({
    url: '/attendance/client/employee/scopedatenew',
    method: 'GET',
    params
  })
}

export function getBarcode(params) {
  return service({
    url: '/attendance/client/presence/qrcode',
    method: 'POST',
    params
  })
}

export function getAuthAttendance(params) {
  return HTTP({
    url: '/api/admin/v1/en/attendance/client/presence/qrcode/getToken',
    method: 'get',
    params
  })
}

export function login(data) {
  return HTTP({
    url: '/api/admin/v1/id/attendance/login',
    method: 'post',
    headers: {
      device: 123123123
    },
    data
  })
}

export function timeserver() {
  return HTTP({
    url: '/api/timeserver',
    method: 'GET'
  })
}

export function getDays() {
  return HTTP({
    url: '/api/admin/v1/id/getdays',
    method: 'GET',
  })
}

export function getAttendanceDevices(params) {
  return service({
    url: '/pos-device',
    method: 'GET',
    params
  })
}

export function getSinggleAttendanceDevices(data) {
  return service({
    url: '/pos-device/' + data,
    method: 'GET'
  })
}

export function updateDevice(data) {
  return service({
    url: '/upt-device/' + data.id,
    method: 'PUT',
    data
  })
}

export function addDevice(data) {
  return service({
    url: '/store-device',
    method: 'POST',
    data
  })
}

export function deleteDevice(data) {
  return service({
    url: '/del-device',
    method: 'DELETE',
    headers: {
      device: data.id
    },
  })
}
