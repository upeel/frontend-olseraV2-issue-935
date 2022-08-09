import { featureAccessByUrlIds } from "./featureAccessByUrlIds"

/**
 * Level
 */
const planTypeLevel = [
  'L',
  'B',
  'F',
  'P'
]

/**
 * Names
 */
const planTypeName = [
  'Lite',
  'Basic',
  'Premium',
  'Pro'
]

/**
 * route list yang hide berdasarkan plan type
 */
const hiddenFeaturesByPlanType = {
  L: [
    '/attendance',
    '/attendance/employee',
    '/attendance/shift',
    '/attendance/presence',
    '/customersupplier',
    '/customersupplier/customer',
    '/customersupplier/customertype',
    '/transaction',
    '/transactiontype',
    '/promotions',
    '/promotions/sales',
    '/promotions/sales/create',
    '/promotions/coupon',
    '/promotions/coupon/create',
    '/promotions/promopos',
    '/promotions/promopos/create',
    '/online-order/working-hours',
    '/harga-ojek-online'
  ],
  B: [
    '/restomode',
    '/restomode/posrestolayout',
    '/restomode/posdisabledinein',
    '/restomode/posbilling',
    '/restomode/poslocalserver',
    '/restomode/courselinegrouping',
    '/settings/loyaltypoint',
    '/customersupplier/customerreview',
    '/customersupplier/supplier',
    '/purchase',
    '/purchase/openpurchase',
    '/purchase/openpurchase/create',
    '/purchase/completepurchase',
    '/purchase/cancelpurchase',
    '/specialtype/rawmaterial',
    '/inventory/stocksproduction',
    '/inventory/stocksproduction/create',
    '/website',
    '/website/mysite',
    '/website/mysite/global',
    '/website/mysite/navigation',
    '/website/mysite/customdomain',
    '/website/mysite/payment',
    '/website/pages',
    '/website/pages/static',
    '/website/pages/articles',
    '/website/pages/articles',
    '/website/pages/faqs',
    '/website/pages/testimonial',
    '/website/integrations',
    '/website/integrations/fbstore',
    '/website/integrations/fbsso',
    '/website/integrations/fbpixel',
    '/website/integrations/mailchimp',
    '/website/integrations/googleanalytics',
    '/website/integrations/chatwidget',
    '/kiosk',
    '/accounting-third',
    '/accounting-third/accounting-software',
    '/pos-settings/posemailreport',
    '/settings/store/storebranches',
    '/settings/shippings',
    '/settings/shippings/general',
    '/settings/shippings/postalcodes',
    '/inventory/stocksoutgoing/create?path=transfer',
    '/inventory/stocksalert'
  ],
  F: [
    '/accounting',
    '/accounting/setting',
    '/accounting/chartaccount',
    '/accounting/ledger',
    '/accounting/ledger/general-ledger',
    '/accounting/ledger/ledger',
    '/accounting/cash-bank',
    '/accounting/cash-bank/cash-bank-list',
    '/accounting/cash-bank/payment-map',
    '/accounting/cash-bank/bank-statement',
    '/accounting/cash-bank/bank-reconcile',
    '/accounting/cash-bank/bank-settlement',
    '/accounting/pos-transaction',
    '/accounting/pos-transaction/sales',
    '/accounting/pos-transaction/sales-return',
    '/accounting/pos-transaction/income',
    '/accounting/pos-transaction/income-trans-type',
    '/accounting/pos-transaction/expense',
    '/accounting/pos-transaction/expense-trans-type',
    '/accounting/receivable',
    '/accounting/receivable/receivable-list',
    '/accounting/receivable/customer-due-date',
    '/accounting/payable',
    '/accounting/payable/payable-list',
    '/accounting/payable/supplier-due-date',
    '/accounting/asset',
    '/accounting/expense',
    '/accounting/jurnal-log',
    '/accounting/report',
    '/accounting/report/income',
    '/accounting/closing'
  ],
  P: []
}

/**
 * feature name yang di hide berdasarkan plan type
 */
const hiddenFeatureNamesByPlanType = {
  L: [
    'product-import',
    'product-copy',
    'product-price-tier',
    'product-series',
    'product-related',
    'product-notes',
    'product-spec',
    'product-materials',
    '3rd-service-food-delivery',
  ],
  B: [
    'customer-loyaltypoint',
    'centralized_crm',
    'online-order-dinein',
    'online-order-takeaway',
  ],
  F: [
    'tokopedia-sales'
  ],
  P: [
    'omni-channel-tokopedia'
  ]
}

/**
 * configuration:
 * redirection and another action
 */
const confHiddenFeaturesByPlanType = {
  '/restomode/posrestolayout': {
    redirect: '/restomode/posdisabledinein'
  },
  '/customersupplier/customerreview': {
    redirect: '/customersupplier/customer'
  }
}

/**
 * check feature level by index
 * @param {*} planType
 * @returns Boolean
 */
function checkIndex(planType) {
  return planTypeLevel.indexOf(planType)
}

/**
 * karena menu yang hide di level atas, pasti akan hide di level bawahnya
 * @param {*} planType 
 * @returns 
 */
function getTheUpperType(planType) {
  if (
    checkIndex(planType) >= 0 &&
    checkIndex(planType) + 1 !== planTypeLevel.length) {
    return planTypeLevel[checkIndex(planType) + 1]
  } else {
    return planType
  }
}

/**
 * @desc function to check if it is hidden by route path
 * @param {*} planType String
 * @param {*} menu String
 * @returns Boolean
 */
function isHiddenByFeature(planType, routePath) {
  if (hiddenFeaturesByPlanType[getTheUpperType(planType)]) {
    const allHiddenFeatures = []
    planTypeLevel.map((item, key) => {
      if (key >= checkIndex(planType)) {
        allHiddenFeatures.push(...hiddenFeaturesByPlanType[item])
      }
    })
    // return (
    //   hiddenFeaturesByPlanType[getTheUpperType(planType)].includes(routePath) ||
    //   hiddenFeaturesByPlanType[planType].includes(routePath)
    // )
    return allHiddenFeatures.includes(routePath)
  } else {
    return false
  }
}

/**
 * @desc function to check if it is hidden by feature name
 * @param {*} planType String
 * @param {*} featureName String
 * @returns Boolean
 */
function isHiddenByFeatureName(planType, featureName) {
  const upperType = getTheUpperType(planType)
  if (hiddenFeatureNamesByPlanType[upperType]) {
    const allHiddenFeatures = []
    planTypeLevel.map((item, key) => {
      if (key >= checkIndex(planType)) {
        allHiddenFeatures.push(...hiddenFeatureNamesByPlanType[item])
      }
    })
    // console.log(allHiddenFeatures)
    // return (
    //   hiddenFeatureNamesByPlanType[upperType].includes(featureName) ||
    //   hiddenFeatureNamesByPlanType[planType].includes(featureName)
    // )
    return allHiddenFeatures.includes(featureName)
  } else {
    return false
  }
}

/**
 * 
 * @param {*} planType
 * @returns
 */
function getUpperLevelByRoute(planType) {
  try {
    return [...planTypeName].slice((checkIndex(planType) + 1), planTypeName.length)
  } catch (error) {
    return []
  }
}

/**
 * 
 * @param {*} planType
 * @returns
 */
function getUpperLevelIdsByRoute(planType) {
  try {
    return [...planTypeLevel].slice((checkIndex(planType) + 1), planTypeLevel.length)
  } catch (error) {
    return []
  }
}

/**
 * check if current package is upgradeable to selected TYPE or not
 * @param {*} params
 * @returns payload
 */
function isUpgradeableTo(currentPlanType, toPlanType) {
  const currentIndex = checkIndex(currentPlanType)
  const upgradeIndex = checkIndex(toPlanType)
  if (currentIndex < upgradeIndex) {
    return true
  } else if (currentIndex === upgradeIndex) {
    return false
  } else {
    return false
  }
}

/**
 *
 * @param {*} currentPlanType
 * @returns Array
 */
function getOtherPlanTypes(currentPlanType) {
  return planTypeLevel.filter(item => item !== currentPlanType && item !== 'L')
}

/**
 *
 * @param {*} routePath
 * @returns Array
 */
function getPlanTypeHasFeatureByRoute(routePath) {
  let planTypeHideThis = null
  const planTypeHaveThis = []
  // get plan type whose hide this
  planTypeLevel.map((planType) => {
    if (hiddenFeaturesByPlanType[planType].includes(routePath)) {
      planTypeHideThis = planType
    }
  })
  // get the upper level of the plan type whose hide this
  planTypeLevel.map((planType, planTypeKey) => {
    if (planTypeKey > checkIndex(planTypeHideThis)) {
      planTypeHaveThis.push(planType)
    }
  })
  return planTypeHaveThis
}

export {
  planTypeLevel,
  planTypeName,
  hiddenFeaturesByPlanType,
  featureAccessByUrlIds,
  confHiddenFeaturesByPlanType,
  isHiddenByFeature,
  isHiddenByFeatureName,
  getUpperLevelByRoute,
  getUpperLevelIdsByRoute,
  isUpgradeableTo,
  getOtherPlanTypes,
  getPlanTypeHasFeatureByRoute
}
