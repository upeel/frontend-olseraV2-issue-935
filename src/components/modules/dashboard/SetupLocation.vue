<template>
  <el-dialog
    :visible.sync="showSetup"
    :show-close="false"
    :before-close="handleCloseMdr"
    custom-class="mw-760">
    <div slot="title" class="flex-container">
      <h4 class="dialog-title full-width">
        Lengkapi Lokasi Toko
      </h4>
      <div class="btn_save_dialog text-right full-width">
        <el-button type="info" @click="handleCloseMdr">{{ $lang[langId].cancel }}</el-button>
        <el-button type="success" :disabled="statusEdit.next" :loading="loadingSave" @click="saveLocation">Selanjutnya</el-button>
      </div>
    </div>
    <div class="flex-container" style="align-items: start !important">
      <div class="full-width p-16">
        <div class="flex-container mb-16">
          <div class="full-width font-18 font-bold">Pin Google Maps</div>
          <div class="text-right" v-if="statusEdit.google"> <svg-icon icon-class="status_icon" class="font-24"/> </div>
        </div>
        <div class="border border--grey p-16">
          <el-button class="btn-block btn-info" @click="showMap = !showMap">Google Maps</el-button>
          <div class="mt-24" style="word-break: keep-all">
            Lengkapi alamat toko dengan Google Maps untuk memudahkan pemesanan online
          </div>
        </div>
        <div v-show="showMap">
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
          <div class="text-right mb-12">
            <el-button
                type="primary"
                size="mini"
                icon="el-icon-location-outline"
                @click="getGeolocation">
                {{ $lang[langId].use_current_location }}
              </el-button>
          </div>
          <div>
            <div class="full-width" style="word-break: keep-all">
              {{ tempGoogleAddress }}
            </div>
          </div>
        </div>
      </div>
      <div class="full-width p-16">
        <div class="flex-container mb-16 font-bold">
          <div class="full-width font-18">Lengkapi Alamat Toko Anda</div>
          <div class="text-right" v-if="statusEdit.address"> <svg-icon icon-class="status_icon" class="font-24"/> </div>
        </div>
        <el-form>
          <el-form-item>
            <div class="font-12">{{ lang.address }}</div>
            <el-input type="textarea" v-model="dataStore.address"></el-input>
          </el-form-item>

          <!-- Country -->
          <el-form-item>
            <div class="font-12">{{ lang.country }}</div>
            <el-select
              v-model="dataStore.country_id"
              @change="handleSelected('country', dataStore.country_id)"
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

            <!-- Province -->
            <el-form-item>
              <div class="font-12">{{ lang.province }}</div>
              <el-select
                v-model="dataStore.state_id"
                v-loading="loadingMoreState"
                filterable
                @change="handleSelected('state', dataStore.state_id)">
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

            <!-- City -->
            <el-form-item>
              <div class="font-12">{{ lang.city }}</div>
              <el-select
                v-model="dataStore.city_id"
                filterable
                v-loading="loadingMoreCity"
                @change="handleSelected('city', dataStore.city_id)">
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

            <!-- District -->
            <el-form-item>
              <div class="font-12">{{ lang.subdistrict }}</div>
              <el-select
                v-model="dataStore.subdistrict_id"
                v-loading="loadingMoreSubdistrict"
                filterable
                @change="handleSelected('subdistrict', dataStore.subdistrict_id)">
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

              <!-- Postal Code -->
            <el-form-item>
              <div class="font-12">{{ lang.postal_code }}</div>
              <el-input v-model="dataStore.postal_code"></el-input>
            </el-form-item>
        </el-form>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { gmapApi } from 'vue2-google-maps'
import { baseApi } from 'src/http-common'
import axios from 'axios'
export default {
  name: 'SetupLocation',

  props: {
    showSetup: {
      type: Boolean,
      default: false
    },
    lang: {
      type: Object,
      default: () => {
        return {}
      }
    },
    langId: {
      type: String,
      default: 'id'
    }
  },

  data() {
    return {
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
      showMap: false,
      loadingMoreCountry: false,
      loadingMoreState: false,
      loadingMoreCity: false,
      loadingMoreSubdistrict: false,
      countries: [],
      moreCountry: null,
      moreState: null,
      moreCity: null,
      stateCity: [],
      cities: [],
      subdistrict: [],
      dataStore: {},
      loadingSave: false,
      termData: {},
      tempGoogleAddress: '',
      moreSubdistrict: ''
    }
  },

  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    token() {
      return this.$store.state.user.token
    },

    statusEdit () {
      let statusEdit = {
        google: false,
        address: false,
        next: true
      }

      if (this.dataStore.location_lat !== '0.0000' && this.dataStore.location_lon !== '0.0000') {
        statusEdit.google = true
      }
      if (this.dataStore.address &&
        this.dataStore.country_id &&
        this.dataStore.state_id && 
        this.dataStore.city_id &&
        this.dataStore.subdistrict_id &&
        this.dataStore.postal_code) {
          statusEdit.address = true
        }
      if (statusEdit.google && statusEdit.address) {
        statusEdit.next = false
      }
      return statusEdit
    },

    google: gmapApi
  },

  mounted() {
    this.getStoreData()
  },

  methods: {
    getStoreData() {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'generalsetting/'),
        headers: headers
      }).then(response => {
          this.dataStore = response.data.data
          this.termData = response.data.data
          this.checkAddressDetail()
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
      if (this.dataStore.country_id) {
        this.getStateCity(this.dataStore.country_id)
      }
      if (this.dataStore.state_id) {
        this.getCity(this.dataStore.state_id)
      }
      if (this.dataStore.city_id) {
        this.getSubdistrict(this.dataStore.city_id)
      }
    },

    async getCountry() {
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
            this.dataStore.country_id = this.countries[99].name
          } else {
            this.dataStore.country_id = this.countries[199].name
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
        console.log('err', error)
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
        if (val !== 0) {
          this.dataStore.state_id = ''
          this.dataStore.state_name = ''
          this.dataStore.city_id = ''
          this.dataStore.city_name = ''
          this.dataStore.subdistrict_id = ''
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
        if (val !== 0) {
          this.dataStore.city_id = ''
          this.dataStore.city_name = ''
          this.dataStore.subdistrict_id = ''
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
        if (val !== 0) {
          this.dataStore.subdistrict_id = ''
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
      this.dataStore.location_lat = lat
      this.dataStore.location_lon = lng
      axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          latlng: lat + ',' + lng,
          key: 'AIzaSyA0adbyptSOlZbbq9T_z6X4y7TS9rOFryo'
        }
      }).then(response => {
        this.tempGoogleAddress = response.data.results[0].formatted_address
        if (this.dataStore.address === null || this.dataStore.address === '') {
          this.dataStore.address = response.data.results[0].formatted_address
        }
        response.data.results[0].address_components.map(i => {
          if (i.types[0] === 'postal_code') {
            this.dataStore.postal_code = i.long_name
          }
        })
      }).catch(e => {
        // this.errors.push(e)
      })
    },

    saveLocation () {
      this.loadingSave = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'generalsetting/update'),
        headers: headers,
        data: this.dataStore
      }).then(response => {
        this.dataStore = response.data.data
        this.savedForm()
        this.loadingSave = false
      }).catch(error => {
        this.loadingSave = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    handleCloseMdr () {
      this.dataStore = this.termData
      this.$emit('close')
    },

    savedForm () {
      this.$emit('save', this.dataStore)
    }
  }
}
</script>