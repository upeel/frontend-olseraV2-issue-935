import Vue from 'vue'
import Router from 'vue-router'
// import store from './store'
Vue.use(Router)

// import Dashboard from './components/Dashboard.vue'
// import DashboardV2 from './components/DashboardV2.vue'
// import Login from './components/Login.vue'
// import Signup from './components/Signup.vue'
// import SelectStore from './components/SelectStore.vue'
// import ExtendStore from './components/ExtendStore.vue'
// import WebviewDownloading from './components/WebviewDownloading.vue'
// import WebviewLogin from './components/modules/webview/Login.vue'
// import Scan from './components/modules/_views/attendance/scan.vue'
// import ResetPassword from './components/ResetPassword.vue'

export const asyncRouterMap = [
  {
    path: '/',
    redirect: 'whatsnew',
    name: 'Home',
    component: () => import('./components/DashboardV2'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('./components/modules/dashboard/Index'),
        localization_key: 'dashboard'
      },
      {
        path: 'catalog',
        name: 'Product Catalog',
        component: () => import('modules/_views/catalog/products/Index'),
        redirect: 'catalog/product',
        localization_key: 'product_catalog',
        meta: {
          roles_except: ['RP', 'SA']
        },
        children: [
          {
            path: 'product',
            name: 'Products',
            component: () => import('modules/_views/catalog/products/product/Index'),
            localization_key: 'products',
            meta: {
              roles_except: ['PT', 'LW'],
              persistent_param: true
            }
          },
          {
            path: 'product/create',
            name: 'Product Create',
            component: () => import('modules/_views/catalog/products/product/create/ProductCreate'),
            localization_key: 'product_create',
            meta: {
              roles_except: ['PT', 'LW']
            }
          },
          {
            path: 'product/:id&:copy/copy',
            name: 'Product Copy',
            component: () => import('modules/_views/catalog/products/product/create/ProductCreate'),
            localization_key: 'product_copy',
            meta: {
              roles_except: ['PT', 'LW']
            }
          },
          {
            path: 'product/:id',
            name: 'Product Detail',
            component: () => import('modules/_views/catalog/products/product/detail/ProductDetail'),
            hidden: true,
            localization_key: 'product_detail',
            meta: {
              roles_except: ['PT', 'LW']
            }
          },
          {
            path: 'product-group',
            name: 'Product Group',
            component: () => import('modules/_views/catalog/products/group/Index'),
            localization_key: 'product_groups',
            meta: {
              roles_except: ['PT', 'LW']
            }
          },
          {
            path: 'product-brand',
            name: 'Product Brand',
            component: () => import('modules/_views/catalog/products/brand/Index'),
            localization_key: 'product_brands',
            meta: {
              premium: true,
              freemiumRedirect: '/catalog/freemium',
              roles_except: ['PT', 'LW']
            }
          },
          {
            path: 'collection',
            name: 'Collection',
            component: () => import('modules/_views/catalog/products/collection/Index'),
            localization_key: 'collections'
          },
          {
            path: 'specification',
            name: 'Product Specification',
            component: () => import('modules/_views/catalog/products/specification/Index'),
            localization_key: 'product_specification'
          },
          {
            path: 'package',
            name: 'Product Package',
            component: () => import('modules/_views/catalog/products/package/Index'),
            localization_key: 'product_package',
            meta: {
              persistent_param: true
            }
          },
          {
            path: 'lookbook',
            name: 'Lookbook',
            component: () => import('modules/_views/catalog/products/lookbook/Index'),
            localization_key: 'lookbook'
          },
          {
            path: 'grouplookbook',
            name: 'Group Lookbook',
            component: () => import('modules/_views/catalog/products/grouplookbook/Index'),
            localization_key: 'group_lookbook'
          },
          {
            path: 'addon',
            name: 'Product Addon',
            component: () => import('modules/_views/catalog/products/addon/Index'),
            localization_key: 'product_addon',
            meta: {
              premium: true,
              freemiumRedirect: '/catalog/freemium'
            }
          },
          {
            path: 'addon/create',
            name: 'Create Product Addon',
            component: () => import('modules/_views/catalog/products/addon/Form'),
            localization_key: 'product_addon_create',
            meta: {
              premium: true
            }
          },
          {
            path: 'addon/:id',
            name: 'Product Addon Detail',
            hidden: true,
            component: () => import('modules/_views/catalog/products/addon/Form'),
            localization_key: 'product_addon_detail',
            meta: {
              premium: true
            }
          },
          {
            path: 'freemium',
            name: 'Freemium',
            props: { tabs: 1 },
            component: () => import('@/components/FreemiumBanner'),
            localization_key: 'freemium',
            meta: {
              freemiumRedirect: '/catalog'
            }
          },
        ]
      },
      {
        path: 'catalog/package/create',
        name: 'Create Package',
        component: () => import('modules/_views/catalog/products/package/create/Index'),
        localization_key: 'product_package_create'
      },
      {
        path: 'catalog/package/:id',
        name: 'Package Detail',
        hidden: true,
        component: () => import('modules/_views/catalog/products/package/detail/Index'),
        localization_key: 'product_package_detail'
      },
      
      {
        path: 'catalog/package/:id&:copy/copy',
        name: 'Package Copy',
        component: () => import('modules/_views/catalog/products/package/create/Index'),
        localization_key: 'product_package_copy'
      },
      {
        path: 'catalog/lookbook/create',
        name: 'Create Lookbook',
        component: () => import('modules/_views/catalog/products/lookbook/create/Index'),
        localization_key: 'lookbook_create'
      },
      {
        path: 'catalog/lookbook/:id',
        name: 'Lookbook Detail',
        hidden: true,
        component: () => import('modules/_views/catalog/products/lookbook/detail/Index'),
        localization_key: 'lookbook_detail'
      },
      {
        path: 'inventory',
        name: 'Inventory',
        component: () => import('modules/_views/catalog/inventory/Index'),
        redirect: 'inventory/stocksincoming',
        localization_key: 'inventory',
        children: [
          {
            path: 'stocksincoming',
            name: 'Stocks Incoming',
            component: () => import('modules/_views/catalog/inventory/stocksincoming/Index'),
            localization_key: 'stock_incoming'
          },
          {
            path: 'stocksincoming/create',
            name: 'Create Stocks Incoming',
            component: () => import('modules/_views/catalog/inventory/stocksincoming/Form'),
            localization_key: 'stock_incoming_create'
          },
          {
            path: 'stocksoutgoing',
            name: 'Stocks Outgoing',
            component: () => import('modules/_views/catalog/inventory/stocksoutgoing/Index'),
            localization_key: 'stock_outgoing',
            meta: {
              premium: true,
              freemiumRedirect: '/inventory/freemium'
            }
          },
          {
            path: 'stocksoutgoing/create',
            name: 'Create Stocks Outgoing',
            component: () => import('modules/_views/catalog/inventory/stocksoutgoing/Form'),
            localization_key: 'stock_outgoing_create',
            meta: {
              premium: true,
              freemiumRedirect: '/inventory/freemium'
            }
          },
          {
            path: 'stocksopname',
            name: 'Stocks Opname',
            component: () => import('modules/_views/catalog/inventory/stocksopname/Index'),
            localization_key: 'stock_opname'
          },
          {
            path: 'stocksopname/create',
            name: 'Create Stocks Opname',
            component: () => import('modules/_views/catalog/inventory/stocksopname/Form'),
            localization_key: 'stock_opname_create'
          },
          {
            path: 'stocksmovement',
            name: 'Stocks Movement',
            component: () => import('modules/_views/catalog/inventory/stocksmovement/Index'),
            localization_key: 'stock_movement'
          },
          {
            path: 'stocksproduction',
            name: 'Stocks Production',
            component: () => import('modules/_views/catalog/inventory/stocksproduction/Index'),
            localization_key: 'stock_production',
            meta: {
              premium: true,
              freemiumRedirect: '/inventory/freemium'
            }
          },
          {
            path: 'stocksproduction/create',
            name: 'Create Stocks Production',
            component: () => import('modules/_views/catalog/inventory/stocksproduction/Form'),
            localization_key: 'stock_production_create',
            meta: {
              premium: true,
              freemiumRedirect: '/inventory/freemium'
            }
          },
          {
            path: 'stocksalert',
            name: 'Alert Stocks',
            component: () => import('modules/_views/catalog/inventory/alertstocks/Index'),
            localization_key: 'alert_stock',
            meta: {
              premium: true,
              freemiumRedirect: '/inventory/freemium'
            }
          },
          {
            path: 'stocksincoming/:id',
            name: 'Stocks Incoming - Detail',
            component: () => import('modules/_views/catalog/inventory/stocksincoming/Detail'),
            hidden: true,
            localization_key: 'stock_incoming_detail',
            meta: {
              detail: true,
              pathDirect: '/inventory'
            }
          },
          {
            path: 'stocksoutgoing/:id',
            name: 'Stocks Outgoing - Detail',
            component: () => import('modules/_views/catalog/inventory/stocksoutgoing/Detail'),
            hidden: true,
            localization_key: 'stock_outgoing_detail',
            meta: {
              premium: true,
              freemiumRedirect: '/inventory/freemium',
              detail: true,
              pathDirect: '/inventory'
            }
          },
          {
            path: 'stocksopname/:id',
            name: 'Stocks Opname - Detail',
            component: () => import('modules/_views/catalog/inventory/stocksopname/Detail'),
            hidden: true,
            localization_key: 'stock_opname_detail'
          },
          {
            path: 'stocksproduction/:id',
            name: 'Stocks Production - Detail',
            component: () => import('modules/_views/catalog/inventory/stocksproduction/Detail'),
            hidden: true,
            localization_key: 'stock_production_detail',
            meta: {
              premium: true,
              freemiumRedirect: '/inventory/freemium'
            }
          },
          {
            path: 'freemium',
            name: 'Freemium',
            props: { tabs: 1 },
            component: () => import('@/components/FreemiumBanner'),
            localization_key: 'freemium',
            meta: {
              freemiumRedirect: '/inventory'
            }
          },
        ]
      },
      {
        path: 'specialtype',
        name: 'Special Type',
        component: () => import('modules/_views/catalog/specialtype/Index'),
        redirect: 'specialtype/featured',
        localization_key: 'special_type',
        meta: {
          roles_except: ['SS', 'PT', 'LW']
        },
        children: [
          {
            path: 'featured',
            name: 'Featured',
            component: () => import('modules/_views/catalog/specialtype/featured/Index'),
            localization_key: 'featured'
          },
          {
            path: 'newrelease',
            name: 'newrelease',
            component: () => import('modules/_views/catalog/specialtype/newrelease/Index'),
            localization_key: 'newrelease'
          },
          {
            path: 'outstock',
            name: 'outstock',
            component: () => import('modules/_views/catalog/specialtype/outstock/Index'),
            localization_key: 'outstock'
          },
          {
            path: 'popular',
            name: 'popular',
            component: () => import('modules/_views/catalog/specialtype/popular/Index'),
            localization_key: 'popular'
          },
          {
            path: 'preorder',
            name: 'preorder',
            component: () => import('modules/_views/catalog/specialtype/preorder/Index'),
            localization_key: 'preorder'
          },
          {
            path: 'rawmaterial',
            name: 'rawmaterial',
            component: () => import('modules/_views/catalog/specialtype/rawmaterial/Index'),
            localization_key: 'rawmaterial',
            meta: {
              premium: true,
              freemiumRedirect: '/specialtype/freemium'
            }
          },
          {
            path: 'sale',
            name: 'sale',
            component: () => import('modules/_views/catalog/specialtype/sale/Index'),
            localization_key: 'sale'
          },
          {
            path: 'freemium',
            name: 'Freemium',
            props: { tabs: 1 },
            component: () => import('@/components/FreemiumBanner'),
            localization_key: 'freemium'
          },
        ]
      },
      {
        path: 'catalog/barcode',
        name: 'Print Barcode Product',
        component: () => import('modules/_views/catalog/barcode/Index'),
        localization_key: 'print_barcode',
        meta: {
          premium: true,
          freemiumRedirect: '/freemium'
        }
      },
      {
        path: 'freemium',
        name: 'Freemium',
        component: () => import('@/components/FreemiumBanner'),
        localization_key: 'freemium',
        meta: {
          freemiumRedirect: '/dashboard'
        }
      },
      {
        path: 'sales',
        name: 'Sales',
        redirect: 'sales/openorder',
        component: () => import('modules/_views/sales/Index'),
        localization_key: 'sales',
        children: [{
          path: 'openorder',
          name: 'Open Order List',
          component: () => import('modules/_views/sales/openorder/OpenOrderListV2'),
          props: { tabs: 1 },
          localization_key: 'openorder',
          meta: {
            persistent_param: true,
            premium: true,
            freemiumRedirect: '/sales/freemium'
          }
        },
        {
          path: 'openorder/create',
          name: 'Open Order Create',
          component: () => import('modules/_views/sales/openorder/create/OpenOrderCreate'),
          localization_key: 'openorder_create',
          meta: {
            premium: true,
            freemiumRedirect: '/sales/freemium'
          }
        },
        {
          path: 'openorder/:id',
          name: 'Open Order Detail',
          component: () => import('modules/_views/sales/DetailOrder'),
          hidden: true,
          localization_key: 'openorder_detail',
          meta: {
            premium: true,
            freemiumRedirect: '/sales/freemium'
          }
        },
        {
          path: 'completeorder',
          name: 'Complete Order List',
          component: () => import('modules/_views/sales/complete-order/CompleteOrderList'),
          localization_key: 'completed_order'
        },
        {
          path: 'completeorder/:id',
          name: 'Complete Order Detail',
          component: () => import('modules/_views/sales/DetailOrder'),
          hidden: true,
          localization_key: 'completed_order_detail'
        },
        {
          path: 'returnorder',
          name: 'Return Order List',
          component: () => import('modules/_views/sales/return-order/ReturnOrderList'),
          localization_key: 'salesreturn',
          meta: {
            premium: true,
            freemiumRedirect: '/sales/completeorder'
          }
        },
        {
          path: 'returnorder/create',
          name: 'Return Order Create',
          component: () => import('modules/_views/sales/return-order/create/ReturnOrderCreate'),
          localization_key: 'salesreturn_create',
          meta: {
            premium: true,
            freemiumRedirect: '/sales/completeorder'
          }
        },
        {
          path: 'returnorder/:id',
          name: 'Return Order Detail',
          component: () => import('modules/_views/sales/return-order/detail/ReturnOrderDetail'),
          hidden: true,
          localization_key: 'salesreturn_detail',
          meta: {
            premium: true,
            freemiumRedirect: '/sales/completeorder'
          }
        },
        {
          path: 'cancelorder',
          name: 'Cancel Order List',
          component: () => import('modules/_views/sales/cancel-order/CancelOrderList'),
          localization_key: 'cancelorder'
        },

        {
          path: 'cancelorder/:id',
          name: 'Cancel Order Detail',
          component: () => import('modules/_views/sales/cancel-order/detail/CancelOrderDetail'),
          hidden: true,
          localization_key: 'cancelorder_detail'
        },
        {
          path: 'freemium',
          name: 'Freemium',
          props: { tabs: 1 },
          component: () => import('@/components/FreemiumBanner'),
          localization_key: 'freemium'
        },
        ]
      },
      {
        path: 'promotions',
        name: 'Promotions',
        redirect: 'promotions/sales',
        component: () => import('modules/_views/promotions/Index'),
        localization_key: 'promotions',
        meta: {
          label: 'Marketing',
          roles_except: ['RP', 'PT', 'LW', 'SA', 'SS']
        },
        children: [
          {
            path: 'sales',
            name: 'Sales Discount',
            component: () => import('modules/_views/promotions/sales/Index'),
            localization_key: 'sales_discount',
            meta: {
              premium: true,
              freemiumRedirect: '/freemium'
            }
          },
          {
            path: 'sales/create',
            name: 'Create Sales Discount',
            component: () => import('modules/_views/promotions/sales/Create'),
            localization_key: 'sales_discount_create',
            meta: {
              premium: true,
              freemiumRedirect: '/freemium'
            }
          },
          {
            path: 'sales/:id',
            name: 'Sales Discount Detail',
            component: () => import('modules/_views/promotions/sales/Detail'),
            hidden: true,
            localization_key: 'sales_discount_detail',
            meta: {
              premium: true,
              freemiumRedirect: '/freemium'
            }
          },
          {
            path: 'coupon',
            name: 'Coupon Discount',
            component: () => import('modules/_views/promotions/coupon/Index'),
            localization_key: 'coupon_discount',
            meta: {
              premium: true,
              freemiumRedirect: '/freemium'
            }
          },
          {
            path: 'coupon/create',
            name: 'Create Coupon Discount',
            component: () => import('modules/_views/promotions/coupon/Create'),
            localization_key: 'coupon_discount_create',
            meta: {
              premium: true,
              freemiumRedirect: '/freemium'
            }
          },
          {
            path: 'coupon/:id',
            name: 'Coupon Discount Detail',
            component: () => import('modules/_views/promotions/coupon/Detail'),
            hidden: true,
            localization_key: 'coupon_discount_detail',
            meta: {
              premium: true,
              freemiumRedirect: '/freemium'
            }
          },
          {
            path: 'promopos',
            name: 'POS Promotion',
            component: () => import('modules/_views/promotions/pos/Index'),
            localization_key: 'pos_promotion',
            meta: {
              premium: true,
              freemiumRedirect: '/freemium'
            }
          },
          {
            path: 'promopos/create',
            name: 'Create Promo (POS) Discount',
            component: () => import('modules/_views/promotions/pos/Create'),
            localization_key: 'pos_promotion_create',
            meta: {
              premium: true,
              freemiumRedirect: '/freemium'
            }
          },
          {
            path: 'promopos/:id',
            name: 'Promo (POS) Discount Detail',
            component: () => import('modules/_views/promotions/pos/Detail'),
            localization_key: 'pos_promotion_detail',
            meta: {
              premium: true,
              freemiumRedirect: '/freemium'
            }
          },
          {
            path: 'freemium',
            name: 'Freemium',
            props: { tabs: 1 },
            component: () => import('@/components/FreemiumBanner'),
            localization_key: 'freemium'
          },
        ]
      },
      {
        path: 'accounting',
        name: 'Accounting',
        redirect: 'accounting/chartaccount',
        component: () => import('modules/_views/accounting/Index'),
        localization_key: 'accounting',
        children: [
          {
            path: 'add-multi-jurnal',
            name: 'Add Multi Jurnal',
            component: () => import('modules/_views/accounting/formAddMultiJurnal'),
            localization_key: 'add_multi_jurnal'
          },
          {
            path: 'edit-multi-jurnal',
            name: 'Edit Multi Jurnal',
            component: () => import('modules/_views/accounting/formEditMultiJurnal'),
            localization_key: 'edit_multi_jurnal'
          },
          {
            path: 'chartaccount',
            name: 'List Of Accounts',
            component: () => import('modules/_views/accounting/chart-of-account/Index'),
            localization_key: 'chartaccount'
          },
          {
            path: 'chartaccount/detail',
            name: 'Chart Of Account - Detail',
            component: () => import('modules/_views/accounting/chart-of-account/detail'),
            localization_key: 'chartaccount_detail'
          },
          {
            path: 'cash-bank',
            name: 'Cash & Bank',
            redirect: 'cash-bank/cash-bank-list',
            component: () => import('modules/_views/accounting/cash-n-bank/index'),
            localization_key: 'cashbank',
            children: [
              {
                path: 'cash-bank-list',
                name: 'Cash & Bank List',
                component: () => import('modules/_views/accounting/cash-n-bank/cashBankList'),
                localization_key: 'cashbank_list'
              },
              {
                path: 'payment-map',
                name: 'Payment Map',
                component: () => import('modules/_views/accounting/cash-n-bank/payment-map'),
                localization_key: 'payment_map'
              },
              {
                path: 'bank-settlement',
                name: 'Bank Settlement',
                component: () => import('modules/_views/accounting/cash-n-bank/bankSettlement'),
                localization_key: 'bank_settlement'
              },
              {
                path: 'bank-statement',
                name: 'Bank Statement',
                component: () => import('modules/_views/accounting/cash-n-bank/bankStatement'),
                localization_key: 'bank_statement'
              },
              {
                path: 'bank-reconcile',
                name: 'Bank Reconcile',
                component: () => import('modules/_views/accounting/cash-n-bank/bankReconcile'),
                localization_key: 'bank_reconcile'
              },
              {
                path: 'detail',
                name: 'Cash & Bank - Detail',
                component: () => import('modules/_views/accounting/cash-n-bank/detail'),
                localization_key: 'cashbank_detail'
              },
            ]
          },

          {
            path: 'receivable',
            name: 'Receivable',
            redirect: 'receivable/receivable-list',
            component: () => import('modules/_views/accounting/receivable/index'),
            localization_key: 'receivable',
            children: [
              {
                path: 'receivable-list',
                name: 'Receivable List',
                component: () => import('modules/_views/accounting/receivable/receivableList'),
                localization_key: 'payable_list'
              },
              {
                path: 'customer-due-date',
                name: 'Customer Due Date',
                component: () => import('modules/_views/accounting/receivable/customer-due-date'),
                localization_key: 'customer_due_date'
              },
              {
                path: 'detail',
                name: 'Receivable Detail',
                component: () => import('modules/_views/accounting/receivable/detail'),
                localization_key: 'receivable_detail'
              }
            ]
          },
          
          {
            path: 'payable',
            name: 'Payable',
            redirect: 'payable/payable-list',
            component: () => import('modules/_views/accounting/payable/index'),
            localization_key: 'payable',
            children: [
              {
                path: 'payable-list',
                name: 'Payable List',
                component: () => import('modules/_views/accounting/payable/payableList'),
                localization_key: 'payable_list'
              },
              {
                path: 'supplier-due-date',
                name: 'Supplier Due Date',
                component: () => import('modules/_views/accounting/payable/supplier-due-date'),
                localization_key: 'supplier_due_date'
              },
              {
                path: 'detail',
                name: 'Payable Detail',
                component: () => import('modules/_views/accounting/payable/detail'),
                localization_key: 'payable_detail'
              }
            ]
          },
          {
            path: 'asset',
            name: 'Asset',
            component: () => import('modules/_views/accounting/asset/index'),
            localization_key: 'asset',
          },
          {
            path: 'asset-depreciation/:id',
            name: 'Asset Depreciation Detail',
            component: () => import('modules/_views/accounting/asset/detailDepreciation'),
            localization_key: 'asset_depreciation_detail'
          },
          {
            path: 'expense',
            name: 'Expense',
            component: () => import('modules/_views/accounting/expense/index'),
            localization_key: 'expense'
          },
          {
            path: 'expense/detail',
            name: 'Expense - Detail',
            component: () => import('modules/_views/accounting/expense/detail'),
            localization_key: 'expense_detail'
          },
          {
            path: 'closing',
            name: 'Closing',
            component: () => import('modules/_views/accounting/closing/index'),
            localization_key: 'closing'
          },
          {
            path: 'ledger',
            name: 'Ledger',
            redirect: 'ledger/general-ledger',
            component: () => import('modules/_views/accounting/ledger/index'),
            localization_key: 'audit_accounting',
            children: [
              {
                path: 'general-ledger',
                name: 'General Ledger',
                component: () => import('modules/_views/accounting/ledger/generalLedger'),
                localization_key: 'general_ledger'
              },
              {
                path: 'ledger',
                name: 'Ledger',
                component: () => import('modules/_views/accounting/ledger/ledger'),
                localization_key: 'ledger'
              }
            ]
          },
          {
            path: 'jurnal-log',
            name: 'Accounting Jurnal Log',
            component: () => import('modules/_views/accounting/jurnal-log/index'),
            localization_key: 'accounting_jurnal_log'
          },
          {
            path: 'report',
            name: 'Report',
            redirect: 'report/income',
            component: () => import('modules/_views/accounting/report-accounting/index'),
            localization_key: 'report_accounting',
            children: [
              {
                path: 'detail',
                name: 'Accounting Report - Detail',
                component: () => import('modules/_views/accounting/report-accounting/detail'),
                localization_key: 'accounting_report_detail'
              },
              {
                path: 'income',
                name: 'Income Statement',
                component: () => import('modules/_views/accounting/report-accounting/income/index'),
                localization_key: 'report/income'
              },
              {
                path: 'capital',
                name: 'Capital Statement',
                component: () => import('modules/_views/accounting/report-accounting/capital/index'),
                localization_key: 'report/capital'
              },
              {
                path: 'cash-flow',
                name: 'Cash Flow Statement',
                component: () => import('modules/_views/accounting/report-accounting/cash-flow/index'),
                localization_key: 'report/cash-flow'
              },
              {
                  path: 'cash-flow-detail',
                  name: 'Cash Flow Statement - Detail',
                  component: () => import('modules/_views/accounting/report-accounting/cash-flow/detail'),
                  localization_key: 'accounting_report_detail_cash_flow'
                },
              {
                path: 'balance-sheet',
                name: 'Balance Sheet',
                component: () => import('modules/_views/accounting/report-accounting/balance-sheet/index'),
                localization_key: 'report/balance-sheet'
              },
              {
                path: 'report_form_balance_sheet',
                name: 'Report Form Balance Sheet',
                component: () => import('modules/_views/accounting/report-accounting/report-form-balance/index'),
                localization_key: 'report/report-form-balance-sheet'
              }
            ]
          },
          {
            path: 'accounting-stockOpname',
            name: 'Accounting Stock Opname',
            component: () => import('modules/_views/accounting/stockOpname'),
            localization_key: 'accounting-stockOpname'
          },
          {
            path: 'setting',
            name: 'Setting',
            component: () => import('modules/_views/accounting/setting-accounting/reset'),
            localization_key: 'setting_accounting',
          }
        ]
      },
      {
        path: 'accounting-third',
        name: 'Accounting 3rd Party',
        redirect: 'accounting-third/accounting-software',
        component: () => import('modules/_views/accounting/Index'),
        localization_key: 'external_link',
        children: [
          {
            path: 'accounting-software',
            name: 'Accounting Software',
            component: () => import('modules/_views/accounting/accounting-software/index'),
            localization_key: 'accounting_software',
          },
          {
            path: 'jurnal/saveToken',
            name: 'Save Token',
            component: () => import('modules/_views/accounting/accounting-software/jurnal/saveToken'),
            props: (route) => ({ access_token: route.query.access_token }),
            localization_key: 'jurnal_save_token'
          },
          {
            path: 'jurnalNew',
            name: 'Integrate Jurnal.ID',
            component: () => import('modules/_views/accounting/accounting-software/jurnal/index'),
            localization_key: 'link_jurnal',
          },
          {
            path: 'export-to-sales/detail',
            name: 'Jurnal Upload Sales Detail',
            component: () => import('modules/_views/accounting/accounting-software/jurnal/penjualan/DetailSales'),
            localization_key: 'jurnal_upload_sales_detail',
          },
          {
            path: 'export-to-purchase/detail',
            name: 'Jurnal Upload Purchase Detail',
            component: () => import('modules/_views/accounting/accounting-software/jurnal/pembelian/DetailPurchase'),
            localization_key: 'jurnal_upload_purchase_detail',
          }
        ]
      },
      {
        path: 'website',
        name: 'Website',
        redirect: 'website/mysite',
        component: () => import('modules/_views/website/Index'),
        localization_key: 'website',
        children: [
          {
            path: 'mysite',
            name: 'My Site',
            component: () => import('modules/_views/website/mysite/Index'),
            redirect: 'mysite/global',
            localization_key: 'mysite',
            children: [
              {
                path: 'global',
                name: 'Global',
                component: () => import('modules/_views/website/mysite/global/Index'),
                localization_key: 'global',
                meta: {
                  premium: true,
                  freemiumRedirect: '/freemium'
                }
              },
              {
                path: 'payment',
                name: 'OL Payment',
                component: () => import('modules/_views/website/mysite/payment/Index'),
                localization_key: 'payment_online',
                meta: {
                  premium: true,
                  freemiumRedirect: '/freemium'
                }
              },
              {
                path: 'navigation',
                name: 'Site Navigation',
                component: () => import('modules/_views/website/mysite/navigation/Index'),
                localization_key: 'site_navigation',
                meta: {
                  premium: true,
                  freemiumRedirect: '/freemium'
                }
              },
              {
                path: 'customdomain',
                name: 'My Domain',
                component: () => import('modules/_views/website/mysite/customdomain/Index'),
                localization_key: 'mydomain',
                meta: {
                  premium: true,
                  freemiumRedirect: '/freemium'
                }
              },
              {
                path: 'mergestocks',
                name: 'Merge Stocks',
                component: () => import('modules/_views/website/mysite/mergestocks/Index'),
                localization_key: 'merge_stock',
                meta: {
                  premium: true,
                  freemiumRedirect: '/freemium'
                }
              }
            ]
          },
          {
            path: 'integrations',
            name: '3rd Party integrations',
            component: () => import('modules/_views/website/integrations/Index'),
            redirect: 'integrations/fbstore',
            localization_key: 'third_party_integration',
            children: [
              {
                path: 'fbstore',
                name: 'Facebook Store',
                component: () => import('modules/_views/website/integrations/fbstore/Index'),
                localization_key: 'fb_store',
                meta: {
                  premium: true,
                  freemiumRedirect: '/freemium'
                }
              },
              {
                path: 'fbpixel',
                name: 'Facebook Pixel',
                component: () => import('modules/_views/website/integrations/fbpixel/Index'),
                localization_key: 'fb_pixel',
                meta: {
                  premium: true,
                  freemiumRedirect: '/freemium'
                }
              },
              {
                path: 'fbsso',
                name: 'Facebook SSO',
                component: () => import('modules/_views/website/integrations/fbsso/Index'),
                localization_key: 'fb_sso',
                meta: {
                  premium: true,
                  freemiumRedirect: '/freemium'
                }
              },
              {
                path: 'googleanalytics',
                name: 'Google Analytics',
                component: () => import('modules/_views/website/integrations/googleanalytics/Index'),
                localization_key: 'google_analytics',
                meta: {
                  premium: true,
                  freemiumRedirect: '/freemium'
                }
              },
              {
                path: 'mailchimp',
                name: 'Mailchimp',
                component: () => import('modules/_views/website/integrations/mailchimp/Index'),
                localization_key: 'mailchimp',
                meta: {
                  premium: true,
                  freemiumRedirect: '/freemium'
                }
              },
              {
                path: 'chatwidget',
                name: 'Chat Widget',
                component: () => import('modules/_views/website/integrations/chatwidget/Index'),
                localization_key: 'chatwidget',
                meta: {
                  premium: true,
                  freemiumRedirect: '/freemium'
                }
              }
            ]
          },
          {
            path: 'pages',
            name: 'Pages & Articles',
            component: () => import('modules/_views/website/pages/Index'),
            redirect: 'pages/static',
            localization_key: 'pages_and_articles',
            children: [
              {
                path: 'static',
                name: 'Static Pages',
                component: () => import('modules/_views/website/pages/static/Index'),
                localization_key: 'page_static',
                meta: {
                  premium: true,
                  freemiumRedirect: '/freemium'
                }
              },
              {
                path: 'articles',
                name: 'Article Pages',
                component: () => import('modules/_views/website/pages/articles/Index'),
                localization_key: 'page_article',
                meta: {
                  premium: true,
                  freemiumRedirect: '/freemium'
                }
              },
              {
                path: 'faqs',
                name: 'Faq Pages',
                component: () => import('modules/_views/website/pages/faqs/Index'),
                localization_key: 'page_faq',
                meta: {
                  premium: true,
                  freemiumRedirect: '/freemium'
                }
              },
              {
                path: 'testimonial',
                name: 'Testimonial Pages',
                component: () => import('modules/_views/website/pages/testimonial/Index'),
                localization_key: 'page_testimonial',
                meta: {
                  premium: true,
                  freemiumRedirect: '/freemium'
                }
              }
            ]
          },
          {
            path: 'reseller',
            name: 'Reseller',
            component: () => import('modules/_views/website/reseller/Index'),
            redirect: 'reseller/resellers',
            localization_key: 'resellers',
            children: [
              {
                path: 'resellers',
                name: 'Resellers',
                component: () => import('modules/_views/website/reseller/resellers/Index'),
                localization_key: 'resellers_list'
              },
              {
                path: 'resellertypes',
                name: 'Reseller Types',
                component: () => import('modules/_views/website/reseller/resellertypes/Index'),
                localization_key: 'reseller_types'
              },
              {
                path: 'resellertypes/:id',
                name: 'Reseller Types Detail',
                component: () => import('modules/_views/website/reseller/resellertypes/TableGroups'),
                hidden: true,
                localization_key: 'reseller_type_detail'
              }
            ]
          }
        ]
      },
      {
        path: 'customersupplier',
        name: 'Customer Supplier',
        redirect: 'customersupplier/customer',
        component: () => import('modules/_views/customer-supplier/Index'),
        localization_key: 'customer_and_supplier',
        children: [
          {
            path: 'customer',
            name: 'Customer',
            component: () => import('modules/_views/customer-supplier/customer/CustomerList'),
            localization_key: 'customers',
            meta: {
              premium: true,
              freemiumRedirect: '/freemium'
            }
          },
          {
            path: 'customer/:id',
            name: 'Customer Detail',
            component: () => import('modules/_views/customer-supplier/customer/detail/CustomerDetail'),
            hidden: true,
            localization_key: 'customer_detail',
            meta: {
              premium: true,
              freemiumRedirect: '/freemium'
            }
          },
          {
            path: 'customerreview',
            name: 'Customer Review',
            component: () => import('modules/_views/customer-supplier/customer-review/CustomerReviewList'),
            localization_key: 'customer_reviews',
            meta: {
              premium: true,
              freemiumRedirect: '/freemium'
            }
          },
          {
            path: 'customertype',
            name: 'Customer Type',
            component: () => import('modules/_views/customer-supplier/customer-type/CustomerTypeList'),
            localization_key: 'customer_types',
            meta: {
              premium: true,
              freemiumRedirect: '/freemium'
            }
          },
          {
            path: 'supplier',
            name: 'Supplier',
            component: () => import('modules/_views/customer-supplier/supplier/SupplierList'),
            localization_key: 'suppliers',
            meta: {
              premium: true,
              freemiumRedirect: '/freemium'
            }
          },
          {
            path: 'supplier/create',
            name: 'Supplier Create',
            component: () => import('modules/_views/customer-supplier/supplier/create/SupplierCreate'),
            localization_key: 'supplier_create',
            meta: {
              premium: true,
              freemiumRedirect: '/freemium'
            }
          },
          {
            path: 'supplier/:id',
            name: 'Supplier Detail',
            component: () => import('modules/_views/customer-supplier/supplier/detail/SupplierDetail'),
            hidden: true,
            localization_key: 'supplier_detail',
            meta: {
              premium: true,
              freemiumRedirect: '/freemium'
            }
          }
        ]
      },
      {
        path: 'purchase',
        name: 'Purchase',
        redirect: 'purchase/openpurchase',
        component: () => import('modules/_views/purchase/Index'),
        localization_key: 'purchases_list',
        children: [
          {
            path: 'openpurchase',
            name: 'Open Purchase',
            component: () => import('modules/_views/purchase/open/OpenList'),
            localization_key: 'open_purchases',
            meta: {
              premium: true,
              freemiumRedirect: '/freemium'
            }
          },
          {
            path: 'openpurchase/create',
            name: 'Open Purchase Create',
            component: () => import('modules/_views/purchase/open/create/OpenCreate'),
            localization_key: 'purchase_create',
            meta: {
              premium: true,
              freemiumRedirect: '/freemium'
            }
          },
          {
            path: 'openpurchase/:id',
            name: 'Open Purchase Detail',
            component: () => import('modules/_views/purchase/DetailPurchase'),
            localization_key: 'purchase_detail',
            meta: {
              premium: true,
              freemiumRedirect: '/freemium'
            }
          },
          {
            path: 'completepurchase',
            name: 'Complete Purchase',
            component: () => import('modules/_views/purchase/complete/CompleteList'),
            localization_key: 'purchase_completed',
            meta: {
              premium: true,
              freemiumRedirect: '/freemium'
            }
          },
          {
            path: 'completepurchase/:id',
            name: 'Complete Purchase Detail',
            component: () => import('modules/_views/purchase/DetailPurchase'),
            hidden: true,
            localization_key: 'purchase_detail',
            meta: {
              premium: true,
              freemiumRedirect: '/freemium'
            }
          },
          {
            path: 'cancelpurchase',
            name: 'Cancel Purchase',
            component: () => import('modules/_views/purchase/cancel/CancelList'),
            localization_key: 'purchases_canceled',
            meta: {
              premium: true,
              freemiumRedirect: '/freemium'
            }
          },
          {
            path: 'cancelpurchase/:id',
            name: 'Cancel Purchase Detail',
            component: () => import('modules/_views/purchase/DetailPurchase'),
            localization_key: 'purchase_detail',
            meta: {
              premium: true,
              freemiumRedirect: '/freemium'
            }
          }
        ]
      },
      {
        path: 'pos-settings',
        name: 'POS Settings',
        redirect: 'pos-settings/pospaymentmodes',
        component: () => import('modules/_views/pos/settings/Index'),
        localization_key: 'pos_settings',
        children: [
          {
            path: 'pospaymentmodes',
            name: 'POS Payment Modes',
            component: () => import('modules/_views/pos/settings/pospaymentmodes/Index'),
            localization_key: 'pos_paymentmodes'
          },
          {
            path: 'posdevice',
            name: 'POS Device',
            component: () => import('modules/_views/pos/settings/posdevice/Index'),
            localization_key: 'pos_devices',
            meta: {
              premium: true,
              freemiumRedirect: '/pos-settings/freemium'
            }
          },
          {
            path: 'posreceiptnote',
            name: 'POS Receipt Note',
            component: () => import('modules/_views/pos/settings/posreceiptnote/Index'),
            localization_key: 'pos_receipt_notes'
          },
          {
            path: 'posemailreport',
            name: 'POS Email Report',
            component: () => import('modules/_views/pos/settings/posemailreport/Index'),
            localization_key: 'pos_email_report',
            meta: {
              premium: true,
              freemiumRedirect: '/pos-settings/freemium'
            }
          },
          {
            path: 'pospasskey',
            name: 'POS Passkey',
            component: () => import('modules/_views/pos/settings/pospasskey/Index'),
            localization_key: 'pos_passkey',
            meta: {
              premium: true,
              freemiumRedirect: '/pos-settings/freemium'
            }
          },
          {
            path: 'posextsetting',
            name: 'POS Ext.',
            component: () => import('modules/_views/pos/settings/posextsetting/Index'),
            localization_key: 'pos_extsetting',
            meta: {
              premium: true,
              freemiumRedirect: '/pos-settings/freemium'
            }
          },
          {
            path: 'shiftsetting',
            name: 'Shift Setting',
            component: () => import('modules/_views/pos/settings/shiftsetting/Index'),
            localization_key: 'shift_setting',
            meta: {
              premium: true,
              freemiumRedirect: '/pos-settings/freemium'
            }
          },
          {
            path: 'posstockmode',
            name: 'POS Stock Mode',
            component: () => import('modules/_views/pos/settings/posstockmode/Index'),
            localization_key: 'pos_stock_mode',
            meta: {
              premium: true,
              freemiumRedirect: '/pos-settings/freemium'
            }
          },
          {
            path: 'postrackserver',
            name: 'POS Track Server',
            component: () => import('modules/_views/pos/settings/postrackserver/Index'),
            localization_key: 'pos_track_server',
            meta: {
              premium: true,
              freemiumRedirect: '/pos-settings/freemium'
            }
          },
          {
            path: 'shifttime',
            name: 'POS Shift Timing',
            component: () => import('modules/_views/pos/settings/shifttime/Index'),
            localization_key: 'pos_shift_timing',
            meta: {
              premium: true,
              freemiumRedirect: '/pos-settings/freemium'
            }
          },
          {
            path: 'shifttime/create',
            name: 'Create POS Shift Timing',
            component: () => import('modules/_views/pos/settings/shifttime/Create'),
            localization_key: 'pos_shift_timing_create',
            meta: {
              premium: true,
              freemiumRedirect: '/pos-settings/freemium'
            }
          },
          {
            path: 'postqueue',
            name: 'POS Queue',
            component: () => import('modules/_views/pos/settings/posqueue/Index'),
            localization_key: 'pos_queue',
            meta: {
              premium: true,
              freemiumRedirect: '/pos-settings/freemium'
            }
          },
          {
            path: 'freemium',
            name: 'Freemium',
            props: { tabs: 1 },
            component: () => import('@/components/FreemiumBanner'),
            localization_key: 'freemium',
            meta: {
              freemiumRedirect: '/pos-settings'
            }
          },
        ]
      },
      {
        path: 'begincash',
        name: 'Begin Cash',
        component: () => import('modules/_views/pos/begincash/Index'),
        localization_key: 'begin_cash',
        meta: {
          premium: true
        }
      },
      {
        path: 'shiftbalance',
        name: 'Shift Balance',
        component: () => import('modules/_views/pos/shiftbalance/Index'),
        localization_key: 'shift_balance',
        meta: {
          premium: true
        }
      },
      {
        path: 'transaction',
        name: 'Transaction',
        component: () => import('modules/_views/income-expense/transaction/TransactionList'),
        localization_key: 'transactions',
        meta: {
          premium: true,
          freemiumRedirect: '/freemium'
        }
      },
      {
        path: 'transaction/create-income',
        name: 'Transaction Create Income',
        component: () => import('modules/_views/income-expense/transaction/create/TransactionCreateIncome'),
        localization_key: 'transaction_create_income',
        meta: {
          premium: true,
          freemiumRedirect: '/freemium'
        }
      },
      {
        path: 'transaction/create-expense',
        name: 'Transaction Create Expense',
        component: () => import('modules/_views/income-expense/transaction/create/TransactionCreateExpense'),
        localization_key: 'transaction_create_expense',
        meta: {
          premium: true,
          freemiumRedirect: '/freemium'
        }
      },
      {
        path: 'transactiontype',
        name: 'Transaction Type',
        component: () => import('modules/_views/income-expense/transaction-type/TransactionTypeList'),
        localization_key: 'transaction_types',
        meta: {
          premium: true,
          freemiumRedirect: '/freemium'
        }
      },
      {
        path: 'transactiontype/create',
        name: 'Transaction Type Create',
        component: () => import('modules/_views/income-expense/transaction-type/create/TransactionTypeCreate'),
        localization_key: 'transaction_type_create',
        meta: {
          premium: true,
          freemiumRedirect: '/freemium'
        }
      },
      {
        path: 'restomode',
        name: 'Restaurant Mode',
        component: () => import('modules/_views/pos/restomode/Index'),
        redirect: 'restomode/posrestolayout',
        localization_key: 'resto_mode',
        children: [
          {
            path: 'posrestolayout',
            name: 'Resto Layout',
            component: () => import('modules/_views/pos/restomode/posrestolayout/Index'),
            localization_key: 'resto_layout',
            meta: {
              premium: true
            }
          },
          {
            path: 'posrestolayout/:id',
            name: 'Resto Layout Detail',
            component: () => import('modules/_views/pos/restomode/posrestolayout/Layout'),
            hidden: true,
            localization_key: 'resto_layout_detail',
            meta: {
              premium: true
            }
          },
          {
            path: 'posdisabledinein',
            name: 'Dine In / Take Away',
            component: () => import('modules/_views/pos/restomode/posdisabledinein/Index'),
            localization_key: 'dine_take_away',
            meta: {
              premium: true
            }
          },
          {
            path: 'poslocalserver',
            name: 'Local Server',
            component: () => import('modules/_views/pos/restomode/poslocalserver/Index'),
            localization_key: 'pos_local_server',
            meta: {
              premium: true
            }
          },
          {
            path: 'posbilling',
            name: 'Billing',
            component: () => import('modules/_views/pos/restomode/posbilling/Index'),
            localization_key: 'pos_billing',
            meta: {
              premium: true
            }
          },
          {
            path: 'courselinegrouping',
            name: 'Course Line Grouping',
            component: () => import('modules/_views/pos/restomode/courselinegrouping/Index'),
            localization_key: 'pos_course_line_grouping',
            meta: {
              premium: true
            }
          }
        ]
      },
      {
        path: 'settings/store',
        name: 'Settings - Store',
        component: () => import('modules/_views/settings/store/Index'),
        redirect: 'settings/store/general',
        localization_key: 'store_settings',
        children: [
          {
            path: 'general',
            name: 'Store Information',
            component: () => import('modules/_views/settings/store/general/Index'),
            localization_key: 'store_information'
          },
          {
            path: 'staffs',
            name: 'Staffs',
            component: () => import('modules/_views/settings/store/staffs/Index'),
            localization_key: 'store_staffs',
            meta: {
              premium: true,
              freemiumRedirect: '/settings/store/freemium'
            }
          },
          {
            path: 'storebranches',
            name: 'Store Branches',
            component: () => import('modules/_views/settings/store/storebranches/Index'),
            localization_key: 'store_branches',
            meta: {
              premium: true,
              freemiumRedirect: '/settings/store/freemium'
            }
          },
          {
            path: 'storecurrency',
            name: 'Store Currency',
            component: () => import('modules/_views/settings/store/storecurrency/Index'),
            localization_key: 'store_currency',
            meta: {
              premium: true,
              freemiumRedirect: '/settings/store/freemium'
            }
          },
          {
            path: 'freemium',
            name: 'Freemium',
            props: { tabs: 1 },
            component: () => import('@/components/FreemiumBanner'),
            localization_key: 'freemium',
            meta: {
              freemiumRedirect: '/settings/store'
            }
          },
        ]
      },
      {
        path: 'settings/notification',
        name: 'Settings - Notification',
        component: () => import('modules/_views/settings/notification/Index'),
        redirect: 'settings/notification/email',
        localization_key: 'notification_settings',
        meta: {
          premium: true,
          onlineShop: true,
          freemiumRedirect: '/dashboard'
        },
        children: [
          {
            path: 'email',
            name: 'Email Notification',
            component: () => import('modules/_views/settings/notification/email/Index'),
            localization_key: 'email_notifications',
            meta: {
              premium: true,
              freemiumRedirect: '/freemium'
            }
          },
          {
            path: 'sms',
            name: 'SMS Notification',
            component: () => import('modules/_views/settings/notification/sms/Index'),
            localization_key: 'sms_notifications',
            meta: {
              premium: true,
              freemiumRedirect: '/freemium'
            }
          }
        ]
      },
      {
        path: 'settings/loyaltypoint',
        name: 'Settings - Loyalty Point',
        component: () => import('modules/_views/settings/loyaltypoint/Index'),
        localization_key: 'setting_lpoint',
        meta: {
          premium: true,
          onlineShop: true,
          freemiumRedirect: '/freemium'
        },
      },
      {
        path: 'settings/publishstore',
        name: 'Settings - Publish',
        component: () => import('modules/_views/settings/publishstore/Index'),
        localization_key: 'setting_publish_store',
        meta: {
          premium: true,
          onlineShop: true,
          freemiumRedirect: '/freemium'
        },
      },
      // {
      //   path: 'settings/publishstore',
      //   name: 'Settings - Publish',
      //   component: () => import('modules/_views/settings/publishstore/Index')
      // },
      {
        path: 'settings/shippings',
        name: 'Settings - Shippings',
        component: () => import('modules/_views/settings/shippings/Index'),
        redirect: 'settings/shippings/general',
        meta: {
          premium: true,
          onlineShop: true,
          freemiumRedirect: '/freemium'
        },
        localization_key: 'shippings',
        children: [
          {
            path: 'general',
            name: 'Shippings - General',
            component: () => import('modules/_views/settings/shippings/general/Index'),
            localization_key: 'shipping_general',
            meta: {
              premium: true,
              onlineShop: true,
              freemiumRedirect: '/freemium'
            },
          },
          {
            path: 'postalcodes',
            name: 'Shippings - Postal Codes',
            component: () => import('modules/_views/settings/shippings/postalcodes/Index'),
            localization_key: 'shipping_postal_codes',
            meta: {
              premium: true,
              onlineShop: true,
              freemiumRedirect: '/freemium'
            },
          },
          {
            path: 'rates/:id',
            name: 'Shipping Rates',
            component: () => import('modules/_views/settings/shippings/shippingrates/Index'),
            props: (route) => ({ query: route.query.q }),
            hidden: true,
            localization_key: 'shipping_rates',
            meta: {
              premium: true,
              onlineShop: true,
              freemiumRedirect: '/freemium'
            },
          },
          {
            path: 'postalcodes/rates/:id',
            name: 'Postalcodes Rates',
            component: () => import('modules/_views/settings/shippings/postalcodes/Rates'),
            hidden: true,
            localization_key: 'postal_codes_rates',
            meta: {
              premium: true,
              onlineShop: true,
              freemiumRedirect: '/freemium'
            },
          }
        ]
      },
      {
        path: 'settings/tax',
        name: 'Settings - Tax',
        component: () => import('modules/_views/settings/tax/Index'),
        localization_key: 'tax_settings',
        meta: {
          premium: true,
          onlineShop: true,
          freemiumRedirect: '/freemium'
        },
      },
      {
        path: 'mobileapp',
        name: 'Mobile App',
        component: () => import('modules/_views/mobile-app/Index'),
        redirect: 'mobileapp/navigation',
        localization_key: 'mobile_app',
        children: [{
          path: 'navigation',
          name: 'Navigation',
          component: () => import('modules/_views/mobile-app/navigation/Index'),
          localization_key: 'mobile_app_navigation'
        }, {
          path: 'banner',
          name: 'Banner',
          component: () => import('modules/_views/mobile-app/banner/Index'),
          localization_key: 'mobile_app_banner'
        }, {
          path: 'payment',
          name: 'Payment',
          component: () => import('modules/_views/mobile-app/payment/Index'),
          localization_key: 'mobile_app_payment'
        }]
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('modules/_views/profile/Index'),
        localization_key: 'profile'
      },
      {
        path: 'reports',
        name: 'Reports',
        component: () => import('modules/_views/reports/Index'),
        redirect: 'reports/products',
        localization_key: 'reports',
        children: [
          {
            path: 'products',
            name: 'Products Report',
            component: () => import('modules/_views/reports/products/Index'),
            props: (route) => ({ query: route.query.path }),
            localization_key: 'reports_products',
            meta: {
              premium: true,
              freemiumRedirect: '/reports/freemium'
            }
          },
          {
            path: 'payments',
            name: 'Payment Report',
            component: () => import('modules/_views/reports/payments/Index'),
            localization_key: 'reports_payment',
            meta: {
              premium: true,
              freemiumRedirect: '/reports/freemium',
            }
          },
          {
            path: 'purchases',
            name: 'Purchases Report',
            component: () => import('modules/_views/reports/purchases/Index'),
            localization_key: 'reports_purchases',
            meta: {
              premium: true,
              freemiumRedirect: '/reports/freemium',
            }
          },
          {
            path: 'sales',
            name: 'Sales Report',
            component: () => import('modules/_views/reports/sales/Index'),
            localization_key: 'reports_sales',
            meta: {
              premium: true,
              freemiumRedirect: '/reports/freemium',
            }
          },
          {
            path: 'shifts',
            name: 'Shifts Report',
            component: () => import('modules/_views/reports/shifts/Index'),
            localization_key: 'reports_shifts',
            meta: {
              premium: true,
              freemiumRedirect: '/reports/freemium',
            }
          },
          {
            path: 'multioutlets',
            name: 'Multi Outlets',
            component: () => import('modules/_views/reports/multioutlets/Index'),
            localization_key: 'reports_multioutlets',
            meta: {
              premium: true,
              freemiumRedirect: '/reports/freemium',
            }
          },
          {
            path: 'attendance',
            name: 'Attendance Report',
            component: () => import('modules/_views/reports/attendance/Index'),
            localization_key: 'reports_attendance',
            meta: {
              premium: true,
              freemiumRedirect: '/reports/freemium',
            }
          },
          {
            path: 'freemium',
            name: 'Freemium',
            props: { tabs: 1 },
            component: () => import('@/components/FreemiumBanner'),
            localization_key: 'freemium',
            meta: {
              freemiumRedirect: '/reports'
            }
          }
        ]
      },
      {
        path: 'kiosk',
        name: 'Kiosk',
        component: () => import('modules/_views/kiosk/index'),
        localization_key: 'kiosk_mode'
      },
      {
        path: 'service-activation',
        name: 'Service Activation',
        component: () => import('modules/_views/service-activation/index-old'),
        redirect: 'service-activation/credit-card',
        localization_key: 'service_activation',
        children: [
          {
            path: 'credit-card',
            name: 'Credit Card',
            component: () => import('modules/_views/service-activation/credit-card'),
            localization_key: 'credit_card'
          },
          {
            path: 'digital-qr-code',
            name: 'Digital/QR Code',
            component: () => import('modules/_views/service-activation/digital-qr-code'),
            localization_key: 'digital_qr_code'
          }
        ]
      },
      {
        path: 'service-activation-v2',
        name: 'service-activation-v2',
        component: () => import('modules/_views/service-activation/index'),
        localization_key: 'service_activation',
        meta: {
          label: 'Service Activation'
        },
        children: [
          {
            path: 'grabfood/setup/:id',
            name: 'Grabfood - Setup',
            component: () => import('modules/_views/service-activation/grabfood/setup'),
            localization_key: 'grabfood_setup'
          },
          {
            path: 'grabfood/manage',
            name: 'Grabfood - Manage',
            component: () => import('modules/_views/service-activation/grabfood/manage'),
            localization_key: 'grabfood_manage'
          },
          {
            path: 'tokopedia/manage',
            name: 'Tokopedia - Manage',
            component: () => import('modules/_views/service-activation/tokopedia/manage'),
            localization_key: 'tokopedia_manage'
          },
          {
            path: 'commbank-bizloan',
            name: 'CommBank BizLoan',
            component: () => import('modules/_views/service-activation/funding/commbank/index'),
            meta: {
              roles_except: ['AS','LW','PO','PS','PT','RP','SA','SP','SS','ST'],
              store_age_month: 6
            }
          },
          {
            path: 'commbank-bizloan-history',
            name: 'CommBank BizLoan History Funding',
            component: () => import('modules/_views/service-activation/funding/commbank/_historyFunding')
          }
        ]
      },
      {
        path: 'settlement',
        name: 'Settlement',
        component: () => import('modules/_views/settlement/index'),
        localization_key: 'settlement',
        // children: [
        //   {
        //     path: 'credit-card',
        //     name: 'Credit Card',
        //     component: () => import('modules/_views/service-activation/credit-card'),
        //     localization_key: 'credit_card'
        //   },
        //   {
        //     path: 'digital-qr-code',
        //     name: 'Digital/QR Code',
        //     component: () => import('modules/_views/service-activation/digital-qr-code'),
        //     localization_key: 'digital_qr_code'
        //   }
        // ]
      },
      {
        path: 'attendance',
        name: 'Attendance',
        component: () => import('modules/_views/attendance/index'),
        redirect: 'attendance/employee',
        localization_key: 'attendance',
        // meta: {
        //   premium: true
        // },
        children: [
          {
            path: 'employee',
            name: 'Employee',
            component: () => import('modules/_views/attendance/employee'),
            localization_key: 'employee',
            // meta: {
            //   premium: true,
            //   freemiumRedirect: '/attendance/freemium'
            // },
          },
          {
            path: 'shift',
            name: 'Shift',
            component: () => import('modules/_views/attendance/shift'),
            localization_key: 'shift'
          },
          {
            path: 'presence',
            name: 'Presence',
            component: () => import('modules/_views/attendance/presence'),
            localization_key: 'presence'
          }
        ]
      },
      {
        path: 'online-order',
        name: 'Online Order',
        component: () => import('modules/_views/online-order/index'),
        redirect: 'online-order/working-hours',
        localization_key: 'online_order',
        meta: {
          premium: true
        },
        children: [
          {
            path: 'working-hours',
            name: 'Working Hours',
            component: () => import('modules/_views/online-order/working-hours'),
            localization_key: 'working_hours',
            meta: {
              premium: true,
              freemiumRedirect: '/online-order/freemium'
            },
          },
          {
            path: 'delivery',
            name: 'Delivery',
            component: () => import('modules/_views/online-order/delivery'),
            localization_key: 'delivery'
          },
          {
            path: 'service',
            name: 'Service',
            component: () => import('modules/_views/online-order/service'),
            localization_key: 'service'
          },
          {
            path: 'setting',
            name: 'Setting',
            component: () => import('modules/_views/online-order/setting'),
            localization_key: 'setting'
          },
          {
            path: 'freemium',
            name: 'Freemium',
            props: { tabs: 1 },
            component: () => import('@/components/FreemiumBanner'),
            localization_key: 'freemium',
            meta: {
              freemiumRedirect: '/online-order'
            },
          },
        ]
      },
      {
        path: '/marketing/design-promotions',
        name: 'Design Promotions',
        component: () => import('modules/_views/marketing/DesignPromotions'),
        localization_key: 'design_promotions',
        meta: {
          premium: true
        }
      },
      {
        path: '/marketing/invite-member',
        name: 'Invite Member',
        component: () => import('modules/_views/marketing/InviteMember'),
        localization_key: 'invite_member',
        meta: {
          premium: true
        }
      },
      {
        path: '/marketing/promotions-material',
        name: 'Download Promotions Material',
        component: () => import('modules/_views/marketing/DownloadMaterial'),
        localization_key: 'download_promotions_material',
        meta: {
          premium: true
        }
      },
      {
        path: '/whatsnew',
        component: () => import('modules/_views/whatsnew/Index'),
        name: 'What\'s New',
        hidden: true,
        meta: {
          title: 'What\'s New',
          hidden: true
        }
      },
      {
        path: '/tutorial',
        component: () => import('modules/_views/tutorial/index'),
        name: 'Tutorial\'s',
        hidden: true,
        meta: {
          title: 'Tutorial\'s',
          hidden: true
        }
      }
    ]
  }
]

export const constantRouterMap = [
  {
    path: '/reports-mobile',
    name: 'Reports Mobile',
    hidden: true,
    component: () => import('modules/_views/reports/IndexMobile'),
    redirect: 'reports-mobile/products',
    children: [
      {
        path: 'products',
        name: 'Products Report Mobile',
        component: () => import('modules/_views/reports/products/Index'),
        meta: {
          premium: true,
          freemiumRedirect: '/reports-mobile/freemium',
        }
      },
      {
        path: 'payments',
        name: 'Payment Report Mobile',
        component: () => import('modules/_views/reports/payments/Index'),
        meta: {
          premium: true,
          freemiumRedirect: '/reports-mobile/freemium',
        }
      },
      {
        path: 'purchases',
        name: 'Purchases Report Mobile',
        component: () => import('modules/_views/reports/purchases/Index'),
        meta: {
          premium: true,
          freemiumRedirect: '/reports-mobile/freemium',
        }
      },
      {
        path: 'sales',
        name: 'Sales Report Mobile',
        component: () => import('modules/_views/reports/sales/Index'),
        meta: {
          premium: true,
          freemiumRedirect: '/reports-mobile/freemium',
        }
      },
      {
        path: 'shifts',
        name: 'Shifts Report Mobile',
        component: () => import('modules/_views/reports/shifts/Index'),
        meta: {
          premium: true,
          freemiumRedirect: '/reports-mobile/freemium',
        }
      },
      {
        path: 'multioutlets',
        name: 'Multi Outlets Report Mobile',
        component: () => import('modules/_views/reports/multioutlets/Index'),
        meta: {
          premium: true,
          freemiumRedirect: '/reports-mobile/freemium',
        }
      },
      {
        path: 'attendance',
        name: 'Attendance Report Mobile',
        component: () => import('modules/_views/reports/attendance/Index'),
        meta: {
          premium: true,
          freemiumRedirect: '/reports-mobile/freemium',
        }
      },
      {
        path: 'freemium',
        name: 'Freemium',
        props: { tabs: 1 },
        component: () => import('@/components/FreemiumBanner'),
        meta: {
          freemiumRedirect: '/reports-mobile/',
        }
      }
    ]
  },
  {
    path: '/whatsnew-mobile',
    component: () => import('modules/_views/whatsnew/IndexMobile'),
    name: 'What\'s New Mobile',
    hidden: true,
    meta: {
      title: 'What\'s New',
      hidden: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('./components/Login')
  },
  {
    path: '/signup',
    name: 'Sign Up',
    component: () => import('./components/Signup')
  },
  {
    path: '/attendance-mobile',
    name: 'Attendance Mobile',
    hidden: true,
    component: () => import('modules/_views/attendance/indexMobile'),
    localization_key: 'attendance',
    children: [
      {
        path: 'employee',
        name: 'Employee',
        component: () => import('modules/_views/attendance/employee'),
        localization_key: 'employee'
      }
    ]
  },
  {
    path: '/signup/:partner',
    name: 'Sign Up By Partner',
    component: () => import('./components/Signup')
  },
  {
    path: '/selectstore',
    name: 'Select Store',
    component: () => import('./components/SelectStore')
  },
  {
    path: '/extendstore',
    name: 'Extend Store',
    component: () => import('./components/ExtendStore')
  },
  {
    path: '/download/api/*',
    name: 'webview-downloading',
    component: () => import('./components/WebviewDownloading')
  },
  {
    path: '/webview-login',
    name: 'webview_login',
    component: () => import('./components/modules/webview/Login')
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import('modules/_views/auth/Index'),
  },
  {
    path: '/scan',
    name: 'Scan',
    component: () => import('./components/modules/_views/attendance/scan')
  }
]

// Routes
export default new Router({
  mode: 'history',
  linkActiveClass: 'open active',
  // scrollBehavior: () => ({ y: 0 }),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
    // window.scrollTo(0, 0)
  },
  routes: constantRouterMap
})
