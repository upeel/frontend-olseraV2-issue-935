<template>
  <page-fullscreen
    title="Lengkapi Data Product"
    class="page-fullscreen-blibli"
    @close="$router.push('/service-activation-v2')">
      <div slot="title" class="flex-container">
        <h4 class="dialog-title full-width font-bold font-24">
          Lengkapi Data Produk
        </h4>
        <template>
          <el-button type="info" @click="showDetailItem = false">{{ rootLang.cancel }}</el-button>
          <el-button type="shopee" :loading="loadingPreUpload" @click="handleSaveSingleProduct">{{ lang.save }}</el-button>
        </template>
      </div>
      <div>
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
                >
                <template v-if="tempItem.img_upload !== null">
                  <el-image
                    :src="tempItem.img_upload.photo_md" alt=""
                    style="width: 100px; height: 100px; margin-right: 8px;"
                  />
                </template>
                <template v-else>
                  <el-image
                    v-if="tempItem.file_name === null"
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
          <el-input type="textarea" autosize v-model="tempItem.description" />
        </div>

        <div class="flex-container mt-8">
          <div class="full-width pr-4">
            <div class="color-info--bg p-8 mt-24 text-center">
            <div class="font-bold">{{ tempItem.olsera_category_name }}</div>
        </div>
          </div>
          <div class="full-width pl-4">
            <div v-loading="loadingRequired" class="mt-24">
              <div class="font-12">Kategory Shopee</div>
              <el-autocomplete
                v-model="tempItem.shopee_category_name"
                :fetch-suggestions="getCategorySearch" 
                placeholder="Search Category"
                class="full-width"
                @select="handleGetRequired" />
            </div>
          </div>
        </div>
        
        <div class="flex-container mt-8">
          <div class="full-width pr-4">
            <div class="font-12 mt-12">{{ lang.item_sku }} (Stock Keeping Unit)</div>

            <el-input v-model="tempItem.SellerSku" maxlength="8" @input="handleChangeInput">
              <template slot="append" ><el-button type="text" @click="getRandom"><svg-icon icon-class="refresh-ico" class="color-info pointer"  /></el-button></template>
            </el-input>
          </div>
          <div class="full-width pl-4">
            <div class="font-12">{{ lang.stock_qty }}</div>
            <el-input v-model="tempItem.stock" />
          </div>
        </div>

        <div class="color-info--bg p-8 mt-24 text-center">
          <div class="font-12" style="color: #999999">Kategory Olsera</div>
          <div class="font-bold">{{ tempItem.category_name }}</div>
        </div>

        <div v-loading="loadingRequired" class="mt-24">
          <div class="font-12">Kategory Shopee</div>
          <el-autocomplete
            v-model="tempItem.lazada_primary_category_name"
            :fetch-suggestions="getCategorySearch" 
            placeholder="Search Category"
            class="full-width"
            @select="handleGetRequired" />
        </div>

        <template v-if="tempItem.formRequired">
          <div v-for="(item, idx) in tempItem.formRequired" :key="idx" class="mt-24">
            <template v-if="item.input_type !== 'singleSelect'">
              <div class="font-12 mt-16">{{ item.label }}</div>
              <el-input :type="item.input_type" v-model="tempItem.formRequired[idx].value" @input="handleChangeInput"></el-input>
            </template>
            <template v-else-if="item.input_type === 'singleSelect'">
              <div class="font-12 mt-16">{{ item.label }}</div>
              <el-autocomplete
                v-model="tempItem.formRequired[idx].value_name"
                :fetch-suggestions="getBrandLazada" 
                placeholder="Search Brand"
                class="full-width"
                @select="selectBrandLazada"
                @input="handleChangeInput" />
            </template>
          </div>
        </template>

        <div class="mt-24">
          <el-button class="btn-block" :loading="loadingDuplicate" plain @click="saveSingleProductBatch"> Duplikat produk ini </el-button>
        </div>
      </div>
    </page-fullscreen>
</template>