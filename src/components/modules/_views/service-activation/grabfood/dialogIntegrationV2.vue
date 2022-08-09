<template>
  <el-dialog
    :visible.sync="show"
    :title="rootLang.integration_grabfood"
    :show-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="true"
    :before-close="handleClose"
    append-to-body
    :custom-class="storeHasGrab === 0? 'without-padding mw-1020' : 'without-padding'"
    :width="storeHasGrab === 0? '' : '536px'">
    <div v-loading="loadingSubmit" class="form-wizard">
      <template v-if="storeHasGrab === 0">
        <div class="form-wizard--step">
          <div
            v-loading="loadingDialog"
            v-for="(item, key) in steps"
            :key="item"
            :class="[
              completeSteps.includes(item) ? 'active' : '',
              item === activeStep ? 'current' : ''
            ]"
            class="form-wizard--step--item pointer" @click="handleBack(item, key)">
            <!-- class="form-wizard--step--item pointer" @click="handleBack(item, key)"> -->
            {{ key + 1 }}. {{ item }}
          </div>
        </div>

        <div class="form-wizard--content">
            <form-outlet
            ref="formOutlet"
            v-show="activeStep === 'outlet'" 
            :data-store="dataStore"
            :loading-form="loading"
            :province="stateCity"
            :cities="cities"
            :subdistrict="subdistrict"
            :more-state="moreState"
            :more-city="moreCity"
            :more-subdistrict="moreSubdistrict"
            :store-has-integrated-before="storeHasIntegratedBefore"
            @updateaddress="handleGetAddress"
            @submit="handleSubmit($event, 'jam buka', 1)"
            />

            <form-open-hours 
              ref="formOpenHours"
              v-show="activeStep === 'jam buka'"
              :store-has-integrated-before="storeHasIntegratedBefore"
              @submit="handleSubmit($event, 'dokumen', 2)"/>

            <form-documents
              ref="formDocuments"
              v-show="activeStep === 'dokumen'"
              :store-has-integrated-before="storeHasIntegratedBefore"
              @submit="handleSubmit($event, 'ringkasan', 3)" />

            <form-summary
              v-show="activeStep === 'ringkasan'"
              :form-edit="formEdit"
              :store-has-grab="storeHasGrab"
              @submit="handleSubmit($event)" />
        </div>
      </template>
      <template v-else>
        <div class="form-wizard--step" style="margin-bottom: unset">
          <div
            v-loading="loadingDialog"
            v-for="(item, key) in stepsGrab"
            :key="item"
            :class="[
              completeStepsGrab.includes(item) ? 'active' : '',
              item === activeStepGrab ? 'current' : ''
            ]"
            class="form-wizard--step--item pointer" @click="handleBack(item, key)">
            <!-- class="form-wizard--step--item pointer" @click="handleBack(item, key)"> -->
            {{ key + 1 }}. {{ item === 'merchant'? 'Detail Merchant Grabfood' : item }}
          </div>
        </div>
        <div class="form-wizard--content pt-24" :style="activeStepGrab === 'merchant'? 'height: 642px !important' : 'height: 342px !important'">
          <div v-show="activeStepGrab === 'merchant'" class="px-24 text-center">
            <div class="text-left">
              <span class="font-12">Nama merchant di GrabFood</span>
              <el-input v-model="formGrab.grabName" class="border border--grey-border" :placeholder="rootLang.example + '; Restoku'"></el-input>
            </div>
            <!-- <div class="mt-16">
              <span class="font-12">ID merchant GrabFood</span>
              <el-input v-model="formGrab.grabId" class="border border--grey-border" :placeholder="rootLang.example + '; 1234567890'"></el-input>
            </div> -->
            <div class="mt-24">
              <img src="/static/img/service-activation/grab/screenshot_merchant.png">
            </div>
            <div class="mt-24 border border--grey border--with-shadow radius-2 p-16 flex-container text-left word-break">
              <div class="font-18 full-width">Upload Screenshot Nama Merchant di aplikasi Grab Merchant</div>
              <div class="full-widht">
                <div class="color-grey--bg flex-container justify-center" style="width: 56px; height: 56px">
                  <el-upload
                    v-loading="loadingUpload"
                    :action="uploadPhotoUrl"
                    :headers="headers"
                    :before-upload="beforeUpload"
                    :show-file-list="false"
                    :on-progress="handleUploadProgress"
                    :on-success="handleUploadSuccess"
                    :on-error="handleUploadError"
                    list-type="document-grabfood"
                    >
                    <img
                      v-if="formGrab.documents.thumbnail_merc_acc_app_capture !== ''"
                      :src="formGrab.documents.thumbnail_merc_acc_app_capture" alt=""
                      class="img-document-grabfood"
                    >
                    <i v-else class="el-icon-camera"></i>
                  </el-upload>
                </div>
              </div>
            </div>
            <div class="mb24">
              <el-button
                :disabled="disableNext"
                class="mt-24 btn-block color-grabfood--bg color-white"
                @click="handleClickStepGrab('ringkasan', 1)">
                {{ rootLang.next }} →
              </el-button>
            </div>
          </div>

          <form-summary
            v-show="activeStepGrab === 'ringkasan'"
            :form-grab="formGrab"
            :store-has-grab="storeHasGrab"
            @submit="saveActivation" />
        </div>
      </template>
    </div>
  </el-dialog>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import formOutlet from './pengajuan/form-outlet'
import formOpenHours from './pengajuan/form-open-hours.vue'
import formDocuments from './pengajuan/form-documents'
import formSummary from './pengajuan/form-summary'
import { fetchProvince, fetchCity, fetchDistrict } from '@/api/generalsetting'
import { create } from '@/api/thirdParty/activation'
import { baseApi } from 'src/http-common.js'
// import setupCategory from './setupCategory'
// import setupItem from './setupItem'
// import setupOpenHours from './setupOpenHours'
// import { createItemSetupMenu as create, getGrabPeriodStore } from '@/api/thirdParty/grabfood'
// import moment from 'moment'
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    dataStore: {
      type: Object,
      default: {}
    },
    storeHasGrab: {
      type: Number,
      default: 0
    },
    storeHasIntegratedBefore: {
      type: Number,
      default: 0
    },
    dataActivation: {
      type: Object,
      default: {}
    }
  },

  components: {
    formOutlet,
    formOpenHours,
    formDocuments,
    formSummary
  },

  mixins: [basicComputedMixin],

  data() {
    return {
      loadingSubmit: false,
      activeStep: 'outlet',
      steps: ['outlet', 'jam buka', 'dokumen', 'ringkasan'],
      completeSteps: ['outlet'],
      // for has grab or not
      activeStepGrab: 'merchant',
      stepsGrab: ['merchant', 'ringkasan'],
      completeStepsGrab: ['merchant'],
      // formData: {
      //   store_grabfood_id: this.grabfoodData.id,
      //   checkedDays: []
      // },
      // dataPeriods: [],
      loadingDialog: false,
      updateopenhours: false,
      formEdit: {
        thirdparty_service_item_id: 9,
        owner_name: '',
        is_existing_grab: this.storeHasGrab,
        documents: {},
        periods: []
      },
      cities: [],
      stateCity: [],
      subdistrict: [],
      moreState: '',
      moreCity: '',
      moreSubdistrict: '',
      loading: false,
      formGrab: {
        thirdparty_service_item_id: 9,
        is_existing_grab: this.storeHasGrab,
        grabId: null,
        grabName: '',
        documents: {
          thumbnail_merc_acc_app_capture: ''
        }
      },
      loadingUpload: false,
      passFormOpenhours: 0
    }
  },

  computed: {
    uploadPhotoUrl() {
      return baseApi(this.selectedStore.url_id, this.langId, 'activation/service/upload')
    },
    headers() {
      return {
        'Authorization': 'Bearer ' + this.token.access_token
      }
    },

    disableNext () {
      if (this.formGrab.grabName && this.formGrab.documents.thumbnail_merc_acc_app_capture) {
        return false
      } else {
        return true
      }
    }
  },

  watch: {
    dataStore (dataStore) {
      // this.formEdit = { ...dataStore}
    }
    // setupData: {
    //   deep: true,
    //   immediate: true,
    //   handler(setupData) {
    //     this.formData.store_grabfood_id = this.grabfoodData.id
    //   }
    // },
  },

  methods: {
    checkAddressDetail(data) {
      console.log('c', data)
      this.getProvince(data.country_id)
      this.getCity(data.state_id)
      this.getSubdistrict(data.city_id)
      // if (data.storeHasIntegratedBefore === 1) {
      //   // console.log('aaa', this.dataStore)
      //   this.dataStore.address = data.address
      //   this.dataStore.rt = data.rt
      //   this.dataStore.rw = data.rw
      //   this.dataStore.postal_code = data.postal_code
      //   this.dataStore.village = data.village
      //   this.dataStore.email = data.email
      //   this.dataStore.phone_1 = data.owner_phone_number
      // }
    },

    async getProvince(val) {
      this.loading = true
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
      await fetchProvince(params).then(response => {
        this.stateCity = response.data.data
        this.moreState = response.data.links.next

        // if (this.storeHasIntegratedBefore === 1) {
        //   this.stateCity.map(i => { if (i.id === this.dataActivation.state_id) {this.dataStore.state_name = i.name; this.dataStore.state_id = this.dataActivation.state_id }})
        // } else {
          this.stateCity.map(i => { if (i.id === this.dataStore.state_id) {this.dataStore.state_name = i.name }})
        // }
        // if (val !== 0) {
        //   this.formEdit.state_id = ''
        //   this.formEdit.state_name = ''
        //   this.formEdit.city_id = ''
        //   this.formEdit.city_name = ''
        //   this.formEdit.subdistrict_id = ''
        //   this.formEdit.postal_code = ''
        // }
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

    async getCity(val) {
      this.loading = true
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
      await fetchCity(params).then(response => {
        this.cities = response.data.data
        this.moreCity = response.data.links.next
        this.loading = false

        // if (this.storeHasIntegratedBefore === 1) {
        //   this.cities.map(i => { if (i.id === this.dataActivation.city_id) {this.dataStore.city_name = i.city; this.dataStore.city_id = this.dataActivation.city_id }})
        // } else {
          this.cities.map(i => { if (i.id === this.dataStore.city_id) {this.dataStore.city_name = i.city }})
        // }
        // if (val !== 0 && this.isEdit) {
        //   this.formEdit.city_id = ''
        //   this.formEdit.city_name = ''
        //   this.formEdit.subdistrict_id = ''
        //   this.formEdit.postal_code = ''
        // }
      }).catch(error => {
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    async getSubdistrict(val) {
      this.loading = true
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
      await fetchDistrict(params).then(response => {
        this.subdistrict = response.data.data
        this.moreSubdistrict = response.data.links.next

        // if (this.storeHasIntegratedBefore === 1) {
        //   this.subdistrict.map(i => { if (i.id === this.dataActivation.subdistrict_id) {this.dataStore.subdistrict_name = i.name; this.dataStore.subdistrict_id = this.dataActivation.subdistrict_id }})
        // } else {
          this.subdistrict.map(i => { if (i.id === this.dataStore.subdistrict_id) {this.dataStore.subdistrict_name = i.name }})
        // }
        // if (val !== 0 && this.isEdit) {
        //   this.formEdit.subdistrict_id = ''
        //   this.formEdit.postal_code = ''
        // }
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

    handleGetAddress (data) {
      console.log('args', data)
      if (data.args === 'state') {
        this.cities = []
        this.getCity(data.id)
      }
      if (data.args === 'city') {
        this.subdistrict = []
        this.getSubdistrict(data.id)
      }
      if (data.args === 'subdistrict') {
        this.subdistrict.map(i => { if (i.id === data.id) {this.dataStore.subdistrict_name = i.name }})
      }
    },
    // submit() {
    //   this.$emit('submit')
    // },

    handleClickStep(item, key, shortcut = false) {
      // if (shortcut && this.activeStep === 'section') {
      //   return
      // }
      // this.completeSteps = []
      this.activeStep = item
      this.steps.map((stepItem, stepKey) => {
        if (stepKey <= key) {
          this.completeSteps.push(stepItem)
        }
      })
      console.log(this.activeStep)
    },

    handleClickStepGrab(item, key) {
      this.activeStepGrab = item
      this.stepsGrab.map((stepItem, stepKey) => {
        if (stepKey <= key) {
          this.completeStepsGrab.push(stepItem)
        }
      })
    },

    handleSubmit(data, item, key) {
      // console.log('data', data)
      // if (item !== 'section' && key !== 1) {
      //   this.formData = { ...this.formData, ...data }
      // }
      if (item === 'jam buka') {
        this.formEdit = { ...this.formEdit, ...data}
        if (this.storeHasIntegratedBefore === 1 && this.passFormOpenhours === 0) { this.setPeriodsBefore() }
        this.passFormOpenhours += 1
      } else if (item === 'dokumen') {
        this.formEdit.periods = [ ...data]
        if (this.storeHasIntegratedBefore === 1) {
          this.$refs.formDocuments.setDataPhoto(this.dataActivation)
        }
      } else if (item === 'ringkasan') {
        this.formEdit.documents = { ...data}
      }
      if (item && key) {
        this.handleClickStep(item, key)
        // if (item !== 'ringkasan' && key !== '3') { this.handleClickStep(item, key) }
        // else { this.saveActivation() }
      } else {
        this.saveActivation()
      }
    },

    // cancel () {
    //   console.log(this.show)
    // },

    async saveActivation() {
      this.loadingSubmit = true
      // console.log(submitData)

      let data = this.storeHasGrab === 0? { ...this.formEdit} : { ...this.formGrab}

      data.is_existing_grab = this.storeHasGrab
      data.store_id = this.selectedStore.store_id
      data.owner_name = this.selectedStore.owner.name
      if (this.storeHasGrab === 1) {
        data.store_name = this.selectedStore.name
      }

      if (this.storeHasGrab === 0 && this.storeHasIntegratedBefore === 0) {
        let per = []
        data.periods.map(i => {
          if (i.type === 1) { per.push(i) }
        })

        data.periods = [ ...per]
      }

      if (this.storeHasIntegratedBefore === 1) {
        data.activation_id = this.dataActivation.activation_id
      }
      await create(data).then(response => {
        this.loadingSubmit = false
        this.$emit('submit')
        // this.$message({
        //   type: 'success',
        //   message: 'Saved'
        // })
        // this.$router.push({
        //   path: '/service-activation-v2/grabfood/manage'
        // })
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loadingSubmit = false
      })
    },

    handleBack (item, key) {
      let keyActive = ''
      if (this.storeHasGrab === 0) {
        this.steps.map((i, idx) => { if (i === this.activeStep ) { keyActive = idx } })
        console.log('ke', keyActive)
        if (keyActive > key) {
          this.completeSteps = []
          this.handleClickStep(item, key)
        }
      } else {
        this.stepsGrab.map((i, idx) => { if (i === this.activeStepGrab ) { keyActive = idx } })
        if (keyActive > key) {
          this.completeStepsGrab = []
          this.handleClickStepGrab(item, key)
        }
      }
        // this.updateopenhours = true
      // }
    },

    handleClose () {
      this.passFormOpenhours = 0
      if (this.storeHasGrab === 0) {
        this.activeStep = 'outlet'
        this.completeSteps = ['outlet'],
        this.formEdit = {
          thirdparty_service_item_id: 9,
          owner_name: 'devtest',
          is_existing_grab: this.storeHasGrab,
          documents: {},
          periods: []
        }
        this.$refs.formOpenHours.refreshData()
        this.$refs.formDocuments.refreshData()
      } else {
        this.activeStepGrab = 'merchant'
        this.completeStepsGrab = ['merchant']
        this.formGrab = {
          grabId: null,
          grabName: '',
          documents: {
            thumbnail_merc_acc_app_capture: ''
          }
        }
      }
      this.$emit('cancel')
    },

    beforeUpload(file) {
      const isJpg = file.type === 'image/jpeg'
      const isPng = file.type === 'image/png'
      if (!isJpg && !isPng) {
        this.$message.error(this.$lang[this.langId].error_upload_photo)
      }
      return isJpg || isPng
    },

    handleUploadProgress (args) {
      this.loadingUpload = true
    },

    handleUploadSuccess(response, file, fileList) {
      console.log('res', response)
      this.formGrab.documents.thumbnail_merc_acc_app_capture = response[0].photo_md
      this.loadingUpload = false
    },

    handleUploadError(err) {
      this.loadingUpload = false
      this.$notify({
        type: 'warning',
        message: this.rootLang.file_too_large,
        title: 'Error'
      })
    },

    setFormGrab (data) {
      this.formGrab = {
        thirdparty_service_item_id: 9,
        is_existing_grab: this.storeHasGrab,
        grabId: null,
        grabName: '',
        activation_id: data.activation_id,
        documents: {
          thumbnail_merc_acc_app_capture: data.thumbnail_merc_acc_app_capture
        }
      }
    },

    setPeriodsBefore () {
      this.$refs.formOpenHours.setPeriodsFromBefore(this.dataActivation.periods)
    }
  }
}
</script>
