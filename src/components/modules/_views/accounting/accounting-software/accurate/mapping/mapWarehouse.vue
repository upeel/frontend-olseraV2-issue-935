<template>
  <div>
    <div class="title-jurnal">
      <h4><strong>{{$lang[langId].warehouse}}</strong></h4>
    </div>
    <div v-if="isLoading === false">
      <el-table
        ref="multipleTable"
        :data="dataWH"
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
          prop="description"
          :label="lang.description">
          <template slot-scope="scope">
            <span>{{capitalize(scope.row.description)}}</span>
          </template>
        </el-table-column>
				<el-table-column
            prop="id"
            :label="lang.status"
            width="90"
            >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.id === selectedWH.accurate_id"
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
              <el-popconfirm v-if="scope.row.id !== parseInt(selectedWH.accurate_id)"
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
              <el-popconfirm
                v-else
                :confirm-button-text='$lang[langId].yes'
                :cancel-button-text='$lang[langId].no'
                @confirm="deleteWarehouse(scope.row)"
                icon="el-icon-circle-close"
                icon-color="red"
                :title="$lang[langId].deselect + ' ' + $lang[langId].warehouse + ' ' + capitalize(scope.row.name) + ' ?'"
              >
                <el-button slot="reference" type="text" style="color: #FF0000;">
                  <svg-icon icon-class="x-circle" stroke="#FF0000"></svg-icon>
                </el-button>
              </el-popconfirm>
            </div>
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
  name: 'MapWarehouse',
  components: {
    Loading
  },
  props:['load'],
  data() {
    return {
      isLoading: false,
      selectedWH: {id: 0, accurate_id: 0},
      dataWH: [],
      params: {
        page: 1,
        per_page: 10,
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
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/warehouse'),
        headers: headers,
        params: this.params
      }).then(response => {
        this.dataWH = response.data.data
        if(response.data.selected){
          this.selectedWH = response.data.selected
        }else{
          this.selectedWH = {id: 0, accurate_id: 0}
        }
        this.params.total = response.data.total_pages
        this.isLoading = false 
      }).catch(error => {
        this.isLoading = false 
        this.params.total = 0
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
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/warehouse/'),
        headers: headers,
        data: paramData
      }).then(response => {
        if (response.data.status === 200){
          this.selectedWH = {id: 0, accurate_id:  val.id}
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

    deleteWarehouse(val){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/warehouse/'+this.selectedWH.id),
        headers: headers
      }).then(response => {
        if (response.data.status === 200){
          this.selectedWH = {id: 0, accurate_id:  val.id}
          this.$message({
            message: this.lang[langId].success_delete,
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
    handleSizeChange(val) {
      this.params.page = 1
      this.params.per_page = val
      this.loadData()
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.params.page = val
      this.loadData()
    },
  },
  mounted() {
    this.loadData()
  }
}
</script>
