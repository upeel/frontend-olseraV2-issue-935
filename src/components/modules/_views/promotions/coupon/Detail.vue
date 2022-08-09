<template>
  <div v-loading="loadingsDetail">
    <div class="row">
      <div class="col-md-8">
        <el-card v-loading="loading" class="box">
          <div class="box-header with-border create-product-header">
            <h4 class="box-title">{{ lang.discount_detail }}</h4>
            <div v-if="!isEditing" class="pull-right mb-12">
              <el-button size="small" plain type="primary" @click="back">{{ lang.back }}</el-button>
              <button-action-authenticated
                :permission="['promotion/discountvoucher', 'edit']"
                icon="el-icon-edit"
                type="primary"
                size="small"
                @click="edit">
                {{ lang.edit }}
              </button-action-authenticated>
            </div>
            <div v-else class="pull-right mb-12">
              <el-button type="text" size="small" @click="cancelEdit">{{ lang.cancel }}</el-button>
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
                @click="saveEdit">
                {{ lang.save }}
              </el-button>
            </div>
          </div>

          <div class="card-body">
            <div class="row mt-24">
              <div class="col-md-4">
                <section class="detail-section">
                  <div class="detail-item">
                    <div class="detail-label">
                      <small>{{ lang.code }}</small>
                    </div>
                    <div class="detail-value">
                      <template v-if="isEditing">
                        <el-input type="text" v-model="tmp.code"></el-input>
                      </template>
                      <template v-else>
                        {{data.code}}
                      </template>
                    </div>
                  </div>

                  <div class="detail-item" v-if="isEditing">
                    <div class="detail-label">
                      <small>{{ lang.title }}</small>
                    </div>
                    <div class="detail-value">
                      <template>
                        <el-input type="text" v-model="tmp.title"></el-input>
                      </template>
                    </div>
                  </div>

                  <div class="detail-item">
                    <div class="detail-label">
                      <small>{{ $lang[langId].max_discount }}</small>
                    </div>
                    <div class="detail-value">
                      <template v-if="isEditing">
                        <div class="el-input">
                          <!-- <money v-model="tmp.max_discount_amount" class="el-input__inner" @change.native="handleCurrency('maxOrder', tmp.max_discount_amount)"></money> -->
                          <input-money v-model="tmp.max_discount_amount" @currency="handleCurrency('maxOrder', tmp.max_discount_amount)" />
                        </div>
                      </template>
                      <template v-else>
                        {{data.fmax_discount_amount}}
                      </template>
                    </div>
                  </div>

                  <div class="detail-item">
                    <div class="detail-label">
                      <small>{{ lang.min_order_amount }}</small>
                    </div>
                    <div class="detail-value">
                      <template v-if="isEditing">
                        <div class="el-input">
                          <input-money v-model="tmp.min_order_amount" @currency="handleCurrency('minOrder', tmp.min_order_amount)" />
                        </div>
                      </template>
                      <template v-else>
                        {{data.fmin_order_amount}}
                      </template>
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
                          :placeholder="$lang[langId].pick_a_day">
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
                    <div class="detail-value">
                      <template v-if="isEditing">
                        <div>
                          <label>{{ lang.never_expires }}</label>
                          <el-switch
                            :active-value="1"
                            :inactive-value="0"
                            v-model="tmp.no_expiry">
                          </el-switch>
                        </div>
                        <el-date-picker
                          v-if="tmp.no_expiry === 0"
                          v-model="tmp.expiry_date"
                          type="date"
                          :placeholder="$lang[langId].pick_a_day"
                          :picker-options="checkDateRange">
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
                        <template v-if="data.no_expiry === 1">
                          {{ lang.no_expiry }}
                        </template>
                        <template v-else>
                          {{data.expiry_date}}
                        </template>
                      </template>
                    </div>
                  </div>
                </section><!-- .detail-section -->
              </div><!-- .pull-left -->
              <div class="col-md-4">
                <section class="detail-section">
                  <div class="detail-item">
                    <div class="detail-label">
                      <small>{{ $lang[langId].show_in_pos }}</small>
                    </div>
                    <div class="detail-value">
                      <template v-if="!isEditing">
                        <template v-if="data.show_in_pos">
                          {{ lang.yes }}
                        </template>
                        <template v-else>
                          {{ lang.no }}
                        </template>
                      </template>
                      <template v-else>
                        <el-switch
                          :active-value="1"
                          :inactive-value="0"
                          v-model="tmp.show_in_pos">
                        </el-switch>
                        <span v-if="tmp.show_in_pos === 0">{{ lang.no }}</span>
                        <span v-if="tmp.show_in_pos === 1">{{ lang.yes }}</span>
                      </template>
                    </div>
                  </div>

                  <div class="detail-item">
                    <div class="detail-label">
                      <small>{{ $lang[langId].show_in_online }}</small>
                    </div>
                    <div class="detail-value">
                      <template v-if="!isEditing">
                        <template v-if="data.show_in_online">
                          {{ lang.yes }}
                        </template>
                        <template v-else>
                          {{ lang.no }}
                        </template>
                      </template>
                      <template v-else>
                        <el-switch
                          :active-value="1"
                          :inactive-value="0"
                          v-model="tmp.show_in_online">
                        </el-switch>
                        <span v-if="tmp.show_in_online === 0">{{ lang.no }}</span>
                        <span v-if="tmp.show_in_online === 1">{{ lang.yes }}</span>
                      </template>
                    </div>
                  </div>

                  <div class="detail-item">
                    <div class="detail-label">
                      <small>{{ $lang[langId].unlimited_use }}</small>
                    </div>
                    <div class="detail-value">
                      <template v-if="!isEditing">
                        <template v-if="data.no_usage_limit === 1">
                          {{ lang.yes }}
                        </template>
                        <template v-else>
                          {{ lang.no }} ({{ lang.usage_limit }}: {{data.usage_limit}})
                        </template>
                      </template>
                      <template v-else>
                        <el-switch
                          :active-value="1"
                          :inactive-value="0"
                          v-model="tmp.no_usage_limit">
                        </el-switch>
                        <span v-if="tmp.no_usage_limit === 0">{{ lang.no }}</span>
                        <span v-if="tmp.no_usage_limit === 1">{{ lang.yes }}</span>
                        <el-input
                          v-if="tmp.no_usage_limit"
                          :disabled="true"
                          type="number"
                          size="small"
                          :min="1"
                          v-model="tmp.usage_limit"
                          :placeholder="lang.usage_limit"
                          style="margin-top: 5px;">
                        </el-input>
                        <el-input
                          v-else
                          :disabled="false"
                          type="number"
                          size="small"
                          :min="1"
                          v-model="tmp.usage_limit"
                          :placeholder="lang.usage_limit"
                          style="margin-top: 5px;">
                        </el-input>
                      </template>
                    </div>
                  </div>

                  <div class="detail-item">
                    <div class="detail-label">
                      <small>{{ lang.once_per_customer }}?</small>
                    </div>
                    <div class="detail-value">
                      <template v-if="!isEditing">
                        <template v-if="data.once_per_customer">
                          {{ lang.yes }}
                        </template>
                        <template v-else>
                          {{ lang.no }}
                        </template>
                      </template>
                      <template v-else>
                        <!-- <el-checkbox
                          size="small"
                          v-model="tmp.once_per_customer"
                          :label="lang.yes"
                          :true-label="1"
                          :false-label="0"
                          border>
                        </el-checkbox> -->
                        <el-switch
                          :active-value="1"
                          :inactive-value="0"
                          v-model="tmp.once_per_customer">
                        </el-switch>
                        <span v-if="tmp.once_per_customer === 0">{{ lang.no }}</span>
                        <span v-if="tmp.once_per_customer === 1">{{ lang.yes }}</span>
                      </template>
                    </div>
                  </div>

                  <div class="detail-item">
                    <div class="detail-label">
                      <small>{{ $lang[langId].daily_reset_usage }}?</small>
                    </div>
                    <div class="detail-value">
                      <template v-if="!isEditing">
                        <template v-if="data.daily_reset_usage">
                          {{ lang.yes }}
                        </template>
                        <template v-else>
                          {{ lang.no }}
                        </template>
                      </template>
                      <template v-else>
                        <el-switch
                          :active-value="1"
                          :inactive-value="0"
                          v-model="tmp.daily_reset_usage">
                        </el-switch>
                        <span v-if="tmp.daily_reset_usage === 0">{{ lang.no }}</span>
                        <span v-if="tmp.daily_reset_usage === 1">{{ lang.yes }}</span>
                      </template>
                    </div>
                  </div>

                  <template >
                    <div class="detail-item">
                      <div class="detail-label">
                        <small>{{ $lang[langId].use_dine_in }}?</small>
                      </div>
                      <div class="detail-value">
                        <template v-if="!isEditing">
                          <template v-if="data.use_dine_in">
                            {{ lang.yes }}
                          </template>
                          <template v-else>
                            {{ lang.no }}
                          </template>
                        </template>
                        <template v-else>
                          <el-switch
                            :active-value="1"
                            :inactive-value="0"
                            v-model="tmp.use_dine_in">
                          </el-switch>
                          <span v-if="tmp.use_dine_in === 0">{{ lang.no }}</span>
                          <span v-if="tmp.use_dine_in === 1">{{ lang.yes }}</span>
                        </template>
                      </div>
                    </div>

                    <div class="detail-item">
                      <div class="detail-label">
                        <small>{{ $lang[langId].use_delivery }}?</small>
                      </div>
                      <div class="detail-value">
                        <template v-if="!isEditing">
                          <template v-if="data.use_delivery">
                            {{ lang.yes }}
                          </template>
                          <template v-else>
                            {{ lang.no }}
                          </template>
                        </template>
                        <template v-else>
                          <el-switch
                            :active-value="1"
                            :inactive-value="0"
                            v-model="tmp.use_delivery">
                          </el-switch>
                          <span v-if="tmp.use_delivery === 0">{{ lang.no }}</span>
                          <span v-if="tmp.use_delivery === 1">{{ lang.yes }}</span>
                        </template>
                      </div>
                    </div>

                    <div class="detail-item">
                      <div class="detail-label">
                        <small>{{ $lang[langId].use_take_away }}?</small>
                      </div>
                      <div class="detail-value">
                        <template v-if="!isEditing">
                          <template v-if="data.use_take_away">
                            {{ lang.yes }}
                          </template>
                          <template v-else>
                            {{ lang.no }}
                          </template>
                        </template>
                        <template v-else>
                          <el-switch
                            :active-value="1"
                            :inactive-value="0"
                            v-model="tmp.use_take_away">
                          </el-switch>
                          <span v-if="tmp.use_take_away === 0">{{ lang.no }}</span>
                          <span v-if="tmp.use_take_away === 1">{{ lang.yes }}</span>
                        </template>
                      </div>
                    </div>
                  </template>

                </section>
              </div><!-- .pull-left -->
              <div class="col-md-4">
                <div class="discount-badge" v-if="!isEditing">
                  <span class="discount-badge--title">{{data.title}}</span>
                  <span class="discount-badge--content">{{ data.fdiscount }}</span>
                </div>
                <div class="detail-item" v-else>
                  <div class="detail-label">
                    <small>{{ lang.discount }}</small>
                  </div>
                  <div class="detail-value">
                    <el-radio-group v-model="amountType" size="mini">
                      <el-radio-button label="percent">
                        % {{ $lang[langId].percent }}
                      </el-radio-button>
                      <el-radio-button label="amount">
                        $ {{ $lang[langId].nominal }}
                      </el-radio-button>
                    </el-radio-group>
                    <template v-if="amountType === 'percent'">
                      <!-- <el-input type="number"
                        size="small"
                        :placeholder="$lang[langId].input_number"
                        v-model="tmp.discount_percent"
                        :min="0">
                      </el-input> -->
                      <el-input type="number"
                        :placeholder="$lang[langId].input_number"
                        v-model="tmp.discount_percent"
                        @change="handleCurrency('discountPercent', tmp.discount_percent)">
                      </el-input>
                      <p style="margin-top: 5px; text-align: left; ">
                        {{ lang.desc_price_cut_for_reseller }},{{ $lang[langId].min_and_max_disc_percent }}
                      </p>
                    </template>
                    <template v-else>
                      <div class="el-input el-input--small">
                        <input-money v-model="tmp.discount_amount" />
                      </div>
                    </template>
                  </div>
                </div>
              </div><!-- .col-sm-4 -->
            </div>
          </div>

          <div class="card-footer">
            <button-action-authenticated
              :disabled="disabledButton"
              :permission="['promotion/discountvoucher', 'destroy']"
              type="bordered-danger"
              @click="remove"
              icon="el-icon-delete">
              {{ $lang[langId].delete }}
            </button-action-authenticated>
          </div>
        </el-card>
      </div>

      <div class="col-md-4">
        <el-card
          v-loading="loadingRules">
          <div slot="header" class="clearfix">
            <h4>{{ $lang[langId].discount_rules}}</h4>
          </div>

          <div class="card-body">
            <i class="el-icon-check"></i> {{ lang.valid_for_customer_types }}:
            <div class="valid-for-all">
              <template v-if="data.valid_for_all_customers === 1 && !isEditingRules">
                <el-alert
                  :title="$lang[langId].valid_all_type_customer"
                  type="success"
                  show-icon
                  :closable="false">
                </el-alert>
              </template>
              <template v-if="isEditingRules">
                <p>{{ $lang[langId].apply_to_all_customer }}
                  <br>
                  <el-switch
                    :active-value="1"
                    :inactive-value="0"
                    v-model="tmp.valid_for_all_customers">
                  </el-switch>
                  <span v-if="tmp.valid_for_all_customers === 0">{{ lang.no }}</span>
                  <span v-if="tmp.valid_for_all_customers === 1">{{ lang.yes }}</span>
                </p>
              </template>
            </div>
            <ul v-if="!isEditingRules"
              class="list-unstyled list-stripped list-table">
              <li
                v-for="(item, idx) in data.valid_customer_types"
                :key="idx"
                class="list-item-relative">
                <strong>{{item.name}}</strong>
              </li>
            </ul>
            <ul v-else
              class="list-unstyled list-stripped list-table">
              <template v-if="tmp.valid_for_all_customers === 0">
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
            <div v-if="isEditingRules" class="add-discount-customer">
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
            <div class="valid-for-all">
              <template v-if="data.valid_for_all_customers === 1 && !isEditingRules">
                <el-alert
                  :title="$lang[langId].valid_all_customer"
                  type="success"
                  show-icon
                  :closable="false">
                </el-alert>
              </template>
              <template v-if="!isEditingRules"></template>
            </div>
            <ul v-if="!isEditingRules"
              class="list-unstyled list-stripped list-table">
              <li
                v-for="(item, idx) in data.valid_customers"
                :key="idx"
                class="list-item-relative">
                <strong>{{item.name}}</strong>
              </li>
            </ul>
            <ul v-else
              class="list-unstyled list-stripped list-table">
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
            <div v-if="isEditingRules" class="add-discount-customer">
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



            <i class="el-icon-check"></i> {{ lang.valid_for_product_groups }}:
            <div class="valid-for-all">
              <template v-if="data.valid_for_all_products === 1 && !isEditingRules">
                <el-alert
                  :title="$lang[langId].valid_all_product"
                  type="success"
                  show-icon
                  :closable="false">
                </el-alert>
              </template>
              <template v-if="isEditingRules">
                <p>{{ $lang[langId].apply_to_all_product }}
                  <br>
                  <el-switch
                    :active-value="1"
                    :inactive-value="0"
                    v-model="tmp.valid_for_all_products">
                  </el-switch>
                  <span v-if="tmp.valid_for_all_products === 0">{{ lang.no}}</span>
                  <span v-if="tmp.valid_for_all_products === 1">{{ lang.yes}}</span>
                </p>
              </template>
            </div>
            <ul v-if="!isEditingRules"
              class="list-unstyled list-stripped list-table">
              <li
                v-for="(item, idx) in data.valid_product_groups"
                :key="idx"
                class="list-item-relative">
                <strong>{{item.name}}</strong>
              </li>
            </ul>
            <ul v-else
              class="list-unstyled list-stripped list-table">
              <template v-if="tmp.valid_for_all_products === 0">
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
                </li>
              </template>
            </ul>
            <div v-if="isEditingRules" class="add-discount-customer">
              <el-select
                v-if="tmp.valid_for_all_products === 0"
                style="width: 100%;"
                v-model="fresh.valid_product_groups"
                multiple
                filterable
                remote
                reserve-keyword
                :placeholder="lang.info_auto_complete_product_group"
                :remote-method="searchProductGroups"
                :loading="searchingProductGroups">
                <el-option
                  v-for="(item) in searchResultProductGroups"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>

            <hr/>

            <i class="el-icon-check"></i> {{ lang.valid_for_products }}:
            <div class="valid-for-all">
              <template v-if="data.valid_for_all_products === 1 && !isEditingRules">
                <el-alert
                  :title="$lang[langId].valid_all_product"
                  type="success"
                  show-icon
                  :closable="false">
                </el-alert>
              </template>
              <template v-if="!isEditingRules"></template>
            </div>
            <ul v-if="!isEditingRules"
              class="list-unstyled list-stripped list-table">
              <li
                v-for="(item, idx) in data.valid_products"
                :key="idx"
                class="list-item-relative">
                <strong>{{item.name}}</strong>
              </li>
            </ul>
            <ul v-else
              class="list-unstyled list-stripped list-table">
              <template v-if="tmp.valid_for_all_products === 0">
                <li
                  v-for="(item, idx) in tmp.valid_products"
                  :key="idx"
                  class="list-item-relative">
                  <strong>{{item.name}}</strong>
                  <span class="absolute-right">
                    <el-button
                      @click="removeProduct(idx)"
                      type="text">
                      <i class="el-icon-close"></i>
                    </el-button>
                  </span>
                </li>
              </template>
            </ul>
            <div v-if="isEditingRules" class="add-discount-customer">
              <el-select
                v-if="tmp.valid_for_all_products === 0"
                style="width: 100%;"
                v-model="fresh.valid_products"
                multiple
                filterable
                remote
                reserve-keyword
                :placeholder="$lang[langId].please_input + lang.customer"
                :remote-method="searchProducts"
                :loading="searchingProducts">
                <el-option
                  v-for="(item) in searchResultProducts"
                  :key="item.product_id"
                  :label="item.name"
                  :value="item.product_id">
                </el-option>
              </el-select>
            </div>

            <hr/>



            <i class="el-icon-check"></i> {{ lang.valid_for_product_combos }}:
            <div class="valid-for-all">
              <template v-if="data.valid_for_all_product_combos === 1 && !isEditingRules">
                <el-alert
                  :title="$lang[langId].valid_all_product"
                  type="success"
                  show-icon
                  :closable="false">
                </el-alert>
              </template>
              <template v-if="isEditingRules">
                <p>{{ $lang[langId].apply_to_all_combo }}
                  <el-switch
                    :active-value="1"
                    :inactive-value="0"
                    v-model="tmp.valid_for_all_product_combos">
                  </el-switch>
                  <span v-if="tmp.valid_for_all_product_combos === 0">{{ lang.no }}</span>
                  <span v-if="tmp.valid_for_all_product_combos === 1">{{ lang.yes }}</span>
                </p>
              </template>
            </div>
            <ul v-if="!isEditingRules"
              class="list-unstyled list-stripped list-table">
              <li
                v-for="(item, idx) in data.valid_product_combos"
                :key="idx"
                class="list-item-relative">
                <strong>{{item.name}}</strong>
              </li>
            </ul>
            <ul v-else
              class="list-unstyled list-stripped list-table">
              <template v-if="tmp.valid_for_all_product_combos === 0">
                <li
                  v-for="(item, idx) in tmp.valid_product_combos"
                  :key="idx"
                  class="list-item-relative">
                  <strong>{{item.name}}</strong>
                  <span class="absolute-right">
                    <el-button
                      @click="removeProductCombo(idx)"
                      type="text">
                      <i class="el-icon-close"></i>
                    </el-button>
                  </span>
                </li>
              </template>
            </ul>
            <div v-if="isEditingRules" class="add-discount-customer">
              <el-select
                v-if="tmp.valid_for_all_product_combos === 0"
                style="width: 100%;"
                v-model="fresh.valid_product_combos"
                multiple
                filterable
                remote
                reserve-keyword
                :placeholder="$lang[langId].please_input + lang.product_combo"
                :remote-method="searchProductCombos"
                :loading="searchingProductCombos">
                <el-option
                  v-for="(item) in searchResultProductCombos"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>

            <hr/>

            <i class="el-icon-check"></i> {{ lang.valid_for_brands }}:
            <div class="valid-for-all">
              <template v-if="data.valid_for_all_brands === 1 && !isEditingRules">
                <el-alert
                  :title="$lang[langId].valid_all_brand"
                  type="success"
                  show-icon
                  :closable="false">
                </el-alert>
              </template>
              <template v-if="isEditingRules">
                <p>{{ $lang[langId].apply_to_all_brand }}
                  <el-switch
                    :active-value="1"
                    :inactive-value="0"
                    v-model="tmp.valid_for_all_brands">
                  </el-switch>
                  <span v-if="tmp.valid_for_all_brands === 0">{{ lang.no }}</span>
                  <span v-if="tmp.valid_for_all_brands === 1">{{ lang.yes }}</span>
                </p>
              </template>
            </div>
            <ul v-if="!isEditingRules"
              class="list-unstyled list-stripped list-table">
              <li
                v-for="(item, idx) in data.valid_brands"
                :key="idx"
                class="list-item-relative">
                <strong>{{item.name}}</strong>
              </li>
            </ul>
            <ul v-else
              class="list-unstyled list-stripped list-table">
              <template v-if="tmp.valid_for_all_brands === 0">
                <li
                  v-for="(item, idx) in tmp.valid_brands"
                  :key="idx"
                  class="list-item-relative">
                  <strong>{{item.name}}</strong>
                  <span class="absolute-right">
                    <el-button
                      @click="removeBrand(idx)"
                      type="text">
                      <i class="el-icon-close"></i>
                    </el-button>
                  </span>
                </li>
              </template>
            </ul>
            <div v-if="isEditingRules" class="add-discount-customer">
              <el-select
                v-if="tmp.valid_for_all_brands === 0"
                style="width: 100%;"
                v-model="fresh.valid_brands"
                multiple
                filterable
                remote
                reserve-keyword
                :placeholder="$lang[langId].please_input + lang.brand"
                :remote-method="searchBrand"
                :loading="loadingSearchBrand">
                <el-option
                  v-for="(item) in searchResultBrand"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>

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
import errorMixin from '@/mixins/errorMixin'
import InputMoney from '@/components/InputMoneyV2'
import { checkCustomPermission } from '@/mixins/checkCustomPermission'

import basicComputedMixin from '@/mixins/basicComputedMixin'

var moment = require('moment')

export default {
  props: ['loadingDetail', 'formData'],

  mixins: [errorMixin, checkCustomPermission, basicComputedMixin],

  components: {
    draggable,
    InputMoney
  },

  data() {
    return {
      loadingsDetail: false,
      loading: false,
      isEditing: false,
      isEditingRules: false,
      loadingRules: false,
      disabledButton: false,
      searchingCustomerTypes: false,
      searchingCustomers: false,
      searchingProducts: false,
      searchingProductGroups: false,
      searchingProductCombos: false,
      loadingSearchBrand: false,
      searchResultCustomerTypes: [],
      searchResultCustomers: [],
      searchResultProducts: [],
      searchResultProductGroups: [],
      searchResultProductCombos: [],
      searchResultBrand: [],
      data: {},
      tmp: {
      },
      fresh: {
        valid_customers: [],
        valid_customer_types: [],
        valid_products: [],
        valid_product_groups: [],
        valid_product_combos: [],
        valid_brands: []
      },
      amountType: '',
      checkDateRange: {
        disabledDate: this.disabledDueDate
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
    amountType: {
      handler(val) {
        if (this.data.discount_amount > 0) {
          this.amountType = 'amount'
          this.tmp.discount_percent = 0
        } else {
          this.amountType = 'percent'
          this.tmp.discount_amount = 0
        }
        if (val === 'amount') {
          this.amountType = 'amount'
          this.tmp.discount_percent = 0
        } else {
          this.amountType = 'percent'
          this.tmp.discount_amount = 0
        }
      },
      immediate: true
    },
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
        if (this.data.discount_percent > 0) {
          this.amountType = 'percent'
        } else {
          this.amountType = 'amount'
        }
      },
      deep: true,
      immediate: true
    }
  },

  beforeMount() {
    this.handleCustomPermissionSinglePage('promotion/discountvoucher', 'show')
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
    back() {
      this.data = {}
      this.$emit('back')
    },
    remove() {
      this.$emit('remove', this.data)
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
    loadEditData(resolve, reject) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'discountvoucher/edit/' + this.data.id),
        headers
      }).then((response) => {
        resolve(response)
      }).catch(() => {
        reject()
      })
    },
    edit() {
      this.loading = true
      let promise = new Promise((resolve, reject) => {
        this.loadEditData(resolve, reject)
      })
      promise.then(response => {
        this.tmp = Object.assign({}, response.data.data)
        this.tmp.min_order_amount = Number.parseInt(this.tmp.min_order_amount, 0)
        this.tmp.discount_amount = Number.parseInt(this.tmp.discount_amount, 0)
        this.tmp.active_date = moment(this.tmp.active_date)
        this.tmp.expiry_date = moment(this.tmp.expiry_date)
        this.isEditing = true
        this.loading = false
        // console.log(this.tmp)
        this.editRules()
      }).catch((error) => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    saveEdit() {
      //
      this.loading = true
      let promise = new Promise((resolve, reject) => {
        this.update(resolve, reject)
      })
      promise.then(response => {
        this.isEditing = false
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    cancelEdit() {
      this.isEditing = false
      this.isEditingRules = false
    },
    editRules() {
      // this.cancelEdit()
      this.loading = true
      if (typeof this.tmp.id !== 'undefined') {
        this.isEditingRules = true
        this.tmp = Object.assign({}, this.data)
        this.loading = false
      } else {
        let promise = new Promise((resolve, reject) => {
          this.loadEditData(resolve, reject)
        })
        promise.then(response => {
          this.tmp = Object.assign({}, response.data.data)
          this.tmp.min_order_amount = Number.parseInt(this.tmp.min_order_amount, 0)
          this.tmp.discount_amount = Number.parseInt(this.tmp.discount_amount, 0)
          this.tmp.active_date = moment(this.tmp.active_date)
          this.tmp.expiry_date = moment(this.tmp.expiry_date)
          // if (this.tmp.valid_for_all_products === 1) {
          //   this.tmp.valid_for_all_products = true
          // } else {
          //   this.tmp.valid_for_all_products = false
          // }
          // if (this.tmp.valid_for_all_customers === 1) {
          //   this.tmp.valid_for_all_customers = true
          // } else {
          //   this.tmp.valid_for_all_customers = false
          // }
          // if (this.tmp.valid_for_all_product_combos === 1) {
          //   this.tmp.valid_for_all_product_combos = true
          // } else {
          //   this.tmp.valid_for_all_product_combos = false
          // }
          // if (this.tmp.valid_for_all_brands === 1) {
          //   this.tmp.valid_for_all_brands = true
          // } else {
          //   this.tmp.valid_for_all_brands = false
          // }
          if (this.tmp.no_usage_limit === 1) {
            this.tmp.no_usage_limit = true
          } else {
            this.tmp.no_usage_limit = false
          }
          if (this.tmp.once_per_customer === 1) {
            this.tmp.once_per_customer = true
          } else {
            this.tmp.once_per_customer = false
          }
          if (this.tmp.daily_reset_usage === 1) {
            this.tmp.daily_reset_usage = true
          } 
          else {
            this.tmp.daily_reset_usage = false
          }
          this.isEditingRules = true
          this.loading = false
        })
      }
    },
    canceleditRules() {
      this.isEditingRules = false
    },
    saveEditRules() {
      this.loadingRules = true
      let promise = new Promise((resolve, reject) => {
        this.update(resolve, reject, true)
      })
      promise.then(response => {
        this.isEditingRules = false
        this.loadingRules = false
      }).catch(() => {
        this.loadingRules = false
      })
    },
    update(resolve, reject, isRules = false) {
      let obj = Object.assign({}, this.tmp)

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

      let data = {
        to_store_id: to_store_id,
        to_allstore_id: to_allstore_id,
        code: obj.code,
        title: obj.title,
        active_date: moment(obj.active_date).format('YYYY-MM-DD'),
        min_order_amount: obj.min_order_amount,
        max_discount_amount: obj.max_discount_amount,
        valid_for_all_products: obj.valid_for_all_products,
        valid_for_all_customers: obj.valid_for_all_customers,
        valid_for_all_product_combos: obj.valid_for_all_product_combos,
        valid_for_all_brands: obj.valid_for_all_brands,
        valid_product_groups: '',
        valid_products: '',
        valid_product_combos: '',
        valid_for_customer_types: '',
        valid_customers: '',
        valid_brands: '',
        no_expiry: obj.no_expiry,
        expiry_date: moment(obj.expiry_date).format('YYYY-MM-DD'),
        discount_amount: obj.discount_amount,
        discount_percent: obj.discount_percent,
        discount_with: obj.discount_with,
        no_usage_limit: obj.no_usage_limit,
        usage_limit: obj.usage_limit,
        show_in_pos: obj.show_in_pos,
        show_in_online: obj.show_in_online,
        once_per_customer: obj.once_per_customer,
        daily_reset_usage: obj.daily_reset_usage,
        use_dine_in: obj.use_dine_in,
        use_delivery: obj.use_delivery,
        use_take_away: obj.use_take_away
      }
      // Rules
      if (!obj.valid_for_all_customers) {
        // customer types
        if (this.fresh.valid_customer_types.length > 0) {
          this.fresh.valid_customer_types.map(item => {
            obj.valid_customer_types.push({id: item})
          })
        }
        obj.valid_customer_types = obj.valid_customer_types.map(item => {
          return item.id
        })
        data.valid_for_customer_types = obj.valid_customer_types.join(',')
        // customers
        if (this.fresh.valid_customers.length > 0) {
          this.fresh.valid_customers.map(item => {
            obj.valid_customers.push({id: item})
          })
        }
        obj.valid_customers = obj.valid_customers.map(item => {
          return item.id
        })
        data.valid_customers = obj.valid_customers.join(',')
      }

      if (!obj.valid_for_all_products) {
        if (this.fresh.valid_product_groups.length > 0) {
          this.fresh.valid_product_groups.map(item => {
            obj.valid_product_groups.push({id: item})
          })
        }
        obj.valid_product_groups = obj.valid_product_groups.map(item => {
          return item.id
        })
        data.valid_product_groups = obj.valid_product_groups.join(',')
        // customers
        if (this.fresh.valid_products.length > 0) {
          this.fresh.valid_products.map(item => {
            obj.valid_products.push({id: item})
          })
        }
        obj.valid_products = obj.valid_products.map(item => {
          return item.id
        })
        data.valid_products = obj.valid_products.join(',')
      }

      if (!obj.valid_for_all_product_combos) {
        if (this.fresh.valid_product_combos.length > 0) {
          this.fresh.valid_product_combos.map(item => {
            obj.valid_product_combos.push({id: item})
          })
        }
        obj.valid_product_combos = obj.valid_product_combos.map(item => {
          return item.id
        })
        data.valid_product_combos = obj.valid_product_combos.join(',')
      }

      if (!obj.valid_for_all_brands) {
        if (this.fresh.valid_brands.length > 0) {
          this.fresh.valid_brands.map(item => {
            obj.valid_brands.push({id: item})
          })
        }
        obj.valid_brands = obj.valid_brands.map(item => {
          return item.id
        })
        data.valid_brands = obj.valid_brands.join(',')
      }
      // and so ...
      // if (data.no_expiry === 1) {
      //   this.$delete(data, 'expiry_date')
      // } else {
      //   this.$delete(data, 'no_expiry')
      //   data.expiry_date = moment(obj.expiry_date).format('YYYY-MM-DD')
      // }

      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'discountvoucher/' + this.data.id),
        headers,
        data
      }).then(response => {
        this.data = response.data.data
        this.fresh.valid_customer_types = []
        this.fresh.valid_customers = []
        this.fresh.valid_product_groups = []
        this.fresh.valid_product_combos = []
        this.fresh.valid_products = []
        this.fresh.valid_brands = []
        this.tmp = Object.assign({}, response.data.data)
        this.tmp.min_order_amount = Number.parseInt(this.tmp.min_order_amount, 0)
        this.tmp.discount_amount = Number.parseInt(this.tmp.discount_amount, 0)
        this.tmp.active_date = moment(this.tmp.active_date)
        this.tmp.expiry_date = moment(this.tmp.expiry_date)
        this.isEditingRules = false
        resolve(response)
        this.$message({
          type: 'success',
          message: 'Success'
        })
      }).catch((error) => {
        reject()
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
      this.tmp.valid_product_combos.splice(idx, 1)
    },
    removeBrand(idx) {
      this.tmp.valid_brands.splice(idx, 1)
    },
    disabledDueDate (time) {
      return time.getTime() < this.tmp.active_date
    },
    handleCurrency (block, value) {
      if (block === 'minOrder') {
        if (value < 0) {
          this.tmp.min_order_amount = 0
        }
      } else if (block === 'maxOrder') {
        if (value < 0) {
          this.tmp.max_discount_amount = 0
        }
      } else if (block === 'discountPercent') {
        if (value < 0) {
          this.tmp.discount_percent = 0
        } else if (value > 100) {
          this.tmp.discount_percent = 100
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
  }
}
</script>
