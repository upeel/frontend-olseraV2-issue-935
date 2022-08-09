<template>
  <div v-loading="loading">
    <div class="flex-container text-left">
      <div class="full-width font-20 font-bold">{{ rootLang.opening_hours }}</div>
      <div class="flex-container" style="width: 40%; justify-content: flex-end;">
        <span v-if="grabfoodData.isPause === 1" class="color-danger mr-12">
          {{ rootLang.temporarily_closed  }}
          {{ this.grabfoodData.duration_pause === '30min'? '30 ' + rootLang.minute : this.grabfoodData.duration_pause === '1h' ? '1 ' + rootLang.hours : this.grabfoodData.duration_pause === '24h' ? '24 ' + rootLang.hours : '' }}
        </span>
        <span v-else class="color-green--dark font-bold mr-12">Buka</span>
        <el-switch v-model="is_pause" :active-value="0" :inactive-value="1" @change="handleSwitch"></el-switch>
      </div>
      <div class="drop-switch" v-show="showDropdown">
        <div
          v-for="(command, index) in closeCase"
          :key="index"
          :command="command.id"
        >
        <el-button class="btn-block text-left" @click="handleCloseStore(command)">
          {{ rootLang.temporarily_closed }} <span class="font-bold">{{command.label}}</span>
        </el-button>
        </div>
      </div>
    </div>
    <div v-if="grabfoodData.isPause === 1" class="mt-24 mb-16 radius-10 flex-container full-width p-8 color-green--soft--bg">
      <div class="container-icon">
        <svg-icon icon-class="clock" class="font-20 color-green--dark"/>
      </div>
      <div v-if="grabfoodData.duration_pause" class="px-4">Buka otomatis dalam </div>
      <div v-else class="px-4">{{ rootLang.temporarily_closed }} </div>
      <vue-countdown-timer
        :start-time="generateTimer.countStart"
        :end-time="generateTimer.countEnd"
        :day-txt="false"
        :hour-txt="rootLang.hours"
        :minutes-txt="rootLang.minute"
        :seconds-txt="rootLang.sec"
        :interval="1000"
        :end-text="'00 : 00'"
        :show-zero="true"
        style="font-size: 13px; font-weight: bold; float: right"
        @end_callback="autoOpenStore" />
    </div>
    <div
      class="like-table-wrapper--item"
      style="height: 56px"
      v-for="item in dataPer"
      :key="item">
      <el-checkbox v-model="item.checked" @change="handleCheck(item)"/>
      <div class="p-16">{{ item.fday }}</div>
      <div class="full-width text-right">
        <el-button
          type="text"
          class="edit"
          @click.native.stop="handleEditDay(item)">
          <div class="flex-container">
            <el-tag type="primary" v-if="item.checked && getLabelDayTime(item) !== 0" class="color-black" v-html="getLabelDayTime(item)"></el-tag>
            <el-tag type="primary" v-if="item.checked && getLabelDayTime(item) === 0" class="color-black" >Tidak ada period</el-tag>
            <el-tag v-else-if="!item.checked" type="info" effect="plain" size="mini" style="background-color: transparent">Tidak aktif</el-tag>
            <div class="container-icon">
              <svg-icon icon-class="edit-2" />
            </div>
          </div>
        </el-button>
      </div>
    </div>

    <offscreen-edit-section-periode
      :show="visibleOffscreenEditSectionPeriode"
      :form-edit="dayEdit"
      :data-grab-food-id="dataGrabFoodId"
      @cancel="visibleOffscreenEditSectionPeriode = false"
      @save="handleSavePeriod"
    />
  </div>
</template>
<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import { getGrabPeriod, getGrabPeriodStore as getDataPeriod, updatePeriods, temporarilyClosed, fetchByStore as fetchGrabfoodStore, } from '@/api/thirdParty/grabfood'

import OffscreenEditSectionPeriode from './offscreenEditSectionPeriode'
import moment from 'moment'
export default {
  name: 'GrabfoodResto',
  mixins: [basicComputedMixin],

  components: {
    OffscreenEditSectionPeriode
  },

  props: {
    dataGrabFoodId: {
      type: Number,
      default: null
    },
    isPause: {
      type: Number,
      default: 0
    }
  },

  watch: {
    isPause(isPause) {
      if(isPause) {
        this.openstore = isPause
      }
    }
  },

  data () {
    return {
      masterPeriod: [],
      dataPeriod: [],
      tempData: [],
      loading: false,
      visibleOffscreenEditSectionPeriode: false,
      dayEdit: {},
      openstore: 1,
      showDropdown: false,
      closeCase: [
        {
          id: 0,
          value: '30min',
          label: '30 Menit',
          close: true
        },
        {
          id: 1,
          value: '1h',
          label: '1 Jam',
          close: true
        },
        {
          id: 2,
          value: '24h',
          label: '24 Jam',
          close: true
        },
        {
          id: 3,
          value: '',
          label: '',
          close: true
        }
      ],
      masterDay: [
        {
          day: 1,
          times: []
        },
        {
          day: 2,
          times: []
        },{
          day: 3,
          times: []
        },{
          day: 4,
          times: []
        },
        {
          day: 5,
          times: []
        },
        {
          day: 6,
          times: []
        },
        {
          day: 7,
          times: []
        }
      ],
      grabfoodData: {},
      is_pause: 0
    }
  },

  mounted() {
    this.handleGetGrabfoodStore()
    this.getDataPeriod()
  },

  computed: {
    dataPer () {
      // let data = [ ...this.masterPeriod]
      let data = [ ...this.tempData]
      data.map(i => {
        i.checked = false
        // i.fday = this.rootLang['label_day_' + (i.day)]
        // if (this.tempData.length > 0) {
          // this.tempData.map(j => {
            if (i.period_type === 1) {
              i.checked = true
              // i.times = j.times
            }
          // })
        // }
      })
      return data
    },

    generateTimer() {
      // let countStart = new Date(this.grabfoodData.pause_start_date)
      let countStart = moment(this.grabfoodData.pause_start_date)
      // let countEnd = moment(countStart).add(1, 'days')
      let countEnd = ''
      if (this.grabfoodData.duration_pause === '30min') {
        // countEnd = new Date(countStart.getTime() + 30 * 60 * 1000)
        countEnd = moment(countStart).add(30, 'minutes')
      } else if (this.grabfoodData.duration_pause === '1h') {
        // countEnd = new Date(countStart.getTime() + 60 * 60 * 1000)
        countEnd = moment(countStart).add(1, 'hours')
      } else if (this.grabfoodData.duration_pause === '24h') {
        // countEnd = new Date(countStart.getTime() + 60 * 60 * 24 * 1000)
        countEnd = moment(countStart).add(1, 'days')
      }
      return { countStart, countEnd}
    },
  },

  methods: {
    async getMasterPeriod() {
      this.loading = true
      this.masterPeriod = []
      await getGrabPeriod({
        sort_column: 'id',
        sort_type: 'asc'
      }).then(response => {
        this.loading = false
        this.masterPeriod = response.data.data
      }).catch(error => {
        this.masterPeriod = []
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loading = false
      })
    },

    async getDataPeriod() {
      this.loading = true
      this.dataPeriod = []
      this.tempData = []
      await getDataPeriod({
        sort_column: 'id',
        sort_type: 'asc'
      }).then(response => {
        this.loading = false
        this.dataPeriod = response.data.data
        this.tempData = response.data.data
      }).catch(error => {
        this.dataPeriod = []
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loading = false
      })
    },

    handleCheck (data) {
      // console.log(data)
      let temp = {}
      this.tempData.map(i => {
        if (i.day === data.day) {
          i.checked = !i.checked
          i.period_type = data.period_type === 1? 0 : 1
          temp = {
            id: i.id,
            period_type: i.period_type,
            day: i.day,
            times: []
          }
        }
      })
      this.handleSavePeriod(temp)
      // const exist = this.tempData.some(({id}) => id === data.id)
      // if (exist) {
      //   this.tempData.map((i, idx) => {
      //     if (i.id === data.id) {
      //       this.tempData.splice(idx, 1)
      //     }
      //   })
      // } else {
      //   this.tempData.push(data)
      // }
    },

    getLabelDayTime(itemKey) {
      if (itemKey.times !== null && itemKey.times.length >= 1) {
        console.log('kl', itemKey.fday)
        if (itemKey.times.length > 1) {
          return itemKey.times[0].fstart_time + '<span class="color-primary"> ••• </span>' + itemKey.times[itemKey.times.length - 1].fend_time
        } else if (itemKey.times.length === 1) {
          return itemKey.times[0].fstart_time + ' - ' + itemKey.times[0].fend_time
        } else if (itemKey.times.length === 0) {
          return 0
        }
      } else {
        return 0
      }
    },

    handleEditDay (data) {
      if (data.times.length) {
        data.times.map(i => {
          i.timer = [moment(this.getTime(i).start), moment(this.getTime(i).end)]
        })
      }
      this.dayEdit = { ...data}
      this.visibleOffscreenEditSectionPeriode = true
    },

    getTime (data) {
      let day = moment().format('YYYY-MM-DD')
      let time = {
        start: moment(day + ' ' + data.start_time),
        end: moment(day + ' ' + data.end_time)
      }
      return time
    },

    handleSwitch (data) {
      this.showDropdown = data === 0? false : true
      if (data === 0) {
        this.$confirm('Apakah Anda yakin membuka restoran?', '', {
          confirmButtonText: 'Ya, buka sekarang',
          cancelButtonText: this.lang.cancel,
          showClose: false,
          type: ''
        }).then(() => {
          // console.log('trace', index)
          this.handleCloseStore({
            close: false,
            value: ''
          })
        }).catch((error) => {
          console.log(error)
          // this.grabfoodData.isPause = this.grabfoodData.isPause === 1? 0 : 1
          this.is_pause = this.is_pause === 1? 0 : 1
          // this.loadingCategory = false
        })
      }
    },

    async autoOpenStore () {
      if (this.grabfoodData.isPause === 1 && this.grabfoodData.duration_pause) {
        this.loading = true
        let cls = {
          store_grabfood_id: this.dataGrabFoodId,
          is_pause: 0
        }
        await temporarilyClosed(cls).then(response => {
          this.loading = false
          this.isPause = response.data.data.isPause
          this.openstore = response.data.data.isPause
          this.showDropdown = false
          this.getDataPeriod()
          this.handleGetGrabfoodStore()
        }).catch(error => {
          this.$message({
            type: 'error',
            message: error.string
          })
          this.showDropdown = false
          this.loading = false
          this.grabfoodData.isPause = this.grabfoodData.isPause === 1? 0 : 1
        })
      }
    },

    async handleCloseStore (data) {
      this.loading = true
      let cls = {
        store_grabfood_id: this.dataGrabFoodId,
        is_pause: data.close ? 1 : 0,
        duration_pause: data.value
      }
      await temporarilyClosed(cls).then(response => {
        this.loading = false
        this.isPause = response.data.data.isPause
        this.openstore = response.data.data.isPause
        this.showDropdown = false
        this.getDataPeriod()
        this.handleGetGrabfoodStore()
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.showDropdown = false
        this.loading = false
        this.grabfoodData.isPause = this.grabfoodData.isPause === 1? 0 : 1
      })
    },

    async handleSavePeriod(data) {
      console.log('data', data)
      this.loading = true
      let period = {
        store_grabfood_id: this.dataGrabFoodId,
        periods: [{
          day: data.day,
          type: data.period_type,
          days: []
        }]
      }
      if (data.times.length) {
        data.times.map(i => {
          period.periods[0].days.push({
            id: i.time_id,
            start_time: i.start_time,
            end_time: i.end_time
          })
        })
      }
      await updatePeriods(period).then(response => {
        this.loading = false
        this.visibleOffscreenEditSectionPeriode = false
        this.getDataPeriod()
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loading = false
      })
    },

    async handleGetGrabfoodStore(data) {
      this.loading = true
      await fetchGrabfoodStore().then(response => {
        if (response.data.data.group_menu.length) {
          this.grabfoodData = { ...response.data.data}
          this.is_pause = this.grabfoodData.isPause
        } else {
          // this.$router.push('/service-activation-v2')
        }
        this.loading = false
      }).catch(() => {
        this.grabfoodData = {}
        this.loading = false
      })
    },
  }
}
</script>