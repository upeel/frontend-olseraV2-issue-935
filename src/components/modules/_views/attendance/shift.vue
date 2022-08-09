<template>
  <div class="shippings">
    <div class="flex-container mb-16">
      <div style="flex-grow: 1;"/>
      <el-button type="info" @click="handleAdd">Tambah</el-button>
    </div>

    <el-card
      v-if="dataShift.length === 0 && !loading"
      class="card_close_date box-card">
      <div class="no-data-wrapper">
        <img src="/static/img/no-shift.png" class="no-data-image">
        <div class="no_close" >Belum ada Shift Kerja</div>
        <span>Tambah pergantian jam kerja untuk absensi pegawai</span>
      </div>
    </el-card>

    <div
      v-loading="loading"
      v-if="dataShift.length || loading"
      class="like-table-wrapper">
      <div
        v-for="(item, key) in dataShift"
        :key="key"
        class="like-table-wrapper--item">
        <div class="font-bold font-14" style="flex-grow: 1;">
          {{ item.name }}
        </div>
        <div class="mr-8">
          <el-tag color="#E4F8FF" style="color: #000000;">
            {{ item.start_time }} - {{ item.end_time }}
          </el-tag>
        </div>
        <div>
          <el-button type="text" icon="el-icon-edit" circle @click="editShift(item)" />
        </div>
      </div>
    </div>

    <el-dialog
      :visible.sync="dialogEdit"
      :show-close="false"
      custom-class="dialog-card">
      <div slot="title" class="flex-container">
        <h4 class="dialog-title full-width">
          {{ computedDialogTitle }}
        </h4>
        <div class="btn_save_dialog full-width text-right">
          <el-button type="info" @click="handleCancelAdd">{{ lang.cancel }}</el-button>
          <el-button :loading="loadingSave" type="success" @click="handleSave" >{{ lang.save }}</el-button>
        </div>
      </div>
      <div class="font-12 text-left mt-32">{{ lang.name }} {{ $lang[langId].shift }}</div>
      <el-input v-model="tempShift.name"></el-input>

      <div class="working_hours_input">
        <div class="flex-container">
          <div class="full-width pr-5">
            <div class="font-12 text-left">{{ lang.start }}</div>
            <el-time-select
              v-model="tempShift.start_time"
              :placeholder="lang.start_time"
              :picker-options="{
                start: '00:00',
                step: '00:15',
                end: '23:45'
              }"
              style="width: 100%">
            </el-time-select>
          </div>

          <div class="full-width pl-5">
            <div>{{ lang.end }}</div>
            <el-time-select
              v-model="tempShift.end_time"
              :placeholder="lang.end_time"
              :picker-options="{
                start: '00:00',
                step: '00:15',
                end: '23:45'
              }"
              style="width: 100%;">
            </el-time-select>
          </div>
        </div>
      </div>

      <el-button
        v-if="tempShift.id"
        class="mt-24 btn-block"
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

export default {
  name: 'Shift',

  data() {
    return {
      dialogEdit: false,
      loading: false,
      dataShift: [],
      tempShift: {
        name: '',
        start_time: '',
        end_time: ''
      },
      params: {
        search_column: 'name',
        search_text: ''
      },
      dialogDelete: false,
      loadingSave: false
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
    computedDialogTitle() {
      if (this.tempShift.id) {
        return 'Edit Shift'
      } else {
        return 'Add Shift'
      }
    }
  },

  watch: {
    '$store.getters.selectedStore'() {
      this.getShift()
    }
  },

  mounted() {
    this.getShift()
  },

  methods: {
    getShift(search) {
      if (![...document.getElementById('app').classList].includes('dummy-page')) {
        this.loading = true
        let param = {}
        if (search) {
          param = this.params
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
            this.loading = false
          })
          .catch(error => {
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
      this.dataShift = require('/static/data/mockupShift.json')
    },

    // employee
    addShift (update) {
      this.loadingSave = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let method = update ? 'PUT' : 'POST'

      axios({
        method: method,
        url: baseApi(this.selectedStore.url_id, this.langId, update ? 'attendance/shift/' + this.tempShift.id : 'attendance/shift'),
        headers: headers,
        data: this.tempShift
      }).then(response => {
        this.dialogEdit = false
        this.tempShift = {
          name: '',
          start_time: '',
          end_time: ''
        }
        this.getShift()
        this.loadingSave = false
      }).catch(error => {
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
        this.dialogEdit = false
        this.loadingSave = false
      })
    },

    handleCancelAdd () {
      this.dialogEdit = false
      // this.tempEmploye = {
      //   name: '',
      //   department: '',
      //   pin: this.randomString(6)
      // }
    },

    editShift (data) {
      this.tempShift = data
      this.dialogEdit = true
    },

    handleSearch (value) {
      if (value) {
        this.getEmployee(true)
      } else {
        this.getEmployee()
      }
    },

    handleSave () {
      if (this.tempShift.id) {
        this.addShift(true)
      } else {
        this.addShift(false)
      }
    },

    deleteRow () {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'delete',
        url: baseApi(this.selectedStore.url_id, this.langId, 'attendance/shift/' + this.tempShift.id),
        headers: headers
      }).then(response => {
        this.searchQuery = ''
        this.getShift()
        this.dialogDelete = false
        this.dialogEdit = false
        this.tempShift = {}
        this.loading = false
        this.$notify({
          type: 'warning',
          title: 'Success',
          message: response.data.data.message
        })
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
        this.tempShift = {}
        this.loading = false
      })
    },

    handleAdd() {
      this.tempShift = {
        name: '',
        start_time: '',
        end_time: ''
      }
      this.dialogEdit = true
    }
  }
}
</script>

