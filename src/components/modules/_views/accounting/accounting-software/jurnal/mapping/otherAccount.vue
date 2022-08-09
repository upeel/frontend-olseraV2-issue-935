<template>
  <div>
    <div class="title-jurnal">
      <h4><strong>{{$lang[langId].other_account}} ({{dataOtherAccount.length}})</strong>
        <div style="float: right;" v-if="editedOther.length !== 0">
          <el-button type="info" @click="cancelMap">{{lang.cancel}}</el-button>
          <el-button type="success" @click="mapOther" :disabled="loadingMap">
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
        <div v-else class="divClearMap" :class="clearMap">
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
          v-if="editedOther.length !== 0"
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
          prop="description"
          :label="$lang[langId].account_name">
          <template slot-scope="scope">
            <span>{{capitalize(scope.row.description)}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="jurnal_account_name"
          :label="$lang[langId].account_jurnal">
          <template slot-scope="scope">
            <el-select 
              :placeholder="$lang[langId].select" 
              filterable
              :value="scope.row.jurnal_account_name"
              @input="(value) => selectAccount(value, scope.row)"
              style="width: 100%">
              <el-option
                v-for="item in dataAccount"
                :key="item.name"
                :label="item.number + ' '+ item.name"
                :value="item.name">
              </el-option>
            </el-select>
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
      loadingMap: false,
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
      editedOther: [],
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
    load: function(newVal, oldVal) {
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
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/columnmap'),
        headers: headers,
        params: this.params
      }).then(response => {
        this.dataOtherAccount = response.data.data
        let unmapped = 0;
        this.dataOtherAccount.map(row => {
          if(row.jurnal_account_name === null){
            unmapped += 1
          } 
          this.dataOtherAccount[idx].isModified = false
        })

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

			let url = 'exjurnal/account'
			if(this.$route.query.typeJurnal === '1'){
				url = 'exjurnal/account/revenue'
			}

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, url),
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

    selectAccount (val, row){
      this.dataOtherAccount.map((item, idx) => {
        if(item.id === row.id){
          item.jurnal_account_name = val
          item.isModified = true
        }
      })

      this.editedOther.map((item, idx) => {
        if(item.id === row.id){
          this.editedOther.splice(idx, 1)
        }
      })

      this.editedOther.push({
        id: row.id,
        // tablemap: row.tablemap,
        // columnmap: row.columnmap,
        jurnal_account_name: val,
      })
    },

    mapOther(){
      this.loadingMap = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/columnmap'),
        headers: headers,
        data: this.editedOther
      }).then(response => {
        this.loadingMap = false
        this.editedOther = []
        if (response.data.status === 200) {
          this.$message({
            message: 'Success',
            type: 'success'
          })
        }
        this.$emit('changePostStatus', response.data.buttonPostStatus)
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
      this.editedOther = []
      this.loadData()
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
