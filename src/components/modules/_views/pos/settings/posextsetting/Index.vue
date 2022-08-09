<template>
  <div v-loading="loading">
    <el-row :gutter="20">
      <el-col :md="18">
        <el-card class="box-card">
          <div slot="header">
            <h4>{{ lang.pos_ext_settings }}</h4>
          </div>

          <div class="card-body">
            <div style="margin-bottom: 20px;"></div>
            <el-form>
              <el-row :gutter="20">
                <el-col :span="16">
                  <el-form-item style="text-align: right;">
                    <label>{{ lang.pos_hide_receipt_no }}</label>
                    <p style="margin: -5px 0 0 0;">
                      {{ lang.info_pos_hide_receipt_no }}
                    </p>
                  </el-form-item>
                </el-col>
                <el-col :span="8" style="padding-top: 7px">
                  <el-switch v-model="data.pos_hide_order_no" :disabled="!checkCustomPermission('settings/posextsetting', 'edit')"
                    :active-value="1"
                    :inactive-value="0"
                    @change="update('pos_hide_order_no', data.pos_hide_order_no)">
                  </el-switch>
                  <span v-if="data.pos_hide_order_no == 0">{{ lang.no }}</span>
                  <span v-if="data.pos_hide_order_no == 1">{{ lang.yes }}</span>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="16">
                  <el-form-item style="text-align: right;">
                    <label>{{ lang.pos_receipt_hide_combo_items }}</label>
                    <p style="margin: -5px 0 0 0;">
                      {{ lang.info_pos_receipt_hide_combo_items }}
                    </p>
                  </el-form-item>
                </el-col>
                <el-col :span="8" style="padding-top: 7px">
                  <el-switch v-model="data.pos_receipt_hide_combo_items" :disabled="!checkCustomPermission('settings/posextsetting', 'edit')"
                    :active-value="1"
                    :inactive-value="0"
                    @change="update('pos_receipt_hide_combo_items', data.pos_receipt_hide_combo_items)">
                  </el-switch>
                  <span v-if="data.pos_receipt_hide_combo_items == 0">{{ lang.no }}</span>
                  <span v-if="data.pos_receipt_hide_combo_items == 1">{{ lang.yes }}</span>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="16">
                  <el-form-item style="text-align: right;">
                    <label>{{ lang.pos_receipt_merge_qty }}</label>
                    <p style="margin: -5px 0 0 0;">
                      {{ lang.info_pos_receipt_merge_qty }}
                    </p>
                  </el-form-item>
                </el-col>
                <el-col :span="8" style="padding-top: 7px">
                  <el-switch v-model="data.pos_receipt_merge_qty" :disabled="!checkCustomPermission('settings/posextsetting', 'edit')"
                    :active-value="1"
                    :inactive-value="0"
                    @change="update('pos_receipt_merge_qty', data.pos_receipt_merge_qty)">
                  </el-switch>
                  <span v-if="data.pos_receipt_merge_qty == 0">{{ lang.no }}</span>
                  <span v-if="data.pos_receipt_merge_qty == 1">{{ lang.yes }}</span>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="16">
                  <el-form-item style="text-align: right;">
                    <label>{{ lang.pos_receipt_print_number_items }}</label>
                    <p style="margin: -5px 0 0 0;">
                      {{ lang.info_pos_receipt_print_number_items }}
                    </p>
                  </el-form-item>
                </el-col>
                <el-col :span="8" style="padding-top: 7px">
                  <el-switch v-model="data.pos_receipt_print_number_items" :disabled="!checkCustomPermission('settings/posextsetting', 'edit')"
                    :active-value="1"
                    :inactive-value="0"
                    @change="update('pos_receipt_print_number_items', data.pos_receipt_print_number_items)">
                  </el-switch>
                  <span v-if="data.pos_receipt_print_number_items == 0">{{ lang.no }}</span>
                  <span v-if="data.pos_receipt_print_number_items == 1">{{ lang.yes }}</span>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="16">
                  <el-form-item style="text-align: right;">
                    <label>{{ this.$lang[langId].pos_receipt_print_item_notes }}</label>
                    <p style="margin: -5px 0 0 0;">
                      {{ this.$lang[langId].info_pos_receipt_print_item_notes }}
                    </p>
                  </el-form-item>
                </el-col>
                <el-col :span="8" style="padding-top: 7px">
                  <el-switch v-model="data.pos_receipt_print_item_notes" :disabled="!checkCustomPermission('settings/posextsetting', 'edit')"
                    :active-value="1"
                    :inactive-value="0"
                    @change="update('pos_receipt_print_item_notes', data.pos_receipt_print_item_notes)">
                  </el-switch>
                  <span v-if="data.pos_receipt_print_item_notes == 0">{{ lang.no }}</span>
                  <span v-if="data.pos_receipt_print_item_notes == 1">{{ lang.yes }}</span>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="16">
                  <el-form-item style="text-align: right;">
                    <label>{{ this.$lang[langId].pos_receipt_custom_win }}</label>
                    <p style="margin: -5px 0 0 0;">
                      {{ this.$lang[langId].info_pos_receipt_custom_win }}
                    </p>
                  </el-form-item>
                </el-col>
                <el-col :span="8" style="padding-top: 7px">
                  <el-switch v-model="data.pos_receipt_custom_win" :disabled="!checkCustomPermission('settings/posextsetting', 'edit')"
                    :active-value="1"
                    :inactive-value="0"
                    @change="update('pos_receipt_custom_win', data.pos_receipt_custom_win)">
                  </el-switch>
                  <span v-if="data.pos_receipt_custom_win == 0">{{ lang.no }}</span>
                  <span v-if="data.pos_receipt_custom_win == 1">{{ lang.yes }}</span>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="16">
                  <el-form-item style="text-align: right;">
                    <label>{{ lang.pos_disable_print_check }}</label>
                    <p style="margin: -5px 0 0 0;">
                      {{ lang.info_pos_disable_print_check }}
                    </p>
                  </el-form-item>
                </el-col>
                <el-col :span="8" style="padding-top: 7px">
                  <el-switch v-model="data.pos_disable_print_check" :disabled="!checkCustomPermission('settings/posextsetting', 'edit')"
                    :active-value="1"
                    :inactive-value="0"
                    @change="update('pos_disable_print_check', data.pos_disable_print_check)">
                  </el-switch>
                  <span v-if="data.pos_disable_print_check == 0">{{ lang.no }}</span>
                  <span v-if="data.pos_disable_print_check == 1">{{ lang.yes }}</span>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="16">
                  <el-form-item style="text-align: right;">
                    <label>{{ lang.pos_disable_reprint }}</label>
                    <p style="margin: -5px 0 0 0;">
                      {{ lang.info_pos_disable_reprint }}
                    </p>
                  </el-form-item>
                </el-col>
                <el-col :span="8" style="padding-top: 7px">
                  <el-switch v-model="data.pos_receipt_disabled_reprint" :disabled="!checkCustomPermission('settings/posextsetting', 'edit')"
                    :active-value="1"
                    :inactive-value="0"
                    @change="update('pos_receipt_disabled_reprint', data.pos_receipt_disabled_reprint)">
                  </el-switch>
                  <span v-if="data.pos_receipt_disabled_reprint == 0">{{ lang.no }}</span>
                  <span v-if="data.pos_receipt_disabled_reprint == 1">{{ lang.yes }}</span>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="16">
                  <el-form-item style="text-align: right;">
                    <label>{{ lang.pos_disable_reprint_open_drawer }}</label>
                    <p style="margin: -5px 0 0 0;">
                      {{ lang.info_pos_disable_reprint_open_drawer }}
                    </p>
                  </el-form-item>
                </el-col>
                <el-col :span="8" style="padding-top: 7px">
                  <el-switch v-model="data.disable_reprint_open_drawer" :disabled="!checkCustomPermission('settings/posextsetting', 'edit')"
                    :active-value="1"
                    :inactive-value="0"
                    @change="update('disable_reprint_open_drawer', data.disable_reprint_open_drawer)">
                  </el-switch>
                  <span v-if="data.disable_reprint_open_drawer == 0">{{ lang.no }}</span>
                  <span v-if="data.disable_reprint_open_drawer == 1">{{ lang.yes }}</span>
                </el-col>
              </el-row>

              <hr/>

              <el-row :gutter="20">
                <el-col :span="16">
                  <el-form-item style="text-align: right;">
                    <label>{{ lang.pos_disallow_pending_order }}</label>
                    <p style="margin: -5px 0 0 0;">
                      {{ lang.info_pos_disallow_pending_order }}
                    </p>
                  </el-form-item>
                </el-col>
                <el-col :span="8" style="padding-top: 7px">
                  <el-switch v-model="data.pos_disallowed_pending_order" :disabled="!checkCustomPermission('settings/posextsetting', 'edit')"
                    :active-value="1"
                    :inactive-value="0"
                    @change="update('pos_disallowed_pending_order', data.pos_disallowed_pending_order)">
                  </el-switch>
                  <span v-if="data.pos_disallowed_pending_order == 0">{{ lang.no }}</span>
                  <span v-if="data.pos_disallowed_pending_order == 1">{{ lang.yes }}</span>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="16">
                  <el-form-item style="text-align: right;">
                    <label>{{ lang.pos_hide_online_transactions }}</label>
                    <p style="margin: -5px 0 0 0;">
                      {{ lang.info_pos_hide_online_transactions }}
                    </p>
                  </el-form-item>
                </el-col>
                <el-col :span="8" style="padding-top: 7px">
                  <el-switch v-model="data.pos_hide_online_transactions" :disabled="!checkCustomPermission('settings/posextsetting', 'edit')"
                    :active-value="1"
                    :inactive-value="0"
                    @change="update('pos_hide_online_transactions', data.pos_hide_online_transactions)">
                  </el-switch>
                  <span v-if="data.pos_hide_online_transactions == 0">{{ lang.no }}</span>
                  <span v-if="data.pos_hide_online_transactions == 1">{{ lang.yes }}</span>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="16">
                  <el-form-item style="text-align: right;">
                    <label>{{ lang.pos_disable_continue_edit_item }}</label>
                    <p style="margin: -5px 0 0 0;">
                      {{ lang.info_pos_disable_continue_edit_item }}
                    </p>
                  </el-form-item>
                </el-col>
                <el-col :span="8" style="padding-top: 7px">
                  <el-switch v-model="data.pos_disabled_continue_edit_item" :disabled="!checkCustomPermission('settings/posextsetting', 'edit')"
                    :active-value="1"
                    :inactive-value="0"
                    @change="update('pos_disabled_continue_edit_item', data.pos_disabled_continue_edit_item)">
                  </el-switch>
                  <span v-if="data.pos_disabled_continue_edit_item == 0">{{ lang.no }}</span>
                  <span v-if="data.pos_disabled_continue_edit_item == 1">{{ lang.yes }}</span>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="16">
                  <el-form-item style="text-align: right;">
                    <label>{{ lang.pos_disallow_add_inex_type }}</label>
                    <p style="margin: -5px 0 0 0;">
                      {{ lang.info_pos_disallow_add_inex_type }}
                    </p>
                  </el-form-item>
                </el-col>
                <el-col :span="8" style="padding-top: 7px">
                  <el-switch v-model="data.pos_disallowed_add_inex_type" :disabled="!checkCustomPermission('settings/posextsetting', 'edit')"
                    :active-value="1"
                    :inactive-value="0"
                    @change="update('pos_disallowed_add_inex_type', data.pos_disallowed_add_inex_type)">
                  </el-switch>
                  <span v-if="data.pos_disallowed_add_inex_type == 0">{{ lang.no }}</span>
                  <span v-if="data.pos_disallowed_add_inex_type == 1">{{ lang.yes }}</span>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="16">
                  <el-form-item style="text-align: right;">
                    <label>{{ lang.activate_track_server }}</label>
                    <p style="margin: -5px 0 0 0;">
                      {{ lang.info_activate_track_server }}
                    </p>
                  </el-form-item>
                </el-col>
                <el-col :span="8" style="padding-top: 7px">
                  <el-switch v-model="data.pos_track_server" :disabled="!checkCustomPermission('settings/posextsetting', 'edit')"
                    :active-value="1"
                    :inactive-value="0"
                    @change="update('pos_track_server', data.pos_track_server)">
                  </el-switch>
                  <span v-if="data.pos_track_server == 0">{{ lang.no }}</span>
                  <span v-if="data.pos_track_server == 1">{{ lang.yes }}</span>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="16">
                  <el-form-item style="text-align: right;">
                    <label>{{ $lang[langId].validate_dynamic_buy_price }}</label>
                    <p style="margin: -5px 0 0 0;">
                      {{ $lang[langId].info_validate_dynamic_buy_price }}
                    </p>
                  </el-form-item>
                </el-col>
                <el-col :span="8" style="padding-top: 7px">
                  <el-switch v-model="data.pos_validate_dynamic_buy_price" :disabled="!checkCustomPermission('settings/posextsetting', 'edit')"
                    :active-value="1"
                    :inactive-value="0"
                    @change="update('pos_validate_dynamic_buy_price', data.pos_validate_dynamic_buy_price)">
                  </el-switch>
                  <span v-if="data.pos_validate_dynamic_buy_price == 0">{{ lang.no }}</span>
                  <span v-if="data.pos_validate_dynamic_buy_price == 1">{{ lang.yes }}</span>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="16">
                  <el-form-item style="text-align: right;">
                    <label>{{ $lang[langId].credit_payment_check_balance }}</label>
                    <p style="margin: -5px 0 0 0;">
                      {{ $lang[langId].info_credit_payment_check_balance }}
                    </p>
                  </el-form-item>
                </el-col>
                <el-col :span="8" style="padding-top: 7px">
                  <el-switch v-model="data.credit_payment_check_balance" :disabled="!checkCustomPermission('settings/posextsetting', 'edit')"
                    :active-value="1"
                    :inactive-value="0"
                    @change="update('credit_payment_check_balance', data.credit_payment_check_balance)">
                  </el-switch>
                  <span v-if="data.credit_payment_check_balance == 0">{{ lang.no }}</span>
                  <span v-if="data.credit_payment_check_balance == 1">{{ lang.yes }}</span>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="16">
                  <el-form-item style="text-align: right;">
                    <label>{{ $lang[langId].pos_disallowed_custom_item }}</label>
                    <p style="margin: -5px 0 0 0;">
                      {{ $lang[langId].info_pos_disallowed_custom_item }}
                    </p>
                  </el-form-item>
                </el-col>
                <el-col :span="8" style="padding-top: 7px">
                  <el-switch v-model="data.pos_disallowed_custom_item" :disabled="!checkCustomPermission('settings/posextsetting', 'edit')"
                    :active-value="1"
                    :inactive-value="0"
                    @change="update('pos_disallowed_custom_item', data.pos_disallowed_custom_item)">
                  </el-switch>
                  <span v-if="data.pos_disallowed_custom_item == 0">{{ lang.no }}</span>
                  <span v-if="data.pos_disallowed_custom_item == 1">{{ lang.yes }}</span>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="16">
                  <el-form-item style="text-align: right;">
                    <label>{{ $lang[langId].pos_staff_only_view_today_trans }}</label>
                    <p style="margin: -5px 0 0 0;">
                      {{ $lang[langId].info_pos_staff_only_view_today_trans }}
                    </p>
                  </el-form-item>
                </el-col>
                <el-col :span="8" style="padding-top: 7px">
                  <el-switch v-model="data.pos_staff_only_view_today_trans" :disabled="!checkCustomPermission('settings/posextsetting', 'edit')"
                    :active-value="1"
                    :inactive-value="0"
                    @change="update('pos_staff_only_view_today_trans', data.pos_staff_only_view_today_trans)">
                  </el-switch>
                  <span v-if="data.pos_staff_only_view_today_trans == 0">{{ lang.no }}</span>
                  <span v-if="data.pos_staff_only_view_today_trans == 1">{{ lang.yes }}</span>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="16">
                  <el-form-item style="text-align: right;">
                    <label>{{ $lang[langId].hide_pos_stock }}</label>
                    <!-- <p style="margin: -5px 0 0 0;">
                      {{ $lang[langId].hide_pos_stock }}
                    </p> -->
                  </el-form-item>
                </el-col>
                <el-col :span="8" style="padding-top: 7px">
                  <el-switch v-model="data.pos_hide_stock" :disabled="!checkCustomPermission('settings/posextsetting', 'edit')"
                    :active-value="1"
                    :inactive-value="0"
                    @change="update('pos_hide_stock', data.pos_hide_stock)">
                  </el-switch>
                  <span v-if="data.pos_hide_stock == 0">{{ lang.no }}</span>
                  <span v-if="data.pos_hide_stock == 1">{{ lang.yes }}</span>
                </el-col>
              </el-row>

              <hr/>

              <el-row :gutter="20">
                <el-col :span="16">
                  <el-form-item style="text-align: right;">
                    <label>{{ lang.pos_hide_customer_list }}</label>
                    <p style="margin: -5px 0 0 0;">
                      {{ lang.info_pos_hide_customer_list }}
                    </p>
                  </el-form-item>
                </el-col>
                <el-col :span="8" style="padding-top: 7px">
                  <el-switch v-model="data.pos_hide_customer_list" :disabled="!checkCustomPermission('settings/posextsetting', 'edit')"
                    :active-value="1"
                    :inactive-value="0"
                    @change="update('pos_hide_customer_list', data.pos_hide_customer_list)">
                  </el-switch>
                  <span v-if="data.pos_hide_customer_list == 0">{{ lang.no }}</span>
                  <span v-if="data.pos_hide_customer_list == 1">{{ lang.yes }}</span>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="16">
                  <el-form-item style="text-align: right;">
                    <label>{{ lang.disable_dine_in_take_away }}</label>
                    <p style="margin: -5px 0 0 0;">
                      {{ lang.info_disable_dine_in_take_away }}
                    </p>
                  </el-form-item>
                </el-col>
                <el-col :span="8" style="padding-top: 7px">
                  <el-switch v-model="data.disable_dine_in" :disabled="!checkCustomPermission('settings/posextsetting', 'edit')"
                    :active-value="1"
                    :inactive-value="0"
                    @change="update('disable_dine_in', data.disable_dine_in)">
                  </el-switch>
                  <span v-if="data.disable_dine_in == 0">{{ lang.no }}</span>
                  <span v-if="data.disable_dine_in == 1">{{ lang.yes }}</span>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="16">
                  <el-form-item style="text-align: right;">
                    <label>{{ lang.pos_select_table_required }}</label>
                    <p style="margin: -5px 0 0 0;">
                      {{ lang.info_pos_select_table_required }}
                    </p>
                  </el-form-item>
                </el-col>
                <el-col :span="8" style="padding-top: 7px">
                  <el-switch v-model="data.pos_select_table_required" :disabled="!checkCustomPermission('settings/posextsetting', 'edit')"
                    :active-value="1"
                    :inactive-value="0"
                    @change="update('pos_select_table_required', data.pos_select_table_required)">
                  </el-switch>
                  <span v-if="data.pos_select_table_required == 0">{{ lang.no }}</span>
                  <span v-if="data.pos_select_table_required == 1">{{ lang.yes }}</span>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="16">
                  <el-form-item style="text-align: right;">
                    <label>{{ lang.pos_print_kitchen_normal_font }}</label>
                    <p style="margin: -5px 0 0 0;">
                      {{ lang.info_pos_print_kitchen_normal_font }}
                    </p>
                  </el-form-item>
                </el-col>
                <el-col :span="8" style="padding-top: 7px">
                  <el-switch v-model="data.pos_print_kitchen_normal_font" :disabled="!checkCustomPermission('settings/posextsetting', 'edit')"
                    :active-value="1"
                    :inactive-value="0"
                    @change="update('pos_print_kitchen_normal_font', data.pos_print_kitchen_normal_font)">
                  </el-switch>
                  <span v-if="data.pos_print_kitchen_normal_font == 0">{{ lang.no }}</span>
                  <span v-if="data.pos_print_kitchen_normal_font == 1">{{ lang.yes }}</span>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="16">
                  <el-form-item style="text-align: right;">
                    <label>{{ $lang[langId].resto_pessimistic_order }}</label>
                    <!-- <p style="margin: -5px 0 0 0;">
                      {{ lang.info_pos_resto_pessimistic_order }}
                    </p> -->
                  </el-form-item>
                </el-col>
                <el-col :span="8" style="padding-top: 7px">
                  <el-switch v-model="data.pos_resto_pessimistic_order" :disabled="!checkCustomPermission('settings/posextsetting', 'edit')"
                    :active-value="1"
                    :inactive-value="0"
                    @change="update('pos_resto_pessimistic_order', data.pos_resto_pessimistic_order)">
                  </el-switch>
                  <span v-if="data.pos_resto_pessimistic_order == 0">{{ lang.no }}</span>
                  <span v-if="data.pos_resto_pessimistic_order == 1">{{ lang.yes }}</span>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="16">
                  <el-form-item style="text-align: right;">
                    <label>{{ $lang[langId].activate_collect_feature }}</label>
                    <!-- <p style="margin: -5px 0 0 0;">
                      {{ lang.info_pos_resto_pessimistic_order }}
                    </p> -->
                  </el-form-item>
                </el-col>
                <el-col v-if="data.extsetting" :span="8" style="padding-top: 7px">
                  <el-switch v-model="data.extsetting.pos_show_collect" :disabled="!checkCustomPermission('settings/posextsetting', 'edit')"
                    :active-value="1"
                    :inactive-value="0"
                    @change="update('pos_show_collect', data.extsetting.pos_show_collect)">
                  </el-switch>
                  <span v-if="data.pos_show_collect == 0">{{ lang.no }}</span>
                  <span v-if="data.pos_show_collect == 1">{{ lang.yes }}</span>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="16">
                  <el-form-item style="text-align: right;">
                    <label>{{ $lang[langId].activated_pos_compact_receipt }}</label>
                  </el-form-item>
                </el-col>
                <el-col v-if="data.extsetting" :span="8" style="padding-top: 7px">
                  <el-switch v-model="data.extsetting.pos_receipt_compact" :disabled="!checkCustomPermission('settings/posextsetting', 'edit')"
                    :active-value="1"
                    :inactive-value="0"
                    @change="update('pos_receipt_compact', data.extsetting.pos_receipt_compact)">
                  </el-switch>
                  <span v-if="data.pos_receipt_compact == 0">{{ lang.no }}</span>
                  <span v-if="data.pos_receipt_compact == 1">{{ lang.yes }}</span>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="16">
                  <el-form-item style="text-align: right;">
                    <label>{{ $lang[langId].pos_order_no_reset_daily }}</label>
                  </el-form-item>
                </el-col>
                <el-col :span="8" style="padding-top: 7px">
                  <el-switch v-model="data.extsetting.pos_order_no_reset_daily"
                    :active-value="1"
                    :inactive-value="0"
                    @change="update('pos_order_no_reset_daily', data.extsetting.pos_order_no_reset_daily)">
                  </el-switch>
                  <span v-if="data.pos_order_no_reset_daily == 0">{{ lang.no }}</span>
                  <span v-if="data.pos_order_no_reset_daily == 1">{{ lang.yes }}</span>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
const apiEndPoint = 'posextsetting/'

import basicComputedMixin from '@/mixins/basicComputedMixin'

export default {
  name: 'PosExtSetting',
  data: function() {
    return {
      loading: true,
      data: {}
    }
  },

  mixins: [basicComputedMixin],

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
    }
  },

  watch: {
    '$store.getters.selectedStore': function() {
      this.getData()
    }
  },

  methods: {
    getData: function() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint),
        headers: headers
      }).then(response => {
        this.data = response.data.data
        this.loading = false
      }).catch(error => {
        this.loading = false
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
      })
    },
    update(block, val) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
        [ block ]: val
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + 'store-update'),
        headers: headers,
        data
      })
        .then(response => {
          this.result = response.data
          if (response.data.status === 200) {
            this.$message({
              message: 'Success',
              type: 'success'
            })
          }
          this.loading = false
        })
        .catch(error => {
          this.$message({
            message: 'Error',
            type: 'error'
          })
          console.log(error)
          this.loading = false
        })
    }
  },

  mounted() {
    this.getData()
  }
}
</script>
