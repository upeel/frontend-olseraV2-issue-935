<template>
  <aside class="main-sidebar">
    <section class="sidebar">
      <div
        v-loading="loading"
        :class="!btnprofile ? 'user-panel' : 'user-panel user-panel--active'">
        <el-dropdown
          class="dropdown-user"
          trigger="click"
          @command="handleMenuCommand"
          @visible-change="handleDropdown">
          <div class="flex-container">
            <el-avatar
              v-if="loggedInUser"
              :src="loggedInUser.photo"
              :size="40"
            />
            <div class="info">
              <h5>{{ loggedInUser.name }}</h5>
              <span>{{ selectedStore.role_name }}</span>
            </div>
            <el-button v-if="!btnprofile" type="text" size="mini" icon="el-icon-arrow-down"></el-button>
            <el-button v-else type="text" size="mini" icon="el-icon-arrow-up"></el-button>
          </div>
          <el-dropdown-menu
            slot="dropdown">
            <el-dropdown-item command="1" style="padding: 10px 10px !important">
              <el-button type="text">
                <svg-icon icon-class="user"></svg-icon>
                <span> {{ lang.profile }}</span>
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item
              v-if="selectedStore.role_id === 'OW'"
              command="4"
              style="padding: 10px 10px !important">
              <el-button type="text">
                <svg-icon icon-class="plus" />
                <span>Extend Store</span>
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item command="3" style="padding: 10px 10px !important">
              <el-button type="text" class="color-danger" @click="logOut">
                <svg-icon icon-class="log-out"></svg-icon>
                <span> {{ $lang[langId].logout }}</span>
              </el-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <div
        v-if="selectedStore.role_id !== 'RP' &&
        selectedStore.role_id !== 'SA'"
        class="search-nav">
        <!-- pos_freemium :{{ selectedStore.pos_freemium }}<br>
        is_onlineshop: {{ selectedStore.is_onlineshop }} -->
        <el-select
          v-model="searchMenuQuery"
          :placeholder="$lang[langId].search_menu"
          filterable
          style="width: 100%;"
          @change="handleSearchMenu">
          <template
            v-for="(item, key) in stageLevel === 'dev' ? computedMenus2 : computedMenus">
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

      <perfect-scrollbar class="ps-sidebar">
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

          <div class="menu-divider" />

          <router-link to="/dashboard">
            <el-menu-item class="olsera-menu-item">
              <svg-icon icon-class="dashboard_ico" />
              <span class="ml-10" slot="title">{{ lang.dashboard }}</span>
            </el-menu-item>
          </router-link>

          <div class="menu-divider" />

          <!-- katalog -->
          <el-submenu
            v-if="selectedStore.role_id !== 'RP' &&
            selectedStore.role_id !== 'SA' ||
            computedAccess('PT')"
            index="treemenu-catalog"
            class="olsera-menu-item">
            <template slot="title">
              <svg-icon icon-class="catalog_ico"></svg-icon>
              <span class="ml-10" slot="title">{{ lang.catalog }}</span>
            </template>

            <router-link
              v-if="computedAccess('PT') ||
              selectedStore.role_id !== 'PT' &&
              selectedStore.role_id !== 'LW' &&
              !computedAccess('SS')"
              to="/catalog/product">
              <el-menu-item index="/catalog/product">
                <span class="ml-10" slot="title">{{ lang.product }}</span>
              </el-menu-item>
            </router-link>

            <router-link v-if="canntAccess(loggedInUser.email, 'inventory')" to="/inventory/stocksincoming">
              <el-menu-item index="/inventory/stocksincoming">
                <span class="ml-10" slot="title">{{ lang.inventory }}</span>
              </el-menu-item>
            </router-link>

            <router-link
              v-if="selectedStore.role_id !== 'SS' &&
              selectedStore.role_id !== 'PT' &&
              selectedStore.role_id !== 'LW'"
              to="/specialtype">
              <el-menu-item
                index="/specialtype">
                <span class="ml-10" slot="title">{{ $lang[langId].special_type }}</span>
              </el-menu-item>
            </router-link>

            <router-link
              v-if="selectedStore.pos_freemium === 1"
              to="/freemium">
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
          <template
            v-if="selectedStore.role_id !== 'RP' &&
            selectedStore.role_id !== 'PT' &&
            selectedStore.role_id !== 'LW' &&
            selectedStore.role_id !== 'SA' &&
            selectedStore.role_id !== 'SS'">
            <template
              v-if="selectedStore.pos_freemium && !selectedStore.is_onlineshop">
              <router-link to="/freemium">
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
            </template>
            <template v-else>
              <el-submenu
                index="/marketing"
                class="olsera-menu-item">
                <template slot="title">
                  <svg-icon icon-class="toa_ico"></svg-icon>
                  <span class="ml-10" slot="title">{{ rootLang.marketing }}</span>
                </template>

                <router-link
                  v-if="selectedStore.role_id !== 'ST' &&
                  selectedStore.role_id !== 'RP' &&
                  selectedStore.role_id !== 'SA' &&
                  selectedStore.role_id !== 'SS' &&
                  selectedStore.role_id !== 'PT' &&
                  selectedStore.role_id !== 'LW'"
                  to="/promotions">
                  <el-menu-item
                    index="/promotions">
                    <span class="ml-10" slot="title">{{ lang.discounts }}</span>
                  </el-menu-item>
                </router-link>

                <router-link
                  v-if="stageLevel === 'sit' || loggedInUser.email === 'akmal@olsera.com'"
                  to="/marketing/design-promotions">
                  <el-menu-item
                    index="/marketing/design-promotions">
                    <span class="ml-10" slot="title">
                      {{ rootLang.design_promotions }}
                    </span>
                  </el-menu-item>
                </router-link>

                <router-link
                  v-if="stageLevel === 'sit' || loggedInUser.email === 'akmal@olsera.com'"
                  to="/marketing/invite-member">
                  <el-menu-item
                    index="/marketing/invite-member">
                    <span class="ml-10" slot="title">
                      {{ rootLang.invite_member }}
                    </span>
                  </el-menu-item>
                </router-link>

                <router-link
                  v-if="stageLevel === 'sit' || loggedInUser.email === 'akmal@olsera.com'"
                  to="/marketing/promotions-material">
                  <el-menu-item
                    index="/marketing/promotions-material">
                    <span class="ml-10" slot="title">
                      {{ rootLang.download_promotions_material }}
                    </span>
                  </el-menu-item>
                </router-link>
              </el-submenu>
            </template>
          </template>

          <!-- customer supplier -->
          <router-link
            v-if="canAccess(loggedInUser.email, 'customer') || 
            selectedStore.role_id !== 'RP' &&
            selectedStore.role_id !== 'SA' &&
            selectedStore.role_id !== 'SS' &&
            selectedStore.role_id !== 'PT' &&
            selectedStore.role_id !== 'LW' ||
            (accessByStore.includes(selectedStore.url_id) && selectedStore.role_id === 'SS')"
            :to="(selectedStore.pos_freemium && !selectedStore.is_onlineshop) ? '/freemium' : '/customersupplier'">
            <el-menu-item
              class="olsera-menu-item">
              <svg-icon icon-class="customer_ico" />
              <span class="ml-10" slot="title">
                {{ lang.customer }} & {{ lang.supplier }}
              </span>
              <div
                v-if="selectedStore.pos_freemium && !selectedStore.is_onlineshop"
                class="premium-labeled">
                Premium
              </div>
            </el-menu-item>
          </router-link>

          <div class="menu-divider" />

          <!-- sales order -->
          <router-link
            v-if="canAccess(loggedInUser.email, 'sales') ||
            loggedInUser.email !== 'martina.maria@samaramicron.com' && 
            (selectedStore.role_id !== 'RP' &&
            selectedStore.role_id !== 'PT' &&
            selectedStore.role_id !== 'LW') &&
            !computedAccess('AS') ||
            (accessByStore.includes(selectedStore.url_id) && selectedStore.role_id === 'RP')"
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
            v-if="!canntAccessbyRole('purchase') && 
            selectedStore.role_id !== 'RP' && selectedStore.role_id !== 'SA' &&
            !computedAccess('AS') || 
            (accessByStore.includes(selectedStore.url_id) && selectedStore.role_id === 'RP')"
            :to="selectedStore.pos_freemium && !selectedStore.is_onlineshop ? '/freemium' : '/purchase'">
            <el-menu-item
              class="olsera-menu-item">
              <svg-icon icon-class="order_ico"></svg-icon>
              <span class="ml-10" slot="title">{{ lang.purchase }}</span>
              <div
                v-if="selectedStore.pos_freemium && !selectedStore.is_onlineshop"
                class="premium-labeled">
                Premium
              </div>
            </el-menu-item>
          </router-link>

          <!-- pendapatan pengeluaran -->
          <template
            v-if="selectedStore.role_id !== 'RP' && selectedStore.role_id !== 'PT' && selectedStore.role_id !== 'LW'">
            <template
              v-if="selectedStore.pos_freemium && !selectedStore.is_onlineshop">
              <router-link
                to="/freemium">
                <el-menu-item
                  class="olsera-menu-item">
                  <svg-icon icon-class="income_ico"></svg-icon>
                  <span class="ml-10" slot="title">
                    {{lang.revenue}}/{{lang.expense}}
                    <div class="premium-labeled">
                      Premium
                    </div>
                  </span>
                </el-menu-item>
              </router-link>
            </template>
            <template v-else>
              <el-submenu
                index="treemenu-revenue-expense"
                class="olsera-menu-item">
                <template slot="title">
                  <svg-icon icon-class="income_ico"></svg-icon>
                  <span class="ml-10" slot="title">{{lang.revenue}}/{{lang.expense}}</span>
                </template>
                <router-link to="/transaction">
                  <el-menu-item>
                    <span class="ml-10" slot="title">{{lang.transactions}}</span>
                  </el-menu-item>
                </router-link>
                <router-link v-if="canntAccess(loggedInUser.email, 'transaction-type')" to="/transactiontype">
                  <el-menu-item>
                    <span class="ml-10" slot="title">{{ lang.transaction_type }}</span>
                  </el-menu-item>
                </router-link>
              </el-submenu>
            </template>
          </template>

          <!-- laporan -->
          <router-link
            v-if="(selectedStore.role_id !== 'ST' &&
            selectedStore.role_id !== 'SA' &&
            selectedStore.role_id !== 'PT' &&
            selectedStore.role_id !== 'LW') &&
            !computedAccess('AS') ||
            (accessByStore.includes(selectedStore.url_id) && selectedStore.url_id !== 'atapsunsetcafe' && (selectedStore.role_id === 'SA' || selectedStore.role_id === 'PT' || selectedStore.role_id === 'ST' || selectedStore.role_id === 'LW'))"
            to="/reports">
            <el-menu-item
              class="olsera-menu-item">
              <svg-icon icon-class="report_ico" />
              <span class="ml-10" slot="title">{{ lang.reports }}</span>
            </el-menu-item>
          </router-link>

          <!-- Accounting -->
          <el-submenu
            v-if="loggedInUser.email === 'akmal@olsera.com' || loggedInUser.email === 'adhit82@gmail.com' || loggedInUser.email === 'support-makassar@olsera.com'"
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
            <el-menu-item index="/accounting/ledger">
              <span class="ml-10" slot="title">{{ $lang[langId].ledger }}</span>
            </el-menu-item>
            <el-menu-item index="/accounting/jurnal-log">
              <span class="ml-10" slot="title">{{ $lang[langId].jurnal_log }}</span>
            </el-menu-item>
            <el-menu-item index="/accounting/report">
              <span class="ml-10" slot="title">{{ $lang[langId].accounting_reports }}</span>
            </el-menu-item>
            <el-menu-item index="/accounting/closing">
              <span class="ml-10" slot="title">{{ $lang[langId].closing_book }}</span>
            </el-menu-item>
          </el-submenu>

          <router-link
            v-if="allow3rPartyAccountingAccessByEmail"
            to="/accounting-third">
            <el-menu-item index="/accounting-third" class="olsera-menu-item">
              <svg-icon icon-class="accounting_ico"></svg-icon>
              <span class="ml-10" slot="title">{{$lang[langId].accounting_3rd_party}}</span>
            </el-menu-item>
          </router-link>

          <div class="menu-divider" />

          <!-- POS -->
          <el-submenu
            v-if="(selectedStore.is_pos &&
            selectedStore.role_id !== 'ST' &&
            selectedStore.role_id !== 'RP' &&
            selectedStore.role_id !== 'SA' &&
            selectedStore.role_id !== 'SS' &&
            selectedStore.role_id !== 'PT' &&
            selectedStore.role_id !== 'LW') &&
            !computedAccess('AS') ||
            (accessByStore.includes(selectedStore.url_id) && (selectedStore.role_id === 'LW' || selectedStore.role_id === 'RP')) ||
            loggedInUser.email === 'store2@samaramicron.com' ||
            loggedInUser.email === 'store1@samaramicron.com'"
            index="treemenu-pos"
            class="olsera-menu-item">
            <template slot="title">
              <svg-icon icon-class="pos_ico"></svg-icon>
              <span class="ml-10" slot="title">{{ lang.point_of_sale }}</span>
            </template>

            <router-link to="/pos-settings">
              <el-menu-item>
                <span class="ml-10" slot="title">{{ $lang[langId].pos_setting }}</span>
              </el-menu-item>
            </router-link>

            <router-link
              v-if="selectedStore.pos_resto_mode &&
              selectedStore.role_id !== 'LW'"
              :to="!selectedStore.pos_freemium ? '/restomode' : '/freemium'">
              <el-menu-item>
                <span class="ml-10" slot="title" :style="langId === 'id' ? 'font-size: 15px' : ''">
                  {{ lang.restaurant_mode_settings }}
                </span>
                <div
                  v-if="selectedStore.pos_freemium"
                  class="premium-labeled">
                  Premium
                </div>
              </el-menu-item>
            </router-link>

            <router-link
              v-if="selectedStore.role_id !== 'LW'"
              :to="!selectedStore.pos_freemium ? '/begincash' : '/freemium'">
              <el-menu-item>
                <span class="ml-10" slot="title">{{ lang.daily_cash_balance }} (V1)</span>
                <div
                  v-if="selectedStore.pos_freemium"
                  class="premium-labeled">
                  Premium
                </div>
              </el-menu-item>
            </router-link>

            <router-link
              v-if="selectedStore.role_id !== 'LW'"
              :to="!selectedStore.pos_freemium ? '/shiftbalance' : '/freemium'">
              <el-menu-item>
                <span class="ml-10" slot="title">{{ lang.shift_summary }} (V2)</span>
                <div
                  v-if="selectedStore.pos_freemium"
                  class="premium-labeled">
                  Premium
                </div>
              </el-menu-item>
            </router-link>
          </el-submenu>

          <!-- website -->
          <template
            v-if="selectedStore.role_id !== 'ST' &&
            selectedStore.role_id !== 'RP' &&
            selectedStore.role_id !== 'SA' &&
            selectedStore.role_id !== 'SS' &&
            selectedStore.role_id !== 'PT' &&
            selectedStore.role_id !== 'LW'">
            <template
              v-if="selectedStore.pos_freemium && !selectedStore.is_onlineshop">
              <router-link
                to="/freemium">
                <el-menu-item
                  class="olsera-menu-item">
                  <svg-icon icon-class="shopbag_ico"></svg-icon>
                  <span class="ml-10" slot="title">
                    {{lang.website}}
                    <div class="premium-labeled">
                      Premium
                    </div>
                  </span>
                </el-menu-item>
              </router-link>
            </template>
            <template v-else>
              <el-submenu
                index="treemenu-website"
                class="olsera-menu-item">
                <template slot="title">
                  <svg-icon icon-class="shopbag_ico"></svg-icon>
                  <span class="ml-10" slot="title">{{ lang.website }}</span>
                </template>
                <router-link to="/website/mysite">
                  <el-menu-item>
                    <span class="ml-10" slot="title">{{ lang.my_site }}</span>
                  </el-menu-item>
                </router-link>
                <router-link to="/website/pages">
                  <el-menu-item>
                    <span class="ml-10" slot="title">{{ lang.page }} & {{ lang.article }}</span>
                  </el-menu-item>
                </router-link>
                <router-link to="/website/integrations">
                  <el-menu-item>
                    <span class="ml-10" slot="title">{{ $lang[langId].third_party_integration }}</span>
                  </el-menu-item>
                </router-link>
                <router-link
                  v-if="selectedStore.accept_reseller && selectedStore.role_id !== 'ST'"
                  to="/website/reseller">
                  <el-menu-item>
                    <span class="ml-10" slot="title">{{ lang.resellers }}</span>
                  </el-menu-item>
                </router-link>
              </el-submenu>
            </template>
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
              <span class="ml-10" slot="title">{{ lang.mobile_app }}</span>
            </template>
            <router-link to="/mobileapp/navigation">
              <el-menu-item>
                <span class="ml-10" slot="title">{{ lang.navigation }}</span>
              </el-menu-item>
            </router-link>
            <router-link to="/mobileapp/banner">
              <el-menu-item>
                <span class="ml-10" slot="title">{{ $lang[langId].banner }}</span>
              </el-menu-item>
            </router-link>
            <router-link to="/mobileapp/payment">
              <el-menu-item>
                <span class="ml-10" slot="title">{{ lang.payment }}</span>
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
            )"
            to="/online-order">
            <el-menu-item
              class="olsera-menu-item">
              <svg-icon icon-class="online-order-ico"/>
              <span class="ml-10" slot="title">{{ $lang[langId].online_order }}</span>
            </el-menu-item>
          </router-link>

          <!-- kiosk -->
          <router-link
            v-if="selectedStore.is_kiosk &&
            selectedStore.role_id !== 'ST' &&
            selectedStore.role_id !== 'RP' &&
            selectedStore.role_id !== 'SA' &&
            selectedStore.role_id !== 'SS' &&
            selectedStore.role_id !== 'PT' &&
            selectedStore.role_id !== 'LW'"
            to="/kiosk">
            <el-menu-item
              class="olsera-menu-item">
              <svg-icon icon-class="selforder_ico"></svg-icon>
              <span class="ml-10" slot="title">{{ lang.kiosk_self_service }}</span>
            </el-menu-item>
          </router-link>

          <!-- Attendance -->
          <router-link
            v-if="selectedStore.role_id === 'OW' ||
            selectedStore.role_id === 'SP'"
            to="/attendance">
            <el-menu-item
              class="olsera-menu-item">
              <svg-icon icon-class="attendance"/>
              <span class="ml-10" slot="title">{{ $lang[langId].attendance }}</span>
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
              <span class="ml-10" slot="title">
                {{ $lang[langId].service_activation }}
              </span>
            </el-menu-item>
          </router-link>

          <!-- Settlement -->
          <router-link
            v-if="selectedStore.role_id === 'OW'"
            to="/settlement">
            <el-menu-item
              class="olsera-menu-item">
              <svg-icon icon-class="settlement-ico"/>
              <span class="ml-10" slot="title">{{ $lang[langId].settlement }}</span>
            </el-menu-item>
          </router-link>

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
              <span class="ml-10" slot="title">{{ lang.settings }}</span>
            </template>
            <router-link to="/settings/store">
              <el-menu-item>
                <span class="ml-10" slot="title">{{ lang.store }}</span>
              </el-menu-item>
            </router-link>
            <!-- <router-link
              :to="selectedStore.pos_freemium && !selectedStore.is_onlineshop ? '/freemium' : '/settings/tax'">
              <el-menu-item>
                <span class="ml-10" slot="title">
                  {{ lang.tax_and_charges }}
                </span>
                <div
                  v-if="selectedStore.pos_freemium && !selectedStore.is_onlineshop"
                  class="premium-labeled">
                  Premium
                </div>
              </el-menu-item>
            </router-link> -->
            <router-link to="/settings/tax">
              <el-menu-item>
                <span class="ml-10" slot="title">{{ lang.tax_and_charges }}</span>
              </el-menu-item>
            </router-link>
            <router-link
              :to="selectedStore.pos_freemium && !selectedStore.is_onlineshop ? '/freemium' : '/settings/shippings'">
              <el-menu-item>
                <span class="ml-10" slot="title">
                  {{lang.deliveries }}
                  <div
                    v-if="selectedStore.pos_freemium && !selectedStore.is_onlineshop"
                    class="premium-labeled">
                    Premium
                  </div>
                </span>
              </el-menu-item>
            </router-link>
            <router-link
              :to="selectedStore.pos_freemium && !selectedStore.is_onlineshop ? '/freemium' : '/settings/loyaltypoint'">
              <el-menu-item>
                <span class="ml-10" slot="title">
                  {{ lang.loyalty_point }}
                  <div
                    v-if="selectedStore.pos_freemium && !selectedStore.is_onlineshop"
                    class="premium-labeled">
                    Premium
                  </div>
                </span>
              </el-menu-item>
            </router-link>
            <router-link
              :to="selectedStore.pos_freemium && !selectedStore.is_onlineshop ? '/freemium' : '/settings/notification'">
              <el-menu-item>
                <span class="ml-10" slot="title">
                  {{ $lang[langId].notifications }}
                  <div
                    v-if="selectedStore.pos_freemium && !selectedStore.is_onlineshop"
                    class="premium-labeled">
                    Premium
                  </div>
                </span>
              </el-menu-item>
            </router-link>
            <router-link
              :to="selectedStore.pos_freemium && !selectedStore.is_onlineshop ? '/freemium' : '/settings/publishstore'">
              <el-menu-item>
                <span class="ml-10" slot="title">
                  {{ lang.publish_store }}
                  <div
                    v-if="selectedStore.pos_freemium && !selectedStore.is_onlineshop"
                    class="premium-labeled">
                    Premium
                  </div>
                </span>
              </el-menu-item>
            </router-link>
          </el-submenu>
        </el-menu>
      </perfect-scrollbar>
    </section>
  </aside>
</template>

<script>
import Avatar from 'vue-avatar'
import { logout } from '@/api/auth'
import { redirectToV1 } from '@/api/redirectV1'
import { asyncRouterMap } from '@/routes'
export default {
  name: 'DashboardSidebar',
  components: {
    Avatar
  },
  props: ['loggedInUser', 'selectedStore'],
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
    computedMenus() {
      return this.menus.filter(item => {
        if (!item.hidden) {
          return item
        }
      })
    },
    isCollapse() {
      return this.$store.state.sidebarCollapse
    },
    stageLevel() {
      return process.env.ENV_CONFIG
    },
    accessByStore () {
      return ['atapsunsetcafe']
    },
    accessByEmail () {
      return ['gudang@samaramicron.com', 'hkr.shoichi@gmail.com']
    },
    allow3rPartyAccountingAccessByEmail () {
      const emails = [
        'adhit82@gmail.com',
        'tokkebisnacks@gmail.com',
        'dayu@smgindonesia.com'
      ]
      const store = ['barecoffeekenjeran', 'barecoffee', 'setdemo1']
      if (store.includes(this.selectedStore.url_id)) {
        return store.includes(this.selectedStore.url_id)
      } else {
        return emails.includes(this.loggedInUser.email)
      }
    },
    // for custom search menu sidebar (experimental)
    dataRoleAcces () {
      let data = []
      if (this.selectedStore.role_id === 'RP') {
        data = ['reports', 'dashboard']
      }
      if (this.selectedStore.role_id === 'LW') {
        data = ['inventory', 'print_barcode', 'purchases_list']
      }
      return data
    },
    computedMenus2() {
      return this.menus.filter(item => {
        if (!item.hidden && this.dataRoleAcces.includes(item.localization_key) && item.localization_key !== 'freemium') {
          return item
        }
      })
    },
    // for custom search menu sidebar (experimental)
  },
  methods: {
    goToProfilePage() {
      this.$router.push({path: '/profile'})
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
    },
    handleDropdown (data) {
      this.btnprofile = data
    },
    computedAccess (role_id) {
      if (role_id === 'PT') {
        if (this.accessByStore.includes(this.selectedStore.url_id) && this.selectedStore.role_id === 'PT') {
          return true
        }
      } else if (role_id === 'SS') {
        if (this.accessByStore.includes(this.selectedStore.url_id) && this.selectedStore.role_id === 'SS') {
          return true
        }
      } else if (role_id === 'AS') {
        if (this.accessByStore.includes(this.selectedStore.url_id) && this.selectedStore.role_id === 'AS') {
          return true
        }
      }
    },
    modulCanAccess (email) {
      let data = []
      if (email === 'ap@samaramicron.com') {
        data = ['customer', 'sales']
      }
      return data
    },
    canAccess (email, modul) {
      console.log(email)
      if (this.accessByStore.includes(this.selectedStore.url_id) && this.modulCanAccess(email).includes(modul)) {
        return true
      } else {
        return false
      }
    },
    modulCantAccess (emailorstore) {
      let data = []
      if (emailorstore === 'sales@samaramicron.com') {
        data = ['inventory', 'transaction-type']
      }
      if (emailorstore === 'martina.maria@samaramicron.com') {
        data = ['inventory']
      }
      if (emailorstore === 'adhikitchenwareinovation') {
        data = ['purchase']
      }
      return data
    },
    canntAccess (email, modul) {
      if (this.accessByStore.includes(this.selectedStore.url_id) && this.modulCantAccess(email).includes(modul)) {
        return false
      } else {
        return true
      }
    },
    canntAccessbyRole (modul) {
      if (this.modulCantAccess(this.selectedStore.url_id).includes(modul) && this.selectedStore.role_id === 'LW') {
        return true
      } else {
        return false
      }
    },
  }
}
</script>