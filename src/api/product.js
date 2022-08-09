import { service } from '@/http-common'

export function fetchAll(params) {
  return service({
    url: 'product',
    params
  })
}

export function fetchSingle(id) {
  return service({
    url: 'product/' + id
  })
}

export function fetchVariantSingle(id) {
  return service({
    url: 'productvariants/' + id
  })
}
export function downloadClassificationTemplate(data) {
  return service({
    url: 'category/exportclassification',
    method: 'GET',
    params: {
      type: 'xlsx'
    },
    responseType: 'blob'
  })
}

export function product(params) {
  return service({
    url: 'product',
    method: 'GET',
    params
  })
}

export function productGrup(params) {
  return service({
    url: 'productgroup',
    method: 'GET',
    params
  })
}

export function productvariantsearch(params) {
  return service({
    url: 'productvariantsearch',
    method: 'GET',
    params
  })
}

export function productvariantonlysearch(params) {
  return service({
    url: 'productvariantonlysearch',
    method: 'GET',
    params
  })
}

export function deleteBulkVariant(data) {
  return service({
    url: 'productvariants/bulkdeleted',
    method: 'DELETE',
    data
  })
}

export function searchUoms(params) {
  return service({
    url: 'searchuoms',
    params
  })
}

export function downloadProductTemplate(data) {
  return service({
    url: 'product/import/importfromcsv',
    method: 'GET',
    params: {
      type: 'csv'
    },
    responseType: 'blob'
  })
}

export function searchConditions(params) {
  return service({
    url: 'condition',
    params
  })
}
