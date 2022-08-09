<template>
  <div>
    <div class="table-handler-flex">
      <div class="mb-12" style="flex-grow: 1;">
        <el-select
          v-model="params.per_page"
          :placeholder="lang.please_select"
          filterable
          size="small"
          @change="handleSizeChange">
          <el-option
            v-for="item in pages"
            :key="item"
            :value="item"
            :label="item + ' ' + lang.rows"
          />
        </el-select>
      </div>

      <div class="mb-12">
        <el-input
          v-model="params.search"
          :placeholder="lang.product+'/SKU'"
          clearable
          prefix-icon="el-icon-search"
          size="small"
          class="inline-form input-search"
          @change="handleSearch">
        </el-input>
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
      </div>
    </div>

    <hr/>

    <el-table
      ref="multipleTable"
      v-loading="isLoading"
      :data="dataMappedProducts"
      @selection-change="handleSelectPost"
      column-key="accurate_posted"
      @filter-change="filterPost"
      stripe
      class="product-table-max-height vertical-align-top mobile-fix-height-unset"
      @sort-change="handleSortChange">
      <el-table-column type="selection" width="30" class-name="text-center"></el-table-column>
      <el-table-column :label="lang.photo" class-name="text-center" min-width="80px">
        <template slot-scope="props">
            <el-image
              v-if="props.row.photo_xs"
              :src="props.row.photo_xs"
              fit="cover"
              style="width: 50px; height: 50px; border-radius: 50%;"
            />
        </template>
      </el-table-column>

      <el-table-column :label="lang.product_name" prop="name" sortable min-width="150px">
        <template slot-scope="scope">
          <strong>{{ scope.row.name }}</strong>
        </template>
      </el-table-column>

      <el-table-column :label="lang.sku" prop="sku" sortable min-width="100">
        <template slot-scope="scope">
          <div class="overflow-ellipsis">
            {{ scope.row.sku }}
          </div>
        </template>
      </el-table-column>

      <el-table-column :label="$lang[langId].accurate_product_name" prop="accurate_name" min-width="150">
        <template slot-scope="scope">
          <div v-if="scope.row.isActive">
            <el-select
              :placeholder="$lang[langId].select" 
              filterable
              remote
              reserve-keyword
              v-model="formEdit.name"
              @change="(value) => selectProduct(value)"
              :remote-method="loadProductAccurate"
              style="width: 100%">
              <el-option
                v-for="(item, keyProduct) in dataProductAccurate"
                :key="keyProduct"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <strong v-else>
            {{ scope.row.accurate_name }}
          </strong>
        </template>
      </el-table-column>
      <el-table-column
        prop="accurate_posted"
        :label="lang.status"
        width="150"
        :filters="[{ text: $lang[langId].posted, value: '1' }, { text: $lang[langId].unposted, value: '0' }]"
        :filter-multiple="false"
        >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.accurate_posted === 1"
            type="success"
            size="mini"
            disable-transitions>{{$lang[langId].posted}}
          </el-tag>
          <el-tag v-else type="danger" disable-transitions size="mini">
            {{$lang[langId].unposted}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$lang[langId].action" width="180" align="right">
        <template slot-scope="scope">
          <el-button type="text" v-if="scope.row.isActive === false" @click="mapHandle(scope.$index, scope.row)">
            <svg-icon type="edit"></svg-icon>
            Map Product
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

    <div class="block mt-12">
      <el-pagination
        :current-page.sync="params.page"
        :page-size="params.per_page"
        :total="params.total"
        layout="total, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import Loading from 'vue-loading-overlay';
import basicComputedMixin from '@/mixins/basicComputedMixin'

export default {
  mixins: [basicComputedMixin],
  
  props: {
    isFecth: {
      type: Number,
      default: 0
    }
  },

  components:{
    Loading
  },

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
  mounted(){
    this.getAllProduct()
    if(this.isFecth === 0){
      this.loadProductAccurate()
    }
  },

  data(){
    return{
      dataMappedProducts: [],
      chosenProduct: [],
      isLoading: false,
      loadingPost: false,
      pages: [5, 10, 20, 50, 100],
      formEdit: {
        no: 0,
        name: '',
        id: 0,
        tax_id: null,
        product_id: '',
        product_variant_id: 0,
        product_combo_id: 0,
        deal_id: 0
      },
      dataProductAccurate: [],
      params: {
        search: null,
        total: null,
        // sort_column: 'id',
        // sort_type: 'desc',
        per_page: 10,
        page: 1,
        store: null,
        search_column: [],
        search_text: [],
        search_operator: [],
        collection_id: '',
      },
    }
  },

  methods:{
    filterPost(value){
      let keyTable = Object.keys(value)[0];
        if(value[keyTable][0]){
          if(this.params.search_column.includes('accurate_posted') === true){
            this.params.search_column.map((i, idx) => {
              if (i === 'accurate_posted') {
                this.params.search_text[idx] = value[keyTable][0]
              }
            })
          }else{
            this.params.search_column.push('accurate_posted')
            this.params.search_text.push(value[keyTable][0])
          }
        }else{
          this.params.search_column.map((i, idx) => {
            if (i === 'accurate_posted') {
              this.params.search_column.splice(idx, 1)
              this.params.search_text.splice(idx, 1)
            }
          })
        }
        this.params.page = 1
        this.getAllProduct()
    },

    getAllProduct(){
      this.isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/allproduct'),
        params: this.params,
        headers: headers
      })
        .then(response => {
          let res = response.data.data
          this.dataMappedProducts = res.map(v => ({...v, isActive: false}))
          this.params.total = response.data.meta.total
          this.isLoading = false
        })
        .catch(error => {
          this.isLoading = false
          this.dataMappedProducts = []
          this.params.total = 0
          if (error.response.data.error.status_code !== 404) {
            this.$notify({
              type: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error
            })
          }
        })
    },

    handleSizeChange(val) {
      this.params.page = 1
      this.params.per_page = val
      this.getAllProduct()
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.params.page = val
      this.getAllProduct()
    },
    handleSearch(val) {
      this.params.page = 1
      this.params.page = 1
      // this.params.search_text = []
      // this.params.search_column = []
      this.getAllProduct()
    },
    handleSortChange(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.getAllProduct()
    },

    loadProductAccurate(val){
       let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let paramsData = val ? {search: val} : {search: ''}
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/product'),
        headers: headers,
        params: paramsData
      }).then(response => {
        this.dataProductAccurate = response.data.data
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

    selectProduct(value){
      this.dataProductAccurate.map((item, idx) => {
        if(item.id === value){
          // this.formEdit.no = item.no
          // this.formEdit.name = item.name
          this.formEdit.id = value
          this.formEdit.tax_id = Object.prototype.toString.call(item.tax1) === '[object Object]' ? item.taxt1.id : null
        }
      });
    },
    
    mapHandle(index, row) {
      this.formEdit = {
        no: 0,
        name: '',
        id: 0,
        tax_id: null,
        product_id: '',
        product_variant_id: 0,
        product_combo_id: 0,
        deal_id: 0
      }
      let idxActive = this.dataMappedProducts.findIndex( x => x.isActive === true );
      if(idxActive !== -1){
        this.dataMappedProducts[idxActive].isActive = false
      }
      this.formEdit.product_id = row.product_id
      this.formEdit.product_variant_id = row.product_variant_id ? row.product_variant_id : 0
      this.formEdit.product_combo_id = "product_combo_id" in row ? row.product_combo_id : 0
      this.formEdit.deal_id = "deal_id" in row ? row.deal_id : 0
      this.dataMappedProducts[index].isActive = true
    },
    
    cancelHandle(index) {
      this.formEdit = {
        no: 0,
        name: '',
        id: 0,
        tax_id: null,
        product_id: '',
        product_variant_id: 0,
        product_combo_id: 0,
        deal_id: 0
      }
      this.dataMappedProducts[index].isActive = false
    },
    saveHandle(index) {
      this.isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/productmap'),
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
          }
          this.isLoading = false
          this.dataMappedProducts[index].accurate_posted = result.data.accurate_posted
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
          this.dataMappedProducts[index].isActive = true
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
          product_variant_id: item.product_variant_id ? item.product_variant_id : '0',
          product_combo_id: item.product_combo_id ? item.product_combo_id : '0',
          deal_id: item.deal_id === null ? '0' : item.deal_id
        }
        axios({
          method: 'POST',
          url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/product'),
          headers: headers,
          params: data
        }).then(response => {
          let resp = response.data.data

          this.dataMappedProducts.map((i, idx) => {
            if (i.product_id === parseInt(resp.product_id) && i.product_variant_id === parseInt(resp.product_variant_id)) {
              i.accurate_posted = resp.accurate_posted
              // this.dataMappedProducts.splice(idx, 1)
            }
          })

          itemsProcessed++;
          if(itemsProcessed === this.chosenProduct.length) {
            this.$refs.multipleTable.clearSelection();
            this.chosenProduct = []
            this.loadingPost = false
            this.$message({
              type: 'success',
              message: this.$lang[this.langId].success_posting
            })
          }
        }).catch(error => {
          itemsProcessed++;
          this.loadingPost = false
          if(itemsProcessed === this.chosenProduct.length) {
            this.$refs.multipleTable.clearSelection();
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

    handleSelectPost(val){
      if (val.length > 0) {
        this.chosenProduct = val
      }else{
        this.chosenProduct = []
      }
    },

  }
}
</script>
