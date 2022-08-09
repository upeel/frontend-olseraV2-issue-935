<template>
  <div class="branch">
    <el-form
      :model="formData"
      :rules="rulesBranch"
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
            <div class="font-12 ">{{$lang[langId].select_branch_info}}</div>
            <el-checkbox-group v-model="selectedBranchs" class="mt-10">
              <div class="mt-5 pointer" v-for="(item, key) in dataBranchs" :key="key">
                <el-checkbox class="imageCheckbox" :label="item.id" border style="width: 100%" @change="(value) => handleSelectBranch(value, item)">
                  <el-avatar
                    :src="item.logo"
                    class="mr-4"
                    style="width: 36px; height: 36px;"
                  />
                  <span class="nameBranch">{{item.name}}</span>
                </el-checkbox>
              </div>
            </el-checkbox-group>
            <el-button @click="handleNext('company')" class="visible-lg visible-md visible-sm" type="primary" style="width: 85%">
              {{$lang[langId].select + ' (' + formData.branchs.length + ') ' + $lang[langId].branch}}
            </el-button>
            <el-button @click="handleNext('company')" class="visible-xs" type="primary" style="width: 80%">
              {{$lang[langId].select + ' (' + formData.branchs.length + ') ' + $lang[langId].branch}}
            </el-button>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin';
import { baseApi } from 'src/http-common.js';
import axios from 'axios';

export default {
  name: 'dataBranchIndividual',
  mixins: [basicComputedMixin],
  
  computed: {
    
  },

  data() {
    return{
      isLoading: false,
      dataBranchs: [],  
      branchIdx: 0,
      selectedBranchs:[],
      formData: {
        branchs: [],
        bank: []
      },
      rulesBranch: {}
    }
  },

  mounted(){
    this.getBranch()
    this.getStore()
  },

  methods: {
    getStore(value, businessType){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let store = value ? value : this.selectedStore.url_id

      axios({
        method: 'GET',
        url: baseApi(store, this.langId, 'generalsetting'),
        headers: headers
      }).then(response => {
        const res = response.data.data

        this.dataBranchs.push(
          {
            id: res.id,
            name: res.name,
            logo: res.logo,
            url_id: res.url_id+'.myolsera.com',
            business_type: res.business_type,
            business_type_name: '',
            province_id: res.state_id,
            province: '',
            city_id: res.city_id,
            city: res.city_name,
            kecamatan_id: res.subdistrict_id,
            kecamatan: '',
            vilage: res.village,
            address: res.address ? res.address : '',
	          lat: res.location_lat,
            lng: res.location_lon,
            postal_code: res.postal_code,
            status_location_business: String(res.status_location_business ? res.status_location_business : '0'),
            thumbnail_location_store: null,
            logo_ewallet: null
          })
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    getBranch(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'storebranches'),
        headers: headers
      }).then(response => {
        const res = response.data.data
        res.forEach((branch, index) => {
          this.getStore(branch.url_id, branch.business_type)
        });

      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    handleSelectBranch(value, row){
      if(value){
        this.formData.branchs.push(row)
        this.formData.bank.push({bank_id: '', bank_name: '', branch: '', bank_owner_name: '', bank_account_number: ''})
      }else{
        let index = this.formData.branchs.findIndex(x => x.id === row.id)
        this.formData.branchs.splice(index, 1)
        this.formData.bank.splice(index, 1)
      }

      this.$emit('change', {branchs: this.formData.branchs, bank: this.formData.bank})
    },

    handleNext (){
      this.$emit('next', 'company', {branchs: this.formData.branchs, bank: this.formData.bank})
    },

  }
}
</script>