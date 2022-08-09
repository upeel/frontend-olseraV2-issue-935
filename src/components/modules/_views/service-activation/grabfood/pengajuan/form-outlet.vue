<template>
  <div>
    <div v-loading="loadingForm" class="color-white--bg flex-container flex-container--start full-width">
      <div class="full-width" >
        <div class="color-grabfood--bg full-width" >
          <div class="flex-container justify-center">
            <div class="photo-avatar-edit p-40 text-center">
              <el-image
                :src="dataStore.logo_xs"
                class="img-circle border border-white color-white--bg"
                fit="cover"
                style="width: 100px; height: 100px;"
              />
              <div class="mt-16 color-white">
                <div class="font-24 font-bold">{{ dataStore.name }}</div>
              </div>
            </div>
          </div>
          <div class="color-white--bg color-black p-24">
            <div class="font-20">Kontak Outlet</div>
            <div class="mt-16">
              <span class="font-12">{{ lang.email }}</span>
              <el-input v-model="dataStore.email"></el-input>
            </div>
            <div class="mt-16">
              <div class="font-12" style="margin-bottom: -10px">Nomor HP Outlet</div>
              <phone-number-input
                  v-model="dataStore.phone_1"
                  :translations="{
                    countrySelectorLabel: '',
                    countrySelectorError: '',
                    phoneNumberLabel: '',
                    example: ''
                  }"
                  :only-countries="['ID', 'SG']"
                  class="field-register"
                  default-country-code="ID"
                  @update="getPhone"
                />
            </div>
          </div>
        </div>
      </div>
      <div class="full-width p-24">
        <div class="font-20">Alamat Outlet</div>
        <div class="mt-16">
          <span class="font-12">{{ lang.address }}</span>
          <el-input type="textarea" v-model="dataStore.address"></el-input>
        </div>

        <div class="flex-container mt-16">
          <div class="full-width pr-8">
            <div class="font-12">{{ lang.province }}</div>
            <el-select
              v-model="dataStore.state_id"
              filterable
              @change="handleSelected('state', dataStore.state_id)">
              <el-option
                v-for="(item) in province"
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
          </div>

          <div class="full-width pl-8">
            <div class="font-12">{{ lang.city }}</div>
            <el-select
              v-model="dataStore.city_id"
              filterable
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
          </div>
        </div>

        <div class="flex-container mt-16">
          <div class="full-width pr-8">
            <div class="font-12">{{ lang.subdistrict }}</div>
            <el-select
              v-model="dataStore.subdistrict_id"
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
          </div>

          <div class="full-width pl-8">
            <span class="font-12">Kelurahan</span>
            <el-input v-model="dataStore.village"></el-input>
          </div>
        </div>

        <div class="mt-16">
          <span class="font-12">{{ lang.postal_code }}</span>
          <el-input v-model="dataStore.postal_code"></el-input>
        </div>

        <div class="mt-16 flex-container">
          <div class="full-width mr-8">
            <span class="font-12">RT</span>
            <el-input v-if="storeHasIntegratedBefore === 0" v-model="dataStore.rt"></el-input>
            <el-input v-if="storeHasIntegratedBefore === 1" v-model="dataForm.rt"></el-input>
          </div>
          <div class="full-width ml-8">
            <span class="font-12">RW</span>
            <el-input v-if="storeHasIntegratedBefore === 0" v-model="dataStore.rw"></el-input>
            <el-input v-if="storeHasIntegratedBefore === 1" v-model="dataForm.rw"></el-input>
          </div>
        </div>
      </div>
    </div>
    <div class="px-24">
      <el-button
        :disabled="disableNext"
        class="mt-24 btn-block color-grabfood--bg color-white"
        @click="submit">
        {{ rootLang.next }} →
      </el-button>
    </div>
  </div>
</template>
<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
export default {
  name: 'FormOutlet',

  mixins: [basicComputedMixin],
  props: {
    dataStore: {
      type: Object,
      default: {}
    },
    loadingForm: {
      type: Boolean,
      default: false
    },
    province: {
      type: Array,
      default: []
    },
    cities: {
      type: Array,
      default: []
    },
    subdistrict: {
      type: Array,
      default: []
    },
    moreState: {
      type: String,
      default: ''
    },
    moreCity: {
      type: String,
      default: ''
    },
    moreSubdistrict: {
      type: String,
      default: ''
    },
    storeHasIntegratedBefore: {
      type: Number,
      default: 0
    },
  },

  watch: {
    // dataStore (dataStore) {
    //   this.formEdit = { ...dataStore}
    // }
  },

  computed: {
    disableNext () {
      if (this.dataStore.state_id && this.dataStore.city_id && 
      this.dataStore.subdistrict_id && this.dataStore.email && 
      this.dataStore.phone_1 && this.dataStore.village && 
      this.dataStore.rt && this.dataStore.rw) {
        return false
      } else {
        return true
      }
    }
  },

  data () {
    return {
      stateCity: {},
      formEdit: {},
      dataphone: this.dataStore.phone_1,
      dataForm: {
        rt: this.dataStore.rt,
        rw: this.dataStore.rw
      }
    }
  },

  methods: {
    handleSelected(block, id) {
      let data = {
        args: block,
        id: id
      }
      if (block === 'state') {
        this.province.map(i => { if (i.id === this.dataStore.state_id) {this.dataStore.state_name = i.name }})
        this.dataStore.city_id = ''
        this.dataStore.subdistrict_id = ''
        this.dataStore.city_name = ''
        this.dataStore.subdistrict_name = ''
      }
      if (block === 'city') { 
        this.cities.map(i => { if (i.id === this.dataStore.city_id) {this.dataStore.city_name = i.city }})
        this.dataStore.subdistrict_id = ''
        this.dataStore.subdistrict_name = ''
      }
      if (block === 'subdistrict') {
        this.subdistrict.map(i => { if (i.id === this.dataStore.subdistrice_id) {this.dataStore.subdistrict_name = i.name }})
      }
      this.$emit('updateaddress', data)
    },

    getPhone (value) {
      this.dataStore.phone_1 = value.formattedNumber
    },

    submit () {
      let data = {
        store_id: this.selectedStore.store_id,
        store_name: this.selectedStore.name,
        email: this.dataStore.email,
        owner_phone_number: this.dataStore.phone_1,
        owner_rt_number: this.storeHasIntegratedBefore === 1? this.dataForm.rt : this.dataStore.rt,
        owner_rw_number: this.storeHasIntegratedBefore === 1? this.dataForm.rw : this.dataStore.rw,
        village: this.dataStore.village,
        address: this.dataStore.address,
        state_name: this.dataStore.state_name,
        city_name: this.dataStore.city_name,
        subdistrict_name: this.dataStore.subdistrict_name,
        city_id: this.dataStore.city_id,
        postal_code: this.dataStore.postal_code,
        province_id: this.dataStore.state_id,
        subdistrict_id: this.dataStore.subdistrict_id
      }
      this.$emit('submit', data)
    },
  }
}
</script>