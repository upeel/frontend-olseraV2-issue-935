<template>
  <el-dialog 
    :visible.sync="show"
    :show-close="false"
    :before-close="() => $emit('close')"
    width="536px">
    <div slot="title" class="flex-container">
      <h4 class="dialog-title full-width">
        {{ fullmap ? 'Lokasi Penjemputan Pesanan' : rootLang.delivery }}
      </h4>
      <div class="btn_save_dialog full-width text-right">
        <close-esc @close="handleClose" />
        <!-- <el-button type="info" @click="$emit('close')">{{ lang.cancel }}</el-button>
        <el-button :loading="loadingSave" type="success" @click="save" >{{ lang.save }}</el-button> -->
      </div>
    </div>

    <template v-if="!fullmap">
      <div class="radius-10 color-grey--bg flex-container p-16 mb-12">
        <div>
          <svg-icon icon-class="information-circle" class="font-20 color-grey--icon"/>
        </div>
        <div class="ml-8 full-width p-8 word-break">Pelajari lebih lanjut tentang pengiriman di Olsera</div>
        <div>
          <el-button type="text" @click="sidebarDelivery = true">Selengkapnya</el-button>
        </div>
      </div>

      <div class="mt-24 flex-container">
        <div class="font-20 full-width">Kurir pengiriman</div>
        <div class="pointer" @click="editCourier">
          <svg-icon icon-class="edit-2" class="font-20 color-primary" />
        </div>
      </div>
      <div v-if="!isCourierActive" class="radius-10 color-grey--bg flex-container justify-center py-32 px-64 mb-12">
        <div class="font-18 text-center word-break">Belum ada kurir pengiriman untuk layanan online order</div>
      </div>
      <div v-else class="border border--grey border--with-shadow radius-5 px-16 py-8">
        <div v-for="item in dataCourier" :key="item.courier_online_id" class="flex-container">
          <div v-if="item.is_active" class="full-width flex-container p-8">
            <el-avatar
              :src="item.photo"
              :size="40"
              shape="square"
              class="mr-8"
            />
            <div>
              {{ item.courier_online_name }}
              <div class="font-12 color-grey--placeholder">{{ getDataServiceCourier(item) }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-24 flex-container">
        <div class="font-20 full-width">Lokasi penjemputan pesanan</div>
        <div class="pointer" @click="showFullMap">
          <svg-icon icon-class="edit-2" class="font-20 color-primary"/>
        </div>
      </div>
    </template>

    <div class="mt-8">
      <gmap-map
        ref="storeLocationOnMap"
        :center="marker.position"
        :zoom.sync="zoom"
        :options="mapOptions"
        :style="fullmap ? 'height: 536px;' : 'height: 300px;'"
        style="width: 100%; margin-bottom: 20px;">
        <gmap-marker
          :position="marker.position"
          :clickable="fullmap"
          :draggable="fullmap"
          @dragend="onMapClick"
        />
      </gmap-map>

      <div class="mt-8 flex-container">
        <div class="full-width word-break">
          {{ dataStore.address }}
        </div>
        <div v-if="fullmap" class="text-right" style="width: 40%">
          <el-button type="success" :loading="loadingSaveLocation" @click="saveSettLocation">{{ lang.save }}</el-button>
        </div>
      </div>
    </div>

    <transition name="el-zoom-in-center">
      <div
        v-if="showListCourier"
        class="offscreen-right-sidebar px-null">
        <div class="offscreen-right-sidebar--wrapper">
          <div class="offscreen-right-sidebar--header text-center color-white--bg" style="z-index: 10">
            {{ rootLang.delivery_courier }}
            <close-esc :hideEsc="true" @close="showListCourier = false" />
          </div>
          
          <div class="px-24" v-loading="loadingSaveCourier" >
            <div class="font-14 mb-24">Pilihan pengiriman yang tersedia di layanan Online Order Anda</div>
            <div v-for="courier in dataCourier" :key="courier.courier_online_id">
              <div class="p-8 like-table-wrapper--item">
                <div class="full-width flex-container">
                  <div class="full-width flex-container" :class="courier.is_active ? '' : 'img-grey'">
                    <el-avatar
                      :src="courier.photo"
                      :size="40"
                      shape="square"
                      class="mr-4"
                    />
                    <span>{{ courier.courier_online_name }}</span>
                  </div>
                  <div class="text-right" style="width: 40%">
                    <el-switch v-model="courier.is_active" @change="handleTnc(courier)" />
                  </div>
                </div>
              </div>
              <template v-if="courier.detail.length && courier.is_active" >
                <div v-for="item in courier.detail" :key="item.courier_online_detail_id" class="flex-container like-table-wrapper--item" :class="item.is_active ? 'bg-f5' : ''">
                  <div class="full-width font-16">
                    {{ item.courier_online_detail_name}}
                  </div>
                  <div>
                    <el-checkbox v-model="item.is_active" @change="handleCourierService(courier, item)" />
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>

      </div>
    </transition>

    <div
      v-if="sidebarDelivery"
      class="offscreen-right-sidebar">
      <div class="offscreen-right-sidebar--wrapper">
        <div class="offscreen-right-sidebar--header text-left">
          <span class="ml-8">Pengiriman</span>
          <close-esc @close="sidebarDelivery = false" />
        </div>
        <div>
          <div v-for="data in dataDelivery" :key="data.id" class="mt-24 mb-24">
            <div class="font-bold <div>font-16 mb-8">{{ data.title }}</div>
            <div>{{ data.value }}</div>
            <div class="mt-16">Partner yang menyediakan layanan ini :</div>
            <div class="flex-container">
              <div v-for="courier in data.courier_available" :key="courier.id">
                <el-avatar
                  :src="courier.value"
                  :size="40"
                  shape="square"
                  class="mr-4"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog 
      :visible.sync="showTnc"
      :show-close="false"
      :before-close="handleCloseTnc"
      append-to-body
      width="720px"
      class="dialog-mdr">
      <div slot="title" class="flex-container">
        <h4 class="dialog-title full-width">
          Syarat Dan Ketentuan
        </h4>
        <div class="btn_save_dialog full-width text-right">
          <el-button type="info" @click="handleCloseTnc">{{ lang.cancel }}</el-button>
          <el-button type="primary" :loading="loadingSaveCourier" @click="handleAcceptTnc" >{{ $lang[langId].agree }}</el-button>
        </div>
      </div>
      <perfect-scrollbar ref="scrollbarterm" class="scrollterm">
        <div class="px-32" v-html="tempTnc.tnc"></div>
      </perfect-scrollbar>
    </el-dialog>


  </el-dialog>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import { updateSetting } from '@/api/onlineorder'
// import { fetch as fetchStore } from '@/api/generalsetting'

import CloseEsc from '@/components/modules/CloseEsc'
// import baseURL from '@/utils/baseURL'

// import { gmapApi } from 'vue2-google-maps'
import axios from 'axios'

export default {
  name: 'DialogDeliverySetting',
  components: {
    CloseEsc
  },

  props: {
    show: {
      type: Boolean,
      default: false
    },
    dataSetting: {
      type: Object,
      default: {}
    }
  },

  mixins: [basicComputedMixin],

  data() {
    return {
      // 
      showUseDefault: false,
      loadingSave: false,

      dataStore: {},
      mapOptions: {
        minZoom: 5,
        maxZoom: 20,
        draggable: true,
        scrollwheel: false,
        mapTypeControl: false,
        zoomControl: true,
        scaleControl: true,
        streetViewControl: false,
        disableDefaultUI: true
      },
      zoom: 15,
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
      showListCourier: false,
      dataCourier: [],
      showTnc: false,
      tempTnc: '',
      loadingSaveCourier: false,
      fullmap: false,
      loadingSaveLocation: false,
      sidebarDelivery: false,
      dataDelivery: [
        {
          id: 0,
          title: 'Instant',
          value: 'Layanan pengiriman instan dengan durasi pengiriman kurang lebih 3 jam sejak serah terima paket ke kurir.',
          courier_available: [
            {
              id: 0,
              value: '/static/img/online-order/courier/gojek.png'
            },
            {
              id: 1,
              value: '/static/img/online-order/courier/grab.png'
            },
            {
              id: 2,
              value: '/static/img/online-order/courier/sicepat.png'
            }
          ]
        },
        {
          id: 1,
          title: 'Same day',
          value: 'Layanan pengiriman dengan durasi pengiriman kurang lebih 6 jam sejak serah terima paket ke kurir dan akan sampai di hari yang sama.',
          courier_available: [
            {
              id: 0,
              value: '/static/img/online-order/courier/gojek.png'
            },
            {
              id: 1,
              value: '/static/img/online-order/courier/grab.png'
            },
            {
              id: 2,
              value: '/static/img/online-order/courier/sicepat.png'
            }
          ]
        },
        {
          id: 2,
          title: 'Next day',
          value: 'Layanan pengiriman express dengan durasi pengiriman 1 hari dihitung sejak serah terima paket ke kurir.',
          courier_available: [
            {
              id: 0,
              value: '/static/img/online-order/courier/sicepat.png'
            },
            {
              id: 1,
              value: '/static/img/online-order/courier/jne.png'
            }
          ]
        },
        {
          id: 3,
          title: 'Reguler',
          value: 'Layanan pengiriman standard dengan kecepatan pengiriman tergantung dari lokasi pengiriman dan lokasi tujuan. Umumnya 2-4 hari/ 5-9 hari/ >9 hari tergantung rute pengiriman.',
          courier_available: [
            {
              id: 0,
              value: '/static/img/online-order/courier/sicepat.png'
            },
            {
              id: 1,
              value: '/static/img/online-order/courier/jne.png'
            }
          ]
        },
        {
          id: 4,
          title: 'Ekonomi',
          value: 'Layanan pengiriman standard dengan kecepatan pengiriman 2-9 hari tergantung rute pengiriman. Harga lebih murah apabila dibandingkan dengan Reguler, tetapi durasi pengiriman mirip dengan Reguler.',
          courier_available: [
            {
              id: 0,
              value: '/static/img/online-order/courier/sicepat.png'
            }
          ]
        }
      ]
     }
  },

  mounted() {
    // this.getBannerDinein()
    this.$nextTick(() => {
      if (this.$refs.storeLocationOnMap) {
        this.$refs.storeLocationOnMap.$mapPromise.then(this.loadControls)
      }
    })
  },

  computed: {
    isCourierActive () {
      let data = []
      this.dataCourier.map(i => {
        if (i.is_active) { data.push(i) }
      })
      if (data.length) {
        return true
      } else { return false }
    }
  },

  methods: {
    setToDefault () {
      this.dataSetting.tnc_store_content = this.dataSetting.tnc_store_default.content
      this.save()
    },

    save() {
      this.loadingSave = true
      let data = {
        tnc_store_content: this.dataSetting.tnc_store_content
      }
      updateSetting(data).then(response => {
        this.$message({
          type: 'success',
          message: 'saved'
        })
        this.loadingSave = false
        this.showUseDefault = false
        this.$emit('close')
      }).catch(error => {
        this.loadingSave = false
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
      // const infowindow = new this.google.maps.InfoWindow()
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
        console.log(response.data.results[0].formatted_address)
        this.dataStore.address = response.data.results[0].formatted_address
        this.$forceUpdate()
      }).catch(e => {
        // this.errors.push(e)
      })
    },

    setDefaultLocation (data) {
      this.dataStore = { 
        address: data.address,
        location_lat: data.location_lat,
        location_lon: data.location_lon
      }
      if (data.location_lat && data.location_lon) {
        this.marker.position = {
          lat: parseFloat(data.location_lat),
          lng: parseFloat(data.location_lon)
        }
      }
      if (this.fullmap) {
        this.$nextTick(() => {
          this.$refs["storeLocationOnMap"].$mapPromise.then(this.loadControls)
        })
      }
    },

    loadControls(map) {
      var controlDiv = document.createElement('div')
      var firstChild = document.createElement('button')
      firstChild.style.backgroundColor = '#fff'
      firstChild.style.border = 'none'
      firstChild.style.outline = 'none'
      firstChild.style.width = '40px'
      firstChild.style.height = '28px'
      firstChild.style.borderRadius = '2px'
      firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)'
      firstChild.style.cursor = 'pointer'
      firstChild.style.marginRight = '10px'
      firstChild.style.padding = '0px'
      firstChild.style.display = this.fullmap ? 'flex' : 'none'
      firstChild.style.justifyContent = 'center'
      firstChild.title = 'Your Location'
      controlDiv.appendChild(firstChild)
      var secondChild = document.createElement('div')
      secondChild.style.margin = '5px'
      secondChild.style.width = '18px'
      secondChild.style.height = '18px'
      secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-1x.png)'
      secondChild.style.backgroundSize = '180px 18px'
      secondChild.style.backgroundPosition = '0px 0px'
      secondChild.style.backgroundRepeat = 'no-repeat'
      secondChild.id = 'you_location_img'
      firstChild.appendChild(secondChild)
      window.google.maps.event.addListener(this.$refs.storeLocationOnMap.$mapObject, 'center_changed', function () {
        secondChild.style['background-position'] = '0 0'
      })
      var ref = this
      firstChild.addEventListener('click', function () {
        console.log('re', ref)
        ref.getGeolocation()
        // navigator.geolocation.getCurrentPosition(position => {
        //   let latlng = new window.google.maps.LatLng(
        //     parseFloat(position.coords.latitude),
        //     parseFloat(position.coords.longitude))
        //   ref.center = {
        //     lat: position.coords.latitude,
        //     lng: position.coords.longitude
        //   }
        //   console.log('llll', latlng)
        //   ref.createMarker(latlng)
        // })
      })
      controlDiv.index = 1
      if (this.$refs.storeLocationOnMap.$mapObject.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].length <= 1) {
        this.$refs.storeLocationOnMap.$mapObject.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv)
      }
    },

    setCourier (data, fromDelivery) {
      if (!fromDelivery) {
        data.courier.map(i => {
          i.is_active = i.is_active === 1? true : false
          if (i.detail.length) {
            i.detail.map(j => {
              j.is_active = j.is_active === 1? true : false
            })
          }
        })
      }

      this.dataCourier = [ ...data.courier]
    },

    editCourier () {
      this.showListCourier = true
      console.log('aa')
    },

    handleTnc (data) {
      if (data.is_active && data.tnc !== null) {
        this.showTnc = true
        this.tempTnc = data
      } else if (data.is_active && data.tnc === null) {
        this.saveSetting(data)
      } else if (!data.is_active) {
        let message = 'Yakin akan menonaktifkan ' + data.courier_online_name
        this.$confirm(message, '', {
          confirmButtonText: this.rootLang.yes,
          cancelButtonText: this.lang.cancel,
          showClose: false,
          type: ''
        }).then(() => {
          this.saveSetting(data)
        }).catch((error) => {
          console.log(error)
          this.dataCourier.map(i => {
            if (i.courier_online_id === data.courier_online_id) {
              i.is_active = true
            }
          })
        })
      }
    },

    handleAcceptTnc () {
      this.saveSetting(this.tempTnc)
    },

    handleCloseTnc () {
      this.dataCourier.map(i => {
        if (i.courier_online_id === this.tempTnc.courier_online_id) {
          i.is_active = false
        }
      })
      this.showTnc = false
      this.tempTnc = {}
    },

    handleCourierService (courier, item) {
      if (item.is_active) {
        let data = {
          courier_online_id: courier.courier_online_id,
          is_active: courier.is_active,
          detail: [ ...courier.detail]
        }
        this.saveSetting(data)
      } else if (!item.is_active) {
        let message = 'Yakin akan menonaktifkan ' + item.courier_online_detail_name
        this.$confirm(message, '', {
          confirmButtonText: this.rootLang.yes,
          cancelButtonText: this.lang.cancel,
          showClose: false,
          type: ''
        }).then(() => {
          let data = {
            courier_online_id: courier.courier_online_id,
            is_active: courier.is_active,
            detail: [ ...courier.detail]
          }
          this.saveSetting(data)
        }).catch((error) => {
          console.log(error)
          this.dataCourier.map(i => {
            if (i.courier_online_id === courier.courier_online_id) {
              i.detail.map(j => {
                if (j.courier_online_detail_id === item.courier_online_detail_id) {
                  j.is_active = true
                }
              })
            }
          })
        })
      }
    },

    async saveSetting (dataCourier) {
      this.loadingSaveCourier = true
      dataCourier.is_active = dataCourier.is_active ? 1 : 0
      let data = {
        courier: [dataCourier]
      }
      await updateSetting(data).then(response => {
        this.$message({
          type: 'success',
          message: 'saved'
        })
        this.setCourier(response.data.data)
        this.loadingSaveCourier = false
        this.showTnc = false
        this.tempTnc = {}
      }).catch(error => {
        this.loadingSaveCourier = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    async saveSettLocation () {
      this.loadingSaveLocation = true
      let data = {
        pick_up_address: this.dataStore.address,
        pick_up_lat: this.dataStore.location_lat,
        pick_up_lon: this.dataStore.location_lon
      }
      await updateSetting(data).then(response => {
        this.$message({
          type: 'success',
          message: 'saved'
        })
        this.loadingSaveLocation = false
        this.fullmap = false
        let dataLoc = {
          address: response.data.data.pick_up_address,
          location_lat: response.data.pick_up_lat,
          location_lon: response.data.pick_up_lon
        }
        this.setDefaultLocation(dataLoc)
      }).catch(error => {
        this.loadingSaveLocation = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    getDataServiceCourier (item) {
      let service = []
      item.detail.map(i => { 
        if(i.is_active) { service.push(i.courier_online_detail_name) }
      })
      return service.join(', ')
    },

    showFullMap () {
      this.fullmap = true
      this.$nextTick(() => {
        this.$refs["storeLocationOnMap"].$mapPromise.then(this.loadControls)
      })
    },

    handleClose () {
      if (!this.fullmap) {
        this.$emit('close')
      } else {
        this.fullmap = false
      }
    }
  }
}
</script>