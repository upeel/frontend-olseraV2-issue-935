<template>
  <div v-loading="loading" class="sales-detail">
    <section class="order-detail">
      <el-card class="box-card with-back-button">
        <div class="card-body">
          <el-button
            icon="el-icon-arrow-left"
            class="back-button"
            @click="backHandle"/>

          <div class="flex-container flex-container--wrap">
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
                  v-if="visibleEdit"
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
                <div class="mb-4 mr-4">
                  <el-select
                    v-model="statusOrder"
                    :placeholder="lang.status"
                    style="max-width: 120px;"
                    popper-class="el-select-statusorder"
                    @change="handleChangeStatus(statusOrder)">
                    <el-option
                      v-for="item in statusSelect"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      :disabled="item.disabled"
                    />
                  </el-select>
                </div>

                <div class="mb-4 mr-4">
                  <el-button
                    icon="el-icon-message"
                    @click="emailDialog = true">
                    {{ lang.email }}
                  </el-button>

                  <el-button
                    :disabled="methodFeatureNameIsHidden('struk-sms')"
                    icon="el-icon-mobile-phone"
                    style="margin-left: 0;"
                    @click="smsDialog = true">
                    {{ $lang[langId].sms }}
                  </el-button>

                  <el-button
                    :disabled="methodFeatureNameIsHidden('struk-wa')"
                    style="margin-left: 0;"
                    @click="waDialog = true">
                    <svg-icon icon-class="ico-whatsapp" /> {{ $lang[langId].whatsapp }}
                  </el-button>
                </div>

                <div class="mb-4 mr-4">
                  <el-dropdown class="drop-complete" @command="handleDownload">
                    <el-button class="el-dropdown-link" icon="el-icon-printer"></el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        v-for="(command, index) in downloadSelect"
                        :key="index"
                        :command="index">
                        {{command.label}}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>

                <div class="mb-4 mr-4">
                  <span>{{ lang.paid }}?</span>
                  <el-switch v-model="switchValue" :disabled="computedAccess" :active-value="1" :inactive-value="0" @change="handleSwitchPayment" />
                  <span v-if="openOrderData.is_paid === 0">{{ lang.not_yet }}</span>
                  <span v-if="openOrderData.is_paid === 1">{{ $lang[langId].done }}</span>
                </div>

                <el-date-picker
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
                />
              </div>
            </div>

            <div v-if="!visibleEdit">
              <el-dropdown class="drop-complete" @command="handleDownloadEdit">
                <el-button class="el-dropdown-link" icon="el-icon-printer"></el-button>
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
      </el-card>

      <el-row :gutter="4" class="content-above">
        <el-col :md="12">
          <el-card class="box-card">
            <div slot="header" class="flex-container flex-container--wrap">
              <h3 class="box-title">{{ lang.customer }}</h3>
              <div v-if="showEdit" class="pull-right">
                <el-button size="mini" type="text" v-if="isEditing.customer" @click="cancelEdit('customer')">{{ lang.cancel }}</el-button>
                <el-button size="mini" type="success" v-if="isEditing.customer" @click="saveEdit('customer')">{{ lang.save }}</el-button>
                <el-button size="mini" type="primary" v-if="!isEditing.customer" :disabled="computedAccess" @click="handleEdit('customer')" icon="el-icon-edit">
                  {{ lang.edit }}
                </el-button>
              </div>
            </div>
            <div class="card-body">
              <ul class="list-unstyled mb-8--list mb-0--p">
                <li>
                  <p class="color-info">{{ lang.name }}</p>
                  <div v-if="!isEditing.customer">
                    <h5 v-if="!openOrderData.customer_name">-</h5>
                    <h5 v-else>{{ openOrderData.customer_name }}</h5>
                  </div>
                  <div v-else>
                    <!-- <el-input v-model="openOrderData.customer_name"></el-input> -->
                    <el-autocomplete @select="handleSelectCustomer" v-model="formCustomer.customerName" :fetch-suggestions="getCustomerSuggest"
                      :debounce="autoCompleteStartOn" :placeholder="lang.search+' '+lang.customer" clearable>
                  </el-autocomplete>
                  </div>
                </li>
                <li>
                  <p class="color-info">{{ lang.email }}</p>
                  <div v-if="!isEditing.customer">
                    <h5 v-if="!openOrderData.customer_email">-</h5>
                    <h5 v-else>{{ openOrderData.customer_email }}</h5>
                  </div>
                  <div v-else>
                    <el-input v-model="formCustomer.customerEmail" disabled></el-input>
                  </div>
                </li>
                <li>
                  <p class="color-info">{{ lang.phone }}</p>
                  <div v-if="!isEditing.customer">
                    <h5 v-if="!openOrderData.customer_phone">-</h5>
                    <h5 v-else>{{ openOrderData.customer_phone }}</h5>
                  </div>
                  <div v-else>
                    <el-input v-model="formCustomer.customerPhone" disabled></el-input>
                  </div>
                </li>
              </ul>
            </div>
          </el-card>
        </el-col>

        <el-col :md="12" class="shipping">
          <el-card class="box-card" v-loading="loadingElement">
            <div slot="header" class="flex-container flex-container--wrap">
              <h3 class="box-title">{{ lang.shipping_to }}</h3>
              <div v-if="showEdit" class="pull-right">
                <el-button size="mini" type="text" v-if="isEditing.shippingto" @click="cancelEdit('shippingto')">{{ lang.cancel }}</el-button>
                <el-button size="mini" type="success" v-if="isEditing.shippingto" @click="saveEdit('shippingto')">{{ lang.save }}</el-button>
                <el-button size="mini" type="primary" v-if="!isEditing.shippingto" :disabled="computedAccess" @click="handleEdit('shippingto')" icon="el-icon-edit">
                  {{ lang.edit }}
                </el-button>
              </div>
            </div>
            <div class="card-body">
              <ul class="list-unstyled mb-8--list mb-0--p">
                <li>
                  <p class="color-info ">{{ lang.name }}</p>
                  <div v-if="!isEditing.shippingto">
                    <h5 v-if="!openOrderData.shipping_to">-</h5>
                    <h5 v-else>{{ openOrderData.shipping_to }}</h5>
                  </div>
                  <div v-else>
                    <el-input v-model="openOrderData.shipping_to"></el-input>
                  </div>
                </li>
                <li>
                  <p class="color-info ">{{ lang.address }}</p>
                  <div v-if="!isEditing.shippingto">
                    <h5 v-if="!openOrderData.shipping_address">-</h5>
                    <h5 v-else>{{ openOrderData.shipping_address }}</h5>
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
                  <div v-else>
                    <el-input v-model="openOrderData.shipping_address" :placeholder="$lang[langId].please_input+lang.address"></el-input>
                  </div>
                </li>
                <li v-if="isEditing.shippingto">
                  <p class="color-info ">{{ lang.country }}</p>
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
                </li>

                <template v-if="openOrderData.shipping_country_id === 'ID'">
                  <li v-if="isEditing.shippingto">
                  <p class="color-info ">{{ lang.province }}</p>
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
                </li>
                <li v-if="isEditing.shippingto">
                  <p class="color-info ">{{ lang.city }}</p>
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
                </li>
                <li v-if="isEditing.shippingto">
                  <p class="color-info ">{{ lang.district }}</p>
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
                </li>
                <li v-if="isEditing.shippingto">
                  <p class="color-info ">{{ lang.postal_code }}</p>
                  <el-input v-model="openOrderData.shipping_postal_code" type="number" :placeholder="$lang[langId].input_number"></el-input>
                </li>
                </template>

                <li>
                  <p class="color-info ">{{ lang.phone }}</p>
                  <div v-if="!isEditing.shippingto">
                    <h5 v-if="!openOrderData.shipping_phone">-</h5>
                    <h5 v-else>{{ openOrderData.shipping_phone }}</h5>
                  </div>
                  <div v-else>
                    <el-input v-model="openOrderData.shipping_phone" :placeholder="$lang[langId].input_number"></el-input>
                  </div>
                </li>
              </ul>
            </div>
          </el-card>
        </el-col>

        <el-col :md="12" class="status">
          <el-card class="box-card">
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
                <el-button size="mini" type="primary" v-if="!isEditing.status" :disabled="computedAccess" @click="handleEdit('status')" icon="el-icon-edit">
                  {{ lang.edit }}
                </el-button>
              </div>
            </div>
            <div class="card-body">
              <ul class="list-unstyled mb-8--list mb-0--p">
                <el-form :model="formShippingStatus" ref="status">
                  <li>
                    <p class=" color-info">{{ lang.shipping_courier }}</p>
                    <div>
                      <h5 v-if="!openOrderData.shipping_courier_name">-</h5>
                      <h5 v-else>{{ openOrderData.shipping_courier_name }}</h5>
                    </div>
                  </li>
                  <li>
                    <p class=" color-info">{{ lang.shipping_service_type }}</p>
                    <div>
                      <h5 v-if="!openOrderData.shipping_service_type">-</h5>
                      <h5 v-else>{{ openOrderData.shipping_service_type }}</h5>
                    </div>
                  </li>
                  <li>
                    <p class=" color-info">{{ lang.shipping_date }}</p>
                    <div v-if="!isEditing.status">
                      <h5 v-if="!openOrderData.fshipping_date">-</h5>
                      <h5 v-else>{{ labelDate }}</h5>
                    </div>
                    <div v-else>
                      <el-form-item
                        prop="dateShipping"
                        :rules="[
                          { required: true, message: 'Please input date', trigger: 'change' }
                        ]"
                      >
                        <el-date-picker
                          v-model="formShippingStatus.dateShipping"
                          :placeholder="$lang[langId].pick_a_day"
                          :clearable="false"
                          type="date"
                          format="dd-MM-yyyy"
                          value-format="yyyy-MM-dd"
                          @change="timeChange"
                        />
                      </el-form-item>
                    </div>
                  </li>
                  <li>
                    <p class="color-info ">{{ lang.tracking_no }}</p>
                    <div v-if="!isEditing.status">
                      <h5 v-if="!openOrderData.shipping_track_no">-</h5>
                      <h5 v-else>{{ openOrderData.shipping_track_no }}</h5>
                    </div>
                    <div v-else>
                      <el-form-item prop="noTracking" :rules="[
                          { required: true, message: 'Please input no tracking', trigger: 'blur' },
                        ]">
                        <el-input v-model="formShippingStatus.noTracking" type="text" :placeholder="$lang[langId].input_code" clearable></el-input>
                      </el-form-item>
                    </div>
                  </li>
                </el-form>
              </ul>
            </div>
          </el-card>
        </el-col>

        <el-col :md="12">
          <el-card class="box-card">
            <div slot="header" class="flex-container flex-container--wrap">
              <h3 class="box-title">{{ lang.drop_ship }}</h3>
              <div v-if="showEdit" class="pull-right">
                <el-button size="mini" type="text" v-if="isEditing.dropship" @click="cancelEdit('dropship')">{{ lang.cancel }}</el-button>
                <el-button size="mini" type="success" v-if="isEditing.dropship" @click="saveEdit('dropship')">{{ lang.save }}</el-button>
                <el-button size="mini" type="primary" v-if="!isEditing.dropship" :disabled="computedAccess" @click="handleEdit('dropship')" icon="el-icon-edit">
                  {{ lang.edit }}
                </el-button>
              </div>
            </div>
            <div class="card-body">
              <ul class="list-unstyled mb-8--list mb-0--p">
                <li>
                  <p class="color-info ">{{ lang.store_name }}</p>
                  <div v-if="!isEditing.dropship">
                    <h5 v-if="!openOrderData.drop_ship_store_name">-</h5>
                    <h5 v-else>{{ openOrderData.drop_ship_store_name }}</h5>
                  </div>
                  <div v-else>
                    <el-input v-model="formDropShip.dropShipName"></el-input>
                  </div>
                </li>
                <li>
                  <p class="color-info ">{{ lang.sender }}</p>
                  <div v-if="!isEditing.dropship">
                    <h5 v-if="!openOrderData.drop_ship_sender_name">-</h5>
                    <h5 v-else>{{ openOrderData.drop_ship_sender_name }}</h5>
                  </div>
                  <div v-else>
                    <el-input v-model="formDropShip.dropShipSender"></el-input>
                  </div>
                </li>
                <li>
                  <p class="color-info ">{{ lang.phone }}</p>
                  <div v-if="!isEditing.dropship">
                    <h5 v-if="!openOrderData.drop_ship_contact_phone">-</h5>
                    <h5 v-else>{{ openOrderData.drop_ship_contact_phone }}</h5>
                  </div>
                  <div v-else>
                    <el-input v-model="formDropShip.dropShipPhone"></el-input>
                  </div>
                </li>
              </ul>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <order-table
        :data-table="openOrderData"
        :edit-show="showEdit"
        @save-payment="updatePayment"
        @refresh="refreshData"
      />

      <el-row :gutter="5">
        <el-col :md="8">
          <el-card class="box-card">
            <div slot="header" class="flex-container flex-container--wrap">
              <h3 class="box-title">{{ lang.payment_due_date }}</h3>
              <div v-if="showEdit" class="pull-right">
                <el-button type="text" v-if="isEditing.due_date" size="mini" @click="cancelEdit('due_date')">{{ lang.cancel }}</el-button>
                <el-button type="success" v-if="isEditing.due_date" size="mini" @click="saveEdit('due_date')">{{ lang.save }}</el-button>
                <el-button type="primary" v-if="!isEditing.due_date" size="mini" :disabled="computedAccess" @click="handleEdit('due_date')" icon="el-icon-edit">
                  {{ lang.edit }}
                </el-button>
              </div>
            </div>
            <div class="card-body">
              <div v-if="!isEditing.due_date">
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
        </el-col>

        <el-col :md="8">
          <el-card class="box-card">
            <div slot="header" class="flex-container flex-container--wrap">
              <h3 class="box-title">{{ lang.notes }}</h3>
              <div v-if="showEdit" class="pull-right">
                <el-button type="text" v-if="isEditing.notes" size="mini" @click="cancelEdit('notes')">{{ lang.cancel }}</el-button>
                <el-button type="success" v-if="isEditing.notes" size="mini" @click="saveEdit('notes')">{{ lang.save }}</el-button>
                <el-button type="primary" v-if="!isEditing.notes" size="mini" :disabled="computedAccess" @click="handleEdit('notes')" icon="el-icon-edit">
                  {{ lang.edit }}
                </el-button>
              </div>
            </div>
            <div class="card-body">
              <div v-if="!isEditing.notes">
                <p v-if="!openOrderData.notes">{{ $lang[langId].there_is_no }}</p>
                <p v-else class="show-white-space">{{openOrderData.notes}}</p>
              </div>
              <div v-else>
                <el-input type="textarea" autosize v-model="openOrderData.notes" @keyup.native.enter="handleShiftEnter"></el-input>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :md="8" class="invoice-footer">
          <el-card class="box-card">
            <div slot="header" class="flex-container flex-container--wrap">
              <h3 class="box-title">{{ lang.invoice }} {{ lang.footer }}</h3>
              <div v-if="showEdit" class="pull-right">
                <el-button type="text" v-if="isEditing.invoice" size="mini" @click="cancelEdit('invoice')">{{ lang.cancel }}</el-button>
                <el-button type="success" v-if="isEditing.invoice" size="mini" @click="saveEdit('invoice')">{{ lang.save }}</el-button>
                <el-button type="primary" v-if="!isEditing.invoice" size="mini" :disabled="computedAccess" @click="handleEdit('invoice')" icon="el-icon-edit">
                  {{ lang.edit }}
                </el-button>
              </div>
            </div>
            <div class="card-body">
              <div v-if="!isEditing.invoice">
                <p v-if="!openOrderData.invoice_notes">{{ $lang[langId].there_is_no }}</p>
                <p class="invoice show-white-space">{{ openOrderData.invoice_notes }}</p>
                <p>{{ $lang[langId].info_cantact_our_support }} </p>
              </div>
              <div class="show-white-space" v-else>
                <el-input type="textarea" autosize v-model="openOrderData.invoice_notes"></el-input>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :md="8">
          <el-card class="box-card">
            <div slot="header" class="flex-container flex-container--wrap">
              <h3 class="box-title">{{ $lang[langId].server_pos }}</h3>
              <div v-if="showEdit" class="pull-right">
                <el-button type="text" v-if="isEditing.server" size="mini" @click="cancelEdit('server')">{{ lang.cancel }}</el-button>
                <el-button type="success" v-if="isEditing.server" size="mini" @click="saveEdit('server')">{{ lang.save }}</el-button>
                <el-button type="primary" v-if="!isEditing.server" size="mini" :disabled="computedAccess" @click="handleEdit('server')" icon="el-icon-edit">
                  {{ lang.edit }}
                </el-button>
              </div>
            </div>
            <div class="card-body">
              <div v-if="!isEditing.server">
                <p v-if="!openOrderData.serve_by_id"> - </p>
                <p v-else>{{ openOrderData.serve_by_name }}</p>
              </div>
              <div v-else>
                <el-select
                    v-model="openOrderData.serve_by_id"
                    :placeholder="lang.status"
                    style="max-width: 120px;">
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
        </el-col>
      </el-row>

      <el-row :gutter="5">
        <el-col :md="8">
          <el-card class="box-card">
            <div slot="header">
              <h3 class="box-title">Log</h3>
            </div>
            <div class="card-body">
              <div style="margin-bottom: 22px;">
                <h5>{{ lang.created_time }}</h5>
                <label>{{ openOrderData.created_by }}, {{ openOrderData.order_time }}</label>
              </div>
              <div v-if="openOrderData.translogs">
                <div v-for="item in openOrderData.translogs" :key="item.id">
                  <h5>{{ item.action }}</h5>
                  <label>{{ item.created_by }}, {{ item.action_time }}</label>
                </div>
              </div>
              <div>
                <h5>{{ lang.last_modified }}</h5>
                <label>{{ openOrderData.modified_by }}, {{ openOrderData.modified_time }}</label>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :md="16">
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
        </el-col>
      </el-row>
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
  </div>
</template>

<script>
// import { BASE_API, baseApi } from 'src/http-common'
import basicComputedMixin from '@/mixins/basicComputedMixin'
import { mixinHiddenFeatureByPlanType } from '@/mixins/mixinHiddenFeatureByPlanType'
import { baseApi } from 'src/http-common'
import axios from 'axios'
import OrderTable from './DetailTableOrder'
import moment from 'moment'
import LoadingComponent from 'vue-loading-overlay'

export default {
  name: 'DetailOrder',
  components: {
    OrderTable,
    LoadingComponent
  },

  mixins: [basicComputedMixin, mixinHiddenFeatureByPlanType],

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
          disabled: false
        },
        {
          value: 'A',
          label: this.$lang[this.$store.state.userStores.langId].has_confirm,
          disabled: false
        },
        {
          value: 'S',
          label: this.$lang[this.$store.state.userStores.langId].being_sent,
          disabled: false
        },
        {
          value: 'T',
          label: this.$lang[this.$store.state.userStores.langId].delivered,
          disabled: false
        },
        {
          value: 'Z',
          label: this.$lang[this.$store.state.userStores.langId].complete,
          disabled: false
        },
        {
          value: 'X',
          label: this.$lang[this.$store.state.userStores.langId].cancel,
          disabled: false
        }
      ],
      downloadSelect: [
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
          value: 'invoicepdf',
          label: this.$store.state.userStores.lang.invoice
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
    
    attachmentUploadImportUrl() {
      const url = baseApi(this.selectedStore.url_id, this.langId, 'account/sales/attachment')
      return url
    },
    computedUploadImportHeaders() {
      return {
        'authorization' : 'Bearer ' + this.token.access_token
      }
    }
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
        params.type = 2
      }
      if (file === 6) {
        params.url = 'packinglabelpdf'
        params.type = 3
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
          this.loading = false
        })
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
          this.$router.push({ path: '/reports/sales?path=salesdetails',
          query: {
            start_date: '15-01-2022',
            end_date: '15-01-2022'
          } })
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
    console.log('permit', this.$route)
    if (!this.$route.query) {
      this.handleCustomPermissionSinglePage(this.customRPermis, 'show')
    }
  },

  mounted() {
    this.getRoute(this.selectRoute, this.selectedStore)
    this.getEmailNotify()
    this.getSmsNotify()
  }
}
</script>
