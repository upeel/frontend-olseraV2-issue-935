<template>
  <div class="branch">
    <el-form
      :model="formData"
      :rules="rulesForm"
      label-position="top">
      <div class="row equal-cols">
        <div class="visible-lg visible-md visible-sm col-sm-6 pr-null">
          <div class="branch-left-side color-koinworks--bg">
          <img
            class="image-digipayment"
            src="/static/img/service-activation/koinwork/awesome-address-card.svg"> 
          </div>
        </div>
        <div class="col-xs-12 col-sm-6 pl-null">
          <div class="branch-right-side" style="background-color: #FFFFFF; padding: 20px;">
            <el-form-item :label="rootLang.bank_name" prop="bank_id">
              <el-select v-model="formData.bank_id" class="w-fit" size="small" filterable @change="(value) => handleSelected(value)">
                <el-option
                  v-for="(item, key) in listBank"
                  :key="key"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="rootLang.branch" prop="branch">
              <el-input v-model="formData.branch" size="small" type="text"></el-input>
            </el-form-item>
            <el-form-item :label="rootLang.account_number_bank" prop="bank_account_number">
              <el-input v-model="formData.bank_account_number" size="small" onkeydown="return ( event.ctrlKey || event.altKey 
                      || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                      || (95<event.keyCode && event.keyCode<106)
                      || (event.keyCode==8) || (event.keyCode==9) 
                      || (event.keyCode>34 && event.keyCode<40) 
                      || (event.keyCode==46) )"/>
            </el-form-item>
            <el-form-item :label="rootLang.bank_account_owner" size="small" prop="bank_owner_name">
              <el-input v-model="formData.bank_owner_name"></el-input>
            </el-form-item>

            <el-button @click="handleNext()" 
              class="btn-block color-koinworks--bg color-koinworks--border color-white"
              style="width: 88%;">
              {{rootLang.next}} <svg-icon icon-class="arrow-right"></svg-icon>
            </el-button>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import {dataBank as getDataBank} from '@/api/settlement'
import basicComputedMixin from '@/mixins/basicComputedMixin'

export default {
  name: 'dataBankIndividual',
  mixins: [basicComputedMixin],
  
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
        this.$emit('change', {'bank': this.formData})
      }
    }
  },

  mounted(){
    this.getDataBank()
  },

  methods: {
    checkTheName(val, block){
      if(val !== this.dataPeminjam.nama){
        this.$message({
          type: 'warning',
          message: 'Nama pemilik rekening tidak sesuai KTP'
        })
        this.formData.bank_owner_name = this.dataPeminjam.nama
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

    handleNext(){
      this.$emit('next', 3)
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
    }

  }
}
</script>