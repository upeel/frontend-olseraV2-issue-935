<template>
  <div>
    <el-dialog
      :visible.sync="show"
      :show-close="false"
      @close="handleClose"
      width="60%"
      center 
      custom-class="dialog-card">
        <div slot="title" class="flex-container">
          <el-row :gutter="20"  style="width: 100%">
            <el-col :span="14">
              <h4 class="dialog-title" align="left"><strong>{{$lang[langId].set_jurnal_sales}}</strong></h4>
            </el-col>
            <el-col :span="10" align="right">
              <div class="btn_save_dialog">
                <el-button type="info" @click="handleClose">{{ lang.close }}</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
        <el-tag size="large" class="tag-jurnal-info2">
          <el-row :gutter="10">
            <el-col :md="1" :sm="1" :xs="24" align="center">
              <i class="el-icon-warning-outline"></i>
            </el-col>
            <el-col :md="23" :sm="23" :xs="24">
              <p>{{$lang[langId].customer_accurate_info}}</p>
            </el-col>
          </el-row>
        </el-tag>

        <el-tabs v-model="activeTab" stretch>
          <el-tab-pane :label="lang.product" name="productMap">
            <product-map :allProduct="dataProduct" :isFecth="fecthStatus" @toAllProduct="getAllProduct"/>
          </el-tab-pane>
          <el-tab-pane :label="lang.customer" name="customerMap">
            <customer-map :allCustomer="dataCustomer" :isFecth="fecthStatus" @customerList="hanldeGetCustomerList"/>
          </el-tab-pane>
        </el-tabs>
        
    </el-dialog>
    
    <el-dialog 
      :visible.sync="showAllProduct"
      :show-close="false"
      @close="closeAllProduct"
      width="95%"
      center 
      custom-class="dialog-card">
        <div slot="title" class="flex-container">
          <el-row :gutter="20"  style="width: 100%">
            <el-col :span="14">
              <h4 class="dialog-title" align="left">
                <strong>{{ $lang[langId].product_list }}
                  <span v-show="allProduct === false">({{$lang[langId].unposted}})</span>
                </strong>
              </h4>
            </el-col>
            <el-col :span="10" align="right">
              <div class="btn_save_dialog">
								<el-popover
									placement="left"
									width="350"
									trigger="click">
									<div>
										<el-row :gutter="20" style="line-height: 2;">
											<el-col :span="24">
												<div class="biodata mb-8">
													<el-button :disabled="loadingAllPost" type="primary" @click="handleAllPost" size="small">
														<span v-if="loadingAllPost">
															<loading
																:active="true"
																color= '#1bb4e6'
																loader="spinner"
																:width="28"
																:height="10"
																backgroundColor='#ffffff'>
															</loading>
															<span>{{allProductPending}}</span>
														</span>
														<span v-else>{{$lang[langId].post_all_product_to}} Jurnal.id</span>
													</el-button><br>
													<p class="font-12" v-html="$lang[langId].jurnal_all_post_product_text"></p>
												</div>
												<el-divider></el-divider>
												<div class="biodata mb-8">
												<el-button :disabled="loadingFetchProduct" @click="fetchAccurateProduct" size="small">
														<span v-if="loadingFetchProduct">
															<loading
																:active="true"
																color= '#1bb4e6'
																loader="spinner"
																:width="28"
																:height="10"
																backgroundColor='#ffffff'>
															</loading>
															<span v-if="totalFetch !== 0">{{$lang[langId].page + ' ' + currentFetch + ' '+$lang[langId].of + ' ' + totalFetch}}</span>
														</span>
														<span v-else>{{$lang[langId].sync_product}}</span>
													</el-button><br>
													<p class="font-12" v-html="$lang[langId].accurate_fetch_product_info"></p>
												</div>
												<el-divider></el-divider>
												<div class="biodata mb-8">
													<el-button type="primary" slot="reference" size="small" @click="(value)=>confirmProduct(value, {page: 1})" :disabled="loadingConfirm">
														<span v-if="loadingConfirm">
															<loading
																:active="true"
																color= '#1bb4e6'
																loader="spinner"
																:width="28"
																:height="10"
																backgroundColor='#ffffff'>
															</loading>
															<span>{{textConfirm}}</span>
														</span>
														<span v-else>{{textConfirm}}</span>
													</el-button><br>
													<p class="font-12" v-html="$lang[langId].accurate_confirm_product_text"></p>
												</div>
											</el-col>
										</el-row>
									</div>
									<el-button slot="reference" plain type="primary">{{ $lang[langId].action }}</el-button>
								</el-popover>
                <el-button type="info" @click="closeAllProduct">{{ lang.close }}</el-button>
              </div>
            </el-col>
          </el-row>
        </div>

        <el-tabs v-model="activeProduct" stretch>
          <el-tab-pane :label="lang.product" name="productMapped">
            <product-mapped/>
          </el-tab-pane>
          <el-tab-pane :label="$lang[langId].product_combo" name="productCombo">
            <product-combo/>
          </el-tab-pane>
        </el-tabs>

    </el-dialog>

    <el-dialog 
      :visible.sync="showAllCustomer"
      :show-close="false"
      @close="handleCloseCustomerList"
      width="95%"
      center
      custom-class="dialog-card">
      <div slot="title" class="flex-container">
        <el-row :gutter="20"  style="width: 100%">
          <el-col :span="14">
            <h4 class="dialog-title" align="left">
              <strong>{{ $lang[langId].customer_list }}
                <span v-show="allProduct === false">({{$lang[langId].unposted}})</span>
              </strong>
            </h4>
          </el-col>
          <el-col :span="10" align="right">
            <div class="btn_save_dialog">
							<el-popover
								placement="left"
								width="350"
								trigger="click">
								<div>
									<el-row :gutter="20" style="line-height: 2;">
										<el-col :span="24">
											<div class="biodata mb-8">
												<el-button :disabled="loadingAllPost" type="primary" @click="allPostCustomer" size="small">
													<span v-if="loadingAllPost">
														<loading
															:active="true"
															color= '#1bb4e6'
															loader="spinner"
															:width="28"
															:height="10"
															backgroundColor='#ffffff'>
														</loading>
														<span>{{allCustomerPending}}</span>
													</span>
													<span v-else>{{$lang[langId].post_all_customer_to}} Accurate</span>
												</el-button><br>
												<p class="font-12" v-html="$lang[langId].accurate_all_post_customer_text"></p>
											</div>
											<el-divider></el-divider>
											<div class="biodata mb-8">
												<el-button :disabled="loadingFetch" @click="fetchAccurateCustomer" size="small">
													<span v-if="loadingFetch">
														<loading
															:active="true"
															color= '#1bb4e6'
															loader="spinner"
															:width="28"
															:height="10"
															backgroundColor='#ffffff'>
														</loading>
														<span v-if="totalFetch !== 0">{{$lang[langId].page + ' ' + currentFetch + ' '+$lang[langId].of + ' ' + totalFetch}}</span>
													</span>
													<span v-else>{{$lang[langId].sync_customer}}</span>
												</el-button><br>
												<p class="font-12" v-html="$lang[langId].accurate_fetch_customer_info"></p>
											</div>
										</el-col>
									</el-row>
								</div>
								<el-button slot="reference" plain type="primary">{{ $lang[langId].action }}</el-button>
							</el-popover>
              <el-button type="info" @click="handleCloseCustomerList">{{ lang.close }}</el-button>
            </div>
          </el-col>
        </el-row>
      </div>

      <customer-mapped />

      <!-- <el-tabs v-model="activeCustomer" stretch>
        <el-tab-pane :label="$lang[langId].customer_list" name="customerMapped">
          
        </el-tab-pane>
        <el-tab-pane :label="$lang[langId].supplier_list" name="supplierMapped">
          <supplier-mapped />
        </el-tab-pane>
      </el-tabs> -->
    </el-dialog>
  </div>
</template>

<script>
import ProductMap from './mapping/mapProduct.vue';
import CustomerMap from './mapping/mapCustomer.vue';
import ProductMapped from './mapping/productMapped.vue';
import ProductCombo from './mapping/productCombo.vue';
import CustomerMapped from './mapping/customerMapped.vue';
import { fetchCustomer } from '@/api/accounting-3rd/accurate';
import { fetchproduct } from '@/api/accounting-3rd/accurate'
import Loading from 'vue-loading-overlay';
import { baseApi } from 'src/http-common';
import axios from 'axios';
import basicComputedMixin from '@/mixins/basicComputedMixin'

export default {
  props: ['show', 'dataProduct', 'dataCustomer', 'fecthStatus'],
  name: "DialogJurnalMapCustomerProduct",

  components: {
    ProductMap,
    CustomerMap,
    ProductMapped,
    ProductCombo,
    CustomerMapped,
    Loading
  },

  mixins: [basicComputedMixin],
  
  computed: {
    
    langId() {
      return this.$store.state.userStores.langId
    },
    token() {
      return this.$store.state.user.token
    },
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    lang() {
      return this.$store.state.userStores.lang
    }
  },

  data() {
    return {
      showAllProduct: false,
      showAllCustomer: false,
			allProductPending: '',
			allCustomerPending: '',
			loadingAllPost: false,
			loadingConfirm: false,
      textConfirm: this.$lang[this.$store.state.userStores.langId].confirm +' '+ this.$store.state.userStores.lang.product,
      activeTab: 'productMap',
      allProduct: true,
      activeProduct: 'productMapped',
      activeCustomer: 'customerMapped',
      loadingFetchProduct: false,
      paramsProduct: {
        start_date: '',
        end_date: '',
        page: 1
      },
      loadingFetch: false,
      currentFetch: 0,
      totalFetch: 0,
      paramsCustomer: {
        page: 1
      }
    }
  },

  methods:{
    handleClose(){
      // this.show = false;
      this.$emit('close')
    },

    getAllProduct(){
      this.activeProduct = 'productMapped'
      this.allProduct = true
      this.showAllProduct = true
    },

    closeAllProduct(){
      this.show = true
      this.allProduct = false
      this.showAllProduct = false
    },
    hanldeGetCustomerList() {
      this.activeCustomer = 'customerMapped'
      this.allProduct = true
      this.showAllCustomer = true
    },
    handleCloseCustomerList() {
      this.activeCustomer = 'customerMapped'
      this.allProduct = false
      this.showAllCustomer = false
    },

    fetchAccurateProduct(){
      this.loadingFetchProduct = true
      fetchproduct(this.paramsProduct).then(response => {
        let message = 'Success ' + this.paramsProduct.page + ' ' + this.rootLang.of + ' ' + response.data.data.total_pages
        if (this.paramsProduct.page < response.data.data.total_pages) {
          this.currentFetch = response.data.data.currenct_page + 1
          this.totalFetch = response.data.data.total_pages
          this.paramsProduct.page = response.data.data.currenct_page + 1
          this.$message({
            type: 'success',
            message: message
          })
          this.fetchAccurateProduct()
        } else {
          this.currentFetch = 0
          this.totalFetch = 0
          this.$message({
            type: 'success',
            message: message
          })
          this.loadingFetchProduct = false
        }
      }).catch(error => {
        this.loadingFetchProduct = false
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

    fetchAccurateCustomer(){
      this.loadingFetch = true

      fetchCustomer(this.paramsCustomer).then(response => {
        let message = 'Success ' + this.paramsCustomer.page + ' ' + this.$lang[this.langId].of + ' ' + response.data.data.total_pages
        if (this.paramsCustomer.page < response.data.data.total_pages) {
          this.currentFetch = response.data.data.currenct_page + 1
          this.totalFetch = response.data.data.total_pages
          this.paramsCustomer.page = response.data.data.currenct_page + 1
          this.$message({
            type: 'success',
            message: message
          })
          this.fetchAccurateCustomer()
        } else {
          this.currentFetch = 0
          this.totalFetch = 0
          this.$message({
            type: 'success',
            message: message
          })
          this.loadingFetch = false
        }
      }).catch(error => {
        this.loadingFetch = false
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

		handleAllPost(){
			let headers = {
				Authorization: 'Bearer ' + this.token.access_token,
			}

			this.loadingAllPost = true

			axios({
				method: 'POST',
				url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/product/post'),
				headers: headers,
			}).then(response => {
				let resp = response.data

				if (resp.finish === 0) {
					this.handleAllPost()
					this.allProductPending = resp.module + ' - ' + this.rootLang.waiting + ' ' + resp.pending + ' ' + this.lang.item
				}else{
					this.loadingAllPost = false
					this.allProductPending = ''
				}
			}).catch(error => {
				this.loadingAllPost = false
				this.allProductPending = ''
				this.$notify({
					type: 'warning',
					title: error.response.data.error.message,
					message: error.response.data.error.error
				})
			})
		},

		allPostCustomer(){
			let headers = {
				Authorization: 'Bearer ' + this.token.access_token,
			}

			this.loadingAllPost = true

			axios({
				method: 'POST',
				url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/customer/post'),
				headers: headers,
			}).then(response => {
				let resp = response.data
				if (resp.finished === 0) {
					this.allPostCustomer()
					this.allCustomerPending = resp.module + ' - ' + this.rootLang.waiting + ' ' + resp.pending + ' ' + this.lang.item
				}else{
					this.loadingAllPost = false
					this.allCustomerPending = ''
				}
			}).catch(error => {
				this.loadingAllPost = false
				this.allCustomerPending = ''
				this.$notify({
					type: 'warning',
					title: error.response.data.error.message,
					message: error.response.data.error.error
				})
			})
		},

    confirmProduct(value, confirm){
      this.loadingConfirm = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
			let params = confirm.hasOwnProperty('variant_re_confirm') ? confirm : {page: 1}
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/productconfirm'),
        headers: headers,
				params: params
      }).then(response => {
        let res = response.data.data
				let paramConfirm = {
					page: params.page + 1,
					variant_re_confirm: res.variant_re_confirm,
					product_re_confirm: res.product_re_confirm,
					combo_re_confirm: res.combo_re_confirm
				}
				
        if(response.data.finish !== 1){
          this.confirmProduct(null,paramConfirm)
          this.textConfirm = params.page +' '+ this.lang.from + ' ' + response.data.totalPages
					params.page++
        }else{
          this.loadingConfirm = false
          this.textConfirm = this.rootLang.confirm +' '+ this.lang.product
        }
      }).catch(error => {
        this.loadingConfirm = false
        this.textConfirm = this.rootLang.confirm +' '+ this.lang.product
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
  }
}
</script>
