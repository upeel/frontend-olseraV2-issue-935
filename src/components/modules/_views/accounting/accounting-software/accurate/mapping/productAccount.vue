<template>
  <div>
    <div class="title-jurnal">
      <h4><strong>{{$lang[langId].account_product}} ({{dataProductAccount.length}})</strong>
        <div style="float: right;" v-if="editedAccount.id">
          <el-button type="info" @click="cancelMap">{{lang.cancel}}</el-button>
          <el-button type="success" @click="mapProductAccount" :disabled="loadingMap">
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
      </h4>
    </div>
    <div v-if="isLoading === false">
      <el-table
        ref="multipleTable"
        :data="dataProductAccount"
        class="product-table-max-height mobile-fix-height-unset"
        max-height="340"
        stripe>
        <el-table-column 
          v-if="editedAccount.id"
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
          prop="description"
          :label="$lang[langId].account_name">
          <template slot-scope="scope">
            <span>{{capitalize(scope.row.description)}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="accurate_account_no"
          :label="$lang[langId].account_accurate">
          <template slot-scope="scope">
            <el-select
              :placeholder="$lang[langId].select"
              filterable
              remote
              reserve-keyword
              :value="scope.row.accurate_account_no"
              @input="(value) => selectAccount(value, scope.row)"
              :remote-method="getAccount"
              style="width: 100%">
              <el-option
                v-for="(item, keyAccount) in dataAccount"
                :key="keyAccount"
                :label="item.no + ' '+ item.name"
                :value="item.no">
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

export default {
  name: 'ProductAccount',
  components: {
    Loading
  },
  props:['load'],
  data() {
    return {
      isLoading: false,
      loadingMap: false,
      dataProductAccount: [],
      dataAccount: [],
      accountInventory: [],
      accountIncome: [],
      accountDiscount: [],
      editedAccount: {id: '', no: '', name: ''},
      clearMap: "",
      params: {
        sort_column: '',
        sort_type: '',
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
    load: function(newVal, oldVal) {
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

    loadData(){
      this.isLoading = true
      this.dataProductAccount = []
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/otherproduct'),
        headers: headers,
        params: this.params
      }).then(response => {
        this.dataProductAccount.push(response.data.data)
        let unmapped = 0;
        this.dataProductAccount.map((row, idx) => {
          if(row.accurate_account_name === null){
            unmapped += 1
          } 
          this.dataProductAccount[idx].isModified = false
        })

        if(unmapped === 0){
          this.clearMap = 'clear'
        }
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
    
    getAccount(val){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let paramsData = val ? {search: val} : {search: ''}

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/glaccount/revenue'),
        headers: headers,
        params: paramsData
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
      this.dataProductAccount[0].accurate_account_no = val
      this.dataProductAccount[0].isModified = true

      let accountName = ""
      this.dataAccount.map((item, idx) => {
        if(item.no === val){
          accountName = item.name
        }
      })

      this.editedAccount = {
        id: row.id,
        no: val,
        name: accountName,
      }
    },

    mapProductAccount(){
      this.loadingMap = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/otherproduct'),
        headers: headers,
        data: this.editedAccount
      }).then(response => {
        this.result = response.data
        this.loadingMap = false
        this.editedAccount =  {id: '', no: '', name: ''}
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
      this.editedAccount = {id: '', no: '', name: ''}
      this.dataProductAccount = []
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
