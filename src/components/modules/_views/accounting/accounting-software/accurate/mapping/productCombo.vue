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

      </div>
    </div>

    <hr/>

    <el-table
      ref="multipleTable"
      v-loading="isLoading"
      :data="dataComboProducts"
      stripe
      class="product-table-max-height vertical-align-top mobile-fix-height-unset"
      @sort-change="handleSortChange">
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
          <el-select
            v-if="scope.row.isActive"
            :placeholder="$lang[langId].select" 
            filterable
            remote
            reserve-keyword
            v-model="formEdit.name"
            @change="(value) => selectProduct(value)"
            :remote-method="loadProductJurnal"
            style="width: 100%">
            <el-option
              v-for="(item, keyProduct) in dataProductAccurate"
              :key="keyProduct"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <!-- <el-select 
              v-if="scope.row.isActive && isFecth.fetchProduct === 1" 
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
            </el-select> -->
          <strong v-else>
            {{ scope.row.accurate_name }}
          </strong>
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
import { listFecthProduct } from '@/api/accounting-3rd/jurnalid'
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

  data(){
    return{
      dataComboProducts: [],
      isLoading: false,
      pages: [5, 10, 20, 50, 100],
      formEdit: {
        no: 0,
        name: '',
        id: 0,
        tax_id: null,
        product_variant_id: 0,
        product_combo_id: 0,
        deal_id: 0
      },
      dataProductAccurate: [],
      dataProductFetched: [],
      params: {
        search: null,
        total: null,
        // sort_column: 'id',
        // sort_type: 'desc',
        per_page: 10,
        page: 1,
        store: null,
        search_column: [],
        search_text: '',
        search_operator: [],
        collection_id: '',
      },
    }
  },

  mounted(){
    this.getProduct()
    if(this.isFecth === 0){
      this.loadProductJurnal()
    }
  },

  methods:{
    getProduct(){
      this.isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/allcombo'),
        params: this.params,
        headers: headers
      })
        .then(response => {
          let res = response.data.data
          this.dataComboProducts = res.map(v => ({...v, isActive: false}))
          this.params.total = response.data.meta.total
          this.isLoading = false
        })
        .catch(error => {
          this.isLoading = false
          this.dataComboProducts = []
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
      this.getProduct()
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.params.page = val
      this.getProduct()
    },
    handleSearch(val) {
      this.params.page = 1
      this.params.page = 1
      // this.params.search_text = []
      // this.params.search_column = []
      this.getProduct()
    },
    handleSortChange(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.getProduct()
    },

    loadProductJurnal(val){
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
          this.formEdit.no = item.no
          this.formEdit.name = item.name
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
        product_variant_id: 0,
        product_combo_id: 0,
        deal_id: 0
      }
      let idxActive = this.dataComboProducts.findIndex( x => x.isActive === true );
      if(idxActive !== -1){
        this.dataComboProducts[idxActive].isActive = false
      }

      this.formEdit.product_variant_id = 0
      this.formEdit.product_combo_id = row.id
      this.formEdit.deal_id = 0
      this.dataComboProducts[index].isActive = true
    },
    
    cancelHandle(index) {
      this.formEdit = {
        no: 0,
        name: '',
        id: 0,
        tax_id: null,
        product_variant_id: 0,
        product_combo_id: 0,
        deal_id: 0
      }
      this.dataComboProducts[index].isActive = false
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
          this.dataComboProducts[index].isActive = false
          this.dataComboProducts[index].accurate_name = result.data.accurate_name
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
          this.dataComboProducts[index].isActive = true
        })
    },
  }
}
</script>