<template>
  <div>
    <div class="content-wrapper dashboard-wrapper">
      <section class="content">
        <div
          class="flex-container no-flex-sm flex-container--same-height flex-container--content-space-between">
          <div
            v-if="dataProfile.otp && !dataProfile.otp.status"
            class="dasboard-tokourl flex-container p-16 mr-8"
            style="flex-basis: 50%; flex-grow: 1;">
            <div class="mr-8">
              <svg-icon icon-class="icon_verify" style="width:24px; height:40px;"/>
            </div>
            <div class="font-14 mr-8" style="flex-grow: 1;">
              <div class="font-12 font-bold color-primary">{{ dataProfile.mobile }}</div>
              {{ rootLang.mobile_verify_desc }}
            </div>
            <el-button
              type="text"
              @click="showOtp">
              {{ rootLang.verify }}
            </el-button>
          </div>

          <div
            v-if="dataProfile.verified"
            class="dasboard-tokourl flex-container p-16"
            style="flex-basis: 50%; flex-grow: 1;">
            <div class="mr-8">
              <svg-icon icon-class="email-verify" style="width:24px; height:54px;"/>
            </div>
            <div class="font-14 mr-8" style="flex-grow: 1;">
              <div class="font-12 font-bold color-primary">{{ dataProfile.email }}</div>
              {{ rootLang.email_verify_desc1 }}
            </div>
            <el-button type="text" @click="showResendEmail">{{ rootLang.verify }}</el-button>
          </div>
        </div>

        <warning-online-order
          v-if="showWarningInfo"
          :show-warning="showWarning"
          :data-services="dataServices"
          :data-term="dataTerm"
          @accept="showWarningInfo = false, showWarning = false"
          @close="showWarning = false, showWarningInfo = false"
        />

        <warning-online-order
          v-if="computedShowLocation"
          :show-warning="showWarningLocation"
          :data-services="dataServices"
          :data-store="dataStore"
          :data-term="dataTerm"
          :text-location="true"
          @save="saveLocation"
          @close="showWarningLocation = false"
        />

        <warning-online-order
          v-if="showWarningInfoRule"
          :show-warning="showWarningRule"
          :show-info-rule="true"
          :data-services="dataServices"
          :data-term="dataTerm"
          @accept="showWarningInfoRule = false, showWarningRule = false"
          @close="showWarningInfoRule = false, showWarningRule = false"
        />

        <!-- new toko section -->
        <template v-if="stageLevel === 'dev' || stageLevel === 'sit'">
          <div class="flex-container" style="margin: 8px 0 16px 0;">
            <el-avatar
              :alt="selectedStore.name"
              :src="selectedStore.logo"
              style="margin-right: 16px; background: #EEEEEE"
            />
            <div style="font-size: 24px; font-weight: bold; margin-right: auto">{{ selectedStore.name }}</div>
            <div 
              class="flex-container pointer" 
              style="align-items: center"
              @click="handleShowWeb"
            >
              <div style="font-size: 16px; font-weight: bold; color: #1685C7">{{ selectedStore.url_id + '.myolsera.com'}}</div>
              <el-button
                type="text"
                style="margin-left: 8px;"
              >
                <svg-icon icon-class="external-link" style="font-size: 20px"/>
              </el-button>
            </div>
          </div>
        </template>
        <!-- old toko section -->
        <template v-else>
          <div class="dasboard-tokourl">
            <div class="flex-container">
              <el-avatar
                :alt="selectedStore.name"
                :src="selectedStore.logo"
                style="margin-right: 4px;background: #EEEEEE"
              />

              <div style="margin-right: 4px;">
                <div style="font-size: 18px">{{ selectedStore.name }}</div>
                <div style="font-size: 12px; color: #767676">{{ selectedStore.url_id + '.myolsera.com'}}</div>
              </div>

              <el-button
                type="text"
                style="margin-right: 4px;"
                @click="handleShowWeb">
                <svg-icon icon-class="external-link" style="width:24px; height:24px;"/>
              </el-button>

              <div style="flex-grow: 2" />

              <el-button
                size="small"
                class="date-filter-dashboard"
                @click="toggleFilter">
                <i class="fa fa-filter" />
                <span>{{ labelDate }}</span>
              </el-button>
            </div>
          </div>
        </template>

        <pending-billing-notif />
        
        <store-lifetime
          :loading="loadingDashboardH"
          :data-store="dashboardH"
          :selected-plan="selectedPlan"
          @billing="visibleDialogListBilling = true"
          @updatetrial="showUpdateTrial = true"
        />

        <compare-sales
          v-if="wejayafoodAccessByStore.includes(selectedStore.url_id)"
          :loading="loadingCompare"
          :chart-revenue-date="dataCompare"
          :data-compare-sales="dataCompareSales"
          :params="paramsCompare"
          @changemenu="getCompareSales"
        />
        
        <!-- new glance store -->
        <template v-if="stageLevel === 'dev' || stageLevel === 'sit'">
          <div class="flex-container" style="align-items-center; margin: 24px 0">
            <div class="pointer full-width wrap-text--width80" @click="handleShowList">
              <p style="margin: 0 auto 0 0; font-size: 16px; font-weight: bold" >
                <!-- {{rootLang.glance_your_store}} -->
                Sekilas {{ glanceName }}
              </p>
            </div>
            <el-button
              size="small"
              class="date-filter-dashboard"
              @click="toggleFilter">
              <i class="fa fa-filter" />
              <span>{{ labelDate }}</span>
            </el-button>
          </div>
          <transition name="el-zoom-in-top">
            <div
              v-if="outlets && outlets.length >= 1"
              v-show="visibleStoreList"
              class="custom-dropdown-dashboard box-shadow radius-16 color-white--bg">
                <div
                  v-for="item in outlets"
                  :key="item.store_id"
                  class="p-8 pointer"
                  @click="handleSelectStore(item)">
                  <!-- <perfect-scrollbar class="scrollBulkPair"> -->
                  <template>
                    <div class="flex-container p-8 radius-5" >
                      <div class="mr-8 font-bold" style="flex-grow: 1;">
                        {{ item.name }}
                      </div>
                      <div>
                        <el-checkbox v-model="item.checked" />
                      </div>
                    </div>
                  </template>
                  <!-- </perfect-scrollbar> -->
                </div>
            </div>
          </transition>
        </template>
        <!-- old glance store -->
        <template v-else>
          <glance-your-store :loading="loadingDashboardH" :data="dashboardH" />
        </template>
        <!--  -->

        <income
          :loading="loadingDashboardC"
          :chart-revenue-date="chartRevenueDate"
          :chart-revenue-hour="chartRevenueHour"
        />

        <expense
          :loading="loadingDashboardH"
          :chart-revenue-date="chartRevenueDateExpense"
          :chart-revenue-hour="chartRevenueHourExpense"
        />

        <refund
          :loading="loadingDashboardC"
          :chart-return="chartReturn"
          :colors-return="colorsReturn"
        />

        <!-- new sales source -->
        <template v-if="stageLevel === 'dev' || stageLevel === 'sit'">
          <template v-if="userRole.role_id !== 'ST' && userRole.role_id !== 'SA'">
            <el-card v-loading="loadingDashboardC" class="radius-10">
              <div slot="header">
                <div class="flex-container">
                  <svg-icon icon-class="shopping-cart" style="font-size: 24px"/> 
                  <h4 style="margin-left: 16px">{{ lang.sales_source }}</h4>
                </div>
              </div>
              <div class="card-body">
                <div v-if="dashboardC.revenue_groupings && dashboardC.revenue_groupings.length === 0">
                  Tidak ada penjualan
                </div>
                <div 
                  v-else 
                  class="sales-source">
                  <div v-if="dashboardC.revenue_groupings && dashboardC.revenue_groupings.data" class="sales-source--summary-bar">
                    <div class="summary-item-wrapper">
                      <div
                        v-for="(item) in dashboardC.revenue_groupings.data"
                        :key="item.id"
                        class="summary-item"
                        :style="salesSourceBar(item.value_percentage, item.colors)"
                      ></div>
                    </div>
                  </div>
                  <div
                    v-if="dashboardC.revenue_groupings && dashboardC.revenue_groupings.data"
                    class="sales-source--content-wrapper">
                    <template v-for="(item) in dashboardC.revenue_groupings.data">
                      <!-- v-if="item.id === 'O' || item.id === 'M' || item.id === 'P' || item.id === 'D' || item.id === 'T'" -->
                      <div 
                        :key="item.id"
                        class="item-wrapper"
                      >
                        <div class="circle" :style="salesSourceColor(item.colors)"></div>
                        <div class="info">
                          <p class="info--label">{{item.label}} - {{item.fvalue_percentage}}</p>
                          <p class="info--value">{{item.fvalue}}</p>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </el-card>
          </template>
        </template>
        <!-- old sales source -->
        <template v-else>
          <sales-source
            :loading="loadingDashboardC"
            :data="dashboardC"
            :show-circle="showCircle"
            :show-circle-more="showCircleMore"
            :show-circle-more2="showCircleMore2"
          />
        </template>

        <div class="mb-24 mt-24">
          <hr style="border-top: 0.5px solid #CECECE !important">
          <div class="font-12 color-grey--placeholder full-width text-center" style="margin-top: -30px">
            <span class="px-8" style="background: #FFFFFF">{{ selectedStore.name }}</span>
          </div>
        </div>

        <template v-if="userRole.role_id !== 'ST' && userRole.role_id !== 'SA'">
          <el-card v-loading="loadingDashboardC" class="box-card radius-10">
            <div slot="header">
              <h4>{{ $lang[langId].most_sales_group_product }}</h4>
            </div>
            <div class="card-body">
              <p v-if="!showGroup">{{ $lang[langId].no_product }}</p>
              <ul v-if="showGroup" class="cart-items" style="padding:0; width:100%">
                <li v-for="(item, index) in dashboardC.sales_item_groupings.data" :key="index">
                  <div>
                    <span class="pull-left">{{ item.label }}</span>
                    <span class="text-right">{{ item.value }} {{ lang.product }}</span>
                  </div>
                  <el-progress :percentage="item.value" :stroke-width="18" :show-text="false" :color="item.colors"></el-progress>
                </li>
              </ul>
            </div>
          </el-card>
          <div v-loading="loadingDashboardC">
            <!-- <el-row :gutter="20">
              <el-col :md="12" v-for="(item, index) in dashboardC.sales_items_pergroup" :key="index">
                <el-card class="box-card">
                  <div slot="header">
                    <h4>{{ item.name }}</h4>
                    <div class="font-12 color-info">
                      {{ item.total_sales_items_pergroup }} {{ lang.product }}
                    </div>
                  </div>
                  <div class="card-body">
                    <ul class="cart-items" style="padding:0; width:100%">
                      <li v-for="(list, index) in item.data" :key="index">
                        <div>
                          <span class="pull-left">{{ list.name }}</span>
                          <span class="text-right">{{ list.total_qty }} {{ lang.product }}</span>
                        </div>
                        <el-progress :percentage="list.total_qty" :stroke-width="18" :show-text="false" :color="item.colors"></el-progress>
                      </li>
                    </ul>
                  </div>
                </el-card>
              </el-col>
            </el-row> -->
            <div style="display: flex; flex-wrap: wrap; justify-content: space-between;">
              <div 
                v-for="(item, index) in dashboardC.sales_items_pergroup" 
                :key="index" 
                style="width: 49%; margin-bottom: 16px"
              >
                <el-card style="height: 100%;">
                  <div slot="header">
                    <h4>{{ item.name }}</h4>
                    <div class="font-12 color-info">
                      {{ item.total_sales_items_pergroup }} {{ lang.product }}
                    </div>
                  </div>
                  <div class="card-body ">
                    <ul class="cart-items" style="padding:0; width:100%">
                      <li v-for="(list, index) in item.data" :key="index">
                        <div>
                          <span class="pull-left">{{ list.name }}</span>
                          <span class="text-right">{{ list.total_qty }} {{ lang.product }}</span>
                        </div>
                        <el-progress :percentage="list.total_qty" :stroke-width="18" :show-text="false" :color="item.colors"></el-progress>
                      </li>
                    </ul>
                  </div>
                </el-card>
              </div>
            </div>
          </div>
        </template>

        <el-card
          v-loading="loadingDashboardF"
          class="box-card radius-10">
          <div slot="header">
            <div class="flex-container">
              <h4 style="flex-grow: 2;">{{ $lang[langId].new_order }}</h4>
              <div class="card-buttons">
                <el-radio-group v-model="newOrder" size="small">
                  <el-radio-button :label="0">{{ lang.orders }}</el-radio-button>
                  <el-radio-button :label="1">{{ lang.payment }}</el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </div>
          <div class="card-body">
            <div v-if="newOrder === 0">
              <p v-if="!showOrder">{{ lang.no_order }}</p>
              <template v-else>
                <ul class="cart-items" style="padding:0; width:100%">
                  <!-- new order list -->
                  <template v-if="stageLevel === 'dev' || stageLevel === 'sit'">
                    <template v-for="(item, index) in dashboardF.recent_orders.data">
                      <li v-if="index % 2 === 0" :key="index">
                        <el-row :gutter="16">
                          <el-col :md="8">
                            <div style="display: flex; align-items-center">
                              <el-avatar 
                                :src="item.status"
                                :size="35"
                              >
                                <template v-if="item.status">
                                  {{ item.status.split('')[0] }}
                                </template>
                              </el-avatar>
                              <div style="margin-left: 6px">
                                <div class="semi-bold font-14">
                                  {{ item.order_no }}
                                </div>
                                <div
                                  class="font-12 color-info"
                                  style="display: flex; align-items: center"
                                >
                                  <div>{{ item.order_date }}</div>
                                  <div class="custom-divider-circle"></div>
                                  <div>{{ item.items_qty }} {{ lang.item }}</div>
                                  <div class="custom-divider-circle"></div>
                                  <div>{{ item.ftotal_amount }}</div>
                                </div>
                              </div>
                            </div>
                          </el-col>
                          <el-col :md="4">
                            <div class="flex-container" style="justify-content: flex-end;">
                              <div 
                                class="status-order"
                                :class="statusOrderColorGenerator(item.status)"
                              >
                                {{ item.status_desc }}
                              </div>
                            </div>
                          </el-col>
                          <template v-if="dashboardF.recent_orders.data[index + 1] !== undefined">
                            <el-col :md="8">
                              <div style="display: flex; align-items-center">
                                <el-avatar 
                                :src="dashboardF.recent_orders.data[index + 1].status"
                                :size="35"
                                >
                                  <template v-if="dashboardF.recent_orders.data[index + 1].status">
                                    {{ dashboardF.recent_orders.data[index + 1].status.split('')[0] }}
                                  </template>
                                </el-avatar>
                                <div style="margin-left: 6px">
                                  <div class="semi-bold font-14">
                                    {{ dashboardF.recent_orders.data[index + 1].order_no }}
                                  </div>
                                  <div
                                    class="font-12 color-info"
                                    style="display: flex; align-items: center"
                                  >
                                    <div>{{ dashboardF.recent_orders.data[index + 1].order_date }}</div>
                                    <div class="custom-divider-circle"></div>
                                    <div>{{ dashboardF.recent_orders.data[index + 1].items_qty }} {{ lang.item }}</div>
                                    <div class="custom-divider-circle"></div>
                                    <div>{{ dashboardF.recent_orders.data[index + 1].ftotal_amount }}</div>
                                  </div>
                                </div>
                              </div>
                            </el-col>
                            <el-col :md="4">
                              <div class="flex-container" style="justify-content: flex-end;">
                                <div 
                                  class="status-order"
                                  :class="statusOrderColorGenerator(dashboardF.recent_orders.data[index + 1].status)"
                                >
                                  {{ dashboardF.recent_orders.data[index + 1].status_desc }}
                                </div>
                              </div>
                            </el-col>
                          </template>
                        </el-row>
                      </li>
                    </template>
                  </template>
                  <!-- old order list -->
                  <template v-else>
                    <li v-for="(item, index) in dashboardF.recent_orders.data" :key="index">
                      <el-row :gutter="16">
                        <el-col :md="8">
                          <div class="semi-bold font-14">
                            {{ item.order_no }}
                          </div>
                          <div
                            class="font-12 color-info"
                            style="display: flex; align-items: center"
                          >
                            <div>{{ item.order_date }}</div>
                            <div class="custom-divider-circle"></div>
                            <div>{{ item.items_qty }} {{ lang.item }}</div>
                            <div class="custom-divider-circle"></div>
                            <div>{{ item.ftotal_amount }}</div>
                          </div>
                        </el-col>
                        <el-col :md="4">
                          <div class="flex-container" style="justify-content: flex-end;">
                            <div 
                              class="status-order"
                              :class="statusOrderColorGenerator(item.status)"
                            >
                              {{ item.status_desc }}
                            </div>
                          </div>
                        </el-col>
                        <el-col :md="8">
                          <div class="semi-bold font-14">
                            {{ item.order_no }}
                          </div>
                          <div
                            class="font-12 color-info"
                            style="display: flex; align-items: center"
                          >
                            <div>{{ item.order_date }}</div>
                            <div class="custom-divider-circle"></div>
                            <div>{{ item.items_qty }} {{ lang.item }}</div>
                            <div class="custom-divider-circle"></div>
                            <div>{{ item.ftotal_amount }}</div>
                          </div>
                        </el-col>
                        <el-col :md="4">
                          <div class="flex-container" style="justify-content: flex-end;">
                            <div 
                              class="status-order"
                              :class="statusOrderColorGenerator(item.status)"
                            >
                              {{ item.status_desc }}
                            </div>
                          </div>
                        </el-col>
                      </el-row>
                    </li>
                  </template>
                </ul>
              </template>
            </div>
            <div v-if="newOrder === 1">
              <p v-if="!showPayment">{{ lang.no_payment }}</p>
              <template v-else>
                <ul class="cart-items" style="padding:0; width:100%">
                  <!-- new payment list -->
                  <template v-if="stageLevel === 'dev' || stageLevel === 'sit'">
                    <template v-for="(item, index) in dashboardF.recent_payments.data">
                      <li v-if="index % 2 === 0" :key="index">
                        <el-row :gutter="16">
                          <el-col :md="12">
                            <div style="display: flex; align-items-center">
                              <el-avatar 
                                :src="item.customer_name"
                                :size="35"
                              >
                                <template v-if="item.customer_name">
                                  {{ item.customer_name.split('')[0] }}
                                </template>
                              </el-avatar>
                              <div style="margin-left: 6px">
                                <div class="semi-bold font-14">
                                  {{ item.order_no }}
                                </div>
                                <div 
                                  class="font-12 color-info"
                                  style="display: flex; align-items: center"
                                >
                                  <div>{{ item.order_date }}</div>
                                  <div class="custom-divider-circle"></div>
                                  <div>{{ item.items_qty }} {{ lang.item }}</div>
                                  <div class="custom-divider-circle"></div>
                                  <div>{{ item.ftotal_amount }}</div>
                                </div>
                              </div>
                            </div>
                          </el-col>
                          <template v-if="dashboardF.recent_payments.data[index + 1] !== undefined">
                            <el-col :md="12">
                              <div style="display: flex; align-items-center">
                                <el-avatar 
                                  :src="dashboardF.recent_payments.data[index + 1].customer_name"
                                  :size="35"
                                >
                                  <template v-if="dashboardF.recent_payments.data[index + 1].customer_name">
                                    {{ dashboardF.recent_payments.data[index + 1].customer_name.split('')[0] }}
                                  </template>
                                </el-avatar>
                                <div style="margin-left: 6px">
                                  <div class="semi-bold font-14">
                                    {{ dashboardF.recent_payments.data[index + 1].order_no }}
                                  </div>
                                  <div 
                                    class="font-12 color-info"
                                    style="display: flex; align-items: center"
                                  >
                                    <div>{{ dashboardF.recent_payments.data[index + 1].order_date }}</div>
                                    <div class="custom-divider-circle"></div>
                                    <div>{{ dashboardF.recent_payments.data[index + 1].items_qty }} {{ lang.item }}</div>
                                    <div class="custom-divider-circle"></div>
                                    <div>{{ dashboardF.recent_payments.data[index + 1].ftotal_amount }}</div>
                                  </div>
                                </div>
                              </div>
                            </el-col>
                          </template>
                        </el-row>
                      </li>
                    </template>
                  </template>
                  <!-- old payment list -->
                  <template v-else>
                    <li v-for="(item, index) in dashboardF.recent_payments.data" :key="index">
                      <h5>{{ item.order_no }}</h5>
                      <div style="display: flex">
                        <span>
                          <svg-icon icon-class="calendar"></svg-icon>
                          {{ item.order_date }}
                        </span>
                        <span style="margin-left:10px;">
                          <svg-icon icon-class="box"></svg-icon>
                          {{ item.items_qty }} {{ lang.item }}
                        </span>
                        <span style="margin-left:10px;">
                          <svg-icon icon-class="tag"></svg-icon>
                            {{ item.ftotal_amount }}
                        </span>
                      </div>
                    </li>
                  </template>
                  <!--  -->
                </ul>
              </template>
            </div>
          </div>
        </el-card>
      </section>
    </div>

    <!-- dialog phone number verification -->
    <dialog-phone-verification
      :data-profile="dataProfile"
      :show="visibleDialogPhoneVerification"
      @close="visibleDialogPhoneVerification = false"
      @verified="handlePhoneVerified"
      @changesms="changeSms(false)"
    />

    <!-- dialog phone number verification by citcall -->
    <dialog-cit-call-verification
      :data-profile="tempProfile"
      :show="visibleDialogCitCall"
      :otp-sent="hasMiscall"
      :loadingMiscall="loadingBtnMiscall"
      :count-start="countStart"
      :count-end="countEnd"
      :count-dialog="countDialog"
      :dashboard="true"
      @close="closeCitcall"
      @verified="handlePhoneVerified"
      @changesms="changeSms(true)"
    />

    <!-- dialog email verification -->
    <el-dialog
      :visible.sync="showDialogEmail"
      :before-close="hideverify"
      :close-on-click-modal="true"
      :show-close="true"
      custom-class="mw-480 without-padding-dialog dialog-without-header overflow-hidden">
      <div
        class="px-24"
        style="background: transparent linear-gradient(117deg, #FFFFFF 0%, #F1FBFF 100%) 0% 0% no-repeat padding-box; flex-basis: 100%;">
        <div class="text-center">
          <img
            width="311px;"
            src="../../../../static/img/email-verify-icon.svg"
          />
          <div class="font-18 font-bold">{{ rootLang.email_has_sent }} {{ dataProfile.email }}</div>
          <el-button
            type="primary"
            class="btn-block mt-16"
            @click="showDialogEmail = false">
            {{ rootLang.ok_saya_cek }}
          </el-button>
          <el-button
            :loading="loadingSendCode"
            class="btn-block mt-16 mb-16"
            @click="resendCodeEmail">
            {{ rootLang.resend }}
          </el-button>
        </div>
      </div>
    </el-dialog>

    <custom-date-filter
      :show-filter="showFilter"
      @close="dateFilterClose"
      @reset="dateFilterReset"
      @save="dateFilterSave"
    />

    <dialog-list-billing
      :show="visibleDialogListBilling"
      @close="visibleDialogListBilling = false"
    />

    <dialog-verify
      v-if="!showWarningLocation"
      :show="showEmailVerify"
      :root-lang="rootLang"
      :data-profile="dataProfile"
      :verify-number="verifyNumber"
      @close="showEmailVerify = false"
      @resend="resendCodeVerify"
    />

    <el-dialog
      :visible.sync="showWarningWa"
      :close-on-click-modal="false"
      :show-close="false"
      width="536px"
      class="dialog-notif-online">
      <div slot="title" class="flex-container">
        <h4 class="dialog-title full-width">
          Baru, 💬 nomor Whatsapp untuk Online Order
        </h4>
      </div>
      <div class="px-8 mb-24">
        Untuk memudahkan pelanggan menghubungi Anda pada layanan Online Order, sediakan nomor Whatsapp yang dapat dihubungi. Pengaturan ini baru khusus untuk layanan Online Order. Anda dapat mengaturnya di menu 
        <span class="font-bold">📌 Online Order > Pengaturan.</span> Lengkapi nomor Whatsapp sekarang!
      </div>
      <div>
        <el-button type="primary" class="btn-block" @click="showInputWa = true" >Lengkapi nomor Whatsapp</el-button>
        <el-button type="text" class="btn-block" @click="saveWa(true)" >Oke, nanti saya cek</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="showInputWa"
      :show-close="false"
      :before-close="handleCloseInputWa"
      custom-class="dialog-card">
        <div slot="title" class="flex-container">
          <h4 class="dialog-title full-width">
            Whatsapp
          </h4>
          <div class="btn_save_dialog full-width text-right">
            <el-button type="info" @click="handleCloseInputWa">{{ lang.cancel }}</el-button>
            <el-button :loading="loadingAuto" type="primary" @click="saveWa(false)">{{ $lang[langId].next }}</el-button>
          </div>
        </div>
        <div>
          <div class="radius-10 color-grey--bg flex-container p-16">
            <div>
              <svg-icon icon-class="clock" class="font-20 color-grey--icon"/>
            </div>
            <div class="ml-8 word-break">
              Nomor Whatsapp ini akan digunakan pelanggan untuk menghubungi toko Anda pada layanan Online Order
            </div>
          </div>
          <div class="mt-16">
            <div class="font-12">Nomor Whatsapp</div>
            <phone-number-input
              v-model="whatsappnumber"
              :translations="{
                countrySelectorLabel: '',
                countrySelectorError: '',
                phoneNumberLabel: '',
                example: ''
              }"
              :only-countries="['ID', 'SG']"
              default-country-code="ID"
              @update="getPhone"
              class="field-register"
            />
          </div>
        </div>
    </el-dialog>

    <el-dialog
      :visible.sync="showUpdateTrial"
      :close-on-click-modal="true"
      :show-close="true"
      width="536px"
      class="dialog-notif-online">
      <div slot="title" class="flex-container">
        <h4 class="dialog-title full-width">
          Anda akan mengaktifkan Trial Premium 14 hari 🎉
        </h4>
      </div>
      <div class="px-8 mb-24">
        Selebihnya Anda dapat memutuskan untuk berlangganan fitur Premium atau kembali menggunakan fitur Lite.
      </div>
      <div>
        <el-button :loading="loadingTrial" type="primary" class="btn-block" @click="updateTrial">Oke, aktifkan Trial Premium sekarang</el-button>
        <!-- <el-button type="text" class="btn-block" @click="saveWa(true)" >Oke, nanti saya cek</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CustomDateFilter from 'modules/CustomDateFilter'
import GlanceYourStore from './GlanceYourStore'
import StoreLifetime from './StoreLifetime'
import Income from './Income'
import Expense from './expense'
import Refund from './Refund'
import SalesSource from './SalesSource'
import WarningOnlineOrder from './WarningOnlineOrder'
import DialogPhoneVerification from '@/components/DialogPhoneVerification'
import DialogListBilling from '@/components/DialogListBilling'
import PendingBillingNotif from './PendingBillingNotif'
import DialogVerify from './DialogVerify';
import DialogCitCallVerification from '@/components/DialogCitCallVerification'
import CompareSales from './CompareSales'
// import Whatsnew from './Whatsnew'

import basicComputedMixin from '@/mixins/basicComputedMixin'
import {HTTP, API} from 'src/http-common'
import { baseApi } from 'src/http-common'
import axios from 'axios'
import moment from 'moment'
import { getService, cekTermCondition, getSetting } from '@/api/onlineorder'
import { upgradeStoreTrial, getDataCompareSales } from '@/api/dashboard'

const apiEndpoint = 'dashboard/'

export default {
  name: 'dashboard-view',

  mixins: [basicComputedMixin],

  components: {
    CustomDateFilter,
    GlanceYourStore,
    StoreLifetime,
    Income,
    Expense,
    Refund,
    SalesSource,
    DialogListBilling,
    PendingBillingNotif,
    DialogVerify,
    WarningOnlineOrder,
    DialogPhoneVerification,
    DialogCitCallVerification,
    CompareSales
  },

  data() {
    return {
      loading: false,
      showGroup: false,
      showOrder: false,
      showPayment: false,
      showCircle: false,
      showCircleMore: false,
      showCircleMore2: false,
      disableDate: true,
      user: this.$store.state.loggedInUser,
      dashboardH: {},
      dashboardC: {},
      dashboardF: {},
      params: {
        from: '',
        to: ''
      },
      formFilter: {
        startDate: '',
        endDate: '',
        labelForDate: ''
      },
      income: 0,
      newOrder: 0,
      labelTag: 'weekago',
      labelDate: '',
      chartRevenueDate: {
        columns: ['date', 'total'],
        rows: []
      },
      chartRevenueHour: {
        columns: ['hour', 'total'],
        rows: []
      },
      chartRevenueDateExpense: {
        columns: ['date', 'total'],
        rows: []
      },
      chartRevenueHourExpense: {
        columns: ['hour', 'total'],
        rows: []
      },
      chartReturn: {
        columns: ['date', 'total'],
        rows: []
      },
      colorsReturn: ['#C60055'],
      showFilter: false,
      filterTag: '',
      visibleDialogPhoneVerification: false,
      hideDialog: false,
      errorOtp: {
        show: false,
        message: ''
      },
      phoneTrue: false,
      loadingSendCode: false,
      visibleDialogListBilling: false,
      showDialogEmail: false,
      showEmailVerify: false,
      verifyNumber: false,
      dataServices: {},
      showWarningInfo: false,
      dataTerm: {},
      showWarning: false,
      setupLocation: false,
      showWarningLocation: true,
      dataStore: {},
      showWarningWa: false,
      showInputWa: false,
      whatsappnumber: null,
      loadingAuto: false,
      loadingGlanceYourStore: false,
      loadingDashboardF: false,
      loadingDashboardC: false,
      loadingDashboardH: false,
      loadingTrial: false,
      showWarningInfoRule: false,
      showWarningRule: false,
      visibleDialogCitCall: false,
      hasMiscall: false,
      loadingBtnMiscall: false,
      countDialog: 1,
      countStart: '',
      countEnd: '',
      tempProfile: {},
      showUpdateTrial: false,
      loadingCompare: false,
      dataCompare: {},
      dataCompareSales: {},
      paramsCompare: {},
      storeToBeSaved: [],
      paramsMultipleStore: {
        to_store_id: 0,
        to_allstore_id: 0
      },
      visibleStoreList: false
    }
  },

  watch: {
    selectedStore(store) {
      this.storeToBeSaved = [store]
    }
  },

  computed: {
    computedShowLocation () {
      if (
        this.setupLocation && 
        (
          this.dataServices.use_delivery === 1 ||
          this.dataServices.use_takeaway === 1 ||
          this.dataServices.use_dinein === 1 ||
          this.dataServices.use_reservation === 1
        )
      ) {
        this.showWarningLocation = true
        if (this.showEmailVerify) {
          this.showEmailVerify = false
        }
        return true
      } else {
        return false
      }
    },
    dataProfile() {
      const data = this.$store.getters.loggedInUser
      this.tempProfile = { ...data}
      return data
    },
    selectedPlan() {
      const plans = require('/static/data/package-types.json')
      if (this.selectedStore && this.selectedStore.plan_type_id) {
        return plans.find(plan => {
          return plan.id === this.selectedStore.plan_type_id
        })
      } else {
        return {}
      }
    },

    outlets() {
      const outlets = [
        {
          name: this.$store.state.userStores.lang.all,
          store_id: 0,
          url_id: 'all'
        }
      ]
      const vuexStores = this.$store.getters.stores
      const addedStoreIds = []
      vuexStores.map(item => {
        if (!addedStoreIds.includes(item.store_id)) {
          if (item.is_store_active) {
            outlets.push({ ...item })
            addedStoreIds.push(item.store_id)
          }
        }
      })

      outlets.map(i => {
        i.checked = false
        this.storeToBeSaved.map(j => {
          if (i.store_id === j.store_id) {
            i.checked = true
          }
        })
      })

      return outlets
    },

    glanceName () {
      let namestore = []
      if (this.storeToBeSaved.length && this.storeToBeSaved.length !== 0) {
        this.storeToBeSaved.map(i => {
          namestore.push(i.name)
        })
      }

      if (namestore.length && namestore[0] === 'Semua') {
        return namestore = 'Semua Toko'
      } else {
        return namestore.join(', ')
      }
    }
  },

  mounted() {
    this.getStoreProfile()
    this.getCompareSales('H')
    if (this.dataProfile.otp && !this.dataProfile.otp.status) {
      this.verifyNumber = true
    }
    if (this.dataProfile.verified || this.$route.query.verify) {
      this.showEmailVerify = true
      this.verifyNumber = false
    }
  },

  methods: {
    getStoreProfile() {
      this.$store.dispatch('setSelectedStore', this.selectedStore.store_id).then(response => {
        this.getDashboardData()
        // this.loading = false
      }).catch(error => {
        this.loading = false
        this.$message({
          type: 'error',
          message: error.string
        })
      })
    },

    getDashboardData () {
      this.getDate()
      this.getDashboardH()
      this.getDashboardC()
      this.getDashboardF()
      this.cekTermCondition()
      this.getService()
      this.getStoreData()
    },

    getDate() {
      this.params.to = moment().format('YYYY-MM-DD')
      this.params.from = moment().subtract(6, 'd').format('YYYY-MM-DD')
      this.labelDate = this.$lang[this.langId].a_week_ago + '\n' +
                        moment(this.params.from).format('DD MMM YYYY') + ' - ' +
                        moment(this.params.to).format('DD MMM YYYY')
    },
    getDashboardH() {
      this.loadingDashboardH = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = Object.assign({}, this.params)
      this.$set(params, 'type', 'H')

      if (this.stageLevel === 'sit' || this.stageLevel === 'dev') {
        params.to_store_id = this.selectedStore.store_id
        params.to_allstore_id = 0
        if (this.storeToBeSaved.length && this.storeToBeSaved[0].store_id === 0) {
        params.to_allstore_id = 1
        } else if (this.storeToBeSaved.length) {
          let storeid = []
          this.storeToBeSaved.map(i => {
            storeid.push(i.store_id)
          })
          params.to_store_id = storeid.join(',')
        }
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint),
        headers: headers,
        params: params
      }).then(response => {
        this.dashboardH = response.data.data
        this.generaliseData('dashboardH', this.dashboardH)
        this.loadingDashboardH = false
      }).catch(error => {
        this.loadingDashboardH = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    getDashboardC() {
      this.loadingDashboardC = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = Object.assign({}, this.params)
      this.$set(params, 'type', 'C')

      if (this.stageLevel === 'sit' || this.stageLevel === 'dev') {
        params.to_store_id = this.selectedStore.store_id
        params.to_allstore_id = 0
        if (this.storeToBeSaved.length && this.storeToBeSaved[0].store_id === 0) {
        params.to_allstore_id = 1
        } else if (this.storeToBeSaved.length) {
          let storeid = []
          this.storeToBeSaved.map(i => {
            storeid.push(i.store_id)
          })
          params.to_store_id = storeid.join(',')
        }
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint),
        headers: headers,
        params: params
      }).then(response => {
        this.dashboardC = response.data.data
        this.generaliseData('dashboardC', this.dashboardC)
        this.loadingDashboardC = false
      }).catch(error => {
        this.loadingDashboardC = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    getDashboardF() {
      this.loadingDashboardF = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = Object.assign({}, this.params)
      this.$set(params, 'type', 'F')

      if (this.stageLevel === 'sit' || this.stageLevel === 'dev') {
        params.to_store_id = this.selectedStore.store_id
        params.to_allstore_id = 0
        if (this.storeToBeSaved.length && this.storeToBeSaved[0].store_id === 0) {
        params.to_allstore_id = 1
        } else if (this.storeToBeSaved.length) {
          let storeid = []
          this.storeToBeSaved.map(i => {
            storeid.push(i.store_id)
          })
          params.to_store_id = storeid.join(',')
        }
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint),
        headers: headers,
        params: params
      }).then(response => {
        this.dashboardF = response.data.data
        this.generaliseData('dashboardF', this.dashboardF)
        this.loadingDashboardF = false
      }).catch(error => {
        this.loadingDashboardF = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    generaliseData(block, responseData) {
      if (block === 'dashboardC') {
        let genData = Object.assign({}, responseData)
        if (genData && genData.sales_item_groupings.length === 0) {
          this.showGroup = false
        } else {
          if (genData.sales_item_groupings.data.length > 0) {
            genData.sales_item_groupings.data.map((item, index) => {
              item.value = parseInt(item.value)
              return item
            })
          }
          this.showGroup = true
        }
        if (genData.sales_items_pergroup.length > 0) {
          genData.sales_items_pergroup.map((item, index) => {
            item.colors = genData.sales_item_groupings.colors[index]
            item.data.map((list, index) => {
              list.total_qty = parseInt(list.total_qty)
              return item
            })
            return item
          })
        }
        // if (genData.revenues_dayweek.length > 0) {
        //   this.chartRevenueDate.rows = [...genData.revenues_dayweek]
        // }
        if (genData.revenues_hourly.length > 0) {
          this.chartRevenueHour.rows = [...genData.revenues_hourly]
        }
        if (genData.expenses_hourly.length > 0) {
          this.chartRevenueHourExpense.rows = [...genData.expenses_hourly]
        }
        if (genData.returns.length > 0) {
          genData.returns.map((item, index) => {
            item.date = moment(item.date).format('DD MMM')
            return item
          })
          this.chartReturn.rows = [...genData.returns]
        }
        if (genData.revenue_groupings.length === 0) {
          this.showCircle = false
        } else {
          this.showCircle = true
          // genData.revenue_groupings.data.map((item, index) => {
          //   item.value = Math.round(item.value * 100) / 100
          //   return item
          // })
          if (genData.revenue_groupings.data.length < 2) {
            this.showCircleMore = true
          } else if (genData.revenue_groupings.data.length > 1) {
            this.showCircleMore2 = true
          }
        }
        this.dashboardC = genData
      } else if (block === 'dashboardF') {
        let genData = Object.assign({}, responseData)
        if (genData.recent_orders.data.length === 0) {
          this.showOrder = false
        } else {
          this.showOrder = true
        }
        if (genData.recent_payments.data.length === 0) {
          this.showPayment = false
        } else {
          this.showPayment = true
        }
      } else if (block === 'dashboardH') {
        let genData = Object.assign({}, responseData)
        this.chartRevenueDate.rows = [...genData.revenues]
        this.chartRevenueDateExpense.rows = [...genData.expenses]
      }
    },

    setLabelFilter(filter) {
      if (filter.labelForDate === 'today') {
        this.labelDate = this.$lang[this.langId].today + '\n' +
                        moment(this.params.from).format('DD MMM YYYY') + ' - ' +
                        moment(this.params.to).format('DD MMM YYYY')
      } else if (filter.labelForDate === 'yesterday') {
        this.labelDate = this.$lang[this.langId].yesterday + '\n' +
                        moment(this.params.from).format('DD MMM YYYY') + ' - ' +
                        moment(this.params.to).format('DD MMM YYYY')
      } else if (filter.labelForDate === 'weekago') {
        this.labelDate = this.$lang[this.langId].a_week_ago + '\n' +
                        moment(this.params.from).format('DD MMM YYYY') + ' - ' +
                        moment(this.params.to).format('DD MMM YYYY')
      } else if (filter.labelForDate === 'monthago') {
        this.labelDate = this.$lang[this.langId].a_month_ago + '\n' +
                        moment(this.params.from).format('DD MMM YYYY') + ' - ' +
                        moment(this.params.to).format('DD MMM YYYY')
      } else if (filter.labelForDate === 'thismonth') {
        this.labelDate = this.$lang[this.langId].this_month + '\n' +
                        moment(this.params.from).format('DD MMM YYYY') + ' - ' +
                        moment(this.params.to).format('DD MMM YYYY')
      } else if (filter.labelForDate === 'lastmonth') {
        this.labelDate = this.$lang[this.langId].last_month + '\n' +
                        moment(this.params.from).format('DD MMM YYYY') + ' - ' +
                        moment(this.params.to).format('DD MMM YYYY')
      } else if (filter.labelForDate === 'custom') {
        this.labelDate = this.$lang[this.langId].custom + '\n' +
                        moment(this.params.from).format('DD MMM YYYY') + ' - ' +
                        moment(this.params.to).format('DD MMM YYYY')
      }
    },

    loadDashboardData() {
      this.getDashboardH()
      this.getDashboardC()
      this.getDashboardF()
    },

    toggleFilter() {
      if (this.showFilter) {
        this.showFilter = false
      } else {
        this.showFilter = true
      }
    },

    dateFilterClose() {
      this.showFilter = false
    },

    dateFilterReset(data) {
      this.filterTag = '',
      this.$delete(this.params, 'from')
      this.$delete(this.params, 'to')
      this.dateFilterClose()
      this.showCircleMore = false
      this.showCircleMore2 = false
      this.loadDashboardData()
    },

    dateFilterSave(filter) {
      this.filterTag = filter.labelForDate
      this.$set(this.params, 'from', filter.startDate)
      this.$set(this.params, 'to', filter.endDate)
      this.dateFilterClose()
      this.setLabelFilter(filter)
      this.showCircleMore = false
      this.showCircleMore2 = false
      this.loadDashboardData()
    },

    closeFilterTag() {
      this.dateFilterReset()
    },

    handleShowWeb() {
      window.open('https://' + this.selectedStore.url_id + '.myolsera.com', '_blank')
      // this.getLocalization('id')
    },

    showOtp() {
      // this.visibleDialogPhoneVerification = true
      this.visibleDialogCitCall = true
    },

    showResendEmail() {
      this.showDialogEmail = true
    },

    resendCodeEmail() {
      this.loadingSendCode = true
      var data = {
        email: this.dataProfile.email
      }
      HTTP.post('api/admin/v1/id/resend/activate', data)
        .then(response => {
          this.$message({
            type: 'success',
            message: response.data.message
          })
          this.loadingSendCode = false
          this.showDialogEmail = false
          this.showEmailVerify = false
        })
        .catch(error => {
          this.$message({
            type: 'warning',
            message: error.string
          })
          this.loadingSendCode = false
        })
    },

    hideverify() {
      this.phoneTrue = false
      this.showDialog = false
    },

    resendCodeVerify (data) {
      if (data === 1) {
        this.resendCodeEmail()
      } else {
        this.showEmailVerify = false
        this.showOtp()
      }
    },

    cekTermCondition() {
      cekTermCondition().then(response => {
        this.dataTerm = response.data.data
        //hardcode
        // this.dataTerm.show_info_dashboard = 1
        //
        if (this.dataTerm.show_info_dashboard === 1 && this.dataTerm.date_accept_rules !== null) {
          // this.showWarningInfo = true
          // this.showWarning = true
          this.showWarningInfoRule = true
          this.showWarningRule = true
          this.getService()
        }
        //hardcode
        // this.dataTerm.show_rules = 1
        //
        if (this.dataTerm.show_rules === 0) {
          this.getSetting()
        }
      }).catch(error => {
        console.log(error)
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loading = false
      })
    },

    getService() {
      getService().then(response => {
        this.dataServices = response.data.data
      }).catch(error => {
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
        this.loading = false
      })
    },

    getSetting() {
      getSetting().then(response => {
        this.dataSetting = response.data.data
        if (this.dataSetting.show_info_whatsapp === 1 && this.selectedStore.active_online_order === 1 && !this.dataSetting.whatsapp) {
          this.showWarningWa = true
          this.showEmailVerify = false
        }
      }).catch(error => {
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
        this.loading = false
      })
    },

    async getStoreData() {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'generalsetting/'),
        headers: headers
      }).then(response => {
          if (
            (
              response.data.data.location_lat === '0.0000' &&
              response.data.data.location_lon === '0.0000'
            ) ||
            !response.data.data.address
          ) {
            this.setupLocation = true
          }
          this.dataStore = response.data.data
        })
        .catch(error => {
          this.loading = false
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        })
    },

    saveLocation (data) {
      this.dataStore = { ...data }
      this.setupLocation = false
      this.showWarningLocation = false
      this.$message({
        type: 'success',
        message: '✓ Lokasi Toko berhasil diubah'
      })
    },

    getPhone (value) {
      this.whatsappnumber = value.formattedNumber
    },

    handleCloseInputWa () {
      this.whatsappnumber = null
      this.showInputWa = false
    },

    saveWa(skipWa) {
      this.loadingAuto = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      var data = {}
      if (!skipWa) {
        data = {
          whatsapp: this.whatsappnumber
        }
      } else {
        data = {
          show_info_whatsapp: 0
        }
      }
      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'online/settings'),
        headers: headers,
        data
      }).then(response => {
        if (!skipWa) {
          this.$message({
            type: 'success',
            message: 'Nomor Whatsapp berhasil ditambah'
          })
        }
        this.showInputWa = false
        this.showWarningWa = false
        this.loadingAuto = false
      }).catch(error => {
        this.loadingAuto = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    changeSms (method) {
      this.visibleDialogCitCall = !method
      this.inputOtp = false
      this.hasMiscall = false
      this.visibleDialogPhoneVerification = method
      this.countDialog ++
    },

    closeCitcall () {
      this.visibleDialogCitCall = false
      this.hasMiscall = false
      this.tempProfile = { ...this.dataProfile}
    },

    handlePhoneVerified() {
      this.visibleDialogPhoneVerification = false
      this.visibleDialogCitCall = false
      this.$store.dispatch('fetchUserLoggedin')
    },

    updateTrial () {
      this.loadingTrial = true
      upgradeStoreTrial().then(response => {
        // this.dataTerm = response.data.data
        //hardcode
        // this.dataTerm.show_info_dashboard = 1
        //
        // console.log('trace', response.data.data)
        this.loadingTrial = false
        this.showUpdateTrial = false
        this.refreshStore(response.data.data.store_id)
      }).catch(error => {
        // console.log(error)
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loadingTrial = false
      })
    },

    refreshStore (storeId) {
      this.$store.dispatch('setSelectedStore', storeId).then(response => {
        this.loading = false
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.message
        })
        this.loading = false
      })
    },

    getCompareSales(type) {
      let start = moment().format('YYYY-MM-DD')
      let end = moment().format('YYYY-MM-DD')
      if (type === 'D') {
        start = moment().subtract(6, 'd').format('YYYY-MM-DD')
      } else if (type === 'M') {
        start = moment().startOf('month').format('YYYY-MM-DD')
        end = moment().endOf('month').format('YYYY-MM-DD')
      }
      this.paramsCompare = {
        start_date: start,
        end_date: end,
        filter_type: type === 'M' ? 'D' : type
      }

      if (this.stageLevel === 'sit' || this.stageLevel === 'dev') {
        this.paramsCompare.to_store_id = this.selectedStore.store_id
        this.paramsCompare.to_allstore_id = 0
        if (this.storeToBeSaved.length && this.storeToBeSaved[0].store_id === 0) {
        this.paramsCompare.to_allstore_id = 1
        } else if (this.storeToBeSaved.length) {
          let storeid = []
          this.storeToBeSaved.map(i => {
            storeid.push(i.store_id)
          })
          this.paramsCompare.to_store_id = storeid.join(',')
        }
      }

      this.loadingCompare = true
      getDataCompareSales(this.paramsCompare).then(response => {
        this.dataCompareSales = response.data.data
        // this.generaliseData('dashboardH', this.dashboardH)
        let columns = ['date', 'total', 'comparison']
        let rows = []
        if (type === 'H') {
          response.data.data.sales.detail.map((i, idx) => {
            response.data.data.sales_previous.detail.map((j, jidx) => {
              if (i.hour === j.hour) {
                rows.push({
                  date: i.hour,
                  total: parseInt(i.gross_profit),
                  comparison: parseInt(j.gross_profit)
                })
              }
            })
          })
        } else {
          response.data.data.sales.detail.map((i, idx) => {
            response.data.data.sales_previous.detail.map((j, jidx) => {
              if (idx === jidx) {
                rows.push({
                  date: type === 'M' ? moment(i.order_date).format('DD MMM') : moment(i.order_date).format('DD MMM YYYY') + ' \n \n' + moment(j.order_date).format('DD MMM YYYY'),
                  total: parseInt(i.gross_profit),
                  comparison: parseInt(j.gross_profit)
                })
              }
            })
          })
        }

        console.log('ccc', rows)
        this.dataCompare = {
          columns,
          rows
        }
        this.loadingCompare = false
      }).catch(error => {
        this.loadingCompare = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    salesSourceColor(color){
      return {
        backgroundColor: color
      }
    },

    salesSourceBar(width, color){
      return {
        height: '5px',
        width: `${width}%`,
        backgroundColor: color
      }
    },

    statusOrderColorGenerator(status) {
      if (status === 'Z'){
        return 'status-order--z'
      }
      if (status === 'X'){
        return 'status-order--x'
      }
      if (status === 'P'){
        return 'status-order--p'
      }
      if (status === 'A' || status === 'T'){
        return 'status-order--at'
      }
    },

    handleShowList () {
      this.visibleStoreList = !this.visibleStoreList
    },

    handleSelectStore (item) {
      if (item.store_id === 0) {
        const exist = this.storeToBeSaved.filter(i => {
          return item.store_id === i.store_id
        })
        if (!exist.length) {
          this.storeToBeSaved = [item]
          this.getSelectedStore({}, true)
        } else {
          this.storeToBeSaved = [this.selectedStore]
          this.getSelectedStore(this.selectedStore, true)
        }
      } else {
        this.storeToBeSaved.map((i, idx) => {
          if (i.store_id === 0) { this.storeToBeSaved.splice(idx, 1)}
        })

        if (this.storeToBeSaved && this.storeToBeSaved.length) {
          const exist = this.storeToBeSaved.filter(i => {
            return item.store_id === i.store_id
          })
          if (!exist.length) {
            this.storeToBeSaved.push(item)
            this.getSelectedStore(item, true)
          } else {
            this.storeToBeSaved.map((i, idx) => {
              if (i.store_id === item.store_id) {
                this.storeToBeSaved.splice(idx, 1)
              }
            })
            this.getSelectedStore(item, false)
          }
        } else {
          this.storeToBeSaved.push(item)
          this.getSelectedStore(item, true)
        }
      }

      this.refresDataDashboard()
    },

    getSelectedStore (data, args) {
      if (this.storeToBeSaved.length === 0) {
        this.storeToBeSaved = [this.selectedStore]
        this.outlets.map(i => {
          if (i.store_id === this.selectedStore.store_id) {
            i.checked = true
          }
        })
      } else {
        this.outlets.map(i => {
          if (data && !data.store_id) {
            i.checked = args
          } else if (data && data.store_id) {
            if (i.store_id === data.store_id) {
              i.checked = args
            }
          }
        })
      }
    },
    
    refresDataDashboard () {
      this.getDashboardH()
      this.getDashboardC()
      this.getDashboardF()
    }
  }
}
</script>

<style lang="scss" scoped>
.sales-source {
 &--summary-bar {
   height: 5px;
   width: 100%;
   background-color: #EBEEF5;
   margin: 0 0 16px 0;
   position: relative;

   .summary-item-wrapper {
     width: 100%;
     height: 100%;
     position: absolute;
     top: 0;
     left: 0;
     display: flex;
   }
 }

 &--content-wrapper {
   display: flex;
   flex-wrap: wrap;
   gap: 16px;

   .item-wrapper {
     padding: 16px;
     min-width: 256px;
     display: flex;
     .circle {
       width: 16px;
       height: 16px;
       border-radius: 50%;
       margin: 0 6px 0 0;
     }

     .info {
       &--label {
         font-size: 14px;
       }
       &--value {
         font-size: 16px;
         font-weight: bold;
       }
     }
   }
 }
}

.status-order {
  padding: 3px 6px;
  border-radius: 8px;

  &--z {
    border: 1px solid #A1F176;
    color: #A1F176;
  }

  &--x{
    border: 1px solid #F44336;
    color: #F44336
  }

  &--b {
    border: 1px solid #E1E2E1;
    color: #E1E2E1
  }

  &--at {
    border: 1px solid #40C4FF;
    color: #40C4FF
  }
}

.custom-divider-circle {
  width: 5px;
  aspect-ratio: 1/1;
  background-color: #767676;
  border-radius: 50%;
  margin: 0 5px;
}
</style>