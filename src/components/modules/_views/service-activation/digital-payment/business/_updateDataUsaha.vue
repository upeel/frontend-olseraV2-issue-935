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
                <svg-icon v-if="dataUsaha.status_location_business && dataUsaha.business_type && dataUsaha.address
                " icon-class="status_icon"></svg-icon>
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
                <div class="font-18 pb-16">{{rootLang.required_photo}} (6)</div>

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
                <el-card class="box-card">
                  <el-row>
                    <el-col :xs="14" :sm="12" :md="12" :lg="14" :xl="16" align="left">
                      <p class="pt-24 pb-10 word-break"><span class="font-11" style="color: #F56C6C">*</span> {{rootLang.photo_company_taxpayer_number}}</p>
                    </el-col>
                    <el-col :xs="10" :sm="12" :md="12" :lg="10" :xl="8">
                      <el-form-item class="mb-0" align="center" prop="thumbnail_business_npwp">
                        <el-upload
                          v-loading="uploadingNpwp"
                          :action="uploadPhotoUrl"
                          :headers="headers"
                          :before-upload="beforeUpload"
                          :show-file-list="false"
                          :on-progress="handleUploadNpwpProcess"
                          :on-success="handleUploadNpwpSuccess"
                          :on-error="handleUploadError"
                          list-type="picture-card"
                          >
                          <img
                            v-if="dataUsaha.thumbnail_business_npwp !== null"
                            :src="dataUsaha.thumbnail_business_npwp" alt=""
                          >
                          <i class="el-icon-plus"></i>
                        </el-upload>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-card>

                <el-card class="box-card">
                  <el-row>
                    <el-col :xs="14" :sm="12" :md="12" :lg="14" :xl="16" align="left">
                      <p class="pt-24 pb-10 word-break"><span class="font-11" style="color: #F56C6C">*</span> {{rootLang.photo_sk_menkumhan}}</p>
                    </el-col>
                    <el-col :xs="10" :sm="12" :md="12" :lg="10" :xl="8">
                      <el-form-item class="mb-0" align="center">
                        <el-upload
                          v-loading="uploadingMenkumham"
                          :action="uploadPhotoUrl"
                          :headers="headers"
                          :before-upload="beforeUpload"
                          :show-file-list="false"
                          :on-progress="handleUploadMenkumhamProcess"
                          :on-success="handleUploadMenkumhanSuccess"
                          :on-error="handleUploadError"
                          list-type="picture-card"
                          >
                          <img
                            v-if="dataUsaha.thumbnail_sk_menkumham !== null"
                            :src="dataUsaha.thumbnail_sk_menkumham" alt=""
                          >
                          <i v-else class="el-icon-plus"></i>
                        </el-upload>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-card>

                <el-card class="box-card">
                  <el-row>
                    <el-col :xs="14" :sm="12" :md="12" :lg="14" :xl="16" align="left">
                      <p class="pt-24 pb-10 word-break"><span class="font-11" style="color: #F56C6C">*</span> {{rootLang.deed_of_establishment}}</p>
                    </el-col>
                    <el-col :xs="10" :sm="12" :md="12" :lg="10" :xl="8">
                      <el-form-item class="mb-0" align="center">
                        <el-upload
                          v-loading="uploadingPendirian"
                          :action="uploadPhotoUrl"
                          :headers="headers"
                          :before-upload="beforeUploadFile"
                          :show-file-list="false"
                          :on-progress="handleUploadPendirianProcess"
                          :on-success="handleUploadPendirianSuccess"
                          :on-error="handleUploadError"
                          list-type="picture-card"
                          >
                          <div v-if="dataUsaha.thumbnail_akta_pendirian !== null">
                            <img
                             v-if="dataUsaha.pendirian_type_file !== 'pdf'"
                              :src="dataUsaha.thumbnail_akta_pendirian" alt=""
                            >
                            <i v-else class="el-icon-document"></i>
                          </div>
                          <i v-else class="el-icon-plus"></i>
                        </el-upload>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-card>

                <el-card class="box-card">
                  <el-row>
                    <el-col :xs="14" :sm="12" :md="12" :lg="14" :xl="16" align="left">
                      <p class="pt-24 pb-10 word-break"><span class="font-11" style="color: #F56C6C">*</span> {{rootLang.deed_of_change}}</p>
                    </el-col>
                    <el-col :xs="10" :sm="12" :md="12" :lg="10" :xl="8">
                      <el-form-item class="mb-0" align="center">
                        <el-upload
                          v-loading="uploadingPerubahan"
                          :action="uploadPhotoUrl"
                          :headers="headers"
                          :before-upload="beforeUploadFile"
                          :show-file-list="false"
                          :on-progress="handleUploadPerubahanProcess"
                          :on-success="handleUploadPerubahanSuccess"
                          :on-error="handleUploadError"
                          list-type="picture-card"
                          >
                          <div v-if="dataUsaha.thumbnail_akta_perubahan !== null">
                            <img
                              v-if="dataUsaha.perubahan_type_file !== 'pdf'"
                              :src="dataUsaha.thumbnail_akta_perubahan" alt=""
                            >
                            <i v-else class="el-icon-document"></i>
                          </div>
                          <i v-else class="el-icon-plus"></i>
                        </el-upload>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-card>

                <el-card class="box-card">
                  <el-row>
                    <el-col :xs="14" :sm="12" :md="12" :lg="14" :xl="16" align="left">
                      <p class="pt-24 pb-10 word-break"><span class="font-11" style="color: #F56C6C">*</span> {{rootLang.trade_business_licensing}}</p>
                    </el-col>
                    <el-col :xs="10" :sm="12" :md="12" :lg="10" :xl="8">
                      <el-form-item class="mb-0" align="center">
                        <div v-for="(itemSiup, key) in siupEtAll" :key="key" class="remove-image-area mb-12">
                          <img :src="itemSiup" style="min-height: 100px; max-width: 140px;
                            border: 1px solid rgb(192, 204, 218);" alt="Preview">
                          <i class="el-icon-delete remove-image" style="display: inline;" @click="deleteOldSiup(key)"></i>
                        </div>
                        <el-upload
                          list-type="picture-card"
                          :action="uploadPhotoUrl"
                          :headers="headers"
                          :before-upload="beforeUpload"
                          :on-success="handleUploadSiupSuccess"
                          :on-remove="handleRemoveSiup"
                          :on-error="handleUploadError"
                          multiple>
                          <i class="el-icon-plus"></i>
                        </el-upload>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-card>

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
                class="mb-12"
                icon="el-icon-location-outline"
                @click="getGeolocation">
                {{ $lang[langId].use_current_location }}
              </el-button>

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

<style lang="scss">

</style>

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
    siupEtAll: {
      deep: true,
      immediate: true,
      handler(data) {
        this.$emit('change', {siupLama : data})
      }
    },
  },

  data() {
    return{
      uploadPhotoUrl: '',
      uploadingLogo: false,
      uploadingNpwp: false,
      uploadingMenkumham: false,
      uploadingPendirian: false,
      uploadingPerubahan: false,
      uploadingSiup: false,
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
        ],
        thumbnail_business_npwp: [
          {
            message: this.$store.state.userStores.lang.required,
            trigger: 'blur',
            required: true
          }
        ],
        thumbnail_sk_menkumham: [
          {
            message: this.$store.state.userStores.lang.required,
            trigger: 'blur',
            required: true
          }
        ],
        thumbnail_akta_pendirian: [
          {
            message: this.$store.state.userStores.lang.required,
            trigger: 'blur',
            required: true
          }
        ],
        thumbnail_akta_perubahan: [
          {
            message: this.$store.state.userStores.lang.required,
            trigger: 'blur',
            required: true
          }
        ],
        thumbnail_siup_tdp_nib: [
          {
            message: this.$store.state.userStores.lang.required,
            trigger: 'blur',
            required: true
          }
        ],
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
      siupEtAll: [],
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
          status_location_business:  res.status_location_business ? String(res.status_location_business) : '0',
          thumbnail_location_store: null,
          logo_ewallet: res.logo_ewallet
        }

        this.businessTypes.forEach(item => {
          if(item.id === res.business_type){
            this.dataUsaha.business_type = res.business_type
            this.dataUsaha.business_type_name = item.name
          }
        })

        this.getDataUsaha()

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

    getDataUsaha(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let urlSite = 'activation/service/digital-payment?store_id='+this.dataForm.store_id+'&submit_as=2&submission=3'

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, urlSite ),
        headers: headers
      }).then(response => {
        let resp = response.data.data ? response.data.data[0] : null
        if(resp){
          this.dataUsaha.thumbnail_business_npwp = resp.thumbnail_business_npwp[0]
          this.dataUsaha.thumbnail_sk_menkumham = resp.thumbnail_sk_menkumham[0]
          this.dataUsaha.thumbnail_akta_pendirian = resp.thumbnail_akta_pendirian[0]
          this.dataUsaha.pendirian_type_file = resp.thumbnail_akta_perubahan[0] ? resp.thumbnail_akta_pendirian[0].slice(resp.thumbnail_akta_pendirian[0].length - 3) : ''
          this.dataUsaha.thumbnail_akta_perubahan = resp.thumbnail_akta_perubahan[0]
          this.dataUsaha.perubahan_type_file = resp.thumbnail_akta_perubahan[0] ? resp.thumbnail_akta_perubahan[0].slice(resp.thumbnail_akta_perubahan[0].length - 3) : ''
          this.dataUsaha.thumbnail_siup_tdp_nib = []
          this.dataUsaha.vilage = resp.village
          this.siupEtAll = resp.thumbnail_siup_tdp_nib
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

    getCity() {
      this.loadingMoreCities = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let params = {
        search_text: this.dataUsaha.province_id,
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
    
    beforeUpload(file) {
      const isJpg = file.type === 'image/jpeg'
      const isPng = file.type === 'image/png'
      if (!isJpg && !isPng) {
        this.$message.error(this.$lang[this.langId].error_upload_photo)
      }
      return isJpg || isPng
    },

    beforeUploadFile(file) {
      const isJpg = file.type === 'image/jpeg'
      const isPng = file.type === 'image/png'
      const isPdf = file.type === 'application/pdf'

      if (!isJpg && !isPng && !isPdf) {
        this.$message.error(this.$lang[this.langId].error_upload_photo_pdf)
      }
      return isJpg || isPng || isPdf
    },
    
    uploadLogoEwalletProcess(){
      this.uploadingLogo = true
    },

    uploadLogoEwalletSuccess(response, file, fileList) {
      this.dataUsaha.logo_ewallet = response[0].photo_md
      this.uploadingLogo = false
    },

    handleUploadNpwpProcess(){
      this.uploadingNpwp = true
    },

    handleUploadNpwpSuccess(response, file, fileList) {
      this.dataUsaha.thumbnail_business_npwp = response[0].photo_md
      this.uploadingNpwp = false
    },

    handleUploadMenkumhamProcess(){
      this.uploadingMenkumham = true
    },

    handleUploadMenkumhanSuccess(response, file, fileList) {
      this.dataUsaha.thumbnail_sk_menkumham = response[0].photo_md
      this.uploadingMenkumham = false
    },

    handleUploadPendirianProcess(){
      this.uploadingPendirian = true
    },

    handleUploadPendirianSuccess(response, file, fileList) {
      if(response[0].hasOwnProperty('pdf_file') === true){
        this.dataUsaha.thumbnail_akta_pendirian = response[0].pdf_file
        this.dataUsaha.pendirian_type_file = 'pdf'
      }else{
        this.dataUsaha.thumbnail_akta_pendirian = response[0].photo_md
        this.dataUsaha.pendirian_type_file = 'image'
      }
      this.uploadingPendirian = false
    },

    handleUploadPerubahanProcess(){
      this.uploadingPerubahan = true
    },

    handleUploadPerubahanSuccess(response, file, fileList) {
      if(response[0].hasOwnProperty('pdf_file') === true){
        this.dataUsaha.thumbnail_akta_perubahan = response[0].pdf_file
        this.dataUsaha.perubahan_type_file = 'pdf'
      }else{
        this.dataUsaha.thumbnail_akta_perubahan = response[0].photo_md
        this.dataUsaha.perubahan_type_file = 'image'
      }
      this.uploadingPerubahan = false
    },

    handleUploadSiupProcess(){
      this.uploadingSiup = true
    },

    handleUploadSiupSuccess(response, file, fileList) {
      var dataFile = this.dataUsaha.thumbnail_siup_tdp_nib ? this.dataUsaha.thumbnail_siup_tdp_nib : []
      this.dataUsaha.thumbnail_siup_tdp_nib = dataFile ? dataFile.concat(response[0]) : dataFile.push(response[0])
      this.uploadingSiup = false
    },

    handleRemoveSiup(file, fileList) {
      let toRemove = file.response[0]
      this.dataUsaha.thumbnail_siup_tdp_nib.forEach((item, key) => {
        if(item.file_name === toRemove.file_name)
        this.dataUsaha.thumbnail_siup_tdp_nib.splice(key, 1)
      });
    },

    deleteOldSiup(idx){
      this.siupEtAll.splice(idx, 1);
    },

    handleUploadError(err) {
      this.uploadingLogo = false
      this.uploadingNpwp = false
      this.uploadingMenkumham = false
      this.uploadingPendirian = false
      this.uploadingPerubahan = false
      this.uploadingSiup = false
      this.$notify({
        type: 'warning',
        message: this.rootLang.file_too_large,
        title: 'Error'
      })
    },

    handleNext (){
      let siup = [];
        this.dataUsaha.thumbnail_siup_tdp_nib.forEach((siupFile, idxSiup) => {
          siup.push(siupFile.photo_md);
        });

      var allSiup = siup.concat(this.siupEtAll);
      if(this.dataUsaha.status_location_business && this.dataUsaha.business_type && 
        this.dataUsaha.address &&
        this.dataUsaha.thumbnail_business_npwp && this.dataUsaha.thumbnail_sk_menkumham &&
        this.dataUsaha.thumbnail_akta_pendirian && this.dataUsaha.thumbnail_akta_perubahan && 
        allSiup.length !== 0
      ){
        this.$emit('next', 'bank', {dataUsaha: this.dataUsaha})
      }else{
        this.$notify({
          type: 'warning',
          message: this.rootLang.complete_data_first_in +' '+ this.dataUsaha.name,
          title: 'Error'
        })
      }
    },

    resetBranch(val){
      if(this.dataUsaha.business_type === null && this.dataUsaha.address === ''){
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
