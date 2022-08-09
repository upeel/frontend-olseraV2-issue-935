<template>
  <div>
    <div class="title-jurnal">
      <h4>
				<strong v-if="menu === 'stockIn'">{{$lang[langId].set_product}} ({{allProduct.length}})</strong>
        <strong v-else>{{$lang[langId].mapping_product}} ({{allProduct.length}})</strong>
        <div style="float: right;">
          <el-dropdown>
            <el-button size="small" v-show="isFecth.showfetchProductButton === 1">
              {{$lang[langId].fetch_product}}<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item class="p-null">
                <el-button class="accounting-dropBtn" type="text" :disabled="loadingFetchProduct" @click="fetchJurnalProduct" size="small">
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
                  <span v-else>{{$lang[langId].fetch_product}} Jurnal.id</span>
                </el-button>
              </el-dropdown-item>
              <el-dropdown-item class="p-null">
                <el-button class="accounting-dropBtn" type="text" size="small" style="color: red" @click="handleResetJurnalProduct">
                  <span>Reset</span>
                </el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button size="small" :disabled="loadingPost || chosenProduct.length === 0" :type="chosenProduct.length !== 0 ? 'success' : 'info'" @click="postHandle">
            <loading
              v-if="loadingPost" 
              :active="true"
              color= '#1bb4e6'
              loader="dots"
              :width="28"
              :height="10"
              backgroundColor='#ffffff'>
            </loading>
            <span v-else>{{$lang[langId].post_product}}</span>
          </el-button>
					<el-button size="small" type="primary" @click="showMappedProduct">
						{{lang.all_products}}
					</el-button>
					<el-button v-if="menu === 'stockIn'"  style="padding: 6px; font-size: large;" type="info" @click="closeUI"><svg-icon icon-class="x" /></el-button>
        </div>
      </h4>
    </div>
    <div v-if="isLoading === false">
      <el-table
        ref="multipleTable"
        :data="allProduct"
        @selection-change="handleSelectPost"
        class="product-table-max-height mobile-fix-height-unset"
        max-height="340"
        stripe>
        <el-table-column type="selection" width="30" class-name="text-center">
        </el-table-column>

        <el-table-column
          prop="name"
          :label="lang.product_name">
          <template slot-scope="scope">
            <span>{{capitalize(scope.row.product_name)}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="product_id">
          <template slot-scope="scope">
            <el-select
              v-if="scope.row.isActive && isFecth.isFecth === 0"
              :placeholder="$lang[langId].select" 
              filterable
              v-model="formEdit.jurnal_product_id"
              @change="(value) => selectProduct(value)"
              style="width: 100%">
              <el-option
                v-for="item in dataProductJurnal"
                :key="item.jurnal_product_id"
                :label="item.jurnal_product_name"
                :value="item.jurnal_product_id">
              </el-option>
            </el-select>
            <el-select 
              v-if="scope.row.isActive && isFecth.isFecth === 1" 
              :placeholder="$lang[langId].type_keyword" 
              filterable
              remote
              reserve-keyword
              @change="(value) => selectProductFecth(value)"
              :remote-method="searchFecthProduct"
              v-model="formEdit.jurnal_product_id"
              style="width: 100%">
              <el-option
                v-for="(item, keyFetch) in dataProductFetched"
                :key="keyFetch"
                :label="item.jurnal_product_name"
                :value="item.jurnal_product_id">
              </el-option>
            </el-select>
          </template>

        </el-table-column>
        <el-table-column :label="$lang[langId].action" width="180" align="right">
          <template slot-scope="scope">
            <el-dropdown trigger="click" v-if="scope.row.isActive === false">
              <el-button type="text" icon="el-icon-more" style="color:#909399"></el-button>
              <el-dropdown-menu style="background-color: #F2F2F2;">
                <!-- <el-dropdown-item style="padding: 0px">
                  <el-button type="text" class="accounting-dropBtn" @click="postHandle(scope.row, scope.$index)">
                    <svg-icon icon-class="cloud-upload"></svg-icon>
                    Post Product
                  </el-button>
                </el-dropdown-item> -->
                <el-dropdown-item style="padding: 0px">
                  <el-button class="accounting-dropBtn" type="text" @click="mapHandle(scope.$index, scope.row)">
                    <svg-icon type="edit"></svg-icon>
                    Map Product
                  </el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

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
import { baseApi } from 'src/http-common'
import { fetchproduct, listFecthProduct, deleteJurnalProduct } from '@/api/accounting-3rd/jurnalid'
import axios from 'axios'
import Loading from 'vue-loading-overlay';
import basicComputedMixin from '@/mixins/basicComputedMixin'
export default {
  name: 'MapProduct',
  components: {
    Loading
  },
  mixins: [basicComputedMixin],
  props: {
    allProduct: {type: Array,default: null},
    isFecth: {type: Object, default: null},
		menu: {type: String, default: 'Trx'}
  },
  data() {
    return {
      formEdit: {
        product_id: '',
        jurnal_product_id: '',
        jurnal_product_name: '',
        product_variant_id: 0,
        product_combo_id: 0,
        deal_id: 0
      },
      isLoading: false,
      loadingPost: false,
      dataProductJurnal: [],
      dataProductFetched: [],
      chosenProduct: [],
      loadingFetchProduct: false,
      currentFetch: 0,
      totalFetch: 0,
      paramsProduct: {
        start_date: '',
        end_date: '',
        page: 1
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
    }
  },
  methods: {
    loadProductJurnal(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/product'),
        headers: headers
      }).then(response => {
        this.dataProductJurnal = response.data.data
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
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      
      this.chosenProduct.forEach(item => {
        let data = {
          product_id : item.product_id,
          product_variant_id: item.product_variant_id,
          product_combo_id: "product_combo_id" in item ? item.product_combo_id : 0,
          deal_id: "deal_id" in item ? item.deal_id : 0
        }
        axios({
          method: 'POST',
          url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/product'),
          headers: headers,
          params: data
        }).then(response => {
          this.$message({
            type: 'success',
            message: this.$lang[this.langId].success_posting
          })
          this.allProduct.map((i, idx) => {
            if (i.product_id === item.product_id) {
              this.allProduct.splice(idx, 1)
            }
          })
        }).catch(error => {
          this.chosenProduct = []
          // this.loadingPost = false
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
      this.loadingPost = false
      this.chosenProduct = []
    },
    selectProduct(value){
      this.dataProductJurnal.map((item, idx) => {
        if(item.jurnal_product_id === value){
          this.formEdit.jurnal_product_id = value
          this.formEdit.jurnal_product_name = item.jurnal_product_name
        }
      });
    },
    selectProductFecth(value){
      this.dataProductFetched.map((item, idx) => {
        if(item.jurnal_product_id === value){
          this.formEdit.jurnal_product_id = value
          this.formEdit.jurnal_product_name = item.jurnal_product_name
        }
      });
    },
    searchFecthProduct(value){
      if(value){
        let params = {
          search_column: 'jurnal_product_name',
          search_text: value
        }
        listFecthProduct(params).then(response => {
          this.formEdit.jurnal_product_id = ''
          this.formEdit.jurnal_product_name = ''
          let resp = response.data.data
          this.dataProductFetched = resp ? resp : []
        })
      }else{
        this.formEdit.jurnal_product_id = ''
        this.formEdit.jurnal_product_name = ''
        this.dataProductFetched = []
      }
    },
    handleSelectPost(val){
      if (val.length > 0) {
        this.chosenProduct = val
      }else{
        this.chosenProduct = []
      }
    },
    mapHandle(index, row) {
      this.formEdit = {
        product_id: '',
        jurnal_product_id: '',
        jurnal_product_name: '',
        product_variant_id: 0,
        product_combo_id: 0,
        deal_id: 0
      }
      let idxActive = this.allProduct.findIndex( x => x.isActive === true );
      if(idxActive !== -1){
        this.allProduct[idxActive].isActive = false
      }
      this.formEdit.product_id = row.product_id
      this.formEdit.product_variant_id = row.product_variant_id
      this.formEdit.product_combo_id = "product_combo_id" in row ? row.product_combo_id : 0
      this.formEdit.deal_id = "deal_id" in row ? row.deal_id : 0
      this.allProduct[index].isActive = true
    },
    
    cancelHandle(index) {
      this.formEdit.product_id = ''
      this.formEdit.jurnal_product_name = ''
      this.formEdit.jurnal_product_id = ''
      this.formEdit.product_variant_id = 0
      this.formEdit.product_combo_id = 0
      this.formEdit.deal_id = 0
      this.allProduct[index].isActive = false
    },
    saveHandle(index) {
      this.isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/productmap'),
        headers: headers,
        data: this.formEdit
      })
        .then(response => {
          let result = response.data
          if (response.data.status === 200) {
            this.$message({
              message: 'Success',
              type: 'success'
            })
          }
          this.isLoading = false
          this.allProduct.splice(index, 1)
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
          this.allProduct[index].isActive = true
        })
    },
    showMappedProduct(){
      this.$emit('toAllProduct')
      // let routeData = this.$router.resolve({name: 'Jurnal All Posted Product'});
      // window.open(routeData.href, '_blank');
    },

    capitalize(value){
      let capitalize= '';
      if(value){
        capitalize = value[0].toUpperCase() + value.slice(1);
      }
      return capitalize;
    },

    fetchJurnalProduct(){
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
          this.fetchJurnalProduct()
        } else {
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
    handleResetJurnalProduct() {
      this.isLoading = true
      deleteJurnalProduct().then(() => {
        this.$message({
          type: 'success',
          message: 'Success'
        })
        this.isLoading = false
      }).catch((error) => {
        this.$notify({
          tipe: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.isLoading = false
      })
    },
		closeUI(){
			this.$emit('close')
		}
  },
  mounted() {
    if(this.isFecth.isFecth === 0){
      this.loadProductJurnal()
    }
  }
}
</script>
