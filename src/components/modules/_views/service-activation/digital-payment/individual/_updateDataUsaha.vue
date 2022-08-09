<template>
    <div class="owner">
      <el-form
        :model="dataUsaha"
        :rules="rulesBranch"
        label-position="top"
        ref="data"
        @submit.native.prevent="handleNext">
        <div class="branchStore">
          <div class="col-sm-6 col-xs-8 px-12 pt-4" align="left" >
            <div class="unset-height pointer pt-8" style="width: 100%;">
              <img class="pr-8" :src="dataUsaha.logo ? dataUsaha.logo : '../../../../../../../static/img/no_photo.png'" style="height: 25px" />
              
                <span style="width: 100%; white-space: nowrap; overflow: hidden;">{{dataUsaha.name}}</span>
                <svg-icon v-if="dataUsaha.status_location_business && dataUsaha.business_type && dataUsaha.address" 
                icon-class="status_icon"></svg-icon>
                <span v-else
                  class="tag-info-circle">
                  <svg-icon icon-class="info"></svg-icon>
                </span>
              </div>
            </div>
          <div class="col-sm-6 col-xs-4 px-12 pt-8" align="right">
            <el-button size="small" @click="handleNext('summary')" type="primary">
              {{$lang[langId].finish}}
            </el-button>
          </div>
        </div>
        <div class="row equal-cols">
          <div class="col-xs-12 col-sm-6">
            <div class="owner-left-side" style="background-color: #F5F5F5;">
              <el-card class="box-card">
                <el-row>
                  <el-col :xs="14" :sm="12" :md="12" :lg="14" :xl="16" align="left">
                    <p class="pt-24 pb-10 word-break"><span class="font-11" style="color: #F56C6C">*</span> {{rootLang.company_logo}}</p>
                  </el-col>
                  <el-col :xs="10" :sm="12" :md="12" :lg="10" :xl="8">
                    <el-form-item class="mb-0" align="center">
                      <el-upload
                        v-loading="uploadingLogo"
                        :action="uploadPhotoUrl"
                        :headers="headers"
                        :before-upload="beforeUpload"
                        :show-file-list="false"
                        :on-progress="uploadLogoEwalletProcess"
                        :on-success="uploadLogoEwalletSuccess"
                        :on-error="handleUploadError"
                        list-type="picture-card"
                        >
                        <img
                          v-if="dataUsaha.logo_ewallet !== null"
                          :src="dataUsaha.logo_ewallet" alt=""
                        >
                        <i v-else class="el-icon-plus"></i>
                      </el-upload>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-card>

              <gmap-map
                ref="storeLocationOnMap"
                :center="marker.position"
                :zoom.sync="zoom"
                :options="mapOptions"
                style="width: 100%; height: 300px; margin-bottom: 20px;">
                <gmap-marker
                  :position="marker.position"
                  :clickable="true"
                  :draggable="true"
                />
              </gmap-map>
              <el-button
                type="primary"
                icon="el-icon-location-outline"
                @click="getGeolocation">
                {{ $lang[langId].use_current_location }}
              </el-button>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6">
            <div class="owner-right-side" style="background-color: #FFFFFF">
              <el-form-item :label="lang.store_name" prop="name"> 
                <el-input class="input-radius" v-model="dataUsaha.name" readonly type="text" size="small" style="width: 100%"></el-input>
              </el-form-item>
              <el-form-item :label="rootLang.business_type" prop="business_type">
                <el-select class="input-radius"
                 v-model="dataUsaha.business_type"
                 @change="(value) => handleSelectedType(value)"
                 :placeholder="rootLang.select"
                 size="small"
                 style="width: 100%">
                  <el-option
                    v-for="(item, idxBusiness) in businessTypes"
                    :key="idxBusiness"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
									<el-option v-if="moreBusiness" :value="0" style="background: #767676; color: #F5F5F5;">
										<span style="font-size: 13px; margin-right: 10px; float: left">
											<el-button type="text" icon="el-icon-more" size="mini" style="color: #F5F5F5;"></el-button>
										</span>
										<span>{{ $lang[langId].load_more }}</span>
									</el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="rootLang.url_id">
                <el-input class="input-radius" v-model="dataUsaha.url_id" readonly type="text" size="small" style="width: 100%"></el-input>
              </el-form-item>

              <el-form-item :label="rootLang.business_location_status" prop="status_location_business">
                <el-radio-group v-model="dataUsaha.status_location_business" size="small" class="full-radio">
                  <el-radio-button label="0">{{$lang[langId].ones_own}}</el-radio-button>
                  <el-radio-button label="1">{{$lang[langId].rent}}</el-radio-button>
                </el-radio-group>
              </el-form-item>

              <el-form-item :label="rootLang.store_location" prop="address">
                <el-input class="input-radius" v-model="dataUsaha.address" type="text" size="small" style="width: 100%"></el-input>
              </el-form-item>

              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item :label="rootLang.province">
                    <el-select class="input-radius"
                      v-loading="loadingMoreState"
                      v-model="dataUsaha.province_id" 
                      :placeholder="rootLang.select" 
                      @change="handleSelected('state', dataUsaha.state_id)"
                      size="small"
                      disabled
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
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="lang.city">
                    <el-select class="input-radius"
                      v-model="dataUsaha.city_id"
                      v-loading="loadingMoreCities"
                      :placeholder="rootLang.select" 
                      @change="handleSelected('city', dataUsaha.city_id)"
                      size="small"
                      disabled
                      style="width: 100%">
                      <el-option
                        v-for="item in cities"
                        :key="item.id"
                        :label="item.city"
                        :value="item.id"
                        >
                      </el-option>
                      <el-option v-if="moreCities" :value="0" style="background: #767676; color: #F5F5F5;">
                        <span style="font-size: 13px; margin-right: 10px; float: left">
                          <el-button type="text" icon="el-icon-more" size="mini" style="color: #F5F5F5;"></el-button>
                        </span>
                        <span>{{ $lang[langId].load_more }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item :label="rootLang.sub_district">
                    <el-select class="input-radius"
                      v-model="dataUsaha.kecamatan_id" 
                      :placeholder="rootLang.select" 
                      v-loading="loadingMoreSubDistrict"
                      @change="handleSelected('subDistrict', dataUsaha.sub_district_id)"
                      size="small"
                      disabled
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
                <el-col :span="12">
                  <el-form-item :label="rootLang.urban_village">
                      <el-input class="input-radius" v-model="dataUsaha.vilage" type="text" size="small"
                        style="width: 100%"></el-input>
                    </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :lg="12" :md="12" :sm="12" :xs="24">
                  <el-form-item :label="lang.postal_code">
                      <el-input class="input-radius" v-model="dataUsaha.postal_code" type="text" size="small"
                        style="width: 100%" onkeydown="return ( event.ctrlKey || event.altKey 
                        || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                        || (95<event.keyCode && event.keyCode<106)
                        || (event.keyCode==8) || (event.keyCode==9) 
                        || (event.keyCode>34 && event.keyCode<40) 
                        || (event.keyCode==46) )"></el-input>
                    </el-form-item>
                </el-col>
              </el-row>
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
import { getBusinessTypes } from '@/api/auth';
import { gmapApi } from 'vue2-google-maps'

export default {
  mixins: [basicComputedMixin],
  
  computed: {
    headers() {
      return {
        'Authorization': 'Bearer ' + this.token.access_token
      }
    },
    google: gmapApi,
  },

  props: ['dataForm'],

  watch: {
    dataUsaha: {
      deep: true,
      immediate: true,
      handler(data) {
        this.$emit('change', {dataUsaha : data})
      }
    },
  },

  data() {
    return{
      uploadPhotoUrl: '',
      uploadingLogo: false,
      businessTypes: [],
      stateCity: [],
      cities: [],
      form: {},
      subDistrict: [],
			moreBusiness: null,
      moreState: null,
      moreCities: null,
      moreSubDistrict: null,
      loadingMoreState: false,
      loadingMoreCities: false,
      loadingMoreSubDistrict: false,
      rulesBranch: {
        status_location_business: [
          {
            message: this.$store.state.userStores.lang.required,
            trigger: 'blur',
            required: true
          }
        ],
        business_type: [
          {
            message: this.$store.state.userStores.lang.required,
            trigger: 'blur',
            required: true
          }
        ],
        address: [
          {
            message: this.$store.state.userStores.lang.required,
            trigger: 'blur',
            required: true
          }
        ]
      },
      mapOptions: {
        minZoom: 5,
        maxZoom: 20,
        draggable: true,
        scrollwheel: false,
        mapTypeControl: false,
        zoomControl: true,
        scaleControl: true,
        streetViewControl: false
      },
      zoom: 10,
      marker: {
        position: {
          lat: -7.7470633,
          lng: 110.42026194444445
        },
        label: {
          color: 'black',
          fontFamily: 'Material Icons',
          fontSize: '20px',
          text: 'face'
        }
      },
      dataUsaha: {},
			paramsBussines: {
        per_page: 15,
        page: 1,
        total: null
			}
    }
  },
  mounted(){
    this.uploadPhotoUrl = baseApi(this.selectedStore.url_id, this.langId, 'activation/service/upload')
    this.getBusinessCategory()
    this.getStore()
    this.getStateCity()
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

        this.dataUsaha = {
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
          address: res.address,
          lat: res.location_lat,
          lng: res.location_lon,
          postal_code: res.postal_code,
          status_location_business: res.status_location_business ? String(res.status_location_business) : '0',
          thumbnail_location_store: null,
          logo_ewallet: res.logo_ewallet
        }

        this.businessTypes.forEach(item => {
          if(item.id === res.business_type){
            this.dataUsaha.business_type = res.business_type
            this.dataUsaha.business_type_name = item.name
          }
        })

        this.marker.position = {
          lat: parseInt(this.dataUsaha.lat),
          lng: parseInt(this.dataUsaha.lng)
        }

        this.getCity(this.dataUsaha.province_id)
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    getBusinessCategory(val){
			if(val === 0){
				this.paramsBussines.page = this.paramsBussines.page + 1
			}
      getBusinessTypes(this.paramsBussines).then(response => {
				response.data.data.forEach(item => {
					this.businessTypes.push(item)
				})
        this.paramsBussines.per_page = response.data.meta.per_page
        this.paramsBussines.page = response.data.meta.current_page
        this.paramsBussines.total = response.data.meta.total
				this.moreBusiness = response.data.links.next
      })
    },

    getStateCity() {
      this.loadingMoreState = true

      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        per_page: 100,
      }
      if(this.dataUsaha.province_id){
        params = {
          search_column: 'id',
          search_operator: '=',
          per_page: 100,
          search_text: this.dataUsaha.province_id
        }
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'state'),
        headers: headers,
        params: params
      }).then(response => {
        this.loadingMoreState = false
        this.stateCity = response.data.data
          // this.dataUsaha.province = response.data.data[0].name

        this.moreState = response.data.links.next
      }).catch(error => {
        this.loadingMoreState = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    handleSelectedType(value){
			if(value === 0){
				this.getBusinessCategory(value)
			}else{
				const val = value ? value : this.dataUsaha.business_type
				this.businessTypes.forEach(item => {
					if(item.id === val){
						this.dataUsaha.business_type = item.id
						this.dataUsaha.business_type_name = item.name
					}
				})
			}
    },

    handleSelected(block, val) {
      if (block === 'state') {
        this.loadingMoreCities = true
        this.cities = []
        this.subDistrict = []
        this.stateCity.forEach(item => {
          if(item.id === val){
            this.dataUsaha.state_name = item.name
          }
        });
        this.dataUsaha.city_id = null
        this.dataUsaha.sub_district_id = null
        this.getCity(val)
        this.loadingMoreCities = false
      } else if (block === 'city') {
        this.loadingMoreSubDistrict = true
        this.subDistrict = []
        this.cities.forEach(item => {
          if(item.id === val){
            this.dataUsaha.city_name = item.city
          }
        })
        this.dataUsaha.sub_district_id = null
        this.getSubDistrict(val)
        this.loadingMoreSubDistrict = false
      }else if(block === 'subDistrict'){
        this.subDistrict.forEach(item => {
          if(item.id === val){
            this.dataUsaha.sub_district_name = item.name
          }
        })
      }
    },

    beforeUpload(file) {
      const isJpg = file.type === 'image/jpeg'
      const isPng = file.type === 'image/png'
      if (!isJpg && !isPng) {
        this.$message.error(this.$lang[this.langId].error_upload_photo)
      }
      return isJpg || isPng
    },

    uploadLogoEwalletProcess(){
      this.uploadingLogo = true
    },

    uploadLogoEwalletSuccess(response, file, fileList) {
      this.dataUsaha.logo_ewallet = response[0].photo_md
      this.uploadingLogo = false
    },

    handleUploadError(err) {
      this.uploadingLogo = false
      this.$notify({
        type: 'warning',
        message: this.rootLang.file_too_large,
        title: 'Error'
      })
    },

    getGeolocation() {
      const infowindow = new this.google.maps.InfoWindow()
      const map = this.$refs["storeLocationOnMap"].$mapObject
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        map.setCenter(pos)
        this.marker.position = pos
        this.getFormattedAddress(pos.lat, pos.lng)
      })
    },

    getFormattedAddress(lat, lng) {
      this.dataUsaha.lat = lat
      this.dataUsaha.lng = lng
      axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          latlng: lat + ',' + lng,
          key: 'AIzaSyA0adbyptSOlZbbq9T_z6X4y7TS9rOFryo'
        }
      }).then(response => {
        this.dataUsaha.address = response.data.results[0].formatted_address
      }).catch(e => {
        // this.errors.push(e)
      })
    },

    getCity(val) {
      this.loadingMoreCities = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let params = {
        search_text: val,
        search_column: 'state_id',
        search_operator: '=',
        per_page: 100
      }
      
      if(this.dataUsaha.city_id){
        params = {
          search_column: 'id',
          search_operator: '=',
          per_page: 100,
          search_text: this.dataUsaha.city_id
        }
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'shippingcity'),
        headers: headers,
        params: params
      }).then(response => {
        this.cities = response.data.data
        this.moreCity = response.data.links.next
        this.loadingMoreCities = false
        this.getSubDistrict()
      }).catch(error => {
        this.loadingMoreCities = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    getSubDistrict() {
      this.loadingMoreSubDistrict = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let params = {
        search_text: this.dataUsaha.city_id,
        search_column: 'city_id',
        search_operator: '=',
        per_page: 100
      }
      
      if(this.dataUsaha.kecamatan_id){
        params = {
          search_column: 'id',
          search_operator: '=',
          per_page: 100,
          search_text: this.dataUsaha.kecamatan_id
        }
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'shippingcitysubdistrict'),
        headers: headers,
        params: params
      }).then(response => {
        this.subDistrict = response.data.data
        this.moreSubDistrict = response.data.links.next

        this.loadingMoreSubDistrict = false
      }).catch(error => {
        this.loadingMoreSubDistrict = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    handleNext (){
      if(this.dataUsaha.status_location_business && this.dataUsaha.business_type && this.dataUsaha.address && this.dataUsaha.logo_ewallet){
        this.$emit('next', 'bank', {dataUsaha: this.dataUsaha})
      }else{
        this.$notify({
          type: 'warning',
          message: this.rootLang.complete_data_first_in +' '+ this.dataUsaha.name,
          title: 'Error'
        })
      }
    },

    resetBranch(){
      if(this.dataUsaha.business_type === null && this.dataUsaha.address === '' && !this.dataUsaha.logo_ewallet){
        this.$notify({
          type: 'warning',
          message: this.rootLang.complete_data_first_in +' '+ this.dataUsaha.name,
          title: 'Error'
        })
      }
    }
  }
}
</script>
