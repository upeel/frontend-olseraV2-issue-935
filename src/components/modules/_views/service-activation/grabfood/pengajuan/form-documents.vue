<template>
  <div>
    <div v-loading="loadingForm" class="color-white--bg flex-container flex-container--start full-width">
      <div class="full-width p-24" >
        <div class="font-20">Dokumen yang dibutuhkan</div>
        <div class="mt-16 border border--grey border--with-shadow radius-2 p-16 flex-container">
          <div class="container-icon">
            <svg-icon icon-class="icon-photo-ktp" />
          </div>
          <div class="font-18 full-width">Foto KTP
            <div class="font-12 color-primary pointer" @click="handleShowExample('ktp')">{{ rootLang.example }}</div>
          </div>
          <div class="full-widht">
            <div class="color-grey--bg flex-container justify-center" style="width: 56px; height: 56px">
              <el-upload
                v-loading="loadingUpload"
                :action="uploadPhotoUrl"
                :headers="headers"
                :before-upload="beforeUpload"
                :show-file-list="false"
                :on-progress="handleUploadProgress"
                :on-success="handleUploadIdCardSuccess"
                :on-error="handleUploadError"
                list-type="document-grabfood"
                >
                <img
                  v-if="Object.keys(formData.thumbnail_ktp).length !== 0"
                  :src="formData.thumbnail_ktp.photo_md" alt=""
                  class="img-document-grabfood"
                >
                <i v-else class="el-icon-camera"></i>
              </el-upload>
            </div>
          </div>
        </div>

        <div class="mt-16 border border--grey border--with-shadow radius-2 p-16 flex-container">
          <div class="container-icon">
            <svg-icon icon-class="icon-photo-selfie" />
          </div>
          <div class="font-18 full-width">Foto selfie pegang KTP
            <div class="font-12 color-primary pointer" @click="handleShowExample('ktp_selfie')">{{ rootLang.example }}</div>
          </div>
          <div class="full-widht">
            <div class="color-grey--bg flex-container justify-center" style="width: 56px; height: 56px">
              <el-upload
                v-loading="loadingUpload"
                :action="uploadPhotoUrl"
                :headers="headers"
                :before-upload="beforeUpload"
                :show-file-list="false"
                :on-progress="handleUploadProgress"
                :on-success="handleUploadIdCardSelfieSuccess"
                :on-error="handleUploadError"
                list-type="document-grabfood"
                >
                <img
                  v-if="Object.keys(formData.thumbnail_selfie_with_ktp).length !== 0"
                  :src="formData.thumbnail_selfie_with_ktp.photo_md" alt=""
                  class="img-document-grabfood"
                >
                <i v-else class="el-icon-camera"></i>
              </el-upload>
            </div>
          </div>
        </div>

        <div class="mt-16 border border--grey border--with-shadow radius-2 p-16 flex-container">
          <div class="container-icon">
            <svg-icon icon-class="icon-store-black-rooftop" />
          </div>
          <div class="font-18 full-width">Foto outlet tampak depan
            <div class="font-12 color-primary pointer" @click="handleShowExample('outlet_depan')">{{ rootLang.example }}</div>
          </div>
          <div class="full-widht">
            <div class="color-grey--bg flex-container justify-center" style="width: 56px; height: 56px">
              <el-upload
                v-loading="loadingUpload"
                :action="uploadPhotoUrl"
                :headers="headers"
                :before-upload="beforeUpload"
                :show-file-list="false"
                :on-progress="handleUploadProgress"
                :on-success="handleUploadFrontStoreSuccess"
                :on-error="handleUploadError"
                list-type="document-grabfood"
                >
                <img
                  v-if="Object.keys(formData.thumbnail_front_look_store).length !== 0"
                  :src="formData.thumbnail_front_look_store.photo_md" alt=""
                  class="img-document-grabfood"
                >
                <i v-else class="el-icon-camera"></i>
              </el-upload>
            </div>
          </div>
        </div>

        <div class="mt-16 border border--grey border--with-shadow radius-2 p-16 flex-container">
          <div class="container-icon">
            <svg-icon icon-class="icon-store-black-rooftop" />
          </div>
          <div class="font-18 full-width">Foto outlet tampak dalam
            <div class="font-12 color-primary pointer" @click="handleShowExample('outlet_dalam')">{{ rootLang.example }}</div>
          </div>
          <div class="full-widht">
            <div class="color-grey--bg flex-container justify-center" style="width: 56px; height: 56px">
              <el-upload
                v-loading="loadingUpload"
                :action="uploadPhotoUrl"
                :headers="headers"
                :before-upload="beforeUpload"
                :show-file-list="false"
                :on-progress="handleUploadProgress"
                :on-success="handleUploadInsideStoreSuccess"
                :on-error="handleUploadError"
                list-type="document-grabfood"
                >
                <img
                  v-if="Object.keys(formData.thumbnail_look_inside_store).length !== 0"
                  :src="formData.thumbnail_look_inside_store.photo_md" alt=""
                  class="img-document-grabfood"
                >
                <i v-else class="el-icon-camera"></i>
              </el-upload>
            </div>
          </div>
        </div>
      </div>
      <div class="full-width p-24">
        <div class="mt-45 border border--grey border--with-shadow radius-2 p-16 flex-container">
          <div class="container-icon">
            <svg-icon icon-class="icon-photo-document" />
          </div>
          <div class="font-18 full-width">Foto buku rekening
            <div class="font-12 color-primary pointer" @click="handleShowExample('buku_rekening')">{{ rootLang.example }}</div>
          </div>
          <div class="full-widht">
            <div class="color-grey--bg flex-container justify-center" style="width: 56px; height: 56px">
              <el-upload
                v-loading="loadingUpload"
                :action="uploadPhotoUrl"
                :headers="headers"
                :before-upload="beforeUpload"
                :show-file-list="false"
                :on-progress="handleUploadProgress"
                :on-success="handleUploadRekBookSuccess"
                :on-error="handleUploadError"
                list-type="document-grabfood"
                >
                <img
                  v-if="Object.keys(formData.thumbnail_sampul_tabungan).length !== 0"
                  :src="formData.thumbnail_sampul_tabungan.photo_md" alt=""
                  class="img-document-grabfood"
                >
                <i v-else class="el-icon-camera"></i>
              </el-upload>
            </div>
          </div>
        </div>

        <div class="mt-16 border border--grey border--with-shadow radius-2 p-16 flex-container">
          <div class="container-icon">
            <svg-icon icon-class="icon-photo-logo" />
          </div>
          <div class="font-18 full-width">Foto Logo</div>
          <div class="full-widht">
            <div class="color-grey--bg flex-container justify-center" style="width: 56px; height: 56px">
              <el-upload
                v-loading="loadingUpload"
                :action="uploadPhotoUrl"
                :headers="headers"
                :before-upload="beforeUpload"
                :show-file-list="false"
                :on-progress="handleUploadProgress"
                :on-success="handleUploadLogoSuccess"
                :on-error="handleUploadError"
                list-type="document-grabfood"
                >
                <img
                  v-if="Object.keys(formData.thumbnail_logo).length !== 0"
                  :src="formData.thumbnail_logo.photo_md" alt=""
                  class="img-document-grabfood"
                >
                <i v-else class="el-icon-camera"></i>
              </el-upload>
            </div>
          </div>
        </div>

        <div class="mt-16 border border--grey border--with-shadow radius-2 p-16 flex-container">
          <div class="container-icon">
            <svg-icon icon-class="icon-photo-list-menu" />
          </div>
          <div class="font-18 full-width">Daftar Menu
            <div class="font-12">1 gambar minimal 3 menu</div>
            <div class="font-12 color-primary pointer" @click="handleShowExample('daftar_menu')">{{ rootLang.example }}</div>
          </div>
          <div class="full-widht">
            <div class="color-grey--bg flex-container justify-center" style="width: 56px; height: 56px">
              <el-upload
                v-loading="loadingUpload"
                :action="uploadPhotoUrl"
                :headers="headers"
                :before-upload="beforeUpload"
                :show-file-list="false"
                :on-progress="handleUploadProgress"
                :on-success="handleUploadMenuSuccess"
                :on-error="handleUploadError"
                list-type="document-grabfood"
                >
                <img
                  v-if="Object.keys(formData.thumbnail_menu_1).length !== 0"
                  :src="formData.thumbnail_menu_1.photo_md" alt=""
                  class="img-document-grabfood"
                >
                <i v-else class="el-icon-camera"></i>
              </el-upload>
            </div>
          </div>
        </div>

        <div class="mt-16 border border--grey border--with-shadow radius-2 p-16 flex-container">
          <div class="container-icon">
            <svg-icon icon-class="icon-photo-product" />
          </div>
          <div class="font-18 full-width">Foto produk
            <div class="font-12">1 gambar minimal 1 produk</div>
            <div class="font-12 color-primary pointer" @click="handleShowExample('produk')">{{ rootLang.example }}</div>
          </div>
          <div class="full-widht">
            <div class="color-grey--bg flex-container justify-center" style="width: 56px; height: 56px">
              <el-upload
                v-loading="loadingUpload"
                :action="uploadPhotoUrl"
                :headers="headers"
                :before-upload="beforeUpload"
                :show-file-list="false"
                :on-progress="handleUploadProgress"
                :on-success="handleUploadProductSuccess"
                :on-error="handleUploadError"
                list-type="document-grabfood"
                >
                <img
                  v-if="Object.keys(formData.thumbnail_signature_product).length !== 0"
                  :src="formData.thumbnail_signature_product.photo_md" alt=""
                  class="img-document-grabfood"
                >
                <i v-else class="el-icon-camera"></i>
              </el-upload>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="px-24">
      <el-button
        :disabled="disableNext"
        class="mt-24 btn-block color-grabfood--bg color-white"
        @click="submit">
        {{ rootLang.next }} →
      </el-button>
    </div>

    <el-dialog
      :visible.sync="showExample"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="handleCloseExample"
      append-to-body
      custom-class="dialog-transparant-bg">
      <div>
        <template v-for="(item, idx) in dataFoto">
          <el-image
            v-if="item.active === 1"
            :key="idx"
            :src="item.url"
          />
        </template>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import { baseApi } from 'src/http-common.js'
export default {
  name: 'FormDocuments',
  mixins: [basicComputedMixin],

  props: {
    storeHasIntegratedBefore: {
      type: Number,
      default: 0
    },
  },

  data() {
    return {
      dataStore: {},
      showExample: false,
      dataFoto: [
        {
          id: 'ktp',
          active: 0,
          url: '/static/img/service-activation/grab/ktp.png'
        },
        {
          id: 'ktp_selfie',
          active: 0,
          url: '/static/img/service-activation/grab/ktp_selfie.png'
        },
        {
          id: 'outlet_depan',
          active: 0,
          url: '/static/img/service-activation/grab/depan.png'
        },
        {
          id: 'outlet_dalam',
          active: 0,
          url: '/static/img/service-activation/grab/dalam.png'
        },
        {
          id: 'buku_rekening',
          active: 0,
          url: '/static/img/service-activation/grab/buku_tabungan.png'
        },
        {
          id: 'daftar_menu',
          active: 0,
          url: '/static/img/service-activation/grab/menu_makanan.png'
        },
        {
          id: 'produk',
          active: 0,
          url: '/static/img/service-activation/grab/makanan.png'
        }
      ],
      loadingUpload: false,
      formData: {
        thumbnail_ktp: [],
        thumbnail_selfie_with_ktp: [],
        thumbnail_front_look_store: [],
        thumbnail_look_inside_store: [],
        thumbnail_sampul_tabungan: [],
        thumbnail_menu_1: [],
        thumbnail_signature_product: [],
        thumbnail_logo: []
      },
      hasUploadAgain: 0
    }
  },

  computed: {
    uploadPhotoUrl() {
      return baseApi(this.selectedStore.url_id, this.langId, 'activation/service/upload')
    },
    headers() {
      return {
        'Authorization': 'Bearer ' + this.token.access_token
      }
    },

    disableNext () {
      if (this.formData.thumbnail_ktp.photo_md && this.formData.thumbnail_selfie_with_ktp.photo_md &&
        this.formData.thumbnail_front_look_store.photo_md && this.formData.thumbnail_look_inside_store.photo_md &&
        this.formData.thumbnail_sampul_tabungan.photo_md && this.formData.thumbnail_logo.photo_md &&
        this.formData.thumbnail_menu_1.photo_md && this.formData.thumbnail_signature_product.photo_md) {
        return false
      } else {
        return true
      }
    }
  },

  methods: {
    handleShowExample(args) {
      this.dataFoto.map(i => { i.active = 0; if (i.id === args) { i.active = 1} })
      this.showExample = true
    },

    handleCloseExample() {
      this.dataFoto.map(i => { i.active = 0; })
      this.showExample = false
    },

    beforeUpload(file) {
      const isJpg = file.type === 'image/jpeg'
      const isPng = file.type === 'image/png'
      if (!isJpg && !isPng) {
        this.$message.error(this.$lang[this.langId].error_upload_photo)
      }
      return isJpg || isPng
    },

    handleUploadIdCardSuccess(response, file, fileList) {
      this.formData.thumbnail_ktp = response[0]
      this.loadingUpload = false
      this.setUpload()
    },

    handleUploadIdCardSelfieSuccess(response, file, fileList) {
      this.formData.thumbnail_selfie_with_ktp = response[0]
      this.loadingUpload = false
      this.setUpload()
    },

    handleUploadFrontStoreSuccess(response, file, fileList) {
      this.formData.thumbnail_front_look_store = response[0]
      this.loadingUpload = false
      this.setUpload()
    },

    handleUploadInsideStoreSuccess(response, file, fileList) {
      this.formData.thumbnail_look_inside_store = response[0]
      this.loadingUpload = false
      this.setUpload()
    },
    
    handleUploadRekBookSuccess(response, file, fileList) {
      this.formData.thumbnail_sampul_tabungan = response[0]
      this.loadingUpload = false
      this.setUpload()
    },

    handleUploadLogoSuccess(response, file, fileList) {
      this.formData.thumbnail_logo = response[0]
      this.loadingUpload = false
      this.setUpload()
    },

    handleUploadMenuSuccess(response, file, fileList) {
      this.formData.thumbnail_menu_1 = response[0]
      this.loadingUpload = false
      this.setUpload()
    },

    handleUploadProductSuccess(response, file, fileList) {
      this.formData.thumbnail_signature_product = response[0]
      this.loadingUpload = false
      this.setUpload()
    },

    setUpload () {
      if (this.storeHasIntegratedBefore === 1) {
        this.hasUploadAgain ++
      }
    },

    handleUploadProgress (args) {
      this.loadingUpload = true
    },

    handleUploadError(err) {
      this.loadingUpload = false
      this.$notify({
        type: 'warning',
        message: this.rootLang.file_too_large,
        title: 'Error'
      })
    },

    submit () {
      let documents = {
        thumbnail_ktp: this.formData.thumbnail_ktp.photo_md,
        thumbnail_selfie_with_ktp: this.formData.thumbnail_selfie_with_ktp.photo_md,
        thumbnail_front_look_store: this.formData.thumbnail_front_look_store.photo_md,
        thumbnail_look_inside_store: this.formData.thumbnail_look_inside_store.photo_md,
        thumbnail_sampul_tabungan: this.formData.thumbnail_sampul_tabungan.photo_md,
        thumbnail_menu_1: this.formData.thumbnail_menu_1.photo_md,
        thumbnail_signature_product: this.formData.thumbnail_signature_product.photo_md,
        thumbnail_logo: this.formData.thumbnail_logo.photo_md
      }
      this.$emit('submit', documents)
    },

    refreshData () {
      this.formData = {
        thumbnail_ktp: [],
        thumbnail_selfie_with_ktp: [],
        thumbnail_front_look_store: [],
        thumbnail_look_inside_store: [],
        thumbnail_sampul_tabungan: [],
        thumbnail_menu_1: [],
        thumbnail_signature_product: [],
        thumbnail_logo: []
      }
    },

    setDataPhoto (data) {
      if (this.hasUploadAgain === 0) {
        this.formData = {
          thumbnail_ktp: { photo_md: data.thumbnail_ktp },
          thumbnail_selfie_with_ktp: { photo_md: data.thumbnail_selfie_with_ktp },
          thumbnail_front_look_store: { photo_md: data.thumbnail_front_look_store },
          thumbnail_look_inside_store: { photo_md: data.thumbnail_look_inside_store },
          thumbnail_sampul_tabungan: { photo_md: data.thumbnail_sampul_tabungan },
          thumbnail_menu_1: { photo_md: data.thumbnail_menu_1 },
          thumbnail_signature_product: { photo_md: data.thumbnail_signature_product },
          thumbnail_logo: { photo_md: data.thumbnail_logo }
        }
      }
    }
  }
}
</script>