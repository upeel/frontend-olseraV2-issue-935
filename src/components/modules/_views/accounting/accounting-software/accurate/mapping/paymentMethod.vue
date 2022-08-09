<template>
  <div>
    <div class="title-jurnal">
      <h4><strong>{{lang.payment_methods}} ({{params.total}})</strong>
        <div style="float: right;" v-if="editedPayment.length !== 0">
          <el-button type="info" @click="cancelMap">{{lang.cancel}}</el-button>
          <el-button type="success" @click="mapPayment" :disabled="loadingMap">
            <loading
              v-if="loadingMap"
              :active="true"
              color= '#1bb4e6'
              loader="dots"
              :width="28"
              :height="10"
              backgroundColor='#ffffff'>
            </loading>
            <span v-else>
              {{lang.save}}
            </span>
          </el-button>
        </div>
        <div v-else class="divClearMap" :class="clearMap">
          <i class="el-icon-check"></i>
        </div>
      </h4>
    </div>
    <div v-if="isLoading === false">
      <el-table
        ref="multipleTable"
        :data="dataPayment"
        v-loading="isLoading"
        max-height="340"
        class="product-table-max-height mobile-fix-height-unset"
        @sort-change="changeSortTable"
        stripe>
        <el-table-column 
          v-if="editedPayment.length !== 0"
          prop="isModified"
          width="30"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.isModified">
              <svg-icon type="edit"></svg-icon>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="payment_type"
          :label="lang.payment_modes"
          sortable>
          <template slot-scope="scope">
            <span>{{capitalize(scope.row.payment_type)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="payment"
          :label="lang.name"
          sortable>
          <template slot-scope="scope">
            <span>{{capitalize(scope.row.payment)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="accurate_account_name"
          :label="$lang[langId].account_accurate">
          <template slot-scope="scope">
            <el-select filterable 
              :placeholder="$lang[langId].select" 
              :value="scope.row.accurate_account_name"
              @input="(value) => selectAccount(value, scope.row)"
              style="width: 100%">
              <el-option
                v-for="item in dataAccount"
                :key="item.id"
                :label="item.no + ' '+ item.name"
                :value="item.name">
              </el-option>
            </el-select>
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
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import Loading from 'vue-loading-overlay';

export default {
  name: 'PaymentMethod',
  components: {
    Loading
  },
  props:['load'],
  data() {
    return {
      isLoading: false,
      loadingMap: false,
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
      filter: [
        {
          value: '',
          label: this.$store.state.userStores.lang.all
        },{
          value: 'account_no',
          label: this.$lang[this.$store.state.userStores.langId].account_number
        },{
          value: 'account_name',
          label: this.$lang[this.$store.state.userStores.langId].account_name
        },{
          value: 'accurate_account_no',
          label: this.$lang[this.$store.state.userStores.langId].account_accurate
        }
      ],
      dataPayment: [],
      dataAccount: [],
      editedPayment: [],
      clearMap: false,
      params: {
        currentPage: 1,
        per_page: 15,
        sort_column: '',
        sort_type: '',
        page: 1,
        total: null
      }
    }
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
    }
  },
  watch: {
    '$store.getters.selectedStore': function() {
      // this.getSuppProduct()
    },

    load: function(newVal, oldVal){
      this.loadData()
    }
  },
  methods: {

    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      if (val.order === null) val.order = this.params.sort_type

      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.loadData()
    },

    handleSizeChange(val) {
      this.params.page = 1
      this.params.per_page = val
      this.loadData()
    },
    
    handleCurrentChange(val, row) {
      this.params.currentPage = val
      this.params.page = val
      this.loadData()
    },

    loadData(){
      this.isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/paymentmap'),
        headers: headers,
        params: this.params
      }).then(response => {
        this.dataPayment = response.data.data
        this.dataPayment.map(v => Object.assign(v, {isModified: false}))
        this.editedPayment = []
        this.params.per_page = response.data.meta.per_page
        this.params.currentPage = response.data.meta.current_page
        this.params.total = response.data.meta.total
        this.clearMap = response.data.finishMapingStatus === 1 ? 'clear' : ''
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
    
    getAccount(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/glaccount/cashbank'),
        headers: headers
      }).then(response => {
        this.dataAccount = response.data.data
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

    selectAccount (val, row){
      let selected = {}
      this.dataAccount.forEach((item, index) => {
        if (item.name === val){
          selected = item
        }
      })

      this.dataPayment.map((item, idx) => {
        if(item.id === row.id){
          item.accurate_account_name = val
          item.isModified = true
        }
      })

      this.editedPayment.map((item, idx) => {
        if(item.payment_mode_id === row.id){
          this.editedPayment.splice(idx, 1)
        }
      })

      this.editedPayment.push({
        payment_mode_id: row.id,
        accurate_account_name: val,
        accurate_account_no: selected.no,
        accurate_accountType: selected.accountType,
        purchase_or_sales: row.purchase_or_sales 
      })
    },

    mapPayment() {
      this.loadingMap = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/paymentmap'),
        headers: headers,
        data: this.editedPayment
      }).then(response => {
        this.result = response.data
        this.loadingMap = false
        this.editedPayment = []
        if (response.data.status === 200) {
          this.$message({
            message: 'Success',
            type: 'success'
          })
        }
        this.loadData()
      })
      .catch(error => {
        this.loadingMap = false
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

    cancelMap(){
      this.editedPayment = []
      this.loadData()
    },

    capitalize(value){
      let capitalize= '';
      if(value){
        capitalize = value[0].toUpperCase() + value.slice(1);
      }
      return capitalize;
    },

  },
  mounted() {
    this.loadData()
    this.getAccount()
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
</style>