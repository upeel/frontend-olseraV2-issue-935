<template>
  <el-card class="box-card">
    <div slot="header">
      <h3 class="box-title">{{ lang.order_item }}</h3>
      <div
        v-if="showEdit && detailData.status === 'P' && detailData.is_paid == 0"
        class="pull-right">
        <button-action-authenticated :permission="[customRPermis, 'edit']" type="info" size="small" icon="el-icon-plus" @click="showPackageDialog">
          {{ lang.product_combo }}
        </button-action-authenticated>
        <button-action-authenticated :permission="[customRPermis, 'edit']" type="info" size="small" @click="showProductDialog" icon="el-icon-plus">
          {{ lang.product }}
        </button-action-authenticated>
        <button-action-authenticated :permission="[customRPermis, 'edit']" type="info" size="small" @click="importDialog = true" icon="el-icon-plus">
          {{ lang.import }}
        </button-action-authenticated>
      </div>
    </div>

    <div class="card-body">
      <div class="no-product text-center" v-if="!showTable">
        <p>{{ lang.no_order }}</p>
        <img src="/static/img/no-data.svg" alt="No Data Picture">
      </div>
      <div v-else>
        <div v-if="!detailData.is_credit" class="table-responsive">
          <table class="table-orderitems table table-striped table-bordered">
            <thead>
              <tr>
                <th width="20">No. </th>
                <th width="250" class="description">{{ lang.description }}</th>
                <th width="150">{{ lang.serial }}</th>
                <th width="200">{{ lang.qty }}</th>
                <th width="400">{{ lang.price }} ({{ detailData.currency_id }})</th>
                <th width="400" v-if="stageLevel === 'dev' || stageLevel === 'sit'">{{ lang.discount }}</th>
                <th width="400" class="total">{{ lang.total_price }} ({{ detailData.currency_id }})</th>
                <th width="400">{{ $lang[langId].action }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, key) in detailData.orderitems" :key="key" v-loading="loading">
                <td>{{ key + 1}}</td>
                <td>
                  <div class="flex-container">
                    <el-avatar
                      v-if="item.photo_md"
                      :src="item.photo_md"
                      style="min-width: 40px;"
                    />
                    <div class="ml-8">
                      <router-link :to="{ path: item.product_id !== null ? '/catalog/product/' + item.product_id : '/catalog/package/' + item.product_combo_id }">
                        <template v-if="item.product_name">{{ item.product_name }}</template>
                        <template v-if="item.product_variant_name">{{ item.product_variant_name }}</template>
                        <template v-if="item.product_combo_name">{{ item.product_combo_name }}</template>
                        <span v-if="item.product_sku">
                          ({{ item.product_sku }})
                        </span>
                      </router-link>

                      <router-link :to="{ path: '/catalog/package/' + item.product_combo_id }">
                        <div v-if="item.product_combo_id" class="mt-8">
                          <strong class="size-11">{{ lang.products_inside }}</strong>
                          <ul class="list-unstyled">
                            <li v-for="productPackage in item.products" :key="productPackage.id">
                              * {{ productPackage.product_name }} ({{ productPackage.qty }})
                            </li>
                          </ul>
                        </div>
                      </router-link>

                      <div v-if="item.note" class="font-12">{{ item.note }}</div>
                      <template v-if="item.prodaddons.length">
                        <div v-for="(addon, idx) in item.prodaddons" :key="idx" class="font-12">+ {{ addon.name }}</div>
                      </template>
                      <div v-if="rowState[key].edited && item.product_id === 1">
                          <el-input
                            v-model="editTable.note"
                            :placeholder="lang.note"
                            type="text"
                            clearable
                            @keyup.native.enter="handleSimpanRow(key, item)"
                          />
                      </div>
                    </div>
                  </div>
                </td>
                <td valign="middle" align="left">
                  <div v-if="rowState[key].edited">
                    <el-input
                      v-if="item.order_with_serial == 1"
                      v-model="editTable.noSerial"
                      :placeholder="$lang[langId].input_code"
                      type="text"
                      clearable
                      style="width: 100px;"
                      @keyup.native.enter="handleSimpanRow(key, item)"
                    />
                  </div>
                  <div v-else>
                    <p v-if="!item.serial_no">-</p>
                    <p v-else>{{ item.serial_no }}</p>
                  </div>
                </td>
                <td valign="middle" align="left">
                  <template v-if="rowState[key].edited">
                    <template
                      v-if="detailData.status === 'P' && detailData.is_paid == 0">
                      <el-input-number
                        v-model="editTable.qty"
                        :min="0"
                        controls-position="right"
                        @keyup.native.enter="handleSimpanRow(key, item)"
                      />
                    </template>
                    <template v-else>
                      <el-input disabled v-model="item.qty"></el-input>
                    </template>
                  </template>
                  <template v-else> {{item.qty}} </template>
                </td>
                <td valign="middle" align="left">
                  <div v-if="rowState[key].edited">
                    <input-money
                      v-if="detailData.status === 'P' && detailData.is_paid == 0"
                      v-model="editTable.price"
                      style="width: 200px;"
                      @keyup.native.enter="handleSimpanRow(key, item)"
                    />
                    <el-input disabled v-else v-model="editTable.price"></el-input>
                  </div>
                  <div v-else class="text-right"> 
                    {{item.fprice}} 
                    <div v-if="item.fdiscount && item.fdiscount !== '0'" class="font-12 text-right">( - {{ item.fdiscount }})</div>
                  </div>
                </td>
                <td v-if="stageLevel === 'dev' || stageLevel === 'sit'" valign="middle" align="right">
                  <!-- <div v-if="rowState[key].edited">
                    <input-money
                      v-if="detailData.status === 'P' && detailData.is_paid == 0"
                      v-model="editTable.discount"
                      style="width: 200px;"
                      @keyup.native.enter="handleSimpanRow(key, item)"
                    />
                    <el-input disabled v-else v-model="editTable.discount"></el-input>
                  </div>
                  <div v-else class="text-right"> {{item.fdiscount}} </div> -->
                  <div v-if="rowState[key].edited" class="flex-container" style="width: 300px">
                    <div style="width: 60%">
                      <input-money v-if="discType === 1 && detailData.status === 'P' && detailData.is_paid == 0" 
                        class="switch-discount--money border border--grey-border" 
                        style="width: 100%" 
                        v-model="editTable.discount" />
                      <el-input
                        v-if="discType === 2"
                        v-model="editTable.discount"
                        class="switch-discount--money border border--grey-border" style="width: 100%" >
                        <template slot="append">%</template>
                      </el-input>
                    </div>
                    <div style="width: 40%">
                      <el-radio-group v-model="discType" class="flex-container" @change="handleMatchDiscount">
                        <el-radio-button class="lpoint-type" style="width: 50%" :label="1">IDR</el-radio-button>
                        <el-radio-button class="lpoint-type" style="width: 50%" :label="2">%</el-radio-button>
                      </el-radio-group>
                    </div>
                  </div>
                  <div v-else class="text-right"> {{item.fdiscount}} </div>
                </td>
                <td valign="middle" align="right">{{item.famount}}</td>
                <td
                  v-if="showEdit && detailData.status === 'P' && detailData.is_paid == 0" >
                  <button-action-authenticated
                    :permission="[customRPermis, 'edit']"
                    v-if="!rowState[key].edited"
                    size="small"
                    type="text"
                    icon="el-icon-edit"
                    style="color: #0286CD;"
                    @click="handleEditRow(key, item)">
                    {{ lang.edit }}
                  </button-action-authenticated>
                  <button-action-authenticated
                    :permission="[customRPermis, 'edit']"
                    v-if="!rowState[key].edited"
                    size="small"
                    type="text"
                    icon="el-icon-delete"
                    style="color: #F55246;"
                    @click="handleDeleteRow(key, item)">
                    {{ rootLang.delete }}
                  </button-action-authenticated>
                  <button-action-authenticated
                    :permission="[customRPermis, 'edit']"
                    v-if="rowState[key].edited"
                    size="small"
                    type="text"
                    icon="el-icon-close"
                    style="color: #595959;"
                    @click="handleCancelRow(key)">
                    {{ lang.cancel }}
                  </button-action-authenticated>
                  <button-action-authenticated
                    :permission="[customRPermis, 'edit']"
                    v-if="rowState[key].edited"
                    size="small"
                    type="text"
                    icon="el-icon-check"
                    style="color: #6EBE46;"
                    @click="handleSimpanRow(key, item)">
                    {{ lang.save }}
                  </button-action-authenticated>
                </td>
                <td v-else></td>
              </tr>
              <tr>
                <td colspan="6" style="border-bottom: 1px solid #000; padding: 0 0 0 0;"></td>
                <td colspan="6" style="border-bottom: 1px solid #000; padding: 0 0 0 0;"></td>
              </tr>
              <tr>
                <td></td>
                <td colspan="2" style="text-align: right;" class="ipad-style">{{ lang.order_amount }}</td>
                <th>{{ detailData.ftotal_item_qty }}</th>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td :colspan="stageLevel === 'dev' || stageLevel === 'sit'? '5' : '4'" style="text-align: right;" class="ipad-style">{{ lang.subtotal }}</td>
                <th align="right" style="text-align: right;">{{ detailData.forder_amount }}</th>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td :colspan="stageLevel === 'dev' || stageLevel === 'sit'? '5' : '4'" style="text-align: right;" class="ipad-style">{{ lang.discount }}</td>
                <th align="right" style="text-align: right;">{{ detailData.fdiscount_amount }} ({{ detailData.fdiscount_percent }}%)</th>
                <td v-if="showEdit">
                  <button-action-authenticated :permission="[customRPermis, 'edit']" v-if="!computedAccess" size="small" type="text" icon="el-icon-setting" @click="setDiscount">
                    {{ lang.settings }} {{ lang.discount }}
                  </button-action-authenticated>
                </td>
                <td v-else></td>
              </tr>
              <tr>
                <td></td>
                <td :colspan="stageLevel === 'dev' || stageLevel === 'sit'? '5' : '4'" style="text-align: right; width: 100px" class="ipad-style">{{ lang.service_charge }}</td>
                <th align="right" style="text-align: right;">{{ detailData.fservice_charge_amount }}</th>
                <td></td>
              </tr>
              <tr v-if="parseInt(detailData.redeemed_amount) !== 0 && detailData.fredeemed_amount !== null">
                <td></td>
                <td :colspan="stageLevel === 'dev' || stageLevel === 'sit'? '5' : '4'" style="text-align: right; width: 100px" class="ipad-style">{{ lang.redeemed_amount }}</td>
                <th align="right" style="text-align: right;">( {{ detailData.fredeemed_amount }} )</th>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td :colspan="stageLevel === 'dev' || stageLevel === 'sit'? '5' : '4'" style="text-align: right;" class="ipad-style">{{ lang.tax }}</td>
                <th style="text-align: right;">{{ detailData.ftax_amount }}</th>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td :colspan="stageLevel === 'dev' || stageLevel === 'sit'? '5' : '4'" style="text-align: right;" class="ipad-style">{{ $lang[langId].rounded }}</td>
                <th style="text-align: right;">{{ detailData.frounded_amount }}</th>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td :colspan="stageLevel === 'dev' || stageLevel === 'sit'? '5' : '4'" style="text-align: right;" class="ipad-style">{{ lang.shipping_cost }}</td>
                <th align="right" style="text-align: right;">{{ detailData.fshipping_cost }}</th>
                <td v-if="showEdit">
                  <button-action-authenticated :permission="[customRPermis, 'edit']" v-if="!computedAccess" size="small" type="text" icon="el-icon-setting" @click="setShippingPayment">
                    {{ lang.settings }} {{ lang.shipping_cost }}
                  </button-action-authenticated>
                </td>
                <td v-else></td>
              </tr>
              <td></td>
              <tr v-if="detailData.unique_payment_code !== 0">
                <td :colspan="stageLevel === 'dev' || stageLevel === 'sit'? '5' : '4'" style="text-align: right;" class="ipad-style">{{ lang.unique_code }}</td>
                <th align="right" style="text-align: right;">{{ detailData.unique_payment_code }}</th>
                <td></td>
              </tr>
              <tr>
                <td colspan="6" style="padding: 0 0 0 0;"></td>
              </tr>
              <tr style="background-color: #fff;">
                <td></td>
                <td :colspan="stageLevel === 'dev' || stageLevel === 'sit'? '5' : '4'" style="text-align: right;" class="ipad-style">{{ lang.total_due }}</td>
                <th align="right" style="text-align: right;">{{ detailData.ftotal_amount }}</th>
                <td></td>
              </tr>
              <tr v-if="!detailData.is_credit" style="background-color: #fff;">
                <td></td>
                <td :colspan="stageLevel === 'dev' || stageLevel === 'sit'? '5' : '4'" style="text-align: right;" class="ipad-style">{{ lang.payment }}</td>
                <th class="font-bold text-right">{{ detailData.fpayment_amount }}</th>
                <td v-if="showEdit">
                  <button-action-authenticated :permission="[customRPermis, 'edit']" v-if="!computedAccess" size="small" type="text" icon="el-icon-setting" @click="setPayment(false)">
                    {{ lang.settings }} {{ lang.payment }}
                  </button-action-authenticated>
                </td>
                <td v-else></td>
              </tr>
              <tr
                v-if="detailData.payment_type_id === 'BT'"
                style="background-color: #fff;">
                <th colspan="6">
                  <p>
                    <label>{{ lang.payment }} {{ detailData.payment_type_name }} ( {{ detailData.bt_bank_name }} - {{ detailData.bt_account_no }} )</label>
                  </p>
                  <p>
                    <label v-if="!detailData.payment_from_bank">{{ lang.payment_via_bank }} : -</label>
                    <label v-else>{{ lang.payment_via_bank }} : {{ detailData.payment_from_bank }} {{ detailData.payment_payee !== null ? '(' + detailData.payment_payee + ')' : ''}}</label>
                  </p>
                  <p>
                    <label v-if="detailData.payment_charge">{{ lang.payment_charge }} : {{ detailData.payment_charge }}</label>
                  </p>
                  <p>
                    <label v-if="!detailData.payment_ref">{{ lang.payment_ref }} : -</label>
                    <label v-else>{{ lang.payment_ref }} : {{ detailData.payment_ref }}</label>
                  </p>
                  <p>
                    <label v-if="!detailData.payment_date">{{ lang.payment_date }} : -</label>
                    <label v-else>{{ lang.payment_date }} : {{ detailData.payment_date }}</label>
                  </p>
                </th>
                <td></td>
              </tr>
              <tr
                v-else
                style="background-color: #fff;">
                <th colspan="6">
                  <p>
                    <label v-if="detailData.payment_mode_name">{{ lang.payment_mode }} : {{ detailData.payment_mode_name }}</label>
                    <label v-else>{{ lang.payment_mode }} : -</label>
                  </p>
                  <p>
                    <template v-if="!detailData.payment_mode_id2">
                      <label v-if="detailData.payment_charge">{{ lang.payment_charge }} : {{ detailData.payment_charge }}</label>
                      <label v-else>{{ lang.payment_charge }} : -</label>
                    </template>
                    <template v-else>
                      <label>{{ lang.total }} {{ lang.payment }} : {{ detailData.fpayment_amount }}</label>
                    </template>
                  </p>
                  <p>
                    <label v-if="!detailData.payment_ref">{{ lang.payment_ref }} : -</label>
                    <label v-else>{{ lang.payment_ref }} : {{ detailData.payment_ref }}</label>
                  </p>
                  <p>
                    <label v-if="!detailData.payment_date">{{ lang.payment_date }} : -</label>
                    <label v-else>{{ lang.payment_date }} : {{ detailData.payment_date }}</label>
                  </p>
                </th>
                <td></td>
              </tr>
              <tr
                v-if="detailData.payment_mode_id2"
                style="background-color: #fff;">
                <th colspan="6">
                  <p>
                    <label v-if="detailData.payment_mode_name2">{{ lang.payment_mode }} : {{ detailData.payment_mode_name2 }}</label>
                    <label v-else>{{ lang.payment_mode }} : -</label>
                  </p>
                  <p>
                    <template v-if="!detailData.payment_mode_id2">
                      <label v-if="detailData.payment_charge">{{ lang.payment_charge }} : {{ detailData.payment_charge }}</label>
                      <label v-else>{{ lang.payment_charge }} : -</label>
                    </template>
                    <template v-else>
                      <label>{{ lang.total }} {{ lang.payment }} : {{ detailData.fpayment_amount2 }}</label>
                    </template>
                  </p>
                  <p>
                    <label v-if="!detailData.payment_ref2">{{ lang.payment_ref }} : -</label>
                    <label v-else>{{ lang.payment_ref }} : {{ detailData.payment_ref2 }}</label>
                  </p>
                </th>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="table-responsive">
          <table class="table-orderitems table table-striped table-bordered">
            <thead>
              <tr>
                <th width="250" class="description">{{ lang.description }}</th>
                <th width="150">{{ lang.serial }}</th>
                <th width="50">{{ lang.qty }}</th>
                <th width="100">{{ lang.price }} ({{ detailData.currency_id }})</th>
                <th width="100" class="total">{{ lang.total_price }} ({{ detailData.currency_id }})</th>
                <th width="100">{{ $lang[langId].action }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, key) in detailData.orderitems" :key="key">
                <td>
                  <div class="flex-container">
                    <el-avatar
                      v-if="item.photo_md"
                      :src="item.photo_md"
                      style="min-width: 40px;"
                    />
                    <div class="ml-8">
                      <router-link :to="{path:'/catalog/product/' + item.product_id}">
                        <template v-if="item.product_name">{{ item.product_name }}</template>
                        <template v-if="item.product_variant_name">{{ item.product_variant_name }}</template>
                        <template v-if="item.product_combo_name">{{ item.product_combo_name }}</template>
                        <span v-if="item.product_sku">
                          ({{ item.product_sku }})
                        </span>

                        <div v-if="item.product_combo_id" class="product-comodities">
                          <strong class="size-11">{{ lang.products_inside }}</strong>
                          <ul class="list-unstyled">
                            <li v-for="productPackage in item.products" :key="productPackage.id">
                              {{ productPackage.product_name }} ({{ productPackage.qty }})
                            </li>
                          </ul>
                        </div>
                        <div v-if="item.note" class="font-12">{{ item.note }}</div>
                      </router-link>
                    </div>
                  </div>

                </td>
                <td valign="middle" align="left">
                  <div v-if="rowState[key].edited">
                    <el-input v-if="item.order_with_serial == 1" type="text" v-model="editTable.noSerial" :placeholder="$lang[langId].input_code" clearable></el-input>
                  </div>
                  <div v-else>
                    <p v-if="!item.serial_no">-</p>
                    <p v-else>{{ item.serial_no }}</p>
                  </div>
                </td>
                <td valign="middle" align="left">
                  <div v-if="rowState[key].edited">
                    <el-input-number v-if="detailData.status === 'P' && detailData.is_paid == 0" v-model="editTable.qty" controls-position="right" :min="0" ></el-input-number>
                    <el-input disabled v-else v-model="item.qty"></el-input>
                  </div>
                  <div v-else> {{item.qty}} </div>
                </td>
                <td valign="middle" align="left">
                  <div v-if="rowState[key].edited">
                    <input-money v-if="detailData.status === 'P' && detailData.is_paid == 0" v-model="editTable.price" @keyup.native.enter="handleSimpanRow(key, item)" />
                    <el-input disabled v-else v-model="editTable.price"></el-input>
                  </div>
                  <div v-else class="text-right"> {{item.fprice}} </div>
                  <div v-if="item.fdiscount && item.fdiscount !== '0'" class="font-12 text-right">( - {{ item.fdiscount }})</div>
                </td>
                <td valign="middle" align="right">{{item.famount}}</td>
                <td v-if="showEdit && detailData.status === 'P' && detailData.is_paid == 0" >
                  <button-action-authenticated
                    :permission="[customRPermis, 'edit']"
                    v-if="!rowState[key].edited"
                    size="small"
                    type="text"
                    icon="el-icon-edit"
                    style="color: #0286CD;"
                    @click="handleEditRow(key, item)">
                    {{ lang.edit }}
                  </button-action-authenticated>
                  <button-action-authenticated
                    :permission="[customRPermis, 'edit']"
                    v-if="!rowState[key].edited"
                    size="small"
                    type="text"
                    icon="el-icon-delete"
                    style="color: #F55246;"
                    @click="handleDeleteRow(key, item)">
                    {{ rootLang.delete }}
                  </button-action-authenticated>
                  <button-action-authenticated
                    :permission="[customRPermis, 'edit']"
                    v-if="rowState[key].edited"
                    size="small"
                    type="text"
                    icon="el-icon-close"
                    style="color: #595959;"
                    @click="handleCancelRow(key)">
                    {{ lang.cancel }}
                  </button-action-authenticated>
                  <button-action-authenticated
                    :permission="[customRPermis, 'edit']"
                    v-if="rowState[key].edited"
                    size="small"
                    type="text"
                    icon="el-icon-check"
                    style="color: #6EBE46;"
                    @click="handleSimpanRow(key, item)">
                    {{ lang.save }}
                  </button-action-authenticated>
                </td>
                <td v-else></td>
              </tr>
              <tr>
                <td colspan="12" style="border-bottom: 1px solid #000; padding: 0 0 0 0;"></td>
              </tr>
              <tr>
                <td colspan="2" class="text-right ipad-style">{{ lang.order_amount }}</td>
                <th>{{ detailData.ftotal_item_qty }}</th>
                <td colspan="3"></td>
              </tr>
              <tr>
                <td colspan="4" class="text-right ipad-style">{{ lang.subtotal }}</td>
                <th align="right" style="text-align: right;">{{ detailData.forder_amount }}</th>
                <td></td>
              </tr>
              <tr>
                <td colspan="4" class="text-right ipad-style">{{ lang.discount }}</td>
                <th align="right" style="text-align: right;">{{ detailData.fdiscount_amount }} ({{ detailData.fdiscount_percent }}%)</th>
                <td v-if="showEdit">
                  <button-action-authenticated :permission="[customRPermis, 'edit']" v-if="!computedAccess" size="small" type="text" icon="el-icon-setting" @click="setDiscount">
                    {{ lang.settings }} {{ lang.discount }}
                  </button-action-authenticated>
                </td>
                <td v-else></td>
              </tr>
              <tr>
                <td colspan="4" class="text-right ipad-style">{{ lang.service_charge }}</td>
                <th align="right" style="text-align: right;">{{ detailData.fservice_charge_amount }}</th>
                <td></td>
              </tr>
              <tr v-if="parseInt(detailData.redeemed_amount) !== 0 && detailData.fredeemed_amount !== null">
                <td></td>
                <td colspan="4" style="text-align: right; width: 100px" class="ipad-style">{{ lang.redeemed_amount }}</td>
                <th align="right" style="text-align: right;">( {{ detailData.fredeemed_amount }} )</th>
                <td></td>
              </tr>
              <tr>
                <td colspan="4" class="text-right ipad-style">{{ lang.tax }}</td>
                <th align="right" style="text-align: right;">{{ detailData.ftax_amount }}</th>
                <td></td>
              </tr>
              <tr>
                <td colspan="4" class="text-right ipad-style">{{ $lang[langId].rounded }}</td>
                <th align="right" style="text-align: right;">{{ detailData.frounded_amount }}</th>
                <td></td>
              </tr>
              <tr>
                <td colspan="4" class="text-right ipad-style">{{ lang.shipping_cost }}</td>
                <th align="right" style="text-align: right;">{{ detailData.fshipping_cost }}</th>
                <td v-if="showEdit">
                  <button-action-authenticated :permission="[customRPermis, 'edit']" v-if="!computedAccess" size="small" type="text" icon="el-icon-setting" @click="setShippingPayment">
                    {{ lang.settings }} {{ lang.shipping_cost }}
                  </button-action-authenticated>
                </td>
                <td v-else></td>
              </tr>
              <tr v-if="detailData.unique_payment_code !== 0">
                <td colspan="4" class="text-right ipad-style">{{ lang.unique_code }}</td>
                <th align="right" style="text-align: right;">{{ detailData.unique_payment_code }}</th>
                <td></td>
              </tr>
              <tr>
                <td colspan="4" class="text-right ipad-style">{{ lang.total_due }}</td>
                <th align="right" style="text-align: right;">{{ detailData.ftotal_amount }}</th>
                <td></td>
              </tr>
              <tr>
                <td colspan="4" class="text-right ipad-style">{{ lang.payment }} {{ detailData.payment_mode_name }}</td>
                <th align="right" style="text-align: right;">{{ detailData.fpayment_amount }}</th>
                <td v-if="showEdit">
                  <button-action-authenticated :permission="[customRPermis, 'edit']" v-if="!computedAccess" size="small" type="text" icon="el-icon-setting" @click="setPayment(false)">
                    {{ lang.settings }} {{ lang.payment }}
                  </button-action-authenticated>
                </td>
                <td v-else></td>
              </tr>
              <tr v-for="item in detailData.creditpayments" :key="item.id">
                <td v-if="item.payment_mode_name === ''" colspan="4" class="text-right ipad-style">
                  {{ lang.payment }} {{ item.payment_type_name }} {{ item.fpayment_date }}
                </td>
                <td v-else colspan="4" class="text-right ipad-style">
                  {{ lang.payment }} {{ item.payment_mode_name }} {{ item.fpayment_date }}
                </td>
                <th>{{ item.fpayment_amount }}</th>
                <td></td>
              </tr>
              <tr v-if="parseInt(detailData.credit_outstanding_amount) !== 0">
                <td colspan="4" class="text-right ipad-style">{{ lang.outstanding_payment }}</td>
                <th align="right" style="text-align: right;">{{ detailData.fcredit_outstanding_amount }}</th>
                <td v-if="showEdit">
                  <button-action-authenticated :permission="[customRPermis, 'edit']" size="small" type="text" icon="el-icon-plus" @click="setPayment(true)">
                    {{ lang.payment }}
                  </button-action-authenticated>
                </td>
              </tr>
              <tr style="background-color: #fff;">
                <td style="border: none; text-align: right;"></td>
                <th colspan="3" style="border: none; text-align: right;">
                  <p>
                    <label v-if="!detailData.payment_from_bank">{{ lang.payment_via_bank }} : -</label>
                    <label v-else>{{ lang.payment_via_bank }} : {{ detailData.payment_from_bank }} {{ detailData.payment_payee !== null ? '(' + detailData.payment_payee + ')' : ''}}</label>
                  </p>

                  <p>
                    <label v-if="detailData.payment_charge">{{ lang.payment_charge }} : {{ detailData.payment_charge }}</label>
                  </p>

                  <p>
                    <label v-if="!detailData.payment_ref">{{ lang.payment_ref }} : -</label>
                    <label v-else>{{ lang.payment_ref }} : {{ detailData.payment_ref }}</label>
                  </p>

                  <p>
                    <label v-if="!detailData.payment_date">{{ lang.payment_date }} : -</label>
                    <label v-else>{{ lang.payment_date }} : {{ detailData.payment_date }}</label>
                  </p>
                </th>
                <td style="border: none;"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <el-dialog :title="lang.add_product" :visible.sync="addProductDialog" :close-on-click-modal="false" custom-class="mw-760">
      <div v-loading="addingOrderItem">
        <div class="row add-product">
          <div class="col-md-3 text-right">
            <label>{{ lang.product }}</label>
          </div>
          <div class="col-md-9">
            <input-autocomplete
                ref="InputAutocomplete"
                :fetch-suggestions="setQueryString"
                :searching-products="loadingSearch"
                :search-result-products="searchData"
                @select="selectProduct"
              />
          </div>
        </div>
        <div style="margin-bottom: 8px;"></div>
        <div class="row">
          <div class="col-md-3 text-right">
            <label>{{ lang.qty }}</label>
          </div>
          <div class="col-md-9">
            <!-- <el-input v-model="formAddProduct.qty" type="number" :placeholder="$lang[langId].input_number" @change="handleQtyProduct(formAddProduct.qty)"></el-input> -->
            <el-input-number v-model="formAddProduct.qty" controls-position="right" :min="0" @keyup.native.enter="addProductsToSale"></el-input-number>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="text" @click="addProductDialog = false">{{ lang.cancel }}</el-button>
        <el-button type="success" @click="addProductsToSale" icon="el-icon-plus">
          {{ lang.add }}
        </el-button>
      </span>
    </el-dialog>

    <el-dialog :title="lang.product_combo" :visible.sync="packageProductDialog" :close-on-click-modal="false" custom-class="mw-760">
      <div v-loading="loadingPackage">
        <div class="row mb-12">
          <div class="col-md-4 font-bold">{{ lang.combo }}</div>
          <div class="col-md-8">
             <el-autocomplete class="inline-form" @select="handleSelectPackage" v-model="formPackage.package" :fetch-suggestions="getProductCombo"
                  :debounce="autoCompleteStartOn" :placeholder="lang.please_select" clearable>
              </el-autocomplete>
          </div>
        </div>
        <div
          v-if="formPackage.selectPackageData && formPackage.selectPackageData.items">
          <div class="font-bold mb-12">
            {{ lang.products_in_combo }}:
          </div>
          <div
            v-for="(item, index) in formPackage.selectPackageData.items.data"
            :key="index"
            class="row mb-12">
            <div class="col-md-4">{{ item.product_group_name }}</div>
            <div class="col-md-8">
              <el-select
                v-model="packageSelect[index]"
                class="w-fit">
                <el-option 
                  v-for="item in item.tempItems" 
                  :key="item.id" 
                  :label="item.name" 
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="row mb-12">
          <div class="col-md-4 font-bold">
            {{ lang.qty }}
          </div>
          <div class="col-md-8">
            <el-input-number v-model="formPackage.qty" controls-position="right" :min="0"></el-input-number>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="packageProductDialog = false">{{ lang.cancel }}</el-button>
        <el-button type="success" @click="addPackageProduct" icon="el-icon-plus">
          {{ lang.save }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog class="delete" :visible.sync="deleteRowProduct" :close-on-click-modal="false" custom-class="mw-760">
      <div style="text-align: center;">
        <h3 style="font-weight: bold;" class="alert-delete">
          <svg-icon icon-class="alert-triangle" style="stroke:#FFB05C; width:22px; height:22px;"></svg-icon>
          {{ lang.are_you_sure_to_remove_this_data }}?
        </h3>
      </div>
      <div class="row delete-image" :data="deleteRowData" style="margin: 30px 20px 20px 20px;">
        <div class="col-md-3">
          <img :src="deleteRowData.photo_md" :alt="deleteRowData.product_name" class="table-image">
        </div>
        <div class="col-md-9">
          <h3>{{ deleteRowData.product_name }}</h3>
          <p>{{ deleteRowData.product_sku}}</p>
          <p>{{ deleteRowData.product_variant_name }}</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="text" @click="saveDeleteRow(deleteRowData.id)" style="color:#F44336">{{ $lang[langId].delete }}</el-button>
        <el-button type="text" @click="deleteRowProduct = false">{{ lang.cancel }}</el-button>
      </span>
    </el-dialog>

    <el-dialog class="discount" :title="lang.discount " :visible.sync="dialogDiscount" :close-on-click-modal="false" custom-class="mw-760">
      <div>
        <h3>{{ $lang[langId].please_input }}{{ lang.discount }}</h3>
        <p>{{ $lang[langId].info_discount_one_type }}</p>
        <el-radio-group
          v-model="discountValue"
          size="mini"
          @change="handleRadioDiscount">
          <el-radio-button label="1">
            <span style="font-size: 18px; margin-right:10px;">%</span>
            {{ lang.discount }}
          </el-radio-button>
          <el-radio-button label="2">
            <span style="font-size: 18px; margin-right:10px;">$</span>
            {{ $lang[langId].nominal }}
          </el-radio-button>
          <el-radio-button label="3">
            <span style="font-size: 18px; margin-right:10px;"><i class="fa fa-tag" /></span>
            {{ lang.discount_coupon }}
          </el-radio-button>
        </el-radio-group>

        <el-input v-if="discountValue === '1'" v-model="discountForm.percent" type="number" :min="0" :max="100" @focus="onFocusPercent" @keyup.native="handlePercent">
          <template slot="append">%</template>
        </el-input>
        <input-money v-if="discountValue === '2'" v-model="discountForm.price" @keyup.native="handlePrice"/>
        <el-input v-if="discountValue === '3'" v-model="discountForm.coupon" :placeholder="$lang[langId].input_code">
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="text" @click="handleRadioDiscount" style="color:#F44336">{{ $lang[langId].delete }}</el-button>
        <el-button type="success" @click="saveDiscount(discountValue)">{{ lang.save }}</el-button>
      </span>
    </el-dialog>

    <el-dialog
      class="shipping-price"
      :title="lang.shipping_cost"
      :visible.sync="dialogShipping"
      :close-on-click-modal="false"
      custom-class="mw-760">
      <div>
        <el-button type="primary" plain @click="manualTable = false" :autofocus="true">{{ $lang[langId].automatic }}</el-button>
        <el-button type="primary" plain @click="getManualTable(detailData.id)">{{ $lang[langId].manual }}</el-button>
      </div>
      <hr>
      <div v-if="!manualTable" v-loading="loadingAuto">
        <div class="row header">
          <div class="col-md-1">
            <span></span>
          </div>
          <div class="col-md-2" style="left:30px;">
            <p>{{ lang.courier }}</p>
          </div>
          <div class="col-md-3" style="left:30px;">
            <p>{{ lang.type }}</p>
          </div>
          <div class="col-md-2">
            <p>{{ lang.est }}</p>
          </div>
          <div class="col-md-2">
            <p>{{ lang.weight }}</p>
          </div>
          <div class="col-md-2">
            <p>{{ lang.tariff }}</p>
          </div>
        </div>
        <div>
          <ul class="cart-items">
            <li
              v-for="(item, index) in automateDataTable"
              :key="index"
              :class="{'active':formShipping.automateRadio===index}">
              <div class="row">
                <div class="col-md-1">
                  <el-radio
                    v-model="formShipping.automateRadio"
                    :label="index"
                    @change="radioAutomateTable(item)">
                    <span></span>
                  </el-radio>
                </div>
                <div v-if="!item.courier_name" class="col-md-2">
                  -
                </div>
                <div v-else class="col-md-2">
                  {{ item.courier_name }}
                </div>
                <div v-if="!item.type_name" class="col-md-3">
                  -
                </div>
                <div v-else class="col-md-3">
                  {{ item.type_name }}
                </div>
                <div v-if="!item.etd_days" class="col-md-2">
                  -
                </div>
                <div v-else class="col-md-2">
                  {{ item.etd_days }} {{ lang.day }}
                </div>
                <div v-if="!item.total_weight" class="col-md-2">
                  -
                </div>
                <div v-else class="col-md-2">
                  {{ item.total_weight }}
                </div>
                <div v-if="!item.ftotal_tariff" class="col-md-2">
                  -
                </div>
                <div v-else class="col-md-2">
                  {{ item.ftotal_tariff }}
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="row type-footer" style="margin-top: 10px;">
          <div class="col-md-6 text-right">
            <p>{{ lang.type }}</p>
          </div>
          <div class="col-md-6">
            <el-input v-model="formShipping.typeNameAutomate" disabled :placeholder="lang.please_select"></el-input>
          </div>
        </div>
        <div class="row" style="margin-top: 10px;">
          <div class="col-md-6 text-right">
            <p>{{ lang.shipping_cost }}</p>
          </div>
          <div class="col-md-6">
            <input-money v-model="formShipping.priceAutomate" />
          </div>
        </div>
      </div>
      <div v-else v-loading="loadingManual">
        <div class="row header">
          <div class="col-md-1">
            <span></span>
          </div>
          <div class="col-md-4" style="left:30px;">
            <p>{{ lang.courier }}</p>
          </div>
          <div class="col-md-4" style="left:30px;">
            <p>{{ lang.type }}</p>
          </div>
          <div class="col-md-2">
            <p>{{ lang.weight }}</p>
          </div>
        </div>
        <div>
          <ul class="cart-items">
            <li
              v-for="(item, index) in manualDataTable"
              :key="index"
              :class="{'active':formShipping.manualRadio===index}">
              <div class="row">
                <div class="col-md-1">
                  <el-radio v-model="formShipping.manualRadio" :label="index" @change="radioManualTable(item)">
                    <span></span>
                  </el-radio>
                </div>
                <div v-if="!item.courier_name" class="col-md-4">
                  -
                </div>
                <div v-else class="col-md-4">
                  {{ item.courier_name }}
                </div>
                <div v-if="!item.type_name" class="col-md-4">
                  -
                </div>
                <div v-else class="col-md-4">
                  {{ item.type_name }}
                </div>
                <div v-if="!item.total_weight" class="col-md-2">
                  -
                </div>
                <div v-else class="col-md-2">
                  {{ item.total_weight }}
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="row type-footer" style="margin-top: 10px;">
          <div class="col-md-6 text-right">
            <p>{{ lang.type }}</p>
          </div>
          <div class="col-md-6">
            <el-input v-model="formShipping.typeName" disabled :placeholder="lang.please_select"></el-input>
          </div>
        </div>
        <div class="row" style="margin-top: 10px;">
          <div class="col-md-6 text-right">
            <p>{{ lang.shipping_cost }}</p>
          </div>
          <div class="col-md-6">
            <input-money v-model="formShipping.price" />
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="text" @click="dialogShipping = false">{{ lang.cancel }}</el-button>
        <el-button v-if="!manualTable" @click="saveShipping('automate')" type="success">{{ lang.save }}</el-button>
        <el-button v-else type="success" @click="saveShipping('manual')">{{ lang.save }}</el-button>
      </span>
    </el-dialog>

    <el-dialog
      class="payment"
      :title="lang.payment"
      :visible.sync="dialogPayment"
      :close-on-click-modal="false"
      custom-class="mw-760">
      <div>
        <div class="row">
          <div class="col-md-5 text-right">
            <h4>{{ lang.payment_date }}</h4>
          </div>
          <div class="col-md-7">
            <el-date-picker
              v-model="formPayment.paymentDate"
              :placeholder="$lang[langId].pick_a_day"
              :clearable="false"
              type="date"
              format="dd-MM-yyyy"
              value-format="yyyy-MM-dd"
            />
          </div>
        </div>
        <hr>
        <div class="row">
          <div class="col-md-5 text-right">
            <h4>{{ lang.payment_methods }}</h4>
          </div>
          <div class="col-md-7">
            <el-select class="inline-form" v-model="formPayment.paymentMethodLabel" filterable :placeholder="lang.please_select" @change="handlePaymentMethod">
              <el-option v-for="item in paymentMethodData" :label="item.name" :key="item.id" :value="item">
                <span v-if="item.name !== null" style="float: left">{{ item.name }}</span>
                <span v-else  style="float: left">{{ item.payment_type }}</span>
                <span v-if="item.payment_type_id === 'BT'">{{ ' (' + item.bt_bank_name + '-' + item.bt_account_no + ')' }}</span>
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="row" v-if="formPayment.paymentMethodType === 'BT'">
          <div class="col-md-5 text-right">
            <h4>{{ $lang[langId].payment_via }}</h4>
          </div>
          <div class="col-md-7">
            <el-input v-model="formPayment.paymentVia"></el-input>
          </div>
        </div>
        <div class="row"  v-if="formPayment.paymentMethodType === 'BT'">
          <div class="col-md-5 text-right">
            <h4>{{ lang.bank_account_name }}</h4>
          </div>
          <div class="col-md-7">
            <el-input v-model="formPayment.paymentName"></el-input>
          </div>
        </div>
        <div class="row" v-if="formPayment.paymentMethodType !== 'CS'">
          <div class="col-md-5 text-right">
            <h4>{{ lang.payment_ref }}</h4>
            <p>{{ lang.info_payment_ref }}</p>
          </div>
          <div class="col-md-7">
            <el-input v-model="formPayment.paymentReference" :placeholder="$lang[langId].please_input+lang.payment_ref"></el-input>
          </div>
        </div>
        <hr>
        <div class="row" v-if="formPayment.paymentMethodType === 'BT' &&
          formPayment.unique_code !== 0">
          <div class="col-md-5 text-right">
            <h4>{{ lang.unique_code }}</h4>
          </div>
          <div class="col-md-7">
            <el-input v-model="formPayment.paymentUniq" :placeholder="$lang[langId].input_code"></el-input>
          </div>
        </div>
        <div class="row">
          <div class="col-md-5 text-right">
            <h4>{{ lang.payment_currency }}</h4>
          </div>
          <div class="col-md-7">
            <el-select class="inline-form" v-model="formPayment.paymentCurrency" filterable :placeholder="lang.please_select">
              <el-option v-for="item in currencyData" :key="item.currency_id" :label="item.currency_name" :value="item.currency_id">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="row">
          <div class="col-md-5 text-right">
            <h4>{{ lang.payment_amount }}</h4>
          </div>
          <div class="col-md-7">
            <div class="el-input">
              <input-money v-model="formPayment.paymentTotal" />
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="text" @click="dialogPayment = false">{{ lang.cancel }}</el-button>
        <el-button type="success" :disabled="loadingPayment" @click="savePayment">
          <span v-if="loadingPayment">
            <loading-component :active="true" color= '#1bb4e6' loader="dots" :width="32" :height="10" backgroundColor='#ffffff' style="text-align: center"></loading-component>
          </span>
          <span v-else>{{ lang.save }}</span>
        </el-button>
      </span>
      <el-dialog
          width="30%"
          :title="$lang[langId].accounting_3rd_party_process"
          :visible.sync="waitingPayment"
          :show-close="false"
          :close-on-click-modal="false"
          append-to-body>
          <div align="center">{{$lang[langId].jurnal_please_wait}}</div>
          <loading-component 
            :active="true" 
            color= '#1bb4e6'
            loader="bars"
            :width="64"
            :height="64" 
            backgroundColor='#ffffff'
            style="text-align: center">
          </loading-component>
      </el-dialog>
    </el-dialog>

    <el-dialog
      :title="lang.import"
      :visible.sync="importDialog">
      <div>
        <div class="mb-8">
          <el-button @click="downloadTemplate">{{ lang.download_template }}</el-button>
        </div>
        <div class="flex-container justify-center">
          <el-upload
            v-loading="loadingImport"
            ref="importProduct"
            class="upload-demo"
            drag
            :action="uploadImportUrl.url"
            :headers="uploadImportUrl.header"
            :on-success="handleSuccessImport"
            :on-error="handlerErrorImport"
            :on-progress="handleOnProgressImport"
            :data="{
              order_id: $route.params.id
            }"
            multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
            <div class="el-upload__tip" slot="tip">
              {{ lang.import_from_csv_info }}
            </div>
          </el-upload>
        </div>
      </div>
    </el-dialog>

  </el-card>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import InputMoney from '@/components/InputMoneyV2'
import InputAutocomplete from '@/components/modules/InputAutocomplete'
import { debounce } from 'vue-debounce'
import baseURL from '@/utils/baseURL'
import LoadingComponent from 'vue-loading-overlay';

import basicComputedMixin from '@/mixins/basicComputedMixin'
import ButtonActionAuthenticated from '../../../ButtonActionAuthenticated.vue'

export default {
  name: 'OrderTable',
  components: {
    InputMoney,
    InputAutocomplete,
    LoadingComponent,
    ButtonActionAuthenticated
  },

  mixins: [basicComputedMixin],

  props: {
    dataTable: {
      default: null,
      type: Object
    },
    editShow: {
      default: true,
      type: Boolean
    },
  },

  data() {
    return {
      loading: true,
      detailData: {},
      showEdit: true,
      showTable: false,
      addProductDialog: false,
      packageProductDialog: false,
      deleteRowProduct: false,
      dialogDiscount: false,
      dialogShipping: false,
      dialogPayment: false,
      waitingPayment: false,
      rowState: [],
      formAddProduct: {
        qty: 1
      },
      searchQuery: '',
      searchData: [],
      addingOrderItem: false,
      loadingPackage: false,
      deleteRowData: {},
      discountValue: '1',
      discountForm: {
        percent: 0,
        price: 0,
        coupon: ''
      },
      manualTable: false,
      automateDataTable: [],
      manualDataTable: [],
      formLabelWidth: '30%',
      formPayment: {
        paymentDate: '',
        paymentMethodId: '',
        paymentMethodLabel: '',
        paymentMethodType: '',
        paymentVia: '',
        paymentName: '',
        paymentReference: '',
        paymentUniq: this.randomString(3),
        paymentCurrency: '',
        paymentTotal: ''
      },
      formShipping: {
        automateRadio: '',
        typeIdAutomate: '',
        typeNameAutomate: '',
        priceAutomate: '',
        manualRadio: '',
        typeId: '',
        typeName: '',
        price: ''
      },
      currencyData: [],
      paymentMethodData: [],
      editTable: {
        noSerial: '',
        qty: '',
        price: '',
        note: '',
        discount: ''
      },
      packageProductData: [],
      formPackage: {},
      selectPackageData: {},
      showPackage: false,
      outstanding: false,
      packageSelect: [],
      loadingGetCombo: false,
      importDialog: false,
      loadingImport: false,
      loadingManual: false,
      loadingAuto: false,
      loadingSearch: false,
      loadingPayment: false,
      autoCompleteStartOn: 300,
      discType: 1,
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
    rootLang() {
      return this.$lang[this.$store.state.userStores.langId]
    },

    uploadImportUrl() {
      let data = {
        // url: baseURL + 'api/' + this.selectedStore.url_id + '/admin/v1/' + this.langId + '/openorder/importitem',
        url: baseApi(this.selectedStore.url_id, this.langId, 'openorder/importitem'),
        header: {
          'authorization' : 'Bearer ' + this.token.access_token,
          'accept' : 'application/json'
        }
      }
      return data
    },

    accessByStore () {
      return ['cvsms']
    },
    computedAccess () {
      if (this.accessByStore.includes(this.selectedStore.url_id) && (this.selectedStore.role_id === 'ST' || this.selectedStore.role_id === 'SS')) {
        return true
      }
    }
  },

  watch: {
    dataTable() {
      this.getData()
    },
    editShow() {
      this.showEditForm()
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
  },

  methods: {
    showEditForm() {
      this.showEdit = this.editShow
      // console.log('showEdit', this.showEdit)
    },
    getData() {
      this.detailData = Object.assign({}, this.dataTable)
      this.refreshTable()
    },
    refreshTable() {
      this.loading = true
      if (this.detailData.orderitems.length > 0) {
        this.loading = false
        this.detailData.orderitems.map((row, idx) => {
          this.$set(row, 'edited', false)
          this.rowState.push(row)
        })
        // console.log(this.rowState)
        this.showTable = true
      } else {
        this.loading = false
        this.showTable = false
      }
    },

    selectProduct(item) {
      this.formAddProduct.product = item
    },

    setQueryString (queryString) {
      if (queryString) {
        this.getProductSearch(queryString)
        // const dFn = debounce(queryString => this.getProductSearch(queryString), '100ms')
        // dFn(queryString)
        // return debounce(() => {
        //   // Taken from issue #36 as an example
        //   this.getProductSearch(queryString)
        // }, 600)
      } else {
        this.searchData = []
      }
    },

    getProductSearch(queryString, callback) {
      this.loadingSearch = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        sort_column: 'name',
        sort_type: 'asc',
        search: queryString,
        per_page: 1000
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productvariantonlysearch'),
        headers: headers,
        params: params
      })
        .then(response => {
          this.searchData = response.data.data
          this.loadingSearch = false
        })
        .catch(error => {
          this.searchData = []
          this.loadingSearch = false
        })
    },
    getProductSelect(item) {
      this.formAddProduct.product = item.product_id
    },
    addProductsToSale() {
      this.addingOrderItem = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
        order_id: this.detailData.id,
        item_products: this.formAddProduct.product ? this.formAddProduct.product.join(',') : '',
        item_qty: this.formAddProduct.qty
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'openorder/additem'),
        headers: headers,
        data: data
      })
        .then(response => {
          // this.result = response.data
          this.detailData = response.data.data
          this.$message({
            message: 'Success',
            type: 'success'
          })
          this.addingOrderItem = false
          this.addProductDialog = false
          this.$nextTick(() => {
            this.$refs.InputAutocomplete.resetKeyword()
          })
          this.refreshTable()
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.addingOrderItem = false
          this.addProductDialog = true
        })
    },
    showProductDialog() {
      this.searchData = []
      this.searchQuery = ''
      this.formAddProduct = {
        product: '',
        qty: 1
      }
      this.addProductDialog = true
    },
    showPackageDialog() {
      // this.getProductCombo()
      this.formPackage = {
        package: '',
        selectPackageData: {},
        qty: 0
      }
      this.showPackage = false
      this.packageProductDialog = true
    },
    getProductCombo(queryString, callback) {
      // this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        sort_column: 'id',
        sort_type: 'asc',
        search: queryString
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productcombo'),
        headers: headers,
        params: params
      })
        .then(response => {
          for (let i of response.data.data) {
            i.value = i.name
          }
          this.packageProductData = response.data.data
          // this.loading = false
          callback(this.packageProductData)
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.packageProductData = []
          // this.loading = false
        })
    },
    handleSelectPackage(val) {
      this.loadingGetCombo = true
      this.packageSelect = []
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let id = val.id
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productcombo/' + id),
        headers: headers
      })
        .then(response => {
          // this.itemCombo = []
          this.formPackage.selectPackageData = response.data.data
          console.log(this.formPackage.selectPackageData)
          this.formPackage.selectPackageData.items.data.map((i, idx) => {
            if (i.product_sku !== null && i.product_name !== null && i.product_variant_name !== null) {
              i.name = i.product_sku +'-'+ i.product_name+'-'+ i.product_variant_name
            } else if (i.product_variant_sku !== null && i.product_name !== null && i.product_variant_name !== null) {
              i.name = i.product_variant_sku +'-'+i.product_name+'-'+i.product_variant_name
            } else if (i.product_sku === null && i.product_name && i.product_variant_name) {
              i.name = i.product_name+'-'+i.product_variant_name
            } else if (i.product_variant_id === 0 && i.product_name) {
              if (i.variant.length) {
                i.name = i.product_name + '-' + i.variant[0].name
              } else {
                i.name = i.product_name
              }
            } else {
              i.name = i.product_name
            }
            // i.product_sku && i.product_name && i.product_variant_name ? i.name = i.product_sku +'-'+ i.product_name+'-'+ i.product_variant_name : 
            // i.product_variant_sku && i.product_name && i.product_variant_name ? i.name = i.product_variant_sku +'-'+i.product_name+'-'+i.product_variant_name :
            // !i.product_sku && i.product_name && i.product_variant_name ? i.name = i.product_name+'-'+i.product_variant_name :
            // i.product_variant_id === 0 && i.product_name ? i.name = i.product_name + '-' + i.variant[0].name : i.name = i.product_name
            let item = []
            item.push(i)
            this.packageSelect[idx] = i.id

            if (i.children.data.length > 0) {
              i.children.data.map(j => {
                j.product_sku && j.product_name && j.product_variant_name ? j.name = j.product_sku +'-'+j.product_name+'-'+j.product_variant_name : 
                j.product_variant_sku && j.product_name && j.product_variant_name ? j.name = j.product_variant_sku +'-'+j.product_name+'-'+j.product_variant_name :
                !j.product_sku && j.product_name && j.product_variant_name ? j.name = j.product_name+'-'+j.product_variant_name :
                j.product_variant_id === 0 && j.product_name && j.variant.length ? j.name = j.product_name + '-' + j.variant[0].name : j.name = j.product_name
                item.push(j)
              })
            }
            i.tempItems = item
          })
          // for (let item of this.formPackage.selectPackageData.items.data) {
          //   if (item.children.data.length > 0) {
          //     this.tesData = item.children.data
          //   }
          // }
          this.loadingGetCombo = false
          this.showPackage = true
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.message,
            message: error.string
          })
          console.log('ee', error)
          this.loadingGetCombo = false
        })
    },
    addPackageProduct(store) {
      this.loadingPackage = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
        order_id: this.detailData.id,
        item_combo_id: this.formPackage.selectPackageData.id,
        item_combo_qty: this.formPackage.qty
      }
      if (this.formPackage.selectPackageData.items) {
        if (this.formPackage.selectPackageData.items.data.length > 0) {
          this.formPackage.selectPackageData.items.data.map((row, idx) => {
            row.tempItems.map((j, index) => {
              if (this.packageSelect[idx] === j.id) {
                data['item_combo_' + row.id + '_' + idx] = j.product_id + '|' + j.product_variant_id
              }
            })
            // data['item_combo_' + row.id + '_' + idx] = row.product_id + '|' + idx
          })
        }
      }
      
      // console.log('data',data)
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'openorder/additemcombo'),
        headers: headers,
        data: data
      })
        .then(response => {
          // this.result = response.data
          this.detailData = response.data.data
          this.$message({
            message: 'Success',
            type: 'success'
          })
          this.loadingPackage = false
          this.packageProductDialog = false
          this.refreshTable()
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.message,
            message: error.string
          })
          this.loadingPackage = false
          this.packageProductDialog = true
        })
    },
    async handleEditRow(index, item) {
      await this.rowState.map(row => {
        row.edited = false
      })
      if (item.serial_no === null || item.serial_no === 'null') {
        this.editTable.noSerial = ''
      } else {
        this.editTable.noSerial = item.serial_no
      }
      this.editTable.qty = item.qty
      this.editTable.price = item.price
      this.editTable.note = item.note
      this.editTable.order_with_serial = item.order_with_serial
      this.editTable.discount = item.discount
      this.rowState[index].edited = true
    },
    handleSimpanRow(index, item) {
      let block = false
      if (this.editTable.order_with_serial === 1) {
        let serial = this.editTable.noSerial.split('\n')
        serial.map(i => {
          if (i.length <= 1) {
            block = true
          }
        })
        if (block) {
          this.$notify({
            type: 'warning',
            message: 'Serial harus lebih dari 1 digit'
          })
        }
      }
      if (this.discType === 2) {
        let disc = (this.editTable.discount/100) * (this.editTable.price * this.editTable.qty)
        this.editTable.discount = disc
      }
      if (!block) {
        this.loading = true
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }
        let data = {
          order_id: this.detailData.id,
          id: item.id,
          serial_no: this.editTable.noSerial,
          qty: this.editTable.qty,
          price: this.editTable.price,
          note: this.editTable.note,
          discount: this.editTable.discount
        }
        axios({
          method: 'POST',
          url: baseApi(this.selectedStore.url_id, this.langId, 'openorder/updatedetail'),
          headers: headers,
          data: data
        })
          .then(response => {
            // this.result = response.data
            this.detailData = response.data.data
            this.$message({
              message: 'Success',
              type: 'success'
            })
            this.loading = false
            this.rowState[index].edited = false
            // this.getData()
            this.refreshTable()
          })
          .catch(error => {
            this.$notify({
              type: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error
            })
            // console.log(error)
            this.loading = false
            // this.getData()
          })
      }
    },
    handleCancelRow(index) {
      this.editTable = {
        noSerial: '',
        qty: '',
        price: '',
        note: '',
        discount: ''
      }
      this.discType = 1
      this.rowState[index].edited = false
    },
    handleDeleteRow(index, item) {
      this.deleteRowData = item
      this.deleteRowProduct = true
    },
    saveDeleteRow(rowId) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
        order_id: this.detailData.id,
        id: rowId,
        qty: 0
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'openorder/updateitemqty'),
        headers: headers,
        data: data
      })
        .then(response => {
          // this.result = response.data
          this.detailData = response.data.data
          this.$message({
            message: 'Success',
            type: 'success'
          })
          this.loading = false
          this.deleteRowProduct = false
          this.refreshTable()
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          // console.log(error)
          this.loading = false
        })
    },
    getAutomateTable(id) {
      this.loadingAuto = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        id: id
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'openorder/shippingtariffs'),
        headers: headers,
        params: params
      })
        .then(response => {
          this.automateDataTable = response.data.data
          this.loadingAuto = false
          this.manualTable = false
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.loadingAuto = false
        })
    },
    getManualTable(id) {
      this.loadingManual = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        order_id: id
      }
      axios({
        method: 'GET',
        url: baseApi(
          this.selectedStore.url_id,
          this.langId,
          'openorder/shippingtariffsmanual'
        ),
        headers: headers,
        params: params
      })
        .then(response => {
          this.manualDataTable = response.data.data
          this.loadingManual = false
          this.manualTable = true
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.loadingManual = false
        })
    },
    getPaymentMethod() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let id = this.detailData.id
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'openorder/editpayment/' + id),
        headers: headers
      })
        .then(response => {
          this.paymentMethodData = response.data.data.payment_modes
          this.loading = false
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
    getCurrency() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'currency'),
        headers: headers
      })
        .then(response => {
          this.currencyData = response.data.data
          this.loading = false
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
    setDiscount() {
      this.handleRadioDiscount()
      this.dialogDiscount = true
    },
    handleRadioDiscount() {
      this.discountForm.percent = 0
      this.discountForm.price = 0
      this.discountForm.coupon = ''
    },
    onFocusPercent() {
      let percentValue = null
      this.discountForm.percent = percentValue
    },
    saveDiscount(block) {
      if (block === '1') {
        let url = baseApi(
          this.selectedStore.url_id,
          this.langId,
          'openorder/updateDiscountAmount'
        )
        let valuePercent = parseFloat(this.discountForm.percent)
        let orderAmount = parseInt(this.detailData.order_amount)
        // console.log(valuePercent)
        // console.log(orderAmount)
        // let countPercent = valuePercent * (orderAmount / 100)
        let countPercent = (valuePercent * orderAmount) / 100
        // console.log(countPercent)
        let data = {
          pk: this.detailData.id,
          value: countPercent
        }
        this.updateDiscount(block, url, data)
      } else if (block === '2') {
        let url = baseApi(
          this.selectedStore.url_id,
          this.langId,
          'openorder/updateDiscountAmount'
        )
        let data = {
          pk: this.detailData.id,
          value: this.discountForm.price
        }
        this.updateDiscount(block, url, data)
      } else if (block === '3') {
        let url = baseApi(
          this.selectedStore.url_id,
          this.langId,
          'openorder/updateDiscountCode'
        )
        let data = {
          pk: this.detailData.id,
          value: this.discountForm.coupon
        }
        this.updateDiscount(block, url, data)
      }
    },
    updateDiscount(block, url, data) {
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
          this.detailData = response.data.data
          this.$message({
            message: 'Success',
            type: 'success'
          })
          this.loading = false
          this.dialogDiscount = false
          // this.getData()
          this.refreshTable()
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.loading = false
          // this.getData()
          // this.refreshTable()
        })
    },
    setPayment(outstanding) {
      this.outstanding = outstanding
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();

      today = yyyy + '-' + mm + '-' + dd;
      this.formPayment.paymentDate = today
      this.formPayment.paymentMethodId = ''
      this.formPayment.paymentMethodLabel = ''
      this.formPayment.paymentMethodType = ''
      this.formPayment.paymentVia = ''
      this.formPayment.paymentName = ''
      this.formPayment.paymentReference = ''
      this.formPayment.paymentUniq = ''
      this.formPayment.paymentCurrency = this.detailData.currency_id
      if (this.detailData.is_credit && this.outstanding) {
        this.formPayment.paymentTotal = this.detailData.credit_outstanding_amount
      } else {
        this.formPayment.paymentTotal = this.detailData.total_amount
      }
      this.getPaymentMethod()
      this.getCurrency()
      this.dialogPayment = true
    },
    setShippingPayment() {
      this.formShipping = {
        automateRadio: '',
        typeIdAutomate: '',
        typeNameAutomate: '',
        priceAutomate: '',
        manualRadio: '',
        typeId: '',
        typeName: '',
        price: ''
      }
      let id = this.detailData.id
      this.getAutomateTable(id)
      this.dialogShipping = true
    },
    radioAutomateTable(val) {
      // console.log('val', val)
      this.formShipping.idAutomate = val.id
      this.formShipping.typeIdAutomate = val.courier_id
      this.formShipping.typeAutomate = val.type
      this.formShipping.typeNameAutomate = val.type_name
      this.formShipping.priceAutomate = val.tariff
    },
    radioManualTable(val) {
      // console.log(val)
      let courierId = val.courier_id
      let courierName = val.type_name ? val.type_name : val.courier_name
      this.formShipping.typeId = courierId
      this.formShipping.typeName = courierName
      // this.formShipping.price = 
    },
    saveShipping(block) {
      if (block === 'automate') {
        // console.log(this.formShipping)
        // order_id: 122089551
        // shipping_courier_id: JNE
        // shipping_service_type: YES
        // shipping_tariff: JNE-YES
        // shipping_cost: 380000
        // console.log(this.formShipping)
        let data = {
          order_id: this.detailData.id,
          shipping_courier_id: this.formShipping.typeIdAutomate,
          // shipping_tariff: this.formShipping.typeNameAutomate,
          // shipping_service_type: this.formShipping.typeNameAutomate + ' (' + this.formShipping.typeAutomate + ')',
          shipping_tariff: this.formShipping.idAutomate,
          shipping_service_type: this.formShipping.typeAutomate,
          shipping_cost: this.formShipping.priceAutomate
        }
        // console.log(data)
        this.updateData(block, data)
      } else if (block === 'manual') {
        // console.log(this.formShipping)
        let data = {
          order_id: this.detailData.id,
          shipping_courier_id: this.formShipping.typeId,
          shipping_tariff: this.formShipping.typeName,
          shipping_service_type: this.formShipping.typeName,
          shipping_cost: this.formShipping.price
        }
        this.updateData(block, data)
      }
    },
    updateData(block, data) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'openorder/updateshippingcost'),
        headers: headers,
        data: data
      })
        .then(response => {
          this.detailData = response.data.data
          this.$message({
            message: 'Success',
            type: 'success'
          })
          this.loading = false
          this.dialogShipping = false
          this.refreshTable()
          this.$emit('refresh', this.detailData)
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.message,
            message: error.string
          })
          this.loading = false
        })
    },
    handlePaymentMethod(val) {
      if (val.payment_type_id === 'BT') {
        this.formPayment.paymentMethodLabel = val.payment_type + ' (' + val.bt_bank_name + '-' + val.bt_account_no + ')'
        this.formPayment.paymentUniq = this.detailData.unique_payment_code ? this.detailData.unique_payment_code : this.randomString(3)
        this.formPayment.unique_code = val.activate_unique_code
      } else {
        this.formPayment.paymentMethodLabel = val.payment_type
      }
      this.formPayment.paymentMethodId = val.id
      this.formPayment.paymentMethodType = val.payment_type_id
    },
    parsePaymentTotal() {
      this.formPayment.paymentTotal = parseInt(this.formPayment.paymentTotal)
    },
    savePayment() {
      this.loading = true
      this.loadingPayment = true
      if(this.dataTable.jurnal_posted_transaction === 1){
        this.waitingPayment = true
      }
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      // var sequence = '0'
      // if (this.outstanding) {
      //   sequence = '2'
      // } else {
      //   sequence = '0'
      // }
      let data = {
        order_id: this.detailData.id,
        payment_seq: this.outstanding ? '2' : '0',
        payment_date: this.formPayment.paymentDate,
        payment_mode_id: this.formPayment.paymentMethodId,
        payment_from_bank: this.formPayment.paymentVia,
        payment_payee: this.formPayment.paymentName,
        payment_ref: this.formPayment.paymentReference,
        unique_payment_code: this.formPayment.paymentUniq,
        payment_currency_id: this.formPayment.paymentCurrency,
        payment_amount: this.formPayment.paymentTotal
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'openorder/updatepayment'),
        headers: headers,
        data: data
      })
        .then(response => {
          this.detailData = response.data.data
          this.$message({
            message: 'Success',
            type: 'success'
          })
          this.$emit('save-payment', this.detailData)
          this.loading = false
          if(this.dataTable.jurnal_posted_transaction = 1){
            this.waitingPayment = false
          }
          this.loadingPayment = false
          this.dialogPayment = false
          this.outstanding = false
          this.refreshTable()
        })
        .catch(error => {
          if (typeof error.response.data.error.error === 'string') {
            this.$notify({
              type: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error
            })
          } else if (typeof error.response.data.error.error === 'object') {
            var er = Object.getOwnPropertyNames(error.response.data.error.error)
            if (er.length >= 2) {
              var msg = []
              er.map((i,idx) => {
                msg.push(error.response.data.error.error[i][0])
              })
              var message = msg.join(', ')
              this.$notify({
                type: 'warning',
                title: error.response.data.error.message,
                message: message
              })
            } else {
              this.$notify({
                type: 'warning',
                title: error.response.data.error.message,
                message: error.response.data.error.error[er[0]][0]
              })
            }
          }
          if(this.dataTable.jurnal_posted_transaction = 1){
            this.waitingPayment = false
          }
          this.outstanding = false
          this.loading = false
          this.loadingPayment = false
        })
    },

    randomString(len, charSet) {
      charSet = charSet || '0123456789';
      var randomString = '';
      for (var i = 0; i < len; i++) {
          var randomPoz = Math.floor(Math.random() * charSet.length);
          randomString += charSet.substring(randomPoz,randomPoz+1);
      }
      return randomString;
    },

    handlePercent (data) {
      if (this.discountForm.percent > 100) {
        this.discountForm.percent = 100
      }
    },

    handlePrice (data) {
      if (this.discountForm.price > this.detailData.total_amount) {
        this.discountForm.price = this.detailData.total_amount
      }
    },

    downloadTemplate () {
      window.open( baseURL + 'olsera_order_item_import_template.csv')
    },

    handleSuccessImport(response) {
      this.loadingImport = false
      // console.log(response.data)
      this.detailData = response.data
      this.refreshTable()
      this.importDialog = false
      this.$refs.importProduct.clearFiles()
    },

    handlerErrorImport(error, file) {
      const errorJson = JSON.parse(error.message)
      this.loadingImport = false
      this.$message({
        type: 'error',
        message: errorJson.error.error
      })
    },

    handleOnProgressImport () {
      this.loadingImport = true
    },

    handleMatchDiscount () {
      let disc = 0
      let price = this.editTable.price * this.editTable.qty
      if (this.discType === 2) {
        disc = (this.editTable.discount/price) * 100
      }
      if (this.discType === 1) {
        disc = (this.editTable.discount/100) * price
      }
      this.editTable.discount = disc
      // console.log('disc', disc)
    },
  }
}
</script>
