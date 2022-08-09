<template>
  <div v-loading="loading" class="sales-detail">
    <section class="order-detail">
      <el-card class="box-card box-card--p-null">
        <div class="px-16 flex-container" :class="openOrderData.is_paid === 1? 'color-green--bg color-white' : 'color-info--bg'">
          <div class="full-width flex-container">
            <div class="container-icon"><svg-icon :icon-class="openOrderData.is_paid === 1? 'check-circle' : 'x-circle'" /></div>
            <span>{{ openOrderData.is_paid === 1? rootLang.already_paid : rootLang.not_yet_paid }}</span>
          </div>
          <div class="flex-container full-width flex-container--content-end">
            <span class="mr-8">{{ openOrderData.is_paid === 1? openOrderData.fpayment_date : '' }}</span>
            <el-switch
              v-if="checkCustomPermission(customRPermis, 'edit')"
              v-model="switchValue"
              :disabled="computedAccess"
              :active-value="1"
              :inactive-value="0"
              @change="handleSwitchPayment"
            />
          </div>
        </div>
        <div class="card-body with-back-button with-back-button--white-bg">
          <el-button
            icon="el-icon-back"
            class="back-button"
            @click="backHandle"/>

          <div class="flex-container">
            <div style="font-size: 40px" class="mr-8"><svg-icon icon-class="ico-olsera-segilima" /></div>
            <div style="flex-grow: 1;">
              <h4 v-if="!openOrderData.order_no">-</h4>
              <h4 v-else class="font-bold">{{ openOrderData.order_no }}</h4>
              <p>{{ lang.sales_by }} {{ openOrderData.sales_by_name }}</p>
            </div>

            <div v-if="!showEdit">
              <div class="flex-container flex-container--wrap">
                <el-date-picker
                  v-model="openOrderData.order_date"
                  :placeholder="$lang[langId].pick_a_day"
                  :clearable="false"
                  type="date"
                  format="dd-MM-yyyy"
                  value-format="yyyy-MM-dd"
                  disabled
                  class="date-complete mb-4 mr-4"
                  style="max-width: 160px;"
                />

                <el-button
                  v-if="checkCustomPermission(customRPermis, 'edit') && visibleEdit"
                  class="edit-header mb-4"
                  type="primary"
                  icon="el-icon-edit"
                  @click="editHeaderButton">
                  {{ lang.edit }}
                </el-button>
              </div>
            </div>

            <div v-else>
              <div class="flex-container flex-container--wrap">
                <!-- <div class="mb-4 mr-4">
                  <el-button
                    icon="el-icon-message"
                    @click="emailDialog = true">
                    {{ lang.email }}
                  </el-button>

                  <el-button
                    icon="el-icon-mobile-phone"
                    style="margin-left: 0;"
                    @click="smsDialog = true">
                    {{ $lang[langId].sms }}
                  </el-button>

                  <el-button
                    style="margin-left: 0;"
                    @click="waDialog = true">
                    <div class="container-icon">
                      <svg-icon icon-class="ico-whatsapp" />
                    </div>
                    {{ $lang[langId].whatsapp }}
                  </el-button>
                </div> -->

                <div class="mb-4 mr-4">
                  <el-dropdown class="drop-complete" @command="handleNotif">
                    <el-button class="el-dropdown-link" icon="el-icon-printer">
                      {{ rootLang.notifications }} <i class="el-icon-arrow-down"></i>
                    </el-button>
                    <el-dropdown-menu
                      v-if="checkCustomPermission(customRPermis, 'edit')"
                      slot="dropdown">
                      <el-dropdown-item
                        v-for="(command, index) in notifSelect"
                        :key="index"
                        :command="command.value">
                        <i v-if="command.value !== 'wa'" :class="command.icon" />
                        <svg-icon v-else icon-class="ico-whatsapp" />
                        {{command.label}}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>

                <div class="mb-4 mr-4">
                  <el-dropdown class="drop-complete" @command="handleDownload">
                    <el-button class="el-dropdown-link" icon="el-icon-printer">
                      {{ lang.print }} <i class="el-icon-arrow-down"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        v-for="(command, index) in downloadSelect"
                        :key="index"
                        :command="command.id">
                        {{command.label}}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>

                <div class="mb-4 mr-4">
                  <el-select
                    v-if="checkCustomPermission(customRPermis, 'edit')"
                    v-model="statusOrder"
                    :disabled="blockChangeStatus"
                    :placeholder="lang.status"
                    class="dropdown-select-status"
                    popper-class="el-select-statusorder"
                    @change="handleChangeStatus(statusOrder)">
                    <el-option
                      v-for="item in statusSelect"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      :disabled="item.disabled"
                    >
                    <div class="flex-container">
                      <div class="radius-50 mr-8" :style="'background:' + item.color + '; height: 12px; width: 12px'"></div>
                      {{ item.label }}
                    </div>
                    </el-option>
                  </el-select>
                </div>

                <!-- <el-date-picker
                  v-model="openOrderData.order_date"
                  :placeholder="$lang[langId].pick_a_day"
                  :clearable="false"
                  :disabled="computedAccess"
                  type="date"
                  format="dd-MM-yyyy"
                  value-format="yyyy-MM-dd"
                  style="width: 140px;"
                  class="mb-4"
                  @change="changeDateHeader"
                /> -->
              </div>
            </div>

            <div v-if="!visibleEdit">
              <el-dropdown v-if="checkCustomPermission(customRPermis, 'edit')" class="drop-complete" @command="handleDownloadEdit">
                <el-button class="el-dropdown-link" icon="el-icon-printer">
                  {{ lang.print }} <i class="el-icon-arrow-down"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(command, index) in downloadSelectEdit"
                    :key="index"
                    :command="index">
                    {{command.label}}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </div>
        <div v-if="openOrderData.shipping_courier_id === 'GSN' && openOrderData.status === 'A'" class="px-16 py-12 flex-container color-primary--soft--bg">
          <div v-if="openOrderData.shipping_log.gosend.detail !== null" class="full-width flex-container">
            <img height="40px" width="40px" src="/static/img/service-activation/grab/icon_pending_activation.png" >
            <div>
              <div class="font-bold font-14">{{ openOrderData.shipping_courier_name }}</div>
              <div class="font-12">{{ openOrderData.shipping_log.gosend.detail.booking_type }}</div>
              <div class="font-12">{{ openOrderData.shipping_log.gosend.detail.order_no }}</div>
            </div>
          </div>
          <div class="flex-container full-width flex-container--content-end">
            <el-button v-if="activeFindDriver" class="color-grabfood--bg" type="primary" :loading="loadingFindDriver" @click="handleFindDriver">{{ rootLang.find_driver }}</el-button>
            <template v-if="!activeFindDriver && openOrderData.status === 'A' && openOrderData.is_paid === 1">
              <div v-if="openOrderData.shipping_log.gosend.detail !== null && openOrderData.shipping_log.gosend.detail.delivery_eta !== null" class="mr-12 flex-container">
                <svg-icon icon-class="clock" class="font-20"/>
                <div class="px-8">
                  <div class="font-12">Estimasi pesanan sampai</div>
                  <div class="font-16 font-bold">{{ openOrderData.shipping_log.gosend.detail.fdelivery_eta_start }} - {{ openOrderData.shipping_log.gosend.detail.fdelivery_eta_end }}</div>
                </div>
              </div>
              <div v-if="!stillFinDriver && openOrderData.shipping_log.gosend.detail !== null" class="color-grabfood--bg flex-container p-8 radius-5">
                <el-avatar
                  :alt="openOrderData.shipping_log.gosend.detail.driver_photo_url"
                  :src="openOrderData.shipping_log.gosend.detail.driver_photo_url !== null? openOrderData.shipping_log.gosend.detail.driver_photo_url : '/static/img/online-order/courier/gojek.png'"
                  :size="32"
                  style="background: #EEEEEE"
                />
                <div class="ml-8">{{ openOrderData.shipping_log.gosend.detail.driver_name !== null ? openOrderData.shipping_log.gosend.detail.driver_name : 'Gojek Driver' }}</div>
                <!-- <div class="ml-8">No Driver</div> -->
                <div class="mb-4">
                  <el-dropdown
                      trigger="click"
                      @command="handleDropdownSection">
                      <span class="el-dropdown-link font-20 color-white">
                        <svg-icon icon-class="more-vertical"></svg-icon>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="tracking">
                          Live tracking
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  <!-- <el-button @click="downloadList" :loading="loadingDownloadList">Download excel</el-button> -->
                </div>
              </div>
              <template v-else>
                <el-button class="color-grabfood--bg" type="primary" :loading="true">{{ rootLang.find_driver }}</el-button>
              </template>
            </template>
          </div>
        </div>
        <div v-if="openOrderData.shipping_courier_id === 'GSN' && openOrderData.status === 'P'" class="px-16 py-12 flex-container flex-container--content-end color-primary--soft--bg">
          <div class="float-right">
            <el-button class="color-blue-active--bg color-white" @click="handleChangeStatus('btn')">{{ rootLang.confirm }}</el-button>
          </div>
        </div>
      </el-card>

      <!-- <el-button @click="nextStep">Next</el-button> -->

      <div v-for="(item, idx) in stepLogs" :key="idx" class="p-16 mb-24" style="height: 100px">

        <step-progress :steps="item" :current-step="currentStep" />
        
      </div>

      <div class="flex-container" style="align-items: unset; margin-top: 72px !important">
        <div class="full-width mr-8">
          <el-card class="box-card" style="height: 100%">
            <div slot="header" class="flex-container flex-container--wrap">
              <h3 class="box-title">{{ lang.customer }}</h3>
              <div v-if="showEdit" class="pull-right">
                <el-button size="mini" type="text" v-if="isEditing.customer" @click="cancelEdit('customer')">{{ lang.cancel }}</el-button>
                <el-button size="mini" type="success" v-if="isEditing.customer" @click="saveEdit('customer')">{{ lang.save }}</el-button>
                <template v-if="openOrderData.order_source === 'K' && stageLevel === 'dev'">
                  <button-action-authenticated :permission="[customRPermis, 'edit']" size="mini" type="text" v-if="!isEditing.customer" :disabled="computedAccess" @click="handleEditNew('customer')">
                    <svg-icon icon-class="edit-2" class="font-20"/>
                  </button-action-authenticated>
                </template>
                <template v-else>
                  <button-action-authenticated :permission="[customRPermis, 'edit']" size="mini" type="text" v-if="!isEditing.customer" :disabled="computedAccess" @click="handleEdit('customer')">
                    <svg-icon icon-class="edit-2" class="font-20"/>
                  </button-action-authenticated>
                </template>
              </div>
            </div>
            <div class="card-body">
              <div class="like-table-wrapper--item-border-bottom">
                <div style="width: 40%">{{ lang.name }}</div>
                <div class="full-width flex-container flex-container--content-end" v-if="!isEditing.customer">
                  <h5 v-if="!openOrderData.customer_name">-</h5>
                  <h5 v-else>{{ openOrderData.customer_name }}</h5>
                </div>
                <div v-else>
                  <el-autocomplete @select="handleSelectCustomer" v-model="formCustomer.customerName" :fetch-suggestions="getCustomerSuggest"
                    :debounce="autoCompleteStartOn" :placeholder="lang.search+' '+lang.customer" clearable>
                  </el-autocomplete>
                </div>
              </div>
              <div class="like-table-wrapper--item-border-bottom">
                <div style="width: 40%">{{ lang.email }}</div>
                <div class="full-width flex-container flex-container--content-end" v-if="!isEditing.customer">
                  <h5 v-if="!openOrderData.customer_email">-</h5>
                  <h5 v-else>{{ openOrderData.customer_email }}</h5>
                </div>
                <div v-else>
                  <el-input v-model="formCustomer.customerEmail" disabled></el-input>
                </div>
              </div>
              <div class="like-table-wrapper--item-border-bottom">
                <div style="width: 40%">{{ lang.phone }}</div>
                <div class="full-width flex-container flex-container--content-end" v-if="!isEditing.customer">
                  <h5 v-if="!openOrderData.customer_phone">-</h5>
                  <h5 v-else>{{ openOrderData.customer_phone }}</h5>
                </div>
                <div v-else>
                  <el-input v-model="formCustomer.customerPhone" disabled></el-input>
                </div>
              </div>
            </div>
          </el-card>
        </div>
        <div class="full-width ml-8">
          <el-card class="box-card" style="height: 100%" v-loading="loadingElement">
            <div slot="header" class="flex-container flex-container--wrap">
              <h3 class="box-title">{{ lang.shipping_to }}</h3>
              <div v-if="showEdit" class="pull-right">
                <el-button size="mini" type="text" v-if="isEditing.shippingto" @click="cancelEdit('shippingto')">{{ lang.cancel }}</el-button>
                <el-button size="mini" type="success" v-if="isEditing.shippingto" @click="saveEdit('shippingto')">{{ lang.save }}</el-button>
                <button-action-authenticated :permission="[customRPermis, 'edit']" size="mini" type="text" v-if="!isEditing.shippingto" :disabled="computedAccess" @click="handleEdit('shippingto')">
                  <svg-icon icon-class="edit-2" class="font-20"/>
                </button-action-authenticated>
              </div>
            </div>
            <div class="card-body">
              <div class="like-table-wrapper--item-border-bottom">
                <div style="width: 40%">{{ lang.name }}</div>
                <div class="full-width flex-container flex-container--content-end" v-if="!isEditing.shippingto">
                  <h5 v-if="!openOrderData.shipping_to">-</h5>
                  <h5 v-else>{{ openOrderData.shipping_to }}</h5>
                </div>
                <div class="full-width flex-container flex-container--content-end" v-else>
                  <el-input v-model="openOrderData.shipping_to" class="inline-form"></el-input>
                </div>
              </div>
              <div class="like-table-wrapper--item-border-bottom" style="align-items: flex-start">
                <div style="width: 40%">{{ lang.address }}</div>
                <div class="full-width flex-container flex-container--content-end" v-if="!isEditing.shippingto">
                  <h5 v-if="!openOrderData.shipping_address">-</h5>
                  <div v-else class="text-right" style="margin-top: -8px">
                    <h5>{{ openOrderData.shipping_address }}</h5>
                    <div>
                      {{ openOrderData.shipping_city_district }} {{ openOrderData.shipping_city_name }}
                    </div>
                    <div>
                      {{ openOrderData.shipping_state_name }} {{ openOrderData.shipping_postal_code }}
                    </div>
                    <div>
                      {{ openOrderData.shipping_country_name }}
                    </div>
                  </div>
                </div>
                <div class="full-width flex-container flex-container--content-end" v-else>
                  <el-input v-model="openOrderData.shipping_address" type="textarea" class="inline-form" :placeholder="$lang[langId].please_input+lang.address"></el-input>
                </div>
              </div>
              <div v-if="isEditing.shippingto" class="like-table-wrapper--item-border-bottom" style="align-items: flex-start">
                <div style="width: 40%">{{ lang.country }}</div>
                <div class="full-width flex-container flex-container--content-end" >
                  <el-select
                    v-model="openOrderData.shipping_country_name"
                    :placeholder="lang.please_select"
                    value-key="id"
                    filterable
                    size="small"
                    class="inline-form"
                    @change="editChangeCountry">
                    <el-option v-for="item in openOrderData.country" :key="item.id" :label="item.name" :value="item"></el-option>
                  </el-select>
                </div>
              </div>
              <template v-if="openOrderData.shipping_country_id === 'ID'">
                <div v-if="isEditing.shippingto" class="like-table-wrapper--item-border-bottom" style="align-items: flex-start">
                  <div style="width: 40%">{{ lang.province }}</div>
                  <div class="full-width flex-container flex-container--content-end" >
                    <el-select
                      v-model="openOrderData.shipping_state_name"
                      :placeholder="lang.please_select"
                      value-key="id"
                      filterable
                      class="inline-form"
                      size="small"
                      @change="editProvince">
                      <el-option v-for="item in stateCountry" :key="item.id" :label="item.name" :value="item"></el-option>
                    </el-select>
                  </div>
                </div>
                <div v-if="isEditing.shippingto" class="like-table-wrapper--item-border-bottom" style="align-items: flex-start">
                  <div style="width: 40%">{{ lang.city }}</div>
                  <div class="full-width flex-container flex-container--content-end" >
                    <el-select
                      v-model="openOrderData.shipping_city_name"
                      :placeholder="lang.please_select"
                      value-key="id"
                      filterable
                      size="small"
                      class="inline-form"
                      @change="editCity">
                      <el-option v-for="item in shippingCity" :key="item.id" :label="item.city" :value="item"></el-option>
                    </el-select>
                  </div>
                </div>
                <div v-if="isEditing.shippingto" class="like-table-wrapper--item-border-bottom" style="align-items: flex-start">
                  <div style="width: 40%">{{ lang.district }}</div>
                  <div class="full-width flex-container flex-container--content-end" >
                    <el-select
                      v-model="openOrderData.shipping_subdistrict_name"
                      :placeholder="lang.please_select"
                      value-key="id"
                      filterable
                      class="inline-form"
                      size="small"
                      @change="editSubDistrict">
                      <el-option v-for="item in subDistrict" :key="item.id" :label="item.name" :value="item"></el-option>
                    </el-select>
                  </div>
                </div>
                <div v-if="isEditing.shippingto" class="like-table-wrapper--item-border-bottom" style="align-items: flex-start">
                  <div style="width: 40%">{{ lang.postal_code }}</div>
                  <div class="full-width flex-container flex-container--content-end" >
                    <el-input v-model="openOrderData.shipping_postal_code" size="small" class="inline-form" type="number" :placeholder="$lang[langId].input_number"></el-input>
                  </div>
                </div>
              </template>
              <div class="like-table-wrapper--item-border-bottom">
                <div style="width: 40%">{{ lang.phone }}</div>
                <div class="full-width flex-container flex-container--content-end" v-if="!isEditing.shippingto">
                  <h5 v-if="!openOrderData.shipping_phone">-</h5>
                  <h5 v-else>{{ openOrderData.shipping_phone }}</h5>
                </div>
                <div class="full-width flex-container flex-container--content-end" v-else>
                  <el-input v-model="openOrderData.shipping_phone" class="inline-form" :placeholder="$lang[langId].input_number"></el-input>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </div>

      <div class="flex-container mt-24" style="align-items: unset">
        <div class="full-width mr-8">
          <el-card class="box-card" style="height: 100%">
            <div slot="header" class="flex-container flex-container--wrap">
              <h3 class="box-title">{{ lang.shipping_status }}</h3>
              <div v-if="showEdit" class="pull-right">
                <el-button size="mini" type="text" v-if="isEditing.status" @click="cancelEdit('status')">{{ lang.cancel }}</el-button>
                <el-button size="mini" type="success" v-if="isEditing.status" :disabled="loading" @click="saveEdit('status')">
                  <loading-component 
                    v-if="loading"
                    :active="true" color= '#1bb4e6'
                    loader="dots" :width="32" :height="10"
                    backgroundColor='#ffffff' style="text-align: center">
                  </loading-component>
                  <span v-else>{{ lang.save }}</span>
                </el-button>
                <button-action-authenticated :permission="[customRPermis, 'edit']" size="mini" type="text" v-if="!isEditing.status" :disabled="computedAccess" @click="handleEdit('status')">
                  <svg-icon icon-class="edit-2" class="font-20"/>
                </button-action-authenticated>
              </div>
            </div>

            <div class="card-body">
              <div class="like-table-wrapper--item-border-bottom">
                <div class="full-width">{{ lang.shipping_courier }}</div>
                <div class="full-width flex-container flex-container--content-end" >
                  <h5 v-if="!openOrderData.shipping_courier_name">-</h5>
                  <h5 v-else>{{ openOrderData.shipping_courier_name }}</h5>
                </div>
              </div>
              <div class="like-table-wrapper--item-border-bottom">
                <div class="full-width">{{ lang.shipping_service_type }}</div>
                <div class="full-width flex-container flex-container--content-end" >
                  <h5 v-if="!openOrderData.shipping_service_type">-</h5>
                  <h5 v-else>{{ openOrderData.shipping_service_type }}</h5>
                </div>
              </div>
              <el-form :model="formShippingStatus" ref="status">
                <div class="like-table-wrapper--item-border-bottom">
                  <div class="full-width">{{ lang.shipping_date }}</div>
                  <div v-if="!isEditing.status" class="full-width flex-container flex-container--content-end" >
                    <h5 v-if="!openOrderData.fshipping_date">-</h5>
                    <h5 v-else>{{ labelDate }}</h5>
                  </div>
                  <div v-else>
                    <el-form-item prop="dateShipping" style="margin-bottom: unset" :rules="[{ required: true, message: 'Please input date', trigger: 'change' }]">
                      <el-date-picker
                        v-model="formShippingStatus.dateShipping"
                        :placeholder="$lang[langId].pick_a_day"
                        :clearable="false"
                        class="inline-form"
                        type="date"
                        format="dd-MM-yyyy"
                        value-format="yyyy-MM-dd"
                        @change="timeChange"
                      />
                    </el-form-item>
                  </div>
                </div>
                <div class="like-table-wrapper--item-border-bottom">
                  <div class="full-width">{{ lang.tracking_no }}</div>
                  <div v-if="!isEditing.status" class="full-width flex-container flex-container--content-end" >
                    <h5 v-if="!openOrderData.shipping_track_no">-</h5>
                    <h5 v-else>{{ openOrderData.shipping_track_no }}</h5>
                  </div>
                  <div v-else>
                    <el-form-item prop="noTracking" style="margin-bottom: unset" :rules="[{ required: true, message: 'Please input no tracking', trigger: 'blur' },]">
                      <el-input v-model="formShippingStatus.noTracking" class="inline-form" type="text" :placeholder="$lang[langId].input_code" clearable></el-input>
                    </el-form-item>
                  </div>
                </div>
              </el-form>
            </div>
          </el-card>
        </div>
        <div class="full-width mr-8">
          <el-card class="box-card" style="height: 100%">
            <div slot="header" class="flex-container flex-container--wrap">
              <h3 class="box-title">{{ lang.drop_ship }}</h3>
              <div v-if="showEdit" class="pull-right">
                <el-button size="mini" type="text" v-if="isEditing.dropship" @click="cancelEdit('dropship')">{{ lang.cancel }}</el-button>
                <el-button size="mini" type="success" v-if="isEditing.dropship" @click="saveEdit('dropship')">{{ lang.save }}</el-button>
                <button-action-authenticated :permission="[customRPermis, 'edit']" size="mini" type="text" v-if="!isEditing.dropship" :disabled="computedAccess" @click="handleEdit('dropship')">
                  <svg-icon icon-class="edit-2" class="font-20"/>
                </button-action-authenticated>
              </div>
            </div>
            <div class="like-table-wrapper--item-border-bottom">
              <div class="full-width">{{ lang.store_name }}</div>
              <div v-if="!isEditing.dropship" class="full-width flex-container flex-container--content-end" >
                <h5 v-if="!openOrderData.drop_ship_store_name">-</h5>
                <h5 v-else>{{ openOrderData.drop_ship_store_name }}</h5>
              </div>
              <div v-else class="full-width">
                <el-input v-model="formDropShip.dropShipName" class="inline-form"></el-input>
              </div>
            </div>
            <div class="like-table-wrapper--item-border-bottom">
              <div class="full-width">{{ lang.sender }}</div>
              <div v-if="!isEditing.dropship" class="full-width flex-container flex-container--content-end" >
                <h5 v-if="!openOrderData.drop_ship_sender_name">-</h5>
                <h5 v-else>{{ openOrderData.drop_ship_sender_name }}</h5>
              </div>
              <div v-else class="full-width">
                <el-input v-model="formDropShip.dropShipSender" class="inline-form"></el-input>
              </div>
            </div>
            <div class="like-table-wrapper--item-border-bottom">
              <div class="full-width">{{ lang.phone }}</div>
              <div v-if="!isEditing.dropship" class="full-width flex-container flex-container--content-end" >
                <h5 v-if="!openOrderData.drop_ship_contact_phone">-</h5>
                <h5 v-else>{{ openOrderData.drop_ship_contact_phone }}</h5>
              </div>
              <div v-else class="full-width">
                <el-input v-model="formDropShip.dropShipPhone" class="inline-form"></el-input>
              </div>
            </div>
          </el-card>
        </div>
      </div>

      <order-table
        :data-table="openOrderData"
        :edit-show="showEdit"
        @save-payment="updatePayment"
        @refresh="refreshData"
      />

      <div class="flex-container mt-24" style="align-items: unset">
        <div class="full-width mr-8">
          <el-card class="box-card box-card--sales" :class="!openOrderData.serve_by_id ? 'color-grey--soft--bg' : ''" style="height: 100%">
            <div slot="header" class="flex-container flex-container--wrap color-white--bg">
              <h3 class="box-title">{{ $lang[langId].server_pos }}</h3>
              <div v-if="showEdit" class="pull-right">
                <el-button type="text" v-if="isEditing.server" size="mini" @click="cancelEdit('server')">{{ lang.cancel }}</el-button>
                <el-button type="success" v-if="isEditing.server" size="mini" @click="saveEdit('server')">{{ lang.save }}</el-button>
                <button-action-authenticated :permission="[customRPermis, 'edit']" type="text" v-if="!isEditing.server" size="mini" :disabled="computedAccess" @click="handleEdit('server')">
                  <svg-icon icon-class="edit-2" class="font-20"/>
                </button-action-authenticated>
              </div>
            </div>
            <div>
              <div v-if="!isEditing.server" class="full-width" >
                <p v-if="!openOrderData.serve_by_id"> - </p>
                <p v-else>{{ openOrderData.serve_by_name }}</p>
              </div>
              <div v-else class="full-width">
                <el-select
                    v-model="openOrderData.serve_by_id"
                    :placeholder="$lang[langId].server_pos">
                    <el-option
                      v-for="item in openOrderData.serve_bys"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
              </div>
            </div>
          </el-card>
        </div>
        <div class="full-width ml-8">
          <el-card class="box-card box-card--sales" :class="!openOrderData.payment_due_date ? 'color-grey--soft--bg' : ''" style="height: 100%">
            <div slot="header" class="flex-container flex-container--wrap color-white--bg">
              <h3 class="box-title">{{ lang.payment_due_date }}</h3>
              <div v-if="showEdit" class="pull-right">
                <el-button type="text" v-if="isEditing.due_date" size="mini" @click="cancelEdit('due_date')">{{ lang.cancel }}</el-button>
                <el-button type="success" v-if="isEditing.due_date" size="mini" @click="saveEdit('due_date')">{{ lang.save }}</el-button>
                <button-action-authenticated :permission="[customRPermis, 'edit']" type="text" v-if="!isEditing.due_date" size="mini" :disabled="computedAccess" @click="handleEdit('due_date')">
                  <svg-icon icon-class="edit-2" class="font-20"/>
                </button-action-authenticated>
              </div>
            </div>
            <div >
              <div v-if="!isEditing.due_date" class="full-width flex-container" >
                <p v-if="!openOrderData.payment_due_date">-</p>
                <p v-else class="show-white-space">{{openOrderData.fpayment_due_date}}</p>
              </div>
              <div v-else>
                <el-date-picker
                  v-model="openOrderData.payment_due_date"
                  :placeholder="$lang[langId].pick_a_day"
                  :clearable="false"
                  type="date"
                  format="dd-MM-yyyy"
                  value-format="yyyy-MM-dd"
                  class="date-complete mb-4 mr-4"
                  style="max-width: 160px;"
                />
              </div>
            </div>
          </el-card>
        </div>
      </div>

      <div class="flex-container mt-24" style="align-items: unset">
        <div class="full-width mr-8">
          <el-card class="box-card box-card--sales" :class="!openOrderData.notes ? 'color-grey--soft--bg' : ''" style="height: 100%">
            <div slot="header" class="flex-container flex-container--wrap color-white--bg">
              <h3 class="box-title">{{ lang.notes }}</h3>
              <div v-if="showEdit" class="pull-right">
                <el-button type="text" v-if="isEditing.notes" size="mini" @click="cancelEdit('notes')">{{ lang.cancel }}</el-button>
                <el-button type="success" v-if="isEditing.notes" size="mini" @click="saveEdit('notes')">{{ lang.save }}</el-button>
                <button-action-authenticated :permission="[customRPermis, 'edit']" type="text" v-if="!isEditing.notes" size="mini" :disabled="computedAccess" @click="handleEdit('notes')">
                  <svg-icon icon-class="edit-2" class="font-20"/>
                </button-action-authenticated>
              </div>
            </div>
            <div class="">
              <div v-if="!isEditing.notes" class="full-width flex-container" >
                <p v-if="!openOrderData.notes" class="color-grey--placeholder">{{ $lang[langId].there_is_no }}</p>
                <p v-else class="show-white-space">{{openOrderData.notes}}</p>
              </div>
              <div v-else>
                <el-input type="textarea" autosize v-model="openOrderData.notes" @keyup.native.enter="handleShiftEnter"></el-input>
              </div>
            </div>
          </el-card>
        </div>
        <div class="full-width ml-8">
          <el-card class="box-card box-card--sales" :class="!openOrderData.invoice_notes ? 'color-grey--soft--bg' : ''" style="height: 100%">
            <div slot="header" class="flex-container flex-container--wrap color-white--bg">
              <h3 class="box-title">{{ lang.invoice }} {{ lang.footer }}</h3>
              <div v-if="showEdit" class="pull-right">
                <el-button type="text" v-if="isEditing.invoice" size="mini" @click="cancelEdit('invoice')">{{ lang.cancel }}</el-button>
                <el-button type="success" v-if="isEditing.invoice" size="mini" @click="saveEdit('invoice')">{{ lang.save }}</el-button>
                <button-action-authenticated :permission="[customRPermis, 'edit']" type="text" v-if="!isEditing.invoice" size="mini" :disabled="computedAccess" @click="handleEdit('invoice')">
                  <svg-icon icon-class="edit-2" class="font-20"/>
                </button-action-authenticated>
              </div>
            </div>
            <div >
              <div v-if="!isEditing.invoice" class="full-width flex-container" >
                <div>
                  <p v-if="!openOrderData.invoice_notes" class="color-grey--placeholder">{{ $lang[langId].there_is_no }}</p>
                  <p class="invoice show-white-space">{{ openOrderData.invoice_notes }}</p>
                  <div :class="!openOrderData.invoice_notes ? 'color-grey--placeholder' : ''">{{ $lang[langId].info_cantact_our_support }} </div>
                </div>
              </div>
              <div class="show-white-space" v-else>
                <el-input type="textarea" autosize v-model="openOrderData.invoice_notes"></el-input>
              </div>
            </div>
          </el-card>
        </div>
      </div>

      <div class="flex-container mt-24" style="align-items: unset">
        <div class="full-width mr-8">
          <el-card class="box-card box-card--sales">
            <div slot="header" class="flex-container flex-container--wrap color-white--bg">
              <h3 class="box-title">{{$lang[langId].attactment_file}}</h3>
              <div class="pull-right">
                <el-upload :disabled="computedAccess"
                  v-loading="loadingUploadImport"
                  class="upload-demo"
                  :data="{sales_id: openOrderData.id}"
                  :action="attachmentUploadImportUrl"
                  :headers="computedUploadImportHeaders"
                  :on-success="attachmentUploadSuccess"
                  :on-error="attachmentUploadError"
                  :on-progress="attachmentUploadProgress"
                  multiple
                  :show-file-list="false"
                  >
                  <button-action-authenticated slot="trigger" :permission="[customRPermis, 'edit']" size="mini" type="info"
                  :disabled="computedAccess" @click="" icon="el-icon-plus">
                    {{lang.add}}
                  </button-action-authenticated>
                </el-upload>
              </div>
            </div>

            <div class="horizontal-scroll-wrapper">
              <div v-for="(file, index) in openOrderData.attachment" :key="index" class="pr-20">
                <el-card :body-style="{ padding: '0px' }">
                  <div class="p-14 font-16" v-if="file.is_image === 1">
                    <span><svg-icon icon-class="picture-file"></svg-icon> {{file.file_name}}</span>
                    <div style="margin-top: 13px; line-height: 12px;">
                      <el-button type="primary" size="small" class="button" @click="downloadAttachment(file)">Download</el-button>
                      <el-button type="danger" size="small" class="button" @click="deleteAttachment(file)">hapus</el-button>
                    </div>
                  </div>
                  <div class="p-14 font-16" v-else>
                    <span><svg-icon icon-class="pdf-file"></svg-icon> {{file.file_name}}</span>
                    <div style="margin-top: 13px; line-height: 12px;">
                      <el-button type="primary" size="small" class="button" @click="downloadAttachment(file)">Download</el-button>
                      <el-button type="danger" size="small" class="button" @click="deleteAttachment(file)">{{lang.delete}}</el-button>
                    </div>
                  </div>
                </el-card>

              </div>
            </div>

          </el-card>
        </div>
      </div>

      <div class="mt-24">
        <button-action-authenticated
          :permission="['sales/cancelledorders', 'store']"
          type="default"
          class="btn-block color-danger"
          @click="cancelStatusFromBtn">
          <svg-icon type="trash" stroke="#FF0000"></svg-icon>
          {{ lang.cancel_order }}
        </button-action-authenticated>
      </div>

      <div class="flex-container mt-24" style="align-items: unset">
        <div class="full-width mr-8">
          <el-card class="box-card box-card--sales" style="height: 100%">
            <div slot="header" class="flex-container flex-container--wrap color-white--bg">
              <h3 class="box-title">Log</h3>
            </div>
            <div >
              <div class="flex-container">
                <div class="full-width"><h5>{{ lang.last_modified }}</h5></div>
                <div class="full-width text-right"><label>{{ openOrderData.modified_by }}, {{ openOrderData.modified_time }}</label></div>
              </div>
              <div class="flex-container">
                <div class="full-width"><h5>{{ lang.created_time }}</h5></div>
                <div class="full-width text-right"><label>{{ openOrderData.created_by }}, {{ openOrderData.order_time }}</label></div>
              </div>
              <div v-if="openOrderData.translogs">
                <div v-for="item in openOrderData.translogs" :key="item.id" class="flex-container">
                  <div class="full-width"><h5>{{ item.action }}</h5></div>
                  <div class="full-width text-right"><label>{{ item.created_by }}, {{ item.action_time }}</label></div>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </div>

    </section>
    
    <!-- email dialog -->
    <el-dialog class="email-dialog" :visible.sync="emailDialog" custom-class="mw-420">
      <span slot="title">
        <svg-icon icon-class="mail"></svg-icon>
        {{ lang.email }}
      </span>
      <p>{{ $lang[langId].send_notification_via_email }}</p>
      <ul class="list-unstyled">
        <li v-for="item in emailNotify" :key="item.id">
          <el-radio v-model="emailRadioValue" :label="item.id">{{ item.email_notify_type_name }}</el-radio>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button type="text" @click="emailDialog = false" style="color: #A5A5A5;">{{ lang.cancel }}</el-button>
        <el-button type="success" @click="handleSentEmail">
          {{ lang.submit }}
        </el-button>
      </span>
    </el-dialog>

    <!-- sms dialog -->
    <el-dialog class="sms-dialog" :visible.sync="smsDialog" custom-class="mw-420">
      <span slot="title">
        <svg-icon icon-class="smartphone"></svg-icon>
        {{ $lang[langId].sms }}
      </span>
      <p>{{ $lang[langId].send_notification_via_sms }}</p>
      <ul class="list-unstyled">
        <li v-for="item in smsNotify" :key="item.id">
          <el-radio v-model="smsRadioValue" :label="item.id">{{ item.sms_notify_type_name }}</el-radio>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button type="text" @click="smsDialog = false" style="color: #A5A5A5;">{{ lang.cancel }}</el-button>
        <el-button type="success" @click="handleSentSms">
          {{lang.submit}}
        </el-button>
      </span>
    </el-dialog>

    <!-- wa dialog -->
    <el-dialog class="sms-dialog" :visible.sync="waDialog" custom-class="mw-420">
      <span slot="title">
        <svg-icon icon-class="smartphone"></svg-icon>
        {{ $lang[langId].whatsapp }}
      </span>
      <p>{{ $lang[langId].send_notification_via_wa }}</p>
      <ul class="list-unstyled">
        <li v-for="item in smsNotify" :key="item.id">
          <el-radio v-model="waRadioValue" :label="item.id">{{ item.sms_notify_type_name }}</el-radio>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button type="text" @click="waDialog = false" style="color: #A5A5A5;">{{ lang.cancel }}</el-button>
        <el-button type="success" @click="handleSentWa">
          {{lang.submit}}
        </el-button>
      </span>
    </el-dialog>

    <el-dialog 
      :visible.sync="dialogEditCustomer" 
      :show-close="false"
      width="536px">
      <div slot="title" class="flex-container">
        <span class="ml-8 font-20 full-width">Edit Customer</span>
        <div class="btn_save_dialog full-width text-right">
          <el-button type="info" @click="dialogEditCustomer = false">{{ lang.cancel }}</el-button>
          <el-button type="success" :loading="loading" @click="saveEdit('customer')" >{{ lang.save }}</el-button>
        </div>
      </div>
      <div>
        <div class="flex-container font-bold mb-16">
          <div class="font-18 full-width">{{ lang.customer }}</div>
          <div class="pointer" @click="visibleCustomerNew = true"><i class="el-icon-plus font-20 font-bold" /></div>
        </div>
        <el-select
          v-model="keyword"
          :loading="loadingCustomer"
          :remote-method="searchCustomer"
          :popper-append-to-body="true"
          :popper-class="'dropdown-select-product'"
          :class="'full-width box-shadow-2'"
          value-key="id"
          remote
          filterable
          clearable
          reserve-keyword
          :placeholder="rootLang.select+' '+lang.customer"
          @change="handleChangeCustomer">
          <el-option
            v-for="item in dataCustomer"
            :key="item.id"
            :label="item.name"
            :value="item">
            <div class="flex-container">
              <div>
                <div class="font-bold font-14">
                  {{ item.name }}
                </div>
              </div>
            </div>
          </el-option>
        </el-select>
        <div v-if="formCustomer && formCustomer.customerId" class="like-table-wrapper mt-16">
          <div class="like-table-wrapper--item pointer">
            <div class="mr-8">
              <el-avatar>{{ labelAvatar(formCustomer.customerName) }}</el-avatar>
            </div>
            <div class="mr-8" style="flex-grow: 1;">
              <div class="font-bold font-14">
                {{ formCustomer.customerName }}
              </div>
              <div class="color-info font-12">
                <span>
                  {{ formCustomer.customerPhone }}
                </span>
              </div>
              <div class="color-info font-12">
                <span>
                  {{ formCustomer.customerEmail }}
                </span>
              </div>
            </div>
            <el-button type="text" @click="removeItemCustomer()">
              <i class="el-icon-close" style="color: #F44336"></i>
            </el-button>
          </div>
        </div>
      </div>

      <transition name="el-zoom-in-center">
        <div
          v-if="visibleCustomerNew"
          class="offscreen-right-sidebar">
          <div class="offscreen-right-sidebar--wrapper">
            <div class="offscreen-right-sidebar--header text-left">
              Pelanggan Baru
              <close-esc @close="visibleCustomerNew = false" />
            </div>

            <div>
              <div class="full-width">
                <span class="font-12">{{ lang.name }}</span>
                <div>
                  <el-input v-model="tempCustomer.customer_name" ></el-input>
                </div>
              </div>
              <div class="full-width mt-16">
                <span class="font-12">{{ lang.customer_type }}</span>
                <div>
                  <el-autocomplete
                    style="width: 100%;"
                    v-model="tempCustomer.customer_type_name"
                    :fetch-suggestions="searchCustomerTypes"
                    :placeholder="lang.search"
                    @select="handleSelected">
                  </el-autocomplete>
                </div>
              </div>
              <div class="full-width mt-16">
                <span class="font-12">{{ lang.email }}</span>
                <div>
                  <el-input v-model="tempCustomer.customer_email" ></el-input>
                </div>
              </div>
              <div class="full-width mt-16">
                <span class="font-12">{{ lang.phone }}</span>
                <div>
                  <phone-number-input
                    v-model="tempCustomer.customer_phone_format"
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
            </div>
          </div>

          <div class="offscreen-right-sidebar--footer">
            <el-button type="success" class="btn-block" :loading="loadingUpdateCustomer" @click="handleAddNewCustomer" >{{ lang.save }}</el-button>
          </div>
        </div>
      </transition>
    </el-dialog>

  </div>
</template>

<script>
// import StepProgress from 'vue-step-progress'
// import 'vue-step-progress/dist/main.css'

import StepProgress from '@/components/modules/stepProgress'

import { findDriver, logsDriver } from '@/api/salesOrder'

// import { BASE_API, baseApi } from 'src/http-common'
import basicComputedMixin from '@/mixins/basicComputedMixin'
import { baseApi } from 'src/http-common'
import axios from 'axios'
import OrderTable from './DetailTableOrder'
import moment from 'moment'
import LoadingComponent from 'vue-loading-overlay'
import CloseEsc from '@/components/modules/CloseEsc'

import { customer as fetchCustomer } from '@/api/customer-supplier'
import { updateCustomerOrder } from '@/api/sales/openorder'
import ButtonActionAuthenticated from '../../../ButtonActionAuthenticated.vue'

export default {
  name: 'DetailOrderV2',
  components: {
    OrderTable,
    LoadingComponent,
    StepProgress,
    CloseEsc,
    ButtonActionAuthenticated
  },

  mixins: [basicComputedMixin],

  watch: {
    openOrderData(data) {
      // console.log('itemmmm', data)
      if (data.shipping_courier_id && data.shipping_courier_id === 'GSN' && data.shipping_log.gosend.detail !== null) {
        data.shipping_log.gosend.detail.logs.map(i => {
          this.steps.push(
            {
              label: i.fstatus,
              status: i.status
            }
          )
        })
      }
    }
  },

  data() {
    return {
      loading: true,
      loadingElement: false,
      loadingUploadImport: false,
      openOrderData: {},
      showTable: false,
      downloadValue: null,
      emailDialog: false,
      smsDialog: false,
      emailRadioValue: 1,
      smsRadioValue: 1,
      statusSelect: [
        {
          value: 'P',
          label: this.$lang[this.$store.state.userStores.langId].pending,
          disabled: false,
          color: '#AFB0AF'
        },
        {
          value: 'A',
          label: this.$lang[this.$store.state.userStores.langId].has_confirm,
          disabled: false,
          color: '#2BC5F4'
        },
        {
          value: 'S',
          label: this.$lang[this.$store.state.userStores.langId].being_sent,
          disabled: false,
          color: '#2BC5F4'
        },
        {
          value: 'T',
          label: this.$lang[this.$store.state.userStores.langId].delivered,
          disabled: false,
          color: '#6EBE46'
        },
        {
          value: 'Z',
          label: this.$lang[this.$store.state.userStores.langId].complete,
          disabled: !this.checkCustomPermission('sales/closedorders', 'store'),
          color: '#6EBE46'
        },
        {
          value: 'X',
          label: this.$lang[this.$store.state.userStores.langId].cancel,
          disabled: !this.checkCustomPermission('sales/cancelledorders', 'store'),
          color: '#F44336'
        }
      ],
      downloadSelect: [
        {
          id: 0,
          value: 'pdf',
          label: this.$store.state.userStores.lang.download_pdf
        },
        {
          id: 1,
          value: 'pdf',
          label: this.$lang[this.$store.state.userStores.langId].delivery_order
        },
        {
          id: 2,
          value: 'pdf',
          label: this.$lang[this.$store.state.userStores.langId].delivery_order + ' ' + this.$lang[this.$store.state.userStores.langId].no_image
        },
        {
          id: 3,
          value: 'invoicepdf',
          label: this.$store.state.userStores.lang.invoice
        },
        {
          id: 4,
          value: 'packinglabelpdf',
          label: this.$store.state.userStores.lang.packing_label
        },
        {
          id: 6,
          value: 'packinglabelpdf',
          label: this.$store.state.userStores.lang.packing_label + ' 1/2W'
        },
        {
          id: 8,
          value: 'packinglabelpdf',
          label: this.$store.state.userStores.lang.packing_label + '+ Weight 1/2W'
        },
        {
          id: 5,
          value: 'packinglabelpdf',
          label: this.$store.state.userStores.lang.packing_label + ' + Logo'
        },
        {
          id: 7,
          value: 'packinglabelpdf',
          label: this.$store.state.userStores.lang.packing_label + ' 1/2W + Logo'
        },
        {
          id: 9,
          value: 'packinglabelpdf',
          label: this.$store.state.userStores.lang.packing_label + '+ Weight 1/2W + Logo'
        }
      ],
      downloadSelectEdit: [
        {
          value: 'pdf',
          label: this.$store.state.userStores.lang.download_pdf
        },
        {
          value: 'pdf',
          label: this.$lang[this.$store.state.userStores.langId].delivery_order
        },
        {
          value: 'pdf',
          label: this.$lang[this.$store.state.userStores.langId].delivery_order + ' ' + this.$lang[this.$store.state.userStores.langId].no_image
        },
        {
          value: 'packinglabelpdf',
          label: this.$store.state.userStores.lang.packing_label
        },
        {
          value: 'packinglabelpdf',
          label: this.$store.state.userStores.lang.packing_label + ' 1/2W'
        },
        {
          value: 'packinglabelpdf',
          label: this.$store.state.userStores.lang.packing_label + '+ Weight 1/2W'
        }
      ],
      notifSelect: [
        {
          value: 'email',
          label: this.$store.state.userStores.lang.email,
          icon: 'el-icon-message'
        },
        {
          value: 'sms',
          label: this.$lang[this.$store.state.userStores.langId].sms,
          icon: 'el-icon-mobile-phone'
        },
        {
          value: 'wa',
          label: this.$lang[this.$store.state.userStores.langId].whatsapp,
          icon: 'ico-whatsapp'
        }
      ],
      isEditing: {
        customer: false,
        shippingto: false,
        status: false,
        dropship: false,
        notes: false,
        invoice: false,
        server: false,
        due_date: false
      },
      stateCountry: [],
      shippingCity: [],
      subDistrict: [],
      formShippingStatus: {
        dateShipping: '',
        noTracking: ''
      },
      labelDate: '',
      suggestData: [],
      autoCompleteStartOn: 300,
      formCustomer: {
        customerName: '',
        customerId: '',
        customerEmail: '',
        customerPhone: ''
      },
      formDropShip: {
        dropShipName: '',
        dropShipSender: '',
        dropShipPhone: ''
      },
      showEdit: true,
      switchValue: 0,
      routeName: '',
      statusOrder: '',
      repeat: false,
      emailNotify: [],
      smsNotify: [],
      waDialog: false,
      waRadioValue: 1,
      dataProgress: 50,
      steps: [],
      setep:[
        {
          "status": "confirmed",
          "status_desc": "Pemesanan diterima"
        },
        {
          "status": "Finding Driver",
          "status_desc": "Mencari pengemudi"
        },
        {
          "status": "no_driver",
          "status_desc": "Pengemudi tidak ditemukan"
        },
        {
          "status": "allocated",
          "status_desc": "Pengemudi ditemukan"
        },
        {
          "status": "out_for_pickup",
          "status_desc": "Pengemudi sedang dalam perjalanan ke lokasi penjemputan"
        },
        {
          "status": "picked",
          "status_desc": "Barang berhasil diambil oleh driver"
        },
        {
          "status": "out_for_delivery",
          "status_desc": "Pengemudi sedang dalam perjalanan untuk mengantarkan barang"
        },
        {
          "status": "on_hold",
          "status_desc": "Pengiriman tertunda karena alasan penerima tidak bisa dihubungi, demonstrasi, cuaca, dll"
        },
        {
          "status": "cancelled",
          "status_desc": "Pemesanan dibatalkan"
        },
        {
          "status": "delivered",
          "status_desc": "Barang berhasil dikirim ke penerima"
        },
        {
          "status": "rejected",
          "status_desc": "Pengemudi mengembalikan barang kepada pengirim karena penerima tidak dapat menerima barang tersebut"
        }
      ],
      currentStep: 2,
      dialogEditCustomer: false,
      keyword: '',
      loadingCustomer: false,
      dataCustomer: [],
      visibleCustomerNew: false,
      tempCustomer: {
        customer_name: '',
        customer_type_name: '',
        customer_type_id: '',
        customer_email: '',
        customer_phone: '',
        customer_phone_format: ''
      },
      loadingUpdateCustomer: false,
      customRPermis: 'sales/openorders'
    }
  },
  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    selectRoute() {
      return this.$route.name
    },
    token() {
      return this.$store.state.user.token
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    userRole() {
      const selectedStore = this.$store.getters.selectedStore
      return {
        role_id: selectedStore.role_id,
        role_name: selectedStore.role_name,
        is_pos_only: selectedStore.is_pos_only,
        is_mobile: selectedStore.is_mobile
      }
    },
    computedStatusSelect() {
      return this.statusSelect.filter(item => {
        if (this.userRole.role_id === 'SP') {
          if (item.value !== 'X') {
            return item
          }
        } else {
          return item
        }
      })
    },

    visibleEdit () {
      // if (this.userRole.role_id === 'OW' && ( this.openOrderData.order_source === 'P' || this.openOrderData.order_source === 'D' || this.openOrderData.order_source === 'T' ) && this.openOrderData.status === 'Z') {
      //   return true
      // } else if (( this.openOrderData.order_source === 'P' || this.openOrderData.order_source === 'D' || this.openOrderData.order_source === 'T' ) && this.openOrderData.status === 'Z' && this.userRole.role_id !== 'OW') {
      //   return false
      // } else {
      //   return true
      // }
      if (this.selectedStore.can_edit_complete_order && this.openOrderData.status === 'Z') {
        return this.selectedStore.can_edit_complete_order
      } else if (!this.selectedStore.can_edit_complete_order && this.openOrderData.status === 'Z') {
        return this.selectedStore.can_edit_complete_order
      } else {
        return true
      }
    },
    accessByStore () {
      return ['cvsms', 'smsstore1', 'smsstore2']
    },

    computedAccess () {
      if (this.accessByStore.includes(this.selectedStore.url_id) && (this.selectedStore.role_id === 'ST' || this.selectedStore.role_id === 'SS')) {
        return true
      }
    },

    stageLevel() {
      return process.env.ENV_CONFIG
    },

    progressClasses() {
      let result = 'progress '
      if (this.currentStep && this.currentStep.label === 'complete') {
        return result += 'progress--complete'
      }
      return result += `progress--${this.steps.indexOf(this.currentStep) + 1}`
    },

    stepLogs () {
      // let step = []
      let stepReturn = []
      // if (this.openOrderData.shipping_courier_id && this.openOrderData.shipping_courier_id === 'GSN') {
      //   this.openOrderData.shipping_log.gosend.detail.logs.map(i => {
      //     step.push(
      //       {
      //         label: i.fstatus,
      //         icon: 'icon-truck-new-white'
      //       }
      //     )
      //   })
      // }
      if (this.steps.length) {
        while (this.steps.length > 0) {
          stepReturn.push(this.steps.splice(0,6))
        }
      }
      
      return stepReturn
    },

    stepLogsV2 () {
      let step = []
      let lengthAwal = this.setep.length/6
      let countArray = Math.ceil(this.setep/6)
      
      let a = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
      while (this.setep.length > 0) {
        step.push(this.setep.splice(0,6))
      }

      return step
    },

    activeFindDriver () {
      if (this.openOrderData.shipping_courier_id === 'GSN' && this.openOrderData.shipping_log.gosend.can_booking === 1) {
        if (this.openOrderData.status === 'A' && this.openOrderData.is_paid === 1) {
          return true
        } else {
          return false
        }
      } else if (this.openOrderData.shipping_courier_id === 'GSN' && this.openOrderData.shipping_log.gosend.can_booking === 0) {
        return false
      }
      // if (this.openOrderData.shipping_courier_id === 'GSN' && this.openOrderData.shipping_log.gosend.detail === null) {
      //   return true
      // } else if (this.openOrderData.shipping_courier_id === 'GSN' && this.openOrderData.shipping_log.gosend.detail !== null) {
      //   return false
      // } else {
      //   return false
      // }
    },

    stillFinDriver () {
      if (this.openOrderData && this.openOrderData.shipping_courier_id === 'GSN' && this.openOrderData.shipping_log.gosend.can_booking === 0 && this.openOrderData.shipping_log.gosend.detail !== null && this.openOrderData.shipping_log.gosend.detail.status === 'Finding Driver') {
        return true
      } else {
        return false
      }
    },

    loadingFindDriver () {
      if (this.openOrderData && this.openOrderData.shipping_courier_id === 'GSN' && this.openOrderData.shipping_log.gosend.can_booking === 1) {
        return false
      }
      if (this.openOrderData && this.openOrderData.shipping_courier_id === 'GSN' && this.openOrderData.shipping_log.gosend.can_booking === 0 && this.openOrderData.shipping_log.gosend.detail.driver_name === null) {
        return true
      }
    },

    blockChangeStatus () {
      if (this.openOrderData.shipping_courier_id === 'GSN' && this.openOrderData.shipping_log.gosend.can_booking === 0) {
        return true
      } else { 
        return false
      }
    },

    attachmentUploadImportUrl() {
      const url = baseApi(this.selectedStore.url_id, this.langId, 'account/sales/attachment')
      return url
    },
    computedUploadImportHeaders() {
      return {
        'authorization' : 'Bearer ' + this.token.access_token
      }
    },
  },
  methods: {
    getRoute(route, store) {
      if(Object.keys(this.$route.query).includes('pathName')){
        this.routeName = this.$route.query.pathName
      } else {
        this.routeName = route
      }
      // console.log(this.routeName)
      if (route === 'Open Order Detail') {
        let url = baseApi(this.selectedStore.url_id, this.langId, 'openorder/' + this.$route.params.id)
        this.getDetailData(url)
      } else {
        let url = baseApi(this.selectedStore.url_id, this.langId, 'closeorder/' + this.$route.params.id)
        this.showEdit = false
        this.getDetailData(url)
      }
    },
    getDetailData(url) {
      this.loading = true
      if (typeof this.$route.query.rpt !== 'undefined') {
        this.repeat = true
      }
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: url,
        headers: headers
      })
        .then(response => {
          this.openOrderData = response.data.data
          this.labelDate = this.openOrderData.fshipping_date
          this.switchValue = this.openOrderData.is_paid
          this.statusOrder = this.openOrderData.status
          this.loading = false
          this.splitDate(this.openOrderData.order_date, this.labelDate)
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
    splitDate(val1, val2) {
      let date1 = val1
      let dateSplit1 = date1.split(' ')
      let orderDate = dateSplit1[0]
      this.openOrderData.order_date = orderDate
      this.labelDate = moment(val2).format('DD MMMM YYYY')
    },

    handleDownload(file) {
      var params = {}
      if (file === 0) {
        params.url = 'pdf'
      }
      if (file === 1) {
        params.url = 'deliveryorderpdf'
      }
      if (file === 2) {
        params.url = 'deliveryorderpdf'
        params.no_image = 1
      }
      if (file === 3) {
        params.url = 'invoicepdf'
      }
      if (file === 4) {
        params.url = 'packinglabelpdf'
      }
      if (file === 5) {
        params.url = 'packinglabelpdf'
        params.with_header = 1
      }
      if (file === 6) {
        params.url = 'packinglabelpdf'
        params.type = 2
      }
      if (file === 7) {
        params.url = 'packinglabelpdf'
        params.type = 2
        params.with_header = 1
      }
      if (file === 8) {
        params.url = 'packinglabelpdf'
        params.type = 3
      }
      if (file === 9) {
        params.url = 'packinglabelpdf'
        params.type = 3
        params.with_header = 1
      }
      this.download(params)
    },

    handleDownloadEdit(file) {
      var params = {}
      if (file === 0) {
        params.url = 'pdf'
      }
      if (file === 1) {
        params.url = 'deliveryorderpdf'
      }
      if (file === 2) {
        params.url = 'deliveryorderpdf'
        params.no_image = 1
      }
      if (file === 3) {
        params.url = 'packinglabelpdf'
      }
      if (file === 4) {
        params.url = 'packinglabelpdf'
        params.type = 2
      }
      if (file === 5) {
        params.url = 'packinglabelpdf'
        params.type = 3
      }
      this.download(params)
    },

    handleNotif(data) {
      if (data === 'sms') {
        this.smsDialog = true
      }
      if (data === 'email') {
        this.emailDialog = true
      }
      if (data === 'wa') {
        this.waDialog = true
      }
    },

    download(file) {
      this.loading = true
      file.id = this.openOrderData.id
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        url: baseApi(this.selectedStore.url_id, this.langId, 'openorder/' + file.url),
        method: 'GET',
        headers,
        responseType: 'blob',
        params: file
      }).then((response) => {
        const fileName = this.openOrderData.order_no + '_' + file.id + '.pdf'
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        this.loading = false
      }).catch((error) => {
        console.log(error)
        const { data } = error.response
        // Read file
        const file = this.fileReader(data)
        file.then(response => {
          const message = JSON.parse(response)
          console.log('err', message.error.error)
          this.$notify({
            type: 'warning',
            title: message.error.message,
            message: message.error.error
          })
        })
        this.loading = false
      })
    },

    fileReader(data) {
      const fileReader = new FileReader()
      return new Promise((resolve, reject) => {
        fileReader.onerror = () => {
          fileReader.abort();
          reject(new Error('Problem parsing file'))
        }

        fileReader.onload = () => {
          resolve(fileReader.result)
        }

        fileReader.readAsText(data)
      })
    },

    handleSwitchPayment() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        status: this.switchValue,
        order_id: this.openOrderData.id
      }
      axios({
        method: 'POST',
        // url: BASE_API + 'openorder/updatepaymentstatus',
        url: baseApi(this.selectedStore.url_id, this.langId, 'openorder/updatepaymentstatus'),
        headers: headers,
        params: params
      })
        .then(response => {
          // this.result = response.data
          this.openOrderData = response.data.data
          this.$message({
            message: 'Success',
            type: 'success'
          })
          this.getDetailData()
          this.loading = false
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.switchValue = this.openOrderData.is_paid
          this.getDetailData()
          this.loading = false
        })
    },
    handleChangeStatus(val) {
      // console.log(val)
      if (val === 'btn') {
        this.statusOrder = 'A'
        this.handleUpdateStatus()
      }
      if (val === 'T') {
        if (!this.openOrderData.shipping_date && !this.openOrderData.shipping_track_no) {
          this.$message({
            message: this.lang.shipping_status + ' ' + this.lang.required,
            type: 'error'
          })
          this.statusOrder = this.openOrderData.status
        } else {
          this.handleUpdateStatus()
        }
      } else {
        this.handleUpdateStatus()
      }
    },
    handleUpdateStatus() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
        status: this.statusOrder,
        order_id: this.openOrderData.id
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'openorder/updatestatus'),
        headers: headers,
        data: data
      })
        .then(response => {
          this.openOrderData = response.data.data
          this.$message({
            message: 'Success',
            type: 'success'
          })
          this.loading = false
          this.getDetailData()
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.statusOrder = this.openOrderData.status
          this.loading = false
        })
    },

    handleEditNew (block) {
      if (block === 'customer') {
        this.formCustomer.customerId = this.openOrderData.customer_id
        this.formCustomer.customerName = this.openOrderData.customer_name
        this.formCustomer.customerEmail = this.openOrderData.customer_email
        this.formCustomer.customerPhone = this.openOrderData.customer_phone
        // this.isEditing.customer = true
        this.dialogEditCustomer = true
      }
    },

    handleEdit(block) {
      if (block === 'customer') {
        this.formCustomer.customerId = this.openOrderData.customer_id
        this.formCustomer.customerName = this.openOrderData.customer_name
        this.formCustomer.customerEmail = this.openOrderData.customer_email
        this.formCustomer.customerPhone = this.openOrderData.customer_phone
        this.isEditing.customer = true
      } else if (block === 'shippingto') {
        this.isEditing.shippingto = true
        this.getStateCountry()
        this.getShippingCity()
        this.getSubDistrict()
      } else if (block === 'status') {
        this.formShippingStatus.dateShipping = this.openOrderData.shipping_date
        this.formShippingStatus.noTracking = this.openOrderData.shipping_track_no
        this.isEditing.status = true
      } else if (block === 'dropship') {
        this.formDropShip.dropShipName = this.openOrderData.drop_ship_store_name
        this.formDropShip.dropShipSender = this.openOrderData.drop_ship_sender_name
        this.formDropShip.dropShipPhone = this.openOrderData.drop_ship_contact_phone
        this.isEditing.dropship = true
      } else if (block === 'notes') {
        this.isEditing.notes = true
      } else if (block === 'invoice') {
        this.isEditing.invoice = true
      } else if (block === 'server') {
        this.isEditing.server = true
      } else if (block === 'due_date') {
        this.isEditing.due_date = true
      }
    },
    cancelEdit(block) {
      if (block === 'customer') {
        this.isEditing.customer = false
        this.dialogEditCustomer = false
      } else if (block === 'shippingto') {
        this.isEditing.shippingto = false
      } else if (block === 'status') {
        this.isEditing.status = false
      } else if (block === 'dropship') {
        this.isEditing.dropship = false
      } else if (block === 'notes') {
        this.isEditing.notes = false
      } else if (block === 'invoice') {
        this.isEditing.invoice = false
      } else if (block === 'server') {
        this.isEditing.server = false
      } else if (block === 'due_date') {
        this.isEditing.due_date = false
      }
    },
    saveEdit(block) {
      if (block === 'customer') {
        let url = baseApi(this.selectedStore.url_id, this.langId, 'openorder/updatecustomer')
        let data = {
          customer_id: this.formCustomer.customerId,
          order_id: this.openOrderData.id
        }
        this.updateData(block, url, data)
      } else if (block === 'shippingto') {
        // let url = BASE_API + 'openorder/updateshippingaddress'
        let url = baseApi(this.selectedStore.url_id, this.langId, 'openorder/updateshippingaddress')
        let data = {
          order_id: this.openOrderData.id,
          shipping_to: this.openOrderData.shipping_to,
          shipping_address: this.openOrderData.shipping_address,
          shipping_country_id: this.openOrderData.shipping_country_id,
          shipping_state_id: this.openOrderData.shipping_state_id,
          shipping_city_id: this.openOrderData.shipping_city_id,
          shipping_subdistrict_id: this.openOrderData.shipping_subdistrict_id,
          shipping_postal_code: this.openOrderData.shipping_postal_code,
          shipping_phone: this.openOrderData.shipping_phone
        }
        this.updateData(block, url, data)
      } else if (block === 'status') {
        this.$refs[block].validate(valid => {
          if (valid) {
            // let url = BASE_API + 'openorder/updateShippingStatus'
            let url = baseApi(this.selectedStore.url_id, this.langId, 'openorder/updateShippingStatus')
            let data = {
              order_id: this.openOrderData.id,
              shipping_date: this.formShippingStatus.dateShipping,
              shipping_track_no: this.formShippingStatus.noTracking
            }
            this.updateData(block, url, data)
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else if (block === 'dropship') {
        // let url = BASE_API + 'openorder/updateshippingaddress'
        let url = baseApi(this.selectedStore.url_id, this.langId, 'openorder/updateshippingaddress')
        let data = {
          drop_ship_store_name: this.formDropShip.dropShipName,
          drop_ship_sender_name: this.formDropShip.dropShipSender,
          drop_ship_contact_phone: this.formDropShip.dropShipPhone,
          order_id: this.openOrderData.id,
          shipping_to: this.openOrderData.shipping_to,
          shipping_address: this.openOrderData.shipping_address,
          shipping_country_id: this.openOrderData.shipping_country_id,
          shipping_state_id: this.openOrderData.shipping_state_id,
          shipping_city_id: this.openOrderData.shipping_city_id,
          shipping_subdistrict_id: this.openOrderData.shipping_subdistrict_id,
          shipping_postal_code: this.openOrderData.shipping_postal_code,
          shipping_phone: this.openOrderData.shipping_phone
        }
        this.updateData(block, url, data)
      } else if (block === 'notes') {
        // let url = BASE_API + 'openorder/updateAttr'
        let url = baseApi(this.selectedStore.url_id, this.langId, 'openorder/updateAttr')
        let data = {
          order_id: this.openOrderData.id,
          name: 'notes',
          value: this.openOrderData.notes
        }
        this.updateData(block, url, data)
      } else if (block === 'invoice') {
        // let url = BASE_API + 'openorder/updateAttr'
        let url = baseApi(this.selectedStore.url_id, this.langId, 'openorder/updateAttr')
        let data = {
          order_id: this.openOrderData.id,
          name: 'invoice_notes',
          value: this.openOrderData.invoice_notes
        }
        this.updateData(block, url, data)
      } else if (block === 'server') {
        let url = baseApi(this.selectedStore.url_id, this.langId, 'openorder/updateAttr')
        let data = {
          order_id: this.openOrderData.id,
          name: 'serve_by_id',
          value: this.openOrderData.serve_by_id
        }
        this.updateData(block, url, data)
      } else if (block === 'due_date') {
        let url = baseApi(this.selectedStore.url_id, this.langId, 'openorder/updateAttr')
        let data = {
          order_id: this.openOrderData.id,
          name: 'payment_due_date',
          value: this.openOrderData.payment_due_date
        }
        this.updateData(block, url, data)
      }
    },
    editChangeCountry(item) {
      this.openOrderData.shipping_country_id = item.id
      this.openOrderData.shipping_country_name = item.name
      if (item.id === 'ID') {
        this.openOrderData.shipping_state_name = ''
        this.getStateCountry()
      } else {
        this.openOrderData.shipping_city_id = ''
        this.openOrderData.shipping_state_id = ''
        this.openOrderData.shipping_subdistrict_id = ''
        this.openOrderData.shipping_postal_code = ''
      }
    },
    getStateCountry() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search_column: 'country_id',
        search_operator: '=',
        search_text: this.openOrderData.shipping_country_id,
        per_page: 1000
      }
      axios({
        method: 'GET',
        // url: BASE_API + 'state',
        url: baseApi(this.selectedStore.url_id, this.langId, 'state'),
        headers: headers,
        params: params
      })
        .then(response => {
          this.stateCountry = response.data.data
          this.loading = false
        })
        .catch(() => {
          this.stateCountry = []
          this.loading = false
        })
    },
    editProvince(item) {
      this.openOrderData.shipping_state_id = item.id
      this.openOrderData.shipping_state_name = item.name
      this.openOrderData.shipping_city_name = ''
      this.getShippingCity()
    },
    getShippingCity() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search_column: 'state_id',
        search_operator: '=',
        search_text: this.openOrderData.shipping_state_id,
        per_page: 1000
      }
      axios({
        method: 'GET',
        // url: BASE_API + 'shippingcity',
        url: baseApi(this.selectedStore.url_id, this.langId, 'shippingcity'),
        headers: headers,
        params: params
      })
        .then(response => {
          this.shippingCity = response.data.data
          this.loading = false
        })
        .catch(() => {
          this.shippingCity = []
          this.loading = false
        })
    },
    editCity(item) {
      this.openOrderData.shipping_city_id = item.id
      this.openOrderData.shipping_city_name = item.city
      this.openOrderData.shipping_subdistrict_name = ''
      this.getSubDistrict()
    },
    getSubDistrict() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search_column: 'city_id',
        search_operator: '=',
        search_text: this.openOrderData.shipping_city_id,
        per_page: 100
      }
      axios({
        method: 'GET',
        // url: BASE_API + 'shippingcitysubdistrict',
        url: baseApi(this.selectedStore.url_id, this.langId, 'shippingcitysubdistrict'),
        headers: headers,
        params: params
      })
        .then(response => {
          this.subDistrict = response.data.data
          this.loading = false
        })
        .catch(() => {
          this.subDistrict = []
          this.loading = false
        })
    },
    editSubDistrict(item) {
      this.openOrderData.shipping_subdistrict_id = item.id
      this.openOrderData.shipping_subdistrict_name = item.name
    },
    updateData(block, url, data) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: url,
        headers: headers,
        data: data
      })
        .then(response => {
          // this.result = response.data
          this.openOrderData = response.data.data
          this.labelDate = this.openOrderData.fshipping_date
          this.$message({
            message: 'Success',
            type: 'success'
          })
          this.loading = false
          this.cancelEdit(block)
          this.getDetailData()
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.loading = false
          this.getDetailData()
        })
    },
    changeDateHeader(val) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
        order_id: this.openOrderData.id,
        name: 'order_date',
        value: val
      }
      axios({
        method: 'POST',
        // url: BASE_API + 'openorder/updateAttr',
        url: baseApi(this.selectedStore.url_id, this.langId, 'openorder/updateAttr'),
        headers: headers,
        data: data
      })
        .then(response => {
          // this.result = response.data
          this.openOrderData = response.data.data
          this.$message({
            message: 'Success',
            type: 'success'
          })
          this.loading = false
          this.getDetailData()
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.loading = false
        })
    },
    timeChange(val) {
      this.formShippingStatus.dateShipping = val
    },
    getCustomerSuggest(queryString, callback) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search: queryString
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'customer'),
        headers: headers,
        params: params
      })
        .then(response => {
          for (let i of response.data.data) {
            i.value = i.customer_text
          }
          this.suggestData = response.data.data
          callback(this.suggestData)
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        })
    },
    handleSelectCustomer(data) {
      this.formCustomer.customerId = data.id
      this.formCustomer.customerEmail = data.email
      this.formCustomer.customerPhone = data.phone
      this.formCustomer.customerName = data.name
    },
    editHeaderButton() {
      // if (this.userRole.role_id !== 'OW' && this.openOrderData.order_source === 'P' && this.openOrderData.status === 'Z') {
      //   this.$notify({
      //     type: 'warning',
      //     message: this.$lang[this.langId].note_block_edit_trx_pos
      //   })
      // } else {
      //   this.showEdit = true
      // }
      if (!this.selectedStore.can_edit_complete_order && this.openOrderData.order_source === 'P' && this.openOrderData.status === 'Z') {
        this.$notify({
          type: 'warning',
          message: this.$lang[this.langId].note_block_edit_trx_pos
        })
      } else {
        this.showEdit = true
      }
    },
    backHandle() {
      if (this.repeat) {
        if (this.$route.query.path === 'salesdetails') {
          this.$router.push({ path: '/reports/sales?path=salesdetails' })
        } else if (this.$route.query.path === 'salesitemsbydate') {
          this.$router.push({ path: '/reports/sales?path=salesitemsbydate' })
        } else if (this.$route.query.path === 'salesitemsbybrands') {
          this.$router.push({ path: '/reports/sales?path=salesitemsbybrands' })
        } else if (this.$route.query.path === 'salesdetailsbydatetime') {
          this.$router.push({ path: '/reports/sales?path=salesdetailsbydatetime' })
        } else if (this.$route.query.path === 'salesitemdiscountsbydate') {
          this.$router.push({ path: '/reports/sales?path=salesitemdiscountsbydate' })
        } else if (this.$route.query.path === 'salesitemaddonsbydate') {
          this.$router.push({ path: '/reports/sales?path=salesitemaddonsbydate' })
        } else if (this.$route.query.path === 'creditsalesdetails') {
          this.$router.push({ path: '/reports/sales?path=creditsalesdetails' })
        } else if (this.$route.query.path === 'creditpayment') {
          this.$router.push({ path: '/reports/sales?path=creditpayment' })
        } else if (this.$route.query.path === 'productsalesbycategory') {
          this.$router.push({ path: '/reports/products?path=productsalesbycategory' })
        } else if (this.$route.query.path === 'salesdetailsbyshift') {
          this.$router.push({ path: '/reports/shifts?path=salesdetailsbyshift' })
        } else if (this.$route.query.path === 'salesitemaddonsbydateshift') {
          this.$router.push({ path: '/reports/shifts?path=salesitemaddonsbydateshift' })
        } else if (this.$route.query.path === 'outstandingpayment') {
          this.$router.push({ path: '/reports/payments?path=outstandingpayment' })
        }
      } else {
        if (this.routeName === 'Open Order Detail') {
          this.$router.push({ path: '/sales/openorder' })
        } else if (this.routeName === 'Complete Order Detail') {
          this.$router.push({ path: '/sales/completeorder' })
        } else if (this.routeName === 'Integrate Jurnal.ID'){
          this.$router.push({name: 'Integrate Jurnal.ID', 
            params: {lastParams: this.$route.query.lastParams, labelDate: this.$route.query.labelDate},
            query: {menu: 'general', tab: this.$route.query.tab}}
          )
        }
      }
    },

    updatePayment(data) {
      this.openOrderData = data
      this.openOrderData.is_paid = 1
      this.loading = false
      let url = baseApi(this.selectedStore.url_id, this.langId, 'openorder/' + this.$route.params.id)
      this.getDetailData(url)
    },

    getEmailNotify() {
     let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'emailnotify'),
        headers: headers
      }).then(response => {
        this.emailNotify = response.data.data
      })
      .catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    getSmsNotify() {
     let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'smsnotify'),
        headers: headers
      }).then(response => {
        this.smsNotify = response.data.data
      })
      .catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    handleSentEmail () {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
        order_id: this.openOrderData.id,
        email_type_id: this.emailRadioValue,
        type: 'O'
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'allorder/sendemail'),
        headers: headers,
        data: data
      }).then(response => {
        this.emailDialog = false
        this.$notify({
          type: 'success',
          message: response.data.message
        })
      })
      .catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    handleSentSms () {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
        order_id: this.openOrderData.id,
        sms_type_id: this.smsRadioValue
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'openorder/sendsmsorder'),
        headers: headers,
        data: data
      }).then(response => {
        this.smsDialog = false
        this.$notify({
          type: 'success',
          message: response.data.message
        })
      })
      .catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    handleSentWa () {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
        order_id: this.openOrderData.id,
        sms_type_id: this.waRadioValue
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'openorder/sendwaorder'),
        headers: headers,
        data: data
      }).then(response => {
        this.waDialog = false
        this.$notify({
          type: 'success',
          message: 'Success'
        })
        this.handleShowWA (response.data.data.link)
      })
      .catch(error => {
        console.log(error)
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    handleShiftEnter (evt) {
      console.log(evt.type)
      if (evt.keyCode == 13 && evt.shiftKey) {
        if (evt.type == "keyup") {
            this.saveEdit('notes')
        }
        evt.preventDefault();
      }
    },

    refreshData (response) {
      // console.log('trace')
      this.openOrderData = { ...response}
      this.labelDate = this.openOrderData.fshipping_date
      this.switchValue = this.openOrderData.is_paid
      this.statusOrder = this.openOrderData.status
      this.loading = false
      this.splitDate(this.openOrderData.order_date, this.labelDate)
    },

    handleShowWA(link) {
      window.open(link)
      // this.getLocalization('id')
      type="default"
    },

    cancelStatusFromBtn () {
      this.statusOrder = 'X'
      this.handleUpdateStatus()
    },

    stepClasses(index) {
      let result = `progress__step progress__step--${index + 1} `
      if (this.currentStep && this.currentStep.label === 'complete' ||
          index < this.steps.indexOf(this.currentStep)) {
        return result += 'progress__step--complete'
      }
      if (index === this.steps.indexOf(this.currentStep)) {
        return result += 'progress__step--active'
      }
      return result
    },

    nextStep(next=true) {
      if (this.currentStep < this.setep.length) {
        this.currentStep ++
      } else {
        this.currentStep = 0
      }
      // const steps = this.steps
      // const currentStep = this.currentStep
      // const currentIndex = steps.indexOf(currentStep)
      
      // // handle back
      // if (!next) {
      //   if (currentStep && currentStep.label === 'complete') {
      //     return this.currentStep = steps[steps.length - 1]           
      //   }

      //   if (steps[currentIndex - 1]) {
      //     return this.currentStep = steps[currentIndex - 1] 
      //   }

      //   return this.currentStep = { "label": "start" }   
      // }
      
      // // handle next
      // if (this.currentStep && this.currentStep.label === 'complete') {
      //   return this.currentStep = { "label": "start" }
      // }
      
      // if (steps[currentIndex + 1]) {
      //   return this.currentStep = steps[currentIndex + 1]
      // }

      // this.currentStep = { "label": "complete" }   
    },

    handleFindDriver () {
      // this.loadingFindDriver = true
      let dataId = this.openOrderData.id
      findDriver(dataId).then(response => {
        this.$notify({
          type: 'success',
          message: 'Success'
        })
        // this.loadingFindDriver = false
        let url = baseApi(this.selectedStore.url_id, this.langId, 'openorder/' + this.$route.params.id)
        this.getDetailData(url)
      }).catch(error => {
        console.log(error)
        // this.loadingFindDriver = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    handleLogsDriver () {
      // this.loadingFindDriver = true
      let dataId = this.openOrderData.id
      logsDriver(dataId).then(response => {
        this.steps = []
        response.data.data.map(i => {
          this.steps.push(
            {
              label: i.fstatus,
              icon: 'icon-truck-new-white'
            }
          )
        })
        // this.loadingFindDriver = false
      }).catch(error => {
        console.log(error)
        // this.loadingFindDriver = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    handleDropdownSection (data) {
      if (data === 'tracking') {
        window.open(this.openOrderData.shipping_log.gosend.detail.live_tracking_url)
      }
    },

    refreshOrderGosend () {
      console.log('gosend', this.openOrderData.shipping_courier_id)
      if (this.openOrderData && this.openOrderData.shipping_courier_id === 'GSN' && this.openOrderData.shipping_log.gosend.can_booking === 0) {
        let url = baseApi(this.selectedStore.url_id, this.langId, 'openorder/' + this.$route.params.id)
        this.getDetailData(url)
      }
    },

    searchCustomer(query) {
      let params = {
        search: query
      }
      this.loadingCustomer = true
      fetchCustomer(params).then(response => {
          this.dataCustomer = response.data.data
          this.loadingCustomer = false
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    handleChangeCustomer(data) {
      console.log('customer', data)
      if (data && data.id) {
        this.formCustomer = {
          customerEmail: data.email,
          customerName: data.name,
          customerId: data.id,
          customerPhone: data.phone
        }
      }
    },

    removeItemCustomer () {
      this.formCustomer = {
        customerName: '',
        customerId: null,
        customerEmail: '',
        customerPhone: ''
      }
    },

    searchCustomerTypes(query, callback) {
      //
      this.searchingCustomerTypes = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search: query
      }
      if (query.length > 0) {
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'customertype'),
          headers: headers,
          params: params
        }).then(response => {
          for (let i of response.data.data) {
            i.value = i.name
            i.id = i.id
          }
          this.searchResultCustomerTypes = response.data.data
          callback(this.searchResultCustomerTypes)
          this.searchingCustomerTypes = false
          // this.searchResultCustomerTypes = response.data.data.map(item => {
          //   return item
          // })
        }).catch(() => {
          this.searchingCustomerTypes = false
          this.searchResultCustomerTypes = []
        })
      }
    },

    handleSelected(val) {
      this.tempCustomer.customer_type_id = val.id
    },

    labelAvatar (name) {
      // return name.match(/(\b\S)?/g).join("").toUpperCase()
      return name.match(/(^\S\S?|\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase()
    },

    getPhone (value) {
      this.tempCustomer.customer_phone = value.formattedNumber
    },

    handleAddNewCustomer () {
      this.loadingUpdateCustomer = true
      this.tempCustomer.order_id = this.openOrderData.id
      updateCustomerOrder(this.tempCustomer).then(response => {
        this.openOrderData = response.data.data
        this.labelDate = this.openOrderData.fshipping_date
        this.loadingUpdateCustomer = false
        this.visibleCustomerNew = false
        this.dialogEditCustomer = false
        this.getDetailData()
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loadingUpdateCustomer = false
        // this.getDetailData()
      })
    },

    getEstimationGosenDeliver (data) {
      let time1 = data.split('-')[0]
      let time2 = data.split('-')[1]


      return moment.unix(time1).format('HH:mm:ss') + ' - ' + moment.unix(time2).format('HH:mm:ss')
    },

    attachmentUploadProgress() {
      this.loadingUploadAttachment = true
    },

    attachmentUploadSuccess(response) {
      this.loadingUploadAttachment = false
      this.getRoute(this.selectRoute, this.selectedStore)
      if (response.error === 0) {
      }
    },

    attachmentUploadError(error, file) {
      const errorJson = JSON.parse(error.message)
      this.loadingUploadAttachment = false
      this.$notify({
        type: 'error',
        title: errorJson.error.message,
        message: errorJson.error.error
      })
    },

    downloadAttachment(row){
      if(row.is_image === 1){
        window.open(row.photo_lg, '_blank').focus();
      }
    },

    deleteAttachment(row){
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/sales/attachment/'+ row.id),
        headers: headers
      })
        .then(response => {

          this.$message({
            message: 'Success',
            type: 'success'
          })
          this.loading = false
          this.getRoute(this.selectRoute, this.selectedStore)
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.loading = false
          this.getRoute(this.selectRoute, this.selectedStore)
        })
    }
  },

  beforeMount() {
    if (!this.$route.query) {
      this.handleCustomPermissionSinglePage(this.customRPermis, 'show')
    }
  },

  mounted() {
    if (this.$route.name === 'Complete Order Detail') {
      this.customRPermis = 'sales/closedorders'
    } else if (this.$route.name === 'Return Order Detail') {
      this.customRPermis = 'sales/salesreturns'
    } else if (this.$route.name === 'Cancel Order Detail') {
      this.customRPermis = 'sales/cancelledorders'
    }

    this.getRoute(this.selectRoute, this.selectedStore)
    this.getEmailNotify()
    this.getSmsNotify()
    setInterval(() => {
      if (this.openOrderData.status !== 'Z' && this.openOrderData.shipping_courier_id === 'GSN' && this.openOrderData.shipping_log.gosend.can_booking === 0) {
        this.refreshOrderGosend()
      }
    }, 35000)
  }
}
</script>
