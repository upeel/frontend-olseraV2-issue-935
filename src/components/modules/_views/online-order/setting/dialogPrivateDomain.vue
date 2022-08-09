<template>
  <el-dialog 
    :visible.sync="show"
    :show-close="true"
    :before-close="handleClose"
    custom-class="dialog-card">
      <div slot="title" class="flex-container">
        <h4 class="dialog-title full-width font-bold">
          {{ rootLang.private_domain }}
        </h4>
      </div>
      <div>
        <div class="radius-10 flex-container">
          <!-- <div>
            <svg-icon icon-class="globe" class="font-20 color-grey--icon"/>
          </div> -->
          <div class="word-break font-14">
            Gunakan domain pribadi untuk layanan Online Order toko Anda. Klaim domain untuk mengganti domain dari Olsera dengan domain pribadi Anda.
          </div>
        </div>
        <div class="mt-16">
          <el-input v-model="formEditDomain.ext_domain" placeholder="Contoh, tokoku.com"></el-input>
          <el-button :loading="loadingDomain" class="btn-block mt-24" type="success" @click="save">{{ rootLang.claim_domain }}</el-button>
        </div>
        <div class="mt-24 color-grey--bg radius-10 flex-container p-8">
          <div>
            <svg-icon icon-class="information-circle" class="font-20 color-grey--icon"/>
          </div>
          <div class="ml-8 word-break font-14">
            Lakukan langkah-langkah berikut sebelum melakukan klaim domain. <span class="color-primary pointer" @click="visiblePrivateDomainDesc = true">Selengkapnya.</span>
          </div>
        </div>
      </div>

      <transition name="el-zoom-in-center">
      <div
        v-if="visiblePrivateDomainDesc"
        class="offscreen-right-sidebar">
        <div class="offscreen-right-sidebar--wrapper">
          <div class="offscreen-right-sidebar--header text-left">
            3 Langkah Klaim Domain
            <close-esc @close="visiblePrivateDomainDesc = false" />
          </div>
          <div class="mb-24">
            <div class="font-18 font-bold">1. Beli Domain</div>
            <div class="mt-8 word-break">Jika Anda belum memiliki domain, beli terlebih dahulu melalui provider pilihan Anda. Nama domain sangat penting untuk branding toko Anda. Berikut beberapa contoh provider domain :</div>
            <div class="color-primary mt-8">
              <svg-icon icon-class="external-link" />
              namecheap.com
            </div>
            <div class="color-primary mt-8">
              <svg-icon icon-class="external-link" />
              ionos.com
            </div>
            <div class="color-primary mt-8">
              <svg-icon icon-class="external-link" />
              name.com
            </div>

            <div class="font-18 font-bold mt-24">2. Arahkan Domain Ke Layanan Online Order Anda</div>
            <div class="mt-8 word-break">Arahkan domain yang telah Anda beli tersebut ke domain yang dikelola Olsera (contoh, tokoku.antarinmakan.com). Anda dapat melakukannya dengan menambahkan <span class="font-bold">CNAME Record</span> domain yang dikelola Olsera ke <span class="font-bold">DNS Records</span>. Berikut caranya :</div>
            <div class="mt-8 ml-8">
              1. Masuk ke akun situs domain provider Anda
            </div>
            <div class="mt-8 ml-8">
              2. Temukan menu untuk mengubah pengaturan DNS
            </div>
            <div class="ml-24">Biasanya berada di Admin Panel, Domain Management, DNS Configuration atau sejenisnya.</div>
            <div class="mt-8 ml-8">
              3. Tambahkan sebuah <span class="font-bold">CNAME Record</span> seperti berikut ini
            </div>
            <el-table :data="tableCname" border style="width: 100%">
              <el-table-column prop="type" label="Type" width="180"></el-table-column>
              <el-table-column prop="host" label="Host" width="180"></el-table-column>
              <el-table-column prop="answer" label="Answer"></el-table-column>
            </el-table>
            <div class="font-12 color-grey--placeholder">*Label "tokoku" hanya contoh</div>

            <div class="font-18 font-bold mt-24">3. Klaim Domain</div>
            <div class="mt-8 word-break">Setelah berhasil menambahkan <span class="font-bold">CNAME Record</span>, klaim domain pribadi tersebut pada form di atas.</div>
          </div>
        </div>
      </div>
    </transition>
  </el-dialog>
</template>
<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import CloseEsc from '@/components/modules/CloseEsc'
export default {
  name: 'DialogPrivateDomain',

  props: {
    show: {
      type: Boolean,
      default: false
    },
    formEditDomain: {
      type: Object,
      default: {}
    },
    loadingDomain: {
      type: Boolean,
      default: false
    }
  },

  components: {
    CloseEsc
  },

  mixins: [basicComputedMixin],

  data() {
    return {
      visiblePrivateDomainDesc: false,
      tableCname: [
        {
          type: 'CNAME',
          host: 'www.tokoku.com',
          answer: 'tokoku.antarinmakan.com'
        },
        {
          type: 'a record',
          host: '@',
          answer: '15.197.197.0'
        }
      ],
    }
  },

  methods: {
    save () {
      this.$emit('save', this.formEditDomain)
    },
    handleClose () {
      this.$emit('close')
    }
  }
}
</script>