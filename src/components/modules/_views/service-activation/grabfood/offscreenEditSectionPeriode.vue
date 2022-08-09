<template>
  <transition name="el-zoom-in-center">
    <div
      v-if="show"
      class="offscreen-right-sidebar offscreen-right-sidebar--zindexplus">
      <div class="offscreen-right-sidebar--wrapper">
        <div class="offscreen-right-sidebar--header text-left">
          Ubah Periode
          <close-esc v-if="!hasDelete" :hideEsc="true" @close="$emit('cancel')" />
        </div>

        <div class="font-18 font-semi-bold mb-16">
          {{ rootLang['label_day_' + (formData.day_id)] }}
        </div>

        <div v-if="!formData.times.length" class="color-grey--soft--bg flex-container radius-10 mb-24 p-8">
          <div class="container-icon">
            <svg-icon icon-class="information-circle" class="color-grey"></svg-icon>
          </div>
          <div class="p-8 font-14">
            Section ini tidak aktif
          </div>
        </div>

        <el-form
          :model="formData"
          label-position="top">
          <div
            v-for="(item, key) in formData.times"
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
                  }" />
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
                @click="handleRemoveDayId(key, item.time_id)">
                <svg-icon icon-class="x" />
              </el-button>
            </el-form-item>
          </div>

          <el-form-item>
            <el-button
              v-if="formData.times.length < 3"
              type="info"
              class="btn-block"
              @click="handleAddPeriode">
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
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import CloseEsc from '@/components/modules/CloseEsc'
import { deletePeriod } from '@/api/thirdParty/grabfood'
const moment = require('moment')

export default {
  components: {
    CloseEsc
  },
  mixins: [basicComputedMixin],
  props: {
    show: {
      type: Boolean,
      default: false
    },
    formEdit: {
      type: Object,
      default: null
    },
    createSection: {
      type: Boolean,
      default: false
    },
    dataGrabFoodId: {
      type: Number,
      default: null
    },
  },

  data() {
    return {
      formData: {},
      timePickerOptions: {
        start: '00:00',
        step: '00:15',
        end: '23:59'
      },
      hasDelete: false
    }
  },

  watch: {
    formEdit(formEdit) {
      if (!this.createSection) {
        this.formData = {
          day_id: formEdit.day_id,
          id: formEdit.id,
          period_type: formEdit.period_type,
          day: formEdit.day,
          times: []
        }
        if (formEdit && formEdit.times && formEdit.times.length) {
          formEdit.times.map(time => {
            time.start_time = time.fstart_time
            time.end_time = time.fend_time
            this.formData.times.push({ ...time })
          })
        }
      } else if (this.createSection) {
        this.formData = {
          day_id: formEdit.day_id,
          times: []
        }
        if (formEdit && formEdit.day_ids && formEdit.day_ids.length) {
          formEdit.day_ids.map(time => {
            this.formData.times.push({ ...time })
          })
        }
      }
      console.log(this.formData)
    }
  },

  methods: {
    handleAddPeriode() {
      if (this.stageLevel !== 'dev' && this.stageLevel !== 'sit') {
        if (this.formData.times.length) {
          const lastEndTime = this.formData.times[this.formData.times.length - 1].end_time
          this.formData.times.push({
            // start_time: moment(lastEndTime, 'HH:mm').add(15, 'minutes').format('HH:mm'),
            start_time: moment(lastEndTime, 'HH:mm').add(0, 'minutes').format('HH:mm'),
            end_time: ''
          })
        } else {
          this.formData.times.push({
            start_time: '08:00',
            end_time: ''
          })
        }
      } else {
        if (this.formData.times.length) {
          let timer = [moment(this.formData.times[this.formData.times.length - 1].timer[1]).add(15, 'minutes'), moment(this.formData.times[this.formData.times.length - 1].timer[1]).add(30, 'minutes')]
          this.formData.times.push({
            timer: timer
          })
        }
      }
    },

    getMinTime(key) {
      if (this.stageLevel !== 'dev' && this.stageLevel !== 'sit') {
        if (key) {
          const lastEndTime = this.formData.times[key - 1].end_time
          if (lastEndTime) return moment(lastEndTime, 'HH:mm').subtract(15, 'minutes').format('HH:mm')
        } else {
          return null
        }
      } else {
        if (key === 0) {
          const lastStartTime = moment(this.formData.times[key].timer[0]).add(1, 'minutes').format('HH:mm:ss')
          let timer = {
            start: '00:00:00 - 23:59:00',
            end: lastStartTime + ' - 23:59:00'
          }
          return timer
        }
        if (key > 0) {
          const lastEndTime = moment(this.formData.times[key - 1].timer[1]).add(1, 'minutes').format('HH:mm:ss')
          const lastStartTime = moment(this.formData.times[key].timer[0]).add(1, 'minutes').format('HH:mm:ss')
          let timer = {
            start: lastEndTime + ' - 23:59:00',
            end: lastStartTime + ' - 23:59:00'
          }
          return timer
        }
      }
    },

    handleRemoveDayId(index, itemId) {
      if (itemId) {
        this.$confirm('This will permanently delete the data. Continue?', '', {
          confirmButtonText: this.rootLang.delete,
          cancelButtonText: this.lang.cancel,
          showClose: false,
          type: ''
        }).then(() => {
          // console.log('trace', index)
          if (!this.createSection) {
            let data = {
              id: itemId,
              store_grabfood_id: this.dataGrabFoodId
            }
            deletePeriod(data).then(async response => {
              // this.$emit('refresh')
              this.hasDelete = true
              this.formData.times.splice(index, 1)
            }).catch(error => {
              // this.loadingCategory = false
              this.$message({
                type: 'error',
                message: error.string
              })
            })
          } else {
            this.hasDelete = true
            this.formData.times.splice(index, 1)
          }
        }).catch((error) => {
          console.log(error)
          // this.loadingCategory = false
        })
      } else {
        this.formData.times.splice(index, 1)
      }
      // this.formData.times.splice(index, 1)
    },

    handleSaveEditItem() {
      if (this.createSection) {
        this.formData.day_ids = this.formData.times
        this.$delete(this.formData, 'times')
        this.$delete(this.formData, 'id')
      }
      if (this.stageLevel === 'dev' || this.stageLevel === 'sit') {
        if (this.formData.times.length) {
          this.formData.times.map(i => {
            i.start_time = moment(i.timer[0]).format('HH:mm')
            i.end_time = moment(i.timer[1]).format('HH:mm')
          })
        }
      }
      this.$emit('save', this.formData)
      this.hasDelete = false
    },

    handleChangeTime (item, index) {
      if (this.stageLevel !== 'dev' && this.stageLevel !== 'sit') {
        if (this.formData.times.length > index + 1) {
          this.formData.times[index + 1].start_time = moment(item.end_time, 'HH:mm').add(15, 'minutes').format('HH:mm')
        }
      } else {
        if (this.formData.times.length > index + 1) {
          if (moment(this.formData.times[index + 1].timer[0]).isBefore(moment(item.timer[1]).add(1, 'minutes'))) {
            this.formData.times[index + 1].timer[0] = moment(item.timer[1]).add(15, 'minutes')
          }
        }
        this.$forceUpdate()
      }
    }
  }
}
</script>
