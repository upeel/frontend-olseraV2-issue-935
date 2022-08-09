<template>
  <el-row :gutter="10">
    <el-col :md="8">
      <el-card v-loading="loading" class="box-card">
        <div class="card-body">
          <div class="flex-container flex--container-wrap flex-align-items">
            <div class="package-img mr-8">
              <div v-if="changePhoto">
                <el-upload
                  drag
                  :action="uploadPhotoUrl"
                  :data="{id: dataStore.id}"
                  :headers="headers"
                  :on-error="handleUploadFailed"
                  :on-success="handleUploadSuccess">
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">{{ $lang[langId].drop_file_or_click }}</div>
                </el-upload>
                <button-action-authenticated
                  :permission="['settings/generalsetting', 'edit']"
                  icon="el-icon-close"
                  @click="changePhoto = false">
                  {{ lang.cancel }}
                </button-action-authenticated>
              </div>

              <div v-else>
                <div>
                  <el-avatar
                    v-if="dataStore.logo"
                    :src="dataStore.logo"
                    :size="120"
                    shape="square"
                    style="margin-bottom: 12px;"
                  />
                </div>
                <button-action-authenticated
                  :permission="['settings/generalsetting', 'edit']"
                  icon="el-icon-picture"
                  type="info"
                  @click="changePhoto = true">
                  {{ lang.change_logo }}
                </button-action-authenticated>
              </div>
            </div>

            <div>
              <h3 style="margin-top: 0;">{{ dataStore.name }}</h3>
              <p>{{ dataStore.ext_domain }}</p>
            </div>
          </div>
        </div>
      </el-card>
    </el-col>

    <el-col :md="16">
      <el-card v-loading="loading" class="box-card">
        <div slot="header" class="table-handler-flex">
          <h4 style="flex-grow: 1">{{ lang.store_info }}</h4>
          <div>
            <button-action-authenticated v-if="!isEdit" type="primary" :permission="['settings/generalsetting', 'edit']" @click="edit">{{ lang.edit }}</button-action-authenticated>
            <el-button v-if="isEdit" @click="cancel">{{ lang.cancel }}</el-button>
            <el-button v-if="isEdit" type="success" @click="save">{{ lang.save }}</el-button>
          </div>
        </div>
        <div class="card-body">
          <el-form label-width="200px">
            <el-form-item :label="lang.store_name">
              <el-input v-if="!isEdit" v-model="dataStore.name" disabled></el-input>
              <el-input v-if="isEdit" v-model="formEdit.name"></el-input>
            </el-form-item>

            <el-form-item :label="lang.email">
              <template v-if="!isEdit">
                <el-tag
                  v-for="(email) in emails"
                  :key="email"
                  type="info"
                  size="mini">
                  {{email}}
                </el-tag>
              </template>

              <template v-else>
                <el-tag
                  v-for="(email) in emails"
                  :key="email"
                  type="primary"
                  size="mini"
                  @close="removeEmail(email)"
                  :closable="true">
                  {{email}}
                </el-tag>
              </template>
            </el-form-item>
            <el-form-item  v-if="isEdit">
              <template slot="label">
                <h5 style="margin-top: 0;"><strong>{{ lang.add }} {{ lang.email }}</strong></h5>
                <p class="input-desc size-12 oldgrey">{{ lang.info_customer_contact_email }}</p>
              </template>
              <el-input v-model="inputEmail" @keyup.enter.native="addEmail" :placeholder="$lang[langId].split_with_enter"></el-input>
            </el-form-item>
            <el-form-item
              v-if="isEdit"
              :label="$lang[langId].phone_more_than_1">
              <el-input v-model="formEdit.phone_1" :disabled="computedDisabledInput" type="tel" style="margin-bottom: 3px;" />
              <el-input v-model="formEdit.phone_2" :disabled="computedDisabledInput" type="tel" style="margin-bottom: 3px;" />
              <el-input v-model="formEdit.phone_3" :disabled="computedDisabledInput" type="tel" style="margin-bottom: 3px;" />
            </el-form-item>
            <el-form-item v-else :label="lang.phone">
              <ul class="list-unstyled">
                <li>{{ dataStore.phone_1 }}</li>
                <li>{{ dataStore.phone_2 }}</li>
                <li>{{ dataStore.phone_3 }}</li>
              </ul>
            </el-form-item>
            <el-form-item>
              <template slot="label">
                <h5 style="margin-top: 0;"><strong>{{ lang.publish_store }}</strong></h5>
                <p class="input-desc size-12 oldgrey">{{ lang.info_website_published }}</p>
              </template>
              <div v-if="!isEdit">
                <p v-if="dataStore.pos_published == 0">{{ lang.no }}</p>
                <p v-if="dataStore.pos_published == 1">{{ lang.yes }}</p>
              </div>
              <div v-else>
                <el-switch
                  v-model="formEdit.pos_published"
                  :active-value="1"
                  :inactive-value="0"
                  @change="publishStore">
                </el-switch>
                <span v-if="formEdit.pos_published == 0">{{ lang.no }}</span>
                <span v-if="formEdit.pos_published == 1">{{ lang.yes }}</span>
              </div>
            </el-form-item>

            <template v-if="isEdit">
              <div class="full-width mt-16">
                <span class="font-12">Tipe Perusahaan</span>
                <el-radio-group
                  v-model="formEdit.is_company"
                  class="full-width flex-container border border--info">
                  <el-radio-button class="lpoint-type" :label="1">
                    Badan Usaha
                  </el-radio-button>
                  <el-radio-button class="lpoint-type" :label="0">
                    Personal
                  </el-radio-button>
                </el-radio-group>
              </div>
              <!-- <div class="full-width mt-16">
                <span class="font-12">{{ rootLang.business_name }}</span>
                <div>
                  <el-input v-model="formEdit.business_type_name" />
                </div>
              </div> -->
              <div class="full-width mt-16 mb-24">
                <span class="font-12">Tipe Bisnis</span>
                <el-select
                  v-model="formEdit.business_type_id"
                  placeholder="Pilih tipe bisnis Anda"
                  filterable
                  style="width:100%">
                  <el-option
                    v-for="item in businessTypes"
                    :key="item.id"
                    :value="item.id"
                    :label="item.name"
                  />
                </el-select>
              </div>

              <div v-if="formEdit.business_type_id === 31" class="mt-12">
                <el-input  v-model="formEdit.business_type_other" placeholder="Bisnis Anda ..." :disabled="computedDisabledInput" type="tel" style="margin-bottom: 3px;" />
              </div>
            </template>
            
            <template v-else>
              <el-form-item label="Tipe Perusahaan">
                <span>{{ dataStore.is_company === 1? 'Badan Usaha' : 'Personal'}}</span>
              </el-form-item>
              <el-form-item label="Tipe Bisnis">
                <span>{{ dataStore.business_type_name }}</span>
              </el-form-item>
            </template>

            <el-collapse>
              <el-collapse-item>
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

                <template slot="title">
                  <label style="margin-left: 20%;">{{ lang.address }}</label>
                </template>
                <el-form-item>
                  <el-button
                    :disabled="!isEdit"
                    type="info"
                    icon="el-icon-location-outline"
                    @click="getGeolocation">
                    {{ $lang[langId].use_current_location }}
                  </el-button>
                </el-form-item>

                <el-form-item :label="lang.address">
                  <div v-if="!isEdit" class="value-address">
                    {{ dataStore.address }}
                  </div>
                  <el-input type="textarea" v-else v-model="formEdit.address"></el-input>
                </el-form-item>

                <el-form-item :label="lang.country">
                  <div v-if="!isEdit" class="value-address">
                    {{ dataStore.country_name }}
                  </div>

                  <el-select
                    v-if="isEdit"
                    v-model="formEdit.country_id"
                    @change="handleSelected('country', formEdit.country_id)"
                    v-loading="loadingMoreCountry">
                    <el-option
                      v-for="(item) in countries"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                    <el-option v-if="moreCountry" :value="0" style="background: #767676; color: #F5F5F5;">
                      <span style="font-size: 13px; margin-right: 10px; float: left">
                        <el-button type="text" icon="el-icon-more" size="mini" style="color: #F5F5F5;"></el-button>
                      </span>
                      <span>{{ $lang[langId].load_more }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item :label="lang.province">
                  <el-select v-if="!isEdit" v-model="dataStore.state_id" disabled>
                    <el-option
                      v-for="(item) in stateCity"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <el-select
                    v-if="isEdit"
                    v-model="formEdit.state_id"
                    v-loading="loadingMoreState"
                    filterable
                    @change="handleSelected('state', formEdit.state_id)">
                    <el-option
                      v-for="(item) in stateCity"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                    <el-option v-if="moreState" :value="0" style="background: #767676; color: #F5F5F5;">
                      <span style="font-size: 13px; margin-right: 10px; float: left">
                        <el-button type="text" icon="el-icon-more" size="mini" style="color: #F5F5F5;"></el-button>
                      </span>
                      <span>{{ $lang[langId].load_more }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item :label="lang.city">
                  <el-select v-if="!isEdit" v-model="dataStore.city_id" disabled>
                    <el-option
                      v-for="(item) in cities"
                      :key="item.id"
                      :label="item.city"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <el-select
                    v-if="isEdit"
                    v-model="formEdit.city_id"
                    filterable
                    v-loading="loadingMoreCity"
                    @change="handleSelected('city', formEdit.city_id)">
                    <el-option
                      v-for="(item) in cities"
                      :key="item.id"
                      :label="item.city"
                      :value="item.id">
                    </el-option>
                    <el-option v-if="moreCity" :value="0" style="background: #767676; color: #F5F5F5;" @click="loadMore">
                      <span style="font-size: 13px; margin-right: 10px; float: left">
                        <el-button type="text" icon="el-icon-more" size="mini" style="color: #F5F5F5;" ></el-button>
                      </span>
                      <span>{{ $lang[langId].load_more }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item :label="lang.subdistrict">
                  <el-select v-if="!isEdit" v-model="dataStore.subdistrict_id" disabled>
                    <el-option
                      v-for="(item) in subdistrict"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <el-select
                    v-if="isEdit"
                    v-model="formEdit.subdistrict_id"
                    v-loading="loadingMoreSubdistrict"
                    filterable
                    @change="handleSelected('subdistrict', formEdit.subdistrict_id)">
                    <el-option
                      v-for="(item) in subdistrict"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                    <el-option v-if="moreSubdistrict" :value="0" style="background: #767676; color: #F5F5F5;">
                      <span style="font-size: 13px; margin-right: 10px; float: left">
                        <el-button type="text" icon="el-icon-more" size="mini" style="color: #F5F5F5;"></el-button>
                      </span>
                      <span>{{ $lang[langId].load_more }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item :label="lang.postal_code">
                  <el-input v-if="!isEdit" v-model="dataStore.postal_code" disabled></el-input>
                  <el-input v-else v-model="formEdit.postal_code"></el-input>
                </el-form-item>
              </el-collapse-item>
            </el-collapse>
          </el-form>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import { gmapApi } from 'vue2-google-maps'
const apiEndpoint = 'generalsetting/'

import { getBusinessTypes } from '@/api/auth'
import basicComputedMixin from '@/mixins/basicComputedMixin'

export default {
  mixins: [basicComputedMixin],
  data() {
    return {
      loading: true,
      changePhoto: false,
      isEdit: false,
      inputEmail: '',
      dataStore: {},
      formEdit: {},
      emails: [],
      countries: [],
      stateCity: [],
      cities: [],
      subdistrict: [],
      moreCountry: null,
      moreState: null,
      moreCity: null,
      moreSubdistrict: null,
      loadingMoreCountry: false,
      loadingMoreState: false,
      loadingMoreCity: false,
      loadingMoreSubdistrict: false,
      currentPlace: null,
      // headers: {
      //   'Authorization': 'Bearer ' + this.$store.state.user.token.access_token
      // },
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
      businessTypes: [],
    }
  },

  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    token() {
      return this.$store.state.user.token
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    uploadPhotoUrl() {
      return baseApi(this.selectedStore.url_id, this.$store.state.userStores.langId, apiEndpoint + 'uploadlogo')
    },
    fileList() {
      if (this.dataStore.logo) {
        let fileList = []
        fileList.push({
          url: this.dataStore.logo,
          name: this.dataStore.logo_name
        })
        return fileList
      }
    },
    google: gmapApi,
    computedDisabledInput() {
      if (this.isEdit) {
        return false
      } else {
        return true
      }
    }
  },

  watch: {
    '$store.getters.selectedStore'() {
      this.getStoreData()
    }
  },

  mounted() {
    this.getStoreData()
    this.getBusinessTypes()
  },

  methods: {
    getStoreData() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint),
        headers: headers
      })
        .then(response => {
          this.dataStore = response.data.data
          if (this.dataStore.location_lat && this.dataStore.location_lon) {
            this.marker.position = {
              lat: parseFloat(this.dataStore.location_lat),
              lng: parseFloat(this.dataStore.location_lon)
            }
          }
          this.emails = this.dataStore.email.split(',')
          this.checkAddressDetail()
          this.loading = false
        })
        .catch(error => {
          this.loading = false
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        })
    },

    checkAddressDetail() {
      this.getCountry()
      this.getStateCity(this.dataStore.country_id)
      this.getCity(this.dataStore.state_id)
      this.getSubdistrict(this.dataStore.city_id)
    },

    getCountry() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search: '',
        per_page: 100
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'shippingcountry'),
        headers: headers,
        params: params
      }).then(response => {
        this.countries = response.data.data
        this.moreCountry = response.data.links.next
        if (this.isEdit) {
          this.formEdit.country_id = ''
          this.formEdit.country_name = ''
          this.formEdit.state_id = ''
          this.formEdit.state_name = ''
          this.formEdit.city_id = ''
          this.formEdit.city_name = ''
          this.formEdit.subdistrict_id = ''
          this.formEdit.postal_code = ''
        }
        this.loading = false
      }).catch(error => {
        // console.log(error)
        this.countries = []
        this.loading = false
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
        this.$set(params, 'search_text', 0)
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'state'),
        headers: headers,
        params: params
      }).then(response => {
        this.stateCity = response.data.data
        this.moreState = response.data.links.next
        if (val !== 0 && this.isEdit) {
          this.formEdit.state_id = ''
          this.formEdit.state_name = ''
          this.formEdit.city_id = ''
          this.formEdit.city_name = ''
          this.formEdit.subdistrict_id = ''
          this.formEdit.postal_code = ''
        }
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
      this.loading = true
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
        this.loading = false
        if (val !== 0 && this.isEdit) {
          this.formEdit.city_id = ''
          this.formEdit.city_name = ''
          this.formEdit.subdistrict_id = ''
          this.formEdit.postal_code = ''
        }
      }).catch(error => {
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    getSubdistrict(val) {
      this.loading = true
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
        this.subdistrict = response.data.data
        this.moreSubdistrict = response.data.links.next
        if (val !== 0 && this.isEdit) {
          this.formEdit.subdistrict_id = ''
          this.formEdit.postal_code = ''
        }
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

    handleSelected(block, val) {
      if (block === 'country') {
        if (val === 0) {
          let params = {
            search: '',
            per_page: 100
          }
          this.loadMore(block, this.moreCountry, params )
        } else {
          this.stateCity = []
          this.getStateCity(val)
        }
      } else if (block === 'state') {
        this.cities = []
        this.getCity(val)
      } else if (block === 'city') {
        this.subdistrict = []
        this.getSubdistrict(val)
      }
    },

    loadMore(block, url, params) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: url,
        params: params,
        headers: headers
      }).then(response => {
        if (block === 'country') {
          if (response.data.links.next) {
            this.formEdit.country_id = this.countries[99].name
          } else {
            this.formEdit.country_id = this.countries[199].name
          }
          this.countries = this.countries.concat(response.data.data)
          this.moreCountry = response.data.links.next
          this.loadingMoreCountry = false
        } else if (block === 'state') {
          this.stateCity = this.stateCity.concat(response.data.data)
          this.moreState = response.data.links.next
          this.loadingMoreState = false
        } else if (block === 'city') {
          this.cities = this.cities.concat(response.data.data)
          this.moreCity = response.data.links.next
          this.loadingMoreCity = false
        } else if (block === 'subdistrict') {
          this.subdistrict = this.subdistrict.concat(response.data.data)
          this.moreSubdistrict = response.data.links.next
          this.loadingMoreSubdistrict = false
        }
      }).catch(error => {
        if (block === 'country') {
          this.loadingMoreCountry = false
        } else if (block === 'state') {
          this.loadingMoreState = false
        } else if (block === 'city') {
          this.loadingMoreCity = false
        } else if (block === 'subdistrict') {
          this.loadingMoreSubdistrict = false
        }
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    handleUploadFailed(error) {
      this.$notify({
        type: 'warning',
        title: error.response.data.error.message,
        message: error.response.data.error.error
      })
    },
    handleUploadSuccess(response) {
      this.dataStore = response.data
      this.changePhoto = false
    },
    edit() {
      this.formEdit = Object.assign({}, this.dataStore)
      this.isEdit = true
    },
    cancel() {
      this.isEdit = false
      this.formEdit = {}
    },

    removeEmail(email) {
      if (this.emails.length > 1) {
        this.emails.splice(this.emails.indexOf(email), 1)
      } else {
        this.$notify({
          type: 'warning',
          title: this.$lang[this.langId].cant_delete,
          message: this.$lang[this.langId].delete_email
        })
      }
    },

    addEmail(ev) {
      this.inputEmail = ev.target.value
      this.emails.push(this.inputEmail)
      this.inputEmail = ''
    },

    save() {
      let emailData = this.emails.join(',')
      this.formEdit.email = emailData

      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = this.formEdit
      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint + 'update'),
        headers: headers,
        data
      }).then(response => {
        this.result = response.data.data
        this.$message({
          type: 'success',
          message: 'saved'
        })
        this.loading = false
        this.isEdit = false
        this.getStoreData()
        this.$parent.$parent.$parent.getProfile()
        this.$parent.$parent.$parent.getStoreData()
      }).catch(error => {
        this.loading = false
        this.isEdit = true
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    publishStore() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
        pos_published: this.formEdit.pos_published,
        website_published: this.formEdit.website_published
      }
      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndpoint + 'publish'),
        headers: headers,
        data
      }).then(response => {
        this.result = response.data.data
        this.$message({
          type: 'success',
          message: 'saved'
        })
        this.loading = false
        // this.isEdit = false
        // this.getStoreData()
      }).catch(error => {
        this.loading = false
        this.isEdit = true
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    onMapClick(val) {
      this.marker.position.lat = val.latLng.lat()
      this.marker.position.lng = val.latLng.lng()
      this.getFormattedAddress(val.latLng.lat(), val.latLng.lng())
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

    getBusinessTypes() {
      getBusinessTypes({ per_page: 100 }).then(response => {
        this.businessTypes = response.data.data
      })
    },
  }
}
</script>
