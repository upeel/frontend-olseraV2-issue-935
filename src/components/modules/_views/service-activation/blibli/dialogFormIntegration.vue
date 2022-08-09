<template>
  <dialog-global
    :show="show"
    title="Otorisasi BliBli"
    @close="beforeClose">
    <div class="font-16 mb-16">
      Masukkan akun Blibli Seller Anda untuk mengintegrasikan produk dan pesanan Blibli dengan toko Olseramu
    </div>
    <div class="font-14 color-primary--soft--bg p-8 radius-10 mb-16">
      <div class="mb-16">
        Pastikan Anda telah melakukan pengaturan API Klien pada laman Blibli Seller Anda <a href="https://seller.blibli.com/api-integration/client-manager" target="_blank" rel="noopener noreferrer">https://seller.blibli.com/api-integration/client-manager</a>
      </div>
      <div class="like-list">
        <div class="like-list--item">
          <div class="container-icon mr-8" style="height: auto;">
              <svg-icon icon-class="awesome-key" class="font-20"/>
            </div>
            <div>
              Buat kata sandi API pada laman Blibli Seller terlebih dahulu.
            </div>
        </div>
        <div class="like-list--item">
          <div class="container-icon mr-8" style="height: auto;">
              <svg-icon icon-class="awesome-paste" class="font-20"/>
            </div>
            <div>
              Hubungkan API klien dengan memasukkan ID Klien Olsera berikut <strong>mta-api-olsera-a53aa</strong> pada laman Blibli Seller
            </div>
        </div>
      </div>
      <div
        class="color-primary font-bold mt-8 text-right pointer"
        role="button"
        @click="visibleOffscreenIntegrationGuide = true">
        Selengkapnya...
      </div>
    </div>
    <el-form
      :model="formDataIntegration"
      :rules="formDataIntegrationRules"
      label-position="top"
      @submit.native.prevent>
      <el-form-item
        label="Username/email"
        prop="username">
        <el-input v-model="formDataIntegration.username" type="text" />
      </el-form-item>
      <el-form-item
        label="Kata Sandi API"
        prop="api_seller_key">
        <el-input v-model="formDataIntegration.api_seller_key" type="text" />
      </el-form-item>
      <el-form-item
        label="Kode/ID Toko"
        prop="channel_id">
        <el-input v-model="formDataIntegration.channel_id" />
      </el-form-item>
      <el-form-item
        label="Kode Toko"
        prop="business_partner_code">
        <el-input v-model="formDataIntegration.business_partner_code" />
      </el-form-item>
    </el-form>
    <div class="font-12 mt-16">
      Dengan menekan tombol "Integrasikan sekarang" berarti Anda menyetujui
      <span class="color-blue-dark font-bold pointer" @click="visibleDialogToc = true">
        ketentuan dan privasi olsera.
      </span>
    </div>
    <template #footer>
      <el-button
        :disabled="computedDisableIntegrateNow"
        :loading="loadingDoIntegration"
        class="btn-block"
        type="primary"
        @click="doIntegration">
        Integrasikan Sekarang
      </el-button>
    </template>

    <offscreen-integration-guide
      :show="visibleOffscreenIntegrationGuide"
      @close="visibleOffscreenIntegrationGuide = false"
    />

    <dialog-global
      :show="visibleDialogToc"
      :show-footer="false"
      hide-esc
      title="Ketentuan dan Privasi"
      @close="visibleDialogToc = false">
      <div class="mb-12">
        Pelanggan memahami bahwa pengintegrasian ini membutuhkan email dan password akun pelanggan di Blibli.com sebagai autentikasi Blibli, namun Olsera tidak menyimpan email dan password yang telah pelanggan masukkan.
      </div>
      <div>
        Mohon untuk menjaga data email dan password Anda, Olsera tidak bertanggungjawab atas hal-hal yang terjadi diluar kendali Olsera.
      </div>
    </dialog-global>
  </dialog-global>
</template>

<script>
import DialogGlobal from '@/components/DialogGlobal'
import OffscreenIntegrationGuide from './offscreenIntegrationGuide.vue'
import { postIntegration, fetchIntegration } from '@/api/thirdParty/blibli'

export default {
  components: {
    DialogGlobal,
    OffscreenIntegrationGuide
  },

  props: {
    show: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      formDataIntegration: {
        username: '',
        api_seller_key: '',
        business_partner_code: 'OLS-70000',
        channel_id: 'Olsera Seller'
      },
      formDataIntegrationRules: {
        username: [
          { required: true, message: 'email/username is required', trigger: 'blur' },
        ],
        api_seller_key: [
          { required: true, message: 'api_seller_key is required', trigger: 'blur' },
        ],
        channel_id: [
          { required: true, message: 'channel_id is required', trigger: 'blur' },
        ],
        business_partner_code: [
          { required: true, message: 'business_partner_code is required', trigger: 'blur' },
        ]
      },
      visibleOffscreenIntegrationGuide: false,
      loadingDoIntegration: false,
      visibleDialogToc: false
    }
  },

  computed: {
    selectedStore() {
      console.log(this.$store.getters.selectedStore)
      return this.$store.getters.selectedStore
    },
    computedDisableIntegrateNow() {
      const fields = Object.keys(this.formDataIntegration)
      return fields.some(field => {
        return this.formDataIntegration[field] === ''
      })
    }
  },

  mounted() {
    fetchIntegration().then(response => {
      // console.log(response.data.data)
    })
  },

  methods: {
    beforeClose() {
      this.$emit('close')
    },
    doIntegration() {
      this.loadingDoIntegration = true
      const requestData = [
        {
          username: this.formDataIntegration.username,
          api_seller_key: this.formDataIntegration.api_seller_key,
          store_id_olsera: this.selectedStore.store_id,
          channel_id: this.formDataIntegration.channel_id,
          business_partner_code: this.formDataIntegration.business_partner_code
        }
      ]
      postIntegration(requestData).then(response => {
        this.$message({
          type: 'success',
          message: response.data.data.message
        })
        this.loadingDoIntegration = false
        this.$emit('success')
      }).catch(error => {
        this.loadingDoIntegration = false
        this.$message({
          type: 'error',
          message: error.string
        })
      })
    }
  }
}
</script>
