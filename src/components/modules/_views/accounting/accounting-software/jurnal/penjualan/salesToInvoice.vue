<template>
  <div>
    <el-card class="box-card" shadow="never">

      <div class="title-jurnal">
        <h4>
          <strong>{{$lang[langId].upload_sales}}</strong>
          <div style="float: right; margin-top: -9px;">
              <el-button @click="handleCommandJurnal('mapCustomer')" :type="invoicePostStatus.finishProductCustomer === 1 ? 'info' : 'primary'" size="small">
                {{$lang[langId].set_jurnal_sales}}
              </el-button>
              <el-button @click="handleCommandJurnal('productName')" :type="invoicePostStatus.finishMapingStatus === 1 ? 'info' : 'primary'" size="small">
                {{$lang[langId].set_account_name_product_tax_payment}}
              </el-button>
              <el-button type="info" @click="handleCommandJurnal('setting')" style="padding: 6px; font-size: large;">
                <svg-icon icon-class="setting_ico"></svg-icon>
              </el-button>
          </div>
        </h4>
      </div>

      <div class="jurnalExportHeader">
        <el-row :gutter="20">
          <el-col :md="12" :sm="12" :xs="24" align="left">
            <el-tooltip class="item" effect="dark" :content="tooltipMessage" placement="bottom">
              <div @click="handleInfo" style="cursor: pointer;">
                <img src="../../../../../../../../static/img/accounting-third/jurnal-icon.png"> 
                <span class="jurnal">Jurnal</span>
              </div>
            </el-tooltip>
          </el-col>
          <el-col :md="12" :sm="12" :xs="24" align="right">
            <el-button
              :disabled="chosenUnpost.length === 0 || buttonPostStatus === false"
              :class="chosenUnpost.length !== 0 || buttonPostStatus ? 'allowUnpost' : ''"
              size="small"
              type="info"
              @click="showDialogUnpost">
              <span>
                <svg-icon type="cloud-trash"></svg-icon>
                {{ $lang[langId].unpost }}
              </span>
            </el-button>
            <el-button
              :disabled="chosenSales.length === 0 || buttonPostStatus === false"
              :class="chosenSales.length !== 0 || buttonPostStatus ? 'allowExport' : ''"
              size="small"
              type="info"
              @click="showDialogExport">
              <span>
                <svg-icon type="cloud-upload"></svg-icon>
                {{$lang[langId].upload_to}} Jurnal</span>
            </el-button>
          </el-col>
          <el-col :span="24" v-if="messageHidden === false">
            <el-tag @click="handleInfo" size="large" class="tag-jurnal-info">
              <h4 align="center">
                <strong>{{$lang[langId].infoExportJurnal}}</strong>
              </h4>
              <p v-html="$lang[langId].export_sales_to_jurnal_invoice_info"></p>
            </el-tag>
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
            :data="dataSales"
            stripe>
            <el-table-column v-if="buttonPostStatus" type="selection" width="30" class-name="text-center">
            </el-table-column>
            <el-table-column
              prop="order_no"
              :label="lang.order_no"
              sortable
              width="177">
              <template slot-scope="scope">
                <router-link :to="{ name: 'Jurnal Upload Sales Detail', query: {
                  id: scope.row.id, lastParams: params, labelDate: labelDate, 
                  fecthStatus: fecthStatus, fecthCustomer: fecthCustomer}}">
                  {{ scope.row.order_no }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column
              prop="order_date"
              :label="lang.sales_date"
              sortable
              width="130">
              <template slot-scope="scope">
                <span>{{scope.row.forder_date}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="customer_name"
              :label="lang.customers"
              sortable>
              <template slot-scope="scope">
                <span>{{ capitalize(scope.row.customer_name) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="fdue_date"
              :label="lang.due_date"
              width="115">
              <template slot-scope="scope">
                <span>{{scope.row.fdue_date ? scope.row.fdue_date : '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="int_total_amount"
              :label="lang.total_price"
              sortable
              align="right">
              <template slot-scope="scope">
                <div v-if="scope.row.ftotal_amount !==null">{{ scope.row.ftotal_amount }}</div>
                <div v-else>IDR 0</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="jurnal_posted_transaction"
              :label="$lang[langId].jurnal_status"
              width="130"
              :filters="[{ text: $lang[langId].posted, value: '1' }, { text: $lang[langId].unposted, value: '0' }]"
              :filter-multiple="false"
              >
              <template slot-scope="scope">
                <el-tag v-if="scope.row.jurnal_posted_transaction === 1"
                  type="success"
                  size="mini"
                  disable-transitions>{{$lang[langId].posted}}
                </el-tag>
                <el-tag v-else type="danger" disable-transitions size="mini">
                  {{$lang[langId].unposted}}
                </el-tag>
                <el-tag v-if="scope.row.jurnal_payment === 1"
                  type="success" size="mini"
                  disable-transitions>{{$lang[langId].paid}}
                </el-tag>
                <el-tag v-else type="danger" disable-transitions size="mini">
                  {{$lang[langId].unpaid}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="" align="center" width="40">
              <template slot-scope="scope">
                <el-dropdown trigger="click">
                  <el-button type="text" icon="el-icon-more" style="color:#909399"></el-button>
                  <el-dropdown-menu slot="dropdown" style="background-color: #F2F2F2;">
                    <el-dropdown-item  style="padding: 0px">
                      <el-button v-if="scope.row.jurnal_payment === 1" type="text" class="accounting-dropBtn" @click="showDeletePayment(scope.row)">
                        <svg-icon icon-class="no-cash"></svg-icon>
                        {{ $lang[langId].delete_payment }}
                      </el-button>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
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
      width="40%"
      custom-class="dialog-card">
      <el-form>
        <el-form-item :label="lang.search" :label-width="formLabelWidth">
          <el-input
            v-model="params.search"
            :placeholder="lang.transaction_no+'/'+lang.customer_name"
            clearable
            prefix-icon="el-icon-search"
            size="small"
            style="width: 93%;">
          </el-input>
        </el-form-item>
        <el-form-item :label="lang.order_totals" :label-width="formLabelWidth">
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
        <el-form-item :label="$lang[langId].payment" :label-width="formLabelWidth">
          <el-radio-group v-model="filter.payment" style="	border: groove; border-color: #409eff54; border-width: thin;">
            <el-radio-button label="">
              {{ lang.all }}
            </el-radio-button>
            <el-radio-button label="1">
              {{ this.$lang[langId].paid }}
            </el-radio-button>
            <el-radio-button label="0">
              {{ this.$lang[langId].unpaid }}
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
      :show-close="false"
      style="padding-top: 120px;"> 
      <div slot="title" class="flex-container">
        <el-row style="width: 100%;">
          <el-col :span="12" align="left">
            <span style="line-height: 2; font-size: 18px">{{$lang[langId].upload_to}} Jurnal</span>
          </el-col>
          <el-col :span="12" align="right">
            <el-button :disabled="loadingExport" @click="closeDialogExport">{{lang.cancel}}</el-button>
            <el-button :disabled="loadingExport" type="primary" @click="exportSales">
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
        <!-- <el-row :gutter="20" class="mb-30" style="margin-top: -180px;">
          <el-col :span="24" align="left">
            <div class="pointer" @click="showJurnalFlow">
              <el-tag class="w-fit word-break color-black p-10" type="danger" align="justify" disable-transitions size="mini" style="margin-left: -25px; min-width: 430px;">
                <span v-html="$lang[langId].jurnal_flow_info"></span>
                <img src="../../../../../../../../static/img/accounting-third/jurnal-menu3.svg"> 
              </el-tag>
            </div>
          </el-col>
        </el-row> -->
    
        <img src="../../../../../../../../static/img/accounting-third/jurnal-post.png"> 
        <div class="pt-10">
          <span v-if="!loadingExport">
            {{ $lang[langId].you_sure + ' ' + lang.post }}
            <span style="color: blue"> {{chosenSales.length}} </span>
            {{ $lang[langId].sales_to + ' Jurnal ?'}}
          </span>
          <span v-else>{{$lang[langId].finish +' '+ multipleError.total_data + ' '+$lang[langId].of+' '+ this.chosenSales.length +' '+ $lang[langId].sales}}</span>
        </div>
      </div>
    </el-dialog>

    <dialog-info-jurnal
      :show="dialogJurnalFlow"
      @okClick="showJurnalFlow"
    />

    <el-dialog 
      :visible.sync="dialogUnpost" 
      width="40%" center
      :close-on-click-modal="false" 
      :show-close="false">
      <div slot="title" class="flex-container">
        <el-row style="width: 100%;">
          <el-col :span="12" align="left">
            <span style="line-height: 2; font-size: 18px">{{$lang[langId].unpost + ' '+ lang.sales}}</span>
          </el-col>
          <el-col :span="12" align="right">
            <el-button :disabled="loadingUnpost" @click="closeDialogUnpost">{{lang.cancel}}</el-button>
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
      </div>
      <div align="left">
        <img src="../../../../../../../../static/img/accounting-third/jurnal-post.png"> 
        <div class="pt-10">
          <span v-if="!loadingUnpost">
            {{ $lang[langId].you_sure + ' ' + $lang[langId].unpost }}
            <span style="color: blue"> {{chosenUnpost.length}} </span>
            {{ lang.sales + ' ?'}}
          </span>
          <span v-else>{{$lang[langId].finish +' '+ multipleError.total_data + ' '+$lang[langId].of+' '+ this.chosenUnpost.length +' '+ $lang[langId].sales}}</span>
        </div>
      </div>
    </el-dialog>

    <el-dialog 
      :title="lang.notif_warn" 
      :visible.sync="dialogDeletePayment" 
      width="50%" center
      :close-on-click-modal="false" 
      :show-close="false">
      <div class="text-center">
        <p>{{ $lang[langId].are_you_sure_to_delete_jurnal_sales_payment }}</p>
        <p style="font-weight: bold;">{{ paymentData.order_no }} - {{capitalize(paymentData.customer_name)}} - {{paymentData.ftotal_amount}}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="loadingDelPayment" type="danger" @click="handleDeletePayment">
          <loading
            v-if="loadingDelPayment"
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
        <el-button  @click="closeDeletePayment">{{lang.no}}</el-button>
      </span>
    </el-dialog>

    <dialog-jurnal-map-customer-product
      :show="dialogMapCustomer"
      :dataProduct="dataPostProduct"
      :dataCustomer="dataPostCustomer"
      :fecthStatus="invoicePostStatus"
      @close="closeMapCustomer"
    />

    <dialog-jurnal-account-product-tax
      :show="dialogAccountProduct"
      @close="closeAccountNameProduct"
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
import Loading from 'vue-loading-overlay';
import { listSales, exportMultiSales, unpostMultiSales, salesDeletePayment, salesInfo } from '@/api/accounting-3rd/jurnalSales';
import CustomDateFilter from 'modules/CustomDateFilter';
import DialogInfoJurnal from '../DialogInfoJurnal';
import DialogJurnalAccountProductTax from '../DialogJurnalAccountProductTax';
import DialogTrowMultipleError from "@/components/DialogTrowMultipleError";
import DialogJurnalMapCustomerProduct from '../DialogJurnalMapCustomerProduct.vue';
import InviteMemberVue from '../../../../marketing/InviteMember.vue';
var moment = require('moment')

export default {
  name: 'ExportToJurnalSales',
  components: {
    DialogInfoJurnal,
    CustomDateFilter,
    DialogJurnalMapCustomerProduct,
    DialogJurnalAccountProductTax,
    DialogTrowMultipleError,
    Loading
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
      loadingDelPayment: false,
      buttonPostStatus: false,
      messageHidden: true,
      fecthStatus: 0,
      fecthCustomer: 0,
      tooltipMessage: '',
      dataPostProduct: [],
      dataPostCustomer: [],
      invoicePostStatus: {
        finishProductCustomer: 0,
        finishMapingStatus: 0,
        isFecth: 0,
        isfetchCustomer: 0,
        showfetchCustomerButton: 0,
        showfetchProductButton: 0
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
      labelDate: '',
      showFilter: false,
      formLabelWidth: '115px',
      dataSales: [],
      chosenSales: [],
      chosenUnpost: [],
      paymentData: {},
      dialogFilter: false,
      dialogExport: false,
      dialogJurnalFlow: false,
      dialogUnpost: false,
      dialogDeletePayment: false,
      dialogMapCustomer: false,
      dialogAccountProduct: false,
      multipleErrorShow: false,
      multipleError: { title: '', total_data: 0, total_succed: 0, total_failed: 0, errorList: [] },
      filter:{
        amount: 'post',
        post: '',
        payment: '0'
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

        if(val.payment === ''){
          this.params.search_column.map((i, idx) => {
            if (i === 'jurnal_payment') {
              this.params.search_column.splice(idx, 1)
              this.params.search_text.splice(idx, 1)
            }
          })
        }

        if(val.payment === '1' || val.payment === '0'){
          if(this.params.search_column.includes('jurnal_payment') === true){
            this.params.search_column.map((i, idx) => {
              if (i === 'jurnal_payment') {
                this.params.search_text[idx] = val.payment
              }
            })
          }else{
            this.params.search_column.push('jurnal_payment')
            this.params.search_text.push(val.payment)
          }
        }
        this.params.page = 1
      },
      deep: true
    },
    onMapping:{
      handler: function(val){
        if(val === false){
          this.getSales();
        }
      },
      deep: true
    }
  },

  methods:{
    getLastParams() {
      if(Object.keys(this.$route.query).includes('lastParams') ===true){
        this.params = this.$route.query.lastParams.hasOwnProperty('start_date')? this.$route.query.lastParams : this.params
        this.labelDate = this.$route.query.labelDate
      }else{
        this.params.start_date = moment().format('YYYY-MM-DD')
        this.params.end_date = moment().format('YYYY-MM-DD')
        this.labelDate = this.$lang[this.langId].today + '\n' +
                          moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                          moment(this.params.end_date).format('DD MMM YYYY')
      }

      this.getSales()
    },

    handleCommandJurnal(command){
      if(command === 'productName'){
        this.dialogAccountProduct = true
      }else if(command === 'mapCustomer'){
        this.dialogMapCustomer = true
      }else if(command === 'setting'){
        this.$emit('settingJurnal')
      }
    },

    closeMapCustomer(){
      if(this.dataPostProduct.length === 0 && this.dataPostCustomer.length === 0){
        this.invoicePostStatus.finishProductCustomer = 1
        this.buttonPostStatus = true
      }
      this.dialogMapCustomer = false
    },

    closeAccountNameProduct(){
      this.dialogAccountProduct = false
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
      this.getSales()
    },

    dateFilterSave(filter) {
      this.params.start_date = filter.startDate
      this.params.end_date = filter.endDate
      this.dateFilterClose()
      this.setLabelFilter(filter)
      this.getSales()
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
      this.getSales()
    },

    handleSizeChange(val) {
      this.params.page = 1
      this.params.per_page = val
      this.getSales()
    },
    
    handleCurrentChange(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getSales()
    },

    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      if (val.order === null) val.order = this.params.sort_type

      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.getSales()
    },

    getSales() {
      this.isLoading = true

      listSales(this.params).then(response => {
        this.dataSales = response.data.data
        this.buttonPostStatus = response.data.buttonPostStatus === 1 ? true : false
        this.messageHidden = response.data.message_hidden === 1 ? true : false
        this.tooltipMessage = response.data.message_hidden === 1 ? 
          this.$lang[this.langId].showExportInfo : this.$lang[this.langId].hideExportInfo
        this.fecthStatus = response.data.isfetchProduct
        this.fecthCustomer = response.data.isfetchCustomer
        this.params.per_page = response.data.meta.per_page
        this.params.currentPage = response.data.meta.current_page
        this.params.total = response.data.meta.total

        this.dataPostCustomer = response.data.productAndSupplier.customer.map(v => ({...v, isActive: false}))
        this.dataPostProduct = response.data.productAndSupplier.product.map(v => ({...v, isActive: false}))

        this.invoicePostStatus = {
          finishProductCustomer: response.data.finishProductCustomer,
          finishMapingStatus: response.data.finishMapingStatus,
          isFecth: response.data.isfetchProduct,
          isfetchCustomer: response.data.isfetchCustomer,
          showfetchCustomerButton: response.data.showfetchCustomerButton,
          showfetchProductButton: response.data.showfetchProductButton
        }
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

    handleSelectExport: function(val) {
      if (val.length > 0) {
        this.chosenSales = val
        val.forEach((valSelect, no) => {
          if(valSelect.jurnal_posted_transaction === 1){
            this.chosenUnpost.push(valSelect)
          }
        })
      }else{
        this.chosenSales = []
        this.chosenUnpost = []
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
      this.multipleError.title= 'Unpost ' + this.$lang[this.langId].sales

      const clearSelections = () => {
        this.$refs.multipleTable.clearSelection();
        this.chosenSales = []
        this.chosenUnpost = []
        this.dialogUnpost = false
        this.loadingUnpost = false
      }

      for (const item of this.chosenUnpost) {
        this.multipleError.total_data++
        await unpostMultiSales(item.id).then(response => {
          let result = response.data.data
          this.dataSales.forEach((val, no) => {
            if(val.id === result.id){
              this.dataSales[no].jurnal_posted_transaction = result.jurnal_posted_transaction
              this.dataSales[no].jurnal_payment = result.jurnal_payment
            }
          })

          this.multipleError.total_succed++
          if(this.multipleError.total_data === this.chosenUnpost.length) {
            clearSelections()
            if (this.multipleError.total_failed !== 0) {
              this.closeErrorReport()
              this.multipleErrorShow = true
            } else {
              this.$message({
                type: 'success',
                message: this.$lang[this.langId].success_cancelled
              })
            }
          }

        }).catch(error => {
          this.multipleError.total_failed++
          this.multipleError.errorList.push({ name: item.order_no, desc: error.string })
          if(this.multipleError.total_data === this.chosenUnpost.length) {
            clearSelections()
            this.multipleErrorShow = true
          }
        })
      }
    },

    showDeletePayment(row){
      this.paymentData = row
      this.dialogDeletePayment = true
    },

    closeDeletePayment(){
      this.paymentData = {}
      this.dialogDeletePayment = false
    },

    handleDeletePayment(){
      this.loadingDelPayment = true

      let id = this.paymentData.id
      salesDeletePayment(id).then(response => {
        let result = response.data.data
        this.dataSales.forEach((val, no) => {
          if(val.id === parseInt(result.id)){
            this.dataSales[no].jurnal_payment = 0
          }
        })
        this.$message({
          type: 'success',
          message: this.$lang[this.langId].success_delete
        })
        this.dialogDeletePayment = false
        this.loadingDelPayment = false
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
        this.loadingDelPayment = false;
      })
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
        this.getSales()
    },

    checkList(row, index){
      let disable = true;
      // if(row.jurnal_posted_transaction === 1){
      //   disable = false;
      // }
      return disable;
    },

    showDialogExport(){
      this.dialogExport = true
    },

    showJurnalFlow(){
      let show = this.dialogJurnalFlow
      if(show){
        this.dialogJurnalFlow = false
        this.dialogExport = true
      }else{
        this.dialogJurnalFlow = true
        this.dialogExport = false
      }
    },

    closeDialogExport(){
      this.dialogExport = false
      this.$refs.multipleTable.clearSelection();
      this.chosenSales = []
      this.chosenUnpost = []
      this.getSales()
    },

    async exportSales(){
      this.loadingExport = true;
      this.multipleError.title= 'Post ' + this.$lang[this.langId].sales
      const clearSelections = () => {
        this.$refs.multipleTable.clearSelection();
        this.allowAction = false
        this.loadingExport = false;
        this.chosenSales = []
        this.chosenUnpost = []
        this.dialogExport = false
      }

      for (const item of this.chosenSales) {
        let id = {id: item.id}
        this.multipleError.total_data++
        await exportMultiSales(id).then(response => {
          let res = response.data.data
          this.dataSales.forEach((val, no) => {
            if(parseInt(res.id) === val.id){
              this.dataSales[no].jurnal_posted_transaction = res.jurnal_posted_transaction
              this.dataSales[no].jurnal_payment = res.jurnal_payment
            }
          })

          this.multipleError.total_succed++
          if(this.multipleError.total_data === this.chosenSales.length) {
            clearSelections()
            if (this.multipleError.total_failed !== 0) {
              this.closeErrorReport()
              this.multipleErrorShow = true
            } else {
              this.$message({
                type: 'success',
                message: this.$lang[this.langId].success_posting
              })
            }
          }

        }).catch(error => {
          this.multipleError.total_failed++
          console.log('eeeerrttttt', error, this.multipleError.total_data, this.chosenSales.length)
          this.multipleError.errorList.push({ name: item.order_no, desc: error.string })
          if(this.multipleError.total_data === this.chosenSales.length) {
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

    handleInfo(){
      salesInfo().then(response => {
        this.messageHidden = response.data.data.message_hidden === 1 ? true : false;
        this.tooltipMessage = response.data.data.message_hidden === 1 ? 
          this.$lang[this.langId].showExportInfo : this.$lang[this.langId].hideExportInfo
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
