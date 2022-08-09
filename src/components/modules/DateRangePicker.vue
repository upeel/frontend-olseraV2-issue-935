<template>
<div style="display: inline-block;">
  <div v-if="attendance" class="single-datepicker bg-f5 box-shadow" style="width: 300px; height: 36px">
    <el-button
      class="box-shadow-null"
      icon="el-icon-arrow-left"
      @click="handlePrevNextDate('prev')"
    />
    <div class="calender-input full-width">
      <date-range
        v-model="range"
        :options="useAllTime? dateRangePickerOptionsWitAllTime : dateRangePickerOptions"
        :type="'text'"
        :class-attend="block"
        :is-attendance="isAttendance"
        :all-time="allTime"
        :ddate="[sdate, edate]"
        @change="datePicked"
      />
    </div>
    <el-button
      class="box-shadow-null"
      icon="el-icon-arrow-right"
      @click="handlePrevNextDate('next')"
    />
  </div>
  <div v-else class="date-range-picker-wrapper">
    <date-range
      v-model="range"
      :disabled="disabled"
      :options="!customRangeOnly? dateRangePickerOptions : dateRangePickerOptionsCustomRangeOnly"
      :size="size"
      @change="datePicked"
    />
  </div>
</div>
</template>

<script>
var moment = require('moment')
import dateRange from 'components/modules/DateRangePicker2'
// const startDate = moment().add(-29, 'days').format('YYYY-MM-DD')
const startDate = moment().format('YYYY-MM-DD')
const endDate = moment().format('YYYY-MM-DD')

export default {
  props: ['size', 'initDate', 'attendance', 'disabled', 'allTime', 'customRangeOnly', 'useAllTime'],

  components: {
    dateRange
  },

  data() {
    return {
      dateRangePickerOptions: {
        ranges: {
          'Today': [moment(), moment()],
          'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
          'Last 7 Days': [moment().subtract(6, 'days'), moment()],
          'Last 30 Days': [moment().subtract(29, 'days'), moment()],
          'This Month': [moment().startOf('month'), moment().endOf('month')],
          'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        alwaysShowCalendars: false,
        locale: {
          format: 'DD MMM YYYY'
        }
      },
      dateRangePickerOptionsWitAllTime: {
        ranges: {
          'Today': [moment(), moment()],
          'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
          'Last 7 Days': [moment().subtract(6, 'days'), moment()],
          'Last 30 Days': [moment().subtract(29, 'days'), moment()],
          'This Month': [moment().startOf('month'), moment().endOf('month')],
          'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
          'All Time': [0, 0]
        },
        alwaysShowCalendars: false,
        locale: {
          format: 'DD MMM YYYY'
        }
      },
      dateRangePickerOptionsCustomRangeOnly: {
        ranges: {
        },
        alwaysShowCalendars: false,
        locale: {
          format: 'DD MMM YYYY'
        }
      },
      range: [],
      block: 'btn-block2',
      sdate: '',
      edate: '',
      isAttendance: false,
      dateDiff: 0
    }
  },

  computed: {
    lang() {
      return this.$store.state.userStores.lang
    }
  },

  watch: {
    initDate(initDate) {
      console.log('initttt')
      if (initDate && initDate.length) {
        this.range = [...initDate]
      }
    }
  },


  methods: {
    datePicked(date) {
      
      const obj = {
        start_date: date[0],
        end_date: date[1]
      }
      this.isAttendance = false
      this.sdate = date[0]
      this.edate = date[1]
      if (moment(date[0]).format('YYYY') === '1970') {
        this.$emit('reset')
      } else {
        this.$emit('picked', obj)
      }
      const st = moment(obj.start_date)
      const ed = moment(obj.end_date)
      this.dateDiff = ed.diff(st, 'days')
      // console.log('picked', ed.diff(st, 'days'))
    },

    dateChange (date) {
      const obj = {
        start_date: date[0],
        end_date: date[1]
      }
      this.isAttendance = true
      this.sdate = date[0]
      this.edate = date[1]
      this.$emit('picked', obj)
      // console.log('picked')
    },

    cancel() {
      this.$emit('cancel')
    },

    handlePrevNextDate(type) {
      let date = {
        start: '',
        end: ''
      }
      if (this.sdate === null || this.sdate === '') {
        this.sdate = moment().format('YYYY-MM-DD')
      }
      if (type === 'prev') {
        date.start = moment(this.sdate).subtract(this.dateDiff + 1, 'days')
        if (this.dateDiff > 0) {
          date.end = moment(this.edate).subtract(this.dateDiff + 1, 'days')
        }
      } else {
        date.start = moment(this.sdate).add(this.dateDiff + 1, 'days')
        if (this.dateDiff > 0) {
          date.end = moment(this.edate).add(this.dateDiff + 1, 'days')
        }
      }
      this.sdate = moment(date.start).format('YYYY-MM-DD')
      this.edate = moment(date.end).format('YYYY-MM-DD')
      this.dateDiff > 0 ? this.dateChange([this.sdate,this.edate]) : this.dateChange([this.sdate,this.sdate])
    }
  }
}
</script>
