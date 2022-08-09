<template>
  <div class="content-wrapper">
    <section class="content">
      <div class="closable-banner newfeature-banner">
        <h1>{{ rootLang.get_promotion_materials }}</h1>
        <h3>{{ rootLang.now_easier }}</h3>

        <div class="rounded-2" />
        <div class="rounded-1" />
      </div>

      <!-- <el-row
        :gutter="10"
        class="bannertype-filter mb-16">
        <el-col
          v-for="(item, key) in filters"
          :key="key"
          :md="12"
          :tabindex="key">
          <div
            :class="[
              item.value === selectedFilterType ? 'active' : ''
            ]"
            class="bannertype-filter--item"
            @click="handleSelectFilterType(item)">
            <div>
              <div class="font-20 font-semi-bold">
                {{ item.name }}
              </div>
              <div class="font-12">
                {{ item.size }}
              </div>
            </div>
          </div>
        </el-col>
      </el-row> -->

      <div class="mb-16 flex-container flex-container--content-space-between">
        <div>
          {{ computedData.length }} {{ lang.items }}
        </div>
        <div>
          <el-input
            v-model="searchKeyword"
            :placeholder="lang.search"
            prefix-icon="el-icon-search"
            type="search"
            clearable
          />
        </div>
        <el-button
          :disabled="selectedItems.length <= 0"
          :loading="loading"
          type="success"
          @click="handleDownloadMultipleItems">
          Download <span v-show="selectedItems.length">({{ selectedItems.length }})</span>
        </el-button>
      </div>

      <el-card
        class="promotion-materials">
        <el-row
         :gutter="10">
          <el-col
            v-for="(item, key) in computedData"
            :xs="12"
            :md="6"
            :key="key">
            <div
              :class="selectedItems.includes(item.download_url) ? 'selected' : ''"
              class="promotion-materials--item">
              <div class="flex-container flex-container--content-space-between p-8">
                <div class="font-14">
                  {{ item.title }}
                </div>
                <div>
                  <input
                    v-model="selectedItems"
                    :value="item.download_url"
                    type="checkbox">
                </div>
              </div>
              <div
                class="promotion-materials--thumbnail"
                @click="handleClickItem(item)">
                <img
                  :src="baseUrlMarketing + '/thumbnails/' + item.file"
                  class="promotion-materials--thumbnail--image">
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </section>

    <el-dialog
      :visible.sync="visibleDialogItem"
      :show-close="false"
      :before-close="handleCloseDialog"
      append-to-body
      custom-class="dialog-transparent">
      <div class="flex-container mb-8">
        <div class="font-14 color-white flex-grow-1">
          {{ singleItem.title }}
        </div>
        <div class="flex-container">
          <a
            :href="singleItem.download_url"
            download
            class="mr-24 font-14 color-primary--vibrant">
            <svg-icon icon-class="download"></svg-icon> Download
          </a>
          <div
            class="color-white font-14 pointer"
            @click="handleCloseDialog">
            <svg-icon icon-class="x"></svg-icon>
          </div>
        </div>
      </div>
      <img
        v-if="singleItem.file"
        :src="baseUrlMarketing + '/banners/' + singleItem.file"
        class="w-fit">
    </el-dialog>

    <div class="floating-action-button color-whatsapp--bg">
      <a
        href="https://bit.ly/3choZJP"
        target="_blank">
        <i class="icon-whatsapp"></i> Pengajuan materi promosi
      </a>
    </div>
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import 'static/fonticon/fontello-469582f9/css/fontello.css'
import axios from 'axios'

export default {
  mixins: [basicComputedMixin],

  data() {
    return {
      loading: false,
      data: [],
      visibleDialogItem: false,
      singleItem: {},
      searchKeyword: '',
      selectedFilterType: null,
      selectedItems: []
    }
  },

  computed: {
    baseUrlMarketing() {
      return '/static/marketing-materials'
    },
    computedData() {
      let data = [...this.data]
      if (this.selectedFilterType) {
        data = data.filter(item => {
          return item.type === this.selectedFilterType
        })
      }
      if (this.searchKeyword) {
        data = data.filter(item => {
          return item.title.toLowerCase().includes(this.searchKeyword.toLowerCase())
        })
      }
      return data
    },
    filters() {
      return [
        {
          value: 1,
          name: 'Akrilik',
          size: 'A5/A4'
        },
        {
          value: 2,
          name: 'X Banner',
          size: '160cm x 60cm'
        }
      ]
    }
  },

  mounted() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      axios.get(this.baseUrlMarketing + '/data.json').then(response => {
        this.data = response.data
      })
    },
    handleClickItem(item) {
      this.singleItem = { ...item }
      this.visibleDialogItem = true
    },
    handleSelectFilterType(item) {
      if (this.selectedFilterType && this.selectedFilterType === item.value) {
        this.selectedFilterType = null
        return
      }
      this.selectedFilterType = item.value
    },
    handleCloseDialog() {
      this.visibleDialogItem = false
      this.singleItem = {}
    },
    async downloadFile(imageUrl, fileName) {
      const a = await document.createElement('a')
      a.style.display = 'none'
      document.body.appendChild(a)
      a.href = imageUrl
      a.setAttribute('download', fileName)
      return a
    },
    async handleDownloadMultipleItems() {
      await this.selectedItems.map(async(item, index) => {
        const link = await this.downloadFile(item)
        setTimeout(() => {
          link.click()
          window.URL.revokeObjectURL(link.href)
          document.body.removeChild(link)
        }, index * 1000)
      })
      this.selectedItems = []
    }
  }
}
</script>
