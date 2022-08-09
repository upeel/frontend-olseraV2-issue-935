<template>
  <div>
    <syarat v-show="showUI === 'term'" @next="handleForm"/>
    <div v-show="showUI === 'form'" class="commbank-bizloan form-wizard">
      <div class="form-wizard--step">
        <div
          v-for="(item, key) in steps"
          :key="key"
          :class="[
            completeSteps.includes(key) ? 'active-koinworks' : '',
            (key === completeSteps[completeSteps.length - 1] && key < 4) ? 'current-koinworks' : ''
          ]"
          class="form-wizard--step--item"
          @click="handleClickStep(item.id, key)">
          {{ item.id }}. {{ item.name }}
        </div>
      </div>
      <div class="submit-submision color-grey--bg">

        <data-owner v-show="activeStep === 1" @change="handleFormData" @next="handleNext" ref="dataOwner"/>

        <jumlah-pinjaman v-show="activeStep === 2" @change="handleFormData" ref="loanAmount" @next="handleNext"/>

        <data-usaha v-show="activeStep === 3" @change="handleFormData" ref="dataUsaha" @next="handleNext"/>

        <akun-bank v-show="activeStep === 4" @change="handleFormData" @next="handleNext" ref="dataBank"/>

        <ringkasan v-show="activeStep === 5" :ringkasan="this.form" @next="handleApplySubmission"/>
      </div>

    </div>

  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin';
import syarat from './_syarat';
import dataOwner from './_dataOwner';
import jumlahPinjaman from './_jumlahPinjaman';
import akunBank from './_akunBank';
import dataUsaha from './_dataUsaha';
import ringkasan from './_ringkasan';

export default {
  components: { 
    syarat,
    dataOwner,
    jumlahPinjaman,
    akunBank,
    dataUsaha,
    ringkasan
  },
  name: 'SubmisionBusiness',
  mixins: [basicComputedMixin],
  computed: {},

  watch: {},

  mounted() {},
  
  data() {
    return{
      selectedBranch: 0,
      loading: false,
      activeStep: 1,
      showUI: 'term',
      steps: [
        {id: 1, name: this.$lang[this.$store.state.userStores.langId].personal_data},
        {id: 2, name: this.$lang[this.$store.state.userStores.langId].jumlah_pinjaman},
        {id: 3, name: this.$lang[this.$store.state.userStores.langId].data_business},
        {id: 4, name: this.$store.state.userStores.lang.bank_account},
        {id: 5, name: this.$lang[this.$store.state.userStores.langId].summary}],
      completeSteps: [0],
      form: {
        owner: {
          fileIdCard: null,
          fileIdCouple: null,
          fileFamilyRegister: null,
          fileNpwp: null
        },
        amount: {},
        data_usaha: {
          fileBank: null
        },
        bank: {}
      },
    }
  },


  methods: {

    handleForm(){
      let form = this.showUI
      this.showUI = form === 'term' ? 'form' : 'term'
    },

    handleNext(item, data){
      this.handleFormData(data)

      if(this.completeSteps.indexOf(item+1) === -1){
        let toNextTab = false
        let tab = ''
        if(item === 0){
          tab = this.$lang[this.$store.state.userStores.langId].personal_data
          toNextTab = this.$refs.dataOwner.checkValidateOwner()
        }else if(item === 1){
          tab = this.$lang[this.$store.state.userStores.langId].jumlah_pinjaman
          toNextTab = this.$refs.loanAmount.checkValidateLoan()
        }else if(item === 2){
          tab = this.$lang[this.$store.state.userStores.langId].data_business
          toNextTab = this.$refs.dataUsaha.checkValidasi()
        }else if(item === 3){
          tab = this.$lang[this.$store.state.userStores.langId].bank_account
          toNextTab = this.$refs.dataBank.checkValidateBank()
        }

        if(toNextTab){
          if(item < 4){
            this.activeStep = this.steps[item+1].id
          }
          this.completeSteps.push(item+1)
        } else {
          this.$notify({
            type: 'warning',
            message: this.rootLang.complete_data_first_in +' '+ tab,
            title: 'Error'
          })
        }
      }else{
        this.activeStep = this.steps[item+1].id
      }
    },

    handleClickStep(item, key) {
      if(key in this.completeSteps){
        this.activeStep = item
      }
    },

    handleFormData(data) {
      this.form = { ...this.form, ...data }
    },

    handleApplySubmission(){
      this.$emit('doneSubmission', this.form)
    },

    validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
  }

}
</script>