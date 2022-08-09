<template>
    <div class="owner">
      <el-form
        :model="dataBranch"
        :rules="rulesBusiness"
        label-position="top"
        ref="data"
        @submit.native.prevent="handleNext">
        <div class="row equal-cols">
          <div class="col-xs-12 col-sm-6 pr-null">
            <div class="owner-left-side" style="background-color: #F5F5F5;">
              <div class="font-18 pb-16">{{rootLang.required_photo}} (1)</div>
              <el-card class="box-card">
                <el-row>
                  <el-col :xs="14" :sm="12" :md="12" :lg="16" :xl="16" align="left">
                    <p class="pt-24 pb-10 word-break"><span class="font-11" style="color: #F56C6C">*</span> {{rootLang.statement_last_3_month}}</p>
                  </el-col>
                  <el-col :xs="10" :sm="12" :md="12" :lg="8" :xl="8">
                    <el-form-item class="mb-0" align="center">
                      <el-upload
                        :action="uploadPhotoUrl"
                        :headers="headers"
                        :before-upload="beforeUpload"
                        :show-file-list="false"
                        :on-progress="handleUploadBankProcess"
                        :on-success="handleUploadBankSuccess"
                        :on-error="handleUploadError"
                        list-type="upload-demo"
                        multiple
                        >
                        <div class="loadingUploadMultiple">
                          <loading v-if="uploadingBank" 
                            align="center"
                            :active="true"
                            color= '#1bb4e6'
                            loader="spinner"
                            :width="32"
                            :height="32"
                            backgroundColor='#ffffff'>
                          </loading>
                          <i v-else class="el-icon-plus"></i>
                        </div>
                      </el-upload>
                      <div class="remove-image-area mt-10" v-for="(file, keyFile) in dataBranch.fileBank" :key="keyFile">
                        <img :src="file.photo_md" alt="">
                        <div class="remove-image">
                          <span
                            style="position: static; font-size: inherit; color: inherit;"
                            @click="handleRemoveFileBank(keyFile)"
                          >
                            <i class="el-icon-delete"></i>
                          </span>
                        </div>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-card>

            </div>
          </div>
          <div class="col-xs-12 col-sm-6 pl-null">
            <div class="owner-right-side" style="background-color: #FFFFFF; padding: 20px;">
              <el-form-item :label="rootLang.business_name" prop="name"> 
                <el-input v-model="dataBranch.name" type="text" size="small" style="width: 100%"></el-input>
              </el-form-item>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item prop="email">
                    <el-form-item
                      label="Email"
                      size="medium"
                      prop="email">
                      <el-input
                        v-model="dataBranch.email"
                        size="small"
                        type="email"
                      />
                    </el-form-item>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="rootLang.phone_number" prop="phone_number">
                    <phone-number-input
                      v-model="phone_number"
                      :translations="{
                        countrySelectorLabel: '',
                        countrySelectorError: '',
                        phoneNumberLabel: '',
                        example: ''
                      }"
                      :only-countries="['ID', 'SG']"
                      default-country-code="ID"
                      @update="getPhone"
                      class="owner-phone-register"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item :label="rootLang.business_age" prop="business_age">
                <el-input v-model="dataBranch.business_age"
                  onkeydown="return ( event.ctrlKey || event.altKey 
                            || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                            || (95<event.keyCode && event.keyCode<106)
                            || (event.keyCode==8) || (event.keyCode==9) 
                            || (event.keyCode>34 && event.keyCode<40) 
                            || (event.keyCode==46) )"
                  size="small" style="width: 100%"
                  >
                  <template slot="append">{{rootLang.months}}</template> 
                </el-input>
              </el-form-item>

            <h4>{{lang.address}}</h4>
            <el-form-item :label="rootLang.bussiness_address" prop="address">
              <el-input v-model="dataBranch.address" size="small" type="text" style="width: 100%"></el-input>
            </el-form-item>

            <el-row :gutter="20">
              <el-col :md="12">
                <el-form-item :label="rootLang.province" prop="province">
                  <el-input v-model="dataBranch.province" size="small" v-loading="loadingState" readonly />
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item :label="rootLang.city_district" prop="kabupaten">
                  <el-select
                    v-model="dataBranch.city_id" 
                    :placeholder="$lang[langId].select" 
                    @change="(value) => handleSelected('city', value)"
                    v-loading="loadingCities"
                    size="small"
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
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item :label="rootLang.sub_district" prop="kecamatan">
                  <el-select
                    v-model="dataBranch.kecamatan_id" 
                    :placeholder="$lang[langId].select"
                    v-loading="loadingSubDistrict"
                    size="small"
                    @change="handleSelected('subDistrict', dataBranch.kecamatan)"
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
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item :label="lang.postal_code" prop="kode_pos">
                  <el-input v-model="dataBranch.postal_code" size="small" onkeydown="return ( event.ctrlKey || event.altKey 
                        || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                        || (95<event.keyCode && event.keyCode<106)
                        || (event.keyCode==8) || (event.keyCode==9) 
                        || (event.keyCode>34 && event.keyCode<40) 
                        || (event.keyCode==46) )"/>
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item :label="rootLang.ig_business_link+ '('+ rootLang.optional +')'" prop="instagram_link">
                  <el-input v-model="dataBranch.instagram_link" size="small" type="text" style="width: 100%"/>
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item :label="rootLang.web_business_link+ '('+ rootLang.optional +')'" prop="website_link">
                  <el-input v-model="dataBranch.website_link" size="small" type="text" style="width: 100%"/>
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item :label="'Merchant ID ('+ rootLang.optional +')'" prop="merchant_id">
                  <el-input v-model="dataBranch.merchant_id" size="small" type="text" style="width: 100%"/>
                </el-form-item>
              </el-col>
            </el-row>

            <el-button @click="handleNext()" 
              class="btn-block color-koinworks--bg color-koinworks--border color-white"
              style="width: 100%">
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
import { baseApi, HTTP } from 'src/http-common.js';
import axios from 'axios';
import Loading from 'vue-loading-overlay';
export default {
  props:{},
  components: {Loading},
  mixins: [basicComputedMixin],
  
  computed: {
    headers() {
      return {
        'Authorization': 'Bearer ' + this.token.access_token
      }
    },
  },
  watch: {
    formData: {
      deep: true,
      immediate: true,
      handler(data) {
        this.$emit('change', {data_usaha: data})
      }
    },
  },
  data() {
    return{
      uploadingBank: false,
      uploadPhotoUrl: '',
      phone_number: '',
      dataBranch: {
        fileBank: null
      },
      cities: [],
      subDistrict: [],
      moreSubDistrict: null,
      moreCity: null,
      loadingState: false,
      loadingCities: false,
      loadingSubDistrict: false,
      rulesBusiness: {
        name: [
          {
            message: this.$store.state.userStores.lang.required,
            trigger: 'blur',
            required: true
          }
        ],
        business_age: [
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
        ]
      },
    }
  },
  mounted(){
    this.getStore()
    this.uploadPhotoUrl = baseApi(this.selectedStore.url_id, this.langId, 'activation/service/upload')
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
        this.phone_number = res.phone_1
        this.dataBranch = 
          {
            id: res.id,
            name: res.name,
            logo: res.logo,
            url_id: res.url_id+'.myolsera.com',
            email: res.email,
            business_type: businessType ? businessType : '',
            business_type_name: '',
            province_id: '',
            province: '',
            city_id: '',
            city: '',
            kecamatan_id: '',
            kecamatan: '',
            address: res.address,
	          lat: res.location_lat,
            lng: res.location_lon,
            postal_code: res.postal_code,
            phone_number: res.phone_1,
            fileBank: null,
            business_name: '',
            jenis_usaha: '',
            business_age: 0,
            instagram_link: '',
            website_link: '',
            merchant_id: ''
          }
          this.$emit('change', {data_usaha: this.dataBranch})
          this.initCityLocation()
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    getPhone (value) {
      this.dataBranch.phone_number = value.formattedNumber
    },
    
    beforeUpload(file) {
      const isJpg = file.type === 'image/jpeg'
      const isPng = file.type === 'image/png'
      if (!isJpg && !isPng) {
        this.$message.error(this.$lang[this.langId].error_upload_photo)
      }
      return isJpg || isPng
    },
    handleUploadBankProcess(){
      this.uploadingBank = true
    },
    handleUploadBankSuccess(response, file, fileList) {
      var dataFile = this.dataBranch.fileBank ? this.dataBranch.fileBank : []
      this.dataBranch.fileBank = dataFile ? dataFile.concat(response[0]) : dataFile.push(response[0])
      this.uploadingBank = false
    },
    handleRemoveFileBank(keyRemove) {
        this.dataBranch.fileBank.splice(keyRemove, 1)
    },
    handleUploadError(err) {
      this.uploadingBank = false
      this.$notify({
        type: 'warning',
        message: this.rootLang.file_too_large,
        title: 'Error'
      })
    },
    initCityLocation(){
      this.loadingCities = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        city: 'Badung (Kab.),Bangli (Kab.),Buleleng (Kab.),Denpasar (Kota),Gianyar (Kab.),Jembrana (Kab.),Karangasem (Kab.),'+
							'Klungkung (Kab.),Tabanan (Kab.),Cilegon (Kota),Lebak (Kab.),Pandeglang (Kab.),Serang,Tangerang,Bantul (Kab.),'+
							'Gunung Kidul (Kab.),Kulon Progo (Kab.),Sleman (Kab.),Yogyakarta (Kota),Jakarta,Kepulauan Seribu (Kab.),'+
							'Bandung,Banjar (Kota),Bekasi,Bogor,Ciamis (Kab.),Cianjur (Kab.),Cimahi (Kota),Cirebon,Depok (Kota),Garut (Kab.),'+ 
							'Indramayu (Kab.),Karawang (Kab.),Kuningan (Kab.),Majalengka (Kab.),Pangandaran (Kab.),Purwakarta (Kab.),Subang (Kab.),'+
							'Sukabumi,Sumedang (Kab.),Tasikmalaya,Banjarnegara (Kab.),Banyumas (Kab.),Batang (Kab.),Blora (Kab.),Boyolali (Kab.),'+
							'Brebes (Kab.),Cilacap (Kab.),Demak (Kab.),Grobogan (Kab.),Jepara (Kab.),Karanganyar (Kab.),Kebumen (Kab.),Kendal (Kab.),'+
							'Klaten (Kab.),Kudus (Kab.),Magelang,Pati (Kab.),Pekalongan,Pemalang (Kab.),Purbalingga (Kab.),Purworejo (Kab.),'+
							'Rembang (Kab.),Salatiga (Kota),Semarang,Sragen (Kab.),Sukoharjo (Kab.),Surakarta (Kota),Tegal,Temanggung (Kab.),'+
							'Wonogiri (Kab.),Wonosobo (Kab.),Bangkalan (Kab.),Banyuwangi (Kab.),Batu (Kota),Blitar,Bojonegoro (Kab.),Bondowoso (Kab.),'+
							'Gresik (Kab.),Jember (Kab.),Jombang (Kab.),Kediri,Lamongan (Kab.),Lumajang (Kab.),Madiun,Magetan (Kab.),Malang,Mojokerto,'+
							'Nganjuk (Kab.),Ngawi (Kab.),Pacitan (Kab.),Pamekasan (Kab.),Pasuruan,Ponorogo (Kab.),Probolinggo,Sampang (Kab.),'+
							'Sidoarjo (Kab.),Situbondo (Kab.),Sumenep (Kab.),Surabaya (Kota),Trenggalek (Kab.),Tuban (Kab.),Tulungagung (Kab.),'+
							'Medan (Kota),Balikpapan (Kota),Makassar (Kota),Padang (Kota),Pekanbaru (Kota),Jambi (Kota),Bengkulu (Kota),'+
							'Palembang (Kota),Samarinda (Kota),Pontianak (Kota),Palangka Raya (Kota),Banjarmasin (Kota)',
        per_page: 100
      }
      // if (this.dataBranch.province_id) {
      //   this.$set(params, 'search_text', this.dataBranch.province_id)
        HTTP({
          method: 'GET',
          url: '/getcity',
          headers: headers,
          params: params
        }).then(response => {
          this.cities = response.data.data
          this.moreCity = response.data.links.next
          
          this.cities.forEach((item, no) => {
            if(item.id === this.dataBranch.city_id){
              this.dataBranch.city = item.city
            }
          })
          this.initSubDistrict(this.dataBranch.city)
        }).catch(error => {
          this.$notify({
            type: 'warning',
	            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        })
      // }
      this.loadingCities = false
    },
    initSubDistrict(){
      this.loadingSubDistrict = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search_column: 'city_id',
        search_operator: '=',
        per_page: 100
      }
      if (this.dataBranch.city_id) {
        this.$set(params, 'search_text', this.dataBranch.city_id)
        HTTP({
          method: 'GET',
          url: '/api/getsubdistrict',
          headers: headers,
          params: params
        }).then(response => {
          this.subDistrict = response.data.data
          this.moreSubDistrict = response.data.links.next
          
          this.subDistrict.forEach((item, no) => {
            if(item.id === this.dataBranch.kecamatan_id){
              this.dataBranch.kecamatan = item.name
            }
          })
        }).catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        })
      }
      this.loadingSubDistrict = false
    },
    getStateCity(val) {
      this.loadingState = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search_column: 'id',
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
        url: '/getstate',
        headers: headers,
        params: params
      }).then(response => {
        let resp = response.data.data[0]
        this.dataBranch.province_id = resp.id 
        this.dataBranch.province = resp.name
        this.loadingState = false
      }).catch(error => {
        this.loadingState = false
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
      HTTP({
        method: 'GET',
        url: '/api/getsubdistrict',
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
    handleSelected(block, val) {
      if (block === 'city') {
        if(val === 0){
          this.loadingCities = true
          this.loadMore(block, this.moreCity)
        }else{
          this.loadingSubDistrict = true
          let stateId = ''
          this.cities.forEach((item, no) => {
            if(item.id === val){
              this.dataBranch.city = item.city
              stateId = item.state_id
            }
          })
          this.dataBranch.kecamatan_id = ''
          this.dataBranch.kecamatan = ''
          this.subDistrict = []
          this.getStateCity(stateId)
          this.getSubDistrict(val)
        }
      } else if (block === 'subDistrict') {
          if(val === 0){
            this.loadingSubDistrict = true
            this.loadMore(block, this.moreSubDistrict)
          }else{
            this.subDistrict.forEach((item, no) => {
              if(item.id === val){
                this.dataBranch.kecamatan = item.name
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

			if(block === 'city'){
				params = {
					city: 'Badung (Kab.),Bangli (Kab.),Buleleng (Kab.),Denpasar (Kota),Gianyar (Kab.),Jembrana (Kab.),Karangasem (Kab.),'+
								'Klungkung (Kab.),Tabanan (Kab.),Cilegon (Kota),Lebak (Kab.),Pandeglang (Kab.),Serang,Tangerang,Bantul (Kab.),'+
								'Gunung Kidul (Kab.),Kulon Progo (Kab.),Sleman (Kab.),Yogyakarta (Kota),Jakarta,Kepulauan Seribu (Kab.),'+
								'Bandung,Banjar (Kota),Bekasi,Bogor,Ciamis (Kab.),Cianjur (Kab.),Cimahi (Kota),Cirebon,Depok (Kota),Garut (Kab.),'+ 
								'Indramayu (Kab.),Karawang (Kab.),Kuningan (Kab.),Majalengka (Kab.),Pangandaran (Kab.),Purwakarta (Kab.),Subang (Kab.),'+
								'Sukabumi,Sumedang (Kab.),Tasikmalaya,Banjarnegara (Kab.),Banyumas (Kab.),Batang (Kab.),Blora (Kab.),Boyolali (Kab.),'+
								'Brebes (Kab.),Cilacap (Kab.),Demak (Kab.),Grobogan (Kab.),Jepara (Kab.),Karanganyar (Kab.),Kebumen (Kab.),Kendal (Kab.),'+
								'Klaten (Kab.),Kudus (Kab.),Magelang,Pati (Kab.),Pekalongan,Pemalang (Kab.),Purbalingga (Kab.),Purworejo (Kab.),'+
								'Rembang (Kab.),Salatiga (Kota),Semarang,Sragen (Kab.),Sukoharjo (Kab.),Surakarta (Kota),Tegal,Temanggung (Kab.),'+
								'Wonogiri (Kab.),Wonosobo (Kab.),Bangkalan (Kab.),Banyuwangi (Kab.),Batu (Kota),Blitar,Bojonegoro (Kab.),Bondowoso (Kab.),'+
								'Gresik (Kab.),Jember (Kab.),Jombang (Kab.),Kediri,Lamongan (Kab.),Lumajang (Kab.),Madiun,Magetan (Kab.),Malang,Mojokerto,'+
								'Nganjuk (Kab.),Ngawi (Kab.),Pacitan (Kab.),Pamekasan (Kab.),Pasuruan,Ponorogo (Kab.),Probolinggo,Sampang (Kab.),'+
								'Sidoarjo (Kab.),Situbondo (Kab.),Sumenep (Kab.),Surabaya (Kota),Trenggalek (Kab.),Tuban (Kab.),Tulungagung (Kab.),'+
								'Medan (Kota),Balikpapan (Kota),Makassar (Kota),Padang (Kota),Pekanbaru (Kota),Jambi (Kota),Bengkulu (Kota),'+
								'Palembang (Kota),Samarinda (Kota),Pontianak (Kota),Palangka Raya (Kota),Banjarmasin (Kota)',
					per_page: 100
				}
			}

      HTTP({
        method: 'GET',
        url: url,
        params: params,
        headers: headers
      }).then(response => {
        if (block === 'city'){
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
    handleNext (){
      this.$emit('next', 2)
    },
    checkValidasi(){
      let validate = false
      if(this.dataBranch.business_age !== '' && this.dataBranch.fileBank !== null && this.dataBranch.phone_number !== ''){
        validate = true
      }
      return validate;
    }
  }
}
</script>
