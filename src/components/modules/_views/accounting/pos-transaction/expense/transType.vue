<template>
	<el-dialog
	:visible.sync="show"
	:show-close="false"
	:close-on-click-modal="false"
	width="60%"
	center 
	custom-class="dialog-card-jurnal">
		<div slot="title" class="flex-container">
			<el-row :gutter="20"  style="width: 100%">
				<el-col :span="14">
					<h4 class="font-semi-bold" align="left">{{rootLang.outlay_transaction_type}}</h4>
				</el-col>
				<el-col :span="10" align="right">
					<div class="btn_save_dialog" v-if="editedType.length !== 0" >
						<el-button size="small" type="danger" @click="cancelMap">{{lang.cancel}}</el-button>
						<el-button size="small"
							type="success" @click="mapType" :disabled="loadingMap">
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
					<div v-else>
						<el-button size="small" type="info" @click="handleClose">{{lang.close}}</el-button>
					</div>
				</el-col>
			</el-row>
		</div>

		<div class="card-body">
			<div v-if="isLoading === false" class="mt-4">
				<el-table
					ref="multipleTable"
					v-loading="isLoading"
					class="product-table-max-height mobile-fix-height-unset"
					:data="dataType"
					@sort-change="changeSortTable"
					stripe>
					<el-table-column 
						v-if="editedType.length !== 0"
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
						:label="lang.name">
						<template slot-scope="scope">
							{{capitalize(scope.row.name) }}
						</template>
					</el-table-column>
					<el-table-column
						prop="id"
						:label="rootLang.account_name">
						<template slot-scope="scope">
							<el-select filterable 
								:placeholder="$lang[langId].select" 
								:value="scope.row.id"
								@input="(value) => selectAccount(value, scope.row)"
								style="width: 100%">
								<el-option
									v-for="(item, keyAccount) in dataExpense"
									:key="keyAccount"
									:label="item.account_no + ' '+ item.account_name"
									:value="item.id">
								</el-option>
							</el-select>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div v-else style="margin-top: 60px;">
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
			<div style="margin-top: 20px; margin-bottom: -55px">
				<el-select v-model="params.per_page"  @change="handleSizeChange" placeholder="Select" class="perpage" style="width: 120px">
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
					:current-page.sync="params.currentPage"
					:page-size="parseInt(params.per_page)"
					layout="total, prev, pager, next, jumper"
					:total="params.total"
					class="paginate">
				</el-pagination>
			</div>
		</div>
	</el-dialog>
</template>

<script>
import mixinAccounting from '@/mixins/mixinAccounting';
import basicComputedMixin from '@/mixins/basicComputedMixin';
import { expenseTypeList, TrxTypePost, expenseOnly} from '@/api/accounting/pos-transaction';
import Loading from 'vue-loading-overlay';
import dialogSetup from 'components/modules/_views/accounting/dialogSetup';
var moment = require('moment');

export default {
  name: 'DialogExpenseTransType',
	props: ['show'],
  mixins: [mixinAccounting, basicComputedMixin],
  components: {
    Loading,
		dialogSetup
  },

  computed: {
    token() {
      return this.$store.state.user.token
    },
    selectedStore() {
      return this.$store.getters.selectedStore
    },
  },

  mounted(){
    this.accountSetup()
    this.getLastParams()
    this.getExpense()
  },

  data() {
    return {
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
      isLoading: false,
      loadingMap: false,
      loadingPost: false,
      dataType: [],
      dataExpense: [],
      editedType: [],
      labelDate: '',
      formEdit: {
        id: '',
        debit_id: '',
        credit_id: '',
        credit_account_no: '',
        credit_account_name: ''
      },
      params: {
        start_date: moment().format('yyyy-MM-DD'),
        end_date: moment().format('yyyy-MM-DD'),
        currentPage: 1,
        per_page: 15,
        sort_column: 'id',
        sort_type: 'desc',
        page: 1,
        total: null
      }
    }
  },

  methods: {
    getLastParams() {
      if(Object.keys(this.$route.query).includes('lastParams') ===true){
        this.params = "start_date" in this.$route.query.lastParams ? this.$route.query.lastParams : this.params
        this.labelDate = this.$route.query.selectedMonth
      }else{
        this.params.account_no = null
        this.params.start_date = moment().format('YYYY-MM-DD')
        this.params.end_date = moment().format('YYYY-MM-DD')
        this.labelDate = this.$lang[this.langId].today + '\n' +
                          moment(this.params.start_date).format('DD MMM YYYY') + ' - ' +
                          moment(this.params.end_date).format('DD MMM YYYY')
      }

      this.getExpenseTrx()
    },

    getExpense() {
      expenseOnly(this.params).then(response => {
        this.dataExpense = response.data.data
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

    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      if (val.order === null) val.order = this.params.sort_type

      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.getExpenseTrx()
    },

    getExpenseTrx(){
      this.isLoading = true

      expenseTypeList(this.params).then(response => {
        this.dataType = response.data.data
        this.dataType.map(v => Object.assign(v, {isModified: false}))
        this.params.per_page = response.data.per_page
        this.params.currentPage = response.data.current_page
        this.params.total = response.data.total
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

    handleSizeChange(val) {
      this.params.page = 1
      this.params.per_page = val
      this.getExpenseTrx()
    },
    
    handleCurrentChange(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getExpenseTrx()
    },

    selectAccount (val, row){
      this.dataType.map((item, idx) => {
        if(item.type_id === row.type_id){
          item.id = val
          item.isModified = true
        }
      })

      this.editedType.map((item, idx) => {
        if(item.type_id === row.type_id){
          this.editedType.splice(idx, 1)
        }
      })

      this.editedType.push({
        type_id: row.type_id,
        id: val
      })
    },

     mapType() {
      this.loadingMap = true

      TrxTypePost(this.editedType).then(response => {
        this.result = response.data
        this.loadingMap = false
        this.editedType = []
        if (response.data.status === 200) {
          this.$message({
            message: 'Success',
            type: 'success'
          })
        }
        this.getExpenseTrx()
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

    handleClose(){
      this.$emit('close')
    },

    cancelMap(){
      this.editedType = []
      this.getExpenseTrx()
    },

    checkList(row, index){
      let disable = true;
      if(row.posted === 1){
        disable = false;
      }
      return disable;
    },
  }
}
</script>
