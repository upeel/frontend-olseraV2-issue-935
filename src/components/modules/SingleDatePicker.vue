<template>
<div style="display: inline-block;">
  <div class="single-datepicker bg-f5 box-shadow" style="height: 28px">
    <el-button
      class="box-shadow-null"
      icon="el-icon-arrow-left"
      @click="handlePrevNextDate('prev')"
    />
    <el-date-picker
      id="dpicker"
      v-model="date"
      :size="size"
      :clearable="false"
      type="date"
      popper-class="custom-popper-datepicker"
      value-format="yyyy-MM-dd"
      format="dd MMM yy"
      @focus="showFocus"
      @change="datePicked"
      class="olsera-single-date-picker">
    </el-date-picker>
    <el-button
        class="box-shadow-null"
        icon="el-icon-arrow-right"
        @click="handlePrevNextDate('next')"
      />
  </div>
</div>
</template>

<script>
var moment = require('moment')

export default {
  props: ['size', 'initDate'],

  data() {
    return {
      date: moment().format('YYYY-MM-DD')
    }
  },

  watch: {
    initDate(date) {
      if (date) {
        this.date = date
      }
    }
  },

  methods: {
    datePicked(val) {
      this.$emit('picked', val)
    },

    showFocus () {
      console.log(document)
      document.getElementById('dpicker').blur();
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
      // this.sdate = moment(date.start).format('YYYY-MM-DD')
      // this.edate = moment(date.end).format('YYYY-MM-DD')
      // this.dateDiff > 0 ? this.dateChange([this.sdate,this.edate]) : this.dateChange([this.sdate,this.sdate])
    }
  }
}
</script>
