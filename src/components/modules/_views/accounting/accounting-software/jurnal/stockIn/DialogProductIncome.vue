<template>
  <div>
    <el-dialog
      :visible.sync="show"
      :show-close="false"
			width="60%"
      center 
			@close="handleClose"
      custom-class="dialog-no-header">
        <!-- <div slot="title" class="flex-container">
          <el-row :gutter="20"  style="width: 100%">
            <el-col :span="14">
              <h4 class="dialog-title" align="left"><strong>{{$lang[langId].set_jurnal_purchase}}</strong></h4>
            </el-col>
            <el-col :span="10" align="right">
              <div class="btn_save_dialog">
                <el-button type="info" @click="handleClose">{{ lang.close }}</el-button>
              </div>
            </el-col>
          </el-row>
        </div> -->
				<product-map :allProduct="dataProduct" @toAllProduct="getAllProduct" :isFecth="fecthStatus" menu="stockIn" @close="handleClose"/>

    </el-dialog>

    <el-dialog 
      :visible.sync="showAllProduct"
      :show-close="false"
      @close="closeAllProduct"
      width="80%"
      center 
      custom-class="dialog-card-jurnal">
        <transition  name="slide-right">
          <div v-show="showSetProduct" @keydown.esc="cardSetProduct" class="dialog-copy-from-other-store">
            <div class="header-dialog h-56">
              <span class="color-1">{{$lang[langId].product_setting}}</span>
              <el-button
                type="info"
                round
                class="button-close-dialog color-1"
                @click="cardSetProduct">
                <svg-icon icon-class="x" />
              </el-button>
            </div>

            <div class="sub-title mb-8">
              <label class="font-12 font-normal">
                {{$lang[langId].product_specific_terms}}
              </label>
              <el-tooltip class="item fl-right" effect="dark" placement="bottom"
                :content="$lang[langId].jurnal_text_product_addition">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </div>
            <div class="demo-basic--circle">
              <el-form @submit.native.prevent>
                <el-form-item>
                  <el-input
                  v-model="formSetting.text_setting" 
                  placeholder="ketikan karakter"
                  style="font-weight: bolder; color: black; margin-bottom: 8px;">
                    
                  </el-input>
                  <el-checkbox v-model="formSetting.end_space">
                    <span class="font-12">{{$lang[langId].end_word_space}}</span>
                  </el-checkbox>
                  <label class="bg-primary fl-right">{{formSetting.text_setting}} {{formSetting.end_space ? '&nbsp' : ''}}</label>
                </el-form-item>
								<el-form-item>
									<el-button type="danger" v-show="formSetting.idText" size="small"
										@click="deleteSet" :disabled="loadingDelete">
											{{$lang[langId].remove_terms}}
									</el-button>
								</el-form-item>
              </el-form>
            </div>

            <div class="footer-dialog">
              <el-button type="primary" :disabled="loadingSet" :loading="loadingSet" @click="saveSettingProduct">
                {{ $lang[langId].apply }}
              </el-button>
            </div>
          </div>
        </transition>
        <div slot="title" class="flex-container">
          <el-row :gutter="20"  style="width: 100%">
            <el-col :span="14">
              <h4 class="dialog-title mb-0" align="left">
                <strong>{{ $lang[langId].product_list }}</strong>
              </h4>
            </el-col>
            <el-col :span="10" align="right">
              <div class="btn_save_dialog">
								<el-popover
									placement="left"
									width="300"
									trigger="click">
									<div>
										<el-row :gutter="20" style="line-height: 2;">
											<el-col :span="24">
												<div class="biodata mb-8">
													<el-button :disabled="loadingSync" type="info" @click="SyncUnpostProduct" size="small">
														<span v-if="loadingSync">
															<loading
																:active="true"
																color= '#1bb4e6'
																loader="spinner"
																:width="28"
																:height="10"
																backgroundColor='#ffffff'>
															</loading>
															<span v-if="totalSync !== 0">{{$lang[langId].page + ' ' + currentSync + ' '+$lang[langId].of + ' ' + totalSync}}</span>
														</span>
														<span v-else>{{$lang[langId].sync_product}} Jurnal.id</span>
													</el-button>
													<el-button @click="cardSetProduct" type="info" size="small" style="padding: 6px; font-size: large; float:right;">
														<svg-icon icon-class="setting_ico"></svg-icon>
													</el-button><br>
													<p class="font-12" v-html="$lang[langId].jurnal_sync_product_text"></p>
												</div>
												<el-divider></el-divider>
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
															<span>{{alProductPending}}</span>
														</span>
														<span v-else>{{$lang[langId].post_all_product_to}} Jurnal.id</span>
													</el-button><br>
													<p class="font-12" v-html="$lang[langId].jurnal_all_post_product_text"></p>
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
													<p class="font-12" v-html="$lang[langId].jurnal_confirm_product_text"></p>
												</div>
											</el-col>
										</el-row>
									</div>
									<el-button slot="reference" plain type="primary">{{ $lang[langId].action }}</el-button>
								</el-popover>
                <el-button type="info" size="small" @click="closeAllProduct">{{ lang.close }}</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
        <el-tabs v-model="activeProduct" stretch>
          <el-tab-pane :label="$lang[langId].product_mapped" name="productMapped">
            <product-mapped  v-if="activeProduct === 'productMapped'" :isFecth="fecthStatus.isFecth"/>
          </el-tab-pane>
          <el-tab-pane :label="$lang[langId].product_combo" name="productCombo">
            <product-combo  v-if="activeProduct === 'productCombo'" :isFecth="fecthStatus.isFecth"/>
          </el-tab-pane>
        </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import ProductMap from 'components/modules/_views/accounting/accounting-software/jurnal/mapping/mapProduct.vue';
import ProductMapped from 'components/modules/_views/accounting/accounting-software/jurnal/mapping/productMapped.vue';
import ProductCombo from 'components/modules/_views/accounting/accounting-software/jurnal/mapping/productCombo.vue';

export default {
	name:"dialogProductIncome",
  components: {
    ProductMap,
    ProductMapped,
    ProductCombo
	},

  props: ['show', 'dataProduct', 'fecthStatus'],

  data() {
    return {
      loadingSync: false,
      loadingSet: false,
			loadingDelete: false,
			alProductPending: '',
      paramsProduct: {start_date: '', end_date: '', page: 1},
      currentSync: 0,
      totalSync: 0,
      formSetting: {idText: '', text_setting: '', end_space: false},
			loadingAllPost: false,
      loadingConfirm:false,
      textConfirm: this.$lang[this.$store.state.userStores.langId].confirm +' '+ this.$store.state.userStores.lang.product,
      showAllProduct: false,
			activeProduct: 'productMapped',
      showSetProduct: false
		}
  },

  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    store() {
      return this.$store.state 
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    token() {
      return this.$store.state.user.token
    }
  },

  watch: {},

  methods: {

    getAllProduct(){
      this.activeProduct = 'productMapped'
      this.showAllProduct = true
    },

    closeAllProduct(){
      this.show = true
      this.showAllProduct = false
    },

    confirmProduct(value, confirm){
      this.loadingConfirm = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
			let params = confirm.hasOwnProperty('variant_re_confirm') ? confirm : {page: 1}
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/productconfirm'),
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
				
        if(params.page < res.total_pages){
					params.page++,
          this.confirmProduct(null,paramConfirm)
          this.textConfirm = res.currenct_page +' '+ this.lang.from + ' ' + res.total_pages
        }else{
          this.loadingConfirm = false
          this.textConfirm = this.$lang[langId].confirm +' '+ this.lang.product
        }
      }).catch(error => {
        this.loadingConfirm = false
        this.textConfirm = this.$lang[langId].confirm +' '+ this.lang.product
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

    SyncUnpostProduct(){
      this.loadingSync = true
      syncProduct(this.paramsProduct).then(response => {
        let message = 'Success ' + this.paramsProduct.page + ' ' + this.$lang[langId].of + ' ' + response.data.data.total_pages
        if (this.paramsProduct.page < response.data.data.total_pages) {
          this.currentSync = response.data.data.currenct_page + 1
          this.totalSync = response.data.data.total_pages
          this.paramsProduct.page = response.data.data.currenct_page + 1
          this.$message({
            type: 'success',
            message: message
          })
          this.SyncUnpostProduct()
        } else {
          this.$message({
            type: 'success',
            message: message
          })
          this.loadingSync = false
        }
      }).catch(error => {
        this.loadingSync = false
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

    cardSetProduct(){
      this.loadingSet = true
      let show = this.showSetProduct
      if(!show){
				this.setProductTxt()
      }
      this.showSetProduct = show ? false : true
      this.loadingSet = false
    },

		setProductTxt(){
			let headers = {
				Authorization: 'Bearer ' + this.token.access_token,
			}

			axios({
				method: 'GET',
				url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/producttxt'),
				headers: headers,
			}).then(response => {
				let resp = response.data.data

				const a = resp.text.slice(-1);
				if (a == " ") {
					this.formSetting.end_space = true
					this.formSetting.text_setting = resp.text.slice(0, -1);
				}else{
					this.formSetting.text_setting = resp.text
				}
				this.formSetting.idText = resp.id
				this.loadingSet = false
			}).catch(error => {
				this.$notify({
					type: 'warning',
					title: error.response.data.error.message,
					message: error.response.data.error.error
				})
			})
		},

    saveSettingProduct(){
      this.loadingSet = true
			let headers = {
				Authorization: 'Bearer ' + this.token.access_token,
			}

			let params = {
				text: this.formSetting.text_setting
			}

			if(this.formSetting.end_space){
				params.text = this.formSetting.text_setting+'&nbsp'
			}

			axios({
				method: 'POST',
				url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/producttxt'),
				headers: headers,
				params: params
			}).then(response => {
				let resp = response.data.data
				this.$message({
					type: 'success',
					message: this.$lang[this.langId].success_update
				})
				this.loadingSet = false
			}).catch(error => {
				this.loadingSet = false
				this.$notify({
					type: 'warning',
					title: error.response.data.error.message,
					message: error.response.data.error.error
				})
			})
    },

		deleteSet(){
			this.loadingDelete = true
			let headers = {Authorization: 'Bearer ' + this.token.access_token}
			let id = this.formSetting.idText
			axios({
				method: 'DELETE',
				url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/producttxt/'+id),
				headers: headers
			}).then(response => {
				let resp = response.data.data
				this.formSetting = {idText: '', text_setting: '', end_space: false}
				this.$message({
					type: 'success',
					message: this.$lang[this.langId].success_delete
				})
				this.loadingDelete = false
			}).catch(error => {
				this.loadingDelete = false
				this.$notify({
					type: 'warning',
					title: error.response.data.error.message,
					message: error.response.data.error.error
				})
			})
		},


		handleAllPost(){
			let headers = {
				Authorization: 'Bearer ' + this.token.access_token,
			}

			this.loadingAllPost = true

			axios({
				method: 'POST',
				url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/productpost'),
				headers: headers,
			}).then(response => {
				let resp = response.data

				if (resp.finish === 0) {
					this.handleAllPost()
					this.alProductPending = resp.module + ' - ' + this.$lang[langId].waiting + ' ' + resp.pending + ' ' + this.lang.item
				}else{
					this.loadingAllPost = false
					this.alProductPending = ''
				}
			}).catch(error => {
				this.loadingAllPost = false
				this.alProductPending = ''
				this.$notify({
					type: 'warning',
					title: error.response.data.error.message,
					message: error.response.data.error.error
				})
			})
		},

    handleClose(){
      this.$emit('close')
    },

    capitalize(value){
      let capitalize= '';
      if(value){
        capitalize = value[0].toUpperCase() + value.slice(1);
      }
      return capitalize;
    }
  }
}
</script>
