<template>
  <div class="form-wizard--content__wrapper">
    <div class="wizard-desc wizard-desc--image color-orange-commbank--bg">
      <img src="/static/img/commbank/loan.png" />
    </div>
    <div class="wizard-content">
      <h3 style="margin-top: 0;" class="mb-24">{{rootLang.jumlah_pinjaman}}</h3>
      <div class="flex-grow-1">
        <el-form
          :model="formData"
          label-position="top">
          <el-form-item prop="amount">
            <el-slider
              v-model="formData.amount"
              :min="10000000"
              :max="200000000"
              :step="1000000"
            />
          </el-form-item>
          <el-form-item prop="amount">
            <div class="el-input">
              <input-money
                v-model="formData.amount"
                :readOnly="true"
              />
            </div>
            <!-- <el-input-number
              v-model="formData.amount"
              :min="10000000"
              :max="200000000"
              :step="1000000"
              readonly
              step-strictly
              controls-position="right"
              style="min-width: 100%;"
            /> -->
          </el-form-item>
          <el-form-item
            :label="rootLang.asked_term_loan"
            prop="amount">
            <el-radio-group
              v-model="formData.plafond"
              class="el-radio-group__flex">
              <el-radio-button
                v-for="(item, key) in plafondOptions"
                :key="key"
                :label="item">
                {{ item }} {{rootLang.months}}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            :label="rootLang.loan_purpose"
            prop="amount">
            <el-input v-model="formData.purpose" />
          </el-form-item>
        </el-form>
      </div>
      <el-button
        type="success"
        class="btn-block"
        @click="handleSubmit">
        {{ rootLang.next }}
      </el-button>
    </div>
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import InputMoney from '@/components/InputMoneyV2'
export default {
  mixins: [basicComputedMixin],
  components: {
    InputMoney
  },
  data() {
    return {
      formData: {
        amount: 10000000,
        plafond: 12,
        purpose: 'Modal usaha'
      }
    }
  },
  computed: {
    plafondOptions() {
      return [12, 24, 36]
    }
  },
  mounted(){
    this.simulationCalc()
  },
  methods: {
    simulationCalc(){
      let simulation = this.$route.query.amountTenor
      this.formData.amount = simulation.amount > 200000000 ? 200000000 : simulation.amount
      let tenor = parseInt(simulation.tenor)
      
      if(tenor <= 12){
        this.formData.plafond = 12
      }else if(tenor > 12 && tenor <= 24){
        this.formData.plafond = 24
      }else if(tenor > 24 && tenor <= 36){
        this.formData.plafond = 36
      }else if(tenor > 36){
        this.formData.plafond = 36
      }else{
        this.formData.plafond = 12
      }
    },
    handleSubmit() {
      this.$emit('next', 1, {
        jumlah_pinjaman: this.formData
      })
    }
  }
}
</script>