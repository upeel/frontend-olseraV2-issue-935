<template>
  <div class="form-wizard--withsubstep">
    <div class="form-wizard--substep">
      <div class="font-18 font-semi-bold">
        <span v-if="activeStep.component === 'DataPeminjam1'">
          {{ rootLang.borrower_data }}
        </span>
        <span v-if="activeStep.component === 'DataPeminjam2'">
          {{ rootLang.borrower_address }}
        </span>
        <span v-if="activeStep.component === 'DataPeminjam3'">
          {{ lang.bank_account }}
        </span>
      </div>
      <el-button type="success" @click="handleNext()">
        {{rootLang.next}} {{ stepKey }}/2
      </el-button>

    </div>
    <!-- <component v-bind:is="activeStep.component" @change="handleDataChange" /> -->
    <el-progress
      :percentage="progresStep" color="#E6A903" :show-text="false" type="line"
      >
    </el-progress>
    <data-peminjam-1 v-show="activeStep.component === 'DataPeminjam1'" @change="handleDataChange" />
    <data-peminjam-2 v-show="activeStep.component === 'DataPeminjam2'" @change="handleDataChange" />
    <!-- <data-peminjam-3 v-show="activeStep.component === 'DataPeminjam3'" @change="handleDataChange" :dataPeminjam="formData.data_peminjam" /> -->
    
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import DataPeminjam1 from './_dataPeminjam1'
import DataPeminjam2 from './_dataPeminjam2'
// import DataPeminjam3 from './_dataPeminjam3'

const steps = [
  {
    title: 'Data Peminjam',
    component: 'DataPeminjam1'
  },
  {
    title: 'Alamat Peminjam',
    component: 'DataPeminjam2'
  },
  // {
  //   title: 'Foto & Rekening Bank',
  //   component: 'DataPeminjam3'
  // }
]

export default {
  components: {
    DataPeminjam1,
    DataPeminjam2,
    // DataPeminjam3
  },

  mixins: [basicComputedMixin],

  data() {
    return {
      activeStep: steps[0],
      formData: {},
      progresStep: 0,
    }
  },

  computed: {
    stepKey() {
      return steps.indexOf(this.activeStep) + 1
    },

    loggedInUser() {
      return this.$store.getters.loggedInUser
    },
  },

  methods: {
    handleNext() {
      if (this.stepKey === 1) {
        console.log('Progreess', this.progresStep)
        this.activeStep = this.progresStep > 40 ? steps[(this.stepKey - 1) + 1] : this.activeStep
      } else if (this.stepKey === 2){
        // this.activeStep = this.progresStep === 100 ? steps[(this.stepKey - 1) + 1] : this.activeStep
        this.activeStep = steps[0]
        this.$emit('next', 2, this.formData)
      } 
      // else if (this.stepKey === 3){
      //   if(this.progresStep === 100){
      //     this.activeStep = steps[0]
      //     this.$emit('next', 2, this.formData)
      //   }
      // }
    },
    handleDataChange(data) {
      if(data[1] === 'bank'){
        delete this.formData['bank_0']
        delete this.formData['bank_1']
        delete this.formData['bank_2']
      }
      this.formData = { ...this.formData, ...data[0] }

      var countDataPeminjam = 0;//11
      var countAlamatKtp = 0;//7
      var countAlamatDomisili = 0;//7
      var countBank = 0;
      var countAccountValid = 0;
      var i;
      
      for (var ktp in this.formData.alamat_ktp) {
          if (this.formData.alamat_ktp.hasOwnProperty(ktp) && this.formData.alamat_ktp[ktp] !== '' && ktp !== 'kepemilikan' && ktp !== 'lama_menetap' && ktp !== 'provinsi_name' && ktp !== 'kabupaten_name' && ktp !== 'kecamatan_name') {
            ++countAlamatKtp;
          }
      }

      for (var domisili in this.formData.alamat_domisili) {
          if (this.formData.alamat_domisili.hasOwnProperty(domisili) && this.formData.alamat_domisili[domisili] !== '' && domisili !== 'kepemilikan' && domisili !== 'lama_menetap' && domisili !== 'provinsi_name' && domisili !== 'kabupaten_name' && domisili !== 'kecamatan_name') {
            ++countAlamatDomisili;
          }
      }

      for (var peminjam in this.formData.data_peminjam) {
        var emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (this.formData.data_peminjam.hasOwnProperty(peminjam) && this.formData.data_peminjam[peminjam] !== '') {
          if(peminjam === 'email'){
            
            if(emailRegex.test(this.formData.data_peminjam[peminjam]) === true && this.formData.data_peminjam[peminjam] === this.loggedInUser.email){
              ++countDataPeminjam;
            }
          }else if(peminjam === 'ktp'){
            if(this.formData.data_peminjam[peminjam].length === 16){
              ++countDataPeminjam;
            }
          }else{
            ++countDataPeminjam;
          }
        }
      }

      // for (i = 0; i < 3; i++) {
      //   if("bank_" + i in this.formData){
      //     ++countBank;
      //     if(this.formData["bank_"+i].bank_account_number !== ''){
      //       ++countAccountValid;
      //     }
      //   }
      // }

      this.progresStep = ((countDataPeminjam+countAlamatKtp+countAlamatDomisili)/(25))*100
    },
  }
}
</script>
