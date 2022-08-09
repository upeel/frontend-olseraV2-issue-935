<template>
  <div class="flex-container no-flex-sm">
    <div class="wizard-desc">
      <h3>Section</h3>
      <p>Section adalah jam layanan untuk suatu item. Misalnya pedagang memiliki item yang hanya tersedia untuk sarapan, item tersebut dapat dikelompokkan di section Menu Sarapan. Jadi item tersebut hanya tersedia untuk dipesan selama jangka waktu sarapan. Anda dapat menambah beberapa section pada Ubah Menu nanti, sekarang buat satu dahulu.</p>
      <div class="text-center mb-12">
        <img src="/static/img/service-activation/grabfood-1.png">
      </div>
      <p class="font-12">
        * Nama section tidak dapat dilihat oleh pelanggan, hanya untuk keperluan pedagang.
      </p>
    </div>
    <div class="wizard-content">
      <el-form
        :model="formData"
        label-position="top">
        <el-form-item
          prop="name"
          label="Nama Section">
          <el-input
            v-model="formData.name"
          />
        </el-form-item>

        <el-form-item
          prop="days"
          label="Jam Layanan">
            <div
              class="like-table-wrapper--item"
              style="height: 56px"
              v-for="item in dataPeriod"
              :key="item.day"
              :label="item">
              <div class="p-8">{{ item.fday }}</div>
              <div class="mt-8 full-width text-right flex-container" style="justify-content: flex-end">
                <div v-for="period in item.times" :key="period.time_id" type="text" class="flex-container" @click="handleCheckedPeriod(period)">
                  <div :class="period.checked ? 'color-primary--soft--bg radius-5 mr-4 p-2' : 'mr-4 radius-5 p-2'">
                    <span class="color-black">{{ period.fstart_time }} - {{ period.fend_time}}</span>
                    <el-checkbox v-model="period.checked" @change="handleCheckedPeriod(period)" />
                  </div>
                </div>
              </div>
            </div>
        </el-form-item>

        <el-form-item>
          <el-button
            :disabled="disableNext"
            type="success"
            class="btn-block"
            @click="submit">
            {{ rootLang.next }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- edit item -->
    <!-- <transition name="el-zoom-in-center">
      <div
        v-if="visibleEditItem"
        class="offscreen-right-sidebar">
        <div class="offscreen-right-sidebar--wrapper">
          <div class="offscreen-right-sidebar--header text-left">
            Ubah Periode
            <close-esc @close="visibleEditItem = false" />
          </div>

          <div class="font-18 font-semi-bold mb-16">
            {{ rootLang['label_day_' + (formEdit.day_id)] }}
          </div>

          <div v-if="!formEdit.day_ids.length" class="color-grey--soft--bg flex-container radius-10 mb-24 p-8">
            <div class="container-icon">
              <svg-icon icon-class="information-circle" class="color-grey"></svg-icon>
            </div>
            <div class="p-8 font-14">
              Section ini tidak aktif pada hari {{ rootLang['label_day_' + (formEdit.day_id)] }}
            </div>
          </div>

          <el-form
            :model="formEdit"
            label-position="top">
            <div
              v-for="(item, key) in formEdit.day_ids"
              :key="key"
              class="flex-container mb-16">
              <el-form-item
                :label="lang.start_time"
                class="m-null">
                <el-time-select
                  v-model="item.start_time"
                  :picker-options="{ ...timePickerOptions, minTime: getMinTime(key)}"
                  :clearable="false"
                  class="mr-8"
                />
              </el-form-item>
              <el-form-item
                :label="lang.end_time"
                class="m-null"
                style="flex-grow:">
                <el-time-select
                  v-model="item.end_time"
                  :picker-options="{ ...timePickerOptions, minTime: item.start_time }"
                  :clearable="false"
                  class="mr-8"
                  @change="handleChangeTime(item, key)"
                />
              </el-form-item>
              <el-form-item
                class="m-null">
                <el-button
                  type="text"
                  class="color-info p-null"
                  @click="handleRemoteDayId(key)">
                  <svg-icon icon-class="x" />
                </el-button>
              </el-form-item>
            </div>

            <el-form-item>
              <el-button
                v-if="formEdit.day_ids.length < 2"
                type="info"
                class="btn-block"
                @click="handleAddDayIds">
                Add Period
              </el-button>
            </el-form-item>
          </el-form>

          <div class="offscreen-right-sidebar--footer">
            <el-button
              type="primary"
              class="btn-block"
              @click="handleSaveEditItem">
              {{ lang.save }}
            </el-button>
          </div>
        </div>
      </div>
    </transition> -->
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import CloseEsc from '@/components/modules/CloseEsc'
const moment = require('moment')

export default {
  components: {
    CloseEsc
  },

  mixins: [basicComputedMixin],

  props: {
    setupData: {
      type: Object,
      default: null
    },
    dataPeriods: {
      type: Array,
      default: []
    }
  },

  data() {
    return {
      visibleEditItem: false,
      formEdit: {},
      formData: { 
        name: '',
        periods: []
      },
      timePickerOptions: {
        start: '00:00',
        step: '00:15',
        end: '23:59'
      },
      tempPeriods: []
    }
  },

  watch: {
    // setupData(setupData) {
    //   this.formData = { ...setupData}
    // }
  },

  computed: {
    disableNext() {
      if (this.tempPeriods.length > 0 && this.formData.name) {
        return false
      } else {
        return true
      }
    },

    dataPeriod () {
      let data = []
       this.dataPeriods.map(i => {
        if (i.period_type === 1 && i.times !== null) {
          i.times.map( j => {
            j.checked = false
            if (this.tempPeriods.length) {
              this.tempPeriods.map(k => {
                if (j.time_id === k.time_id) {
                  j.checked = true
                }
              })
            }
          })
          data.push(i)
        }
      })
      return data
    }
  },

  mounted() {
    // console.log('aa')
    // for (let index = 0; index <= 6; index++) {
    //   this.formData.days.push({
    //     day_id: index + 1,
    //     day_ids: [
    //       {
    //         start_time: '08:00',
    //         end_time: '20:00'
    //       }
    //     ]
    //   })
    // }
  },

  methods: {
    async handleEditItem(index) {
      console.log(index)
      this.formEdit = await { ...this.formData.days[index] }
      this.formEdit.day_ids = []
      if (this.formData.days[index].day_ids.length) {
        await this.formData.days[index].day_ids.map(day => {
          this.formEdit.day_ids.push({ ...day })
        })
      }
      this.visibleEditItem = true
    },

    handleAddDayIds() {
      if (this.formEdit.day_ids.length) {
        const lastEndTime = this.formEdit.day_ids[this.formEdit.day_ids.length - 1].end_time
        this.formEdit.day_ids.push({
          start_time: moment(lastEndTime, 'HH:mm').add(15, 'minutes').format('HH:mm'),
          end_time: ''
        })
      } else {
        this.formEdit.day_ids.push({
          start_time: '08:00',
          end_time: '20:00'
        })
      }
    },

    getMinTime(key) {
      if (key) {
        const lastEndTime = this.formEdit.day_ids[key - 1].end_time
        if (lastEndTime) return moment(lastEndTime, 'HH:mm').subtract(15, 'minutes').format('HH:mm')
      } else {
        return null
      }
    },

    getLabelDayTime(itemKey) {
      const daysKey = this.formData.days[itemKey]
      // console.log('trac', daysKey.day_ids.length)
      if (daysKey && daysKey.day_ids && daysKey.day_ids.length === 0) {
        return 0
      } else if (daysKey && daysKey.day_ids && daysKey.day_ids.length) {
        const dayIds = this.formData.days[itemKey].day_ids
        if (dayIds.length > 1) {
          return dayIds[0].start_time + ' ... ' + dayIds[dayIds.length - 1].end_time
        } else if (dayIds.length === 1) {
          return dayIds[0].start_time + ' - ' + dayIds[0].end_time
        }
      }
    },

    handleRemoteDayId(index) {
      this.formEdit.day_ids.splice(index, 1)
    },

    handleSaveEditItem() {
      this.formData.days = this.formData.days.map(item => {
        if (item.day_id === this.formEdit.day_id) {
          item = this.formEdit
        }
        return item
      })
      this.visibleEditItem = false
    },

    submit() {
      this.tempPeriods.map(i => {
        this.formData.periods.push(i.time_id)
      })
      this.$emit('submit', this.formData)
    },

    handleChangeTime (item, index) {
      if (this.formEdit.day_ids.length > index + 1) {
        // console.log(this.formData.times.length)
        // console.log(moment(item.end_time, 'HH:mm').add(15, 'minutes').format('HH:mm'))
        this.formEdit.day_ids[index + 1].start_time = moment(item.end_time, 'HH:mm').add(15, 'minutes').format('HH:mm')
      }
    },

    handleCheckedPeriod (data) {
      const exist = this.tempPeriods.some(({time_id}) => time_id === data.time_id)
      if (exist) {
        this.tempPeriods.map((i, idx) => {
          if (i.time_id === data.time_id) {
            this.tempPeriods.splice(idx, 1)
          }
        })
      } else {
        this.tempPeriods.push(data)
      }
      this.$forceUpdate()
    },

    getCheck (item) {
      if (item.checked) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>
