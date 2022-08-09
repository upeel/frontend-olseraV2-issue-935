<template>
    <el-dialog
      :title="lang.import + ' ' + $lang[langId].asset"
      :visible.sync="show"
      width="60%"
      @close="cancelImport">
      <el-row :gutter="20" v-if="dropdownFormImport">
        <el-col :span="8">
          <el-form @submit.native.prevent >
            <div>
              <label style="font-size: 12px">{{$lang[langId].journal_account_name}}</label>
            </div>
            <el-form-item>
              <el-select 
                style="width: 100%"  
                filterable 
                :placeholder="$lang[langId].select"
                :loading="loadingAccount"
                v-model="importAccount.jurnal_name">
                <el-option
                  v-for="item in accountName"
                  :key="item.id"
                  :label="item.jurnal_name"
                  :value="item.jurnal_name">
                </el-option>
              </el-select>
            </el-form-item>
            <div>
              <label style="font-size: 12px">{{$lang[langId].debit_account}}</label>
            </div>
            <el-form-item>
              <el-select 
                style="width: 100%"  
                filterable 
                :placeholder="$lang[langId].select"
                :loading="loadingAccount"
                v-model="importAccount.debit_asset_account_id">
                <el-option
                  v-for="item in accountAsset"
                  :key="item.id"
                  :label="item.account_no+' '+ item.account_name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <div>
              <label style="font-size: 12px">{{$lang[langId].credit_account}}</label>
            </div>
            <el-form-item>
              <el-select 
                style="width: 100%"  
                filterable 
                :placeholder="$lang[langId].select"
                :loading="loadingAccount"
                v-model="importAccount.credit_cash_account_id">
                <el-option
                  v-for="item in accountCash"
                  :key="item.id"
                  :label="item.account_no+' '+ item.account_name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="8">
          <el-form @submit.native.prevent >
            <div>
              <label style="font-size: 12px">Depreciation debit account</label>
            </div>
            <el-form-item>
              <el-select 
                style="width: 100%"  
                filterable 
                :placeholder="$lang[langId].select"
                :loading="loadingAccount"
                v-model="importAccount.expense_account_id">
                <el-option
                  v-for="item in accountExpenses"
                  :key="item.id"
                  :label="item.account_no+' '+ item.account_name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <div>
              <label style="font-size: 12px">Depreciation crebit account</label>
            </div>
            <el-form-item>
              <el-select 
                style="width: 100%"  
                filterable 
                :placeholder="$lang[langId].select"
                :loading="loadingAccount"
                v-model="importAccount.acumulation_depreciation_account_id">
                <el-option
                  v-for="item in accountDrepreciation"
                  :key="item.id"
                  :label="item.account_no+' '+ item.account_name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="8">
          <div class="mb-8">
            <el-button :disabled="loadingTemplate" @click="downloadTemplate" :loading="loadingTemplate">
              <span>{{ lang.download_template }}</span>
            </el-button>
          </div>
          <div v-if="importAccount.debit_asset_account_id !== '' && importAccount.credit_cash_account_id !== '' && 
            importAccount.expense_account_id !== '' && importAccount.acumulation_depreciation_account_id !== '' && importAccount.jurnal_name !== ''
          ">
            <el-upload
              v-loading="loadingUploadImport"
              class="upload-demo"
              drag
              :data="importAccount"
              :action="computedUploadImportUrl"
              :headers="computedUploadImportHeaders"
              :on-success="handleUploadImportSuccess"
              :on-error="handleUploadImportError"
              :on-progress="handleUploadImportProgress"
              multiple>

              <i class="el-icon-upload"></i>
              <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
              <div class="el-upload__tip" slot="tip">
                {{ lang.import_from_csv_info }}
              </div>
            </el-upload>
          </div>
          <div v-else style="display: -webkit-flex; display: flex; align-items: center;
            justify-content: center; height: 150px; font-size: 32px; font-weight: 600; text-align: center;">
              <div>
                {{$lang[langId].grouping_equity_number}}
              </div>
          </div>
        </el-col>
      </el-row>
      <div v-else>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form @submit.native.prevent >
              <div>
                <label style="font-size: 12px">{{$lang[langId].journal_account_name}}</label>
              </div>
              <el-form-item>
                <el-select 
                  style="width: 100%"  
                  filterable 
                  :placeholder="$lang[langId].select"
                  disabled
                  v-model="importAccount.jurnal_name">
                  <el-option
                    v-for="item in accountName"
                    :key="item.id"
                    :label="item.jurnal_name"
                    :value="item.jurnal_name">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="8">
            <el-form @submit.native.prevent >
              <div>
                <label style="font-size: 12px">{{$lang[langId].debit_account}}</label>
              </div>
              <el-form-item>
                <el-select 
                  style="width: 100%"  
                  filterable 
                  :placeholder="$lang[langId].select"
                  disabled
                  v-model="importAccount.debit_asset_account_id">
                  <el-option
                    v-for="item in accountAsset"
                    :key="item.id"
                    :label="item.account_no+' '+ item.account_name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <div>
                <label style="font-size: 12px">{{$lang[langId].credit_account}}</label>
              </div>
              <el-form-item>
                <el-select 
                  style="width: 100%"  
                  filterable 
                  :placeholder="$lang[langId].select"
                  disabled
                  v-model="importAccount.credit_cash_account_id">
                  <el-option
                    v-for="item in accountCash"
                    :key="item.id"
                    :label="item.account_no+' '+ item.account_name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="8">
            <el-form @submit.native.prevent >
              <div>
                <label style="font-size: 12px">{{$lang[langId].depreciation_debit_account}}</label>
              </div>
              <el-form-item>
                <el-select 
                  style="width: 100%"  
                  filterable 
                  :placeholder="$lang[langId].select"
                  disabled
                  v-model="importAccount.expense_account_id">
                  <el-option
                    v-for="item in accountExpenses"
                    :key="item.id"
                    :label="item.account_no+' '+ item.account_name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <div>
                <label style="font-size: 12px">{{$lang[langId].depreciation_credit_account}}</label>
              </div>
              <el-form-item>
                <el-select 
                  style="width: 100%"  
                  filterable 
                  :placeholder="$lang[langId].select"
                  disabled
                  v-model="importAccount.acumulation_depreciation_account_id">
                  <el-option
                    v-for="item in accountDrepreciation"
                    :key="item.id"
                    :label="item.account_no+' '+ item.account_name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-table
          ref="multipleTable"
          class="product-table-max-height mobile-fix-height-unset"
          :data="tableImportJurnal"
          v-loading="loadingDelete"
          stripe>
          <el-table-column
            prop="transaction_date"
            :label="lang.date"
            sortable
            width="125">
            <template slot-scope="scope">
              <span>{{scope.row.fdate}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="transaction_no"
            :label="$lang[langId].asset"
            sortable
            width="90">
            <template slot-scope="scope">
              <el-button type="text" @click="showDetail(scope.row)">
                {{scope.row.assets.transaction_no}}
              </el-button>
              <el-tag size="mini"
                v-if="scope.row.assets.status === 'A'"
                type="success" align="center">
                {{$lang[langId].active}}
              </el-tag>
              <el-tag size="mini"
                v-else type="default" align="center">
                {{$lang[langId].finish}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="description"
            :label="lang.description"
            sortable>
            <template slot-scope="scope">
              <span>{{ capitalize(scope.row.assets.description) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="first_value"
            :label="$lang[langId].beginning_amount"
            sortable>
            <template slot-scope="scope">
              <div v-if="scope.row.ffirst_amount !==null">{{ scope.row.ffirst_value }}</div>
              <div v-else>IDR 0</div>
            </template>
          </el-table-column>
          <el-table-column :label="$lang[langId].action" align="center" width="70">
            <template slot-scope="scope">
              <el-popconfirm v-if="!loadingDelete"
                :confirm-button-text='$lang[langId].yes'
                :cancel-button-text='$lang[langId].no'
                confirm-button-type="info"
                icon="el-icon-info"
                icon-color="#333"
                @confirm="handleRemmoveAsset(scope.row.assets.id)"
                :title="$lang[langId].are_you_want_remove + ' '+ scope.row.assets.transaction_no + ' ?'"
              >
                <el-button slot="reference" type="text" style="color: #FF0000;">
                  <svg-icon icon-class="trash" stroke="#FF0000"></svg-icon>
                </el-button>
              </el-popconfirm>
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
    </el-dialog>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin';
import mixinAccounting from '@/mixins/mixinAccounting';
import { templateExcel, importExcel } from '@/api/accounting/asset';
import { cashCapital, assetOnly, expenses, depreciation } from '@/api/accounting/account';
import { getJurnalName } from '@/api/accounting/jurnalName';
import Loading from 'vue-loading-overlay';
import axios from 'axios'
import {baseApi} from 'src/http-common'
export default {
  name: 'dialogImportAsset',
  props: ['show'],
  mixins: [basicComputedMixin, mixinAccounting],

  computed: {
    computedUploadImportUrl() {
      const url = baseApi(this.selectedStore.url_id, this.langId, 'account/jurnal/importfromcsv')
      return url
    },
    computedUploadImportHeaders() {
      return {
        'authorization' : 'Bearer ' + this.token.access_token
      }
    },
  },

  components: {
    Loading
  },

  data() {
    return {
      loadingAccount: false,
      loadingTemplate: false,
      loadingUploadImport: false,
      loadingDelete: false,
      tableImport: false,
      btnProsesImport: true,
      dropdownFormImport: true,
      fileImportConfirm: '',
      tableImportJurnal: [],

      importAccount: {
        debit_asset_account_id: '',
        credit_cash_account_id: '',
        expense_account_id: '',
        acumulation_depreciation_account_id: '',
        jurnal_name: ''
      },
      accountName: [],
      accountCash: [],
      accountAsset: [],
      accountExpenses: [],
      accountDrepreciation: []
    }
  },

  mounted() {},
  
  methods: {

		downloadTemplate(){
			this.loadingTemplate = true
			templateExcel().then(response => {
				const fileName = 'templateImportAsset.csv'
        var rrows = [
            ["date","asset_name","revenue","residual_value","tenor","tenor_unit"],
            ["06/28/2022","laptop 1","1000000","0","1","bulan"],
            ["06/28/2022","laptop 2","124124.14","0","1","bulan"]
        ];
        var csvData = rrows.map(e => e.join(",")).join("\n");
        var BOM = "\uFEFF";
        var csvData = BOM + csvData;
        var blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });

        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        this.loadingTemplate = false
        }).catch((error, xhr) => {
          this.loadingTemplate = false
        })
		},

    handleUploadImportProgress() {
      this.loadingUploadImport = true
    },

    handleUploadImportSuccess(response) {
      console.log('adf', response.data)
      this.loadingUploadImport = false
      if (response.error === 0) {
        if (response.unready_import !== 0) {
          this.btnProsesImport = true
        } else {
          this.btnProsesImport = false
        }
        this.dropdownFormImport = false
        this.tableImportJurnal = response.data
        this.$message({
          type: 'success',
          message: response.data.data.message
        })
        // this.totalRow = response.row
        this.errorImport = response.unready_import
        this.tableImport = true
        this.fileImportConfirm = response.file_confirmed
      }
    },

    handleUploadImportError(error, file) {
      const errorJson = JSON.parse(error.message)
      this.loadingUploadImport = false
      this.$notify({
        type: 'error',
        title: errorJson.error.message,
        message: errorJson.error.error
      })
    },

    getAccount(){
      this.loadingAccount = true
      cashCapital().then(response => {
        this.accountCash = response.data.data
      })

      assetOnly().then(response => {
        this.accountAsset = response.data.data
      })

      expenses().then(response => {
        this.accountExpenses = response.data.data
      })

      depreciation().then(response => {
        this.accountDrepreciation = response.data.data
      })

      getJurnalName().then(response => {
        this.accountName = response.data.data
      })

      this.loadingAccount = false
    },

    cancelImport() {
      this.tableImportJurnal = []
      this.fileImportConfirm = ''
      this.dropdownFormImport = true
      this.tableImport = false
      this.$emit('close')
    },

    handleRemmoveAsset(id) {
      this.loadingDelete = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/asset/' + id),
        headers: headers,
      }).then(response => {
        this.$message({
          type: 'success',
          message: response.data.data.message
        })
        this.tableImportJurnal.map((i, idx) => {
          if (i.assets.id === id) {
            this.tableImportJurnal.splice(idx, 1)
          }
        })
        this.loadingDelete = false
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

    tableRowClassName({row, rowIndex, props}) {
      if (row.error !== null) {
        return 'warning-row'
      }
      return ''
    },
  }
}

</script>
