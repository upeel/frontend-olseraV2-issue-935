<template>
  <div>
    <div class="title-jurnal">
			<el-row style="width: 100%">
				<el-col :span="14">
					<h4><strong>{{lang.payment_methods}} ({{params.total}})</strong></h4>
				</el-col>
				<el-col :span="10" align="right">
					<div style="float: right;" v-if="editedPayment.length !== 0">
						<el-button type="info" size="mini" @click="cancelMap">{{lang.cancel}}</el-button>
						<el-button type="success" size="mini" @click="mapPayment" :disabled="loadingMap">
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
					<div v-else>

					<el-popover
            placement="left"
            width="600"
            trigger="click">
            <div>
              <el-row :gutter="20"  style="width: 100%">
                <el-col :span="18">
                  <strong>{{ lang.add }} {{ lang.account }}</strong>
                </el-col>
                <el-col :span="6" align="right">
                  <div class="btn_save_dialog">
										<el-button :disabled="loadingAddAccount" size="mini" type="success" @click="handleSaveAccount">{{ lang.save }}</el-button>
                  </div>
                </el-col>
              </el-row>
							<el-form @submit.native.prevent style="width: 100%">
								<el-row :gutter="20"  style="width: 100%" class="mt-10">
									<el-col :span="8">
										<div v-show="dataSubGroup.length > 1">
											<label style="font-size: 12px">{{ $lang[langId].sub_category }}</label>
										</div>
										<el-form-item v-show="dataSubGroup.length > 1">
											<el-select id="sub_category" v-model="tempAccount.sub_category" filterable style="width: 100%" :placeholder="$lang[langId].select + ' ' + lang.category" @change="handleChangeCategory($event)">
												<el-option
													v-for="item in dataSubGroup"
													:key="item.id"
													:label="capitalize(item.account_group)"
													:value="item.id">
												</el-option>
											</el-select>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<div>
											<label style="font-size: 12px">{{ lang.name }} {{ lang.account }}</label>
										</div>
										<el-form-item>
											<el-input id="account_name" v-model="tempAccount.account_name" type="text"></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<div>
											<label style="font-size: 12px">{{ $lang[langId].account_number }}</label>
										</div>
										<el-form-item>
											<el-input id="account_number" type="number" v-model="tempAccount.account_number"></el-input>
										</el-form-item>
									</el-col>
								</el-row>
							</el-form>
              <el-table :data="dataCashBank" max-height="250" stripe v-loading="loadingCashBank">
 									<el-table-column
                    prop="account_no"
                    :label="$lang[langId].account_number"
                    width="130">
                  </el-table-column>
                  <el-table-column
                    :label="$lang[langId].account_name"
                    prop="account_name">
                    <template slot-scope="scope">
                      <span>{{ capitalize(scope.row.account_name) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$lang[langId].action" align="center" width="100px">
                    <template slot-scope="scope" v-if="scope.row.edit_able === 'yes'">
											<el-button type="text" style="color: #000000"
											 @click="editAccount(scope.row)">
												<svg-icon icon-class="edit"></svg-icon>
											</el-button>
											<el-popconfirm
												:confirm-button-text='lang.delete'
												:cancel-button-text='$lang[langId].no'
                				@confirm="deleteAccount(scope.row)"
												icon="el-icon-info"
												icon-color="red"
												:title="$lang[langId].are_you_want_remove + ' ' + capitalize(scope.row.account_name) + ' ?'"
											>
												<el-button slot="reference" type="text" style="color: #FF0000;">
													<svg-icon icon-class="trash" stroke="#FF0000"></svg-icon>
												</el-button>
											</el-popconfirm>
                    </template>
                  </el-table-column>
              </el-table>
            </div>
						<el-button slot="reference" type="primary" size="mini" @click="setAccount">
							<span>
								{{$lang[langId].set_account}}
							</span>
						</el-button>
          </el-popover>


						<div class="divClearMap ml-10" :class="clearMap">
							<i class="el-icon-check"></i>
						</div>
					</div>
				</el-col>
			</el-row>
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
          prop="jurnal_account_name"
          :label="$lang[langId].account_jurnal">
          <template slot-scope="scope">
            <el-select filterable 
              :placeholder="$lang[langId].select" 
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
          value: 'jurnal_account_name',
          label: this.$lang[this.$store.state.userStores.langId].account_jurnal
        }
      ],
      dataPayment: [],
      dataAccount: [],
      editedPayment: [],
			dataCashBank: [],
			dataSubGroup: [],
			dialogSetAccount: false,
      clearMap: false,
      tempAccount: {
				edited: false,
				id: '',
        category: '11',
        sub_category: '',
        account_name: '',
        account_number: ''
      },
			loadingAddAccount: false,
			loadingCashBank: false,
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
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/paymentmap'),
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
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/account/cashbank'),
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
      // let selected = {}
      // this.dataAccount.forEach((item, index) => {
      //   if (item.name === val){
      //     selected = item
      //   }
      // })

      this.dataPayment.map((item, idx) => {
        if(item.id === row.id){
          item.jurnal_account_name = val
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
        jurnal_account_name: val,
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
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/paymentmap'),
        headers: headers,
        data: this.editedPayment
      }).then(response => {
        this.loadingMap = false
        this.editedPayment = []
        if (response.data.status === 200) {
          this.$message({
            message: 'Success',
            type: 'success'
          })
        }
        this.$emit('changePostStatus', response.data.buttonPostStatus_generalJurnal)
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

		setAccount(){
			this.getSubGroupName()
			this.getCashBank()
			// this.dialogSetAccount = true
		},

		editAccount(row){
			this.tempAccount = {
				edited: true,
				id: row.id,
        category: '11',
        sub_category: row.account_group_id,
        account_name: row.account_name,
        account_number: row.account_no
      }
		},

		getCashBank(){
		 this.loadingCashBank = true
		 let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method : 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/name/cashbankonly'),
        headers: headers
      }).then(response => {
        this.dataCashBank = response.data.data

				this.loadingCashBank = false
      }).catch(error => {
				this.loadingCashBank = false
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

    getSubGroupName () {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method : 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/groupmain/11'),
        headers: headers
      }).then(response => {
        this.dataSubGroup = response.data.data
        this.tempAccount.sub_category = ''
        this.tempAccount.account_number = ''

        if(this.dataSubGroup.length > 1){
          document.getElementById('sub_category').focus();
        }else{
          this.tempAccount.sub_category = this.dataSubGroup[0].id
          this.handleChangeCategory(this.dataSubGroup[0].id)
        }
        document.getElementById('sub_category').value = '';
        document.getElementById('account_number').value = '';
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

    handleChangeCategory (event) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/group/'+ event),
        headers: headers
      })
      .then(response => {
        let res = response.data.data;
        this.tempAccount.account_number = res.account_suggestion
				this.tempAccount.account_name = ''
        document.getElementById('account_number').value = res.account_suggestion;
        document.getElementById('account_name').focus(); 
      })
      .catch(error => {
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

		deleteAccount(row){
			let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/name/' + row.id),
        headers: headers,
      }).then(response => {
				this.getCashBank()
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

    handleSaveAccount () {
      this.loadingAddAccount = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let data = {
        account_name: this.tempAccount.account_name,
        account_no: this.tempAccount.account_number,
        account_group_id: this.tempAccount.sub_category,
        depreciation_of_account: ''
      }

			let url = 'account/name'

			if(this.tempAccount.edited) url = 'account/name/' + this.tempAccount.id

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, url),
        headers: headers,
        data
      }).then(response => {
        this.loadingAddAccount = false
        this.dialogSetAccount = false
				this.tempAccount = {
					edited: false,
					id: '',
					category: '11',
					sub_category: '',
					account_name: '',
					account_number: ''
				}
        this.$message({
            message: 'Success',
            type: 'success'
          })
        this.getCashBank()
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
        this.loadingAddAccount = false
      })
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
