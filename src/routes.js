import Vue from 'vue'
import Router from 'vue-router'
import { checkParentMenuCustomPermission } from '@/utils/checkParentMenuCustomPermission'
// import store from './store'
Vue.use(Router)

const getFirstShownMenus = (parentMenuId) => {
  const visibleMenus = checkParentMenuCustomPermission(parentMenuId, 'index').shown
  // if (parentMenuId === 'websitePages') {
  //   console.log('visibleMenus', visibleMenus)
  // }
  if (visibleMenus.length) {
    return visibleMenus[0]
  }
}

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

      // Catalog Product
      {
        path: 'catalog',
        name: 'Product Catalog',
        component: () => import('modules/_views/catalog/products/Index'),
        redirect: () => {
          return getFirstShownMenus('products')
        },
        localization_key: 'product_catalog',
        children: [
          {
            path: 'product',
            name: 'Products',
            parent: 'catalog',
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
            hidden: true,
            component: () => import('modules/_views/catalog/products/product/create/ProductCreate'),
            localization_key: 'product_create',
            meta: {
              roles_except: ['PT', 'LW']
            }
          },
          {
            path: 'product/:id&:copy/copy',
            name: 'Product Copy',
            hidden: true,
            component: () => import('modules/_views/catalog/products/product/create/ProductCreate'),
            localization_key: 'product_copy',
            meta: {
              roles_except: ['PT', 'LW']
            }
          },
          {
            path: 'product/:id',
            name: 'Product Detail',
            hidden: true,
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
            parent: 'catalog',
            component: () => import('modules/_views/catalog/products/group/Index'),
            localization_key: 'product_groups',
            meta: {
              roles_except: ['PT', 'LW']
            }
          },
          {
            path: 'product-brand',
            name: 'Product Brand',
            parent: 'catalog',
            component: () => import('modules/_views/catalog/products/brand/Index'),
            localization_key: 'product_brands',
            meta: {
              
              roles_except: ['PT', 'LW']
            }
          },
          {
            path: 'collection',
            name: 'Collection',
            parent: 'catalog',
            component: () => import('modules/_views/catalog/products/collection/Index'),
            localization_key: 'collections'
          },
          {
            path: 'specification',
            name: 'Product Specification',
            parent: 'catalog',
            component: () => import('modules/_views/catalog/products/specification/Index'),
            localization_key: 'product_specification'
          },
          {
            path: 'package',
            name: 'Product Package',
            parent: 'catalog',
            component: () => import('modules/_views/catalog/products/package/Index'),
            localization_key: 'product_package',
            meta: {
              persistent_param: true
            }
          },
          {
            path: 'lookbook',
            name: 'Lookbook',
            parent: 'catalog',
            component: () => import('modules/_views/catalog/products/lookbook/Index'),
            localization_key: 'lookbook'
          },
          {
            path: 'grouplookbook',
            name: 'Group Lookbook',
            parent: 'catalog',
            component: () => import('modules/_views/catalog/products/grouplookbook/Index'),
            localization_key: 'group_lookbook'
          },
          {
            path: 'addon',
            name: 'Product Addon',
            parent: 'catalog',
            component: () => import('modules/_views/catalog/products/addon/Index'),
            localization_key: 'product_addon'
          },
          {
            path: 'addon/create',
            name: 'Create Product Addon',
            hidden: true,
            component: () => import('modules/_views/catalog/products/addon/Form'),
            localization_key: 'product_addon_create'
          },
          {
            path: 'addon/:id',
            name: 'Product Addon Detail',
            hidden: true,
            component: () => import('modules/_views/catalog/products/addon/Form'),
            localization_key: 'product_addon_detail'
          }
        ]
      },
      {
        path: 'catalog/package/create',
        name: 'Create Package',
        hidden: true,
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
        hidden: true,
        component: () => import('modules/_views/catalog/products/package/create/Index'),
        localization_key: 'product_package_copy'
      },
      {
        path: 'catalog/lookbook/create',
        name: 'Create Lookbook',
        hidden: true,
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

      // Inventory
      {
        path: 'inventory',
        name: 'Inventory',
        component: () => import('modules/_views/catalog/inventory/Index'),
        redirect: () => {
          return getFirstShownMenus('inventory')
        },
        localization_key: 'inventory',
        children: [
          {
            path: 'stocksincoming',
            name: 'Stocks Incoming',
            parent: 'inventory',
            component: () => import('modules/_views/catalog/inventory/stocksincoming/Index'),
            localization_key: 'stock_incoming'
          },
          {
            path: 'stocksincoming/create',
            name: 'Create Stocks Incoming',
            hidden: true,
            component: () => import('modules/_views/catalog/inventory/stocksincoming/Form'),
            localization_key: 'stock_incoming_create'
          },
          {
            path: 'stocksoutgoing',
            name: 'Stocks Outgoing',
            parent: 'inventory',
            component: () => import('modules/_views/catalog/inventory/stocksoutgoing/Index'),
            localization_key: 'stock_outgoing',
            
          },
          {
            path: 'stocksoutgoing/create',
            name: 'Create Stocks Outgoing',
            hidden: true,
            component: () => import('modules/_views/catalog/inventory/stocksoutgoing/Form'),
            localization_key: 'stock_outgoing_create',
            
          },
          {
            path: 'stocksopname',
            name: 'Stocks Opname',
            parent: 'inventory',
            component: () => import('modules/_views/catalog/inventory/stocksopname/Index'),
            localization_key: 'stock_opname'
          },
          {
            path: 'stocksopname/create',
            name: 'Create Stocks Opname',
            hidden: true,
            component: () => import('modules/_views/catalog/inventory/stocksopname/Form'),
            localization_key: 'stock_opname_create'
          },
          {
            path: 'stocksmovement',
            name: 'Stocks Movement',
            parent: 'inventory',
            component: () => import('modules/_views/catalog/inventory/stocksmovement/Index'),
            localization_key: 'stock_movement'
          },
          {
            path: 'stocksproduction',
            name: 'Stocks Production',
            parent: 'inventory',
            component: () => import('modules/_views/catalog/inventory/stocksproduction/Index'),
            localization_key: 'stock_production',
            
          },
          {
            path: 'stocksproduction/create',
            name: 'Create Stocks Production',
            hidden: true,
            component: () => import('modules/_views/catalog/inventory/stocksproduction/Form'),
            localization_key: 'stock_production_create',
            
          },
          {
            path: 'stocksalert',
            name: 'Alert Stocks',
            parent: 'inventory',
            component: () => import('modules/_views/catalog/inventory/alertstocks/Index'),
            localization_key: 'alert_stock',
            
          },
          {
            path: 'stocksincoming/:id',
            name: 'Stocks Incoming - Detail',
            hidden: true,
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
            hidden: true,
            component: () => import('modules/_views/catalog/inventory/stocksoutgoing/Detail'),
            hidden: true,
            localization_key: 'stock_outgoing_detail',
            meta: {
              detail: true,
              pathDirect: '/inventory'
            }
          },
          {
            path: 'stocksopname/:id',
            name: 'Stocks Opname - Detail',
            hidden: true,
            component: () => import('modules/_views/catalog/inventory/stocksopname/Detail'),
            hidden: true,
            localization_key: 'stock_opname_detail'
          },
          {
            path: 'stocksproduction/:id',
            name: 'Stocks Production - Detail',
            hidden: true,
            component: () => import('modules/_views/catalog/inventory/stocksproduction/Detail'),
            hidden: true,
            localization_key: 'stock_production_detail',
            
          },
          {
            path: 'stocksoutstanding',
            name: 'Stocks Outstanding',
            parent: 'inventory',
            component: () => import('modules/_views/catalog/inventory/stocksoutstanding/Index'),
            localization_key: 'stock_outstandings'
          },
          {
            path: 'stocksoutstanding/:id',
            name: 'Stocks Outstanding - Detail',
            hidden: true,
            component: () => import('modules/_views/catalog/inventory/stocksoutstanding/Detail'),
            hidden: true,
            localization_key: 'stock_outstandings_detail',
            
          },
          {
            path: 'freemium',
            name: 'Freemium',
            hidden: true,
            props: { tabs: 1 },
            component: () => import('@/components/FreemiumBanner'),
            localization_key: 'freemium'
          },
        ]
      },

      // Special Type Product
      {
        path: 'specialtype',
        name: 'Special Type',
        component: () => import('modules/_views/catalog/specialtype/Index'),
        redirect: () => {
          return getFirstShownMenus('specialType')
        },
        localization_key: 'special_type',
        meta: {
          roles_except: ['SS', 'PT', 'LW']
        },
        children: [
          {
            path: 'featured',
            name: 'Featured',
            parent: 'specialtype',
            component: () => import('modules/_views/catalog/specialtype/featured/Index'),
            localization_key: 'featured'
          },
          {
            path: 'newrelease',
            name: 'newrelease',
            parent: 'specialtype',
            component: () => import('modules/_views/catalog/specialtype/newrelease/Index'),
            localization_key: 'newrelease'
          },
          {
            path: 'outstock',
            name: 'outstock',
            parent: 'specialtype',
            component: () => import('modules/_views/catalog/specialtype/outstock/Index'),
            localization_key: 'outstock'
          },
          {
            path: 'popular',
            name: 'popular',
            parent: 'specialtype',
            component: () => import('modules/_views/catalog/specialtype/popular/Index'),
            localization_key: 'popular'
          },
          {
            path: 'preorder',
            name: 'preorder',
            parent: 'specialtype',
            component: () => import('modules/_views/catalog/specialtype/preorder/Index'),
            localization_key: 'preorder'
          },
          {
            path: 'rawmaterial',
            name: 'rawmaterial',
            parent: 'specialtype',
            component: () => import('modules/_views/catalog/specialtype/rawmaterial/Index'),
            localization_key: 'rawmaterial',
            meta: {
              
            }
          },
          {
            path: 'sale',
            name: 'sale',
            parent: 'specialtype',
            component: () => import('modules/_views/catalog/specialtype/sale/Index'),
            localization_key: 'sale'
          }
        ]
      },

      {
        path: 'catalog/barcode',
        name: 'Print Barcode Product',
        component: () => import('modules/_views/catalog/barcode/Index'),
        localization_key: 'print_barcode',
        
      },

      {
        path: 'catalog/deposit',
        name: 'Deposit',
        component: () => import('modules/_views/catalog/deposit/Index'),
        localization_key: 'deposit'
      },

      {
        path: 'freemium',
        name: 'Freemium',
        hidden: true,
        component: () => import('@/components/FreemiumBanner'),
        localization_key: 'freemium',
        meta: {
        }
      },

      // Sales
      {
        path: 'sales',
        name: 'Sales',
        redirect: () => {
          return getFirstShownMenus('salesOrder')
        },
        component: () => import('modules/_views/sales/Index'),
        localization_key: 'sales',
        children: [{
          path: 'openorder',
          name: 'Open Order List',
          parent: 'sales',
          component: () => import('modules/_views/sales/openorder/OpenOrderListV2'),
          props: { tabs: 1 },
          localization_key: 'openorder',
          meta: {
            persistent_param: true,
            
          }
        },
        {
          path: 'openorder/create',
          name: 'Open Order Create',
          hidden: true,
          component: () => import('modules/_views/sales/openorder/create/OpenOrderCreate'),
          localization_key: 'openorder_create',
          meta: {
            
          }
        },
        {
          path: 'openorder/:id',
          name: 'Open Order Detail',
          hidden: true,
          component: () => import('modules/_views/sales/DetailOrder'),
          hidden: true,
          localization_key: 'openorder_detail',
          meta: {
            
          }
        },
        {
          path: 'openorderv2/:id',
          name: 'Open Order Detail',
          hidden: true,
          component: () => import('modules/_views/sales/DetailOrderV2'),
          hidden: true,
          localization_key: 'openorder_detailv2',
          meta: {
            premium: true,
            freemiumRedirect: '/sales/freemium'
          }
        },
        {
          path: 'completeorder',
          name: 'Complete Order List',
          parent: 'sales',
          component: () => import('modules/_views/sales/complete-order/CompleteOrderList'),
          localization_key: 'completed_order'
        },
        {
          path: 'completeorder/:id',
          name: 'Complete Order Detail',
          hidden: true,
          component: () => import('modules/_views/sales/DetailOrder'),
          hidden: true,
          localization_key: 'completed_order_detail'
        },
        {
          path: 'returnorder',
          name: 'Return Order List',
          parent: 'sales',
          component: () => import('modules/_views/sales/return-order/ReturnOrderList'),
          localization_key: 'salesreturn',
          meta: {
            
          }
        },
        {
          path: 'returnorder/create',
          name: 'Return Order Create',
          hidden: true,
          component: () => import('modules/_views/sales/return-order/create/ReturnOrderCreate'),
          localization_key: 'salesreturn_create',
          meta: {
            
          }
        },
        {
          path: 'returnorder/:id',
          name: 'Return Order Detail',
          hidden: true,
          component: () => import('modules/_views/sales/return-order/detail/ReturnOrderDetail'),
          hidden: true,
          localization_key: 'salesreturn_detail',
          meta: {
            
          }
        },
        {
          path: 'cancelorder',
          name: 'Cancel Order List',
          parent: 'sales',
          component: () => import('modules/_views/sales/cancel-order/CancelOrderList'),
          localization_key: 'cancelorder'
        },

        {
          path: 'cancelorder/:id',
          name: 'Cancel Order Detail',
          hidden: true,
          component: () => import('modules/_views/sales/cancel-order/detail/CancelOrderDetail'),
          hidden: true,
          localization_key: 'cancelorder_detail'
        },
        {
          path: 'freemium',
          name: 'Freemium',
          hidden: true,
          props: { tabs: 1 },
          component: () => import('@/components/FreemiumBanner'),
          localization_key: 'freemium'
        },
        ]
      },

      // Promotions
      {
        path: 'promotions',
        name: 'Promotions',
        redirect: () => {
          return getFirstShownMenus('marketingDiscount')
        },
        component: () => import('modules/_views/promotions/Index'),
        localization_key: 'promotions',
        meta: {
          label: 'Marketing'
        },
        children: [
          {
            path: 'sales',
            name: 'Sales Discount',
            parent: 'promotions',
            component: () => import('modules/_views/promotions/sales/Index'),
            localization_key: 'sales_discount'
          },
          {
            path: 'sales/create',
            name: 'Create Sales Discount',
            hidden: true,
            component: () => import('modules/_views/promotions/sales/Create'),
            localization_key: 'sales_discount_create'
          },
          {
            path: 'sales/:id',
            name: 'Sales Discount Detail',
            hidden: true,
            component: () => import('modules/_views/promotions/sales/Detail'),
            hidden: true,
            localization_key: 'sales_discount_detail'
          },
          {
            path: 'coupon',
            name: 'Coupon Discount',
            parent: 'promotions',
            component: () => import('modules/_views/promotions/coupon/Index'),
            localization_key: 'coupon_discount'
          },
          {
            path: 'coupon/create',
            name: 'Create Coupon Discount',
            hidden: true,
            component: () => import('modules/_views/promotions/coupon/Create'),
            localization_key: 'coupon_discount_create'
          },
          {
            path: 'coupon/:id',
            name: 'Coupon Discount Detail',
            hidden: true,
            component: () => import('modules/_views/promotions/coupon/Detail'),
            hidden: true,
            localization_key: 'coupon_discount_detail'
          },
          {
            path: 'promopos',
            name: 'POS Promotion',
            parent: 'promotions',
            component: () => import('modules/_views/promotions/pos/Index'),
            localization_key: 'pos_promotion'
          },
          {
            path: 'promopos/create',
            name: 'Create Promo (POS) Discount',
            hidden: true,
            component: () => import('modules/_views/promotions/pos/Create'),
            localization_key: 'pos_promotion_create'
          },
          {
            path: 'promopos/:id',
            name: 'Promo (POS) Discount Detail',
            hidden: true,
            component: () => import('modules/_views/promotions/pos/Detail'),
            localization_key: 'pos_promotion_detail'
          },
          {
            path: 'freemium',
            name: 'Freemium',
            hidden: true,
            props: { tabs: 1 },
            component: () => import('@/components/FreemiumBanner'),
            localization_key: 'freemium'
          },
        ]
      },

      // Accounting
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
            parent: 'accounting',
            component: () => import('modules/_views/accounting/formAddMultiJurnal'),
            localization_key: 'add_multi_jurnal'
          },
          {
            path: 'edit-multi-jurnal',
            name: 'Edit Multi Jurnal',
            parent: 'accounting',
            component: () => import('modules/_views/accounting/formEditMultiJurnal'),
            localization_key: 'edit_multi_jurnal'
          },
          {
            path: 'chartaccount',
            name: 'List Of Accounts',
            parent: 'accounting',
            component: () => import('modules/_views/accounting/chart-of-account/Index'),
            localization_key: 'chartaccount'
          },
          {
            path: 'chartaccount/detail',
            name: 'Chart Of Account - Detail',
            hidden: true,
            component: () => import('modules/_views/accounting/chart-of-account/detail'),
            localization_key: 'chartaccount_detail'
          },
          {
            path: 'cash-bank',
            name: 'Cash & Bank',
            parent: 'accounting',
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
							{
								path: 'taxibike-online-price',
								name: 'Taxibike Online Price',
								component: () => import('modules/_views/accounting/cash-n-bank/hargaOjekOnline'),
								localization_key: 'harga_ojek_online'
							}	
            ]
          },
          {
            path: 'pos-transaction',
            name: 'POS Transaction',
            redirect: 'pos-transaction/sales',
            component: () => import('modules/_views/accounting/pos-transaction/index'),
            localization_key: 'accounting_pos_transaction',
            children: [
              {
                path: 'sales',
                name: 'Sales POS Transaction',
                component: () => import('modules/_views/accounting/pos-transaction/sales'),
                localization_key: 'accounting_sales_post_transaction'
              },
							{
                path: 'purchase',
                name: 'Purchase POS Transaction',
                component: () => import('modules/_views/accounting/pos-transaction/purchase'),
                localization_key: 'accounting_purchase_post_transaction'
              },
              {
                path: 'sales-return',
                name: 'Sales Return POS Transaction',
                component: () => import('modules/_views/accounting/pos-transaction/sales-return'),
                localization_key: 'accounting_sales_return_post_transaction'
              },
              {
                path: 'income',
                name: 'POS Transaction Income',
                component: () => import('modules/_views/accounting/pos-transaction/income'),
                localization_key: 'accounting_income_post_transaction'
              },
              {
                path: 'income-trans-type',
                name: 'Income Transaction Type',
                component: () => import('modules/_views/accounting/pos-transaction/income/transType'),
                localization_key: 'accounting_income_transaction_type'
              },
              {
                path: 'expense',
                name: 'POS Transaction Expense',
                component: () => import('modules/_views/accounting/pos-transaction/expense'),
                localization_key: 'accounting_income_post_transaction'
              },
              {
                path: 'expense-trans-type',
                name: 'Expense Transaction Type',
                component: () => import('modules/_views/accounting/pos-transaction/expense/transType'),
                localization_key: 'accounting_expense_transaction_type'
              },
							{
                path: 'stock-in',
                name: 'POS Stock Incoming',
                component: () => import('modules/_views/accounting/pos-transaction/stock-in'),
                localization_key: 'accounting_pos_trans_stock_incoming'
              },
							{
                path: 'stock-out',
                name: 'POS Stock Outgoing',
                component: () => import('modules/_views/accounting/pos-transaction/stock-out'),
                localization_key: 'accounting_pos_trans_stock_outgoing'
              },
            ]
          },
          {
            path: 'receivable',
            name: 'Receivable',
            parent: 'accounting',
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
              },
              {
                path: 'add-receivable',
                name: 'Receiveable Add',
                component: () => import('modules/_views/accounting/receivable/formAddReceivable'),
                localization_key: 'receivable_add'
              }
            ]
          },
          
          {
            path: 'payable',
            name: 'Payable',
            parent: 'accounting',
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
              },
              {
                path: 'add-payable',
                name: 'Payable Add',
                component: () => import('modules/_views/accounting/payable/formAddPayable'),
                localization_key: 'payable_add'
              }
            ]
          },
          {
            path: 'asset',
            name: 'Asset',
            parent: 'accounting',
            component: () => import('modules/_views/accounting/asset/index'),
            localization_key: 'asset',
          },
          {
            path: 'asset-detail',
            name: 'Asset Detail',
            parent: 'accounting',
            component: () => import('modules/_views/accounting/asset/detailAssetEdit'),
            localization_key: 'asset_detail',
          },
          {
            path: 'asset-depreciation/:id',
            name: 'Asset Depreciation Detail',
            hidden: true,
            component: () => import('modules/_views/accounting/asset/detailDepreciation'),
            localization_key: 'asset_depreciation_detail'
          },
          {
            path: 'asset-maintance/:id',
            name: 'Asset Maintance',
            hidden: true,
            component: () => import('modules/_views/accounting/asset/maintaince'),
            localization_key: 'asset_maintaince'
          },
          {
            path: 'expense',
            name: 'Expense',
            parent: 'accounting',
            component: () => import('modules/_views/accounting/expense/index'),
            localization_key: 'expense'
          },
          {
            path: 'expense/detail',
            name: 'Expense - Detail',
            hidden: true,
            component: () => import('modules/_views/accounting/expense/detail'),
            localization_key: 'expense_detail'
          },
          {
            path: 'closing',
            name: 'Closing',
            parent: 'accounting',
            component: () => import('modules/_views/accounting/closing/index'),
            localization_key: 'closing'
          },
          {
            path: 'ledger',
            name: 'Ledger',
            parent: 'accounting',
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
                component: () => import('modules/_views/accounting/ledger/ledger2'),
                localization_key: 'ledger'
              },
              {
                path: 'ledger-detail',
                name: 'Ledger Detail',
                component: () => import('modules/_views/accounting/ledger/detail'),
                localization_key: 'ledger_detail'
              }
            ]
          },
          {
            path: 'jurnal-log',
            name: 'Accounting Jurnal Log',
            parent: 'accounting',
            component: () => import('modules/_views/accounting/jurnal-log/index'),
            localization_key: 'accounting_jurnal_log'
          },
          {
            path: 'report',
            name: 'Report',
            parent: 'accounting',
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
                path: 'detail-all-branch',
                name: 'Accounting Report - Detail All Branch',
                component: () => import('modules/_views/accounting/report-accounting/detailAllBranch'),
                localization_key: 'accounting_report_detail_branch'
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
								path: 'cash-flow-detail-all-branch',
								name: 'Cash Flow Statement - Detail All Branch',
								component: () => import('modules/_views/accounting/report-accounting/cash-flow/detailAllBranch'),
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
            parent: 'accounting',
            component: () => import('modules/_views/accounting/stockOpname'),
            localization_key: 'accounting-stockOpname'
          },
          {
            path: 'setting',
            name: 'Setting',
            parent: 'accounting',
            component: () => import('modules/_views/accounting/setting-accounting/reset'),
            localization_key: 'setting_accounting',
          }
        ]
      },

      // Accounting 3rd
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
            parent: 'accounting-third',
            component: () => import('modules/_views/accounting/accounting-software/index'),
            localization_key: 'accounting_software',
          },
          {
            path: 'jurnal/saveToken',
            name: 'Save Token',
            parent: 'accounting-third',
            component: () => import('modules/_views/accounting/accounting-software/jurnal/saveToken'),
            props: (route) => ({ access_token: route.query.access_token }),
            localization_key: 'jurnal_save_token'
          },
          {
            path: 'jurnalNew',
            name: 'Integrate Jurnal.ID',
            parent: 'accounting-third',
            redirect: 'jurnalNew/sales',
            component: () => import('modules/_views/accounting/accounting-software/jurnal/index'),
            localization_key: 'link_jurnal',
            children: [
              {
                path: 'sales',
                name: 'Jurnal Upload Sales',
                component: () => import('modules/_views/accounting/accounting-software/jurnal/penjualan/index'),
                localization_key: 'jurnal/upload-sales'
              },{
                path: 'purchase',
                name: 'Jurnal Upload Purchase',
                component: () => import('modules/_views/accounting/accounting-software/jurnal/pembelian/index'),
                localization_key: 'jurnal/upload-purchase'
              },{
                path: 'sales-return',
                name: 'Jurnal Upload Purchase',
                component: () => import('modules/_views/accounting/accounting-software/jurnal/pengembalian/index'),
                localization_key: 'jurnal/upload-purchase'
              },{
                path: 'revenue',
                name: 'Jurnal Upload Revenue',
                component: () => import('modules/_views/accounting/accounting-software/jurnal/pendapatan/index'),
                localization_key: 'jurnal/upload-revenue'
              },{
                path: 'expense',
                name: 'Jurnal Upload Expense',
                component: () => import('modules/_views/accounting/accounting-software/jurnal/pengeluaran/index'),
                localization_key: 'jurnal/upload-expense'
              },{
                path: 'transfer-warehouse',
                name: 'Jurnal Upload Transfer Warehouse',
                component: () => import('modules/_views/accounting/accounting-software/jurnal/transferWarehouse/index'),
                localization_key: 'jurnal/upload-transfer-warehouse'
              },{
                path: 'stock-opname',
                name: 'Jurnal Upload Stock Opname',
                component: () => import('modules/_views/accounting/accounting-software/jurnal/stockOpname/index'),
                localization_key: 'jurnal/upload-stock-opname'
              },{
                path: 'stock-incoming',
                name: 'Jurnal Upload Stock Incoming',
                component: () => import('modules/_views/accounting/accounting-software/jurnal/stockIn/index'),
                localization_key: 'jurnal/upload-stock-incoming'
              }
            ]
          },
          {
            path: 'export-to-sales/detail',
            name: 'Jurnal Upload Sales Detail',
            hidden: true,
            component: () => import('modules/_views/accounting/accounting-software/jurnal/penjualan/DetailSales'),
            localization_key: 'jurnal_upload_sales_detail',
          },
          {
            path: 'export-to-purchase/detail',
            name: 'Jurnal Upload Purchase Detail',
            hidden: true,
            component: () => import('modules/_views/accounting/accounting-software/jurnal/pembelian/DetailPurchase'),
            localization_key: 'jurnal_upload_purchase_detail',
          },
          {
            path: 'accurate',
            name: 'Accurate',
            parent: 'accounting-third',
            redirect: 'accurate/sales',
            component: () => import('modules/_views/accounting/accounting-software/accurate/index'),
            localization_key: 'link_accurate',
            children: [
              {
                path: 'sales',
                name: 'Accurate Upload Sales',
                component: () => import('modules/_views/accounting/accounting-software/accurate/penjualan/index'),
                localization_key: 'accurate/upload-sales'
              },{
                path: 'purchase',
                name: 'Accurate Upload Purchase',
                component: () => import('modules/_views/accounting/accounting-software/accurate/pembelian/index'),
                localization_key: 'accurate/upload-purchase'
              },{
                path: 'sales-return',
                name: 'Accurate Upload Sales Return',
                component: () => import('modules/_views/accounting/accounting-software/accurate/pengembalian/index'),
                localization_key: 'accurate/upload-sales-return'
              },{
                path: 'revenue',
                name: 'Accurate Upload Revenue',
                component: () => import('modules/_views/accounting/accounting-software/accurate/pendapatan/index'),
                localization_key: 'accurate/upload-revenue'
              },{
                path: 'expense',
                name: 'Accurate Upload Sales Return',
                component: () => import('modules/_views/accounting/accounting-software/accurate/pengeluaran/index'),
                localization_key: 'accurate/upload-expense'
              },{
                path: 'transfer-warehouse',
                name: 'Accurate Upload Transfer Warehouse',
                component: () => import('modules/_views/accounting/accounting-software/accurate/transferWarehouse/index'),
                localization_key: 'accurate/upload-transfer-warehouse'
              },{
                path: 'stock-opname',
                name: 'Accurate Upload Stock Opname',
                component: () => import('modules/_views/accounting/accounting-software/accurate/stockOpname/index'),
                localization_key: 'accurate/upload-stock-opname'
              }
            ]
          },
          {
            path: 'accurate/saveToken',
            name: 'Accurate Save Token',
            component: () => import('modules/_views/accounting/accounting-software/accurate/saveToken'),
            props: (route) => ({ code: route.query.code }),
            localization_key: 'accurate_save_token'
          },
        ]
      },

      // Website
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
            parent: 'website',
            component: () => import('modules/_views/website/mysite/Index'),
            // redirect: 'mysite/global',
            redirect: () => {
              return getFirstShownMenus('websiteMySite')
            },
            localization_key: 'mysite',
            children: [
              {
                path: 'global',
                name: 'Global',
                component: () => import('modules/_views/website/mysite/global/Index'),
                localization_key: 'global'
              },
              {
                path: 'payment',
                name: 'OL Payment',
                component: () => import('modules/_views/website/mysite/payment/Index'),
                localization_key: 'payment_online'
              },
              {
                path: 'navigation',
                name: 'Site Navigation',
                component: () => import('modules/_views/website/mysite/navigation/Index'),
                localization_key: 'site_navigation'
              },
              {
                path: 'customdomain',
                name: 'My Domain',
                component: () => import('modules/_views/website/mysite/customdomain/Index'),
                localization_key: 'mydomain'
              },
              {
                path: 'mergestocks',
                name: 'Merge Stocks',
                component: () => import('modules/_views/website/mysite/mergestocks/Index'),
                localization_key: 'merge_stock'
              }
            ]
          },
          {
            path: 'integrations',
            name: '3rd Party integrations',
            parent: 'website',
            component: () => import('modules/_views/website/integrations/Index'),
            // redirect: 'integrations/fbstore',
            redirect: () => {
              return getFirstShownMenus('websiteIntegrations')
            },
            localization_key: 'third_party_integration',
            children: [
              {
                path: 'fbstore',
                name: 'Facebook Store',
                component: () => import('modules/_views/website/integrations/fbstore/Index'),
                localization_key: 'fb_store',
                meta: {
                  
                  
                }
              },
              {
                path: 'fbpixel',
                name: 'Facebook Pixel',
                component: () => import('modules/_views/website/integrations/fbpixel/Index'),
                localization_key: 'fb_pixel',
                meta: {
                  
                  
                }
              },
              {
                path: 'fbsso',
                name: 'Facebook SSO',
                component: () => import('modules/_views/website/integrations/fbsso/Index'),
                localization_key: 'fb_sso',
                meta: {
                  
                  
                }
              },
              {
                path: 'googleanalytics',
                name: 'Google Analytics',
                component: () => import('modules/_views/website/integrations/googleanalytics/Index'),
                localization_key: 'google_analytics',
                meta: {
                  
                  
                }
              },
              {
                path: 'mailchimp',
                name: 'Mailchimp',
                component: () => import('modules/_views/website/integrations/mailchimp/Index'),
                localization_key: 'mailchimp',
                meta: {
                  
                  
                }
              },
              {
                path: 'chatwidget',
                name: 'Chat Widget',
                component: () => import('modules/_views/website/integrations/chatwidget/Index'),
                localization_key: 'chatwidget',
                meta: {
                  
                  
                }
              }
            ]
          },
          {
            path: 'pages',
            name: 'Pages & Articles',
            parent: 'website',
            component: () => import('modules/_views/website/pages/Index'),
            // redirect: 'pages/static',
            redirect: () => {
              return getFirstShownMenus('websitePages')
            },
            localization_key: 'pages_and_articles',
            children: [
              {
                path: 'static',
                name: 'Static Pages',
                component: () => import('modules/_views/website/pages/static/Index'),
                localization_key: 'page_static',
              },
              {
                path: 'static/create',
                component: () => import('modules/_views/website/pages/static/Form'),
                meta: {
                  label: 'Create Page'
                }
              },
              {
                path: 'static/:id',
                component: () => import('modules/_views/website/pages/static/Form'),
                meta: {
                  label: 'Edit Page'
                }
              },
              {
                path: 'articles',
                name: 'Article Pages',
                component: () => import('modules/_views/website/pages/articles/Index'),
                localization_key: 'page_article'
              },
              {
                path: 'faqs',
                name: 'Faq Pages',
                component: () => import('modules/_views/website/pages/faqs/Index'),
                localization_key: 'page_faq'
              },
              {
                path: 'testimonial',
                name: 'Testimonial Pages',
                component: () => import('modules/_views/website/pages/testimonial/Index'),
                localization_key: 'page_testimonial'
              }
            ]
          },
          {
            path: 'reseller',
            name: 'Reseller',
            parent: 'website',
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

      // Customer & Supplier
      {
        path: 'customersupplier',
        name: 'Customer Supplier',
        redirect: () => {
          return getFirstShownMenus('customerSupplier')
        },
        component: () => import('modules/_views/customer-supplier/Index'),
        localization_key: 'customer_and_supplier',
        children: [
          {
            path: 'customer',
            name: 'Customer',
            parent: 'customersupplier',
            component: () => import('modules/_views/customer-supplier/customer/CustomerList'),
            localization_key: 'customers',
            
          },
          {
            path: 'customer/:id',
            name: 'Customer Detail',
            hidden: true,
            component: () => import('modules/_views/customer-supplier/customer/detail/CustomerDetail'),
            hidden: true,
            localization_key: 'customer_detail',
            
          },
          {
            path: 'customerreview',
            name: 'Customer Review',
            parent: 'customersupplier',
            component: () => import('modules/_views/customer-supplier/customer-review/CustomerReviewList'),
            localization_key: 'customer_reviews',
            
          },
          {
            path: 'customertype',
            name: 'Customer Type',
            parent: 'customersupplier',
            component: () => import('modules/_views/customer-supplier/customer-type/CustomerTypeList'),
            localization_key: 'customer_types',
            
          },
          {
            path: 'supplier',
            name: 'Supplier',
            parent: 'customersupplier',
            component: () => import('modules/_views/customer-supplier/supplier/SupplierList'),
            localization_key: 'suppliers',
            
          },
          {
            path: 'supplier/create',
            name: 'Supplier Create',
            hidden: true,
            component: () => import('modules/_views/customer-supplier/supplier/create/SupplierCreate'),
            localization_key: 'supplier_create',
            
          },
          {
            path: 'supplier/:id',
            name: 'Supplier Detail',
            hidden: true,
            component: () => import('modules/_views/customer-supplier/supplier/detail/SupplierDetail'),
            hidden: true,
            localization_key: 'supplier_detail',
            
          }
        ]
      },

      // Purchase
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
            parent: 'purchase',
            component: () => import('modules/_views/purchase/open/OpenList'),
            localization_key: 'open_purchases',
            
          },
          {
            path: 'openpurchase/create',
            name: 'Open Purchase Create',
            hidden: true,
            component: () => import('modules/_views/purchase/open/create/OpenCreate'),
            localization_key: 'purchase_create',
            
          },
          {
            path: 'openpurchase/:id',
            name: 'Open Purchase Detail',
            hidden: true,
            component: () => import('modules/_views/purchase/DetailPurchase'),
            localization_key: 'purchase_detail',
            
          },
          {
            path: 'openpurchasev2/:id',
            name: 'Open Purchase Detail',
            hidden: true,
            component: () => import('modules/_views/purchase/DetailPurchaseV2'),
            localization_key: 'purchase_detailv2',
            
          },
          {
            path: 'completepurchase',
            name: 'Complete Purchase',
            parent: 'purchase',
            component: () => import('modules/_views/purchase/complete/CompleteList'),
            localization_key: 'purchase_completed',
            
          },
          {
            path: 'completepurchase/:id',
            name: 'Complete Purchase Detail',
            hidden: true,
            component: () => import('modules/_views/purchase/DetailPurchase'),
            hidden: true,
            localization_key: 'purchase_detail',
            
          },
          {
            path: 'cancelpurchase',
            name: 'Cancel Purchase',
            parent: 'purchase',
            component: () => import('modules/_views/purchase/cancel/CancelList'),
            localization_key: 'purchases_canceled',
            
          },
          {
            path: 'cancelpurchase/:id',
            name: 'Cancel Purchase Detail',
            hidden: true,
            component: () => import('modules/_views/purchase/DetailPurchase'),
            localization_key: 'purchase_detail',
            
          }
        ]
      },

      // POS Setting
      {
        path: 'pos-settings',
        name: 'POS Settings',
        redirect: () => {
          return getFirstShownMenus('posSettings')
        },
        component: () => import('modules/_views/pos/settings/Index'),
        localization_key: 'pos_settings',
        children: [
          {
            path: 'pospaymentmodes',
            name: 'POS Payment Modes',
            parent: 'pos-settings',
            component: () => import('modules/_views/pos/settings/pospaymentmodes/Index'),
            localization_key: 'pos_paymentmodes'
          },
          {
            path: 'posdevice',
            name: 'POS Device',
            parent: 'pos-settings',
            component: () => import('modules/_views/pos/settings/posdevice/Index'),
            localization_key: 'pos_devices',
            meta: {
              
            }
          },
          {
            path: 'posreceiptnote',
            name: 'POS Receipt Note',
            parent: 'pos-settings',
            component: () => import('modules/_views/pos/settings/posreceiptnote/Index'),
            localization_key: 'pos_receipt_notes'
          },
          {
            path: 'posemailreport',
            name: 'POS Email Report',
            parent: 'pos-settings',
            component: () => import('modules/_views/pos/settings/posemailreport/Index'),
            localization_key: 'pos_email_report',
            meta: {
              
            }
          },
          {
            path: 'pospasskey',
            name: 'POS Passkey',
            parent: 'pos-settings',
            component: () => import('modules/_views/pos/settings/pospasskey/Index'),
            localization_key: 'pos_passkey',
            meta: {
              
            }
          },
          {
            path: 'posextsetting',
            name: 'POS Ext.',
            parent: 'pos-settings',
            component: () => import('modules/_views/pos/settings/posextsetting/Index'),
            localization_key: 'pos_extsetting',
            meta: {
              
            }
          },
          {
            path: 'shiftsetting',
            name: 'Shift Setting',
            parent: 'pos-settings',
            component: () => import('modules/_views/pos/settings/shiftsetting/Index'),
            localization_key: 'shift_setting',
            meta: {
              
            }
          },
          {
            path: 'posstockmode',
            name: 'POS Stock Mode',
            parent: 'pos-settings',
            component: () => import('modules/_views/pos/settings/posstockmode/Index'),
            localization_key: 'pos_stock_mode',
            meta: {
              
            }
          },
          {
            path: 'shifttime',
            name: 'POS Shift Timing',
            parent: 'pos-settings',
            component: () => import('modules/_views/pos/settings/shifttime/Index'),
            localization_key: 'pos_shift_timing',
            meta: {
              
            }
          },
          {
            path: 'shifttime/create',
            name: 'Create POS Shift Timing',
            hidden: true,
            component: () => import('modules/_views/pos/settings/shifttime/Create'),
            localization_key: 'pos_shift_timing_create',
            meta: {
              
            }
          },
          {
            path: 'postqueue',
            name: 'POS Queue',
            parent: 'pos-settings',
            component: () => import('modules/_views/pos/settings/posqueue/Index'),
            localization_key: 'pos_queue',
            meta: {
              
            }
          },
          {
            path: 'freemium',
            name: 'Freemium',
            hidden: true,
            props: { tabs: 1 },
            component: () => import('@/components/FreemiumBanner'),
            localization_key: 'freemium',
            meta: {
            }
          },
        ]
      },
      {
        path: 'begincash',
        name: 'Begin Cash',
        parent: 'point_of_sale',
        component: () => import('modules/_views/pos/begincash/Index'),
        localization_key: 'begin_cash',
      },
      {
        path: 'shiftbalance',
        name: 'Shift Balance',
        parent: 'point_of_sale',
        component: () => import('modules/_views/pos/shiftbalance/Index'),
        localization_key: 'shift_balance',
      },

      // harga ojek online
      {
        path: '/harga-ojek-online',
        component: () => import('modules/_views/pos/harga-ojekonline/index'),
        name: 'Food Delivery',
        localization_key: 'harga_ojek_online',
        meta: {
          title: 'Harga Ojek Online',
          hidden: true
        }
      },

      // Income & Expense
      {
        path: 'transaction',
        name: 'Transaction',
        parent: 'income_expense',
        component: () => import('modules/_views/income-expense/transaction/TransactionList'),
        localization_key: 'transactions',
        
      },
      {
        path: 'transaction/:id',
        name: 'Transaction Detail',
        component: () => import('modules/_views/income-expense/transaction/TransactionDetail'),
        localization_key: 'transaction_inex_detail',
      },
      {
        path: 'transaction/create-income',
        name: 'Transaction Create Income',
        hidden: true,
        component: () => import('modules/_views/income-expense/transaction/create/TransactionCreateIncome'),
        localization_key: 'transaction_create_income',
        
      },
      {
        path: 'transaction/create-expense',
        name: 'Transaction Create Expense',
        hidden: true,
        component: () => import('modules/_views/income-expense/transaction/create/TransactionCreateExpense'),
        localization_key: 'transaction_create_expense',
        
      },
      {
        path: 'transactiontype',
        name: 'Transaction Type',
        parent: 'income_expense',
        component: () => import('modules/_views/income-expense/transaction-type/TransactionTypeList'),
        localization_key: 'transaction_types',
        
      },
      {
        path: 'transactiontype/create',
        name: 'Transaction Type Create',
        hidden: true,
        component: () => import('modules/_views/income-expense/transaction-type/create/TransactionTypeCreate'),
        localization_key: 'transaction_type_create',
        
      },

      // POS Resto Mode
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
            parent: 'restomode',
            component: () => import('modules/_views/pos/restomode/posrestolayout/Index'),
            localization_key: 'resto_layout',
            meta: {
              
            }
          },
          {
            path: 'posrestolayout/:id',
            name: 'Resto Layout Detail',
            hidden: true,
            component: () => import('modules/_views/pos/restomode/posrestolayout/Layout'),
            hidden: true,
            localization_key: 'resto_layout_detail',
            meta: {
              
            }
          },
          {
            path: 'posdisabledinein',
            name: 'Dine In / Take Away',
            parent: 'restomode',
            component: () => import('modules/_views/pos/restomode/posdisabledinein/Index'),
            localization_key: 'dine_take_away',
            meta: {
              
            }
          },
          {
            path: 'poslocalserver',
            name: 'Local Server',
            parent: 'restomode',
            component: () => import('modules/_views/pos/restomode/poslocalserver/Index'),
            localization_key: 'pos_local_server',
            meta: {
              
            }
          },
          {
            path: 'posbilling',
            name: 'Billing',
            parent: 'restomode',
            component: () => import('modules/_views/pos/restomode/posbilling/Index'),
            localization_key: 'pos_billing',
            meta: {
              
            }
          },
          {
            path: 'courselinegrouping',
            name: 'Course Line Grouping',
            parent: 'restomode',
            component: () => import('modules/_views/pos/restomode/courselinegrouping/Index'),
            localization_key: 'pos_course_line_grouping',
            meta: {
              
            }
          }
        ]
      },

      // Setting Store
      {
        path: 'settings/store',
        name: 'Settings - Store',
        component: () => import('modules/_views/settings/store/Index'),
        // redirect: 'settings/store/general',
        redirect: () => {
          return getFirstShownMenus('storeSettings')
        },
        localization_key: 'store_settings',
        children: [
          {
            path: 'general',
            name: 'Store Information',
            parent: 'settings/store',
            component: () => import('modules/_views/settings/store/general/Index'),
            localization_key: 'store_information'
          },
          {
            path: 'staffs',
            name: 'Staffs',
            parent: 'settings/store',
            component: () => import('modules/_views/settings/store/staffs/Index'),
            localization_key: 'store_staffs',
            
          },
          {
            path: 'staffs-permission',
            name: 'Staffs Permission',
            parent: 'settings/store',
            component: () => import('modules/_views/settings/store/permissionAccess/Index'),
            localization_key: 'store_staffs_permission',
            meta: {
              premium: true,
              freemiumRedirect: '/settings/store/freemium'
            }
          },
          {
            path: 'storebranches',
            name: 'Store Branches',
            parent: 'settings/store',
            component: () => import('modules/_views/settings/store/storebranches/Index'),
            localization_key: 'store_branches',
            
          },
          {
            path: 'storecurrency',
            name: 'Store Currency',
            parent: 'settings/store',
            component: () => import('modules/_views/settings/store/storecurrency/Index'),
            localization_key: 'store_currency',
            
          },
          {
            path: 'freemium',
            name: 'Freemium',
            hidden: true,
            props: { tabs: 1 },
            component: () => import('@/components/FreemiumBanner'),
            localization_key: 'freemium',
            meta: {
            }
          },
        ]
      },

      // Setting Notification
      {
        path: 'settings/notification',
        name: 'Settings - Notification',
        component: () => import('modules/_views/settings/notification/Index'),
        redirect: 'settings/notification/email',
        localization_key: 'notification_settings',
        meta: {
          
          onlineShop: true,
        },
        children: [
          {
            path: 'email',
            name: 'Email Notification',
            parent: 'settings/notification',
            component: () => import('modules/_views/settings/notification/email/Index'),
            localization_key: 'email_notifications',
            
          },
          {
            path: 'sms',
            name: 'SMS Notification',
            parent: 'settings/notification',
            component: () => import('modules/_views/settings/notification/sms/Index'),
            localization_key: 'sms_notifications',
            
          }
        ]
      },

      // Setting Loyaltypoint
      {
        path: 'settings/loyaltypoint',
        name: 'Settings - Loyalty Point',
        component: () => import('modules/_views/settings/loyaltypoint/Index'),
        localization_key: 'setting_lpoint',
        meta: {
          
          onlineShop: true,
          
        },
      },
      {
        path: 'settings/publishstore',
        name: 'Settings - Publish',
        component: () => import('modules/_views/settings/publishstore/Index'),
        localization_key: 'setting_publish_store',
        meta: {
          
          onlineShop: true,
          
        },
      },
      {
        path: 'settings/paymentrounding',
        name: 'Settings - Payment Rounding',
        component: () => import('modules/_views/settings/rounding/index'),
        localization_key: 'payment_rounding',
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
          
          onlineShop: true,
          
        },
        localization_key: 'shippings',
        children: [
          {
            path: 'general',
            name: 'Shippings - General',
            parent: 'settings/shippings',
            component: () => import('modules/_views/settings/shippings/general/Index'),
            localization_key: 'shipping_general',
            meta: {
              
              onlineShop: true,
              
            },
          },
          {
            path: 'postalcodes',
            name: 'Shippings - Postal Codes',
            parent: 'settings/shippings',
            component: () => import('modules/_views/settings/shippings/postalcodes/Index'),
            localization_key: 'shipping_postal_codes',
            meta: {
              
              onlineShop: true,
              
            },
          },
          {
            path: 'rates/:id',
            name: 'Shipping Rates',
            hidden: true,
            component: () => import('modules/_views/settings/shippings/shippingrates/Index'),
            props: (route) => ({ query: route.query.q }),
            hidden: true,
            localization_key: 'shipping_rates',
            meta: {
              
              onlineShop: true,
              
            },
          },
          {
            path: 'postalcodes/rates/:id',
            name: 'Postalcodes Rates',
            hidden: true,
            component: () => import('modules/_views/settings/shippings/postalcodes/Rates'),
            hidden: true,
            localization_key: 'postal_codes_rates',
            meta: {
              
              onlineShop: true,
              
            },
          }
        ]
      },
      {
        path: 'settings/tax',
        name: 'Settings - Tax',
        component: () => import('modules/_views/settings/tax/Index'),
        localization_key: 'tax_settings'
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
          parent: 'mobileapp',
          component: () => import('modules/_views/mobile-app/navigation/Index'),
          localization_key: 'mobile_app_navigation'
        }, {
          path: 'banner',
          name: 'Banner',
          parent: 'mobileapp',
          component: () => import('modules/_views/mobile-app/banner/Index'),
          localization_key: 'mobile_app_banner'
        }, {
          path: 'payment',
          name: 'Payment',
          parent: 'mobileapp',
          component: () => import('modules/_views/mobile-app/payment/Index'),
          localization_key: 'mobile_app_payment'
        }, {
          path: 'more-settings',
          name: 'More Settings',
          parent: 'mobileapp',
          component: () => import('modules/_views/mobile-app/more-settings/index'),
          localization_key: 'mobile_app_more_settings'
        }]
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('modules/_views/profile/Index'),
        localization_key: 'profile'
      },

      // Reports
      {
        path: 'reports',
        name: 'Reports',
        component: () => import('modules/_views/reports/Index'),
        redirect: () => {
          return getFirstShownMenus('reports')
        },
        localization_key: 'reports_list',
        children: [
          {
            path: 'products',
            name: 'Products Report',
            parent: 'reports',
            component: () => import('modules/_views/reports/products/Index'),
            props: (route) => ({ query: route.query.path }),
            localization_key: 'reports_products'
          },
          {
            path: 'payments',
            name: 'Payment Report',
            parent: 'reports',
            component: () => import('modules/_views/reports/payments/Index'),
            localization_key: 'reports_payment'
          },
          {
            path: 'purchases',
            name: 'Purchases Report',
            parent: 'reports',
            component: () => import('modules/_views/reports/purchases/Index'),
            localization_key: 'reports_purchases'
          },
          {
            path: 'sales',
            name: 'Sales Report',
            parent: 'reports',
            component: () => import('modules/_views/reports/sales/Index'),
            localization_key: 'reports_sales'
          },
          {
            path: 'shifts',
            name: 'Shifts Report',
            parent: 'reports',
            component: () => import('modules/_views/reports/shifts/Index'),
            localization_key: 'reports_shifts'
          },
          {
            path: 'multioutlets',
            name: 'Multi Outlets',
            parent: 'reports',
            component: () => import('modules/_views/reports/multioutlets/Index'),
            localization_key: 'reports_multioutlets'
          },
          {
            path: 'attendance',
            name: 'Attendance Report',
            parent: 'reports',
            component: () => import('modules/_views/reports/attendance/Index'),
            localization_key: 'reports_attendance'
          },
          {
            path: 'salestaxrole',
            name: 'Sales Report',
            parent: 'reports',
            component: () => import('modules/_views/reports/salestaxrole/Index'),
            localization_key: 'sales_report'
          },
          {
            path: 'freemium',
            name: 'Freemium',
            hidden: true,
            props: { tabs: 1 },
            component: () => import('@/components/FreemiumBanner'),
            localization_key: 'freemium',
            meta: {
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

      // Service Activation V2
      {
        path: 'service-activation-v2',
        name: 'Service Activation V2',
        component: () => import('modules/_views/service-activation/index'),
        localization_key: 'service_activation',
        meta: {
          label: 'Service Activation'
        },
        children: [
          {
            path: 'grabfood/setup/:id',
            name: 'Grabfood - Setup',
            hidden: true,
            component: () => import('modules/_views/service-activation/grabfood/setup'),
            localization_key: 'grabfood_setup'
          },
          {
            path: 'grabfood/manage',
            name: 'Grabfood - Manage',
            hidden: true,
            redirect: 'grabfood/manage/menu',
            component: () => import('modules/_views/service-activation/grabfood/manageV2'),
            localization_key: 'grabfood_manage',
            children: [
              {
                path: 'menu',
                name: 'Grabfood Menu',
                parent: 'grabfood',
                component: () => import('modules/_views/service-activation/grabfood/_menu'),
                localization_key: 'grabfood_menu',
              },
              {
                path: 'promotions',
                name: 'Grabfood Promotions',
                parent: 'grabfood',
                component: () => import('modules/_views/service-activation/grabfood/_promotions'),
                localization_key: 'grabfood_promotions',
              },
              {
                path: 'resto',
                name: 'Grabfood Resto',
                parent: 'grabfood',
                component: () => import('modules/_views/service-activation/grabfood/_resto'),
                localization_key: 'grabfood_resto',
              },
            ]
          },
          {
            path: 'tokopedia/manage',
            name: 'Tokopedia - Manage',
            hidden: true,
            component: () => import('modules/_views/service-activation/tokopedia/manage'),
            localization_key: 'tokopedia_manage'
          },
          {
            path: 'shopee/manage',
            name: 'Shopee - Manage',
            hidden: true,
            component: () => import('modules/_views/service-activation/shopee/manage'),
            localization_key: 'shopee_manage'
          },
          {
            path: 'lazada/manage',
            name: 'Lazada - Manage',
            hidden: true,
            component: () => import('modules/_views/service-activation/lazada/manage'),
            localization_key: 'lazada_manage'
          },
          {
            path: 'blibli/manage',
            name: 'blibli - Manage',
            hidden: true,
            component: () => import('modules/_views/service-activation/blibli/manage'),
            localization_key: 'blibli_manage'
          },
          {
            path: 'bukalapak/manage',
            name: 'Bukalapak - Manage',
            hidden: true,
            component: () => import('modules/_views/service-activation/bukalapak/manage'),
            localization_key: 'bukalapak_manage'
          },
          {
            path: 'commbank-bizloan',
            name: 'CommBank BizLoan',
            hidden: true,
            component: () => import('modules/_views/service-activation/funding/commbank/index'),
            meta: {
              roles_except: ['AS','LW','PO','PS','PT','RP','SA','SP','SS','ST'],
              store_age_month: 6
            }
          },
          {
            path: 'commbank-bizloan-history',
            name: 'CommBank BizLoan History Funding',
            hidden: true,
            component: () => import('modules/_views/service-activation/funding/commbank/_historyFunding')
          },
          {
            path: 'koinworks',
            name: 'KoinWorks',
            hidden: true,
            component: () => import('modules/_views/service-activation/funding/koinworks/index'),
            meta: {
              roles_except: ['AS','LW','PO','PS','PT','RP','SA','SP','SS','ST'],
              store_age_month: 6
            },
          },
          {
            path: 'koinworks-history',
            name: 'KoinWorks History Funding',
            hidden: true,
            component: () => import('modules/_views/service-activation/funding/koinworks/_historyFunding'),
            meta: {
              roles_except: ['AS','LW','PO','PS','PT','RP','SA','SP','SS','ST'],
              store_age_month: 6
            }
          },
          {
            path: 'bfi-finance',
            name: 'BFI Finance',
            hidden: true,
            component: () => import('modules/_views/service-activation/funding/bfi-finance/index'),
            meta: {
              roles_except: ['AS','LW','PO','PS','PT','RP','SA','SP','SS','ST'],
              store_age_month: 6
            }
          },
          {
            path: 'bfi-finance-history',
            name: 'BFI Finance History Funding',
            hidden: true,
            component: () => import('modules/_views/service-activation/funding/bfi-finance/_historyFunding'),
            meta: {
              roles_except: ['AS','LW','PO','PS','PT','RP','SA','SP','SS','ST'],
              store_age_month: 6
            }
          },
          {
            path: 'lazada/callbacklazada',
            name: 'Callback Lazada',
            hidden: true,
            component: () => import('modules/_views/service-activation/lazada/callbackLazada'),
            localization_key: 'callback_lazada'
          },
          {
            path: 'bukalapak/callbackbukalapak',
            name: 'Callback Bukalapak',
            hidden: true,
            component: () => import('modules/_views/service-activation/bukalapak/callbackbukalapak'),
            localization_key: 'callback_bukalapak'
          },
        ]
      },

      // Settlement
      {
        path: 'settlement',
        name: 'Settlement',
        component: () => import('modules/_views/settlement/index'),
        redirect: 'settlement/settlement-list',
        localization_key: 'settlement',
        children: [
          {
            path: 'settlement-list',
            name: 'Settlement List',
            parent: 'settlement',
            component: () => import('modules/_views/settlement/settlement-list'),
            localization_key: 'settlement_list',
          },
          {
            path: 'online-order',
            name: 'Settlement Online Order',
            parent: 'settlement',
            component: () => import('modules/_views/settlement/online-order'),
            localization_key: 'settlement_online_order',
          },
        ]
      },

      // Attendance
      {
        path: 'attendance',
        name: 'Attendance',
        component: () => import('modules/_views/attendance/index'),
        redirect: 'attendance/employee',
        localization_key: 'attendance',
        // meta: {
        //   
        // },
        children: [
          {
            path: 'employee',
            name: 'Employee',
            parent: 'attendance',
            component: () => import('modules/_views/attendance/employee'),
            localization_key: 'employee',
            // meta: {
            //   
            // },
          },
          {
            path: 'shift',
            name: 'Shift',
            parent: 'attendance',
            component: () => import('modules/_views/attendance/shift'),
            localization_key: 'shift'
          },
          {
            path: 'presence',
            name: 'Presence',
            parent: 'attendance',
            component: () => import('modules/_views/attendance/presence'),
            localization_key: 'presence'
          },
          {
            path: 'devices',
            name: 'Devices',
            parent: 'attendance',
            component: () => import('modules/_views/attendance/devices'),
            localization_key: 'devices'
          }
        ]
      },

      // Online Order
      {
        path: 'online-order',
        name: 'Online Order',
        component: () => import('modules/_views/online-order/index'),
        redirect: 'online-order/working-hours',
        localization_key: 'online_order',
        children: [
          {
            path: 'working-hours',
            name: 'Working Hours',
            parent: 'online-order',
            component: () => import('modules/_views/online-order/working-hours'),
            localization_key: 'working_hours'
          },
          {
            path: 'delivery',
            name: 'Delivery',
            parent: 'online-order',
            component: () => import('modules/_views/online-order/delivery'),
            localization_key: 'delivery'
          },
          {
            path: 'service',
            name: 'Service',
            parent: 'online-order',
            component: () => import('modules/_views/online-order/service'),
            localization_key: 'service'
          },
          {
            path: 'setting',
            name: 'Setting',
            parent: 'online-order',
            component: () => import('modules/_views/online-order/setting'),
            localization_key: 'setting'
          },
          {
            path: 'dinein',
            name: 'Dine In',
            parent: 'online-order',
            component: () => import('modules/_views/online-order/dinein'),
            localization_key: 'dinein'
          },
          {
            path: 'reservation',
            name: 'Reservation',
            parent: 'online-order',
            component: () => import('modules/_views/online-order/reservation'),
            localization_key: 'reservation'
          },
          {
            path: 'freemium',
            name: 'Freemium',
            hidden: true,
            props: { tabs: 1 },
            component: () => import('@/components/FreemiumBanner'),
            localization_key: 'freemium'
          }
        ]
      },

      {
        path: '/marketing/design-promotions',
        name: 'Design Promotions',
        component: () => import('modules/_views/marketing/DesignPromotions'),
        localization_key: 'design_promotions',
      },
      {
        path: '/marketing/invite-member',
        name: 'Invite Member',
        component: () => import('modules/_views/marketing/InviteMember'),
        localization_key: 'invite_member',
      },
      {
        path: '/marketing/promotions-material',
        name: 'Download Promotions Material',
        component: () => import('modules/_views/marketing/DownloadMaterial'),
        localization_key: 'download_promotions_material',
      },

      {
        path: '/whatsnew',
        component: () => import('modules/_views/whatsnew/Index'),
        name: 'What\'s New',
        meta: {
          title: 'What\'s New',
          hidden: true
        }
      },

      {
        path: '/tutorial',
        component: () => import('modules/_views/tutorial/index'),
        name: 'Tutorial\'s',
        meta: {
          title: 'Tutorial\'s',
          hidden: true
        }
      },
      {
        path: '/join-partner',
        component: () => import('modules/_views/partnership/index'),
        name: 'Join Partner',
        hidden: true,
        meta: {
          title: 'Join Partner',
          hidden: true
        }
      },
      {
        path: '/not-found',
        component: () => import('modules/_views/error-pages/NotFound')
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
        
      },
      {
        path: 'payments',
        name: 'Payment Report Mobile',
        component: () => import('modules/_views/reports/payments/Index'),
        
      },
      {
        path: 'purchases',
        name: 'Purchases Report Mobile',
        component: () => import('modules/_views/reports/purchases/Index'),
        
      },
      {
        path: 'sales',
        name: 'Sales Report Mobile',
        component: () => import('modules/_views/reports/sales/Index'),
        
      },
      {
        path: 'shifts',
        name: 'Shifts Report Mobile',
        component: () => import('modules/_views/reports/shifts/Index'),
        
      },
      {
        path: 'multioutlets',
        name: 'Multi Outlets Report Mobile',
        component: () => import('modules/_views/reports/multioutlets/Index'),
        
      },
      {
        path: 'attendance',
        name: 'Attendance Report Mobile',
        component: () => import('modules/_views/reports/attendance/Index'),
        
      },
      {
        path: 'salestaxrole',
        name: 'Sales Report',
        component: () => import('modules/_views/reports/salestaxrole/Index'),
        
      },
      {
        path: 'freemium',
        name: 'Freemium',
        props: { tabs: 1 },
        component: () => import('@/components/FreemiumBanner')
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
  },
  {
    path: '/webview-unauthorized',
    name: 'WebviewUnauthorized',
    component: () => import('./components/modules/webview/Unauthorized')
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('./components/modules/_views/reset-password/Index')
  },
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
