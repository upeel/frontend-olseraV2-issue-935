<template>
    <div class="content-wrapper">
      <section class="content-accounting">
        <el-card class="box-card pos-relative">
          <div class="card-body">
            <div class="inventory-status"  :class="classBasedOnStatus">
              <template v-if="data.asset_status  === 'Aktif' || data.asset_status === 'Active'">
                <span align="center"><i class="el-icon-document"></i><br> {{data.asset_status}}</span>
              </template>
              <template v-if="data.asset_status === 'Selesai' || data.asset_status === 'Finish'">
                <span align="center"><i class="el-icon-circle-check"></i><br>{{data.asset_status}}</span>
              </template>
            </div>
            <div class="row with-padding-left">
              <div class="col-md-9">
                  <small style="color: #ccc;">{{$lang[langId].depreciation_asset}}</small>
                  <h4 v-if="!data.description">-</h4>
                  <h4 v-else>{{ capitalize(data.description) }}</h4>
              </div>
              <div class="col-md-3 text-right">
                <el-button icon="el-icon-back" size="small" type="success" plain @click="backHandle">{{ lang.back }}</el-button>
              </div>
            </div>
          </div>
        </el-card>
        <el-card class="box-card">
          <div class="row table-handler-flex">
            <div class="col-xs-12 col-sm-10 col-md-10 col-lg-10 text-left">
              <div class="visible-lg visible-md visible-sm text-left inline">
                <el-select :placeholder="$lang[langId].select" v-model="params.search_column" @change="selectFilter">
                  <el-option
                    v-for="item in filter"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-date-picker
                  v-if="params.search_column === 'transaction_date'"
                  v-model="params.search_text"
                  type="date"
                  format="dd MMM yyyy"
                  @change="handleSearch"
                  :placeholder="$lang[langId].pick_a_day">
                </el-date-picker>
                <el-input
                  v-if="params.search_column === 'transaction_no'"
                  class="inline-form input-search"
                  clearable
                  :placeholder="lang.search+' '+ lang.transaction_no"
                  prefix-icon="el-icon-search"
                  v-model="params.search_text"
                  @change="handleSearch">
                </el-input>
              </div>
              <div class="visible-xs text-center">
                <el-select :placeholder="$lang[langId].select" v-model="params.search_column" @change="selectFilter" style="width: 100%;">
                  <el-option
                    v-for="item in filter"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </div>

            <div class="col-xs-12 visible-xs text-center" style="margin-top: 10px">
              <el-date-picker
                v-if="params.search_column === 'transaction_date'"
                v-model="params.search_text"
                type="date"
                format="dd MMM yyyy"
                @change="handleSearch"
                :placeholder="$lang[langId].pick_a_day"
                style="width: 100%;">
              </el-date-picker>
              <el-input
                v-if="params.search_column === 'transaction_no'"
                clearable
                :placeholder="lang.search+' '+lang.transaction_no"
                prefix-icon="el-icon-search"
                v-model="params.search_text"
                @change="handleSearch" 
                style="width: 100%;"
                size="small">
              </el-input>
            </div>
          </div>

          <div style="margin-top: 24px">
            <el-table
              ref="multipleTable"
              :data="dataDetail"
              v-loading='isLoadingData'
              class="product-table-max-height mobile-fix-height-unset"
              @sort-change="changeSortTable"
              stripe>
              <el-table-column
                prop="transaction_date"
                :label="lang.date"
                sortable
                width="180">
                <template slot-scope="scope">
                  <span>{{scope.row.ftransaction_date}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="transaction_no"
                :label="lang.transaction_no"
                width="240"
                sortable>
              </el-table-column>
              <el-table-column
                prop="description"
                :label="lang.description">
                <template slot-scope="scope">
                  <span>{{capitalize(scope.row.description)}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="int_depreciation"
                :label=" lang.amount + ' (' + selectedStore.currency_id + ')'"
                align="right">
                <template slot-scope="scope">
                  <div v-if="scope.row.fdepreciation !== null">{{ scope.row.fdepreciation }}</div>
                  <div v-else>{{selectedStore.currency_id}} 0</div>
                </template>
              </el-table-column>
              <el-table-column :label="$lang[langId].action" align="center" width="130">
                <template slot-scope="scope">
                  <el-dropdown trigger="click" style="padding: inherit">
                    <el-button type="text" icon="el-icon-more" style="color:#909399"></el-button>
                    <el-dropdown-menu slot="dropdown" style="background-color: #F2F2F2;">
                      <el-dropdown-item style="padding: 0px">
                        <el-button type="text" class="accounting-dropBtn" @click="showPairDialog(scope.row)" style="color: #000000">
                          <svg-icon icon-class="arrow-couple"></svg-icon>
                          {{ $lang[langId].jurnal_pair }}
                        </el-button>
                      </el-dropdown-item>
                      <el-dropdown-item style="padding: 0px">
                        <el-button type="text" class="accounting-dropBtn" style="color: #FF0000;" @click="showDeleteDialog(scope.row)">
                          <svg-icon icon-class="trash" stroke="#FF0000"></svg-icon>
                          {{ $lang[langId].delete }}
                        </el-button>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>  
            <div style="margin-top: 20px; margin-bottom: -55px">
              <el-select :placeholder="$lang[langId].select" v-model="params.per_page"  @change="handleSizeChange" class="perpage" style="width: 120px">
                <el-option
                  v-for="item in itemPage"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div style="text-align: center">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="params.current_page"
                :page-size="parseInt(params.per_page)"
                layout="total, prev, pager, next, jumper"
                :total="params.total"
                class="paginate">
              </el-pagination>
            </div>
          </div>
        </el-card>
      </section>

      <el-dialog 
        :title="lang.notif_warn" 
        :visible.sync="dialogDelete" 
        width="50%" center 
        :close-on-click-modal="false" 
        :show-close="false">
        <div class="text-center">
          <p>{{ $lang[langId].are_you_want_remove }} {{ $lang[langId].depreciation_asset }} </p>
          <p style="font-weight: bold;">{{ deleteData.transaction_no }}
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelDeleteDialog">{{ lang.cancel }}</el-button>
          <el-button :disabled="loading" type="danger" @click="handleDelete">{{ lang.remove }}</el-button>
        </span>
      </el-dialog>
      <dialog-jurnal-pair
        :id="paramsPair.transaction_id"
        :no="paramsPair.transaction_no"
        :name="paramsPair.transaction_name"
        :show="dialogPair"
        @close="dialogPair = false"
      />
    </div>
</template>

<script>
import axios from 'axios';
import {baseApi} from 'src/http-common';
import DialogJurnalPair from 'components/modules/_views/accounting/DialogJurnalPair';
import mixinAccounting from '@/mixins/mixinAccounting';
const moment = require('moment')

export default {
  data() {
    return {
      loading: false,
      isLoadingData: false,
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
          value: 'transaction_no',
          label: this.$store.state.userStores.lang.transaction_no
        },{
          value: 'transaction_date',
          label: this.$store.state.userStores.lang.transaction_date
        }
      ],
      id: '',
      data: '',
      dataDetail: [],
      deleteData: {},
      dialogDelete: false,
      dialogPair: false,
      params: {
        id: this.$route.query.id,
        current_page: 1,
        per_page: 15,
        sort_column: 'transaction_date',
        sort_type: 'desc',
        page: 1,
        total: null
      },
      paramsPair: {
        transaction_id: '',
        transaction_no: '',
        transaction_name: ''
      }
    }
  },
  components: {
    DialogJurnalPair
  },
  
  mixins: [mixinAccounting],
  
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
    },
    classBasedOnStatus() {
      let className = ''
      if (this.data.asset_status === 'Aktif' || this.data.asset_status === 'Active') {
        className = 'posted'
      } else if (this.data.asset_status === 'Selesai' || this.data.asset_status === 'Finish') {
        className = 'partial'
      }
      return className
    },
    userRole() {
      const selectedStore = this.$store.getters.selectedStore
      return {
        role_id: selectedStore.role_id,
        role_name: selectedStore.role_name,
        is_pos_only: selectedStore.is_pos_only,
        is_mobile: selectedStore.is_mobile
      }
    }
  },
  methods: {
    selectFilter(val) {
      if(val){
        this.params = {
          search_column: val,
          search_text: '',
          id: this.$route.query.id,
          current_page: 1,
          per_page: 15,
          page: 1,
          total: null
        }
      } else {
        this.params = {
          sort_column: 'transaction_date',
          sort_type: 'desc',
          id: this.$route.query.id,
          current_page: 1,
          per_page: 15,
          sort_column: 'transaction_date',
          sort_type: 'desc',
          page: 1,
          total: null
        }
        this.loadData()
      }
    },

    handleSearch(val) {
        if(this.params.search_column === 'transaction_date'){
          if(val !== null){
            this.params.search_text = moment(val).format('YYYY-MM-DD')
          } else {
            this.params.search_column = ''
            this.params.search_text = ''
          }
        } else {
          this.params.search_text = val
        }
        this.params.page = 1
        if(this.params.search_column === '' || this.params.search_text === ''){
          this.params = {
            sort_column: 'transaction_date',
            sort_type: 'desc',
            id: this.$route.query.id,
            current_page: 1,
            per_page: 15,
            sort_column: 'transaction_date',
            sort_type: 'desc',
            page: 1,
            total: null
          }
        }
        this.loadData()
    },

    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      if (val.order === null) val.order = this.params.sort_type

      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.loadData()
    },

    handleSizeChange(val) {
      this.params.page = 1
      this.params.per_page = val
      this.loadData()
    },
    
    handleCurrentChange(val, row) {
      this.params.currentPage = val
      this.params.page = val
      this.loadData()
    },

    loadData(){
      this.isLoadingData = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      this.id = this.id !== '' ? this.id : this.$route.query.id

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/depreciation/' + this.id),
        headers: headers,
        params: {
          search_column: this.params.search_column,
          search_text: this.params.search_text,
          currentPage: this.params.current_page,
          per_page: this.params.per_page,
          page: this.params.page,
          total: this.params.total,
          sort_column: this.params.sort_column,
          sort_type: this.params.sort_type 
        }
      }).then(response => {
        this.data = Object.keys(this.$route.query).includes('data') === true ? this.$route.query.data : this.data 
        this.dataDetail = response.data.data
        this.params.id = this.$route.query.id
        this.params.per_page = response.data.meta.per_page
        this.params.current_page = response.data.meta.current_page
        this.params.total = response.data.meta.total
        this.isLoadingData = false
      }).catch(error => {
        this.data = Object.keys(this.$route.query).includes('data') === true ? this.$route.query.data : this.data 
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
        this.isLoadingData = false
      })
    },

    showDeleteDialog(row) {
      this.deleteData = row
      this.dialogDelete = true
    },

    cancelDeleteDialog() {
      this.dialogDelete = false
      this.deleteData = {}
    },

    handleDelete(){
      this.loading = true
      this.dialogDelete = false
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let id = this.deleteData.id

      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/depreciation/' + id),
        headers: headers
      }).then(response => {
        this.deleteData = {}
        this.loading = false
        this.dataDetail = []
        this.$message({
          message: response.data.data.message,
          type: 'success'
        })
        this.loadData()
      }).catch(error => {
        this.dialogDelete = false
        this.loading = false
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

    showPairDialog(row){
      this.paramsPair = {
        transaction_id: row.transaction_id,
        transaction_no: row.transaction_no,
        transaction_name: row.transaction_name,
      }
      this.dialogPair = true
    },

    backHandle() {
      let lastParams = this.$route.query.lastParams
      this.$router.push({name: 'Asset', query: {lastParams: lastParams}})
    },

  },
  mounted() {
    this.loadData()
  }
}
</script>
