<template>
  <div class="date-range-picker-wrapper">
    <!-- <el-date-picker
      v-model="range"
      :size="size"
      :clearable="false"
      :picker-options="pickerOptions"
      type="daterange"
      start-placeholder="Start"
      end-placeholder="End"
      popper-class="custom-popper-datepicker"
      value-format="yyyy-MM-dd"
      @change="datePicked">
    </el-date-picker> -->

    <date-range
      v-model="range"
      :options="dateRangePickerOptions"
      format="YYYY-MM-DD"
    />
  </div>
</template>

<script>
var moment = require('moment')
import dateRange from 'components/modules/DateRangePicker2'
// const startDate = moment().add(-29, 'days').format('YYYY-MM-DD')
const startDate = moment().format('YYYY-MM-DD')
const endDate = moment().format('YYYY-MM-DD')

export default {
  props: ['size'],

  components: {
    dateRange
  },

  data() {
    return {
      showDialog: false,
      pickerOptions: {
        shortcuts: [
          {
            text: 'Last week',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: 'Last month',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
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
          format: 'DD MMM \'YY'
        }
      },
      range: [startDate, endDate]
    }
  },

  computed: {
    lang() {
      return this.$store.state.userStores.lang
    }
  },

  watch: {
    range(range) {
      if (range.length) {
        this.datePicked()
      }
      // console.log(range)
    }
  },

  methods: {
    datePicked() {
      this.showDialog = false
      const obj = {
        start_date: this.range[0],
        end_date: this.range[1]
      }
      this.$emit('picked', obj)
    },

    cancel() {
      this.showDialog = false
      this.$emit('cancel')
    }
  }
}
</script>
