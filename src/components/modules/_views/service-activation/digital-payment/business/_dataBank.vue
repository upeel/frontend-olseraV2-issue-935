<template>
  <div class="branch">
    <el-form
      :model="formData"
      label-position="top"
      ref="data">
      <div class="row equal-cols">
        <div class="visible-lg visible-md visible-sm col-sm-6 pr-null">
          <div class="branch-left-side pointer" @click="handleBranchList" style="background-color: rgb(245, 245, 245);">
            <img class="image-digipayment p-null"  style="border-radius: 50%;"
              :src="branchs[branchIdx].logo ? branchs[branchIdx].logo : '../../../../../../../static/img/no_photo.png'"/>
          <!-- <img
            class="image-digipayment"
            src="/static/img/digital-payment-form.svg">  -->
            <div class="pt-24 font-20 color-primary font-bold">{{branchs[branchIdx].name}}</div>
          </div>
        </div>
        <div class="col-xs-12 col-sm-6">
          <div class="branch-right-side" style="background-color: #FFFFFF">
           <el-form-item :label="rootLang.bank_name" prop="bank_id">
              <el-select v-model="dataBank[branchIdx].bank_id" class="input-radius w-fit" size="small" filterable @change="(value) => handleSelected(value)">
                <el-option
                  v-for="(item, key) in listBank"
                  :key="key"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="rootLang.branch" prop="branch">
              <el-input class="input-radius" v-model="dataBank[branchIdx].branch" size="small" type="text"></el-input>
            </el-form-item>
            <el-form-item :label="rootLang.account_number_bank" prop="bank_account_number">
              <el-input class="input-radius" v-model="dataBank[branchIdx].bank_account_number" size="small" onkeydown="return ( event.ctrlKey || event.altKey 
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
              <el-input class="input-radius" v-model="dataBank[branchIdx].bank_owner_name"></el-input>
            </el-form-item>

            <el-button v-if="branchIdx + 1 === branchs.length" size="small"  @click="handleNext" type="primary" style="width: 88%;">
              {{$lang[langId].finish}}
            </el-button>

            <el-button v-else @click="handleNextBranch" size="small" type="primary" style="width: 88%;">
              <span class="visible-lg visible-md visible-sm">
                {{$lang[langId].next}} {{branchIdx+1}}/{{branchs.length}} <svg-icon icon-class="arrow-right"></svg-icon>
              </span>
              <span class="visible-xs">
                <svg-icon icon-class="arrow-next"></svg-icon>
              </span>
               
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

export default {
  name: 'dataBankIndividual',
  mixins: [basicComputedMixin],
  
  computed: {
    
  },

  props: {
    branchs: {
      type: Array,
      default: null
    },

    dataBank: {
      type: Array,
      default: null
    },

    dataPemilik: {
      type: Object,
      default: null
    }
  },

  data() {
    return{
      listBank: [],
      formData: {},
      branchIdx: 0,
    }
  },

  watch: {
    '$store.getters.selectedStore': function() {
      this.getDataBank()
    }
  },

  mounted(){
    this.getDataBank()
  },

  methods: {
    handleBranchList(){
      this.$emit('list')
    },

    handleNextBranch(){
      let inBranch = this.branchIdx  + 1
      if(inBranch < this.branchs.length && this.dataBank[this.branchIdx].bank_id !== '' &&
        this.dataBank[this.branchIdx].branch !== '' && this.dataBank[this.branchIdx].bank_owner_name !== '' &&
        this.dataBank[this.branchIdx].bank_account_number){
        this.branchIdx += 1
        this.getDataBank()
      }else{
        this.$notify({
          type: 'warning',
          message: this.rootLang.complete_data_first_in +' '+ this.branchs[this.branchIdx].name,
          title: 'Error'
        })
      }
    },

    resetBranch(val){
      if(val){
        if(this.dataBank[this.branchIdx].bank_id !== '' &&
          this.dataBank[this.branchIdx].branch !== '' && this.dataBank[this.branchIdx].bank_owner_name !== '' &&
          this.dataBank[this.branchIdx].bank_account_number){
          this.branchIdx = val
        }else{
          this.$notify({
            type: 'warning',
            message: this.rootLang.complete_data_first_in +' '+ this.branchs[this.branchIdx].name,
            title: 'Error'
          })
        }
      }else{
        this.branchIdx = 0
      }
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

    handleSelected(val) {
      this.listBank.forEach((item, no) => {
        if(item.id === val){
          this.dataBank[this.branchIdx].bank_name = item.name
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
      let branchComplete = 0
      let branchUncomplete = ''
      this.dataBank.forEach((itemBranch, key) => {
        if(itemBranch.bank_id !== '' && itemBranch.branch !== '' && itemBranch.bank_owner_name !== '' && itemBranch.bank_account_number){
          branchComplete += 1
        }else{
          branchUncomplete = key
        }
      })
      
      if(branchComplete === this.branchs.length){
        this.$emit('next', 'summary')
      }else{
        this.$notify({
          type: 'warning',
          message: this.rootLang.complete_data_first_in +' '+ this.lang.bank_account +' '+ this.branchs[branchUncomplete].name,
          title: 'Error'
        })
      }
    }
  }
}
</script>
