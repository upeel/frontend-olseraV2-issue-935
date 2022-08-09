<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-lg-6 col-md-6 col-sm-6 font-20 lh-2 text-left">
        {{rootLang.loan_history}}
      </div>
      <div class="col-xs-12 col-lg-6 col-md-6 col-sm-6">
        <el-button
          size= "small"
          class="date-filter-dashboard"
          @click="toggleFilter"
          style="margin-right: 7px; float: right;">
          <i class="fa fa-filter" />
          <span>{{ labelDate }}</span>
        </el-button>
      </div>
    </div>

    <div style="margin-top: 24px">
      <div v-if="isLoading === false" style="border: 1px solid #f5f5f5; border-radius: 3px;">
        <el-table
          ref="multipleTable"
          v-loading="isLoading"
          class="product-table-max-height mobile-fix-height-unset"
          :data="dataKoinworks"
          stripe>
          <el-table-column
            prop="submission_date"
            :label="lang.date"
            width="130">
            <template slot-scope="scope">
              {{scope.row.fsubmission_date}}
            </template>
          </el-table-column>
          <el-table-column
            :label="rootLang.loan_purpose"
            prop="loan_purpose_name">
            <template slot-scope="scope">
              <span>{{ capitalize(scope.row.loan_purpose_name) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="rootLang.submissions_amount"
            prop="amount">
            <template slot-scope="scope">
              <span>{{scope.row.famount}}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="rootLang.installment"
            prop="installment_amount">
            <template slot-scope="scope">
              <span>{{scope.row.finstallment_amount}}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="lang.status"
            prop="submission_status">
            <template slot-scope="scope">
              <span>{{ capitalize(scope.row.submission_status) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else  style="margin-top: 60px;">
        <loading
          align="center"
          :active="true"
          color= '#1bb4e6'
          loader="spinner"
          :width="32"
          :height="32"
          backgroundColor='#ffffff'>
        </loading>
      </div>
    </div>

    <custom-date-filter
      :show-filter="showFilter"
      @close="dateFilterClose"
      @reset="dateFilterReset"
      @save="dateFilterSave"
    />
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin';
import mixinAccounting from '@/mixins/mixinAccounting';
import Loading from 'vue-loading-overlay';
import CustomDateFilter from 'modules/CustomDateFilter';
import { storeSubmision } from '@/api/thirdParty/koinworks'

var moment = require('moment')
export default {
  name: 'listKoinworksSubmission',
  mixins: [basicComputedMixin, mixinAccounting],

  components: {
    CustomDateFilter,
    Loading
  },

  computed: {},

  data(){
    return{
      dataKoinworks: [],
      isLoading: false,
      showFilter: false,
      labelDate: '',
      params: {
        start_date: moment().format('yyyy-MM-DD'),
        end_date: moment().format('yyyy-MM-DD'),
      }
    }
  },
  
  mounted() {
    this.params.start_date = moment().format('YYYY-MM-DD')
    this.params.end_date = moment().format('YYYY-MM-DD')
    this.labelDate = this.$lang[this.langId].today + '\n' +
                      moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                      moment(this.params.end_date).format('DD MMM YYYY')
    this.getFunding()
  },

  methods: {
    getFunding(){
      this.isLoading = true
      let params = this.params
      storeSubmision(params).then(async response => {
        this.isLoading = false
        this.dataKoinworks = response.data.data.submission_req
        this.$emit('koinworkId', response.data.data.id)
      }).catch(error => {
        this.isLoading = false
        this.$message({
          type: 'error',
          message: error.string
        })
      })
    },

    setLabelFilter(filter) {
      if (filter.labelForDate === 'today') {
        this.labelDate = this.$lang[this.langId].today + '\n' +
                        moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                        moment(this.params.end_date).format('DD MMM YYYY')
      } else if (filter.labelForDate === 'yesterday') {
        this.labelDate = this.$lang[this.langId].yesterday + '\n' +
                        moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                        moment(this.params.end_date).format('DD MMM YYYY')
      } else if (filter.labelForDate === 'weekago') {
        this.labelDate = this.$lang[this.langId].a_week_ago + '\n' +
                        moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                        moment(this.params.end_date).format('DD MMM YYYY')
      } else if (filter.labelForDate === 'monthago') {
        this.labelDate = this.$lang[this.langId].a_month_ago + '\n' +
                        moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                        moment(this.params.end_date).format('DD MMM YYYY')
      } else if (filter.labelForDate === 'thismonth') {
        this.labelDate = this.$lang[this.langId].this_month + '\n' +
                        moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                        moment(this.params.end_date).format('DD MMM YYYY')
      } else if (filter.labelForDate === 'lastmonth') {
        this.labelDate = this.$lang[this.langId].last_month + '\n' +
                        moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                        moment(this.params.end_date).format('DD MMM YYYY')
      } else if (filter.labelForDate === 'custom') {
        this.labelDate = this.$lang[this.langId].custom + '\n' +
                        moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                        moment(this.params.end_date).format('DD MMM YYYY')
      }
    },

    toggleFilter() {
      if (this.showFilter) {
        this.showFilter = false
      } else {
        this.showFilter = true
      }
    },

    dateFilterClose() {
      this.showFilter = false
    },

    dateFilterReset(data) {
      this.labelDate = this.$lang[this.langId].today + '\n' +
                        moment().format('DD MMM YYYY') + ' - ' +
                        moment().format('DD MMM YYYY'),
      this.params.start_date = moment().format('YYYY-MM-DD')
      this.params.end_date = moment().format('YYYY-MM-DD')
      this.dateFilterClose()
      this.getFunding()
    },

    dateFilterSave(filter) {
      this.params.start_date = filter.startDate
      this.params.end_date = filter.endDate
      this.dateFilterClose()
      this.setLabelFilter(filter)
      this.getFunding()
    },
  }
}
</script>