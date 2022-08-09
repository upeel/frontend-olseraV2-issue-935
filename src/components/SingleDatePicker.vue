<template>
  <div class="single-datepicker bg-f5 box-shadow">
    <template v-if="noArrow">
      <div class="calender-input flex-container full-width justify-center">
        <el-date-picker
          v-model="value"
          :clearable="clearable"
          placeholder="Select a date"
          type="date"
          format="d MMM yyyy"
          value-format="yyyy-MM-dd"
          style="widht: 100%"
          @change="datePicked"
        />
      </div>
    </template>
    <template v-else>
      <el-button
        class="box-shadow-null"
        icon="el-icon-arrow-left"
        @click="handlePrevNextDate('prev')"
      />
      <div class="calender-input">
        <el-date-picker
          v-model="value"
          :clearable="clearable"
          placeholder="Select a date"
          type="date"
          format="d MMM yyyy"
          value-format="yyyy-MM-dd"
          @change="datePicked"
        />
      </div>
      <el-button
        class="box-shadow-null"
        icon="el-icon-arrow-right"
        @click="handlePrevNextDate('next')"
      />
    </template>
  </div>
</template>

<script>
const moment = require('moment')
export default {
  props: {
    value: {
      type: String,
      default: null
    },
    clearable: {
      type: Boolean,
      default: false
    },
    noArrow: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    datePicked(date) {
      this.$emit('input', date)
    },
    handlePrevNextDate(type) {
      let date = ''
      if (this.date === null || this.date === '') {
        this.date = moment().format('YYYY-MM-DD')
      }
      if (type === 'prev') {
        date = moment(this.date).subtract(1, 'days')
      } else {
        date = moment(this.date).add(1, 'days')
      }
      this.date = moment(date).format('YYYY-MM-DD')
      this.datePicked(this.date)
    }
  }
}
</script>
