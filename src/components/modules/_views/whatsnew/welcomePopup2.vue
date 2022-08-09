<template>
  <el-dialog 
    :visible.sync="showPopup"
    :show-close="true"
    :before-close="handleClose"
    width="672px"
    class="dialog-whatsnew">
    <!-- <template v-if="step === 1"> -->
      <div>
        <div class="flex-container justify-center pb-24 mt-24">
          <iframe width="608" height="342" class="radius-10 box-shadow-3 yvideo" :src="vidData"></iframe>
        </div>
        <div class="color-white--bg p-32">
          <perfect-scrollbar ref="scrollbarterm" class="scrollItem">
            <div>Berikut beberapa petunjuk awal yang dapat membantu Anda memulai dengan lancar.</div>
            <div v-for="(item, key) in dataStep" :key="key" class="mt-16">
              <div class="flex-container">
                <div class="step--item-number">{{ item.id }}</div>
                <div>
                  <span>{{ item.text }}</span>
                </div>
              </div>
              <div class="flex-container mt-12" style="margin-left: 40px">
                <div v-for="(itemapp, itemappKey) in item.link" :key="itemappKey" class="px-4 pointer" @click="openPage(itemapp.src)">
                  <img :src="itemapp.img">
                </div>
              </div>
            </div>
          </perfect-scrollbar>
        </div>
      </div>
      <div slot="footer">
        <div class="text-center mb-24">
          <div class="flex-container justify-center">
            <svg-icon icon-class="icon-phone-classic-black" style="font-size: 32px"/>
            <div class="text-left font-normal px-12">
              Call Center
              <div class="font-bold font-16">0811-1956-9188</div>
            </div>
            <el-button type="success" class="radius-28" @click="openWa">
              <div class="flex-container">
                <svg-icon icon-class="whatsapp" style="font-size: 32px"/>
                <div class="text-left font-normal px-12">
                  Hubungi Kami via
                  <div class="font-bold">Whatsapp</div>
                </div>
              </div>
            </el-button>
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
    },
  },

  data() {
    return {
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

  computed : {
    vidData () {
      if (this.showPopup) {
        return 'https://www.youtube.com/embed/1cUpRiuRhEI'
      } else {
        return ''
      }
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
      window.open('http://bit.ly/olseraofficial')
    }
  }
}
</script>