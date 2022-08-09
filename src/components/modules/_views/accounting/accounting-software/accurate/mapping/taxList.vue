<template>
  <div>
    <div class="title-jurnal">
      <h4><strong>{{$lang[langId].tax_list}}</strong>
        <div style="float: right">

        </div>
      </h4>
    </div>
    <div v-if="isLoading === false">
      <el-table
        ref="multipleTable"
        :data="dataTax"
        v-loading="isLoading"
        class="product-table-max-height mobile-fix-height-unset"
        max-height="340"
        stripe>
        <el-table-column
          prop="id"
          :label="lang.code">
        </el-table-column>
        <el-table-column
          prop="taxType"
          :label="lang.tax_name">
          <template slot-scope="scope">
            <span>{{capitalize(scope.row.taxType)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          :label="lang.description">
          <template slot-scope="scope">
            {{scope.row.description}}
          </template>
        </el-table-column>
        <el-table-column
          prop="rate"
          :label="lang.tax_percentage"
          align="right">
          <template slot-scope="scope">
            <span>{{scope.row.rate}} %</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="action">
          <template slot-scope="scope">
            <div style="float: right">
              <el-popconfirm
                v-show="selectedTax.id === scope.row.id"
                :confirm-button-text='$lang[langId].yes'
                :cancel-button-text='$lang[langId].no'
                @confirm="handleRemoveTax(scope.row)"
                icon="el-icon-info"
                icon-color="red"
                :title="$lang[langId].cancel_use + ' ' + capitalize(scope.row.taxInfo) + ' ?'"
              >
                <el-button slot="reference" type="danger" size="mini">
                  {{$lang[langId].cancel_use}}
                </el-button>
              </el-popconfirm>
              <el-popconfirm
                v-show="selectedTax.id !== scope.row.id"
                :confirm-button-text='$lang[langId].yes'
                :cancel-button-text='$lang[langId].no'
                @confirm="postData(scope.row)"
                icon="el-icon-info"
                icon-color="success"
                :title="$lang[langId].use + ' ' + capitalize(scope.row.taxInfo) + ' ?'"
              >
                <el-button slot="reference" type="primary" size="mini">
                  {{$lang[langId].use}}
                </el-button>
              </el-popconfirm>
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
  name: 'TaxList',
  components: {
    Loading
  },
  props:['load'],
  data() {
    return {
      isLoading: false,
      loadingPost: false,
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
      dataTax: [],
      selectedTax: {id: 0},
      clearMap: "",
      params: {
        sort_column: '',
        sort_type: '',
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
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/tax'),
        headers: headers,
        params: this.params
      }).then(response => {
        this.dataTax = response.data.data
        if(response.data.selected){
          this.selectedTax = response.data.selected
        }else{
          this.selectedTax = {id: 0}
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

    postData(row){
      this.isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/tax'),
        headers: headers,
        params: row
      }).then(response => {
        this.$message({
          type: 'success',
          message: this.$lang[this.langId].success_posting
        })
        this.loadData()
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

    handleRemoveTax(val){
      this.isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let id = val.id
      let allTax = this.dataTax
      let removeIndex = []

      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/tax/' + id),
        headers: headers,
      }).then(response => {
        if (response.data.status === 200){
          this.loadData()
          this.$message({
            message: 'Success',
            type: 'success'
          })
        } else {
           this.$message({
            message: '',
            type: 'success'
          })
        }
        this.isLoading = false
      }).catch(error => {
        this.loadingDelete = false
        this.dialogDeleteTax = false
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
  }
}
</script>
