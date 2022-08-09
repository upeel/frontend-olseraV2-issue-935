<template>
  <div class="bg-white p-16 radius-10">
    <el-form ref="form" :model="form" class="label-form-register" label-position="top" :rules="loginRules" auto-complete="on">
      <el-form-item label="Nama Toko" prop="name_toko">
        <el-input v-model="form.name_toko" />
      </el-form-item>

      <el-form-item label="Url toko" prop="url_id" style="margin-bottom: 24px">
        <!-- <div class="">
          <svg-icon icon-class="information-circle" />
        </div> -->
        <el-input v-model="form.url_id" id="input_url" @focus="handleSetDefaultUrl">
          <div slot="suffix" style="margin-top: 6px;">.myolsera.com</div>
        </el-input>
      </el-form-item>

      <div v-if="dataUrlSuggestion.length" class="mt-8 mb-8 flex-container flex-container--start color-info--bg radius-5" id="url_suggestion">
        <div class="p-8">Tersedia: </div>
        <div class="flex-container full-width"  style="flex-wrap: wrap;">
          <div v-for="(item, idx) in dataUrlSuggestion" :key="idx" class="color-primary pointer p-8" @click="pickUrl(item)">
            {{ item }}
          </div>
        </div>
      </div>

      <el-form-item label="Tipe Bisnis" prop="business_type_id">
        <el-select
          v-model="form.business_type_id"
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
      </el-form-item>

      <el-form-item
        v-if="!hideAddress"
        label="Alamat"
        prop="address">
        <el-input v-model="form.address" type="textarea">
          <span slot="suffix">
            <i class="el-icon-edit"></i>
          </span>
        </el-input>
      </el-form-item>

      <el-form-item
        v-if="hideAddress"
        label="Negara"
        prop="country_id">
        <el-select
          style="width: 100%"
          v-model="form.country_id"
          :remote-method="getCountries"
          :loading="searchingItems"
          filterable
          remote
          reserve-keyword>
          <el-option
            v-for="item in countries"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="hideAddress"
        label="Provinsi"
        prop="state_id">
        <el-select
          style="width: 100%"
          v-model="form.state_id"
          :remote-method="getStates"
          :loading="searchingItems"
          filterable
          remote
          reserve-keyword
          @change="handleSelectProvince">
          <el-option
            v-for="item in states"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="hideAddress"
        label="Kota"
        prop="city_id">
        <el-select
          style="width: 100%"
          v-model="form.city_id"
          filterable
          reserve-keyword>
          <el-option
            v-for="item in cities"
            :key="item.id"
            :label="item.city"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <div class="mb-8">
        <div class="mb-16">
          Pilih paket sesuai kebutuhanmu
        </div>
        <el-radio-group
          v-model="feature.plan_type_id"
          class="full-width overflow-visible">
          <el-radio
            v-for="type in planTypeOptions"
            :key="type.id"
            :label="type.id"
            class="radio-custom full-width right">
            <div
              v-if="type.id === 'P'"
              class="ribbon-container">
              <div class="ribbon">
                <span>Best Choice</span>
              </div>
            </div>
            <div class="flex-container flex-container--start">
              <div class="mr-4" style="flex-shrink: 0;">
                <img
                  :src="'/static/img/store-types/icon-plan-' + type.id + '.png'"
                  width="40">
              </div>
              <div>
                <div
                  :style="{ color: type.color }"
                  class="font-18 font-bold">
                  {{ type.name }}
                </div>
                <div class="font-12" v-html="type.desc" />
                <el-tag
                  v-if="type.with_trial"
                  size="mini"
                  type="success"
                  class="mt-4">
                  Coba Gratis {{ type.with_trial }} hari
                </el-tag>
                <el-tag
                  v-else
                  size="mini"
                  type="info"
                  class="mt-4">
                  Gratis selamanya
                </el-tag>
              </div>
            </div>
          </el-radio>
        </el-radio-group>
      </div>

      <div class="mb-8 pointer font-16" @click="visibleDialogTableFeatures = true">
        Bingung menentukan pilihan? Pelajari lebih lanjut <span class="color-blue-dark font-bold">di sini</span>.
      </div>

      <el-form-item>
        <el-button
          :loading="loading"
          :disabled="disableButton"
          size="default"
          type="success"
          class="btn-block"
          @click="dialogAddFeature = true">
          {{ rootLang.next_step }} <i class="el-icon-right" />
        </el-button>

        <el-button
          v-if="withBack"
          type="info"
          class="btn-block"
          @click="handleBack">
          {{ rootLang.cancel }}
        </el-button>
      </el-form-item>
    </el-form>

    <el-dialog 
      :visible.sync="dialogAddFeature"
      title="Butuh tambahan lain?">
      <div class="flex-container p-8 border border--input">
        <div>
          <svg-icon icon-class="online-order" style="font-size: 28px" />
        </div>
        <div class="p-8" style="flex-grow: 1;">
          <div class="font-bold">Online Order</div>
          <span class="word-break">Terima pesanan dari pelanggan secara online dan terhubung ke Point of Sale</span>
        </div>
        <div class="text-right" style="width: 120px;">
          <strong>{{ rootLang.yes }}</strong>
          <el-switch
            v-model="feature.online_order"
            disabled
            :active-value="1"
            :inactive-value="0">
          </el-switch>
        </div>
      </div>

      <div class="flex-container p-8 mt-24 border border--input">
        <div class="font-bold" style="flex-grow: 1;">
          Toko Online <span style="color: #6EBE46">Gratis 14 hari</span>
        </div>

        <div v-if="feature.plan_type_id === 'F' || feature.plan_type_id === 'P'" class="text-right" style="width: 120px">
          <strong v-if="feature.online_store === 1">{{ rootLang.yes }}</strong>
          <strong v-else>{{ rootLang.no }}</strong>
          <el-switch
            v-model="feature.online_store"
            :active-value="1"
            :inactive-value="0">
          </el-switch>
        </div>
        <div v-else>
          <span class="freemium-labeled-btn">
              Premium
            </span>
        </div>
      </div>

      <div style="color: #767676; font-size: 11px">
        Jualan online di website Anda sendiri. Terintegrasi dengan kurir pengiriman
      </div>
      
      <div class="flex-container p-8 mt-24 border border--input">
        <div style="flex-grow: 1;">
          <div class="font-bold">Restoran & Café?</div>
        </div>
        <div v-if="feature.plan_type_id === 'F' || feature.plan_type_id === 'P'" class="text-right" style="width: 120px;">
          <strong v-if="form.pos_resto_mode === 1">{{ rootLang.yes }}</strong>
          <strong v-else>{{ rootLang.no }}</strong>
          <el-switch
            v-model="form.pos_resto_mode"
            :active-value="1"
            :inactive-value="0">
          </el-switch>
        </div>
        <div v-else>
          <span class="freemium-labeled-btn">
              Premium
            </span>
        </div>
      </div>
      <div style="color: #767676; font-size: 11px">
        Fitur penomoran meja, waiter mode, distribusi cetak order ke dapur, display dapur
      </div>

      <el-button
        :loading="btnLoading"
        type="success"
        class="btn-block mt-24"
        @click="register">
        Oke, toko sudah siap ✓
      </el-button>
    </el-dialog>

    <el-dialog
      :visible.sync="visibleDialogTableFeatures"
      append-to-body
      fullscreen>
      <table-features/>
    </el-dialog>
  </div>
</template>

<script>
import { gmapApi } from 'vue2-google-maps'
import axios from 'axios'
import { getCountries, getStates, getCities, urlcheck, getCitiesByIdProv } from '@/api/auth'
import TableFeatures from '@/components/modules/extendStore/TableFeatures.vue'

import basicComputedMixin from '@/mixins/basicComputedMixin'

export default {
  props: {
    form: {
      type: Object
    },
    businessTypes: {
      type: Array
    },
    loading: {
      type: Boolean,
      default: false
    },
    withBack: {
      type: Boolean,
      default: true
    },
    btnLoading: {
      type: Boolean,
      default: false
    }
  },

  components: {
    TableFeatures
  },

  mixins: [basicComputedMixin],

  data() {
    const validateURLId = (rule, value, callback) => {
      var params = {
        url_id: value
      }
      urlcheck(params).then(response => {
        if (response) {
          // if (this.stageLevel === 'dash' || this.stageLevel === 'prod') {
          //   callback(new Error(this.rootLang.url_validation))
          // } else {
            this.isUrlInvalid = false
            this.dataUrlSuggestion = []
            callback()
          // }
        }
      }).catch((error) => {
        // if (this.stageLevel === 'dash' || this.stageLevel === 'prod') {
        //   callback()
        // } else {
          this.isUrlInvalid = true
          this.dataUrlSuggestion = error.response.data.error.url_suggestion
          callback(new Error(this.rootLang.url_validation))
        // }
      })
    }
    return {
      countries: [],
      states: [],
      cities: [],
      searchingItems: false,
      loginRules: {
        url_id: [{ required: true, trigger: 'blur', validator: validateURLId }],
        country_id: [{ required: true, message: 'this.rootLang.input_country', trigger: 'blur' }],
        state_id: [{ required: true, message: 'this.rootLang.input_state', trigger: 'blur' }],
        city_id: [{ required: true, message: 'this.rootLang.input_city', trigger: 'blur' }]
      },
      url_store_check: false,
      dialogAddFeature: false,
      feature: {
        online_order: 1,
        online_store: 1,
        resto_mode: 1,
        plan_type_id: 'P'
      },
      visibleDialogTableFeatures: false,
      isUrlInvalid: false,
      dataUrlSuggestion: [],
      countFocus: 0
    }
  },

  computed: {
    google: gmapApi,
    hideAddress() {
      if (!this.form.address) {
        return true
      } else {
        return false
      }
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    rootLang() {
      return this.$lang[this.langId]
    },
    disableButton() {
      if (
        this.form.url_id &&
        this.form.country_id &&
        this.form.state_id &&
        this.form.city_id
      ) {
        return false
      } else {
        return true
      }
    },
    planTypeOptions() {
      const options = []
      require('/static/data/package-types.json').map(type => {
        if (type.id !== 'L') {
          options.push(type)
        }
      })
      return options.reverse()
    }
  },

  mounted() {
    this.getCities()
    this.getCountriesID()
    this.getStates()
    navigator.geolocation.getCurrentPosition((position) => {
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      axios.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+ pos.lat +','+ pos.lng +'&key=AIzaSyDO2a5nAoNu_6NtODgDRfCYZPTGZSjyPeI').then(response => {
        if (response.data.results.length) {
          this.$emit('address-found', response.data)
        } else {
          return
        }
      })
    })
  },

  methods: {
    getCountries(query) {
      if (query) {
        this.searchingItems = true
        getCountries(query).then(response => {
          this.countries = response.data.data
          this.searchingItems = false
        }).catch(() => {
          this.countries = []
          this.searchingItems = false
        })
      }
    },
    getCountriesID() {
      getCountries('indonesia').then(response => {
        this.countries = response.data.data
      }).catch(() => {
        this.countries = []
      })
    },
    getStates(query) {
      this.searchingItems = true
      getStates(query).then(response => {
        this.states = response.data.data
        this.searchingItems = false
      }).catch(() => {
        this.states = []
        this.searchingItems = false
      })
    },
    getCities(query) {
      if (query) {
        this.searchingItems = true
        getCities(query).then(response => {
          this.cities = response.data.data
          this.searchingItems = false
        }).catch(() => {
          this.cities = []
          this.searchingItems = false
        })
      }
    },
    checkUrl(query) {
      var params = {
        url_id: query
      }
      // this.url_store_check = false
      urlcheck(params).then(response => {
        if (response) {
          this.url_store_check = false
        }
      }).catch(() => {
        this.url_store_check = true
      })
    },
    handleBack() {
      this.$emit('back')
    },
    register() {
      // handle lite or premium option before register
      if (this.feature.plan_type_id !== 'F' && this.feature.plan_type_id !== 'P') {
        this.form.pos_resto_mode = 0
        this.feature.online_store = 0
      }
      this.$emit('register', this.feature)
    },
    handleSelectProvince () {
      this.searchingItems = true
      getCitiesByIdProv(this.form.state_id).then(response => {
        this.cities = response.data.data
        this.searchingItems = false
      }).catch(() => {
        this.cities = []
        this.searchingItems = false
      })
    },

    pickUrl (item) {
      this.form.url_id = item
      document.getElementById('input_url').focus()
      document.getElementById('url_suggestion').focus()
    },

    handleSetDefaultUrl () {
      if (this.form.name_toko.length > 3) {
        this.countFocus ++
        if (this.countFocus <= 1) {
          this.form.url_id = this.form.name_toko.replace(/\s/g, '')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .ribbon-container {
    position: relative;
  }
  .ribbon {
    position: absolute;
    top: -25px;
    right: -25px;
    overflow: visible;
    font-size: 12px;
    line-height: 1;
    font-weight: bold;
  }
  .ribbon span {
    background: #F44336;
    color: #FFF;
    display: block;
    position: relative;
    overflow: visible;
    text-decoration: none;
    padding: 4px 8px;
    border-radius: 0px 4px 4px 4px;
    &:after {
      content: "";
      height: 0;
      width: 0;
      display: block;
      position: absolute;
      left: -10px;
      top: 0;
      border-right: 10px solid #C81609;
      border-top: 10px solid transparent;
    }
  }
</style>
