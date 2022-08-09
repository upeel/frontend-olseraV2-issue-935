<template>
  <div>
    <el-progress
      :percentage="progresStep" color="#E6A903" :show-text="false" type="line">
    </el-progress>
    <div class="form-wizard--content__wrapper">
      <div class="wizard-content" style="background-color: #FAFAFA;">
        <h3 style="margin-top: 0;" class="mb-24">{{rootLang.other_loans_info}} ({{rootLang.optional}})</h3>
        <div class="flex-grow-1">
          <el-form
            :model="formDataPinjamanLain"
            label-position="top">
            <el-form-item
              :label="rootLang.your_other_loan"
              prop="pinjaman_lain">
              <el-input v-model="formDataPinjamanLain.pinjaman_lain" />
            </el-form-item>
            <el-form-item
              :label="rootLang.other_loan_amount"
              prop="total_pinjaman_lain">
              <input-money
                v-model="formDataPinjamanLain.total_pinjaman_lain"
              />
            </el-form-item>
            <el-form-item
              :label="rootLang.other_loan_mortgage"
              prop="total_cicilan_pinjaman_lain">
              <input-money
                v-model="formDataPinjamanLain.total_cicilan_pinjaman_lain"
              />
            </el-form-item>
            <el-form-item
              :label="rootLang.other_loan_rest"
              prop="total_nominal_sisa_pinjaman_lain">
              <input-money
                v-model="formDataPinjamanLain.total_nominal_sisa_pinjaman_lain"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div class="wizard-content">
        <!-- data usaha -->
        <h3 style="margin-top: 0;" class="mb-24">{{rootLang.data_business}}</h3>
        <div class="flex-grow-1">
          <el-form
            :model="formData"
            :rules="rulesForm"
            label-position="top">
            <el-form-item
              :label="rootLang.business_sector"
              prop="sektor_usaha">
              <el-select
                v-model="formData.sektor_usaha" 
                :placeholder="rootLang.select"
                @change="handleSelected('businesType', formData.sektor_usaha)"
                filterable
                style="width: 100%">
                <el-option
                  v-for="item in businessTypes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="rootLang.economic_sectors"
              prop="sektor_ekonomi">
              <el-input v-model="formData.sektor_ekonomi" disabled/>
            </el-form-item>
            <el-form-item
              :label="rootLang.business_type"
              prop="jenis_usaha">
              <el-radio-group
                v-model="formData.jenis_usaha"
                class="el-radio-group__flex">
                <el-radio-button
                  v-for="(item, key) in jenisUsahaOptions"
                  :key="key"
                  :label="item.value">
                  {{ item.label }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="formData.jenis_usaha && formData.jenis_usaha !== 1"
              :label="rootLang.shipping_origin"
              prop="asal_pengiriman">
              <el-input v-model="formData.asal_pengiriman" disabled/>
            </el-form-item>

            <div class="mt-24 mb-24">
              <h3>{{rootLang.bussiness_address}}</h3>
            </div>

            <el-form-item :label="lang.address" prop="address">
              <el-input v-model="formData.address" type="textarea" />
            </el-form-item>
            <el-row :gutter="20">
              <el-col :md="12">
                <el-form-item :label="rootLang.province" prop="provinsi">
                  <el-select
                    v-model="formData.provinsi" 
                    :placeholder="$lang[langId].select" 
                    @change="handleSelected('state', formData.provinsi)"
                    v-loading="loadingState"
                    filterable
                    style="width: 100%">
                    <el-option
                      v-for="item in stateCity"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                      >
                    </el-option>
                    <el-option v-if="moreState" :value="0" style="background: #767676; color: #F5F5F5;">
                      <span style="font-size: 13px; margin-right: 10px; float: left">
                        <el-button type="text" icon="el-icon-more" size="mini" style="color: #F5F5F5;"></el-button>
                      </span>
                      <span>{{ $lang[langId].load_more }}</span>
                    </el-option>
                  </el-select>
                  <!-- <el-input v-model="formData.provinsi" /> -->
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item :label="rootLang.city_district" prop="kabupaten">
                  <el-select
                    v-model="formData.kabupaten" 
                    :placeholder="$lang[langId].select" 
                    @change="handleSelected('city', formData.kabupaten)"
                    v-loading="loadingCities"
                    filterable
                    style="width: 100%">
                    <el-option
                      v-for="item in cities"
                      :key="item.id"
                      :label="item.city"
                      :value="item.id"
                      >
                    </el-option>
                    <el-option v-if="moreCity" :value="0" style="background: #767676; color: #F5F5F5;">
                      <span style="font-size: 13px; margin-right: 10px; float: left">
                        <el-button type="text" icon="el-icon-more" size="mini" style="color: #F5F5F5;"></el-button>
                      </span>
                      <span>{{ $lang[langId].load_more }}</span>
                    </el-option>
                  </el-select>
                  <!-- <el-input v-model="formData.kabupaten" /> -->
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item :label="rootLang.sub_district" prop="kecamatan">
                  <el-select
                    v-model="formData.kecamatan" 
                    :placeholder="$lang[langId].select"
                    v-loading="loadingSubDistrict"
                    filterable
                    @change="handleSelected('subDistrict', formData.kecamatan)"
                    style="width: 100%">
                    <el-option
                      v-for="item in subDistrict"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                      >
                    </el-option>
                    <el-option v-if="moreSubDistrict" :value="0" style="background: #767676; color: #F5F5F5;">
                      <span style="font-size: 13px; margin-right: 10px; float: left">
                        <el-button type="text" icon="el-icon-more" size="mini" style="color: #F5F5F5;"></el-button>
                      </span>
                      <span>{{ $lang[langId].load_more }}</span>
                    </el-option>
                  </el-select>
                  <!-- <el-input v-model="formData.kecamatan" /> -->
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item :label="lang.postal_code" prop="kode_pos">
                  <el-input v-model="formData.kode_pos" onkeydown="return ( event.ctrlKey || event.altKey 
                      || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                      || (95<event.keyCode && event.keyCode<106)
                      || (event.keyCode==8) || (event.keyCode==9) 
                      || (event.keyCode>34 && event.keyCode<40) 
                      || (event.keyCode==46) )"/>
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item :label="rootLang.neighbourhood" prop="rt">
                  <el-input v-model="formData.rt" onkeydown="return ( event.ctrlKey || event.altKey 
                      || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                      || (95<event.keyCode && event.keyCode<106)
                      || (event.keyCode==8) || (event.keyCode==9) 
                      || (event.keyCode>34 && event.keyCode<40) 
                      || (event.keyCode==46) )"/>
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item :label="rootLang.hamlet" prop="rw">
                  <el-input v-model="formData.rw" onkeydown="return ( event.ctrlKey || event.altKey 
                      || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                      || (95<event.keyCode && event.keyCode<106)
                      || (event.keyCode==8) || (event.keyCode==9) 
                      || (event.keyCode>34 && event.keyCode<40) 
                      || (event.keyCode==46) )"/>
                </el-form-item>
              </el-col>
            </el-row>

            <el-button
              type="success"
              class="btn-block"
              @click="handleSubmit">
              {{ rootLang.next }}
            </el-button>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common.js'
import axios from 'axios'
import { getBusinessTypes } from '@/api/auth'
import basicComputedMixin from '@/mixins/basicComputedMixin'
import InputMoney from '@/components/InputMoneyV2'
export default {
  mixins: [basicComputedMixin],
  components: {
    InputMoney
  },
  watch: {
    formData: {
      deep: true,
      immediate: true,
      handler(data) {
        var countData = 0;
        // if(data.jenis_usaha === 1){
        //   delete this.formData.asal_pengiriman
        // }

        for (var dataUsaha in data) {
          if (data.hasOwnProperty(dataUsaha) && data[dataUsaha] !== '' && dataUsaha !== 'asal_pengiriman' 
          && dataUsaha !== 'provinsi_name' && dataUsaha !== 'kabupaten_name' && dataUsaha !== 'kecamatan_name'
          && dataUsaha !== 'business_type_name') {
            ++countData;
          }
        }
        this.progresStep = (countData/10)*100
      }
    },
  },
  
  data() {
    return {
      loadingState: false,
      loadingCities: false,
      loadingSubDistrict: false,
      moreState: null,
      moreCity: null,
      moreSubDistrict: null,
      stateCity: [],
      cities: [],
      subDistrict: [],
      businessTypes: [],
      progresStep: 0,
      formDataPinjamanLain: {
        total_pinjaman_lain: '0',
        total_cicilan_pinjaman_lain: '0',
        total_nominal_sisa_pinjaman_lain: '0'
      },
      formData: {
        jenis_usaha: 1,
        sektor_ekonomi: this.$lang[this.$store.state.userStores.langId].trading,
        address: null,
        provinsi: null,
        kabupaten: null,
        provinsi_name: '',
        kabupaten_name: '',
        kecamatan_name: '',
        business_type_name: ''
      },

      rulesForm: {
        sektor_usaha: {
          message: this.$store.state.userStores.lang.required,
          trigger: 'blur',
          required: true
        },
        sektor_ekonomi: {
          message: this.$store.state.userStores.lang.required,
          trigger: 'blur',
          required: true
        },
        jenis_usaha: {
          message: this.$store.state.userStores.lang.required,
          trigger: 'blur',
          required: true
        },
        // asal_pengiriman: {
        //   message: this.$store.state.userStores.lang.required,
        //   trigger: 'blur',
        //   required: true
        // },
        address: {
          message: this.$store.state.userStores.lang.required,
          trigger: 'blur',
          required: true
        },
        provinsi: {
          message: this.$store.state.userStores.lang.required,
          trigger: 'blur',
          required: true
        },
        kabupaten: {
          message: this.$store.state.userStores.lang.required,
          trigger: 'blur',
          required: true
        },
        kecamatan: {
          message: this.$store.state.userStores.lang.required,
          trigger: 'blur',
          required: true
        },
        kode_pos: {
          message: this.$store.state.userStores.lang.required,
          trigger: 'blur',
          required: true
        },
        rt: {
          message: this.$store.state.userStores.lang.required,
          trigger: 'blur',
          required: true
        },
        rw: {
          message: this.$store.state.userStores.lang.required,
          trigger: 'blur',
          required: true
        }
      }
    }
  },

  computed: {
    jenisUsahaOptions() {
      return [
        {
          value: 1,
          label: this.$lang[this.$store.state.userStores.langId].just_offline
        },
        {
          value: 2,
          label: this.$lang[this.$store.state.userStores.langId].just_online
        },
        {
          value: 3,
          label: this.$lang[this.$store.state.userStores.langId].online_offline
        }
      ]
    }
  },

  mounted(){
    this.getBusinessCategory()
    this.getStateCity()
  },



  methods: {
    getBusinessCategory(){
      getBusinessTypes({ }).then(response => {
        this.businessTypes = response.data.data
      })
    },

    handleSelected(block, val) {
      if (block === 'state') {
        if(val === 0){
          this.loadingState = true
          this.loadMore(block, this.moreState)
        }else{
          this.loadingCities = true
          this.cities = []
          this.subDistrict = []
          this.stateCity.forEach((item, no) => {
            if(item.id === val){
              this.formData.provinsi_name = item.name
            }
          })
          this.formData.kabupaten_name = ''
          this.formData.kecamatan_name = ''
          delete this.formData.asal_pengiriman
          delete this.formData.kabupaten
          delete this.formData.kecamatan
          this.getCity(val)
        }
      } else if (block === 'city') {
        if(val === 0){
          this.loadingCities = true
          this.loadMore(block, this.moreCity)
        }else{
          this.cities.forEach(item => {
            if(item.id === val){  
              this.formData.asal_pengiriman = item.city
              this.formData.kabupaten_name = item.city
            }
          })
          this.formData.kecamatan_name = ''
          this.loadingSubDistrict = true
          this.subDistrict = []
          delete this.formData.kecamatan
          this.getSubDistrict(val)
        }
      } else if (block === 'subDistrict') {
          if(val === 0){
            this.loadingSubDistrict = true
            this.loadMore(block, this.moreSubDistrict)
          }else{
            this.subDistrict.forEach((item, no) => {
              if(item.id === val){
                this.formData.kecamatan_name = item.name
              }
            })
          }
      }else if(block === 'businesType'){
        this.businessTypes.forEach((item, no) => {
          if(item.id === val){
            this.formData.business_type_name = item.name
          }
        })
      }
    },

    loadMore(block, url) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search_column: 'state_id',
        search_operator: '=',
        per_page: 100,
        search_text: 0
      }

      axios({
        method: 'GET',
        url: url,
        params: params,
        headers: headers
      }).then(response => {
        if(block === 'state'){
          this.stateCity = this.stateCity.concat(response.data.data)
          this.moreState = response.data.links.next
        } else if (block === 'city'){
          this.cities = this.cities.concat(response.data.data)
          this.moreCity = response.data.links.next
        } else if (block === 'subDistrict'){
          this.subDistrict = this.subDistrict.concat(response.data.data)
          this.moreSubDistrict = response.data.links.next
        }

        this.loadingState = false
        this.loadingCities = false
        this.loadingSubDistrict = false
      }).catch(error => {
        this.loadingState = false
        this.loadingCities = false
        this.loadingSubDistrict = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    getStateCity(val) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search_column: 'country_id',
        search_operator: '=',
        per_page: 100
      }
      if (val) {
        this.$set(params, 'search_text', val)
      } else {
        // this.$set(params, 'search_text', '')
        delete params.search_column
        delete params.search_operator
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'state'),
        headers: headers,
        params: params
      }).then(response => {
        this.stateCity = response.data.data
        this.moreState = response.data.links.next

        this.loading = false
      }).catch(error => {
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    getCity(val) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search_column: 'state_id',
        search_operator: '=',
        per_page: 100
      }
      if (val) {
        this.$set(params, 'search_text', val)
      } else {
        this.$set(params, 'search_text', 0)
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'shippingcity'),
        headers: headers,
        params: params
      }).then(response => {

        this.cities = response.data.data
        this.moreCity = response.data.links.next
        
        this.loadingCities = false
        this.loadingSubDistrict = false
      }).catch(error => {
        this.loadingCities = false
        this.loadingSubDistrict = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    getSubDistrict(val) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search_column: 'city_id',
        search_operator: '=',
        per_page: 100
      }
      if (val) {
        this.$set(params, 'search_text', val)
      } else {
        this.$set(params, 'search_text', 0)
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'shippingcitysubdistrict'),
        headers: headers,
        params: params
      }).then(response => {
        this.subDistrict = response.data.data
        this.moreSubDistrict = response.data.links.next

        this.loadingSubDistrict = false
      }).catch(error => {
        this.loadingSubDistrict = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    handleSubmit() {
      if(this.progresStep === 100){
        this.$emit('next', 3, {
          data_usaha: this.formData,
          pinjaman_lain: this.formDataPinjamanLain
        })
      }
    }
  }
}
</script>
