<template>
  <div
    v-loading="loadings"
    class="box">
    <div class="box-header with-border create-product-header">
      <h4 class="box-title">{{ lang.add }} {{ $lang[langId].promotion_pos }}</h4>
      <div class="pull-right">
        <el-button size="small" type="text" @click="cancel">{{ lang.cancel }}</el-button>
        <template >
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
          <div class="col-md-6">
            <div class="open-create-body">
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

              <el-row :gutter="10">
                <el-col :sm="11">
                  <el-form-item :label="$lang[langId].type_promotion">
                  </el-form-item>
                </el-col>
                <el-col :sm="13">
                  <el-form-item prop="title">
                    <el-select
                      style="width: 100%;"
                      v-model="data.promo_type_id">
                      <el-option
                        :label="$lang[langId].type_promotion_bx"
                        value="BX">
                      </el-option>
                      <el-option
                        :label="$lang[langId].type_promotion_dq"
                        value="DQ">
                      </el-option>
                      <el-option
                        :label="$lang[langId].type_promotion_da"
                        value="DA">
                      </el-option>
                      <el-option
                        :label="$lang[langId].type_promotion_fi"
                        value="FI">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <hr/>

              <el-row :gutter="10">
                <el-col :sm="11">
                  <el-form-item :label="$lang[langId].promotion_rule" class="form-subtitle">
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="10" v-if="data.promo_type_id !== 'DA' && data.promo_type_id !== 'FI'">
                <el-col :sm="11">
                  <el-form-item :label="$lang[langId].combine_qty_below">
                  </el-form-item>
                </el-col>
                <el-col :sm="13">
                  <el-form-item>
                    <div class="mb-4">
                      <el-switch v-model="combineQty"></el-switch>
                    </div>
                    <el-input
                      v-if="combineQty"
                      :disabled="false"
                      :placeholder="$lang[langId].min_qty"
                      type="number"
                      :min="1"
                      v-model="data.promo_buy_qty">
                    </el-input>
                    <el-input
                      v-else
                      :disabled="true"
                      :placeholder="$lang[langId].min_qty"
                      type="number"
                      :min="1"
                      v-model="data.promo_buy_qty">
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <div class="bx-rule">
                <template v-if="data.promo_type_id !== 'DA' && data.promo_type_id !== 'FI'">
                  <el-row :gutter="10">
                    <el-col :sm="11">
                      <el-form-item :label="lang.info_discount_valid_for_products">
                      </el-form-item>
                    </el-col>
                    <el-col :sm="13">
                      <div
                        v-for="(form, key) in groupPromo_buy_product"
                        :key="key"
                        class="repeatable-form">
                        <el-form-item>
                          <p>
                            <el-select
                              style="width: 100%;"
                              v-model="form.promo_buy_product_id"
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
                          </p>
                          <p>
                            <el-input
                              :disabled="combineQty"
                              type="number"
                              :placeholder="lang.qty"
                              :min="1"
                              v-model="form.promo_buy_product_id_qty">
                            </el-input>
                          </p>
                          <el-button
                            v-if="groupPromo_buy_product.length > 1" type="text" size="mini"
                            @click="del_groupPromo_buy_product(key)">
                            {{ $lang[langId].delete }}
                          </el-button>
                        </el-form-item>
                      </div>
                      <el-form-item class="text-right">
                        <el-button
                          type="primary"
                          size="mini"
                          @click="add_groupPromo_buy_product">
                          {{ lang.add }}
                        </el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row :gutter="10">
                    <el-col :sm="11">
                      <el-form-item :label="lang.info_discount_valid_for_product_groups">
                      </el-form-item>
                    </el-col>
                    <el-col :sm="13">
                      <div
                        v-for="(form, key) in groupPromo_buy_product_group_id"
                        :key="key"
                        class="repeatable-form">
                        <el-form-item>
                          <p>
                            <el-select
                              style="width: 100%;"
                              v-model="form.promo_buy_product_group_id"
                              filterable
                              remote
                              reserve-keyword
                              :placeholder="lang.info_auto_complete_product_group"
                              :remote-method="searchProductGroups"
                              :loading="searchingProductGroups">
                              <el-option
                                v-for="item in searchResultProductGroups"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                              </el-option>
                            </el-select>
                          </p>
                          <p>
                            <el-input
                              :disabled="combineQty"
                              type="number"
                              :min="1"
                              :placeholder="lang.qty"
                              v-model="form.promo_buy_product_group_id_qty">
                            </el-input>
                          </p>
                          <el-button
                            v-if="groupPromo_buy_product_group_id.length > 1" type="text" size="mini"
                            @click="del_groupPromo_buy_product_group_id(key)">
                            {{ $lang[langId].delete }}
                          </el-button>
                        </el-form-item>
                      </div>
                      <el-form-item class="text-right">
                        <el-button
                          type="primary"
                          size="mini"
                          @click="add_groupPromo_buy_product_group_id">
                          {{ lang.add }}
                        </el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row :gutter="10">
                    <el-col :sm="11">
                      <el-form-item :label="lang.info_discount_valid_for_product_combos">
                      </el-form-item>
                    </el-col>
                    <el-col :sm="13">
                      <div
                        v-for="(form, key) in groupPromo_buy_product_combo_id "
                        :key="key"
                        class="repeatable-form">
                        <el-form-item>
                          <p>
                            <el-select
                              style="width: 100%;"
                              v-model="form.promo_buy_product_combo_id"
                              filterable
                              remote
                              reserve-keyword
                              :placeholder="$lang[langId].info_auto_complete_product_combos"
                              :remote-method="searchProductCombos"
                              :loading="searchingProductCombos">
                              <el-option
                                v-for="item in searchResultProductCombos"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                              </el-option>
                            </el-select>
                          </p>
                          <p>
                            <el-input
                              :disabled="combineQty"
                              type="number"
                              :min="1"
                              :placeholder="lang.qty"
                              v-model="form.promo_buy_product_combo_id_qty">
                            </el-input>
                          </p>
                          <el-button
                            v-if="groupPromo_buy_product_combo_id.length > 1" type="text" size="mini"
                            @click="del_groupPromo_buy_product_combo_id(key)">
                            {{ $lang[langId].delete }}
                          </el-button>
                        </el-form-item>
                      </div>
                      <el-form-item class="text-right">
                        <el-button
                          type="primary"
                          size="mini"
                          @click="add_groupPromo_buy_product_combo_id">
                          {{ lang.add }}
                        </el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row :gutter="10">
                    <el-col :sm="11">
                      <el-form-item :label="lang.info_discount_valid_for_brands">
                      </el-form-item>
                    </el-col>
                    <el-col :sm="13">
                      <div
                        v-for="(form, key) in groupPromo_buy_brand_id "
                        :key="key"
                        class="repeatable-form">
                        <el-form-item>
                          <p>
                            <el-select
                              style="width: 100%;"
                              v-model="form.promo_buy_brand_id"
                              filterable
                              remote
                              reserve-keyword
                              :placeholder="$lang[langId].info_auto_complete_brand"
                              :remote-method="searchBrands"
                              :loading="searchingBrand">
                              <el-option
                                v-for="item in searchResultBrand"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                              </el-option>
                            </el-select>
                          </p>
                          <p>
                            <el-input
                              :disabled="combineQty"
                              type="number"
                              :min="1"
                              :placeholder="lang.qty"
                              v-model="form.promo_buy_brand_id_qty">
                            </el-input>
                          </p>
                          <el-button
                            v-if="groupPromo_buy_brand_id.length > 1" type="text" size="mini"
                            @click="del_groupPromo_buy_brand_id(key)">
                            {{ $lang[langId].delete }}
                          </el-button>
                        </el-form-item>
                      </div>
                      <el-form-item class="text-right">
                        <el-button
                          type="primary"
                          size="mini"
                          @click="add_groupPromo_buy_brand_id">
                          {{ lang.add }}
                        </el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row :gutter="10">
                    <el-col :sm="11">
                      <el-form-item :label="$lang[langId].promo_valid" />
                    </el-col>
                    <el-col :sm="13">
                      <p>
                        <el-radio v-model="data.promo_is_buy_combination"
                          value="0" label="0">{{ $lang[langId].once_of_product}}</el-radio>
                      </p>
                      <p>
                        <el-radio v-model="data.promo_is_buy_combination"
                          value="1" label="1">{{ $lang[langId].all_product_above }}</el-radio>
                      </p>
                    </el-col>
                  </el-row>
                </template>

                <el-row :gutter="10" v-if="data.promo_type_id === 'BX' || data.promo_type_id === 'FI'">
                  <el-col :sm="11">
                    <el-form-item :label="$lang[langId].product_from_free">
                    </el-form-item>
                  </el-col>
                  <el-col :sm="13">
                    <div
                      v-for="(form, key) in groupPromo_free_product_id"
                      :key="key"
                      class="repeatable-form">
                      <el-form-item>
                        <p>
                          <el-select
                            style="width: 100%;"
                            v-model="form.promo_free_product_id"
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
                        </p>
                        <p>
                          <el-input
                            type="number"
                            :min="1"
                            :placeholder="lang.qty"
                            v-model="form.promo_free_product_id_qty">
                          </el-input>
                        </p>
                        <el-button
                          v-if="groupPromo_free_product_id.length > 1" type="text" size="mini"
                          @click="del_groupPromo_free_product_id(key)">
                          {{ lang.remove }}
                        </el-button>
                      </el-form-item>
                    </div>
                    <el-form-item class="text-right">
                      <el-button
                        type="primary"
                        size="mini"
                        @click="add_groupPromo_free_product_id">
                        {{ lang.add }}
                      </el-button>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="10" v-if="data.promo_type_id === 'DA' || data.promo_type_id === 'FI'">
                  <el-col :sm="11">
                    <el-form-item :label="lang.min_order_amount">
                      <p>{{ lang.min_order_amount }}</p>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="13">
                    <el-form-item>
                      <div class="el-input">
                        <!-- <money v-model="data.min_order_amount" class="el-input__inner"></money> -->
                        <input-money v-model="data.min_order_amount" />
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>

                <template v-if="data.promo_type_id === 'DQ' || data.promo_type_id === 'DA'">
                  <el-row :gutter="10">
                    <el-col :sm="11">
                      <el-form-item :label="lang.discount_amount">
                      </el-form-item>
                    </el-col>
                    <el-col :sm="13">
                      <el-radio-group
                        size="mini"
                        v-model="data.amount_type">
                        <el-radio-button value="percent" label="percent">
                          % {{ $lang[langId].percent }}
                        </el-radio-button>
                        <el-radio-button value="amount" label="amount">
                          $ {{ $lang[langId].nominal }}
                        </el-radio-button>
                      </el-radio-group>
                      <el-form-item v-if="data.amount_type === 'percent'">
                        <el-input type="number"
                          :placeholder="$lang[langId].input_number"
                          v-model="data.discount_percent"
                          :min="0">
                        </el-input>
                      </el-form-item>
                      <el-form-item v-else>
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
                          <input-money v-model="data.max_discount_amount" />
                        </div>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </template>
              </div><!-- .bx-rule -->

              <el-row :gutter="10">
                <el-col :sm="11">
                  <el-form-item :label="$lang[langId].apply_for_multiple">
                  </el-form-item>
                </el-col>
                <el-col :sm="13">
                  <el-form-item>
                    <el-switch
                      :active-value="1"
                      :inactive-value="0"
                      v-model="data.promo_multipliable">
                    </el-switch>
                    <span v-if="data.promo_multipliable === 0">{{ lang.no }}</span>
                    <span v-if="data.promo_multipliable === 1">{{ lang.yes }}</span>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row v-if="data.promo_type_id === 'DQ'" :gutter="10">
                <el-col :sm="11">
                  <el-form-item :label="$lang[langId].apply_discount_to_item">
                  </el-form-item>
                </el-col>
                <el-col :sm="13">
                  <el-form-item>
                    <el-switch
                      :active-value="1"
                      :inactive-value="0"
                      v-model="data.promo_apply_line_item">
                    </el-switch>
                    <span v-if="data.promo_apply_line_item === 0">{{ lang.no }}</span>
                    <span v-if="data.promo_apply_line_item === 1">{{ lang.yes }}</span>
                  </el-form-item>
                </el-col>
              </el-row>


              <el-row :gutter="10">
                <el-col :sm="11">
                  <el-form-item :label="$lang[langId].promo_validity" class="form-subtitle">
                  </el-form-item>
                </el-col>
              </el-row>

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
                      :placeholder="$lang[langId].pick_a_day"
                      @change="changeTimeDisabled">
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
                    </div>
                    <el-date-picker
                      v-if="data.no_expiry"
                      :disabled="true"
                      :required="true"
                      v-model="data.expiry_date"
                      type="date"
                      :placeholder="$lang[langId].pick_a_day">
                    </el-date-picker>
                    <el-date-picker
                      v-else
                      :disabled="false"
                      :required="true"
                      v-model="data.expiry_date"
                      type="date"
                      :picker-options="pickerOptions"
                      :placeholder="$lang[langId].pick_a_day">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :sm="11">
                  <el-form-item :label="$lang[langId].apply_24_hours">
                  </el-form-item>
                </el-col>
                <el-col :sm="13">
                  <el-form-item>
                    <div class="mb-4">
                      <el-switch v-model="active24h"></el-switch>
                    </div>
                    <div>
                      <el-time-picker
                        :disabled="active24h"
                        v-model="data.promo_start_time"
                        :placeholder="lang.start">
                      </el-time-picker>
                    </div>
                    <div>{{ $lang[langId].to_date }}</div>
                    <div>
                      <el-time-picker
                        :disabled="active24h"
                        v-model="data.promo_end_time"
                        :placeholder="lang.end">
                      </el-time-picker>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :sm="11">
                  <el-form-item :label="$lang[langId].valid_on_days">
                  </el-form-item>
                </el-col>
                <el-col :sm="13">
                  <el-form-item>
                    <el-checkbox
                      :indeterminate="isIndeterminate"
                      v-model="checkAllDays"
                      @change="handleCheckAllDaysChange">
                      {{ lang.check_all }}
                    </el-checkbox>
                    <div style="margin: 15px 0;"></div>
                    <el-checkbox-group
                      v-model="data.promo_valid_days"
                      @change="handleCheckedDaysChange">
                      <ul class="list-unstyled">
                        <li v-for="(day, key) in days" :key="key">
                          <el-checkbox
                            :label="day"
                            :key="day">
                            {{day}}
                          </el-checkbox>
                        </li>
                      </ul>
                    </el-checkbox-group>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>

          <div class="col-md-6">
            <div class="open-create-body">
              <el-row :gutter="10">
                <el-col :sm="11">
                  <el-form-item :label="lang.customer" class="form-subtitle">
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
                  <el-form-item prop="valid_for_customer_types">
                    <el-select
                      v-if="data.valid_for_all_customers === 0"
                      :disabled="false"
                      style="width: 100%;"
                      v-model="data.valid_for_customer_types"
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
                      v-model="data.valid_for_customer_types"
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
                  <el-form-item prop="valid_for_customers">
                    <el-select
                      v-if="data.valid_for_all_customers === 0"
                      :disabled="false"
                      style="width: 100%;"
                      v-model="data.valid_for_customers"
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
                      v-model="data.valid_for_customers"
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
const dayOptions = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
const moment = require('moment')

export default {
  props: ['formData', 'loading', 'saved'],
  components: {
    InputMoney
  },

  mixins: [basicComputedMixin],
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
      'loadings': false,
      'searchingCustomerTypes': false,
      'searchingCustomers': false,
      'searchingProducts': false,
      'searchingProductGroups': false,
      'searchingProductCombos': false,
      'searchingBrand': false,
      'disabledSave': true,
      'combineQty': true,
      'groupPromo_buy_product': [
        {
          'promo_buy_product_id': '',
          'promo_buy_product_id_qty': ''
        }
      ],
      'groupPromo_buy_product_group_id': [
        {
          'promo_buy_product_group_id': '',
          'promo_buy_product_group_id_qty': ''
        }
      ],
      'groupPromo_buy_product_combo_id': [
        {
          'promo_buy_product_combo_id': '',
          'promo_buy_product_combo_id_qty': ''
        }
      ],
      'groupPromo_buy_brand_id': [
        {
          'promo_buy_brand_id': '',
          'promo_buy_brand_id_qty': ''
        }
      ],
      'groupPromo_free_product_id': [
        {
          'promo_free_product_id': '',
          'promo_free_product_id_qty': ''
        }
      ],
      'checkAllDays': true,
      'days': dayOptions,
      'isIndeterminate': true,
      'active24h': true,
      'data': {
        'active_date': moment(new Date()).format('YYYY-MM-DD'),
        'amount_type': 'percent',
        'discount_amount': '',
        'discount_percent': 0,
        'expiry_date': moment(new Date()).format('YYYY-MM-DD'),
        'min_order_amount': 1,
        'max_discount_amount': 0,
        'no_expiry': 1,
        'promo_buy_qty': 1,
        'promo_is_buy_combination': '1',
        'promo_valid_any_day': 1,
        'promo_valid_days': dayOptions,
        'promo_type_id': 'BX',
        'promo_start_time': moment(new Date()).format('HH:mm'),
        'promo_end_time': moment(new Date()).format('HH:mm'),
        'valid_for_all_customers': 1,
        'valid_for_all_products': 1,
        'valid_for_customer_types': [],
        'valid_for_customers': []
      },
      'searchResultCustomerTypes': [],
      'searchResultCustomers': [],
      'searchResultProducts': [],
      'searchResultProductGroups': [],
      'searchResultProductCombos': [],
      'searchResultBrand': [],
      'dataRules': {
        'title': [
          { required: true, message: 'This is required field', trigger: 'blur' },
          { min: 2, message: 'Length should min. 2', trigger: 'blur' }
        ],
        'active_date': [
          { required: true, message: 'This is required field', trigger: 'blur' }
        ]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < new Date(moment(new Date()).format('YYYY-MM-DD'))
        }
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
        if (!data.title || !data.active_date) {
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
    },
    formData: {
      handler(data) {
        console.log(data, 'edit news')
        this.data = { ...this.data, ...data }
        this.pickerOptions = {
          disabledDate(time) {
            return time.getTime() < new Date(data.active_date)
          }
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
        with_master_product: 1,
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

    searchBrands(query) {
      //
      this.searchingProductBrand = true
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
          url: baseApi(this.selectedStore.url_id, this.langId, 'brand'),
          headers: headers,
          params: params
        }).then(response => {
          this.searchingBrand = false
          this.searchResultBrand = response.data.data.map(item => {
            return item
          })
        }).catch(() => {
          this.searchingBrand = false
          this.searchResultBrand = []
        })
      }
    },

    del_groupPromo_buy_product(key) {
      this.groupPromo_buy_product.splice(key, 1)
    },
    add_groupPromo_buy_product() {
      this.groupPromo_buy_product.push({
        'promo_buy_product_id': '',
        'promo_buy_product_id_qty': ''
      })
    },
    del_groupPromo_buy_product_group_id(key) {
      this.groupPromo_buy_product_group_id.splice(key, 1)
    },
    add_groupPromo_buy_product_group_id() {
      this.groupPromo_buy_product_group_id.push({
        'promo_buy_product_group_id': '',
        'promo_buy_product_group_id_qty': ''
      })
    },
    del_groupPromo_buy_product_combo_id(key) {
      this.groupPromo_buy_product_combo_id.splice(key, 1)
    },
    add_groupPromo_buy_product_combo_id() {
      this.groupPromo_buy_product_combo_id.push({
        'promo_buy_product_combo_id': '',
        'promo_buy_product_combo_id_qty': ''
      })
    },
    del_groupPromo_buy_brand_id(key) {
      this.groupPromo_buy_brand_id.splice(key, 1)
    },
    add_groupPromo_buy_brand_id() {
      this.groupPromo_buy_brand_id.push({
        'promo_buy_brand_id': '',
        'promo_buy_brand_id_qty': ''
      })
    },
    del_groupPromo_free_product_id(key) {
      this.groupPromo_free_product_id.splice(key, 1)
    },
    add_groupPromo_free_product_id() {
      this.groupPromo_free_product_id.push({
        'promo_free_product_id': '',
        'promo_free_product_id_qty': ''
      })
    },
    handleCheckAllDaysChange(val) {
      this.data.promo_valid_days = val ? dayOptions : []
      this.isIndeterminate = false
    },
    handleCheckedDaysChange (value) {
      let checkedCount = value.length
      this.checkAllDays = checkedCount === this.days.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.days.length
    },
    cancel() {
      this.data = {}
      this.$emit('cancel')
    },

    save() {
      const data = {
        ...this.data,
        combine_qty: this.combineQty,
        'group-promo_buy_product': [ ...this.groupPromo_buy_product ],
        'group-promo_buy_product_group_id': [ ...this.groupPromo_buy_product_group_id ],
        'group-promo_buy_product_combo_id': [ ...this.groupPromo_buy_product_combo_id ],
        'group-promo_buy_brand_id': [ ...this.groupPromo_buy_brand_id ],
        'group-promo_free_product_id': [ ...this.groupPromo_free_product_id ]
      }
      data.active24h = this.active24h

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

      data.to_allstore_id = to_allstore_id
      data.to_store_id = to_store_id
      this.$emit('save', data)
    },

    changeTimeDisabled(data) {
      this.pickerOptions = {
        disabledDate(time) {
          return time.getTime() <= new Date(data)
        }
      }
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
