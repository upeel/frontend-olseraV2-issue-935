<template>
  <div>
    <el-dialog
      :visible.sync="showFilter"
      :title="rootLang.filter"
      :before-close="closeFilter"
      width="360px"
      append-to-body
      class="complete-order"
    >
      <div class="text-center">
        <ul class="list-unstyled">
          <li :style="styleToday">
            <el-button type="text" @click="filterDate('today')">{{ rootLang.today }}</el-button>
          </li>
          <li :style="styleYesterday">
            <el-button type="text" @click="filterDate('yesterday')">{{ rootLang.yesterday }}</el-button>
          </li>
          <li :style="styleWeekAgo">
            <el-button type="text" @click="filterDate('weekago')">{{ rootLang.a_week_ago }}</el-button>
          </li>
          <li :style="styleMonthAgo">
            <el-button type="text" @click="filterDate('monthago')">{{ rootLang.a_month_ago }}</el-button>
          </li>
          <li :style="styleThisMonth">
            <el-button type="text" @click="filterDate('thismonth')">{{ rootLang.this_month }}</el-button>
          </li>
          <li :style="styleLastMonth">
            <el-button type="text" @click="filterDate('lastmonth')">{{ rootLang.last_month }}</el-button>
          </li>
          <li :style="styleCustom">
            <el-button type="text" @click="filterDate('custom')">{{ rootLang.custom }}</el-button>
          </li>
        </ul>
      </div>

      <el-row :gutter="10">
        <el-col :span="12">
          <p>{{ lang.from }}</p>
          <el-date-picker
            v-model="formFilter.startDate"
            :disabled="disableDate"
            :placeholder="rootLang.pick_a_day"
            type="date"
            format="dd-MM-yyyy"
            value-format="yyyy-MM-dd"
            style="width: 100% !important;"
          />
        </el-col>
        <el-col :span="12">
          <p>{{ rootLang.to_date }}</p>
          <el-date-picker
            v-model="formFilter.endDate"
            :placeholder="rootLang.pick_a_day"
            :disabled="disableDate"
            type="date"
            format="dd-MM-yyyy"
            value-format="yyyy-MM-dd"
            style="width: 100% !important;"
          />
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button type="danger" v-if="useAllTime" @click="setAllTime">{{ rootLang.all_data }}</el-button>
        <el-button type="danger" v-if="!useAllTime" @click="resetFilter">{{ lang.reset }}</el-button>
        <el-button type="info" disabled v-if="!formFilter.startDate || !formFilter.endDate">{{ rootLang.apply }}</el-button>
        <el-button type="primary" @click="saveFilter(formFilter.labelForDate)" v-else>{{ rootLang.apply }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const moment = require('moment')
export default {
  props: ['showFilter', 'useAllTime'],

  data() {
    return {
      disableDate: true,
      labelTag: '',
      labelSelect: 'today',
      styleToday: 'border-bottom: 1px solid #333;',
      styleYesterday: 'border-bottom: 1px solid #eee;',
      styleWeekAgo: 'border-bottom: 1px solid #eee;',
      styleMonthAgo: 'border-bottom: 1px solid #eee;',
      styleThisMonth: 'border-bottom: 1px solid #eee;',
      styleLastMonth: 'border-bottom: 1px solid #eee;',
      styleCustom: 'border-bottom: 1px solid #eee;',
      formFilter: {
        endDate: moment().format('YYYY-MM-DD'),
        startDate: moment().format('YYYY-MM-DD'),
        labelForDate: 'today'
      }
    }
  },

  computed: {
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    rootLang() {
      return this.$lang[this.$store.state.userStores.langId]
    }
  },

    watch:{
    labelSelect: {
      handler: function(val){
      this.styleToday = 'border-bottom: 1px solid #eee;'
      this.styleYesterday = 'border-bottom: 1px solid #eee;'
      this.styleWeekAgo = 'border-bottom: 1px solid #eee;'
      this.styleMonthAgo = 'border-bottom: 1px solid #eee;'
      this.styleThisMonth = 'border-bottom: 1px solid #eee;'
      this.styleLastMonth = 'border-bottom: 1px solid #eee;'
      this.styleCustom = 'border-bottom: 1px solid #eee;'
        if(val === 'today'){
          this.styleToday = 'border-bottom: 1px solid #333;'
        } else if (val === 'yesterday') {
          this.styleYesterday = 'border-bottom: 1px solid #333;'
        } else if (val === 'weekago') {
          this.styleWeekAgo = 'border-bottom: 1px solid #333;'
        } else if (val === 'monthago') {
          this.styleMonthAgo = 'border-bottom: 1px solid #333;'
        } else if (val === 'thismonth') {
          this.styleThisMonth = 'border-bottom: 1px solid #333;'
        } else if (val === 'lastmonth') {
          this.styleLastMonth = 'border-bottom: 1px solid #333;'
        } else if (val === 'custom') {
          this.styleCustom = 'border-bottom: 1px solid #333;'
        }
      },
      deep: true
    },
  },

  methods: {
    filterDate(block) {
      if (block === 'today') {
        this.disableDate = true
        this.labelSelect = block
        this.formFilter.startDate = moment().format('YYYY-MM-DD')
        this.formFilter.endDate = moment().format('YYYY-MM-DD')
        this.formFilter.labelForDate = 'today'
      } else if (block === 'yesterday') {
        this.disableDate = true
        this.labelSelect = block
        this.formFilter.startDate = moment().subtract(1, 'd').format('YYYY-MM-DD')
        this.formFilter.endDate = moment().subtract(1, 'd').format('YYYY-MM-DD')
        this.formFilter.labelForDate = 'yesterday'
      } else if (block === 'weekago') {
        this.disableDate = true
        this.labelSelect = block
        this.formFilter.startDate = moment().subtract(7, 'd').format('YYYY-MM-DD')
        this.formFilter.endDate = moment().format('YYYY-MM-DD')
        this.formFilter.labelForDate = 'weekago'
      } else if (block === 'monthago') {
        this.disableDate = true
        this.labelSelect = block
        this.formFilter.startDate = moment().subtract(30, 'd').format('YYYY-MM-DD')
        this.formFilter.endDate = moment().format('YYYY-MM-DD')
        this.formFilter.labelForDate = 'monthago'
      } else if (block === 'thismonth') {
        this.disableDate = true
        this.labelSelect = block
        this.formFilter.startDate = moment().startOf('month').format('YYYY-MM-DD')
        this.formFilter.endDate = moment().format('YYYY-MM-DD')
        this.formFilter.labelForDate = 'thismonth'
      } else if (block === 'lastmonth') {
        this.disableDate = true
        this.labelSelect = block
        this.formFilter.startDate = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD')
        this.formFilter.endDate = moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD')
        this.formFilter.labelForDate = 'lastmonth'
      } else if (block === 'custom') {
        this.formFilter.labelForDate = 'custom'
        this.labelSelect = block
        this.formFilter.startDate = ''
        this.formFilter.endDate = ''
        this.disableDate = false
      }

      if (block !== 'custom') {
        this.saveFilter(this.formFilter.labelForDate)
      }
    },

    saveFilter(block) {
      if (block === 'today') {
        this.labelTag = this.rootLang.today
      } else if (block === 'yesterday') {
        this.labelTag = this.rootLang.yesterday
      } else if (block === 'weekago') {
        this.labelTag = this.rootLang.a_week_ago
      } else if (block === 'monthago') {
        this.labelTag = this.rootLang.a_month_ago
      } else if (block === 'thismonth') {
        this.labelTag = this.rootLang.this_month
      } else if (block === 'lastmonth') {
        this.labelTag = this.rootLang.last_month
      } else if (block === 'custom') {
        this.labelTag = this.rootLang.custom
      }
      this.$emit('save', this.formFilter)
    },

    closeFilter() {
      this.$emit('close')
    },

    resetFilter() {
      this.formFilter.startDate = moment().format('YYYY-MM-DD')
      this.formFilter.endDate = moment().format('YYYY-MM-DD')
      this.formFilter.labelForDate = 'today'
      this.labelSelect = 'today'
      this.disableDate = true
      this.$emit('reset', this.formFilter)
    },

    setAllTime () {
      this.$emit('alltime')
    }
  }
}
</script>