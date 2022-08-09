<template>
  <div v-loading="loading" class="shippings">
    <div
      v-if="bannerOrder"
      class="card_banner"
      style="background-image: url('/static/img/info-working-hours.svg');">
      <div class="text_banner">
        <span class="title">{{ $lang[langId].title_banner_working_hours }}</span>
        <div class="subtitle">{{ $lang[langId].subtitle_banner_working_hours }}</div>
      </div>
      <el-button
        type="text"
        icon="el-icon-close"
        class="button-close-banner"
        @click="handleBanner"
      />
    </div>

    <el-card class="box-card">
      <el-table
        ref="multipleTable"
        v-loading="loading"
        stripe
        :data="dataWorkingHours"
        style="width: 100%"
        :show-header="false">
        <el-table-column width="55">
          <template slot-scope="scope">
            <el-checkbox v-model="day[scope.$index]" @change="handleSelectionChange(day[scope.$index], scope.row)"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="Day" width="120">
          <template slot-scope="scope">{{ scope.row.day_name }}</template>
        </el-table-column>
        <el-table-column property="working_hours" label="Working Hours" align="right" >
          <template slot-scope="scope">
            <div v-if="scope.row.enabled === 0">
              <el-tag v-for="(i, iKey) in scope.row.times" :key="iKey" color="#F5F5F5" style="color: #000000; margin-right: 5px">{{ getTimeFormat(i.fstart_time, i.fend_time) }}</el-tag>
              <el-button type="text" icon="el-icon-edit" circle @click="editHours(scope.row)" />
            </div>
            <div v-else>
              <el-tag v-for="(i, iKey) in scope.row.times" :key="iKey" color="#E4F8FF" style="color: #000000; margin-right: 5px">{{ getTimeFormat(i.fstart_time, i.fend_time) }}</el-tag>
              <el-button type="text" icon="el-icon-edit" circle @click="editHours(scope.row)" />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="card_close_date box-card">
      <div class="header">
        <span class="title">{{ $lang[langId].closing_date }}</span>
        <div style="float: right">
          <el-button style="background: #F5F5F5; font-weight: bold" @click="showDialogClose(0)">{{ lang.add }}</el-button>
        </div>
      </div>
      <div style="text-align: center;">
        <div v-if="dataClose !== 1">
          <img src="../../../../../static/img/no-close-date.svg" class="image" style="margin-top: 32px">
          <div class="no_close" >{{ $lang[langId].no_closing_date }}</div>
          <span style="font-size: 14px">{{ $lang[langId].no_closing_date_info }}</span>
        </div>
        <div v-else>
          <el-table
            v-loading="loading"
            stripe
            :data="dataCloseDate"
            style="width: 100%"
            :show-header="false"
            @selection-change="handleSelectionChange">
            <el-table-column label="Day">
              <template slot-scope="scope" >
                <div class="close_date"> {{ scope.row.fstart_date }} - {{ scope.row.fend_date }}</div>
                <span class="close_note">{{ scope.row.notes }}</span>
              </template>
            </el-table-column>
            <el-table-column property="working_hours" label="Working Hours" align="right" >
              <template slot-scope="scope">
                <el-button type="text" icon="el-icon-edit" circle @click="showDialogClose(scope.row)" />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>

    <div v-if="isEdit" class="floating_div" :style="computedRes">
      <floating-div @confirm="updateWorkingHours" @cancel="setCancel"></floating-div>
    </div>

    <el-dialog
      :visible.sync="dialogEdit"
      :show-close="false"
      custom-class="dialog-card">
      <div slot="title" class="flex-container">
        <div class="full-width">
          <h4 class="dialog-title">{{ lang.edit + ' ' + $lang[langId].working_hours }}</h4>
        </div>
        <div class="full-width text-right">
          <el-button type="info" @click="handleCancelTime">{{ lang.cancel }}</el-button>
          <el-button type="success" @click="handleSaveTime" >{{ lang.save }}</el-button>
        </div>
      </div>

      <div v-for="(i, idx) in countTime" :key="idx" class="working_hours_input">
        <el-row :gutter="10">
          <el-col :sm="12">
            <div>{{ lang.start }}</div>
            <el-time-picker
              v-if="idx === 0"
              v-model="i.fstart_time"
              :picker-options="{
                maxTime: countTime[idx].fend_time,
                format: 'HH:mm'
              }"
              :placeholder="lang.start_time"
              style="width: 100%">
            </el-time-picker>
            <el-time-picker
              v-else
              v-model="i.fstart_time"
              :picker-options="{
                maxTime: countTime[idx].fend_time,
                format: 'HH:mm'
              }"
              :placeholder="lang.start_time"
              style="width: 100%">
            </el-time-picker>
          </el-col>

          <el-col v-if="idx === 0" :sm="12">
            <div>{{ lang.end }}</div>
            <el-time-picker
              v-if="countTime.length > 1"
              v-model="i.fend_time"
              :placeholder="lang.end_time"
              :picker-options="{
                minTime: i.fstart_time,
                maxTime: countTime[idx+1].fstart_time,
                format: 'HH:mm'
              }"
              style="width: 100%">
            </el-time-picker>
            <el-time-picker
              v-else
              v-model="i.fend_time"
              :placeholder="lang.end_time"
              :picker-options="{
                minTime: i.fstart_time,
                format: 'HH:mm'
              }"
              style="width: 100%">
            </el-time-picker>
          </el-col>

          <el-col v-else :sm="12">
            <div>{{ lang.end }}</div>
            <el-time-picker
              v-if="countTime.length > idx+1"
              v-model="i.fend_time"
              :placeholder="lang.end_time"
              :picker-options="{
                minTime: i.fstart_time,
                maxTime: countTime[idx+1].fstart_time,
                format: 'HH:mm'
              }"
              style="width: 100%">
            </el-time-picker>
            <el-time-picker
              v-else
              v-model="i.fend_time"
              :placeholder="lang.end_time"
              :picker-options="{
                minTime: i.fstart_time,
                format: 'HH:mm'
              }"
              style="width: 100%">
            </el-time-picker>
          </el-col>
        </el-row>

        <div v-if="countTime.length > 1 && idx !== countTime.length - 1">
          <el-tag color="#F5F5F5" class="tag_break">
            <svg-icon
              icon-class="break"
              v-if="breakTime(countTime[idx].fend_time, countTime[idx+1].fstart_time ) !== '0 ' + $lang[langId].minute "
            />
            {{ breakTime(countTime[idx].fend_time, countTime[idx+1].fstart_time ) }}

            <el-button type="text" @click="handleDelTime(idx)" style="color: #000000">X</el-button>
          </el-tag>
        </div>
      </div>
      <el-button v-if="countTime.length < 5 && countTime[countTime.length - 1].fend_time !== '23:45'" class="btn_add_break" @click="addTime">{{ lang.add }} {{ $lang[langId].working_time }}</el-button>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogAddClose"
      :show-close="false"
      custom-class="dialog-card">
      <div slot="title" class="flex-container">
        <h4 class="dialog-title">{{ lang.edit + ' ' + $lang[langId].close_date }}</h4>
        <div class="btn_save_dialog">
          <el-button type="info" @click="handleCloseDialog">{{ lang.cancel }}</el-button>
        <el-button type="success" @click="saveCloseDate">{{ lang.save }}</el-button>
        </div>
      </div>

      <el-row :gutter="10">
          <el-col :md="12">
            <div>{{ lang.start }}</div>
            <el-date-picker
              v-model="closeDate.start_date"
              value-format="yyyy-MM-dd"
              type="date"
              style="width: 100%">
            </el-date-picker>
          </el-col>
          <el-col :md="12">
            <div>{{ lang.end }}</div>
            <el-date-picker
              v-model="closeDate.end_date"
              value-format="yyyy-MM-dd"
              type="date"
              style="width: 100%">
            </el-date-picker>
          </el-col>
        </el-row>

        <div style="margin-top: 16px">{{ lang.notes }}</div>
        <el-input placeholder="Please input" v-model="closeDate.notes"></el-input>
        <div v-if="closeDate.id">
          <delete-button @confirm="deleteCloseDate"></delete-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import FloatingDiv from '../../FloatingDiv'
import DeleteButton from '../../DeleteButton'
import { baseApi } from 'src/http-common'
import axios from 'axios'
var moment = require('moment')

export default {
  name: 'WorkingHours',
  components: {
    FloatingDiv,
    DeleteButton
    // International,
    // Free
  },

  data() {
    return {
      closeDate: {
        start_date: '',
        end_date: '',
        notes: ''
      },
      dialogEdit: false,
      dialogAddClose: false,
      countTime: [
        {
          fstart_time: '08:00',
          fend_time: '17:00'
        }
      ],
      isEdit: false,
      dataClose: 1,
      loading: false,
      dataWorkingHours: [],
      tempWorking: [],
      dataCloseDate: [],
      editCloseDate: false,
      day: [
        false,false,false,false,false,false,false
      ],
      tempDayId: 0,
      tempTable: []
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
    bannerOrder() {
      const localVisibleBanner = this.$store.state.bannerOnlineOrder.working_hours
      if (localVisibleBanner) return parseInt(localVisibleBanner)
    },

    computedRes () {
      // var elmt = document.getElementsByClassName('tab-content')[0].offsetWidth
      var w = document.getElementsByClassName('tab-content')[0].offsetWidth
      // var h = window.innerHeight
      let cls = 'max-width: ' + w + 'px; padding-right: unset !important'
      return cls
    }
  },

  watch: {
    '$store.getters.selectedStore'() {
      if (this.$store.getters.selectedStore.pos_freemium === 1) {
        this.$router.push('/online-order/delivery')
      } else {
        this.getWorkingHours()
        this.getCloseDate()
      }
    }
  },

  mounted() {
    this.getWorkingHours()
    this.getCloseDate()
  },

  methods: {
    getWorkingHours() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let param = {
        sort_type: 'asc',
        sort_column: 'day_id'
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'online/workinghours'),
        headers: headers,
        params: param
      }).then(response => {
          // console.log('data', response.data.data)
          this.dataWorkingHours = response.data.data
          this.dataWorkingHours.map((i, idx) => {
            if (i.enabled === 1) {
              this.day[idx] = true
            } else {
              this.day[idx] = false
            }

            if (i.times.length > 0) {
              var time = []
              i.times.map(j => {
                j.fstart_time = moment('08/05/2015 ' + j.fstart_time).format()
                j.fend_time = moment('08/05/2015 ' + j.fend_time).format()

                time.push({
                  start_time: j.start_time,
                  end_time: j.end_time
                })
              })
              this.tempWorking.push({
                day_id: i.day_id,
                enabled: i.enabled,
                times: time
              })
            } else {
              this.tempWorking.push({
                day_id: i.day_id,
                enabled: i.enabled,
                times: i.times
              })
            }
          })
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
          this.loading = false
        })
    },

    getCloseDate() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let param = {
        search_text: '1',
        search_column: 'enabled',
        search_operator: '='
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'online/closingdate'),
        headers: headers
        // params: param
      }).then(response => {
          console.log('data', response.data.data)
          this.dataCloseDate = response.data.data
          this.dataClose = 1
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
          this.dataClose = 0
          this.loading = false
        })
    },

    updateWorkingHours(data) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      var data = {
        workinghours: this.tempWorking
      }

      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'online/workinghours'),
        headers: headers,
        data: data
      }).then(response => {
          this.getWorkingHours()
          this.isEdit = false
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
          this.loading = false
        })
    },

    addCloseDate () {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'online/closingdate'),
        headers: headers,
        data: this.closeDate
      }).then(response => {
        this.closeDate = {
          start_date: '',
          end_date: '',
          notes: ''
        },
        this.dialogAddClose = false
        this.editCloseDate = false
        this.getCloseDate()
        this.loading = false
      }).catch(error => {
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
        this.dialogAddClose = false
        this.editCloseDate = false
        this.loading = false
      })
    },

    updateCloseDate () {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'online/closingdate/' + this.closeDate.id),
        headers: headers,
        data: this.closeDate
      }).then(response => {
        this.closeDate = {
          start_date: '',
          end_date: '',
          notes: ''
        },
        this.dialogAddClose = false
        this.editCloseDate = false
        this.getCloseDate()
        this.loading = false
      }).catch(error => {
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
        this.dialogAddClose = false
        this.editCloseDate = false
        this.loading = false
      })
    },

    deleteCloseDate () {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'online/closingdate/' + this.closeDate.id),
        headers: headers,
        data: this.closeDate
      }).then(response => {
        this.closeDate = {
          start_date: '',
          end_date: '',
          notes: ''
        },
        this.dialogAddClose = false
        this.editCloseDate = false
        this.getCloseDate()
        this.loading = false
      }).catch(error => {
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
        this.dialogAddClose = false
        this.editCloseDate = false
        this.loading = false
      })
    },

    showDialogClose (data) {
      // console.log('close', data.start_date)
      if (data === 0) {
        this.dialogAddClose = true
        this.editCloseDate = false
      } else {
        this.closeDate.start_date = data.start_date
        this.closeDate.end_date = data.end_date
        this.closeDate.notes = data.notes
        this.closeDate.id = data.id
        this.dialogAddClose = true
        this.editCloseDate = true
      }
    },

    saveCloseDate () {
      if (!this.editCloseDate) {
        this.addCloseDate()
      } else {
        this.updateCloseDate()
      }
    },

    handleSelectionChange (i, data) {
      if (i) {
        this.tempWorking.map(i => {
          if (i.day_id === data.day_id) {
            i.enabled = 1
          }
        })
      } else {
        this.tempWorking.map(i => {
          if (i.day_id === data.day_id) {
            i.enabled = 0
          }
        })
      }
      this.isEdit = true
    },

    editHours (data) {
      this.tempTable = this.dataWorkingHours
      this.tempDayId = data.day_id
      if (data.times.length !== 0) {
        this.countTime = data.times
        this.countTime.map(i => {
          i.fend_time = moment(i.fend_time).format()
          i.fstart_time = moment(i.fstart_time).format()
        })
      } else {
        this.countTime = [{
          fend_time: null,
          fstart_time: null
        }]
      }
      
      this.dialogEdit = true
    },

    addTime () {
      var d2 = new Date(this.countTime[this.countTime.length - 1].fend_time)
      var startTime = moment(d2).add(1, 'h').toDate();
      var endTime = moment(d2).add(75, 'm').toDate();
      var minTime = moment(d2).subtract(15, 'm').toDate();
      this.countTime[this.countTime.length - 1].break = '1 ' + this.lang.hour
      this.countTime.push({
        fstart_time: moment(startTime).format(),
        // fend_time: moment(endTime).format('HH:mm'),
        min_time: moment(minTime).format()
      })
    },

    breakTime (startTime, endTime) {
      // var date1 = new Date('08/05/2015 ' + startTime)
      // var date2 = new Date('08/05/2015 ' + endTime)

      var date1 = new Date(startTime)
      var date2 = new Date(endTime)

      var diff = date2.getTime() - date1.getTime()
      var msec = diff
      var hh = Math.floor(msec / 1000 / 60 / 60)
      msec -= hh * 1000 * 60 * 60;
      var mm = Math.floor(msec / 1000 / 60);
      if (hh !== 0) {
        if (mm !== 0) {
          return this.$lang[this.langId].break + ' ' + hh + ' ' + this.lang.hour + ' ' + mm + ' ' + this.$lang[this.langId].minute
        } else {
          return this.$lang[this.langId].break + ' ' + hh + ' ' + this.lang.hour
        }
      } else {
        if (mm !== 0) {
          return this.$lang[this.langId].break + ' ' + mm + ' ' + this.$lang[this.langId].minute
        } else {
          return this.$lang[this.langId].no_break
        }
      }

      this.countTime = tempTime
    },

    handleChangeTime (idx) {
      var tempTime = this.countTime
      this.countTime = []
      var date1 = new Date('08/05/2015 ' + tempTime[idx-1].fend_time)
      var date2 = new Date('08/05/2015 ' + tempTime[idx].fstart_time)
      // var date2 = new Date('08/05/2015 11:45:00')

      var diff = date2.getTime() - date1.getTime()
      var msec = diff
      var hh = Math.floor(msec / 1000 / 60 / 60)
      msec -= hh * 1000 * 60 * 60;
      var mm = Math.floor(msec / 1000 / 60);
      if (hh !== 0) {
        if (mm !== 0) {
          // console.log('jam', hh)
          tempTime[idx-1].break = hh + ' ' + this.lang.hour + ' ' + mm + ' ' + this.$lang[this.langId].minute
        } else {
          tempTime[idx-1].break = hh + ' ' + this.lang.hour
        }
      } else {
        tempTime[idx-1].break = mm + ' ' + this.$lang[this.langId].minute
      }

      this.countTime = tempTime
    },

    handleDelTime (idx) {
      this.countTime.splice(idx+1, 1)
    },

    handleCancelTime () {
      this.countTime = [{
        fstart_time: '08:00',
        fend_time: '17:00'
      }]

      this.dialogEdit = false
      this.getWorkingHours()
    },

    handleSaveTime () {
      var tempTime = []
      this.countTime.map(i => {
        tempTime.push({
          start_time: moment(i.fstart_time).format('HH:mm'),
          end_time: moment(i.fend_time).format('HH:mm')
          // break: i.break
        })
      })

      this.countTime = [{
        fstart_time: '08:00',
        fend_time: '17:00'
      }]
      this.tempWorking.map(i => {
        if (i.day_id === this.tempDayId) {
          i.times = tempTime
        }
      })
      this.updateWorkingHours()
      this.dialogEdit = false
    },

    setCancel () {
      this.isEdit = false
    },

    handleCloseDialog () {
      this.dialogAddClose = false
      this.closeDate = {}
    },

    handleBanner () {
      var data = {
        id: 1,
        value: 0
      }
      this.$store.commit('SET_BANNER_ORDER', data)
    },

    getTimeFormat(start, end) {
      return moment(start).format('HH:mm') + ' - ' + moment(end).format('HH:mm')
    }
  }
}
</script>
