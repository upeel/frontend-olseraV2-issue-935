<template>
  <el-dialog
    :visible.sync="show"
    :before-close="cancel"
    :title="rootLang.integration_grabfood"
    :show-close="false"
    append-to-body
    custom-class="without-padding mw-1020">
    <div class="flex-container no-flex-sm color-grabfood--bg">
      <div
        style="flex-basis: 50%;"
        class="flex-container flex-container--content-center color-grabfood--bg">
        <img
          width="264"
          src="/static/img/service-activation/grab/undraw_sync_files_xb3r.png">
      </div>
      <div class="p-24 word-break" style="flex-basis: 50%; background: #FFFFFF; color: #000000; height: 692px">
        <template v-if="step === 0">
          <div class="font-18 font-bold">
            Kelola menu, penjualan dan laporan transaksi GrabFood Anda langsung melalui Olsera POS. Gratis!
          </div>
          <div class="font-16 mt-16 mb-16">Berikut informasi yang perlu Anda ketahui :</div>
          <div class="like-list">
            <div class="like-list--item">
              <div class="container-icon"><svg-icon icon-class="icon-awesome-wallet"></svg-icon></div>
              <div class="ml-8"><span class="font-bold">Pencairan Dana</span> dari penjualan Grabfood akan dilakukan langsung dari pihak Grab ke Merchant</div>
            </div>
            <div class="like-list--item">
              <div class="container-icon"><svg-icon icon-class="icon-grab-mobile"></svg-icon></div>
              <div class="ml-12">
                Setelah integrasi aktif, Anda tetap dapat menggunakan Grab Merchant untuk menerima orderan yang masuk (apabila dibutuhkan). Namun untuk selanjutnya, pengaturan menu di GrabFood hanya bisa melalui Back Office Olsera (admin toko).
                <br><br> *Tampilan menu di Back Office Olsera dan di Grab merchant App akan berbeda
              </div>
            </div>
            <div class="like-list--item">
              <div class="container-icon"><svg-icon icon-class="icon-tag-discount-red"></svg-icon></div>
              <div class="ml-12">
                Untuk sementara waktu, apabila Anda menggunakan Program Pemotongan Harga di GrabFood, setelah proses integrasi, program tersebut akan di non-aktifkan sementara hingga update pengembangan berikutnya yang mendukung integrasi fitur promosi ini. (sedang dalam proses pengembangan oleh tim developer Olsera. ETA di awal September 2021)
              </div>
            </div>
            <div class="like-list--item">
              <div class="container-icon"><svg-icon icon-class="icon-tag-discount-rp-red"></svg-icon></div>
              <div class="ml-8">
                Program Promo Diskon dengan Angka Tetap di Grabfood tetap dapat dipergunakan secara normal.
              </div>
            </div>
            <div class="like-list--item">
              <div class="container-icon"><svg-icon icon-class="icon-awesome-calendar-check"></svg-icon></div>
              <div class="ml-12">
                Setelah pengajuan, tim Olsera akan melakukan verifikasi dalam waktu 2x24 jam hari kerja. Jika data telah sesuai, proses aktivasi berikutnya dari Grab akan dilakukan dalam masa waktu tambahan 3x24 jam hari kerja.
              </div>
            </div>
          </div>
          <el-button
            class="mt-24 btn-block color-grabfood--bg color-white"
            @click="handleNext">
            {{ rootLang.next }} →
          </el-button>
        </template>
        <template v-else-if="step === 1">
          <div class="font-18 font-bold">
            Dokumen yang dibutuhkan
          </div>
          <div class="font-16 mt-16 mb-16">Berikut informasi yang perlu Anda ketahui :</div>
          <div class="like-list">
            <div class="like-list--item">
              <div class="container-icon"><svg-icon icon-class="icon-photo-ktp"></svg-icon></div>
              <div class="ml-8 flex-container">Photo KTP</div>
            </div>
            <div class="like-list--item">
              <div class="container-icon"><svg-icon icon-class="icon-photo-selfie"></svg-icon></div>
              <div class="ml-12 flex-container">Foto selfie pegang KTP</div>
            </div>
            <div class="like-list--item">
              <div class="container-icon"><svg-icon icon-class="icon-store-black-rooftop"></svg-icon></div>
              <div class="ml-12 flex-container">Foto outlet tampak depan</div>
            </div>
            <div class="like-list--item">
              <div class="container-icon"><svg-icon icon-class="icon-store-black-rooftop"></svg-icon></div>
              <div class="ml-8 flex-container">Foto outlet tampak belakang</div>
            </div>
            <div class="like-list--item">
              <div class="container-icon"><svg-icon icon-class="icon-photo-document"></svg-icon></div>
              <div class="ml-12 flex-container">Foto buku rekening</div>
            </div>
            <div class="like-list--item">
              <div class="container-icon"><svg-icon icon-class="icon-photo-logo"></svg-icon></div>
              <div class="ml-12 flex-container">Foto Logo</div>
            </div>
            <div class="like-list--item">
              <div class="container-icon"><svg-icon icon-class="icon-photo-list-menu"></svg-icon></div>
              <div class="ml-12 flex-container">Daftar Menu (minimal 3)</div>
            </div>
            <div class="like-list--item">
              <div class="container-icon"><svg-icon icon-class="icon-photo-product"></svg-icon></div>
              <div class="ml-12 flex-container">Foto Produk (minimal 1)</div>
            </div>
          </div>
          <el-button
            :loading="loading"
            class="btn-block color-grabfood--bg color-white"
            style="margin-top: 111px"
            @click="submit">
            {{ rootLang.ok_integrate_now }}
          </el-button>
        </template>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
export default {
  name: 'GrabfoodDialogBeforeIntegrationV2',

  props: {
    show: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    storeHasGrab: {
      type: Number,
      default: 0
    }
  },

  mixins: [basicComputedMixin],

  data() {
    return {
      step: 0
    }
  },

  methods: {
    cancel() {
      this.$emit('cancel')
    },

    submit() {
      this.$emit('submit')
      // this.step = 0
    },

    refreshData () {
      this.step = 0
    },

    handleNext () {
      if (this.storeHasGrab === 0) {
        this.step = 1
      } else {
        this.submit()
      }
    }
  }
}
</script>
