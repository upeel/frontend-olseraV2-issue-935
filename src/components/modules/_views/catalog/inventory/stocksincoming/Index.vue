<template>
  <div>
    <div class="main-content">
      <div class="table-handler-flex">
        <div style="flex-grow: 1;">
          <h4 class="main-content__title">{{ $lang[langId].list }} {{ lang.incoming_stock }}</h4>
          <p class="main-content__subtitle">{{ params.total }} {{ lang.incoming_stock }}</p>
        </div>
        <div>

          <el-button v-if="wejayafoodAccessByStore.includes(selectedStore.url_id)" slot="reference"
              icon="el-icon-setting" circle type="info"
              @click="setModule">
          </el-button>

          <button-action-authenticated
            :permission="['inventory/stockincomings', 'store']"
            icon="el-icon-upload"
            @click="importDialog = true">
            {{ lang.import }}
          </button-action-authenticated>
          <button-action-authenticated :permission="['inventory/stockincomings', 'store']" type="primary" icon="el-icon-plus" @click="addData">
            {{ lang.add }}
          </button-action-authenticated>
        </div>
      </div>

      <div class="table-handler-flex mb-16">
        <div class="mb-4" style="flex-grow: 1;">
          <el-select class="inline-form" v-model="params.per_page" @change="changePageTable" filterable :placeholder="lang.please_select" size="small">
            <el-option
              v-for="item in pages"
              :key="item"
              :value="item"
              :label="item + ' ' + lang.rows"
            />
          </el-select>
        </div>

        <div class="mb-4">
          <el-input
            class="inline-form input-search"
            clearable
            :placeholder="lang.search+' '+lang.incoming_stock_no"
            prefix-icon="el-icon-search"
            v-model="searchValue"
            @change="handleSearch" size="small">
          </el-input>
        </div>
      </div>

      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        border
        @sort-change="changeSortTable"
        @row-click="goToSinglePage">
        <el-table-column :label="$lang[langId].number" sortable="custom" prop="trans_no" width="160">
          <template slot-scope="props">
            <router-link :to="{path: '/inventory/stocksincoming/' + props.row.id}">
              {{ props.row.trans_no }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column :label="lang.supplier" sortable="custom" prop="supplier_name" width="220"></el-table-column>
        <el-table-column :label="lang.date" sortable="custom" prop="date" width="120">
          <template slot-scope="props">
            {{props.row.fdate}}
          </template>
        </el-table-column>
        <el-table-column :label="lang.notes" sortable="custom" prop="note" width="200"></el-table-column>
        <el-table-column :label="lang.status" sortable="custom" prop="status" width="120">
          <template slot-scope="props">
            <el-tag size="mini"
              v-if="props.row.status === 'D'"
              type="warning">
              {{ props.row.status_desc }}
            </el-tag>
            <el-tag size="mini"
              v-else-if="props.row.status === 'P'"
              type="success">
              {{ props.row.status_desc }}
            </el-tag>
            <el-tag size="mini"
              v-else-if="props.row.status === 'X'"
              type="danger">{{ props.row.status_desc }}
            </el-tag>
            <el-tag size="mini" v-else>
              {{ props.row.status_desc }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="lang.received_by" sortable="custom" prop="modified_by" min-width="160px"></el-table-column>
      </el-table>

      <el-pagination
        @size-change="changePageTable"
        @current-change="changeCurrentPage"
        :current-page.sync="params.currentPage"
        :page-size="params.per_page"
        layout="prev, pager, next, jumper"
        :total="params.total">
      </el-pagination>
    </div>

    <el-dialog
      :title="lang.update+lang.status"
      :visible.sync="importDialog"
      max-width="760px">
      <el-row :gutter="10">
        <el-col :md="8">
          <a
            :href="baseURL + '/olsera_stockin_import_template.csv'"
            class="btn btn-default">
            {{ lang.download_template }}
          </a>
        </el-col>
        <el-col :md="16">
          <el-card v-if="dropdownForm">
            <div slot="header" class="clearfix">
              <span>{{ lang.import_from_csv_info }}</span>
            </div>
            <vue-dropzone
              ref="dropzone"
              id="drop1"
              :options="{
                url: baseURL + 'api/' + this.selectedStore.url_id + '/admin/v1/' + this.langId + '/stockincoming/importfromcsv',
                headers: {
                  'Authorization' : 'Bearer ' + this.token.access_token,
                  'Cache-Control': null,
                },
                method: 'post',
                acceptedFiles: '.csv'
                }"
              @vdropzone-success="afterComplete"
              @vdropzone-error="failed"
            ></vue-dropzone>
            <el-button
              style="margin-top: 8px;"
              @click="removeAllFiles">
              {{ $lang[langId].remove_all_file }}
            </el-button>
          </el-card>
        </el-col>
      </el-row>
    </el-dialog>
  <!-- :title="$lang[langId].incoming_stock_adjustment" -->
    <el-dialog
        :visible.sync="settingDialog"
        :show-close="false"
        :close-on-press-escape="false"
        :before-close="handleCancel"
        append-to-body width="25%"
        custom-class="dialog-grbfd">
        <div slot="title" class="flex-container">
          <h4 class="dialog-title full-width">
            {{ $lang[langId].incoming_stock_adjustment }}
          </h4>
          <div class="btn_save_dialog full-width text-right">
            <el-button type="info" @click="handleCancel">{{ lang.cancel }}</el-button>
            <el-button :loading="loadingCustom" type="success" @click="saveModule" >{{ lang.save }}</el-button>
          </div>
        </div>


    <el-row>
      <el-col :span="50">
        <div>
          <label style="font-size: 12px">{{$lang[langId].incoming_stock_as}}</label>
        </div>
        <el-radio v-model="customIncoming.purchase_or_capital " :label="1" border size="medium">{{lang.purchase}}</el-radio>
        <el-radio v-model="customIncoming.purchase_or_capital " :label="2" border size="medium">{{$lang[langId].capital_increase}}</el-radio>
      </el-col>
      
    </el-row>
        <el-row style="line-height: 2;">
          <el-col>
            <el-divider v-if="customIncoming.purchase_or_capital === 1"></el-divider>
            <div class="biodata mb-8" v-if="customIncoming.purchase_or_capital === 1">
              <div>
                <label style="font-size: 12px">{{$lang[langId].payment_account_default}}</label>
              </div>
              <el-select 
                :placeholder="rootLang.select" 
                filterable
                v-model="customIncoming.account_id"
                class="pb-10"
                style="width: 100%">
                <el-option
                  v-for="(item, key) in dataCashBank"
                  :key="key"
                  :label="item.account_no+' '+item.account_name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>


    </el-dialog>

  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import basicComputedMixin from '@/mixins/basicComputedMixin'
import {cashBankOnly} from '@/api/accounting/pos-transaction';
export default {
  components: {
    vueDropzone: vue2Dropzone,
    tokenc: ''
  },
  mixins: [basicComputedMixin],
  data: function() {
    return {
      loading: true,
			loadingCustom: false,
      tableData: [],
      statusValue: null,
      searchValue: null,
      importDialog: false,
      settingDialog: false,
      dropdownForm: true,
      pages: [5, 10, 20],
      statusSelect: [
        {
          value: '',
          label: this.$store.state.userStores.lang.all
        },
        {
          value: 'Pending',
          label: this.$lang[this.$store.state.userStores.langId].pending
        },
        {
          value: 'Shipping',
          label: this.$lang[this.$store.state.userStores.langId].has_confirm
        },
        {
          value: 'Shipped',
          label: this.$store.state.userStores.lang.delivered
        }
      ],
      params: {
        search: null,
        total: null,
        currentPage: 1,
        sort_column: 'id',
        sort_type: 'desc',
        per_page: 10,
        page: 1
      },
      isButtonDisabled: false,
			accountModule: 0,
			customIncoming: {purchase_or_capital: 2, account_id: 0},
			dataCashBank: []
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
      this.getData()
    }
  },
  methods: {
    getData: function() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'stockincomings'),
        params: this.params,
        headers: headers
      })
        .then(response => {
          this.tableData = response.data.data
          this.params.total = response.data.meta.total
					this.accountModule = response.data.account_module
          this.loading = false
        })
        .catch(error => {
          this.loading = false
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
    changePageTable(val) {
      this.params.per_page = val
      this.getData()
    },
    handleSearch(val) {
      this.params.page = 1
      this.params.currentPage = 1
      this.params.search_text = ''
      this.params.search_column = null
      this.params.search = this.searchValue
      this.getData()
    },
    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      if (val.order === null) val.order = this.params.sort_type
      console.log(val)
      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.getData()
    },
    changeCurrentPage(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getData()
    },
    addData() {
      this.$router.push({path: '/inventory/stocksincoming/create'})
    },
    handleCancel(){
      this.settingDialog=false
    },
    // importDialog() {
    //   this.$router.push({path: '/inventory/importstockincoming'})
    // }
    afterComplete(file, response) {
      console.log(response)
      if (response.error === 0) {
        this.$notify({
          title: 'Sukses',
          message: response.data + ' Produk.'
        })
        this.importDialog = false
        this.$router.push({path: '/inventory/stocksincoming/' + response.id})
      }
    },
    failed(file, message, xhr) {
      console.log('file', file)
      console.log('message', message)
      console.log('xhr', xhr)
      this.$notify({
        type: 'error',
        title: message.error.message,
        message: message.error.error
      })
      // let errorMessage = ''
      // if (this.selectedStore.lang_code === 'id') {
      //   errorMessage = 'Gagal Menambahkan Produk'
      // } else {
      //   errorMessage = 'Add Product Failed'
      // }
      const $ = require('jquery')
      $('.dz-error-message span').text(message.error.error)
    },
    removeAllFiles() {
      this.$refs.dropzone.removeAllFiles()
    },
    goToSinglePage(row) {
      this.$router.push({path: '/inventory/stocksincoming/' + row.id})
    },
		setModule(){
      this.settingDialog = true
			this.loadingCustom = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/stockmaping'),
        headers: headers
      })
        .then(response => {
					let resp = response.data.data
					if(resp !== null){
						this.customIncoming = {purchase_or_capital: resp.purchase_or_capital, account_id: resp.account_id}
					}
					this.getCashBank()
          this.loadingCustom = false
        })
        .catch(error => {
          this.loadingCustom = false
          if (error.response.data.error.status_code !== 404) {
            this.$notify({
              type: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error
            })
          }
        })
		},

		saveModule(){
			this.loadingCustom = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

			let paramData = {purchase_or_capital: this.customIncoming.purchase_or_capital, account_id: 0}
			if(parseInt(this.customIncoming.purchase_or_capital) === 1){
				paramData = this.customIncoming
			}

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/stockmaping'),
        headers: headers,
				data: paramData
      })
        .then(response => {
					let resp = response.data.data
					if(resp !== null){
						this.customIncoming = {purchase_or_capital: resp.purchase_or_capital, account_id: resp.account_id}
					}
					this.$message({
						type: 'success',
						message: this.$lang[this.langId].success_apply
					})
          this.loadingCustom = false
          this.settingDialog = false
        })
        .catch(error => {
          this.loadingCustom = false
          if (error.response.data.error.status_code !== 404) {
            this.$notify({
              type: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error
            })
          }
        })
		},

    getCashBank() {
      cashBankOnly().then(response => {
        this.dataCashBank = response.data.data
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
    }
  },
  mounted() {
    this.getData()
  }
}
</script>
