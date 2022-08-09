const mapMenus = {
  products: {
    'catalog/products': '/catalog/product',
    'catalog/productcombo': '/catalog/package',
    'catalog/lookbook': '/catalog/lookbook',
    'catalog/productgroups': '/catalog/product-group',
    'catalog/brands': '/catalog/product-brand',
    'catalog/collections': '/catalog/collection',
    'catalog/specifications': '/catalog/specification',
    'catalog/lookbookgroups': '/catalog/grouplookbook',
    'catalog/prodaddon': '/catalog/addon'
  },
  inventory: {
    'inventory/stockincomings': '/inventory/stocksincoming',
    'inventory/stocksoutgoings': '/inventory/stocksoutgoing',
    'inventory/productionsmode': '/inventory/stocksproduction',
    'inventory/stockopname': '/inventory/stocksopname',
    'inventory/stockmovement': '/inventory/stocksmovement',
    'inventory/emailstockalert': '/inventory/stocksalert'
  },
  specialType: {
    'catalog/featured': '/specialtype/featured',
    'catalog/newrelease': '/specialtype/newrelease',
    'catalog/sale': '/specialtype/sale',
    'catalog/popular': '/specialtype/popular',
    'catalog/outstock': '/specialtype/outstock',
    'catalog/preorder': '/specialtype/preorder',
    'catalog/rawmaterial': '/specialtype/rawmaterial'
  },
  customerSupplier: {
    'customer/customers': '/customersupplier/customer',
    'customer/customertypes': '/customersupplier/customertype',
    'customer/customerreviews': '/customersupplier/customerreview',
    'customer/suppliers': '/customersupplier/supplier'
  },
  salesOrder: {
    'sales/openorders': '/sales/openorder',
    'sales/closedorders': '/sales/completeorder',
    'sales/salesreturns': '/sales/returnorder',
    'sales/cancelledorders': '/sales/cancelorder'
  },
  purchase: {
    'purchase/openpurchases': '',
    'purchase/closedpurchases': '',
    'purchase/cancelledpurchases': '',
  },
  inex: {
    'inex/inextrans': '',
    'inex/inextranstype': '',
  },
  posSettings: {
    'settings/pospaymentmodes': '/pos-settings/pospaymentmodes',
    'settings/posdevices': '/pos-settings/posdevice',
    'settings/posreceiptnote': '/pos-settings/posreceiptnote',
    'settings/emailnotify': '/pos-settings/posemailreport',
    'settings/pospasskey': '/pos-settings/pospasskey',
    'settings/posextsetting': '/pos-settings/posextsetting',
    'settings/shiftsetting': '/pos-settings/shiftsetting',
    'settings/posstockmode': '/pos-settings/posstockmode',
    'settings/shifttime': '/pos-settings/shifttime',
    'settings/posqueue': '/pos-settings/postqueue'
  },
  reports: {
    'report/productreports': '/reports/products',
    'report/purchasereports': '/reports/purchases',
    'report/salesreports': '/reports/sales',
    'report/salesshiftreport': '/reports/shifts',
    'report/paymentreports': '/reports/payments',
    'report/multioutletrpt': '/reports/multioutlets',
    'report/attendance': '/reports/attendance'
  },
  marketingDiscount: {
    'promotion/discountsales': '/promotions/sales',
    'promotion/discountvoucher': '/promotions/coupon',
    'promotion/promopos': '/promotions/promopos'
  },
  websiteMySite: {
    'website/mysite': '/website/mysite/global',
    'website/sitenav': '/website/mysite/navigation',
    'website/usemydomain': '/website/mysite/customdomain',
    'settings/paymentmodes': '/website/mysite/payment',
    'website/storestockrefs': '/website/mysite/mergestocks'
  },
  websitePages: {
    'website/pages': '/website/pages/static',
    'website/articles': '/website/pages/articles',
    'website/faqs': '/website/pages/faqs',
    'website/testimonial': '/website/pages/testimonial',
  },
  websiteIntegrations: {
    'website/fbstore': '/website/integrations/fbstore',
    'website/facebooksso': '/website/integrations/fbsso',
    'website/facebookpixel': '/website/integrations/fbpixel',
    'website/mailchimp': '/website/integrations/mailchimp',
    'website/googleanalytics': '/website/integrations/googleanalytics',
    'website/chatwidget': '/website/integrations/chatwidget',
  },
  storeSettings: {
    'account/staffs': '/settings/store/staffs',
    'settings/generalsetting': '/settings/store/general',
    'settings/storebranches': '/settings/store/storebranches',
    'settings/storecurrency': '/settings/store/storecurrency',
  }
}

export {
  mapMenus
}
