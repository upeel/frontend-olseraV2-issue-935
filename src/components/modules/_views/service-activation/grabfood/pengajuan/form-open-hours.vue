<template>
  <div class="flex-container no-flex-sm" style="height: 100%; align-items: unset">
    <div class="wizard-desc color-grabfood--bg">
      <div class="text-center mb-12">
        <img src="/static/img/service-activation/grab/Group 23064.png">
      </div>
    </div>
    <div class="wizard-content">
      <el-form
        :model="formData"
        label-position="top">
        <h3>{{ rootLang.opening_hours }}</h3>
        <el-form-item
          prop="days">
          <template>
            <div
              class="like-table-wrapper--item"
              style="height: 56px"
              v-for="item in 7"
              :key="item"
              :label="item">
              <el-checkbox v-model="formData.checkedDays[item - 1]" @change="handleCheck(item)" />
              <div class="p-8 full-width">{{ rootLang['label_day_' + (item)] }}</div>
              <div class="full-width text-right">
                <el-button
                  type="text"
                  class="edit"
                  @click.native.stop="handleEditItem(item - 1)">
                  <el-tag v-if="getLabelDayTime(item - 1) !== 0" class="color-black">{{ getLabelDayTime(item - 1) }}</el-tag>
                  <el-tag v-else type="info" effect="plain" size="mini" style="background-color: transparent">Tutup</el-tag>
                  <svg-icon icon-class="edit-2" />
                </el-button>
              </div>
            </div>
          </template>
        </el-form-item>

        <transition name="el-zoom-in-center">
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
                  <template v-if="stageLevel === 'dev' || stageLevel === 'sit'">
                    <el-form-item
                      :label="lang.start_time"
                      class="m-null full-width">
                      <el-time-picker
                        v-model="item.timer[0]"
                        :picker-options="{
                          format: 'HH:mm',
                          selectableRange: getMinTime(key).start
                        }"
                        :clearable="false" />
                    </el-form-item>
                    <el-form-item
                      :label="lang.end_time"
                      class="m-null full-width">
                      <el-time-picker
                        v-model="item.timer[1]"
                        :picker-options="{
                          format: 'HH:mm',
                          selectableRange: getMinTime(key).end
                        }"
                        :clearable="false"
                        @change="handleChangeTime(item, key)" />
                    </el-form-item>
                  </template>
                  <template v-else>
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
                  </template>
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
                    v-if="formEdit.day_ids.length < 3"
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
        </transition>

        <el-form-item>
          <el-button
            :disabled="disableNext"
            type="success"
            class="btn-block color-grabfood--bg color-white"
            @click="submit">
            {{ rootLang.next }} →
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
const moment = require('moment')
export default {
  name: 'FormOpenHours',

  mixins: [basicComputedMixin],

  data() {
    return {
      formData: {
        name: '',
        selected_days: [0,1,2,3,4,5,6],
        checkedDays: [true,true,true,true,true,true,true],
        days: []
      },
      formEdit: {},
      visibleEditItem: false,
      timePickerOptions: {
        start: '00:00',
        step: '00:15',
        end: '23:59'
      },
    }
  },

  computed: {
    disableNext () {
      let check = []
      this.formData.checkedDays.map(i => { if (i) { check.push(i) } })
      if (check.length) {
        return false
      } else {
        return true
      }
    }
  },

  mounted() {
    let dayNow = moment().format('YYYY MM DD')
    for (let index = 0; index <= 6; index++) {
      this.formData.days.push({
        day_id: index + 1,
        day_ids: [
          {
            start_time: '08:00',
            end_time: '20:00',
            // end_time: '12:00'
            timer: [moment(dayNow + ' 00:00:00'), moment(dayNow + ' 23:59:00')]
          }
        ]
      })
    }
  },

  methods: {
    getLabelDayTime(itemKey) {
      const daysKey = this.formData.days[itemKey]
      const isCheck = this.formData.checkedDays[itemKey]
      // console.log('trac', isCheck)
      if (!isCheck) {
        return 0
      } else {
        if ((daysKey && daysKey.day_ids && daysKey.day_ids.length === 0)) {
          this.formData.checkedDays[itemKey] = false
          return 0
        } else if (daysKey && daysKey.day_ids && daysKey.day_ids.length) {
          const dayIds = this.formData.days[itemKey].day_ids
          if (this.stageLevel !== 'dev' && this.stageLevel !== 'sit') {
            if (dayIds.length > 1) {
              return dayIds[0].start_time + ' ... ' + dayIds[dayIds.length - 1].end_time
            } else if (dayIds.length === 1) {
              return dayIds[0].start_time + ' - ' + dayIds[0].end_time
            }
          } else {
            if (dayIds.length > 1) {
              return moment(dayIds[0].timer[0]).format('HH:mm') + ' ... ' + moment(dayIds[dayIds.length - 1].timer[1]).format('HH:mm')
            } else if (dayIds.length === 1) {
              return moment(dayIds[0].timer[0]).format('HH:mm') + ' - ' + moment(dayIds[0].timer[1]).format('HH:mm')
            }
          }
        }
      }
      this.$forceUpdate()
    },

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

    getMinTime(key) {
      if (this.stageLevel !== 'dev' && this.stageLevel !== 'sit') {
        if (key && !this.update) {
          const lastEndTime = this.formEdit.day_ids[key - 1].end_time
          if (lastEndTime) return moment(lastEndTime, 'HH:mm').subtract(15, 'minutes').format('HH:mm')
        } else if (key && this.update) {
          const lastEndTime = this.formEdit.times[key - 1].end_time
          if (lastEndTime) return moment(lastEndTime, 'HH:mm').subtract(15, 'minutes').format('HH:mm')
        } else {
          return null
        }
      } else {
        if (key === 0) {
          const lastStartTime = moment(this.formEdit.day_ids[key].timer[0]).add(1, 'minutes').format('HH:mm:ss')
          let timer = {
            start: '00:00:00 - 23:59:00',
            end: lastStartTime + ' - 23:59:00'
          }
          return timer
        }
        if (key > 0) {
          const lastEndTime = moment(this.formEdit.day_ids[key - 1].timer[1]).add(1, 'minutes').format('HH:mm:ss')
          const lastStartTime = moment(this.formEdit.day_ids[key].timer[0]).add(1, 'minutes').format('HH:mm:ss')
          let timer = {
            start: lastEndTime + ' - 23:59:00',
            end: lastStartTime + ' - 23:59:00'
          }
          return timer
        }
      }
    },

    handleAddDayIds() {
      if (this.stageLevel !== 'dev' && this.stageLevel !== 'sit') {
        if (this.formEdit.day_ids.length) {
          if (!this.formEdit.day_ids[this.formEdit.day_ids.length - 1].end_time) {
            this.$message({
              type: 'error',
              message: this.rootLang.please_input_end_time
            })
          } else {
            const lastEndTime = this.formEdit.day_ids[this.formEdit.day_ids.length - 1].end_time
            this.formEdit.day_ids.push({
              start_time: moment(lastEndTime, 'HH:mm').add(15, 'minutes').format('HH:mm'),
              end_time: ''
            })
          }
        } else {
          this.formEdit.day_ids.push({
            start_time: '08:00',
            end_time: '20:00'
          })
        }
      } else {
        if (this.formEdit.day_ids.length) {
          let timer = [moment(this.formEdit.day_ids[this.formEdit.day_ids.length - 1].timer[1]).add(15, 'minutes'), moment(this.formEdit.day_ids[this.formEdit.day_ids.length - 1].timer[1]).add(30, 'minutes')]
          this.formEdit.day_ids.push({
            timer: timer
          })
        } else {
          let dayNow = moment().format('YYYY MM DD')
          let timer = [moment(dayNow + ' 00:00:00'), moment(dayNow + ' 23:59:00')]
          this.formEdit.day_ids.push({
            timer: timer
          })
        }
      }
    },

    handleRemoteDayId(index, itemId) {
      // if (!this.update && !itemId) { 
        this.formEdit.day_ids.splice(index, 1) 
      // }
      // else if (this.update && itemId) {
      //   this.$confirm('This will permanently delete the data. Continue?', '', {
      //     confirmButtonText: this.rootLang.delete,
      //     cancelButtonText: this.lang.cancel,
      //     showClose: false,
      //     type: ''
      //   }).then(() => {
      //     // console.log('trace', index)
      //     let data = {
      //       id: itemId,
      //       store_grabfood_id: this.grabfoodData.id
      //     }
      //     deletePeriod(data).then(async response => {
      //       // this.$emit('refresh')
      //       // this.hasDelete = true
      //       this.formEdit.times.splice(index, 1)
      //     }).catch(error => {
      //       // this.loadingCategory = false
      //       this.$message({
      //         type: 'error',
      //         message: error.string
      //       })
      //     })
      //   }).catch((error) => {
      //     console.log(error)
      //     // this.loadingCategory = false
      //   })
      // }
    },

    handleSaveEditItem() {
      this.formData.days = this.formData.days.map(item => {
        if (item.day_id === this.formEdit.day_id) {
          item = this.formEdit
        }
        if (this.formEdit.day_ids.length === 0) {
          this.formData.checkedDays[this.formEdit.day_id - 1] = false
        }
        return item
      })
      this.visibleEditItem = false
      this.$forceUpdate()
    },

    handleCheck(data) {
      this.$forceUpdate()
    },

    submit () {
      let periods = []
      this.formData.days.map((i, idx) => {
        if (this.stageLevel === 'dev' || this.stageLevel === 'sit') {
          i.day_ids.map(j => {
            j.start_time = moment(j.timer[0]).format('HH:mm')
            j.end_time = moment(j.timer[1]).format('HH:mm')
          })
        }
        i.type = this.formData.checkedDays[idx] ? 1 : 0
        periods.push({
          day: i.day_id,
          type: i.type,
          days: i.day_ids
        })
      })
      this.$emit('submit', periods)
    },

    refreshData () {
      let dayNow = moment().format('YYYY MM DD')
      this.formData = {
        name: '',
        selected_days: [0,1,2,3,4,5,6],
        checkedDays: [true,true,true,true,true,true,true],
        days: []
      }
      for (let index = 0; index <= 6; index++) {
        this.formData.days.push({
          day_id: index + 1,
          day_ids: [
            {
              start_time: '08:00',
              // end_time: '20:00'
              end_time: '12:00',
              timer: [moment(dayNow + ' 00:00:00'), moment(dayNow + ' 23:59:00')]
            }
          ]
        })
      }
    },

    setPeriodsFromBefore (periods) {
      let dayNow = moment().format('YYYY MM DD')
      this.formData.checkedDays = [false,false,false,false,false,false,false]
      periods.map( i => {
        this.formData.checkedDays[i.day - 1] = i.period_type === 0? false : true
        if (i.times.length) {
          this.formData.days.map(j => {
            if (i.day === j.day_id) {
              j.day_ids = []
              i.times.map( time => {
                j.day_ids.push({
                  start_time: time.fstart_time,
                  end_time: time.fend_time,
                  id: time.time_id,
                  timer: [moment(dayNow + ' ' + time.start_time), moment(dayNow + ' ' + time.end_time)]
                })
              })
            }
          })
        }
      })
    },

    handleChangeTime (item, index) {
      if (this.stageLevel !== 'dev' && this.stageLevel !== 'sit') {
        // if (this.formData.times.length > index + 1) {
        //   this.formData.times[index + 1].start_time = moment(item.end_time, 'HH:mm').add(15, 'minutes').format('HH:mm')
        // }
      } else {
        if (this.formEdit.day_ids.length > index + 1) {
          if (moment(this.formEdit.day_ids[index + 1].timer[0]).isBefore(moment(item.timer[1]).add(1, 'minutes'))) {
            this.formEdit.day_ids[index + 1].timer[0] = moment(item.timer[1]).add(15, 'minutes')
          }
        }
        this.$forceUpdate()
      }
    }
  }
}
</script>