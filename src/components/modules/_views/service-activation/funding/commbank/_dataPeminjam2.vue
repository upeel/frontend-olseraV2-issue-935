<template>
  <div class="form-wizard--content__wrapper">
    <div class="wizard-desc wizard-desc--image color-orange-commbank--bg">
      <img src="/static/img/commbank/address.png" />
    </div>
    <div class="wizard-content">
      <div class="flex-container flex-container--center flex-container--content-space-between mb-24">
        <h3 style="margin-top: 0;">Alamat sesuai KTP</h3>
        <el-button type="text" :icon="visibleAddress ? 'el-icon-arrow-down' : 'el-icon-arrow-up'" @click="visibleAddress = !visibleAddress" />
      </div>
      <div
        v-show="visibleAddress"
        class="flex-grow-1">
        <el-form
          :model="formData"
          :rules="rulesForm"
          label-position="top">
          <el-form-item :label="rootLang.address_based_idcard" prop="address">
            <el-input v-model="formData.address" type="textarea" />
          </el-form-item>
          <el-row :gutter="20">
            <el-col :md="12">
              <el-form-item :label="rootLang.province" prop="provinsi">
                <el-select
                  v-model="formData.provinsi" 
                  :placeholder="$lang[langId].select" 
                  @change="handleSelected('stateKtp', formData.provinsi)"
                  v-loading="loadingStateKtp"
                  filterable
                  style="width: 100%">
                  <el-option
                    v-for="item in stateCity.ktp"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    >
                  </el-option>
                  <el-option v-if="moreStateKtp" :value="0" style="background: #767676; color: #F5F5F5;">
                    <span style="font-size: 13px; margin-right: 10px; float: left">
                      <el-button type="text" icon="el-icon-more" size="mini" style="color: #F5F5F5;"></el-button>
                    </span>
                    <span>{{ $lang[langId].load_more }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item :label="rootLang.city_district" prop="kabupaten">
                <el-select
                  v-model="formData.kabupaten" 
                  :placeholder="$lang[langId].select" 
                  @change="handleSelected('cityKtp', formData.kabupaten)"
                  v-loading="loadingCitiesKtp"
                  filterable
                  style="width: 100%">
                  <el-option
                    v-for="item in cities.ktp"
                    :key="item.id"
                    :label="item.city"
                    :value="item.id"
                    >
                  </el-option>
                  <el-option v-if="moreCityKtp" :value="0" style="background: #767676; color: #F5F5F5;">
                    <span style="font-size: 13px; margin-right: 10px; float: left">
                      <el-button type="text" icon="el-icon-more" size="mini" style="color: #F5F5F5;"></el-button>
                    </span>
                    <span>{{ $lang[langId].load_more }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item :label="rootLang.sub_district" prop="kecamatan">
                <el-select
                  v-model="formData.kecamatan" 
                  :placeholder="$lang[langId].select"
                  v-loading="loadingSubDistrictKtp"
                  filterable
                  @change="handleSelected('subDistrictKtp', formData.kecamatan)"
                  style="width: 100%">
                  <el-option
                    v-for="item in subDistrict.ktp"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    >
                  </el-option>
                  <el-option v-if="moreSubDistrictKtp" :value="0" style="background: #767676; color: #F5F5F5;">
                    <span style="font-size: 13px; margin-right: 10px; float: left">
                      <el-button type="text" icon="el-icon-more" size="mini" style="color: #F5F5F5;"></el-button>
                    </span>
                    <span>{{ $lang[langId].load_more }}</span>
                  </el-option>
                </el-select>
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
            <el-col :md="12">
              <el-form-item :label="rootLang.ownership" prop="kepemilikan">
                <el-select
                  v-model="formData.kepemilikan" 
                  :placeholder="$lang[langId].select" 
                  style="width: 100%">
                  <el-option
                    :label="$lang[langId].ones_own"
                    :value="$lang[langId].ones_own"
                    >
                  </el-option>
                  <el-option
                    :label="$lang[langId].rent"
                    :value="$lang[langId].rent"
                    >
                  </el-option>
                </el-select>
                <!-- <el-input v-model="formData.kepemilikan" /> -->
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item :label="rootLang.long_settled_month" prop="lama_menetap">
                <el-input-number
                  v-model="formData.lama_menetap"
                  :min="1"
                  controls-position="right"
                  style="max-width: 100% !important; width: 100% !important"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="flex-container flex-container--center flex-container--content-space-between mb-24">
        <h3 style="margin-top: 0;">{{rootLang.domicile_address}}</h3>
        <el-button type="text" :icon="visibleDomisili ? 'el-icon-arrow-down' : 'el-icon-arrow-up'" @click="visibleDomisili = !visibleDomisili" />
      </div>
      <div
        v-show="visibleDomisili"
        class="flex-grow-1">
        <el-form
          :model="formDataDomisili"
          :rules="rulesForm"
          label-position="top">
          <el-form-item :label="lang.address" prop="address">
            <el-input v-model="formDataDomisili.address" type="textarea" />
          </el-form-item>
          <el-row :gutter="20">
            <el-col :md="12">
              <el-form-item :label="rootLang.province">
                <el-input v-model="formDataDomisili.provinsi_name" type="text" readonly />
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item :label="rootLang.city_district" prop="kabupaten">
                <el-select
                  v-model="formDataDomisili.kabupaten" 
                  :placeholder="$lang[langId].select" 
                  @change="handleSelected('cityDomisili', formDataDomisili.kabupaten)"
                  v-loading="loadingCitiesDomisili"
                  filterable
                  style="width: 100%">
                  <el-option
                    v-for="(item, idxDomisili) in cities.domisili"
                    :key="idxDomisili"
                    :label="item.city"
                    :value="item.id"
                    >
                  </el-option>
                  <el-option v-if="moreCityDomisili" :value="0" style="background: #767676; color: #F5F5F5;">
                    <span style="font-size: 13px; margin-right: 10px; float: left">
                      <el-button type="text" icon="el-icon-more" size="mini" style="color: #F5F5F5;"></el-button>
                    </span>
                    <span>{{ $lang[langId].load_more }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item :label="rootLang.sub_district" prop="kecamatan">
                <el-select
                  v-model="formDataDomisili.kecamatan" 
                  :placeholder="$lang[langId].select" 
                  @change="handleSelected('subDistrictDomisili', formDataDomisili.kecamatan)"
                  v-loading="loadingSubDistrictDomisili"
                  filterable
                  style="width: 100%">
                  <el-option
                    v-for="item in subDistrict.domisili"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    >
                  </el-option>
                  <el-option v-if="moreSubDistrictDomisili" :value="0" style="background: #767676; color: #F5F5F5;">
                    <span style="font-size: 13px; margin-right: 10px; float: left">
                      <el-button type="text" icon="el-icon-more" size="mini" style="color: #F5F5F5;"></el-button>
                    </span>
                    <span>{{ $lang[langId].load_more }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item :label="lang.postal_code" prop="kode_pos">
                <el-input v-model="formDataDomisili.kode_pos" onkeydown="return ( event.ctrlKey || event.altKey 
                      || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                      || (95<event.keyCode && event.keyCode<106)
                      || (event.keyCode==8) || (event.keyCode==9) 
                      || (event.keyCode>34 && event.keyCode<40) 
                      || (event.keyCode==46) )"/>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item :label="rootLang.neighbourhood" prop="rt">
                <el-input v-model="formDataDomisili.rt" onkeydown="return ( event.ctrlKey || event.altKey 
                      || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                      || (95<event.keyCode && event.keyCode<106)
                      || (event.keyCode==8) || (event.keyCode==9) 
                      || (event.keyCode>34 && event.keyCode<40) 
                      || (event.keyCode==46) )"/>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item :label="rootLang.hamlet" prop="rw">
                <el-input v-model="formDataDomisili.rw" onkeydown="return ( event.ctrlKey || event.altKey 
                      || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                      || (95<event.keyCode && event.keyCode<106)
                      || (event.keyCode==8) || (event.keyCode==9) 
                      || (event.keyCode>34 && event.keyCode<40) 
                      || (event.keyCode==46) )"/>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item :label="rootLang.ownership" prop="kepemilikan">
                <el-select
                  v-model="formDataDomisili.kepemilikan" 
                  :placeholder="$lang[langId].select" 
                  style="width: 100%">
                  <el-option
                    :label="$lang[langId].ones_own"
                    :value="$lang[langId].ones_own"
                    >
                  </el-option>
                  <el-option
                    :label="$lang[langId].rent"
                    :value="$lang[langId].rent"
                    >
                  </el-option>
                </el-select>
                <!-- <el-input v-model="formDataDomisili.kepemilikan" /> -->
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item :label="rootLang.long_settled_month" prop="lama_menetap">
                <el-input-number
                  v-model="formDataDomisili.lama_menetap"
                  :min="1"
                  controls-position="right"
                  style="max-width: 100% !important; width: 100% !important"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { baseApi, HTTP } from 'src/http-common.js'
import axios from 'axios'
import basicComputedMixin from '@/mixins/basicComputedMixin'

export default {
  mixins: [basicComputedMixin],

  data() {
    return {
      visibleAddress: true,
      visibleDomisili: true,
      stateCity: {
        ktp: [],
        domisili: []
      },
      cities: {
        ktp: [],
        domisili: []
      },
      subDistrict: {
        ktp: [],
        domisili: []
      },
      moreStateKtp: null,
      moreStateDomisili: null,
      moreCityKtp: null,
      moreSubDistrictKtp: null,
      moreCityDomisili: null,
      moreSubDistrictDomisili: null,
      loadingStateKtp: false,
      loadingCitiesKtp: false,
      loadingCitiesDomisili: false,
      loadingSubDistrictKtp: false,
      loadingSubDistrictDomisili: false,
      formData: {
        provinsi_name: '',
        kabupaten_name: '',
        kecamatan_name: '',
      },
      formDataDomisili: {
        provinsi_name: '',
        kabupaten_name: '',
        kecamatan_name: '',
      },
      rulesForm: {
        address: [
          {
            message: this.$store.state.userStores.lang.required,
            trigger: 'blur',
            required: true
          }
        ],
        provinsi: [
          {
            message: this.$store.state.userStores.lang.required,
            trigger: 'blur',
            required: true
          }
        ],
        kabupaten: [
          {
            message: this.$store.state.userStores.lang.required,
            trigger: 'blur',
            required: true
          }
        ],
        kecamatan: [
          {
            message: this.$store.state.userStores.lang.required,
            trigger: 'blur',
            required: true
          }
        ],
        kode_pos: [
          {
            message: this.$store.state.userStores.lang.required,
            trigger: 'blur',
            required: true
          }
        ],
        rt: [
          {
            message: this.$store.state.userStores.lang.required,
            trigger: 'blur',
            required: true
          }
        ],
        rw: [
          {
            message: this.$store.state.userStores.lang.required,
            trigger: 'blur',
            required: true
          }
        ]
      }
    }
  },

  mounted(){
    this.getStateCity()
    this.getCityDomisili()
  },

  watch: {
    formData: {
      deep: true,
      immediate: true,
      handler(data) {
        this.$emit('change', [{alamat_ktp: data}, 'ktp'])
      }
    },
    formDataDomisili: {
      deep: true,
      immediate: true,
      handler(data) {
        this.$emit('change', [{alamat_domisili: data}, 'domisili'])
      }
    },
  },

  methods: {
    handleSelected(block, val) {
      if (block === 'stateKtp') {
        if(val === 0){
          this.loadingStateKtp = true
          this.loadMore(block, this.moreStateKtp)
        }else{
          this.loadingCitiesKtp = true
          this.cities.ktp = []
          this.subDistrict.ktp = []
          this.stateCity.ktp.forEach((item, no) => {
            if(item.id === val){
              this.formData.provinsi_name = item.name
            }
          })
          this.formData.kabupaten_name = ''
          this.formData.kecamatan_name = ''
          delete this.formData.kabupaten
          delete this.formData.kecamatan
          this.getCity(val, 'ktp')
        }
      } else if (block === 'cityKtp') {
        if(val === 0){
          this.loadingCitiesKtp = true
          this.loadMore(block, this.moreCityKtp)
        }else{
          this.loadingSubDistrictKtp = true
          this.cities.ktp.forEach((item, no) => {
            if(item.id === val){
              this.formData.kabupaten_name = item.city
            }
          })
          this.formData.kecamatan_name = ''
          this.subDistrict.ktp = []
          delete this.formData.kecamatan
          this.getSubDistrict(val, 'ktp')
        }
      } else if (block === 'subDistrictKtp') {
          if(val === 0){
            this.loadingSubDistrictKtp = true
            this.loadMore(block, this.moreSubDistrictKtp)
          }else{
            this.subDistrict.ktp.forEach((item, no) => {
              if(item.id === val){
                this.formData.kecamatan_name = item.name
              }
            })
          }
      } else if (block === 'stateDomisili') {

      } else if (block === 'cityDomisili') {
        this.loadingSubDistrictDomisili = true
        this.cities.domisili.forEach((item, no) => {
          if(item.id === val){
            this.formDataDomisili.kabupaten_name = item.city
            this.stateCity.ktp.forEach((prov, no) => {
              if(prov.id === item.state_id){
                this.formDataDomisili.provinsi = prov.id
                this.formDataDomisili.provinsi_name = prov.name
              }
            })
          }
        })
        this.formDataDomisili.kecamatan_name = ''
        this.subDistrict.domisili = []
        delete this.formDataDomisili.kecamatan
        this.getSubDistrict(val, 'domisili')
      } else if (block === 'subDistrictDomisili') {
          if(val === 0){
            this.loadingSubDistrictDomisili = true
            this.loadMore(block, this.moreSubDistrictDomisili)
          }else{
            this.subDistrict.domisili.forEach((item, no) => {
              if(item.id === val){
                this.formDataDomisili.kecamatan_name = item.name
              }
            })
          }
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

      HTTP({
        method: 'GET',
        url: url,
        params: params,
        headers: headers
      }).then(response => {
        if(block === 'stateKtp'){
          this.stateCity.ktp = this.stateCity.ktp.concat(response.data.data)
          this.moreStateKtp = response.data.links.next
        } else if (block === 'cityKtp'){
          this.cities.ktp = this.cities.ktp.concat(response.data.data)
          this.moreCityKtp = response.data.links.next
        } else if (block === 'subDistrictKtp'){
          this.subDistrict.ktp = this.subDistrict.ktp.concat(response.data.data)
          this.moreSubDistrictKtp = response.data.links.next
        } else if (block === 'stateDomisili'){
          this.stateCity.domisili = this.stateCity.domisili.concat(response.data.data)
          this.moreStateDomisili = response.data.links.next
        } else if (block === 'cityDomisili'){
          this.cities.domisili = this.cities.domisili.concat(response.data.data)
          this.moreCityDomisili = response.data.links.next
        } else if (block === 'subDistrictDomisili'){
          this.subDistrict.domisili = this.subDistrict.domisili.concat(response.data.data)
          this.moreSubDistrictDomisili = response.data.links.next
        }

        this.loadingStateKtp = false
        this.loadingCitiesKtp = false
        this.loadingCitiesDomisili = false
        this.loadingSubDistrictKtp = false
        this.loadingSubDistrictDomisili = false
      }).catch(error => {
        this.loadingStateKtp = false
        this.loadingCitiesKtp = false
        this.loadingCitiesDomisili = false
        this.loadingSubDistrictKtp = false
        this.loadingSubDistrictDomisili = false
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
        // search_column: 'country_id',
        // search_operator: '=',
        per_page: 100
      }
      // if (val) {
      //   this.$set(params, 'search_text', val)
      // } else {
      //   this.$set(params, 'search_text', 0)
      // }
      HTTP({
        method: 'GET',
        url: '/getstate',
        headers: headers,
        params: params
      }).then(response => {
        this.stateCity.ktp = response.data.data
        // this.stateCity.domisili = response.data.data
        this.moreStateKtp = response.data.links.next
        // this.moreStateDomisili = response.data.links.next

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

    getCity(val, type) {
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
      HTTP({
        method: 'GET',
        url: '/getcity',
        headers: headers,
        params: params
      }).then(response => {

        if(type === 'domisili'){
          // var commbank_Ekios = ['Jakarta', 'Tangerang', 'Bogor', 'Depok', 'Bekasi', 'Surabaya',
          //  'Semarang', 'Bandung', 'Cirebon', 'Yogyakarta', 'Badung', 'Denpasar', 'Palembang', 'Medan (Kota)',
          //  'Surakarta', 'Malang', 'Balikpapan', 'Lampung', 'Pontianak', 'Banjarmasin', 'Samarinda',
          //  'Batam', 'Manado', 'Makassar', 'Purwakarta', 'Jambi - Kota', 'Pekanbaru'];
          // response.data.data.forEach(item => {
          //   commbank_Ekios.forEach(kios => {  
          //     if(item.city.includes(kios)){
                
          //       this.cities.domisili = [...this.cities.domisili, item]
          //     }
          //   })
          // })
          // this.moreCityDomisili = response.data.links.next
        }else{
          this.cities.ktp = response.data.data
          this.moreCityKtp = response.data.links.next
        }
        
        this.loadingCitiesKtp = false
        this.loadingSubDistrictKtp = false
        this.loadingCitiesDomisili = false
        this.loadingSubDistrictDomisili = false
      }).catch(error => {
        this.loadingCitiesKtp = false
        this.loadingSubDistrictKtp = false
        this.loadingCitiesDomisili = false
        this.loadingSubDistrictDomisili = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    getCityDomisili(val) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        per_page: 100,
        city: 'Jakarta,Tangerang,Bogor,Depok,Bekasi,Surabaya,Semarang,Bandung,Cirebon,Yogyakarta,Badung,Denpasar,'+
          'Palembang,Medan (Kota),Surakarta,Malang,Balikpapan,Lampung,Pontianak,Banjarmasin,Samarinda,Batam,'+
          'Manado,Makassar,Purwakarta,Jambi - Kota,Pekanbaru'
      }

      HTTP({
        method: 'GET',
        url: '/getcity',
        headers: headers,
        params: params,
      }).then(response => {
        this.cities.domisili = response.data.data
      }).catch(error => {
        this.loadingCitiesKtp = false
        this.loadingSubDistrictKtp = false
        this.loadingCitiesDomisili = false
        this.loadingSubDistrictDomisili = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    getSubDistrict(val, type) {
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
      HTTP({
        method: 'GET',
        url: '/api/getsubdistrict',
        headers: headers,
        params: params
      }).then(response => {
        if(type === 'domisili'){  
          this.subDistrict.domisili = response.data.data
          this.moreSubDistrictDomisili = response.data.links.next
        }else{
          this.subDistrict.ktp = response.data.data
          this.moreSubDistrictKtp = response.data.links.next
        }

        this.loadingSubDistrictKtp = false
        this.loadingSubDistrictDomisili = false
      }).catch(error => {
        this.loadingSubDistrictKtp = false
        this.loadingSubDistrictDomisili = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
  }
}
</script>
