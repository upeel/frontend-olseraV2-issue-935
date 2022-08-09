<template>
  <div>
    <div class="title-jurnal">
      <h4><strong>{{$lang[langId].choose_branches}}</strong></h4>
    </div>
    <div v-if="isLoading === false">
      <el-table
        ref="multipleTable"
        :data="dataBranch"
        v-loading="isLoading"
        class="product-table-max-height mobile-fix-height-unset"
        max-height="340"
        stripe>
        <el-table-column
          prop="name"
          :label="lang.name">
          <template slot-scope="scope">
            <span>{{capitalize(scope.row.name)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="suspended"
          :label="$lang[langId].suspended">
          <template slot-scope="scope">
            <span>{{scope.row.suspended ? $lang[langId].yes : $lang[langId].no}}</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="id"
            :label="lang.status"
            width="90"
            >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.id === selectedBranch.accurate_branch_id"
                type="success" size="mini" effect="dark"
                disable-transitions>{{capitalize(lang.used)}}
              </el-tag>
            </template>
        </el-table-column>
        <el-table-column
          prop="action"
          width="60">
          <template slot-scope="scope">
            <div style="float: right">
              <el-popconfirm v-if="scope.row.id !== selectedBranch.accurate_branch_id"
                :confirm-button-text='$lang[langId].yes'
                :cancel-button-text='$lang[langId].no'
                @confirm="useWarehouse(scope.row)"
                icon="el-icon-circle-check"
                icon-color="green"
                :title="$lang[langId].use + ' ' + $lang[langId].warehouse + ' ' + capitalize(scope.row.name) + ' ?'"
              >
                <el-button slot="reference" type="text" style="color: #67C23A;">
                  <svg-icon icon-class="check-circle" stroke="#67C23A"></svg-icon>
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
  name: 'SelectBranch',
  components: {
    Loading
  },
  props:['load'],
  data() {
    return {
      isLoading: false,
      selectedBranch: {accurate_branch_id: 0, accurate_branch_id: 0},
      dataBranch: [],
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

    },
    load: function(newVal, oldVal){
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
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/branch'),
        headers: headers
      }).then(response => {
        this.dataBranch = response.data.listBranch
        if(response.data.selectedBranch){
          this.selectedBranch = response.data.selectedBranch
        }else{
          this.selectedBranch = {accurate_branch_id: 0, accurate_branch_name: 0}
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

    useWarehouse(val){
      this.isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let paramData = {
        id : val.id,
        name : val.name
      }

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/branch'),
        headers: headers,
        data: paramData
      }).then(response => {
        if (response.data.status === 200){
					let resp = response.data
          this.selectedBranch = {accurate_branch_id: parseInt(resp.data.id), accurate_branch_name: resp.data.name}
          this.$message({
            message: 'Success',
            type: 'success'
          })
        }
        this.isLoading = false
      }).catch(error => {
        this.loadingDelete = false
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
