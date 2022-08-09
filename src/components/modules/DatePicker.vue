<template>
  <el-date-picker
    :size="size"
    :clearable="false"
    :picker-options="options"
    @change="datePicked"
    v-model="date"
    type="date"
    popper-class="custom-popper-datepicker"
    value-format="yyyy-MM-dd">
  </el-date-picker>
</template>

<script>
var moment = require('moment')

export default {
  props: ['size'],

  data() {
    return {
      options: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: 'Today',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: 'Yesterday',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: 'A week ago',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      date: moment().format('YYYY-MM-DD')
    }
  },

  methods: {
    datePicked(val) {
      this.$emit('picked', val)
    }
  }
}
</script>