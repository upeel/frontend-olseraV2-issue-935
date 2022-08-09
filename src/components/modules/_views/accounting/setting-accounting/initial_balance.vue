<template>
  <div>
      <div class="card-body mt-20">
        <div v-if="isLoading === false">
					<el-table
						ref="multipleTable"
						class="product-table-max-height mobile-fix-height-unset"
						:data="dataInitial"
						stripe>
						<el-table-column
							prop="account_no"
							:label="$lang[langId].account_number"
							sortable>
						</el-table-column>
						<el-table-column
							:label="$lang[langId].account_name"
							sortable
							prop="account_name">
							<template slot-scope="scope">
								<span>{{ capitalize(scope.row.account_name) }}</span>
							</template>
						</el-table-column>
						<el-table-column
							:label="lang.classification"
							sortable
							prop="account_clasification">
							<template slot-scope="scope">
								<span>{{capitalize(scope.row.account_clasification)}}</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="int_amount"
							:label="$lang[langId].balance_value"
							sortable
							align="right">
							<template slot-scope="scope">
                <input-money-select-currency :withSelectCurrency="false" :prepend="selectedStore.currency_id"
                  v-model="scope.row.int_amount"
                />
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
  </div>
</template>

<script>
import { baseApi } from 'src/http-common';
import axios from 'axios';
import Loading from 'vue-loading-overlay';
import mixinAccounting from '@/mixins/mixinAccounting';
import InputMoneySelectCurrency from '@/components/InputMoneyV3';
var moment = require('moment')

export default {
  name: 'InitialBalance',
  components: {
    Loading,
    InputMoneySelectCurrency
  },
  mixins: [mixinAccounting],

  computed: {
    lang() {
      return this.$store.state.userStores.lang
    },
    token() {
      return this.$store.state.user.token
    },
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    langId() {
      return this.$store.state.userStores.langId
    },
  },

  watch: {
    dataInitial: {
      deep: true,
      immediate: true,
      handler(data) {
        this.$emit('change', this.dataInitial)
      }
    }
  },

  mounted() {
    this.getInitialBalance()
  },

  data() {
    return {
      isLoading: false,
      dataInitial: [],
      loadingSet: false,
    }
  },

  methods: {
    getInitialBalance() {
			this.isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/begining'),
        headers: headers,
        params: this.param
      }).then(response => {
          this.dataInitial = response.data.data

          this.isLoading = false
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
				this.isLoading = false
			})
    },
  }
}
</script>
