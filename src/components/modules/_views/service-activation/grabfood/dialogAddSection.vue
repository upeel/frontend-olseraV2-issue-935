<template>
  <el-dialog
    :visible.sync="show"
    :show-close="false"
    :close-on-press-escape="false"
    :before-close="handleCancel"
    append-to-body
    custom-class="dialog-grbfd">
    <div slot="title" class="flex-container">
      <h4 class="dialog-title full-width">
        {{ lang.add }} Section
      </h4>
      <div class="btn_save_dialog full-width text-right">
        <el-button type="info" @click="handleCancel">{{ lang.cancel }}</el-button>
        <el-button :loading="loadingSaveItem" :disabled="disableSave" type="success" @click="handleSaveItem" >{{ lang.save }}</el-button>
      </div>
    </div>
    <div class="wizard-content">
      <el-form
        :model="formSection"
        label-position="top">
        <el-form-item
          prop="name"
          label="Nama Section">
          <el-input
            v-model="formSection.name"
          />
        </el-form-item>

        <el-form-item
          prop="days"
          label="Jam Layanan">
          <!-- <el-checkbox-group
            v-model="formSection.selected_days"
            class="checkbox-group-block checkbox-group-block--leftcheck checkbox-group-block--background"> -->
            <!-- <div
              v-for="item in 7"
              :key="item"
              class="flex-container">
              <div class="full-width">
                {{ rootLang['label_day_' + (item)] }}
              </div>
              <div class="full-width text-right">
                <el-button
                  type="text"
                  class="edit"
                  @click.native.stop="handleEditItem(item)">
                  <span v-if="getLabelDayTime(item - 1) !== 0" class="color-black">{{ getLabelDayTime(item - 1) }}</span>
                  <el-tag v-else type="info" effect="plain" size="mini" style="background-color: transparent">Tidak aktif</el-tag>
                  <svg-icon icon-class="edit-2" />
                </el-button>
              </div>
            </div> -->
          <!-- </el-checkbox-group> -->
          <div
            class="like-table-wrapper--item"
            style="height: 56px"
            v-for="item in dataPer"
            :key="item.day"
            :label="item">
            <div class="p-8">{{ item.fday }}</div>
            <div class="mt-8 full-width text-right flex-container" style="justify-content: flex-end">
              <div v-for="period in item.times" :key="period.time_id" type="text" class="flex-container pointer" @click="handleCheckedPeriod(period)">
                <div :class="period.checked ? 'color-primary--soft--bg radius-5 mr-4 p-2' : 'mr-4 radius-5 p-2'">
                  <span class="color-black">{{ period.fstart_time }} - {{ period.fend_time}}</span>
                  <el-checkbox v-model="period.checked"  />
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <offscreen-edit-section-periode
      :show="visibleOffscreenEditSectionPeriode"
      :form-edit="formEditSectionPeriode"
      :createSection="true"
      @cancel="visibleOffscreenEditSectionPeriode = false"
      @save="handleSavePeriod"
    />

  </el-dialog>
</template>
<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import OffscreenEditSectionPeriode from './offscreenEditSectionPeriode'
export default {
  name: 'dialogAddSection',
  mixins: [basicComputedMixin],

  components: {
    OffscreenEditSectionPeriode
  },

  props: {
    show: {
      type: Boolean,
      default: false
    },
    formData: {
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
      visibleOffscreenEditSectionPeriode: false,
      formSection: {
        name: '',
        selected_days: [0,1,2,3,4,5,6],
        days: []
      },
      loadingSaveItem: false,
      formEditSectionPeriode: {},
      tempData: []
    }
  },

  mounted() {
    this.refreshData()
  },

  watch: {
    show(show) {
      if (show) {
        let data = []
        this.dataPeriods.map(i => {
          if (i.period_type === 1) {
            data.push(i)
          }
        })
        if (data.length) {
          data.map(j => {
            if (j.times.length) {
              j.times.map(i => { this.tempData.push(i) })
            }
          })
          // this.tempData = data.filter((v,i,a)=>a.findIndex(t=>(t.time_id === v.time_id))===i)
        }
      }
    }
  },

  computed: {
    disableSave () {
      if (this.tempData.length && this.formSection.name) {
        return false
      } else {
        return true
      }
    },

    dataPer () {
      console.log('dat', data)
      let data = []
      this.dataPeriods.map(i => {
        if (i.period_type === 1) {
          data.push(i)
        }
      })
      
      data.map(i => {
        if (i.times !== null && i.times.length) {
          i.times.map(j => {
            j.checked = false
            // this.tempData.push(j)
            if (this.tempData.length) {
              this.tempData.map(k => {
                if (j.time_id === k.time_id) {
                  j.checked = true
                }
              })
            }
          })
        }
      })
      return data
    },
  },

  methods: {
    async handleEditItem(index) {
      let day = []
      if (this.formSection.days && this.formSection.days.length) {
        day = await this.formSection.days.filter(day => {
          return day.day_id === index
        })
      }
      if (day.length) {
        this.formEditSectionPeriode = await { ...day[0] }
      } else {
        this.formEditSectionPeriode = {
          day_id: index,
          id: null
        }
      }
      this.visibleOffscreenEditSectionPeriode = true
    },

    getLabelDayTime(itemKey) {
      // if (this.formData && this.formData.days && this.formData.days.length) {
      //   const day = this.formData.days.filter(day => {
      //     return day.day_id === itemKey
      //   })
      //   if (day.length >= 1) {
      //     if (day[0].times.length > 1) {
      //       return day[0].times[0].start_time + ' ... ' + day[0].times[day[0].times.length - 1].end_time
      //     } else {
      //       console.log('trace', day)
      //       return day[0].times[0].start_time + ' - ' + day[0].times[0].end_time
      //     }
      //   }
      // }
      const daysKey = this.formSection.days[itemKey]
      if (daysKey && daysKey.day_ids && daysKey.day_ids.length) {
        const dayIds = this.formSection.days[itemKey].day_ids
        if (dayIds.length > 1) {
          return dayIds[0].start_time + ' ... ' + dayIds[dayIds.length - 1].end_time
        } else {
          return dayIds[0].start_time + ' - ' + dayIds[0].end_time
        }
      } else if (daysKey && daysKey.day_ids && daysKey.day_ids.length === 0) {
        return 0
      }
    },

    handleSavePeriod (data) {
      console.log('trace', data)
      this.formSection.days = this.formSection.days.map(item => {
        if (item.day_id === data.day_id) {
          item = data
        }
        return item
      })
      this.visibleOffscreenEditSectionPeriode = false
    },

    handleSaveItem () {
      let days = []
      // // this.formSection.selected_days.map(i => {
      //   this.formSection.days.map(j => {
      //     // if (i === j.day_id) {
      //       days.push(j)
      //     // }
      //   })
      // // })
      if (this.tempData.length) {
        this.tempData.map(i => { days.push(i.time_id) })
      }
      let data = {
        name: this.formSection.name,
        periods: days
      }

      this.$emit('save', data)
    },

    handleCancel () {
      this.refreshData()
      this.$emit('close')
    },

    refreshData () {
      this.formSection = {
        name: '',
        selected_days: [0,1,2,3,4,5,6],
        days: []
      }
      for (let index = 0; index <= 6; index++) {
        this.formSection.days.push({
          day_id: index + 1,
          day_ids: [
            {
              start_time: '08:00',
              end_time: '20:00'
            }
          ]
        })
      }
    },

    handleCheckedPeriod (data) {
      const exist = this.tempData.some(({time_id}) => time_id === data.time_id)
      if (exist) {
        this.tempData.map((i, idx) => {
          if (i.time_id === data.time_id) {
            this.tempData.splice(idx, 1)
          }
        })
      } else {
        this.tempData.push(data)
      }
      // this.handleSavePeriod(data)
      
      this.$forceUpdate()
    },
  }
}
</script>
