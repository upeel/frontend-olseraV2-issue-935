<template>
  <div class="branch">
    <el-form
      :model="formData"
      label-position="top"
      ref="data"
      @submit.native.prevent="handleNext">
      <div class="row equal-cols">
        <div class="visible-lg visible-md visible-sm col-sm-6 pr-null">
          <div class="branch-left-side color-koinworks--bg">
          <img
            class="image-digipayment"
            src="/static/img/service-activation/koinwork/loan-in-hand.svg"> 
          </div>
        </div>
        <div class="col-xs-12 col-sm-6 pl-null">
          <div class="branch-right-side" style="background-color: #FFFFFF; padding: 20px;">
            <el-form-item prop="amount">
              <el-slider
                v-model="formData.amount"
                @change="instalmentCalc"
                :min="minAmount"
                :max="2000000000"
                :step="1000000"
              />
              <input-money
                size="small"
                style="border: none;"
                v-model="formData.amount"
                @focus="minAmount = 0"
                @change="instalmentCalc"
                :minValue="10000000"
                :maxValue="2000000000"
              />
            </el-form-item>
            <el-form-item :label="rootLang.asked_term_loan" prop="plafond">
              <el-input v-model="formData.plafond" @change="instalmentCalc"
                size="small" style="width: 100%" type="number" onkeydown="return ( event.ctrlKey || event.altKey 
                          || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                          || (95<event.keyCode && event.keyCode<106)
                          || (event.keyCode==8) || (event.keyCode==9) 
                          || (event.keyCode>34 && event.keyCode<40) 
                          || (event.keyCode==46) )">
                <template slot="append">{{rootLang.months}}</template>
              </el-input>
            </el-form-item>

            <el-form-item
              :label="rootLang.loan_purpose"
              size="small"
              prop="purpose">
              <el-input :value="$lang[langId].addition_capital" readonly
                size="small" style="width: 100%">
              </el-input>
              <!-- <el-select
                v-model="formData.purpose"
                :placeholder="$lang[langId].select"
                size="small"
                style="width: 100%">
                <el-option
                  v-for="item in listPurpose"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  >
                </el-option>
              </el-select> -->
            </el-form-item>

            <el-tag size="large"
              type="info" class="w-fit break-word mb-16" style="color: #606266;">
              <el-row :gutter="10">
                <el-col :md="2" :sm="2" :xs="4">
                  <svg-icon icon-class="accounting_ico"></svg-icon>
                </el-col>
                <el-col :md="22" :sm="22" :xs="20" align="left">
                  <span class="font-10" v-loading="loadingCall">
                    {{ $lang[langId].idr_installment +' '+ formatPrice(installment)}}
                  </span>
                </el-col>
              </el-row>
            </el-tag>

            <el-button @click="handleNext()" 
              class="visible-lg visible-md visible-sm absolute-bottom btn-block color-koinworks--bg color-koinworks--border color-white"
              style="width: 88%">
              {{$lang[langId].next}} <svg-icon icon-class="arrow-right"></svg-icon>
            </el-button>

            <el-button @click="handleNext()" 
              class="visible-xs absolute-bottom btn-block color-koinworks--bg color-koinworks--border color-white"
              style="width: 88%">
              {{$lang[langId].next}} <svg-icon icon-class="arrow-right"></svg-icon>
            </el-button>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin';
import mixinAccounting from '@/mixins/mixinAccounting';
import InputMoney from '@/components/InputMoneyV2'
import { installCall } from '@/api/thirdParty/koinworks'
export default {
  name: 'jumlahPinjamanIndividual',
  mixins: [basicComputedMixin, mixinAccounting],
  props:{},
  components: {
    InputMoney
  },
  computed: {
    headers() {
      return {
        'Authorization': 'Bearer ' + this.token.access_token
      }
    },
    
    loggedInUser() {
      return this.$store.getters.loggedInUser
    },
  },
  
  watch: {
    formData: {
      deep: true,
      immediate: true,
      handler(data) {
        this.$emit('change', {amount: data})
      }
    },
  },
  
  data() {
    return{
      loadingCall: false,
      rulesOwner: {},
      listPurpose: [
        {id: 1, name: this.$lang[this.$store.state.userStores.langId].business_dev},
        {id: 2, name: this.$lang[this.$store.state.userStores.langId].addition_capital},
        {id: 3, name: this.$lang[this.$store.state.userStores.langId].stock_purchase},
        {id: 4, name: this.$lang[this.$store.state.userStores.langId].refinancing},
        {id: 5, name: this.$lang[this.$store.state.userStores.langId].cash_financing}
      ],
      minAmount: 0,
      formData: {
          amount: this.$route.query.amountTenor.amount,
          plafond: this.$route.query.amountTenor.tenor,
          purpose: 1
      },
      installment: ''
    }
  },
  mounted(){
    this.instalmentCalc()
  },
  methods: {
    inputPlafond(val){
      this.formData.plafond = val
    },
    instalmentCalc(){
      this.loadingCall = true
      if(this.formData.plafond < 6){
        this.formData.plafond = 6
      }
      if(this.formData.plafond > 24){
        this.formData.plafond = 24
      }
      if(this.formData.amount < 10000000){
        this.formData.amount = 10000000
        this.minAmount = 10000000
      }
      if(this.formData.amount > 2000000000){
        this.formData.amount = 2000000000
        this.minAmount = 10000000
      }
      let data = {
        amount: this.formData.amount,
        tenor: this.formData.plafond
      }
      installCall(data).then(async response => {
        this.installment = response.data.data.installment
        this.loadingCall = false
      }).catch(error => {
        this.loadingCall = false
        this.$message({
          type: 'error',
          message: error.string
        })
      })
    },
    handleNext (){
      this.$emit('next', 1)
    },
    checkValidateLoan(){
      let validate = false
      if(this.formData.plafond && this.formData.plafond !== '0' && this.formData.purpose){
        validate = true
      }
      return validate;
    }
  }
}
</script>