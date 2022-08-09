<template>
  <div>
    <div class="content-wrapper">
      <section class="content-accounting">
        <div v-if="isSetup === 'false'">
          <el-card class="box-card" shadow="never">
            <div class="div-nodata-accounting">
              <img src="../../../../../../static/img/no-close-date.svg" class="image" style="margin-top: 32px">
              <div class="no_close" >{{$lang[langId].setup_message}}</div>
              <el-button class="btn-set" @click="dialogSetup = true">{{$lang[langId].set_up_now}}</el-button>
            </div>
          </el-card>
        </div>


        <div v-else-if="isSetup === 'true'">
  				<div class="flex-container color-warning--soft--bg color-warning p-16 radius-10 mb-24">
						<div class="mr-8">
							<svg-icon icon-class="information-circle" class="style-clock" style="font-size: 20px"/>
						</div>
						<div style="line-height: 1;">
							<div class="font-semi-bold notif-text-style">
								<span style="color: #000000">{{$lang[langId].close_book_info}}</span>
							</div>
						</div>
					</div>
          <el-card class="box-card" shadow="never">
            <div class="col-lg-10 col-md-10 col-sm-10 col-xs-12" style="text-align: -webkit-center; padding: 0" >
                <single-year-picker
                  v-model="params.year" :clearable="false" @input="handleSelectYear"
                  style="margin: 0px"
                />
              </div>
            <div class="col-lg-2 col-md-2 col-sm-2 visible-lg visible-md visible-sm text-right">
              <el-button type="success" @click="dialogCloseBook = true" >{{ $lang[langId].closing_book }}</el-button>
            </div>
            <div class="col-xs-12 visible-xs text-right" style="margin-top: 10px">
              <el-button type="success" @click="dialogCloseBook = true" >{{ $lang[langId].closing_book }}</el-button>
            </div>

            <div style="margin-top: 24px">
              <div v-if="isLoading === false">
                <el-table
                  ref="multipleTable"
                  v-loading="isLoading"
                  class="product-table-max-height mobile-fix-height-unset"
                  :data="dataClosing"
                  @sort-change="changeSortTable"
                  stripe>
                  <el-table-column
                    prop="year"
                    :label="lang.year"
                    sortable
                    width="160">
                  </el-table-column>
                  <el-table-column
                    prop="month"
                    :label="lang.month"
                    sortable>
                    <template slot-scope="scope">
                      <span>{{ capitalize(scope.row.month_name) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="status"
                    :label="lang.status">
                  </el-table-column>
                  <el-table-column
                    prop="action"
                    :label="$lang[langId].action"
                    align="right">
                    <template slot-scope="scope">
                      <div id="slide" style="float: right">
                        <el-button type="text" style="margin-right: 16px" @click="detailClosing(scope.row)">{{$lang[langId].detail}}</el-button>
                        <el-button type="text" style="color: #FF0000;" @click="showDeleteDialog(scope.row)">
                          <svg-icon icon-class="trash" stroke="#FF0000"></svg-icon>
                          {{ $lang[langId].delete }}
                        </el-button>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div v-else style="margin-top: 60px;">
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
          </el-card>
        </div>
        
        <div v-else>
          <el-card class="box-card" shadow="never">
            <loading 
              align="center"
              :active="true"
              color= '#1bb4e6'
              loader="bars"
              :width="64"
              :height="64"
              backgroundColor='#ffffff'>
            </loading>
          </el-card>
        </div>

      </section>
    </div>

		<dialog-setup :show="dialogSetup" @doneSetup="finishSetup"/>

    <el-dialog
      :visible.sync="dialogDetail"
      :show-close="false"
      fullscreen
      width="80%"
      custom-class="dialog-card">
      <div slot="title" class="flex-container" style="text-align: center">
        <el-row :gutter="20"  style="width: 100%">
          <el-col :span="14">
            <h4 class="dialog-title">{{$lang[langId].closing_detail}}</h4>
          </el-col>
          <el-col :span="10" align="right">
            <div class="btn_accounting_dialog">
              <el-button type="info" @click="handleCloseDetail">{{ lang.back }}</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <div>
        <el-table
          ref="multipleTable"
          :data="dataDetail"
          class="product-table-max-height mobile-fix-height-unset"
          stripe>
          <el-table-column
            prop="fdate"
            :label="lang.date"
            width="120">
          </el-table-column>
          <el-table-column
            prop="transaction_no"
            :label="lang.transaction_no"
            width="180">
          </el-table-column>
          <el-table-column
            prop="account_no"
            :label="$lang[langId].account_number"
            width="140">
          </el-table-column>
          <el-table-column
            prop="account_name"
            :label="$lang[langId].account_name">
            <template slot-scope="scope">
              <span>{{capitalize(scope.row.account_name)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="description"
            :label="lang.description"
            width="350">
            <template slot-scope="scope">
              <span>{{capitalize(scope.row.description)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="amount"
            :label="$lang[langId].amount_debit"
            sortable
            align="right">
            <template slot-scope="scope">
              <div v-if="scope.row.type === 'Debit'">
                {{ scope.row.famount }}
              </div>
              <div v-else>0</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="amount"
            :label="$lang[langId].amount_credit"
            sortable
            align="right">
            <template slot-scope="scope">
              <div v-if="scope.row.type !== 'Debit'">
                {{ scope.row.famount }}
              </div>
              <div v-else>0</div>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align: center">
          <el-pagination
            @size-change="handleDetailSizeChange"
            @current-change="handleDetailCurrentChange"
            :current-page.sync="paramsDetail.currentPage"
            :page-size="parseInt(paramsDetail.per_page)"
            layout="total, prev, pager, next, jumper"
            :total="paramsDetail.total"
            class="paginate">
          </el-pagination>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogCloseBook"
      :show-close="false"
      width="40%"
      custom-class="dialog-card">
      <div slot="title" class="flex-container" style="text-align: center">
        <el-row :gutter="20"  style="width: 100%">
          <el-col :span="12">
            <h4 class="dialog-title" style="padding-left: 5%; text-align: left;">{{$lang[langId].closing_book}}</h4>
          </el-col>
          <el-col :span="12" align="right">
            <div class="btn_accounting_dialog">
              <el-button type="info" @click="handleCancelClosing">{{ lang.cancel }}</el-button>
              <el-button type="success" @click="handleClosing">{{ $lang[langId].closing_book }}</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <div>
        <label style="font-size: 12px; padding: 0 0 1% 5%;">{{ $lang[langId].you_will_close_the_book_in_period }}</label>
        <div style="width: 100%; padding: 0 5% 0 5%;">
          <el-form @submit.native.prevent style="width: 100%">
            <div>
              <label style="font-size: 12px">{{ $lang[langId].pick_time }}</label>
            </div>
            <el-form-item>
              <el-date-picker
                style="width: 100%;"
                v-model="closingDate"
                :picker-options="datePickerOptions"
                format="dd MMMM yyyy"
                type="date"
                @change="handleMonthClose"
                :placeholder="$lang[langId].pick_a_day">
              </el-date-picker>
            </el-form-item>

            <el-tag size="large"
              type="danger" style="color: #606266; width: 100%; word-break: break-word;">
              <el-row :gutter="10">
                <el-col :md="2" style="padding: 4% 0 0 1%;">
                  <svg-icon icon-class="information-circle" color="#f56c6c" style="font-size: x-large"></svg-icon>
                </el-col>
                <el-col :md="22">
                  {{$lang[langId].after_the_book_close}} {{closingMonth}} {{closingYear}}
                </el-col>
              </el-row>
            </el-tag>
          </el-form>
        </div>
      </div>
    </el-dialog>
    <el-dialog 
      :title="lang.notif_warn" 
      :visible.sync="dialogDelete" 
      width="50%" center 
      :close-on-click-modal="false" 
      :show-close="false">
      <div class="text-center">
        <p>{{ $lang[langId].are_you_want_remove }}  {{ $lang[langId].closing_book }} {{ paramsDetail.month_name }} {{ paramsDetail.year}}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseDetail">{{ lang.cancel }}</el-button>
        <el-button type="danger" @click="handleRemoveClosing">{{ lang.remove }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import Loading from 'vue-loading-overlay';
import SingleYearPicker from 'components/modules/SingleYearPicker';
import mixinAccounting from '@/mixins/mixinAccounting';
import dialogSetup from 'components/modules/_views/accounting/dialogSetup';
var moment = require('moment')

export default {
  name: 'Closing',
  components: {
    SingleYearPicker,
    Loading,
		dialogSetup
  },

  mixins: [mixinAccounting],

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
  // watch: {
  //   '$store.getters.selectedStore': function () {
  //     this.getTest()
  //   }
  // },

  mounted() {
    this.accountSetup()
    this.getClosing()
  },

  data() {
    return {      
      money: {
        decimal: ',',
        thousands: '.',
        prefix: '',
        precision: 0,
        masked: false
      },
      datePickerOptions: {
        disabledDate (date) {
          return date > new Date()
        }
      },
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
      displayMovement: false,
      selectedMonth: moment(),
      isLoading: false,
      loadingMovement: false,
      dataClosing: [],
      dataDetail: [],
      dialogDetail: false,
      dialogDelete: false,
      dialogCloseBook: false,
      closingDate: moment().format('YYYY/MM/DD'),
      closingMonth: moment().locale(this.$store.state.userStores.langId).format('MMMM'),
      closingYear: moment().format('Y'),
      params: {
        year: moment().format('YYYY'),
        sort_column: 'year',
        sort_type: 'desc',
      },
      paramsDetail: {
        transaction_no: '',
        month_name: '',
        year: '',
        currentPage: 1,
        per_page: 15,
        page: 1,
        total: null
      }
    }
  },

  methods: {
    handleDetailSizeChange(val) {
      this.paramsDetail.page = 1
      this.paramsDetail.per_page = val
      this.detailClosing(this.paramsDetail)
    },
    
    handleDetailCurrentChange(val) {
      this.paramsDetail.currentPage = val
      this.paramsDetail.page = val
      this.detailClosing(this.paramsDetail)
    },

    detailClosing (row){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let params = {
        currentPage: this.paramsDetail.currentPage,
        per_page: this.paramsDetail.per_page,
        page: this.paramsDetail.page,
        total: this.paramsDetail.total,
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/closing/' + row.transaction_no),
        headers: headers,
        params: params
      }).then(response => {
        this.paramsDetail.transaction_no = row.transaction_no
        this.paramsDetail.per_page = response.data.meta.per_page
        this.paramsDetail.currentPage = response.data.meta.current_page
        this.paramsDetail.total = response.data.meta.total
        this.dataDetail = response.data.data
        this.dialogDetail = true
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
    },

    handleCloseDetail() {
        this.dataDetail = []
        this.dialogDetail = false
        this.dialogDelete = false
        this.paramsDetail = {
          transaction_no: '',
          month_name: '',
          year: ''
        }
    },

    showDeleteDialog(row) {
      this.dialogDelete = true,
      this.paramsDetail = {
        transaction_no: row.transaction_no,
        month_name: row.month_name,
        year: row.year
      }
    },

    handleRemoveClosing() {
      this.dialogDelete = false
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let no = this.paramsDetail.transaction_no

      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/closing/' + no),
        headers: headers
      }).then(response => {
        this.$message({
          type: 'success',
          message: response.data.data.message
        })
        this.paramsDetail = {
          transaction_no: '',
          month_name: '',
          year: ''
        }
        
        this.closingDate = moment().format('YYYY/MM/DD')
        this.closingMonth = moment().locale(this.$store.state.userStores.langId).format('MMMM')
        this.closingYear = moment().format('Y')
        this.getClosing()
      }).catch(error => {
        this.paramsDetail = {
          transaction_no: '',
          month_name: '',
          year: ''
        }
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

    handleSelectYear (value) {
      this.params.year = moment(value).format('YYYY')
      this.getClosing();
    },

    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      if (val.order === null) val.order = this.params.sort_type

      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.getClosing()
    },
    
    getClosing() {
      this.isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/closinglist'),
        headers: headers,
        params: this.params
      }).then(response => {
        this.dataClosing = response.data.data

        this.isLoading = false
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

    handleCancelClosing(){
      this.dialogCloseBook = false
      this.closingDate = moment().format('YYYY/MM/DD')
      this.closingMonth = moment().locale(this.$store.state.userStores.langId).format('MMMM')
      this.closingYear = moment().format('Y')
    },

    handleMonthClose(val){
      this.closingDate = val ? moment(val).format('YYYY/MM/DD') : ''
      this.closingMonth = val ? moment(val).locale(this.$store.state.userStores.langId).format('MMMM') :''
      this.closingYear = val ? moment(val).format('Y') : ''
    },

    handleClosing() {
      this.dialogCloseBook = false
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let data = {
        date: this.closingDate
      }

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/closing'),
        headers: headers,
        params: data
      }).then(response => {
        this.$message({
          type: 'success',
          message: 'Success'
        })
        this.closingDate = moment().format('YYYY/MM/DD')
        this.closingMonth = moment().locale(this.$store.state.userStores.langId).format('MMMM')
        this.closingYear = moment().format('Y')
        this.getClosing()
      }).catch(error => {
        if(typeof error.response.data.error.error === 'object'){
          let errorKey = Object.keys(error.response.data.error.error)[0];
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error[errorKey][0],
						duration: 60000
          })
        } else {
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error,
						duration: 60000
          })
        }
      })
    },
    
    onClose (e) {
      e.wait = true
      setTimeout(() => {
          e.close = true
      }, 3000)
    }
  }
}
</script>

<style lang="scss">
.paginate {
  .el-pager li {
    background: #FFFFFF !important;
  }
  .el-pager li.active {
    color: #FFFFFF;
    background:#0085CD !important;
    border-radius: 60px !important;
  }

  .el-pagination .btn-prev {
    background-color: #FFFFFF !important;
    background: #FFFFFF !important;
  }
}

.mobile-margin-xs { 
  margin-top: 7px;
}

.perpage {
  .el-input__inner {
    border: 0px solid #FFFFFF !important;
  }
}

.movementPanel {
  background-color: #FFFFFF;
  z-index: 1;
  position: absolute;
  right: 10px;
  bottom: 53px;
  top: 90px;
  width: 330px;
  box-shadow: -4px 0 0.1em #0000001F !important;
}
</style>
