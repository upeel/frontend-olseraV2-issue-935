import { service, API } from '@/http-common'

export function upgradeStoreTrial(data) {
  return service({
    url: '/upgradeplanstore',
    method: 'PUT',
    data
  })
}

export function upgradeStoreWithProrate(data) {
  return service({
    url: '/plan-upgrade',
    method: 'PUT',
    data: {
      to_plan_type_id: data.to_plan_type_id,
      is_create_billing: data.is_create_billing ? data.is_create_billing : 0,
      payment_mode_id: data.payment_mode_id ? data.payment_mode_id : 0,
      is_business_entity: data.is_business_entity
    }
  })
}

export function fetchPaymentModes() {
  return API({
    url: '/admin/v1/id/billings/paymentmode',
    method: 'GET'
  })
}

export function fetchBillingPackagesByStoreId({ storeId, planTypeId }) {
  return API({
    url: '/admin/v1/id/billings/package',
    method: 'GET',
    params: {
      store_id: storeId,
      plan_type_id: planTypeId
    }
  })
}

export function fetchBillingPosPackages() {
  return API({
    url: '/admin/v1/id/billings/package/pos',
    method: 'GET'
  })
}

export function fetchListVA() {
  return API({
    url: '/admin/v1/id/xendit/banks',
    method: 'GET'
  })
}

export function fetchListVABank() {
  return API({
    url: '/admin/v1/id/billings/paymentmode',
    method: 'GET'
  })
}