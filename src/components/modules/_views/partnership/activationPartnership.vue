<template>
  <el-dialog
    :visible.sync="showDialog"
    :before-close="handleClose"
    width="536px"
    class="dialog-join-partner">
    <div slot="title" >
      <div class="flex-container">
        <h4 class="font-bold">
          Gabung Partner 🤝
        </h4>
      </div>
      <span class="font-bold">Rekan untung, Anda untung</span>
    </div>
    <div class="text-center word-break">
      <el-image src="/static/img/join-partner/banner-icon-join-partner.svg"></el-image>
      <perfect-scrollbar style="height: 100%; max-height: calc(50vh - 100px);">
        <div class="mt-16 mb-8 text-left">
          Bagikan link partner Anda ke rekan wirausaha kamu untuk bergabung bersama Olsera
        </div>
        <div class="text-left mb-6">
          <div class="mb-8">✔️ Dapatkan komisi hingga<span class="font-bold">350rb</span> untuk setiap rekanmu yang berhasil mendaftar dan berlangganan <span class="font-bold">Olsera 1 tahun.</span> </div>
          <div>✔️ Rekanmu juga akan mendapatkan benefit berupa <span class="font-bold"> voucher 218rb </span> untuk tambahan masa aktif langganan.</div>
        </div>
        <div class="mt-24 text-center">
          <div class="full-width">
            <div class="font-12 color-info">Id Partner Anda</div>
            <el-input v-model="codePartner" class="color-prepend flex-container font-bold" maxlength="8" @input="handleChange">
              <template slot="prepend" >AF-</template>
              <template slot="append" ><el-button type="text" @click="getRandom"><svg-icon icon-class="refresh-ico" class="color-info pointer"  /></el-button></template>
            </el-input>
          </div>
        </div>
        <el-button type="primary" class="btn-block mt-24" :loading="loadingActivation" @click="activatePartnership">{{ rootLang.join_partner }} {{ rootLang.now }}</el-button>
      </perfect-scrollbar>
    </div>
    <div slot="footer">
      <!-- <el-button type="primary" class="btn-block mt-24" :loading="loadingActivation" @click="activatePartnership">{{ rootLang.join_partner }} {{ rootLang.now }}</el-button> -->
    </div>
  </el-dialog>
</template>
<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import { activatePartnership } from '@/api/partner'

// import InputMoney from '@/components/InputMoneyV2'

export default {
  name: 'ActivationPartnership',

  mixins: [basicComputedMixin],

  components: {
    // InputMoney
  },

  props: {
    showDialog : {
      type: Boolean,
      default: false
    }
  },

  watch: {
    showDialog (data) {
      if (data) {
        if (this.loggedInUser.name !== null) {
          let name = this.loggedInUser.name
          if (name.length > 7) {
            this.codePartner = name.slice(0, 8)
          } else {
            this.codePartner = name
          }
        } else {
          this.codePartner = this.randomString(8)
        }
      }
    }
  },

  data () {
    return {
      loadingActivation: false,
      linkDefault: 'https://www.olsera.com/pos/',
      codePartner: '',
      price: 0
    }
  },

  mounted () {
    
  },

  methods: {
    activatePartnership () {
      this.loadingActivation = true
      let data = {
        code: this.codePartner
      }
      activatePartnership(data).then(response => {
        this.loadingActivation = false
        this.$emit('activated')
      }).catch(error => {
        this.loadingActivation = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    handleClose () {
      this.$emit('close')
    },

    randomString(len, charSet) {
      charSet = charSet || '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      var randomString = '';
      for (var i = 0; i < len; i++) {
          var randomPoz = Math.floor(Math.random() * charSet.length);
          randomString += charSet.substring(randomPoz,randomPoz+1);
      }
      return randomString;
    },

    getRandom () {
      console.log('radn')
      this.codePartner = this.randomString(8)
    },

    handleChange (val) {
      // console.log('val', val.length)
      // if (val.length <= 2) {
      //   this.codePartner = 'AF-'
      // }
    }
  }
}
</script>