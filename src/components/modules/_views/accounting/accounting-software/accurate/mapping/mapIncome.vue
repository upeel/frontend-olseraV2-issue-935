<template>
  <div>
    <div class="title-jurnal">
      <h4><strong>{{$lang[langId].cash_debit}} ({{dataCashDebit.length}})</strong>
        <div style="float: right;" v-if="editedAccountDebit.length !== 0">
          <el-button type="info" @click="cancelMapDebit">{{lang.cancel}}</el-button>
          <el-button type="success" @click="mapAccountDebit" :disabled="loadingMapDebit">
            <loading
              v-if="loadingMapDebit"
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
        <div v-else class="divClearMap" :class="clearMapDebit">
          <i class="el-icon-check"></i>
        </div>
      </h4>
    </div>
    <div v-if="loadingMapDebit === false">
      <el-table
        ref="multipleTable"
        size="mini"
        :data="dataCashDebit"
        class="product-table-max-height mobile-fix-height-unset"
        stripe
        max-height="340">
        <el-table-column 
          v-if="editedAccountDebit.length !== 0"
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
          prop="account_no"
          :label="$lang[langId].account_number"
          sortable
          width="130">
        </el-table-column>
        <el-table-column
          prop="account_name"
          :label="$lang[langId].account_name"
          sortable>
          <template slot-scope="scope">
            <span>{{capitalize(scope.row.account_name)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="accurate_account_name"
          :label="$lang[langId].account_jurnal">
          <template slot-scope="scope">
            <el-select 
              :placeholder="$lang[langId].select" 
              filterable
              remote
              reserve-keyword
              :value="scope.row.accurate_account_name"
              @input="(value) => selectAccount('Debit', value, scope.row)"
              :remote-method="getDebit"
              style="width: 100%">
              <el-option
                v-for="item in accountDebit"
                :key="item.name"
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

    <br><br>

    <div class="title-jurnal">
      <h4><strong>{{$lang[langId].transaction_type_credit}} ({{dataTransCredit.length}})</strong>
        <div style="float: right;" v-if="editedAccountCredit.length !== 0">
          <el-button type="info" @click="cancelMapCredit">{{lang.cancel}}</el-button>
          <el-button type="success" @click="mapAccountCredit" :disabled="loadingMapCredit">
            <loading
              v-if="loadingMapCredit"
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
        <div v-else class="divClearMap" :class="clearMapCredit">
          <i class="el-icon-check"></i>
        </div>
      </h4>
    </div>
    <div v-if="loadingMapCredit === false">
      <el-table
        ref="multipleTable"
        size="mini"
        :data="dataTransCredit"
        class="product-table-max-height mobile-fix-height-unset"
        stripe
        max-height="295">
        <el-table-column 
          v-if="editedAccountCredit.length !== 0"
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
          prop="name"
          :label="$lang[langId].account_name"
          sortable>
          <template slot-scope="scope">
            <span>{{capitalize(scope.row.name)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="account_name"
          :label="$lang[langId].account_accurate">
          <template slot-scope="scope">
            <el-select 
              :placeholder="$lang[langId].select" 
              filterable
              remote
              reserve-keyword
              :value="scope.row.account_name"
              @input="(value) => selectAccount('Credit' ,value, scope.row)"
              :remote-method="getCredit"
              style="width: 100%">
              <el-option
                v-for="item in accountCredit"
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
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import Loading from 'vue-loading-overlay';
import SvgIcon from '../../../../../SvgIcon.vue';

export default {
  name: 'PaymentMethod',
  components: {
    Loading,
    SvgIcon
  },
  props:['modalShow'],
  data() {
    return {
      loadingMapDebit: false,
      loadingMapCredit: false,
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
          value: 'accurate_account_name',
          label: this.$lang[this.$store.state.userStores.langId].account_accurate
        }
      ],
      dataCashDebit: [],
      dataTransCredit: [],
      accountDebit: [],
      accountCredit: [],
      editedAccountDebit: [],
      editedAccountCredit: [],
      clearMapDebit: "",
      clearMapCredit: "",
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
  },
  methods: {

    loadDataDebit(){
      this.loadingMapDebit = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/accountmap/cash'),
        headers: headers
      }).then(response => {
        this.dataCashDebit = Array(response.data.data)
        this.loadingMapDebit = false
        let unmappedDebit = 0;
        this.dataCashDebit.map((row, idx) => {
          if(row.accurate_account_name === null){
            unmappedDebit += 1
          }
          this.dataCashDebit[idx].isModified = false
        })
        
        if(unmappedDebit === 0){
          this.clearMapDebit = 'clear'
        }
      }).catch(error => {
        this.loadingMapDebit = false
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

    loadDataCredit(){
      this.loadingMapCredit = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/transtype/credit'),
        headers: headers
      }).then(response => {
        this.dataTransCredit = response.data.data
        this.loadingMapCredit = false 
        let unmappedCredit = 0;
        this.dataTransCredit.map((row, idx) => {
          if(row.accurate_account_name === null){
            unmappedCredit += 1
          }
          this.dataTransCredit[idx].isModified = false
        })

        if(unmappedCredit === 0){
          this.clearMapCredit = 'clear'
        }
      }).catch(error => {
        this.loadingMapCredit = false 
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

    getDebit(val){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let paramsData = val ? {search: val} : {search: ''}

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/glaccount/cashbank'),
        headers: headers,
        params: paramsData
      }).then(response => {
        this.accountDebit = response.data.data
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
    
    getCredit(val){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let paramsData = val ? {search: val} : {search: ''}

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/glaccount/allincome'),
        headers: headers,
        params: paramsData
      }).then(response => {
        this.accountCredit = response.data.data
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

    selectAccount (type, val, row){
      let selected = {}
        if(type === 'Debit'){
          this.accountDebit.forEach((item, index) => {
            if (item.name === val){
              selected = item
            }
          })

          this.dataCashDebit.map((item, idx) => {
            if(item.account_name === row.account_name){
              item.accurate_account_name = val
              item.isModified = true
            }
          })

          this.editedAccountDebit.map((item, idx) => {
            if(item.account_no === row.account_no){
              this.editedAccountDebit.splice(idx, 1)
            }
          })

          this.editedAccountDebit.push({
            account_no: row.account_no,
            accurate_account_name: val,
            accurate_account_no: selected.no,
            accurate_accountType: selected.accountType
          })
        }

        if(type === 'Credit'){
          this.accountCredit.forEach((item, index) => {
            if (item.name === val){
              selected = item
            }
          })

          this.dataTransCredit.map((item, idx) => {
            if(item.id === row.id){
              item.account_name = val
              item.isModified = true
            }
          })

          this.editedAccountCredit.map((item, idx) => {
            if(item.id === row.id){
              this.editedAccountCredit.splice(idx, 1)
            }
          })

          this.editedAccountCredit.push({
            id: row.id,
            account_name: val,
            account_no: selected.no,
          })
        }

    },

    mapAccountDebit(){
      this.loadingMapDebit = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/accountmap/cash'),
        headers: headers,
        data: this.editedAccountDebit[0]
      }).then(response => {
        this.loadingMapDebit = false
        this.result = response.data
        this.editedAccountDebit = []
        if (response.data.status === 200) {
          this.$message({
            message: 'Success',
            type: 'success'
          })
        }
        this.loadDataDebit()
      })
      .catch(error => {
        this.loadingMapDebit = false
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

    cancelMapDebit(){
      this.editedAccountDebit = []
      this.loadDataDebit()
    },

    mapAccountCredit(){
      this.loadingMapCredit = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/transtype'),
        headers: headers,
        data: this.editedAccountCredit
      }).then(response => {
        this.loadingMapCredit = false
        this.result = response.data
        this.editedAccountCredit = []
        if (response.data.status === 200) {
          this.$message({
            message: 'Success',
            type: 'success'
          })
        }
        this.loadDataCredit()
      })
      .catch(error => {
        this.loadingMapCredit = false
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

    cancelMapCredit(){
      this.editedAccountCredit = []
      this.loadDataCredit()
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
    this.loadDataDebit()
    this.loadDataCredit()
    this.getCredit()
    this.getDebit()
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