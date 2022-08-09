<template>
  <div class="px-20">
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
      <el-card class="box-card" shadow="never">
        <div slot="header" class="table-handler-flex">
          <h4 style="flex-grow: 1;">{{ lang.supplier}} {{lang.due_date}}</h4>

          <el-select class="inline-form" v-model="params.per_page"  @change="handleSizeChange" placeholder="Select" size="small">
            <el-option
              v-for="item in itemPage"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>

        </div>
        <div class="card-body">
            <div v-if="isLoading === false">
              <el-table
                ref="multipleTable"
                v-loading="isLoading"
                class="product-table-max-height mobile-fix-height-unset"
                :data="dataDueDate"
                @sort-change="changeSortTable"
                stripe>
                <el-table-column
                  prop="name"
                  :label="lang.supplier_name">
                  <template slot-scope="scope">
                    <span v-if="scope.row.name !== null">{{ capitalize(scope.row.name) }}</span>
                    <span v-else>-</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="address"
                  :label="lang.address"
                  width="400">
                  <template slot-scope="scope">
                    <span v-if="scope.row.address !== null">{{ scope.row.address }}</span>
                    <span v-else>-</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="account_name"
                  :label="lang.due_date">
                  <template slot-scope="scope">
                    <span v-if="scope.row.due_date !== null">{{ scope.row.due_date }} {{scope.row.due_date > 1 ? lang.days : lang.day}}</span>
                    <span v-else>-</span>
                  </template>
                </el-table-column>
                <el-table-column :label="$lang[langId].action" align="right" width="90px">
                  <template slot-scope="scope">
                    <el-button type="text" style=" width: 100%; text-align: right;" @click="showSetDialog(scope.row)">
                      {{ lang.edit }} 
                    </el-button>
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

		<dialog-setup :show="dialogSetup" @doneSetup="finishSetup"/>

    <el-dialog
      :visible.sync="dialogSetDueDate"
      :show-close="false"
      width="40%"
      custom-class="dialog-card">
      <div slot="title" class="flex-container" style="text-align: center">
        <el-row :gutter="20"  style="width: 100%">
          <el-col :span="14">
            <h4 class="dialog-title" style="padding-left: 5%; text-align: left;"> {{capitalize(setPayment.supplier_name)}} {{$lang[langId].due_date}}</h4>
          </el-col>
          <el-col :span="10" align="right">
            <div class="btn_accounting_dialog">
              <el-button type="info" @click="cancelSetDueDate">{{ lang.cancel }}</el-button>
              <el-button type="success" @click="handleSetDueDate">{{ lang.update }}</el-button>
            </div>
          </el-col>
        </el-row>
        
      </div>
      <div>
        <div style="width: 100%; padding: 0 5% 0 5%;">
          <el-form @submit.native.prevent style="width: 100%">
            <div>
              <label style="font-size: 12px">{{ lang.due_date }}</label>
            </div>
            <el-form-item>
              <el-input type="number" min="1" v-model="setPayment.due_date">
                <template slot="append">{{lang.days}}</template>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-dialog>

  </div>
</template>


<script>
import { baseApi } from 'src/http-common';
import axios from 'axios';
import Loading from 'vue-loading-overlay';
import mixinAccounting from '@/mixins/mixinAccounting';
import dialogSetup from 'components/modules/_views/accounting/dialogSetup';
var moment = require('moment')

export default {
  name: 'Payment Map',
  components: {
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
    this.getDueDate()
  },

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
      selectedMonth: moment(),
      isLoading: false,
      dialogSetDueDate: false,
      dataDueDate: [],
      setPayment: {
        id: '',
        due_date: '',
        supplier_name: ''
      },
      params: {
        currentPage: 1,
        per_page: 15,
        sort_column: 'id',
        sort_type: 'desc',
        page: 1,
        total: null
      }
    }
  },

  methods: {
    handleSizeChange(val) {
      this.params.page = 1
      this.params.per_page = val
      this.getDueDate()
    },
    
    handleCurrentChange(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getDueDate()
    },

    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      if (val.order === null) val.order = this.params.sort_type

      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.getDueDate()
    },

    getDueDate() {
      this.isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/supplierduedate'),
        headers: headers,
        params: this.params
      }).then(response => {
        this.dataDueDate = response.data.data
        this.params.per_page = response.data.meta.per_page
        this.params.currentPage = response.data.meta.current_page
        this.params.total = response.data.meta.total
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

    showSetDialog(row) {
      this.dialogSetDueDate = true
      this.setPayment = {
        id: row.id,
        supplier_name: row.name,
        due_date: row.due_date,
      }
    },

    handleSetDueDate() {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let data = {
        id: this.setPayment.id,
        due_date: this.setPayment.due_date
      }

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/supplierduedate'),
        headers: headers,
        params: data
      }).then(response => {

        this.$message({
          type: 'success',
          message: 'Success' 
        })
        this.dialogSetDueDate = false
        this.dataDueDate.map((i, idx) => {
          if (i.id === data.id) {
            this.dataDueDate[idx].due_date = data.due_date
          }
        })
        this.setPayment = {
          id: '',
          due_date: '',
          supplier_name: '',
        }
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

    cancelSetDueDate(){
      this.dialogSetDueDate = false
      this.setPayment = {
        id: '',
        due_date: '',
        supplier_name: '',
      }
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
