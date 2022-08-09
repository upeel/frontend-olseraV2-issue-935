<template>
  <div
    v-if="show"
    class="attendance-history attendance-mobile-wrapper--block color-body p-40">
    <div class="color-body font-40 mb-24 font-bold">
      Riwayat Absen Terakhir
    </div>
    <div
      v-if="data && data.data_absent_by_dates.length"
      class="like-table-wrapper">
      <div
      v-for="(item, key) in data.data_absent_by_dates"
      :key="key"
      class="like-table-wrapper--item flex-container">
        <div class="font-18 font-bold" style="width: 80%">
          <div class="font-bold">{{ item.day_name }}</div>
          {{ item.selected_date }}
        </div>

        <div v-if="item.presence.length" class="full-width text-right">
          <el-button
            v-for="(itempresence, key) in item.presence" :key="key"
            size="mini"
            :class="getDurationLabel(itempresence).class_name"
            class="radius-5">
            <div class="flex-container">
              <div>
                <svg-icon v-if="getDurationLabel(itempresence).icon !== 0" :icon-class="getDurationLabel(itempresence).icon === 1 ? 'attendance-come-ico' : 'attendance-success-ico'" class="font-20" style="margin-right: 5px" />
              </div>
              <div>
                {{ getDurationLabel(itempresence).label }}
              </div>
            </div>
          </el-button>
        </div>
        <div v-else class="text-right full-width">
          <el-button
            size="mini"
            class="radius-5 btn-info">
            Belum Absen
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const moment = require('moment')
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: null
    }
  },

  methods: {
    getDurationLabel(item) {
      if (!item.time_going && item.time_coming) {
        return {
          class_name: 'absent-success',
          icon: 1,
          label: item.time_coming
        }
      } else if (!item.time_going && !item.time_coming) {
        return {
          class_name: '',
          icon: 0,
          label: 'Belum absen'
        }
      } else if (item.time_going && item.time_coming) {
        const coming = new moment(item.time_coming, 'HH:mm')
        const going = new moment(item.time_going, 'HH:mm')
        const duration = moment.duration(going.diff(coming))
        return {
          class_name: 'absent-finished',
          icon: 2,
          label: parseFloat(duration.as('hours')).toFixed(2) + ' jam'
        }
      }
    }
  }
}
</script>
