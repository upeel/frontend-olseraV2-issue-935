<template>
  <div>
    <div class="jurnalExportHeader">
      <el-row :gutter="20">
        <el-col :md="12" :sm="12" :xs="24" align="left">
          <div style="cursor: pointer;">
            <img src="../../../../../../../../static/img/accounting-third/accurate-icon.png"> 
            <span class="jurnal">Accurate</span>
          </div>
        </el-col>
        <el-col :md="12" :sm="12" :xs="24" align="right">
          <el-button
            :disabled="chosenReturn.length === 0"
            :class="chosenReturn.length !== 0 ? 'allowExport' : ''"
            size="small"
            type="info"
            @click="showDialogExport">
            <span>
              <svg-icon type="cloud-upload"></svg-icon>
              {{$lang[langId].post_to_accurate}}</span>
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
          column-key="accurate_posted"
          @filter-change="filterPost"
          :data="dataSalesReturn"
          stripe>
          <el-table-column type="selection" width="30" class-name="text-center">
          </el-table-column>
          <el-table-column
            prop="return_date"
            :label="lang.date"
            sortable
            width="110">
            <template slot-scope="scope">
              <span>{{scope.row.freturn_date}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="return_no"
            :label="lang.return_no"
            sortable
            width="180">
            <template slot-scope="scope">
              <router-link :to="{path: '/sales/returnorder/'+ scope.row.id,
                query: {path:'accounting-third/accurate/sales-return', pathName: 'Accurate Upload Sales Return', lastParams: params, labelDate: labelDate} }">
                {{ scope.row.return_no }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="order_no"
            :label="lang.order_no"
            sortable
            width="180">
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
            prop="int_total_amount"
            :label="lang.amount"
            sortable
            align="right">
            <template slot-scope="scope">
              <div v-if="scope.row.ftotal_amount !==null">{{ scope.row.ftotal_amount }}</div>
              <div v-else>IDR 0</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="accurate_posted"
            label="Accurate Post"
            width="120"
            :filters="[{ text: $lang[langId].posted, value: '1' }, { text: $lang[langId].unposted, value: '0' }]"
            :filter-multiple="false"
            >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.accurate_posted === 1"
                type="success"
                disable-transitions>{{$lang[langId].posted}}
              </el-tag>
              <el-tag v-else type="danger" disable-transitions>
                {{$lang[langId].unposted}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="" align="center" width="40">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="$lang[langId].unpost" placement="bottom">
                <el-button  type="text" v-if="scope.row.accurate_posted === 1" style="color: #FF0000; width: 100%; text-align: left;" @click="showDialogUnpost(scope.row)">
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

    <el-dialog
      :visible.sync="dialogFilter"
      class="text-left"
      width="36%"
      custom-class="dialog-card">
      <el-form>
        <el-form-item :label="lang.search" :label-width="formLabelWidth">
          <el-input
            v-model="params.search"
            :placeholder="lang.transaction_no+'/'+lang.supplier_name"
            clearable
            prefix-icon="el-icon-search"
            size="small"
            style="width: 93%;">
          </el-input>
        </el-form-item>
        <el-form-item  style="word-break: break-word;" :label="lang.return_totals" :label-width="formLabelWidth">
          <money v-model="filter.amount"
            v-bind="money"
            :prefix="selectedStore.currency_id + ' '"
            class="form-input input-sm input-money"
            style="height: 32px; width: 93%;">
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
            <span style="line-height: 2; font-size: 15px">{{$lang[langId].upload_to}} Accurate</span>
          </el-col>
          <el-col :span="12" align="right">
            <el-button  @click="closeDialogExport">{{lang.cancel}}</el-button>
            <el-button :disabled="loadingExport" type="primary" @click="exportSalesReturn">
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
          <span style="color: blue"> {{chosenReturn.length}} </span>
          {{ $lang[langId].sales_return_to + ' Accurate ?'}}</small>
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
        <p style="font-weight: bold;">{{ unpostData.return_no }} - {{capitalize(unpostData.customer_name)}} - {{unpostData.ftotal_amount}}</p>
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
import SvgIcon from '../../../../../SvgIcon.vue';
var moment = require('moment')

export default {
  name: 'ExportToJurnalPurchase',
  components: {
    CustomDateFilter,
    Loading,
    SvgIcon
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
      messageHidden: true,
      tooltipMessage: '',
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
      dataSalesReturn: [],
      chosenReturn: [],
      unpostData: {},
      dialogFilter: false,
      dialogExport: false,
      dialogUnpost: false,
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
    this.getLastParams()
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
        this.params.page = 1
      },
      deep: true
    },
    onMapping:{
      handler: function(val){
        if(val === false){
          this.getSalesReturn();
        }
      },
      deep: true
    }
  },

  methods:{


    getLastParams() {
      if(Object.keys(this.$route.query).includes('lastParams') === true){
        this.params = "start_date" in this.$route.query.lastParams ? this.$route.query.lastParams : this.params
        this.labelDate = this.$route.query.labelDate
      }else{
        this.params.start_date = moment().format('YYYY-MM-DD')
        this.params.end_date = moment().format('YYYY-MM-DD')
        this.labelDate = this.$lang[this.langId].today + '\n' +
                          moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                          moment(this.params.end_date).format('DD MMM YYYY')
      }

      this.getSalesReturn()
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
      this.getSalesReturn()
    },

    dateFilterSave(filter) {
      this.params.start_date = filter.startDate
      this.params.end_date = filter.endDate
      this.dateFilterClose()
      this.setLabelFilter(filter)
      this.getSalesReturn()
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
      this.getSalesReturn()
    },

    handleSizeChange(val) {
      this.params.page = 1
      this.params.per_page = val
      this.getSalesReturn()
    },
    
    handleCurrentChange(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getSalesReturn()
    },

    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      if (val.order === null) val.order = this.params.sort_type

      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.getSalesReturn()
    },

    getSalesReturn() {
      this.isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/salesreturn'),
        headers:headers,
        params: this.params
      }).then(response => {
        this.dataSalesReturn = response.data.data
        this.messageHidden = response.data.message_hidden === 1 ? true : false
        this.tooltipMessage = response.data.message_hidden === 1 ? 
          this.$lang[this.langId].showExportInfo : this.$lang[this.langId].hideExportInfo
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
      if (val.length > 0) {
        this.chosenReturn = val
      }else{
        this.chosenReturn = []
      }
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
      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/salesreturn/' + id),
        headers: headers,
      }).then(response => {
        let result = response.data
        this.dialogUnpost = false
        this.loadingUnpost = false
        this.dataSalesReturn.forEach((val, no) => {
          if(val.id === parseInt(result.id)){
            this.dataSalesReturn[no].accurate_posted = 0
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
        this.getSalesReturn()
    },

    checkList(row, index){
      let disable = true;
      if(row.accurate_posted === 1){
        disable = false;
      }
      return disable;
    },

    showDialogExport(){
      this.dialogExport = true
    },

    closeDialogExport(){
      this.dialogExport = false
      this.chosenReturn = []
      this.getSalesReturn()
    },

    exportSalesReturn(){
      this.loadingExport = true;
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      var itemsProcessed = 0;

      this.chosenReturn.forEach((item, index) => {
        let data = {id: item.id};
        axios({
          method: 'POST',
          url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/salesreturn'),
          headers: headers,
          data
        }).then(response => {
          let res = response.data.data
          this.dataSalesReturn.forEach((val, no) => {
            if(parseInt(res.id) === val.id){
              this.dataSalesReturn[no].accurate_posted = 1
            }
          })

          itemsProcessed++;
          if(itemsProcessed === this.chosenReturn.length) {
            this.$message({
              type: 'success',
              message: this.$lang[this.langId].success_posting
            })
            this.dialogExport = false
            this.loadingExport = false;
          }

        }).catch(error => {
          itemsProcessed++;
          this.loadingExport = false;
          if(itemsProcessed === this.chosenReturn.length) {
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
        // data.push({
        //   id: item.id
        // });
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
