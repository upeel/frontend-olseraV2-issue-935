<template>
  <div>
    <div class="title-jurnal">
      <h4>
        <strong>{{$lang[langId].mapping_customer}} ({{allCustomer.length}})</strong>
        <div style="float: right;">
          <el-button size="small" :loading="loadingPost" :disabled="loadingPost || chosenCustomer.length === 0" :type="chosenCustomer.length !== 0 ? 'success' : 'info'" @click="postHandle">
            <span>Post {{lang.customer}}</span>
          </el-button>
          <el-button type="primary" size="small" @click="handleListCustomer">
            {{ $lang[langId].customer_list }}
          </el-button>
        </div>
      </h4>
    </div>
    <div v-if="isLoading === false">
      <el-table
        ref="multipleTable"
        :data="allCustomer"
        @selection-change="handleSelectPost"
        class="product-table-max-height mobile-fix-height-unset"
        max-height="340"
        stripe>
        <el-table-column type="selection" width="30" class-name="text-center">
        </el-table-column>
        
        <el-table-column
          prop="customer_name"
          :label="lang.customer_name">
          <template slot-scope="scope">
            <span>{{capitalize(scope.row.customer_name)}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="customer_id">
          <template slot-scope="scope">
            <el-select 
              v-if="scope.row.isActive" 
              :placeholder="$lang[langId].select" 
              filterable
              remote
              reserve-keyword
              v-model="formEdit.id"
              @change="(value) => selectCustomer(value)"
              :remote-method="loadCustomerAccurate"
              style="width: 100%">
              <el-option
                v-for="(item, keyCustomer) in dataCustomerAccurate"
                :key="keyCustomer"
                :label="item.customerNo +' '+ item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column :label="$lang[langId].action" width="180" align="right">
          <template slot-scope="scope">
            <el-button v-if="scope.row.isActive === false" type="text" @click="mapHandle(scope.$index, scope.row)">
              <svg-icon type="edit"></svg-icon>
              Map {{lang.customer}}
            </el-button>

            <el-button class="cancel-button" type="text" v-if="scope.row.isActive" @click="cancelHandle(scope.$index)" style="color: rgb(255, 0, 0);">
              <svg-icon type="cancel-edit"></svg-icon>
              {{ lang.cancel }}
            </el-button>
            <el-button class="save-button" type="text" v-if="scope.row.isActive" @click="saveHandle(scope.$index)">
              <svg-icon type="check-circle"></svg-icon>
              {{ lang.save }}
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
  </div>
</template>

<script>
import { baseApi } from 'src/http-common';
import axios from 'axios';
import Loading from 'vue-loading-overlay';

export default {
  name: 'MapCustomer',
  components: {
    Loading
  },

  props: {
    allCustomer:{
      type: Array,
      default: null
    },
    isFecth: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      formEdit: {
        customer_id: '',
        customerNo: '',
        id: '',
        name: ''
      },
      isLoading: false,
      dataCustomerAccurate: [],
      chosenCustomer: [],
      loadingPost: false,
      clearMap: "",
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
    }
  },
  methods: {
    loadCustomerAccurate(val){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let paramsData = val ? {search: val} : {search: ''}

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/customer'),
        headers: headers,
        params: paramsData
      }).then(response => {
        this.dataCustomerAccurate = response.data.data
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

    postHandle(){
			this.loadingPost = true
			if(this.allCustomer.length === this.chosenCustomer.length){
				this.bulkPost()
			}else{
				this.commonPost()
			}
    },

		bulkPost(){
      let headers = {Authorization: 'Bearer ' + this.token.access_token}
			let data = {customer_id: []}

			this.chosenCustomer.forEach(function(v){
				if(v.customer_id){
					data.customer_id.push(v.customer_id)
				}else{
					data.customer_id.push(0)
				}
			});

			axios({
				method: 'POST',
				url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/bulkcustomer'),
				headers: headers,
				data
			}).then(response => {
				let res = response.data.data
				res.forEach(r => {
					let idx = this.allCustomer.findIndex(x => x.customer_id === parseInt(r.customer_id));
					this.allCustomer.splice(idx, 1)
				})

				this.$message({
					type: 'success',
					message: this.$lang[this.langId].success_posting
				})
				this.loadCustomerAccurate()
				this.loadingPost = false
				this.chosenCustomer = []
			}).catch(error => {
				this.chosenCustomer = []
				this.loadingPost = false
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

		commonPost(){
      let headers = {Authorization: 'Bearer ' + this.token.access_token}
      var itemsProcessed = 0;
			this.chosenCustomer.forEach(item => {
				let data = {
					customer_id : item.customer_id
				}

				axios({
					method: 'POST',
					url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/customer'),
					headers: headers,
					params: data
				}).then(response => {

					this.allCustomer.map((i, idx) => {
						if (i.customer_id === item.customer_id) {
							this.allCustomer.splice(idx, 1)
						}
					})

					itemsProcessed++;
					if(itemsProcessed === this.chosenCustomer.length) {
						this.loadCustomerAccurate()
						this.$message({
							type: 'success',
							message: this.$lang[this.langId].success_posting
						})
						this.loadingPost = false
						this.chosenCustomer = []
					}

				}).catch(error => {
					itemsProcessed++;
          this.loadingPost = false
					if(itemsProcessed === this.chosenCustomer.length) {
						this.chosenCustomer = []
					}
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
			});
		},

    handleSelectPost(val){
      if (val.length > 0) {
        this.chosenCustomer = val
      }else{
        this.chosenCustomer = []
      }
    },

    selectCustomer(value){
      this.dataCustomerAccurate.map((item, idx) => {
        if(item.id === value){
          this.formEdit.id = item.id
          this.formEdit.name = item.name
          this.formEdit.customerNo = item.customerNo
        }
      });
    },

    mapHandle(index, row) {
      let idxActive = this.allCustomer.findIndex( x => x.isActive === true );
      if(idxActive !== -1){
        this.allCustomer[idxActive].isActive = false
      }

      this.formEdit.customer_id = row.customer_id
      this.allCustomer[index].isActive = true
    },
    
    cancelHandle(index) {
      this.formEdit.customer_id = ''
      this.formEdit.customerNo = ''
      this.allCustomer[index].isActive = false
    },

    saveHandle(index) {
      this.isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/customermap'),
        headers: headers,
        data: this.formEdit
      })
        .then(response => {
          this.result = response.data
          if (response.data.status === 200) {
            this.$message({
              message: 'Success',
              type: 'success'
            })
            this.formEdit = {
              customer_id: '',
              customerNo: '',
              id: '',
              name: ''
            }
          }
          this.isLoading = false
          this.allCustomer.splice(index, 1)

        })
        .catch(error => {
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
          this.allCustomer[index].isActive = true
        })
    },

    capitalize(value){
      let capitalize= '';
      if(value){
        capitalize = value[0].toUpperCase() + value.slice(1);
      }
      return capitalize;
    },
    
    handleListCustomer() {
      this.$emit('customerList')
    }
  },
  mounted() {
    // if(this.isFecth.fetchCustomer === 0){
      this.loadCustomerAccurate()
    // }
  }
}
</script>
