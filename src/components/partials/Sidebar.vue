<template>
  <aside class="main-sidebar">
    <section class="sidebar">
      <div class="user-panel">
        <el-dropdown
          class="dropdown-user"
          trigger="click"
          @command="handleMenuCommand"
          @visible-change="handleDropdown">
          <div class="flex-container">
            <el-avatar
              v-if="$store.state.userPhotoProfile"
              :src="$store.state.userPhotoProfile"
              :size="40"
            />
            <div class="info">
              <h5>{{$store.state.userName}}</h5>
              <span>{{$store.state.userStores.userRole.role_name}}</span>
            </div>
            <el-button v-if="!btnprofile" type="text" size="mini" icon="el-icon-arrow-down"></el-button>
            <el-button v-else type="text" size="mini" icon="el-icon-arrow-up"></el-button>
          </div>
          <el-dropdown-menu
            slot="dropdown"
            style="min-width: 160px; max-width: 300px;">
            <el-dropdown-item command="1">
              <el-button type="text">
                <svg-icon icon-class="user"></svg-icon>
                <span> {{ lang.profile }}</span>
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item
              v-if="userRole && userRole.role_id === 'OW'"
              command="4">
              <el-button type="text">
                <svg-icon icon-class="plus" />
                <span>Extend Store</span>
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item command="3">
              <el-button type="text" @click="logOut">
                <svg-icon icon-class="log-out"></svg-icon>
                <span> {{ $lang[langId].logout }}</span>
              </el-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <div
        v-if="userRole.role_id !== 'RP' &&
        userRole.role_id !== 'SA'"
        class="search-nav">
        <el-select
          v-model="searchMenuQuery"
          :placeholder="$lang[langId].search_menu"
          filterable
          style="width: 100%;"
          @change="handleSearchMenu">
          <template
            v-for="(item, key) in computedMenus">
            <template
              v-if="item.children">
              <el-option-group
                :key="key"
                :label="rootLang[item.localization_key]">
                <el-option
                  v-for="(child, childKey) in item.children"
                  :key="childKey"
                  :label="rootLang[child.localization_key]"
                  :value="child.name"
                />
              </el-option-group>
            </template>

            <template v-else>
              <el-option
                :key="key"
                :label="rootLang[item.localization_key]"
                :value="item.name"
              />
            </template>
          </template>
        </el-select>
      </div>

      <perfect-scrollbar>
        <el-menu
          :router="true"
          :collapse="isCollapse"
          :unique-opened="false"
          class="olsera-main-menu">
          <el-menu-item class="olsera-menu-item" @click="switchOldVersion">
            <svg-icon icon-class="toggle-right" class="font-20"></svg-icon>
            <span slot="title">{{ $lang[langId].switch_v1 }}</span>
          </el-menu-item>

          <div class="menu-divider" />

          <el-menu-item index="/whatsnew" class="olsera-menu-item">
            <svg-icon icon-class="gift" class="font-20" />
            <span slot="title">{{ $lang[langId].whatsnew }}</span>
            <span
              v-if="$store.state.whatsnewHighlight"
              class="olsera-menu-item--new">
              {{ $lang[langId].new }}
            </span>
          </el-menu-item>

          <div class="menu-divider" />

          <el-menu-item index="/" class="olsera-menu-item">
            <svg-icon icon-class="dashboard_ico" />
            <span class="ml-10" slot="title">{{ lang.dashboard }}</span>
          </el-menu-item>

          <div class="menu-divider" />

          <!-- katalog -->
          <el-submenu
            v-if="userRole.role_id !== 'RP' &&
            userRole.role_id !== 'SA'"
            index="treemenu-catalog"
            class="olsera-menu-item">
            <template slot="title">
              <svg-icon icon-class="catalog_ico"></svg-icon>
              <span class="ml-10" slot="title">{{ lang.catalog }}</span>
            </template>

            <router-link v-if="userRole.role_id !== 'PT' && userRole.role_id !== 'LW'" to="/catalog/product">
              <el-menu-item index="/catalog/product">
                <span class="ml-10" slot="title">{{ lang.product }}</span>
              </el-menu-item>
            </router-link>

            <router-link to="/inventory/stocksincoming">
              <el-menu-item index="/inventory/stocksincoming">
                <span class="ml-10" slot="title">{{ lang.inventory }}</span>
              </el-menu-item>
            </router-link>

            <router-link
              v-if="userRole.role_id !== 'SS' &&
              userRole.role_id !== 'PT' &&
              userRole.role_id !== 'LW'"
              to="/specialtype">
              <el-menu-item
                index="/specialtype">
                <span class="ml-10" slot="title">{{ $lang[langId].special_type }}</span>
              </el-menu-item>
            </router-link>

            <router-link v-if="$store.getters.selectedStore.pos_freemium === 1"  to="/freemium">
              <el-menu-item index="/freemium">
                <span class="ml-10" slot="title">
                  {{ lang.print_product_barcode }}
                  <div class="premium-labeled">
                    Premium
                  </div>
                </span>
              </el-menu-item>
            </router-link>

            <router-link v-else to="/catalog/barcode">
              <el-menu-item index="/catalog/barcode">
                <span class="ml-10" slot="title">
                  {{ lang.print_product_barcode }}
                </span>
              </el-menu-item>
            </router-link>
          </el-submenu>

          <!-- marketing -->
          <router-link
            v-if="userRole.role_id !== 'RP' &&
            userRole.role_id !== 'PT' &&
            userRole.role_id !== 'LW' &&
            userRole.role_id !== 'SA' &&
            userRole.role_id !== 'SS' &&
            $store.getters.selectedStore.pos_freemium === 1 &&
            selectedStore.is_onlineshop !== 1"
            to="/freemium">
            <el-menu-item
              index="/freemium"
              class="olsera-menu-item">
              <svg-icon icon-class="toa_ico"></svg-icon>
              <span class="ml-10" slot="title">
                {{ rootLang.marketing }}
                <div class="premium-labeled">
                  Premium
                </div>
              </span>
            </el-menu-item>
          </router-link>

          <el-submenu
            v-if="userRole.role_id !== 'RP' &&
            userRole.role_id !== 'PT' &&
            userRole.role_id !== 'LW' &&
            userRole.role_id !== 'SA' &&
            userRole.role_id !== 'SS' &&
            $store.getters.selectedStore.pos_freemium !== 1"
            index="/marketing"
            class="olsera-menu-item">
            <template slot="title">
              <svg-icon icon-class="toa_ico"></svg-icon>
              <span class="ml-10" slot="title">{{ rootLang.marketing }}</span>
            </template>

            <router-link
              v-if="userRole.role_id !== 'ST' &&
              userRole.role_id !== 'RP' &&
              userRole.role_id !== 'SA' &&
              userRole.role_id !== 'SS' &&
              userRole.role_id !== 'PT' &&
              userRole.role_id !== 'LW'"
              to="/promotions">
              <el-menu-item
                index="/promotions">
                <span class="ml-10" slot="title">{{ lang.discounts }}</span>
              </el-menu-item>
            </router-link>

            <router-link
              v-if="stageLevel !== 'production' || user.email === 'akmal@olsera.com'"
              to="/marketing/design-promotions">
              <el-menu-item
                index="/marketing/design-promotions">
                <span class="ml-10" slot="title">
                  {{ rootLang.design_promotions }}
                </span>
              </el-menu-item>
            </router-link>

            <router-link
              v-if="stageLevel !== 'production' || user.email === 'akmal@olsera.com'"
              to="/marketing/invite-member">
              <el-menu-item
                index="/marketing/invite-member">
                <span class="ml-10" slot="title">
                  {{ rootLang.invite_member }}
                </span>
              </el-menu-item>
            </router-link>

            <router-link
              v-if="stageLevel !== 'production' || user.email === 'akmal@olsera.com'"
              to="/marketing/promotions-material">
              <el-menu-item
                index="/marketing/promotions-material">
                <span class="ml-10" slot="title">
                  {{ rootLang.download_promotions_material }}
                </span>
              </el-menu-item>
            </router-link>
          </el-submenu>

          <!-- customer supplier -->
          <router-link
            v-if="userRole.role_id !== 'RP' &&
            userRole.role_id !== 'SA' &&
            userRole.role_id !== 'SS' &&
            userRole.role_id !== 'PT' &&
            userRole.role_id !== 'LW' &&
            $store.getters.selectedStore.pos_freemium === 1 &&
            selectedStore.is_onlineshop !== 1"
            to="/freemium">
            <el-menu-item
              index="/freemium"
              class="olsera-menu-item">
              <svg-icon icon-class="customer_ico" />
              <span class="ml-10" slot="title">
                {{ lang.customer }} & {{ lang.supplier }}
                <div class="premium-labeled">
                  Premium
                </div>
              </span>
            </el-menu-item>
          </router-link>

          <router-link
            v-else-if="userRole.role_id !== 'RP' &&
            userRole.role_id !== 'SA' &&
            userRole.role_id !== 'SS' &&
            userRole.role_id !== 'PT' &&
            userRole.role_id !== 'LW'"
            to="/customersupplier">
            <el-menu-item
              index="/customersupplier"
              class="olsera-menu-item">
              <svg-icon icon-class="customer_ico" />
              <span class="ml-10" slot="title">{{ lang.customer }} & {{ lang.supplier }}</span>
            </el-menu-item>
          </router-link>

          <div class="menu-divider" />

          <!-- sales order -->
          <router-link
            v-if="userRole.role_id !== 'RP' &&
            userRole.role_id !== 'PT' &&
            userRole.role_id !== 'LW'"
            to="/sales">
            <el-menu-item
              index="/sales"
              class="olsera-menu-item">
              <svg-icon icon-class="sale_ico"></svg-icon>
              <span class="ml-10" slot="title">{{ lang.sales }}</span>
            </el-menu-item>
          </router-link>

          <!-- purchase -->
          <router-link
            v-if="userRole.role_id !== 'RP' &&
            userRole.role_id !== 'SA' &&
            $store.getters.selectedStore.pos_freemium === 1 &&
            selectedStore.is_onlineshop !== 1"
            to="/freemium">
            <el-menu-item
              index="/freemium"
              class="olsera-menu-item">
              <svg-icon icon-class="order_ico"></svg-icon>
              <span class="ml-10" slot="title">
                {{ lang.purchase }}
                <div class="premium-labeled">
                  Premium
                </div>
              </span>
            </el-menu-item>
          </router-link>

          <router-link
            v-else-if="userRole.role_id !== 'RP' &&
            userRole.role_id !== 'SA'"
            to="/purchase">
            <el-menu-item
              index="/purchase"
              class="olsera-menu-item">
              <svg-icon icon-class="order_ico"></svg-icon>
              <span class="ml-10" slot="title">{{ lang.purchase }}</span>
            </el-menu-item>
          </router-link>

          <!-- pendapatan pengeluaran -->
          <el-menu-item
            v-if="userRole.role_id !== 'RP' &&
            userRole.role_id !== 'PT' &&
            userRole.role_id !== 'LW' &&
            $store.getters.selectedStore.pos_freemium === 1 &&
            selectedStore.is_onlineshop !== 1"
            index="/freemium"
            class="olsera-menu-item">
            <svg-icon icon-class="income_ico"></svg-icon>
            <span class="ml-10" slot="title">
              {{lang.revenue}}/{{lang.expense}}
              <div class="premium-labeled">
                Premium
              </div>
            </span>
          </el-menu-item>

          <el-submenu
            v-else-if="userRole.role_id !== 'RP' &&
            userRole.role_id !== 'PT' &&
            userRole.role_id !== 'LW'"
            index="treemenu-revenue-expense"
            class="olsera-menu-item">
            <template slot="title">
              <svg-icon icon-class="income_ico"></svg-icon>
              <span class="ml-10" slot="title">{{lang.revenue}}/{{lang.expense}}</span>
            </template>

            <el-menu-item index="/transaction">
              <span class="ml-10" slot="title">{{lang.transactions}}</span>
            </el-menu-item>
            <el-menu-item index="/transactiontype">
              <span class="ml-10" slot="title">{{ lang.transaction_type }}</span>
            </el-menu-item>
          </el-submenu>

          <!-- laporan -->
          <el-menu-item
            v-if="userRole.role_id !== 'ST' &&
            userRole.role_id !== 'SA' &&
            userRole.role_id !== 'PT' &&
            userRole.role_id !== 'LW'"
            index="/reports"
            class="olsera-menu-item">
            <svg-icon icon-class="report_ico" />
            <span class="ml-10" slot="title">{{ lang.reports }}</span>
          </el-menu-item>

          <!-- Accounting -->
          <el-submenu
            v-if="stageLevel !== 'production' || user.email === 'akmal@olsera.com'"
            index="treemenu-accounting"
            class="olsera-menu-item">
            <template slot="title">
              <svg-icon icon-class="accounting_ico"></svg-icon>
              <span class="ml-10" slot="title">{{ $lang[langId].accounting }}</span>
            </template>
            <el-menu-item index="/accounting/setting">
              <span class="ml-10" slot="title">{{ $lang[langId].accounting_setting}}</span>
            </el-menu-item>
            <el-menu-item index="/accounting/chartaccount">
              <span class="ml-10" slot="title">{{ $lang[langId].list_of_account }}</span>
            </el-menu-item>
            <el-menu-item index="/accounting/cash-bank">
              <span class="ml-10" slot="title">{{ $lang[langId].cash_n_bank }}</span>
            </el-menu-item>
            <el-menu-item index="/accounting/pos-transaction">
              <span class="ml-10" slot="title">{{ $lang[langId].pos_transaction }}</span>
            </el-menu-item>
            <el-menu-item index="/accounting/receivable">
              <span class="ml-10" slot="title">{{ $lang[langId].receivable }}</span>
            </el-menu-item>
            <el-menu-item index="/accounting/payable">
              <span class="ml-10" slot="title">{{ $lang[langId].payable }}</span>
            </el-menu-item>
            <el-menu-item index="/accounting/asset">
              <span class="ml-10" slot="title">{{ $lang[langId].asset }}</span>
            </el-menu-item>
            <el-menu-item index="/accounting/expense">
              <span class="ml-10" slot="title">{{ $lang[langId].expenses }}</span>
            </el-menu-item>
            <el-menu-item index="/accounting/general-journal">
              <span class="ml-10" slot="title">{{ $lang[langId].general_journal }}</span>
            </el-menu-item>
            <el-menu-item index="/accounting/report">
              <span class="ml-10" slot="title">{{ $lang[langId].accounting_reports }}</span>
            </el-menu-item>
            <el-menu-item index="/accounting/closing">
              <span class="ml-10" slot="title">{{ $lang[langId].closing_book }}</span>
            </el-menu-item>
          </el-submenu>

          <el-submenu
            v-if="stageLevel !== 'production' || user.email === 'akmal@olsera.com'"
            index="treemenu-external-link"
            class="olsera-menu-item">
            <template slot="title">
              <svg-icon icon-class="external-link"></svg-icon>
              <span class="ml-10" slot="title">{{lang.external_url}}</span>
            </template>
            <el-menu-item index="/external-link/jurnal/reset">
              <span class="ml-10" slot="title">{{lang.export_to_jurnal}}</span>
            </el-menu-item>
            <!-- <el-menu-item index="/transactiontype">
              <span class="ml-10" slot="title">{{ lang.transaction_type }}</span>
            </el-menu-item> -->
          </el-submenu>

          <div class="menu-divider" />

          <!-- POS -->
          <el-submenu
            v-if="selectedStore.is_pos &&
            userRole.role_id !== 'ST' &&
            userRole.role_id !== 'RP' &&
            userRole.role_id !== 'SA' &&
            userRole.role_id !== 'SS' &&
            userRole.role_id !== 'PT' &&
            userRole.role_id !== 'LW'"
            index="treemenu-pos"
            class="olsera-menu-item">
            <template slot="title">
              <svg-icon icon-class="pos_ico"></svg-icon>
              <span class="ml-10" slot="title">{{ lang.point_of_sale }}</span>
            </template>

            <el-menu-item index="/pos-settings">
              <span class="ml-10" slot="title">{{ $lang[langId].pos_setting }}</span>
            </el-menu-item>
            <el-menu-item
              v-if="selectedStore.pos_resto_mode && $store.getters.selectedStore.pos_freemium === 1"
              index="/freemium">
              <span class="ml-10" slot="title" :style="langId === 'id' ? 'font-size: 15px' : ''">
                {{lang.restaurant_mode_settings}}
                <div class="premium-labeled">
                  Premium
                </div>
              </span>
            </el-menu-item>
            <el-menu-item
              v-if="selectedStore.pos_resto_mode && $store.getters.selectedStore.pos_freemium === 0"
              index="/restomode">
              <span class="ml-10" slot="title" :style="langId === 'id' ? 'font-size: 15px' : ''">{{ lang.restaurant_mode_settings }}</span>
            </el-menu-item>
            <el-menu-item v-if="$store.getters.selectedStore.pos_freemium === 1" index="/freemium">
              <span class="ml-10" slot="title">
                {{lang.daily_cash_balance }} (V1)
                <div class="premium-labeled">
                  Premium
                </div>
              </span>
            </el-menu-item>
            <el-menu-item v-else index="/begincash">
              <span class="ml-10" slot="title">{{ lang.daily_cash_balance }} (V1)</span>
            </el-menu-item>
            <el-menu-item v-if="$store.getters.selectedStore.pos_freemium === 1" index="/freemium">
              <span class="ml-10" slot="title">
                {{lang.shift_summary }} (V2)
                <div class="premium-labeled">
                  Premium
                </div>
              </span>
            </el-menu-item>
            <el-menu-item v-else index="/shiftbalance">
              <span class="ml-10" v-if="$store.getters.selectedStore.pos_freemium === 0" slot="title">{{ lang.shift_summary }} (V2)</span>
            </el-menu-item>
          </el-submenu>

          <!-- website -->
          <el-menu-item
            v-if="userRole.role_id !== 'ST' &&
            userRole.role_id !== 'RP' &&
            userRole.role_id !== 'SA' &&
            userRole.role_id !== 'SS' &&
            userRole.role_id !== 'PT' &&
            userRole.role_id !== 'LW' &&
            $store.getters.selectedStore.pos_freemium === 1 &&
            selectedStore.is_onlineshop !== 1"
            index="/freemium"
            class="olsera-menu-item">
            <svg-icon icon-class="website_ico"></svg-icon>
            <span class="ml-10" slot="title">
              {{lang.website}}
              <div class="premium-labeled">
                Premium
              </div>
            </span>
          </el-menu-item>

          <el-submenu
            v-else-if="
            userRole.role_id !== 'RP' &&
            userRole.role_id !== 'SA' &&
            userRole.role_id !== 'SS' &&
            userRole.role_id !== 'PT' &&
            userRole.role_id !== 'LW' &&
            selectedStore.is_onlineshop === 1"
            index="treemenu-website"
            class="olsera-menu-item">
            <template slot="title">
              <svg-icon icon-class="website_ico"></svg-icon>
              <span class="ml-10" slot="title">{{ lang.website }}</span>
            </template>
            <el-menu-item index="/website/mysite">
              <span class="ml-10" slot="title">{{ lang.my_site }}</span>
            </el-menu-item>
            <el-menu-item index="/website/pages">
              <span class="ml-10" slot="title">{{ lang.page }} & {{ lang.article }}</span>
            </el-menu-item>
            <el-menu-item index="/website/integrations">
              <span class="ml-10" slot="title">{{ $lang[langId].third_party_integration }}</span>
            </el-menu-item>
            <el-menu-item
              v-if="selectedStore.accept_reseller &&
              userRole.role_id !== 'ST'"
              index="/website/reseller">
              <span class="ml-10" slot="title">{{ lang.resellers }}</span>
            </el-menu-item>
          </el-submenu>

          <!-- mobile app -->
          <el-submenu
            v-if="userRole.role_id !== 'ST' &&
            userRole.role_id !== 'RP' &&
            userRole.role_id !== 'SA' &&
            userRole.role_id !== 'SS' &&
            userRole.role_id !== 'PT' &&
            userRole.role_id !== 'LW' &&
            userRole.is_mobile !== 0"
            index="treeview-mobileapp"
            class="olsera-menu-item">
            <template slot="title">
              <svg-icon icon-class="app_ico"></svg-icon>
              <span class="ml-10" slot="title">{{ lang.mobile_app }}</span>
            </template>
            <el-menu-item index="/mobileapp/navigation">
              <span class="ml-10" slot="title">{{ lang.navigation }}</span>
            </el-menu-item>
            <el-menu-item index="/mobileapp/banner">
              <span class="ml-10" slot="title">{{ $lang[langId].banner }}</span>
            </el-menu-item>
            <el-menu-item index="/mobileapp/payment">
              <span class="ml-10" slot="title">{{ lang.payment }}</span>
            </el-menu-item>
          </el-submenu>

          <!-- Online Order -->
          <el-menu-item
            v-if="store.active_online_order === 1 &&
            (
              userRole.role_id === 'OW' ||
              userRole.role_id === 'SP' ||
              userRole.role_id === 'AS'
            )"
            index="/online-order"
            class="olsera-menu-item">
            <svg-icon icon-class="online-order-ico"/>
            <span class="ml-10" slot="title">{{ $lang[langId].online_order }}</span>
          </el-menu-item>

          <!-- kiosk -->
          <el-menu-item
            v-if="selectedStore.is_kiosk &&
            userRole.role_id !== 'ST' &&
            userRole.role_id !== 'RP' &&
            userRole.role_id !== 'SA' &&
            userRole.role_id !== 'SS' &&
            userRole.role_id !== 'PT' &&
            userRole.role_id !== 'LW'"
            index="/kiosk"
            class="olsera-menu-item">
            <svg-icon icon-class="selforder_ico"></svg-icon>
            <span class="ml-10" slot="title">{{ lang.kiosk_self_service }}</span>
          </el-menu-item>

          <!-- Attendance -->
          <el-menu-item
            v-if="stageLevel !== 'production' || user.email === 'akmal@olsera.com'"
            index="/attendance"
            class="olsera-menu-item">
            <svg-icon icon-class="attendance"/>
            <span class="ml-10" slot="title">{{ $lang[langId].attendance }}</span>
          </el-menu-item>

          <div class="menu-divider" />

          <!-- Aktifasi Layanan -->
          <el-menu-item
            index="/service-activation"
            class="olsera-menu-item">
            <svg-icon icon-class="activateservice_ico"/>
            <span class="ml-10" slot="title">{{ $lang[langId].service_activation }}</span>
          </el-menu-item>

          <!-- Settlement -->
          <el-menu-item
            v-if="stageLevel !== 'production' || user.email === 'akmal@olsera.com'"
            index="/settlement"
            class="olsera-menu-item">
            <svg-icon icon-class="settlement-ico"/>
            <span class="ml-10" slot="title">{{ $lang[langId].settlement }}</span>
          </el-menu-item>

          <div class="menu-divider" />

          <!-- settings -->
          <el-submenu
            v-if="userRole.role_id !== 'ST' &&
            userRole.role_id !== 'RP' &&
            userRole.role_id !== 'SA' &&
            userRole.role_id !== 'SS' &&
            userRole.role_id !== 'PT' &&
            userRole.role_id !== 'LW'"
            index="treeview-settings"
            class="olsera-menu-item">
            <template slot="title">
              <svg-icon icon-class="setting_ico"></svg-icon>
              <span class="ml-10" slot="title">{{ lang.settings }}</span>
            </template>
            <el-menu-item index="/settings/store">
              <span class="ml-10" slot="title">{{ lang.store }}</span>
            </el-menu-item>
            <el-menu-item index="/settings/tax">
              <span class="ml-10" v-if="$store.getters.selectedStore.pos_freemium === 0 || selectedStore.is_onlineshop === 1" slot="title">{{ lang.tax_and_charges }} </span>
              <span class="ml-10" v-else slot="title">
                {{lang.tax_and_charges }}
                <div class="premium-labeled">
                  Premium
                </div>
              </span>
            </el-menu-item>
            <el-menu-item index="/settings/shippings">
              <span class="ml-10" v-if="$store.getters.selectedStore.pos_freemium === 0 || selectedStore.is_onlineshop === 1" slot="title">{{ lang.deliveries }}</span>
              <span class="ml-10" v-else slot="title">
                {{lang.deliveries }}
                <div class="premium-labeled">
                  Premium
                </div>
              </span>
            </el-menu-item>
            <el-menu-item
              index="/settings/loyaltypoint">
              <span class="ml-10" v-if="$store.getters.selectedStore.pos_freemium === 0 || selectedStore.is_onlineshop === 1" slot="title">{{ lang.loyalty_point }}</span>
              <span class="ml-10" v-else slot="title">
                {{lang.loyalty_point }}
                <div class="premium-labeled">
                  Premium
                </div>
              </span>
            </el-menu-item>
            <el-menu-item index="/settings/notification">
              <span class="ml-10" v-if="$store.getters.selectedStore.pos_freemium === 0 || selectedStore.is_onlineshop === 1" slot="title">{{ $lang[langId].notifications }}</span>
              <span class="ml-10" v-else slot="title">
                {{ $lang[langId].notifications }}
                <div class="premium-labeled">
                  Premium
                </div>
              </span>
            </el-menu-item>
            <el-menu-item index="/settings/publishstore">
              <span class="ml-10" v-if="$store.getters.selectedStore.pos_freemium === 0 || selectedStore.is_onlineshop === 1" slot="title">{{ lang.publish_store }}</span>
              <span class="ml-10" v-else slot="title">
                {{ lang.publish_store }}
                <div class="premium-labeled">
                  Premium
                </div>
              </span>
            </el-menu-item>
          </el-submenu>

          <!-- helps -->
          <!-- <el-menu-item>
            <svg-icon icon-class="help-circle"></svg-icon>
            <span slot="title">{{ $lang[langId].help }}</span>
          </el-menu-item> -->
        </el-menu>
      </perfect-scrollbar>
    </section>
  </aside>
</template>

<script>
import Avatar from 'vue-avatar'
import { redirectToV1 } from '@/api/redirectV1'
export default {
  name: 'DashboardSidebar',
  components: {
    Avatar
  },
  props: ['loggedInUser', 'selectedStore'],
  data() {
    return {
      user: this.loggedInUser,
      store: this.selectedStore,
      searchMenuQuery: '',
      menus: this.$router.options.routes[0].children,
      btnprofile: false
    }
  },
  watch: {
    loggedInUser(user) {
      this.user = user
    },
    selectedStore(store) {
      this.store = store
    }
  },
  computed: {
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    rootLang() {
      return this.$lang[this.langId]
    },
    computedMenus() {
      return this.menus.filter(item => {
        if (!item.hidden) {
          return item
        }
      })
    },
    userRole() {
      return this.$store.state.userStores.userRole
    },
    isCollapse() {
      return this.$store.state.sidebarCollapse
    },
    stageLevel() {
      return process.env.NODE_ENV
    }
  },
  mounted() {
    console.log(this.loggedInUser)
  },
  methods: {
    goToProfilePage() {
      this.$router.push({path: '/profile'})
    },
    switchOldVersion() {
      this.$confirm(this.$lang[this.langId].switch_v1_confirmation, 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        redirectToV1().then(response => {
          window.location = response.data.data.url
        }).catch(() => {
          this.$message({
            type: 'error',
            message: 'Please try again'
          })
        })
      }).catch(() => {
      })
    },
    logOut() {
      this.$store.commit('REMOVE_TOKEN')
      this.$store.commit('REMOVE_LOGIN_DATA')
      this.$store.commit('REMOVE_SELECTED_STORE')
      this.$store.commit('SET_ID_LOCAL', 0)
      var data = {id: 1, value: 1}
      this.$store.commit('SET_BANNER_ORDER', data)
      // window.location = 'https://olsera.com'
      this.$router.push({
        path: '/login'
      })
    },
    handleSearchMenu(routeName) {
      this.$router.push({
        name: routeName
      })
      this.searchMenuQuery = ''
    },
    extendStore() {
      if (this.userRole.role_id === 'OW') {
        this.$router.push({
          path: '/extendstore',
          query: {
            path: this.selectedStore.store_id,
            redirect_to: this.$route.path
          }
        })
      } else {
        const h = this.$createElement;
        this.$notify({
          type: 'warning',
          message: h('i', { class: 'color-warning font-16' }, 'Hanya untuk pemilik'),
          customClass: 'color-warning--soft--bg notif-extend'
        })
      }
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
    },
    handleDropdown (data) {
      this.btnprofile = data
    }
  }
}
</script>