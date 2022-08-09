<template>
  <div class="shippings">
    <div class="flex-container p-8">
      <div class="font-20 font-bold mb-24 full-width">
        {{ rootLang.attendance_devices }} [{{ dataDevices.length }}]
      </div>
      <el-button
        type="success"
        class="mb-4"
        @click="handleAdd">
        <i class="el-icon-plus" /> Tambah
      </el-button>
    </div>
    <!-- <div class="table-handler-flex mb-16 test">
      <div class="mr-8" style="flex-grow: 1;">
        <el-input
          v-model="params.search_text"
          prefix-icon="el-icon-search"
          placeholder="cari"
          class="mb-4 input-search"
          @input="handleSearch"
        />
      </div>
    </div> -->

    <el-card
      v-if="dataDevices.length === 0 && !loading"
      class="card_close_date box-card">
      <div class="no-data-wrapper">
        <img src="/static/img/attendance/no-data-devices.png" class="no-data-image">
        <div class="no_close flex-container full-width justify-center">
          <div style="width: 312px">Saat ini semua perangkat dapat mengakses Absensi. Tambah perangkat di sini untuk membatasi akses Absensi ke perangkat terdaftar</div>
        </div>
      </div>
    </el-card>

    <div class="flex-container border border--grey p-16">
      <div class="font-bold" style="width: 80%">Nama</div>
      <div class="font-bold full-width">No. Seri</div>
    </div>
    <div
      v-loading="loading"
      v-if="dataDevices.length || loading"
      class="like-table-wrapper">
      <div
        v-for="(item, key) in dataDevices"
        :key="key"
        class="like-table-wrapper--item">
        <div style="width: 80%">
          <div class="flex-container">
            <div class="mr-8 lh-1">
              <svg-icon icon-class="icon-device-attendance" class="font-20" />
            </div>
            <div class="lh-1">
              <div class="font-bold font-14">{{ item.name }}</div>
            </div>
          </div>
        </div>
        <div class="full-width" style="margin-left: 24px">
          {{ item.serial }}
        </div>
        <el-button type="text" icon="el-icon-edit" circle @click="editDevices(item)" />
      </div>
      <!-- <div style="text-align: center;">
        <el-pagination
          :current-page.sync="pagination.current_page"
          :page-size="pagination.per_page"
          :total="pagination.total"
          layout="prev, pager, next"
          @current-change="changeCurrentPage">
        </el-pagination>
      </div> -->
    </div>

    <el-dialog
      :visible.sync="dialogEdit"
      :show-close="false"
      custom-class="dialog-card"
      width="536px">
      <div slot="title" class="flex-container">
        <h4 class="dialog-title full-width">
          {{ computedDialogTitle }}
        </h4>
        <div class="btn_save_dialog full-width text-right">
          <el-button type="info" @click="handleCancelAdd">{{ lang.cancel }}</el-button>
          <el-button :loading="loadingSave" type="success" @click="handleSave" >{{ lang.save }}</el-button>
        </div>
      </div>
      <div class="text-center">
        <div class="flex-container flex-container--center">
          <img src="/static/img/attendance/image-serial-device.png" style="width: 132px; height: 132px">
          <div class="full-width px-16">
            <div class="font-12 text-left">{{ rootLang.device_name }}</div>

            <el-input v-model="tempDevice.name"></el-input>

            <div class="font-12 text-left mt-32">No. Seri</div>
            <el-input v-model="tempDevice.serial"></el-input>
          </div>
        </div>
        
        <div class="color-info--bg color-info p-16 flex-container mt-24">
          <div class="container-icon">
            <svg-icon icon-class="information-circle" />
          </div>
          <div>
              Nomor seri perangkat berada di bawah layar masuk aplikasi Absensi Olsera
          </div>
        </div>
      </div>

      <el-button
        v-if="tempDevice.id"
        class="mt-24 full-width"
        style="color: #F44336"
        @click="dialogDelete = true">
        <svg-icon icon-class="trash"></svg-icon>
        {{ $lang[langId].delete }}
      </el-button>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogDelete"
      :show-close="false"
      custom-class="dialog-card"
      width="536px">
      <div class="text-center">
        <span>{{ $lang[langId].are_you_sure }}</span>
        <el-button class="full-width btn-danger mt-24" @click="deleteRow">{{ $lang[langId].delete }}</el-button>
        <el-button class="full-width btn-info mt-8" @click="dialogDelete = false">{{ lang.cancel }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import { debounce } from 'vue-debounce'

import { getAttendanceDevices, getSinggleAttendanceDevices, addDevice, updateDevice, deleteDevice } from '@/api/attendance'

import basicComputedMixin from '@/mixins/basicComputedMixin'
import offscreenAdvanceShift from './offscreenAdvanceShift.vue'

export default {
  components: { offscreenAdvanceShift },
  name: 'AttendanceDevices',

  mixins: [basicComputedMixin],

  data() {
    return {
      dialogEdit: false,
      loading: false,
      dataDevices: [],
      tempDevice: {
        name: '',
        department: '',
        pin: this.randomString(6),
        file_name: '',
        use_advance_shift: 0
      },
      params: {
        search_column: 'name',
        search_text: '',
        page: 1,
        per_page: 15,
      },
      dialogDelete: false,
      uploading: false,
      loadingSave: false,
      pagination: {},
      showSelectShift: false,
      dataShift: [],
      dayData: {},
      dataChecked: []
    }
  },

  computed: {
    lang() {
      return this.$store.state.userStores.lang
    },
    token() {
      return this.$store.state.user.token
    },
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    uploadUrl() {
      return baseApi(this.selectedStore.url_id, this.langId, 'attendance/employee/uploadonly')
    },
    computedDialogTitle() {
      if (this.tempDevice.id) {
        return this.lang.edit + ' ' + this.$lang[this.langId].employee
      } else {
        return this.lang.add + ' ' + this.$lang[this.langId].employee
      }
    },

    computedShiftNull () {
      let dataShift = []
      if (this.tempDevice) {
        this.tempDevice.advance_shift.map(i => {
          if (!i.shift.length) {
            dataShift.push(i)
          }
        })
      }
      return dataShift.length === 7? true : false
    }
  },

  watch: {
    '$store.getters.selectedStore'() {
      if (this.$store.getters.selectedStore.pos_freemium === 1) {
        this.$router.push('/online-order/delivery')
      } else {
        this.getEmployee()
      }
    }
  },

  mounted() {
    this.getListDevices()
  },

  methods: {
    getListDevices(search) {
      this.loading = true
      let param = {
        per_page: 20,
        show_logs: 1
      }
      getAttendanceDevices(param).then(response => {
        this.dataDevices = response.data.data
        this.pagination = response.data.meta
        this.loading = false
      }).catch(error => {
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
        this.dataDevices = []
        this.loading = false
      })
    },
    getMockupData() {
      this.dataDevices = require('/static/data/mockupEmployee.json')
    },

    // employee
    refreshCode () {
      this.tempDevice.pin = this.randomString(6)
    },

    randomString(len, charSet) {
      charSet = charSet || '0123456789';
      var randomString = '';
      for (var i = 0; i < len; i++) {
          var randomPoz = Math.floor(Math.random() * charSet.length);
          randomString += charSet.substring(randomPoz,randomPoz+1);
      }
      return randomString;
    },

    addNewDevice () {
      this.loadingSave = true
      this.tempDevice.device_status = 1
      addDevice(this.tempDevice).then(response => {
        this.dialogEdit = false
        this.getListDevices()
        this.tempDevice = {
          name: '',
          serial: ''
        }
        this.loadingSave = false
      }).catch(error => {
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
        this.tempDevice = {
          name: '',
          serial: ''
        }
        this.dialogEdit = false
        this.loadingSave = false
      })
    },

    updateDevice () {
      this.loadingSave = true
      
      updateDevice(this.tempDevice).then(response => {
        this.dialogEdit = false
        this.getListDevices()
        this.tempDevice = {
          name: '',
          serial: ''
        }
        this.loadingSave = false
      }).catch(error => {
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
        this.tempDevice = {
          name: '',
          serial: ''
        }
        this.dialogEdit = false
        this.loadingSave = false
      })
    },

    handleCancelAdd () {
      this.dialogEdit = false
      this.tempDevice = {}
    },

    // editEmploye (data) {
    //   this.tempDevice = data
    //   this.dialogEdit = true
    // },

    handleSearch (value) {
      // if (value) {
      //   this.getEmployee(true)
      // } else {
      //   this.getEmployee()
      // }
      if (value) {
        const dFn = debounce(value => this.getEmployee(true), '400ms')
        dFn(value)
      } else {
        this.getEmployee()
      }
    },

    handleSave () {
      if (this.tempDevice.id) {
        this.updateDevice()
      } else {
        this.addNewDevice()
      }
    },

    handleUploadProcess() {
      this.uploading = true
    },

    handleUploadError(error) {
      this.loading = false
      this.$notify({
        type: 'warning',
        title: error.response.data.error.message,
        message: error.response.data.error.error
      })
    },

    handleAvatarSuccess(response, file) {
      this.tempDevice.photo = response.data[0].photo_
      this.tempDevice.file_name = response.data[0].file_name
      this.uploading = false
    },

    deleteRow () {
      this.loading = true

      let data = {
        id: this.tempDevice.serial
      }

      deleteDevice(data).then(response => {
        this.searchQuery = ''
        this.getListDevices()
        this.dialogDelete = false
        this.dialogEdit = false
        this.tempDevice = {}
        this.loading = false
      }).catch(error => {
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
        this.dialogDelete = false
        this.dialogEdit = false
        this.tempDelete = {}
        this.loading = false
      })
    },

    handleAdd() {
      this.tempDevice = {
        name: '',
        serial: '',
      }
      this.dialogEdit = true
    },

    changeCurrentPage(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getEmployee()
    },

    editDevices(data) {
      this.loading = true

      getSinggleAttendanceDevices(data.id).then(response => {
        this.tempDevice = response.data.data
        this.dialogEdit = true
        // this.getShift()
        this.loading = false
      }).catch(error => {
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
        this.tempDevice = []
        this.loading = false
      })
    },

    handleEditAdvanceShift (item) {
      this.showSelectShift = true
      this.dayData = item
      this.dataChecked = [ ...item.shift]
    },

    handleCloseAdvanceShift () {
      this.showSelectShift = false
      this.dayData = {}
    },

    getShift() {
      let param = {
        per_page: 100
      }
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'attendance/shift'),
        headers: headers,
        params: param
      }).then(response => {
          // console.log('data', response.data.data)
          this.dataShift = response.data.data
      })
      .catch(error => {
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
        this.dataShift = []
      })
    },

    handleSaveAdvanceShift (day) {
      this.tempDevice.advance_shift.map(i => {
        if (i.day_id === day.day_id) {
          i.shift = [ ...day.shift]
        }
      })
      this.showSelectShift = false
    },

    getDays() {
      this.loading = true
      getDays().then(response => {
        let adv = [ ...response.data.data]
        adv.map(i => {
          i.day_id = i.id
          i.day_name = i.name,
          i.shift = []
        })
        this.tempDevice.advance_shift = adv
        this.loading = false
      }).catch(error => {
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
        this.loading = false
      })
    },
  }
}
</script>
