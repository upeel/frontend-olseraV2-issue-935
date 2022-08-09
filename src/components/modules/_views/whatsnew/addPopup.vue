<template>
  <el-dialog 
    :visible.sync="showPopup"
    :show-close="true"
    :before-close="handleClose"
    width="400px"
    class="dialog-addwhatsnew">
    <!-- <template v-if="step === 1"> -->
      <div>
        <div class="p-32 text-center">
          <div class="font-24 font-bold text-center">
            AKHIRNYAA!!
          </div>
          <div class="mt-16 text-center word-break">
            Pesan menu kini bisa langsung di <span class="font-bold">gadget pelanggan Anda!</span>
            <div class="mt-16">*Khusus F&B Baru Rilis</div>
          </div>
          <hr>
          <div class="word-break mb-16">
            Hubungi <span class="color-primary font-bold" @click="openWa">Tim Marketing Olsera</span> atau 
            <div class="color-primary font-bold">+62 811-7787-870</div>
          </div>
          <el-button type="success" class="btn-block">Pelajari Lebih Lanjut</el-button>
          <el-button class="btn-block">Ingatkan Saya Nanti</el-button>
          <div class="mt-16">
            <el-checkbox v-model="checked" class="color-grey--placeholder">Jangan tampilkan lagi</el-checkbox>
          </div>
        </div>
      </div>
    <!-- </template> -->
  </el-dialog>
</template>
<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
export default {
  mixins: [basicComputedMixin],
  props: {
    showPopup: {
      type: Boolean,
      default: false
    },
    step: {
      type: Number,
      default: 1
    }
  },

  data() {
    return {
      checked: false,
      dataStep: [
        {
          id: 1,
          text: 'Pastikan Anda telah memasang aplikasi Olsera POS di gadget Anda. Cukup download dari aplikasi Appstore di iPhone/iPad atau Playstore Android dengan kata kunci "Olsera POS".',
          link: [{ img: 'static/img/google-play-badge.png', src: 'https://play.google.com/store/apps/details?id=com.olserapratama.pos'}, { img: 'static/img/app-store-badge.png', src: 'https://appsto.re/id/cIp5fb.i'}]
        },
        {
          id: 2,
          text: 'Untuk rekan-rekan yang ingin memasang Olsera POS di perangkat PC atau laptop, silakan mengunduhnya melalui link bit.ly/OlseraPC dengan mengikuti petunjuk yang ada.',
          link: [{ img: 'static/img/microsoft-badge.png', src: 'https://www.olsera.com/id/pos/windows'}]
        },
        {
          id: 3,
          text: 'Untuk admin panel atau back office Olsera, selain dapat diakses melalui web browser seperti yang Anda lakukan sekarang, juga dapat melalui aplikasi "Olsera Office" yang telah tersedia di Appstore iOS dan Playstore Android.',
          link: [{ img: 'static/img/google-play-badge.png', src: 'https://play.google.com/store/apps/details?id=com.olserapratama.office'}, { img: 'static/img/app-store-badge.png', src: 'https://apps.apple.com/id/app/olsera-office/id1478712450'}]
        },
        {
          id: 4,
          text: 'Olsera memiliki fitur yang sangat lengkap, dimana Anda akan menjumpai banyak modul yang tersedia di masa percobaan Premium. Apabila Anda memulai dengan masa percobaan Lite dan ingin beralih ke uji coba Premium, Anda dapat mengaktifkan permintaan trial secara instan melalui dasbor utama. Video tutorial pemakaian juga telah kami siapkan dan dapat Anda akses melalui link ',
          link: [{ img: 'static/img/youtube-badge.png', src: 'http://bit.ly/3qRuLHU '}]
        },
        {
          id: 5,
          text: 'Selamat memulai, Semoga usaha Anda semakin berkembang bersama Olsera.',
          link: []
        }
      ]
    }
  },

  methods: {
    handleClose () {
      this.$emit('close')
    },

    openPage (link) {
      window.open(link)
    },

    openWa () {
      window.open('https://bit.ly/OlseraNabila')
    }
  }
}
</script>