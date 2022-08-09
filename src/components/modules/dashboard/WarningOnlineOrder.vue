<template>
<div>
  <div v-if="!showInfoRule" class="color-warning--bg flex-container radius-10 mb-24 p-18 warning-onlineorder-dashboard">
    <div>
      <svg-icon icon-class="ico-warning-online-order" class="font-64"/>
    </div>
    <div class="color-white">
      {{ textLocation ? 
      'Hi, kami menemukan fitur Online Order Anda tidak berfungsi sebagaimana mestinya karena data lokasi toko belum dilengkapi. Lengkapi data lokasi toko sekarang!' : 
      'Anda mendapatkan pesan ini karena telah mengaktifkan layanan Online Order baik untuk Online Delivery ataupun Online Take Away. Kami akan memberlakukan pembaharuan terhitung efektif tanggal 28 Oktober 2020. Ketuk untuk pelajari selengkapnya.' 
      }}
    </div>
    <el-button class="color-warning color-warning--soft--bg" @click="handleWarning">{{ textLocation ? 'Lengkapi lokasi' : 'Pelajari Sekarang' }}</el-button>
  </div>

  <el-dialog
    :visible.sync="showWarning"
    :before-close="handleCloseMdr"
    width="536px"
    class="dialog-notif-online">
    <div slot="title" class="flex-container">
      <h4 v-if="!showInfoRule" class="dialog-title full-width">
        {{ textLocation ? 'Hi 🤚' : dataTerm.term_and_conditions[1].header }}
      </h4>
      <h4 v-else class="dialog-title full-width">
        {{ 'Kami telah memperbarui Syarat & Ketentuan Layanan untuk Online Order' }}
      </h4>
    </div>
    <div v-if="!textLocation && !showInfoRule" class="px-8" v-html="dataTerm.term_and_conditions[1].content"></div>
    <div v-else-if="showInfoRule" class="px-8 mb-24">
      Untuk meningkatkan kenyamanan dan keamanan, kami memperbarui Syarat & Ketentuan Layanan untuk Online Order dengan tanggal pembaruan terakhir di {{ dataTerm.term_and_conditions[0].flast_updated }}
    </div>
    <div v-else-if="textLocation" class="px-8 mb-24">
      Kami menemukan fitur Online Order Anda tidak berfungsi sebagaimana mestinya karena data lokasi toko belum dilengkapi. 
      <br><br>Lengkapi data lokasi toko sekarang!
    </div>
    <div v-if="!textLocation && !showInfoRule">
      <el-button type="primary" class="btn-block" @click="handleShowMdr" >Selanjutnya</el-button>
    </div>
    <div v-else-if="showInfoRule">
      <el-button type="primary" class="btn-block" @click="handleShowTnc" >Lihat Syarat & Ketentuan Layanan</el-button>
    </div>
    <div v-else-if="textLocation">
      <el-button type="primary" class="btn-block" @click="handleShowProfile = true" >Selanjutnya</el-button>
      <el-button type="text" class="btn-block" @click="handleCloseMdr" >Ok, Nanti saya cek</el-button>
    </div>
  </el-dialog>

  <el-dialog
    :visible.sync="dialogMdr"
    :show-close="false"
    :before-close="handleCloseMdr"
    width="720px"
    class="dialog-mdr"
    v-if="computedMdr.length > 0">
    <div slot="title" class="flex-container">
      <div>
        <div class="color-white--bg mr-8 flex-container justify-center" style="border-radius: 50%; box-shadow: 0px 2px 2px #0000001F; height: 32px; width: 32px">
          <svg-icon :icon-class="computedMdr[countMdr].icon" class="font-20"/>
        </div>
      </div>
      <h4 class="dialog-title full-width">
        Pembaharuan Online Order - {{ computedMdr[countMdr].id === 1 ? 'Delivery' : computedMdr[countMdr].id === 2 ? 'Take Away' : computedMdr[countMdr].id === 3 ? 'Dine In' : 'Reservation' }}
      </h4>
      <div class="btn_save_dialog text-right">
        <el-button type="success" :disabled="disableMdr" @click="handleNextMdr" >Selanjutnya</el-button>
      </div>
    </div>
    <perfect-scrollbar @ps-y-reach-end="handleScrollMdr" ref="scrollbar" class="scrollterm">
      <div class="px-32" v-html="computedMdr[countMdr].content"></div>
    </perfect-scrollbar>
  </el-dialog>

  <el-dialog
    :visible.sync="dialogTerm"
    :show-close="false"
    :before-close="handleCloseMdr"
    width="720px"
    class="dialog-mdr">
    <div slot="title" class="flex-container">
      <h4 class="dialog-title full-width">
        {{ dataTerm.term_and_conditions[0].header }}
      </h4>
      <div class="btn_save_dialog text-right full-width">
        <el-button v-if="!showInfoRule" type="info" @click="handleCloseMdr">{{ $lang[langId].disagree }}</el-button>
        <el-button type="success" :disabled="disableAgree" :loading="loadingAccept" @click="acceptTermCondition">{{ $lang[langId].agree }}</el-button>
      </div>
    </div>
    <perfect-scrollbar @ps-y-reach-end="handleScrollTerm" class="scrollterm">
      <div class="px-32" v-html="dataTerm.term_and_conditions[0].content"></div>
    </perfect-scrollbar>
    <div v-if="showInfoRule" slot="footer" class="p-8 mr-8">
      <el-button type="text" @click="downloadTnc">
        <div class="flex-container color-black">
          <div class="container-icon">
            <svg-icon icon-class="Icon-feather-file" />
          </div>
          Download PDF
        </div>
      </el-button>
    </div>
  </el-dialog>

  <setup-location
    v-show="handleShowProfile"
    :show-setup="handleShowProfile"
    :lang="lang"
    :lang-id="langId"
    @save="saveLocation"
    @close="handleCloseMdr"
  />
</div>
</template>
<script>
import { acceptTermCondition, downloadTnc } from '@/api/onlineorder'
import SetupLocation from './SetupLocation'
export default {
  name: 'WarningOnlineOrder',

  components: {
    SetupLocation
  },

  props: {
    dataServices: {
      type: Object,
      default: {
        term_and_conditions: []
      }
    },
    dataTerm: {
      type: Object,
      default: null
    },
    showWarning: {
      type: Boolean,
      default: false
    },
    textLocation: {
      type: Boolean,
      default: false
    },
    dataStore: {
      type: Object,
      default: null
    },
    showInfoRule: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    computedMdr () {
      let data = []
      if (this.dataServices.term_and_conditions) {
        this.dataServices.term_and_conditions.map(i => {
          if (this.dataServices.use_delivery === 1 && i.id === 1) {
            i.icon = 'icon-delivery-2'
            data.push(i)
          }
          if (this.dataServices.use_takeaway === 1 && i.id === 2) {
            i.icon = 'icon-takeaway'
            data.push(i)
          }
        })
      }
      return data
    }
  },

  data () {
    return {
      countMdr: 0,
      dialogMdr: false,
      dialogTerm: false,
      loadingAccept: false,
      disableMdr: true,
      disableAgree: true,
      handleShowProfile: false
    }
  },

  methods: {
    handleWarning () {
      this.countMdr = 0
      this.loadingAccept = false
    },

    handleShowMdr () {
      this.disableMdr = true
      if (this.computedMdr.length > 0) {
        this.dialogMdr = true
        this.$emit('close')
      } else {
        this.dialogTerm = true
      }
    },

    handleNextMdr () {
      this.disableMdr = true
      this.$refs.scrollbar.$el.scrollTop = 0
      if (this.computedMdr.length > 0) {
        if (this.countMdr < this.computedMdr.length - 1) {
          this.countMdr += 1
          // this.dialogMdr = true
          // console.log('dd', this.computedMdr[this.countMdr])
        } else {
          this.dialogMdr = false
          this.dialogTerm = true
        }
      } else {
        this.dialogMdr = false
        this.dialogTerm = true
      }
    },

    handleShowTnc () {
      this.dialogTerm = true
    },

    handleCloseMdr () {
      this.countMdr = 0
      this.dialogMdr = false
      this.dialogTerm = false
      this.handleShowProfile = false
      this.$emit('close')
    },

    acceptTermCondition() {
      this.loadingAccept = true
      acceptTermCondition().then(response => {
        this.loadingAccept = false
        this.handleCloseMdr()
        this.$emit('accept')
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loadingAccept = false
      })
    },

    handleScrollMdr () {
      this.disableMdr = false
    },

    handleScrollTerm () {
      this.disableAgree = false
    },

    saveLocation(dataForm) {
      this.$emit('save', dataForm)
    },

    downloadTnc() {
      downloadTnc().then((response) => {
        const fileName = 'Term_&_Condition_Online_Order.pdf'
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
      })
    }
  }
}
</script>