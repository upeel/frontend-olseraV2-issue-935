<template>
  <div class="row">
    <!-- Profile Umum -->
    <div class="col-md-12">
      <el-card v-loading="loading" class="box-card">
        <div slot="header" class="with-border table-handler-flex">
          <h4 class="box-title" style="flex-grow: 1;">{{ lang.general_info }}</h4>
          <div class="flex-container">
            <template v-if="isEditing.profile">
              <p>{{ $lang[langId].save_at }}:</p>
              <el-select v-model="storeToBeSaved" multiple collapse-tags @change="handleSelectAll">
                <el-option
                  v-for="item in outlets"
                  :key="item.store_id"
                  :label="item.name"
                  :value="item.store_id">
                </el-option>
              </el-select>
            </template>
            <el-button type="success" v-if="isEditing.profile" class="ml-4" @click="saveEdit('profile')">{{ lang.save }}</el-button>
            <el-button type="default" v-if="isEditing.profile" class="ml-8" @click="cancelEdit('profile')">{{ lang.cancel }}</el-button>
            <button-action-authenticated
              v-if="!isEditing.profile"
              :permission="['catalog/products', 'edit']"
              type="primary"
              @click="handleEdit('profile')">
              {{ lang.edit }}
            </button-action-authenticated>
            <router-link
              v-if="!isEditing.profile"
              :to="{ name: 'Product Copy', params: { id: $route.params.id, copy: true }}">
              <button-action-authenticated
                :permission="['catalog/products', 'edit']"
                type="default"
                style="color: #000000">
                {{ $lang[langId].copy }}
              </button-action-authenticated>
            </router-link>
          </div>
        </div>

        <div v-if="!isEditing.profile" class="panel-body p-null">
          <el-row :gutter="20">
            <el-col v-if="product.photos && product.photos.length" :sm="8">
              <bs-carousel
                :items="product.photos"
              />
            </el-col>

            <el-col :sm="16">
              <ul class="cart-items profil-side">
                <li>
                  <p>{{ lang.product_name }}</p>
                  <span class="font-16 font-bold">{{product.name}}</span>
                </li>
                <li>
                  <p>{{ lang.classification }}</p>
                  <span class="font-16 font-bold">{{product.category_name}}</span>
                </li>
                <li>
                  <p>{{ lang.group }}</p>
                  <span class="font-16 font-bold">{{product.klasifikasi}}</span>
                </li>
                <li>
                  <p>{{ lang.collection }}</p>
                  <span class="font-16 font-bold" v-if="product.collections && product.collection_names">
                    {{product.collection_names.join(',')}}
                  </span>
                </li>
                <li>
                  <p>{{ lang.sku }}</p>
                  <span class="font-16 font-bold">{{product.sku}}</span>
                </li>
                <li>
                  <p>{{ lang.brand }}</p>
                  <span class="font-16 font-bold">{{product.brand_name}}</span>
                </li>
              </ul>
            </el-col>
          </el-row>

          <div class="panel panel-default border-null">
            <div
              class="panel-heading text-center pointer"
              style="background: transparent;">
              <el-button
                circle
                style="font-size: 24px;"
                @click="visibleMoreDetail = !visibleMoreDetail">
                <i v-show="visibleMoreDetail" class="el-icon-arrow-up"></i>
                <i v-show="!visibleMoreDetail" class="el-icon-arrow-down"></i>
              </el-button>
            </div>

            <div
              v-show="visibleMoreDetail"
              class="panel-body p-null">
              <ul class="cart-items profil-side">
                <li>
                  <p>{{ lang.brand }}</p>
                  <span class="font-16 font-bold" v-if="product.brand_name">{{product.brand_name}}</span>
                  <span class="font-16 font-bold" v-else>-</span>
                </li>
                <li v-if="userRole.is_pos_only !== 1">
                  <p>{{ lang.condition }}</p>
                  <span class="font-16 font-bold" v-if="product.condition_name">
                    {{product.condition_name}}
                  </span>
                  <span class="font-16 font-bold" v-else>
                    -
                  </span>
                </li>
                <li>
                  <p>{{ lang.info_non_taxable_item }}</p>
                  <span class="font-16 font-bold" v-if="product.non_taxable === 0">{{ lang.no }}</span>
                  <span class="font-16 font-bold" v-if="product.non_taxable === 1">{{ lang.yes }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <edit-profile
          v-else
          :data="product"
          :new-photo="newPhoto"
          @removephoto="removePhoto"
          @updatephoto="handleUpdatePhoto"
          @save="saveEdit('profilephoto')"
        />
      </el-card>
    </div>

    <!-- Harga -->
    <div class="col-md-12">
      <el-card v-loading="loading" class="box-card">
        <div slot="header" class="with-border table-handler-flex">
          <h4 class="box-title" style="flex-grow: 1;">{{ lang.price }}</h4>
          <div class="flex-container">
            <template v-if="isEditing.price">
              <p>{{ $lang[langId].save_at }}:</p>
              <el-select v-model="storeToBeSaved" multiple collapse-tags @change="handleSelectAll">
                <el-option
                  v-for="item in outlets"
                  :key="item.store_id"
                  :label="item.name"
                  :value="item.store_id">
                </el-option>
              </el-select>
            </template>
            <el-button type="success" v-if="isEditing.price" class="ml-4" @click="saveEdit('price')">{{ lang.save }}</el-button>
            <el-button type="default" v-if="isEditing.price" @click="cancelEdit('price')">{{ lang.cancel }}</el-button>
            <button-action-authenticated :permission="['catalog/products', 'edit']" type="primary" v-if="!isEditing.price" @click="handleEdit('price')">{{ lang.edit }}</button-action-authenticated>
          </div>
        </div>
        <div class="panel-body p-null">
          <div>
            <p>{{ lang.pos_sell_price_dynamic }}</p>
            <div v-if="!isEditing.price">
              <span class="font-16 font-bold" v-if="product.pos_sell_price_dynamic === 1">{{ lang.yes }}</span>
              <span class="font-16 font-bold" v-else>{{ lang.no }}</span>
            </div>
            <div v-else>
              <el-switch
                v-model="tmp.pos_sell_price_dynamic"
                :active-value="1"
                :inactive-value="0">
              </el-switch>
              <div v-if="tmp.pos_sell_price_dynamic === 1">
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
          </div>
          <hr/>
          <el-row :gutter="20">
            <el-col v-if="userRole.role_id !== 'ST' && userRole.role_id !== 'SS'" :sm="6">
              <el-card :body-style="{ padding: '8px' }" class="box-info">
                <ul class="cart-items">
                  <li class="blog-side-nest">
                    <p>{{ lang.market_price }}</p>
                    <el-tag v-if="product.variant && product.variant.length > 0">{{ $lang[langId].refer_to_variant }}</el-tag>
                    <el-tag v-else>{{ product.fmarket_price }}</el-tag>
                  </li>
                </ul>
              </el-card>
              <div class="card-harga-bottom" v-if="!isEditing.price || (product.variant && product.variant.length > 0)">
                <p>{{ product.fmarket_price }}</p>
              </div>
              <div class="card-harga-bottom" v-else>
                <!-- <money v-bind="$store.state.inputMoney" v-model="tmp.market_price" class="el-input__inner" /> -->
                <input-money v-model="product.market_price" />
              </div>
            </el-col>
            <el-col v-if="userRole.role_id !== 'ST' && userRole.role_id !== 'SS'" :sm="6">
              <el-card :body-style="{ padding: '8px' }" class="box-info">
                <ul class="cart-items">
                  <li
                    v-loading="loadingProductPrices"
                    class="blog-side-nest">
                    <div class="flex-container">
                      <div style="flex-grow: 2">
                        {{ lang.buy_price }}
                      </div>
                      <el-button
                        icon="el-icon-view"
                        size="mini"
                        type="text"
                        @click="getPriceDetail"
                      />
                    </div>
                    <el-tag v-if="product.variant && product.variant.length > 0">{{ $lang[langId].refer_to_variant }}</el-tag>
                    <el-tag v-else>{{ product.fbuy_price }}</el-tag>
                  </li>
                </ul>
              </el-card>
              <div v-if="!isEditing.price || (product.variant && product.variant.length > 0)" class="card-harga-bottom">
                <p>{{ product.fbuy_price }}</p>
              </div>
              <div class="card-harga-bottom" v-else>
                <input-money v-model="tmp.buy_price" />
              </div>
            </el-col>
            <el-col :sm="6">
              <el-card :body-style="{ padding: '8px' }" class="box-info">
                <ul class="cart-items">
                  <li class="blog-side-nest">
                    <p>{{ lang.online_selling_price }}</p>
                    <el-tag v-if="product.variant && product.variant.length > 0">{{ $lang[langId].refer_to_variant }}</el-tag>
                    <el-tag v-else>{{ product.fsell_price }}</el-tag>
                  </li>
                </ul>
              </el-card>
              <div class="card-harga-bottom" v-if="!isEditing.price || (product.variant && product.variant.length > 0)">
                <p>{{ product.fsell_price }}</p>
              </div>
              <div class="card-harga-bottom" v-else>
                <input-money v-model="tmp.sell_price" />
              </div>
            </el-col>
            <el-col v-if="userRole.role_id !== 'ST' && userRole.role_id !== 'SS'" :sm="6">
              <el-card :body-style="{ padding: '8px' }" class="box-info">
                <ul class="cart-items">
                  <li class="blog-side-nest">
                    <p>{{ lang.selling_price_in_store }}</p>
                    <el-tag v-if="product.variant && product.variant.length > 0">{{ $lang[langId].refer_to_variant }}</el-tag>
                    <el-tag v-else>{{ product.fsell_price_pos }}</el-tag>
                  </li>
                </ul>
              </el-card>
              <div class="card-harga-bottom" v-if="!isEditing.price || (product.variant && product.variant.length > 0)">
                <p>{{ product.fsell_price_pos }}</p>
              </div>
              <div class="card-harga-bottom" v-else>
                <input-money v-model="tmp.sell_price_pos" />
              </div>
            </el-col>
            <el-col v-if="userRole.role_id !== 'ST' && userRole.role_id !== 'SS'" :sm="6">
              <el-card :body-style="{ padding: '8px' }" class="box-info">
                <ul class="cart-items">
                  <li class="blog-side-nest">
                    <p>{{ lang.comission }}</p>
                    <el-tag v-if="product.variant && product.variant.length > 0">{{ $lang[langId].refer_to_variant }}</el-tag>
                    <el-tag v-else>{{ product.fcomission }}</el-tag>
                  </li>
                </ul>
                <div v-if="isEditing.price">
                  <el-radio-group v-model="tmp.is_comission_percentage" class="flex-container" @change="handleMatchDiscount">
                    <el-radio-button class="lpoint-type" style="width: 50%" :label="0">IDR</el-radio-button>
                    <el-radio-button class="lpoint-type" style="width: 50%" :label="1">%</el-radio-button>
                  </el-radio-group>
                </div>
              </el-card>
              <div class="card-harga-bottom" v-if="!isEditing.price || (product.variant && product.variant.length > 0)">
                <p>{{ product.fcomission }}</p>
              </div>
              <div v-else class="card-harga-bottom" >
                <input-money
                  v-if="stageLevel === 'dash' || stageLevel === 'prod'"
                  v-model="tmp.comission" />

                <div v-else class="flex-container">
                  <div>
                    <input-money v-if="tmp.is_comission_percentage === 0" 
                      class="switch-discount--money border border--grey-border" 
                      style="width: 100%" 
                      v-model="tmp.comission" />
                    <el-input
                      v-if="tmp.is_comission_percentage === 1"
                      v-model="tmp.comission"
                      class="switch-discount--money border border--grey-border" style="width: 100%" >
                      <template slot="append">%</template>
                    </el-input>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :sm="6">
              <el-card :body-style="{ padding: '8px' }" class="box-info">
                <ul class="cart-items">
                  <li class="blog-side-nest">
                    <p>{{ $lang[langId].minimum_order }}</p>
                  </li>
                </ul>
              </el-card>
              <div class="card-harga-bottom" v-if="!isEditing.price">
                <p>{{ product.min_order }}</p>
              </div>
              <div class="card-harga-bottom" v-else>
                <el-input v-model="product.min_order"></el-input>
              </div>
            </el-col>
            <el-col :sm="6">
              <el-card :body-style="{ padding: '8px' }" class="box-info">
                <ul class="cart-items">
                  <li class="blog-side-nest">
                    <p>{{ $lang[langId].maximum_order }}</p>
                  </li>
                </ul>
              </el-card>
              <div class="card-harga-bottom" v-if="!isEditing.price">
                <p>{{ product.max_order }}</p>
              </div>
              <div class="card-harga-bottom" v-else>
                <el-input v-model="product.max_order"></el-input>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>

    <!-- INVENTORY -->
    <div class="col-md-12">
      <el-card v-loading="loading" class="box-card">
        <div slot="header" class="with-border table-handler-flex">
          <h4 class="box-title" style="flex-grow: 1;">{{ lang.inventory }}</h4>
          <div class="flex-container">
            <template v-if="isEditing.inventory">
              <p>{{ $lang[langId].save_at }}:</p>
              <el-select v-model="storeToBeSaved" multiple collapse-tags @change="handleSelectAll">
                <el-option
                  v-for="item in outlets"
                  :key="item.store_id"
                  :label="item.name"
                  :value="item.store_id">
                </el-option>
              </el-select>
            </template>
            <el-button type="success" v-if="isEditing.inventory" class="ml-4" @click="saveEdit('inventory')">{{ lang.save }}</el-button>
            <el-button type="default" v-if="isEditing.inventory" @click="cancelEdit('inventory')">{{ lang.cancel }}</el-button>
            <button-action-authenticated :permission="['catalog/products', 'edit']" type="primary" v-if="!isEditing.inventory" @click="handleEdit('inventory')">{{ lang.edit }}</button-action-authenticated>
          </div>
        </div>
        <div class="panel-body p-null" v-if="!isEditing.inventory">
          <ul class="cart-items">
            <li>
              <p>{{ lang.track_inventory }}</p>
              <span class="font-16 font-bold" v-if="product.track_inventory === 1">{{ lang.yes }}</span>
              <span class="font-16 font-bold" v-else>{{ lang.no }}</span>
            </li>
            <li v-if="product.track_inventory">
              <p>{{ $lang[langId].on_hold_qty }}</p>
              <span class="font-16 font-bold">{{ product.hold_qty }}</span>
            </li>
            <li v-if="product.track_inventory">
              <p>{{ $lang[langId].low_stock_alert }}</p>
              <span class="font-16 font-bold">{{ product.low_stock_alert }}</span>
            </li>
            <li v-if="product.track_inventory !== 0" class="blog-side-nest">
              <p>{{ lang.stock_qty }}</p>
              <el-tag v-if="product.variant && product.variant.length > 0">{{ $lang[langId].refer_to_variant }}</el-tag>
              <el-tag v-else>{{product.stock_qty}}</el-tag>
            </li>
            <li>
              <p>{{ $lang[langId].measure_unit }}</p>
              <span class="font-16 font-bold" v-if="!product.uom">-</span>
              <span class="font-16 font-bold" v-else>{{product.uom}}</span>
            </li>
            <li>
              <p>{{ $lang[langId].empty_stock }}</p>
              <span class="font-16 font-bold" v-if="product.is_out_stock === 1">{{ lang.yes }}</span>
              <span class="font-16 font-bold" v-else>{{ lang.no }}</span>
            </li>
          </ul>
        </div>
        <div class="panel-body p-null" v-else>
          <ul class="cart-items">
            <li>
              <p>{{ lang.track_inventory }}</p>
              <div>
                <el-switch
                  v-model="tmp.track_inventory"
                  :active-value="1"
                  :inactive-value="0">
                </el-switch>
                <div v-if="tmp.track_inventory === 1">
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
            </li>
            <li v-if="tmp.track_inventory">
              <p>{{ $lang[langId].on_hold_qty }}</p>
              <div>
                <el-input v-model="tmp.hold_qty" type="number" />
              </div>
            </li>
            <li v-if="tmp.track_inventory">
              <p>{{ $lang[langId].low_stock_alert }}</p>
              <div>
                <el-input v-model="tmp.low_stock_alert" type="number" />
              </div>
            </li>
            <li>
              <p>{{ $lang[langId].measure_unit }}</p>
              <el-select
                size="mini"
                v-model="tmp.uom"
                clearable
                allow-create
                filterable
                :placeholder="lang.please_select">
                <el-option
                  v-for="item in uoms"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </li>
            <li>
              <p>{{ $lang[langId].empty_stock }}</p>
              <div>
                <el-switch
                  v-model="tmp.is_out_stock"
                  :active-value="1"
                  :inactive-value="0">
                </el-switch>
                <div v-if="tmp.is_out_stock === 1">
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
            </li>
          </ul>
        </div>
        <div>
          
        </div>
      </el-card>
    </div>

    <!-- INVENTORY - SEMUA OUTLET -->
    <div v-if="product.has_branches_stock_info === 1" class="col-md-12">
      <el-card v-loading="loading" class="box-card">
        <div slot="header" class="with-border table-handler-flex">
          <h4 class="box-title" style="flex-grow: 1;">{{ lang.inventory }} - {{ $lang[langId].all_outlet}}</h4>
        </div>
        <div class="panel-body p-null" v-if="!isEditing.inventory_outlet">
          <el-table :data="product.branches_stock_info" stripe style="width: 100%" :show-header="false">
            <el-table-column prop="store_name" :label="lang.variant" width="500">
            </el-table-column>
            <el-table-column prop="variant" :label="lang.sku" width="200">
              <template slot-scope="scope">
                <svg-icon icon-class="tag"></svg-icon> {{ scope.row.variant }}
              </template>
            </el-table-column>
            <el-table-column prop="stock_qty">
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>


    <!-- SHIPPING -->
    <div class="col-md-12">
      <el-card v-loading="loading" class="box-card">
        <div slot="header" class="with-border table-handler-flex">
          <h4 class="box-title" style="flex-grow: 1;">{{ lang.shipping }}</h4>
          <div class="flex-container">
            <template v-if="isEditing.shipping">
              <p>{{ $lang[langId].save_at }}:</p>
              <el-select v-model="storeToBeSaved" multiple collapse-tags @change="handleSelectAll">
                <el-option
                  v-for="item in outlets"
                  :key="item.store_id"
                  :label="item.name"
                  :value="item.store_id">
                </el-option>
              </el-select>
            </template>
            <el-button type="success" v-if="isEditing.shipping" class="ml-4" @click="saveEdit('shipping')">{{ lang.save }}</el-button>
            <el-button type="default" v-if="isEditing.shipping" @click="cancelEdit('shipping')">{{ lang.cancel }}</el-button>
            <button-action-authenticated :permission="['catalog/products', 'edit']" type="primary" v-if="!isEditing.shipping" @click="handleEdit('shipping')">{{ lang.edit }}</button-action-authenticated>
          </div>
        </div>
        <div class="panel-body p-null" v-if="!isEditing.shipping">
          <ul class="cart-items">
            <li>
              <p>{{ lang.require_shipping }}</p>
              <span class="font-16 font-bold" v-if="product.require_shipping === 1">{{ lang.yes }}</span>
              <span class="font-16 font-bold" v-else>{{ lang.no }}</span>
            </li>
            <li class="blog-side-nest" v-if="product.require_shipping === 1">
              <p>{{ lang.product_weight }}</p>
              <!-- <p v-if="product.uom === 'g' || product.uom === 'kg' || product.uom === 'lt'">{{ lang.product_weight }}</p>
              <p v-if="product.uom === 'cm' || product.uom === 'mm' || product.uom === 'm' || product.uom === 'km'">{{ $lang[langId].product_dimension }}</p> -->
              
              <span class="font-16 font-bold" v-if="!product.weight">-</span>
              <span class="font-16 font-bold" v-else>{{ product.fweight}}</span>
            </li>
          </ul>
        </div>
        <div class="panel-body p-null" v-else>
          <ul class="cart-items">
            <li>
              <p>{{ lang.require_shipping }}</p>
              <div>
                <el-switch v-model="tmp.require_shipping" :active-value="1" :inactive-value="0"></el-switch>
                <div v-if="tmp.require_shipping === 1">
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
            </li>
            <li class="blog-side-nest" v-if="product.require_shipping === 1">
              <p>{{ lang.product_weight }}</p>
              <!-- <p v-if="product.uom === 'g' || product.uom === 'kg' || product.uom === 'lt'">{{ lang.product_weight }}</p>
              <p v-if="product.uom === 'cm' || product.uom === 'mm' || product.uom === 'm' || product.uom === 'km'">{{ $lang[langId].product_dimension }}</p> -->
              <el-input-number v-model="tmp.weight"></el-input-number> Kg
            </li>
          </ul>
        </div>
      </el-card>
    </div>

    <!-- SALE -->
    <div class="col-md-12">
      <el-card v-loading="loading" class="box-card">
        <div slot="header" class="with-border table-handler-flex">
          <h4 class="box-title" style="flex-grow: 1;">{{ lang.sales }}</h4>
          <div class="flex-container">
            <template v-if="isEditing.sale">
              <p>{{ $lang[langId].save_at }}:</p>
              <el-select v-model="storeToBeSaved" multiple collapse-tags @change="handleSelectAll">
                <el-option
                  v-for="item in outlets"
                  :key="item.store_id"
                  :label="item.name"
                  :value="item.store_id">
                </el-option>
              </el-select>
            </template>
            <el-button type="success" v-if="isEditing.sale" class="ml-4" @click="saveEdit('sale')">{{ lang.save }}</el-button>
            <el-button type="default" v-if="isEditing.sale" @click="cancelEdit('sale')">{{ lang.cancel }}</el-button>
            <button-action-authenticated :permission="['catalog/products', 'edit']" type="primary" v-if="!isEditing.sale" @click="handleEdit('sale')">{{ lang.edit }}</button-action-authenticated>
          </div>
        </div>
        <div class="panel-body p-null" v-if="!isEditing.sale">
          <ul class="cart-items">
            <li>
              <p>{{ lang.order_with_serial }}</p>
              <span class="font-16 font-bold" v-if="product.order_with_serial === 1">{{ lang.yes }}</span>
              <span class="font-16 font-bold" v-else>{{ lang.no }}</span>
            </li>
          </ul>
        </div>
        <div class="panel-body p-null" v-else>
          <ul class="cart-items">
            <li>
              <p>{{ lang.order_with_serial }}</p>
              <div>
                <el-switch v-model="tmp.order_with_serial" :active-value="1" :inactive-value="0"></el-switch>
                <div v-if="tmp.order_with_serial === 1">
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
            </li>
            <!-- <li class="blog-side-nest" v-if="product.order_with_serial === 1">
              <p>{{ lang.product_weight }}</p>
              <el-input-number v-model="tmp.weight"></el-input-number> Kg
            </li> -->
          </ul>
        </div>
      </el-card>
    </div>

    <!-- Loyalty Point -->
    <div v-if="product.has_variant === 0 && product.with_lpoint === 1" class="col-md-12">
      <el-card v-loading="loading" class="box-card">
        <div slot="header" class="with-border table-handler-flex">
          <h4 class="box-title" style="flex-grow: 1;">{{ lang.loyalty_point }}</h4>
          <div class="flex-container">
            <template v-if="isEditing.loyalty_point">
              <p>{{ $lang[langId].save_at }}:</p>
              <el-select v-model="storeToBeSaved" multiple collapse-tags @change="handleSelectAll">
                <el-option
                  v-for="item in outlets"
                  :key="item.store_id"
                  :label="item.name"
                  :value="item.store_id">
                </el-option>
              </el-select>
            </template>
            <el-button type="success" v-if="isEditing.loyalty_point" class="ml-4" @click="saveEdit('loyalty')">{{ lang.save }}</el-button>
            <el-button type="default" v-if="isEditing.loyalty_point" @click="cancelEdit('loyalty')">{{ lang.cancel }}</el-button>
            <button-action-authenticated :permission="['catalog/products', 'edit']" type="primary" v-if="!isEditing.loyalty_point" @click="handleEdit('loyalty')">{{ lang.edit }}</button-action-authenticated>
          </div>
        </div>
        <div class="panel-body p-null" v-if="!isEditing.loyalty_point">
          <ul class="cart-items">
            <li>
              <p>{{ lang.loyalty_point }}</p>
              <span class="font-16 font-bold">{{ product.loyalty_points }}</span>
            </li>
          </ul>
        </div>
        <div class="panel-body p-null" v-else>
          <ul class="cart-items">
            <li>
              <p>{{ lang.loyalty_point }}</p>
              <el-input type="number" v-model="tmp.loyalty_points"><template slot="append">point</template></el-input>
            </li>
          </ul>
        </div>
      </el-card>
    </div>

    <!-- additionalinfo -->
    <div class="col-md-12">
      <el-card v-loading="loading" class="box-card">
        <div slot="header" class="with-border table-handler-flex">
          <h4 class="box-title" style="flex-grow: 1;">{{ lang.additional_category }}</h4>
          <div class="flex-container">
            <template v-if="isEditing.additionalinfo">
              <p>{{ $lang[langId].save_at }}:</p>
              <el-select v-model="storeToBeSaved" multiple collapse-tags @change="handleSelectAll">
                <el-option
                  v-for="item in outlets"
                  :key="item.store_id"
                  :label="item.name"
                  :value="item.store_id">
                </el-option>
              </el-select>
            </template>
            <el-button type="success" v-if="isEditing.additionalinfo" class="ml-4" @click="saveEdit('additionalinfo')">{{ lang.save }}</el-button>
            <el-button type="default" v-if="isEditing.additionalinfo" @click="cancelEdit('additionalinfo')">{{ lang.cancel }}</el-button>
            <button-action-authenticated :permission="['catalog/products', 'edit']" type="primary" v-if="!isEditing.additionalinfo" @click="handleEdit('additionalinfo')">{{ lang.edit }}</button-action-authenticated>
          </div>
        </div>

        <div class="panel-body p-null" v-if="!isEditing.additionalinfo">
          <ul class="cart-items">
            <li v-if="userRole.is_pos_only !== 1">
              <p>{{ lang.categorized_as_featured }}</p>
              <span class="font-16 font-bold" v-if="product.is_featured === 1">{{ lang.yes }}</span>
              <span class="font-16 font-bold" v-else>{{ lang.no }}</span>
            </li>
            <li v-if="userRole.is_pos_only !== 1">
              <p>{{ lang.categorized_as_sale }}</p>
              <span class="font-16 font-bold" v-if="product.is_sale === 1">{{ lang.yes }}</span>
              <span class="font-16 font-bold" v-else>{{ lang.no }}</span>
            </li>
            <li v-if="userRole.is_pos_only !== 1">
              <p>{{ lang.categorized_as_preorder }}</p>
              <span class="font-16 font-bold" v-if="product.is_preorder === 1">{{ lang.yes }}</span>
              <span class="font-16 font-bold" v-else>{{ lang.no }}</span>
            </li>
            <li v-if="userRole.is_pos_only !== 1">
              <p>{{ lang.categorized_as_new_release }}</p>
              <span class="font-16 font-bold" v-if="product.is_new_release === 1">{{ lang.yes }}</span>
              <span class="font-16 font-bold" v-else>{{ lang.no }}</span>
            </li>
            <li>
              <p>{{ lang.categorized_as_popular }}</p>
              <span class="font-16 font-bold" v-if="product.is_popular === 1">{{ lang.yes }}</span>
              <span class="font-16 font-bold" v-else>{{ lang.no }}</span>
            </li>
            <li>
              <p>{{ $lang[langId].categorized_as_material }}</p>
              <span class="font-16 font-bold" v-if="product.is_raw_material === 1">{{ lang.yes }}</span>
              <span class="font-16 font-bold" v-else>{{ lang.no }}</span>
            </li>
          </ul>
        </div>

        <div class="panel-body p-null" v-else>
          <ul class="cart-items">
            <li v-if="userRole.is_pos_only !== 1">
              <p>{{ lang.categorized_as_featured }}</p>
              <div class="flex-container">
                <div class="mr-8">
                  <el-switch
                    v-model="product.is_featured"
                    :active-value="1"
                    :inactive-value="0">
                  </el-switch>
                </div>
                <div v-if="product.is_featured === 1">
                  <strong>{{ lang.yes }}</strong>
                </div>
                <div v-else>
                  <strong>{{ lang.no }}</strong>
                </div>
              </div>
            </li>
            <li v-if="userRole.is_pos_only !== 1">
              <p>{{ lang.categorized_as_sale }}</p>
              <div class="flex-container">
                <div class="mr-8">
                  <el-switch v-model="product.is_sale" :active-value="1" :inactive-value="0"></el-switch>
                </div>
                <div v-if="product.is_sale === 1">
                  <strong>{{ lang.yes }}</strong>
                </div>
                <div v-else>
                  <strong>{{ lang.no }}</strong>
                </div>
              </div>
            </li>
            <li v-if="userRole.is_pos_only !== 1">
              <p>{{ lang.categorized_as_preorder }}</p>
              <div class="flex-container">
                <div class="mr-8">
                  <el-switch v-model="product.is_preorder" :active-value="1" :inactive-value="0"></el-switch>
                </div>
                <div v-if="product.is_preorder === 1">
                  <strong>{{ lang.yes }}</strong>
                </div>
                <div v-else>
                  <strong>{{ lang.no }}</strong>
                </div>
              </div>
            </li>
            <li v-if="userRole.is_pos_only !== 1">
              <p>{{ lang.categorized_as_new_release }}</p>
              <div class="flex-container">
                <div class="mr-8">
                  <el-switch v-model="product.is_new_release" :active-value="1" :inactive-value="0"></el-switch>
                </div>
                <div v-if="product.is_new_release === 1">
                  <strong>{{ lang.yes }}</strong>
                </div>
                <div v-else>
                  <strong>{{ lang.no }}</strong>
                </div>
              </div>
            </li>
            <li>
              <p>{{ lang.categorized_as_popular }}</p>
              <div class="flex-container">
                <div class="mr-8">
                  <el-switch v-model="product.is_popular" :active-value="1" :inactive-value="0"></el-switch>
                </div>
                <div v-if="product.is_popular === 1">
                  <strong>{{ lang.yes }}</strong>
                </div>
                <div v-else>
                  <strong>{{ lang.no }}</strong>
                </div>
              </div>
            </li>
            <li>
              <p>{{ $lang[langId].categorized_as_material }}</p>
              <div class="flex-container">
                <div class="mr-8">
                  <el-switch v-model="product.is_raw_material" :active-value="1" :inactive-value="0"></el-switch>
                </div>
                <div v-if="product.is_raw_material === 1">
                  <strong>{{ lang.yes }}</strong>
                </div>
                <div v-else>
                  <strong>{{ lang.no }}</strong>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </el-card>
    </div>

    <!-- description -->
    <div v-if="userRole.is_pos_only !== 1 || selectedStore.active_online_order === 1" class="col-md-12">
      <el-card v-loading="loading" class="box-card">
        <div slot="header" class="with-border table-handler-flex">
          <h4 class="box-title" style="flex-grow: 1;">{{ lang.description }}</h4>
          <div class="flex-container">
            <template v-if="isEditing.description">
              <p>{{ $lang[langId].save_at }}:</p>
              <el-select v-model="storeToBeSaved" multiple collapse-tags @change="handleSelectAll">
                <el-option
                  v-for="item in outlets"
                  :key="item.store_id"
                  :label="item.name"
                  :value="item.store_id">
                </el-option>
              </el-select>
            </template>
            <el-button type="success" v-if="isEditing.description" class="ml-4" @click="saveEdit('description')">{{ lang.save }}</el-button>
            <el-button type="default" v-if="isEditing.description" @click="cancelEdit('description')">{{ lang.cancel }}</el-button>
            <button-action-authenticated :permission="['catalog/products', 'edit']" type="primary" v-if="!isEditing.description" @click="handleEdit('description')">{{ lang.edit }}</button-action-authenticated>
          </div>
        </div>
        <div class="panel-body p-null" v-if="!isEditing.description">
          <span class="font-16 font-bold" v-if="!product.description">-</span>
          <p v-else class="desc-product show-white-space">{{product.description}}</p>
        </div>
        <div class="panel-body p-null" v-else>
          <el-input type="textarea" autosize v-model="product.description"></el-input>
        </div>
      </el-card>
    </div>

    <!--  seo -->
    <div v-if="userRole.is_pos_only !== 1" class="col-md-12">
      <el-card v-loading="loading" class="box-card">
        <div slot="header" class="with-border table-handler-flex">
          <h4 class="box-title" style="flex-grow: 1;">{{ lang.seo }}</h4>
          <div class="flex-container">
            <template v-if="isEditing.seo">
              <p>{{ $lang[langId].save_at }}:</p>
              <el-select v-model="storeToBeSaved" multiple collapse-tags @change="handleSelectAll">
                <el-option
                  v-for="item in outlets"
                  :key="item.store_id"
                  :label="item.name"
                  :value="item.store_id">
                </el-option>
              </el-select>
            </template>
            <el-button type="success" v-if="isEditing.seo" class="ml-4" @click="saveEdit('seo')">{{ lang.save }}</el-button>
            <el-button type="default" v-if="isEditing.seo" @click="cancelEdit('seo')">{{ lang.cancel }}</el-button>
            <button-action-authenticated :permission="['catalog/products', 'edit']" type="primary" v-if="!isEditing.seo" @click="handleEdit('seo')">{{ lang.edit }}</button-action-authenticated>
          </div>
        </div>
        <div class="panel-body p-null" v-if="!isEditing.seo">
          <ul class="cart-items">
            <li>
              <p>{{ lang.meta_keywords }}</p>
              <span class="font-16 font-bold" v-if="!product.meta_keywords">-</span>
              <span class="font-16 font-bold" v-else>{{product.meta_keywords}}</span>
            </li>
            <li>
              <p>{{ lang.meta_description }}</p>
              <span class="font-16 font-bold" v-if="!product.meta_description">-</span>
              <span class="font-16 font-bold" v-else>{{product.meta_description}}</span>
            </li>
          </ul>
        </div>
        <div class="panel-body p-null" v-else>
          <ul class="cart-items">
            <li>
              <p>{{ lang.meta_keywords }}</p>
              <el-input
                v-model="tmp.meta_keyword"
                @keyup.enter.native="handleAddMetaKeyword"
              />

              <p class="wrapper-tags">
                <el-tag
                  v-for="(item, key) in tmp.meta_keywords"
                  :key="key"
                  closable
                  @close="handleRemoveMetaKeyword(key)">
                  {{ item }}
                </el-tag>
              </p>
            </li>
            <li>
              <p>{{ lang.meta_description }}</p>
              <el-input type="textarea" v-model="product.meta_description"></el-input>
            </li>
          </ul>
        </div>
      </el-card>
    </div>

    <!-- publish -->
    <div class="col-md-12">
      <el-card v-loading="loading" class="box-card">
        <div slot="header" class="with-border table-handler-flex">
          <h4 class="box-title" style="flex-grow: 1;">{{ lang.publish }}</h4>
          <div class="flex-container">
            <template v-if="isEditing.publish">
              <p>{{ $lang[langId].save_at }}:</p>
              <el-select v-model="storeToBeSaved" multiple collapse-tags @change="handleSelectAll">
                <el-option
                  v-for="item in outlets"
                  :key="item.store_id"
                  :label="item.name"
                  :value="item.store_id">
                </el-option>
              </el-select>
            </template>
            <el-button type="success" v-if="isEditing.publish" class="ml-4" @click="saveEdit('publish')">{{ lang.save }}</el-button>
            <el-button type="default" v-if="isEditing.publish" @click="cancelEdit('publish')">{{ lang.cancel }}</el-button>
            <button-action-authenticated :permission="['catalog/products', 'edit']" type="primary" v-if="!isEditing.publish" @click="handleEdit('publish')">{{ lang.edit }}</button-action-authenticated>
          </div>
        </div>
        <div class="panel-body p-null">
          <ul class="cart-items">
            <li>
              <div class="flex-container">
                <div class="mr-8">
                  <el-checkbox
                    v-model="product.published"
                    :disabled="!isEditing.publish"
                    :true-label="1"
                    :false-label="0">
                  </el-checkbox>
                </div>
                {{ lang.ready_to_publish_for_sale }}
              </div>
              <p class="desc-check">{{ lang.info_publish_for_sale }}</p>
              <div v-if="product.published === 1" style="padding-left: 20px; margin-top: 20px">
                <p>{{ lang.start_sale_date }}</p>
                <el-date-picker v-model="product.published_date" type="date" format="dd-MM-yyyy" value-format="yyyy-MM-dd" :placeholder="$lang[langId].pick_a_day">
                </el-date-picker>
              </div>
            </li>
            <li class="blog-side-nest">
              <div class="flex-container">
                <div class="mr-8">
                  <el-checkbox
                    v-model="product.pos_hidden"
                    :disabled="!isEditing.publish"
                    :true-label="1"
                    :false-label="0"
                  />
                </div>
                {{ lang.hide_in_pos }}
              </div>
              <p class="desc-check">{{ lang.info_hide_in_pos }}</p>
            </li>
          </ul>
        </div>
      </el-card>
    </div>

    <!-- notes -->
    <div class="col-md-12">
      <el-card v-loading="loading" class="box-card">
        <div slot="header" class="with-border table-handler-flex">
          <h4 class="box-title" style="flex-grow: 1;">{{ lang.notes }}</h4>
          <div class="flex-container">
            <template v-if="isEditing.notes">
              <p>{{ $lang[langId].save_at }}:</p>
              <el-select v-model="storeToBeSaved" multiple collapse-tags @change="handleSelectAll">
                <el-option
                  v-for="item in outlets"
                  :key="item.store_id"
                  :label="item.name"
                  :value="item.store_id">
                </el-option>
              </el-select>
            </template>
            <el-button type="success" v-if="isEditing.notes" class="ml-4" @click="saveEdit('notes')">{{ lang.save }}</el-button>
            <el-button type="default" v-if="isEditing.notes" @click="cancelEdit('notes')">{{ lang.cancel }}</el-button>
            <button-action-authenticated :permission="['catalog/products', 'edit']" type="primary" v-if="!isEditing.notes" @click="handleEdit('notes')">{{ lang.edit }}</button-action-authenticated>
          </div>
        </div>
        <div class="panel-body p-null" v-if="!isEditing.notes">
          <ul class="cart-items">
            <li>
              <p>{{ $lang[langId].notes_product_detail }}</p>
              <span class="font-16 font-bold" v-if="!product.notes">-</span>
              <span class="font-16 font-bold" v-else>{{product.notes}}</span>
            </li>
          </ul>
        </div>
        <div class="panel-body p-null" v-else>
          <ul class="cart-items">
            <li>
              <p>{{ $lang[langId].notes_product_detail }}</p>
              <el-input
                v-model="tmp.notes" />
            </li>
          </ul>
        </div>
      </el-card>
    </div>

    <!-- delete product -->
    <div class="col-md-4 pull-right text-right">
      <button-action-authenticated :permission="['catalog/products', 'destroy']" type="danger" @click="dialog.deleteProduct = true" icon="el-icon-delete">{{ $lang[langId].delete }} {{ lang.product }}</button-action-authenticated>
    </div>

    <!-- dialog delete product -->
    <el-dialog
      title="Confirm"
      :visible.sync="dialog.deleteProduct"
      width="340px">
      <span>{{ $lang[langId].are_you_want_remove }} {{ lang.product }} <strong>{{ product.name }}</strong> & {{ $lang[langId].all_variant }}?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.deleteProduct = false">{{ lang.cancel }}</el-button>
        <el-button type="primary" @click="deleteProduct">{{ lang.yes }}, {{ $lang[langId].delete }} {{ lang.product }}</el-button>
      </span>
    </el-dialog>

    <!-- dialog buy-prices -->
    <el-dialog
      :title="$lang[langId].stock_incoming"
      :visible.sync="dialog.productBuyPrices"
      custom-class="mw-760">
      <div class="table-handler-flex">
        <div style="flex-grow: 1;">
          <el-select
            v-model="params.per_page"
            @change="handleSizeChange"
            filterable
            :placeholder="lang.please_select"
            size="small">
            <el-option
              v-for="item in pages"
              :key="item.value"
              :label="item.label + lang.rows"
              :value="item.value"
            />
          </el-select>
        </div>
        <div >
          <el-input
            v-model="params.search"
            :placeholder="$lang[langId].product_sku"
            clearable
            prefix-icon="el-icon-search"
            size="small"
            class="inline-form"
            @change="handleSearch">
          </el-input>
        </div>
      </div>
      <el-table
        :data="productBuyPrices"
        stripe v-loading="loading">
        <el-table-column
          :label="lang.incoming_stock"
          prop="trans_no"
          sortable min-width="160">
          <template slot-scope="props">
            <router-link
              :to="'/inventory/stocksincoming/' + props.row.id"
              target="_blank">
              {{ props.row.trans_no }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column :label="lang.created_time" prop="fdate" sortable min-width="160">
          <template slot-scope="props">
            <div v-if="!props.row.fdate">-</div>
            <div v-else>{{ props.row.fdate}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="lang.supplier" prop="supplier_name" sortable min-width="140">
          <template slot-scope="props">
            <div v-if="!props.row.supplier_name">-</div>
            <div v-else>{{ props.row.supplier_name}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="lang.variant" prop="product_variant_name" sortable min-width="120">
          <template slot-scope="props">
            <div v-if="!props.row.product_variant_name">-</div>
            <div v-else>{{ props.row.product_variant_name}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="lang.qty" prop="qty" sortable>
          <template slot-scope="props">
            <div v-if="!props.row.qty">-</div>
            <div v-else>{{ props.row.qty}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="lang.buy_price" prop="buy_price" sortable min-width="120">
          <template slot-scope="props">
            <div v-if="!props.row.fbuy_price">-</div>
            <div v-else>{{ props.row.fbuy_price}}</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="margin-top: 12px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="params.currentPage"
          :page-size="params.per_page"
          layout="total, prev, pager, next, jumper"
          :total="params.total">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import axios from 'axios'
import { baseApi } from 'src/http-common'
import editProfile from '../edit/Profile'
import InputMoney from '@/components/InputMoneyV2'
import BsCarousel from '@/components/BsCarousel'
// import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
// import 'swiper/css/swiper.css'

var moment = require('moment')
const dateNow = moment().format('YYYY-MM-DD')

export default {
  name: 'DetailProfile',
  components: {
    editProfile,
    InputMoney,
    BsCarousel
  },

  mixins: [basicComputedMixin],

  data() {
    return {
      product: {},
      newPhoto: [],
      dialog: {
        deleteProduct: false,
        productBuyPrices: false
      },
      tmp: {
        meta_keyword: ''
      },
      uoms: [
        {
          label: 'Milimeter',
          value: 'mm'
        },
        {
          label: 'Centimeter',
          value: 'cm'
        },
        {
          label: 'Meter',
          value: 'm'
        },
        {
          label: 'Kilometer',
          value: 'km'
        },
        {
          label: 'Gram',
          value: 'g'
        },
        {
          label: 'Kilogram',
          value: 'kg'
        },
        {
          label: 'Liter',
          value: 'lt'
        }
      ],
      loading: true,
      checked: false,
      isEditing: {
        profile: false,
        price: false,
        inventory: false,
        shipping: false,
        additionalinfo: false,
        description: false,
        seo: false,
        publish: false,
        loyalty_point: false,
        sale: false,
        notes: false
      },
      productBuyPrices: [],
      loadingProductPrices: false,
      params: {
        per_page: 10,
        search: '',
        sort_type: 'desc',
        sort_column: 'date'
      },
      pages: [
        {
          value: 10,
          label: '10 '
        },
        {
          value: 25,
          label: '25 '
        },
        {
          value: 50,
          label: '50 '
        },
        {
          value: 100,
          label: '100 '
        }
      ],
      swiperOption: {
        autoHeight: true, //enable auto height
        spaceBetween: 20,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },
      visibleMoreDetail: false,
      storeToBeSaved: []
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
  },

  mounted() {
    this.loadData()
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

        this.$set(this.product, 'collection_names', [])
        if (this.product.collections.length > 0) {
          this.product.collections.map(item => {
            this.product.collection_names.push(item.name)
          })
        }

        if (this.product.photos.length > 0) {
          this.newPhoto = this.product.photos.map((item, idx, array) => {
            item.url = item.photo_md
            item.name = item.title
            return item
          })
        }

        if (this.product.published_date === '0000-00-00') {
          this.product.published_date = dateNow
        }

        this.tmp = response.data.data
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

    deleteProduct() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'product/' + this.$route.params.id),
        headers: headers
      }).then(response => {
        this.loading = false
        this.$message({
          message: response.data.data.message,
          type: 'success'
        })
        this.dialog.deleteProduct = false
        this.$router.push({path: '/catalog/product/'})
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

    updateData(data, block) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'product/' + this.$route.params.id),
        data: data,
        headers: headers
      }).then(response => {
        this.product = response.data.data
        this.tmp = response.data.data
        this.loading = false
        this.newPhoto = []
        this.cancelEdit(block)
      }).catch(error => {
        this.loading = false
        this.$notify({
          title: error.message,
          type: 'warning',
          message: error.string
        })
        this.cancelEdit(block)
      })
    },

    handleEdit(block) {
      if (this.storeToBeSaved.length === 0) {
        this.storeToBeSaved = [this.selectedStore.store_id]
      }
      if (block === 'profile') {
        this.isEditing.profile = true
      } else if (block === 'price') {
        this.tmp.buy_price = parseFloat(this.tmp.buy_price)
        this.tmp.sell_price = parseFloat(this.tmp.sell_price)
        this.tmp.sell_price_pos = parseFloat(this.tmp.sell_price_pos)
        this.tmp.market_price = parseFloat(this.tmp.market_price)
        this.tmp.comission = parseFloat(this.tmp.comission)
        this.isEditing.price = true
      } else if (block === 'inventory') {
        this.isEditing.inventory = true
      } else if (block === 'inventory_outlet') {
        this.isEditing.inventory_outlet = true
      } else if (block === 'shipping') {
        this.isEditing.shipping = true
      } else if (block === 'loyalty') {
        this.tmp.loyalty_points = parseFloat(this.product.loyalty_points)
        this.isEditing.loyalty_point = true
      } else if (block === 'additionalinfo') {
        this.isEditing.additionalinfo = true
      } else if (block === 'description') {
        this.isEditing.description = true
      } else if (block === 'seo') {
        this.isEditing.seo = true
        this.tmp.meta_keywords = this.tmp.meta_keywords.split(',')
      } else if (block === 'publish') {
        this.isEditing.publish = true
      } else if (block === 'sale') {
        this.isEditing.sale = true
      } else if (block === 'notes') {
        this.isEditing.notes = true
      }
    },
    cancelEdit(block) {
      this.storeToBeSaved = []
      if (block === 'profile') {
        this.isEditing.profile = false
        if (this.product.photos.length > 0) {
          this.newPhoto = this.product.photos.map((item, idx, array) => {
            item.url = item.photo_md
            item.name = item.title
            return item
          })
        }
      } else if (block === 'profilephoto') {
        if (this.product.photos.length > 0) {
          this.newPhoto = this.product.photos.map((item, idx, array) => {
            item.url = item.photo_md
            item.name = item.title
            return item
          })
        }
      } else if (block === 'price') {
        this.isEditing.price = false
      } else if (block === 'inventory') {
        this.isEditing.inventory = false
      } else if (block === 'inventory_outlet') {
        this.isEditing.inventory_outlet = false
      } else if (block === 'shipping') {
        this.isEditing.shipping = false
      } else if (block === 'loyalty') {
        this.isEditing.loyalty_point = false
      } else if (block === 'additionalinfo') {
        this.isEditing.additionalinfo = false
      } else if (block === 'description') {
        this.isEditing.description = false
      } else if (block === 'seo') {
        this.isEditing.seo = false
        // this.tmp.meta_keywords = this.tmp.meta_keywords.join(',')
      } else if (block === 'publish') {
        this.isEditing.publish = false
      } else if (block === 'sale') {
        this.isEditing.sale = false
      } else if (block === 'notes') {
        this.isEditing.notes = false
      }
      this.loadData()
    },

    saveEdit(block) {
      console.log('block', block)
      let to_store_id = this.selectedStore.store_id
      let to_allstore_id = 0
      // if (this.saveToAllAccessStore.includes(this.selectedStore.url_id)) {
        if (this.storeToBeSaved.length && this.storeToBeSaved[0] === 0) {
          to_allstore_id = 1
        } else if (this.storeToBeSaved.length) {
          to_store_id = this.storeToBeSaved.join(',')
        }
      // }

      if (block === 'profile') {
        let data = {
          to_allstore_id,
          to_store_id,
          product: {
            name: this.product.name,
            sku: this.product.sku,
            product_group_name: this.product.product_group_name,
            product_group_id: this.product.product_group_id,
            collection_names: this.product.collection_names.join(','),
            brand_name: this.product.brand_name,
            condition_id: this.product.condition_id,
            non_taxable: this.product.non_taxable
          }
        }
        if (this.newPhoto.length > 0) {
          this.$set(data, 'file', this.newPhoto)
        } else {
          this.$set(data, 'file', this.newPhoto)
        }
        this.updateData(data, block)
      } else if (block === 'profilephoto') {
        let data = {
          to_allstore_id,
          to_store_id,
          product: {
            name: this.product.name,
            sku: this.product.sku,
            product_group_name: this.product.product_group_name,
            product_group_id: this.product.product_group_id,
            collection_names: this.product.collection_names.join(','),
            brand_name: this.product.brand_name,
            condition_id: this.product.condition_id,
            non_taxable: this.product.non_taxable
          }
        }
        if (this.newPhoto.length > 0) {
          this.$set(data, 'file', this.newPhoto)
        }
        this.updateData(data, block)
      } else if (block === 'price') {
        let data = {
          to_allstore_id,
          to_store_id,
          product: {
            market_price: this.tmp.market_price,
            sell_price: this.tmp.sell_price === null ? 0 : this.tmp.sell_price,
            sell_price_pos: this.tmp.sell_price_pos,
            buy_price: this.tmp.buy_price,
            min_order: this.tmp.min_order,
            max_order: this.tmp.max_order,
            comission: this.tmp.comission,
            pos_sell_price_dynamic: this.tmp.pos_sell_price_dynamic,
            collection_names: this.tmp.collection_names.join(','),
            is_comission_percentage: this.tmp.is_comission_percentage
          }
        }
        this.updateData(data, block)
      } else if (block === 'inventory') {
        let data = {
          to_allstore_id,
          to_store_id,
          product: {
            track_inventory: this.tmp.track_inventory,
            uom: this.tmp.uom,
            low_stock_alert: this.tmp.low_stock_alert,
            hold_qty: this.tmp.hold_qty,
            is_out_stock: this.tmp.is_out_stock,
            collection_names: this.tmp.collection_names.join(',')
          }
        }
        this.updateData(data, block)
      } else if (block === 'shipping') {
        let data = {
          to_allstore_id,
          to_store_id,
          product: {
            require_shipping: this.tmp.require_shipping,
            weight: this.tmp.weight,
            collection_names: this.tmp.collection_names.join(',')
          }
        }
        this.updateData(data, block)
      } else if (block === 'additionalinfo') {
        let data = {
          to_allstore_id,
          to_store_id,
          product: {
            is_featured: this.product.is_featured,
            is_sale: this.product.is_sale,
            is_preorder: this.product.is_preorder,
            is_new_release: this.product.is_new_release,
            is_popular: this.product.is_popular,
            is_raw_material: this.product.is_raw_material,
            collection_names: this.tmp.collection_names.join(',')
          }
        }
        this.updateData(data, block)
      } else if (block === 'description') {
        let data = {
          to_allstore_id,
          to_store_id,
          product: {
            description: this.product.description,
            collection_names: this.tmp.collection_names.join(',')
          }
        }
        this.updateData(data, block)
      } else if (block === 'seo') {
        let meta = this.product.meta_keywords.join(',')
        let data = {
          to_allstore_id,
          to_store_id,
          product: {
            meta_keywords: meta,
            meta_description: this.product.meta_description,
            collection_names: this.tmp.collection_names.join(',')
          }
        }
        this.updateData(data, block)
      } else if (block === 'publish') {
        let data = {
          to_allstore_id,
          to_store_id,
          product: {
            published: this.product.published,
            published_date: this.product.published_date,
            pos_hidden: this.product.pos_hidden,
            collection_names: this.tmp.collection_names.join(',')
          }
        }
        this.updateData(data, block)
      } else if (block === 'loyalty') {
        let data = {
          to_allstore_id,
          to_store_id,
          product: {
            loyalty_points: this.tmp.loyalty_points,
            collection_names: this.tmp.collection_names.join(',')
          }
        }
        this.updateData(data, block)
      } else if (block === 'sale') {
        let data = {
          to_allstore_id,
          to_store_id,
          product: {
            order_with_serial: this.tmp.order_with_serial,
            collection_names: this.tmp.collection_names.join(',')
          }
        }
        this.updateData(data, block)
      } else if (block === 'notes') {
        let data = {
          to_allstore_id,
          to_store_id,
          product: {
            notes: this.tmp.notes,
            collection_names: this.tmp.collection_names.join(',')
          }
        }
        this.updateData(data, block)
      }
    },

    handleAddMetaKeyword() {
      this.tmp.meta_keywords.push(this.tmp.meta_keyword)
      this.tmp.meta_keyword = ''
    },

    handleRemoveMetaKeyword(key) {
      this.tmp.meta_keywords.splice(key, 1)
    },

    async getPriceDetail() {
      this.loadingProductPrices = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      const url = baseApi(this.selectedStore.url_id, this.langId, 'productbuyprices/' + this.$route.params.id)

      await axios({
        method: 'GET',
        url: url,
        headers: headers,
        params: this.params
      }).then(response => {
        this.productBuyPrices = response.data.data
        this.params.total = response.data.meta.total
      }).catch(() => {
        this.productBuyPrices = []
        this.params.total = 0
      })
      this.loadingProductPrices = false
      this.dialog.productBuyPrices = true
    },

    handleSizeChange(val) {
      this.params.per_page = val
      this.getPriceDetail()
    },
    handleSearch(val) {
      this.params.search = val
      this.getPriceDetail()
    },
    handleCurrentChange(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getPriceDetail()
    },

    removePhoto (file) {
      this.newPhoto = file
    },

    handleUpdatePhoto (file) {
      this.newPhoto = file
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

    handleMatchDiscount () {
      let disc = 0
      let price = this.tmp.sell_price_pos
      if (this.tmp.is_comission_percentage === 1) {
        disc = (this.tmp.comission/price) * 100
      }
      if (this.tmp.is_comission_percentage === 0) {
        disc = (this.tmp.comission/100) * price
      }
      this.tmp.comission = disc
      // console.log('disc', disc)
    },
  }
}
</script>
