<template>
  <div class="shippings">
    <div class="table-handler-flex mb-16 test">
      <div class="mr-8" style="flex-grow: 1;">
        <el-input
          v-model="params.search_text"
          prefix-icon="el-icon-search"
          placeholder="cari"
          class="mb-4 input-search"
          @input="handleSearch"
        />
      </div>
      <el-button
        type="info"
        class="mb-4"
        @click="handleAdd">
        Tambah
      </el-button>
    </div>

    <data-empty
      v-if="!dataEmployee.length && !loading"
      image="/static/img/no-data-staff.png"
      desc="Belum ada pegawai<br/> Tambah baru untuk tetapkan pegawai yang harus absen"
    />

    <div
      v-loading="loading"
      v-if="dataEmployee.length || loading"
      class="like-table-wrapper">
      <div
        v-for="(item, key) in dataEmployee"
        :key="key"
        class="like-table-wrapper--item">
        <div class="flex-container mr-16" style="width: 280px;">
          <div class="mr-8 lh-1">
            <el-avatar
              :src="item.photo"
              :alt="item.name"
              :size="40"
            />
          </div>
          <div class="lh-1">
            <div class="font-bold font-14">{{ item.name }}</div>
            <div class="font-12 color-info">{{ item.department }}</div>
          </div>
        </div>
        <div
          v-if="item.face_photos && item.face_photos.length && hasAccessFaceRecog">
          <icons-multiple
            :items="item.face_photos"
            photo-object="url_photo_md"
          />
        </div>
        <div class="flex-grow-1"></div>
        <el-button type="text" icon="el-icon-edit" circle @click="editEmploye(item)" />
      </div>
      <div style="text-align: center;">
        <el-pagination
          :current-page.sync="pagination.current_page"
          :page-size="pagination.per_page"
          :total="pagination.total"
          layout="prev, pager, next"
          @current-change="changeCurrentPage">
        </el-pagination>
      </div>
    </div>

    <el-dialog
      :visible.sync="dialogEdit"
      :show-close="false"
      custom-class="mw-512">
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
        <el-upload
          v-loading="uploading"
          :action="uploadUrl"
          :on-progress="handleUploadProcess"
          :on-error="handleUploadError"
          :show-file-list="false"
          :headers="{ Authorization: 'Bearer ' + token.access_token }"
          :on-success="handleAvatarSuccess"
          class="new-avatar-uploader">
          <div class="new-avatar-uploader--inner">
            <el-avatar
              v-if="tempEmploye.photo"
              :src="tempEmploye.photo">
            </el-avatar>
            <i v-if="!tempEmploye.photo" class="el-icon-camera avatar-uploader-icon"></i>
          </div>
        </el-upload>

        <div class="font-12 text-left mt-32">{{ lang.name }}</div>

        <el-input v-model="tempEmploye.name"></el-input>

        <div class="font-12 text-left mt-32">Department</div>
        <el-input v-model="tempEmploye.department"></el-input>

        <div class="font-12 text-left mt-32">Pin Absensi</div>
        <!-- <el-input v-model="tempEmploye.pin" disabled class="input-pin-employee">
          <el-button class="box-shadow-null" slot="append" icon="el-icon-refresh" @click="refreshCode"></el-button>
        </el-input> -->
        <div class="flex-container full-width border border--form color-info--bg">
          <div v-for="(pin, idx) in dataPin" :key="idx" class="font-bold font-16" style="flex: 50%">{{ pin }}</div>
          <div style="flex: 50%">
            <el-button class="box-shadow-null color-black" type="text" icon="el-icon-refresh" @click="refreshCode"></el-button>
          </div>
        </div>

        <div v-if="hasAccessFaceRecog">
          <div class="text-left mt-16 mb-16">
            <div class="font-20 font-bold">
              Foto Wajah
            </div>
            <div class="font-12 color-info">
              Foto wajah ini akan digunakan untuk Face Recognition pada aplikasi Absensi Olsera
            </div>
          </div>
          <el-row
            :gutter="16"
            class="mt-16">
            <el-col
              v-for="(photo) in Object.keys(employeePhotos)"
              :key="photo"
              :sm="8"
              class="mb-8 mt-8">
              <upload-avatar
                :token="token.access_token"
                :photo="employeePhotos[photo]"
                :paramData="{'angle': photo, 'employee_id': tempEmploye.id}"
                :upload-url="tempEmploye.id ? 'face/upload' : 'attendance/employee/uploadonly'"
                shape="square"
                @upload-success="handleUploadEmployeePhotoSuccess(photo, $event)">
                <template #no-photo>
                  <img
                    class="pt-24" style="width: 50%;"
                    v-if="!employeePhotos[photo]"
                    :src="'/static/img/attendance/sampleFace-'+photo+'.png'" alt=""
                  >
                  <div class="pt-8">{{ rootLang['face_'+photo] }}</div>
                </template>
              </upload-avatar>
            </el-col>
          </el-row>
        </div>

        <div class="text-left">
          <div class="flex-container mt-24 text-left">
            <div class="full-width">{{ rootLang.advance_shift }}</div>
            <div>
              <el-switch v-model="tempEmploye.use_advance_shift" :active-value="1" :inactive-value="0"></el-switch>
            </div>
          </div>
          <div class="mt-4 font-12">{{ rootLang.advance_shift_note }}</div>

          <div v-if="tempEmploye.use_advance_shift" class="like-table-wrapper mt-16">
            <div v-for="item in tempEmploye.advance_shift" :key="item.day_id" class="like-table-wrapper--item">
              <div class="flex-container full-width">
                <div style="width: 30%">{{ item.day_name }}</div>
                <div class="full-width text-right">
                  <el-tag v-if="!item.shift.length" type="info">Otomatis</el-tag>
                  <template v-else>
                    <el-tag v-for="shift in item.shift" :key="shift.shift_id" class="mr-4">{{ shift.name }}</el-tag>
                  </template>
                </div>
                <div class="pointer ml-4 container-icon" @click="handleEditAdvanceShift(item)">
                  <svg-icon icon-class="edit-2" class="color-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <offscreen-advance-shift
          :show="showSelectShift"
          :data-shift="dataShift"
          :day-data="dayData"
          :data-checked="dataChecked"
          @cancel="handleCloseAdvanceShift"
          @save="handleSaveAdvanceShift" />
      </div>

      <el-button
        v-if="tempEmploye.id"
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

import { getDays } from '@/api/attendance'

import basicComputedMixin from '@/mixins/basicComputedMixin'
import offscreenAdvanceShift from './offscreenAdvanceShift.vue'
import DataEmpty from '@/components/modules/DataEmpty.vue'
import IconsMultiple from '@/components/IconsMultiple.vue'
import UploadAvatar from '@/components/UploadAvatar.vue'
import { mixins } from './mixins'

export default {
  name: 'Employee',
  components: { offscreenAdvanceShift, DataEmpty, IconsMultiple, UploadAvatar },

  mixins: [basicComputedMixin, mixins],

  data() {
    return {
      dialogEdit: false,
      loading: false,
      dataEmployee: [],
      tempEmploye: {
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
      dataChecked: [],
      employeePhotos: {
        front: '',
        right: '',
        left: '',
        above: '',
        below: ''
      },
			employeeAddPhoto: {
				front: {},
        right: {},
        left: {},
        above: {},
        below: {}
			}
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
      if (this.tempEmploye.id) {
        return this.lang.edit + ' ' + this.$lang[this.langId].employee
      } else {
        return this.lang.add + ' ' + this.$lang[this.langId].employee
      }
    },

    computedShiftNull () {
      let dataShift = []
      if (this.tempEmploye) {
        this.tempEmploye.advance_shift.map(i => {
          if (!i.shift.length) {
            dataShift.push(i)
          }
        })
      }
      return dataShift.length === 7? true : false
    },

    dataPin () {
      let pin = []
      if (this.tempEmploye && this.tempEmploye.pin) {
       pin = Array.from(this.tempEmploye.pin)
      }
      return pin
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
    this.getEmployee()
  },

  methods: {
    getEmployee(search) {
      if (![...document.getElementById('app').classList].includes('dummy-page')) {
        this.loading = true
        let param = this.params
        if (search) {
          this.$delete(param, 'page')
          param.search_column = 'name'
        } else {
          this.$delete(param, 'search_text')
          this.$delete(param, 'search_column')
        }
        if (!param.search_text || param.search_text === '') {
          this.$delete(param, 'search_column')
        }
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }

        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'attendance/employee'),
          headers: headers,
          params: param
        }).then(response => {
          this.dataEmployee = response.data.data
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
          this.dataEmployee = []
          this.loading = false
        })
      } else {
        this.getMockupData()
      }
    },
    getMockupData() {
      this.dataEmployee = require('/static/data/mockupEmployee.json')
    },

    // employee
    refreshCode () {
      this.tempEmploye.pin = this.randomString(6)
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

    addEmployee () {
      this.loadingSave = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let advance_shift = []
      this.tempEmploye.advance_shift.filter(i => {
        if (i.shift.length) {
          let ss = []
          i.shift.map(j => { ss.push(j.shift_id) })

          advance_shift.push({
            day_id: i.day_id,
            shift_id: ss
          })
        }
      })
      // if (advance_shift.length) {
        this.tempEmploye.advance_shift = [ ...advance_shift]
      // }

			let paramData = this.tempEmploye
			paramData.face_files= []

			Object.keys(this.employeeAddPhoto).map(photo => {
				if(Object.keys(this.employeeAddPhoto[photo]).length !== 0 ){
					paramData.face_files.push(this.employeeAddPhoto[photo])
				}
			})

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'attendance/employee'),
        headers: headers,
				data: paramData
      }).then(response => {
        this.dialogEdit = false
				this.resetEmployeePhotos()
        this.getEmployee()
        this.tempEmploye = {
          name: '',
          department: '',
          pin: this.randomString(6)
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
        this.tempEmploye = {
          name: '',
          department: '',
          pin: this.randomString(6)
        }
        this.dialogEdit = false
        this.loadingSave = false
      })
    },

    updateEmployee () {
      this.loadingSave = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let advance_shift = []
      this.tempEmploye.advance_shift.filter(i => {
        if (i.shift.length) {
          let ss = []
          i.shift.map(j => { ss.push(j.shift_id) })

          advance_shift.push({
            day_id: i.day_id,
            shift_id: ss
          })
        }
      })
      
      if (this.computedShiftNull) {
        console.log('data', advance_shift)
        this.tempEmploye.advance_shift = []
      } else if (advance_shift.length) {
        this.tempEmploye.advance_shift = [ ...advance_shift]
      }

      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'attendance/employee/' + this.tempEmploye.id),
        headers: headers,
        data: this.tempEmploye
      }).then(response => {
        this.dialogEdit = false
        this.getEmployee()
        this.tempEmploye = {
          name: '',
          department: '',
          pin: this.randomString(6)
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
        this.tempEmploye = {
          name: '',
          department: '',
          pin: this.randomString(6)
        }
        this.dialogEdit = false
        this.loadingSave = false
      })
    },

    handleCancelAdd () {
      this.dialogEdit = false
      this.tempEmploye = {}
    },

    // editEmploye (data) {
    //   this.tempEmploye = data
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
      if (this.tempEmploye.id) {
        this.updateEmployee()
      } else {
        this.addEmployee()
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
      this.tempEmploye.photo = response.data[0].photo_
      this.tempEmploye.file_name = response.data[0].file_name
      this.uploading = false
    },

    deleteRow () {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'delete',
        url: baseApi(this.selectedStore.url_id, this.langId, 'attendance/employee/' + this.tempEmploye.id),
        headers: headers
      }).then(response => {
        this.searchQuery = ''
        this.getEmployee()
        this.dialogDelete = false
        this.dialogEdit = false
        this.tempEmploye = {}
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
      this.tempEmploye = {
        name: '',
        department: '',
        pin: this.randomString(6),
        file_name: '',
        use_advance_shift: 0
      }
      this.resetEmployeePhotos()
      this.getDays()
      this.getShift()
      this.dialogEdit = true
    },

    changeCurrentPage(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getEmployee()
    },

    editEmploye(data) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'attendance/employee/' + data.id),
        headers: headers,
      }).then(response => {
        this.resetEmployeePhotos()
        this.tempEmploye = response.data.data
        if (response.data.data.face_photos && response.data.data.face_photos.length) {
          response.data.data.face_photos.map(photo => {
            if (photo.id) {
              this.employeePhotos[photo.angle] = photo.url_photo
            }
          })
        }
        this.dialogEdit = true
        this.getShift()
        this.loading = false
      }).catch(error => {
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
        this.tempEmploye = []
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
      this.tempEmploye.advance_shift.map(i => {
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
        this.tempEmploye.advance_shift = adv
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
    handleUploadEmployeePhotoSuccess(type, response) {
			if(this.tempEmploye.id){
				this.employeePhotos[type] = response.data.url_file
        this.$message({
          type: 'success',
          message: this.rootLang.success_update
        })
			}else{
				this.employeePhotos[type] = response.data[0].photo_

				this.employeeAddPhoto[type] = {
					file_name: response.data[0].file_name,
					angle: type,
					width: response.data[0].width,
					height: response.data[0].height
				}
			}
    },
    resetEmployeePhotos() {
      this.employeePhotos = {
        front: '',
        right: '',
        left: '',
        above: '',
        below: ''
      }

			this.employeeAddPhoto = {
				front: {},
        right: {},
        left: {},
        above: {},
        below: {}
			}
    },
  }
}
</script>
