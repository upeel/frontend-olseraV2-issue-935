<template>
  <div>
    <div class="title-jurnal">
      <h4>
        <strong>{{$lang[langId].mapping_customer}} ({{allCustomer.length}})</strong>
        <div style="float: right;">
          <el-tooltip v-show="isFecth.showfetchCustomerButton === 1" effect="dark" :content="$lang[langId].jurnal_fetch_customer_info" placement="top">
            <el-button :disabled="loadingFetch" @click="fetchJurnalCustomer" size="small">
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
              <span v-else>{{$lang[langId].fetch_customer}} Jurnal.id</span>
            </el-button>
          </el-tooltip>
          <el-button size="small" :disabled="loadingPost || chosenCustomer.length === 0" :type="chosenCustomer.length !== 0 ? 'success' : 'info'" @click="postHandle">
            <loading
              v-if="loadingPost" 
              :active="true"
              color= '#1bb4e6'
              loader="dots"
              :width="28"
              :height="10"
              backgroundColor='#ffffff'>
            </loading>
            <span v-else>Post {{lang.customer}}</span>
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
              v-if="scope.row.isActive && isFecth.isfetchCustomer === 0" 
              :placeholder="$lang[langId].select" 
              filterable
              v-model="formEdit.jurnal_customer_id"
              @change="(value) => selectCustomer(value)"
              style="width: 100%">
              <el-option
                v-for="item in dataCustomerJurnal"
                :key="item.jurnal_customer_id"
                :label="item.display_name"
                :value="item.jurnal_customer_id">
              </el-option>
            </el-select>
            <el-select 
              v-if="scope.row.isActive && isFecth.isfetchCustomer === 1" 
              :placeholder="$lang[langId].type_keyword" 
              filterable
              remote
              reserve-keyword
              v-model="formEdit.jurnal_customer_id"
              @change="(value) => selectCustomerFecth(value)"
              :remote-method="searchFecthCustomer"
              style="width: 100%">
              <el-option
                v-for="(item, keyFetch) in dataCustomerFetched"
                :key="keyFetch"
                :label="item.display_name"
                :value="item.jurnal_customer_id">
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
                    Post {{lang.customer}}
                  </el-button>
                </el-dropdown-item> -->
                <el-dropdown-item style="padding: 0px">
                  <el-button class="accounting-dropBtn" type="text" @click="mapHandle(scope.$index, scope.row)">
                    <svg-icon type="edit"></svg-icon>
                    Map {{lang.customer}}
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
import { baseApi } from 'src/http-common';
import { fetchCustomer, listFecthCustomer } from '@/api/accounting-3rd/jurnalid';
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
        jurnal_customer_id: '',
        jurnal_display_name: ''
      },
      isLoading: false,
      loadingFetch: false,
      currentFetch: 0,
      totalFetch: 0,
      dataCustomerJurnal: [],
      dataCustomerFetched: [],
      chosenCustomer: [],
      loadingPost: false,
      clearMap: "",
      paramsCustomer: {
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
    loadCustomerJurnal(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/customer'),
        headers: headers
      }).then(response => {
        this.dataCustomerJurnal = response.data.data
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
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      this.chosenCustomer.forEach(item => {
        let data = {
          customer_id : item.customer_id
        }

        axios({
          method: 'POST',
          url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/customer'),
          headers: headers,
          params: data
        }).then(response => {
          this.$message({
            type: 'success',
            message: this.$lang[this.langId].success_posting
          })
          this.allCustomer.map((i, idx) => {
            if (i.customer_id === item.customer_id) {
              this.allCustomer.splice(idx, 1)
            }
          })

        }).catch(error => {
          // this.loadingPost = false
          this.chosenCustomer = []
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
      this.chosenCustomer = []
    },

    handleSelectPost(val){
      if (val.length > 0) {
        this.chosenCustomer = val
      }else{
        this.chosenCustomer = []
      }
    },

    selectCustomer(value){
      this.dataCustomerJurnal.map((item, idx) => {
        if(item.jurnal_customer_id === value){
          this.formEdit.jurnal_customer_id = value
          this.formEdit.jurnal_display_name = item.display_name
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
      this.formEdit.jurnal_display_name = ''
      this.formEdit.jurnal_customer_id = ''
      this.allCustomer[index].isActive = false
    },

    saveHandle(index) {
      this.isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/customermap'),
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

    selectCustomerFecth(value){
      this.dataCustomerFetched.map((item, idx) => {
        if(item.jurnal_customer_id === value){
          this.formEdit.jurnal_customer_id = value
          this.formEdit.jurnal_display_name = item.display_name
        }
      });
    },

    searchFecthCustomer(value){
      if(value){
        let params = {
          search_column: 'display_name',
          search_text: value
        }

        listFecthCustomer(params).then(response => {
          this.formEdit.jurnal_customer_id = ''
          this.formEdit.jurnal_display_name = ''
          let resp = response.data.data
          this.dataCustomerFetched = resp ? resp : [] 
        })
      }else{
        this.formEdit.jurnal_customer_id = ''
        this.formEdit.jurnal_display_name = ''
        this.dataCustomerFetched = []
      }
    },

    handleFetch () {
      this.loadingFetch = true
    },

    fetchJurnalCustomer(){
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
          this.fetchJurnalCustomer()
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

    handleListCustomer() {
      this.$emit('customerList')
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
    if(this.isFecth.isfetchCustomer === 0){
      this.loadCustomerJurnal()
    }
  }
}
</script>
