<template>
  <el-dialog
    :visible.sync="show"
    :show-close="false"
    fullscreen
    custom-class="dialog-card">
    <div slot="title" class="flex-container" style="text-align: center">
      <el-row :gutter="20"  style="width: 100%">
        <el-col  class="pointer font-24" :xs="4" :sm="4" :md="4" :lg="1" :xl="1" align="left">
         <div @click="handleBack"><svg-icon icon-class="arrow-left"></svg-icon></div>
        </el-col>
        <el-col :xs="20" :sm="20" :md="20" :lg="23" :xl="23" align="center">
          <h4 class="dialog-title">Peminjaman Commbank Bizloan</h4>
        </el-col>
      </el-row>
    </div>
    <div class="like-table-wrapper mw-1200" style="box-shadow: 0px 2px 6px #0000001f;">
      <div
        class="like-table-wrapper--item pointer"
        @click="handleClick">
        <el-avatar
          :src="items.photo"
          class="mr-4"
        />
        <div
          class="font-24 font-semi-bold"
          style="flex-grow: 1;">
          {{ items.alias_name }}
        </div>

        <!-- <div
          class="pointer">
          <div v-if="items.main_store.length !== 0">
            <el-tag v-if="items.main_store[0].activation_status === 'P'" type="info" size="medium">
              <svg-icon icon-class="feather-clock"></svg-icon>
              {{$lang[langId].on_progress}}
              <i class="el-icon-arrow-right"></i>
            </el-tag>
            <el-tag v-else type="warning" size="medium">
              Ajukan
              <i class="el-icon-arrow-right"></i>
            </el-tag>
          </div>
          <el-tag v-else type="warning" size="medium">
            Ajukan
            <i class="el-icon-arrow-right"></i>
          </el-tag>
        </div> -->
      </div>
    </div>
    <div class="mw-1200 px-null">
      <el-row class="mt-20" :gutter="20">
        <el-col :md="12" :sm="12" :xs="24" align="left">
          <div
            class="font-24 font-semi-bold"
            style="flex-grow: 1;"
            >
            {{ rootLang.loan_history }}
          </div>
        </el-col>
        <el-col :md="12" :sm="12" :xs="24" align="right">
          <el-button
            size= "small"
            class="date-filter-dashboard"
            @click="toggleFilter"
            style="margin-right: 7px">
            <i class="fa fa-filter" />
            <span>{{ labelDate }}</span>
          </el-button>
        </el-col>
      </el-row>
      <div style="margin-top: 24px">
        <el-table
          style="box-shadow: 0px 2px 6px #0000001F;"
          ref="multipleTable"
          class="product-table-max-height mobile-fix-height-unset"
          @sort-change="changeSortTable"
          :data="loanHistory"
          stripe>
          <el-table-column 
            prop="loan_date"
            :label="rootLang.loan_date"
            sortable>
          </el-table-column>
          <el-table-column 
            prop="pemohon"
            :label="rootLang.aplicant"
            sortable>
          </el-table-column>
          <el-table-column 
            prop="type"
            :label="rootLang.loan_type"
            sortable>
            <template slot-scope="scope">
              <span>{{scope.row.type === 'CR' ? rootLang.credit : ''}}</span>
            </template>
          </el-table-column>
          <el-table-column 
            prop="loan_amount_int"
            :label="rootLang.submissions_amount"
            sortable
            align="right">>
            <template slot-scope="scope">
              <span>{{scope.row.loan_amount}}</span>
            </template>
          </el-table-column>
          <el-table-column 
            prop="loan_receive_int"
            :label="rootLang.recieved_amount"
            sortable
            align="right">>
            <template slot-scope="scope">
              <span>{{scope.row.loan_receive}}</span>
            </template>
          </el-table-column>
          <el-table-column 
            prop="month_installments_int"
            :label="rootLang.monthly_payment"
            sortable
            align="right">>
            <template slot-scope="scope">
              <span>{{scope.row.month_installments}}</span>
            </template>
          </el-table-column>
          <el-table-column 
            prop="bunga"
            :label="rootLang.loan_interest"
            sortable
            width="100"
            align="right">
          </el-table-column>
          <el-table-column 
            prop="status"
            :label="rootLang.status"
            sortable
            width="100"
            align="centers">>
            <template slot-scope="scope">
              <span>{{scope.row.status === 'A' ? rootLang.active : rootLang.on_progress}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <custom-date-filter
      :show-filter="showFilter"
      @close="dateFilterClose"
      @reset="dateFilterReset"
      @save="dateFilterSave"
    />
  </el-dialog>
</template>

<script>
import CustomDateFilter from 'modules/CustomDateFilter';
import basicComputedMixin from '@/mixins/basicComputedMixin';
var moment = require('moment');

export default {
  mixins: [basicComputedMixin],
  components: {
    CustomDateFilter,
  },
  props:{
    show: {
      type: Boolean,
      default: false
    },
    items: {
      type: Object,
      default: {}
    }
  },

  data() {
    return {
      isLoading: false,
      loanHistory: [
        {
          loan_date: '12 Oct 2021',
          pemohon: 'Verry',
          type: 'CR',
          loan_amount_int: 20000000,
          loan_receive_int: 10000000,
          month_installments_int: 1500000,
          loan_amount: '20.000.000',
          loan_receive: '10.000.000',
          month_installments: '1.500.000',
          bunga: '1%',
          status: 'A'
        },{
          loan_date: '11 Oct 2021',
          pemohon: 'Andi',
          type: 'CR',
          loan_amount: '10.000.000',
          loan_receive: '10.000.000',
          month_installments: '1.500.000',
          bunga: '1%',
          status: 'A'
        }
      ],
      labelDate: this.$lang[this.$store.state.userStores.langId].today + '\n' +
                          moment().format('DD MMM YYYY') + ' - ' +
                          moment().format('DD MMM YYYY'),
      showFilter: false,
      params:{
        start_date: moment().format('YYYY-MM-DD'),
        end_date: moment().format('YYYY-MM-DD'),
        per_page: 15,
        currentPage: 1,
        page: 1,
        total: null,
      },
    }
  },

  mounted(){

  },

  methods: {
    handleBack(){
      this.$emit('closeDetail')
    },
    handleClick(){
      this.$router.push({
        path: '/service-activation-v2/commbank-bizloan'
      })
    },
    toggleFilter() {
      let show = this.showFilter
      this.showFilter = show ? false : true
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
      // this.getSales()
    },

    dateFilterSave(filter) {
      this.params.start_date = filter.startDate
      this.params.end_date = filter.endDate
      this.dateFilterClose()
      this.setLabelFilter(filter)
      // this.getSales()
    },

    changeSortTable(val) {
      // if (val.order === 'ascending') val.order = 'asc'
      // if (val.order === 'descending') val.order = 'desc'
      // if (val.order === null) val.order = this.params.sort_type

      // this.params.sort_type = val.order
      // this.params.sort_column = val.prop
      // this.getSales()
    },
  }
}
</script>

