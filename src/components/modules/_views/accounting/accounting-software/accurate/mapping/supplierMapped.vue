<template>
  <div>
    <div class="title-jurnal">
      <div class="table-handler-flex">
        <div class="mb-12" style="flex-grow: 1;">
          <el-input
            v-model="params.search"
            :placeholder="lang.search +' '+lang.supplier"
            clearable
            prefix-icon="el-icon-search"
            size="small"
            class="inline-form input-search"
            @change="handleSearch">
          </el-input>
        </div>

        <div class="mb-12">
          <el-button size="small" v-loading="loadingPost" :disabled="loadingPost || chosenSupplier.length === 0" :type="chosenSupplier.length !== 0 ? 'success' : 'info'" @click="postHandle">
            <span>Post {{lang.supplier}}</span>
          </el-button>
        </div>
      </div>
    </div>
    <div v-if="isLoading === false">
      <el-table
        ref="multipleTable"
        :data="allSupplier"
        @selection-change="handleSelectPost"
        class="product-table-max-height mobile-fix-height-unset"
        max-height="340"
        column-key="post_status"
        @filter-change="filterPost"
        stripe>
        <el-table-column type="selection" width="30" class-name="text-center">
        </el-table-column>
        <el-table-column
          prop="name"
          :label="$lang[langId].name">
          <template slot-scope="scope">
            <span>{{capitalize(scope.row.name)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="accurate_supplier_no"
          :label="$lang[langId].accurate_supplier_no">
          <template slot-scope="scope">
            <span>{{capitalize(scope.row.accurate_supplier_no)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="accurate_name"
          :label="$lang[langId].accurate_name">
          <template slot-scope="scope">
            <span>{{capitalize(scope.row.accurate_name)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="post_status"
          :label="'Post'"
          :filters="[{ text: $lang[langId].posted, value: '1' }, { text: $lang[langId].unposted, value: '0' }]"
          :filter-multiple="false">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.post_status === 1"
              type="success"
              disable-transitions>{{$lang[langId].posted}}
            </el-tag>
            <el-tag v-else type="danger" disable-transitions>
              {{$lang[langId].unposted}}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="supplier_id">
          <template slot-scope="scope">
            <el-select 
              v-if="scope.row.isActive" 
              :placeholder="$lang[langId].select" 
              filterable
              remote
              reserve-keyword
              v-model="formEdit.id"
              @change="(value) => selectsupplier(value)"
              :remote-method="loadSupplierAccurate"
              style="width: 100%">
              <el-option
                v-for="(item, keysupplier) in dataSupplierAccurate"
                :key="keysupplier"
                :label="item.vendorNo +' '+ item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column :label="$lang[langId].action" width="180" align="right">
          <template slot-scope="scope">
            <el-button v-if="scope.row.isActive === false" type="text" @click="mapHandle(scope.$index, scope.row)">
              <svg-icon type="edit"></svg-icon>
              Map {{ 'Supplier' }}
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
      <div style="margin-top: 20px; margin-bottom: -55px">
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
      <div style="text-align: center">
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
  name: 'Mapsupplier',
  components: {
    Loading
  },

  props: {
    isFecth: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      formEdit: {
        supplier_id: '',
        vendorNo: '',
        id: '',
        name: ''
      },
      isLoading: false,
      dataSupplierAccurate: [],
      chosenSupplier: [],
      allSupplier: [],
      loadingPost: false,
      clearMap: "",
      paramsSupplier: {
        page: 1
      },
      params: {
        search: '',
        search_column: [],
        search_text: [],
        per_page: 10,
        page: 1,
        total: null
      },
      pages: [5, 10, 20, 50, 100],
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
  mounted() {
    // if(this.isFecth.fetchsupplier === 0){
      this.loadSupplierAccurate()
      this.getAllSupplier()
    // }
  },
  methods: {
    loadSupplierAccurate(val){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let paramsData = val ? {search: val} : {search: ''}

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/vendor'),
        headers: headers,
        params: paramsData
      }).then(response => {
        this.dataSupplierAccurate = response.data.data
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

    filterPost(value){
      let keyTable = Object.keys(value)[0];
        if(value[keyTable][0]){
          if(this.params.search_column.includes('post_status') === true){
            this.params.search_column.map((i, idx) => {
              if (i === 'post_status') {
                this.params.search_text[idx] = value[keyTable][0]
              }
            })
          }else{
            this.params.search_column.push('post_status')
            this.params.search_text.push(value[keyTable][0])
          }
        }else{
          this.params.search_column.map((i, idx) => {
            if (i === 'post_status') {
              this.params.search_column.splice(idx, 1)
              this.params.search_text.splice(idx, 1)
            }
          })
        }
        this.params.page = 1
        this.getAllSupplier()
    },

    postHandle(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      var itemsProcessed = 0;
      this.chosenSupplier.forEach(item => {
        let data = {
          supplier_id : item.id
        }

        axios({
          method: 'POST',
          url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/vendormap'),
          headers: headers,
          params: data
        }).then(response => {
          this.allSupplier.map((i, idx) => {
            if (i.id === item.id) {
              this.allSupplier.splice(idx, 1)
            }
          })

          itemsProcessed++;
          if(itemsProcessed === this.chosenSupplier.length) {
            this.loadSupplierAccurate()
            this.$message({
              type: 'success',
              message: this.$lang[this.langId].success_posting
            })
            this.loadingPost = false
            this.chosenSupplier = []
          }

        }).catch(error => {
          itemsProcessed++;
          this.loadingPost = false
          if(itemsProcessed === this.chosenSupplier.length) {
            this.chosenSupplier = []
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
        this.chosenSupplier = val
      }else{
        this.chosenSupplier = []
      }
    },

    selectsupplier(value){
      this.dataSupplierAccurate.map((item, idx) => {
        if(item.id === value){
          this.formEdit.name = item.name
          this.formEdit.supplier_id = item.id
          this.formEdit.vendorNo = item.vendorNo
        }
      });
    },

    mapHandle(index, row) {
      let idxActive = this.allSupplier.findIndex( x => x.isActive === true );
      if(idxActive !== -1){
        this.allSupplier[idxActive].isActive = false
      }

      this.formEdit.supplier_id = row.id
      this.formEdit.supplier_name = row.name
      this.allSupplier[index].isActive = true
    },
    
    cancelHandle(index) {
      this.formEdit.supplier_id = ''
      this.formEdit.vendorNo = ''
      this.allSupplier[index].isActive = false
    },

    saveHandle(index) {
      this.isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/vendormap'),
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
              supplier_id: '',
              vendorNo: '',
              id: '',
              name: ''
            }
          }
          this.isLoading = false
          this.allSupplier.splice(index, 1)

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
          this.allSupplier[index].isActive = true
        })
    },

    capitalize(value){
      let capitalize= '';
      if(value){
        capitalize = value[0].toUpperCase() + value.slice(1);
      }
      return capitalize;
    },
    
    handleListsupplier() {
      this.$emit('supplierList')
    },
    getAllSupplier(){
      this.isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/listsupplier'),
        params: this.params,
        headers: headers
      })
        .then(response => {
          let res = response.data.data
          this.allSupplier = res.map(v => ({...v, isActive: false}))
          this.params.total = response.data.meta.total
          this.isLoading = false
        })
        .catch(error => {
          this.isLoading = false
          this.allSupplier = []
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
    postHandle(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      var itemsProcessed = 0;
      this.chosenSupplier.forEach(item => {
        let data = {
          supplier_id : item.id
        }

        axios({
          method: 'POST',
          url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/vendor'),
          headers: headers,
          params: data
        }).then(response => {

          this.allSupplier.map((i, idx) => {
            if (i.id === item.id) {
              i.post_status = 1
            }
          })

          itemsProcessed++;
          if(itemsProcessed === this.chosenSupplier.length) {
            this.$refs.multipleTable.clearSelection();
            this.loadSupplierAccurate()
            this.$message({
              type: 'success',
              message: this.$lang[this.langId].success_posting
            })
            this.loadingPost = false
            this.chosenSupplier = []
          }

        }).catch(error => {
          itemsProcessed++;
          this.loadingPost = false
          if(itemsProcessed === this.chosenSupplier.length) {
            this.$refs.multipleTable.clearSelection();
            this.chosenSupplier = []
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
    handleSizeChange(val) {
      this.params.page = 1
      this.params.per_page = val
      this.getAllSupplier()
    },
    handleSearch(val) {
      this.params.page = 1
      this.params.page = 1
      // this.params.search_text = []
      // this.params.search_column = []
      this.getAllSupplier()
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.params.page = val
      this.getAllSupplier()
    },
  }
}
</script>
