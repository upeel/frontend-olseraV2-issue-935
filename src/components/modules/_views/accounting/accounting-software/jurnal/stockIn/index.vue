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

      <div class="title-jurnal mb-10">
        <h4 class="my-null">
          <div class="font-bold">{{$lang[langId].upload + ' ' + $lang[langId].stock_incoming}}</div>
          <div style="float: right; margin-top: -20px;">
						<el-button @click="getStockPurchase" type="warning" size="small">
              Stock sebagai purchase
            </el-button>
						<el-button @click="handleCommandJurnal('setProductStockIn')" :type="dataProduct.length === 0 ? 'info' : 'primary'" size="small">
              {{$lang[langId].set_product}}
            </el-button>
						<el-button @click="handleCommandJurnal('setStockIn')" :type="stockInPostStatus.finishMappingDefault === 1 ? 'info' : 'primary'" size="small">
              {{$lang[langId].stock_in_default}}
            </el-button>
            <el-button type="info" @click="handleCommandSetting" style="padding: 6px; font-size: large;">
              <svg-icon icon-class="setting_ico"></svg-icon>
            </el-button>
          </div>
        </h4>
				<div class="font-12">{{$lang[langId].jurnal_stockin_text}}</div>
      </div>

      <div class="jurnalExportHeader">
        <el-row :gutter="20">
          <el-col :md="12" :sm="12" :xs="24" align="left">
            <div>
              <img src="../../../../../../../../static/img/accounting-third/jurnal-icon.png"> 
              <span class="jurnal">Jurnal</span>
            </div>
          </el-col>
          <el-col :md="12" :sm="12" :xs="24" align="right">
            <el-button
              :disabled="chosenUnpost.length === 0"
              :class="chosenUnpost.length !== 0 ? 'allowUnpost' : ''"
              size="small"
              type="info"
              @click="showDialogUnpost">
              <span>
                <svg-icon type="cloud-trash"></svg-icon>
                {{ $lang[langId].unpost }}
              </span>
            </el-button>
            <el-button
              :disabled="chosenStockIn.length === 0"
              :class="chosenStockIn.length !== 0 ? 'allowExport' : ''"
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
        <el-col :md="12" :sm="12" :xs="24" align="left">
          <el-button class="button-filter" size= "small"
            icon="el-icon-search" @click="showDialogFilter">
              {{lang.search}}
          </el-button>

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
        <div v-if="isLoading === false">
          <el-table
            ref="multipleTable"
            v-loading="isLoading"
            class="product-table-max-height mobile-fix-height-unset"
            @selection-change="handleSelectExport"
            @sort-change="changeSortTable"
            column-key="jurnal_posted_status"
            @filter-change="filterPost"
            :data="dataStockIn"
            stripe>
            <el-table-column type="selection" width="30" v-if="stockInPostStatus.finishProduct === 1" class-name="text-center">
            </el-table-column>
            <el-table-column
              prop="trans_no"
              :label="lang.transaction_no"
              sortable>
              <template slot-scope="scope">
                <router-link :to="{path: '/inventory/stocksincoming/'+ scope.row.id,
                  query: {path:'jurnalNew', pathName: 'Integrate Jurnal.ID', menu: 'stockOpname',
                  tab: 'stockOpname', lastParams: params, labelDate: labelDate} }">
                  {{ scope.row.trans_no }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column
              prop="date"
              :label="lang.date"
              sortable>
              <template slot-scope="scope">
                <span>{{scope.row.fdate}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="payment_status"
              :label="$lang[langId].payment"
              align="right"
              >
              <template slot-scope="scope">
                <div>
                  <el-tag
                    :type="scope.row.payment_status === 'open' ? 'primary' : 'success'"
                    size="mini"
                    disable-transitions>{{ scope.row.payment_status }}
                  </el-tag>
                  <!-- <span class="fl-right">{{ scope.row.payment_amount }}</span> -->
                </div>
              </template>
            </el-table-column>

            <el-table-column
              prop="post_status"
              :label="lang.status"
              align="right"
              >
              <template slot-scope="scope">
                <el-tag v-if="scope.row.post_status === 1"
                  type="success"
                  size="mini"
                  disable-transitions>{{$lang[langId].posted}}
                </el-tag>
                <el-tag v-else type="danger" disable-transitions size="mini">
                  {{$lang[langId].unposted}}
                </el-tag>
              </template>
            </el-table-column>
            <!-- <el-table-column label="" align="center" width="50">
              <template slot-scope="scope">

              </template>
            </el-table-column> -->
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
      width="40%"
      custom-class="dialog-card">
      <el-form>
        <el-form-item :label="lang.search" :label-width="formLabelWidth">
          <el-input
            v-model="params.search"
            :placeholder="lang.transaction_no+'/'+lang.warehouse_name"
            clearable
            prefix-icon="el-icon-search"
            size="small"
            style="width: 93%;">
          </el-input>
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
        <el-row :gutter="20" style="width: 100%">
          <el-col :span="12" align="left">
            <span style="line-height: 2; font-size: 15px">{{$lang[langId].upload_to}} Jurnal</span>
          </el-col>
          <el-col :span="12" align="right">
            <el-button  @click="showDialogExport">{{lang.cancel}}</el-button>
            <el-button :disabled="loadingExport" type="primary" @click="exportStockIn">
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
        <img src="../../../../../../../../static/img/accounting-third/jurnal-post.png" class="pb-16"> 
        <div class="pt-10">
          <span v-if="!loadingExport">
            {{ $lang[langId].you_sure + ' ' + lang.post }}
            <span style="color: blue"> {{chosenStockIn.length}} </span>
            {{ lang.transactions + ' ?'}}
          </span>
          <span v-else>{{$lang[langId].finish +' '+ multipleError.total_data + ' '+$lang[langId].of+' '+ this.chosenStockIn.length +' '+ $lang[langId].stock_incoming}}</span>
        </div>
      </div>
    </el-dialog>

    <el-dialog 
      :visible.sync="dialogUnpost" 
      width="40%" center
      :close-on-click-modal="false" 
      :show-close="false">
      <div align="left">
        <el-row class="mb-16" style="width: 100%; margin-top: -40px;">
          <el-col :span="12" align="left">
            <span style="line-height: 2; font-size: 18px">{{$lang[langId].unpost + ' '+ lang.sales}}</span>
          </el-col>
          <el-col :span="12" align="right">
            <el-button  @click="closeDialogUnpost">{{lang.cancel}}</el-button>
            <el-button :disabled="loadingUnpost" type="primary" @click="handleUnpost">
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
                {{ $lang[langId].unpost }}
              </span>
            </el-button>
          </el-col>
        </el-row>
        <img src="../../../../../../../../static/img/accounting-third/jurnal-post.png"> 
        <small style="font-weight: bolder;">
          {{ $lang[langId].you_sure + ' ' + $lang[langId].unpost }}
          <span style="color: blue"> {{chosenUnpost.length}} </span>
          {{ lang.sales + ' ?'}}</small>
      </div>
    </el-dialog>

    <dialog-product-income
      :show="dialogMapProductStock"
      :dataProduct="dataProduct"
			:fecthStatus="stockInPostStatus"
      @close="closeDialogProduct"
    />

		<dialog-default-stock-masuk
			:show="dialogMapStockIn"
			@close="closeDialogMap"
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
import { getStockRemainPurchase } from '@/api/accounting-3rd/jurnalid';
import { invoiceStockIn, exportMultiInvoice, unpostMultiInvoice } from '@/api/accounting-3rd/jurnalStockIn';
import Loading from 'vue-loading-overlay';
import CustomDateFilter from 'modules/CustomDateFilter';
import dialogProductIncome from './DialogProductIncome';
import DialogTrowMultipleError from "@/components/DialogTrowMultipleError";
import DialogDefaultStockMasuk from '../DialogDefaultStockMasuk';
var moment = require('moment')

export default {
  name: 'ExportToJurnalStockOpname',
  components: {
    CustomDateFilter,
    Loading,
		dialogProductIncome,
		DialogDefaultStockMasuk,
    DialogTrowMultipleError
  },

  props:['onMapping'],
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
      uploadLabelStore: false,
			nameTag: false,
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
      dataStockIn: [],
      chosenStockIn: [],
      chosenUnpost: [],
			dataProduct: [],
      dialogFilter: false,
      dialogExport: false,
      dialogUnpost: false,
      dialogProduct: false,
			dialogMapStockIn: false,
			dialogMapProductStock: false,
      stockInPostStatus: {
				finishMappingDefault: 0,
				finishProduct: 0,
        isFecth: 0,
        showfetchProductButton: 0
      },
      multipleErrorShow: false,
      multipleError: { title: '', total_data: 0, total_succed: 0, total_failed: 0, errorList: [] },
      filter:{
        post: '',
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
    this.getLastParams()
  },

  watch:{
    filter: {
      handler: function(val){
        if(val.post === ''){
          this.params.search_column.map((i, idx) => {
            if (i === 'jurnal_posted_transaction') {
              this.params.search_column.splice(idx, 1)
              this.params.search_text.splice(idx, 1)
            }
          })
        }

        if(val.post === '1' || val.post === '0'){
          if(this.params.search_column.includes('jurnal_posted_transaction') === true){
            this.params.search_column.map((i, idx) => {
              if (i === 'jurnal_posted_transaction') {
                this.params.search_text[idx] = val.post
              }
            })
          }else{
            this.params.search_column.push('jurnal_posted_transaction')
            this.params.search_text.push(val.post)
          }
        }

        this.params.page = 1
      },
      deep: true
    },
    onMapping:{
      handler: function(val){
        if(val === false){
          this.getStockIn();
        }
      },
      deep: true
    }
  },

  methods:{

    getLastParams() {
      if(Object.keys(this.$route.query).includes('lastParams') ===true){
        this.params = this.$route.query.lastParams.hasOwnProperty('start_date') ? this.$route.query.lastParams : this.params
        this.labelDate = this.$route.query.labelDate
      }else{
        this.params.start_date = moment().format('YYYY-MM-DD')
        this.params.end_date = moment().format('YYYY-MM-DD')
        this.labelDate = this.$lang[this.langId].today + '\n' +
                          moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                          moment(this.params.end_date).format('DD MMM YYYY')
      }

      this.getStockIn()
    },

     handleCommandJurnal(command){
      if(command === 'setProductStockIn'){
				this.dialogMapProductStock = true
			}else if(command === 'setStockIn'){
				this.dialogMapStockIn = true
      }else if(command === 'setting'){
        this.showSetting = true
      }
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
      this.getStockIn()
    },

    dateFilterSave(filter) {
      this.params.start_date = filter.startDate
      this.params.end_date = filter.endDate
      this.dateFilterClose()
      this.setLabelFilter(filter)
      this.getStockIn()
    },

    showDialogFilter(){
      this.dialogFilter = true
    },

    handleFilter(label) {
      this.dialogFilter = false
      this.params.page = 1
      this.getStockIn()
    },

    handleSizeChange(val) {
      this.params.page = 1
      this.params.per_page = val
      this.getStockIn()
    },
    
    handleCurrentChange(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getStockIn()
    },

    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      if (val.order === null) val.order = this.params.sort_type

      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.getStockIn()
    },

    getStockIn() {
      this.isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      invoiceStockIn(this.params).then(response => {
				let resp = response.data
        this.dataStockIn = resp.data
        this.stockInPostStatus = {
					finishMappingDefault : resp.finishMappingAccountAndVendor,
					finishProduct : resp.postReady,
					isFecth: resp.isfetchProduct,
					showfetchProductButton: resp.showfetchProductButton
				}
				this.dataProduct = resp.products.map(v => ({...v, isActive: false}))

        this.params.per_page = response.data.meta.per_page
        this.params.currentPage = response.data.meta.current_page
        this.params.total = response.data.meta.total

        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
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
    },

    handleSelectExport: function(val) {
      if (val.length > 0) {
        this.chosenStockIn = val
        val.forEach((valSelect, no) => {
          if(valSelect.post_status === 1){
            this.chosenUnpost.push(valSelect)
          }
        })
      }else{
        this.chosenSales = []
        this.chosenStockIn = []
      }
    },

    showDialogUnpost() {
      this.dialogUnpost = true
    },

    closeDialogUnpost() {
      this.chosenUnpost = []
      this.$refs.multipleTable.clearSelection();
      this.dialogUnpost = false
    },

    async handleUnpost(){
      this.loadingUnpost = true
      this.multipleError.title= 'Unpost ' + this.$lang[this.langId].stock_incoming
      const clearSelections = () => {
        this.$refs.multipleTable.clearSelection();
        this.chosenStockIn = []
        this.chosenUnpost = []
        this.dialogUnpost = false
        this.loadingUnpost = false
      }
      
      for (const item of this.chosenUnpost) {
        this.multipleError.total_data++
        await unpostMultiInvoice(item.id).then(response => {
          let result = response.data.data
					let unposted = this.dataStockIn.findIndex( x => x.id === item.id );
          this.dataStockIn[unposted].post_status = 0
          this.dataStockIn[unposted].payment_status = result.is_paid === 1 ? 'close' : 'open'

          this.multipleError.total_succed++
          if(this.multipleError.total_data === this.chosenUnpost.length) {
            clearSelections()
            if (this.multipleError.total_failed !== 0) {
              this.multipleErrorShow = true
            } else {
              this.closeErrorReport()
              this.$message({
                message: this.$lang[this.langId].success_unposting,
                type: 'success'
              })
            }
          }

        }).catch(error => {
          this.multipleError.total_failed++
          this.multipleError.errorList.push({ name: item.trans_no, desc: error.string })
          if(this.multipleError.total_data === this.chosenUnpost.length) {
            clearSelections()
            this.multipleErrorShow = true
          }
        })
      }
    },

		closeDialogProduct(){
			this.dialogMapProductStock = false
			this.dataProduct = []
			this.getStockIn()
		},

    filterPost(value){
      let keyTable = Object.keys(value)[0];
        if(value[keyTable][0]){
          if(this.params.search_column.includes('jurnal_posted_transaction') === true){
            this.params.search_column.map((i, idx) => {
              if (i === 'jurnal_posted_transaction') {
                this.params.search_text[idx] = value[keyTable][0]
              }
            })
          }else{
            this.params.search_column.push('jurnal_posted_transaction')
            this.params.search_text.push(value[keyTable][0])
          }
        }else{
          this.params.search_column.map((i, idx) => {
            if (i === 'jurnal_posted_transaction') {
              this.params.search_column.splice(idx, 1)
              this.params.search_text.splice(idx, 1)
            }
          })
        }
        this.params.page = 1
        this.getStockIn()
    },

    checkList(row, index){
      let disable = true;
      // if(row.jurnal_posted_transaction === 1){
      //   disable = false;
      // }
      return disable;
    },

    showDialogExport(){
			let show = this.dialogExport
      this.dialogExport = show ? false : true
    },

    async exportStockIn(){
      this.loadingExport = true
      this.multipleError.title= 'Post ' + this.$lang[this.langId].stock_incoming
      const clearSelections = () => {
        this.$refs.multipleTable.clearSelection();
        this.chosenStockIn = []
        this.chosenUnpost = []
        this.dialogExport = false
        this.loadingExport = false
        this.loadingUnpost = false
      }
      for (const item of this.chosenStockIn) {
        this.multipleError.total_data++
        let paramData = {id: [item.id]}
          await exportMultiInvoice(paramData).then(response => {
            let res = response.data.data
            let posted = this.dataStockIn.findIndex( x => x.id === item.id )
            this.dataStockIn[posted].post_status = 1
            this.dataStockIn[posted].payment_status = res.is_paid === 1 ? 'close' : 'open'

            this.multipleError.total_succed++
            if(this.multipleError.total_data === this.chosenStockIn.length) {
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
            if(this.multipleError.total_data === this.chosenStockIn.length) {
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

		getStockPurchase(){
			getStockRemainPurchase().then(response => {
				console.log('aaaadddd', response.data)
			})
		},

		closeDialogMap(){
			this.dialogMapStockIn = false
			this.getStockIn()
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
