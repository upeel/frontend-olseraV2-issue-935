<template>
    <div class="owner">
      <el-form
        :model="form"
        :rules="rulesBranch"
        label-position="top"
        ref="data"
        @submit.native.prevent="handleNext">
        <div class="branchStore">
          <div class="col-sm-6 col-xs-8 px-12 pt-4" align="left" >
            <div class="unset-height pointer pt-8" @click="handleBranchList" style="width: 100%;">
              <img class="pr-8" :src="branchs[branchIdx].logo ? branchs[branchIdx].logo : '../../../../../../../static/img/no_photo.png'" style="height: 25px" />
              
                <span style="width: 100%; white-space: nowrap; overflow: hidden;">{{branchs[branchIdx].name}}</span>
                <svg-icon v-if="branchs[branchIdx].status_location_business && branchs[branchIdx].business_type &&
                  branchs[branchIdx].thumbnail_business_npwp && branchs[branchIdx].thumbnail_sk_menkumham &&
                  branchs[branchIdx].thumbnail_akta_pendirian && branchs[branchIdx].thumbnail_akta_perubahan &&
                  branchs[branchIdx].thumbnail_siup_tdp_nib && branchs[branchIdx].address
                " icon-class="status_icon"></svg-icon>
                <span v-else
                  class="tag-info-circle">
                  <svg-icon icon-class="info"></svg-icon>
                </span>
              </div>
            </div>
          <div class="col-sm-6 col-xs-4 px-12 pt-8" align="right">
            <el-button v-if="branchIdx + 1 === branchs.length" size="small" @click="handleNext('summary')" type="primary">
              {{$lang[langId].finish}}
            </el-button>

            <el-button v-else @click="handleNextBranch" size="small" type="primary">
              <span class="visible-lg visible-md visible-sm">
                {{$lang[langId].next}} {{branchIdx+1}}/{{branchs.length}}
              </span>
              <span class="visible-xs">
                <svg-icon icon-class="arrow-next"></svg-icon>
              </span>
            </el-button>

          </div>
        </div>
        <el-progress :percentage="branchPercent" :show-text="false" type="line"></el-progress>
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
                            v-if="branchs[branchIdx].logo_ewallet !== null"
                            :src="branchs[branchIdx].logo_ewallet.photo_md" alt=""
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
                            v-if="branchs[branchIdx].thumbnail_business_npwp"
                            :src="branchs[branchIdx].thumbnail_business_npwp.photo_md" alt=""
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
                            v-if="branchs[branchIdx].thumbnail_sk_menkumham"
                            :src="branchs[branchIdx].thumbnail_sk_menkumham.photo_md" alt=""
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
                          <div v-if="branchs[branchIdx].thumbnail_akta_pendirian">
                            <img
                              v-if="branchs[branchIdx].thumbnail_akta_pendirian.hasOwnProperty('pdf_file') === false"
                              :src="branchs[branchIdx].thumbnail_akta_pendirian.photo_md" alt=""
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
                          <div v-if="branchs[branchIdx].thumbnail_akta_perubahan">
                            <img
                              v-if="branchs[branchIdx].thumbnail_akta_perubahan.hasOwnProperty('pdf_file') === false"
                              :src="branchs[branchIdx].thumbnail_akta_perubahan.photo_md" alt=""
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
                        <el-upload
                          :id="branchs[branchIdx].store_id"
                          list-type="upload-demo"
                          :show-file-list="false"
                          :action="uploadPhotoUrl"
                          :headers="headers"
                          :before-upload="beforeUpload"
                          :on-progress="handleUploadSiupProcess"
                          :on-success="handleUploadSiupSuccess"
                          :on-error="handleUploadError"
                          multiple>
                          <div class="loadingUploadMultiple">
                              <loading v-if="uploadingSiup" 
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
                        <div class="remove-image-area mt-10" v-for="(siup, keySiup) in this.branchs[this.branchIdx].thumbnail_siup_tdp_nib" :key="keySiup">
                          <img
                            :src="siup.photo_md" alt=""
                          >
                          <div class="remove-image">
                            <span
                              style="position: static; font-size: inherit; color: inherit;"
                              @click="handleRemoveSiup(keySiup)"
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
          <div class="col-xs-12 col-sm-6">
            <div class="owner-right-side" style="background-color: #FFFFFF">
              <el-form-item :label="lang.store_name" prop="name"> 
                <el-input class="input-radius" v-model="branchs[branchIdx].name" readonly type="text" size="small" style="width: 100%"></el-input>
              </el-form-item>
              <el-form-item :label="rootLang.business_type" prop="business_type">
                <el-select class="input-radius"
                 v-model="branchs[branchIdx].business_type"
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
                <el-input class="input-radius" v-model="branchs[branchIdx].url_id" readonly type="text" size="small" style="width: 100%"></el-input>
              </el-form-item>

              <el-form-item :label="rootLang.business_location_status" prop="status_location_business">
                <el-radio-group v-model="branchs[branchIdx].status_location_business" size="small" class="full-radio" @change="changeBranchStatus">
                  <el-radio-button label="0">{{$lang[langId].ones_own}}</el-radio-button>
                  <el-radio-button label="1">{{$lang[langId].rent}}</el-radio-button>
                </el-radio-group>
              </el-form-item>

              <gmap-map
                ref="storeLocationOnMap"
                :center="marker.position"
                :zoom.sync="zoom"
                :options="mapOptions"
                style="width: 100%; height: 300px; margin-bottom: 20px;"
                @click="onMapClick">
                <gmap-marker
                  :position="marker.position"
                  :clickable="true"
                  :draggable="true"
                  @dragend="onMapClick"
                />
              </gmap-map>
              <el-button
                type="primary"
                icon="el-icon-location-outline"
                class="mb-12"
                @click="getGeolocation">
                {{ $lang[langId].use_current_location }}
              </el-button>

              <el-form-item :label="rootLang.store_location" prop="address">
                <el-input class="input-radius" v-model="branchs[branchIdx].address" type="text" size="small" style="width: 100%"></el-input>
              </el-form-item>

              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item :label="rootLang.province">
                    <el-select class="input-radius"
                      v-loading="loadingMoreState"
                      v-model="branchs[branchIdx].province_id" 
                      :placeholder="rootLang.select" 
                      @change="handleSelected('state', branchs[branchIdx].state_id)"
                      size="small"
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
                      v-model="branchs[branchIdx].city_id"
                      v-loading="loadingMoreCities"
                      :placeholder="rootLang.select" 
                      @change="handleSelected('city', branchs[branchIdx].city_id)"
                      size="small"
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
                      v-model="branchs[branchIdx].kecamatan_id" 
                      :placeholder="rootLang.select" 
                      v-loading="loadingMoreSubDistrict"
                      @change="handleSelected('subDistrict', branchs[branchIdx].sub_district_id)"
                      size="small"
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
                      <el-input class="input-radius" v-model="branchs[branchIdx].vilage" type="text" size="small"
                        style="width: 100%"></el-input>
                    </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :lg="12" :md="12" :sm="12" :xs="24">
                  <el-form-item :label="lang.postal_code">
                      <el-input class="input-radius" v-model="branchs[branchIdx].postal_code" type="text" size="small"
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
import Loading from 'vue-loading-overlay';
import { baseApi } from 'src/http-common.js';
import axios from 'axios';
import { getBusinessTypes } from '@/api/auth';
import { gmapApi } from 'vue2-google-maps'

export default {
  components: {
    Loading
  },
  props:{
    branchs: {
      type: Array,
      default: null
    }
  },
  mixins: [basicComputedMixin],
  
  computed: {
    branchPercent(){
      let inBranch = this.branchIdx + 1
      let percent = (inBranch / this.branchs.length) * 100
      return percent;
    },

    headers() {
      return {
        'Authorization': 'Bearer ' + this.token.access_token
      }
    },
    google: gmapApi,
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
      branchIdx: 0,
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
    
  },
  methods: {
    getBusinessCategory(val){
			if(val === 0){
				this.paramsBussines.page = this.paramsBussines.page + 1
			}
      getBusinessTypes(this.paramsBussines).then(response => {
				response.data.data.forEach(item => {
					this.businessTypes.push(item)
					if(this.branchs[this.branchIdx]){
						if(item.id === this.branchs[this.branchIdx].business_type){
							this.branchs[this.branchIdx].business_type_name = item.name
						}
					}
				})
        this.paramsBussines.per_page = response.data.meta.per_page
        this.paramsBussines.page = response.data.meta.current_page
        this.paramsBussines.total = response.data.meta.total
				this.moreBusiness = response.data.links.next
      })
    },

    onMapClick(val) {
      this.marker.position.lat = val.latLng.lat()
      this.marker.position.lng = val.latLng.lng()
      this.getFormattedAddress(val.latLng.lat(), val.latLng.lng())
    },

    getFormattedAddress(lat, lng) {
      this.formEdit.location_lat = lat
      this.formEdit.location_lon = lng
      axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          latlng: lat + ',' + lng,
          key: 'AIzaSyA0adbyptSOlZbbq9T_z6X4y7TS9rOFryo'
        }
      }).then(response => {
        this.formEdit.address = response.data.results[0].formatted_address
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

      if(this.branchs[this.branchIdx].province_id){
        params = {
          search_column: 'id',
          search_operator: '=',
          per_page: 100,
          search_text: this.branchs[this.branchIdx].province_id
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
        if(this.branchs.length !== 0){
          this.branchs[this.branchIdx].province = response.data.data[0].name
        }
        this.getCity()
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
				const val = value ? value : this.branchs[this.branchIdx].business_type
				this.businessTypes.forEach(item => {
					if(item.id === val){
						this.$emit('change', this.branchIdx, 'business_type', item.id)
						this.$emit('change', this.branchIdx, 'business_type_name', item.name)
						// this.branchs[this.branchIdx].business_type_name = item.name
					}
				})
			}
    },

    handleSelected(block, val) {
      // if (block === 'state') {
      //   this.loadingMoreCities = true
      //   this.cities = []
      //   this.subDistrict = []
      //   this.stateCity.forEach(item => {
      //     if(item.id === val){
      //       this.form.branchs[this.branchIdx].state_name = item.name
      //     }
      //   });
      //   this.form.branchs[this.branchIdx].city_id = null
      //   this.form.branchs[this.branchIdx].sub_district_id = null
      //   this.getCity(val)
      //   this.loadingMoreCities = false
      // } else if (block === 'city') {
      //   this.loadingMoreSubDistrict = true
      //   this.subDistrict = []
      //   this.cities.forEach(item => {
      //     if(item.id === val){
      //       this.form.branchs[this.branchIdx].city_name = item.city
      //     }
      //   })
      //   this.form.branchs[this.branchIdx].sub_district_id = null
      //   this.getSubDistrict(val)
      //   this.loadingMoreSubDistrict = false
      // }else if(block === 'subDistrict'){
      //   this.subDistrict.forEach(item => {
      //     if(item.id === val){
      //       this.form.branchs[this.branchIdx].sub_district_name = item.name
      //     }
      //   })
      // }
    },

    getCity() {
      this.loadingMoreCities = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let params = {
        search_text: this.branchs[this.branchIdx].province_id,
        search_column: 'state_id',
        search_operator: '=',
        per_page: 100
      }
      
      if(this.branchs[this.branchIdx].city_id){
        params = {
          search_column: 'id',
          search_operator: '=',
          per_page: 100,
          search_text: this.branchs[this.branchIdx].city_id
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
        search_text: this.branchs[this.branchIdx].city_id,
        search_column: 'city_id',
        search_operator: '=',
        per_page: 100
      }
      
      if(this.branchs[this.branchIdx].kecamatan_id){
        params = {
          search_column: 'id',
          search_operator: '=',
          per_page: 100,
          search_text: this.branchs[this.branchIdx].kecamatan_id
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

    setLocation(){
      this.marker.position = {
        lat: parseInt(this.branchs[this.branchIdx].lat),
        lng: parseInt(this.branchs[this.branchIdx].lng)
      }
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
      this.branchs[this.branchIdx].lat = lat
      this.branchs[this.branchIdx].lng = lng
      axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          latlng: lat + ',' + lng,
          key: 'AIzaSyA0adbyptSOlZbbq9T_z6X4y7TS9rOFryo'
        }
      }).then(response => {
        this.branchs[this.branchIdx].address = response.data.results[0].formatted_address
      }).catch(e => {
        // this.errors.push(e)
      })
    },

    handleBranchList(){
      this.$emit('list')
    },

    handleNextBranch(){
      let inBranch = this.branchIdx  + 1
      if(inBranch < this.branchs.length && this.branchs[this.branchIdx].status_location_business &&
        this.branchs[this.branchIdx].address !== '' &&
        this.branchs[this.branchIdx].thumbnail_business_npwp && this.branchs[this.branchIdx].thumbnail_sk_menkumham &&
        this.branchs[this.branchIdx].thumbnail_akta_pendirian && this.branchs[this.branchIdx].thumbnail_akta_perubahan &&
        this.branchs[this.branchIdx].thumbnail_siup_tdp_nib && this.branchs[this.branchIdx].business_type
      ){
        this.branchIdx += 1
      }else{
        this.$notify({
          type: 'warning',
          message: this.rootLang.complete_data_first_in +' '+ this.branchs[this.branchIdx].name,
          title: 'Error'
        })
      }
      this.getStateCity()
      this.setLocation()
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
      this.branchs[this.branchIdx].logo_ewallet = response[0]
      this.uploadingLogo = false
    },

    handleUploadNpwpProcess(){
      this.uploadingNpwp = true
    },

    handleUploadNpwpSuccess(response, file, fileList) {
      this.branchs[this.branchIdx].thumbnail_business_npwp = response[0]
      this.uploadingNpwp = false
    },

    handleUploadMenkumhamProcess(){
      this.uploadingMenkumham = true
    },

    handleUploadMenkumhanSuccess(response, file, fileList) {
      this.branchs[this.branchIdx].thumbnail_sk_menkumham = response[0]
      this.uploadingMenkumham = false
    },

    handleUploadPendirianProcess(){
      this.uploadingPendirian = true
    },

    handleUploadPendirianSuccess(response, file, fileList) {
      this.branchs[this.branchIdx].thumbnail_akta_pendirian = response[0]
      this.uploadingPendirian = false
    },

    handleUploadPerubahanProcess(){
      this.uploadingPerubahan = true
    },

    handleUploadPerubahanSuccess(response, file, fileList) {
      this.branchs[this.branchIdx].thumbnail_akta_perubahan = response[0]
      this.uploadingPerubahan = false
    },

    handleUploadSiupProcess(){
      this.uploadingSiup = true
    },

    handleUploadSiupSuccess(response, file, fileList) {
      var dataFile = this.branchs[this.branchIdx].thumbnail_siup_tdp_nib ? this.branchs[this.branchIdx].thumbnail_siup_tdp_nib : []
      this.branchs[this.branchIdx].thumbnail_siup_tdp_nib = dataFile ? dataFile.concat(response[0]) : dataFile.push(response[0])
      this.uploadingSiup = false
    },

    handleRemoveSiup(keyRemove) {
      // this.branchs[this.branchIdx].thumbnail_siup_tdp_nib.forEach((item, key) => {
      //   if(key === keyRemove)
        this.branchs[this.branchIdx].thumbnail_siup_tdp_nib.splice(keyRemove, 1)
      // });
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

    changeBranchStatus(){
      this.$emit('change', this.branchIdx, 'status_location_business', this.branchs[this.branchIdx].status_location_business)
    },

    handleNext (){
      let branchComplete = 0
      let branchUncomplete = ''
      this.branchs.forEach((itemBranch, key) => {
        if(itemBranch.status_location_business && itemBranch.business_type && itemBranch.address !== '' &&
          itemBranch.thumbnail_business_npwp && itemBranch.thumbnail_sk_menkumham &&
          itemBranch.thumbnail_akta_pendirian && itemBranch.thumbnail_akta_perubahan &&
          itemBranch.logo_ewallet && itemBranch.thumbnail_siup_tdp_nib.length !== 0
        ){
          branchComplete += 1
        }else{
          branchUncomplete = itemBranch.name
        }
      })
      
      if(branchComplete === this.branchs.length){
        this.$emit('next', 'bank')
      }else{
        this.$notify({
          type: 'warning',
          message: this.rootLang.complete_data_first_in +' '+ branchUncomplete,
          title: 'Error'
        })
      }
    },

    resetBranch(val){

      if(val){
        if(this.branchs[this.branchIdx].status_location_business !== null && this.branchs[this.branchIdx].address !== '' && this.branchs[this.branchIdx].logo_ewallet){
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
    }
  }
}
</script>
