<template>
  <div>
    <div class="title-jurnal">
      <h4><strong>{{$lang[langId].account_transaction}} ({{dataTransAccount.length}})</strong>
        <div style="float: right;" v-if="editedTrans.length !== 0">
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
        <!-- <div v-else class="divClearMap" :class="clearMap">
          <i class="el-icon-check"></i>
        </div> -->
				<div v-else class="fl-right">
					<el-button type="primary" size="small" @click="changeAdvance">{{$lang[langId].advanced}}</el-button>
				</div>
      </h4>
    </div>
    <div v-if="isLoading === false">
      <el-table
        ref="multipleTable"
        :data="dataTransAccount"
        class="product-table-max-height mobile-fix-height-unset"
        max-height="340"
        stripe>
        <el-table-column 
          v-if="editedTrans.length !== 0"
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
          :label="lang.transaction_type_name">
          <template slot-scope="scope">
            <span>{{capitalize(scope.row.description)}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="accurate_account_no"
          :label="$lang[langId].account_accurate">
          <template slot-scope="scope">
            <el-select v-if="scope.$index === 0"
              :placeholder="$lang[langId].select"
              filterable
              remote
              reserve-keyword
              :value="scope.row.accurate_account_no"
              @input="(value) => selectAccount(value, scope.row, scope.$index)"
              :remote-method="(value) => searchAccount(value, scope.$index)"
              style="width: 100%">
              <el-option
                v-for="(item, keyAccount) in dataExpense"
                :key="keyAccount"
                :label="item.no + ' '+ item.name"
                :value="item.no">
              </el-option>
            </el-select>

            <el-select v-if="scope.$index === 1"
              :placeholder="$lang[langId].select"
              filterable
              remote
              reserve-keyword
              :value="scope.row.accurate_account_no"
              @input="(value) => selectAccount(value, scope.row, scope.$index)"
              :remote-method="(value) => searchAccount(value, scope.$index)"
              style="width: 100%">
              <el-option
                v-for="(item, keyAccount) in dataCash"
                :key="keyAccount"
                :label="item.no + ' '+ item.name"
                :value="item.no">
              </el-option>
            </el-select>

            <el-select v-if="scope.$index === 2"
              :placeholder="$lang[langId].select"
              filterable
              remote
              reserve-keyword
              :value="scope.row.accurate_account_no"
              @input="(value) => selectAccount(value, scope.row, scope.$index)"
              :remote-method="(value) => searchAccount(value, scope.$index)"
              style="width: 100%">
              <el-option
                v-for="(item, keyAccount) in dataRevenue1"
                :key="keyAccount"
                :label="item.no + ' '+ item.name"
                :value="item.no">
              </el-option>
            </el-select>

            <el-select v-if="scope.$index === 3"
              :placeholder="$lang[langId].select"
              filterable
              remote
              reserve-keyword
              :value="scope.row.accurate_account_no"
              @input="(value) => selectAccount(value, scope.row, scope.$index)"
              :remote-method="(value) => searchAccount(value, scope.$index)"
              style="width: 100%">
              <el-option
                v-for="(item, keyAccount) in dataRevenue2"
                :key="keyAccount"
                :label="item.no + ' '+ item.name"
                :value="item.no">
              </el-option>
            </el-select>

            <el-select v-if="scope.$index === 4"
              :placeholder="$lang[langId].select"
              filterable
              remote
              reserve-keyword
              :value="scope.row.accurate_account_no"
              @input="(value) => selectAccount(value, scope.row, scope.$index)"
              :remote-method="(value) => searchAccount(value, scope.$index)"
              style="width: 100%">
              <el-option
                v-for="(item, keyAccount) in dataOther1"
                :key="keyAccount"
                :label="item.no + ' '+ item.name"
                :value="item.no">
              </el-option>
            </el-select>

            <el-select v-if="scope.$index === 5"
              :placeholder="$lang[langId].select"
              filterable
              remote
              reserve-keyword
              :value="scope.row.accurate_account_no"
              @input="(value) => selectAccount(value, scope.row, scope.$index)"
              :remote-method="(value) => searchAccount(value, scope.$index)"
              style="width: 100%">
              <el-option
                v-for="(item, keyAccount) in dataOther2"
                :key="keyAccount"
                :label="item.no + ' '+ item.name"
                :value="item.no">
              </el-option>
            </el-select>

            <el-select v-if="scope.$index === 6"
              :placeholder="$lang[langId].select"
              filterable
              remote
              reserve-keyword
              :value="scope.row.accurate_account_no"
              @input="(value) => selectAccount(value, scope.row, scope.$index)"
              :remote-method="(value) => searchAccount(value, scope.$index)"
              style="width: 100%">
              <el-option
                v-for="(item, keyAccount) in dataOther3"
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
  name: 'TransAccount',
  components: {
    Loading
  },
  props:['load'],
  data() {
    return {
      isLoading: false,
      loadingMap: false,
      dataTransAccount: [],
      dataExpense: [],
      dataCash: [],
      dataRevenue1: [],
      dataRevenue2: [],
      dataOther1: [],
      dataOther2: [],
      dataOther3: [],
      accountInventory: [],
      accountIncome: [],
      accountDiscount: [],
      editedTrans: [],
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
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/accounttrans'),
        headers: headers,
        params: this.params
      }).then(response => {
        this.dataTransAccount = response.data.data
        let unmapped = 0;
        this.dataTransAccount.map((row, idx) => {
          if(row.accurate_account_name === null){
            unmapped += 1
          } 
          this.dataTransAccount[idx].isModified = false
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
    
    getAccount(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      var urlArray = [{url: 'expense'},{url: 'cashbank'},{url: 'revenue'},{url: 'otherincome'}]
      urlArray.forEach((itemUrl, idxUrl) => {
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/glaccount/'+itemUrl.url),
          headers: headers
        }).then(response => {
          if(idxUrl === 0){
            this.dataExpense = response.data.data
          }else if(idxUrl === 1){
            this.dataCash = response.data.data
          }else if(idxUrl === 2){
            this.dataRevenue1 = response.data.data
            this.dataRevenue2 = response.data.data
          }else if(idxUrl === 3){
            this.dataOther1 = response.data.data
            this.dataOther2 = response.data.data
            this.dataOther3 = response.data.data
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
      })
    },

    searchAccount(val, index){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let url = ''
      if(index === 0){
        url = 'expense'
      }else if(index === 1){
        url = 'cashbank'
      }else if(index === 2 || index === 3){
        url = 'revenue'
      }else if(index === 4|| index === 5 || index === 6){
        url = 'otherincome'
      }

      let params = {
        search: val
      } 

      if(val.length >= 6){
       axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/glaccount/'+url),
          headers: headers,
          params: params
        }).then(response => {
          if(index === 0){
            this.dataExpense = response.data.data
          }else if(index === 1){
            this.dataCash = response.data.data
          }else if(index === 2){
            this.dataRevenue1 = response.data.data
          }else if(index === 3){
            this.dataRevenue2 = response.data.data
          }else if(index === 4){
            this.dataOther1 = response.data.data
          }else if(index === 5){
            this.dataOther2 = response.data.data
          }else if(index === 6){
            this.dataOther3 = response.data.data
          }
        }).catch(error => {
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        })
      }else if(val.length === 0){
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/glaccount/'+url),
          headers: headers,
          params: params
        }).then(response => {
          if(index === 0){
            this.dataExpense = response.data.data
          }else if(index === 1){
            this.dataCash = response.data.data
          }else if(index === 2){
            this.dataRevenue1 = response.data.data
          }else if(index === 3){
            this.dataRevenue2 = response.data.data
          }else if(index === 4){
            this.dataOther1 = response.data.data
          }else if(index === 5){
            this.dataOther2 = response.data.data
          }else if(index === 6){
            this.dataOther3 = response.data.data
          }
        }).catch(error => {
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        })
      }
    },

    selectAccount (val, row, idxData){
      this.dataTransAccount.map((item, idx) => {
        if(item.id === row.id){
          item.accurate_account_no = val
          item.isModified = true
        }
      })

      this.editedTrans.map((item, idx) => {
        if(item.id === row.id){
          this.editedTrans.splice(idx, 1)
        }
      })

      let dataAccount = []

      if(idxData === 0){ 
        dataAccount = this.dataExpense
      }else if(idxData === 1){
        dataAccount = this.dataCash
      }else if(idxData === 2){
        dataAccount = this.dataRevenue1
      }else if(idxData === 3){
        dataAccount = this.dataRevenue2
      }else if(idxData === 4){
        dataAccount = this.dataOther1
      }else if(idxData === 5){
        dataAccount = this.dataOther2
      }else if(idxData === 6){
        dataAccount = this.dataOther3
      }

      var filtered = dataAccount.filter(function(event){
          return event.no == val;
      });

      this.editedTrans.push({
        id: row.id,
        no: val,
        name: filtered[0].name,
      })
    },

    mapProductAccount(){
      this.loadingMap = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/accounttrans'),
        headers: headers,
        data: this.editedTrans
      }).then(response => {
        this.result = response.data
        this.loadingMap = false
        this.editedTrans = []
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
      this.editedTrans = []
      this.dataTransAccount = []
      this.loadData()
    },

    capitalize(value){
      let capitalize= '';
      if(value){
        capitalize = value[0].toUpperCase() + value.slice(1);
      }
      return capitalize;
    },

    changeAdvance(){
      this.$emit('changeAdvance')
    }

  },
  mounted() {
    this.loadData()
    this.getAccount()
  }
}
</script>
