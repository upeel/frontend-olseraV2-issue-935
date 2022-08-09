import { service } from '@/http-common'

export function salesList(params){
  return service({
    url: '/account/sales',
    params
  })
}

export function salesPost(data){
  return service({
    url: '/account/sales',
    method: 'POST',
    data
  })
}

export function salesUnpost(data){
  return service({
    url: '/account/sales/'+data,
    method: 'DELETE'
  })
}

export function purchaseList(params){
  return service({
    url: '/account/purchase',
    params
  })
}

export function purchasePost(data){
  return service({
    url: '/account/purchase',
    method: 'POST',
    data
  })
}

export function purchaseUnpost(data){
  return service({
    url: '/account/purchase/'+data,
    method: 'DELETE'
  })
}

export function salesReturnList(params){
  return service({
    url: '/account/salesreturn',
    params
  })
}

export function salesReturnPost(data){
  return service({
    url: '/account/salesreturn',
    method: 'POST',
    data
  })
}

export function salesReturnUnpost(data){
  return service({
    url: '/account/salesreturn/'+data,
    method: 'DELETE'
  })
}

export function incomeList(params){
  return service({
    url: '/account/inextrans/income',
    params
  })
}

export function expenseList(params){
  return service({
    url: '/account/inextrans/expense',
    params
  })
}

export function cashBankOnly(params){
  return service({
    url: '/account/name/cashbankonly',
    params
  })
}

export function expenseOnly(params){
  return service({
    url: '/account/name/expenses',
    params
  })
}

export function revenueOnly(params){
  return service({
    url: '/account/name/revenue',
    params
  })
}

export function incomePost(data){
  return service({
    url: '/account/inextrans',
    method: 'POST',
    data
  })
}

export function incomeTypeList(params){
  return service({
    url: '/account/inextype/income',
    params
  })
}

export function expenseTypeList(params){
  return service({
    url: '/account/inextype/expense',
    params
  })
}

export function TrxTypePost(data){
  return service({
    url: '/account/inextype',
    method: 'POST',
    data
  })
}

export function inexUnpost(data){
  return service({
    url: '/account/inextrans/'+data,
    method: 'DELETE'
  })
}

export function stockInList(params){
	return service({
		url: '/account/stockin',
		method: 'GET',
		params
	})
}

export function stockInPost(data){
	return service({
		url: '/account/stockin',
		method: 'POST',
		data
	})
}

export function stockInUnpost(data){
	return service({
		url: '/account/stockin/'+data,
		method: 'DELETE'
	})
}

export function stockOutList(params){
	return service({
		url: '/account/stockout',
		method: 'GET',
		params
	})
}

export function stockOutPost(data){
	return service({
		url: '/account/stockout',
		method: 'POST',
		data
	})
}
