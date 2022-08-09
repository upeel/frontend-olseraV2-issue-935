<template>
  <div>
    <div class="jurnalExportHeader">
      <el-row :gutter="20">
        <el-col :md="12" :sm="12" :xs="24" align="left">
          <!-- <el-tooltip class="item" effect="dark" :content="tooltipMessage" placement="bottom"> -->
            <div style="cursor: pointer;">
              <img src="../../../../../../../../static/img/accounting-third/accurate-icon.png"> 
              <span class="jurnal">Accurate</span>
            </div>
          <!-- </el-tooltip> -->
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
            :disabled="chosenSales.length === 0 ||buttonPostStatus === false"
            size="small"
            type="info"
            :class="chosenSales.length !== 0 || buttonPostStatus ? 'allowExport' : ''"
            @click="showDialogExport">
            <svg-icon type="cloud-upload"></svg-icon>
            {{$lang[langId].post_to_accurate}}
          </el-button>
        </el-col>
        <!-- <el-col :span="24" v-if="messageHidden === false">
          <el-tag size="large" class="tag-jurnal-info">
            <h4 align="center">
              <strong>{{$lang[langId].infoExportAccurate}}</strong>
            </h4>
            <p v-html="$lang[langId].export_sales_to_accurate_account_info"></p>
          </el-tag>
        </el-col> -->
      </el-row>
    </div>
  
    <div class="table-handler-flex visible-lg visible-md visible-sm">
      <el-row :gutter="10">
        <el-col :md="12" :sm="12" :xs="12" align="left">
          <el-button class="button-filter" size="mini" type="info"
            icon="el-icon-search" @click="showDialogFilter">
              {{lang.search}}
          </el-button>
        </el-col>
        <el-col :md="12" :sm="12" :xs="12" align="right">
          <el-button
            size="small"
            class="date-filter-dashboard"
            @click="toggleFilter">
            <i class="fa fa-filter" />
            <span>{{ labelDate }}</span>
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div class="table-handler-flex visible-xs">
      <div class="col-xs-12 nopadding">
        <el-button
          style="width: 100%"
          size="small"
          class="date-filter-dashboard"
          @click="toggleFilter">
          <i class="fa fa-filter" />
          <span>{{ labelDate }}</span>
        </el-button>
      </div>
      <div class="col-xs-12" style="margin: 10px 0 10px 0; padding: 0;">
        <el-button class="button-filter" size="small" style="width: 100%"
          icon="el-icon-search" @click="showDialogFilter">
            {{lang.search}}
        </el-button>
      </div>
    </div>
    <div style="margin-top: 24px">
      <loading 
        v-if="isLoading === true"
        :active="true"
        color= '#1bb4e6'
        loader="spinner"
        :width="32"
        :height="32"
        align="center"
        backgroundColor='#ffffff'>
      </loading>
      <el-table
        ref="multipleTable"
        v-else
        class="product-table-max-height mobile-fix-height-unset"
        @selection-change="handleSelectExport"
        @sort-change="changeSortTable"
        column-key="accurate_posted"
        @filter-change="filterPost"
        :data="dataSales"
        stripe>
        <el-table-column v-if="buttonPostStatus" type="selection" width="30" class-name="text-center">
        </el-table-column>
        <el-table-column
          prop="order_date"
          :label="lang.sales_date"
          sortable
          width="140">
          <template slot-scope="scope">
            <span>{{scope.row.forder_date}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="order_no"
          :label="lang.order_no"
          sortable>
          <template slot-scope="scope">
            <router-link v-if="scope.row.status === 'P'" :to="{path: '/sales/openorder/'+ scope.row.id,
              query: {path:'accounting-third/accurate/sales', pathName: 'Accurate Upload Sales', lastParams: params, labelDate: labelDate} }">
              {{ scope.row.order_no }}
            </router-link>
            <router-link v-else :to="{path: '/sales/completeorder/'+ scope.row.id,
              query: {path:'accounting-third/accurate/sales', pathName: 'Accurate Upload Sales', lastParams: params, labelDate: labelDate} }">
              {{ scope.row.order_no }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="customer_name"
          :label="lang.customer_name"
          sortable>
          <template slot-scope="scope">
            <span>{{ capitalize(scope.row.customer_name) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="int_total_amount"
          :label="lang.order_totals"
          sortable
          align="right">
          <template slot-scope="scope">
            <div v-if="scope.row.ftotal_amount !==null">{{ scope.row.ftotal_amount }}</div>
            <div v-else>IDR 0</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="accurate_posted"
          label="Post"
          width="140"
          align="center"
          :filters="[{ text: $lang[langId].posted, value: '1' }, { text: $lang[langId].unposted, value: '0' }]"
          :filter-multiple="false"
          >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.accurate_posted === 1"
              type="success"  size="mini"
              disable-transitions>{{$lang[langId].posted}}
            </el-tag>
            <el-tag v-else type="danger" disable-transitions size="mini">
              {{$lang[langId].unposted}}
            </el-tag>
            <el-tag v-if="scope.row.accurate_payment === 1"
              type="success" size="mini"
              disable-transitions>{{$lang[langId].paid2}}
            </el-tag>
            <el-tag v-else-if="scope.row.accurate_payment === 2"
              type="primary" size="mini"
              disable-transitions>{{$lang[langId].paid_partial}}
            </el-tag>
            <el-tag v-else type="danger" disable-transitions size="mini">
              {{$lang[langId].unpaid}}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
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
            :prefix="selectedStore.currency_id + ' '"
            class="form-input input-sm"
            style="font-size: 14px; color: #606266; width: 93%; border: 1px solid #DCDFE6;">
          </money>
        </el-form-item>
        <el-form-item label="Accurate Post" :label-width="formLabelWidth">
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
        <img src="../../../../../../../../static/img/accounting-third/accurate-post.png"> 
        <small style="font-weight: bolder;">
          {{ $lang[langId].you_sure + ' ' + $lang[langId].unpost }}
          <span style="color: blue"> {{chosenUnpost.length}} </span>
          {{ lang.sales + ' ?'}}</small>
      </div>
    </el-dialog>

    <el-dialog  
      :visible.sync="dialogExport" 
      width="34%" center
      :close-on-click-modal="false" 
      :show-close="false">

      <div slot="title" class="flex-container">
        <el-row :gutter="20"  style="width: 100%">
          <el-col :span="12" align="left">
            <span style="line-height: 2; font-size: 15px">{{$lang[langId].post_to_accurate}}</span>
          </el-col>
          <el-col :span="12" align="right">
            <el-button  @click="closeDialogExport">{{lang.cancel}}</el-button>
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
        <img src="../../../../../../../../static/img/accounting-third/accurate-post.png"> 
        <small style="font-weight: bolder;">
          {{ $lang[langId].you_sure + ' ' + lang.post }}
          <span style="color: blue"> {{chosenSales.length}} </span>
          {{ $lang[langId].sales_to + ' Accurate ?'}}</small>
      </div>
    </el-dialog>

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
var moment = require('moment')

export default {
  name:'SalesToAccurate',
  components: {
    CustomDateFilter,
    Loading
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
      tooltipMessage: '',
      buttonPostStatus: false,
      messageHidden: true,
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
      dialogExport: false,
      formLabelWidth: '115px',
      dataSales: [],
      dialogFilter: false,
      dialogUnpost: false,
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
      chosenSales: [],
      chosenUnpost: []
    }
  },
  mounted(){
    this.getDate()
    this.getSales()
  },

  watch:{
		filter: {
			handler: function(val){
				if(val.post === ''){
					this.params.search_column.map((i, idx) => {
						if (i === 'accurate_posted') {
							this.params.search_column.splice(idx, 1)
							this.params.search_text.splice(idx, 1)
						}
					})
				}

				if(val.post === '1' || val.post === '0'){
					if(this.params.search_column.includes('accurate_posted') === true){
						this.params.search_column.map((i, idx) => {
							if (i === 'accurate_posted') {
								this.params.search_text[idx] = val.post
							}
						})
					}else{
						this.params.search_column.push('accurate_posted')
						this.params.search_text.push(val.post)
					}
				}

				if(val.payment === ''){
					this.params.search_column.map((i, idx) => {
						if (i === 'accurate_payment') {
							this.params.search_column.splice(idx, 1)
							this.params.search_text.splice(idx, 1)
						}
					})
				}

				if(val.payment === '1' || val.payment === '0'){
					if(this.params.search_column.includes('accurate_payment') === true){
						this.params.search_column.map((i, idx) => {
							if (i === 'accurate_payment') {
								this.params.search_text[idx] = val.payment
							}
						})
					}else{
						this.params.search_column.push('accurate_payment')
						this.params.search_text.push(val.payment)
					}
				}
				this.params.page = 1
			},
		deep: true
		},
  },

  methods:{

    getDate() {
      if(Object.keys(this.$route.query).includes('lastParams')){
        if("start_date" in this.$route.query.lastParams){
          this.params = {
            start_date: this.$route.query.lastParams.start_date,
            end_date: this.$route.query.lastParams.end_date,
            search_column: this.$route.query.lastParams.search_column,
            search_text: this.$route.query.lastParams.search_text,
            currentPage: this.$route.query.lastParams.currentPage,
            per_page: this.$route.query.lastParams.per_page,
            // sort_column: this.$route.params.lastParams.sort_column,
            // sort_type: this.$route.params.lastParams.sort_type,
            page: this.$route.query.lastParams.page,
            total: null
          }
        }
        
         this.labelDate = Object.keys(this.$route.query).includes('labelDate') === true ? this.$route.query.labelDate : this.$lang[this.langId].today + '\n' +
                        moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                        moment(this.params.end_date).format('DD MMM YYYY')
      } else {
        this.params.start_date = moment().format('YYYY-MM-DD')
        this.params.end_date = moment().format('YYYY-MM-DD')
        this.labelDate = this.$lang[this.langId].today + '\n' +
                          moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                          moment(this.params.end_date).format('DD MMM YYYY')
      }
    },

    setLabelFilter(filter) {
      if (filter.labelForDate === 'today') {
        this.labelDate = this.$lang[this.langId].today + '\n' +
                        moment(this.params.starf_date).format('DD MMM YYYY') + ' - ' +
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

    filterPost(value){
      let keyTable = Object.keys(value)[0];
        if(value[keyTable][0]){
          if(this.params.search_column.includes('accurate_posted') === true){
            this.params.search_column.map((i, idx) => {
              if (i === 'accurate_posted') {
                this.params.search_text[idx] = value[keyTable][0]
              }
            })
          }else{
            this.params.search_column.push('accurate_posted')
            this.params.search_text.push(value[keyTable][0])
          }
        }else{
          this.params.search_column.map((i, idx) => {
            if (i === 'accurate_posted') {
              this.params.search_column.splice(idx, 1)
              this.params.search_text.splice(idx, 1)
            }
          })
        }
        this.params.page = 1
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
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/sales'),
        headers:headers,
        params: this.params
      }).then(response => {
        this.dataSales = response.data.data
        this.buttonPostStatus = response.data.finishProduct === 1 ? true : false
        // this.messageHidden = response.data.message_hidden === 1 ? true : false
        // this.tooltipMessage = response.data.message_hidden === 1 ? 
        //   this.$lang[this.langId].showExportInfo : this.$lang[this.langId].hideExportInfo
        this.$emit('invoicePostStatus', {
          productAndSupplier: response.data.productAndSupplier,
          finishMapingStatus: response.data.finishMapingStatus,
          finishMapingSales: response.data.finishProduct,
          isFecthCustomer: 0,
          isFecthProduct: 0
        })
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

    handleSelectExport: function(val) {
			this.chosenSales = []
			this.chosenUnpost = []
      if (val.length > 0) {
				this.chosenSales = val
        val.forEach((valSelect, no) => {
          if(valSelect.accurate_posted === 1){
            this.chosenUnpost.push(valSelect)
          }
        })
      }
    },

    showDialogExport(){
      this.dialogExport = true
    },

    closeDialogExport(){
      this.dialogExport = false
      this.$refs.multipleTable.clearSelection();
      this.chosenSales = []
      this.chosenUnpost = []
      this.getSales()
    },

    exportSales(){
      this.loadingExport = true;

      if(this.dataSales.length === this.chosenSales.length){
				this.bulkExport()
			}else{
				this.commonExport()
			}
    },

		bulkExport(){
			let headers = {Authorization: 'Bearer ' + this.token.access_token}

			let data = {id: []}

			this.chosenSales.forEach(function(v){
				if(v.id){
					data.id.push(v.id)
				}else{
					data.id.push(0)
				}
			});

			axios({
				method: 'POST',
				url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/bulksales'),
				headers: headers,
				data
			}).then(response => {
				let res = response.data.data
				res.forEach(r => {
					let idx = this.dataSales.findIndex(x => x.id === parseInt(r.id));
					this.dataSales[idx].accurate_posted = r.accurate_posted
					this.dataSales[idx].accurate_payment = r.accurate_payment
				})
				this.chosenSales = []
				this.dialogExport = false
				this.loadingExport = false;
				this.$message({
					type: 'success',
					message: this.$lang[this.langId].success_posting
				})
				this.$refs.multipleTable.clearSelection();
			}).catch(error => {
				this.$refs.multipleTable.clearSelection();
				this.dialogExport = false
				this.loadingExport = false;
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

		commonExport(){
			let headers = {Authorization: 'Bearer ' + this.token.access_token}

      var itemsProcessed = 0;

      this.chosenSales.forEach((item, index) => {
        let data = {id: item.id};
        axios({
          method: 'POST',
          url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/sales'),
          headers: headers,
          data
        }).then(response => {
          let res = response.data.data
          this.dataSales.forEach((val, no) => {
            if(parseInt(res.id) === val.id){
              this.dataSales[no].accurate_posted = res.accurate_posted
							this.dataSales[no].accurate_payment = res.accurate_payment
            }
          })

          itemsProcessed++;
          if(itemsProcessed === this.chosenSales.length) {
						this.chosenSales = []
            this.$refs.multipleTable.clearSelection();
            this.dialogExport = false
            this.loadingExport = false;
            this.$message({
              type: 'success',
              message: this.$lang[this.langId].success_posting
            })
          }

        }).catch(error => {
          itemsProcessed++;
          this.loadingExport = false;
          if(itemsProcessed === this.chosenSales.length) {
						this.chosenSales = []
            this.$refs.multipleTable.clearSelection();
            this.dialogExport = false
          }
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
      })
		},

    showDialogUnpost() {
      this.dialogUnpost = true
    },

    closeDialogUnpost() {
      this.chosenUnpost = []
      this.$refs.multipleTable.clearSelection();
      this.dialogUnpost = false
    },

    handleUnpost(){
      this.loadingUnpost = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      var itemsProcessed = 0;

      this.chosenUnpost.forEach((item, index, array) => {
        axios({
          method: 'DELETE',
          url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/sales/' + item.id),
          headers: headers,
        }).then(response => {
          let result = response.data.data
          this.dataSales.forEach((val, no) => {
            if(val.id === item.id){
              this.dataSales[no].accurate_posted = 0
							this.dataSales[no].accurate_payment = 0
            }
          })
          itemsProcessed++;
          if(itemsProcessed === this.chosenUnpost.length) {
            this.$refs.multipleTable.clearSelection();
            this.chosenSales = []
            this.chosenUnpost = []
            this.$message({
              type: 'success',
              message: this.$lang[this.langId].success_cancelled
            })
            this.dialogUnpost = false
            this.loadingUnpost = false
          }
        }).catch(error => {
          itemsProcessed++;
          this.loadingUnpost = false
          if(itemsProcessed === this.chosenUnpost.length) {
            this.$refs.multipleTable.clearSelection();
            this.chosenSales = []
            this.chosenUnpost = []
            this.dialogUnpost = false
          }
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
      })
    },

    changePostStatus(){
      this.buttonPostStatus = true
    },

    checkList(row, index){
      let disable = true;
      // if(row.accurate_posted === 1){
      //   disable = false;
      // }
      return disable;
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
