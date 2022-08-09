<template>
  <div class="flex-container no-flex-sm" style="align-items: unset">
    <div class="wizard-desc">
      <h3>{{ rootLang.opening_hours }}</h3>
      <p>Atur Jam Buka sesuai dengan jam operasional Restoranmu. Jam Buka terdiri dari hari dan periode buka. Pada hari yang sama, Anda dapat menyediakan maksimal 3 periode, misalnya Senin dibagi 3 periode yaitu 09:00 - 12:00, 12:00 - 16:00, dan 16:00 - 19:00. Jam Buka akan digunakan juga sebagai acuan jam tayang promosi atau section menu. Pengaturan Jam Buka dan Tutup Sementara akan tersedia di menu Restoran.</p>
      <div class="text-center mb-12">
        <img src="/static/img/service-activation/grabfood-1.png">
      </div>
    </div>
    <div class="wizard-content">
      <el-form
        :model="formData"
        label-position="top">
        <h3>{{ selectedStore.name }}</h3>
        <el-form-item
          prop="days"
          label="Jam Layanan">
          <!-- <el-checkbox-group
            v-model="formData.selected_days"
            class="checkbox-group-block checkbox-group-block--leftcheck checkbox-group-block--background"> -->
            <!-- <template v-if="!update">
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
                    <span v-if="getLabelDayTime(item - 1) !== 0" class="color-black">{{ getLabelDayTime(item - 1) }}</span>
                    <el-tag v-else type="info" effect="plain" size="mini" style="background-color: transparent">Tutup</el-tag>
                    <svg-icon icon-class="edit-2" />
                  </el-button>
                </div>
              </div>
            </template> -->
            <template>
              <div
              class="like-table-wrapper--item"
              style="height: 56px"
              v-for="item in dataPeriods"
              :key="item.day"
              :label="item.fday">
              <el-checkbox v-model="item.checked" @change="handleCheckUpdate(item)" />
              <div class="p-8 full-width">{{ item.fday }}</div>
              <div class="full-width text-right">
                <el-button
                  type="text"
                  class="edit"
                  @click.native.stop="handleEditItemUpdate(item)">
                  <span v-if="item.checked" class="color-black" v-html="getLabelDayTimeUpdate(item)"></span>
                  <el-tag v-else type="info" effect="plain" size="mini" style="background-color: transparent">Tutup</el-tag>
                  <svg-icon icon-class="edit-2" />
                </el-button>
              </div>
            </div>
            </template>
            
          <!-- </el-checkbox-group> -->
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

    <!-- edit item update -->
    <transition name="el-zoom-in-center">
      <div
        v-if="visibleEditItemUpdate"
        class="offscreen-right-sidebar">
        <div class="offscreen-right-sidebar--wrapper">
          <div class="offscreen-right-sidebar--header text-left">
            Ubah Periode
            <close-esc @close="visibleEditItemUpdate = false" />
          </div>

          <div class="font-18 font-semi-bold mb-16">
            {{ formEdit.fday }}
          </div>

          <div v-if="!formEdit.times.length" class="color-grey--soft--bg flex-container radius-10 mb-24 p-8">
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
              v-for="(item, key) in formEdit.times"
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
                  @click="handleRemoteDayId(key, item.time_id)">
                  <svg-icon icon-class="x" />
                </el-button>
              </el-form-item>
            </div>

            <el-form-item>
              <el-button
                v-if="formEdit.times.length < 3"
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
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import CloseEsc from '@/components/modules/CloseEsc'
import { createPeriodGrab, updatePeriods, deletePeriod } from '@/api/thirdParty/grabfood'
const moment = require('moment')

export default {
  components: {
    CloseEsc
  },

  mixins: [basicComputedMixin],

  data() {
    return {
      visibleEditItem: false,
      formEdit: {},
      formData: {
        name: '',
        selected_days: [0,1,2,3,4,5,6],
        checkedDays: [true,true,true,true,true,true,true],
        days: []
      },
      timePickerOptions: {
        start: '00:00',
        step: '00:15',
        end: '23:59'
      },
      tempData: [],
      visibleEditItemUpdate: false
      // checkedDays: [true,true,true,true,true,true,true]
    }
  },

  props: {
    grabfoodData: {
      type: Object,
      default: null
    },
    update: {
      type: Boolean,
      default: false
    },
    dataPeriods: {
      type: Array,
      default: []
    },
  },

  computed: {
    disableNext() {
      let conc = []
      this.formData.checkedDays.map(i => { if (i) {conc.push(i)}})
      if (conc.length) {
        return false
      } else {
        return true
      }
    }
  },

  mounted() {
    for (let index = 0; index <= 6; index++) {
      this.formData.days.push({
        day_id: index + 1,
        day_ids: [
          {
            start_time: '08:00',
            end_time: '20:00'
            // end_time: '12:00'
          }
        ]
      })
    }
  },

  watch: {
    // dataPeriods(dataPeriods) {
    //   dataPeriods.map(i => {
    //     if (i.period_type === 1) {
    //       this.tempData.push(i)
    //     }
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

    handleEditItemUpdate(item) {
      let dayNow = moment().format('YYYY MM DD')
      this.formEdit = { ...item }
      // if (this.formEdit.times.length) {
      //   let tmn = []
      //   this.formEdit.times.map(i => {
      //     tmn.push({
      //       time_id: i.time_id,
      //       start_time: i.start_time,
      //       end_time: i.end_time,
      //       fstart_time: i.fstart_time,
      //       fend_time: i.fend_time,
      //       checked: i.checked,
      //       timer: [moment(dayNow + ' ' + i.start_time), moment(dayNow + ' ' + i.end_time)]
      //     })
      //   })
      //   this.formEdit.times = [ ...tmn]
      // }
      this.visibleEditItemUpdate = true
    },

    handleAddDayIds() {
      if (this.stageLevel !== 'dev' && this.stageLevel !== 'sit') {
        if (this.formEdit.times.length) {
          const lastEndTime = this.formEdit.times[this.formEdit.times.length - 1].end_time
          this.formEdit.times.push({
            start_time: moment(lastEndTime, 'HH:mm').add(15, 'minutes').format('HH:mm'),
            end_time: ''
          })
        } else {
          this.formEdit.times.push({
            start_time: '08:00',
            end_time: '20:00'
          })
        }
      } else {
        if (this.formEdit.times.length) {
          let timer = [moment(this.formEdit.times[this.formEdit.times.length - 1].timer[1]).add(15, 'minutes'), moment(this.formEdit.times[this.formEdit.times.length - 1].timer[1]).add(30, 'minutes')]
          this.formEdit.times.push({
            timer: timer
          })
        } else {
          let dayNow = moment().format('YYYY MM DD')
          let timer = [moment(dayNow + ' 00:00:00'), moment(dayNow + ' 23:59:00')]
          this.formEdit.times.push({
            timer: timer
          })
        }
      }
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
          const lastStartTime = moment(this.formEdit.times[key].timer[0]).add(1, 'minutes').format('HH:mm:ss')
          let timer = {
            start: '00:00:00 - 23:59:00',
            end: lastStartTime + ' - 23:59:00'
          }
          return timer
        }
        if (key > 0) {
          const lastEndTime = moment(this.formEdit.times[key - 1].timer[1]).add(1, 'minutes').format('HH:mm:ss')
          const lastStartTime = moment(this.formEdit.times[key].timer[0]).add(1, 'minutes').format('HH:mm:ss')
          let timer = {
            start: lastEndTime + ' - 23:59:00',
            end: lastStartTime + ' - 23:59:00'
          }
          return timer
        }
      }
    },

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
          if (dayIds.length > 1) {
            return dayIds[0].start_time + ' ... ' + dayIds[dayIds.length - 1].end_time
          } else if (dayIds.length === 1) {
            return dayIds[0].start_time + ' - ' + dayIds[0].end_time
          }
        }
      }
    },

    getLabelDayTimeUpdate(itemKey) {
      if (itemKey.times !== null && itemKey.times.length >= 1) {
        if (this.stageLevel !== 'dev' && this.stageLevel !== 'sit') {
          if (itemKey.times.length > 1) {
            return itemKey.times[0].start_time + '<span class="color-primary"> ••• </span>' + itemKey.times[itemKey.times.length - 1].end_time
          } else if (itemKey.times.length === 1) {
            return itemKey.times[0].start_time + ' - ' + itemKey.times[0].end_time
          } else if (itemKey.times.length === 0) {
            return 0
          }
        } else {
          if (itemKey.times.length > 1) {
            return moment(itemKey.times[0].timer[0]).format('HH:mm') + '<span class="color-primary"> ••• </span>' + moment(itemKey.times[itemKey.times.length - 1].timer[1]).format('HH:mm')
          } else if (itemKey.times.length === 1) {
            return moment(itemKey.times[0].timer[0]).format('HH:mm') + ' - ' + moment(itemKey.times[0].timer[1]).format('HH:mm')
          } else if (itemKey.times.length === 0) {
            return 0
          }
        }
      }
    },

    handleRemoteDayId(index, itemId) {
      if (!this.update && !itemId) { this.formEdit.day_ids.splice(index, 1) }
      else if (this.update && !itemId) { this.formEdit.times.splice(index, 1) }
      else if (this.update && itemId) {
        this.$confirm('This will permanently delete the data. Continue?', '', {
          confirmButtonText: this.rootLang.delete,
          cancelButtonText: this.lang.cancel,
          showClose: false,
          type: ''
        }).then(() => {
          // console.log('trace', index)
          let data = {
            id: itemId,
            store_grabfood_id: this.grabfoodData.id
          }
          deletePeriod(data).then(async response => {
            // this.$emit('refresh')
            // this.hasDelete = true
            this.formEdit.times.splice(index, 1)
          }).catch(error => {
            // this.loadingCategory = false
            this.$message({
              type: 'error',
              message: error.string
            })
          })
        }).catch((error) => {
          console.log(error)
          // this.loadingCategory = false
        })
      }
      
    },

    handleSaveEditItem() {
      this.dataPeriods.map(i => {
        if (i.day === this.formEdit.day) {
          if (this.formEdit.times.length >= 1) { i.checked = true }
          if (this.formEdit.times.length === 0) { i.checked = false }
        }
      })
      this.visibleEditItemUpdate = false
      
    },

    submit() {
      if (this.stageLevel === 'dev' || this.stageLevel === 'sit') {
        this.dataPeriods.map(i => {
          if (i.times.length) {
            i.times.map(j => {
              j.start_time = moment(j.timer[0]).format('HH:mm')
              j.end_time = moment(j.timer[1]).format('HH:mm')
            })
          }
        })
        this.updatePeriod()
      } else {
        this.updatePeriod()
      }
      //  : this.createPeriod()
      // this.$emit('submit', this.formData)
    },

    handleChangeTime (item, index) {
      console.log('ddd')
      if (this.stageLevel !== 'dev' && this.stageLevel !== 'sit') {
        if (this.formEdit.day_ids.length > index + 1) {
          this.formEdit.day_ids[index + 1].start_time = moment(item.end_time, 'HH:mm').add(15, 'minutes').format('HH:mm')
        }
      } else {
        if (this.formEdit.times.length > index + 1) {
          if (moment(this.formEdit.times[index + 1].timer[0]).isBefore(moment(item.timer[1]).add(1, 'minutes'))) {
            this.formEdit.times[index + 1].timer[0] = moment(item.timer[1]).add(15, 'minutes')
          }
        }
        this.$forceUpdate()
      }
    },

    handleCheck (data) {
      console.log('da', this.formData.checkedDays[data - 1])
      if (this.formData.checkedDays[data - 1] && this.formData.days[data - 1].day_ids.length === 0) {
        this.formData.days[data - 1].day_ids.push({
          start_time: '08:00',
          end_time: '20:00'
        })
      }
    },

    handleCheckUpdate (data) {
      const exist = this.tempData.some(({day}) => day === data.day)
      if (exist) {
        this.tempData.map((i, idx) => {
          if (i.day === data.day) {
            this.tempData.splice(idx, 1)
          }
        })
      } else {
        this.tempData.push(data)
      }
      this.$forceUpdate()
    },

    async createPeriod () {
      let periods = []
      this.formData.checkedDays.map((i, idx) => {
        if (i) {
          periods.push({
            day: this.formData.days[idx].day_id,
            type: 1,
            days: [ ...this.formData.days[idx].day_ids]
          })
        } else {
          periods.push({
            day: this.formData.days[idx].day_id,
            type: 0,
            days: [ ...this.formData.days[idx].day_ids]
          })
        }
      })
      await createPeriodGrab({
        store_grabfood_id: this.grabfoodData.id,
        periods: periods
      }).then(response => {
        // this.loadingSubmit = false
        this.$message({
          type: 'success',
          message: 'Saved'
        })
        this.$emit('submit', this.formData)
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        // this.loadingSubmit = false
      })
    },

    async updatePeriod () {
      let periods = []
      this.dataPeriods.map(i => {
        periods.push({
          day: i.day,
          type: i.checked ? 1 : 0,
          ddays: i.times
        })
      })
      periods.map(j => {
        j.days = []
        if (j.ddays.length) {
          j.ddays.map(k => {
            if (k.time_id) {
              j.days.push({
                id: k.time_id,
                start_time: k.start_time,
                end_time: k.end_time
              })
            } else {
              j.days.push({
                start_time: k.start_time,
                end_time: k.end_time
              })
            }
          })
        }
      })

      await updatePeriods({
        store_grabfood_id: this.grabfoodData.id,
        periods: periods
      }).then(response => {
        // this.loadingSubmit = false
        this.$message({
          type: 'success',
          message: 'Saved'
        })
        this.$emit('submit', this.formData)
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        // this.loadingSubmit = false
      })
    }
  }
}
</script>
