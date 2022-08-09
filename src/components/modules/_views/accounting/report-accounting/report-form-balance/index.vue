<template>
  <div class="px-20">
    <el-card class="box-card">
        <div class="row">
          <div class="col-xs-12 col-sm-6 col-lg-9 col-md-8" >
              <el-button
                size="small"
                class="date-filter-dashboard"
                @click="toggleFilter">
                <i class="fa fa-filter" />
                <span>{{ labelMonth }}</span>
              </el-button>
          </div>
          <div class="col-xs-12 col-sm-6 col-lg-3 col-md-4 text-right">
            <el-button
              @click="getPDF()"
              size="mini"
              icon="el-icon-printer">
              PDF
            </el-button>
            <el-button
              @click="getExcel()"
              size="mini"
              icon="el-icon-document">
              EXCEL
            </el-button>
          </div>
        </div>

      <div class="card-body">
        <div style="margin-top: 24px">
          <div v-if="isLoading === false">
            <el-table
              ref="multipleTable"
              class="product-table-max-height mobile-fix-height-unset"
              :data="dataBalance"
              :height="autoHeight"
              stripe>
              <el-table-column
                fixed
                prop="account_no"
                :label="$lang[langId].account_number"
                width="140"
                >
              </el-table-column>
              <el-table-column
                fixed
                prop="account_name"
                :label="$lang[langId].account_name"
                :width="autoWidth">
                <template slot-scope="scope">
                  <span>{{ capitalize(scope.row.account_name) }}</span>
                </template>
              </el-table-column>
              <template v-for="(column, index) in dataHeader">
                <el-table-column
                  v-bind="column"
                  :label="column"
                  :prop="column"
                  :key="index"
                  width="140"
                  align="right">
                  <template slot-scope="scope">
                    <template v-if="!column.render">
                      <template v-if="column.formatter">
                        <span v-html="column.formatter(scope.row, column)" />
                      </template>
                      <template v-else>
                        <a :href="href" @click="detailReport(scope.row, index, column)" style="cursor: pointer;">
                          {{ scope.row[column] !== 0 ? scope.row[column] : selectedStore.currency_id + ' 0' }}
                        </a>
                        <!-- <span>{{ scope.row[column] }}</span> -->
                      </template>
                    </template>
                    <template v-else>
                      <render-dom :column="column" :row="scope.row" :render="column.render" :index="index" />
                    </template>
                  </template>
                </el-table-column>
              </template>
            </el-table>
            <el-table :data="tableTotal" style="font-weight: bold; margin-top: 24px;">
              <el-table-column
                fixed
                prop="account_no"
                label=""
                width="140">
              </el-table-column>
              <el-table-column
                fixed
                prop="account_name"
                label=""
                :width="autoWidth">
                <template slot-scope="scope">
                  <span>{{ capitalize(scope.row.account_name) }}</span>
                </template>
              </el-table-column>
              <template v-for="(column, index) in dataHeader">
                <el-table-column
                  v-bind="column"
                  :label="column"
                  :prop="column"
                  :key="index"
                  width="140"
                  align="right">
                  <template slot-scope="scope">
                    <template v-if="!column.render">
                      <template v-if="column.formatter">
                        <span v-html="column.formatter(scope.row, column)" />
                      </template>
                      <template v-else>
                        <span>{{ scope.row[column] }}</span>
                      </template>
                    </template>
                    <template v-else>
                      <render-dom :column="column" :row="scope.row" :render="column.render" :index="index" />
                    </template>
                  </template>
                </el-table-column>
              </template>
            </el-table>
            <div style="margin-top: 20px; margin-bottom: -55px">
              <el-select v-model="params.per_page"  @change="handleChangeSize" placeholder="Select" class="perpage" style="width: 120px">
                <el-option
                  v-for="item in itemPage"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div style="text-align: center">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="params.currentPage"
                :page-size="parseInt(params.per_page)"
                layout="total, prev, pager, next, jumper"
                :total="params.total"
                class="paginate">
              </el-pagination>
            </div>
          </div>
          <div v-else>
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
      </div>
    </el-card>
    <custom-month-filter
      :show-filter="showFilter"
      type="months"
      @close="monthFilterClose"
      @reset="monthFilterReset"
      @save="monthFilterSave"
    />
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import Loading from 'vue-loading-overlay'
import CustomMonthFilter from 'modules/CustomMonthFilter'
import moment from 'moment'
import mixinAccounting from '@/mixins/mixinAccounting';

export default {
  components:{
    CustomMonthFilter,
  },
  mixins: [mixinAccounting],
  data() {
    return {
      itemPage: [
        {
          value: '15',
          label: '15 item'
        },{
          value: '25',
          label: '25 item'
        },{
          value: '50',
          label: '50 item'
        },{
          value: '100',
          label: '100 item'
        }
      ],
      isLoading: false,
      showFilter: false,
      isSetup: 'true',
      labelMonth: '',
      autoWidth: '',
      autoHeight: '',
      dataHeader: [],
      dataBalance: [],
      tableTotal: [],
      period: [],
      params: {
        report: 'balance_sheet',
        start: moment().subtract(2, 'month').format('YYYYMM'),
        end: moment().format('YYYYMM'),
        currentPage: 1,
        per_page: 15,
        page: 1,
        total: null
      }
    }
  },

  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    token() {
      return this.$store.state.user.token
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    }
  },

  watch: {
    selectedStore() {
      console.log('watch')
      this.getMonth()
    }
  },

  methods: {
    getMonth() {
      if(Object.keys(this.$route.params).includes('lastParams') === true){
        this.params = {
          report: 'balance_sheet',
          start: this.$route.params.lastParams.start,
          end: this.$route.params.lastParams.end,
          currentPage: this.$route.params.lastParams.currentPage,
          per_page: this.$route.params.lastParams.per_page,
          page: this.$route.params.lastParams.page,
          total: null
        }
      }
      
      this.labelMonth = Object.keys(this.$route.params).includes('labelMonth') === true ?  this.$route.params.labelMonth : this.$lang[this.langId].last_3_month + '\n' +
                        moment(this.params.start).format('MMM YYYY') + ' - ' +
                        moment(this.params.end).format('MMM YYYY')
   
    },

    toggleFilter() {
      if (this.showFilter) {
        this.showFilter = false
      } else {
        this.showFilter = true
      }
    },

    monthFilterClose() {
      this.showFilter = false
    },

    monthFilterReset(data) {
      this.filterTag = '',
      this.getMonth()
      this.monthFilterClose()
      this.getMovement()
    },

    monthFilterSave(filter) {
      this.filterTag = filter.labelForDate
      if (filter.labelForDate === 'thisYear' || filter.labelForDate === 'this2Year') {
        this.$set(this.params, 'start', filter.startDate)
        this.$set(this.params, 'end', filter.endDate)
      } else {
        this.$set(this.params, 'start', moment(filter.startDate).format('YYYYMM'))
        this.$set(this.params, 'end', moment(filter.endDate).format('YYYYMM'))
      }
      this.monthFilterClose()
      this.setLabelFilter(filter)
      this.getMovement()
    },

    setLabelFilter  (filter) {
      if (filter.labelForDate === 'thisMonth') {
        this.labelMonth = this.$lang[this.langId].this_month + '\n(' +
                        moment(this.params.start).format('MMM YYYY') + ')'
      } else if (filter.labelForDate === 'monthAgo') {
        this.labelMonth = this.$lang[this.langId].last_month + '\n(' +
                        moment(this.params.start).format('MMM YYYY') + ')'
      } else if (filter.labelForDate === 'last3Month') {
        this.labelMonth = this.$lang[this.langId].last_3_month + '\n(' +
                        moment(this.params.start).format('MMM YYYY') + ' - ' +
                        moment(this.params.end).format('MMM YYYY') + ')'
      } else if (filter.labelForDate === 'last6Month') {
        this.labelMonth = this.$lang[this.langId].last_6_month + '\n(' +
                        moment(this.params.start).format('MMM YYYY') + ' - ' +
                        moment(this.params.end).format('MMM YYYY') + ')'
      } else if (filter.labelForDate === 'last12Month') {
        this.labelMonth = this.$lang[this.langId].last_12_month + '\n(' +
                        moment(this.params.start).format('MMM YYYY') + ' - ' +
                        moment(this.params.end).format('MMM YYYY') + ')'
      } else if (filter.labelForDate === 'last24Month') {
        this.labelMonth = this.$lang[this.langId].last_24_month + '\n(' +
                        moment(this.params.start).format('YYYY') + ')'
      } else if (filter.labelForDate === 'last36Month') {
        this.labelMonth = this.$lang[this.langId].last_36_month + '\n(' +
                        moment(this.params.start).format('YYYY') + ' - ' +
                        moment(this.params.end).format('YYYY') + ')'
      } else if (filter.labelForDate === 'custom') {
        this.labelMonth = this.$lang[this.langId].custom + '\n(' +
                        moment(this.params.start).format('MMM YYYY') + ' - ' +
                        moment(this.params.end).format('MMM YYYY') + ')'
      }
    },

    handleChangeSize(val){
      this.params.page = 1
      this.params.currentPage = 1
      this.params.per_page = val
      this.getMovement()
    },

    handleCurrentChange(val){
      this.params.currentPage = val
      this.params.page = val
      this.getMovement()
    },

    getMovement() {
      this.isLoading = true
      this.dataHeader = []
      this.tableTotal = []
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/balancemovement'),
        headers: headers,
        params: this.params
      }).then(response => {
        this.isLoading = false
        this.dataBalance = response.data.data
        this.tableTotal.push(response.data.calculation)
        this.period = response.data.period
        this.params.per_page = response.data.meta.fper_page
        this.params.currentPage = response.data.meta.current_page
        this.params.total = response.data.meta.ftotal
        for (const property in response.data.calculation) {
          this.dataHeader.push(property);
        }

        if(this.dataBalance.length > 10){
          this.autoHeight = "500"
        }else{
          this.autoHeight = "-"
        }

        if(this.dataHeader.length > 6){
          this.autoWidth= "180" 
        }else{
          this.autoWidth = ""
        }

        for( var i = 0; i < this.dataHeader.length; i++){ 
          if ( this.dataHeader[i] === 'account_no' || this.dataHeader[i] === 'account_name') { 
            this.dataHeader.splice(i, 1); i--; 
          }
        }

      }).catch(error => {
        this.isLoading = false
        if(typeof error.response.data.error.error === 'object'){
          let errorKey = Object.keys(error.response.data.error.error)[0];
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error[errorKey][0]
          })
        } else {
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
      })
    },

    detailReport (row, idx, column ) {
      let per = this.period[idx]
      let lastParams = this.params
      let label = this.labelMonth
      let report = 'Balance Sheet'
      this.$router.push({ name:'Accounting Report - Detail', params: {data: row, period: per, periodName: column, lastParams: lastParams, label: label, report: report}})
    },

    getFileMobile(type) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let params = {
        report: this.params.report,
        start: this.params.start,
        end: this.params.end,
        // type: type,
        // sort_column: this.params.sort_column,
        // sort_type: this.params.sort_type
      }

      axios({
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/balancemovement/' + type),
        method: 'GET',
        responseType: 'blob',
        headers,
        params
      }).then((response) => {
        const file = new Blob([response.data])
        const fileName = this.$lang[this.langId].balance_sheet + '-' + this.params.start + '__' + this.params.end + '.' + type
        const url = window.URL.createObjectURL(file)
        const apiParams = '?report=' + this.params.report +  '&start=' + this.params.start + '&end='+ this.params.end
        const apiURL = '/download/api/' + this.selectedStore.url_id + '/admin/v1/' + this.langId + '/account/gainbalance/' + type
        window.location = apiURL + apiParams + ',' + fileName
      }).then(error => {
        if(typeof error.response.data.error.error === 'object'){
          let errorKey = Object.keys(error.response.data.error.error)[0];
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error[errorKey][0]
          })
        } else {
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
      })
    },

    getPDF() {
      if (this.$store.getters.webviewMode) {
        this.getFileMobile('pdf')
      } else {
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }

        let params = {
          report: this.params.report,
          start: this.params.start,
          end: this.params.end,
          type: 'pdf'
        }

        axios({
          url: baseApi(this.selectedStore.url_id, this.langId, 'account/balancemovement/pdf'),
          method: 'GET',
          responseType: 'blob',
          headers,
          params
        }).then((response) => {
          const file = new Blob([response.data])
          const fileName = this.$lang[this.langId].balance_sheet + '-' + this.params.start + '__' + this.params.end + '.pdf'
          const url = window.URL.createObjectURL(file)
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click()
        }).catch(error => {
          if(typeof error.response.data.error.error === 'object'){
            let errorKey = Object.keys(error.response.data.error.error)[0];
            this.$notify({
              tipe: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error[errorKey][0]
            })
          } else {
            this.$notify({
              tipe: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error
            })
          }
        })
      }
    },

    getExcel() {
      if (this.$store.getters.webviewMode) {
        this.getFileMobile('xlsx')
      } else {
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }

        let params = {
          report: this.params.report,
          start: this.params.start,
          end: this.params.end
        }

        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'account/balancemovement/excel'),
          responseType: 'blob',
          headers,
          params
        }).then(response => {
            const fileName = this.$lang[this.langId].balance_sheet + '-' + this.params.start + '__' + this.params.end + '.xlsx'
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
        }).catch(error => {
          if(typeof error.response.data.error.error === 'object'){
            let errorKey = Object.keys(error.response.data.error.error)[0];
            this.$notify({
              tipe: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error[errorKey][0]
            })
          } else {
            this.$notify({
              tipe: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error
            })
          }
        })
      }
    },

    capitalize(value){
      let capitalize= '';
      if(value){
        capitalize = value[0].toUpperCase() + value.slice(1);
      }
      return capitalize
    },
    
  },

  mounted() {
    this.getMonth()
    this.getMovement()
  }
}
</script>
