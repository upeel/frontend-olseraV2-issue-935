<template>
  <div>
    <div class="title-jurnal">
      <h4>
        <strong>{{$lang[langId].mapping_product}} ({{allProduct.length}})</strong>
        <div style="float: right;">
          <el-button size="small" :loading="loadingPost" :disabled="loadingPost || chosenProduct.length === 0" :type="chosenProduct.length !== 0 ? 'success' : 'info'" @click="postHandle">
            <span>{{$lang[langId].post_product}}</span>
          </el-button>
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
              v-if="scope.row.isActive && isFecth === 0"
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
              v-if="scope.row.isActive && isFecth === 1" 
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
import axios from 'axios'
import Loading from 'vue-loading-overlay';
import CustomDateFilter from 'modules/CustomDateFilter';
import { fetchproduct, listFecthProduct } from '@/api/accounting-3rd/jurnalid';
import basicComputedMixin from '@/mixins/basicComputedMixin';
export default {
  name: 'MapProduct',
  components: {
    Loading,
    CustomDateFilter
  },
  mixins: [basicComputedMixin],
  props: {
    allProduct: {
      type: Array,
      default: null
    },
    isFecth: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      formEdit: {
        product_id: '',
        jurnal_product_id: '',
        jurnal_product_name: '',
        product_variant_id: 0,
        product_name: ''
      },
      isLoading: false,
      loadingPost: false,
      dataProductJurnal: [],
      chosenProduct: [],
      dataProductFetched: [],
      currentFetch: 0,
      totalFetch: 0,
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
      var itemsProcessed = 0;
      
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

          itemsProcessed++;
          if(itemsProcessed === this.chosenProduct.length) {
            this.chosenProduct = []
            this.loadingPost = false
          }

        }).catch(error => {
          itemsProcessed++;
          this.loadingPost = false
          if(itemsProcessed === this.chosenProduct.length) {
            this.chosenProduct = []
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

    capitalize(value){
      let capitalize= '';
      if(value){
        capitalize = value[0].toUpperCase() + value.slice(1);
      }
      return capitalize;
    },

  },
  mounted() {
		if(this.isFecth === 0){
    	this.loadProductJurnal()
		}
  }
}
</script>
