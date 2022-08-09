<template>
  <aside class="main-sidebar">
    <section class="sidebar">
      <div
        v-loading="loading"
        :class="!btnprofile ? 'user-panel' : 'user-panel user-panel--active'">
        <el-dropdown
          :class="'dropdown-user'"
          trigger="click"
          @command="handleMenuCommand"
          @visible-change="handleDropdown">
          <div class="flex-container w-fit">
            <div>
              <el-avatar
                v-if="loggedInUser"
                :src="loggedInUser.photo"
                :size="40"
              />
            </div>
            <div :class="percentageAll.show ? 'info-with-percentage' : 'info'">
              <div class="flex-container">
                <h5>{{ loggedInUser.name }}</h5>
                <template v-if="!percentageAll.show">
                  <svg-icon icon-class="icon-verified-profilestore" class="ml-8" />
                </template>
              </div>
              <span>{{ selectedStore.role_name }}</span>
            </div>
            <div v-if="!isCollapse" class="mr-4">
              <el-progress v-if="percentageAll.show" type="circle" :percentage="percentageAll.percentage" :width="40" color="#A1F176" class="progress-profile" :stroke-width="7"></el-progress>
            </div>
            <div> 
              <el-button v-if="!btnprofile" type="text" size="mini" icon="el-icon-caret-bottom"></el-button>
              <el-button v-else type="text" size="mini" icon="el-icon-caret-top"></el-button>
            </div>
          </div>
          <el-dropdown-menu
            slot="dropdown">
            <el-dropdown-item command="1" style="padding: 10px 10px !important">
              <div class="flex-container">
                <div class="flex-container full-width">
                  <div class="container-icon">
                    <svg-icon icon-class="user"></svg-icon>
                  </div>
                  <span> {{ lang.profile }}</span>
                </div>
                <el-progress v-if="percentageProfile.show" type="circle" :percentage="percentageProfile.percentage" width="40" color="#A1F176" class="progress-store" :stroke-width="5"></el-progress>
                <div v-else class="container-icon">
                  <svg-icon icon-class="icon-verified-profilestore" />
                </div>
              </div>
            </el-dropdown-item>
            <el-dropdown-item command="5">
              <div class="flex-container">
                <div class="flex-container full-width">
                  <div class="container-icon">
                    <svg-icon icon-class="home" />
                  </div>
                  <span>Toko</span>
                </div>
                <el-progress v-if="percentageProfileStore.show" type="circle" :percentage="percentageProfileStore.percentage" :width="40" color="#A1F176" class="progress-store" :stroke-width="5"></el-progress>
                <div v-else class="container-icon">
                  <svg-icon icon-class="icon-verified-profilestore" />
                </div>
              </div>
            </el-dropdown-item>
            <el-dropdown-item
              v-if="selectedStore.role_id === 'OW' && selectedStore.plan_type_id !== 'P'"
              command="4"
              style="padding: 10px 10px !important">
              <div class="flex-container">
                <div class="container-icon">
                  <svg-icon icon-class="plus" />
                </div>
                <span>Upgrade Toko</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item command="3" style="padding: 10px 10px !important; background-color: #FEE8E6">
              <div class="flex-container color-danger" @click="logOut">
                <div class="container-icon">
                  <svg-icon icon-class="log-out"></svg-icon>
                </div>
                <span class="font-bold"> {{ $lang[langId].logout }}</span>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <perfect-scrollbar class="ps-sidebar">
        <el-menu
          v-if="selectedStore.role_id === 'PJ'"
          :router="true"
          :collapse="isCollapse"
          :unique-opened="false"
          class="olsera-main-menu">
          <router-link
            to="/reports/salestaxrole">
            <el-menu-item
              class="olsera-menu-item">
              <svg-icon icon-class="report_ico" />
              <span slot="title">{{ lang.reports }}</span>
            </el-menu-item>
          </router-link>
        </el-menu>
        <el-menu
          v-else
          :router="true"
          :collapse="isCollapse"
          :unique-opened="false"
          class="olsera-main-menu">
          <el-menu-item class="olsera-menu-item" @click="switchOldVersion">
            <svg-icon icon-class="toggle-right" class="font-20"></svg-icon>
            <span slot="title">{{ $lang[langId].switch_v1 }}</span>
          </el-menu-item>

          <router-link to="/whatsnew">
            <el-menu-item class="olsera-menu-item">
              <svg-icon icon-class="gift" class="font-20" />
              <span slot="title">{{ $lang[langId].whatsnew }}</span>
              <span
                v-if="$store.state.whatsnewHighlight"
                class="olsera-menu-item--new">
                {{ $lang[langId].new }}
              </span>
            </el-menu-item>
          </router-link>

          <router-link
            v-if="checkCustomPermission('dashboard', 'index')"
            to="/dashboard">
            <el-menu-item class="olsera-menu-item">
              <svg-icon icon-class="dashboard_ico" />
              <span slot="title">{{ lang.dashboard }}</span>
              <plan-type-chip
                v-if="selectedStore.is_pos"
                :plan-type-id="selectedStore.plan_type_id"
                :class="selectedStore.pos_left_label">
                {{ selectedStore.pos_left }}
              </plan-type-chip>
              <plan-type-chip
                v-if="selectedStore.is_onlineshop && !selectedStore.is_pos"
                :class="selectedStore.store_left_label"
                plan-type-id="is_onlineshop">
                {{ selectedStore.store_left }}
              </plan-type-chip>
            </el-menu-item>
          </router-link>

          <div class="menu-divider" />

          <!-- katalog -->
          <el-submenu
            v-if="canAccess(selectedStore.role_id, 'catalog')"
            index="treemenu-catalog"
            class="olsera-menu-item">
            <template slot="title">
              <svg-icon icon-class="catalog_ico"></svg-icon>
              <span slot="title">{{ lang.catalog }}</span>
            </template>

            <router-link
              v-if="canAccess(selectedStore.role_id, 'product') && checkParentMenuCustomPermission('products', 'index').visible"
              to="/catalog">
              <el-menu-item index="/catalog/product">
                <span slot="title">{{ lang.product }}</span>
              </el-menu-item>
            </router-link>

            <router-link
              v-if="canAccess(selectedStore.role_id, 'inventory') && checkParentMenuCustomPermission('inventory', 'index').visible"
              to="/inventory">
              <el-menu-item index="/inventory">
                <span slot="title">{{ lang.inventory }}</span>
              </el-menu-item>
            </router-link>

            <router-link
              v-if="accessDepositByStore.includes(selectedStore.url_id)"
              to="/catalog/deposit">
              <el-menu-item index="/catalog/deposit">
                <span slot="title">Deposit</span>
              </el-menu-item>
            </router-link>

            <router-link
              v-if="(selectedStore.role_id !== 'SS' &&
              selectedStore.role_id !== 'PT' &&
              selectedStore.role_id !== 'LW') && checkParentMenuCustomPermission('specialType', 'index').visible"
              :class="methodRouteIsHiddenSidebarMenuClass('/specialtype')"
              to="/specialtype">
              <el-menu-item index="/specialtype">
                <span>{{ $lang[langId].special_type }}</span>
              </el-menu-item>
            </router-link>

            <router-link
              v-if="checkCustomPermission('catalog/printbarcode', 'index')"
              :class="methodRouteIsHiddenSidebarMenuClass('/catalog/barcode')"
              to="/catalog/barcode">
              <el-menu-item index="/catalog/barcode">
                <span>{{ lang.print_product_barcode }}</span>
              </el-menu-item>
            </router-link>
          </el-submenu>

          <!-- marketing -->
          <template
            v-if="(selectedStore.role_id !== 'RP' &&
            selectedStore.role_id !== 'PT' &&
            selectedStore.role_id !== 'LW' &&
            selectedStore.role_id !== 'SA' &&
            selectedStore.role_id !== 'SS') && checkCustomPermission('promotion', 'index')">
            <el-submenu
              index="/marketing"
              class="olsera-menu-item">
              <template slot="title">
                <svg-icon icon-class="toa_ico"></svg-icon>
                <span slot="title">{{ rootLang.marketing }}</span>
              </template>

              <router-link
                v-if="(selectedStore.role_id !== 'ST' &&
                selectedStore.role_id !== 'RP' &&
                selectedStore.role_id !== 'SA' &&
                selectedStore.role_id !== 'SS' &&
                selectedStore.role_id !== 'PT' &&
                selectedStore.role_id !== 'LW') && checkParentMenuCustomPermission('marketingDiscount', 'index').visible"
                :class="methodRouteIsHiddenSidebarMenuClass('/promotions')"
                to="/promotions">
                <el-menu-item
                  index="/promotions">
                  <span slot="title">{{ lang.discounts }}</span>
                </el-menu-item>
              </router-link>

              <router-link
                v-if="stageLevel === 'sit' || loggedInUser.email === 'akmal@olsera.com'"
                to="/marketing/design-promotions">
                <el-menu-item
                  index="/marketing/design-promotions">
                  <span slot="title">
                    {{ rootLang.design_promotions }}
                  </span>
                </el-menu-item>
              </router-link>

              <router-link
                v-if="stageLevel === 'sit' || loggedInUser.email === 'akmal@olsera.com'"
                to="/marketing/invite-member">
                <el-menu-item
                  index="/marketing/invite-member">
                  <span slot="title">
                    {{ rootLang.invite_member }}
                  </span>
                </el-menu-item>
              </router-link>

              <router-link
                to="/marketing/promotions-material">
                <el-menu-item
                  index="/marketing/promotions-material">
                  <span slot="title">
                    {{ rootLang.download_promotions_material }}
                  </span>
                </el-menu-item>
              </router-link>
            </el-submenu>
          </template>

          <!-- customer supplier -->
          <router-link
            v-if="canAccess(selectedStore.role_id, 'customer') && checkParentMenuCustomPermission('customerSupplier', 'index').visible"
            :class="methodRouteIsHiddenSidebarMenuClass('/customersupplier')"
            to="/customersupplier">
            <el-menu-item
              class="olsera-menu-item">
              <svg-icon icon-class="customer_ico" />
              <span slot="title">
                {{ lang.customer }} & {{ lang.supplier }}
              </span>
            </el-menu-item>
          </router-link>

          <div class="menu-divider" />

          <!-- sales order -->
          <router-link
            v-if="canAccess(selectedStore.role_id, 'sales') && checkParentMenuCustomPermission('salesOrder', 'index').visible"
            to="/sales">
            <el-menu-item
              index="/sales"
              class="olsera-menu-item">
              <svg-icon icon-class="sale_ico"></svg-icon>
              <span slot="title">{{ lang.sales }}</span>
            </el-menu-item>
          </router-link>

          <!-- purchase -->
          <router-link
            v-if="checkParentMenuCustomPermission('purchase', 'index').visible"
            :class="methodRouteIsHiddenSidebarMenuClass('/purchase', false)"
            to="/purchase">
            <el-menu-item class="olsera-menu-item">
              <svg-icon icon-class="order_ico"></svg-icon>
              <span slot="title">{{ lang.purchase }}</span>
            </el-menu-item>
          </router-link>

          <!-- pendapatan pengeluaran -->
          <el-submenu
            v-if="canAccess(selectedStore.role_id, 'income') && checkParentMenuCustomPermission('inex', 'index').visible"
            index="treemenu-revenue-expense"
            class="olsera-menu-item">
            <template slot="title">
              <svg-icon icon-class="income_ico"></svg-icon>
              <span slot="title">{{lang.revenue}}/{{lang.expense}}</span>
            </template>
            <router-link
              v-if="checkCustomPermission('inex/inextrans', 'index')"
              :class="methodRouteIsHiddenSidebarMenuClass('/transaction')"
              to="/transaction">
              <el-menu-item>
                <span slot="title">{{lang.transactions}}</span>
              </el-menu-item>
            </router-link>
            <router-link
              v-if="checkCustomPermission('inex/inextranstype', 'index')"
              :class="methodRouteIsHiddenSidebarMenuClass('/transactiontype')"
              to="/transactiontype">
              <el-menu-item>
                <span slot="title">{{ lang.transaction_type }}</span>
              </el-menu-item>
            </router-link>
          </el-submenu>

          <!-- laporan -->
          <router-link
            v-if="canAccess(selectedStore.role_id, 'report') && checkParentMenuCustomPermission('reports', 'index').visible"
            to="/reports">
            <el-menu-item
              class="olsera-menu-item">
              <svg-icon icon-class="report_ico" />
              <span slot="title">{{ lang.reports }}</span>
            </el-menu-item>
          </router-link>

          <!-- Accounting -->
            <el-submenu
              v-if="accountingAccess(selectedStore.role_id) && selectedStore.plan_type_id !== 'W'"
              :class="methodRouteIsHiddenSidebarMenuClass('/accounting')"
              index="treemenu-accounting"
              class="olsera-menu-item">
            <template slot="title">
              <svg-icon icon-class="accounting_ico"></svg-icon>
              <span slot="title">{{ $lang[langId].olsera_accounting }}</span>
            </template>
            <router-link
              to="/accounting/setting">
              <el-menu-item index="/accounting/setting">
                <span slot="title">{{ $lang[langId].accounting_setting}}</span>
              </el-menu-item>
            </router-link>
            <router-link  v-if="selectedStore.role_id === 'OW' || selectedStore.role_id === 'SP' || selectedStore.role_id === 'RP' || selectedStore.role_id === 'PJ'"
              to="/accounting/chartaccount">
              <el-menu-item index="/accounting/chartaccount">
                <span slot="title">{{ $lang[langId].list_of_account }}</span>
              </el-menu-item>
            </router-link>
            <router-link
              to="/accounting/ledger">
              <el-menu-item index="/accounting/ledger">
                <span slot="title">{{ $lang[langId].journal}} x {{ $lang[langId].ledger }}</span>
              </el-menu-item>
            </router-link>
            <router-link
              to="/accounting/cash-bank">
              <el-menu-item index="/accounting/cash-bank">
                <span slot="title">{{ $lang[langId].cash_n_bank }}</span>
              </el-menu-item>
            </router-link>
            <router-link
              to="/accounting/pos-transaction">
              <el-menu-item index="/accounting/pos-transaction">
                <span slot="title">{{ $lang[langId].pos_transaction }}</span>
              </el-menu-item>
            </router-link>
            <router-link
              to="/accounting/receivable">
              <el-menu-item index="/accounting/receivable">
                <span slot="title">{{ $lang[langId].receivable }}</span>
              </el-menu-item>
            </router-link>
            <router-link
              to="/accounting/payable">
              <el-menu-item index="/accounting/payable">
                <span slot="title">{{ $lang[langId].payable }}</span>
              </el-menu-item>
            </router-link>
            <router-link
              to="/accounting/asset">
              <el-menu-item index="/accounting/asset">
                <span slot="title">{{ $lang[langId].asset }}</span>
              </el-menu-item>
            </router-link>
            <router-link
              to="/accounting/expense">
              <el-menu-item index="/accounting/expense">
                <span slot="title">{{ $lang[langId].expenses }}</span>
              </el-menu-item>
            </router-link>
            <router-link
              to="/accounting/jurnal-log">
              <el-menu-item index="/accounting/jurnal-log">
                <span slot="title">{{ $lang[langId].jurnal_log }}</span>
              </el-menu-item>
            </router-link>
            <router-link  v-if="selectedStore.role_id === 'OW' || selectedStore.role_id === 'SP' || selectedStore.role_id === 'RP' || selectedStore.role_id === 'PJ'"
              to="/accounting/report">
              <el-menu-item index="/accounting/report">
                <span slot="title">{{ $lang[langId].accounting_reports }}</span>
              </el-menu-item>
            </router-link>
            <router-link
              to="/accounting/closing">
              <el-menu-item index="/accounting/closing">
                <span slot="title">{{ $lang[langId].closing_book }}</span>
              </el-menu-item>
            </router-link>
          </el-submenu>

          <!-- accounting 3rd party -->
          <router-link
            :class="methodRouteIsHiddenSidebarMenuClass('/accounting-third')"
            to="/accounting-third">
            <el-menu-item index="/accounting-third" class="olsera-menu-item">
              <svg-icon icon-class="accounting_ico"></svg-icon>
              <span slot="title">{{$lang[langId].accounting_3rd_party}}</span>
            </el-menu-item>
          </router-link>

          <div class="menu-divider" />

          <!-- POS -->
          <el-submenu
            v-if="selectedStore.is_pos && canAccess(selectedStore.role_id, 'pos')"
            index="treemenu-pos"
            class="olsera-menu-item">
            <template slot="title">
              <svg-icon icon-class="pos_ico"></svg-icon>
              <span slot="title">{{ lang.point_of_sale }}</span>
            </template>

            <router-link
              v-if="checkParentMenuCustomPermission('posSettings', 'index').visible"
              to="/pos-settings">
              <el-menu-item>
                <span slot="title">{{ $lang[langId].pos_setting }}</span>
              </el-menu-item>
            </router-link>

            <router-link
              v-if="selectedStore.pos_resto_mode && selectedStore.role_id !== 'LW' && checkCustomPermission('settings/posrestolayout', 'index')"
              :class="methodRouteIsHiddenSidebarMenuClass('/restomode')"
              to="/restomode">
              <el-menu-item>
                <span slot="title" :style="langId === 'id' ? 'font-size: 15px' : ''">
                  {{ lang.restaurant_mode_settings }}
                </span>
              </el-menu-item>
            </router-link>

            <router-link
              v-if="selectedStore.role_id !== 'LW' && checkCustomPermission('settings/begincash', 'index')"
              to="/begincash">
              <el-menu-item>
                <span slot="title">{{ lang.daily_cash_balance }} (V1)</span>
              </el-menu-item>
            </router-link>

            <router-link
              v-if="selectedStore.role_id !== 'LW' && checkCustomPermission('settings/shiftbalance', 'index')"
              to="/shiftbalance">
              <el-menu-item>
                <span slot="title">{{ lang.shift_summary }} (V2)</span>
              </el-menu-item>
            </router-link>

            <!-- Harga Ojek Online -->
            <template>
              <router-link
                :class="methodRouteIsHiddenSidebarMenuClass('/harga-ojek-online')"
                to="/harga-ojek-online">
                <el-menu-item class="olsera-menu-item">
                  <span slot="title">Food delivery</span>
                </el-menu-item>
              </router-link>
            </template>
          </el-submenu>

          <!-- website -->
          <template
            v-if="(selectedStore.role_id !== 'ST' &&
            selectedStore.role_id !== 'RP' &&
            selectedStore.role_id !== 'SA' &&
            selectedStore.role_id !== 'SS' &&
            selectedStore.role_id !== 'PT' &&
            selectedStore.role_id !== 'LW') && checkCustomPermission('website', 'index')">
            <el-submenu
              index="treemenu-website"
              class="olsera-menu-item">
              <template slot="title">
                <svg-icon icon-class="shopbag_ico"></svg-icon>
                <span slot="title">{{ lang.website }}</span>
              </template>
              <router-link
                v-if="checkParentMenuCustomPermission('websiteMySite', 'index').visible"
                :class="methodRouteIsHiddenSidebarMenuClass('/website/mysite', selectedStore.is_onlineshop)"
                to="/website/mysite">
                <el-menu-item>
                  <span slot="title">{{ lang.my_site }}</span>
                </el-menu-item>
              </router-link>
              <router-link
                v-if="checkParentMenuCustomPermission('websitePages', 'index').visible"
                :class="methodRouteIsHiddenSidebarMenuClass('/website/pages', selectedStore.is_onlineshop)"
                to="/website/pages">
                <el-menu-item>
                  <span slot="title">{{ lang.page }} & {{ lang.article }}</span>
                </el-menu-item>
              </router-link>
              <router-link
                v-if="checkParentMenuCustomPermission('websiteIntegrations', 'index').visible"
                :class="methodRouteIsHiddenSidebarMenuClass('/website/integrations', selectedStore.is_onlineshop)"
                to="/website/integrations">
                <el-menu-item>
                  <span slot="title">{{ $lang[langId].third_party_integration }}</span>
                </el-menu-item>
              </router-link>
              <router-link
                v-if="selectedStore.accept_reseller && selectedStore.role_id !== 'ST'"
                to="/website/reseller">
                <el-menu-item>
                  <span slot="title">{{ lang.resellers }}</span>
                </el-menu-item>
              </router-link>
            </el-submenu>
          </template>

          <!-- mobile app -->
          <el-submenu
            v-if="selectedStore.role_id !== 'ST' &&
            selectedStore.role_id !== 'RP' &&
            selectedStore.role_id !== 'SA' &&
            selectedStore.role_id !== 'SS' &&
            selectedStore.role_id !== 'PT' &&
            selectedStore.role_id !== 'LW' &&
            selectedStore.is_mobile !== 0"
            index="treeview-mobileapp"
            class="olsera-menu-item">
            <template slot="title">
              <svg-icon icon-class="app_ico"></svg-icon>
              <span slot="title">{{ lang.mobile_app }}</span>
            </template>
            <router-link
              v-if="checkCustomPermission('settings/mobilenav', 'index')"
              to="/mobileapp/navigation">
              <el-menu-item>
                <span slot="title">{{ lang.navigation }}</span>
              </el-menu-item>
            </router-link>
            <router-link
              v-if="checkCustomPermission('settings/mobilebanner', 'index')"
              to="/mobileapp/banner">
              <el-menu-item>
                <span slot="title">{{ $lang[langId].banner }}</span>
              </el-menu-item>
            </router-link>
            <router-link
              to="/mobileapp/payment">
              <el-menu-item>
                <span slot="title">{{ lang.payment }}</span>
              </el-menu-item>
            </router-link>
            <router-link
              v-if="selectedStore.url_id === 'setdemo1' && checkCustomPermission('settings/mobilesetting', 'index')"
              to="/mobileapp/more-settings">
              <el-menu-item>
                <span slot="title">{{ $lang[langId].more_settings }}</span>
              </el-menu-item>
            </router-link>
          </el-submenu>

          <!-- Online Order -->
          <router-link
            v-if="selectedStore.active_online_order === 1 && 
            (
              selectedStore.role_id === 'OW' ||
              selectedStore.role_id === 'SP' ||
              selectedStore.role_id === 'AS'
            ) && checkCustomPermission('settings/onlineorder', 'index')"
            to="/online-order">
            <el-menu-item
              class="olsera-menu-item">
              <svg-icon icon-class="online-order-ico"/>
              <span slot="title">{{ $lang[langId].online_order }}</span>
            </el-menu-item>
          </router-link>

          <!-- kiosk -->
          <router-link
            v-if="(selectedStore.is_kiosk &&
            selectedStore.role_id !== 'ST' &&
            selectedStore.role_id !== 'RP' &&
            selectedStore.role_id !== 'SA' &&
            selectedStore.role_id !== 'SS' &&
            selectedStore.role_id !== 'PT' &&
            selectedStore.role_id !== 'LW') && checkCustomPermission('settings/kiosk', 'index')"
            :class="methodRouteIsHiddenSidebarMenuClass('/kiosk')"
            to="/kiosk">
            <el-menu-item
              class="olsera-menu-item">
              <svg-icon icon-class="selforder_ico"></svg-icon>
              <span slot="title">{{ lang.kiosk_self_service }}</span>
            </el-menu-item>
          </router-link>

          <!-- Attendance -->
          <router-link
            v-if="selectedStore.role_id === 'OW' || selectedStore.role_id === 'SP'"
            :class="methodRouteIsHiddenSidebarMenuClass('/attendance')"
            to="/attendance">
            <el-menu-item
              class="olsera-menu-item">
              <svg-icon icon-class="attendance"/>
              <span slot="title">{{ $lang[langId].attendance }}</span>
            </el-menu-item>
          </router-link>

          <div class="menu-divider" />

          <!-- Aktifasi Layanan -->
          <router-link
            v-if="selectedStore.role_id === 'OW' ||
            selectedStore.role_id === 'SP' ||
            selectedStore.role_id === 'AS'"
            :to="'/service-activation-v2'">
            <el-menu-item
              class="olsera-menu-item">
              <svg-icon icon-class="activateservice_ico"/>
              <span slot="title">
                {{ $lang[langId].service_activation }}
              </span>
            </el-menu-item>
          </router-link>

          <!-- Settlement -->
          <router-link
            v-if="selectedStore.role_id === 'OW' || selectedStore.role_id === 'SP'"
            to="/settlement">
            <el-menu-item
              class="olsera-menu-item">
              <svg-icon icon-class="settlement-ico"/>
              <span slot="title">{{ $lang[langId].settlement }}</span>
            </el-menu-item>
          </router-link>

          <!-- Gabung Partner -->
          <template >
            <el-menu-item
              v-if="dataProfile.master_partner === null"
              class="olsera-menu-item"
              @click="showPartner">
              <svg-icon icon-class="icon-join-partner" class="font-20" />
              <span slot="title">{{ $lang[langId].join_partner }}</span>
            </el-menu-item>
            <router-link v-else to="/join-partner">
              <el-menu-item class="olsera-menu-item">
                <svg-icon icon-class="icon-join-partner" class="font-20" />
                <span slot="title">{{ $lang[langId].join_partner }}</span>
              </el-menu-item>
            </router-link>
          </template>

          <div class="menu-divider" />

          <!-- settings -->
          <el-submenu
            v-if="selectedStore.role_id !== 'ST' &&
            selectedStore.role_id !== 'RP' &&
            selectedStore.role_id !== 'SA' &&
            selectedStore.role_id !== 'SS' &&
            selectedStore.role_id !== 'PT' &&
            selectedStore.role_id !== 'LW'"
            index="treeview-settings"
            class="olsera-menu-item">
            <template slot="title">
              <svg-icon icon-class="setting_ico"></svg-icon>
              <span slot="title">{{ lang.settings }}</span>
            </template>
            <router-link
              v-if="checkParentMenuCustomPermission('storeSettings', 'index').visible"
              to="/settings/store">
              <el-menu-item>
                <span slot="title">{{ lang.store }}</span>
              </el-menu-item>
            </router-link>
            <router-link v-if="stageLevel === 'dev' || stageLevel === 'sit'" to="/settings/paymentrounding">
              <el-menu-item>
                <span slot="title">{{ lang.rounding }}</span>
              </el-menu-item>
            </router-link>
            <router-link
              v-if="checkCustomPermission('settings/taxes', 'index')"
              to="/settings/tax">
              <el-menu-item>
                <span slot="title">{{ lang.tax_and_charges }}</span>
              </el-menu-item>
            </router-link>
            <router-link
              v-if="checkCustomPermission('settings/shippings', 'index')"
              :class="methodRouteIsHiddenSidebarMenuClass('/settings/shippings', selectedStore.is_onlineshop)"
              to="/settings/shippings">
              <el-menu-item>
                <span slot="title">{{lang.deliveries }}</span>
              </el-menu-item>
            </router-link>
            <router-link
              v-if="checkCustomPermission('settings/loyaltypoint', 'index')"
              :class="methodRouteIsHiddenSidebarMenuClass('/settings/loyaltypoint')"
              to="/settings/loyaltypoint">
              <el-menu-item>
                <span slot="title">{{ lang.loyalty_point }}</span>
              </el-menu-item>
            </router-link>
            <router-link
              v-if="checkCustomPermission('settings/smsnotify', 'index')"
              to="/settings/notification">
              <el-menu-item>
                <span slot="title">
                  {{ $lang[langId].notifications }}
                </span>
              </el-menu-item>
            </router-link>
            <router-link
              v-if="checkCustomPermission('settings/publishstore', 'index')"
              to="/settings/publishstore">
              <el-menu-item>
                <span slot="title">{{ lang.publish_store }}</span>
              </el-menu-item>
            </router-link>
          </el-submenu>

          <!-- Tutorial -->
          <router-link to="/tutorial">
            <el-menu-item class="olsera-menu-item" style="margin-bottom: 45px">
              <svg-icon icon-class="help-circle" class="font-20" />
              <span slot="title">{{ $lang[langId].tutorial }}</span>
            </el-menu-item>
          </router-link>
        </el-menu>
      </perfect-scrollbar>
      <div v-if="selectedStore.is_livechat === 1" class="floating-tawkto">
        <template v-if="!isCollapse">
            <div class="wrap">
              <div class="links">
                <div class="text">Pusat Bantuan</div>
              </div>
            </div>
          <el-button class="btn-block color-whatsapp--bg color-white" @click="openWa">
            <svg-icon icon-class="whatsapp" /> Whatsapp
          </el-button>
          <el-button class="btn-block color-white border border--input" style="background: #2bc5f4;" @click="showTawkto">
            <svg-icon icon-class="icon-chat-bubble-white" /> Chat with us
          </el-button>
        </template>
        <template v-else>
          <el-button class="btn-block color-whatsapp--bg color-white" @click="openWa">
            <svg-icon icon-class="whatsapp" /> 
          </el-button>
          <el-button class="btn-block color-white border border--input" style="background: #2bc5f4;" @click="showTawkto">
            <svg-icon icon-class="icon-chat-bubble-white" /> 
          </el-button>
        </template>
      </div>
    </section>
  </aside>
</template>

<script>
import Avatar from 'vue-avatar'
import PlanTypeChip from '@/components/modules/planType/PlanTypeChip'
import { logout } from '@/api/auth'
import { redirectToV1 } from '@/api/redirectV1'
import { clickRecord } from '@/api/dashboard'
import { asyncRouterMap } from '@/routes'
import basicComputedMixin from '@/mixins/basicComputedMixin'
import { mixinHiddenFeatureByPlanType } from '@/mixins/mixinHiddenFeatureByPlanType'

export default {
  name: 'DashboardSidebarCustom',
  components: {
    Avatar,
    PlanTypeChip
  },
  props: ['dataProfile', 'dataStore'],
  mixins: [mixinHiddenFeatureByPlanType, basicComputedMixin],
  data() {
    return {
      searchMenuQuery: '',
      btnprofile: false,
      loading: false
    }
  },
  computed: {
    langId() {
      return this.$store.getters.langId
    },
    lang() {
      return this.$store.getters.lang
    },
    rootLang() {
      return this.$lang[this.langId]
    },
    menus() {
      return asyncRouterMap[0].children
    },
    isCollapse() {
      return this.$store.state.sidebarCollapse
    },
    stageLevel() {
      return process.env.ENV_CONFIG
    },
    accessByStore () {
      return ['cvsms', 'smsstore1', 'smsstore2', 'palatable', 'loowecafe']
    },

    accessDepositByStore () {
      return ['setdemo1', 
      'allinolsera2', 
      'samadisupermarketcanggu', 
      'samadivelatoice', 
      'samadirestaurant', 
      'warungindosamadi', 
      'samadiconceptstore', 
      'grillstopbali']
    },

    percentageAll () {
      let data = {
        show: false,
        percentage: 0
      }

      // let storeCompleted = false
      // if (this.dataStore.completed_data && this.dataStore.completed_data.total_data === this.dataStore.completed_data.total_data_filled) {
      //   storeCompleted = true
      // }


      if (this.dataProfile.completed_data && this.dataStore.completed_data) {
        let total_data = this.dataProfile.completed_data.total_data + this.dataStore.completed_data.total_data
        let total_data_filled = this.dataProfile.completed_data.total_data_filled + this.dataStore.completed_data.total_data_filled

        data.percentage = parseInt((100/total_data) * total_data_filled)
        data.percentage < 100 ? data.show = true : data.show = false
      }

      return data
    },

    percentageProfile () {
      let data = {
        show: false,
        percentage: 0
      }

      if (this.dataProfile.completed_data) {
        data.percentage = parseInt((100/this.dataProfile.completed_data.total_data) * this.dataProfile.completed_data.total_data_filled)
        data.percentage < 100 ? data.show = true : data.show = false
      }

      return data
    },

    percentageProfileStore () {
      let data = {
        show: false,
        percentage: 0
      }

      if (this.dataStore.completed_data) {
        data.percentage = parseInt((100/this.dataStore.completed_data.total_data) * this.dataStore.completed_data.total_data_filled)
        data.percentage < 100 ? data.show = true : data.show = false
      }

      console.log('aaa', data)

      return data
    }
  },
  methods: {
    goToProfilePage() {
      this.$router.push({path: '/profile'})
    },
    goToInfoToko() {
      this.$router.push({path: '/settings/store/general'})
    },
    switchOldVersion() {
      this.$confirm(this.$lang[this.langId].switch_v1_confirmation, 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            redirectToV1().then(response => {
              window.open(response.data.data.url, '_blank')
              instance.confirmButtonLoading = false
              done()
            }).catch(() => {
              instance.confirmButtonLoading = false
              this.$message({
                type: 'error',
                message: 'Please try again'
              })
            })
          } else {
            done();
          }
        }
      }).then(() => {
      }).catch(() => {
      })
    },
    logOut() {
      this.loading = true
      logout().then(() => {
        this.loading = false
        this.$store.dispatch('logout')
      }).catch(error => {
        this.loading = false
        this.$message({
          type: 'error',
          message: error.string
        })
      })
    },
    handleSearchMenu(routeName) {
      console.log('route', routeName)
      this.$router.push({
        name: routeName
      })
      this.searchMenuQuery = ''
    },
    extendStore() {
      this.$router.push({
        path: '/extendstore',
        query: {
          path: this.selectedStore.store_id,
          redirect_to: this.$route.path
        }
      })
    },
    handleMenuCommand(command) {
      if (command === '1') {
        this.goToProfilePage()
      }
      if (command === '2') {
        this.switchOldVersion()
      }
      if (command === '3') {
        this.logOut()
      }
      if (command === '4') {
        this.extendStore()
      }
      if (command === '5') {
        this.goToInfoToko()
      }
    },
    handleDropdown (data) {
      this.btnprofile = data
    },
    modulCanAccess (role) {
      let data = []
      if (this.selectedStore.url_id === 'cvsms') {
        if (role === 'PT') {
          data = ['customer', 'sales', 'report']
        }
        if (role === 'ST') {
          data = ['customer', 'sales', 'report']
        }
        if (role === 'SS') {
          data = ['sales']
        }
        if (role === 'SA') {
          data = ['sales', 'report']
        }
        if (role === 'RP') {
          data = ['sales']
        }
        if (role === 'LW') {
          data = ['report']
        }
      }
      if (this.selectedStore.url_id === 'smsstore1' || this.selectedStore.url_id === 'smsstore2') {
        if (role === 'PT') {
          data = ['customer', 'sales', 'pos', 'catalog']
        }
      }
      if (this.selectedStore.url_id === 'atapsunsetcafe') {
        if (role === 'PT') {
          data = ['product']
        }
      }
      // if (this.selectedStore.url_id === 'devtestprorate') {
      //   if (role === 'RP') {
      //     data = ['sales']
      //   }
      // }
      return data
    },
    accountingAccess(role){
      let accountingRole = ["OW", "SP", "RP", "PJ", "AS"]
      if(accountingRole.includes(role)){
        return true
      }else{
        return false
      }
    },
    modulCantAccess (role) {
      let data = []
      if (this.selectedStore.url_id === 'cvsms') {
        if (role === 'AS') {
          data = ['report', 'sales', 'purchase', 'pos']
        }
        if (role === 'PT') {
          data = ['catalog', 'pos']
        }
        if (role === 'SA') {
          data = ['income']
        }
        if (role === 'ST') {
          data = ['inventory']
        }
        if (role === 'SS') {
          data = ['catalog', 'income']
        }
        if (role === 'LW') {
          data = ['purchase', 'pos', 'inventory']
        }
      }
      if (this.selectedStore.url_id === 'smsstore1' || this.selectedStore.url_id === 'smsstore2') {
        if (role === 'ST') {
          data = ['inventory']
        }
      }
      if (this.selectedStore.url_id === 'loowecafe' || this.selectedStore.url_id === 'palatable') {
        if (role === 'RP') {
          data = ['catalog', 'customer', 'income', 'pos']
        }
      }
      if (!this.accessByStore.includes(this.selectedStore.url_id)) {
        if (role === 'RP') {
          data = ['sales', 'purchase', 'pos', 'catalog', 'customer', 'income']
        }
        if (role === 'PT') {
          data = ['sales', 'pos', 'product', 'customer', 'income', 'report']
        }
        if (role === 'LW') {
          data = ['sales', 'pos', 'product', 'report', 'customer', 'income']
        }
        if (role === 'SA') {
          data = ['purchase', 'pos', 'catalog', 'customer', 'report']
        }
        if (role === 'ST') {
          data = ['pos', 'report']
        }
        if (role === 'SS') {
          data = ['pos', 'customer']
        }
      }
      console.log('re', data)
      return data
    },
    canAccess (role, modul) {
      if (this.modulCanAccess(role).includes(modul)) {
        if (this.accessByStore.includes(this.selectedStore.url_id) && this.modulCanAccess(role).includes(modul)) {
          // console.log('re', role)
          return true
        } else {
          return false
        }
      } else {
        if (this.modulCantAccess(role).includes(modul)) {
          return false
        } else {
          return true
        }
      }
    },
    showPartner () {
      this.$emit('showpartnership')
    },
    showTawkto () {
      if (this.stageLevel === 'dev' || this.stageLevel === 'sit') {
        this.saveClickRecord('livechat')
      }
      
      this.$emit('showtawkto')
    },
    openWa () {
      if (this.stageLevel === 'dev' || this.stageLevel === 'sit') {
        this.saveClickRecord('wa')
      }
      
      window.open('https://bit.ly/ols-aftersales')
    },

    async saveClickRecord(button) {
      let data = {
        tag_name: button,
        total_click: 1
      }
      this.loading = true
      await clickRecord(data).then(() => {
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.$message({
          type: 'error',
          message: error.string
        })
      })
    },
  }
}
</script>
