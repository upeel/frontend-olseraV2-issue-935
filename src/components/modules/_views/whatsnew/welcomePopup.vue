<template>
  <el-dialog 
    :visible.sync="showPopup"
    :show-close="true"
    :before-close="handleClose"
    width="672px"
    class="dialog-whatsnew">
    <div slot="title" class="flex-container">
      <h4 class="dialog-title full-width">
        <div class="flex-container">
          <el-avatar
            alt="zenwel"
            :size="104"
            class="avatar-style">
            <svg-icon icon-class="freemium_icon" style="font-size: 100px"/>
          </el-avatar>
          <div class="p-24">
            <div class="font-24 color-white font-bold">Selamat datang di Olsera!</div>
            <div class="font-16 color-white font-normal mt-8">Selamat bergabung dan memulai operasional usaha yang lebih mudah, efisien dan menjanjikan bersama OlseraPOS.</div>
          </div>
        </div>
      </h4>
    </div>
    <template v-if="step === 1">
      <div>
        <div class="flex-container justify-center pb-24">
          <iframe width="608" height="342" class="radius-10 box-shadow-3" :src="vidData"></iframe>
        </div>
      </div>
      <div slot="footer">
        <div class="flex-container text-left">
          <div class="full-width">
            <img src="static/img/olsera_pos_logo.png">
            <div class="flex-container pointer">
              <div class="px-4" @click="handleOpenPagePos('android')">
                <img src="static/img/google-play-badge.png">
              </div>
              <div class="pointer" @click="handleOpenPagePos('iphone')">
                <img src="static/img/app-store-badge.png">
              </div>
              <div class="pointer" @click="handleOpenPagePos('microsoft')">
                <img src="static/img/microsoft-badge.png">
              </div>
            </div>
          </div>
          <div class="full-width">
            <img src="static/img/olsera-office-logo.png">
            <div class="flex-container">
              <div class="px-4 pointer" @click="handleOpenPageOffice('android')">
                <img src="static/img/google-play-badge.png">
              </div>
              <div class="pointer" @click="handleOpenPageOffice('iphone')">
                <img src="static/img/app-store-badge.png">
              </div>
            </div>
          </div>
        </div>
        <hr>
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
    </template>
    <template v-else-if="step === 2">
      <div class="p-24">
        <div class="color-white--bg radius-10 box-shadow-3 p-32">
          <perfect-scrollbar ref="scrollbarterm" class="scrollItem">
            <div>Berikut beberapa petunjuk awal yang dapat membantu Anda memulai dengan lancar.</div>
            <div v-for="item in dataStep" :key="item.id" class="mt-16">
              <div class="flex-container">
                <div class="step--item-number">{{ item.id }}</div>
                <div>
                  <span>{{ item.text }}</span>
                </div>
              </div>
              <div class="flex-container mt-12" style="margin-left: 40px">
                <div v-for="itemapp in item.link" :key="itemapp" class="px-4 pointer" @click="openPage(itemapp.src)">
                  <img :src="itemapp.img">
                </div>
              </div>
            </div>
          </perfect-scrollbar>
        </div>
      </div>
      <div slot="footer">
        <div class="text-center flex-container p-24 word-break font-14">Kapan pun Anda merasa perlu bantuan atau ingin berkonsultasi untuk memastikan solusi Olsera sesuai dengan kebutuhan Anda, Layanan Customer Service kami tersedia 24 jam.</div>
        <div class="text-center mb-24">
          <!-- <div class="radius-28"> -->
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
          <!-- </div> -->
        </div>
      </div>
    </template>
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
      console.log('close')
      this.step === 1 ? this.step += 1 : this.$emit('close')
    },

    handleOpenPagePos (data) {
      if (data === 'android') {
        window.open('https://play.google.com/store/apps/details?id=com.olserapratama.pos')
      }
      if (data === 'iphone') {
        window.open('https://appsto.re/id/cIp5fb.i')
      }
      if (data === 'microsoft') {
        window.open('https://www.olsera.com/id/pos/windows')
      }
    },

    handleOpenPageOffice (data) {
      if (data === 'android') {
        window.open('https://play.google.com/store/apps/details?id=com.olserapratama.office')
      }
      if (data === 'iphone') {
        window.open('https://apps.apple.com/id/app/olsera-office/id1478712450')
      }
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