<template>
  <div>
    <div class="title-jurnal">
      <h4><strong>{{$lang[langId].other_account}} ({{dataOtherAccount.length}})</strong>
        <div class="divClearMap" :class="clearMap">
          <i class="el-icon-check"></i>
        </div>
      </h4>
    </div>
    <div v-if="isLoading === false">
      <el-table
        ref="multipleTable"
        :data="dataOtherAccount"
        class="product-table-max-height mobile-fix-height-unset"
        max-height="340"
        stripe>

        <el-table-column
          prop="description"
          :label="$lang[langId].account_name">
          <template slot-scope="scope">
            <span style="word-break: break-word;">{{capitalize(scope.row.description)}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="jurnal_product_name"
          :label="$lang[langId].jurnal_product_name">
          <template slot-scope="scope">
            <span style="word-break: break-word;">{{capitalize(scope.row.jurnal_product_name)}}</span>
          </template>
        </el-table-column>


        <el-table-column
          prop="jurnal_account_name"
          :label="$lang[langId].account_jurnal"
          >
          <template slot-scope="scope">
            <el-select v-if="scope.row.isActive"
              :placeholder="$lang[langId].select" 
              filterable
              :value="formEdited.number"
              @input="(value) => selectAccount(value, scope.row, scope.$index)"
              style="width: 100%">
              <el-option
                v-for="item in dataAccount"
                :key="item.name"
                :label="item.number + ' '+ item.name"
                :value="item.number">
              </el-option>
            </el-select>
            <span style="word-break: break-word;" v-else>
              {{scope.row.jurnal_account_number ? scope.row.jurnal_account_number : ''}}
               - 
              {{scope.row.jurnal_account_name ? scope.row.jurnal_account_name : ''}}  
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="$lang[langId].action" width="150" align="right">
          <template slot-scope="scope">
            <div v-if="!scope.row.isPOST">
              <el-dropdown trigger="click" v-if="scope.row.isActive === false">
                <el-button type="text" icon="el-icon-more" style="color:#909399" :disabled="inEdited"></el-button>
                <el-dropdown-menu style="background-color: #F2F2F2;">
                  <el-dropdown-item style="padding: 0px">
                    <el-button type="text" class="accounting-dropBtn" @click="postShow(scope.$index, scope.row)">
                      <svg-icon icon-class="cloud-upload"></svg-icon>
                      {{lang.post}}
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item style="padding: 0px" v-show="scope.row.jurnal_posted !== 0">
                    <el-button class="accounting-dropBtn" type="text" @click="mapShow(scope.$index, scope.row)">
                      <svg-icon type="edit"></svg-icon>
                      {{lang.update}}
                    </el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button class="cancel-button" type="text" v-if="scope.row.isActive" @click="cancelHandle(scope.$index, scope.row)" style="color: rgb(255, 0, 0);">
                <svg-icon type="cancel-edit"></svg-icon>
                {{ lang.cancel }}
              </el-button>
              <el-button class="save-button" type="text" v-if="scope.row.isActive && scope.row.action === 'post'" @click="postHandle(scope.$index)">
                <svg-icon type="cloud-upload"></svg-icon>
                {{lang.post}}
              </el-button>
              <el-button class="save-button" type="text" 
              :disabled="formEdited.jurnal_account_id === ''"
              v-if="scope.row.isActive && scope.row.action === 'map'"
              @click="mapHandle(scope.$index)">
                <svg-icon type="edit"></svg-icon>
                {{lang.update}}
              </el-button>
            </div>
            <div v-else>
              <loading
                :active="true"
                color= '#1bb4e6'
                loader="dots"
                :width="28"
                :height="10"
                backgroundColor='#ffffff'>
              </loading>
            </div>
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

export default {
  name: 'OtherAccount',
  components: {
    Loading
  },
  props:['load'],
  data() {
    return {
      isLoading: false,
      inEdited: false,
      itemPage: [
        {
          value: '15',
          label: '15 item'
        },{
          value: '25',
          label: '25 item'
        },{
          value: '50',
          label: '50 item'
        },{
          value: '100',
          label: '100 item'
        }
      ],
      filter: [
        {
          value: '',
          label: this.$store.state.userStores.lang.all
        },{
          value: 'account_no',
          label: this.$lang[this.$store.state.userStores.langId].account_number
        },{
          value: 'account_name',
          label: this.$lang[this.$store.state.userStores.langId].account_name
        },{
          value: 'jurnal_account_name',
          label: this.$lang[this.$store.state.userStores.langId].account_jurnal
        }
      ],
      dataOtherAccount: [],
      dataAccount: [],
      clearMap: "",
      params: {
        sort_column: '',
        sort_type: '',
      },
      formEdited: {}
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
    },
    load: function(newVal, oldVal){
      this.loadData()
    }
  },
  methods: {

    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      if (val.order === null) val.order = this.params.sort_type

      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.loadData()
    },

    loadData(){
      this.isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/columnmap/product'),
        headers: headers,
        params: this.params
      }).then(response => {
        this.dataOtherAccount = response.data.data.map(v => ({...v, isActive: false, action: '', isPOST: false}))
        let unmapped = 0;
        this.dataOtherAccount.map(row => {
          if(row.jurnal_account_name === null){
            unmapped += 1
          }}
        )

        if(unmapped === 0){
          this.clearMap = 'clear'
        }
        this.isLoading = false 
      }).catch(error => {
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
      })
    },
    
    getAccount(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/account/revenue'),
        headers: headers
      }).then(response => {
        this.dataAccount = response.data.data
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

    postShow (idx, row){
      this.formEdited = {
        id: row.id,
        number: row.jurnal_account_number,
        name: row.jurnal_account_name
      }
      this.dataOtherAccount[idx].isActive = true
      this.dataOtherAccount[idx].isLoading = true
      this.dataOtherAccount[idx].action = 'post'
      this.inEdited = true
    },

    mapShow (idx, row){
      this.formEdited = {
        id: row.id,
        number: row.jurnal_account_number,
        name: row.jurnal_account_number,
        jurnal_account_id: ''
      }
      this.dataOtherAccount[idx].isActive = true
      this.dataOtherAccount[idx].action = 'map'
      this.inEdited = true
    },

    selectAccount (val, row, idx){
      if(row.action === 'post'){
        this.dataAccount.map(item => {
          if(item.number === val){
            this.formEdited = {
              id: row.id,
              number: item.number,
              name: item.name
            }
          }
        })
      }
      if(row.action === 'map'){
        this.dataAccount.map(item => {
          if(item.number === val){
            this.formEdited = {
              id: row.id,
              number: item.number,
              name: item.name,
              jurnal_account_id: item.id
            }
          }
        })
      }
    },

    cancelHandle(idx){
      this.dataOtherAccount[idx].isActive = false
      this.dataOtherAccount[idx].isPOST = false
      this.dataOtherAccount[idx].action = ''
      this.inEdited = false
      this.formEdited = {}
    },

    postHandle(idx){
      this.dataOtherAccount[idx].isPOST = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/product/other'),
        headers: headers,
        data: this.formEdited
      }).then(response => {
        this.dataOtherAccount[idx].jurnal_account_number = this.formEdited.number
        this.dataOtherAccount[idx].jurnal_account_name = this.formEdited.name
        this.dataOtherAccount[idx].jurnal_product_name = response.data.data.jurnal_product_name
        this.dataOtherAccount[idx].isActive = false
        this.dataOtherAccount[idx].isPOST = false
        this.dataOtherAccount[idx].action = ''
        this.formEdited = {}
        this.inEdited = false

        if (response.data.status === 200) {
          this.$message({
            message: 'Success',
            type: 'success'
          })
        }
      })
      .catch(error => {
        this.dataOtherAccount[idx].isPOST = false
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

    mapHandle(idx){
      this.dataOtherAccount[idx].isPOST = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/product/other'),
        headers: headers,
        data: this.formEdited
      }).then(response => {
        this.dataOtherAccount[idx].jurnal_account_number = this.formEdited.number
        this.dataOtherAccount[idx].jurnal_account_name = this.formEdited.name
        this.dataOtherAccount[idx].jurnal_product_name = response.data.data.jurnal_product_name
        this.dataOtherAccount[idx].isActive = false
        this.dataOtherAccount[idx].isPOST = false
        this.dataOtherAccount[idx].action = ''
        this.formEdited = {}
        this.inEdited = false

        if (response.data.status === 200) {
          this.$message({
            message: 'Success',
            type: 'success'
          })
        }
      })
      .catch(error => {
        this.dataOtherAccount[idx].isPOST = false
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

    capitalize(value){
      let capitalize= '';
      if(value){
        capitalize = value[0].toUpperCase() + value.slice(1);
      }
      return capitalize;
    },

  },
  mounted() {
    this.loadData()
    this.getAccount()
  }
}
</script>
