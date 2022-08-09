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
        <el-button size="small" :loading="loadingPost" :disabled="loadingPost || chosenCombo.length === 0" :type="chosenCombo.length !== 0 ? 'success' : 'info'" @click="postHandle">
          <span>{{$lang[langId].post_product}}</span>
        </el-button>
      </div>
    </div>

    <hr/>

    <el-table
      ref="multipleTable"
      v-loading="isLoading"
      :data="dataComboProducts"
			column-key="jurnal_posted"
			@filter-change="filterPost"
      stripe
			@selection-change="handleSelectPost"
      class="product-table-max-height vertical-align-top mobile-fix-height-unset"
      @sort-change="handleSortChange">
      <el-table-column type="selection" width="30" class-name="text-center">
      </el-table-column>
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
          <el-popover
            placement="right"
            width="900"
            trigger="click">
            <div>
              <el-row :gutter="20"  style="width: 100%">
                <el-col :span="18">
                  <strong>{{ scope.row.name }}</strong>
                </el-col>
                <el-col :span="6" align="right">
                  <div class="btn_save_dialog">
                    <el-button :disabled="loadingPostItem || chosenItem.length === 0" 
                      :loading="loadingPostItem"
                      :type="chosenItem.length !== 0 ? 'success' : 'info'" 
                      @click="postProductItem">{{ $lang[langId].confirm }}</el-button>
                  </div>
                </el-col>
              </el-row>
              <el-table :data="gridItem" ref="multipleItem" @selection-change="handleSelectItem"
               v-loading="loadingItem" max-height="250" stripe row-key="id"
							 default-expand-all :tree-props="{children: 'material'}">
                <el-table-column type="selection" :selectable="checkListItem" width="30" class-name="text-center">
                </el-table-column>
                <el-table-column property="product_name" label="name"></el-table-column>

                <el-table-column
                  prop="re_confirm"
                  :label="$lang[langId].jurnal_confirm"
                  width="150"
                  >
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.re_confirm === 1"
                      type="success"
                      size="mini"
                      disable-transitions>{{$lang[langId].product_confirm}}
                    </el-tag>
                    <el-tag v-else-if="scope.row.re_confirm === 2"  type="danger" disable-transitions size="mini">
                      {{$lang[langId].product_missing}}
                    </el-tag>
                    <el-tag v-else-if="scope.row.re_confirm === 3"  type="warning" disable-transitions size="mini">
                      {{$lang[langId].product_bundle}}
                    </el-tag>
                    <span v-else>-</span>
                  </template>
                </el-table-column>

              </el-table>
              <el-pagination
                :current-page.sync="paramsItem.page"
                :page-size="paramsItem.per_page"
                :total="paramsItem.total"
                layout="total, prev, pager, next, jumper"
                @size-change="handleSizeItemChange"
                @current-change="handleCurrentItemChange">
              </el-pagination>
            </div>
            <span class="color-primary font-bold pointer word-break" @click="getProductItem(scope.row)" slot="reference">{{scope.row.name}}</span>
          </el-popover>
          <!-- <strong v-else>{{ scope.row.name }}</strong> -->
        </template>
      </el-table-column>

      <el-table-column :label="lang.sku" prop="sku" sortable min-width="100">
        <template slot-scope="scope">
          <div class="overflow-ellipsis">
            {{ scope.row.sku }}
          </div>
        </template>
      </el-table-column>

      <el-table-column :label="$lang[langId].jurnal_product_name" prop="jurnal_product_name" min-width="150">
        <template slot-scope="scope">
          <div v-if="scope.row.isActive">
            <el-select
              v-if="isFecth === 0"
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
              v-if="isFecth === 1" 
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
          </div>
          <strong v-else>
            {{ scope.row.jurnal_product_name }}
          </strong>
        </template>
      </el-table-column>
			<el-table-column
				prop="jurnal_posted"
				:label="$lang[langId].status"
				width="130"
				:filters="[{ text: $lang[langId].posted, value: '1' }, { text: $lang[langId].unposted, value: '0' }]"
				:filter-multiple="false"
				>
				<template slot-scope="scope">
					<el-tag v-if="scope.row.jurnal_posted === 1"
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
import { listFecthProduct } from '@/api/accounting-3rd/jurnalid'
import Loading from 'vue-loading-overlay'
import basicComputedMixin from '@/mixins/basicComputedMixin'

export default {
  mixins: [basicComputedMixin],

  props: {
    isFecth: {
      type: Number,
      default: 0
    }
  },

  components:{},

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
        product_combo_id: '',
        jurnal_product_id: '',
        jurnal_product_name: '',
      },
      dataProductJurnal: [],
      dataProductFetched: [],
			chosenCombo: [],
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
      chosenItem: [],
      loadingPost: false,
			loadingPostItem: false,
      formGrid: {},
      gridItem: [],
      loadingItem: false,
      paramsItem: {
        product_combo_id: 0,
        total: null,
        per_page: 20,
        page: 1,
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
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/allcombo'),
        params: this.params,
        headers: headers
      }).then(response => {
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

    filterPost(value){
      let keyTable = Object.keys(value)[0];
        if(value[keyTable][0]){
          if(this.params.search_column.includes('jurnal_posted') === true){
            this.params.search_column.map((i, idx) => {
              if (i === 'jurnal_posted') {
                this.params.search_text[idx] = value[keyTable][0]
              }
            })
          }else{
            this.params.search_column.push('jurnal_posted')
            this.params.search_text.push(value[keyTable][0])
          }
        }else{
          this.params.search_column.map((i, idx) => {
            if (i === 'jurnal_posted') {
              this.params.search_column.splice(idx, 1)
              this.params.search_text.splice(idx, 1)
            }
          })
        }
        this.params.page = 1
        this.getProduct()
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
    mapHandle(index, row) {
      this.formEdit = {
        product_combo_id: '',
        jurnal_product_id: '',
        jurnal_product_name: '',
      }
      let idxActive = this.dataComboProducts.findIndex( x => x.isActive === true );
      if(idxActive !== -1){
        this.dataComboProducts[idxActive].isActive = false
      }
      this.formEdit.product_combo_id = row.product_combo_id

      this.dataComboProducts[index].isActive = true
    },

    getProductItem(row){
      this.paramsItem.product_combo_id = row.product_combo_id
      this.loadingItem = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/productcombo/item'),
        params: this.paramsItem,
        headers: headers
      }).then(response => {
        this.gridItem = response.data.data
        this.paramsItem.total = response.data.meta.total
        this.loadingItem = false
      }).catch(error => {
        this.loadingItem = false
        this.gridItem = []
        this.paramsItem.total = 0
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
      })
    },

     handleSelectItem(val){
      if (val.length > 0) {
        this.chosenItem = val
      }else{
        this.chosenItem = []
      }
    },

    selectProductGrid(value){
      this.dataProductJurnal.map((item, idx) => {
        if(item.jurnal_product_id === value){
          this.formGrid.jurnal_product_id = value
          this.formGrid.jurnal_product_name = item.jurnal_product_name
        }
      });
    },
    postProductItem(){
      this.loadingPostItem = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      var itemsProcessed = 0;
      
      this.chosenItem.forEach(item => {
        let data = {
          id : item.id
        }
        axios({
          method: 'POST',
          url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/productcombo/confirm'),
          headers: headers,
          params: data
        }).then(response => {
          this.gridItem.map((i, idx) => {
            if (parseInt(i.id) === item.id) {
              this.gridItem[idx].re_confirm = response.data.re_confirm
							item.material.map((materialItem, idx) => {
								let idxMat = item.material.findIndex( x => x.id === materialItem.id );
								item.material[idxMat].re_confirm = materialItem.re_confirm
							})
            }
          })
          itemsProcessed++;
          if(itemsProcessed === this.chosenItem.length) {
            this.$refs.multipleItem.clearSelection();
            this.$message({
              type: 'success',
              message: this.$lang[this.langId].confirm_sended
            })
            this.loadingPostItem = false
            this.chosenItem = []
          }
        }).catch(error => {
          itemsProcessed++;
          this.loadingPostItem = false
          if(itemsProcessed === this.chosenItem.length) {
            this.$refs.multipleItem.clearSelection();
            this.chosenItem = []
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

    checkListItem(row, index){
      let selectable = false;
      if(row.hasOwnProperty("parent_id")){
        selectable = true;
      }
      return selectable;
    },

    handleSizeItemChange(val) {
      this.paramsItem.page = 1
      this.paramsItem.per_page = val
      this.getProductItem()
    },
    handleCurrentItemChange(val) {
      this.paramsItem.page = val
      this.paramsItem.page = val
      this.getProductItem()
    },
    
    cancelHandle(index) {
      this.formEdit.product_combo_id = ''
      this.formEdit.jurnal_product_name = ''
      this.formEdit.jurnal_product_id = ''

      this.dataComboProducts[index].isActive = false
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
          this.dataComboProducts[index].isActive = false
          this.dataComboProducts[index].jurnal_product_name = result.data.jurnal_product_name
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

		postHandle(){
      this.loadingPost = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

			var itemsProcessed = 0;
      
      this.chosenCombo.forEach(item => {
        let data = {
          product_combo_id: item.product_combo_id,
        }
        axios({
          method: 'POST',
          url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/product'),
          headers: headers,
          params: data
        }).then(response => {
					let res = response.data.data
          this.dataComboProducts.map((i, idx) => {
            if (i.product_combo_id === parseInt(res.product_combo_id)) {
							i.jurnal_posted = res.jurnal_posted_product
            }
          })

					itemsProcessed++;
					if(itemsProcessed === this.chosenCombo.length) {
						this.$refs.multipleTable.clearSelection();
						this.$message({
							type: 'success',
							message: this.$lang[this.langId].success_posting
						})
						this.loadingPost = false
						this.chosenCombo = []
					}
        }).catch(error => {
					itemsProcessed++;
          this.loadingPost = false
					if(itemsProcessed === this.chosenCombo.length) {
						this.$refs.multipleTable.clearSelection();
      			this.chosenCombo = []
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
        this.chosenCombo = val
      }else{
        this.chosenCombo = []
      }
    },
  }
}
</script>
