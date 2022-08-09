<template>
  <div class="content-wrapper">
    <section class="content">
      <div v-loading="isLoading" class="sales-detail">
        <section class="order-detail">
          <el-card class="box-card with-back-button">
            <div class="card-body">
              <div class="inventory-status" :class="classBasedOnStatus">
                <template v-if="data.jurnal_posted_transaction === 1">
                  <span align="center"><i class="el-icon-document"></i><br> {{$lang[langId].posted}}</span>
                </template>
                <template v-if="data.jurnal_posted_transaction === 0">
                  <span align="center"><i class="el-icon-document-delete"></i><br>{{$lang[langId].unposted}}</span>
                </template>
              </div>
              <div class="row" style="padding-left: 40px !important">
                <div class="col-lg-10 col-md-9 col-sm-8">
                  <h4 style="color: #ccc;">{{data.purchase_no}}</h4>
                  <p>{{ lang.purchase_by }} {{ data.purchase_by_name }}</p>
                </div>
                <div class="col-lg-2 col-md-3 col-sm-4 text-right">
                  <el-button icon="el-icon-back" size="small" style="width: 100%" type="success" plain @click="backHandle">{{ lang.back }}</el-button><br/>
                  <el-button size="small" :disabled="loadingExport" type="primary" plain @click="handleExport" style="marginTop: 5px; width: 100%;">
                    <loading
                      v-if="loadingExport"
                      align="center"
                      :active="true"
                      color= '#1bb4e6'
                      loader="dots"
                      :width="80"
                      :height="10"
                      backgroundColor='#ffffff'>
                    </loading>
                    <span v-else>{{ lang.export_to_jurnal }}</span>
                  </el-button>
                </div>
              </div>
            </div>
          </el-card>

          <el-row :gutter="10" class="visible-sm visible-md visible-lg">
            <el-col :md="24">
              <el-card class="card-body">
                <div slot="header" class="flex-container flex-container--wrap">
                  <h3 class="box-title">{{ lang.purchase_details }}</h3>
                </div>
                <div class="card-body">
                  <el-row class="demo-avatar demo-basic">
                    <el-col :span="8" style="padding: 0px 20px 0px 0px; border-right: 1px solid #eff2f6">
                      <div class="sub-title mb-12">
                        <span class="font-16 color-primary font-bold">{{lang.supplier}}</span>
                        <el-dropdown class="visible-lg visible-md visible-sm" size="mini" split-button :type="classPostType" style="float: right;">
                          {{data.jurnal_posted_supplier ? $lang[langId].posted : $lang[langId].unposted}}
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item style="padding: 0px">
                              <el-button type="text" class="accounting-dropBtn" @click="postSupplier">
                                <svg-icon icon-class="right-arrow"></svg-icon>
                                Post Supplier
                              </el-button>
                            </el-dropdown-item>
                            <el-dropdown-item style="padding: 0px">
                              <el-button type="text" class="accounting-dropBtn" @click="modalMapSupplier">
                                <svg-icon icon-class="hierarchy"></svg-icon>
                                Map Supplier
                              </el-button>
                            </el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </div>
                      <div class="demo-basic--circle">
                        <ul class="list-unstyled">
                          <li>
                            <span style="font-weight: 700">{{ lang.supplier_name }}</span>
                            <p>{{ data.supplier_name ? data.supplier_name : '-' }}</p>
                          </li>
                          <li>
                            <span style="font-weight: 700">{{ lang.email }}</span>
                            <p>{{ data.supplier_email ? data.supplier_email : '-' }}</p>
                          </li>
                        </ul>
                      </div>
                    </el-col>
                    <el-col :span="8" style="padding: 0px 20px 0px 20px; border-right: 1px solid #eff2f6">
                      <div class="sub-title mb-12">
                        <span class="font-16 color-primary font-bold mb-12">{{$lang[langId].shippings}}</span>
                        <el-button class="visible-lg visible-md" type="primary" :disabled="isEditing.shipping || isEditing.other || isCollapse === false" @click="handleEdit('shipping')" style="float: right" icon="el-icon-edit" size="mini">
                          {{ lang.edit }}
                        </el-button>
                        <el-button class="visible-sm" type="text" :disabled="isEditing.shipping || isEditing.other || isCollapse === false" @click="handleEdit('shipping')" style="float: right; font-weight: 900" icon="el-icon-edit" size="mini"></el-button>
                      </div>
                      <div class="demo-basic--circle">
                        <ul class="list-unstyled">
                          <li>
                            <span style="font-weight: 700">{{ $lang[langId].ref_no }}</span>
                            <el-input v-if="isEditing.shipping" id="reference_no" v-model="formShipping.reference_no" type="text" size="mini" style="margin-bottom: 10px"></el-input>
                            <p v-else>{{ data.reference_no ? data.reference_no : '-' }}</p>
                          </li>
                          <li>
                            <span style="font-weight: 700">{{ lang.tracking_no }}</span>
                            <el-input v-if="isEditing.shipping" id="tracking_no" v-model="formShipping.tracking_no" type="text" size="mini"></el-input>
                            <p v-else>{{ data.tracking_no ? data.tracking_no : '-' }}</p>
                          </li>
                        </ul>
                      </div>
                    </el-col>
                    <el-col :span="8" style="padding: 0px 20px 0px 20px;">
                      <div class="sub-title mb-12">
                        <span class="font-16 color-primary font-bold mb-12">{{$lang[langId].another}}</span>
                        <el-button class="visible-lg visible-md" type="primary" :disabled="isEditing.shipping || isEditing.other || isCollapse === false" @click="handleEdit('other')" style="float: right" icon="el-icon-edit" size="mini">
                          {{ lang.edit }}
                        </el-button>
                        <el-button class="visible-sm" type="text" :disabled="isEditing.shipping || isEditing.other || isCollapse === false" @click="handleEdit('other')" style="float: right; font-weight: 900" icon="el-icon-edit" size="mini"></el-button>
                      </div>
                      <div class="demo-basic--circle">
                        <ul class="list-unstyled">
                          <li>
                            <span style="font-weight: 700">{{ $lang[langId].term_name }}</span>
                            <el-input v-if="isEditing.other" id="term_name" v-model="formOther.term_name" type="text" size="mini" style="margin-bottom: 10px;"></el-input>
                            <p v-else>{{data.term_name ? data.term_name: '-'}}</p>
                          </li>
                          <li>
                            <span style="font-weight: 700">{{ lang.due_date }}</span>
                            <el-date-picker 
                              v-if="isEditing.other"
                              v-model="formOther.due_date"
                              type="date" 
                              :placeholder="this.$lang[langId].pick_a_day" 
                              format="dd MMMM yyyy" 
                              value-format="yyyy-MM-dd"
                              style="width: 100%;"
                              size="mini">
                            </el-date-picker>
                            <p v-else>{{data.due_date ? dateFormat(data.due_date) : '-'}}</p>
                          </li>
                        </ul>
                      </div>
                    </el-col>
                  </el-row>
                </div>
                <div class="more-collapse">
                  <div class="panel panel-default">
                    <div v-if="isCollapse" id="collapse1" class="panel-collapse collapse">
                      <el-row class="demo-avatar demo-basic">
                        <el-col :span="8" style="padding: 0px 20px 0px 0px; border-right: 1px solid #eff2f6">
                          <div class="demo-basic--circle">
                            <ul class="list-unstyled">
                              <li>
                                <span style="font-weight: 700">{{ lang.phone }}</span>
                                <p>{{ data.supplier_phone ? data.supplier_phone : '-' }}</p>
                              </li>
                              <li>
                                <span style="font-weight: 700">{{ lang.address }}</span>
                                <p>{{data.supplier_address ? data.supplier_address : '-'}}</p>
                              </li>
                              <li>
                                <span style="font-weight: 700">{{ lang.city }}</span>
                                <h5>{{data.supplier_city_name ? data.supplier_city_name : '-'}}</h5>
                              </li>
                              <li>
                                <span style="font-weight: 700">{{ lang.district }}</span>
                                <h5>{{data.supplier_city_district ? data.supplier_city_district : '-'}}</h5>
                              </li>
                              <li>
                                <span style="font-weight: 700">{{ lang.province }}</span>
                                <p>{{data.supplier_state_name ? data.supplier_state_name : '-'}}</p>
                              </li>
                              <li>
                                <span style="font-weight: 700">{{ lang.country }}</span>
                                <p>{{data.supplier_country_name ? data.supplier_country_name : '-'}}</p>
                              </li>
                              <li>
                                <span style="font-weight: 700">{{ lang.contact_person }}</span>
                                <p>{{data.supplier_contact_person ? data.supplier_contact_person : '-'}}</p>
                              </li>
                              <li>
                                <span style="font-weight: 700">{{ lang.notes }}</span>
                                <p>{{data.supplier_note ? data.supplier_note : '-'}}</p>
                              </li>
                            </ul>
                          </div>
                        </el-col>
                        <el-col :span="8" style="padding: 0px 20px 0px 20px; border-right: 1px solid #eff2f6">
                          <div class="demo-basic--circle">
                            <ul class="list-unstyled">
                              <li>
                                <span style="font-weight: 700">{{ lang.shipping_date }}</span>
                                <el-date-picker 
                                  v-if="isEditing.shipping"
                                  v-model="formShipping.shipping_date"
                                  type="date" 
                                  :placeholder="this.$lang[langId].pick_a_day" 
                                  format="dd MMMM yyyy" 
                                  value-format="yyyy-MM-dd"
                                  style="width: 100%;"
                                  size="mini">
                                </el-date-picker>
                                <p v-else>{{ data.shipping_date ? dateFormat(data.shipping_date) : '-' }}</p>
                              </li>
                              <li>
                                <span style="font-weight: 700">{{ lang.shipping_address }}</span>
                                <el-input v-if="isEditing.shipping" v-model="formShipping.shipping_address" type="textarea" :rows="2" style="width: 100%; margin-bottom: 10px;"></el-input>
                                <p v-else>{{ data.shipping_address ? data.shipping_address : '-' }}</p>
                              </li>
                              <li>
                                <span style="font-weight: 700">{{ $lang[langId].has_been_sent }}</span>
                                <div v-if="isEditing.shipping" style="margin-bottom: 10px;">
                                  <el-switch
                                    :inactive-value="0"
                                    :active-value="1"
                                    v-model="formShipping.is_shipped"
                                    ></el-switch>
                                    <span v-if="formShipping.is_shipped === 0">{{ lang.no }}</span>
                                    <span v-else-if="formShipping.is_shipped === 1">{{ lang.yes }}</span>
                                    <span v-else>{{lang.no}}</span>
                                </div>
                                <p v-else>{{ data.is_shipped === 1 ? lang.yes : lang.no }}</p>
                              </li>
                              <li>
                                <span style="font-weight: 700">{{ $lang[langId].ship_via }}</span>
                                <el-input v-if="isEditing.shipping" id="tracking_no" v-model="formShipping.ship_via" type="text" size="mini" style="margin-bottom: 10px;"></el-input>
                                <p v-else>{{data.ship_via ? data.ship_via : '-'}}</p>
                              </li>
                              <li>
                                <span style="font-weight: 700">{{ lang.message }}</span>
                                <el-input v-if="isEditing.shipping" v-model="formShipping.message" type="textarea" :rows="2" style="width: 100%; margin-bottom: 10px;"></el-input>
                                <p v-else>{{data.message ? data.message : '-'}}</p>
                              </li>
                            </ul>
                            <div class="btn_save_dialog" v-if="isEditing.shipping">
                              <el-button type="info" size="small" @click="cancelShippingEdit">{{ lang.cancel }}</el-button>
                              <el-button type="success" size="small" @click="handleShippingEdit">{{ lang.save }}</el-button>
                            </div>
                          </div>
                        </el-col>
                        <el-col :span="8" style="padding: 0px 20px 0px 20px;">
                          <div class="demo-basic--circle">
                            <ul class="list-unstyled">
                              <li>
                                <span style="font-weight: 700">{{ $lang[langId].refund_account }}</span>
                                <el-select v-if="isEditing.other" filterable id="refunt_from_name" v-model="formOther.refund_from_name" :placeholder="$lang[langId].select" style="width: 100%">
                                  <el-option
                                    v-for="item in dataAccount"
                                    :key="item.name"
                                    :label="item.number + ' '+ item.name"
                                    :value="item.name">
                                  </el-option>
                                </el-select>
                                <!-- <el-input v-if="isEditing.other" id="refund_from_name" v-model="formOther.refund_from_name" type="text" size="mini" style="margin-bottom: 10px;"></el-input> -->
                                <p v-else>{{data.refund_from_name ? data.refund_from_name : '-'}}</p>
                              </li>
                              <li>
                                <span style="font-weight: 700">{{ $lang[langId].deposit }}</span>
                                <money v-if="isEditing.other" 
                                  v-model="formOther.deposit"
                                  v-bind="money"
                                  :prefix="selectedStore.currency_id + ' '"
                                  class="form-input input-sm"
                                  style="font-size: 14px; color: #606266; width: 100%; border: 1px solid #DCDFE6;">
                                </money>
                                <p v-else>{{data.deposit ? formatPrice(data.deposit) : '-'}}</p>
                              </li>
                              <li>
                                <span style="font-weight: 700">{{ $lang[langId].warehouse_name }}</span>
                                <el-input v-if="isEditing.other" id="warehouse_name" v-model="formOther.warehouse_name" type="text" size="mini" style="margin-bottom: 10px;"></el-input>
                                <p v-else>{{data.warehouse_name ? data.warehouse_name : '-'}}</p>
                              </li>
                              <li>
                                <span style="font-weight: 700">{{ $lang[langId].warehouse_code }}</span>
                                <el-input v-if="isEditing.other" id="warehouse_code" v-model="formOther.warehouse_code" type="text" size="mini" style="margin-bottom: 10px;"></el-input>
                                <p v-else>{{data.warehouse_code ? data.warehouse_code : '-'}}</p>
                              </li>
                            </ul>
                            <div class="btn_save_dialog" v-if="isEditing.other">
                              <el-button type="info" size="small" @click="cancelOtherEdit">{{ lang.cancel }}</el-button>
                              <el-button type="success" size="small" @click="handleOtherEdit">{{ lang.save }}</el-button>
                            </div>
                          </div>
                        </el-col>
                      </el-row>
                    </div>
                    <div class="panel-heading">
                      <h4 class="panel-title">
                        <a data-toggle="collapse" @click="handleCollapse" href="#collapse1" class="yt-toggle collapsed">
                          <!-- <el-button type="info" circle> -->
                            <el-button type="text" style="font-size: 24px;">
                            <i v-if="isCollapse" class="fa fa-chevron-up"></i>
                            <i v-else class="fa fa-chevron-down"></i>
                          </el-button>
                        </a>
                      </h4>
                    </div>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>

          <div class="visible-xs">
            <div class="panel tab-list-third mb-0">
              <ul class="nav nav-tabs nav-tabs-line nav-tabs-shop-devin nav-tabs-secondary pointer" role="tablist">
                <li :class="{ active : isSupplier }" data-wow-delay="0.14s">
                  <el-button @click="activateSupplier" :class="isSupplier ? 'active' : ''" type="text">
                    {{ $lang[langId].supplier_detail }}
                  </el-button>
                </li>
                <li :class="{'active in': active_el === 2}" data-wow-delay="0.12s">
                  <el-button @click="activateShipping" :class="isShipping ? 'active' : ''" type="text">
                    {{ $lang[langId].shippings }}
                  </el-button>
                </li>
                <li :class="{'active in': active_el === 3}" data-wow-delay="0.11">
                  <el-button @click="activateAnother" :class="isAnother ? 'active' : ''" type="text">
                    {{ $lang[langId].another }}
                  </el-button>
                </li>
              </ul>
            </div>
            <div class="tab-content" style="margin-top:0;">
              <el-card class="box-card">
                <div v-bind:class="{'active in': isSupplier}" v-if="isSupplier">
                  <div class="sub-title mb-12">
                    <span class="font-16 color-primary font-bold">{{lang.supplier}}</span>
                    <el-dropdown size="mini" split-button :type="classPostType" style="float: right;">
                      {{ data.jurnal_posted_supplier ? $lang[langId].posted : $lang[langId].unposted}}
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item style="padding: 0px">
                          <el-button type="text" class="accounting-dropBtn" @click="postSupplier">
                            <svg-icon icon-class="right-arrow"></svg-icon>
                            Post Supplier
                          </el-button>
                        </el-dropdown-item>
                        <el-dropdown-item style="padding: 0px">
                          <el-button type="text" class="accounting-dropBtn" @click="modalMapSupplier">
                            <svg-icon icon-class="hierarchy"></svg-icon>
                            Map Supplier
                          </el-button>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                  <hr/>
                  <div class="demo-basic--circle">
                    <ul class="list-unstyled">
                      <li>
                        <span style="font-weight: 700">{{ lang.supplier_name }}</span>
                        <p>{{ data.supplier_name ? data.supplier_name : '-' }}</p>
                      </li>
                      <li>
                        <span style="font-weight: 700">{{ lang.email }}</span>
                        <p>{{ data.supplier_email ? data.supplier_email : '-' }}</p>
                      </li>
                      <li>
                        <span style="font-weight: 700">{{ lang.phone }}</span>
                        <p>{{ data.supplier_phone ? data.supplier_phone : '-' }}</p>
                      </li>
                      <li>
                        <span style="font-weight: 700">{{ lang.address }}</span>
                        <p>{{data.supplier_address ? data.supplier_address : '-'}}</p>
                      </li>
                      <li>
                        <span style="font-weight: 700">{{ lang.city }}</span>
                        <h5>{{data.supplier_city_name ? data.supplier_city_name : '-'}}</h5>
                      </li>
                      <li>
                        <span style="font-weight: 700">{{ lang.district }}</span>
                        <h5>{{data.supplier_city_district ? data.supplier_city_district : '-'}}</h5>
                      </li>
                      <li>
                        <span style="font-weight: 700">{{ lang.province }}</span>
                        <p>{{data.supplier_state_name ? data.supplier_state_name : '-'}}</p>
                      </li>
                      <li>
                        <span style="font-weight: 700">{{ lang.country }}</span>
                        <p>{{data.supplier_country_name ? data.supplier_country_name : '-'}}</p>
                      </li>
                      <li>
                        <span style="font-weight: 700">{{ lang.contact_person }}</span>
                        <p>{{data.supplier_contact_person ? data.supplier_contact_person : '-'}}</p>
                      </li>
                      <li>
                        <span style="font-weight: 700">{{ lang.notes }}</span>
                        <p>{{data.supplier_note ? data.supplier_note : '-'}}</p>
                      </li>
                    </ul>
                  </div>
                </div>
                <div v-bind:class="{'active in': isShipping}" v-if="isShipping">
                  <div class="sub-title mb-12">
                    <span class="font-16 color-primary font-bold mb-12">{{$lang[langId].shippings}}</span>
                    <el-button type="primary" :disabled="isEditing.shipping || isEditing.other" @click="handleEdit('shipping')" style="float: right" icon="el-icon-edit" size="mini">
                      {{ lang.edit }}
                    </el-button>
                  </div>
                  <hr/>
                  <div class="demo-basic--circle">
                    <ul class="list-unstyled">
                      <li>
                        <span style="font-weight: 700">{{ $lang[langId].ref_no }}</span>
                        <el-input v-if="isEditing.shipping" id="reference_no" v-model="formShipping.reference_no" type="text" size="mini" style="margin-bottom: 10px"></el-input>
                        <p v-else>{{ data.reference_no ? data.reference_no : '-' }}</p>
                      </li>
                      <li>
                        <span style="font-weight: 700">{{ lang.tracking_no }}</span>
                        <el-input v-if="isEditing.shipping" id="tracking_no" v-model="formShipping.tracking_no" type="text" size="mini"></el-input>
                        <p v-else>{{ data.tracking_no ? data.tracking_no : '-' }}</p>
                      </li>
                      <li>
                        <span style="font-weight: 700">{{ lang.shipping_date }}</span>
                        <el-date-picker 
                          v-if="isEditing.shipping"
                          v-model="formShipping.shipping_date"
                          type="date" 
                          :placeholder="this.$lang[langId].pick_a_day" 
                          format="dd MMMM yyyy" 
                          value-format="yyyy-MM-dd"
                          style="width: 100%;"
                          size="mini">
                        </el-date-picker>
                        <p v-else>{{ data.shipping_date ? dateFormat(data.shipping_date) : '-' }}</p>
                      </li>
                      <li>
                        <span style="font-weight: 700">{{ lang.shipping_address }}</span>
                        <el-input v-if="isEditing.shipping" v-model="formShipping.shipping_address" type="textarea" :rows="2" style="width: 100%; margin-bottom: 10px;"></el-input>
                        <p v-else>{{ data.shipping_address ? data.shipping_address : '-' }}</p>
                      </li>
                      <li>
                        <span style="font-weight: 700">{{ $lang[langId].has_been_sent }}</span>
                        <div v-if="isEditing.shipping" style="margin-bottom: 10px;">
                          <el-switch
                            :inactive-value="0"
                            :active-value="1"
                            v-model="formShipping.is_shipped"
                            ></el-switch>
                            <span v-if="formShipping.is_shipped === 0">{{ lang.no }}</span>
                            <span v-else-if="formShipping.is_shipped === 1">{{ lang.yes }}</span>
                            <span v-else>{{lang.no}}</span>
                        </div>
                        <p v-else>{{ data.is_shipped === 1 ? lang.yes : lang.no }}</p>
                      </li>
                      <li>
                        <span style="font-weight: 700">{{ $lang[langId].ship_via }}</span>
                        <el-input v-if="isEditing.shipping" id="tracking_no" v-model="formShipping.ship_via" type="text" size="mini" style="margin-bottom: 10px;"></el-input>
                        <p v-else>{{data.ship_via ? data.ship_via : '-'}}</p>
                      </li>
                      <li>
                        <span style="font-weight: 700">{{ lang.message }}</span>
                        <el-input v-if="isEditing.shipping" v-model="formShipping.message" type="textarea" :rows="2" style="width: 100%; margin-bottom: 10px;"></el-input>
                        <p v-else>{{data.message ? data.message : '-'}}</p>
                      </li>
                    </ul>
                    <div class="btn_save_dialog" v-if="isEditing.shipping">
                      <el-button type="info" size="small" @click="cancelShippingEdit">{{ lang.cancel }}</el-button>
                      <el-button type="success" size="small" @click="handleShippingEdit">{{ lang.save }}</el-button>
                    </div>
                  </div>
                </div>
                <div v-bind:class="{'active in': isAnother}" v-if="isAnother">
                  <div class="sub-title mb-12">
                    <span class="font-16 color-primary font-bold mb-12">{{$lang[langId].another}}</span>
                    <el-button type="primary" :disabled="isEditing.shipping || isEditing.other" @click="handleEdit('other')" style="float: right" icon="el-icon-edit" size="mini">
                      {{ lang.edit }}
                    </el-button>
                  </div>
                  <hr/>
                  <div class="demo-basic--circle">
                    <ul class="list-unstyled">
                      <li>
                        <span style="font-weight: 700">{{ $lang[langId].term_name }}</span>
                        <el-input v-if="isEditing.other" id="term_name" v-model="formOther.term_name" type="text" size="mini" style="margin-bottom: 10px;"></el-input>
                        <p v-else>{{data.term_name ? data.term_name: '-'}}</p>
                      </li>
                      <li>
                        <span style="font-weight: 700">{{ lang.due_date }}</span>
                        <el-date-picker 
                          v-if="isEditing.other"
                          v-model="formOther.due_date"
                          type="date" 
                          :placeholder="this.$lang[langId].pick_a_day" 
                          format="dd MMMM yyyy" 
                          value-format="yyyy-MM-dd"
                          style="width: 100%;"
                          size="mini">
                        </el-date-picker>
                        <p v-else>{{data.due_date ? dateFormat(data.due_date) : '-'}}</p>
                      </li>
                      <li>
                        <span style="font-weight: 700">{{ $lang[langId].refund_account }}</span>
                        <el-select v-if="isEditing.other" filterable id="refunt_from_name" v-model="formOther.refund_from_name" :placeholder="$lang[langId].select" style="width: 100%">
                          <el-option
                            v-for="item in dataAccount"
                            :key="item.name"
                            :label="item.number + ' '+ item.name"
                            :value="item.name">
                          </el-option>
                        </el-select>
                        <!-- <el-input v-if="isEditing.other" id="refund_from_name" v-model="formOther.refund_from_name" type="text" size="mini" style="margin-bottom: 10px;"></el-input> -->
                        <p v-else>{{data.refund_from_name ? data.refund_from_name : '-'}}</p>
                      </li>
                      <li>
                        <span style="font-weight: 700">{{ $lang[langId].deposit }}</span>
                        <money v-if="isEditing.other" 
                          v-model="formOther.deposit"
                          v-bind="money"
                          :prefix="selectedStore.currency_id + ' '"
                          class="form-input input-sm"
                          style="font-size: 14px; color: #606266; width: 100%; border: 1px solid #DCDFE6;">
                        </money>
                        <p v-else>{{data.deposit ? formatPrice(data.deposit) : '-'}}</p>
                      </li>
                      <li>
                        <span style="font-weight: 700">{{ $lang[langId].warehouse_name }}</span>
                        <el-input v-if="isEditing.other" id="warehouse_name" v-model="formOther.warehouse_name" type="text" size="mini" style="margin-bottom: 10px;"></el-input>
                        <p v-else>{{data.warehouse_name ? data.warehouse_name : '-'}}</p>
                      </li>
                      <li>
                        <span style="font-weight: 700">{{ $lang[langId].warehouse_code }}</span>
                        <el-input v-if="isEditing.other" id="warehouse_code" v-model="formOther.warehouse_code" type="text" size="mini" style="margin-bottom: 10px;"></el-input>
                        <p v-else>{{data.warehouse_code ? data.warehouse_code : '-'}}</p>
                      </li>
                    </ul>
                    <div class="btn_save_dialog" v-if="isEditing.other">
                      <el-button type="info" size="small" @click="cancelOtherEdit">{{ lang.cancel }}</el-button>
                      <el-button type="success" size="small" @click="handleOtherEdit">{{ lang.save }}</el-button>
                    </div>
                  </div>
                </div>
              </el-card>
            </div>
          </div>  

          <purchase-table
            :data-table="data"
            :statusFetch="isFecth"
            :edit-show="false"
          />

        </section>

        <el-dialog
          title="Map Supplier"
          :visible.sync="modalSupplier"
          width="30%" center
          :close-on-click-modal="false"
          :show-close="false">
          <div>
            <el-form @submit.native.prevent>
              <div>
                <label style="font-size: 12px">{{ lang.supplier_name }}</label>
              </div>
              <el-form-item>
                <el-input id="supplier_name" v-model="data.supplier_name" disabled type="text"></el-input>
              </el-form-item>
              <div>
                <label style="font-size: 12px">{{ $lang[langId].jurnal_supplier }}</label>
              </div>
              <el-form-item>
                <el-select 
                  v-if="isFecthSupplier === 0" 
                  v-model="supplier.jurnal_supplier_id" 
                  filterable style="width: 100%" 
                  :placeholder="$lang[langId].select + ' ' + lang.category">
                  <el-option
                    v-for="item in jurnalSupplier"
                    :key="item.jurnal_contact_id"
                    :label="item.display_name"
                    :value="item.jurnal_contact_id"
                    >
                    <el-button type="text" style="width: 100%; text-align: left; color: black; font-weight: normal" @click="selectSupplier(item)">{{capitalize(item.display_name)}}</el-button>
                  </el-option>
                </el-select>
                <el-select 
                  v-if="isFecthSupplier === 1" 
                  :placeholder="$lang[langId].type_keyword" 
                  filterable
                  remote
                  reserve-keyword
                  v-model="supplier.jurnal_contact_id"
                  @change="(value) => selectSupplierFecth(value)"
                  :remote-method="searchFecthSupplier"
                  style="width: 100%">
                  <el-option
                    v-for="(item, keyFetch) in dataSupplierFetched"
                    :key="keyFetch"
                    :label="item.display_name"
                    :value="item.jurnal_contact_id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="modalMapSupplier">{{ lang.cancel }}</el-button>
            <el-button :disabled="loadingMap" type="success" @click="mapSupplier">{{ lang.save }}</el-button>
          </span>
        </el-dialog>
      </div>
    </section>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common';
import axios from 'axios';
import PurchaseTable from './DetailTablePurchase';
import Loading from 'vue-loading-overlay';
import moment from 'moment';
import { listFecthSupplier } from '@/api/accounting-3rd/jurnalid';
export default {
  name: 'DetailPurchase',

  components: {
    PurchaseTable,
    Loading
  },

  data() {
    return {
      active_el: 1,
      isSupplier: false,
      isShipping: true,
      isAnother: false,
      isLoading: false,
      isCollapse: false,
      loadingMap: false,
      loadingExport: false,
      data: [],
      jurnalSupplier: [],
      dataSupplierFetched: [],
      dataAccount: [],
      isMap: false,
      modalSupplier: false,
      id: '',
      isFecth: 0,
      isFecthSupplier: 0,
      isEditing: {
        shipping: false,
        other: false
      },
      supplier: {
        jurnal_contact_id: '',
        jurnal_display_name: ''
      },

      formShipping: {
        reference_no: '',
        tracking_no: '',
        shipping_date: '',
        shipping_address: '',
        is_shipped: '',
        ship_via: '',
        message: ''
      },
      formOther: {
        term_name: '',
        due_date: '',
        refund_from_name: '',
        deposit: '',
        warehouse_name: '',
        warehouse_code: ''
      },
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

    classBasedOnStatus() {
      let className = ''
      if (this.data.jurnal_posted_transaction === 0) {
        className = 'canceled'
      } else {
        className = 'posted'
      }

      return className
    },

    classPostType() {
      let type = ''
      // let stat = 
      if (this.data.jurnal_posted_supplier) {
        type = 'success'
      } else {
        type = 'primary'
      }

      return type
    },
  },
  methods: {
    initTabsState() {
      this.isSupplier = false
      this.isShipping = false
      this.isAnother = false
    },

    activateShipping() {
      this.initTabsState()
      this.active_el = 2
      this.isShipping = true
    },

    activateSupplier() {
      this.initTabsState()
      this.active_el = 1
      this.isSupplier = true
    },
    
    activateAnother(){
      this.initTabsState()
      this.active_el = 3
      this.isAnother = true
    },

    loadData(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      this.id = this.id !== '' ? this.id : this.$route.query.id
      this.isFecth = this.$route.query.fecthStatus
      this.isFecthSupplier = this.$route.query.fecthSupplier

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/purchase/documentready/' + this.id),
        headers: headers,
      }).then(response => {
        this.data = response.data.data

        this.formShipping = {
          reference_no: this.data.reference_no,
          tracking_no: this.data.tracking_no,
          shipping_date: this.data.shipping_date,
          shipping_address: this.data.shipping_address,
          is_shipped: this.data.is_shipped,
          ship_via: this.data.ship_via,
          message: this.data.message
        }
        
        this.formOther = {
          term_name: this.data.term_name,
          due_date: this.data.due_date,
          refund_from_name: this.data.refund_from_name,
          deposit: this.data.deposit,
          warehouse_name: this.data.warehouse_name,
          warehouse_code: this.data.warehouse_code
        }
      }).catch(error => {
        if(typeof error.response.data.error.error === 'object'){
          let errorKey = Object.keys(error.response.data.error.error)[0];
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error[errorKey][0]
          })
        } else {
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
      })
    },

    getAccount(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/account'),
        headers: headers
      }).then(response => {
        this.dataAccount = response.data.data
      }).catch(error => {
        if(typeof error.response.data.error.error === 'object'){
          let errorKey = Object.keys(error.response.data.error.error)[0];
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error[errorKey][0]
          })
        } else {
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
      })
    },

    handleCollapse(){
      let collapse = this.isCollapse
      this.isCollapse = collapse ? false : true
    },

    getSupplierJurnal(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/vendor'),
        headers: headers,
      }).then(response => {
        this.jurnalSupplier = response.data.data

      }).catch(error => {
        if(typeof error.response.data.error.error === 'object'){
          let errorKey = Object.keys(error.response.data.error.error)[0];
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error[errorKey][0]
          })
        } else {
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
      })
    },

    postSupplier(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let data = {
        supplier_id : this.data.supplier_id
      }

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/vendor'),
        headers: headers,
        params: data
      }).then(response => {
        this.$message({
          type: 'success',
          message: this.$lang[this.langId].success_posting
        })
        this.jurnalSupplier= []
        this.loadData()
        this.getSupplierJurnal()
      }).catch(error => {
        if(typeof error.response.data.error.error === 'object'){
          let errorKey = Object.keys(error.response.data.error.error)[0];
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error[errorKey][0]
          })
        } else {
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
      })
    },

    modalMapSupplier(){
      let show = this.modalSupplier
      this.modalSupplier = show ? false : true
    },

    mapSupplier(item){
      this.loadingMap = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let data = {
        supplier_id : this.data.supplier_id,
        jurnal_contact_id : this.supplier.jurnal_contact_id,
        jurnal_display_name : this.supplier.jurnal_display_name
      }

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/vendormap'),
        headers: headers,
        params: data
      }).then(response => {
        this.loadingMap = false
        this.$message({
          type: 'success',
          message: this.lang.successfully_confirmed
        })
        this.loadData()
        this.modalMapSupplier()
      }).catch(error => {
        if(typeof error.response.data.error.error === 'object'){
          let errorKey = Object.keys(error.response.data.error.error)[0];
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error[errorKey][0]
          })
        } else {
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
        this.loadingMap = false
      })
    },

    selectSupplier(item){
      this.supplier = {
        jurnal_contact_id: item.jurnal_contact_id,
        jurnal_display_name: item.display_name
      }
    },

    selectSupplierFecth(value){
      this.dataSupplierFetched.map((item, idx) => {
        if(item.jurnal_contact_id === value){
          this.supplier.jurnal_contact_id = value
          this.supplier.jurnal_display_name = item.display_name
        }
      });
    },

    searchFecthSupplier(value){
      if(value){
        let params = {
          search_column: 'display_name',
          search_text: value
        }

        listFecthSupplier(params).then(response => {
          this.supplier.jurnal_product_id = ''
          this.supplier.jurnal_product_name = ''
          let resp = response.data.data
          this.dataSupplierFetched = resp ? resp : [] 
        })
      }else{
        this.supplier.jurnal_product_id = ''
        this.supplier.jurnal_product_name = ''
        this.dataSupplierFetched = []
      }
    },

    handleExport(){
      this.loadingExport = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let data = {
        id: this.data.id,
        reference_no: this.formShipping.reference_no,
        tracking_no: this.formShipping.tracking_no,
        shipping_date: this.formShipping.shipping_date,
        shipping_address: this.formShipping.shipping_address,
        is_shipped: this.formShipping.is_shipped,
        ship_via: this.formShipping.ship_via,
        message: this.formShipping.message,
        term_name: this.formOther.term_name,
        due_date: this.formOther.due_date,
        refund_from_name: this.data.refund_from_name,
        deposit: this.formOther.deposit,
        warehouse_name: this.formOther.warehouse_name,
        warehouse_code: this.formOther.warehouse_code
      }

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/purchase'),
        headers: headers,
        params: data
      }).then(response => {
        this.loadingMap = false
        this.loadingExport = false
        this.$message({
          type: 'success',
          message: this.lang.successfully_confirmed
        })
        this.loadData()
      }).catch(error => {
        this.loadingExport = false
        if(typeof error.response.data.error.error === 'object'){
          let errorKey = Object.keys(error.response.data.error.error)[0];
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error[errorKey][0]
          })
        } else {
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
      })
    },

    handleEdit(type){
      this.isCollapse = true
      let shipping = this.isEditing.shipping
      let other    = this.isEditing.other
      if(type === 'shipping'){
        this.isEditing.shipping = shipping ? false : true
      }

      if(type === 'other'){
        this.isEditing.other = other ? false : true
      }
    },

    cancelShippingEdit(){
      this.isEditing.shipping = false

      this.formShipping = {
        reference_no: this.data.reference_no,
        tracking_no: this.data.tracking_no,
        shipping_date: this.data.shipping_date,
        shipping_address: this.data.shipping_address,
        is_shipped: this.data.is_shipped,
        ship_via: this.data.ship_via,
        message: this.data.message
      }
    },

    handleShippingEdit(){
      this.isEditing.shipping = false
      this.data.reference_no = this.formShipping.reference_no
      this.data.tracking_no = this.formShipping.tracking_no
      this.data.shipping_date = this.formShipping.shipping_date
      this.data.shipping_address = this.formShipping.shipping_address
      this.data.is_shipped = this.formShipping.is_shipped
      this.data.ship_via = this.formShipping.ship_via
      this.data.message = this.formShipping.message
    },
    
    cancelOtherEdit(){
      this.isEditing.other = false

      this.formOther = {
          term_name: this.data.term_name,
          due_date: this.data.due_date,
          refund_from_name: this.data.refund_from_name,
          deposit: this.data.deposit,
          warehouse_name: this.data.warehouse_name,
          warehouse_code: this.data.warehouse_code
      }
    },

    handleOtherEdit(){
      this.isEditing.other = false
      this.data.term_name = this.formOther.term_name
      this.data.due_date = this.formOther.due_date
      this.data.refund_from_name = this.formOther.refund_from_name
      this.data.deposit = this.formOther.deposit
      this.data.warehouse_name = this.formOther.warehouse_name
      this.data.warehouse_code = this.formOther.warehouse_code
    },

    backHandle(){
      let lastParams = this.$route.query.lastParams
      let labelDate  = this.$route.query.labelDate
      this.$router.push({path: '/accounting-third/jurnalNew/purchase', 
        params: {lastParams: lastParams, labelDate: labelDate},
        query: {typeJurnal: '1', lastParams: lastParams, labelDate: labelDate}
      })
    },
    
    capitalize(value){
      let capitalize= '';
      if(value){
        capitalize = value[0].toUpperCase() + value.slice(1);
      }
      return capitalize;
    },

    formatPrice(value) {
      let val = (value/1).toFixed(0).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },

    dateFormat(val){
      return moment(val).format('DD MMM YYYY');
    }
  },

  mounted() {
    this.loadData()
    if(this.$route.query.fecthSupplier === 0){
      this.getSupplierJurnal()
    }
    this.getAccount()
  }
}
</script>

<style lang="scss" scoped>
  .el-dropdown-link {
    cursor: pointer;
    color: #0085cd;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .demonstration {
    display: block;
    color: #8492a6;
    font-size: 14px;
    margin-bottom: 20px;
  }

  .more-collapse {
    .panel-default {
      margin-bottom: 0;
      .panel-heading {
        background-color: #ffffff;
        .panel-title {
          text-align: center;
          // a.yt-toggle.collapsed > .el-button {
          //   i.fa.fa-chevron-down {
          //     display: inline-block;
          //   }
          //   i.fa.fa-chevron-up {
          //     display: none;
          //   }
          // }
          // a.yt-toggle > .el-button {
          //   i.fa.fa-chevron-down {
          //     display: none;
          //   }
          //   i.fa.fa-chevron-up {
          //     display: inline-block;
          //   }
          // }
        }
      }
    }
  }
</style>
