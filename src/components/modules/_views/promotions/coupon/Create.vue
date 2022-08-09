<template>
  <div
    v-loading="loadings"
    class="box">
    <div class="box-header with-border create-product-header">
      <h4 class="box-title">{{ lang.add }} {{lang.discount_coupon}}</h4>
      <div class="pull-right">
        <el-button size="small" type="text" @click="cancel">{{ lang.cancel }}</el-button>
        <template>
          <div class="row flex-container">
            <div>{{ $lang[langId].save_at }}:</div>
            <el-select v-model="storeToBeSaved" multiple collapse-tags @change="handleSelectAll">
              <el-option
                v-for="item in outlets"
                :key="item.store_id"
                :label="item.name"
                :value="item.store_id">
              </el-option>
            </el-select>
          </div>
        </template>
        <el-button
          :disabled="disabledSave"
          size="small"
          icon="el-icon-check"
          class="radius-null"
          type="success"
          @click="save">
          {{ lang.save }}
        </el-button>
      </div>
    </div>

    <div class="card-body" v-loading="loadings" style="margin-top: 20px">
      <el-form
        :model="data"
        :rules="dataRules"
        ref="packageForm"
        class="form-sidebyside p-24"
        @submit.native.prevent>
        <div class="row">
          <div class="col-md-8 col-md-offset-2">
            <div class="open-create-body">
              <el-row :gutter="10">
                <el-col :sm="11">
                  <el-form-item :label="lang.discount_detail" class="form-subtitle">
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :sm="11">
                  <el-form-item :label="lang.code" :required="true">
                    <p>{{ lang.info_discount_code }}</p>
                  </el-form-item>
                </el-col>
                <el-col :sm="13">
                  <el-form-item prop="code">
                    <el-input
                      required
                      :placeholder="$lang[langId].input_code"
                      style="width: 100%;"
                      type="text"
                      v-model="data.code">
                      <el-button slot="append" icon="el-icon-refresh" @click="refreshCode"></el-button>
                      </el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :sm="11">
                  <el-form-item :label="lang.title" :required="true">
                  </el-form-item>
                </el-col>
                <el-col :sm="13">
                  <el-form-item prop="title">
                    <el-input
                      required
                      :placeholder="$lang[langId].please_input + lang.title"
                      style="width: 100%;"
                      type="text"
                      v-model="data.title"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <hr/>

              <el-row :gutter="10">
                <el-col :sm="11">
                  <el-form-item :label="lang.active_date" :required="true">
                  </el-form-item>
                </el-col>
                <el-col :sm="13">
                  <el-form-item prop="active_date">
                    <el-date-picker
                      :required="true"
                      v-model="data.active_date"
                      type="date"
                      :placeholder="$lang[langId].pick_a_day">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :sm="11">
                  <el-form-item :label="lang.never_expires">
                  </el-form-item>
                </el-col>
                <el-col :sm="13">
                  <el-form-item>
                    <div class="mb-4">
                      <el-switch
                        :active-value="1"
                        :inactive-value="0"
                        v-model="data.no_expiry">
                      </el-switch>
                      <span v-if="data.no_expiry === 0">{{ lang.no }}</span>
                      <span v-if="data.no_expiry === 1">{{ lang.yes }}</span>
                    </div>

                    <el-date-picker
                      v-if="data.no_expiry === 0"
                      :required="true"
                      v-model="data.expiry_date"
                      type="date"
                      :placeholder="$lang[langId].pick_a_day"
                      :picker-options="checkDateRange">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :sm="11">
                  <el-form-item :label="lang.min_order_amount">
                    <p>{{ lang.info_discount_min_order_amount }}, {{$lang[langId].input_min_order_amount}}</p>
                  </el-form-item>
                </el-col>
                <el-col :sm="13">
                  <el-form-item>
                    <div class="el-input">
                      <!-- <money v-model="data.min_order_amount" class="el-input__inner" @change.native="handleCurrency('minOrder', data.min_order_amount)"></money> -->
                      <input-money v-model="data.min_order_amount" @currency="handleCurrency('minOrder', data.min_order_amount)" />
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :sm="11">
                  <el-form-item :label="$lang[langId].unlimited_use">
                  </el-form-item>
                </el-col>
                <el-col :sm="13">
                  <el-form-item>
                    <div class="mb-4">
                      <el-switch
                        :active-value="1"
                        :inactive-value="0"
                        v-model="data.no_usage_limit">
                      </el-switch>
                      <span v-if="data.no_usage_limit === 0">{{ lang.no }}</span>
                      <span v-if="data.no_usage_limit === 1">{{ lang.yes }}</span>
                    </div>

                    <el-input
                      v-if="data.no_usage_limit === 1"
                      :disabled="true"
                      type="number"
                      :min="1"
                      v-model="data.usage_limit"
                      :placeholder="lang.usage_limit">
                    </el-input>
                    <el-input
                      v-else
                      :disabled="false"
                      type="number"
                      :min="1"
                      v-model="data.usage_limit"
                      :placeholder="lang.usage_limit">
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :sm="11">
                  <el-form-item :label="$lang[langId].show_in_pos">
                  </el-form-item>
                </el-col>
                <el-col :sm="13">
                  <el-form-item>
                    <el-switch
                      v-model="data.show_in_pos"
                      :active-value="1"
                      :inactive-value="0">
                    </el-switch>
                    <span v-if="data.show_in_pos === 0">{{ lang.no }}</span>
                    <span v-if="data.show_in_pos === 1">{{ lang.yes }}</span>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :sm="11">
                  <el-form-item :label="$lang[langId].show_in_online">
                  </el-form-item>
                </el-col>
                <el-col :sm="13">
                  <el-form-item>
                    <el-switch
                      v-model="data.show_in_online"
                      :active-value="1"
                      :inactive-value="0">
                    </el-switch>
                    <span v-if="data.show_in_online === 0">{{ lang.no }}</span>
                    <span v-if="data.show_in_online === 1">{{ lang.yes }}</span>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :sm="11">
                  <el-form-item :label="lang.once_per_customer">
                  </el-form-item>
                </el-col>
                <el-col :sm="13">
                  <el-form-item>
                    <el-switch
                      v-model="data.once_per_customer"
                      :active-value="1"
                      :inactive-value="0">
                    </el-switch>
                    <span v-if="data.once_per_customer === 0">{{ lang.no }}</span>
                    <span v-if="data.once_per_customer === 1">{{ lang.yes }}</span>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :sm="11">
                  <el-form-item :label="$lang[langId].daily_reset_usage">
                  </el-form-item>
                </el-col>
                <el-col :sm="13">
                  <el-form-item>
                    <el-switch
                      v-model="data.daily_reset_usage"
                      :active-value="1"
                      :inactive-value="0">
                    </el-switch>
                    <span v-if="data.daily_reset_usage === 0">{{ lang.no }}</span>
                    <span v-if="data.daily_reset_usage === 1">{{ lang.yes }}</span>
                  </el-form-item>
                </el-col>
              </el-row>

              <template>
                <el-row :gutter="10">
                  <el-col :sm="11">
                    <el-form-item :label="$lang[langId].use_dine_in">
                    </el-form-item>
                  </el-col>
                  <el-col :sm="13">
                    <el-form-item>
                      <el-switch
                        v-model="data.use_dine_in"
                        :active-value="1"
                        :inactive-value="0">
                      </el-switch>
                      <span v-if="data.use_dine_in === 0">{{ lang.no }}</span>
                      <span v-if="data.use_dine_in === 1">{{ lang.yes }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="10">
                  <el-col :sm="11">
                    <el-form-item :label="$lang[langId].use_delivery">
                    </el-form-item>
                  </el-col>
                  <el-col :sm="13">
                    <el-form-item>
                      <el-switch
                        v-model="data.use_delivery"
                        :active-value="1"
                        :inactive-value="0">
                      </el-switch>
                      <span v-if="data.use_delivery === 0">{{ lang.no }}</span>
                      <span v-if="data.use_delivery === 1">{{ lang.yes }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="10">
                  <el-col :sm="11">
                    <el-form-item :label="$lang[langId].use_take_away">
                    </el-form-item>
                  </el-col>
                  <el-col :sm="13">
                    <el-form-item>
                      <el-switch
                        v-model="data.use_take_away"
                        :active-value="1"
                        :inactive-value="0">
                      </el-switch>
                      <span v-if="data.use_take_away === 0">{{ lang.no }}</span>
                      <span v-if="data.use_take_away === 1">{{ lang.yes }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </template>
              

              <hr/>

              <el-row :gutter="10">
                <el-col :sm="11">
                  <el-form-item :label="lang.discount_amount" required>
                  </el-form-item>
                </el-col>
                <el-col :sm="13">
                  <el-radio-group v-model="data.amount_type">
                    <el-radio-button label="percent">
                      % {{ $lang[langId].percent }}
                    </el-radio-button>
                    <el-radio-button label="amount">
                      $ {{ $lang[langId].nominal }}
                    </el-radio-button>
                  </el-radio-group>

                  <el-form-item
                    v-if="data.amount_type === 'percent'"
                    prop="discount_percent">
                    <el-input
                      type="number"
                      :placeholder="$lang[langId].input_number"
                      v-model="data.discount_percent"
                      @change="handleCurrency('discountPercent', data.discount_percent)">
                    </el-input>
                    <p style="margin-top: 5px; text-align: left; ">
                      {{ lang.desc_price_cut_for_reseller }},{{ $lang[langId].min_and_max_disc_percent }}
                    </p>
                  </el-form-item>

                  <el-form-item
                    v-else
                    prop="discount_amount">
                    <div class="el-input">
                      <input-money v-model="data.discount_amount" />
                    </div>
                  </el-form-item>

                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :sm="11">
                  <el-form-item :label="$lang[langId].max_discount">
                  </el-form-item>
                </el-col>
                <el-col :sm="13">
                  <el-form-item>
                    <div class="el-input">
                      <input-money v-model="data.max_discount_amount" @currency="handleCurrency('maxOrder', data.max_discount_amount)"/>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>

          <div class="col-md-6">
            <div class="open-create-body">
              <el-row :gutter="10">
                <el-col :sm="11">
                  <el-form-item :label="lang.discount_criteria" class="form-subtitle">
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :sm="11">
                  <el-form-item :label="$lang[langId].apply_to_all_customer">
                  </el-form-item>
                </el-col>
                <el-col :sm="13">
                  <el-form-item>
                    <el-switch
                      :active-value="1"
                      :inactive-value="0"
                      v-model="data.valid_for_all_customers">
                    </el-switch>
                    <span v-if="data.valid_for_all_customers === 0">{{ lang.no }}</span>
                    <span v-if="data.valid_for_all_customers === 1">{{ lang.yes }}</span>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :sm="11">
                  <el-form-item :label="lang.valid_for_customer_types">
                  </el-form-item>
                </el-col>
                <el-col :sm="13">
                  <el-form-item prop="valid_customer_types">
                    <el-select
                      v-if="data.valid_for_all_customers === 0"
                      :disabled="false"
                      style="width: 100%;"
                      v-model="data.valid_customer_types"
                      multiple
                      filterable
                      remote
                      reserve-keyword
                      :placeholder="$lang[langId].please_input + lang.customer_type"
                      :remote-method="searchCustomerTypes"
                      :loading="searchingCustomerTypes">
                      <el-option
                        v-for="item in searchResultCustomerTypes"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                    <el-select
                      v-else
                      :disabled="true"
                      style="width: 100%;"
                      v-model="data.valid_customer_types"
                      multiple
                      filterable
                      remote
                      reserve-keyword
                      :placeholder="$lang[langId].please_input + lang.customer_type"
                      :remote-method="searchCustomerTypes"
                      :loading="searchingCustomerTypes">
                      <el-option
                        v-for="item in searchResultCustomerTypes"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :sm="11">
                  <el-form-item :label="lang.valid_for_customers">
                  </el-form-item>
                </el-col>
                <el-col :sm="13">
                  <el-form-item prop="valid_customers">
                    <el-select
                      v-if="data.valid_for_all_customers === 0"
                      :disabled="false"
                      style="width: 100%;"
                      v-model="data.valid_customers"
                      multiple
                      filterable
                      remote
                      reserve-keyword
                      :placeholder="$lang[langId].please_input + lang.customer"
                      :remote-method="searchCustomers"
                      :loading="searchingCustomers">
                      <el-option
                        v-for="item in searchResultCustomers"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                    <el-select
                      v-else
                      :disabled="true"
                      style="width: 100%;"
                      v-model="data.valid_customers"
                      multiple
                      filterable
                      remote
                      reserve-keyword
                      :placeholder="$lang[langId].please_input + lang.customer"
                      :remote-method="searchCustomers"
                      :loading="searchingCustomers">
                      <el-option
                        v-for="item in searchResultCustomers"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <hr/>

              <el-row :gutter="10">
                <el-col :sm="11">
                  <el-form-item :label="$lang[langId].apply_to_all_product">
                  </el-form-item>
                </el-col>
                <el-col :sm="13">
                  <el-form-item>
                    <el-switch
                      :active-value="1"
                      :inactive-value="0"
                      v-model="data.valid_for_all_products">
                    </el-switch>
                    <span v-if="data.valid_for_all_products === 0">{{ lang.no }}</span>
                    <span v-if="data.valid_for_all_products === 1">{{ lang.yes }}</span>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :sm="11">
                  <el-form-item :label="lang.valid_for_product_groups">
                  </el-form-item>
                </el-col>
                <el-col :sm="13">
                  <el-form-item prop="valid_product_groups">
                    <el-select
                      v-if="data.valid_for_all_products === 0"
                      :disabled="false"
                      style="width: 100%;"
                      v-model="data.valid_product_groups"
                      multiple
                      filterable
                      remote
                      reserve-keyword
                      :placeholder="$lang[langId].please_input + lang.product_groups"
                      :remote-method="searchProductGroups"
                      :loading="searchingProductGroups">
                      <el-option
                        v-for="item in searchResultProductGroups"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                    <el-select
                      v-else
                      :disabled="true"
                      style="width: 100%;"
                      v-model="data.valid_product_groups"
                      multiple
                      filterable
                      remote
                      reserve-keyword
                      :placeholder="$lang[langId].please_input + lang.product_groups"
                      :remote-method="searchProductGroups"
                      :loading="searchingProductGroups">
                      <el-option
                        v-for="item in searchResultProductGroups"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :sm="11">
                  <el-form-item :label="lang.valid_for_products">
                  </el-form-item>
                </el-col>
                <el-col :sm="13">
                  <el-form-item prop="valid_products">
                    <el-select
                      v-if="data.valid_for_all_products === 0"
                      :disabled="false"
                      style="width: 100%;"
                      v-model="data.valid_products"
                      multiple
                      filterable
                      remote
                      reserve-keyword
                      :placeholder="lang.info_auto_complete_product"
                      :remote-method="searchProducts"
                      :loading="searchingProducts">
                      <el-option
                        v-for="item in searchResultProducts"
                        :key="item.product_id"
                        :label="item.name"
                        :value="item.product_id">
                      </el-option>
                    </el-select>
                    <el-select
                      v-else
                      :disabled="true"
                      style="width: 100%;"
                      v-model="data.valid_products"
                      multiple
                      filterable
                      remote
                      reserve-keyword
                      :placeholder="lang.info_auto_complete_product"
                      :remote-method="searchProducts"
                      :loading="searchingProducts">
                      <el-option
                        v-for="item in searchResultProducts"
                        :key="item.product_id"
                        :label="item.name"
                        :value="item.product_id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <hr />

              <el-row :gutter="10">
                <el-col :sm="11">
                  <el-form-item :label="$lang[langId].apply_to_all_combo">
                  </el-form-item>
                </el-col>
                <el-col :sm="13">
                  <el-form-item>
                    <el-switch
                      :active-value="1"
                      :inactive-value="0"
                      v-model="data.valid_for_all_product_combos">
                    </el-switch>
                    <span v-if="data.valid_for_all_product_combos === 0">{{ lang.no }}</span>
                    <span v-if="data.valid_for_all_product_combos === 1">{{ lang.yes }}</span>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :sm="11">
                  <el-form-item :label="lang.valid_for_product_combos">
                  </el-form-item>
                </el-col>
                <el-col :sm="13">
                  <el-form-item prop="valid_product_combos">
                    <el-select
                      v-if="data.valid_for_all_product_combos === 0"
                      :disabled="false"
                      style="width: 100%;"
                      v-model="data.valid_product_combos"
                      multiple
                      filterable
                      remote
                      reserve-keyword
                      :placeholder="$lang[langId].please_input + lang.product_combo"
                      :remote-method="searchProductCombos"
                      :loading="searchingProductCombos">
                      <el-option
                        v-for="item in searchResultProductCombos"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                    <el-select
                      v-else
                      :disabled="true"
                      style="width: 100%;"
                      v-model="data.valid_product_combos"
                      multiple
                      filterable
                      remote
                      reserve-keyword
                      :placeholder="$lang[langId].please_input + lang.product_combo"
                      :remote-method="searchProductCombos"
                      :loading="searchingProductCombos">
                      <el-option
                        v-for="item in searchResultProductCombos"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :sm="11">
                  <el-form-item :label="$lang[langId].apply_to_all_brand">
                  </el-form-item>
                </el-col>
                <el-col :sm="13">
                  <el-form-item>
                    <el-switch
                      :active-value="1"
                      :inactive-value="0"
                      v-model="data.valid_for_all_brands">
                    </el-switch>
                    <span v-if="data.valid_for_all_brands === 0">{{ lang.no }}</span>
                    <span v-if="data.valid_for_all_brands === 1">{{ lang.yes }}</span>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :sm="11">
                  <el-form-item :label="lang.valid_for_brands">
                  </el-form-item>
                </el-col>
                <el-col :sm="13">
                  <el-form-item prop="valid_brands">
                    <el-select
                      v-if="data.valid_for_all_brands === 0"
                      :disabled="false"
                      style="width: 100%;"
                      v-model="data.valid_brands"
                      multiple
                      filterable
                      remote
                      reserve-keyword
                      :placeholder="$lang[langId].please_input + lang.brand"
                      :remote-method="searchBrand"
                      :loading="loadingSearchBrand">
                      <el-option
                        v-for="item in searchResultBrand"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                    <el-select
                      v-else
                      :disabled="true"
                      style="width: 100%;"
                      v-model="data.valid_brands"
                      multiple
                      filterable
                      remote
                      reserve-keyword
                      :placeholder="$lang[langId].please_input + lang.brand"
                      :remote-method="searchBrand"
                      :loading="loadingSearchBrand">
                      <el-option
                        v-for="item in searchResultBrand"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'

import InputMoney from '@/components/InputMoneyV2'
import basicComputedMixin from '@/mixins/basicComputedMixin'

export default {
  props: ['loading', 'saved'],

  mixins: [basicComputedMixin],

  components: {
    InputMoney
  },

  data() {
    return {
      outlets: [
        {
          name: this.$store.state.userStores.lang.all,
          store_id: 0,
          url_id: 'all'
        }
      ],
      storeToBeSaved: [],
      loadings: false,
      searchingCustomerTypes: false,
      searchingCustomers: false,
      searchingProducts: false,
      searchingProductGroups: false,
      searchingProductCombos: false,
      loadingSearchBrand: false,
      disabledSave: true,
      data: {
        amount_type: 'percent',
        show_in_pos: 1,
        no_expiry: 1,
        no_usage_limit: 1,
        valid_for_all_products: 1,
        valid_for_all_customers: 1,
        valid_for_all_product_combos: 1,
        valid_customer_types: [],
        valid_customers: [],
        valid_products: [],
        valid_product_groups: [],
        valid_product_combos: [],
        valid_brands: [],
        valid_for_all_brands: 1,
        min_order_amount: 1,
        code: this.randomString(12)
      },
      searchResultCustomerTypes: [],
      searchResultCustomers: [],
      searchResultProducts: [],
      searchResultProductGroups: [],
      searchResultProductCombos: [],
      searchResultBrand: [],
      dataRules: {
        title: [
          { required: true, message: 'This is required field', trigger: 'blur' },
          { min: 2, message: 'Length should min. 2', trigger: 'blur' }
        ],
        code: [
          { required: true, message: 'This is required field', trigger: 'blur' },
          { min: 2, message: 'Length should min. 2', trigger: 'blur' }
        ],
        active_date: [
          { required: true, message: 'This is required field', trigger: 'blur' }
        ]
      },
      checkDateRange: {
        disabledDate: this.disabledDueDate
      }
    }
  },

  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
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
    storeCanAccess () {
      return [
        'setdemo1',
        'allinolsera2',
        'meenumjagakarsa', 
        'meenummekarsari', 
        'meenumcipayung', 
        'meenumgalaxy', 
        'meenumjatiasih', 
        'meenumcileungsi', 
        'meenumdukuhzamrud', 
        'meenumjoyomartono', 
        'meenumjatimakmur', 
        'meenumsawangan', 
        'meenumarundina', 
        'meenumkaliabang', 
        'meenumjatirasa', 
        'meenummgt', 
        'meenumgasalam', 
        'meenumhalim', 
        'meenumciangsana', 
        'meenumkayuringin', 
        'meenumnusantaradepok', 
        'meenumrawalumbu', 
        'meenumcilincing', 
        'meenumunsikakarawang', 
        'meenumkayutinggi', 
        'meenummunjuljayapurwakarta', 
        'meenumpisangan', 
        'meenumtarumajaya', 
        'meenumsemarang', 
        'meenumcibitung', 
        'meenumcirebon', 
        'meenummanukansurabaya', 
        'meenumkeputihsurabaya', 
        'meenumcentex', 
        'meenumkelapadua', 
        'meenumregency', 
        'meenumpuricendana', 
        'meenumjatikramat', 
        'meenumlubangbuaya', 
        'meenumtegal', 
        'meenumpermatacibubur', 
        'meenumperumnascirebon', 
        'meenumtugumacan', 
        'meenumcikarangfestival', 
        'meenumkarawangkosambi', 
        'meenumtegalparang', 
        'meenumbojonggede', 
        'meenumutankayu', 
        'meenumdepoktimur', 
        'meenumcirebonmegu', 
        'meenumkembangan', 
        'meenumwanaherang', 
        'meenumtambunutara', 
        'meenumgriyabukitjaya', 
        'meenumwismajaya', 
        'meenumcondet', 
        'meenumgongseng', 
        'meenumpondokmelati', 
        'meenumgdcdepok', 
        'meenumpekapuran', 
        'meenumtaposdepok', 
        'meenumbekasitimurregency', 
        'meenumbbm', 
        'meenumcikaret', 
        'meenumgrandkahuripan', 
        'meenumpekanbarudurian', 
        'meenumpekanbarurambutan', 
        'meenumkpmakasar', 
        'meenumfatmawati', 
        'meenumbumimutiara', 
        'meenumjatiwaringin', 
        'meenumsumurbatu', 
        'meenumpurigading', 
        'meenumsetucibitung', 
        'meenumsirsakjagakarsa', 
        'meenumrawabebek', 
        'meenumcikarangregency'
        ]
    }
  },

  watch: {
    data: {
      handler(data) {
        console.log(data)
        if (
          !data.title ||
          !data.active_date ||
          !data.code ||
          (data.amount_type === 'percent' && !data.discount_percent) || 
          (data.amount_type === 'amount' && !data.discount_amount)
        ) {
          this.disabledSave = true
        } else {
          this.disabledSave = false
        }
      },
      deep: true,
      immediate: true
    },
    loading: {
      handler(bool) {
        if (bool === true) {
          this.loadings = true
        } else {
          this.loadings = false
        }
      },
      deep: true
    },
    saved: {
      handler(bool) {
        if (bool === true) {
          this.disabledSave = true
        } else {
          this.disabledSave = false
        }
      },
      deep: true
    }
  },

  methods: {
    searchCustomerTypes(query) {
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
          this.searchingCustomerTypes = false
          this.searchResultCustomerTypes = response.data.data.map(item => {
            return item
          })
        }).catch(() => {
          this.searchingCustomerTypes = false
          this.searchResultCustomerTypes = []
        })
      }
    },
    searchCustomers(query) {
      //
      this.searchingCustomers = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search: query
      }
      if (query.length > 0) {
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'customer'),
          headers: headers,
          params: params
        }).then(response => {
          this.searchingCustomers = false
          this.searchResultCustomers = response.data.data.map(item => {
            return item
          })
        }).catch(() => {
          this.searchingCustomers = false
          this.searchResultCustomers = []
        })
      }
    },
    searchProducts(query) {
      //
      this.searchingProducts = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search_column: 'name',
        search_text: query,
        sort_column: 'name',
        sort_type: 'desc',
        per_page: 50
      }
      if (query.length > 0) {
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'productvariantsearch'),
          headers: headers,
          params: params
        }).then(response => {
          this.searchingProducts = false
          this.searchResultProducts = response.data.data.map(item => {
            return item
          })
        }).catch(() => {
          this.searchingProducts = false
          this.searchResultProducts = []
        })
      }
    },
    searchProductGroups(query) {
      //
      this.searchingProductGroups = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search_column: 'name',
        search_text: query,
        sort_column: 'name',
        sort_type: 'desc'
      }
      if (query.length > 0) {
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'productgroup'),
          headers: headers,
          params: params
        }).then(response => {
          this.searchingProductGroups = false
          this.searchResultProductGroups = response.data.data.map(item => {
            return item
          })
        }).catch(() => {
          this.searchingProductGroups = false
          this.searchResultProductGroups = []
        })
      }
    },
    searchProductCombos(query) {
      //
      this.searchingProductCombos = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search_column: 'name',
        search_text: query,
        sort_column: 'name',
        sort_type: 'desc'
      }
      if (query.length > 0) {
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'productcombo'),
          headers: headers,
          params: params
        }).then(response => {
          this.searchingProductCombos = false
          this.searchResultProductCombos = response.data.data.map(item => {
            return item
          })
        }).catch(() => {
          this.searchingProductCombos = false
          this.searchResultProductCombos = []
        })
      }
    },
    searchBrand(query) {
      this.loadingSearchBrand = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search: query
      }
      if (query.length > 0) {
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'brand'),
          headers: headers,
          params: params
        }).then(response => {
          this.loadingSearchBrand = false
          this.searchResultBrand = response.data.data.map(item => {
            return item
          })
        }).catch(() => {
          this.loadingSearchBrand = false
          this.searchResultBrand = []
        })
      }
    },
    cancel() {
      this.data = {}
      this.$emit('cancel')
    },
    save() {
      // var to_store_id = null
      // if (this.storeToBeSaved === 0) {
      //   var storeid = []
      //   this.outlets.map(i => {
      //     if (i.store_id !== 0) {
      //       storeid.push(i.store_id)
      //     }
      //   })
      //   to_store_id = storeid.join()
      // } else {
      //   to_store_id = this.storeToBeSaved
      // }

      let to_store_id = this.selectedStore.store_id
      let to_allstore_id = 0
      // if (this.storeCanAccess.includes(this.selectedStore.url_id)) {
        if (this.storeToBeSaved.length && this.storeToBeSaved[0] === 0) {
          to_allstore_id = 1
        } else if (this.storeToBeSaved.length) {
          to_store_id = this.storeToBeSaved.join(',')
        }
      // }

      this.data.to_allstore_id = to_allstore_id
      this.data.to_store_id = to_store_id
      this.$emit('save', this.data)
    },
    disabledDueDate (time) {
      return time.getTime() < this.data.active_date
    },
    handleCurrency (block, value) {
      if (block === 'minOrder') {
        if (value < 0) {
          this.data.min_order_amount = 0
        }
      } else if (block === 'maxOrder') {
        if (value < 0) {
          this.data.max_discount_amount = 0
        }
      } else if (block === 'discountPercent') {
        if (value < 0) {
          this.data.discount_percent = 0
        } else if (value > 100) {
          this.data.discount_percent = 100
        }
      }
    },

    refreshCode () {
      this.data.code = this.randomString(12)
    },

    randomString(len, charSet) {
      charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      var randomString = '';
      for (var i = 0; i < len; i++) {
          var randomPoz = Math.floor(Math.random() * charSet.length);
          randomString += charSet.substring(randomPoz,randomPoz+1);
      }
      return randomString;
    },

    handleSelectAll (data) {
      if (data.length) {
        data.map(i => {
          if (i === 0) {
            this.storeToBeSaved = [0]
          }
        })
      }
    },
  },

  mounted() {
    const stores = this.$store.state.userStores.stores
    if (stores) {
      stores.map(item => {
        this.outlets.push({ ...item })
      })
    }

    const store = this.$store.getters.selectedStore
    if (store) {
      if (store.constructor === Array) {
        this.storeToBeSaved[0] = 0
      } else {
        this.storeToBeSaved[0] = store.store_id
      }
    }
  }
}
</script>
