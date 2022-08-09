<template>
  <div>
		<div>
			<div class="title-jurnal">
				<h4><strong>{{$lang[langId].cash_n_bank}}</strong></h4>
			</div>
			<el-table
				ref="multipleTable"
				:data="defaultCashBank"
				:show-header="false"
				v-loading="isLoading"
				class="product-table-max-height mobile-fix-height-unset"
				max-height="340"
				stripe>
				<el-table-column
					prop="description">
					<template slot-scope="scope">
						<span>{{capitalize(scope.row.description)}}</span>
					</template>
				</el-table-column>
				<el-table-column
					prop="jurnal_account_no">
					<template slot-scope="scope">
            <el-select 
              v-if="scope.row.isMap" 
              :placeholder="$lang[langId].select" 
              filterable
              v-model="tempParams.account_id"
              style="width: 100%">
              <el-option
                v-for="item in dataCashBank"
                :key="item.id"
                :label="item.no+' '+ item.name"
                :value="item.id">
              </el-option>
            </el-select>
						<span v-else>{{scope.row.jurnal_account_no +' - '+ capitalize(scope.row.jurnal_account_name)}}</span>
					</template>
				</el-table-column>
        <el-table-column width="90" align="right">
          <template slot-scope="scope">
						<div v-if="scope.row.isLoading === false">
							<el-button v-if="scope.row.isMap === false" type="text" @click="mapCashBank(scope.row)">
								<svg-icon type="edit"></svg-icon>
							</el-button>

							<el-button class="cancel-button" type="text" v-if="scope.row.isMap" @click="cancelCashBank()" style="color: rgb(255, 0, 0);">
								<svg-icon type="cancel-edit"></svg-icon>
							</el-button>
							<el-button class="save-button" type="text" v-if="scope.row.isMap" @click="saveCashBank()">
								<svg-icon type="check-circle"></svg-icon>
							</el-button>
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
          </template>
        </el-table-column>
			</el-table>
		</div>
		<div>
			<div class="title-jurnal mt-32">
				<h4><strong>{{$lang[langId].suppliers}}</strong>
					<div style="float: right;">
						<el-popover
							placement="left"
							width="400"
							trigger="click">
							<div>
								<el-row :gutter="20" style="line-height: 2;">
									<el-col :span="18">
										<el-input placeholder="Please input" v-model="supplierFiktif"></el-input>
										<p class="font-11">Default: {{$lang[langId].stock_in_supplier}}</p>
									</el-col>
									<el-col :span="6">
										<el-button type="primary" @click="postSupplier" :loading="loadingPostVendor">POST</el-button>
									</el-col>
								</el-row>
							</div>
							<el-button type="info" slot="reference" size="small">Post {{$lang[langId].stock_in_supplier}}</el-button>
						</el-popover>
					</div>
				</h4>
			</div>
			<el-table
				ref="multipleTable"
				:data="defaultVendor"
				:show-header="false"
				v-loading="isLoading"
				class="product-table-max-height mobile-fix-height-unset"
				max-height="340"
				stripe>
				<el-table-column
					prop="description">
					<template slot-scope="scope">
						<span>{{capitalize(scope.row.description)}}</span>
					</template>
				</el-table-column>
				<el-table-column
					prop="jurnal_account_no">
					<template slot-scope="scope">
            <div v-if="scope.row.isMap">
							<el-select v-show="fetchSupplier === 0"
								:placeholder="$lang[langId].select" 
								filterable
								v-model="tempParams.jurnal_vendor_id"
								style="width: 100%">
								<el-option
									v-for="item in dataVendor"
									:key="item.jurnal_contact_id"
									:label="item.display_name"
									:value="item.jurnal_contact_id">
								</el-option>
							</el-select>
							<el-select 
								v-show="fetchSupplier === 1" 
								:placeholder="$lang[langId].type_keyword" 
								filterable
								remote
								reserve-keyword
								v-model="tempParams.jurnal_vendor_id"
								:remote-method="searchFecthVendor"
								style="width: 100%">
								<el-option
									v-for="(item, keyFetch) in dataVendor"
									:key="keyFetch"
									:label="item.display_name"
									:value="item.jurnal_customer_id">
								</el-option>
							</el-select>
						</div>
						<span v-else>{{capitalize(scope.row.jurnal_vendor_name)}}</span>
					</template>
				</el-table-column>
        <el-table-column width="90" align="right">
          <template slot-scope="scope">
						<div v-if="scope.row.isLoading === false">
							<el-button v-if="scope.row.isMap === false" type="text" @click="mapVendor(scope.row)">
								<svg-icon type="edit"></svg-icon>
							</el-button>

							<el-button class="cancel-button" type="text" v-if="scope.row.isMap" @click="cancelVendor()" style="color: rgb(255, 0, 0);">
								<svg-icon type="cancel-edit"></svg-icon>
							</el-button>
							<el-button class="save-button" type="text" v-if="scope.row.isMap" @click="saveVendor()">
								<svg-icon type="check-circle"></svg-icon>
							</el-button>
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
          </template>
        </el-table-column>
			</el-table>
		</div>

  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import Loading from 'vue-loading-overlay';

export default {
  name: 'SetCashBank',
  components: {
    Loading
  },
  data() {
    return {
      isLoading: false,
			loadingVendor: false,
			loadingPostVendor: false,
      dataCashBank: [],
			dataVendor: [],
			defaultVendor: [],
			defaultCashBank: [],
			fetchSupplier: 0,
			tempParams: {account_id: '', jurnal_vendor_id: ''},
			supplierFiktif: ''
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

  methods: {
    defaultAccount(){
      this.isLoading = true
			this.loadingVendor = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

			this.defaultVendor = []
			this.defaultCashBank = []

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/stockin/accountvendordefault'),
        headers: headers
      }).then(response => {
				var cashBank = response.data.account_default
				var vendor = response.data.vendor_default
				cashBank.isMap = false
				vendor.isMap = false
				cashBank.isLoading = false
				vendor.isLoading = false
      	this.defaultVendor.push(vendor)
				this.defaultCashBank.push(cashBank)
				this.fetchSupplier = response.data.fetch_supplier
				if(this.fetchSupplier === 0){
					this.vendorAccount()
				}
				this.loadingVendor = false
        this.isLoading = false 
      }).catch(error => {
				this.loadingVendor = false
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

    loadCashBank(val){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/stockin/accountdefault'),
        headers: headers
      }).then(response => {
				this.dataCashBank = response.data.data
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

		vendorAccount(val){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/vendor'),
        headers: headers
      }).then(response => {
				this.dataVendor = response.data.data
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

    searchFecthVendor(value){
      if(value){
				let headers = {
					Authorization: 'Bearer ' + this.token.access_token
				}

        let params = {
          search_column: 'display_name',
          search_text: value
        }

				axios({
					method: 'GET',
					url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/fetchsupplier/list'),
					headers: headers,
					params: params
				}).then(response => {
					this.dataVendor = response.data.data
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
      }else{
        this.tempParams.jurnal_vendor_id = ''
        this.dataVendor = []
      }
    },

		mapCashBank(){
			this.defaultCashBank[0].isMap = true
			this.tempParams.account_id = this.defaultCashBank[0].jurnal_id
		},
		cancelCashBank(){
			this.defaultCashBank[0].isMap = false
			this.tempParams.account_id = ''
		},

		saveCashBank(){
			this.defaultCashBank[0].isLoading = true
			let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

			let paramsData = {account_id: this.tempParams.account_id}

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/stockin/accountdefault'),
        headers: headers,
				params: paramsData
      }).then(response => {
				let resp = response.data.data
				this.defaultCashBank[0].isLoading = false
				this.defaultCashBank[0].isMap = false
        this.defaultCashBank[0].jurnal_id = resp.account_id
				this.defaultCashBank[0].jurnal_account_name = resp.account_name
        this.defaultCashBank[0].jurnal_account_no = resp.account_no
      }).catch(error => {
				this.defaultCashBank[0].isLoading = false
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

		mapVendor(){
			this.defaultVendor[0].isMap = true
			this.tempParams.jurnal_vendor_id = this.defaultVendor[0].jurnal_vendor_id
		},
		cancelVendor(){
			this.defaultVendor[0].isMap = false
			this.tempParams.jurnal_vendor_id = ''
		},

		saveVendor(){
			this.defaultVendor[0].isLoading = true
			let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

			let paramsData = {jurnal_vendor_id: this.tempParams.jurnal_vendor_id}

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/stockin/vendordefault'),
        headers: headers,
				params: paramsData
      }).then(response => {
				let resp = response.data.data
				this.defaultVendor[0].isLoading = false
				this.defaultVendor[0].isMap = false
				this.defaultVendor[0].jurnal_vendor_name = resp.vendor_name
        this.defaultVendor[0].jurnal_vendor_id = resp.vendor_id
      }).catch(error => {
				this.defaultVendor[0].isLoading = false
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

		postSupplier(){
			this.loadingPostVendor = true
			this.defaultVendor[0].isLoading = true
			let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

			let paramsData = {vendor_id: 0, vendor_name: this.supplierFiktif ? this.supplierFiktif :this.$lang[this.langId].stock_in_supplier}

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/stockin/postvendordefault'),
        headers: headers,
				params: paramsData
      }).then(response => {
				let resp = response.data.data
				this.defaultVendor[0].isLoading = false
				this.defaultVendor[0].isMap = false
				this.defaultVendor[0].jurnal_vendor_name = resp.vendor_name
        this.defaultVendor[0].jurnal_vendor_id = resp.vendor_id
				this.supplierFiktif = ''
				this.loadingPostVendor = false
      }).catch(error => {
				this.loadingPostVendor = false
				this.defaultVendor[0].isLoading = false
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

    capitalize(value){
      let capitalize= '';
      if(value){
        capitalize = value[0].toUpperCase() + value.slice(1);
      }
      return capitalize;
    }
  },
  mounted() {
    this.loadCashBank()
		this.defaultAccount()
  }
}
</script>
