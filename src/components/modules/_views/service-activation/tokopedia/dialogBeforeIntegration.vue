<template>
  <el-dialog
    :visible.sync="show"
    :before-close="cancel"
    title="Integrasi Tokopedia"
    :show-close="false"
    append-to-body
    custom-class="without-padding mw-1020">
    <div class="flex-container no-flex-sm">
      <div
        style="flex-basis: 50%"
        class="flex-container flex-container--content-center color-tokopedia--bg">
        <img
          width="264"
          src="/static/img/service-activation/form-activation-tokopedia.png">
      </div>
      <div class="p-24" style="flex-basis: 50%">
        <div class="like-list">
          <div class="like-list--item">
            <div class="container-icon mr-8">
              <svg-icon icon-class="icon-store-black-rooftop" class="font-20"/>
            </div>
            <div>
              <div>Integrasi ini hanya dapat dilakukan jika Anda sudah terdaftar sebagai <span class="font-bold">Power Merchant</span> atau <span class="font-bold">Official Store Tokopedia.</span> Kunjungi laman berikut untuk mempelajari lebih lanjut </div>
              <div>• Menjadi Power Merchant?</div>
              <div>• Menjadi Official Store?</div>
            </div>
          </div>
          <div class="like-list--item">
            <div class="container-icon mr-8">
              <svg-icon icon-class="icon-clock-black" class="font-20"/>
            </div>
            <div>
              <div>Proses aktivasi akan membutuhkan waktu kurang lebih selama <span class="font-bold">1 jam</span> di hari kerja</div>
            </div>
          </div>
          <div class="like-list--item">
            <div class="container-icon mr-8">
              <svg-icon icon-class="icon-check-circle" class="font-20"/>
            </div>
            <div>
              <div>Pihak Tokopedia memiliki hak penuh untuk menyetujui atau menolak pengajuan integrasi.</div>
            </div>
          </div>
        </div>
        <el-button
          class="btn-block color-tokopedia--bg color-white"
          :loading="loadingGetStore"
          @click="fetchStores">
          {{ rootLang.ok_integrate_now }}
        </el-button>
      </div>

      <el-dialog
        :visible.sync="showSetup"
        :title="rootLang.access_taxes"
        :show-close="false"
        width="536px"
        append-to-body>
        <div slot="title" class="flex-container">
          <h4 class="dialog-title full-width">
            Integrasi Tokopedia
          </h4>
          <div class="btn_save_dialog full-width text-right">
            <el-button type="info" @click="showSetup = false">{{ lang.cancel }}</el-button>
            <el-button type="success" @click="save" >{{ rootLang.submit }}</el-button>
          </div>
        </div>
        <div>
          <div class="radius-10 flex-container justify-center">
            <img
                src="/static/img/service-activation/preview-link-tokped.png"
              />
          </div>
          <div class="p-8 color-info color-grey--bg flex-container mt-16 radius-10">
            <div class="container-icon">
              <svg-icon icon-class="information-circle"></svg-icon>
            </div>
            <div class="ml-8 word-break">
              {{ rootLang.integration_tokped_info }}
            </div>
          </div>
          <div class="mt-16" v-for="store in dataStore" :key="store.id">
            <div :class="computedClassStore(store)">
              <div class="flex-container p-8">
                <el-avatar
                  :src="store.logo"
                  class="mr-4"
                />
                <div class="full-width font-18">{{ store.name }}</div>
                <div class="mr-8"><el-checkbox v-model="store.check" /></div>
              </div>
              <div class="px-24 pt-16 pb-24">
                <span>Link Tokopedia</span>
                <el-input
                  :id="store.id"
                  class="input-token-pajak"
                  v-model="store.link"
                  :placeholder="rootLang.paste_url_here" size="small">
                  <div class="container-icon pointer" slot="append" @click="pasteText(store.id)">
                    <svg-icon icon-class="icon-content-paste"></svg-icon>
                  </div>
                </el-input>
              </div>
            </div>
          </div>
          <el-button
            v-if="dataStore.length < meta.total"
            :loading="loadingLoadMoreStores"
            type="info"
            class="btn-block mt-24"
            @click="loadMoreStores">
            {{ rootLang.load_more }}
          </el-button>
        </div>
      </el-dialog>

      <el-dialog
        :visible.sync="showSetupV2"
        :show-close="false"
        width="536px"
        append-to-body>
        <div slot="title" class="flex-container">
          <h4 class="dialog-title full-width">
            Integrasi Tokopedia
          </h4>
          <div class="btn_save_dialog full-width text-right">
            <el-button type="info" @click="showSetupV2 = false">{{ lang.cancel }}</el-button>
            <el-button type="success" @click="save" :disabled="disableSave">{{ rootLang.submit }}</el-button>
          </div>
        </div>
        <div>
          <div class="radius-10 flex-container justify-center">
            <img
                src="/static/img/service-activation/preview-link-tokped.png"
              />
          </div>
          <div class="p-8 color-info color-grey--bg flex-container mt-16 radius-10">
            <div class="container-icon">
              <svg-icon icon-class="information-circle"></svg-icon>
            </div>
            <div class="ml-8 word-break">
              {{ rootLang.integration_tokped_info }}
            </div>
          </div>
          <div class="mt-16 border border--blue-dark radius-5" >
            <!-- <div :class="computedClassStore(store)"> -->
              <div class="flex-container p-8">
                <el-avatar
                  :src="selectedStore.logo"
                  class="mr-4"
                />
                <div class="full-width font-18">{{ selectedStore.name }}</div>
              </div>
              <div class="px-24 pt-16 pb-24" v-for="(item, idx) in dataLink" :key="idx">
                <span>Link Tokopedia</span>
                <el-input class="input-token-pajak"
                  v-model="item.link"
                  :placeholder="rootLang.paste_url_here" size="small">
                  <div class="container-icon pointer flex-container" slot="append" >
                    <div @click="pasteText(idx)">
                      <svg-icon icon-class="icon-content-paste" ></svg-icon>
                    </div>
                    <div v-if="idx !== 0" class="font-14" @click="removeLink(idx)">
                      <i class="el-icon-close" />
                    </div>
                  </div>
                </el-input>
              </div>

              <div v-if="dataLink.length < (5 - dataMerchant.length)" class="px-8 mb-24">
                <el-button class="btn-block" @click="handleAddLink"><i class="el-icon-plus" /> {{ lang.add }} Link Tokopedia</el-button>
              </div>
            <!-- </div> -->
          </div>
        </div>
      </el-dialog>
    </div>
  </el-dialog>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import { fetchStores, fetchBranches } from '@/api/store'

export default {
  name: 'TokopediaDialogBeforeIntegration',

  props: {
    show: {
      type: Boolean,
      default: false
    },
    loadingSubmit: {
      type: Boolean,
      default: false
    },

    dataMerchant: {
      type: Array,
      default: []
    }
  },

  mixins: [basicComputedMixin],

  data() {
    return {
      showSetup: false,
      loadingGetStore: false,
      dataStore: [],
      meta: {
        total: 0,
        currentPage: 0
      },
      loadingLoadMoreStores: false,
      showSetupV2: false,
      dataLink: [
        {
          link: ''
        }
      ]
    }
  },

  computed: {
    disableSave () {
      let link = false
      if (this.dataLink.length > 0) {
        this.dataLink.map(i => {
          if (i.link === '') {
            link = true
          }
        })
      }
      return link
    }
  },

  methods: {
    cancel() {
      this.$emit('cancel')
    },

    submit() {
      this.showSetup = true
      // this.$emit('submit')
    },

    pasteText(dataId) {
      // if (this.stageLevel === 'dev') {
        navigator.clipboard.readText()
        .then(text => {
          this.dataLink.map((i, index) => {
            if (index === dataId) {
              i.link = text
            }
          })
        })
        .catch(err => {
          console.error('Failed to read clipboard contents: ', err);
        });
      // } else {
      //   navigator.clipboard.readText()
      //   .then(text => {
      //     this.dataStore.map(i => {
      //       if (i.id === dataId) {
      //         i.link = text,
      //         i.check = true
      //       }
      //     })
      //   })
      //   .catch(err => {
      //     console.error('Failed to read clipboard contents: ', err);
      //   });
      // }
    },

    computedClassStore (dataStore) {
      let clas = dataStore.check ? 'border border--primary border--with-shadow radius-2' : 'border border--grey-border border--with-shadow radius-2'
      return clas
    },

    fetchStores () {
      this.loadingGetStore = true
      let param = {
        per_page: 15
      }
      fetchBranches(param).then(async response => {
        let data = []
        data.push({
          id: this.selectedStore.store_id,
          name: this.selectedStore.name,
          logo: this.selectedStore.logo,
          check: false,
          link: ''
        })
        response.data.data.map(i => {
          // if (i.role_id === 'OW' || i.role_id === 'SP') {
            data.push({
              id: i.id,
              name: i.name,
              logo: i.logo,
              link: ''
            })
          // }
        })
        this.dataStore = [ ...data]
        this.meta.total = response.data.meta.total
        this.meta.currentPage = response.data.meta.current_page
        this.loadingGetStore = false
        // if (this.stageLevel === 'dev' || this.stageLevel === 'sit') {
          this.showSetupV2 = true
        // } else {
        //   this.showSetup = true
        // }
      }).catch(error => {
        this.loadingGetStore = false
        this.$message({
          type: 'error',
          message: error.string
        })
      })
    },

    loadMoreStores () {
      this.loadingLoadMoreStores = true
      let param = {
        per_page: 15
      }
      fetchBranches(param).then(async response => {
        response.data.data.map(i => {
          // if (i.role_id === 'OW' || i.role_id === 'SP') {
            this.dataStore.push({
              id: i.id,
              name: i.name,
              logo: i.logo,
              link: ''
            })
          // }
        })
        // this.dataStore = [ ...data]
        this.meta.total = response.data.meta.total
        this.meta.currentPage = response.data.meta.current_page
        this.loadingLoadMoreStores = false
        this.showSetup = true
      }).catch(error => {
        this.loadingLoadMoreStores = false
        this.$message({
          type: 'error',
          message: error.string
        })
      })
    },

    save () {
      // if (this.stageLevel === 'dev' || this.stageLevel === 'sit') {
        let data = [
          {
            merchant_id: this.selectedStore.store_id,
            shop_url: []
          }
        ]

        this.dataLink.map(i => {
          if (i.link === '') {
            this.$message({
              type: 'error',
              message: 'Link Tokopedia tidak boleh kosong'
            })
          } else {
            data[0].shop_url.push(i.link)
          }
        })
        this.$emit('submit', data)
      // } else {
      //   let data = []
      //   this.dataStore.map(i => {
      //     if (i.check) {
      //       data.push({
      //         merchant_id: i.id,
      //         shop_url: i.link
      //       })
      //     }
      //   })
      //   // console.log('dd', data)
      //   data.map(i => {
      //     if (i.shop_url.length === 0) {
      //       this.$message({
      //         type: 'error',
      //         message: 'Link Tokopedia tidak boleh kosong'
      //       })
      //     } else {
      //       this.showSetup = false
      //       this.$emit('submit', data)
      //     }
      //   })
      // }
    },

    handleAddLink () {
      this.dataLink.push({
        link: ''
      })
    },
    removeLink (index) {
      console.log('idc', index)
      this.dataLink.splice(index, 1)
    },

    hideShowSetup () {
      this.showSetupV2 = false
    }
  }
}
</script>
