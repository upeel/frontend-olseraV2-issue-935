<template>
  <el-dialog 
    :visible.sync="show"
    :show-close="false"
    :before-close="() => $emit('close')"
    custom-class="dialog-card mw-1056">
    <div slot="title" class="flex-container">
      <h4 class="dialog-title full-width">
        {{ rootLang.banner_dinein }}
      </h4>
      <div class="btn_save_dialog full-width text-right">
        <close-esc @close="$emit('close')" />
        <!-- <el-button type="info" @click="show = false">{{ lang.cancel }}</el-button>
        <el-button :loading="loadingAuto" type="success" @click="save(2)" >{{ lang.save }}</el-button> -->
      </div>
    </div>

    <div class="radius-10 color-grey--bg flex-container p-16 mb-12">
      <div>
        <svg-icon icon-class="information-circle" class="font-20 color-grey--icon"/>
      </div>
      <div class="ml-8 full-width p-8 word-break">
        {{ rootLang.info_font_banner_dinein }}
      </div>
      <div>
        <el-button type="info" @click="visibleInstallFont = true">Install</el-button>
      </div>
    </div>

    <div class="flex-container">
      <div class="full-width pr-8">
        <div class="font-12">{{ rootLang.layout_table }}</div>
        <el-select
          class="inline-form"
          style="width: 100% !important"
          v-model="layout"
          filterable
          @change="setSelectedLayout"
          :placeholder="lang.please_select" size="small">
          <el-option
            v-for="item in dataLayout"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>
      <div class="flex-container pt-10">
        <!-- <div class="full-width px-8">
          <el-button class="btn-block" type="info" @click="settingTable">Ubah Meja</el-button>
        </div> -->
        <div class="mr-8">
          <el-dropdown
            trigger="click"
            @command="settingTable">
            <span class="el-dropdown-link font-18 color-info">
              <svg-icon icon-class="more-vertical"></svg-icon>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="edit">
                {{ rootLang.change_table }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>

    <div
      v-loading="loadingLayoutItem"
      v-if="dataLayoutItems.length"
      class="mt-24 list-banner-dinein">
      <div
        v-for="(item, idx) in dataLayoutItems"
        :key="item.id"
        class="mr-8 mb-8"
        style="width: 236px; height: 139px;">
        <span class="font-14 font-bold">{{ item.name }}</span>
        <div class="mt-4 flex-container px-10 py-8 border border--grey" style="width: 236px; height: 116px;">
          <div class="border border--grey mr-16 pointer" 
            style="width: 100px; height: 100px" 
            @mouseover="showDownload('code', idx)" 
            @mouseleave="hideDownload('code', idx)"
            @click="handleDownload('code', item)">
            <img :src="item.qrcode_base64">
            <div v-show="display.code[idx]" class="flex-container justify-center" style="position: relative;top: -70px;" >
              <div class="container-icon radius-50 color-white--bg">
                <svg-icon icon-class="download" class="color-primary"></svg-icon>
              </div>
            </div>
          </div>
          <div class="border border--grey pointer" 
            style="width: 100px; height: 100px" 
            @mouseover="showDownload('img', idx)" 
            @mouseleave="hideDownload('img', idx)"
            @click="handleDownload('img', item)">
            <img :src="item.url_sample_banner.square">
            <!-- <img v-html="item.layout_baner_html.square"> -->
            <div v-show="display.image[idx]" class="flex-container justify-center" style="position: relative;top: -70px;">
              <div class="container-icon radius-50 color-white--bg">
                <svg-icon icon-class="download" class="color-primary"></svg-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-container justify-center">
      <el-pagination
        :total="params.total"
        :page-size="params.per_page"
        :current-page.sync="params.currentPage"
        background
        layout="prev, pager, next, jumper"
        @current-change="changeCurrentPage"
        @size-change="changePageTable"
      />
    </div>

    <el-dialog 
      :visible.sync="showOptionDownload"
      :show-close="false"
      :append-to-body="true"
      :before-close="cancelDownload"
      custom-class="dialog-card">
      <div slot="title" class="flex-container">
        <h4 class="dialog-title full-width">
          {{ rootLang.select_model }}
        </h4>
        <div class="btn_save_dialog full-width text-right">
          <close-esc @close="cancelDownload" />
        </div>
      </div>

      <template v-if="tempOption !== 'code'">
        <iframe
          v-for="(item) in optionDownload"
          :ref="'imageIframe' + item"
          :key="item"
          :srcdoc="downloadedImageHtml[item]"
          style="display: none;"
        />
      </template>

      <banner-square
        :qrcode="downloadedDineInBanner.qrcode"
        :table-number="downloadedDineInBanner.selectedTable"
      />
      <banner-landscape
        :qrcode="downloadedDineInBanner.qrcode"
        :table-number="downloadedDineInBanner.selectedTable"
      />
      <banner-portrait
        :qrcode="downloadedDineInBanner.qrcode"
        :table-number="downloadedDineInBanner.selectedTable"
      />

      <el-checkbox-group
        v-model="optionDownload">
        <div :class="optionDownload.potrait ? 'border border--grey color-primary--soft--bg flex-container' : 'border border--grey flex-container'" style="height: 56px">
          <div style="width: 20%" class="p-8">
            <img :src="tempData.url_sample_banner ? tempData.url_sample_banner.potrait : '/static/img/dinein_square-min.png'" style="width: 40px; height: 40px; object-fit: contain">
          </div>
          <div class="full-width font-16 font-bold">Potrait</div>
          <div style="width: 10%">
            <el-checkbox label="P" class="color-white hide-label"></el-checkbox>
          </div>
        </div>
        <div :class="optionDownload.landscape ? 'border border--grey color-primary--soft--bg flex-container' : 'border border--grey flex-container'" style="height: 56px">
          <div style="width: 20%" class="p-8">
            <img :src="tempData.url_sample_banner ? tempData.url_sample_banner.landscape : '/static/img/dinein_landscape-min.png'" style="width: 40px; height: 40px; object-fit: contain">
          </div>
          <div class="full-width font-16 font-bold">Landscape</div>
          <div style="width: 10%">
            <el-checkbox label="L" class="color-white hide-label"></el-checkbox>
          </div>
        </div>
        <div :class="optionDownload.square ? 'border border--grey color-primary--soft--bg flex-container' : 'border border--grey flex-container'" style="height: 56px">
          <div style="width: 20%" class="p-8">
            <img :src="tempData.url_sample_banner ? tempData.url_sample_banner.square : '/static/img/dinein_square-min.png'" style="width: 40px; height: 40px; object-fit: contain">
          </div>
          <div class="full-width font-16 font-bold">Square</div>
          <div style="width: 10%">
            <el-checkbox label="S" class="color-white hide-label"></el-checkbox>
          </div>
        </div>
      </el-checkbox-group>

      <el-button
        :loading="loadingDownload"
        :disabled="!optionDownload.length"
        class="btn-block mt-24"
        type="info"
        @click="downloadBase">
        Download
      </el-button>
    </el-dialog>

    <transition name="el-zoom-in-center">
      <div
        v-if="visibleInstallFont"
        class="offscreen-right-sidebar px-null">
        <div class="offscreen-right-sidebar--wrapper">
          <div class="offscreen-right-sidebar--header text-left">
            Penginstalan Font Banner
            <close-esc @close="visibleInstallFont = false" />
          </div>
          <div class="p-24 word-break font-16">
            <span>1. Download font pada link berikut, <el-button type="text" @click="handleShowDownloadfont">Download Font</el-button></span>
            <div>
              <img src="/static/img/install_font_step1.png" alt="">
            </div>
            <br>
            <span>2. Install kedua font tersebut dengan cara <span class="font-bold">klik kanan</span> pada file, pilih <span class="font-bold">Install</span></span>
            <div>
              <img src="/static/img/install_font_step2.png" alt="">
            </div>
            <br>
            <span>3. Selesai, Banner yang Anda download sekarang akan sesuai dengan templatenya </span>
          </div>
        </div>
      </div>
    </transition>
  </el-dialog>
</template>

<script>
const htmlToImage = require('html-to-image')
import { listLayout, listLayoutItem, listLayoutItemSingle, downloadBannerDinein } from '@/api/onlineorder'
import basicComputedMixin from '@/mixins/basicComputedMixin'

import CloseEsc from '@/components/modules/CloseEsc'
import bannerSquare from '../dinein-banner/square'
import bannerPortrait from '../dinein-banner/portrait'
import bannerLandscape from '../dinein-banner/landscape'
import baseURL from '@/utils/baseURL'

export default {
  name: 'DialogLayout',
  components: {
    CloseEsc,
    bannerSquare,
    bannerPortrait,
    bannerLandscape
  },

  props: {
    show: {
      type: Boolean,
      default: false
    },
  },

  mixins: [basicComputedMixin],

  data() {
    return {
      dataLayout: [],
      dataLayoutItems: [],
      layout: null,
      loadingLayoutItem: false,
      display: {
        code: [],
        image: []
      },
      showOptionDownload: false,
      optionDownload: [],
      tempData: {},
      loadingDownload: false,
      tempOption: '',
      downloadedImageHtml: [],
      imageUrls: [],
      downloadedDineInBanner: {
        selectedTable: '',
        qrcode: ''
      },
      params: {
        per_page: 15,
        currentPage: 1,
        total: 0,
        resto_layout_id: null
      },
      tempRestolayoutid: {
        id: null
      },
      visibleInstallFont: false
     }
  },

  mounted() {
    this.getBannerDinein()
  },

  methods: {
    getBannerDinein () {
      this.loadingDinein = true
      listLayout().then(response => {
        this.dataLayout = response.data.data
        this.layout = this.dataLayout[0].id
        this.loadingDinein = false
        if (this.dataLayout.length) {
          this.tempRestolayoutid = {
            id: this.dataLayout[0].id
          }
          this.getLayoutItems()
        }
      }).catch(error => {
        this.loadingDinein = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    getLayoutItems () {
      this.loadingLayoutItem = true
      // let param = {
      //   resto_layout_id: data.id
      // }
      this.params.resto_layout_id = this.tempRestolayoutid.id
      listLayoutItem(this.params).then(response => {
        this.dataLayoutItems = response.data.data
        this.dataLayoutItems.map(i => {
          this.display.code.push(false)
          this.display.image.push(false)
        })
        this.params.total = response.data.meta.total
        this.loadingLayoutItem = false
      }).catch(error => {
        this.loadingLayoutItem = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    setSelectedLayout (dataid) {
      let data = {
        id: dataid
      }
      this.params = {
        per_page: 15,
        currentPage: 1,
        total: 0,
        resto_layout_id: null
      }
      this.tempRestolayoutid = data
      this.getLayoutItems()
    },

    showDownload (item, index) {
      if (item === 'code') {
        this.display.code[index] = true
        // console.log('trace', this.dsp)
        this.$forceUpdate()
      }
      if (item === 'img') {
        this.display.image[index] = true
        this.$forceUpdate()
      }
    },

    hideDownload (item, index) {
      if (item === 'code') {
        this.display.code[index] = false
        this.$forceUpdate()
      }
      if (item === 'img') {
        this.display.image[index] = false
        this.$forceUpdate()
      }
    },

    handleDownload (item, data) {
      this.tempData = { ...data}
      this.tempOption = item
      this.showOptionDownload = true
    },

    cancelDownload () {
      this.tempData = {}
      this.tempOption = ''
      this.optionDownload = []
      this.showOptionDownload = false
    },

    getLayoutItemsDownload () {
      this.loadingDownload = true
      let param = {
        resto_layout_id: this.tempData.resto_layout_id,
        id: this.tempData.id
      }
      listLayoutItemSingle(param).then(response => {
        // this.dataLayoutItems = response.data.data
        // this.dataLayoutItems.map(i => {
        //   this.display.code.push(false)
        //   this.display.image.push(false)
        // })
        this.loadingDownload = false
      }).catch(error => {
        this.loadingDownload = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    downloadBase () {
      // console.log(this.tempData)
      this.downloadedImageHtml = []
      this.imageUrls = []
      let param = {
        resto_layout_id: this.tempData.resto_layout_id,
        id: this.tempData.id
      }

      if (this.optionDownload.length) {
        this.optionDownload.forEach((item) => {
          this.loadingDownload = true
          let data = {
            // type_baner: this.tempOption === 'code' ? 1 : 2,
            type_baner: 1,
            type_orientation: item,
            is_preview: 1
          }

          let width = 1748
          let height = 1748
          let elId = 'print-square'
          if (item === 'P') {
            height = 2680
            elId = 'print-portrait'
          } else if (item === 'L') {
            width = 2480
            elId = 'print-landscape'
          }

          downloadBannerDinein(param, data).then(response => {
            if (this.tempOption !== 'code') {
              this.$nextTick(() => {
                this.downloadedDineInBanner.qrcode = response.data.data.base64
                this.downloadedDineInBanner.selectedTable = this.tempData.name
                setTimeout(() => {
                  const node = document.getElementById(elId)
                  htmlToImage.toPng(node, {
                    quality: 1,
                    pixelRatio: 1,
                    width,
                    height
                  }).then((dataUrl) => {
                    // console.log(dataUrl)
                    this.downloadImage(dataUrl, this.tempData.resto_layout_name + '_' + this.tempData.name + '_banner-dinein.png')
                    this.loadingDownload = false
                  }).catch((error) => {
                    this.loadingDownload = false
                    this.$notify({
                      type: 'warning',
                      title: 'Error download image',
                      message: error
                    })
                  })
                }, 1000)
              })
            } else {
              this.downloadImage(response.data.data.base64, 'banner-dinein.jpeg')
              this.loadingDownload = false
            }
          }).catch(error => {
            this.loadingDownload = false
            this.$notify({
              type: 'warning',
              title: error.message,
              message: error.string
            })
          })
        })
      }
    },

    downloadImage (dataUrl, filename) {
      var link = document.createElement('a')
      document.body.appendChild(link)
      link.setAttribute('href', dataUrl)
      link.setAttribute('download', filename)
      link.click()
      document.body.removeChild(link)
    },

    settingTable () {
      this.$router.push('/restomode/posrestolayout/' + this.layout)
    },

    changeCurrentPage(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getLayoutItems()
    },

    changePageTable(val) {
      this.params.per_page = val
      this.getLayoutItems()
    },

    handleShowDownloadfont () {
      window.open( baseURL + 'download/Poppins.zip')
    }
  }
}
</script>