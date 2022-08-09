<template>
  <div class="px-20">
    <transition  name="slide-right">
      <div v-show="showSetting" class="dialog-setting-jurnal">
        <div class="header-dialog h-56">
          <span class="color-1">{{$lang[langId].jurnal_settings}}</span>
          <el-button
            type="info"
            round
            class="button-close-dialog color-1"
            @click="handleCommandSetting">
            <svg-icon icon-class="x" />
          </el-button>
        </div>

        <el-row :gutter="20" style="margin-bottom: 20px; line-height: 2;">
          <el-col :span="24">
            <div class="biodata mb-8">
              <el-checkbox v-model="uploadLabelStore">{{$lang[langId].upload_label_store_to_jurnal}}</el-checkbox><br>
              <p class="font-12" v-html="$lang[langId].upload_url_activate_message"></p>
            </div>
						<el-divider></el-divider>
            <div class="biodata mb-8">
              <el-checkbox v-model="nameTag">{{$lang[langId].store_name_tag}}</el-checkbox><br>
              <p class="font-12" v-html="$lang[langId].store_name_tag_message"></p>
            </div>
          </el-col>
        </el-row>

        <div class="footer-dialog">
          <el-button type="primary" :disabled="loadingSetting" @click="setSetting">
            <span v-if="loadingSetting">
              <loading 
                align="center"
                :active="true"
                color= '#1bb4e6'
                loader="dots"
                :width="28"
                :height="10"
                backgroundColor='#ffffff'>
              </loading>
            </span>
            <span v-else>{{ $lang[langId].apply }}</span>
          </el-button>
        </div>
      </div>
    </transition>

    <el-card class="box-card" shadow="never">

      <div class="title-jurnal">
        <h4>
          <strong>{{$lang[langId].upload + ' ' + $lang[langId].outlay}}</strong>
          <div style="float: right; margin-top: -9px;">
            <el-button @click="handleCommandJurnal('mapExpense')" :type="activeMapTrans ? 'info' : 'primary'" size="small">
              {{$lang[langId].set_outlay_transaction_type}}
            </el-button>
            <el-button type="info" @click="handleCommandSetting" style="padding: 6px; font-size: large;">
              <svg-icon icon-class="setting_ico"></svg-icon>
            </el-button>
          </div>
        </h4>
      </div>

      <div class="jurnalExportHeader">
        <el-row :gutter="20">
          <el-col :md="12" :sm="12" :xs="24" align="left">
            <div style="cursor: pointer;">
              <img src="../../../../../../../../static/img/accounting-third/jurnal-icon.png"> 
              <span class="jurnal">Jurnal</span>
            </div>
          </el-col>
          <el-col :md="12" :sm="12" :xs="24" align="right">

            <el-button
              :disabled="chosenOutlay.length === 0"
              :class="chosenOutlay.length !== 0 ? 'allowExport' : ''"
              size="small"
              type="info"
              @click="showDialogExport">
              <span>
                <svg-icon type="cloud-upload"></svg-icon>
                {{$lang[langId].upload_to}} Jurnal</span>
            </el-button>
          </el-col>
        </el-row>
      </div>

      <el-row :gutter="10">
        <!-- <el-col :md="12" :sm="12" :xs="24" align="left">
          <el-button class="button-filter" size= "small"
            icon="el-icon-search" @click="showDialogFilter">
              {{lang.search}}
          </el-button>
        </el-col> -->
        <el-col :md="24" :sm="24" :xs="24" align="right">
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
        <div v-if="isLoading === false">
          <el-table
            ref="multipleTable"
            v-loading="isLoading"
            class="product-table-max-height mobile-fix-height-unset"
            @selection-change="handleSelectExport"
            column-key="jurnal_posted_status"
            @filter-change="filterPost"
            :data="dataOutlay"
            max-height="500"
            stripe>
            <el-table-column type="selection" width="30" class-name="text-center">
            </el-table-column>
            <el-table-column
              prop="trans_date"
              :label="lang.date"
              width="110">
              <template slot-scope="scope">
                <span>{{scope.row.ftrans_date}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="trans_no" width="180"
              :label="lang.transaction_no">
              <template slot-scope="scope">
                <!-- <router-link :to="{path: '/sales/returnorder/'+ scope.row.id,
                  query: {path:'jurnalNew', pathName: 'Integrate Jurnal.ID', menu: 'invoiceReturn',
                  tab: 'pengembalian', lastParams: params, labelDate: labelDate} }"> -->
                  {{ scope.row.trans_no }}
                <!-- </router-link> -->
              </template>
            </el-table-column>
            <el-table-column
              prop="notes"
              :label="lang.description"
              width="200">
              <template slot-scope="scope">
                <div class="word-break" v-if="scope.row.notes">{{ capitalize(scope.row.notes) }}</div>
								<el-tag  v-if="scope.row.trans_type_name"
                  type="primary" size="mini" style="font-size: 10px;">{{ capitalize(scope.row.trans_type_name) }}
								</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="debit_account_no"
              :label="$lang[langId].debit_account"
              width="180">
              <template slot-scope="scope">
                <el-select 
                  :placeholder="$lang[langId].select" 
                  filterable
                  :value="scope.row.debit_account_no"
                  @input="(value) => selectOutlay(value, scope.$index)"
                  style="width: 100%">
                  <el-option
                    v-for="item in accountOutlay"
                    :key="item.name"
                    :label="item.number + ' '+ item.name"
                    :value="item.number">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="credit_account_no"
              :label="$lang[langId].credit_account"
              width="180">
              <template slot-scope="scope">
                <span class="word-break" v-if="scope.row.credit_account_no">{{scope.row.credit_account_no + ' ' + capitalize(scope.row.credit_account_name) }}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="amount"
              :label="lang.amount"
              align="right"
              width="150">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.jurnal_posted === 1"
                  type="success" size="mini" style="font-size: 10px;"
                  disable-transitions>{{$lang[langId].posted}}
                </el-tag>
                <el-tag v-else type="danger" disable-transitions size="mini" style="font-size: 10px;">
                  {{$lang[langId].unposted}}
                </el-tag>
                <div v-if="scope.row.famount !==null">{{ scope.row.famount }}</div>
                <div v-else>0</div>
              </template>
            </el-table-column>
            <el-table-column label="" align="center" width="40">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="$lang[langId].unpost" placement="bottom">
                  <el-button :disabled="scope.row.jurnal_posted === 0" type="text" style="color: #FF0000; width: 100%; text-align: left;" @click="showDialogUnpost(scope.row)">
                    <svg-icon type="cloud-trash" stroke="#FF0000"></svg-icon>
                  </el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
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
        <div style="margin-top: 20px; margin-bottom: -55px">
          <el-select v-model="params.per_page"  @change="handleSizeChange" placeholder="Select" class="perpage" style="width: 120px">
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
    </el-card>

    <el-dialog
      :visible.sync="dialogFilter"
      class="text-left"
      width="36%"
      custom-class="dialog-card">
      <el-form>
        <el-form-item :label="lang.search" :label-width="formLabelWidth">
          <el-input
            v-model="params.search"
            :placeholder="lang.transaction_no+'/'+lang.staff_name"
            clearable
            prefix-icon="el-icon-search"
            size="small"
            style="width: 93%;">
          </el-input>
        </el-form-item>
        <el-form-item :label="lang.total" :label-width="formLabelWidth">
          <money v-model="filter.amount"
            v-bind="money"
            :prefix="selectedStore.currency_id + ' '"
            class="form-input input-sm input-money"
            style="height: 32px; width: 93%;">
          </money>
        </el-form-item>
        <el-form-item :label="$lang[langId].jurnal_post" :label-width="formLabelWidth">
          <el-radio-group v-model="filter.post" style="	border: groove; border-color: #409eff54; border-width: thin;">
            <el-radio-button label="">
              {{ lang.all }}
            </el-radio-button>
            <el-radio-button label="1">
              {{ this.$lang[langId].posted }}
            </el-radio-button>
            <el-radio-button label="0">
              {{ this.$lang[langId].unposted }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleFilter">{{ $lang[langId].filter }}</el-button>
      </span>
    </el-dialog>

    <el-dialog  
      :visible.sync="dialogExport" 
      width="34%" center
      :close-on-click-modal="false" 
      :show-close="false">

      <div slot="title" class="flex-container">
        <el-row :gutter="20"  style="width: 100%">
          <el-col :span="12" align="left">
            <span style="line-height: 2; font-size: 15px">{{$lang[langId].upload_to}} Jurnal</span>
          </el-col>
          <el-col :span="12" align="right">
            <el-button  @click="closeDialogExport">{{lang.cancel}}</el-button>
            <el-button :disabled="loadingExport" type="primary" @click="exportOutlay">
              <loading
                v-if="loadingExport"
                :active="true"
                color= '#1bb4e6'
                loader="dots"
                :width="28"
                :height="10"
                backgroundColor='#ffffff'>
              </loading>
              <span v-else>
                {{ lang.post }}
              </span>
            </el-button>
          </el-col>
        </el-row>
      </div>

      <div align="left">
        <img src="../../../../../../../../static/img/accounting-third/jurnal-post.png"> 
        <div class="pt-10">
          <span v-if="!loadingExport" style="font-weight: bolder;">
            {{ $lang[langId].you_sure + ' ' + lang.post }}
            <span style="color: blue"> {{chosenOutlay.length}} </span>
            {{ $lang[langId].outlay_to + ' Jurnal ?'}}
          </span>
          <span v-else>{{$lang[langId].finish +' '+ multipleError.total_data + ' '+$lang[langId].of+' '+ this.chosenOutlay.length +' '+ $lang[langId].outlay}}</span>
        </div>
      </div>
    </el-dialog>

    <el-dialog 
      :title="lang.notif_warn" 
      :visible.sync="dialogUnpost" 
      width="50%" center
      :close-on-click-modal="false" 
      :show-close="false">
      <div class="text-center">
        <p>{{ $lang[langId].are_you_want_to_unpost }}</p>
        <p style="font-weight: bold;">{{ unpostData.trans_no }} - {{capitalize(unpostData.trans_type_name)}} - {{unpostData.famount}}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="loadingUnpost" type="danger" @click="handleUnpost">
          <loading
            v-if="loadingUnpost"
            :active="true"
            color= '#1bb4e6'
            loader="dots"
            :width="28"
            :height="10"
            backgroundColor='#ffffff'>
          </loading>
          <span v-else>
            {{ lang.yes }}
          </span>
          </el-button>
        <el-button  @click="closeDialogUnpost">{{lang.no}}</el-button>
      </span>
    </el-dialog>

    <dialog-jurnal-transaction-type
      :show="dialogMapTrans"
      activeTab="outlay"
      @close="closeMapTransaction"
    />

    <dialog-trow-multiple-error
      :show="multipleErrorShow"
      :error-list="multipleError"
      @close="closeErrorReport"
    />

    <custom-date-filter
      :show-filter="showFilter"
      @close="dateFilterClose"
      @reset="dateFilterReset"
      @save="dateFilterSave"
    />

  </div>
</template>

<script>
import {baseApi} from 'src/http-common'
import axios from 'axios'
import Loading from 'vue-loading-overlay';
import CustomDateFilter from 'modules/CustomDateFilter'
import DialogJurnalTransactionType from '../DialogJurnalTransactionType.vue';
import DialogTrowMultipleError from "@/components/DialogTrowMultipleError";
import { invoiceExpense, exportJurnalExpense, unpostMultiExpense } from '@/api/accounting-3rd/jurnalExpense';
var moment = require('moment')

export default {
  name: 'ExportToJurnalOutlay',
  components: {
    CustomDateFilter,
    Loading,
    DialogJurnalTransactionType,
    DialogTrowMultipleError
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
  },
  data(){
    return{
      showSetting: false,
      loadingSetting: false,
      autoInject: false,
      uploadLabelStore: false,
			nameTag: false,
      activeMapTrans: false,
      dialogMapTrans: false,
      money: {
        decimal: ',',
        thousands: '.',
        prefix: '',
        precision: 0,
        masked: false
      },
      isLoading: false,
      loadingExport: false,
      loadingUnpost: false,
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
      labelDate: '',
      showFilter: false,
      formLabelWidth: '115px',
      dataOutlay: [],
      chosenOutlay: [],
      accountOutlay: [],
      unpostData: {},
      dialogFilter: false,
      dialogExport: false,
      dialogUnpost: false,
      multipleErrorShow: false,
      multipleError: { title: '', total_data: 0, total_succed: 0, total_failed: 0, errorList: [] },
      filter:{
        amount: 'post',
        post: ''
      },
      params:{
        search: '',
        search_column: [],
        search_text: [],
        sort_column: '',
        sort_type: '',
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
    // this.getAutoInject()
    this.getLastParams()
    this.getAccountOutlay()
  },

  watch:{
    filter: {
      handler: function(val){
        if(val.post === ''){
          this.params.search_column.map((i, idx) => {
            if (i === 'jurnal_posted') {
              this.params.search_column.splice(idx, 1)
              this.params.search_text.splice(idx, 1)
            }
          })
        }

        if(val.post === '1' || val.post === '0'){
          if(this.params.search_column.includes('jurnal_posted') === true){
            this.params.search_column.map((i, idx) => {
              if (i === 'jurnal_posted') {
                this.params.search_text[idx] = val.post
              }
            })
          }else{
            this.params.search_column.push('jurnal_posted')
            this.params.search_text.push(val.post)
          }
        }
        this.params.page = 1
      },
      deep: true
    },

  },

  methods:{

    getLastParams() {
      if(Object.keys(this.$route.query).includes('lastParams') === true){
        this.params = this.$route.query.lastParams.hasOwnProperty('start_date') ? this.$route.query.lastParams : this.params
        this.labelDate = this.$route.query.labelDate
      }else{
        this.params.start_date = moment().format('YYYY-MM-DD')
        this.params.end_date = moment().format('YYYY-MM-DD')
        this.labelDate = this.$lang[this.langId].today + '\n' +
                          moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                          moment(this.params.end_date).format('DD MMM YYYY')
      }

      this.getOutlay()
    },

    handleCommandJurnal(command){
      if(command === 'mapExpense'){
        this.dialogMapTrans = true
      }else if(command === 'setting'){
        this.showSetting = true
      }
    },

    
    closeMapTransaction(){
      this.dialogMapTrans = false
    },

    getAutoInject(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/inject'),
        headers:headers,
      }).then(response => {
        this.autoInject = response.data.injectStatus
      }).catch(error => {
        if(typeof error.response.data.error.error === 'object'){
          let errorKey = Object.keys(error.response.data.error.error)[0];
          this.$notify({
            type: 'warning',
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
        this.isLoading = false
      })
    },

    handleCommandSetting(){
      let show = this.showSetting
      if(show === false){
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/setting'),
          headers:headers,
        }).then(response => {
          this.autoInject = response.data.injectStatus === 1 ? true : false
          this.uploadLabelStore = response.data.urlInTransaction === 1 ? true : false
					this.nameTag = response.data.name_taq === 1 ? true : false
        }).catch(error => {
          if(typeof error.response.data.error.error === 'object'){
            let errorKey = Object.keys(error.response.data.error.error)[0];
            this.$notify({
              type: 'warning',
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
      
      this.showSetting = show ? false : true
    },

    setSetting(){
      this.loadingSetting = true

      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let data = ''

      if(this.jurnalType === '1'){
        data = {
          url : this.uploadLabelStore ? 1 : 0,
          inject: this.autoInject ? 1 : 0,
					name_taq: this.nameTag ? 1 : 0
        }
      }else{
        data = {
          url : this.uploadLabelStore ? 1 : 0,
					name_taq: this.nameTag ? 1 : 0
        }
      }

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/setting'),
        headers:headers,
        data
      }).then(response => {
        this.loadingSetting = false
        this.showSetting = false
        this.$message({
          message: this.$lang[this.langId].success_apply,
          type: 'success'
        })
      }).catch(error => {
        if(typeof error.response.data.error.error === 'object'){
          let errorKey = Object.keys(error.response.data.error.error)[0];
          this.$notify({
            type: 'warning',
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
        this.loadingSetting = false
      })
    },

    showSettingTrans(){
      let show = this.showSetting

      this.showSetting = show ? false : true
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
      this.getOutlay()
    },

    dateFilterSave(filter) {
      this.params.start_date = filter.startDate
      this.params.end_date = filter.endDate
      this.dateFilterClose()
      this.setLabelFilter(filter)
      this.getOutlay()
    },

    showDialogFilter(){
      this.dialogFilter = true
    },

    handleFilter(label) {
      this.dialogFilter = false
      this.params.page = 1
      if(this.filter.amount !== 0){
        if(this.params.search_column.includes('int_total_amount') === false){
          this.params.search_column.push('int_total_amount')
          this.params.search_text.push(this.filter.amount)
        }else{
          this.params.search_column.map((i, idx) => {
            if (i === 'int_total_amount') {
              this.params.search_column.splice(idx, 1)
              this.params.search_text.splice(idx, 1)
            }
          })
        }
      } else {
        this.params.search_column.map((i, idx) => {
          if (i === 'int_total_amount') {
            this.params.search_column.splice(idx, 1)
            this.params.search_text.splice(idx, 1)
          }
        })
      }
      this.getOutlay()
    },

    handleSizeChange(val) {
      this.params.page = 1
      this.params.per_page = val
      this.getOutlay()
    },
    
    handleCurrentChange(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getOutlay()
    },

    // changeSortTable(val) {
    //   if (val.order === 'ascending') val.order = 'asc'
    //   if (val.order === 'descending') val.order = 'desc'
    //   if (val.order === null) val.order = this.params.sort_type

    //   this.params.sort_type = val.order
    //   this.params.sort_column = val.prop
    //   this.getOutlay()
    // },

    getOutlay() {
      this.isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/extrans'),
        headers:headers,
        params: this.params
      }).then(response => {
        this.dataOutlay = response.data.data

        this.params.per_page = response.data.meta.per_page
        this.params.currentPage = response.data.meta.current_page
        this.params.total = response.data.meta.total

        this.isLoading = false
      }).catch(error => {
        if(typeof error.response.data.error.error === 'object'){
          let errorKey = Object.keys(error.response.data.error.error)[0];
          this.$notify({
            type: 'warning',
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
        this.isLoading = false
      })
    },

    getAccountOutlay(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/account/expense'),
        headers: headers
      }).then(response => {
        this.accountOutlay = response.data.data
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

    handleSelectExport: function(val) {
      if (val.length > 0) {
        this.chosenOutlay = val
      }else{
        this.chosenOutlay = []
      }
    },

    selectOutlay(value, rowKey){
      this.accountOutlay.map((item, index) => {
        if(item.number === value){
          this.dataOutlay[rowKey].debit_account_no = item.number
          this.dataOutlay[rowKey].debit_account_name = item.name
        }
      })
    },

    showDialogUnpost(row) {
      this.unpostData = row
      this.dialogUnpost = true
    },

    closeDialogUnpost(row) {
      this.unpostData = {}
      this.dialogUnpost = false
    },

    handleUnpost(){
      this.loadingUnpost = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let id = this.unpostData.id
      unpostMultiExpense(id).then(response => {
        let result = response.data.data
        this.dialogUnpost = false
        this.loadingUnpost = false
        this.dataOutlay.forEach((val, no) => {
          if(val.id === parseInt(result.id)){
            this.dataOutlay[no].jurnal_posted = 0
          }
        })
        
        this.$message({
          type: 'success',
          message: this.$lang[this.langId].success_cancelled
        })

      }).catch(error => {
        if(typeof error.response.data.error.error === 'object'){
          let errorKey = Object.keys(error.response.data.error.error)[0];
          this.$notify({
            type: 'warning',
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
        this.loadingUnpost = false;
      })
    },

    filterPost(value){
      let keyTable = Object.keys(value)[0];
        if(value[keyTable][0]){
          if(this.params.search_column.includes('jurnal_posted') === true){
            this.params.search_column.map((i, idx) => {
              if (i === 'jurnal_posted') {
                this.params.search_text[idx] = value[keyTable][0]
              }
            })
          }else{
            this.params.search_column.push('jurnal_posted')
            this.params.search_text.push(value[keyTable][0])
          }
        }else{
          this.params.search_column.map((i, idx) => {
            if (i === 'jurnal_posted') {
              this.params.search_column.splice(idx, 1)
              this.params.search_text.splice(idx, 1)
            }
          })
        }
        this.params.page = 1
        this.getOutlay()
    },

    checkList(row, index){
      let disable = true;
      if(row.jurnal_posted === 1){
        disable = false;
      }
      return disable;
    },

    showDialogExport(){
      this.dialogExport = true
    },

    closeDialogExport(){
      this.dialogExport = false
      this.chosenOutlay = []
      this.getOutlay()
    },

    async exportOutlay(){
      this.loadingExport = true;
      this.multipleError.title= 'Post ' + this.$lang[this.langId].outlay
      const clearSelections = () => {
        this.chosenOutlay = []
        this.$refs.multipleTable.clearSelection();
        this.dialogExport = false
        this.loadingExport = false
      }

      for (const item of this.chosenOutlay) {
        this.multipleError.total_data++
        let data = {
          id: item.id,
          debit_account_no: item.debit_account_no,
          debit_account_name: item.debit_account_name,
          credit_account_no: item.credit_account_no,
          credit_account_name: item.credit_account_name
        }
				await exportJurnalExpense(data).then(response => {
					let res = response.data.data
					this.dataOutlay.forEach((val, no) => {
						if(parseInt(res.id) === val.id){
							this.dataOutlay[no].jurnal_posted = res.jurnal_posted
						}
					})
          this.multipleError.total_succed++
          if(this.multipleError.total_data === this.chosenOutlay.length) {
            clearSelections()
            if (this.multipleError.total_failed !== 0) {
              this.multipleErrorShow = true
            } else {
              this.closeErrorReport()
              this.$message({
                message: this.$lang[this.langId].success_posting,
                type: 'success'
              })
            }
          }
				}).catch(error => {
          this.multipleError.total_failed++
          this.multipleError.errorList.push({ name: item.trans_no, desc: error.string })
          if(this.multipleError.total_data === this.chosenOutlay.length) {
            clearSelections()
            this.multipleErrorShow = true
          }
      	})
      }
    },

    closeErrorReport() {
      this.multipleErrorShow = false
      this.multipleError = { title: '', total_data: 0, total_succed: 0, total_failed: 0, errorList: [] }
    },

    capitalize(value){
      let capitalize= '';
      if(value){
        capitalize = value[0].toUpperCase() + value.slice(1);
      }
      return capitalize;
    },

    formatPrice(value) {
        let val = (value/1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
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

  .perpage {
    .el-input__inner {
      border: 0px solid #FFFFFF !important;
    }
  }

  .cart-items {
    float: none;
    padding: 0;
    // li {
    //   padding: 8px 0 8px 0;
    // }
    h5 {
      font-weight: 600;
      margin-top: 2px;
      margin-bottom: 0;
    }
  }
</style>
