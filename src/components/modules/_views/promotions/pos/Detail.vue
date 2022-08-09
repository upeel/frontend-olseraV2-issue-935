<template>
  <div v-loading="loadingsDetail">
    <div class="row">
      <div class="col-md-8">
        <el-card v-loading="loading">
          <div class="box-header with-border create-product-header">
            <h4 class="box-title">{{ lang.discount_detail }}</h4>
            <div v-if="!isEditing" class="pull-right mb-12">
              <el-button size="small" plain type="primary" @click="back">{{ lang.back }}</el-button>
              <button-action-authenticated
                :permission="['promotion/promopos', 'edit']"
                icon="el-icon-edit"
                type="primary"
                size="small"
                @click="edit('detail')">
                {{ lang.edit }}
              </button-action-authenticated>
            </div>
            <div v-else class="pull-right mb-12">
              <el-button type="text" size="small" @click="cancelEdit('detail')">{{ lang.cancel }}</el-button>
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
                :disabled="disabledButton"
                icon="el-icon-check"
                type="success"
                size="small"
                @click="saveEdit('detail')">
                {{ lang.save }}
              </el-button>
            </div>
          </div>
          <!-- <div slot="header" class="clearfix">
            <h4>{{ lang.discount_detail }}</h4>
            <div class="card-buttons">
              <template v-if="!isEditing">
                <el-button size="small" plain type="primary" @click="back">{{ lang.back }}</el-button>
                <el-button
                  icon="el-icon-edit"
                  type="primary"
                  size="small"
                  @click="edit('detail')">
                  {{ lang.edit }}
                </el-button>
              </template>
              <template v-else>
                <el-button
                  type="text"
                  size="small"
                  @click="cancelEdit('detail')">
                  {{ lang.cancel }}
                </el-button>
                <el-button
                  :disabled="disabledButton"
                  icon="el-icon-check"
                  type="success"
                  size="small"
                  @click="saveEdit('detail')">
                  {{ lang.save }}
                </el-button>
              </template>
            </div>
          </div> -->

          <div class="card-body mt-24">
            <div class="row">
              <div class="col-md-5">
                <section class="detail-section">
                  <div class="detail-item">

                    <div class="detail-label">
                      <small>{{ $lang[langId].apply_for_multiple }}</small>
                    </div>
                    <div class="detail-value">
                      <template v-if="isEditing">
                        <el-switch
                          v-model="tmp.promo_multipliable"
                          :active-value="1"
                          :inactive-value="0">
                        </el-switch>
                        <span v-if="tmp.promo_multipliable === 0">{{ lang.no }}</span>
                        <span v-if="tmp.promo_multipliable === 1">{{ lang.yes }}</span>
                      </template>
                      <template v-else>
                        <template v-if="data.promo_multipliable === 1">
                          {{ lang.yes }}
                        </template>
                        <template v-else>
                          {{ lang.no }}
                        </template>
                      </template>
                    </div>
                    <div v-if="data.promo_type_id === 'DQ'">
                      <div class="detail-label">
                        <small>{{ $lang[langId].apply_discount_to_item }}</small>
                      </div>
                      <div class="detail-value">
                        <template v-if="isEditing">
                          <el-switch
                            v-model="tmp.promo_apply_line_item"
                            :active-value="1"
                            :inactive-value="0">
                          </el-switch>
                          <span v-if="tmp.promo_apply_line_item === 0">{{ lang.no }}</span>
                          <span v-if="tmp.promo_apply_line_item === 1">{{ lang.yes }}</span>
                        </template>
                        <template v-else>
                          <template v-if="data.promo_apply_line_item === 1">
                            {{ lang.yes }}
                          </template>
                          <template v-else>
                            {{ lang.no }}
                          </template>
                        </template>
                      </div>
                    </div>
                  </div>

                  <!-- if is DQ or DA -->
                  <div
                    v-if="data.promo_type_id !== 'BX' && data.promo_type_id !== 'FI'"
                    class="detail-item"
                  >
                    <div class="detail-label">
                      <small>{{ lang.discount_amount }}</small>
                    </div>
                    <div class="detail-value">
                      <template v-if="!isEditing">
                        <template v-if="data.discount_percent > 0">
                          {{ data.fdiscount_percent }}
                        </template>
                        <template v-else>
                          {{ data.fdiscount_amount }}
                        </template>
                      </template>

                      <template v-else>
                        <el-radio-group
                          size="mini"
                          v-model="amountType">
                          <el-radio-button value="percent" label="percent">
                            % {{ $lang[langId].percent }}
                          </el-radio-button>
                          <el-radio-button value="amount" label="amount">
                            $ {{ $lang[langId].nominal }}
                          </el-radio-button>
                        </el-radio-group>
                        <div v-if="amountType === 'percent'">
                          <el-input
                            type="number"
                            :placeholder="$lang[langId].input_number"
                            v-model="tmp.discount_percent"
                            :min="0">
                          </el-input>
                        </div>
                        <div v-else>
                          <div class="el-input">
                            <input-money v-model="tmp.discount_amount" />
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>

                  <div
                    v-if="data.promo_type_id !== 'BX' && data.promo_type_id !== 'FI'"
                    class="detail-item"
                  >
                    <div class="detail-label">
                      <small>{{ $lang[langId].max_discount }}</small>
                    </div>

                    <div class="detail-value">
                      <template v-if="!isEditing">
                        {{ data.max_discount_amount }}
                      </template>
                      <input-money v-if="isEditing" v-model="tmp.max_discount_amount" />
                    </div>
                  </div>

                  <div
                    v-if="data.promo_type_id === 'DA' || data.promo_type_id === 'FI'"
                    class="detail-item"
                  >
                    <div class="detail-label">
                      <small>{{ lang.min_order_amount }}</small>
                    </div>

                    <div class="detail-value">
                      <template v-if="!isEditing">
                        {{ data.min_order_amount }}
                      </template>

                      <input-money v-if="isEditing" v-model="tmp.min_order_amount" />
                    </div>
                  </div>

                  <div class="detail-item">
                    <div class="detail-label">
                      <small>{{ lang.active_date }}</small>
                    </div>
                    <div class="detail-value">
                      <template v-if="isEditing">
                        <el-date-picker
                          v-model="tmp.active_date"
                          type="date"
                          :placeholder="$lang[langId].pick_a_day"
                          @change="changeTimeDisabled">
                        </el-date-picker>
                      </template>
                      <template v-else>
                        {{data.active_date}}
                      </template>
                    </div>
                  </div>

                  <div class="detail-item">
                    <div class="detail-label">
                      <small>{{ lang.end_date }}</small>
                    </div>
                    <template v-if="isEditing">
                      <div>
                        {{ lang.never_expires }}
                        <el-switch
                          :active-value="1"
                          :inactive-value="0"
                          v-model="tmp.no_expiry">
                        </el-switch>
                        <span v-if="tmp.no_expiry === 0">{{ lang.no }}</span>
                        <span v-if="tmp.no_expiry === 1">{{ lang.yes }}</span>
                        <div style="margin-bottom: 5px;"></div>
                      </div>
                      <el-date-picker
                        ref="picker"
                        v-if="tmp.no_expiry === 0"
                        v-model="tmp.expiry_date"
                        type="date"
                        :picker-options="pickerOptions"
                        :placeholder="$lang[langId].pick_a_day">
                      </el-date-picker>
                      <el-date-picker
                        v-else
                        :disabled="true"
                        v-model="tmp.expiry_date"
                        type="date"
                        :placeholder="$lang[langId].pick_a_day">
                      </el-date-picker>
                    </template>
                    <template v-else>
                      <div class="detail-value">
                        <template v-if="data.no_expiry === 1">
                          {{ lang.no_limit }}
                        </template>
                        <template v-else>
                          {{data.expiry_date}}
                        </template>
                      </div>
                    </template>
                  </div>

                  <div class="detail-item">
                    <div class="detail-label">
                      <small>{{ $lang[langId].valid_on_days }}</small>
                    </div>
                    <div class="detail-value">
                      <template v-if="isEditing">
                        <el-checkbox
                          :indeterminate="isIndeterminate"
                          v-model="checkAllDays"
                          @change="handleCheckAllDaysChange">
                          {{ lang.check_all }}
                        </el-checkbox>
                        <div style="margin: 15px 0;"></div>
                        <el-checkbox-group
                          v-model="tmp.promo_valid_days"
                          @change="handleCheckedDaysChange">
                          <ul class="list-unstyled">
                            <li v-for="(day) in days" :key="day">
                              <el-checkbox
                                :label="day"
                                :key="day">
                                {{day}}
                              </el-checkbox>
                            </li>
                          </ul>
                        </el-checkbox-group>
                      </template>
                      <template v-else>
                        <template v-if="data.promo_valid_any_day === 1">
                          {{ lang.all }} {{ lang.days }}
                        </template>
                        <template v-else>
                          <ul class="list-unstyled">
                            <li v-for="(day, key) in data.promo_valid_days" :key="key">
                              {{day}}
                            </li>
                          </ul>
                        </template>
                      </template>
                    </div>
                  </div>

                  <div class="detail-item">
                    <!-- <div class="detail-label">
                      <small>Jam Berlaku</small>
                    </div> -->
                    <template v-if="isEditing">
                      {{ $lang[langId].apply_24_hours }}
                      <el-switch v-model="active24h"></el-switch>
                      <div style="margin-bottom: 5px;"></div>
                      <div>
                        <el-time-picker
                          :disabled="active24h"
                          v-model="tmp.promo_start_time"
                          :placeholder="lang.start"
                          :picker-options="{
                            format: 'HH:mm'
                          }"
                          @change="timeChange">
                        </el-time-picker>
                      </div>
                      <div><small>{{ $lang[langId].to_date }}</small></div>
                      <div>
                        <el-time-picker
                          :disabled="active24h"
                          v-model="tmp.promo_end_time"
                          :placeholder="lang.end"
                          :picker-options="{
                            format: 'HH:mm'
                          }">
                        </el-time-picker>
                      </div>
                    </template>
                    <template v-else>
                      <div class="detail-value">
                        {{data.promo_start_time}} - {{data.promo_end_time}}
                      </div>
                    </template>
                  </div>
                </section><!-- .detail-section -->
              </div><!-- .pull-left -->
              <div class="col-md-7">
                <template v-if="!isEditing" >
                  <div class="discount-badge">
                    <!-- <span class="discount-badge--title">{{data.promo_type_id}}</span> -->
                    <span class="discount-badge--desc">
                      <template v-if="data.promo_type_id === 'BX'">
                        {{ $lang[langId].type_promotion_bx }}
                      </template>
                      <template v-else-if="data.promo_type_id === 'DA'">
                        {{ $lang[langId].type_promotion_da }}
                      </template>
                      <template v-else-if="data.promo_type_id === 'DQ'">
                        {{ $lang[langId].type_promotion_dq }}
                      </template>
                      <template v-else-if="data.promo_type_id === 'FI'">
                        {{ $lang[langId].type_promotion_fi }}
                      </template>
                    </span>
                    <span class="discount-badge--content">{{data.title}}</span>
                  </div>
                </template>
                <template v-else>
                  <div class="detail-item">
                    <div class="detail-label">
                      <small>{{ lang.title }}</small>
                    </div>
                    <div class="detail-value">
                      <el-input
                        type="text"
                        v-model="tmp.title"
                        style="width: 100%;">
                      </el-input>
                    </div>
                  </div>
                </template>
              </div><!-- .col-sm-4 -->
            </div>
          </div>

          <div class="card-footer">
            <button-action-authenticated
              :disabled="disabledButton"
              :permission="['promotion/promopos', 'destroy']"
              type="bordered-danger"
              @click="remove"
              icon="el-icon-delete">
              {{ $lang[langId].delete }}
            </button-action-authenticated>
          </div>
        </el-card>
      </div>

      <div class="col-md-4">
        <el-card v-loading="loading">
          <div slot="header" class="clearfix">
            <h4>{{ $lang[langId].discount_rules }}</h4>
            <!-- <div class="card-buttons">
              <template v-if="!isEditingRule">
                <el-button
                  size="small"
                  type="primary"
                  icon="el-icon-edit"
                  @click="edit('rules')">
                  {{ lang.edit }}
                </el-button>
              </template>
              <template v-else>
                <el-button
                  size="small"
                  type="text"
                  @click="cancelEdit('rules')">
                  {{ lang.cancel }}
                </el-button>
                <el-button
                  size="small"
                  icon="el-icon-check"
                  type="success"
                  @click="saveEdit('rule')">
                  {{ lang.save }}
                </el-button>
              </template>
            </div> -->
          </div>

          <div class="card-body">
            <div v-if="data.promo_type_id !== 'DA' && data.promo_type_id !== 'FI'">

              <div
                v-if="isEditingRule"
                class="valid-for-all"
              >
                <!-- <p style="margin-bottom: 20px;">
                  {{ $lang[langId].valid_all_product }}
                  <el-switch
                    :active-value="1"
                    :inactive-value="0"
                    v-model="tmp.valid_for_all_products"
                  />
                </p> -->
                <template v-if="data.promo_type_id !== 'DA' && data.promo_type_id !== 'FI'">
                  <p style="margin-bottom: 20px;">
                    {{ $lang[langId].combine_qty_below }}
                    <el-switch
                      :active-value="1"
                      :inactive-value="0"
                      v-model="tmp.valid_for_all_products"
                    />
                    <el-input v-model="tmp.promo_buy_qty" :disabled="tmp.valid_for_all_products === 1 ? false : true" />
                  </p>

                  <p style="margin-bottom: 20px;">
                    {{ $lang[langId].promo_valid }}
                    <el-radio
                      v-model="tmp.promo_is_buy_combination"
                      :value="0"
                      :label="0"
                    >
                      {{ $lang[langId].once_of_product_below}}
                    </el-radio>

                    <el-radio
                      v-model="tmp.promo_is_buy_combination"
                      :value="1"
                      :label="1"
                    >
                      {{ $lang[langId].all_product_below }}
                    </el-radio>
                  </p>

                  <hr>
                </template>
              </div>

              <p>
                <i class="el-icon-check"></i> {{ lang.valid_for_product_groups }}:
              </p>

              <!-- <el-alert
                v-if="data.valid_for_all_products || (isEditingRule && tmp.valid_for_all_products)"
                :title="$lang[langId].valid_all_product"
                :closable="false"
                show-icon
                type="success"
              /> -->

              <ul
                v-if="!isEditingRule"
                class="list-unstyled list-stripped list-table">
                <li
                  v-for="(item, idx) in data.valid_product_groups"
                  :key="idx"
                  class="list-item-relative">
                  <strong>{{item.name}}</strong> ({{ item.qty }})
                </li>
              </ul>

              <ul
                v-else
                class="list-unstyled list-stripped list-table">
                <li
                  v-for="(item, idx) in tmp.valid_product_groups"
                  :key="idx"
                  class="list-item-relative">
                  <strong>{{item.name}}</strong>
                  <span class="absolute-right">
                    <el-button
                      @click="removeProductGroup(idx)"
                      type="text">
                      <i class="el-icon-close"></i>
                    </el-button>
                  </span>
                  <el-input v-model="item.qty" :disabled="tmp.valid_for_all_products === 0 ? false : true" v-if="!tmp.valid_for_all_products" />
                </li>
              </ul>

              <div
                v-if="isEditingRule"
                class="add-discount-customer px-20"
              >
                <el-select
                  v-model="fresh.valid_product_groups"
                  :placeholder="lang.info_auto_complete_product_group"
                  :remote-method="searchProductGroups"
                  :loading="searchingProductGroups"
                  multiple
                  filterable
                  remote
                  reserve-keyword
                  style="width: 100%;"
                  @change="handleAddGroup"
                >
                  <el-option
                    v-for="(item) in searchResultProductGroups"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </div>

              <hr/>

              <p>
                <i class="el-icon-check"></i> {{ lang.valid_for_products }}:
              </p>

              <!-- <el-alert
                v-if="data.valid_for_all_products || (isEditingRule && tmp.valid_for_all_products)"
                :title="$lang[langId].valid_all_product"
                :closable="false"
                show-icon
                type="success"
              /> -->

              <ul
                v-if="!isEditingRule"
                class="list-unstyled list-stripped list-table">
                <li
                  v-for="(item, idx) in data.valid_products"
                  :key="idx"
                  class="list-item-relative">
                  <strong>{{item.name}}</strong><strong v-if="item.variant_name !== ''"> - {{ item.variant_name }}</strong> ({{ item.qty }})
                </li>
              </ul>

              <ul
                v-else
                class="list-unstyled list-stripped list-table">
                <li
                  v-for="(item, idx) in tmp.valid_products"
                  :key="idx"
                  class="list-item-relative">
                  <strong>{{item.name}}</strong><strong v-if="item.variant_name !== ''"> - {{ item.variant_name }}</strong> ({{ item.qty }})
                  <span class="absolute-right">
                    <el-button
                      @click="removeProduct(idx)"
                      type="text">
                      <i class="el-icon-close"></i>
                    </el-button>
                  </span>
                  <el-input v-model="item.qty" :disabled="tmp.valid_for_all_products === 0 ? false : true" v-if="!tmp.valid_for_all_products"/>
                </li>
              </ul>

              <div v-if="isEditingRule" class="add-discount-customer px-20">
                <el-select
                  style="width: 100%;"
                  v-model="fresh.valid_products"
                  multiple
                  filterable
                  remote
                  reserve-keyword
                  :placeholder="lang.info_auto_complete_product"
                  :remote-method="searchProducts"
                  :loading="searchingProducts"
                  @change="handleAddProduct">
                  <el-option
                    v-for="(item) in searchResultProducts"
                    :key="item.product_id"
                    :label="item.name"
                    :value="item.product_id">
                  </el-option>
                </el-select>
              </div>

            <hr/>

            <p>
                <i class="el-icon-check"></i> {{ lang.valid_for_product_combos }}:
              </p>

              <!-- <el-alert
                v-if="data.valid_for_all_products || (isEditingRule && tmp.valid_for_all_products)"
                :title="$lang[langId].valid_all_product"
                :closable="false"
                show-icon
                type="success"
              /> -->

              <ul
                v-if="!isEditingRule"
                class="list-unstyled list-stripped list-table">
                <li
                  v-for="(item, idx) in data.valid_products_combos"
                  :key="idx"
                  class="list-item-relative">
                  <strong>{{item.name}}</strong> ({{ item.qty }})
                </li>
              </ul>

              <ul
                v-else
                class="list-unstyled list-stripped list-table">
                <li
                  v-for="(item, idx) in tmp.valid_products_combos"
                  :key="idx"
                  class="list-item-relative">
                  <strong>{{item.name}}</strong> ({{ item.qty }})
                  <span class="absolute-right">
                    <el-button
                      @click="removeProductCombo(idx)"
                      type="text">
                      <i class="el-icon-close"></i>
                    </el-button>
                  </span>
                  <el-input v-model="item.qty" :disabled="tmp.valid_for_all_products === 0 ? false : true" v-if="!tmp.valid_for_all_products"/>
                </li>
              </ul>

              <div v-if="isEditingRule" class="add-discount-customer px-20">
                <el-select
                  style="width: 100%;"
                  v-model="fresh.valid_products_combos"
                  multiple
                  filterable
                  remote
                  reserve-keyword
                  :placeholder="$lang[langId].info_auto_complete_product_combos"
                  :remote-method="searchProductCombos"
                  :loading="searchingProductCombos"
                  @change="handleAddCombos">
                  <el-option
                    v-for="(item) in searchResultProductCombos"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>

              <hr/>

            <p>
                <i class="el-icon-check"></i> {{ lang.valid_for_brands }}:
              </p>

              <!-- <el-alert
                v-if="data.valid_for_all_products || (isEditingRule && tmp.valid_for_all_products)"
                :title="$lang[langId].valid_all_product"
                :closable="false"
                show-icon
                type="success"
              /> -->

              <ul
                v-if="!isEditingRule"
                class="list-unstyled list-stripped list-table">
                <li
                  v-for="(item, idx) in data.valid_brand"
                  :key="idx"
                  class="list-item-relative">
                  <strong>{{item.name}}</strong> ({{ item.qty }})
                </li>
              </ul>

              <ul
                v-else
                class="list-unstyled list-stripped list-table">
                <li
                  v-for="(item, idx) in tmp.valid_brand"
                  :key="idx"
                  class="list-item-relative">
                  <strong>{{item.name}}</strong> ({{ item.qty }})
                  <span class="absolute-right">
                    <el-button
                      @click="removeBrand(idx)"
                      type="text">
                      <i class="el-icon-close"></i>
                    </el-button>
                  </span>
                  <el-input v-model="item.qty" :disabled="tmp.valid_for_all_products === 0 ? false : true" v-if="!tmp.valid_for_all_products"/>
                </li>
              </ul>

              <div v-if="isEditingRule" class="add-discount-customer px-20">
                <el-select
                  style="width: 100%;"
                  v-model="fresh.valid_brand"
                  multiple
                  filterable
                  remote
                  reserve-keyword
                  :placeholder="$lang[langId].info_auto_complete_brand"
                  :remote-method="searchBrand"
                  :loading="searchingBrand"
                  @change="handleAddbrand">
                  <el-option
                    v-for="(item) in searchResultBrand"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </div>

            <hr/>

            <!-- customers -->
            <div class="valid-for-all" style="margin-bottom: 10px;">
              <template v-if="isEditingRule">
                <p>
                  {{ $lang[langId].valid_all_customer }}
                  <el-switch
                    :active-value="1"
                    :inactive-value="0"
                    v-model="tmp.valid_for_all_customers">
                  </el-switch>
                </p>
              </template>
            </div>

            <i class="el-icon-check"></i> {{ lang.valid_for_customer_types }}:

            <template v-if="data.valid_for_all_customers && tmp.valid_for_all_customers">
              <el-alert
                :title="$lang[langId].valid_all_customer"
                :closable="false"
                type="success"
                show-icon
              />
            </template>

            <ul
              v-if="!isEditingRule"
              class="list-unstyled list-stripped list-table">
              <li
                v-for="(item, idx) in data.valid_customer_types"
                :key="idx"
                class="list-item-relative">
                <strong>{{item.name}}</strong>
              </li>
            </ul>

            <ul
              v-else
              class="list-unstyled list-stripped list-table"
            >
              <template v-if="!tmp.valid_for_all_customers">
              <li
                v-for="(item, idx) in tmp.valid_customer_types"
                :key="idx"
                class="list-item-relative">
                <strong>{{item.name}}</strong>
                <span class="absolute-right">
                  <el-button
                    @click="removeCustomerType(idx)"
                    type="text">
                    <i class="el-icon-close"></i>
                  </el-button>
                </span>
              </li>
              </template>
            </ul>

            <div v-if="isEditingRule" class="add-discount-customer px-20">
              <el-select
                v-if="tmp.valid_for_all_customers === 0"
                style="width: 100%;"
                v-model="fresh.valid_customer_types"
                multiple
                filterable
                remote
                reserve-keyword
                :placeholder="$lang[langId].please_input + lang.customer_type"
                :remote-method="searchCustomerTypes"
                :loading="searchingCustomerTypes">
                <el-option
                  v-for="(item) in searchResultCustomerTypes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>

            <hr/>

            <i class="el-icon-check"></i> {{ lang.valid_for_customers }}:
            <template v-if="data.valid_for_all_customers && tmp.valid_for_all_customers">
              <el-alert
                :title="$lang[langId].valid_all_customer"
                :closable="false"
                type="success"
                show-icon
              />
            </template>

            <ul
              v-if="!isEditingRule"
              class="list-unstyled list-stripped list-table"
            >
              <li
                v-for="(item, idx) in data.valid_customers"
                :key="idx"
                class="list-item-relative">
                <strong>{{item.name}}</strong>
              </li>
            </ul>

            <ul
              v-else
              class="list-unstyled list-stripped list-table"
            >
              <template v-if="tmp.valid_for_all_customers === 0">
              <li
                v-for="(item, idx) in tmp.valid_customers"
                :key="idx"
                class="list-item-relative">
                <strong>{{item.name}}</strong>
                <span class="absolute-right">
                  <el-button
                    @click="removeCustomer(idx)"
                    type="text">
                    <i class="el-icon-close"></i>
                  </el-button>
                </span>
              </li>
              </template>
            </ul>

            <div v-if="isEditingRule" class="add-discount-customer px-20">
              <el-select
                v-if="tmp.valid_for_all_customers === 0"
                style="width: 100%;"
                v-model="fresh.valid_customers"
                multiple
                filterable
                remote
                reserve-keyword
                :placeholder="$lang[langId].please_input + lang.customer"
                :remote-method="searchCustomers"
                :loading="searchingCustomers">
                <el-option
                  v-for="(item) in searchResultCustomers"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>

            

            <hr/>

            <template v-if="data.promo_type_id === 'BX' || data.promo_type_id === 'FI'">
              <!-- free products -->
              <i class="el-icon-check"></i> {{ lang.free_product }}

              <ul
                v-if="!isEditingRule"
                class="list-unstyled list-stripped list-table">
                <li
                  v-for="(item, idx) in data.free_products"
                  :key="idx"
                  class="list-item-relative">
                  <strong>{{item.name}}</strong> {{ item.qty }}
                </li>
              </ul>

              <ul
                v-else
                class="list-unstyled list-stripped list-table">
                <li
                  v-for="(item, idx) in tmp.free_products"
                  :key="idx"
                  class="list-item-relative">
                  <strong>{{item.name}}</strong>
                  <span class="absolute-right">
                    <el-button
                      @click="removeFreeProduct(idx)"
                      type="text">
                      <i class="el-icon-close"></i>
                    </el-button>
                  </span>
                  <el-input v-model="item.qty" />
                </li>
              </ul>

              <div v-if="isEditingRule" class="add-discount-customer px-20">
                <el-select
                  style="width: 100%;"
                  v-model="fresh.free_products"
                  filterable
                  remote
                  reserve-keyword
                  :placeholder="lang.add_free_products"
                  :remote-method="searchFreeProduct"
                  :loading="loadingFreeProduct">
                    <el-option
                      v-for="item in searchResultFree"
                      :key="item.product_id"
                      :label="item.name"
                      :value="item.product_id">
                    </el-option>
                </el-select>
                <el-input
                  type="number"
                  :min="1"
                  :placeholder="lang.qty"
                  v-model="fresh.qty_free_product">
                </el-input>
              </div>
            </template>

          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { baseApi } from 'src/http-common'
import axios from 'axios'
import InputMoney from '@/components/InputMoneyV2'
import { checkCustomPermission } from '@/mixins/checkCustomPermission'

import basicComputedMixin from '@/mixins/basicComputedMixin'

var moment = require('moment')
const dayOptions = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
export default {
  props: ['loadingDetail', 'formData'],
  mixins: [checkCustomPermission, basicComputedMixin],
  components: {
    draggable,
    InputMoney
  },
  data() {
    return {
      active24h: false,
      loadingsDetail: false,
      loading: false,
      isEditing: false,
      isEditingRule: false,
      loadingRules: false,
      disabledButton: false,
      searchingCustomerTypes: false,
      searchingCustomers: false,
      searchingProductCombos: false,
      searchingBrand: false,
      searchingProducts: false,
      searchingProductGroups: false,
      loadingFreeProduct: false,
      searchResultCustomerTypes: [],
      searchResultCustomers: [],
      searchResultProducts: [],
      searchResultProductCombos: [],
      searchResultBrand: [],
      searchResultProductGroups: [],
      searchResultFree: [],
      checkAllDays: false,
      days: dayOptions,
      isIndeterminate: true,
      data: {},
      tmp: {
      },
      fresh: {
        valid_customers: [],
        valid_customer_types: [],
        valid_products: [],
        valid_product_groups: [],
        valid_products_combos: [],
        valid_brand: [],
        free_products: [],
        qty_free_product: 1
      },
      amountType: '',
      test: new Date('2018-04-20'),
      pickerOptions: {},
      endTime: '',
      tempEdit: {
        product_groups: [],
        products: [],
        product_combos: [],
        product_brand: []
      },
      outlets: [
        {
          name: this.$store.state.userStores.lang.all,
          store_id: 0,
          url_id: 'all'
        }
      ],
      storeToBeSaved: [],
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
    timeDisabled() {
      // return new Date(this.tmp.factive_date)
      return this.formData.factive_date
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
    loadingDetail: {
      handler(bool) {
        if (bool === true) {
          this.loadingsDetail = true
        } else {
          this.loadingsDetail = false
        }
      },
      deep: true
    },

    formData: {
      handler(data) {
        this.data = {...data}
        // this.tmp = { ...this.data }
        this.pickerOptions = {
          disabledDate(time) {
            return time.getTime() < new Date(data.factive_date)
          }
        }
        this.endTime = data.promo_start_time + ' - ' + data.promo_end_time
        this.onLoadData()
        console.log('formData change')
      },
      deep: true,
      immediate: true
    },

    'tmp.valid_for_all_products': function(data) {
      // this.tmp.valid_product_groups = []
      // this.tmp.valid_products = []
    }
  },

  beforeMount() {
    this.handleCustomPermissionSinglePage('promotion/promopos', 'show')
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
  },

  methods: {
    onLoadData() {
      if (this.data.discount_percent > 0) {
        this.amountType = 'percent'
      } else {
        this.amountType = 'amount'
      }

      if (this.data.promo_valid_days) {
        let promoValidDays = []
        promoValidDays = this.data.promo_valid_days.split(',')
        this.data.promo_valid_days = promoValidDays
      } else if (this.data.promo_valid_any_day === 1) {
        this.data.promo_valid_days = this.days
      }

      if (this.data.promo_start_time === '00:00:00' && this.data.promo_end_time === '23:59:00') {
        this.active24h = true
      } else {
        this.active24h = false
      }

      this.fresh.valid_customer_types = []
      this.fresh.valid_customers = []
      this.fresh.valid_product_groups = []
      this.fresh.valid_products = []
      this.fresh.valid_products_combos = []
      this.fresh.valid_brand = []
      this.fresh.free_products = []
      this.fresh.qty_free_product = 1
    },

    back() {
      this.data = {}
      this.tmp = {}
      this.$emit('back')
    },

    remove() {
      this.$emit('remove', this.data)
    },

    edit(block) {
      this.loadData()
      // if (block === 'detail') {
        this.isEditing = true
      // } else {
        this.getTemporaryDataEdit()
        this.isEditingRule = true
      // }
    },

    getTemporaryDataEdit () {
      // add check for nullable type
      // get valid product groups
      if (this.tmp.valid_product_groups) {
        this.tmp.valid_product_groups.map(i => {
          this.tempEdit.product_groups.push({
            id: i.id,
            name: i.name,
            qty: i.qty
          })
        })
      } else {
        this.tempEdit.product_groups = []
      }

      // get valid products
      if (this.tmp.valid_products) {
        this.tmp.valid_products.map(i => {
          if (i.variant_id === null) {
            this.tempEdit.products.push({
              id: i.id,
              product_id: i.product_id,
              name: i.name,
              qty: i.qty
            })
          } else {
            this.tempEdit.products.push({
              id: i.variant_id,
              product_id: i.product_id,
              name: i.name,
              qty: i.qty
            })
          }
        })
      } else {
        this.tempEdit.products = []
      }

      // get valid product combos
      if (this.tmp.valid_products_combos) {
        this.tmp.valid_products_combos.map(i => {
          this.tempEdit.product_combos.push({
            id: i.id,
            name: i.name,
            qty: i.qty
          })
        })
      } else {
        this.tempEdit.product_combos = []
      }

      // get valid brand
      if (this.tmp.valid_brand) {
        this.tmp.valid_brand.map(i => {
          this.tempEdit.product_brand.push({
            id: i.id,
            name: i.name,
            qty: i.qty
          })
        })
      } else {
        this.tempEdit.product_brand = []
      }
    },

    loadData() {
      this.tmp = Object.assign({}, this.data)
      this.tmp.min_order_amount = Number.parseInt(this.tmp.min_order_amount, 0)
      this.tmp.discount_amount = Number.parseInt(this.tmp.discount_amount, 0)
      this.tmp.active_date = moment(this.tmp.active_date)
      if (this.tmp.expiry_date !== null) {
        this.tmp.expiry_date = moment(this.tmp.expiry_date)
      } else {
        this.tmp.expiry_date = moment(new Date()).format('YYYY-MM-DD')
      }
      this.tmp.promo_start_time = moment('08/05/2015 ' + this.tmp.promo_start_time).format()
      this.tmp.promo_end_time = moment('08/05/2015 ' + this.tmp.promo_end_time).format()

      console.log(this.tmp)
    },

    saveEdit(block) {
      //
      this.loading = true
      let promise = new Promise((resolve, reject) => {
        this.update(resolve, reject)
      })
      promise.then(response => {
        // if (block === 'detail') {
          this.isEditing = false
        // } else {
          this.isEditingRule = false
        // }
        this.loading = false
        this.onLoadData()
        this.handleResetData()
      }).catch((error) => {
        this.loading = false
        console.log('errrr', error)
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    cancelEdit(block) {
      // if (block === 'detail') {
        this.isEditing = false
      // } else {
        this.isEditingRule = false
        this.handleResetData()
        this.onLoadData()
      // }
    },

    handleResetData() {
        this.data.valid_products = this.tempEdit.products
        this.data.valid_product_groups = this.tempEdit.product_groups
        this.data.valid_products_combos = this.tempEdit.product_combos
        this.data.valid_brand = this.tempEdit.product_brand

        this.tmp.valid_products = this.tempEdit.products
        this.tmp.valid_product_groups = this.tempEdit.product_groups
        this.tmp.valid_products_combos = this.tempEdit.product_combos
        this.tmp.valid_brand = this.tempEdit.product_brand

        this.tempEdit = {
          product_groups: [],
          products: [],
          product_combos: [],
          product_brand: []
        }
    },

    update(resolve, reject) {
      // this.tmp.free_products = this.fresh
      let data = Object.assign({}, this.tmp)

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

      console.log(data, 'before anything')
      if (data.promo_valid_days.length === 7) {
        data.promo_valid_any_day = 1
      } else {
        data.promo_valid_any_day = 0
      }

      if (data.promo_type_id !== 'BX') {
        if (this.amountType === 'percent') {
          data.discount_amount = 0
        } else {
          data.discount_percent = 0
        }
      }
      if (typeof data.promo_valid_days !== 'string') {
        data.promo_valid_days = data.promo_valid_days.join(',')
      }
      data.active_date = moment(data.active_date).format('YYYY-MM-DD')
      data.no_expiry === 1 ? data.expiry_date = null : data.expiry_date = moment(data.expiry_date).format('YYYY-MM-DD')

      // check overlap time
      if (data.active_date > data.expiry_date) {
        console.log('overlap')
        this.$notify({
          type: 'warning',
          title: 'Error',
          message: 'Overlap time'
        })
        this.loading = false
        return false
      }

      if (this.active24h) {
        data.promo_start_time = moment('00:00:00', 'HH:mm:ss').format('HH:mm:ss')
        data.promo_end_time = moment('23:59:00', 'HH:mm:ss').format('HH:mm:ss')
      } else {
        data.promo_start_time = moment(data.promo_start_time).format('HH:mm')
        data.promo_end_time = moment(data.promo_end_time).format('HH:mm')

        // check overlap time
        if (data.promo_start_time > data.promo_end_time) {
          console.log('overlap')
          this.$notify({
            type: 'warning',
            title: 'Error',
            message: 'Overlap time'
          })
          this.loading = false
          return false
        }
      }

      /**
       * group promo free product
       */
      this.$set(data, 'group-promo_free_product_id', [])
      if(data.free_products) {
        data['group-promo_free_product_id'] = data.free_products.map(item => {
          let dataId = ''
          if (item.variant_id !== null) { dataId = item.id + ' | ' + item.variant_id }
          else { dataId = item.id }
          return {
            'promo_free_product_id': dataId,
            'promo_free_product_id_qty': parseInt(item.qty)
          }
        })
      }
      if (this.fresh.free_products) {
        data['group-promo_free_product_id'].push({
          'promo_free_product_id': this.fresh.free_products,
          'promo_free_product_id_qty': this.fresh.qty_free_product
        })
      }
      this.$delete(data, 'free_products')

      /**
       * Promo Buy Products
       */
      this.$set(data, 'group-promo_buy_product', [])
      data['group-promo_buy_product'] = data.valid_products.map(item => {
        let dataId = ''
        if (item.variant_id !== null) { dataId = item.id + ' | ' + item.variant_id }
        else { dataId = item.id }
        return {
          'promo_buy_product_id': dataId,
          'promo_buy_product_id_qty': parseInt(item.qty)
        }
      })
      this.$delete(data, 'valid_products')

      /**
       * Promo Buy Products Combos
       */
      this.$set(data, 'group-promo_buy_product_combo_id', [])
      data['group-promo_buy_product_combo_id'] = data.valid_products_combos.map(item => {
        return {
          'promo_buy_product_combo_id': item.id,
          'promo_buy_product_combo_id_qty': parseInt(item.qty)
        }
      })
      this.$delete(data, 'valid_products_combos')

      /**
       * Promo Buy Brand
       */
      this.$set(data, 'group-promo_buy_brand_id', [])
      data['group-promo_buy_brand_id'] = data.valid_brand.map(item => {
        return {
          'promo_buy_brand_id': item.id,
          'promo_buy_brand_id_qty': parseInt(item.qty)
        }
      })
      this.$delete(data, 'valid_brand')

      /**
       * Promo Buy Product Group
       */
      this.$set(data, 'group-promo_buy_product_group_id', [])
      data['group-promo_buy_product_group_id'] = data.valid_product_groups.map(item => {
        return {
          'promo_buy_product_group_id': item.id,
          'promo_buy_product_group_id_qty': parseInt(item.qty)
        }
      })
      this.$delete(data, 'valid_product_groups')

      /**
       * if combine qty
       */
      if (data.valid_for_all_products) {
        data['group-promo_buy_product_group_id'].map(item => {
          item.promo_buy_product_group_id_qty = data.promo_buy_qty
        })

        data['group-promo_buy_product'].map(item => {
          item.promo_buy_product_id_qty = data.promo_buy_qty
        })
      }

      /**
       * Valid Customers
       */
      data.valid_for_customers = data.valid_customers.map(item => {
        return item.id
      })
      if (this.fresh.valid_customers.length > 0) {
        data.valid_for_customers.push(
          this.fresh.valid_customers.map(item => {
            return item
          })
        )
      }
      data.valid_for_customers = data.valid_for_customers.join(',')
      this.$delete(data, 'valid_customers')

      /**
       * Valid Customer Types
       */
      data.valid_for_customer_types = data.valid_customer_types.map(item => {
        return item.id
      })
      if (this.fresh.valid_customer_types.length > 0) {
        data.valid_for_customer_types.push(
          this.fresh.valid_customer_types.map(item => {
            return item
          })
        )
      }
      data.valid_for_customer_types = data.valid_for_customer_types.join(',')
      this.$delete(data, 'valid_customer_types')

      console.log('send :', data)

      /**
       * Start update
       */

      this.loadingsDetail = true

      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'promosi-pos/update/' + this.data.id),
        headers,
        data
      }).then(response => {
        this.data = { ...response.data.data}
        this.$emit('update', response.data.data)
        this.fresh.valid_customer_types = []
        this.fresh.valid_customers = []
        this.fresh.valid_product_groups = []
        this.fresh.valid_products_combos = []
        this.fresh.valid_brand = []
        this.fresh.valid_products = []
        this.fresh.free_products = []
        this.fresh.qty_free_product = 1
        resolve(response)
        this.$message({
          type: 'success',
          message: 'Saved..'
        })
        this.loadingsDetail = false
      }).catch((error) => {
        this.loadingsDetail = false
        reject(error)
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    removeCustomerType(idx) {
      this.tmp.valid_customer_types.splice(idx, 1)
    },
    removeCustomer(idx) {
      this.tmp.valid_customers.splice(idx, 1)
    },
    removeProductGroup(idx) {
      this.tmp.valid_product_groups.splice(idx, 1)
    },
    removeProduct(idx) {
      this.tmp.valid_products.splice(idx, 1)
    },
    removeProductCombo(idx) {
      this.tmp.valid_products_combos.splice(idx, 1)
    },
    removeBrand(idx) {
      this.tmp.valid_brand.splice(idx, 1)
    },
    removeFreeProduct(idx) {
      let data = { ...this.tmp}
      this.tmp.free_products.splice(idx, 1)
      // this.loadDataChange(data)
    },
    handleCheckAllDaysChange(val) {
      this.tmp.promo_valid_days = val ? dayOptions : []
      this.isIndeterminate = false
    },
    handleCheckedDaysChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.days.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.days.length
    },

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
      //
      this.searchingBrand = true
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
    searchFreeProduct(query) {
      //
      this.loadingFreeProduct = true
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
          this.loadingFreeProduct = false
          this.searchResultFree = response.data.data.map(item => {
            return item
          })
        }).catch(() => {
          this.loadingFreeProduct = false
          this.searchResultFree = []
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
    changeTimeDisabled(data) {
      this.pickerOptions = {
        disabledDate(time) {
          return time.getTime() <= new Date(data)
        }
      }
      // this.$nextTick(_ => {
      //   this.$refs.picker.picker.date = new Date(this.tmp.fexpiry_date)
      // })
    },
    timeChange(data) {
      var d = new Date(data)
      d.setTime(d.getTime() + 1000 * 60);
      var t = '0' + d.getHours() + ':0' + d.getMinutes() + ':0' + d.getSeconds()
      this.endTime = t + ' - 23:59:00' 
    },

    handleAddbrand () {
      this.searchResultBrand.map(i => {
        this.fresh.valid_brand.map(j => {
          if (i.id === j) {
            console.log('bx', i)
            this.tmp.valid_brand.push({
              discount_voucher_id: this.tmp.id,
              id: i.id,
              name: i.name,
              qty: 1
            })
          }
        })
      })
    },

    handleAddCombos () {
      this.searchResultProductCombos.map(i => {
        this.fresh.valid_products_combos.map(j => {
          if (i.id === j) {
            this.tmp.valid_products_combos.push({
              discount_voucher_id: this.tmp.id,
              id: i.id,
              name: i.name,
              qty: 1
            })
          }
        })
      })
    },

    handleAddProduct () {
      this.searchResultProducts.map(i => {
        this.fresh.valid_products.map(j => {
          if (i.product_id === j) {
            this.tmp.valid_products.push({
              discount_voucher_id: this.tmp.id,
              id: i.product_id,
              name: i.name,
              variant_id: i.variant_id,
              variant_name: i.variant_name,
              qty: 1
            })
          }
        })
      })
    },

    handleAddGroup () {
      this.searchResultProductGroups.map(i => {
        this.fresh.valid_product_groups.map(j => {
          if (i.id === j) {
            this.tmp.valid_product_groups.push({
              discount_voucher_id: this.tmp.id,
              id: i.id,
              name: i.name,
              qty: 1
            })
          }
        })
      })
    },

    loadDataChange (data) {
      this.tmp = { ...data}
      this.tmp.min_order_amount = Number.parseInt(this.tmp.min_order_amount, 0)
      this.tmp.discount_amount = Number.parseInt(this.tmp.discount_amount, 0)
      this.tmp.active_date = moment(this.tmp.active_date)
      if (this.tmp.expiry_date !== null) {
        this.tmp.expiry_date = moment(this.tmp.expiry_date)
      } else {
        this.tmp.expiry_date = moment(new Date()).format('YYYY-MM-DD')
      }
      this.tmp.promo_start_time = moment('08/05/2015 ' + this.tmp.promo_start_time).format()
      this.tmp.promo_end_time = moment('08/05/2015 ' + this.tmp.promo_end_time).format()
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
  }

}
</script>
