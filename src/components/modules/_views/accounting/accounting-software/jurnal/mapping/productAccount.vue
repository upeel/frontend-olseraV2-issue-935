<template>
  <div>
    <div class="title-jurnal">
      <h4><strong>{{$lang[langId].account_product}} ({{dataProductAccount.length}})</strong>
        <div style="float: right;" v-if="editedAccount.length !== 0">
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
        <div v-else style="float: right;">
          <el-button type="primary" size="small" @click="changeProduct">{{$lang[langId].advanced}}</el-button>
        </div>
        <!-- <div v-else class="divClearMap" :class="clearMap">
          <i class="el-icon-check"></i>
        </div> -->
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
          v-if="editedAccount.length !== 0"
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
          prop="jurnal_account_name"
          :label="$lang[langId].account_jurnal">
          <template slot-scope="scope">
						<div v-if="$route.query.typeJurnal === '0'">
							<el-select 
								:placeholder="$lang[langId].select"
								filterable
								:value="scope.row.jurnal_account_name"
								@input="(value) => selectAccount(value, scope.row)"
								style="width: 100%">
								<el-option
									v-for="item in dataAccount"
									:key="item.name"
									:label="item.number + ' '+ item.name"
									:value="item.name">
								</el-option>
							</el-select>
						</div>
						<div v-else>
							<el-select 
								v-if="scope.row.id === 1"
								:placeholder="$lang[langId].select"
								filterable
								:value="scope.row.jurnal_account_name"
								@input="(value) => selectAccount(value, scope.row)"
								style="width: 100%">
								<el-option
									v-for="item in accountInventory"
									:key="item.name"
									:label="item.number + ' '+ item.name"
									:value="item.name">
								</el-option>
							</el-select>
							<el-select 
								v-else-if="scope.row.id === 2 || scope.row.id === 6"
								:placeholder="$lang[langId].select"
								filterable
								:value="scope.row.jurnal_account_name"
								@input="(value) => selectAccount(value, scope.row)"
								style="width: 100%">
								<el-option
									v-for="item in accountIncome"
									:key="item.name"
									:label="item.number + ' '+ item.name"
									:value="item.name">
								</el-option>
							</el-select>
							<el-select 
								v-else-if="scope.row.id === 3 || scope.row.id === 4 || scope.row.id === 7"
								:placeholder="$lang[langId].select"
								filterable
								:value="scope.row.jurnal_account_name"
								@input="(value) => selectAccount(value, scope.row)"
								style="width: 100%">
								<el-option
									v-for="item in accountCashBank"
									:key="item.name"
									:label="item.number + ' '+ item.name"
									:value="item.name">
								</el-option>
							</el-select>
							<el-select 
								v-else-if="scope.row.id === 8"
								:placeholder="$lang[langId].select"
								filterable
								:value="scope.row.jurnal_account_name"
								@input="(value) => selectAccount(value, scope.row)"
								style="width: 100%">
								<el-option
									v-for="item in accountDiscount"
									:key="item.name"
									:label="item.number + ' '+ item.name"
									:value="item.name">
								</el-option>
							</el-select>
							<el-select 
								v-else
								:placeholder="$lang[langId].select"
								filterable
								:value="scope.row.jurnal_account_name"
								@input="(value) => selectAccount(value, scope.row)"
								style="width: 100%">
								<el-option
									v-for="item in dataAccount"
									:key="item.name"
									:label="item.number + ' '+ item.name"
									:value="item.name">
								</el-option>
							</el-select>
						</div>
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
      editedAccount: [],
			accountCashBank: [],
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
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/productaccount'),
        headers: headers,
        params: this.params
      }).then(response => {
        this.dataProductAccount = response.data.data
        let unmapped = 0;
        this.dataProductAccount.map((row, idx) => {
          if(row.jurnal_account_name === null){
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
    
    getAccount(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

			let url = 'exjurnal/account'

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, url),
        headers: headers
      }).then(response => {
        this.dataAccount = response.data.data
				if(this.$route.query.typeJurnal === '1'){
					this.accountInventory = this.dataAccount.filter(function(event){
						return event.category_id == 15;
					});

					this.accountIncome = this.dataAccount.filter(function(event){
						return event.category_id == 13;
					});

					this.accountDiscount = this.dataAccount.filter(function(event){
						return event.category_id == 4;
					});

					this.accountCashBank = this.dataAccount.filter(function(event){
						return event.category_id == 3;
					});
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

    selectAccount (val, row){

      this.dataProductAccount.map((item, idx) => {
        if(item.id === row.id){
          item.jurnal_account_name = val
          item.isModified = true
        }
      })

      this.editedAccount.map((item, idx) => {
        if(item.id === row.id){
          this.editedAccount.splice(idx, 1)
        }
      })

      this.editedAccount.push({
        id: row.id,
        name: row.name,
        jurnal_account_name: val,
      })

    },

    mapProductAccount(){
      this.loadingMap = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/productaccount'),
        headers: headers,
        data: this.editedAccount
      }).then(response => {
        this.loadingMap = false
        this.editedAccount = []
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
      this.editedAccount = []
      this.loadData()
    },

    capitalize(value){
      let capitalize= '';
      if(value){
        capitalize = value[0].toUpperCase() + value.slice(1);
      }
      return capitalize;
    },

    changeProduct(){
      this.$emit('changeProduct')
    }

  },
  mounted() {
    this.loadData()
    this.getAccount()
  }
}
</script>
