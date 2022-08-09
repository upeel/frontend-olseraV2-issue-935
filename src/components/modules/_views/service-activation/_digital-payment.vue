
<template>
  <div>
    <div class="flex-container radius-2 mb-12">
      <div class="font-24 font-semi-bold" style="flex-grow: 1;">
        {{ rootLang.digital_payment }}
      </div>
      <div v-show="userStore.role_id === 'OW' || userStore.role_id === 'SP'">
        <div v-if="finishDigiPay">
          <el-button type="primary" size="small" @click="getDetailDigiPayment">
            <span v-if="loadingGetUpdate">
              <loading :active="true" color='#fff' loader="dots" :width="70" :height="10" backgroundColor='#ffffff'></loading>
            </span>
            <span v-else>{{lang.update}}</span>
          </el-button>
          <el-button icon="el-icon-info" size="small" circle @click="showInfoPayment"></el-button>
          <!-- <svg-icon class="font-24 pointer" icon-class="information-circle"></svg-icon> -->
        </div>
        <el-button v-else type="primary" @click="showDialogSubmission">
          {{ rootLang.activate }} <i class="el-icon-arrow-right"></i>
        </el-button>
      </div>
    </div>
    
    <div v-if="finishDigiPay" class="digipayment-container pointer color-info--bg flex-container box-shadow">
      <el-table
        :data="listPayment"
        stripe
        :show-header="false"
        @row-click="clickPayment"
        class="border border--grey box-shadow-1">
        <el-table-column
          prop="logo"
          width="50"
          align="center">
          <template slot-scope="scope">
            <img :src="scope.row.photo"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="alias_name">
        </el-table-column>
        <el-table-column
          prop="main_store"
          align="right">
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.main_store && scope.row.main_store.length !== 0"
              :type="methodGetStatusTag(scope.row)"
              size="medium">
              {{scope.row.main_store[0].status}}
            </el-tag>
            <i v-if="methodGetStatusTag(scope.row) === 'default'" class="el-icon-arrow-right"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <div v-else class="digipayment-container pointer color-info--bg flex-container p-32 box-shadow">
      <div class="text-center">
        <img
          class="img-logo-digipayment"
          src="/static/img/service-activation/logo-digipayment.png">
        <div class="mt-16">
          {{ rootLang.digipayment_desc }}
        </div>
      </div>
    </div>

    <el-dialog
      :visible.sync="dialogDetailPayment"
      :show-close="false"
      :close-on-press-escape="false"
      :before-close="closePaymentDetail"
      append-to-body
      custom-class="dialog-digital-payment"
      width="35%"
      align="center"
    >
      <div slot="title" class="flex-container">
        <el-row :gutter="20"  style="width: 100%;">
          <el-col :span="16">
            <h4 class="dialog-title" align="left"><strong>{{detailPayment.alias_name}}</strong></h4>
          </el-col>
          <el-col :span="8" align="right" class="pr-null">
            <div class="btn_save_dialog font-20 pt-4 pointer" @click="closePaymentDetail">
              <svg-icon icon-class="x" />
            </div>
          </el-col>
        </el-row>
      </div>

      <el-card width="275" align="center" class="box-card" :body-style="{backgroundColor: detailPayment.color ? detailPayment.color : '#E1E2E1', padding: '35px'}">
        <img style="max-width: 135px; border-radius: 20px;" :src="detailPayment.photo">
      </el-card>
      <div class="row equal-cols detail-digital-payment ml-20 mr-20 pb-12">  
        <div class="col-sm-4 col-md-4 col-lg-4 col-left" style=""
        >
          <el-row>
            <el-col :span="24" align="center" class="font-14 py-11" :class="classByStatus">
              <span>{{detailPayment.main_store[0].status}}</span>
            </el-col>
          </el-row>
        
        </div>
        <div class="col-sm-4 col-md-4 col-lg-4 col-center px-8" style="">
          <el-row>
            <el-col :span="5" class="lh-3">
              <svg-icon iconClass="clock"></svg-icon>
            </el-col>
            <el-col :span="19" align="left">
              <span class="font-14">Diajukan pada</span><br>
              <span class="font-12">{{dateFormat(detailPayment.main_store[0].requested_date)}}</span>
            </el-col>
          </el-row>
        </div>
        <div class="col-sm-4 col-md-4 col-lg-4 col-right px-8" style="">
          <el-row :gutter="10" v-if="detailPayment.main_store[0].activation_status === 'A'">
            <el-col :span="5" class="lh-3">
              <svg-icon iconClass="check-circle"></svg-icon>
            </el-col>
            <el-col :span="19">
              <div align="left">
                <span class="font-14">Aktif pada</span><br>
                <span class="font-12">{{dateFormat(detailPayment.main_store[0].approved_date)}}</span>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="10" v-else-if="detailPayment.main_store[0].activation_status === 'X'">
            <el-col :span="5" class="lh-3">
              <svg-icon iconClass="x-circle"></svg-icon>
            </el-col>
            <el-col :span="19">
              <div align="left">
                <span class="font-14">Ditolak pada</span><br>
                <span class="font-12">{{dateFormat(detailPayment.main_store[0].requested_date)}}</span>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="10" v-else>
            <el-col :span="24" class="lh-3">
              <svg-icon iconClass="id-card-white"></svg-icon>
              <!-- <div>
                <span class="font-14">Ditolak pada</span><br>
                <span class="font-12">{{detailPayment.aproveDate}}</span>
              </div> -->
            </el-col>
          </el-row>
        </div>
      </div>

      <el-button v-if="detailPayment.main_store[0].activation_status === 'X'" class="mb-16" style="width: 90%; color: white;" :style="{'background-color': detailPayment.color}">
        {{$lang[langId].re_submit}}
      </el-button>



    </el-dialog>

    <el-dialog
      :visible.sync="dialogInfoPayment"
      :show-close="false"
      :close-on-press-escape="false"
      :before-close="showInfoPayment"

      width="30%"
    >
      <div slot="title" class="flex-container">
        <el-row :gutter="20"  style="width: 100%;">
          <el-col :span="16">
            <h4 class="dialog-title" align="left"><strong>{{$lang[langId].submission_status}}</strong></h4>
          </el-col>
          <el-col :span="8" align="right" class="pr-null">
            <div class="btn_save_dialog font-20 pt-4 pointer" @click="showInfoPayment">
              <svg-icon icon-class="x" />
            </div>
          </el-col>
        </el-row>
      </div>
      <div align="center">
        <svg-icon class="font-40" icon-class="clock-grey"></svg-icon>
        <div class="font-semi-bold font-18 mt-16">{{$lang[langId].on_progress}}</div>
        <p class="word-break font-12">{{$lang[langId].please_wait_7_14_workdays}}</p>
      </div>

    </el-dialog>

    <dialog-submission v-if="showSubmission" :show="showSubmission" ref="updateSubmission" @doneSubmission="doneSubmit" @onClose="showDialogSubmission" />
    <dialog-update-submission v-if="showUpdate" :show="showUpdate" :dataSubmisson="dataForm" @onClose="showDialogUpdate" />
  </div>
</template>


<script>
import { baseApi } from 'src/http-common.js';
import axios from 'axios';
import basicComputedMixin from '@/mixins/basicComputedMixin';
import mixinAccounting from '@/mixins/mixinAccounting';
import dialogSubmission from './digital-payment/dialogActivatePayment';
import dialogUpdateSubmission from './digital-payment/dialogUpdatePayment';
import SvgIcon from '../../SvgIcon.vue';
import Loading from 'vue-loading-overlay';

var moment = require('moment')

export default {
  mixins: [basicComputedMixin, mixinAccounting],

  components:{
    dialogUpdateSubmission,
    dialogSubmission,
    Loading,
    SvgIcon
  },

  props:{
    finishDigiPay: {
      type: Boolean,
      default: false
    },
    listPayment: {
      type: Array,
      default: null
    }
  },

  computed:{
    classByStatus(){
      let className = ''
      if(this.detailPayment){
        if (this.detailPayment.main_store && this.detailPayment.main_store.length) {
          const status = this.detailPayment.main_store[0].activation_status
          if (status === 'P') {
            className = 'color-warning'
          } else if (status === 'A') {
            className = 'color-success'
          } else if (status === 'R') {
            className = 'color-danger'
          } else if (status === 'X') {
            className = 'color-danger'
          }
        }
      }
      return className;
    },

    selectedStore() {
      return this.$store.getters.selectedStore
    },

    userStore() {
      const selectedStore = this.$store.getters.selectedStore
      
      return {
        role_id: selectedStore.role_id,
        role_name: selectedStore.role_name,
        is_pos_only: selectedStore.is_pos_only,
        is_mobile: selectedStore.is_mobile,
        store_created: selectedStore.created_time
      }
    },
  },

  data(){
    return{
      loadingGetUpdate: false,
      accentColor: '#f00',
      showSubmission: false,
      showUpdate: false,
      dialogDetailPayment: false,
      dialogInfoPayment: false,
      dataForm: {},
      detailPayment: {
        id: 0,
        photo: "",
        taxation: 0,
        alias_name: "",
        main_store: [{
          approved_date: "2021-03-10 11:22:36.000000",
          rejected_date: null,
          requested_date: "2021-02-18 16:45:36.000000",
          activation_status: "A"
        }]
      },
    }
  },

  methods:{
    showDialogSubmission(){
      let show = this.showSubmission
      this.showSubmission = show ? false : true
      this.$emit('doneSubmit')
    },

    showDialogUpdate(){
      let show = this.showUpdate
      this.showUpdate = show ? false : true
      this.$emit('doneSubmit')
    },

    showInfoPayment(){
      let show = this.dialogInfoPayment
      this.dialogInfoPayment = show ? false : true
    },

    clickPayment(item){
      console.log('detailItem', item)
      if(item.main_store.length !== 0){
        this.detailPayment = item
        this.dialogDetailPayment = true
      }
    },

    closePaymentDetail(){
      this.dialogDetailPayment = false
      this.detailPayment = {
        id: 0,
        photo: "",
        taxation: 0,
        alias_name: "",
        main_store: [{
          approved_date: "2021-03-10 11:22:36.000000",
          rejected_date: null,
          requested_date: "2021-02-18 16:45:36.000000",
          activation_status: "A"
        }]
      }
    },

    methodGetStatusTag(item) {
      let type = 'default'
      if (item.main_store && item.main_store.length) {
        const status = item.main_store[0].activation_status
        if (status === 'P') {
          type = 'warning'
        } else if (status === 'A') {
          type = 'success'
        } else if (status === 'R') {
          type = 'danger'
        } else if (status === 'X') {
          type = 'danger'
        }
      }
      return type
    },

    getFormPayment(){
      // console.log('aaa', this.selectedStore.store_id)
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        store_id: this.selectedStore.store_id,
        page: 2
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'activation/service/digital-payment'),
        headers: headers,
        params
      }).then(response => {
        console.log('dataResponse', response.data)
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

    doneSubmit(){
      this.showSubmission = false
      this.$emit('doneSubmit')
    },

    dateFormat(val){
      return moment(val).format('DD MMM YYYY');
    },

    getDetailDigiPayment(){
      this.loadingGetUpdate = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'activation/service/digital-payment?store_id='+this.selectedStore.store_id),
        headers: headers
      }).then(response => {
        this.loadingGetUpdate = false
        this.dataForm = response.data.data[0]
        this.showUpdate = true
      }).catch(error => {
        this.loadingGetUpdate = false
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

    methodGetStatusTag(item) {
      let type = 'default'
      if (item.main_store && item.main_store.length) {
        const status = item.main_store[0].activation_status
        if (status === 'P') {
          type = 'warning'
        } else if (status === 'A') {
          type = 'success'
        } else if (status === 'R') {
          type = 'danger'
        } else if (status === 'X') {
          type = 'danger'
        }
      }
      return type
    }
  }
}
</script>
