<template>
  <div>
    <div class="title-jurnal">
      <h4>
        <strong>{{$lang[langId].advanced_product}}
        </strong>
        <div style="float: right;" v-if="editedAdvanced.length !== 0">
          <el-button type="info" @click="cancelMap">{{lang.cancel}}</el-button>
          <el-button type="success" @click="mapProductAdvanced" :disabled="loadingMap">
            <loading
              v-if="loadingMap"
              :active="true"
              color= '#1bb4e6'
              loader="dots"
              :width="28"
              :height="10"
              backgroundColor='#ffffff'>
            </loading>
            <span v-else>
              {{lang.save}}
            </span>
          </el-button>
        </div>
        <div v-else style="float: right;">
          <el-input
            v-model="params.search"
            :placeholder="lang.product_name"
            clearable
            prefix-icon="el-icon-search"
            size="small"
            @change="loadData"
            style="max-width: 200px;">
          </el-input>
          <el-button type="primary" size="small" @click="changeProduct">{{$lang[langId].account_product}}</el-button>
        </div>
      </h4>
    </div>
    <div v-if="isLoading === false">
      <el-tag type="info" size="small" class="tag-jurnal-info mb-16 color-black" align="center">
        {{$lang[langId].jurnal_product_advance_text}}
      </el-tag>
      <el-table
        ref="multipleTable"
        :data="dataProductAdvanced"
        class="product-table-max-height mobile-fix-height-unset"
        max-height="340"
        stripe>
        <el-table-column 
          v-if="editedAdvanced.length !== 0"
          prop="isModified"
          width="30"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.isModified">
              <svg-icon type="edit"></svg-icon>
            </span>
          </template>
        </el-table-column>

        <el-table-column
          prop="name"
          :label="$lang[langId].product_groups">
          <template slot-scope="scope">
            <span>{{capitalize(scope.row.name)}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="sales_account_no"
          :label="lang.sales">
          <template slot-scope="scope">
            <el-select 
              :placeholder="$lang[langId].select"
              filterable
              :value="scope.row.sales_account_no"
              @input="(value) => selectSales(value, scope.row)"
              style="width: 100%">
              <el-option
                v-for="item in dataSales"
                :key="item.number"
                :label="item.number + ' '+ item.name"
                :value="item.number">
              </el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column
          prop="purchase_account_no"
          :label="lang.purchase">
          <template slot-scope="scope">
            <el-select 
              :placeholder="$lang[langId].select"
              filterable
              :value="scope.row.purchase_account_no"
              @input="(value) => selectPurchase(value, scope.row)"
              style="width: 100%">
              <el-option
                v-for="item in dataPurchase"
                :key="item.number"
                :label="item.number + ' '+ item.name"
                :value="item.number">
              </el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column
          prop="inventory_account_no"
          :label="lang.inventory">
          <template slot-scope="scope">
            <el-select 
              :placeholder="$lang[langId].select"
              filterable
              :value="scope.row.inventory_account_no"
              @input="(value) => selectInventory(value, scope.row)"
              style="width: 100%">
              <el-option
                v-for="item in dataInventory"
                :key="item.number"
                :label="item.number + ' '+ item.name"
                :value="item.number">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>  
      <div style="text-align: center">
        <el-pagination
          layout="total, prev, pager, next, jumper"
          @size-change="handleChangeSize"
          @current-change="handleCurrentChange"
          :total="params.total"
          :current-page.sync="params.currentPage"
          :page-size="parseInt(params.per_page)"
          class="paginate">
        </el-pagination>
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
import { baseApi } from 'src/http-common'
import axios from 'axios'
import Loading from 'vue-loading-overlay';

export default {
  name: 'ProductAdvanced',
  components: {
    Loading
  },
  props:['load'],
  data() {
    return {
      isLoading: false,
      loadingMap: false,
      dataProductAdvanced: [],
      dataSales: [],
      dataPurchase: [],
      dataInventory: [],
      editedAdvanced: [],
      params: {
        search: '',
        currentPage: 1,
        per_page: 15,
        page: 1,
        total: null
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
    load: function(newVal, oldVal) {
      this.loadData()
    }
  },

  methods: {
    loadData(){
      this.isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/productgroup'),
        headers: headers,
        params: this.params
      }).then(response => {
        this.dataProductAdvanced = response.data.data

        this.dataProductAdvanced.map(v => Object.assign(v, {isModified: false}))
        this.params.per_page = response.data.meta.per_page
        this.params.currentPage = response.data.meta.current_page
        this.params.total = response.data.meta.total
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

    handleChangeSize(val){
      this.params.page = 1
      this.params.per_page = val
      this.loadData()
    },

    handleCurrentChange(val){
      this.params.currentPage = val
      this.params.page = val
      this.loadData()
    },

    getSales(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/account/sales'),
        headers: headers
      }).then(response => {
        this.dataSales = response.data.data
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

    getPurchase(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/account/purchase'),
        headers: headers
      }).then(response => {
        this.dataPurchase = response.data.data
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

    getInventory(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/account/inventory'),
        headers: headers
      }).then(response => {
        this.dataInventory = response.data.data
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

    selectSales(val, row){
      let selected = {}
      this.dataSales.forEach((sales, idx) => {
        if(sales.number === val){
          selected = sales
        }
      })
      
      this.dataProductAdvanced.forEach((item, idx) => {
        if(item.id == row.id){
          item.sales_account_no = selected.number
          item.isModified = true

          var idxArray = this.editedAdvanced.findIndex( x => x.id === row.id );
          
          if(idxArray !== -1){
              this.editedAdvanced[idxArray].sales_account_no = selected.number
              this.editedAdvanced[idxArray].sales_account_name = selected.name
          }else{
            this.editedAdvanced.push({
              id: row.id,
              name: row.name,
              purchase_account_no: row.purchase_account_no,
              purchase_account_name: row.purchase_account_name,
              sales_account_no: selected.number,
              sales_account_name: selected.name,
              inventory_account_no: row.inventory_account_no,
              inventory_account_name: row.inventory_account_name
            })
          }          
        }
      })

    },

    selectPurchase (val, row){
      let selected = {}
      this.dataPurchase.map((purchase, idx) => {
        if(purchase.number === val){
          selected = purchase
        }
      })

      this.dataProductAdvanced.map((item, idx) => {
        if(item.id === row.id){
          item.purchase_account_no = selected.number
          item.isModified = true

          var idxArray = this.editedAdvanced.findIndex( x => x.id === row.id );
          
          if(idxArray !== -1){
              this.editedAdvanced[idxArray].purchase_account_no = selected.number
              this.editedAdvanced[idxArray].purchase_account_name = selected.name
          }else{
            this.editedAdvanced.push({
              id: row.id,
              name: row.name,
              purchase_account_no: selected.number,
              purchase_account_name: selected.name,
              sales_account_no: row.sales_account_no,
              sales_account_name: row.sales_account_name,
              inventory_account_no: row.inventory_account_no,
              inventory_account_name: row.inventory_account_name
            })
          }  
        }
      })
    },

    selectInventory (val, row){
      let selected = {}
      this.dataInventory.map((inventory, idx) => {
        if(inventory.number === val){
          selected = inventory
        }
      })

      this.dataProductAdvanced.map((item, idx) => {
        if(item.id === row.id){
          item.inventory_account_no = selected.number
          item.isModified = true
          
          var idxArray = this.editedAdvanced.findIndex( x => x.id === row.id );
          
          if(idxArray !== -1){
              this.editedAdvanced[idxArray].inventory_account_no = selected.number
              this.editedAdvanced[idxArray].inventory_account_name = selected.name
          }else{
            this.editedAdvanced.push({
              id: row.id,
              name: row.name,
              purchase_account_no: row.purchase_account_no,
              purchase_account_name: row.purchase_account_name,
              sales_account_no: row.sales_account_no,
              sales_account_name: row.sales_account_name,
              inventory_account_no: selected.number,
              inventory_account_name: selected.name
            })
          }  
        }
      })
    },

    mapProductAdvanced(){
      this.loadingMap = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/productgroup'),
        headers: headers,
        data: this.editedAdvanced
      }).then(response => {
        this.loadingMap = false
        this.editedAdvanced = []
        if (response.data.status === 200) {
          this.$message({
            message: 'Success',
            type: 'success'
          })
        }
        this.loadData()
      })
      .catch(error => {
        this.loadingMap = false
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

    cancelMap(){
      this.editedAdvanced = []
      this.loadData()
    },

    capitalize(value){
      let capitalize= '';
      if(value){
        capitalize = value[0].toUpperCase() + value.slice(1);
      }
      return capitalize;
    },

    changeProduct(){
      this.$emit('changeProduct')
    }

  },
  mounted() {
    this.loadData()
    this.getSales()
    this.getPurchase()
    this.getInventory()
  }
}
</script>
