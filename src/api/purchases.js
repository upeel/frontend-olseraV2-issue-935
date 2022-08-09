import { service } from '@/http-common'

export function fetchPaymentFromJurnal(params) {
  return service({
    url: 'openpurchase/paymentjurnal',
    params
  })
}