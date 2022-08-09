<template>
  <div class="branch">
    <el-form
      :model="formData"
      :rules="rulesForm"
      label-position="top"
      ref="data">
      <div class="row equal-cols">
        <div class="visible-lg visible-md visible-sm col-sm-6 pr-null">
          <div class="branch-left-side">
          <img
            class="image-digipayment"
            src="/static/img/digital-payment-form.svg"> 
          </div>
        </div>
        <div class="col-xs-12 col-sm-6">
          <div class="branch-right-side" style="background-color: #FFFFFF">
           <el-form-item :label="rootLang.bank_name" prop="bank_id">
              <el-select v-model="formData.bank_id" class="input-radius w-fit" size="small" filterable @change="(value) => handleSelected(value)">
                <el-option
                  v-for="(item, key) in listBank"
                  :key="key"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="rootLang.branch" prop="branch">
              <el-input class="input-radius" v-model="formData.branch" size="small" type="text"></el-input>
            </el-form-item>
            <el-form-item :label="rootLang.account_number_bank" prop="bank_account_number">
              <el-input class="input-radius" v-model="formData.bank_account_number" size="small" onkeydown="return ( event.ctrlKey || event.altKey 
                      || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                      || (95<event.keyCode && event.keyCode<106)
                      || (event.keyCode==8) || (event.keyCode==9) 
                      || (event.keyCode>34 && event.keyCode<40) 
                      || (event.keyCode==46) )"/>
            </el-form-item>
            <div>
              <label class="font-12 font-normal">
                <span style="color: #F44336">*</span> {{ rootLang.bank_account_owner }}
              </label>
              <el-tooltip class="item fl-right" effect="dark" :content="rootLang.owner_name_must_match" placement="top">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </div>
            <el-form-item size="small" prop="bank_owner_name">
              <el-input class="input-radius" v-model="formData.bank_owner_name" @change="(value) => checkTheName(value, key)"></el-input>
            </el-form-item>

            <el-button @click="handleNext()" type="primary" style="width: 88%;">
              {{rootLang.next}} <svg-icon icon-class="arrow-right"></svg-icon>
            </el-button>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin';
import {dataBank as getDataBank} from '@/api/settlement'
import { baseApi } from 'src/http-common.js'
import axios from 'axios'

export default {
  name: 'dataBankIndividual',
  mixins: [basicComputedMixin],

  props: {
    dataPemilik: {
      type: Object,
      default: null
    },
    dataForm: {
      type: Object,
      default: null
    },
  },
  
  computed: {
    
  },

  data() {
    return{
      listBank: [],
      formData: {
        bank_id: '',
        bank_name: '',
        branch: '',
        bank_owner_name: '',
        bank_account_number: ''
      },
      rulesForm: {
        bank_id: [
          {
            message: this.$store.state.userStores.lang.required,
            trigger: 'blur',
            required: true
          }
        ],
        branch: [
          {
            message: this.$store.state.userStores.lang.required,
            trigger: 'blur',
            required: true
          }
        ],
        bank_account_number: [
          {
            message: this.$store.state.userStores.lang.required,
            trigger: 'blur',
            required: true
          }
        ],
        bank_owner_name: [
          {
            message: this.$store.state.userStores.lang.required,
            trigger: 'blur',
            required: true
          }
        ]
      }
    }
  },

  watch: {
    '$store.getters.selectedStore': function() {
      this.getDataBank()
    },
    formData: {
      deep: true,
      immediate: true,
      handler(data) {
        this.$emit('change', {bank: this.formData})
      }
    }
  },

  mounted(){
    this.getDataBank()
    this.getSubmitBank()
  },

  methods: {

    getSubmitBank(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let urlSite = 'activation/service/digital-payment?store_id='+this.dataForm.store_id+'&submit_as=1&submission=5'

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, urlSite ),
        headers: headers
      }).then(response => {
        let resp = response.data.data[0]

        this.formData = {
          bank_id: resp.bank_id,
          bank_name: resp.bank_name,
          branch: resp.bank_branch_name,
          bank_owner_name: resp.bank_account_name,
          bank_account_number: resp.bank_account_number
        }

      }).catch(error => {
        if(typeof error.response.data.error.error === 'object'){
          let errorKey = Object.keys(error.response.data.error.error)[0];
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error[errorKey][0]
          })
        } else {
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
      })
    },

    checkTheName(val, block){
      if(val !== this.dataPemilik.name){
        this.$message({
          type: 'warning',
          message: this.rootLang.owner_name_must_match
        })
      }
    },

    getDataBank(){
      let param = {
        per_page: 1000
      }
      getDataBank(param).then(response => {
        this.loading = false
        this.listBank = response.data.data
      }).catch(error => {
        this.loading = false
        this.$message({
          type: 'error',
          message: error.response.data.error.error
        })
      })
    },

    handleReduceBank(key) {
      this.formData.banks.splice(key, 1)
    },

    handleSelected(val) {
      this.listBank.forEach((item, no) => {
        if(item.id === val){
          this.formData.bank_name = item.name
        }
      })
    },

    checkValidateBank(){
      let validate = false
      
      if(this.formData.bank_id !== '' && this.formData.branch !== '' && 
        this.formData.bank_owner_name !== '' && this.formData.bank_account_number){
        validate = true
      }

      return validate;
    },

    handleNext (){
      let validate = this.checkValidateBank()
      if(validate){
        this.$emit('next', 'summary', {bank: this.formData})
      }else{
        this.$notify({
          type: 'warning',
          message: this.rootLang.complete_data_first_in +' '+ this.lang.bank_account,
          title: 'Error'
        })
      }
    }
  }
}
</script>
