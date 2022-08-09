<template>
  <div>
    <el-card class="box-card" shadow="never">

      <div class="title-jurnal">
        <h4>
          <strong>{{$lang[langId].upload_sales}}</strong>
          <div style="float: right; margin-top: -9px;">
            <el-button @click="handleCommandJurnal('accountName')" :type="activeAccountName ? 'primary' : 'info'" size="small">
              {{$lang[langId].set_account_name}}
            </el-button>
            <el-button type="info" @click="handleCommandJurnal('setting')" style="padding: 6px; font-size: large;">
              <svg-icon icon-class="setting_ico"></svg-icon>
            </el-button>
          </div>
        </h4>
      </div>
      <div class="jurnalExportHeader">
        <el-row :gutter="20">
          <el-col :md="19" :sm="19" :xs="12" align="left">
            <el-tooltip class="item" effect="dark" :content="tooltipMessage" placement="bottom">
              <div @click="handleInfo" style="cursor: pointer;">
                <img src="../../../../../../../../static/img/accounting-third/jurnal-icon.png"> 
                <span class="jurnal">Jurnal</span>
              </div>
            </el-tooltip>
          </el-col>
          <el-col :md="5" :sm="5" :xs="12" align="right">
            <el-button
              :disabled="chosenPurchase.length === 0 ||buttonPostStatus === false"
              size="small"
              type="info"
              :class="chosenPurchase.length !== 0 || buttonPostStatus ? 'allowExport' : ''"
              @click="showDialogExport">
              <svg-icon type="cloud-upload"></svg-icon>
              {{$lang[langId].post_to_general}} Jurnal
            </el-button>
          </el-col>
          <el-col :span="24" v-if="messageHidden === false">
            <el-tag @click="handleInfo" size="large" class="tag-jurnal-info">
              <h4 align="center">
                <strong>{{$lang[langId].infoExportJurnal}}</strong>
              </h4>
              <p v-html="$lang[langId].export_purchase_to_jurnal_account_info"></p>
            </el-tag>
          </el-col>
        </el-row>
      </div>
    
      <div class="table-handler-flex visible-lg visible-md visible-sm">
        <el-row :gutter="10">
          <el-col :md="12" :sm="12" :xs="12" align="left">
            <el-button class="button-filter" size="mini"
              icon="el-icon-search" @click="showDialogFilter">
                {{lang.search}}
            </el-button>
            <!-- <el-radio-group v-model="selectedMenu" @change="handleSelectMenu" size="small">
              <el-radio label="general" border>{{$lang[langId].paid2}}</el-radio>
              <el-radio label="invoicePurchase" border>{{$lang[langId].unpaid2}}</el-radio>
            </el-radio-group> -->
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
          column-key="jurnal_posted"
          @filter-change="filterPost"
          :data="dataPurchase"
          stripe>
          <el-table-column v-if="buttonPostStatus" type="selection" width="30" class-name="text-center">
          </el-table-column>
          <el-table-column
            prop="purchase_date"
            :label="lang.purchase_date"
            sortable
            width="140">
            <template slot-scope="scope">
              <span>{{scope.row.fpurchase_date}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="purchase_no"
            :label="lang.purchase_no"
            sortable>
            <template slot-scope="scope">
              <router-link :to="{path: '/purchase/openpurchase/'+ scope.row.id,
                query: {path:'jurnalNew', pathName: 'Integrate Jurnal.ID', menu: 'general',
                tab: 'pembelian', lastParams: params, labelDate: labelDate} }">
                {{ scope.row.purchase_no }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="supplier_name"
            :label="lang.supplier_name"
            sortable>
            <template slot-scope="scope">
              <span>{{ capitalize(scope.row.supplier_name) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="int_total_amount"
            :label="lang.purchase_totals"
            sortable
            align="right">
            <template slot-scope="scope">
              <div v-if="scope.row.ftotal_amount !==null">{{ scope.row.ftotal_amount }}</div>
              <div v-else>IDR 0</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="jurnal_posted"
            :label="$lang[langId].jurnal_post"
            width="120"
            :filters="[{ text: $lang[langId].posted, value: '1' }, { text: $lang[langId].unposted, value: '0' }]"
            :filter-multiple="false"
            >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.jurnal_posted === 1"
                type="success"
                disable-transitions>{{$lang[langId].posted}}
              </el-tag>
              <el-tag v-else type="danger" disable-transitions>
                {{$lang[langId].unposted}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$lang[langId].action" align="center" width="110">
            <template slot-scope="scope">
              <el-button v-if="scope.row.jurnal_unposted" type="text" style="color: #FF0000; width: 100%; text-align: left;" @click="showDialogUnpost(scope.row)">
                <svg-icon type="cloud-trash" stroke="#FF0000"></svg-icon>
                {{ $lang[langId].unpost }}
              </el-button>
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
            :placeholder="lang.transaction_no+'/'+lang.supplier_name"
            clearable
            prefix-icon="el-icon-search"
            size="small"
            style="width: 90%;">
          </el-input>
        </el-form-item>
        <el-form-item :label="lang.purchase_totals" :label-width="formLabelWidth">
          <money v-model="filter.amount"
            :prefix="selectedStore.currency_id + ' '"
            class="form-input input-sm"
            style="font-size: 14px; color: #606266; width: 90%; border: 1px solid #DCDFE6;">
          </money>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleFilter">{{ $lang[langId].filter }}</el-button>
      </span>
    </el-dialog>

    <el-dialog 
      :title="lang.notif_warn" 
      :visible.sync="dialogUnpost" 
      width="50%" center
      :close-on-click-modal="false" 
      :show-close="false">
      <div class="text-center">
        <p>{{ $lang[langId].are_you_want_to_unpost }}</p>
        <p style="font-weight: bold;">{{ unpostData.purchase_no }} - {{capitalize(unpostData.supplier_name)}} - {{unpostData.ftotal_amount}}</p>
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

    <el-dialog  
      :visible.sync="dialogExport" 
      width="32%" center
      :close-on-click-modal="false" 
      :show-close="false">

      <div align="left">
        <el-row :gutter="20" style="width: 100%">
          <el-col :span="12" align="left">
            <span style="line-height: 2; font-size: 15px">{{$lang[langId].post_to_general}} Jurnal</span>
          </el-col>
          <el-col :span="12" align="right">
            <el-button  @click="closeDialogExport">{{lang.cancel}}</el-button>
            <el-button :disabled="loadingExport" type="primary" @click="exportPurchase">
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

        <img src="../../../../../../../../static/img/accounting-third/jurnal-post.png"> 
        <small style="font-weight: bolder;">
          {{ $lang[langId].you_sure + ' ' + lang.post }}
          <span style="color: blue"> {{chosenPurchase.length}} </span>
          {{ $lang[langId].purchase_to_general + ' Jurnal ?'}}</small>
      </div>
    </el-dialog>

    <dialog-jurnal-account-name
      :show="dialogAccountName"
      @changePostStatus="updatePostStatus"
      @close="handleCloseAccountName"
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
import dialogJurnalAccountName from '../DialogJurnalAccountName';
import CustomDateFilter from 'modules/CustomDateFilter';
var moment = require('moment')

export default {
  name:'PurchaseToJurnal',
  components: {
    dialogJurnalAccountName,
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
      isLoading: false,
      loadingExport: false,
      loadingUnpost: false,
      selectedMenu: 'general',
      tooltipMessage: '',
      buttonPostStatus: false,
      messageHidden: true,
      activeAccountName: true,
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
      dataPurchase: [],
      unpostData: {},
      dialogFilter: false,
      dialogUnpost: false,
      dialogAccountName: false,
      filter:{
        amount: 'post',
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
      chosenPurchase: [],
    }
  },
  mounted(){
    this.getDate()
    this.getPurchase()
  },

  watch:{
    
  },

  methods:{
    handleCommandJurnal(command){
      if(command === 'accountName'){
        this.dialogAccountName = true
      }else if(command === 'setting'){
        this.$emit('settingJurnal')
      }else{
        console.log('menu', command);
      }
    },

    updatePostStatus(val){
      this.activeAccountName = val === 1 ? false : this.activeAccountName
    },

    handleCloseAccountName() {
      this.dialogAccountName = false
    },
    
    handleSelectMenu(){
      if(this.selectedMenu === 'invoicePurchase'){
        this.$emit('selectExportInvoice')
      }
    },

    getDate() {
      if(Object.keys(this.$route.query).includes('lastParams')){
        if(this.$route.query.lastParams.hasOwnProperty('start_date')){
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
      this.getPurchase()
    },

    dateFilterSave(filter) {
      this.params.start_date = filter.startDate
      this.params.end_date = filter.endDate
      this.dateFilterClose()
      this.setLabelFilter(filter)
      this.getPurchase()
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
      this.getPurchase()
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
        this.getPurchase()
    },

    handleSizeChange(val) {
      this.params.page = 1
      this.params.per_page = val
      this.getPurchase()
    },
    
    handleCurrentChange(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getPurchase()
    },

    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      if (val.order === null) val.order = this.params.sort_type

      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.getPurchase()
    },

    getPurchase() {
      let idStore = parseInt(localStorage.getItem('olsbo_integration_id_current_store'))
      if(idStore !== this.selectedStore.store_id){
        this.$router.push({path: '/accounting-third/accounting-software'})
      }else{
        this.isLoading = true
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }

        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/purchasetojurnal'),
          headers:headers,
          params: this.params
        }).then(response => {
          this.dataPurchase = response.data.data
          this.buttonPostStatus = response.data.buttonPostStatus === 1 ? true : false
          this.activeAccountName = response.data.buttonPostStatus === 1 ? false : true
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
        this.$emit('accountPostStatus', this.buttonPostStatus)
      }
    },

    handleSelectExport: function(val) {
      if (val.length > 0) {
        this.chosenPurchase = val
      }else{
        this.chosenPurchase = []
      }
    },

    showDialogExport(){
      this.dialogExport = true
    },

    closeDialogExport(){
      this.dialogExport = false
      this.chosenPurchase = []
      this.getPurchase()
    },

    exportPurchase(){
      this.loadingExport = true;
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      var itemsProcessed = 0;
      this.chosenPurchase.forEach((item, index) => {
        let id = {id: item.id}
        axios({
          method: 'POST',
          url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/single/purchasetojurnal'),
          headers: headers,
          data: id
        }).then(response => {
          let res = response.data.data
          this.dataSales.forEach((val, no) => {
            if(parseInt(res.id) === val.id){
              this.dataPurchase[no].jurnal_posted = 1
              this.dataPurchase[no].jurnal_unposted = 0
            }
          })

          itemsProcessed++;
          if(itemsProcessed === this.chosenSales.length) {
            this.$refs.multipleTable.clearSelection();
            this.chosenPurchase = []
            this.dialogExport = false
            this.loadingExport = false;
            this.$message({
              type: 'success',
              message: this.$lang[this.langId].success_posting
            })
          }
        }).catch(error => {
          itemsProcessed++;
          if(itemsProcessed === this.chosenPurchase.length) {
            this.$refs.multipleTable.clearSelection();
            this.allowAction = false
            this.loadingExport = false;
            this.chosenPurchase = []
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
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/purchasetojurnal/' + id),
        headers: headers,
      }).then(response => {
        if(Object.keys(response.data).includes('data') === true){
          let result = response.data.data
          this.dataPurchase.forEach((val, no) => {
            if(val.id === result.id){
              this.dataPurchase[no].jurnal_posted = 0
              this.dataPurchase[no].jurnal_unposted = 0
            }
          })
          this.$message({
            type: 'success',
            message: this.$lang[this.langId].success_cancelled
          })
          this.dialogUnpost = false
          this.loadingUnpost = false
        }else{
          this.loadingUnpost = false
          this.$message({
            type: 'warning',
            title: response.data.error.message,
            message: response.data.error.error,
          })
        }
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

    checkList(row, index){
      let disable = true;
      // if(row.jurnal_posted === 1){
      //   disable = false;
      // }
      return disable;
    },

    handleInfo(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/purchasetojurnal/message'),
        headers: headers,
      }).then(response => {
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

    changeStatusPost(val){
      this.buttonPostStatus = val === 1 ? true : false
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
