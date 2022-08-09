<template>
  <div>
    <el-dialog
      :visible.sync="showFilter"
      :title="rootLang.filter"
      :before-close="closeFilter"
      width="360px"
      class="complete-order"
    >
      <div class="text-center">
        <ul class="list-unstyled" style="columns: 2; -webkit-columns: 2; -moz-columns: 2;">
          <li :style="styleThisMonth">
            <el-button type="text" @click="filterDate('thisMonth')">{{ rootLang.this_month }}</el-button>
          </li>
          <li :style="styleMonthAgo">
            <el-button type="text" @click="filterDate('monthAgo')">{{ rootLang.last_month }}</el-button>
          </li>
          <li :style="styleLast3Month">
            <el-button type="text" @click="filterDate('last3Month')">{{ rootLang.last_3_month }}</el-button>
          </li>
          <li :style="styleLast6Month">
            <el-button type="text" @click="filterDate('last6Month')">{{ rootLang.last_6_month }}</el-button>
          </li>
          <li :style="styleLast12Month">
            <el-button type="text" @click="filterDate('last12Month')">{{ rootLang.last_12_month }}</el-button>
          </li>
          <li :style="styleThisYear">
            <el-button v-if="type === 'months'" type="text" @click="filterDate('last24Month')">{{ rootLang.last_24_month }}</el-button>
            <el-button v-else type="text" @click="filterDate('thisYear')">{{ rootLang.this_year }}</el-button>
            </li>
          <li :style="styleThis2Year">
            <el-button v-if="type === 'months'" type="text" @click="filterDate('last36Month')">{{ rootLang.last_36_month }}</el-button>
            <el-button v-else type="text" @click="filterDate('this2Year')">{{ rootLang.this_2_year }}</el-button>
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
            :placeholder="rootLang.pick_a_month"
            type="month"
            format="MMM-yyyy"
            value-format="yyyy-MM"
            style="width: 100% !important;"
          />
        </el-col>
        <el-col :span="12">
          <p>{{ rootLang.to_date }}</p>
          <el-date-picker
            v-model="formFilter.endDate"
            :placeholder="rootLang.pick_a_month"
            :disabled="disableDate"
            type="month"
            format="MMM-yyyy"
            value-format="yyyy-MM"
            style="width: 100% !important;"
          />
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="resetFilter">{{ lang.reset }}</el-button>
        <el-button type="info" disabled v-if="!formFilter.startDate || !formFilter.endDate">{{ rootLang.apply }}</el-button>
        <el-button type="primary" @click="saveFilter(formFilter.labelForDate)" v-else>{{ rootLang.apply }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const moment = require('moment')
export default {
  props: ['showFilter','type'],

  data() {
    return {
      disableDate: true,
      labelTag: '',
      labelSelect: 'last3Month',
      styleThisMonth: 'border-bottom: 1px solid #eee;',
      styleMonthAgo: 'border-bottom: 1px solid #eee;',
      styleLast3Month: 'border-bottom: 1px solid #333;',
      styleLast6Month: 'border-bottom: 1px solid #eee;',
      styleLast12Month: 'border-bottom: 1px solid #eee;',
      styleThisYear: 'border-bottom: 1px solid #eee;',
      styleThis2Year: 'border-bottom: 1px solid #eee;',
      styleCustom: 'border-bottom: 1px solid #eee;',
      formFilter: {
        endDate: moment().format('YYYY-MM'),
        startDate: moment().subtract(2, 'month').format('YYYY-MM'),
        labelForDate: 'last3Month'
      }
    }
  },

  watch:{
    labelSelect: {
      handler: function(val){
        this.styleThisMonth = 'border-bottom: 1px solid #eee;'
        this.styleMonthAgo = 'border-bottom: 1px solid #eee;'
        this.styleLast3Month = 'border-bottom: 1px solid #eee;'
        this.styleLast6Month = 'border-bottom: 1px solid #eee;'
        this.styleLast12Month = 'border-bottom: 1px solid #eee;'
        this.styleThisYear = 'border-bottom: 1px solid #eee;'
        this.styleThis2Year ='border-bottom: 1px solid #eee;'
        this.styleCustom = 'border-bottom: 1px solid #eee;'
        if(val === 'thisMonth'){
          this.styleThisMonth = 'border-bottom: 1px solid #333;'
        } else if (val === 'monthAgo') {
          this.styleMonthAgo = 'border-bottom: 1px solid #333;'
        } else if (val === 'last3Month') {
          this.styleLast3Month = 'border-bottom: 1px solid #333;'
        } else if (val === 'last6Month') {
          this.styleLast6Month = 'border-bottom: 1px solid #333;'
        } else if (val === 'last12Month') {
          this.styleLast12Month = 'border-bottom: 1px solid #333;'
        } else if (val === 'thisYear' || val === 'last24Month') {
          this.styleThisYear = 'border-bottom: 1px solid #333;'
        } else if (val === 'this2Year' || val === 'last36Month') {
          this.styleThis2Year = 'border-bottom: 1px solid #333;'
        } else if (val === 'custom') {
          this.styleCustom = 'border-bottom: 1px solid #333;'
        }
      },
      deep: true
    },
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

  methods: {
    filterDate(block) {
      if (block === 'thisMonth') {
        this.disableDate = true
        this.labelSelect = 'thisMonth'
        this.formFilter.startDate = moment().format('YYYY-MM')
        this.formFilter.endDate = moment().format('YYYY-MM')
        this.formFilter.labelForDate = 'thisMonth'
      } else if (block === 'monthAgo') {
        this.disableDate = true
        this.labelSelect = 'monthAgo'
        this.formFilter.startDate = moment().subtract(1, 'month').format('YYYY-MM')
        this.formFilter.endDate = moment().subtract(1, 'month').format('YYYY-MM')
        this.formFilter.labelForDate = 'monthAgo'
      } else if (block === 'last3Month') {
        this.disableDate = true
        this.labelSelect = 'last3Month'
        this.formFilter.startDate = moment().subtract(2, 'month').format('YYYY-MM')
        this.formFilter.endDate = moment().format('YYYY-MM')
        this.formFilter.labelForDate = 'last3Month'
      } else if (block === 'last6Month') {
        this.disableDate = true
        this.labelSelect = 'last6Month'
        this.formFilter.startDate = moment().subtract(5, 'month').format('YYYY-MM')
        this.formFilter.endDate = moment().format('YYYY-MM')
        this.formFilter.labelForDate = 'last6Month'
      } else if (block === 'last12Month') {
        this.disableDate = true
        this.labelSelect = 'last12Month'
        this.formFilter.startDate = moment().subtract(11, 'month').format('YYYY-MM')
        this.formFilter.endDate = moment().format('YYYY-MM')
        this.formFilter.labelForDate = 'last12Month'
      } else if (block === 'last24Month') {
        this.disableDate = true
        this.labelSelect = 'last24Month'
        this.formFilter.startDate = moment().subtract(24, 'month').format('YYYY-MM')
        this.formFilter.endDate = moment().format('YYYY-MM')
        this.formFilter.labelForDate = 'last24Month'
      }  else if (block === 'last36Month') {
        this.disableDate = true
        this.labelSelect = 'last36Month'
        this.formFilter.startDate = moment().subtract(36, 'month').format('YYYY-MM')
        this.formFilter.endDate = moment().format('YYYY-MM')
        this.formFilter.labelForDate = 'last36Month'
      } else if (block === 'thisYear') {
        this.disableDate = true
        this.labelSelect = 'thisYear'
        this.formFilter.startDate = moment().format('YYYY')
        this.formFilter.endDate = moment().format('YYYY')
        this.formFilter.labelForDate = 'thisYear'
      } else if (block === 'this2Year') {
        this.disableDate = true
        this.labelSelect = 'this2Year'
        this.formFilter.startDate = moment().subtract(1, 'year').format('YYYY')
        this.formFilter.endDate = moment().format('YYYY')
        this.formFilter.labelForDate = 'this2Year'
      } else if (block === 'custom') {
        this.formFilter.labelForDate = 'custom'
        this.labelSelect = 'custom'
        this.formFilter.startDate = ''
        this.formFilter.endDate = ''
        this.disableDate = false
      }

      if (block !== 'custom') {
        this.saveFilter(this.formFilter.labelForDate)
      }
    },

    saveFilter(block) {
      if (block === 'thisMonth') {
        this.labelTag = this.rootLang.this_month
      } else if (block === 'monthAgo') {
        this.labelTag = this.rootLang.last_month
      } else if (block === 'last3Month') {
        this.labelTag = this.rootLang.last_3_month
      } else if (block === 'last6Month') {
        this.labelTag = this.rootLang.last_6_month
      } else if (block === 'thisYear') {
        this.labelTag = this.rootLang.this_year
      } else if (block === 'custom') {
        this.labelTag = this.rootLang.custom
      }
      this.$emit('save', this.formFilter)
    },

    closeFilter() {
      this.$emit('close')
    },

    resetFilter() {
      this.formFilter.startDate = moment().subtract(2, 'month').format('YYYY-MM')
      this.formFilter.endDate = moment().format('YYYY-MM')
      this.formFilter.labelForDate = 'last3Month'
      this.labelSelect = 'last3Month'
      this.disableDate = true
      this.$emit('reset', this.formFilter)
    }
  }
}
</script>

