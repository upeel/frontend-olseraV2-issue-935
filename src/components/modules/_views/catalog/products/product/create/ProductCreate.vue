<template>
  <div>
    <div class="box" v-loading="loading">
      <div class="box-header with-border create-product-header">
        <h3 class="box-title">{{lang.add_product}}</h3>
        <div class="pull-right">
          <router-link to="/catalog/product">
            <el-button style="box-shadow: none;">{{lang.cancel}}</el-button>
          </router-link>
          <div v-if="!$route.params.copy" >
            <p>{{ $lang[langId].save_at }}:</p>
            <el-select v-model="storeToBeSaved" multiple collapse-tags @change="handleSelectAll">
              <el-option
                v-for="item in outlets"
                :key="item.store_id"
                :label="item.name"
                :value="item.store_id">
              </el-option>
          </el-select>
          </div>
          <el-button v-if="!$route.params.copy" type="primary" @click="handleSave" :disabled="disableSave" :loading="loading">{{lang.save}}</el-button>
          <el-button v-else type="primary" @click="handleSave" :loading="loading">{{lang.save}}</el-button>
        </div>
      </div>

      <div class="box-body create-product">
        <el-form
          :model="data"
          :rules="rules"
          label-position="top"
          ref="data"
          class="form-sidebyside p-24"
          @submit.native.prevent="handleSave">

          <div class="row">
            <el-col :span="9">
              <el-form-item v-if="!$route.params.copy" :label="$lang[langId].product_image">
                <p>{{ $lang[langId].recommendations_image }}</p>
              </el-form-item>
              <el-form-item v-else :label="$lang[langId].copy + ' ' + lang.photo">
                <p>{{ $lang[langId].copy_photos_note }}</p>
              </el-form-item>
            </el-col>

            <el-col :span="15">
              <el-form-item v-if="!$route.params.copy">
                <el-upload
                  list-type="picture-card"
                  :action="uploadPhotoUrl"
                  :headers="headers"
                  :before-upload="beforeUpload"
                  :on-success="handleUploadSuccess"
                  :on-error="handleUploadError"
                  multiple>
                  <i class="el-icon-plus"></i>
                </el-upload>
              </el-form-item>

              <el-switch v-else v-model="photosSwitch" inactive-color="#ff4949"></el-switch>

              <div v-if="$route.params.copy">
                <div v-if="photosSwitch">
                  <p class="desc-switch">
                    <strong>{{ lang.yes }}</strong>
                  </p>
                </div>
                <div v-else>
                  <p class="desc-switch">
                    <strong>{{ lang.no }}</strong>
                  </p>
                </div>
              </div>
            </el-col>
          </div>

          <div class="row">
            <el-col :span="9">
              <el-form-item :label="lang.product_name">
                <p>{{ $lang[langId].fill_input_product }} <span style="color: red;">*</span></p>
              </el-form-item>
            </el-col>
            <el-col :span="15">
              <el-form-item prop="product.name">
                <el-input v-model="data.product.name" type="text" :placeholder="$lang[langId].please_input+lang.product_name"></el-input>
              </el-form-item>
            </el-col>
          </div>

          <div class="row">
            <el-col :span="9">
              <el-form-item :label="lang.product_category">
                <p>{{ lang.info_choose_existing_or_add_new }} <span style="color: red;">*</span></p>
              </el-form-item>
            </el-col>
            <el-col :span="15">
              <el-form-item prop="product.product_group_name">
                <select-grouped-product-category
                  :allow-create="true"
                  :selected-id="data.product.product_group_name"
                  @change="handleChangeSelectCategory"
                  @create="handleCreateCategory"
                />
              </el-form-item>
            </el-col>
          </div>

          <div>
            <div v-if="!data.product.has_variant" class="row">
              <el-col :span="9">
                <el-form-item :label="lang.selling_price_in_store">
                  <p><span style="color: red;">*</span></p>
                </el-form-item>
              </el-col>
              <el-col :span="15">
                <el-form-item prop="sell_price_pos">
                  <div class="el-input">
                    <input-money
                      v-model="data.product.sell_price_pos"
                      @keyup.native.enter="handleSave"
                    />
                  </div>
                </el-form-item>
              </el-col>
            </div>

            <div class="row">
              <el-col :span="9">
                <el-form-item>
                  {{ $lang[langId].price_online_same_with_store }}
                </el-form-item>
              </el-col>
              <el-col :span="15" class="switch-varian flex-container">
                <div class="mr-8">
                  <el-switch v-model="hargaJualSwitch" inactive-color="#ff4949"></el-switch>
                </div>
                <div v-if="hargaJualSwitch == true"><strong>{{ lang.yes }}</strong></div>
                <div v-else><strong>{{ lang.no }}</strong></div>
              </el-col>
            </div>

            <div
              v-if="!hargaJualSwitch"
              class="row">
              <el-col :span="9">
                <el-form-item :label="lang.selling_price_online" />
              </el-col>
              <el-col :span="15">
                <el-form-item prop="sell_price">
                  <div class="el-input">
                    <input-money
                      v-model="data.product.sell_price"
                    />
                  </div>
                </el-form-item>
              </el-col>
            </div>
          </div>

          <div class="row">
            <el-col :span="9">
              <el-form-item :label="lang.track_inventory">
                <p>{{ lang.info_track_inventory }}</p>
              </el-form-item>
            </el-col>
            <el-col :span="15" class="switch-varian">
              <el-form-item>
                <div class="flex-container">
                  <div class="mr-8">
                    <el-switch v-model="data.product.track_inventory" inactive-color="#ff4949" :disabled="disableTrackInventory"></el-switch>
                  </div>
                  <div v-if="data.product.track_inventory">
                    <strong>{{ lang.yes }}</strong>
                  </div>
                  <div v-else>
                    <strong>{{ lang.no }}</strong>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </div>

          <div class="row" v-if="data.product.track_inventory">
            <el-col :span="9">
              <el-form-item :label="lang.info_stock_qty">
                <p>{{ lang.info_track_inventory_with_variant }}</p>
              </el-form-item>
            </el-col>
            <el-col :span="15">
              <el-form-item>
                <el-input v-model="data.product.stock_qty" :placeholder="$lang[langId].input_number" type="number" min="1"></el-input>
              </el-form-item>
            </el-col>
          </div>

          <div class="row" v-if="data.product.track_inventory">
            <el-col :span="9">
              <el-form-item :label="lang.product_stock_warning">
                <p>{{ $lang[langId].info_stock_limit }}.</p>
              </el-form-item>
            </el-col>
            <el-col :span="15">
              <el-form-item>
                <el-input v-model="data.product.low_stock_alert" :placeholder="$lang[langId].input_number" type="number" min="1"></el-input>
              </el-form-item>
            </el-col>
          </div>
          
          <div v-if="!$route.params.copy" class="row">
            <el-col :span="9">
              <el-form-item :label="lang.variant">
                {{ $lang[langId].active_product_if_varian }}
              </el-form-item>
            </el-col>
            <el-col :span="15" class="switch-varian">
              <div class="flex-container">
                <div class="mr-8">
                  <el-switch
                    v-model="data.product.has_variant"
                    inactive-color="#ff4949"
                  />
                </div>
                <div v-if="data.product.has_variant">
                  <strong>{{ lang.yes }}</strong>
                  <span> - ({{ $lang[langId].variant_required }}) </span>
                </div>
                <div v-else>
                  <strong>{{ lang.no }}</strong>
                </div>
              </div>
              <div v-if="data.product.has_variant" style="margin-top: 20px;">
                <variant-create
                  :product-sku="data.product.sku"
                  :product-data="data.product"
                  :product-new="true"
                  @saved="commitVariants">
                </variant-create>
              </div>
            </el-col>
          </div>
          <div v-else-if="$route.params.copy && data.product.has_variant" class="row">
            <el-col :span="9">
              <el-form-item :label="$lang[langId].copy + ' ' + lang.variant">
                <p>{{ $lang[langId].copy_variant_note }}</p>
              </el-form-item>
            </el-col>

            <el-col :span="15">
              <div class="container-flex">
                <div class="mr-8">
                  <el-switch v-model="variantSwitch" inactive-color="#ff4949"></el-switch>
                </div>
                <div v-if="variantSwitch">
                  <strong>{{ lang.yes }}</strong>
                </div>
                <div v-else>
                  <strong>{{ lang.no }}</strong>
                </div>
              </div>
            </el-col>
          </div>

          <div v-if="$route.params.copy" class="row">
            <el-col :span="9">
              <el-form-item :label="$lang[langId].copy + ' ' + $lang[langId].wholesale_prices">
                <p>{{ $lang[langId].copy_wholesale_note }}</p>
              </el-form-item>
            </el-col>

            <el-col :span="15">
              <div class="container-flex">
                <div class="mr-8">
                  <el-switch v-model="wholesaleSwitch" inactive-color="#ff4949"></el-switch>
                </div>
                <div v-if="wholesaleSwitch">
                  <strong>{{ lang.yes }}</strong>
                </div>
                <div v-else>
                  <strong>{{ lang.no }}</strong>
                </div>
              </div>
            </el-col>
          </div>

          <div v-if="$route.params.copy" class="row">
            <el-col :span="9">
              <el-form-item :label="$lang[langId].copy + ' ' + lang.material">
                <p>{{ $lang[langId].copy_material_note }}</p>
              </el-form-item>
            </el-col>

            <el-col :span="15">
              <div class="container-flex">
                <div class="mr-8">
                  <el-switch v-model="materialSwitch" inactive-color="#ff4949"></el-switch>
                </div>
                <div v-if="materialSwitch">
                  <strong>{{ lang.yes }}</strong>
                </div>
                <div v-else>
                  <strong>{{ lang.no }}</strong>
                </div>
              </div>
            </el-col>
          </div>

          <!-- <div class="row">
            <el-col :span="9">
              <el-form-item :label="$lang[langId].copy_addon">
                <p>{{ $lang[langId].copy_addon_note }}</p>
              </el-form-item>
            </el-col>

            <el-col :span="15">
              <el-switch v-model="addOnSwitch" inactive-color="#ff4949"></el-switch>
              <div v-if="addOnSwitch">
                <p class="desc-switch">
                  <strong>{{ lang.yes }}</strong>
                </p>
              </div>
              <div v-else>
                <p class="desc-switch">
                  <strong>{{ lang.no }}</strong>
                </p>
              </div>
            </el-col>
          </div> -->
          <!-- <el-button type="primary" @click="handleSave" :disabled="disableSave">{{lang.save}}</el-button> -->
        </el-form>
      </div>
    </div>

    <div class="box">
      <div class="box-header with-border">
        <h3 class="box-title">{{ $lang[langId].information_detail }}</h3>
        <div class="pull-right">
          <el-button
            type="info"
            size="small"
            @click="visibleAdditionalDetail = !visibleAdditionalDetail">
            <i v-if="!visibleAdditionalDetail" class="fa fa-plus"></i>
            <i v-else class="fa fa-minus"></i>
          </el-button>
        </div>
      </div>
      <div
        v-show="visibleAdditionalDetail"
        class="box-body create-product">
        <el-form
          label-position="top"
          @submit.native.prevent>
          <div class="row">
            <el-col :span="9">
              <el-form-item :label="lang.sku">
                <p>{{ lang.info_sku_or_barcode }}</p>
              </el-form-item>
            </el-col>
            <el-col :span="15">
              <el-form-item>
                <el-input v-model="data.product.sku" :placeholder="$lang[langId].please_input+lang.sku"></el-input>
              </el-form-item>
            </el-col>
          </div>

          <div v-if="selectedStore.is_onlineshop === 1" class="row">
            <el-col :span="9">
              <el-form-item :label="lang.collection">
                <p>{{ lang.info_collection }}</p>
              </el-form-item>
            </el-col>
            <el-col :span="15">
              <el-form-item>
                <el-select
                  v-model="data.product.collection_names"
                  :placeholder="lang.please_select"
                  allow-create
                  multiple
                  filterable>
                  <!-- <el-option
                    v-for="item in collections"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                  </el-option> -->
                  <template
                    v-for="item in collections">
                    <template v-if="!item.children.length">
                      <el-option
                        :key="item.id"
                        :label="item.name"
                        :value="item.name">
                      </el-option>
                    </template>
                    <template v-else-if="item.children.length">
                      <el-option-group
                        :key="item.id"
                        :label="item.name">
                        <el-option
                          v-for="child in item.children"
                          :key="child.id"
                          :label="child.name"
                          :value="child.name">
                        </el-option>
                      </el-option-group>
                    </template>
                  </template>
                </el-select>
              </el-form-item>
            </el-col>
          </div>

          <div class="row">
            <el-col :span="9">
              <el-form-item :label="lang.brand">
                <p>{{ lang.info_choose_existing_or_add_new }}</p>
              </el-form-item>
            </el-col>
            <el-col :span="15">
              <el-form-item>
                <el-select v-model="data.product.brand_name" filterable allow-create :placeholder="lang.please_select">
                  <el-option v-for="item in brandDatas" :key="item.id" :label="item.name" :value="item.name">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </div>

          <div v-if="userRole.is_pos_only !== 1" class="row">
            <el-col :span="9">
              <el-form-item :label="lang.condition">
                <p>{{ lang.please_select }}</p>
              </el-form-item>
            </el-col>
            <el-col :span="15">
              <el-form-item>
                <el-radio-group v-model="data.product.condition" @change="handleProductConditon">
                  <el-radio-button :label="$lang[langId].there_is_no">{{ $lang[langId].there_is_no }}</el-radio-button>
                  <el-radio-button :label="lang.new">{{ lang.new }}</el-radio-button>
                  <el-radio-button :label="$lang[langId].refurbished">{{ $lang[langId].refurbished }}</el-radio-button>
                  <el-radio-button :label="$lang[langId].second">{{ $lang[langId].second }}</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </div>

          <div v-if="selectedStore.is_pos_only === 1" class="row">
            <el-col :span="9">
              <el-form-item :label="lang.new_release"></el-form-item>
            </el-col>
            <el-col :span="15" class="switch-varian">
              <el-form-item>
                <div class="flex-container">
                  <div class="mr-8">
                    <el-switch v-model="data.product.is_new_release" inactive-color="#ff4949"></el-switch>
                  </div>
                  <div v-if="data.product.is_new_release">
                    <strong>{{ lang.yes }}</strong>
                  </div>
                  <div v-else>
                    <strong>{{ lang.no }}</strong>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </div>

          <div v-if="userRole.is_pos_only !== 1 || selectedStore.active_online_order === 1" class="row">
            <el-col :span="9">
              <el-form-item :label="lang.product_description"></el-form-item>
            </el-col>
            <el-col :span="15">
              <el-form-item>
                <el-input type="textarea" :rows="4" v-model="data.product.description" :placeholder="$lang[langId].please_input+lang.product_description"></el-input>
              </el-form-item>
            </el-col>
          </div>

          <div class="row">
            <el-col :span="9">
              <el-form-item :label="lang.notes"></el-form-item>
            </el-col>
            <el-col :span="15">
              <el-form-item>
                <el-input type="textarea" :rows="3" v-model="data.product.notes" :placeholder="$lang[langId].please_input+lang.notes"></el-input>
              </el-form-item>
            </el-col>
          </div>
          <br>
          <div v-if="!data.product.has_variant">
          <hr>
          
          <p>
            <strong>{{ lang.price }} {{ lang.product }}</strong>
          </p>
          <div v-if="userRole.role_id !== 'ST' && userRole.role_id !== 'SS' && !selectedStore.is_hide_buy_price" class="row">
            <el-col :span="9">
              <el-form-item :label="lang.buy_price"></el-form-item>
            </el-col>
            <el-col :span="15">
              <el-form-item>
                <input-money
                  v-model="data.product.buy_price"
                />
              </el-form-item>
            </el-col>
          </div>

          <div v-if="selectedStore.is_pos_only === 1" class="row">
            <el-col :span="9">
              <el-form-item :label="lang.market_price">
                <p>{{ lang.info_compare_at_price }}</p>
              </el-form-item>
            </el-col>
            <el-col :span="15">
              <el-form-item>
                <input-money
                  v-model="data.product.market_price"
                />
              </el-form-item>
            </el-col>
          </div>

          <div class="row">
            <el-col :span="9">
              <el-form-item :label="$lang[langId].comission">
                <p>{{ $lang[langId].commission_for_employees }}</p>
              </el-form-item>
            </el-col>
            <el-col :span="15">
              <el-form-item>
                <input-money
                  v-if="stageLevel === 'dash' || stageLevel === 'prod'"
                  v-model="data.product.comission"
                />
                <!--  -->
                <div v-else class="flex-container" style="width: 300px">
                  <div style="width: 60%">
                    <input-money v-if="data.product.is_comission_percentage === 0" 
                      class="switch-discount--money border border--grey-border" 
                      style="width: 100%" 
                      v-model="data.product.comission" />
                    <el-input
                      v-if="data.product.is_comission_percentage === 1"
                      v-model="data.product.comission"
                      class="switch-discount--money border border--grey-border" style="width: 100%" >
                      <template slot="append">%</template>
                    </el-input>
                  </div>
                  <div style="width: 40%">
                    <el-radio-group v-model="data.product.is_comission_percentage" class="flex-container" @change="handleMatchDiscount">
                      <el-radio-button class="lpoint-type" style="width: 50%" :label="0">IDR</el-radio-button>
                      <el-radio-button class="lpoint-type" style="width: 50%" :label="1">%</el-radio-button>
                    </el-radio-group>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </div>

          <div class="row">
            <el-col :span="9">
              <el-form-item :label="lang.pos_sell_price_dynamic">
                <p>{{ lang.info_pos_sell_price_dynamic }}</p>
              </el-form-item>
            </el-col>
            <el-col :span="15" class="switch-varian">
              <el-form-item>
                <div class="flex-container">
                  <div class="mr-8">
                    <el-switch v-model="data.product.pos_sell_price_dynamic" inactive-color="#ff4949"></el-switch>
                  </div>
                  <div v-if="data.product.pos_sell_price_dynamic">
                    <strong>{{ lang.yes }}</strong>
                  </div>
                  <div v-else>
                    <strong>{{ lang.no }}</strong>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </div>

          <hr/>
          </div>

          <p>
            <strong>{{ $lang[langId].ordering }}</strong>
          </p>

          <div v-if="selectedStore.is_pos_only === 1" class="row">
            <div class="col-md-6">
              <p>{{ lang.info_min_order }}</p>
              <el-input-number v-model="data.product.min_order" :min="0"></el-input-number>
            </div>
            <div class="col-md-6">
              <p>{{ $lang[langId].info_max_order }}</p>
              <el-input-number v-model="data.product.max_order" :min="0"></el-input-number>
            </div>
          </div>

          <hr/>

          <p>
            <strong>{{ lang.inventory }}</strong>
          </p>

          <!-- <div class="row">
            <el-col :span="9">
              <el-form-item :label="lang.track_inventory">
                <p>{{ lang.info_track_inventory }}</p>
              </el-form-item>
            </el-col>
            <el-col :span="15" class="switch-varian">
              <el-form-item>
                <div class="flex-container">
                  <div class="mr-8">
                    <el-switch v-model="data.product.track_inventory" inactive-color="#ff4949" :disabled="disableTrackInventory"></el-switch>
                  </div>
                  <div v-if="data.product.track_inventory">
                    <strong>{{ lang.yes }}</strong>
                  </div>
                  <div v-else>
                    <strong>{{ lang.no }}</strong>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </div>

          <div class="row" v-if="data.product.track_inventory">
            <el-col :span="9">
              <el-form-item :label="lang.info_stock_qty">
                <p>{{ lang.info_track_inventory_with_variant }}</p>
              </el-form-item>
            </el-col>
            <el-col :span="15">
              <el-form-item>
                <el-input v-model="data.product.stock_qty" :placeholder="$lang[langId].input_number" type="number" min="1"></el-input>
              </el-form-item>
            </el-col>
          </div>

          <div class="row" v-if="data.product.track_inventory">
            <el-col :span="9">
              <el-form-item :label="lang.product_stock_warning">
                <p>{{ $lang[langId].info_stock_limit }}.</p>
              </el-form-item>
            </el-col>
            <el-col :span="15">
              <el-form-item>
                <el-input v-model="data.product.low_stock_alert" :placeholder="$lang[langId].input_number" type="number" min="1"></el-input>
              </el-form-item>
            </el-col>
          </div> -->

          <div class="row">
            <el-col :span="9">
              <el-form-item :label="lang.unit_of_measurement">
              </el-form-item>
            </el-col>
            <el-col :span="15">
              <el-form-item>
                <el-select v-model="data.product.uom" filterable allow-create :placeholder="lang.please_select">
                  <el-option v-for="item in uomDatas" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </div>

          <div class="row">
            <el-col :span="9">
              <el-form-item :label="$lang[langId].empty_stock">
                <p>{{ $lang[langId].info_product_empty }}</p>
              </el-form-item>
            </el-col>
            <el-col :span="15" class="switch-varian">
              <el-form-item>
                <div class="flex-container">
                  <div class="mr-8">
                    <el-switch v-model="data.product.is_out_stock" inactive-color="#ff4949" @change="handleChangeOutStock(data.product.is_out_stock)"></el-switch>
                  </div>
                  <div v-if="data.product.is_out_stock">
                    <strong>{{ lang.yes }}</strong>
                  </div>
                  <div v-else>
                    <strong>{{ lang.no }}</strong>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </div>

          <hr/>

          <p>
            <strong>{{ lang.shipping }}</strong>
          </p>

          <div class="row">
            <el-col :span="9">
              <el-form-item :label="lang.require_shipping">
                <p>{{ lang.info_require_shipping }}</p>
              </el-form-item>
            </el-col>
            <el-col :span="15" class="switch-varian">
              <el-form-item>
                <div class="flex-container">
                  <div class="mr-8">
                    <el-switch v-model="data.product.require_shipping" inactive-color="#ff4949"></el-switch>
                  </div>
                  <div v-if="data.product.require_shipping">
                    <strong>{{ lang.yes }}</strong>
                  </div>
                  <div v-else>
                    <strong>{{ lang.no }}</strong>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </div>

          <div class="row">
            <el-col :span="9">
              <el-form-item :label="lang.product_weight">
                <p>{{ $lang[langId].product_kg_decimal }}</p>
              </el-form-item>
            </el-col>
            <el-col :span="15">
              <el-form-item>
                <el-input v-model="data.product.weight" :placeholder="lang.info_decimal">
                  <template slot="append">kg</template>
                </el-input>
              </el-form-item>
            </el-col>
          </div>

          <hr/>

          <p>
            <strong>{{ $lang[langId].additional_info }}</strong>
          </p>

          <div class="row">
            <el-col :span="9">
              <el-form-item :label="lang.info_taxes_included">
                <p>{{ $lang[langId].product_tax_free }}</p>
              </el-form-item>
            </el-col>
            <el-col :span="15" class="switch-varian">
              <el-form-item>
                <div class="flex-container">
                  <div class="mr-8">
                    <el-switch v-model="data.product.non_taxable" inactive-color="#ff4949"></el-switch>
                  </div>
                  <div v-if="data.product.non_taxable">
                    <strong>{{ lang.yes }}</strong>
                  </div>
                  <div v-else>
                    <strong>{{ lang.no }}</strong>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </div>

          <div v-if="data.loyaltyPoint" class="row">
            <el-col :span="9">
              <el-form-item :label="lang.loyalty_point">
                <p>{{ lang.info_loyalty_point_earned_per_item }}</p>
              </el-form-item>
            </el-col>
            <el-col :span="15">
              <el-form-item>
                <el-input
                  v-model="data.product.loyalty_points"
                  :placeholder="$lang[langId].input_number"
                  type="number"
                />
              </el-form-item>
            </el-col>
          </div>

          <div class="row">
            <el-col :span="9">
              <el-form-item :label="lang.ready_to_publish_for_sale">
                <p>{{ lang.info_publish_for_sale }}</p>
              </el-form-item>
            </el-col>
            <el-col :span="15" class="switch-varian">
              <el-form-item>
                <div class="flex-container">
                  <div class="mr-8">
                    <el-switch v-model="data.product.published" inactive-color="#ff4949"></el-switch>
                  </div>
                  <div v-if="data.product.published">
                    <strong>{{ lang.yes }}</strong>
                  </div>
                  <div v-else>
                    <strong>{{ lang.no }}</strong>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </div>

          <div v-if="data.product.published" class="row">
            <el-col :span="9">
              <el-form-item :label="lang.start_sale_date">
              </el-form-item>
            </el-col>
            <el-col :span="15" class="switch-varian">
              <el-date-picker v-model="data.product.published_date" type="date" format="dd-MM-yyyy" style="margin-top: -5px">
              </el-date-picker>
            </el-col>
          </div>

          <div class="row">
            <el-col :span="9">
              <el-form-item :label="lang.hide_in_pos">
                <p>{{ lang.info_hide_in_pos }}</p>
              </el-form-item>
            </el-col>
            <el-col :span="15" class="switch-varian">
              <el-form-item>
                <div class="flex-container">
                  <div class="mr-8">
                    <el-switch v-model="data.product.pos_hidden" inactive-color="#ff4949"></el-switch>
                  </div>
                  <div v-if="data.product.pos_hidden">
                    <strong>{{ lang.yes }}</strong>
                  </div>
                  <div v-else>
                    <strong>{{ lang.no }}</strong>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </div>

          <hr/>
          <div v-if="userRole.is_pos_only !== 1">
          <p>
            <strong>{{ lang.seo }}</strong>
          </p>
          <div class="row">
            <el-col :span="9">
              <el-form-item :label="lang.meta_keywords">
                <p>{{ lang.info_meta_keywords }}. {{ lang.info_input_tags_enter }}</p>
              </el-form-item>
            </el-col>
            <el-col :span="15">
              <el-form-item>
                <el-input
                  v-model="tmp.meta_keyword"
                  @change="handleAddMetaKeywords"
                />
                <p class="wrapper-tags">
                  <el-tag
                    v-for="(item, key) in data.product.meta_keywords"
                    :key="key"
                    closable
                    @close="handleRemoveMetaKeyword(key)">
                    {{ item }}
                  </el-tag>
                </p>
              </el-form-item>
            </el-col>
          </div>

          <div class="row">
            <el-col :span="9">
              <el-form-item :label="lang.meta_description">
                <p>{{ lang.info_meta_description }}</p>
              </el-form-item>
            </el-col>
            <el-col :span="15">
              <el-form-item>
                <el-input v-model="data.product.meta_description" placeholder="-"></el-input>
              </el-form-item>
            </el-col>
          </div>
          </div>
        </el-form>
      </div>
    </div>

    <!-- <div class="save-bottom">
      <div v-if="!$route.params.copy" class="box-bodys">
        <p>{{ $lang[langId].save_at }}</p>
        <el-select v-model="storeToBeSaved" multiple collapse-tags @change="handleSelectAll">
          <el-option
            v-for="item in outlets"
            :key="item.store_id"
            :label="item.name"
            :value="item.store_id">
          </el-option>
        </el-select>
        <el-button type="primary" @click="handleSave" :loading="loading" :disabled="disableSave">{{lang.save}}</el-button>
      </div>
      <div v-else class="box-bodys">
        <el-button type="primary" @click="handleSave" :loading="loading" >{{lang.save}}</el-button>
      </div>
    </div> -->

    <dialog-save-all-store :show-dialog="showDialogSaveAllStore" @close="showDialogSaveAllStore = false" @save="handleSaveData" />
  </div>
</template>
<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import { baseApi } from 'src/http-common.js'
import axios from 'axios'
import variantCreate from './ProductVariantCreate'
import SelectGroupedProductCategory from 'components/modules/SelectGroupedProductCategory'
import InputMoney from '@/components/InputMoneyV2'
import DialogSaveAllStore from '@/components/dialogSaveAllStore'

import moment from 'moment'

export default {
  name: 'CreateNewProduct',

  components: {
    variantCreate,
    SelectGroupedProductCategory,
    InputMoney,
    DialogSaveAllStore
  },

  mixins: [basicComputedMixin],

  data() {
    return {
      visibleAdditionalDetail: false,
      storeToBeSaved: [],
      loading: true,
      disableSave: true,
      disableTrackInventory: false,
      modalVarian: false,
      hargaJualSwitch: true,
      collections: null,
      brandDatas: null,
      uomDatas: null,
      uploadPhotoUrl: '',
      variant: {
        label: null,
        names: []
      },
      tmp: {
        collection_names: null,
        group: null,
        brand: null,
        sell_price_pos: 0,
        meta_keyword: ''
      },
      control: {
        variant: {
          addVariant: false,
          name: ''
        }
      },
      data: {
        product: {
          name: null,
          sell_price: 0,
          sell_price_pos: 0,
          product_group_id: null,
          has_variant: false,
          product_group_name: null,
          brand_name: null,
          collection_names: null,
          uom: null,
          sku: null,
          condition_id: 'N',
          condition: '',
          is_new_release: 1,
          description: null,
          notes: null,
          buy_price: 0,
          market_price: 0,
          comission: 0,
          pos_sell_price_dynamic: false,
          track_inventory: false,
          stock_qty: null,
          low_stock_alert: null,
          is_out_stock: false,
          require_shipping: true,
          weight: 1,
          non_taxable: false,
          loyalty_points: null,
          pos_hidden: false,
          published: false,
          published_date: moment().format('YYYY-MM-DD'),
          meta_keywords: [],
          meta_description: '',
          is_comission_percentage: 0
        },
        loyaltyPoint: false,
        variant: [],
        file: []
      },
      rules: {
        product: {
          name: [
            {
              message: this.$lang[this.$store.state.userStores.langId].please_input + this.$store.state.userStores.lang.product_name,
              trigger: 'blur',
              required: true
            }
          ],
          product_group_name: [{
            message: this.$store.state.userStores.lang.please_select + ' ' + this.$store.state.userStores.lang.product_category,
            trigger: 'blur',
            required: true
          }]
        }
      },
      product: {},
      photosSwitch: false,
      variantSwitch: false,
      addOnSwitch: false,
      wholesaleSwitch: false,
      materialSwitch: false,
      discType: 1,
      showDialogSaveAllStore: false
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
    userRole() {
      const selectedStore = this.$store.getters.selectedStore
      return {
        role_id: selectedStore.role_id,
        role_name: selectedStore.role_name,
        is_pos_only: selectedStore.is_pos_only,
        is_mobile: selectedStore.is_mobile
      }
    },
    headers() {
      return {
        'Authorization': 'Bearer ' + this.token.access_token
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
      return outlets
    }
  },

  watch: {
    data: {
      handler(data) {
        if ((data.product.name && data.product.name !== '') &&
        ((data.product.product_group_name && data.product.product_group_name !== null) || (data.product.product_group_id && data.product.product_group_id !== null)) &&
        // (data.product.sell_price_pos && data.product.sell_price_pos !== 0) &&
        ((data.product.has_variant === false) ||
        (data.product.has_variant === true && data.variant.length > 0))) {
          this.disableSave = false
        } else {
          this.disableSave = true
        }
      },
      deep: true,
      immediate: true
    },
    selectedStore(store) {
      this.storeToBeSaved = store.url_id
    }
  },

  mounted() {
    if (this.$route.params.copy) {
      this.loadData()
    }

    const store = this.$store.getters.selectedStore
    if (store) {
      if (store.constructor === Array) {
        this.storeToBeSaved = 'all'
      } else {
        this.storeToBeSaved[0] = store.store_id
      }
    }

    this.uploadPhotoUrl = baseApi(this.selectedStore.url_id, this.langId, 'product/upload')
    
    this.getSelectCollection()
    this.getSelectBrand()
    this.getSelectUom()
    this.getLoyaltyPoint()
  },

  methods: {
    loadData() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'product/' + this.$route.params.id),
        headers: headers
      }).then(response => {
        this.product = response.data.data
        this.data.product = response.data.data
        this.data.product.product_group_name = this.data.product.klasifikasi

        if (parseInt(this.data.product.sell_price) === this.data.product.sell_price_pos) {
          this.hargaJualSwitch = true
        } else {
          this.hargaJualSwitch = false
        }

        this.photosSwitch = true
        this.addOnSwitch = true

        if (this.data.product.meta_keywords.length >= 1) {
          this.data.product.meta_keywords = this.data.product.meta_keywords.split(',')
        }

        if (this.data.product.has_variant === 1) {
          this.data.product.has_variant = true
          this.variantSwitch = true
        } else {
          this.data.product.has_variant = false 
          this.variantSwitch = false
        }

        if (this.data.product.is_new_release === 1) {
          this.data.product.is_new_release = true
        } else {
          this.data.product.is_new_release = false 
        }

        if (this.data.product.pos_sell_price_dynamic === 1) {
          this.data.product.pos_sell_price_dynamic = true
        } else {
          this.data.product.pos_sell_price_dynamic = false 
        }

        if (this.data.product.track_inventory === 1) {
          this.data.product.track_inventory = true
        } else {
          this.data.product.track_inventory = false 
        }

        if (this.data.product.is_out_stock === 1) {
          this.data.product.is_out_stock = true
        } else {
          this.data.product.is_out_stock = false 
        }

        if (this.data.product.require_shipping === 1) {
          this.data.product.require_shipping = true
        } else {
          this.data.product.require_shipping = false 
        }

        if (this.data.product.non_taxable === 1) {
          this.data.product.non_taxable = true
        } else {
          this.data.product.non_taxable = false 
        }

        if (this.data.product.pos_hidden === 1) {
          this.data.product.pos_hidden = true
        } else {
          this.data.product.pos_hidden = false 
        }

        if (this.data.product.stock_qty === '0') {
          this.data.product.stock_qty = 0
        } else {
          this.data.product.stock_qty = parseInt(this.data.product.stock_qty)
        }

        this.$set(this.product, 'collection_names', [])
        if (this.product.collections.length > 0) {
          this.product.collections.map(item => {
            this.product.collection_names.push(item.name)
          })
        }
        this.tmp = response.data.data
        if (this.product.photos.length > 0) {
          this.newPhoto = this.product.photos.map((item, idx, array) => {
            item.url = item.photo_md
            item.name = item.title
            return item
          })
        }
        this.loading = false
        this.$emit('dataloaded', this.product)
      }).catch(error => {
        this.loading = true
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
      })
    },
    getSelectCategory() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productgroup'),
        headers: headers,
        params: {
          per_page: 1000
        }
      })
        .then(response => {
          this.categories = response.data.data
          this.loading = false
        })
        .catch(error => {
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

    getSelectCollection() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'collection'),
        headers: headers,
        params: {
          per_page: 1000
        }
      })
        .then(response => {
          this.collections = response.data.data
          this.loading = false
        })
        .catch(error => {
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

    beforeUpload(file) {
      const isJpg = file.type === 'image/jpeg'
      const isPng = file.type === 'image/png'
      if (!isJpg && !isPng) {
        this.$message.error(this.$lang[this.langId].error_upload_photo)
      }
      return isJpg || isPng
    },

    handleUploadSuccess(response, file, fileList) {
      this.data.file.push(response.data[0])
    },

    handleUploadError(err) {
      this.$notify({
        type: 'warning',
        message: 'File too large',
        title: 'Error'
      })
    },

    handleProductConditon(data) {
      // console.log('con', data)
      let condition = data
      if (condition === this.lang.new) this.data.product.condition_id = 'N'
      if (condition === this.$lang[this.langId].refurbished) this.data.product.condition_id = 'R'
      if (condition === this.$lang[this.langId].second) this.data.product.condition_id = 'U'
      if (condition === this.$lang[this.langId].there_is_no) this.data.product.condition_id = null
    },

    getSelectBrand() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'brand'),
        headers: headers,
        params: {
          per_page: 1000
        }
      })
        .then(response => {
          this.brandDatas = response.data.data
          this.loading = false
        })
        .catch(error => {
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

    getSelectUom() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'uom'),
        headers: headers,
        params: {
          per_page: 1000
        }
      })
        .then(response => {
          this.uomDatas = response.data.data
          this.loading = false
        })
        .catch(error => {
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

    commitVariants(names, labels, track_inventory) {
      this.data.product.track_inventory = track_inventory
      this.data.variant = names
      this.data.product.variant_label = labels.join()
    },

    handleSave() {
      if (this.storeToBeSaved.length && this.storeToBeSaved[0] === 0) {
        this.showDialogSaveAllStore = true
      } else {
        this.handleSaveData()
      }
    },

    handleSaveData() {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      //
      let data = { ...this.data }
      data.product = { ...this.data.product }
      //
      if (this.data.product.meta_keywords !== null) {
        let meta_keywords = [ ...this.data.product.meta_keywords ]
        meta_keywords = meta_keywords.join(',')
        data.product.meta_keywords = meta_keywords
      } else {
        data.product.meta_keyword = ''
      }
      //
      if (this.hargaJualSwitch) {
        data.product.sell_price = data.product.sell_price_pos
      }
      //
      if (this.$route.params.copy) {
        if (this.photosSwitch) {
          data.product.copy_photos = this.$route.params.id
        } else {
          data.product.copy_photos = 0
        }
        if (this.variantSwitch) {
          data.product.copy_variants = this.$route.params.id
        } else {
          data.product.copy_variants = 0
        }
        if (this.addOnSwitch) {
          data.product.copy_addons_notes = this.$route.params.id
        } else {
          data.product.copy_addons_notes = 0
        }
        if (this.wholesaleSwitch) {
          data.product.copy_wholesale_prices = this.$route.params.id
        } else {
          data.product.copy_wholesale_prices = 0
        }
        if (this.materialSwitch) {
          data.product.copy_materials = 1
        } else {
          data.product.copy_materials = 0
        }
      }
      if (data.product.has_variant === true) {
        let names = data.variant
        names.map((item, idx, array) => {
          if (!item.sell_price && !item.sell_price_pos) {
            item.sell_price = this.data.product.sell_price
            item.sell_price_pos = this.data.product.sell_price_pos
          }
          if (!item.sku && this.data.product.sku) {
            item.sku = this.data.product.sku + '-' + idx
          }
        })
      }

      // console.log('datac', data.product.collection_names)
      if (data.product.collection_names) {
        let colection = data.product.collection_names.join(',')
        // console.log('col', colection)
        data.product.collection_names = colection
      }

      // delete data.file if it doesnt have anything inside
      if (data.file.length === 0) {
        this.$delete(data, 'file')
      }
      // check if wants to save to all store
      // if (this.selectedStore.url_id === 'setdemo1' || this.selectedStore.url_id === 'allinolsera2' || this.selectedStore.url_id === 'siliwangidutagarden') {
      //   data.to_store_id = this.selectedStore.store_id
      //   data.to_allstore_id = 0
      //   if (this.storeToBeSaved.length && this.storeToBeSaved[0] === 0) {
      //    data.to_allstore_id = 1
      //   } else if (this.storeToBeSaved.length) {
      //     data.to_store_id = this.storeToBeSaved.join(',')
      //   }

      //   let url = baseApi(this.selectedStore.url_id, this.langId, 'product')
      //   this.save(url, data, headers)
      //   this.$router.push({path: '/catalog/product/'})

      // } else {
        let url = ''
        if (!this.$route.params.copy) {
          data.to_store_id = this.selectedStore.store_id
          data.to_allstore_id = 0
          if (this.storeToBeSaved.length && this.storeToBeSaved[0] === 0) {
          data.to_allstore_id = 1
          } else if (this.storeToBeSaved.length) {
            data.to_store_id = this.storeToBeSaved.join(',')
          }

          url = baseApi(this.selectedStore.url_id, this.langId, 'product')
          // check group product
            let datasave = data
            if (datasave.product.product_group_id) {
              this.$set(datasave.product, 'product_group_name', null)
              // datasave.product_group_name = null
              // console.log('trace', datasave.product.product_group_name)
            }
            // 
          this.save(url, datasave, headers)
        } else {
          url = baseApi(this.selectedStore.url_id, this.langId, 'product/copy')
          var datacopy = data.product
          datacopy.product_id = this.$route.params.id
          this.save(url, datacopy, headers)
        }
      // }
      // if (this.storeToBeSaved === 'all') {
      //   //
      //   console.log(this.$store.state.userStores)
      //   console.log('trace', data)
      //   const promise = new Promise((resolve, reject) => {
      //     this.$store.state.userStores.stores.forEach((item, idx, arr) => {
      //       let url = baseApi(item.url_id, this.langId, 'product')
      //       // 
      //       this.save(url, data, headers, item.name, false)
      //       if (idx === arr.length - 1) resolve()
      //     })
      //   })

      //   promise.then(() => {
      //     this.$router.push({path: '/catalog/product/'})
      //   })
      // } else {
      //   let url = ''
      //   if (!this.$route.params.copy) {
      //     url = baseApi(this.storeToBeSaved, this.langId, 'product')
      //     // check group product
      //       let datasave = data
      //       if (this.storeToBeSaved !== this.selectedStore.url_id) {
      //         datasave.product.product_group_id = null
      //       } else if (this.storeToBeSaved === this.selectedStore.url_id && datasave.product.product_group_id) {
      //         this.$set(datasave.product, 'product_group_name', null)
      //         // datasave.product_group_name = null
      //         // console.log('trace', datasave.product.product_group_name)
      //       }
      //       // 
      //     this.save(url, datasave, headers)
      //   } else {
      //     url = baseApi(this.selectedStore.url_id, this.langId, 'product/copy')
      //     var datacopy = data.product
      //     datacopy.product_id = this.$route.params.id
      //     this.save(url, datacopy, headers)
      //   }
      // }
    },

    save(url, data, headers, outlet = null, singleSave = true) {
      this.loading = true
			
      let outletname = ''
      if (outlet) {
        outletname = this.$lang[this.langId].at_outlet + outlet
      }

      axios({
        method: 'POST',
        url: url,
        headers: headers,
        data: data
      })
        .then(response => {
          this.loading = false
          this.$message({
            message: this.lang.product + response.data.data.name + this.$lang[this.langId].success_add + outletname + '.',
            type: 'success'
          })
          this.loading = false
          // set scheme of data to default
          this.$set(data, 'file', [])
          if (singleSave) {
            this.$router.push({path: '/catalog/product'})
          }
        })
        .catch((error) => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          // set scheme of data to default
          this.$set(data, 'file', [])
          this.loading = false
        })
    },

    handleChangeOutStock(item) {
      if (item === true) {
        this.data.product.track_inventory = false
        this.data.product.stock_qty = null
        this.data.product.low_stock_alert = null
        this.disableTrackInventory = true
      } else {
        this.disableTrackInventory = false
      }
    },

    handleChangeSelectCategory(val) {
      // console.log(val)
      this.data.product.product_group_name = val.name
      this.data.product.product_group_id = val.id
    },

    handleCreateCategory (val) {
      this.data.product.product_group_name = val
      this.data.product.product_group_id = null
    },

    handleAddMetaKeywords() {
      if (this.tmp.meta_keyword) {
        this.data.product.meta_keywords.push(this.tmp.meta_keyword)
        this.tmp.meta_keyword = ''
      }
    },

    handleRemoveMetaKeyword(key) {
      this.data.product.meta_keywords.splice(key, 1)
    },

    getLoyaltyPoint() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'loyaltypoint'),
        headers: headers
      }).then(response => {
        if (response.data.data.with_lpoint === 0) {
          this.data.loyaltyPoint = false
        } else {
          this.data.loyaltyPoint = true
        }
        this.loading = false
      }).catch(error => {
        this.loading = false
      })
    },

    handleMatchDiscount () {
      let disc = 0
      let price = this.data.product.sell_price_pos
      if (this.data.product.is_comission_percentage === 1) {
        disc = (this.data.product.comission/price) * 100
      }
      if (this.data.product.is_comission_percentage === 0) {
        disc = (this.data.product.comission/100) * price
      }
      this.data.product.comission = disc
      // console.log('disc', disc)
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
