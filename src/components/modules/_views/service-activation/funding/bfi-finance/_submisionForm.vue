<template>
  <div class="bfi-finance form-wizard">
    <div class="form-wizard--step">
      <div
        v-for="(item, key) in steps"
        :key="key"
        :class="[
          completeSteps.includes(key) ? 'active-bfi' : '',
          (key === completeSteps[completeSteps.length - 1] && key < 2) ? 'current-bfi' : ''
        ]"
        class="form-wizard--step--item"
        @click="handleClickStep(item.id, key)">
        {{ item.id }}. {{ item.name }}
      </div>
    </div>
    <div class="submit-submision color-grey--bg">
      <syarat v-show="activeStep === 1" :type="type" @next="handleNext"/>
      <dokumen v-show="activeStep === 2" :type="type" @change="handleFormData" ref="dataDokumen" @next="handleNext"/>
      <ringkasan v-show="activeStep === 3" :ringkasan="this.form" :type="type" @next="handleApplySubmission"/>
    </div>

  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin';
import syarat from './_syarat';
import dokumen from './_dokumen';
import ringkasan from './_ringkasan';

export default {
  components: { 
    syarat,
    dokumen,
    ringkasan
  },
  name: 'SubmisionBusiness',
  mixins: [basicComputedMixin],
  computed: {},

  watch: {},

  props: {
    type: {
      type: Object,
      default: null
    }
  },

  mounted() {},
  
  data() {
    return{
      selectedBranch: 0,
      loading: false,
      activeStep: 1,
      steps: [
        {id: 1, name: this.$lang[this.$store.state.userStores.langId].terms},
        {id: 2, name: this.$lang[this.$store.state.userStores.langId].document},
        {id: 3, name: this.$lang[this.$store.state.userStores.langId].summary}],
      completeSteps: [0],
      form: {},
    }
  },


  methods: {
    handleNext(item, data){
      this.handleFormData(data)

      if(this.completeSteps.indexOf(item+1) === -1){
        let toNextTab = false
        let tab = ''
        if(item === 0){
          toNextTab = true
        }else if(item === 1){
          tab = this.$lang[this.$store.state.userStores.langId].document
          switch(this.type.id) {
            case 1:
              toNextTab = this.$refs.dataDokumen.validateMotor()
              break;
            case 2:
              toNextTab = this.$refs.dataDokumen.validateMobil()
              break;
            case 3:
              toNextTab = this.$refs.dataDokumen.validateRumah()
              break;
            default:
              toNextTab = this.$refs.dataDokumen.validateTanpaJaminan()
          }
        }

        if(toNextTab){
          if(item < 2){
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
    }
  }

}
</script>