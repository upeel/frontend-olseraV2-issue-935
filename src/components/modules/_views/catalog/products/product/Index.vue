<template>
  <div>
    <div class="main-content">
      <div class="table-handler-flex">
        <div class="flex-grow-1">
          <h4 class="main-content__title">{{ $lang[langId].product_list }}</h4>
          <p class="main-content__subtitle">{{ params.total }} {{ lang.product }}</p>
        </div>

        <div>
          <button-action-authenticated
            :permission="['catalog/products', 'store']"
            :disabled="methodFeatureNameIsHidden('product-import')"
            :class="methodRouteIsHiddenButtonClass('product-import')"
            type="default"
            @click="importDialog = true">
            {{ lang.import }}
          </button-action-authenticated>

          <button-action-authenticated
            :disabled="methodFeatureNameIsHidden('product-copy')"
            :permission="['catalog/products', 'store']"
            :class="methodRouteIsHiddenButtonClass('product-copy')"
            @click="copyDialogList(false)">
            {{ $lang[langId].copy_product }}
          </button-action-authenticated>

          <el-dropdown @command="handleClick">
            <el-button :loading="loadingExport" type="primary">
              Export Excel<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown" style="overflow-y: scroll; height: 300px">
              <el-dropdown-item v-for="item in labelRow" :key="item.key" :command ="item">{{ lang.rows }} {{ item.value }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <router-link :to="{ path: '/catalog/product/create' }">
            <button-action-authenticated
              :permission="['catalog/products', 'store']"
              type="success"
              icon="el-icon-plus">
              {{ lang.add }}
            </button-action-authenticated>
          </router-link>
        </div>
      </div>

      <div class="table-handler-flex sticky-top-has-submenu">
        <div class="mb-12" style="flex-grow: 1;">
          <el-button
            v-if="selectedStore.multi_delete_product"
            :disabled="IsDelBtnDisabled"
            type="text"
            class="bulk-delete"
            icon="el-icon-delete"
            @click="dialogDeleteProducts = true"
          />
          <el-select
            v-model="params.per_page"
            :placeholder="lang.please_select"
            filterable
            size="small"
            @change="handleSizeChange">
            <el-option
              v-for="item in pages"
              :key="item"
              :value="item"
              :label="item + ' ' + lang.rows"
            />
          </el-select>
        </div>

        <div class="mb-12">
          <el-input
            v-model="params.search"
            :placeholder="$lang[langId].product_sku"
            clearable
            prefix-icon="el-icon-search"
            size="small"
            class="inline-form input-search"
            @change="handleSearch">
          </el-input>

          <el-button
            type="info"
            @click="visibleDialogFilter = true"
            size="small"
            class="button-filter"
            icon="el-icon-sort">
            {{ $lang[langId].filter }}
          </el-button>
        </div>
      </div>

      <div
        v-if="params.filter_name.brand || params.filter_name.category || params.filter_name.collection"
        class="text-right">
        <span>{{ $lang[langId].filter }} :</span>
        <el-tag v-if="params.filter_name.brand" closable @close="removeFilter('brand')">
          {{ params.filter_name.brand }}
        </el-tag>
        <el-tag v-if="params.filter_name.category" closable @close="removeFilter('category')">
          {{ params.filter_name.category }}
        </el-tag>
        <el-tag v-if="params.filter_name.collection" closable @close="removeFilter('collection')">
          {{ params.filter_name.collection }}
        </el-tag>
        <el-popover
          placement="top"
          width="220"
          v-model="visibleClear">
          <p>Are you sure to clear all filter?</p>
          <div style="text-align: right; margin: 0">
            <el-button type="text" @click="visibleClear = false">cancel</el-button>
            <el-button type="primary" @click="clearAllFilter">confirm</el-button>
          </div>
          <el-button slot="reference" type="text" class="color-danger" icon="el-icon-delete-solid"></el-button>
        </el-popover>
      </div>

      <hr/>

      <el-table
        ref="multipleTable"
        v-loading="loading"
        v-if="lang.photo"
        :data="dataProducts"
        :default-sort="{prop: 'id', order: 'ascending'}"
        stripe
        border
        class="product-table-max-height vertical-align-top mobile-fix-height-unset"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange">
        <el-table-column
          v-if="selectedStore.multi_delete_product"
          type="selection"
          width="40"
          fixed
          class-name="text-center"
        />

        <el-table-column :label="lang.photo" class-name="text-center" min-width="80px">
          <template slot-scope="props">
            <router-link
              :to="{ name: 'Product Detail', params: { id: props.row.id }}">
              <el-image
                v-if="props.row.photo_xs"
                :src="props.row.photo_xs"
                fit="cover"
                style="width: 50px; height: 50px; border-radius: 50%;"
              />
            </router-link>
          </template>
        </el-table-column>

        <el-table-column :label="lang.product_name" prop="name" sortable min-width="150px">
          <template slot-scope="props">
            <el-row>
              <router-link :to="{ name: 'Product Detail', params: { id: props.row.id }}">
                <strong>{{ props.row.name }}</strong>
              </router-link>
              <p>{{ props.row.klasifikasi }}</p>
              <p>{{ props.row.sku }}</p>
            </el-row>
          </template>
        </el-table-column>

        <el-table-column :label="lang.sku" prop="sku" sortable min-width="100">
          <template slot-scope="scope">
            <template
              v-if="scope.row.variants.length">
              <div
                v-for="(item, key) in scope.row.variants"
                :key="key"
                class="overflow-ellipsis">
                {{ item.sku }}
              </div>
            </template>
            <template v-else>
              <div class="overflow-ellipsis">
                {{ scope.row.sku }}
              </div>
            </template>
          </template>
        </el-table-column>

        <el-table-column :label="lang.variants" prop="variants" min-width="120">
          <template slot-scope="scope">
            <template
              v-if="scope.row.variants.length">
              <div
                v-for="(item, key) in scope.row.variants"
                :key="key"
                class="overflow-ellipsis">
                {{ item.name }}
              </div>
            </template>
          </template>
        </el-table-column>

        <el-table-column
          :label="lang.stock_qty"
          prop="stock_qty"
          sortable="custom"
          min-width="120px">
          <template slot-scope="scope">
            <div
              v-if="scope.row.variants.length > 0">
              <div
                v-for="(item, key) in scope.row.variants"
                :key="key">
                <!-- {{ item.stock_qty }} -->
                <div v-if="scope.row.track_inventory === 1">
                  <div class="pointer"
                    v-if="item.hold_qty !== '0'"
                    @click="showHold(scope.row, true, item)">
                    <span class="color-primary--strong">
                      {{ item.stock_qty }} ({{item.hold_qty}})
                    </span>
                  </div>
                  <div v-else>
                    <span v-if="parseInt(scope.row.low_stock_alert) >= parseInt(item.stock_qty) || item.stock_qty === '0' " class="color-warning--bg p-2 radius-2 color-white font-bold">
                      {{ item.stock_qty }}
                    </span>
                    <span v-else>
                      {{ item.stock_qty }}
                    </span>
                  </div>
                </div>
                <div v-else>Unlimited</div>
                <div
                  v-if="item.is_out_stock === 1 && parseInt(item.stock_qty) === 0"
                  class="color-info font-12">
                  {{ lang.out_of_stock }}
                </div>
              </div>
            </div>
            <div v-else>
              <div v-if="scope.row.track_inventory === 1">
                <div class="pointer"
                  v-if="scope.row.hold_qty !== '0'"
                  @click="showHold(scope.row, false)">
                  <span class="color-primary--strong">
                    {{ scope.row.stock_qty }} ({{scope.row.hold_qty}})
                  </span>
                </div>
                <div v-else>
                  <span v-if="parseInt(scope.row.low_stock_alert) >= parseInt(scope.row.stock_qty) || scope.row.stock_qty === '0' " class="color-warning--bg p-2 radius-2 color-white font-bold">
                    {{ scope.row.stock_qty }}
                  </span>
                  <span v-else>
                    {{ scope.row.stock_qty }}
                  </span>
                </div>
              </div>
              <div v-else>Unlimited</div>
              <div
                v-if="scope.row.is_out_stock === 1 && parseInt(scope.row.stock_qty) === 0"
                class="color-info font-12">
                {{ lang.out_of_stock }}
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          v-if="!selectedStore.is_hide_buy_price"
          :label="lang.buy_price"
          prop="buy_price"
          min-width="120px">
          <template slot-scope="scope">
            <template v-if="scope.row.variants.length">
              <inline-edit-price
                v-for="(item, key) in scope.row.variants"
                :loading="loadingUpdatePrice"
                :key="key"
                :amount="item.buy_price"
                :item-id="item.id"
                :parent-id="scope.row.id"
                type="variant-buy-price"
                @update="handleUpdatePrice($event, key, scope.$index)"
              />
            </template>
            <template v-else>
              <inline-edit-price
                :loading="loadingUpdatePrice"
                :amount="scope.row.buy_price"
                :item-id="scope.row.id"
                :additional-data="scope.row"
                type="product-buy-price"
                @update="handleUpdatePrice($event, scope.$index)"
              />
            </template>
          </template>
        </el-table-column>

        <el-table-column
          :label="lang.selling_price_in_store"
          prop="sell_price_pos"
          sortable="custom"
          min-width="120px">
          <template slot-scope="scope">
            <template v-if="scope.row.variants.length">
              <inline-edit-price
                v-for="(item, key) in scope.row.variants"
                :loading="loadingUpdatePrice"
                :key="key"
                :amount="item.sell_price_pos"
                :item-id="item.id"
                :parent-id="scope.row.id"
                type="variant-sell-price-pos"
                @update="handleUpdatePrice($event, key, scope.$index)"
              />
            </template>
            <template v-else>
              <inline-edit-price
                :loading="loadingUpdatePrice"
                :amount="scope.row.sell_price_pos"
                :item-id="scope.row.id"
                :additional-data="scope.row"
                type="product-sell-price-pos"
                @update="handleUpdatePrice($event, scope.$index)"
              />
            </template>
          </template>
        </el-table-column>

        <el-table-column
          :label="lang.selling_price_online"
          prop="sell_price"
          sortable="custom"
          min-width="120px">
          <template slot-scope="scope">
            <template v-if="scope.row.variants.length">
              <inline-edit-price
                v-for="(item, key) in scope.row.variants"
                :loading="loadingUpdatePrice"
                :key="key"
                :amount="item.sell_price"
                :item-id="item.id"
                :parent-id="scope.row.id"
                type="variant-sell-price"
                @update="handleUpdatePrice($event, key, scope.$index)"
              />
            </template>
            <template v-else>
              <inline-edit-price
                :loading="loadingUpdatePrice"
                :amount="scope.row.sell_price"
                :item-id="scope.row.id"
                :additional-data="scope.row"
                type="product-sell-price"
                @update="handleUpdatePrice($event, scope.$index)"
              />
            </template>
          </template>
        </el-table-column>

        <el-table-column
          :label="$lang[langId].published"
          prop="published"
          sortable
          min-width="100px">
          <template slot-scope="scope">
            <!-- <el-tag v-if="scope.row.published === 1" type="success" class="tag-block">
              {{ $lang[langId].published }}
            </el-tag> -->
            <div v-if="scope.row.published === 1">
              {{ scope.row.published_date }}
            </div>
            <el-tag v-else type="warning" class="tag-block">
              {{ $lang[langId].unpublished }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          fixed="right"
          align="center"
          width="40px">
          <template slot-scope="scope">
            <el-dropdown trigger="click">
              <el-button type="text" icon="el-icon-more" style="color:#909399"></el-button>
              <el-dropdown-menu slot="dropdown" style="background-color: #F2F2F2;">
                <router-link
                  v-if="checkCustomPermission('catalog/products', 'store')"
                  :to="{ name: 'Product Copy', params: { id: scope.row.id, copy: true }}">
                  <el-dropdown-item>
                    <el-button type="text" style="color: #000000">
                      <svg-icon icon-class="file-text"></svg-icon>
                      {{ $lang[langId].copy }}
                    </el-button>
                  </el-dropdown-item>
                </router-link>
                <router-link
                  v-if="checkCustomPermission('catalog/products', 'show')"
                  :to="{ name: 'Product Detail', params: { id: scope.row.id }}">
                  <el-dropdown-item>
                    <el-button type="text" style="color: #000000">
                      <svg-icon icon-class="file-text"></svg-icon>
                      {{ $lang[langId].detail }}
                    </el-button>
                  </el-dropdown-item>
                </router-link>
                <el-dropdown-item
                  v-if="checkCustomPermission('catalog/products', 'destroy')">
                  <el-button type="text" class="full-width text-left" style="color: #FF0000" @click="deleteRow(scope.row)">
                    <svg-icon icon-class="trash" stroke="#FF0000"></svg-icon>
                    {{ $lang[langId].delete }}
                  </el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        :params="params"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog
      :visible.sync="visibleDialogFilter"
      class="text-left">
      <el-form :model="form">
        <el-form-item v-loading="loadingSelectCategory" :label="lang.category" :label-width="formLabelWidth">
          <select-grouped-product-category
            ref="selectGroupedProductCategory"
            :allow-create="false"
            :selected-id="form.category"
            :lang="lang"
            :categories="categories"
            @change="handleChangeFilterCategory"
          />
        </el-form-item>
        <el-form-item v-loading="loadingSelectBrand" :label="lang.brand" :label-width="formLabelWidth">
          <select-brand
            :allow-create="false"
            :selected-id="form.brand"
            :lang="lang"
            :brands="brand"
            @change="handleChangeFilterBrand"
          />
        </el-form-item>
        <el-form-item v-loading="loadingSelectCollection" :label="lang.collection" :label-width="formLabelWidth">
          <select-collection
            :allow-create="false"
            :selected-id="form.collection"
            :lang="lang"
            :categories="collection"
            @change="handleChangeFilterCollection"
          />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visibleDialogFilter = false">{{ lang.cancel }}</el-button>
        <el-button type="primary" @click="handleFilter">{{ $lang[langId].filter }}</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="dialogDeleteProducts">
      <div class="row" style="background-color: #FAFAFA">
        <div class="col-sm-6" style="background-color: #FFFFFF; min-height:430px">
          <div v-for="(item, index) in chosenProducts" :key="index">
            <div class="grid-content">
              <div class="card-products clearfix clear">
                <div class="card-image" style="margin-top:10px;">
                  <img :src="item.photo_md" :alt="item.name" class="image-delete">
                </div>
                <div class="card-body">
                  <h4 style="font-weight: bold; text-transform: capitalize">{{item.name}}</h4>
                  <span>{{item.category_name}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-sm-6">
          <div class="grid-content" style="margin:50% 5%">
            <h3>
              {{ $lang[langId].are_you_want_remove }}
              <strong style="text-transform: capitalize">{{ lang.product }} & {{ $lang[langId].all_variant }} ?</strong>
            </h3>
            <div style="margin-top: 20px">

              <el-button type="text" @click="handleBulkDelete" style="color:#FF0000; font-size:24px; float:left; margin-left:10%">
                <svg-icon icon-class="trash" stroke="#FF0000"></svg-icon>
                {{ $lang[langId].delete }}
              </el-button>
              <el-button type="text" @click="dialogDeleteProducts = false" style="color:#5C5C5C; font-size:24px; float:right; margin-right:25%; margin-top:2px">Batal</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogDeleteRow">
      <div class="row" style="background-color: #FAFAFA" v-if="deleteHasVariant === true && deleteHasnotVariant === false">
        <div class="col-sm-6" :data="deleteRowData" style="background-color: #FFFFFF; min-height:500px" >
          <div v-for="(list, index) in deleteRowData.variants" :key="index">
            <div class="grid-content">
              <div class="card-products clearfix clear">
                <div class="card-image" style="margin-top:10px;">
                  <img :src="deleteRowData.photo_md" :alt="deleteRowData.name" class="image-delete">
                </div>
                <div class="card-body">
                  <h4 style="font-weight: bold; text-transform: capitalize">{{deleteRowData.name}}</h4>
                  <span>{{deleteRowData.category_name}}</span>
                  <h4>{{list.name}}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-sm-6" :data="deleteRowData">
          <div class="grid-content" style="margin:50% 5%">
            <h3>
              {{ $lang[langId].are_you_want_remove }}
              <strong style="text-transform: capitalize">{{deleteRowData.name}} & {{ $lang[langId].all_variant }} ?</strong>
            </h3>
            <div style="margin-top: 20px">

              <el-button type="text" @click="handleDeleteRow(deleteRowData.id)" style="color:#FF0000; font-size:24px; float:left; margin-left:10%">
                <svg-icon icon-class="trash" stroke="#FF0000"></svg-icon>
                {{ $lang[langId].delete }}
              </el-button>
              <el-button type="text" @click="dialogDeleteRow = false" style="color:#5C5C5C; font-size:24px; float:right; margin-right:25%; margin-top:2px">{{ lang.cancel }}</el-button>
            </div>
          </div>
        </div>
      </div>

      <div class="row" v-if="deleteHasnotVariant === true && deleteHasVariant === false" style="background-color: #FAFAFA">
        <div class="grid-content" style="margin:10%; padding-bottom:10px" :data="deleteRowData">
          <h3>
            {{ $lang[langId].are_you_want_remove }}
            <strong style="text-transform: capitalize">{{deleteRowData.name}}</strong> ?
          </h3>
          <div style="margin-top: 20px">

            <el-button type="text" @click="handleDeleteRow(deleteRowData.id)" style="color:#FF0000; font-size:24px; float:left; margin-left:10%">
              <svg-icon icon-class="trash" stroke="#FF0000"></svg-icon>
              {{ $lang[langId].delete }}
            </el-button>
            <el-button type="text" @click="dialogDeleteRow = false" style="color:#5C5C5C; font-size:24px; float:right; margin-right:25%; margin-top:2px">{{ lang.cancel }}</el-button>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="importDialog"
      :width="tableImport ? '980px' : '480px'"
      :title="$lang[langId].copy_product"
      @close="cancelImport">
      <div class="mb-8">
        <el-button @click="downloadTemplate" :loading="loadingTemplate">{{ lang.download_template }}</el-button>
        <el-button :loading="loadingDownload" @click="downloadClassification">{{ $lang[langId].download_clasification }}</el-button>
      </div>

      <div>
        <div v-if="dropdownForm">
          <el-upload
            v-loading="loadingUploadImportProduct"
            class="upload-demo"
            drag
            :action="computedUploadImportProductUrl"
            :headers="computedUploadImportProductHeaders"
            :on-success="handleUploadImportProductSuccess"
            :on-error="handleUploadImportProductError"
            :on-progress="handleUploadImportProductProgress"
            multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
            <div class="el-upload__tip" slot="tip">
              {{ lang.import_from_csv_info }}
            </div>
          </el-upload>
        </div>

        <div v-if="tableImport">
          <div v-if="errorImport != 0" class="mb-8">
            <el-tag type="danger" class="font-14">
              {{ $lang[langId].theres_error }}. {{ $lang[langId].fix_upload_error }}
            </el-tag>
          </div>

          <el-table
            ref="multipleTable"
            v-loading="loading"
            border
            :data="tableImportCustomer"
            :default-sort="{prop: 'id', order: 'ascending'}"
            :row-class-name="tableRowClassName">
            <el-table-column :label="$lang[langId].number" type="index" :index="indexMethod">
            </el-table-column>

            <el-table-column :label="lang.product_name" prop="name" sortable min-width="200">
              <template slot-scope="props">
                  <strong>{{ props.row.name }}</strong>
              </template>
            </el-table-column>

            <el-table-column :label="lang.sku" prop="sku" sortable min-width="200">
            </el-table-column>

            <el-table-column :label="lang.stock_qty" prop="stock_qty" sortable="custom" min-width="120">
            </el-table-column>

            <el-table-column :label="lang.buy_price" prop="buy_price" sortable min-width="120">
            </el-table-column>

            <el-table-column :label="lang.sell_price" prop="sell_price" sortable min-width="120">
            </el-table-column>

            <el-table-column :label="lang.selling_price_in_store" prop="pos_sell_price" sortable min-width="120">
            </el-table-column>

            <el-table-column :label="lang.error" prop="error" sortable min-width="300">
            </el-table-column>

          </el-table>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelImport" type="info">{{ lang.cancel }}</el-button>
        <el-button @click="saveImportData" :loading="loadingImport" type="success" v-bind:disabled="btnProses">{{ lang.processing }}</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="holdTitle"
      :visible.sync="holdInfo"
      max-width="780px">
        <el-card>
          <el-table
            ref="multipleTable"
            v-loading="loading"
            :data="holdData"
            @row-click="passHoldInfo"
            style="width: 100%">

            <!-- <el-table-column :label="$lang[langId].number" type="index" :index="indexMethod">
            </el-table-column> -->

            <el-table-column :label="lang.order_no" prop="order_no" width="auto">
              <template slot-scope="props">
                  <router-link :to="{path: '/sales/openorder/' + props.row.order_id}">
                    <strong>{{ props.row.order_no }}</strong>
                  </router-link>
              </template>
            </el-table-column>

            <el-table-column :label="lang.order_date" prop="order_date" width="auto">
            </el-table-column>

            <el-table-column :label="lang.customer" prop="customer_name" width="auto">
            </el-table-column>

            <el-table-column :label="lang.qty" prop="total_qty" width="70">
            </el-table-column>

          </el-table>
        </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="holdInfo = false" class="cancel">{{ lang.close }}</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogCopyProductStoreList"
      title="Copy Product">
      <div v-loading="loadingGetCopyProduct">
        <div
          v-for="item in activeStores"
          :key="item.store_id"
          class="box-in-loop pointer"
          @click="getCopyProduct(item, false)">
          <div v-if="!item.disable" class="flex-container">
            <el-avatar
              :src="item.logo"
              :size="32"
              style="flex-basis: 32px; min-width: 32px;"
            />
            <div class="ml-8" style="flex-grow: 2;">{{ item.name }}</div>
            <el-button
              round
              type="text"
              size="small"
              icon="el-icon-arrow-right">
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogCopyProduct"
      :destroy-on-close="true"
      :show-close="false"
      fullscreen
      lock-scroll
      append-to-body
      custom-class="unset-border-radius pos-relative dialog-header-override-fullscreen">
      <div slot="title" class="mt-24">
        <div>{{ lang.copy_from_store }}</div>
        <div class="fixed-dialog--header--buttons">
          <close-esc :hideEsc="true" @close="refreshFromCopyProduct" />
        </div>
        <el-button
          class="btn-block mb-12"
          @click="copyDialogList(true)">
          <div class="flex-container">
            <el-avatar
              :src="storeCopy.logo"
            />
            <div>
              {{ storeCopy.name }}
              <i class="el-icon-caret-bottom"/>
            </div>
          </div>
        </el-button>
      </div>

      <div style="padding-bottom: 40px;">
        <el-input
          v-model="params.search_text"
          :placeholder="lang.search"
          clearable
          prefix-icon="el-icon-search"
          class="mb-24 bg-f5"
          @change="handleSearchCopy">
        </el-input>

        <div class="mb-12">
          <div class="mb-12">
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAllProductToCopy"
              @change="handleCheckAllChange">
              {{ $lang[langId].copy_all + '(Max 50)'}}
            </el-checkbox>
          </div>

          <div>
            <el-checkbox-group
              v-model="checkedProductsToCopy"
              :max="50"
              class="flex-container flex-container--wrap"
              @change="handleCheckedProductToCopyChange">
              <div
                v-for="item in dataCopyProduct"
                :key="item.id"
                class="flex-grid-2 px-12">
                <el-checkbox
                  :label="item.id"
                  class="p-8 unset-height block checkbox-right"
                  border>
                  <div class="font-14 font-bold overflow-ellipsis">
                    {{ item.name }}
                  </div>
                  {{ item.klasifikasi }}
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </div>
        </div>

        <div v-if="disableMore">
          <el-button
            class="btn-block"
            icon="el-icon-arrow-down"
            @click="loadMore">
            {{ $lang[langId].load_more }}
          </el-button>
        </div>
      </div>

      <el-button
        :loading="loadingSaveCopyProduct"
        :disabled="btnCopy"
        type="success"
        class="btn-save-copy-product"
        @click="saveCopyProduct">
        {{ lang.save }}
      </el-button>
    </el-dialog>

    <el-dialog
      :visible.sync="freemiumDialog"
      max-width="780px">
      <freemium :dialog="1"></freemium>
    </el-dialog>
  </div>
</template>

<script>
var moment = require('moment')
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import { baseApi } from 'src/http-common'
import axios from 'axios'
import SelectGroupedProductCategory from 'components/modules/SelectGroupedProductCategory'
import SelectBrand from 'components/modules/SelectBrand'
import SelectCollection from 'components/modules/SelectCollection'
import Freemium from '@/components/FreemiumBanner'

import InputMoney from '@/components/InputMoneyV2'
import InlineEditPrice from '@/components/InlineEditPrice'

import { downloadClassificationTemplate, downloadProductTemplate } from '@/api/product'
import checkPersistentParam from '@/mixins/checkPersistentParam'
import basicComputedMixin from '@/mixins/basicComputedMixin'

import CloseEsc from '@/components/modules/CloseEsc'

import { mixinHiddenFeatureByPlanType } from '@/mixins/mixinHiddenFeatureByPlanType'
import { mixinPaginationComponent } from '@/mixins/mixinPaginationComponent'

export default {
  name: 'ProductList',

  components: {
    vueDropzone: vue2Dropzone,
    SelectGroupedProductCategory,
    SelectBrand,
    SelectCollection,
    Freemium,
    InputMoney,
    InlineEditPrice,
    CloseEsc
  },

  mixins: [checkPersistentParam, basicComputedMixin, mixinHiddenFeatureByPlanType, mixinPaginationComponent],

  data() {
    return {
      visibleDialogFilter: false,
      btnProses: true,
      form: {
        name: '',
        category: '',
        category_name: '',
        brand: '',
        brand_name: '',
        collection: '',
        collection_id: '',
        stock: [14, 80],
        harga: [20, 60]
      },
      changeColor: '#C8CBD3',
      formLabelWidth: '150px',
      dataProducts: [],
      tmp: {
        dataProducts: [],
        total: 0
      },
      pages: [5, 10, 20, 50, 100],
      loading: true,
      IsDelBtnDisabled: true,
      categories: [],
      chosenProducts: [],
      dialogDeleteProducts: false,
      dialogDeleteRow: false,
      importDialog: false,
      dropdownForm: true,
      tableImport: false,
      fileConfirm: '',
      number: 0,
      totalRow: 0,
      params: {
        search: null,
        total: null,
        sort_column: 'id',
        sort_type: 'desc',
        per_page: 10,
        page: 1,
        store: null,
        search_column: [],
        search_text: '',
        search_operator: [],
        collection_id: '',
        filter_name: {
          collection: '',
          category: '',
          brand: ''
        }
      },
      // currencyLabel: '',
      labelHarga: '',
      deleteRowData: [],
      deleteHasVariant: false,
      deleteHasnotVariant: false,
      isEditing: [],
      isEditingPos: [],
      isEditingBuy: [],
      temp: {},
      dataVar: [],
      dataa: [false, false],
      dialogCopyProductStoreList: false,
      dialogCopyProduct: false,
      dataCopyProduct: [],
      cols: 2,
      checkAllProductToCopy: false,
      checkedProductsToCopy: [],
      isIndeterminate: false,
      disableMore: false,
      copyStoreId: '',
      labelRow: [],
      storeCopy: {},
      multipleDelete: false,
      loadingSaveCopyProduct: false,
      loadingGetCopyProduct: false,
      brand: [],
      collection: [],
      freemiumDialog: false,
      loadingSelectCategory: false,
      loadingSelectBrand: false,
      loadingSelectCollection: false,
      holdInfo: false,
      holdData: [],
      holdTitle: '',
      loadingUploadImportProduct: false,
      loadingDownload: false,
      loadingUpdatePrice: false,
      visibleClear: false,
      loadingExport: false,
      loadingImport: false,
      loadingTemplate: false
    }
  },

  computed: {
    token() {
      return this.$store.state.user.token
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    selectedStore() {
      return this.$store.state.userStores.selectedStore
    },
    btnCopy() {
      let btnCopy = true
      if (this.checkedProductsToCopy.length > 0) {
        btnCopy = false
      } else {
        btnCopy = true
      }
      return btnCopy
    },
    computedUploadImportProductUrl() {
      return baseApi(this.selectedStore.url_id, this.langId, 'product/importfromcsv')
    },
    computedUploadImportProductHeaders() {
      return {
        'authorization' : 'Bearer ' + this.token.access_token
      }
    },
    activeStores() {
      return this.$store.getters.stores.filter(store => {
        return !store.disable
      })
    }
  },

  watch: {
    '$store.getters.selectedStore'(store) {
      // this.selectedStore = { ...store }
      this.form.category = ''
      // reset filter
      this.brand = []
      this.categories = []
      this.collection = []
      this.refreshView(store, false)
    },

    visibleDialogFilter(payload) {
      if (payload && !this.brand.length && !this.categories.length && !this.collection.length) {
        this.getSelectCategory()
        this.getSelectBrand()
        this.getSelectCollection()
      }
    }
  },

  mounted() {
    /**
     * Check and set persistent parameter data from vuex store
     */
    this.checkPersistentMeta()
    let store = { ...this.$store.getters.selectedStore }
    if (store) {
      this.refreshView(store, false)
    }

    var a = 0
    var b = []
    var start = 0
    var end = 0
    for (let i = 1; i <= 200; i++) {
      start = i * 1000 - 999
      end = i * 1000
      b.push(
        { 
          value: start + ' - ' + end,
          key: i-1,
          string: start + '_' + end
        }
      )
    }
    this.labelRow = b
  },

  methods: {
    refreshView(store, update) {
      let url = baseApi(store.url_id, this.langId, 'product')
      // if (this.params.search_column.length && this.params.search_text.length) {
      //   this.setFilter()
      // }
      this.getProducts(url)
    },
    getProducts(url) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: url,
        params: this.params,
        headers: headers
      })
        .then(response => {
          this.dataProducts = response.data.data
          this.params.total = response.data.meta.total
          this.loading = false
        })
        .catch(error => {
          this.loading = false
          this.dataProducts = []
          this.params.total = 0
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
      this.loadingSelectCategory = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let param = {
        per_page: 1000
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productgroup'),
        headers: headers,
        params: param
      })
        .then(response => {
          this.categories = response.data.data
          this.loadingSelectCategory = false
        })
        .catch(error => {
          this.categories = []
          if (error.response.data.error.status_code !== 404) {
            this.$notify({
              type: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error
            })
          }
          this.loadingSelectCategory = false
        })
    },
    getSelectBrand() {
      this.loadingSelectBrand = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let param = {
        per_page: 1000
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'brand'),
        headers: headers,
        params: param
      })
        .then(response => {
          this.brand = response.data.data
          this.loadingSelectBrand = false
        })
        .catch(error => {
          this.brand = []
          if (error.response.data.error.status_code !== 404) {
            this.$notify({
              type: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error
            })
          }
          this.loadingSelectBrand = false
        })
    },
    getSelectCollection() {
      this.loadingSelectCollection = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let param = {
        per_page: 1000
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'collection'),
        headers: headers,
        params: param
      })
        .then(response => {
          this.collection = response.data.data
          this.loadingSelectCollection = false
        })
        .catch(error => {
          if (error.response.data.error.status_code !== 404) {
            this.$notify({
              type: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error
            })
          }
          this.loadingSelectCollection = false
        })
    },
    showHold (data, is_variant, variantData) {
      this.loading = true
      this.holdTitle = data.name
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      console.log('data', data)
      let param = {}

      if (is_variant) {
        param.variant_id = variantData.id
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'product/holdinfo/' + data.id),
        headers: headers,
        params: param
      })
        .then(response => {
          this.holdData = response.data.data
          this.holdInfo = true
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
    handleSelectionChange(val) {
      if (val.length > 0) {
        this.multipleDelete = true
        this.IsDelBtnDisabled = false
        this.changeColor = '#FF0000'
        this.chosenProducts = val
      } else {
        this.multipleDelete = false
        this.IsDelBtnDisabled = true
        this.changeColor = '#C8CBD3'
      }
    },
    handleSizeChange(val) {
      this.params.page = 1
      this.params.per_page = val
      this.getProducts(baseApi(this.selectedStore.url_id, this.langId, 'product'))
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.params.page = val
      this.getProducts(baseApi(this.selectedStore.url_id, this.langId, 'product'))
    },
    handleSearch(val) {
      this.params.page = 1
      this.params.page = 1
      // this.params.search_text = []
      // this.params.search_column = []
      this.getProducts(baseApi(this.selectedStore.url_id, this.langId, 'product'))
    },
    handleSortChange(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.getProducts(baseApi(this.selectedStore.url_id, this.langId, 'product'))
    },
    handleFilter(formData) {
      // console.log(this.form)
      this.params.filter_name = {
        collection: '',
        category: '',
        brand: ''
      }
      this.params.search_text = []
      this.params.search_column = []
      this.params.search_operator = []
      this.params.collection_id = 0
      if (this.form.category !== '') {
        this.params.search_column.push('klasifikasi_id')
        this.params.search_text.push(this.form.category)
        this.params.search_operator.push('=')
        this.params.filter_name.category = this.form.category_name
      }
      if (this.form.brand !== '') {
        this.params.search_column.push('brand_id')
        this.params.search_text.push(this.form.brand)
        this.params.search_operator.push('=')
        this.params.filter_name.brand = this.form.brand_name
      }
      if (this.form.collection !== '') {
        this.params.collection_id = this.form.collection_id
        this.params.filter_name.collection = this.form.collection
      }
      this.visibleDialogFilter = false
      this.getProducts(baseApi(this.selectedStore.url_id, this.langId, 'product'))
    },
    handleBulkDelete() {
      var ids = []
      this.chosenProducts.map(i => {
        ids.push(i.id)
      })
      var delId = ids.join(',')
      this.deleteBulk(delId)
    },
    deleteBulk(productId) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      var data = {
        product_id: productId
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'product/bulkdelete'),
        headers: headers,
        data: data
      }).then(response => {
        this.params.search = null
        this.$message({
          message: response.data.data.message,
          type: 'success'
        })
        this.dataProducts = []
        this.getProducts(baseApi(this.selectedStore.url_id, this.langId, 'product'))
        this.dialogDeleteProducts = false
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    deleteRow(row) {
      this.dialogDeleteRow = true
      this.deleteRowData = row
      if (this.deleteRowData.variants.length > 0) {
        this.deleteHasVariant = true
        this.deleteHasnotVariant = false
      } else {
        this.deleteHasnotVariant = true
        this.deleteHasVariant = false
      }
    },
    handleDeleteRow(id) {
      this.deleteSingleProduct(id)
      this.dialogDeleteRow = false
    },
    deleteSingleProduct(productId = null) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let id = null
      if (productId) {
        id = productId
      }
      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'product/' + id),
        headers: headers
      })
        .then(response => {
          this.responseDeleteRow = response.data.data
          this.loading = false
          this.getProducts(baseApi(this.selectedStore.url_id, this.langId, 'product'))
          this.$message({
            message: response.data.data.message,
            type: 'success'
          })
        })
        .catch(error => {
          // console.log(error.data)
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.loading = false
        })
    },

    handleUploadImportProductProgress() {
      this.loadingUploadImportProduct = true
    },

    handleUploadImportProductSuccess(response) {
      // console.log(response)
      this.loadingUploadImportProduct = false
      if (response.error === 0) {
        if (response.unready_import !== 0) {
          this.btnProses = true
        } else {
          this.btnProses = false
        }
        this.dropdownForm = false
        this.tableImportCustomer = response.data
        this.totalRow = response.row
        this.errorImport = response.unready_import
        this.tableImport = true
        this.fileConfirm = response.file_confirmed
      }
    },

    handleUploadImportProductError(error, file) {
      // console.log(error)
      this.loadingUploadImportProduct = false
      const errorJson = JSON.parse(error.message)
      if (errorJson) {
        this.$message({
          type: 'error',
          message: errorJson.error.error
        })
      } else {
        this.$message({
        type: 'error',
        message: 'Product gagal di import'
      })
      }
      
    },

    cancelImport() {
      this.tableImportCustomer = []
      this.fileConfirm = ''
      this.dropdownForm = true
      this.tableImport = false
      this.importDialog = false
    },
    saveImportData() {
      this.loadingImport = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'product/importconfirmed?file_confirmed=' + this.fileConfirm),
        headers: headers
      })
        .then(response => {
          this.loadingImport = false
          this.cancelImport()
          this.importDialog = false
          this.$message({
            title: 'Success',
            message: response.data.message + ' Product.'
          })
          
          this.refreshView(this.selectedStore, true)
        })
        .catch((error, xhr) => {
          this.loadingImport = false
          this.$notify({
            type: 'warning',
            message: error.message,
            error: error.string
          })
        })
    },
    tableRowClassName({row, rowIndex, props}) {
      if (row.error !== null) {
        return 'warning-row'
      }
      return ''
    },
    indexMethod(index) {
      return index + 1
    },
    handleChangeFilterCategory(val) {
      this.form.category = val.id
      this.form.category_name = val.name
    },
    handleChangeFilterBrand(val) {
      this.form.brand = val.id
      this.form.brand_name = val.name
    },
    handleChangeFilterCollection(val) {
      this.form.collection = val.name
      this.form.collection_id = val.id
    },
    copyDialogList(copy) {
      this.loadingGetCopyProduct = false
      this.checkAllProductToCopy = false
      if (!copy) {
        this.dialogCopyProductStoreList = true
      } else {
        this.dialogCopyProductStoreList = true
        this.dialogCopyProduct = false
      }
    },

    handleSearchCopy(item) {
      if (item.length > 0) {
        this.getCopyProduct(this.storeCopy, true)
      } else {
        this.getCopyProduct(this.storeCopy, false)
      }
    },

    getCopyProduct (item, search) {
      this.loadingGetCopyProduct = true
      let param = {}
      if (!search) {
        this.storeCopy = item
        this.copyStoreId = ''
        this.copyStoreId = item.store_id
        param = {
          per_page: 50
        }
      } else {
        param = {
          per_page: 50,
          // search_column: 'name',
          search: this.params.search_text
        }
      }
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'product/copyfromstore/' + item.store_id),
        headers: headers,
        params: param
      })
        .then(response => {
          this.dataCopyProduct = response.data.data
          this.dialogCopyProductStoreList = false
          this.dialogCopyProduct = true
          if (response.data.links.next !== null) {
            this.disableMore = true
            this.next_page = response.data.links.next
          } else {
            disableMore = false
          }
          this.loadingGetCopyProduct = false
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.dataCopyProduct = []
          this.loadingGetCopyProduct = false
        })
    },
    handleCheckedProductToCopyChange(value) {
      const checkedCount = value.length
      this.checkAllProductToCopy = checkedCount === this.dataCopyProduct.length || 50
      this.isIndeterminate = false
    },
    handleCheckAllChange(bool) {
      const chkl = [...this.dataCopyProduct].slice(0, 50)
      if (bool) {
        this.checkedProductsToCopy = chkl.map(item => {
          return item.id
        })
      } else {
        this.checkedProductsToCopy = []
      }
      this.isIndeterminate = false
    },
    loadMore() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let param = {
        per_page: 50
      }

      axios({
        method: 'GET',
        url: this.next_page,
        headers: headers,
        params: param
      })
        .then(response => {
          response.data.data.map(i => {
            this.dataCopyProduct.push(i)
          })
          if (response.data.links.next !== null) {
            this.disableMore = true
            this.next_page = response.data.links.next
          } else {
            this.disableMore = false
          }
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

    saveCopyProduct() {
      this.loadingSaveCopyProduct = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let data = {
        store_id: this.copyStoreId,
        product_id: this.checkedProductsToCopy.join(', ')
      }

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'product/cloneproductfromstore/'),
        headers: headers,
        data: data
      }).then(response => {
        this.loadingSaveCopyProduct = false
        // this.dialogCopyProductStoreList = false
        this.checkedProductsToCopy = []
        this.checkAllProductToCopy = false
        let url = baseApi(this.selectedStore.url_id, this.langId, 'product')
        // this.getProducts(url)
        this.params.search_text.length > 0 ? this.getCopyProduct(this.storeCopy, true) : this.getCopyProduct(this.storeCopy, false)
        // this.dialogCopyProduct = false
        this.$notify({
          type: 'success',
          title: 'Berhasil Salin Product',
          message: response.data.data[0].count_copy + ' Product berhasil di salin'
        })
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loadingSaveCopyProduct = false
      })
    },

    handleClick(data) {
      // console.log('logdat', data)
      this.loadingExport = true
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let param = { ...this.params}
      param.p = data.key
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'product/excel'),
        params: param,
        responseType: 'blob',
        headers: headers
      }).then(response => {
        const fileName = 'product' + '-' + data.string + '-' + moment().format('YYYY-MM-DD') + '__' + '.xlsx'
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        this.loadingExport = false
        this.loading = false
      }).catch(error => {
        // console.log(error, 'error')
        this.loadingExport = false
        this.loading = false
      })
    },

    passHoldInfo (data) {
      this.$router.push('/sales/openorder/' + data.order_id)
    },

    downloadTemplate () {
      // window.open(this.baseURL + 'olsera_product_import_template.csv')
      this.loadingTemplate = true
      downloadProductTemplate().then(response => {
        const fileName = 'olsera_product_import_template.csv'
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        this.loadingTemplate = false
      }).catch(error => {
        // console.log(error, 'error')
        this.loadingTemplate = false
      })
    },

    downloadClassification () {
      this.loadingDownload = true
      downloadClassificationTemplate().then(response => {
        const fileName = 'product_classification_list' + '__' + '.xlsx'
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        this.loadingDownload = false
      }).catch(error => {
        // console.log(error, 'error')
        this.loadingDownload = false
      })
    },

    handleUpdatePrice(data, index, parentIndex) {
      // console.log(data)
      const saveData = {
        id: data.itemId,
        product_id: data.parentId
      }
      if (data.type === 'variant-buy-price') {
        saveData.buy_price = data.amount
        this.updateTariffVarian(saveData, index, parentIndex)
      } else if (data.type === 'variant-sell-price-pos') {
        saveData.sell_price_pos = data.amount
        this.updateTariffVarian(saveData, index, parentIndex)
      } else if (data.type === 'variant-sell-price') {
        saveData.sell_price = data.amount
        this.updateTariffVarian(saveData, index, parentIndex)
      } else if (data.type === 'product-buy-price') {
        this.$set(saveData, 'product', {})
        saveData.product.buy_price = data.amount
        // saveData.product.name = data.additionalData.name
        this.updateTariff(saveData, index)
      } else if (data.type === 'product-sell-price') {
        this.$set(saveData, 'product', {})
        saveData.product.sell_price = data.amount
        // saveData.product.name = data.additionalData.name
        this.updateTariff(saveData, index)
      } else if (data.type === 'product-sell-price-pos') {
        this.$set(saveData, 'product', {})
        saveData.product.sell_price_pos = data.amount
        // saveData.product.name = data.additionalData.name
        this.updateTariff(saveData, index)
      }
    },

    updateTariff(data, index) {
      //
      this.loadingUpdatePrice = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'product/' + data.id),
        headers,
        data
      }).then(response => {
        // this.refreshView(this.$store.getters.selectedStore, true)
        // console.log(this.dataProducts[index])
        this.dataProducts[index].fsell_price_pos = response.data.data.fsell_price_pos
        this.dataProducts[index].sell_price_pos = response.data.data.sell_price_pos
        this.dataProducts[index].fsell_price = response.data.data.fsell_price
        this.dataProducts[index].sell_price = response.data.data.sell_price
        this.dataProducts[index].fbuy_price = response.data.data.fbuy_price
        this.dataProducts[index].buy_price = response.data.data.buy_price
        this.loadingUpdatePrice = false
        this.$message({
          type: 'success',
          message: 'saved'
        })
      }).catch(error => {
        // console.log(error)
        this.loadingUpdatePrice = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    updateTariffVarian(data, index, parentIndex) {
      this.loadingUpdatePrice = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'productvariants/' + data.id),
        headers,
        data
      }).then(response => {
        this.dataProducts[parentIndex].variants[index] = response.data.data
        this.loadingUpdatePrice = false
        this.$message({
          type: 'success',
          message: 'saved'
        })
      }).catch(error => {
        this.loadingUpdatePrice = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    clearAllFilter () {
      this.form.brand = ''
      this.form.collection = ''
      this.form.collection_id = 0
      this.form.category = ''
      this.params.filter_name = {
        category: '',
        collection: '',
        brand: ''
      }
      this.$refs.selectGroupedProductCategory.reset()
      this.handleFilter()
    },

    removeFilter (data) {
      if (data === 'brand') {
        this.form.brand = ''
        this.params.filter_name.brand = ''
      } else if (data === 'category') {
        this.$refs.selectGroupedProductCategory.reset()
        this.form.category = ''
        this.params.filter_name.category = ''
      } else if (data === 'collection') {
        this.form.collection = ''
        this.form.collection_id = 0
        this.params.filter_name.collection = ''
      }
      this.handleFilter()
    },

    setFilter () {
      this.params.search_column.map((i, idx) => {
        if (i === 'klasifikasi_id') {
          this.form.category = this.params.search_text[idx]
        } else if (i === 'brand_id') {
          this.form.brand = this.params.search_text[idx]
        }
      })
      if (this.params.collection_id) {
        this.form.collection = this.params.collection_id
      }
    },

    refreshFromCopyProduct () {
      this.checkPersistentMeta()
      let store = { ...this.$store.getters.selectedStore }
      this.$delete(this.params, 'search_text')
      if (store) {
        this.refreshView(store, false)
      }

      this.dialogCopyProduct = false
    }
  }
}
</script>
