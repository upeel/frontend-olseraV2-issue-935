<template>
  <el-dialog
    :title="'Export' + $lang[langId].payable"
    :visible.sync="show"
    @open="openExport"
    @close="closeExport"
    width="30%"
    center>
    <div>
      <el-form class="mt-24">
        <el-form-item label="File" :label-width="formLabelWidth">
          <el-radio-group v-model="paramsExport.typeExport" size="small" class="full-radio" style="width: 90%;">
            <el-radio-button label="PDF">PDF</el-radio-button>
            <el-radio-button label="Excel">EXCEL</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="lang.search" :label-width="formLabelWidth">
          <el-input
            v-model="paramsExport.search"
            class="input-search"
            :placeholder="lang.transactions+'/'+lang.customer+'/'+lang.description"
            clearable
            prefix-icon="el-icon-search"
            style="width: 90%;">
          </el-input>
        </el-form-item>
        <el-form-item :label="lang.rows" :label-width="formLabelWidth" v-show="paramsExport.typeExport === 'Excel'">
          <el-select v-model="paramsExport.rowExcel" placeholder="Select" @change="changeRowExcel" style="width: 90%;">
            <el-option
              v-for="item in labelRow"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="lang.date" :label-width="formLabelWidth">
          <el-row style="width: 90%;">
            <el-col :span="9">
              <el-select v-model="paramsExport.typeDateExport" @change="changeTypeDate">
                <el-option :label="$lang[langId].single_date" value="single">{{$lang[langId].single_date}}</el-option>
                <el-option :label="$lang[langId].until_date" value="until">{{$lang[langId].until_date}}</el-option>
              </el-select>
            </el-col>
            <el-col :span="15">
              <el-date-picker v-if="paramsExport.typeDateExport === 'single'"
                v-model="paramsExport.filterExport.date"
                type="date" style="width: 100%;"
                format="dd MMM yyyy"
                :placeholder="$lang[langId].pick_a_day">
              </el-date-picker>
              <el-date-picker  v-else
                v-model="paramsExport.filterExport.until_date"
                type="date" style="width: 100%;"
                format="dd MMM yyyy"
                :placeholder="$lang[langId].pick_a_day">
              </el-date-picker>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item  :label="lang.status" :label-width="formLabelWidth">
          <el-checkbox v-model="statusExport.unpaid" :label="lang.unpaid" border size="small" style="margin-right: 5px;"></el-checkbox>
          <el-checkbox v-model="statusExport.partial" :label="lang.partial" border size="small" style="margin-right: 0px;"></el-checkbox>
          <el-checkbox v-model="statusExport.paid" :label="$lang[langId].paid_off" border size="small" style="margin-right: 0px;"></el-checkbox>
        </el-form-item>
        <!-- <el-form-item :label="lang.amount" :label-width="formLabelWidth">
          <money v-model="filterExport.amount"
            v-bind="money"
            :prefix="selectedStore.currency_id + ' '"
            class="form-input input-sm input-money"
            style="height: 36px; width: 90%">
          </money>
        </el-form-item> -->
        <el-form-item :label="$lang[langId].payable" :label-width="formLabelWidth">
          <el-radio-group v-model="paramsExport.filterExport.due_dates" style="	border: groove; border-color: #409eff54; border-width: thin;">
            <el-radio-button label="true">
              {{ this.$lang[langId].due_date2 }}
            </el-radio-button>
            <el-radio-button label="false">
              {{ this.$lang[langId].all_payable }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="paramsExport.filterExport.due_dates === 'true'" :label="$lang[langId].due_date_at" :label-width="formLabelWidth" style="word-break: normal;">
           <el-date-picker
              v-model="paramsExport.dueDateAt"
              type="date"
              format="dd MMM yyyy"
              value-format="yyyy-MM-dd"
              :placeholder="$lang[langId].pick_a_day"
              style="width: 90%;">
            </el-date-picker>
        </el-form-item>

      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleExport">Export {{paramsExport.typeExport}}</el-button>
    </span>
  </el-dialog>
</template>

<script>

import axios from 'axios'
import {baseApi} from 'src/http-common'
var moment = require('moment')

export default {
  name: 'DialogExport',
  props: ['show','filter', 'status', 'typeDate', 'dueDate', 'search'],

  components: {
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
    },
  },


  data() {
    return {
      money: {
        decimal: ',',
        thousands: '.',
        prefix: this.$store.getters.selectedStore.currency_id + ' ',
        precision: 0,
        masked: false
      },
      statusExport: {
        unpaid: true,
        partial: true,
        paid: false
      },
      formLabelWidth: '100px',
      loadingExport: false,
      paramsExport: {
        search: '',
        typeExport: 'PDF',
        typeDateExport: 'single',
        is_paid:['0','2'],
        filterExport: {
          due_dates: 'false',
          date: '',
          until_date: '',
          amount: 0
        },
        dueDateAt: '',
        rowExcel: '',
      },
      labelRow: []
    }
  },

  watch:{
    statusExport: {
      handler: function(val){
        this.paramsExport.is_paid = []
        if(val.unpaid && this.paramsExport.is_paid.includes('0') === false){
          this.paramsExport.is_paid.push('0')
        }

        if(val.paid && this.paramsExport.is_paid.includes('1') === false){
          this.paramsExport.is_paid.push('1')
        }

        if(val.partial && this.paramsExport.is_paid.includes('2') === false){
          this.paramsExport.is_paid.push('2')
        }
      },
      deep: true
    }

  },

  mounted(){
    var a = 0
    var b = []
    var start = 0
    var end = 0
    for (let i = 1; i <= 200; i++) {
      start = i * 1000 - 999
      end = i * 1000
      b.push(
        { 
          value: start + ' - ' + end,
          key: i-1,
          string: start + '_' + end
        }
      )
    }
    this.labelRow = b
  },
  
  methods: {
    changeTypeDate(){
      this.filter.date = ''
      this.filter.until_date = ''
    },

    changeRowExcel(val){
      console.log('aaadfggg', val)
    },

    getPDF() {
      this.loadingExport = true
      if (this.$store.getters.webviewMode) {
        this.getFileMobile('pdf')
      } else {
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }

        let params = {
          search: this.paramsExport.search,
          is_paid: this.paramsExport.is_paid,
          due_dates: this.paramsExport.filterExport.due_dates,
          due_dates_at: this.paramsExport.dueDateAt
        }

        if (this.paramsExport.typeDateExport === 'single'){
          params.date = this.paramsExport.filterExport.date
        } else {
          params.until_date = this.paramsExport.filterExport.until_date
        }

        axios({
          url: baseApi(this.selectedStore.url_id, this.langId, 'account/payble/pdf'),
          method: 'GET',
          responseType: 'blob',
          headers,
          params: params
        }).then((response) => {
          const file = new Blob([response.data])
          const fileName = this.$lang[this.langId].payable + '-' + moment().format('yyyyMMDD') + '.pdf'
          const url = window.URL.createObjectURL(file)
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click()
          this.loadingExport = false
        }).catch(error => {
          this.loadingExport = false
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
      this.loadingExport = true
      if (this.$store.getters.webviewMode) {
        this.getFileMobile('csv', data)
      } else {
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }

        let params = {
          search: this.paramsExport.search,
          is_paid: this.paramsExport.is_paid,
          due_dates: this.paramsExport.filterExport.due_dates,
          due_dates_at: this.paramsExport.dueDateAt,
          p: this.paramsExport.rowExcel
        }

        if (this.paramsExport.typeDateExport === 'single'){
          params.date = this.paramsExport.filterExport.date
        } else {
          params.until_date = this.paramsExport.filterExport.until_date
        }

        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'account/payble/excel'),
          responseType: 'blob',
          headers,
          params
        }).then(response => {
            const fileName = this.$lang[this.langId].payable + '-' + moment().format('yyyyMMDD') + '.csv'
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
            this.loadingExport = false
        })
        // .catch(error => {
        //   this.loadingExport = false
        //   if(typeof error.response.data.error.error === 'object'){
        //     let errorKey = Object.keys(error.response.data.error.error)[0];
        //     this.$notify({
        //       tipe: 'warning',
        //       title: error.response.data.error.message,
        //       message: error.response.data.error.error[errorKey][0]
        //     })
        //   } else {
        //     this.$notify({q
        //       tipe: 'warning',
        //       title: error.response.data.error.message,
        //       message: error.response.data.error.error
        //     })
        //   }
        // })
      }
    },

    getFileMobile(type, data) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let params = {
        search: this.paramsExport.search,
        is_paid: this.paramsExport.is_paid,
        due_dates: this.paramsExport.filterExport.due_dates,
        due_dates_at: this.paramsExport.dueDateAt
      }

      if (this.paramsExport.typeExport === 'Excel'){
        params.p = this.paramsExport.rowExcel
      }

      if (this.paramsExport.typeDateExport === 'single'){
        params.date = this.paramsExport.filterExport.date
      } else {
        params.until_date = this.paramsExport.filterExport.until_date
      }

      axios({
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/payble/' + type),
        method: 'GET',
        responseType: 'blob',
        headers,
        params: params
      }).then((response) => {
        this.loadingExport = false
        const file = new Blob([response.data])
        const fileName = this.$lang[this.langId].payable + '-' + moment().format('yyyyMMDD') + '.' + type
        const url = window.URL.createObjectURL(file)
        const apiParams = '?' + this.params
        const apiURL = '/download/api/' + this.selectedStore.url_id + '/admin/v1/' + this.langId + '/account/payble/' + type
        window.location = apiURL + apiParams + ',' + fileName
      }).then(error => {
        this.loadingExport = false
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
    
    handleExport(){
      if (this.paramsExport.typeExport === 'Excel'){
        this.getExcel()
      } else {
        this.getPDF()
      }
    },

    openExport(){
      this.paramsExport.filterExport = this.filter
      this.statusExport = this.status
      this.paramsExport.dueDateAt = this.dueDate
      this.paramsExport.typeDateExport = this.typeDate
      this.paramsExport.search = this.search
    },

    closeExport(){
      this.$emit('close')
    }
  }
}
</script>
