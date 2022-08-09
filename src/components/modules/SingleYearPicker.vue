<template>
  <div class="single-month-picker bg-f5 box-shadow">
    <el-button
      class="box-shadow-null"
      icon="el-icon-arrow-left"
      @click="handlePrevNextDate('prev')"
    />
    <div class="calender-input">
      <el-date-picker
        v-model="value"
        :clearable="clearable"
        :placeholder="$lang[this.langId].pick_a_year"
        type="year"
        format="yyyy"
        value-format="yyyy"
        @change="datePicked"
      />
    </div>
    <el-button
      class="box-shadow-null"
      icon="el-icon-arrow-right"
      @click="handlePrevNextDate('next')"
    />
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
    }
  },

  computed: {
    lang() {
      return this.$store.state.userStores.lang
    },
    token() {
      return this.$store.state.user.token
    },
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    bannerOrder() {
      var val = false
      if (parseInt(this.$store.state.bannerOnlineOrder.working_hours) === 0) {
        val = false
      }
      if (parseInt(this.$store.state.bannerOnlineOrder.working_hours) === 1) {
        val = true
      }
      return val
    }
  },
  methods: {
    datePicked(date) {
      this.$emit('input', date)
    },
    handlePrevNextDate(type) {
      let date = this.value
      if (this.date === null || this.date === '') {
        this.date = moment().format('YYYY')
      }
      if (type === 'prev') {
        date = moment(this.date).subtract(1, 'year')
      } else {
        date = moment(this.date).add(1, 'year')
      }
      this.date = moment(date).format('YYYY')
      this.datePicked(this.date)
    }
  }
}
</script>
