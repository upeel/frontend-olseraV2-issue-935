<template>
  <div class="content-wrapper">
    <!-- <home /> -->
    <section class="content">
      <div
        class="card_banner radius-10"
        style="background-image: url('/static/img/tutorial/bg-header-tutorial.svg');">
        <div class="text_banner color-white">
          <span class="title font-24">Tutorial</span>
          <div class="subtitle">Akses semua panduan Video Olsera Office di sini</div>
        </div>
      </div>

      <div class="flex-container">
        <div class="full-width" style="background-image: url('/static/img/tutorial/bg-foto-mbaknya.svg');">
          <div class="div-tutorial-ytb mr-12 p-24">
            <div>
              <div class="font-24 font-bold mb-8">Panduan Awal</div>
              <el-button type="success" @click="showPopup = true">Klik Disini</el-button>
            </div>
          </div>
        </div>
        <div class="full-width ml-12">
          <div class="flex-container text-left">
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
          </div>
        </div>
      </div>

      <div class="mb-24">
        <el-tabs v-model="activeName" class="mt-40">
          <el-tab-pane label="Tutorial" name="tutorial">
            <div slot="label" class="font-24 font-bold">Tutorial</div>
            <div
              class="table-handler-flex mt-16 mb-16">
              <el-input
                v-debounce:300ms="handleSearch"
                v-model="search"
                :placeholder="lang.search"
                class="full-width"
                clearable
                prefix-icon="el-icon-search"
                size="small"
              />
            </div>
            <div v-for="item in dataTutorial" :key="item.id" class="mt-8 profile">
              <el-button class="btn-block text-left name" @click="viewVideo(item)">{{ item.value }}</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="Bantuan" name="bantuan">
            <div slot="label" class="font-24 font-bold">Bantuan</div>
            <div class="table-handler-flex full-width text-right mt-16 mb-16">
              <el-input class="inline-form input-search full-width" clearable :placeholder="lang.search" prefix-icon="el-icon-search" v-model="search" v-debounce:300ms="handleSearch" size="small"></el-input>
            </div>
            <div v-for="item in dataHelper" :key="item.id" class="mt-8 profile">
              <el-button class="btn-block text-left name" @click="viewVideo(item)">{{ item.value }}</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <el-dialog 
        :visible.sync="showVideo"
        :show-close="true"
        :before-close="handleClose"
        :title="tempVid.title"
        custom-class="dialog-tutorial"
        width="608px">
        <div>
          <div class="flex-container justify-center pb-24">
            <iframe width="608" height="342" class="radius-10 box-shadow-3" :src="tempVid.vidData"></iframe>
          </div>
        </div>
      </el-dialog>

      <welcome-popup
        :showPopup="showPopup"
        :step="1"
        @close="showPopup = false"
      />
    </section>
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import tutorialData from './data'
import WelcomePopup from '../whatsnew/welcomePopup2'
export default {
  name: 'Tutorials',
  components: {
    WelcomePopup
  },

  mixins: [basicComputedMixin],

  data() {
    return {
      dataTutorial: [ ...tutorialData.tutorial],
      dataHelper: [ ...tutorialData.helper],
      showVideo: false,
      tempVid: {
        vidData: '',
        title: ''
      },
      search: '',
      showPopup: false,
      activeName: 'tutorial'
    }
  },

  methods: {
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

    viewVideo (data) {
      console.log(data)
      this.tempVid.vidData = data.link
      this.tempVid.title = data.value
      this.showVideo = true
    },

    handleClose () {
      this.tempVid = {
        vidData: '',
        title: ''
      }
      this.showVideo = false
    },

    handleSearch (item) {
      // let obj = data.find(o => o.value === item)
      var value,name,profile,i

      value = item.toUpperCase()
      profile = document.getElementsByClassName("profile");
      for(i=0;i<profile.length;i++){
        name = profile[i].getElementsByClassName("name");
        if (name[0].innerHTML.toUpperCase().indexOf(value) > -1) {
          profile[i].style.display = "flex";
        }else{
          profile[i].style.display = "none";
        }
      }
      console.log(profile.length)
    }
  }
}
</script>
