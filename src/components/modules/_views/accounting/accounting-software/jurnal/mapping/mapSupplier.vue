<template>
  <div>
    <div class="title-jurnal">
      <h4>
        <strong>{{$lang[langId].mapping_supplier}} ({{allSupplier.length}})</strong>
        <div style="float: right;">
          <el-tooltip v-show="isFecth.showfetchSupplierButton === 1" effect="dark" :content="$lang[langId].jurnal_fetch_supplier_info" placement="top">
            <el-button :disabled="loadingFetch" @click="fetchJurnalSupplier" size="small">
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
              <span v-else>{{$lang[langId].fetch_supplier}} Jurnal.id</span>
            </el-button>
          </el-tooltip>
          <el-button size="small" :disabled="loadingPost || chosenSupplier.length === 0" :type="chosenSupplier.length !== 0 ? 'success' : 'info'" @click="postHandle">
            <loading
              v-if="loadingPost" 
              :active="true"
              color= '#1bb4e6'
              loader="dots"
              :width="28"
              :height="10"
              backgroundColor='#ffffff'>
            </loading>
            <span v-else>Post {{lang.supplier}}</span>
          </el-button>
					<el-button type="primary" size="small" @click="handleListSupplier">
            {{ $lang[langId].supplier_list }}
          </el-button>
        </div>
      </h4>
    </div>
    <div v-if="isLoading === false">
      <el-table
        ref="multipleTable"
        :data="allSupplier"
        @selection-change="handleSelectPost"
        class="product-table-max-height mobile-fix-height-unset"
        max-height="340"
        stripe>
        <el-table-column type="selection" width="30" class-name="text-center">
        </el-table-column>

        <el-table-column
          prop="name"
          :label="lang.supplier_name">
          <template slot-scope="scope">
            <span>{{capitalize(scope.row.supplier_name)}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="supplier_id">
          <template slot-scope="scope">
            <el-select
              v-if="scope.row.isActive && isFecth.isfetchSupplier === 0" 
              :placeholder="$lang[langId].select" 
              filterable
              v-model="formEdit.jurnal_contact_id"
              @change="(value) => selectSupplier(value)"
              style="width: 100%">
              <el-option
                v-for="item in dataSupplierJurnal"
                :key="item.jurnal_contact_id"
                :label="item.display_name"
                :value="item.jurnal_contact_id">
              </el-option>
            </el-select>
             <el-select 
              v-if="scope.row.isActive && isFecth.isfetchSupplier === 1" 
              :placeholder="$lang[langId].type_keyword" 
              filterable
              remote
              reserve-keyword
              v-model="formEdit.jurnal_contact_id"
              @change="(value) => selectSupplierFecth(value)"
              :remote-method="searchFecthSupplier"
              style="width: 100%">
              <el-option
                v-for="(item, keyFetch) in dataSupplierFetched"
                :key="keyFetch"
                :label="item.display_name"
                :value="item.jurnal_contact_id">
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
                    Post Supplier
                  </el-button>
                </el-dropdown-item> -->
                <el-dropdown-item style="padding: 0px">
                  <el-button class="accounting-dropBtn" type="text" @click="mapHandle(scope.$index, scope.row)">
                    <svg-icon type="edit"></svg-icon>
                    Map Supplier
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
import { fetchSupplier, listFecthSupplier } from '@/api/accounting-3rd/jurnalid';
import axios from 'axios'
import Loading from 'vue-loading-overlay';

export default {
  name: 'MapSupplier',
  components: {
    Loading
  },

  props: {
    allSupplier: {
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
        supplier_id: '',
        jurnal_contact_id: '',
        jurnal_display_name: ''
      },
      isLoading: false,
      loadingFetch: false,
      currentFetch: 0,
      totalFetch: 0,
      dataSupplierJurnal: [],
      dataSupplierFetched: [],
      chosenSupplier: [],
      loadingPost: false,
      clearMap: "",
      paramsSupplier: {
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
    }
  },
  methods: {
    loadSupplierJurnal(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/vendor'),
        headers: headers
      }).then(response => {
        this.dataSupplierJurnal = response.data.data
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
      

      this.chosenSupplier.forEach(item => {
        let data = {
          supplier_id : item.supplier_id
        }

        axios({
          method: 'POST',
          url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/vendor'),
          headers: headers,
          params: data
        }).then(response => {
          this.$message({
            type: 'success',
            message: this.$lang[this.langId].success_posting
          })
          this.allSupplier.map((i, idx) => {
            if (i.supplier_id === item.supplier_id) {
              this.allSupplier.splice(idx, 1)
            }
          })

        }).catch(error => {
          // this.loadingPost = false
          this.chosenSupplier = []
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
      this.chosenSupplier = []
    },

    handleSelectPost(val){
      if (val.length > 0) {
        this.chosenSupplier = val
      }else{
        this.chosenSupplier = []
      }
    },

    selectSupplier(value){
      this.dataSupplierJurnal.map((item, idx) => {
        if(item.jurnal_contact_id === value){
          this.formEdit.jurnal_contact_id = value
          this.formEdit.jurnal_display_name = item.display_name
        }
      });
    },

    mapHandle(index, row) {
      let idxActive = this.allSupplier.findIndex( x => x.isActive === true );
      if(idxActive !== -1){
        this.allSupplier[idxActive].isActive = false
      }
      this.formEdit.supplier_id = row.supplier_id
      this.allSupplier[index].isActive = true
    },
    
    cancelHandle(index) {
      this.formEdit.supplier_id = ''
      this.formEdit.jurnal_display_name = ''
      this.formEdit.jurnal_contact_id = ''
      this.allSupplier[index].isActive = false
    },

    saveHandle(index) {
      this.isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/vendormap'),
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

    selectSupplierFecth(value){
      this.dataSupplierFetched.map((item, idx) => {
        if(item.jurnal_contact_id === value){
          this.formEdit.jurnal_contact_id = value
          this.formEdit.jurnal_display_name = item.display_name
        }
      });
    },

    searchFecthSupplier(value){
      if(value){
        let params = {
          search_column: 'display_name',
          search_text: value
        }

        listFecthSupplier(params).then(response => {
          this.formEdit.jurnal_contact_id = ''
          this.formEdit.jurnal_display_name = ''
          let resp = response.data.data
          this.dataSupplierFetched = resp ? resp : [] 
        })
      }else{
        this.formEdit.jurnal_contact_id = ''
        this.formEdit.jurnal_display_name = ''
        this.dataSupplierFetched = []
      }
    },

    handleFetch () {
      this.loadingFetch = true
    },

    fetchJurnalSupplier(){
      this.loadingFetch = true

      fetchSupplier(this.paramsSupplier).then(response => {
        let message = 'Success ' + this.paramsSupplier.page + ' ' + this.$lang[this.langId].of + ' ' + response.data.data.total_pages
        if (this.paramsSupplier.page < response.data.data.total_pages) {
          this.currentFetch = response.data.data.currenct_page + 1
          this.totalFetch = response.data.data.total_pages
          this.paramsSupplier.page = response.data.data.currenct_page + 1
          this.$message({
            type: 'success',
            message: message
          })
          this.fetchJurnalSupplier()
        } else {
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

		handleListSupplier() {
      this.$emit('supplierList')
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
    if(this.isFecth.isfetchSupplier === 0){
      this.loadSupplierJurnal()
    }
 }
}
</script>
