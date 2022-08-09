<template>
  <transition name="el-zoom-in-center">
    <div
      v-if="show"
      class="offscreen-right-sidebar px-null">
      <div class="offscreen-right-sidebar--wrapper">
        <div class="offscreen-right-sidebar--header text-left color-white--bg" style="z-index: 10">
          Duplikat produk ke Shopee
          <close-esc :hideEsc="true" @close="handleClose" />
        </div>

        <div class="table-handler-flex full-width text-right px-24" >
          <el-input class="inline-form input-search full-width" clearable :placeholder="lang.search" prefix-icon="el-icon-search" v-model="search" @change="handleSearch" @keyup.native.enter="handleSearchByEnter" size="small"></el-input>
        </div>

        <perfect-scrollbar :options="scrollOption" class="horizontal-scroll">
          <div class="flex-container py-12 px-24" v-loading="loadingData">
              <el-button @click="showGroup('all')"
                type="info-addon" round >
                  Semua
              </el-button>
              <el-button @click="showGroup('not_duplicate')"
                type="info-addon" round >
                  {{ rootLang.cant_duplicate }} ({{ dataSummaries.cannot }})
              </el-button>
              <el-button @click="showGroup('can_duplicate')"
                type="info-addon" round >
                  {{ rootLang.can_duplicate }} ({{ dataSummaries.can }})
              </el-button>
          </div>
        </perfect-scrollbar>

        <div class="px-12 mt-24">
          <div class="color-info--bg p-12 flex-container flex-container--start">
            <div class="container-icon">
              <svg-icon icon-class="information-circle" class="color-grey--icon" />
            </div>
            <div>
              {{ dataSummaries.cannot }} produk tidak dapat diduplikasi ke Shopee karena data kurang lengkap. <span class="color-primary pointer" @click="showInfoInvalidProduct = true"> Selengkapnya </span>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 68px">
          <div class="like-table-wrapper border border--table-border mt-24" >
            <div class="flex-container mt-16">
              <div class="full-width px-24 font-bold font-18">{{ rootLang.select }} {{ lang.product }}</div>
              <div class="px-24"><el-checkbox v-model="checkAll" @change="handleCheckAll"></el-checkbox></div>
            </div>
            <div v-for="(item, idx) in dataProd" 
              :key="idx" class="like-table-wrapper--item pointer">
              <div class="flex-container full-width">
                <div class="mr-8 flex-container full-width" @click="handleEdit(item)">
                  <div class="flex-container">
                    <el-avatar
                      v-if="item.photo_lg !== null"
                      :src="item.photo_lg"
                      :size="32"
                      shape="square"
                    />
                    <div class="color-white--bg container-watermark-olsera">
                      <el-avatar
                        src="/static/img/olsera.png"
                        class="mr-4"
                        :size="20"
                      />
                    </div>
                  </div>
                  <div class="font-bold font-14 ml-8 word-break">
                    <div class="color-primary">{{ item.name }}</div>
                    <!-- <div v-if="!isWarnData(item)" class="font-12">{{ item.shopee_category_name }}</div> -->
                    <div v-if="item.is_completed" class="font-12">{{ item.shopee_category_name }}</div>
                    <div v-else class="color-danger font-12">Data belum lengkap</div>
                    <div class="font-12">{{ item.fprice }}</div>
                  </div>
                </div>
                <div class="font-14 px-12 text-right" style="width: 30%">
                  {{ item.variations.length }} varian
                </div>
                <div>
                  <div v-if="item.shopee_category_name !== null && item.is_completed === true" class="mr-8"><el-checkbox v-model="item.checked" @change="handleCheck(item, idx)"></el-checkbox></div>
                  <div v-else>
                    <svg-icon icon-class="alert-triangle-yellow" class="mr-8" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="load-more" v-if="nextPage" v-loading="loadingData" style="margin-bottom: 100px">
            <el-button
              @click="loadMore"
              class="btn-block">
              {{ $lang[langId].load_more }}..
            </el-button>
          </div>
        </div>

        <div class="offscreen-right-sidebar--footer color-white--bg">
          <el-button
            :loading="loadingDuplicate"
            :disabled="disabledSave"
            class="btn-block mt-24 color-shopee--bg color-white"
            @click="saveProductBatch">
            {{rootLang.duplicate_product}}
          </el-button>
        </div>
      </div>

      <el-dialog
        :visible.sync="showDetailItem"
        :show-close="false"
        width="100%"
        fullscreen
        append-to-body>
        <div slot="title" class="flex-container">
          <h4 class="dialog-title full-width font-bold font-24" style="margin-right: -177.74px">
            Lengkapi Data Produk
          </h4>
          <div class="flex-container">
            <el-button type="info" @click="cancelEditProduct">{{ rootLang.cancel }}</el-button>
            <el-button type="shopee" :loading="loadingPreUpload" @click="saveSingleProductBatch(0)">{{ lang.save }}</el-button>
            <!-- <el-button type="shopee" :loading="loadingPreUpload" @click="handleSaveSingleProduct">{{ lang.save }}</el-button> -->
          </div>
        </div>
        <div class="container-768">
          <div class="px-12 mb-24">
            <div class="color-info--bg flex-container">
              <div class="container-icon">
                <svg-icon icon-class="information-circle" class="color-grey--icon" />
              </div>
              <div>
                Data produk disini tidak mengubah data produkmu di Olsera
              </div>
            </div>
          </div>
          
          <!-- Card Info Produk -->
          <div class="like-table-wrapper border border--table-border p-16 mt-24">
            <div class="flex-container flex-container--start">
              <div class="mr-8" style="width: 30%">
                <div class="font-12">Foto Produk</div>
                <div class="flex-container justify-center">
                  <el-upload
                    v-loading="loadingUpload"
                    :action="uploadPhotoUrl"
                    :headers="headersReverify"
                    :before-upload="beforeUpload"
                    :show-file-list="false"
                    :on-progress="handleUploadProgress"
                    :on-success="handleUploadSuccess"
                    :on-error="handleUploadError"
                    list-type="document-grabfood"
                    accept="image/jpeg" 
                    >
                    <template v-if="tempItem.img_upload !== null">
                      <el-image
                        :src="tempItem.img_upload.photo_md" alt=""
                        style="width: 100px; height: 100px; margin-right: 8px;"
                      />
                    </template>
                    <template v-else>
                      <el-image
                        v-if="tempItem.file_name !== null"
                        :src="tempItem.photo_lg" alt=""
                        style="width: 100px; height: 100px; margin-right: 8px;"
                      />
                      <i v-else class="el-icon-camera"></i>
                    </template>
                  </el-upload>
                </div>
              </div>
              <div class="full-width">
                <div class="font-12">{{ lang.product_name }}</div>
                <el-input v-model="tempItem.name" />

                <div class="font-12 mt-12">{{ lang.price }}</div>
                <input-money v-model="tempItem.price" />
                <div class="font-11 mt-12 color-info">Harga diambil dari harga Jual Online Produk</div>
              </div>
            </div>

            <div class="mt-12">
              <div class="font-12">{{ lang.description }}</div>
              <el-input v-model="tempItem.description" type="textarea" autosize show-word-limit />
            </div>

            <div class="flex-container mt-16">
              <div class="full-width pr-4">
                <!-- <div class="color-info--bg p-8 mt-24 text-center">
                  <div class="font-12" style="color: #999999">Kategory Olsera</div>
                  <div class="font-bold">{{ tempItem.olsera_category_name }}</div>
                </div> -->
                <div class="font-12">Kategori Olsera</div>
                <el-input v-model="tempItem.olsera_category_name" disabled />
              </div>
              <div class="full-width pl-4">
                <div v-loading="loadingRequired">
                  <div class="font-12">Kategori Shopee</div>
                  <el-autocomplete
                    v-model="tempItem.shopee_category_name"
                    :fetch-suggestions="getCategorySearch" 
                    placeholder="Search Category"
                    class="full-width"
                    @select="handleGetRequired" />
                </div>
              </div>
            </div>

            <!-- <div class="flex-container mt-8">
              <div class="full-width pr-4">
                <div class="font-12">{{ lang.sku }} (Stock Keeping Unit)</div>
                <el-input v-model="tempItem.item_sku" maxlength="8" @input="handleChangeInput">
                  <template slot="append" ><el-button type="text" @click="getRandom"><svg-icon icon-class="refresh-ico" class="color-info pointer"  /></el-button></template>
                </el-input>
              </div>
              <div class="full-width pl-4">
                <div class="font-12">{{ lang.stock_qty }}</div>
                <el-input v-model="tempItem.stock" />
              </div>
            </div> -->
 
            <div class="full-width mt-8">
              <span class="font-12">Produk Berbahaya</span>
              <el-radio-group
                v-model="tempItem.item_dangerous"
                class="full-width flex-container border border--info">
                <el-radio-button class="lpoint-type" :label="true">
                  Berbahaya
                </el-radio-button>
                <el-radio-button class="lpoint-type" :label="false">
                  Tidak Berbahaya
                </el-radio-button>
              </el-radio-group>
            </div> 

            <div class="full-width mt-8">
              <span class="font-12">Kondisi</span>
              <el-radio-group
                v-model="tempItem.item_condition"
                class="full-width flex-container border border--info">
                <el-radio-button class="lpoint-type" :label="'NEW'">
                  Baru
                </el-radio-button>
                <el-radio-button class="lpoint-type" :label="'USED'">
                  Pernah dipakai
                </el-radio-button>
              </el-radio-group>
            </div>
          </div>

          <!-- Card Pengiriman -->
          <div class="like-table-wrapper border border--table-border p-16 mt-24">
            <div class="div">
              <div class="font-14 font-bold">
                Pengiriman
              </div>
            </div>
            <div class="flex-container mt-8">
              <el-form class="full-width mr-16" @submit.native.prevent>
                <el-form-item :error="tempItem.weightErr" class="mb-0">
                  <template #label>
                    <div class="font-12">
                      {{ lang.weight }} (gram)
                    </div>
                  </template>
                  <el-input v-model="tempItem.weight" type="number" min="0" @change="getPengiriman" />
                </el-form-item>
              </el-form>
              <div class="flex-container ml-auto">
                <el-form class="full-width" @submit.native.prevent>
                  <el-form-item class="mb-0">
                    <template #label>
                      <div class="font-12">
                        {{ rootLang.long }} (cm)
                      </div>
                    </template>
                    <el-input v-model="tempItem.length_dimension" type="number" min="0" @change="getPengiriman" />
                  </el-form-item>
                </el-form>
                <el-form class="full-width" @submit.native.prevent>
                  <el-form-item class="mb-0">
                    <template #label>
                      <div class="font-12">
                        {{ rootLang.wide }} (cm)
                      </div>
                    </template>
                    <el-input v-model="tempItem.width_dimension" type="number" min="0" @change="getPengiriman" />
                  </el-form-item>
                </el-form>
                <el-form class="full-width" @submit.native.prevent>
                  <el-form-item class="mb-0">
                    <template #label>
                      <div class="font-12">
                        {{ rootLang.height }} (cm)
                      </div>
                    </template>
                    <el-input v-model="tempItem.high_dimension" type="number" @change="getPengiriman" />
                  </el-form-item>
                </el-form>
                <!-- <div>
                  <div class="font-12">{{ rootLang.long }} (cm)</div>
                  <el-input v-model="tempItem.length_dimension" type="number" />
                </div>
                <div>
                  <div class="font-12">{{ rootLang.wide }} (cm)</div>
                  <el-input v-model="tempItem.width_dimension" type="number" />
                </div>
                <div>
                  <div class="font-12">{{ rootLang.height }} (cm)</div>
                  <el-input v-model="tempItem.high_dimension" type="number"  />
                </div> -->
              </div>
              <!-- <div class="full-width pl-4">
                <el-row type="flex" class="row-bg">
                  <el-col :span="6">
                    <div class="font-12">{{ rootLang.long }} (cm)</div>
                    <el-input v-model="tempItem.length_dimension" type="number" />
                  </el-col>
                  <el-col :span="6">
                    <div class="font-12">{{ rootLang.wide }} (km)</div>
                    <el-input v-model="tempItem.length_dimension" type="number" />
                  </el-col>
                  <el-col :span="6">
                    <div class="font-12">{{ rootLang.height }} (cm)</div>
                    <el-input v-model="tempItem.length_dimension" type="number" />
                  </el-col>
                </el-row>
              </div> -->
            </div>

            <div class="px-12 mb-24 mt-24">
              <div class="color-info--bg flex-container">
                <div class="container-icon">
                  <svg-icon icon-class="information-circle" class="color-grey--icon" />
                </div>
                <div>
                  Aktifkan min. 1 jasa kirim. Produk tidak dapat disimpan jika tidak ada jasa kirim yang aktif. Anda juga dapat klik disini untuk menambahkan jasa kirim pada produk Anda.
                </div>
              </div>
            </div>
            <div v-loading="loadingCourier">
              <el-collapse v-model="activeCollapse">
                <el-collapse-item 
                  v-for="(item, idx) in logistics"
                  :key="item.id"
                  :name="idx"
                  class="mt-16">
                  <template slot="title">
                    <div class="flex-container full-width">
                      <div class="ml-null font-bold">
                        {{ item.logistic_name }}
                      </div>
                      <div v-if="item.disabled_note !== null" class="ml-8 color-danger">
                        {{ `(${item.disabled_note})` }}
                      </div>
                      <div class="ml-auto mr-16">
                        <el-switch
                          v-model="item.enabled"
                          :active-value="true"
                          :inactive-value="false"
                          :disabled="item.disabled"
                          @change="activeCollapse = ''"
                        />
                      </div>
                      <!-- <span v-if="item.force_enabled == 0"></span>
                      <span v-if="item.force_enabled == 1"></span> -->
                    </div>
                  </template>
                  <div v-if="item.list_logistics.length">
                    <div v-for="(log) in item.list_logistics" :key="log.name" class="flex-container">
                      <div class="ml-null">
                        {{ log.name }}
                      </div>
                      <div v-if="log.disabled_note !== null" class="ml-8 color-danger">
                        {{ `(${log.disabled_note})` }}
                      </div>
                      <!-- <div class="ml-auto">
                        <el-switch v-model="item.force_enabled" :active-value="1" :inactive-value="0"></el-switch>
                      </div> -->
                      <!-- <span v-if="item.force_enabled == 0"></span>
                      <span v-if="item.force_enabled == 1"></span> -->
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
            <div class="mt-8" style="color: #999999">
              <p>Pengaturan jasa kirim hanya akan diterapkan pada produk ini. Ongkir yang dimunculkan adalah tarif dasar yang dapat berubah berdasarkan berat & lokasi Pembeli.</p>
            </div>
          </div>

          <!-- Card Spesifikasi -->
          <div class="like-table-wrapper border border--table-border p-16 mt-24">
            <div class="font-14 font-bold">
              Spesifikasi
            </div>
            <template v-if="tempItem.formRequired">
              <el-form :style="gridStyle" class="card-list">
                <el-form-item 
                  v-for="(item) in tempItem.formRequired"
                  :key="item.attribute_id"
                  :error="item.error"
                  class="card-item">
                  <template #label>
                    <div class="font-12">
                      {{ item.attribute_name }}
                    </div>
                  </template>
                  <div class="textfield">
                    <div v-if="item.format_type === 'NORMAL'">
                      <div v-if="item.input_type === 'DROP_DOWN' || item.input_type === 'COMBO_BOX'">
                        <el-select
                          v-model="item.value"
                          class="full-width"
                          @input="handleChangeInput(); item.error = null">
                          <el-option
                            v-for="opt in item.options"
                            :key="opt"
                            :label="opt"
                            :value="opt"
                          />
                        </el-select>
                      </div>
                      <div v-if="item.input_type === 'TEXT_FILED'">
                        <div v-if="item.attribute_type === 'DATE_TYPE'">
                          <el-date-picker 
                            v-model="item.value"
                            type="date" 
                            format="dd MMMM yyyy" 
                            value-format="yyyy-MM-dd"
                            style="width: 100%"
                            @input="handleChangeInput(); item.error = null"
                          />
                        </div>
                        <div v-else>
                          <el-input
                            v-model="item.value"
                            class="full-width"
                            :type="item.text_type"
                            @input="handleChangeInput(); item.error = null"
                          />
                        </div>
                      </div>
                    </div>
                    <div v-if="item.format_type === 'QUANTITATIVE'">
                      <div v-if="item.input_type === 'TEXT_FILED' && item.attribute_unit.length" class="flex-container">
                        <el-input
                          v-model="item.value"
                          class="mw-150"
                          :type="item.text_type"
                          @input="handleChangeInput(); item.error = null"
                        />
                        <el-select
                          v-model="item.value_unit"
                          class="mw-150"
                          @input="handleChangeInput(); item.error = null">
                          <el-option
                            v-for="opt in item.attribute_unit"
                            :key="opt"
                            :label="opt"
                            :value="opt"
                          />
                        </el-select>
                      </div>
                      <div v-if="item.input_type === 'COMBO_BOX'">
                        <el-select
                          v-model="item.value"
                          class="full-width"
                          @input="handleChangeInput(); item.error = null">
                          <el-option
                            v-for="opt in item.options"
                            :key="opt"
                            :label="opt"
                            :value="opt"
                          />
                        </el-select>
                      </div>
                    </div>
                  </div>
                </el-form-item>
              </el-form>
            </template>
          </div>

          <!-- Card Ubah Sekaligus -->
          <div v-if="tempItem.variations.length" class="like-table-wrapper border border--table-border p-16 mt-24">
            <div class="full-width flex-container">
              <div class="mr-null">
                <el-checkbox v-model="checkAllVariant" @change="handleCheckAllVariant" />
              </div>
              <div class="font-bold font-14 ml-8">
                {{ batchEditVariantTitle }}
              </div>
              <div class="font-bold font-14 ml-auto">
                <el-button
                  class="btn-block color-white"
                  style="background-color: #1685C7"
                  @click="applyBatchEditVariant">
                  Terapkan
                </el-button>
              </div>
            </div>
            <div class="mt-16">
              <!-- <div class="flex-container">
                <div class="mw-200">
                  <input-money v-model="form.price" />
                </div>
                <div class="mw-150">
                  <el-input v-model="form.stock" type="number" min="0" placeholder="Stok" />
                </div>
                <div class="mw-150">
                  <el-input v-model="form.sku" placeholder="SKU" />
                </div>
                <div>
                  <variant-image-upload
                    :upload-url="uploadPhotoUrl"
                    :init-data="form.initImageVariant"
                    @response-sent="handleUploadSuccessVariant($event)"
                  />
                </div>
              </div> -->
              <el-row :gutter="20" type="flex" justify="end">
                <el-col :span="6" :offset="12" class="mw-200">
                  <input-money v-model="form.price" />
                </el-col>
                <el-col :span="6" class="mw-150">
                  <el-input v-model="form.stock" type="number" min="0" placeholder="Stok" />
                </el-col>
                <el-col :span="6" class="mw-150">
                  <el-input v-model="form.sku" placeholder="SKU" />
                </el-col>
                <el-col :span="6" class="mr-24 flex-container flex-container--center">
                  <variant-image-upload
                    :upload-url="uploadPhotoUrl"
                    :init-data="form.initImageVariant"
                    @response-sent="handleUploadAllVariant($event)"
                  />
                </el-col>
              </el-row>
            </div>
          </div>

          <!-- <div class="like-table-wrapper mt-16 border border--table-border">
              <div class="like-table-wrapper--item">
                <div class="font-bold font-14 w-p-30">
                  Nama varian
                </div>
                <div class="font-bold font-14 w-p-30">
                  Harga
                </div>
                <div class="font-bold font-14 w-p-20">
                  Stock
                </div>
                <div class="font-bold font-14 w-p-20">
                  SKU
                </div>
              </div>

              <perfect-scrollbar class="scrollBulkPair">
                <div class="like-table-wrapper border border--table-border" >
                  <div v-for="(item) in this.tempItem.variations" 
                    :key="item.variant_id"
                    class="like-table-wrapper--item pointer"
                    @click="handleCheck(item)">
                    <div class="flex-container w-p-30">
                      <div class="ml-null mr-8">
                        <el-checkbox></el-checkbox>
                      </div>
                      <div class="font-bold font-14">
                        {{ item.name }}
                      </div>
                    </div>
                    <div class="w-p-30">
                      {{ item.fprice }}
                    </div>
                    <div class="font-14 w-p-20">
                      {{ item.stock }}
                    </div>
                    <div class="font-14 w-p-20">
                      {{ item.variation_sku }}
                    </div>
                  </div>
                </div>
              </perfect-scrollbar>
            </div> -->

          <!-- Card Variations -->
          <div v-if="tempItem.variations.length" class="like-table-wrapper border border--table-border mt-24">
            <el-table :data="variations" style="width: 100%">
              <el-table-column
                :label="'Nama varian'"
                min-width="150">
                <template slot-scope="scope">
                  <div class="flex-container">
                    <el-checkbox v-model="scope.row.checked" @change="handleCheckVariant(scope.row)" />
                    <!-- <div class="ml-16"> -->
                      <el-input v-model="scope.row.name" class="ml-16" />
                    <!-- </div> -->
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                :label="'Harga'"
                min-width="200">
                <template slot-scope="scope">
                  <input-money v-model="scope.row.price" style="width: 100%" />
                </template>
              </el-table-column>
              <el-table-column
                :label="'Stok'"
                width="150">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.stock"
                    type="number"
                    min="0"
                  />
                </template>
              </el-table-column>
              <el-table-column
                :label="'SKU'"
                min-width="150">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.variation_sku" :placeholder="'SKU'" style="width:100%; margin-top:0;"/>
                </template>
              </el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                  <variant-image-upload
                    :upload-url="uploadPhotoUrl"
                    :init-data="scope.row"
                    @response-sent="handleUploadSuccessVariant($event, scope.row)"
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- Button Duplicate -->
          <div class="mt-24">
            <el-button class="btn-block" :loading="loadingDuplicate" plain @click="saveSingleProductBatch(1)"> Duplikat produk ini </el-button>
          </div>
        </div>
      </el-dialog>

      <el-dialog
        :visible.sync="showInfoInvalidProduct"
        :show-close="false"
        width="344px"
        append-to-body>
        <div slot="title" class="text-center">
          <div class="font-bold">Data produk kurang lengkap</div>
          <div class="word-break" style="font-weight: normal">{{ dataSummaries.cannot }} produk tidak dapat diduplikasi ke Shopee. Produk di Olsera harus memiliki minimal data-data di bawah ini</div>
        </div>
        <div>
          <div class="color-info--bg p-12">
            <ul>
              <li>Foto</li>
              <li>Nama Produk</li>
              <li>Kategory Shopee</li>
              <li>Harga Jual</li>
              <li>Stok</li>
              <li>SKU</li>
              <li>Berat</li>
            </ul>
          </div>
          <div class="mt-24">
            <el-button class="btn-block" @click="showInfoInvalidProduct = false">Ok</el-button>
          </div>
        </div>
      </el-dialog>
    </div>

  </transition>
</template>

<script>
import PageFullscreen from '@/components/layouts/PageFullscreen.vue'
import basicComputedMixin from '@/mixins/basicComputedMixin'
import CloseEsc from '@/components/modules/CloseEsc'
import { baseApi, HTTP } from 'src/http-common'

import InputMoney from '@/components/InputMoneyV2'
import VariantImageUpload from './variantImageUpload.vue'

import { recomendationShopee, 
  fetchListCategoryShopee,
  fetchRequiredForm,
  savePreUpload,
  saveDuplicateProduct,
  saveDuplicateMulti,
  getLogistic,
  updatePreUpload } from '@/api/thirdParty/shopee'

const moment = require('moment')
export default {
  name: 'DuplicateProduct',
  mixins: [basicComputedMixin],
  components: {
    CloseEsc,
    PageFullscreen,
    InputMoney,
    VariantImageUpload
  },

  props: {
    shopeeStore: {
      type: Object,
      default: () => {}
    },
    show: {
      type: Boolean,
      default: false
    },
    dataProduct: {
      type: Array,
      default: () => []
    },
    fromBulk: {
      type: Boolean,
      default: false
    },
    loadingData: {
      type: Boolean,
      default: false
    },
    dataSummaries: {
      type: Object,
      default: () => {}
    },
    nextPage: {
      type: String,
      default: null
    }
  },

  data() {
    return {
      input: '', // Menghilangkan warning
      activeCollapse: '',
      params: {
        search: '',
        per_page: 50
      },
      tempItem: {
        Images: [],
        img_upload: null,
        variations: [],
        weightErr: null
      },
      shoopeStore: {},
      showDetailItem: false,
      searchCategoryData: [],
      searchBrandData: [],
      logistics: [],
      showInfoInvalidProduct: false,
      loadingPair: false,
      disabledSave: false,
      loadingPreUpload: false,
      loadingRequired: false,
      loadingDuplicate: false,
      scrollOption: {
        suppressScrollY: true,
        suppressScrollX: false
      },
      checkAll: false,
      dataChecked: [],
      checkAllVariant: false,
      variantChecked: [],
      form: {
        price: '',
        stock: '',
        sku: '',
        initImageVariant: {}
      },
      loadingUpload: false,
      loadingUploadVariant: false,
      loadingCourier: false,
      variantImgUpload: null,
      isEdit: false,
      search: '',
    }
  },

  computed: {
    gridStyle() {
      return {
        gridTemplateColumns: `repeat(2, minmax(100px, 1fr))`
      }
    },
    // Menghilangkan error data dummy
    bgOlseradiv () {
      let bg = []
      this.dummyData.map(i => {
        bg.push('background-color: #FFFFFF')
      })
      return bg
    },
    //////////////////////////////////
    dataProd () {
      return this.dataProduct.map(i => {
        i.checked = false
        if (this.dataChecked.length > 0) {
          this.dataChecked.map(j => {
            if (i.product_id === j.product_id) {
              i.checked = true
            }
          })
        }
        return i
      })
    },

    variations () {
      if (this.tempItem.variations.length) {
        return this.tempItem.variations.map(i => {
          i.img_upload = null
          i.checked = false
          if (this.variantChecked.length > 0) {
            this.variantChecked.map(j => {
              if (i.variant_id === j.variant_id) {
                i.checked = true
              }
            })
          }
          return i
        })
      } else {
        return []
      }
    },

    batchEditVariantTitle () {
      var count = this.variantChecked.length
      return count > 0 ? `${count} produk terpilih` : 'Ubah Data Varian Sekaligus'
    },

    uploadPhotoUrl() {
      return baseApi(this.selectedStore.url_id, this.langId, 'shopee/duplicate-product/upload-photo')
    },

    headersReverify() {
      return {
        'Authorization': 'Bearer ' + this.token.access_token
      }
    },
  },

  methods: {
    handleClose () {
      this.$emit('close')
    },

    handleResetForm () {
      this.form = {
        price: '',
        stock: '',
        sku: ''
      }
      for (var member in this.form.initImageVariant) delete this.form.initImageVariant[member];
      this.checkAllVariant = false
      this.variantChecked = []
    },

    handleEdit (item) {
      this.tempItem = { ...item}
      this.tempItem.img_upload = null
      // item.lazada_attributes !== null ? this.tempItem.formRequired = item.lazada_attributes : this.tempItem.formRequired = []
      this.isEdit = false
      if (this.tempItem.SellerSku === null) {
        this.getRandom()
      }

      ///////////////// DIKOMEN SEMENTARA /////////////////////
      if (item.shopee_category_id) { // if (item.attributes.length)
        this.isEdit = true
        let temp = [...item.attributes]
        let params = {
          shopee_shop_id: this.shopeeStore.shop_id,
          // weight: this.weight,
          // width_dimension: this.width_dimension,
          // length_dimension: this.length_dimension,
          // high_dimension: this.high_dimension

        }
        this.loadingRequired = true
        this.tempItem.formRequired = []
        fetchRequiredForm(params, item.shopee_category_id).then(response => {
          console.log('test', response)
          this.tempItem.formRequired = [...response.data.data]
          this.tempItem.formRequired.map(i => {
            i.value = ''
            i.value_unit = ''
            i.text_type = ''
            i.error = null
            
            if (i.input_type === 'TEXT_FILED') {
              if (i.attribute_type === 'FLOAT_TYPE') {
                i.text_type = 'number'
              } else if (i.attribute_type === 'STRING_TYPE') {
                i.text_type = 'text'
              }
            }
            
            temp.map(j => {
              if (i.attribute_id === j.attributes_id) {
                if (i.input_type === 'TEXT_FILED' && i.attribute_type === 'DATE_TYPE') {
                  i.value = moment.unix(j.value).format('YYYY-MM-DD')
                } else if (i.input_type === 'TEXT_FILED' && i.attribute_unit.length) {
                  // let split = this.splitString(j.value)
                  // i.value = split.digits
                  // i.unit = split.letters
                  // let splitString = j.value.split(" ")
                  // i.value = splitString[0]
                  // i.unit = splitString[1]
                  i.value = j.value
                  i.value_unit = j.value_unit
                } else {
                  i.value = j.value
                }
              }
            })
          })
          console.log('formReq', this.tempItem.formRequired)
          this.loadingRequired = false
          // this.handleFormValidation()
          this.$forceUpdate()
        }).catch(error => {
          this.loadingRequired = false
          console.log(error)
        })
      }
      //////////////////////////////////////////////////////////////
      // this.handleFormValidation()
      this.getPengiriman()
      this.showDetailItem = true
    },

    // splitString (str) {
    //     let patt1 = /[0-9]/g
    //     let patt2 = /[a-zA-Z]/g
    //     let letters = str.match(patt2)
    //     let digits = str.match(patt1)

    //     return {
    //         letters,
    //         digits
    //     }
    // },

    getPengiriman () {
      this.loadingCourier = true
      let params = {
        shopee_shop_id: this.shopeeStore.shop_id,
        weight: this.tempItem.weight,
        width_dimension: this.tempItem.width_dimension,
        length_dimension: this.tempItem.length_dimension,
        high_dimension: this.tempItem.high_dimension
      }
      getLogistic(params).then(response => {
        this.logistics = [...response.data.data]
        this.logistics.map(i => {
          i.enabled = false
          this.tempItem.logistics.map(j => {
            if (i.logistic_id === j.logistic_id) {
              i.enabled = j.enabled
            }
          })
        })
        this.loadingCourier = false
      }).catch(error => {
        console.log(error)
        this.loadingCourier = false
      })
    },

    getCategorySearch(queryString, callback) {
      // this.loadingCategory = 
      let params = {
        sort_column: 'name',
        sort_type: 'asc',
        search: queryString,
        per_page: 50,
        is_last_level: 1
      }
      // recomendation Shopee diganti ke fetchListCategoryShopee
      fetchListCategoryShopee(params, this.tempItem.olsera_category_id).then(response => {
        for (let i of response.data.data) {
          i.value = i.name
        }
        this.searchCategoryData = response.data.data
        callback(this.searchCategoryData)
      }).catch(error => {
        console.log(error)
      })
    },

    handleGetRequired (data) {
      console.log('dat', data)
      this.loadingRequired = true
      this.tempItem.shopee_category_id = data.shopee_category_id
      let params = {
        shopee_shop_id: this.shopeeStore.shop_id
      }
      this.tempItem.formRequired = []
      fetchRequiredForm(params, data.shopee_category_id).then(response => {
        console.log('test', response)
        this.tempItem.formRequired = [ ...response.data.data]
        this.tempItem.formRequired.map(i => {
          i.value = ''
          i.text_type = ''
          i.error = null
          
          if (i.input_type === 'TEXT_FILED') {
            if (i.attribute_type === 'FLOAT_TYPE') {
              i.text_type = 'number'
            } else if (i.attribute_type === 'STRING_TYPE') {
              i.text_type = 'text'
            }
          }
        })
        this.loadingRequired = false
        // this.handleFormValidation()
        this.$forceUpdate()
      }).catch(error => {
        this.loadingRequired = false
        console.log(error)
      })
    },

    // getBrandLazada(queryString, callback) {
    //   // this.loadingCategory = true
    //   let params = {
    //     keyword: queryString
    //   }
    //   fetchBrandLazada(params).then(response => {
    //     for (let i of response.data.data) {
    //       i.value = i.name
    //     }
    //     this.searchBrandData = response.data.data
    //     callback(this.searchBrandData)
    //   }).catch(error => {
    //     console.log(error)
    //     callback('No Data')
    //   })
    // },

    // handleSaveSingleProduct () {
    //   this.loadingPreUpload = true
    //   let data = {
    //     product_name: this.tempItem.name,
    //     product_id: this.tempItem.product_id,
    //     product_id: this.tempItem.id,
    //     has_variant: this.tempItem.has_variant,
    //     product_variant_id: this.tempItem.variant_id,
    //     item_sku: this.tempItem.SellerSku,
    //     product_description: this.tempItem.description,
    //     product_weight: this.tempItem.package_weight,
    //     product_sell_price: this.tempItem.price,
    //     product_stock_qty: this.tempItem.quantity,
    //     product_photo: this.tempItem.img_upload,
    //     meta: {
    //       primary_category_id: this.tempItem.shopee_primary_category_id,
    //     }
    //   }
    //   if (data.product_variant_id === null) {
    //     this.$delete(data, 'product_variant_id')
    //   }
    //   if (data.product_photo === null) {
    //     data.product_photo = {
    //       file_name: this.tempItem.photo_name
    //     }
    //   }
    //   this.tempItem.formRequired.map(i => {
    //     if (i.name === 'brand') {
    //       data.meta[i.name] = i.value
    //     } else {
    //       data.meta[i.name] = i.value
    //     }
    //   })
    //   console.log('meta', data)

    //   if (!this.isEdit) {
    //     savePreUpload(data).then(response => {
    //       // console.log('resp meta', response)
    //       this.loadingPreUpload = false
    //       this.showDetailItem = false
    //       this.$emit('refresh')
    //     }).catch(error => {
    //       this.$message({
    //         type: 'error',
    //         message: error.string
    //       })
    //       this.loadingPreUpload = false
    //     })
    //   } else {
    //     updatePreUpload(data).then(response => {
    //       // console.log('resp meta', response)
    //       this.loadingPreUpload = false
    //       this.showDetailItem = false
    //       this.$emit('refresh')
    //     }).catch(error => {
    //       this.$message({
    //         type: 'error',
    //         message: error.string
    //       })
    //       this.loadingPreUpload = false
    //     })
    //   }
    // },

    saveProductBatch () {
      this.loadingDuplicate = true
      let params = {
        shopee_shop_id: this.shopeeStore.shop_id
      }
      let data = {
        product_id: []
      }
      // this.dataChecked.map(i => {
      //   if (i.checked) { data.uniq_ids.push(i.uniq_id) }
      // })
      this.dataChecked.map(i => {
        if (i.checked) { data.product_id.push(i.product_id) }
      })

      // console.log(data)
      saveDuplicateMulti(params, data).then(response => {
        // console.log('resp meta', response)
        this.loadingDuplicate = false
        this.$emit('refresh')
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingDuplicate = false
      })
    },

    handleFormValidation () {
      var countError = 0
      if (!this.tempItem.weight || this.tempItem.weight <= 0) {
        this.tempItem.weightErr = 'Berat produk harus diisi'
        countError++
      }

      if (this.tempItem.formRequired) {
        this.tempItem.formRequired.map(i => {
          if (!i.value && i.is_mandatory) {
            i.error = `${i.attribute_name} harus diisi`
            countError++
          }
        })
      } else {
        countError++
      }
      // console.log('validation', this.tempItem.formRequired)
      this.$forceUpdate()
      if (countError > 0) {
        this.$message({
          type: 'error',
          message: 'Silahkan lengkapi data produk'
        })
        return false;
      }
      return true
    },

    resetFormValidation () {
      this.tempItem.weightErr = null
      if (this.tempItem.formRequired) {
        this.tempItem.formRequired.map(i => {
          i.error = null
        })
      }
      this.$forceUpdate()
    },

    applyBatchEditVariant () {
      if (this.variantChecked.length && this.tempItem.variations.length) {
        this.variantChecked.map(i => {
          this.tempItem.variations.map(j => {
            if (i.variant_id === j.variant_id) {
              if (this.form.price) {
                i.price = this.form.price
              }

              if (this.form.stock) {
                i.stock = this.form.stock
              }
              
              if (this.form.sku) {
                let splitName = i.name.split(" ")
                let joinName = splitName.join("")
                i.variation_sku = this.form.sku + joinName
              }
              
              if (Object.keys(this.form.initImageVariant).length > 0) {
                i.file_name = this.form.initImageVariant.file_name
                i.photo_xs = this.form.initImageVariant.photo_xs
              }
            }
            // if (i.price === j.price) {
            //   i.price = this.form.price
            // }
            // if (i.stok === j.stok) {
            //   i.stok = this.form.stok
            // }
            // if (i.variation_sku === j.variation_sku) {
            //   i.variation_sku = this.form.
            // }
          })
        })
      }
      this.$forceUpdate()
    },

    cancelEditProduct () {
      this.showDetailItem = false
      this.$emit('refresh')
    },

    saveSingleProductBatch (push_to_shopee) {
      this.resetFormValidation()
      if (this.handleFormValidation()) {
        if (push_to_shopee === 0) {
          this.loadingPreUpload = true
        } else {
          this.loadingDuplicate = true
        }
        
        let data = {...this.tempItem}
        let att = []
        let logs = []
        data.formRequired.map(i => {
          let attribute = {
            attributes_id: i.attribute_id,
            value: i.value,
            value_unit: i.value_unit
          }

          if (i.input_type === 'TEXT_FILED' && i.attribute_unit.length) {
            // attribute.value = i.value + " " + i.unit
            attribute.value = i.value
            attribute.value_unit = i.value_unit
          }

          if (i.input_type === 'TEXT_FILED' && i.attribute_type === 'DATE_TYPE') {
            attribute.value = moment(i.value).unix()
          }

          if (i.is_mandatory || i.value || i.value_unit) {
            att.push(attribute)
          }

          // att.push({
          //   attributes_id: i.attribute_id,
          //   value: i.value,
          //   val: i.val
          // })
        })

        this.logistics.map(i => {
          if (i.enabled) {
            logs.push({
              logistic_id: i.logistic_id,
              enabled: i.enabled
            })
          }
        })

        delete data.formRequired
        data.push_to_shopee = push_to_shopee
        data.attributes = [...att]
        data.logistics = [...logs]
        let params = {
          shopee_shop_id: this.shopeeStore.shop_id
        }

        console.log('body', data)
        saveDuplicateProduct(params, data).then(response => {
          this.loadingPreUpload = false
          this.loadingDuplicate = false
          this.showDetailItem = false
          this.$message({
            type: 'success',
            message: response.data.message
          })
          this.handleResetForm()
          this.$emit('refresh')
        }).catch(error => {
          this.loadingPreUpload = false
          this.loadingDuplicate = false
          this.$message({
            type: 'error',
            message: error.string
          })
          this.handleResetForm()
        })
      }
    },

    handleSelectBrand (data) {
      this.tempItem.formRequired.map(i => {
        if (i.name === 'brand') {
          i.value = data.id
        }
      })
    },

    handleChangeInput () {
      this.$forceUpdate()
    },

    showGroup (args) {
      this.$emit('filter', args)
    },

    loadMore () {
      this.$emit('loadmore')
    },

    handleCheck (item, idx) {
      console.log('uniq', item.product_id)
      if (this.dataChecked.length !== 20) {
        this.checkAll = false
      } else {
        this.checkAll = true
      }

      if (item.shopee_category_id === null) {
        this.$notify({
          type: 'warning',
          // title: error.response.data.error.message,
          message: 'Silahkan lengkapi data category shopee'
        })
        this.dataProd[idx].checked = false
      } else {
        const exist = this.dataChecked.some(({product_id}) => product_id === item.product_id)
        console.log('ex', exist)
        if (exist) {
          this.dataChecked.map((i, idx) => {
            if (i.product_id === item.product_id) {
              this.dataChecked.splice(idx, 1)
            }
          })
        } else {
          if (item.shopee_category_id !== null && this.dataChecked.length < 20) {
            this.dataChecked.push(item)
          } else {
            this.$notify({
              type: 'warning',
              // title: error.response.data.error.message,
              message: 'Max 20 item terpilih'
            })
          }
        }
      }
      this.$forceUpdate()
    },

    handleCheckVariant (item) {
      const exist = this.variantChecked.some(({variant_id}) => variant_id === item.variant_id)
      console.log('ex', exist)
      if (exist) {
        this.variantChecked.map((i, idx) => {
          if (i.variant_id === item.variant_id) {
            this.variantChecked.splice(idx, 1)
          }
        })
      } else {
        this.variantChecked.push(item)
      }

      if (this.variantChecked.length !== this.variations.length ) {
        this.checkAllVariant = false
      } else {
        this.checkAllVariant = true
      }
      this.$forceUpdate()
    },

    // handleSaveEdit () {
    //   // this.loadingDuplicate = true
    //   let data = this.tempItem
    //   let att = {}
    //   data.formRequired.map(i => {
    //     att[i.name] = i.value
    //   })
    //   data.shopee_attributes = att
      
    //   const exist = this.dataChecked.some(({product_id}) => product_id === data.product_id)
    //   console.log('ex', exist)
    //   if (exist) {
    //     this.dataChecked.map((i, idx) => {
    //       if (i.product_id === data.product_id) {
    //         this.dataChecked.splice(idx, 1)
    //       }
    //     })
    //     this.dataChecked.push(data)
    //   } else {
    //     if (data.shopee_primary_category_id !== null) {
    //       this.dataChecked.push(data)
    //     }
    //   }

    //   let index = null
    //   this.dataProduct.map((i,idx) => {
    //     if (i.product_id === data.product_id) {
    //       index = idx
    //     }
    //   })
    //   this.dataProduct[index] = data
    //   this.showDetailItem = false
    // },

    beforeUpload(file) {
      const isJpg = file.type === 'image/jpeg'
      // const isPng = file.type === 'image/png'
      // if (!isJpg && !isPng) {
      //   this.$message.error(this.$lang[this.langId].error_upload_photo)
      // }
      // return isJpg || isPng
      if (!isJpg) {
        this.$message.error(this.$lang[this.langId].error_upload_photo)
      }
      return isJpg
    },

    handleUploadProgress (args) {
      this.loadingUpload = true
    },

    handleUploadSuccess(response, file, fileList) {
      console.log('res', response)
      this.tempItem.img_upload = response.data[0]
      this.tempItem.file_name = response.data[0].file_name
      this.loadingUpload = false
    },

    handleUploadError(error) {
      this.loadingUpload = false
      this.$notify({
        type: 'warning',
        title: error.response.data.error.message,
        message: error.response.data.error.error
      })
    },

    handleUploadSuccessVariant(data, row) {
      this.tempItem.variations.map(i => {
        if (i.variant_id === row.variant_id) {
          i.file_name = data.file_name
        }
      })
      console.log('tempItem after upload', this.tempItem.variations)
    },

    handleUploadAllVariant(data) {
      this.form.initImageVariant = data
      // this.tempItem.variations.map(i => {
      //   i.file_name = data.file_name
      // })
      console.log('tempItem after upload', this.tempItem.variations)
    },

    handleSearch (data) {
      // console.log('data', data)
      let params = {
        search_text: '',
        search_column: 'name'
      }
      if (data !== '') {
        this.$set(params, 'search_text', data)
        this.$set(params, 'search_column', 'name')
      } else {
        this.$delete(params, 'search_text')
        this.$delete(params, 'search_column')
      }
      this.$emit('search', params)
    },

    handleSearchByEnter () {
      let params = {
        search_text: '',
        search_column: 'name'
      }
      if (this.search !== '') {
        this.$set(params, 'search_text', this.search)
        this.$set(params, 'search_column', 'name')
      } else {
        this.$delete(params, 'search_text')
        this.$delete(params, 'search_column')
      }
      this.$emit('search', params)
    },

    handleCheckAll (args) {
      console.log('dds', args)
      if (args) {
        this.dataChecked = []
        this.dataProd.map(item => {
          if (item.shopee_category_id !== null && this.dataChecked.length < 20) {
            this.dataChecked.push(item)
          }
        })
      } else {
        this.dataChecked = []
      }
    },

    handleCheckAllVariant (args) {
      console.log('dds', args)
      if (args) {
        this.variantChecked = []
        this.variations.map(item => {
          this.variantChecked.push(item)
        })
      } else {
        this.variantChecked = []
      }
    },

    randomString(len, charSet) {
      charSet = charSet || '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      var randomString = '';
      for (var i = 0; i < len; i++) {
          var randomPoz = Math.floor(Math.random() * charSet.length);
          randomString += charSet.substring(randomPoz,randomPoz+1);
      }
      return randomString;
    },

    getRandom () {
      this.tempItem.SellerSku = this.randomString(8)
    },

    isWarnData (data) {
      if (data.shopee_category_id === null ) {
        return true
      } else if ( parseInt(data.stock) < 1 ) {
        return true
      } else if ( parseInt(data.price) < 1000 ) {
        return true
      } else if ( parseInt(data.weight) < 1 ) {
        return true
      } else if ( data.sku === null ) {
        return true
      } else if (data.filename === null ) {
        return true
      } else {
        return false
      }
    }
  }
  // mounted() {
  //   this.getPengiriman()
  // }
}
</script>

<style lang="scss" scoped>
  .card-list {
    display: grid;
    grid-gap: 1em;
  }

  .card-item {
    margin-bottom: 16px !important;
  }

  .card-item:first-child {
    margin-top: 16px;
  }

  .card-item:nth-child(2) {
    margin-top: 16px; 
  }

  .el-collapse {
    box-sizing: border-box;
    border: none;
    border-radius: 25px;
    &::v-deep {
      .el-collapse-item__header {
        border: none;
        // border-radius: 25px;
        background-color: #F5F5F5;
        .el-collapse-item__arrow {
          order: -1;
          margin: 0 20px; 
        }
      }
      .el-collapse-item__wrap {
        background-color: transparent;
        border: none;
        padding-left: 52px;
        .el-collapse-item__content {
          padding-bottom: 0;
        }
        .el-collapse-item__content:first-child {
          margin-top: 10px;
        }
      }
    }
  }

  .el-form-item {
    &::v-deep {
      .el-form-item__label {
        float: none;
      }
      .el-form-item__error {
        margin-top: 6px;
      }
    }
  }
</style>